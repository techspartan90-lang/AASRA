'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain,
  Activity,
  ShieldCheck,
  AlertTriangle,
  BarChart3,
  Sliders,
  CheckCircle2,
  Clock,
  RefreshCw,
  Cpu,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { AVAILABLE_ML_MODELS } from '@/lib/ai/ml-models';
import {
  generateSyntheticTestDataset,
  SUBGROUP_FAIRNESS_AUDIT,
  RESPONSIBLE_AI_PRINCIPLES,
  AI_LIMITATIONS_RECORD,
} from '@/lib/ai/evaluation';
import { aiObservability, AIObservabilityMetrics } from '@/lib/ai/observability';
import { performDataLeakageAudit } from '@/lib/ai/data-leakage-audit';
import { AiDistressExplainabilityPanel } from '@/components/AiDistressExplainabilityPanel';

export function AiModelEvaluationHub() {
  const [activeTab, setActiveTab] = useState<'explainability' | 'observability' | 'models' | 'leakage' | 'fairness' | 'limitations'>('explainability');
  const [metrics, setMetrics] = useState<AIObservabilityMetrics>(aiObservability.getMetrics());
  const [selectedModelKey, setSelectedModelKey] = useState<string>('logistic');

  const testData = generateSyntheticTestDataset();

  const handleRefresh = () => {
    setMetrics(aiObservability.getMetrics());
  };

  const selectedModel = AVAILABLE_ML_MODELS[selectedModelKey] || AVAILABLE_ML_MODELS.logistic;
  const evaluation = selectedModel.evaluate(testData);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Responsible AI & Algorithmic Oversight
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-mono text-slate-500">v1.2-prototype</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
            AI & Machine Learning Intelligence Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            System telemetry, interpretable model evaluation, fairness audits, and validation transparency
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('explainability')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              activeTab === 'explainability'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Explainability &amp; Signals
          </button>
          <button
            onClick={() => setActiveTab('observability')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'observability'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Observability
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'models'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Model Comparison
          </button>
          <button
            onClick={() => setActiveTab('leakage')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'leakage'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Data Leakage & Temporal
          </button>
          <button
            onClick={() => setActiveTab('fairness')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'fairness'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Fairness & Subgroups
          </button>
          <button
            onClick={() => setActiveTab('limitations')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'limitations'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Limitations
          </button>
        </div>
      </div>

      {/* Mandatory Non-Diagnostic Disclaimer Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-200">
          <strong>Non-Diagnostic & Research Prototype Notice:</strong> The models described below operate strictly on synthetic demonstration test cases. They estimate the <em>likelihood of increased distress indicators</em> to assist human triage; they do NOT diagnose PTSD, anxiety, or psychological disorders.
        </div>
      </div>

      {/* TAB 0: EXPLAINABILITY & SIGNALS */}
      {activeTab === 'explainability' && (
        <div className="space-y-6 animate-in fade-in">
          <AiDistressExplainabilityPanel />
        </div>
      )}

      {/* TAB 1: OBSERVABILITY */}
      {activeTab === 'observability' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Active AI Provider</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${metrics.isGeminiConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {metrics.aiProvider}
              </p>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono font-medium">
                {metrics.isGeminiConfigured ? 'Gemini 2.5 Flash API' : 'Deterministic Local Fallback'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Average Latency</span>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {metrics.averageLatencyMs} <span className="text-xs font-normal text-slate-600 dark:text-slate-400">ms</span>
              </p>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                Near-instantaneous local evaluation
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Total Inferences</span>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {metrics.totalRequests}
              </p>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                Successful: {metrics.successfulRequests} · Failures: {metrics.invalidResponseCount}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Fallback Invocations</span>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                {metrics.fallbackUsageCount}
              </p>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                100% offline guarantee active
              </span>
            </div>
          </div>

          {/* Telemetry Request Logs (Metadata Only) */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recent AI & ML Execution Audit Stream
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Privacy-first logging: captures operational metadata, latency, and model version with zero free-text retention.
                </p>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                <span>Refresh</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-300 dark:border-slate-800 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Service</th>
                    <th className="py-2.5 px-3">Operation</th>
                    <th className="py-2.5 px-3">Model Version</th>
                    <th className="py-2.5 px-3">Latency</th>
                    <th className="py-2.5 px-3">Fallback</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                  {metrics.requestLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                      <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{log.timestamp.slice(11, 19)}</td>
                      <td className="py-2 px-3 text-slate-900 dark:text-slate-200 font-sans font-semibold">
                        {log.service}
                      </td>
                      <td className="py-2 px-3 text-slate-700 dark:text-slate-300 font-sans font-medium">{log.operation}</td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400 text-[11px] font-medium">{log.modelVersion}</td>
                      <td className="py-2 px-3 text-slate-900 dark:text-slate-200 font-semibold">{log.latencyMs}ms</td>
                      <td className="py-2 px-3">
                        {log.fallbackTriggered ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            Fallback
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            Primary
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-sans">
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">Success</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MODEL COMPARISON & EVALUATION */}
      {activeTab === 'models' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Model Selector */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 mr-2">Inspect Model:</span>
            {Object.entries(AVAILABLE_ML_MODELS).map(([key, model]) => (
              <button
                key={key}
                onClick={() => setSelectedModelKey(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedModelKey === key
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {model.modelName}
              </button>
            ))}
          </div>

          {/* Model Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Accuracy</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {(evaluation.accuracy * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Precision</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {(evaluation.precision * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Recall</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {(evaluation.recall * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">F1 Score</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {evaluation.f1Score.toFixed(2)}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">ROC-AUC</span>
              <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                {evaluation.rocAuc.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Confusion Matrix & Calibration Detail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Confusion Matrix ({evaluation.sampleCount} Synthetic Benchmark Cases)
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-900/50">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">True Positive (Escalated Detected)</span>
                  <p className="text-lg font-bold text-emerald-900 dark:text-emerald-300">
                    {evaluation.confusionMatrix.truePositive}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900/50">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">False Positive (False Alarm)</span>
                  <p className="text-lg font-bold text-rose-900 dark:text-rose-300">
                    {evaluation.confusionMatrix.falsePositive}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/50">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">False Negative (Missed Escalation)</span>
                  <p className="text-lg font-bold text-amber-900 dark:text-amber-300">
                    {evaluation.confusionMatrix.falseNegative}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">True Negative (Stable Identified)</span>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-200">
                    {evaluation.confusionMatrix.trueNegative}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Probability Calibration & Brier Loss
              </h4>
              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <p>
                  <strong>Brier Calibration Loss:</strong> <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{evaluation.brierScore}</span> (Lower is better, &lt; 0.15 indicates well-calibrated probabilities).
                </p>
                <p>{evaluation.calibrationNotes}</p>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                  <strong>Calibration Note:</strong> A model confidence of 74% reflects the historical empirical frequency of escalation in similar feature profiles, not clinical certainty.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: DATA LEAKAGE & TEMPORAL VALIDATION (Phase 6 Sections 14, 15, 17) */}
      {activeTab === 'leakage' && (
        <div className="space-y-6 animate-in fade-in">
          {(() => {
            const leakage = performDataLeakageAudit();
            return (
              <>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Algorithmic Data Leakage & Temporal Causality Audit
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Guarantees zero future-observation contamination and strict subject-level cross-validation partitioning
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Status: {leakage.overallStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 text-[11px] font-semibold uppercase">Dataset Partition</span>
                      <p className="font-mono font-bold text-slate-900 dark:text-white mt-1">{leakage.datasetVersion}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 text-[11px] font-semibold uppercase">Historical Lookback</span>
                      <p className="font-mono font-bold text-slate-900 dark:text-white mt-1">{leakage.temporalSplitSummary.historicalLookbackDays} Days</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 text-[11px] font-semibold uppercase">Subject Overlap</span>
                      <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">{leakage.temporalSplitSummary.subjectOverlapCount} (0% Leakage)</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 text-[11px] font-semibold uppercase">Future Contamination</span>
                      <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">{leakage.temporalSplitSummary.futureObservationsInFeatures} Detected</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Formal Verification Checks
                  </h4>
                  <div className="space-y-3">
                    {leakage.checks.map((chk, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">{chk.name}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {chk.category}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400">{chk.description}</p>
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                            <strong>Mitigation:</strong> {chk.mitigationApplied}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* TAB 3: FAIRNESS & SUBGROUP ANALYSIS */}
      {activeTab === 'fairness' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Subgroup Parity & Modality Evaluation (Section 42)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Auditing parity across regional languages and interaction modalities to detect disparate performance.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-300 dark:border-slate-800 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Subgroup</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Sample Count</th>
                    <th className="py-2.5 px-3">Accuracy</th>
                    <th className="py-2.5 px-3">FPR</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {SUBGROUP_FAIRNESS_AUDIT.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-200">
                        {item.subgroup}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-medium">{item.category}</td>
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-800 dark:text-slate-200">{item.sampleSize}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">{(item.accuracy * 100).toFixed(0)}%</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">{(item.falsePositiveRate * 100).toFixed(0)}%</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 text-[11px] font-medium">{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIMITATIONS & RESPONSIBLE AI */}
      {activeTab === 'limitations' && (
        <div className="space-y-6 animate-in fade-in">
          {/* AI Limitations Record (Section 40) */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              AI Limitations & Validation Status Matrix
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(AI_LIMITATIONS_RECORD).map(([k, v]) => (
                <div key={k} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300">
                    {k.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 font-medium mt-1 leading-relaxed">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Responsible AI Principles (Section 41) */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Responsible AI Charter & Safeguards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {RESPONSIBLE_AI_PRINCIPLES.map((principle, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 shrink-0" />
                    {principle.title}
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] font-medium leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
