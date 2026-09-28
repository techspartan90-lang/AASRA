import {
  predictiveRiskEngine,
  PredictiveRiskInput,
  PredictionWindow,
} from '../lib/predictive-risk-engine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export function runPredictiveRiskTests() {
  console.log('🧪 Starting Phase 7: Predictive Risk Modelling Engine Test Suite...');

  // Standard test baseline input
  const baseInput: PredictiveRiskInput = {
    survivorId: 'usr-victim-001',
    predictionWindow: '7 days',
    distressTrend: [32, 36, 41, 48, 47],
    baselineDeviation: 19,
    checkInFrequency: 'daily',
    engagementChange: 'declining',
    textSignals: ['Court hearing anxiety', 'Sleep disruption'],
    voiceFeatureMetadata: {
      hasAudio: true,
      pitchJitter: 0.048,
      speakingRateWpm: 92,
      pausesDurationSec: 4.2,
      tremorIndex: 0.46,
    },
    caseMilestoneContext: {
      hearingDateProximityDays: 5,
      reportedThreatsPresent: false,
      investigationStatus: 'chargesheet_filed',
      caseDelayMonths: 2,
    },
    previousSupportInteractions: 3,
    inputVersion: 'inp-v2.4',
  };

  // Test 1: 7-Day Prediction Window Output
  const res7d = predictiveRiskEngine.predictLocally(baseInput);
  assert(res7d.timeHorizon === '7 days', `Expected horizon '7 days', got ${res7d.timeHorizon}`);
  assert(res7d.riskIndicator.includes('next 7 days'), `Indicator must specify next 7 days, got: ${res7d.riskIndicator}`);
  assert(res7d.confidence >= 0.85, `7-day confidence should be >= 0.85, got ${res7d.confidence}`);
  assert(res7d.contributingFactors.length >= 4, `Expected at least 4 contributing factors, got ${res7d.contributingFactors.length}`);
  assert(Boolean(res7d.recommendedFollowUp), 'Must provide recommended follow-up');
  console.log('  ✅ Test 1 Passed: 7-Day prediction window generates calibrated risk indicator and follow-up');

  // Test 2: 14-Day Prediction Window
  const res14d = predictiveRiskEngine.predictLocally({ ...baseInput, predictionWindow: '14 days' });
  assert(res14d.timeHorizon === '14 days', `Expected horizon '14 days', got ${res14d.timeHorizon}`);
  assert(res14d.riskIndicator.includes('next 14 days'), `Indicator must reference next 14 days, got: ${res14d.riskIndicator}`);
  assert(res14d.uncertaintyIndicator.level === 'Moderate', '14-day uncertainty level should be Moderate');
  console.log('  ✅ Test 2 Passed: 14-Day prediction window evaluates mid-term horizon dynamics');

  // Test 3: 30-Day Prediction Window
  const res30d = predictiveRiskEngine.predictLocally({ ...baseInput, predictionWindow: '30 days' });
  assert(res30d.timeHorizon === '30 days', `Expected horizon '30 days', got ${res30d.timeHorizon}`);
  assert(res30d.riskIndicator.includes('next 30 days'), `Indicator must reference next 30 days, got: ${res30d.riskIndicator}`);
  assert(res30d.uncertaintyIndicator.varianceMarginPts >= 15.0, '30-day uncertainty margin should be >= 15 pts');
  console.log('  ✅ Test 3 Passed: 30-Day prediction window correctly reflects higher longitudinal variance');

  // Test 4: Uncertainty Indicator presence and properties
  assert(Boolean(res7d.uncertaintyIndicator), 'Uncertainty indicator must be present');
  assert(typeof res7d.uncertaintyIndicator.varianceMarginPts === 'number', 'Variance margin must be numeric');
  assert(res7d.uncertaintyIndicator.description.includes('±'), 'Description must cite variance margin');
  console.log('  ✅ Test 4 Passed: Uncertainty indicator includes level, margin of error, and accessible description');

  // Test 5: Model Explanation in Plain Language ("Why did the indicator change?")
  assert(res7d.modelExplanation.headline === 'Why did the indicator change?', 'Explanation headline must match spec');
  assert(Boolean(res7d.modelExplanation.plainLanguageSummary), 'Must include plain language summary');
  assert(res7d.modelExplanation.primaryDrivers.length > 0, 'Must include primary drivers list');
  assert(res7d.modelExplanation.plainLanguageSummary.includes('operational compass') || res7d.modelExplanation.plainLanguageSummary.includes('likelihoods rather than certainties'), 'Explanation must reinforce probabilistic operational framing');
  console.log('  ✅ Test 5 Passed: Plain language explanation answers "Why did the indicator change?"');

  // Test 6: Model Version Tracking and Audit Log
  const tracking = res7d.modelVersionTracking;
  assert(tracking.modelVersion === 'aasra-predictive-v1.4.2', `Expected version 'aasra-predictive-v1.4.2', got ${tracking.modelVersion}`);
  assert(Boolean(tracking.predictionTimestamp), 'Must record prediction timestamp');
  assert(tracking.predictionWindow === '7 days', 'Must record prediction window');
  assert(Boolean(tracking.predictionOutput), 'Must record prediction output');
  assert(typeof tracking.confidence === 'number', 'Must record confidence');
  assert(tracking.inputVersion === 'inp-v2.4', 'Must record input version');

  const history = predictiveRiskEngine.getStoredPredictions();
  assert(history.length >= 3, `Expected at least 3 historical predictions, got ${history.length}`);
  console.log('  ✅ Test 6 Passed: Model version tracking records all 6 required fields in audit provenance log');

  // Test 7: Strict Ethical Guardrail - Prohibit "This survivor will become suicidal"
  const unsafeText = 'This survivor will become suicidal and will definitely decompensate.';
  const sanitized = predictiveRiskEngine.sanitizeLanguage(unsafeText);
  assert(!sanitized.toLowerCase().includes('will become suicidal'), 'Sanitizer must eliminate "will become suicidal"');
  assert(!sanitized.toLowerCase().includes('will definitely'), 'Sanitizer must eliminate deterministic "will definitely"');
  console.log('  ✅ Test 7 Passed: Ethical safety guardrail forbids fatalistic/certainty language');

  // Test 8: Impact of Reported Threats
  const threatInput: PredictiveRiskInput = {
    ...baseInput,
    caseMilestoneContext: {
      reportedThreatsPresent: true,
      hearingDateProximityDays: 20,
    },
  };
  const threatRes = predictiveRiskEngine.predictLocally(threatInput);
  assert(threatRes.riskIndicator.toLowerCase().includes('elevated'), 'Threat report must trigger elevated risk indicator');
  assert(threatRes.contributingFactors.some(f => f.toLowerCase().includes('intimidation') || f.toLowerCase().includes('threat')), 'Must record threat as contributing factor');
  console.log('  ✅ Test 8 Passed: Reported threats correctly trigger elevated risk indicator and triage recommendation');

  // Test 9: Protective Buffer from Support Interactions
  const supportedInput: PredictiveRiskInput = {
    ...baseInput,
    baselineDeviation: 4,
    engagementChange: 'stable',
    previousSupportInteractions: 5,
    caseMilestoneContext: { hearingDateProximityDays: null },
  };
  const supportedRes = predictiveRiskEngine.predictLocally(supportedInput);
  assert(supportedRes.riskIndicator.toLowerCase().includes('stable'), 'High support and low baseline deviation should project stable trajectory');
  assert(supportedRes.contributingFactors.some(f => f.includes('Protective buffer')), 'Must record protective buffer');
  console.log('  ✅ Test 9 Passed: Protective support interactions provide positive stabilizing factor');

  // Test 10: Non-Clinical Disclaimer Integrity
  assert(res7d.nonClinicalDisclaimer.includes('NOT clinical certainties, medical diagnoses'), 'Disclaimer must clarify non-clinical operational nature');
  console.log('  ✅ Test 10 Passed: Non-clinical disclaimer strictly present');

  console.log('🎉 All Phase 7 Predictive Risk Modelling tests passed successfully!\n');
}

if (require.main === module) {
  runPredictiveRiskTests();
}
