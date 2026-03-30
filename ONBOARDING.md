# New Team Member Onboarding - Quick Setup

## Welcome to CaterSmart! 🎉

Get up and running in 5 minutes.

---

## Quick Setup (Fresh Clone)

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/catering-smart-system.git
cd catering-smart-system
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment Variables
```bash
# Copy the example file
cp .env.example .env.local

# Open .env.local and add these (ask team lead for values):
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
```

### Step 4: Start Development Server
```bash
npm run dev
```

Open http://localhost:3001 - You should see the landing page! ✅

---

## What You Need from Team Lead

Ask for these credentials (never commit them!):

1. **Supabase Credentials:**
   - Project URL
   - Anon Key
   - Service Role Key

2. **Admin Login:**
   - Email
   - Password

3. **Optional (for later):**
   - Stripe API keys
   - SMTP credentials

---

## Project Structure Overview

```
catering-smart-system/
├── src/
│   ├── app/              # Pages (Next.js App Router)
│   │   ├── page.tsx      # Home page
│   │   ├── layout.tsx    # Root layout
│   │   └── admin/        # Admin pages
│   ├── components/       # React components
│   │   ├── layout/       # Navbar, Footer
│   │   ├── home/         # Home page sections
│   │   └── ui/           # Reusable components
│   ├── lib/              # Utilities
│   │   ├── supabase/     # Database client
│   │   ├── utils.ts      # Helper functions
│   │   └── constants.ts  # App constants
│   └── types/            # TypeScript types
├── supabase/
│   └── migrations/       # Database schema
├── public/               # Static assets
└── Documentation files   # *.md files
```

---

## Key URLs

- **Landing Page:** http://localhost:3001
- **Admin Login:** http://localhost:3001/admin/login
- **Admin Dashboard:** http://localhost:3001/admin/dashboard

---

## Important Files to Read

1. **README.md** - Project overview
2. **PROJECT-STRUCTURE.md** - Folder organization
3. **SUPABASE-AUTH-SETUP.md** - Database setup
4. **SECURITY-GUIDE.md** - Security best practices
5. **TEAM-SYNC-GUIDE.md** - How to sync updates

---

## Development Workflow

### Creating a New Feature

```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make your changes
# Edit files in src/

# 3. Test locally
npm run dev

# 4. Commit changes
git add .
git commit -m "Add: your feature description"

# 5. Push to remote
git push origin feature/your-feature-name

# 6. Create Pull Request on GitHub
```

### Before Committing

```bash
# Check what changed
git status

# Review your changes
git diff

# Make sure .env is NOT in the list!
# If it is, it means .gitignore isn't working
```

---

## Common Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
```

### Git
```bash
git status           # See what changed
git pull origin main # Get latest updates
git checkout -b name # Create new branch
git add .            # Stage all changes
git commit -m "msg"  # Commit changes
git push             # Push to remote
```

### Troubleshooting
```bash
# Clear everything and reinstall
rm -rf node_modules .next
npm install
npm run dev

# Reset to main branch
git checkout main
git reset --hard origin/main
```

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth (JWT)
- **Deployment:** Vercel (planned)

---

## Need Help?

### Resources:
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

### Team Communication:
- Ask in team chat
- Check documentation files
- Review code comments
- Create GitHub issues

---

## First Tasks (Good for Getting Started)

Easy tasks to familiarize yourself with the codebase:

1. **Add a new section to home page**
   - Edit `src/components/home/`
   - See changes at http://localhost:3001

2. **Update footer links**
   - Edit `src/components/layout/Footer.tsx`

3. **Create a new page**
   - Add folder in `src/app/`
   - Create `page.tsx`
   - Visit the route

4. **Style a component**
   - Use Tailwind classes
   - See `src/components/ui/Button.tsx` for example

---

## Security Reminders

### DO:
✅ Keep `.env.local` on your machine only
✅ Use strong passwords
✅ Pull latest main regularly
✅ Test before pushing

### DON'T:
❌ Commit `.env` files
❌ Share credentials in chat/email
❌ Push directly to main
❌ Commit `node_modules/`

---

**Welcome to the team!** 🚀
**Setup Time:** ~5 minutes
**Questions?** Ask the team lead!
