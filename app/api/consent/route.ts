import { NextRequest, NextResponse } from 'next/server';
import { repositories } from '@/lib/repositories';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'default';
    const consent = await repositories.consent.getByUserId(userId);
    return NextResponse.json({ consent });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve consent' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || 'default';
    const updated = await repositories.consent.update(userId, {
      aiAnalysis: body.aiAnalysis,
      voiceAnalysis: body.voiceAnalysis,
      communication: body.communication,
      updatedAt: new Date().toISOString().split('T')[0],
    });

    await repositories.audit.create({
      userId,
      action: 'CONSENT_RECORD_MODIFIED',
      resource: 'User Profile',
      resourceId: userId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      metadata: body,
    });

    return NextResponse.json({ consent: updated, message: 'Consent preferences recorded successfully.' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update consent' }, { status: 500 });
  }
}
