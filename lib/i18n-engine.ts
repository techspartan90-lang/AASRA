/**
 * PHASE 12: INTERNATIONALIZATION (i18n) ENGINE
 * 
 * Enterprise-grade multilingual architecture supporting:
 * - 11 official Indian languages (English, Hindi, Tamil, Telugu, Bengali,
 *   Marathi, Kannada, Odia, Gujarati, Punjabi, Urdu)
 * - Translation file management under /locales/{lang}/translations.json
 * - Right-to-Left (RTL) layout support for Urdu
 * - Resilient fallback: selected language -> English default
 * - Culturally neutral, trauma-informed, non-stigmatizing wording
 * - Parameter interpolation & dot-notation path resolution
 */

import enTranslations from '@/locales/en/translations.json';
import hiTranslations from '@/locales/hi/translations.json';
import taTranslations from '@/locales/ta/translations.json';
import teTranslations from '@/locales/te/translations.json';
import bnTranslations from '@/locales/bn/translations.json';
import mrTranslations from '@/locales/mr/translations.json';
import knTranslations from '@/locales/kn/translations.json';
import orTranslations from '@/locales/or/translations.json';
import guTranslations from '@/locales/gu/translations.json';
import paTranslations from '@/locales/pa/translations.json';
import urTranslations from '@/locales/ur/translations.json';
import asTranslations from '@/locales/as/translations.json';
import khaTranslations from '@/locales/kha/translations.json';
import lusTranslations from '@/locales/lus/translations.json';
import mniTranslations from '@/locales/mni/translations.json';
import brxTranslations from '@/locales/brx/translations.json';
import neTranslations from '@/locales/ne/translations.json';
import { TRANSLATIONS } from '@/lib/i18n';
import { LANDING_TRANSLATIONS } from '@/lib/landing-translations';

export type LocaleCode =
  | 'en'
  | 'hi'
  | 'ta'
  | 'te'
  | 'bn'
  | 'mr'
  | 'kn'
  | 'or'
  | 'gu'
  | 'pa'
  | 'ur'
  | 'as'
  | 'kha'
  | 'lus'
  | 'mni'
  | 'brx'
  | 'ne';

export type TextDirection = 'ltr' | 'rtl';

export interface LanguageMetadata {
  code: LocaleCode;
  name: string;
  nativeName: string;
  direction: TextDirection;
  script: string;
  voiceCode: string;
  isRtl: boolean;
}

export const SUPPORTED_LOCALES: LanguageMetadata[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', script: 'Latin', voiceCode: 'en-IN', isRtl: false },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr', script: 'Devanagari', voiceCode: 'hi-IN', isRtl: false },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', direction: 'ltr', script: 'Tamil', voiceCode: 'ta-IN', isRtl: false },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', direction: 'ltr', script: 'Telugu', voiceCode: 'te-IN', isRtl: false },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', direction: 'ltr', script: 'Bengali', voiceCode: 'bn-IN', isRtl: false },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', direction: 'ltr', script: 'Devanagari', voiceCode: 'mr-IN', isRtl: false },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', direction: 'ltr', script: 'Kannada', voiceCode: 'kn-IN', isRtl: false },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', direction: 'ltr', script: 'Odia', voiceCode: 'or-IN', isRtl: false },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', direction: 'ltr', script: 'Gujarati', voiceCode: 'gu-IN', isRtl: false },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', direction: 'ltr', script: 'Gurmukhi', voiceCode: 'pa-IN', isRtl: false },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', direction: 'rtl', script: 'Nastaliq / Arabic', voiceCode: 'ur-IN', isRtl: true },
];

export const TRANSLATION_CATALOG: Record<string, any> = {
  en: enTranslations,
  hi: hiTranslations,
  ta: taTranslations,
  te: teTranslations,
  bn: bnTranslations,
  mr: mrTranslations,
  kn: knTranslations,
  or: orTranslations,
  gu: guTranslations,
  pa: paTranslations,
  ur: urTranslations,
  as: asTranslations,
  kha: khaTranslations,
  lus: lusTranslations,
  mni: mniTranslations,
  brx: brxTranslations,
  ne: neTranslations,
};

