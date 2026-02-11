/**
 * Logger utility using Winston
 */

const winston = require('winston');

const logLevel = process.env.LOG_LEVEL || 'info';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, requestId, userId, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]`;

    if (requestId) log += ` [RequestID: ${requestId}]`;
    if (userId) log += ` [UserID: ${userId}]`;

    log += `: ${message}`;

    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }

    return log;
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports: [
    // Console transport for all environments
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    })
  ]
});

// Add file transport in production
if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error'
  }));
  logger.add(new winston.transports.File({
    filename: 'logs/combined.log'
  }));
}

// Helper to mask sensitive data
const maskToken = (token) => {
  if (!token || token.length < 8) return '****';
  return `****${token.slice(-4)}`;
};

// Export logger and helpers
module.exports = {
  logger,
  maskToken
};
