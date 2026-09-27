import { NextResponse } from 'next/server';
import { getSupabaseConfig } from '@/lib/supabase';
import { repositories } from '@/lib/repositories';

export async function GET() {
  const config = getSupabaseConfig();
  const dbType = config.isConfigured ? 'supabase_postgresql' : 'in_memory_high_fidelity_demo';

  try {
    // Ping repository layer to test latency and readiness
    const cases = await repositories.cases.getAll();

    return NextResponse.json(
      {
        status: 'healthy',
        service: 'database',
        backend: dbType,
        configured: config.isConfigured,
        activeRecordsCount: cases.length,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        status: 'degraded',
        service: 'database',
        backend: dbType,
        error: 'Database query timeout or connection retry',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
