/**
 * Dynamic Distress Indicator Longitudinal Engine (Phase 6)
 *
 * IMPORTANT NON-CLINICAL RULE:
 * The score is strictly labelled: "Dynamic Distress Indicator".
 * It is NOT a "Medical diagnosis".
 * Risk categories (Low, Medium, High, Critical) are operational triage indicators,
 * NOT clinical diagnoses.
 *
 * Do not rely on color alone to communicate risk.
 * Every risk state includes:
 * - icon identifier
 * - text label
 * - accessible description
 */

export type DynamicRiskCategory = 'Low' | 'Medium' | 'High' | 'Critical';

export interface RiskStateMetadata {
  category: DynamicRiskCategory;
  textLabel: string;
  iconName: 'ShieldCheck' | 'Activity' | 'AlertTriangle' | 'ShieldAlert';
  accessibleDescription: string;
  colorHex: string;
  contrastPattern: string; // Accessible geometric texture/border descriptor
  caseworkerProtocol: string;
}

export const RISK_STATE_CONFIGS: Record<DynamicRiskCategory, RiskStateMetadata> = {
  Low: {
    category: 'Low',
    textLabel: 'Low Risk Indicator',
    iconName: 'ShieldCheck',
    accessibleDescription: 'Stable operational indicator within expected baseline tolerance. Self-directed care appropriate.',
    colorHex: '#10b981',
    contrastPattern: 'solid-emerald-border',
    caseworkerProtocol: 'Maintain standard routine check-in cadence.',
  },
  Medium: {
    category: 'Medium',
    textLabel: 'Medium Risk Indicator',
    iconName: 'Activity',
    accessibleDescription: 'Moderate situational stress or engagement dip detected. Proactive follow-up recommended.',
    colorHex: '#3b82f6',
    contrastPattern: 'double-blue-border',
    caseworkerProtocol: 'Schedule check-in pulse within 3 days; share grounding materials.',
  },
  High: {
    category: 'High',
    textLabel: 'High Risk Indicator',
    iconName: 'AlertTriangle',
    accessibleDescription: 'Significant distress spike observed above personal baseline. Requires priority human review.',
    colorHex: '#f59e0b',
    contrastPattern: 'dashed-amber-border',
    caseworkerProtocol: 'Caseworker follow-up outreach recommended within 24 hours.',
  },
  Critical: {
    category: 'Critical',
    textLabel: 'Critical Risk Indicator',
    iconName: 'ShieldAlert',
    accessibleDescription: 'Acute situational distress crisis detected. Immediate caseworker triage protocol active.',
    colorHex: '#ef4444',
    contrastPattern: 'thick-rose-border',
    caseworkerProtocol: 'Immediate caseworker outreach and 24x7 crisis support coordination.',
  },
};

export interface LongitudinalObservation {
  day: number;
  dateStr: string;
  score: number;
  baseline: number;
  change: number; // score - baseline
  category: DynamicRiskCategory;
  milestoneEvent?: string;
  checkInChannel: 'sms' | 'ivrs' | 'chatbot' | 'mobile_app' | 'web_portal';
}

export interface MajorTrendChange {
  id: string;
  day: number;
  dateStr: string;
  delta: number; // e.g. +19, -8
  summary: string;
  triggerEvent: string;
  categoryTransition: string; // e.g. "Low → High"
}

export interface DynamicDistressProfile {
  survivorId: string;
  currentScore: number;
  baselineScore: number;
  scoreChange: number; // current - baseline
  scoreChangeFormatted: string; // e.g. "+19"
  currentRiskState: RiskStateMetadata;
  sevenDayTrend: LongitudinalObservation[];
  thirtyDayTrend: LongitudinalObservation[];
  majorChanges: MajorTrendChange[];
  confidence: number; // e.g. 0.92
  contributingSignals: string[];
  disclaimer: string;
  evaluatedAt: string;
}

export function resolveRiskCategory(score: number): DynamicRiskCategory {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 36) return 'Medium';
  return 'Low';
}

