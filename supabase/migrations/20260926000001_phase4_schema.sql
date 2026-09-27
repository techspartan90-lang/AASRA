-- ==============================================================================
-- SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS) MIGRATION
-- Project: AI-Assisted Dynamic Mental Health Monitoring and Distress Early-Warning System
-- Phase 4: Production-Grade Persistence, Role-Based Access Control & Auditing
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. REFERENCE TABLES: STATES & DISTRICTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS states (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS districts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    state_id TEXT NOT NULL REFERENCES states(id) ON DELETE CASCADE,
    UNIQUE(name, state_id)
);

-- Seed Initial States & Districts
INSERT INTO states (id, name) VALUES 
('assam', 'Assam'),
('maharashtra', 'Maharashtra'),
('karnataka', 'Karnataka'),
('delhi', 'Delhi NCR')
ON CONFLICT (id) DO NOTHING;

INSERT INTO districts (id, name, state_id) VALUES 
('kamrup', 'Kamrup Metropolitan', 'assam'),
('cachar', 'Cachar', 'assam'),
('mumbai_suburban', 'Mumbai Suburban', 'maharashtra'),
('pune', 'Pune', 'maharashtra'),
('bengaluru_urban', 'Bengaluru Urban', 'karnataka'),
('central_delhi', 'Central Delhi', 'delhi')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 2. USER PROFILES & ROLES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('victim', 'counsellor', 'district_officer', 'state_admin', 'national_admin')),
    phone TEXT,
    district_id TEXT REFERENCES districts(id),
    state_id TEXT REFERENCES states(id),
    language TEXT NOT NULL DEFAULT 'en',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. VICTIM PROFILES & CASES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS victim_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    case_id TEXT NOT NULL UNIQUE,
    preferred_language TEXT NOT NULL DEFAULT 'en',
    consent_status TEXT NOT NULL DEFAULT 'active' CHECK (consent_status IN ('active', 'revoked', 'pending')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cases (
    id TEXT PRIMARY KEY, -- Supports semantic IDs like 'CASE-001' or UUIDs
    case_number TEXT NOT NULL UNIQUE,
    victim_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    district_id TEXT REFERENCES districts(id),
    state_id TEXT REFERENCES states(id),
    assigned_counsellor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    case_stage TEXT NOT NULL DEFAULT 'intake' CHECK (case_stage IN ('intake', 'assessment', 'active', 'monitoring', 'closed')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'urgent', 'monitoring', 'resolved', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. CHECK-INS & ASSESSMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS check_ins (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    feeling INTEGER NOT NULL CHECK (feeling BETWEEN 1 AND 5),
    safety_concern TEXT NOT NULL,
    sleep TEXT NOT NULL,
    fear TEXT NOT NULL,
    withdrawal TEXT NOT NULL,
    professional_support TEXT NOT NULL,
    text_response TEXT,
    voice_response TEXT,
    completion_status TEXT NOT NULL DEFAULT 'completed' CHECK (completion_status IN ('completed', 'partial', 'abandoned')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS distress_assessments (
    id TEXT PRIMARY KEY,
    check_in_id TEXT REFERENCES check_ins(id) ON DELETE CASCADE,
    case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    indicator NUMERIC(5, 2) NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('Low', 'Moderate', 'Elevated', 'High')),
    baseline NUMERIC(5, 2) NOT NULL,
    baseline_deviation NUMERIC(5, 2) NOT NULL,
    trend TEXT NOT NULL CHECK (trend IN ('Improving', 'Stable', 'Increasing', 'Rapidly increasing', 'Fluctuating', 'Insufficient data')),
    confidence NUMERIC(4, 2) NOT NULL,
    contributing_factors JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS risk_indicators (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    indicator TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('Low', 'Moderate', 'Elevated', 'High')),
    trend TEXT NOT NULL,
    source TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. ALERTS, INTERVENTIONS & APPOINTMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    severity TEXT NOT NULL CHECK (severity IN ('Low', 'Moderate', 'Elevated', 'High', 'Critical')),
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'investigating', 'resolved')),
    assigned_to TEXT,
    recommended_action TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS interventions (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    assigned_to TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completion_date TIMESTAMPTZ,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'rescheduled', 'cancelled')),
    assigned_to TEXT,
    notes TEXT
);

-- ------------------------------------------------------------------------------
-- 6. SUPPORT REQUESTS, NOTIFICATIONS, CONSENTS & AUDIT LOGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS support_requests (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'routine' CHECK (priority IN ('routine', 'urgent', 'emergency')),
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'resolved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS consents (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    ai_analysis BOOLEAN NOT NULL DEFAULT TRUE,
    voice_analysis BOOLEAN NOT NULL DEFAULT FALSE,
    communication BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- ------------------------------------------------------------------------------
-- 7. PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_cases_victim_id ON cases(victim_id);
CREATE INDEX IF NOT EXISTS idx_cases_counsellor_id ON cases(assigned_counsellor_id);
CREATE INDEX IF NOT EXISTS idx_cases_district_id ON cases(district_id);
CREATE INDEX IF NOT EXISTS idx_cases_state_id ON cases(state_id);

CREATE INDEX IF NOT EXISTS idx_checkins_case_id ON check_ins(case_id);
CREATE INDEX IF NOT EXISTS idx_checkins_created_at ON check_ins(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_assessments_case_id ON distress_assessments(case_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON distress_assessments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_risk_indicators_case_id ON risk_indicators(case_id);

CREATE INDEX IF NOT EXISTS idx_alerts_case_id ON alerts(case_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);

CREATE INDEX IF NOT EXISTS idx_interventions_case_id ON interventions(case_id);
CREATE INDEX IF NOT EXISTS idx_interventions_status ON interventions(status);

CREATE INDEX IF NOT EXISTS idx_appointments_case_id ON appointments(case_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments(scheduled_at);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- ------------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Helper functions for RLS checks
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_district()
RETURNS TEXT AS $$
    SELECT district_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_state()
RETURNS TEXT AS $$
    SELECT state_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Enable RLS across all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE victim_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE distress_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can read own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id OR get_user_role() IN ('district_officer', 'state_admin', 'national_admin'));

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- CASES POLICIES
CREATE POLICY "Role-based case read access"
    ON cases FOR SELECT
    USING (
        (get_user_role() = 'victim' AND victim_id = auth.uid()) OR
        (get_user_role() = 'counsellor' AND assigned_counsellor_id = auth.uid()) OR
        (get_user_role() = 'district_officer' AND district_id = get_user_district()) OR
        (get_user_role() = 'state_admin' AND state_id = get_user_state()) OR
        (get_user_role() = 'national_admin')
    );

CREATE POLICY "Counsellors and admins can update assigned cases"
    ON cases FOR UPDATE
    USING (
        (get_user_role() = 'counsellor' AND assigned_counsellor_id = auth.uid()) OR
        (get_user_role() IN ('district_officer', 'state_admin', 'national_admin'))
    );

-- CHECK-INS POLICIES
CREATE POLICY "Victims can submit own checkins"
    ON check_ins FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM cases 
            WHERE cases.id = check_ins.case_id 
              AND (cases.victim_id = auth.uid() OR get_user_role() IN ('counsellor', 'district_officer'))
        )
    );

CREATE POLICY "Role-based checkin read access"
    ON check_ins FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM cases 
            WHERE cases.id = check_ins.case_id 
              AND (
                (get_user_role() = 'victim' AND cases.victim_id = auth.uid()) OR
                (get_user_role() = 'counsellor' AND cases.assigned_counsellor_id = auth.uid()) OR
                (get_user_role() = 'district_officer' AND cases.district_id = get_user_district()) OR
                (get_user_role() = 'state_admin' AND cases.state_id = get_user_state()) OR
                (get_user_role() = 'national_admin')
              )
        )
    );

-- ALERTS & INTERVENTIONS POLICIES
CREATE POLICY "Staff can view alerts"
    ON alerts FOR SELECT
    USING (get_user_role() IN ('counsellor', 'district_officer', 'state_admin', 'national_admin'));

CREATE POLICY "Staff can manage interventions"
    ON interventions FOR ALL
    USING (get_user_role() IN ('counsellor', 'district_officer', 'state_admin', 'national_admin'));

-- NOTIFICATIONS & CONSENTS POLICIES
CREATE POLICY "Users access own notifications"
    ON notifications FOR ALL
    USING (user_id = auth.uid()::text);

CREATE POLICY "Users access own consent"
    ON consents FOR ALL
    USING (user_id = auth.uid()::text);

-- AUDIT LOGS
CREATE POLICY "Staff can view audit logs"
    ON audit_logs FOR SELECT
    USING (get_user_role() IN ('district_officer', 'state_admin', 'national_admin'));

CREATE POLICY "Any authenticated user can insert audit log"
    ON audit_logs FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);
