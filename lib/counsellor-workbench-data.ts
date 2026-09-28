/**
 * Counsellor Clinical-Support Workbench Engine & Data (Phase 9)
 *
 * MAIN SECTIONS:
 * 1. Priority Worklist
 * 2. Today's Follow-ups
 * 3. Distress Trends
 * 4. Alerts
 * 5. Assigned Survivors
 * 6. Case Context
 * 7. Notes
 * 8. Follow-up Schedule
 *
 * SURVIVOR DETAIL TABS:
 * - Overview
 * - Check-ins
 * - Trends
 * - AI Signals (contributing signals, model confidence, model version, timestamp, “AI-assisted indicator — human review required.”)
 * - Case Timeline
 * - Support History
 * - Notes
 * - Privacy
 *
 * COUNSELLOR ACTIONS:
 * - contact
 * - schedule follow-up
 * - add note
 * - assign
 * - escalate
 * - resolve alert
 */

export type WorkbenchSection =
  | 'worklist'
  | 'today_followups'
  | 'distress_trends'
  | 'alerts'
  | 'assigned_survivors'
  | 'case_context'
  | 'notes'
  | 'followup_schedule';

export type SurvivorDetailTab =
  | 'Overview'
  | 'Check-ins'
  | 'Trends'
  | 'AI Signals'
  | 'Case Timeline'
  | 'Support History'
  | 'Notes'
  | 'Privacy';

export interface AnonymizedSurvivorProfile {
  anonymizedId: string; // e.g. "SURV-7842"
  caseId: string; // e.g. "CASE-002"
  districtCode: string; // e.g. "AS-KAM-02" (Kamrup Rural)
  state: string; // e.g. "Assam"
  latestDistressIndicator: number; // e.g. 47
  baselineScore: number; // e.g. 28
  scoreChange: number; // e.g. +19
  scoreChangeFormatted: string; // e.g. "+19 pts"
  riskCategory: 'Low' | 'Medium' | 'High' | 'Critical';
  lastCheckInFormatted: string; // e.g. "2 hours ago (Chatbot / Hindi)"
  trendDirection: 'Spiking' | 'Rising' | 'Stable' | 'Improving';
  assignedCounsellor: string; // e.g. "Dr. Priya Nair"
  followUpStatus: 'Due Today' | 'Overdue' | 'Scheduled' | 'Completed';
  nextFollowUpDate: string; // e.g. "Today, 15:30 IST"
  activeAlertCount: number;
  caseStage: 'Complaint' | 'Investigation' | 'Trial' | 'Rehabilitation' | 'Protection';

  // Detail tab contents
  overview: {
    intakeDate: string;
    preferredLanguage: string;
    preferredChannel: string;
    trustedContactDesignation: string; // Anonymized, e.g. "Elder Brother (Verified)"
    protectiveMeasuresActive: string[];
    safeguardingSummary: string;
  };
  checkIns: Array<{
    id: string;
    timestamp: string;
    channel: 'Chatbot' | 'IVRS' | 'SMS' | 'Mobile App' | 'Web';
    mood: string;
    textResponse: string;
    voiceAcousticRecorded: boolean;
    distressScore: number;
  }>;
  trends: {
    sevenDayAverage: number;
    thirtyDayBaseline: number;
    volatilityIndex: string; // e.g. "Moderate (±8 pts)"
    recentShifts: string[];
  };
  aiSignals: {
    contributingSignals: string[];
    modelConfidence: number; // e.g. 0.91
    modelVersion: string; // e.g. "aasra-ai-distress-v1.4.2"
    timestamp: string; // ISO UTC
    mandatoryNotice: 'AI-assisted indicator — human review required.';
  };
  caseTimeline: Array<{
    id: string;
    date: string;
    milestone: string;
    status: 'Completed' | 'Upcoming' | 'In Progress';
    notes: string;
  }>;
  supportHistory: Array<{
    id: string;
    date: string;
    counsellor: string;
    sessionType: string;
    durationMins: number;
    outcome: string;
  }>;
  clinicalNotes: Array<{
    id: string;
    timestamp: string;
    author: string;
    noteType: 'Progress' | 'Assessment' | 'Observation' | 'Follow-up';
    content: string;
  }>;
  privacy: {
    consentStatus: 'Fully Granted' | 'Restricted' | 'Pending Refresh';
    voiceAnalysisAllowed: boolean;
    automatedRemindersAllowed: boolean;
    caseworkerAccessGranted: boolean;
    statutoryShield: 'Protected under Section 15A SC/ST PoA Act';
  };
}

