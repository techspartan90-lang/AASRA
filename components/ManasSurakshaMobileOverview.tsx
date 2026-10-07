'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/store';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Heart,
  Mic,
  Activity,
  ArrowRight,
  TrendingUp,
  Moon,
  AlertTriangle,
  CheckCircle2,
  Lock,
  PhoneCall,
  Sparkles,
  Zap,
  Phone,
  HelpCircle,
  Wind,
  Eye,
  LogOut,
  X,
} from 'lucide-react';

interface ManasSurakshaMobileOverviewProps {
  onNavigate?: (view: string) => void;
  onOpenCheckIn?: () => void;
  onOpenTrajectory?: () => void;
  className?: string;
}

type MoodOption = {
  id: string;
  label: string;
  emoji: string;
  distressLevel: number;
};

const MOOD_OPTIONS: MoodOption[] = [
  { id: 'well', label: 'Well', emoji: '🌱', distressLevel: 20 },
  { id: 'okay', label: 'Okay', emoji: '☁️', distressLevel: 40 },
  { id: 'stressed', label: 'Stressed', emoji: '🌧️', distressLevel: 65 },
  { id: 'struggling', label: 'Struggling', emoji: '⚡', distressLevel: 80 },
  { id: 'heavy', label: 'Heavy', emoji: '🌊', distressLevel: 92 },
];

