import { NextResponse } from 'next/server';
import { AVAILABLE_ML_MODELS } from '@/lib/ai/ml-models';
import { generateSyntheticTestDataset, SUBGROUP_FAIRNESS_AUDIT, AI_LIMITATIONS_RECORD, RESPONSIBLE_AI_PRINCIPLES } from '@/lib/ai/evaluation';

export async function GET() {
  const testData = generateSyntheticTestDataset();

  const modelEvaluations = Object.entries(AVAILABLE_ML_MODELS).map(([key, model]) => {
    return {
      id: key,
      modelName: model.modelName,
      modelVersion: model.modelVersion,
      featureVersion: model.featureVersion,
      featureImportance: model.getFeatureImportance(),
      evaluation: model.evaluate(testData),
    };
  });

  return NextResponse.json({
    models: modelEvaluations,
    subgroupFairness: SUBGROUP_FAIRNESS_AUDIT,
    aiLimitations: AI_LIMITATIONS_RECORD,
    responsibleAiPrinciples: RESPONSIBLE_AI_PRINCIPLES,
    disclaimer: 'Prototype research models evaluated strictly on synthetic demonstration test cases. Not a clinical diagnostic tool.',
    timestamp: new Date().toISOString(),
  });
}
