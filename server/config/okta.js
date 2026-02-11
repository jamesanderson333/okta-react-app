/**
 * Okta SDK configuration
 */

const okta = require('@okta/okta-sdk-nodejs');
const { logger } = require('../utils/logger');
const { ServerError } = require('../utils/errors');

let oktaClient = null;

const initializeOktaClient = (config) => {
  try {
    oktaClient = new okta.Client({
      orgUrl: `https://${config.okta.domain}`,
      token: config.okta.apiToken
    });

    logger.info('Okta SDK client initialized successfully', {
      domain: config.okta.domain
    });

    return oktaClient;
  } catch (error) {
    logger.error('Failed to initialize Okta SDK client', {
      error: error.message
    });
    throw new ServerError('Failed to initialize Okta client');
  }
};

const getOktaClient = () => {
  if (!oktaClient) {
    throw new ServerError('Okta client not initialized');
  }
  return oktaClient;
};

module.exports = {
  initializeOktaClient,
  getOktaClient
};
