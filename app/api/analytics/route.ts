import { NextResponse } from 'next/server';
import { DISTRICT_AGGREGATES, STATE_AGGREGATES, INITIAL_CASES } from '@/lib/mock-data';

export async function GET() {
  const totalMonitored = INITIAL_CASES.length;
  const elevatedCount = INITIAL_CASES.filter(c => c.riskLevel === 'elevated' || c.riskLevel === 'high').length;
  const highPriorityCount = INITIAL_CASES.filter(c => c.riskLevel === 'high').length;

  return NextResponse.json({
    metrics: {
      totalMonitoredCases: 1777, // aggregate national baseline
      activeMonitoredCases: 704,
      casesRequiringFollowUp: 68,
      elevatedIndicators: elevatedCount,
      highPriorityReviews: highPriorityCount,
      interventionsCompleted: 1075,
      counsellingSlaRate: 93.8,
    },
    stateAggregates: STATE_AGGREGATES,
    districtAggregates: DISTRICT_AGGREGATES,
    riskDistribution: {
      stable: 42,
      mild: 31,
      elevated: 19,
      high: 8,
    },
    timestamp: new Date().toISOString(),
  });
}
