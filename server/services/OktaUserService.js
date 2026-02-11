/**
 * Okta User Service - Wrapper for Okta Management API operations
 */

const { getOktaClient } = require('../config/okta');
const { logger } = require('../utils/logger');
const { NotFoundError, ConflictError, ServerError } = require('../utils/errors');

class OktaUserService {
  /**
   * Get user profile by user ID
   */
  async getUser(userId) {
    try {
      logger.debug('Fetching user profile', { userId });

      const client = getOktaClient();
      const { user } = await client.userApi.getUser({ userId });

      logger.info('User profile retrieved successfully', { userId });

      return {
        id: user.id,
        status: user.status,
        created: user.created,
        activated: user.activated,
        lastLogin: user.lastLogin,
        profile: user.profile
      };
    } catch (error) {
      logger.error('Failed to fetch user profile', {
        userId,
        error: error.message
      });

      if (error.status === 404) {
        throw new NotFoundError('User not found');
      }

      throw new ServerError('Failed to retrieve user profile');
    }
  }

  /**
   * Update user email address
   */
  async updateUserEmail(userId, newEmail) {
    try {
      logger.info('Updating user email', {
        userId,
        newEmail
      });

      const client = getOktaClient();

      // Get current user
      const getUserResponse = await client.userApi.getUser({ userId });
      logger.debug('Get user response structure', {
        hasUser: !!getUserResponse.user,
        keys: Object.keys(getUserResponse)
      });

      // The response might be the user object directly
      const currentUser = getUserResponse.user || getUserResponse;

      // Update email in profile
      const updatedProfile = {
        ...currentUser.profile,
        email: newEmail,
        login: newEmail // Okta uses login as primary identifier
      };

      // Update the user
      const updateResponse = await client.userApi.updateUser({
        userId,
        user: {
          profile: updatedProfile
        }
      });

      const updatedUser = updateResponse.user || updateResponse;

      logger.info('User email updated successfully', {
        userId,
        newEmail
      });

      return {
        id: updatedUser.id,
        email: updatedUser.profile.email,
        status: updatedUser.status
      };
    } catch (error) {
      logger.error('Failed to update user email', {
        userId,
        newEmail,
        error: error.message,
        status: error.status
      });

      if (error.status === 404) {
        throw new NotFoundError('User not found');
      }

      if (error.status === 400 && error.message.includes('already exists')) {
        throw new ConflictError('Email address already exists');
      }

      throw new ServerError('Failed to update email address');
    }
  }

  /**
   * Update user profile fields
   */
  async updateUserProfile(userId, profileData) {
    try {
      logger.info('Updating user profile', {
        userId,
        fields: Object.keys(profileData)
      });

      const client = getOktaClient();

      // Get current user
      const { user } = await client.userApi.getUser({ userId });

      // Merge profile data
      const updatedProfile = {
        ...user.profile,
        ...profileData
      };

      // Update the user
      const { user: updatedUser } = await client.userApi.updateUser({
        userId,
        user: {
          profile: updatedProfile
        }
      });

      logger.info('User profile updated successfully', {
        userId,
        fields: Object.keys(profileData)
      });

      return {
        id: updatedUser.id,
        profile: updatedUser.profile
      };
    } catch (error) {
      logger.error('Failed to update user profile', {
        userId,
        error: error.message
      });

      if (error.status === 404) {
        throw new NotFoundError('User not found');
      }

      throw new ServerError('Failed to update user profile');
    }
  }

  /**
   * Change user password
   */
  async changePassword(userId, oldPassword, newPassword) {
    try {
      logger.info('Changing user password', { userId });

      const client = getOktaClient();

      // Change password using the API
      await client.userApi.changePassword({
        userId,
        changePasswordRequest: {
          oldPassword: {
            value: oldPassword
          },
          newPassword: {
            value: newPassword
          }
        }
      });

      logger.info('User password changed successfully', { userId });

      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error) {
      logger.error('Failed to change user password', {
        userId,
        error: error.message,
        status: error.status
      });

      if (error.status === 404) {
        throw new NotFoundError('User not found');
      }

      if (error.status === 403 || error.status === 401) {
        throw new ServerError('Invalid old password');
      }

      throw new ServerError('Failed to change password');
    }
  }

  /**
   * Get custom attributes (metadata) for user
   */
  async getCustomAttributes(userId) {
    try {
      logger.debug('Fetching user custom attributes', { userId });

      const client = getOktaClient();
      const { user } = await client.userApi.getUser({ userId });

      // Extract custom attributes (non-standard profile fields)
      const standardFields = ['email', 'login', 'firstName', 'lastName', 'mobilePhone',
                             'secondEmail', 'city', 'state', 'zipCode', 'countryCode'];

      const customAttributes = {};
      Object.keys(user.profile).forEach(key => {
        if (!standardFields.includes(key)) {
          customAttributes[key] = user.profile[key];
        }
      });

      logger.info('User custom attributes retrieved', {
        userId,
        attributeCount: Object.keys(customAttributes).length
      });

      return customAttributes;
    } catch (error) {
      logger.error('Failed to fetch user custom attributes', {
        userId,
        error: error.message
      });

      if (error.status === 404) {
        throw new NotFoundError('User not found');
      }

      throw new ServerError('Failed to retrieve custom attributes');
    }
  }

  /**
   * Update custom attributes (metadata) for user
   */
  async updateCustomAttributes(userId, attributes) {
    try {
      logger.info('Updating user custom attributes', {
        userId,
        attributes: Object.keys(attributes)
      });

      const client = getOktaClient();

      // Get current user
      const { user } = await client.userApi.getUser({ userId });

      // Merge custom attributes
      const updatedProfile = {
        ...user.profile,
        ...attributes
      };

      // Update the user
      const { user: updatedUser } = await client.userApi.updateUser({
        userId,
        user: {
          profile: updatedProfile
        }
      });

      logger.info('User custom attributes updated successfully', {
        userId,
        attributes: Object.keys(attributes)
      });

      // Return only the custom attributes that were updated
      const result = {};
      Object.keys(attributes).forEach(key => {
        result[key] = updatedUser.profile[key];
      });

      return result;
    } catch (error) {
      logger.error('Failed to update user custom attributes', {
        userId,
        error: error.message
      });

      if (error.status === 404) {
        throw new NotFoundError('User not found');
      }

      throw new ServerError('Failed to update custom attributes');
    }
  }
}

module.exports = new OktaUserService();
