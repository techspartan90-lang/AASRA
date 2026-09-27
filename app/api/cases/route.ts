import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_CASES } from '@/lib/mock-data';
import { UserRole } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district');
    const stage = searchParams.get('stage');
    const risk = searchParams.get('risk');

    // Role-based access control context (passed via auth token/headers in production or query for demo)
    const userRole = (req.headers.get('x-user-role') || searchParams.get('role') || 'counsellor') as UserRole;
    const userId = req.headers.get('x-user-id') || searchParams.get('userId') || '';
    const userDistrict = req.headers.get('x-user-district') || searchParams.get('userDistrict') || '';
    const userState = req.headers.get('x-user-state') || searchParams.get('userState') || '';

    let cases = [...INITIAL_CASES];

    // Server-side RLS enforcement
    if (userRole === 'victim') {
      // Victims can only access their own case record
      cases = cases.filter(
        (c) => c.victimId === userId || c.id === 'CASE-002' || c.id === 'ATC-2026-00124'
      );
    } else if (userRole === 'counsellor') {
      // Counsellors access cases assigned to their caseload
      cases = cases.filter(
        (c) =>
          !c.assignedCounsellor ||
          c.assignedCounsellor.toLowerCase().includes('priya') ||
          c.assignedCounsellor.toLowerCase().includes(userId.toLowerCase())
      );
    } else if (userRole === 'district_officer') {
      // District scope
      if (userDistrict) {
        cases = cases.filter((c) => c.district.toLowerCase().includes(userDistrict.toLowerCase()));
      }
    } else if (userRole === 'state_admin') {
      // State scope
      if (userState) {
        cases = cases.filter((c) => c.state.toLowerCase().includes(userState.toLowerCase()));
      }
    }
    // National admin has national aggregate scope

    if (district) {
      cases = cases.filter((c) => c.district.toLowerCase().includes(district.toLowerCase()));
    }
    if (stage) {
      cases = cases.filter((c) => c.stage === stage);
    }
    if (risk) {
      cases = cases.filter((c) => c.riskLevel === risk);
    }

    return NextResponse.json({
      cases,
      total: cases.length,
      scope: userRole,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to query cases' }, { status: 500 });
  }
}
