import React, { useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { useNavigate } from 'react-router-dom';
import OktaSignInWidget from './OktaSignInWidget';
import oktaConfig from '../config/oktaConfig';
import './Home.css';

const Home = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const navigate = useNavigate();
  const [showWidget, setShowWidget] = useState(false);

  const handleLogin = async () => {
    setShowWidget(true);
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const onSuccess = (tokens) => {
    oktaAuth.handleLoginRedirect(tokens);
    setShowWidget(false);
  };

  const onError = (err) => {
    console.error('Sign in error:', err);
  };

  const widgetConfig = {
    ...oktaConfig,
    logo: '',
    i18n: {
      en: {
        'primaryauth.title': 'Sign In to Viper',
      },
    },
    authParams: {
      issuer: oktaConfig.issuer,
      scopes: oktaConfig.scopes,
    },
  };

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <div className="hero-section">
        <div
          className="hero-background"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1531386450638-969c8e5b1b2b?w=1920&q=80)'
          }}
        >
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <svg className="hero-viper-icon" width="120" height="120" viewBox="0 0 100 100" fill="none">
              <path d="M50 10 L30 30 L20 50 L30 70 L50 90 L70 70 L80 50 L70 30 Z" fill="#9acd32" stroke="#7cfc00" strokeWidth="2"/>
              <circle cx="40" cy="40" r="5" fill="#ffd700"/>
              <circle cx="60" cy="40" r="5" fill="#ffd700"/>
              <path d="M35 55 Q50 65 65 55" stroke="#0d1b0d" strokeWidth="3" fill="none"/>
            </svg>
            <h1 className="hero-main-title">
              VIPER
            </h1>
            <p className="hero-description">
              Strike with precision. Secure your identity.
            </p>
            {authState?.isAuthenticated ? (
              <button onClick={handleViewProfile} className="hero-button">
                View Profile →
              </button>
            ) : (
              <button onClick={handleLogin} className="hero-button">
                Sign In →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sign-In Widget Modal */}
      {!authState?.isAuthenticated && showWidget && (
        <>
          <div
            className="widget-overlay"
            onClick={() => setShowWidget(false)}
          />
          <div className="widget-wrapper">
            <button className="widget-close" onClick={() => setShowWidget(false)}>
              ×
            </button>
            <OktaSignInWidget
              config={widgetConfig}
              onSuccess={onSuccess}
              onError={onError}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
