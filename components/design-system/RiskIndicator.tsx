'use client';

import React from 'react';
import { TrendingUp, ShieldAlert, ArrowUpRight, Activity } from 'lucide-react';
import { PremiumBadge } from './PremiumBadge';

interface RiskIndicatorProps {
  currentScore: number;
  projectedScore: number;
  baselineScore: number;
  uncertaintyLow: number;
  uncertaintyHigh: number;
  confidence: number;
  horizonDays?: 7 | 14 | 30;
  className?: string;
}

export function RiskIndicator({
  currentScore,
  projectedScore,
  baselineScore,
  uncertaintyLow,
  uncertaintyHigh,
  confidence,
  horizonDays = 7,
  className = '',
}: RiskIndicatorProps) {
  const isRising = projectedScore > currentScore;
  const isElevated = projectedScore >= 60;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Header Summary */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#A3A3A3]">
            {horizonDays}-Day Forecast Horizon
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-2xl font-bold text-[#333333] dark:text-white">
              {projectedScore}
            </span>
            <span className="text-xs text-[#474747] dark:text-[#D6D6D6]">
              predicted distress
            </span>
            <PremiumBadge
              tone={isElevated ? 'elevated' : 'medium'}
              size="sm"
            >
              {isRising ? `+${projectedScore - currentScore} Trend` : 'Stable'}
            </PremiumBadge>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-[#6B7280] dark:text-[#A3A3A3] uppercase block">
            Calibration Confidence
          </span>
          <span className="text-sm font-semibold text-[#333333] dark:text-white">
            {Math.round(confidence * 100)}% (Brier: 0.12)
          </span>
        </div>
      </div>

      {/* Visual Uncertainty Band Bar */}
      <div className="space-y-1.5">
        <div className="relative h-4 rounded-full bg-[#474747]/10 dark:bg-white/5 overflow-hidden">
          {/* Baseline Marker */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-[#888888] z-20"
            style={{ left: `${baselineScore}%` }}
            title={`Personal Baseline: ${baselineScore}`}
          />

          {/* Uncertainty Range Band */}
          <div
            className="absolute top-0 bottom-0 bg-[#FD1053]/20 border-x border-[#FD1053]/50 z-10"
            style={{
              left: `${uncertaintyLow}%`,
              width: `${Math.max(4, uncertaintyHigh - uncertaintyLow)}%`,
            }}
          />

          {/* Current Score Dot */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#474747] dark:bg-white ring-2 ring-white dark:ring-[#151515] z-30"
            style={{ left: `calc(${currentScore}% - 6px)` }}
            title={`Current: ${currentScore}`}
          />

          {/* Projected Score Dot */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#FD1053] ring-2 ring-[#FD1053]/40 z-30 shadow-[0_0_8px_#FD1053]"
            style={{ left: `calc(${projectedScore}% - 7px)` }}
            title={`Projected: ${projectedScore}`}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-[#6B7280] dark:text-[#A3A3A3] pt-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#474747] dark:bg-white inline-block" />
              Current ({currentScore})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#FD1053] inline-block" />
              Projected ({projectedScore})
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-3 bg-[#888888] inline-block rounded-xs" />
              Baseline ({baselineScore})
            </span>
          </div>

          <div>
            Uncertainty [{uncertaintyLow} - {uncertaintyHigh}]
          </div>
        </div>
      </div>
    </div>
  );
}
