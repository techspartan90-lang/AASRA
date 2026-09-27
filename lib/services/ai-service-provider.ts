import { DistressRiskEngine, CheckInFeatures, PipelineResult } from '@/lib/engines/risk-engine';
import { GoogleGenAI } from '@google/genai';
import { extractFeatureVector } from '@/lib/ai/feature-engineering';
import { DEFAULT_ML_MODEL, PredictionResult } from '@/lib/ai/ml-models';
import { extractMultilingualEmotion, MultilingualEmotionSignal } from '@/lib/ai/multilingual-nlp';
import { buildCheckInAnalysisPrompt } from '@/lib/ai/prompt-templates';
import { aiObservability } from '@/lib/ai/observability';
import { sanitizeInputForAi, validateAndSanitizeAiOutput } from '@/lib/security/prompt-guard';

export interface ExtendedPipelineResult extends PipelineResult {
  mlPrediction?: PredictionResult;
  multilingualSignal?: MultilingualEmotionSignal;
}

export interface IAIService {
  analyzeCheckIn(input: CheckInFeatures, caseId?: string): Promise<ExtendedPipelineResult>;
  analyzeText(text: string, language?: string): Promise<MultilingualEmotionSignal>;
  generateExplanation(caseId: string, features: CheckInFeatures, baseline: number, score: number): Promise<string>;
}

export class FallbackAIService implements IAIService {
  async analyzeCheckIn(input: CheckInFeatures, caseId = 'CASE-002'): Promise<ExtendedPipelineResult> {
    const startTime = Date.now();
    const deterministic = DistressRiskEngine.analyzeCheckIn(input, true);

    // Multilingual signal extraction
    const multilingual = extractMultilingualEmotion(input.notes || '');

    // Feature extraction & ML trajectory prediction
    const featureVector = extractFeatureVector(input, deterministic.indicator, input.historicalScores || [deterministic.baseline]);
    const mlPrediction = DEFAULT_ML_MODEL.predict(featureVector, (input.historicalScores || []).length);

    aiObservability.recordRequest({
      service: 'deterministic_fallback',
      operation: 'checkin_analysis',
      modelVersion: 'risk-engine-v2',
      latencyMs: Date.now() - startTime,
      success: true,
      fallbackTriggered: true,
      fallbackReason: 'Deterministic engine activated',
    });

    return {
      ...deterministic,
      mlPrediction,
      multilingualSignal: multilingual,
    };
  }

  async analyzeText(text: string, language = 'en') {
    return extractMultilingualEmotion(text, language as any);
  }

  async generateExplanation(caseId: string, features: CheckInFeatures, baseline: number, score: number): Promise<string> {
    const delta = score - baseline;
    return `Case ${caseId}: Current indicator is ${score}/100 compared to individual resting baseline of ${baseline}/100 (${delta >= 0 ? '+' : ''}${delta} pts). Evaluated via deterministic risk engine.`;
  }
}

export class GeminiEnhancedAIService implements IAIService {
  private fallback = new FallbackAIService();

  async analyzeCheckIn(input: CheckInFeatures, caseId = 'CASE-002'): Promise<ExtendedPipelineResult> {
    const startTime = Date.now();
    const deterministic = DistressRiskEngine.analyzeCheckIn(input, false);
    const multilingual = extractMultilingualEmotion(input.notes || '');
    const featureVector = extractFeatureVector(input, deterministic.indicator, input.historicalScores || [deterministic.baseline]);
    const mlPrediction = DEFAULT_ML_MODEL.predict(featureVector, (input.historicalScores || []).length);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || (!input.notes && !input.hasVoiceSample)) {
      aiObservability.recordRequest({
        service: 'ml_inference',
        operation: 'checkin_analysis',
        modelVersion: DEFAULT_ML_MODEL.modelVersion,
        latencyMs: Date.now() - startTime,
        success: true,
        fallbackTriggered: false,
      });

      return {
        ...deterministic,
        mlPrediction,
        multilingualSignal: multilingual,
      };
    }

    try {
      const sanitized = sanitizeInputForAi(input.notes || '');
      const ai = new GoogleGenAI({ apiKey });
      const prompt = buildCheckInAnalysisPrompt({
        caseCode: caseId,
        notes: sanitized.sanitizedText,
        computedScore: deterministic.indicator,
        baseline: deterministic.baseline,
        delta: deterministic.baselineDeviation,
        trajectory: deterministic.trend,
        contributingSignals: deterministic.contributingFactors,
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        const validation = validateAndSanitizeAiOutput(response.text, deterministic.indicator);
        if (validation.isValidated) {
          deterministic.explanation = `${validation.rationale} (Longitudinal baseline: ${deterministic.baseline}/100)`;
          if (validation.changeIndicators.length > 0) {
            deterministic.contributingFactors = Array.from(
              new Set([...deterministic.contributingFactors, ...validation.changeIndicators])
            );
          }
        } else {
          // Validation failed or medical diagnosis anti-pattern detected; use safe deterministic rationale
          deterministic.explanation = `${validation.rationale} (Longitudinal baseline: ${deterministic.baseline}/100)`;
        }
      }

      aiObservability.recordRequest({
        service: 'gemini',
        operation: 'checkin_analysis',
        modelVersion: 'gemini-3.8-flash',
        latencyMs: Date.now() - startTime,
        success: true,
        fallbackTriggered: false,
      });

      return {
        ...deterministic,
        mlPrediction,
        multilingualSignal: multilingual,
      };
    } catch (e) {
      console.warn('Gemini request failed, falling back to deterministic risk engine:', e);
      aiObservability.recordRequest({
        service: 'deterministic_fallback',
        operation: 'checkin_analysis',
        modelVersion: 'risk-engine-v2',
        latencyMs: Date.now() - startTime,
        success: true,
        fallbackTriggered: true,
        fallbackReason: e instanceof Error ? e.message : 'API request timeout or connection error',
      });

      return {
        ...deterministic,
        isAiFallback: true,
        mlPrediction,
        multilingualSignal: multilingual,
      };
    }
  }

  async analyzeText(text: string, language = 'en') {
    return this.fallback.analyzeText(text, language);
  }

  async generateExplanation(caseId: string, features: CheckInFeatures, baseline: number, score: number): Promise<string> {
    return this.fallback.generateExplanation(caseId, features, baseline, score);
  }
}

export const aiService: IAIService = new GeminiEnhancedAIService();
