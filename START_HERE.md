# 🚀 START HERE - Supabase CLI Database Migrations

## 📌 Quick Overview

This project uses the **official Supabase CLI** for database migrations with **automated GitHub Actions deployment**.

**⏱️ Setup Time:** 5 minutes  
**🎯 Status:** Production-ready  
**✅ Migration Tracking:** Built-in (no custom tables needed)  
**✨ No Global CLI:** Everything via npm scripts (just `npm install`!)

---

## ⚡ Get Started in 2 Steps

### 1️⃣ Install Dependencies (1 minute)

```bash
# Installs Supabase CLI locally (no global installation!)
npm install
```

**That's it!** Supabase CLI is now available via npm scripts. ✨

### 2️⃣ Start Local Development OR Link to Production

**Option A: Local Development (Recommended)**

```bash
# Start local Supabase
npm run db:start

# Apply migrations
npm run db:push

# Start Next.js
npm run dev
```

**Option B: Link to Production**

```bash
# Link to production
npm run db:link

# Apply migrations
npm run db:push
```

### 3️⃣ Configure GitHub Actions (2 minutes)

Add these secrets to **Repository → Settings → Secrets → Actions**:

| Secret Name             | Value                  | Where to Find                                 |
| ----------------------- | ---------------------- | --------------------------------------------- |
| `SUPABASE_ACCESS_TOKEN` | Your access token      | https://supabase.com/dashboard/account/tokens |
| `SUPABASE_PROJECT_REF`  | `hegqofubmkhmwjvpssdi` | Your project URL                              |
| `SUPABASE_DB_PASSWORD`  | Your DB password       | Settings → Database                           |

**✅ That's it! You're ready to deploy migrations.**

---

## 📚 Documentation Guide

### 🎯 Choose Your Path

**I want to see all npm commands:**
→ Read [`NPM_SCRIPTS_GUIDE.md`](NPM_SCRIPTS_GUIDE.md) ⭐ All available npm scripts (no global CLI!)

**I want to get started quickly:**
→ Read [`QUICK_START_SUPABASE_CLI.md`](QUICK_START_SUPABASE_CLI.md) (2-minute quickstart)

**I want complete setup details:**
→ Read [`SUPABASE_CLI_SETUP.md`](SUPABASE_CLI_SETUP.md) (comprehensive guide)

**I want local development with Docker:**
→ Read [`LOCAL_DEVELOPMENT_SETUP.md`](LOCAL_DEVELOPMENT_SETUP.md) (local environment guide)

**I want to see what changed:**
→ Read [`DEPRECATED_custom_migration_script.md`](DEPRECATED_custom_migration_script.md) (migration notes)

---

## 🔄 Daily Workflow

### Create a New Migration

```bash
# Create migration file
npm run db:migration:new add_user_profiles

# Edit the generated file in supabase/migrations/
# ... add your SQL ...

# Test locally
npm run db:push

# Commit and push (auto-deploys to production!)
git add supabase/migrations/
git commit -m "feat: add user profiles"
git push origin main
```

**That's it!** GitHub Actions automatically deploys to production. 🚀

### Check Migration Status

```bash
# View linked project
npm run db:status

# List migrations
npm run db:migration:list
```

### Monitor Deployments

View in GitHub: **Actions** tab → **Deploy Database Migrations**

---

## ✨ Key Features

✅ **Automatic Deployment** - Runs on push to main  
✅ **Built-in Migration Tracking** - No custom tables needed  
✅ **Duplicate Prevention** - Supabase CLI handles it automatically  
✅ **Rollback Support** - Built into Supabase CLI  
✅ **Change Detection** - Only runs when migrations change  
✅ **Manual Trigger** - Emergency deployment option available  
✅ **Error Handling** - Graceful failures with clear messages  
✅ **Security** - Credentials stored in GitHub Secrets  
✅ **Concurrency Control** - One migration at a time  
✅ **Local Testing** - Full local development environment

---

## 📊 How It Works