export interface FollowUpScheduleItem {
  id: string;
  survivorId: string;
  anonymizedId: string;
  scheduledTime: string;
  modality: 'Tele-Counselling' | 'In-Person Sanctuary' | 'Secure Voice Note' | 'Caseworker Check-In';
  priority: 'Critical' | 'High' | 'Routine';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Rescheduled';
  counsellor: string;
  focusMilestone: string;
}

const SURVIVORS_STORE: AnonymizedSurvivorProfile[] = [
  {
    anonymizedId: 'SURV-7842',
    caseId: 'CASE-002',
    districtCode: 'AS-KAM-02',
    state: 'Assam',
    latestDistressIndicator: 47,
    baselineScore: 28,
    scoreChange: 19,
    scoreChangeFormatted: '+19 pts',
    riskCategory: 'Medium',
    lastCheckInFormatted: '2 hours ago (Chatbot / Hindi)',
    trendDirection: 'Rising',
    assignedCounsellor: 'Dr. Priya Nair',
    followUpStatus: 'Due Today',
    nextFollowUpDate: 'Today, 14:00 IST',
    activeAlertCount: 1,
    caseStage: 'Trial',
    overview: {
      intakeDate: '2026-09-01',
      preferredLanguage: 'Hindi (hi)',
      preferredChannel: 'Chatbot & SMS',
      trustedContactDesignation: 'Designated Kin (Verified)',
      protectiveMeasuresActive: ['Police Beat Patrol Log', 'Identity Anonymization Shield'],
      safeguardingSummary: 'Approaching deposition hearing. Shows elevated situational anxiety; stable support foundation.',
    },
    checkIns: [
      {
        id: 'chk-01',
        timestamp: '2026-09-28T10:15:00Z',
        channel: 'Chatbot',
        mood: 'Worried',
        textResponse: 'Court hearing date is close. I am feeling tense about answering questions.',
        voiceAcousticRecorded: true,
        distressScore: 47,
      },
      {
        id: 'chk-02',
        timestamp: '2026-09-26T08:30:00Z',
        channel: 'SMS',
        mood: 'Okay',
        textResponse: 'Resting today. Spoke to legal counsel.',
        voiceAcousticRecorded: false,
        distressScore: 44,
      },
      {
        id: 'chk-03',
        timestamp: '2026-09-24T18:00:00Z',
        channel: 'Mobile App',
        mood: 'Okay',
        textResponse: 'Did breathing exercise.',
        voiceAcousticRecorded: false,
        distressScore: 46,
      },
    ],
    trends: {
      sevenDayAverage: 45.2,
      thirtyDayBaseline: 28.0,
      volatilityIndex: 'Moderate (±8 pts)',
      recentShifts: ['+19 pts elevation post-hearing notice', '-14 pts stabilization following legal aid meeting'],
    },
    aiSignals: {
      contributingSignals: [
        'Lexical anxiety markers regarding deposition summons',
        'Vocal acoustic pitch perturbation (jitter 4.8%) in voluntary voice check-in',
        'Upcoming scheduled court appearance within 5 calendar days',
        'Intake baseline shift (+19 points above personal threshold)',
      ],
      modelConfidence: 0.91,
      modelVersion: 'aasra-ai-distress-v1.4.2',
      timestamp: '2026-09-28T10:15:20Z',
      mandatoryNotice: 'AI-assisted indicator — human review required.',
    },
    caseTimeline: [
      { id: 'tm-01', date: '2026-09-01', milestone: 'FIR Registered & PoA Section 15A Invoked', status: 'Completed', notes: 'Zero FIR transferred to Kamrup Rural' },
      { id: 'tm-02', date: '2026-09-14', milestone: 'Charge Sheet Submitted by DSP Investigation Cell', status: 'Completed', notes: 'Sealed witness statement recorded' },
      { id: 'tm-03', date: '2026-09-20', milestone: 'Legal Aid Counsel Briefing', status: 'Completed', notes: 'Advocate Ramesh assigned for protective representation' },
      { id: 'tm-04', date: '2026-10-03', milestone: 'Special Court Pre-Trial Deposition', status: 'Upcoming', notes: 'In-camera proceeding requested by counsel' },
    ],
    supportHistory: [
      { id: 'sup-01', date: '2026-09-07', counsellor: 'Dr. Priya Nair', sessionType: 'Intake & Grounding', durationMins: 45, outcome: 'Baseline established; consented to digital care' },
      { id: 'sup-02', date: '2026-09-21', counsellor: 'Dr. Priya Nair', sessionType: 'Pre-Hearing Preparation', durationMins: 40, outcome: 'Grounding techniques reviewed; distress eased from 72 to 58' },
    ],
    clinicalNotes: [
      {
        id: 'not-01',
        timestamp: '2026-09-21T11:30:00Z',
        author: 'Dr. Priya Nair (Lead Clinical Psychologist)',
        noteType: 'Progress',
        content: 'Survivor expresses fear of court environment. Addressed cognitive grounding and confirmed presence of woman officer during transit.',
      },
    ],
    privacy: {
      consentStatus: 'Fully Granted',
      voiceAnalysisAllowed: true,
      automatedRemindersAllowed: true,
      caseworkerAccessGranted: true,
      statutoryShield: 'Protected under Section 15A SC/ST PoA Act',
    },
  },
  {
    anonymizedId: 'SURV-9120',
    caseId: 'CASE-005',
    districtCode: 'RJ-SWM-01',
    state: 'Rajasthan',
    latestDistressIndicator: 82,
    baselineScore: 35,
    scoreChange: 47,
    scoreChangeFormatted: '+47 pts',
    riskCategory: 'Critical',
    lastCheckInFormatted: '18 hours ago (IVRS Missed)',
    trendDirection: 'Spiking',
    assignedCounsellor: 'Dr. Rajesh Verma',
    followUpStatus: 'Due Today',
    nextFollowUpDate: 'Immediate Priority',
    activeAlertCount: 2,
    caseStage: 'Protection',
    overview: {
      intakeDate: '2026-08-15',
      preferredLanguage: 'Hindi / Marwari',
      preferredChannel: 'IVRS & Phone Call',
      trustedContactDesignation: 'Community Sarpanch Representative',
      protectiveMeasuresActive: ['Armed Escort Order Issued', 'Safe House Relocation'],
      safeguardingSummary: 'Active intimidation threats recorded. Requires coordinated district security escort.',
    },
    checkIns: [
      {
        id: 'chk-04',
        timestamp: '2026-09-27T18:00:00Z',
        channel: 'IVRS',
        mood: 'Very distressed',
        textResponse: 'People gathered near house. Feeling unsafe.',
        voiceAcousticRecorded: true,
        distressScore: 82,
      },
    ],
    trends: {
      sevenDayAverage: 76.5,
      thirtyDayBaseline: 35.0,
      volatilityIndex: 'High (±18 pts)',
      recentShifts: ['+47 pts acute spike following threat incidents'],
    },
    aiSignals: {
      contributingSignals: [
        'Reported threat keywords detected in telephony check-in audio note',
        'Two consecutive missed scheduled wellness pulses',
        'Intimidation incident logged in police crime dispatch log',
      ],
      modelConfidence: 0.94,
      modelVersion: 'aasra-ai-distress-v1.4.2',
      timestamp: '2026-09-27T18:05:00Z',
      mandatoryNotice: 'AI-assisted indicator — human review required.',
    },
    caseTimeline: [
      { id: 'tm-05', date: '2026-08-15', milestone: 'FIR Lodged under Section 3(1)(w) SC/ST Act', status: 'Completed', notes: 'Immediate protection requested' },
      { id: 'tm-06', date: '2026-09-26', milestone: 'Witness Threat Incident Recorded', status: 'Completed', notes: 'Reported to SP Office' },
    ],
    supportHistory: [
      { id: 'sup-03', date: '2026-08-20', counsellor: 'Dr. Rajesh Verma', sessionType: 'Crisis Triage', durationMins: 50, outcome: 'Immediate shelter support coordinated' },
    ],
    clinicalNotes: [
      {
        id: 'not-02',
        timestamp: '2026-09-27T19:00:00Z',
        author: 'Dr. Rajesh Verma (District Officer)',
        noteType: 'Assessment',
        content: 'Emergency protection protocol triggered. Police patrol intensified around survivor household.',
      },
    ],
    privacy: {
      consentStatus: 'Fully Granted',
      voiceAnalysisAllowed: true,
      automatedRemindersAllowed: true,
      caseworkerAccessGranted: true,
      statutoryShield: 'Protected under Section 15A SC/ST PoA Act',
    },
  },
  {
    anonymizedId: 'SURV-6504',
    caseId: 'CASE-009',
    districtCode: 'TN-MDU-03',
    state: 'Tamil Nadu',
    latestDistressIndicator: 52,
    baselineScore: 40,
    scoreChange: 12,
    scoreChangeFormatted: '+12 pts',
    riskCategory: 'Medium',
    lastCheckInFormatted: 'Yesterday (SMS / Tamil)',
    trendDirection: 'Rising',
    assignedCounsellor: 'S. Meenakshi',
    followUpStatus: 'Scheduled',
    nextFollowUpDate: 'Tomorrow, 11:00 IST',
    activeAlertCount: 1,
    caseStage: 'Investigation',
    overview: {
      intakeDate: '2026-09-10',
      preferredLanguage: 'Tamil (ta)',
      preferredChannel: 'SMS',
      trustedContactDesignation: 'District Legal Aid Volunteer',
      protectiveMeasuresActive: ['Quarterly Welfare Check'],
      safeguardingSummary: 'Engagement cadence declining. Requires gentle motivational touchpoint.',
    },
    checkIns: [],
    trends: {
      sevenDayAverage: 48.0,
      thirtyDayBaseline: 40.0,
      volatilityIndex: 'Low (±5 pts)',
      recentShifts: ['Cadence lengthened from 2 to 5 days'],
    },
    aiSignals: {
      contributingSignals: [
        'Gradual decline in response length over last 3 SMS pulses',
        'Mild baseline elevation (+12 pts)',
      ],
      modelConfidence: 0.88,
      modelVersion: 'aasra-ai-distress-v1.4.2',
      timestamp: '2026-09-27T14:00:00Z',
      mandatoryNotice: 'AI-assisted indicator — human review required.',
    },
    caseTimeline: [],
    supportHistory: [],
    clinicalNotes: [],
    privacy: {
      consentStatus: 'Fully Granted',
      voiceAnalysisAllowed: false,
      automatedRemindersAllowed: true,
      caseworkerAccessGranted: true,
      statutoryShield: 'Protected under Section 15A SC/ST PoA Act',
    },
  },
  {
    anonymizedId: 'SURV-4318',
    caseId: 'CASE-012',
    districtCode: 'BR-GAY-01',
    state: 'Bihar',
    latestDistressIndicator: 24,
    baselineScore: 32,
    scoreChange: -8,
    scoreChangeFormatted: '-8 pts',
    riskCategory: 'Low',
    lastCheckInFormatted: '3 hours ago (Mobile App / Hindi)',
    trendDirection: 'Improving',
    assignedCounsellor: 'Amitabh Sen',
    followUpStatus: 'Completed',
    nextFollowUpDate: 'Next Week',
    activeAlertCount: 0,
    caseStage: 'Rehabilitation',
    overview: {
      intakeDate: '2026-08-01',
      preferredLanguage: 'Hindi (hi)',
      preferredChannel: 'Mobile App',
      trustedContactDesignation: 'Self-Directed',
      protectiveMeasuresActive: ['Compensation Sanction Released'],
      safeguardingSummary: 'Stable and self-directed. Compensation installment received.',
    },
    checkIns: [],
    trends: {
      sevenDayAverage: 25.0,
      thirtyDayBaseline: 32.0,
      volatilityIndex: 'Stable (±3 pts)',
      recentShifts: ['Sustained distress reduction below baseline'],
    },
    aiSignals: {
      contributingSignals: [
        'Positive emotional keywords in mobile app journal',
        'Consistently regular daily check-in streak (28 days)',
      ],
      modelConfidence: 0.95,
      modelVersion: 'aasra-ai-distress-v1.4.2',
      timestamp: '2026-09-28T09:00:00Z',
      mandatoryNotice: 'AI-assisted indicator — human review required.',
    },
    caseTimeline: [],
    supportHistory: [],
    clinicalNotes: [],
    privacy: {
      consentStatus: 'Fully Granted',
      voiceAnalysisAllowed: true,
      automatedRemindersAllowed: true,
      caseworkerAccessGranted: true,
      statutoryShield: 'Protected under Section 15A SC/ST PoA Act',
    },
  },
];

