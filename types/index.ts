export type UserRole =
  | 'victim'
  | 'counsellor'
  | 'district_officer'
  | 'state_admin'
  | 'national_admin';

export type CaseStage =
  | 'complaint'
  | 'investigation'
  | 'trial'
  | 'rehabilitation'
  | 'compensation'
  | 'protection';

export type RiskLevel = 'stable' | 'mild' | 'elevated' | 'high';

export interface TrendPoint {
  date: string;
  score: number;
  eventNote?: string;
  isCheckIn?: boolean;
}

export interface CaseRecord {
  id: string; // e.g. "ATC-2026-00124"
  anonymizedCode: string; // e.g. "V-9104"
  victimId?: string;
  registeredDate: string;
  state: string;
  district: string;
  stage: CaseStage;
  assignedCounsellor: string;
  currentScore: number; // 0 - 100
  previousScore: number;
  baselineScore: number;
  riskLevel: RiskLevel;
  lastCheckInDate: string;
  nextFollowUpDate: string;
  priorityReason: string;
  missedCheckInsCount: number;
  language: string;
  communicationPreference: 'app' | 'sms' | 'ivrs' | 'voice_call';
  recentSignals: string[];
  trendHistory: TrendPoint[];
}

export interface CheckInResponse {
  id: string;
  caseId: string;
  timestamp: string;
  feelingScore: number; // 1-5
  safetyScore: number; // 1-5
  sleepScore: number; // 1-5
  fearScore: number; // 1-5
  avoidanceScore: number; // 1-5
  requestHelp: boolean;
  notes?: string;
  voiceSimulatedDuration?: number; // seconds
  computedScore: number;
  riskLevel: RiskLevel;
  detectedSignals: string[];
  recommendation: string;
}

export interface RiskAlert {
  id: string;
  caseId: string;
  caseCode: string;
  district: string;
  riskLevel: RiskLevel;
  title: string;
  reason: string;
  timestamp: string;
  status: 'urgent' | 'pending' | 'reviewed' | 'resolved';
  signals: string[];
  assignedTo: string;
}

export type InterventionCategory =
  | 'counselling'
  | 'medical'
  | 'protection'
  | 'relocation'
  | 'financial'
  | 'legal'
  | 'rehabilitation';

export interface Intervention {
  id: string;
  caseId: string;
  category: InterventionCategory;
  title: string;
  description: string;
  assignedProfessional: string;
  scheduledDate: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  outcomeNotes?: string;
  aiSuggested?: boolean;
}

export interface CounsellingSession {
  id: string;
  caseId: string;
  counsellorName: string;
  date: string;
  modality: 'tele' | 'in_person' | 'home_visit';
  durationMinutes: number;
  summaryNotes: string;
  followUpRecommended: boolean;
  followUpDue: string;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  type: 'check_in' | 'alert' | 'follow_up' | 'appointment' | 'intervention' | 'system';
  title: string;
  message: string;
  timestamp?: string;
  read?: boolean;
  targetRole?: UserRole;
  linkCaseId?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  resource: string;
  district: string;
  purpose: string;
}

export interface UserConsent {
  voiceAnalysis: boolean;
  automatedReminders: boolean;
  longitudinalTracking: boolean;
  emergencyContactShared: boolean;
  lastUpdated: string;
}

export interface SupportRequest {
  id: string;
  caseId: string;
  timestamp: string;
  type: 'urgent_callback' | 'counselling' | 'protection' | 'general';
  status: 'open' | 'assigned' | 'resolved';
  userNote?: string;
  category?: string;
  priority?: string;
  description?: string;
  createdAt?: string;
}

// ==========================================
// PHASE 3 DATABASE / DOMAIN ENTITY CONTRACTS
// ==========================================

