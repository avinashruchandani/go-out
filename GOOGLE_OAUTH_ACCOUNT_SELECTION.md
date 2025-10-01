# Google OAuth Account Selection

## Issue
After signing out, Google would automatically sign the user back in with the previous account without showing the account chooser.

---

## Solution
Added `prompt: 'select_account'` parameter to force Google to show the account selection screen every time.

---

## What Changed

### Before:
```typescript
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
  },
})
```

**Behavior:**
- Google remembers the last signed-in account
- Automatically signs user back in
- No account chooser shown

### After:
```typescript
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    queryParams: {
      access_type: 'offline',
      prompt: 'select_account', // ✅ Forces account selection
    },
  },
})
```

**Behavior:**
- ✅ Shows Google account chooser every time
- ✅ User can select which account to use
- ✅ Can sign in with different accounts
- ✅ Better for multi-account users

---

## Google OAuth `prompt` Parameter

### Available Values:

#### `prompt: 'select_account'` ✅ (What we're using)
- **Forces account selection** every time
- User sees list of Google accounts
- Can choose different account each time
- **Best for:** Apps where users might have multiple accounts

#### `prompt: 'consent'`
- Forces consent screen every time
- User must approve permissions again
- **Best for:** When you need to re-verify scopes

#### `prompt: 'none'`
- Silent authentication
- No UI shown
- Fails if user needs to interact
- **Best for:** Background re-authentication

#### `prompt: 'login'`
- Forces user to enter credentials
- Even if already logged in to Google
- **Best for:** High-security apps

---

## Additional Parameter: `access_type: 'offline'`

**What it does:**
- Requests a refresh token from Google
- Allows app to access Google services when user is offline
- Good practice for OAuth integrations

**Why included:**
- Better long-term session management
- Enables background token refresh
- Standard OAuth best practice

---

## User Flow

### Before (Without `prompt`):

```
1. User clicks "Sign in with Google"
   ↓
2. Google checks if user is logged in
   ↓
3. If logged in → Auto-signs in with same account ❌
   ↓
4. Redirects back to app
```

**Problem:** No way to switch accounts without signing out of Google itself.

### After (With `prompt: 'select_account'`):

```
1. User clicks "Sign in with Google"
   ↓
2. Google shows account chooser ✅
   ↓
3. User selects account:
   - Previous account
   - Different Google account
   - "Use another account"
   ↓
4. Redirects back to app
```

**Benefit:** User has full control over which account to use.

---

## Testing

### Test the Account Selection:

1. **Sign out** from the app
2. Click **"Sign in with Google"**
3. **Should see:** Google account chooser screen
4. **Options shown:**
   - Your previous account
   - Other Google accounts (if signed in)
   - "Use another account" option

### Expected Screen:
```
┌─────────────────────────────┐
│   Choose an account         │
│                             │
│  ○ john@gmail.com          │
│     John Doe                │
│                             │
│  ○ jane@gmail.com          │
│     Jane Smith              │
│                             │
│  + Use another account      │
└─────────────────────────────┘
```

---

## When to Use Different `prompt` Values

### Use Case Scenarios:

#### Multi-Account Support (Our Case) ✅
```typescript
prompt: 'select_account'
```
**When:** Users might have work/personal Google accounts

#### High Security Apps
```typescript
prompt: 'login'
```
**When:** Banking, healthcare, sensitive data

#### Scope Changes
```typescript
prompt: 'consent'
```
**When:** You've added new OAuth scopes

#### Silent Re-auth
```typescript
prompt: 'none'
```
**When:** Background token refresh

---

## Mobile Responsiveness Bonus

Also updated the login page with responsive padding:

```typescript
// Before
className="p-24"  // 96px everywhere

// After  
className="p-4 sm:p-8 md:p-12 lg:p-24"
```

**Benefits:**
- Mobile: 16px padding (more content space)
- Tablet: 32-48px padding
- Desktop: 96px padding
- Consistent with profile & favorites pages

---

## Security Considerations

### Is `select_account` Secure?

**Yes!** ✅

- User still needs to authenticate with Google
- Doesn't bypass Google's security
- Just changes which UI is shown
- Standard OAuth practice

### Best Practices:

1. ✅ **Use HTTPS** in production
2. ✅ **Validate redirect URLs** (already done in Supabase)
3. ✅ **Short session timeouts** if needed
4. ✅ **PKCE flow** (Supabase handles this)

---

## Alternative Approaches

### Option 1: Sign out from Google too (Not recommended)
```typescript
// Sign out from both app AND Google
window.location.href = 'https://accounts.google.com/Logout';
```

**Pros:** Complete logout  
**Cons:** Logs user out of ALL Google services (Gmail, YouTube, etc.)

### Option 2: Custom account switcher (Complex)
Build your own account management system.

**Pros:** Full control  
**Cons:** Much more complex, reinventing the wheel

### Option 3: Our approach ✅ (Recommended)
Use Google's built-in account chooser.

**Pros:** 
- Simple
- Familiar UX
- Maintained by Google
- Standard OAuth pattern

---

## Common Issues

### Issue: Still auto-signs in
**Check:**
- Clear browser cookies
- Try incognito mode
- Verify code deployed
- Hard refresh page

### Issue: Consent screen appears every time
**Cause:** Using `prompt: 'consent'` instead of `'select_account'`
**Fix:** Change to `'select_account'`

### Issue: Login fails silently
**Cause:** Using `prompt: 'none'` when user needs to interact
**Fix:** Use `'select_account'` or remove prompt parameter

---

## Documentation

### Google OAuth Prompt Parameter
- Docs: https://developers.google.com/identity/protocols/oauth2/web-server#creatingclient
- Values: `none`, `consent`, `select_account`, `login`

### Supabase Auth with OAuth
- Docs: https://supabase.com/docs/guides/auth/social-login/auth-google
- Support for custom query parameters

---

## Summary

### Changes Made:
1. ✅ Added `prompt: 'select_account'` to Google OAuth
2. ✅ Added `access_type: 'offline'` for better token management
3. ✅ Made login page mobile-responsive
4. ✅ Consistent padding with other pages

### User Experience:
- **Before:** Auto-signed in with previous account ❌
- **After:** Shows account chooser every time ✅

### Benefits:
- Better multi-account support
- User control over which account to use
- Standard OAuth UX
- Mobile-friendly design

---

## Next Steps (Optional)

### Potential Enhancements:

1. **Remember Last Account (Advanced)**
   - Store user preference
   - Auto-select (but still show chooser)
   - Requires custom implementation

2. **Account Switching Without Logout**
   - Add "Switch Account" button in profile
   - Trigger new OAuth flow
   - Link multiple accounts

3. **Social Login Options**
   - Add GitHub, Microsoft, etc.
   - Give users more choices
   - Same `prompt` parameter applies

---

Perfect! Users now have full control over account selection! 🎉
