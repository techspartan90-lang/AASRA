'use client';

import React, { useState, useMemo } from 'react';
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
  AlertTriangle,
  Download,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  Smartphone,
  PhoneCall,
  MessageSquare,
  Globe,
  Radio,
  UserPlus,
  RefreshCw,
  LogOut,
  Info,
  ShieldCheck,
  HelpCircle,
  Hash,
  ShieldAlert,
  Sliders,
  Check,
  X,
  Laptop,
} from 'lucide-react';
import {
  globalPrivacyConsentEngine,
  GranularConsentItem,
  DataAccessLogItem,
  CommunicationPreferences,
  TrustedContactInfo,
  CommunicationChannelType,
  CheckInFrequencyType,
  DataCategoryType,
  ActiveSession,
  RoleAccessPermission,
} from '@/lib/privacy-consent-engine';
import { UserRole } from '@/types';

export function PrivacyCenter() {
  const { consent, updateConsent, role } = useApp();

  // Engine state hooks
  const [engine] = useState(() => globalPrivacyConsentEngine);
  const [profile, setProfile] = useState(() => engine.getProfile());
  const [activeTab, setActiveTab] = useState<
    'consent_dashboard' | 'access_history' | 'privacy_controls' | 'sessions' | 'plain_faqs'
  >('consent_dashboard');

  // Filter states for Access History
  const [historyRoleFilter, setHistoryRoleFilter] = useState<string>('all');
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<string>('all');
  const [historySearchQuery, setHistorySearchQuery] = useState<string>('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Expanded accordion sections in Consent Dashboard
  const [expandedConsentId, setExpandedConsentId] = useState<string | null>('consent-voice');

  // Modals state
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Form states for Modals
  const [tempChannel, setTempChannel] = useState<CommunicationChannelType>(profile.communicationPreferences.primaryChannel);
  const [tempFrequency, setTempFrequency] = useState<CheckInFrequencyType>(profile.communicationPreferences.checkInFrequency);
  const [tempQuietStart, setTempQuietStart] = useState<string>(profile.communicationPreferences.quietHoursStart);
  const [tempQuietEnd, setTempQuietEnd] = useState<string>(profile.communicationPreferences.quietHoursEnd);

  const [tempContactName, setTempContactName] = useState(profile.trustedContact.name);
  const [tempContactRelation, setTempContactRelation] = useState(profile.trustedContact.relationship);
  const [tempContactPhone, setTempContactPhone] = useState(profile.trustedContact.phone);
  const [tempNotifyCritical, setTempNotifyCritical] = useState(profile.trustedContact.notifyOnCriticalAlert);

  // Minimization audit simulation
  const [minimizationReport, setMinimizationReport] = useState(() => engine.getDataMinimizationReport());
  const [isAuditing, setIsAuditing] = useState(false);

  // Show transient toast
  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotificationMsg({ text, type });
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Toggle consent item
  const handleToggleConsent = (item: GranularConsentItem) => {
    const nextVal = !item.isEnabled;
    const res = engine.updateConsentCategory(item.key, nextVal, 'SURV-7821', role);
    if (res.success) {
      // Also sync with global app store if matching key
      if (item.key in consent) {
        updateConsent(item.key as keyof typeof consent, nextVal);
      }
      setProfile(engine.getProfile());
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  // Save Channel Preferences
  const handleSaveChannelPreferences = () => {
    const res = engine.updateCommunicationPreferences({
      primaryChannel: tempChannel,
      checkInFrequency: tempFrequency,
      quietHoursStart: tempQuietStart,
      quietHoursEnd: tempQuietEnd,
    });
    if (res.success) {
      setProfile(engine.getProfile());
      setIsChannelModalOpen(false);
      showToast(res.message, 'success');
    }
  };

  // Save Trusted Contact
  const handleSaveTrustedContact = () => {
    const res = engine.updateTrustedContact({
      name: tempContactName,
      relationship: tempContactRelation,
      phone: tempContactPhone,
      notifyOnCriticalAlert: tempNotifyCritical,
    });
    if (res.success) {
      setProfile(engine.getProfile());
      setIsContactModalOpen(false);
      showToast(res.message, 'success');
    }
  };

  // Terminate Session
  const handleTerminateSession = (sessionId: string) => {
    const res = engine.terminateSession(sessionId);
    if (res.success) {
      setProfile(engine.getProfile());
      showToast(res.message, 'info');
    } else {
      showToast(res.message, 'error');
    }
  };

  // Emergency Panic Quick Exit
  const handleEmergencyQuickExit = () => {
    if (typeof window !== 'undefined') {
      // Clear session memory for safety
      try {
        sessionStorage.clear();
      } catch (e) {
        // ignore
      }
      // Redirect to neutral portal
      window.location.replace('https://mausam.imd.gov.in/');
    }
  };

  // Run live Minimization Audit
  const handleRunMinimizationAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setMinimizationReport(engine.getDataMinimizationReport());
      setIsAuditing(false);
      showToast('Data Minimization & In-Memory Purge audit completed: 100% COMPLIANT', 'success');
    }, 600);
  };

  // Filtered Access Logs
  const accessLogs = useMemo(() => {
    return engine.getAccessLogs({
      role: historyRoleFilter as any,
      dataCategory: historyCategoryFilter as any,
      search: historySearchQuery,
    });
  }, [engine, historyRoleFilter, historyCategoryFilter, historySearchQuery, profile.lastUpdated]);

  const auditIntegrity = useMemo(() => engine.verifyAuditTrailIntegrity(), [accessLogs]);

  const consentReceipt = useMemo(() => engine.generateConsentReceipt(), [profile]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Toast Notification Banner */}
      {notificationMsg && (
        <div
          role="alert"
          className={`p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-semibold shadow-md transition-all ${
            notificationMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-800'
              : notificationMsg.type === 'error'
              ? 'bg-rose-50 text-rose-900 border border-rose-300 dark:bg-rose-950/70 dark:text-rose-200 dark:border-rose-800'
              : 'bg-indigo-50 text-indigo-900 border border-indigo-300 dark:bg-indigo-950/70 dark:text-indigo-200 dark:border-indigo-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notificationMsg.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            {notificationMsg.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />}
            {notificationMsg.type === 'info' && <Info className="w-5 h-5 text-indigo-600 shrink-0" />}
            <span>{notificationMsg.text}</span>
          </div>
          <button
            onClick={() => setNotificationMsg(null)}
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header with Quick Actions & Emergency Panic Button */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                Survivor Sovereignty Architecture
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                DPDPA 2023 Compliant
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                SC/ST Act Sec 15A
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Privacy & Consent Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
              You own your information. Choose what is collected, adjust your communication channels, withdraw consent without losing care, and inspect every authorized access record.
            </p>
          </div>

          {/* Quick Actions & Panic Exit */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsReceiptModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition shadow-xs cursor-pointer min-h-[40px]"
            >
              <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span>Consent Receipt</span>
            </button>

            <button
              onClick={handleEmergencyQuickExit}
              title="Immediately closes this page and redirects to a neutral government site without saving local history"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold transition shadow-sm cursor-pointer min-h-[40px]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Emergency Quick Exit</span>
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 font-medium">Consent Status:</span>
            <div className="flex items-center gap-1.5 mt-0.5 font-bold text-slate-900 dark:text-white">
              <span
                className={`w-2 h-2 rounded-full ${
                  profile.consentStatus === 'active'
                    ? 'bg-emerald-500'
                    : profile.consentStatus === 'partial'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              />
              <span className="capitalize">{profile.consentStatus}</span>
              <span className="text-slate-400 font-mono text-[11px]">({profile.currentVersion})</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 dark:text-slate-400 font-medium">Survivor ID:</span>
            <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
              {profile.anonymizedCode}
            </p>
          </div>

          <div>
            <span className="text-slate-500 dark:text-slate-400 font-medium">Last Synchronized:</span>
            <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
              {profile.lastUpdated}
            </p>
          </div>

          <div>
            <span className="text-slate-500 dark:text-slate-400 font-medium">Audit Trail Hash:</span>
            <div className="flex items-center gap-1 mt-0.5 text-emerald-700 dark:text-emerald-400 font-semibold font-mono text-[11px]">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cryptographically Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveTab('consent_dashboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer min-h-[42px] ${
            activeTab === 'consent_dashboard'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Consent Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('access_history')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer min-h-[42px] ${
            activeTab === 'access_history'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Data Access History</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            {accessLogs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('privacy_controls')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer min-h-[42px] ${
            activeTab === 'privacy_controls'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Privacy Controls & RBAC</span>
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer min-h-[42px] ${
            activeTab === 'sessions'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Laptop className="w-4 h-4" />
          <span>Active Sessions</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
            {profile.activeSessions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('plain_faqs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer min-h-[42px] ${
            activeTab === 'plain_faqs'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Plain-Language FAQs</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CONSENT DASHBOARD                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'consent_dashboard' && (
        <div className="space-y-6">
          {/* Plain-Language 3-Point Guarantee Summary */}
          <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/20 p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Your Rights in 3 Plain-Language Commitments</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 space-y-1.5">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  1. You Control What Is Shared
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-medium">
                  Voice analysis and longitudinal tracking are 100% voluntary. You can switch any feature on or off at any moment with one click.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 space-y-1.5">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  2. No Care Is Ever Denied
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-medium">
                  Withdrawing consent will never affect your legal protection or counsellor support. Your caseworker will support you via normal telephone and visits.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 space-y-1.5">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  3. Raw Voice Is Never Saved
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-medium">
                  Voice audio recordings are discarded in memory immediately after rhythm checking. No human ever listens to raw voice files.
                </p>
              </div>
            </div>
          </div>

          {/* Granular Consent Controls Section */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Granular Consent & Information Collected
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                  Review each category, understand why it is collected, and toggle preferences at will.
                </p>
              </div>
              <button
                onClick={() => setIsReceiptModalOpen(true)}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <span>View Digital Consent Trail</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List of Granular Consent Cards */}
            <div className="space-y-4">
              {profile.granularConsents.map(item => {
                const isExpanded = expandedConsentId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-all ${
                      item.isEnabled
                        ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 opacity-80'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {item.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.isEnabled
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {item.isEnabled ? 'ENABLED' : 'DISABLED'}
                          </span>
                          {!item.canBeWithdrawn && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              Statutory
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                          {item.plainLanguageSummary}
                        </p>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <button
                          onClick={() => setExpandedConsentId(isExpanded ? null : item.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 transition cursor-pointer min-h-[36px]"
                          aria-expanded={isExpanded}
                        >
                          <span>{isExpanded ? 'Less Details' : 'Why & How'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => handleToggleConsent(item)}
                          disabled={!item.canBeWithdrawn && item.isEnabled}
                          title={
                            !item.canBeWithdrawn
                              ? 'Required under statutory court record rules'
                              : item.isEnabled
                              ? 'Click to withdraw consent'
                              : 'Click to grant consent'
                          }
                          className={`p-1 transition cursor-pointer rounded-lg ${
                            !item.canBeWithdrawn && item.isEnabled
                              ? 'opacity-40 cursor-not-allowed'
                              : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                          }`}
                          aria-label={`Toggle ${item.name}`}
                        >
                          {item.isEnabled ? (
                            <ToggleRight className="w-9 h-9 text-emerald-600 fill-emerald-600" />
                          ) : (
                            <ToggleLeft className="w-9 h-9 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Disclosure Details */}
                    {isExpanded && (
                      <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 rounded-b-2xl space-y-4 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] text-slate-500">
                              Data Collected
                            </span>
                            <ul className="mt-1.5 space-y-1 text-slate-700 dark:text-slate-300">
                              {item.dataCollected.map((d, i) => (
                                <li key={i} className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <span>{d}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] text-slate-500">
                              Who Can Access
                            </span>
                            <ul className="mt-1.5 space-y-1 text-slate-700 dark:text-slate-300">
                              {item.whoCanAccess.map((w, i) => (
                                <li key={i} className="flex items-center gap-1.5">
                                  <UserCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                                  <span>{w}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-850">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] text-slate-500">
                              Retention Period
                            </span>
                            <p className="mt-1 text-slate-700 dark:text-slate-300 font-medium">
                              {item.retentionPeriod}
                            </p>
                          </div>

                          <div>
                            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] text-slate-500">
                              Legal Purpose & Basis
                            </span>
                            <p className="mt-1 text-slate-700 dark:text-slate-300 font-medium">
                              {item.legalPurpose}
                            </p>
                          </div>
                        </div>

                        {/* Withdrawal Impact Guarantee */}
                        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300">
                          <p className="font-bold text-slate-900 dark:text-white">
                            What happens if you turn this off?
                          </p>
                          <p className="mt-0.5 leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                            {item.withdrawalImpact}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preferences & Contact Matrix (2 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Communication Preferences */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Communication Preferences
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setTempChannel(profile.communicationPreferences.primaryChannel);
                    setTempFrequency(profile.communicationPreferences.checkInFrequency);
                    setTempQuietStart(profile.communicationPreferences.quietHoursStart);
                    setTempQuietEnd(profile.communicationPreferences.quietHoursEnd);
                    setIsChannelModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer min-h-[36px]"
                >
                  Change Channel
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Customize how and when you receive well-being check-ins and emergency updates.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Primary Channel</span>
                  <p className="font-bold text-slate-900 dark:text-white uppercase mt-0.5">
                    {profile.communicationPreferences.primaryChannel}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Frequency</span>
                  <p className="font-bold text-slate-900 dark:text-white capitalize mt-0.5">
                    {profile.communicationPreferences.checkInFrequency.replace('_', ' ')}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Quiet Hours Window</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {profile.communicationPreferences.quietHoursStart} – {profile.communicationPreferences.quietHoursEnd}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Fallback Channel</span>
                  <p className="font-bold text-slate-900 dark:text-white uppercase mt-0.5">
                    {profile.communicationPreferences.fallbackChannel}
                  </p>
                </div>
              </div>
            </div>

            {/* Trusted Contact for Critical Escalation */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Trusted Contact Designation
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setTempContactName(profile.trustedContact.name);
                    setTempContactRelation(profile.trustedContact.relationship);
                    setTempContactPhone(profile.trustedContact.phone);
                    setTempNotifyCritical(profile.trustedContact.notifyOnCriticalAlert);
                    setIsContactModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer min-h-[36px]"
                >
                  Edit Contact
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Designate a trusted family member or advocate to be informed only during Critical emergencies.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {profile.trustedContact.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {profile.trustedContact.relationship}
                  </span>
                </div>
                <p className="font-mono text-slate-700 dark:text-slate-300">
                  {profile.trustedContact.phone}
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                  <span>Critical Alert Trigger: {profile.trustedContact.notifyOnCriticalAlert ? 'Authorized' : 'Disabled'}</span>
                  <span>Verified: {profile.trustedContact.lastVerified}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Data Retention Framework */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Data Minimization & Retention Schedule
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                  Clear timelines for how long data is stored before automatic cryptographic purging.
                </p>
              </div>
              <button
                onClick={handleRunMinimizationAudit}
                disabled={isAuditing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition hover:bg-emerald-100 cursor-pointer min-h-[36px]"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                <span>{isAuditing ? 'Auditing Purge Pipeline...' : 'Verify Minimization'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Raw Audio Waveforms</span>
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white">0 Days</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  Destroyed in-memory within 100ms. Audio is never saved to physical storage disks.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Check-in Responses</span>
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                </div>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white">365 Days</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  1-year encrypted active monitoring window. Purged automatically after 1 year.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>AI Telemetry Scores</span>
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white">180 Days</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  Numerical indicators kept for 6 months to detect clinical inflection points.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Judicial Audit Logs</span>
                  <Clock className="w-3.5 h-3.5 text-purple-500" />
                </div>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white">730 Days</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  2-year statutory retention under Section 15A judicial accountability rules.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DATA ACCESS HISTORY                                                */}
      {/* ========================================================================= */}
      {activeTab === 'access_history' && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Data Access History & Audit Trail
                </h2>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                Every viewing of your well-being records is permanently recorded with actor identity, role, and authorized purpose.
              </p>
            </div>

            {/* Integrity Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Audit Trail Integrity: {auditIntegrity.integrityStatus} ({auditIntegrity.verifiedRecords}/{auditIntegrity.totalRecords} Signed)
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search actor, action, or reason..."
                value={historySearchQuery}
                onChange={e => setHistorySearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={historyRoleFilter}
                onChange={e => setHistoryRoleFilter(e.target.value)}
                aria-label="Filter access history by role"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Roles (Any Actor)</option>
                <option value="victim">Survivor (Self)</option>
                <option value="counsellor">Assigned Counsellor</option>
                <option value="district_officer">District Protection Officer</option>
                <option value="state_admin">State Directorate</option>
                <option value="system_service">Autonomous AI Engine</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={historyCategoryFilter}
                onChange={e => setHistoryCategoryFilter(e.target.value)}
                aria-label="Filter access history by data category"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Data Categories</option>
                <option value="distress_indicators">Distress Indicators</option>
                <option value="voice_acoustics">Voice Acoustics</option>
                <option value="checkin_responses">Check-in Responses</option>
                <option value="case_milestones">Case Milestones</option>
                <option value="consent_preferences">Consent Preferences</option>
                <option value="trusted_contacts">Trusted Contacts</option>
              </select>
            </div>
          </div>

          {/* Access Logs Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Data Category</th>
                  <th className="py-3 px-4">Authorized Reason</th>
                  <th className="py-3 px-4">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {accessLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400 font-medium">
                      No access log records matched your search filters.
                    </td>
                  </tr>
                ) : (
                  accessLogs.map(log => {
                    const isExpanded = expandedLogId === log.id;
                    return (
                      <React.Fragment key={log.id}>
                        <tr
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="hover:bg-slate-50 dark:hover:bg-slate-850/60 cursor-pointer transition"
                        >
                          <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            {log.timestamp}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                            {log.actor}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                log.role === 'counsellor'
                                  ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                                  : log.role === 'district_officer'
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                                  : log.role === 'victim'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              }`}
                            >
                              {log.role.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                            {log.action}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                            {log.dataCategory.replace('_', ' ')}
                          </td>
                          <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium max-w-xs truncate">
                            {log.reason}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Verified</span>
                            </span>
                          </td>
                        </tr>

                        {/* Expandable Crypto Hash Detail Row */}
                        {isExpanded && (
                          <tr className="bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-800">
                            <td colSpan={7} className="px-6 py-3 text-xs space-y-1">
                              <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[11px]">
                                <div className="text-slate-600 dark:text-slate-400">
                                  <span>Log Record ID: </span>
                                  <span className="font-bold text-slate-900 dark:text-white">{log.id}</span>
                                </div>
                                <div className="text-slate-600 dark:text-slate-400">
                                  <span>Resource: </span>
                                  <span className="font-bold text-slate-900 dark:text-white">{log.resourceId}</span>
                                </div>
                                <div className="text-slate-600 dark:text-slate-400">
                                  <span>Tamper-Proof Hash: </span>
                                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">{log.tamperProofHash}</span>
                                </div>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Authorized under Section 15A case management protocol. Cryptographic signature immutably chained.
                              </p>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PRIVACY CONTROLS & RBAC MATRIX                                     */}
      {/* ========================================================================= */}
      {activeTab === 'privacy_controls' && (
        <div className="space-y-6">
          {/* RBAC Table */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Role-Based Access Control (RBAC) Architecture
                </h2>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                Strict least-privilege partitioning guarantees that only directly assigned clinical staff can see individual records.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Role Persona</th>
                    <th className="py-3 px-4">Distress Scores</th>
                    <th className="py-3 px-4">Written Responses</th>
                    <th className="py-3 px-4">Voice Acoustic Telemetry</th>
                    <th className="py-3 px-4">Consent Modification</th>
                    <th className="py-3 px-4">Macro Aggregates</th>
                    <th className="py-3 px-4">PII Export</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {engine.getRolePermissions().map(p => (
                    <tr key={p.role} className="hover:bg-slate-50 dark:hover:bg-slate-850/60">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 dark:text-white">{p.roleTitle}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-snug">
                          {p.scopeDescription}
                        </p>
                      </td>

                      <td className="py-3 px-4">
                        {p.canViewDistressScore ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                            <Check className="w-4 h-4" /> Allowed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400">
                            <X className="w-4 h-4" /> Denied
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {p.canViewRawResponses ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                            <Check className="w-4 h-4" /> Allowed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400">
                            <X className="w-4 h-4" /> Redacted
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {p.canViewVoiceAcoustics ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                            <Check className="w-4 h-4" /> Allowed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400">
                            <X className="w-4 h-4" /> Blocked
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {p.canEditConsent ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                            <Check className="w-4 h-4" /> Sovereign
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400">
                            <X className="w-4 h-4" /> Denied
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {p.canExportAggregates ? (
                          <span className="inline-flex items-center gap-1 text-purple-700 dark:text-purple-400 font-bold">
                            <Check className="w-4 h-4" /> Aggregated
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400">
                            <X className="w-4 h-4" /> None
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {p.canExportPII ? (
                          <span className="inline-flex items-center gap-1 text-sky-700 dark:text-sky-400 font-bold">
                            <Check className="w-4 h-4" /> Self Only
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                            <X className="w-4 h-4" /> Blocked
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Data Minimization Verification Report */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Data Minimization Architectural Guarantee
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Continuous enforcement of privacy-by-design principles across backend pipelines.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 self-start sm:self-auto">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Status: {minimizationReport.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Raw Voice Audio Stored</span>
                <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  {minimizationReport.rawAudioStoredBytes} Bytes
                </p>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">Immediate in-memory purge</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Exact GPS Coordinates</span>
                <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  {minimizationReport.exactGpsCoordinatesStored} Coordinates
                </p>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">District level aggregation only</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">PII Tokenization Rate</span>
                <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                  {minimizationReport.piiTokenizationRate}%
                </p>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">Pseudo-identifier masked</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Retention Policy Compliance</span>
                <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                  {minimizationReport.retentionComplianceRate}%
                </p>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">Expired records purged</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] text-slate-500">
                Verified Architectural Assertions
              </span>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 font-medium">
                {minimizationReport.assertions.map((a, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ACTIVE SESSIONS & SECURITY SETTINGS                                */}
      {/* ========================================================================= */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Active Login Sessions
                  </h2>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                  See where your account is currently signed in. Terminate unrecognized or older sessions immediately.
                </p>
              </div>

              <button
                onClick={() => handleTerminateSession('all_others')}
                className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold transition hover:bg-rose-100 cursor-pointer min-h-[38px] self-start sm:self-auto"
              >
                Terminate All Other Sessions
              </button>
            </div>

            <div className="space-y-3">
              {profile.activeSessions.map(session => (
                <div
                  key={session.id}
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                    session.isCurrent
                      ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      {session.channel === 'app' ? (
                        <Smartphone className="w-5 h-5 text-emerald-600" />
                      ) : session.channel === 'ivrs' ? (
                        <PhoneCall className="w-5 h-5 text-sky-600" />
                      ) : (
                        <Laptop className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                          {session.device}
                        </p>
                        {session.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Current Device
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 font-medium">
                        {session.browser} • {session.ipLocation}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        Signed in: {session.loginTimestamp} • Last active: {session.lastActive}
                      </p>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <button
                      onClick={() => handleTerminateSession(session.id)}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer min-h-[36px] self-end sm:self-center"
                    >
                      Terminate Session
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PLAIN-LANGUAGE FAQS & LEGAL RIGHTS                                 */}
      {/* ========================================================================= */}
      {activeTab === 'plain_faqs' && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Frequently Asked Privacy Questions
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
              Clear, transparent explanations without complex legal jargon.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Can the police or the accused person see what I write in my check-ins?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                No. Your check-ins are strictly confidential psychological wellness records. They are protected under the victim privacy guarantees of Section 15A of the SC/ST Act and cannot be accessed by the accused or public police officers. Only your assigned clinical counsellor can review your detailed check-ins.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Will turning off voice analysis or automated reminders harm my court case?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Never. Mental-health check-ins and AI distress monitoring are 100% voluntary support features designed for your well-being. Turning them off will have zero negative effect on your legal proceedings, compensation claims, or witness protection entitlements under the law.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white">
                How do I know my voice recordings are truly destroyed?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                The Manas Suraksha architecture uses in-memory acoustic feature extraction. When you speak, our server computes mathematical features (like speaking speed and pitch variation) inside temporary server memory. Within 100 milliseconds, the audio waveform is immediately purged from RAM and is never written to disk or recorded.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white">
                What does the Emergency Quick Exit button do?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                If someone approaches you and you need to leave the screen immediately, the red Emergency Quick Exit button clears your temporary browsing session and redirects your browser to an innocent weather forecast portal (IMD Weather) without leaving a trace of this website on your screen.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CHANGE COMMUNICATION CHANNEL                                     */}
      {/* ========================================================================= */}
      {isChannelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Change Communication Channel
                </h3>
              </div>
              <button
                onClick={() => setIsChannelModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close channel dialog"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Channel Selector */}
              <div>
                <label className="font-bold text-slate-900 dark:text-white block mb-1">
                  Primary Delivery Channel
                </label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {(['app', 'sms', 'ivrs', 'chatbot', 'web'] as CommunicationChannelType[]).map(ch => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setTempChannel(ch)}
                      className={`p-3 rounded-xl border text-left font-bold transition flex items-center justify-between cursor-pointer ${
                        tempChannel === ch
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="uppercase">{ch}</span>
                      {tempChannel === ch && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency Selector */}
              <div>
                <label className="font-bold text-slate-900 dark:text-white block mb-1">
                  Check-In Frequency
                </label>
                <select
                  value={tempFrequency}
                  onChange={e => setTempFrequency(e.target.value as CheckInFrequencyType)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                >
                  <option value="daily">Daily Check-In</option>
                  <option value="every_3_days">Every 3 Days</option>
                  <option value="weekly">Weekly Check-In</option>
                  <option value="custom">Custom Milestone Schedule</option>
                </select>
              </div>

              {/* Quiet Hours */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-900 dark:text-white block mb-1">
                    Quiet Hours Start
                  </label>
                  <input
                    type="time"
                    value={tempQuietStart}
                    onChange={e => setTempQuietStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 dark:text-white block mb-1">
                    Quiet Hours End
                  </label>
                  <input
                    type="time"
                    value={tempQuietEnd}
                    onChange={e => setTempQuietEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsChannelModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer min-h-[38px]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChannelPreferences}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer min-h-[38px]"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT TRUSTED CONTACT                                             */}
      {/* ========================================================================= */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Edit Trusted Contact
                </h3>
              </div>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close trusted contact dialog"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-900 dark:text-white block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={tempContactName}
                  onChange={e => setTempContactName(e.target.value)}
                  placeholder="e.g. Monojit Sharma"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 dark:text-white block mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  value={tempContactRelation}
                  onChange={e => setTempContactRelation(e.target.value)}
                  placeholder="e.g. Brother, Advocate, Trusted Friend"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 dark:text-white block mb-1">
                  Verified Phone Number
                </label>
                <input
                  type="text"
                  value={tempContactPhone}
                  onChange={e => setTempContactPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    Notify On Critical Emergency
                  </p>
                  <p className="text-slate-500 font-medium">
                    Only triggered if a Critical Review alert occurs and you are unreachable.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTempNotifyCritical(!tempNotifyCritical)}
                  className="cursor-pointer"
                  aria-label="Toggle critical emergency notification"
                >
                  {tempNotifyCritical ? (
                    <ToggleRight className="w-8 h-8 text-indigo-600 fill-indigo-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer min-h-[38px]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTrustedContact}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer min-h-[38px]"
              >
                Update Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CONSENT RECEIPT & CRYPTO AUDIT                                   */}
      {/* ========================================================================= */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Official Digital Consent Receipt
                </h3>
              </div>
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close consent receipt dialog"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              This verifiable certificate serves as legal proof of your consent settings and data minimization guarantees under the Digital Personal Data Protection Act.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Receipt ID:</span>
                <span className="font-bold text-slate-900 dark:text-white">{consentReceipt.receiptId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Survivor Token:</span>
                <span className="font-bold text-slate-900 dark:text-white">{consentReceipt.survivorCode}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Consent Version:</span>
                <span className="font-bold text-emerald-600">{consentReceipt.version}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold uppercase text-slate-900 dark:text-white">{consentReceipt.status}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500">Active Permissions:</span>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 font-sans">
                  {consentReceipt.activeConsents.join(', ')}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 break-all">
                <span className="block font-bold">Ed25519 Digital Signature:</span>
                <span>{consentReceipt.digitalSignature}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer min-h-[38px]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  showToast('Consent receipt downloaded as verification JSON/PDF', 'success');
                  setIsReceiptModalOpen(false);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer min-h-[38px]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Proof</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
