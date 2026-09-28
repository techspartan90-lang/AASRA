/**
 * Express Route Module: /checkins
 * 
 * Handles multi-channel check-in submission (Web, WhatsApp, IVR, SMS),
 * response history retrieval, and question template delivery.
 */

import { Router, Response } from 'express';
import { 
  authenticateToken, 
  requireCaseAccess, 
  validateBody, 
  SecureRequest 
} from '../middleware/security';

const router = Router();

// All checkin endpoints require authentication
router.use(authenticateToken);

/**
 * POST /api/v1/checkins
 * Submits a new multi-channel check-in
 */
router.post(
  '/',
  validateBody(['channel', 'responses']),
  (req: SecureRequest, res: Response) => {
    const { channel, responses, survivorId, rawText, voiceFeatureData } = req.body;
    const effectiveSurvivorId = survivorId || req.user?.id || 'usr-verified-001';

    // Mock check-in record creation
    const checkinId = `chk_${Date.now()}`;
    const timestamp = new Date().toISOString();

    return res.status(201).json({
      success: true,
      message: 'Check-in response recorded successfully and queued for non-diagnostic distress evaluation.',
      data: {
        id: checkinId,
        survivorId: effectiveSurvivorId,
        channel,
        submittedAt: timestamp,
        responseCount: Array.isArray(responses) ? responses.length : Object.keys(responses).length,
        hasVoiceFeatures: Boolean(voiceFeatureData),
        hasTextSignals: Boolean(rawText),
        status: 'ANALYSIS_QUEUED',
      },
    });
  }
);

/**
 * GET /api/v1/checkins/history/:survivorId
 * Retrieves longitudinal checkin history for a survivor
 */
router.get('/history/:survivorId', requireCaseAccess, (req: SecureRequest, res: Response) => {
  const { survivorId } = req.params;

  return res.status(200).json({
    success: true,
    data: {
      survivorId,
      totalCompleted: 14,
      checkins: [
        {
          id: 'chk_101',
          date: '2026-09-28',
          channel: 'whatsapp',
          overallMood: 'anxious',
          distressScore: 47,
          riskCategory: 'Medium',
          flaggedReview: true,
        },
        {
          id: 'chk_100',
          date: '2026-09-25',
          channel: 'web',
          overallMood: 'stable',
          distressScore: 32,
          riskCategory: 'Low',
          flaggedReview: false,
        },
        {
          id: 'chk_099',
          date: '2026-09-21',
          channel: 'ivr',
          overallMood: 'hopeful',
          distressScore: 28,
          riskCategory: 'Low',
          flaggedReview: false,
        },
      ],
    },
  });
});

/**
 * GET /api/v1/checkins/:checkinId
 * Retrieves detailed itemized responses for a single checkin
 */
router.get('/:checkinId', (req: SecureRequest, res: Response) => {
  const { checkinId } = req.params;

  return res.status(200).json({
    success: true,
    data: {
      id: checkinId,
      survivorId: 'usr-verified-001',
      submittedAt: '2026-09-28T09:30:00.000Z',
      channel: 'whatsapp',
      responses: [
        { questionId: 'q_sleep', prompt: 'How was your sleep quality last night?', answer: 'Woke up multiple times with racing heart' },
        { questionId: 'q_safety', prompt: 'Do you currently feel safe in your physical surroundings?', answer: 'Somewhat unsafe due to court hearing' },
        { questionId: 'q_support', prompt: 'Would you like to connect with your designated counsellor today?', answer: 'Yes, please' },
      ],
      aiMetadata: {
        analysisCompleted: true,
        distressScore: 47,
        confidence: 0.88,
        disclaimer: 'Operational support indicator — not a clinical diagnosis.',
      },
    },
  });
});

export default router;
