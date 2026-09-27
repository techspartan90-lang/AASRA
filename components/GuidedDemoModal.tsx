'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
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
} from 'lucide-react';

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
    setRole,
    setSelectedCaseId,
  } = useApp();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const DEMO_STEPS = [
    {
      step: 1,
      title: 'Victim Intake & Daily Check-In',
      role: 'Victim View',
      description: 'Switch to the victim perspective for CASE-002 (Intake Baseline: 38/100). The complainant receives an accessible check-in prompt: "How are you feeling today?" with 5 accessible emotions and optional voice note.',
      actionLabel: '1. Switch to Victim Dashboard',
      run: () => {
        setRole('victim');
        setSelectedCaseId('CASE-002');
        onNavigateToView('dashboard');
      },
    },
    {
      step: 2,
      title: 'Victim Submits Elevated Distress Check-In',
      role: 'System AI Engine',
      description: 'The victim records a response noting summons delivery, severe insomnia (1/5), high fear (5/5), and an explicit request for caseworker support.',
      actionLabel: '2. Simulate Distress Check-In Submission',
      run: () => {
        runGuidedDemoStep(2);
      },
    },
    {
      step: 3,
      title: 'AI Screening & Early-Warning Alert Generation',
      role: 'Automated Service',
      description: 'AI engine computes distress score (+33 jump from baseline of 38 to 71), detects sleep & fear signals, flags "High Concern", and creates real-time alert for caseworker.',
      actionLabel: '3. View Alert in Alert Center',
      run: () => {
        setRole('counsellor');
        onNavigateToView('alerts');
      },
    },
    {
      step: 4,
      title: 'Counsellor Reviews AI Explanation Panel',
      role: 'Counsellor View',
      description: 'Counsellor opens Case CASE-002. Reviews "Why was this case flagged?" explanation panel showing baseline deviation (+33 pts) and recommended human assessment.',
      actionLabel: '4. Open Case Profile & AI Explanation',
      run: () => {
        setRole('counsellor');
        setSelectedCaseId('CASE-002');
        onNavigateToView('cases');
      },
    },
    {
      step: 5,
      title: 'Counsellor Schedules Human Intervention',
      role: 'Counsellor / Officer',
      description: 'Under human-in-the-loop safeguards, caseworker authorizes Pre-Trial Anxiety Grounding Tele-Counselling and coordinates protective court escort.',
      actionLabel: '5. Record Human Support Intervention',
      run: () => {
        runGuidedDemoStep(4);
      },
    },
    {
      step: 6,
      title: 'Victim Receives Support Confirmation & Longitudinal Trajectory Updates',
      role: 'Victim / Counsellor View',
      description: 'Victim portal reflects upcoming scheduled counselling date. Subsequent check-in simulates trajectory recovery (71 -> 59 -> 44: "Recent well-being indicators show improvement").',
      actionLabel: '6. Complete Recovery Check-In (71 -> 44)',
      run: () => {
        runGuidedDemoStep(6);
        setRole('victim');
        onNavigateToView('dashboard');
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Play className="w-5 h-5 fill-emerald-600 dark:fill-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Interactive Guided Demonstration Scenario
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                End-to-End Walkthrough of the 10-Step Distress Early-Warning Lifecycle
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {DEMO_STEPS.map((s, idx) => (
            <div
              key={s.step}
              className={`p-4 rounded-2xl border transition ${
                currentStepIndex === idx
                  ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-emerald-600 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                      {s.step}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {s.title}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {s.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-7">
                    {s.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    s.run();
                    onClose();
                  }}
                  className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer min-h-[36px]"
                >
                  <span>Execute Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              resetDemoData();
              setCurrentStepIndex(0);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo to Initial State</span>
          </button>

          <button
            onClick={() => {
              // Execute all steps in sequence
              DEMO_STEPS[1].run(); // Submit check in
              setTimeout(() => {
                DEMO_STEPS[3].run(); // Open caseworker view
                onClose();
              }, 400);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer shadow-xs min-h-[40px]"
          >
            Auto-Run Key Distress Spike Scenario
          </button>
        </div>
      </div>
    </div>
  );
}
