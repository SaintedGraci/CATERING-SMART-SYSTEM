# Vercel Deployment Guide

## The Build Error You're Seeing

**Error:** `@supabase/ssr: Your project's URL and API key are required`

**Cause:** Environment variables aren't set in Vercel during build time.

---

## Fix: Add Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard

1. Open [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Required Variables

Add these variables for **Production**, **Preview**, and **Development**:

```
NEXT_PUBLIC_SUPABASE_URL
Value: https://xxxxx.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:** Check all three environments:
- ✅ Production
- ✅ Preview
- ✅ Development

### Step 3: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click **...** on the failed deployment
3. Click **Redeploy**

Or just push a new commit:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

---

## Complete Environment Variables for Vercel

### Required (Must Have):
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Optional (Add Later):
```
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# NextAuth (if using)
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-here

# Business Logic
TAX_RATE=0.08
DEFAULT_DELIVERY_FEE=15.00
SERVICE_FEE_RATE=0.05
```

---

## Alternative: Use vercel.json

Create a `vercel.json` file (optional):

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

Then add secrets via CLI:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## Deployment Checklist

### Before Deploying:

- [ ] All environment variables added in Vercel
- [ ] Database migrations run in Supabase
- [ ] Admin user created
- [ ] `.env` files NOT committed to git
- [ ] Build succeeds locally: `npm run build`
- [ ] No console errors in production build

### Test Locally First:

```bash
# Build production version
npm run build

# Start production server
npm start

# Test at http://localhost:3000
```

If it works locally, it should work on Vercel.

---

## Common Vercel Deployment Issues

### Issue 1: "Module not found"
**Solution:** Make sure all imports use correct paths with `@/` alias

### Issue 2: "Environment variable undefined"
**Solution:** 
- Add to Vercel dashboard
- Make sure variable names match exactly (case-sensitive)
- Redeploy after adding

### Issue 3: "Build timeout"
**Solution:**
- Optimize imports
- Remove unused dependencies
- Use dynamic imports for large components

### Issue 4: "Database connection failed"
**Solution:**
- Check Supabase project is active
- Verify connection string in env vars
- Check Supabase project region matches Vercel region

---

## Vercel CLI (Alternative Deployment)

### Install Vercel CLI:
```bash
npm install -g vercel
```

### Deploy:
```bash
# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Manage env variables:
```bash
# List env variables
vercel env ls

# Add env variable
vercel env add NEXT_PUBLIC_SUPABASE_URL

# Pull env variables to local
vercel env pull .env.local
```

---

## Production URLs

After successful deployment:

- **Production:** https://your-project.vercel.app
- **Admin Login:** https://your-project.vercel.app/admin/login
- **Preview:** https://your-project-git-branch.vercel.app

---

## Security for Production

### Update these in Vercel:

```
# Use production Stripe keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# Use production URLs
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Strong secrets
NEXTAUTH_SECRET=<generate-new-strong-secret>
```

### Generate strong secrets:
```bash
# In terminal
openssl rand -base64 32
```

---

## Monitoring

### After Deployment:

1. **Check Vercel Logs:**
   - Vercel Dashboard → Your Project → Logs
   - Look for errors

2. **Check Supabase Logs:**
   - Supabase Dashboard → Logs
   - Monitor database queries

3. **Test All Features:**
   - Landing page loads
   - Admin login works
   - Dashboard displays
   - No console errors

---

## Rollback if Needed

```bash
# In Vercel Dashboard:
# Deployments → Previous deployment → Promote to Production

# Or via CLI:
vercel rollback
```

---

## Summary

### The Fix:
✅ Added `export const dynamic = 'force-dynamic'` to all admin pages
✅ Added error handling in Supabase clients
✅ Pages won't pre-render at build time (they render on request)

### For Vercel:
1. Add environment variables in dashboard
2. Redeploy
3. Should work! ✅

### Build Command:
```bash
npm run build  # Should succeed now
```

---

**Status:** Build error fixed
**Next:** Add env vars in Vercel and redeploy
**Time:** 5 minutes
