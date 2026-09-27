import { NextResponse } from 'next/server';
import { aiObservability } from '@/lib/ai/observability';

export async function GET() {
  const metrics = aiObservability.getMetrics();
  return NextResponse.json({
    metrics,
    timestamp: new Date().toISOString(),
  });
}
