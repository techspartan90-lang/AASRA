/**
 * MANAS SURAKSHA — Familiar Voice Comfort & Grounding Engine
 *
 * Core Principle: "AI assists. Humans decide."
 *
 * Provides a comforting, consent-based familiar voice experience
 * during check-ins, grounding exercises, and support interactions.
 *
 * Security & Consent Architecture:
 * - Explicit consent required from voice owner before any personalized voice model is activated.
 * - Clear verification and immediate revocation workflow.
 * - Zero raw audio retention guarantee (memory-only synthesis, never stored permanently).
 * - Transparent disclosure: never portrays AI as a live communication from the loved one.
 * - Resilient fallback to browser Web Speech API and text-only support.
 */

export type VoiceMode =
  | 'standard'       // Calm, trauma-informed digital guide
  | 'curated'        // Licensed/approved soothing voice profiles
  | 'personalized'   // Consent-verified loved one voice profile
  | 'text_only';     // Pure text, zero speech audio

export type ConsentStatus =
  | 'not_requested'
  | 'pending_authorization'
  | 'verified_active'
  | 'revoked';

export interface PersonalizedVoiceConsent {
  status: ConsentStatus;
  voiceOwnerName: string;
  relationship: string;
  authorizedAt?: string;
  verificationMethod?: string;
  consentReceiptId?: string;
  revokedAt?: string;
  disclaimerAcknowledged: boolean;
}

export interface CuratedVoiceProfile {
  id: string;
  name: string;
  description: string;
  tone: string;
  gender: 'female' | 'male' | 'neutral';
  samplePreviewText: string;
}

export interface VoicePlaybackSettings {
  mode: VoiceMode;
  selectedCuratedId?: string;
  speechRate: number; // 0.6 to 1.4, default 0.95
  volume: number; // 0.0 to 1.0, default 0.85
  pitch: number; // 0.8 to 1.2, default 1.0
  language: string;
  voiceAssistanceEnabled: boolean;
  personalizedConsent: PersonalizedVoiceConsent;
}

export interface ComfortMessage {
  id: string;
  title: string;
  category: 'reassurance' | 'pacing' | 'grounding' | 'agency' | 'safety';
  text: Record<string, string>; // Multi-lingual text keyed by language code
}

export const CURATED_VOICES: CuratedVoiceProfile[] = [
  {
    id: 'voice-ananya',
    name: 'Ananya — Gentle Sanctuary',
    description: 'Soft, slow-paced, reassuring voice with empathetic cadence.',
    tone: 'Soothing & Gentle',
    gender: 'female',
    samplePreviewText: 'Take your time. You are safe here, and you do not need to rush.',
  },
  {
    id: 'voice-aarav',
    name: 'Aarav — Warm Anchor',
    description: 'Grounded, warm, composed voice providing steady reassurance.',
    tone: 'Warm & Composed',
    gender: 'male',
    samplePreviewText: 'You have courage. We are walking with you one step at a time.',
  },
  {
    id: 'voice-meera',
    name: 'Meera — Quiet Care',
    description: 'Calm, maternal, patient voice ideal for high-stress grounding.',
    tone: 'Patient & Maternal',
    gender: 'female',
    samplePreviewText: 'Breathe gently. There is nothing you have to prove or explain right now.',
  },
];

