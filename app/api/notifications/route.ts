import { NextRequest, NextResponse } from 'next/server';
import { repositories } from '@/lib/repositories';

export async function GET() {
  try {
    const notifications = await repositories.notifications.getAll();
    return NextResponse.json({ notifications, total: notifications.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve notifications' }, { status: 500 });
  }
}
