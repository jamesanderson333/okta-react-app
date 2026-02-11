# Backend API Setup Guide

This guide covers the setup and usage of the Express backend API with Okta Management API integration.

## Overview

The backend provides REST API endpoints for user profile management, email updates, password changes, and custom metadata operations. All operations are secured with Okta OAuth 2.0 token validation.

## Prerequisites

1. Node.js (v14 or higher)
2. Okta developer account with admin access
3. Okta API token with appropriate permissions

## Installation

All dependencies have been installed as part of the main project setup. If needed, run:

```bash
npm install
```

## Configuration

### 1. Generate Okta API Token

1. Login to Okta Admin Console: https://jeacis-admin.okta.com
2. Navigate to: **Security → API → Tokens**
3. Click **Create Token**
4. Name: "Okta React App Backend"
5. Copy the token (shown only once)
6. Save it securely

**Required Scopes:**
- `okta.users.read` - Read user profiles
- `okta.users.manage` - Update users

### 2. Configure Environment Variables

The backend requires environment variables. A template file `server/.env` has been created with the following configuration:

```env
PORT=5000
NODE_ENV=development

# Okta Configuration
OKTA_DOMAIN=jeacis.okta.com
OKTA_AUTH_SERVER_ID=default
OKTA_CLIENT_ID=0oau1vofvenf0bvwy417
OKTA_API_TOKEN=your_api_token_here
OKTA_ISSUER=https://jeacis.okta.com/oauth2/default

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

**IMPORTANT:** Replace `your_api_token_here` with your actual Okta API token.

### 3. Configure Frontend API URL (Optional)

Create `.env.local` in the project root (optional, defaults to localhost:5000):

```env
REACT_APP_API_URL=http://localhost:5000
```

## Architecture

### Directory Structure

```
okta-react-app/
├── server/
│   ├── config/
│   │   ├── env.js              # Environment validation
│   │   └── okta.js             # Okta SDK initialization
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   ├── errorHandler.js    # Global error handling
│   │   └── requestValidator.js # Input validation
│   ├── routes/
│   │   └── user.js             # User API endpoints
│   ├── services/
│   │   ├── OktaUserService.js  # Okta API wrapper
│   │   ├── TokenService.js     # Token validation
│   │   └── UserProfileService.js # Business logic
│   ├── utils/
│   │   ├── errors.js           # Custom error classes
│   │   ├── validators.js       # Joi validation schemas
│   │   └── logger.js           # Winston logger
│   ├── .env                    # Environment variables
│   ├── .env.example            # Environment template
│   └── server.js               # Express app entry point
└── src/
    └── services/
        └── apiClient.js        # Frontend API client
```

### Request Flow

```
Frontend → Backend API → Okta Management API
    ↓         ↓               ↓
  Token    Validate        Update
  Sent     & Call          Profile
```

## API Endpoints

Base URL: `http://localhost:5000`

### Health Check
- **GET** `/api/health` - Server health status (no auth required)

### User Profile Endpoints (all require authentication)

- **GET** `/api/user/profile` - Get user profile
- **POST** `/api/user/email` - Update email address
- **PUT** `/api/user/profile` - Update profile fields
- **POST** `/api/user/password` - Change password
- **GET** `/api/user/metadata` - Get custom attributes
- **PUT** `/api/user/metadata` - Update custom attributes

### Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

The frontend automatically includes this token when making API calls.

## Running the Application

### Development Mode (Both Frontend + Backend)

```bash
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Backend Only

```bash
npm run server:dev
```

### Frontend Only

```bash
npm start
```

## Testing

### 1. Test Backend Health

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-11T18:57:24.612Z",
  "uptime": 3.032751792
}
```

### 2. Test Profile Endpoint (requires authentication)

1. Start both servers: `npm run dev`
2. Open browser to http://localhost:3000
3. Login with Okta credentials
4. Navigate to Profile page
5. Click "Edit" on email field
6. Enter new email and click "Save"
7. Verify success message appears

