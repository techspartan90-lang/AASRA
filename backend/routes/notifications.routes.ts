/**
 * Express Route Module: /notifications
 * 
 * Manages user in-app and push notifications for check-in reminders,
 * counsellor follow-up alerts, and system notices.
 */

import { Router, Response } from 'express';
import { 
  authenticateToken, 
  validateBody, 
  SecureRequest 
} from '../middleware/security';

const router = Router();

router.use(authenticateToken);

/**
 * GET /api/v1/notifications
 * Retrieves active notifications for current actor
 */
router.get('/', (req: SecureRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    unreadCount: 2,
    notifications: [
      {
        id: 'notif-001',
        type: 'CHECKIN_REMINDER',
        title: 'Daily Wellness Check-In',
        message: 'A gentle reminder to share how you are feeling today. Takes less than 2 minutes.',
        isRead: false,
        createdAt: '2026-09-28T08:00:00.000Z',
      },
      {
        id: 'notif-002',
        type: 'HEARING_ALERT',
        title: 'Court Hearing Approaching',
        message: 'Your deposition hearing is scheduled in 6 days. Your legal support officer has reviewed your security arrangements.',
        isRead: false,
        createdAt: '2026-09-27T12:00:00.000Z',
      },
    ],
  });
});

/**
 * POST /api/v1/notifications/:id/read
 * Marks a notification as read
 */
router.post('/:id/read', (req: SecureRequest, res: Response) => {
  const { id } = req.params;

  return res.status(200).json({
    success: true,
    message: `Notification ${id} marked as read.`,
    data: {
      id,
      isRead: true,
      readAt: new Date().toISOString(),
    },
  });
});

/**
 * POST /api/v1/notifications/send
 * Dispatches a notification to a survivor or counsellor
 */
router.post(
  '/send',
  validateBody(['recipientId', 'title', 'message', 'type']),
  (req: SecureRequest, res: Response) => {
    const { recipientId, title, message, type } = req.body;

    return res.status(201).json({
      success: true,
      message: 'Notification queued for secure delivery.',
      data: {
        id: `notif_${Date.now()}`,
        recipientId,
        title,
        message,
        type,
        sentBy: req.user?.id,
        sentAt: new Date().toISOString(),
      },
    });
  }
);

export default router;
