import { RiskLevel, InterventionCategory } from '@/types';
import {
  calculatePersonalBaseline,
  detectTrend,
  analyzeTextFeatures,
  analyzeVoiceFeatures,
  TrendAnalysisResult,
} from './longitudinal-engine';

export interface CheckInFeatures {
  feelingScore?: number; // 1 (Very distressed) - 5 (Doing well)
  safetyScore?: number; // 1 (Very unsafe) - 5 (Very safe)
  sleepScore?: number; // 1 (Severe insomnia) - 5 (Good sleep)
  fearScore?: number; // 1 (Not fearful) - 5 (Extremely terrified)
  avoidanceScore?: number; // 1 (No avoidance) - 5 (Total avoidance)
  requestHelp?: boolean;
  notes?: string;
  hasVoiceSample?: boolean;
  voiceDurationSeconds?: number;
  missedCheckIns?: number;
  historicalScores?: number[];
  previousScore?: number;
}

export interface PipelineResult {
  indicator: number; // 0 - 100
  level: RiskLevel;
  riskLabel: string;
  baseline: number;
  baselineDeviation: number;
  trend: string;
  trendDetails: TrendAnalysisResult;
  confidence: number;
  contributingFactors: string[];
  recommendedHumanAction: string;
  explanation: string;
  suggestedInterventions: {
    category: InterventionCategory;
    title: string;
    rationale: string;
  }[];
  generatedAt: string;
  isAiFallback: boolean;
}

