import React, { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import './Profile.css';

const Profile = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (authState?.isAuthenticated) {
      oktaAuth.getUser().then(info => {
        setUserInfo(info);
      });
    }
  }, [authState, oktaAuth]);

  if (!authState || !authState.isAuthenticated) {
    return <div>Loading...</div>;
  }

  const claims = authState.idToken?.claims || {};

  return (
    <div className="profile-container">
      {/* Profile Header with Image */}
      <div className="profile-header">
        <div
          className="profile-hero"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1920&q=80)'
          }}
        >
          <div className="profile-hero-overlay"></div>
          <div className="profile-hero-content">
            <div className="profile-avatar">
              {claims.name ? claims.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h1 className="profile-hero-title">{claims.name || 'User Profile'}</h1>
            <p className="profile-hero-subtitle">{claims.email}</p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-section">
            <h2 className="section-title">Account Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-value">{claims.name || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email Address</span>
                <span className="info-value">{claims.email || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email Verified</span>
                <span className="info-value">
                  <span className={`badge ${claims.email_verified ? 'success' : 'warning'}`}>
                    {claims.email_verified ? 'Verified' : 'Not Verified'}
                  </span>
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Username</span>
                <span className="info-value">{claims.preferred_username || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Subject ID</span>
                <span className="info-value mono">{claims.sub || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Issuer</span>
                <span className="info-value mono">{claims.iss || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2 className="section-title">Security & Authentication</h2>
            <div className="security-grid">
              <div className="security-item">
                <div className="security-icon">🔐</div>
                <h3>Multi-Factor Authentication</h3>
                <p>Your account is protected with MFA</p>
                <span className="security-status active">Active</span>
              </div>
              <div className="security-item">
                <div className="security-icon">🔑</div>
                <h3>Password Last Changed</h3>
                <p>Keep your password up to date</p>
                <span className="security-status">30 days ago</span>
              </div>
              <div className="security-item">
                <div className="security-icon">📱</div>
                <h3>Active Sessions</h3>
                <p>Currently signed in on 1 device</p>
                <span className="security-status">1 Active</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2 className="section-title">ID Token Claims</h2>
            <div className="claims-container">
              <pre className="claims-json">{JSON.stringify(claims, null, 2)}</pre>
            </div>
          </div>

          {userInfo && (
            <div className="profile-section">
              <h2 className="section-title">Extended User Information</h2>
              <div className="claims-container">
                <pre className="claims-json">{JSON.stringify(userInfo, null, 2)}</pre>
              </div>
            </div>
          )}

          <div className="profile-actions">
            <button className="action-button primary">Update Profile</button>
            <button className="action-button secondary">Change Password</button>
            <button className="action-button secondary">Security Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
