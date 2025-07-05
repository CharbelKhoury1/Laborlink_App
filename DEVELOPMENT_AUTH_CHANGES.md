# 🚨 DEVELOPMENT MODE: Authentication Disabled

## ⚠️ CRITICAL: This is for development purposes only!

All authentication and authorization checks have been temporarily disabled to allow unrestricted access during development and testing.

## 📝 Changes Made

### 1. **hooks/useAuth.ts**
- Added `DEV_MODE_SKIP_AUTH = true` flag
- Mock user automatically logged in on app start
- Login/register functions bypass actual authentication
- Logout function simplified for development

**Key Changes:**
```typescript
const DEV_MODE_SKIP_AUTH = true;
const DEV_MOCK_USER: User = {
  id: 'dev-user-123',
  name: 'Development User',
  email: 'dev@workconnect.com',
  userType: 'worker', // Change to 'client' to test client features
  // ... other properties
};
```

### 2. **app/_layout.tsx**
- Added `DEV_MODE_SKIP_AUTH_NAVIGATION = true` flag
- Always navigates to tabs, skips auth screen
- Added development mode indicators in loading screens

**Key Changes:**
```typescript
const DEV_MODE_SKIP_AUTH_NAVIGATION = true;
// Always navigate to tabs in dev mode
if (DEV_MODE_SKIP_AUTH_NAVIGATION) {
  router.replace('/(tabs)');
}
```

### 3. **app/(tabs)/jobs/[id].tsx**
- Added `DEV_MODE_SKIP_USER_TYPE_CHECKS = true` flag
- All users can apply for jobs regardless of user type
- Added development mode indicator banner

**Key Changes:**
```typescript
const DEV_MODE_SKIP_USER_TYPE_CHECKS = true;
const shouldShowApplyButton = DEV_MODE_SKIP_USER_TYPE_CHECKS || user?.userType === 'worker';
```

### 4. **app/(tabs)/jobs/post.tsx**
- Added `DEV_MODE_SKIP_USER_TYPE_CHECKS = true` flag
- All users can post jobs regardless of user type
- Added development mode indicator banner

## 🔧 How to Use

### Testing Different User Types
1. **To test as Worker**: Set `userType: 'worker'` in `DEV_MOCK_USER`
2. **To test as Client**: Set `userType: 'client'` in `DEV_MOCK_USER`

### Testing Authentication Flows
- Login/register forms will work but bypass actual validation
- All authentication calls return success immediately
- User data is mocked but realistic

### Visual Indicators
- Development mode banners appear on relevant screens
- Console logs show "⚠️ DEVELOPMENT MODE" messages
- Loading screens display "🚨 Development Mode Active"

## 🔒 Restoring Authentication (IMPORTANT!)

Before production deployment, you MUST:

### 1. **Set all flags to `false`:**
```typescript
// hooks/useAuth.ts
const DEV_MODE_SKIP_AUTH = false;

// app/_layout.tsx
const DEV_MODE_SKIP_AUTH_NAVIGATION = false;

// app/(tabs)/jobs/[id].tsx
const DEV_MODE_SKIP_USER_TYPE_CHECKS = false;

// app/(tabs)/jobs/post.tsx
const DEV_MODE_SKIP_USER_TYPE_CHECKS = false;
```

### 2. **Uncomment production code blocks:**
Look for comments like:
```typescript
// 🔒 PRODUCTION CODE: Normal authentication flow (currently disabled)
/*
[uncomment this code]
*/
```

### 3. **Remove development indicators:**
- Remove all `devModeIndicator` components
- Remove development mode console logs
- Remove development mode text from loading screens

### 4. **Test thoroughly:**
- Verify authentication works correctly
- Test user type restrictions
- Ensure proper navigation flows
- Check error handling

## 📋 Testing Checklist

### ✅ Features to Test
- [ ] Home screen loads for both user types
- [ ] Job browsing works for workers
- [ ] Job posting works for clients (in dev mode, works for all)
- [ ] Job application works for workers (in dev mode, works for all)
- [ ] Profile screens display correctly
- [ ] Messages functionality
- [ ] Navigation between all screens

### ✅ User Type Testing
- [ ] Test with `userType: 'worker'`
- [ ] Test with `userType: 'client'`
- [ ] Verify different UI elements show/hide correctly
- [ ] Check tab content differs appropriately

## 🚨 Security Reminders

1. **Never deploy with dev flags enabled**
2. **Always test authentication before production**
3. **Verify user type restrictions work correctly**
4. **Check all protected routes require authentication**
5. **Ensure sensitive data is properly protected**

---

**Created**: December 2024  
**Purpose**: Development testing only  
**Status**: 🚨 TEMPORARY - Must be removed before production  
**Next Action**: Restore authentication before deployment