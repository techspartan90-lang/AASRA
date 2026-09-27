import { NextResponse } from 'next/server';
import { AVAILABLE_ML_MODELS } from '@/lib/ai/ml-models';
import { performDataLeakageAudit } from '@/lib/ai/data-leakage-audit';

export async function GET() {
  const models = Object.keys(AVAILABLE_ML_MODELS).map(key => ({
    key,
    name: AVAILABLE_ML_MODELS[key].modelName,
    version: AVAILABLE_ML_MODELS[key].modelVersion,
  }));

  const leakageReport = performDataLeakageAudit();

  return NextResponse.json(
    {
      status: 'healthy',
      service: 'ml_inference_engine',
      availableModels: models,
      modelsCount: models.length,
      dataLeakageStatus: leakageReport.overallStatus,
      calibrationValidation: 'active',
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    }
  );
}
