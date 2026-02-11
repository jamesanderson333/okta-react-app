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
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <svg className="viper-icon" width="40" height="40" viewBox="0 0 100 100" fill="none">
            <path d="M50 10 L30 30 L20 50 L30 70 L50 90 L70 70 L80 50 L70 30 Z" fill="#9acd32" stroke="#7cfc00" strokeWidth="2"/>
            <circle cx="40" cy="40" r="5" fill="#ffd700"/>
            <circle cx="60" cy="40" r="5" fill="#ffd700"/>
            <path d="M35 55 Q50 65 65 55" stroke="#0d1b0d" strokeWidth="3" fill="none"/>
          </svg>
          <span className="logo-text">VIPER</span>
        </Link>
        <ul className="navbar-menu">
          {authState?.isAuthenticated && (
            <>
              <li><Link to="/profile" className="navbar-link">PROFILE</Link></li>
              <li><Link to="/tokens" className="navbar-link">TOKENS</Link></li>
            </>
          )}
        </ul>
        <div className="navbar-auth">
          {authState?.isAuthenticated ? (
            <>
              <span className="navbar-user">
                {authState.idToken?.claims.name || authState.idToken?.claims.email}
              </span>
              <button onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            </>
          ) : (
            <button onClick={handleLogin} className="navbar-button">
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
