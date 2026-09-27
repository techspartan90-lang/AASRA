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
import {
  SupabaseCaseRepository,
  SupabaseCheckInRepository,
  SupabaseAssessmentRepository,
  SupabaseAlertRepository,
  SupabaseInterventionRepository,
  SupabaseAppointmentRepository,
  SupabaseNotificationRepository,
  SupabaseConsentRepository,
  SupabaseAuditRepository,
} from './supabase-repositories';
import { getSupabaseConfig } from '@/lib/supabase';

class RepositoryContainer {
  private static instance: RepositoryContainer;

  public readonly cases: ICaseRepository;
  public readonly checkIns: ICheckInRepository;
  public readonly assessments: IAssessmentRepository;
  public readonly alerts: IAlertRepository;
  public readonly interventions: IInterventionRepository;
  public readonly appointments: IAppointmentRepository;
  public readonly notifications: INotificationRepository;
  public readonly consent: IConsentRepository;
  public readonly audit: IAuditRepository;
  public readonly isSupabaseEnabled: boolean;

  private constructor() {
    const config = getSupabaseConfig();
    this.isSupabaseEnabled = config.isConfigured;

    if (config.isConfigured) {
      // Live Supabase database backing with automatic mock fallback on transient errors
      this.cases = new SupabaseCaseRepository();
      this.checkIns = new SupabaseCheckInRepository();
      this.assessments = new SupabaseAssessmentRepository();
      this.alerts = new SupabaseAlertRepository();
      this.interventions = new SupabaseInterventionRepository();
      this.appointments = new SupabaseAppointmentRepository();
      this.notifications = new SupabaseNotificationRepository();
      this.consent = new SupabaseConsentRepository();
      this.audit = new SupabaseAuditRepository();
    } else {
      // In-memory repositories for offline prototype and demo stability
      this.cases = new MockCaseRepository();
      this.checkIns = new MockCheckInRepository();
      this.assessments = new MockAssessmentRepository();
      this.alerts = new MockAlertRepository();
      this.interventions = new MockInterventionRepository();
      this.appointments = new MockAppointmentRepository();
      this.notifications = new MockNotificationRepository();
      this.consent = new MockConsentRepository();
      this.audit = new MockAuditRepository();
    }
  }

  public static getInstance(): RepositoryContainer {
    if (!RepositoryContainer.instance) {
      RepositoryContainer.instance = new RepositoryContainer();
    }
    return RepositoryContainer.instance;
  }
}

export const repositories = RepositoryContainer.getInstance();
export * from './types';
