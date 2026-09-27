import { SupportedLanguage } from '@/lib/i18n';

export interface LanguageDetectionResult {
  detectedLanguage: SupportedLanguage;
  confidence: number; // 0.0 to 1.0
  isLowConfidence: boolean; // Flag to prompt user for confirmation if < 0.70
  scriptFamily: 'Latin' | 'Devanagari' | 'Bengali-Assamese' | 'Meitei-Mayek' | 'Tamil' | 'Unknown';
}

export interface MultilingualEmotionSignal {
  sentiment: 'positive' | 'neutral' | 'distressed' | 'highly_distressed';
  emotionalIntensity: number; // 0.0 to 1.0
  fearSignal: number; // 0.0 to 1.0
  distressSignal: number; // 0.0 to 1.0
  helpSeeking: boolean;
  detectedKeywords: string[];
  originalLanguage: SupportedLanguage;
  rawTextSnippet: string;
}

// Language vocabulary signatures for deterministic detection and offline NLP
const LANGUAGE_SIGNATURES: Record<SupportedLanguage, { script: RegExp; keywords: string[] }> = {
  en: {
    script: /[a-zA-Z]/,
    keywords: ['help', 'fear', 'afraid', 'threat', 'court', 'cannot sleep', 'nightmare', 'scared', 'worried', 'police', 'alone', 'depressed'],
  },
  hi: {
    script: /[\u0900-\u097F]/,
    keywords: ['मदद', 'डर', 'भय', 'धमकी', 'नींद', 'अकेला', 'चिंता', 'सुरक्षा', 'परेशान', 'अदालत', 'घबराहट'],
  },
  as: {
    script: /[\u0980-\u09FF]/,
    keywords: ['সহায়', 'ভয়', 'ভাবনা', 'নিদ্ৰা', 'বিপদ', 'অকলশৰীয়া', 'আদালত', 'চিন্তা', 'ভাবুকি'],
  },
  bn: {
    script: /[\u0980-\u09FF]/,
    keywords: ['সাহায্য', 'ভয়', 'আতঙ্ক', 'ঘুম', 'হুমকি', 'বিপদ', 'আদালত', 'একাকী', 'উদ্বেগ'],
  },
  kha: {
    script: /[a-zA-Z]/,
    keywords: ['iarap', 'sheptieng', 'thiah', 'syier', 'jingshitom', 'marwei', 'kynrum'],
  },
  lus: {
    script: /[a-zA-Z]/,
    keywords: ['tanpui', 'hlau', 'muhil', 'hrehawm', 'mal', 'mangang', 'lungngai'],
  },
  mni: {
    script: /[\uABC0-\uABFF\u0980-\u09FF]/,
    keywords: ['mateng', 'akiba', 'tumba', 'waba', 'leingak', 'khudongthi'],
  },
  brx: {
    script: /[\u0900-\u097F]/,
    keywords: ['हेफाजाब', 'गिखं', 'अन्दु', 'दुखु', 'उदां'],
  },
  ne: {
    script: /[\u0900-\u097F]/,
    keywords: ['मद्दत', 'डर', 'त्रास', 'निन्द्रा', 'धम्की', 'एक्लै', 'चिन्ता', 'सुरक्षा'],
  },
  ta: {
    script: /[\u0B80-\u0BFF]/,
    keywords: ['உதவி', 'பயம்', 'தூக்கம்', 'அச்சம்', 'மிரட்டல்', 'தனிமை', 'பாதுகாப்பு', 'நீதிமன்றம்'],
  },
};

/**
 * Detects the input language based on script heuristics, character distributions, and keywords.
 * If confidence is low, flags it so the UI can gently ask the user to confirm.
 */
