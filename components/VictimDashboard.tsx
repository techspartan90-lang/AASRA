'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { TRANSLATIONS } from '@/lib/i18n';
import { CheckInWizard } from '@/components/CheckInWizard';
import {
  Heart,
  Calendar,
  PhoneCall,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Mic,
  ChevronRight,
  Send,
  UserCheck,
} from 'lucide-react';

export function VictimDashboard() {
  const {
    cases,
    selectedCaseId,
    language,
    submitVictimCheckIn,
    setIsEmergencyModalOpen,
    setIsVoiceAssistantOpen,
  } = useApp();

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Active victim case (CASE-002 or selectedCaseId)
  const victimCase = cases.find(c => c.id === selectedCaseId) || cases.find(c => c.id === 'CASE-002') || cases[0];

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [quickNote, setQuickNote] = useState('');
  const [quickMood, setQuickMood] = useState<number | null>(null);
  const [quickSubmitted, setQuickSubmitted] = useState(false);
  const [assistanceRequested, setAssistanceRequested] = useState(false);

  const handleQuickMoodClick = async (score: number) => {
    setQuickMood(score);
    if (score <= 2) {
      // If struggling or very distressed, prompt to open full wizard or submit immediately
      setIsWizardOpen(true);
    } else {
      await submitVictimCheckIn({
        feelingScore: score,
        safetyScore: 4,
        sleepScore: 4,
        fearScore: 2,
        avoidanceScore: 1,
        requestHelp: false,
        notes: 'Quick daily mood check-in',
      }, victimCase.id);
      setQuickSubmitted(true);
      setTimeout(() => setQuickSubmitted(false), 5000);
    }
  };

  const handleRequestAssistance = (type: string) => {
    setAssistanceRequested(true);
    setTimeout(() => setAssistanceRequested(false), 6000);
  };

  if (isWizardOpen) {
    return (
      <div className="py-6 sm:py-10">
        <CheckInWizard
          onComplete={result => {
            setIsWizardOpen(false);
          }}
          onCancel={() => setIsWizardOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 sm:py-10 px-4">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Safe Portal · Case {victimCase.anonymizedCode}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-0.5">
            {t.yourWellBeing}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
            This space is completely private. Only your assigned caseworker and support professionals have access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsVoiceAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold hover:bg-purple-100 transition min-h-[44px] cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Assistant</span>
          </button>

          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold hover:bg-rose-100 transition min-h-[44px] cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Helpline</span>
          </button>
        </div>
      </div>

      {/* Primary Card: "How are you feeling today?" */}
      <div className="rounded-3xl bg-linear-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-850 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-lg">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
            <span>Daily Care Pulse</span>
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t.howAreYouToday}
          </h2>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
            Select the option that best reflects your feelings right now. You can also share details through voice or text.
          </p>

          {/* 5 Accessible Emotion Options - Responsive: 2 on mobile, 3-2 on tablet, 5 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4">
            {[
              { score: 5, label: t.doingWell, emoji: '😊', desc: 'Feeling balanced' },
              { score: 4, label: t.okay, emoji: '🙂', desc: 'Managing okay' },
              { score: 3, label: t.notSure, emoji: '😐', desc: 'Uncertain' },
              { score: 2, label: t.struggling, emoji: '😟', desc: 'Heavy thoughts' },
              { score: 1, label: t.veryDistressed, emoji: '😣', desc: 'Need support' },
            ].map(item => (
              <button
                key={item.score}
                type="button"
                onClick={() => handleQuickMoodClick(item.score)}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 hover:border-emerald-500 hover:shadow-md transition text-center flex flex-col items-center justify-center cursor-pointer min-h-[110px] group"
              >
                <span className="text-3xl mb-1.5 group-hover:scale-110 transition-transform">
                  {item.emoji}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.label}
                </span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">{item.desc}</span>
              </button>
            ))}
          </div>

          {quickSubmitted && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Thank you. Your daily mood was safely recorded.</span>
            </div>
          )}

          {/* "Tell us more" prompt */}
          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Want to complete the full 7-step check-in or share a voice message?
            </span>
            <button
              onClick={() => setIsWizardOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold transition cursor-pointer min-h-[44px]"
            >
              <span>{t.tellUsMore}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Status Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Check-in status */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            <span>{t.currentCheckInStatus}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white">
            Up to Date
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
            Last logged: {victimCase.lastCheckInDate}
          </p>
        </div>

        {/* Next check-in */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            <span>{t.nextCheckIn}</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white">
            {victimCase.nextFollowUpDate}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
            Routine 3-day well-being pulse
          </p>
        </div>

        {/* Support contact */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            <span>{t.supportContact}</span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {victimCase.assignedCounsellor.split(' (')[0]}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
            Assigned Welfare Counsellor
          </p>
        </div>

        {/* Upcoming Appointment */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            <span>{t.upcomingAppointment}</span>
            <Calendar className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            Sep 28 · 11:00 AM
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
            Pre-Trial Support Session (Tele)
          </p>
        </div>
      </div>

      {/* Gentle Assistance Request Drawer */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Need Something From Your Support Team?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              One tap informs your caseworker directly without having to make a phone call yourself.
            </p>
          </div>
          {assistanceRequested && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
              ✓ Request sent to caseworker
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => handleRequestAssistance('urgent_callback')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-emerald-500 transition cursor-pointer min-h-[44px]"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
            <span>Request a Callback Today</span>
          </button>

          <button
            onClick={() => handleRequestAssistance('trial_escort')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-emerald-500 transition cursor-pointer min-h-[44px]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
            <span>Court Escort / Protection Question</span>
          </button>

          <button
            onClick={() => handleRequestAssistance('welfare_status')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-emerald-500 transition cursor-pointer min-h-[44px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Check Compensation / Grant Status</span>
          </button>
        </div>
      </div>
    </div>
  );
}
