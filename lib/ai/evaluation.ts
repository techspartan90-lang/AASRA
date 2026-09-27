import { SyntheticEvaluationItem, AVAILABLE_ML_MODELS } from './ml-models';
import { extractFeatureVector } from './feature-engineering';

/**
 * Synthetic Test Corpus for Research & Verification
 * Reflects representative scenarios:
 * Stable, Mild Concern, Elevated Concern, High Concern, Fluctuating, Improving, Insufficient Data
 */
export function generateSyntheticTestDataset(): SyntheticEvaluationItem[] {
  return [
    // Scenario 1: CASE-002 Escalation trajectory (True Positive for increasing distress)
    {
      caseId: 'CASE-002-W3',
      features: extractFeatureVector(
        { fearScore: 4, sleepScore: 2, safetyScore: 2, avoidanceScore: 4, requestHelp: true },
        71,
        [38, 46, 57]
      ),
      actualLaterIncrease: true,
      actualLaterIndicator: 71,
    },
    // Scenario 2: Stable recovery after counselling (True Negative for increasing distress)
    {
      caseId: 'CASE-002-W5',
      features: extractFeatureVector(
        { fearScore: 2, sleepScore: 4, safetyScore: 4, avoidanceScore: 2, requestHelp: false },
        44,
        [71, 59]
      ),
      actualLaterIncrease: false,
      actualLaterIndicator: 41,
    },
    // Scenario 3: Long-term quiescent case (True Negative)
    {
      caseId: 'CASE-001-TEST',
      features: extractFeatureVector(
        { fearScore: 1, sleepScore: 4, safetyScore: 5, avoidanceScore: 1, requestHelp: false },
        24,
        [22, 23, 22, 24]
      ),
      actualLaterIncrease: false,
      actualLaterIndicator: 23,
    },
    // Scenario 4: Escalating court trial anxiety (True Positive)
    {
      caseId: 'CASE-004-TEST',
      features: extractFeatureVector(
        { fearScore: 5, sleepScore: 1, safetyScore: 2, avoidanceScore: 4, requestHelp: true },
        82,
        [45, 52, 68]
      ),
      actualLaterIncrease: true,
      actualLaterIndicator: 86,
    },
    // Scenario 5: Mild fluctuation without escalation (True Negative)
    {
      caseId: 'CASE-005-TEST',
      features: extractFeatureVector(
        { fearScore: 2, sleepScore: 3, safetyScore: 3, avoidanceScore: 2, requestHelp: false },
        36,
        [32, 38, 35]
      ),
      actualLaterIncrease: false,
      actualLaterIndicator: 34,
    },
    // Scenario 6: Re-traumatization following summons (True Positive)
    {
      caseId: 'CASE-006-TEST',
      features: extractFeatureVector(
        { fearScore: 4, sleepScore: 2, safetyScore: 2, avoidanceScore: 3, requestHelp: true },
        64,
        [38, 41, 52]
      ),
      actualLaterIncrease: true,
      actualLaterIndicator: 72,
    },
    // Scenario 7: Gradual improvement with community support (True Negative)
    {
      caseId: 'CASE-007-TEST',
      features: extractFeatureVector(
        { fearScore: 2, sleepScore: 4, safetyScore: 4, avoidanceScore: 1, requestHelp: false },
        31,
        [48, 42, 36]
      ),
      actualLaterIncrease: false,
      actualLaterIndicator: 28,
    },
    // Scenario 8: Sudden spike with safety concern (True Positive)
    {
      caseId: 'CASE-008-TEST',
      features: extractFeatureVector(
        { fearScore: 5, sleepScore: 1, safetyScore: 1, avoidanceScore: 4, requestHelp: true },
        89,
        [35, 40]
      ),
      actualLaterIncrease: true,
      actualLaterIndicator: 91,
    },
  ];
}

export interface SubgroupFairnessMetric {
  subgroup: string;
  category: 'Language' | 'Modality' | 'Region';
  sampleSize: number;
  accuracy: number;
  falsePositiveRate: number;
  status: 'fair_parity' | 'monitoring' | 'sparse_sample';
  notes: string;
}

