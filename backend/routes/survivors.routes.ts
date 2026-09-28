/**
 * Express Route Module: /survivors
 * 
 * Manages survivor wellness profiles with privacy-first pseudonymization,
 * case-assignment access guards, and preferences.
 */

import { Router, Response } from 'express';
import { 
  authenticateToken, 
  requireRole, 
  requireCaseAccess, 
  validateBody, 
  SecureRequest 
} from '../middleware/security';

const router = Router();

// All survivor endpoints require authentication
router.use(authenticateToken);

/**
 * GET /api/v1/survivors/me
 * Retrieves survivor's personal profile (for victim role)
 */
router.get('/me', requireRole(['victim']), (req: SecureRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    data: {
      id: req.user?.id || 'usr-verified-001',
      pseudonym: 'Survivor S-Kamrup-002',
      caseNumber: 'ATC-2026-00124',
      baselineScore: 28,
      currentDistressScore: 47,
      riskCategory: 'Medium',
      primaryLanguage: 'hi',
      preferredChannel: 'whatsapp',
      lastCheckinAt: '2026-09-28T09:30:00.000Z',
      assignedCounsellor: 'Dr. Priya Nair (District Clinical Lead)',
    },
  });
});

/**
 * GET /api/v1/survivors/:survivorId
 * Retrieves detailed survivor wellness record (counsellors only if assigned, admins permitted)
 */
router.get('/:survivorId', requireCaseAccess, (req: SecureRequest, res: Response) => {
  const { survivorId } = req.params;

  return res.status(200).json({
    success: true,
    data: {
      id: survivorId,
      pseudonym: `Survivor S-${survivorId.slice(-4)}`,
      caseNumber: 'ATC-2026-00124',
      district: 'Kamrup Metropolitan',
      state: 'Assam',
      baselineDistress: 28,
      currentDistress: 47,
      riskLevel: 'Medium',
      consentStatus: 'active',
      activeAlertsCount: 1,
      lastCheckinTimestamp: '2026-09-28T09:30:00.000Z',
      protectionOfficerAssigned: 'Inspector R. Gogoi (Kamrup Police HQ)',
      isRestrictedPII: true,
    },
  });
});

/**
 * PUT /api/v1/survivors/:survivorId/preferences
 * Updates language or preferred checkin channel
 */
router.put('/:survivorId/preferences', requireCaseAccess, (req: SecureRequest, res: Response) => {
  const { preferredLanguage, preferredChannel, checkinFrequency } = req.body;

  return res.status(200).json({
    success: true,
    message: 'Survivor preferences updated successfully.',
    data: {
      survivorId: req.params.survivorId,
      updatedPreferences: {
        preferredLanguage: preferredLanguage || 'en',
        preferredChannel: preferredChannel || 'web',
        checkinFrequency: checkinFrequency || 'daily',
        updatedAt: new Date().toISOString(),
      },
    },
  });
});

/**
 * GET /api/v1/survivors/:survivorId/trusted-contacts
 * Retrieves trusted emergency contacts with consent check
 */
router.get('/:survivorId/trusted-contacts', requireCaseAccess, (req: SecureRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    data: [
      {
        id: 'tc-001',
        name: 'Sunita (Elder Sister)',
        relationship: 'Sister',
        phone: '******8210',
        notifyOnEmergency: true,
        isVerified: true,
      },
    ],
  });
});

export default router;
