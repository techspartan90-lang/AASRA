/**
 * PHASE 18: DEMONSTRATION MODE VERIFICATION TEST SUITE
 * 
 * Verifies:
 * 1. 5 Demo Accounts (Survivor, Counsellor, District Officer, State Officer, Administrator)
 * 2. 6 Realistic Scenarios (Stable, Increasing, Missed Check-ins, Milestone Distress, Alert Review, Resolved Intervention)
 * 3. 8-Stage Lifecycle Progression (Check-in -> AI analysis -> Distress indicator -> Risk prediction -> Alert -> Counsellor review -> Intervention -> Resolution)
 * 4. Synthetic Data Enforcement & Privacy Disclosures
 */

import {
  DEMO_ACCOUNTS,
  DEMO_SCENARIOS,
  LIFECYCLE_STAGES,
  DEMO_SYNTHETIC_DATA_DISCLOSURE,
} from '../lib/demo-scenarios';

export function runDemonstrationModeTests(): boolean {
  console.log('🧪 Starting Phase 18: Demonstration Mode & Realistic Scenarios Test Suite...\n');
  let passed = true;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✅ ${message}`);
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      passed = false;
    }
  }

  // --------------------------------------------------------------------------
  // 1. Synthetic Data & Regulatory Disclosures
  // --------------------------------------------------------------------------
  console.log('--- 1. Synthetic Data Guarantees & Disclosures ---');
  assert(
    DEMO_SYNTHETIC_DATA_DISCLOSURE.badge.includes('DEMO / SYNTHETIC DATA'),
    'Disclosure badge explicitly states "DEMO / SYNTHETIC DATA"'
  );
  assert(
    DEMO_SYNTHETIC_DATA_DISCLOSURE.notice.toLowerCase().includes('never enter or process real survivor information'),
    'Strict notice forbids real survivor information'
  );
  assert(
    DEMO_SYNTHETIC_DATA_DISCLOSURE.legalFramework.includes('Section 15A') &&
    DEMO_SYNTHETIC_DATA_DISCLOSURE.legalFramework.includes('DPDPA 2023'),
    'Disclosure cites SC/ST PoA Act Section 15A and DPDPA 2023'
  );

  // --------------------------------------------------------------------------
  // 2. Demo Accounts (5 Roles)
  // --------------------------------------------------------------------------
  console.log('\n--- 2. Demo Accounts (5 Roles) ---');
  const requiredAccountKeys = ['survivor', 'counsellor', 'district_officer', 'state_officer', 'administrator'];
  assert(
    requiredAccountKeys.every(k => DEMO_ACCOUNTS[k] !== undefined),
    'All 5 required demo accounts exist in registry'
  );

  assert(DEMO_ACCOUNTS.survivor.role === 'victim', 'Survivor account role is "victim"');
  assert(DEMO_ACCOUNTS.counsellor.role === 'counsellor', 'Counsellor account role is "counsellor"');
  assert(DEMO_ACCOUNTS.district_officer.role === 'district_officer', 'District Officer account role is "district_officer"');
  assert(DEMO_ACCOUNTS.state_officer.role === 'state_admin', 'State Officer account role is "state_admin"');
  assert(DEMO_ACCOUNTS.administrator.role === 'national_admin', 'Administrator account role is "national_admin"');

  // Verify synthetic identifiers
  for (const acc of Object.values(DEMO_ACCOUNTS)) {
    assert(
      acc.syntheticEmail.includes('.demo@') || acc.syntheticEmail.includes('demo@'),
      `Account ${acc.displayName} uses synthetic demo email domain (${acc.syntheticEmail})`
    );
    assert(acc.permissionsDescription.length > 20, `Account ${acc.displayName} defines clear permission scope`);
  }

  // --------------------------------------------------------------------------
  // 3. Realistic Demo Scenarios (6 Scenarios)
  // --------------------------------------------------------------------------
  console.log('\n--- 3. Realistic Scenarios (6 Scenarios) ---');
  assert(DEMO_SCENARIOS.length === 6, 'Exactly 6 realistic demo scenarios defined');

  const s1 = DEMO_SCENARIOS.find(s => s.scenarioNumber === 1);
  const s2 = DEMO_SCENARIOS.find(s => s.scenarioNumber === 2);
  const s3 = DEMO_SCENARIOS.find(s => s.scenarioNumber === 3);
  const s4 = DEMO_SCENARIOS.find(s => s.scenarioNumber === 4);
  const s5 = DEMO_SCENARIOS.find(s => s.scenarioNumber === 5);
  const s6 = DEMO_SCENARIOS.find(s => s.scenarioNumber === 6);

  assert(s1 !== undefined && s1.title.toLowerCase().includes('stable survivor'), 'Scenario 1: Stable survivor validated');
  assert(s1?.riskStatus === 'Stable', 'Scenario 1 reflects Stable baseline status');

  assert(s2 !== undefined && s2.title.toLowerCase().includes('increasing distress trend'), 'Scenario 2: Increasing distress trend validated');
  assert(Boolean(s2 && s2.currentScore === 71 && s2.baselineScore === 38), 'Scenario 2 reflects +33 surge (38 -> 71)');

  assert(s3 !== undefined && s3.title.toLowerCase().includes('missed check-ins'), 'Scenario 3: Missed check-ins validated');
  assert(Boolean(s3?.clinicalSignals.some(sig => sig.toLowerCase().includes('unanswered') || sig.toLowerCase().includes('missed'))),
    'Scenario 3 includes missed check-in signals'
  );

  assert(s4 !== undefined && s4.title.toLowerCase().includes('case milestone followed by distress increase'), 'Scenario 4: Milestone distress validated');
  assert(Boolean(s4?.narrative.toLowerCase().includes('summons') || s4?.narrative.toLowerCase().includes('milestone')),
    'Scenario 4 links legal milestone to psychological distress spike'
  );

  assert(s5 !== undefined && s5.title.toLowerCase().includes('alert requiring counsellor review'), 'Scenario 5: Alert review validated');
  assert(Boolean(s5?.targetRole === 'counsellor' && s5?.riskStatus === 'High Concern'),
    'Scenario 5 routes high concern alert to counsellor'
  );

  assert(s6 !== undefined && s6.title.toLowerCase().includes('resolved support intervention'), 'Scenario 6: Resolved intervention validated');
  assert(Boolean(s6 && s6.currentScore === 42 && s6.scoreDeltaFormatted.includes('-27')),
    'Scenario 6 demonstrates positive recovery delta (-27 pts)'
  );

  // --------------------------------------------------------------------------
  // 4. 8-Stage End-to-End Lifecycle Progression
  // --------------------------------------------------------------------------
  console.log('\n--- 4. 8-Stage Lifecycle Progression ---');
  assert(LIFECYCLE_STAGES.length === 8, '8 distinct lifecycle stages present');

  const expectedStageKeys = [
    'checkin',
    'ai_analysis',
    'distress_indicator',
    'risk_prediction',
    'alert',
    'counsellor_review',
    'intervention',
    'resolution',
  ];

  for (let i = 0; i < expectedStageKeys.length; i++) {
    assert(
      LIFECYCLE_STAGES[i].stageKey === expectedStageKeys[i],
      `Stage ${i + 1} correctly mapped to "${expectedStageKeys[i]}"`
    );
    assert(
      LIFECYCLE_STAGES[i].inputDescription.length > 10 &&
      LIFECYCLE_STAGES[i].outputDescription.length > 10,
      `Stage ${i + 1} (${LIFECYCLE_STAGES[i].title}) has detailed input & output specifications`
    );
  }

  console.log(`\nPhase 18 Demonstration Mode Test Suite: ${passed ? 'ALL PASSED ✨' : 'SOME TESTS FAILED ❌'}\n`);
  return passed;
}

if (require.main === module) {
  const success = runDemonstrationModeTests();
  process.exit(success ? 0 : 1);
}
