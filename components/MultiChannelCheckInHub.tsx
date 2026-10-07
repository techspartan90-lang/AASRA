'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  checkInPipelineService,
} from '@/lib/checkin-pipeline';
import {
  StandardCheckInRecord,
  CheckInChannel,
} from '@/types';
import {
  MessageSquare,
  PhoneCall,
  Smartphone,
  Laptop,
  Radio,
  Send,
  Mic,
  MicOff,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Languages,
  Database,
  Layers,
} from 'lucide-react';
import {
  LuxuryCard,
  GlassPanel,
  GlassInput,
  GlassTextarea,
  LuxuryButton,
  PremiumBadge,
  ThreeDVoiceWave,
} from '@/components/design-system';

export const CHATBOT_LANGUAGES = [
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', greeting: 'नमस्ते, मनस सुरक्षा में आपका स्वागत है। आज आप कैसा महसूस कर रहे हैं?' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', greeting: 'வணக்கம், மானஸ் சுரக்ஷாவிற்கு வரவேற்கிறோம். இன்று நீங்கள் எப்படி உணர்கிறீர்கள்?' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', greeting: 'నమస్కారం, మానస్ సురక్షకు స్వాగతం. ఈ రోజు మీరు ఎలా ఉన్నారు?' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', greeting: 'নমস্কার, মানস সুরক্ষায় স্বাগতম। আজ আপনি কেমন অনুভব করছেন?' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', greeting: 'नमस्कार, मानस सुरक्षामध्ये आपले स्वागत आहे. आज तुम्हाला कसे वाटत आहे?' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', greeting: 'ನಮಸ್ಕಾರ, ಮಾನಸ್ ಸುರಕ್ಷಾಕ್ಕೆ ಸ್ವಾಗತ. ಇಂದು ನೀವು ಹೇಗಿದ್ದೀರಿ?' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', greeting: 'ନମସ୍କାର, ମାନସ ସୁରକ୍ଷାକୁ ସ୍ୱାଗତ। ଆଜି ଆପଣ କିପରି ଅନୁଭବ କରୁଛନ୍ତି?' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', greeting: 'નમસ્તે, માનસ સુરક્ષામાં આપનું સ્વાગત છે. આજે તમે કેવું અનુભવી રહ્યા છો?' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਮਾਨਸ ਸੁਰੱਖਿਆ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ। ਅੱਜ ਤੁਸੀਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ?' },
  { code: 'ur', name: 'Urdu', native: 'اردو', greeting: 'آداب، مانس سرکشا میں خوش آمدید۔ آج آپ کیسا محسوس کر رہے ہیں؟' },
  { code: 'en', name: 'English', native: 'English', greeting: 'Welcome to Manas Suraksha. How are you feeling today?' },
];

