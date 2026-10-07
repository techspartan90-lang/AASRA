'use client';

import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { PremiumBadge } from './PremiumBadge';

interface AnimatedMetricProps {
  score: number; // 0 to 100
  baseline?: number;
  label?: string;
  category?: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH';
  className?: string;
  size?: number; // size in px
}

export function AnimatedMetric({
  score,
  baseline = 38,
  label = 'Composite Distress Indicator',
  category = 'ELEVATED',
  className = '',
  size = 240,
}: AnimatedMetricProps) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (score / 100) * circumference;
  const diffFromBaseline = score - baseline;

  const isElevated = score >= 60;
  const color = isElevated ? '#FD1053' : score >= 40 ? '#F59E0B' : '#10B981';

  return (
    <div className={`flex flex-col items-center text-center p-6 ${className}`}>
      {/* 3D Ring Gauge */}
      <div
        className="relative flex items-center justify-center select-none"
        style={{ width: size, height: size }}
      >
        {/* Ambient Subtle Pulse Behind Ring */}
        <div
          className="absolute inset-4 rounded-full opacity-20 blur-xl pointer-events-none transition-all duration-1000"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 50px ${color}`,
          }}
        />

        <svg
          width={size}
          height={size}
          className="rotate-[-90deg] transform transition-transform"
        >
          {/* Subtle Background Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-[#474747]/15 dark:text-white/10"
            fill="transparent"
          />

          {/* Baseline Tick Mark Indicator */}
          {baseline && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#888888"
              strokeWidth={strokeWidth + 4}
              strokeDasharray={`2 ${circumference}`}
              strokeDashoffset={-(circumference * (baseline / 100))}
              strokeLinecap="round"
              fill="transparent"
              className="opacity-70"
            />
          )}

          {/* Active 3D Animated Progress Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
              filter: `drop-shadow(0 0 8px ${color}80)`,
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <div className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[#333333] dark:text-white">
            {score}
          </div>
          <div className="mt-1">
            <PremiumBadge
              tone={isElevated ? 'elevated' : score >= 40 ? 'medium' : 'low'}
              pulse={isElevated}
            >
              {category}
            </PremiumBadge>
          </div>
          <div className="mt-2 text-[11px] font-semibold text-[#474747] dark:text-[#D6D6D6]">
            {diffFromBaseline >= 0 ? `+${diffFromBaseline}` : diffFromBaseline} from baseline ({baseline})
          </div>
        </div>
      </div>

      {/* Label and Non-Clinical Diagnosis Disclaimer (Mandatory) */}
      <div className="mt-4 max-w-sm space-y-1.5">
        <h4 className="text-sm font-semibold text-[#333333] dark:text-white">
          {label}
        </h4>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#6B7280] dark:text-[#A3A3A3]">
          <ShieldAlert className="w-3.5 h-3.5 text-[#FD1053] shrink-0" />
          <span>AI-assisted screening indicator. Not a clinical diagnosis.</span>
        </div>
      </div>
    </div>
  );
}
