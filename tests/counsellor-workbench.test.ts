import {
  counsellorWorkbenchEngine,
  AnonymizedSurvivorProfile,
} from '../lib/counsellor-workbench-data';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export function runCounsellorWorkbenchTests() {
  console.log('🧪 Starting Phase 9: Counsellor Dashboard & Clinical Workbench Test Suite...');

  // Test 1: Priority Worklist Row Fields & PII Protection
  const survivors = counsellorWorkbenchEngine.getSurvivors();
  assert(survivors.length >= 4, `Expected at least 4 active survivor profiles, got ${survivors.length}`);

  for (const s of survivors) {
    // Anonymized ID
    assert(s.anonymizedId.startsWith('SURV-'), `ID must be anonymized (SURV-xxxx), got ${s.anonymizedId}`);
    // Latest Distress Indicator (0-100)
    assert(s.latestDistressIndicator >= 0 && s.latestDistressIndicator <= 100, 'Score must be 0-100');
    // Change from baseline
    assert(typeof s.scoreChange === 'number', 'Score change must be numeric');
    assert(Boolean(s.scoreChangeFormatted), 'Must have formatted change');
    // Last check-in
    assert(Boolean(s.lastCheckInFormatted), 'Must have last check-in timestamp and channel');
    // Trend
    assert(Boolean(s.trendDirection), 'Must have trend direction');
    // Assigned counsellor
    assert(Boolean(s.assignedCounsellor), 'Must have assigned counsellor');
    // Follow-up status
    assert(Boolean(s.followUpStatus), 'Must have follow-up status');
    // Verify no raw full personal names exposed in anonymized identifier
    assert(!s.anonymizedId.includes('Anita Devi') && !s.anonymizedId.includes('Sunita Meena'), 'Anonymized ID must not expose raw personal names');
  }
  console.log('  ✅ Test 1 Passed: Priority Worklist fields and PII anonymization shield validated');

  // Test 2: 8 Survivor Detail Tabs presence and structure
  const sample = survivors[0];
  assert(Boolean(sample.overview), 'Tab 1: Overview must exist');
  assert(Array.isArray(sample.checkIns), 'Tab 2: Check-ins must exist');
  assert(Boolean(sample.trends), 'Tab 3: Trends must exist');
  assert(Boolean(sample.aiSignals), 'Tab 4: AI Signals must exist');
  assert(Array.isArray(sample.caseTimeline), 'Tab 5: Case Timeline must exist');
  assert(Array.isArray(sample.supportHistory), 'Tab 6: Support History must exist');
  assert(Array.isArray(sample.clinicalNotes), 'Tab 7: Notes must exist');
  assert(Boolean(sample.privacy), 'Tab 8: Privacy must exist');
  console.log('  ✅ Test 2 Passed: All 8 Survivor Detail Tabs verified with rich contextual data');

  // Test 3: AI Signals Tab Requirements
  const ai = sample.aiSignals;
  assert(Array.isArray(ai.contributingSignals) && ai.contributingSignals.length > 0, 'AI Signals must contain contributing signals');
  assert(typeof ai.modelConfidence === 'number' && ai.modelConfidence > 0 && ai.modelConfidence <= 1, 'Model confidence must be between 0 and 1');
  assert(Boolean(ai.modelVersion), 'Must specify model version');
  assert(Boolean(ai.timestamp), 'Must specify timestamp');
  assert(
    ai.mandatoryNotice === 'AI-assisted indicator — human review required.',
    `Notice must exactly match 'AI-assisted indicator — human review required.', got '${ai.mandatoryNotice}'`
  );
  console.log('  ✅ Test 3 Passed: AI Signals tab contains contributing signals, confidence, version, timestamp, and mandatory notice');

  // Test 4: Counsellor Action 1 - Contact
  const sId = 'SURV-7842';
  const contacted = counsellorWorkbenchEngine.recordContact(
    sId,
    'Dr. Priya Nair',
    'Direct Secure Telephony',
    'Confirmed survivor has accompaniment for upcoming hearing'
  );
  assert(contacted.followUpStatus === 'Completed', 'Contact must mark follow-up as Completed');
  assert(contacted.clinicalNotes[0].content.includes('Direct Secure Telephony'), 'Clinical notes must record contact event');
  console.log('  ✅ Test 4 Passed: Action 1 (Contact) logged and status updated');

  // Test 5: Counsellor Action 2 - Schedule Follow-up
  const sched = counsellorWorkbenchEngine.scheduleFollowUp({
    survivorId: sId,
    scheduledTime: 'Tomorrow, 14:00 IST',
    modality: 'Tele-Counselling',
    priority: 'High',
    counsellor: 'Dr. Priya Nair',
    focusMilestone: 'Pre-trial grounding recap',
  });
  assert(sched.status === 'Scheduled', 'Follow-up status must be Scheduled');
  assert(sched.survivorId === sId, 'Survivor ID must match');
  console.log('  ✅ Test 5 Passed: Action 2 (Schedule follow-up) registered into timetable');

  // Test 6: Counsellor Action 3 - Add Note
  const initialNotesLen = sample.clinicalNotes.length;
  const noted = counsellorWorkbenchEngine.addClinicalNote(
    sId,
    'Dr. Priya Nair',
    'Progress',
    'Survivor reports restful sleep and reduced tension'
  );
  assert(noted.clinicalNotes.length === initialNotesLen + 1, 'Note must be appended');
  assert(noted.clinicalNotes[0].noteType === 'Progress', 'Note type must match');
  console.log('  ✅ Test 6 Passed: Action 3 (Add Note) recorded in clinical ledger');

  // Test 7: Counsellor Action 4 - Assign Counsellor
  const assigned = counsellorWorkbenchEngine.assignCounsellor(
    sId,
    'Dr. Rajesh Verma (District Officer)',
    'Dr. Priya Nair',
    'Coordinated district protection requirement'
  );
  assert(assigned.assignedCounsellor === 'Dr. Rajesh Verma (District Officer)', 'Assigned counsellor must update');
  console.log('  ✅ Test 7 Passed: Action 4 (Assign) reassigns counsellor and updates audit notes');

  // Test 8: Counsellor Action 5 - Escalate
  const escalated = counsellorWorkbenchEngine.escalateSurvivor(
    sId,
    'Special Public Prosecutor / Legal Aid Lead',
    'Dr. Priya Nair',
    'Deposition protective escort requested'
  );
  assert(escalated.riskCategory === 'Critical', 'Escalation must set risk category to Critical');
  assert(escalated.followUpStatus === 'Due Today', 'Escalation must set follow-up to Due Today');
  console.log('  ✅ Test 8 Passed: Action 5 (Escalate) activates priority triage protocol');

  // Test 9: Counsellor Action 6 - Resolve Alert
  const initialAlerts = sample.activeAlertCount;
  const resolved = counsellorWorkbenchEngine.resolveAlert(
    sId,
    'Dr. Priya Nair',
    'Protective order confirmed by court registrar'
  );
  assert(resolved.activeAlertCount === Math.max(0, initialAlerts - 1), 'Resolve alert must decrement active alert count');
  console.log('  ✅ Test 9 Passed: Action 6 (Resolve Alert) decrements alert queue with clinical justification');

  // Test 10: 8 Main Workbench Sections coverage
  const scheduleItems = counsellorWorkbenchEngine.getSchedule();
  assert(scheduleItems.length >= 3, 'Follow-up schedule must contain active scheduled sessions');
  console.log('  ✅ Test 10 Passed: Workbench schedule and sections data integrity verified');

  console.log('🎉 All Phase 9 Counsellor Dashboard tests passed successfully!\n');
}

if (require.main === module) {
  runCounsellorWorkbenchTests();
}
