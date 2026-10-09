'use client';

import { useApp } from '@/lib/store';
import {
  translate,
  getTextDirection,
  isRtlLocale,
  SUPPORTED_LOCALES,
  LocaleCode,
  TextDirection,
  LanguageMetadata,
} from '@/lib/i18n-engine';
import { SupportedLanguage } from '@/lib/i18n';

export interface UseTranslationReturn {
  t: (
    key: string,
    defaultOrParams?: string | Record<string, string | number>,
    params?: Record<string, string | number>
  ) => string;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  direction: TextDirection;
  isRtl: boolean;
  supportedLocales: LanguageMetadata[];
}

/**
 * Universal i18n hook with automatic fallback to English, custom defaults, and RTL support.
 */
export function useTranslation(): UseTranslationReturn {
  const { language, setLanguage } = useApp();
  const direction = getTextDirection(language);
  const isRtl = isRtlLocale(language);

  const t = (
    key: string,
    defaultOrParams?: string | Record<string, string | number>,
    params?: Record<string, string | number>
  ): string => {
    const actualParams = typeof defaultOrParams === 'object' ? defaultOrParams : params;
    const defaultText = typeof defaultOrParams === 'string' ? defaultOrParams : undefined;
    const result = translate(key, actualParams, language as LocaleCode);
    if ((result === key || !result) && defaultText) {
      return defaultText;
    }
    return result;
  };

  return {
    t,
    language,
    setLanguage,
    direction,
    isRtl,
    supportedLocales: SUPPORTED_LOCALES,
  };
}
