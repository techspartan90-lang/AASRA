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
import {
  INITIAL_CASES,
  INITIAL_ALERTS,
  INITIAL_INTERVENTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CONSENT,
} from '@/lib/mock-data';

// ----------------------------------------------------
// Mock Case Repository
// ----------------------------------------------------
export class MockCaseRepository implements ICaseRepository {
  private cases: CaseEntity[] = INITIAL_CASES.map(c => ({
    id: c.id,
    caseNumber: c.anonymizedCode,
    victimId: `usr-${c.anonymizedCode}`,
    districtId: c.district,
    stateId: c.state,
    assignedCounsellorId: c.assignedCounsellor,
    caseStage: c.stage,
    status: 'active',
    createdAt: c.registeredDate,
    updatedAt: c.lastCheckInDate,
  }));

  async create(item: Omit<CaseEntity, 'id'> | CaseEntity): Promise<CaseEntity> {
    const id = 'id' in item ? item.id : `CASE-${Date.now()}`;
    const newCase: CaseEntity = { ...(item as any), id };
    this.cases.unshift(newCase);
    return newCase;
  }

  async getById(id: string): Promise<CaseEntity | null> {
    return this.cases.find(c => c.id === id || c.caseNumber === id) || null;
  }

  async getAll(filter?: Partial<Record<string, any>>): Promise<CaseEntity[]> {
    if (!filter) return [...this.cases];
    return this.cases.filter(c => {
      for (const [key, value] of Object.entries(filter)) {
        if ((c as any)[key] !== value) return false;
      }
      return true;
    });
  }

  async update(id: string, updates: Partial<CaseEntity>): Promise<CaseEntity | null> {
    const idx = this.cases.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.cases[idx] = { ...this.cases[idx], ...updates, updatedAt: new Date().toISOString() };
    return this.cases[idx];
  }

  async getByVictimId(victimId: string): Promise<CaseEntity | null> {
    return this.cases.find(c => c.victimId === victimId) || null;
  }

  async getByDistrict(districtId: string): Promise<CaseEntity[]> {
    return this.cases.filter(c => c.districtId.toLowerCase().includes(districtId.toLowerCase()));
  }
}

// ----------------------------------------------------
// Mock CheckIn Repository
// ----------------------------------------------------
export class MockCheckInRepository implements ICheckInRepository {
  private checkIns: CheckInEntity[] = [
    {
      id: 'CHK-001',
      caseId: 'ATC-2026-00124',
      timestamp: '2026-09-25 10:15',
      feeling: 2,
      safetyConcern: 2,
      sleep: 1,
      fear: 5,
      withdrawal: 4,
      professionalSupport: true,
      textResponse: 'Summons delivered. I am terrified of going to court next week and cannot sleep.',
      voiceResponse: true,
      completionStatus: 'completed',
    },
    {
      id: 'CHK-002',
      caseId: 'ATC-2026-00131',
      timestamp: '2026-09-24 16:40',
      feeling: 1,
      safetyConcern: 1,
      sleep: 2,
      fear: 5,
      withdrawal: 5,
      professionalSupport: true,
      textResponse: 'Threats near local transit hub. Intimidation reported.',
      voiceResponse: true,
      completionStatus: 'completed',
    },
  ];

  async create(item: Omit<CheckInEntity, 'id'> | CheckInEntity): Promise<CheckInEntity> {
    const id = 'id' in item ? item.id : `CHK-${Date.now()}`;
    const record: CheckInEntity = { ...(item as any), id };
    this.checkIns.unshift(record);
    return record;
  }

  async getById(id: string): Promise<CheckInEntity | null> {
    return this.checkIns.find(c => c.id === id) || null;
  }

  async getAll(): Promise<CheckInEntity[]> {
    return [...this.checkIns];
  }

  async update(id: string, updates: Partial<CheckInEntity>): Promise<CheckInEntity | null> {
    const idx = this.checkIns.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.checkIns[idx] = { ...this.checkIns[idx], ...updates };
    return this.checkIns[idx];
  }

  async getByCaseId(caseId: string): Promise<CheckInEntity[]> {
    return this.checkIns.filter(c => c.caseId === caseId);
  }
}

// ----------------------------------------------------
// Mock Assessment Repository
// ----------------------------------------------------
export class MockAssessmentRepository implements IAssessmentRepository {
  private assessments: DistressAssessmentEntity[] = [
    {
      id: 'ASM-001',
      checkInId: 'CHK-001',
      caseId: 'ATC-2026-00124',
      indicator: 68,
      level: 'elevated',
      baseline: 35,
      baselineDeviation: 33,
      trend: 'Increasing',
      confidence: 0.94,
      contributingFactors: [
        'Fear indicator spiked to 5/5',
        'Severe sleep disruption reported (1/5)',
        'Significant deviation (+33 points) from personal baseline',
      ],
      createdAt: '2026-09-25 10:15',
    },
  ];