export interface UserEntity {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  language: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface VictimProfileEntity {
  id: string;
  userId: string;
  caseId: string;
  preferredLanguage: string;
  consentStatus: boolean;
  createdAt: string;
}

export interface CaseEntity {
  id: string;
  caseNumber: string;
  victimId: string;
  districtId: string;
  stateId: string;
  assignedCounsellorId: string;
  caseStage: CaseStage;
  status: 'active' | 'closed' | 'transferred';
  createdAt: string;
  updatedAt: string;
}

export interface CheckInEntity {
  id: string;
  caseId: string;
  timestamp: string;
  feeling: number;
  safetyConcern: number;
  sleep: number;
  fear: number;
  withdrawal: number;
  professionalSupport: boolean;
  textResponse?: string;
  voiceResponse?: boolean;
  completionStatus: 'completed' | 'partial' | 'missed';
}

export interface DistressAssessmentEntity {
  id: string;
  checkInId: string;
  caseId: string;
  indicator: number;
  level: RiskLevel;
  baseline: number;
  baselineDeviation: number;
  trend: string;
  confidence: number;
  contributingFactors: string[];
  createdAt?: string;
}

export interface RiskIndicatorEntity {
  id: string;
  caseId: string;
  indicator: number;
  level: RiskLevel;
  trend: string;
  source: 'check_in' | 'missed_check_in' | 'caseworker_update';
  createdAt?: string;
}

export interface AlertEntity {
  id: string;
  caseId: string;
  severity: RiskLevel;
  reason: string;
  status: 'urgent' | 'pending' | 'reviewed' | 'resolved';
  assignedTo: string;
  recommendedAction: string;
  createdAt?: string;
  reviewedAt?: string;
}

export interface InterventionEntity {
  id: string;
  caseId: string;
  type: InterventionCategory;
  description: string;
  assignedTo: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  startDate?: string;
  completionDate?: string;
  notes?: string;
}

export interface AppointmentEntity {
  id: string;
  caseId: string;
  type: 'counselling' | 'medical' | 'court_escort' | 'welfare_review';
  scheduledAt: string;
  status: 'scheduled' | 'completed' | 'missed' | 'rescheduled' | 'cancelled';
  assignedTo: string;
  notes?: string;
}

export interface ConsentEntity {
  id: string;
  userId: string;
  aiAnalysis: boolean;
  voiceAnalysis: boolean;
  communication: boolean;
  updatedAt?: string;
}

export interface AuditLogEntity {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export interface DistrictEntity {
  id: string;
  name: string;
  stateId: string;
}

export interface StateEntity {
  id: string;
  name: string;
}

export interface SurvivorOnboardingData {
  consentGranted: boolean;
  language: string;
  preferredChannel: 'sms' | 'ivrs' | 'chatbot' | 'app' | 'web';
  frequency: 'daily' | 'every_few_days' | 'weekly' | 'custom';
  customFrequencyNote?: string;
  trustedContact?: {
    enabled: boolean;
    name?: string;
    relationship?: string;
    phone?: string;
    triggerCondition?: 'missed_checkins' | 'emergency_only' | 'explicit_confirm';
  };
  privacyControls: {
    collectWellBeingScore: boolean;
    collectSleepNotes: boolean;
    collectVoiceAcoustics: boolean;
    shareWithCounsellor: boolean;
    shareAnonymizedDistrict: boolean;
    blockPoliceProsecution: boolean;
    preferredTime: 'morning' | 'afternoon' | 'evening';
    discreetMode: boolean;
  };
  completedAt: string;
}

export type CheckInChannel = 'chatbot' | 'ivrs' | 'sms' | 'mobile_app' | 'web_portal';

export interface VoiceResponseMetadata {
  hasAudio: boolean;
  durationSeconds?: number;
  audioFormat?: string;
  sampleRateHz?: number;
  acousticFeatures?: {
    pitchJitter?: number;
    speechRateWpm?: number;
    pauseDurationSeconds?: number;
    intensityVariance?: number;
  };
}

export interface EngagementMetadata {
  latencyMs: number;
  completionRate: number; // 0.0 to 1.0
  retryCount?: number;
  clientVersion: string;
  deviceType?: string;
  interactionDurationSeconds?: number;
}

export interface StandardCheckInRecord {
  id: string;
  survivor_id: string;
  timestamp: string;
  channel: CheckInChannel;
  language: string;
  mood_response: string; // 'Calm' | 'Okay' | 'Worried' | 'Overwhelmed' | 'Need support'
  text_response?: string;
  voice_response_metadata?: VoiceResponseMetadata;
  engagement_metadata: EngagementMetadata;
  consent_status: boolean;
  ai_analysis_status: 'pending' | 'completed' | 'flagged' | 'bypassed';
  distress_indicator: number; // 0-100
  confidence: number; // 0.0 to 1.0
  follow_up_status: 'none' | 'scheduled' | 'urgent_review' | 'resolved';
}

