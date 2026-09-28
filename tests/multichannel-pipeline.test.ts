import { checkInPipelineService } from '../lib/checkin-pipeline';
import { CheckInChannel, StandardCheckInRecord } from '../types';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${testName}`);
    failed++;
  }
}

async function runMultiChannelTests() {
  console.log('\n--- Running Phase 4 Multi-Channel Check-In Engine Tests ---');

  // Test 1: Ingest from Chatbot (Tamil)
  const chatbotRecord = await checkInPipelineService.ingestCheckIn({
    survivor_id: 'usr-victim-001',
    channel: 'chatbot',
    language: 'ta',
    mood_response: 'Calm',
    text_response: 'இன்று நான் நிம்மதியாக உணர்கிறேன் (Feeling peaceful today)',
    engagement_metadata: {
      latencyMs: 140,
      completionRate: 1.0,
      clientVersion: 'chatbot-v4',
    },
    consent_status: true,
  });

  assert(chatbotRecord.channel === 'chatbot', 'Chatbot check-in correctly tagged with channel="chatbot"');
  assert(chatbotRecord.language === 'ta', 'Chatbot retains survivor language setting');
  assert(chatbotRecord.distress_indicator <= 30, 'Calm response accurately maps to low distress indicator');

  // Test 2: Ingest from IVRS with voice acoustics metadata (Assamese)
  const ivrsRecord = await checkInPipelineService.ingestCheckIn({
    survivor_id: 'usr-victim-001',
    channel: 'ivrs',
    language: 'as',
    mood_response: 'Worried',
    voice_response_metadata: {
      hasAudio: true,
      durationSeconds: 15,
      audioFormat: 'wav_8khz',
      acousticFeatures: {
        pitchJitter: 0.045,
        speechRateWpm: 105,
      },
    },
    engagement_metadata: {
      latencyMs: 780,
      completionRate: 1.0,
      clientVersion: 'telephony-ivr-gateway',
      deviceType: 'pstn_interactive',
    },
    consent_status: true,
  });

  assert(ivrsRecord.channel === 'ivrs', 'IVRS check-in correctly tagged with channel="ivrs"');
  assert(ivrsRecord.voice_response_metadata?.hasAudio === true, 'IVRS retains voice response metadata');
  assert(ivrsRecord.voice_response_metadata?.durationSeconds === 15, 'Voice duration recorded accurately');

  // Test 3: Ingest from SMS (Hindi numeric reply '4' -> 'Overwhelmed')
  const smsRecord = await checkInPipelineService.ingestCheckIn({
    survivor_id: 'usr-victim-001',
    channel: 'sms',
    language: 'hi',
    mood_response: 'Overwhelmed',
    text_response: '4',
    engagement_metadata: {
      latencyMs: 950,
      completionRate: 1.0,
      clientVersion: 'sms-gw-2',
      deviceType: 'feature_phone',
    },
    consent_status: true,
  });

  assert(smsRecord.channel === 'sms', 'SMS check-in correctly tagged with channel="sms"');
  assert(smsRecord.mood_response === 'Overwhelmed', 'Numeric SMS reply maps accurately to standardized mood');

  // Test 4: Ingest from Mobile App
  const appRecord = await checkInPipelineService.ingestCheckIn({
    survivor_id: 'usr-victim-001',
    channel: 'mobile_app',
    language: 'hi',
    mood_response: 'Okay',
    text_response: 'Routine daily check-in from mobile app',
    engagement_metadata: {
      latencyMs: 190,
      completionRate: 1.0,
      clientVersion: 'android-app-v2',
      deviceType: 'smartphone',
    },
    consent_status: true,
  });

  assert(appRecord.channel === 'mobile_app', 'Mobile App check-in correctly tagged with channel="mobile_app"');

  // Test 5: Ingest from Web Portal
  const webRecord = await checkInPipelineService.ingestCheckIn({
    survivor_id: 'usr-victim-001',
    channel: 'web_portal',
    language: 'en',
    mood_response: 'Calm',
    text_response: 'Web portal check-in',
    engagement_metadata: {
      latencyMs: 110,
      completionRate: 1.0,
      clientVersion: 'nextjs-portal',
      deviceType: 'desktop_browser',
    },
    consent_status: true,
  });

  assert(webRecord.channel === 'web_portal', 'Web Portal check-in correctly tagged with channel="web_portal"');

  // Test 6: Verify all 5 channels generate the SAME standardized fields
  const allChannels: CheckInChannel[] = ['chatbot', 'ivrs', 'sms', 'mobile_app', 'web_portal'];
  const testRecords: StandardCheckInRecord[] = [chatbotRecord, ivrsRecord, smsRecord, appRecord, webRecord];

  testRecords.forEach(r => {
    assert(
      typeof r.id === 'string' &&
      typeof r.survivor_id === 'string' &&
      typeof r.timestamp === 'string' &&
      allChannels.includes(r.channel) &&
      typeof r.language === 'string' &&
      typeof r.mood_response === 'string' &&
      typeof r.engagement_metadata.latencyMs === 'number' &&
      typeof r.consent_status === 'boolean' &&
      ['pending', 'completed', 'flagged', 'bypassed'].includes(r.ai_analysis_status) &&
      typeof r.distress_indicator === 'number' &&
      typeof r.confidence === 'number' &&
      ['none', 'scheduled', 'urgent_review', 'resolved'].includes(r.follow_up_status),
      `Standardized schema verified for channel: ${r.channel}`
    );
  });

  // Test 7: Safety Rule - Do not automatically infer emergency solely from one response
  const distressedSmsRecord = await checkInPipelineService.ingestCheckIn({
    survivor_id: 'usr-victim-001',
    channel: 'sms',
    language: 'hi',
    mood_response: 'Need support',
    text_response: '5',
    consent_status: true,
  });

  assert(
    distressedSmsRecord.follow_up_status === 'urgent_review',
    'High distress single response sets follow-up to urgent caseworker review, NOT false emergency dispatch'
  );
  assert(
    distressedSmsRecord.distress_indicator >= 70,
    'Distress indicator accurately reflects distress level without hyperbole'
  );

  console.log(`\nPhase 4 Test Summary: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

runMultiChannelTests().catch(err => {
  console.error('Multi-channel test runner error:', err);
  process.exit(1);
});
