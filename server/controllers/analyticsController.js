import Feedback from '../models/Feedback.js';
import { sendSuccess } from '../utils/responseFormatter.js';

// @desc    Get dashboard analytics
// @route   GET /api/analytics
// @access  Admin
export const getAnalytics = async (req, res, next) => {
  try {
    // 1. Total Feedback count
    const totalFeedback = await Feedback.countDocuments();

    // 2. Average Rating (rounded to 1 decimal place)
    const avgRatingResult = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
        },
      },
    ]);
    const averageRating = avgRatingResult.length > 0 ? parseFloat(avgRatingResult[0].avgRating.toFixed(1)) : 0;

    // 3. Time-based counts
    const now = new Date();
    
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOf7DaysAgo = new Date(now);
    startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 7);
    startOf7DaysAgo.setHours(0, 0, 0, 0);

    const startOf30DaysAgo = new Date(now);
    startOf30DaysAgo.setDate(startOf30DaysAgo.getDate() - 30);
    startOf30DaysAgo.setHours(0, 0, 0, 0);

    const todayFeedback = await Feedback.countDocuments({
      createdAt: { $gte: startOfToday },
    });

    const weeklyFeedback = await Feedback.countDocuments({
      createdAt: { $gte: startOf7DaysAgo },
    });

    const monthlyFeedback = await Feedback.countDocuments({
      createdAt: { $gte: startOf30DaysAgo },
    });

    // 4. Category breakdown aggregation
    const categoryDistributionResult = await Feedback.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // All categories supported in standard schema
    const categories = [
      'Bug Report',
      'Feature Request',
      'Complaint',
      'Suggestion',
      'Appreciation',
      'General Feedback',
    ];

    // Populate category values (even if they have 0 submissions)
    const categoryDistribution = categories.map((cat) => {
      const match = categoryDistributionResult.find((r) => r._id === cat);
      return {
        category: cat,
        count: match ? match.count : 0,
      };
    });

    // 5. Trend Aggregation for the past 7 days
    const trendAggResult = await Feedback.aggregate([
      {
        $match: {
          createdAt: { $gte: startOf7DaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'UTC' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Construct full 7-day timeline to prevent date gaps in Recharts line plot
    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const year = d.getUTCFullYear();
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const date = String(d.getUTCDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${date}`;

      const matchedDate = trendAggResult.find((t) => t._id === dateStr);
      trendData.push({
        date: dateStr,
        count: matchedDate ? matchedDate.count : 0,
      });
    }

    // 6. Recent activities (Latest 5 items)
    const recentActivity = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email category rating createdAt');

    // Return analytics JSON payload
    return sendSuccess(
      res,
      {
        summary: {
          totalFeedback,
          averageRating,
          todayFeedback,
          weeklyFeedback,
          monthlyFeedback,
        },
        categoryDistribution,
        trendData,
        recentActivity,
      },
      'Dashboard analytics retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};
