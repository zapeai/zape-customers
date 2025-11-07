# 🚀 Getting Started with Automated Database Migrations

**Complete step-by-step guide to set up and use your new GitHub Actions pipeline.**

---

## 📦 What You Got

Your repository now includes a **fully automated database migration pipeline** that deploys Supabase migrations to production when you merge code to the main branch.

### Files Created:

```
📁 .github/
   📁 workflows/
      📄 deploy-migrations.yml       ← Main workflow file
   📄 QUICK_REFERENCE.md             ← Quick commands & tips
   📄 SECRETS_TEMPLATE.md            ← How to configure secrets
   📄 README_BADGE_TEMPLATE.md       ← Add badge to README
   📄 validate-setup.sh              ← Validation script
📄 GITHUB_ACTIONS_SETUP.md           ← Complete setup guide
📄 DEPLOYMENT_PIPELINE_SUMMARY.md    ← System overview
📄 GETTING_STARTED_PIPELINE.md       ← This file
```

---

## ⚡ 5-Minute Setup

### Step 1: Find Your Supabase Credentials (2 minutes)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings** → **API**
4. Copy these two values:

   **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   
   **service_role key** (click "Reveal" to show)

   > ⚠️ **Important**: Use the `service_role` key, NOT the `anon` key!

### Step 2: Add Secrets to GitHub (3 minutes)

1. Go to your GitHub repository
2. Click **Settings** (top navigation)
3. Left sidebar: **Secrets and variables** → **Actions**
4. Click **New repository secret**

#### Add Secret #1:
```
Name: SUPABASE_URL
Value: [Paste your Project URL]
```
Click **Add secret**

#### Add Secret #2:
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: [Paste your service_role key]
```
Click **Add secret**

### Step 3: Verify Setup (1 minute)

Run the validation script:

```bash
./.github/validate-setup.sh
```

If you see ✅ **All checks passed!** - you're ready to go!

---

## 🎯 Your First Deployment

### Test the Pipeline (5 minutes)

Let's create a simple test migration and deploy it:

```bash
# 1. Create a test migration
npm run db:new
# This creates: supabase/migrations/[timestamp]_[name].sql

# 2. Add a simple test (optional - edit the migration file)
# For example, add a comment: -- Test migration for GitHub Actions

# 3. Test locally first
npm run db:migrate

# 4. Commit and push
git add supabase/migrations/
git commit -m "test: verify GitHub Actions pipeline"
git push origin main

# 5. Watch it deploy automatically! 🎉
# Go to: https://github.com/[YOUR-USERNAME]/[YOUR-REPO]/actions
```

### What Happens Next:

1. GitHub detects your push to main
2. Workflow automatically triggers
3. Migrations run on your production database
4. You see the results in the Actions tab

**Expected output:**
```
✨ Database migrations completed successfully!
Deployed to: https://your-project.supabase.co
```

---

## 📚 Real-World Example

### Scenario: Add a "favorites" feature

Users can now save their favorite courts.

#### Step 1: Create Migration

```bash
npm run db:new
# Creates: supabase/migrations/20251107120000_add_favorites_table.sql
```

#### Step 2: Write Migration SQL

Edit the file:

```sql
-- Add favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  court_id uuid NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, court_id)
);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own favorites
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_favorites_user 
  ON favorites(user_id);

-- Rollback instructions (commented):
-- DROP TABLE IF EXISTS favorites CASCADE;
```

#### Step 3: Test Locally

```bash
npm run db:migrate
```

**Expected output:**
```
🚀 Starting database migrations...
📍 Supabase Project: your-project-ref

✅ Success: 20251107120000_add_favorites_table.sql

✨ All migrations completed!
```

#### Step 4: Create Feature Branch

```bash
git checkout -b feature/favorites
git add supabase/migrations/
git commit -m "feat: add favorites table for user preferences"
git push origin feature/favorites
```

#### Step 5: Create Pull Request

1. Go to GitHub
2. Click "Compare & pull request"
3. Fill in PR details:
   - **Title:** `feat: add favorites table`
   - **Description:** 
     ```
     ## Changes
     - Add favorites table for user court preferences
     - Includes RLS policies for security
     - Optimized with user_id index
     
     ## Testing
     - ✅ Tested locally with npm run db:migrate
     - ✅ Verified table creation
     - ✅ Confirmed RLS policies work
     ```

#### Step 6: Review & Merge

1. Request review from team member
2. Address any feedback
3. Get approval
4. Click **Merge pull request**

#### Step 7: Automatic Deployment! 🚀

- GitHub Actions automatically triggered
- Migration runs on production
- Check Actions tab for status
- Verify in Supabase dashboard

**Deployment takes:** ~1-2 minutes

---

## 🎓 Daily Workflow

### For Feature Development

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Create migration(s)
npm run db:new
# Edit migration file(s)

# 3. Test locally
npm run db:migrate

# 4. Commit
git add supabase/migrations/
git commit -m "feat: description"

# 5. Push & create PR
git push origin feature/my-feature
# Create PR on GitHub

# 6. Review, approve, merge
# Auto-deploys to production! ✨
```

