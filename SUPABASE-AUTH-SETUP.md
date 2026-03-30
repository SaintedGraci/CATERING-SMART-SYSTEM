# Supabase Auth Setup - Complete Guide

## Overview
This guide will help you set up Supabase Authentication with JWT tokens for secure admin login.

---

## Step-by-Step Setup

### Step 1: Run Database Migration

1. Open **Supabase Dashboard** → Your Project
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste from `supabase/setup_complete.sql`
5. Click **Run** (Ctrl+Enter)

This creates:
- ✅ `user_profiles` table (extends Supabase auth)
- ✅ Security policies
- ✅ Auto-trigger for new users

---

### Step 2: Create Admin User in Supabase Auth

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **Add User** (green button, top right)
3. Fill in the form:
   ```
   Email: admin@catersmart.com
   Password: admin123
   Auto Confirm User: ✅ YES (check this box!)
   ```
4. Click **Create User**

---

### Step 3: Set Admin Role

1. Still in Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Run this SQL:

```sql
-- Set the user as admin
UPDATE user_profiles 
SET 
  role = 'admin',
  first_name = 'Admin',
  last_name = 'User'
WHERE id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'admin@catersmart.com'
);

-- Verify it worked
SELECT 
  up.id,
  au.email,
  up.first_name,
  up.last_name,
  up.role,
  up.created_at
FROM user_profiles up
JOIN auth.users au ON au.id = up.id
WHERE au.email = 'admin@catersmart.com';
```

You should see your admin user with role = 'admin'!

---

### Step 4: Test Login

1. Make sure dev server is running: `npm run dev`
2. Go to: **http://localhost:3001/admin/login**
3. Enter credentials:
   ```
   Email: admin@catersmart.com
   Password: admin123
   ```
4. Click **Sign in**
5. You should be redirected to the admin dashboard!

---

## How It Works

### Authentication Flow

1. **User enters credentials** → Admin login page
2. **Supabase Auth validates** → Checks email/password
3. **JWT token issued** → Stored in httpOnly cookie
4. **Role verification** → Checks `user_profiles.role = 'admin'`
5. **Access granted** → Redirects to dashboard

### Security Features

✅ **JWT Tokens** - Secure, signed tokens
✅ **httpOnly Cookies** - Protected from XSS attacks
✅ **Row Level Security** - Database-level protection
✅ **Role-based Access** - Admin-only routes
✅ **Session Management** - Automatic token refresh
✅ **Secure Sign Out** - Properly clears session

### Database Structure

```
auth.users (Supabase managed)
├── id (UUID)
├── email
├── encrypted_password
└── ...

user_profiles (Your table)
├── id (references auth.users.id)
├── first_name
├── last_name
├── role (customer | admin | staff)
└── ...
```

---

## Troubleshooting

### "Invalid login credentials"
**Cause:** Email or password is wrong
**Fix:** 
- Double-check email: `admin@catersmart.com`
- Double-check password: `admin123`
- Make sure you clicked "Auto Confirm User" when creating

### "Access denied. Admin privileges required"
**Cause:** User exists but role is not 'admin'
**Fix:** Run the UPDATE SQL from Step 3 again

### "Unable to verify admin access"
**Cause:** `user_profiles` table doesn't exist or user profile not created
**Fix:** 
1. Run the migration SQL from Step 1
2. Check if profile exists:
```sql
SELECT * FROM user_profiles 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@catersmart.com');
```

### User profile not created automatically
**Cause:** Trigger didn't fire (user created before trigger)
**Fix:** Manually create profile:
```sql
INSERT INTO user_profiles (id, first_name, last_name, role)
SELECT id, 'Admin', 'User', 'admin'
FROM auth.users
WHERE email = 'admin@catersmart.com'
ON CONFLICT (id) DO NOTHING;
```

### Session not persisting
**Cause:** Cookies not working
**Fix:**
- Check browser allows cookies
- Try incognito mode
- Clear browser cache

---

## Verify Everything Works

### Check 1: User Exists in Auth
```sql
SELECT id, email, created_at, confirmed_at
FROM auth.users
WHERE email = 'admin@catersmart.com';
```

### Check 2: Profile Exists
```sql
SELECT * FROM user_profiles
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@catersmart.com');
```

### Check 3: Role is Admin
```sql
SELECT role FROM user_profiles
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@catersmart.com');
```
Should return: `admin`

---

## Next Steps

Once admin login works:

1. ✅ Create more admin users
2. ✅ Implement password reset
3. ✅ Add 2FA (optional)
4. ✅ Build admin features
5. ✅ Add customer authentication

---

## Security Best Practices

### For Production:

1. **Change default password** immediately
2. **Use strong passwords** (16+ characters, mixed case, numbers, symbols)
3. **Enable email verification** for all users
4. **Set up password reset** flow
5. **Implement rate limiting** on login attempts
6. **Add audit logging** for admin actions
7. **Use environment-specific credentials**
8. **Enable 2FA** for admin accounts

### Environment Variables

Make sure these are set in `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

---

## Additional Features to Add

- [ ] Password reset via email
- [ ] Email verification for new users
- [ ] 2FA with TOTP
- [ ] Session timeout
- [ ] Login attempt tracking
- [ ] IP-based restrictions
- [ ] Admin user management UI
- [ ] Role management (admin, staff, manager)

---

**Status:** Ready to create admin account with Supabase Auth + JWT!
**Security:** Production-ready authentication
**Time:** ~5 minutes
