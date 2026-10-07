'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { SUPPORTED_LANGUAGES, TRANSLATIONS, SupportedLanguage } from '@/lib/i18n';
import { ThreeDVoiceWave } from '@/components/design-system/ThreeDVoiceWave';
import { LuxuryButton } from '@/components/design-system/LuxuryButton';
import { PremiumBadge } from '@/components/design-system/PremiumBadge';
import {
  Mic,
  Volume2,
  RotateCcw,
  X,
  Globe2,
  CheckCircle2,
  PhoneCall,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdropVariants, modalDialogVariants } from '@/lib/design-system';

export function MultilingualVoiceModal({ onClose }: { onClose: () => void }) {
  const { language, setLanguage, submitVictimCheckIn } = useApp();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [conversation, setConversation] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    { sender: 'ai', text: t.voiceAssistantGreeting },
  ]);

  const [isListening, setIsListening] = useState(false);
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
    <AnimatePresence>
      <motion.div
        variants={modalBackdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="dialog"
        aria-modal="true"
        aria-labelledby="voice-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#151515]/85 backdrop-blur-md p-4 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          variants={modalDialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-lg rounded-3xl bg-[#252525] dark:bg-[#1E1E1E] border border-[rgba(255,255,255,0.12)] shadow-2xl p-6 sm:p-8 space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.10)] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#474747] border border-[rgba(253,16,83,0.35)] flex items-center justify-center text-[#FD1053] shadow-sm">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <h3 id="voice-modal-title" className="text-base font-bold text-white tracking-tight">
                  Trauma Voice Assistant
                </h3>
                <p className="text-xs text-[#D6D6D6]">
                  Acoustic Well-Being Navigation · 10 Indian Regional Languages
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#D6D6D6] hover:text-white hover:bg-[#333333] transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Language Selection Pills */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#888888]">
              <span>Active Language</span>
              <span className="font-mono text-[#FD1053]">{currentLangObj.name}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-[#1E1E1E] rounded-xl border border-[rgba(255,255,255,0.08)]">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    const updatedT = TRANSLATIONS[lang.code] || TRANSLATIONS.en;
                    setConversation([{ sender: 'ai', text: updatedT.voiceAssistantGreeting }]);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    language === lang.code
                      ? 'bg-[#FD1053] text-white shadow-sm'
                      : 'bg-[#333333] text-[#D6D6D6] hover:text-white hover:bg-[#474747]'
                  }`}
                >
                  {lang.name} ({lang.nativeName})
                </button>
              ))}
            </div>
          </div>

          {/* 3D Waveform Container */}
          <div className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[#1E1E1E] p-3 flex flex-col items-center justify-center relative overflow-hidden">
            <ThreeDVoiceWave isRecording={isListening} height={100} />
            <div className="mt-2 text-center text-xs font-semibold text-[#D6D6D6]">
              {isListening ? (
                <span className="text-[#FD1053] font-mono tracking-wider animate-pulse flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FD1053]" />
                  Acoustic Ingestion Active · Speak naturally in {currentLangObj.name}...
                </span>
              ) : (
                <span className="text-[#888888]">
                  Zero raw audio retention · Privacy-preserving 0-day acoustic extraction
                </span>
              )}
            </div>
          </div>

          {/* Conversation Transcript Area */}
          <div className="p-4 rounded-2xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.08)] space-y-3 min-h-[140px] max-h-52 overflow-y-auto">
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
                      ? 'bg-[#333333] text-white border border-[rgba(253,16,83,0.30)] rounded-br-xs'
                      : 'bg-[#2a2a2a] text-[#F5F5F5] border border-[rgba(255,255,255,0.08)] rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Callback Confirmation Banner */}
          {conversation.length >= 3 && !callbackRequested && (
            <div className="p-3.5 rounded-2xl bg-[#333333] border border-[rgba(253,16,83,0.35)] flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-white">
                Request caseworker callback for support?
              </span>
              <LuxuryButton
                onClick={handleConfirmCallback}
                variant="primary"
                className="text-xs py-1.5 px-3 min-h-[36px]"
              >
                Request Call
              </LuxuryButton>
            </div>
          )}

          {callbackRequested && (
            <div className="p-3 rounded-xl bg-[#333333] border border-[rgba(255,255,255,0.15)] text-white text-xs font-medium text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FD1053]" />
              <span>Callback confirmed. Assigned caseworker alerted.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <button
              onClick={handleToggleSpeak}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center transition cursor-pointer min-h-[70px] ${
                isListening
                  ? 'bg-[#FD1053] text-white border-[#FD1053] shadow-lg shadow-[rgba(253,16,83,0.3)] animate-pulse'
                  : 'bg-[#FD1053] hover:bg-[#ff2d6a] text-white border-[#FD1053] shadow-md shadow-[rgba(253,16,83,0.25)]'
              }`}
            >
              <Mic className="w-5 h-5 mb-1" />
              <span className="text-xs font-bold">{t.speakPrompt}</span>
            </button>

            <button
              onClick={() => {
                const lastAi = [...conversation].reverse().find(m => m.sender === 'ai');
                if (lastAi) handleSpeakAloud(lastAi.text);
              }}
              className="p-3 rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[#333333] hover:bg-[#474747] text-white flex flex-col items-center justify-center transition cursor-pointer min-h-[70px]"
            >
              <Volume2 className="w-5 h-5 mb-1 text-[#D6D6D6]" />
              <span className="text-xs font-semibold">{t.readAloudPrompt}</span>
            </button>

            <button
              onClick={handleRepeatLast}
              className="p-3 rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[#333333] hover:bg-[#474747] text-white flex flex-col items-center justify-center transition cursor-pointer min-h-[70px]"
            >
              <RotateCcw className="w-5 h-5 mb-1 text-[#D6D6D6]" />
              <span className="text-xs font-semibold">{t.repeatPrompt}</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