### For Hotfixes

```bash
# 1. Create hotfix branch
git checkout -b hotfix/urgent-fix

# 2. Create migration
npm run db:new
# Edit migration file

# 3. Test thoroughly
npm run db:migrate

# 4. Quick deploy
git add supabase/migrations/
git commit -m "hotfix: critical issue"
git push origin hotfix/urgent-fix

# 5. Create PR, get fast review, merge
# Auto-deploys immediately
```

---

## 🔍 Monitoring Deployments

### View in GitHub

**Actions Tab:**
```
https://github.com/[USERNAME]/[REPO]/actions
```

**What you'll see:**
- 🟢 Green = Success
- 🔴 Red = Failed
- 🟡 Yellow = In Progress
- ⚪ Gray = Skipped

### View Detailed Logs

1. Click on a workflow run
2. Click on "Run Database Migrations" job
3. Expand any step to see details

**Example log:**
```
🚀 Starting database migrations...
📂 Found 5 migration file(s):
   - 20251106130020_create_quadra_ja_schema.sql
   - 20251106131138_update_courts_rls_for_public_access.sql
   - 20251106134238_add_club_owner_system.sql
   - 20251106140026_fix_profiles_rls_insert_policy.sql
   - 20251107120000_add_favorites_table.sql

▶️  Running: 20251107120000_add_favorites_table.sql...
✅ Success: 20251107120000_add_favorites_table.sql

✨ All migrations completed!
```

### View in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Table Editor**
4. Verify new tables/changes appear

---

## 🛠️ Useful Commands

### Local Development

```bash
# Create new migration
npm run db:new

# Run migrations locally
npm run db:migrate

# List migration files
ls -la supabase/migrations/

# View migration content
cat supabase/migrations/[timestamp]_[name].sql
```

### Git Operations

```bash
# Check current branch
git branch

# Create feature branch
git checkout -b feature/name

# Stage migration files
git add supabase/migrations/

# Commit changes
git commit -m "feat: description"

# Push to remote
git push origin branch-name

# Switch to main
git checkout main

# Pull latest
git pull origin main
```

### GitHub CLI (optional)

```bash
# View workflow runs
gh run list

# Watch latest run
gh run watch

# View run logs
gh run view --log

# Trigger manual run
gh workflow run "Deploy Database Migrations"

# List secrets
gh secret list

# Set secret
gh secret set SUPABASE_URL
```

### Validation

```bash
# Validate setup
./.github/validate-setup.sh

# Check specific files
ls .github/workflows/
cat .github/workflows/deploy-migrations.yml
```

---

## 🐛 Troubleshooting

### Common Issues

#### ❌ Workflow doesn't trigger

**Check:**
```bash
# Verify workflow file exists
ls .github/workflows/deploy-migrations.yml

# Check if migration files changed
git diff origin/main HEAD -- supabase/migrations/

# Verify you're on main branch
git branch

# Ensure Actions are enabled
# GitHub → Settings → Actions → Allow all actions
```

#### ❌ "Missing secrets" error

**Fix:**
1. Go to GitHub Settings → Secrets
2. Verify both secrets exist:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Check for typos (case-sensitive)
4. Re-add if needed

#### ❌ "Connection failed"

**Fix:**
1. Verify Supabase project is active
2. Check project URL is correct
3. Verify service role key (not anon key!)
4. Check Supabase status page

#### ⚠️ "Already exists" warnings

**This is normal!**
- Migrations already applied
- Script skips them automatically
- No action needed

#### ❌ Migration SQL error

**Fix:**
1. Check error message in logs
2. Fix SQL in migration file
3. Test locally: `npm run db:migrate`
4. Commit fix
5. Push again

---

## 🔒 Security Checklist

- [ ] Service role key stored only in GitHub Secrets
- [ ] `.env` file in `.gitignore`
- [ ] No credentials in code
- [ ] No credentials in commit history
- [ ] GitHub repository is private (or secrets are protected)
- [ ] Team knows not to share service key
- [ ] Regular key rotation scheduled

