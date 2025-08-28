const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs: windowMs || 15 * 60 * 1000, // 15 minutes default
    max: max || 100, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      message: message || 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// General API rate limiter
const apiLimiter = createRateLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  'Too many API requests, please try again later.'
);

// Stricter rate limiter for auth routes
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 requests per 15 minutes
  'Too many authentication attempts, please try again later.'
);

// Rate limiter for journal entries
const journalLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  10, // 10 requests per minute
  'Too many journal operations, please slow down.'
);

module.exports = {
  apiLimiter,
  authLimiter,
  journalLimiter
};
