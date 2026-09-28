'use client';

import React, { useState } from 'react';
import { X, UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/lib/store';

interface HumanOverrideModalProps {
  caseId: string;
  currentScore: number;
  currentLevel: string;
  currentTrajectory: string;
  onClose: () => void;
}

export function HumanOverrideModal({
  caseId,
  currentScore,
  currentLevel,
  currentTrajectory,
  onClose,
}: HumanOverrideModalProps) {
  const { currentUser } = useApp();

  const [overriddenLevel, setOverriddenLevel] = useState<'Stable' | 'Mild concern' | 'Elevated concern' | 'High concern'>('Elevated concern');
  const [overrideReason, setOverrideReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/ai/human-override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          originalLevel: currentLevel,
          originalScore: currentScore,
          originalTrajectory: currentTrajectory,
          overriddenLevel,
          overrideReason,
          reviewerId: currentUser?.id || 'usr-counsellor-002',
          reviewerName: currentUser?.name || 'Dr. Priya Nair',
        }),
      });

      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to submit override:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Record Human Clinical Override
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Case {caseId} · Professional Review Authority
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Clinical Override Documented
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your professional assessment has been saved. The original algorithmic flag is preserved in the audit log for institutional transparency.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-medium">
                <span>Original Algorithmic Assessment:</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">
                  {currentLevel} ({currentScore}/100)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-medium">
                <span>Observed Trajectory:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {currentTrajectory}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Re-evaluated Clinical Priority Level
              </label>
              <select
                value={overriddenLevel}
                onChange={(e) => setOverriddenLevel(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Stable">Stable — No immediate intervention required</option>
                <option value="Mild concern">Mild concern — Routine monitoring</option>
                <option value="Elevated concern">Elevated concern — Caseworker follow-up</option>
                <option value="High concern">High concern — Immediate triage / escort</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Clinical Rationale & Contextual Justification
              </label>
              <textarea
                required
                rows={3}
                placeholder="Explain why the algorithmic score is adjusted (e.g. temporary external bereavement, direct telephonic validation of safety, or mitigated trial stress)..."
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="text-[11px] text-slate-700 dark:text-slate-300 bg-amber-50/60 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50">
              <strong>Institutional Principle:</strong> The human caseworker holds final clinical authority. Automated models assist with screening flags; they cannot override human professional discernment.
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !overrideReason.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 disabled:opacity-50 rounded-xl transition shadow-xs"
              >
                {isSubmitting ? 'Saving...' : 'Authorize Clinical Override'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
