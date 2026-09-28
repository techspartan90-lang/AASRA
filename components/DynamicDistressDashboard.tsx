'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from 'recharts';
import {
  dynamicDistressEngine,
  DynamicDistressProfile,
  DynamicRiskCategory,
  RISK_STATE_CONFIGS,
  resolveRiskCategory,
} from '@/lib/dynamic-distress-engine';
import {
  ShieldCheck,
  Activity,
  AlertTriangle,
  ShieldAlert,
  Info,
  Calendar,
  Sparkles,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Sliders,
  CheckCircle2,
  FileText,
  Clock,
  ExternalLink,
  HelpCircle,
  Hash,
  HeartHandshake,
} from 'lucide-react';

interface DynamicDistressDashboardProps {
  initialScore?: number;
  initialBaseline?: number;
  onOpenSupportModal?: () => void;
}

export function DynamicDistressDashboard({
  initialScore = 47,
  initialBaseline = 28,
  onOpenSupportModal,
}: DynamicDistressDashboardProps) {
  // Configurable dynamic state to allow real-time interactive simulation
  const [currentScore, setCurrentScore] = useState<number>(initialScore);
  const [baselineScore, setBaselineScore] = useState<number>(initialBaseline);
  const [trendRange, setTrendRange] = useState<'7d' | '30d'>('30d');
  const [showMilestonesOnly, setShowMilestonesOnly] = useState(false);
  const [isSimulatorExpanded, setIsSimulatorExpanded] = useState(false);

  // Compute profile based on interactive scores
  const profile: DynamicDistressProfile = useMemo(() => {
    return dynamicDistressEngine.getDistressProfile('usr-victim-001', currentScore, baselineScore);
  }, [currentScore, baselineScore]);

  const activeTrendData = useMemo(() => {
    const data = trendRange === '7d' ? profile.sevenDayTrend : profile.thirtyDayTrend;
    if (showMilestonesOnly) {
      return data.filter(d => Boolean(d.milestoneEvent));
    }
    return data;
  }, [trendRange, showMilestonesOnly, profile]);

  // Risk state configuration for the active score
  const risk = profile.currentRiskState;

  // Icon mapping helper ensuring accessible icons
  const renderRiskIcon = (iconName: string, className: string = 'w-6 h-6') => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className={className} aria-hidden="true" />;
      case 'Activity':
        return <Activity className={className} aria-hidden="true" />;
      case 'AlertTriangle':
        return <AlertTriangle className={className} aria-hidden="true" />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} aria-hidden="true" />;
      default:
        return <Activity className={className} aria-hidden="true" />;
    }
  };

  const resetToStandard = () => {
    setCurrentScore(47);
    setBaselineScore(28);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* =========================================================================
          HEADER & MANDATORY NON-CLINICAL LABELING
          The score must be clearly labelled: "Dynamic Distress Indicator"
          NOT: "Medical diagnosis"
          ========================================================================= */}
      <section
        aria-labelledby="distress-engine-heading"
        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <Activity className="w-3.5 h-3.5" aria-hidden="true" />
                Longitudinal Engine (Phase 6)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <Info className="w-3.5 h-3.5" aria-hidden="true" />
                Operational Risk Metric
              </span>
            </div>

            <h1
              id="distress-engine-heading"
              className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight"
            >
              Dynamic Distress Indicator
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium mt-1 max-w-3xl leading-relaxed">
              Continuous longitudinal tracking comparing real-time multi-channel pulses against the survivor&apos;s baseline intake score.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsSimulatorExpanded(!isSimulatorExpanded)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer border border-slate-200 dark:border-slate-700 min-h-[44px]"
              aria-expanded={isSimulatorExpanded}
            >
              <Sliders className="w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
              <span>{isSimulatorExpanded ? 'Close Score Simulator' : 'Simulate Score & Baseline'}</span>
            </button>
            {onOpenSupportModal && (
              <button
                onClick={onOpenSupportModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-750 text-white text-xs font-bold shadow-sm transition cursor-pointer min-h-[44px]"
              >
                <HeartHandshake className="w-4 h-4" aria-hidden="true" />
                <span>Contact Caseworker</span>
              </button>
            )}
          </div>
        </div>

        {/* Mandatory Non-Clinical Operational Notice */}
        <div
          role="note"
          aria-label="Operational indicator disclaimer"
          className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 flex items-start gap-3"
        >
          <Info className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1 text-xs">
            <p className="font-black text-amber-900 dark:text-amber-200 uppercase tracking-wide">
              MANDATORY OPERATIONAL NOTICE: NOT A MEDICAL DIAGNOSIS
            </p>
            <p className="text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
              The <strong>Dynamic Distress Indicator</strong> is a system-defined operational triage metric used to prompt timely caseworker support and identify longitudinal shifts. It is <strong>NOT a clinical diagnosis, psychiatric assessment, or medical evaluation</strong>. Risk categories reflect operational follow-up protocols under Section 15A SC/ST PoA Act victim protection guidelines.
            </p>
          </div>
        </div>

        {/* Interactive Simulator Sandbox (Togglable) */}
        {isSimulatorExpanded && (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                Interactive Calibration Sandbox (Test Shifts &amp; Transitions)
              </span>
              <button
                onClick={resetToStandard}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                Reset to Standard (Baseline: 28, Current: 47)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <label htmlFor="currentScoreSlider" className="text-slate-700 dark:text-slate-300">
                    Current Score: <span className="text-slate-900 dark:text-white font-bold">{currentScore}/100</span>
                  </label>
                  <span className="text-slate-500 text-[11px]">Range: 0 - 100</span>
                </div>
                <input
                  id="currentScoreSlider"
                  type="range"
                  min="0"
                  max="100"
                  value={currentScore}
                  onChange={e => setCurrentScore(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  aria-label="Simulate Current Score"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <label htmlFor="baselineScoreSlider" className="text-slate-700 dark:text-slate-300">
                    Intake Baseline: <span className="text-slate-900 dark:text-white font-bold">{baselineScore}/100</span>
                  </label>
                  <span className="text-slate-500 text-[11px]">Standard Intake: 28</span>
                </div>
                <input
                  id="baselineScoreSlider"
                  type="range"
                  min="0"
                  max="100"
                  value={baselineScore}
                  onChange={e => setBaselineScore(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  aria-label="Simulate Baseline Score"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          KEY SCORE METRICS & BASELINE COMPARISON
          1. Current score (0-100)
          2. Baseline score (0-100)
          3. Change calculation (e.g. Baseline: 28, Current: 47, Change: +19)
          4. Operational Risk Category with (icon, text label, accessible description)
          ========================================================================= */}
      <section aria-label="Dynamic Distress Score Breakdown" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Current Score */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              1. Current Score
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
              [0–100 SCALE]
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {profile.currentScore}
              </span>
              <span className="text-base font-semibold text-slate-500">/ 100</span>
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
              Dynamic Distress Indicator
            </p>
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>Assessed: Day 28 (Latest check-in)</span>
          </div>
        </div>

        {/* Card 2: Baseline Score */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              2. Baseline Score
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              Intake Target
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight">
                {profile.baselineScore}
              </span>
              <span className="text-base font-semibold text-slate-500">/ 100</span>
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
              Personal Equilibrium Level
            </p>
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>Established on Day 1 Intake (Sep 01)</span>
          </div>
        </div>

        {/* Card 3: Longitudinal Baseline Comparison */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Baseline Comparison
            </span>
            {profile.scoreChange >= 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md">
                <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                Shift
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
                Eased
              </span>
            )}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-4xl sm:text-5xl font-black tracking-tight ${
                  profile.scoreChange > 0
                    ? 'text-amber-600 dark:text-amber-400'
                    : profile.scoreChange < 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {profile.scoreChangeFormatted}
              </span>
              <span className="text-base font-semibold text-slate-500">pts</span>
            </div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 font-mono">
              Baseline: {profile.baselineScore} · Current: {profile.currentScore} · Change: {profile.scoreChangeFormatted}
            </p>
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            {profile.scoreChange > 0
              ? 'Elevation prompts supportive outreach'
              : profile.scoreChange < 0
              ? 'Distress below baseline level'
              : 'Exact alignment with intake baseline'}
          </div>
        </div>

        {/* Card 4: Operational Risk State (Dual Cues: Icon + Text + Contrast + Accessible Description) */}
        <div
          className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 shadow-sm flex flex-col justify-between space-y-3 ${
            risk.category === 'Low'
              ? 'border-emerald-500/80 bg-emerald-50/20'
              : risk.category === 'Medium'
              ? 'border-blue-500/80 bg-blue-50/20'
              : risk.category === 'High'
              ? 'border-amber-500/80 bg-amber-50/20'
              : 'border-rose-600/90 bg-rose-50/20'
          }`}
          aria-label={`Operational Risk State: ${risk.textLabel}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Operational Risk State
            </span>
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                risk.category === 'Low'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700'
                  : risk.category === 'Medium'
                  ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-700'
                  : risk.category === 'High'
                  ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700'
                  : 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-700'
              }`}
            >
              [{risk.category.toUpperCase()}]
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`p-1.5 rounded-xl text-white ${
                  risk.category === 'Low'
                    ? 'bg-emerald-600'
                    : risk.category === 'Medium'
                    ? 'bg-blue-600'
                    : risk.category === 'High'
                    ? 'bg-amber-600'
                    : 'bg-rose-600'
                }`}
              >
                {renderRiskIcon(risk.iconName, 'w-5 h-5')}
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {risk.textLabel}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-snug pt-1">
              {risk.accessibleDescription}
            </p>
          </div>

          <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
            Protocol: {risk.caseworkerProtocol}
          </div>
        </div>
      </section>

      {/* =========================================================================
          ALL 4 OPERATIONAL RISK CATEGORIES REFERENCE GUIDE
          "Do not use color alone to communicate risk."
          "Every risk state must include:
           - icon
           - text label
           - accessible description"
          ========================================================================= */}
      <section
        aria-labelledby="risk-categories-guide-heading"
        className="rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-6 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <h2 id="risk-categories-guide-heading" className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Operational Risk Categories (Non-Clinical System Definitions)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Multi-modal indicators: Icon + Label + Geometric Pattern + Protocol
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {(['Low', 'Medium', 'High', 'Critical'] as DynamicRiskCategory[]).map(cat => {
            const item = RISK_STATE_CONFIGS[cat];
            const isCurrent = risk.category === cat;
            return (
              <div
                key={cat}
                className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 transition-all relative ${
                  isCurrent
                    ? 'ring-2 ring-indigo-500 dark:ring-indigo-400 border-indigo-600 shadow-md'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-2.5 right-3 text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                    Active State
                  </span>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {renderRiskIcon(item.iconName, 'w-4 h-4')}
                  </span>
                  <div>
                    <span className="text-xs font-black text-slate-900 dark:text-white block">
                      {item.textLabel}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {cat === 'Low' ? 'Score: 0–35' : cat === 'Medium' ? 'Score: 36–59' : cat === 'High' ? 'Score: 60–79' : 'Score: 80–100'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                  {item.accessibleDescription}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Action Standard:</span>
                  {item.caseworkerProtocol}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          LONGITUDINAL CHARTS (RECHARTS)
          3. 7-Day Trend
          4. 30-Day Trend
          Accessible labels, keyboard readable, high contrast, baseline comparison.
          ========================================================================= */}
      <section
        aria-labelledby="trend-charts-heading"
        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
              <TrendingUp className="w-4 h-4" aria-hidden="true" />
              <span>Longitudinal Progression</span>
            </div>
            <h2 id="trend-charts-heading" className="text-2xl font-black text-slate-900 dark:text-white">
              {trendRange === '7d' ? '3. 7-Day Trend Analysis' : '4. 30-Day Trend Analysis'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-0.5">
              Visualized with personal intake baseline line ({profile.baselineScore} pts) and milestone stress events.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 7-day vs 30-day toggle */}
            <div
              role="group"
              aria-label="Trend Time Horizon Selector"
              className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700"
            >
              <button
                onClick={() => setTrendRange('7d')}
                aria-pressed={trendRange === '7d'}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer min-h-[36px] ${
                  trendRange === '7d'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                7-Day Trend
              </button>
              <button
                onClick={() => setTrendRange('30d')}
                aria-pressed={trendRange === '30d'}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer min-h-[36px] ${
                  trendRange === '30d'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                30-Day Trend
              </button>
            </div>

            <button
              onClick={() => setShowMilestonesOnly(!showMilestonesOnly)}
              aria-pressed={showMilestonesOnly}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer min-h-[36px] ${
                showMilestonesOnly
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-700 dark:text-indigo-300'
                  : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              {showMilestonesOnly ? 'Show All Days' : 'Milestones Only'}
            </button>
          </div>
        </div>

        {/* Recharts Area/Line Chart */}
        <div className="w-full h-80 sm:h-96 pt-2" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activeTrendData}
              margin={{ top: 20, right: 30, left: 0, bottom: 25 }}
            >
              <defs>
                <linearGradient id="scoreDistressGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.25} />
              <XAxis
                dataKey="dateStr"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                interval={trendRange === '7d' ? 0 : 3}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                domain={[0, 100]}
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                ticks={[0, 20, 40, 60, 80, 100]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const catConfig = RISK_STATE_CONFIGS[data.category as DynamicRiskCategory] || RISK_STATE_CONFIGS.Medium;
                    return (
                      <div className="rounded-2xl bg-slate-900 text-white p-3.5 shadow-xl border border-slate-700 text-xs space-y-1.5 max-w-xs">
                        <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex justify-between">
                          <span>{data.dateStr}</span>
                          <span className="font-mono text-indigo-400">{data.checkInChannel}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm pt-1">
                          <span className="text-slate-400">Distress Indicator:</span>
                          <span className="font-black text-white">{data.score} / 100</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Baseline Delta:</span>
                          <span className={`font-bold ${data.change >= 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {data.change >= 0 ? `+${data.change}` : data.change} pts
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] pt-1 border-t border-slate-800">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: catConfig.colorHex }} />
                          <span className="font-bold text-slate-200">{catConfig.textLabel}</span>
                        </div>
                        {data.milestoneEvent && (
                          <div className="text-[11px] text-amber-300 bg-amber-950/60 p-1.5 rounded-lg border border-amber-800">
                            <strong>Milestone:</strong> {data.milestoneEvent}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 12, fontSize: 12 }}
              />
              {/* Reference Baseline Line */}
              <ReferenceLine
                y={profile.baselineScore}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{
                  value: `Baseline (${profile.baselineScore})`,
                  fill: '#10b981',
                  position: 'insideBottomRight',
                  fontSize: 11,
                  fontWeight: 'bold',
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                name="Dynamic Distress Indicator"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#scoreDistressGradient)"
                activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Accessible Data Table for Screen Readers (Meets Accessibility Requirement) */}
        <div className="sr-only">
          <h3>Screen Reader Accessible Trend Data for {trendRange === '7d' ? '7-Day' : '30-Day'} Analysis</h3>
          <p>Intake baseline score is {profile.baselineScore}. Current score is {profile.currentScore}. Overall change is {profile.scoreChangeFormatted}.</p>
          <table>
            <caption>Longitudinal Dynamic Distress Indicator Observations</caption>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Distress Indicator Score</th>
                <th scope="col">Baseline Score</th>
                <th scope="col">Difference</th>
                <th scope="col">Risk Indicator State</th>
                <th scope="col">Milestone Event</th>
              </tr>
            </thead>
            <tbody>
              {activeTrendData.map((obs, idx) => (
                <tr key={idx}>
                  <td>{obs.dateStr}</td>
                  <td>{obs.score}</td>
                  <td>{obs.baseline}</td>
                  <td>{obs.change}</td>
                  <td>{obs.category}</td>
                  <td>{obs.milestoneEvent || 'Routine'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* =========================================================================
          5. MAJOR CHANGES
          6. CONFIDENCE
          7. CONTRIBUTING SIGNALS
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 5. Major Changes Log */}
        <section
          aria-labelledby="major-changes-heading"
          className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                <Hash className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Longitudinal Delta Log</span>
              </div>
              <h2 id="major-changes-heading" className="text-xl font-black text-slate-900 dark:text-white">
                5. Major Changes
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">3 Recorded inflection points</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {profile.majorChanges.map(change => (
              <div
                key={change.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 font-mono">
                      {change.dateStr}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      · {change.triggerEvent}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {change.summary}
                  </p>
                  <span className="inline-block text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                    Category Transition: {change.categoryTransition}
                  </span>
                </div>

                <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between">
                  <span
                    className={`text-lg font-black font-mono ${
                      change.delta > 0
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {change.delta > 0 ? `+${change.delta}` : change.delta} pts
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    Shift
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Confidence & 7. Contributing Signals */}
        <div className="space-y-6">
          {/* 6. Confidence Score Card */}
          <section
            aria-labelledby="confidence-heading"
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <h2 id="confidence-heading" className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  6. Engine Confidence
                </h2>
              </div>
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 font-mono">
                {Math.round(profile.confidence * 100)}% CALIBRATED
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Multi-source signal reliability</span>
                <span className="font-bold text-slate-900 dark:text-white">High (0.92)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${profile.confidence * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                Confidence derived from high longitudinal check-in consistency (28 of 30 days active) and concordant multi-channel acoustic and lexical features.
              </p>
            </div>
          </section>

          {/* 7. Contributing Signals */}
          <section
            aria-labelledby="contributing-signals-heading"
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                <h2 id="contributing-signals-heading" className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  7. Contributing Signals
                </h2>
              </div>
              <span className="text-[11px] text-slate-500">{profile.contributingSignals.length} Active factors</span>
            </div>

            <ul className="space-y-2.5 pt-1" aria-label="List of contributing signals">
              {profile.contributingSignals.map((signal, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" aria-hidden="true" />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
