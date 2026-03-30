# Team Sync Guide - Getting Updates from Main Branch

## Scenario
You (Kristel) push updates to main branch. Your collaborator needs to pull those changes to their local machine.

---

## For Your Collaborator

### Option 1: Fresh Clone (Easiest! 🎉)

If they don't have important uncommitted work, just start fresh:

```bash
# Step 1: Delete old folder (or rename it as backup)
cd ..
mv catering-smart-system catering-smart-system-old

# Step 2: Clone fresh from GitHub
git clone https://github.com/your-username/catering-smart-system.git
cd catering-smart-system

# Step 3: Install dependencies
npm install

# Step 4: Set up environment variables
cp .env.example .env.local
# Edit .env.local with actual Supabase credentials

# Step 5: Start dev server
npm run dev

# Done! ✅
```

**Time:** 2-3 minutes
**Pros:** No conflicts, clean slate, guaranteed to work
**Cons:** Loses any uncommitted local changes

---

### Option 2: Update Their Current Branch

```bash
# Step 1: Save any current work
git add .
git commit -m "WIP: Save current work"

# Step 2: Switch to main branch
git checkout main

# Step 3: Pull latest changes from remote
git pull origin main

# Step 4: Install any new dependencies
npm install

# Step 5: Copy environment variables (if first time)
cp .env.example .env.local
# Then edit .env.local with actual credentials

# Step 6: Restart dev server
npm run dev

# Step 7: Switch back to their feature branch
git checkout their-feature-branch

# Step 8: Merge main into their branch
git merge main

# Step 9: Resolve any conflicts (if any)
# Edit conflicting files, then:
git add .
git commit -m "Merge main into feature branch"
```

---

### Option 2: Rebase Their Branch (Cleaner History)

```bash
# Step 1: Save current work
git add .
git commit -m "WIP: Save current work"

# Step 2: Fetch latest from remote
git fetch origin

# Step 3: Rebase their branch on top of main
git rebase origin/main

# Step 4: If conflicts occur, resolve them:
# - Edit conflicting files
# - Then run:
git add .
git rebase --continue

# Step 5: Install new dependencies
npm install

# Step 6: Restart dev server
npm run dev
```

---

### Option 3: Fresh Start (If Too Many Conflicts)

```bash
# Step 1: Backup their current work
git stash save "My current work backup"

# Step 2: Pull latest main
git checkout main
git pull origin main

# Step 3: Create new branch from updated main
git checkout -b their-new-feature-branch

# Step 4: Apply their backed up work
git stash pop

# Step 5: Install dependencies
npm install

# Step 6: Restart dev server
npm run dev
```

---

## Common Issues & Solutions

### Issue 1: "Your local changes would be overwritten"

**Solution:**
```bash
# Save changes first
git stash

# Pull updates
git pull origin main

# Reapply your changes
git stash pop
```

---

### Issue 2: Merge Conflicts

**Solution:**
```bash
# After git merge or git pull shows conflicts:

# 1. Open conflicting files in VSCode
# 2. Look for conflict markers:
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> main

# 3. Choose which code to keep or combine both
# 4. Remove conflict markers
# 5. Save file
# 6. Mark as resolved:
git add conflicted-file.tsx

# 7. Complete the merge:
git commit -m "Resolve merge conflicts"
```

---

### Issue 3: Missing Dependencies

**Error:** `Module not found: Can't resolve '@supabase/ssr'`

**Solution:**
```bash
# Install missing packages
npm install

# Or clean install
rm -rf node_modules package-lock.json
npm install
```

---

### Issue 4: Environment Variables Not Working

**Solution:**
```bash
# 1. Check if .env.local exists
ls -la | grep .env

# 2. If not, copy from example:
cp .env.example .env.local

# 3. Ask team lead for actual credentials
# 4. Update .env.local with real values

# 5. Restart dev server
npm run dev
```

---

### Issue 5: Database Schema Out of Sync

**Solution:**
```bash
# 1. Check for new migration files in supabase/migrations/
# 2. Run them in Supabase Dashboard → SQL Editor
# 3. Or use Supabase CLI:
supabase db push
```

---

## Complete Sync Workflow

### When You (Kristel) Push Updates:

```bash
# 1. Commit your changes
git add .
git commit -m "Add admin authentication and security features"

# 2. Push to your branch
git push origin your-branch-name

# 3. Create Pull Request on GitHub/GitLab
# 4. After PR is merged to main, notify team
```

