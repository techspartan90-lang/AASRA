'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { STATE_AGGREGATES, DISTRICT_AGGREGATES } from '@/lib/mock-data';
import { MapVisualization } from '@/components/MapVisualization';
import { AiModelEvaluationHub } from '@/components/AiModelEvaluationHub';
import {
  Building2,
  Users,
  Activity,
  ShieldAlert,
  CheckCircle2,
  FileSpreadsheet,
  TrendingUp,
  Download,
  Filter,
  BarChart3,
  Layers,
  Calendar,
} from 'lucide-react';

export function AdministrativeDashboard({
  onSelectCase,
}: {
  onSelectCase?: (caseId: string) => void;
}) {
  const { role, setIsReportModalOpen, canViewAnalytics } = useApp();

  const [activeTab, setActiveTab] = useState<'national' | 'state' | 'district' | 'ai_models'>('national');
  const [selectedState, setSelectedState] = useState('Assam');
  const [selectedDistrict, setSelectedDistrict] = useState('Kamrup Metropolitan');

  // Enforce role-based access control
  if (!canViewAnalytics()) {
    return (
      <div className="p-8 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-700 dark:text-amber-300">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Administrative Analytics Restricted
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Aggregated territorial surveillance and district caseload summaries are restricted to Case Workers, District Welfare Officers, and State/National Administrators.
          </p>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          To inspect these views, switch your demo role to <strong>Counsellor</strong> or <strong>District Officer</strong> in the header.
        </p>
      </div>
    );
  }

  // National aggregates
  const totalMonitored = 1777;
  const activeCases = 704;
  const casesRequiringFollowUp = 68;
  const elevatedIndicators = 28;
  const highPriorityReviews = 9;
  const interventionsCompleted = 1075;
  const nationalSlaRate = 93.8;

  // Filter districts by selected state
  const stateDistricts = DISTRICT_AGGREGATES.filter(d =>
    d.state.toLowerCase().includes(selectedState.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Judicial Welfare & Public Health Surveillance
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-medium text-slate-500">
              Role: {role.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
            Administrative Oversight Dashboard
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Level Switcher (National / State / District) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setActiveTab('national')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                activeTab === 'national'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              National Overview
            </button>
            <button
              onClick={() => setActiveTab('state')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                activeTab === 'state'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              State View
            </button>
            <button
              onClick={() => setActiveTab('district')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                activeTab === 'district'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              District View
            </button>
            <button
              onClick={() => setActiveTab('ai_models')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                activeTab === 'ai_models'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              AI & Model Hub
            </button>
          </div>

          {/* Export Report Trigger */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer min-h-[36px]"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* 6 Key National Metric Cards (Section 15) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Total Monitored</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{totalMonitored}</p>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">All registered cases</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Active Cases</p>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">{activeCases}</p>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">In check-in rotation</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Needs Follow-Up</p>
          <p className="text-xl font-bold text-sky-700 dark:text-sky-400 mt-1">{casesRequiringFollowUp}</p>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Due within 48h</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Elevated Indicators</p>
          <p className="text-xl font-bold text-amber-700 dark:text-amber-400 mt-1">{elevatedIndicators}</p>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Score 50 - 74</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">High-Priority</p>
          <p className="text-xl font-bold text-rose-700 dark:text-rose-400 mt-1">{highPriorityReviews}</p>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Score 75 - 100</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Interventions Done</p>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">{interventionsCompleted}</p>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">SLA: {nationalSlaRate}%</span>
        </div>
      </div>

      {/* Map Visualization (Section 16) */}
      <MapVisualization onSelectDistrict={d => setSelectedDistrict(d)} />

      {/* Level Specific Content */}
      {activeTab === 'national' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* State Comparison Table */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  State-Level Case Distribution & Service Delivery SLA
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Aggregate comparative monitoring across jurisdictional zones
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-300 dark:border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">State</th>
                    <th className="py-2.5 px-3 text-right">Total Cases</th>
                    <th className="py-2.5 px-3 text-right">Active</th>
                    <th className="py-2.5 px-3 text-right">Elevated Risk</th>
                    <th className="py-2.5 px-3 text-right">Interventions</th>
                    <th className="py-2.5 px-3 text-right">Counselling SLA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {STATE_AGGREGATES.map(st => (
                    <tr
                      key={st.state}
                      onClick={() => {
                        setSelectedState(st.state);
                        setActiveTab('state');
                      }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition"
                    >
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                        {st.state}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-slate-800 dark:text-slate-200">
                        {st.totalCases}
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-slate-800 dark:text-slate-200">
                        {st.activeCases}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="font-bold text-amber-700 dark:text-amber-400">
                          {st.elevatedRisk}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400 font-bold">
                        {st.interventionsCompleted}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {st.counsellingSlaPercentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Risk Distribution & Check-in Modality Breakdown */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                National Risk Distribution
              </h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Stable (0–24)', pct: 54, color: 'bg-emerald-600' },
                  { label: 'Mild Concern (25–49)', pct: 28, color: 'bg-sky-600' },
                  { label: 'Elevated (50–74)', pct: 14, color: 'bg-amber-600' },
                  { label: 'High Concern (75–100)', pct: 4, color: 'bg-rose-600' },
                ].map(r => (
                  <div key={r.label} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <span>{r.label}</span>
                      <span className="font-mono font-bold">{r.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className={`${r.color} h-2 rounded-full`} style={{ width: `${r.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Engagement Modality Split
              </h3>
              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <div className="flex justify-between">
                  <span>Interactive Voice (IVRS / Toll-Free)</span>
                  <span className="font-bold text-slate-900 dark:text-white">48%</span>
                </div>
                <div className="flex justify-between">
                  <span>Web / Mobile Interface</span>
                  <span className="font-bold text-slate-900 dark:text-white">32%</span>
                </div>
                <div className="flex justify-between">
                  <span>SMS Short-Code Check-Ins</span>
                  <span className="font-bold text-slate-900 dark:text-white">14%</span>
                </div>
                <div className="flex justify-between">
                  <span>In-Person Welfare Worker Sync</span>
                  <span className="font-bold text-slate-900 dark:text-white">6%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'state' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                State Dashboard: {selectedState}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                District-level breakdown and caseworker allocations
              </p>
            </div>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs font-semibold cursor-pointer text-slate-800 dark:text-slate-200"
            >
              {STATE_AGGREGATES.map(s => (
                <option key={s.state} value={s.state}>
                  {s.state}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-300 dark:border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">District</th>
                  <th className="py-2.5 px-4">Active Cases</th>
                  <th className="py-2.5 px-4">Elevated Indicators</th>
                  <th className="py-2.5 px-4">Counsellors Active</th>
                  <th className="py-2.5 px-4">Interventions Completed</th>
                  <th className="py-2.5 px-4">Avg Response Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {DISTRICT_AGGREGATES.filter(
                  d => d.state.toLowerCase() === selectedState.toLowerCase()
                ).map(dist => (
                  <tr key={dist.district} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {dist.district}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{dist.activeCases}</td>
                    <td className="py-3 px-4 font-bold text-amber-700 dark:text-amber-400">
                      {dist.elevatedRiskCases}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{dist.counsellorsActive} officers</td>
                    <td className="py-3 px-4 text-emerald-700 dark:text-emerald-400 font-bold">
                      {dist.interventionsCompleted}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-white">{dist.avgResponseHours} hrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'district' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                District Officer Workspace: {selectedDistrict}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Local caseload oversight, overdue interventions, and police liaison
              </p>
            </div>
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs font-semibold cursor-pointer text-slate-800 dark:text-slate-200"
            >
              {DISTRICT_AGGREGATES.map(d => (
                <option key={d.district} value={d.district}>
                  {d.district} ({d.state})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Caseload Capacity</span>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">28 / 35</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-1">80% counsellor allocation</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Pending Police Escort Requests</span>
              <p className="text-2xl font-bold text-rose-700 dark:text-rose-400 mt-1">3</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-1">Special cell coordination active</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Interim Relief Disbursed</span>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">₹18.5L</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-1">100% DLSA bank linkage</p>
            </div>
          </div>
        </div>
      )}

      {/* AI & Machine Learning Hub Tab */}
      {activeTab === 'ai_models' && (
        <AiModelEvaluationHub />
      )}
    </div>
  );
}
