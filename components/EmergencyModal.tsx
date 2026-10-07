'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { LuxuryButton } from '@/components/design-system/LuxuryButton';
import { PremiumBadge } from '@/components/design-system/PremiumBadge';
import {
  PhoneCall,
  X,
  HeartPulse,
  FileText,
  Clock,
  Shield,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdropVariants, modalDialogVariants } from '@/lib/design-system';

export function EmergencyModal({ onClose }: { onClose: () => void }) {
  const { cases, submitVictimCheckIn } = useApp();
  const currentCase = cases[0];

  const [requestSent, setRequestSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUrgentCallback = async () => {
    setIsSubmitting(true);
    try {
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
    } finally {
      setIsSubmitting(false);
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
        aria-labelledby="emergency-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#151515]/85 backdrop-blur-md p-4 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          variants={modalDialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-xl rounded-3xl bg-[#252525] dark:bg-[#1E1E1E] border border-[rgba(255,255,255,0.12)] shadow-2xl p-6 sm:p-8 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.10)] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#474747] border border-[rgba(253,16,83,0.35)] flex items-center justify-center text-[#FD1053] shadow-sm">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 id="emergency-modal-title" className="text-base font-bold text-white tracking-tight">
                  Immediate Help &amp; Support Directory
                </h3>
                <p className="text-xs text-[#D6D6D6]">
                  Non-alarming, triaged contact points for safety and wellness
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#D6D6D6] hover:text-white hover:bg-[#333333] transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Triaged Protocol Distinction */}
          <div className="p-3.5 rounded-2xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.08)] text-xs text-[#D6D6D6] leading-relaxed">
            The platform triages support across <strong>Emergency Crisis</strong>, <strong>Assigned Caseworker</strong>, and <strong>Statutory / Legal Aid</strong>.
          </div>

          {/* 3 Tier Options */}
          <div className="space-y-4">
            {/* Tier 1: Emergency Support */}
            <div className="p-5 rounded-2xl border border-[rgba(253,16,83,0.35)] bg-[#1E1E1E] space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[rgba(253,16,83,0.05)] rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FD1053] animate-pulse" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Emergency Support (24/7 Lifeline)
                  </h4>
                </div>
                <PremiumBadge tone="elevated">Immediate</PremiumBadge>
              </div>
              <p className="text-xs text-[#D6D6D6]">
                For imminent physical danger, witness harassment, or acute psychological crisis:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <a
                  href="tel:112"
                  className="p-3 rounded-xl bg-[#FD1053] hover:bg-[#ff2d6a] text-white text-xs font-bold text-center block transition shadow-lg shadow-[rgba(253,16,83,0.25)]"
                >
                  Call 112 (National Emergency)
                </a>
                <a
                  href="tel:14416"
                  className="p-3 rounded-xl bg-[#333333] hover:bg-[#474747] text-white border border-[rgba(255,255,255,0.15)] text-xs font-semibold text-center block transition"
                >
                  Tele-MANAS (14416)
                </a>
              </div>
            </div>

            {/* Tier 2: Routine Caseworker Support */}
            <div className="p-5 rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[#1E1E1E] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-[#FD1053]" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Dedicated Caseworker Contact
                  </h4>
                </div>
                <PremiumBadge tone="stable">Same-Day Priority</PremiumBadge>
              </div>
              <p className="text-xs text-[#D6D6D6]">
                Assigned Mental Health Professional: <strong className="text-white">{currentCase.assignedCounsellor}</strong>
              </p>

              {requestSent ? (
                <div className="p-3 rounded-xl bg-[#333333] border border-[rgba(255,255,255,0.15)] text-white text-xs font-medium flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FD1053]" />
                  <span>Urgent callback requested. Caseworker has been alerted.</span>
                </div>
              ) : (
                <LuxuryButton
                  onClick={handleUrgentCallback}
                  variant="secondary"
                  isLoading={isSubmitting}
                  className="w-full text-xs"
                >
                  Request Urgent Callback from My Caseworker
                </LuxuryButton>
              )}
            </div>

            {/* Tier 3: Administrative / Legal Aid */}
            <div className="p-5 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#1E1E1E] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#888888]" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Administrative &amp; Legal Aid
                  </h4>
                </div>
                <PremiumBadge tone="neutral">Business Hours</PremiumBadge>
              </div>
              <p className="text-xs text-[#D6D6D6]">
                For inquiry regarding victim compensation grants, witness deposition scheduling, or free legal aid:
              </p>
              <div className="flex items-center justify-between text-xs pt-1 text-[#D6D6D6] border-t border-[rgba(255,255,255,0.06)] pt-2.5">
                <span>District Legal Services Authority (DLSA)</span>
                <span className="font-mono text-white font-bold">Helpdesk: 15100</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
