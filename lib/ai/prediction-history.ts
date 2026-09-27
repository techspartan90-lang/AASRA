import { TrajectoryDirection, UncertaintyLevel } from './ml-models';

export interface PredictionHistoryRecord {
  id: string;
  caseId: string;
  date: string;
  currentIndicator: number;
  projectedLevel: 'Stable' | 'Mild concern' | 'Elevated concern' | 'High concern';
  predictedTrajectory: TrajectoryDirection;
  confidence: number;
  uncertainty: UncertaintyLevel;
  modelVersion: string;
  featureVersion: string;
  actualLaterIndicator?: number;
  actualLaterDate?: string;
  alignmentStatus: 'directionally_aligned' | 'divergent' | 'pending_later_checkin';
  alignmentNotes?: string;
  humanOverrideApplied?: boolean;
}

export const INITIAL_PREDICTION_HISTORY: PredictionHistoryRecord[] = [
  // CASE-002 Demonstration History (Section 37)
  {
    id: 'PRED-002-W1',
    caseId: 'CASE-002',
    date: '2026-01-14',
    currentIndicator: 38,
    projectedLevel: 'Stable',
    predictedTrajectory: 'Stable',
    confidence: 0.84,
    uncertainty: 'Low',
    modelVersion: 'logistic-v1.2-prototype',
    featureVersion: 'features-v1',
    actualLaterIndicator: 46,
    actualLaterDate: '2026-01-21',
    alignmentStatus: 'directionally_aligned',
    alignmentNotes: 'Baseline quiet-period check-in. Mild upward movement in next cycle.',
  },
  {
    id: 'PRED-002-W2',
    caseId: 'CASE-002',
    date: '2026-01-21',
    currentIndicator: 46,
    projectedLevel: 'Elevated concern',
    predictedTrajectory: 'Increasing',
    confidence: 0.69,
    uncertainty: 'Moderate',
    modelVersion: 'logistic-v1.2-prototype',
    featureVersion: 'features-v1',
    actualLaterIndicator: 57,
    actualLaterDate: '2026-01-28',
    alignmentStatus: 'directionally_aligned',
    alignmentNotes: 'Model projected increasing trajectory (+8 pts actual observed).',
  },
  {
    id: 'PRED-002-W3',
    caseId: 'CASE-002',
    date: '2026-01-28',
    currentIndicator: 57,
    projectedLevel: 'Elevated concern',
    predictedTrajectory: 'Increasing',
    confidence: 0.74,
    uncertainty: 'Moderate',
    modelVersion: 'logistic-v1.2-prototype',
    featureVersion: 'features-v1',
    actualLaterIndicator: 71,
    actualLaterDate: '2026-02-04',
    alignmentStatus: 'directionally_aligned',
    alignmentNotes: 'Model correctly flagged persistent upward escalation before acute peak.',
  },
  {
    id: 'PRED-002-W4',
    caseId: 'CASE-002',
    date: '2026-02-04',
    currentIndicator: 71,
    projectedLevel: 'High concern',
    predictedTrajectory: 'Increasing',
    confidence: 0.78,
    uncertainty: 'Moderate',
    modelVersion: 'logistic-v1.2-prototype',
    featureVersion: 'features-v1',
    actualLaterIndicator: 59,
    actualLaterDate: '2026-02-12',
    alignmentStatus: 'directionally_aligned',
    alignmentNotes: 'Caseworker initiated trauma grounding intervention, stabilizing subsequent score to 59.',
  },

  // CASE-001 (Stable routine case)
  {
    id: 'PRED-001-W1',
    caseId: 'CASE-001',
    date: '2026-01-20',
    currentIndicator: 22,
    projectedLevel: 'Stable',
    predictedTrajectory: 'Stable',
    confidence: 0.89,
    uncertainty: 'Low',
    modelVersion: 'logistic-v1.2-prototype',
    featureVersion: 'features-v1',
    actualLaterIndicator: 24,
    actualLaterDate: '2026-02-03',
    alignmentStatus: 'directionally_aligned',
    alignmentNotes: 'Consistent stable trajectory within normal parameters.',
  },

  // CASE-003 (Fluctuating case)
  {
    id: 'PRED-003-W1',
    caseId: 'CASE-003',
    date: '2026-01-18',
    currentIndicator: 62,
    projectedLevel: 'Elevated concern',
    predictedTrajectory: 'Fluctuating',
    confidence: 0.65,
    uncertainty: 'Moderate',
    modelVersion: 'logistic-v1.2-prototype',
    featureVersion: 'features-v1',
    actualLaterIndicator: 54,
    actualLaterDate: '2026-01-27',
    alignmentStatus: 'directionally_aligned',
    alignmentNotes: 'High volatility score correctly anticipated score oscillations.',
  },

  // Active Pending Prediction
  {
    id: 'PRED-002-CURRENT',
    caseId: 'CASE-002',
    date: '2026-02-19',
    currentIndicator: 44,
    projectedLevel: 'Stable',
    predictedTrajectory: 'Improving',
    confidence: 0.73,
    uncertainty: 'Moderate',
    modelVersion: 'logistic-v1.2-prototype',
    featureVersion: 'features-v1',
    alignmentStatus: 'pending_later_checkin',
    alignmentNotes: 'Awaiting next weekly check-in event to confirm trajectory stabilization.',
  },
];

/**
 * Compares a previous prediction with a newly arrived observation to evaluate directional alignment
 */
export function evaluatePredictionAlignment(
  prediction: PredictionHistoryRecord,
  newScore: number
): { status: PredictionHistoryRecord['alignmentStatus']; note: string } {
  const delta = newScore - prediction.currentIndicator;

  if (prediction.predictedTrajectory === 'Increasing' || prediction.predictedTrajectory === 'Rapidly increasing') {
    if (delta > 3) {
      return {
        status: 'directionally_aligned',
        note: `Observed score increased (+${delta} pts), aligning with predicted upward trajectory.`,
      };
    } else {
      return {
        status: 'divergent',
        note: `Observed score decreased or held flat (${delta >= 0 ? '+' : ''}${delta} pts) contrary to projected increase (likely influenced by supportive caseworker intervention).`,
      };
    }
  } else if (prediction.predictedTrajectory === 'Improving') {
    if (delta < -3) {
      return {
        status: 'directionally_aligned',
        note: `Observed score decreased (${delta} pts), confirming positive improvement trajectory.`,
      };
    } else {
      return {
        status: 'divergent',
        note: `Observed score increased (+${delta} pts) contrary to projected improvement.`,
      };
    }
  } else {
    // Stable
    if (Math.abs(delta) <= 8) {
      return {
        status: 'directionally_aligned',
        note: `Observed score remained stable (${delta >= 0 ? '+' : ''}${delta} pts delta).`,
      };
    } else {
      return {
        status: 'divergent',
        note: `Unexpected score shift (${delta >= 0 ? '+' : ''}${delta} pts) from projected stable baseline.`,
      };
    }
  }
}
