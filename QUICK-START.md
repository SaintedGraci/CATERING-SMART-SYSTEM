# Quick Start Guide - Create Admin Account

## Prerequisites Checklist

- ✅ Supabase project created
- ✅ `.env` file updated with Supabase credentials
- ✅ Dependencies installed (`npm install`)

## Option 1: Using Supabase Dashboard (Recommended)

### Step 1: Create Users Table

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy the entire content from:
   ```
   supabase/migrations/20240331000001_create_users_table.sql
   ```
6. Paste it into the SQL Editor
7. Click **Run** (or press `Ctrl+Enter`)
8. You should see: "Success. No rows returned"

### Step 2: Create Admin User

1. Still in **SQL Editor**
2. Click **New Query**
3. Run this SQL:

```sql
-- Create admin user with hashed password
INSERT INTO users (
  email,
  password_hash,
  first_name,
  last_name,
  phone,
  role,
  email_verified
) VALUES (
  'admin@catersmart.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Admin',
  'User',
  '+1234567890',
  'admin',
  true
);
```

4. Click **Run**
5. You should see: "Success. 1 rows affected"

### Step 3: Verify Admin Was Created

Run this query:
```sql
SELECT id, email, first_name, last_name, role, created_at 
FROM users 
WHERE email = 'admin@catersmart.com';
```

You should see your admin user!

### Step 4: Test Login

1. Make sure your dev server is running: `npm run dev`
2. Go to: `http://localhost:3001/admin/login`
3. Login with:
   - **Email:** admin@catersmart.com
   - **Password:** admin123
4. You should be redirected to the admin dashboard!

---

## Option 2: Using Script (Alternative)

### Step 1: Install tsx
```bash
npm install -D tsx
```

### Step 2: Run the Script
```bash
npx tsx scripts/create-admin.ts
```

This will:
- Connect to your Supabase database
- Hash the password securely
- Create the admin user
- Display the credentials

---

## What You Get

### Admin Credentials
```
Email: admin@catersmart.com
Password: admin123
```

### Admin Access
- **Login:** http://localhost:3001/admin/login
- **Dashboard:** http://localhost:3001/admin/dashboard

### Admin Features
- View dashboard statistics
- Manage orders (placeholder)
- Manage packages (placeholder)
- Manage menu items (placeholder)
- Logout functionality

---

## Troubleshooting

### "relation 'users' does not exist"
**Solution:** Run the migration SQL first (Step 1)

### "duplicate key value violates unique constraint"
**Solution:** Admin already exists! Just use the credentials to login.

### "Invalid API key"
**Solution:** 
1. Check your `.env` file has correct Supabase credentials
2. Make sure variable names are exact (case-sensitive)
3. Restart dev server: Stop (Ctrl+C) and run `npm run dev`

### Environment variables not loading
**Solution:**
1. Make sure file is named `.env` or `.env.local`
2. Restart dev server
3. Check for typos in variable names

### Can't connect to Supabase
**Solution:**
1. Verify your Supabase project is active
2. Check your internet connection
3. Verify credentials are correct in Supabase Dashboard

---

## Next Steps After Admin Setup

Once your admin account is working:

1. **Create More Tables**
   - Run other migrations from `DATABASE-SCHEMA.md`
   - Create tables for packages, menu items, orders, etc.

2. **Build Admin Features**
   - Implement order management
   - Create package CRUD operations
   - Add menu item management

3. **Implement Real Authentication**
   - Replace localStorage with JWT tokens
   - Add session management
   - Implement password reset

4. **Add More Admin Users**
   - Create admin user management page
   - Allow creating staff accounts
   - Implement role-based permissions

---

## Security Reminder

⚠️ **For Production:**
- Change default admin password
- Use strong passwords (16+ characters)
- Enable 2FA
- Use environment-specific credentials
- Implement rate limiting
- Add audit logging
- Never commit `.env` files

---

**Status:** Ready to create your first admin account!
**Time Required:** ~5 minutes
**Difficulty:** Easy
