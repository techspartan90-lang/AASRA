import { NextRequest, NextResponse } from 'next/server';
import { DistressRiskEngine } from '@/lib/engines/risk-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      caseId = 'CASE-002',
      indicator = 71,
      baseline = 38,
      baselineDeviation = 33,
      contributingFactors = [],
      trend = 'Increasing',
    } = body;

    const delta = indicator - baseline;
    const explanation = {
      caseId,
      indicator,
      baseline,
      baselineDeviation: delta,
      trend,
      whyFlagged: [
        delta > 15 ? `Indicator is substantially higher (+${delta} pts) than individual baseline of ${baseline}/100` : `Indicator shifted +${delta} points from baseline`,
        ...contributingFactors,
      ],
      recommendedHumanAction: indicator >= 75
        ? 'Urgent human counsellor review within 24 hours and protective support evaluation'
        : indicator >= 50
        ? 'Prioritized tele-counselling follow-up and psycho-legal orientation within 48 hours'
        : 'Routine scheduled case worker contact',
      ethicalDisclaimer: 'AI-generated screening support — not a clinical diagnosis. All support actions require authorized human review.',
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(explanation);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate risk explanation' }, { status: 500 });
  }
}
