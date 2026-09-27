'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { SUPPORTED_LANGUAGES, TRANSLATIONS, SupportedLanguage } from '@/lib/i18n';
import {
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
  X,
  PhoneCall,
  Sparkles,
  CheckCircle2,
  Globe2,
} from 'lucide-react';

export function MultilingualVoiceModal({ onClose }: { onClose: () => void }) {
  const { language, setLanguage, submitVictimCheckIn } = useApp();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [conversation, setConversation] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    { sender: 'ai', text: t.voiceAssistantGreeting },
  ]);

  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [callbackRequested, setCallbackRequested] = useState(false);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handleSpeakAloud = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLangObj.voiceCode;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleSpeak = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Simulate voice capture
      setTimeout(() => {
        const simulatedUserReply =
          language === 'hi'
            ? 'मैं बहुत चिंतित हूँ और मुझे रात में ठीक से नींद नहीं आ रही है।'
            : language === 'bn'
            ? 'আমি খুব চিন্তিত এবং রাতে আমার ভালো ঘুম হচ্ছে না।'
            : language === 'as'
            ? 'মই বহুত চিন্তিত আৰু মোৰ ৰাতি টোপনি হোৱা নাই।'
            : language === 'ta'
            ? 'நான் மிகவும் கவலையாக இருக்கிறேன், இரவில் சரியாக தூங்க முடியவில்லை.'
            : 'I have been very worried about the trial and I am not sleeping well.';

        setConversation(prev => [
          ...prev,
          { sender: 'user', text: simulatedUserReply },
          { sender: 'ai', text: t.voiceAssistantHelpOffer },
        ]);
        setIsListening(false);
        handleSpeakAloud(t.voiceAssistantHelpOffer);
      }, 3500);
    }
  };

  const handleRepeatLast = () => {
    const lastAiMessage = [...conversation].reverse().find(m => m.sender === 'ai');
    if (lastAiMessage) {
      handleSpeakAloud(lastAiMessage.text);
    }
  };

  const handleConfirmCallback = async () => {
    setCallbackRequested(true);
    await submitVictimCheckIn({
      feelingScore: 2,
      safetyScore: 3,
      sleepScore: 1,
      fearScore: 4,
      avoidanceScore: 3,
      requestHelp: true,
      notes: 'Voice assistant conversation: User reported anxiety and acute sleeplessness prior to court appearance.',
      hasVoiceSample: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Multilingual Voice Assistant
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Low-literacy voice-first navigation · 10 Indian Regional Languages
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language selection pills */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Active Language
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-850 rounded-xl">
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  const updatedT = TRANSLATIONS[lang.code] || TRANSLATIONS.en;
                  setConversation([{ sender: 'ai', text: updatedT.voiceAssistantGreeting }]);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  language === lang.code
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {lang.name} ({lang.nativeName})
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Dialog Area */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3 min-h-[160px] max-h-60 overflow-y-auto">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isListening && (
            <div className="p-2 text-center text-xs font-semibold text-rose-500 animate-pulse">
              🎙 Listening... Speak in your language
            </div>
          )}
        </div>

        {/* Callback confirmation prompt if AI offered help */}
        {conversation.length >= 3 && !callbackRequested && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-3 animate-in fade-in">
            <span className="text-xs font-semibold text-emerald-950 dark:text-emerald-100">
              Request immediate caseworker callback?
            </span>
            <button
              onClick={handleConfirmCallback}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer shrink-0"
            >
              Yes, request call
            </button>
          </div>
        )}

        {callbackRequested && (
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-xs font-medium text-center">
            ✓ Callback recorded! Your assigned support professional has been alerted.
          </div>
        )}

        {/* Voice Control Buttons (Section 13) */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {/* 🎙 "Speak" */}
          <button
            onClick={handleToggleSpeak}
            className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center transition cursor-pointer min-h-[70px] ${
              isListening
                ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600 shadow-md'
            }`}
          >
            <Mic className="w-5 h-5 mb-1" />
            <span className="text-xs font-bold">{t.speakPrompt}</span>
          </button>

          {/* 🔊 "Read aloud" */}
          <button
            onClick={() => {
              const lastAi = [...conversation].reverse().find(m => m.sender === 'ai');
              if (lastAi) handleSpeakAloud(lastAi.text);
            }}
            className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-white flex flex-col items-center justify-center transition cursor-pointer min-h-[70px]"
          >
            <Volume2 className="w-5 h-5 mb-1 text-slate-600 dark:text-slate-300" />
            <span className="text-xs font-semibold">{t.readAloudPrompt}</span>
          </button>

          {/* 🔁 "Repeat" */}
          <button
            onClick={handleRepeatLast}
            className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-white flex flex-col items-center justify-center transition cursor-pointer min-h-[70px]"
          >
            <RotateCcw className="w-5 h-5 mb-1 text-slate-600 dark:text-slate-300" />
            <span className="text-xs font-semibold">{t.repeatPrompt}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
