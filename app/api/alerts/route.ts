import { NextRequest, NextResponse } from 'next/server';
import { repositories } from '@/lib/repositories';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get('caseId');

    const alerts = caseId
      ? await repositories.alerts.getByCaseId(caseId)
      : await repositories.alerts.getAll();

    return NextResponse.json({
      alerts,
      total: alerts.length,
      urgentCount: alerts.filter((a) => a.severity === 'high' || a.status === 'urgent').length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { caseId, severity, reason, recommendedAction, assignedTo } = body;

    const alert = await repositories.alerts.create({
      caseId,
      severity: (severity === 'high' || severity === 'elevated' || severity === 'mild' ? severity : 'elevated'),
      reason,
      status: 'pending',
      assignedTo: assignedTo || 'Dr. Priya Nair',
      recommendedAction,
    });

    return NextResponse.json({ success: true, alert });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 });
  }
}
