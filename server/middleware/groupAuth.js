/**
 * Group-based authorization middleware
 * Checks if authenticated user belongs to required groups
 */

const { logger } = require('../utils/logger');

/**
 * Middleware to require user to be in at least one of the specified groups
 * @param {string[]} allowedGroups - Array of group names that grant access
 */
const requireGroups = (allowedGroups) => {
  return (req, res, next) => {
    try {
      // Get user groups from token claims
      const userGroups = req.user.groups || [];

      logger.debug('Checking group authorization', {
        userId: req.user.uid,
        userGroups,
        requiredGroups: allowedGroups,
        requestId: req.id
      });

      // Check if user has at least one of the required groups
      const hasAccess = allowedGroups.some(group => userGroups.includes(group));

      if (!hasAccess) {
        logger.warn('Group authorization failed', {
          userId: req.user.uid,
          userGroups,
          requiredGroups: allowedGroups,
          requestId: req.id
        });

        return res.status(403).json({
          error: {
            message: `Access denied. Required group membership: ${allowedGroups.join(' or ')}`,
            code: 'INSUFFICIENT_PERMISSIONS',
            status: 403
          }
        });
      }

      logger.info('Group authorization successful', {
        userId: req.user.uid,
        matchedGroups: userGroups.filter(g => allowedGroups.includes(g)),
        requestId: req.id
      });

      next();
    } catch (error) {
      logger.error('Group authorization error', {
        userId: req.user?.uid,
        error: error.message,
        requestId: req.id
      });

      return res.status(500).json({
        error: {
          message: 'Authorization check failed',
          code: 'AUTHORIZATION_ERROR',
          status: 500
        }
      });
    }
  };
};

/**
 * Middleware to require user to be an admin
 */
const requireAdmin = requireGroups(['Admins', 'VIPER_Admins']);

/**
 * Middleware to require premium membership groups
 */
const requirePremium = requireGroups(['Premium Users', 'VIPER_Premium_Users', 'Gold Members', 'Platinum Members']);

/**
 * Middleware to require developer access
 */
const requireDeveloper = requireGroups(['Developers', 'VIPER_Developers']);

/**
 * Middleware to check if user belongs to ALL specified groups
 * @param {string[]} requiredGroups - Array of group names that ALL must be present
 */
const requireAllGroups = (requiredGroups) => {
  return (req, res, next) => {
    try {
      const userGroups = req.user.groups || [];

      // Check if user has ALL required groups
      const hasAllGroups = requiredGroups.every(group => userGroups.includes(group));

      if (!hasAllGroups) {
        const missingGroups = requiredGroups.filter(g => !userGroups.includes(g));

        logger.warn('Group authorization failed - missing required groups', {
          userId: req.user.uid,
          userGroups,
          requiredGroups,
          missingGroups,
          requestId: req.id
        });

        return res.status(403).json({
          error: {
            message: `Access denied. Missing required groups: ${missingGroups.join(', ')}`,
            code: 'INSUFFICIENT_PERMISSIONS',
            status: 403
          }
        });
      }

      next();
    } catch (error) {
      logger.error('Group authorization error', {
        error: error.message,
        requestId: req.id
      });

      return res.status(500).json({
        error: {
          message: 'Authorization check failed',
          code: 'AUTHORIZATION_ERROR',
          status: 500
        }
      });
    }
  };
};

/**
 * Middleware to add group information to response headers (for debugging)
 */
const addGroupHeaders = (req, res, next) => {
  const userGroups = req.user.groups || [];
  res.set('X-User-Groups', userGroups.join(','));
  next();
};

module.exports = {
  requireGroups,
  requireAdmin,
  requirePremium,
  requireDeveloper,
  requireAllGroups,
  addGroupHeaders
};
