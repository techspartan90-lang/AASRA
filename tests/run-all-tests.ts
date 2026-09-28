/**
 * AASRA Care Automated Test Runner (Phases 1-5 Regression & Safety Gate)
 * Executes Unit Tests, Security Threat Scenarios, Authentication/Onboarding,
 * Multi-Channel Ingestion Engine, and AI Distress Analysis with Explainability.
 */

import { runRiskEngineUnitTests } from './unit/risk-engine.test';
import { runSecurityThreatScenarioTests } from './security/threat-scenarios.test';
import { runDynamicDistressTests } from './dynamic-distress-score.test';
import { runPredictiveRiskTests } from './predictive-risk.test';
import { runAlertManagementTests } from './alert-management.test';
import { runCounsellorWorkbenchTests } from './counsellor-workbench.test';
import { runDistrictStateAnalyticsTests } from './district-state-analytics.test';

export function runAllAppletTests() {
  console.log('================================================================');
  console.log('AASRA CARE PLATFORM: COMPLETE SYSTEM VERIFICATION SUITE');
  console.log('================================================================\n');

  const unitResults = runRiskEngineUnitTests();
  const securityResults = runSecurityThreatScenarioTests();
  runDynamicDistressTests();
  runPredictiveRiskTests();
  runAlertManagementTests();
  runCounsellorWorkbenchTests();
  runDistrictStateAnalyticsTests();

  const allSuites = [unitResults, securityResults];
  let totalPassed = 0;
  let totalFailed = 0;

  for (const suite of allSuites) {
    console.log(`--- [SUITE] ${suite.suite} ---`);
    for (const test of suite.tests) {
      console.log(`  ${test}`);
    }
    console.log(`Summary: ${suite.passed} passed, ${suite.failed} failed\n`);
    totalPassed += suite.passed;
    totalFailed += suite.failed;
  }

  const total = totalPassed + totalFailed;
  console.log('================================================================');
  console.log(`CORE SUITES: ${total} | PASSED: ${totalPassed} | FAILED: ${totalFailed}`);
  console.log('================================================================');

  return {
    total,
    totalPassed,
    totalFailed,
    status: totalFailed === 0 ? 'ALL_TESTS_PASSED' : 'TESTS_FAILED',
    suites: allSuites,
  };
}

// Allow direct CLI execution via tsx / node if run directly
if (typeof require !== 'undefined' && require.main === module) {
  const result = runAllAppletTests();
  if (result.totalFailed > 0) {
    process.exit(1);
  }
}
