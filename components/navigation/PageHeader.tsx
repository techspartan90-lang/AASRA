'use client';

import React, { useState } from 'react';
import { useApp, FontSizeOption } from '@/lib/store';
import { SUPPORTED_LANGUAGES, TRANSLATIONS, SupportedLanguage } from '@/lib/i18n';
import {
  Search,
  Mic,
  PhoneCall,
  Bell,
  Eye,
  Globe2,
  ChevronDown,
  Sparkles,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { AccessibilitySettingsModal } from '@/components/AccessibilitySettingsModal';

interface PageHeaderProps {
  currentView: string;
  onNavigate: (viewId: string) => void;
  onSelectCase?: (caseId: string) => void;
}

const VIEW_TITLES: Record<string, { title: string; subtitle: string; category: string }> = {
  dashboard: {
    title: 'Survivor Overview',
    subtitle: 'Confidential recovery summary, scheduled interactions & personal safety',
    category: 'Home',
  },
  distress_score: {
    title: 'Distress Score Telemetry',
    subtitle: 'Dynamic baseline vs current observations, clinical triage & multi-signal inputs',
    category: 'Monitoring',
  },
  predictive_risk: {
    title: 'Predictive Trajectory',
    subtitle: 'Calibrated probabilistic risk forecasting over 7, 14, and 30-day horizons',
    category: 'Analytics',
  },
  channels: {
    title: 'Multi-Channel Ingestion Hub',
    subtitle: 'Privacy-preserving communication via App, Voice IVRS, SMS, and WhatsApp',
    category: 'Channels',
  },
  checkin_wizard: {
    title: 'Survivor Check-In',
    subtitle: 'Trauma-informed 4-step survey with non-stigmatizing evaluation',
    category: 'Assessment',
  },
  support: {
    title: 'Support & Counsellor',
    subtitle: 'Authorized welfare caseworkers, contact options & protective escort',
    category: 'Care',
  },
  cases: {
    title: 'Counsellor Clinical Workspace',
    subtitle: 'Assigned survivor caseload, case notes, timeline & protective protocols',
    category: 'Caseworker',
  },
  alerts: {
    title: 'Real-Time Alert Center',
    subtitle: 'Algorithmic early-warning alerts requiring mandatory human review',
    category: 'Triage',
  },
  prioritization: {
    title: 'Prioritization Queue',
    subtitle: 'Multi-factor triage matrix identifying cases requiring urgent review',
    category: 'Clinical',
  },
  analytics: {
    title: 'Administrative & Map Analytics',
    subtitle: 'State and district-level aggregated indicators with zero survivor GPS',
    category: 'Governance',
  },
  ai_models: {
    title: 'AI & ML Model Evaluation',
    subtitle: 'Model transparency cards, latency logs, explainability & bias audits',
    category: 'Auditing',
  },
  privacy: {
    title: 'Privacy & Security Center',
    subtitle: 'DPDPA 2023 compliance, granular consent sovereignty & cryptographic audit ledger',
    category: 'Compliance',
  },
  public: {
    title: 'About Manas Suraksha',
    subtitle: 'AI-assisted mental health & statutory protection system under SC/ST Act §15A',
    category: 'Public Portal',
  },
};

export function PageHeader({ currentView, onNavigate, onSelectCase }: PageHeaderProps) {
  const {
    role,
    language,
    setLanguage,
    notifications,
    setIsCommandPaletteOpen,
    setIsEmergencyModalOpen,
    setIsVoiceAssistantOpen,
    setIsReportModalOpen,
    setIsDemoModalOpen,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isA11yModalOpen, setIsA11yModalOpen] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const unreadCount = notifications.filter(n => !n.read).length;
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const viewMeta = VIEW_TITLES[currentView] || VIEW_TITLES.dashboard;

  return (
    <header className="sticky top-0 z-20 w-full glass-header transition-colors">
      {/* Statutory Synthetic Data Notice Bar */}
      <div className="bg-[#FFF7FA] text-[#111111] dark:bg-[#111116] dark:text-[#B8B8C2] px-4 py-1 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-[#F1D5DE] dark:border-[#2A2028]">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-[#B91C1C] text-white font-extrabold uppercase tracking-wider text-[9px] dark:bg-[#DC2626]">
            DEMO / SYNTHETIC DATA
          </span>
          <span className="font-semibold text-xs text-[#111111] dark:text-white">
            Never enter real survivor PII.
          </span>
          <span className="text-[#64748B] dark:text-[#8E8E9A] hidden xl:inline font-medium text-[11px]">
            SC/ST PoA Act §15A & DPDPA 2023 compliant architecture with zero-retention raw audio guarantee.
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1 text-[#64748B] hover:text-[#B91C1C] dark:text-[#B8B8C2] dark:hover:text-[#F472B6] font-semibold transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Generate PDF Audit Report</span>
          </button>
        </div>
      </div>

      {/* Main Lightweight Header Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Breadcrumbs & Current Page Title */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-[#64748B] dark:text-[#8E8E9A]">
            <span className="font-semibold text-[#B91C1C] dark:text-[#F472B6]">
              {viewMeta.category}
            </span>
            <span>/</span>
            <span className="truncate">{viewMeta.title}</span>
          </div>
          <h1 className="text-base sm:text-lg font-extrabold text-[#111111] dark:text-white tracking-tight truncate">
            {viewMeta.title}
          </h1>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search trigger (⌘K) */}
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-[#242424] bg-[#FFF7FA] hover:bg-[#FCE7F3] dark:bg-[#17171D] dark:text-[#B8B8C2] dark:hover:bg-[#22141F] rounded-xl border border-[#F1D5DE] dark:border-[#2A2028] transition cursor-pointer"
            title="Search cases, survivor IDs, metrics"
          >
            <Search className="w-3.5 h-3.5 text-[#B91C1C] dark:text-[#F472B6]" />
            <span className="font-medium hidden md:inline">Search cases...</span>
            <kbd className="font-mono text-[10px] bg-white dark:bg-[#0B0B0F] px-1.5 py-0.5 rounded border border-[#F1D5DE] dark:border-[#2A2028] text-[#64748B] font-semibold">
              ⌘K
            </kbd>
          </button>

          {/* Voice-First Assistant Trigger */}
          <button
            type="button"
            onClick={() => setIsVoiceAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#B91C1C] dark:text-[#F472B6] bg-[#FFF0F5] dark:bg-[#2A1522] border border-[#F1D5DE] dark:border-[#3E1F32] rounded-xl hover:bg-[#FCE7F3] dark:hover:bg-[#34182B] transition cursor-pointer"
            title="Open Trauma-Informed Voice Assistant"
          >
            <Mic className="w-3.5 h-3.5 text-[#B91C1C] dark:text-[#F472B6]" />
            <span className="hidden lg:inline">Trauma Voice</span>
          </button>

          {/* 24/7 National Emergency (112) Helpline Button */}
          <button
            type="button"
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#DC2626] dark:hover:bg-[#B91C1C] rounded-xl shadow-xs transition cursor-pointer"
            title="Emergency 24/7 Police & Mental Health Helpline"
          >
            <PhoneCall className="w-3.5 h-3.5 fill-white" />
            <span className="hidden sm:inline">24/7 Helpline: 112</span>
            <span className="sm:hidden">112</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl border border-[#F1D5DE] dark:border-[#2A2028] bg-white dark:bg-[#17171D] text-[#111111] dark:text-white hover:bg-[#FFF7FA] dark:hover:bg-[#22141F] transition cursor-pointer"
              aria-label="Change Language"
            >
              <Globe2 className="w-3.5 h-3.5 text-[#64748B] dark:text-[#8E8E9A]" />
              <span className="hidden md:inline">{currentLangObj.name}</span>
              <span className="md:hidden uppercase text-[10px] font-bold">{currentLangObj.code}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 rounded-xl border border-[#F1D5DE] dark:border-[#2A2028] bg-white dark:bg-[#17171D] shadow-xl z-50 p-1.5 max-h-60 overflow-y-auto">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8E8E9A]">
                  Select Official Language
                </div>
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition cursor-pointer ${
                      language === lang.code
                        ? 'bg-[#FCE7F3] text-[#B91C1C] font-bold dark:bg-[#2A1522] dark:text-[#F472B6]'
                        : 'text-[#242424] hover:bg-slate-100 dark:text-[#B8B8C2] dark:hover:bg-[#22141F]'
                    }`}
                  >
                    <span>{lang.name}</span>
                    <span className="text-[10px] opacity-70">{lang.nativeName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accessibility Settings Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsA11yModalOpen(true)}
            aria-label="Accessibility Settings"
            title="Accessibility Settings (Font size, high contrast, screen reader)"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#F1D5DE] dark:border-[#2A2028] bg-white dark:bg-[#17171D] text-[#64748B] dark:text-[#B8B8C2] hover:bg-[#FFF7FA] dark:hover:bg-[#22141F] transition cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              aria-label={`Notifications (${unreadCount} unread)`}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#F1D5DE] dark:border-[#2A2028] bg-white dark:bg-[#17171D] text-[#64748B] dark:text-[#B8B8C2] hover:bg-[#FFF7FA] dark:hover:bg-[#22141F] transition cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#B91C1C] text-[9px] font-extrabold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <NotificationDropdown
                onClose={() => setIsNotifOpen(false)}
                onSelectCase={caseId => {
                  if (onSelectCase) onSelectCase(caseId);
                  setIsNotifOpen(false);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Accessibility Settings Modal */}
      {isA11yModalOpen && (
        <AccessibilitySettingsModal
          isOpen={isA11yModalOpen}
          onClose={() => setIsA11yModalOpen(false)}
        />
      )}
    </header>
  );
}
