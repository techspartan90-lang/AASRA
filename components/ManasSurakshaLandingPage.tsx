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
  FileCheck,
  Server,
  Radio,
  ChevronRight,
  Sliders,
  Sparkles,
  Clock,
  Compass,
  LogOut,
  Volume2,
  Globe2,
  Users,
} from 'lucide-react';
import {
  ThreeDHero,
  ThreeDShield,
  LuxuryCard,
  GlassPanel,
  LuxuryButton,
  PremiumBadge,
} from '@/components/design-system';

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

  const [autonomyFrequency, setAutonomyFrequency] = useState<'weekly' | 'biweekly' | 'on_demand'>('weekly');
  const [allowVoiceAnalysis, setAllowVoiceAnalysis] = useState<boolean>(true);
  const [allowCounsellorAlerts, setAllowCounsellorAlerts] = useState<boolean>(true);

  const handleQuickExit = () => {
    window.location.replace('https://www.google.com');
  };

  return (
    <div className="space-y-24 pb-20 select-none">
      {/* =========================================================================
          TRAUMA-INFORMED SAFETY BAR / QUICK EXIT
          ========================================================================= */}
      <aside
        aria-label="Trauma-Informed Emergency Banner"
        className="glass-card px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-[#FD1053]/25 bg-[#FD1053]/5 dark:bg-[#FD1053]/10 text-[#333333] dark:text-[#F5F5F5]"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FD1053] animate-ping shrink-0" />
          <span className="font-bold text-[#FD1053]">
            Confidential & Safe Space:
          </span>
          <span className="text-[#474747] dark:text-[#D6D6D6] hidden sm:inline">
            Your privacy and dignity come first. Need to leave immediately?
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() => setIsEmergencyModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#FD1053] hover:bg-[#e00b46] text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[0_2px_8px_rgba(253,16,83,0.3)] text-xs"
          >
            <PhoneCall className="w-3.5 h-3.5 fill-white" />
            <span>24/7 Helpline: 14566</span>
          </button>
          <button
            type="button"
            onClick={handleQuickExit}
            title="Quickly close this site and open Google"
            className="px-3 py-1.5 rounded-xl bg-[#474747]/10 hover:bg-[#474747]/20 dark:bg-white/10 dark:hover:bg-white/15 text-[#333333] dark:text-white font-medium transition flex items-center gap-1 cursor-pointer text-xs"
          >
            <LogOut className="w-3.5 h-3.5 text-[#FD1053]" />
            <span>Quick Exit</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          SECTION 1 — LUXURY 3D HERO (Sections 10, 11, 12, 13)
          ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-12 lg:p-16 border-[#474747]/20 dark:border-white/10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline, Pill, Subtitle & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Institutional Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#333333]/5 dark:bg-white/5 border border-[#474747]/20 dark:border-white/10 text-xs font-semibold text-[#333333] dark:text-white">
              <span className="w-2 h-2 rounded-full bg-[#FD1053] shadow-[0_0_6px_#FD1053]" />
              <span className="font-bold text-[#FD1053]">MANAS SURAKSHA</span>
              <span className="text-[#6B7280] dark:text-[#A3A3A3]">·</span>
              <span className="text-[#474747] dark:text-[#D6D6D6] tracking-wider uppercase text-[10px]">
                Private • Human-Centered • AI-Assisted
              </span>
            </div>

            {/* Main Luxury Hero Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#333333] dark:text-white leading-[1.12]">
              Supporting mental well-being through every stage of the justice journey.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#474747] dark:text-[#D6D6D6] max-w-2xl leading-relaxed font-normal">
              Privacy-first, AI-assisted mental-health monitoring and early distress recognition designed around safety, dignity and survivor control.
            </p>

            {/* Hero CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <LuxuryButton
                variant="primary"
                size="lg"
                onClick={() => {
                  setRole('victim');
                  setIsOnboardingModalOpen(true);
                }}
                leftIcon={<HeartPulse className="w-4 h-4" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                GET SUPPORT
              </LuxuryButton>

              <LuxuryButton
                variant="secondary"
                size="lg"
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                leftIcon={<Compass className="w-4 h-4 text-[#FD1053]" />}
              >
                HOW IT WORKS
              </LuxuryButton>

              <LuxuryButton
                variant="tertiary"
                size="md"
                onClick={() => setIsLoginModalOpen(true)}
                leftIcon={<Lock className="w-4 h-4" />}
              >
                Secure Login
              </LuxuryButton>
            </div>

            {/* Institutional Guarantee Note */}
            <div className="pt-4 border-t border-[#474747]/15 dark:border-white/10 flex items-center gap-3 text-xs text-[#6B7280] dark:text-[#A3A3A3]">
              <ShieldCheck className="w-4 h-4 text-[#FD1053] shrink-0" />
              <span>Statutory protection under SC/ST PoA Act §15A & DPDPA 2023 End-to-End Cryptography</span>
            </div>
          </div>

          {/* Right Column: 3D Visual Centerpiece */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full max-w-[440px] aspect-square rounded-3xl glass-card p-2 border border-[#FD1053]/20 dark:border-white/10 relative overflow-hidden shadow-2xl">
              <ThreeDHero className="w-full h-full" interactive />
              <div className="absolute bottom-3 left-3 right-3 text-center pointer-events-none">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#A3A3A3] bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
                  Protection • Connection • Well-Being
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="mt-14 pt-10 border-t border-[#474747]/15 dark:border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <LuxuryCard className="p-5 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-[#474747]/10 dark:bg-white/5 border border-[#474747]/20 dark:border-white/10 flex items-center justify-center text-[#FD1053] mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-sm font-bold text-[#333333] dark:text-white">Survivor Support</h2>
              <p className="text-xs text-[#474747] dark:text-[#A3A3A3] mt-1 leading-relaxed">
                Dignified, trauma-informed guidance
              </p>
            </LuxuryCard>

            <LuxuryCard className="p-5 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-[#474747]/10 dark:bg-white/5 border border-[#474747]/20 dark:border-white/10 flex items-center justify-center text-[#FD1053] mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-sm font-bold text-[#333333] dark:text-white">Secure Communication</h2>
              <p className="text-xs text-[#474747] dark:text-[#A3A3A3] mt-1 leading-relaxed">
                Encrypted, multi-channel privacy
              </p>
            </LuxuryCard>

            <LuxuryCard className="p-5 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-[#474747]/10 dark:bg-white/5 border border-[#474747]/20 dark:border-white/10 flex items-center justify-center text-[#FD1053] mb-3">
                <Activity className="w-6 h-6" />
              </div>
              <h2 className="text-sm font-bold text-[#333333] dark:text-white">Well-Being Monitoring</h2>
              <p className="text-xs text-[#474747] dark:text-[#A3A3A3] mt-1 leading-relaxed">
                Gentle longitudinal calibration
              </p>
            </LuxuryCard>

            <LuxuryCard className="p-5 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-[#474747]/10 dark:bg-white/5 border border-[#474747]/20 dark:border-white/10 flex items-center justify-center text-[#FD1053] mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-sm font-bold text-[#333333] dark:text-white">Counsellor Connection</h2>
              <p className="text-xs text-[#474747] dark:text-[#A3A3A3] mt-1 leading-relaxed">
                Human-in-the-loop care linkage
              </p>
            </LuxuryCard>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — HOW IT WORKS (OPERATIONAL ARCHITECTURE)
          ========================================================================= */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <PremiumBadge tone="live" className="mb-3">
            Operational Architecture
          </PremiumBadge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#333333] dark:text-white">
            How Manas Suraksha Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#474747] dark:text-[#D6D6D6]">
            A continuous, multi-stage screening pathway ensuring no distress signal goes unrecognized while preserving total survivor sovereignty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {/* Stage 1: Detection */}
          <LuxuryCard className="p-6 flex flex-col justify-between" glowOnHover>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FD1053] mb-1 block">
                Stage 01
              </span>
              <h3 className="text-base font-bold text-[#333333] dark:text-white mb-4">
                Detection
              </h3>
              <div className="w-12 h-12 rounded-xl bg-[#474747]/10 dark:bg-white/5 border border-[#474747]/20 dark:border-white/10 flex items-center justify-center text-[#FD1053] mb-4">
                <Radio className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#333333] dark:text-white">
                Multi-Channel Detection
              </h4>
              <p className="mt-2 text-xs text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                Chatbot, IVRS, SMS, mobile app, web portal, and NHAA 14566 integration.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#474747]/15 dark:border-white/10 flex items-center gap-1.5 text-[11px] font-medium text-[#474747] dark:text-[#D6D6D6]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FD1053] shrink-0" />
              <span>Low-bandwidth & offline enabled</span>
            </div>
          </LuxuryCard>

          {/* Stage 2: Recognition & Selection */}
          <LuxuryCard className="p-6 flex flex-col justify-between" glowOnHover>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FD1053] mb-1 block">
                Stage 02
              </span>
              <h3 className="text-base font-bold text-[#333333] dark:text-white mb-4">
                Recognition & Selection
              </h3>
              <div className="w-12 h-12 rounded-xl bg-[#474747]/10 dark:bg-white/5 border border-[#474747]/20 dark:border-white/10 flex items-center justify-center text-[#FD1053] mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#333333] dark:text-white">
                AI Distress Analysis
              </h4>
              <p className="mt-2 text-xs text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                Text signals, voice characteristics, engagement patterns and case milestones.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#474747]/15 dark:border-white/10 flex items-center gap-1.5 text-[11px] font-medium text-[#474747] dark:text-[#D6D6D6]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FD1053] shrink-0" />
              <span>Explainable multi-signal feature extraction</span>
            </div>
          </LuxuryCard>

          {/* Stage 3: Working Memory */}
          <LuxuryCard className="p-6 flex flex-col justify-between" glowOnHover>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FD1053] mb-1 block">
                Stage 03
              </span>
              <h3 className="text-base font-bold text-[#333333] dark:text-white mb-4">
                Working Memory
              </h3>
              <div className="w-12 h-12 rounded-xl bg-[#474747]/10 dark:bg-white/5 border border-[#474747]/20 dark:border-white/10 flex items-center justify-center text-[#FD1053] mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#333333] dark:text-white">
                Dynamic Distress Assessment
              </h4>
              <p className="mt-2 text-xs text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                Personalized 0–100 distress indicators and longitudinal risk modelling.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#474747]/15 dark:border-white/10 flex items-center gap-1.5 text-[11px] font-medium text-[#474747] dark:text-[#D6D6D6]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FD1053] shrink-0" />
              <span>Zero fabricated baselines · Resting anchor 40</span>
            </div>
          </LuxuryCard>

          {/* Stage 4: Consolidation */}
          <LuxuryCard className="p-6 flex flex-col justify-between" glowOnHover>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FD1053] mb-1 block">
                Stage 04
              </span>
              <h3 className="text-base font-bold text-[#333333] dark:text-white mb-4">
                Consolidation
              </h3>
              <div className="w-12 h-12 rounded-xl bg-[#474747]/10 dark:bg-white/5 border border-[#474747]/20 dark:border-white/10 flex items-center justify-center text-[#FD1053] mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#333333] dark:text-white">
                Support & Intervention
              </h4>
              <p className="mt-2 text-xs text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                Alerts, counselling workflows and role-based dashboards.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#474747]/15 dark:border-white/10 flex items-center gap-1.5 text-[11px] font-medium text-[#474747] dark:text-[#D6D6D6]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FD1053] shrink-0" />
              <span>Authorized caseworker triage & clinical hand-off</span>
            </div>
          </LuxuryCard>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — CORE DIFFERENTIATORS
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <PremiumBadge tone="stable" className="mb-3">
            Civic Healthcare Engineering
          </PremiumBadge>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#333333] dark:text-white">
            Core Differentiators
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#474747] dark:text-[#D6D6D6]">
            Engineered specifically for the real-world conditions of justice-involved survivors across urban and remote rural India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LuxuryCard className="p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#474747]/10 dark:bg-white/5 border border-white/10 flex items-center justify-center text-[#FD1053] mb-4">
                <Radio className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#FD1053] uppercase tracking-wider">
                01 · Resilient Reach
              </span>
              <h3 className="text-base font-bold text-[#333333] dark:text-white mt-1">
                Offline-Capable
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                SMS and IVRS support for limited-connectivity environments. Survivors can complete distress check-ins over 2G networks without internet access or data charges.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#474747]/15 dark:border-white/10 flex items-center gap-2 text-xs font-semibold text-[#474747] dark:text-[#D6D6D6]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Zero-data toll-free telephony protocol</span>
            </div>
          </LuxuryCard>

          <LuxuryCard className="p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#474747]/10 dark:bg-white/5 border border-white/10 flex items-center justify-center text-[#FD1053] mb-4">
                <Volume2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#FD1053] uppercase tracking-wider">
                02 · Trauma-Informed Voice
              </span>
              <h3 className="text-base font-bold text-[#333333] dark:text-white mt-1">
                Trusted Voice Personalization
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                Consent-based voice personalization for IVRS. Survivors select preferred comforting tones, dialect familiarity, and paced speech to minimize acoustic trigger anxiety.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#474747]/15 dark:border-white/10 flex items-center gap-2 text-xs font-semibold text-[#474747] dark:text-[#D6D6D6]">
              <span className="w-2 h-2 rounded-full bg-[#FD1053]" />
              <span>Opt-in regional cadence calibration</span>
            </div>
          </LuxuryCard>

          <LuxuryCard className="p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#474747]/10 dark:bg-white/5 border border-white/10 flex items-center justify-center text-[#FD1053] mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#FD1053] uppercase tracking-wider">
                03 · Scalable Public Health
              </span>
              <h3 className="text-base font-bold text-[#333333] dark:text-white mt-1">
                Cost-Efficient Monitoring
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                Continuous digital monitoring designed to expand access to support. Enables single district officers and NGO counsellors to monitor hundreds of vulnerable cases proactively.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#474747]/15 dark:border-white/10 flex items-center gap-2 text-xs font-semibold text-[#474747] dark:text-[#D6D6D6]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Prioritization triage prevents caseworker burnout</span>
            </div>
          </LuxuryCard>

          <LuxuryCard className="p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#474747]/10 dark:bg-white/5 border border-white/10 flex items-center justify-center text-[#FD1053] mb-4">
                <Globe2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#FD1053] uppercase tracking-wider">
                04 · Linguistic Sovereignty
              </span>
              <h3 className="text-base font-bold text-[#333333] dark:text-white mt-1">
                Multilingual Support
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                Support for 10+ Indian languages including Hindi, Bengali, Assamese, Khasi, Mizo, Manipuri, Bodo, Nepali, Tamil, and English with phonetic speech processing.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#474747]/15 dark:border-white/10 flex items-center gap-2 text-xs font-semibold text-[#474747] dark:text-[#D6D6D6]">
              <span className="w-2 h-2 rounded-full bg-[#FD1053]" />
              <span>10+ Official regional languages</span>
            </div>
          </LuxuryCard>

          <LuxuryCard className="p-6 flex flex-col justify-between md:col-span-2 lg:col-span-2">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#474747]/10 dark:bg-white/5 border border-white/10 flex items-center justify-center text-[#FD1053] mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-[#FD1053] uppercase tracking-wider">
                05 · Zero Barrier Entry
              </span>
              <h3 className="text-base font-bold text-[#333333] dark:text-white mt-1">
                Universal Hardware Spectrum
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                Seamless support across the entire hardware continuum: Feature phone (IVRS & SMS) → Smartphone (Accessible PWA with biometrics & offline cache) → Desktop (Caseworker & Administrator portal).
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#474747]/15 dark:border-white/10 grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#474747]/10 dark:bg-white/5 border border-white/10">
                <Phone className="w-4 h-4 mx-auto text-[#FD1053] mb-1" />
                <span className="text-xs font-bold text-[#333333] dark:text-white block">Feature Phone</span>
                <span className="text-[10px] text-[#A3A3A3]">2G / IVRS / SMS</span>
              </div>
              <div className="p-3 rounded-xl bg-[#474747]/10 dark:bg-white/5 border border-white/10">
                <Smartphone className="w-4 h-4 mx-auto text-[#FD1053] mb-1" />
                <span className="text-xs font-bold text-[#333333] dark:text-white block">Smartphone</span>
                <span className="text-[10px] text-[#A3A3A3]">App / Voice</span>
              </div>
              <div className="p-3 rounded-xl bg-[#474747]/10 dark:bg-white/5 border border-white/10">
                <Laptop className="w-4 h-4 mx-auto text-[#FD1053] mb-1" />
                <span className="text-xs font-bold text-[#333333] dark:text-white block">Desktop</span>
                <span className="text-[10px] text-[#A3A3A3]">Admin / Care</span>
              </div>
            </div>
          </LuxuryCard>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — TRAUMA-INFORMED DESIGN
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="p-8 sm:p-12 lg:p-16 rounded-3xl glass-panel relative overflow-hidden shadow-2xl border-[#474747]/20 dark:border-white/10">
          <div className="relative max-w-4xl mx-auto text-center space-y-4 mb-12">
            <PremiumBadge tone="elevated">
              Survivor Autonomy & Dignity
            </PremiumBadge>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#333333] dark:text-white">
              Trauma-Informed Design Principles
            </h2>
            <p className="text-sm sm:text-base text-[#474747] dark:text-[#D6D6D6] max-w-2xl mx-auto leading-relaxed">
              We reject predatory algorithmic surveillance. Every interaction in Manas Suraksha is designed around survivor pacing, psychological safety, and explicit personal control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <LuxuryCard className="p-6">
              <div className="w-10 h-10 rounded-xl bg-[#FD1053]/15 text-[#FD1053] flex items-center justify-center mb-3 border border-[#FD1053]/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#333333] dark:text-white">
                &ldquo;No forced disclosure.&rdquo;
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                Survivors are never pressured to recount traumatic details. Check-ins use gentle 5-point well-being scales, and every prompt includes an unpenalized &lsquo;Skip for now&rsquo; option.
              </p>
            </LuxuryCard>

            <LuxuryCard className="p-6">
              <div className="w-10 h-10 rounded-xl bg-[#FD1053]/15 text-[#FD1053] flex items-center justify-center mb-3 border border-[#FD1053]/30">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#333333] dark:text-white">
                &ldquo;Survivors control what is monitored.&rdquo;
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                Survivors decide which signals are active. Optional supplementary voice features can be paused with a single toggle at any time without forfeiting access to human counselling or support.
              </p>
            </LuxuryCard>

            <LuxuryCard className="p-6">
              <div className="w-10 h-10 rounded-xl bg-[#FD1053]/15 text-[#FD1053] flex items-center justify-center mb-3 border border-[#FD1053]/30">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#333333] dark:text-white">
                &ldquo;Survivors control interaction cadence.&rdquo;
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                Choose weekly, bi-weekly, post-court milestone, or strictly on-demand interactions. The system adapts to the survivor&rsquo;s personal emotional rhythm.
              </p>
            </LuxuryCard>

            <LuxuryCard className="p-6">
              <div className="w-10 h-10 rounded-xl bg-[#FD1053]/15 text-[#FD1053] flex items-center justify-center mb-3 border border-[#FD1053]/30">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#333333] dark:text-white">
                &ldquo;Survivors control information access.&rdquo;
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                Strict cryptographic separation between health and judicial data. Police officers cannot view psychological notes; welfare officers see only anonymized eligibility status.
              </p>
            </LuxuryCard>
          </div>

          {/* Interactive Survivor Autonomy Controls */}
          <div className="mt-10 p-6 rounded-2xl glass-card max-w-2xl mx-auto border-[#FD1053]/25">
            <div className="flex items-center justify-between pb-4 border-b border-[#474747]/15 dark:border-white/10">
              <span className="text-xs font-bold text-[#333333] dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#FD1053]" />
                <span>Interactive Survivor Autonomy Controls</span>
              </span>
              <PremiumBadge tone="live" size="sm">
                100% Survivor Owned
              </PremiumBadge>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#333333] dark:text-white block">Preferred Contact Cadence</span>
                  <span className="text-[#6B7280] dark:text-[#A3A3A3] text-[11px]">How often you wish to receive check-in prompts</span>
                </div>
                <div className="flex items-center gap-1 bg-[#474747]/10 dark:bg-white/10 p-1 rounded-xl">
                  {(['weekly', 'biweekly', 'on_demand'] as const).map(freq => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setAutonomyFrequency(freq)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                        autonomyFrequency === freq
                          ? 'bg-[#FD1053] text-white shadow-xs'
                          : 'text-[#474747] dark:text-[#D6D6D6] hover:text-white'
                      }`}
                    >
                      {freq === 'weekly' ? 'Weekly' : freq === 'biweekly' ? 'Bi-Weekly' : 'On-Demand'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#474747]/15 dark:border-white/10">
                <div>
                  <span className="font-semibold text-[#333333] dark:text-white block">Optional Voice Distress Analysis</span>
                  <span className="text-[#6B7280] dark:text-[#A3A3A3] text-[11px]">Zero-retention acoustic feature telemetry</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowVoiceAnalysis(!allowVoiceAnalysis)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    allowVoiceAnalysis ? 'bg-[#FD1053] text-white shadow-xs' : 'bg-[#474747]/20 text-[#6B7280]'
                  }`}
                >
                  {allowVoiceAnalysis ? 'Enabled' : 'Paused'}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#474747]/15 dark:border-white/10">
                <div>
                  <span className="font-semibold text-[#333333] dark:text-white block">Authorized Counsellor Direct Alerts</span>
                  <span className="text-[#6B7280] dark:text-[#A3A3A3] text-[11px]">Notify welfare caseworker on acute distress spikes</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowCounsellorAlerts(!allowCounsellorAlerts)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    allowCounsellorAlerts ? 'bg-[#FD1053] text-white shadow-xs' : 'bg-[#474747]/20 text-[#6B7280]'
                  }`}
                >
                  {allowCounsellorAlerts ? 'Active' : 'Paused'}
                </button>
              </div>

              <div className="mt-5 pt-4 border-t border-[#474747]/15 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3]">
                  Experience the complete 7-step trauma-informed onboarding workflow.
                </span>
                <LuxuryButton
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    setRole('victim');
                    setIsOnboardingModalOpen(true);
                  }}
                  leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  Start 7-Step Onboarding
                </LuxuryButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — PRIVACY VAULT & 3D SHIELD (Section 31)
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4">
        <GlassPanel
          title="Privacy & Security Vault"
          subtitle="DPDPA 2023 compliance, granular consent sovereignty & cryptographic audit ledger"
          badge={<PremiumBadge tone="live">Hardware Enclave</PremiumBadge>}
          action={
            <LuxuryButton
              size="sm"
              variant="secondary"
              onClick={() => onSelectAction('privacy')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Explore Privacy Vault
            </LuxuryButton>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 3D Shield Centerpiece */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="w-full max-w-[340px] aspect-square rounded-3xl glass-card p-4 relative overflow-hidden border-[#FD1053]/25 shadow-xl flex items-center justify-center">
                <ThreeDShield className="w-full h-full" />
                <div className="absolute bottom-3 text-center pointer-events-none">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#A3A3A3] bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
                    AES-256 • Zero-GPS • RLS
                  </span>
                </div>
              </div>
            </div>

            {/* Privacy Pillars */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LuxuryCard className="p-4">
                <div className="w-8 h-8 rounded-lg bg-[#FD1053]/15 text-[#FD1053] flex items-center justify-center mb-2">
                  <FileCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#333333] dark:text-white uppercase tracking-wider">
                  Consent Management
                </h4>
                <p className="mt-1 text-xs text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                  Explicit, milestone-specific, and fully revocable at any stage.
                </p>
              </LuxuryCard>

              <LuxuryCard className="p-4">
                <div className="w-8 h-8 rounded-lg bg-[#FD1053]/15 text-[#FD1053] flex items-center justify-center mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#333333] dark:text-white uppercase tracking-wider">
                  Data Minimization
                </h4>
                <p className="mt-1 text-xs text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                  Only numeric distress vectors stored. Raw voice audio zero-retention guarantee.
                </p>
              </LuxuryCard>

              <LuxuryCard className="p-4">
                <div className="w-8 h-8 rounded-lg bg-[#FD1053]/15 text-[#FD1053] flex items-center justify-center mb-2">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#333333] dark:text-white uppercase tracking-wider">
                  End-to-End Encryption
                </h4>
                <p className="mt-1 text-xs text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                  TLS 1.3 in transit and AES-256 at rest with field-level cryptographic tokenization.
                </p>
              </LuxuryCard>

              <LuxuryCard className="p-4">
                <div className="w-8 h-8 rounded-lg bg-[#FD1053]/15 text-[#FD1053] flex items-center justify-center mb-2">
                  <Server className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-[#333333] dark:text-white uppercase tracking-wider">
                  Immutable Audit Ledger
                </h4>
                <p className="mt-1 text-xs text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                  Every caseworker review logged cryptographically with actor attribution.
                </p>
              </LuxuryCard>
            </div>
          </div>
        </GlassPanel>
      </section>

      {/* =========================================================================
          SECTION 6 — FINAL LUXURY STATUTORY CTA
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl glass-panel p-8 sm:p-14 lg:p-16 text-center relative overflow-hidden shadow-2xl border-[#FD1053]/25">
          <div className="relative max-w-3xl mx-auto space-y-6">
            <PremiumBadge tone="live">
              Immediate Confidential Assistance
            </PremiumBadge>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#333333] dark:text-white leading-tight">
              Support should be accessible before distress becomes a crisis.
            </h2>

            <p className="text-sm sm:text-base text-[#474747] dark:text-[#D6D6D6] max-w-2xl mx-auto leading-relaxed">
              Connect with empathetic counsellors, track personal well-being milestones safely, and ensure continuous mental health care throughout the legal process.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <LuxuryButton
                variant="primary"
                size="lg"
                onClick={() => {
                  setRole('victim');
                  setIsOnboardingModalOpen(true);
                }}
                leftIcon={<HeartPulse className="w-4 h-4" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                GET SUPPORT
              </LuxuryButton>

              <LuxuryButton
                variant="secondary"
                size="lg"
                onClick={() => setIsLoginModalOpen(true)}
                leftIcon={<Lock className="w-4 h-4 text-[#FD1053]" />}
              >
                SIGN IN
              </LuxuryButton>

              <LuxuryButton
                variant="tertiary"
                size="lg"
                onClick={() => setIsDemoModalOpen(true)}
                leftIcon={<Sparkles className="w-4 h-4 text-[#FD1053]" />}
              >
                Explore Demo Scenarios
              </LuxuryButton>
            </div>

            {/* Helpline Directory Footer */}
            <div className="pt-8 border-t border-[#474747]/15 dark:border-white/10 text-xs text-[#6B7280] dark:text-[#A3A3A3]">
              <p className="font-semibold text-[#333333] dark:text-white mb-2">Emergency & Crisis Helplines (24x7 Toll-Free):</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="hover:underline flex items-center gap-1.5 font-bold text-[#FD1053] cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 fill-[#FD1053]" />
                  <span>NHAA Toll-Free: 14566</span>
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="hover:underline flex items-center gap-1.5 font-bold text-[#333333] dark:text-white cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Tele-MANAS: 14416</span>
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="hover:underline flex items-center gap-1.5 font-bold text-[#FD1053] cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 fill-[#FD1053]" />
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
