import React from 'react';
import { useOktaAuth } from '@okta/okta-react';
import './Tokens.css';

const Tokens = () => {
  const { authState } = useOktaAuth();

  if (!authState || !authState.isAuthenticated) {
    return <div>Loading...</div>;
  }

  const { accessToken, idToken, refreshToken } = authState;

  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleString();
  };

  const accessTokenClaims = accessToken ? decodeToken(accessToken.accessToken) : null;
  const idTokenClaims = idToken ? decodeToken(idToken.idToken) : null;

  return (
    <div className="tokens-container">
      <div className="tokens-card">
        <h1 className="tokens-title">Token Management</h1>

        <div className="token-section">
          <h2 className="token-type">Access Token</h2>
          {accessToken ? (
            <>
              <div className="token-info">
                <div className="token-meta">
                  <span className="meta-label">Expires:</span>
                  <span className="meta-value">
                    {formatDate(accessToken.expiresAt)}
                  </span>
                </div>
                <div className="token-meta">
                  <span className="meta-label">Scopes:</span>
                  <span className="meta-value">
                    {accessToken.scopes?.join(', ') || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="token-content">
                <h3 className="content-title">Token Value</h3>
                <div className="token-value">{accessToken.accessToken}</div>
              </div>
              {accessTokenClaims && (
                <div className="token-content">
                  <h3 className="content-title">Decoded Claims</h3>
                  <pre className="token-json">
                    {JSON.stringify(accessTokenClaims, null, 2)}
                  </pre>
                </div>
              )}
            </>
          ) : (
            <p>No access token available</p>
          )}
        </div>

        <div className="token-section">
          <h2 className="token-type">ID Token</h2>
          {idToken ? (
            <>
              <div className="token-info">
                <div className="token-meta">
                  <span className="meta-label">Expires:</span>
                  <span className="meta-value">
                    {formatDate(idToken.expiresAt)}
                  </span>
                </div>
              </div>
              <div className="token-content">
                <h3 className="content-title">Token Value</h3>
                <div className="token-value">{idToken.idToken}</div>
              </div>
              {idTokenClaims && (
                <div className="token-content">
                  <h3 className="content-title">Decoded Claims</h3>
                  <pre className="token-json">
                    {JSON.stringify(idTokenClaims, null, 2)}
                  </pre>
                </div>
              )}
            </>
          ) : (
            <p>No ID token available</p>
          )}
        </div>

        {refreshToken && (
          <div className="token-section">
            <h2 className="token-type">Refresh Token</h2>
            <div className="token-content">
              <h3 className="content-title">Token Value</h3>
              <div className="token-value">{refreshToken}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tokens;