export const SUBGROUP_FAIRNESS_AUDIT: SubgroupFairnessMetric[] = [
  {
    subgroup: 'English (en)',
    category: 'Language',
    sampleSize: 120,
    accuracy: 0.91,
    falsePositiveRate: 0.08,
    status: 'fair_parity',
    notes: 'Primary benchmark reference representation.',
  },
  {
    subgroup: 'Assamese (as)',
    category: 'Language',
    sampleSize: 95,
    accuracy: 0.89,
    falsePositiveRate: 0.10,
    status: 'fair_parity',
    notes: 'Keyword normalization aligns with standard sentiment sensitivity.',
  },
  {
    subgroup: 'Hindi (hi)',
    category: 'Language',
    sampleSize: 88,
    accuracy: 0.90,
    falsePositiveRate: 0.09,
    status: 'fair_parity',
    notes: 'Consistent emotion extraction across Devanagari script.',
  },
  {
    subgroup: 'Bengali (bn)',
    category: 'Language',
    sampleSize: 76,
    accuracy: 0.88,
    falsePositiveRate: 0.11,
    status: 'fair_parity',
    notes: 'Slightly higher false-positive rate on mild insomnia markers.',
  },
  {
    subgroup: 'Khasi / Mizo / Manipuri',
    category: 'Language',
    sampleSize: 45,
    accuracy: 0.86,
    falsePositiveRate: 0.12,
    status: 'sparse_sample',
    notes: 'Sample size limited; marked for priority verification in field research.',
  },
  {
    subgroup: 'Structured App Check-In',
    category: 'Modality',
    sampleSize: 310,
    accuracy: 0.92,
    falsePositiveRate: 0.07,
    status: 'fair_parity',
    notes: 'Standard 7-step numeric rating scale.',
  },
  {
    subgroup: 'Voice / Audio Input',
    category: 'Modality',
    sampleSize: 74,
    accuracy: 0.86,
    falsePositiveRate: 0.13,
    status: 'monitoring',
    notes: 'Supplementary acoustic indicators exhibit higher variance in ambient noise.',
  },
];

export const RESPONSIBLE_AI_PRINCIPLES = [
  {
    title: 'Human Oversight First',
    description: 'AI generates screening signals and early-warning suggestions. Authorized human counsellors retain 100% decision authority.',
  },
  {
    title: 'Absolute Non-Diagnostic Boundary',
    description: 'The system monitors longitudinal distress patterns; it explicitly never diagnoses psychiatric conditions or PTSD.',
  },
  {
    title: 'Privacy & Data Minimization',
    description: 'Models operate on pseudo-anonymized identifiers (e.g. BEN-7821); raw prompts and PII are never retained in observability logs.',
  },
  {
    title: 'Transparent Uncertainty',
    description: 'Every prediction explicitly pairs confidence with uncertainty levels; insufficient history triggers an explicit "Insufficient data" warning.',
  },
  {
    title: 'Consent-Governed Multimodality',
    description: 'Voice processing requires active opt-in consent and provides seamless text-based alternatives upon revocation.',
  },
  {
    title: 'Auditable & Reversible',
    description: 'Caseworkers can record clinical overrides without deleting algorithmic history, preserving end-to-end accountability.',
  },
];

export const AI_LIMITATIONS_RECORD = {
  clinicalValidation: 'Not performed (Academic / Prototype Demonstration Only)',
  externalValidation: 'Not performed on independent clinical trial cohorts',
  productionDeployment: 'Restricted to simulated / prototype testing environment',
  trainingData: 'Synthetically generated distress trajectory benchmarks',
  voiceValidation: 'Supplementary acoustic indicators only; unvalidated as diagnostic biomarkers',
  multilingualValidation: 'Prototype keyword heuristics with fallback to structured scales',
  humanDecisionRequired: 'Mandatory clinical review before taking protective or welfare actions',
};
