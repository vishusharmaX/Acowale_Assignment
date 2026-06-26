import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/responseFormatter.js';

// Strict rate limiting for submitting feedback to prevent spam
export const feedbackSubmitLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Limit each IP to 10 feedback submissions per 10 mins
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'Too many feedback submissions from this IP. Please try again after 10 minutes.',
      429
    );
  },
});

// General rate limiting for querying analytics or list endpoints
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'Too many requests from this IP. Please try again later.',
      429
    );
  },
});
