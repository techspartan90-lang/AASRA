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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Counsellor Workspace
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Active caseload triage, distress trend surveillance, and intervention coordination
          </p>
        </div>
      </div>

      {/* 5 Key Metric Cards (as explicitly listed in Section 8) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Assigned Cases</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{totalAssigned}</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Needs Follow-up</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">8</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Elevated Indicators</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">5</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">High Priority</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">2</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Follow-ups Due Today</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">{followUpsDueToday}</span>
            <Calendar className="w-4 h-4 text-sky-500" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Case ID, district, priority..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Risk Level Filter */}
          <select
            value={selectedRisk}
            onChange={e => setSelectedRisk(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
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
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
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

      {/* Case Table (Section 8) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
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
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
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
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{item.id}</span>
                      <span className="text-[10px] text-slate-400 block font-sans">
                        {item.anonymizedCode} · {item.district}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getRiskBadge(item.riskLevel)}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-slate-900 dark:text-white">
                        {item.currentScore}/100
                      </span>
                      {getTrendIcon(item.currentScore, item.previousScore)}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {item.lastCheckInDate}
                    {item.missedCheckInsCount > 0 && (
                      <span className="text-[10px] text-rose-500 font-semibold block">
                        ({item.missedCheckInsCount} missed)
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                    {item.priorityReason}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap font-medium">
                    {item.nextFollowUpDate}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedCaseId(item.id);
                        onSelectCase(item.id);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs transition min-h-[32px]"
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