/**
 * Returns whether a given language uses RTL (Right-to-Left) script.
 */
export function isRtlLocale(locale: string): boolean {
  return locale.toLowerCase() === 'ur';
}

/**
 * Returns text direction ('rtl' | 'ltr') for a given language code.
 */
export function getTextDirection(locale: string): TextDirection {
  return isRtlLocale(locale) ? 'rtl' : 'ltr';
}

/**
 * Safely resolves a nested property path (e.g. 'checkin.title') in an object.
 */
function resolvePath(obj: any, path: string): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  const parts = path.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

/**
 * Core translation resolver with English fallback.
 * 
 * Rules:
 * 1. Checks if key exists in selected locale.
 * 2. If missing or empty, gracefully falls back to English ('en').
 * 3. If missing in English, returns the raw key path for debugging.
 * 4. Supports parameter interpolation: {name}, {count}, etc.
 */
export function translate(
  key: string,
  params?: Record<string, string | number>,
  locale: LocaleCode = 'en'
): string {
  // 1. Try selected locale catalog via dot-path
  const catalog = TRANSLATION_CATALOG[locale];
  let text = resolvePath(catalog, key);

  // 1b. Try flat key in TRANSLATIONS dictionary
  if (text === undefined && (TRANSLATIONS as any)[locale]) {
    text = (TRANSLATIONS as any)[locale][key];
  }

  // 1c. Try landing translations dictionary
  if (text === undefined && (LANDING_TRANSLATIONS as any)[locale]) {
    text = (LANDING_TRANSLATIONS as any)[locale][key];
  }

  // 2. Fallback to English dot-path if not found
  if (text === undefined && locale !== 'en') {
    text = resolvePath(TRANSLATION_CATALOG.en, key);
  }

  // 2b. Fallback to English flat key
  if (text === undefined && TRANSLATIONS.en) {
    text = TRANSLATIONS.en[key];
  }

  // 2c. Fallback to English landing key
  if (text === undefined && LANDING_TRANSLATIONS.en) {
    text = LANDING_TRANSLATIONS.en[key];
  }

  // 3. Fallback to key if still not found
  if (text === undefined) {
    return key;
  }

  // 4. Parameter interpolation
  if (params && typeof params === 'object') {
    for (const [paramKey, paramVal] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
    }
  }

  return text;
}

/**
 * Verifies completeness of translations across all supported languages.
 */
export function auditTranslationCompleteness(): {
  totalLanguages: number;
  languagesAudited: string[];
  rtlLanguages: string[];
  coverageRate: number; // percentage
  status: 'ALL_PASS' | 'GAPS_DETECTED';
  keyCount: number;
} {
  const referenceKeys: string[] = [];

  function collectKeys(obj: any, prefix = '') {
    for (const key of Object.keys(obj)) {
      const fullPath = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        collectKeys(obj[key], fullPath);
      } else {
        referenceKeys.push(fullPath);
      }
    }
  }

  collectKeys(enTranslations);

  let missingCount = 0;
  const rtlLanguages = SUPPORTED_LOCALES.filter(l => l.isRtl).map(l => l.name);

  for (const locale of SUPPORTED_LOCALES) {
    const catalog = TRANSLATION_CATALOG[locale.code];
    for (const key of referenceKeys) {
      const val = resolvePath(catalog, key);
      if (val === undefined || val === '') {
        missingCount++;
      }
    }
  }

  const totalChecks = referenceKeys.length * SUPPORTED_LOCALES.length;
  const coverageRate = Math.round(((totalChecks - missingCount) / totalChecks) * 100);

  return {
    totalLanguages: SUPPORTED_LOCALES.length,
    languagesAudited: SUPPORTED_LOCALES.map(l => `${l.name} (${l.code})`),
    rtlLanguages,
    coverageRate,
    status: missingCount === 0 ? 'ALL_PASS' : 'GAPS_DETECTED',
    keyCount: referenceKeys.length,
  };
}
