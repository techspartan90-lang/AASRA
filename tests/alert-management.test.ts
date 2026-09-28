import {
  alertManagementSystem,
  AlertSeverity,
  RecommendedAlertAction,
  WORKFLOW_STAGES,
} from '../lib/alert-management-system';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export function runAlertManagementTests() {
  console.log('🧪 Starting Phase 8: Real-Time Alerts Test Suite...');

  // Test 1: Verify the 4 Alert Types exist and are properly classified
  const initialAlerts = alertManagementSystem.getAlerts();
  const severitiesPresent = new Set(initialAlerts.map(a => a.severity));
  const expectedSeverities: AlertSeverity[] = [
    'Information',
    'Attention required',
    'Urgent review',
    'Critical review',
  ];
  for (const s of expectedSeverities) {
    assert(severitiesPresent.has(s), `Expected alert severity '${s}' in initial alert seed`);
  }
  console.log('  ✅ Test 1 Passed: All 4 Alert Types (Information, Attention required, Urgent review, Critical review) validated');

  // Test 2: Verify Alert Structure completeness
  const sample = initialAlerts[0];
  assert(Boolean(sample.alertId), 'Alert must have alert ID');
  assert(Boolean(sample.survivorReference), 'Alert must have survivor reference');
  assert(Boolean(sample.createdTime), 'Alert must have created time');
  assert(Boolean(sample.severity), 'Alert must have severity');
  assert(Boolean(sample.trigger), 'Alert must have trigger');
  assert(Array.isArray(sample.supportingSignals) && sample.supportingSignals.length > 0, 'Alert must have supporting signals');
  assert(Boolean(sample.recommendedAction), 'Alert must have recommended action');
  assert(Boolean(sample.assignedCounsellor), 'Alert must have assigned counsellor');
  assert(Boolean(sample.status), 'Alert must have status');
  assert(Array.isArray(sample.auditHistory) && sample.auditHistory.length > 0, 'Alert must have audit history');
  console.log('  ✅ Test 2 Passed: Alert structure contains all 10 required fields');

  // Test 3: Verify Workflow Progression Definition
  assert(WORKFLOW_STAGES.length === 6, 'Must have 6 workflow stages');
  assert(WORKFLOW_STAGES[0] === 'Signal detected', 'Stage 1 must be Signal detected');
  assert(WORKFLOW_STAGES[1] === 'Alert generated', 'Stage 2 must be Alert generated');
  assert(WORKFLOW_STAGES[2] === 'Human review', 'Stage 3 must be Human review');
  assert(WORKFLOW_STAGES[3] === 'Counsellor action', 'Stage 4 must be Counsellor action');
  assert(WORKFLOW_STAGES[4] === 'Follow-up', 'Stage 5 must be Follow-up');
  assert(WORKFLOW_STAGES[5] === 'Resolution', 'Stage 6 must be Resolution');
  console.log('  ✅ Test 3 Passed: 6-stage lifecycle workflow verified');

  // Test 4: Verify Human Review Mandate
  for (const a of initialAlerts) {
    assert(a.requiresHumanReview === true, `Alert ${a.alertId} must enforce requiresHumanReview === true`);
  }
  console.log('  ✅ Test 4 Passed: AI irreversibility governance mandate enforced (human review required)');

  // Test 5: Action 1 - Acknowledge alert with audit log
  const newAlert = alertManagementSystem.createAlert({
    survivorReference: 'Pooja Rani (CASE-015 / Alwar)',
    severity: 'Urgent review',
    trigger: 'Upcoming court deposition milestone and elevated vocal tension',
    supportingSignals: ['Acoustic tremor index 0.42', 'Hearing in 4 days'],
    recommendedAction: 'schedule counselling',
    assignedCounsellor: 'Dr. Priya Nair',
    caseId: 'CASE-015',
    district: 'Alwar',
  });
  const initialAuditLen = newAlert.auditHistory.length;

  const ackAlert = alertManagementSystem.acknowledgeAlert(
    newAlert.alertId,
    'Dr. Priya Nair (Counsellor)',
    'Reviewing pre-trial deposition support notes'
  );
  assert(ackAlert.status === 'Acknowledged', `Expected status 'Acknowledged', got ${ackAlert.status}`);
  assert(ackAlert.auditHistory.length === initialAuditLen + 1, 'Acknowledge must append audit entry');
  assert(ackAlert.auditHistory[0].action === 'ACKNOWLEDGE', 'Latest audit action must be ACKNOWLEDGE');
  console.log('  ✅ Test 5 Passed: Acknowledge action successfully transitions status and logs audit entry');

  // Test 6: Action 2 - Assign / Reassign counsellor with audit log
  const assignedAlert = alertManagementSystem.assignAlert(
    newAlert.alertId,
    'Dr. Rajesh Verma (District Officer)',
    'Dr. Priya Nair (Supervisor)',
    'Reassigning for district witness security coordination'
  );
  assert(assignedAlert.assignedCounsellor === 'Dr. Rajesh Verma (District Officer)', 'Counsellor must be updated');
  assert(assignedAlert.auditHistory[0].action === 'ASSIGN', 'Latest audit action must be ASSIGN');
  assert(assignedAlert.auditHistory[0].details?.newCounsellor === 'Dr. Rajesh Verma (District Officer)', 'Audit details must record new counsellor');
  console.log('  ✅ Test 6 Passed: Assign action successfully reassigns staff and logs provenance');

  // Test 7: Action 3 - Escalate alert with audit log
  const escalatedAlert = alertManagementSystem.escalateAlert(
    newAlert.alertId,
    'Special Public Prosecutor / Legal Aid Lead',
    'Dr. Rajesh Verma (District Officer)',
    'Protective witness escort requested for court deposition'
  );
  assert(escalatedAlert.status === 'Escalated', `Expected status 'Escalated', got ${escalatedAlert.status}`);
  assert(escalatedAlert.auditHistory[0].action === 'ESCALATE', 'Latest audit action must be ESCALATE');
  console.log('  ✅ Test 7 Passed: Escalate action transitions alert and records escalation authority target');

  // Test 8: Action 4 - Add Note with audit log
  const notedAlert = alertManagementSystem.addNote(
    newAlert.alertId,
    'Dr. Priya Nair (Counsellor)',
    'Survivor spoke via telephone; confirms feeling calmer after legal aid consultation'
  );
  assert(notedAlert.auditHistory[0].action === 'ADD_NOTE', 'Audit action must be ADD_NOTE');
  assert(notedAlert.auditHistory[0].note.includes('telephone'), 'Note text must match');
  console.log('  ✅ Test 8 Passed: Add Note appends immutable progress note to audit trail');

  // Test 9: Action 5 - Resolve alert with audit log
  const resolvedAlert = alertManagementSystem.resolveAlert(
    newAlert.alertId,
    'Dr. Priya Nair (Counsellor)',
    'Survivor accompanied to deposition without incident. Grounding check-in completed.'
  );
  assert(resolvedAlert.status === 'Resolved', `Expected status 'Resolved', got ${resolvedAlert.status}`);
  assert(resolvedAlert.currentWorkflowStage === 'Resolution', 'Stage must advance to Resolution');
  assert(resolvedAlert.auditHistory[0].action === 'RESOLVE', 'Audit action must be RESOLVE');
  console.log('  ✅ Test 9 Passed: Resolve action closes alert with mandatory resolution summary and audit trail');

  // Test 10: Supported Recommended Actions validation
  const validActions: RecommendedAlertAction[] = [
    'schedule counselling',
    'contact survivor',
    'offer support resources',
    'review case context',
    'escalate to appropriate human support',
  ];
  for (const act of validActions) {
    const customAlert = alertManagementSystem.createAlert({
      survivorReference: 'Test Survivor',
      severity: 'Information',
      trigger: `Testing action ${act}`,
      supportingSignals: ['Test signal'],
      recommendedAction: act,
      assignedCounsellor: 'Dr. Priya Nair',
      caseId: 'CASE-TEST',
      district: 'Test District',
    });
    assert(customAlert.recommendedAction === act, `Expected action '${act}'`);
  }
  console.log('  ✅ Test 10 Passed: All 5 specified recommended actions supported and validated');

  console.log('🎉 All Phase 8 Real-Time Alerts tests passed successfully!\n');
}

if (require.main === module) {
  runAlertManagementTests();
}