---

## 📖 Documentation Reference

| Document | Purpose |
|----------|---------|
| `GETTING_STARTED_PIPELINE.md` | This guide - step-by-step setup |
| `DEPLOYMENT_PIPELINE_SUMMARY.md` | System overview and features |
| `GITHUB_ACTIONS_SETUP.md` | Complete setup guide |
| `.github/QUICK_REFERENCE.md` | Quick commands and tips |
| `.github/SECRETS_TEMPLATE.md` | How to configure secrets |
| `.github/README_BADGE_TEMPLATE.md` | Add status badge to README |

---

## 🎉 Success Checklist

You're fully set up when you can check all these:

- [ ] GitHub Secrets configured (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
- [ ] Validation script passes (`./.github/validate-setup.sh`)
- [ ] Test migration created and deployed
- [ ] Actions tab shows successful run
- [ ] Migration visible in Supabase dashboard
- [ ] Team members notified about automation
- [ ] Documentation reviewed
- [ ] README badge added (optional)

---

## 🚀 Next Steps

### Now that you're set up:

1. **Add README Badge** (optional)
   - See `.github/README_BADGE_TEMPLATE.md`
   - Shows deployment status at a glance

2. **Set Up Environments** (optional)
   - GitHub Settings → Environments
   - Add protection rules
   - Require approvals

3. **Add Notifications** (optional)
   - Slack webhook
   - Email alerts
   - Discord notifications

4. **Create Staging Environment** (optional)
   - Test migrations before production
   - Separate branch and secrets

5. **Schedule Backups**
   - Regular database backups
   - Before major migrations
   - Automated snapshots

---

## 💡 Pro Tips

### Best Practices

✅ **Always test locally first**
```bash
npm run db:migrate
```

✅ **Use descriptive migration names**
```
Good: 20251107_add_user_preferences_table.sql
Bad:  20251107_update.sql
```

✅ **Include rollback instructions**
```sql
-- Rollback:
-- DROP TABLE IF EXISTS favorites;
```

✅ **Keep migrations focused**
- One feature per migration
- Small, incremental changes
- Easier to debug and rollback

✅ **Use idempotent operations**
```sql
CREATE TABLE IF NOT EXISTS ...
CREATE INDEX IF NOT EXISTS ...
```

✅ **Test RLS policies**
- Verify security rules work
- Test with different users
- Check policy logic

### Common Patterns

**Adding a new table:**
```sql
-- 1. Create table
CREATE TABLE IF NOT EXISTS table_name (...);

-- 2. Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- 3. Add policies
CREATE POLICY "policy_name" ON table_name ...;

-- 4. Add indexes
CREATE INDEX IF NOT EXISTS idx_name ON table_name(column);
```

**Adding a column:**
```sql
-- Safe - won't fail if exists
ALTER TABLE table_name 
ADD COLUMN IF NOT EXISTS column_name type;
```

**Modifying a column:**
```sql
-- Be careful - test thoroughly!
ALTER TABLE table_name 
ALTER COLUMN column_name TYPE new_type;
```

---

## 🆘 Need Help?

### Quick Links

- 📄 **Full Setup Guide:** `GITHUB_ACTIONS_SETUP.md`
- 🎯 **Quick Reference:** `.github/QUICK_REFERENCE.md`
- 🔐 **Secrets Setup:** `.github/SECRETS_TEMPLATE.md`
- 📊 **System Overview:** `DEPLOYMENT_PIPELINE_SUMMARY.md`

### External Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Supabase CLI Guide](https://supabase.com/docs/guides/cli)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Support

If you're stuck:

1. Run validation: `./.github/validate-setup.sh`
2. Check workflow logs in Actions tab
3. Review troubleshooting section above
4. Check documentation files
5. Test locally: `npm run db:migrate`

---

## 🎊 Congratulations!

You now have a **professional-grade automated database migration pipeline**!

**What you achieved:**
- ✅ Automated deployments
- ✅ Safe, tested migrations
- ✅ Full audit trail
- ✅ Protected credentials
- ✅ Consistent process
- ✅ Production-ready setup

**Ready to deploy?**

```bash
npm run db:new
# Edit migration...
npm run db:migrate
git add supabase/migrations/
git commit -m "feat: my first automated migration"
git push origin main
# Watch it deploy automatically! 🚀
```

---

**Happy deploying! 🎉**

