import { NextRequest, NextResponse } from 'next/server';
import { repositories } from '@/lib/repositories';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;
    const checkIns = await repositories.checkIns.getByCaseId(caseId);
    return NextResponse.json({ caseId, checkIns });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve check-ins' }, { status: 500 });
  }
}
