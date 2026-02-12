import React, { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import apiClient from '../services/apiClient';
import './Profile.css';

const Profile = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState({ type: '', text: '' });
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [factorId, setFactorId] = useState(null);
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);

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
  const accessTokenClaims = authState.accessToken?.claims || {};
  const isVIP = userInfo?.department === 'VIP' || claims.department === 'VIP';
  const membership = userInfo?.membership || claims.membership || 'None';

  // Get groups from access token claims
  const userGroups = accessTokenClaims.groups || [];
  const isPlatinum = membership === 'Platinum';
  const isBronze = membership === 'Bronze';
  const isSilver = membership === 'Silver';
  const isGold = membership === 'Gold';
  const hasNoMembership = membership === 'None';

  const handleEditEmail = () => {
    setNewEmail(claims.email || '');
    setIsEditingEmail(true);
    setUpdateMessage({ type: '', text: '' });
  };

  const handleCancelEdit = () => {
    setIsEditingEmail(false);
    setNewEmail('');
    setUpdateMessage({ type: '', text: '' });
  };

  const handleSaveEmail = async () => {
    if (!newEmail || newEmail === claims.email) {
      setUpdateMessage({ type: 'error', text: 'Please enter a different email address' });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setUpdateMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setIsUpdating(true);
    setUpdateMessage({ type: '', text: '' });

    try {
      // Get access token from Okta
      const accessToken = oktaAuth.getAccessToken();

      if (!accessToken) {
        throw new Error('No access token available');
      }

      // Set auth token in API client
      apiClient.setAuthToken(accessToken);

      // Call backend API to update email
      const result = await apiClient.updateEmail(newEmail);

      setUpdateMessage({
        type: 'success',
        text: result.message || 'Email updated successfully'
      });
      setIsEditingEmail(false);

      // Refresh user info from Okta
      oktaAuth.getUser().then(info => setUserInfo(info));

    } catch (error) {
      setUpdateMessage({
        type: 'error',
        text: error.message || 'Failed to update email. Please try again later.'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVerifyEmail = async () => {
    setIsVerifying(true);
    setVerificationMessage({ type: '', text: '' });

    try {
      // Get access token from Okta
      const accessToken = oktaAuth.getAccessToken();

      if (!accessToken) {
        throw new Error('No access token available');
      }

      // Set auth token in API client
      apiClient.setAuthToken(accessToken);

      // Call backend API to trigger email verification
      const response = await fetch('/api/user/verify-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to send verification email');
      }

      const result = await response.json();

      // Check if verification is possible
      if (result.data && result.data.status === 'EXISTS_BUT_NOT_ACCESSIBLE') {
        setVerificationMessage({
          type: 'error',
          text: result.data.message || 'Email verification is already set up but cannot be accessed. Please contact support.'
        });
        return;
      }

      // Check if already verified
      if (result.data && result.data.status === 'ACTIVE') {
        setVerificationMessage({
          type: 'success',
          text: 'Your email is already verified!'
        });

        // Simple reload after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        return;
      }

      // Store factor ID for OTP verification
      if (result.data && result.data.factorId) {
        setFactorId(result.data.factorId);
        setShowOtpInput(true);
      }

      setVerificationMessage({
        type: 'success',
        text: result.message || 'Verification email sent! Please check your inbox and enter the code below.'
      });

    } catch (error) {
      setVerificationMessage({
        type: 'error',
        text: error.message || 'Failed to send verification email. Please try again later.'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmitOtp = async () => {
    if (!otpCode || otpCode.length < 6) {
      setVerificationMessage({ type: 'error', text: 'Please enter a valid 6-digit code' });
      return;
    }

    setIsSubmittingOtp(true);
    setVerificationMessage({ type: '', text: '' });

    try {
      const accessToken = oktaAuth.getAccessToken();

      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await fetch('/api/user/verify-email/activate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          factorId: factorId,
          passCode: otpCode
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Invalid verification code');
      }

      await response.json();

      setVerificationMessage({
        type: 'success',
        text: 'Email verified successfully! Your profile will update shortly...'
      });
      setShowOtpInput(false);
      setOtpCode('');

      // Wait 2 seconds then reload to get fresh tokens with updated claims
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      setVerificationMessage({
        type: 'error',
        text: error.message || 'Failed to verify code. Please try again.'
      });
    } finally {
      setIsSubmittingOtp(false);
    }
  };

  const handleCancelOtp = () => {
    setShowOtpInput(false);
    setOtpCode('');
    setVerificationMessage({ type: '', text: '' });
  };

  return (
    <div className={`profile-container ${hasNoMembership ? 'basic-profile' : ''} ${isPlatinum ? 'platinum-theme' : ''}`}>
      {/* VIP Banner */}
      {isVIP && (
        <div className="vip-banner">
          <div className="vip-banner-content">
            <svg className="vip-crown" width="60" height="60" viewBox="0 0 100 100" fill="none">
              <path d="M50 20 L35 45 L20 50 L35 55 L50 80 L65 55 L80 50 L65 45 Z"
                    fill="url(#goldGradient)" stroke="#ffd700" strokeWidth="3"/>
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#ffd700', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#ffed4e', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#ffa500', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <circle cx="35" cy="45" r="4" fill="#fff" opacity="0.9">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="50" cy="35" r="5" fill="#fff" opacity="0.9">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="65" cy="45" r="4" fill="#fff" opacity="0.9">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
              </circle>
            </svg>
            <div className="vip-text">
              <h2 className="vip-title">VIP ACCESS</h2>
              <p className="vip-subtitle">Elite Member • Exclusive Benefits</p>
            </div>
            <div className="vip-badge-star">★</div>
          </div>
        </div>
      )}

      {/* Profile Header with Image */}
      <div className="profile-header">
        <div
          className="profile-hero"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1531386450638-969c8e5b1b2b?w=1920&q=80)'
          }}
        >
          <div className="profile-hero-overlay"></div>
          <div className="profile-hero-content">
            <div className="profile-avatar">
              {claims.name ? claims.name.charAt(0).toUpperCase() : 'V'}
            </div>
            <h1 className={`profile-hero-title ${isPlatinum ? 'platinum-member-title' : ''} ${isGold ? 'gold-member-title' : ''} ${isSilver ? 'silver-member-title' : ''} ${isBronze ? 'bronze-member-title' : ''}`}>
              {claims.name || 'VIPER USER'}
            </h1>
            {!hasNoMembership && (
              <p className={`profile-membership-tier ${membership.toLowerCase()}-tier`}>
                {isPlatinum && '💎 PLATINUM MEMBER • Ultimate Elite 💎'}
                {isGold && '⭐ GOLD MEMBER • Elite Tier ⭐'}
                {isSilver && '◆ SILVER MEMBER • Premium Tier ◆'}
                {isBronze && '● bronze member • basic tier ●'}
              </p>
            )}
            <p className="profile-hero-subtitle">{claims.email}</p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-section">
            <h2 className="section-title">Account Information</h2>

            {updateMessage.text && (
              <div className={`update-message ${updateMessage.type}`}>
                {updateMessage.text}
              </div>
            )}

            {verificationMessage.text && (
              <div className={`update-message ${verificationMessage.type}`}>
                {verificationMessage.text}
              </div>
            )}

            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-value">{claims.name || 'N/A'}</span>
              </div>
              <div className="info-item email-item">
                <span className="info-label">Email Address</span>
                {!isEditingEmail ? (
                  <div className="email-display">
                    <span className="info-value">{claims.email || 'N/A'}</span>
                    <button
                      className="edit-email-btn"
                      onClick={handleEditEmail}
                      title="Edit email address"
                    >
                      ✎ Edit
                    </button>
                  </div>
                ) : (
                  <div className="email-edit-form">
                    <input
                      type="email"
                      className="email-input"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Enter new email address"
                      disabled={isUpdating}
                    />
                    <div className="email-edit-actions">
                      <button
                        className="save-email-btn"
                        onClick={handleSaveEmail}
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        className="cancel-email-btn"
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="info-item">
                <span className="info-label">Email Verified</span>
                <div className="verification-display">
                  <span className="info-value">
                    <span className={`badge ${claims.email_verified ? 'success' : 'warning'}`}>
                      {claims.email_verified ? 'Verified' : 'Not Verified'}
                    </span>
                  </span>
                  {!claims.email_verified && !showOtpInput && (
                    <button
                      className="verify-email-btn"
                      onClick={handleVerifyEmail}
                      disabled={isVerifying}
                      title="Send verification email"
                    >
                      {isVerifying ? 'Sending...' : '✉ Verify Email'}
                    </button>
                  )}
                </div>
                {showOtpInput && (
                  <div className="otp-input-form">
                    <input
                      type="text"
                      className="otp-input"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit code"
                      maxLength="6"
                      disabled={isSubmittingOtp}
                    />
                    <div className="otp-actions">
                      <button
                        className="submit-otp-btn"
                        onClick={handleSubmitOtp}
                        disabled={isSubmittingOtp || otpCode.length < 6}
                      >
                        {isSubmittingOtp ? 'Verifying...' : 'Verify Code'}
                      </button>
                      <button
                        className="cancel-otp-btn"
                        onClick={handleCancelOtp}
                        disabled={isSubmittingOtp}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="info-item">
                <span className="info-label">Username</span>
                <span className="info-value">{claims.preferred_username || 'N/A'}</span>
              </div>
              {userInfo?.department && (
                <div className="info-item">
                  <span className="info-label">Department</span>
                  <span className={`info-value ${isVIP ? 'vip-text-glow' : ''}`}>
                    {userInfo.department}
                    {isVIP && <span className="vip-icon"> ★</span>}
                  </span>
                </div>
              )}
              <div className="info-item">
                <span className="info-label">Membership</span>
                <span className={`info-value membership-${membership.toLowerCase()}`}>
                  {membership}
                  {isGold && <span className="membership-star"> ★</span>}
                  {isSilver && <span className="membership-star"> ◆</span>}
                  {isBronze && <span className="membership-star"> ●</span>}
                </span>
              </div>
              {userGroups && userGroups.length > 0 && (
                <div className="info-item info-item-full">
                  <span className="info-label">Group Membership</span>
                  <div className="groups-list">
                    {userGroups.map((group, index) => (
                      <span key={index} className="group-badge-profile">
                        👥 {group}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Membership Exclusive Sections */}
          {!hasNoMembership && (
            <div className={`profile-section membership-section ${membership.toLowerCase()}-section`}>
              <h2 className={`section-title membership-section-title ${membership.toLowerCase()}-title`}>
                {isGold && '🏆 GOLD MEMBERSHIP BENEFITS'}
                {isSilver && '💎 SILVER MEMBERSHIP BENEFITS'}
                {isBronze && '🥉 BRONZE MEMBERSHIP BENEFITS'}
              </h2>
              <div className="membership-perks-grid">
                {/* Bronze Benefits */}
                {isBronze && (
                  <>
                    <div className="membership-perk-card bronze-card">
                      <div className="membership-perk-icon">📧</div>
                      <h3 className="membership-perk-title">Email Support</h3>
                      <p className="membership-perk-description">Standard email support response</p>
                    </div>
                    <div className="membership-perk-card bronze-card">
                      <div className="membership-perk-icon">📊</div>
                      <h3 className="membership-perk-title">Basic Analytics</h3>
                      <p className="membership-perk-description">Essential metrics and reports</p>
                    </div>
                  </>
                )}

                {/* Silver Benefits */}
                {isSilver && (
                  <>
                    <div className="membership-perk-card silver-card">
                      <div className="membership-perk-icon">💬</div>
                      <h3 className="membership-perk-title">Priority Support</h3>
                      <p className="membership-perk-description">Priority email & chat support</p>
                    </div>
                    <div className="membership-perk-card silver-card">
                      <div className="membership-perk-icon">📈</div>
                      <h3 className="membership-perk-title">Advanced Analytics</h3>
                      <p className="membership-perk-description">Detailed insights and reporting</p>
                    </div>
                    <div className="membership-perk-card silver-card">
                      <div className="membership-perk-icon">🔒</div>
                      <h3 className="membership-perk-title">Enhanced Security</h3>
                      <p className="membership-perk-description">Additional security features</p>
                    </div>
                  </>
                )}

                {/* Gold Benefits */}
                {isGold && (
                  <>
                    <div className="membership-perk-card gold-card">
                      <div className="membership-perk-icon">⚡</div>
                      <h3 className="membership-perk-title">24/7 Premium Support</h3>
                      <p className="membership-perk-description">Round-the-clock dedicated assistance</p>
                    </div>
                    <div className="membership-perk-card gold-card">
                      <div className="membership-perk-icon">🎯</div>
                      <h3 className="membership-perk-title">All Features Unlocked</h3>
                      <p className="membership-perk-description">Access to every premium capability</p>
                    </div>
                    <div className="membership-perk-card gold-card">
                      <div className="membership-perk-icon">🔐</div>
                      <h3 className="membership-perk-title">Maximum Security</h3>
                      <p className="membership-perk-description">Enterprise-grade protection</p>
                    </div>
                    <div className="membership-perk-card gold-card">
                      <div className="membership-perk-icon">📊</div>
                      <h3 className="membership-perk-title">Premium Analytics</h3>
                      <p className="membership-perk-description">Advanced insights & custom reports</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* VIP Exclusive Section - Only if VIP */}

          {/* VIP Exclusive Section */}
          {isVIP && (
            <div className="profile-section vip-section">
              <h2 className="section-title vip-section-title">
                <span className="vip-crown-icon">👑</span> VIP EXCLUSIVE ACCESS
              </h2>
              <div className="vip-perks-grid">
                <div className="vip-perk-card">
                  <div className="vip-perk-icon">⚡</div>
                  <h3 className="vip-perk-title">Priority Support</h3>
                  <p className="vip-perk-description">24/7 dedicated support team at your service</p>
                </div>
                <div className="vip-perk-card">
                  <div className="vip-perk-icon">🎯</div>
                  <h3 className="vip-perk-title">Advanced Features</h3>
                  <p className="vip-perk-description">Access to exclusive premium capabilities</p>
                </div>
                <div className="vip-perk-card">
                  <div className="vip-perk-icon">🔥</div>
                  <h3 className="vip-perk-title">Enhanced Security</h3>
                  <p className="vip-perk-description">Maximum protection for your account</p>
                </div>
                <div className="vip-perk-card">
                  <div className="vip-perk-icon">💎</div>
                  <h3 className="vip-perk-title">Premium Analytics</h3>
                  <p className="vip-perk-description">Deep insights and reporting tools</p>
                </div>
              </div>
            </div>
          )}

          {userInfo && (
            <div className="profile-section">
              <h2 className="section-title">User Details</h2>
              <div className="claims-container">
                <pre className="claims-json">{JSON.stringify(userInfo, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
