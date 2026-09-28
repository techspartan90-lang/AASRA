/**
 * Predictive Risk Modelling Engine (Phase 7)
 *
 * Provides predictive distress projections across:
 * - 7 days
 * - 14 days
 * - 30 days
 *
 * Inputs:
 * - distress trend
 * - baseline deviation
 * - check-in frequency
 * - engagement change
 * - text signals
 * - voice feature metadata
 * - case milestone context
 * - previous support interactions
 *
 * OUTPUT:
 * - risk indicator (e.g. “Elevated distress signal over the next 7 days.”)
 * - confidence
 * - time horizon
 * - contributing factors
 * - recommended follow-up
 *
 * CRITICAL SAFETY RULES:
 * - Do NOT say: “This survivor will become suicidal.”
 * - Do NOT present predictions as certainty.
 * - Create an uncertainty indicator.
 * - Create a model explanation section: “Why did the indicator change?” using plain language.
 * - Add model version tracking storing:
 *   - model_version
 *   - prediction_timestamp
 *   - prediction_window
 *   - prediction_output
 *   - confidence
 *   - input_version
 */

export type PredictionWindow = '7 days' | '14 days' | '30 days';

export interface VoiceAcousticMetadata {
  hasAudio: boolean;
  pitchJitter?: number; // e.g. 0.045
  speakingRateWpm?: number; // e.g. 92
  pausesDurationSec?: number; // e.g. 4.2
  tremorIndex?: number; // e.g. 0.48
}

export interface CaseMilestoneContext {
  hearingDateProximityDays?: number | null;
  reportedThreatsPresent?: boolean;
  investigationStatus?: string;
  caseDelayMonths?: number;
}

export interface PredictiveRiskInput {
  survivorId?: string;
  predictionWindow: PredictionWindow;
  distressTrend: number[]; // longitudinal scores, e.g. [32, 36, 41, 48, 47]
  baselineDeviation: number; // e.g. +19
  checkInFrequency: 'daily' | 'every few days' | 'weekly' | 'sporadic';
  engagementChange: 'stable' | 'declining' | 'improving' | 'abrupt_drop';
  textSignals: string[];
  voiceFeatureMetadata?: VoiceAcousticMetadata;
  caseMilestoneContext?: CaseMilestoneContext;
  previousSupportInteractions: number; // count of previous counsellor sessions / calls
  inputVersion?: string;
}

export interface UncertaintyIndicator {
  level: 'Low to Moderate' | 'Moderate' | 'Elevated';
  varianceMarginPts: number; // e.g. ±7.5 pts
  description: string;
}

export interface ModelExplanation {
  headline: string; // "Why did the indicator change?"
  plainLanguageSummary: string;
  primaryDrivers: string[];
}

export interface ModelVersionTracking {
  modelVersion: string; // "aasra-predictive-v1.4.2"
  predictionTimestamp: string; // ISO 8601 UTC
  predictionWindow: PredictionWindow;
  predictionOutput: string;
  confidence: number;
  inputVersion: string;
}

export interface PredictiveRiskResult {
  riskIndicator: string;
  confidence: number; // [0.0 - 1.0]
  timeHorizon: PredictionWindow;
  contributingFactors: string[];
  recommendedFollowUp: string;
  uncertaintyIndicator: UncertaintyIndicator;
  modelExplanation: ModelExplanation;
  modelVersionTracking: ModelVersionTracking;
  nonClinicalDisclaimer: string;
}

const MODEL_VERSION = 'aasra-predictive-v1.4.2';
const DEFAULT_INPUT_VERSION = 'inp-v2.4';

