/**
 * PHASE 18: DEMONSTRATION MODE ENGINE & REALISTIC SCENARIO REGISTRY
 * 
 * Strict Guarantees:
 * - 100% Synthetic Data Only
 * - Never use real survivor information
 * - Fully covers 5 demo accounts & 6 realistic clinical/legal scenarios
 * - Implements end-to-end 8-stage lifecycle progression:
 *   Check-in -> AI analysis -> Distress indicator -> Risk prediction ->
 *   Alert -> Counsellor review -> Intervention -> Resolution
 */

import { UserRole } from '@/types';

// ============================================================================
// 1. STATUTORY DEMO & SYNTHETIC DATA DISCLOSURE
// ============================================================================
export const DEMO_SYNTHETIC_DATA_DISCLOSURE = {
  badge: 'DEMO / SYNTHETIC DATA',
  heading: 'Demonstration & Simulation Environment Active',
  notice: 'All survivor profiles, identification codes, clinical scores, and judicial case milestones presented in this prototype are entirely synthetic. Never enter or process real survivor information.',
  legalFramework: 'Compliant with SC/ST (PoA) Act Section 15A & DPDPA 2023 privacy-by-design standards.',
};

// ============================================================================
// 2. DEMO ACCOUNTS (5 ROLES)
// ============================================================================
export interface DemoAccount {
  id: string;
  role: UserRole;
  displayName: string;
  title: string;
  organization: string;
  syntheticEmail: string;
  defaultCaseId?: string;
  scope: string;
  permissionsDescription: string;
  avatarInitials: string;
}

export const DEMO_ACCOUNTS: Record<string, DemoAccount> = {
  survivor: {
    id: 'usr-victim-001',
    role: 'victim',
    displayName: 'Ananya Sharma',
    title: 'Survivor / Complainant',
    organization: 'Atrocity Survivor Welfare Registry (Synthetic)',
    syntheticEmail: 'ananya.sharma.demo@manas-suraksha.in',
    defaultCaseId: 'CASE-002',
    scope: 'Self Case Sovereignty (CASE-002 / BEN-7821)',
    permissionsDescription: 'Daily emotional check-ins, privacy consent management, direct counsellor messaging, and 24/7 emergency hotline triggers.',
    avatarInitials: 'AS',
  },
  counsellor: {
    id: 'usr-counsellor-002',
    role: 'counsellor',
    displayName: 'Dr. Priya Nair',
    title: 'Senior Clinical Psychologist & Lead Case Worker',
    organization: 'District Kamrup Rural Casework Cell',
    syntheticEmail: 'priya.nair.demo@crisis-monitor.in',
    defaultCaseId: 'CASE-002',
    scope: 'Assigned Survivor Cohort (Kamrup Metropolitan / Rural)',
    permissionsDescription: 'Clinical triage workbench, longitudinal distress trend review, AI explanation inspections, intervention authorization, and alert resolution.',
    avatarInitials: 'PN',
  },
  district_officer: {
    id: 'usr-officer-003',
    role: 'district_officer',
    displayName: 'R. K. Barua',
    title: 'District Social Welfare Officer',
    organization: 'District Administration, Kamrup',
    syntheticEmail: 'rk.barua.demo@assam.gov.in',
    scope: 'District Aggregated Monitoring (Zero Raw PII Exposure)',
    permissionsDescription: 'District-wide caseload trends, inter-block triage analytics, protective escort mobilization, and compensation status monitoring.',
    avatarInitials: 'RB',
  },
  state_officer: {
    id: 'usr-state-004',
    role: 'state_admin',
    displayName: 'Sunita Bora',
    title: 'State Welfare Administrator',
    organization: 'Department of Social Justice & Empowerment, Assam',
    syntheticEmail: 'sunita.bora.demo@assam.gov.in',
    scope: 'State-Level Strategic Aggregation (35 Districts)',
    permissionsDescription: 'Cross-district comparative performance, multi-channel check-in adoption metrics, state resource allocation, and controlled audited reports.',
    avatarInitials: 'SB',
  },
  administrator: {
    id: 'usr-national-005',
    role: 'national_admin',
    displayName: 'Director General Verma',
    title: 'National Platform Administrator',
    organization: 'Ministry of Social Justice & Empowerment, New Delhi',
    syntheticEmail: 'dg.verma.demo@gov.in',
    scope: 'National System Oversight & DPDPA Governance',
    permissionsDescription: 'System-wide cryptographic audit verification, AI model version governance, security policies, and national priority queues.',
    avatarInitials: 'GV',
  },
};