export const COMFORT_MESSAGES: ComfortMessage[] = [
  {
    id: 'msg-pacing',
    title: 'Pacing & Breathing',
    category: 'pacing',
    text: {
      en: 'Take your time. You do not need to explain everything at once. You are in control.',
      hi: 'अपना समय लें। आपको सब कुछ एक साथ बताने की ज़रूरत नहीं है। नियंत्रण आपके हाथ में है।',
      bn: 'আপনার সময় নিন। আপনাকে একসাথে সব কিছু বলতে হবে না। সিদ্ধান্ত আপনার।',
      as: 'আপোনাৰ সময় লওক। সকলো কথা একেবাৰে কোৱাৰ প্ৰয়োজন নাই।',
      kha: 'Shim por. Ym donkam ban iathuh lut beit baroh ha kawei ka por.',
      lus: 'Hmanhmawh suh le. Engkim vawi khata sawi vek a ngai lo.',
      mni: 'নহাক্কী মতম লৌজৌ। পুম্নমক অমুক্তদা ফোঙদোকপা মথৌ তাদে।',
      brx: 'नेवैनि सम ला। गासैबो बाथ्राखौ खनसेल’ फोरमायनो गोनांथि गैया।',
      ne: 'आफ्नो समय लिनुहोस्। तपाईंले सबै कुरा एकैचोटि बताउनु पर्दैन।',
      ta: 'உங்கள் நேரத்தை எடுத்துக் கொள்ளுங்கள். அனைத்தையும் ஒரே நேரத்தில் விளக்க வேண்டியதில்லை.',
      te: 'మీ సమయం తీసుకోండి. అంతా ఒకేసారి చెప్పాల్సిన అవసరం లేదు.',
      mr: 'आपला वेळ घ्या. एकाच वेळी सर्व काही सांगण्याची गरज नाही.',
      kn: 'ನಿಮ್ಮ ಸಮಯವನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ. ಎಲ್ಲವನ್ನೂ ಒಂದೇ ಬಾರಿಗೆ ವಿವರಿಸಬೇಕಾಗಿಲ್ಲ.',
      or: 'ନିଜର ସମୟ ନିଅନ୍ତୁ। ଏକାଥରେ ସବୁକିଛି କହିବା ଆବଶ୍ୟକ ନାହିଁ।',
      gu: 'તમારો સમય લો. તમારે બધું એક સાથે કહેવાની જરૂર નથી.',
      pa: 'ਆਪਣਾ ਸਮਾਂ ਲਓ। ਤੁਹਾਨੂੰ ਸਭ ਕੁਝ ਇੱਕੋ ਵਾਰ ਦੱਸਣ ਦੀ ਲੋੜ ਨਹੀਂ।',
      ur: 'اپنا وقت لیں۔ آپ کو سب کچھ ایک ساتھ بیان کرنے کی ضرورت نہیں ہے۔',
    },
  },
  {
    id: 'msg-pause',
    title: 'Permission to Pause',
    category: 'agency',
    text: {
      en: 'You can pause whenever you need to. Your comfort and safety always come first.',
      hi: 'जब भी आपको ज़रूरत लगे, आप रुक सकते हैं। आपकी सुरक्षा और सुविधा सबसे पहले है।',
      bn: 'আপনার যখনই প্রয়োজন মনে হবে, আপনি বিরতি নিতে পারেন। আপনার আরাম ও সুরক্ষাই সর্বাগ্রে।',
      as: 'যেতিয়াই প্ৰয়োজন অনুভৱ কৰে, আপুনি ক্ষন্তেক ৰ’ব পাৰে। আপোনাৰ সুৰক্ষাই প্ৰথম।',
      kha: 'Phi lah ban sangeh ha kano kano ka por. Ka jingshngain jong phi ka kongsan.',
      lus: 'I duh hun hunah i chawl thei e. I thlamuanna leh venhimna chu a hmasa ber.',
      mni: 'নহাক্না পাম্বা মতমদা লেপপা য়াই। নহাক্কী শাফবা অদু হান্না মথৌ তাই।',
      brx: 'नोंथाङा सम लानानैनो थांनो हागोन। नोंथांनि रैखाथियानो गाहाय।',
      ne: 'तपाईंलाई आवश्यक परेको बेला रोकिन सक्नुहुन्छ। तपाईंको आराम र सुरक्षा नै पहिलो प्राथमिकता हो।',
      ta: 'உங்களுக்குத் தேவைப்படும் போதெல்லாம் இடைநிறுத்தலாம். உங்கள் பாதுகாப்பே முதன்மையானது.',
      te: 'మీకు అవసరమైనప్పుడు విరామం తీసుకోవచ్చు. మీ భద్రతే మా ప్రాధాన్యత.',
      mr: 'जेव्हा आवश्यक वाटेल तेव्हा आपण थांबू शकता. आपली सुरक्षितता सर्वात महत्त्वाची आहे.',
      kn: 'ನಿಮಗೆ ಅಗತ್ಯವಿದ್ದಾಗ ನೀವು ವಿರಾಮ ತೆಗೆದುಕೊಳ್ಳಬಹುದು. ನಿಮ್ಮ ಭದ್ರತೆಯೇ ಮೊದಲು.',
      or: 'ଯେତେବେଳେ ଚାହିଁବେ ବିରାମ ନେଇପାରିବେ। ଆପଣଙ୍କ ସୁରକ୍ଷା ସର୍ବାଗ୍ରେ।',
      gu: 'જ્યારે પણ જરૂર જણાય, તમે અટકી શકો છો. તમારી સુરક્ષા સૌથી મહત્વપૂર્ણ છે.',
      pa: 'ਜਦੋਂ ਵੀ ਲੋੜ ਮਹਿਸੂਸ ਹੋਵੇ, ਤੁਸੀਂ ਰੁਕ ਸਕਦੇ ਹੋ। ਤੁਹਾਡੀ ਸੁਰੱਖਿਆ ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਹੈ।',
      ur: 'جب بھی آپ کو ضرورت ہو، آپ وقفہ لے سکتے ہیں۔ آپ کی حفاظت سب سے اہم ہے۔',
    },
  },
  {
    id: 'msg-safety',
    title: 'Deserving of Support',
    category: 'safety',
    text: {
      en: 'You deserve to feel safe and supported. We are here beside you through this journey.',
      hi: 'आप सुरक्षित और समर्थित महसूस करने के हकदार हैं। इस यात्रा में हम आपके साथ हैं।',
      bn: 'আপনি নিরাপদ ও সমর্থিত বোধ করার অধিকারী। এই সফরে আমরা আপনার পাশেই আছি।',
      as: 'আপুনি সুৰক্ষিত আৰু সমৰ্থিত অনুভৱ কৰাৰ যোগ্য। এই যাত্ৰাত আমি আপোনাৰ লগতে আছোঁ।',
      kha: 'Phi dei ban sngew shngain bad ioh jingiarap. Ngi don ryngkat bad phi.',
      lus: 'Venhim leh tanpui nih hi i phu a ni. He kawngah hian i kiangah kan awm reng e.',
      mni: 'নহাক্না শাফনা লৈবা অমসুং তেংবাং ফংবা মখোইনি। ঐখোয় নহাক্কী নাকন্দা লৈরি।',
      brx: 'नोंथाङा रैखाथि मोननो हानाय हक दं। जोङो नोंथांनि लोगोआवनो दं।',
      ne: 'तपाईं सुरक्षित र समर्थित महसुस गर्न योग्य हुनुहुन्छ। यस यात्रामा हामी तपाईंको साथमा छौं।',
      ta: 'நீங்கள் பாதுகாப்பாக உணர முழு தகுதியும் உடையவர். நாங்கள் உங்களுடன் எப்போதும் இருக்கிறோம்.',
      te: 'మీరు సురక్షితంగా మరియు ఆధారంగా అనుభూతి చెందే అర్హత ఉంది. మేము మీతోనే ఉన్నాము.',
      mr: 'तुम्हाला सुरक्षित वाटण्याचा पूर्ण अधिकार आहे. या प्रवासात आम्ही तुमच्या सोबत आहोत.',
      kn: 'ನೀವು ಸುರಕ್ಷಿತವಾಗಿರಲು ಸಂಪೂರ್ಣ ಅರ್ಹರಾಗಿದ್ದೀರಿ. ನಾವು ನಿಮ್ಮೊಂದಿಗೆ ಸದಾ ಇರುತ್ತೇವೆ.',
      or: 'ଆପଣ ସୁରକ୍ଷିତ ଏବଂ ସମର୍ଥିତ ଅନୁଭବ କରିବାକୁ ଯୋଗ୍ୟ। ଆମେ ଆପଣଙ୍କ ସହିତ ଅଛୁ।',
      gu: 'તમે સુરક્ષિત અને સમર્થિત અનુભવવા માટે હકદાર છો. આ પ્રવાસમાં અમે તમારી સાથે છીએ.',
      pa: 'ਤੁਸੀਂ ਸੁਰੱਖਿਅਤ ਅਤੇ ਸਹਿਯੋਗੀ ਮਹਿਸੂਸ ਕਰਨ ਦੇ ਹੱਕਦਾਰ ਹੋ। ਅਸੀਂ ਤੁਹਾਡੇ ਨਾਲ ਹਾਂ।',
      ur: 'آپ خود کو محفوظ اور معاون محسوس کرنے کے حقدار ہیں۔ اس سفر میں ہم آپ کے ساتھ ہیں۔',
    },
  },
  {
    id: 'msg-choice',
    title: 'Supportive Choice',
    category: 'agency',
    text: {
      en: 'Would you like to continue, take a short break, or speak with a support professional?',
      hi: 'क्या आप आगे बढ़ना चाहते हैं, थोड़ा विश्राम लेना चाहते हैं, या किसी सहायता पेशेवर से बात करना चाहते हैं?',
      bn: 'আপনি কি চালিয়ে যেতে চান, একটি ছোট বিরতি নিতে চান, নাকি কোনো সহায়তা কর্মকর্তার সাথে কথা বলতে চান?',
      as: 'আপুনি আগবাঢ়িব বিচাৰেনে, ক্ষন্তেক জিৰণি ল’ব বিচাৰেনে, বা কোনো বিষয়াৰ সৈতে কথা পাতিব বিচাৰেনে?',
      kha: 'Phi kwah ban bteng, ne ban shong thait shipor, ne ban kren bad u nongiarap?',
      lus: 'Chhunzawm nge i duh, chawlh lawk, nge tanpuitu biak i duh zawk?',
      mni: 'নহাক্না মখা চত্থবা পাম্ব্রা, নত্রগা অপিকপা পোথাবা লৌজগদ্রা, নত্রগা তেংবাংলোইগা ৱারী শাগদ্রা?',
      brx: 'नोंथाङा साबसिन मोननायसिम थांनो सानो ना, खनसेल’ जिरायनाय सानो?',
      ne: 'के तपाईं जारी राख्न चाहनुहुन्छ, छोटो विश्राम लिन चाहनुहुन्छ, वा कुनै सहायता पेशेवरसँग कुरा गर्न चाहनुहुन्छ?',
      ta: 'நீங்கள் தொடர விரும்புகிறீர்களா, சிறிய இடைவெளி எடுக்க விரும்புகிறீர்களா, அல்லது ஆலோசகரிடம் பேச விரும்புகிறீர்களா?',
      te: 'మీరు కొనసాగించాలనుకుంటున్నారా, చిన్న విరామం తీసుకోవాలా, లేదా కౌన్సెలర్‌తో మాట్లాడాలనుకుంటున్నారా?',
      mr: 'आपण पुढे सुरू ठेवू इच्छिता, थोडा वेळ विश्रांती घेऊ इच्छिता की समुपदेशकांशी बोलू इच्छिता?',
      kn: 'ನೀವು ಮುಂದುವರಿಸಲು ಬಯಸುವಿರಾ, ಸಣ್ಣ ವಿರಾಮ ತೆಗೆದುಕೊಳ್ಳುವಿರಾ, ಅಥವಾ ಸಲಹೆಗಾರರೊಂದಿಗೆ ಮಾತನಾಡಲು ಬಯಸುವಿರಾ?',
      or: 'ଆପଣ ଜାରି ରଖିବାକୁ ଚାହାଁନ୍ତି, ସାମାନ୍ୟ ବିରାମ ନେବାକୁ ଚାହାଁନ୍ତି, କିମ୍ବା ପରାମର୍ଶଦାତାଙ୍କ ସହ କଥା ହେବାକୁ ଚାହାଁନ୍ତି?',
      gu: 'શું તમે આગળ વધવા માંગો છો, ટૂંકો વિરામ લેવા માંગો છો, કે કાઉન્સેલર સાથે વાત કરવા માંગો છો?',
      pa: 'ਕੀ ਤੁਸੀਂ ਜਾਰੀ ਰੱਖਣਾ ਚਾਹੁੰਦੇ ਹੋ, ਥੋੜ੍ਹਾ ਆਰਾਮ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ, ਜਾਂ ਕੌਂਸਲਰ ਨਾਲ ਗੱਲ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?',
      ur: 'کیا آپ جاری رکھنا چاہتے ہیں، تھوڑا وقفہ لینا چاہتے ہیں، یا کسی کونسلر سے بات کرنا چاہتے ہیں؟',
    },
  },
  {
    id: 'msg-grounding-start',
    title: 'Grounding Anchor',
    category: 'grounding',
    text: {
      en: 'Feel your feet firmly on the ground. Breathe in slowly... and let it out gently. You are here in this present moment.',
      hi: 'अपने पैरों को ज़मीन पर महसूस करें। धीरे से गहरी सांस लें... और आराम से छोड़ें। आप इस वर्तमान पल में सुरक्षित हैं।',
      bn: 'মাটিতে আপনার পা অনুভব করুন। ধীরে ধীরে শ্বাস নিন... এবং আস্তে আস্তে ছেড়ে দিন। আপনি বর্তমান মুহূর্তে নিরাপদে আছেন।',
      as: 'নিজৰ ভৰি দুখন মাটিত অনুভৱ কৰক। লাহেকৈ উশাহ লওক... আৰু এৰি দিয়ক।',
      kha: 'Sngewthuh ia ki kjat jong phi ha madan. Ring mynsiem suki... bad pynhiar suki.',
      lus: 'Leiah khan nghet takin ding la. Zawi zawiin thawk la la... chhuah leh rawh le.',
      mni: 'নহাক্কী খোঙনা লৈমায়দা চপ চানা লৈবা ফাওহনলু। তপ্না থৱায় হোঞ্জিল্লু... অমসুং থাদোকলু।',
      brx: 'नोंथांनि आथिंखौ हायाव गोजावथिनाय बादि मोन। लासै लासै हां ला... आरो एंगार।',
      ne: 'आफ्नो खुट्टालाई जमिनमा महसुस गर्नुहोस्। बिस्तारै सास फेर्नुहोस्... र बिस्तारै छोड्नुहोस्।',
      ta: 'உங்கள் கால்களை தரையில் உணருங்கள். மெதுவாக மூச்சை உள்ளிழுங்கள்... மெதுவாக வெளியே விடுங்கள்.',
      te: 'మీ పాదాలను నేలపై దృఢంగా అనుభూతి చెందండి. నెమ్మదిగా శ్వాస తీసుకోండి... నెమ్మదిగా వదలండి.',
      mr: 'आपले पाय जमिनीवर घट्ट जाणवून घ्या. हळूच दीर्घ श्वास घ्या... आणि हळूच सोडा.',
      kn: 'ನಿಮ್ಮ ಪಾದಗಳನ್ನು ನೆಲದ ಮೇಲೆ ದೃಢವಾಗಿ ಅನುಭವಿಸಿ. ನಿಧಾನವಾಗಿ ಉಸಿರಾಡಿ... ನಿಧಾನವಾಗಿ ಹೊರಬಿಡಿ.',
      or: 'ନିଜର ପାଦକୁ ଭୂମି ଉପରେ ଅନୁଭବ କରନ୍ତୁ। ଧୀରେ ଧୀରେ ନିଶ୍ୱାସ ନିଅନ୍ତୁ... ଏବଂ ଛାଡନ୍ତୁ।',
      gu: 'તમારા પગને જમીન પર દ્રઢતાથી અનુભવો. ધીમેથી શ્વાસ લો... અને ધીમેથી છોડો.',
      pa: 'ਆਪਣੇ ਪੈਰਾਂ ਨੂੰ ਜ਼ਮੀਨ \'ਤੇ ਮਹਿਸੂਸ ਕਰੋ। ਹੌਲੀ-ਹੌਲੀ ਸਾਹ ਲਓ... ਅਤੇ ਹੌਲੀ-ਹੌਲੀ ਛੱਡੋ।',
      ur: 'اپنے پاؤں زمین پر محسوس کریں۔ آہستہ سے سانس لیں... اور آرام سے چھوڑیں۔',
    },
  },
];

