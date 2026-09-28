'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { CaseRecord, RiskLevel, CaseStage } from '@/types';
import { LongitudinalDistressChart } from '@/components/LongitudinalDistressChart';
import { AiExplanationPanel } from '@/components/AiExplanationPanel';
import { InterventionModal } from '@/components/InterventionModal';
import {
  X,
  Calendar,
  MapPin,
  User,
  Clock,
  Shield,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Plus,
  ArrowLeft,
  Activity,
  Sparkles,
} from 'lucide-react';

interface CaseProfileModalProps {
  caseId: string;
  onClose: () => void;
}

export function CaseProfileModal({ caseId, onClose }: CaseProfileModalProps) {
  const { cases, interventions, canCreateIntervention } = useApp();
  const caseItem = cases.find(c => c.id === caseId) || cases[0];

  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'trend' | 'timeline' | 'interventions'>('overview');

  // Filter interventions for this case
  const caseInterventions = interventions.filter(i => i.caseId === caseItem.id);

  const getStageBadge = (stage: CaseStage) => {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-900/60 uppercase tracking-wide">
        {stage} Stage
      </span>
    );
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            High Concern ({caseItem.currentScore}/100)
          </span>
        );
      case 'elevated':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Elevated Concern ({caseItem.currentScore}/100)
          </span>
        );
      case 'mild':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-900">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
            Mild Concern ({caseItem.currentScore}/100)
          </span>
        );
      case 'stable':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Stable ({caseItem.currentScore}/100)
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-750 transition"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                  {caseItem.id}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Pseudonym: {caseItem.anonymizedCode}
                </span>
                {getStageBadge(caseItem.stage)}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {caseItem.district}, {caseItem.state} · Registered {caseItem.registeredDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {getRiskBadge(caseItem.riskLevel)}

            {canCreateIntervention(caseItem) && (
              <button
                onClick={() => setIsInterventionModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer min-h-[36px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule Intervention</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-750 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-4 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-700 dark:border-emerald-500 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Case Overview & AI Flag
          </button>
          <button
            onClick={() => setActiveTab('trend')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeTab === 'trend'
                ? 'border-indigo-600 text-indigo-700 dark:border-emerald-500 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Longitudinal Distress Chart
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-indigo-600 text-indigo-700 dark:border-emerald-500 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Lifecycle Timeline
          </button>
          <button
            onClick={() => setActiveTab('interventions')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              activeTab === 'interventions'
                ? 'border-indigo-600 text-indigo-700 dark:border-emerald-500 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Intervention History ({caseInterventions.length})
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Case Overview Grid (Section 9) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Assigned Caseworker</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mt-1 truncate">
                    {caseItem.assignedCounsellor}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Last Well-Being Check-in</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    {caseItem.lastCheckInDate}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Next Scheduled Follow-up</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    {caseItem.nextFollowUpDate}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Baseline Score</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                    {caseItem.baselineScore}/100 (Intake)
                  </p>
                </div>
              </div>

              {/* AI Explanation Component (Section 10) */}
              <AiExplanationPanel
                caseId={caseItem.id}
                riskLevel={caseItem.riskLevel}
                currentScore={caseItem.currentScore}
                baselineScore={caseItem.baselineScore}
                signals={caseItem.recentSignals}
                recommendedNextStep={
                  caseItem.riskLevel === 'high'
                    ? 'Immediate human counsellor assessment and local protection desk notification recommended within 24 hours'
                    : 'Prioritized tele-counselling follow-up and psycho-legal orientation recommended within 48 hours'
                }
                onReviewAction={() => setIsInterventionModalOpen(true)}
              />
            </div>
          )}

          {activeTab === 'trend' && (
            <div className="space-y-6">
              <LongitudinalDistressChart
                trendHistory={caseItem.trendHistory}
                currentScore={caseItem.currentScore}
                baselineScore={caseItem.baselineScore}
                riskLevel={caseItem.riskLevel}
                recentSignals={caseItem.recentSignals}
                caseId={caseItem.id}
              />

              {/* Case-Event Temporal Correlation & Baseline Inflection Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Case-Event Temporal Correlation
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                    Identifies external legal and investigative milestones temporally correlated with sharp distress indicator fluctuations:
                  </p>
                  <ul className="space-y-2 text-xs">
                    {caseItem.trendHistory
                      .filter(pt => pt.eventNote)
                      .map((pt, idx) => (
                        <li
                          key={idx}
                          className="flex items-start justify-between gap-2 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60"
                        >
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white">{pt.eventNote}</span>
                            <p className="text-[11px] text-slate-500">{pt.date}</p>
                          </div>
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                              pt.score >= 70
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                : pt.score >= 50
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                          >
                            Score: {pt.score}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-500" />
                      Individual Baseline Deviation
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                      Measures the individual&apos;s current trajectory relative to their personalized intake baseline rather than an arbitrary cohort average:
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white dark:bg-slate-800">
                        <span className="text-slate-600 dark:text-slate-300">Intake Baseline</span>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{caseItem.baselineScore}/100</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white dark:bg-slate-800">
                        <span className="text-slate-600 dark:text-slate-300">Current Measured Indicator</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{caseItem.currentScore}/100</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white dark:bg-slate-800">
                        <span className="text-slate-600 dark:text-slate-300">Net Deviation</span>
                        <span
                          className={`font-mono font-bold ${
                            caseItem.currentScore - caseItem.baselineScore > 0
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {caseItem.currentScore - caseItem.baselineScore > 0 ? '+' : ''}
                          {caseItem.currentScore - caseItem.baselineScore} points
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] text-amber-800 dark:text-amber-300">
                    <strong>Caseworker Advisory:</strong> {caseItem.priorityReason}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Case Lifecycle Timeline (Section 9)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sequential progress from complaint registration to current status
                </p>
              </div>

              {/* Lifecycle Stage Steps (Section 25 End-to-End Timeline) */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                {[
                  { title: 'Case Registration & Baseline Intake', date: caseItem.registeredDate, desc: `Case registered. Initial personal baseline established at ${caseItem.baselineScore}/100.`, status: 'completed' },
                  { title: 'Periodic Check-In Completed', date: '2026-09-26', desc: 'Complainant reported elevated fear & insomnia around court hearing summons.', status: 'completed' },
                  { title: 'AI Distress Assessment Executed', date: '2026-09-26', desc: `Distress indicator computed at ${caseItem.currentScore}/100 (+${caseItem.currentScore - caseItem.baselineScore} pts baseline deviation). Trend: Increasing.`, status: 'completed' },
                  { title: 'Explainable Alert Generated', date: '2026-09-26', desc: 'High concern early-warning alert dispatched to assigned counsellor for triage.', status: 'completed' },
                  { title: 'Counsellor Review & Human Assessment', date: '2026-09-26', desc: 'Human assessment completed. Intervention ordered under human-in-the-loop protocol.', status: 'completed' },
                  { title: 'Support Intervention & Court Escort Scheduled', date: '2026-09-27', desc: 'Emergency trauma grounding and protective police liaison accompaniment arranged.', status: 'current' },
                  { title: 'Follow-Up & Well-Being Reassessment', date: '2026-10-02', desc: 'Scheduled follow-up check-in to monitor trajectory recovery (71 -> 59 -> 44).', status: 'pending' },
                  { title: 'Rehabilitation & Statutory Welfare Verification', date: 'Upcoming', desc: 'Longitudinal monitoring through trial conclusion, treasury compensation, and rehabilitation.', status: 'pending' },
                ].map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div
                      className={`absolute -left-6 top-1 w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 ${
                        step.status === 'completed'
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : step.status === 'current'
                          ? 'border-amber-500 bg-amber-500 text-white ring-4 ring-amber-500/20'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-400'
                      }`}
                    >
                      {step.status === 'completed' ? '✓' : idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                          {step.title}
                        </h5>
                        <span className="text-[10px] text-slate-400">({step.date})</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'interventions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Authorized Intervention Records
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Interventions require authorized caseworker confirmation and are logged to audit records
                  </p>
                </div>
                <button
                  onClick={() => setIsInterventionModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Intervention</span>
                </button>
              </div>

              {caseInterventions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed rounded-2xl">
                  No interventions scheduled yet. Click &apos;New Intervention&apos; to schedule support.
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-300 dark:border-slate-800 uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-4">Date</th>
                        <th className="py-2.5 px-4">Category</th>
                        <th className="py-2.5 px-4">Title & Details</th>
                        <th className="py-2.5 px-4">Assigned Professional</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4">Outcome</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {caseInterventions.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                          <td className="py-3 px-4 font-mono whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">
                            {item.scheduledDate}
                          </td>
                          <td className="py-3 px-4 uppercase font-bold text-[10px] text-indigo-700 dark:text-emerald-400 whitespace-nowrap">
                            {item.category}
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-slate-900 dark:text-white">{item.title}</p>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">{item.description}</p>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">
                            {item.assignedProfessional}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                item.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                  : 'bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                            {item.outcomeNotes || 'Pending'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Protected Judicial Record · Encrypted End-to-End
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-semibold cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>

      {isInterventionModalOpen && (
        <InterventionModal
          caseId={caseItem.id}
          onClose={() => setIsInterventionModalOpen(false)}
        />
      )}
    </div>
  );
}
