'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { SurvivorOnboardingData } from '@/types';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/lib/i18n';
import {
  Shield,
  ShieldCheck,
  HeartPulse,
  Lock,
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
  Eye,
  EyeOff,
  Sliders,
  Check,
  AlertTriangle,
  Sparkles,
  Info,
  Calendar,
  Volume2,
} from 'lucide-react';

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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-step-title"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 transition-colors flex flex-col max-h-[92vh]">
        {/* Top Header & Step Progress Bar */}
        <div className="bg-[#FFF7FA] text-[#111111] dark:bg-[#111116] dark:text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-[#F1D5DE] dark:border-[#2A2028]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FCE7F3] text-[#B91C1C] dark:bg-[#2A1522] dark:text-[#F472B6] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#111111] dark:text-white">
                Manas Suraksha · Survivor Well-Being Onboarding
              </span>
              <span className="text-[11px] text-[#64748B] dark:text-[#8E8E9A] block">
                Step {currentStep} of {totalSteps}: {
                  currentStep === 1 ? 'Welcome & Sanctuary' :
                  currentStep === 2 ? 'Informed Consent' :
                  currentStep === 3 ? 'Language Preference' :
                  currentStep === 4 ? 'Communication Channel' :
                  currentStep === 5 ? 'Check-In Frequency' :
                  currentStep === 6 ? 'Trusted Contact (Optional)' :
                  'Privacy & Access Controls'
                }
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white dark:bg-[#17171D] hover:bg-[#FFF0F5] dark:hover:bg-[#22141F] border border-[#F1D5DE] dark:border-[#2A2028] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Exit onboarding"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 shrink-0">
          <div
            className="bg-indigo-600 dark:bg-emerald-400 h-1.5 transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Scrollable Step Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* STEP 1: WELCOME */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-sky-400 flex items-center justify-center">
                <HeartPulse className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs font-bold text-indigo-700 dark:text-sky-400 uppercase tracking-wider">
                  Welcome to Manas Suraksha
                </span>
                <h2 id="onboarding-step-title" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                  You are in control of your journey.
                </h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  The justice process can be prolonged and stressful. Manas Suraksha was created to walk alongside you with privacy-first mental health support and gentle early distress recognition.
                </p>
              </div>

              {/* Trauma-Informed Assurance Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Our Promise to You:</span>
                </div>
                <ul className="space-y-1.5 text-[11px] list-disc list-inside text-emerald-900/90 dark:text-emerald-300/90">
                  <li><strong>No forced disclosure:</strong> We will never ask you to recount traumatic events during this onboarding.</li>
                  <li><strong>Your pace:</strong> You choose how often and through which channel we check in with you.</li>
                  <li><strong>Dignity &amp; sovereignty:</strong> All preferences can be modified or paused at any time.</li>
                </ul>
              </div>
            </div>
          )}

          {/* STEP 2: CONSENT */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Informed Consent &amp; Safeguards
                </span>
                <h2 id="onboarding-step-title" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                  How your information is protected.
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Before we begin, please review our transparent framework. Everything is voluntary and designed to safeguard your rights.
                </p>
              </div>

              <div className="space-y-3">
                <label className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentGranted}
                    onChange={(e) => setConsentGranted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Voluntary Well-Being Monitoring (Consent)
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 mt-1 block leading-relaxed">
                      I agree to receive structured periodic micro check-ins to monitor my sleep, well-being, and perceived safety. I understand that I can withdraw or pause at any time without penalty.
                    </span>
                  </div>
                </label>

                <label className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ethicalUnderstood}
                    onChange={(e) => setEthicalUnderstood(e.target.checked)}
                    className="mt-1 w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Ethical &amp; Non-Clinical Boundary Recognition
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 mt-1 block leading-relaxed">
                      I understand that Manas Suraksha is an early distress screening system, not a clinical diagnostic replacement or legal court reporter. Emergency situations are routed to trained human counsellors.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: PREFERRED LANGUAGE */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Languages className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                  Linguistic Comfort
                </span>
                <h2 id="onboarding-step-title" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                  Choose your preferred language.
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  All check-ins, text messages, voice calls, and counsellor communication will be delivered in this language.
                </p>
              </div>

              {/* Language Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between min-h-[70px] ${
                      selectedLanguage === lang.code
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 dark:border-sky-400 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {lang.nativeName}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {lang.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Voice Preview Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsVoiceAssistantOpen(true)}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Test speech &amp; voice readability</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PREFERRED COMMUNICATION CHANNEL */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Radio className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                  Accessible Communication
                </span>
                <h2 id="onboarding-step-title" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                  How would you prefer to receive check-ins?
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Select the channel that feels safest, most convenient, and fits your phone or internet access.
                </p>
              </div>

              {/* 5 Channel Options */}
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
                    desc: 'Toll-free phone call in your dialect; answer by pressing keypad numbers or speaking.',
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
                    badge: 'Desktop / Browser',
                  },
                ].map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setPreferredChannel(ch.id as any)}
                    className={`w-full p-4 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between gap-4 ${
                      preferredChannel === ch.id
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 dark:border-sky-400 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                        {ch.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {ch.label}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {ch.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {ch.desc}
                        </p>
                      </div>
                    </div>
                    {preferredChannel === ch.id && (
                      <Check className="w-4 h-4 text-indigo-600 dark:text-sky-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: CHECK-IN FREQUENCY */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  Survivor Pacing
                </span>
                <h2 id="onboarding-step-title" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                  How frequently should we check in?
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
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
                    desc: 'Aligned with court hearing dates or only when you choose to open.',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFrequency(item.id as any)}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between min-h-[90px] ${
                      frequency === item.id
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 dark:border-sky-400 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.label}
                        </span>
                        {frequency === item.id && (
                          <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {frequency === 'custom' && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <label htmlFor="custom-frequency" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Describe your custom cadence:
                  </label>
                  <input
                    id="custom-frequency"
                    type="text"
                    value={customFrequencyNote}
                    onChange={(e) => setCustomFrequencyNote(e.target.value)}
                    placeholder="e.g. Only following summons or witness testimony dates"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 6: TRUSTED CONTACT PREFERENCES */}
          {currentStep === 6 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <UserCheck className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                  Optional Safety Net
                </span>
                <h2 id="onboarding-step-title" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                  Trusted contact preferences.
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  You may designate a trusted family member, paralegal, or NGO advocate who can be notified if you ever experience severe distress. This step is completely optional.
                </p>
              </div>

              <div className="space-y-4">
                <label className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasTrustedContact}
                    onChange={(e) => setHasTrustedContact(e.target.checked)}
                    className="mt-1 w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Enable a secondary emergency advocate / contact
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5 block">
                      Leave unchecked if you prefer strictly independent communication.
                    </span>
                  </div>
                </label>

                {hasTrustedContact && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="contact-name" className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Contact Name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. Meera Devi"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-relation" className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Relationship / Role
                        </label>
                        <input
                          id="contact-relation"
                          type="text"
                          value={contactRelation}
                          onChange={(e) => setContactRelation(e.target.value)}
                          placeholder="e.g. Sister, NGO Case Volunteer"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-phone" className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Contact Mobile Number
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="e.g. 98765 00000"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="pt-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        When may this contact be notified?
                      </label>
                      <div className="space-y-1.5 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="trigger"
                            checked={contactTrigger === 'explicit_confirm'}
                            onChange={() => setContactTrigger('explicit_confirm')}
                            className="text-indigo-600 cursor-pointer"
                          />
                          <span className="text-slate-700 dark:text-slate-300">
                            Only when I explicitly tap &ldquo;Notify Contact&rdquo; in check-in
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="trigger"
                            checked={contactTrigger === 'missed_checkins'}
                            onChange={() => setContactTrigger('missed_checkins')}
                            className="text-indigo-600 cursor-pointer"
                          />
                          <span className="text-slate-700 dark:text-slate-300">
                            If I miss 3 consecutive check-ins and cannot be reached
                          </span>
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
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-sky-400 flex items-center justify-center">
                <Sliders className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs font-bold text-indigo-700 dark:text-sky-400 uppercase tracking-wider">
                  Survivor Privacy Controls
                </span>
                <h2 id="onboarding-step-title" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                  Customize what is collected and shared.
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Decide exactly what data points you feel comfortable sharing and who has access to your records.
                </p>
              </div>

              {/* Group A: Information Collected */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">
                  1. Information Collected
                </span>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block">
                        Well-Being &amp; Safety Rating (1–5 scale)
                      </span>
                      <span className="text-[11px] text-slate-500">Core indicator required to detect distress trajectory shifts</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      Core Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block">
                        Sleep Quality &amp; Brief Reflections
                      </span>
                      <span className="text-[11px] text-slate-500">Optional text notes describing stress without recalling trauma</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCollectSleepNotes(!collectSleepNotes)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                        collectSleepNotes ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {collectSleepNotes ? 'Included' : 'Excluded'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block">
                        Voice Acoustic Pitch Analysis (Optional)
                      </span>
                      <span className="text-[11px] text-slate-500">Analyze vocal tremor only; audio recordings are not stored</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCollectVoiceAcoustics(!collectVoiceAcoustics)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                        collectVoiceAcoustics ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {collectVoiceAcoustics ? 'Included' : 'Off'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Group B: Who Can Access */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">
                  2. Access Boundaries
                </span>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block">
                        Assigned Mental Health Counsellor (Dr. Priya Nair)
                      </span>
                      <span className="text-[11px] text-slate-500">Directly supports check-ins and schedules sessions</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      Permitted
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block">
                        Police &amp; Prosecuting Officers
                      </span>
                      <span className="text-[11px] text-slate-500">Cryptographically blocked from psychological and check-in records</span>
                    </div>
                    <span className="text-[11px] font-bold text-rose-600 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded">
                      Strictly Blocked
                    </span>
                  </div>
                </div>
              </div>

              {/* Group C: Communication Preferences */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 space-y-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider">
                  3. Discreet Notifications
                </span>

                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      Preferred Time of Day
                    </span>
                    <span className="text-[11px] text-slate-500">When it is most convenient and private to respond</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-0.5 rounded-lg">
                    {(['morning', 'afternoon', 'evening'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setPreferredTime(t)}
                        className={`px-2 py-1 rounded text-[11px] font-bold capitalize transition cursor-pointer ${
                          preferredTime === t ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      Discreet Notification Headers
                    </span>
                    <span className="text-[11px] text-slate-500">Hide mental health keywords on lock screen notifications</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDiscreetMode(!discreetMode)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                      discreetMode ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700 dark:bg-slate-700'
                    }`}
                  >
                    {discreetMode ? 'Enabled' : 'Off'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Pathways Bar (Visible on all steps, per Phase 2 requirement) */}
        <div className="bg-rose-50 dark:bg-rose-950/40 border-t border-rose-200 dark:border-rose-900/60 px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-rose-900 dark:text-rose-200 shrink-0">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span className="font-bold">Human Crisis Support:</span>
            <span className="text-[11px] text-rose-800 dark:text-rose-300 hidden sm:inline">
              Need immediate human assistance? Toll-free 24/7 National Atrocity Helpline:
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsEmergencyModalOpen(true)}
            className="font-extrabold text-rose-700 dark:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Dial 14566 / Tele-MANAS 14416</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 font-medium text-xs transition cursor-pointer"
            >
              Skip for now
            </button>
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Preferences &amp; Start</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
