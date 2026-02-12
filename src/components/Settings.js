import React, { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import './Settings.css';

const Settings = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

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
  const membership = userInfo?.membership || claims.membership || 'None';

  // Get groups from access token claims
  const groups = accessTokenClaims.groups || [];
  const hasGroups = groups.length > 0;

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Account Settings</h1>
        <p className="settings-subtitle">Manage your account preferences and security</p>
      </div>

      <div className="settings-tabs">
        <button
          className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
        <button
          className={`settings-tab ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => setActiveTab('features')}
        >
          Okta Features
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'profile' && (
          <div className="settings-section">
            <h2 className="section-heading">Profile Information</h2>

            <div className="settings-card">
              <h3 className="card-title">Basic Information</h3>
              <div className="settings-grid">
                <div className="settings-item">
                  <label>Name</label>
                  <div className="value">{claims.name || 'N/A'}</div>
                </div>
                <div className="settings-item">
                  <label>Email</label>
                  <div className="value">{claims.email || 'N/A'}</div>
                </div>
                <div className="settings-item">
                  <label>Username</label>
                  <div className="value">{claims.preferred_username || 'N/A'}</div>
                </div>
                <div className="settings-item">
                  <label>Membership</label>
                  <div className={`value membership-${membership.toLowerCase()}`}>
                    {membership}
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-card">
              <h3 className="card-title">Group Memberships</h3>
              {hasGroups ? (
                <>
                  <p className="card-description">
                    You are a member of the following groups:
                  </p>
                  <div className="groups-grid">
                    {groups.map((group, index) => (
                      <div key={index} className="group-badge">
                        <span className="group-icon">👥</span>
                        <span className="group-name">{group}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="card-description">
                  You are not currently a member of any groups. Groups can be used for role-based access control and permissions.
                </p>
              )}
              <div className="info-box">
                <strong>How to add groups:</strong>
                <ol style={{ marginTop: '10px', paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>Create groups in Okta Admin Console</li>
                  <li>Assign users to groups</li>
                  <li>Add "groups" claim to access token (in Authorization Server)</li>
                  <li>Logout and login to see groups here</li>
                </ol>
                <p style={{ marginTop: '10px' }}>
                  See <code>OKTA_GROUPS_SETUP.md</code> for detailed instructions.
                </p>
              </div>
            </div>

            <div className="settings-card">
              <h3 className="card-title">Custom Attributes Available</h3>
              <div className="feature-list">
                <div className="feature-item">✓ Department (for VIP access)</div>
                <div className="feature-item">✓ Membership Tier</div>
                <div className="feature-item">✓ Groups (for RBAC)</div>
                <div className="feature-item">○ Phone Number</div>
                <div className="feature-item">○ Company Name</div>
                <div className="feature-item">○ Job Title</div>
                <div className="feature-item">○ Employee ID</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="settings-section">
            <h2 className="section-heading">Security Settings</h2>

            <div className="settings-card">
              <h3 className="card-title">Authentication</h3>
              <div className="settings-item">
                <label>Email Verified</label>
                <div className={`badge ${claims.email_verified ? 'success' : 'warning'}`}>
                  {claims.email_verified ? 'Verified' : 'Not Verified'}
                </div>
              </div>
            </div>

            <div className="settings-card">
              <h3 className="card-title">Access Control & Groups</h3>
              {hasGroups ? (
                <>
                  <p className="card-description">
                    Your group memberships determine your access level and permissions:
                  </p>
                  <div className="groups-grid">
                    {groups.map((group, index) => (
                      <div key={index} className="group-badge">
                        <span className="group-icon">👥</span>
                        <span className="group-name">{group}</span>
                      </div>
                    ))}
                  </div>
                  <div className="info-box" style={{ marginTop: '20px' }}>
                    <strong>Group-Based Authorization:</strong>
                    <ul style={{ marginTop: '10px', paddingLeft: '20px', lineHeight: '1.8' }}>
                      <li><strong>Admins</strong> - Full administrative access</li>
                      <li><strong>Premium Users</strong> - Enhanced features</li>
                      <li><strong>Beta Testers</strong> - Early access to new features</li>
                      <li><strong>Support Staff</strong> - Customer support tools</li>
                      <li><strong>Developers</strong> - Developer resources</li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="info-box">
                  <strong>No Group Memberships</strong>
                  <p style={{ marginTop: '10px' }}>
                    You are not currently assigned to any groups. Groups enable role-based access control (RBAC) and can be used to grant specific permissions.
                  </p>
                  <p style={{ marginTop: '10px' }}>
                    See <code>OKTA_GROUPS_SETUP.md</code> for setup instructions.
                  </p>
                </div>
              )}
            </div>

            <div className="settings-card">
              <h3 className="card-title">Multi-Factor Authentication (MFA)</h3>
              <p className="card-description">
                Okta supports multiple authentication factors for enhanced security:
              </p>
              <div className="feature-list">
                <div className="feature-item">✓ Email Verification (implemented)</div>
                <div className="feature-item">○ SMS Authentication</div>
                <div className="feature-item">○ Voice Call Authentication</div>
                <div className="feature-item">○ Google Authenticator (TOTP)</div>
                <div className="feature-item">○ Okta Verify Push</div>
                <div className="feature-item">○ Security Questions</div>
                <div className="feature-item">○ WebAuthn/FIDO2 (Biometrics)</div>
                <div className="feature-item">○ Hardware Tokens (YubiKey)</div>
              </div>
            </div>

            <div className="settings-card">
              <h3 className="card-title">Password Policy</h3>
              <div className="feature-list">
                <div className="feature-item">✓ Minimum 8 characters</div>
                <div className="feature-item">✓ Complexity requirements</div>
                <div className="feature-item">✓ Password history</div>
                <div className="feature-item">✓ Account lockout protection</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="settings-section">
            <h2 className="section-heading">Okta Customization Features</h2>

            <div className="settings-card">
              <h3 className="card-title">✅ Implemented Features</h3>
              <div className="feature-list">
                <div className="feature-item">✓ Custom user attributes (membership, department)</div>
                <div className="feature-item">✓ Self-service registration</div>
                <div className="feature-item">✓ Email verification</div>
                <div className="feature-item">✓ Custom UI themes (Platinum, Gold, Silver, Bronze)</div>
                <div className="feature-item">✓ Management API integration</div>
                <div className="feature-item">✓ Token-based authentication</div>
                <div className="feature-item">✓ Embedded Sign-In Widget</div>
              </div>
            </div>

            <div className="settings-card">
              <h3 className="card-title">🚀 Available Okta Features</h3>

              <div className="feature-category">
                <h4>Social Login</h4>
                <div className="feature-list">
                  <div className="feature-item">○ Google Sign-In</div>
                  <div className="feature-item">○ Facebook Login</div>
                  <div className="feature-item">○ Apple Sign-In</div>
                  <div className="feature-item">○ GitHub OAuth</div>
                  <div className="feature-item">○ Microsoft Account</div>
                  <div className="feature-item">○ LinkedIn</div>
                </div>
              </div>

              <div className="feature-category">
                <h4>Groups & Roles</h4>
                <div className="feature-list">
                  <div className="feature-item">○ User groups</div>
                  <div className="feature-item">○ Role-based access control</div>
                  <div className="feature-item">○ Group-based permissions</div>
                  <div className="feature-item">○ Dynamic group rules</div>
                </div>
              </div>

              <div className="feature-category">
                <h4>Advanced Security</h4>
                <div className="feature-list">
                  <div className="feature-item">○ Adaptive MFA (risk-based)</div>
                  <div className="feature-item">○ Device trust</div>
                  <div className="feature-item">○ IP restrictions</div>
                  <div className="feature-item">○ Session management</div>
                  <div className="feature-item">○ Passwordless authentication</div>
                </div>
              </div>

              <div className="feature-category">
                <h4>Customization</h4>
                <div className="feature-list">
                  <div className="feature-item">○ Custom email templates</div>
                  <div className="feature-item">○ Custom domains</div>
                  <div className="feature-item">○ Localization (40+ languages)</div>
                  <div className="feature-item">○ Custom branding</div>
                  <div className="feature-item">○ Progressive profiling</div>
                </div>
              </div>

              <div className="feature-category">
                <h4>Integration</h4>
                <div className="feature-list">
                  <div className="feature-item">○ Inline hooks (custom validation)</div>
                  <div className="feature-item">○ Event hooks (webhooks)</div>
                  <div className="feature-item">○ Workflows (automation)</div>
                  <div className="feature-item">○ API access management</div>
                </div>
              </div>
            </div>

            <div className="settings-card">
              <h3 className="card-title">📚 Documentation</h3>
              <p className="card-description">
                For complete customization guide, see <code>OKTA_CUSTOMIZATION_GUIDE.md</code> in the project root.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
