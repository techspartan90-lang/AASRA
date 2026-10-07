'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from '@/lib/i18n';
import { AnalysisInput, AnalysisResult } from '@/lib/ai-service';
import { detectLanguage } from '@/lib/ai/multilingual-nlp';
import {
  Heart,
  Shield,
  Moon,
  AlertTriangle,
  PhoneCall,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
} from 'lucide-react';
import {
  LuxuryCard,
  GlassPanel,
  GlassInput,
  GlassTextarea,
  LuxuryButton,
  PremiumBadge,
  ThreeDVoiceWave,
  AiAnalysisAnimation,
} from '@/components/design-system';

interface CheckInWizardProps {
  onComplete: (result: AnalysisResult) => void;
  onCancel: () => void;
}

export function CheckInWizard({ onComplete, onCancel }: CheckInWizardProps) {
  const { language, submitVictimCheckIn, selectedCaseId, setIsEmergencyModalOpen, consent } = useApp();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedResult, setCompletedResult] = useState<AnalysisResult | null>(null);

  // Form states
  const [feelingScore, setFeelingScore] = useState<number>(3);
  const [safetyScore, setSafetyScore] = useState<number>(3);
  const [sleepScore, setSleepScore] = useState<number>(3);
  const [fearScore, setFearScore] = useState<number>(2);
  const [avoidanceScore, setAvoidanceScore] = useState<number>(2);
  const [requestHelp, setRequestHelp] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  // Audio recording simulation
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSeconds, setRecordedSeconds] = useState(0);
  const [hasVoiceSample, setHasVoiceSample] = useState(false);

  const totalSteps = 7;

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasVoiceSample(true);
    } else {
      setIsRecording(true);
      setRecordedSeconds(0);
      const interval = setInterval(() => {
        setRecordedSeconds(prev => {
          if (prev >= 15) {
            clearInterval(interval);
            setIsRecording(false);
            setHasVoiceSample(true);
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleReadQuestion = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const input: AnalysisInput = {
        feelingScore,
        safetyScore,
        sleepScore,
        fearScore,
        avoidanceScore,
        requestHelp,
        notes,
        hasVoiceSample: consent.voiceAnalysis ? hasVoiceSample : false,
        voiceDurationSeconds: consent.voiceAnalysis ? recordedSeconds : 0,
      };

      const result = await submitVictimCheckIn(input, selectedCaseId || 'CASE-002');
      // Give the multi-stage AiAnalysisAnimation time to complete smoothly
      setTimeout(() => {
        setCompletedResult(result);
        setIsSubmitting(false);
      }, 4000);
    } catch (e) {
      console.error('Check-in error', e);
      setIsSubmitting(false);
    }
  };

  // If submitting, display the sophisticated AI Analysis Animation (Section 26)
  if (isSubmitting) {
    return (
      <div className="max-w-xl mx-auto rounded-3xl glass-panel p-8 sm:p-12 shadow-2xl border-[#FD1053]/30">
        <AiAnalysisAnimation durationPerStageMs={800} />
      </div>
    );
  }

  // Completed Confirmation State
  if (completedResult) {
    return (
      <div className="max-w-xl mx-auto p-8 rounded-3xl glass-panel text-center space-y-6 shadow-2xl border-[#FD1053]/30">
        <div className="w-16 h-16 rounded-full bg-[#FD1053]/15 text-[#FD1053] mx-auto flex items-center justify-center border border-[#FD1053]/30 shadow-[0_0_20px_rgba(253,16,83,0.3)]">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#333333] dark:text-white">
            {t.thankYouCheckIn}
          </h2>
          <p className="text-sm text-[#474747] dark:text-[#D6D6D6]">
            {t.responsesRecorded}
          </p>
        </div>

        {(completedResult.riskLevel === 'elevated' || completedResult.riskLevel === 'high') && (
          <div className="p-4 rounded-2xl glass-card border-[#FD1053]/35 text-left text-xs text-[#333333] dark:text-[#D6D6D6] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#FD1053]">
              <Sparkles className="w-4 h-4" />
              <span>Support Follow-Up</span>
            </div>
            <p className="leading-relaxed">
              {t.changesNoticed}
            </p>
            <p className="text-[11px] text-[#474747] dark:text-[#A3A3A3]">
              Your assigned caseworker will review and coordinate any supportive check-in required.
            </p>
          </div>
        )}

        <div className="pt-4">
          <LuxuryButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => onComplete(completedResult)}
          >
            Return to Your Well-Being Dashboard
          </LuxuryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto rounded-3xl glass-panel shadow-2xl border-[#474747]/20 dark:border-white/10 overflow-hidden select-none">
      {/* Top Header with Progress */}
      <div className="px-6 py-4 border-b border-[#474747]/15 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PremiumBadge tone="live" size="sm">
            Step {step} of {totalSteps}
          </PremiumBadge>
          <span className="text-xs text-[#6B7280]">·</span>
          <span className="text-xs font-semibold text-[#333333] dark:text-white">
            Periodic Check-In
          </span>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-[#6B7280] hover:text-[#FD1053] transition cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#474747]/10 dark:bg-white/10 h-1.5">
        <div
          className="bg-[#FD1053] h-1.5 transition-all duration-300 ease-out shadow-[0_0_8px_#FD1053]"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step Content */}
      <div className="p-6 sm:p-10 space-y-6">
        {/* Step 1: Feeling Today (Section 27) */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#FD1053] uppercase tracking-wider">
                  Step 1 · Emotional Horizon
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#333333] dark:text-white">
                  How are you feeling today?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleReadQuestion('How are you feeling today?')}
                className="p-2 rounded-xl text-[#6B7280] hover:text-[#FD1053] hover:bg-black/5 dark:hover:bg-white/5 transition"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* 5 Response Options per Section 27: Doing well, Okay, A little stressed, Struggling, Very distressed */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
              {[
                { val: 5, label: 'Doing well', emoji: '😊', desc: 'Balanced & steady' },
                { val: 4, label: 'Okay', emoji: '🙂', desc: 'Managing well' },
                { val: 3, label: 'A little stressed', emoji: '😐', desc: 'Slight pressure' },
                { val: 2, label: 'Struggling', emoji: '😟', desc: 'Feeling heavy' },
                { val: 1, label: 'Very distressed', emoji: '😣', desc: 'Severe distress' },
              ].map(opt => {
                const isSelected = feelingScore === opt.val;
                return (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setFeelingScore(opt.val)}
                    className={`p-4 rounded-2xl glass-card text-center transition flex flex-col items-center justify-center min-h-[110px] cursor-pointer ${
                      isSelected
                        ? 'border-[#FD1053] bg-[#FD1053]/15 text-[#FD1053] ring-2 ring-[#FD1053]/30 shadow-[0_0_15px_rgba(253,16,83,0.2)]'
                        : 'border-[#474747]/20 hover:border-[#FD1053]/40'
                    }`}
                  >
                    <span className="text-3xl mb-1.5">{opt.emoji}</span>
                    <span className="text-xs font-bold text-[#333333] dark:text-white">
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-[#6B7280] dark:text-[#A3A3A3] mt-0.5">{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Safety */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#FD1053] uppercase tracking-wider">
                  Step 2 · Personal Safety
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#333333] dark:text-white">
                  {t.step2Question}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleReadQuestion(t.step2Question)}
                className="p-2 rounded-xl text-[#6B7280] hover:text-[#FD1053] hover:bg-black/5 dark:hover:bg-white/5 transition"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { val: 5, label: 'I feel completely safe in my daily routine', sub: 'No threats or discomfort' },
                { val: 4, label: 'Generally safe, occasional concern', sub: 'Normal precautions' },
                { val: 3, label: 'Moderate uneasiness in certain places', sub: 'Uneasy when traveling outside' },
                { val: 2, label: 'Unsafe or frequently worried about security', sub: 'Notice suspicious people or tension' },
                { val: 1, label: 'I feel severely unsafe or threatened', sub: 'Immediate safety worries' },
              ].map(opt => {
                const isSelected = safetyScore === opt.val;
                return (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setSafetyScore(opt.val)}
                    className={`w-full p-4 rounded-2xl glass-card text-left transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#FD1053] bg-[#FD1053]/15 ring-2 ring-[#FD1053]/30 shadow-[0_0_15px_rgba(253,16,83,0.15)]'
                        : 'border-[#474747]/20 hover:border-[#FD1053]/40'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#333333] dark:text-white">
                        {opt.label}
                      </p>
                      <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">{opt.sub}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                        isSelected
                          ? 'border-[#FD1053] bg-[#FD1053] text-white'
                          : 'border-[#474747]/40'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {safetyScore === 1 && (
              <div className="p-4 rounded-2xl bg-[#FD1053]/10 border border-[#FD1053]/35 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#FD1053]">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Immediate Safety Support Available</span>
                </div>
                <p className="text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                  We noticed your personal safety response indicates acute worry. Emergency police liaison and 24/7 helpline assistance are accessible immediately.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <LuxuryButton
                    size="sm"
                    variant="primary"
                    onClick={() => setIsEmergencyModalOpen(true)}
                  >
                    Connect 24/7 Helpline
                  </LuxuryButton>
                  <LuxuryButton
                    size="sm"
                    variant="secondary"
                    onClick={() => setRequestHelp(true)}
                  >
                    Request Urgent Caseworker Callback
                  </LuxuryButton>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Sleep */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#FD1053] uppercase tracking-wider">
                  Step 3 · Rest & Sleep
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#333333] dark:text-white">
                  {t.step3Question}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleReadQuestion(t.step3Question)}
                className="p-2 rounded-xl text-[#6B7280] hover:text-[#FD1053] transition"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { val: 5, label: 'Sleeping soundly throughout the night', icon: '🌙' },
                { val: 4, label: 'Fair sleep with slight trouble falling asleep', icon: '🛌' },
                { val: 3, label: 'Restless sleep or waking up multiple times', icon: '🥱' },
                { val: 2, label: 'Severe sleep trouble or disturbing thoughts', icon: '🌑' },
                { val: 1, label: 'Almost unable to sleep / frequent nightmares', icon: '⚡' },
              ].map(opt => {
                const isSelected = sleepScore === opt.val;
                return (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setSleepScore(opt.val)}
                    className={`w-full p-4 rounded-2xl glass-card text-left transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#FD1053] bg-[#FD1053]/15 ring-2 ring-[#FD1053]/30'
                        : 'border-[#474747]/20 hover:border-[#FD1053]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{opt.icon}</span>
                      <span className="text-sm font-semibold text-[#333333] dark:text-white">
                        {opt.label}
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                        isSelected
                          ? 'border-[#FD1053] bg-[#FD1053] text-white'
                          : 'border-[#474747]/40'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Fear / Intrusive Thoughts */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#FD1053] uppercase tracking-wider">
                  Step 4 · Anxiety & Distress
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#333333] dark:text-white">
                  {t.step4Question}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleReadQuestion(t.step4Question)}
                className="p-2 rounded-xl text-[#6B7280] hover:text-[#FD1053] transition"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
              {[
                { val: 1, label: 'Not at all', sub: 'Calm' },
                { val: 2, label: 'A little', sub: 'Manageable' },
                { val: 3, label: 'Moderately', sub: 'Frequent' },
                { val: 4, label: 'A lot', sub: 'Difficult' },
                { val: 5, label: 'Constantly', sub: 'Overwhelming' },
              ].map(opt => {
                const isSelected = fearScore === opt.val;
                return (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setFearScore(opt.val)}
                    className={`p-4 rounded-2xl glass-card text-center transition flex flex-col items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'border-[#FD1053] bg-[#FD1053]/15 text-[#FD1053] ring-2 ring-[#FD1053]/30'
                        : 'border-[#474747]/20 hover:border-[#FD1053]/40'
                    }`}
                  >
                    <span className="text-sm font-bold text-[#333333] dark:text-white">
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] mt-1">{opt.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Avoidance */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#FD1053] uppercase tracking-wider">
                  Step 5 · Social Connection
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#333333] dark:text-white">
                  {t.step5Question}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleReadQuestion(t.step5Question)}
                className="p-2 rounded-xl text-[#6B7280] hover:text-[#FD1053] transition"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { val: 1, label: 'Engaging normally with family and work' },
                { val: 2, label: 'Slightly less active than usual' },
                { val: 3, label: 'Avoiding specific places or crowded spaces' },
                { val: 4, label: 'Avoiding most social interactions' },
                { val: 5, label: 'Complete withdrawal from friends or leaving the house' },
              ].map(opt => {
                const isSelected = avoidanceScore === opt.val;
                return (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setAvoidanceScore(opt.val)}
                    className={`w-full p-4 rounded-2xl glass-card text-left transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#FD1053] bg-[#FD1053]/15 ring-2 ring-[#FD1053]/30'
                        : 'border-[#474747]/20 hover:border-[#FD1053]/40'
                    }`}
                  >
                    <span className="text-sm font-semibold text-[#333333] dark:text-white">
                      {opt.label}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                        isSelected
                          ? 'border-[#FD1053] bg-[#FD1053] text-white'
                          : 'border-[#474747]/40'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 6: Caseworker Outreach */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#FD1053] uppercase tracking-wider">
                  Step 6 · Counsellor Linkage
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#333333] dark:text-white">
                  {t.step6Question}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleReadQuestion(t.step6Question)}
                className="p-2 rounded-xl text-[#6B7280] hover:text-[#FD1053] transition"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => setRequestHelp(true)}
                className={`p-6 rounded-2xl glass-card text-left transition flex flex-col justify-between cursor-pointer ${
                  requestHelp
                    ? 'border-[#FD1053] bg-[#FD1053]/15 ring-2 ring-[#FD1053]/30'
                    : 'border-[#474747]/20 hover:border-[#FD1053]/40'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#FD1053]/15 text-[#FD1053] flex items-center justify-center mb-3">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#333333] dark:text-white">
                    Yes, request a contact
                  </h4>
                  <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-1">
                    Your assigned caseworker or clinical counsellor will schedule a call.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRequestHelp(false)}
                className={`p-6 rounded-2xl glass-card text-left transition flex flex-col justify-between cursor-pointer ${
                  !requestHelp
                    ? 'border-[#474747]/50 bg-black/5 dark:bg-white/5 ring-1 ring-white/10'
                    : 'border-[#474747]/20 hover:border-[#FD1053]/40'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#474747]/10 text-[#6B7280] flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#333333] dark:text-white">
                    Not right now
                  </h4>
                  <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-1">
                    Just recording my check-in. I will reach out if I need help.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 7: Trauma Voice & Notes (Sections 27 & 28) */}
        {step === 7 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#FD1053] uppercase tracking-wider">
                  Step 7 (Optional) · Trauma Voice & Notes
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#333333] dark:text-white">
                  {t.step7Question}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handleReadQuestion(t.step7Question)}
                className="p-2 rounded-xl text-[#6B7280] hover:text-[#FD1053] transition"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {consent.voiceAnalysis && (
            {/* Trauma Voice 3D Waveform (Section 28) */}
            <div className="p-6 rounded-2xl glass-card border-[#FD1053]/25 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-[#FD1053]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#333333] dark:text-white">
                    Trauma Voice Audio Interaction
                  </span>
                </div>
                <PremiumBadge tone="live" size="sm">
                  Zero Retention Raw Audio
                </PremiumBadge>
              </div>

              {/* 3D Waveform */}
              <ThreeDVoiceWave
                isListening={isRecording}
                isProcessing={hasVoiceSample && !isRecording}
              />

              <div className="flex items-center justify-center gap-3 pt-2">
                <LuxuryButton
                  size="md"
                  variant={isRecording ? 'danger' : 'primary'}
                  onClick={handleToggleRecord}
                  leftIcon={isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                >
                  {isRecording ? `Stop Recording (${15 - recordedSeconds}s left)` : hasVoiceSample ? 'Re-Record Voice Sample' : 'Start Voice Check-In'}
                </LuxuryButton>
              </div>
            </div>

            )}

            {/* Optional Text Notes */}
            <div className="space-y-2">
              <GlassTextarea
                label="Text Notes (Optional)"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="You can describe how you feel, concerns regarding upcoming court milestones, or questions for your caseworker..."
                rows={3}
              />

              {notes.trim().length > 3 && (
                <div className="flex items-center gap-2 p-2 rounded-xl glass-card text-xs text-[#6B7280] dark:text-[#D6D6D6]">
                  <Sparkles className="w-3.5 h-3.5 text-[#FD1053] shrink-0" />
                  <span>
                    Detected Language: <strong>{SUPPORTED_LANGUAGES.find(l => l.code === detectLanguage(notes, language).detectedLanguage)?.name || 'Auto'}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-[#474747]/15 dark:border-white/10">
          {step > 1 ? (
            <LuxuryButton
              variant="secondary"
              size="md"
              onClick={() => setStep(prev => prev - 1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous
            </LuxuryButton>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <LuxuryButton
              variant="primary"
              size="md"
              onClick={() => setStep(prev => prev + 1)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Next Step
            </LuxuryButton>
          ) : (
            <LuxuryButton
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              rightIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Complete Check-In
            </LuxuryButton>
          )}
        </div>
      </div>
    </div>
  );
}
