import {
  CaseEntity,
  CheckInEntity,
  DistressAssessmentEntity,
  AlertEntity,
  InterventionEntity,
  AppointmentEntity,
  NotificationItem,
  ConsentEntity,
  AuditLogEntity,
} from '@/types';
import {
  ICaseRepository,
  ICheckInRepository,
  IAssessmentRepository,
  IAlertRepository,
  IInterventionRepository,
  IAppointmentRepository,
  INotificationRepository,
  IConsentRepository,
  IAuditRepository,
} from './types';
import { getSupabaseClient, getSupabaseAdminClient } from '@/lib/supabase';
import {
  MockCaseRepository,
  MockCheckInRepository,
  MockAssessmentRepository,
  MockAlertRepository,
  MockInterventionRepository,
  MockAppointmentRepository,
  MockNotificationRepository,
  MockConsentRepository,
  MockAuditRepository,
} from './mock-repositories';

function getDbClient() {
  return typeof window === 'undefined'
    ? getSupabaseAdminClient() || getSupabaseClient()
    : getSupabaseClient();
}

export class SupabaseCaseRepository implements ICaseRepository {
  private fallback = new MockCaseRepository();

  async create(item: Omit<CaseEntity, 'id'> | CaseEntity): Promise<CaseEntity> {
    const supabase = getDbClient();
    if (!supabase) return this.fallback.create(item);

    const record = {
      id: 'id' in item && item.id ? item.id : `CASE-${Date.now().toString(36).toUpperCase()}`,
      case_number: item.caseNumber,
      victim_id: item.victimId,
      district_id: item.districtId,
      state_id: item.stateId,
      assigned_counsellor_id: item.assignedCounsellorId,
      case_stage: item.caseStage,
      status: item.status,
    };

    const { data, error } = await supabase.from('cases').insert(record).select().single();
    if (error || !data) return this.fallback.create(item);

    return {
      id: data.id,
      caseNumber: data.case_number,
      victimId: data.victim_id,
      districtId: data.district_id,
      stateId: data.state_id,
      assignedCounsellorId: data.assigned_counsellor_id,
      caseStage: data.case_stage,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async getById(id: string): Promise<CaseEntity | null> {
    const supabase = getDbClient();
    if (!supabase) return this.fallback.getById(id);

    const { data, error } = await supabase.from('cases').select('*').eq('id', id).single();
    if (error || !data) return this.fallback.getById(id);

    return {
      id: data.id,
      caseNumber: data.case_number,
      victimId: data.victim_id,
      districtId: data.district_id,
      stateId: data.state_id,
      assignedCounsellorId: data.assigned_counsellor_id,
      caseStage: data.case_stage,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async getAll(): Promise<CaseEntity[]> {
    const supabase = getDbClient();
    if (!supabase) return this.fallback.getAll();

    const { data, error } = await supabase.from('cases').select('*');
    if (error || !data || data.length === 0) return this.fallback.getAll();

    return data.map((d: any) => ({
      id: d.id,
      caseNumber: d.case_number,
      victimId: d.victim_id,
      districtId: d.district_id,
      stateId: d.state_id,
      assignedCounsellorId: d.assigned_counsellor_id,
      caseStage: d.case_stage,
      status: d.status,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));
  }

  async update(id: string, updates: Partial<CaseEntity>): Promise<CaseEntity | null> {
    const supabase = getDbClient();
    if (!supabase) return this.fallback.update(id, updates);

    const dbUpdates: any = { updated_at: new Date().toISOString() };
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.caseStage) dbUpdates.case_stage = updates.caseStage;
    if (updates.assignedCounsellorId) dbUpdates.assigned_counsellor_id = updates.assignedCounsellorId;

    const { data, error } = await supabase
      .from('cases')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return this.fallback.update(id, updates);

    return {
      id: data.id,
      caseNumber: data.case_number,
      victimId: data.victim_id,
      districtId: data.district_id,
      stateId: data.state_id,
      assignedCounsellorId: data.assigned_counsellor_id,
      caseStage: data.case_stage,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async getByVictimId(victimId: string): Promise<CaseEntity | null> {
    const supabase = getDbClient();
    if (!supabase) return this.fallback.getByVictimId(victimId);

    const { data } = await supabase.from('cases').select('*').eq('victim_id', victimId).single();
    if (!data) return this.fallback.getByVictimId(victimId);
    return {
      id: data.id,
      caseNumber: data.case_number,
      victimId: data.victim_id,
      districtId: data.district_id,
      stateId: data.state_id,
      assignedCounsellorId: data.assigned_counsellor_id,
      caseStage: data.case_stage,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async getByDistrict(districtId: string): Promise<CaseEntity[]> {
    const supabase = getDbClient();
    if (!supabase) return this.fallback.getByDistrict(districtId);

    const { data } = await supabase.from('cases').select('*').eq('district_id', districtId);
    if (!data || data.length === 0) return this.fallback.getByDistrict(districtId);
    return data.map((d: any) => ({
      id: d.id,
      caseNumber: d.case_number,
      victimId: d.victim_id,
      districtId: d.district_id,
      stateId: d.state_id,
      assignedCounsellorId: d.assigned_counsellor_id,
      caseStage: d.case_stage,
      status: d.status,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }));
  }
}

export class SupabaseCheckInRepository implements ICheckInRepository {
  private fallback = new MockCheckInRepository();

  async create(item: Omit<CheckInEntity, 'id'> | CheckInEntity): Promise<CheckInEntity> {
    const supabase = getDbClient();
    if (!supabase) return this.fallback.create(item);

    const checkInId = 'id' in item && item.id ? item.id : `chk-${Date.now().toString(36)}`;
    const record = {
      id: checkInId,
      case_id: item.caseId,
      timestamp: item.timestamp || new Date().toISOString(),
      feeling: item.feeling,
      safety_concern: item.safetyConcern,
      sleep: item.sleep,
      fear: item.fear,
      withdrawal: item.withdrawal,
      professional_support: item.professionalSupport,
      text_response: item.textResponse || null,
      voice_response: item.voiceResponse || null,
      completion_status: item.completionStatus || 'completed',
    };

    const { data, error } = await supabase.from('check_ins').insert(record).select().single();
    if (error || !data) return this.fallback.create(item);

    return {
      id: data.id,
      caseId: data.case_id,
      timestamp: data.timestamp,
      feeling: data.feeling,
      safetyConcern: data.safety_concern,
      sleep: data.sleep,
      fear: data.fear,
      withdrawal: data.withdrawal,
      professionalSupport: data.professional_support,
      textResponse: data.text_response,
      voiceResponse: data.voice_response,
      completionStatus: data.completion_status,
    };
  }

  async getById(id: string): Promise<CheckInEntity | null> {
    const supabase = getDbClient();
    if (!supabase) return this.fallback.getById(id);

    const { data } = await supabase.from('check_ins').select('*').eq('id', id).single();
    if (!data) return this.fallback.getById(id);

    return {
      id: data.id,
      caseId: data.case_id,
      timestamp: data.timestamp,
      feeling: data.feeling,
      safetyConcern: data.safety_concern,
      sleep: data.sleep,
      fear: data.fear,
      withdrawal: data.withdrawal,
      professionalSupport: data.professional_support,
      textResponse: data.text_response,
      voiceResponse: data.voice_response,
      completionStatus: data.completion_status,
    };
  }

  async getAll(): Promise<CheckInEntity[]> {
    const supabase = getDbClient();
    if (!supabase) return this.fallback.getAll();

    const { data } = await supabase.from('check_ins').select('*').order('created_at', { ascending: false });
    if (!data || data.length === 0) return this.fallback.getAll();

    return data.map((d: any) => ({
      id: d.id,
      caseId: d.case_id,
      timestamp: d.timestamp,
      feeling: d.feeling,
      safetyConcern: d.safety_concern,
      sleep: d.sleep,
      fear: d.fear,
      withdrawal: d.withdrawal,
      professionalSupport: d.professional_support,
      textResponse: d.text_response,
      voiceResponse: d.voice_response,
      completionStatus: d.completion_status,
    }));
  }

  async update(id: string, updates: Partial<CheckInEntity>): Promise<CheckInEntity | null> {
    return this.fallback.update(id, updates);
  }

  async getByCaseId(caseId: string): Promise<CheckInEntity[]> {
    const supabase = getDbClient();
    if (!supabase) return this.fallback.getByCaseId(caseId);

    const { data } = await supabase
      .from('check_ins')
      .select('*')
      .eq('case_id', caseId)
      .order('timestamp', { ascending: true });

    if (!data || data.length === 0) return this.fallback.getByCaseId(caseId);

    return data.map((d: any) => ({
      id: d.id,
      caseId: d.case_id,
      timestamp: d.timestamp,
      feeling: d.feeling,
      safetyConcern: d.safety_concern,
      sleep: d.sleep,
      fear: d.fear,
      withdrawal: d.withdrawal,
      professionalSupport: d.professional_support,
      textResponse: d.text_response,
      voiceResponse: d.voice_response,
      completionStatus: d.completion_status,
    }));
  }
}

export class SupabaseAssessmentRepository implements IAssessmentRepository {
  private fallback = new MockAssessmentRepository();

  async create(item: Omit<DistressAssessmentEntity, 'id'> | DistressAssessmentEntity): Promise<DistressAssessmentEntity> {
    const supabase = getDbClient();
    if (!supabase) return this.fallback.create(item);

    const record = {
      id: 'id' in item && item.id ? item.id : `ast-${Date.now().toString(36)}`,
      check_in_id: item.checkInId,
      case_id: item.caseId,
      indicator: item.indicator,
      level: item.level,
      baseline: item.baseline,
      baseline_deviation: item.baselineDeviation,
      trend: item.trend,
      confidence: item.confidence,
      contributing_factors: item.contributingFactors,
    };

    const { data, error } = await supabase.from('distress_assessments').insert(record).select().single();
    if (error || !data) return this.fallback.create(item);

    return {
      id: data.id,
      checkInId: data.check_in_id,
      caseId: data.case_id,
      indicator: Number(data.indicator),
      level: data.level,
      baseline: Number(data.baseline),
      baselineDeviation: Number(data.baseline_deviation),
      trend: data.trend,
      confidence: Number(data.confidence),
      contributingFactors: data.contributing_factors,
      createdAt: data.created_at,
    };
  }

  async getById(id: string): Promise<DistressAssessmentEntity | null> {
    const supabase = getDbClient();
    if (!supabase) return this.fallback.getById(id);

    const { data } = await supabase.from('distress_assessments').select('*').eq('id', id).single();
    if (!data) return this.fallback.getById(id);

    return {
      id: data.id,
      checkInId: data.check_in_id,
      caseId: data.case_id,
      indicator: Number(data.indicator),
      level: data.level,
      baseline: Number(data.baseline),
      baselineDeviation: Number(data.baseline_deviation),
      trend: data.trend,
      confidence: Number(data.confidence),
      contributingFactors: data.contributing_factors,
      createdAt: data.created_at,
    };
  }

  async getAll(): Promise<DistressAssessmentEntity[]> {
    const supabase = getDbClient();
    if (!supabase) return this.fallback.getAll();

    const { data } = await supabase.from('distress_assessments').select('*');
    if (!data || data.length === 0) return this.fallback.getAll();

    return data.map((d: any) => ({
      id: d.id,
      checkInId: d.check_in_id,
      caseId: d.case_id,
      indicator: Number(d.indicator),
      level: d.level,
      baseline: Number(d.baseline),
      baselineDeviation: Number(d.baseline_deviation),
      trend: d.trend,
      confidence: Number(d.confidence),
      contributingFactors: d.contributing_factors,
      createdAt: d.created_at,
    }));
  }

  async update(id: string, updates: Partial<DistressAssessmentEntity>): Promise<DistressAssessmentEntity | null> {
    return this.fallback.update(id, updates);
  }

  async getByCaseId(caseId: string): Promise<DistressAssessmentEntity[]> {
    const supabase = getDbClient();
    if (!supabase) return this.fallback.getByCaseId(caseId);

    const { data } = await supabase.from('distress_assessments').select('*').eq('case_id', caseId);
    if (!data || data.length === 0) return this.fallback.getByCaseId(caseId);

    return data.map((d: any) => ({
      id: d.id,
      checkInId: d.check_in_id,
      caseId: d.case_id,
      indicator: Number(d.indicator),
      level: d.level,
      baseline: Number(d.baseline),
      baselineDeviation: Number(d.baseline_deviation),
      trend: d.trend,
      confidence: Number(d.confidence),
      contributingFactors: d.contributing_factors,
      createdAt: d.created_at,
    }));
  }
}

export class SupabaseAlertRepository implements IAlertRepository {
  private fallback = new MockAlertRepository();

  async create(item: Omit<AlertEntity, 'id'> | AlertEntity): Promise<AlertEntity> {
    const supabase = getDbClient();
    if (!supabase) return this.fallback.create(item);

    const record = {
      id: 'id' in item && item.id ? item.id : `alt-${Date.now().toString(36)}`,
      case_id: item.caseId,
      severity: item.severity,
      reason: item.reason,
      status: item.status,
      assigned_to: item.assignedTo || null,
      recommended_action: item.recommendedAction || null,
    };

    const { data, error } = await supabase.from('alerts').insert(record).select().single();
    if (error || !data) return this.fallback.create(item);

    return {
      id: data.id,
      caseId: data.case_id,
      severity: data.severity,
      reason: data.reason,
      status: data.status,
      assignedTo: data.assigned_to,
      recommendedAction: data.recommended_action,
      createdAt: data.created_at,
      reviewedAt: data.reviewed_at,
    };
  }

  async getById(id: string): Promise<AlertEntity | null> {
    return this.fallback.getById(id);
  }

  async getAll(): Promise<AlertEntity[]> {
    const supabase = getDbClient();
    if (!supabase) return this.fallback.getAll();

    const { data } = await supabase.from('alerts').select('*');
    if (!data || data.length === 0) return this.fallback.getAll();

    return data.map((d: any) => ({
      id: d.id,
      caseId: d.case_id,
      severity: d.severity,
      reason: d.reason,
      status: d.status,
      assignedTo: d.assigned_to,
      recommendedAction: d.recommended_action,
      createdAt: d.created_at,
      reviewedAt: d.reviewed_at,
    }));
  }

  async update(id: string, updates: Partial<AlertEntity>): Promise<AlertEntity | null> {
    const supabase = getDbClient();
    if (!supabase) return this.fallback.update(id, updates);

    const dbUpdates: any = {};
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.reviewedAt) dbUpdates.reviewed_at = updates.reviewedAt;

    const { data } = await supabase.from('alerts').update(dbUpdates).eq('id', id).select().single();
    if (!data) return this.fallback.update(id, updates);

    return {
      id: data.id,
      caseId: data.case_id,
      severity: data.severity,
      reason: data.reason,
      status: data.status,
      assignedTo: data.assigned_to,
      recommendedAction: data.recommended_action,
      createdAt: data.created_at,
      reviewedAt: data.reviewed_at,
    };
  }

  async getByCaseId(caseId: string): Promise<AlertEntity[]> {
    return this.fallback.getByCaseId(caseId);
  }

  async getPending(): Promise<AlertEntity[]> {
    return this.fallback.getPending();
  }
}

export class SupabaseInterventionRepository implements IInterventionRepository {
  private fallback = new MockInterventionRepository();

  async create(item: Omit<InterventionEntity, 'id'> | InterventionEntity): Promise<InterventionEntity> {
    const supabase = getDbClient();
    if (!supabase) return this.fallback.create(item);

    const record = {
      id: 'id' in item && item.id ? item.id : `int-${Date.now().toString(36)}`,
      case_id: item.caseId,
      type: item.type,
      description: item.description,
      assigned_to: item.assignedTo,
      status: item.status,
      notes: item.notes || null,
    };

    const { data } = await supabase.from('interventions').insert(record).select().single();
    if (!data) return this.fallback.create(item);

    return {
      id: data.id,
      caseId: data.case_id,
      type: data.type,
      description: data.description,
      assignedTo: data.assigned_to,
      status: data.status,
      startDate: data.start_date,
      completionDate: data.completion_date,
      notes: data.notes,
    };
  }

  async getById(id: string): Promise<InterventionEntity | null> {
    return this.fallback.getById(id);
  }

  async getAll(): Promise<InterventionEntity[]> {
    return this.fallback.getAll();
  }

  async update(id: string, updates: Partial<InterventionEntity>): Promise<InterventionEntity | null> {
    return this.fallback.update(id, updates);
  }

  async getByCaseId(caseId: string): Promise<InterventionEntity[]> {
    return this.fallback.getByCaseId(caseId);
  }
}

export class SupabaseAppointmentRepository implements IAppointmentRepository {
  private fallback = new MockAppointmentRepository();

  async create(item: Omit<AppointmentEntity, 'id'> | AppointmentEntity): Promise<AppointmentEntity> {
    return this.fallback.create(item);
  }

  async getById(id: string): Promise<AppointmentEntity | null> {
    return this.fallback.getById(id);
  }

  async getAll(): Promise<AppointmentEntity[]> {
    return this.fallback.getAll();
  }

  async update(id: string, updates: Partial<AppointmentEntity>): Promise<AppointmentEntity | null> {
    return this.fallback.update(id, updates);
  }

  async getByCaseId(caseId: string): Promise<AppointmentEntity[]> {
    return this.fallback.getByCaseId(caseId);
  }
}

export class SupabaseNotificationRepository implements INotificationRepository {
  private fallback = new MockNotificationRepository();

  async create(item: Omit<NotificationItem, 'id'> | NotificationItem): Promise<NotificationItem> {
    return this.fallback.create(item);
  }

  async getById(id: string): Promise<NotificationItem | null> {
    return this.fallback.getById(id);
  }

  async getAll(): Promise<NotificationItem[]> {
    return this.fallback.getAll();
  }

  async update(id: string, updates: Partial<NotificationItem>): Promise<NotificationItem | null> {
    return this.fallback.update(id, updates);
  }

  async getByUserId(userId: string): Promise<NotificationItem[]> {
    return this.fallback.getByUserId(userId);
  }

  async markAllRead(userId?: string): Promise<void> {
    return this.fallback.markAllRead(userId);
  }
}

export class SupabaseConsentRepository implements IConsentRepository {
  private fallback = new MockConsentRepository();

  async create(item: Omit<ConsentEntity, 'id'> | ConsentEntity): Promise<ConsentEntity> {
    return this.fallback.create(item);
  }

  async getById(id: string): Promise<ConsentEntity | null> {
    return this.fallback.getById(id);
  }

  async getAll(): Promise<ConsentEntity[]> {
    return this.fallback.getAll();
  }

  async update(id: string, updates: Partial<ConsentEntity>): Promise<ConsentEntity | null> {
    return this.fallback.update(id, updates);
  }

  async getByUserId(userId: string): Promise<ConsentEntity | null> {
    return this.fallback.getByUserId(userId);
  }
}

export class SupabaseAuditRepository implements IAuditRepository {
  private fallback = new MockAuditRepository();

  async create(item: Omit<AuditLogEntity, 'id'> | AuditLogEntity): Promise<AuditLogEntity> {
    const supabase = getDbClient();
    if (!supabase) return this.fallback.create(item);

    const record = {
      id: 'id' in item && item.id ? item.id : `aud-${Date.now().toString(36)}`,
      user_id: item.userId,
      action: item.action,
      resource: item.resource,
      resource_id: item.resourceId,
      metadata: item.metadata || {},
    };

    const { data } = await supabase.from('audit_logs').insert(record).select().single();
    if (!data) return this.fallback.create(item);

    return {
      id: data.id,
      userId: data.user_id,
      action: data.action,
      resource: data.resource,
      resourceId: data.resource_id,
      timestamp: data.timestamp,
      metadata: data.metadata,
    };
  }

  async getById(id: string): Promise<AuditLogEntity | null> {
    return this.fallback.getById(id);
  }

  async getAll(): Promise<AuditLogEntity[]> {
    return this.fallback.getAll();
  }

  async update(id: string, updates: Partial<AuditLogEntity>): Promise<AuditLogEntity | null> {
    return this.fallback.update(id, updates);
  }

  async getByResourceId(resourceId: string): Promise<AuditLogEntity[]> {
    return this.fallback.getByResourceId(resourceId);
  }
}
