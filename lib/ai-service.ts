import { RiskLevel, InterventionCategory } from '@/types';

export interface AnalysisInput {
  feelingScore: number; // 1 (Very distressed) - 5 (Doing well)
  safetyScore: number; // 1 (Very unsafe) - 5 (Very safe)
  sleepScore: number; // 1 (Severe insomnia) - 5 (Good sleep)
  fearScore: number; // 1 (Not fearful) - 5 (Extremely terrified)
  avoidanceScore: number; // 1 (No avoidance) - 5 (Total avoidance)
  requestHelp: boolean;
  notes?: string;
  hasVoiceSample?: boolean;
  voiceDurationSeconds?: number;
  previousScore?: number;
  baselineScore?: number;
  missedCheckIns?: number;
}

export interface AnalysisResult {
  computedScore: number; // 0 - 100
  riskLevel: RiskLevel;
  riskLabel: string;
  contributingSignals: string[];
  recommendedNextStep: string;
  suggestedInterventions: {
    category: InterventionCategory;
    title: string;
    rationale: string;
  }[];
  explanationSummary: string;
  sentimentRating: 'Positive' | 'Neutral' | 'Distressed' | 'Highly Distressed';
  linguisticMarkers: string[];
  disclaimer: string;
}

/**
 * Pure deterministic AI analysis algorithm for immediate client/server evaluation.
 * Follows strict ethical constraints: never diagnoses, only identifies elevated distress indicators.
 */
