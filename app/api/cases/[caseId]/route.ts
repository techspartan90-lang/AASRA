import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_CASES } from '@/lib/mock-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ caseId: string }> }
) {
  const { caseId } = await params;
  const found = INITIAL_CASES.find(c => c.id.toLowerCase() === caseId.toLowerCase());

  if (!found) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 });
  }

  return NextResponse.json({
    case: found,
    timestamp: new Date().toISOString(),
  });
}
