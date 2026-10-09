'use client';

import React, { useState, useMemo } from 'react';
import { Heart, Activity, Users, Sparkles, X, ShieldCheck, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type WellBeingState = 'balanced' | 'checkin' | 'attention' | 'support' | 'improving';

export interface StateConfig {
  id: WellBeingState;
  name: string;
  badge: string;
  statusLabel: string;
  description: string;
  guidance: string;
  pulseRate: number;
  coreGlowColor: string; // Hex
  icon: React.ComponentType<{ className?: string }>;
}

export const WELL_BEING_STATES: Record<WellBeingState, StateConfig> = {
  balanced: {
    id: 'balanced',
    name: 'Balanced Baseline',
    badge: 'Equilibrium',
    statusLabel: 'Personal Well-Being Baseline',
    description: 'Personal emotional baseline is stable and calm. Support channels maintain peaceful equilibrium.',
    guidance: 'Continuous low-frequency calibration preserves emotional continuity without intrusion.',
    pulseRate: 0.7,
    coreGlowColor: '#FD1053',
    icon: Heart,
  },
  checkin: {
    id: 'checkin',
    name: 'Checking In',
    badge: 'Signal Ingest',
    statusLabel: 'Active Check-In Calibrating',
    description: 'Voluntary multi-channel check-in received. Micro-signals gently calibrate personal baseline.',
    guidance: 'All responses are end-to-end encrypted with zero raw voice retention post-analysis.',
    pulseRate: 1.1,
    coreGlowColor: '#FF3B75',
    icon: Activity,
  },
  attention: {
    id: 'attention',
    name: 'Support Attention',
    badge: 'Proactive Alert',
    statusLabel: 'Support Attention Recommended',
    description: 'Subtle distress indicators observed against baseline. Caseworker support pathway alerted.',
    guidance: 'Non-punitive notification flagged for human casework review. AI assists; clinicians decide.',
    pulseRate: 1.5,
    coreGlowColor: '#FD1053',
    icon: Sparkles,
  },
  support: {
    id: 'support',
    name: 'Human Support Connected',
    badge: 'Connected Care',
    statusLabel: 'Welfare Counsellor Connected',
    description: 'Caseworker and trusted care circle actively engaged. Support channels are fully illuminated.',
    guidance: 'Empathetic human intervention initiated with voluntary protective escort protocols.',
    pulseRate: 0.9,
    coreGlowColor: '#10B981',
    icon: Users,
  },
  improving: {
    id: 'improving',
    name: 'Well-Being Improving',
    badge: 'Recovery',
    statusLabel: 'Positive Recovery Trajectory',
    description: 'Signals show steady emotional recovery. The Well-Being Core radiates stabilized warmth.',
    guidance: 'Measurable score reduction over longitudinal observations reflects restorative healing.',
    pulseRate: 0.6,
    coreGlowColor: '#10B981',
    icon: ShieldCheck,
  },
};

interface ThreeDHeroProps {
  className?: string;
  interactive?: boolean;
  initialState?: WellBeingState;
}

export function ThreeDHero({
  className = '',
  interactive = true,
  initialState = 'balanced',
}: ThreeDHeroProps) {
  const [activeState, setActiveState] = useState<WellBeingState>(initialState);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  const activeConfig = useMemo(() => WELL_BEING_STATES[activeState], [activeState]);
  const StateIcon = activeConfig.icon;

  return (
    <div
      className={`relative w-full h-full min-h-[380px] sm:min-h-[440px] flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden select-none bg-gradient-to-b from-black/20 via-black/40 to-black/60 dark:from-white/5 dark:via-black/40 dark:to-black/80 rounded-3xl ${className}`}
    >
      {/* Top HUD: Status Pill & Explanation Trigger */}
      <div className="w-full flex items-center justify-between gap-2 z-10">
        <button
          type="button"
          onClick={() => setShowInfoModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 dark:bg-black/60 hover:bg-white/15 dark:hover:bg-black/80 backdrop-blur-md border border-white/20 dark:border-white/15 text-xs text-white transition cursor-pointer shadow-md"
          title="Explore Mind Protection System Guardrails"
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_#FD1053]"
            style={{ backgroundColor: activeConfig.coreGlowColor }}
          />
          <span className="font-semibold text-xs tracking-wide">{activeConfig.name}</span>
          <Info className="w-3.5 h-3.5 text-white/70 ml-0.5" />
        </button>

        <span className="text-[10px] font-bold tracking-widest text-white/80 uppercase bg-white/10 dark:bg-black/50 px-2.5 py-1 rounded-full border border-white/15 backdrop-blur-md">
          {activeConfig.badge}
        </span>
      </div>

      {/* Centerpiece: Clean Luxury Protective Core (Pure SVG/CSS, 0 Three.js 3D Canvas) */}
      <div className="relative my-auto flex flex-col items-center justify-center p-4">
        {/* Concentric Ambient Ripple Rings */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full flex items-center justify-center">
          {/* Outer Protective Perimeter */}
          <div className="absolute inset-0 rounded-full border border-dashed border-[#FD1053]/30 animate-[spin_60s_linear_infinite]" />
          <div className="absolute -inset-3 rounded-full border border-white/10" />

          {/* Calibrated Shield Halo */}
          <div
            className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-500"
            style={{
              background: `radial-gradient(circle, ${activeConfig.coreGlowColor}20 0%, #151515 80%)`,
              border: `2px solid ${activeConfig.coreGlowColor}60`,
              boxShadow: `0 0 40px ${activeConfig.coreGlowColor}30`,
            }}
          >
            {/* Inner Sacred Emblem */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl transition-transform duration-300 hover:scale-105"
              style={{
                backgroundColor: `${activeConfig.coreGlowColor}25`,
                border: `1.5px solid ${activeConfig.coreGlowColor}`,
              }}
            >
              <StateIcon className="w-10 h-10 text-white" />
            </div>

            {/* Core Telemetry Tag */}
            <span className="mt-2.5 text-[10px] font-extrabold uppercase tracking-widest text-white/90">
              {activeConfig.badge}
            </span>
          </div>
        </div>

        {/* State Label & Description */}
        <div className="text-center mt-3 max-w-xs space-y-1">
          <p className="text-xs font-bold text-white tracking-wide">
            {activeConfig.statusLabel}
          </p>
          <p className="text-[11px] text-[#D6D6D6] dark:text-[#A3A3A3] line-clamp-2 leading-relaxed">
            {activeConfig.description}
          </p>
        </div>
      </div>

      {/* Bottom Interactive State Selector Pills */}
      {interactive && (
        <div className="w-full pt-2 flex items-center justify-center gap-1.5 flex-wrap z-10">
          {(Object.keys(WELL_BEING_STATES) as WellBeingState[]).map(stateKey => {
            const cfg = WELL_BEING_STATES[stateKey];
            const isSelected = activeState === stateKey;
            return (
              <button
                key={stateKey}
                type="button"
                onClick={() => setActiveState(stateKey)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition cursor-pointer border ${
                  isSelected
                    ? 'bg-[#FD1053] text-white border-[#FD1053] shadow-lg shadow-[#FD1053]/35'
                    : 'bg-black/40 text-[#D6D6D6] hover:text-white border-white/10 hover:border-white/20 backdrop-blur-md'
                }`}
              >
                {cfg.badge}
              </button>
            );
          })}
        </div>
      )}

      {/* Modal: Well-Being Core Architectural Explanation */}
      <AnimatePresence>
        {showInfoModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
            onClick={() => setShowInfoModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl bg-[#1E1E1E] border border-white/15 p-6 shadow-2xl text-white space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FD1053]/20 border border-[#FD1053]/40 flex items-center justify-center text-[#FD1053]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Mind Protection Architecture</h3>
                    <p className="text-[10px] text-[#A3A3A3]">SC/ST PoA Act §15A &amp; DPDPA 2023</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInfoModal(false)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#A3A3A3] hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-[#D6D6D6] leading-relaxed">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="font-bold text-white text-[11px] uppercase tracking-wider text-[#FD1053]">
                    Human Decision Gate
                  </span>
                  <p className="text-[11px]">
                    &ldquo;AI assists. Humans decide.&rdquo; The system monitors subtle distress indicators without automating clinical diagnoses or police dispatches.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="font-bold text-white text-[11px] uppercase tracking-wider text-emerald-400">
                    Zero-Retention Voice Guarantee
                  </span>
                  <p className="text-[11px]">
                    All voice responses and acoustic telemetry run with strict memory-only synthesis. Raw voice audio is never stored permanently.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="font-bold text-white text-[11px] uppercase tracking-wider text-amber-400">
                    Statutory Atrocity Protection (§15A)
                  </span>
                  <p className="text-[11px]">
                    Direct statutory linkage to NHAA Helpline 14566, ERSS Emergency 112, and designated Welfare Caseworkers with voluntary escort protocols.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowInfoModal(false)}
                  className="w-full py-2.5 rounded-xl bg-[#FD1053] hover:bg-[#e00b46] text-white font-bold text-xs transition cursor-pointer shadow-md shadow-[#FD1053]/25"
                >
                  Understood &amp; Return
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
