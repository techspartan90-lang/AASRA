import { aiDistressEngine } from '../lib/ai-distress-engine';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${testName}`);
    failed++;
  }
}

async function runAiDistressAnalysisTests() {
  console.log('\n--- Running Phase 5 AI Distress Analysis Engine Tests ---');

  // Test 1: Baseline / Calm scenario
  const calmResult = await aiDistressEngine.analyzeDistress({
    moodResponse: 'Calm',
    textResponse: 'Today I feel calm and supported. Slept well.',
    baselineIndicator: 50,
  });

  assert(
    typeof calmResult.distress_indicator === 'number' && calmResult.distress_indicator <= 30,
    'Calm mood and positive text produce low distress indicator (<= 30)'
  );
  assert(
    typeof calmResult.confidence === 'number' && calmResult.confidence > 0.8,
    'Model output includes calibrated confidence (> 0.8)'
  );
  assert(
    Array.isArray(calmResult.contributing_signals) && calmResult.contributing_signals.length > 0,
    'Contributing signals list is populated'
  );
  assert(
    typeof calmResult.trend_change === 'string',
    'Longitudinal trend change comparison is calculated'
  );
  assert(
    typeof calmResult.recommended_follow_up === 'string',
    'Human caseworker follow-up recommendation is provided'
  );

  // Test 2: Text Analysis - Hopelessness and Fear
  const fearResult = await aiDistressEngine.analyzeDistress({
    moodResponse: 'Worried',
    textResponse: 'I am so scared of the threat. I feel hopeless and cannot sleep.',
    baselineIndicator: 50,
  });

  assert(
    fearResult.distress_indicator >= 65,
    'Fear and hopelessness language significantly elevates distress indicator'
  );
  assert(
    fearResult.contributing_signals.some(s => s.toLowerCase().includes('fear')),
    'Explainability identifies fear and anxiety keywords in contributing signals'
  );
  assert(
    fearResult.contributing_signals.some(s => s.toLowerCase().includes('hopeless')),
    'Explainability identifies hopelessness indicators in contributing signals'
  );

  // Test 3: Voice Acoustics - Tremor and Jitter
  const voiceResult = await aiDistressEngine.analyzeDistress({
    moodResponse: 'Okay',
    textResponse: 'Routine check-in',
    voiceAcoustics: {
      hasAudio: true,
      pitchJitter: 0.055, // Elevated (> 0.04)
      tremorIndex: 0.62, // Elevated (> 0.45)
      pausesDurationSeconds: 5.5, // Prolonged (> 4.0)
    },
    baselineIndicator: 50,
  });

  assert(
    voiceResult.contributing_signals.some(s => s.toLowerCase().includes('jitter')),
    'Voice pitch jitter perturbation is recognized in contributing signals'
  );
  assert(
    voiceResult.contributing_signals.some(s => s.toLowerCase().includes('tremor')),
    'Acoustic micro-tremor index is captured in explainability breakdown'
  );
  assert(
    voiceResult.contributing_signals.some(s => s.toLowerCase().includes('hesitation') || s.toLowerCase().includes('pauses')),
    'Prolonged hesitation pause duration is captured in explainability breakdown'
  );

  // Test 4: Behavioral Cadence - Missed Check-ins and Engagement Shifts
  const behaviorResult = await aiDistressEngine.analyzeDistress({
    moodResponse: 'Okay',
    behavioralContext: {
      missedCheckIns: 2,
      decliningEngagement: true,
      suddenInteractionChange: true,
      repeatedSupportRequests: 2,
    },
    baselineIndicator: 50,
  });

  assert(
    behaviorResult.contributing_signals.some(s => s.toLowerCase().includes('missed')),
    'Behavioral analysis accounts for missed routine check-ins'
  );
  assert(
    behaviorResult.contributing_signals.some(s => s.toLowerCase().includes('engagement')),
    'Behavioral analysis detects declining engagement depth'
  );

  // Test 5: Case Milestone Context - Proximity to Court Hearing and Threats
  const milestoneResult = await aiDistressEngine.analyzeDistress({
    moodResponse: 'Worried',
    milestoneContext: {
      hearingDateProximityDays: 2, // Within 48 hours
      reportedThreatsPresent: true,
      rehabilitationEventScheduled: false,
    },
    baselineIndicator: 50,
  });

  assert(
    milestoneResult.distress_indicator >= 75,
    'Immediate pre-trial hearing proximity combined with threats produces elevated situational distress'
  );
  assert(
    milestoneResult.contributing_signals.some(s => s.toLowerCase().includes('court hearing')),
    'Judicial hearing proximity is explicitly cited as situational stressor'
  );
  assert(
    milestoneResult.contributing_signals.some(s => s.toLowerCase().includes('intimidation') || s.toLowerCase().includes('threat')),
    'Witness intimidation concern is cited in contributing signals'
  );

  // Test 6: CRITICAL SAFETY - Never return a definitive psychiatric diagnosis
  const testOutputs = [calmResult, fearResult, voiceResult, behaviorResult, milestoneResult];
  const forbiddenDiagnoses = [
    'diagnosed with ptsd',
    'has major depressive disorder',
    'schizophrenia',
    'clinical depression diagnosis',
    'patient has bipolar',
    'prescribe',
  ];

  testOutputs.forEach((out, idx) => {
    const serialized = JSON.stringify(out).toLowerCase();
    const hasForbiddenDiagnosis = forbiddenDiagnoses.some(d => serialized.includes(d));
    assert(
      !hasForbiddenDiagnosis,
      `Scenario ${idx + 1} strictly avoids definitive psychiatric diagnosis`
    );
  });

  console.log(`\nPhase 5 Test Summary: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

runAiDistressAnalysisTests().catch(err => {
  console.error('AI Distress Analysis test runner error:', err);
  process.exit(1);
});
