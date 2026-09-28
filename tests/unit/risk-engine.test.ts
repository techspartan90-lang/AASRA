/**
 * Unit Tests: Distress Risk Engine, Baseline, and Trajectory Calculations
 */

import { DistressRiskEngine } from '../../lib/engines/risk-engine';
import { calculatePersonalBaseline, detectTrend } from '../../lib/engines/longitudinal-engine';
import { extractFeatureVector } from '../../lib/ai/feature-engineering';
import { DEFAULT_ML_MODEL } from '../../lib/ai/ml-models';

export function runRiskEngineUnitTests(): { suite: string; passed: number; failed: number; tests: string[] } {
  let passed = 0;
  let failed = 0;
  const tests: string[] = [];

  function assert(testName: string, condition: boolean) {
    if (condition) {
      passed++;
      tests.push(`[PASS] ${testName}`);
    } else {
      failed++;
      tests.push(`[FAIL] ${testName}`);
      console.error(`Assertion failed: ${testName}`);
    }
  }

  // 1. Personal baseline calculation without fabricated history
  const historyEmpty: number[] = [];
  const baselineEmpty = calculatePersonalBaseline(historyEmpty, 40);
  assert('Empty history returns default resting anchor (40) without fabricating past scores', baselineEmpty === 40);

  const historyValid = [34, 37, 40, 41, 38];
  const baselineValid = calculatePersonalBaseline(historyValid);
  assert('Historical observations [34, 37, 40, 41, 38] produce baseline of 38', baselineValid === 38);

  // 2. Trajectory slope and momentum
  const trajectory = detectTrend([
    { score: 38 },
    { score: 46 },
    { score: 57 },
    { score: 71 },
  ]);
  assert('Ascending scores produce Increasing or Rapidly increasing trend', trajectory.trend.toLowerCase().includes('increasing'));
  assert('Escalating scores detect positive velocity', trajectory.velocity > 0);

  // 3. Risk Engine deterministic calculation
  const normalCheckIn = DistressRiskEngine.analyzeCheckIn({
    feelingScore: 4,
    safetyScore: 4,
    sleepScore: 4,
    fearScore: 1,
    avoidanceScore: 1,
    requestHelp: false,
    historicalScores: [35, 38],
    previousScore: 38,
  });
  assert('Low symptom input produces low/medium distress indicator (< 45)', normalCheckIn.indicator < 45);

  const elevatedCheckIn = DistressRiskEngine.analyzeCheckIn({
    feelingScore: 1,
    safetyScore: 1,
    sleepScore: 1,
    fearScore: 5,
    avoidanceScore: 4,
    requestHelp: true,
    historicalScores: [38, 46, 57],
    previousScore: 57,
  });
  assert('Severe symptoms and help request produce elevated or high distress level', elevatedCheckIn.level === 'elevated' || elevatedCheckIn.level === 'high');
  assert('Baseline deviation is positive and reflects increase from historical 38', elevatedCheckIn.baselineDeviation > 0);

  // 4. ML Model Predictor
  const features = extractFeatureVector(
    {
      feelingScore: 4,
      safetyScore: 5,
      sleepScore: 4,
      fearScore: 5,
      avoidanceScore: 4,
      requestHelp: true,
    },
    elevatedCheckIn.indicator,
    [38, 46, 57]
  );
  const prediction = DEFAULT_ML_MODEL.predict(features, 3);
  assert('ML prediction returns valid non-empty model version', Boolean(prediction.modelVersion));
  assert('ML prediction includes required non-diagnostic disclaimer', prediction.disclaimer.includes('not a clinical diagnosis'));
  assert('ML prediction probability is bounded within [0, 1]', prediction.confidence >= 0 && prediction.confidence <= 1);

  return { suite: 'Risk Engine & Baseline Unit Tests', passed, failed, tests };
}
