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
import {
  Play,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Heart,
  ShieldAlert,
  Bell,
  Activity,
  X,
  Lock,
  UserCheck,
  TrendingUp,
  AlertCircle,
  FileCheck,
  Calendar,
  Layers,
  Scale,
  Shield,
  HelpCircle,
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
      runGuidedDemoStep(2); // trigger distress spike to 71
      onNavigateToView('distress_score');
    } else if (sc.scenarioNumber === 3) {
      onNavigateToView('cases');
    } else if (sc.scenarioNumber === 4) {
      onNavigateToView('cases');
    } else if (sc.scenarioNumber === 5) {
      onNavigateToView('alerts');
    } else if (sc.scenarioNumber === 6) {
      runGuidedDemoStep(6); // trigger recovery trajectory to 42
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

  // Auto-play entire lifecycle sequence
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto"
        onClick={e => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          variants={modalDialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-4xl rounded-3xl glass-modal-panel border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] flex flex-col"
        >
          {/* Top Statutory Synthetic Data Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-full bg-amber-600 text-white font-extrabold uppercase tracking-wider text-[10px]">
                {DEMO_SYNTHETIC_DATA_DISCLOSURE.badge}
              </span>
              <p className="text-amber-950 dark:text-amber-200 font-semibold text-[11px] leading-relaxed">
                {DEMO_SYNTHETIC_DATA_DISCLOSURE.notice}
              </p>
            </div>
            <span className="hidden md:inline-block text-[10px] text-amber-800 dark:text-amber-300 font-medium shrink-0">
              {DEMO_SYNTHETIC_DATA_DISCLOSURE.legalFramework}
            </span>
          </div>

          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Play className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Interactive Platform Demonstration Suite
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Phase 18: Complete Realistic Demo Environment with Synthetic Data
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs (3 Sub-Panels) */}
          <nav
            aria-label="Demo Explorer Tabs"
            className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2"
          >
            {[
              { id: 'scenarios', label: '6 Realistic Scenarios', icon: <Layers className="w-4 h-4 text-emerald-600" /> },
              { id: 'accounts', label: '5 Demo Accounts', icon: <Users className="w-4 h-4 text-indigo-600" /> },
              { id: 'lifecycle', label: '8-Stage Lifecycle Flow', icon: <Activity className="w-4 h-4 text-rose-600" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer min-h-[38px] ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* =========================================================================
              PANEL 1: 6 REALISTIC SCENARIOS
              ========================================================================= */}
          {activeTab === 'scenarios' && (
            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Select any realistic scenario to immediately populate the application with verified synthetic state, simulate clinical/judicial events, and transition to the target view:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {DEMO_SCENARIOS.map(sc => (
                  <div
                    key={sc.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs hover:border-emerald-500 dark:hover:border-emerald-500 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                          {sc.title}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sc.riskStatus === 'Stable'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : sc.riskStatus === 'Elevated'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {sc.riskStatus}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        {sc.narrative}
                      </p>

                      <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-mono">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          Case: {sc.anonymizedCode}
                        </span>
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          Score: {sc.currentScore}/100 ({sc.scoreDeltaFormatted})
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        Role: <strong className="capitalize text-slate-700 dark:text-slate-300">{sc.targetRole.replace('_', ' ')}</strong>
                      </span>
                      <button
                        onClick={() => handleRunScenario(sc)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
                      >
                        <span>Load Scenario</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              PANEL 2: 5 DEMO ACCOUNTS
              ========================================================================= */}
          {activeTab === 'accounts' && (
            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Switch instantly between the 5 persona accounts. Each account has strictly defined access boundaries under Section 15A & DPDPA 2023 least-privilege policies:
              </div>

              <div className="space-y-3">
                {Object.entries(DEMO_ACCOUNTS).map(([key, acc]) => (
                  <div
                    key={key}
                    className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      role === acc.role
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600 dark:bg-slate-800 text-white font-black flex items-center justify-center text-xs shrink-0">
                        {acc.avatarInitials}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {acc.displayName}
                          </h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            {acc.title}
                          </span>
                          {role === acc.role && (
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded">
                              Active Persona
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {acc.organization} · <span className="font-mono">{acc.syntheticEmail}</span>
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                          <strong>Permissions:</strong> {acc.permissionsDescription}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSwitchAccount(key)}
                      disabled={role === acc.role}
                      className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer min-h-[38px] ${
                        role === acc.role
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      }`}
                    >
                      {role === acc.role ? 'Currently Active' : `Switch to ${acc.displayName.split(' ')[0]}`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              PANEL 3: 8-STAGE END-TO-END LIFECYCLE FLOW
              Check-in -> AI analysis -> Distress indicator -> Risk prediction ->
              Alert -> Counsellor review -> Intervention -> Resolution
              ========================================================================= */}
          {activeTab === 'lifecycle' && (
            <div className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span>
                  Step-by-step walkthrough of the complete early-warning support lifecycle:
                </span>
                <button
                  onClick={handleAutoPlayLifecycle}
                  disabled={runningLifecycle}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-xs shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{runningLifecycle ? 'Simulating...' : 'Auto-Play Full 8 Stages'}</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {LIFECYCLE_STAGES.map((st, idx) => (
                  <div
                    key={st.stepNumber}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      activeLifecycleIndex === idx
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-emerald-600 text-white font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                          {st.stepNumber}
                        </span>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                              {st.title}
                            </h4>
                            <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                              {st.role}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                            <strong>Input:</strong> {st.inputDescription}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            <strong>System:</strong> {st.processingDescription} → <em>{st.outputDescription}</em>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRunLifecycleStep(idx)}
                        className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer min-h-[34px]"
                      >
                        <span>Test Step {st.stepNumber}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
            <button
              onClick={() => {
                resetDemoData();
                setActiveLifecycleIndex(0);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Clean Synthetic State</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              Close Demo Window
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
