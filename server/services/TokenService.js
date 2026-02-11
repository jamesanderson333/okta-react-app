/**
 * Token validation service
 */

const axios = require('axios');
const { logger, maskToken } = require('../utils/logger');
const { AuthenticationError } = require('../utils/errors');
const { getConfig } = require('../config/env');

class TokenService {
  /**
   * Validate access token via Okta introspection endpoint
   */
  async validateToken(accessToken) {
    try {
      const config = getConfig();
      const introspectionUrl = `https://${config.okta.domain}/oauth2/${config.okta.authServerId}/v1/introspect`;

      logger.debug('Validating token via introspection', {
        token: maskToken(accessToken)
      });

      const response = await axios.post(
        introspectionUrl,
        new URLSearchParams({
          token: accessToken,
          token_type_hint: 'access_token'
        }),
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          auth: {
            username: config.okta.clientId,
            password: config.okta.apiToken
          }
        }
      );

      const { active, sub, uid, exp } = response.data;

      if (!active) {
        throw new AuthenticationError('Token is not active');
      }

      if (exp && exp * 1000 < Date.now()) {
        throw new AuthenticationError('Token has expired');
      }

      return {
        active,
        userId: uid || sub,
        sub,
        exp
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }

      logger.error('Token validation failed', {
        error: error.message,
        token: maskToken(accessToken)
      });

      throw new AuthenticationError('Token validation failed');
    }
  }

  /**
   * Extract user information from validated token
   */
  async getUserFromToken(accessToken) {
    const tokenData = await this.validateToken(accessToken);
    return {
      userId: tokenData.userId,
      sub: tokenData.sub
    };
  }
}

module.exports = new TokenService();