// 30-Day Longitudinal dataset representing a survivor case journey with realistic milestone stressors
const BASELINE_HISTORICAL_DATA: LongitudinalObservation[] = [
  { day: 1, dateStr: 'Day 1 (Sep 01)', score: 28, baseline: 28, change: 0, category: 'Low', milestoneEvent: 'Case Intake & Sanctuary Setup', checkInChannel: 'web_portal' },
  { day: 2, dateStr: 'Day 2 (Sep 02)', score: 30, baseline: 28, change: 2, category: 'Low', checkInChannel: 'chatbot' },
  { day: 3, dateStr: 'Day 3 (Sep 03)', score: 29, baseline: 28, change: 1, category: 'Low', checkInChannel: 'sms' },
  { day: 4, dateStr: 'Day 4 (Sep 04)', score: 32, baseline: 28, change: 4, category: 'Low', checkInChannel: 'mobile_app' },
  { day: 5, dateStr: 'Day 5 (Sep 05)', score: 34, baseline: 28, change: 6, category: 'Low', checkInChannel: 'chatbot' },
  { day: 6, dateStr: 'Day 6 (Sep 06)', score: 31, baseline: 28, change: 3, category: 'Low', checkInChannel: 'web_portal' },
  { day: 7, dateStr: 'Day 7 (Sep 07)', score: 35, baseline: 28, change: 7, category: 'Low', milestoneEvent: 'First Counselling Session', checkInChannel: 'mobile_app' },
  { day: 8, dateStr: 'Day 8 (Sep 08)', score: 33, baseline: 28, change: 5, category: 'Low', checkInChannel: 'sms' },
  { day: 9, dateStr: 'Day 9 (Sep 09)', score: 36, baseline: 28, change: 8, category: 'Medium', checkInChannel: 'chatbot' },
  { day: 10, dateStr: 'Day 10 (Sep 10)', score: 38, baseline: 28, change: 10, category: 'Medium', checkInChannel: 'ivrs' },
  { day: 11, dateStr: 'Day 11 (Sep 11)', score: 40, baseline: 28, change: 12, category: 'Medium', checkInChannel: 'mobile_app' },
  { day: 12, dateStr: 'Day 12 (Sep 12)', score: 39, baseline: 28, change: 11, category: 'Medium', checkInChannel: 'web_portal' },
  { day: 13, dateStr: 'Day 13 (Sep 13)', score: 42, baseline: 28, change: 14, category: 'Medium', checkInChannel: 'sms' },
  { day: 14, dateStr: 'Day 14 (Sep 14)', score: 41, baseline: 28, change: 13, category: 'Medium', milestoneEvent: 'Investigation Statement Sealed', checkInChannel: 'mobile_app' },
  { day: 15, dateStr: 'Day 15 (Sep 15)', score: 45, baseline: 28, change: 17, category: 'Medium', checkInChannel: 'chatbot' },
  { day: 16, dateStr: 'Day 16 (Sep 16)', score: 48, baseline: 28, change: 20, category: 'Medium', checkInChannel: 'ivrs' },
  { day: 17, dateStr: 'Day 17 (Sep 17)', score: 54, baseline: 28, change: 26, category: 'Medium', checkInChannel: 'sms' },
  { day: 18, dateStr: 'Day 18 (Sep 18)', score: 68, baseline: 28, change: 40, category: 'High', milestoneEvent: 'Court Hearing Notice Received', checkInChannel: 'mobile_app' },
  { day: 19, dateStr: 'Day 19 (Sep 19)', score: 72, baseline: 28, change: 44, category: 'High', checkInChannel: 'chatbot' },
  { day: 20, dateStr: 'Day 20 (Sep 20)', score: 65, baseline: 28, change: 37, category: 'High', milestoneEvent: 'Advocate Ramesh Consultation', checkInChannel: 'web_portal' },
  { day: 21, dateStr: 'Day 21 (Sep 21)', score: 58, baseline: 28, change: 30, category: 'Medium', checkInChannel: 'mobile_app' },
  { day: 22, dateStr: 'Day 22 (Sep 22)', score: 52, baseline: 28, change: 24, category: 'Medium', checkInChannel: 'sms' },
  { day: 23, dateStr: 'Day 23 (Sep 23)', score: 49, baseline: 28, change: 21, category: 'Medium', checkInChannel: 'chatbot' },
  { day: 24, dateStr: 'Day 24 (Sep 24)', score: 46, baseline: 28, change: 18, category: 'Medium', checkInChannel: 'web_portal' },
  { day: 25, dateStr: 'Day 25 (Sep 25)', score: 44, baseline: 28, change: 16, category: 'Medium', milestoneEvent: 'Pre-Trial Grounding Support', checkInChannel: 'mobile_app' },
  { day: 26, dateStr: 'Day 26 (Sep 26)', score: 45, baseline: 28, change: 17, category: 'Medium', checkInChannel: 'sms' },
  { day: 27, dateStr: 'Day 27 (Sep 27)', score: 46, baseline: 28, change: 18, category: 'Medium', checkInChannel: 'ivrs' },
  { day: 28, dateStr: 'Day 28 (Sep 28)', score: 47, baseline: 28, change: 19, category: 'Medium', milestoneEvent: 'Today (Active Follow-up)', checkInChannel: 'chatbot' },
];

