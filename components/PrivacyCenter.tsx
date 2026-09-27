'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import {
  Lock,
  Shield,
  Eye,
  FileText,
  KeyRound,
  CheckCircle2,
  Clock,
  UserCheck,
  Server,
  ToggleLeft,
  ToggleRight,
  Database,
} from 'lucide-react';

export function PrivacyCenter() {
  const { consent, updateConsent, auditLogs, role } = useApp();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5" />
          <span>Trust & Confidentiality Architecture</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
          Privacy, Consent & Audit Center
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Complete transparency on data minimization, role-based encryption, and authorized access records
        </p>
      </div>

      {/* Consent Management Toggles (Section 19) */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Individual Consent & Processing Preferences
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            You maintain full sovereignty over how your check-in data and voice telemetry are processed.
          </p>
        </div>

        <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
          {/* Voice Analysis Toggle */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                Optional Voice-Based Acoustic & Speech Analysis
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Allows speech rhythm and pitch stress cues from voluntary voice notes to assist caseworker triage.
              </p>
            </div>
            <button
              onClick={() => updateConsent('voiceAnalysis', !consent.voiceAnalysis)}
              className="text-2xl text-emerald-600 dark:text-emerald-400 cursor-pointer p-1"
              aria-label="Toggle voice analysis consent"
            >
              {consent.voiceAnalysis ? (
                <ToggleRight className="w-9 h-9 fill-emerald-600 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-slate-400" />
              )}
            </button>
          </div>

          {/* Automated Reminders */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                Automated Well-Being Check-in Reminders
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Periodic gentle SMS or IVRS calls reminding you to check in before crucial court or welfare dates.
              </p>
            </div>
            <button
              onClick={() => updateConsent('automatedReminders', !consent.automatedReminders)}
              className="text-2xl text-emerald-600 dark:text-emerald-400 cursor-pointer p-1"
              aria-label="Toggle automated reminders"
            >
              {consent.automatedReminders ? (
                <ToggleRight className="w-9 h-9 fill-emerald-600 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-slate-400" />
              )}
            </button>
          </div>

          {/* Longitudinal Tracking */}
          <div className="pt-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                Longitudinal Distress Trend Aggregation
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Enables continuous comparison with your historical baseline to identify sudden inflection points.
              </p>
            </div>
            <button
              onClick={() => updateConsent('longitudinalTracking', !consent.longitudinalTracking)}
              className="text-2xl text-emerald-600 dark:text-emerald-400 cursor-pointer p-1"
              aria-label="Toggle longitudinal tracking"
            >
              {consent.longitudinalTracking ? (
                <ToggleRight className="w-9 h-9 fill-emerald-600 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-9 h-9 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Consent Record Last Synchronized: {consent.lastUpdated}</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Status: Active & Enforced</span>
        </div>
      </div>

      {/* Data Minimization & Retention Schedule (Phase 6 Sections 9 & 10) */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Data Minimization & Statutory Retention Framework
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Enforcing privacy-by-design: strict limits on storage duration and immediate purge of raw audio waveforms
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Minimization Audit: COMPLIANT
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Raw Voice Audio</span>
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">0 Days</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              Discarded in-memory immediately after acoustic feature extraction. Raw audio files are never persisted.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Check-in Responses</span>
              <Clock className="w-3.5 h-3.5 text-sky-500" />
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">365 Days</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              Encrypted active monitoring window. Automatically archived or purged after 1 year unless legal hold applies.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Audit Log Trail</span>
              <Clock className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">730 Days</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              2-year statutory retention for judicial accountability. Anonymized actor IDs with zero raw victim text.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>AI Metadata Telemetry</span>
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-white">180 Days</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              Anonymized latency and error logs for algorithmic observability and calibration audits.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
          <p className="font-semibold">Consent Withdrawal Graceful Fallback Guarantee:</p>
          <p className="leading-relaxed">
            If you withdraw consent for voice or automated AI analysis, you will never be locked out of the platform. Your caseworker will continue routine support via standard text check-ins, telephone calls, and in-person welfare visits.
          </p>
        </div>
      </div>

      {/* "Who can access my information?" (Section 18) */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Who Can Access My Information? (Role-Based Access Control)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Access is strictly restricted to assigned personnel based on least-privilege principles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
            <UserCheck className="w-5 h-5 text-emerald-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Assigned Counsellor
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Full access to check-in responses, distress trends, and counselling notes for assigned cases only.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
            <Shield className="w-5 h-5 text-sky-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              District Officer
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              District-level oversight, alert escalation, and authorization of emergency protection interventions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
            <Database className="w-5 h-5 text-purple-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              State & National Admin
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              De-identified aggregate trends only. No individual check-in text, voice notes, or identities exposed.
            </p>
          </div>
        </div>
      </div>

      {/* Activity History / Immutable Audit Logs (Section 18) */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Access Monitoring & Activity Audit Logs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Immutable forensic log of every case profile access, check-in submission, and intervention authorization
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Timestamp (UTC)</th>
                <th className="py-2.5 px-4">Authorized Actor</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Target Resource</th>
                <th className="py-2.5 px-4">Authorized Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {auditLogs.slice(0, 10).map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                    {log.actor}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {log.resource}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {log.purpose}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