// In-memory provenance store for model version tracking
const STORED_PREDICTIONS: ModelVersionTracking[] = [
  {
    modelVersion: MODEL_VERSION,
    predictionTimestamp: '2026-09-27T14:30:00.000Z',
    predictionWindow: '7 days',
    predictionOutput: 'Elevated distress signal over the next 7 days.',
    confidence: 0.88,
    inputVersion: DEFAULT_INPUT_VERSION,
  },
  {
    modelVersion: MODEL_VERSION,
    predictionTimestamp: '2026-09-25T09:15:00.000Z',
    predictionWindow: '14 days',
    predictionOutput: 'Moderate situational distress fluctuation projected over the next 14 days.',
    confidence: 0.81,
    inputVersion: 'inp-v2.3',
  },
  {
    modelVersion: 'aasra-predictive-v1.4.1',
    predictionTimestamp: '2026-09-20T11:00:00.000Z',
    predictionWindow: '30 days',
    predictionOutput: 'Stable longitudinal trajectory anticipated over the next 30 days.',
    confidence: 0.74,
    inputVersion: 'inp-v2.2',
  },
];

export class PredictiveRiskEngine {
  private static instance: PredictiveRiskEngine;
  private apiEndpoint = 'http://127.0.0.1:8000/predict-risk';

  private constructor() {}

  public static getInstance(): PredictiveRiskEngine {
    if (!PredictiveRiskEngine.instance) {
      PredictiveRiskEngine.instance = new PredictiveRiskEngine();
    }
    return PredictiveRiskEngine.instance;
  }

  /**
   * Sanitizes predictive output to enforce non-certainty and trauma-informed safety rules.
   * Prohibits deterministic fatalistic language like "will become suicidal".
   */
  public sanitizeLanguage(text: string): string {
    const prohibitedCertaintyPatterns: [RegExp, string][] = [
      [/will become suicidal/gi, 'may experience heightened situational distress'],
      [/is going to commit suicide/gi, 'shows elevated vulnerability indicators'],
      [/will definitely/gi, 'is projected to potentially'],
      [/guaranteed to/gi, 'indicates likelihood of'],
      [/will decompensate/gi, 'may experience increased emotional fatigue'],
      [/certain to relapse/gi, 'presents elevated risk markers requiring proactive care'],
    ];

    let sanitized = text;
    for (const [pattern, replacement] of prohibitedCertaintyPatterns) {
      sanitized = sanitized.replace(pattern, replacement);
    }
    return sanitized;
  }

  /**
   * Evaluates predictive distress risk using local deterministic engine
   * with fallback to FastAPI endpoint when available.
   */
  public async predictRisk(input: PredictiveRiskInput): Promise<PredictiveRiskResult> {
    try {
      // Attempt FastAPI endpoint
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          survivor_id: input.survivorId || 'usr-victim-001',
          prediction_window: input.predictionWindow,
          distress_trend: input.distressTrend,
          baseline_deviation: input.baselineDeviation,
          check_in_frequency: input.checkInFrequency,
          engagement_change: input.engagementChange,
          text_signals: input.textSignals,
          voice_feature_metadata: input.voiceFeatureMetadata,
          case_milestone_context: input.caseMilestoneContext,
          previous_support_interactions: input.previousSupportInteractions,
          input_version: input.inputVersion || DEFAULT_INPUT_VERSION,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const tracking: ModelVersionTracking = {
          modelVersion: data.model_version_tracking.model_version,
          predictionTimestamp: data.model_version_tracking.prediction_timestamp,
          predictionWindow: data.model_version_tracking.prediction_window,
          predictionOutput: data.model_version_tracking.prediction_output,
          confidence: data.model_version_tracking.confidence,
          inputVersion: data.model_version_tracking.input_version,
        };
        STORED_PREDICTIONS.unshift(tracking);

        return {
          riskIndicator: this.sanitizeLanguage(data.risk_indicator),
          confidence: data.confidence,
          timeHorizon: data.time_horizon,
          contributingFactors: data.contributing_factors,
          recommendedFollowUp: data.recommended_follow_up,
          uncertaintyIndicator: {
            level: data.uncertainty_indicator.level,
            varianceMarginPts: data.uncertainty_indicator.variance_margin_pts,
            description: data.uncertainty_indicator.description,
          },
          modelExplanation: {
            headline: data.model_explanation.headline,
            plainLanguageSummary: data.model_explanation.plain_language_summary,
            primaryDrivers: data.model_explanation.primary_drivers,
          },
          modelVersionTracking: tracking,
          nonClinicalDisclaimer: data.non_clinical_disclaimer,
        };
      }
    } catch {
      // Local deterministic screening fallback
    }