```
Developer          GitHub              Supabase
    |                 |                    |
    |-- Push to main-->                   |
    |                 |                    |
    |             [Trigger]                |
    |                 |                    |
    |      [Setup Supabase CLI]            |
    |                 |                    |
    |                 |-- supabase db push->|
    |                 |                    |
    |                 |<-- Success --------|
    |                 |                    |
    |<-- Notify ------                     |
    |                                      |
    ✅ Deployed!
```

**Time:** ~1-2 minutes per deployment

---

## 🎯 What This Does

### Automatic Migration Tracking

The Supabase CLI automatically:

- ✅ Tracks which migrations have been applied
- ✅ Runs only new/pending migrations
- ✅ Prevents duplicate executions
- ✅ Records migration history in Supabase
- ✅ Provides rollback capabilities

### No More Custom Scripts

Previously, this project used custom Node.js migration scripts. Now:

- ✅ Simpler setup (just install CLI)
- ✅ Better reliability (official tool)
- ✅ Less maintenance (Supabase handles it)
- ✅ Built-in best practices

---

## 📁 Project Structure

```
zape-customers/
├── .github/
│   └── workflows/
│       └── deploy-migrations.yml    ← GitHub Actions workflow
│
├── supabase/
│   └── migrations/                  ← Your migration files
│       ├── 20251106130020_create_quadra_ja_schema.sql
│       ├── 20251106131138_update_courts_rls_for_public_access.sql
│       ├── 20251106134238_add_club_owner_system.sql
│       ├── 20251106140026_fix_profiles_rls_insert_policy.sql
│       └── 20251107000000_create_migration_tracking.sql
│
├── QUICK_START_SUPABASE_CLI.md      ← Quick start guide
├── SUPABASE_CLI_SETUP.md            ← Complete setup guide
└── START_HERE.md                    ← You are here!
```

---

## 🔍 Quick Reference

### Common Commands

```bash
# Install dependencies (first time setup)
npm install

# Link project (first time setup)
npm run db:link

# Check status
npm run db:status

# Create migration
npm run db:migration:new migration_name

# Run migrations
npm run db:push

# List migrations
npm run db:migration:list

# Pull remote schema
npm run db:pull
```

### Git Workflow

```bash
# Standard deployment workflow
git add supabase/migrations/
git commit -m "feat: add new feature"
git push origin main
# ✅ Auto-deploys via GitHub Actions!
```

---

## 🛡️ Security

All credentials are protected:

- ✅ Access token stored in GitHub Secrets (encrypted)
- ✅ Never exposed in logs
- ✅ Not in code or commits
- ✅ Access controlled by GitHub permissions
- ✅ Database password only in GitHub Secrets

**Your `.env` file stays local** - Never committed!

---

## 🐛 Troubleshooting

### "Failed to link project"?

```bash
# Ensure you have valid access token
supabase link --project-ref hegqofubmkhmwjvpssdi
# Enter your access token and DB password when prompted
```

### "Authentication failed" in GitHub Actions?

- Check `SUPABASE_ACCESS_TOKEN` secret is set correctly
- Verify token hasn't expired
- Ensure token has necessary permissions

### Workflow doesn't trigger?

- Check: Did migration files change?
- Check: Pushed to `main` branch?
- Check: GitHub Actions enabled?

### Need more help?

→ See [`SUPABASE_CLI_SETUP.md`](SUPABASE_CLI_SETUP.md) for detailed troubleshooting

---

## ✅ Setup Checklist

Complete these to get started:

- [ ] Install Supabase CLI globally
- [ ] Link local project to Supabase
- [ ] Add GitHub Secrets (3 required)
- [ ] Test local migration with `supabase db push`
- [ ] Push test migration to trigger GitHub Actions
- [ ] Verify deployment in Actions tab
- [ ] Read Supabase CLI documentation

**Time to complete:** ~10 minutes

---

## 💡 Pro Tips

### Best Practices

✅ Always test locally first (`supabase db push`)  
✅ Use descriptive migration names  
✅ Keep migrations small and focused  
✅ Use idempotent SQL (`IF NOT EXISTS`, `OR REPLACE`)  
✅ Monitor the Actions tab after pushing  
✅ Add comments explaining complex changes

### Common Pitfalls to Avoid

