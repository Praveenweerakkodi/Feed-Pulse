
import rateLimit from 'express-rate-limit';


export const feedbackSubmitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,

  max: 5, 

  // Message sent when the limit is reached
  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'You have submitted too much feedback. Please wait before submitting again (limit: 5 per hour).',
  },

  standardHeaders: true,

  legacyHeaders: false,

  skip: (req) => {
    return process.env.NODE_ENV === 'test'; // Don't limit during tests
  },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 10,

  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'Too many login attempts. Please wait 15 minutes before trying again.',
  },

  standardHeaders: true,
  legacyHeaders: false,

  skip: () => process.env.NODE_ENV === 'test',
});

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
