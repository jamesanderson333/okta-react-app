const oktaConfig = {
  clientId: '0oau1vofvenf0bvwy417',
  issuer: 'https://jeacis.okta.com/oauth2/default',
  redirectUri: window.location.origin + '/login/callback',
  scopes: ['openid', 'profile', 'email', 'groups'],
  pkce: true,
  disableHttpsCheck: process.env.NODE_ENV === 'development',
  postLogoutRedirectUri: window.location.origin,
};

export default oktaConfig;
