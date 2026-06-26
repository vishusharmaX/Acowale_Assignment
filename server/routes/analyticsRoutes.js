import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// GET /api/analytics - Admin dashboard analytics
router.get('/', apiLimiter, getAnalytics);

export default router;
