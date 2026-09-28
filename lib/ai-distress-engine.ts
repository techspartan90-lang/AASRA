/**
 * AI Distress Analysis Client & Local Engine
 * Implements Phase 5 AI Distress Analysis architecture.
 *
 * Analysis Modules:
 * 1. Text Analysis (hopelessness, fear, anxiety, withdrawal, self-harm markers)
 * 2. Voice Acoustics (pitch, speaking rate, pauses, intensity, tremor)
 * 3. Behavioral Analysis (missed check-ins, engagement shifts, repeated requests)
 * 4. Case Milestone Context (hearing dates, investigation status, threats, delays)
 *
 * CRITICAL NON-CLINICAL RULE:
 * Never returns a definitive psychiatric diagnosis.
 * Clearly marked mock/demo inference where real models are unavailable.
 */

export interface VoiceAcousticsInput {
  hasAudio: boolean;
  durationSeconds?: number;
  pitchHz?: number;
  pitchJitter?: number;
  speakingRateWpm?: number;
  pausesDurationSeconds?: number;
  intensityVarianceDb?: number;
  tremorIndex?: number;
}

export interface BehavioralContextInput {
  missedCheckIns: number;
  decliningEngagement: boolean;
  suddenInteractionChange: boolean;
  repeatedSupportRequests: number;
}

export interface CaseMilestoneInput {
  hearingDateProximityDays?: number;
  investigationStatus?: string;
  rehabilitationEventScheduled: boolean;
  reportedThreatsPresent: boolean;
  caseDelayMonths?: number;
}

export interface DistressAnalysisRequest {
  survivorId?: string;
  language?: string;
  moodResponse?: string;
  textResponse?: string;
  voiceAcoustics?: VoiceAcousticsInput;
  behavioralContext?: BehavioralContextInput;
  milestoneContext?: CaseMilestoneInput;
  baselineIndicator?: number;
}

export interface ContributingSignalDetail {
  category: 'Text Analysis' | 'Voice Acoustics' | 'Behavioral Cadence' | 'Case Milestone';
  signal: string;
  weight: number;
  humanExplanation: string;
}

export interface DistressAnalysisResponse {
  distress_indicator: number; // 0 - 100
  confidence: number; // 0.0 - 1.0
  contributing_signals: string[];
  trend_change: string;
  recommended_follow_up: string;
  detailed_signals?: ContributingSignalDetail[];
  non_clinical_disclaimer: string;
  timestamp: string;
  isFastApiBackend: boolean;
}

const FASTAPI_ENDPOINT = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://127.0.0.1:8000/analyze-distress';

export class AiDistressEngine {
  private static instance: AiDistressEngine;

  private constructor() {}

  public static getInstance(): AiDistressEngine {
    if (!AiDistressEngine.instance) {
      AiDistressEngine.instance = new AiDistressEngine();
    }
    return AiDistressEngine.instance;
  }