// ============================================================================
// 3. REALISTIC DEMO SCENARIOS (6 SCENARIOS)
// ============================================================================
export interface DemoScenario {
  id: string;
  scenarioNumber: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
  shortSummary: string;
  targetRole: UserRole;
  targetCaseId: string;
  anonymizedCode: string;
  narrative: string;
  clinicalSignals: string[];
  baselineScore: number;
  currentScore: number;
  scoreDeltaFormatted: string;
  riskStatus: 'Stable' | 'Mild' | 'Elevated' | 'High Concern' | 'Critical';
  expectedOutcome: string;
  demonstratesFeature: string;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'scenario_1_stable',
    scenarioNumber: 1,
    title: 'Scenario 1: Stable Survivor',
    shortSummary: 'Consistent check-in adherence with low distress variance within personal baseline.',
    targetRole: 'victim',
    targetCaseId: 'CASE-001',
    anonymizedCode: 'BEN-4902',
    narrative: 'Survivor Ananya Devi (Ranchi) demonstrates stable routine check-ins over 60 days. Well-being scores track gently between 37 and 40 around an established baseline of 38. The system highlights calm longitudinal stability without false alarm generation.',
    clinicalSignals: [
      'Steady emotional responses across 4 consecutive check-ins',
      'Normal sleep quality rating (4/5) and low fear rating (1/5)',
      'Baseline deviation is minimal (+1 point)',
      'No critical keywords or safety flags detected',
    ],
    baselineScore: 38,
    currentScore: 39,
    scoreDeltaFormatted: '+1 (Normal Variance)',
    riskStatus: 'Stable',
    expectedOutcome: 'Routine periodic monitoring continues. No triage alerts generated.',
    demonstratesFeature: 'Baseline anchoring preventing alarm fatigue and false positives.',
  },
  {
    id: 'scenario_2_increasing',
    scenarioNumber: 2,
    title: 'Scenario 2: Increasing Distress Trend',
    shortSummary: 'Acute insomnia and anxiety spike (+33 points) triggering automated early warning.',
    targetRole: 'victim',
    targetCaseId: 'CASE-002',
    anonymizedCode: 'BEN-7821',
    narrative: 'Survivor in Kamrup receives trial summons. Subsequent check-in registers severe insomnia (1/5), high fear (5/5), and a distress score surging from 38 to 71 (+33 pts). AI models detect acute post-traumatic distress with 92% confidence and create an urgent alert.',
    clinicalSignals: [
      'Distress surged +33 points from baseline of 38',
      'Reported severe sleep disturbances and nightmares',
      'Voice analysis indicates acoustic pitch jitter and hesitation markers',
      'Explicit survivor request for caseworker follow-up',
    ],
    baselineScore: 38,
    currentScore: 71,
    scoreDeltaFormatted: '+33 (Rapid Escalation)',
    riskStatus: 'High Concern',
    expectedOutcome: 'Generates urgent triage alert. Notifies caseworker for immediate grounding intervention.',
    demonstratesFeature: 'Multi-signal dynamic distress calculation & calibrated risk alerting.',
  },
  {
    id: 'scenario_3_missed_checkins',
    scenarioNumber: 3,
    title: 'Scenario 3: Missed Check-ins',
    shortSummary: 'Engagement discontinuity detected over 12 days triggering non-alarming welfare outreach.',
    targetRole: 'counsellor',
    targetCaseId: 'ATC-2026-00131',
    anonymizedCode: 'BEN-8433',
    narrative: 'Survivor in South 24 Parganas had established daily check-ins but suddenly ceases responses for 4 consecutive check-in cycles (12 days). The system notes this behavioral drop without panic, raising an Attention Required notice to verify communication channel availability or trusted contacts.',
    clinicalSignals: [
      '3 consecutive periodic check-in prompts unanswered',
      'Perceived safety score previously declined from 3 to 1',
      'IVRS automated delivery reported unreachable telephony',
      'Secondary trusted contact notification suggested',
    ],
    baselineScore: 48,
    currentScore: 82,
    scoreDeltaFormatted: '+34 (Discontinuity Surge)',
    riskStatus: 'High Concern',
    expectedOutcome: 'Caseworker initiates gentle non-intrusive phone outreach to verify well-being and safety.',
    demonstratesFeature: 'Behavioral dropout detection & trauma-informed gentle welfare outreach.',
  },
  {
    id: 'scenario_4_milestone_distress',
    scenarioNumber: 4,
    title: 'Scenario 4: Case Milestone Followed by Distress Increase',
    shortSummary: 'Judicial milestone (chargesheet & court summons) correlates with psychological distress surge.',
    targetRole: 'counsellor',
    targetCaseId: 'ATC-2026-00124',
    anonymizedCode: 'BEN-7821',
    narrative: 'On 21 Sep 2026, the Special Court summons was served to the survivor\'s residence. The integrated legal-psychological timeline links this judicial milestone to a subsequent +26 point surge in distress, enabling pre-emptive courtroom support accompaniment.',
    clinicalSignals: [
      'Milestone: Witness deposition notice delivered to residence',
      'Distress escalated from 42 to 68 within 72 hours of notice',
      'Expressed anticipatory fear regarding confrontation in court',
      'Desire for pre-trial courtroom orientation and psychological support',
    ],
    baselineScore: 35,
    currentScore: 68,
    scoreDeltaFormatted: '+33 (Milestone Surge)',
    riskStatus: 'Elevated',
    expectedOutcome: 'Caseworker schedules pre-trial grounding and assigns DLSA victim advocate accompaniment.',
    demonstratesFeature: 'Cross-functional correlation between judicial milestones and distress surges.',
  },
  {
    id: 'scenario_5_alert_review',
    scenarioNumber: 5,
    title: 'Scenario 5: Alert Requiring Counsellor Review',
    shortSummary: 'Real-time alert requiring mandatory human-in-the-loop review under statutory safeguards.',
    targetRole: 'counsellor',
    targetCaseId: 'CASE-002',
    anonymizedCode: 'BEN-7821',
    narrative: 'Alert ALT-001 is flagged as "Urgent Review". Enforcing the core principle that AI cannot independently make consequential decisions, the caseworker must inspect the contributing signals, review the explanation panel, and explicitly assign follow-up action.',
    clinicalSignals: [
      'Alert Severity: Urgent Review (Score 71/100)',
      'Signal Combination: Sleep impairment + fear keyword + baseline surge',
      'AI Recommendation: Contact survivor within 24 hours & review safety plan',
      'Audit log tracks counsellor review timestamp and justification',
    ],
    baselineScore: 38,
    currentScore: 71,
    scoreDeltaFormatted: '+33 (Urgent Review)',
    riskStatus: 'High Concern',
    expectedOutcome: 'Counsellor acknowledges alert, inspects model confidence, and coordinates immediate call.',
    demonstratesFeature: 'Human-in-the-loop ethical AI governance mandated by Section 15A SC/ST PoA Act.',
  },
  {
    id: 'scenario_6_resolved_intervention',
    scenarioNumber: 6,
    title: 'Scenario 6: Resolved Support Intervention',
    shortSummary: 'Full-circle trajectory recovery following protective transit escort & counselling.',
    targetRole: 'counsellor',
    targetCaseId: 'CASE-004',
    anonymizedCode: 'BEN-8433',
    narrative: 'Demonstrates the closed-loop recovery journey: after an acute distress peak of 69 following intimidation, the welfare officer coordinated a safe transit police escort and 3 grounding sessions. Over 3 weeks, indicators recovered from 69 -> 60 -> 55 -> 42, enabling alert closure with clinical justification.',
    clinicalSignals: [
      'Intervention: Police protection escort & trauma grounding sessions completed',
      'Trajectory recovery: 69 -> 60 -> 55 -> 42 (Distress reduced by 27 points)',
      'Sleep stability restored to moderate level (3/5)',
      'Cryptographically sealed audit log marks alert successfully resolved',
    ],
    baselineScore: 35,
    currentScore: 42,
    scoreDeltaFormatted: '-27 (Recovery Trajectory)',
    riskStatus: 'Mild',
    expectedOutcome: 'Alert transitioned to Resolved with outcome note; survivor placed on standard monitoring.',
    demonstratesFeature: 'Closed-loop intervention verification, longitudinal recovery tracking & audit seals.',
  },
];

