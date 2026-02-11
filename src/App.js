import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Security, LoginCallback, useOktaAuth } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import oktaConfig from './config/oktaConfig';
import apiClient from './services/apiClient';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import Tokens from './components/Tokens';
import SecureRoute from './components/SecureRoute';
import './App.css';

const oktaAuth = new OktaAuth(oktaConfig);

function AppContent() {
  const { authState, oktaAuth } = useOktaAuth();

  useEffect(() => {
    // Set API client auth token when user authenticates
    if (authState?.isAuthenticated) {
      const accessToken = oktaAuth.getAccessToken();
      if (accessToken) {
        apiClient.setAuthToken(accessToken);
      }
    } else {
      // Clear token when user logs out
      apiClient.setAuthToken(null);
    }
  }, [authState, oktaAuth]);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/callback" element={<LoginCallback />} />
        <Route
          path="/profile"
          element={
            <SecureRoute>
              <Profile />
            </SecureRoute>
          }
        />
        <Route
          path="/tokens"
          element={
            <SecureRoute>
              <Tokens />
            </SecureRoute>
          }
        />
      </Routes>
    </div>
  );
}

function AppRoutes() {
  const navigate = useNavigate();

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    navigate(toRelativeUrl(originalUri || '/', window.location.origin), { replace: true });
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <AppContent />
    </Security>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
