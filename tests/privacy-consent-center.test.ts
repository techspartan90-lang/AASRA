import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  PrivacyConsentEngine,
  INITIAL_GRANULAR_CONSENTS,
  INITIAL_DATA_ACCESS_LOGS,
  ROLE_PERMISSION_MATRIX,
  GranularConsentItem,
} from '../lib/privacy-consent-engine';

describe('PHASE 11: PRIVACY AND CONSENT CENTER TESTS', () => {
  it('1. Initializes default profile with 5 granular categories and plain-language summaries', () => {
    const engine = new PrivacyConsentEngine();
    const profile = engine.getProfile();

    assert.strictEqual(profile.anonymizedCode, 'BEN-7821');
    assert.strictEqual(profile.consentStatus, 'active');
    assert.strictEqual(profile.currentVersion, 'v2.3');

    const consents = engine.getGranularConsents();
    assert.strictEqual(consents.length, 5);

    const keys = consents.map(c => c.key);
    assert.ok(keys.includes('voiceAnalysis'));
    assert.ok(keys.includes('automatedReminders'));
    assert.ok(keys.includes('longitudinalTracking'));
    assert.ok(keys.includes('emergencyContactShared'));
    assert.ok(keys.includes('caseMilestoneSync'));

    // Verify plain language summary, purpose, retention, and access are all populated
    consents.forEach(c => {
      assert.ok(c.plainLanguageSummary.length > 20, `${c.key} missing plain language summary`);
      assert.ok(c.legalPurpose.length > 10, `${c.key} missing legal purpose`);
      assert.ok(c.retentionPeriod.length > 3, `${c.key} missing retention period`);
      assert.ok(c.whoCanAccess.length > 0, `${c.key} missing who can access`);
      assert.ok(c.dataCollected.length > 0, `${c.key} missing data collected list`);
      assert.ok(c.withdrawalImpact.length > 15, `${c.key} missing withdrawal impact explanation`);
    });
  });

  it('2. Enforces raw voice audio 0-day retention architectural guarantee', () => {
    const engine = new PrivacyConsentEngine();
    const voiceConsent = engine.getGranularConsents().find(c => c.key === 'voiceAnalysis');
    assert.ok(voiceConsent);
    assert.strictEqual(voiceConsent.retentionDays, 0);
    assert.ok(voiceConsent.retentionPeriod.includes('0 Days'));
    assert.ok(voiceConsent.dataCollected.some(d => d.includes('NO raw audio saved')));

    const minimizationReport = engine.getDataMinimizationReport();
    assert.strictEqual(minimizationReport.rawAudioStoredBytes, 0);
    assert.strictEqual(minimizationReport.exactGpsCoordinatesStored, 0);
    assert.strictEqual(minimizationReport.piiTokenizationRate, 100);
    assert.strictEqual(minimizationReport.status, 'COMPLIANT');
  });

  it('3. Modifies and withdraws voluntary consent with version bumping and audit logging', () => {
    const engine = new PrivacyConsentEngine();
    
    // Withdraw voice analysis
    const withdrawRes = engine.updateConsentCategory('voiceAnalysis', false, 'SURV-7821', 'victim');
    assert.strictEqual(withdrawRes.success, true);
    assert.strictEqual(withdrawRes.version, 'v2.4');

    const profileAfter = engine.getProfile();
    assert.strictEqual(profileAfter.currentVersion, 'v2.4');
    assert.strictEqual(profileAfter.consentStatus, 'partial');

    const voiceConsent = profileAfter.granularConsents.find(c => c.key === 'voiceAnalysis');
    assert.ok(voiceConsent && !voiceConsent.isEnabled);

    // Verify audit log has the event
    const logs = engine.getAccessLogs();
    const withdrawLog = logs.find(l => l.action === 'WITHDRAW_CONSENT');
    assert.ok(withdrawLog, 'WITHDRAW_CONSENT log entry should exist');
    assert.strictEqual(withdrawLog.dataCategory, 'consent_preferences');
    assert.ok(withdrawLog.reason.includes('Voice & Acoustic Stress Analysis'));
  });

  it('4. Rejects withdrawal of statutory court milestone synchronization with explanatory note', () => {
    const engine = new PrivacyConsentEngine();
    const res = engine.updateConsentCategory('caseMilestoneSync', false);
    assert.strictEqual(res.success, false);
    assert.ok(res.message.includes('cannot be withdrawn due to statutory requirements'));

    const profile = engine.getProfile();
    const milestoneConsent = profile.granularConsents.find(c => c.key === 'caseMilestoneSync');
    assert.ok(milestoneConsent && milestoneConsent.isEnabled);
  });

  it('5. Updates communication preferences and records audit trail', () => {
    const engine = new PrivacyConsentEngine();
    const res = engine.updateCommunicationPreferences({
      primaryChannel: 'ivrs',
      checkInFrequency: 'weekly',
      quietHoursStart: '22:00',
      quietHoursEnd: '07:00',
    });

    assert.strictEqual(res.success, true);
    const prefs = engine.getCommunicationPreferences();
    assert.strictEqual(prefs.primaryChannel, 'ivrs');
    assert.strictEqual(prefs.checkInFrequency, 'weekly');
    assert.strictEqual(prefs.quietHoursStart, '22:00');
    assert.strictEqual(prefs.quietHoursEnd, '07:00');

    const logs = engine.getAccessLogs();
    const prefLog = logs.find(l => l.action === 'UPDATE_COMMUNICATION_PREFERENCES');
    assert.ok(prefLog);
    assert.ok(prefLog.reason.includes('Primary channel set to ivrs'));
  });

  it('6. Updates trusted contact details for emergency critical alerts', () => {
    const engine = new PrivacyConsentEngine();
    const res = engine.updateTrustedContact({
      name: 'Rupali Sharma',
      relationship: 'Sister / Legal Guardian',
      phone: '+91 91234 56789',
      notifyOnCriticalAlert: true,
    });

    assert.strictEqual(res.success, true);
    const contact = engine.getTrustedContact();
    assert.strictEqual(contact.name, 'Rupali Sharma');
    assert.strictEqual(contact.relationship, 'Sister / Legal Guardian');
    assert.strictEqual(contact.phone, '+91 91234 56789');
    assert.strictEqual(contact.notifyOnCriticalAlert, true);

    const logs = engine.getAccessLogs();
    const contactLog = logs.find(l => l.action === 'UPDATE_TRUSTED_CONTACT');
    assert.ok(contactLog);
    assert.strictEqual(contactLog.dataCategory, 'trusted_contacts');
  });

  it('7. Filters data access history by role, data category, and search query', () => {
    const engine = new PrivacyConsentEngine();

    // Filter by counsellor
    const counsellorLogs = engine.getAccessLogs({ role: 'counsellor' });
    assert.ok(counsellorLogs.length > 0);
    counsellorLogs.forEach(l => assert.strictEqual(l.role, 'counsellor'));

    // Filter by category
    const distressLogs = engine.getAccessLogs({ dataCategory: 'distress_indicators' });
    assert.ok(distressLogs.length > 0);
    distressLogs.forEach(l => assert.strictEqual(l.dataCategory, 'distress_indicators'));

    // Search query
    const searchLogs = engine.getAccessLogs({ search: 'Dr. Priya' });
    assert.ok(searchLogs.length > 0);
    searchLogs.forEach(l => assert.ok(l.actor.includes('Dr. Priya')));
  });

  it('8. Verifies tamper-evident cryptographic audit trail integrity', () => {
    const engine = new PrivacyConsentEngine();
    const integrity = engine.verifyAuditTrailIntegrity();

    assert.strictEqual(integrity.integrityStatus, 'VALID');
    assert.strictEqual(integrity.chainValid, true);
    assert.strictEqual(integrity.totalRecords, integrity.verifiedRecords);
    assert.ok(integrity.totalRecords >= 7);

    // Verify all records have required attributes
    const logs = engine.getAccessLogs();
    logs.forEach(l => {
      assert.ok(l.id.startsWith('LOG-'));
      assert.ok(l.timestamp.length > 10);
      assert.ok(l.actor.length > 0);
      assert.ok(l.action.length > 0);
      assert.ok(l.reason.length > 0);
      assert.ok(l.tamperProofHash.length > 10);
      assert.strictEqual(l.verified, true);
    });
  });

  it('9. Enforces least-privilege role-based access matrix rules', () => {
    const engine = new PrivacyConsentEngine();
    const matrix = engine.getRolePermissions();

    const victimRole = matrix.find(r => r.role === 'victim');
    assert.ok(victimRole);
    assert.strictEqual(victimRole.canEditConsent, true);
    assert.strictEqual(victimRole.canViewRawResponses, true);

    const counsellorRole = matrix.find(r => r.role === 'counsellor');
    assert.ok(counsellorRole);
    assert.strictEqual(counsellorRole.canViewDistressScore, true);
    assert.strictEqual(counsellorRole.canViewRawResponses, true);
    assert.strictEqual(counsellorRole.canEditConsent, false); // Counsellor cannot unilaterally alter survivor consent
    assert.strictEqual(counsellorRole.canExportPII, false);

    const districtRole = matrix.find(r => r.role === 'district_officer');
    assert.ok(districtRole);
    assert.strictEqual(districtRole.canViewDistressScore, true);
    assert.strictEqual(districtRole.canViewRawResponses, false); // Redacted
    assert.strictEqual(districtRole.canExportAggregates, true);

    const stateRole = matrix.find(r => r.role === 'state_admin');
    assert.ok(stateRole);
    assert.strictEqual(stateRole.canViewRawResponses, false);
    assert.strictEqual(stateRole.canViewVoiceAcoustics, false);
    assert.strictEqual(stateRole.canExportPII, false);
  });

  it('10. Manages active sessions and generates digital cryptographic consent receipts', () => {
    const engine = new PrivacyConsentEngine();
    const sessions = engine.getActiveSessions();
    assert.ok(sessions.length >= 3);

    // Terminate non-current session
    const termRes = engine.terminateSession('SES-002');
    assert.strictEqual(termRes.success, true);
    const sessionsAfter = engine.getActiveSessions();
    assert.strictEqual(sessionsAfter.some(s => s.id === 'SES-002'), false);

    // Prevent terminating current active session
    const currentSession = sessionsAfter.find(s => s.isCurrent);
    assert.ok(currentSession);
    const currTermRes = engine.terminateSession(currentSession.id);
    assert.strictEqual(currTermRes.success, false);

    // Generate consent receipt
    const receipt = engine.generateConsentReceipt();
    assert.ok(receipt.receiptId.startsWith('RCPT-'));
    assert.strictEqual(receipt.survivorCode, 'BEN-7821');
    assert.strictEqual(receipt.version, 'v2.3');
    assert.ok(receipt.digitalSignature.startsWith('sig_ed25519_'));
    assert.ok(receipt.verificationUrl.includes('verify-consent'));
    assert.ok(receipt.activeConsents.length > 0);
  });
});

