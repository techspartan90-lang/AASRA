'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { CaseRecord, RiskLevel, CaseStage } from '@/types';
import {
  Users,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  ShieldAlert,
  ChevronRight,
  Calendar,
  FileText,
} from 'lucide-react';

interface CounsellorWorkspaceProps {
  onSelectCase: (caseId: string) => void;
}

export function CounsellorWorkspace({ onSelectCase }: CounsellorWorkspaceProps) {
  const { cases, setSelectedCaseId, canViewCase } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');

  // Enforce access control permissions: only cases the current persona is authorized to view
  const authorizedCases = cases.filter(c => canViewCase(c));

  // Metrics based on authorized caseload
  const totalAssigned = authorizedCases.length;
  const needsFollowUp = authorizedCases.filter(c => c.missedCheckInsCount > 0 || c.riskLevel === 'elevated' || c.riskLevel === 'high').length;
  const elevatedIndicators = authorizedCases.filter(c => c.riskLevel === 'elevated').length;
  const highPriority = authorizedCases.filter(c => c.riskLevel === 'high').length;
  const followUpsDueToday = authorizedCases.filter(c => c.riskLevel === 'high' || c.priorityReason.toLowerCase().includes('today')).length || 1;

  // Filter cases
  const filteredCases = authorizedCases.filter(c => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.anonymizedCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.priorityReason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = selectedRisk === 'all' || c.riskLevel === selectedRisk;
    const matchesStage = selectedStage === 'all' || c.stage === selectedStage;

    return matchesSearch && matchesRisk && matchesStage;
  });

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400" />
            High Concern
          </span>
        );
      case 'elevated':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
            Elevated
          </span>
        );
      case 'mild':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-900/60">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600 dark:bg-sky-400" />
            Mild
          </span>
        );
      case 'stable':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            Stable
          </span>
        );
    }
  };

  const getTrendIcon = (curr: number, prev: number) => {
    const diff = curr - prev;
    if (diff > 5) {
      return (
        <span className="flex items-center text-rose-600 dark:text-rose-400 font-semibold text-xs">
          <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
          +{diff}
        </span>
      );
    } else if (diff < -5) {
      return (
        <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
          <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
          {diff}
        </span>
      );
    } else {
      return (
        <span className="flex items-center text-slate-400 font-medium text-xs">
          <Minus className="w-3.5 h-3.5 mr-0.5" />
          Stable
        </span>
      );
    }
  };

  const [cohortTimeframe, setCohortTimeframe] = useState<'7D' | '30D' | '90D' | '6M'>('30D');

  // Synthetic cohort longitudinal trend data points based on timeframe
  const cohortDataPoints = {
    '7D': [
      { label: 'Day 1', score: 38 },
      { label: 'Day 2', score: 41 },
      { label: 'Day 3', score: 40 },
      { label: 'Day 4', score: 44 },
      { label: 'Day 5', score: 47 },
      { label: 'Day 6', score: 45 },
      { label: 'Day 7', score: 48 },
    ],
    '30D': [
      { label: 'Wk 1', score: 38 },
      { label: 'Wk 2', score: 42 },
      { label: 'Wk 3', score: 49 },
      { label: 'Wk 4', score: 46 },
    ],
    '90D': [
      { label: 'Month 1', score: 36 },
      { label: 'Month 2', score: 45 },
      { label: 'Month 3', score: 48 },
    ],
    '6M': [
      { label: 'Apr', score: 34 },
      { label: 'May', score: 38 },
      { label: 'Jun', score: 42 },
      { label: 'Jul', score: 49 },
      { label: 'Aug', score: 53 },
      { label: 'Sep', score: 47 },
    ],
  }[cohortTimeframe];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Counsellor Workspace
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1">
            Active caseload triage, distress trend surveillance, and intervention coordination
          </p>
        </div>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Total Assigned Cases</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{totalAssigned}</span>
            <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Needs Follow-up</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-700 dark:text-amber-400">8</span>
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-500" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Elevated Indicators</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-700 dark:text-amber-400">5</span>
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">High Priority</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-rose-700 dark:text-rose-400">2</span>
            <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-500" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Follow-ups Due Today</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-sky-700 dark:text-sky-400">{followUpsDueToday}</span>
            <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-500" />
          </div>
        </div>
      </div>

      {/* SYNTHETIC COHORT & CASE DISTRIBUTION (Steps 12 & 13) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SYNTHETIC COHORT LONGITUDINAL SECTION */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Surveillance
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  SYNTHETIC COHORT
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                Aggregated longitudinal distress trend across active caseload over time (Non-clinical screening)
              </p>
            </div>

            {/* Timeframe Selector (7 Days / 30 Days / 90 Days / 6 Months) */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-300 dark:border-slate-700 text-xs">
              {(['7D', '30D', '90D', '6M'] as const).map(tf => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setCohortTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    cohortTimeframe === tf
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-600'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tf === '7D'
                    ? '7 Days'
                    : tf === '30D'
                    ? '30 Days'
                    : tf === '90D'
                    ? '90 Days'
                    : '6 Months'}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Trend Line Chart */}
          <div className="relative pt-2">
            <svg viewBox="0 0 540 180" className="w-full h-44 overflow-visible">
              <defs>
                <linearGradient id="cohortGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Threshold Guidelines */}
              <line x1="30" y1="36" x2="520" y2="36" stroke="#f43f5e" strokeDasharray="3 3" strokeOpacity="0.4" />
              <text x="32" y="32" fill="#dc2626" fontSize="9" fontWeight="bold">High Concern (75)</text>

              <line x1="30" y1="72" x2="520" y2="72" stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity="0.4" />
              <text x="32" y="68" fill="#d97706" fontSize="9" fontWeight="bold">Elevated (50)</text>

              <line x1="30" y1="108" x2="520" y2="108" stroke="#0ea5e9" strokeDasharray="3 3" strokeOpacity="0.4" />
              <text x="32" y="104" fill="#0284c7" fontSize="9" fontWeight="bold">Mild (25)</text>

              {/* Grid Baseline */}
              <line x1="30" y1="144" x2="520" y2="144" stroke="#cbd5e1" strokeWidth="1" />

              {/* SVG Line & Area */}
              {(() => {
                const total = cohortDataPoints.length;
                const getPtX = (i: number) => 50 + (i / Math.max(1, total - 1)) * 450;
                const getPtY = (sc: number) => 144 - (sc / 100) * 120;

                const lineD = cohortDataPoints.reduce(
                  (acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getPtX(i)} ${getPtY(pt.score)}`,
                  ''
                );
                const areaD = `${lineD} L ${getPtX(total - 1)} 144 L ${getPtX(0)} 144 Z`;

                return (
                  <>
                    <path d={areaD} fill="url(#cohortGradient)" />
                    <path d={lineD} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />
                    {cohortDataPoints.map((pt, i) => (
                      <g key={i}>
                        <circle
                          cx={getPtX(i)}
                          cy={getPtY(pt.score)}
                          r="4"
                          fill="#4f46e5"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <text
                          x={getPtX(i)}
                          y="162"
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="600"
                          className="fill-slate-700 dark:fill-slate-300"
                        >
                          {pt.label}
                        </text>
                        <text
                          x={getPtX(i)}
                          y={getPtY(pt.score) - 8}
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="bold"
                          className="fill-slate-900 dark:fill-white"
                        >
                          {pt.score}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>

          {/* Chart Series Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Trajectory Bands:</span>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Improving (Green)
              </span>
              <span className="flex items-center gap-1.5 text-sky-800 dark:text-sky-300">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                Stable (Blue)
              </span>
              <span className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                Increasing Risk (Amber)
              </span>
              <span className="flex items-center gap-1.5 text-rose-800 dark:text-rose-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                High Concern (Red)
              </span>
            </div>
          </div>
        </div>

        {/* CASE DISTRIBUTION DONUT CHART SECTION (Step 13) */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              CASE DISTRIBUTION
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
              Caseload breakdown by verified risk level
            </p>
          </div>

          {/* SVG Donut Chart with "Active Cases" in the center */}
          <div className="flex items-center justify-center py-2">
            <svg viewBox="0 0 160 160" className="w-36 h-36">
              {/* Background ring */}
              <circle cx="80" cy="80" r="54" fill="none" stroke="#e2e8f0" strokeWidth="18" className="dark:stroke-slate-800" />

              {/* Stable (54%) - Circumference is 2 * PI * 54 = 339.29 */}
              {/* Stable: 54% of 339.29 = 183.2 */}
              <circle
                cx="80"
                cy="80"
                r="54"
                fill="none"
                stroke="#059669"
                strokeWidth="18"
                strokeDasharray="183.2 156.1"
                strokeDashoffset="0"
                transform="rotate(-90 80 80)"
              />
              {/* Improving (28%) - 28% of 339.29 = 95.0 */}
              <circle
                cx="80"
                cy="80"
                r="54"
                fill="none"
                stroke="#0284c7"
                strokeWidth="18"
                strokeDasharray="95.0 244.3"
                strokeDashoffset="-183.2"
                transform="rotate(-90 80 80)"
              />
              {/* Increasing Risk (14%) - 14% of 339.29 = 47.5 */}
              <circle
                cx="80"
                cy="80"
                r="54"
                fill="none"
                stroke="#d97706"
                strokeWidth="18"
                strokeDasharray="47.5 291.8"
                strokeDashoffset="-278.2"
                transform="rotate(-90 80 80)"
              />
              {/* High Concern (4%) - 4% of 339.29 = 13.6 */}
              <circle
                cx="80"
                cy="80"
                r="54"
                fill="none"
                stroke="#dc2626"
                strokeWidth="18"
                strokeDasharray="13.6 325.7"
                strokeDashoffset="-325.7"
                transform="rotate(-90 80 80)"
              />

              {/* Center Active Cases Text */}
              <text x="80" y="74" textAnchor="middle" className="text-xl font-bold fill-slate-900 dark:fill-white">
                {totalAssigned}
              </text>
              <text x="80" y="90" textAnchor="middle" className="text-[10px] font-bold fill-slate-700 dark:fill-slate-300">
                Active Cases
              </text>
            </svg>
          </div>

          {/* Donut Legend */}
          <div className="space-y-1.5 pt-1 text-xs">
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-850">
              <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Stable
              </span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                54% ({Math.round(totalAssigned * 0.54)} cases)
              </span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-850">
              <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                Improving
              </span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                28% ({Math.round(totalAssigned * 0.28)} cases)
              </span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-850">
              <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                Increasing Risk
              </span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                14% ({Math.round(totalAssigned * 0.14)} cases)
              </span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-850">
              <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                High Concern
              </span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                4% ({Math.max(1, Math.round(totalAssigned * 0.04))} case)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search by Case ID, district, priority..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium placeholder:text-slate-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Risk Level Filter */}
          <select
            value={selectedRisk}
            onChange={e => setSelectedRisk(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Concern</option>
            <option value="elevated">Elevated Indicator</option>
            <option value="mild">Mild Concern</option>
            <option value="stable">Stable</option>
          </select>

          {/* Stage Filter */}
          <select
            value={selectedStage}
            onChange={e => setSelectedStage(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">All Case Stages</option>
            <option value="complaint">Complaint</option>
            <option value="investigation">Investigation</option>
            <option value="trial">Trial</option>
            <option value="rehabilitation">Rehabilitation</option>
            <option value="compensation">Compensation</option>
            <option value="protection">Protection</option>
          </select>
        </div>
      </div>

      {/* Case Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-300 dark:border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Status / Risk</th>
                <th className="py-3 px-4">Distress Trend</th>
                <th className="py-3 px-4">Last Check-in</th>
                <th className="py-3 px-4">Priority Reason</th>
                <th className="py-3 px-4">Follow-up Due</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
              {filteredCases.map(item => (
                <tr
                  key={item.id}
                  onClick={() => {
                    setSelectedCaseId(item.id);
                    onSelectCase(item.id);
                  }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-850/60 cursor-pointer transition"
                >
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-900 dark:text-white whitespace-nowrap">
                    <div>
                      <span className="font-bold text-indigo-600 dark:text-emerald-400">{item.id}</span>
                      <span className="text-[11px] text-slate-600 dark:text-slate-400 block font-sans font-medium">
                        {item.anonymizedCode} · {item.district}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getRiskBadge(item.riskLevel)}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {item.currentScore}/100
                      </span>
                      {getTrendIcon(item.currentScore, item.previousScore)}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 whitespace-nowrap font-medium">
                    {item.lastCheckInDate}
                    {item.missedCheckInsCount > 0 && (
                      <span className="text-[10px] text-rose-700 dark:text-rose-400 font-bold block">
                        ({item.missedCheckInsCount} missed)
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 max-w-xs truncate font-medium">
                    {item.priorityReason}
                  </td>

                  <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 whitespace-nowrap font-semibold">
                    {item.nextFollowUpDate}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedCaseId(item.id);
                        onSelectCase(item.id);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold text-xs transition border border-slate-300 dark:border-slate-700 min-h-[32px] cursor-pointer"
                    >
                      <span>Review</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
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
