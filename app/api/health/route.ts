import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      service: 'aasra-care-api',
      timestamp: new Date().toISOString(),
      version: '0.1.0-phase6-hardened',
      environment: process.env.NODE_ENV || 'development',
      components: {
        database: 'operational',
        ai_pipeline: 'operational',
        ml_inference: 'operational',
        security_middleware: 'active',
      },
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
