/**
 * Express Route Module: /cases
 * 
 * Tracks judicial milestones, investigation events, court trial dates,
 * and reported threats under SC/ST Prevention of Atrocities Act Section 15A.
 */

import { Router, Response } from 'express';
import { 
  authenticateToken, 
  requireCaseAccess, 
  validateBody, 
  SecureRequest 
} from '../middleware/security';

const router = Router();

router.use(authenticateToken);

/**
 * GET /api/v1/cases/:caseId
 * Retrieves judicial and welfare case summary
 */
router.get('/:caseId', requireCaseAccess, (req: SecureRequest, res: Response) => {
  const { caseId } = req.params;

  return res.status(200).json({
    success: true,
    data: {
      caseId,
      firNumber: 'FIR/2026/KMR/0412',
      policeStation: 'Paltan Bazar PS, Guwahati',
      sectionsApplied: ['SC/ST (PoA) Act Sec 3(1)(r)', 'Sec 3(1)(s)', 'Sec 15A (Witness Protection)'],
      specialCourt: 'Special Court (PoA), Kamrup Metro',
      judge: 'District & Sessions Judge',
      specialPublicProsecutor: 'Adv. M. Sharma',
      currentStage: 'Prosecution Evidence (Testimony)',
      nextHearingDate: '2026-10-04T10:30:00.000Z',
      witnessProtectionActive: true,
      milestonesCount: 5,
    },
  });
});

/**
 * GET /api/v1/cases/:caseId/milestones
 * Retrieves chronologically ordered milestones
 */
router.get('/:caseId/milestones', requireCaseAccess, (req: SecureRequest, res: Response) => {
  const { caseId } = req.params;

  return res.status(200).json({
    success: true,
    data: [
      {
        id: 'ms-001',
        type: 'FIR_REGISTERED',
        title: 'FIR Lodged under Section 3(1) SC/ST PoA Act',
        date: '2026-06-15',
        completed: true,
      },
      {
        id: 'ms-002',
        type: 'INVESTIGATION_CHARGESHEET',
        title: 'DSP submitted chargesheet within 60 days',
        date: '2026-08-10',
        completed: true,
      },
      {
        id: 'ms-003',
        type: 'RELIEF_DISBURSED',
        title: 'First tranche of statutory compensation credited',
        date: '2026-08-18',
        completed: true,
      },
      {
        id: 'ms-004',
        type: 'TRIAL_HEARING',
        title: 'Survivor Deposition & Cross-Examination',
        date: '2026-10-04',
        completed: false,
        isHighStressMilestone: true,
      },
    ],
  });
});

/**
 * POST /api/v1/cases/:caseId/milestones
 * Records an investigation event or threat incident
 */
router.post(
  '/:caseId/milestones',
  requireCaseAccess,
  validateBody(['title', 'type', 'eventDate']),
  (req: SecureRequest, res: Response) => {
    const { caseId } = req.params;
    const { title, type, eventDate, notes } = req.body;

    return res.status(201).json({
      success: true,
      message: 'Case milestone recorded successfully.',
      data: {
        id: `ms_${Date.now()}`,
        caseId,
        title,
        type,
        eventDate,
        notes,
        recordedBy: req.user?.id,
        createdAt: new Date().toISOString(),
      },
    });
  }
);

export default router;
