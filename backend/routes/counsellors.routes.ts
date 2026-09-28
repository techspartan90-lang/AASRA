/**
 * Express Route Module: /counsellors
 * 
 * Clinical support workbench API:
 * 1. Priority Worklist (anonymized IDs, latest distress indicator, baseline delta, trend)
 * 2. Today's Follow-up Schedule
 * 3. Clinical Support Interaction Logging
 */

import { Router, Response } from 'express';
import { 
  authenticateToken, 
  requireRole, 
  validateBody, 
  SecureRequest 
} from '../middleware/security';

const router = Router();

// Only counsellors, district officers, and admins can access counsellor APIs
router.use(authenticateToken);
router.use(requireRole(['counsellor', 'district_officer', 'state_admin', 'national_admin']));

/**
 * GET /api/v1/counsellors/worklist
 * Retrieves clinical priority worklist without exposing unnecessary PII
 */
router.get('/worklist', (req: SecureRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    data: {
      counsellorName: req.user?.name || 'Dr. Priya Nair',
      district: req.user?.district || 'Kamrup Metropolitan',
      cases: [
        {
          anonymizedId: 'S-Kamrup-002',
          caseId: 'ATC-2026-00124',
          currentScore: 47,
          baselineScore: 28,
          change: '+19',
          trend: 'rising',
          riskLevel: 'Medium',
          lastCheckin: '2026-09-28T09:30:00.000Z',
          followupStatus: 'DUE_TODAY',
          urgency: 'HIGH',
        },
        {
          anonymizedId: 'S-Kamrup-014',
          caseId: 'ATC-2026-00088',
          currentScore: 31,
          baselineScore: 30,
          change: '+1',
          trend: 'stable',
          riskLevel: 'Low',
          lastCheckin: '2026-09-27T16:20:00.000Z',
          followupStatus: 'ROUTINE',
          urgency: 'LOW',
        },
      ],
    },
  });
});

/**
 * GET /api/v1/counsellors/followups
 * Retrieves today's scheduled follow-ups
 */
router.get('/followups', (req: SecureRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    data: {
      today: '2026-09-28',
      scheduledCount: 3,
      items: [
        {
          id: 'flw-001',
          time: '14:30 IST',
          survivorPseudonym: 'Survivor S-Kamrup-002',
          channel: 'telephonic',
          focus: 'Pre-trial anxiety debrief & grounding exercises',
          status: 'pending',
        },
        {
          id: 'flw-002',
          time: '16:00 IST',
          survivorPseudonym: 'Survivor S-Kamrup-014',
          channel: 'in-person',
          focus: 'Monthly compensation grant verification',
          status: 'completed',
        },
      ],
    },
  });
});

/**
 * POST /api/v1/counsellors/interactions
 * Records a clinical support interaction note
 */
router.post(
  '/interactions',
  validateBody(['survivorId', 'interactionType', 'clinicalNotes']),
  (req: SecureRequest, res: Response) => {
    const { survivorId, interactionType, clinicalNotes, nextFollowupDate } = req.body;

    return res.status(201).json({
      success: true,
      message: 'Clinical interaction note securely recorded.',
      data: {
        interactionId: `int_${Date.now()}`,
        counsellorId: req.user?.id,
        survivorId,
        interactionType,
        recordedAt: new Date().toISOString(),
        nextFollowupDate: nextFollowupDate || '2026-10-02',
        isConfidential: true,
      },
    });
  }
);

export default router;