export function calculateDistressAnalysis(input: AnalysisInput): AnalysisResult {
  const {
    feelingScore = 3,
    safetyScore = 3,
    sleepScore = 3,
    fearScore = 1,
    avoidanceScore = 1,
    requestHelp = false,
    notes = '',
    hasVoiceSample = false,
    previousScore = 35,
    missedCheckIns = 0,
  } = input;

  // Invert positive scales so higher means more distress:
  // feelingScore: 1 (Very distressed) => 4 distress pts; 5 (Doing well) => 0 distress pts
  const feelingDistress = (5 - feelingScore) * 6; // 0 - 24
  const safetyDistress = (5 - safetyScore) * 6; // 0 - 24
  const sleepDistress = (5 - sleepScore) * 4; // 0 - 16
  const fearDistress = (fearScore - 1) * 5; // 0 - 20
  const avoidanceDistress = (avoidanceScore - 1) * 3; // 0 - 12

  let baseRawScore = feelingDistress + safetyDistress + sleepDistress + fearDistress + avoidanceDistress; // max ~96

  // Check notes for distress keywords
  const lowerText = (notes || '').toLowerCase();
  const fearKeywords = ['fear', 'scared', 'threat', 'unsafe', 'killed', 'attack', 'men', 'police', 'court', 'dar', 'chinta', 'bhoy'];
  const sleeplessKeywords = ['can\'t sleep', 'nightmare', 'insomnia', 'waking up', 'headache', 'neend', 'chokh'];
  const hopelessKeywords = ['alone', 'hopeless', 'crying', 'cannot take it', 'tired', 'help me', 'pareshan'];

  const linguisticMarkers: string[] = [];

  let textDistressBump = 0;
  if (fearKeywords.some(kw => lowerText.includes(kw))) {
    textDistressBump += 8;
    linguisticMarkers.push('Fear / security threat keywords detected in user statement');
  }
  if (sleeplessKeywords.some(kw => lowerText.includes(kw))) {
    textDistressBump += 6;
    linguisticMarkers.push('Sleep disturbance / physical distress keywords detected');
  }
  if (hopelessKeywords.some(kw => lowerText.includes(kw))) {
    textDistressBump += 8;
    linguisticMarkers.push('Acoustic / emotional overwhelm indicators present in narrative');
  }

  // Missed check-in penalty
  let engagementPenalty = 0;
  if (missedCheckIns > 0) {
    engagementPenalty = Math.min(missedCheckIns * 5, 15);
  }

  // User explicitly asked for human contact
  let requestHelpBonus = 0;
  if (requestHelp) {
    requestHelpBonus = 10;
  }

  let totalScore = Math.round(baseRawScore + textDistressBump + engagementPenalty + requestHelpBonus);
  totalScore = Math.max(5, Math.min(98, totalScore));

  // Determine risk category
  let riskLevel: RiskLevel = 'stable';
  let riskLabel = 'Stable';
  if (totalScore >= 75) {
    riskLevel = 'high';
    riskLabel = 'High concern';
  } else if (totalScore >= 50) {
    riskLevel = 'elevated';
    riskLabel = 'Elevated concern';
  } else if (totalScore >= 25) {
    riskLevel = 'mild';
    riskLabel = 'Mild concern';
  }

  // Build contributing signals list
  const contributingSignals: string[] = [];

  const delta = totalScore - previousScore;
  if (delta >= 15) {
    contributingSignals.push(`Distress indicator surged (+${delta} points) compared to prior check-in`);
  } else if (delta <= -10) {
    contributingSignals.push(`Distress indicator decreased (${delta} points), demonstrating positive adaptation`);
  }

  if (safetyScore <= 2) {
    contributingSignals.push('Perceived personal safety score dropped significantly (urgent environmental review recommended)');
  }
  if (sleepScore <= 2) {
    contributingSignals.push('Severe sleep disruption / insomnia indicators recorded');
  }
  if (fearScore >= 4) {
    contributingSignals.push('High fear and anxiety markers actively expressed regarding legal/trial stage');
  }
  if (avoidanceScore >= 4) {
    contributingSignals.push('Marked withdrawal and social avoidance indicators detected');
  }
  if (missedCheckIns >= 2) {
    contributingSignals.push(`Engagement gap: ${missedCheckIns} consecutive scheduled check-ins were missed`);
  }
  if (requestHelp) {
    contributingSignals.push('Complainant explicitly initiated a direct request to speak with a welfare counsellor');
  }
  if (linguisticMarkers.length > 0) {
    contributingSignals.push(...linguisticMarkers);
  }
  if (contributingSignals.length === 0) {
    contributingSignals.push('Responses align with regular baseline; no sudden environmental or emotional spikes detected');
  }

  // Recommended next step
  let recommendedNextStep = 'Routine periodic check-in recommended';
  if (riskLevel === 'high') {
    recommendedNextStep = 'Immediate human counsellor assessment and local protection desk notification recommended within 24 hours';
  } else if (riskLevel === 'elevated') {
    recommendedNextStep = 'Prioritized tele-counselling follow-up and psycho-legal orientation recommended within 48 hours';
  } else if (riskLevel === 'mild') {
    recommendedNextStep = 'Standard scheduled follow-up and verification of rehabilitation linkages';
  }

  // Suggested interventions for human review
  const suggestedInterventions: AnalysisResult['suggestedInterventions'] = [];

  if (safetyScore <= 2 || fearScore >= 4) {
    suggestedInterventions.push({
      category: 'protection',
      title: 'Protective Security Audit & Safe Transport Escort',
      rationale: 'Elevated fear markers indicate potential external intimidation or heightened vulnerability during travel.',
    });
  }
  if (sleepScore <= 2 || totalScore >= 50) {
    suggestedInterventions.push({
      category: 'counselling',
      title: 'Trauma-Informed Tele-Counselling / Grounding Intervention',
      rationale: 'Address acute anxiety symptoms, sleep hygiene, and emotional stabilization.',
    });
  }
  if (requestHelp) {
    suggestedInterventions.push({
      category: 'counselling',
      title: 'Direct Complainant Support Call',
      rationale: 'Individual explicitly requested to speak with their assigned caseworker.',
    });
  }
  if (totalScore >= 75) {
    suggestedInterventions.push({
      category: 'medical',
      title: 'Referral for Qualified Medical Assessment',
      rationale: 'High distress score warrants evaluation by authorized public health / psychiatric medical officer.',
    });
  }

  // Default fallback intervention
  if (suggestedInterventions.length === 0) {
    suggestedInterventions.push({
      category: 'rehabilitation',
      title: 'Periodic Welfare & Livelihood Review',
      rationale: 'Maintain routine supportive contact and verify access to welfare benefits.',
    });
  }

  const sentimentRating =
    totalScore >= 75
      ? 'Highly Distressed'
      : totalScore >= 50
      ? 'Distressed'
      : totalScore >= 25
      ? 'Neutral'
      : 'Positive';

  return {
    computedScore: totalScore,
    riskLevel,
    riskLabel,
    contributingSignals,
    recommendedNextStep,
    suggestedInterventions,
    explanationSummary:
      riskLevel === 'high' || riskLevel === 'elevated'
        ? `Elevated distress indicators detected based on ${contributingSignals.length} contributing signals. Early-warning system recommends prioritized human assessment.`
        : `Well-being indicators remain in the ${riskLabel.toLowerCase()} zone. Standard periodic monitoring active.`,
    sentimentRating,
    linguisticMarkers,
    disclaimer:
      'AI-assisted screening indicator - not a clinical diagnosis. All interventions require authorized human review.',
  };
}