export class DistressRiskEngine {
  /**
   * Complete 12-step check-in analysis pipeline.
   * Central Loop:
   * CHECK-IN -> FEATURE EXTRACTION -> PERSONAL BASELINE -> CHANGE DETECTION ->
   * DYNAMIC DISTRESS INDICATOR -> TREND ANALYSIS -> EXPLANATION -> HUMAN REVIEW
   */
  public static analyzeCheckIn(input: CheckInFeatures, isFallback = false): PipelineResult {
    const {
      feelingScore = 3,
      safetyScore = 3,
      sleepScore = 3,
      fearScore = 1,
      avoidanceScore = 1,
      requestHelp = false,
      notes = '',
      hasVoiceSample = false,
      voiceDurationSeconds = 0,
      missedCheckIns = 0,
      historicalScores = [38],
      previousScore = 38,
    } = input;

    // 1. Calculate Personal Baseline using history (Section 8)
    const baseline = calculatePersonalBaseline(historicalScores, 38);

    // 2. Structured component distress scores (normalized)
    const feelingDistress = (5 - feelingScore) * 6; // 0 - 24
    const safetyDistress = (5 - safetyScore) * 6; // 0 - 24
    const sleepDistress = (5 - sleepScore) * 4; // 0 - 16
    const fearDistress = (fearScore - 1) * 5; // 0 - 20
    const avoidanceDistress = (avoidanceScore - 1) * 3; // 0 - 12

    let rawScore = feelingDistress + safetyDistress + sleepDistress + fearDistress + avoidanceDistress;

    // 3. Text analysis features
    const textFeatures = analyzeTextFeatures(notes);
    if (textFeatures.sentiment === 'highly_distressed') {
      rawScore += 12;
    } else if (textFeatures.sentiment === 'distressed') {
      rawScore += 6;
    }

    // 4. Voice supplementary indicators
    const voiceFeatures = analyzeVoiceFeatures(voiceDurationSeconds, true);
    if (hasVoiceSample && voiceDurationSeconds > 10) {
      rawScore += 3; // Slight supplementary weighting only
    }

    // 5. Engagement & Missed Check-Ins
    if (missedCheckIns > 0) {
      rawScore += Math.min(missedCheckIns * 5, 15);
    }

    // 6. Help-seeking bonus
    if (requestHelp || textFeatures.helpSeeking) {
      rawScore += 8;
    }

    // Clamp indicator to 0-100
    const indicator = Math.max(5, Math.min(98, Math.round(rawScore)));

    // 7. Calculate Baseline Deviation (Section 8)
    const baselineDeviation = indicator - baseline;

    // 8. Determine Risk Level (Section 7 Screening thresholds)
    let level: RiskLevel = 'stable';
    let riskLabel = 'Stable';
    if (indicator >= 75) {
      level = 'high';
      riskLabel = 'High concern';
    } else if (indicator >= 50) {
      level = 'elevated';
      riskLabel = 'Elevated concern';
    } else if (indicator >= 25) {
      level = 'mild';
      riskLabel = 'Mild concern';
    }

    // 9. Trend analysis over full history + current
    const fullHistory = [...historicalScores.map(s => ({ score: s })), { score: indicator }];
    const trendDetails = detectTrend(fullHistory);

    // 10. Extract contributing factors with change detection
    const contributingFactors: string[] = [];

    if (fearScore >= 4) {
      contributingFactors.push('Fear indicator elevated (4–5/5)');
    }
    if (sleepScore <= 2) {
      contributingFactors.push('Sleep disturbances / insomnia reported (1–2/5)');
    }
    if (safetyScore <= 2) {
      contributingFactors.push('Perceived personal safety score dropped (1–2/5)');
    }
    if (avoidanceScore >= 4) {
      contributingFactors.push('Social avoidance and withdrawal behavior increased');
    }
    if (baselineDeviation >= 20) {
      contributingFactors.push(`Current indicators are substantially higher than this individual's recent baseline (+${baselineDeviation} pts)`);
    } else if (baselineDeviation >= 10) {
      contributingFactors.push(`Indicators elevated (+${baselineDeviation} pts) compared to personalized baseline`);
    } else if (baselineDeviation <= -10) {
      contributingFactors.push(`Distress markers decreased (${baselineDeviation} pts) relative to initial intake baseline`);
    }

    if (missedCheckIns > 0) {
      contributingFactors.push(`${missedCheckIns} missed scheduled check-ins detected; engagement review recommended`);
    }

    textFeatures.contributingSignals.forEach(sig => {
      if (!contributingFactors.includes(sig)) contributingFactors.push(sig);
    });

    if (contributingFactors.length === 0) {
      contributingFactors.push('All measured markers within stable baseline thresholds');
    }

    // 11. Recommended human action (Never autonomous decision)
    let recommendedHumanAction = 'Continue routine periodic monitoring.';
    if (level === 'high') {
      recommendedHumanAction = 'Human counsellor review and prompt contact recommended within 24 hours. Assess court security or protection needs.';
    } else if (level === 'elevated') {
      recommendedHumanAction = 'Prioritized tele-counselling follow-up and psycho-legal orientation recommended within 48 hours.';
    } else if (level === 'mild') {
      recommendedHumanAction = 'Supportive check-in reminder and routine case worker review at next scheduled interval.';
    }

    // 12. Explanation generation
    let explanation = `Individual baseline is ${baseline}/100. Current screening score is ${indicator}/100 (${baselineDeviation >= 0 ? '+' : ''}${baselineDeviation} pts). `;
    explanation += `Longitudinal trend is classified as ${trendDetails.trend}. `;
    if (level === 'high' || level === 'elevated') {
      explanation += `Key signals include: ${contributingFactors.slice(0, 3).join(', ')}. Human review recommended.`;
    } else {
      explanation += `Indicators reflect consistent stability relative to case trajectory.`;
    }

    const suggestedInterventions: { category: InterventionCategory; title: string; rationale: string }[] = [];
    if (level === 'high' || level === 'elevated') {
      suggestedInterventions.push({
        category: 'counselling',
        title: 'Trauma Grounding & Pre-Trial Orientation',
        rationale: 'Addresses elevated anxiety and sleep disturbances around legal proceedings.',
      });
      if (safetyScore <= 2 || notes.toLowerCase().includes('threat') || notes.toLowerCase().includes('court')) {
        suggestedInterventions.push({
          category: 'protection',
          title: 'Court Transit & Police Escort Liaison',
          rationale: 'Mitigates fear markers and intimidation concerns during court appearances.',
        });
      }
    }

    return {
      indicator,
      level,
      riskLabel,
      baseline,
      baselineDeviation,
      trend: trendDetails.trend,
      trendDetails,
      confidence: 0.92,
      contributingFactors,
      recommendedHumanAction,
      explanation,
      suggestedInterventions,
      generatedAt: new Date().toISOString(),
      isAiFallback: isFallback,
    };
  }
}
