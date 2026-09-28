import { StandardCheckInRecord, CheckInChannel, VoiceResponseMetadata, EngagementMetadata } from '@/types';
import { getSupabaseClient } from './supabase';

export interface IngestCheckInInput {
  survivor_id: string;
  channel: CheckInChannel;
  language: string;
  mood_response: string;
  text_response?: string;
  voice_response_metadata?: VoiceResponseMetadata;
  engagement_metadata?: Partial<EngagementMetadata>;
  consent_status?: boolean;
}

const INITIAL_CHECKINS: StandardCheckInRecord[] = [
  {
    id: 'chk-sms-101',
    survivor_id: 'usr-victim-001',
    timestamp: '2026-09-28T09:15:00Z',
    channel: 'sms',
    language: 'hi',
    mood_response: 'Okay',
    text_response: '2',
    engagement_metadata: {
      latencyMs: 1420,
      completionRate: 1.0,
      clientVersion: 'sms-gateway-v2',
      deviceType: 'feature_phone',
    },
    consent_status: true,
    ai_analysis_status: 'completed',
    distress_indicator: 42,
    confidence: 0.88,
    follow_up_status: 'none',
  },
  {
    id: 'chk-ivrs-102',
    survivor_id: 'usr-victim-001',
    timestamp: '2026-09-27T17:30:00Z',
    channel: 'ivrs',
    language: 'as',
    mood_response: 'Worried',
    voice_response_metadata: {
      hasAudio: true,
      durationSeconds: 18,
      audioFormat: 'wav',
      sampleRateHz: 8000,
      acousticFeatures: {
        pitchJitter: 0.042,
        speechRateWpm: 110,
        pauseDurationSeconds: 3.2,
      },
    },
    engagement_metadata: {
      latencyMs: 850,
      completionRate: 1.0,
      clientVersion: 'telephony-ivr-2.4',
      deviceType: 'pstn_call',
      interactionDurationSeconds: 85,
    },
    consent_status: true,
    ai_analysis_status: 'completed',
    distress_indicator: 58,
    confidence: 0.91,
    follow_up_status: 'scheduled',
  },
  {
    id: 'chk-chat-103',
    survivor_id: 'usr-victim-001',
    timestamp: '2026-09-26T14:10:00Z',
    channel: 'chatbot',
    language: 'ta',
    mood_response: 'Calm',
    text_response: 'Hearing completed smoothly today with advocate Ramesh beside me.',
    engagement_metadata: {
      latencyMs: 310,
      completionRate: 1.0,
      clientVersion: 'aasra-chat-web-3.1',
      deviceType: 'mobile_browser',
    },
    consent_status: true,
    ai_analysis_status: 'completed',
    distress_indicator: 26,
    confidence: 0.94,
    follow_up_status: 'none',
  },
  {
    id: 'chk-app-104',
    survivor_id: 'usr-victim-001',
    timestamp: '2026-09-25T08:45:00Z',
    channel: 'mobile_app',
    language: 'hi',
    mood_response: 'Overwhelmed',
    text_response: 'Trouble sleeping before the investigation review.',
    voice_response_metadata: {
      hasAudio: false,
    },
    engagement_metadata: {
      latencyMs: 195,
      completionRate: 1.0,
      clientVersion: 'manas-suraksha-android-v1.4',
      deviceType: 'smartphone_android',
    },
    consent_status: true,
    ai_analysis_status: 'completed',
    distress_indicator: 66,
    confidence: 0.92,
    follow_up_status: 'urgent_review',
  },
  {
    id: 'chk-web-105',
    survivor_id: 'usr-victim-001',
    timestamp: '2026-09-24T11:00:00Z',
    channel: 'web_portal',
    language: 'en',
    mood_response: 'Calm',
    text_response: 'Routine weekly check-in via survivor portal.',
    engagement_metadata: {
      latencyMs: 120,
      completionRate: 1.0,
      clientVersion: 'aasra-portal-nextjs',
      deviceType: 'desktop_chrome',
    },
    consent_status: true,
    ai_analysis_status: 'completed',
    distress_indicator: 22,
    confidence: 0.96,
    follow_up_status: 'none',
  },
];

export class CheckInPipelineService {
  private static instance: CheckInPipelineService;
  private checkIns: StandardCheckInRecord[] = [...INITIAL_CHECKINS];

