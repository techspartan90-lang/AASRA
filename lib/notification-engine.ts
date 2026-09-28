/**
 * PHASE 16: NOTIFICATION SYSTEM ENGINE
 * 
 * Supports:
 * - Channels: SMS, IVRS, In-App, Email, Dashboard Notifications
 * - Categories:
 *   1. check_in_reminder
 *   2. follow_up_reminder
 *   3. alert
 *   4. appointment
 *   5. consent_update
 *   6. privacy_notification
 * 
 * Key Principles:
 * - Anti-Stigmatizing Preview Masking: Never send sensitive or clinical details through lock-screen or SMS previews.
 *   Example: "Your suicide risk score has increased" -> "You have an important support update. Please open Manas Suraksha."
 * - Survivor Preference Sovereignty: Non-critical notifications can be customized or opted-out.
 * - Statutory Protection Floor: Critical safety alerts remain active for life protection.
 * - Cryptographic Notification Audit Trail: Immutable logging with SHA-256 hash chains.
 */

import crypto from 'node:crypto';

export type NotificationChannel = 'sms' | 'ivrs' | 'in_app' | 'email' | 'dashboard';

export type NotificationCategory =
  | 'check_in_reminder'
  | 'follow_up_reminder'
  | 'alert'
  | 'appointment'
  | 'consent_update'
  | 'privacy_notification';

export interface CategoryPreference {
  enabled: boolean;
  isCritical: boolean; // If true, cannot be completely disabled (Statutory protection floor)
  allowedChannels: NotificationChannel[];
  frequency?: 'daily' | 'alternate_days' | 'weekly' | 'immediate';
  preferredTime?: 'morning' | 'afternoon' | 'evening';
}

export interface SurvivorNotificationPreferences {
  survivorId: string;
  preferredLanguage: string;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // e.g. "21:00"
  quietHoursEnd: string;   // e.g. "08:00"
  categories: Record<NotificationCategory, CategoryPreference>;
  updatedAt: string;
}

export interface NotificationPayload {
  recipientId: string;
  survivorPseudonym?: string;
  category: NotificationCategory;
  channel: NotificationChannel;
  rawMessage: string;
  internalMetadata?: Record<string, any>;
  priority?: 'routine' | 'urgent' | 'critical';
  linkUrl?: string;
}

export interface SanitizedPreviewResult {
  maskedPreview: string;
  wasSanitized: boolean;
  detectedSensitiveTerms: string[];
}

export interface NotificationRecord {
  id: string;
  recipientId: string;
  survivorPseudonym: string;
  category: NotificationCategory;
  channel: NotificationChannel;
  title: string;
  maskedPreview: string;
  fullMessageEncrypted?: string;
  deliveryStatus: 'queued' | 'delivered' | 'failed' | 'read';
  priority: 'routine' | 'urgent' | 'critical';
  privacySanitized: boolean;
  dispatchedAt: string;
  readAt?: string;
  statutoryPurpose: string;
  auditHash: string;
}

// ============================================================================
// 1. DEFAULT PREFERENCES
// ============================================================================

export function getDefaultNotificationPreferences(survivorId: string = 'usr-victim-001'): SurvivorNotificationPreferences {
  return {
    survivorId,
    preferredLanguage: 'hi',
    quietHoursEnabled: true,
    quietHoursStart: '21:00',
    quietHoursEnd: '08:00',
    categories: {
      check_in_reminder: {
        enabled: true,
        isCritical: false,
        allowedChannels: ['in_app', 'sms', 'dashboard'],
        frequency: 'daily',
        preferredTime: 'morning',
      },
      follow_up_reminder: {
        enabled: true,
        isCritical: false,
        allowedChannels: ['in_app', 'dashboard', 'email'],
        frequency: 'immediate',
      },
      alert: {
        enabled: true,
        isCritical: true, // Non-opt-outable statutory safety notice
        allowedChannels: ['sms', 'in_app', 'ivrs', 'dashboard'],
        frequency: 'immediate',
      },
      appointment: {
        enabled: true,
        isCritical: false,
        allowedChannels: ['sms', 'in_app', 'email', 'dashboard'],
        frequency: 'immediate',
      },
      consent_update: {
        enabled: true,
        isCritical: false,
        allowedChannels: ['in_app', 'email', 'dashboard'],
        frequency: 'immediate',
      },
      privacy_notification: {
        enabled: true,
        isCritical: false,
        allowedChannels: ['in_app', 'email', 'dashboard', 'ivrs', 'sms'],
        frequency: 'immediate',
      },
    },
    updatedAt: new Date().toISOString(),
  };
}

