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
  FileText,
  Sliders,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Hash,
  Database,
  UserCheck,
  PhoneCall,
  Activity,
  History,
} from 'lucide-react';

interface PredictiveRiskDashboardProps {
  onOpenCaseworkerModal?: () => void;
}

export function PredictiveRiskDashboard({ onOpenCaseworkerModal }: PredictiveRiskDashboardProps) {
  // Active prediction window selector: 7 days | 14 days | 30 days
  const [selectedWindow, setSelectedWindow] = useState<PredictionWindow>('7 days');

  // Interactive inputs state for simulation & casework tuning
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

  // Compute prediction through client engine (with local deterministic fallback)
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

  const auditHistory: ModelVersionTracking[] = useMemo(() => {
    if (prediction) {
      // Re-fetch stored predictions when new prediction is made
    }
    return predictiveRiskEngine.getStoredPredictions();
  }, [prediction]);

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

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* =========================================================================
          HEADER & NON-CERTAINTY MANDATE
          ========================================================================= */}
      <section
        aria-labelledby="predictive-risk-heading"
        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                Phase 7: Predictive Risk Modelling
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                FastAPI AI Service Integrated
              </span>
            </div>

            <h1
              id="predictive-risk-heading"
              className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight"
            >
              Predictive Distress Trajectory
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium mt-1 max-w-3xl leading-relaxed">
              Forward-looking operational trajectory engine projecting upcoming distress volatility across 7-day, 14-day, and 30-day horizons to enable timely caseworker outreach.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsSimulatorOpen(!isSimulatorOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer border border-slate-200 dark:border-slate-700 min-h-[44px]"
              aria-expanded={isSimulatorOpen}
            >
              <Sliders className="w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
              <span>{isSimulatorOpen ? 'Close Feature Simulator' : 'Adjust Input Signals'}</span>
            </button>
            {onOpenCaseworkerModal && (
              <button
                onClick={onOpenCaseworkerModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-750 text-white text-xs font-bold shadow-sm transition cursor-pointer min-h-[44px]"
              >
                <PhoneCall className="w-4 h-4" aria-hidden="true" />
                <span>Initiate Triage Touchpoint</span>
              </button>
            )}
          </div>
        </div>

        {/* Ethical Non-Certainty & Non-Clinical Safety Mandate */}
        <div
          role="note"
          aria-label="Ethical non-certainty policy"
          className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-start gap-3"
        >
          <Info className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1 text-xs">
            <p className="font-black text-amber-900 dark:text-amber-200 uppercase tracking-wide">
              MANDATORY ETHICAL RULE: PROBABILISTIC OPERATIONAL GUIDANCE — NEVER CLINICAL CERTAINTY
            </p>
            <p className="text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
              Predictive models generate <strong>probabilistic operational signals</strong> to prioritize supportive human outreach. Models <strong>NEVER predict suicide or self-harm with certainty</strong>, and do not make definitive medical or psychiatric diagnoses. All outputs are paired with calibrated uncertainty boundaries.
            </p>
          </div>
        </div>

        {/* =====================================================================
            1. PREDICTION WINDOW SELECTOR: 7 days | 14 days | 30 days
            ===================================================================== */}
        <div className="pt-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
            Select Prediction Horizon (Window):
          </label>
          <div
            role="group"
            aria-label="Prediction Time Window"
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {(['7 days', '14 days', '30 days'] as PredictionWindow[]).map(win => (
              <button
                key={win}
                onClick={() => setSelectedWindow(win)}
                aria-pressed={selectedWindow === win}
                className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                  selectedWindow === win
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 dark:border-indigo-500 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    {win}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      win === '7 days'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : win === '14 days'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {win === '7 days' ? 'Near-Term' : win === '14 days' ? 'Mid-Horizon' : 'Long-Horizon'}
                  </span>
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {win === '7 days'
                    ? 'Immediate milestone & lexical tension focus'
                    : win === '14 days'
                    ? 'Intermediate hearing & engagement cadence shift'
                    : 'Longitudinal baseline & procedural delay stability'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Feature Input Simulator Drawer */}
        {isSimulatorOpen && (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                Multi-Modal Input Simulator (Test Real-time Trajectory Impacts)
              </span>
              <button
                onClick={resetToStandardProfile}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                Reset Standard Features
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 text-xs">
              {/* Baseline Deviation */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <label htmlFor="simBaselineDev">Baseline Deviation:</label>
                  <span className="font-bold text-slate-900 dark:text-white">+{baselineDeviation} pts</span>
                </div>
                <input
                  id="simBaselineDev"
                  type="range"
                  min="-10"
                  max="40"
                  value={baselineDeviation}
                  onChange={e => setBaselineDeviation(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Engagement Change */}
              <div className="space-y-1.5">
                <label htmlFor="simEngagement" className="font-semibold block">Engagement Change:</label>
                <select
                  id="simEngagement"
                  value={engagementChange}
                  onChange={e => setEngagementChange(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium cursor-pointer"
                >
                  <option value="stable">Stable engagement</option>
                  <option value="declining">Declining responses</option>
                  <option value="abrupt_drop">Abrupt cessation (&gt;50% drop)</option>
                  <option value="improving">Improving participation</option>
                </select>
              </div>

              {/* Court Hearing Proximity */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <label htmlFor="simHearingDays">Days to Court Hearing:</label>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {daysToHearing === 0 ? 'None Scheduled' : `${daysToHearing} days`}
                  </span>
                </div>
                <input
                  id="simHearingDays"
                  type="range"
                  min="0"
                  max="30"
                  value={daysToHearing}
                  onChange={e => setDaysToHearing(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              </div>

              {/* Check-in Frequency */}
              <div className="space-y-1.5">
                <label htmlFor="simFrequency" className="font-semibold block">Check-In Frequency:</label>
                <select
                  id="simFrequency"
                  value={checkInFrequency}
                  onChange={e => setCheckInFrequency(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-medium cursor-pointer"
                >
                  <option value="daily">Daily cadence</option>
                  <option value="every few days">Every few days</option>
                  <option value="weekly">Weekly</option>
                  <option value="sporadic">Sporadic / irregular</option>
                </select>
              </div>

              {/* Protective Support Interactions */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <label htmlFor="simInteractions">Past Support Sessions:</label>
                  <span className="font-bold text-slate-900 dark:text-white">{supportInteractions} sessions</span>
                </div>
                <input
                  id="simInteractions"
                  type="range"
                  min="0"
                  max="8"
                  value={supportInteractions}
                  onChange={e => setSupportInteractions(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Acoustic Tension Toggle */}
              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="flex items-center gap-2 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={threatReported}
                    onChange={e => setThreatReported(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 accent-rose-600"
                  />
                  <span>Reported Threats on Record</span>
                </label>
                <label className="flex items-center gap-2 font-semibold cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={voiceJitterPresent}
                    onChange={e => setVoiceJitterPresent(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
                  />
                  <span>Acoustic Vocal Jitter &gt; 4.0%</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          PREDICTIVE OUTPUT CARDS
          1. Risk Indicator Statement (e.g. “Elevated distress signal over the next 7 days.”)
          2. Confidence
          3. Time Horizon
          4. Uncertainty Indicator
          ========================================================================= */}
      <section aria-label="Prediction Summary Cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Output 1: Risk Indicator */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-500/80 dark:border-indigo-400 shadow-sm flex flex-col justify-between space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              Operational Risk Indicator
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              HORIZON: {prediction.timeHorizon.toUpperCase()}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 shrink-0 mt-0.5">
                <TrendingUp className="w-6 h-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                  &ldquo;{prediction.riskIndicator}&rdquo;
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                  Synthesized across multi-channel inputs and upcoming procedural milestones.
                </p>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span>Model Version: {prediction.modelVersionTracking.modelVersion}</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">PROBABILISTIC</span>
          </div>
        </div>

        {/* Output 2: Confidence Rating */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Confidence Rating
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
              CALIBRATED
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight">
                {Math.round(prediction.confidence * 100)}%
              </span>
              <span className="text-xs text-slate-500 font-medium">probabilistic certainty</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${prediction.confidence * 100}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Higher near-term data density bolsters 7-day projection certainty.
          </div>
        </div>

        {/* Output 3: Uncertainty Indicator */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Uncertainty Indicator
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              {prediction.uncertaintyIndicator.level}
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-amber-700 dark:text-amber-400 tracking-tight font-mono">
                ±{prediction.uncertaintyIndicator.varianceMarginPts}
              </span>
              <span className="text-xs font-bold text-slate-500">pts margin</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed font-medium">
              {prediction.uncertaintyIndicator.description}
            </p>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Boundaries account for unobserved judicial scheduling variables.
          </div>
        </div>
      </section>

      {/* =========================================================================
          MODEL EXPLANATION: “Why did the indicator change?” (Plain Language)
          & RECOMMENDED FOLLOW-UP
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model Explanation in Plain Language */}
        <section
          aria-labelledby="model-explanation-heading"
          className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              <h2
                id="model-explanation-heading"
                className="text-xl font-black text-slate-900 dark:text-white"
              >
                {prediction.modelExplanation.headline}
              </h2>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Plain-Language Interpretation
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {prediction.modelExplanation.plainLanguageSummary}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Primary Indicator Drivers:
            </span>
            <ul className="space-y-2" aria-label="Primary drivers list">
              {prediction.modelExplanation.primaryDrivers.map((driver, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-semibold"
                >
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contributing Factors Full List */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Contributing Factors (Multimodal Ingestion):
            </span>
            <div className="flex flex-wrap gap-2">
              {prediction.contributingFactors.map((factor, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  {factor}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Recommended Follow-up Card */}
        <section
          aria-labelledby="recommended-followup-heading"
          className="rounded-3xl bg-linear-to-br from-emerald-50/90 via-white to-teal-50/60 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border border-emerald-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <UserCheck className="w-4 h-4" aria-hidden="true" />
              <span>Caseworker Action Standard</span>
            </div>
            <h2
              id="recommended-followup-heading"
              className="text-xl font-black text-slate-900 dark:text-white"
            >
              Recommended Follow-Up
            </h2>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 shadow-xs">
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                {prediction.recommendedFollowUp}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-emerald-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>Section 15A Mandate Compliant</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Provides trauma-informed protective accompaniment without imposing coercive clinical interventions.
            </p>
          </div>
        </section>
      </div>

      {/* =========================================================================
          MODEL VERSION TRACKING & AUDIT LOG TABLE
          Store:
          - model_version
          - prediction_timestamp
          - prediction_window
          - prediction_output
          - confidence
          - input_version
          ========================================================================= */}
      <section
        aria-labelledby="model-tracking-heading"
        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <div>
              <h2
                id="model-tracking-heading"
                className="text-lg font-black text-slate-900 dark:text-white"
              >
                Model Version Tracking &amp; Provenance Log
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Mandatory cryptographic and schema auditing for AI model deployments.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            Active: {prediction.modelVersionTracking.modelVersion}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th scope="col" className="py-3 px-3">Model Version</th>
                <th scope="col" className="py-3 px-3">Timestamp (UTC)</th>
                <th scope="col" className="py-3 px-3">Prediction Window</th>
                <th scope="col" className="py-3 px-3">Prediction Output</th>
                <th scope="col" className="py-3 px-3">Confidence</th>
                <th scope="col" className="py-3 px-3">Input Version</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
              {auditHistory.map((entry, idx) => (
                <tr
                  key={idx}
                  className={idx === 0 ? 'bg-indigo-50/40 dark:bg-indigo-950/20 font-semibold' : ''}
                >
                  <td className="py-3 px-3 font-mono text-indigo-600 dark:text-indigo-400">
                    {entry.modelVersion}
                    {idx === 0 && (
                      <span className="ml-1.5 text-[9px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full font-sans font-bold">
                        Latest
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">
                    {entry.predictionTimestamp}
                  </td>
                  <td className="py-3 px-3 font-bold">
                    {entry.predictionWindow}
                  </td>
                  <td className="py-3 px-3 max-w-xs truncate" title={entry.predictionOutput}>
                    {entry.predictionOutput}
                  </td>
                  <td className="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {Math.round(entry.confidence * 100)}%
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">
                    {entry.inputVersion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
