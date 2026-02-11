/**
 * Global error handling middleware
 */

const { logger } = require('../utils/logger');
const { AppError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  // Log error details
  logger.error('Error occurred', {
    message: err.message,
    statusCode: err.statusCode || 500,
    code: err.code,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    requestId: req.id,
    userId: req.user?.uid,
    path: req.path,
    method: req.method
  });

  // Handle operational errors (expected errors)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
        status: err.statusCode
      }
    });
  }

  // Handle Joi validation errors
  if (err.isJoi) {
    return res.status(400).json({
      error: {
        message: err.details[0].message,
        code: 'VALIDATION_ERROR',
        status: 400
      }
    });
  }

  // Handle Okta SDK errors
  if (err.status) {
    const statusCode = err.status;
    let message = 'An error occurred with Okta';

    if (statusCode === 404) {
      message = 'User not found';
    } else if (statusCode === 409) {
      message = 'Email already exists';
    } else if (statusCode === 401 || statusCode === 403) {
      message = 'Authentication failed';
    }

    return res.status(statusCode).json({
      error: {
        message,
        code: 'OKTA_ERROR',
        status: statusCode
      }
    });
  }

  // Handle unexpected errors
  logger.error('Unexpected error', {
    error: err.message,
    stack: err.stack,
    requestId: req.id
  });

  res.status(500).json({
    error: {
      message: 'An internal server error occurred',
      code: 'SERVER_ERROR',
      status: 500
    }
  });
};

module.exports = errorHandler;