// In-memory preference store
const PREFERENCES_STORE = new Map<string, SurvivorNotificationPreferences>();

export function getPreferences(survivorId: string): SurvivorNotificationPreferences {
  if (!PREFERENCES_STORE.has(survivorId)) {
    PREFERENCES_STORE.set(survivorId, getDefaultNotificationPreferences(survivorId));
  }
  return PREFERENCES_STORE.get(survivorId)!;
}

export function updatePreferences(
  survivorId: string,
  updates: Partial<SurvivorNotificationPreferences>
): SurvivorNotificationPreferences {
  const current = getPreferences(survivorId);

  // Enforce statutory safety floor: alert is critical and cannot be disabled
  if (updates.categories?.alert && updates.categories.alert.enabled === false) {
    throw new Error('Statutory protection policy forbids disabling critical safety alerts.');
  }

  const updated: SurvivorNotificationPreferences = {
    ...current,
    ...updates,
    categories: {
      ...current.categories,
      ...(updates.categories || {}),
    },
    updatedAt: new Date().toISOString(),
  };

  PREFERENCES_STORE.set(survivorId, updated);
  return updated;
}

// ============================================================================
// 2. PRIVACY-PRESERVING PREVIEW SANITIZER
// ============================================================================

/**
 * Sensitive patterns that must NEVER leak into lock screens, SMS, email headers, or IVRS prompts.
 */
const SENSITIVE_PATTERNS = [
  { pattern: /\b(suicide|suicidal|self-harm|end it all|die|kill myself)\b/gi, label: 'self-harm risk' },
  { pattern: /\b(distress score|risk score|depression score|phq-9|gad-7)\b/gi, label: 'psychometric score' },
  { pattern: /\b(increased|elevated|surged) (risk|score|distress)\b/gi, label: 'elevated score alert' },
  { pattern: /\b(atrocity|caste assault|section 3\(1\)|fir\/|police station|accused)\b/gi, label: 'criminal proceedings' },
  { pattern: /\b(witness protection|intimidation|threat report)\b/gi, label: 'witness security detail' },
  { pattern: /\b(psychiatric|mental illness|bipolar|schizophrenia|trauma diagnosis)\b/gi, label: 'clinical diagnostic label' },
];

/**
 * Sanitizes preview text into a trauma-informed, safe, and discreet notification.
 */
export function sanitizeNotificationPreview(
  rawMessage: string,
  category: NotificationCategory
): SanitizedPreviewResult {
  const detected: string[] = [];
  let containsSensitive = false;

  for (const { pattern, label } of SENSITIVE_PATTERNS) {
    if (pattern.test(rawMessage)) {
      containsSensitive = true;
      detected.push(label);
    }
  }

  if (!containsSensitive) {
    // Already safe, return trimmed
    return {
      maskedPreview: rawMessage.trim(),
      wasSanitized: false,
      detectedSensitiveTerms: [],
    };
  }

  // Provide category-tailored discreet, trauma-informed safe preview
  let maskedPreview = 'You have an important support update. Please open Manas Suraksha.';

  switch (category) {
    case 'alert':
      maskedPreview = 'You have an important support update. Please open Manas Suraksha.';
      break;
    case 'check_in_reminder':
      maskedPreview = 'Your daily wellness pulse is ready. Takes less than 2 minutes.';
      break;
    case 'follow_up_reminder':
      maskedPreview = 'A support follow-up note is waiting in your Manas Suraksha account.';
      break;
    case 'appointment':
      maskedPreview = 'Reminder: You have an upcoming calendar milestone in Manas Suraksha.';
      break;
    case 'consent_update':
      maskedPreview = 'Your privacy and consent preferences have been updated.';
      break;
    case 'privacy_notification':
      maskedPreview = 'A new security and privacy notice is available in your account.';
      break;
  }

  return {
    maskedPreview,
    wasSanitized: true,
    detectedSensitiveTerms: detected,
  };
}

// ============================================================================
// 3. IMMUTABLE AUDIT LOG LEDGER
// ============================================================================

