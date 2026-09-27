import { RiskLevel } from '@/types';

export interface TrendAnalysisResult {
  trend: 'Improving' | 'Stable' | 'Increasing' | 'Rapidly increasing' | 'Fluctuating' | 'Insufficient data';
  direction: 'up' | 'down' | 'stable';
  velocity: number; // points change per observation
  observationsCount: number;
  description: string;
}

/**
 * Calculates a personalized intake/recent baseline using historical check-in scores.
 * Uses individual's own history as the primary comparison rather than cohort averages.
 */
export function calculatePersonalBaseline(historicalScores: number[], defaultBaseline = 38): number {
  if (!historicalScores || historicalScores.length === 0) {
    return defaultBaseline;
  }
  // If only 1 observation, return it
  if (historicalScores.length === 1) {
    return historicalScores[0];
  }
  // Calculate median or trimmed mean of historical baseline points
  const sorted = [...historicalScores].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  return median;
}

/**
 * Detects longitudinal trend from multiple historical observations.
 * Does not merely compare two values: calculates trajectory slope and consistency.
 */
export function detectTrend(history: { score: number; date?: string }[]): TrendAnalysisResult {
  if (!history || history.length < 2) {
    return {
      trend: 'Insufficient data',
      direction: 'stable',
      velocity: 0,
      observationsCount: history ? history.length : 0,
      description: 'Baseline observation recorded; awaiting subsequent check-ins to establish trend.',
    };
  }

  const scores = history.map(h => h.score);
  const n = scores.length;
  const recent = scores[n - 1];
  const previous = scores[n - 2];
  const first = scores[0];

  // Calculate simple linear regression slope
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += scores[i];
    sumXY += i * scores[i];
    sumX2 += i * i;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX || 1);
  const velocity = Math.round(slope * 10) / 10;

  // Recent delta
  const recentDelta = recent - previous;

  // Determine trend category
  if (slope > 6 || recentDelta >= 20) {
    return {
      trend: 'Rapidly increasing',
      direction: 'up',
      velocity,
      observationsCount: n,
      description: `Rapid elevation in distress markers (+${recentDelta} pts recently; trajectory +${velocity}/interval). Human review recommended.`,
    };
  }

  if (slope > 1.8 || (recentDelta >= 10 && recent > 50)) {
    return {
      trend: 'Increasing',
      direction: 'up',
      velocity,
      observationsCount: n,
      description: `Distress indicators show an increasing trajectory (+${velocity} pts/interval). Temporal correlation with case events advised.`,
    };
  }

  if (slope < -1.8 || (recentDelta <= -8 && recent < 60)) {
    return {
      trend: 'Improving',
      direction: 'down',
      velocity,
      observationsCount: n,
      description: `Recent well-being indicators show improvement (${recentDelta < 0 ? recentDelta : -velocity} pts). Stabilizing trajectory detected.`,
    };
  }

  // Check for wide fluctuation
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  if (max - min >= 25 && Math.abs(slope) <= 1.5) {
    return {
      trend: 'Fluctuating',
      direction: 'stable',
      velocity,
      observationsCount: n,
      description: `Indicators display periodic fluctuation between ${min} and ${max}. Continuous monitoring advised.`,
    };
  }

  return {
    trend: 'Stable',
    direction: 'stable',
    velocity,
    observationsCount: n,
    description: `Indicators remain steady within individual baseline variance (${recent}/100).`,
  };
}

/**
 * Text feature extractor analyzing sentiment, emotional tone, and non-causal temporal indicators.
 */
export function analyzeTextFeatures(text: string): {
  sentiment: 'positive' | 'neutral' | 'distressed' | 'highly_distressed';
  emotionalIntensity: number;
  fearIndicator: number;
  distressIndicator: number;
  helpSeeking: boolean;
  contributingSignals: string[];
} {
  const clean = (text || '').toLowerCase().trim();
  if (!clean) {
    return {
      sentiment: 'neutral',
      emotionalIntensity: 0.1,
      fearIndicator: 0,
      distressIndicator: 0,
      helpSeeking: false,
      contributingSignals: [],
    };
  }

  const fearWords = ['fear', 'scared', 'threat', 'unsafe', 'killed', 'attack', 'men', 'police', 'court', 'dar', 'chinta', 'bhoy', 'summons', 'witness'];
  const distressWords = ['cannot sleep', 'nightmare', 'insomnia', 'waking up', 'headache', 'crying', 'alone', 'hopeless', 'tired', 'help me', 'pareshan'];
  const positiveWords = ['better', 'safe', 'good', 'calm', 'supported', 'improving', 'peaceful', 'hopeful'];

  const foundFear = fearWords.filter(w => clean.includes(w));
  const foundDistress = distressWords.filter(w => clean.includes(w));
  const foundPositive = positiveWords.filter(w => clean.includes(w));

  const helpSeeking = clean.includes('help') || clean.includes('call me') || clean.includes('speak') || clean.includes('counsellor') || clean.includes('please');

  const fearScore = Math.min(1.0, foundFear.length * 0.35);
  const distressScore = Math.min(1.0, foundDistress.length * 0.3);
  const intensity = Math.min(1.0, 0.2 + (foundFear.length + foundDistress.length) * 0.25);

  let sentiment: 'positive' | 'neutral' | 'distressed' | 'highly_distressed' = 'neutral';
  if (foundFear.length >= 2 || foundDistress.length >= 2) {
    sentiment = 'highly_distressed';
  } else if (foundFear.length > 0 || foundDistress.length > 0) {
    sentiment = 'distressed';
  } else if (foundPositive.length > 0) {
    sentiment = 'positive';
  }

  const contributingSignals: string[] = [];
  if (foundFear.length > 0) {
    contributingSignals.push(`Fear-related language detected in statements (${foundFear.slice(0, 3).join(', ')})`);
  }
  if (foundDistress.length > 0) {
    contributingSignals.push(`Distress / sleep concerns mentioned in narrative`);
  }
  if (helpSeeking) {
    contributingSignals.push(`Explicit help-seeking request present in narrative`);
  }

  return {
    sentiment,
    emotionalIntensity: intensity,
    fearIndicator: fearScore,
    distressIndicator: distressScore,
    helpSeeking,
    contributingSignals,
  };
}

/**
 * Supplementary voice-derived feature analysis (non-diagnostic; requires human review).
 */
export function analyzeVoiceFeatures(durationSeconds = 0, isSimulated = true): {
  featuresAvailable: boolean;
  speechPace: 'slow' | 'moderate' | 'rapid';
  pauseFrequency: 'normal' | 'frequent' | 'prolonged';
  vocalArousal: number; // 0 - 1
  disclaimer: string;
} {
  return {
    featuresAvailable: durationSeconds > 0,
    speechPace: durationSeconds > 12 ? 'slow' : durationSeconds < 4 ? 'rapid' : 'moderate',
    pauseFrequency: durationSeconds > 10 ? 'prolonged' : 'normal',
    vocalArousal: durationSeconds > 0 ? 0.65 : 0.2,
    disclaimer: isSimulated
      ? 'Demo voice-analysis result. Voice-derived features provide supplementary indicators and require further validation by a qualified professional.'
      : 'Voice-derived features provide supplementary indicators and require further validation.',
  };
}
