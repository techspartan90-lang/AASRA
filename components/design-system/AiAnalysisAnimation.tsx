'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';

const ANALYSIS_STAGES = [
  'Analyzing response',
  'Extracting indicators',
  'Comparing personal baseline',
  'Evaluating trend',
  'Preparing human-review summary',
];

interface AiAnalysisAnimationProps {
  onComplete?: () => void;
  className?: string;
  durationPerStageMs?: number;
}

export function AiAnalysisAnimation({
  onComplete,
  className = '',
  durationPerStageMs = 1200,
}: AiAnalysisAnimationProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    if (currentStageIndex < ANALYSIS_STAGES.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStageIndex(prev => prev + 1);
      }, durationPerStageMs);
      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(() => {
        if (onComplete) onComplete();
      }, durationPerStageMs + 400);
      return () => clearTimeout(finalTimer);
    }
  }, [currentStageIndex, durationPerStageMs, onComplete]);

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      {/* Circular Glass Interface with Orbiting Particles */}
      <div className="relative flex items-center justify-center w-56 h-56 rounded-full glass-modal-panel p-6 shadow-[0_0_40px_rgba(253,16,83,0.15)] border border-[#FD1053]/30">
        {/* Ambient Pulsing Glow */}
        <div className="absolute inset-4 rounded-full bg-[#FD1053]/10 animate-pulse pointer-events-none" />

        {/* Orbiting Particle Ring 1 */}
        <div className="absolute inset-2 rounded-full border border-dashed border-[#474747]/20 dark:border-white/10 animate-[spin_12s_linear_infinite]" />
        
        {/* Orbiting Crimson Particle */}
        <div className="absolute inset-0 animate-[spin_5s_linear_infinite]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FD1053] shadow-[0_0_10px_#FD1053] absolute top-1 left-1/2 -translate-x-1/2" />
        </div>

        {/* Orbiting Secondary White/Charcoal Particle */}
        <div className="absolute inset-0 animate-[spin_8s_linear_infinite_reverse]">
          <div className="w-2 h-2 rounded-full bg-white dark:bg-[#D6D6D6] shadow-[0_0_6px_white] absolute bottom-2 left-1/2 -translate-x-1/2" />
        </div>

        {/* Center Glass Core */}
        <div className="relative flex flex-col items-center justify-center z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#333333] to-[#474747] dark:from-[#252525] dark:to-[#333333] border border-white/15 flex items-center justify-center text-[#FD1053] shadow-md mb-2">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#333333] dark:text-white">
            MANAS AI
          </span>
          <span className="text-[10px] text-[#6B7280] dark:text-[#A3A3A3]">
            Safety Engine
          </span>
        </div>
      </div>

      {/* Stage Progression Display */}
      <div className="mt-6 space-y-2 max-w-sm">
        <div className="h-6 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStageIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-semibold text-[#FD1053] flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>{ANALYSIS_STAGES[currentStageIndex]}...</span>
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {ANALYSIS_STAGES.map((stage, idx) => (
            <div
              key={stage}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentStageIndex
                  ? 'w-6 bg-[#FD1053]'
                  : idx < currentStageIndex
                  ? 'w-2 bg-[#474747] dark:bg-white/40'
                  : 'w-2 bg-[#474747]/20 dark:bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Responsible AI Disclaimer (Mandatory) */}
        <p className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] pt-2">
          AI assists with distress telemetry. Human welfare counsellors review and decide on all care actions.
        </p>
      </div>
    </div>
  );
}
