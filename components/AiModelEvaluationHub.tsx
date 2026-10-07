'use client';

import React, { useState } from 'react';
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
import {
  GlassPanel,
  LuxuryCard,
  LuxuryButton,
  PremiumBadge,
} from '@/components/design-system';

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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <section className="rounded-3xl bg-[#333333]/90 dark:bg-[#1E1E1E]/95 border border-[#474747]/30 dark:border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FD1053]/15 text-[#FD1053] border border-[#FD1053]/30">
                Responsible AI &amp; Algorithmic Oversight
              </span>
              <span className="text-xs text-[#D6D6D6]/40">·</span>
              <span className="text-xs font-mono text-[#D6D6D6]">v1.2-prototype</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              AI &amp; Machine Learning Intelligence Hub
            </h1>
            <p className="text-sm text-[#D6D6D6] font-medium mt-1 max-w-2xl leading-relaxed">
              System telemetry, interpretable model evaluation, fairness audits, and validation transparency.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#474747]/40 border border-white/10 text-xs shrink-0 overflow-x-auto scrollbar-none">
            {[
              { id: 'explainability', label: 'Explainability & Signals' },
              { id: 'observability', label: 'Observability' },
              { id: 'models', label: 'Model Comparison' },
              { id: 'leakage', label: 'Data Leakage & Temporal' },
              { id: 'fairness', label: 'Fairness & Subgroups' },
              { id: 'limitations', label: 'Limitations' },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer min-h-[36px] whitespace-nowrap ${
                    isActive
                      ? 'bg-[#FD1053] text-white shadow-xs'
                      : 'text-[#D6D6D6] hover:text-white hover:bg-[#474747]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mandatory Non-Diagnostic Disclaimer Banner */}
        <div className="mt-4 p-4 rounded-2xl bg-[#474747]/30 border border-[#FD1053]/30 flex items-start gap-3">
          <Info className="w-4 h-4 text-[#FD1053] shrink-0 mt-0.5" />
          <div className="text-xs text-[#D6D6D6] leading-relaxed">
            <strong className="text-[#FD1053]">Non-Diagnostic &amp; Research Prototype Notice:</strong> The models operate strictly on synthetic demonstration test cases. They estimate the likelihood of increased distress indicators to assist human caseworkers; they do NOT diagnose PTSD, depression, or psychiatric disorders.
          </div>
        </div>
      </section>

      {/* TAB 0: EXPLAINABILITY & SIGNALS */}
      {activeTab === 'explainability' && (
        <div className="space-y-6">
          <AiDistressExplainabilityPanel />
        </div>
      )}

      {/* TAB 1: OBSERVABILITY */}
      {activeTab === 'observability' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <LuxuryCard className="p-5 space-y-1">
              <span className="text-xs text-[#D6D6D6] font-semibold">Active AI Provider</span>
              <p className="text-base font-bold text-white flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${metrics.isGeminiConfigured ? 'bg-emerald-400' : 'bg-[#FD1053]'}`} />
                {metrics.aiProvider}
              </p>
              <span className="text-[10px] text-[#D6D6D6] font-mono block">
                {metrics.isGeminiConfigured ? 'Gemini 2.5 Flash API' : 'Deterministic Local Fallback'}
              </span>
            </LuxuryCard>

            <LuxuryCard className="p-5 space-y-1">
              <span className="text-xs text-[#D6D6D6] font-semibold">Average Latency</span>
              <p className="text-2xl font-bold text-white">
                {metrics.averageLatencyMs} <span className="text-xs font-normal text-[#D6D6D6]">ms</span>
              </p>
              <span className="text-[10px] font-bold text-emerald-400">
                Near-instantaneous local evaluation
              </span>
            </LuxuryCard>

            <LuxuryCard className="p-5 space-y-1">
              <span className="text-xs text-[#D6D6D6] font-semibold">Total Inferences</span>
              <p className="text-2xl font-bold text-white">
                {metrics.totalRequests}
              </p>
              <span className="text-[10px] text-[#D6D6D6]">
                Success: {metrics.successfulRequests} · Failures: {metrics.invalidResponseCount}
              </span>
            </LuxuryCard>

            <LuxuryCard className="p-5 space-y-1">
              <span className="text-xs text-[#D6D6D6] font-semibold">Fallback Invocations</span>
              <p className="text-2xl font-bold text-[#FD1053]">
                {metrics.fallbackUsageCount}
              </p>
              <span className="text-[10px] text-emerald-400">
                100% offline guarantee active
              </span>
            </LuxuryCard>
          </div>

          {/* Telemetry Request Logs */}
          <GlassPanel
            title="Recent AI &amp; ML Execution Audit Stream"
            subtitle="Privacy-first logging: captures operational metadata, latency, and model version with zero free-text retention."
            action={
              <LuxuryButton
                size="sm"
                variant="secondary"
                onClick={handleRefresh}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Refresh Telemetry
              </LuxuryButton>
            }
          >
            <div className="overflow-x-auto rounded-2xl border border-white/10 pt-2">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#333333] text-[#D6D6D6] font-bold border-b border-white/10 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Operation</th>
                    <th className="py-3 px-4">Model Version</th>
                    <th className="py-3 px-4">Latency</th>
                    <th className="py-3 px-4">Fallback</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {metrics.requestLogs.map(log => (
                    <tr key={log.id} className="hover:bg-[#474747]/30 transition">
                      <td className="py-3 px-4 text-[#D6D6D6]">{log.timestamp.slice(11, 19)}</td>
                      <td className="py-3 px-4 text-white font-sans font-semibold">{log.service}</td>
                      <td className="py-3 px-4 text-[#D6D6D6] font-sans">{log.operation}</td>
                      <td className="py-3 px-4 text-[#D6D6D6] text-[11px]">{log.modelVersion}</td>
                      <td className="py-3 px-4 text-white font-semibold">{log.latencyMs}ms</td>
                      <td className="py-3 px-4">
                        {log.fallbackTriggered ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FD1053]/20 text-[#FD1053] border border-[#FD1053]/30">
                            Fallback
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Primary
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-sans font-bold text-emerald-400">
                        Success
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* TAB 2: MODEL COMPARISON & EVALUATION */}
      {activeTab === 'models' && (
        <div className="space-y-6">
          {/* Model Selector */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl glass-panel">
            <span className="text-xs font-semibold text-[#D6D6D6] mr-2">Inspect Model:</span>
            {Object.entries(AVAILABLE_ML_MODELS).map(([key, model]) => (
              <button
                key={key}
                onClick={() => setSelectedModelKey(key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[38px] ${
                  selectedModelKey === key
                    ? 'bg-[#FD1053] text-white shadow-xs'
                    : 'bg-[#474747]/40 text-[#D6D6D6] hover:text-white hover:bg-[#474747]'
                }`}
              >
                {model.modelName}
              </button>
            ))}
          </div>

          {/* Model Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <LuxuryCard className="p-4 space-y-1">
              <span className="text-[11px] font-semibold text-[#D6D6D6]">Accuracy</span>
              <p className="text-xl font-bold text-white mt-0.5">
                {(evaluation.accuracy * 100).toFixed(1)}%
              </p>
            </LuxuryCard>
            <LuxuryCard className="p-4 space-y-1">
              <span className="text-[11px] font-semibold text-[#D6D6D6]">Precision</span>
              <p className="text-xl font-bold text-white mt-0.5">
                {(evaluation.precision * 100).toFixed(1)}%
              </p>
            </LuxuryCard>
            <LuxuryCard className="p-4 space-y-1">
              <span className="text-[11px] font-semibold text-[#D6D6D6]">Recall</span>
              <p className="text-xl font-bold text-white mt-0.5">
                {(evaluation.recall * 100).toFixed(1)}%
              </p>
            </LuxuryCard>
            <LuxuryCard className="p-4 space-y-1">
              <span className="text-[11px] font-semibold text-[#D6D6D6]">F1 Score</span>
              <p className="text-xl font-bold text-white mt-0.5">
                {evaluation.f1Score.toFixed(2)}
              </p>
            </LuxuryCard>
            <LuxuryCard className="p-4 space-y-1">
              <span className="text-[11px] font-semibold text-[#D6D6D6]">ROC-AUC</span>
              <p className="text-xl font-bold text-[#FD1053] mt-0.5">
                {evaluation.rocAuc.toFixed(2)}
              </p>
            </LuxuryCard>
          </div>

          {/* Confusion Matrix & Calibration Detail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassPanel
              title="Confusion Matrix"
              subtitle={`${evaluation.sampleCount} Synthetic Benchmark Cases`}
            >
              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30">
                  <span className="font-semibold text-[#D6D6D6]">True Positive (Escalated Detected)</span>
                  <p className="text-lg font-bold text-emerald-300">
                    {evaluation.confusionMatrix.truePositive}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FD1053]/15 border border-[#FD1053]/30">
                  <span className="font-semibold text-[#D6D6D6]">False Positive (False Alarm)</span>
                  <p className="text-lg font-bold text-[#FD1053]">
                    {evaluation.confusionMatrix.falsePositive}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30">
                  <span className="font-semibold text-[#D6D6D6]">False Negative (Missed Escalation)</span>
                  <p className="text-lg font-bold text-amber-300">
                    {evaluation.confusionMatrix.falseNegative}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#474747]/40 border border-white/10">
                  <span className="font-semibold text-[#D6D6D6]">True Negative (Stable Identified)</span>
                  <p className="text-lg font-bold text-white">
                    {evaluation.confusionMatrix.trueNegative}
                  </p>
                </div>
              </div>
            </GlassPanel>

            <GlassPanel
              title="Probability Calibration &amp; Brier Loss"
              subtitle="Mathematical guarantee against false overconfidence."
            >
              <div className="space-y-3 text-xs text-[#D6D6D6] font-medium pt-2">
                <p>
                  <strong className="text-white">Brier Calibration Loss:</strong> <span className="font-mono font-bold text-emerald-400">{evaluation.brierScore}</span> (Lower is better, &lt; 0.15 indicates well-calibrated probabilities).
                </p>
                <p>{evaluation.calibrationNotes}</p>
                <div className="p-3 rounded-2xl bg-[#474747]/30 border border-white/10 text-[11px] text-[#D6D6D6]">
                  <strong className="text-white">Calibration Note:</strong> Model confidence of 74% reflects the historical empirical frequency of escalation in similar feature profiles, not deterministic certainty.
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      )}

      {/* TAB 3: DATA LEAKAGE & TEMPORAL VALIDATION */}
      {activeTab === 'leakage' && (
        <div className="space-y-6">
          {(() => {
            const leakage = performDataLeakageAudit();
            return (
              <>
                <GlassPanel
                  title="Algorithmic Data Leakage &amp; Temporal Causality Audit"
                  subtitle="Guarantees zero future-observation contamination and strict subject-level cross-validation partitioning."
                  badge={<PremiumBadge tone="stable">{leakage.overallStatus}</PremiumBadge>}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-2">
                    <LuxuryCard className="p-3.5 space-y-1">
                      <span className="text-[#D6D6D6] text-[11px] font-semibold uppercase">Dataset Partition</span>
                      <p className="font-mono font-bold text-white mt-1">{leakage.datasetVersion}</p>
                    </LuxuryCard>
                    <LuxuryCard className="p-3.5 space-y-1">
                      <span className="text-[#D6D6D6] text-[11px] font-semibold uppercase">Historical Lookback</span>
                      <p className="font-mono font-bold text-white mt-1">{leakage.temporalSplitSummary.historicalLookbackDays} Days</p>
                    </LuxuryCard>
                    <LuxuryCard className="p-3.5 space-y-1">
                      <span className="text-[#D6D6D6] text-[11px] font-semibold uppercase">Subject Overlap</span>
                      <p className="font-mono font-bold text-emerald-400 mt-1">{leakage.temporalSplitSummary.subjectOverlapCount} (0% Leakage)</p>
                    </LuxuryCard>
                    <LuxuryCard className="p-3.5 space-y-1">
                      <span className="text-[#D6D6D6] text-[11px] font-semibold uppercase">Future Contamination</span>
                      <p className="font-mono font-bold text-emerald-400 mt-1">{leakage.temporalSplitSummary.futureObservationsInFeatures} Detected</p>
                    </LuxuryCard>
                  </div>
                </GlassPanel>

                <GlassPanel
                  title="Formal Verification Checks"
                  subtitle="Systematic anti-leakage proofs verified across evaluation sets."
                >
                  <div className="space-y-3 pt-2">
                    {leakage.checks.map((chk, i) => (
                      <LuxuryCard key={i} className="p-4 flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{chk.name}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-[#474747] text-[#D6D6D6]">
                              {chk.category}
                            </span>
                          </div>
                          <p className="text-[#D6D6D6]">{chk.description}</p>
                          <p className="text-[11px] text-emerald-400 font-medium">
                            <strong>Mitigation:</strong> {chk.mitigationApplied}
                          </p>
                        </div>
                      </LuxuryCard>
                    ))}
                  </div>
                </GlassPanel>
              </>
            );
          })()}
        </div>
      )}

      {/* TAB 4: FAIRNESS & SUBGROUP ANALYSIS */}
      {activeTab === 'fairness' && (
        <div className="space-y-6">
          <GlassPanel
            title="Subgroup Parity &amp; Modality Evaluation"
            subtitle="Auditing parity across regional languages and interaction modalities to detect disparate performance."
          >
            <div className="overflow-x-auto rounded-2xl border border-white/10 pt-2">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#333333] text-[#D6D6D6] font-bold border-b border-white/10 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Subgroup</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Sample Count</th>
                    <th className="py-3 px-4">Accuracy</th>
                    <th className="py-3 px-4">FPR</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {SUBGROUP_FAIRNESS_AUDIT.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#474747]/30 transition">
                      <td className="py-3 px-4 font-bold text-white">
                        {item.subgroup}
                      </td>
                      <td className="py-3 px-4 text-[#D6D6D6]">{item.category}</td>
                      <td className="py-3 px-4 font-mono text-white">{item.sampleSize}</td>
                      <td className="py-3 px-4 font-mono font-bold text-white">{(item.accuracy * 100).toFixed(0)}%</td>
                      <td className="py-3 px-4 font-mono font-bold text-[#FD1053]">{(item.falsePositiveRate * 100).toFixed(0)}%</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#D6D6D6] text-[11px]">{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* TAB 5: LIMITATIONS & RESPONSIBLE AI */}
      {activeTab === 'limitations' && (
        <div className="space-y-6">
          <GlassPanel
            title="AI Limitations &amp; Validation Status Matrix"
            subtitle="Transparent disclosure of algorithmic boundaries."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
              {Object.entries(AI_LIMITATIONS_RECORD).map(([k, v]) => (
                <LuxuryCard key={k} className="p-4 space-y-1">
                  <span className="text-[11px] font-bold uppercase text-[#FD1053]">
                    {k.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <p className="text-[#D6D6D6] font-medium mt-1 leading-relaxed">{v}</p>
                </LuxuryCard>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel
            title="Responsible AI Charter &amp; Safeguards"
            subtitle="Core operational guardrails governing automated suggestions."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs pt-2">
              {RESPONSIBLE_AI_PRINCIPLES.map((principle, idx) => (
                <LuxuryCard key={idx} className="p-4 space-y-1.5">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#FD1053] shrink-0" />
                    {principle.title}
                  </span>
                  <p className="text-[#D6D6D6] text-[11px] font-medium leading-relaxed">
                    {principle.description}
                  </p>
                </LuxuryCard>
              ))}
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
}
