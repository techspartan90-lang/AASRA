import { UserConsent } from '@/types';
import { MultilingualEmotionSignal } from './multilingual-nlp';

export interface AcousticFeatures {
  durationSeconds: number;
  speechActivityRatio: number; // Ratio of voice to total audio (0.0 to 1.0)
  pauseRatePerMinute: number; // Frequent long pauses can correlate with hesitation or psychomotor deceleration
  averagePauseDurationSeconds: number;
  pitchVarianceHz: number; // Supplementary pitch variability index
  energyRms: number; // Volume / energy level
  audioSampleRate: number;
  qualityScore: number; // 0.0 to 1.0 (audio signal-to-noise check)
}

export interface VoiceAnalysisResult {
  hasVoiceSample: boolean;
  consentGranted: boolean;
  transcription?: string;
  acousticFeatures?: AcousticFeatures;
  supplementarySignal: 'none' | 'normal_range' | 'elevated_hesitation' | 'low_energy_flattened' | 'hyper_arousal';
  explanation: string;
  disclaimer: string;
  status: 'completed' | 'consent_denied' | 'microphone_denied' | 'recognition_failed' | 'bypassed';
}

export interface MultimodalFusedSignal {
  textSignal?: MultilingualEmotionSignal;
  voiceSignal?: VoiceAnalysisResult;
  combinedDistressScore: number; // 0 to 100
  fusionConfidence: number; // 0.0 to 1.0
  synthesisSummary: string;
  modalityContribution: {
    structuredWeight: number;
    textWeight: number;
    voiceWeight: number;
  };
}

/**
 * Validates user consent before any microphone access or voice feature extraction
 */
export function verifyVoiceConsent(consent: UserConsent): {
  allowed: boolean;
  message?: string;
} {
  if (!consent || !consent.voiceAnalysis) {
    return {
      allowed: false,
      message: 'Voice analysis is disabled in your privacy settings. Text-based check-in is fully supported.',
    };
  }
  return { allowed: true };
}

/**
 * Simulates and extracts supplementary acoustic metrics from an audio buffer or simulated mic session
 */
export function analyzeVoiceFeatures(
  audioDurationSeconds: number = 8.5,
  consentGranted: boolean = true
): VoiceAnalysisResult {
  if (!consentGranted) {
    return {
      hasVoiceSample: false,
      consentGranted: false,
      status: 'consent_denied',
      supplementarySignal: 'none',
      explanation: 'Voice analysis was skipped because consent has not been granted.',
      disclaimer: 'Voice-derived features are supplementary signals and are not diagnostic.',
    };
  }

  // Realistic synthetic acoustic features within physiological human speech parameters
  const speechActivityRatio = 0.68;
  const pauseRatePerMinute = 14.2;
  const averagePauseDurationSeconds = 1.35;
  const pitchVarianceHz = 28.5;
  const energyRms = 0.42;

  let supplementarySignal: VoiceAnalysisResult['supplementarySignal'] = 'normal_range';
  let explanation = 'Acoustic cadence and pause rate remain within typical conversational bounds.';

  if (averagePauseDurationSeconds > 1.8 || pauseRatePerMinute > 18) {
    supplementarySignal = 'elevated_hesitation';
    explanation = 'Supplementary speech indicators observe extended hesitation and frequent pauses during response.';
  } else if (energyRms < 0.25 && pitchVarianceHz < 20) {
    supplementarySignal = 'low_energy_flattened';
    explanation = 'Supplementary speech indicators observe subdued vocal volume and limited pitch modulation.';
  }

  return {
    hasVoiceSample: true,
    consentGranted: true,
    status: 'completed',
    acousticFeatures: {
      durationSeconds: audioDurationSeconds,
      speechActivityRatio,
      pauseRatePerMinute,
      averagePauseDurationSeconds,
      pitchVarianceHz,
      energyRms,
      audioSampleRate: 44100,
      qualityScore: 0.94,
    },
    supplementarySignal,
    explanation,
    disclaimer: 'Voice-derived features are supplementary signals and are not diagnostic.',
  };
}

/**
 * Multimodal Text + Voice Evidence Fusion Layer
 * Combines structured ratings, free-text signals, and voice characteristics conservatively.
 */
export function fuseMultimodalSignals(
  structuredScore: number,
  textSignal?: MultilingualEmotionSignal,
  voiceSignal?: VoiceAnalysisResult
): MultimodalFusedSignal {
  let score = structuredScore;
  let textWeight = 0.15;
  let voiceWeight = 0.10;
  let structuredWeight = 0.75;

  const notes: string[] = [];

  // Integrate text signals if present
  if (textSignal && textSignal.rawTextSnippet) {
    if (textSignal.sentiment === 'highly_distressed') {
      score += 8;
      notes.push('Text remarks convey heightened distress/threat markers');
    } else if (textSignal.sentiment === 'distressed') {
      score += 4;
      notes.push('Text remarks convey elevated emotional tension');
    }
  } else {
    // Rebalance weights if text missing
    structuredWeight += 0.15;
    textWeight = 0;
  }

  // Integrate voice signals if consent granted and available
  if (voiceSignal && voiceSignal.hasVoiceSample && voiceSignal.acousticFeatures) {
    if (voiceSignal.supplementarySignal === 'elevated_hesitation') {
      score += 4;
      notes.push('Supplementary acoustic signal notes conversational pauses and hesitation');
    } else if (voiceSignal.supplementarySignal === 'low_energy_flattened') {
      score += 3;
      notes.push('Supplementary acoustic signal notes flattened vocal energy');
    }
  } else {
    // Rebalance weights if voice missing
    structuredWeight += voiceWeight;
    voiceWeight = 0;
  }

  const boundedScore = Math.min(100, Math.max(0, Math.round(score)));

  let synthesisSummary = 'Check-in analysis grounded primarily in standardized self-reported indicators.';
  if (notes.length > 0) {
    synthesisSummary = `Multiple supplementary signals indicate increased distress-related indicators: ${notes.join('; ')}.`;
  }

  return {
    textSignal,
    voiceSignal,
    combinedDistressScore: boundedScore,
    fusionConfidence: textSignal?.rawTextSnippet && voiceSignal?.hasVoiceSample ? 0.88 : 0.78,
    synthesisSummary,
    modalityContribution: {
      structuredWeight,
      textWeight,
      voiceWeight,
    },
  };
}
