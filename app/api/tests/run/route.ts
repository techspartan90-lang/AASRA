import { NextResponse } from 'next/server';
import { runAllAppletTests } from '@/tests/run-all-tests';

export async function GET() {
  const result = await runAllAppletTests();
  return NextResponse.json(
    {
      ...result,
      timestamp: new Date().toISOString(),
    },
    {
      status: result.totalFailed === 0 ? 200 : 500,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    }
  );
}