  async create(item: Omit<DistressAssessmentEntity, 'id'> | DistressAssessmentEntity): Promise<DistressAssessmentEntity> {
    const id = 'id' in item ? item.id : `ASM-${Date.now()}`;
    const record: DistressAssessmentEntity = { ...(item as any), id };
    this.assessments.unshift(record);
    return record;
  }

  async getById(id: string): Promise<DistressAssessmentEntity | null> {
    return this.assessments.find(a => a.id === id) || null;
  }

  async getAll(): Promise<DistressAssessmentEntity[]> {
    return [...this.assessments];
  }

  async update(id: string, updates: Partial<DistressAssessmentEntity>): Promise<DistressAssessmentEntity | null> {
    const idx = this.assessments.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.assessments[idx] = { ...this.assessments[idx], ...updates };
    return this.assessments[idx];
  }

  async getByCaseId(caseId: string): Promise<DistressAssessmentEntity[]> {
    return this.assessments.filter(a => a.caseId === caseId);
  }
}

// ----------------------------------------------------
// Mock Alert Repository
// ----------------------------------------------------
export class MockAlertRepository implements IAlertRepository {
  private alerts: AlertEntity[] = INITIAL_ALERTS.map(a => ({
    id: a.id,
    caseId: a.caseId,
    severity: a.riskLevel,
    reason: a.reason,
    status: a.status,
    assignedTo: a.assignedTo,
    recommendedAction: 'Human counsellor review and prompt contact',
    createdAt: a.timestamp,
  }));

  async create(item: Omit<AlertEntity, 'id'> | AlertEntity): Promise<AlertEntity> {
    const id = 'id' in item ? item.id : `ALT-${Date.now()}`;
    const record: AlertEntity = { ...(item as any), id };
    this.alerts.unshift(record);
    return record;
  }

  async getById(id: string): Promise<AlertEntity | null> {
    return this.alerts.find(a => a.id === id) || null;
  }

  async getAll(): Promise<AlertEntity[]> {
    return [...this.alerts];
  }

  async update(id: string, updates: Partial<AlertEntity>): Promise<AlertEntity | null> {
    const idx = this.alerts.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.alerts[idx] = { ...this.alerts[idx], ...updates };
    return this.alerts[idx];
  }

  async getByCaseId(caseId: string): Promise<AlertEntity[]> {
    return this.alerts.filter(a => a.caseId === caseId);
  }

  async getPending(): Promise<AlertEntity[]> {
    return this.alerts.filter(a => a.status === 'urgent' || a.status === 'pending');
  }
}

// ----------------------------------------------------
// Mock Intervention Repository
// ----------------------------------------------------
export class MockInterventionRepository implements IInterventionRepository {
  private interventions: InterventionEntity[] = INITIAL_INTERVENTIONS.map(i => ({
    id: i.id,
    caseId: i.caseId,
    type: i.category,
    description: `${i.title} - ${i.description}`,
    assignedTo: i.assignedProfessional,
    status: i.status,
    startDate: i.scheduledDate,
    notes: i.outcomeNotes,
  }));

  async create(item: Omit<InterventionEntity, 'id'> | InterventionEntity): Promise<InterventionEntity> {
    const id = 'id' in item ? item.id : `INT-${Date.now()}`;
    const record: InterventionEntity = { ...(item as any), id };
    this.interventions.unshift(record);
    return record;
  }

  async getById(id: string): Promise<InterventionEntity | null> {
    return this.interventions.find(i => i.id === id) || null;
  }

  async getAll(): Promise<InterventionEntity[]> {
    return [...this.interventions];
  }

  async update(id: string, updates: Partial<InterventionEntity>): Promise<InterventionEntity | null> {
    const idx = this.interventions.findIndex(i => i.id === id);
    if (idx === -1) return null;
    this.interventions[idx] = { ...this.interventions[idx], ...updates };
    return this.interventions[idx];
  }

  async getByCaseId(caseId: string): Promise<InterventionEntity[]> {
    return this.interventions.filter(i => i.caseId === caseId);
  }
}

// ----------------------------------------------------
// Mock Appointment Repository
// ----------------------------------------------------
export class MockAppointmentRepository implements IAppointmentRepository {
  private appointments: AppointmentEntity[] = [
    {
      id: 'APT-101',
      caseId: 'ATC-2026-00124',
      type: 'counselling',
      scheduledAt: '2026-09-28 11:00 AM',
      status: 'scheduled',
      assignedTo: 'Dr. Ananya Sarma',
      notes: 'Pre-Trial Tele-Counselling session',
    },
    {
      id: 'APT-102',
      caseId: 'ATC-2026-00131',
      type: 'court_escort',
      scheduledAt: '2026-09-27 10:00 AM',
      status: 'scheduled',
      assignedTo: 'Pradeep Mukherjee',
      notes: 'Police liaison accompaniment check',
    },
  ];

