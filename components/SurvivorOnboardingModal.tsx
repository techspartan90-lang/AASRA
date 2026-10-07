'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { SurvivorOnboardingData } from '@/types';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/lib/i18n';
import { LuxuryButton } from '@/components/design-system/LuxuryButton';
import { PremiumBadge } from '@/components/design-system/PremiumBadge';
import {
  ShieldCheck,
  HeartPulse,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  Languages,
  PhoneCall,
  MessageSquare,
  Smartphone,
  Laptop,
  Radio,
  Clock,
  UserCheck,
  Sliders,
  Check,
  Volume2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdropVariants, modalDialogVariants } from '@/lib/design-system';

interface SurvivorOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: SurvivorOnboardingData) => void;
}

export function SurvivorOnboardingModal({
  isOpen,
  onClose,
  onComplete,
}: SurvivorOnboardingModalProps) {
  const { language, setLanguage, setIsEmergencyModalOpen, setIsVoiceAssistantOpen } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 7;

  // Onboarding state values
  const [consentGranted, setConsentGranted] = useState<boolean>(true);
  const [ethicalUnderstood, setEthicalUnderstood] = useState<boolean>(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language || 'hi');
  const [preferredChannel, setPreferredChannel] = useState<'sms' | 'ivrs' | 'chatbot' | 'app' | 'web'>('chatbot');
  const [frequency, setFrequency] = useState<'daily' | 'every_few_days' | 'weekly' | 'custom'>('weekly');
  const [customFrequencyNote, setCustomFrequencyNote] = useState<string>('After court hearings and on-demand');

  // Step 6: Trusted contact
  const [hasTrustedContact, setHasTrustedContact] = useState<boolean>(false);
  const [contactName, setContactName] = useState<string>('');
  const [contactRelation, setContactRelation] = useState<string>('Paralegal Advocate');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactTrigger, setContactTrigger] = useState<'missed_checkins' | 'emergency_only' | 'explicit_confirm'>('explicit_confirm');

  // Step 7: Privacy controls
  const [collectWellBeing, setCollectWellBeing] = useState<boolean>(true);
  const [collectSleepNotes, setCollectSleepNotes] = useState<boolean>(true);
  const [collectVoiceAcoustics, setCollectVoiceAcoustics] = useState<boolean>(false);
  const [shareWithCounsellor, setShareWithCounsellor] = useState<boolean>(true);
  const [shareAnonymizedDistrict, setShareAnonymizedDistrict] = useState<boolean>(true);
  const [blockPoliceProsecution, setBlockPoliceProsecution] = useState<boolean>(true);
  const [preferredTime, setPreferredTime] = useState<'morning' | 'afternoon' | 'evening'>('evening');
  const [discreetMode, setDiscreetMode] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleFinish = () => {
    const data: SurvivorOnboardingData = {
      consentGranted,
      language: selectedLanguage,
      preferredChannel,
      frequency,
      customFrequencyNote: frequency === 'custom' ? customFrequencyNote : undefined,
      trustedContact: hasTrustedContact
        ? {
            enabled: true,
            name: contactName,
            relationship: contactRelation,
            phone: contactPhone,
            triggerCondition: contactTrigger,
          }
        : { enabled: false },
      privacyControls: {
        collectWellBeingScore: collectWellBeing,
        collectSleepNotes,
        collectVoiceAcoustics,
        shareWithCounsellor,
        shareAnonymizedDistrict,
        blockPoliceProsecution,
        preferredTime,
        discreetMode,
      },
      completedAt: new Date().toISOString(),
    };

    setLanguage(selectedLanguage as SupportedLanguage);
    onComplete(data);
    onClose();
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
        aria-labelledby="onboarding-step-title"
        className="fixed inset-0 z-50 bg-[#151515]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          variants={modalDialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-2xl bg-[#252525] dark:bg-[#1E1E1E] border border-[rgba(255,255,255,0.12)] rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]"
        >
          {/* Top Header */}
          <div className="bg-[#333333] px-6 py-4 flex items-center justify-between shrink-0 border-b border-[rgba(255,255,255,0.10)]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#474747] border border-[rgba(253,16,83,0.35)] text-[#FD1053] flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  MANAS SURAKSHA · Survivor Care Onboarding
                </span>
                <span className="text-[11px] text-[#D6D6D6] block">
                  Step {currentStep} of {totalSteps}: {
                    currentStep === 1 ? 'Sanctuary & Control' :
                    currentStep === 2 ? 'Informed Consent' :
                    currentStep === 3 ? 'Language Preference' :
                    currentStep === 4 ? 'Communication Channel' :
                    currentStep === 5 ? 'Check-In Cadence' :
                    currentStep === 6 ? 'Trusted Contact (Optional)' :
                    'Privacy & Boundaries'
                  }
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#474747] hover:bg-[#555555] text-[#D6D6D6] hover:text-white flex items-center justify-center transition cursor-pointer"
              aria-label="Exit onboarding"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Step Progress Bar */}
          <div className="w-full bg-[#1E1E1E] h-1 shrink-0">
            <div
              className="bg-[#FD1053] h-1 transition-all duration-300 shadow-[0_0_8px_#FD1053]"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>

          {/* Scrollable Step Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* STEP 1: WELCOME */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-[#333333] border border-[rgba(253,16,83,0.35)] text-[#FD1053] flex items-center justify-center">
                  <HeartPulse className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-xs font-mono font-bold text-[#FD1053] uppercase tracking-wider">
                    Welcome to Manas Suraksha
                  </span>
                  <h2 id="onboarding-step-title" className="text-2xl font-bold tracking-tight text-white mt-1">
                    You are in sovereign control of your journey.
                  </h2>
                  <p className="mt-3 text-sm text-[#D6D6D6] leading-relaxed">
                    The justice process can be exhausting and stressful. Manas Suraksha walks alongside you with privacy-first mental well-being monitoring and gentle distress recognition.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.08)] text-xs text-[#D6D6D6] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#FD1053] shrink-0" />
                    <span>Our Core Promises to You:</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] list-disc list-inside text-[#D6D6D6]">
                    <li><strong className="text-white">Zero forced disclosure:</strong> We will never ask you to recount traumatic details.</li>
                    <li><strong className="text-white">Your cadence:</strong> You choose when, how, and through which channel we reach out.</li>
                    <li><strong className="text-white">Complete sovereignty:</strong> You can pause or revoke consent at any moment without penalty.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* STEP 2: CONSENT */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-[#333333] border border-[rgba(253,16,83,0.35)] text-[#FD1053] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-xs font-mono font-bold text-[#FD1053] uppercase tracking-wider">
                    Informed Consent &amp; Safeguards
                  </span>
                  <h2 id="onboarding-step-title" className="text-2xl font-bold tracking-tight text-white mt-1">
                    How your privacy is protected.
                  </h2>
                  <p className="mt-2 text-sm text-[#D6D6D6] leading-relaxed">
                    Under DPDPA 2023, everything is voluntary, granular, and explicitly governed by you.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="p-4 rounded-2xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.10)] flex items-start gap-3 cursor-pointer hover:border-[#FD1053] transition">
                    <input
                      type="checkbox"
                      checked={consentGranted}
                      onChange={(e) => setConsentGranted(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-[#FD1053] rounded cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-white block">
                        Voluntary Well-Being Monitoring (Consent)
                      </span>
                      <span className="text-[#D6D6D6] mt-1 block leading-relaxed">
                        I agree to receive structured periodic micro check-ins to monitor my sleep, well-being, and perceived safety. I can pause or delete my data anytime.
                      </span>
                    </div>
                  </label>

                  <label className="p-4 rounded-2xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.10)] flex items-start gap-3 cursor-pointer hover:border-[#FD1053] transition">
                    <input
                      type="checkbox"
                      checked={ethicalUnderstood}
                      onChange={(e) => setEthicalUnderstood(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-[#FD1053] rounded cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-white block">
                        Ethical &amp; Non-Clinical Screening Recognition
                      </span>
                      <span className="text-[#D6D6D6] mt-1 block leading-relaxed">
                        I understand that Manas Suraksha is an early distress screening assistant, not a clinical diagnostic tool or court deposition system.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 3: PREFERRED LANGUAGE */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-[#333333] border border-[rgba(253,16,83,0.35)] text-[#FD1053] flex items-center justify-center">
                  <Languages className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-xs font-mono font-bold text-[#FD1053] uppercase tracking-wider">
                    Linguistic Comfort
                  </span>
                  <h2 id="onboarding-step-title" className="text-2xl font-bold tracking-tight text-white mt-1">
                    Choose your preferred language.
                  </h2>
                  <p className="mt-2 text-sm text-[#D6D6D6] leading-relaxed">
                    All check-ins, text prompts, voice calls, and counsellor communication will be delivered in this language.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setSelectedLanguage(lang.code)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between min-h-[70px] ${
                        selectedLanguage === lang.code
                          ? 'border-[#FD1053] bg-[#333333] text-white shadow-sm'
                          : 'border-[rgba(255,255,255,0.08)] bg-[#1E1E1E] text-[#D6D6D6] hover:bg-[#2a2a2a]'
                      }`}
                    >
                      <span className="text-xs font-bold text-white">
                        {lang.nativeName}
                      </span>
                      <span className="text-[11px] text-[#888888]">
                        {lang.name}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsVoiceAssistantOpen(true)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#FD1053] hover:underline cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Test speech &amp; voice readability</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PREFERRED COMMUNICATION CHANNEL */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-[#333333] border border-[rgba(253,16,83,0.35)] text-[#FD1053] flex items-center justify-center">
                  <Radio className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-xs font-mono font-bold text-[#FD1053] uppercase tracking-wider">
                    Accessible Ingestion
                  </span>
                  <h2 id="onboarding-step-title" className="text-2xl font-bold tracking-tight text-white mt-1">
                    How would you prefer to receive check-ins?
                  </h2>
                  <p className="mt-2 text-sm text-[#D6D6D6] leading-relaxed">
                    Select the channel that feels safest, most convenient, and fits your phone access.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      id: 'chatbot',
                      label: 'Chatbot (Messaging)',
                      icon: <MessageSquare className="w-4 h-4" />,
                      desc: 'Gentle text check-ins with mood cards inside this secure portal.',
                      badge: 'Recommended',
                    },
                    {
                      id: 'ivrs',
                      label: 'IVRS (Automated Voice Call)',
                      icon: <PhoneCall className="w-4 h-4" />,
                      desc: 'Toll-free phone call in your dialect; answer by keypad numbers or speaking.',
                      badge: 'Voice-First',
                    },
                    {
                      id: 'sms',
                      label: 'SMS (Text Message)',
                      icon: <Radio className="w-4 h-4" />,
                      desc: 'Simple 1–5 numerical replies on any basic phone without needing internet.',
                      badge: 'Offline 2G',
                    },
                    {
                      id: 'app',
                      label: 'Mobile App (PWA)',
                      icon: <Smartphone className="w-4 h-4" />,
                      desc: 'Encrypted mobile application with biometric lock and disguise mode.',
                      badge: 'Discreet',
                    },
                    {
                      id: 'web',
                      label: 'Web Portal',
                      icon: <Laptop className="w-4 h-4" />,
                      desc: 'Accessible browser dashboard with full history and privacy toggles.',
                      badge: 'Browser',
                    },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setPreferredChannel(ch.id as any)}
                      className={`w-full p-4 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between gap-4 ${
                        preferredChannel === ch.id
                          ? 'border-[#FD1053] bg-[#333333] shadow-sm'
                          : 'border-[rgba(255,255,255,0.08)] bg-[#1E1E1E] hover:bg-[#2a2a2a]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#252525] text-[#D6D6D6] flex items-center justify-center shrink-0">
                          {ch.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">
                              {ch.label}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#474747] text-[#D6D6D6]">
                              {ch.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#888888] mt-0.5">
                            {ch.desc}
                          </p>
                        </div>
                      </div>
                      {preferredChannel === ch.id && (
                        <Check className="w-4 h-4 text-[#FD1053] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: CHECK-IN CADENCE */}
            {currentStep === 5 && (
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-[#333333] border border-[rgba(253,16,83,0.35)] text-[#FD1053] flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-xs font-mono font-bold text-[#FD1053] uppercase tracking-wider">
                    Survivor Pacing
                  </span>
                  <h2 id="onboarding-step-title" className="text-2xl font-bold tracking-tight text-white mt-1">
                    How frequently should we check in?
                  </h2>
                  <p className="mt-2 text-sm text-[#D6D6D6] leading-relaxed">
                    We adapt to what feels manageable. You can pause check-ins anytime during busy or exhausting periods.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'daily',
                      label: 'Daily Check-In',
                      desc: 'A quick 60-second reflection to maintain continuous comfort.',
                    },
                    {
                      id: 'every_few_days',
                      label: 'Every Few Days',
                      desc: '2 to 3 times per week to monitor trends without fatigue.',
                    },
                    {
                      id: 'weekly',
                      label: 'Weekly (Standard)',
                      desc: 'Once every week on your preferred calm day.',
                    },
                    {
                      id: 'custom',
                      label: 'Custom / Milestone-Based',
                      desc: 'Aligned with court hearing dates or on-demand only.',
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFrequency(item.id as any)}
                      className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between min-h-[90px] ${
                        frequency === item.id
                          ? 'border-[#FD1053] bg-[#333333] shadow-sm'
                          : 'border-[rgba(255,255,255,0.08)] bg-[#1E1E1E] hover:bg-[#2a2a2a]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">
                            {item.label}
                          </span>
                          {frequency === item.id && (
                            <Check className="w-3.5 h-3.5 text-[#FD1053]" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#888888] mt-1 leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {frequency === 'custom' && (
                  <div className="p-3.5 rounded-2xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.08)] space-y-1.5">
                    <label htmlFor="custom-frequency" className="text-xs font-bold text-white">
                      Describe your custom cadence:
                    </label>
                    <input
                      id="custom-frequency"
                      type="text"
                      value={customFrequencyNote}
                      onChange={(e) => setCustomFrequencyNote(e.target.value)}
                      placeholder="e.g. Only following summons or witness testimony dates"
                      className="w-full px-3 py-2 rounded-xl border border-[rgba(255,255,255,0.15)] bg-[#252525] text-xs text-white focus:outline-none focus:border-[#FD1053]"
                    />
                  </div>
                )}
              </div>
            )}

            {/* STEP 6: TRUSTED CONTACT */}
            {currentStep === 6 && (
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-[#333333] border border-[rgba(253,16,83,0.35)] text-[#FD1053] flex items-center justify-center">
                  <UserCheck className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-xs font-mono font-bold text-[#FD1053] uppercase tracking-wider">
                    Optional Safety Net
                  </span>
                  <h2 id="onboarding-step-title" className="text-2xl font-bold tracking-tight text-white mt-1">
                    Designate an advocate or trusted contact.
                  </h2>
                  <p className="mt-2 text-sm text-[#D6D6D6] leading-relaxed">
                    You may designate a trusted family member, paralegal, or NGO advocate. This step is entirely optional.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="p-4 rounded-2xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.10)] flex items-start gap-3 cursor-pointer hover:border-[#FD1053] transition">
                    <input
                      type="checkbox"
                      checked={hasTrustedContact}
                      onChange={(e) => setHasTrustedContact(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-[#FD1053] rounded cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-white block">
                        Enable an emergency secondary contact
                      </span>
                      <span className="text-[#888888] text-[11px] mt-0.5 block">
                        Leave unchecked if you prefer strictly independent communication.
                      </span>
                    </div>
                  </label>

                  {hasTrustedContact && (
                    <div className="p-4 rounded-2xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.08)] space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="contact-name" className="text-xs font-bold text-[#D6D6D6] block mb-1">
                            Contact Name
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="e.g. Meera Devi"
                            className="w-full px-3 py-2 rounded-xl border border-[rgba(255,255,255,0.15)] bg-[#252525] text-xs text-white focus:outline-none focus:border-[#FD1053]"
                          />
                        </div>
                        <div>
                          <label htmlFor="contact-relation" className="text-xs font-bold text-[#D6D6D6] block mb-1">
                            Relationship / Role
                          </label>
                          <input
                            id="contact-relation"
                            type="text"
                            value={contactRelation}
                            onChange={(e) => setContactRelation(e.target.value)}
                            placeholder="e.g. Sister, NGO Case Volunteer"
                            className="w-full px-3 py-2 rounded-xl border border-[rgba(255,255,255,0.15)] bg-[#252525] text-xs text-white focus:outline-none focus:border-[#FD1053]"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="contact-phone" className="text-xs font-bold text-[#D6D6D6] block mb-1">
                          Contact Mobile Number
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="e.g. 98765 00000"
                          className="w-full px-3 py-2 rounded-xl border border-[rgba(255,255,255,0.15)] bg-[#252525] text-xs text-white focus:outline-none focus:border-[#FD1053]"
                        />
                      </div>

                      <div className="pt-1">
                        <label className="text-xs font-bold text-[#D6D6D6] block mb-1">
                          When may this contact be notified?
                        </label>
                        <div className="space-y-1.5 text-xs text-[#D6D6D6]">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="trigger"
                              checked={contactTrigger === 'explicit_confirm'}
                              onChange={() => setContactTrigger('explicit_confirm')}
                              className="accent-[#FD1053] cursor-pointer"
                            />
                            <span>Only when I explicitly tap &ldquo;Notify Contact&rdquo; in check-in</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="trigger"
                              checked={contactTrigger === 'missed_checkins'}
                              onChange={() => setContactTrigger('missed_checkins')}
                              className="accent-[#FD1053] cursor-pointer"
                            />
                            <span>If I miss 3 consecutive check-ins and cannot be reached</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 7: PRIVACY CONTROLS */}
            {currentStep === 7 && (
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-[#333333] border border-[rgba(253,16,83,0.35)] text-[#FD1053] flex items-center justify-center">
                  <Sliders className="w-6 h-6" />
                </div>

                <div>
                  <span className="text-xs font-mono font-bold text-[#FD1053] uppercase tracking-wider">
                    Survivor Privacy Controls
                  </span>
                  <h2 id="onboarding-step-title" className="text-2xl font-bold tracking-tight text-white mt-1">
                    Customize what is collected and shared.
                  </h2>
                  <p className="mt-2 text-sm text-[#D6D6D6] leading-relaxed">
                    Decide exactly what indicators you feel comfortable sharing and who has access.
                  </p>
                </div>

                {/* Group A: Information Collected */}
                <div className="p-4 rounded-2xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.08)] space-y-3">
                  <span className="text-xs font-bold text-white block uppercase tracking-wider">
                    1. Information Collected
                  </span>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white block">
                          Well-Being &amp; Safety Rating (1–5 scale)
                        </span>
                        <span className="text-[11px] text-[#888888]">Core indicator required for early-warning trajectory</span>
                      </div>
                      <PremiumBadge tone="stable">Core Active</PremiumBadge>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.06)]">
                      <div>
                        <span className="font-semibold text-white block">
                          Sleep Quality &amp; Reflections
                        </span>
                        <span className="text-[11px] text-[#888888]">Optional text notes describing stress without trauma recall</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCollectSleepNotes(!collectSleepNotes)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                          collectSleepNotes ? 'bg-[#FD1053] text-white' : 'bg-[#333333] text-[#888888]'
                        }`}
                      >
                        {collectSleepNotes ? 'Included' : 'Excluded'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.06)]">
                      <div>
                        <span className="font-semibold text-white block">
                          Voice Acoustic Prosody Analysis (Optional)
                        </span>
                        <span className="text-[11px] text-[#888888]">Analyze vocal tremor only; audio recordings are never stored</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCollectVoiceAcoustics(!collectVoiceAcoustics)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                          collectVoiceAcoustics ? 'bg-[#FD1053] text-white' : 'bg-[#333333] text-[#888888]'
                        }`}
                      >
                        {collectVoiceAcoustics ? 'Included' : 'Off'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Group B: Who Can Access */}
                <div className="p-4 rounded-2xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.08)] space-y-3">
                  <span className="text-xs font-bold text-white block uppercase tracking-wider">
                    2. Access Boundaries
                  </span>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white block">
                          Assigned Mental Health Counsellor (Dr. Priya Nair)
                        </span>
                        <span className="text-[11px] text-[#888888]">Directly supports check-ins and schedules sessions</span>
                      </div>
                      <PremiumBadge tone="stable">Permitted</PremiumBadge>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.06)]">
                      <div>
                        <span className="font-semibold text-white block">
                          Police &amp; Prosecution Authorities
                        </span>
                        <span className="text-[11px] text-[#888888]">This preference does not control access to well-being and check-in records</span>
                      </div>
                      <PremiumBadge tone="elevated">Not controlled here</PremiumBadge>
                    </div>
                  </div>
                </div>

                {/* Group C: Discreet Notifications */}
                <div className="p-4 rounded-2xl bg-[#1E1E1E] border border-[rgba(255,255,255,0.08)] space-y-3">
                  <span className="text-xs font-bold text-white block uppercase tracking-wider">
                    3. Discreet Notifications
                  </span>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white block">
                        Preferred Time of Day
                      </span>
                      <span className="text-[11px] text-[#888888]">When it is most private and safe to respond</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#252525] border border-[rgba(255,255,255,0.10)] p-0.5 rounded-lg">
                      {(['morning', 'afternoon', 'evening'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setPreferredTime(t)}
                          className={`px-2 py-1 rounded text-[11px] font-bold capitalize transition cursor-pointer ${
                            preferredTime === t ? 'bg-[#FD1053] text-white' : 'text-[#888888] hover:text-white'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[rgba(255,255,255,0.06)]">
                    <div>
                      <span className="font-semibold text-white block">
                        Discreet Notification Headers
                      </span>
                      <span className="text-[11px] text-[#888888]">Hide mental health keywords on lock screen notifications</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDiscreetMode(!discreetMode)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                        discreetMode ? 'bg-[#FD1053] text-white' : 'bg-[#333333] text-[#888888]'
                      }`}
                    >
                      {discreetMode ? 'Enabled' : 'Off'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Emergency Pathways Bar */}
          <div className="bg-[#333333] border-t border-[rgba(255,255,255,0.10)] px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#D6D6D6] shrink-0">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-[#FD1053] shrink-0" />
              <span className="font-bold text-white">Crisis Support:</span>
              <span className="text-[11px] text-[#D6D6D6] hidden sm:inline">
                Toll-free 24/7 National Atrocity Helpline:
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsEmergencyModalOpen(true)}
              className="font-bold text-[#FD1053] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Dial 14566 / Tele-MANAS 14416</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="bg-[#252525] px-6 py-4 border-t border-[rgba(255,255,255,0.10)] flex items-center justify-between shrink-0">
            {currentStep > 1 ? (
              <LuxuryButton
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                variant="secondary"
                leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                className="text-xs py-2 px-4 min-h-[40px]"
              >
                Back
              </LuxuryButton>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[#888888] hover:text-white font-medium text-xs transition cursor-pointer"
              >
                Skip for now
              </button>
            )}

            {currentStep < totalSteps ? (
              <LuxuryButton
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                variant="primary"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="text-xs py-2 px-6 min-h-[40px]"
              >
                Continue
              </LuxuryButton>
            ) : (
              <LuxuryButton
                type="button"
                onClick={handleFinish}
                variant="primary"
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                className="text-xs py-2 px-6 min-h-[40px]"
              >
                Save Preferences &amp; Start
              </LuxuryButton>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
