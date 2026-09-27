import { NextRequest, NextResponse } from 'next/server';
import { repositories } from '@/lib/repositories';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await repositories.alerts.update(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    await repositories.audit.create({
      userId: body.actor || 'Authorized Caseworker',
      action: 'ALERT_STATUS_UPDATED',
      resource: `Alert ${id}`,
      resourceId: id,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      metadata: { status: body.status, caseId: updated.caseId },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 });
  }
}
