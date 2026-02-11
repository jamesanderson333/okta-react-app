/**
 * Environment variable validation
 */

const { logger } = require('../utils/logger');

const requiredEnvVars = [
  'OKTA_DOMAIN',
  'OKTA_AUTH_SERVER_ID',
  'OKTA_CLIENT_ID',
  'OKTA_API_TOKEN',
  'OKTA_ISSUER'
];

const validateEnv = () => {
  const missing = [];

  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  });

  if (missing.length > 0) {
    logger.error('Missing required environment variables:', { missing });
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  logger.info('Environment validation successful');
};

const getConfig = () => {
  return {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    okta: {
      domain: process.env.OKTA_DOMAIN,
      authServerId: process.env.OKTA_AUTH_SERVER_ID,
      clientId: process.env.OKTA_CLIENT_ID,
      apiToken: process.env.OKTA_API_TOKEN,
      issuer: process.env.OKTA_ISSUER
    },
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
    }
  };
};

module.exports = {
  validateEnv,
  getConfig
};
