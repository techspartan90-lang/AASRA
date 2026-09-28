'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  PhoneCall,
  X,
  ShieldAlert,
  HeartPulse,
  FileText,
  CheckCircle2,
  Clock,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdropVariants, modalDialogVariants } from '@/lib/design-system';

export function EmergencyModal({ onClose }: { onClose: () => void }) {
  const { cases, submitVictimCheckIn } = useApp();
  const currentCase = cases[0];

  const [requestSent, setRequestSent] = useState(false);

  const handleUrgentCallback = async () => {
    await submitVictimCheckIn({
      feelingScore: 1,
      safetyScore: 2,
      sleepScore: 1,
      fearScore: 5,
      avoidanceScore: 4,
      requestHelp: true,
      notes: 'URGENT CALLBACK REQUESTED via Emergency Panel',
    });
    setRequestSent(true);
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
          className="relative w-full max-w-xl rounded-3xl glass-modal-panel border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6"
        >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Immediate Help & Support Directory
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                Non-alarming, triaged contact points for different support needs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clear Distinction Banner (Section 14) */}
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
          The system distinguishes between <strong>Emergency Support</strong> (immediate danger/crisis), <strong>Routine Counselling</strong>, and <strong>Administrative Assistance</strong>.
        </div>

        {/* 3 Tier Options */}
        <div className="space-y-3">
          {/* Tier 1: Emergency Support */}
          <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200 uppercase tracking-wide">
                  Emergency Support (24/7 Lifeline)
                </h4>
              </div>
              <span className="text-[10px] font-semibold text-rose-600 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded">
                Immediate
              </span>
            </div>
            <p className="text-xs text-rose-800 dark:text-rose-300">
              For immediate physical danger, harassment, or acute psychiatric crisis:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="tel:112"
                className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold text-center block transition shadow-xs"
              >
                Call 112 (National Emergency)
              </a>
              <a
                href="tel:14416"
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-xs font-semibold text-center block transition"
              >
                Tele-MANAS (14416)
              </a>
            </div>
          </div>

          {/* Tier 2: Routine Counselling */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-emerald-500" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                  Dedicated Case Worker Contact
                </h4>
              </div>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">Same-Day Response</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              Assigned Caseworker: <strong>{currentCase.assignedCounsellor}</strong>
            </p>

            {requestSent ? (
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-medium text-center">
                ✓ Urgent callback requested. Caseworker has been alerted.
              </div>
            ) : (
              <button
                onClick={handleUrgentCallback}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer min-h-[44px]"
              >
                Request Urgent Callback from My Counsellor
              </button>
            )}
          </div>

          {/* Tier 3: Administrative Assistance */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-500" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                  Administrative / Legal Assistance
                </h4>
              </div>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">Business Hours</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              For inquiry regarding victim compensation grants, witness deposition scheduling, or legal aid:
            </p>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                District Legal Services Authority (DLSA)
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">Helpdesk: 15100</span>
            </div>
          </div>
        </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
