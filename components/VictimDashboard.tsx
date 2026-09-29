'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { SUPPORTED_LANGUAGES, TRANSLATIONS, SupportedLanguage } from '@/lib/i18n';
import { CheckInWizard } from '@/components/CheckInWizard';
import { DynamicDistressDashboard } from '@/components/DynamicDistressDashboard';
import {
  Heart,
  Shield,
  ShieldCheck,
  Lock,
  PhoneCall,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Mic,
  MicOff,
  ChevronRight,
  Send,
  UserCheck,
  Calendar,
  Volume2,
  Eye,
  EyeOff,
  FileText,
  Check,
  TrendingUp,
  User,
  Bell,
  Scale,
  Smile,
  Meh,
  Frown,
  ArrowRight,
  ChevronDown,
  Info,
  Radio,
  Sliders,
  RotateCcw,
  Sparkle,
} from 'lucide-react';

interface TrendPoint {
  date: string;
  dayLabel: string;
  score: number;
  note: string;
}

const HISTORICAL_TREND: TrendPoint[] = [
  { date: 'Sep 07', dayLabel: 'Day 1', score: 58, note: 'Intake Baseline' },
  { date: 'Sep 10', dayLabel: 'Day 4', score: 62, note: 'Post First Meeting' },
  { date: 'Sep 14', dayLabel: 'Day 8', score: 60, note: 'Routine Check-In' },
  { date: 'Sep 18', dayLabel: 'Day 12', score: 67, note: 'Counselling Session' },
  { date: 'Sep 21', dayLabel: 'Day 15', score: 71, note: 'Advocate Assigned' },
  { date: 'Sep 25', dayLabel: 'Day 19', score: 74, note: 'Rest & Support' },
  { date: 'Sep 28', dayLabel: 'Today', score: 78, note: 'Steady & Supported' },
];

