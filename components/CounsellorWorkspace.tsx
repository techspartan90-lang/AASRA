'use client';

import React, { useState, useMemo } from 'react';
import {
  counsellorWorkbenchEngine,
  WorkbenchSection,
  SurvivorDetailTab,
  AnonymizedSurvivorProfile,
  FollowUpScheduleItem,
} from '@/lib/counsellor-workbench-data';
import {
  Users,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  ShieldAlert,
  ChevronRight,
  Calendar,
  FileText,
  PhoneCall,
  UserCheck,
  History,
  Lock,
  Sparkles,
  Info,
  X,
  MessageSquare,
  Shield,
  Layers,
  HeartHandshake,
  CheckCheck,
  Activity,
  Plus,
} from 'lucide-react';

interface CounsellorWorkspaceProps {
  onSelectCase?: (caseId: string) => void;
}

export function CounsellorWorkspace({ onSelectCase }: CounsellorWorkspaceProps) {
  // 8 Main Sections selector
  const [activeSection, setActiveSection] = useState<WorkbenchSection>('worklist');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('all');
  const [selectedFollowUpFilter, setSelectedFollowUpFilter] = useState<string>('all');

  // Active survivor detail modal / drawer
  const [selectedSurvivor, setSelectedSurvivor] = useState<AnonymizedSurvivorProfile | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<SurvivorDetailTab>('Overview');

  // 6 Action Modals
  const [activeActionModal, setActiveActionModal] = useState<
    'contact' | 'schedule' | 'add_note' | 'assign' | 'escalate' | 'resolve_alert' | null
  >(null);

  // Action form state
  const [actionInputText, setActionInputText] = useState('');
  const [actionSecondaryInput, setActionSecondaryInput] = useState('');
  const [actionModality, setActionModality] = useState<FollowUpScheduleItem['modality']>('Tele-Counselling');
  const [actionPriority, setActionPriority] = useState<FollowUpScheduleItem['priority']>('High');

  // Local state for survivors & schedule
  const [survivors, setSurvivors] = useState<AnonymizedSurvivorProfile[]>(() =>
    counsellorWorkbenchEngine.getSurvivors()
  );
  const [schedule, setSchedule] = useState<FollowUpScheduleItem[]>(() =>
    counsellorWorkbenchEngine.getSchedule()
  );

  const refreshData = () => {
    setSurvivors(counsellorWorkbenchEngine.getSurvivors());
    setSchedule(counsellorWorkbenchEngine.getSchedule());
    if (selectedSurvivor) {
      const updated = counsellorWorkbenchEngine.getSurvivorById(selectedSurvivor.anonymizedId);
      if (updated) setSelectedSurvivor(updated);
    }
  };

  // Filtered survivors for priority worklist
  const filteredSurvivors = useMemo(() => {
    return survivors.filter(s => {
      const matchRisk = selectedRiskFilter === 'all' || s.riskCategory === selectedRiskFilter;
      const matchFollowUp = selectedFollowUpFilter === 'all' || s.followUpStatus === selectedFollowUpFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        s.anonymizedId.toLowerCase().includes(q) ||
        s.caseId.toLowerCase().includes(q) ||
        s.districtCode.toLowerCase().includes(q) ||
        s.assignedCounsellor.toLowerCase().includes(q);

      return matchRisk && matchFollowUp && matchSearch;
    });
  }, [survivors, selectedRiskFilter, selectedFollowUpFilter, searchQuery]);

  // Action submission handlers
  const handleExecuteAction = () => {
    if (!selectedSurvivor) return;
    const sId = selectedSurvivor.anonymizedId;
    const author = 'Dr. Priya Nair (Lead Clinical Psychologist)';

    if (activeActionModal === 'contact') {
      counsellorWorkbenchEngine.recordContact(sId, author, actionSecondaryInput || 'Direct Secure Telephony', actionInputText);
    } else if (activeActionModal === 'schedule') {
      counsellorWorkbenchEngine.scheduleFollowUp({
        survivorId: sId,
        scheduledTime: actionSecondaryInput || 'Today, 17:00 IST',
        modality: actionModality,
        priority: actionPriority,
        counsellor: author,
        focusMilestone: actionInputText || 'General wellness and pre-trial follow-up',
      });
    } else if (activeActionModal === 'add_note') {
      counsellorWorkbenchEngine.addClinicalNote(sId, author, 'Progress', actionInputText);
    } else if (activeActionModal === 'assign') {
      counsellorWorkbenchEngine.assignCounsellor(sId, actionSecondaryInput || 'Dr. Rajesh Verma (District Officer)', author, actionInputText);
    } else if (activeActionModal === 'escalate') {
      counsellorWorkbenchEngine.escalateSurvivor(sId, actionSecondaryInput || 'District Social Welfare Officer', author, actionInputText);
    } else if (activeActionModal === 'resolve_alert') {
      counsellorWorkbenchEngine.resolveAlert(sId, author, actionInputText);
    }

    setActionInputText('');
    setActionSecondaryInput('');
    setActiveActionModal(null);
    refreshData();
  };

  const openSurvivorModal = (s: AnonymizedSurvivorProfile, tab: SurvivorDetailTab = 'Overview') => {
    setSelectedSurvivor(s);
    setActiveDetailTab(tab);
  };

  // Helper for trend badge
  const renderTrendBadge = (s: AnonymizedSurvivorProfile) => {
    if (s.trendDirection === 'Spiking' || s.trendDirection === 'Rising') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{s.scoreChangeFormatted}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
        <TrendingDown className="w-3.5 h-3.5" />
        <span>{s.scoreChangeFormatted}</span>
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* =========================================================================
          WORKBENCH CLINICAL HEADER
          ========================================================================= */}
      <section
        aria-labelledby="workbench-heading"
        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <Users className="w-3.5 h-3.5" aria-hidden="true" />
                Phase 9: Clinical-Support Workbench
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                Privacy Anonymization Shield Active
              </span>
            </div>

            <h1
              id="workbench-heading"
              className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight"
            >
              Counsellor Clinical Dashboard
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium mt-1 max-w-3xl leading-relaxed">
              Dr. Priya Nair · Lead Clinical Psychologist · District Kamrup Rural Casework Cell. Designed around safety, non-stigmatizing triage, and survivor control.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-bold px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              {survivors.filter(s => s.followUpStatus === 'Due Today').length} Follow-ups Due Today
            </span>
          </div>
        </div>

        {/* =====================================================================
            MAIN 8 SECTIONS NAVIGATION
            1. Priority Worklist
            2. Today's Follow-ups
            3. Distress Trends
            4. Alerts
            5. Assigned Survivors
            6. Case Context
            7. Notes
            8. Follow-up Schedule
            ===================================================================== */}
        <div className="pt-2">
          <nav
            aria-label="Counsellor Workbench Sections"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none"
          >
            {[
              { id: 'worklist', label: '1. Priority Worklist', count: survivors.length },
              { id: 'today_followups', label: "2. Today's Follow-ups", count: survivors.filter(s => s.followUpStatus === 'Due Today').length },
              { id: 'distress_trends', label: '3. Distress Trends' },
              { id: 'alerts', label: '4. Alerts', count: survivors.reduce((acc, s) => acc + s.activeAlertCount, 0) },
              { id: 'assigned_survivors', label: '5. Assigned Survivors', count: survivors.length },
              { id: 'case_context', label: '6. Case Context' },
              { id: 'notes', label: '7. Notes' },
              { id: 'followup_schedule', label: '8. Follow-up Schedule', count: schedule.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as WorkbenchSection)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer min-h-[40px] ${
                  activeSection === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                      activeSection === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: PRIORITY WORKLIST
          Each survivor row:
          - anonymized ID
          - latest distress indicator
          - change from baseline
          - last check-in
          - trend
          - assigned counsellor
          - follow-up status
          Do not unnecessarily expose personally identifiable information.
          ========================================================================= */}
      {activeSection === 'worklist' && (
        <section aria-labelledby="priority-worklist-heading" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                <Users className="w-4 h-4" />
              </span>
              <div>
                <h2 id="priority-worklist-heading" className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Priority Casework List
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  Strictly anonymized clinical identifiers protecting survivor privacy
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by ID, district..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Risk Filter */}
              <select
                value={selectedRiskFilter}
                onChange={e => setSelectedRiskFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
              >
                <option value="all">All Risks</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              {/* Follow-up filter */}
              <select
                value={selectedFollowUpFilter}
                onChange={e => setSelectedFollowUpFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Due Today">Due Today</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Anonymized Priority Worklist Table */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th scope="col" className="py-3.5 px-4">Anonymized ID</th>
                    <th scope="col" className="py-3.5 px-4">Distress Indicator</th>
                    <th scope="col" className="py-3.5 px-4">Change from Baseline</th>
                    <th scope="col" className="py-3.5 px-4">Last Check-in</th>
                    <th scope="col" className="py-3.5 px-4">Trend</th>
                    <th scope="col" className="py-3.5 px-4">Assigned Counsellor</th>
                    <th scope="col" className="py-3.5 px-4">Follow-up Status</th>
                    <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredSurvivors.map(s => (
                    <tr
                      key={s.anonymizedId}
                      onClick={() => openSurvivorModal(s, 'Overview')}
                      className="hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 cursor-pointer transition"
                    >
                      {/* 1. Anonymized ID */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500" />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white font-mono block">
                              {s.anonymizedId}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {s.caseId} · {s.districtCode}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Latest Distress Indicator */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                            {s.latestDistressIndicator}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              s.riskCategory === 'Critical'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : s.riskCategory === 'High'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : s.riskCategory === 'Medium'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                          >
                            {s.riskCategory}
                          </span>
                        </div>
                      </td>

                      {/* 3. Change from Baseline */}
                      <td className="py-4 px-4 whitespace-nowrap font-mono font-semibold">
                        {renderTrendBadge(s)}
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Base: {s.baselineScore} pts
                        </span>
                      </td>

                      {/* 4. Last Check-in */}
                      <td className="py-4 px-4 whitespace-nowrap text-slate-700 dark:text-slate-300">
                        {s.lastCheckInFormatted}
                      </td>

                      {/* 5. Trend */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {s.trendDirection}
                        </span>
                      </td>

                      {/* 6. Assigned Counsellor */}
                      <td className="py-4 px-4 whitespace-nowrap text-slate-700 dark:text-slate-300">
                        {s.assignedCounsellor}
                      </td>

                      {/* 7. Follow-up Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            s.followUpStatus === 'Due Today'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900'
                              : s.followUpStatus === 'Scheduled'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {s.followUpStatus}
                        </span>
                      </td>

                      {/* Row Action Button */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            openSurvivorModal(s, 'Overview');
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
                        >
                          <span>Review File</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 2: TODAY'S FOLLOW-UPS
          ========================================================================= */}
      {activeSection === 'today_followups' && (
        <section aria-labelledby="today-followups-heading" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 id="today-followups-heading" className="text-xl font-black text-slate-900 dark:text-white">
              Today&apos;s Follow-up Schedule
            </h2>
            <span className="text-xs text-slate-500 font-medium">Coordinated through Section 15A protection guidelines</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedule.map(item => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono">
                    {item.anonymizedId}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.priority === 'Critical'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block">Scheduled Time:</span>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{item.scheduledTime}</p>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Modality:</span> {item.modality}
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl">
                  {item.focusMilestone}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">{item.counsellor}</span>
                  <button
                    onClick={() => {
                      const s = counsellorWorkbenchEngine.getSurvivorById(item.survivorId);
                      if (s) openSurvivorModal(s, 'Overview');
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                  >
                    Open Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 3: DISTRESS TRENDS
          ========================================================================= */}
      {activeSection === 'distress_trends' && (
        <section aria-labelledby="trends-section-heading" className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
          <h2 id="trends-section-heading" className="text-xl font-black text-slate-900 dark:text-white">
            Longitudinal Distress Trends Across Caseload
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Comparing individual trajectories against 30-day intake baselines.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {survivors.map(s => (
              <div key={s.anonymizedId} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold">{s.anonymizedId}</span>
                  {renderTrendBadge(s)}
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {s.latestDistressIndicator} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  7-Day Avg: {s.trends.sevenDayAverage} · Volatility: {s.trends.volatilityIndex}
                </p>
                <button
                  onClick={() => openSurvivorModal(s, 'Trends')}
                  className="w-full mt-2 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 cursor-pointer"
                >
                  View Longitudinal Curve
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 4: ALERTS
          ========================================================================= */}
      {activeSection === 'alerts' && (
        <section aria-labelledby="alerts-section-heading" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 id="alerts-section-heading" className="text-xl font-black text-slate-900 dark:text-white">
              Active Operational Alerts
            </h2>
            <span className="text-xs text-slate-500 font-medium">Non-clinical alerts flagged for caseworker review</span>
          </div>

          <div className="space-y-3">
            {survivors.filter(s => s.activeAlertCount > 0).map(s => (
              <div key={s.anonymizedId} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                      {s.riskCategory} Alert
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">{s.anonymizedId}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {s.overview.safeguardingSummary}
                  </h3>
                  <span className="text-[11px] text-slate-500 block">
                    Assigned: {s.assignedCounsellor} · Status: {s.followUpStatus}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedSurvivor(s);
                      setActiveActionModal('resolve_alert');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 cursor-pointer min-h-[36px]"
                  >
                    Resolve Alert
                  </button>
                  <button
                    onClick={() => openSurvivorModal(s, 'AI Signals')}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer min-h-[36px]"
                  >
                    Review Signals
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 5: ASSIGNED SURVIVORS
          ========================================================================= */}
      {activeSection === 'assigned_survivors' && (
        <section aria-labelledby="assigned-survivors-heading" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 id="assigned-survivors-heading" className="text-xl font-black text-slate-900 dark:text-white">
              Assigned Survivor Caseload
            </h2>
            <span className="text-xs text-slate-500 font-medium">Licensed Casework Allocation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {survivors.map(s => (
              <div key={s.anonymizedId} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {s.anonymizedId} ({s.caseId})
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{s.districtCode} · {s.state}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {s.overview.safeguardingSummary}
                </p>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Stage: <strong>{s.caseStage}</strong></span>
                  <button
                    onClick={() => openSurvivorModal(s, 'Overview')}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Open Survivor File →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 6: CASE CONTEXT
          ========================================================================= */}
      {activeSection === 'case_context' && (
        <section aria-labelledby="case-context-heading" className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
          <h2 id="case-context-heading" className="text-xl font-black text-slate-900 dark:text-white">
            Case Context &amp; Judicial Milestone Registry
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Contextual tracking of judicial events (hearings, bail objections, compensation dispersal).
          </p>

          <div className="space-y-3 pt-2">
            {survivors[0].caseTimeline.map(item => (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{item.milestone}</span>
                  <span className="text-slate-500">{item.notes}</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">{item.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 7: NOTES
          ========================================================================= */}
      {activeSection === 'notes' && (
        <section aria-labelledby="notes-section-heading" className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 id="notes-section-heading" className="text-xl font-black text-slate-900 dark:text-white">
              Clinical &amp; Casework Notes Feed
            </h2>
            <button
              onClick={() => {
                setSelectedSurvivor(survivors[0]);
                setActiveActionModal('add_note');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Clinical Note</span>
            </button>
          </div>

          <div className="space-y-3">
            {survivors.flatMap(s => s.clinicalNotes).map(n => (
              <div key={n.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">[{n.noteType}] · {n.author}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{new Date(n.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{n.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 8: FOLLOW-UP SCHEDULE
          ========================================================================= */}
      {activeSection === 'followup_schedule' && (
        <section aria-labelledby="schedule-section-heading" className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 id="schedule-section-heading" className="text-xl font-black text-slate-900 dark:text-white">
              Comprehensive Follow-up Schedule
            </h2>
            <button
              onClick={() => {
                setSelectedSurvivor(survivors[0]);
                setActiveActionModal('schedule');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule New Follow-up</span>
            </button>
          </div>

          <div className="space-y-3">
            {schedule.map(item => (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block font-mono">{item.anonymizedId}</span>
                  <p className="text-slate-600 dark:text-slate-400">{item.focusMilestone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.scheduledTime}</span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                    {item.modality}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          SURVIVOR DETAIL MODAL / DRAWER (8 TABS)
          Tabs:
          - Overview
          - Check-ins
          - Trends
          - AI Signals
          - Case Timeline
          - Support History
          - Notes
          - Privacy
          ========================================================================= */}
      {selectedSurvivor && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in"
        >
          <div className="w-full max-w-4xl max-h-[90vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-850/60">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white font-mono">
                      {selectedSurvivor.anonymizedId}
                    </h2>
                    <span className="text-xs text-slate-500 font-sans">
                      ({selectedSurvivor.caseId} · {selectedSurvivor.districtCode})
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Assigned: <strong>{selectedSurvivor.assignedCounsellor}</strong> · Status: {selectedSurvivor.followUpStatus}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSurvivor(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 8 Detail Tabs Header */}
            <div className="px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
              <div className="flex gap-2 min-w-max pb-3">
                {(
                  [
                    'Overview',
                    'Check-ins',
                    'Trends',
                    'AI Signals',
                    'Case Timeline',
                    'Support History',
                    'Notes',
                    'Privacy',
                  ] as SurvivorDetailTab[]
                ).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveDetailTab(tab)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      activeDetailTab === tab
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body: Active Tab Content */}
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-4">
              {/* Tab 1: Overview */}
              {activeDetailTab === 'Overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Intake Date</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedSurvivor.overview.intakeDate}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Language &amp; Channel</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedSurvivor.overview.preferredLanguage} ({selectedSurvivor.overview.preferredChannel})</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Trusted Kin Contact</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedSurvivor.overview.trustedContactDesignation}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Safeguarding Summary:</span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{selectedSurvivor.overview.safeguardingSummary}</p>
                  </div>
                </div>
              )}

              {/* Tab 2: Check-ins */}
              {activeDetailTab === 'Check-ins' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Historical Check-in Log:</span>
                  {selectedSurvivor.checkIns.map(chk => (
                    <div key={chk.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{chk.channel} · Mood: {chk.mood}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{new Date(chk.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 font-medium italic">&ldquo;{chk.textResponse}&rdquo;</p>
                      <div className="flex gap-2 pt-1 text-[11px] text-slate-500">
                        <span>Score: <strong>{chk.distressScore}</strong></span>
                        {chk.voiceAcousticRecorded && <span className="text-indigo-600 font-bold">· Audio Jitter Analyzed</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Trends */}
              {activeDetailTab === 'Trends' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">7-Day Mean</span>
                      <span className="text-xl font-black text-slate-900 dark:text-white block">{selectedSurvivor.trends.sevenDayAverage} pts</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Intake Baseline</span>
                      <span className="text-xl font-black text-emerald-600 block">{selectedSurvivor.trends.thirtyDayBaseline} pts</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Inflection Milestones:</span>
                    <ul className="space-y-1">
                      {selectedSurvivor.trends.recentShifts.map((shift, idx) => (
                        <li key={idx} className="text-slate-600 dark:text-slate-400 font-medium">· {shift}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 4: AI Signals (Strictly formatted with mandatory notice) */}
              {activeDetailTab === 'AI Signals' && (
                <div className="space-y-4">
                  {/* Mandatory Human Review Notice */}
                  <div
                    role="note"
                    className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-black text-xs uppercase tracking-wide flex items-center gap-2"
                  >
                    <Info className="w-4 h-4 shrink-0 text-amber-700 dark:text-amber-400" />
                    <span>{selectedSurvivor.aiSignals.mandatoryNotice}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Model Confidence</span>
                      <span className="text-lg font-black text-emerald-600">{Math.round(selectedSurvivor.aiSignals.modelConfidence * 100)}% Calibrated</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Model Version</span>
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{selectedSurvivor.aiSignals.modelVersion}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Inference Timestamp</span>
                      <span className="text-xs font-mono text-slate-500">{new Date(selectedSurvivor.aiSignals.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Contributing Multi-Modal Signals:</span>
                    <ul className="space-y-1.5">
                      {selectedSurvivor.aiSignals.contributingSignals.map((sig, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{sig}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 5: Case Timeline */}
              {activeDetailTab === 'Case Timeline' && (
                <div className="space-y-3">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Legal &amp; Judicial Journey Milestones:</span>
                  {selectedSurvivor.caseTimeline.map(item => (
                    <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{item.milestone}</span>
                        <span className="text-slate-500">{item.notes}</span>
                      </div>
                      <span className="font-mono text-slate-500 font-semibold">{item.date}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 6: Support History */}
              {activeDetailTab === 'Support History' && (
                <div className="space-y-3">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Past Counsellor Engagements:</span>
                  {selectedSurvivor.supportHistory.map(sup => (
                    <div key={sup.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{sup.sessionType} ({sup.durationMins} mins)</span>
                        <span className="text-slate-500 font-mono">{sup.date}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{sup.outcome}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 7: Notes */}
              {activeDetailTab === 'Notes' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Clinical Progress Notes:</span>
                    <button
                      onClick={() => setActiveActionModal('add_note')}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs cursor-pointer"
                    >
                      + Add Note
                    </button>
                  </div>
                  {selectedSurvivor.clinicalNotes.map(n => (
                    <div key={n.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 dark:text-white">[{n.noteType}] · {n.author}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{new Date(n.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">{n.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 8: Privacy */}
              {activeDetailTab === 'Privacy' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Consent State:</span>
                      <span className="font-bold text-emerald-600">{selectedSurvivor.privacy.consentStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Voice Acoustic Analysis:</span>
                      <span className="font-bold">{selectedSurvivor.privacy.voiceAnalysisAllowed ? 'Permitted' : 'Denied'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Automated Reminders:</span>
                      <span className="font-bold">{selectedSurvivor.privacy.automatedRemindersAllowed ? 'Permitted' : 'Denied'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Statutory Shield:</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedSurvivor.privacy.statutoryShield}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* =================================================================
                COUNSELLOR ACTIONS FOOTER (6 ACTIONS)
                - contact
                - schedule follow-up
                - add note
                - assign
                - escalate
                - resolve alert
                ================================================================= */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-500">Counsellor Actions:</span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveActionModal('contact')}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800 cursor-pointer min-h-[36px]"
                >
                  Contact
                </button>
                <button
                  onClick={() => setActiveActionModal('schedule')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-800 cursor-pointer min-h-[36px]"
                >
                  Schedule Follow-up
                </button>
                <button
                  onClick={() => setActiveActionModal('add_note')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 cursor-pointer min-h-[36px]"
                >
                  Add Note
                </button>
                <button
                  onClick={() => setActiveActionModal('assign')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 cursor-pointer min-h-[36px]"
                >
                  Assign
                </button>
                <button
                  onClick={() => setActiveActionModal('escalate')}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300 font-bold text-xs border border-amber-200 dark:border-amber-800 cursor-pointer min-h-[36px]"
                >
                  Escalate
                </button>
                <button
                  onClick={() => setActiveActionModal('resolve_alert')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer min-h-[36px]"
                >
                  Resolve Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ACTION EXECUTION MODAL
          ========================================================================= */}
      {activeActionModal && selectedSurvivor && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-black text-slate-900 dark:text-white capitalize">
                Action: {activeActionModal.replace('_', ' ')} ({selectedSurvivor.anonymizedId})
              </h2>
              <button onClick={() => setActiveActionModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {activeActionModal === 'contact' && (
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">Contact Modality / Channel:</label>
                  <select
                    value={actionSecondaryInput}
                    onChange={e => setActionSecondaryInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold"
                  >
                    <option value="Direct Secure Telephony">Direct Secure Telephony</option>
                    <option value="Encrypted SMS Wellness Prompt">Encrypted SMS Wellness Prompt</option>
                    <option value="IVRS Audio Care Note Dispatch">IVRS Audio Care Note Dispatch</option>
                  </select>
                </div>
              )}

              {activeActionModal === 'schedule' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block mb-1">Modality:</label>
                    <select
                      value={actionModality}
                      onChange={e => setActionModality(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold"
                    >
                      <option value="Tele-Counselling">Tele-Counselling</option>
                      <option value="In-Person Sanctuary">In-Person Sanctuary</option>
                      <option value="Secure Voice Note">Secure Voice Note</option>
                      <option value="Caseworker Check-In">Caseworker Check-In</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Time Slot:</label>
                    <input
                      type="text"
                      placeholder="e.g. Today, 16:00 IST"
                      value={actionSecondaryInput}
                      onChange={e => setActionSecondaryInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold"
                    />
                  </div>
                </div>
              )}

              {activeActionModal === 'assign' && (
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">Select Reassignment Counsellor:</label>
                  <select
                    value={actionSecondaryInput}
                    onChange={e => setActionSecondaryInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold"
                  >
                    <option value="Dr. Rajesh Verma (District Officer)">Dr. Rajesh Verma (District Officer)</option>
                    <option value="S. Meenakshi (Senior Counsellor)">S. Meenakshi (Senior Counsellor)</option>
                    <option value="Amitabh Sen (Field Caseworker)">Amitabh Sen (Field Caseworker)</option>
                  </select>
                </div>
              )}

              {activeActionModal === 'escalate' && (
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">Escalate to Authority:</label>
                  <select
                    value={actionSecondaryInput}
                    onChange={e => setActionSecondaryInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold"
                  >
                    <option value="District Social Welfare Officer">District Social Welfare Officer</option>
                    <option value="Special Public Prosecutor / Legal Aid Lead">Special Public Prosecutor / Legal Aid Lead</option>
                    <option value="State Nodal Officer (SC/ST Protection)">State Nodal Officer (SC/ST Protection)</option>
                    <option value="24x7 Tele-MANAS Crisis Lead">24x7 Tele-MANAS Crisis Lead</option>
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  {activeActionModal === 'resolve_alert'
                    ? 'Resolution Summary (Mandatory):'
                    : 'Caseworker Justification & Observation:'}
                </label>
                <textarea
                  rows={3}
                  value={actionInputText}
                  onChange={e => setActionInputText(e.target.value)}
                  placeholder="Enter details for clinical record..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveActionModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer min-h-[40px]"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteAction}
                className="px-5 py-2 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer min-h-[40px]"
              >
                Confirm {activeActionModal.replace('_', ' ')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
