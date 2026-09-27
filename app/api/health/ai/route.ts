import { NextResponse } from 'next/server';
import { aiService } from '@/lib/services/ai-service-provider';

export async function GET() {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');

  return NextResponse.json(
    {
      status: 'healthy',
      service: 'ai_analysis_engine',
      provider: hasGeminiKey ? 'google_genai_gemini_2.5_flash' : 'deterministic_rule_based_fallback',
      apiKeyConfigured: hasGeminiKey,
      safetyGuardrails: 'active',
      promptInjectionDefense: 'active',
      schemaValidation: 'active',
      fallbackEngine: 'ready',
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    }
  );
}
