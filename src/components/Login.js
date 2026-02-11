import React, { useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authState?.isAuthenticated) {
      navigate('/profile');
    }
  }, [authState, navigate]);

  const handleLogin = async () => {
    await oktaAuth.signInWithRedirect();
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login</h1>
        <p className="login-description">
          Sign in with your Okta credentials to access your account
        </p>
        <button onClick={handleLogin} className="login-button">
          Sign In with Okta
        </button>
      </div>
    </div>
  );
};

export default Login;
