import React, { useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { useNavigate } from 'react-router-dom';
import OktaSignInWidget from './OktaSignInWidget';
import oktaConfig from '../config/oktaConfig';
import './Home.css';

const Home = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Authentication');
  const [showWidget, setShowWidget] = useState(true);

  const categories = [
    'Authentication',
    'Authorization',
    'User Management',
    'Security',
    'Integration'
  ];

  const oktaProducts = [
    {
      name: 'Single Sign-On',
      image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&q=80',
      description: 'Secure access to all apps',
      price: 'Starting at $2/user/month'
    },
    {
      name: 'Multi-Factor Auth',
      image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=600&q=80',
      description: 'Advanced security layers',
      price: 'Starting at $3/user/month'
    },
    {
      name: 'Universal Directory',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
      description: 'Centralized user profiles',
      price: 'Starting at $1/user/month'
    },
    {
      name: 'API Access Management',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
      description: 'Secure your APIs',
      price: 'Starting at $4/user/month'
    }
  ];

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
        'primaryauth.title': 'Sign In',
      },
    },
    authParams: {
      issuer: oktaConfig.issuer,
      scopes: oktaConfig.scopes,
    },
  };

  return (
    <div className="home-wrapper">
      {/* Promotional Banner */}
      <div className="promo-banner">
        Free 30-Day Trial · No Credit Card Required · Get Started Today
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div
          className="hero-background"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80)'
          }}
        >
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1 className="hero-main-title">
              ENTERPRISE IDENTITY:<br />
              SECURITY EDITION
            </h1>
            <p className="hero-description">
              A comprehensive platform for secure authentication, authorization,<br />
              and user management. Built for modern applications.
            </p>
            {authState?.isAuthenticated ? (
              <button onClick={handleViewProfile} className="hero-button">
                View Your Profile →
              </button>
            ) : (
              <button onClick={handleLogin} className="hero-button">
                Start Free Trial →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="category-navigation">
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-tab ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Okta Products Showcase */}
      <div className="bike-showcase">
        <div className="products-intro">
          <h2>Okta Identity Cloud Products</h2>
          <p>Choose the right solution for your organization's security needs</p>
        </div>
        <div className="bike-grid">
          {oktaProducts.map((product, index) => (
            <div key={index} className="bike-card">
              <div className="bike-image-wrapper">
                <img src={product.image} alt={product.name} className="bike-image" />
              </div>
              <div className="bike-info">
                <h3 className="bike-name">{product.name}</h3>
                <p className="bike-description">{product.description}</p>
                <p className="bike-price">{product.price}</p>
                <button className="bike-button">Learn More</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Features Section */}
      <div className="content-section">
        <div className="content-grid">
          <div className="content-card large">
            <div
              className="content-card-bg"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80)'
              }}
            >
              <div className="content-overlay"></div>
              <div className="content-text">
                <h2>ZERO TRUST SECURITY</h2>
                <p>Never trust, always verify. Built-in security at every layer</p>
                <button className="content-button">Explore Security →</button>
              </div>
            </div>
          </div>
          <div className="content-card">
            <div
              className="content-card-bg"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80)'
              }}
            >
              <div className="content-overlay"></div>
              <div className="content-text">
                <h3>USER LIFECYCLE</h3>
                <p>Automated provisioning & deprovisioning</p>
              </div>
            </div>
          </div>
          <div className="content-card">
            <div
              className="content-card-bg"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80)'
              }}
            >
              <div className="content-overlay"></div>
              <div className="content-text">
                <h3>ADAPTIVE MFA</h3>
                <p>Context-aware authentication</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Partners */}
      <div className="integrations-section">
        <h2 className="section-title">7,000+ Pre-Built Integrations</h2>
        <p className="section-subtitle">Connect Okta with your favorite apps and services</p>
        <div className="integrations-grid">
          <div className="integration-item">
            <div className="integration-icon">☁️</div>
            <h4>Salesforce</h4>
          </div>
          <div className="integration-item">
            <div className="integration-icon">💼</div>
            <h4>Microsoft 365</h4>
          </div>
          <div className="integration-item">
            <div className="integration-icon">🎯</div>
            <h4>Slack</h4>
          </div>
          <div className="integration-item">
            <div className="integration-icon">📊</div>
            <h4>Google Workspace</h4>
          </div>
          <div className="integration-item">
            <div className="integration-icon">⚡</div>
            <h4>AWS</h4>
          </div>
          <div className="integration-item">
            <div className="integration-icon">🔷</div>
            <h4>Azure</h4>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="key-features-section">
        <h2 className="section-title">Why Choose Okta?</h2>
        <div className="features-grid">
          <div className="feature-box">
            <div className="feature-icon">🔐</div>
            <h3>Enterprise-Grade Security</h3>
            <p>SOC 2 Type II, HIPAA, FedRAMP certified. Your data is protected with industry-leading security standards.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">⚡</div>
            <h3>99.99% Uptime SLA</h3>
            <p>Always available when you need it. Trusted by thousands of enterprises for mission-critical authentication.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">🌍</div>
            <h3>Global Scale</h3>
            <p>Billions of authentications daily. 15,000+ customers worldwide. Built to scale with your business.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">🚀</div>
            <h3>Fast Implementation</h3>
            <p>Get up and running in days, not months. Pre-built integrations and comprehensive documentation.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">🛡️</div>
            <h3>Passwordless Authentication</h3>
            <p>WebAuthn, biometrics, and magic links. Reduce friction while increasing security.</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">📱</div>
            <h3>Mobile-First Design</h3>
            <p>Seamless experience across all devices. Native SDKs for iOS and Android.</p>
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="pricing-section">
        <h2 className="section-title">Choose Your Plan</h2>
        <p className="section-subtitle">Flexible pricing that scales with your business</p>
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Developer</h3>
            <div className="price">
              <span className="currency">$</span>
              <span className="amount">0</span>
              <span className="period">/month</span>
            </div>
            <ul className="features-list">
              <li>✓ Up to 1,000 monthly active users</li>
              <li>✓ Social login</li>
              <li>✓ Basic MFA</li>
              <li>✓ Community support</li>
            </ul>
            <button className="pricing-button secondary">Start Free</button>
          </div>
          <div className="pricing-card featured">
            <div className="featured-badge">MOST POPULAR</div>
            <h3>Professional</h3>
            <div className="price">
              <span className="currency">$</span>
              <span className="amount">2</span>
              <span className="period">/user/month</span>
            </div>
            <ul className="features-list">
              <li>✓ Unlimited monthly active users</li>
              <li>✓ SSO integrations</li>
              <li>✓ Advanced MFA</li>
              <li>✓ 24/7 support</li>
              <li>✓ Custom branding</li>
            </ul>
            <button className="pricing-button primary">Start Trial</button>
          </div>
          <div className="pricing-card">
            <h3>Enterprise</h3>
            <div className="price">
              <span className="currency">$</span>
              <span className="amount">8</span>
              <span className="period">/user/month</span>
            </div>
            <ul className="features-list">
              <li>✓ Everything in Professional</li>
              <li>✓ Advanced security policies</li>
              <li>✓ Delegated authentication</li>
              <li>✓ Premium support</li>
              <li>✓ SLA guarantee</li>
            </ul>
            <button className="pricing-button secondary">Contact Sales</button>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="testimonials-section">
        <h2 className="section-title">Trusted by Industry Leaders</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="quote">"</div>
            <p>Okta reduced our login time by 80% and increased security. Best decision we made for our identity infrastructure.</p>
            <div className="testimonial-author">
              <strong>Sarah Johnson</strong>
              <span>CTO, TechCorp</span>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="quote">"</div>
            <p>The implementation was seamless. We had SSO running across 50+ apps in just two weeks.</p>
            <div className="testimonial-author">
              <strong>Michael Chen</strong>
              <span>IT Director, GlobalFinance</span>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="quote">"</div>
            <p>Okta's security features gave us the confidence to move to the cloud. Zero incidents in 3 years.</p>
            <div className="testimonial-author">
              <strong>Emily Rodriguez</strong>
              <span>CISO, HealthTech Solutions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-item">
          <div className="stat-number">15,000+</div>
          <div className="stat-label">Customers</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">7,000+</div>
          <div className="stat-label">Integrations</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">99.99%</div>
          <div className="stat-label">Uptime</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">25B+</div>
          <div className="stat-label">Auth/Month</div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of companies using Okta to secure their workforce and customers</p>
        <div className="cta-buttons">
          {authState?.isAuthenticated ? (
            <button onClick={handleViewProfile} className="cta-button primary">
              Go to Dashboard
            </button>
          ) : (
            <>
              <button onClick={handleLogin} className="cta-button primary">
                Start Free Trial
              </button>
              <button className="cta-button secondary">
                Schedule Demo
              </button>
            </>
          )}
        </div>
      </div>

      {/* Features Banner */}
      <div className="features-banner">
        <div className="feature-item">
          <h4>FREE 30-DAY TRIAL</h4>
          <p>No credit card required</p>
        </div>
        <div className="feature-item">
          <h4>24/7 SUPPORT</h4>
          <p>Always here to help</p>
        </div>
        <div className="feature-item">
          <h4>GDPR COMPLIANT</h4>
          <p>Your data is protected</p>
        </div>
      </div>

      {/* Okta Sign-In Widget - Fixed Sidebar - Always visible when not authenticated */}
      {!authState?.isAuthenticated && (
        <div className="widget-wrapper">
          <button className="widget-close" onClick={() => setShowWidget(false)}>
            ×
          </button>
          {showWidget && (
            <OktaSignInWidget
              config={widgetConfig}
              onSuccess={onSuccess}
              onError={onError}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