❌ Don't modify migration files after they're applied  
❌ Don't delete applied migration files  
❌ Don't commit `.env` or `.supabase/` directories  
❌ Don't run migrations directly in SQL Editor (bypasses tracking)  
❌ Don't skip local testing

---

## 📖 Existing Migrations

Your project already has these migrations:

1. ✅ `20251106130020_create_quadra_ja_schema.sql` - Initial schema
2. ✅ `20251106131138_update_courts_rls_for_public_access.sql` - RLS policies
3. ✅ `20251106134238_add_club_owner_system.sql` - Club ownership
4. ✅ `20251106140026_fix_profiles_rls_insert_policy.sql` - Profile policies
5. ✅ `20251107000000_create_migration_tracking.sql` - Migration tracking

All migrations are preserved and work with Supabase CLI!

---

## 🔄 Migrated from Custom Scripts

This project **previously used custom Node.js scripts**. We've now migrated to the **official Supabase CLI** for:

- ✅ Simpler setup
- ✅ Better reliability
- ✅ Built-in migration tracking
- ✅ Official support
- ✅ Less maintenance

Old files have been moved to `.deprecated/` folder for reference.

See: [`DEPRECATED_custom_migration_script.md`](DEPRECATED_custom_migration_script.md) for details.

---

## 🎓 Next Steps

### Immediate (Required)

1. **Install dependencies** - `npm install` (includes Supabase CLI!)
2. **Start local dev** - `npm run db:start` (or link to production: `npm run db:link`)
3. **Configure GitHub Secrets** - Add 3 secrets
4. **Test deployment** - Create and push a test migration

### Soon (Recommended)

5. **Review workflow** - Check `.github/workflows/deploy-migrations.yml`
6. **Read full docs** - [`SUPABASE_CLI_SETUP.md`](SUPABASE_CLI_SETUP.md)
7. **Share with team** - Everyone should use CLI

### Later (Recommended for Development)

8. **Set up local development** - See [`LOCAL_DEVELOPMENT_SETUP.md`](LOCAL_DEVELOPMENT_SETUP.md)
9. **Add notifications** - Slack/Discord alerts for deployments
10. **Environment branching** - Separate staging/production

---

## 📞 Getting Help

### Documentation

| Need              | Document                                                                         |
| ----------------- | -------------------------------------------------------------------------------- |
| NPM scripts       | [`NPM_SCRIPTS_GUIDE.md`](NPM_SCRIPTS_GUIDE.md) ⭐                                |
| Quick start       | [`QUICK_START_SUPABASE_CLI.md`](QUICK_START_SUPABASE_CLI.md)                     |
| Complete setup    | [`SUPABASE_CLI_SETUP.md`](SUPABASE_CLI_SETUP.md)                                 |
| Local development | [`LOCAL_DEVELOPMENT_SETUP.md`](LOCAL_DEVELOPMENT_SETUP.md)                       |
| Migration notes   | [`DEPRECATED_custom_migration_script.md`](DEPRECATED_custom_migration_script.md) |

### External Resources

- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
- [Local Development Guide](https://supabase.com/docs/guides/cli/local-development)
- [Migration Best Practices](https://supabase.com/docs/guides/cli/local-development#database-migrations)

---

## 🎉 You're Ready!

Your Supabase CLI migration system is **fully configured and ready to use**.

### What you have:

✅ Official Supabase CLI setup  
✅ GitHub Actions automation  
✅ Built-in migration tracking  
✅ Comprehensive documentation  
✅ Security best practices  
✅ Local and production workflows

### Start using it:

```bash
# 1. Install dependencies
npm install

# 2. Start local development
npm run db:start
npm run db:push

# 3. Create migration
npm run db:migration:new my_feature

# 4. Test locally
npm run db:push

# 5. Deploy to production
git add supabase/migrations/
git commit -m "feat: add my feature"
git push origin main

# 6. Watch it deploy!
# GitHub → Actions tab 🚀
```

---

**Questions?** Check [`SUPABASE_CLI_SETUP.md`](SUPABASE_CLI_SETUP.md) for detailed guidance.

**Happy deploying! 🎊**

---

_Project: QuadraJá Sports Court Booking Platform_  
_Migration System: Supabase CLI (Official)_  
_Last Updated: November 2025_
