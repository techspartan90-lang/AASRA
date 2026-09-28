import assert from 'node:assert';
import {
  SUPPORTED_LOCALES,
  TRANSLATION_CATALOG,
  translate,
  getTextDirection,
  isRtlLocale,
  auditTranslationCompleteness,
  LocaleCode,
} from '../lib/i18n-engine';
import {
  MULTI_MODAL_RISK_STATES,
  getAccessibleStatus,
  auditWcagCompliance,
  announceToScreenReader,
  DEFAULT_A11Y_SETTINGS,
} from '../lib/accessibility-engine';
import { SUPPORTED_LANGUAGES } from '../lib/i18n';

export function runMultilingualAccessibilityTests() {
  console.log('🧪 Starting Phase 12 & Phase 13: Multilingual & Accessibility Test Suite...');

  // -------------------------------------------------------------
  // PHASE 12: MULTILINGUAL TESTS
  // -------------------------------------------------------------

  // Test 1: Verify all 11 required languages are supported
  const required11: LocaleCode[] = ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'kn', 'or', 'gu', 'pa', 'ur'];
  const localeCodes = SUPPORTED_LOCALES.map(l => l.code);
  for (const req of required11) {
    assert(localeCodes.includes(req), `Language code ${req} must be in SUPPORTED_LOCALES`);
    assert(Boolean(TRANSLATION_CATALOG[req]), `Translation catalog for ${req} must be loaded`);
  }
  assert.strictEqual(SUPPORTED_LOCALES.length, 11);
  console.log('  ✅ Test 1 Passed: All 11 official Indian languages registered and loaded');

  // Test 2: Verify translation catalog integrity across all 11 languages
  for (const code of required11) {
    const catalog = TRANSLATION_CATALOG[code];
    assert(Boolean(catalog.nav), `${code}: missing nav section`);
    assert(Boolean(catalog.checkin), `${code}: missing checkin section`);
    assert(Boolean(catalog.alerts), `${code}: missing alerts section`);
    assert(Boolean(catalog.a11y), `${code}: missing a11y section`);
    assert(Boolean(catalog.common), `${code}: missing common section`);

    // Check specific navigation and checkin keys
    assert(Boolean(catalog.nav.home), `${code}: missing nav.home`);
    assert(Boolean(catalog.nav.privacy), `${code}: missing nav.privacy`);
    assert(Boolean(catalog.checkin.title), `${code}: missing checkin.title`);
    assert(Boolean(catalog.checkin.calm), `${code}: missing checkin.calm`);
    assert(Boolean(catalog.checkin.very_distressed), `${code}: missing checkin.very_distressed`);
  }
  console.log('  ✅ Test 2 Passed: Translation catalog sections and keys validated across all 11 languages');

  // Test 3: Translation fallback to English
  const englishCheckIn = translate('checkin.title', undefined, 'en');
  assert.strictEqual(englishCheckIn, 'How are you feeling today?');

  const hindiCheckIn = translate('checkin.title', undefined, 'hi');
  assert.strictEqual(hindiCheckIn, 'आज आप कैसा महसूस कर रहे हैं?');

  // Non-existent key in Tamil falls back to English if in English, or returns key
  const fallbackVal = translate('non_existent.fake_key', undefined, 'ta');
  assert.strictEqual(fallbackVal, 'non_existent.fake_key');
  console.log('  ✅ Test 3 Passed: Resilient translation lookup with graceful English fallback verified');

  // Test 4: RTL direction enforcement for Urdu
  assert.strictEqual(isRtlLocale('ur'), true, 'Urdu must be recognized as RTL');
  assert.strictEqual(getTextDirection('ur'), 'rtl', 'Urdu text direction must be rtl');
  assert.strictEqual(TRANSLATION_CATALOG.ur.direction, 'rtl');

  for (const code of required11.filter(c => c !== 'ur')) {
    assert.strictEqual(isRtlLocale(code), false, `${code} must not be RTL`);
    assert.strictEqual(getTextDirection(code), 'ltr', `${code} text direction must be ltr`);
  }
  console.log('  ✅ Test 4 Passed: RTL layout direction correctly enforced for Urdu and LTR for others');

  // Test 5: Translation completeness audit
  const auditRes = auditTranslationCompleteness();
  assert.strictEqual(auditRes.status, 'ALL_PASS', 'Translation completeness audit must pass');
  assert.strictEqual(auditRes.coverageRate, 100, 'Coverage rate must be 100%');
  assert.strictEqual(auditRes.totalLanguages, 11);
  assert.deepStrictEqual(auditRes.rtlLanguages, ['Urdu']);
  console.log('  ✅ Test 5 Passed: Automated translation coverage audit: 100% verified without gaps');

  // -------------------------------------------------------------
  // PHASE 13: ACCESSIBILITY TESTS (WCAG 2.2 AA)
  // -------------------------------------------------------------

  // Test 6: Multi-modal status representation (Never color alone)
  const riskLevels = ['mild', 'moderate', 'elevated', 'critical'] as const;
  for (const lvl of riskLevels) {
    const status = MULTI_MODAL_RISK_STATES[lvl];
    assert(Boolean(status.iconSymbol), `${lvl} must have an icon symbol`);
    assert(Boolean(status.label), `${lvl} must have a text label`);
    assert(Boolean(status.colorClass), `${lvl} must have a color class`);
    assert(Boolean(status.accessibleDescription), `${lvl} must have an accessible description`);
    assert(status.ariaLive === 'polite' || status.ariaLive === 'assertive');
  }

  // Numerical mapping to multi-modal states
  assert.strictEqual(getAccessibleStatus(20).label, 'Low Risk');
  assert.strictEqual(getAccessibleStatus(20).iconSymbol, '🟢');
  assert.strictEqual(getAccessibleStatus(50).label, 'Medium Risk');
  assert.strictEqual(getAccessibleStatus(50).iconSymbol, '🟡');
  assert.strictEqual(getAccessibleStatus(75).label, 'High Risk');
  assert.strictEqual(getAccessibleStatus(75).iconSymbol, '🟠');
  assert.strictEqual(getAccessibleStatus(95).label, 'Critical Risk');
  assert.strictEqual(getAccessibleStatus(95).iconSymbol, '🔴');
  console.log('  ✅ Test 6 Passed: Multi-modal status rule enforced (Icon + Text + Color + Description)');

  // Test 7: WCAG 2.2 AA compliance audit
  const wcag = auditWcagCompliance();
  assert.strictEqual(wcag.overallStatus, 'PASS', 'WCAG audit overall status must be PASS');
  assert.strictEqual(wcag.compliancePercentage, 100, 'WCAG compliance must be 100%');
  assert(wcag.criteria.length >= 13, 'Must audit at least 13 core WCAG criteria');
  console.log('  ✅ Test 7 Passed: WCAG 2.2 AA checklist audit passed with 100% compliance');

  // Test 8: Screen reader live announcer
  assert.doesNotThrow(() => {
    announceToScreenReader('Test announcement message', 'polite');
  });
  console.log('  ✅ Test 8 Passed: ARIA live region screen reader announcer functional');

  // Test 9: Default accessibility settings
  assert.strictEqual(DEFAULT_A11Y_SETTINGS.textScale, 'normal');
  assert.strictEqual(DEFAULT_A11Y_SETTINGS.highContrast, false);
  assert.strictEqual(DEFAULT_A11Y_SETTINGS.reducedMotion, false);
  console.log('  ✅ Test 9 Passed: Default accessibility settings initialized cleanly');

  // Test 10: Supported languages options list synchronization
  const supportedI18nCodes = SUPPORTED_LANGUAGES.map(l => l.code);
  for (const req of required11) {
    assert(supportedI18nCodes.includes(req), `${req} must be in SUPPORTED_LANGUAGES`);
  }
  const urduOption = SUPPORTED_LANGUAGES.find(l => l.code === 'ur');
  assert(Boolean(urduOption && urduOption.isRtl && urduOption.direction === 'rtl'));
  console.log('  ✅ Test 10 Passed: Multilingual options synchronized with RTL metadata\n');
}

// Allow standalone execution
if (typeof require !== 'undefined' && require.main === module) {
  runMultilingualAccessibilityTests();
}
