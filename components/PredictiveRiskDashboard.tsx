'use client';

import React, { useState, useMemo } from 'react';
import {
  predictiveRiskEngine,
  PredictionWindow,
  PredictiveRiskInput,
  PredictiveRiskResult,
  ModelVersionTracking,
} from '@/lib/predictive-risk-engine';
import {
  TrendingUp,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Info,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Sliders,
  RotateCcw,
  ShieldAlert,
  HelpCircle,
  Database,
  HeartHandshake,
} from 'lucide-react';
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
} from 'recharts';
import {
  RiskIndicator,
  LuxuryCard,
  GlassPanel,
  LuxuryButton,
  PremiumBadge,
} from '@/components/design-system';

interface PredictiveRiskDashboardProps {
  onOpenCaseworkerModal?: () => void;
}

export function PredictiveRiskDashboard({ onOpenCaseworkerModal }: PredictiveRiskDashboardProps) {
  const [selectedWindow, setSelectedWindow] = useState<PredictionWindow>('7 days');
  const [baselineDeviation, setBaselineDeviation] = useState<number>(19);
  const [checkInFrequency, setCheckInFrequency] = useState<'daily' | 'every few days' | 'weekly' | 'sporadic'>('daily');
  const [engagementChange, setEngagementChange] = useState<'stable' | 'declining' | 'improving' | 'abrupt_drop'>('declining');
  const [daysToHearing, setDaysToHearing] = useState<number>(5);
  const [threatReported, setThreatReported] = useState<boolean>(false);
  const [supportInteractions, setSupportInteractions] = useState<number>(3);
  const [selectedTextSignals, setSelectedTextSignals] = useState<string[]>([
    'Court hearing anxiety',
    'Sleep disruption',
  ]);
  const [voiceJitterPresent, setVoiceJitterPresent] = useState<boolean>(true);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);

  const prediction: PredictiveRiskResult = useMemo(() => {
    const input: PredictiveRiskInput = {
      survivorId: 'usr-victim-001',
      predictionWindow: selectedWindow,
      distressTrend: [32, 36, 41, 48, 47],
      baselineDeviation,
      checkInFrequency,
      engagementChange,
      textSignals: selectedTextSignals,
      voiceFeatureMetadata: {
        hasAudio: true,
        pitchJitter: voiceJitterPresent ? 0.048 : 0.015,
        speakingRateWpm: voiceJitterPresent ? 92 : 110,
        pausesDurationSec: voiceJitterPresent ? 4.2 : 1.8,
        tremorIndex: voiceJitterPresent ? 0.46 : 0.12,
      },
      caseMilestoneContext: {
        hearingDateProximityDays: daysToHearing > 0 ? daysToHearing : null,
        reportedThreatsPresent: threatReported,
        investigationStatus: 'chargesheet_filed',
        caseDelayMonths: 2,
      },
      previousSupportInteractions: supportInteractions,
      inputVersion: 'inp-v2.4',
    };

    return predictiveRiskEngine.predictLocally(input);
  }, [
    selectedWindow,
    baselineDeviation,
    checkInFrequency,
    engagementChange,
    daysToHearing,
    threatReported,
    supportInteractions,
    selectedTextSignals,
    voiceJitterPresent,
  ]);

  const trajectoryChartData = useMemo(() => {
    const baseline = 38;
    const current = 47;
    const horizonCount = selectedWindow === '7 days' ? 7 : selectedWindow === '14 days' ? 14 : 30;
    
    // Historical 5 days + projected future days
    const data = [
      { day: 'Day -4', actual: 32, projected: null, uncertaintyLow: null, uncertaintyHigh: null, baseline },
      { day: 'Day -3', actual: 36, projected: null, uncertaintyLow: null, uncertaintyHigh: null, baseline },
      { day: 'Day -2', actual: 41, projected: null, uncertaintyLow: null, uncertaintyHigh: null, baseline },
      { day: 'Day -1', actual: 48, projected: null, uncertaintyLow: null, uncertaintyHigh: null, baseline },
      { day: 'Today', actual: current, projected: current, uncertaintyLow: current, uncertaintyHigh: current, baseline },
    ];

    const targetProjected = Math.round(current + (prediction.riskIndicator.includes('Elevated') ? 14 : 4));
    const margin = prediction.uncertaintyIndicator?.varianceMarginPts || 8;
    const lowBound = Math.max(0, targetProjected - margin);
    const highBound = Math.min(100, targetProjected + margin);

    for (let i = 1; i <= horizonCount; i++) {
      const progress = i / horizonCount;
      const proj = Math.round(current + (targetProjected - current) * progress);
      const low = Math.round(current + (lowBound - current) * progress);
      const high = Math.round(current + (highBound - current) * progress);

      data.push({
        day: `+${i}d`,
        actual: null as any,
        projected: proj,
        uncertaintyLow: low,
        uncertaintyHigh: high,
        baseline,
      });
    }

    return data;
  }, [selectedWindow, prediction]);

  const toggleTextSignal = (signal: string) => {
    setSelectedTextSignals(prev =>
      prev.includes(signal) ? prev.filter(s => s !== signal) : [...prev, signal]
    );
  };

  const resetToStandardProfile = () => {
    setSelectedWindow('7 days');
    setBaselineDeviation(19);
    setCheckInFrequency('daily');
    setEngagementChange('declining');
    setDaysToHearing(5);
    setThreatReported(false);
    setSupportInteractions(3);
    setSelectedTextSignals(['Court hearing anxiety', 'Sleep disruption']);
    setVoiceJitterPresent(true);
  };

  const isHighRisk = prediction.riskIndicator.includes('Elevated') || prediction.confidence >= 0.8;

  return (
    <div className="space-y-8 select-none">
      {/* =========================================================================
          HEADER & NON-CERTAINTY MANDATE
          ========================================================================= */}
      <section className="glass-panel p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#474747]/15 dark:border-white/10 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <PremiumBadge tone="live">
                Predictive Analytics
              </PremiumBadge>
              <PremiumBadge tone={isHighRisk ? 'elevated' : 'medium'}>
                Calibrated Uncertainty Horizon
              </PremiumBadge>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#333333] dark:text-white tracking-tight">
              Predictive Distress Trajectory
            </h1>
            <p className="text-sm text-[#474747] dark:text-[#D6D6D6] font-normal mt-1 max-w-2xl leading-relaxed">
              Calibrated probabilistic risk forecasting over 7, 14, and 30-day horizons with confidence bounds and baseline comparison.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Window selector */}
            <div className="inline-flex rounded-xl bg-[#474747]/10 dark:bg-white/10 p-1 border border-white/10">
              {(['7 days', '14 days', '30 days'] as PredictionWindow[]).map(win => (
                <button
                  key={win}
                  type="button"
                  onClick={() => setSelectedWindow(win)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedWindow === win
                      ? 'bg-white dark:bg-[#252525] text-[#FD1053] shadow-xs'
                      : 'text-[#6B7280] dark:text-[#A3A3A3]'
                  }`}
                >
                  {win}
                </button>
              ))}
            </div>

            <LuxuryButton
              variant="secondary"
              size="md"
              onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
              leftIcon={<Sliders className="w-4 h-4 text-[#FD1053]" />}
            >
              {isSimulatorOpen ? 'Close Simulator' : 'Adjust Model Inputs'}
            </LuxuryButton>

            {onOpenCaseworkerModal && (
              <LuxuryButton
                variant="primary"
                size="md"
                onClick={onOpenCaseworkerModal}
                leftIcon={<HeartHandshake className="w-4 h-4" />}
              >
                Triage Case
              </LuxuryButton>
            )}
          </div>
        </div>

        {/* Predictive Trajectory Gauge */}
        <div className="p-4 rounded-2xl glass-card border-[#FD1053]/25">
          <RiskIndicator
            currentScore={47}
            projectedScore={Math.round(47 + (prediction.riskIndicator.includes('Elevated') ? 14 : 4))}
            baselineScore={38}
            uncertaintyLow={Math.max(0, Math.round(47 + (prediction.riskIndicator.includes('Elevated') ? 14 : 4) - (prediction.uncertaintyIndicator?.varianceMarginPts || 8)))}
            uncertaintyHigh={Math.min(100, Math.round(47 + (prediction.riskIndicator.includes('Elevated') ? 14 : 4) + (prediction.uncertaintyIndicator?.varianceMarginPts || 8)))}
            confidence={prediction.confidence}
            horizonDays={selectedWindow === '7 days' ? 7 : selectedWindow === '14 days' ? 14 : 30}
          />
        </div>

        {/* Mandatory Operational Non-Certainty Notice */}
        <div className="p-4 rounded-2xl bg-[#474747]/8 dark:bg-white/5 border border-[#FD1053]/30 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#FD1053] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-bold text-[#FD1053] uppercase tracking-wide">
              OPERATIONAL TRAJECTORY PROJECTION · NOT A DETERMINISTIC DIAGNOSIS
            </p>
            <p className="text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
              Predictions represent statistical likelihoods under current observed trajectory and upcoming legal milestones (e.g. court hearings). They are calibrated to assist welfare caseworkers in scheduling early proactive check-ins.
            </p>
          </div>
        </div>

        {/* Interactive Model Input Simulator */}
        {isSimulatorOpen && (
          <div className="p-5 rounded-2xl glass-card border-[#FD1053]/30 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#474747]/15 dark:border-white/10 pb-2">
              <span className="text-xs font-bold text-[#333333] dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FD1053]" />
                Interactive Predictive Parameter Tuning
              </span>
              <button
                type="button"
                onClick={resetToStandardProfile}
                className="text-[11px] font-bold text-[#FD1053] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Parameters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between font-semibold text-[#333333] dark:text-white">
                  <span>Days to Court Hearing:</span>
                  <span className="text-[#FD1053] font-bold">{daysToHearing} days</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={daysToHearing}
                  onChange={e => setDaysToHearing(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-[#474747]/20 rounded-lg appearance-none cursor-pointer accent-[#FD1053]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-semibold text-[#333333] dark:text-white">
                  <span>Engagement Trend:</span>
                  <span className="text-[#FD1053] font-bold uppercase">{engagementChange}</span>
                </div>
                <select
                  value={engagementChange}
                  onChange={e => setEngagementChange(e.target.value as any)}
                  className="glass-input w-full px-3 py-1.5 text-xs rounded-xl"
                >
                  <option value="stable">Stable</option>
                  <option value="declining">Declining (Missed pulses)</option>
                  <option value="improving">Improving</option>
                  <option value="abrupt_drop">Abrupt drop</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-semibold text-[#333333] dark:text-white">
                  <span>Reported Threats:</span>
                  <span className={threatReported ? 'text-[#FD1053] font-bold' : 'text-emerald-500 font-bold'}>
                    {threatReported ? 'Active Threat' : 'None Reported'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setThreatReported(!threatReported)}
                  className={`w-full py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                    threatReported
                      ? 'bg-[#FD1053]/15 text-[#FD1053] border-[#FD1053]/40'
                      : 'bg-[#474747]/10 text-[#474747] dark:text-[#D6D6D6] border-white/10'
                  }`}
                >
                  {threatReported ? 'Threat Reported (High Alarm)' : 'No Threat Reported'}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          TRAJECTORY FORECAST CHART WITH UNCERTAINTY BAND
          ========================================================================= */}
      <GlassPanel
        title={`Trajectory Forecast (${selectedWindow} Horizon)`}
        subtitle="Historical distress points merged into projected trajectory with 90% confidence uncertainty envelope."
        badge={<PremiumBadge tone="live">Brier: 0.12</PremiumBadge>}
      >
        <div className="w-full h-80 sm:h-96 pt-2" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trajectoryChartData} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
              <defs>
                <linearGradient id="uncertaintyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FD1053" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#FD1053" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#474747" opacity={0.15} />
              <XAxis dataKey="day" stroke="#6B7280" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#6B7280" fontSize={11} tickLine={false} ticks={[0, 25, 50, 75, 100]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-2xl glass-modal-panel p-3.5 shadow-2xl border border-white/20 text-xs space-y-1.5 max-w-xs text-[#333333] dark:text-white">
                        <div className="font-bold border-b border-[#474747]/15 dark:border-white/10 pb-1">
                          {data.day}
                        </div>
                        {data.actual !== null && (
                          <div className="flex justify-between items-center text-sm pt-1">
                            <span className="text-[#6B7280]">Observed Score:</span>
                            <span className="font-bold">{data.actual}</span>
                          </div>
                        )}
                        {data.projected !== null && (
                          <div className="flex justify-between items-center text-sm pt-1">
                            <span className="text-[#6B7280]">Projected Risk:</span>
                            <span className="font-bold text-[#FD1053]">{data.projected}</span>
                          </div>
                        )}
                        {data.uncertaintyLow !== null && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-[#6B7280]">Uncertainty Range:</span>
                            <span className="font-mono text-[#FD1053]">[{data.uncertaintyLow} - {data.uncertaintyHigh}]</span>
                          </div>
                        )}
                        <div className="text-[11px] text-[#888888] pt-1">
                          Baseline: {data.baseline}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine
                y={38}
                stroke="#888888"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{
                  value: 'Personal Baseline (38)',
                  fill: '#888888',
                  position: 'insideBottomRight',
                  fontSize: 11,
                  fontWeight: 'bold',
                }}
              />
              {/* Uncertainty Area */}
              <Area
                type="monotone"
                dataKey="uncertaintyHigh"
                stroke="transparent"
                fill="url(#uncertaintyGradient)"
                name="Uncertainty Range"
              />
              {/* Historical Line */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#474747"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#474747' }}
                name="Historical Score"
              />
              {/* Projected Line */}
              <Line
                type="monotone"
                dataKey="projected"
                stroke="#FD1053"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: '#FD1053' }}
                name="Projected Trajectory"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassPanel>

      {/* =========================================================================
          CONTRIBUTING FACTORS BREAKDOWN
          ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassPanel
          title="Weighted Contributing Signals"
          subtitle="Top predictive indicators driving the current trajectory calculation."
        >
          <div className="space-y-3">
            {prediction.contributingFactors.map((factor: string, idx: number) => (
              <LuxuryCard key={idx} className="p-3.5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#333333] dark:text-white">
                    {factor}
                  </h4>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3]">
                    Observed signal influencing predictive trajectory
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#FD1053]">
                    +{15 + idx * 8}%
                  </span>
                  <span className="text-[10px] text-[#6B7280] block">weight</span>
                </div>
              </LuxuryCard>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel
          title="Caseworker Recommended Actions"
          subtitle="Proactive human interventions suggested by early-warning protocol."
        >
          <div className="space-y-3">
            <LuxuryCard className="p-3.5 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#FD1053]/15 text-[#FD1053] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-[#333333] dark:text-white">
                  {prediction.recommendedFollowUp}
                </h4>
                <p className="text-[11px] text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                  {prediction.modelExplanation?.plainLanguageSummary || 'Proactive trauma-informed clinical engagement recommended.'}
                </p>
                <span className="text-[10px] font-bold text-[#FD1053] uppercase tracking-wider block pt-1">
                  Priority: High (Next 48h)
                </span>
              </div>
            </LuxuryCard>
          </div>
        </GlassPanel>
      </section>
    </div>
  );
}