export class DynamicDistressEngine {
  private static instance: DynamicDistressEngine;

  private constructor() {}

  public static getInstance(): DynamicDistressEngine {
    if (!DynamicDistressEngine.instance) {
      DynamicDistressEngine.instance = new DynamicDistressEngine();
    }
    return DynamicDistressEngine.instance;
  }

  /**
   * Generates a complete longitudinal Dynamic Distress Indicator profile.
   * Matches the required specification:
   * Score: 0-100
   * Labelled: "Dynamic Distress Indicator" (NOT Medical diagnosis)
   * Baseline comparison: e.g. Baseline: 28, Current: 47, Change: +19
   * Risk Categories: Low, Medium, High, Critical
   */
  public getDistressProfile(survivorId: string = 'usr-victim-001', customScore?: number, customBaseline?: number): DynamicDistressProfile {
    const thirtyDay = [...BASELINE_HISTORICAL_DATA];
    const latest = thirtyDay[thirtyDay.length - 1];

    const currentScore = customScore !== undefined ? Math.max(0, Math.min(100, customScore)) : latest.score;
    const baselineScore = customBaseline !== undefined ? Math.max(0, Math.min(100, customBaseline)) : latest.baseline;

    const scoreChange = currentScore - baselineScore;
    const scoreChangeFormatted = scoreChange >= 0 ? `+${scoreChange}` : `${scoreChange}`;

    const category = resolveRiskCategory(currentScore);
    const riskState = RISK_STATE_CONFIGS[category];

    // 7-Day Trend: Last 7 observations with currentScore applied to the latest day
    const sevenDaySlice = thirtyDay.slice(-7).map((obs, idx, arr) => {
      if (idx === arr.length - 1) {
        return {
          ...obs,
          score: currentScore,
          baseline: baselineScore,
          change: scoreChange,
          category,
        };
      }
      return obs;
    });

    // Detect Major Changes
    const majorChanges: MajorTrendChange[] = [
      {
        id: 'chg-01',
        day: 18,
        dateStr: 'Day 18 (Sep 18)',
        delta: +19,
        summary: 'Sharp distress elevation (+19 pts over baseline) following summons notice',
        triggerEvent: 'Notice of Scheduled Deposition',
        categoryTransition: 'Medium → High',
      },
      {
        id: 'chg-02',
        day: 21,
        dateStr: 'Day 21 (Sep 21)',
        delta: -14,
        summary: 'Stabilizing reduction (-14 pts) after meeting with assigned legal aid counsel',
        triggerEvent: 'Advocate Protective Escort Briefing',
        categoryTransition: 'High → Medium',
      },
      {
        id: 'chg-03',
        day: 28,
        dateStr: 'Day 28 (Today)',
        delta: scoreChange,
        summary: `Current longitudinal indicator: ${currentScore}/100 (${scoreChangeFormatted} vs baseline ${baselineScore})`,
        triggerEvent: 'Routine Multi-Channel Pulse Check-In',
        categoryTransition: `${category} Risk Indicator State`,
      },
    ];

    const contributingSignals = [
      `Elevated situational baseline shift (${scoreChangeFormatted} points above intake)`,
      'Upcoming legal milestone within 7 calendar days',
      'Moderate vocal pitch jitter observed in voluntary IVRS audio note',
      'One missed check-in recorded on Day 17 prior to court summons delivery',
    ];

    return {
      survivorId,
      currentScore,
      baselineScore,
      scoreChange,
      scoreChangeFormatted,
      currentRiskState: riskState,
      sevenDayTrend: sevenDaySlice,
      thirtyDayTrend: thirtyDay,
      majorChanges,
      confidence: 0.92,
      contributingSignals,
      disclaimer: 'System-defined operational risk indicator, not a clinical or psychiatric diagnosis.',
      evaluatedAt: new Date().toISOString(),
    };
  }
}

export const dynamicDistressEngine = DynamicDistressEngine.getInstance();
