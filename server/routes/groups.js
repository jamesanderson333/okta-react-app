/**
 * Groups API routes - Demonstrate group-based authorization
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorizeUser } = require('../middleware/auth');
const { requireAdmin, requirePremium, requireGroups } = require('../middleware/groupAuth');
const { logger } = require('../utils/logger');
const { getOktaClient } = require('../config/okta');

// Apply authentication to all routes
router.use(authenticate);
router.use(authorizeUser);

/**
 * GET /api/groups/me
 * Get current user's groups
 */
router.get('/me', async (req, res) => {
  try {
    const userGroups = req.user.groups || [];

    logger.info('GET /groups/me', {
      userId: req.user.uid,
      groupCount: userGroups.length,
      requestId: req.id
    });

    res.json({
      success: true,
      data: {
        groups: userGroups,
        count: userGroups.length
      }
    });
  } catch (error) {
    logger.error('Failed to get user groups', {
      error: error.message,
      requestId: req.id
    });

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve groups'
    });
  }
});

/**
 * GET /api/groups/all
 * List all available groups (admin only)
 */
router.get('/all', requireAdmin, async (req, res) => {
  try {
    logger.info('GET /groups/all - Admin request', {
      userId: req.user.uid,
      requestId: req.id
    });

    const client = getOktaClient();
    const groupsCollection = await client.groupApi.listGroups({ limit: 100 });

    const groups = [];
    for await (const group of groupsCollection) {
      groups.push({
        id: group.id,
        name: group.profile.name,
        description: group.profile.description,
        type: group.type
      });
    }

    res.json({
      success: true,
      data: {
        groups,
        count: groups.length
      }
    });
  } catch (error) {
    logger.error('Failed to list groups', {
      error: error.message,
      requestId: req.id
    });

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve groups'
    });
  }
});

/**
 * GET /api/groups/check
 * Check if user has specific group membership
 */
router.get('/check/:groupName', async (req, res) => {
  try {
    const { groupName } = req.params;
    const userGroups = req.user.groups || [];
    const isMember = userGroups.includes(groupName);

    logger.info('GET /groups/check', {
      userId: req.user.uid,
      groupName,
      isMember,
      requestId: req.id
    });

    res.json({
      success: true,
      data: {
        groupName,
        isMember,
        userGroups
      }
    });
  } catch (error) {
    logger.error('Failed to check group membership', {
      error: error.message,
      requestId: req.id
    });

    res.status(500).json({
      success: false,
      message: 'Failed to check group membership'
    });
  }
});

/**
 * GET /api/groups/admin-only
 * Example admin-only endpoint
 */
router.get('/admin-only', requireAdmin, async (req, res) => {
  res.json({
    success: true,
    message: 'You have admin access!',
    data: {
      adminFeatures: [
        'User management',
        'System configuration',
        'Audit logs',
        'Group management'
      ]
    }
  });
});

/**
 * GET /api/groups/premium-only
 * Example premium-only endpoint
 */
router.get('/premium-only', requirePremium, async (req, res) => {
  res.json({
    success: true,
    message: 'You have premium access!',
    data: {
      premiumFeatures: [
        'Advanced analytics',
        'Priority support',
        'Enhanced features',
        'Custom reports'
      ]
    }
  });
});

/**
 * POST /api/groups/users/:userId/assign
 * Assign user to group (admin only)
 */
router.post('/users/:userId/assign', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { groupId } = req.body;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'groupId is required'
      });
    }

    logger.info('POST /groups/users/:userId/assign', {
      userId,
      groupId,
      adminUserId: req.user.uid,
      requestId: req.id
    });

    const client = getOktaClient();

    // Assign user to group
    await client.groupApi.assignUserToGroup({
      groupId,
      userId
    });

    logger.info('User assigned to group successfully', {
      userId,
      groupId,
      requestId: req.id
    });

    res.json({
      success: true,
      message: 'User assigned to group successfully'
    });
  } catch (error) {
    logger.error('Failed to assign user to group', {
      error: error.message,
      requestId: req.id
    });

    res.status(500).json({
      success: false,
      message: 'Failed to assign user to group'
    });
  }
});

/**
 * DELETE /api/groups/users/:userId/remove
 * Remove user from group (admin only)
 */
router.delete('/users/:userId/remove', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { groupId } = req.body;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'groupId is required'
      });
    }

    logger.info('DELETE /groups/users/:userId/remove', {
      userId,
      groupId,
      adminUserId: req.user.uid,
      requestId: req.id
    });

    const client = getOktaClient();

    // Remove user from group
    await client.groupApi.unassignUserFromGroup({
      groupId,
      userId
    });

    logger.info('User removed from group successfully', {
      userId,
      groupId,
      requestId: req.id
    });

    res.json({
      success: true,
      message: 'User removed from group successfully'
    });
  } catch (error) {
    logger.error('Failed to remove user from group', {
      error: error.message,
      requestId: req.id
    });

    res.status(500).json({
      success: false,
      message: 'Failed to remove user from group'
    });
  }
});

module.exports = router;