export function MultiChannelCheckInHub() {
  const [activeChannel, setActiveChannel] = useState<CheckInChannel>('chatbot');
  const [liveCheckIns, setLiveCheckIns] = useState<StandardCheckInRecord[]>(() =>
    checkInPipelineService.getAllCheckIns()
  );

  // 1. CHATBOT STATE
  const [chatLang, setChatLang] = useState('hi');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: CHATBOT_LANGUAGES[0].greeting,
      time: '10:00 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatIsRecording, setChatIsRecording] = useState(false);
  const [chatHighContrast, setChatHighContrast] = useState(false);

  const handleChatLangChange = (code: string) => {
    setChatLang(code);
    const target = CHATBOT_LANGUAGES.find(l => l.code === code) || CHATBOT_LANGUAGES[0];
    setChatMessages(prev => [
      ...prev,
      {
        sender: 'bot',
        text: target.greeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSendChatMessage = async (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    await checkInPipelineService.ingestCheckIn({
      survivor_id: 'usr-victim-001',
      channel: 'chatbot',
      language: chatLang,
      mood_response: textToSend.includes('Calm') ? 'Calm' : textToSend.includes('Worried') ? 'Worried' : textToSend.includes('Overwhelmed') ? 'Overwhelmed' : 'Okay',
      text_response: textToSend,
      engagement_metadata: {
        latencyMs: 180,
        completionRate: 1.0,
        clientVersion: 'aasra-chat-v4.0',
      },
      consent_status: true,
    });

    setLiveCheckIns(checkInPipelineService.getAllCheckIns());

    setTimeout(() => {
      let botReply = 'Thank you for sharing with me. Your reflection has been securely stored with your care profile.';
      if (textToSend.includes('Worried') || textToSend.includes('Overwhelmed')) {
        botReply = 'I hear that you are holding heavy feelings today. Would you like me to inform your caseworker Dr. Priya Nair, or would you like to do a gentle breathing exercise?';
      }
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  // 2. IVRS STATE
  const [ivrsStep, setIvrsStep] = useState<'idle' | 'calling' | 'lang_select' | 'mood_check' | 'voice_note' | 'completed'>('idle');
  const [ivrsSelectedMood, setIvrsSelectedMood] = useState<string>('Okay');

  const startIvrsCall = () => {
    setIvrsStep('calling');
    setTimeout(() => setIvrsStep('lang_select'), 1200);
  };

  const handleIvrsKeypad = async (key: string) => {
    if (ivrsStep === 'lang_select') {
      setIvrsStep('mood_check');
    } else if (ivrsStep === 'mood_check') {
      const moodMap: Record<string, string> = {
        '1': 'Calm',
        '2': 'Okay',
        '3': 'Worried',
        '4': 'Overwhelmed',
        '5': 'Need support',
      };
      const mood = moodMap[key] || 'Okay';
      setIvrsSelectedMood(mood);
      setIvrsStep('voice_note');
    } else if (ivrsStep === 'voice_note') {
      await checkInPipelineService.ingestCheckIn({
        survivor_id: 'usr-victim-001',
        channel: 'ivrs',
        language: 'hi',
        mood_response: ivrsSelectedMood,
        text_response: `IVRS Keypad Selected: ${ivrsSelectedMood}. Brief acoustic affirmation recorded.`,
        engagement_metadata: {
          latencyMs: 320,
          completionRate: 1.0,
          clientVersion: 'ivr-telephony-v2',
          deviceType: 'pstn_interactive',
          interactionDurationSeconds: 78,
        },
        consent_status: true,
      });

      setLiveCheckIns(checkInPipelineService.getAllCheckIns());
      setIvrsStep('completed');
    }
  };

  // 3. SMS STATE
  const [smsConversation, setSmsConversation] = useState<Array<{ sender: 'server' | 'user'; text: string; time: string }>>([
    {
      sender: 'server',
      text: `MANAS SURAKSHA:\nHow are you feeling today?\nReply:\n1 Calm\n2 Okay\n3 Worried\n4 Overwhelmed\n5 Need support`,
      time: '10:00 AM',
    },
  ]);
  const [smsInput, setSmsInput] = useState('');

  const handleSendSms = async (contentToSend?: string) => {
    const val = contentToSend || smsInput;
    if (!val.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: val,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSmsConversation(prev => [...prev, userMsg]);
    setSmsInput('');

    const num = val.trim();
    const moodMap: Record<string, string> = {
      '1': 'Calm',
      '2': 'Okay',
      '3': 'Worried',
      '4': 'Overwhelmed',
      '5': 'Need support',
    };
    const resolvedMood = moodMap[num] || val;

    await checkInPipelineService.ingestCheckIn({
      survivor_id: 'usr-victim-001',
      channel: 'sms',
      language: 'hi',
      mood_response: resolvedMood,
      text_response: val,
      engagement_metadata: {
        latencyMs: 980,
        completionRate: 1.0,
        clientVersion: 'sms-gateway-v4',
        deviceType: 'feature_phone_sms',
      },
      consent_status: true,
    });

    setLiveCheckIns(checkInPipelineService.getAllCheckIns());

    setTimeout(() => {
      let serverReply = `MANAS SURAKSHA: Thank you. Your response [${resolvedMood}] has been securely recorded. Next check-in is scheduled for Friday.`;
      if (num === '5' || num === '4' || val.toLowerCase().includes('support')) {
        serverReply = `MANAS SURAKSHA: We hear that you need support. Reply 0 to request a call from Dr. Priya Nair, or call toll-free NHAA 14566 anytime.`;
      }
      setSmsConversation(prev => [
        ...prev,
        {
          sender: 'server',
          text: serverReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 700);
  };

  // 4. MOBILE APP SIMULATION
  const [mobileMood, setMobileMood] = useState<string>('Calm');
  const [mobileNotes, setMobileNotes] = useState('');
  const [mobileSubmitted, setMobileSubmitted] = useState(false);

  const handleMobileSubmit = async () => {
    setMobileSubmitted(true);
    await checkInPipelineService.ingestCheckIn({
      survivor_id: 'usr-victim-001',
      channel: 'mobile_app',
      language: 'hi',
      mood_response: mobileMood,
      text_response: mobileNotes || 'Mobile app quick pulse check-in',
      engagement_metadata: {
        latencyMs: 210,
        completionRate: 1.0,
        clientVersion: 'manas-android-v2.1',
        deviceType: 'smartphone_native',
      },
      consent_status: true,
    });
    setLiveCheckIns(checkInPipelineService.getAllCheckIns());
    setTimeout(() => setMobileSubmitted(false), 4000);
  };

  // 5. WEB PORTAL SIMULATION
  const [webMood, setWebMood] = useState<string>('Okay');
  const [webNotes, setWebNotes] = useState('');
  const [webSubmitted, setWebSubmitted] = useState(false);

  const handleWebSubmit = async () => {
    setWebSubmitted(true);
    await checkInPipelineService.ingestCheckIn({
      survivor_id: 'usr-victim-001',
      channel: 'web_portal',
      language: 'en',
      mood_response: webMood,
      text_response: webNotes || 'Web portal secure submission',
      engagement_metadata: {
        latencyMs: 140,
        completionRate: 1.0,
        clientVersion: 'manas-web-portal-nextjs',
        deviceType: 'desktop_browser',
      },
      consent_status: true,
    });
    setLiveCheckIns(checkInPipelineService.getAllCheckIns());
    setTimeout(() => setWebSubmitted(false), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 px-2 select-none">
      {/* Title & Introduction */}
      <GlassPanel
        title="Unified Multi-Channel Ingestion Hub"
        subtitle="Every survivor has different access needs. Whether dialing via basic feature phone IVRS, replying to an SMS, chatting with a 10-language bot, or opening an app, all responses converge on the same standardized backend check-in model."
        badge={<PremiumBadge tone="live">Phase 4 Engine</PremiumBadge>}
        action={
          <div className="flex items-center gap-2 bg-[#474747]/10 dark:bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-xs">
            <Database className="w-4 h-4 text-[#FD1053]" />
            <div>
              <span className="text-[#6B7280] dark:text-[#A3A3A3] text-[10px] block">Standardized Records</span>
              <span className="font-extrabold text-[#333333] dark:text-white text-sm">{liveCheckIns.length} Logged</span>
            </div>
          </div>
        }
      >
        {/* Channel Switcher Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {[
            { id: 'chatbot', label: '1. Chatbot', icon: <MessageSquare className="w-4 h-4" />, desc: '10 Languages' },
            { id: 'ivrs', label: '2. IVRS', icon: <PhoneCall className="w-4 h-4" />, desc: 'Voice & Dialpad' },
            { id: 'sms', label: '3. SMS', icon: <Radio className="w-4 h-4" />, desc: 'Low-Bandwidth' },
            { id: 'mobile_app', label: '4. Mobile App', icon: <Smartphone className="w-4 h-4" />, desc: 'Touch Native' },
            { id: 'web_portal', label: '5. Web Portal', icon: <Laptop className="w-4 h-4" />, desc: 'Accessible Web' },
          ].map(ch => {
            const isActive = activeChannel === ch.id;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => setActiveChannel(ch.id as CheckInChannel)}
                className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer min-h-[64px] flex flex-col justify-between border ${
                  isActive
                    ? 'border-[#FD1053] bg-[#FD1053]/15 text-[#FD1053] shadow-[0_0_15px_rgba(253,16,83,0.15)] ring-1 ring-[#FD1053]/40'
                    : 'glass-card border-[#474747]/20 hover:border-[#FD1053]/30 text-[#474747] dark:text-[#D6D6D6]'
                }`}
              >
                <div className="flex items-center gap-2 text-xs">
                  {ch.icon}
                  <span className="font-bold">{ch.label}</span>
                </div>
                <span className="text-[10px] text-[#6B7280] dark:text-[#A3A3A3] mt-1">
                  {ch.desc}
                </span>
              </button>
            );
          })}
        </div>
      </GlassPanel>

      {/* CHANNEL 1: CHATBOT */}
      {activeChannel === 'chatbot' && (
        <GlassPanel
          title="Trauma-Informed Chatbot"
          subtitle="Supports text, voice input, high-contrast, and 10 regional Indian languages."
          badge={<PremiumBadge tone="live">10 Regional Tongues</PremiumBadge>}
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Languages className="w-4 h-4 text-[#FD1053]" />
              <select
                value={chatLang}
                onChange={e => handleChatLangChange(e.target.value)}
                className="glass-input px-3 py-1.5 text-xs font-semibold cursor-pointer"
              >
                {CHATBOT_LANGUAGES.map(l => (
                  <option key={l.code} value={l.code} className="bg-[#252525] text-white">
                    {l.name} ({l.native})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setChatHighContrast(!chatHighContrast)}
                className="px-2.5 py-1.5 rounded-xl border border-[#474747]/20 dark:border-white/10 text-xs font-semibold text-[#474747] dark:text-[#D6D6D6] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                Contrast: {chatHighContrast ? 'High' : 'Normal'}
              </button>
            </div>
          }
        >
          {/* Chat Window */}
          <div
            className={`rounded-2xl border p-4 sm:p-6 h-96 overflow-y-auto space-y-4 ${
              chatHighContrast
                ? 'bg-black text-white border-yellow-400'
                : 'glass-card border-[#474747]/20'
            }`}
          >
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-md p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#FD1053] text-white rounded-br-xs'
                      : chatHighContrast
                      ? 'bg-yellow-400 text-black font-bold rounded-bl-xs'
                      : 'glass-card text-[#333333] dark:text-white rounded-bl-xs border-[#474747]/20'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-white/80' : 'text-[#6B7280]'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Emotion Pills */}
          <div className="flex flex-wrap gap-2 pt-3">
            <span className="text-xs font-bold text-[#6B7280] self-center mr-1">Quick Tap:</span>
            {[
              { label: 'Calm', emoji: '🕊️' },
              { label: 'Okay', emoji: '🙂' },
              { label: 'Worried', emoji: '💭' },
              { label: 'Overwhelmed', emoji: '🌊' },
              { label: 'Need support', emoji: '🫂' },
            ].map(m => (
              <button
                key={m.label}
                type="button"
                onClick={() => handleSendChatMessage(`I am feeling ${m.label} ${m.emoji}`)}
                className="px-3 py-1.5 rounded-full bg-[#474747]/10 hover:bg-[#474747]/20 dark:bg-white/5 dark:hover:bg-white/10 border border-[#474747]/20 dark:border-white/10 text-xs font-semibold text-[#333333] dark:text-[#D6D6D6] transition cursor-pointer flex items-center gap-1.5"
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendChatMessage();
            }}
            className="flex items-center gap-2 pt-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Type your message in any Indian language..."
              className="glass-input flex-1 px-4 py-3 rounded-2xl text-xs sm:text-sm"
            />

            <button
              type="button"
              onClick={() => {
                setChatIsRecording(!chatIsRecording);
                if (!chatIsRecording) {
                  setChatInput('Voice note recorded: I feel steady today.');
                }
              }}
              className={`p-3 rounded-2xl border transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
                chatIsRecording
                  ? 'bg-[#FD1053] text-white border-[#FD1053] animate-pulse'
                  : 'bg-[#474747]/10 dark:bg-white/5 text-[#474747] dark:text-white border-[#474747]/20 dark:border-white/10 hover:bg-[#474747]/20'
              }`}
              title="Speak message using voice"
            >
              {chatIsRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <LuxuryButton
              type="submit"
              variant="primary"
              size="md"
              rightIcon={<Send className="w-4 h-4" />}
            >
              <span className="hidden sm:inline">Send</span>
            </LuxuryButton>
          </form>
        </GlassPanel>
      )}

      {/* CHANNEL 2: IVRS TELEPHONY (WITH 3D VOICE WAVE) */}
      {activeChannel === 'ivrs' && (
        <GlassPanel
          title="IVRS Workflow Simulation"
          subtitle="Simulates automated toll-free outreach (14566/14416) for rural survivors without smartphone or internet access."
          badge={<PremiumBadge tone="live">PSTN & Feature Phone</PremiumBadge>}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: IVRS Prompts */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl glass-card border-[#FD1053]/30 text-xs space-y-1">
                <span className="font-semibold text-[#6B7280] block">
                  Current Step in IVRS Telephony Script:
                </span>
                <span className="font-extrabold text-sm uppercase text-[#FD1053] block">
                  {ivrsStep.replace('_', ' ')}
                </span>
              </div>

              {/* Step Display Card */}
              <LuxuryCard className="p-6 space-y-4">
                {ivrsStep === 'idle' && (
                  <div className="text-center py-6 space-y-4">
                    <p className="text-sm font-semibold text-[#333333] dark:text-white">
                      Simulate automated periodic follow-up call from Manas Suraksha.
                    </p>
                    <LuxuryButton
                      variant="primary"
                      size="lg"
                      onClick={startIvrsCall}
                      leftIcon={<PhoneCall className="w-4 h-4" />}
                    >
                      Initiate Call (Dial 14566)
                    </LuxuryButton>
                  </div>
                )}

                {ivrsStep === 'calling' && (
                  <div className="text-center py-8 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#FD1053]/15 text-[#FD1053] flex items-center justify-center mx-auto animate-bounce border border-[#FD1053]/30">
                      <PhoneCall className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-[#333333] dark:text-white">
                      Ringing... Connecting to Toll-Free Gateway
                    </p>
                    <span className="text-xs text-[#6B7280]">Voice synthesizer ready</span>
                  </div>
                )}

                {ivrsStep === 'lang_select' && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-[#FD1053] uppercase tracking-wider">
                      Audio Prompt:
                    </p>
                    <p className="text-sm italic text-[#333333] dark:text-white leading-relaxed">
                      &ldquo;Welcome to Manas Suraksha. Press 1 for Hindi, Press 2 for English, Press 3 for Regional Dialect.&rdquo;
                    </p>
                    <span className="text-xs text-[#6B7280] block pt-2">
                      Tap 1 or 2 on the right dialpad to continue.
                    </span>
                  </div>
                )}

                {ivrsStep === 'mood_check' && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-[#FD1053] uppercase tracking-wider">
                      Audio Prompt:
                    </p>
                    <p className="text-sm italic text-[#333333] dark:text-white leading-relaxed">
                      &ldquo;How are you feeling today? Press 1 for Calm, 2 for Okay, 3 for Worried, 4 for Overwhelmed, 5 to speak with your counsellor.&rdquo;
                    </p>
                    <span className="text-xs text-[#6B7280] block pt-2">
                      Tap 1, 2, 3, 4, or 5 on the right dialpad.
                    </span>
                  </div>
                )}

                {ivrsStep === 'voice_note' && (
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-[#FD1053] uppercase tracking-wider">
                      Trauma Voice Recording:
                    </p>
                    <ThreeDVoiceWave isListening isProcessing={false} />
                    <p className="text-xs text-[#333333] dark:text-white text-center">
                      &ldquo;Please record a short message after the tone. Press # when finished.&rdquo;
                    </p>
                    <div className="flex justify-center pt-2">
                      <LuxuryButton
                        variant="primary"
                        size="md"
                        onClick={() => handleIvrsKeypad('#')}
                      >
                        Press # to Finish Recording
                      </LuxuryButton>
                    </div>
                  </div>
                )}

                {ivrsStep === 'completed' && (
                  <div className="text-center py-6 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-[#333333] dark:text-white">
                      Check-In Recorded Successfully via IVRS
                    </h4>
                    <p className="text-xs text-[#6B7280]">
                      Telemetry logged to standardized database. Call concluded.
                    </p>
                    <LuxuryButton
                      variant="secondary"
                      size="sm"
                      onClick={() => setIvrsStep('idle')}
                      leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                    >
                      Reset Simulation
                    </LuxuryButton>
                  </div>
                )}
              </LuxuryCard>
            </div>

            {/* Right: Keypad Simulator */}
            <div className="p-6 rounded-3xl glass-card max-w-xs mx-auto border-[#474747]/20 shadow-xl space-y-4">
              <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block text-center">
                PSTN Keypad Simulator
              </span>

              <div className="grid grid-cols-3 gap-2.5">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(k => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleIvrsKeypad(k)}
                    className="h-12 rounded-2xl glass-card flex flex-col items-center justify-center text-sm font-extrabold text-[#333333] dark:text-white hover:border-[#FD1053] hover:text-[#FD1053] transition cursor-pointer active:scale-95"
                  >
                    <span>{k}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* CHANNEL 3: SMS SIMULATOR */}
      {activeChannel === 'sms' && (
        <GlassPanel
          title="SMS Gateway Simulator"
          subtitle="Low-bandwidth 2G feature phone check-in via SMS text commands."
          badge={<PremiumBadge tone="live">Zero Mobile Data Required</PremiumBadge>}
        >
          <div className="max-w-md mx-auto p-6 rounded-3xl glass-card border-[#474747]/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#474747]/15 pb-2">
              <span className="text-xs font-bold text-[#333333] dark:text-white">
                Shortcode: 51969 (Govt Telehealth)
              </span>
              <span className="text-[10px] text-[#FD1053] font-bold">2G Handset</span>
            </div>

            <div className="h-72 overflow-y-auto space-y-3 p-3 bg-black/5 dark:bg-black/30 rounded-2xl">
              {smsConversation.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-[#FD1053] text-white rounded-br-xs'
                        : 'glass-card border-[#474747]/20 text-[#333333] dark:text-white rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={smsInput}
                onChange={e => setSmsInput(e.target.value)}
                placeholder="Reply 1, 2, 3, 4, 5..."
                className="glass-input flex-1 px-3 py-2 text-xs rounded-xl"
              />
              <LuxuryButton
                variant="primary"
                size="sm"
                onClick={() => handleSendSms()}
                rightIcon={<Send className="w-3.5 h-3.5" />}
              >
                Reply
              </LuxuryButton>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* CHANNEL 4: MOBILE APP */}
      {activeChannel === 'mobile_app' && (
        <GlassPanel
          title="Mobile App (PWA) Simulator"
          subtitle="Touch-native Progressive Web App with biometric lock, mood cards, and offline sync."
          badge={<PremiumBadge tone="live">iOS & Android PWA</PremiumBadge>}
        >
          <div className="max-w-sm mx-auto p-6 rounded-3xl glass-card border-[#474747]/20 shadow-2xl space-y-5">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FD1053]">
                Daily Check-In Pulse
              </span>
              <h3 className="text-base font-bold text-[#333333] dark:text-white">
                How is your emotional balance today?
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {['Calm', 'Okay', 'Worried', 'Overwhelmed'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMobileMood(m)}
                  className={`p-3 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    mobileMood === m
                      ? 'border-[#FD1053] bg-[#FD1053]/15 text-[#FD1053]'
                      : 'border-[#474747]/20 text-[#474747] dark:text-[#D6D6D6]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <GlassInput
              placeholder="Quick reflection or note..."
              value={mobileNotes}
              onChange={e => setMobileNotes(e.target.value)}
            />

            <LuxuryButton
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleMobileSubmit}
              disabled={mobileSubmitted}
            >
              {mobileSubmitted ? 'Recorded to Care Ledger ✓' : 'Submit Check-In'}
            </LuxuryButton>
          </div>
        </GlassPanel>
      )}

      {/* CHANNEL 5: WEB PORTAL */}
      {activeChannel === 'web_portal' && (
        <GlassPanel
          title="Web Portal Check-In Simulator"
          subtitle="Accessible, WCAG 2.1 AA certified browser interface."
          badge={<PremiumBadge tone="live">WCAG 2.1 AA</PremiumBadge>}
        >
          <div className="max-w-md mx-auto p-6 rounded-3xl glass-card border-[#474747]/20 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#333333] dark:text-white text-center">
              Web Portal Quick Triage
            </h3>

            <div className="flex justify-around py-2">
              {['Calm', 'Okay', 'Stressed'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setWebMood(m)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    webMood === m
                      ? 'border-[#FD1053] bg-[#FD1053]/15 text-[#FD1053]'
                      : 'border-[#474747]/20 text-[#474747] dark:text-[#D6D6D6]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <GlassTextarea
              placeholder="Describe your current status..."
              value={webNotes}
              onChange={e => setWebNotes(e.target.value)}
              rows={2}
            />

            <LuxuryButton
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleWebSubmit}
              disabled={webSubmitted}
            >
              {webSubmitted ? 'Check-In Submitted ✓' : 'Submit Web Response'}
            </LuxuryButton>
          </div>
        </GlassPanel>
      )}

      {/* =========================================================================
          UNIFIED REAL-TIME INGESTION FEED TABLE
          ========================================================================= */}
      <GlassPanel
        title="Unified Pipeline Ingestion Stream"
        subtitle="Standardized check-in records converging in real-time from all 5 channels."
        badge={<PremiumBadge tone="live">Live Telemetry</PremiumBadge>}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#474747]/15 dark:border-white/10 text-[#6B7280] dark:text-[#A3A3A3] uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3">Language</th>
                <th className="py-2.5 px-3">Mood Response</th>
                <th className="py-2.5 px-3">Text / Acoustic Sample</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Consent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#474747]/10 dark:divide-white/5 text-[#333333] dark:text-[#D6D6D6]">
              {liveCheckIns.slice(0, 8).map(record => (
                <tr key={record.id} className="hover:bg-white/5 transition">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#FD1053] font-bold">
                    {record.id.slice(0, 10)}...
                  </td>
                  <td className="py-2.5 px-3 font-semibold uppercase text-[10px]">
                    <span className="px-2 py-0.5 rounded-full bg-[#474747]/10 dark:bg-white/10">
                      {record.channel.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 uppercase text-[10px] font-bold">
                    {record.language}
                  </td>
                  <td className="py-2.5 px-3 font-semibold">
                    {record.mood_response}
                  </td>
                  <td className="py-2.5 px-3 text-[#6B7280] dark:text-[#A3A3A3] max-w-xs truncate">
                    {record.text_response}
                  </td>
                  <td className="py-2.5 px-3 text-[11px]">
                    {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
}
