/**
 * AASRA Care Automated Test Runner (Phase 6)
 * Executes Unit Tests, Security Threat Scenarios, and Access Control Verifications.
 */

import { runRiskEngineUnitTests } from './unit/risk-engine.test';
import { runSecurityThreatScenarioTests } from './security/threat-scenarios.test';

export function runAllAppletTests() {
  console.log('================================================================');
  console.log('AASRA CARE PLATFORM: AUTOMATED TEST SUITE EXECUTION');
  console.log('================================================================\n');

  const unitResults = runRiskEngineUnitTests();
  const securityResults = runSecurityThreatScenarioTests();

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
  console.log(`TOTAL TESTS: ${total} | PASSED: ${totalPassed} | FAILED: ${totalFailed}`);
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
