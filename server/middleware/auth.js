/**
 * Authentication middleware - validates JWT tokens via Okta JWT Verifier
 */

const OktaJwtVerifier = require('@okta/jwt-verifier');
const { logger, maskToken } = require('../utils/logger');
const { AuthenticationError, AuthorizationError } = require('../utils/errors');
const { getConfig } = require('../config/env');

// Initialize JWT verifier
let jwtVerifier = null;

const getJwtVerifier = () => {
  if (!jwtVerifier) {
    const config = getConfig();
    jwtVerifier = new OktaJwtVerifier({
      issuer: config.okta.issuer,
      clientId: config.okta.clientId,
      assertClaims: {
        aud: 'api://default'
      }
    });
  }
  return jwtVerifier;
};

const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    logger.debug('Validating JWT token', {
      token: maskToken(token),
      requestId: req.id
    });

    // Verify JWT token
    const verifier = getJwtVerifier();
    const jwt = await verifier.verifyAccessToken(token, 'api://default');

    // Extract user info from JWT claims
    const { sub, uid } = jwt.claims;

    // Store user info in request
    req.user = {
      sub,
      uid: uid || sub,
      token
    };

    logger.info('Token validated successfully', {
      userId: req.user.uid,
      requestId: req.id
    });

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return next(error);
    }

    logger.error('Token validation failed', {
      error: error.message,
      requestId: req.id
    });

    // Handle JWT verification errors
    if (error.message.includes('expired')) {
      return next(new AuthenticationError('Token has expired'));
    }

    if (error.message.includes('invalid')) {
      return next(new AuthenticationError('Invalid token'));
    }

    next(new AuthenticationError('Token validation failed'));
  }
};

// Middleware to verify user owns the resource
const authorizeUser = (req, res, next) => {
  const userId = req.params.userId || req.user.uid;

  if (userId && userId !== req.user.uid) {
    logger.warn('Unauthorized access attempt', {
      requestedUserId: userId,
      authenticatedUserId: req.user.uid,
      requestId: req.id
    });
    return next(new AuthorizationError('You can only modify your own profile'));
  }

  next();
};

module.exports = {
  authenticate,
  authorizeUser
};
