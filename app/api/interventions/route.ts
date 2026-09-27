import { NextRequest, NextResponse } from 'next/server';
import { repositories } from '@/lib/repositories';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get('caseId');

    const interventions = caseId
      ? await repositories.interventions.getByCaseId(caseId)
      : await repositories.interventions.getAll();

    return NextResponse.json({
      interventions,
      total: interventions.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch interventions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { caseId, type, description, assignedTo = 'Dr. Priya Nair', notes, userId = 'usr-counsellor-002' } = body;

    if (!caseId || !type || !description) {
      return NextResponse.json({ error: 'caseId, type, and description are required' }, { status: 400 });
    }

    const validCategories = ['counselling', 'protection', 'medical', 'financial', 'legal', 'rehabilitation'];
    const interventionType = validCategories.includes(type) ? type : 'counselling';

    const created = await repositories.interventions.create({
      caseId,
      type: interventionType,
      description,
      assignedTo,
      status: 'scheduled',
      startDate: new Date().toISOString(),
      notes: notes || '',
    });

    // Notify victim
    await repositories.notifications.create({
      userId: 'usr-victim-001',
      type: 'intervention',
      title: 'Support Session Scheduled',
      message: `A new care intervention "${type}" has been planned with ${assignedTo}.`,
    });

    // Audit log
    await repositories.audit.create({
      userId,
      action: 'CREATE_INTERVENTION',
      resource: 'interventions',
      resourceId: created.id,
      metadata: {
        caseId,
        type,
        assignedTo,
      },
    });

    return NextResponse.json({
      success: true,
      intervention: created,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to record intervention' }, { status: 500 });
  }
}
