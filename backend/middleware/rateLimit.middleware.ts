/**
 * Rate Limiter Middleware — Prevent Abuse
 *
 * Requirement 1.7: "Prevent the same IP from submitting more than 5 times per hour"
 *
 * We use express-rate-limit for this.
 * It tracks how many requests each IP address has made within a time window.
 * If they exceed the limit, subsequent requests get a 429 Too Many Requests response.
 *
 * We have two rate limiters:
 * 1. feedbackSubmitLimiter — strict: 5 submissions per hour per IP (public facing)
 * 2. apiLimiter — relaxed: 100 requests per 15 minutes (general API protection)
 *
 * This is important for a real product — without rate limiting, anyone can
 * flood your database with spam submissions or brute-force your login endpoint.
 */

import rateLimit from 'express-rate-limit';

/**
 * feedbackSubmitLimiter
 *
 * Applied only to POST /api/feedback (feedback submission endpoint).
 * Prevents the same IP from spamming feedback submissions.
 * Limit: 5 submissions per hour.
 */
export const feedbackSubmitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds

  max: 5, // Maximum 5 submissions per hour per IP

  // Message sent when the limit is reached
  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'You have submitted too much feedback. Please wait before submitting again (limit: 5 per hour).',
  },

  // Use standard HTTP headers so clients know their rate limit status
  // X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
  standardHeaders: true,

  // Disable the older X-RateLimit headers
  legacyHeaders: false,

  // Skip rate limiting for requests from localhost during development
  skip: (req) => {
    return process.env.NODE_ENV === 'test'; // Don't limit during tests
  },
});

/**
 * loginLimiter
 *
 * Applied to POST /api/auth/login.
 * Prevents brute-force attacks on the admin login page.
 * Limit: 10 attempts per 15 minutes per IP.
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 10, // 10 login attempts per 15 minutes

  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'Too many login attempts. Please wait 15 minutes before trying again.',
  },

  standardHeaders: true,
  legacyHeaders: false,

  skip: () => process.env.NODE_ENV === 'test',
});

/**
 * apiLimiter
 *
 * General rate limiter for all API endpoints.
 * This is a safety net to prevent DDoS attacks.
 * Limit: 100 requests per 15 minutes per IP.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 100,

  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'Too many requests. Please slow down.',
  },

  standardHeaders: true,
  legacyHeaders: false,

  skip: () => process.env.NODE_ENV === 'test',
});
