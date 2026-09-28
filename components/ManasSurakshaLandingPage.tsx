'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Shield,
  ShieldCheck,
  Lock,
  HeartPulse,
  Activity,
  PhoneCall,
  MessageSquare,
  Phone,
  Smartphone,
  Laptop,
  CheckCircle2,
  ArrowRight,
  FileText,
  Users,
  Volume2,
  Globe2,
  Sliders,
  Sparkles,
  Clock,
  Compass,
  FileCheck,
  Server,
  Database,
  Radio,
  ExternalLink,
  ChevronRight,
  Headphones,
  Check,
  Eye,
  EyeOff,
  Bell,
  Scale,
  LogOut,
} from 'lucide-react';

interface ManasSurakshaLandingPageProps {
  onSelectAction: (view: string, roleTarget?: string) => void;
}

export function ManasSurakshaLandingPage({ onSelectAction }: ManasSurakshaLandingPageProps) {
  const {
    setRole,
    setIsEmergencyModalOpen,
    setIsVoiceAssistantOpen,
    setIsDemoModalOpen,
    setIsLoginModalOpen,
    setIsOnboardingModalOpen,
  } = useApp();

  // Interactive Survivor Autonomy Preview States (Section 4)
  const [autonomyFrequency, setAutonomyFrequency] = useState<'weekly' | 'biweekly' | 'on_demand'>('weekly');
  const [allowVoiceAnalysis, setAllowVoiceAnalysis] = useState<boolean>(true);
  const [allowCounsellorAlerts, setAllowCounsellorAlerts] = useState<boolean>(true);
  const [selectedChannelTab, setSelectedChannelTab] = useState<number>(0);
  const [privacyTab, setPrivacyTab] = useState<'consent' | 'minimization' | 'encryption' | 'rbac' | 'storage' | 'audit'>('consent');

  // Quick emergency exit (redirects safely away)
  const handleQuickExit = () => {
    window.location.replace('https://www.google.com');
  };

  return (
    <div className="space-y-20 pb-16 transition-colors">
      {/* Trauma-Informed Safety Bar / Quick Exit */}
      <aside aria-label="Trauma-Informed Emergency Banner" className="rounded-2xl bg-amber-500/10 border border-amber-500/25 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-950 dark:text-amber-200">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
          <span className="font-semibold">
            Confidential & Safe Space:
          </span>
          <span className="text-amber-900/80 dark:text-amber-300/80 hidden sm:inline">
            Your privacy and dignity come first. Need to leave immediately?
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>24/7 Helpline: 14566</span>
          </button>
          <button
            onClick={handleQuickExit}
            title="Quickly close this site and open Google"
            className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium transition flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>Quick Exit</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          SECTION 1 — HERO
          ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-slate-50 via-white to-slate-100/70 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-12 lg:p-16">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] dark:bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />
        
        <div className="relative max-w-5xl mx-auto space-y-8 text-center">
          {/* Institutional Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-slate-800/95 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs">
            <Shield className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
            <span>Manas Suraksha · National Survivor Welfare & Mental Health Initiative</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Supporting Mental Well-Being Throughout the Justice Journey
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Manas Suraksha provides privacy-first, AI-assisted mental-health monitoring and early distress recognition through accessible digital and offline channels.
          </p>

          {/* Purpose Statement Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 max-w-3xl mx-auto">
            <p className="text-xs sm:text-sm font-semibold text-indigo-950 dark:text-indigo-200 leading-relaxed italic">
              &ldquo;Continuous mental-health support and early distress recognition for survivors, designed around safety, privacy, dignity, and survivor control.&rdquo;
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                setRole('victim');
                setIsOnboardingModalOpen(true);
              }}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 cursor-pointer min-h-[48px]"
            >
              <HeartPulse className="w-4 h-4" />
              <span>Get Support</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            <button
              onClick={() => {
                setIsLoginModalOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white dark:border-slate-700 font-semibold text-sm transition cursor-pointer min-h-[48px] shadow-xs"
            >
              <Lock className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
              <span>Secure Login (5 Roles)</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-medium text-sm transition cursor-pointer min-h-[48px]"
            >
              <Compass className="w-4 h-4 text-slate-500" />
              <span>Learn How It Works</span>
            </button>
          </div>

          {/* Subtle Vector Representation of 4 Core Pillars (No Stereotypical Imagery) */}
          <div className="pt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-2.5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-xs font-bold text-slate-900 dark:text-white">Survivor Support</h2>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Dignified, trauma-informed guidance</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2.5">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xs font-bold text-slate-900 dark:text-white">Secure Communication</h2>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Encrypted, multi-channel privacy</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2.5">
                  <Activity className="w-6 h-6" />
                </div>
                <h2 className="text-xs font-bold text-slate-900 dark:text-white">Well-Being Monitoring</h2>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Gentle longitudinal calibration</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2.5">
                  <Users className="w-6 h-6" />
                </div>
                <h2 className="text-xs font-bold text-slate-900 dark:text-white">Counsellor Connection</h2>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Human-in-the-loop care linkage</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — HOW IT WORKS
          Horizontal four-stage visual flow closely matching the reference architecture:
          Detection → Recognition & Selection → Working Memory → Consolidation
          Four rounded rectangular blocks with large arrows, 4 distinct pastel colors,
          large headings above, clean background, simple vector-style illustrations.
          ========================================================================= */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-indigo-700 dark:text-sky-400 mb-3">
            <Radio className="w-3.5 h-3.5" />
            <span>Operational Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            How Manas Suraksha Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            A continuous, multi-stage screening pathway ensuring no distress signal goes unrecognized while preserving total survivor sovereignty.
          </p>
        </div>

        {/* 4-Stage Horizontal Visual Flow */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* Stage 1: Detection */}
            <div className="relative flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-400 mb-2 block">
                Stage 01
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                Detection
              </h3>
              <div className="flex-1 p-6 rounded-3xl bg-[#f0f8ff] dark:bg-sky-950/30 border-2 border-sky-200 dark:border-sky-800/80 shadow-sm flex flex-col justify-between transition hover:shadow-md">
                <div>
                  {/* Clean vector-style illustration */}
                  <div className="w-14 h-14 rounded-2xl bg-sky-200/80 dark:bg-sky-900/60 flex items-center justify-center text-sky-700 dark:text-sky-300 mb-5 shadow-xs">
                    <Radio className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    Multi-Channel Detection
                  </h4>
                  <p className="mt-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    Chatbot, IVRS, SMS, mobile app, web portal and NHAA 14566 integration.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-sky-200 dark:border-sky-800/60 flex items-center gap-1.5 text-[11px] font-semibold text-sky-800 dark:text-sky-300">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Low-bandwidth & offline enabled</span>
                </div>
              </div>

              {/* Connecting Arrow for Desktop */}
              <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 items-center justify-center text-slate-500 shadow-xs">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Stage 2: Recognition & Selection */}
            <div className="relative flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-850 dark:text-emerald-400 mb-2 block">
                Stage 02
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                Recognition &amp; Selection
              </h3>
              <div className="flex-1 p-6 rounded-3xl bg-[#f0fbf5] dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800/80 shadow-sm flex flex-col justify-between transition hover:shadow-md">
                <div>
                  {/* Clean vector-style illustration */}
                  <div className="w-14 h-14 rounded-2xl bg-emerald-200/80 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-700 dark:text-emerald-300 mb-5 shadow-xs">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    AI Distress Analysis
                  </h4>
                  <p className="mt-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    Text signals, voice characteristics, engagement patterns and case milestones.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Explainable multi-signal feature extraction</span>
                </div>
              </div>

              {/* Connecting Arrow for Desktop */}
              <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 items-center justify-center text-slate-500 shadow-xs">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Stage 3: Working Memory */}
            <div className="relative flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-850 dark:text-amber-400 mb-2 block">
                Stage 03
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                Working Memory
              </h3>
              <div className="flex-1 p-6 rounded-3xl bg-[#fffbf0] dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800/80 shadow-sm flex flex-col justify-between transition hover:shadow-md">
                <div>
                  {/* Clean vector-style illustration */}
                  <div className="w-14 h-14 rounded-2xl bg-amber-200/80 dark:bg-amber-900/60 flex items-center justify-center text-amber-700 dark:text-amber-300 mb-5 shadow-xs">
                    <Activity className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    Dynamic Distress Assessment
                  </h4>
                  <p className="mt-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    Personalized 0–100 distress indicators and longitudinal risk modelling.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-amber-200 dark:border-amber-800/60 flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Zero fabricated baselines · Resting anchor 40</span>
                </div>
              </div>

              {/* Connecting Arrow for Desktop */}
              <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 items-center justify-center text-slate-500 shadow-xs">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Stage 4: Consolidation */}
            <div className="relative flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-850 dark:text-purple-400 mb-2 block">
                Stage 04
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                Consolidation
              </h3>
              <div className="flex-1 p-6 rounded-3xl bg-[#f8f5ff] dark:bg-purple-950/30 border-2 border-purple-200 dark:border-purple-800/80 shadow-sm flex flex-col justify-between transition hover:shadow-md">
                <div>
                  {/* Clean vector-style illustration */}
                  <div className="w-14 h-14 rounded-2xl bg-purple-200/80 dark:bg-purple-900/60 flex items-center justify-center text-purple-700 dark:text-purple-300 mb-5 shadow-xs">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    Support &amp; Intervention
                  </h4>
                  <p className="mt-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    Alerts, counselling workflows and role-based dashboards.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-purple-200 dark:border-purple-800/60 flex items-center gap-1.5 text-[11px] font-semibold text-purple-800 dark:text-purple-300">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Authorized caseworker triage &amp; clinical hand-off</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cognitive Flow Sequence Bar */}
        <div className="mt-10 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs">
          <span className="text-slate-500 dark:text-slate-400">Processing Architecture:</span>
          <span className="px-2.5 py-1 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-900 dark:text-sky-300 font-bold">Detection</span>
          <span className="text-slate-400">→</span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-bold">Recognition &amp; Selection</span>
          <span className="text-slate-400">→</span>
          <span className="px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold">Working Memory</span>
          <span className="text-slate-400">→</span>
          <span className="px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 font-bold">Consolidation</span>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — CORE DIFFERENTIATORS
          Five professional feature sections:
          1. Offline-capable
          2. Trusted voice personalization
          3. Cost-efficient monitoring
          4. Multilingual
          5. Universal technology access
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Inclusive Civic Engineering</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Core Differentiators
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Engineered specifically for the real-world conditions of justice-involved survivors across urban and remote rural India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Offline-capable */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition hover:shadow-md">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5">
                <Radio className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                01 · Resilient Reach
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Offline-Capable
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                SMS and IVRS support for limited-connectivity environments. Survivors can complete distress check-ins over 2G networks without internet access or data charges.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Zero-data toll-free telephony protocol</span>
            </div>
          </div>

          {/* 2. Trusted voice personalization */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition hover:shadow-md">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-5">
                <Volume2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                02 · Trauma-Informed Voice
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Trusted Voice Personalization
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Consent-based voice personalization for IVRS. Survivors select preferred comforting tones, dialect familiarity, and paced speech to minimize acoustic trigger anxiety.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Opt-in regional cadence calibration</span>
            </div>
          </div>

          {/* 3. Cost-efficient monitoring */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition hover:shadow-md">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                03 · Scalable Public Health
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Cost-Efficient Monitoring
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Continuous digital monitoring designed to expand access to support. Enables single district officers and NGO counsellors to monitor hundreds of vulnerable cases proactively.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Prioritization triage prevents caseworker burnout</span>
            </div>
          </div>

          {/* 4. Multilingual */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition hover:shadow-md">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-5">
                <Globe2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                04 · Linguistic Sovereignty
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Multilingual Support
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Support for 10+ Indian languages including Hindi, Bengali, Assamese, Khasi, Mizo, Manipuri, Bodo, Nepali, Tamil, and English with phonetic speech processing.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>10+ Constitutionally recognized regional tongues</span>
            </div>
          </div>

          {/* 5. Universal technology access */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition hover:shadow-md md:col-span-2 lg:col-span-2">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5">
                <Smartphone className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                05 · Zero Barrier Entry
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Universal Technology Access
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Seamless support across the entire hardware continuum: Feature phone (IVRS &amp; SMS) → Smartphone (Accessible PWA with biometrics &amp; offline cache) → Desktop (Caseworker &amp; Administrator portal).
              </p>
            </div>
            
            {/* Visual Hardware Spectrum */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <Phone className="w-4 h-4 mx-auto text-slate-600 dark:text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Feature Phone</span>
                <span className="text-[10px] text-slate-500">2G / IVRS / SMS</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <Smartphone className="w-4 h-4 mx-auto text-slate-600 dark:text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Smartphone</span>
                <span className="text-[10px] text-slate-500">App / Touch / Voice</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <Laptop className="w-4 h-4 mx-auto text-slate-600 dark:text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Desktop</span>
                <span className="text-[10px] text-slate-500">Admin / Caseworker</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — TRAUMA-INFORMED DESIGN
          Dedicated section with calm visual storytelling explaining:
          - “No forced disclosure.”
          - “Survivors control what is monitored.”
          - “Survivors control how frequently they interact.”
          - “Survivors control who can access their information.”
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="relative max-w-4xl mx-auto text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Survivor Autonomy &amp; Dignity</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Trauma-Informed Design Principles
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              We reject predatory algorithmic surveillance. Every interaction in Manas Suraksha is designed around survivor pacing, psychological safety, and explicit personal control.
            </p>
          </div>

          {/* Four Core Trauma-Informed Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition hover:bg-white/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                &ldquo;No forced disclosure.&rdquo;
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Survivors are never pressured to recount traumatic details or answer invasive questions. Check-ins use gentle 5-point well-being scales, and every prompt includes an unpenalized &lsquo;Skip for now&rsquo; option.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition hover:bg-white/10">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                &ldquo;Survivors control what is monitored.&rdquo;
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Survivors decide which signals are active. Optional supplementary voice features can be paused with a single toggle at any time without forfeiting access to human counselling or support.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition hover:bg-white/10">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                &ldquo;Survivors control how frequently they interact.&rdquo;
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Choose weekly, bi-weekly, post-court milestone, or strictly on-demand interactions. The system adapts to the survivor&rsquo;s personal emotional rhythm rather than enforcing rigid institutional mandates.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition hover:bg-white/10">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">
                &ldquo;Survivors control who can access their information.&rdquo;
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Strict cryptographic separation between health and judicial data. Police officers cannot view psychological notes; welfare officers see only anonymized eligibility status.
              </p>
            </div>
          </div>

          {/* Interactive Survivor Autonomy Preview Card */}
          <div className="mt-10 p-6 rounded-2xl bg-black/40 border border-white/15 max-w-2xl mx-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>Interactive Survivor Autonomy Controls</span>
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                100% Survivor Owned
              </span>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Preferred Contact Cadence</span>
                  <span className="text-slate-400 text-[11px]">How often you wish to receive gentle check-in prompts</span>
                </div>
                <div className="flex items-center gap-1 bg-white/10 p-1 rounded-lg">
                  <button
                    onClick={() => setAutonomyFrequency('weekly')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                      autonomyFrequency === 'weekly' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setAutonomyFrequency('biweekly')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                      autonomyFrequency === 'biweekly' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Bi-Weekly
                  </button>
                  <button
                    onClick={() => setAutonomyFrequency('on_demand')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                      autonomyFrequency === 'on_demand' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    On-Demand
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div>
                  <span className="font-semibold text-white block">Optional Voice Distress Analysis</span>
                  <span className="text-slate-400 text-[11px]">Analyze vocal inflection to assist counsellor without saving audio</span>
                </div>
                <button
                  onClick={() => setAllowVoiceAnalysis(!allowVoiceAnalysis)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    allowVoiceAnalysis ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {allowVoiceAnalysis ? 'Enabled' : 'Paused'}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div>
                  <span className="font-semibold text-white block">Authorized Counsellor Direct Alerts</span>
                  <span className="text-slate-400 text-[11px]">Notify Dr. Priya Nair if acute distress trajectory spikes</span>
                </div>
                <button
                  onClick={() => setAllowCounsellorAlerts(!allowCounsellorAlerts)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    allowCounsellorAlerts ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {allowCounsellorAlerts ? 'Active' : 'Paused'}
                </button>
              </div>

              {/* Full 7-Step Onboarding Modal CTA */}
              <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-slate-300">
                  Experience the complete 7-step trauma-informed onboarding workflow.
                </span>
                <button
                  onClick={() => {
                    setRole('victim');
                    setIsOnboardingModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start 7-Step Survivor Onboarding</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — CHANNELS
          Display:
          Chatbot · IVRS · SMS · Mobile App · Web Portal · NHAA 14566
          Use appropriate icons.
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-purple-700 dark:text-purple-400 mb-3">
            <Radio className="w-3.5 h-3.5" />
            <span>Accessible Multi-Channel Delivery</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Available Channels
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Support is delivered through whichever channel is safest, most accessible, and most comfortable for the survivor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Chatbot */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition hover:border-indigo-400 dark:hover:border-indigo-600">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Chatbot
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Multilingual conversational interface designed with empathetic, low-cognitive-load questions and pictorial mood cards.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>Text &amp; Tap Interface</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* 2. IVRS */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition hover:border-purple-400 dark:hover:border-purple-600">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                IVRS (Interactive Voice)
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Toll-free automated voice check-ins with natural dialect recognition. Ideal for non-literate survivors or remote areas.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
              <span>Voice / Dial-In</span>
              <button
                onClick={() => setIsVoiceAssistantOpen(true)}
                className="hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Test Voice</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3. SMS */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition hover:border-emerald-400 dark:hover:border-emerald-600">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                SMS
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Lightweight numerical prompts (e.g. reply 1 to 5) that function reliably on standard basic 2G handsets without mobile data.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Basic Handset Support</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* 4. Mobile App */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition hover:border-sky-400 dark:hover:border-sky-600">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Mobile App
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Privacy-hardened Progressive Web App (PWA) with biometric locking, offline encrypted storage, and rapid disguise mode.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span>iOS &amp; Android PWA</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* 5. Web Portal */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition hover:border-amber-400 dark:hover:border-amber-600">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Web Portal
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Accessible, WCAG 2.1 AA certified portal with high contrast options, screen reader compatibility, and font adjustment.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span>WCAG 2.1 AA Certified</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* 6. NHAA 14566 */}
          <div className="p-6 rounded-3xl bg-linear-to-br from-rose-50 to-white dark:from-rose-950/30 dark:to-slate-900 border-2 border-rose-200 dark:border-rose-900/60 shadow-xs flex flex-col justify-between transition hover:border-rose-400">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
                <PhoneCall className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-600 text-white tracking-wider">
                National Helpline
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                NHAA 14566 Integration
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Direct integration with the National Helpline Against Atrocities (NHAA) 14566 for instant human operator escalation and crisis routing.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-rose-200 dark:border-rose-900/60 flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-300">
              <span>24/7 Toll-Free Escalation</span>
              <button
                onClick={() => setIsEmergencyModalOpen(true)}
                className="hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Call Helpline</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6 — PRIVACY
          Strong privacy section explaining:
          - consent management
          - data minimization
          - encryption
          - role-based access
          - secure storage
          - audit trails
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
              <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400" />
              <span>Cryptographic Trust &amp; Governance</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Institutional Privacy Architecture
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Built on the principles of the Indian Digital Personal Data Protection Act (DPDPA) and global medical confidentiality standards.
            </p>
          </div>

          {/* Privacy Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Consent Management */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-300 mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Consent Management
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                Consent is explicit, milestone-specific, and fully revocable at any stage. Survivors can withdraw or pause monitoring without affecting legal counsel or case aid.
              </p>
            </div>

            {/* Data Minimization */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Data Minimization
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                We store only mathematical distress vectors and longitudinal scores. Full narrative journals or recordings are processed ephemerally and never preserved in raw AI logs.
              </p>
            </div>

            {/* Encryption */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-700 dark:text-purple-300 mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                End-to-End Encryption
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                All transit utilizes TLS 1.3 encryption. At-rest databases employ AES-256 field-level tokenization. Personally identifiable names and case files are cryptographically decoupled.
              </p>
            </div>

            {/* Role-Based Access Control */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-700 dark:text-sky-300 mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Role-Based Access (RBAC)
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                Strict least-privilege scoping. Victims see their own history; authorized counsellors view assigned cases; administrators and officers see only anonymized geographic aggregates.
              </p>
            </div>

            {/* Secure Storage */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-300 mb-4">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Secure Sovereign Storage
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                Resident within Indian sovereign cloud infrastructure with Row-Level Security (RLS) enforcement, automated hourly backups, and isolated tenant partitions.
              </p>
            </div>

            {/* Audit Trails */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-700 dark:text-rose-300 mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Immutable Audit Trails
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                Every record access, check-in viewing, and intervention alert creates a tamper-evident audit log with cryptographic timestamps and actor attribution.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Want to inspect the technical architecture and compliance specifications?
            </span>
            <button
              onClick={() => onSelectAction('privacy')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            >
              <span>Explore Privacy &amp; Audit Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7 — FINAL CTA
          Headline:
          “Support should be accessible before distress becomes a crisis.”
          Buttons:
          “Get Support”
          “Explore the Platform”
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl bg-linear-to-r from-indigo-700 via-indigo-600 to-indigo-800 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 text-white p-8 sm:p-14 lg:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="relative max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Immediate Confidential Assistance</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Support should be accessible before distress becomes a crisis.
            </h2>

            <p className="text-sm sm:text-base text-indigo-100 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Connect with empathetic counsellors, track personal well-being milestones safely, and ensure continuous mental health care throughout the legal process.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  setRole('victim');
                  setIsOnboardingModalOpen(true);
                }}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-indigo-900 font-extrabold text-sm transition shadow-lg cursor-pointer min-h-[48px]"
              >
                <HeartPulse className="w-4 h-4 text-indigo-600" />
                <span>Get Support (Start Onboarding)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsLoginModalOpen(true);
                }}
                className="flex items-center gap-2 px-7 py-4 rounded-xl bg-indigo-900/80 hover:bg-indigo-900 border border-white/30 text-white font-bold text-sm transition cursor-pointer min-h-[48px]"
              >
                <Lock className="w-4 h-4 text-emerald-300" />
                <span>Sign In to Your Account</span>
              </button>

              <button
                onClick={() => {
                  setIsDemoModalOpen(true);
                }}
                className="flex items-center gap-2 px-6 py-4 rounded-xl bg-indigo-950/50 hover:bg-indigo-950/70 border border-white/20 text-indigo-200 font-semibold text-sm transition cursor-pointer min-h-[48px]"
              >
                <Sparkles className="w-4 h-4 text-indigo-300" />
                <span>Explore the Platform</span>
              </button>
            </div>

            {/* Helpline Directory Footer */}
            <div className="pt-8 border-t border-white/15 text-xs text-indigo-200 dark:text-slate-400">
              <p className="font-semibold text-white mb-2">Emergency &amp; Crisis Helplines (24x7 Free):</p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-white">
                <button
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="hover:underline flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-300" />
                  <span>NHAA Toll-Free: 14566</span>
                </button>
                <span>·</span>
                <button
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="hover:underline flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-sky-300" />
                  <span>Tele-MANAS: 14416</span>
                </button>
                <span>·</span>
                <button
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="hover:underline flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-rose-300" />
                  <span>National Emergency: 112</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
