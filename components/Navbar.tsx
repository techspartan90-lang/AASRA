'use client';

import React, { useState } from 'react';
import { useApp, FontSizeOption } from '@/lib/store';
import { UserRole } from '@/types';
import { SUPPORTED_LANGUAGES, TRANSLATIONS, SupportedLanguage } from '@/lib/i18n';
import {
  Shield,
  Bell,
  Search,
  Mic,
  PhoneCall,
  Sun,
  Moon,
  Type,
  UserCheck,
  AlertCircle,
  FileSpreadsheet,
  Play,
  RotateCcw,
  LogIn,
  Sparkles,
  Eye,
} from 'lucide-react';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { AccessibilitySettingsModal } from '@/components/AccessibilitySettingsModal';

const ROLE_LABELS: Record<UserRole, string> = {
  victim: 'Victim / Complainant',
  counsellor: 'Counsellor / Case Worker',
  district_officer: 'District Welfare Officer',
  state_admin: 'State Administrator',
  national_admin: 'National Administrator',
};

export function Navbar({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const {
    role,
    setRole,
    currentUser,
    isSupabaseConfigured,
    language,
    setLanguage,
    theme,
    setTheme,
    fontSize,
    setFontSize,
    notifications,
    setIsCommandPaletteOpen,
    setIsEmergencyModalOpen,
    setIsReportModalOpen,
    setIsVoiceAssistantOpen,
    setIsDemoModalOpen,
    setIsLoginModalOpen,
    setIsOnboardingModalOpen,
    survivorOnboardingData,
    resetDemoData,
    isClientHydrated,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
  const [isA11yModalOpen, setIsA11yModalOpen] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const unreadCount = notifications.filter(n => !n.read).length;

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 w-full glass-header transition-colors">
      {/* Demonstration Banner - Mandatory Statutory Notice */}
      <div className="bg-amber-50/95 text-amber-950 dark:bg-slate-950 dark:text-slate-200 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-amber-300/80 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white font-extrabold uppercase tracking-wider text-[10px]">
            DEMO / SYNTHETIC DATA
          </span>
          <span className="font-semibold text-amber-900 dark:text-amber-200">
            Never use real survivor information.
          </span>
          <span className="text-slate-600 dark:text-slate-400 hidden lg:inline font-medium">
            All accounts, names, distress scores, and judicial records are entirely synthetic.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDemoModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Demo Scenarios & Accounts</span>
          </button>

          <button
            onClick={resetDemoData}
            title="Reset to default synthetic state"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 text-xs font-semibold transition cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset State</span>
          </button>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 dark:bg-slate-800 text-white shadow-xs ring-1 ring-indigo-500/30 dark:ring-slate-700 group-hover:bg-indigo-700 dark:group-hover:bg-slate-700 transition">
              <Shield className="h-5 w-5 text-white dark:text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white tracking-tight">
                  {t.appTitle}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-slate-300 border border-indigo-200 dark:border-slate-700">
                  Gov Assist
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate max-w-[200px] sm:max-w-xs">
                {t.appSubtitle}
              </p>
            </div>
          </button>
        </div>

        {/* Center / Action Shortcuts */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Quick Search trigger */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750 rounded-lg border border-slate-300 dark:border-slate-700 transition cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="font-medium">Search cases, districts...</span>
            <kbd className="ml-2 font-mono text-[10px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold">
              ⌘K
            </kbd>
          </button>

          {/* Voice First Trigger */}
          <button
            onClick={() => setIsVoiceAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800/80 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition cursor-pointer"
            title="Multilingual Voice Assistant"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Voice Assistant</span>
          </button>
        </div>

        {/* Right Controls - Ordered logically */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 1. Emergency Support Trigger */}
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-rose-800 bg-rose-50 border border-rose-300 rounded-lg hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-900/60 dark:hover:bg-rose-900/50 transition shadow-xs cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span className="hidden sm:inline">24/7 Helpline</span>
            <span className="sm:hidden">Help</span>
          </button>

          {/* Secure Login Modal Trigger */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-200 dark:border-indigo-800 dark:hover:bg-indigo-900/50 transition shadow-xs cursor-pointer"
            title="Authenticate with Email/Phone and Password or OTP"
          >
            <LogIn className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden md:inline">Secure Login</span>
            <span className="md:hidden">Login</span>
          </button>

          {/* Survivor Onboarding Trigger for Victim role */}
          {role === 'victim' && (
            <button
              onClick={() => setIsOnboardingModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition shadow-xs cursor-pointer"
              title="Configure trauma-informed care & privacy preferences"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{survivorOnboardingData ? 'Care Preferences' : 'Onboarding'}</span>
            </button>
          )}

          {/* 2. Role & Persona Switcher with Supabase/Demo Status */}
          <div className="relative">
            <label htmlFor="role-select" className="sr-only">Switch Role</label>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200">
              <UserCheck className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold leading-none hidden md:block">
                  {currentUser?.name}
                </span>
                <select
                  id="role-select"
                  value={role}
                  onChange={e => setRole(e.target.value as UserRole)}
                  className="bg-transparent font-bold text-xs text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer pr-1"
                  title={`Active persona: ${currentUser?.name} (${isSupabaseConfigured ? 'Supabase Live' : 'Demo Memory Backend'})`}
                >
                  <option value="victim" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">{ROLE_LABELS.victim}</option>
                  <option value="counsellor" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">{ROLE_LABELS.counsellor}</option>
                  <option value="district_officer" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">{ROLE_LABELS.district_officer}</option>
                  <option value="state_admin" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">{ROLE_LABELS.state_admin}</option>
                  <option value="national_admin" className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">{ROLE_LABELS.national_admin}</option>
                </select>
              </div>
              <span
                className={`hidden lg:inline-block w-2 h-2 rounded-full ${
                  isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                title={isSupabaseConfigured ? 'Supabase PostgreSQL Connected' : 'High-fidelity Demo Repository'}
              />
            </div>
          </div>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-0.5 hidden sm:block" />

          {/* 3. Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsLangMenuOpen(!isLangMenuOpen);
                setIsFontMenuOpen(false);
                setIsNotifOpen(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-700 transition cursor-pointer"
              title="Select Language"
              aria-label="Language selection"
            >
              <span className="font-bold">{currentLangObj.code.toUpperCase()}</span>
              <span className="hidden xl:inline text-slate-600 dark:text-slate-400 font-medium">
                ({currentLangObj.nativeName})
              </span>
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  Select Language / ভাষা
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer ${
                        language === lang.code
                          ? 'font-bold text-indigo-600 dark:text-emerald-400 bg-indigo-50/70 dark:bg-emerald-950/30'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <span>{lang.name}</span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">{lang.nativeName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Accessibility Font Size Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setIsFontMenuOpen(!isFontMenuOpen);
                setIsLangMenuOpen(false);
                setIsNotifOpen(false);
              }}
              className="p-2 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-750 transition cursor-pointer"
              title="Text size & accessibility"
              aria-label="Text size"
            >
              <Type className="w-4 h-4" />
            </button>

            {isFontMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                  Font Scaling (WCAG)
                </div>
                {(['normal', 'large', 'extra-large'] as FontSizeOption[]).map(size => (
                  <button
                    key={size}
                    onClick={() => {
                      setFontSize(size);
                      setIsFontMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer ${
                      fontSize === size
                        ? 'font-bold text-indigo-600 dark:text-emerald-400 bg-indigo-50 dark:bg-emerald-950/40'
                        : 'text-slate-800 dark:text-slate-200 font-medium'
                    }`}
                  >
                    <span>
                      {size === 'normal'
                        ? 'Normal (100%)'
                        : size === 'large'
                        ? 'Large (125%)'
                        : 'Extra Large (150%)'}
                    </span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setIsA11yModalOpen(true);
                    setIsFontMenuOpen(false);
                  }}
                  className="mt-1.5 flex w-full items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 transition cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>All Accessibility & Language</span>
                </button>
              </div>
            )}
          </div>

          {/* 5. Theme Mode Toggle (Light / Dark / System) */}
          <button
            onClick={() => {
              if (theme === 'light') setTheme('dark');
              else if (theme === 'dark') setTheme('system');
              else setTheme('light');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-700 transition cursor-pointer"
            title={`Current Theme: ${theme.toUpperCase()} (Click to cycle Light → Dark → System)`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/30" />
                <span className="hidden sm:inline">Night</span>
              </>
            ) : theme === 'light' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-600 fill-amber-500/30" />
                <span className="hidden sm:inline">Day</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">System</span>
              </>
            )}
          </button>

          {/* 6. Notification Center Trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsLangMenuOpen(false);
                setIsFontMenuOpen(false);
              }}
              className="relative p-2 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-750 transition cursor-pointer"
              title="Notifications"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {isClientHydrated && unreadCount > 0 ? (
                <span
                  suppressHydrationWarning
                  className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs"
                >
                  {unreadCount}
                </span>
              ) : null}
            </button>

            {isNotifOpen && (
              <NotificationDropdown
                onClose={() => setIsNotifOpen(false)}
                onSelectCase={caseId => {
                  if (onNavigate) onNavigate('cases');
                  setIsNotifOpen(false);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Global WCAG 2.2 AA Accessibility Modal */}
      <AccessibilitySettingsModal
        isOpen={isA11yModalOpen}
        onClose={() => setIsA11yModalOpen(false)}
      />
    </header>
  );
}
