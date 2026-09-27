import { NextRequest, NextResponse } from 'next/server';
import { repositories } from '@/lib/repositories';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resourceId = searchParams.get('resourceId');

    let logs = await repositories.audit.getAll();
    if (resourceId) {
      logs = logs.filter(l => l.resourceId === resourceId || l.resource.includes(resourceId));
    }

    return NextResponse.json({ auditLogs: logs, total: logs.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve audit logs' }, { status: 500 });
  }
}
