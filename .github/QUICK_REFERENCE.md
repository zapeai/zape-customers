# GitHub Actions Migration Pipeline - Quick Reference

## 🚀 Quick Start

### First Time Setup
```bash
# 1. Add GitHub Secrets (do this once)
# Go to: GitHub Repo → Settings → Secrets → Actions
# Add: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY

# 2. Create a test migration
npm run db:new

# 3. Test locally
npm run db:migrate

# 4. Push to main (auto-deploys)
git add .
git commit -m "feat: add test migration"
git push origin main
```

## 📝 Common Commands

### Creating Migrations
```bash
# Create new migration file
npm run db:new

# Test migration locally
npm run db:migrate

# Check migration files
ls -la supabase/migrations/
```

### Git Workflow
```bash
# Feature branch workflow
git checkout -b feature/new-migration
npm run db:new
# ... edit migration file ...
git add supabase/migrations/
git commit -m "feat: add new tables"
git push origin feature/new-migration
# Create PR → Merge to main → Auto-deploy! 🚀

# Direct to main (use with caution)
git checkout main
git pull
# ... make changes ...
git add supabase/migrations/
git commit -m "feat: update schema"
git push origin main  # Auto-deploys!
```

### Monitoring Deployments
```bash
# Open Actions in browser
open https://github.com/YOUR-USERNAME/YOUR-REPO/actions

# Or use GitHub CLI
gh run list --workflow="Deploy Database Migrations"
gh run watch  # Watch latest run
gh run view --log  # View logs
```

## 🎯 Workflow Triggers

| Event | When | Auto-runs? |
|-------|------|------------|
| Push to main | Merge PR or direct push | ✅ Yes |
| Migration files change | Any .sql file in `supabase/migrations/` | ✅ Yes |
| Manual trigger | Click "Run workflow" in Actions | 🎯 Manual |
| Other file changes | No migration files changed | ❌ Skips |

## 📊 Reading Workflow Status

### In GitHub Actions Tab

**🟢 Green checkmark** = Success
- All migrations applied
- Database up to date
- Safe to deploy app

**🔴 Red X** = Failed
- Migration error occurred
- Check logs for details
- Database may be in inconsistent state
- Fix and re-run

**🟡 Yellow dot** = Running
- Migration in progress
- Wait for completion
- Do not push new migrations

**⚪ Gray circle** = Skipped
- No migration changes detected
- Workflow didn't need to run

## 🔍 Quick Troubleshooting

| Issue | Quick Fix |
|-------|-----------|
| Workflow doesn't trigger | Check file path: `supabase/migrations/*.sql` |
| "Missing secrets" error | Add secrets in repo Settings → Secrets |
| "Connection failed" | Verify Supabase URL and service key |
| "Already exists" warning | Normal - migration already applied |
| Workflow stuck | Check timeout (10 min), cancel and retry |

## 🔐 Security Reminders

```bash
# ✅ GOOD - Secrets in GitHub
SUPABASE_URL → GitHub Secrets
SUPABASE_SERVICE_ROLE_KEY → GitHub Secrets

# ❌ BAD - Secrets in code
.env → DON'T COMMIT
service-key.txt → DON'T COMMIT
hardcoded keys → NEVER
```

## 📋 Pre-Merge Checklist

Before merging migration PR:

- [ ] Migration tested locally with `npm run db:migrate`
- [ ] Migration file named correctly (timestamp_description.sql)
- [ ] SQL includes `IF NOT EXISTS` for idempotency
- [ ] No destructive operations without backup
- [ ] PR reviewed by team member
- [ ] GitHub Secrets configured
- [ ] Ready for auto-deployment

## 🎨 Migration Template

```sql
-- Migration: [Brief description]
-- Date: YYYY-MM-DD
-- Author: [Your name]

-- Create new table
CREATE TABLE IF NOT EXISTS new_table (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

-- Add policy
CREATE POLICY "Users can view own records"
  ON new_table FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_new_table_name 
  ON new_table(name);

-- Rollback (comment):
-- DROP TABLE IF EXISTS new_table;
```

## 🔄 Manual Workflow Trigger

### Via GitHub Web Interface:
1. Go to **Actions** tab
2. Click **Deploy Database Migrations**
3. Click **Run workflow** button
4. Select branch (usually `main`)
5. Enter reason (optional)
6. Click **Run workflow**

### Via GitHub CLI:
```bash
gh workflow run "Deploy Database Migrations" \
  --ref main \
  -f reason="Emergency hotfix"
```

## 📈 Monitoring Production

### Check Last Run
```bash
# Using GitHub CLI
gh run list --limit 5

# View specific run
gh run view [RUN-ID] --log
```

### View in Browser
```
https://github.com/[USERNAME]/[REPO]/actions/workflows/deploy-migrations.yml
```

### Check Supabase
```
https://supabase.com/dashboard/project/[PROJECT-REF]/editor
```

## 🆘 Emergency Procedures

### If Migration Fails in Production:

1. **Don't panic** - Database is protected
2. **Check logs** - Actions tab → Failed run
3. **Identify issue** - Read error message
4. **Fix locally** - Create hotfix migration
5. **Test thoroughly** - `npm run db:migrate`
6. **Quick deploy**:
   ```bash
   git checkout main
   git pull
   # Add fix migration
   git add supabase/migrations/
   git commit -m "hotfix: fix migration error"
   git push origin main
   ```

### If Need to Rollback:

1. Create rollback migration with DROP/ALTER statements
2. Test locally first
3. Deploy via normal workflow
4. Monitor carefully

### If GitHub Actions Down:

Run manually:
```bash
npm run db:migrate
```

Or in Supabase SQL Editor:
1. Go to Supabase Dashboard → SQL Editor
2. Copy migration file contents
3. Paste and execute

## 💡 Pro Tips

- Always test migrations locally first
- Use descriptive migration names
- Keep migrations small and focused
- Review the generated workflow summary
- Monitor the first few auto-deployments closely
- Set up Slack notifications for failures
- Document complex migrations
- Use feature flags for risky schema changes

## 📞 Support Resources

| Resource | Link |
|----------|------|
| Full Setup Guide | `GITHUB_ACTIONS_SETUP.md` |
| Secrets Template | `.github/SECRETS_TEMPLATE.md` |
| GitHub Actions Docs | https://docs.github.com/actions |
| Supabase Migrations | https://supabase.com/docs/guides/cli |
| Workflow File | `.github/workflows/deploy-migrations.yml` |

---

**Need help? Check the full setup guide in `GITHUB_ACTIONS_SETUP.md`**

