# Supabase Setup Guide

## Step-by-Step Setup

### 1. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJhbGc...`)
   - **service_role key** (starts with `eyJhbGc...`)

### 2. Update Your `.env` File

Open `catering-smart-system/.env` and replace:

```env
# Storage (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

With your actual values:

```env
# Storage (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Create the Users Table

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New Query**
3. Copy and paste the contents of `supabase/migrations/20240331000001_create_users_table.sql`
4. Click **Run** or press `Ctrl+Enter`

This will create:
- ✅ `users` table
- ✅ Indexes for performance
- ✅ Row Level Security policies
- ✅ Auto-update timestamp trigger

### 4. Create Your First Admin Account

1. Still in **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `supabase/seed_admin.sql`
4. Click **Run**

This creates an admin user:
- **Email:** admin@catersmart.com
- **Password:** admin123
- **Role:** admin

### 5. Install Supabase Dependencies

Run this command in your terminal:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 6. Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### 7. Test the Connection

1. Go to `http://localhost:3001/admin/login`
2. Login with:
   - Email: `admin@catersmart.com`
   - Password: `admin123`
3. You should be redirected to the admin dashboard

## Verify Setup

### Check if Table Was Created

In Supabase Dashboard:
1. Go to **Table Editor**
2. You should see the `users` table
3. Click on it to see your admin user

### Check Environment Variables

In your terminal:
```bash
# Check if env vars are loaded (in Node.js)
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
```

Should output your Supabase URL (not undefined).

## Troubleshooting

### Error: "relation 'users' does not exist"
- Run the migration SQL in Supabase SQL Editor
- Make sure it executed without errors

### Error: "Invalid API key"
- Double-check your `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env`
- Make sure there are no extra spaces
- Restart dev server after changing `.env`

### Can't Login
- Make sure you ran the `seed_admin.sql` script
- Check the `users` table in Supabase to verify admin exists
- Password is: `admin123` (case-sensitive)

### Environment Variables Not Loading
- File must be named `.env` or `.env.local`
- Restart dev server after changes
- Check for typos in variable names

## Next Steps

Once this is working, you can:
1. ✅ Create real authentication API routes
2. ✅ Add more admin users
3. ✅ Implement proper password hashing
4. ✅ Create other database tables (packages, menu items, orders)
5. ✅ Build out the admin dashboard features

## Security Notes

⚠️ **Important for Production:**
- Change the default admin password
- Use proper password hashing (bcrypt with high salt rounds)
- Implement JWT tokens instead of localStorage
- Enable 2FA for admin accounts
- Use environment-specific credentials
- Never commit `.env` files to git

---

**Current Status:** Ready to connect to Supabase!
**Next Action:** Run the SQL migrations in Supabase Dashboard
