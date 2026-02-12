# Group Display Test Checklist

## Current Status
✅ Backend configured to read groups from access token
✅ Frontend configured to display groups from `authState.accessToken.claims.groups`
✅ Groups scope added to Okta config
✅ Server logs show group count on token validation

## Test Steps

### 1. Logout and Login
- [ ] Click **Logout** button in the app
- [ ] Click **Login** button
- [ ] Complete the login flow

### 2. Check Tokens Page (MOST IMPORTANT)
- [ ] Navigate to **Tokens** page (http://localhost:3000/tokens)
- [ ] Scroll to **"Access Token"** section
- [ ] Click **"Decoded Claims"** to expand
- [ ] **Look for the `groups` field**

**Expected Result:**
```json
{
  "ver": 1,
  "jti": "...",
  "iss": "https://jeacis.okta.com/oauth2/default",
  "aud": "api://default",
  "sub": "00u...",
  "iat": 1707689814,
  "exp": 1707693414,
  "cid": "...",
  "uid": "00u...",
  "scp": ["openid", "profile", "email", "groups"],
  "groups": [
    "Everyone",
    "Admins",
    "Developers"
  ]
}
```

### 3. Check Profile Page
- [ ] Navigate to **Profile** page
- [ ] Scroll to **"Account Information"** section
- [ ] **Look for "Group Membership" row**

**Expected Result:**
- If groups exist in token → Shows badges like `👥 Admins` `👥 Developers`
- If no groups → Section doesn't appear

### 4. Check Settings Page
- [ ] Navigate to **Settings** page
- [ ] Click **"Profile"** tab
- [ ] Look for **"Group Memberships"** section

**Expected Result:**
- If groups exist → Shows group badges
- If no groups → Shows "You are not currently a member of any groups"

### 5. Check Backend Logs
After login, the server should log:
```
Token validated successfully {"groupCount":3,"groups":["Everyone","Admins","Developers"]}
```

## Troubleshooting

### If NO groups appear in Access Token (Tokens page):

**Cause:** Okta Authorization Server isn't configured to include groups

**Solution:**
1. Go to **Okta Admin Console**
2. Navigate to **Security** → **API** → **Authorization Servers**
3. Click **default**
4. Go to **Claims** tab
5. Check if there's a **"groups"** claim:
   - Name: `groups`
   - Include in token type: **Access Token**
   - Value type: **Groups**
   - Filter: Regex `.*`
   - Include in: **Any scope** (or specifically the "groups" scope)
6. If missing, click **Add Claim** and create it

### If groups appear in Tokens page but NOT in Profile/Settings:

**Cause:** Frontend code issue

**Solution:**
- Check browser console (F12) for errors
- Verify `authState.accessToken.claims.groups` exists

### If user has no groups assigned:

**Cause:** User isn't in any groups in Okta

**Solution:**
1. Go to **Okta Admin Console**
2. Navigate to **Directory** → **People**
3. Click on your user
4. Go to **Groups** tab
5. Click **Assign to Groups**
6. Assign user to desired groups (e.g., "Admins", "Developers")

## What to Report Back

After testing, please report:

1. ✅ or ❌ **Do you see groups in the Tokens page Access Token?**
2. ✅ or ❌ **Do you see "Group Membership" section in Profile?**
3. ✅ or ❌ **Do you see groups in Settings page?**
4. **What do the server logs show for groupCount?**

This will help diagnose exactly where the issue is.
