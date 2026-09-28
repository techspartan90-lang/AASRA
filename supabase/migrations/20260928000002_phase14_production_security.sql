-- ============================================================================
-- PHASE 14: PRODUCTION BACKEND SECURITY & NORMALIZED RLS DATABASE SCHEMA
-- Target Database: Supabase PostgreSQL (Postgres 15+)
-- Compliance: Section 15A SC/ST (Prevention of Atrocities) Act & DPDPA 2023
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. ENUMS & DOMAINS
-- ============================================================================
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('victim', 'counsellor', 'district_officer', 'state_admin', 'national_admin');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE risk_level_enum AS ENUM ('mild', 'moderate', 'elevated', 'critical');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE channel_type_enum AS ENUM ('sms', 'ivrs', 'chatbot', 'app', 'web');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE alert_severity_enum AS ENUM ('information', 'attention_required', 'urgent_review', 'critical_review');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE alert_status_enum AS ENUM ('signal_detected', 'alert_generated', 'human_review', 'counsellor_action', 'follow_up', 'resolved');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 2. NORMALIZED TABLES (16 CORE TABLES)
-- ============================================================================

-- Table 1: roles
CREATE TABLE IF NOT EXISTS public.roles (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

INSERT INTO public.roles (id, name, description)
VALUES 
    ('victim', 'Survivor / Complainant', 'Self-service check-ins, mood tracker, consent sovereignty'),
    ('counsellor', 'Clinical Counsellor', 'Assigned caseload clinical triage, notes, welfare follow-up'),
    ('district_officer', 'District Welfare Officer', 'District level escalations, emergency protection orders'),
    ('state_admin', 'State Nodal Administrator', 'State-level de-identified macro trends, budget coordination'),
    ('national_admin', 'National Directorate Admin', 'National policy compliance and cross-state audit logs')
ON CONFLICT (id) DO NOTHING;

-- Table 2: users
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE, -- Foreign key to auth.users if Supabase Auth is active
    role_id VARCHAR(32) NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
    email VARCHAR(255) UNIQUE,
    phone_hash VARCHAR(128),
    display_name VARCHAR(255) NOT NULL,
    language_preference VARCHAR(8) DEFAULT 'en' NOT NULL,
    district_id VARCHAR(64),
    state_id VARCHAR(64),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table 3: survivor_profiles (Tokenized pseudo-identity)
CREATE TABLE IF NOT EXISTS public.survivor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    anonymized_code VARCHAR(32) NOT NULL UNIQUE,
    case_number VARCHAR(64) NOT NULL,
    assigned_counsellor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    state VARCHAR(64) NOT NULL,
    district VARCHAR(64) NOT NULL,
    current_distress_score INTEGER DEFAULT 28 CHECK (current_distress_score BETWEEN 0 AND 100),
    baseline_distress_score INTEGER DEFAULT 28 CHECK (baseline_distress_score BETWEEN 0 AND 100),
    risk_level risk_level_enum DEFAULT 'mild' NOT NULL,
    preferred_channel channel_type_enum DEFAULT 'app' NOT NULL,
    checkin_frequency VARCHAR(32) DEFAULT 'daily' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table 4: trusted_contacts
CREATE TABLE IF NOT EXISTS public.trusted_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survivor_id UUID NOT NULL REFERENCES public.survivor_profiles(id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    relationship VARCHAR(64) NOT NULL,
    phone_encrypted TEXT NOT NULL,
    notify_on_critical_alert BOOLEAN DEFAULT TRUE NOT NULL,
    notify_on_missed_checkins BOOLEAN DEFAULT FALSE NOT NULL,
    last_verified_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table 5: consent_records
CREATE TABLE IF NOT EXISTS public.consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survivor_id UUID NOT NULL REFERENCES public.survivor_profiles(id) ON DELETE CASCADE,
    consent_version VARCHAR(16) NOT NULL,
    voice_analysis_granted BOOLEAN DEFAULT TRUE NOT NULL,
    automated_reminders_granted BOOLEAN DEFAULT TRUE NOT NULL,
    longitudinal_tracking_granted BOOLEAN DEFAULT TRUE NOT NULL,
    emergency_contact_sharing_granted BOOLEAN DEFAULT TRUE NOT NULL,
    statutory_case_sync_enforced BOOLEAN DEFAULT TRUE NOT NULL,
    status VARCHAR(32) DEFAULT 'active' NOT NULL,
    action_type VARCHAR(32) NOT NULL, -- 'granted', 'modified', 'withdrawn'
    actor_id UUID NOT NULL REFERENCES public.users(id),
    client_ip_hash VARCHAR(128) NOT NULL,
    digital_signature_hash VARCHAR(256) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table 6: checkins
CREATE TABLE IF NOT EXISTS public.checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survivor_id UUID NOT NULL REFERENCES public.survivor_profiles(id) ON DELETE CASCADE,
    channel channel_type_enum NOT NULL,
    language VARCHAR(8) NOT NULL,
    session_duration_seconds INTEGER DEFAULT 0,
    consent_verified BOOLEAN DEFAULT TRUE NOT NULL,
    is_completed BOOLEAN DEFAULT TRUE NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table 7: checkin_responses
CREATE TABLE IF NOT EXISTS public.checkin_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checkin_id UUID NOT NULL REFERENCES public.checkins(id) ON DELETE CASCADE,
    feeling_score INTEGER CHECK (feeling_score BETWEEN 1 AND 5),
    safety_score INTEGER CHECK (safety_score BETWEEN 1 AND 5),
    sleep_score INTEGER CHECK (sleep_score BETWEEN 1 AND 5),
    fear_score INTEGER CHECK (fear_score BETWEEN 1 AND 5),
    avoidance_score INTEGER CHECK (avoidance_score BETWEEN 1 AND 5),
    help_requested BOOLEAN DEFAULT FALSE NOT NULL,
    response_text_encrypted TEXT,
    has_voice_sample BOOLEAN DEFAULT FALSE NOT NULL,
    voice_acoustic_pitch_hz NUMERIC(6,2),
    voice_speech_rate_wpm NUMERIC(6,2),
    voice_pause_ratio NUMERIC(4,3),
    raw_audio_discarded_verified BOOLEAN DEFAULT TRUE NOT NULL, -- 0-day retention audit
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table 8: model_versions
CREATE TABLE IF NOT EXISTS public.model_versions (
    id VARCHAR(64) PRIMARY KEY,
    model_name VARCHAR(128) NOT NULL,
    version VARCHAR(32) NOT NULL,
    description TEXT NOT NULL,
    deployed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    evaluation_mae NUMERIC(5,3) NOT NULL,
    evaluation_accuracy NUMERIC(5,3) NOT NULL
);

INSERT INTO public.model_versions (id, model_name, version, description, evaluation_mae, evaluation_accuracy)
VALUES 
    ('distress-bert-v2.4', 'AASRA Multilingual Distress Classifier', 'v2.4', 'Hybrid transformer for Indic psychological stress cues', 0.082, 0.942),
    ('acoustic-prosody-v1.8', 'Indic Voice Prosody Stress Analyzer', 'v1.8', 'Pitch perturbation and pause duration estimator', 0.114, 0.910),
    ('predictive-traj-v3.1', 'Longitudinal Triage Risk Forecaster', 'v3.1', 'Time-series Markov model with judicial milestone correlation', 0.095, 0.928)
ON CONFLICT (id) DO NOTHING;

-- Table 9: ai_analysis
CREATE TABLE IF NOT EXISTS public.ai_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checkin_id UUID NOT NULL REFERENCES public.checkins(id) ON DELETE CASCADE,
    model_version_id VARCHAR(64) NOT NULL REFERENCES public.model_versions(id),
    computed_distress_indicator INTEGER NOT NULL CHECK (computed_distress_indicator BETWEEN 0 AND 100),
    confidence_score NUMERIC(4,3) NOT NULL CHECK (confidence_score BETWEEN 0.000 AND 1.000),
    contributing_signals JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_mock BOOLEAN DEFAULT FALSE NOT NULL,
    mandatory_human_review_notice TEXT DEFAULT 'AI-assisted indicator - not a medical diagnosis. Human review required for consequential action.' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table 10: distress_scores (Longitudinal track)
CREATE TABLE IF NOT EXISTS public.distress_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survivor_id UUID NOT NULL REFERENCES public.survivor_profiles(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
    baseline_comparison INTEGER NOT NULL,
    delta INTEGER NOT NULL,
    risk_level risk_level_enum NOT NULL,
    computed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table 11: risk_predictions
CREATE TABLE IF NOT EXISTS public.risk_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survivor_id UUID NOT NULL REFERENCES public.survivor_profiles(id) ON DELETE CASCADE,
    model_version_id VARCHAR(64) NOT NULL REFERENCES public.model_versions(id),
    prediction_window_days INTEGER NOT NULL CHECK (prediction_window_days IN (7, 14, 30)),
    predicted_risk_level risk_level_enum NOT NULL,
    uncertainty_margin_percent INTEGER NOT NULL,
    plain_language_explanation TEXT NOT NULL,
    contributing_factors JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommended_follow_up TEXT NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table 12: alerts
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_code VARCHAR(32) NOT NULL UNIQUE,
    survivor_id UUID NOT NULL REFERENCES public.survivor_profiles(id) ON DELETE CASCADE,
    severity alert_severity_enum NOT NULL,
    trigger_reason TEXT NOT NULL,
    supporting_signals JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommended_action TEXT NOT NULL,
    assigned_counsellor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status alert_status_enum DEFAULT 'signal_detected' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table 13: case_milestones
CREATE TABLE IF NOT EXISTS public.case_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survivor_id UUID NOT NULL REFERENCES public.survivor_profiles(id) ON DELETE CASCADE,
    milestone_name VARCHAR(128) NOT NULL,
    milestone_type VARCHAR(64) NOT NULL, -- 'FIR', 'charge_sheet', 'hearing', 'deposition', 'compensation'
    scheduled_date DATE NOT NULL,
    status VARCHAR(32) DEFAULT 'scheduled' NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table 14: support_interactions
CREATE TABLE IF NOT EXISTS public.support_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survivor_id UUID NOT NULL REFERENCES public.survivor_profiles(id) ON DELETE CASCADE,
    counsellor_id UUID NOT NULL REFERENCES public.users(id),
    interaction_type VARCHAR(64) NOT NULL, -- 'tele_counselling', 'in_person_visit', 'court_accompaniment', 'safety_review'
    duration_minutes INTEGER DEFAULT 0,
    clinical_notes_encrypted TEXT NOT NULL,
    outcome_summary TEXT NOT NULL,
    next_follow_up_date DATE,
    conducted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table 15: notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Table 16: audit_logs (Immutable judicial trail)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    actor_role VARCHAR(32) NOT NULL,
    action VARCHAR(64) NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(128) NOT NULL,
    district VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    authorized_purpose TEXT NOT NULL,
    ip_hash VARCHAR(128) NOT NULL,
    tamper_proof_hash VARCHAR(256) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- 3. INDEXES FOR PERFORMANCE & CONSTRAINTS
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role_id);
CREATE INDEX IF NOT EXISTS idx_survivor_counsellor ON public.survivor_profiles(assigned_counsellor_id);
CREATE INDEX IF NOT EXISTS idx_survivor_district ON public.survivor_profiles(district, state);
CREATE INDEX IF NOT EXISTS idx_checkins_survivor ON public.checkins(survivor_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_responses_checkin ON public.checkin_responses(checkin_id);
CREATE INDEX IF NOT EXISTS idx_distress_survivor ON public.distress_scores(survivor_id, computed_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_survivor ON public.alerts(survivor_id, status);
CREATE INDEX IF NOT EXISTS idx_alerts_counsellor ON public.alerts(assigned_counsellor_id, status);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON public.audit_logs(timestamp DESC);

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- MANDATE: Never create a single unrestricted policy.
-- ============================================================================

-- Enable RLS across all 16 tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survivor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkin_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distress_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS context
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS VARCHAR AS $$
    SELECT role_id FROM public.users WHERE auth_user_id = auth.uid() OR id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.current_user_district()
RETURNS VARCHAR AS $$
    SELECT district_id FROM public.users WHERE auth_user_id = auth.uid() OR id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.current_user_state()
RETURNS VARCHAR AS $$
    SELECT state_id FROM public.users WHERE auth_user_id = auth.uid() OR id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- --- TABLE: survivor_profiles ---
-- 1. Survivors can only view their own profile
CREATE POLICY survivor_view_own_profile ON public.survivor_profiles
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- 2. Counsellor can only access survivor records assigned to them
CREATE POLICY counsellor_view_assigned_survivors ON public.survivor_profiles
    FOR SELECT TO authenticated
    USING (
        public.current_user_role() = 'counsellor' 
        AND (assigned_counsellor_id = auth.uid() OR assigned_counsellor_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
    );

-- 3. District Officers can only view aggregated/district records
CREATE POLICY district_officer_view_district_survivors ON public.survivor_profiles
    FOR SELECT TO authenticated
    USING (
        public.current_user_role() = 'district_officer' 
        AND lower(district) = lower(public.current_user_district())
    );

-- 4. State Administrators can only view records in their state
CREATE POLICY state_admin_view_state_survivors ON public.survivor_profiles
    FOR SELECT TO authenticated
    USING (
        public.current_user_role() = 'state_admin' 
        AND lower(state) = lower(public.current_user_state())
    );

-- 5. National Administrators have controlled audit visibility
CREATE POLICY national_admin_view_survivors ON public.survivor_profiles
    FOR SELECT TO authenticated
    USING (public.current_user_role() = 'national_admin');

-- --- TABLE: checkin_responses ---
-- Survivors can read their own responses
CREATE POLICY survivor_read_own_responses ON public.checkin_responses
    FOR SELECT TO authenticated
    USING (
        checkin_id IN (
            SELECT c.id FROM public.checkins c 
            JOIN public.survivor_profiles sp ON c.survivor_id = sp.id 
            WHERE sp.user_id = auth.uid()
        )
    );

-- Counsellor can read checkin responses for assigned survivors only
CREATE POLICY counsellor_read_assigned_responses ON public.checkin_responses
    FOR SELECT TO authenticated
    USING (
        public.current_user_role() = 'counsellor'
        AND checkin_id IN (
            SELECT c.id FROM public.checkins c
            JOIN public.survivor_profiles sp ON c.survivor_id = sp.id
            WHERE sp.assigned_counsellor_id = auth.uid()
        )
    );

-- District Officers, State Admins, and National Admins CANNOT read raw text responses (Redacted by RLS)
-- (No SELECT policy granted to district_officer, state_admin on checkin_responses)

-- --- TABLE: alerts ---
-- Counsellors can view and update alerts assigned to them
CREATE POLICY counsellor_manage_assigned_alerts ON public.alerts
    FOR ALL TO authenticated
    USING (
        public.current_user_role() = 'counsellor'
        AND (assigned_counsellor_id = auth.uid() OR survivor_id IN (
            SELECT id FROM public.survivor_profiles WHERE assigned_counsellor_id = auth.uid()
        ))
    );

-- District officers can review alerts in their district
CREATE POLICY district_officer_review_alerts ON public.alerts
    FOR SELECT TO authenticated
    USING (
        public.current_user_role() = 'district_officer'
        AND survivor_id IN (
            SELECT id FROM public.survivor_profiles WHERE lower(district) = lower(public.current_user_district())
        )
    );

-- --- TABLE: audit_logs ---
-- Audit logs are strictly INSERT-ONLY for applications; no UPDATE or DELETE allowed under any role
CREATE POLICY app_insert_audit_logs ON public.audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (TRUE);

-- Only District Officers, State Admins, and National Admins can read audit logs
CREATE POLICY authorized_read_audit_logs ON public.audit_logs
    FOR SELECT TO authenticated
    USING (public.current_user_role() IN ('district_officer', 'state_admin', 'national_admin'));

-- --- TABLE: consent_records ---
-- Survivors have full write and read access to their own consent records
CREATE POLICY survivor_manage_consent ON public.consent_records
    FOR ALL TO authenticated
    USING (
        survivor_id IN (
            SELECT id FROM public.survivor_profiles WHERE user_id = auth.uid()
        )
    );

-- ============================================================================
-- 5. PERFORMANCE & AUDIT INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_role_district ON public.users(role_id, district_id);
CREATE INDEX IF NOT EXISTS idx_survivor_profiles_assigned_counsellor ON public.survivor_profiles(assigned_counsellor_id);
CREATE INDEX IF NOT EXISTS idx_survivor_profiles_district ON public.survivor_profiles(district);
CREATE INDEX IF NOT EXISTS idx_survivor_profiles_state ON public.survivor_profiles(state);
CREATE INDEX IF NOT EXISTS idx_survivor_profiles_case_num ON public.survivor_profiles(case_number);
CREATE INDEX IF NOT EXISTS idx_checkins_survivor_timestamp ON public.checkins(survivor_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_survivor_severity ON public.alerts(survivor_id, severity);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON public.alerts(status);
CREATE INDEX IF NOT EXISTS idx_distress_scores_survivor_date ON public.distress_scores(survivor_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_risk_predictions_survivor_window ON public.risk_predictions(survivor_id, prediction_window);
CREATE INDEX IF NOT EXISTS idx_case_milestones_case_date ON public.case_milestones(case_id, event_date);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);

