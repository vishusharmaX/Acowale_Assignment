/**
 * Send a success response.
 * @param {Object} res - Express response object
 * @param {any} data - Response payload data
 * @param {string} message - Descriptive success message
 * @param {number} statusCode - HTTP status code
 */
export const sendSuccess = (res, data = null, message = 'Operation successful', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Send an error response.
 * @param {Object} res - Express response object
 * @param {string} message - Descriptive error message
 * @param {number} statusCode - HTTP status code
 * @param {any} errors - Detailed errors list (e.g. express-validator errors)
 */
export const sendError = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};
