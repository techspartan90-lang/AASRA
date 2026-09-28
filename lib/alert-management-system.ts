/**
 * Alert Management System (Phase 8)
 *
 * ALERT TYPES:
 * 1. Information
 * 2. Attention required
 * 3. Urgent review
 * 4. Critical review
 *
 * WORKFLOW:
 * Signal detected → Alert generated → Human review → Counsellor action → Follow-up → Resolution
 *
 * RECOMMENDED ACTIONS:
 * - schedule counselling
 * - contact survivor
 * - offer support resources
 * - review case context
 * - escalate to appropriate human support
 *
 * GOVERNANCE & SAFETY RULE:
 * AI cannot independently make irreversible decisions.
 * Require human review for consequential intervention.
 * Every action is audited.
 */

export type AlertSeverity = 'Information' | 'Attention required' | 'Urgent review' | 'Critical review';

export type RecommendedAlertAction =
  | 'schedule counselling'
  | 'contact survivor'
  | 'offer support resources'
  | 'review case context'
  | 'escalate to appropriate human support';

export type AlertStatus =
  | 'New'
  | 'Acknowledged'
  | 'Under Review'
  | 'Action Taken'
  | 'Escalated'
  | 'Resolved';

export type WorkflowStage =
  | 'Signal detected'
  | 'Alert generated'
  | 'Human review'
  | 'Counsellor action'
  | 'Follow-up'
  | 'Resolution';

export interface AlertAuditEntry {
  id: string;
  timestamp: string;
  action: 'CREATED' | 'ACKNOWLEDGE' | 'ASSIGN' | 'ESCALATE' | 'RESOLVE' | 'ADD_NOTE';
  actor: string;
  note: string;
  previousStatus?: AlertStatus;
  newStatus?: AlertStatus;
  details?: Record<string, any>;
}

export interface RealTimeAlert {
  alertId: string;
  survivorReference: string;
  createdTime: string;
  severity: AlertSeverity;
  trigger: string;
  supportingSignals: string[];
  recommendedAction: RecommendedAlertAction;
  assignedCounsellor: string;
  status: AlertStatus;
  currentWorkflowStage: WorkflowStage;
  requiresHumanReview: true; // Hardcoded safety mandate
  auditHistory: AlertAuditEntry[];
  caseId: string;
  district: string;
}

export interface SeverityVisualConfig {
  severity: AlertSeverity;
  label: string;
  badgeClass: string;
  borderClass: string;
  iconName: 'Info' | 'AlertCircle' | 'AlertTriangle' | 'ShieldAlert';
  calmDescription: string;
}

export const SEVERITY_CONFIGS: Record<AlertSeverity, SeverityVisualConfig> = {
  Information: {
    severity: 'Information',
    label: 'Information Pulse',
    badgeClass: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
    borderClass: 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40',
    iconName: 'Info',
    calmDescription: 'Routine check-in logged or minor preference change noted. Informational update for caseload context.',
  },
  'Attention required': {
    severity: 'Attention required',
    label: 'Attention Required',
    badgeClass: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200 border-blue-300 dark:border-blue-800',
    borderClass: 'border-blue-300 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20',
    iconName: 'AlertCircle',
    calmDescription: 'Moderate situational shift or skipped check-in detected. Recommended review within 48-72 hours.',
  },
  'Urgent review': {
    severity: 'Urgent review',
    label: 'Urgent Review',
    badgeClass: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-800',
    borderClass: 'border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30',
    iconName: 'AlertTriangle',
    calmDescription: 'Distress elevation identified before court milestone or consecutive missed pulses. Prioritize contact within 24h.',
  },
  'Critical review': {
    severity: 'Critical review',
    label: 'Critical Review',
    badgeClass: 'bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-800 font-black',
    borderClass: 'border-rose-400 dark:border-rose-800 bg-rose-50/60 dark:bg-rose-950/30',
    iconName: 'ShieldAlert',
    calmDescription: 'Acute distress markers or reported threat registered. Immediate human-led triage protocol engaged.',
  },
};

