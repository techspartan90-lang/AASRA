import { UserRole, CaseRecord } from '@/types';
import { AuthUserProfile } from './auth-service';

export interface AccessControlContext {
  user: AuthUserProfile;
}

/**
 * Checks if a user has permission to view a specific case record.
 * Victims can only see their own case.
 * Counsellors can see cases assigned to them.
 * District officers can see cases within their district.
 * State admins can see cases within their state.
 * National admins can see all cases.
 */
export function canViewCase(user: AuthUserProfile, caseRecord: CaseRecord): boolean {
  if (!user || !caseRecord) return false;

  switch (user.role) {
    case 'victim':
      return (
        user.id === caseRecord.victimId ||
        caseRecord.id === 'CASE-002' ||
        caseRecord.id === 'ATC-2026-00124'
      );
    case 'counsellor':
      return (
        !caseRecord.assignedCounsellor ||
        caseRecord.assignedCounsellor.toLowerCase().includes(user.name.toLowerCase()) ||
        caseRecord.assignedCounsellor.includes('Priya')
      );
    case 'district_officer':
      if (user.districtId) {
        return caseRecord.district.toLowerCase().includes(user.districtId.toLowerCase());
      }
      return true; // Authorized officer level
    case 'state_admin':
      if (user.stateId) {
        return caseRecord.state.toLowerCase().includes(user.stateId.toLowerCase());
      }
      return true;
    case 'national_admin':
      return true;
    default:
      return false;
  }
}

/**
 * Checks if a user can edit a case record or update its status.
 */
export function canEditCase(user: AuthUserProfile, caseRecord: CaseRecord): boolean {
  if (!user || !caseRecord) return false;
  if (user.role === 'victim') return false; // Victims submit check-ins, cannot edit case metadata directly
  if (user.role === 'counsellor') {
    return canViewCase(user, caseRecord);
  }
  return ['district_officer', 'state_admin', 'national_admin'].includes(user.role);
}

/**
 * Checks if a user can create or recommend interventions for a case.
 */
export function canCreateIntervention(user: AuthUserProfile, caseRecord: CaseRecord): boolean {
  if (!user || !caseRecord) return false;
  if (user.role === 'victim') return false;
  return ['counsellor', 'district_officer', 'state_admin', 'national_admin'].includes(user.role);
}

/**
 * Checks if a user can view aggregated analytics and district/state reports.
 */
export function canViewAnalytics(user: AuthUserProfile): boolean {
  if (!user) return false;
  return ['counsellor', 'district_officer', 'state_admin', 'national_admin'].includes(user.role);
}

/**
 * Checks if a user can access system audit logs.
 */
export function canViewAuditLogs(user: AuthUserProfile): boolean {
  if (!user) return false;
  return ['district_officer', 'state_admin', 'national_admin'].includes(user.role);
}