export function ManasSurakshaMobileOverview({
  onNavigate,
  onOpenCheckIn,
  onOpenTrajectory,
  className = '',
}: ManasSurakshaMobileOverviewProps) {
  const {
    currentUser,
    survivorOnboardingData,
    setIsEmergencyModalOpen,
    setIsVoiceAssistantOpen,
    resetDemoData,
    cases,
    selectedCaseId,
  } = useApp();

  const [selectedMood, setSelectedMood] = useState<string>('stressed');
  const [activeTab, setActiveTab] = useState<'overview' | 'daily-pulse' | 'trajectory-insights' | 'survivor-vault' | 'support-hotline'>('overview');
  const [activeExercise, setActiveExercise] = useState<'sensory' | 'breath' | null>(null);
  const [breathPhase, setBreathPhase] = useState<'Inhale (4s)' | 'Hold (7s)' | 'Exhale (8s)'>('Inhale (4s)');
  const [breathTimer, setBreathTimer] = useState<number>(4);

  // Track double ESC press for discreet emergency exit
  const lastEscPressRef = useRef<number>(0);

  const handleQuickExit = () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
        window.location.replace('https://weather.com');
      }
    } catch {
      window.location.href = 'https://weather.com';
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const now = Date.now();
        if (now - lastEscPressRef.current < 1000) {
          handleQuickExit();
        }
        lastEscPressRef.current = now;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simple breathing timer when breathing exercise is active
  useEffect(() => {
    if (activeExercise !== 'breath') return;
    const interval = setInterval(() => {
      setBreathTimer(prev => {
        if (prev <= 1) {
          if (breathPhase.startsWith('Inhale')) {
            setBreathPhase('Hold (7s)');
            return 7;
          } else if (breathPhase.startsWith('Hold')) {
            setBreathPhase('Exhale (8s)');
            return 8;
          } else {
            setBreathPhase('Inhale (4s)');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeExercise, breathPhase]);

  const activeCase =
    cases.find(c => c.id === selectedCaseId) ||
    cases.find(c => c.id === 'CASE-002') ||
    cases[0];

  const userName =
    (currentUser?.name && currentUser.name !== 'Demo User' ? currentUser.name.split(' ')[0] : '') ||
    'Ananya';

  const distressScore = activeCase ? Math.round(activeCase.currentScore) : 71;

  const handleTabClick = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    if (onNavigate) {
      if (tabId === 'overview') onNavigate('dashboard');
      else if (tabId === 'daily-pulse') onNavigate('checkin_wizard');
      else if (tabId === 'trajectory-insights') onNavigate('distress_score');
      else if (tabId === 'survivor-vault') onNavigate('privacy');
      else if (tabId === 'support-hotline') onNavigate('support');
    }
  };

  return (
    <div className={`relative w-full max-w-md mx-auto bg-[#131313] text-[#e5e2e1] font-sans min-h-screen selection:bg-[#ff506c] selection:text-white pb-28 ${className}`}>
      {/* =========================================================================
          TOP APP HEADER
         ========================================================================= */}
      <header className="sticky top-0 w-full z-40 pt-safe bg-[#131313]/90 backdrop-blur-xl border-b border-white/5 shadow-[0_1px_8px_rgba(0,0,0,0.35)]">
        <div className="h-16 px-4 flex items-center justify-between gap-2">
          {/* Brand Logo & Meta */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative flex items-center justify-center shrink-0 w-11 h-11">
              <div className="w-9 h-9 rounded-full bg-[#2a2a2a] flex items-center justify-center overflow-hidden border border-white/10">
                <Shield className="w-5 h-5 text-[#ffb2b7]" />
              </div>
              <span
                className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-[#10b981] ring-2 ring-[#131313]"
                title="24/7 Helpline Active"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[17px] tracking-tight text-[#e5e2e1] truncate font-['Manrope']">
                  MANAS SURAKSHA
                </span>
                <span className="bg-[#353535] text-[#c8c6c6] text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                  GOV CARE
                </span>
              </div>
              <span className="text-[12px] text-[#c8c6c6] truncate">Overview</span>
            </div>
          </div>

          {/* Discreet Quick Exit & Profile */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleQuickExit}
              aria-label="Quick Discreet Exit"
              className="min-h-[40px] px-3.5 flex items-center justify-center gap-1.5 rounded-full bg-[#202020] text-[#e5e2e1] hover:bg-[#2a2a2a] active:scale-95 transition-all border border-white/10 cursor-pointer shadow-sm group"
            >
              <Zap className="w-3.5 h-3.5 text-[#ff506c] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#ffdadb]">EXIT</span>
            </button>
            <div className="w-9 h-9 rounded-full ring-1 ring-white/15 overflow-hidden shrink-0 bg-[#2a2a2a] flex items-center justify-center">
              <span className="text-xs font-semibold text-[#ffb2b7]">{userName.charAt(0)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN CONTAINER
         ========================================================================= */}
      <main className="flex flex-col w-full px-4 pt-4 space-y-4">
        {/* Subtle User Greeting & Privacy Pill Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-[24px] text-[#e5e2e1] font-['Manrope'] tracking-tight">
                Hello, {userName}
              </h1>
              <span className="inline-block w-2 h-2 rounded-full bg-[#ffb2b7] animate-pulse" title="Secure Channel Active" />
            </div>
            <span className="text-[12px] text-[#c8c6c6]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })} • Protected Session
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#202020] px-2.5 py-1 rounded-full border border-white/5 shadow-sm">
            <Lock className="w-3.5 h-3.5 text-[#ffb2b7]" />
            <span className="text-[10px] font-medium text-[#b6b5b4] tracking-wider uppercase">Zero-Log Mode</span>
          </div>
        </div>

        {/* 1. 3D Protective Well-Being Orb Card */}
        <div className="relative overflow-hidden rounded-2xl bg-[#202020] p-4 border border-white/5 shadow-lg">
          {/* Subtle Ambient Glow Overlay */}
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#ff506c]/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Concentric Radial Ripples Graphic */}
            <div className="relative w-36 h-36 flex items-center justify-center my-1">
              <div
                className="absolute inset-0 rounded-full bg-[#2a2a2a]/40 animate-ping opacity-20 pointer-events-none"
                style={{ animationDuration: '4s' }}
              />
              <div className="absolute inset-2 rounded-full bg-[#353535]/60 flex items-center justify-center shadow-inner">
                <div className="absolute inset-3 rounded-full bg-[#1b1b1c]/90" />
              </div>

              {/* SVG Ring and Shield Clock Hybrid Graphic */}
              <svg className="relative w-28 h-28 text-[#ffb2b7] z-10" fill="none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" stroke="currentColor" strokeDasharray="3 3" strokeOpacity="0.25" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="34" stroke="currentColor" strokeOpacity="0.15" strokeWidth="4" />
                <path
                  d="M50 24C62 24 66 31 66 45C66 62 50 74 50 74C50 74 34 62 34 45C34 31 38 24 50 24Z"
                  fill="#202020"
                  stroke="currentColor"
                  strokeOpacity="0.4"
                  strokeWidth="2"
                />
                <circle cx="50" cy="50" fill="#ff506c" r="6" />
                <line stroke="#ff506c" strokeLinecap="round" strokeWidth="3" x1="50" x2="50" y1="50" y2="30" />
                <line stroke="#ff506c" strokeLinecap="round" strokeWidth="3" x1="50" x2="65" y1="50" y2="60" />
              </svg>

              {/* Status Micro-badge */}
              <div className="absolute -bottom-1 bg-[#353535]/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff506c]" />
                <span className="text-[11px] font-medium text-[#e5e2e1]">Baseline Monitored</span>
              </div>
            </div>

            {/* Orb State Narrative */}
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className="text-[17px] font-semibold text-[#e5e2e1] font-['Manrope']">
                  Shield Baseline: Guarded
                </span>
              </div>
              <p className="text-[12px] text-[#c8c6c6]">
                Last screened: Today at 08:30 AM • No acute breaches detected
              </p>
            </div>

            {/* Trauma-Informed Principle Indicator */}
            <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2a2a2a]/80 text-[#c8c6c6] border border-white/5">
              <Sparkles className="w-3.5 h-3.5 text-[#ffb2b7]" />
              <span className="text-[11px] uppercase tracking-wider text-[#b6b5b4] font-medium">
                AI assists. Humans decide.
              </span>
            </div>
          </div>
        </div>

        {/* 2. Daily Pulse Check-In Prominent Card */}
        <div className="rounded-2xl bg-[#202020] p-4 border border-white/5 shadow-lg space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-[#ffb2b7] border border-white/5">
                <Heart className="w-4 h-4 fill-[#ffb2b7]/20" />
              </span>
              <div className="flex flex-col">
                <h2 className="text-[16px] font-semibold text-[#e5e2e1] font-['Manrope']">Daily Pulse Check-In</h2>
                <span className="text-[12px] text-[#c8c6c6]">A quiet moment to register your internal state</span>
              </div>
            </div>
            <span className="bg-[#353535] px-2 py-0.5 rounded text-[11px] font-medium text-[#b6b5b4]">
              #Day 18
            </span>
          </div>

          {/* Trauma-Calibrated Mood Options */}
          <div className="space-y-1.5">
            <span className="text-[12px] font-medium text-[#c8c6c6]">How are you feeling right now?</span>
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {MOOD_OPTIONS.map(mood => {
                const isSelected = selectedMood === mood.id;
                return (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    type="button"
                    className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all active:scale-95 text-center group cursor-pointer ${
                      isSelected
                        ? 'ring-1 ring-[#ffb2b7]/40 bg-[#353535] shadow-sm'
                        : 'bg-[#2a2a2a] hover:bg-[#353535]'
                    }`}
                  >
                    <span className="text-xl mb-1 group-hover:scale-110 transition-transform">{mood.emoji}</span>
                    <span
                      className={`text-[11px] leading-tight font-medium ${
                        isSelected ? 'text-[#ffb2b7]' : 'text-[#c8c6c6] group-hover:text-[#e5e2e1]'
                      }`}
                    >
                      {mood.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Voice Option (Audio Encrypted) */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#1b1b1c] border border-white/5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[#ffb2b7] shrink-0 border border-white/5">
                <Mic className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-medium text-[#e5e2e1] truncate">Trauma Voice Log</span>
                <span className="text-[11px] text-[#c8c6c6] truncate">Speak unhindered • 256-bit encrypted</span>
              </div>
            </div>
            <button
              onClick={() => setIsVoiceAssistantOpen(true)}
              type="button"
              className="shrink-0 px-3 py-1.5 rounded-lg bg-[#2a2a2a] hover:bg-[#353535] text-[#ffb2b7] text-[11px] font-semibold transition-all flex items-center gap-1 active:scale-95 cursor-pointer border border-white/5"
            >
              <span>Record</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              if (onOpenCheckIn) onOpenCheckIn();
              else if (onNavigate) onNavigate('checkin_wizard');
            }}
            type="button"
            className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-[#ff506c] hover:bg-[#ff3d5e] text-white text-[14px] font-semibold flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-md cursor-pointer"
          >
            <span>Continue Detailed Pulse</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3. Distress Score & Early Warning Snapshot */}
        <div className="rounded-2xl bg-[#202020] p-4 border border-white/5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff506c]" />
              <h3 className="text-[16px] font-semibold text-[#e5e2e1] font-['Manrope']">Distress Trajectory</h3>
            </div>
            <span className="bg-[#353535] text-[#ffb2b7] text-[11px] font-semibold px-2 py-0.5 rounded">
              Elevated
            </span>
          </div>

          {/* Gauge & Metric Row */}
          <div className="flex items-center gap-3.5 bg-[#1b1b1c] p-3 rounded-xl border border-white/5">
            {/* Circular Progress Meter SVG */}
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#353535]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-[#ff506c]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={`${distressScore}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-[20px] text-[#e5e2e1] font-bold leading-none font-['Manrope']">
                  {distressScore}
                </span>
                <span className="text-[10px] text-[#c8c6c6]">/ 100</span>
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#ff506c]" />
                <span className="text-[13px] font-semibold text-[#e5e2e1]">+33 pts from 7-day baseline</span>
              </div>
              <p className="text-[12px] text-[#c8c6c6] leading-relaxed">
                Subtle biometric dysregulation noticed during late evening hours.
              </p>
            </div>
          </div>

          {/* Trend Indicator Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <div className="inline-flex items-center gap-1.5 bg-[#2a2a2a] px-2.5 py-1 rounded-lg border border-white/5">
              <Moon className="w-3.5 h-3.5 text-[#ffb2b7]" />
              <span className="text-[11px] text-[#c8c6c6]">Sleep latency: +55m</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-[#2a2a2a] px-2.5 py-1 rounded-lg border border-white/5">
              <Activity className="w-3.5 h-3.5 text-[#ffb2b7]" />
              <span className="text-[11px] text-[#c8c6c6]">Fear hyper-vigilance flagged</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-[#2a2a2a] px-2.5 py-1 rounded-lg border border-white/5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] text-[#b6b5b4]">Care Circle sync ready</span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="pt-1 text-center">
            <span className="text-[11px] text-[#c8c6c6]/70">
              AI-assisted screening indicator • Not a clinical diagnosis
            </span>
          </div>
        </div>

        {/* 4. Immediate Calming & Safety Row */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold text-[#e5e2e1] font-['Manrope']">
              Emergency De-escalation & Care
            </span>
            <span className="text-[11px] font-semibold text-[#ffb2b7] uppercase tracking-wider">Always On</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Grounding Shortcut 1: 5-4-3-2-1 */}
            <button
              onClick={() => setActiveExercise(activeExercise === 'sensory' ? null : 'sensory')}
              type="button"
              className={`rounded-2xl p-3 flex flex-col justify-between text-left transition-all border border-white/5 cursor-pointer ${
                activeExercise === 'sensory' ? 'bg-[#2a2a2a] ring-1 ring-[#ffb2b7]/40' : 'bg-[#202020] hover:bg-[#2a2a2a]'
              }`}
            >
              <div className="flex items-center justify-between mb-3 w-full">
                <div className="w-8 h-8 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-[#ffb2b7] border border-white/5">
                  <Eye className="w-4 h-4" />
                </div>
                <span className="text-[11px] text-[#c8c6c6] font-medium">3 min</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] text-[#e5e2e1] font-semibold">5-4-3-2-1 Sensory</span>
                <span className="text-[11px] text-[#c8c6c6]">Somatic grounding</span>
              </div>
            </button>

            {/* Somatic Breath: 4-7-8 */}
            <button
              onClick={() => setActiveExercise(activeExercise === 'breath' ? null : 'breath')}
              type="button"
              className={`rounded-2xl p-3 flex flex-col justify-between text-left transition-all border border-white/5 cursor-pointer ${
                activeExercise === 'breath' ? 'bg-[#2a2a2a] ring-1 ring-[#ffb2b7]/40' : 'bg-[#202020] hover:bg-[#2a2a2a]'
              }`}
            >
              <div className="flex items-center justify-between mb-3 w-full">
                <div className="w-8 h-8 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-[#ffb2b7] border border-white/5">
                  <Wind className="w-4 h-4" />
                </div>
                <span className="text-[11px] text-[#c8c6c6] font-medium">4-7-8</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] text-[#e5e2e1] font-semibold">Cadence Breath</span>
                <span className="text-[11px] text-[#c8c6c6]">Vagal nerve regulation</span>
              </div>
            </button>
          </div>

          {/* Interactive Exercise Drawer */}
          {activeExercise === 'breath' && (
            <div className="p-4 rounded-2xl bg-[#1b1b1c] border border-[#ffb2b7]/30 flex flex-col items-center text-center space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between w-full">
                <span className="text-[13px] font-semibold text-[#ffb2b7]">Cadence Breath Pacer</span>
                <button onClick={() => setActiveExercise(null)} className="text-[#c8c6c6] hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="w-24 h-24 rounded-full border-2 border-[#ff506c] flex items-center justify-center bg-[#ff506c]/10 animate-pulse">
                <span className="text-2xl font-bold font-['Manrope'] text-[#ffdadb]">{breathTimer}</span>
              </div>
              <span className="text-[14px] font-semibold text-[#e5e2e1]">{breathPhase}</span>
              <p className="text-[11px] text-[#c8c6c6]">
                Gently follow the countdown: Inhale deeply through nose, hold calmly, exhale slowly through mouth.
              </p>
            </div>
          )}

          {activeExercise === 'sensory' && (
            <div className="p-4 rounded-2xl bg-[#1b1b1c] border border-[#ffb2b7]/30 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between w-full">
                <span className="text-[13px] font-semibold text-[#ffb2b7]">5-4-3-2-1 Sensory Grounding</span>
                <button onClick={() => setActiveExercise(null)} className="text-[#c8c6c6] hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ul className="text-[12px] text-[#c8c6c6] space-y-1.5 list-disc list-inside">
                <li><strong className="text-white">5 things:</strong> Notice 5 things you can see around you right now.</li>
                <li><strong className="text-white">4 things:</strong> Feel 4 things you can touch (fabric, feet on floor).</li>
                <li><strong className="text-white">3 sounds:</strong> Listen for 3 distinct ambient sounds.</li>
                <li><strong className="text-white">2 scents:</strong> Notice 2 smells in your current environment.</li>
                <li><strong className="text-white">1 sensation:</strong> Focus on 1 taste or steady breath.</li>
              </ul>
            </div>
          )}

          {/* Assigned Clinician Connected Card */}
          <div className="rounded-2xl bg-[#202020] p-3 flex items-center justify-between border border-white/5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center font-semibold text-[#ffb2b7] border border-white/10">
                  DR
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#131313]" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-[#e5e2e1] truncate">Dr. Radhika Iyer</span>
                  <span className="text-[10px] font-medium bg-[#353535] px-1.5 py-0.5 rounded text-[#c8c6c6]">
                    Assigned
                  </span>
                </div>
                <span className="text-[11px] text-[#c8c6c6] truncate">Clinical Psychologist • Active</span>
              </div>
            </div>
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              aria-label="Direct encrypted call"
              className="shrink-0 p-2.5 rounded-xl bg-[#2a2a2a] hover:bg-[#353535] text-[#ffb2b7] transition-all flex items-center justify-center cursor-pointer border border-white/5 active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5. Discreet Quick Exit Reminder Banner */}
        <div className="rounded-2xl bg-[#1b1b1c] p-3 flex items-center gap-3 text-[#c8c6c6] border border-white/5">
          <div className="w-8 h-8 rounded-full bg-[#202020] flex items-center justify-center shrink-0 text-[#ffb2b7] border border-white/5">
            <LogOut className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] leading-snug">
              <strong className="text-[#e5e2e1] font-semibold">Discreet Exit Protocol:</strong> Tap{' '}
              <button
                onClick={handleQuickExit}
                className="bg-[#202020] px-1.5 py-0.5 rounded text-[#ffdadb] font-mono text-[10px] uppercase font-bold border border-white/10 hover:bg-[#2a2a2a]"
              >
                EXIT
              </button>{' '}
              at the top, or press ESC twice anywhere to wipe screen immediately.
            </p>
          </div>
        </div>
      </main>

      {/* =========================================================================
          FIXED MOBILE BOTTOM NAVIGATION DOCK
         ========================================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 pb-safe bg-[#131313]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-2px_12px_rgba(0,0,0,0.45)]">
        <div className="flex justify-around items-center h-16 px-1">
          <button
            onClick={() => handleTabClick('overview')}
            className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] py-1 transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'text-[#ffb2b7]' : 'text-[#c8c6c6] hover:text-[#e5e2e1]'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[11px] font-medium">Home</span>
          </button>

          <button
            onClick={() => handleTabClick('daily-pulse')}
            className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] py-1 transition-colors cursor-pointer ${
              activeTab === 'daily-pulse' ? 'text-[#ffb2b7]' : 'text-[#c8c6c6] hover:text-[#e5e2e1]'
            }`}
          >
            <Mic className="w-5 h-5" />
            <span className="text-[11px] font-medium">Check-In</span>
          </button>

          <button
            onClick={() => handleTabClick('trajectory-insights')}
            className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] py-1 transition-colors cursor-pointer ${
              activeTab === 'trajectory-insights' ? 'text-[#ffb2b7]' : 'text-[#c8c6c6] hover:text-[#e5e2e1]'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[11px] font-medium">Trajectory</span>
          </button>

          <button
            onClick={() => handleTabClick('survivor-vault')}
            className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] py-1 transition-colors cursor-pointer ${
              activeTab === 'survivor-vault' ? 'text-[#ffb2b7]' : 'text-[#c8c6c6] hover:text-[#e5e2e1]'
            }`}
          >
            <Lock className="w-5 h-5" />
            <span className="text-[11px] font-medium">Vault</span>
          </button>

          <button
            onClick={() => handleTabClick('support-hotline')}
            className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] py-1 transition-colors cursor-pointer ${
              activeTab === 'support-hotline' ? 'text-[#ffb2b7]' : 'text-[#c8c6c6] hover:text-[#e5e2e1]'
            }`}
          >
            <PhoneCall className="w-5 h-5" />
            <span className="text-[11px] font-medium">Support</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
