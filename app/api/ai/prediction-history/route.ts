import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_PREDICTION_HISTORY } from '@/lib/ai/prediction-history';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const caseId = searchParams.get('caseId');

  const history = caseId
    ? INITIAL_PREDICTION_HISTORY.filter((p) => p.caseId.toLowerCase() === caseId.toLowerCase())
    : INITIAL_PREDICTION_HISTORY;

  return NextResponse.json({
    history,
    total: history.length,
    timestamp: new Date().toISOString(),
  });
}
