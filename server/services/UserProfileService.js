/**
 * User Profile Service - Business logic orchestration layer
 */

const OktaUserService = require('./OktaUserService');
const { logger } = require('../utils/logger');

class UserProfileService {
  /**
   * Get complete user profile
   */
  async getUserProfile(userId) {
    logger.debug('Getting user profile', { userId });
    return await OktaUserService.getUser(userId);
  }

  /**
   * Update user email with validation
   */
  async updateEmail(userId, newEmail) {
    logger.info('Processing email update request', { userId, newEmail });

    const result = await OktaUserService.updateUserEmail(userId, newEmail);

    return {
      success: true,
      message: 'Email updated successfully. Please verify your new email address.',
      user: result
    };
  }

  /**
   * Update user profile fields
   */
  async updateProfile(userId, profileData) {
    logger.info('Processing profile update request', {
      userId,
      fields: Object.keys(profileData)
    });

    const result = await OktaUserService.updateUserProfile(userId, profileData);

    return {
      success: true,
      message: 'Profile updated successfully',
      profile: result.profile
    };
  }

  /**
   * Change user password
   */
  async changePassword(userId, oldPassword, newPassword) {
    logger.info('Processing password change request', { userId });

    // Validate passwords are different
    if (oldPassword === newPassword) {
      throw new Error('New password must be different from old password');
    }

    const result = await OktaUserService.changePassword(userId, oldPassword, newPassword);

    return {
      success: true,
      message: 'Password changed successfully'
    };
  }

  /**
   * Get user custom metadata
   */
  async getMetadata(userId) {
    logger.debug('Getting user metadata', { userId });
    return await OktaUserService.getCustomAttributes(userId);
  }

  /**
   * Update user custom metadata
   */
  async updateMetadata(userId, attributes) {
    logger.info('Processing metadata update request', {
      userId,
      attributes: Object.keys(attributes)
    });

    const result = await OktaUserService.updateCustomAttributes(userId, attributes);

    return {
      success: true,
      message: 'Metadata updated successfully',
      metadata: result
    };
  }
}

module.exports = new UserProfileService();
