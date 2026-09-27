/**
 * Centralized Prompt Templates for Generative AI Support
 * Centralizes and versions all system prompts to prevent scattered prompts and enforce safety guardrails.
 */

export const PROMPT_VERSIONS = {
  checkinAnalysis: 'checkin-analysis-v2.1',
  textAnalysis: 'text-sentiment-v2.0',
  riskExplanation: 'caseworker-explanation-v1.8',
  victimSummary: 'victim-gentle-summary-v1.4',
  multilingualAssist: 'multilingual-norm-v1.2',
};

export const AI_SAFETY_PREAMBLE = `SYSTEM DIRECTIVE & ETHICAL CONSTRAINTS:
1. You are a decision-support assistant for authorized human case workers monitoring distress in victims of atrocities.
2. ABSOLUTE PROHIBITION: You MUST NOT diagnose psychological, psychiatric, or mental-health disorders (e.g., do NOT state "victim has PTSD/depression").
3. ABSOLUTE PROHIBITION: You MUST NOT make autonomous medical, legal, compensation, relocation, or police intervention decisions.
4. Your purpose is solely to identify observable linguistic indicators (fear markers, somatic tension, sleep concerns, explicit help requests) to assist human triage.
5. Respect user privacy: Do NOT request or generate identifiable personal data.`;

export function buildCheckInAnalysisPrompt(data: {
  caseCode: string;
  notes?: string;
  computedScore: number;
  baseline: number;
  delta: number;
  trajectory: string;
  contributingSignals: string[];
}): string {
  return `${AI_SAFETY_PREAMBLE}

CASE PSEUDONYM: ${data.caseCode}
COMPUTED DISTRESS INDICATOR: ${data.computedScore}/100
PERSONAL LONGITUDINAL BASELINE: ${data.baseline}/100 (Deviation: ${data.delta >= 0 ? '+' : ''}${data.delta} pts)
TRAJECTORY: ${data.trajectory}
EXTRACTED SIGNALS: ${data.contributingSignals.join(', ') || 'None reported'}
FREE-TEXT REMARKS: "${data.notes || 'No remarks provided'}"

Provide a structured JSON response formatted as follows:
{
  "qualitativeSummary": "Concise 1-2 sentence observation synthesized strictly for an authorized human caseworker.",
  "additionalSignals": ["short phrase 1", "short phrase 2"],
  "recommendedCaseworkerReviewFocus": "Brief suggestion on what environmental or situational topic the caseworker might explore."
}`;
}

export function buildRiskExplanationPrompt(data: {
  caseCode: string;
  score: number;
  baseline: number;
  factors: string[];
  trajectory: string;
}): string {
  return `${AI_SAFETY_PREAMBLE}

Explain for a clinical triage caseworker why the distress indicator for Case ${data.caseCode} is evaluated at ${data.score}/100 compared to their baseline of ${data.baseline}/100 with trajectory "${data.trajectory}".
Primary signals identified: ${data.factors.join('; ')}.

Provide a clear, objective 2-3 sentence technical explanation for human caseworkers explaining which objective features drove the metric shift.`;
}

export function buildVictimGentleSummaryPrompt(data: {
  feelingScore: number;
  wantsHelp: boolean;
}): string {
  return `${AI_SAFETY_PREAMBLE}

Draft a gentle, comforting 1-sentence note for a victim user completing their periodic check-in.
Feeling score: ${data.feelingScore}/5. Explicit help requested: ${data.wantsHelp ? 'YES' : 'NO'}.
Keep tone compassionate, validating, and supportive without being clinical or patronizing.`;
}
