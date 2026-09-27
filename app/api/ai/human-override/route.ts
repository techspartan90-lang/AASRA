import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_HUMAN_OVERRIDES, HumanOverrideRecord } from '@/lib/ai/human-override';
import { repositories } from '@/lib/repositories';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const caseId = searchParams.get('caseId');

  const records = caseId
    ? INITIAL_HUMAN_OVERRIDES.filter((r) => r.caseId === caseId)
    : INITIAL_HUMAN_OVERRIDES;

  return NextResponse.json({
    overrides: records,
    total: records.length,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      caseId,
      assessmentId = 'current',
      originalLevel,
      originalScore,
      originalTrajectory,
      overriddenLevel,
      overriddenScore,
      overrideReason,
      reviewerId = 'usr-counsellor-002',
      reviewerName = 'Dr. Priya Nair',
    } = body;

    if (!caseId || !overrideReason || !overriddenLevel) {
      return NextResponse.json(
        { error: 'caseId, overrideReason, and overriddenLevel are required' },
        { status: 400 }
      );
    }

    const overrideRecord: HumanOverrideRecord = {
      id: `OVR-${Date.now().toString(36).toUpperCase()}`,
      caseId,
      assessmentId,
      originalLevel: originalLevel || 'High concern',
      originalScore: originalScore || 71,
      originalTrajectory: originalTrajectory || 'Increasing',
      overriddenLevel,
      overriddenScore: overriddenScore || originalScore,
      overrideReason,
      reviewerId,
      reviewerName,
      timestamp: new Date().toISOString(),
    };

    INITIAL_HUMAN_OVERRIDES.unshift(overrideRecord);

    // Record audit event
    await repositories.audit.create({
      userId: reviewerId,
      action: 'HUMAN_CLINICAL_OVERRIDE',
      resource: `Case ${caseId}`,
      resourceId: caseId,
      metadata: {
        overrideId: overrideRecord.id,
        originalLevel,
        overriddenLevel,
        overrideReason,
      },
    });

    return NextResponse.json({
      success: true,
      override: overrideRecord,
      message: 'Human review override documented. Original AI prediction preserved for auditability.',
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to record override' }, { status: 500 });
  }
}