const NOTIFICATION_AUDIT_LOGS: NotificationRecord[] = [];
let lastAuditHash = '0000000000000000000000000000000000000000000000000000000000000000';

function computeAuditHash(entry: Omit<NotificationRecord, 'auditHash'>, prevHash: string): string {
  const payload = `${prevHash}|${entry.id}|${entry.recipientId}|${entry.category}|${entry.channel}|${entry.maskedPreview}|${entry.dispatchedAt}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

// ============================================================================
// 4. NOTIFICATION DISPATCH ENGINE
// ============================================================================

export function dispatchNotification(payload: NotificationPayload): {
  success: boolean;
  record?: NotificationRecord;
  blockedReason?: string;
} {
  const { recipientId, category, channel, rawMessage, priority = 'routine' } = payload;
  const prefs = getPreferences(recipientId);
  const catPref = prefs.categories[category];

  // 1. Check if category is enabled (unless critical safety alert)
  if (!catPref.isCritical && !catPref.enabled) {
    return {
      success: false,
      blockedReason: `Survivor has disabled non-critical '${category}' notifications.`,
    };
  }

  // 2. Check if channel is permitted for this category
  if (!catPref.allowedChannels.includes(channel) && priority !== 'critical') {
    return {
      success: false,
      blockedReason: `Channel '${channel}' is not permitted by survivor preferences for '${category}'.`,
    };
  }

  // 3. Sanitize notification preview to guarantee zero leakage of sensitive data
  const sanitization = sanitizeNotificationPreview(rawMessage, category);

  // 4. Create Notification Record
  const notificationId = `ntf_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const timestamp = new Date().toISOString();

  const titleMap: Record<NotificationCategory, string> = {
    check_in_reminder: 'Daily Wellness Check-In',
    follow_up_reminder: 'Counsellor Follow-Up Notice',
    alert: 'Important Support Update',
    appointment: 'Upcoming Appointment Milestone',
    consent_update: 'Consent Record Updated',
    privacy_notification: 'Privacy & Security Notice',
  };

  const recordWithoutHash: Omit<NotificationRecord, 'auditHash'> = {
    id: notificationId,
    recipientId,
    survivorPseudonym: payload.survivorPseudonym || `Survivor S-${recipientId.slice(-4)}`,
    category,
    channel,
    title: titleMap[category],
    maskedPreview: sanitization.maskedPreview,
    deliveryStatus: 'delivered',
    priority,
    privacySanitized: sanitization.wasSanitized,
    dispatchedAt: timestamp,
    statutoryPurpose: 'Section 15A SC/ST Prevention of Atrocities Act & DPDPA 2023',
  };

  const auditHash = computeAuditHash(recordWithoutHash, lastAuditHash);
  lastAuditHash = auditHash;

  const finalRecord: NotificationRecord = {
    ...recordWithoutHash,
    auditHash,
  };

  NOTIFICATION_AUDIT_LOGS.push(finalRecord);

  return {
    success: true,
    record: finalRecord,
  };
}

// ============================================================================
// 5. AUDIT LOG RETRIEVAL & INTEGRITY
// ============================================================================

export function getNotificationAuditLogs(filters?: {
  recipientId?: string;
  category?: NotificationCategory;
  channel?: NotificationChannel;
}): NotificationRecord[] {
  let logs = [...NOTIFICATION_AUDIT_LOGS];

  if (filters?.recipientId) {
    logs = logs.filter(l => l.recipientId === filters.recipientId);
  }
  if (filters?.category) {
    logs = logs.filter(l => l.category === filters.category);
  }
  if (filters?.channel) {
    logs = logs.filter(l => l.channel === filters.channel);
  }

  return logs;
}

export function verifyNotificationAuditChain(): {
  isValid: boolean;
  totalRecords: number;
  brokenAtId?: string;
} {
  let currentHash = '0000000000000000000000000000000000000000000000000000000000000000';

  for (const record of NOTIFICATION_AUDIT_LOGS) {
    const { auditHash, ...rest } = record;
    const expected = computeAuditHash(rest, currentHash);
    if (expected !== auditHash) {
      return {
        isValid: false,
        totalRecords: NOTIFICATION_AUDIT_LOGS.length,
        brokenAtId: record.id,
      };
    }
    currentHash = auditHash;
  }

  return {
    isValid: true,
    totalRecords: NOTIFICATION_AUDIT_LOGS.length,
  };
}
