/**
 * PHASE 14: PRODUCTION BACKEND SECURITY SERVER
 * 
 * Express Application Architecture:
 * - Versioned API Endpoints (/api/v1/...)
 * - Strict HTTP Security Headers (HSTS, CSP, X-Frame-Options)
 * - Request Correlation Tracking & Structured Audit Logging
 * - Sliding Window Rate Limiting (DDoS & Brute Force defense)
 * - Deep Recursive Input Sanitization (XSS, script injection)
 * - Fine-grained Role Authorization (RBAC) & Caseworker Assignment Isolation
 * - Centralized Safe Error Handling (No stack leaks)
 * 
 * Modules:
 * /auth, /survivors, /checkins, /consent, /analysis, /predictions,
 * /alerts, /counsellors, /cases, /notifications, /audit, /admin
 */

import express, { Request, Response, NextFunction } from 'express';
import { 
  secureHeaders, 
  requestCorrelation, 
  standardRateLimiter, 
  inputSanitizer, 
  centralizedErrorHandler 
} from './middleware/security';

// Import all 12 Route Modules
import authRoutes from './routes/auth.routes';
import survivorsRoutes from './routes/survivors.routes';
import checkinsRoutes from './routes/checkins.routes';
import consentRoutes from './routes/consent.routes';
import analysisRoutes from './routes/analysis.routes';
import predictionsRoutes from './routes/predictions.routes';
import alertsRoutes from './routes/alerts.routes';
import counsellorsRoutes from './routes/counsellors.routes';
import casesRoutes from './routes/cases.routes';
import notificationsRoutes from './routes/notifications.routes';
import auditRoutes from './routes/audit.routes';
import adminRoutes from './routes/admin.routes';

export function createExpressApp() {
  const app = express();

  // 1. Parsing & Payload Size Limits
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // 2. Security Headers & Request Correlation
  app.use(secureHeaders);
  app.use(requestCorrelation);

  // 3. Sliding Window Rate Limiter & Input Sanitizer
  app.use(standardRateLimiter);
  app.use(inputSanitizer);

  // 4. API Root Health Check
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'UP',
      service: 'AASRA Backend Core API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // 5. Mount API Version 1 Routers
  const API_PREFIX = '/api/v1';

  app.use(`${API_PREFIX}/auth`, authRoutes);
  app.use(`${API_PREFIX}/survivors`, survivorsRoutes);
  app.use(`${API_PREFIX}/checkins`, checkinsRoutes);
  app.use(`${API_PREFIX}/consent`, consentRoutes);
  app.use(`${API_PREFIX}/analysis`, analysisRoutes);
  app.use(`${API_PREFIX}/predictions`, predictionsRoutes);
  app.use(`${API_PREFIX}/alerts`, alertsRoutes);
  app.use(`${API_PREFIX}/counsellors`, counsellorsRoutes);
  app.use(`${API_PREFIX}/cases`, casesRoutes);
  app.use(`${API_PREFIX}/notifications`, notificationsRoutes);
  app.use(`${API_PREFIX}/audit`, auditRoutes);
  app.use(`${API_PREFIX}/admin`, adminRoutes);

  // 6. 404 Handler for Unrecognized Endpoints
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `The requested endpoint '${req.method} ${req.originalUrl}' does not exist on this server.`,
      code: 'RESOURCE_NOT_FOUND',
    });
  });

  // 7. Centralized Safe Error Handling Middleware
  app.use(centralizedErrorHandler);

  return app;
}

export const app = createExpressApp();

export default app;
