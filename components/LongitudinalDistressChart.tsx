'use client';

import React, { useState } from 'react';
import { TrendPoint, RiskLevel } from '@/types';
import { Info, HelpCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { chartTransitionVariants } from '@/lib/design-system';

interface LongitudinalDistressChartProps {
  trendHistory: TrendPoint[];
  currentScore: number;
  baselineScore: number;
  riskLevel: RiskLevel;
  recentSignals: string[];
  caseId: string;
}

export function LongitudinalDistressChart({
  trendHistory,
  currentScore,
  baselineScore,
  riskLevel,
  recentSignals,
  caseId,
}: LongitudinalDistressChartProps) {
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D' | '6M'>('30D');
  const [activePoint, setActivePoint] = useState<TrendPoint | null>(null);
  const [showExplanation, setShowExplanation] = useState(true);

  // Filter or extend trend points based on timeframe
  const points = [...trendHistory];

  // SVG dimensions
  const width = 640;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;

  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  // Y-axis: 0 to 100
  const getY = (val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    return height - paddingY - (clamped / 100) * chartH;
  };

  // X-axis: space evenly
  const getX = (idx: number, total: number) => {
    if (total <= 1) return paddingX + chartW / 2;
    return paddingX + (idx / (total - 1)) * chartW;
  };

  // Generate SVG path line
  const pathD = points.reduce((acc, pt, idx) => {
    const x = getX(idx, points.length);
    const y = getY(pt.score);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Shaded area
  const areaD =
    points.length > 0
      ? `${pathD} L ${getX(points.length - 1, points.length)} ${height - paddingY} L ${getX(
          0,
          points.length
        )} ${height - paddingY} Z`
      : '';

  const baselineY = getY(baselineScore);

  return (
    <div className="space-y-4">
      {/* Top Controls & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Longitudinal Distress Trend
            </h4>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-slate-200 border border-indigo-200 dark:border-slate-700">
              Score: {currentScore}/100
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
            AI-assisted screening indicator tracking over time (not a clinical diagnosis)
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-300 dark:border-slate-700 text-xs">
          {(['7D', '30D', '90D', '6M'] as const).map(tf => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                timeframe === tf
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-600'
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {tf === '7D'
                ? '7 Days'
                : tf === '30D'
                ? '30 Days'
                : tf === '90D'
                ? '90 Days'
                : '6 Months'}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Container with Smooth Framer Motion Transition */}
      <motion.div
        variants={chartTransitionVariants}
        initial="hidden"
        animate="visible"
        className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 overflow-hidden shadow-xs"
      >
        {/* Risk Zones Indicators */}
        <div className="absolute right-4 top-4 flex flex-col gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <span>High Concern (75–100)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
            <span>Elevated (50–74)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
            <span>Mild (25–49)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Stable (0–24)</span>
          </div>
        </div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 sm:h-60 overflow-visible"
        >
          <defs>
            <linearGradient id="distressGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Threshold Zone Guides */}
          {/* 75 Line */}
          <line
            x1={paddingX}
            y1={getY(75)}
            x2={width - paddingX}
            y2={getY(75)}
            stroke="#f43f5e"
            strokeDasharray="3 3"
            strokeOpacity="0.5"
          />
          {/* 50 Line */}
          <line
            x1={paddingX}
            y1={getY(50)}
            x2={width - paddingX}
            y2={getY(50)}
            stroke="#f59e0b"
            strokeDasharray="3 3"
            strokeOpacity="0.5"
          />
          {/* 25 Line */}
          <line
            x1={paddingX}
            y1={getY(25)}
            x2={width - paddingX}
            y2={getY(25)}
            stroke="#0ea5e9"
            strokeDasharray="3 3"
            strokeOpacity="0.5"
          />

          {/* Baseline reference line */}
          <line
            x1={paddingX}
            y1={baselineY}
            x2={width - paddingX}
            y2={baselineY}
            stroke="#475569"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />
          <text
            x={paddingX + 4}
            y={baselineY - 5}
            fill="#334155"
            className="dark:fill-slate-300"
            fontSize="10"
            fontWeight="bold"
          >
            Individual Baseline ({baselineScore})
          </text>

          {/* Area Fill */}
          <path d={areaD} fill="url(#distressGradient)" />

          {/* Line Stroke */}
          <path
            d={pathD}
            fill="none"
            stroke={currentScore >= 75 ? '#dc2626' : currentScore >= 50 ? '#d97706' : '#059669'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((pt, idx) => {
            const cx = getX(idx, points.length);
            const cy = getY(pt.score);
            const isHovered = activePoint?.date === pt.date;

            return (
              <g key={idx} className="cursor-pointer" onClick={() => setActivePoint(pt)}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : pt.eventNote ? 5 : 4}
                  fill={
                    pt.score >= 75
                      ? '#dc2626'
                      : pt.score >= 50
                      ? '#d97706'
                      : pt.score >= 25
                      ? '#0284c7'
                      : '#059669'
                  }
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                {pt.eventNote && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={8}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}
                {/* Date Label on X axis */}
                <text
                  x={cx}
                  y={height - 8}
                  textAnchor="middle"
                  fill="#334155"
                  className="dark:fill-slate-300"
                  fontSize="10"
                  fontWeight="600"
                >
                  {pt.date.slice(5)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Data Point Tooltip Bar */}
        {activePoint && (
          <div className="mt-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs flex items-center justify-between border border-slate-200 dark:border-slate-700 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">
                {activePoint.date}:
              </span>
              <span className="font-mono font-bold text-indigo-700 dark:text-emerald-400">
                {activePoint.score}/100
              </span>
              {activePoint.eventNote && (
                <span className="text-amber-800 dark:text-amber-300 font-semibold">
                  · {activePoint.eventNote}
                </span>
              )}
            </div>
            <button
              onClick={() => setActivePoint(null)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </motion.div>

      {/* "Why did the indicator change?" Explanation Panel */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-850 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Why did the indicator change? (Explainable AI)
            </span>
          </div>
          {showExplanation ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {showExplanation && (
          <div className="px-5 pb-5 pt-1 space-y-3 border-t border-slate-200 dark:border-slate-800">
            <ul className="space-y-2">
              {recentSignals.map((signal, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              <strong>Ethical Notice:</strong> Signals are derived from check-in responses, sleep ratings, engagement frequency, and linguistic indicators. This is an early-warning prioritization signal to assist qualified caseworkers, not a diagnostic finding.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
