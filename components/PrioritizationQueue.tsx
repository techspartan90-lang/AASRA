'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { CaseRecord, RiskLevel } from '@/types';
import {
  GlassPanel,
  LuxuryCard,
  LuxuryButton,
  PremiumBadge,
} from '@/components/design-system';
import {
  AlertTriangle,
  ArrowUpRight,
  Clock,
  ShieldAlert,
  Flame,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  Info,
} from 'lucide-react';

interface PrioritizationQueueProps {
  onSelectCase: (caseId: string) => void;
}

export function PrioritizationQueue({ onSelectCase }: PrioritizationQueueProps) {
  const { cases, setSelectedCaseId, canViewCase } = useApp();

  // Filter cases the current user is authorized to view
  const authorizedCases = cases.filter(c => canViewCase(c));

  // Sort cases by urgency
  const prioritizedCases = [...authorizedCases].sort((a, b) => {
    const riskWeight: Record<RiskLevel, number> = { critical: 5, high: 4, elevated: 3, moderate: 2.5, mild: 2, stable: 1 };
    const diff = (riskWeight[b.riskLevel] || 1) - (riskWeight[a.riskLevel] || 1);
    if (diff !== 0) return diff;
    return b.currentScore - a.currentScore;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <section className="rounded-3xl bg-[#333333]/90 dark:bg-[#1E1E1E]/95 border border-[#474747]/30 dark:border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-xl text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FD1053]/15 text-[#FD1053] border border-[#FD1053]/30">
                <Flame className="w-3.5 h-3.5" />
                Triage &amp; Caseload Queue
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Case Prioritization Engine
            </h1>
            <p className="text-xs sm:text-sm text-[#D6D6D6] font-medium mt-1 max-w-2xl leading-relaxed">
              Cases ordered by multi-factor distress indicators, persistent baseline shifts, and missed follow-up signals.
            </p>
          </div>

          {/* Ethical Safeguard Notice */}
          <div className="p-4 rounded-2xl bg-[#474747]/30 border border-white/10 text-xs text-[#D6D6D6] max-w-md flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#FD1053] shrink-0 mt-0.5" />
            <span>
              <strong className="text-white">Ethical Rule:</strong> Prioritization assists caseworker response order. Automated scores do NOT determine eligibility for statutory legal aid, protection, or compensation.
            </span>
          </div>
        </div>
      </section>

      {/* Prioritization List */}
      <div className="space-y-3">
        {prioritizedCases.map((item, idx) => {
          const isTopPriority = idx < 2;
          return (
            <LuxuryCard
              key={item.id}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedCaseId(item.id);
                  onSelectCase(item.id);
                }
              }}
              onClick={() => {
                setSelectedCaseId(item.id);
                onSelectCase(item.id);
              }}
              className={`p-5 transition cursor-pointer group ${
                isTopPriority ? 'border-[#FD1053]/40 bg-[#333333]' : 'hover:border-white/20'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Ranking order badge */}
                  <div
                    className={`w-9 h-9 rounded-2xl font-bold text-xs flex items-center justify-center shrink-0 ${
                      isTopPriority
                        ? 'bg-[#FD1053] text-white shadow-md shadow-[#FD1053]/30'
                        : idx < 4
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-[#474747] text-[#D6D6D6]'
                    }`}
                  >
                    #{idx + 1}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold text-white">
                        {item.id}
                      </span>
                      <span className="text-xs text-[#D6D6D6]">({item.anonymizedCode})</span>
                      <span className="text-xs text-[#D6D6D6]/40">·</span>
                      <span className="text-xs font-semibold text-white">{item.district}</span>
                      <span className="text-xs text-[#D6D6D6]/40">·</span>
                      <span className="text-[11px] uppercase font-bold text-[#FD1053]">
                        {item.stage} Stage
                      </span>
                    </div>

                    {/* Explicit "Priority Reason" */}
                    <div className="flex items-start gap-1.5 pt-0.5">
                      <span className="text-xs font-bold text-white shrink-0">
                        Priority Reason:
                      </span>
                      <p className="text-xs text-[#D6D6D6] font-medium leading-snug">
                        {item.priorityReason}
                      </p>
                    </div>

                    {/* Badges / Factors */}
                    <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                      <span className="font-mono font-bold text-white bg-[#474747]/60 px-2.5 py-0.5 rounded-lg border border-white/10">
                        Distress Score: {item.currentScore}/100
                      </span>
                      {item.missedCheckInsCount > 0 && (
                        <span className="font-bold text-[#FD1053] bg-[#FD1053]/15 px-2.5 py-0.5 rounded-lg border border-[#FD1053]/30">
                          {item.missedCheckInsCount} Missed Periodic Check-Ins
                        </span>
                      )}
                      <span className="font-medium text-[#D6D6D6] bg-[#474747]/60 px-2.5 py-0.5 rounded-lg border border-white/10">
                        Assigned: {item.assignedCounsellor.split(' (')[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex items-center gap-2 shrink-0 md:self-center">
                  <span className="text-xs font-bold text-[#FD1053] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Open Case File</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </LuxuryCard>
          );
        })}
      </div>
    </div>
  );
}
