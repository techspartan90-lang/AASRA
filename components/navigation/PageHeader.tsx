'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '@/lib/i18n';
import {
  Search,
  Mic,
  PhoneCall,
  Bell,
  Eye,
  Globe2,
  ChevronDown,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { AccessibilitySettingsModal } from '@/components/AccessibilitySettingsModal';
import { useTranslation } from '@/hooks/use-i18n';

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
    title: 'Privacy & Security Vault',
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
    language,
    setLanguage,
    notifications,
    setIsCommandPaletteOpen,
    setIsEmergencyModalOpen,
    setIsVoiceAssistantOpen,
    setIsReportModalOpen,
  } = useApp();

  const { t } = useTranslation();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isA11yModalOpen, setIsA11yModalOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const viewMeta = VIEW_TITLES[currentView] || VIEW_TITLES.dashboard;
  const translatedTitle = t(`page_titles.${currentView}`, viewMeta.title);

  return (
    <header className="sticky top-0 z-20 w-full glass-header transition-colors select-none">
      {/* Premium Synthetic Data Notice Bar */}
      <div className="bg-[#333333]/5 dark:bg-[#1E1E1E]/80 text-[#333333] dark:text-[#D6D6D6] px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-[#D9D9DE] dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-[#FD1053]/15 text-[#FD1053] border border-[#FD1053]/35 font-bold uppercase tracking-wider text-[9px] shadow-[0_0_8px_rgba(253,16,83,0.15)]">
            {t('landing.demo_notice', 'DEMO / SYNTHETIC DATA')}
          </span>
          <span className="font-semibold text-xs text-[#333333] dark:text-white">
            {t('landing.demo_warning', 'Never enter real survivor PII.')}
          </span>
          <span className="text-[#6B7280] dark:text-[#A3A3A3] hidden xl:inline font-normal text-[11px]">
            {t('landing.demo_statutory', 'SC/ST PoA Act §15A & DPDPA 2023 compliant architecture with zero-retention raw audio guarantee.')}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 text-[#474747] hover:text-[#FD1053] dark:text-[#D6D6D6] dark:hover:text-[#FD1053] font-medium transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{t('landing.audit_report', 'Generate PDF Audit Report')}</span>
          </button>
        </div>
      </div>

      {/* Main Luxury Header Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Breadcrumbs & Current Page Title */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-[#6B7280] dark:text-[#A3A3A3]">
            <span className="font-semibold text-[#FD1053]">
              {t(`category.${currentView}`, viewMeta.category)}
            </span>
            <span>/</span>
            <span className="truncate">{translatedTitle}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-[#151515] dark:text-white tracking-tight truncate">
            {translatedTitle}
          </h1>
        </div>

        {/* Right: Quick Action Controls (Compact Glass Controls) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search trigger (⌘K) */}
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-[#333333] dark:text-[#D6D6D6] bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl border border-black/10 dark:border-white/10 transition cursor-pointer"
            title="Search cases, survivor IDs, metrics (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-[#FD1053]" />
            <span className="font-medium hidden md:inline">{t('landing.search_placeholder', 'Search cases...')}</span>
            <kbd className="font-mono text-[10px] bg-white dark:bg-[#151515] px-1.5 py-0.5 rounded border border-[#D9D9DE] dark:border-white/15 text-[#6B7280] dark:text-[#A3A3A3] font-semibold">
              ⌘K
            </kbd>
          </button>

          {/* Familiar Voice Comfort Trigger */}
          <button
            type="button"
            onClick={() => setIsVoiceAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#FD1053] bg-[#FD1053]/10 border border-[#FD1053]/25 rounded-xl hover:bg-[#FD1053]/15 transition cursor-pointer shadow-[0_0_10px_rgba(253,16,83,0.1)]"
            title="Open Familiar Voice Comfort & Grounding Assistant"
          >
            <Mic className="w-3.5 h-3.5 text-[#FD1053]" />
            <span className="hidden lg:inline">{t('landing.voice_comfort', 'Voice Comfort')}</span>
          </button>

          {/* Helplines: Emergency 112 & NHAA Atrocities 14566 Button */}
          <button
            type="button"
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#FD1053] hover:bg-[#e00b46] rounded-xl shadow-[0_2px_10px_rgba(253,16,83,0.35)] transition cursor-pointer"
            title="Helplines: Emergency (112) | NHAA Atrocities (14566) | Tele-MANAS (14416)"
          >
            <PhoneCall className="w-3.5 h-3.5 fill-white" />
            <span className="hidden sm:inline">{t('landing.helplines_btn', 'Helplines: 112 / 14566')}</span>
            <span className="sm:hidden">112 / 14566</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-[#333333] dark:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition cursor-pointer shadow-xs"
              aria-label="Change Language"
            >
              <Globe2 className="w-3.5 h-3.5 text-[#6B7280] dark:text-[#A3A3A3]" />
              <span className="hidden md:inline">{currentLangObj.name}</span>
              <span className="md:hidden uppercase text-[10px] font-bold">{currentLangObj.code}</span>
              <ChevronDown className="w-3 h-3 text-[#6B7280]" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-52 rounded-xl border border-[#D9D9DE] dark:border-white/15 bg-white dark:bg-[#1E1E1E] shadow-2xl z-50 p-1.5 max-h-72 overflow-y-auto">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#A3A3A3]">
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
                        ? 'bg-[#FD1053]/15 text-[#FD1053] font-bold'
                        : 'text-[#333333] dark:text-[#D6D6D6] hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    <span>{lang.name}</span>
                    <span className="text-[10px] opacity-70">{lang.nativeName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accessibility Settings Trigger */}
          <button
            type="button"
            onClick={() => setIsA11yModalOpen(true)}
            aria-label="Accessibility Settings"
            title="Accessibility Settings (Font size, high contrast, screen reader)"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#474747]/20 dark:border-white/10 bg-white/70 dark:bg-white/5 text-[#474747] dark:text-[#D6D6D6] hover:bg-white dark:hover:bg-white/10 transition cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              aria-label={`Notifications (${unreadCount} unread)`}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#474747]/20 dark:border-white/10 bg-white/70 dark:bg-white/5 text-[#474747] dark:text-[#D6D6D6] hover:bg-white dark:hover:bg-white/10 transition cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FD1053] text-[9px] font-bold text-white shadow-[0_0_6px_#FD1053]">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <NotificationDropdown
                onClose={() => setIsNotifOpen(false)}
                onSelectCase={caseId => {
                  setIsNotifOpen(false);
                  if (onSelectCase) onSelectCase(caseId);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Accessibility Modal */}
      <AccessibilitySettingsModal
        isOpen={isA11yModalOpen}
        onClose={() => setIsA11yModalOpen(false)}
      />
    </header>
  );
}
