/**
 * User API routes
 */

const express = require('express');
const router = express.Router();
const UserProfileService = require('../services/UserProfileService');
const { authenticate, authorizeUser } = require('../middleware/auth');
const validate = require('../middleware/requestValidator');
const {
  emailUpdateSchema,
  profileUpdateSchema,
  passwordChangeSchema,
  customAttributesSchema
} = require('../utils/validators');
const { logger } = require('../utils/logger');

// Apply authentication to all routes
router.use(authenticate);
router.use(authorizeUser);

/**
 * GET /api/user/profile
 * Get user profile
 */
router.get('/profile', async (req, res, next) => {
  try {
    logger.info('GET /profile request', {
      userId: req.user.uid,
      requestId: req.id
    });

    const profile = await UserProfileService.getUserProfile(req.user.uid);

    res.json({
      success: true,
      user: profile
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/user/email
 * Update user email address
 */
router.post('/email', validate(emailUpdateSchema), async (req, res, next) => {
  try {
    const { newEmail } = req.body;

    logger.info('POST /email request', {
      userId: req.user.uid,
      newEmail,
      requestId: req.id
    });

    const result = await UserProfileService.updateEmail(req.user.uid, newEmail);

    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/user/profile
 * Update user profile
 */
router.put('/profile', validate(profileUpdateSchema), async (req, res, next) => {
  try {
    logger.info('PUT /profile request', {
      userId: req.user.uid,
      fields: Object.keys(req.body),
      requestId: req.id
    });

    const result = await UserProfileService.updateProfile(req.user.uid, req.body);

    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/user/password
 * Change user password
 */
router.post('/password', validate(passwordChangeSchema), async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    logger.info('POST /password request', {
      userId: req.user.uid,
      requestId: req.id
    });

    const result = await UserProfileService.changePassword(
      req.user.uid,
      oldPassword,
      newPassword
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/user/metadata
 * Get custom attributes
 */
router.get('/metadata', async (req, res, next) => {
  try {
    logger.info('GET /metadata request', {
      userId: req.user.uid,
      requestId: req.id
    });

    const metadata = await UserProfileService.getMetadata(req.user.uid);

    res.json({
      success: true,
      metadata
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/user/metadata
 * Update custom attributes
 */
router.put('/metadata', validate(customAttributesSchema), async (req, res, next) => {
  try {
    logger.info('PUT /metadata request', {
      userId: req.user.uid,
      attributes: Object.keys(req.body),
      requestId: req.id
    });

    const result = await UserProfileService.updateMetadata(req.user.uid, req.body);

    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
