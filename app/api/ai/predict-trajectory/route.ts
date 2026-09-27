import { NextRequest, NextResponse } from 'next/server';
import { AVAILABLE_ML_MODELS, DEFAULT_ML_MODEL } from '@/lib/ai/ml-models';
import { extractFeatureVector } from '@/lib/ai/feature-engineering';
import { repositories } from '@/lib/repositories';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { caseId = 'CASE-002', modelKey = 'logistic', inputFeatures } = body;

    // Fetch case or historical assessments if available
    const assessments = await repositories.assessments.getByCaseId(caseId);
    const historicalScores = assessments.map((a) => a.indicator);

    const model = AVAILABLE_ML_MODELS[modelKey] || DEFAULT_ML_MODEL;

    // Construct feature vector
    const currentScore = inputFeatures?.currentScore ?? (historicalScores.length > 0 ? historicalScores[historicalScores.length - 1] : 71);
    const featureVector = extractFeatureVector(
      {
        fearScore: inputFeatures?.fearScore ?? 4,
        sleepScore: inputFeatures?.sleepScore ?? 2,
        safetyScore: inputFeatures?.safetyScore ?? 2,
        avoidanceScore: inputFeatures?.avoidanceScore ?? 4,
        requestHelp: Boolean(inputFeatures?.requestHelp),
        notes: inputFeatures?.notes || '',
      },
      currentScore,
      historicalScores.length > 0 ? historicalScores.slice(0, -1) : [38, 46, 57]
    );

    const prediction = model.predict(featureVector, Math.max(3, historicalScores.length));

    return NextResponse.json({
      caseId,
      prediction,
      featureVectorSummary: {
        baselineDeviation: featureVector.baseline_deviation,
        trendSlope: featureVector.trend_slope,
        consecutiveIncreases: featureVector.consecutive_increases,
        momentum: featureVector.momentum,
      },
      probabilities: model.predictProbability(featureVector),
      message: 'Likelihood of increased distress indicators estimated for next monitoring window.',
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to compute trajectory prediction' }, { status: 500 });
  }
}
