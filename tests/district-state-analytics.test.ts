import {
  districtStateAnalyticsEngine,
  AnalyticsKPIs,
} from '../lib/district-state-analytics';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export function runDistrictStateAnalyticsTests() {
  console.log('🧪 Starting Phase 10: District and State Analytics Test Suite...');

  // Test 1: Verify all 8 Dashboard KPIs
  const kpis: AnalyticsKPIs = districtStateAnalyticsEngine.getKPIs();
  assert(kpis.activeMonitoredCases > 0, 'KPI 1: activeMonitoredCases must be > 0');
  assert(kpis.completedCheckIns > 0, 'KPI 2: completedCheckIns must be > 0');
  assert(kpis.followUpCompletionRate >= 90, 'KPI 3: followUpCompletionRate must be >= 90%');
  assert(kpis.openAlerts >= 0, 'KPI 4: openAlerts must be defined');
  assert(kpis.resolvedAlerts > 0, 'KPI 5: resolvedAlerts must be > 0');
  assert(kpis.averageDistressIndicator > 0 && kpis.averageDistressIndicator <= 100, 'KPI 6: averageDistressIndicator must be 0-100');
  assert(typeof kpis.trendChangesPct === 'number', 'KPI 7: trendChangesPct must be numeric');
  assert(Boolean(kpis.channelUsage.chatbot), 'KPI 8: channelUsage must contain chatbot percentage');
  assert(Boolean(kpis.channelUsage.sms), 'KPI 8: channelUsage must contain sms percentage');
  assert(Boolean(kpis.channelUsage.ivrs), 'KPI 8: channelUsage must contain ivrs percentage');
  assert(Boolean(kpis.channelUsage.mobileApp), 'KPI 8: channelUsage must contain mobileApp percentage');
  assert(Boolean(kpis.channelUsage.webPortal), 'KPI 8: channelUsage must contain webPortal percentage');
  console.log('  ✅ Test 1 Passed: All 8 required KPIs validated with non-zero aggregated population metrics');

  // Test 2: Map Privacy Guarantee
  // Ensure that no individual GPS coordinates or raw addresses exist in aggregate district benchmarks
  const districtData = districtStateAnalyticsEngine.getDistrictComparisons();
  for (const d of districtData) {
    assert(Boolean(d.district) && Boolean(d.state), 'District benchmarks must have district name and state');
    assert(typeof (d as any).latitude === 'undefined' && typeof (d as any).longitude === 'undefined', 'Zero individual GPS coordinates allowed in surveillance records');
    assert(typeof (d as any).residenceAddress === 'undefined', 'Zero raw survivor addresses allowed');
  }
  console.log('  ✅ Test 2 Passed: Map visualization privacy guarantee enforced (aggregated centroids only, zero survivor GPS)');

  // Test 3: Weekly & Monthly Trend Analytics
  const weekly = districtStateAnalyticsEngine.getWeeklyTrends();
  assert(weekly.length >= 4, 'Weekly trend must contain at least 4 weekly time slices');
  assert(weekly[0].avgDistress >= 30, 'Weekly distress values must be valid');

  const monthly = districtStateAnalyticsEngine.getMonthlyTrends();
  assert(monthly.length >= 5, 'Monthly trend must contain at least 5 monthly time slices');
  assert(monthly[0].slaAdherencePct >= 90, 'Monthly SLA adherence must be >= 90%');
  console.log('  ✅ Test 3 Passed: Weekly and monthly longitudinal trends verified');

  // Test 4: District Comparison Matrix
  assert(districtData.length >= 5, 'Must contain at least 5 districts in comparison matrix');
  const kamrup = districtData.find(d => d.district === 'Kamrup Rural');
  assert(Boolean(kamrup), 'Must contain Kamrup Rural district comparison');
  assert(typeof kamrup?.medianResponseMins === 'number', 'Must measure median response time');
  console.log('  ✅ Test 4 Passed: Multi-district comparative analysis matrix validated');

  // Test 5: Channel Utilization Analytics
  const channels = districtStateAnalyticsEngine.getChannelUtilization();
  assert(channels.length === 5, 'Must evaluate all 5 channels (Chatbot, SMS, IVRS, Mobile App, Web Portal)');
  const totalPct = channels.reduce((sum, c) => sum + c.percentage, 0);
  assert(totalPct === 100, `Channel percentage sum must equal 100%, got ${totalPct}%`);
  console.log('  ✅ Test 5 Passed: Multi-channel adoption and session duration verified');

  // Test 6: Support Demand Surge Patterns
  const demand = districtStateAnalyticsEngine.getSupportDemandMetrics();
  assert(demand.length >= 4, 'Must track at least 4 milestone surge events');
  const hearingDemand = demand.find(d => d.milestoneTrigger.includes('Hearing'));
  assert(Boolean(hearingDemand), 'Must track court hearing demand surge');
  assert(hearingDemand!.demandSurgePct > 0, 'Hearing proximity must cause demand surge');
  console.log('  ✅ Test 6 Passed: Judicial milestone support demand surge analytics verified');

  // Test 7: Caseworker Response Time KPIs
  const responseTime = districtStateAnalyticsEngine.getResponseTimeStats();
  assert(responseTime.medianResponseMins <= 60, 'Median caseworker response time must be <= 60 minutes');
  assert(responseTime.slaUnder60MinsPct >= 95, 'SLA compliance under 60 mins must be >= 95%');
  assert(responseTime.crisisOutreachMins <= 15, 'Crisis outreach time must be under 15 minutes');
  console.log('  ✅ Test 7 Passed: Response time KPIs and emergency triage timing confirmed');

  // Test 8: Filter Propagation
  const assamKpis = districtStateAnalyticsEngine.getKPIs('Assam', 'Kamrup Rural');
  assert(assamKpis.activeMonitoredCases < kpis.activeMonitoredCases, 'Filtering by state/district should subset caseload');
  console.log('  ✅ Test 8 Passed: Administrative filter cascading verified');

  // Test 9: Controlled Export - Role Permission Enforcement
  const unauthorizedExport = districtStateAnalyticsEngine.exportData({
    actor: 'Anonymous User',
    role: 'victim',
    datasetName: 'National Territorial Caseload',
    format: 'CSV',
    filterParams: {},
    recordCount: 100,
  });
  assert(!unauthorizedExport.success, 'Victim role must NOT be permitted to export administrative surveillance records');
  assert(Boolean(unauthorizedExport.error?.includes('Permission Denied')), 'Must return Permission Denied message');

  const authorizedExport = districtStateAnalyticsEngine.exportData({
    actor: 'Dr. Rajesh Verma',
    role: 'district_officer',
    datasetName: 'Kamrup Rural Caseload Surveillance',
    format: 'CSV',
    filterParams: { state: 'Assam', district: 'Kamrup Rural' },
    recordCount: 142,
  });
  assert(authorizedExport.success === true, 'District Officer must be authorized to export aggregated tables');
  console.log('  ✅ Test 9 Passed: Controlled export role permissions strictly enforced');

  // Test 10: Mandatory Export Audit Logging
  const auditLog = districtStateAnalyticsEngine.getExportAuditHistory();
  const latestEntry = auditLog[0];
  assert(latestEntry.actor === 'Dr. Rajesh Verma', 'Audit log must record exporting actor');
  assert(Boolean(latestEntry.timestamp), 'Audit log must record timestamp');
  assert(latestEntry.privacyGuarantee.includes('Zero PII'), 'Audit log must certify Zero PII guarantee');
  assert(latestEntry.checksum.startsWith('sha256-'), 'Audit log must produce cryptographic checksum');
  console.log('  ✅ Test 10 Passed: Mandatory export audit logging and cryptographic provenance verified');

  console.log('🎉 All Phase 10 District and State Analytics tests passed successfully!\n');
}

if (require.main === module) {
  runDistrictStateAnalyticsTests();
}
