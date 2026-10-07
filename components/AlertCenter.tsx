'use client';

import React, { useState, useMemo } from 'react';
import {
  alertManagementSystem,
  RealTimeAlert,
  AlertSeverity,
  AlertStatus,
  SEVERITY_CONFIGS,
  WORKFLOW_STAGES,
  WorkflowStage,
} from '@/lib/alert-management-system';
import {
  GlassPanel,
  LuxuryCard,
  LuxuryButton,
  GlassInput,
  GlassTextarea,
  PremiumBadge,
} from '@/components/design-system';
import {
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock,
  UserCheck,
  ArrowUpRight,
  Filter,
  Search,
  MessageSquare,
  FileText,
  User,
  History,
  CheckCheck,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Shield,
  HelpCircle,
  Send,
  X,
  PhoneCall,
  Calendar,
} from 'lucide-react';

interface AlertCenterProps {
  onSelectCase?: (caseId: string) => void;
}

export function AlertCenter({ onSelectCase }: AlertCenterProps) {
  const [alerts, setAlerts] = useState<RealTimeAlert[]>(() => alertManagementSystem.getAlerts());
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected alert for deep-dive drawer or action modal
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [activeModalAction, setActiveModalAction] = useState<
    'acknowledge' | 'assign' | 'escalate' | 'resolve' | 'add_note' | null
  >(null);

  // Form inputs for modals
  const [actionNote, setActionNote] = useState('');
  const [assigneeName, setAssigneeName] = useState('Dr. Priya Nair (Clinical Lead)');
  const [escalateRole, setEscalateRole] = useState('District Social Welfare Officer');

  // Refresh alert list from system
  const refreshAlerts = () => {
    setAlerts(alertManagementSystem.getAlerts());
  };

  const selectedAlert = useMemo(() => {
    return alerts.find(a => a.alertId === selectedAlertId) || alerts[0];
  }, [alerts, selectedAlertId]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      const matchSeverity = severityFilter === 'all' || a.severity === severityFilter;
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        a.alertId.toLowerCase().includes(q) ||
        a.survivorReference.toLowerCase().includes(q) ||
        a.trigger.toLowerCase().includes(q) ||
        a.assignedCounsellor.toLowerCase().includes(q) ||
        a.recommendedAction.toLowerCase().includes(q);

      return matchSeverity && matchStatus && matchSearch;
    });
  }, [alerts, severityFilter, statusFilter, searchQuery]);

  // Action handlers
  const handleAcknowledge = (alertId: string) => {
    alertManagementSystem.acknowledgeAlert(alertId, 'Dr. Priya Nair (Counsellor)', actionNote || undefined);
    setActionNote('');
    setActiveModalAction(null);
    refreshAlerts();
  };

  const handleAssign = (alertId: string) => {
    alertManagementSystem.assignAlert(alertId, assigneeName, 'Dr. Priya Nair (Supervisor)', actionNote || undefined);
    setActionNote('');
    setActiveModalAction(null);
    refreshAlerts();
  };

  const handleEscalate = (alertId: string) => {
    if (!actionNote.trim()) return;
    alertManagementSystem.escalateAlert(alertId, escalateRole, 'Dr. Priya Nair (Counsellor)', actionNote);
    setActionNote('');
    setActiveModalAction(null);
    refreshAlerts();
  };

  const handleResolve = (alertId: string) => {
    if (!actionNote.trim()) return;
    alertManagementSystem.resolveAlert(alertId, 'Dr. Priya Nair (Counsellor)', actionNote);
    setActionNote('');
    setActiveModalAction(null);
    refreshAlerts();
  };

  const handleAddNote = (alertId: string) => {
    if (!actionNote.trim()) return;
    alertManagementSystem.addNote(alertId, 'Dr. Priya Nair (Counsellor)', actionNote);
    setActionNote('');
    setActiveModalAction(null);
    refreshAlerts();
  };

  const renderSeverityBadge = (severity: AlertSeverity) => {
    if (severity === 'Critical review') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#FD1053] px-2.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(253,16,83,0.35)]">
          <ShieldAlert className="w-3.5 h-3.5" />
          Critical Review
        </span>
      );
    }
    if (severity === 'Urgent review') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FD1053] bg-[#FD1053]/15 px-2.5 py-0.5 rounded-full border border-[#FD1053]/35">
          <AlertTriangle className="w-3.5 h-3.5" />
          Urgent Review
        </span>
      );
    }
    if (severity === 'Attention required') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
          <AlertCircle className="w-3.5 h-3.5" />
          Attention Required
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D6D6D6] bg-[#474747]/60 px-2.5 py-0.5 rounded-full border border-white/10">
        <Info className="w-3.5 h-3.5" />
        Information
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* =========================================================================
          HEADER & GOVERNANCE MANDATE
          ========================================================================= */}
      <section
        aria-labelledby="alert-center-heading"
        className="rounded-3xl bg-[#333333]/90 dark:bg-[#1E1E1E]/95 border border-[#474747]/30 dark:border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-xl text-white space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FD1053]/15 text-[#FD1053] border border-[#FD1053]/30">
                <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
                Phase 8: Real-Time Alerts
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#474747]/60 text-emerald-400 border border-emerald-500/30">
                <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
                Human Review Mandatory
              </span>
            </div>

            <h1
              id="alert-center-heading"
              className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
            >
              Real-Time Alert Management
            </h1>
            <p className="text-sm text-[#D6D6D6] font-medium mt-1 max-w-3xl leading-relaxed">
              Continuous operational triage for caseworkers. Designed with a calm aesthetic that prioritizes human safety and deliberate review without inducing panic.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-3.5 py-2.5 rounded-2xl bg-[#474747]/60 text-white border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FD1053] animate-pulse" />
              {alerts.filter(a => a.status !== 'Resolved').length} Active Alerts
            </span>
          </div>
        </div>

        {/* Mandatory Governance Notice */}
        <div
          role="note"
          aria-label="Human governance mandate"
          className="p-4 rounded-2xl bg-[#474747]/30 border border-[#FD1053]/30 flex items-start gap-3"
        >
          <Info className="w-5 h-5 text-[#FD1053] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1 text-xs">
            <p className="font-bold text-[#FD1053] uppercase tracking-wide">
              GOVERNANCE MANDATE: AI CANNOT INDEPENDENTLY MAKE IRREVERSIBLE DECISIONS
            </p>
            <p className="text-[#D6D6D6] leading-relaxed font-medium">
              Every alert requires human review before consequential or irreversible caseworker intervention. AI models assist in early recognition, but all outreach, case context escalations, and support plans are authorized by licensed counsellors and district officers under the SC/ST PoA Act.
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#D6D6D6]">
              <Filter className="w-3.5 h-3.5 text-[#FD1053]" />
              <span>Type:</span>
            </div>
            {(['all', 'Information', 'Attention required', 'Urgent review', 'Critical review'] as (
              | 'all'
              | AlertSeverity
            )[]).map(sev => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[38px] ${
                  severityFilter === sev
                    ? 'bg-[#FD1053] text-white shadow-md shadow-[#FD1053]/25'
                    : 'bg-[#474747]/40 text-[#D6D6D6] hover:text-white hover:bg-[#474747]'
                }`}
              >
                {sev === 'all' ? 'All Types' : sev}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-[#D6D6D6] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, survivor, trigger..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#474747]/40 border border-white/10 text-xs font-medium text-white placeholder:text-[#D6D6D6]/60 focus:outline-hidden focus:border-[#FD1053]/40 min-h-[38px]"
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          ALERTS FEED & DETAIL WORKFLOW SPLIT VIEW
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Alert Cards List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D6D6D6]">
              Operational Alert Feed ({filteredAlerts.length})
            </span>
          </div>

          <div className="space-y-3">
            {filteredAlerts.map(alert => {
              const isSelected = selectedAlert?.alertId === alert.alertId;
              return (
                <LuxuryCard
                  key={alert.alertId}
                  onClick={() => setSelectedAlertId(alert.alertId)}
                  className={`p-4 space-y-2.5 cursor-pointer transition ${
                    isSelected
                      ? 'border-[#FD1053] shadow-lg shadow-[#FD1053]/20 bg-[#333333]'
                      : 'hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {renderSeverityBadge(alert.severity)}
                      <span className="font-mono text-xs font-bold text-white">
                        {alert.alertId}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#D6D6D6] font-mono">
                      {new Date(alert.createdTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    {alert.trigger}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-[#D6D6D6] pt-1 border-t border-white/5">
                    <span>Survivor: <strong className="text-white">{alert.survivorReference}</strong></span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        alert.status === 'Resolved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : alert.status === 'Acknowledged'
                          ? 'bg-sky-500/20 text-sky-300'
                          : 'bg-[#FD1053]/20 text-[#FD1053]'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>
                </LuxuryCard>
              );
            })}
          </div>
        </div>

        {/* Right Column: Alert Detail & Resolution Workflow (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedAlert ? (
            <GlassPanel
              title={`Alert Triage: ${selectedAlert.alertId}`}
              subtitle={`Trigger: ${selectedAlert.trigger}`}
              badge={renderSeverityBadge(selectedAlert.severity)}
            >
              <div className="space-y-6 pt-2">
                {/* 5-Stage Visual Workflow */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D6D6D6] block">
                    Workflow Resolution Stages
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {WORKFLOW_STAGES.map((stg, idx) => {
                      const isCompleted =
                        (selectedAlert.status === 'Acknowledged' && idx <= 1) ||
                        (selectedAlert.status === 'Under Review' && idx <= 2) ||
                        (selectedAlert.status === 'Action Taken' && idx <= 3) ||
                        (selectedAlert.status === 'Escalated' && idx <= 4) ||
                        selectedAlert.status === 'Resolved';
                      const isCurrent =
                        (selectedAlert.status === 'New' && idx === 0) ||
                        (selectedAlert.status === 'Acknowledged' && idx === 1) ||
                        (selectedAlert.status === 'Under Review' && idx === 2) ||
                        (selectedAlert.status === 'Action Taken' && idx === 3) ||
                        (selectedAlert.status === 'Escalated' && idx === 4) ||
                        (selectedAlert.status === 'Resolved' && idx === 5);

                      return (
                        <div
                          key={stg}
                          className={`p-2 rounded-xl text-center border text-[10px] font-bold transition ${
                            isCurrent
                              ? 'bg-[#FD1053] text-white border-[#FD1053] shadow-xs'
                              : isCompleted
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-[#474747]/30 text-[#D6D6D6] border-white/5'
                          }`}
                        >
                          <span className="block truncate">{stg}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Key Context Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LuxuryCard className="p-4 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#D6D6D6]">Survivor Reference</span>
                    <p className="text-sm font-bold text-white">{selectedAlert.survivorReference}</p>
                    <span className="text-[11px] text-[#D6D6D6]">Case: {selectedAlert.caseId} · {selectedAlert.district}</span>
                  </LuxuryCard>

                  <LuxuryCard className="p-4 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#D6D6D6]">Assigned Counsellor</span>
                    <p className="text-sm font-bold text-white">{selectedAlert.assignedCounsellor}</p>
                    <span className="text-[11px] text-[#D6D6D6]">Gateway: Primary Multi-Channel</span>
                  </LuxuryCard>
                </div>

                {/* Recommended Operational Action */}
                <div className="p-4 rounded-2xl bg-[#474747]/40 border border-white/10 space-y-1">
                  <span className="text-xs font-bold text-[#FD1053] block uppercase tracking-wider">
                    Recommended Clinical / Welfare Follow-up
                  </span>
                  <p className="text-xs text-white leading-relaxed font-medium">
                    {selectedAlert.recommendedAction}
                  </p>
                </div>

                {/* Resolution History / Casework Notes */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D6D6D6] block">
                    Casework Audit Trail
                  </span>
                  <div className="space-y-2">
                    {selectedAlert.auditHistory.map((entry, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#474747]/30 border border-white/5 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-[#D6D6D6]">
                          <span className="font-bold text-white">{entry.actor} ({entry.action})</span>
                          <span className="font-mono">{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <span className="text-white font-medium block">{entry.note}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button Strip */}
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/10">
                  <LuxuryButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveModalAction('acknowledge')}
                    disabled={selectedAlert.status === 'Acknowledged' || selectedAlert.status === 'Resolved'}
                  >
                    Acknowledge Alert
                  </LuxuryButton>

                  <LuxuryButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveModalAction('assign')}
                    disabled={selectedAlert.status === 'Resolved'}
                  >
                    Reassign Lead
                  </LuxuryButton>

                  <LuxuryButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveModalAction('escalate')}
                    disabled={selectedAlert.status === 'Resolved'}
                  >
                    Escalate to Welfare
                  </LuxuryButton>

                  <LuxuryButton
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveModalAction('resolve')}
                    disabled={selectedAlert.status === 'Resolved'}
                  >
                    {selectedAlert.status === 'Resolved' ? 'Alert Resolved' : 'Mark Resolved'}
                  </LuxuryButton>

                  <LuxuryButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveModalAction('add_note')}
                  >
                    Add Clinical Note
                  </LuxuryButton>
                </div>
              </div>
            </GlassPanel>
          ) : (
            <div className="p-8 text-center glass-panel text-[#D6D6D6]">
              Select an alert from the feed to view clinical triage details.
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          ACTION MODALS
          ========================================================================= */}
      {activeModalAction && selectedAlert && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
        >
          <div className="w-full max-w-md rounded-3xl bg-[#333333] border border-white/10 p-6 sm:p-8 space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white capitalize">
                {activeModalAction.replace('_', ' ')}: {selectedAlert.alertId}
              </h3>
              <button
                onClick={() => setActiveModalAction(null)}
                className="p-1 rounded-xl text-[#D6D6D6] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#D6D6D6] block">
                Clinical Justification &amp; Action Notes
              </label>
              <GlassTextarea
                value={actionNote}
                onChange={e => setActionNote(e.target.value)}
                placeholder="Document your clinical rationale (required for audit trail)..."
                rows={3}
              />

              {activeModalAction === 'assign' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#D6D6D6] block">Assignee Name</label>
                  <GlassInput
                    value={assigneeName}
                    onChange={e => setAssigneeName(e.target.value)}
                    placeholder="Enter counsellor or supervisor name"
                  />
                </div>
              )}

              {activeModalAction === 'escalate' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#D6D6D6] block">Escalation Authority</label>
                  <GlassInput
                    value={escalateRole}
                    onChange={e => setEscalateRole(e.target.value)}
                    placeholder="e.g. District Social Welfare Officer"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <LuxuryButton
                variant="ghost"
                size="sm"
                onClick={() => setActiveModalAction(null)}
              >
                Cancel
              </LuxuryButton>
              <LuxuryButton
                variant="primary"
                size="sm"
                onClick={() => {
                  if (activeModalAction === 'acknowledge') handleAcknowledge(selectedAlert.alertId);
                  else if (activeModalAction === 'assign') handleAssign(selectedAlert.alertId);
                  else if (activeModalAction === 'escalate') handleEscalate(selectedAlert.alertId);
                  else if (activeModalAction === 'resolve') handleResolve(selectedAlert.alertId);
                  else if (activeModalAction === 'add_note') handleAddNote(selectedAlert.alertId);
                }}
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
