# Okta React SPA - Setup Guide

## Overview
This is a React Single Page Application integrated with Okta authentication, featuring login/logout, protected routes, user profile display, and token management.

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Okta account with an application configured

## Okta Configuration

### Important: Configure Your Okta Application
Before running the app, ensure your Okta application has the following settings:

1. **Sign-in redirect URIs:**
   - `http://localhost:3000/login/callback`

2. **Sign-out redirect URIs:**
   - `http://localhost:3000`

3. **Trusted Origins:**
   - Origin URL: `http://localhost:3000`
   - Type: CORS and Redirect

4. **Grant Types:**
   - Authorization Code
   - Refresh Token (optional)

### Current Configuration
- **Okta Domain:** jeacis.okta.com
- **Client ID:** 0oau1vofvenf0bvwy417
- **Issuer:** https://jeacis.okta.com/oauth2/default
- **Redirect URI:** http://localhost:3000/login/callback
- **Post Logout Redirect URI:** http://localhost:3000

## Installation

1. Navigate to the project directory:
   ```bash
   cd okta-react-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

Start the development server:
```bash
npm start
```

The application will open automatically in your browser at `http://localhost:3000`

## Application Structure

```
okta-react-app/
├── src/
│   ├── config/
│   │   └── oktaConfig.js       # Okta configuration
│   ├── components/
│   │   ├── Navbar.js           # Navigation component
│   │   ├── Navbar.css
│   │   ├── Home.js             # Public home page
│   │   ├── Home.css
│   │   ├── Login.js            # Login page
│   │   ├── Login.css
│   │   ├── Profile.js          # Protected profile page
│   │   ├── Profile.css
│   │   ├── Tokens.js           # Protected tokens page
│   │   ├── Tokens.css
│   │   └── SecureRoute.js      # Route protection wrapper
│   ├── App.js                  # Main app with routing
│   ├── App.css                 # Global styles
│   └── index.js                # Entry point
└── public/
    └── index.html              # HTML template
```

## Features

### Authentication
- OAuth 2.0 with PKCE flow for enhanced security
- Secure token storage (not in localStorage)
- Automatic token renewal
- Login/Logout functionality

### Routes

#### Public Routes
- `/` - Home page (accessible to all)
- `/login` - Login page

#### Protected Routes (require authentication)
- `/profile` - User profile with claims display
- `/tokens` - Token management and inspection

### User Interface
- Modern dark theme with gradient backgrounds
- Responsive design for mobile and desktop
- Glass-morphism effects
- Clean, professional styling

## Testing the Application

### 1. Initial Access
1. Navigate to `http://localhost:3000`
2. You should see the home page with a login button

### 2. Login Flow
1. Click "Login" or "Login with Okta"
2. You'll be redirected to Okta's login page
3. Enter your Okta credentials
4. After successful authentication, you'll be redirected back to the app

### 3. Protected Routes
1. Once logged in, navigate to "Profile" to see your user information
2. Navigate to "Tokens" to view access tokens, ID tokens, and their claims
3. Try accessing `/profile` or `/tokens` while logged out - you'll be redirected to login

### 4. Logout
1. Click "Logout" in the navigation bar
2. You'll be signed out and redirected to the home page
3. Protected routes will no longer be accessible

## Token Information

### Access Token
- Used to access protected resources
- Contains scopes and permissions
- Short-lived (typically 1 hour)

### ID Token
- Contains user identity information (claims)
- Includes name, email, and other profile data
- Used for user authentication

### Refresh Token (if enabled)
- Used to obtain new access tokens
- Longer-lived than access tokens

## Security Features

- PKCE (Proof Key for Code Exchange) flow
- Secure token storage in memory
- Protected routes with authentication checks
- HTTPS enforcement in production
- CORS configuration

## Troubleshooting

### Login Redirect Issues
- Ensure `http://localhost:3000/login/callback` is added to your Okta app's redirect URIs
- Check that the Client ID matches your Okta application

### CORS Errors
- Add `http://localhost:3000` as a Trusted Origin in your Okta application settings
- Enable both CORS and Redirect for the trusted origin

### Token Not Available
- Check browser console for errors
- Verify scopes in `src/config/oktaConfig.js`
- Ensure your Okta app has the necessary grant types enabled

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version: `node --version` (should be 14+)

## Production Deployment

For production deployment:

1. Update `src/config/oktaConfig.js` with production URLs
2. Configure Okta application with production redirect URIs
3. Build the application:
   ```bash
   npm run build
   ```
4. Deploy the `build` folder to your hosting service

## Additional Commands

- `npm test` - Run tests
- `npm run build` - Create production build
- `npm run eject` - Eject from Create React App (irreversible)

## Support

For issues with:
- Okta configuration: Check [Okta Developer Documentation](https://developer.okta.com/)
- React issues: See [React Documentation](https://react.dev/)
- This application: Review the code comments and console logs
