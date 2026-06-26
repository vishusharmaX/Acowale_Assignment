import Feedback from '../models/Feedback.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Public
export const createFeedback = async (req, res, next) => {
  try {
    const { name, email, category, message, rating } = req.body;

    const feedback = await Feedback.create({
      name,
      email,
      category,
      message,
      rating: Number(rating),
    });

    return sendSuccess(res, feedback, 'Feedback submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all feedback with filtering, search, and pagination
// @route   GET /api/feedback
// @access  Admin
export const getAllFeedback = async (req, res, next) => {
  try {
    const {
      search,
      category,
      rating,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const filter = {};

    // 1. Category Filter
    if (category && category !== 'All') {
      filter.category = category;
    }

    // 2. Rating Filter
    if (rating && rating !== 'All') {
      filter.rating = Number(rating);
    }

    // 3. Search Filter (Debounced on Frontend, performs case-insensitive regex search)
    if (search && search.trim() !== '') {
      const escapedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // Escape regex characters
      filter.$or = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { email: { $regex: escapedSearch, $options: 'i' } },
        { message: { $regex: escapedSearch, $options: 'i' } },
      ];
    }

    // 4. Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skipNum = (pageNum - 1) * limitNum;

    // 5. Sorting
    const sort = {};
    if (sortBy) {
      sort[sortBy] = order === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1; // Default: newest first
    }

    const totalCount = await Feedback.countDocuments(filter);
    
    const feedbacks = await Feedback.find(filter)
      .sort(sort)
      .skip(skipNum)
      .limit(limitNum);

    const totalPages = Math.ceil(totalCount / limitNum);

    return sendSuccess(
      res,
      {
        feedbacks,
        pagination: {
          totalCount,
          totalPages,
          currentPage: pageNum,
          limit: limitNum,
        },
      },
      'Feedback entries retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get single feedback
// @route   GET /api/feedback/:id
// @access  Admin
export const getFeedbackById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return sendError(res, 'Feedback record not found', 404);
    }

    return sendSuccess(res, feedback, 'Feedback details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Admin
export const deleteFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return sendError(res, 'Feedback record not found', 404);
    }

    return sendSuccess(res, null, 'Feedback record deleted successfully');
  } catch (error) {
    next(error);
  }
};
