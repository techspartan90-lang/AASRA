import { repositories } from '@/lib/repositories';
import { aiService } from '@/lib/services/ai-service-provider';
import { CheckInFeatures, PipelineResult } from '@/lib/engines/risk-engine';
import {
  CaseRecord,
  RiskAlert,
  Intervention,
  NotificationItem,
  AuditLogItem,
  UserConsent,
} from '@/types';

/**
 * Frontend and Server Service API Abstraction.
 * Decouples React components from direct database / repository code.
 * Ensures consistent contracts across client actions, API routes, and backend logic.
 */
export class ApiService {
  // ----------------------------------------------------
  // Check-In Pipeline
  // ----------------------------------------------------
  static async submitCheckIn(
    caseId: string,
    features: CheckInFeatures,
    actorRole = 'victim'
  ): Promise<PipelineResult> {
    // 1. Fetch case from repository
    const caseRecord = await repositories.cases.getById(caseId);
    const historicalScores = features.historicalScores || [caseRecord ? 38 : 38];

    // 2. Execute Check-In Pipeline via AI Service
    const analysis = await aiService.analyzeCheckIn({
      ...features,
      historicalScores,
      previousScore: features.previousScore || 38,
    });

    // 3. Save CheckIn record
    await repositories.checkIns.create({
      caseId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      feeling: features.feelingScore ?? 3,
      safetyConcern: features.safetyScore ?? 3,
      sleep: features.sleepScore ?? 3,
      fear: features.fearScore ?? 1,
      withdrawal: features.avoidanceScore ?? 1,
      professionalSupport: Boolean(features.requestHelp),
      textResponse: features.notes || '',
      voiceResponse: Boolean(features.hasVoiceSample),
      completionStatus: 'completed',
    });

    // 4. Save Assessment record
    await repositories.assessments.create({
      checkInId: `CHK-${Date.now()}`,
      caseId,
      indicator: analysis.indicator,
      level: analysis.level,
      baseline: analysis.baseline,
      baselineDeviation: analysis.baselineDeviation,
      trend: analysis.trend,
      confidence: 0.92,
      contributingFactors: analysis.contributingFactors,
      createdAt: analysis.generatedAt,
    });

    // 5. If elevated/high, create Alert
    if (analysis.level === 'elevated' || analysis.level === 'high') {
      await repositories.alerts.create({
        caseId,
        severity: analysis.level,
        reason: analysis.explanation,
        status: analysis.level === 'high' ? 'urgent' : 'pending',
        assignedTo: caseRecord?.assignedCounsellorId || 'Assigned Caseworker',
        recommendedAction: analysis.recommendedHumanAction,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      });

      // Notify counsellor
      await repositories.notifications.create({
        type: 'alert',
        title: `${analysis.riskLabel} Detected`,
        message: `Case ${caseId} registered screening indicator of ${analysis.indicator}/100. Human review recommended.`,
        timestamp: 'Just now',
        read: false,
        linkCaseId: caseId,
      });
    } else {
      // Routine notification
      await repositories.notifications.create({
        type: 'check_in',
        title: 'Check-in Recorded',
        message: `Case ${caseId} check-in recorded. Measured indicators remain in stable parameters.`,
        timestamp: 'Just now',
        read: false,
        linkCaseId: caseId,
      });
    }

    // 6. Record Audit Log
    await repositories.audit.create({
      userId: actorRole,
      action: 'CHECK_IN_ANALYSIS_EXECUTED',
      resource: `Case ${caseId}`,
      resourceId: caseId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      metadata: {
        indicator: analysis.indicator,
        baseline: analysis.baseline,
        deviation: analysis.baselineDeviation,
        isAiFallback: analysis.isAiFallback,
      },
    });

    return analysis;
  }

  // ----------------------------------------------------
  // Cases
  // ----------------------------------------------------
  static async getCases(filter?: Partial<Record<string, any>>) {
    return repositories.cases.getAll(filter);
  }

  static async getCaseById(id: string) {
    return repositories.cases.getById(id);
  }

  // ----------------------------------------------------
  // Alerts
  // ----------------------------------------------------
  static async getAlerts() {
    return repositories.alerts.getAll();
  }

  static async updateAlert(id: string, updates: Partial<RiskAlert>) {
    return repositories.alerts.update(id, updates as any);
  }

  // ----------------------------------------------------
  // Interventions
  // ----------------------------------------------------
  static async getInterventions(caseId?: string) {
    if (caseId) {
      return repositories.interventions.getByCaseId(caseId);
    }
    return repositories.interventions.getAll();
  }

  static async createIntervention(data: any, actor = 'Counsellor') {
    const created = await repositories.interventions.create(data);
    await repositories.audit.create({
      userId: actor,
      action: 'INTERVENTION_AUTHORIZED',
      resource: `Case ${data.caseId}`,
      resourceId: data.caseId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      metadata: { type: data.type || data.category, title: data.title },
    });
    return created;
  }

  // ----------------------------------------------------
  // Appointments
  // ----------------------------------------------------
  static async getAppointments(caseId?: string) {
    if (caseId) {
      return repositories.appointments.getByCaseId(caseId);
    }
    return repositories.appointments.getAll();
  }

  static async createAppointment(data: any) {
    return repositories.appointments.create(data);
  }

  // ----------------------------------------------------
  // Notifications
  // ----------------------------------------------------
  static async getNotifications(userId = 'default') {
    return repositories.notifications.getByUserId(userId);
  }

  static async markNotificationRead(id: string) {
    return repositories.notifications.update(id, { read: true });
  }

  static async markAllNotificationsRead() {
    return repositories.notifications.markAllRead();
  }

  // ----------------------------------------------------
  // Consent
  // ----------------------------------------------------
  static async getConsent(userId = 'default') {
    return repositories.consent.getByUserId(userId);
  }

  static async updateConsent(userId: string, updates: any) {
    const updated = await repositories.consent.update(userId, updates);
    await repositories.audit.create({
      userId,
      action: 'CONSENT_SETTINGS_CHANGED',
      resource: 'User Profile',
      resourceId: userId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      metadata: updates,
    });
    return updated;
  }

  // ----------------------------------------------------
  // Audit Logs
  // ----------------------------------------------------
  static async getAuditLogs() {
    return repositories.audit.getAll();
  }
}
