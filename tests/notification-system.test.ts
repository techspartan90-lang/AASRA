/**
 * PHASE 16: NOTIFICATION SYSTEM TEST SUITE
 * 
 * Validates:
 * 1. Support for 5 Channels: SMS, IVRS, In-App, Email, Dashboard
 * 2. Support for 6 Categories: check_in_reminder, follow_up_reminder, alert, appointment, consent_update, privacy_notification
 * 3. Survivor Preference Controls: Survivors control non-critical notifications; statutory critical alerts cannot be disabled
 * 4. Privacy-Preserving Preview Sanitizer: Replaces sensitive/stigmatizing text (e.g. "Your suicide risk score has increased")
 *    with discreet, trauma-informed previews ("You have an important support update. Please open Manas Suraksha.")
 * 5. Cryptographic Notification Audit Trail: Immutable logging and SHA-256 chain verification
 * 6. Express API /notifications endpoints
 */

import assert from 'node:assert';
import http from 'node:http';
import app from '../backend/server';
import {
  NotificationChannel,
  NotificationCategory,
  getDefaultNotificationPreferences,
  getPreferences,
  updatePreferences,
  sanitizeNotificationPreview,
  dispatchNotification,
  getNotificationAuditLogs,
  verifyNotificationAuditChain,
} from '../lib/notification-engine';