export function detectLanguage(text: string, declaredLanguage: SupportedLanguage = 'en'): LanguageDetectionResult {
  if (!text || text.trim().length === 0) {
    return {
      detectedLanguage: declaredLanguage,
      confidence: 1.0,
      isLowConfidence: false,
      scriptFamily: 'Latin',
    };
  }

  const clean = text.trim();

  // 1. Script checks
  let scriptFamily: LanguageDetectionResult['scriptFamily'] = 'Latin';
  if (/[\u0B80-\u0BFF]/.test(clean)) scriptFamily = 'Tamil';
  else if (/[\u0980-\u09FF]/.test(clean)) scriptFamily = 'Bengali-Assamese';
  else if (/[\u0900-\u097F]/.test(clean)) scriptFamily = 'Devanagari';
  else if (/[\uABC0-\uABFF]/.test(clean)) scriptFamily = 'Meitei-Mayek';

  // 2. Score by keywords and script matches
  const scores: Partial<Record<SupportedLanguage, number>> = {};

  for (const [langKey, sig] of Object.entries(LANGUAGE_SIGNATURES) as [SupportedLanguage, typeof LANGUAGE_SIGNATURES['en']][]) {
    let score = 0;
    if (sig.script.test(clean)) score += 0.4;

    const lower = clean.toLowerCase();
    for (const kw of sig.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score += 0.3;
      }
    }
    scores[langKey] = score;
  }

  // Bonus for user's selected language
  if (scores[declaredLanguage]) {
    scores[declaredLanguage] = (scores[declaredLanguage] || 0) + 0.3;
  }

  // Pick highest
  let bestLang: SupportedLanguage = declaredLanguage;
  let highestScore = 0;
  for (const [lang, score] of Object.entries(scores) as [SupportedLanguage, number][]) {
    if (score > highestScore) {
      highestScore = score;
      bestLang = lang;
    }
  }

  const confidence = Math.min(0.96, Math.max(0.40, highestScore));
  const isLowConfidence = confidence < 0.65 && clean.length > 5;

  return {
    detectedLanguage: bestLang,
    confidence: Math.round(confidence * 100) / 100,
    isLowConfidence,
    scriptFamily,
  };
}

/**
 * Extracts language-independent emotional and distress features from text
 */
export function extractMultilingualEmotion(
  text: string,
  preferredLanguage: SupportedLanguage = 'en'
): MultilingualEmotionSignal {
  if (!text || text.trim().length === 0) {
    return {
      sentiment: 'neutral',
      emotionalIntensity: 0.1,
      fearSignal: 0.05,
      distressSignal: 0.05,
      helpSeeking: false,
      detectedKeywords: [],
      originalLanguage: preferredLanguage,
      rawTextSnippet: '',
    };
  }

  const detected = detectLanguage(text, preferredLanguage);
  const lower = text.toLowerCase();
  const detectedKeywords: string[] = [];

  let fearWeight = 0;
  let distressWeight = 0;
  let helpSeeking = false;

  // Scan language keywords
  const langSignatures = LANGUAGE_SIGNATURES[detected.detectedLanguage] || LANGUAGE_SIGNATURES.en;
  for (const kw of langSignatures.keywords) {
    if (lower.includes(kw.toLowerCase())) {
      detectedKeywords.push(kw);
      if (['help', 'मदद', 'सहায়', 'সাহায্য', 'iarap', 'tanpui', 'mateng', 'हेफाजाब', 'मद्दत', 'உதவி'].includes(kw)) {
        helpSeeking = true;
        distressWeight += 0.3;
      }
      if (['fear', 'afraid', 'threat', 'scared', 'डर', 'ভয়', 'sheptieng', 'hlau', 'akiba', 'गिखं', 'பயம்'].includes(kw)) {
        fearWeight += 0.4;
        distressWeight += 0.3;
      }
      if (['cannot sleep', 'nightmare', 'नींद', 'নিদ্ৰা', 'ঘুম', 'thiah', 'muhil', 'tumba', 'अन्दु', 'निन्द्रा', 'தூக்கம்'].includes(kw)) {
        distressWeight += 0.35;
      }
    }
  }

  // Cross-language universal cues (exclamation marks, question marks, length)
  if (text.includes('!') || text.includes('?')) {
    distressWeight += 0.1;
  }

  const emotionalIntensity = Math.min(1.0, Math.max(0.1, (fearWeight + distressWeight) * 0.8));
  const finalFear = Math.min(1.0, fearWeight);
  const finalDistress = Math.min(1.0, distressWeight);

  let sentiment: MultilingualEmotionSignal['sentiment'] = 'neutral';
  if (finalDistress >= 0.7 || finalFear >= 0.7) {
    sentiment = 'highly_distressed';
  } else if (finalDistress >= 0.35 || finalFear >= 0.35) {
    sentiment = 'distressed';
  }

  return {
    sentiment,
    emotionalIntensity: Math.round(emotionalIntensity * 100) / 100,
    fearSignal: Math.round(finalFear * 100) / 100,
    distressSignal: Math.round(finalDistress * 100) / 100,
    helpSeeking,
    detectedKeywords: Array.from(new Set(detectedKeywords)),
    originalLanguage: detected.detectedLanguage,
    rawTextSnippet: text.slice(0, 120),
  };
}
