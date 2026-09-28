'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import {
  ShieldCheck,
  HeartPulse,
  Users,
  Lock,
  Headphones,
  FileCheck,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Activity,
  Globe2,
  Eye,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';

export function PublicLandingPage({
  onSelectAction,
}: {
  onSelectAction: (view: string, roleTarget?: string) => void;
}) {
  const { setRole, setIsEmergencyModalOpen, setIsVoiceAssistantOpen } = useApp();

  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-indigo-50/70 via-white to-slate-50 text-slate-900 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 dark:text-white p-8 sm:p-14 lg:p-16 shadow-xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] dark:bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-indigo-900 dark:text-emerald-300 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-emerald-400" />
            <span>National Atrocity Victim Welfare & Support Framework</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            AI-Assisted Victim Well-Being Monitoring & Early Support
          </h1>

          <p className="text-base sm:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Continuous, privacy-conscious monitoring that helps authorized professionals identify changing distress indicators and connect vulnerable individuals with timely human support.
          </p>

          {/* Ethical Disclaimer Kicker */}
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/80 max-w-2xl mx-auto text-xs text-slate-800 dark:text-slate-300 flex items-center justify-center gap-2 shadow-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
            <span>
              <strong>Ethical Safeguard:</strong> This platform is an early-warning screening tool, not a clinical diagnostic replacement. All interventions require authorized human review.
            </span>
          </div>

          {/* CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                setRole('victim');
                onSelectAction('dashboard');
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold text-sm transition shadow-lg shadow-indigo-500/20 dark:shadow-emerald-500/20 cursor-pointer min-h-[44px]"
            >
              <HeartPulse className="w-4 h-4" />
              <span>Access Support Check-In</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => {
                setRole('counsellor');
                onSelectAction('counsellor');
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white dark:border-slate-700 font-semibold text-sm transition cursor-pointer min-h-[44px] shadow-xs"
            >
              <Users className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
              <span>Authorized Caseworker Login</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-medium text-sm transition cursor-pointer min-h-[44px]"
            >
              <Compass className="w-4 h-4" />
              <span>Learn How It Works</span>
            </button>
          </div>
        </div>
      </section>

      {/* Why Continuous Monitoring Matters */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Why Continuous Well-Being Monitoring Matters
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Legal trials and rehabilitation journeys often span months or years. Traditional one-off visits miss critical inflection points when victims face intimidation, summons anxiety, or acute distress spikes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-white">
              Dynamic Longitudinal Tracking
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Detect subtle negative shifts early across weeks, distinguishing acute transient stress from escalating trauma and fear patterns.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-white">
              Inflection Point Early Warning
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Court hearings, witness depositions, and local threat events trigger timely alerts for authorized caseworkers to intervene proactively.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-slate-900 dark:text-white">
              Integrated Multi-Agency Care
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Seamlessly link psychological tele-counselling, police witness protection, interim compensation, and safe livelihood rehabilitation.
            </p>
          </div>
        </div>
      </section>

      {/* How the System Works: 6-Stage Journey */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 py-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Full Welfare Lifecycle</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              End-to-End Monitoring Across 6 Case Stages
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              The platform maintains safe, supportive contact from initial FIR registration to sustainable independent rehabilitation.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { stage: '1. Complaint', desc: 'Trauma-informed intake, initial well-being baseline' },
              { stage: '2. Investigation', desc: 'Check-in frequency monitoring during evidence gathering' },
              { stage: '3. Trial Stage', desc: 'Pre-trial desensitization & court escort coordination' },
              { stage: '4. Rehabilitation', desc: 'Vocational training, child support, mental recovery' },
              { stage: '5. Compensation', desc: 'Direct treasury welfare disbursement verification' },
              { stage: '6. Protection', desc: 'Security audit, safe transit & relocation support' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Stage 0{idx + 1}
                  </span>
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white mt-1">
                    {item.stage.split('. ')[1]}
                  </h4>
                </div>
                <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multichannel & AI-Assisted Early Warning Features */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Multichannel */}
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Multilingual & Voice-First Support
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Designed specifically for low-literacy complainants and rural communities. Supports 10 Indian regional languages (Hindi, Bengali, Assamese, Khasi, Mizo, Manipuri, Bodo, Nepali, Tamil, and English) with voice interaction (🎙 Speak, 🔊 Read Aloud, 🔁 Repeat).
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Web App
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Interactive Voice (IVRS)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                SMS Check-Ins
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                In-Person Sync
              </span>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => setIsVoiceAssistantOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
            >
              <span>Test Multilingual Voice Interface</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Human-in-the-Loop & Explainable AI */}
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Explainable AI with Strict Human Oversight
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Every flagged case provides a transparent explanation panel stating the precise signals (e.g. check-in gap, sudden sleep disruption, elevated fear markers). Automated scores never trigger judicial, financial, or medical decisions alone.
            </p>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero clinical diagnosis claims (no clinical diagnostic labels)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Caseworker verification required for all intervention orders</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Full immutable audit trail of all access and evaluations</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => {
                setRole('counsellor');
                onSelectAction('counsellor');
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              <span>View Caseworker Explanation Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Existing Grievance Systems vs AASRA Care Early-Warning Platform */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Transformational Paradigm
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Traditional Grievance Portals vs. AASRA Care Early-Warning System
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Moving beyond passive, bureaucratic grievance tracking to proactive, empathetic, trauma-informed well-being monitoring throughout the justice lifecycle.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-850 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-300 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Dimension</th>
                  <th className="py-3.5 px-4 sm:px-6 text-slate-700 dark:text-slate-300">Traditional Grievance Portal</th>
                  <th className="py-3.5 px-4 sm:px-6 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 font-bold">
                    AASRA Care Dynamic Platform
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr>
                  <td className="py-3 px-4 sm:px-6 font-bold text-slate-900 dark:text-white">Engagement Nature</td>
                  <td className="py-3 px-4 sm:px-6 text-slate-700 dark:text-slate-300 font-medium">Passive: Citizen must initiate and check back</td>
                  <td className="py-3 px-4 sm:px-6 bg-emerald-500/5 font-semibold text-emerald-950 dark:text-emerald-200">
                    Proactive: Structured periodic micro check-ins via app, IVRS, and SMS
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 sm:px-6 font-bold text-slate-900 dark:text-white">Focus Area</td>
                  <td className="py-3 px-4 sm:px-6 text-slate-700 dark:text-slate-300 font-medium">Procedural docket / file movement status</td>
                  <td className="py-3 px-4 sm:px-6 bg-emerald-500/5 font-semibold text-emerald-950 dark:text-emerald-200">
                    Human Well-Being: Sleep, perceived safety, acute distress, isolation
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 sm:px-6 font-bold text-slate-900 dark:text-white">Risk Detection</td>
                  <td className="py-3 px-4 sm:px-6 text-slate-700 dark:text-slate-300 font-medium">Post-facto escalation when crisis has occurred</td>
                  <td className="py-3 px-4 sm:px-6 bg-emerald-500/5 font-semibold text-emerald-950 dark:text-emerald-200">
                    Early Warning: Multi-signal trend analysis flagging distress shifts
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 sm:px-6 font-bold text-slate-900 dark:text-white">Accessibility</td>
                  <td className="py-3 px-4 sm:px-6 text-slate-700 dark:text-slate-300 font-medium">Complex bureaucratic text, English/Hindi only</td>
                  <td className="py-3 px-4 sm:px-6 bg-emerald-500/5 font-semibold text-emerald-950 dark:text-emerald-200">
                    Voice-first, 10 regional languages, 5-point pictorial scale, IVRS call-in
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 sm:px-6 font-bold text-slate-900 dark:text-white">Role of AI</td>
                  <td className="py-3 px-4 sm:px-6 text-slate-700 dark:text-slate-300 font-medium">Unused or automated canned email responses</td>
                  <td className="py-3 px-4 sm:px-6 bg-emerald-500/5 font-semibold text-emerald-950 dark:text-emerald-200">
                    Explainable screening assistant aiding human caseworkers to triage cases
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 sm:px-6 font-bold text-slate-900 dark:text-white">Privacy Safeguards</td>
                  <td className="py-3 px-4 sm:px-6 text-slate-700 dark:text-slate-300 font-medium">Public rosters often leaking sensitive details</td>
                  <td className="py-3 px-4 sm:px-6 bg-emerald-500/5 font-semibold text-emerald-950 dark:text-emerald-200">
                    Strict pseudonymization, RBAC, aggregate-only maps, consent controls
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Privacy & Security Architecture */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-indigo-50/70 dark:bg-slate-900 text-slate-900 dark:text-white border border-indigo-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 transition-colors shadow-xs">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-xs font-semibold text-indigo-700 dark:text-sky-400 border border-indigo-200 dark:border-slate-700 shadow-xs">
              <Lock className="w-3.5 h-3.5" />
              <span>Government-Grade Privacy Guarantees</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Data Minimization & Pseudonymization
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Identities are shielded behind encrypted pseudonyms (e.g. BEN-7821). Precise geographic locations and home addresses are never plotted on spatial maps; district dashboards display only privacy-preserving aggregate metrics.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => onSelectAction('privacy')}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white text-xs font-semibold dark:border-slate-700 transition cursor-pointer min-h-[44px] shadow-xs"
            >
              Review Privacy Center
            </button>
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition cursor-pointer min-h-[44px] shadow-xs"
            >
              Emergency Helpline (24/7)
            </button>
          </div>
        </div>
      </section>

      {/* Core Principle & Mandate Statement */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
            &ldquo;The goal of this platform is not to replace human empathy or clinical discretion, but to ensure that no victim of atrocity suffers in silence during prolonged legal and rehabilitation processes.&rdquo;
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            AASRA Care Framework · Human-in-the-Loop Victim Well-Being & Early Support Standard
          </p>
        </div>
      </section>
    </div>
  );
}