export const WORKFLOW_STAGES: WorkflowStage[] = [
  'Signal detected',
  'Alert generated',
  'Human review',
  'Counsellor action',
  'Follow-up',
  'Resolution',
];

const INITIAL_ALERTS: RealTimeAlert[] = [
  {
    alertId: 'ALT-2026-0819',
    survivorReference: 'Anita Devi (CASE-002 / Kamrup Rural)',
    createdTime: '2026-09-28T14:15:00.000Z',
    severity: 'Urgent review',
    trigger: 'Dynamic Distress Spike (+19 pts) and approaching court hearing within 5 calendar days',
    supportingSignals: [
      'Score elevation: 28 intake baseline → 47 current distress indicator',
      'Text analysis flagged pre-trial anxiety terms in recent Hindi reflection',
      'Audio note pitch jitter perturbation elevated at 4.8%',
      'Scheduled court hearing notice delivered 2 days prior',
    ],
    recommendedAction: 'schedule counselling',
    assignedCounsellor: 'Dr. Priya Nair (Clinical Lead)',
    status: 'New',
    currentWorkflowStage: 'Human review',
    requiresHumanReview: true,
    caseId: 'CASE-002',
    district: 'Kamrup Rural',
    auditHistory: [
      {
        id: 'aud-001',
        timestamp: '2026-09-28T14:15:00.000Z',
        action: 'CREATED',
        actor: 'AI Distress Analysis Engine (v1.0.0)',
        note: 'Automated alert synthesized from multi-channel pulse check-in and judicial calendar ingestion. Flagged for mandatory human review.',
        newStatus: 'New',
      },
    ],
  },
  {
    alertId: 'ALT-2026-0818',
    survivorReference: 'Sunita Meena (CASE-005 / Sawai Madhopur)',
    createdTime: '2026-09-28T11:30:00.000Z',
    severity: 'Critical review',
    trigger: 'Reported intimidation concern on case registry and consecutive missed check-in pulses',
    supportingSignals: [
      'Witness protection concern registered by Special Public Prosecutor',
      'Two consecutive missed scheduled daily IVRS check-ins',
      'Prior baseline deviation: +24 points over 14-day window',
    ],
    recommendedAction: 'escalate to appropriate human support',
    assignedCounsellor: 'Dr. Rajesh Verma (District Officer)',
    status: 'Acknowledged',
    currentWorkflowStage: 'Counsellor action',
    requiresHumanReview: true,
    caseId: 'CASE-005',
    district: 'Sawai Madhopur',
    auditHistory: [
      {
        id: 'aud-002',
        timestamp: '2026-09-28T11:30:00.000Z',
        action: 'CREATED',
        actor: 'System Event Ingestor',
        note: 'Intimidation registry event paired with missed cadence triggered Critical review.',
        newStatus: 'New',
      },
      {
        id: 'aud-003',
        timestamp: '2026-09-28T11:45:12.000Z',
        action: 'ACKNOWLEDGE',
        actor: 'Dr. Rajesh Verma (District Officer)',
        note: 'Alert acknowledged. Coordinating with district witness protection escort cell.',
        previousStatus: 'New',
        newStatus: 'Acknowledged',
      },
    ],
  },
  {
    alertId: 'ALT-2026-0817',
    survivorReference: 'Kavitha R. (CASE-009 / Madurai)',
    createdTime: '2026-09-28T09:00:00.000Z',
    severity: 'Attention required',
    trigger: 'Declining engagement cadence across voluntary SMS check-ins over 10 days',
    supportingSignals: [
      'Check-in interval lengthened from 2 days to 5 days',
      'Text responses shortened from full reflections to single-word affirmations',
      'No acute safety flags; baseline within ±6 points tolerance',
    ],
    recommendedAction: 'contact survivor',
    assignedCounsellor: 'S. Meenakshi (Counsellor)',
    status: 'Under Review',
    currentWorkflowStage: 'Human review',
    requiresHumanReview: true,
    caseId: 'CASE-009',
    district: 'Madurai',
    auditHistory: [
      {
        id: 'aud-004',
        timestamp: '2026-09-28T09:00:00.000Z',
        action: 'CREATED',
        actor: 'Behavioral Cadence Monitor',
        note: 'Declining engagement threshold exceeded. Attention required alert dispatched.',
        newStatus: 'New',
      },
      {
        id: 'aud-005',
        timestamp: '2026-09-28T09:20:00.000Z',
        action: 'ACKNOWLEDGE',
        actor: 'S. Meenakshi (Counsellor)',
        note: 'Reviewing recent check-in texts prior to routine pulse call.',
        previousStatus: 'New',
        newStatus: 'Under Review',
      },
    ],
  },
  {
    alertId: 'ALT-2026-0816',
    survivorReference: 'Ramesh Kumar (CASE-012 / Gaya)',
    createdTime: '2026-09-27T16:20:00.000Z',
    severity: 'Information',
    trigger: 'Successful completion of first trauma-informed counselling session with positive recovery signal',
    supportingSignals: [
      'Post-session reflection logged as Calm with positive coping indicators',
      'Distress indicator decreased by 8 points from pre-session reading',
      'Confirmed preference for weekly SMS check-in reminders',
    ],
    recommendedAction: 'offer support resources',
    assignedCounsellor: 'Amitabh Sen (Counsellor)',
    status: 'Resolved',
    currentWorkflowStage: 'Resolution',
    requiresHumanReview: true,
    caseId: 'CASE-012',
    district: 'Gaya',
    auditHistory: [
      {
        id: 'aud-006',
        timestamp: '2026-09-27T16:20:00.000Z',
        action: 'CREATED',
        actor: 'Care Journey Pipeline',
        note: 'Session completed successfully. Information alert generated for record.',
        newStatus: 'New',
      },
      {
        id: 'aud-007',
        timestamp: '2026-09-27T16:45:00.000Z',
        action: 'RESOLVE',
        actor: 'Amitabh Sen (Counsellor)',
        note: 'Survivor responded warmly. Grounding audio playlist shared via WhatsApp/SMS. Case stable.',
        previousStatus: 'New',
        newStatus: 'Resolved',
      },
    ],
  },
];

