import { NextRequest, NextResponse } from 'next/server';
import { repositories } from '@/lib/repositories';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get('caseId');

    let appointments = await repositories.appointments.getAll();
    if (caseId) {
      appointments = appointments.filter(a => a.caseId === caseId);
    }

    return NextResponse.json({ appointments, total: appointments.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve appointments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await repositories.appointments.create({
      caseId: body.caseId || 'CASE-002',
      type: body.type || 'counselling',
      scheduledAt: body.scheduledAt || '2026-09-28 11:00 AM',
      status: 'scheduled',
      assignedTo: body.assignedTo || 'Assigned Professional',
      notes: body.notes || 'Scheduled support appointment',
    });

    await repositories.audit.create({
      userId: 'Counsellor',
      action: 'APPOINTMENT_SCHEDULED',
      resource: `Case ${created.caseId}`,
      resourceId: created.caseId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      metadata: { appointmentId: created.id, type: created.type },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
