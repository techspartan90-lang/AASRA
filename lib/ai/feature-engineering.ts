import { CheckInFeatures } from '@/lib/engines/risk-engine';

export interface RawObservation {
  score: number;
  date?: string;
  feelingScore?: number;
  safetyScore?: number;
  sleepScore?: number;
  fearScore?: number;
  avoidanceScore?: number;
}

export interface PersonalBaselineMetrics {
  historicalMean: number;
  historicalMedian: number;
  historicalStd: number;
  recentMean: number;
  recentSlope: number;
  recentVolatility: number;
  baselineConfidence: 'insufficient' | 'low' | 'moderate' | 'high';
  observationsCount: number;
}

export interface LongitudinalFeatures {
  rollingMean7d: number;
  rollingMean30d: number;
  rollingMean90d: number;
  slope: number;
  volatility: number;
  momentum: number; // recent average minus previous average
  consecutiveIncreases: number; // persistence count
  velocity: number;
}

export interface FeatureVector {
  // Raw and scaled check-in features
  fear_score: number;
  sleep_score: number;
  stress_score: number;
  withdrawal_score: number;
  safety_concern_score: number;
  engagement_score: number;
  help_seeking_score: number;
  missed_checkin_count: number;
  checkin_frequency: number;

  // Baseline and delta features
  baseline_indicator: number;
  current_indicator: number;
  baseline_deviation: number;

  // Longitudinal trajectory features
  trend_slope: number;
  trend_velocity: number;
  recent_change: number;
  rolling_mean_7d: number;
  rolling_mean_30d: number;
  rolling_mean_90d: number;
  volatility: number;
  momentum: number;
  consecutive_increases: number;

  // Service history features
  number_of_recent_alerts: number;
  intervention_recency: number;
  followup_status: number;

  // Supplementary multimodal indicators
  voice_activity_ratio?: number;
  voice_pause_rate?: number;
  voice_pitch_variance?: number;
  text_sentiment_negative?: number;
  text_help_signal?: number;

  // Normalized feature dictionary for ML models (scaled between 0 and 1 or -1 and 1)
  normalized: Record<string, number>;
}

/**
 * Calculates statistically grounded personal baseline metrics without fabricating data.
 */
export function computePersonalBaseline(scores: number[]): PersonalBaselineMetrics {
  const n = scores.length;

  if (n === 0) {
    return {
      historicalMean: 38,
      historicalMedian: 38,
      historicalStd: 0,
      recentMean: 38,
      recentSlope: 0,
      recentVolatility: 0,
      baselineConfidence: 'insufficient',
      observationsCount: 0,
    };
  }

  // Mean
  const sum = scores.reduce((acc, val) => acc + val, 0);
  const mean = Math.round((sum / n) * 10) / 10;

  // Median
  const sorted = [...scores].sort((a, b) => a - b);
  const mid = Math.floor(n / 2);
  const median = n % 2 !== 0 ? sorted[mid] : Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 10) / 10;

  // Standard deviation
  const variance = scores.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
  const std = Math.round(Math.sqrt(variance) * 10) / 10;

  // Recent statistics (last 3 observations if available)
  const recentSlice = scores.slice(-3);
  const recentMean = Math.round((recentSlice.reduce((a, b) => a + b, 0) / recentSlice.length) * 10) / 10;

  // Slope of recent scores
  let recentSlope = 0;
  if (recentSlice.length >= 2) {
    recentSlope = Math.round(((recentSlice[recentSlice.length - 1] - recentSlice[0]) / (recentSlice.length - 1)) * 10) / 10;
  }

  // Recent volatility
  const recentVar = recentSlice.reduce((acc, val) => acc + Math.pow(val - recentMean, 2), 0) / recentSlice.length;
  const recentVolatility = Math.round(Math.sqrt(recentVar) * 10) / 10;

  // Confidence determination
  let baselineConfidence: PersonalBaselineMetrics['baselineConfidence'] = 'insufficient';
  if (n >= 6) {
    baselineConfidence = 'high';
  } else if (n >= 4) {
    baselineConfidence = 'moderate';
  } else if (n >= 2) {
    baselineConfidence = 'low';
  }

  return {
    historicalMean: mean,
    historicalMedian: median,
    historicalStd: std,
    recentMean,
    recentSlope,
    recentVolatility,
    baselineConfidence,
    observationsCount: n,
  };
}

/**
 * Computes longitudinal rolling window metrics and trajectory momentum
 */
export function computeLongitudinalFeatures(observations: number[]): LongitudinalFeatures {
  if (observations.length === 0) {
    return {
      rollingMean7d: 38,
      rollingMean30d: 38,
      rollingMean90d: 38,
      slope: 0,
      volatility: 0,
      momentum: 0,
      consecutiveIncreases: 0,
      velocity: 0,
    };
  }

  const n = observations.length;
  const current = observations[n - 1];

  // 7-day equivalent (recent 1-2 points)
  const last2 = observations.slice(-2);
  const rollingMean7d = Math.round((last2.reduce((a, b) => a + b, 0) / last2.length) * 10) / 10;

  // 30-day equivalent (recent 4-5 points)
  const last4 = observations.slice(-4);
  const rollingMean30d = Math.round((last4.reduce((a, b) => a + b, 0) / last4.length) * 10) / 10;

  // 90-day equivalent (all observations up to 10)
  const rollingMean90d = Math.round((observations.reduce((a, b) => a + b, 0) / n) * 10) / 10;

  // OLS Linear Slope
  let slope = 0;
  if (n >= 2) {
    const x = observations.map((_, i) => i);
    const xMean = (n - 1) / 2;
    const yMean = rollingMean90d;
    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
      num += (x[i] - xMean) * (observations[i] - yMean);
      den += Math.pow(x[i] - xMean, 2);
    }
    slope = den !== 0 ? Math.round((num / den) * 10) / 10 : 0;
  }

  // Standard deviation
  const variance = observations.reduce((acc, v) => acc + Math.pow(v - rollingMean90d, 2), 0) / n;
  const volatility = Math.round(Math.sqrt(variance) * 10) / 10;

  // Momentum: recent average minus earlier baseline average
  const earlier = observations.slice(0, Math.max(1, Math.floor(n / 2)));
  const earlierMean = earlier.reduce((a, b) => a + b, 0) / earlier.length;
  const momentum = Math.round((rollingMean7d - earlierMean) * 10) / 10;

  // Persistence: number of consecutive increases leading up to current observation
  let consecutiveIncreases = 0;
  for (let i = n - 1; i > 0; i--) {
    if (observations[i] > observations[i - 1]) {
      consecutiveIncreases++;
    } else {
      break;
    }
  }

  // Velocity: point-to-point change per step
  const previous = n >= 2 ? observations[n - 2] : current;
  const velocity = current - previous;

  return {
    rollingMean7d,
    rollingMean30d,
    rollingMean90d,
    slope,
    volatility,
    momentum,
    consecutiveIncreases,
    velocity,
  };
}

