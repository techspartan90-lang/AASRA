'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
  Clock,
  HeartHandshake,
} from 'lucide-react';
import {
  AnimatedMetric,
  LuxuryCard,
  GlassPanel,
  LuxuryButton,
  PremiumBadge,
} from '@/components/design-system';

interface DynamicDistressDashboardProps {
  initialScore?: number;
  initialBaseline?: number;
  onOpenSupportModal?: () => void;
}

export function DynamicDistressDashboard({
  initialScore = 71,
  initialBaseline = 38,
  onOpenSupportModal,
}: DynamicDistressDashboardProps) {
  const [currentScore, setCurrentScore] = useState<number>(initialScore);
  const [baselineScore, setBaselineScore] = useState<number>(initialBaseline);
  const [trendRange, setTrendRange] = useState<'7d' | '30d'>('30d');
  const [showMilestonesOnly, setShowMilestonesOnly] = useState(false);
  const [isSimulatorExpanded, setIsSimulatorExpanded] = useState(false);

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

  const risk = profile.currentRiskState;

  const renderRiskIcon = (iconName: string, className: string = 'w-5 h-5') => {
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
    setCurrentScore(71);
    setBaselineScore(38);
  };

  const isElevated = currentScore >= 60;

  return (
    <div className="space-y-8 select-none">
      {/* =========================================================================
          HEADER & LUXURY CENTERPIECE (Section 15)
          ========================================================================= */}
      <section className="glass-panel p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#474747]/15 dark:border-white/10 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <PremiumBadge tone="live">
                Distress Telemetry
              </PremiumBadge>
              <PremiumBadge tone={isElevated ? 'elevated' : 'medium'}>
                {isElevated ? 'Elevated Alert' : 'Operational Metric'}
              </PremiumBadge>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#333333] dark:text-white tracking-tight">
              Distress Score Telemetry
            </h1>
            <p className="text-sm text-[#474747] dark:text-[#D6D6D6] font-normal mt-1 max-w-2xl leading-relaxed">
              Continuous longitudinal tracking comparing real-time multi-channel telemetry against personal baseline equilibrium.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <LuxuryButton
              variant="secondary"
              size="md"
              onClick={() => setIsSimulatorExpanded(!isSimulatorExpanded)}
              leftIcon={<Sliders className="w-4 h-4 text-[#FD1053]" />}
            >
              {isSimulatorExpanded ? 'Close Simulator' : 'Simulate Score & Baseline'}
            </LuxuryButton>

            {onOpenSupportModal && (
              <LuxuryButton
                variant="primary"
                size="md"
                onClick={onOpenSupportModal}
                leftIcon={<HeartHandshake className="w-4 h-4" />}
              >
                Contact Counsellor
              </LuxuryButton>
            )}
          </div>
        </div>

        {/* 3D Circular Ring Metric Centerpiece */}
        <div className="py-4 flex justify-center">
          <AnimatedMetric
            score={currentScore}
            baseline={baselineScore}
            label="Dynamic Composite Distress Indicator"
            category={currentScore >= 80 ? 'HIGH' : currentScore >= 60 ? 'ELEVATED' : currentScore >= 36 ? 'MODERATE' : 'LOW'}
            size={260}
          />
        </div>

        {/* Interactive Calibration Sandbox */}
        {isSimulatorExpanded && (
          <div className="p-5 rounded-2xl glass-card border-[#FD1053]/30 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#474747]/15 dark:border-white/10 pb-2">
              <span className="text-xs font-bold text-[#333333] dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FD1053]" />
                Interactive Calibration Sandbox
              </span>
              <button
                type="button"
                onClick={resetToStandard}
                className="text-[11px] font-bold text-[#FD1053] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset (Baseline: 38, Score: 71)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <label htmlFor="currentScoreSlider" className="text-[#333333] dark:text-white">
                    Simulate Current Score: <span className="text-[#FD1053] font-bold">{currentScore}/100</span>
                  </label>
                  <span className="text-[#6B7280] text-[11px]">0 - 100</span>
                </div>
                <input
                  id="currentScoreSlider"
                  type="range"
                  min="0"
                  max="100"
                  value={currentScore}
                  onChange={e => setCurrentScore(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-[#474747]/20 rounded-lg appearance-none cursor-pointer accent-[#FD1053]"
                  aria-label="Simulate Current Score"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <label htmlFor="baselineScoreSlider" className="text-[#333333] dark:text-white">
                    Simulate Personal Baseline: <span className="text-[#888888] font-bold">{baselineScore}/100</span>
                  </label>
                  <span className="text-[#6B7280] text-[11px]">Intake Baseline</span>
                </div>
                <input
                  id="baselineScoreSlider"
                  type="range"
                  min="0"
                  max="100"
                  value={baselineScore}
                  onChange={e => setBaselineScore(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-[#474747]/20 rounded-lg appearance-none cursor-pointer accent-[#888888]"
                  aria-label="Simulate Baseline Score"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          KEY SCORE METRICS & BASELINE COMPARISON
          ========================================================================= */}
      <section aria-label="Dynamic Distress Score Breakdown" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Current Score */}
        <LuxuryCard className="p-6 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] dark:text-[#A3A3A3]">
              1. Current Indicator
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#474747]/10 dark:bg-white/10 text-[#333333] dark:text-white font-mono">
              [0–100 SCALE]
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#333333] dark:text-white tracking-tight">
                {profile.currentScore}
              </span>
              <span className="text-sm font-semibold text-[#6B7280]">/ 100</span>
            </div>
            <p className="text-xs font-bold text-[#FD1053] mt-1">
              {risk.textLabel}
            </p>
          </div>
          <div className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] pt-2 border-t border-[#474747]/15 dark:border-white/10 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#FD1053]" />
            <span>Assessed: Latest Check-In</span>
          </div>
        </LuxuryCard>

        {/* Card 2: Baseline Score */}
        <LuxuryCard className="p-6 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] dark:text-[#A3A3A3]">
              2. Personal Baseline
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#888888]/15 text-[#474747] dark:text-[#D6D6D6]">
              Intake Target
            </span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#474747] dark:text-[#D6D6D6] tracking-tight">
                {profile.baselineScore}
              </span>
              <span className="text-sm font-semibold text-[#6B7280]">/ 100</span>
            </div>
            <p className="text-xs font-semibold text-[#474747] dark:text-[#D6D6D6] mt-1">
              Personal Equilibrium Level
            </p>
          </div>
          <div className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] pt-2 border-t border-[#474747]/15 dark:border-white/10 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#888888]" />
            <span>Established on Intake Day 1</span>
          </div>
        </LuxuryCard>

        {/* Card 3: Longitudinal Baseline Comparison */}
        <LuxuryCard className="p-6 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] dark:text-[#A3A3A3]">
              3. Baseline Delta
            </span>
            {profile.scoreChange >= 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FD1053] bg-[#FD1053]/10 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" />
                Shift
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <TrendingDown className="w-3.5 h-3.5" />
                Eased
              </span>
            )}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${
                  profile.scoreChange > 0
                    ? 'text-[#FD1053]'
                    : profile.scoreChange < 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-[#333333] dark:text-white'
                }`}
              >
                {profile.scoreChangeFormatted}
              </span>
              <span className="text-sm font-semibold text-[#6B7280]">pts</span>
            </div>
            <p className="text-xs font-mono text-[#474747] dark:text-[#D6D6D6] mt-1">
              Baseline: {profile.baselineScore} · Change: {profile.scoreChangeFormatted}
            </p>
          </div>
          <div className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] pt-2 border-t border-[#474747]/15 dark:border-white/10">
            {profile.scoreChange > 0
              ? 'Elevation prompts supportive outreach'
              : 'Within personal baseline bounds'}
          </div>
        </LuxuryCard>

        {/* Card 4: Operational Risk State */}
        <LuxuryCard
          className={`p-6 flex flex-col justify-between space-y-3 ${
            risk.category === 'High' || risk.category === 'Critical'
              ? 'border-[#FD1053]/40 shadow-[0_0_20px_rgba(253,16,83,0.1)]'
              : ''
          }`}
          glowOnHover
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] dark:text-[#A3A3A3]">
              Operational State
            </span>
            <PremiumBadge
              tone={
                risk.category === 'High' || risk.category === 'Critical'
                  ? 'elevated'
                  : risk.category === 'Medium'
                  ? 'medium'
                  : 'low'
              }
              size="sm"
            >
              [{risk.category.toUpperCase()}]
            </PremiumBadge>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`p-1.5 rounded-xl text-white ${
                  risk.category === 'Low'
                    ? 'bg-emerald-600'
                    : risk.category === 'Medium'
                    ? 'bg-amber-600'
                    : 'bg-[#FD1053]'
                }`}
              >
                {renderRiskIcon(risk.iconName, 'w-5 h-5')}
              </span>
              <span className="text-base font-bold text-[#333333] dark:text-white">
                {risk.textLabel}
              </span>
            </div>
            <p className="text-xs text-[#474747] dark:text-[#D6D6D6] leading-snug pt-1">
              {risk.accessibleDescription}
            </p>
          </div>

          <div className="text-[11px] font-bold text-[#FD1053] pt-2 border-t border-[#474747]/15 dark:border-white/10">
            Protocol: {risk.caseworkerProtocol}
          </div>
        </LuxuryCard>
      </section>

      {/* =========================================================================
          LONGITUDINAL TREND CHART
          ========================================================================= */}
      <GlassPanel
        title={trendRange === '7d' ? '7-Day Trend Analysis' : '30-Day Trend Analysis'}
        subtitle={`Visualized with personal intake baseline line (${profile.baselineScore} pts) and milestone stress events.`}
        action={
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl bg-[#474747]/10 dark:bg-white/10 p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setTrendRange('7d')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  trendRange === '7d'
                    ? 'bg-white dark:bg-[#252525] text-[#FD1053] shadow-xs'
                    : 'text-[#6B7280] dark:text-[#A3A3A3]'
                }`}
              >
                7-Day
              </button>
              <button
                type="button"
                onClick={() => setTrendRange('30d')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  trendRange === '30d'
                    ? 'bg-white dark:bg-[#252525] text-[#FD1053] shadow-xs'
                    : 'text-[#6B7280] dark:text-[#A3A3A3]'
                }`}
              >
                30-Day
              </button>
            </div>

            <LuxuryButton
              size="sm"
              variant="tertiary"
              onClick={() => setShowMilestonesOnly(!showMilestonesOnly)}
            >
              {showMilestonesOnly ? 'Show All Days' : 'Milestones Only'}
            </LuxuryButton>
          </div>
        }
      >
        <div className="w-full h-80 sm:h-96 pt-2" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activeTrendData}
              margin={{ top: 20, right: 30, left: 0, bottom: 25 }}
            >
              <defs>
                <linearGradient id="scoreDistressGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FD1053" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#FD1053" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#474747" opacity={0.15} />
              <XAxis
                dataKey="dateStr"
                stroke="#6B7280"
                fontSize={11}
                tickLine={false}
                interval={trendRange === '7d' ? 0 : 3}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                domain={[0, 100]}
                stroke="#6B7280"
                fontSize={11}
                tickLine={false}
                ticks={[0, 20, 40, 60, 80, 100]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-2xl glass-modal-panel p-3.5 shadow-2xl border border-white/20 text-xs space-y-1.5 max-w-xs text-[#333333] dark:text-white">
                        <div className="font-bold border-b border-[#474747]/15 dark:border-white/10 pb-1 flex justify-between">
                          <span>{data.dateStr}</span>
                          <span className="font-mono text-[#FD1053]">{data.checkInChannel}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm pt-1">
                          <span className="text-[#6B7280]">Distress Score:</span>
                          <span className="font-extrabold text-[#FD1053]">{data.score} / 100</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[#6B7280]">Delta from Baseline:</span>
                          <span className={`font-bold ${data.change >= 0 ? 'text-[#FD1053]' : 'text-emerald-500'}`}>
                            {data.change >= 0 ? `+${data.change}` : data.change} pts
                          </span>
                        </div>
                        {data.milestoneEvent && (
                          <div className="text-[11px] text-[#FD1053] bg-[#FD1053]/10 p-1.5 rounded-lg border border-[#FD1053]/25">
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
              <ReferenceLine
                y={profile.baselineScore}
                stroke="#888888"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{
                  value: `Baseline (${profile.baselineScore})`,
                  fill: '#888888',
                  position: 'insideBottomRight',
                  fontSize: 11,
                  fontWeight: 'bold',
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                name="Distress Telemetry"
                stroke="#FD1053"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#scoreDistressGradient)"
                activeDot={{ r: 6, stroke: '#FD1053', strokeWidth: 2, fill: '#FFFFFF' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassPanel>
    </div>
  );
}