const FOLLOWUP_SCHEDULE_STORE: FollowUpScheduleItem[] = [
  {
    id: 'fup-01',
    survivorId: 'SURV-7842',
    anonymizedId: 'SURV-7842 (CASE-002)',
    scheduledTime: 'Today, 14:00 IST',
    modality: 'Tele-Counselling',
    priority: 'High',
    status: 'Scheduled',
    counsellor: 'Dr. Priya Nair',
    focusMilestone: 'Pre-trial deposition grounding and escort review',
  },
  {
    id: 'fup-02',
    survivorId: 'SURV-9120',
    anonymizedId: 'SURV-9120 (CASE-005)',
    scheduledTime: 'Today, 16:30 IST',
    modality: 'In-Person Sanctuary',
    priority: 'Critical',
    status: 'Scheduled',
    counsellor: 'Dr. Rajesh Verma',
    focusMilestone: 'Intimidation threat review and safe house relocation confirmation',
  },
  {
    id: 'fup-03',
    survivorId: 'SURV-6504',
    anonymizedId: 'SURV-6504 (CASE-009)',
    scheduledTime: 'Tomorrow, 11:00 IST',
    modality: 'Caseworker Check-In',
    priority: 'Routine',
    status: 'Scheduled',
    counsellor: 'S. Meenakshi',
    focusMilestone: 'Check-in engagement cadence encouragement',
  },
];

