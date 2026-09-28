'use client';

import React, { useState } from 'react';
import { RiskLevel } from '@/types';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Info,
  Sparkles,
  BarChart2,
  TrendingUp,
  History,
  UserCheck,
  HelpCircle,
} from 'lucide-react';
import { PredictionHistoryModal } from './PredictionHistoryModal';
import { HumanOverrideModal } from './HumanOverrideModal';

interface AiExplanationPanelProps {
  caseId: string;
  riskLevel: RiskLevel;
  currentScore: number;
  baselineScore: number;
  signals: string[];
  recommendedNextStep: string;
  onReviewAction?: () => void;
}

export function AiExplanationPanel({
  caseId,
  riskLevel,
  currentScore,
  baselineScore,
  signals,
  recommendedNextStep,
  onReviewAction,
}: AiExplanationPanelProps) {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);

  const delta = currentScore - baselineScore;

  // Interpretable feature importance weights
  const featureWeights = [
    { name: 'Baseline Deviation (+33 pts)', weight: 94, impact: 'High upward shift' },
    { name: 'Trajectory Persistence (3 increases)', weight: 82, impact: 'Consecutive escalation' },
    { name: 'Linear Slope Gradient', weight: 76, impact: 'Positive rate of change' },
    { name: 'Acute Fear Response (4/5)', weight: 68, impact: 'Hypervigilance signal' },
    { name: 'Sleep Impairment (Severe)', weight: 62, impact: 'Somatic disturbance' },
    { name: 'Missed Monitoring Check-ins (1)', weight: 48, impact: 'Avoidance indicator' },
  ];

  const getRiskLabel = (level: RiskLevel) => {
    switch (level) {
      case 'high':
        return 'High Concern';
      case 'elevated':
        return 'Elevated Concern';
      case 'mild':
        return 'Mild Concern';
      case 'stable':
        return 'Stable';
    }
  };

  const getRiskBadgeColor = (level: RiskLevel) => {
    switch (level) {
      case 'high':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900';
      case 'elevated':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      case 'mild':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-900';
      case 'stable':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Why was this case flagged?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Interpretable Machine Learning & Screening Summary · Case {caseId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Current Status:</span>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getRiskBadgeColor(
              riskLevel
            )}`}
          >
            {getRiskLabel(riskLevel)} ({currentScore}/100)
          </span>
        </div>
      </div>

      {/* Trajectory Prediction Banner (Section 8, 9, 10) */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
              Projected Trajectory: Increasing (Next 7–14 days)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-900 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
              Model Confidence: 74%
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
              Uncertainty: Moderate
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
          Target: <em>Likelihood of increased distress indicators in upcoming monitoring window</em> based on persistent upward momentum across 3 consecutive cycles.
        </p>
        <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-medium flex items-center justify-between">
          <span>Model: LogisticRiskModel (v1.2-prototype)</span>
          <span>Feature Set: features-v1</span>
        </div>
      </div>

      {/* Baseline Deviation Overview (Section 4 & 5) */}
      <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Personal Baseline</span>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-200 mt-0.5">{baselineScore}/100</p>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Current Score</span>
          <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{currentScore}/100</p>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Baseline Delta</span>
          <p className={`text-sm font-bold mt-0.5 ${delta > 0 ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
            {delta > 0 ? '+' : ''}{delta} pts
          </p>
        </div>
      </div>

      {/* Feature Importance Visualizer (Section 11) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            <BarChart2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Feature Importance & Prediction Contributors</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Interpretable Weights</span>
        </div>

        <div className="space-y-2">
          {featureWeights.map((fw, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{fw.name}</span>
                <span className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400">{fw.impact}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full"
                  style={{ width: `${fw.weight}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contributing Signals (Section 12: Why is trajectory increasing?) */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Why is the trajectory increasing?
        </p>
        <ul className="space-y-2">
          {signals.map((signal, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200 font-medium p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
              <span>{signal}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Next Step & Human Authority Action */}
      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/60 space-y-2">
        <p className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
          Recommended Human Action
        </p>
        <p className="text-xs font-bold text-emerald-950 dark:text-emerald-100">
          {recommendedNextStep || 'Conduct clinical triage interview to explore acute stressors and review legal security concerns.'}
        </p>
        <p className="text-[11px] text-emerald-800 dark:text-emerald-400 font-medium">
          The algorithm assists with early-warning signals. Authorized caseworkers retain sole authority over all interventions.
        </p>
      </div>

      {/* Model Transparency & Caseworker Tools */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>Prediction History</span>
          </button>

          <button
            onClick={() => setIsOverrideOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-300 dark:border-amber-800 transition cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Record Human Override</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
          AI assists. Humans decide.
        </span>
      </div>

      {/* Ethical Safeguard Notice */}
      <div className="flex items-start gap-2 text-[11px] text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <span>
          <strong>Ethical Safeguard & Non-Diagnostic Principle:</strong> Model output confidence reflects probabilistic trajectory correlation, not clinical certainty or psychological diagnosis. AI outputs are screening aids only.
        </span>
      </div>

      {/* Sub-modals */}
      {isHistoryOpen && (
        <PredictionHistoryModal
          caseId={caseId}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}

      {isOverrideOpen && (
        <HumanOverrideModal
          caseId={caseId}
          currentScore={currentScore}
          currentLevel={getRiskLabel(riskLevel)}
          currentTrajectory="Increasing"
          onClose={() => setIsOverrideOpen(false)}
        />
      )}
    </div>
  );
}
