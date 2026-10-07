'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  DEMO_ACCOUNTS,
  DEMO_SCENARIOS,
  LIFECYCLE_STAGES,
  DEMO_SYNTHETIC_DATA_DISCLOSURE,
  DemoScenario,
} from '@/lib/demo-scenarios';
import { LuxuryButton } from '@/components/design-system/LuxuryButton';
import { PremiumBadge } from '@/components/design-system/PremiumBadge';
import {
  Play,
  RotateCcw,
  ArrowRight,
  Users,
  Activity,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdropVariants, modalDialogVariants } from '@/lib/design-system';

interface GuidedDemoModalProps {
  onClose: () => void;
  onNavigateToView: (view: string) => void;
}

export function GuidedDemoModal({ onClose, onNavigateToView }: GuidedDemoModalProps) {
  const {
    demoStep,
    setDemoStep,
    runGuidedDemoStep,
    resetDemoData,
    role,
    setRole,
    setSelectedCaseId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'scenarios' | 'accounts' | 'lifecycle'>('scenarios');
  const [activeLifecycleIndex, setActiveLifecycleIndex] = useState(0);
  const [runningLifecycle, setRunningLifecycle] = useState(false);

  // Execute a scenario
  const handleRunScenario = (sc: DemoScenario) => {
    setRole(sc.targetRole);
    setSelectedCaseId(sc.targetCaseId);

    if (sc.scenarioNumber === 1) {
      onNavigateToView('dashboard');
    } else if (sc.scenarioNumber === 2) {
      runGuidedDemoStep(2);
      onNavigateToView('distress_score');
    } else if (sc.scenarioNumber === 3) {
      onNavigateToView('cases');
    } else if (sc.scenarioNumber === 4) {
      onNavigateToView('cases');
    } else if (sc.scenarioNumber === 5) {
      onNavigateToView('alerts');
    } else if (sc.scenarioNumber === 6) {
      runGuidedDemoStep(6);
      onNavigateToView('dashboard');
    }

    onClose();
  };

  // Switch demo account
  const handleSwitchAccount = (accountKey: string) => {
    const acc = DEMO_ACCOUNTS[accountKey];
    if (!acc) return;
    setRole(acc.role);
    if (acc.defaultCaseId) {
      setSelectedCaseId(acc.defaultCaseId);
    }
    if (acc.role === 'victim') {
      onNavigateToView('dashboard');
    } else if (acc.role === 'counsellor') {
      onNavigateToView('cases');
    } else if (acc.role === 'district_officer' || acc.role === 'state_admin') {
      onNavigateToView('analytics');
    } else {
      onNavigateToView('prioritization');
    }
    onClose();
  };

  // Run lifecycle step
  const handleRunLifecycleStep = (idx: number) => {
    setActiveLifecycleIndex(idx);
    const stage = LIFECYCLE_STAGES[idx];

    if (stage.stageKey === 'checkin') {
      setRole('victim');
      setSelectedCaseId('CASE-002');
      onNavigateToView('dashboard');
    } else if (stage.stageKey === 'ai_analysis' || stage.stageKey === 'distress_indicator') {
      runGuidedDemoStep(2);
      onNavigateToView('distress_score');
    } else if (stage.stageKey === 'risk_prediction') {
      onNavigateToView('predictive_risk');
    } else if (stage.stageKey === 'alert') {
      setRole('counsellor');
      onNavigateToView('alerts');
    } else if (stage.stageKey === 'counsellor_review' || stage.stageKey === 'intervention') {
      setRole('counsellor');
      setSelectedCaseId('CASE-002');
      runGuidedDemoStep(4);
      onNavigateToView('cases');
    } else if (stage.stageKey === 'resolution') {
      runGuidedDemoStep(6);
      setRole('victim');
      onNavigateToView('dashboard');
    }

    onClose();
  };

  const handleAutoPlayLifecycle = async () => {
    setRunningLifecycle(true);
    for (let i = 0; i < LIFECYCLE_STAGES.length; i++) {
      setActiveLifecycleIndex(i);
      if (i === 1) runGuidedDemoStep(2);
      if (i === 6) runGuidedDemoStep(4);
      if (i === 7) runGuidedDemoStep(6);
      await new Promise(res => setTimeout(res, 600));
    }
    setRunningLifecycle(false);
    setRole('counsellor');
    onNavigateToView('cases');
    onClose();
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
        aria-labelledby="guided-demo-title"
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#151515]/85 backdrop-blur-md p-4 overflow-y-auto"
        onClick={e => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          variants={modalDialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-4xl rounded-3xl bg-[#252525] dark:bg-[#1E1E1E] border border-[rgba(255,255,255,0.12)] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] flex flex-col"
        >
          {/* Top Synthetic Data Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#1E1E1E] border border-[rgba(253,16,83,0.30)] text-xs">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FD1053] text-white font-mono uppercase tracking-wider text-[10px] font-bold">
                {DEMO_SYNTHETIC_DATA_DISCLOSURE.badge}
              </span>
              <p className="text-white font-medium text-[11px] leading-relaxed">
                {DEMO_SYNTHETIC_DATA_DISCLOSURE.notice}
              </p>
            </div>
            <span className="hidden md:inline-block text-[10px] text-[#D6D6D6] font-mono shrink-0">
              {DEMO_SYNTHETIC_DATA_DISCLOSURE.legalFramework}
            </span>
          </div>

          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.10)] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#474747] border border-[rgba(253,16,83,0.35)] text-[#FD1053] flex items-center justify-center shadow-sm">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h3 id="guided-demo-title" className="text-lg font-bold text-white tracking-tight">
                  Interactive Platform Demonstration Suite
                </h3>
                <p className="text-xs text-[#D6D6D6]">
                  Realistic Demonstration Environment with Synthetic Judicial Data
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#D6D6D6] hover:text-white hover:bg-[#333333] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <nav
            aria-label="Demo Explorer Tabs"
            className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.08)] pb-2"
          >
            {[
              { id: 'scenarios', label: '6 Scenarios', icon: <Layers className="w-4 h-4 text-[#FD1053]" /> },
              { id: 'accounts', label: '5 Persona Accounts', icon: <Users className="w-4 h-4 text-[#D6D6D6]" /> },
              { id: 'lifecycle', label: '8-Stage Lifecycle', icon: <Activity className="w-4 h-4 text-white" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer min-h-[38px] ${
                  activeTab === tab.id
                    ? 'bg-[#333333] text-white border border-[rgba(253,16,83,0.30)] shadow-sm'
                    : 'text-[#D6D6D6] hover:text-white hover:bg-[#333333]/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* PANEL 1: SCENARIOS */}
          {activeTab === 'scenarios' && (
            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div className="text-xs text-[#D6D6D6]">
                Select any realistic scenario to immediately populate the application with verified synthetic state and transition to the target view:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {DEMO_SCENARIOS.map(sc => (
                  <div
                    key={sc.id}
                    className="p-4 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#1E1E1E] shadow-sm hover:border-[#FD1053] transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">
                          {sc.title}
                        </span>
                        <PremiumBadge
                          tone={
                            sc.riskStatus === 'Stable'
                              ? 'stable'
                              : sc.riskStatus === 'Elevated'
                              ? 'medium'
                              : 'elevated'
                          }
                        >
                          {sc.riskStatus}
                        </PremiumBadge>
                      </div>

                      <p className="text-xs text-[#D6D6D6] leading-relaxed">
                        {sc.narrative}
                      </p>

                      <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] text-[#888888] font-mono">
                        <span className="bg-[#252525] px-2 py-0.5 rounded">
                          Case: {sc.anonymizedCode}
                        </span>
                        <span className="bg-[#252525] px-2 py-0.5 rounded">
                          Score: {sc.currentScore}/100 ({sc.scoreDeltaFormatted})
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                      <span className="text-[10px] text-[#888888]">
                        Role: <strong className="capitalize text-white">{sc.targetRole.replace('_', ' ')}</strong>
                      </span>
                      <LuxuryButton
                        onClick={() => handleRunScenario(sc)}
                        variant="primary"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        className="text-xs py-1.5 px-3 min-h-[34px]"
                      >
                        Load Scenario
                      </LuxuryButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PANEL 2: PERSONA ACCOUNTS */}
          {activeTab === 'accounts' && (
            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div className="text-xs text-[#D6D6D6]">
                Switch instantly between the 5 persona accounts. Each account has strictly defined access boundaries under Section 15A &amp; DPDPA 2023 least-privilege policies:
              </div>

              <div className="space-y-3">
                {Object.entries(DEMO_ACCOUNTS).map(([key, acc]) => (
                  <div
                    key={key}
                    className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      role === acc.role
                        ? 'border-[#FD1053] bg-[#333333]'
                        : 'border-[rgba(255,255,255,0.08)] bg-[#1E1E1E]'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#474747] border border-[rgba(253,16,83,0.30)] text-white font-bold flex items-center justify-center text-xs shrink-0">
                        {acc.avatarInitials}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-white">
                            {acc.displayName}
                          </h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#252525] text-[#D6D6D6]">
                            {acc.title}
                          </span>
                          {role === acc.role && (
                            <PremiumBadge tone="elevated">Active Persona</PremiumBadge>
                          )}
                        </div>
                        <p className="text-xs text-[#D6D6D6]">
                          {acc.organization} · <span className="font-mono">{acc.syntheticEmail}</span>
                        </p>
                        <p className="text-[11px] text-[#888888] pt-0.5">
                          <strong>Permissions:</strong> {acc.permissionsDescription}
                        </p>
                      </div>
                    </div>

                    <LuxuryButton
                      onClick={() => handleSwitchAccount(key)}
                      disabled={role === acc.role}
                      variant={role === acc.role ? 'secondary' : 'primary'}
                      className="shrink-0 text-xs py-1.5 px-4 min-h-[38px]"
                    >
                      {role === acc.role ? 'Currently Active' : `Switch to ${acc.displayName.split(' ')[0]}`}
                    </LuxuryButton>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PANEL 3: LIFECYCLE */}
          {activeTab === 'lifecycle' && (
            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#D6D6D6]">
                <span>
                  Step-by-step walkthrough of the complete early-warning support lifecycle:
                </span>
                <LuxuryButton
                  onClick={handleAutoPlayLifecycle}
                  disabled={runningLifecycle}
                  variant="primary"
                  leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                  className="text-xs py-1.5 px-3 min-h-[34px] shrink-0"
                >
                  {runningLifecycle ? 'Simulating...' : 'Auto-Play Full 8 Stages'}
                </LuxuryButton>
              </div>

              <div className="space-y-2.5">
                {LIFECYCLE_STAGES.map((st, idx) => (
                  <div
                    key={st.stepNumber}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      activeLifecycleIndex === idx
                        ? 'border-[#FD1053] bg-[#333333]'
                        : 'border-[rgba(255,255,255,0.08)] bg-[#1E1E1E]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#FD1053] text-white font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                          {st.stepNumber}
                        </span>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white">
                              {st.title}
                            </h4>
                            <span className="text-[10px] font-semibold text-[#D6D6D6] bg-[#252525] px-2 py-0.5 rounded">
                              {st.role}
                            </span>
                          </div>
                          <p className="text-xs text-[#D6D6D6]">
                            <strong>Input:</strong> {st.inputDescription}
                          </p>
                          <p className="text-[11px] text-[#888888]">
                            <strong>System:</strong> {st.processingDescription} → <em>{st.outputDescription}</em>
                          </p>
                        </div>
                      </div>

                      <LuxuryButton
                        onClick={() => handleRunLifecycleStep(idx)}
                        variant="secondary"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        className="shrink-0 text-xs py-1 px-3 min-h-[32px]"
                      >
                        Test Step {st.stepNumber}
                      </LuxuryButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.08)] shrink-0">
            <button
              onClick={() => {
                resetDemoData();
                setActiveLifecycleIndex(0);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#D6D6D6] hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Clean Synthetic State</span>
            </button>

            <LuxuryButton
              onClick={onClose}
              variant="secondary"
              className="text-xs py-1.5 px-4 min-h-[36px]"
            >
              Close Demo Window
            </LuxuryButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
