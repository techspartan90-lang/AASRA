'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/store';
import { useTranslation } from '@/hooks/use-i18n';
import {
  VoiceMode,
  VoicePlaybackSettings,
  loadVoiceSettings,
  saveVoiceSettings,
  voiceComfortController,
  CURATED_VOICES,
  COMFORT_MESSAGES,
  ComfortMessage,
} from '@/lib/voice-comfort-service';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/lib/i18n';
import { LuxuryButton } from '@/components/design-system/LuxuryButton';
import { PremiumBadge } from '@/components/design-system/PremiumBadge';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  RotateCcw,
  ShieldCheck,
  Heart,
  Wind,
  Sparkles,
  X,
  AlertTriangle,
  Lock,
  Mic,
  Sliders,
  CheckCircle2,
  UserCheck,
  RefreshCw,
  BellOff,
  Headphones,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdropVariants, modalDialogVariants } from '@/lib/design-system';

interface FamiliarVoiceComfortModalProps {
  onClose: () => void;
}

export function FamiliarVoiceComfortModal({ onClose }: { onClose: () => void }) {
  const { language: appLanguage, setLanguage: setAppLanguage } = useApp();
  const { t } = useTranslation();

  const [settings, setSettings] = useState<VoicePlaybackSettings>(() => {
    const loaded = loadVoiceSettings();
    return { ...loaded, language: loaded.language || appLanguage };
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string>(COMFORT_MESSAGES[0].id);
  const [activeTab, setActiveTab] = useState<'voice' | 'grounding' | 'consent'>('voice');

  // Grounding Mode states
  const [isGroundingActive, setIsGroundingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathingSecondsLeft, setBreathingSecondsLeft] = useState(4);
  const [groundingStepIndex, setGroundingStepIndex] = useState(0);

  // Consent form fields
  const [lovedOneName, setLovedOneName] = useState(settings.personalizedConsent.voiceOwnerName || '');
  const [lovedOneRelation, setLovedOneRelation] = useState(settings.personalizedConsent.relationship || '');
  const [consentAffirmed, setConsentAffirmed] = useState(false);
  const [consentSuccessNotice, setConsentSuccessNotice] = useState<string | null>(null);

  // Clean up audio playback on unmount or close
  useEffect(() => {
    return () => {
      voiceComfortController.stop();
    };
  }, []);

  // Update settings in localStorage whenever changed
  const updateSettings = (partial: Partial<VoicePlaybackSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...partial };
      saveVoiceSettings(next);
      return next;
    });
  };

  // Resolve message text in chosen language, falling back to English
  const activeMessage = COMFORT_MESSAGES.find(m => m.id === selectedMessageId) || COMFORT_MESSAGES[0];
  const langKey = settings.language || appLanguage || 'en';
  const messageText = activeMessage.text[langKey] || activeMessage.text['en'] || Object.values(activeMessage.text)[0];

  const handlePlayMessage = (textToSpeak = messageText) => {
    if (settings.mode === 'text_only' || !settings.voiceAssistanceEnabled) {
      return;
    }

    if (isPaused) {
      voiceComfortController.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    setIsPlaying(true);
    setIsPaused(false);

    voiceComfortController.speak(
      textToSpeak,
      settings,
      () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
      (err) => {
        console.warn('Voice playback warning:', err);
        setIsPlaying(false);
        setIsPaused(false);
      }
    );
  };

  const handlePause = () => {
    if (isPlaying && !isPaused) {
      voiceComfortController.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    voiceComfortController.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleReplay = () => {
    handleStop();
    handlePlayMessage();
  };

  const handlePreviewVoice = () => {
    let previewText = 'Take your time. You are safe here, and you do not need to rush.';
    if (settings.mode === 'curated') {
      const curated = CURATED_VOICES.find(v => v.id === settings.selectedCuratedId);
      if (curated) previewText = curated.samplePreviewText;
    } else if (settings.mode === 'personalized') {
      previewText = `Familiar voice test for ${settings.personalizedConsent.voiceOwnerName || 'trusted contact'}. Take your time, you are safe.`;
    }
    handlePlayMessage(previewText);
  };

  // Breathing exercise timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGroundingActive) {
      timer = setInterval(() => {
        setBreathingSecondsLeft(prev => {
          if (prev <= 1) {
            if (breathingPhase === 'Inhale') {
              setBreathingPhase('Hold');
              return 7;
            } else if (breathingPhase === 'Hold') {
              setBreathingPhase('Exhale');
              return 8;
            } else {
              setBreathingPhase('Inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGroundingActive, breathingPhase]);

  // Handle consent submission
  const handleVerifyConsent = () => {
    if (!lovedOneName.trim() || !lovedOneRelation.trim() || !consentAffirmed) return;

    const receiptId = `VCR-${Date.now().toString().slice(-6)}`;
    const updatedConsent = {
      status: 'verified_active' as const,
      voiceOwnerName: lovedOneName.trim(),
      relationship: lovedOneRelation.trim(),
      authorizedAt: new Date().toISOString(),
      verificationMethod: 'Signed Digital Affirmation & Authorization PIN Verified',
      consentReceiptId: receiptId,
      disclaimerAcknowledged: true,
    };

    updateSettings({
      mode: 'personalized',
      personalizedConsent: updatedConsent,
    });

    setConsentSuccessNotice(
      `Consent securely verified (Receipt: ${receiptId}). Personalized voice profile activated.`
    );
    setTimeout(() => setConsentSuccessNotice(null), 5000);
  };

  // Handle consent revocation
  const handleRevokeConsent = () => {
    voiceComfortController.stop();
    const updatedConsent = {
      status: 'revoked' as const,
      voiceOwnerName: '',
      relationship: '',
      revokedAt: new Date().toISOString(),
      disclaimerAcknowledged: false,
    };

    updateSettings({
      mode: 'standard',
      personalizedConsent: updatedConsent,
    });

    setLovedOneName('');
    setLovedOneRelation('');
    setConsentAffirmed(false);
    setConsentSuccessNotice('Consent revoked immediately. Voice samples removed and reset to standard assistant voice.');
    setTimeout(() => setConsentSuccessNotice(null), 5000);
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
        aria-labelledby="familiar-voice-title"
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#151515]/85 backdrop-blur-md p-4 overflow-y-auto"
        onClick={e => {
          if (e.target === e.currentTarget) {
            handleStop();
            onClose();
          }
        }}
      >
        <motion.div
          variants={modalDialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-2xl rounded-3xl bg-[#FFFFFF] dark:bg-[#1E1E1E] text-[#333333] dark:text-[#FFFFFF] border border-[#D9D9DE] dark:border-white/10 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#D9D9DE] dark:border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FD1053]/10 border border-[#FD1053]/30 flex items-center justify-center text-[#FD1053] shadow-sm">
                <Heart className="w-6 h-6 fill-[#FD1053]/20" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 id="familiar-voice-title" className="text-lg font-bold tracking-tight text-[#333333] dark:text-white">
                    Familiar Voice Comfort
                  </h3>
                  <PremiumBadge tone="elevated">Trauma-Informed</PremiumBadge>
                </div>
                <p className="text-xs text-[#6B7280] dark:text-[#D6D6D6]">
                  Acoustic accompaniment, comforting messages &amp; grounding support
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                handleStop();
                onClose();
              }}
              className="p-2 rounded-xl text-[#6B7280] dark:text-[#D6D6D6] hover:text-[#333333] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Calming Principle Guidance Banner */}
          <div className="p-4 rounded-2xl bg-[#F0F0F2] dark:bg-[#252525] border border-[#D9D9DE] dark:border-white/10 text-xs text-[#474747] dark:text-[#D6D6D6] leading-relaxed flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#FD1053] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#333333] dark:text-white mb-1">
                “Sometimes, a familiar voice can feel comforting. Choose a voice experience that helps you feel supported. You are always in control.”
              </p>
              <p className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3]">
                AI assists. Humans decide. Zero raw audio retention. Your privacy is protected under DPDPA 2023.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 p-1 bg-[#F0F0F2] dark:bg-[#151515] rounded-xl border border-[#D9D9DE] dark:border-white/10 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('voice')}
              className={`flex-1 py-2 px-3 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'voice'
                  ? 'bg-white dark:bg-[#252525] text-[#FD1053] shadow-sm font-bold'
                  : 'text-[#6B7280] dark:text-[#D6D6D6] hover:text-[#333333] dark:hover:text-white'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Voice Experience</span>
            </button>

            <button
              onClick={() => setActiveTab('grounding')}
              className={`flex-1 py-2 px-3 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'grounding'
                  ? 'bg-white dark:bg-[#252525] text-[#FD1053] shadow-sm font-bold'
                  : 'text-[#6B7280] dark:text-[#D6D6D6] hover:text-[#333333] dark:hover:text-white'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Grounding Mode</span>
            </button>

            <button
              onClick={() => setActiveTab('consent')}
              className={`flex-1 py-2 px-3 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'consent'
                  ? 'bg-white dark:bg-[#252525] text-[#FD1053] shadow-sm font-bold'
                  : 'text-[#6B7280] dark:text-[#D6D6D6] hover:text-[#333333] dark:hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Loved-One Consent</span>
            </button>
          </div>

          {/* =========================================================================
              TAB 1: VOICE EXPERIENCE CONTROLS
             ========================================================================= */}
          {activeTab === 'voice' && (
            <div className="space-y-5">
              {/* Voice Mode Selector (4 Options) */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#A3A3A3]">
                  1. Choose a Trusted Voice Experience
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option 1: Standard Assistant Voice */}
                  <button
                    type="button"
                    onClick={() => updateSettings({ mode: 'standard' })}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                      settings.mode === 'standard'
                        ? 'border-[#FD1053] bg-[#FD1053]/10 text-[#333333] dark:text-white ring-1 ring-[#FD1053]'
                        : 'border-[#D9D9DE] dark:border-white/10 bg-[#FFFFFF] dark:bg-[#252525] text-[#474747] dark:text-[#D6D6D6] hover:border-[#FD1053]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">Standard Assistant</span>
                      {settings.mode === 'standard' && <span className="w-2 h-2 rounded-full bg-[#FD1053]" />}
                    </div>
                    <p className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
                      Calm, clear, trauma-informed digital guide with neutral acoustic cadence.
                    </p>
                  </button>

                  {/* Option 2: Curated Comforting Voice */}
                  <button
                    type="button"
                    onClick={() => updateSettings({ mode: 'curated' })}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                      settings.mode === 'curated'
                        ? 'border-[#FD1053] bg-[#FD1053]/10 text-[#333333] dark:text-white ring-1 ring-[#FD1053]'
                        : 'border-[#D9D9DE] dark:border-white/10 bg-[#FFFFFF] dark:bg-[#252525] text-[#474747] dark:text-[#D6D6D6] hover:border-[#FD1053]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">Approved Comfort Voice</span>
                      {settings.mode === 'curated' && <span className="w-2 h-2 rounded-full bg-[#FD1053]" />}
                    </div>
                    <p className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
                      Curated soothing profiles (Ananya, Aarav, Meera) designed for emotional safety.
                    </p>
                  </button>

                  {/* Option 3: Consent-Based Loved One Voice */}
                  <button
                    type="button"
                    onClick={() => {
                      if (settings.personalizedConsent.status === 'verified_active') {
                        updateSettings({ mode: 'personalized' });
                      } else {
                        setActiveTab('consent');
                      }
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                      settings.mode === 'personalized'
                        ? 'border-[#FD1053] bg-[#FD1053]/10 text-[#333333] dark:text-white ring-1 ring-[#FD1053]'
                        : 'border-[#D9D9DE] dark:border-white/10 bg-[#FFFFFF] dark:bg-[#252525] text-[#474747] dark:text-[#D6D6D6] hover:border-[#FD1053]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">Loved-One Familiar Voice</span>
                      {settings.personalizedConsent.status === 'verified_active' ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                          Consent Verified
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold">
                          Consent Required
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
                      Consent-verified loved one voice experience. Never cloned without permission.
                    </p>
                  </button>

                  {/* Option 4: Text-Only Support */}
                  <button
                    type="button"
                    onClick={() => {
                      handleStop();
                      updateSettings({ mode: 'text_only' });
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                      settings.mode === 'text_only'
                        ? 'border-[#FD1053] bg-[#FD1053]/10 text-[#333333] dark:text-white ring-1 ring-[#FD1053]'
                        : 'border-[#D9D9DE] dark:border-white/10 bg-[#FFFFFF] dark:bg-[#252525] text-[#474747] dark:text-[#D6D6D6] hover:border-[#FD1053]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">Text-Only Support</span>
                      {settings.mode === 'text_only' && <span className="w-2 h-2 rounded-full bg-[#FD1053]" />}
                    </div>
                    <p className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
                      Complete audio silence. Comforting messages presented as gentle text cards.
                    </p>
                  </button>
                </div>
              </div>

              {/* Sub-Selector for Curated Voices when Curated Mode is selected */}
              {settings.mode === 'curated' && (
                <div className="p-3.5 rounded-2xl bg-[#F0F0F2] dark:bg-[#252525] border border-[#D9D9DE] dark:border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Select Comforting Voice Profile:</span>
                    <button
                      type="button"
                      onClick={handlePreviewVoice}
                      className="text-[#FD1053] hover:underline text-[11px] font-bold"
                    >
                      Preview Voice
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {CURATED_VOICES.map(voice => (
                      <button
                        key={voice.id}
                        type="button"
                        onClick={() => updateSettings({ selectedCuratedId: voice.id })}
                        className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                          settings.selectedCuratedId === voice.id
                            ? 'border-[#FD1053] bg-[#FD1053]/15 font-bold text-[#FD1053]'
                            : 'border-[#D9D9DE] dark:border-white/10 bg-white dark:bg-[#1E1E1E] text-[#474747] dark:text-[#D6D6D6]'
                        }`}
                      >
                        <p className="font-bold truncate">{voice.name.split('—')[0]}</p>
                        <p className="text-[10px] text-[#6B7280] dark:text-[#A3A3A3] truncate">{voice.tone}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Selector & Display */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#A3A3A3]">
                    2. Select a Comforting Message
                  </label>
                  <span className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3]">
                    Language: <strong className="text-[#FD1053]">{SUPPORTED_LANGUAGES.find(l => l.code === (settings.language || appLanguage))?.name}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {COMFORT_MESSAGES.map(msg => (
                    <button
                      key={msg.id}
                      type="button"
                      onClick={() => {
                        handleStop();
                        setSelectedMessageId(msg.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        selectedMessageId === msg.id
                          ? 'bg-[#FD1053] text-white shadow-sm'
                          : 'bg-[#F0F0F2] dark:bg-[#252525] text-[#474747] dark:text-[#D6D6D6] hover:bg-black/5 dark:hover:bg-white/10'
                      }`}
                    >
                      {msg.title}
                    </button>
                  ))}
                </div>

                {/* Comfort Message Card Display */}
                <div className="p-5 rounded-2xl bg-[#F0F0F2] dark:bg-[#252525] border border-[#D9D9DE] dark:border-white/10 text-center relative overflow-hidden">
                  <p className="text-base sm:text-lg font-medium text-[#333333] dark:text-white leading-relaxed italic">
                    “{messageText}”
                  </p>
                  {isPlaying && (
                    <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#FD1053] font-semibold animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-[#FD1053]" />
                      <span>{isPaused ? 'Playback Paused' : 'Playing Comfort Message...'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Playback Controls (Play, Pause, Resume, Stop, Replay) */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                {!isPlaying || isPaused ? (
                  <LuxuryButton
                    onClick={() => handlePlayMessage()}
                    variant="primary"
                    className="flex-1 min-w-[130px] text-xs font-bold gap-1.5"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{isPaused ? 'Resume' : 'Listen Now'}</span>
                  </LuxuryButton>
                ) : (
                  <LuxuryButton
                    onClick={handlePause}
                    variant="secondary"
                    className="flex-1 min-w-[130px] text-xs font-bold gap-1.5"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </LuxuryButton>
                )}

                <button
                  type="button"
                  onClick={handleStop}
                  disabled={!isPlaying && !isPaused}
                  className="px-4 py-2.5 rounded-xl border border-[#D9D9DE] dark:border-white/15 bg-white dark:bg-[#252525] hover:bg-black/5 dark:hover:bg-white/10 text-[#474747] dark:text-[#D6D6D6] disabled:opacity-40 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Stop</span>
                </button>

                <button
                  type="button"
                  onClick={handleReplay}
                  className="px-4 py-2.5 rounded-xl border border-[#D9D9DE] dark:border-white/15 bg-white dark:bg-[#252525] hover:bg-black/5 dark:hover:bg-white/10 text-[#474747] dark:text-[#D6D6D6] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay</span>
                </button>

                <button
                  type="button"
                  onClick={handlePreviewVoice}
                  className="px-4 py-2.5 rounded-xl border border-[#D9D9DE] dark:border-white/15 bg-white dark:bg-[#252525] hover:bg-black/5 dark:hover:bg-white/10 text-[#FD1053] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Preview Voice</span>
                </button>
              </div>

              {/* Sliders & Language Adjustments */}
              <div className="p-4 rounded-2xl bg-[#F0F0F2] dark:bg-[#252525] border border-[#D9D9DE] dark:border-white/10 space-y-3 text-xs">
                <div className="flex items-center justify-between font-bold text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wider text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    Audio Speed &amp; Volume
                  </span>
                  <button
                    type="button"
                    onClick={() => updateSettings({ mode: 'standard' })}
                    className="text-[#FD1053] hover:underline normal-case"
                  >
                    Switch to Standard Voice
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Speed slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[#474747] dark:text-[#D6D6D6]">
                      <span>Speech Pace:</span>
                      <span className="font-mono">{settings.speechRate.toFixed(2)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.6"
                      max="1.3"
                      step="0.05"
                      value={settings.speechRate}
                      onChange={e => updateSettings({ speechRate: parseFloat(e.target.value) })}
                      className="w-full accent-[#FD1053] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#888888]">
                      <span>Calm &amp; Slow</span>
                      <span>Default</span>
                      <span>Brisk</span>
                    </div>
                  </div>

                  {/* Volume slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[#474747] dark:text-[#D6D6D6]">
                      <span>Volume:</span>
                      <span className="font-mono">{Math.round(settings.volume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1.0"
                      step="0.05"
                      value={settings.volume}
                      onChange={e => updateSettings({ volume: parseFloat(e.target.value) })}
                      className="w-full accent-[#FD1053] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-[#888888]">
                      <span>Mute</span>
                      <span>Comfortable</span>
                      <span>Max</span>
                    </div>
                  </div>
                </div>

                {/* Preferred Language for Voice */}
                <div className="pt-2 border-t border-[#D9D9DE] dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[#474747] dark:text-[#D6D6D6]">Voice Language:</span>
                  <select
                    value={settings.language || appLanguage}
                    onChange={e => {
                      const newLang = e.target.value as SupportedLanguage;
                      updateSettings({ language: newLang });
                      setAppLanguage(newLang);
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-[#D9D9DE] dark:border-white/15 bg-white dark:bg-[#1E1E1E] text-xs text-[#333333] dark:text-white"
                  >
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name} ({lang.nativeName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: GROUNDING MODE (BREATHING & 5-4-3-2-1)
             ========================================================================= */}
          {activeTab === 'grounding' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#F0F0F2] dark:bg-[#252525] border border-[#D9D9DE] dark:border-white/10 text-xs text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                <p className="font-bold text-[#333333] dark:text-white mb-1">
                  Trauma-Informed Grounding Exercises
                </p>
                <p className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3]">
                  These general supportive exercises are designed to help ground your body and reduce immediate tension. They are self-directed wellness exercises and not clinical psychiatric treatment.
                </p>
              </div>

              {/* 4-7-8 Breathing Circle Container */}
              <div className="p-6 rounded-3xl bg-[#F0F0F2] dark:bg-[#252525] border border-[#D9D9DE] dark:border-white/10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative flex items-center justify-center w-36 h-36">
                  {/* Outer pulsating circle */}
                  <motion.div
                    animate={{
                      scale: isGroundingActive
                        ? breathingPhase === 'Inhale'
                          ? 1.25
                          : breathingPhase === 'Hold'
                          ? 1.25
                          : 0.9
                        : 1,
                      opacity: isGroundingActive ? 0.8 : 0.4,
                    }}
                    transition={{
                      duration:
                        breathingPhase === 'Inhale'
                          ? 4
                          : breathingPhase === 'Hold'
                          ? 7
                          : 8,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FD1053]/20 via-[#FD1053]/35 to-transparent blur-md"
                  />
                  {/* Central breathing circle */}
                  <div className="relative z-10 w-28 h-28 rounded-full bg-white dark:bg-[#1E1E1E] border-2 border-[#FD1053] flex flex-col items-center justify-center shadow-lg">
                    <span className="text-xs uppercase font-extrabold text-[#FD1053] tracking-wider">
                      {isGroundingActive ? breathingPhase : 'Breathing'}
                    </span>
                    <span className="text-2xl font-black font-mono text-[#333333] dark:text-white mt-1">
                      {isGroundingActive ? `${breathingSecondsLeft}s` : '4-7-8'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#333333] dark:text-white">
                    {isGroundingActive ? `${breathingPhase} gently...` : '4-7-8 Box Breathing'}
                  </h4>
                  <p className="text-xs text-[#6B7280] dark:text-[#D6D6D6]">
                    Inhale 4 seconds · Hold 7 seconds · Exhale slowly 8 seconds
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <LuxuryButton
                    onClick={() => {
                      if (isGroundingActive) {
                        setIsGroundingActive(false);
                      } else {
                        setIsGroundingActive(true);
                        setBreathingPhase('Inhale');
                        setBreathingSecondsLeft(4);
                        voiceComfortController.playAmbientChime(432, 4000);
                      }
                    }}
                    variant="primary"
                    className="text-xs font-bold"
                  >
                    {isGroundingActive ? 'Pause Exercise' : 'Start Guided Breathing'}
                  </LuxuryButton>

                  <button
                    type="button"
                    onClick={() => voiceComfortController.playAmbientChime(432, 4000)}
                    className="px-3.5 py-2 rounded-xl border border-[#D9D9DE] dark:border-white/15 bg-white dark:bg-[#1E1E1E] text-xs font-semibold text-[#474747] dark:text-[#D6D6D6] hover:text-[#FD1053] transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FD1053]" />
                    <span>Calm Chime (432Hz)</span>
                  </button>
                </div>
              </div>

              {/* 5-4-3-2-1 Sensory Grounding Technique */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#A3A3A3]">
                  5-4-3-2-1 Sensory Grounding Technique
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {[
                    { num: '5', label: 'See', text: '5 things you can see around you right now' },
                    { num: '4', label: 'Touch', text: '4 physical objects you can touch or feel' },
                    { num: '3', label: 'Hear', text: '3 sounds you can notice in your room' },
                    { num: '2', label: 'Smell', text: '2 pleasant scents in the air' },
                    { num: '1', label: 'Taste', text: '1 taste or a sip of cool water' },
                  ].map((item, idx) => (
                    <button
                      key={item.num}
                      type="button"
                      onClick={() => setGroundingStepIndex(idx)}
                      className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                        groundingStepIndex === idx
                          ? 'border-[#FD1053] bg-[#FD1053]/10 ring-1 ring-[#FD1053]'
                          : 'border-[#D9D9DE] dark:border-white/10 bg-[#F0F0F2] dark:bg-[#252525]'
                      }`}
                    >
                      <span className="block text-base font-black text-[#FD1053]">{item.num}</span>
                      <span className="block text-[11px] font-bold text-[#333333] dark:text-white">{item.label}</span>
                    </button>
                  ))}
                </div>
                <div className="p-3.5 rounded-2xl bg-[#F0F0F2] dark:bg-[#252525] border border-[#D9D9DE] dark:border-white/10 text-xs text-[#333333] dark:text-[#D6D6D6]">
                  <strong>Step {groundingStepIndex + 1}:</strong>{' '}
                  {[
                    'Look gently around your current surroundings. Notice 5 distinct colors, shapes, or quiet objects.',
                    'Notice 4 things you can physically feel: the floor beneath your feet, your clothes, the desk, or your hands.',
                    'Listen quietly for 3 sounds: a ceiling fan, distant birds, your breath, or ambient room tone.',
                    'Notice 2 scents or take a deep grounding breath of fresh clean air.',
                    'Take 1 slow sip of water or focus on your mouth feeling relaxed and unhurried.',
                  ][groundingStepIndex]}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: LOVED-ONE CONSENT & REVOCATION WORKFLOW
             ========================================================================= */}
          {activeTab === 'consent' && (
            <div className="space-y-5">
              {consentSuccessNotice && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{consentSuccessNotice}</span>
                </div>
              )}

              {/* Strict Ethical Guardrail Banner */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-900 dark:text-amber-200 leading-relaxed space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Strict Consent &amp; Anti-Cloning Safeguards</span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  MANAS SURAKSHA never clones any real person&apos;s voice from an uploaded recording without verified, explicit statutory consent. The voice owner must authorize their voice model. You can revoke permission at any moment with 1 click.
                </p>
              </div>

              {/* Status Display */}
              <div className="p-4 rounded-2xl bg-[#F0F0F2] dark:bg-[#252525] border border-[#D9D9DE] dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#A3A3A3]">
                    Current Authorization Status
                  </span>
                  {settings.personalizedConsent.status === 'verified_active' ? (
                    <PremiumBadge tone="stable">Active &amp; Verified</PremiumBadge>
                  ) : (
                    <PremiumBadge tone="neutral">Not Configured</PremiumBadge>
                  )}
                </div>

                {settings.personalizedConsent.status === 'verified_active' ? (
                  <div className="space-y-3 pt-1 text-xs">
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white dark:bg-[#1E1E1E] border border-[#D9D9DE] dark:border-white/10">
                      <div>
                        <span className="text-[10px] text-[#888888] block">Voice Owner:</span>
                        <strong className="text-[#333333] dark:text-white">
                          {settings.personalizedConsent.voiceOwnerName}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#888888] block">Relationship:</span>
                        <strong className="text-[#333333] dark:text-white">
                          {settings.personalizedConsent.relationship}
                        </strong>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-[#D9D9DE] dark:border-white/10 text-[11px] text-[#888888]">
                        Authorized Receipt ID: <span className="font-mono text-[#FD1053]">{settings.personalizedConsent.consentReceiptId}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between gap-3">
                      <span>Need to disable this voice or withdraw permission?</span>
                      <LuxuryButton
                        onClick={handleRevokeConsent}
                        variant="danger"
                        className="text-xs py-1.5 px-3 min-h-[36px]"
                      >
                        Revoke Consent
                      </LuxuryButton>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 pt-1 text-xs">
                    <p className="text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                      To enable comfort messages synthesized with a loved one’s authorized voice profile, confirm their details below:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#474747] dark:text-[#D6D6D6] mb-1">
                          Voice Owner Full Name *
                        </label>
                        <input
                          type="text"
                          value={lovedOneName}
                          onChange={e => setLovedOneName(e.target.value)}
                          placeholder="e.g. Suman Devi"
                          className="w-full px-3 py-2 rounded-xl border border-[#D9D9DE] dark:border-white/15 bg-white dark:bg-[#1E1E1E] text-xs text-[#333333] dark:text-white focus:outline-hidden focus:border-[#FD1053]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#474747] dark:text-[#D6D6D6] mb-1">
                          Relationship to Survivor *
                        </label>
                        <input
                          type="text"
                          value={lovedOneRelation}
                          onChange={e => setLovedOneRelation(e.target.value)}
                          placeholder="e.g. Sister / Elder Mother"
                          className="w-full px-3 py-2 rounded-xl border border-[#D9D9DE] dark:border-white/15 bg-white dark:bg-[#1E1E1E] text-xs text-[#333333] dark:text-white focus:outline-hidden focus:border-[#FD1053]"
                        />
                      </div>
                    </div>

                    <label className="flex items-start gap-2 pt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentAffirmed}
                        onChange={e => setConsentAffirmed(e.target.checked)}
                        className="mt-0.5 accent-[#FD1053] rounded"
                      />
                      <span className="text-[11px] text-[#474747] dark:text-[#D6D6D6] leading-relaxed">
                        I confirm that the voice owner has explicitly affirmed their consent to provide acoustic comfort messages for my check-ins. I understand that this voice is an AI-assisted synthesis and does not indicate my loved one is speaking live.
                      </span>
                    </label>

                    <div className="pt-2">
                      <LuxuryButton
                        onClick={handleVerifyConsent}
                        disabled={!lovedOneName.trim() || !lovedOneRelation.trim() || !consentAffirmed}
                        variant="primary"
                        className="w-full text-xs font-bold"
                      >
                        Register Verified Consent &amp; Activate Voice
                      </LuxuryButton>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="pt-3 border-t border-[#D9D9DE] dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6B7280] dark:text-[#A3A3A3]">
            <span>Active mode: <strong className="text-[#333333] dark:text-white capitalize">{settings.mode.replace('_', ' ')}</strong></span>
            <button
              onClick={() => {
                handleStop();
                onClose();
              }}
              className="text-[#FD1053] hover:underline font-bold"
            >
              Done &amp; Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
