'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { CaseRecord, RiskLevel, CaseStage } from '@/types';
import { LongitudinalDistressChart } from '@/components/LongitudinalDistressChart';
import { AiExplanationPanel } from '@/components/AiExplanationPanel';
import { InterventionModal } from '@/components/InterventionModal';
import { LuxuryButton } from '@/components/design-system/LuxuryButton';
import { PremiumBadge } from '@/components/design-system/PremiumBadge';
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
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdropVariants, modalDialogVariants } from '@/lib/design-system';

interface CaseProfileModalProps {
  caseId: string;
  onClose: () => void;
}

export function CaseProfileModal({ caseId, onClose }: CaseProfileModalProps) {
  const { cases, interventions, canCreateIntervention } = useApp();
  const caseItem = cases.find(c => c.id === caseId) || cases[0];

  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'trend' | 'timeline' | 'interventions'>('overview');

  const caseInterventions = interventions.filter(i => i.caseId === caseItem.id);

  const getStageBadge = (stage: CaseStage) => {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#333333] text-[#D6D6D6] border border-[rgba(255,255,255,0.12)] uppercase tracking-wide">
        {stage} Stage
      </span>
    );
  };

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'high':
        return (
          <PremiumBadge tone="elevated">
            High Concern ({caseItem.currentScore}/100)
          </PremiumBadge>
        );
      case 'elevated':
        return (
          <PremiumBadge tone="medium">
            Elevated Concern ({caseItem.currentScore}/100)
          </PremiumBadge>
        );
      case 'mild':
        return (
          <PremiumBadge tone="low">
            Mild Concern ({caseItem.currentScore}/100)
          </PremiumBadge>
        );
      case 'stable':
        return (
          <PremiumBadge tone="stable">
            Stable ({caseItem.currentScore}/100)
          </PremiumBadge>
        );
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={modalBackdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-profile-title"
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#151515]/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
        onClick={e => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          variants={modalDialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-5xl rounded-3xl bg-[#252525] dark:bg-[#1E1E1E] border border-[rgba(255,255,255,0.12)] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Modal Top Header */}
          <div className="px-6 py-4 bg-[#333333] border-b border-[rgba(255,255,255,0.10)] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#D6D6D6] hover:text-white hover:bg-[#474747] transition"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span id="case-profile-title" className="font-mono text-base font-bold text-white">
                    {caseItem.id}
                  </span>
                  <span className="text-xs text-[#888888]">·</span>
                  <span className="text-xs font-semibold text-[#D6D6D6]">
                    Pseudonym: {caseItem.anonymizedCode}
                  </span>
                  {getStageBadge(caseItem.stage)}
                </div>
                <p className="text-xs text-[#D6D6D6]">
                  {caseItem.district}, {caseItem.state} · Registered {caseItem.registeredDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {getRiskBadge(caseItem.riskLevel)}

              {canCreateIntervention(caseItem) && (
                <LuxuryButton
                  onClick={() => setIsInterventionModalOpen(true)}
                  variant="primary"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  className="hidden sm:flex text-xs py-1.5 px-3 min-h-[36px]"
                >
                  Schedule Intervention
                </LuxuryButton>
              )}

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#D6D6D6] hover:text-white hover:bg-[#474747] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="px-6 border-b border-[rgba(255,255,255,0.08)] bg-[#2a2a2a] flex items-center gap-4 text-xs font-semibold shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 border-b-2 transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-[#FD1053] text-[#FD1053] font-bold'
                  : 'border-transparent text-[#D6D6D6] hover:text-white'
              }`}
            >
              Case Overview &amp; AI Flag
            </button>
            <button
              onClick={() => setActiveTab('trend')}
              className={`py-3 border-b-2 transition cursor-pointer ${
                activeTab === 'trend'
                  ? 'border-[#FD1053] text-[#FD1053] font-bold'
                  : 'border-transparent text-[#D6D6D6] hover:text-white'
              }`}
            >
              Longitudinal Distress Chart
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-3 border-b-2 transition cursor-pointer ${
                activeTab === 'timeline'
                  ? 'border-[#FD1053] text-[#FD1053] font-bold'
                  : 'border-transparent text-[#D6D6D6] hover:text-white'
              }`}
            >
              Lifecycle Timeline
            </button>
            <button
              onClick={() => setActiveTab('interventions')}
              className={`py-3 border-b-2 transition cursor-pointer ${
                activeTab === 'interventions'
                  ? 'border-[#FD1053] text-[#FD1053] font-bold'
                  : 'border-transparent text-[#D6D6D6] hover:text-white'
              }`}
            >
              Intervention History ({caseInterventions.length})
            </button>
          </div>

          {/* Scrollable Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Case Overview Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="p-3.5 rounded-2xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.08)] shadow-sm">
                    <p className="text-[11px] font-semibold text-[#888888]">Assigned Caseworker</p>
                    <p className="text-xs font-bold text-white mt-1 truncate">
                      {caseItem.assignedCounsellor}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.08)] shadow-sm">
                    <p className="text-[11px] font-semibold text-[#888888]">Last Check-in</p>
                    <p className="text-xs font-bold text-white mt-1">
                      {caseItem.lastCheckInDate}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.08)] shadow-sm">
                    <p className="text-[11px] font-semibold text-[#888888]">Next Follow-up</p>
                    <p className="text-xs font-bold text-white mt-1">
                      {caseItem.nextFollowUpDate}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.08)] shadow-sm">
                    <p className="text-[11px] font-semibold text-[#888888]">Baseline Score</p>
                    <p className="text-xs font-bold text-white mt-1">
                      {caseItem.baselineScore}/100 (Intake)
                    </p>
                  </div>
                </div>

                {/* AI Explanation Component */}
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
                  <div className="p-4 rounded-2xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.08)]">
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FD1053]" />
                      Case-Event Temporal Correlation
                    </h5>
                    <p className="text-xs text-[#D6D6D6] mb-3 leading-relaxed">
                      Identifies external legal and judicial milestones correlated with distress fluctuations:
                    </p>
                    <ul className="space-y-2 text-xs">
                      {caseItem.trendHistory
                        .filter(pt => pt.eventNote)
                        .map((pt, idx) => (
                          <li
                            key={idx}
                            className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-[#252525] border border-[rgba(255,255,255,0.06)]"
                          >
                            <div>
                              <span className="font-semibold text-white">{pt.eventNote}</span>
                              <p className="text-[11px] text-[#888888]">{pt.date}</p>
                            </div>
                            <span
                              className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                                pt.score >= 70
                                  ? 'bg-[rgba(253,16,83,0.15)] text-[#FD1053] border border-[rgba(253,16,83,0.30)]'
                                  : pt.score >= 50
                                  ? 'bg-[#333333] text-white'
                                  : 'bg-[#1E1E1E] text-[#D6D6D6]'
                              }`}
                            >
                              Score: {pt.score}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-white" />
                        Individual Baseline Deviation
                      </h5>
                      <p className="text-xs text-[#D6D6D6] mb-3 leading-relaxed">
                        Measures the individual&apos;s current trajectory relative to their personalized intake baseline:
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#252525]">
                          <span className="text-[#D6D6D6]">Intake Baseline</span>
                          <span className="font-mono font-bold text-white">{caseItem.baselineScore}/100</span>
                        </div>
                        <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#252525]">
                          <span className="text-[#D6D6D6]">Current Measured Indicator</span>
                          <span className="font-mono font-bold text-white">{caseItem.currentScore}/100</span>
                        </div>
                        <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#252525]">
                          <span className="text-[#D6D6D6]">Net Deviation</span>
                          <span
                            className={`font-mono font-bold ${
                              caseItem.currentScore - caseItem.baselineScore > 0
                                ? 'text-[#FD1053]'
                                : 'text-[#D6D6D6]'
                            }`}
                          >
                            {caseItem.currentScore - caseItem.baselineScore > 0 ? '+' : ''}
                            {caseItem.currentScore - caseItem.baselineScore} points
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 rounded-xl bg-[#333333] border border-[rgba(255,255,255,0.10)] text-[11px] text-[#D6D6D6]">
                      <strong className="text-white">Caseworker Advisory:</strong> {caseItem.priorityReason}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-6">
                <div className="border-b border-[rgba(255,255,255,0.08)] pb-2">
                  <h4 className="text-sm font-bold text-white">
                    Case Lifecycle Timeline
                  </h4>
                  <p className="text-xs text-[#D6D6D6]">
                    Sequential progress from complaint registration to recovery verification
                  </p>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[rgba(255,255,255,0.12)]">
                  {[
                    { title: 'Case Registration & Baseline Intake', date: caseItem.registeredDate, desc: `Case registered. Initial baseline established at ${caseItem.baselineScore}/100.`, status: 'completed' },
                    { title: 'Periodic Check-In Completed', date: '2026-09-26', desc: 'Complainant reported elevated fear & insomnia around court summons.', status: 'completed' },
                    { title: 'AI Distress Assessment Executed', date: '2026-09-26', desc: `Distress computed at ${caseItem.currentScore}/100 (+${caseItem.currentScore - caseItem.baselineScore} pts baseline delta). Trend: Increasing.`, status: 'completed' },
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
                            ? 'border-[#FD1053] bg-[#FD1053] text-white'
                            : step.status === 'current'
                            ? 'border-white bg-[#333333] text-white ring-4 ring-[#FD1053]/20'
                            : 'border-[rgba(255,255,255,0.20)] bg-[#1E1E1E] text-[#888888]'
                        }`}
                      >
                        {step.status === 'completed' ? '✓' : idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-white">
                            {step.title}
                          </h5>
                          <span className="text-[10px] text-[#888888]">({step.date})</span>
                        </div>
                        <p className="text-xs text-[#D6D6D6] mt-0.5">
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
                    <h4 className="text-sm font-bold text-white">
                      Authorized Intervention Records
                    </h4>
                    <p className="text-xs text-[#D6D6D6]">
                      Interventions require caseworker confirmation and are logged to audit records
                    </p>
                  </div>
                  <LuxuryButton
                    onClick={() => setIsInterventionModalOpen(true)}
                    variant="primary"
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    className="text-xs py-1.5 px-3 min-h-[36px]"
                  >
                    New Intervention
                  </LuxuryButton>
                </div>

                {caseInterventions.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#888888] border border-dashed border-[rgba(255,255,255,0.12)] rounded-2xl">
                    No interventions scheduled yet. Click &apos;New Intervention&apos; to schedule support.
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[rgba(255,255,255,0.10)] overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#1E1E1E] text-[#D6D6D6] font-bold border-b border-[rgba(255,255,255,0.08)] uppercase tracking-wider">
                        <tr>
                          <th className="py-2.5 px-4">Date</th>
                          <th className="py-2.5 px-4">Category</th>
                          <th className="py-2.5 px-4">Title &amp; Details</th>
                          <th className="py-2.5 px-4">Assigned Professional</th>
                          <th className="py-2.5 px-4">Status</th>
                          <th className="py-2.5 px-4">Outcome</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[rgba(255,255,255,0.06)] bg-[#252525]">
                        {caseInterventions.map(item => (
                          <tr key={item.id} className="hover:bg-[#333333]/50">
                            <td className="py-3 px-4 font-mono whitespace-nowrap font-medium text-white">
                              {item.scheduledDate}
                            </td>
                            <td className="py-3 px-4 uppercase font-bold text-[10px] text-[#FD1053] whitespace-nowrap">
                              {item.category}
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-bold text-white">{item.title}</p>
                              <p className="text-[11px] text-[#D6D6D6]">{item.description}</p>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap font-medium text-[#D6D6D6]">
                              {item.assignedProfessional}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  item.status === 'completed'
                                    ? 'bg-[#333333] text-white border border-[rgba(255,255,255,0.15)]'
                                    : 'bg-[rgba(253,16,83,0.12)] text-[#FD1053] border border-[rgba(253,16,83,0.30)]'
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-[11px] text-[#D6D6D6]">
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
          <div className="px-6 py-3.5 bg-[#333333] border-t border-[rgba(255,255,255,0.10)] flex items-center justify-between shrink-0">
            <span className="text-[11px] text-[#D6D6D6]">
              Protected Judicial Record · Encrypted End-to-End
            </span>
            <LuxuryButton
              onClick={onClose}
              variant="secondary"
              className="text-xs py-1.5 px-4 min-h-[36px]"
            >
              Close Profile
            </LuxuryButton>
          </div>
        </motion.div>

        {isInterventionModalOpen && (
          <InterventionModal
            caseId={caseItem.id}
            onClose={() => setIsInterventionModalOpen(false)}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