### When Collaborator Pulls Updates:

```bash
# 1. Fetch latest
git fetch origin

# 2. Check what changed
git log origin/main..HEAD

# 3. Pull main
git checkout main
git pull origin main

# 4. Install new dependencies
npm install

# 5. Check for new env variables
diff .env.local .env.example

# 6. Run new migrations (if any)
# Check supabase/migrations/ folder

# 7. Merge into their branch
git checkout their-branch
git merge main

# 8. Test everything works
npm run dev
```

---

## Checklist for Collaborator

After pulling your updates, they should:

- [ ] Run `git pull origin main`
- [ ] Run `npm install` (new packages added)
- [ ] Check `.env.example` for new variables
- [ ] Update their `.env.local` if needed
- [ ] Run new database migrations (check `supabase/migrations/`)
- [ ] Restart dev server (`npm run dev`)
- [ ] Test admin login at `/admin/login`
- [ ] Verify Tailwind CSS is working
- [ ] Check for any console errors

---

## New Files Your Collaborator Will Get

### Code Files:
```
src/
├── app/
│   ├── layout.tsx (updated)
│   ├── page.tsx (updated)
│   └── admin/
│       ├── login/page.tsx (new)
│       ├── dashboard/page.tsx (new)
│       ├── orders/page.tsx (new)
│       ├── packages/page.tsx (new)
│       └── menu/page.tsx (new)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx (new)
│   │   └── Footer.tsx (new)
│   ├── home/ (all new)
│   └── ui/
│       └── Button.tsx (new)
├── lib/
│   ├── utils.ts (new)
│   ├── constants.ts (new)
│   └── supabase/
│       ├── client.ts (new)
│       └── server.ts (new)
└── types/
    └── index.ts (new)
```

### Config Files:
```
- tailwind.config.ts (new)
- tsconfig.json (updated)
- package.json (updated - new dependencies)
- .gitignore (updated)
```

### Documentation:
```
- SECURITY-GUIDE.md (new)
- DATABASE-SCHEMA-UPDATED.md (new)
- ARCHITECTURE-DIAGRAM.md (new)
- SUPABASE-AUTH-SETUP.md (new)
- And more...
```

---

## Communication Template

### Message to Send Your Team:

```
Hey team! 👋

I just pushed major updates to main:

🎉 What's New:
- ✅ Professional Next.js folder structure (src/ directory)
- ✅ Tailwind CSS v3 configured and working
- ✅ Admin authentication with Supabase JWT
- ✅ Landing page with all sections
- ✅ Admin dashboard (/admin/login)
- ✅ Security improvements

📋 Action Required:
1. Pull latest main: `git pull origin main`
2. Install new packages: `npm install`
3. Copy .env.example to .env.local
4. Ask me for Supabase credentials
5. Run database migration (see SUPABASE-AUTH-SETUP.md)
6. Restart dev server: `npm run dev`

📚 New Documentation:
- SECURITY-GUIDE.md - Security best practices
- SUPABASE-AUTH-SETUP.md - How to set up auth
- TEAM-SYNC-GUIDE.md - This guide!

🔗 Admin Access:
- URL: http://localhost:3001/admin/login
- Credentials: (I'll share separately)

Let me know if you hit any issues!
```

---

## Troubleshooting for Collaborator

### "I can't pull, I have uncommitted changes"
```bash
git stash
git pull origin main
git stash pop
```

### "Merge conflict in package.json"
```bash
# Accept their version (from main)
git checkout --theirs package.json
npm install
git add package.json
git commit -m "Resolve package.json conflict"
```

### "Module not found errors"
```bash
# Clean install
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

### "Tailwind styles not working"
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### "Can't login to admin"
```bash
# 1. Check .env.local has Supabase credentials
# 2. Run database migrations
# 3. Create admin user in Supabase Dashboard
# 4. See SUPABASE-AUTH-SETUP.md
```

---

## Git Commands Quick Reference

```bash
# See current branch
git branch

# See what changed
git status

# Pull latest main
git pull origin main

# Merge main into current branch
git merge main

# See commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes (CAREFUL!)
git reset --hard origin/main
```

---

**Status:** Complete guide for team collaboration
**Use Case:** After you push updates, share this with your team
**Time to Sync:** ~5-10 minutes per person