/**
 * Transforms check-in signals, case context, and longitudinal history into a normalized FeatureVector.
 */
export function extractFeatureVector(
  input: CheckInFeatures,
  currentIndicator: number,
  historicalScores: number[] = [],
  context: {
    missedCheckInsCount?: number;
    numberOfRecentAlerts?: number;
    daysSinceLastIntervention?: number;
    hasPendingFollowUp?: boolean;
    voiceMetrics?: { speechRatio: number; pauseRate: number; pitchVariance: number };
    textMetrics?: { sentimentNegative: number; helpSignal: number };
  } = {}
): FeatureVector {
  const fullScores = [...historicalScores, currentIndicator];
  const baselineMetrics = computePersonalBaseline(historicalScores);
  const longitudinal = computeLongitudinalFeatures(fullScores);

  const fearScore = input.fearScore ?? 1;
  // Sleep inverted: 1 (worst) -> 5 (high distress disturbance), 5 (best) -> 1 (low disturbance)
  const sleepDisturbance = 6 - (input.sleepScore ?? 3);
  const somaticStress = Math.max(fearScore, 6 - (input.safetyScore ?? 3));
  const withdrawalScore = input.avoidanceScore ?? 1;
  const safetyConcern = 6 - (input.safetyScore ?? 3);
  const helpSeeking = input.requestHelp ? 1 : 0;
  const missedCount = context.missedCheckInsCount ?? input.missedCheckIns ?? 0;
  const engagementRatio = Math.max(0, 1 - missedCount * 0.25);
  const baselineScore = baselineMetrics.historicalMean;
  const baselineDelta = Math.round(currentIndicator - baselineScore);

  // Normalizations for ML models (clamped between 0 and 1 or -1 and 1)
  const normalized: Record<string, number> = {
    fear: Math.min(1, Math.max(0, (fearScore - 1) / 4)),
    sleep_disturbance: Math.min(1, Math.max(0, (sleepDisturbance - 1) / 4)),
    somatic_stress: Math.min(1, Math.max(0, (somaticStress - 1) / 4)),
    withdrawal: Math.min(1, Math.max(0, (withdrawalScore - 1) / 4)),
    safety_concern: Math.min(1, Math.max(0, (safetyConcern - 1) / 4)),
    help_seeking: helpSeeking,
    engagement: engagementRatio,
    missed_checkins: Math.min(1, missedCount / 5),
    baseline_deviation: Math.min(1, Math.max(-1, baselineDelta / 50)),
    trend_slope: Math.min(1, Math.max(-1, longitudinal.slope / 10)),
    momentum: Math.min(1, Math.max(-1, longitudinal.momentum / 40)),
    consecutive_increases: Math.min(1, longitudinal.consecutiveIncreases / 5),
    volatility: Math.min(1, longitudinal.volatility / 20),
    recent_alerts: Math.min(1, (context.numberOfRecentAlerts ?? 0) / 4),
  };

  return {
    fear_score: fearScore,
    sleep_score: sleepDisturbance,
    stress_score: somaticStress,
    withdrawal_score: withdrawalScore,
    safety_concern_score: safetyConcern,
    engagement_score: engagementRatio,
    help_seeking_score: helpSeeking,
    missed_checkin_count: missedCount,
    checkin_frequency: 7,
    baseline_indicator: baselineScore,
    current_indicator: currentIndicator,
    baseline_deviation: baselineDelta,
    trend_slope: longitudinal.slope,
    trend_velocity: longitudinal.velocity,
    recent_change: longitudinal.velocity,
    rolling_mean_7d: longitudinal.rollingMean7d,
    rolling_mean_30d: longitudinal.rollingMean30d,
    rolling_mean_90d: longitudinal.rollingMean90d,
    volatility: longitudinal.volatility,
    momentum: longitudinal.momentum,
    consecutive_increases: longitudinal.consecutiveIncreases,
    number_of_recent_alerts: context.numberOfRecentAlerts ?? 0,
    intervention_recency: context.daysSinceLastIntervention ?? 14,
    followup_status: context.hasPendingFollowUp ? 1 : 0,

    voice_activity_ratio: context.voiceMetrics?.speechRatio,
    voice_pause_rate: context.voiceMetrics?.pauseRate,
    voice_pitch_variance: context.voiceMetrics?.pitchVariance,
    text_sentiment_negative: context.textMetrics?.sentimentNegative,
    text_help_signal: context.textMetrics?.helpSignal,

    normalized,
  };
}
