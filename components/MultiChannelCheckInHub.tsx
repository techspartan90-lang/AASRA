'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import {
  checkInPipelineService,
  IngestCheckInInput,
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
  Volume2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Shield,
  ShieldCheck,
  Lock,
  ArrowRight,
  RotateCcw,
  Languages,
  Headphones,
  Check,
  PhoneForwarded,
  Info,
  Layers,
  Database,
  Type,
  RefreshCw,
} from 'lucide-react';

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
  const { fontSize } = useApp();

  const [activeChannel, setActiveChannel] = useState<CheckInChannel>('chatbot');
  const [liveCheckIns, setLiveCheckIns] = useState<StandardCheckInRecord[]>(() =>
    checkInPipelineService.getAllCheckIns()
  );

  // =========================================================================
  // 1. CHATBOT STATE
  // =========================================================================
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

  // Update greeting when chatbot language changes
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

    // Ingest into unified check-in pipeline
    const record = await checkInPipelineService.ingestCheckIn({
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

    // Bot gentle response
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

  // =========================================================================
  // 2. IVRS STATE
  // Flow: Call initiated -> language selection -> consent confirmation -> check-in -> optional voice response -> support options -> completion
  // =========================================================================
  const [ivrsStep, setIvrsStep] = useState<
    'idle' | 'calling' | 'lang_select' | 'consent' | 'checkin' | 'voice_record' | 'support_options' | 'completed'
  >('idle');
  const [ivrsLang, setIvrsLang] = useState('hi');
  const [ivrsMood, setIvrsMood] = useState('Okay');
  const [ivrsVoiceSeconds, setIvrsVoiceSeconds] = useState(0);
  const [ivrsDialpadInput, setIvrsDialpadInput] = useState('');

  const startIvrsCall = () => {
    setIvrsStep('calling');
    setIvrsDialpadInput('');
    setTimeout(() => setIvrsStep('lang_select'), 2000);
  };

  const handleIvrsKeypress = async (key: string) => {
    setIvrsDialpadInput(prev => prev + key);

    if (ivrsStep === 'lang_select') {
      if (key === '1') setIvrsLang('hi');
      else if (key === '2') setIvrsLang('ta');
      else if (key === '3') setIvrsLang('te');
      else if (key === '4') setIvrsLang('bn');
      else setIvrsLang('en');
      setIvrsStep('consent');
    } else if (ivrsStep === 'consent') {
      // 1 to continue, 2 to pause
      setIvrsStep('checkin');
    } else if (ivrsStep === 'checkin') {
      const moodMap: Record<string, string> = {
        '1': 'Calm',
        '2': 'Okay',
        '3': 'Worried',
        '4': 'Overwhelmed',
        '5': 'Need support',
      };
      setIvrsMood(moodMap[key] || 'Okay');
      setIvrsStep('voice_record');
    } else if (ivrsStep === 'support_options') {
      // Complete call and feed into pipeline
      await checkInPipelineService.ingestCheckIn({
        survivor_id: 'usr-victim-001',
        channel: 'ivrs',
        language: ivrsLang,
        mood_response: ivrsMood,
        voice_response_metadata: {
          hasAudio: ivrsVoiceSeconds > 0,
          durationSeconds: ivrsVoiceSeconds || 12,
          audioFormat: 'wav_8khz',
          acousticFeatures: {
            pitchJitter: 0.038,
            speechRateWpm: 124,
          },
        },
        engagement_metadata: {
          latencyMs: 820,
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

  // =========================================================================
  // 3. SMS STATE
  // =========================================================================
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

    // Ingest into universal check-in pipeline
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

    // Prompt rule: "Do not automatically infer an emergency solely from one response."
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

  // =========================================================================
  // 4. MOBILE APP SIMULATION
  // =========================================================================
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

  // =========================================================================
  // 5. WEB PORTAL SIMULATION
  // =========================================================================
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
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4 sm:px-6">
      {/* Title & Introduction */}
      <div className="rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-bold text-emerald-400 border border-white/10">
              <Layers className="w-3.5 h-3.5" />
              <span>Phase 4 · Multi-Channel Check-In Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Unified Multi-Channel Ingestion Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Every survivor has different access needs. Whether dialing via basic feature phone IVRS, replying to an SMS, chatting with a 10-language bot, or opening an app, all responses converge on the same standardized backend check-in model.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-xs">
            <Database className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-slate-400 text-[10px] block">Standardized Records</span>
              <span className="font-extrabold text-white text-sm">{liveCheckIns.length} Logged</span>
            </div>
          </div>
        </div>

        {/* Channel Switcher Tabs */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-2 border-t border-white/10 pt-6">
          {[
            { id: 'chatbot', label: '1. Chatbot', icon: <MessageSquare className="w-4 h-4" />, desc: '10 Languages' },
            { id: 'ivrs', label: '2. IVRS', icon: <PhoneCall className="w-4 h-4" />, desc: 'Voice & Dialpad' },
            { id: 'sms', label: '3. SMS', icon: <Radio className="w-4 h-4" />, desc: 'Low-Bandwidth' },
            { id: 'mobile_app', label: '4. Mobile App', icon: <Smartphone className="w-4 h-4" />, desc: 'Touch Native' },
            { id: 'web_portal', label: '5. Web Portal', icon: <Laptop className="w-4 h-4" />, desc: 'Accessible Web' },
          ].map(ch => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id as CheckInChannel)}
              className={`p-3 rounded-2xl text-left transition-all cursor-pointer min-h-[56px] flex flex-col justify-between ${
                activeChannel === ch.id
                  ? 'bg-white text-slate-900 shadow-lg font-bold ring-2 ring-emerald-400'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 text-xs">
                {ch.icon}
                <span className="font-extrabold">{ch.label}</span>
              </div>
              <span className={`text-[10px] ${activeChannel === ch.id ? 'text-slate-600' : 'text-slate-400'}`}>
                {ch.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          CHANNEL 1: CHATBOT (10 Indian Languages)
          ========================================================================= */}
      {activeChannel === 'chatbot' && (
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                <MessageSquare className="w-4 h-4" />
                <span>Multilingual Conversational Check-In</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Trauma-Informed Chatbot
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Supports text, voice input, high-contrast, and 10 regional languages.
              </p>
            </div>

            {/* Language Selector Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <Languages className="w-4 h-4 text-slate-500" />
              <select
                value={chatLang}
                onChange={e => handleChatLangChange(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white cursor-pointer focus:outline-hidden"
              >
                {CHATBOT_LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.name} ({l.native})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setChatHighContrast(!chatHighContrast)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Toggle High Contrast for Visual Accessibility"
              >
                Contrast: {chatHighContrast ? 'High' : 'Normal'}
              </button>
            </div>
          </div>

          {/* Chat Window */}
          <div
            className={`rounded-2xl border p-4 sm:p-6 h-96 overflow-y-auto space-y-4 ${
              chatHighContrast
                ? 'bg-black text-white border-yellow-400'
                : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800'
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
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : chatHighContrast
                      ? 'bg-yellow-400 text-black font-bold rounded-bl-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Emotion Pills for Low Cognitive Load */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-xs font-bold text-slate-500 self-center mr-1">Quick Tap:</span>
            {[
              { label: 'Calm', emoji: '🕊️' },
              { label: 'Okay', emoji: '🙂' },
              { label: 'Worried', emoji: '💭' },
              { label: 'Overwhelmed', emoji: '🌊' },
              { label: 'Need support', emoji: '🫂' },
            ].map(m => (
              <button
                key={m.label}
                onClick={() => handleSendChatMessage(`I am feeling ${m.label} ${m.emoji}`)}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition cursor-pointer flex items-center gap-1.5"
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
              className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="button"
              onClick={() => {
                setChatIsRecording(!chatIsRecording);
                if (!chatIsRecording) {
                  setChatInput('Voice note recorded: I slept well today and feel calmer.');
                }
              }}
              className={`p-3 rounded-2xl border transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center ${
                chatIsRecording
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
              }`}
              title="Speak message using voice"
            >
              {chatIsRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer shadow-md min-h-[44px]"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </section>
      )}

      {/* =========================================================================
          CHANNEL 2: IVRS (Interactive Voice Response Simulation)
          Flow: Call initiated -> language selection -> consent confirmation -> check-in -> optional voice response -> support options -> completion
          ========================================================================= */}
      {activeChannel === 'ivrs' && (
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
              <PhoneCall className="w-4 h-4" />
              <span>PSTN Telephony &amp; Feature Phone Voice Check-In</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              IVRS Workflow Simulation
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Simulates automated toll-free outreach (14566/14416) for rural survivors without smartphone or internet access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: IVRS Prompts & Script Flow */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs space-y-2">
                <span className="font-bold text-purple-900 dark:text-purple-200 block">
                  Current Step in IVRS Telephony Script:
                </span>
                <span className="font-extrabold text-sm uppercase text-purple-700 dark:text-purple-300 block">
                  {ivrsStep.replace('_', ' ')}
                </span>
              </div>

              {/* Step Display Card */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                {ivrsStep === 'idle' && (
                  <div className="text-center py-6 space-y-4">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Simulate automated morning follow-up call from Manas Suraksha.
                    </p>
                    <button
                      onClick={startIvrsCall}
                      className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-md inline-flex items-center gap-2 min-h-[44px]"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Initiate Call (Dial 14566)</span>
                    </button>
                  </div>
                )}

                {ivrsStep === 'calling' && (
                  <div className="text-center py-8 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto animate-bounce">
                      <PhoneCall className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Ringing... Connecting to Toll-Free Gateway
                    </p>
                    <span className="text-xs text-slate-500">Audio synthesizer ready</span>
                  </div>
                )}

                {ivrsStep === 'lang_select' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold text-xs">
                      <Volume2 className="w-4 h-4" />
                      <span>Audio Prompt:</span>
                    </div>
                    <p className="text-sm text-slate-800 dark:text-white font-medium leading-relaxed bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                      &ldquo;Namaskar, Manas Suraksha mein aapka swagat hai. Hindi ke liye 1 dabayein, Tamil ke liye 2, Telugu ke liye 3, Bengali ke liye 4, English ke liye 5 dabayein.&rdquo;
                    </p>
                    <span className="text-xs text-slate-500">Press 1-5 on dialpad to choose.</span>
                  </div>
                )}

                {ivrsStep === 'consent' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold text-xs">
                      <Volume2 className="w-4 h-4" />
                      <span>Audio Prompt (Consent Confirmation):</span>
                    </div>
                    <p className="text-sm text-slate-800 dark:text-white font-medium leading-relaxed bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                      &ldquo;Yeh call surakshit hai. Kripya apna voluntary check-in jari rakhne ke liye 1 dabayein. Call pause karne ke liye 2 dabayein.&rdquo;
                    </p>
                    <span className="text-xs text-slate-500">Press 1 to confirm consent.</span>
                  </div>
                )}

                {ivrsStep === 'checkin' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold text-xs">
                      <Volume2 className="w-4 h-4" />
                      <span>Audio Prompt (Daily Well-Being):</span>
                    </div>
                    <p className="text-sm text-slate-800 dark:text-white font-medium leading-relaxed bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                      &ldquo;Aaj aap kaisa mehsoos kar rahe hain? Calm ke liye 1 dabayein, Okay ke liye 2, Worried ke liye 3, Overwhelmed ke liye 4, Need support ke liye 5 dabayein.&rdquo;
                    </p>
                    <span className="text-xs text-slate-500">Press 1-5 to select emotional state.</span>
                  </div>
                )}

                {ivrsStep === 'voice_record' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold text-xs">
                      <Volume2 className="w-4 h-4" />
                      <span>Audio Prompt (Optional Voice Message):</span>
                    </div>
                    <p className="text-sm text-slate-800 dark:text-white font-medium leading-relaxed bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                      &ldquo;Beep ke baad apna 15 second ka sandesh record karein, ya aage badhne ke liye hash (#) dabayein.&rdquo;
                    </p>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600">● Simulated Voice Recording: 14s</span>
                      <button
                        onClick={() => {
                          setIvrsVoiceSeconds(14);
                          setIvrsStep('support_options');
                        }}
                        className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Press # (Skip/Done)
                      </button>
                    </div>
                  </div>
                )}

                {ivrsStep === 'support_options' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold text-xs">
                      <Volume2 className="w-4 h-4" />
                      <span>Audio Prompt (Support Options):</span>
                    </div>
                    <p className="text-sm text-slate-800 dark:text-white font-medium leading-relaxed bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                      &ldquo;Apne caseworker se baat karne ke liye 1 dabayein, Emergency helpline ke liye 2 dabayein, Sampann karne ke liye 3 dabayein.&rdquo;
                    </p>
                    <span className="text-xs text-slate-500">Press 3 to submit and complete call.</span>
                  </div>
                )}

                {ivrsStep === 'completed' && (
                  <div className="text-center py-6 space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Call Completed Successfully
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                      &ldquo;Dhanyavaad. Aapka response surakshit roop se darj kar liya gaya hai. Apna khayal rakhein.&rdquo;
                    </p>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">
                      Standardized record ingested into universal check-in queue.
                    </span>
                    <button
                      onClick={() => setIvrsStep('idle')}
                      className="mt-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold cursor-pointer"
                    >
                      Reset IVRS Simulation
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Phone Keypad UI for Interactivity */}
            <div className="max-w-xs mx-auto bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-4">
              <div className="text-center pb-2 border-b border-slate-800">
                <span className="text-[11px] text-slate-400 font-mono block">Active Call: +91 14566</span>
                <span className="text-lg font-bold font-mono text-emerald-400 tracking-wider">
                  {ivrsDialpadInput || '—'}
                </span>
              </div>

              {/* 3x4 Telephone Dialpad */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { num: '1', sub: '.,' },
                  { num: '2', sub: 'ABC' },
                  { num: '3', sub: 'DEF' },
                  { num: '4', sub: 'GHI' },
                  { num: '5', sub: 'JKL' },
                  { num: '6', sub: 'MNO' },
                  { num: '7', sub: 'PQRS' },
                  { num: '8', sub: 'TUV' },
                  { num: '9', sub: 'WXYZ' },
                  { num: '*', sub: 'Tone' },
                  { num: '0', sub: '+' },
                  { num: '#', sub: 'Hash' },
                ].map(k => (
                  <button
                    key={k.num}
                    onClick={() => handleIvrsKeypress(k.num)}
                    className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-purple-600 transition flex flex-col items-center justify-center cursor-pointer min-h-[52px]"
                  >
                    <span className="text-lg font-bold leading-none">{k.num}</span>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5">{k.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          CHANNEL 3: SMS SIMULATION
          Example:
          “MANAS SURAKSHA:
          How are you feeling today?
          Reply:
          1 Calm
          2 Okay
          3 Worried
          4 Overwhelmed
          5 Need support”
          Do not automatically infer an emergency solely from one response.
          ========================================================================= */}
      {activeChannel === 'sms' && (
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
              <Radio className="w-4 h-4" />
              <span>Two-Way SMS Gateway (2G / Feature Phone)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              SMS Check-In Simulation
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Operates over standard GSM SMS protocols for zero-data environments.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-slate-950 rounded-3xl p-5 shadow-2xl border-4 border-slate-800 space-y-4">
            {/* Phone Screen Top Header */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-bold text-white">MANAS-SURAKSHA</span>
              <span>Govt of India Verified</span>
            </div>

            {/* Message Thread */}
            <div className="space-y-3 h-80 overflow-y-auto pr-1">
              {smsConversation.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs whitespace-pre-line leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-xs font-medium'
                        : 'bg-slate-800 text-slate-200 rounded-bl-xs border border-slate-700 font-mono text-[11px]'
                    }`}
                  >
                    {m.text}
                    <span className="block text-[9px] text-slate-400 text-right mt-1">
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Numeric Replies */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-400 block w-full mb-1">Quick SMS Reply:</span>
              {['1 Calm', '2 Okay', '3 Worried', '4 Overwhelmed', '5 Need support'].map((opt, i) => (
                <button
                  key={opt}
                  onClick={() => handleSendSms(String(i + 1))}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* SMS Input */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendSms();
              }}
              className="flex items-center gap-2 pt-2"
            >
              <input
                type="text"
                value={smsInput}
                onChange={e => setSmsInput(e.target.value)}
                placeholder="Type 1, 2, 3, 4, 5 or text..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        </section>
      )}

      {/* =========================================================================
          CHANNEL 4: MOBILE APPLICATION SIMULATION
          ========================================================================= */}
      {activeChannel === 'mobile_app' && (
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <Smartphone className="w-4 h-4" />
              <span>Native Android / iOS Application Interface</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Mobile App Check-In
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Features biometric biometric authentication, encrypted offline caching, and gentle push reminders.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border-4 border-slate-700 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-extrabold text-xs">Manas Suraksha App</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full font-bold">
                Offline Sync Active
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800 space-y-3">
              <span className="text-xs text-slate-400 block font-semibold">Today&rsquo;s Scheduled Pulse</span>
              <p className="text-sm font-bold text-white">How is your well-being right now?</p>

              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'Calm', emoji: '🕊️' },
                  { id: 'Okay', emoji: '🙂' },
                  { id: 'Worried', emoji: '💭' },
                  { id: 'Overwhelmed', emoji: '🌊' },
                  { id: 'Need support', emoji: '🫂' },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMobileMood(m.id)}
                    className={`p-2 rounded-xl text-center cursor-pointer transition ${
                      mobileMood === m.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-650'
                    }`}
                  >
                    <span className="text-xl block">{m.emoji}</span>
                    <span className="text-[9px] font-bold block truncate">{m.id}</span>
                  </button>
                ))}
              </div>

              <textarea
                value={mobileNotes}
                onChange={e => setMobileNotes(e.target.value)}
                placeholder="Optional reflection..."
                rows={2}
                className="w-full mt-2 rounded-xl bg-slate-900 border border-slate-700 p-2 text-xs text-white placeholder:text-slate-500 focus:outline-hidden"
              />

              {mobileSubmitted && (
                <div className="p-2 bg-emerald-950 text-emerald-300 text-xs rounded-lg text-center font-bold">
                  ✓ Synced securely to backend
                </div>
              )}

              <button
                onClick={handleMobileSubmit}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer"
              >
                Submit from Mobile App
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          CHANNEL 5: WEB PORTAL SIMULATION
          ========================================================================= */}
      {activeChannel === 'web_portal' && (
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              <Laptop className="w-4 h-4" />
              <span>Full Browser Web Portal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Accessible Web Portal Check-In
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Optimized for desktop, tablet, and assistive screen reader technology.
            </p>
          </div>

          <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Select Your Mood
              </label>
              <div className="flex flex-wrap gap-2">
                {['Calm', 'Okay', 'Worried', 'Overwhelmed', 'Need support'].map(m => (
                  <button
                    key={m}
                    onClick={() => setWebMood(m)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
                      webMood === m
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Written Reflection or Support Need
              </label>
              <textarea
                value={webNotes}
                onChange={e => setWebNotes(e.target.value)}
                placeholder="Share any thoughts or questions..."
                rows={3}
                className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            {webSubmitted && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl font-bold">
                ✓ Recorded into standardized pipeline
              </div>
            )}

            <button
              onClick={handleWebSubmit}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer"
            >
              Submit Web Check-In
            </button>
          </div>
        </section>
      )}

      {/* =========================================================================
          COMMON BACKEND CHECK-IN PIPELINE INSPECTOR
          Proves that all 5 channels converge on the EXACT same StandardCheckInRecord model!
          ========================================================================= */}
      <section className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <Database className="w-4 h-4" />
              <span>Common Backend Model Verification</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Standardized Check-In Records Pipeline
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Inspect how all 5 distinct channels generate normalized schema objects.
            </p>
          </div>

          <button
            onClick={() => setLiveCheckIns(checkInPipelineService.getAllCheckIns())}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Refresh Feed</span>
          </button>
        </div>

        {/* Live Records Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-800/80 text-slate-300 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-3">Record ID</th>
                <th className="p-3">Channel</th>
                <th className="p-3">Lang</th>
                <th className="p-3">Mood Response</th>
                <th className="p-3">Distress</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Follow-Up</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {liveCheckIns.map(rec => (
                <tr key={rec.id} className="hover:bg-slate-800/50 transition">
                  <td className="p-3 text-slate-400 font-bold">{rec.id}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-sans font-bold text-[10px] uppercase ${
                        rec.channel === 'chatbot'
                          ? 'bg-indigo-900 text-indigo-300'
                          : rec.channel === 'ivrs'
                          ? 'bg-purple-900 text-purple-300'
                          : rec.channel === 'sms'
                          ? 'bg-sky-900 text-sky-300'
                          : rec.channel === 'mobile_app'
                          ? 'bg-emerald-900 text-emerald-300'
                          : 'bg-amber-900 text-amber-300'
                      }`}
                    >
                      {rec.channel.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 font-sans font-semibold uppercase">{rec.language}</td>
                  <td className="p-3 font-sans font-bold text-white">{rec.mood_response}</td>
                  <td className="p-3">
                    <span
                      className={`font-bold ${
                        rec.distress_indicator > 65
                          ? 'text-rose-400'
                          : rec.distress_indicator > 45
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {rec.distress_indicator}/100
                    </span>
                  </td>
                  <td className="p-3">{(rec.confidence * 100).toFixed(0)}%</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-sans text-[10px] font-bold ${
                        rec.follow_up_status === 'urgent_review'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : rec.follow_up_status === 'scheduled'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {rec.follow_up_status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-[10px] text-slate-500 font-sans">
                    {new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
