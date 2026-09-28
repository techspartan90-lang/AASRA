'use client';

import React, { useState, useEffect } from 'react';
import {
  aiDistressEngine,
  DistressAnalysisResponse,
  DistressAnalysisRequest,
} from '@/lib/ai-distress-engine';
import {
  Brain,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Activity,
  FileText,
  Mic,
  Clock,
  Scale,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  TrendingUp,
  UserCheck,
  Server,
  Zap,
} from 'lucide-react';

export function AiDistressExplainabilityPanel() {
  // Interactive Simulation Controls
  const [mood, setMood] = useState<string>('Worried');
  const [textInput, setTextInput] = useState<string>(
    'I feel scared about the court hearing next week. The accused family members were standing near our village market.'
  );
  const [includeVoice, setIncludeVoice] = useState<boolean>(true);
  const [pitchJitter, setPitchJitter] = useState<number>(0.048);
  const [tremorIndex, setTremorIndex] = useState<number>(0.52);
  const [pausesSeconds, setPausesSeconds] = useState<number>(5.2);
  const [missedCheckIns, setMissedCheckIns] = useState<number>(2);
  const [decliningEngagement, setDecliningEngagement] = useState<boolean>(true);
  const [hearingProximityDays, setHearingProximityDays] = useState<number>(3);
  const [reportedThreats, setReportedThreats] = useState<boolean>(true);
  const [baselineScore, setBaselineScore] = useState<number>(58);

  const [analysis, setAnalysis] = useState<DistressAnalysisResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const runAnalysis = async () => {
    setIsCalculating(true);
    const req: DistressAnalysisRequest = {
      survivorId: 'usr-victim-001',
      language: 'hi',
      moodResponse: mood,
      textResponse: textInput,
      voiceAcoustics: includeVoice
        ? {
            hasAudio: true,
            durationSeconds: 22,
            pitchHz: 198,
            pitchJitter,
            speakingRateWpm: 92,
            pausesDurationSeconds: pausesSeconds,
            intensityVarianceDb: 14.2,
            tremorIndex,
          }
        : { hasAudio: false },
      behavioralContext: {
        missedCheckIns,
        decliningEngagement,
        suddenInteractionChange: true,
        repeatedSupportRequests: 2,
      },
      milestoneContext: {
        hearingDateProximityDays: hearingProximityDays,
        investigationStatus: 'chargesheet_filed',
        rehabilitationEventScheduled: false,
        reportedThreatsPresent: reportedThreats,
        caseDelayMonths: 2,
      },
      baselineIndicator: baselineScore,
    };

    const result = await aiDistressEngine.analyzeDistress(req);
    setAnalysis(result);
    setIsCalculating(false);
  };

  useEffect(() => {
    runAnalysis();
  }, [
    mood,
    textInput,
    includeVoice,
    pitchJitter,
    tremorIndex,
    pausesSeconds,
    missedCheckIns,
    decliningEngagement,
    hearingProximityDays,
    reportedThreats,
    baselineScore,
  ]);

  if (!analysis) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-bold text-emerald-400 border border-white/10">
              <Brain className="w-3.5 h-3.5" />
              <span>Phase 5 · Multimodal AI Distress Analysis</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              AI Distress Recognition &amp; Explainability
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Transparent, non-diagnostic inference fusing text sentiment, voluntary voice acoustics, behavioral check-in cadence, and judicial milestone stressors.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-xs self-start md:self-auto">
            <Server className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 block">FastAPI Service Status</span>
              <span className="font-extrabold text-white text-xs">
                {analysis.isFastApiBackend ? 'FastAPI Connected (Port 8000)' : 'Deterministic Local Fallback Engine'}
              </span>
            </div>
          </div>
        </div>

        {/* Ethical Non-Clinical Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Mandatory Governance Boundary:</strong> Never produces a psychiatric or clinical diagnosis. All indicators are decision-support cues strictly intended to assist human caseworkers in prioritizing welfare outreach.
          </span>
        </div>
      </div>

      {/* Primary Indicator Score & High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Distress Indicator */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Distress Indicator
            </span>
            <Activity className="w-4 h-4 text-rose-500" />
          </div>
          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
                {analysis.distress_indicator}
              </span>
              <span className="text-base text-slate-500 font-semibold">/ 100</span>
            </div>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-extrabold ${
                analysis.distress_indicator >= 75
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  : analysis.distress_indicator >= 50
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}
            >
              {analysis.distress_indicator >= 75
                ? 'Elevated Situational Distress'
                : analysis.distress_indicator >= 50
                ? 'Moderate Stress Load'
                : 'Balanced Emotional Baseline'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Model Confidence: {(analysis.confidence * 100).toFixed(0)}%
          </span>
        </div>

        {/* 2. Longitudinal Trend Change */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Baseline Deviation
            </span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="my-4">
            <span className="text-xl sm:text-2xl font-black text-indigo-700 dark:text-indigo-400 block leading-tight">
              {analysis.trend_change}
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-2">
              Assessed against 30-day personalized intake baseline of {baselineScore} pts.
            </p>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Updated: {new Date(analysis.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* 3. Actionable Follow-Up Pathway */}
        <div className="p-6 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Recommended Follow-Up
            </span>
            <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="my-3">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
              {analysis.recommended_follow_up}
            </p>
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
            Human Caseworker Pathway · No Automated Intervention
          </span>
        </div>
      </div>

      {/* =========================================================================
          EXPLAINABILITY PANEL: “Signals contributing to this indicator”
          ========================================================================= */}
      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Multi-Signal Transparency</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Signals contributing to this indicator
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
            Every score is decomposed into plain-language human explanations so caseworkers understand why an indicator shifted.
          </p>
        </div>

        {/* Signals List with Category Badges */}
        <div className="space-y-3.5">
          {analysis.contributing_signals.map((sig, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-start gap-3.5 transition hover:border-indigo-300 dark:hover:border-indigo-700"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                {idx + 1}
              </div>
              <div className="space-y-1">
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  {sig}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {sig.includes('court hearing')
                    ? 'Situational stressor: Court appearances frequently produce temporary acute anxiety peaks.'
                    : sig.includes('fear')
                    ? 'Language analysis: Vocabulary matches environmental security and intimidation concerns.'
                    : sig.includes('jitter') || sig.includes('tremor')
                    ? 'Acoustic telemetry: Involuntary micro-tremors detected in voluntary voice recording.'
                    : sig.includes('missed')
                    ? 'Engagement cadence: Departure from established routine check-in habits.'
                    : 'Contributing factor validated by multimodal inference engine.'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 4 Analysis Module Breakdown Cards */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Analysis Modules In Detail
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Text Analysis */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <FileText className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">1. Text Analysis</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Scans for hopelessness, fear/anxiety, social withdrawal, and self-harm keywords across 10 Indian regional languages.
              </p>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                Active · Vocabulary Heuristic &amp; Transformer Screening
              </span>
            </div>

            {/* 2. Voice Acoustics */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Mic className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">2. Voice Acoustics</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Extracts pitch jitter, speaking rate (WPM), hesitation pause lengths, and tremor perturbation from voluntary voice notes.
              </p>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                Active · 8kHz - 48kHz Acoustic Telemetry
              </span>
            </div>

            {/* 3. Behavioral Analysis */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">3. Behavioral Cadence</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Tracks missed check-ins, declining engagement depth, abrupt time shifts, and frequency of human callback requests.
              </p>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                Active · Temporal Cadence Evaluation
              </span>
            </div>

            {/* 4. Case Milestone Context */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Scale className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">4. Case Milestones</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Contextualizes emotional state against upcoming court hearings, chargesheets, investigation delays, and threat reports.
              </p>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                Active · Legal Timeline Context Integration
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE AI SIMULATION SANDBOX
          Allows evaluators / caseworkers to test the inference model interactively.
          ========================================================================= */}
      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Interactive Model Evaluation Sandbox</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Simulate Multimodal Signals
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Adjust text, voice acoustics, missed check-ins, and milestone proximity to observe real-time inference recalculation.
            </p>
          </div>

          <button
            onClick={() => {
              setMood('Okay');
              setTextInput('Routine check-in today. Slept moderately well.');
              setPitchJitter(0.02);
              setTremorIndex(0.2);
              setPausesSeconds(1.5);
              setMissedCheckIns(0);
              setDecliningEngagement(false);
              setHearingProximityDays(21);
              setReportedThreats(false);
              setBaselineScore(50);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Baseline</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Left Column: Text & Mood Inputs */}
          <div className="space-y-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Survivor Stated Mood:
              </label>
              <div className="flex flex-wrap gap-2">
                {['Calm', 'Okay', 'Worried', 'Overwhelmed', 'Need support'].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                      mood === m
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="sim-text" className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Written / Spoken Reflection Text:
              </label>
              <textarea
                id="sim-text"
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Case Milestone Situational Context:
              </span>
              <div className="flex items-center justify-between">
                <span>Days to Next Court Hearing:</span>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={hearingProximityDays}
                  onChange={e => setHearingProximityDays(Number(e.target.value))}
                  className="w-20 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-right bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="flex items-center justify-between">
                <span>Reported Threat / Intimidation on Record:</span>
                <input
                  type="checkbox"
                  checked={reportedThreats}
                  onChange={e => setReportedThreats(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Voice & Behavioral Sliders */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Voice Acoustic Telemetry:
                </span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeVoice}
                    onChange={e => setIncludeVoice(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span className="font-semibold">Include Audio</span>
                </label>
              </div>

              {includeVoice && (
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between">
                      <span>Pitch Jitter: {(pitchJitter * 100).toFixed(1)}%</span>
                      <span className="text-slate-400">Threshold: &gt; 4.0%</span>
                    </div>
                    <input
                      type="range"
                      min="0.01"
                      max="0.08"
                      step="0.005"
                      value={pitchJitter}
                      onChange={e => setPitchJitter(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between">
                      <span>Vocal Tremor Index: {tremorIndex.toFixed(2)}</span>
                      <span className="text-slate-400">Threshold: &gt; 0.45</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.9"
                      step="0.05"
                      value={tremorIndex}
                      onChange={e => setTremorIndex(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between">
                      <span>Hesitation Pauses: {pausesSeconds.toFixed(1)}s</span>
                      <span className="text-slate-400">Normal: &lt; 2.5s</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="10.0"
                      step="0.5"
                      value={pausesSeconds}
                      onChange={e => setPausesSeconds(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Behavioral Engagement Shifts:
              </span>
              <div className="flex items-center justify-between">
                <span>Missed Check-Ins (Past 14 Days):</span>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={missedCheckIns}
                  onChange={e => setMissedCheckIns(Number(e.target.value))}
                  className="w-16 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-right bg-white dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="flex items-center justify-between">
                <span>Declining Engagement Depth (&gt;40% drop):</span>
                <input
                  type="checkbox"
                  checked={decliningEngagement}
                  onChange={e => setDecliningEngagement(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
