/**
 * Security Rate Limiter
 * Implements token-bucket and sliding-window rate limiting for sensitive API endpoints.
 * Protects against brute-force attacks, AI request flooding, and denial-of-service.
 */

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
  limit: number;
}

// Default route-specific configurations
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // Expensive AI operations: 15 calls per minute
  ai_analysis: { maxRequests: 15, windowMs: 60 * 1000 },
  // Check-in submissions: 20 per minute per client
  checkin_submission: { maxRequests: 20, windowMs: 60 * 1000 },
  // Authentication / login attempts: 5 per minute per IP
  auth_attempts: { maxRequests: 5, windowMs: 60 * 1000 },
  // Report generation / PDF export: 10 per minute
  report_export: { maxRequests: 10, windowMs: 60 * 1000 },
  // General API calls: 120 per minute
  general_api: { maxRequests: 120, windowMs: 60 * 1000 },
};

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory bucket store (per Node process instance)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up stale entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime <= now) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Checks if a given identifier exceeds rate limit for a category
 */
export function checkRateLimit(
  identifier: string,
  category: keyof typeof RATE_LIMIT_CONFIGS = 'general_api'
): RateLimitResult {
  const config = RATE_LIMIT_CONFIGS[category] || RATE_LIMIT_CONFIGS.general_api;
  const key = `${category}:${identifier}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime <= now) {
    // New or expired window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetMs: config.windowMs,
      limit: config.maxRequests,
    };
  }

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetMs: Math.max(0, entry.resetTime - now),
      limit: config.maxRequests,
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetMs: Math.max(0, entry.resetTime - now),
    limit: config.maxRequests,
  };
}

/**
 * Helper to extract client identifier safely from Request headers
 */
export function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return 'anonymous-client';
}