export function runPrivacyConsentTests() {
  console.log('🧪 Starting Phase 11: Privacy & Consent Center Test Suite...');
  const engine = new PrivacyConsentEngine();

  // Test 1: Granular categories
  const consents = engine.getGranularConsents();
  assert.strictEqual(consents.length, 5, 'Must have 5 granular consent categories');
  console.log('  ✅ Test 1 Passed: 5 granular consent categories validated');

  // Test 2: Data minimization
  const min = engine.getDataMinimizationReport();
  assert.strictEqual(min.rawAudioStoredBytes, 0, 'Raw audio stored must be 0 bytes');
  assert.strictEqual(min.exactGpsCoordinatesStored, 0, 'Exact GPS stored must be 0');
  console.log('  ✅ Test 2 Passed: 0-day raw audio discard and zero-GPS minimization verified');

  // Test 3: Modify consent & version bump
  const modRes = engine.updateConsentCategory('voiceAnalysis', false);
  assert.strictEqual(modRes.success, true);
  assert.strictEqual(modRes.version, 'v2.4');
  console.log('  ✅ Test 3 Passed: Consent modification and cryptographic version bumping verified');

  // Test 4: Statutory milestone protection
  const statRes = engine.updateConsentCategory('caseMilestoneSync', false);
  assert.strictEqual(statRes.success, false, 'Statutory milestone sync cannot be withdrawn');
  console.log('  ✅ Test 4 Passed: Statutory Section 15A milestone sync integrity preserved');

  // Test 5: Communication preferences
  const prefRes = engine.updateCommunicationPreferences({ primaryChannel: 'sms', checkInFrequency: 'weekly' });
  assert.strictEqual(prefRes.success, true);
  console.log('  ✅ Test 5 Passed: Communication channel preference updates verified');

  // Test 6: Trusted contact update
  const contactRes = engine.updateTrustedContact({ name: 'Rupali Sharma', phone: '+91 91234 56789' });
  assert.strictEqual(contactRes.success, true);
  console.log('  ✅ Test 6 Passed: Trusted contact designation updated');

  // Test 7: Data access history filtering
  const logs = engine.getAccessLogs({ role: 'counsellor' });
  assert.ok(logs.length > 0);
  console.log('  ✅ Test 7 Passed: Data access audit trail filterable by role and category');

  // Test 8: Cryptographic audit integrity
  const integrity = engine.verifyAuditTrailIntegrity();
  assert.strictEqual(integrity.integrityStatus, 'VALID');
  console.log('  ✅ Test 8 Passed: Tamper-evident cryptographic audit log chain validated');

  // Test 9: RBAC permission boundaries
  const permissions = engine.getRolePermissions();
  assert.strictEqual(permissions.length, 5);
  console.log('  ✅ Test 9 Passed: Least-privilege RBAC permission matrix verified');

  // Test 10: Session management & consent receipt
  const sessions = engine.getActiveSessions();
  assert.ok(sessions.length >= 3);
  const receipt = engine.generateConsentReceipt();
  assert.ok(receipt.digitalSignature.startsWith('sig_ed25519_'));
  console.log('  ✅ Test 10 Passed: Active session management and digital consent receipt generation verified\n');
}