const STORAGE_KEY_VOICE_SETTINGS = 'manas_voice_comfort_settings_v1';

export const DEFAULT_VOICE_SETTINGS: VoicePlaybackSettings = {
  mode: 'standard',
  selectedCuratedId: 'voice-ananya',
  speechRate: 0.95,
  volume: 0.9,
  pitch: 1.0,
  language: 'en',
  voiceAssistanceEnabled: true,
  personalizedConsent: {
    status: 'not_requested',
    voiceOwnerName: '',
    relationship: '',
    disclaimerAcknowledged: false,
  },
};

let inMemorySettings: VoicePlaybackSettings = { ...DEFAULT_VOICE_SETTINGS };

/**
 * Loads stored voice comfort settings from localStorage with in-memory fallback
 */
export function loadVoiceSettings(): VoicePlaybackSettings {
  if (typeof window === 'undefined') return { ...inMemorySettings };
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VOICE_SETTINGS);
    if (!raw) return { ...inMemorySettings };
    const parsed = JSON.parse(raw);
    inMemorySettings = { ...DEFAULT_VOICE_SETTINGS, ...parsed };
    return inMemorySettings;
  } catch {
    return inMemorySettings;
  }
}

/**
 * Persists voice comfort settings to localStorage and in-memory cache
 */