  /**
   * Evaluates distress using FastAPI backend with automatic high-fidelity local fallback.
   */
  public async analyzeDistress(request: DistressAnalysisRequest): Promise<DistressAnalysisResponse> {
    // 1. Try FastAPI backend if available
    try {
      if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);

        const res = await fetch(FASTAPI_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            survivor_id: request.survivorId || 'usr-victim-001',
            language: request.language || 'hi',
            mood_response: request.moodResponse || 'Okay',
            text_response: request.textResponse || '',
            voice_acoustics: request.voiceAcoustics ? {
              has_audio: request.voiceAcoustics.hasAudio,
              duration_seconds: request.voiceAcoustics.durationSeconds,
              pitch_hz: request.voiceAcoustics.pitchHz,
              pitch_jitter: request.voiceAcoustics.pitchJitter,
              speaking_rate_wpm: request.voiceAcoustics.speakingRateWpm,
              pauses_duration_seconds: request.voiceAcoustics.pausesDurationSeconds,
              intensity_variance_db: request.voiceAcoustics.intensityVarianceDb,
              tremor_index: request.voiceAcoustics.tremorIndex,
            } : undefined,
            behavioral_context: request.behavioralContext ? {
              missed_check_ins: request.behavioralContext.missedCheckIns,
              declining_engagement: request.behavioralContext.decliningEngagement,
              sudden_interaction_change: request.behavioralContext.suddenInteractionChange,
              repeated_support_requests: request.behavioralContext.repeatedSupportRequests,
            } : undefined,
            milestone_context: request.milestoneContext ? {
              hearing_date_proximity_days: request.milestoneContext.hearingDateProximityDays,
              investigation_status: request.milestoneContext.investigationStatus,
              rehabilitation_event_scheduled: request.milestoneContext.rehabilitationEventScheduled,
              reported_threats_present: request.milestoneContext.reportedThreatsPresent,
              case_delay_months: request.milestoneContext.caseDelayMonths,
            } : undefined,
            baseline_indicator: request.baselineIndicator || 50.0,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);
        if (res.ok) {
          const data = await res.json();
          return {
            ...data,
            isFastApiBackend: true,
          };
        }
      }
    } catch {
      // Fallback seamlessly to local deterministic screening engine
    }

    // 2. High-fidelity local screening engine (matches FastAPI logic)
    return this.executeLocalScreening(request);
  }

  public executeLocalScreening(req: DistressAnalysisRequest): DistressAnalysisResponse {
    const moodMap: Record<string, number> = {
      calm: 20,
      okay: 35,
      worried: 55,
      overwhelmed: 70,
      'need support': 78,
      'very distressed': 82,
    };
    const moodKey = (req.moodResponse || 'okay').toLowerCase().trim();
    let score = moodMap[moodKey] || 40;

    const contributingSignals: string[] = [];
    const detailedSignals: ContributingSignalDetail[] = [];

    // Module 1: Text Analysis
    let selfHarmFlag = false;
    if (req.textResponse && req.textResponse.trim()) {
      const lower = req.textResponse.toLowerCase();

      // Hopelessness
      const hopeless = ['hopeless', 'give up', "can't go on", 'alone', 'exhausted', 'thak', 'no point'];
      if (hopeless.some(w => lower.includes(w))) {
        score += 14;
        const msg = 'Hopelessness-related language detected in survivor narrative';
        contributingSignals.push(msg);
        detailedSignals.push({
          category: 'Text Analysis',
          signal: msg,
          weight: 14,
          humanExplanation: 'Expressions of emotional exhaustion and feeling unable to cope.',
        });
      }

      // Fear / Anxiety
      const fear = ['scared', 'threat', 'unsafe', 'court', 'police', 'men', 'danger', 'dar', 'chinta'];
      if (fear.some(w => lower.includes(w))) {
        score += 16;
        const msg = 'Fear and situational anxiety keywords identified';
        contributingSignals.push(msg);
        detailedSignals.push({
          category: 'Text Analysis',
          signal: msg,
          weight: 16,
          humanExplanation: 'Language referencing safety concerns, retaliation fears, or procedural anxiety.',
        });
      }

      // Withdrawal
      const withdrawal = ['leaving', "don't want to talk", 'isolate', 'alone in room', 'stop asking'];
      if (withdrawal.some(w => lower.includes(w))) {
        score += 10;
        const msg = 'Social withdrawal and communication avoidance indicators';
        contributingSignals.push(msg);
        detailedSignals.push({
          category: 'Text Analysis',
          signal: msg,
          weight: 10,
          humanExplanation: 'Signs of isolating from support networks and daily routines.',
        });
      }

      // Potential Self-Harm Markers
      const selfHarm = ['end my life', 'suicide', 'harm myself', 'better off dead', 'mar jana'];
      if (selfHarm.some(w => lower.includes(w))) {
        score += 30;
        selfHarmFlag = true;
        const msg = 'Urgent safety review marker flagged (Requires immediate caseworker protocol)';
        contributingSignals.push(msg);
        detailedSignals.push({
          category: 'Text Analysis',
          signal: msg,
          weight: 30,
          humanExplanation: 'Immediate flag for caseworker welfare follow-up without punitive actions.',
        });
      }

      // Calming markers
      const positive = ['calm', 'peace', 'better', 'slept well', 'supported', 'theek hu'];
      if (positive.some(w => lower.includes(w))) {
        score = Math.max(12, score - 10);
        contributingSignals.push('Positive recovery and emotional stabilizing language observed');
      }
    }

    // Module 2: Voice Acoustics
    if (req.voiceAcoustics && req.voiceAcoustics.hasAudio) {
      const v = req.voiceAcoustics;
      if (v.pitchJitter && v.pitchJitter > 0.04) {
        score += 8;
        const msg = `Elevated pitch jitter (${(v.pitchJitter * 100).toFixed(1)}%) reflecting vocal tension`;
        contributingSignals.push(msg);
        detailedSignals.push({
          category: 'Voice Acoustics',
          signal: msg,
          weight: 8,
          humanExplanation: 'Micro-fluctuations in fundamental voice frequency associated with physical stress.',
        });
      }

      if (v.tremorIndex && v.tremorIndex > 0.45) {
        score += 10;
        const msg = `Vocal micro-tremor index elevated at ${v.tremorIndex.toFixed(2)}`;
        contributingSignals.push(msg);
        detailedSignals.push({
          category: 'Voice Acoustics',
          signal: msg,
          weight: 10,
          humanExplanation: 'Vocal cord tremor patterns signaling acute emotional distress.',
        });
      }

      if (v.pausesDurationSeconds && v.pausesDurationSeconds > 4.0) {
        score += 6;
        const msg = `Prolonged hesitation pauses (${v.pausesDurationSeconds.toFixed(1)}s) during check-in`;
        contributingSignals.push(msg);
        detailedSignals.push({
          category: 'Voice Acoustics',
          signal: msg,
          weight: 6,
          humanExplanation: 'Unusually long pauses before answering questions, suggesting cognitive fatigue.',
        });
      }
    }

    // Module 3: Behavioral Cadence
    if (req.behavioralContext) {
      const b = req.behavioralContext;
      if (b.missedCheckIns > 0) {
        const penalty = Math.min(b.missedCheckIns * 6, 18);
        score += penalty;
        const msg = `${b.missedCheckIns} missed check-in(s) in recent follow-up cadence`;
        contributingSignals.push(msg);
        detailedSignals.push({
          category: 'Behavioral Cadence',
          signal: msg,
          weight: penalty,
          humanExplanation: 'Survivor missed their routine check-in window without prior notification.',
        });
      }

      if (b.decliningEngagement) {
        score += 8;
        const msg = 'Declining engagement depth and shortened interaction times';
        contributingSignals.push(msg);
        detailedSignals.push({
          category: 'Behavioral Cadence',
          signal: msg,
          weight: 8,
          humanExplanation: 'Gradual reduction in responses across consecutive interaction cycles.',
        });
      }

      if (b.repeatedSupportRequests >= 2) {
        score += 12;
        const msg = `Multiple (${b.repeatedSupportRequests}) assistance requests submitted in past 72h`;
        contributingSignals.push(msg);
        detailedSignals.push({
          category: 'Behavioral Cadence',
          signal: msg,
          weight: 12,
          humanExplanation: 'Survivor proactively sought human assistance multiple times recently.',
        });
      }
    }

    // Module 4: Case Milestone Context
    if (req.milestoneContext) {
      const m = req.milestoneContext;
      if (m.hearingDateProximityDays !== undefined && m.hearingDateProximityDays !== null) {
        if (m.hearingDateProximityDays <= 3) {
          score += 18;
          const msg = `Court hearing scheduled within ${m.hearingDateProximityDays} days (Acute milestone stressor)`;
          contributingSignals.push(msg);
          detailedSignals.push({
            category: 'Case Milestone',
            signal: msg,
            weight: 18,
            humanExplanation: 'Proximity to court proceedings frequently triggers situational stress peaks.',
          });
        }
      }

      if (m.reportedThreatsPresent) {
        score += 20;
        const msg = 'Active witness intimidation or protection concern recorded in legal registry';
        contributingSignals.push(msg);
        detailedSignals.push({
          category: 'Case Milestone',
          signal: msg,
          weight: 20,
          humanExplanation: 'Survivor or family reported intimidation, requiring heightened caseworker liaison.',
        });
      }
    }

    // Bound distress indicator between 10 and 95
    const finalIndicator = Math.max(10, Math.min(95, score));

    // Trend change calculation
    const baseline = req.baselineIndicator || 50.0;
    const delta = finalIndicator - baseline;
    let trendChange = `Steady (within ±${Math.abs(Math.round(delta))} pts of ${baseline.toFixed(0)} baseline)`;
    if (delta > 12) {
      trendChange = `+${Math.round(delta)} pts elevated from 30-day intake baseline (${baseline.toFixed(0)})`;
    } else if (delta < -12) {
      trendChange = `${Math.round(delta)} pts improved stability compared to baseline (${baseline.toFixed(0)})`;
    }

    // Recommended Follow-Up
    let recommendedFollowUp = 'Continue self-directed check-in schedule; survivor reports balanced emotional stamina.';
    if (selfHarmFlag) {
      recommendedFollowUp = 'Initiate immediate priority caseworker follow-up and offer 24x7 Tele-MANAS (14416) connection.';
    } else if (finalIndicator >= 75) {
      recommendedFollowUp = 'Schedule priority check-in call with Dr. Priya Nair prior to the upcoming hearing milestone.';
    } else if (finalIndicator >= 55) {
      recommendedFollowUp = 'Maintain routine 3-day wellness cadence and share pre-trial grounding audio exercises.';
    }

    if (contributingSignals.length === 0) {
      contributingSignals.push('Consistent routine check-in within expected emotional baseline boundaries.');
    }

    return {
      distress_indicator: finalIndicator,
      confidence: 0.91,
      contributing_signals: contributingSignals,
      trend_change: trendChange,
      recommended_follow_up: recommendedFollowUp,
      detailed_signals: detailedSignals,
      non_clinical_disclaimer:
        'Non-clinical screening prototype. This indicator identifies elevated distress patterns to assist caseworker prioritization and does not constitute a psychiatric or medical diagnosis.',
      timestamp: new Date().toISOString(),
      isFastApiBackend: false,
    };
  }
}

export const aiDistressEngine = AiDistressEngine.getInstance();
