import React from 'react';
import {
  Home,
  Activity,
  TrendingUp,
  Radio,
  ClipboardCheck,
  Users,
  ShieldCheck,
  Info,
  ShieldAlert,
  Flame,
  BarChart3,
  Brain,
  Globe2,
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: string;
  badgeType?: 'live' | 'new' | 'warning' | 'count';
  rolesAllowed?: string[];
  shortcut?: string;
}

export interface NavigationSection {
  id: string;
  title?: string;
  items: NavigationItem[];
}

/**
 * 8 Core Luxury Navigation Items required by Manas Suraksha:
 * 1. Home
 * 2. Distress Score
 * 3. Predictive Trajectory
 * 4. Multi-Channel Hub
 * 5. Check-In
 * 6. Support & Counsellor
 * 7. Privacy & Security
 * 8. About Platform
 */
export const CORE_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Home',
    icon: Home,
    description: 'Overview, daily check-in prompt, and care summary',
  },
  {
    id: 'distress_score',
    label: 'Distress Score',
    icon: Activity,
    description: 'Dynamic multidimensional distress indicators & telemetry',
    badge: 'Live',
    badgeType: 'live',
  },
  {
    id: 'predictive_risk',
    label: 'Predictive Trajectory',
    icon: TrendingUp,
    description: 'Calibrated 7/14/30-day forecast and trend projection',
  },
  {
    id: 'channels',
    label: 'Multi-Channel Hub',
    icon: Radio,
    description: 'Voice, IVR, SMS & WhatsApp multi-modal ingestion',
  },
  {
    id: 'checkin_wizard',
    label: 'Check-In',
    icon: ClipboardCheck,
    description: 'Trauma-informed 4-step biometric & psychological survey',
  },
  {
    id: 'support',
    label: 'Support & Counsellor',
    icon: Users,
    description: 'Caseworker support, emergency protocol & scheduled care',
  },
  {
    id: 'privacy',
    label: 'Privacy & Security',
    icon: ShieldCheck,
    description: 'DPDPA 2023 sovereignty, cryptographic logs & data controls',
  },
  {
    id: 'public',
    label: 'About Platform',
    icon: Info,
    description: 'National public framework, statutory protections & AI safety',
  },
];

/**
 * Staff / Caseworker / Administrator Workspace tools
 */
export const STAFF_WORKSPACES: NavigationItem[] = [
  {
    id: 'cases',
    label: 'Counsellor Workspace',
    icon: Users,
    description: 'Caseload ledger, survivor tabs, and intervention actions',
    rolesAllowed: ['counsellor', 'district_officer', 'state_admin', 'national_admin'],
  },
  {
    id: 'alerts',
    label: 'Alert Center',
    icon: ShieldAlert,
    description: 'Real-time distress surge alerts with human review gate',
    badgeType: 'warning',
    rolesAllowed: ['counsellor', 'district_officer', 'state_admin', 'national_admin'],
  },
  {
    id: 'prioritization',
    label: 'Prioritization Queue',
    icon: Flame,
    description: 'Urgency-weighted triage queue for caseworkers',
    rolesAllowed: ['counsellor', 'district_officer', 'state_admin', 'national_admin'],
  },
  {
    id: 'analytics',
    label: 'Administrative & Map',
    icon: BarChart3,
    description: 'District and state aggregated KPIs with zero-GPS privacy',
    rolesAllowed: ['district_officer', 'state_admin', 'national_admin'],
  },
  {
    id: 'ai_models',
    label: 'AI & ML Hub',
    icon: Brain,
    description: 'Model explainability, calibration metrics & fairness cards',
    rolesAllowed: ['state_admin', 'national_admin'],
  },
];
