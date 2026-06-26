import { sendError } from '../utils/responseFormatter.js';

// Route not found middleware
export const notFoundHandler = (req, res, next) => {
  return sendError(res, `Endpoint not found: ${req.method} ${req.originalUrl}`, 404);
};

// Centralized error handler
export const errorHandler = (err, req, res, next) => {
  console.error('[Global Error Catch-all]:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Check specific Mongoose error types
  if (err.name === 'CastError') {
    return sendError(res, `Resource not found. Invalid ID format for field: ${err.path}`, 400);
  }

  if (err.name === 'ValidationError') {
    const errorDetails = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
    return sendError(res, 'Mongoose schema validation failed', 400, errorDetails);
  }

  return sendError(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : null
  );
};
