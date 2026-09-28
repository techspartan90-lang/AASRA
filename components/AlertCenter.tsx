'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { RiskAlert, RiskLevel } from '@/types';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  ExternalLink,
  UserCheck,
  CheckCheck,
  Calendar,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface AlertCenterProps {
  onSelectCase: (caseId: string) => void;
}

export function AlertCenter({ onSelectCase }: AlertCenterProps) {
  const { alerts, resolveAlert, setSelectedCaseId, role } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Role-based scope: victims see only their own alerts, staff see their caseload
  const authorizedAlerts = role === 'victim'
    ? alerts.filter(a => a.caseId === 'CASE-002' || a.caseId === 'ATC-2026-00124')
    : alerts;

  const filteredAlerts = authorizedAlerts.filter(a => {
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || a.riskLevel === filterSeverity;
    const matchesSearch =
      a.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.caseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.reason.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSeverity && matchesSearch;
  });

  const getSeverityClasses = (riskLevel: RiskLevel, status: RiskAlert['status']) => {
    if (status === 'resolved') {
      return {
        card: 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-80',
        title: 'text-slate-900 dark:text-white',
        desc: 'text-slate-700 dark:text-slate-300',
        meta: 'text-slate-600 dark:text-slate-400',
        signal: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
      };
    }
    if (riskLevel === 'high' || status === 'urgent') {
      return {
        card: 'border-rose-300 dark:border-rose-900 bg-rose-50/70 dark:bg-rose-950/20',
        title: 'text-rose-950 dark:text-rose-100',
        desc: 'text-rose-900 dark:text-rose-200',
        meta: 'text-rose-800 dark:text-rose-300',
        signal: 'bg-rose-100 text-rose-900 border border-rose-200 dark:bg-rose-900/40 dark:text-rose-200 dark:border-rose-800',
      };
    }
    if (riskLevel === 'elevated' || status === 'pending') {
      return {
        card: 'border-amber-300 dark:border-amber-900 bg-amber-50/70 dark:bg-amber-950/20',
        title: 'text-amber-950 dark:text-amber-100',
        desc: 'text-amber-900 dark:text-amber-200',
        meta: 'text-amber-800 dark:text-amber-300',
        signal: 'bg-amber-100 text-amber-900 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800',
      };
    }
    // Mild / Low
    return {
      card: 'border-sky-300 dark:border-sky-900 bg-sky-50/70 dark:bg-sky-950/20',
      title: 'text-sky-950 dark:text-sky-100',
      desc: 'text-sky-900 dark:text-sky-200',
      meta: 'text-sky-800 dark:text-sky-300',
      signal: 'bg-sky-100 text-sky-900 border border-sky-200 dark:bg-sky-900/40 dark:text-sky-200 dark:border-sky-800',
    };
  };

  const getStatusBadge = (status: RiskAlert['status']) => {
    switch (status) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-800">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            Urgent Review
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            Pending Triage
          </span>
        );
      case 'reviewed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950/70 text-sky-900 dark:text-sky-200 border border-sky-300 dark:border-sky-800">
            <span className="w-2 h-2 rounded-full bg-sky-600" />
            Follow-up Required
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            Resolved
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Distress Alert Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
            Real-time human assessment triage queue for acute distress and security changes
          </p>
        </div>

        {/* Ethical Safeguard Banner */}
        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 max-w-md text-[11px] text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-500 shrink-0" />
          <span>
            Automated alerts are screening flags. Independent legal, protective, or medical decisions cannot be made by AI without caseworker evaluation.
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search alerts by Case ID, reason..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-850 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'urgent', label: 'Urgent' },
              { id: 'pending', label: 'Pending' },
              { id: 'reviewed', label: 'Reviewed' },
              { id: 'resolved', label: 'Resolved' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  filterStatus === tab.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">All Severities</option>
            <option value="high">🟠 High Concern</option>
            <option value="elevated">🟡 Elevated Indicator</option>
            <option value="mild">🔵 Mild Concern</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3.5">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              No alerts match the selected criteria
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              All active monitored cases in this filter category have been triaged.
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const styles = getSeverityClasses(alert.riskLevel, alert.status);
            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border transition shadow-xs ${styles.card}`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(alert.status)}
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                        {alert.caseId} ({alert.caseCode})
                      </span>
                      <span className="text-slate-400 text-xs">·</span>
                      <span className={`text-xs font-medium ${styles.meta}`}>
                        {alert.district}
                      </span>
                      <span className="text-slate-400 text-xs">·</span>
                      <span className={`text-xs font-medium ${styles.meta}`}>
                        Triggered {alert.timestamp}
                      </span>
                    </div>

                    <h3 className={`text-base font-bold ${styles.title}`}>
                      {alert.title}
                    </h3>

                    <p className={`text-xs leading-relaxed max-w-3xl font-medium ${styles.desc}`}>
                      {alert.reason}
                    </p>

                    {/* Signals List */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {alert.signals.map((sig, idx) => (
                        <span
                          key={idx}
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${styles.signal}`}
                        >
                          • {sig}
                        </span>
                      ))}
                    </div>
                  </div>

                {/* Actions (Section 11) */}
                <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end shrink-0 pt-2 lg:pt-0">
                  <button
                    onClick={() => {
                      setSelectedCaseId(alert.caseId);
                      onSelectCase(alert.caseId);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer min-h-[36px]"
                  >
                    <span>Open Case</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  {alert.status !== 'resolved' ? (
                    <button
                      onClick={() => resolveAlert(alert.id, 'resolved')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold transition cursor-pointer min-h-[36px]"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark Reviewed</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-1">
                      ✓ Resolved by caseworker
                    </span>
                  )}
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>
    </div>
  );
}