export class CounsellorWorkbenchEngine {
  private static instance: CounsellorWorkbenchEngine;
  private survivors: AnonymizedSurvivorProfile[] = [...SURVIVORS_STORE];
  private schedule: FollowUpScheduleItem[] = [...FOLLOWUP_SCHEDULE_STORE];

  private constructor() {}

  public static getInstance(): CounsellorWorkbenchEngine {
    if (!CounsellorWorkbenchEngine.instance) {
      CounsellorWorkbenchEngine.instance = new CounsellorWorkbenchEngine();
    }
    return CounsellorWorkbenchEngine.instance;
  }

  public getSurvivors(): AnonymizedSurvivorProfile[] {
    return [...this.survivors];
  }

  public getSurvivorById(id: string): AnonymizedSurvivorProfile | undefined {
    return this.survivors.find(s => s.anonymizedId === id || s.caseId === id);
  }

  public getSchedule(): FollowUpScheduleItem[] {
    return [...this.schedule];
  }

  // Counsellor Action 1: Contact survivor
  public recordContact(survivorId: string, author: string, channel: string, notes: string): AnonymizedSurvivorProfile {
    const s = this.getSurvivorById(survivorId);
    if (!s) throw new Error(`Survivor ${survivorId} not found`);

    s.clinicalNotes.unshift({
      id: `not-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author,
      noteType: 'Follow-up',
      content: `Direct contact established via ${channel}: ${notes}`,
    });
    s.followUpStatus = 'Completed';
    return { ...s };
  }

  // Counsellor Action 2: Schedule follow-up
  public scheduleFollowUp(params: {
    survivorId: string;
    scheduledTime: string;
    modality: FollowUpScheduleItem['modality'];
    priority: FollowUpScheduleItem['priority'];
    counsellor: string;
    focusMilestone: string;
  }): FollowUpScheduleItem {
    const s = this.getSurvivorById(params.survivorId);
    if (!s) throw new Error(`Survivor ${params.survivorId} not found`);

    const newItem: FollowUpScheduleItem = {
      id: `fup-${Date.now()}`,
      survivorId: params.survivorId,
      anonymizedId: `${s.anonymizedId} (${s.caseId})`,
      scheduledTime: params.scheduledTime,
      modality: params.modality,
      priority: params.priority,
      status: 'Scheduled',
      counsellor: params.counsellor,
      focusMilestone: params.focusMilestone,
    };
    this.schedule.unshift(newItem);
    s.followUpStatus = 'Scheduled';
    s.nextFollowUpDate = params.scheduledTime;
    return newItem;
  }

  // Counsellor Action 3: Add Note
  public addClinicalNote(survivorId: string, author: string, noteType: 'Progress' | 'Assessment' | 'Observation' | 'Follow-up', content: string): AnonymizedSurvivorProfile {
    const s = this.getSurvivorById(survivorId);
    if (!s) throw new Error(`Survivor ${survivorId} not found`);

    s.clinicalNotes.unshift({
      id: `not-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author,
      noteType,
      content,
    });
    return { ...s };
  }

