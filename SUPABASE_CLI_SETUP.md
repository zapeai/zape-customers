# Supabase CLI Migration Setup

This project now uses the **official Supabase CLI** for database migrations. This is simpler, more reliable, and follows Supabase best practices.

## 🎯 Overview

The Supabase CLI handles:

- ✅ Migration tracking (built-in)
- ✅ Running migrations in correct order
- ✅ Preventing duplicate runs
- ✅ Rollback support
- ✅ Local and production deployments

## 📦 Installation

### Option 1: Global Installation (Recommended)

```bash
npm install -g supabase
```

### Option 2: Using npx (No installation)

```bash
npx supabase --help
```

### Verify Installation

```bash
supabase --version
```

## 🔐 Setup GitHub Secrets

Add these secrets to your GitHub repository:

1. Go to: **Repository → Settings → Secrets and variables → Actions**
2. Add the following secrets:

| Secret Name             | Description            | Where to Find                                                  |
| ----------------------- | ---------------------- | -------------------------------------------------------------- |
| `SUPABASE_ACCESS_TOKEN` | Personal access token  | [Generate here](https://supabase.com/dashboard/account/tokens) |
| `SUPABASE_PROJECT_REF`  | Your project reference | Project URL: `https://[PROJECT_REF].supabase.co`               |
| `SUPABASE_DB_PASSWORD`  | Database password      | Settings → Database → Database Password                        |

### Getting Your Access Token

1. Go to: https://supabase.com/dashboard/account/tokens
2. Click **Generate new token**
3. Name it: `GitHub Actions CI/CD`
4. Copy the token (you won't see it again!)
5. Add it as `SUPABASE_ACCESS_TOKEN` secret

### Getting Your Project Reference

Your project reference is in your Supabase URL:

- URL: `https://hegqofubmkhmwjvpssdi.supabase.co`
- Project Ref: `hegqofubmkhmwjvpssdi`

Add this as `SUPABASE_PROJECT_REF` secret.

### Getting Your Database Password

1. Go to: **Supabase Dashboard → Settings → Database**
2. Scroll to **Connection String** section
3. Find **Database password** or click **Reset Password**
4. Copy and save it securely
5. Add it as `SUPABASE_DB_PASSWORD` secret

## 💻 Local Development Setup

### Quick Link (Connect to Production)

```bash
cd /Users/guilhermesouzagoncalves/Dev/zapeai/zape-customers
supabase link --project-ref hegqofubmkhmwjvpssdi
```

You'll be prompted for:

- **Database password**: Enter your database password
- **Access token**: Use your personal access token

This creates a `.supabase/` directory (already in `.gitignore`).

Verify link:

```bash
supabase status
```

### Full Local Development (Docker)

For a **complete local Supabase environment** with Studio, local database, and more:

**→ See [`LOCAL_DEVELOPMENT_SETUP.md`](LOCAL_DEVELOPMENT_SETUP.md) for complete guide**

Quick start:

```bash
# Install Docker Desktop first
brew install --cask docker

# Start local Supabase
supabase start

# Open Studio
open http://localhost:54323
```

This gives you a full local stack for development without touching production!

## 🚀 Running Migrations

### Locally (Development)

Push all pending migrations to your linked project:

```bash
supabase db push
```

This will:

1. Check which migrations are already applied
2. Run only new migrations
3. Update migration history in Supabase
4. Show detailed output

### Via GitHub Actions (Production)

Migrations run automatically when:

- You push migration files to `main` branch
- You manually trigger the workflow

Check status at: **Actions** tab in your GitHub repository

### Manually Trigger Workflow

1. Go to: **Actions → Deploy Database Migrations**
2. Click **Run workflow**
3. Enter a reason (optional)
4. Click **Run workflow**

## 📝 Creating New Migrations

### Method 1: Using Supabase CLI (Recommended)

```bash
supabase migration new add_new_feature
```

This creates: `supabase/migrations/[TIMESTAMP]_add_new_feature.sql`

### Method 2: Manual Creation

Create a file with this naming pattern:

```
supabase/migrations/YYYYMMDDHHMMSS_descriptive_name.sql
```

Example:

```
supabase/migrations/20251107120000_add_user_profiles.sql
```

### Writing Migration SQL

```sql
-- Migration: Add user profiles table
-- Description: Creates a table for extended user profile information

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);
```

### Test Locally First

```bash
# Run migration locally
supabase db push

# If something goes wrong, you can reset
supabase db reset
```

### Commit and Push

```bash
git add supabase/migrations/
git commit -m "feat: add user profiles table"
git push origin main
```

The GitHub Action will automatically deploy to production! 🚀

## 🔍 Checking Migration Status

### Local Status

```bash
# Show migration history
supabase migration list

# Show detailed project status
supabase status
```

### Production Status

Check in Supabase Dashboard:

1. Go to: **Database → Migrations**
2. View applied migrations and their status

Or query directly:

```sql
SELECT * FROM supabase_migrations.schema_migrations
ORDER BY version DESC;
```

## 🛠️ Common Commands

```bash
# Link to your project
supabase link --project-ref hegqofubmkhmwjvpssdi

# Check link status
supabase status

# List migrations
supabase migration list

# Create new migration
supabase migration new my_migration_name

# Push migrations to linked project
supabase db push

# Pull remote schema as new migration
supabase db pull

# Reset local database (⚠️ development only)
supabase db reset

# Start local Supabase (full stack)
supabase start

# Stop local Supabase
supabase stop
```

## 🔄 Migration Flow

```
┌─────────────────────────────────────┐
│  Developer creates migration file   │
│  supabase/migrations/new.sql        │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  Test locally                       │
│  $ supabase db push                 │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  Commit & push to GitHub            │
│  $ git push origin main             │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  GitHub Actions triggered           │
│  (.github/workflows/deploy-migrations.yml) │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  Supabase CLI runs migrations       │
│  $ supabase db push --linked        │
└───────────────┬─────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│  Migration applied to production    │
│  Tracked in Supabase dashboard      │
└─────────────────────────────────────┘
```

## 🛡️ Safety Features

### Built-in Protection

1. **Migration Tracking**: Supabase automatically tracks applied migrations
2. **Duplicate Prevention**: Already-applied migrations are skipped
3. **Concurrency Control**: GitHub Actions ensures one deployment at a time
4. **Transaction Wrapping**: Each migration runs in a transaction
5. **Automatic Rollback**: Failed migrations are rolled back

### Best Practices

✅ **DO:**

- Test migrations locally before pushing
- Use idempotent SQL (`IF NOT EXISTS`, `OR REPLACE`)
- Keep migrations small and focused
- Add comments explaining complex changes
- Use descriptive migration names

❌ **DON'T:**

- Modify migration files after they're applied
- Delete applied migration files
- Skip testing locally
- Run migrations directly in SQL Editor (bypasses tracking)
- Commit generated files in `.supabase/` directory

## 🐛 Troubleshooting

### "Failed to link project"

```bash
# Make sure you have a valid access token
supabase link --project-ref hegqofubmkhmwjvpssdi

# If prompted, enter your database password
```

### "Migration already applied"

This is normal! Supabase CLI skips already-applied migrations.

### "Authentication failed in GitHub Actions"

1. Verify `SUPABASE_ACCESS_TOKEN` secret is set
2. Ensure token hasn't expired
3. Check token has necessary permissions

### "Cannot connect to database"

1. Check `SUPABASE_DB_PASSWORD` secret is correct
2. Verify project reference is correct
3. Ensure project is not paused

### View Logs

```bash
# GitHub Actions logs
# Go to: Actions tab → Select workflow run → View logs

# Local logs
supabase db push --debug
```

## 🆚 Comparison: Old vs New

| Feature              | Custom Script | Supabase CLI               |
| -------------------- | ------------- | -------------------------- |
| Setup                | Complex       | Simple                     |
| Migration tracking   | Custom table  | Built-in                   |
| Duplicate prevention | Manual        | Automatic                  |
| Rollback support     | Manual        | Built-in                   |
| Local testing        | Limited       | Full local dev environment |
| Official support     | No            | Yes                        |
| Maintenance          | High          | Low                        |
| Best practice        | ❌            | ✅                         |

## 📚 Additional Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Migration Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Local Development](https://supabase.com/docs/guides/cli/local-development)
- [Managing Environments](https://supabase.com/docs/guides/cli/managing-environments)

## 🎉 You're All Set!

Your migration system is now using Supabase CLI:

- ✅ Simpler setup
- ✅ Better reliability
- ✅ Built-in migration tracking
- ✅ Official support
- ✅ Best practices

Happy migrating! 🚀
