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

  const renderSeverityIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Info':
        return <Info className={className} aria-hidden="true" />;
      case 'AlertCircle':
        return <AlertCircle className={className} aria-hidden="true" />;
      case 'AlertTriangle':
        return <AlertTriangle className={className} aria-hidden="true" />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} aria-hidden="true" />;
      default:
        return <Info className={className} aria-hidden="true" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* =========================================================================
          HEADER & GOVERNANCE MANDATE
          "AI cannot independently make irreversible decisions."
          "Require human review for consequential intervention."
          "Do not make the interface unnecessarily alarming."
          ========================================================================= */}
      <section
        aria-labelledby="alert-center-heading"
        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
                Phase 8: Real-Time Alerts
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
                Human Review Mandatory
              </span>
            </div>

            <h1
              id="alert-center-heading"
              className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight"
            >
              Real-Time Alert Management
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium mt-1 max-w-3xl leading-relaxed">
              Continuous operational triage for caseworkers. Designed with a calm aesthetic that prioritizes human safety and deliberate review without inducing panic.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {alerts.filter(a => a.status !== 'Resolved').length} Active Alerts
            </span>
          </div>
        </div>

        {/* Mandatory Governance Notice */}
        <div
          role="note"
          aria-label="Human governance mandate"
          className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-start gap-3"
        >
          <Info className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1 text-xs">
            <p className="font-black text-amber-900 dark:text-amber-200 uppercase tracking-wide">
              GOVERNANCE MANDATE: AI CANNOT INDEPENDENTLY MAKE IRREVERSIBLE DECISIONS
            </p>
            <p className="text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
              Every alert requires human review before consequential or irreversible caseworker intervention. AI models assist in early recognition, but all outreach, case context escalations, and support plans are authorized by licensed counsellors and district officers under the SC/ST PoA Act.
            </p>
          </div>
        </div>

        {/* =====================================================================
            FILTER TOOLBAR: Alert Types & Statuses
            ===================================================================== */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Severity Filter */}
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500">Type:</span>
            </div>
            {(['all', 'Information', 'Attention required', 'Urgent review', 'Critical review'] as (
              | 'all'
              | AlertSeverity
            )[]).map(sev => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  severityFilter === sev
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {sev === 'all' ? 'All Types' : sev}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, survivor, trigger..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Alert Queue ({filteredAlerts.length})
            </span>
            <span className="text-xs text-slate-400 font-medium">Sorted by recency</span>
          </div>

          <div className="space-y-3.5 max-h-[820px] overflow-y-auto pr-1">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                No alerts match the selected criteria.
              </div>
            ) : (
              filteredAlerts.map(alert => {
                const config = SEVERITY_CONFIGS[alert.severity];
                const isSelected = selectedAlert.alertId === alert.alertId;
                return (
                  <div
                    key={alert.alertId}
                    onClick={() => setSelectedAlertId(alert.alertId)}
                    className={`p-5 rounded-3xl border-2 transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'border-indigo-600 dark:border-indigo-400 shadow-md bg-indigo-50/20 dark:bg-indigo-950/20'
                        : `${config.borderClass} hover:border-slate-400 dark:hover:border-slate-600`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${config.badgeClass}`}
                        >
                          {renderSeverityIcon(config.iconName, 'w-3 h-3')}
                          <span>{alert.severity}</span>
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500">
                          {alert.alertId}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          alert.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : alert.status === 'Escalated'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : alert.status === 'Acknowledged'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {alert.status}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-sm font-black text-slate-900 dark:text-white">
                        {alert.survivorReference}
                      </h2>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 font-medium">
                        {alert.trigger}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[140px]">{alert.assignedCounsellor}</span>
                      </span>
                      <span>Action: <strong className="text-indigo-600 dark:text-indigo-400">{alert.recommendedAction}</strong></span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Alert Inspection, Workflow & Action Center (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedAlert && (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Alert Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border ${
                        SEVERITY_CONFIGS[selectedAlert.severity].badgeClass
                      }`}
                    >
                      {renderSeverityIcon(SEVERITY_CONFIGS[selectedAlert.severity].iconName, 'w-3.5 h-3.5')}
                      <span>{selectedAlert.severity}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {selectedAlert.alertId}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    {selectedAlert.survivorReference}
                  </h2>
                  <span className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Created: {new Date(selectedAlert.createdTime).toLocaleString()}</span>
                  </span>
                </div>

                {onSelectCase && (
                  <button
                    onClick={() => onSelectCase(selectedAlert.caseId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition cursor-pointer self-start"
                  >
                    <span>View Case File</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* =================================================================
                  WORKFLOW STAGE PROGRESSION
                  Signal detected → Alert generated → Human review → Counsellor action → Follow-up → Resolution
                  ================================================================= */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Alert Lifecycle Workflow Stage:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center">
                  {WORKFLOW_STAGES.map((stage, idx) => {
                    const currentIdx = WORKFLOW_STAGES.indexOf(selectedAlert.currentWorkflowStage);
                    const isPassed = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;
                    return (
                      <div
                        key={stage}
                        className={`p-2 rounded-xl text-[10px] font-bold border transition ${
                          isCurrent
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : isPassed
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-850 dark:text-slate-500 dark:border-slate-800'
                        }`}
                      >
                        <span className="block">{stage}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trigger & Recommended Action Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Trigger Event
                  </span>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
                    {selectedAlert.trigger}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block">
                    Recommended Action
                  </span>
                  <p className="text-xs font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-wide">
                    {selectedAlert.recommendedAction}
                  </p>
                  <span className="text-[10px] text-slate-500 block">Requires human authorized execution</span>
                </div>
              </div>

              {/* Supporting Signals List */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Supporting Multi-Modal Signals:
                </span>
                <ul className="space-y-1.5" aria-label="Supporting signals list">
                  {selectedAlert.supportingSignals.map((signal, sIdx) => (
                    <li
                      key={sIdx}
                      className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Assigned Counsellor Info */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Assigned: <strong>{selectedAlert.assignedCounsellor}</strong>
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">Status: {selectedAlert.status}</span>
              </div>

              {/* =================================================================
                  5 REQUIRED ACTIONS TOOLBAR
                  - Acknowledge
                  - Assign
                  - Escalate
                  - Resolve
                  - Add Note
                  ================================================================= */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Authorized Caseworker Actions (Audited):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <button
                    onClick={() => setActiveModalAction('acknowledge')}
                    className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:hover:bg-blue-900 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800 transition cursor-pointer min-h-[40px]"
                  >
                    Acknowledge
                  </button>
                  <button
                    onClick={() => setActiveModalAction('assign')}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition cursor-pointer min-h-[40px]"
                  >
                    Assign
                  </button>
                  <button
                    onClick={() => setActiveModalAction('escalate')}
                    className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:hover:bg-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800 transition cursor-pointer min-h-[40px]"
                  >
                    Escalate
                  </button>
                  <button
                    onClick={() => setActiveModalAction('resolve')}
                    className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 transition cursor-pointer min-h-[40px]"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => setActiveModalAction('add_note')}
                    className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800 transition cursor-pointer min-h-[40px]"
                  >
                    Add Note
                  </button>
                </div>
              </div>

              {/* =================================================================
                  IMMUTABLE AUDIT TRAIL
                  "Audit every action."
                  ================================================================= */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    <History className="w-4 h-4 text-indigo-500" />
                    <span>Audit Provenance Log ({selectedAlert.auditHistory.length})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">IMMUTABLE LOG</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedAlert.auditHistory.map(entry => (
                    <div
                      key={entry.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          [{entry.action}] · {entry.actor}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-snug">
                        {entry.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE ACTION MODAL (Acknowledge / Assign / Escalate / Resolve / Note)
          ========================================================================= */}
      {activeModalAction && selectedAlert && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-black text-slate-900 dark:text-white capitalize">
                {activeModalAction.replace('_', ' ')} Alert: {selectedAlert.alertId}
              </h2>
              <button
                onClick={() => setActiveModalAction(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                Action applies to survivor <strong>{selectedAlert.survivorReference}</strong>. Every modification is logged to the judicial audit trail.
              </p>

              {/* Action-Specific Inputs */}
              {activeModalAction === 'assign' && (
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    Assignee Counsellor:
                  </label>
                  <select
                    value={assigneeName}
                    onChange={e => setAssigneeName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                  >
                    <option value="Dr. Priya Nair (Clinical Lead)">Dr. Priya Nair (Clinical Lead)</option>
                    <option value="Dr. Rajesh Verma (District Officer)">Dr. Rajesh Verma (District Officer)</option>
                    <option value="S. Meenakshi (Senior Counsellor)">S. Meenakshi (Senior Counsellor)</option>
                    <option value="Amitabh Sen (Field Caseworker)">Amitabh Sen (Field Caseworker)</option>
                  </select>
                </div>
              )}

              {activeModalAction === 'escalate' && (
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    Escalation Authority Target:
                  </label>
                  <select
                    value={escalateRole}
                    onChange={e => setEscalateRole(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                  >
                    <option value="District Social Welfare Officer">District Social Welfare Officer</option>
                    <option value="Special Public Prosecutor / Legal Aid Lead">Special Public Prosecutor / Legal Aid Lead</option>
                    <option value="State Nodal Officer (SC/ST Protection)">State Nodal Officer (SC/ST Protection)</option>
                    <option value="24x7 Tele-MANAS Crisis Coordinator">24x7 Tele-MANAS Crisis Coordinator</option>
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  {activeModalAction === 'resolve'
                    ? 'Resolution Summary (Mandatory):'
                    : 'Action Note / Justification (Audited):'}
                </label>
                <textarea
                  rows={3}
                  value={actionNote}
                  onChange={e => setActionNote(e.target.value)}
                  placeholder={
                    activeModalAction === 'resolve'
                      ? 'Summarize contact made, support resources shared, and survivor safety confirmation...'
                      : 'Enter caseworker justification for audit record...'
                  }
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveModalAction(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer min-h-[40px]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (activeModalAction === 'acknowledge') handleAcknowledge(selectedAlert.alertId);
                  else if (activeModalAction === 'assign') handleAssign(selectedAlert.alertId);
                  else if (activeModalAction === 'escalate') handleEscalate(selectedAlert.alertId);
                  else if (activeModalAction === 'resolve') handleResolve(selectedAlert.alertId);
                  else if (activeModalAction === 'add_note') handleAddNote(selectedAlert.alertId);
                }}
                className="px-5 py-2 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition cursor-pointer min-h-[40px]"
              >
                Confirm {activeModalAction.replace('_', ' ')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
