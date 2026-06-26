import express from 'express';
import {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  deleteFeedback,
} from '../controllers/feedbackController.js';
import { feedbackValidationRules, validate } from '../validators/feedbackValidator.js';
import { feedbackSubmitLimiter, apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Public feedback submission endpoint (rate limited + validated)
router.post('/', feedbackSubmitLimiter, feedbackValidationRules, validate, createFeedback);

// Admin queries and modifications (rate limited)
router.get('/', apiLimiter, getAllFeedback);
router.get('/:id', apiLimiter, getFeedbackById);
router.delete('/:id', apiLimiter, deleteFeedback);

export default router;