export function VictimDashboard() {
  const {
    cases,
    selectedCaseId,
    language,
    setLanguage,
    submitVictimCheckIn,
    setIsEmergencyModalOpen,
    setIsVoiceAssistantOpen,
    consent,
    updateConsent,
    notifications,
    auditLogs,
    survivorOnboardingData,
    setIsOnboardingModalOpen,
  } = useApp();

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Active victim case (CASE-002 or selectedCaseId)
  const victimCase =
    cases.find(c => c.id === selectedCaseId) ||
    cases.find(c => c.id === 'CASE-002') ||
    cases[0];

  // Active view tab within the Survivor Sanctuary
  const [activeTab, setActiveTab] = useState<'today' | 'trend' | 'checkin' | 'support' | 'journey' | 'privacy'>('today');

  // Today mood state
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [todayAcknowledged, setTodayAcknowledged] = useState(false);

  // In-card Check-In form
  const [checkInText, setCheckInText] = useState('');
  const [checkInMood, setCheckInMood] = useState<string>('Okay');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceNoteRecorded, setVoiceNoteRecorded] = useState(false);
  const [checkInSubmitting, setCheckInSubmitting] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState(false);

  // Guided wizard modal fallback
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Support actions
  const [callbackRequested, setCallbackRequested] = useState(false);
  const [callbackTime, setCallbackTime] = useState<'morning' | 'afternoon' | 'evening'>('afternoon');
  const [messageToCounsellor, setMessageToCounsellor] = useState('');
  const [counsellorMessageSent, setCounsellorMessageSent] = useState(false);
  const [activeResourceModal, setActiveResourceModal] = useState<string | null>(null);

  // Privacy toggles local state
  const [localConsent, setLocalConsent] = useState(consent.automatedReminders);
  const [localVoiceAnalysis, setLocalVoiceAnalysis] = useState(consent.voiceAnalysis);
  const [localCaseworkerAccess, setLocalCaseworkerAccess] = useState(true);

  // Header popovers
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Breathing exercise modal state
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  // Timer for voice note simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 60) {
            setIsRecordingVoice(false);
            setVoiceNoteRecorded(true);
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  // Breathing pacing timer
  useEffect(() => {
    if (!isBreathingOpen) return;
    const interval = setInterval(() => {
      setBreathPhase(prev => {
        if (prev === 'Inhale') return 'Hold';
        if (prev === 'Hold') return 'Exhale';
        return 'Inhale';
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isBreathingOpen]);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleQuickFeelingSelect = async (feeling: string, score: number) => {
    setSelectedFeeling(feeling);
    setTodayAcknowledged(true);

    try {
      await submitVictimCheckIn({
        feelingScore: score,
        safetyScore: score >= 3 ? 4 : 3,
        sleepScore: 4,
        fearScore: score <= 2 ? 4 : 2,
        avoidanceScore: 1,
        requestHelp: score <= 2,
        notes: `Today's check-in: Feeling ${feeling}`,
      }, victimCase.id);
    } catch {
      // safe fallback
    }

    setTimeout(() => {
      setTodayAcknowledged(false);
    }, 6000);
  };

  const handleSubmitCheckInCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckInSubmitting(true);

    const moodScoreMap: Record<string, number> = {
      Calm: 5,
      Okay: 4,
      Worried: 3,
      Overwhelmed: 2,
      'Very distressed': 1,
    };

    const score = moodScoreMap[checkInMood] || 4;

    try {
      await submitVictimCheckIn({
        feelingScore: score,
        safetyScore: score >= 3 ? 4 : 2,
        sleepScore: 4,
        fearScore: score <= 2 ? 4 : 2,
        avoidanceScore: 1,
        requestHelp: score <= 2,
        notes: checkInText || `Check-in recorded with mood: ${checkInMood}${voiceNoteRecorded ? ' (Voice note attached)' : ''}`,
      }, victimCase.id);

      setCheckInSuccess(true);
      setCheckInText('');
      setVoiceNoteRecorded(false);
      setRecordingSeconds(0);
      setTimeout(() => setCheckInSuccess(false), 6000);
    } catch {
      // error handled
    } finally {
      setCheckInSubmitting(false);
    }
  };

  const handleRequestCallback = () => {
    setCallbackRequested(true);
    setTimeout(() => setCallbackRequested(false), 6000);
  };

  const handleSendCounsellorMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageToCounsellor.trim()) return;
    setCounsellorMessageSent(true);
    setMessageToCounsellor('');
    setTimeout(() => setCounsellorMessageSent(false), 5000);
  };

  if (isWizardOpen) {
    return (
      <div className="py-6 sm:py-10 max-w-4xl mx-auto px-4">
        <CheckInWizard
          onComplete={() => setIsWizardOpen(false)}
          onCancel={() => setIsWizardOpen(false)}
        />
      </div>
    );
  }

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 sm:py-8 px-4 sm:px-6">
      {/* =========================================================================
          HEADER
          Include:
          - Manas Suraksha logo
          - greeting
          - language selector
          - notifications
          - privacy shortcut
          - profile
          ========================================================================= */}
      <header className="rounded-3xl bg-linear-to-r from-emerald-50 via-teal-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-850 border border-emerald-200/70 dark:border-slate-800 p-6 sm:p-8 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Logo & Greeting */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Manas Suraksha
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-300 dark:border-emerald-800">
                    Safe Sanctuary
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  National Atrocity Survivor Well-Being Platform
                </p>
              </div>
            </div>

            {/* Personalized Warm Greeting */}
            <div className="pt-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {getGreeting()}, Anita Devi
              </h1>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>You are safe here. Everything in this portal is confidential, protected, and under your control.</span>
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  setIsNotifOpen(false);
                  setIsProfileOpen(false);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition cursor-pointer min-h-[44px] shadow-xs"
                aria-label="Change language"
              >
                <span className="uppercase">{currentLang.code}</span>
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  ({currentLang.nativeName})
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white py-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    Preferred Language
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-3.5 py-2 text-xs text-left transition cursor-pointer ${
                          language === lang.code
                            ? 'font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                            : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{lang.name}</span>
                        <span className="text-[11px] text-slate-500">{lang.nativeName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Shortcut */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsLangOpen(false);
                  setIsProfileOpen(false);
                }}
                className="relative p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Care Updates</span>
                    <span className="text-[11px] text-slate-500">{unreadNotifs} unread</span>
                  </div>
                  <div className="py-2 space-y-2 max-h-60 overflow-y-auto">
                    {notifications.slice(0, 3).map(n => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
                        <span className="font-semibold text-slate-900 dark:text-white block">{n.title}</span>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px]">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Privacy Shortcut */}
            <button
              onClick={() => setActiveTab('privacy')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition cursor-pointer min-h-[44px] shadow-xs"
              title="Jump to Privacy & Rights Controls"
            >
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>My Privacy</span>
            </button>

            {/* Profile Avatar / Status */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsLangOpen(false);
                  setIsNotifOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition cursor-pointer min-h-[44px] shadow-xs"
              >
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  AD
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block leading-none">
                    Anita Devi
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Case: {victimCase.anonymizedCode}</span>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 text-xs space-y-3">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="font-bold text-slate-900 dark:text-white block">Survivor Profile</span>
                    <span className="text-slate-500 text-[11px]">Protected under Section 15A SC/ST PoA Act</span>
                  </div>
                  <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Caseworker:</span>
                      <span className="font-semibold">Dr. Priya Nair</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Legal Aid:</span>
                      <span className="font-semibold">Advocate Ramesh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">District:</span>
                      <span className="font-semibold">Kamrup Rural</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsOnboardingModalOpen(true);
                      setIsProfileOpen(false);
                    }}
                    className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition cursor-pointer"
                  >
                    Adjust Care Preferences
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs within Survivor Sanctuary */}
        <nav
          aria-label="Survivor Dashboard Sections"
          className="mt-6 pt-4 border-t border-emerald-200/60 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none"
        >
          {[
            { id: 'today', label: 'Today’s Well-Being', icon: <Heart className="w-4 h-4 text-rose-500" /> },
            { id: 'trend', label: 'My Well-Being Trend', icon: <TrendingUp className="w-4 h-4 text-emerald-600" /> },
            { id: 'checkin', label: 'Check-In Card', icon: <MessageSquare className="w-4 h-4 text-indigo-600" /> },
            { id: 'support', label: 'Your Support Options', icon: <PhoneCall className="w-4 h-4 text-sky-600" /> },
            { id: 'journey', label: 'Case Journey', icon: <Scale className="w-4 h-4 text-purple-600" /> },
            { id: 'privacy', label: 'My Privacy', icon: <Lock className="w-4 h-4 text-amber-600" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer min-h-[42px] whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-700'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-slate-800/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* =========================================================================
          MAIN AREA — SECTION 1: “TODAY”
          Display: “How are you feeling today?”
          Options: Calm, Okay, Worried, Overwhelmed, Very distressed
          Do not use judgmental wording.
          ========================================================================= */}
      {(activeTab === 'today' || activeTab === 'checkin') && (
        <section className="rounded-3xl bg-linear-to-b from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-md space-y-6">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Today’s Emotional Sanctuary</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How are you feeling today?
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              Tap the option that best reflects where you are right now. Your feelings are honored without judgment.
            </p>

            {/* 5 Non-Judgmental Emotion Options */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-4">
              {[
                {
                  id: 'Calm',
                  label: 'Calm',
                  emoji: '🕊️',
                  desc: 'Peaceful & steady',
                  score: 5,
                  bg: 'hover:border-emerald-400 dark:hover:border-emerald-500',
                },
                {
                  id: 'Okay',
                  label: 'Okay',
                  emoji: '🙂',
                  desc: 'Managing normally',
                  score: 4,
                  bg: 'hover:border-teal-400 dark:hover:border-teal-500',
                },
                {
                  id: 'Worried',
                  label: 'Worried',
                  emoji: '💭',
                  desc: 'Holding thoughts',
                  score: 3,
                  bg: 'hover:border-amber-400 dark:hover:border-amber-500',
                },
                {
                  id: 'Overwhelmed',
                  label: 'Overwhelmed',
                  emoji: '🌊',
                  desc: 'Carrying a lot',
                  score: 2,
                  bg: 'hover:border-indigo-400 dark:hover:border-indigo-500',
                },
                {
                  id: 'Very distressed',
                  label: 'Very distressed',
                  emoji: '🫂',
                  desc: 'Need gentle care',
                  score: 1,
                  bg: 'hover:border-rose-400 dark:hover:border-rose-500',
                },
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => handleQuickFeelingSelect(option.label, option.score)}
                  className={`p-5 rounded-3xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer min-h-[130px] group shadow-xs ${option.bg} ${
                    selectedFeeling === option.label
                      ? 'bg-emerald-50/90 border-emerald-500 dark:bg-emerald-950/50 dark:border-emerald-500 ring-2 ring-emerald-400/40'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md'
                  }`}
                  aria-label={`Feeling ${option.label}: ${option.desc}`}
                >
                  <span className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">
                    {option.emoji}
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {option.label}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    {option.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Empathetic Feedback Banner */}
            {todayAcknowledged && (
              <div className="mt-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs sm:text-sm font-semibold text-emerald-900 dark:text-emerald-200 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  Thank you, Anita. We recorded that you are feeling <strong>{selectedFeeling}</strong> today. Your caseworker is here if you need anything.
                </span>
              </div>
            )}

            {/* Quick Calming Grounding Exercise Trigger */}
            <div className="pt-2 flex items-center justify-center">
              <button
                onClick={() => setIsBreathingOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold hover:bg-indigo-100 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Need a quiet moment? 1-Minute Guided Breathing</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          DISTRESS TREND — “My Well-Being Trend”
          Display a longitudinal trend chart.
          Title: “My Well-Being Trend”
          Explain: “This indicator helps identify changes over time. It is not a medical diagnosis.”
          Show:
          - current indicator
          - previous trend
          - baseline comparison
          ========================================================================= */}
      {/* Longitudinal Dynamic Distress Indicator View (Phase 6 Engine) */}
      {activeTab === 'trend' && (
        <DynamicDistressDashboard
          initialScore={47}
          initialBaseline={28}
          onOpenSupportModal={() => setIsEmergencyModalOpen(true)}
        />
      )}

      {activeTab === 'today' && (
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Longitudinal Health Reflection</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                My Well-Being Trend
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1 max-w-2xl">
                This indicator helps identify changes over time. It is not a medical diagnosis.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('trend')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition cursor-pointer border border-indigo-200 dark:border-indigo-800 min-h-[40px]"
              >
                <span>View Full Dynamic Distress Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3 Metric Cards: Current Indicator, Previous Trend, Baseline Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. Current Indicator */}
            <div className="p-6 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Current Indicator
              </span>
              <div className="my-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  78 <span className="text-base text-slate-500 font-medium">/ 100</span>
                </span>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                  Steady &amp; Supported
                </p>
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">
                Logged Sep 28 via Mobile Check-In
              </span>
            </div>

            {/* 2. Previous Trend */}
            <div className="p-6 rounded-3xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                Previous Trend
              </span>
              <div className="my-3">
                <span className="text-3xl sm:text-4xl font-black text-teal-700 dark:text-teal-300">
                  +6 pts
                </span>
                <p className="text-xs font-bold text-teal-800 dark:text-teal-400 mt-1">
                  Higher stability than last week
                </p>
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">
                Reflects positive response to pre-trial prep
              </span>
            </div>

            {/* 3. Baseline Comparison */}
            <div className="p-6 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
                Baseline Comparison
              </span>
              <div className="my-3">
                <span className="text-3xl sm:text-4xl font-black text-indigo-700 dark:text-indigo-300">
                  +20 pts
                </span>
                <p className="text-xs font-bold text-indigo-800 dark:text-indigo-400 mt-1">
                  Improvement since Intake (58 pts)
                </p>
              </div>
              <span className="text-[11px] text-slate-600 dark:text-slate-400">
                Day 1 baseline established Sep 07
              </span>
            </div>
          </div>

          {/* Longitudinal Trend Chart (SVG Curve) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                4-Week Longitudinal Well-Being Progress
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Baseline: 58 · Target: Stability &gt; 70
              </span>
            </div>

            {/* Visual SVG Chart */}
            <div className="relative w-full h-56 pt-4">
              <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference baseline line */}
                <line x1="0" y1="120" x2="700" y2="120" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1" />
                <text x="10" y="115" className="text-[10px] fill-slate-400 font-semibold">Baseline (58)</text>

                {/* Shaded Area Under Curve */}
                <path
                  d="M 50 120 L 150 108 L 250 114 L 350 93 L 450 81 L 550 72 L 650 60 L 650 190 L 50 190 Z"
                  fill="url(#trendGradient)"
                />

                {/* Continuous Trend Line */}
                <path
                  d="M 50 120 L 150 108 L 250 114 L 350 93 L 450 81 L 550 72 L 650 60"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {HISTORICAL_TREND.map((pt, idx) => {
                  const x = 50 + idx * 100;
                  const y = 200 - pt.score * 1.8;
                  return (
                    <g key={pt.date}>
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        className="fill-white dark:fill-slate-900 stroke-emerald-500 stroke-[3]"
                      />
                      <text
                        x={x}
                        y={y - 12}
                        textAnchor="middle"
                        className="text-[11px] font-bold fill-slate-800 dark:fill-slate-100"
                      >
                        {pt.score}
                      </text>
                      <text
                        x={x}
                        y="185"
                        textAnchor="middle"
                        className="text-[10px] font-semibold fill-slate-500 dark:fill-slate-400"
                      >
                        {pt.date}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 italic text-center">
              Your scores reflect personal resilience and emotional balance over time. Variations are a natural part of the healing process.
            </p>
          </div>
        </section>
      )}

      {/* =========================================================================
          CHECK-IN — Large Card: “Complete Today’s Check-In”
          Include:
          - text response
          - optional voice response
          - optional mood selection
          ========================================================================= */}
      {(activeTab === 'today' || activeTab === 'checkin') && (
        <section className="rounded-3xl bg-linear-to-br from-indigo-50/90 via-white to-emerald-50/70 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border border-indigo-200 dark:border-slate-800 p-6 sm:p-10 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-1">
                <Heart className="w-4 h-4 fill-indigo-500 text-indigo-500" />
                <span>Daily Care Check-In</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Complete Today’s Check-In
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                Share what feels comfortable. You never need to recount trauma. Everything is encrypted and private.
              </p>
            </div>

            <button
              onClick={() => setIsWizardOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white dark:border-slate-700 font-bold text-xs transition cursor-pointer self-start sm:self-auto min-h-[44px] shadow-xs"
            >
              Open Step-by-Step Guided Wizard →
            </button>
          </div>

          <form onSubmit={handleSubmitCheckInCard} className="space-y-6">
            {/* 1. Optional Mood Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                1. Select Today&rsquo;s Mood
              </label>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { id: 'Calm', emoji: '🕊️' },
                  { id: 'Okay', emoji: '🙂' },
                  { id: 'Worried', emoji: '💭' },
                  { id: 'Overwhelmed', emoji: '🌊' },
                  { id: 'Very distressed', emoji: '🫂' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCheckInMood(item.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer min-h-[44px] ${
                      checkInMood === item.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Text Response */}
            <div className="space-y-2">
              <label htmlFor="checkin-notes" className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                2. How are you feeling right now? (Optional text reflection)
              </label>
              <textarea
                id="checkin-notes"
                value={checkInText}
                onChange={e => setCheckInText(e.target.value)}
                placeholder="Share anything on your mind — sleep, peace of mind, or what support you might need today. No description of past events required."
                rows={4}
                className="w-full rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            {/* 3. Optional Voice Response */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Mic className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>3. Optional Voice Note</span>
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Prefer to speak instead of type? Record a 30-second gentle voice reflection. Audio is encrypted.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {isRecordingVoice ? (
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      Recording ({recordingSeconds}s / 60s)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRecordingVoice(false);
                        setVoiceNoteRecorded(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                ) : voiceNoteRecorded ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Voice Note Attached ({recordingSeconds}s)</span>
                    <button
                      type="button"
                      onClick={() => {
                        setVoiceNoteRecorded(false);
                        setRecordingSeconds(0);
                      }}
                      className="text-slate-400 hover:text-slate-600 text-xs ml-1 underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsRecordingVoice(true);
                      setRecordingSeconds(0);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-200 border border-purple-200 dark:border-purple-800 text-xs font-bold transition cursor-pointer min-h-[44px]"
                  >
                    <Mic className="w-4 h-4 text-purple-600" />
                    <span>Start Voice Recording</span>
                  </button>
                )}
              </div>
            </div>

            {/* Submission feedback */}
            {checkInSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs sm:text-sm font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Today’s check-in has been securely saved to your care log. Thank you for taking time for yourself.</span>
              </div>
            )}

            {/* Submit Action Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-medium">
                Encrypted with AES-GCM · Never shared without consent
              </span>
              <button
                type="submit"
                disabled={checkInSubmitting}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm transition shadow-lg shadow-indigo-500/25 cursor-pointer min-h-[48px] disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{checkInSubmitting ? 'Saving...' : 'Submit Today’s Check-In'}</span>
              </button>
            </div>
          </form>
        </section>
      )}

      {/* =========================================================================
          SUPPORT — “Your Support Options”
          Include:
          - Contact counsellor
          - Request callback
          - Trusted contact
          - Helpline
          - Resources
          ========================================================================= */}
      {(activeTab === 'today' || activeTab === 'support') && (
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
              <PhoneCall className="w-4 h-4" />
              <span>Human Assistance Network</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Your Support Options
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
              Real human support is always ready to stand beside you throughout this journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Contact Counsellor */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Contact Counsellor
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong>Dr. Priya Nair</strong> is your designated welfare counsellor. Send her a direct, confidential note.
                </p>
              </div>

              <div className="space-y-2">
                {counsellorMessageSent ? (
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                    ✓ Message delivered to Dr. Priya Nair
                  </div>
                ) : (
                  <form onSubmit={handleSendCounsellorMessage} className="space-y-2">
                    <input
                      type="text"
                      value={messageToCounsellor}
                      onChange={e => setMessageToCounsellor(e.target.value)}
                      placeholder="Type a gentle note..."
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer min-h-[44px]"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* 2. Request Callback */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Request Callback
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Ask your caseworker to phone you at a time that is peaceful and safe for you.
                </p>
              </div>

              <div className="space-y-2">
                {callbackRequested ? (
                  <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 text-xs font-bold">
                    ✓ Callback requested for {callbackTime}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-1.5 text-xs">
                      {(['morning', 'afternoon', 'evening'] as const).map(time => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setCallbackTime(time)}
                          className={`flex-1 py-1 rounded-lg capitalize text-[11px] font-bold transition cursor-pointer ${
                            callbackTime === time
                              ? 'bg-sky-600 text-white'
                              : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleRequestCallback}
                      className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition cursor-pointer min-h-[44px]"
                    >
                      Request Callback
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Trusted Contact */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Trusted Contact
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong>Advocate Ramesh</strong> (Paralegal Aid) is listed as your emergency liaison.
                </p>
                <span className="text-[11px] font-mono text-slate-500 block">
                  +91-98111-22233
                </span>
              </div>

              <a
                href="tel:+919811122233"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Trusted Contact</span>
              </a>
            </div>
          </div>

          {/* Helpline Grid */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Emergency &amp; Crisis Helplines (24x7 Free &amp; Toll-Free)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { name: 'NHAA Helpline', number: '14566', color: 'emerald', role: 'Atrocity Victim Support' },
                { name: 'Tele-MANAS', number: '14416', color: 'sky', role: 'Mental Health Counsel' },
                { name: 'National Emergency', number: '112', color: 'rose', role: 'Police & Ambulance' },
                { name: 'Women Helpline', number: '181', color: 'purple', role: '24x7 Women in Distress' },
              ].map(h => (
                <a
                  key={h.number}
                  href={`tel:${h.number}`}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition flex items-center justify-between min-h-[64px] shadow-xs group"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {h.name}
                    </span>
                    <span className="text-[10px] text-slate-500">{h.role}</span>
                  </div>
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 group-hover:underline">
                    {h.number}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Support Resources &amp; Rights Walkthroughs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setActiveResourceModal('rights')}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-left border border-slate-200 dark:border-slate-750 transition cursor-pointer min-h-[72px]"
              >
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  📘 Know Your Legal Rights
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Simple explanation of Section 15A protections and witness safety.
                </span>
              </button>

              <button
                onClick={() => setActiveResourceModal('compensation')}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-left border border-slate-200 dark:border-slate-750 transition cursor-pointer min-h-[72px]"
              >
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  💰 Compensation Guidance
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Step-by-step guide to disbursal stages and immediate relief grant.
                </span>
              </button>

              <button
                onClick={() => setIsBreathingOpen(true)}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-left border border-slate-200 dark:border-slate-750 transition cursor-pointer min-h-[72px]"
              >
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  🌿 1-Minute Grounding Exercise
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Somatic breathwork designed for nervous system calming.
                </span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          CASE JOURNEY — Simplified Timeline
          Timeline:
          - Case registration
          - Investigation
          - Hearing (Current stage)
          - Rehabilitation
          - Compensation
          Do not overload survivor with legal info.
          ========================================================================= */}
      {(activeTab === 'today' || activeTab === 'journey') && (
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
              <Scale className="w-4 h-4" />
              <span>Dignity &amp; Justice Journey</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Case Journey
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
              A clear, plain-language roadmap of your justice milestones. You are never left to navigate alone.
            </p>
          </div>

          {/* Timeline Cards */}
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: 'Case Registration',
                status: 'Completed',
                date: 'Sep 02, 2026',
                desc: 'FIR and formal complaint safely recorded. Immediate protection orders enacted.',
                isDone: true,
                isCurrent: false,
              },
              {
                step: 2,
                title: 'Investigation',
                status: 'Completed',
                date: 'Sep 15, 2026',
                desc: 'Fact-finding completed with trauma-informed investigator. Statements sealed.',
                isDone: true,
                isCurrent: false,
              },
              {
                step: 3,
                title: 'Hearing & Pre-Trial Support',
                status: 'Current Stage',
                date: 'Sep 28, 2026 · Active',
                desc: 'Pre-trial prep with Dr. Priya Nair and legal advocate Ramesh. In-camera testimony requested.',
                isDone: false,
                isCurrent: true,
              },
              {
                step: 4,
                title: 'Rehabilitation & Care',
                status: 'Upcoming',
                date: 'Scheduled',
                desc: 'Long-term vocational, counseling, and social security rehabilitation services.',
                isDone: false,
                isCurrent: false,
              },
              {
                step: 5,
                title: 'Compensation Disbursement',
                status: 'Upcoming',
                date: 'Stage II Review',
                desc: 'Release of Section 15A statutory compensation direct to your secure bank account.',
                isDone: false,
                isCurrent: false,
              },
            ].map(stage => (
              <div
                key={stage.step}
                className={`p-5 sm:p-6 rounded-3xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  stage.isCurrent
                    ? 'bg-linear-to-r from-purple-50 via-indigo-50 to-white dark:from-purple-950/40 dark:via-indigo-950/30 dark:to-slate-800 border-purple-300 dark:border-purple-700 shadow-md ring-2 ring-purple-400/20'
                    : stage.isDone
                    ? 'bg-slate-50/70 dark:bg-slate-850/60 border-slate-200 dark:border-slate-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-75'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      stage.isCurrent
                        ? 'bg-purple-600 text-white shadow-md'
                        : stage.isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {stage.isDone ? <Check className="w-5 h-5" /> : stage.step}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {stage.title}
                      </h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          stage.isCurrent
                            ? 'bg-purple-600 text-white'
                            : stage.isDone
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {stage.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>
                </div>

                <div className="text-right sm:shrink-0 text-xs font-semibold text-slate-500">
                  {stage.date}
                </div>
              </div>
            ))}
          </div>

          {/* Current Stage Note */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-2.5">
            <Info className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Note on Current Hearing Stage:</strong> You do not need to memorise legal codes. Advocate Ramesh will accompany you, and Dr. Priya Nair will be present for emotional support.
            </span>
          </div>
        </section>
      )}

      {/* =========================================================================
          PRIVACY CENTER — “My Privacy”
          Show:
          - consent status
          - data sharing settings
          - communication settings
          - trusted contacts
          - access history
          ========================================================================= */}
      {(activeTab === 'today' || activeTab === 'privacy') && (
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
              <Lock className="w-4 h-4" />
              <span>Full Survivor Sovereignty</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              My Privacy
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
              You own your information. You can grant, modify, or revoke permissions at any moment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Consent Status */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Consent Status
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  Active &amp; Voluntary
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                You enrolled voluntarily in Manas Suraksha care on Sep 07, 2026. You can pause or stop monitoring at any time without affecting your legal case.
              </p>
              <button
                type="button"
                onClick={() => {
                  setLocalConsent(!localConsent);
                  updateConsent('automatedReminders', !localConsent);
                }}
                className={`w-full py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer min-h-[44px] ${
                  localConsent
                    ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {localConsent ? 'Pause Routine Monitoring' : 'Resume Routine Monitoring'}
              </button>
            </div>

            {/* 2. Data Sharing Settings */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Data Sharing Settings
              </span>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Share with Dr. Priya Nair (Caseworker)
                  </span>
                  <input
                    type="checkbox"
                    checked={localCaseworkerAccess}
                    onChange={e => setLocalCaseworkerAccess(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Optional Voice Acoustic Signals
                  </span>
                  <input
                    type="checkbox"
                    checked={localVoiceAnalysis}
                    onChange={e => {
                      setLocalVoiceAnalysis(e.target.checked);
                      updateConsent('voiceAnalysis', e.target.checked);
                    }}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-750 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Police &amp; Prosecution are strictly blocked from mental health notes.</span>
                </div>
              </div>
            </div>

            {/* 3. Communication Settings */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Communication Settings
              </span>
              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Preferred Channel:</span>
                  <span className="font-bold capitalize">{survivorOnboardingData?.preferredChannel || 'Chatbot & Mobile App'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Check-in Frequency:</span>
                  <span className="font-bold capitalize">{survivorOnboardingData?.frequency || 'Weekly (Rhythm adjusted)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Language:</span>
                  <span className="font-bold">{currentLang.name}</span>
                </div>
              </div>
              <button
                onClick={() => setIsOnboardingModalOpen(true)}
                className="w-full py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 transition cursor-pointer"
              >
                Change Communication Cadence
              </button>
            </div>

            {/* 4. Trusted Contacts */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Trusted Contacts
              </span>
              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Name:</span>
                  <span className="font-bold">Advocate Ramesh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Role:</span>
                  <span className="font-bold">Paralegal Legal Aid</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Notification Rule:</span>
                  <span className="font-bold">Explicit confirmation only</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Your contact is never messaged without your consent, except in life safety emergencies.
              </p>
            </div>
          </div>

          {/* 5. Access History (Audit Trail) */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Access History (Transparent Audit Log)
            </span>
            <div className="space-y-2">
              {[
                {
                  actor: 'Dr. Priya Nair (Welfare Counsellor)',
                  action: 'Viewed well-being trend for scheduled session',
                  time: 'Sep 27, 2026 · 14:30',
                },
                {
                  actor: 'System Automation',
                  action: 'Dispatched encrypted check-in reminder via Chatbot',
                  time: 'Sep 25, 2026 · 09:00',
                },
                {
                  actor: 'Dr. Priya Nair (Welfare Counsellor)',
                  action: 'Recorded notes on Pre-Trial Prep Session',
                  time: 'Sep 21, 2026 · 11:15',
                },
              ].map((log, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{log.actor}</span>
                    <span className="text-slate-500 mx-1.5">·</span>
                    <span className="text-slate-600 dark:text-slate-400">{log.action}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono shrink-0">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          GUIDED BREATHING EXERCISE MODAL
          ========================================================================= */}
      {isBreathingOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-6 shadow-2xl">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Gentle Somatic Pause
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Breathe With Us
              </h3>
              <p className="text-xs text-slate-500">
                Follow the circle to reset your nervous system.
              </p>
            </div>

            {/* Expanding/contracting circle */}
            <div className="py-6 flex items-center justify-center">
              <div
                className={`w-36 h-36 rounded-full flex items-center justify-center text-white font-extrabold text-base transition-all duration-1000 shadow-xl ${
                  breathPhase === 'Inhale'
                    ? 'scale-125 bg-emerald-500 shadow-emerald-500/30'
                    : breathPhase === 'Hold'
                    ? 'scale-125 bg-sky-500 shadow-sky-500/30'
                    : 'scale-90 bg-indigo-500 shadow-indigo-500/30'
                }`}
              >
                {breathPhase}
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 italic">
              {breathPhase === 'Inhale' && 'Slowly take air in through your nose...'}
              {breathPhase === 'Hold' && 'Hold gently and feel supported...'}
              {breathPhase === 'Exhale' && 'Slowly let go through your mouth...'}
            </p>

            <button
              onClick={() => setIsBreathingOpen(false)}
              className="w-full py-3 rounded-2xl bg-[#B91C1C] hover:bg-[#991B1B] dark:bg-[#EC4899] dark:hover:bg-[#DB2777] text-white font-bold text-xs transition cursor-pointer min-h-[44px] shadow-xs"
            >
              Finished &amp; Return to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          RESOURCE MODALS (Rights & Compensation)
          ========================================================================= */}
      {activeResourceModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl my-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {activeResourceModal === 'rights' ? 'Section 15A: Rights of Victims' : 'Victim Compensation Guidance'}
              </h3>
              <button
                onClick={() => setActiveResourceModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed">
              {activeResourceModal === 'rights' ? (
                <>
                  <p>
                    Under the <strong>Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Amendment Act</strong>, Section 15A guarantees you:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
                    <li>The right to be treated with dignity, respect, and fairness at every stage.</li>
                    <li>State-provided protection against intimidation, coercion, and violence.</li>
                    <li>Right to travel and maintenance allowance when attending court hearings.</li>
                    <li>Right to in-camera proceedings to protect your privacy and psychological safety.</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>
                    The <strong>Statutory Victim Relief Scheme</strong> is disbursed in phases:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
                    <li><strong>Stage 1 (Immediate):</strong> 25% upon registration of FIR (Disbursed).</li>
                    <li><strong>Stage 2 (Chargesheet):</strong> 50% upon filing of chargesheet (Under Review).</li>
                    <li><strong>Stage 3 (Conclusion):</strong> 25% upon completion of trial by Special Court.</li>
                  </ul>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                    Your welfare officer Dr. Priya Nair oversees the expedited disbursement paperwork on your behalf.
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => setActiveResourceModal(null)}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer min-h-[44px]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