  async create(item: Omit<AppointmentEntity, 'id'> | AppointmentEntity): Promise<AppointmentEntity> {
    const id = 'id' in item ? item.id : `APT-${Date.now()}`;
    const record: AppointmentEntity = { ...(item as any), id };
    this.appointments.unshift(record);
    return record;
  }

  async getById(id: string): Promise<AppointmentEntity | null> {
    return this.appointments.find(a => a.id === id) || null;
  }

  async getAll(): Promise<AppointmentEntity[]> {
    return [...this.appointments];
  }

  async update(id: string, updates: Partial<AppointmentEntity>): Promise<AppointmentEntity | null> {
    const idx = this.appointments.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.appointments[idx] = { ...this.appointments[idx], ...updates };
    return this.appointments[idx];
  }

  async getByCaseId(caseId: string): Promise<AppointmentEntity[]> {
    return this.appointments.filter(a => a.caseId === caseId);
  }
}

// ----------------------------------------------------
// Mock Notification Repository
// ----------------------------------------------------
export class MockNotificationRepository implements INotificationRepository {
  private notifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];

  async create(item: Omit<NotificationItem, 'id'> | NotificationItem): Promise<NotificationItem> {
    const id = 'id' in item ? item.id : `NOTIF-${Date.now()}`;
    const record: NotificationItem = { ...(item as any), id };
    this.notifications.unshift(record);
    return record;
  }

  async getById(id: string): Promise<NotificationItem | null> {
    return this.notifications.find(n => n.id === id) || null;
  }

  async getAll(): Promise<NotificationItem[]> {
    return [...this.notifications];
  }

  async update(id: string, updates: Partial<NotificationItem>): Promise<NotificationItem | null> {
    const idx = this.notifications.findIndex(n => n.id === id);
    if (idx === -1) return null;
    this.notifications[idx] = { ...this.notifications[idx], ...updates };
    return this.notifications[idx];
  }

  async getByUserId(_userId: string): Promise<NotificationItem[]> {
    return [...this.notifications];
  }

  async markAllRead(_userId?: string): Promise<void> {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
  }
}

// ----------------------------------------------------
// Mock Consent Repository
// ----------------------------------------------------
export class MockConsentRepository implements IConsentRepository {
  private consents: Record<string, ConsentEntity> = {
    default: {
      id: 'CNS-001',
      userId: 'usr-default',
      aiAnalysis: INITIAL_CONSENT.longitudinalTracking,
      voiceAnalysis: INITIAL_CONSENT.voiceAnalysis,
      communication: INITIAL_CONSENT.automatedReminders,
      updatedAt: INITIAL_CONSENT.lastUpdated,
    },
  };

  async create(item: Omit<ConsentEntity, 'id'> | ConsentEntity): Promise<ConsentEntity> {
    const id = 'id' in item ? item.id : `CNS-${Date.now()}`;
    const record: ConsentEntity = { ...(item as any), id };
    this.consents[record.userId] = record;
    return record;
  }

  async getById(id: string): Promise<ConsentEntity | null> {
    return Object.values(this.consents).find(c => c.id === id) || null;
  }

  async getAll(): Promise<ConsentEntity[]> {
    return Object.values(this.consents);
  }

  async update(id: string, updates: Partial<ConsentEntity>): Promise<ConsentEntity | null> {
    const existing = Object.values(this.consents).find(c => c.id === id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.consents[existing.userId] = updated;
    return updated;
  }

  async getByUserId(userId: string): Promise<ConsentEntity | null> {
    return this.consents[userId] || this.consents['default'] || null;
  }
}

// ----------------------------------------------------
// Mock Audit Repository
// ----------------------------------------------------
export class MockAuditRepository implements IAuditRepository {
  private auditLogs: AuditLogEntity[] = INITIAL_AUDIT_LOGS.map(a => ({
    id: a.id,
    userId: a.actor,
    action: a.action,
    resource: a.resource,
    resourceId: a.resource.split(' ')[0] || a.resource,
    timestamp: a.timestamp,
    metadata: { district: a.district, purpose: a.purpose },
  }));

  async create(item: Omit<AuditLogEntity, 'id'> | AuditLogEntity): Promise<AuditLogEntity> {
    const id = 'id' in item ? item.id : `AUD-${Date.now()}`;
    const record: AuditLogEntity = { ...(item as any), id };
    this.auditLogs.unshift(record);
    return record;
  }

  async getById(id: string): Promise<AuditLogEntity | null> {
    return this.auditLogs.find(a => a.id === id) || null;
  }

  async getAll(): Promise<AuditLogEntity[]> {
    return [...this.auditLogs];
  }

  async update(id: string, updates: Partial<AuditLogEntity>): Promise<AuditLogEntity | null> {
    const idx = this.auditLogs.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.auditLogs[idx] = { ...this.auditLogs[idx], ...updates };
    return this.auditLogs[idx];
  }

  async getByResourceId(resourceId: string): Promise<AuditLogEntity[]> {
    return this.auditLogs.filter(a => a.resourceId === resourceId);
  }
}
