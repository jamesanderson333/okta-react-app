import React from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { authState, oktaAuth } = useOktaAuth();

  const handleLogin = async () => {
    await oktaAuth.signInWithRedirect();
  };

  const handleLogout = async () => {
    await oktaAuth.signOut();
  };

  return (
    <>
      {/* Utility Navigation */}
      <div className="utility-nav">
        <div className="utility-container">
          <div className="utility-links">
            <Link to="/profile" className="utility-link">Documentation</Link>
            <Link to="/tokens" className="utility-link">Pricing</Link>
            <a href="#support" className="utility-link">Support</a>
          </div>
          <div className="utility-auth">
            {authState?.isAuthenticated ? (
              <>
                <span className="utility-user">
                  {authState.idToken?.claims.name || authState.idToken?.claims.email}
                </span>
                <button onClick={handleLogout} className="utility-button">
                  Logout
                </button>
              </>
            ) : (
              <button onClick={handleLogin} className="utility-button">
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <span className="logo-text">OKTA</span>
          </Link>
          <ul className="navbar-menu">
            <li><Link to="/" className="navbar-link">PRODUCTS</Link></li>
            <li><Link to="/" className="navbar-link">SOLUTIONS</Link></li>
            <li><Link to="/" className="navbar-link">DEVELOPERS</Link></li>
            {authState?.isAuthenticated && (
              <>
                <li><Link to="/profile" className="navbar-link">PROFILE</Link></li>
                <li><Link to="/tokens" className="navbar-link">TOKENS</Link></li>
              </>
            )}
          </ul>
          <button className="navbar-search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