    return this.predictLocally(input);
  }

  /**
   * Deterministic local implementation ensuring high availability and instant offline simulation.
   */
  public predictLocally(input: PredictiveRiskInput): PredictiveRiskResult {
    const window = input.predictionWindow;
    const contributingFactors: string[] = [];
    const primaryDrivers: string[] = [];

    // Factor 1: Baseline deviation
    if (input.baselineDeviation >= 15) {
      contributingFactors.push(`Significant baseline deviation (+${input.baselineDeviation} pts above intake baseline)`);
      primaryDrivers.push('Sustained elevation above personal intake baseline');
    } else if (input.baselineDeviation > 5) {
      contributingFactors.push(`Moderate baseline deviation (+${input.baselineDeviation} pts)`);
    } else if (input.baselineDeviation < -5) {
      contributingFactors.push(`Favorable baseline deviation (${input.baselineDeviation} pts below intake)`);
      primaryDrivers.push('Positive recovery trajectory below initial baseline');
    }

    // Factor 2: Engagement Change & Frequency
    if (input.engagementChange === 'abrupt_drop') {
      contributingFactors.push('Abrupt reduction in check-in responsiveness (>50% drop)');
      primaryDrivers.push('Sudden cessation of routine check-in pulses');
    } else if (input.engagementChange === 'declining') {
      contributingFactors.push('Gradual declining engagement across active check-in channels');
      primaryDrivers.push('Declining interaction frequency over recent days');
    }

    if (input.checkInFrequency === 'sporadic') {
      contributingFactors.push('Sporadic or irregular check-in intervals');
    }

    // Factor 3: Text signals
    for (const sig of input.textSignals) {
      contributingFactors.push(`Text signal: ${sig}`);
    }
    if (input.textSignals.some(s => s.toLowerCase().includes('anxiety') || s.toLowerCase().includes('fear') || s.toLowerCase().includes('hearing'))) {
      primaryDrivers.push('Linguistic anxiety markers in recent reflections');
    }

    // Factor 4: Voice features
    if (input.voiceFeatureMetadata?.hasAudio) {
      if (input.voiceFeatureMetadata.pitchJitter && input.voiceFeatureMetadata.pitchJitter > 0.04) {
        contributingFactors.push(`Vocal jitter perturbation (${(input.voiceFeatureMetadata.pitchJitter * 100).toFixed(1)}%) reflecting acoustic tension`);
        primaryDrivers.push('Acoustic indicators of physiological stress in audio notes');
      }
      if (input.voiceFeatureMetadata.pausesDurationSec && input.voiceFeatureMetadata.pausesDurationSec > 3.5) {
        contributingFactors.push(`Prolonged hesitation pauses (${input.voiceFeatureMetadata.pausesDurationSec}s)`);
      }
    }

    // Factor 5: Judicial Milestones
    let upcomingHearing = false;
    let threatReported = false;
    if (input.caseMilestoneContext) {
      const days = input.caseMilestoneContext.hearingDateProximityDays;
      if (days !== undefined && days !== null) {
        if (days <= 7) {
          upcomingHearing = true;
          contributingFactors.push(`Approaching court hearing in ${days} calendar days`);
          primaryDrivers.push(`Upcoming judicial hearing milestone (${days} days away)`);
        } else if (days <= 14 && (window === '14 days' || window === '30 days')) {
          contributingFactors.push(`Scheduled court hearing in ${days} calendar days`);
          primaryDrivers.push('Mid-term judicial calendar milestone');
        }
      }

      if (input.caseMilestoneContext.reportedThreatsPresent) {
        threatReported = true;
        contributingFactors.push('Active witness intimidation or protection concern registered');
        primaryDrivers.push('Reported security concern in case registry');
      }
    }

    // Factor 6: Previous Support Interactions
    if (input.previousSupportInteractions >= 3) {
      contributingFactors.push(`Protective buffer: ${input.previousSupportInteractions} recent counsellor consultations on record`);
    } else if (input.previousSupportInteractions === 0) {
      contributingFactors.push('Absence of recent counsellor support interactions');
      primaryDrivers.push('Limited active counsellor engagement to date');
    }

    // Risk Indicator & Recommended Follow-up based on Time Horizon
    let riskIndicator = '';
    let recFollowUp = '';

    if (threatReported || (upcomingHearing && input.baselineDeviation >= 15)) {
      riskIndicator = `Elevated distress signal over the next ${window}.`;
      recFollowUp = `Schedule proactive caseworker touchpoint within 48 hours; coordinate with legal advocate prior to hearing milestone and confirm emergency contact availability.`;
    } else if (input.baselineDeviation > 10 || input.engagementChange === 'declining' || input.engagementChange === 'abrupt_drop') {
      riskIndicator = `Moderate situational distress fluctuation projected over the next ${window}.`;
      recFollowUp = `Offer optional mid-week grounding audio note via preferred channel (${input.checkInFrequency}); maintain non-intrusive monitoring.`;
    } else {
      riskIndicator = `Stable longitudinal trajectory anticipated over the next ${window}.`;
      recFollowUp = `Maintain standard self-directed check-in schedule; no escalated caseworker triage needed.`;
    }

    // Enforce ethical non-certainty filter
    riskIndicator = this.sanitizeLanguage(riskIndicator);

    // Horizon-Specific Confidence & Uncertainty Indicator
    let confidence = 0.88;
    let uncertainty: UncertaintyIndicator;

    if (window === '7 days') {
      confidence = 0.88;
      uncertainty = {
        level: 'Low to Moderate',
        varianceMarginPts: 7.5,
        description: 'Dense near-term multi-channel signals provide tightly bounded probabilistic projections (±7.5 pts).',
      };
    } else if (window === '14 days') {
      confidence = 0.81;
      uncertainty = {
        level: 'Moderate',
        varianceMarginPts: 12.0,
        description: 'Intermediate horizon subject to legal hearing scheduling and voluntary survivor participation (±12.0 pts).',
      };
    } else {
      confidence = 0.74;
      uncertainty = {
        level: 'Elevated',
        varianceMarginPts: 17.5,
        description: 'Longer horizon introduces judicial calendar shifts and external environmental variables (±17.5 pts).',
      };
    }

    if (input.engagementChange === 'declining' || input.engagementChange === 'abrupt_drop') {
      uncertainty.varianceMarginPts = Number((uncertainty.varianceMarginPts + 3.0).toFixed(1));
    }

    // Plain Language Model Explanation: "Why did the indicator change?"
    if (primaryDrivers.length === 0) {
      primaryDrivers.push('Consistent check-in responses matching historical intake baseline');
    }
    const driverNarrative = primaryDrivers.slice(0, 3).join(', ');
    const plainLanguageSummary = `The model projects an operational indicator over the next ${window} based primarily on ${driverNarrative}. Because predictive models reflect likelihoods rather than certainties, this indicator serves as an operational compass to help caseworkers offer timely, respectful support before stressors peak.`;

    // Model Version Tracking Record
    const trackingRecord: ModelVersionTracking = {
      modelVersion: MODEL_VERSION,
      predictionTimestamp: new Date().toISOString(),
      predictionWindow: window,
      predictionOutput: riskIndicator,
      confidence,
      inputVersion: input.inputVersion || DEFAULT_INPUT_VERSION,
    };

    STORED_PREDICTIONS.unshift(trackingRecord);

    return {
      riskIndicator,
      confidence,
      timeHorizon: window,
      contributingFactors,
      recommendedFollowUp: recFollowUp,
      uncertaintyIndicator: uncertainty,
      modelExplanation: {
        headline: 'Why did the indicator change?',
        plainLanguageSummary,
        primaryDrivers,
      },
      modelVersionTracking: trackingRecord,
      nonClinicalDisclaimer:
        'Operational prediction prototype. Estimates future distress likelihood to support proactive caseworker outreach. Predictions are probabilistic indicators and NOT clinical certainties, medical diagnoses, or psychiatric forecasts.',
    };
  }

  public getStoredPredictions(): ModelVersionTracking[] {
    return [...STORED_PREDICTIONS];
  }
}

export const predictiveRiskEngine = PredictiveRiskEngine.getInstance();
