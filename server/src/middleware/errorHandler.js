/**
 * Error Handling Middleware
 * Centralized error handling for the API
 */

/**
 * Global error handler middleware
 * Handles all errors and sends appropriate responses
 */
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
}
