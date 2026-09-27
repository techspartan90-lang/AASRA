/**
 * Human Override Management for AI Distress Screening
 * Guarantees human clinical authority over automated algorithmic indicators.
 */

export interface HumanOverrideRecord {
  id: string;
  caseId: string;
  assessmentId: string;
  originalLevel: string;
  originalScore: number;
  originalTrajectory: string;
  overriddenLevel: 'Stable' | 'Mild concern' | 'Elevated concern' | 'High concern';
  overriddenScore?: number;
  overriddenTrajectory?: string;
  overrideReason: string;
  reviewerId: string;
  reviewerName: string;
  timestamp: string;
}

export const INITIAL_HUMAN_OVERRIDES: HumanOverrideRecord[] = [
  {
    id: 'OVR-2026-001',
    caseId: 'CASE-003',
    assessmentId: 'ast-003-prior',
    originalLevel: 'High concern',
    originalScore: 78,
    originalTrajectory: 'Increasing',
    overriddenLevel: 'Elevated concern',
    overriddenScore: 62,
    overriddenTrajectory: 'Fluctuating',
    overrideReason: 'Complainant reported temporary distress spiked by acute family bereavements rather than judicial proceedings or witness intimidation. Verified via telephonic counselling.',
    reviewerId: 'usr-counsellor-002',
    reviewerName: 'Dr. Priya Nair',
    timestamp: '2026-01-20T11:45:00Z',
  },
];
