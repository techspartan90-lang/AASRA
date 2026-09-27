/**
 * AI Security & Prompt Injection Guardrails
 * Protects against adversarial manipulation, system prompt leaks, and malformed LLM outputs.
 * Enforces strict JSON schema validation, input sanitization, and deterministic fallbacks.
 */

import { RiskLevel } from '@/types';

export interface PromptSanitizationResult {
  sanitizedText: string;
  hasSuspectedInjection: boolean;
  detectedPatterns: string[];
  hasExplicitSafetyConcern: boolean;
  safetyKeywordsDetected: string[];
}

export interface ValidatedAiAssessment {
  distressScore: number;
  riskLevel: RiskLevel;
  primaryEmotions: string[];
  keyThemes: string[];
  changeIndicators: string[];
  rationale: string;
  safetyFlag: boolean;
  isValidated: boolean;
  fallbackUsed: boolean;
  validationErrors?: string[];
}

// Adversarial and prompt-injection patterns
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /disregard\s+(all\s+)?guidelines/i,
  /you\s+are\s+now\s+in\s+developer\s+mode/i,
  /system\s*:\s*role/i,
  /<script\b[^>]*>/i,
  /drop\s+table/i,
  /select\s+\*\s+from/i,
  /override\s+(risk|distress)\s+score/i,
  /classify\s+as\s+(low|zero)\s+risk/i,
  /pretend\s+you\s+are/i,
  /act\s+as\s+an\s+unfiltered/i,
  /jailbreak/i,
];

// Safety-critical explicit emergency triggers (independent of AI sentiment)
const EXPLICIT_SAFETY_KEYWORDS = [
  'kill myself',
  'end my life',
  'commit suicide',
  'someone is outside',
  'threatened to kill',
  'came to attack',
  'physical violence',
  'assaulted me again',
  'they are following me',
  'weapons',
  'knife',
  'gun',
  'burn my house',
  'destroy evidence',
  'harm my children',
];

/**
 * Sanitizes input text before inserting into LLM prompt templates
 */
export function sanitizeInputForAi(rawText: string): PromptSanitizationResult {
  if (!rawText || typeof rawText !== 'string') {
    return {
      sanitizedText: '',
      hasSuspectedInjection: false,
      detectedPatterns: [],
      hasExplicitSafetyConcern: false,
      safetyKeywordsDetected: [],
    };
  }

  const detectedPatterns: string[] = [];
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(rawText)) {
      detectedPatterns.push(pattern.source);
    }
  }

  const lowerText = rawText.toLowerCase();
  const safetyKeywordsDetected = EXPLICIT_SAFETY_KEYWORDS.filter(k => lowerText.includes(k));

  // Strip XML/HTML tags and command delimiters
  let clean = rawText
    .replace(/<[^>]*>/g, '')
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/system\s*:/gi, 'user-note:')
    .replace(/assistant\s*:/gi, 'assistant-note:');

  // Truncate to maximum safe length to avoid token-stuffing attacks
  const MAX_CHECKIN_LENGTH = 3000;
  if (clean.length > MAX_CHECKIN_LENGTH) {
    clean = clean.substring(0, MAX_CHECKIN_LENGTH);
  }

  return {
    sanitizedText: clean,
    hasSuspectedInjection: detectedPatterns.length > 0,
    detectedPatterns,
    hasExplicitSafetyConcern: safetyKeywordsDetected.length > 0,
    safetyKeywordsDetected,
  };
}

/**
 * Strict schema validator for AI output
 * Ensures response complies with clinical safety boundary: non-diagnostic, strictly bounded numeric ranges
 */
export function validateAndSanitizeAiOutput(
  rawJsonString: string,
  fallbackScore = 40
): ValidatedAiAssessment {
  const errors: string[] = [];

  try {
    // 1. JSON parsing
    // Clean potential markdown fences if present
    const cleanedString = rawJsonString.trim().replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
    const parsed = JSON.parse(cleanedString);

    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('AI output root is not an object');
    }

    // 2. Score range validation [0, 100]
    let score = Number(parsed.distressScore);
    if (isNaN(score)) {
      errors.push('Invalid distressScore: not a number');
      score = fallbackScore;
    } else {
      score = Math.max(0, Math.min(100, Math.round(score)));
    }

    // 3. Risk level validation
    const validLevels: RiskLevel[] = ['stable', 'mild', 'elevated', 'high'];
    let level: RiskLevel = parsed.riskLevel;
    if (!validLevels.includes(level)) {
      // Calibrate level from numeric score if invalid
      if (score >= 70) level = 'high';
      else if (score >= 50) level = 'elevated';
      else if (score >= 35) level = 'mild';
      else level = 'stable';
      errors.push(`Adjusted invalid riskLevel to '${level}' from score`);
    }

    // 4. Arrays validation
    const primaryEmotions = Array.isArray(parsed.primaryEmotions)
      ? parsed.primaryEmotions.filter((e: unknown) => typeof e === 'string' && e.length < 50).slice(0, 8)
      : ['Distress'];

    const keyThemes = Array.isArray(parsed.keyThemes)
      ? parsed.keyThemes.filter((t: unknown) => typeof t === 'string' && t.length < 80).slice(0, 8)
      : ['General check-in'];

    const changeIndicators = Array.isArray(parsed.changeIndicators)
      ? parsed.changeIndicators.filter((c: unknown) => typeof c === 'string' && c.length < 100).slice(0, 6)
      : ['Ongoing observation'];

    // 5. Rationale & safety flag validation
    const rationale =
      typeof parsed.rationale === 'string' && parsed.rationale.trim().length > 0
        ? parsed.rationale.substring(0, 500)
        : 'AI-assisted feature extraction based on reported indicators.';

    const safetyFlag = Boolean(parsed.safetyFlag || score >= 75);

    // 6. Medical diagnosis anti-pattern check (strictly forbidden)
    const FORBIDDEN_DIAGNOSTIC_TERMS = [
      'diagnosed with ptsd',
      'clinical depression confirmed',
      'schizophrenia',
      'bipolar disorder diagnosed',
      'prescribe',
      'medication dosage',
    ];

    const lowerRationale = rationale.toLowerCase();
    for (const term of FORBIDDEN_DIAGNOSTIC_TERMS) {
      if (lowerRationale.includes(term)) {
        errors.push(`Output violated safety boundary by asserting clinical diagnosis '${term}'`);
      }
    }

    if (errors.length > 0) {
      return {
        distressScore: score,
        riskLevel: level,
        primaryEmotions,
        keyThemes,
        changeIndicators,
        rationale: 'Rule-based decision support: assessment derived from structured indicators (AI output adjusted for safety compliance).',
        safetyFlag,
        isValidated: false,
        fallbackUsed: true,
        validationErrors: errors,
      };
    }

    return {
      distressScore: score,
      riskLevel: level,
      primaryEmotions,
      keyThemes,
      changeIndicators,
      rationale,
      safetyFlag,
      isValidated: true,
      fallbackUsed: false,
    };
  } catch (err) {
    return {
      distressScore: fallbackScore,
      riskLevel: fallbackScore >= 60 ? 'high' : fallbackScore >= 40 ? 'elevated' : 'mild',
      primaryEmotions: ['Monitoring'],
      keyThemes: ['Standard check-in'],
      changeIndicators: ['Baseline observation'],
      rationale: 'Deterministic fallback applied: AI output malformed or unavailable. Human review recommended.',
      safetyFlag: fallbackScore >= 70,
      isValidated: false,
      fallbackUsed: true,
      validationErrors: [(err as Error).message || 'JSON parse error'],
    };
  }
}
