'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { CaseRecord } from '@/types';
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

  // Sort cases by urgency (high first, then elevated, then missed check-ins, then current score)
  const prioritizedCases = [...authorizedCases].sort((a, b) => {
    const riskWeight = { high: 4, elevated: 3, mild: 2, stable: 1 };
    const diff = riskWeight[b.riskLevel] - riskWeight[a.riskLevel];
    if (diff !== 0) return diff;
    return b.currentScore - a.currentScore;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Triage & Caseload Queue
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
            Case Prioritization Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
            Cases ordered by multi-factor distress indicators, persistent shifts, and missed follow-ups
          </p>
        </div>

        {/* Ethical Safeguard Notice */}
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 max-w-md flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>Ethical Rule:</strong> Prioritization assists caseworker response order. Automated scores do NOT determine eligibility for statutory legal aid, protection, or compensation.
          </span>
        </div>
      </div>

      {/* Prioritization List */}
      <div className="space-y-3">
        {prioritizedCases.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedCaseId(item.id);
              onSelectCase(item.id);
            }}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 dark:hover:border-emerald-600 transition cursor-pointer shadow-xs group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Ranking order badge */}
                <div
                  className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                    idx < 2
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 ring-2 ring-rose-500/20'
                      : idx < 4
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  #{idx + 1}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                      {item.id}
                    </span>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">({item.anonymizedCode})</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.district}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-[11px] uppercase font-bold text-indigo-700 dark:text-emerald-400">
                      {item.stage} Stage
                    </span>
                  </div>

                  {/* Explicit "Priority Reason" (Section 17) */}
                  <div className="flex items-start gap-1.5 pt-0.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white shrink-0">
                      Priority Reason:
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-snug">
                      {item.priorityReason}
                    </p>
                  </div>

                  {/* Badges / Factors */}
                  <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      Distress Score: {item.currentScore}/100
                    </span>
                    {item.missedCheckInsCount > 0 && (
                      <span className="font-bold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                        {item.missedCheckInsCount} Missed Periodic Check-Ins
                      </span>
                    )}
                    <span className="font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      Assigned: {item.assignedCounsellor.split(' (')[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2 shrink-0 md:self-center">
                <span className="text-xs font-bold text-indigo-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>Open Profile</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