### 3. Test with curl (manual token)

First, get an access token from the frontend:
1. Login to the app
2. Open browser DevTools → Application → Local Storage
3. Find the Okta token storage
4. Copy the access token

Then test the API:

```bash
curl -H "Authorization: Bearer <your_token>" \
     http://localhost:5000/api/user/profile
```

## Security Features

1. **Token Validation**: Every request validates the Okta access token via introspection
2. **Token Caching**: Token validation results cached for 5 minutes to reduce API calls
3. **Rate Limiting**: 100 requests per 15 minutes per IP
4. **CORS**: Restricted to frontend origin only
5. **Helmet**: Security headers enabled
6. **Input Validation**: All inputs validated with Joi schemas
7. **Authorization**: Users can only modify their own profiles
8. **Logging**: All requests and errors logged with Winston

## Error Handling

The API returns consistent error responses:

```json
{
  "error": {
    "message": "User-friendly error message",
    "code": "ERROR_CODE",
    "status": 400
  }
}
```

Error codes:
- `VALIDATION_ERROR` (400) - Invalid input
- `AUTHENTICATION_ERROR` (401) - Invalid/expired token
- `AUTHORIZATION_ERROR` (403) - Not authorized
- `NOT_FOUND_ERROR` (404) - Resource not found
- `CONFLICT_ERROR` (409) - Email already exists
- `RATE_LIMIT_EXCEEDED` (429) - Too many requests
- `SERVER_ERROR` (500) - Internal error

## Logging

Logs include:
- Request details (method, path, request ID)
- Authentication events
- Profile updates
- Email changes
- Password changes
- Errors with stack traces (in development)

Log levels: error, warn, info, debug

## Troubleshooting

### Server won't start

**Error:** `EADDRINUSE: address already in use :::5000`

Solution: Kill the process using port 5000:
```bash
lsof -ti:5000 | xargs kill -9
```

**Error:** `Missing required environment variables`

Solution: Ensure `server/.env` file exists and has all required variables set.

### Authentication errors

**Error:** `No token provided` or `Token is not active`

Solutions:
1. Ensure you're logged in to the frontend
2. Check that the frontend is passing the Authorization header
3. Verify the Okta configuration is correct
4. Check that the access token hasn't expired

### Okta API errors

**Error:** `Failed to initialize Okta client`

Solutions:
1. Verify `OKTA_API_TOKEN` is set correctly in `server/.env`
2. Check that the API token hasn't expired
3. Verify the token has the required scopes

**Error:** `User not found` or `Email already exists`

Solutions:
1. Verify the user exists in Okta
2. Check the email isn't already taken by another user
3. Review Okta admin console for user status

## Email Update Flow

When updating an email:

1. Frontend sends new email to backend
2. Backend validates the token and input
3. Backend calls Okta Management API
4. Okta updates the user's email and login fields
5. Backend returns success response
6. Frontend displays success message
7. Okta may send verification email (depending on settings)

**Note:** Email changes may require verification in Okta before taking effect.

## Next Steps

1. **Set up Okta API token** - Replace `your_api_token_here` in `server/.env`
2. **Test the integration** - Run `npm run dev` and test email update
3. **Implement additional features** - Add profile update, password change, etc.
4. **Production deployment** - Configure for production environment

## Development

### Adding New Endpoints

1. Create route handler in `server/routes/user.js`
2. Add validation schema in `server/utils/validators.js`
3. Implement service method in appropriate service file
4. Add frontend method in `src/services/apiClient.js`
5. Update component to use new API call

### Modifying Authentication

Token validation logic is in `server/middleware/auth.js`. Modify caching, introspection URL, or validation logic there.

### Changing Error Handling

Global error handler is in `server/middleware/errorHandler.js`. Custom error classes are in `server/utils/errors.js`.

## Support

For issues or questions:
1. Check the logs for error details
2. Verify environment configuration
3. Review Okta admin console
4. Check the browser DevTools Network tab for API errors
