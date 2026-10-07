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
  GlassPanel,
  LuxuryCard,
  LuxuryButton,
  GlassInput,
  GlassTextarea,
  PremiumBadge,
} from '@/components/design-system';
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
  Send,
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
      counsellorWorkbenchEngine.addClinicalNote(sId, author, 'Observation', actionInputText);
    } else if (activeActionModal === 'assign') {
      counsellorWorkbenchEngine.assignCounsellor(sId, actionSecondaryInput || author, 'Lead Clinical Review', actionInputText);
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
        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FD1053] bg-[#FD1053]/15 px-2 py-0.5 rounded-lg border border-[#FD1053]/30">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{s.scoreChangeFormatted}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-lg border border-emerald-500/30">
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
        className="rounded-3xl bg-[#333333]/90 dark:bg-[#1E1E1E]/95 border border-[#474747]/30 dark:border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-xl text-white space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FD1053]/15 text-[#FD1053] border border-[#FD1053]/30">
                <Users className="w-3.5 h-3.5" aria-hidden="true" />
                Phase 9: Clinical-Support Workbench
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#474747]/60 text-emerald-400 border border-emerald-500/30">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                Privacy Anonymization Shield Active
              </span>
            </div>

            <h1
              id="workbench-heading"
              className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
            >
              Counsellor Clinical Dashboard
            </h1>
            <p className="text-sm text-[#D6D6D6] font-medium mt-1 max-w-3xl leading-relaxed">
              Dr. Priya Nair · Lead Clinical Psychologist · District Kamrup Rural Casework Cell. Designed around safety, non-stigmatizing triage, and survivor control.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-bold px-3.5 py-2.5 rounded-2xl bg-[#474747]/60 text-white border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FD1053] animate-pulse" />
              {survivors.filter(s => s.followUpStatus === 'Due Today').length} Follow-ups Due Today
            </span>
          </div>
        </div>

        {/* 8 SECTIONS NAVIGATION */}
        <div className="pt-2">
          <nav
            aria-label="Counsellor Workbench Sections"
            className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
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
            ].map(tab => {
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as WorkbenchSection)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition cursor-pointer min-h-[42px] ${
                    isActive
                      ? 'bg-[#FD1053] text-white shadow-lg shadow-[#FD1053]/25'
                      : 'bg-[#474747]/40 text-[#D6D6D6] hover:text-white hover:bg-[#474747]'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#333333] text-[#D6D6D6]'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: PRIORITY WORKLIST
          ========================================================================= */}
      {activeSection === 'worklist' && (
        <section aria-labelledby="priority-worklist-heading" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl glass-panel">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-[#FD1053]/15 text-[#FD1053]">
                <Users className="w-5 h-5" />
              </span>
              <div>
                <h2 id="priority-worklist-heading" className="text-sm font-bold text-white uppercase tracking-wider">
                  Priority Casework List
                </h2>
                <span className="text-xs text-[#D6D6D6] font-medium">
                  Strictly anonymized clinical identifiers protecting survivor privacy
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#D6D6D6] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by ID, district..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-2 rounded-xl bg-[#474747]/40 border border-white/10 text-xs font-medium text-white placeholder:text-[#D6D6D6]/60 focus:outline-hidden focus:border-[#FD1053]/40 min-h-[38px]"
                />
              </div>

              {/* Risk Filter */}
              <select
                value={selectedRiskFilter}
                onChange={e => setSelectedRiskFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#474747]/40 border border-white/10 text-xs font-semibold text-white cursor-pointer min-h-[38px]"
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
                className="px-3 py-2 rounded-xl bg-[#474747]/40 border border-white/10 text-xs font-semibold text-white cursor-pointer min-h-[38px]"
              >
                <option value="all">All Statuses</option>
                <option value="Due Today">Due Today</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Anonymized Priority Worklist Table */}
          <div className="rounded-3xl border border-white/10 glass-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#333333]/80 text-[#D6D6D6] font-bold border-b border-white/10 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th scope="col" className="py-4 px-5">Anonymized ID</th>
                    <th scope="col" className="py-4 px-4">Distress Indicator</th>
                    <th scope="col" className="py-4 px-4">Change from Baseline</th>
                    <th scope="col" className="py-4 px-4">Last Check-in</th>
                    <th scope="col" className="py-4 px-4">Trend</th>
                    <th scope="col" className="py-4 px-4">Assigned Counsellor</th>
                    <th scope="col" className="py-4 px-4">Follow-up Status</th>
                    <th scope="col" className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {filteredSurvivors.map(s => (
                    <tr
                      key={s.anonymizedId}
                      onClick={() => openSurvivorModal(s, 'Overview')}
                      className="hover:bg-[#474747]/30 cursor-pointer transition"
                    >
                      {/* 1. Anonymized ID */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#FD1053]" />
                          <div>
                            <span className="font-bold text-white font-mono block">
                              {s.anonymizedId}
                            </span>
                            <span className="text-[10px] text-[#D6D6D6]">
                              {s.caseId} · {s.districtCode}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Latest Distress Indicator */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-white font-mono">
                            {s.latestDistressIndicator}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              s.riskCategory === 'Critical'
                                ? 'bg-[#FD1053] text-white shadow-xs'
                                : s.riskCategory === 'High'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : s.riskCategory === 'Medium'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {s.riskCategory}
                          </span>
                        </div>
                      </td>

                      {/* 3. Change from Baseline */}
                      <td className="py-4 px-4 whitespace-nowrap font-mono font-semibold">
                        {renderTrendBadge(s)}
                        <span className="text-[10px] text-[#D6D6D6] block mt-0.5">
                          Base: {s.baselineScore} pts
                        </span>
                      </td>

                      {/* 4. Last Check-in */}
                      <td className="py-4 px-4 whitespace-nowrap text-[#D6D6D6]">
                        {s.lastCheckInFormatted}
                      </td>

                      {/* 5. Trend */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="text-xs font-semibold text-white">
                          {s.trendDirection}
                        </span>
                      </td>

                      {/* 6. Assigned Counsellor */}
                      <td className="py-4 px-4 whitespace-nowrap text-[#D6D6D6]">
                        {s.assignedCounsellor}
                      </td>

                      {/* 7. Follow-up Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            s.followUpStatus === 'Due Today'
                              ? 'bg-[#FD1053]/15 text-[#FD1053] border border-[#FD1053]/35'
                              : s.followUpStatus === 'Scheduled'
                              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                              : 'bg-[#474747]/60 text-[#D6D6D6]'
                          }`}
                        >
                          {s.followUpStatus}
                        </span>
                      </td>

                      {/* Row Action Button */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            openSurvivorModal(s, 'Overview');
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#474747]/40 hover:bg-[#FD1053] hover:text-white text-white font-semibold text-xs transition cursor-pointer min-h-[36px]"
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
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 id="today-followups-heading" className="text-xl font-bold text-white">
              Today&apos;s Follow-up Schedule
            </h2>
            <span className="text-xs text-[#D6D6D6] font-medium">Coordinated through Section 15A protection guidelines</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedule.map(item => (
              <LuxuryCard
                key={item.id}
                className="p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#474747] text-white font-mono">
                    {item.anonymizedId}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.priority === 'Critical'
                        ? 'bg-[#FD1053] text-white'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-[#D6D6D6] block">Scheduled Time:</span>
                  <p className="text-sm font-bold text-white">{item.scheduledTime}</p>
                </div>

                <div className="text-xs text-[#D6D6D6]">
                  <span className="font-semibold text-white">Modality:</span> {item.modality}
                </div>

                <p className="text-xs text-[#D6D6D6] font-medium bg-[#474747]/30 p-2.5 rounded-xl border border-white/5">
                  {item.focusMilestone}
                </p>

                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-[#D6D6D6] font-medium">{item.counsellor}</span>
                  <button
                    onClick={() => {
                      const s = counsellorWorkbenchEngine.getSurvivorById(item.survivorId);
                      if (s) openSurvivorModal(s, 'Overview');
                    }}
                    className="text-[#FD1053] font-bold hover:underline cursor-pointer"
                  >
                    Open Profile →
                  </button>
                </div>
              </LuxuryCard>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 3: DISTRESS TRENDS
          ========================================================================= */}
      {activeSection === 'distress_trends' && (
        <section aria-labelledby="trends-section-heading" className="glass-panel p-6 sm:p-8 space-y-4">
          <h2 id="trends-section-heading" className="text-xl font-bold text-white">
            Longitudinal Distress Trends Across Caseload
          </h2>
          <p className="text-xs sm:text-sm text-[#D6D6D6]">
            Comparing individual trajectories against 30-day intake baselines.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {survivors.map(s => (
              <LuxuryCard key={s.anonymizedId} className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-white">{s.anonymizedId}</span>
                  {renderTrendBadge(s)}
                </div>
                <div className="text-2xl font-bold text-white">
                  {s.latestDistressIndicator} <span className="text-xs text-[#D6D6D6] font-normal">/ 100</span>
                </div>
                <p className="text-[11px] text-[#D6D6D6]">
                  7-Day Avg: {s.trends.sevenDayAverage} · Volatility: {s.trends.volatilityIndex}
                </p>
                <LuxuryButton
                  variant="secondary"
                  size="sm"
                  onClick={() => openSurvivorModal(s, 'Trends')}
                  className="w-full mt-2"
                >
                  View Longitudinal Curve
                </LuxuryButton>
              </LuxuryCard>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 4: ALERTS
          ========================================================================= */}
      {activeSection === 'alerts' && (
        <section aria-labelledby="alerts-section-heading" className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 id="alerts-section-heading" className="text-xl font-bold text-white">
              Active Operational Alerts
            </h2>
            <span className="text-xs text-[#D6D6D6] font-medium">Non-clinical alerts flagged for caseworker review</span>
          </div>

          <div className="space-y-3">
            {survivors.filter(s => s.activeAlertCount > 0).map(s => (
              <LuxuryCard key={s.anonymizedId} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-[#FD1053]/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-[#FD1053] text-white">
                      {s.riskCategory} Alert
                    </span>
                    <span className="text-xs font-mono font-bold text-[#D6D6D6]">{s.anonymizedId}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    {s.overview.safeguardingSummary}
                  </h3>
                  <span className="text-[11px] text-[#D6D6D6] block">
                    Assigned: {s.assignedCounsellor} · Status: {s.followUpStatus}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <LuxuryButton
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedSurvivor(s);
                      setActiveActionModal('resolve_alert');
                    }}
                  >
                    Resolve Alert
                  </LuxuryButton>
                  <LuxuryButton
                    variant="primary"
                    size="sm"
                    onClick={() => openSurvivorModal(s, 'AI Signals')}
                  >
                    Review Signals
                  </LuxuryButton>
                </div>
              </LuxuryCard>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 5: ASSIGNED SURVIVORS
          ========================================================================= */}
      {activeSection === 'assigned_survivors' && (
        <section aria-labelledby="assigned-survivors-heading" className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 id="assigned-survivors-heading" className="text-xl font-bold text-white">
              Assigned Survivor Caseload
            </h2>
            <span className="text-xs text-[#D6D6D6] font-medium">Licensed Casework Allocation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {survivors.map(s => (
              <LuxuryCard key={s.anonymizedId} className="p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-[#FD1053]">
                    {s.anonymizedId} ({s.caseId})
                  </span>
                  <span className="text-xs font-semibold text-[#D6D6D6]">{s.districtCode} · {s.state}</span>
                </div>
                <p className="text-xs text-[#D6D6D6] font-medium leading-relaxed">
                  {s.overview.safeguardingSummary}
                </p>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-white/10">
                  <span className="text-[#D6D6D6]">Stage: <strong className="text-white">{s.caseStage}</strong></span>
                  <button
                    onClick={() => openSurvivorModal(s, 'Overview')}
                    className="text-xs font-bold text-[#FD1053] hover:underline cursor-pointer"
                  >
                    Open Survivor File →
                  </button>
                </div>
              </LuxuryCard>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 6: CASE CONTEXT
          ========================================================================= */}
      {activeSection === 'case_context' && (
        <section aria-labelledby="case-context-heading" className="glass-panel p-6 sm:p-8 space-y-4">
          <h2 id="case-context-heading" className="text-xl font-bold text-white">
            Case Context &amp; Judicial Milestone Registry
          </h2>
          <p className="text-xs sm:text-sm text-[#D6D6D6]">
            Contextual tracking of judicial events (hearings, bail objections, compensation dispersal).
          </p>

          <div className="space-y-3 pt-2">
            {survivors[0].caseTimeline.map(item => (
              <div key={item.id} className="p-4 rounded-2xl bg-[#474747]/30 border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{item.milestone}</span>
                  <span className="text-[#D6D6D6]">{item.notes}</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#D6D6D6]">{item.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 7: NOTES
          ========================================================================= */}
      {activeSection === 'notes' && (
        <section aria-labelledby="notes-section-heading" className="glass-panel p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 id="notes-section-heading" className="text-xl font-bold text-white">
              Clinical &amp; Casework Notes Feed
            </h2>
            <LuxuryButton
              size="sm"
              onClick={() => {
                setSelectedSurvivor(survivors[0]);
                setActiveActionModal('add_note');
              }}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              New Clinical Note
            </LuxuryButton>
          </div>

          <div className="space-y-3">
            {survivors.flatMap(s => s.clinicalNotes).map(n => (
              <div key={n.id} className="p-4 rounded-2xl bg-[#474747]/30 border border-white/10 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#FD1053]">[{n.noteType}] · {n.author}</span>
                  <span className="text-[10px] text-[#D6D6D6] font-mono">{new Date(n.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-[#D6D6D6] leading-relaxed font-medium">{n.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          SECTION 8: FOLLOW-UP SCHEDULE
          ========================================================================= */}
      {activeSection === 'followup_schedule' && (
        <section aria-labelledby="schedule-section-heading" className="glass-panel p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 id="schedule-section-heading" className="text-xl font-bold text-white">
              Comprehensive Follow-up Schedule
            </h2>
            <LuxuryButton
              size="sm"
              onClick={() => {
                setSelectedSurvivor(survivors[0]);
                setActiveActionModal('schedule');
              }}
              leftIcon={<Calendar className="w-3.5 h-3.5" />}
            >
              Schedule New Follow-up
            </LuxuryButton>
          </div>

          <div className="space-y-3">
            {schedule.map(item => (
              <div key={item.id} className="p-4 rounded-2xl bg-[#474747]/30 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-white block font-mono">{item.anonymizedId}</span>
                  <p className="text-[#D6D6D6]">{item.focusMilestone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-white">{item.scheduledTime}</span>
                  <span className="px-2.5 py-1 rounded-xl bg-[#FD1053]/15 text-[#FD1053] font-bold border border-[#FD1053]/30">
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
          ========================================================================= */}
      {selectedSurvivor && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
        >
          <div className="w-full max-w-4xl max-h-[90vh] rounded-3xl bg-[#333333] border border-white/10 shadow-2xl flex flex-col overflow-hidden text-white">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#333333]">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#FD1053] shadow-[0_0_8px_#FD1053]" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white font-mono">
                      {selectedSurvivor.anonymizedId}
                    </h2>
                    <span className="text-xs text-[#D6D6D6] font-sans">
                      ({selectedSurvivor.caseId} · {selectedSurvivor.districtCode})
                    </span>
                  </div>
                  <span className="text-xs text-[#D6D6D6]">
                    Assigned: <strong className="text-white">{selectedSurvivor.assignedCounsellor}</strong> · Status: {selectedSurvivor.followUpStatus}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSurvivor(null)}
                  className="p-2 rounded-xl text-[#D6D6D6] hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 8 Detail Tabs Header */}
            <div className="px-6 pt-3 border-b border-white/10 bg-[#333333] overflow-x-auto">
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
                        ? 'bg-[#FD1053] text-white shadow-xs'
                        : 'bg-[#474747]/50 text-[#D6D6D6] hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-4">
              {/* Tab 1: Overview */}
              {activeDetailTab === 'Overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-[#474747]/40 border border-white/10">
                      <span className="text-[10px] uppercase font-bold text-[#D6D6D6] block">Intake Date</span>
                      <span className="text-sm font-bold text-white">{selectedSurvivor.overview.intakeDate}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#474747]/40 border border-white/10">
                      <span className="text-[10px] uppercase font-bold text-[#D6D6D6] block">Language &amp; Channel</span>
                      <span className="text-sm font-bold text-white">{selectedSurvivor.overview.preferredLanguage} ({selectedSurvivor.overview.preferredChannel})</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#474747]/40 border border-white/10">
                      <span className="text-[10px] uppercase font-bold text-[#D6D6D6] block">Trusted Kin Contact</span>
                      <span className="text-sm font-bold text-white">{selectedSurvivor.overview.trustedContactDesignation}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#474747]/40 border border-white/10 space-y-1">
                    <span className="text-xs font-bold text-white block">Safeguarding Summary:</span>
                    <p className="text-[#D6D6D6] leading-relaxed font-medium">{selectedSurvivor.overview.safeguardingSummary}</p>
                  </div>
                </div>
              )}

              {/* Tab 2: Check-ins */}
              {activeDetailTab === 'Check-ins' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-white block">Historical Check-in Log:</span>
                  {selectedSurvivor.checkIns.map(chk => (
                    <div key={chk.id} className="p-4 rounded-2xl bg-[#474747]/40 border border-white/10 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#FD1053]">{chk.channel} · Mood: {chk.mood}</span>
                        <span className="text-[10px] text-[#D6D6D6] font-mono">{new Date(chk.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-[#D6D6D6]">{chk.textResponse}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Trends */}
              {activeDetailTab === 'Trends' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-[#474747]/40 border border-white/10">
                      <span className="text-[10px] text-[#D6D6D6] block">Baseline Score</span>
                      <span className="text-xl font-bold text-white">{selectedSurvivor.baselineScore} pts</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#474747]/40 border border-white/10">
                      <span className="text-[10px] text-[#D6D6D6] block">Latest Distress</span>
                      <span className="text-xl font-bold text-[#FD1053]">{selectedSurvivor.latestDistressIndicator} pts</span>
                    </div>
                  </div>
                  <p className="text-[#D6D6D6] italic">Trajectory monitored under trauma-informed baseline variance protocol.</p>
                </div>
              )}

              {/* Tab 4: AI Signals */}
              {activeDetailTab === 'AI Signals' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#FD1053]/10 border border-[#FD1053]/30">
                    <span className="text-xs font-bold text-[#FD1053] block uppercase tracking-wider">
                      Detected Linguistic &amp; Behavioral Distress Signals
                    </span>
                    <p className="text-xs text-[#D6D6D6] mt-1">
                      Automated non-clinical early warning markers extracted from multi-channel check-ins.
                    </p>
                  </div>
                  <div className="space-y-2">
                    {selectedSurvivor.aiSignals.contributingSignals.map((sig, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-[#474747]/40 border border-white/10 flex items-center justify-between">
                        <span className="font-semibold text-white">{sig}</span>
                        <span className="text-[10px] font-bold text-[#FD1053]">Active Marker</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Case Timeline */}
              {activeDetailTab === 'Case Timeline' && (
                <div className="space-y-3">
                  {selectedSurvivor.caseTimeline.map(item => (
                    <div key={item.id} className="p-3.5 rounded-xl bg-[#474747]/40 border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">{item.milestone}</span>
                        <span className="text-[11px] text-[#D6D6D6]">{item.notes}</span>
                      </div>
                      <span className="font-mono text-xs text-[#D6D6D6]">{item.date}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 6: Support History */}
              {activeDetailTab === 'Support History' && (
                <div className="space-y-3">
                  {selectedSurvivor.supportHistory.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#474747]/40 border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">{item.sessionType}</span>
                        <span className="text-[11px] text-[#D6D6D6]">{item.outcome}</span>
                      </div>
                      <span className="text-xs text-[#D6D6D6]">{item.counsellor} · {item.date}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 7: Notes */}
              {activeDetailTab === 'Notes' && (
                <div className="space-y-3">
                  {selectedSurvivor.clinicalNotes.map(n => (
                    <div key={n.id} className="p-3.5 rounded-xl bg-[#474747]/40 border border-white/10 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#FD1053]">[{n.noteType}] · {n.author}</span>
                        <span className="text-[10px] text-[#D6D6D6] font-mono">{new Date(n.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[#D6D6D6]">{n.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 8: Privacy */}
              {activeDetailTab === 'Privacy' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#474747]/40 border border-white/10 space-y-2">
                    <span className="font-bold text-white block">DPDPA 2023 Consent Envelope:</span>
                    <div className="space-y-1 text-[#D6D6D6]">
                      <div className="flex justify-between">
                        <span>Check-In Reminders:</span>
                        <span className="text-emerald-400 font-bold">{selectedSurvivor.privacy.automatedRemindersAllowed ? 'Permitted' : 'Denied'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Voice Cadence Screening:</span>
                        <span className="text-emerald-400 font-bold">{selectedSurvivor.privacy.voiceAnalysisAllowed ? 'Permitted' : 'Denied'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Casework Access:</span>
                        <span className="text-emerald-400 font-bold">{selectedSurvivor.privacy.caseworkerAccessGranted ? 'Granted' : 'Not granted'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Footer in Drawer */}
            <div className="p-4 border-t border-white/10 bg-[#333333] flex flex-wrap gap-2 justify-end">
              <LuxuryButton
                variant="secondary"
                size="sm"
                onClick={() => setActiveActionModal('contact')}
                leftIcon={<PhoneCall className="w-3.5 h-3.5" />}
              >
                Log Contact
              </LuxuryButton>
              <LuxuryButton
                variant="secondary"
                size="sm"
                onClick={() => setActiveActionModal('schedule')}
                leftIcon={<Calendar className="w-3.5 h-3.5" />}
              >
                Schedule Follow-up
              </LuxuryButton>
              <LuxuryButton
                variant="primary"
                size="sm"
                onClick={() => setActiveActionModal('add_note')}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Clinical Note
              </LuxuryButton>
              <LuxuryButton
                variant="secondary"
                size="sm"
                onClick={() => setActiveActionModal('assign')}
              >
                Reassign
              </LuxuryButton>
              <LuxuryButton
                variant="danger"
                size="sm"
                onClick={() => setActiveActionModal('escalate')}
              >
                Escalate
              </LuxuryButton>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ACTION MODALS
          ========================================================================= */}
      {activeActionModal && selectedSurvivor && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
        >
          <div className="w-full max-w-md rounded-3xl bg-[#333333] border border-white/10 p-6 sm:p-8 space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white capitalize">
                {activeActionModal.replace('_', ' ')}: {selectedSurvivor.anonymizedId}
              </h3>
              <button
                onClick={() => setActiveActionModal(null)}
                className="p-1 rounded-xl text-[#D6D6D6] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#D6D6D6] block">
                Clinical Details &amp; Notes
              </label>
              <GlassTextarea
                value={actionInputText}
                onChange={e => setActionInputText(e.target.value)}
                placeholder="Enter details..."
                rows={3}
              />

              {activeActionModal === 'schedule' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#D6D6D6] block">Scheduled Time</label>
                  <GlassInput
                    value={actionSecondaryInput}
                    onChange={e => setActionSecondaryInput(e.target.value)}
                    placeholder="e.g. Tomorrow, 11:00 AM IST"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <LuxuryButton
                variant="ghost"
                size="sm"
                onClick={() => setActiveActionModal(null)}
              >
                Cancel
              </LuxuryButton>
              <LuxuryButton
                variant="primary"
                size="sm"
                onClick={handleExecuteAction}
              >
                Confirm Action
              </LuxuryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