  private constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('manas_checkin_records_v1');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.checkIns = parsed;
          }
        }
      } catch {
        // fallback to memory
      }
    }
  }

  public static getInstance(): CheckInPipelineService {
    if (!CheckInPipelineService.instance) {
      CheckInPipelineService.instance = new CheckInPipelineService();
    }
    return CheckInPipelineService.instance;
  }

  /**
   * Universal check-in ingestion endpoint.
   * Accepts inputs from Chatbot, IVRS, SMS, Mobile App, or Web Portal
   * and produces a standardized StandardCheckInRecord.
   */
  public async ingestCheckIn(input: IngestCheckInInput): Promise<StandardCheckInRecord> {
    const timestamp = new Date().toISOString();
    const id = `chk-${input.channel}-${Date.now().toString(36)}`;

    // Calculate distress indicator (0 - 100) based on mood and optional text/acoustic signals
    let baseDistress = 40;
    const moodNorm = input.mood_response.toLowerCase().trim();

    if (moodNorm.includes('calm') || moodNorm === '1') {
      baseDistress = 22;
    } else if (moodNorm.includes('okay') || moodNorm === '2') {
      baseDistress = 38;
    } else if (moodNorm.includes('worried') || moodNorm === '3') {
      baseDistress = 55;
    } else if (moodNorm.includes('overwhelmed') || moodNorm === '4') {
      baseDistress = 68;
    } else if (moodNorm.includes('support') || moodNorm.includes('distressed') || moodNorm === '5') {
      baseDistress = 76;
    }

    // Text sentiment nuance (non-clinical heuristics)
    if (input.text_response) {
      const lower = input.text_response.toLowerCase();
      if (lower.includes('fear') || lower.includes('threat') || lower.includes('unsafe') || lower.includes('danger')) {
        baseDistress = Math.min(95, baseDistress + 15);
      } else if (lower.includes('peace') || lower.includes('better') || lower.includes('calm') || lower.includes('good')) {
        baseDistress = Math.max(15, baseDistress - 10);
      }
    }

    // Voice acoustic nuance if voice metadata was voluntary
    if (input.voice_response_metadata?.acousticFeatures?.pitchJitter && input.voice_response_metadata.acousticFeatures.pitchJitter > 0.05) {
      baseDistress = Math.min(95, baseDistress + 8);
    }

    // CRITICAL SAFETY RULE:
    // "Do not automatically infer an emergency solely from one response."
    // High distress sets follow-up to 'urgent_review' or 'scheduled' for human caseworker follow-up,
    // NOT an automated police dispatch.
    let followUp: StandardCheckInRecord['follow_up_status'] = 'none';
    if (baseDistress >= 75) {
      followUp = 'urgent_review';
    } else if (baseDistress >= 50) {
      followUp = 'scheduled';
    }

    const standardRecord: StandardCheckInRecord = {
      id,
      survivor_id: input.survivor_id || 'usr-victim-001',
      timestamp,
      channel: input.channel,
      language: input.language,
      mood_response: input.mood_response,
      text_response: input.text_response,
      voice_response_metadata: input.voice_response_metadata,
      engagement_metadata: {
        latencyMs: input.engagement_metadata?.latencyMs || Math.floor(Math.random() * 300 + 150),
        completionRate: input.engagement_metadata?.completionRate || 1.0,
        retryCount: input.engagement_metadata?.retryCount || 0,
        clientVersion: input.engagement_metadata?.clientVersion || `pipeline-${input.channel}-v2.1`,
        deviceType: input.engagement_metadata?.deviceType || `${input.channel}_client`,
        interactionDurationSeconds: input.engagement_metadata?.interactionDurationSeconds,
      },
      consent_status: input.consent_status !== undefined ? input.consent_status : true,
      ai_analysis_status: 'completed',
      distress_indicator: baseDistress,
      confidence: 0.92,
      follow_up_status: followUp,
    };

    // Prepend to pipeline store
    this.checkIns = [standardRecord, ...this.checkIns];
    this.saveToStorage();

    // Supabase optional sync
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('check_ins').insert({
          id: standardRecord.id,
          survivor_id: standardRecord.survivor_id,
          channel: standardRecord.channel,
          language: standardRecord.language,
          feeling_score: Math.round(5 - (standardRecord.distress_indicator / 25)),
          notes: standardRecord.text_response || standardRecord.mood_response,
          created_at: standardRecord.timestamp,
        });
      } catch {
        // silent sync fallback
      }
    }

    return standardRecord;
  }

  public getAllCheckIns(): StandardCheckInRecord[] {
    return [...this.checkIns];
  }

  public getCheckInsByChannel(channel: CheckInChannel): StandardCheckInRecord[] {
    return this.checkIns.filter(c => c.channel === channel);
  }

  public getCheckInsBySurvivor(survivorId: string): StandardCheckInRecord[] {
    return this.checkIns.filter(c => c.survivor_id === survivorId);
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('manas_checkin_records_v1', JSON.stringify(this.checkIns));
      } catch {
        // storage quota fallback
      }
    }
  }
}

export const checkInPipelineService = CheckInPipelineService.getInstance();