  // Counsellor Action 4: Assign counsellor
  public assignCounsellor(survivorId: string, newCounsellor: string, author: string, reason: string): AnonymizedSurvivorProfile {
    const s = this.getSurvivorById(survivorId);
    if (!s) throw new Error(`Survivor ${survivorId} not found`);

    const old = s.assignedCounsellor;
    s.assignedCounsellor = newCounsellor;
    s.clinicalNotes.unshift({
      id: `not-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author,
      noteType: 'Assessment',
      content: `Caseworker assignment transferred from ${old} to ${newCounsellor}. Reason: ${reason}`,
    });
    return { ...s };
  }

  // Counsellor Action 5: Escalate
  public escalateSurvivor(survivorId: string, targetAuthority: string, author: string, rationale: string): AnonymizedSurvivorProfile {
    const s = this.getSurvivorById(survivorId);
    if (!s) throw new Error(`Survivor ${survivorId} not found`);

    s.activeAlertCount += 1;
    s.riskCategory = 'Critical';
    s.followUpStatus = 'Due Today';
    s.clinicalNotes.unshift({
      id: `not-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author,
      noteType: 'Assessment',
      content: `Priority escalation dispatched to ${targetAuthority}. Rationale: ${rationale}`,
    });
    return { ...s };
  }

  // Counsellor Action 6: Resolve Alert
  public resolveAlert(survivorId: string, author: string, resolutionSummary: string): AnonymizedSurvivorProfile {
    const s = this.getSurvivorById(survivorId);
    if (!s) throw new Error(`Survivor ${survivorId} not found`);

    s.activeAlertCount = Math.max(0, s.activeAlertCount - 1);
    s.clinicalNotes.unshift({
      id: `not-${Date.now()}`,
      timestamp: new Date().toISOString(),
      author,
      noteType: 'Follow-up',
      content: `Alert resolved: ${resolutionSummary}`,
    });
    return { ...s };
  }
}

export const counsellorWorkbenchEngine = CounsellorWorkbenchEngine.getInstance();
