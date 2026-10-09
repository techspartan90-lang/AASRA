'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '@/lib/i18n';
import { useTranslation } from '@/hooks/use-i18n';
import { CheckInWizard } from '@/components/CheckInWizard';
import { DynamicDistressDashboard } from '@/components/DynamicDistressDashboard';
import {
  voiceComfortService,
  TRAUMA_INFORMED_MESSAGES,
  VoiceMode,
} from '@/lib/voice-comfort-service';
import {
  GlassPanel,
  LuxuryCard,
  LuxuryButton,
  GlassInput,
  GlassTextarea,
  PremiumBadge,
} from '@/components/design-system';
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
  MessageSquare,
  Mic,
  ChevronRight,
  Send,
  UserCheck,
  TrendingUp,
  Scale,
  ArrowRight,
  ChevronDown,
  Info,
  Check,
  X,
  Bell,
  Sliders,
  FileText,
  Volume2,
  VolumeX,
  Radio,
  Calendar,
  RefreshCw,
  CheckCheck,
  Wifi,
  WifiOff,
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
    consent,
    updateConsent,
    notifications,
    auditLogs,
    setIsOnboardingModalOpen,
    setIsVoiceAssistantOpen,
  } = useApp();

  const { t } = useTranslation();

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

  // Familiar Voice Comfort State
  const [isPlayingComfortVoice, setIsPlayingComfortVoice] = useState(false);
  const [comfortConfig, setComfortConfig] = useState(voiceComfortService.getConfig());

  // Check-In Reminders & Continuity State
  const [reminderFrequency, setReminderFrequency] = useState<'daily' | 'threedays' | 'weekly'>('daily');
  const [reminderChannel, setReminderChannel] = useState<'inapp' | 'sms' | 'whatsapp'>('inapp');
  const [reminderSavedNotice, setReminderSavedNotice] = useState(false);
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));

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

  // Network online/offline listener for resilient recovery
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

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
    <div className="max-w-7xl mx-auto space-y-8 py-4 sm:py-8 px-4 sm:px-6">
      {/* =========================================================================
          LUXURY HEADER & PERSONALIZED SANCTUARY GREETING
          ========================================================================= */}
      <header className="rounded-3xl bg-[#333333]/90 dark:bg-[#1E1E1E]/95 border border-[#474747]/30 dark:border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Logo & Greeting */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#474747] border border-[#FD1053]/40 flex items-center justify-center shadow-lg shadow-[#FD1053]/10">
                <ShieldCheck className="w-6 h-6 text-[#FD1053]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    MANAS SURAKSHA
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FD1053]/15 text-[#FD1053] text-[11px] font-bold border border-[#FD1053]/30">
                    Care Space
                  </span>
                </div>
                <p className="text-xs text-[#D6D6D6] font-medium">
                  Protected &amp; Confidential Survivor Care Network
                </p>
              </div>
            </div>

            {/* Personalized Warm Greeting */}
            <div className="pt-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {getGreeting()}, Anita Devi
              </h1>
              <p className="text-sm text-[#D6D6D6] font-medium flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#FD1053] shadow-[0_0_6px_#FD1053]" />
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
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#474747]/50 border border-white/10 text-xs font-semibold text-white hover:border-[#FD1053]/40 transition cursor-pointer min-h-[44px]"
                aria-label="Change language"
              >
                <span className="uppercase">{currentLang.code}</span>
                <span className="text-[#D6D6D6] font-normal">
                  ({currentLang.nativeName})
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#D6D6D6]" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#333333] py-2 shadow-2xl z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#D6D6D6] border-b border-white/10">
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
                            ? 'font-bold text-[#FD1053] bg-[#FD1053]/10'
                            : 'text-white hover:bg-[#474747]/60'
                        }`}
                      >
                        <span>{lang.name}</span>
                        <span className="text-[11px] text-[#D6D6D6]">{lang.nativeName}</span>
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
                className="relative p-2.5 rounded-2xl bg-[#474747]/50 border border-white/10 text-white hover:border-[#FD1053]/40 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5 text-white" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#FD1053] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 bg-[#333333] p-3 shadow-2xl z-50 text-white">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-bold text-white">Care Updates</span>
                    <span className="text-[11px] text-[#D6D6D6]">{unreadNotifs} unread</span>
                  </div>
                  <div className="py-2 space-y-2 max-h-60 overflow-y-auto">
                    {notifications.slice(0, 3).map(n => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-[#474747]/40 border border-white/5 text-xs space-y-1">
                        <span className="font-semibold text-white block">{n.title}</span>
                        <p className="text-[#D6D6D6] text-[11px]">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Privacy Shortcut */}
            <button
              onClick={() => setActiveTab('privacy')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#474747]/50 border border-white/10 text-xs font-semibold text-white hover:border-[#FD1053]/40 transition cursor-pointer min-h-[44px]"
              title="Jump to Privacy & Rights Controls"
            >
              <Lock className="w-4 h-4 text-[#FD1053]" />
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
                className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#474747]/50 border border-white/10 text-xs text-white hover:border-[#FD1053]/40 transition cursor-pointer min-h-[44px]"
              >
                <div className="w-7 h-7 rounded-xl bg-[#FD1053] text-white font-bold flex items-center justify-center text-xs">
                  AD
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-bold text-white block leading-none">
                    Anita Devi
                  </span>
                  <span className="text-[10px] text-[#D6D6D6] font-medium">Case: {victimCase.anonymizedCode}</span>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-[#333333] p-4 shadow-2xl z-50 text-xs space-y-3 text-white">
                  <div className="border-b border-white/10 pb-2">
                    <span className="font-bold text-white block">Survivor Profile</span>
                    <span className="text-[#D6D6D6] text-[11px]">Protected under Section 15A SC/ST PoA Act</span>
                  </div>
                  <div className="space-y-1.5 text-[#D6D6D6]">
                    <div className="flex justify-between">
                      <span className="text-[#D6D6D6]/70">Caseworker:</span>
                      <span className="font-semibold text-white">Dr. Priya Nair</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#D6D6D6]/70">Legal Aid:</span>
                      <span className="font-semibold text-white">Advocate Ramesh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#D6D6D6]/70">District:</span>
                      <span className="font-semibold text-white">Kamrup Rural</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsOnboardingModalOpen(true);
                      setIsProfileOpen(false);
                    }}
                    className="w-full py-2 rounded-xl bg-[#474747] hover:bg-[#FD1053] hover:text-white text-white font-bold text-xs transition cursor-pointer"
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
          className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none"
        >
          {[
            { id: 'today', label: 'Today’s Well-Being', icon: <Heart className="w-4 h-4 text-[#FD1053]" /> },
            { id: 'trend', label: 'My Well-Being Trend', icon: <TrendingUp className="w-4 h-4 text-emerald-400" /> },
            { id: 'checkin', label: 'Check-In Card', icon: <MessageSquare className="w-4 h-4 text-indigo-400" /> },
            { id: 'support', label: 'Your Support Options', icon: <PhoneCall className="w-4 h-4 text-sky-400" /> },
            { id: 'journey', label: 'Case Journey', icon: <Scale className="w-4 h-4 text-purple-400" /> },
            { id: 'privacy', label: 'My Privacy', icon: <Lock className="w-4 h-4 text-amber-400" /> },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer min-h-[42px] whitespace-nowrap ${
                  isActive
                    ? 'bg-[#FD1053] text-white shadow-lg shadow-[#FD1053]/25'
                    : 'bg-[#474747]/40 text-[#D6D6D6] hover:text-white hover:bg-[#474747]/80'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* =========================================================================
          SECTION 1: TODAY'S CARE SPACE & REFLECTION
          ========================================================================= */}
      {(activeTab === 'today' || activeTab === 'checkin') && (
        <GlassPanel
          title="Today’s Care Space & Reflection"
          subtitle="Tap the option that best reflects where you are right now. Your feelings are honored without judgment."
          badge={<PremiumBadge tone="stable">Daily Reflection</PremiumBadge>}
        >
          <div className="space-y-6 pt-2">
            {/* 5 Non-Judgmental Emotion Options */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {[
                {
                  id: 'Calm',
                  label: 'Calm',
                  emoji: '🕊️',
                  desc: 'Peaceful & steady',
                  score: 5,
                },
                {
                  id: 'Okay',
                  label: 'Okay',
                  emoji: '🙂',
                  desc: 'Managing normally',
                  score: 4,
                },
                {
                  id: 'Worried',
                  label: 'Worried',
                  emoji: '💭',
                  desc: 'Holding thoughts',
                  score: 3,
                },
                {
                  id: 'Overwhelmed',
                  label: 'Overwhelmed',
                  emoji: '🌊',
                  desc: 'Carrying a lot',
                  score: 2,
                },
                {
                  id: 'Very distressed',
                  label: 'Very distressed',
                  emoji: '🫂',
                  desc: 'Need gentle care',
                  score: 1,
                },
              ].map(option => {
                const isSelected = selectedFeeling === option.label;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleQuickFeelingSelect(option.label, option.score)}
                    className={`p-5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all cursor-pointer min-h-[140px] group ${
                      isSelected
                        ? 'bg-[#FD1053]/15 border-[#FD1053] shadow-lg shadow-[#FD1053]/20'
                        : 'bg-[#474747]/20 dark:bg-white/5 border-white/10 hover:border-[#FD1053]/40 hover:bg-[#474747]/40'
                    }`}
                    aria-label={`Feeling ${option.label}: ${option.desc}`}
                  >
                    <span className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">
                      {option.emoji}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {option.label}
                    </span>
                    <span className="text-xs text-[#D6D6D6] font-medium mt-1">
                      {option.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Empathetic Feedback Banner */}
            {todayAcknowledged && (
              <div className="p-4 rounded-2xl bg-[#FD1053]/15 border border-[#FD1053]/35 text-xs sm:text-sm font-semibold text-white flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#FD1053] shrink-0" />
                <span>
                  Thank you, Anita. We recorded that you are feeling <strong>{selectedFeeling}</strong> today. Your caseworker is here if you need anything.
                </span>
              </div>
            )}

            {/* Quick Calming Grounding Exercise Trigger */}
            <div className="pt-2 flex items-center justify-center">
              <button
                onClick={() => setIsBreathingOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#474747]/50 hover:bg-[#474747] text-white border border-white/10 text-xs font-semibold transition cursor-pointer min-h-[44px]"
              >
                <Sparkles className="w-4 h-4 text-[#FD1053]" />
                <span>Need a quiet moment? 1-Minute Guided Somatic Breathing</span>
              </button>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* =========================================================================
          SECTION 1B: FAMILIAR VOICE COMFORT & GROUNDING
          Consent-based trauma-informed voice experience with Web Speech & 432Hz chime
          ========================================================================= */}
      {(activeTab === 'today' || activeTab === 'checkin') && (
        <GlassPanel
          title="Familiar Voice Comfort & Grounding"
          subtitle="Consent-based calming voice companion. Listen to reassuring affirmations from a familiar, comforting tone or run a sensory grounding exercise."
          badge={
            <PremiumBadge tone="live">
              {comfortConfig.mode === 'personalized' && comfortConfig.personalizedConsent.status === 'verified_active'
                ? `Familiar: ${comfortConfig.personalizedConsent.voiceOwnerName} (${comfortConfig.personalizedConsent.relationship})`
                : comfortConfig.mode === 'curated'
                ? 'Curated Calming Voice'
                : comfortConfig.mode === 'text_only'
                ? 'Text-Only Mode'
                : 'Standard Gentle Guide'}
            </PremiumBadge>
          }
          action={
            <LuxuryButton
              variant="secondary"
              size="sm"
              onClick={() => setIsVoiceAssistantOpen(true)}
            >
              <Sliders className="w-3.5 h-3.5 mr-1 text-[#FD1053]" />
              <span>Voice & Consent Settings</span>
            </LuxuryButton>
          }
        >
          <div className="space-y-5 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Quick Play Trauma-Informed Voice Affirmation */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FD1053] flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-[#FD1053]" />
                    Reassurance & Safety
                  </span>
                  {isPlayingComfortVoice && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FD1053] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FD1053]" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#333333] dark:text-[#D6D6D6] italic mb-4">
                  &ldquo;You are safe in this moment. Take your time, breathe gently, and remember you are not alone.&rdquo;
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    if (isPlayingComfortVoice) {
                      voiceComfortService.stop();
                      setIsPlayingComfortVoice(false);
                      return;
                    }
                    setIsPlayingComfortVoice(true);
                    await voiceComfortService.speakMessage('msg_reassurance', language, () => {
                      setIsPlayingComfortVoice(false);
                    });
                  }}
                  className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isPlayingComfortVoice
                      ? 'bg-[#FD1053] text-white shadow-md shadow-[#FD1053]/30'
                      : 'bg-[#FD1053]/15 text-[#FD1053] hover:bg-[#FD1053]/25 border border-[#FD1053]/30'
                  }`}
                >
                  {isPlayingComfortVoice ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Stop Voice Comfort</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Play Reassuring Voice</span>
                    </>
                  )}
                </button>
              </div>

              {/* 432Hz Calming Ambient Harmonic Chime */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    432Hz Calming Chime
                  </span>
                  <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400">
                    Somatic Resonance
                  </span>
                </div>
                <p className="text-xs text-[#333333] dark:text-[#D6D6D6] mb-4">
                  A gentle, warm harmonic sine chord synthesized in your browser to help bring your nervous system back to baseline.
                </p>
                <button
                  type="button"
                  onClick={() => voiceComfortService.playCalmingChime()}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Ring 432Hz Chime</span>
                </button>
              </div>

              {/* Full Grounding Mode Sanctuary Trigger */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5" />
                    Interactive Grounding
                  </span>
                  <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400">
                    4-7-8 &amp; 5-4-3-2-1
                  </span>
                </div>
                <p className="text-xs text-[#333333] dark:text-[#D6D6D6] mb-4">
                  Combine 4-7-8 somatic breathing pacing with a sensory 5-4-3-2-1 checklist to de-escalate anxiety.
                </p>
                <button
                  type="button"
                  onClick={() => setIsVoiceAssistantOpen(true)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-500/25 border border-indigo-500/30 transition cursor-pointer"
                >
                  <span>Open Grounding Sanctuary</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Ethical Transparency & Consent Notice */}
            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-start gap-2.5 text-xs text-[#474747] dark:text-[#A3A3A3]">
              <Info className="w-4 h-4 text-[#FD1053] shrink-0 mt-0.5" />
              <span>
                <strong>Ethical Transparency:</strong> All voice features are strictly consent-governed under DPDPA 2023. Audio synthesis runs entirely in your browser with zero permanent voice retention. Synthetic voice comfort is an emotional support aid and never replaces professional casework or emergency services.
              </span>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* =========================================================================
          SECTION 1C: SUPPORT CONTINUITY & PERSONALIZED REMINDERS
          Personalized preferences, check-in schedules, and offline resilience
          ========================================================================= */}
      {(activeTab === 'today' || activeTab === 'support') && (
        <GlassPanel
          title="Support Continuity & Care Plan"
          subtitle="Your care journey is continuous. Manage personalized check-in reminders, caseworker contact windows, and offline data guarantees."
          badge={<PremiumBadge tone="stable">Continuity Active</PremiumBadge>}
        >
          <div className="space-y-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Personalized Check-In Reminder Preferences */}
              <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#FD1053]" />
                    <h3 className="text-sm font-bold text-[#151515] dark:text-white">
                      Check-In Reminder Schedule
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Active
                  </span>
                </div>
                <p className="text-xs text-[#474747] dark:text-[#D6D6D6]">
                  Receive a gentle, discreet nudge to record how you are feeling. Choose your preferred cadence and delivery channel.
                </p>

                {/* Cadence Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#333333] dark:text-white">
                    Reminder Frequency:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['daily', 'threedays', 'weekly'] as const).map(freq => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setReminderFrequency(freq)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition cursor-pointer border ${
                          reminderFrequency === freq
                            ? 'bg-[#FD1053]/15 text-[#FD1053] border-[#FD1053]/40'
                            : 'bg-black/5 dark:bg-white/5 text-[#474747] dark:text-[#D6D6D6] border-transparent hover:border-black/10 dark:hover:border-white/10'
                        }`}
                      >
                        {freq === 'daily' ? 'Daily Evening' : freq === 'threedays' ? 'Every 3 Days' : 'Weekly'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Channel Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#333333] dark:text-white">
                    Delivery Channel:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['inapp', 'sms', 'whatsapp'] as const).map(ch => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => setReminderChannel(ch)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center transition cursor-pointer border ${
                          reminderChannel === ch
                            ? 'bg-[#FD1053]/15 text-[#FD1053] border-[#FD1053]/40'
                            : 'bg-black/5 dark:bg-white/5 text-[#474747] dark:text-[#D6D6D6] border-transparent hover:border-black/10 dark:hover:border-white/10'
                        }`}
                      >
                        {ch === 'inapp' ? 'In-App Only' : ch === 'sms' ? 'Discreet SMS' : 'WhatsApp'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save confirmation */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setReminderSavedNotice(true);
                      setTimeout(() => setReminderSavedNotice(false), 4000);
                    }}
                    className="py-2 px-4 rounded-xl bg-[#FD1053] hover:bg-[#e00b46] text-white text-xs font-bold transition cursor-pointer shadow-xs"
                  >
                    Save Preferences
                  </button>

                  {reminderSavedNotice && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCheck className="w-3.5 h-3.5" />
                      Saved &amp; Protected
                    </span>
                  )}
                </div>
              </div>

              {/* Caseworker Continuity & Offline Resilience Status */}
              <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#FD1053]" />
                      <h3 className="text-sm font-bold text-[#151515] dark:text-white">
                        Assigned Care Team Continuity
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                      Verified
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/70 dark:bg-[#1E1E1E] border border-black/10 dark:border-white/10 space-y-1 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#151515] dark:text-white">
                        Priya Sharma, MSW
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Available
                      </span>
                    </div>
                    <p className="text-[11px] text-[#474747] dark:text-[#A3A3A3]">
                      District Social Welfare Officer · Assigned under SC/ST PoA Act §15A
                    </p>
                    <div className="pt-1 text-[11px] text-[#333333] dark:text-[#D6D6D6] font-medium">
                      Next Scheduled Interaction: <strong>Thursday, Oct 15 at 11:30 AM</strong>
                    </div>
                  </div>

                  <p className="text-xs text-[#474747] dark:text-[#A3A3A3]">
                    Your case notes and emotional trends remain confidential and accessible solely to your designated welfare officer.
                  </p>
                </div>

                {/* Offline Resilient Status Indicator */}
                <div className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
                  isOnline
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
                }`}>
                  {isOnline ? (
                    <>
                      <Wifi className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>
                        <strong>Online &amp; Synced:</strong> Encrypted channel to central welfare registry active.
                      </span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>
                        <strong>Offline Mode Active:</strong> All inputs and check-ins are secured in your device&apos;s private local vault and will automatically sync once connectivity restores.
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* =========================================================================
          SECTION 2: MY WELL-BEING TREND
          ========================================================================= */}
      {activeTab === 'trend' && (
        <DynamicDistressDashboard
          initialScore={47}
          initialBaseline={28}
          onOpenSupportModal={() => setIsEmergencyModalOpen(true)}
        />
      )}

      {activeTab === 'today' && (
        <GlassPanel
          title="My Well-Being Trend"
          subtitle="This indicator helps identify changes over time. It is not a clinical diagnosis."
          badge={<PremiumBadge tone="stable">Longitudinal Reflection</PremiumBadge>}
          action={
            <LuxuryButton
              variant="secondary"
              size="sm"
              onClick={() => setActiveTab('trend')}
            >
              <span>View Full Dynamic Distress Engine</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </LuxuryButton>
          }
        >
          <div className="space-y-6 pt-2">
            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <LuxuryCard className="p-5 flex flex-col justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D6D6D6]">
                  Current Indicator
                </span>
                <div className="my-3">
                  <span className="text-3xl sm:text-4xl font-bold text-white">
                    78 <span className="text-base text-[#D6D6D6] font-normal">/ 100</span>
                  </span>
                  <p className="text-xs font-bold text-emerald-400 mt-1">
                    Steady &amp; Supported
                  </p>
                </div>
                <span className="text-[11px] text-[#D6D6D6]/80">
                  Logged Sep 28 via Mobile Check-In
                </span>
              </LuxuryCard>

              <LuxuryCard className="p-5 flex flex-col justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D6D6D6]">
                  Previous Trend
                </span>
                <div className="my-3">
                  <span className="text-3xl sm:text-4xl font-bold text-emerald-400">
                    +6 pts
                  </span>
                  <p className="text-xs font-bold text-white mt-1">
                    Higher stability than last week
                  </p>
                </div>
                <span className="text-[11px] text-[#D6D6D6]/80">
                  Reflects positive response to pre-trial prep
                </span>
              </LuxuryCard>

              <LuxuryCard className="p-5 flex flex-col justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D6D6D6]">
                  Baseline Comparison
                </span>
                <div className="my-3">
                  <span className="text-3xl sm:text-4xl font-bold text-white">
                    +20 pts
                  </span>
                  <p className="text-xs font-bold text-[#D6D6D6] mt-1">
                    Improvement since Intake (58 pts)
                  </p>
                </div>
                <span className="text-[11px] text-[#D6D6D6]/80">
                  Day 1 baseline established Sep 07
                </span>
              </LuxuryCard>
            </div>

            {/* Longitudinal Trend Chart (SVG Curve) */}
            <div className="p-6 rounded-2xl bg-[#333333]/40 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  4-Week Longitudinal Well-Being Progress
                </h3>
                <span className="text-xs text-[#D6D6D6] font-medium">
                  Baseline: 58 · Target: Stability &gt; 70
                </span>
              </div>

              {/* Visual SVG Chart */}
              <div className="relative w-full h-56 pt-4">
                <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FD1053" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#FD1053" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal reference baseline line */}
                  <line x1="0" y1="120" x2="700" y2="120" stroke="#474747" strokeDasharray="4 4" strokeWidth="1" />
                  <text x="10" y="115" className="text-[10px] fill-[#D6D6D6] font-semibold">Baseline (58)</text>

                  {/* Shaded Area Under Curve */}
                  <path
                    d="M 50 120 L 150 108 L 250 114 L 350 93 L 450 81 L 550 72 L 650 60 L 650 190 L 50 190 Z"
                    fill="url(#trendGradient)"
                  />

                  {/* Continuous Trend Line */}
                  <path
                    d="M 50 120 L 150 108 L 250 114 L 350 93 L 450 81 L 550 72 L 650 60"
                    fill="none"
                    stroke="#FD1053"
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
                          className="fill-[#333333] stroke-[#FD1053] stroke-[3]"
                        />
                        <text
                          x={x}
                          y={y - 12}
                          textAnchor="middle"
                          className="text-[11px] font-bold fill-white"
                        >
                          {pt.score}
                        </text>
                        <text
                          x={x}
                          y="185"
                          textAnchor="middle"
                          className="text-[10px] font-semibold fill-[#D6D6D6]"
                        >
                          {pt.date}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <p className="text-xs text-[#D6D6D6] italic text-center">
                Your scores reflect personal resilience and emotional balance over time. Variations are a natural part of the healing process.
              </p>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* =========================================================================
          SECTION 3: COMPLETE TODAY'S CHECK-IN
          ========================================================================= */}
      {(activeTab === 'today' || activeTab === 'checkin') && (
        <GlassPanel
          title="Complete Today’s Check-In"
          subtitle="Share what feels comfortable. You never need to recount trauma. Everything is encrypted and private."
          badge={<PremiumBadge tone="stable">Daily Reflection</PremiumBadge>}
          action={
            <LuxuryButton
              variant="secondary"
              size="sm"
              onClick={() => setIsWizardOpen(true)}
            >
              <span>Guided Wizard</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </LuxuryButton>
          }
        >
          <form onSubmit={handleSubmitCheckInCard} className="space-y-6 pt-2">
            {/* 1. Mood Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#D6D6D6] block">
                1. Select Current State
              </label>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { id: 'Calm', emoji: '🕊️' },
                  { id: 'Okay', emoji: '🙂' },
                  { id: 'Worried', emoji: '💭' },
                  { id: 'Overwhelmed', emoji: '🌊' },
                  { id: 'Very distressed', emoji: '🫂' },
                ].map(item => {
                  const isSelected = checkInMood === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCheckInMood(item.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer min-h-[44px] ${
                        isSelected
                          ? 'bg-[#FD1053] text-white shadow-md shadow-[#FD1053]/25'
                          : 'bg-[#474747]/40 text-[#D6D6D6] border border-white/10 hover:text-white hover:bg-[#474747]'
                      }`}
                    >
                      <span>{item.emoji}</span>
                      <span>{item.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Text Response */}
            <div className="space-y-2">
              <label htmlFor="checkin-notes" className="text-xs font-bold uppercase tracking-wider text-[#D6D6D6] block">
                2. How are you feeling right now? (Optional text reflection)
              </label>
              <GlassTextarea
                id="checkin-notes"
                value={checkInText}
                onChange={e => setCheckInText(e.target.value)}
                placeholder="Share anything on your mind — sleep, peace of mind, or what support you might need today. No description of past events required."
                rows={4}
              />
            </div>

            {/* 3. Optional Voice Response */}
            <div className="p-4 rounded-2xl bg-[#474747]/30 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Mic className="w-4 h-4 text-[#FD1053]" />
                  <span>3. Optional Voice Note (Encrypted)</span>
                </span>
                <p className="text-[11px] text-[#D6D6D6]">
                  Prefer to speak instead of type? Record a 30-second gentle voice reflection. Audio is encrypted with AES-256.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {isRecordingVoice ? (
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FD1053] animate-ping" />
                    <span className="text-xs font-bold text-[#FD1053]">
                      Recording ({recordingSeconds}s / 60s)
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRecordingVoice(false);
                        setVoiceNoteRecorded(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#FD1053] text-white font-bold text-xs hover:bg-[#FD1053]/90 transition cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                ) : voiceNoteRecorded ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Voice Note Attached ({recordingSeconds}s)</span>
                    <button
                      type="button"
                      onClick={() => {
                        setVoiceNoteRecorded(false);
                        setRecordingSeconds(0);
                      }}
                      className="text-[#D6D6D6] hover:text-white text-xs ml-1 underline cursor-pointer"
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
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#474747]/60 hover:bg-[#474747] text-white border border-white/10 text-xs font-semibold transition cursor-pointer min-h-[44px]"
                  >
                    <Mic className="w-4 h-4 text-[#FD1053]" />
                    <span>Start Voice Recording</span>
                  </button>
                )}
              </div>
            </div>

            {/* Submission feedback */}
            {checkInSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-xs sm:text-sm font-semibold text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Today’s check-in has been securely saved to your care log. Thank you for taking time for yourself.</span>
              </div>
            )}

            {/* Submit Action Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#D6D6D6] font-medium">
                Encrypted with AES-GCM · Never shared without consent
              </span>
              <LuxuryButton
                type="submit"
                variant="primary"
                disabled={checkInSubmitting}
                isLoading={checkInSubmitting}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Submit Today’s Check-In
              </LuxuryButton>
            </div>
          </form>
        </GlassPanel>
      )}

      {/* =========================================================================
          SECTION 4: YOUR SUPPORT OPTIONS
          ========================================================================= */}
      {(activeTab === 'today' || activeTab === 'support') && (
        <GlassPanel
          title="Your Support Options"
          subtitle="Real human support is always ready to stand beside you throughout this journey."
          badge={<PremiumBadge tone="stable">Human Care Network</PremiumBadge>}
        >
          <div className="space-y-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* 1. Contact Counsellor */}
              <LuxuryCard className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#FD1053]/15 text-[#FD1053] flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Contact Counsellor
                  </h3>
                  <p className="text-xs text-[#D6D6D6] leading-relaxed">
                    <strong>Dr. Priya Nair</strong> is your designated welfare counsellor. Send her a direct, confidential note.
                  </p>
                </div>

                <div className="space-y-2">
                  {counsellorMessageSent ? (
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                      ✓ Message delivered to Dr. Priya Nair
                    </div>
                  ) : (
                    <form onSubmit={handleSendCounsellorMessage} className="space-y-2">
                      <GlassInput
                        type="text"
                        value={messageToCounsellor}
                        onChange={e => setMessageToCounsellor(e.target.value)}
                        placeholder="Type a gentle note..."
                      />
                      <LuxuryButton
                        type="submit"
                        variant="primary"
                        size="sm"
                        className="w-full"
                      >
                        Send Message
                      </LuxuryButton>
                    </form>
                  )}
                </div>
              </LuxuryCard>

              {/* 2. Request Callback */}
              <LuxuryCard className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/15 text-sky-400 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Request Callback
                  </h3>
                  <p className="text-xs text-[#D6D6D6] leading-relaxed">
                    Ask your caseworker to phone you at a time that is peaceful and safe for you.
                  </p>
                </div>

                <div className="space-y-2">
                  {callbackRequested ? (
                    <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-300 text-xs font-bold border border-sky-500/30">
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
                            className={`flex-1 py-1.5 rounded-xl capitalize text-[11px] font-bold transition cursor-pointer min-h-[38px] ${
                              callbackTime === time
                                ? 'bg-[#FD1053] text-white shadow-xs'
                                : 'bg-[#474747]/40 text-[#D6D6D6] hover:bg-[#474747]'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                      <LuxuryButton
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleRequestCallback}
                        className="w-full"
                      >
                        Request Callback
                      </LuxuryButton>
                    </div>
                  )}
                </div>
              </LuxuryCard>

              {/* 3. Trusted Contact */}
              <LuxuryCard className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Trusted Contact
                  </h3>
                  <p className="text-xs text-[#D6D6D6] leading-relaxed">
                    <strong>Advocate Ramesh</strong> (Paralegal Aid) is listed as your emergency liaison.
                  </p>
                  <span className="text-[11px] font-mono text-[#D6D6D6] block">
                    +91-98111-22233
                  </span>
                </div>

                <a
                  href="tel:+919811122233"
                  className="w-full py-2.5 rounded-2xl bg-[#474747] hover:bg-[#FD1053] text-white font-bold text-xs transition cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Trusted Contact</span>
                </a>
              </LuxuryCard>
            </div>

            {/* Helpline Grid */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D6D6D6]">
                Emergency &amp; Crisis Helplines (24x7 Free &amp; Toll-Free)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { name: 'NHAA Helpline', number: '14566', role: 'Atrocity Victim Support' },
                  { name: 'Tele-MANAS', number: '14416', role: 'Mental Health Counsel' },
                  { name: 'National Emergency', number: '112', role: 'Police & Ambulance' },
                  { name: 'Women Helpline', number: '181', role: '24x7 Women in Distress' },
                ].map(h => (
                  <a
                    key={h.number}
                    href={`tel:${h.number}`}
                    className="p-4 rounded-2xl bg-[#474747]/30 border border-white/10 hover:border-[#FD1053]/40 transition flex items-center justify-between min-h-[64px] group"
                  >
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {h.name}
                      </span>
                      <span className="text-[10px] text-[#D6D6D6]">{h.role}</span>
                    </div>
                    <span className="text-sm font-bold text-[#FD1053] group-hover:underline">
                      {h.number}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D6D6D6]">
                Support Resources &amp; Rights Walkthroughs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setActiveResourceModal('rights')}
                  className="p-4 rounded-2xl bg-[#474747]/30 hover:bg-[#474747]/60 text-left border border-white/10 transition cursor-pointer min-h-[72px]"
                >
                  <span className="text-xs font-bold text-white block">
                    📘 Know Your Legal Rights
                  </span>
                  <span className="text-[11px] text-[#D6D6D6] mt-1 block">
                    Simple explanation of Section 15A protections and witness safety.
                  </span>
                </button>

                <button
                  onClick={() => setActiveResourceModal('compensation')}
                  className="p-4 rounded-2xl bg-[#474747]/30 hover:bg-[#474747]/60 text-left border border-white/10 transition cursor-pointer min-h-[72px]"
                >
                  <span className="text-xs font-bold text-white block">
                    💰 Compensation Guidance
                  </span>
                  <span className="text-[11px] text-[#D6D6D6] mt-1 block">
                    Step-by-step guide to disbursal stages and immediate relief grant.
                  </span>
                </button>

                <button
                  onClick={() => setIsBreathingOpen(true)}
                  className="p-4 rounded-2xl bg-[#474747]/30 hover:bg-[#474747]/60 text-left border border-white/10 transition cursor-pointer min-h-[72px]"
                >
                  <span className="text-xs font-bold text-white block">
                    🌿 1-Minute Grounding Exercise
                  </span>
                  <span className="text-[11px] text-[#D6D6D6] mt-1 block">
                    Somatic breathwork designed for nervous system calming.
                  </span>
                </button>
              </div>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* =========================================================================
          SECTION 5: CASE JOURNEY TIMELINE
          ========================================================================= */}
      {(activeTab === 'today' || activeTab === 'journey') && (
        <GlassPanel
          title="Case Journey"
          subtitle="A clear, plain-language roadmap of your justice milestones. You are never left to navigate alone."
          badge={<PremiumBadge tone="stable">Justice Milestone Track</PremiumBadge>}
        >
          <div className="space-y-4 pt-2">
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
                className={`p-5 sm:p-6 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  stage.isCurrent
                    ? 'bg-[#FD1053]/10 border-[#FD1053] shadow-lg shadow-[#FD1053]/15'
                    : stage.isDone
                    ? 'bg-[#474747]/30 border-white/10'
                    : 'bg-[#333333]/30 border-white/5 opacity-70'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      stage.isCurrent
                        ? 'bg-[#FD1053] text-white shadow-md shadow-[#FD1053]/30'
                        : stage.isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[#474747] text-[#D6D6D6]'
                    }`}
                  >
                    {stage.isDone ? <Check className="w-5 h-5" /> : stage.step}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        {stage.title}
                      </h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          stage.isCurrent
                            ? 'bg-[#FD1053] text-white'
                            : stage.isDone
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-[#474747] text-[#D6D6D6]'
                        }`}
                      >
                        {stage.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#D6D6D6] font-medium mt-1 leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>
                </div>

                <div className="text-right sm:shrink-0 text-xs font-semibold text-[#D6D6D6]">
                  {stage.date}
                </div>
              </div>
            ))}

            {/* Current Stage Note */}
            <div className="p-4 rounded-2xl bg-[#474747]/30 border border-white/10 text-xs text-[#D6D6D6] flex items-center gap-2.5">
              <Info className="w-4 h-4 text-[#FD1053] shrink-0" />
              <span>
                <strong className="text-white">Note on Current Hearing Stage:</strong> You do not need to memorise legal codes. Advocate Ramesh will accompany you, and Dr. Priya Nair will be present for emotional support.
              </span>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* =========================================================================
          SECTION 6: PRIVACY & DATA SOVEREIGNTY
          ========================================================================= */}
      {(activeTab === 'today' || activeTab === 'privacy') && (
        <GlassPanel
          title="My Privacy & Data Sovereignty"
          subtitle="Under the Digital Personal Data Protection (DPDPA) Act 2023, you hold absolute sovereignty over your records."
          badge={<PremiumBadge tone="stable">DPDPA 2023 Compliant</PremiumBadge>}
        >
          <div className="space-y-5 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <LuxuryCard className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Automated Check-In Reminders</span>
                  <input
                    type="checkbox"
                    checked={localConsent}
                    onChange={e => {
                      setLocalConsent(e.target.checked);
                      updateConsent('automatedReminders', e.target.checked);
                    }}
                    className="w-4 h-4 accent-[#FD1053] cursor-pointer"
                  />
                </div>
                <p className="text-xs text-[#D6D6D6]">
                  Receive calm WhatsApp/SMS reminders to record your daily check-in.
                </p>
              </LuxuryCard>

              <LuxuryCard className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Voice Telemetry Analysis</span>
                  <input
                    type="checkbox"
                    checked={localVoiceAnalysis}
                    onChange={e => {
                      setLocalVoiceAnalysis(e.target.checked);
                      updateConsent('voiceAnalysis', e.target.checked);
                    }}
                    className="w-4 h-4 accent-[#FD1053] cursor-pointer"
                  />
                </div>
                <p className="text-xs text-[#D6D6D6]">
                  Allow acoustic cadence screening to detect acoustic distress markers.
                </p>
              </LuxuryCard>

              <LuxuryCard className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Caseworker Shared Access</span>
                  <input
                    type="checkbox"
                    checked={localCaseworkerAccess}
                    onChange={e => setLocalCaseworkerAccess(e.target.checked)}
                    className="w-4 h-4 accent-[#FD1053] cursor-pointer"
                  />
                </div>
                <p className="text-xs text-[#D6D6D6]">
                  Allow Dr. Priya Nair to view longitudinal wellness charts for triage.
                </p>
              </LuxuryCard>
            </div>

            <div className="p-4 rounded-2xl bg-[#333333]/50 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#D6D6D6]">
                <Lock className="w-4 h-4 text-[#FD1053]" />
                <span>Need to erase all telemetry data? Exercise Right to Forgotten Data at any time.</span>
              </div>
              <LuxuryButton
                variant="ghost"
                size="sm"
                onClick={() => alert('Consent sovereignty request lodged with Data Protection Officer (DPO).')}
              >
                Revoke Consent &amp; Purge Data
              </LuxuryButton>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* =========================================================================
          GUIDED BREATHING EXERCISE MODAL
          ========================================================================= */}
      {isBreathingOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="w-full max-w-md rounded-3xl bg-[#333333] border border-white/10 p-6 sm:p-8 text-center space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FD1053]">
                Guided Somatic Regulation
              </span>
              <button
                onClick={() => setIsBreathingOpen(false)}
                className="p-1 rounded-xl text-[#D6D6D6] hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">
                4-4-4 Grounding Breath
              </h3>
              <p className="text-xs text-[#D6D6D6]">
                Follow the gentle pulsing ring to regulate your nervous system.
              </p>
            </div>

            {/* Glowing Breathing Circle with Pulse */}
            <div className="py-8 flex items-center justify-center">
              <div
                className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-3000 ease-in-out ${
                  breathPhase === 'Inhale'
                    ? 'scale-125 border-[#FD1053] bg-[#FD1053]/15 shadow-[0_0_30px_#FD1053]'
                    : breathPhase === 'Hold'
                    ? 'scale-125 border-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                    : 'scale-90 border-[#474747] bg-[#474747]/40 shadow-none'
                }`}
              >
                <span className="text-base font-black text-white">
                  {breathPhase}
                </span>
                <span className="text-[10px] text-[#D6D6D6] mt-0.5">
                  {breathPhase === 'Inhale' ? 'Breathe in peace' : breathPhase === 'Hold' ? 'Hold gently' : 'Release tension'}
                </span>
              </div>
            </div>

            <LuxuryButton
              variant="secondary"
              onClick={() => setIsBreathingOpen(false)}
              className="w-full"
            >
              Finish Exercise
            </LuxuryButton>
          </div>
        </div>
      )}

      {/* =========================================================================
          RESOURCE MODALS
          ========================================================================= */}
      {activeResourceModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="w-full max-w-lg rounded-3xl bg-[#333333] border border-white/10 p-6 sm:p-8 space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">
                {activeResourceModal === 'rights' ? 'Know Your Legal Rights (Section 15A)' : 'Compensation Disbursal Guidance'}
              </h3>
              <button
                onClick={() => setActiveResourceModal(null)}
                className="p-1 rounded-xl text-[#D6D6D6] hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-[#D6D6D6] leading-relaxed space-y-3 max-h-72 overflow-y-auto">
              {activeResourceModal === 'rights' ? (
                <>
                  <p>
                    Under <strong>Section 15A of the SC/ST (Prevention of Atrocities) Act</strong>, as a survivor or witness you have unequivocal entitlements:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Complete protection against intimidation, retaliation, or coercion.</li>
                    <li>Right to free legal aid through District Legal Services Authority (DLSA).</li>
                    <li>Right to travel and maintenance allowance during court attendance.</li>
                    <li>In-camera proceedings upon request to ensure privacy and dignity.</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>
                    Statutory financial relief is disbursed in stages to support recovery without delay:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Stage 1 (Immediate Relief):</strong> 25% credited within 7 days of FIR registration.</li>
                    <li><strong>Stage 2 (Chargesheet Filed):</strong> 50% released following the submission of formal investigation.</li>
                    <li><strong>Stage 3 (Judicial Conclusion):</strong> Remaining 25% upon completion of trial proceedings.</li>
                  </ul>
                </>
              )}
            </div>

            <LuxuryButton
              variant="primary"
              size="sm"
              onClick={() => setActiveResourceModal(null)}
              className="w-full"
            >
              Close Guide
            </LuxuryButton>
          </div>
        </div>
      )}
    </div>
  );
}