export class AlertManagementSystem {
  private static instance: AlertManagementSystem;
  private alerts: RealTimeAlert[] = [];

  private constructor() {
    this.alerts = [...INITIAL_ALERTS];
  }

  public static getInstance(): AlertManagementSystem {
    if (!AlertManagementSystem.instance) {
      AlertManagementSystem.instance = new AlertManagementSystem();
    }
    return AlertManagementSystem.instance;
  }

  public getAlerts(): RealTimeAlert[] {
    return [...this.alerts];
  }

  public getAlertById(alertId: string): RealTimeAlert | undefined {
    return this.alerts.find(a => a.alertId === alertId);
  }

  /**
   * Action 1: Acknowledge Alert
   * Moves status to 'Acknowledged' and logs audit entry.
   */
  public acknowledgeAlert(alertId: string, actor: string, note?: string): RealTimeAlert {
    const alert = this.getAlertById(alertId);
    if (!alert) throw new Error(`Alert ${alertId} not found`);

    const prev = alert.status;
    alert.status = 'Acknowledged';
    alert.currentWorkflowStage = 'Human review';

    const entry: AlertAuditEntry = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action: 'ACKNOWLEDGE',
      actor,
      note: note || 'Alert formally acknowledged by assigned counsellor for active review.',
      previousStatus: prev,
      newStatus: alert.status,
    };
    alert.auditHistory.unshift(entry);
    return { ...alert };
  }

  /**
   * Action 2: Assign / Reassign Counsellor
   * Assigns alert to counsellor/staff and logs audit trail.
   */
  public assignAlert(alertId: string, newCounsellor: string, actor: string, note?: string): RealTimeAlert {
    const alert = this.getAlertById(alertId);
    if (!alert) throw new Error(`Alert ${alertId} not found`);

    const previousCounsellor = alert.assignedCounsellor;
    alert.assignedCounsellor = newCounsellor;
    if (alert.status === 'New') {
      alert.status = 'Under Review';
    }
    alert.currentWorkflowStage = 'Counsellor action';

    const entry: AlertAuditEntry = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action: 'ASSIGN',
      actor,
      note: note || `Reassigned from ${previousCounsellor} to ${newCounsellor}.`,
      details: { previousCounsellor, newCounsellor },
    };
    alert.auditHistory.unshift(entry);
    return { ...alert };
  }

  /**
   * Action 3: Escalate Alert
   * Escalates to appropriate human support and logs audit trail.
   */
  public escalateAlert(alertId: string, targetRole: string, actor: string, note: string): RealTimeAlert {
    const alert = this.getAlertById(alertId);
    if (!alert) throw new Error(`Alert ${alertId} not found`);

    const prev = alert.status;
    alert.status = 'Escalated';
    alert.currentWorkflowStage = 'Counsellor action';

    const entry: AlertAuditEntry = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action: 'ESCALATE',
      actor,
      note: `Escalated to ${targetRole}: ${note}`,
      previousStatus: prev,
      newStatus: alert.status,
      details: { targetRole },
    };
    alert.auditHistory.unshift(entry);
    return { ...alert };
  }

  /**
   * Action 4: Resolve Alert
   * Marks alert resolved with mandatory human resolution summary.
   */
  public resolveAlert(alertId: string, actor: string, resolutionSummary: string): RealTimeAlert {
    const alert = this.getAlertById(alertId);
    if (!alert) throw new Error(`Alert ${alertId} not found`);

    const prev = alert.status;
    alert.status = 'Resolved';
    alert.currentWorkflowStage = 'Resolution';

    const entry: AlertAuditEntry = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action: 'RESOLVE',
      actor,
      note: resolutionSummary,
      previousStatus: prev,
      newStatus: alert.status,
    };
    alert.auditHistory.unshift(entry);
    return { ...alert };
  }

  /**
   * Action 5: Add Note
   * Adds an immutable caseworker or clinical progress note.
   */
  public addNote(alertId: string, actor: string, noteText: string): RealTimeAlert {
    const alert = this.getAlertById(alertId);
    if (!alert) throw new Error(`Alert ${alertId} not found`);

    const entry: AlertAuditEntry = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action: 'ADD_NOTE',
      actor,
      note: noteText,
    };
    alert.auditHistory.unshift(entry);
    return { ...alert };
  }

  /**
   * Creates a new alert adhering to all specifications and audit requirements.
   */
  public createAlert(params: {
    survivorReference: string;
    severity: AlertSeverity;
    trigger: string;
    supportingSignals: string[];
    recommendedAction: RecommendedAlertAction;
    assignedCounsellor: string;
    caseId: string;
    district: string;
    actor?: string;
  }): RealTimeAlert {
    const alertId = `ALT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAlert: RealTimeAlert = {
      alertId,
      survivorReference: params.survivorReference,
      createdTime: new Date().toISOString(),
      severity: params.severity,
      trigger: params.trigger,
      supportingSignals: params.supportingSignals,
      recommendedAction: params.recommendedAction,
      assignedCounsellor: params.assignedCounsellor,
      status: 'New',
      currentWorkflowStage: 'Alert generated',
      requiresHumanReview: true,
      caseId: params.caseId,
      district: params.district,
      auditHistory: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'CREATED',
          actor: params.actor || 'AI Distress Analysis Ingestion Engine',
          note: `New alert generated: ${params.trigger}. Requires human review before irreversible intervention.`,
          newStatus: 'New',
        },
      ],
    };

    this.alerts.unshift(newAlert);
    return newAlert;
  }
}

export const alertManagementSystem = AlertManagementSystem.getInstance();
