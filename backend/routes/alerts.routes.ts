/**
 * Express Route Module: /alerts
 * 
 * Manages calm, non-alarmist real-time clinical alerts with human review workflow:
 * Signal detected → Alert generated → Human review → Action → Resolution.
 */

import { Router, Response } from 'express';
import { 
  authenticateToken, 
  requireRole, 
  validateBody, 
  SecureRequest 
} from '../middleware/security';

const router = Router();

router.use(authenticateToken);

/**
 * GET /api/v1/alerts
 * Lists alerts matching counsellor caseload or admin scope
 */
router.get('/', (req: SecureRequest, res: Response) => {
  const { severity, status } = req.query;

  const mockAlerts = [
    {
      id: 'ALT-2026-089',
      survivorPseudonym: 'Survivor S-Kamrup-002',
      survivorId: 'CASE-002',
      severity: 'Urgent review',
      trigger: 'Distress score surged +19 pts over 72 hours alongside impending court hearing',
      supportingSignals: ['Sleep disturbance', 'Speech pause anomaly (38%)', 'Trial date in 6 days'],
      recommendedAction: 'Schedule priority counselling check-in before hearing',
      assignedCounsellor: 'Dr. Priya Nair',
      status: 'pending_review',
      createdAt: '2026-09-28T07:15:00.000Z',
    },
    {
      id: 'ALT-2026-084',
      survivorPseudonym: 'Survivor S-Dhubri-007',
      survivorId: 'CASE-007',
      severity: 'Attention required',
      trigger: '2 consecutive scheduled check-ins uncompleted',
      supportingSignals: ['Missed daily checkin on Sept 26 and Sept 27'],
      recommendedAction: 'Attempt gentle IVR or SMS outreach',
      assignedCounsellor: 'Dr. Priya Nair',
      status: 'acknowledged',
      createdAt: '2026-09-27T18:00:00.000Z',
    },
  ];

  return res.status(200).json({
    success: true,
    totalCount: mockAlerts.length,
    alerts: mockAlerts,
  });
});

/**
 * GET /api/v1/alerts/:alertId
 * Retrieves detailed alert profile
 */
router.get('/:alertId', (req: SecureRequest, res: Response) => {
  const { alertId } = req.params;

  return res.status(200).json({
    success: true,
    data: {
      id: alertId,
      survivorId: 'CASE-002',
      survivorPseudonym: 'Survivor S-Kamrup-002',
      severity: 'Urgent review',
      trigger: 'Distress score surged +19 pts over 72 hours alongside impending court hearing',
      supportingSignals: [
        'Acoustic pause duration exceeds baseline by 45%',
        'Explicit mention of anxiety regarding accused intimidation',
      ],
      recommendedAction: 'Coordinate with District Victim Protection Cell for safe court transit & immediate tele-counselling',
      assignedCounsellor: 'Dr. Priya Nair',
      status: 'pending_review',
      auditHistory: [
        { action: 'GENERATED_BY_SYSTEM', actor: 'AI Engine v2.1', timestamp: '2026-09-28T07:15:00.000Z' },
      ],
    },
  });
});

/**
 * POST /api/v1/alerts/:alertId/acknowledge
 * Counsellor acknowledges receipt of the alert
 */
router.post('/:alertId/acknowledge', (req: SecureRequest, res: Response) => {
  const { alertId } = req.params;

  return res.status(200).json({
    success: true,
    message: `Alert ${alertId} acknowledged. Assigned for human clinical review.`,
    data: {
      alertId,
      status: 'acknowledged',
      acknowledgedBy: req.user?.name || 'Authorized Counsellor',
      acknowledgedAt: new Date().toISOString(),
    },
  });
});

/**
 * POST /api/v1/alerts/:alertId/assign
 * Reassigns alert to a specific clinician
 */
router.post(
  '/:alertId/assign',
  validateBody(['counsellorId']),
  (req: SecureRequest, res: Response) => {
    const { alertId } = req.params;
    const { counsellorId, counsellorName } = req.body;

    return res.status(200).json({
      success: true,
      message: `Alert reassigned to ${counsellorName || counsellorId}`,
      data: {
        alertId,
        assignedTo: counsellorId,
        assignedAt: new Date().toISOString(),
      },
    });
  }
);

/**
 * POST /api/v1/alerts/:alertId/escalate
 * Escalates alert to district or state protection officer
 */
router.post(
  '/:alertId/escalate',
  validateBody(['reason', 'targetTier']),
  (req: SecureRequest, res: Response) => {
    const { alertId } = req.params;
    const { reason, targetTier } = req.body;

    return res.status(200).json({
      success: true,
      message: `Alert ${alertId} escalated to ${targetTier}.`,
      data: {
        alertId,
        status: 'escalated',
        escalatedTo: targetTier,
        reason,
        escalatedAt: new Date().toISOString(),
      },
    });
  }
);

/**
 * POST /api/v1/alerts/:alertId/resolve
 * Resolves alert with clinical notes and outcome summary
 */
router.post(
  '/:alertId/resolve',
  validateBody(['resolutionNote', 'interventionType']),
  (req: SecureRequest, res: Response) => {
    const { alertId } = req.params;
    const { resolutionNote, interventionType } = req.body;

    return res.status(200).json({
      success: true,
      message: `Alert ${alertId} successfully marked as resolved.`,
      data: {
        alertId,
        status: 'resolved',
        resolvedBy: req.user?.name || 'Dr. Priya Nair',
        interventionType,
        resolutionNote,
        resolvedAt: new Date().toISOString(),
      },
    });
  }
);

export default router;