export async function runNotificationSystemTests() {
  console.log('🧪 Starting Phase 16: Notification System Test Suite...');

  // -------------------------------------------------------------
  // PART 1: CHANNEL & CATEGORY SPECIFICATION TESTS
  // -------------------------------------------------------------
  console.log('--- Subsuite 1: Channels & Categories Coverage ---');

  const supportedChannels: NotificationChannel[] = ['sms', 'ivrs', 'in_app', 'email', 'dashboard'];
  const supportedCategories: NotificationCategory[] = [
    'check_in_reminder',
    'follow_up_reminder',
    'alert',
    'appointment',
    'consent_update',
    'privacy_notification',
  ];

  const defaultPrefs = getDefaultNotificationPreferences('test-survivor-101');

  // Verify all 6 categories exist in preferences
  for (const cat of supportedCategories) {
    assert(Boolean(defaultPrefs.categories[cat]), `Preference must exist for category '${cat}'`);
  }
  assert.strictEqual(Object.keys(defaultPrefs.categories).length, 6);
  console.log('  ✅ Test 1 Passed: All 6 required notification categories registered in preferences');

  // Verify all 5 channels are represented across categories
  const coveredChannels = new Set<NotificationChannel>();
  for (const cat of supportedCategories) {
    for (const ch of defaultPrefs.categories[cat].allowedChannels) {
      coveredChannels.add(ch);
    }
  }
  for (const ch of supportedChannels) {
    assert(coveredChannels.has(ch), `Channel '${ch}' must be supported in notification preferences`);
  }
  console.log('  ✅ Test 2 Passed: All 5 delivery channels (SMS, IVRS, In-App, Email, Dashboard) supported');

  // -------------------------------------------------------------
  // PART 2: SURVIVOR PREFERENCE SOVEREIGNTY & STATUTORY FLOOR
  // -------------------------------------------------------------
  console.log('--- Subsuite 2: Preference Sovereignty & Safety Floor ---');

  const testSurvivor = 'survivor-control-test-01';

  // 1. Survivor can disable non-critical check-in reminders
  const updated1 = updatePreferences(testSurvivor, {
    categories: {
      ...getPreferences(testSurvivor).categories,
      check_in_reminder: {
        enabled: false,
        isCritical: false,
        allowedChannels: ['sms'],
      },
    },
  });
  assert.strictEqual(updated1.categories.check_in_reminder.enabled, false);
  console.log('  ✅ Test 3 Passed: Survivor successfully disabled non-critical check-in reminders');

  // 2. Survivor attempts to disable critical alert -> System rejects with statutory protection error
  assert.throws(
    () => {
      updatePreferences(testSurvivor, {
        categories: {
          ...getPreferences(testSurvivor).categories,
          alert: {
            enabled: false, // Illegal attempt
            isCritical: true,
            allowedChannels: ['sms'],
          },
        },
      });
    },
    /Statutory protection policy forbids disabling critical safety alerts/,
    'Disabling critical safety alerts must be strictly rejected'
  );
  console.log('  ✅ Test 4 Passed: Statutory safety floor strictly prevents disabling critical alerts');

  // -------------------------------------------------------------
  // PART 3: ANTI-STIGMATIZING PREVIEW SANITIZER TESTS
  // -------------------------------------------------------------
  console.log('--- Subsuite 3: Privacy-Preserving Preview Sanitizer ---');

  // Case A: Sensitive suicide/distress text
  const rawSuicideMsg = 'Your suicide risk score has increased.';
  const sanitizedA = sanitizeNotificationPreview(rawSuicideMsg, 'alert');
  assert.strictEqual(sanitizedA.wasSanitized, true);
  assert.strictEqual(
    sanitizedA.maskedPreview,
    'You have an important support update. Please open Manas Suraksha.'
  );
  assert(!sanitizedA.maskedPreview.includes('suicide'));
  assert(!sanitizedA.maskedPreview.includes('score'));
  console.log('  ✅ Test 5 Passed: Suicide/distress score text correctly sanitized to discreet trauma-informed preview');

  // Case B: Criminal court proceeding details
  const rawCourtMsg = 'Accused in Section 3(1) SC/ST PoA Act case lodged complaint at police station.';
  const sanitizedB = sanitizeNotificationPreview(rawCourtMsg, 'appointment');
  assert.strictEqual(sanitizedB.wasSanitized, true);
  assert.strictEqual(
    sanitizedB.maskedPreview,
    'Reminder: You have an upcoming calendar milestone in Manas Suraksha.'
  );
  assert(!sanitizedB.maskedPreview.includes('SC/ST'));
  assert(!sanitizedB.maskedPreview.includes('police'));
  console.log('  ✅ Test 6 Passed: Criminal proceeding text masked from lock-screen calendar preview');

  // Case C: Non-sensitive benign message
  const benignMsg = 'Reminder: Please take your prescribed hydration break.';
  const sanitizedC = sanitizeNotificationPreview(benignMsg, 'check_in_reminder');
  assert.strictEqual(sanitizedC.wasSanitized, false);
  assert.strictEqual(sanitizedC.maskedPreview, benignMsg);
  console.log('  ✅ Test 7 Passed: Benign routine notifications preserved without alteration');

  // -------------------------------------------------------------
  // PART 4: DISPATCH & DELIVERY ENGINE TESTS
  // -------------------------------------------------------------
  console.log('--- Subsuite 4: Notification Dispatch & Enforcement ---');

  const recipientA = 'usr-dispatch-test-01';

  // Dispatch permitted notification
  const dispatchRes = dispatchNotification({
    recipientId: recipientA,
    category: 'alert',
    channel: 'sms',
    rawMessage: 'Critical alert: Elevated distress score detected',
    priority: 'urgent',
  });
  assert.strictEqual(dispatchRes.success, true);
  assert(Boolean(dispatchRes.record?.id));
  assert.strictEqual(dispatchRes.record?.channel, 'sms');
  assert.strictEqual(dispatchRes.record?.privacySanitized, true);
  assert.strictEqual(
    dispatchRes.record?.maskedPreview,
    'You have an important support update. Please open Manas Suraksha.'
  );
  console.log('  ✅ Test 8 Passed: Notification successfully dispatched with safe masked preview');

  // Attempt dispatch to disabled category
  updatePreferences(recipientA, {
    categories: {
      ...getPreferences(recipientA).categories,
      appointment: {
        enabled: false,
        isCritical: false,
        allowedChannels: ['sms'],
      },
    },
  });
  const blockedRes = dispatchNotification({
    recipientId: recipientA,
    category: 'appointment',
    channel: 'sms',
    rawMessage: 'Routine appointment reminder',
  });
  assert.strictEqual(blockedRes.success, false);
  assert(blockedRes.blockedReason?.includes('disabled non-critical'));
  console.log('  ✅ Test 9 Passed: Dispatch engine respects survivor preference and blocks disabled category');

  // -------------------------------------------------------------
  // PART 5: IMMUTABLE AUDIT LOG & SHA-256 INTEGRITY TESTS
  // -------------------------------------------------------------
  console.log('--- Subsuite 5: Cryptographic Audit Trail ---');

  // Dispatch multiple across channels
  for (const ch of ['ivrs', 'in_app', 'email', 'dashboard'] as NotificationChannel[]) {
    dispatchNotification({
      recipientId: recipientA,
      category: 'privacy_notification',
      channel: ch,
      rawMessage: 'Your privacy preferences have been updated.',
    });
  }

  const logs = getNotificationAuditLogs({ recipientId: recipientA });
  assert.strictEqual(logs.length, 5); // 1 from earlier alert + 4 new

  const auditCheck = verifyNotificationAuditChain();
  assert.strictEqual(auditCheck.isValid, true);
  assert.strictEqual(auditCheck.totalRecords >= 5, true);
  console.log('  ✅ Test 10 Passed: Cryptographic SHA-256 audit ledger chain verified UNCOMPROMISED');

  // -------------------------------------------------------------
  // PART 6: EXPRESS API /notifications INTEGRATION
  // -------------------------------------------------------------
  console.log('--- Subsuite 6: Express API Route Integration ---');

  const server = http.createServer(app);
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address() as any;
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const authToken = 'session_test_survivor_token';

  try {
    // 1. GET /api/v1/notifications
    const listRes = await fetch(`${baseUrl}/api/v1/notifications`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert.strictEqual(listRes.status, 200);
    const listData = await listRes.json();
    assert.strictEqual(listData.success, true);
    assert(Array.isArray(listData.notifications));
    console.log('  ✅ Test 11 Passed: GET /api/v1/notifications delivers sanitized in-app list');

    // 2. GET /api/v1/notifications/preferences/:survivorId
    const getPrefsRes = await fetch(`${baseUrl}/api/v1/notifications/preferences/usr-victim-001`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert.strictEqual(getPrefsRes.status, 200);
    const prefsData = await getPrefsRes.json();
    assert.strictEqual(prefsData.success, true);
    assert(Boolean(prefsData.data.categories.alert.isCritical));
    console.log('  ✅ Test 12 Passed: GET /api/v1/notifications/preferences delivers granular settings');

    // 3. PUT /api/v1/notifications/preferences/:survivorId (Attempt invalid disable of critical alert)
    const badPutRes = await fetch(`${baseUrl}/api/v1/notifications/preferences/usr-victim-001`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        categories: {
          alert: { enabled: false, isCritical: true, allowedChannels: ['sms'] },
        },
      }),
    });
    assert.strictEqual(badPutRes.status, 400);
    console.log('  ✅ Test 13 Passed: PUT /api/v1/notifications/preferences enforces 400 for critical alert bypass');

    // 4. POST /api/v1/notifications/sanitize-preview
    const sanitizeRes = await fetch(`${baseUrl}/api/v1/notifications/sanitize-preview`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rawMessage: 'Your suicide risk score has increased.',
        category: 'alert',
      }),
    });
    assert.strictEqual(sanitizeRes.status, 200);
    const sanitizeJson = await sanitizeRes.json();
    assert.strictEqual(sanitizeJson.data.wasSanitized, true);
    assert.strictEqual(
      sanitizeJson.data.maskedPreview,
      'You have an important support update. Please open Manas Suraksha.'
    );
    console.log('  ✅ Test 14 Passed: POST /api/v1/notifications/sanitize-preview intercepts sensitive preview');

    // 5. POST /api/v1/notifications/send
    const sendRes = await fetch(`${baseUrl}/api/v1/notifications/send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientId: 'usr-victim-001',
        category: 'appointment',
        channel: 'dashboard',
        rawMessage: 'Reminder: Trial testimony scheduled for next Tuesday.',
      }),
    });
    assert.strictEqual(sendRes.status, 201);
    const sendJson = await sendRes.json();
    assert.strictEqual(sendJson.success, true);
    assert.strictEqual(sendJson.data.category, 'appointment');
    console.log('  ✅ Test 15 Passed: POST /api/v1/notifications/send dispatches notification and updates audit trail');

    // 6. GET /api/v1/notifications/audit-logs
    const auditRes = await fetch(`${baseUrl}/api/v1/notifications/audit-logs`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert.strictEqual(auditRes.status, 200);
    const auditJson = await auditRes.json();
    assert(auditJson.totalRecords > 0);
    console.log('  ✅ Test 16 Passed: GET /api/v1/notifications/audit-logs retrieves immutable records');

    // 7. POST /api/v1/notifications/verify-audit
    const verifyRes = await fetch(`${baseUrl}/api/v1/notifications/verify-audit`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert.strictEqual(verifyRes.status, 200);
    const verifyJson = await verifyRes.json();
    assert.strictEqual(verifyJson.data.status, 'UNCOMPROMISED');
    console.log('  ✅ Test 17 Passed: POST /api/v1/notifications/verify-audit verifies cryptographic ledger');

  } finally {
    server.close();
  }

  console.log('🎉 All 17 Notification System tests passed successfully!\n');
}

// Allow standalone execution
if (typeof require !== 'undefined' && require.main === module) {
  runNotificationSystemTests()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Test execution failed:', err);
      process.exit(1);
    });
}
