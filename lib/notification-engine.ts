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

// Pure JavaScript Isomorphic SHA-256 (NIST FIPS 180-4 compliant for browser & server)
function sha256Sync(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let i = 0, j = 0;
  const utf8: number[] = [];
  for (let ci = 0; ci < ascii.length; ci++) {
    let charcode = ascii.charCodeAt(ci);
    if (charcode < 0x80) utf8.push(charcode);
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
    } else {
      ci++;
      charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (ascii.charCodeAt(ci) & 0x3ff));
      utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
    }
  }

  const bitLength = utf8.length * 8;
  utf8.push(0x80);
  while ((utf8.length % 64) !== 56) utf8.push(0);
  for (let b = 7; b >= 0; b--) {
    utf8.push((bitLength >>> (b * 8)) & 0xff);
  }

  const hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  for (let bi = 0; bi < utf8.length; bi += 64) {
    const w = new Uint32Array(64);
    for (let wi = 0; wi < 16; wi++) {
      w[wi] = (utf8[bi + wi * 4] << 24) | (utf8[bi + wi * 4 + 1] << 16) | (utf8[bi + wi * 4 + 2] << 8) | utf8[bi + wi * 4 + 3];
    }
    for (let wi = 16; wi < 64; wi++) {
      const s0 = rightRotate(w[wi - 15], 7) ^ rightRotate(w[wi - 15], 18) ^ (w[wi - 15] >>> 3);
      const s1 = rightRotate(w[wi - 2], 17) ^ rightRotate(w[wi - 2], 19) ^ (w[wi - 2] >>> 10);
      w[wi] = (w[wi - 16] + s0 + w[wi - 7] + s1) >>> 0;
    }

    let [a, b, c, d, e, f, g, h] = hash;
    for (let wi = 0; wi < 64; wi++) {
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + k[wi] + w[wi]) >>> 0;
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    hash[0] = (hash[0] + a) >>> 0;
    hash[1] = (hash[1] + b) >>> 0;
    hash[2] = (hash[2] + c) >>> 0;
    hash[3] = (hash[3] + d) >>> 0;
    hash[4] = (hash[4] + e) >>> 0;
    hash[5] = (hash[5] + f) >>> 0;
    hash[6] = (hash[6] + g) >>> 0;
    hash[7] = (hash[7] + h) >>> 0;
  }

  return hash.map(h => ('00000000' + h.toString(16)).slice(-8)).join('');
}

const NOTIFICATION_AUDIT_LOGS: NotificationRecord[] = [];
let lastAuditHash = '0000000000000000000000000000000000000000000000000000000000000000';

function computeAuditHash(entry: Omit<NotificationRecord, 'auditHash'>, prevHash: string): string {
  const payload = `${prevHash}|${entry.id}|${entry.recipientId}|${entry.category}|${entry.channel}|${entry.maskedPreview}|${entry.dispatchedAt}`;
  return sha256Sync(payload);
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
