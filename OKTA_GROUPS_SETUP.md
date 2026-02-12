# Setting Up Group Claims in Okta

## Overview
This guide shows you how to include user groups in ID tokens and use them for authorization in your application.

---

## Step 1: Create Groups in Okta

1. Log in to your Okta Admin Console (https://jeacis-admin.okta.com)
2. Navigate to **Directory** → **Groups**
3. Click **Add Group**
4. Create groups such as:
   - **Admins** - Full access administrators
   - **Premium Users** - Enhanced access users
   - **Beta Testers** - Early access to features
   - **Support Staff** - Customer support team
   - **Developers** - Developer access
   - **VIP Members** - VIP tier users

5. Click **Save** for each group

---

## Step 2: Assign Users to Groups

### Option A: Manual Assignment
1. Go to **Directory** → **Groups**
2. Click on a group
3. Click **Assign people**
4. Select users to add to the group
5. Click **Save**

### Option B: Via User Profile
1. Go to **Directory** → **People**
2. Click on a user
3. Go to **Groups** tab
4. Click **Assign to Groups**
5. Select groups and click **Save**

---

## Step 3: Add Groups Claim to ID Token

1. In Okta Admin Console, go to **Security** → **API**
2. Click on your **Authorization Server** (usually "default")
3. Go to the **Claims** tab
4. Click **Add Claim**
5. Configure the groups claim:

### Option A: All Groups (Recommended for small apps)
- **Name:** `groups`
- **Include in token type:** ID Token, Always
- **Value type:** Groups
- **Filter:** Matches regex: `.*` (all groups)
- **Include in:** Any scope

### Option B: Specific Groups Filter
- **Name:** `groups`
- **Include in token type:** ID Token, Always
- **Value type:** Groups
- **Filter:** Starts with: `app_` (only groups starting with app_)
- **Include in:** Any scope

### Option C: Groups as Array of Names
- **Name:** `groups`
- **Include in token type:** ID Token, Always
- **Value type:** Expression
- **Value:** `Groups.startsWith("app", "", 10)` (first 10 groups starting with "app")
- **Include in:** Any scope

6. Click **Create**

---

## Step 4: Test the Integration

1. Assign your user to one or more groups
2. **Log out completely** from the application
3. **Clear browser cache and cookies** (important!)
4. **Log back in** to get fresh tokens with group claims
5. Navigate to http://localhost:3000/tokens
6. Look for the `groups` field in your ID Token
7. You should see an array of group names like: `["Admins", "Premium Users"]`

---

## Step 5: Use Groups in Your Application

### In React Components
Groups are automatically available in your token claims:

```javascript
const claims = authState.idToken?.claims || {};
const userGroups = claims.groups || [];

// Check if user is admin
const isAdmin = userGroups.includes('Admins');

// Check if user is in multiple groups
const isPremium = userGroups.some(g =>
  ['Premium Users', 'VIP Members'].includes(g)
);
```

### In Backend (Already Available)
Groups are in the verified token and accessible via `req.user`:

```javascript
// In any authenticated route
const userGroups = req.user.groups || [];
const isAdmin = userGroups.includes('Admins');
```

---

## Common Use Cases

### 1. Admin-Only Features
```javascript
const isAdmin = claims.groups?.includes('Admins');

{isAdmin && (
  <button onClick={handleAdminAction}>Admin Panel</button>
)}
```

### 2. Premium Features
```javascript
const isPremium = claims.groups?.some(g =>
  ['Premium Users', 'Gold Members'].includes(g)
);

{isPremium && (
  <div className="premium-feature">
    {/* Premium content */}
  </div>
)}
```

### 3. Role-Based Navigation
```javascript
const isSupport = claims.groups?.includes('Support Staff');
const isAdmin = claims.groups?.includes('Admins');

<ul>
  {isAdmin && <li><Link to="/admin">Admin</Link></li>}
  {isSupport && <li><Link to="/support">Support</Link></li>}
</ul>
```

### 4. Backend Authorization
```javascript
// Middleware to check for admin group
const requireAdmin = (req, res, next) => {
  const userGroups = req.user.groups || [];

  if (!userGroups.includes('Admins')) {
    return res.status(403).json({
      error: 'Admin access required'
    });
  }

  next();
};

// Use in routes
router.delete('/api/admin/users/:id', requireAdmin, deleteUser);
```

---

## Troubleshooting

### Groups Not Showing in Token

1. **Check token at /tokens page**
   - If `groups` field is missing, the claim wasn't configured

2. **Verify claim configuration**
   - Go to Security → API → Authorization Server → Claims
   - Confirm groups claim exists and is set to "Always"

3. **Check user group membership**
   - Go to Directory → People → [Your User] → Groups
   - Confirm you're assigned to groups

4. **Clear tokens and re-login**
   - Log out completely
   - Clear browser data
   - Log back in to get fresh tokens

### Groups Appear as IDs Instead of Names

If you see group IDs (like `00g...`) instead of names:
- Change the claim **Value type** to "Groups"
- Or use expression: `Groups.startsWith("", "", 100)` for group names

### Too Many Groups

If you have many groups, they might not all fit in the token:
- Use filter to include only relevant groups
- Example: `Groups.startsWith("app_", "", 10)`
- This includes only groups starting with "app_" (max 10)

---

## Dynamic Group Rules

Okta supports dynamic groups that auto-assign users based on rules:

### Example: Auto-assign Premium Members
1. Create a new group "Premium Members"
2. Set it as a dynamic group
3. Add rule: `user.membership == "Gold" OR user.membership == "Platinum"`
4. Users automatically join when they get Gold/Platinum membership

### Example: Auto-assign by Domain
1. Create group "Company Employees"
2. Set rule: `String.stringContains(user.email, "@yourcompany.com")`
3. All company email users automatically join

---

## Best Practices

1. **Use meaningful group names** - "Admins" not "group123"
2. **Prefix app-specific groups** - "myapp_admins" to avoid conflicts
3. **Limit groups in tokens** - Only include groups needed for authorization
4. **Use dynamic groups** - Automate group membership based on attributes
5. **Document group purposes** - Keep track of what each group controls
6. **Regular audits** - Review group memberships periodically

---

## Example Group Structure

### Recommended Groups for Your App:
- `VIPER_Admins` - Full system access
- `VIPER_Premium_Users` - Gold/Platinum members
- `VIPER_Beta_Testers` - Beta feature access
- `VIPER_Support_Staff` - Customer support access
- `VIPER_Developers` - Developer tools access
- `VIPER_VIP` - VIP department users

---

## Next Steps

1. **Create groups** in Okta Admin
2. **Add groups claim** to ID token
3. **Assign yourself** to test groups
4. **Log out and back in** to get new tokens
5. **Check tokens page** to see groups array
6. **View settings page** to see groups displayed
7. **Use groups** for authorization in your app

---

Your application is now ready to use group-based authorization! 🎉
