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
  UserX,
  PhoneCall,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Mic,
  MicOff,
  Volume2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface CheckInWizardProps {
  onComplete: (result: AnalysisResult) => void;
  onCancel: () => void;
}

export function CheckInWizard({ onComplete, onCancel }: CheckInWizardProps) {
  const { language, submitVictimCheckIn, selectedCaseId, consent, setIsEmergencyModalOpen } = useApp();
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
        hasVoiceSample,
        voiceDurationSeconds: recordedSeconds,
      };

      const result = await submitVictimCheckIn(input, selectedCaseId || 'CASE-002');
      setCompletedResult(result);
    } catch (e) {
      console.error('Check-in error', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completedResult) {
    return (
      <div className="max-w-xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t.thankYouCheckIn}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {t.responsesRecorded}
          </p>
        </div>

        {/* Trauma-sensitive gentle notification if elevated indicators were found */}
        {(completedResult.riskLevel === 'elevated' || completedResult.riskLevel === 'high') && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-left text-xs text-amber-900 dark:text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Support Follow-Up</span>
            </div>
            <p className="leading-relaxed">
              {t.changesNoticed}
            </p>
            <p className="text-[11px] text-amber-700 dark:text-amber-300">
              Your assigned counsellor will review and may arrange a comfortable check-in call with you.
            </p>
          </div>
        )}

        <div className="pt-4">
          <button
            onClick={() => onComplete(completedResult)}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-medium text-sm transition cursor-pointer"
          >
            Return to Your Well-Being Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      {/* Top Header with Progress */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Periodic Check-In
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {step} / {totalSteps}
          </span>
        </div>

        <button
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          Cancel
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5">
        <div
          className="bg-emerald-500 h-1.5 transition-all duration-300 ease-out"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step Content */}
      <div className="p-6 sm:p-10 space-y-6">
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Step 1
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {t.step1Question}
                </h3>
              </div>
              <button
                onClick={() => handleReadQuestion(t.step1Question)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
              {[
                { val: 5, label: t.doingWell, emoji: '😊', desc: 'Feeling balanced' },
                { val: 4, label: t.okay, emoji: '🙂', desc: 'Managing okay' },
                { val: 3, label: t.notSure, emoji: '😐', desc: 'Mixed feelings' },
                { val: 2, label: t.struggling, emoji: '😟', desc: 'Feeling heavy' },
                { val: 1, label: t.veryDistressed, emoji: '😣', desc: 'Very distressed' },
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setFeelingScore(opt.val)}
                  className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center min-h-[100px] cursor-pointer ${
                    feelingScore === opt.val
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-850'
                  }`}
                >
                  <span className="text-3xl mb-1">{opt.emoji}</span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Step 2
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {t.step2Question}
                </h3>
              </div>
              <button
                onClick={() => handleReadQuestion(t.step2Question)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
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
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setSafetyScore(opt.val)}
                  className={`w-full p-4 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                    safetyScore === opt.val
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {opt.label}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{opt.sub}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                      safetyScore === opt.val
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {safetyScore === opt.val && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>

            {/* Supportive immediate safety escalation (Section 27 & 28) */}
            {safetyScore === 1 && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-2 text-xs animate-in fade-in">
                <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-200">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Immediate Safety Support Available</span>
                </div>
                <p className="text-rose-700 dark:text-rose-300 text-[11px]">
                  We noticed your personal safety response indicates acute worry or direct threats. Emergency police liaison and 24/7 helpline assistance are accessible immediately.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEmergencyModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition"
                  >
                    Connect 24/7 Helpline
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequestHelp(true)}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800 font-medium text-xs hover:bg-rose-100"
                  >
                    Request Urgent Caseworker Callback
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Step 3
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {t.step3Question}
                </h3>
              </div>
              <button
                onClick={() => handleReadQuestion(t.step3Question)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
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
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setSleepScore(opt.val)}
                  className={`w-full p-4 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                    sleepScore === opt.val
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{opt.icon}</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {opt.label}
                    </span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                      sleepScore === opt.val
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {sleepScore === opt.val && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Step 4
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {t.step4Question}
                </h3>
              </div>
              <button
                onClick={() => handleReadQuestion(t.step4Question)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
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
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setFearScore(opt.val)}
                  className={`p-4 rounded-xl border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                    fearScore === opt.val
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {opt.label}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Step 5
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {t.step5Question}
                </h3>
              </div>
              <button
                onClick={() => handleReadQuestion(t.step5Question)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { val: 1, label: 'No, engaging normally with family and work' },
                { val: 2, label: 'Slightly less active than usual' },
                { val: 3, label: 'Avoiding specific places or crowded spaces' },
                { val: 4, label: 'Avoiding most social interactions or staying indoors' },
                { val: 5, label: 'Complete withdrawal from friends, family, or leaving the house' },
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setAvoidanceScore(opt.val)}
                  className={`w-full p-4 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                    avoidanceScore === opt.val
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {opt.label}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                      avoidanceScore === opt.val
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {avoidanceScore === opt.val && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Step 6
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {t.step6Question}
                </h3>
              </div>
              <button
                onClick={() => handleReadQuestion(t.step6Question)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => setRequestHelp(true)}
                className={`p-6 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  requestHelp
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                    Yes, request a contact
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Your assigned caseworker or clinical counsellor will schedule a call.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRequestHelp(false)}
                className={`p-6 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  !requestHelp
                    ? 'border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-800'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                    Not right now
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Just recording my check-in. I will reach out if I need help.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Step 7 (Optional)
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {t.step7Question}
                </h3>
              </div>
              <button
                onClick={() => handleReadQuestion(t.step7Question)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Read aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Text Response (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="You can describe how you feel, any concerns about upcoming court dates, or questions for your welfare officer..."
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />

                {/* Multilingual NLP Detection Badge (Section 18 & 19) */}
                {notes.trim().length > 3 && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 mt-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>
                      Detected Language: <strong>{SUPPORTED_LANGUAGES.find(l => l.code === detectLanguage(notes, language).detectedLanguage)?.name || 'Auto'}</strong>
                      {' '}({Math.round(detectLanguage(notes, language).confidence * 100)}% match)
                      {detectLanguage(notes, language).isLowConfidence && (
                        <span className="text-amber-600 dark:text-amber-400 ml-1">· Confirm language in header if needed</span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Voice Record Feature with Consent Check (Section 21 & 22) */}
              {!consent?.voiceAnalysis ? (
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      Voice Recording Disabled
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Voice analysis is currently turned off in your privacy settings. You can enter remarks as text above.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-200 dark:bg-slate-750 text-slate-600 dark:text-slate-300">
                    Consent Protected
                  </span>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      Voice Note (Optional)
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isRecording
                        ? `Recording in progress... (${recordedSeconds}s / 15s)`
                        : hasVoiceSample
                        ? `Voice response recorded (${recordedSeconds}s)`
                        : 'Tap to speak your response in your preferred language'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleRecord}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[44px] ${
                      isRecording
                        ? 'bg-rose-600 text-white animate-pulse'
                        : hasVoiceSample
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    <span>{isRecording ? 'Stop' : hasVoiceSample ? 'Re-record' : 'Speak'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Buttons */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <button
          type="button"
          onClick={() => (step > 1 ? setStep(step - 1) : onCancel())}
          className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{step > 1 ? 'Previous' : 'Cancel'}</span>
        </button>

        {step < totalSteps ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer min-h-[44px]"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer shadow-md disabled:opacity-50 min-h-[44px]"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Recording Responses...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Submit Check-In</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