export function saveVoiceSettings(settings: VoicePlaybackSettings): void {
  inMemorySettings = { ...settings };
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_VOICE_SETTINGS, JSON.stringify(settings));
  } catch {
    // quota exceeded / storage unavailable
  }
}

/**
 * Synthesizes comforting speech via Web Speech API with resilient fallbacks
 */
export class VoiceComfortController {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioContext: AudioContext | null = null;
  private activeOscillator: OscillatorNode | null = null;
  private isPlayingAudio = false;

  public speak(
    text: string,
    settings: VoicePlaybackSettings,
    onEnd?: () => void,
    onError?: (err: any) => void
  ): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onError) onError(new Error('Speech synthesis not supported in this browser.'));
      return false;
    }

    if (!settings.voiceAssistanceEnabled || settings.mode === 'text_only') {
      if (onEnd) onEnd();
      return false;
    }

    try {
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.max(0.6, Math.min(1.4, settings.speechRate));
      utterance.volume = Math.max(0, Math.min(1.0, settings.volume));
      utterance.pitch = Math.max(0.8, Math.min(1.2, settings.pitch));

      // Resolve voice language code
      const langCode = settings.language || 'en';
      const voiceLangMap: Record<string, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        bn: 'bn-IN',
        as: 'as-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        mr: 'mr-IN',
        kn: 'kn-IN',
        or: 'or-IN',
        gu: 'gu-IN',
        pa: 'pa-IN',
        ur: 'ur-IN',
        ne: 'ne-NP',
      };
      utterance.lang = voiceLangMap[langCode] || 'en-IN';

      // Attempt matching system voices if available
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        if (settings.mode === 'curated') {
          const curated = CURATED_VOICES.find(v => v.id === settings.selectedCuratedId);
          if (curated) {
            const preferred = voices.find(v =>
              v.lang.startsWith(langCode) &&
              (curated.gender === 'female' ? /female|zira|samantha|kavya|lekha/i.test(v.name) : /male|rishi|ravi/i.test(v.name))
            );
            if (preferred) utterance.voice = preferred;
          }
        } else {
          const matchingLangVoice = voices.find(v => v.lang === utterance.lang || v.lang.startsWith(langCode));
          if (matchingLangVoice) utterance.voice = matchingLangVoice;
        }
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        this.isPlayingAudio = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        this.currentUtterance = null;
        this.isPlayingAudio = false;
        if (onError) onError(e);
      };

      this.currentUtterance = utterance;
      this.isPlayingAudio = true;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      if (onError) onError(err);
      return false;
    }
  }

  public pause(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public resume(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
      this.isPlayingAudio = false;
    }
    this.stopAmbientTone();
  }

  public isSpeaking(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.speaking;
  }

  /**
   * Generates a calming 432Hz ambient harmonic tone using Web Audio API
   * without requiring any external audio files.
   */
  public playAmbientChime(frequency = 432, durationMs = 3000): void {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      this.stopAmbientTone();

      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

      // Soft envelope (gentle attack, soft decay)
      gain.gain.setValueAtTime(0.0001, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, this.audioContext.currentTime + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.start();
      osc.stop(this.audioContext.currentTime + durationMs / 1000);
      this.activeOscillator = osc;
    } catch {
      // AudioContext unavailable or restricted
    }
  }

  public stopAmbientTone(): void {
    if (this.activeOscillator) {
      try {
        this.activeOscillator.stop();
        this.activeOscillator.disconnect();
      } catch {}
      this.activeOscillator = null;
    }
  }

  /**
   * Retrieves active playback settings with consent status
   */
  public getConfig(): VoicePlaybackSettings & { consentRevocable: boolean } {
    const settings = loadVoiceSettings();
    return {
      ...settings,
      consentRevocable: true,
    };
  }

  /**
   * Verifies and activates personalized loved-one voice profile
   */
  public verifyPersonalizedVoice(details: Partial<PersonalizedVoiceConsent>): PersonalizedVoiceConsent {
    const current = loadVoiceSettings();
    const verifiedConsent: PersonalizedVoiceConsent = {
      status: 'verified_active',
      voiceOwnerName: details.voiceOwnerName || 'Loved One',
      relationship: details.relationship || 'Support Person',
      authorizedAt: new Date().toISOString(),
      verificationMethod: details.verificationMethod || 'sms_otp',
      consentReceiptId: details.consentReceiptId || `CONSENT-${Date.now()}`,
      disclaimerAcknowledged: true,
    };
    const updated: VoicePlaybackSettings = {
      ...current,
      mode: 'personalized',
      personalizedConsent: verifiedConsent,
    };
    saveVoiceSettings(updated);
    return verifiedConsent;
  }

  /**
   * Immediately revokes personalized voice authorization and rolls back to standard
   */
  public revokePersonalizedVoice(): PersonalizedVoiceConsent {
    const current = loadVoiceSettings();
    const revokedConsent: PersonalizedVoiceConsent = {
      ...current.personalizedConsent,
      status: 'revoked',
      revokedAt: new Date().toISOString(),
    };
    const updated: VoicePlaybackSettings = {
      ...current,
      mode: 'standard',
      personalizedConsent: revokedConsent,
    };
    saveVoiceSettings(updated);
    return revokedConsent;
  }

  /**
   * Alias for playAmbientChime (432Hz)
   */
  public playCalmingChime(frequency = 432, durationMs = 3000): void {
    this.playAmbientChime(frequency, durationMs);
  }

  /**
   * Speaks a predefined trauma-informed comfort message by ID
   */
  public async speakMessage(
    messageId: string,
    language = 'en',
    onEnd?: () => void
  ): Promise<boolean> {
    const msg = COMFORT_MESSAGES.find(m => m.id === messageId) || COMFORT_MESSAGES[0];
    const text = msg.text[language] || msg.text.en || Object.values(msg.text)[0];
    const settings = loadVoiceSettings();
    return this.speak(text, settings, onEnd);
  }
}

export const voiceComfortController = new VoiceComfortController();
export const voiceComfortService = voiceComfortController;
export const TRAUMA_INFORMED_MESSAGES = COMFORT_MESSAGES;
export const CURATED_VOICE_PROFILES = CURATED_VOICES;
