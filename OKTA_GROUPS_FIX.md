# How to Add Groups to Access Token in Okta

## Problem
Groups are not appearing in the access token, causing `groupCount: 0` on the backend.

## Solution: Configure Okta Authorization Server

### Step 1: Access Authorization Server
1. Login to **Okta Admin Console** (https://jeacis.okta.com/admin)
2. Navigate to **Security** → **API**
3. Click on **Authorization Servers**
4. Click on **default** (or your custom authorization server)

### Step 2: Add Groups Claim to Access Token

1. Click on the **Claims** tab
2. Click **Add Claim** button
3. Fill in the following:

   **Claim Configuration:**
   - **Name**: `groups`
   - **Include in token type**: ✅ **Access Token** (IMPORTANT!)
   - **Value type**: Select **Groups**
   - **Filter**: Select **Matches regex** and enter: `.*`
     - This includes all groups. You can refine this later.
   - **Include in**: Select **Any scope**
     - Or specifically: `groups` scope if you want to require it
   - **Disable claim**: Leave unchecked

4. Click **Create**

### Step 3: Verify User Has Groups

1. Go to **Directory** → **People**
2. Click on your user
3. Click the **Groups** tab
4. Check if you're assigned to any groups
   - If not, click **Assign to Groups**
   - Assign yourself to groups like:
     - Everyone (default)
     - Admins
     - Developers
     - Premium Users

### Step 4: Test

1. **Logout** of the application (http://localhost:3000)
2. **Login** again to get a fresh token
3. Navigate to **Tokens** page
4. Check **Access Token** → **Decoded Claims**
5. You should now see:
   ```json
   {
     "groups": [
       "Everyone",
       "Admins"
     ],
     ...
   }
   ```

## Verification

After configuration, your access token should contain:

```json
{
  "ver": 1,
  "jti": "AT...",
  "iss": "https://jeacis.okta.com/oauth2/default",
  "aud": "api://default",
  "iat": 1707689814,
  "exp": 1707693414,
  "cid": "0oau1vofvenf0bvwy417",
  "uid": "00uu22900cMXAnk97417",
  "scp": [
    "openid",
    "profile",
    "email",
    "groups"
  ],
  "sub": "james@example.com",
  "groups": [
    "Everyone",
    "Admins",
    "Developers"
  ]
}
```

## Backend Logs Should Show:

```
Token validated successfully {"groupCount":3,"groups":["Everyone","Admins","Developers"]}
```

## Alternative: Use ID Token (Not Recommended)

If you want groups in the ID token instead (not recommended for authorization):

1. Go to **Claims** tab
2. Add claim with:
   - **Name**: `groups`
   - **Include in token type**: ✅ **ID Token** and ✅ **Always**
   - Rest same as above

**However, for API authorization, groups should be in the ACCESS TOKEN.**

## Common Issues

### Issue: "groups" scope not working
**Solution**: Use "Any scope" in the claim configuration instead of requiring specific scope.

### Issue: Still no groups after configuration
**Solution**:
- Clear browser cache and cookies
- Logout completely from Okta
- Close all browser tabs
- Open fresh browser window and login

### Issue: Groups claim exists but empty array
**Solution**: User is not assigned to any groups. Assign user to groups in Directory → People → [User] → Groups.

## Screenshots Would Help

If you're still having issues, these screenshots would help:
1. Okta Admin → Security → API → Authorization Servers → default → Claims tab
2. Okta Admin → Directory → People → [Your User] → Groups tab
3. Your app → Tokens page → Access Token decoded claims

---

**Need Help?**
- Okta Docs: https://developer.okta.com/docs/guides/customize-tokens-groups-claim/
- Make sure you're editing the "default" authorization server
- Make sure claim is added to ACCESS TOKEN, not just ID token
