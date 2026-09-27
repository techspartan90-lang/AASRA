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

export interface IRepository<T> {
  create(item: Omit<T, 'id'> | T): Promise<T>;
  getById(id: string): Promise<T | null>;
  getAll(filter?: Partial<Record<string, any>>): Promise<T[]>;
  update(id: string, updates: Partial<T>): Promise<T | null>;
  delete?(id: string): Promise<boolean>;
}

export interface ICaseRepository extends IRepository<CaseEntity> {
  getByVictimId(victimId: string): Promise<CaseEntity | null>;
  getByDistrict(districtId: string): Promise<CaseEntity[]>;
}

export interface ICheckInRepository extends IRepository<CheckInEntity> {
  getByCaseId(caseId: string): Promise<CheckInEntity[]>;
}

export interface IAssessmentRepository extends IRepository<DistressAssessmentEntity> {
  getByCaseId(caseId: string): Promise<DistressAssessmentEntity[]>;
}

export interface IAlertRepository extends IRepository<AlertEntity> {
  getByCaseId(caseId: string): Promise<AlertEntity[]>;
  getPending(): Promise<AlertEntity[]>;
}

export interface IInterventionRepository extends IRepository<InterventionEntity> {
  getByCaseId(caseId: string): Promise<InterventionEntity[]>;
}

export interface IAppointmentRepository extends IRepository<AppointmentEntity> {
  getByCaseId(caseId: string): Promise<AppointmentEntity[]>;
}

export interface INotificationRepository extends IRepository<NotificationItem> {
  getByUserId(userId: string): Promise<NotificationItem[]>;
  markAllRead(userId?: string): Promise<void>;
}

export interface IConsentRepository extends IRepository<ConsentEntity> {
  getByUserId(userId: string): Promise<ConsentEntity | null>;
}

export interface IAuditRepository extends IRepository<AuditLogEntity> {
  getByResourceId(resourceId: string): Promise<AuditLogEntity[]>;
}
