'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { LuxuryButton } from '@/components/design-system/LuxuryButton';
import { PremiumBadge } from '@/components/design-system/PremiumBadge';
import {
  VERIFIED_HELPLINES,
  getEmergencyHelpline,
  getAtrocityVictimHelpline,
  getMentalHealthHelpline,
  QUICK_EXIT_SAFETY_NOTICE,
} from '@/lib/helplines';
import {
  PhoneCall,
  X,
  HeartPulse,
  FileText,
  Clock,
  Shield,
  Phone,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdropVariants, modalDialogVariants } from '@/lib/design-system';

export function EmergencyModal({ onClose }: { onClose: () => void }) {
  const { cases, submitVictimCheckIn } = useApp();
  const currentCase = cases[0];

  const [requestSent, setRequestSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFullDirectory, setShowFullDirectory] = useState(false);

  const emergency112 = getEmergencyHelpline();
  const atrocity14566 = getAtrocityVictimHelpline();
  const telemanas14416 = getMentalHealthHelpline();

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
        notes: 'URGENT CALLBACK REQUESTED via Emergency Directory',
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
          className="relative w-full max-w-2xl rounded-3xl bg-[#FFFFFF] dark:bg-[#1E1E1E] text-[#333333] dark:text-[#FFFFFF] border border-[#D9D9DE] dark:border-white/12 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#D9D9DE] dark:border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FD1053]/10 border border-[#FD1053]/30 flex items-center justify-center text-[#FD1053] shadow-sm">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 id="emergency-modal-title" className="text-base sm:text-lg font-bold text-[#333333] dark:text-white tracking-tight">
                  Verified Emergency &amp; Support Helplines
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-[#D6D6D6]">
                  Official Pan-India Support Services · Categorized by Specific Purpose
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#6B7280] dark:text-[#D6D6D6] hover:text-[#333333] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Exit vs Emergency Dispatch Clarification */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950 dark:text-amber-100 mb-0.5">
                Statutory Safety Distinction:
              </p>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                {QUICK_EXIT_SAFETY_NOTICE}
              </p>
            </div>
          </div>

          {/* Categorized Verified Helpline Cards */}
          <div className="space-y-4">
            {/* 1. Immediate Police / Ambulance Emergency: 112 */}
            <div className="p-5 rounded-2xl border border-[#FD1053]/40 bg-[#FFF5F7] dark:bg-[#252525] space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FD1053] animate-pulse" />
                  <h4 className="text-xs font-bold text-[#333333] dark:text-white uppercase tracking-wider">
                    {emergency112.categoryLabel} (Dial 112)
                  </h4>
                </div>
                <PremiumBadge tone="elevated">24/7 Toll-Free</PremiumBadge>
              </div>
              <p className="text-xs text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                {emergency112.serviceDescription}
              </p>
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <a
                  href={emergency112.telUri}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#FD1053] hover:bg-[#ff2d6a] text-white text-xs font-bold text-center transition shadow-lg shadow-[rgba(253,16,83,0.25)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 fill-white" />
                  <span>Call 112 (National Emergency)</span>
                </a>
                <div className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] sm:max-w-xs">
                  <span>Source: {emergency112.sourceOfVerification}</span>
                </div>
              </div>
            </div>

            {/* 2. Atrocity Victim Support Helpline: 14566 */}
            <div className="p-5 rounded-2xl border border-[#D9D9DE] dark:border-white/10 bg-[#F7F7F8] dark:bg-[#252525] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#FD1053]" />
                  <h4 className="text-xs font-bold text-[#333333] dark:text-white uppercase tracking-wider">
                    {atrocity14566.serviceName} (Dial 14566)
                  </h4>
                </div>
                <PremiumBadge tone="stable">Statutory Helpline</PremiumBadge>
              </div>
              <p className="text-xs text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                {atrocity14566.serviceDescription}
              </p>
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <a
                  href={atrocity14566.telUri}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#333333] hover:bg-[#474747] text-white text-xs font-bold text-center transition flex items-center justify-center gap-2 cursor-pointer border border-[#474747]"
                >
                  <Phone className="w-3.5 h-3.5 fill-white" />
                  <span>Call 14566 (NHAA Atrocity Support)</span>
                </a>
                <div className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] sm:max-w-xs">
                  <span>Source: {atrocity14566.sourceOfVerification} (Verified: {atrocity14566.lastVerificationDate})</span>
                </div>
              </div>
            </div>

            {/* 3. Mental Health & Distress Counselling: 14416 (Tele-MANAS) */}
            <div className="p-5 rounded-2xl border border-[#D9D9DE] dark:border-white/10 bg-[#F7F7F8] dark:bg-[#252525] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-emerald-500" />
                  <h4 className="text-xs font-bold text-[#333333] dark:text-white uppercase tracking-wider">
                    {telemanas14416.serviceName}
                  </h4>
                </div>
                <PremiumBadge tone="neutral">24/7 Psychological Care</PremiumBadge>
              </div>
              <p className="text-xs text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                {telemanas14416.serviceDescription}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <a
                  href={telemanas14416.telUri}
                  className="py-2.5 px-3 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold text-center transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 fill-white" />
                  <span>Dial 14416 (Tele-MANAS)</span>
                </a>
                <a
                  href="tel:18008914416"
                  className="py-2.5 px-3 rounded-xl border border-[#D9D9DE] dark:border-white/15 bg-white dark:bg-[#1E1E1E] text-[#333333] dark:text-white text-xs font-semibold text-center hover:bg-black/5 dark:hover:bg-white/10 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Toll-Free 1800-891-4416</span>
                </a>
              </div>
            </div>

            {/* Tier 4: Assigned Caseworker Priority Callback */}
            <div className="p-5 rounded-2xl border border-[#D9D9DE] dark:border-white/10 bg-[#F7F7F8] dark:bg-[#252525] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-[#FD1053]" />
                  <h4 className="text-xs font-bold text-[#333333] dark:text-white uppercase tracking-wider">
                    Dedicated Assigned Caseworker
                  </h4>
                </div>
                <PremiumBadge tone="stable">Same-Day Priority</PremiumBadge>
              </div>
              <p className="text-xs text-[#474747] dark:text-[#D6D6D6]">
                Assigned Mental Health Professional: <strong className="text-[#333333] dark:text-white">{currentCase?.assignedCounsellor || 'Dr. Priya Nair (Welfare Officer)'}</strong>
              </p>

              {requestSent ? (
                <div className="p-3.5 rounded-xl bg-[#059669]/10 border border-[#059669]/30 text-[#059669] text-xs font-medium flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Urgent callback requested. Caseworker has been alerted securely.</span>
                </div>
              ) : (
                <LuxuryButton
                  onClick={handleUrgentCallback}
                  variant="secondary"
                  isLoading={isSubmitting}
                  className="w-full text-xs font-bold"
                >
                  Request Urgent Callback from My Assigned Caseworker
                </LuxuryButton>
              )}
            </div>

            {/* Toggle Full Directory for Legal Aid, Women & Childline */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowFullDirectory(!showFullDirectory)}
                className="w-full py-2.5 px-4 rounded-xl border border-[#D9D9DE] dark:border-white/10 bg-white dark:bg-[#1E1E1E] text-xs font-semibold text-[#474747] dark:text-[#D6D6D6] hover:text-[#FD1053] transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{showFullDirectory ? 'Hide Additional Helplines' : 'View Full Helplines Directory (Legal Aid, Women 181, Childline 1098)'}</span>
              </button>

              {showFullDirectory && (
                <div className="mt-3 space-y-2.5">
                  {VERIFIED_HELPLINES.filter(h => !['erss-112', 'nhaa-14566', 'telemanas-14416'].includes(h.id)).map(h => (
                    <div
                      key={h.id}
                      className="p-3.5 rounded-xl border border-[#D9D9DE] dark:border-white/10 bg-[#F7F7F8] dark:bg-[#252525] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <strong className="text-[#333333] dark:text-white block">{h.serviceName}</strong>
                        <span className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3]">{h.serviceDescription}</span>
                      </div>
                      <a
                        href={h.telUri}
                        className="py-1.5 px-3 rounded-lg bg-[#FD1053]/10 text-[#FD1053] border border-[#FD1053]/30 font-bold hover:bg-[#FD1053]/20 transition shrink-0"
                      >
                        Dial {h.verifiedPhoneNumber}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
