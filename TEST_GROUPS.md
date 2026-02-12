# Testing Group-Based Authorization

## Quick Visual Tests

### 1. Check Access Token (Easiest!)
1. Login to http://localhost:3000
2. Navigate to **Tokens** page
3. Scroll to **Access Token** section
4. View **Decoded Claims**
5. Look for the `groups` array in the JSON

Example of what you should see:
```json
{
  "ver": 1,
  "jti": "...",
  "iss": "https://your-domain.okta.com/oauth2/default",
  "aud": "api://default",
  "sub": "00u...",
  "iat": 1707689814,
  "exp": 1707693414,
  "cid": "...",
  "uid": "00u...",
  "scp": ["openid", "profile", "email"],
  "groups": [
    "Admins",
    "Developers",
    "Premium Users"
  ]
}
```

### 2. Check Profile Page
- Navigate to **Profile**
- Look for **"Group Membership"** in the Account Information section
- Groups display as badges: 👥 GroupName

### 3. Check Settings Page
- Navigate to **Settings**
- Check both **Profile** and **Security** tabs
- Both show your group memberships

---

## API Testing (Backend)

### Method 1: Using Browser DevTools

1. Login to the app
2. Open Browser DevTools (F12)
3. Go to **Console** tab
4. Run these commands:

```javascript
// Get your access token
const token = localStorage.getItem('okta-token-storage');
const tokenData = JSON.parse(token);
const accessToken = tokenData.accessToken.accessToken;

// Test 1: Get your groups
fetch('http://localhost:5000/api/groups/me', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
})
.then(r => r.json())
.then(data => console.log('My Groups:', data));

// Test 2: Check if you're an admin
fetch('http://localhost:5000/api/groups/check/Admins', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
})
.then(r => r.json())
.then(data => console.log('Admin Check:', data));

// Test 3: Access admin-only endpoint (requires Admins group)
fetch('http://localhost:5000/api/groups/admin-only', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
})
.then(r => r.json())
.then(data => console.log('Admin Endpoint:', data));

// Test 4: Access premium endpoint (requires Premium Users group)
fetch('http://localhost:5000/api/groups/premium-only', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
})
.then(r => r.json())
.then(data => console.log('Premium Endpoint:', data));
```

### Method 2: Using cURL (Command Line)

1. Get your access token:
   - Login to the app
   - Open DevTools > Application > Local Storage
   - Copy the access token value from `okta-token-storage`

2. Export it as an environment variable:
```bash
export ACCESS_TOKEN='your-token-here'
```

3. Run the test script:
```bash
./test-groups-api.sh
```

Or manually test endpoints:

```bash
# Get your groups
curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  http://localhost:5000/api/groups/me | jq

# Check admin membership
curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  http://localhost:5000/api/groups/check/Admins | jq

# Try admin-only endpoint
curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  http://localhost:5000/api/groups/admin-only | jq

# Try premium-only endpoint
curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  http://localhost:5000/api/groups/premium-only | jq
```

---

## Expected Results

### If you HAVE the required group:
```json
{
  "success": true,
  "message": "You have admin access!",
  "data": {
    "adminFeatures": [...]
  }
}
```

### If you DON'T have the required group:
```json
{
  "error": {
    "message": "Access denied. Required group membership: Admins",
    "code": "INSUFFICIENT_PERMISSIONS",
    "status": 403
  }
}
```

---

## Troubleshooting

### Groups not showing up?

1. **Check Okta Authorization Server:**
   - Go to Okta Admin Console
   - Security > API > Authorization Servers > default
   - Go to Claims tab
   - Verify there's a "groups" claim for access token

2. **Check User Group Assignment:**
   - Go to Directory > People
   - Click on your user
   - Go to Groups tab
   - Verify you're assigned to groups

3. **Check Token in Browser:**
   - Go to Tokens page in the app
   - Check if Access Token Decoded Claims contains `groups` field
   - If not, the groups claim is not configured properly

4. **Logout and Login Again:**
   - Sometimes you need to refresh your tokens
   - Logout and login to get new tokens with groups

---

## Server Logs

Backend logs show group authorization:

```
2026-02-11 23:03:34 [INFO]: Token validated successfully
  userId: "00u1234..."
  groupCount: 3
  groups: ["Admins", "Developers", "Premium Users"]
  requestId: "xyz"

2026-02-11 23:03:35 [INFO]: Group authorization successful
  userId: "00u1234..."
  matchedGroups: ["Admins"]
  requestId: "xyz"
```

Check the backend logs to see if groups are being extracted properly.
