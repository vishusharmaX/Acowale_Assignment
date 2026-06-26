import { body, validationResult } from 'express-validator';
import { sendError } from '../utils/responseFormatter.js';

export const feedbackValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn([
      'Bug Report',
      'Feature Request',
      'Complaint',
      'Suggestion',
      'Appreciation',
      'General Feedback',
    ])
    .withMessage('Invalid feedback category'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10 }).withMessage('Message must be at least 10 characters long')
    .isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters'),
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = errors.array().map((err) => ({
    field: err.path || err.param,
    message: err.msg,
  }));

  return sendError(res, 'Validation failed', 400, extractedErrors);
};
