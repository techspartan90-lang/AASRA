'use client';

import React, { useState } from 'react';
import { RiskLevel } from '@/types';
import { PremiumBadge } from '@/components/design-system/PremiumBadge';
import { LuxuryButton } from '@/components/design-system/LuxuryButton';
import {
  Sparkles,
  BarChart2,
  TrendingUp,
  History,
  UserCheck,
  Info,
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

  const featureWeights = [
    { name: 'Baseline Deviation (+33 pts)', weight: 94, impact: 'High upward shift' },
    { name: 'Trajectory Persistence (3 cycles)', weight: 82, impact: 'Consecutive escalation' },
    { name: 'Linear Slope Gradient', weight: 76, impact: 'Positive rate of change' },
    { name: 'Acute Fear Response (4/5)', weight: 68, impact: 'Hypervigilance signal' },
    { name: 'Sleep Impairment (Severe)', weight: 62, impact: 'Somatic disturbance' },
    { name: 'Missed Monitoring Check-ins (1)', weight: 48, impact: 'Avoidance indicator' },
  ];

  const getRiskTone = (level: RiskLevel): 'elevated' | 'medium' | 'low' | 'stable' => {
    switch (level) {
      case 'critical':
      case 'high':
        return 'elevated';
      case 'elevated':
      case 'moderate':
        return 'medium';
      case 'mild':
        return 'low';
      case 'stable':
      default:
        return 'stable';
    }
  };

  return (
    <div className="rounded-3xl border border-[rgba(255,255,255,0.10)] bg-[#252525] p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#333333] border border-[rgba(253,16,83,0.30)] flex items-center justify-center text-[#FD1053]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Why was this case flagged?
            </h3>
            <p className="text-xs text-[#D6D6D6]">
              Interpretable Machine Learning &amp; Screening Summary · Case {caseId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#888888]">Status:</span>
          <PremiumBadge tone={getRiskTone(riskLevel)}>
            {riskLevel.toUpperCase()} ({currentScore}/100)
          </PremiumBadge>
        </div>
      </div>

      {/* Trajectory Prediction Banner */}
      <div className="p-4 rounded-2xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.08)] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#FD1053]" />
            <span className="text-xs font-bold text-white">
              Projected Trajectory: Increasing (Next 7–14 days)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#333333] text-[#FD1053] border border-[rgba(253,16,83,0.30)]">
              Model Confidence: 74%
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#252525] text-[#D6D6D6] border border-[rgba(255,255,255,0.10)]">
              Uncertainty: ±4.2 pts
            </span>
          </div>
        </div>
        <p className="text-xs text-[#D6D6D6] leading-relaxed">
          Target: <em>Likelihood of increased distress indicators in upcoming monitoring window</em> based on persistent upward momentum across 3 consecutive cycles.
        </p>
        <div className="text-[11px] text-[#888888] font-mono flex items-center justify-between">
          <span>Model: LogisticRiskModel (v1.2-sovereign)</span>
          <span>Feature Set: features-v1</span>
        </div>
      </div>

      {/* Baseline Deviation Overview */}
      <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.08)] text-xs">
        <div>
          <span className="text-[11px] font-semibold text-[#888888]">Personal Baseline</span>
          <p className="text-sm font-bold text-white mt-0.5">{baselineScore}/100</p>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-[#888888]">Current Score</span>
          <p className="text-sm font-bold text-white mt-0.5">{currentScore}/100</p>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-[#888888]">Baseline Delta</span>
          <p className={`text-sm font-mono font-bold mt-0.5 ${delta > 0 ? 'text-[#FD1053]' : 'text-white'}`}>
            {delta > 0 ? '+' : ''}{delta} pts
          </p>
        </div>
      </div>

      {/* Feature Importance Visualizer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white">
            <BarChart2 className="w-3.5 h-3.5 text-[#FD1053]" />
            <span>Feature Importance &amp; Prediction Contributors</span>
          </div>
          <span className="text-[11px] font-semibold text-[#888888]">Interpretable Weights</span>
        </div>

        <div className="space-y-2.5">
          {featureWeights.map((fw, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{fw.name}</span>
                <span className="text-[11px] font-mono text-[#D6D6D6]">{fw.impact}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#1E1E1E] border border-[rgba(255,255,255,0.06)] overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#474747] via-[#FD1053] to-[#FD1053] rounded-full"
                  style={{ width: `${fw.weight}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contributing Signals */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-white uppercase tracking-wider">
          Why is the trajectory increasing?
        </p>
        <ul className="space-y-2">
          {signals.map((signal, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-xs text-[#D6D6D6] p-2.5 rounded-xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.06)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FD1053] mt-1.5 shrink-0" />
              <span>{signal}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Next Step */}
      <div className="p-4 rounded-2xl bg-[#1E1E1E] border border-[rgba(253,16,83,0.30)] space-y-2">
        <p className="text-[11px] font-bold text-[#FD1053] uppercase tracking-wider">
          Recommended Human Action
        </p>
        <p className="text-xs font-bold text-white">
          {recommendedNextStep || 'Conduct clinical triage interview to explore acute stressors and review legal security concerns.'}
        </p>
        <p className="text-[11px] text-[#D6D6D6]">
          The algorithm assists with early-warning signals. Authorized caseworkers retain sole authority over all interventions.
        </p>
      </div>

      {/* Model Transparency & Caseworker Tools */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-2">
          <LuxuryButton
            onClick={() => setIsHistoryOpen(true)}
            variant="secondary"
            leftIcon={<History className="w-3.5 h-3.5" />}
            className="text-xs py-1 px-3 min-h-[34px]"
          >
            Prediction History
          </LuxuryButton>

          <LuxuryButton
            onClick={() => setIsOverrideOpen(true)}
            variant="secondary"
            leftIcon={<UserCheck className="w-3.5 h-3.5 text-[#FD1053]" />}
            className="text-xs py-1 px-3 min-h-[34px]"
          >
            Record Human Override
          </LuxuryButton>
        </div>

        <span className="text-[11px] font-mono text-[#888888]">
          AI assists. Humans decide.
        </span>
      </div>

      {/* Ethical Safeguard Notice */}
      <div className="flex items-start gap-2 text-[11px] text-[#D6D6D6] bg-[#1E1E1E] p-3 rounded-xl border border-[rgba(255,255,255,0.08)]">
        <Info className="w-4 h-4 text-[#FD1053] shrink-0 mt-0.5" />
        <span>
          <strong>Ethical Safeguard &amp; Non-Diagnostic Principle:</strong> Model output confidence reflects probabilistic trajectory correlation, not clinical certainty or psychological diagnosis. AI outputs are screening aids only.
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
          currentLevel={riskLevel}
          currentTrajectory="Increasing"
          onClose={() => setIsOverrideOpen(false)}
        />
      )}
    </div>
  );
}