// ============================================================================
// 4. END-TO-END 8-STAGE LIFECYCLE PROGRESSION SPECIFICATION
// ============================================================================
export interface LifecycleStep {
  stepNumber: number;
  stageKey:
    | 'checkin'
    | 'ai_analysis'
    | 'distress_indicator'
    | 'risk_prediction'
    | 'alert'
    | 'counsellor_review'
    | 'intervention'
    | 'resolution';
  title: string;
  role: string;
  inputDescription: string;
  processingDescription: string;
  outputDescription: string;
  activeView: string;
}

export const LIFECYCLE_STAGES: LifecycleStep[] = [
  {
    stepNumber: 1,
    stageKey: 'checkin',
    title: '1. Survivor Check-In',
    role: 'Survivor (Ananya Sharma)',
    inputDescription: 'Survivor selects "Very distressed" (1/5), rating sleep 1/5 and fear 5/5, typing: "Summons delivered. I am terrified of going to court next week."',
    processingDescription: 'Input received over encrypted channel (AES-256), sanitized for privacy, and tokenized.',
    outputDescription: 'Check-in record persisted with timestamp and synthetic pseudonym BEN-7821.',
    activeView: 'dashboard',
  },
  {
    stepNumber: 2,
    stageKey: 'ai_analysis',
    title: '2. Multi-Channel AI Analysis',
    role: 'FastAPI AI Engine (Text/Voice/Behavior)',
    inputDescription: 'Tokenized responses and 14-second audio acoustic features passed to inference models.',
    processingDescription: 'Extracts distress markers, detects trauma keywords ("terrified", "court"), and scores vocal jitter.',
    outputDescription: 'Returns structured inference: Confidence 92%, Model v2.4.0-screening, Latency 42ms.',
    activeView: 'distress_score',
  },
  {
    stepNumber: 3,
    stageKey: 'distress_indicator',
    title: '3. Dynamic Distress Indicator',
    role: 'Distress Engine',
    inputDescription: 'Evaluates current screening against personal baseline (38).',
    processingDescription: 'Computes velocity (+33 pts) and acceleration over a 7-day sliding window.',
    outputDescription: 'Distress indicator updates to 71/100 (High Concern) with non-diagnostic disclaimer.',
    activeView: 'distress_score',
  },
  {
    stepNumber: 4,
    stageKey: 'risk_prediction',
    title: '4. Predictive Risk Modeling',
    role: 'Predictive Trajectory Service',
    inputDescription: 'Historical observations [38, 46, 57, 71] evaluated against milestone calendar.',
    processingDescription: 'Bayesian risk projection models 7-day trajectory if unaddressed.',
    outputDescription: 'Projected risk: 78% escalation probability without protective intervention.',
    activeView: 'predictive_risk',
  },
  {
    stepNumber: 5,
    stageKey: 'alert',
    title: '5. Real-Time Alert Generation',
    role: 'Calm Alert Management Service',
    inputDescription: 'Distress score >= 70 threshold reached with acute court summons milestone.',
    processingDescription: 'Generates non-alarming alert ALT-001 with severity "Urgent Review" and recommended actions.',
    outputDescription: 'Alert dispatched to Counsellor Workbench queue with complete signal attribution.',
    activeView: 'alerts',
  },
  {
    stepNumber: 6,
    stageKey: 'counsellor_review',
    title: '6. Counsellor Clinical Review',
    role: 'Counsellor (Dr. Priya Nair)',
    inputDescription: 'Caseworker opens ALT-001 in Counsellor Clinical Dashboard.',
    processingDescription: 'Reviews AI Explanation Panel: inspects baseline deviation (+33) and verifies judicial context.',
    outputDescription: 'Caseworker acknowledges alert and marks "Under Active Clinical Assessment".',
    activeView: 'cases',
  },
  {
    stepNumber: 7,
    stageKey: 'intervention',
    title: '7. Human Support Intervention',
    role: 'Caseworker & District Officer',
    inputDescription: 'Caseworker selects "Schedule Follow-up" and requests DLSA protective transit escort.',
    processingDescription: 'Records formal support action in judicial case milestone ledger.',
    outputDescription: 'Tele-counselling grounding session scheduled and transit escort confirmed for hearing day.',
    activeView: 'cases',
  },
  {
    stepNumber: 8,
    stageKey: 'resolution',
    title: '8. Recovery & Alert Resolution',
    role: 'Clinical Supervisor & System Audit',
    inputDescription: 'Post-intervention check-in records reduced fear; subsequent score falls from 71 -> 59 -> 44.',
    processingDescription: 'Longitudinal recovery confirmed; caseworker marks alert resolved with clinical outcome summary.',
    outputDescription: 'Alert closed, survivor returned to routine monitoring, and immutable SHA-256 audit entry logged.',
    activeView: 'dashboard',
  },
];
