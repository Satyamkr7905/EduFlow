import rateLimit from 'express-rate-limit';

const jsonLimitHandler = (message) => (_req, res) => {
  res.status(429).json({ success: false, message });
};

/** Protects the login endpoint from credential stuffing. */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: jsonLimitHandler('Too many login attempts. Please try again in 15 minutes.'),
});

/** Protects the public inquiry form from spam. */
export const inquiryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 15,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: jsonLimitHandler('Too many inquiries submitted. Please try again later.'),
});

/** Generic limiter for the whole API. */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: jsonLimitHandler('Too many requests. Please slow down.'),
});
