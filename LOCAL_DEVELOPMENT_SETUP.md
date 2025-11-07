# 🐳 Local Development Setup with Supabase

This guide shows you how to set up a **complete local Supabase environment** using Docker for development.

## 🎯 What You Get

When you run `supabase start`, you get a **full local Supabase stack**:

- ✅ **PostgreSQL Database** - Local database instance
- ✅ **Studio** - Web UI at http://localhost:54323
- ✅ **Auth Server** - Authentication service
- ✅ **Storage** - File storage service
- ✅ **Realtime** - Websocket server
- ✅ **REST API** - PostgREST API
- ✅ **Edge Functions** - Serverless functions (Deno)
- ✅ **Inbucket** - Email testing at http://localhost:54324

**All running locally in Docker containers!** 🚀

---

## 📋 Prerequisites

### 1. Install Docker Desktop

**macOS:**
```bash
# Download from Docker website
open https://www.docker.com/products/docker-desktop

# Or via Homebrew
brew install --cask docker
```

**Verify Docker is running:**
```bash
docker --version
docker ps
```

### 2. Install Supabase CLI

```bash
npm install -g supabase
```

Verify:
```bash
supabase --version
```

---

## 🚀 Quick Start (5 minutes)

### Step 1: Initialize Supabase in Your Project

```bash
cd /Users/guilhermesouzagoncalves/Dev/zapeai/zape-customers

# Initialize Supabase (if not already done)
supabase init
```

This creates:
- `supabase/config.toml` - Local configuration
- `supabase/.gitignore` - Ignores temporary files
- Your existing `supabase/migrations/` is preserved

### Step 2: Start Local Supabase

```bash
supabase start
```

**First run takes 2-3 minutes** (downloads Docker images).

Output will show:
```
Started supabase local development setup.

         API URL: http://localhost:54321
     GraphQL URL: http://localhost:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Open Supabase Studio

```bash
open http://localhost:54323
```

**Studio** gives you:
- 📊 Table Editor
- 🔐 Authentication management
- 📁 Storage browser
- 📝 SQL Editor
- 🔍 Database inspection
- 📈 Real-time logs

### Step 4: Run Your Migrations Locally

```bash
# Apply all migrations to local database
supabase db push
```

Your local database now has the same schema as production! ✅

### Step 5: Update Your Local `.env.local`

Create `.env.local` for local development:

```bash
# Create .env.local file
cat > .env.local << 'EOF'
# Local Supabase (from 'supabase start' output)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EOF
```

**Replace the `eyJh...` values** with the actual keys from your `supabase start` output.

**💡 Tip:** See [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md) for detailed environment setup instructions.

### Step 6: Run Your Next.js App

```bash
# In a new terminal
npm run dev
```

Your app now connects to **local Supabase**! 🎉

---

## 🔄 Daily Development Workflow

### Morning Setup
```bash
# Start local Supabase (if not running)
supabase start

# Run Next.js dev server
npm run dev
```

### Create a New Migration
```bash
# Create migration file
supabase migration new add_user_notifications

# Edit the file in supabase/migrations/

# Apply to local database
supabase db push

# Test in your app
# Visit http://localhost:3000

# Verify in Studio
open http://localhost:54323
```

### End of Day
```bash
# Stop Supabase (optional - keeps data)
supabase stop

# Or reset everything (⚠️ deletes local data)
supabase stop --no-backup
```

---

## 🎯 Working with Migrations

### Local Development Flow

```bash
# 1. Create migration
supabase migration new add_feature

# 2. Edit the SQL file
code supabase/migrations/*add_feature.sql

# 3. Apply to local database
supabase db push

# 4. Test in your app
npm run dev

# 5. If it works, commit and push
git add supabase/migrations/
git commit -m "feat: add feature"
git push origin main
# ✅ Auto-deploys to production via GitHub Actions
```

### Reset Local Database

```bash
# Reset to fresh state and re-run all migrations
supabase db reset
```

This:
1. Drops all tables
2. Re-runs all migrations in order
3. Gives you a clean slate

**Perfect for testing migration ordering!**

### Pull Production Schema

```bash
# Link to production first
supabase link --project-ref hegqofubmkhmwjvpssdi

# Pull current production schema as a new migration
supabase db pull
```

This creates a migration file with your current production schema.

### Diff Local vs Production

```bash
# See differences between local and production
supabase db diff
```

Shows SQL needed to make local match production.

---

## 🔍 Exploring Local Supabase

### Studio UI (Recommended)

```bash
open http://localhost:54323
```

- **Table Editor**: Browse and edit data
- **SQL Editor**: Run queries with saved snippets
- **Database**: View schema, functions, triggers
- **Authentication**: Manage test users
- **Storage**: Upload and manage files
- **Logs**: Real-time database logs

### Direct Database Connection

```bash
# Connect with psql
psql postgresql://postgres:postgres@localhost:54322/postgres

# Or use any PostgreSQL client
# Host: localhost
# Port: 54322
# User: postgres
# Password: postgres
# Database: postgres
```

### API Testing

```bash
# Test REST API
curl http://localhost:54321/rest/v1/courts \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

---

## 🧪 Testing with Local Data

### Seed Your Database

Create `supabase/seed.sql`:

```sql
-- Seed file for local development
-- This runs after migrations during db reset

-- Insert test users (example)
INSERT INTO public.profiles (id, email, full_name)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'test@example.com', 'Test User'),
  ('00000000-0000-0000-0000-000000000002', 'owner@example.com', 'Test Owner');

-- Insert test courts
INSERT INTO public.courts (name, description, hourly_rate, owner_id)
VALUES
  ('Test Court 1', 'A test court', 50.00, '00000000-0000-0000-0000-000000000002'),
  ('Test Court 2', 'Another test court', 75.00, '00000000-0000-0000-0000-000000000002');

-- Add more seed data as needed
```

Run seeds:
```bash
# Reset database and run seeds
supabase db reset
```

### Test Email Locally

**Inbucket** captures all emails sent by your app:

```bash
open http://localhost:54324
```

- All emails appear here (no real sending)
- Perfect for testing registration, password reset, etc.
- Click to view email contents

---

## 📊 Local vs Production

### Environment Variables

Use different `.env` files:

**`.env.local`** (local development):
```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh... (from supabase start)
```

**`.env.production`** (production):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://hegqofubmkhmwjvpssdi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh... (from Supabase Dashboard)
```

### Switch Environments

```bash
# Use local
cp .env.local .env
npm run dev

# Use production (be careful!)
cp .env.production .env
npm run dev
```

Or use Next.js built-in env handling:
```bash
# Local (default)
npm run dev

# Production (if needed for testing)
NODE_ENV=production npm run dev
```

---

## 🐳 Docker Commands

### Check Status

```bash
# See running containers
docker ps

# See Supabase containers
docker ps | grep supabase
```

### Supabase CLI Commands

```bash
# Start local Supabase
supabase start

# Stop (keeps data)
supabase stop

# Stop and remove all data
supabase stop --no-backup

# Restart
supabase stop && supabase start

# Check status
supabase status

# View logs
docker logs supabase_db_zape-customers
docker logs supabase_studio_zape-customers
```

### Troubleshooting

```bash
# Remove all Supabase containers
supabase stop --no-backup

# Clean Docker
docker system prune -a

# Restart fresh
supabase start
```

---

## ⚡ Advanced Features

### Run Edge Functions Locally

```bash
# Create an edge function
supabase functions new my-function

# Serve locally
supabase functions serve

# Test
curl http://localhost:54321/functions/v1/my-function
```

### Configure Local Instance

Edit `supabase/config.toml`:

```toml
[api]
enabled = true
port = 54321
max_rows = 1000

[db]
port = 54322
shadow_port = 54320

[studio]
enabled = true
port = 54323

# Add more configuration as needed
```

### Multiple Projects

```bash
# Each project has its own config
cd /path/to/project-1
supabase start

cd /path/to/project-2
supabase start

# Ports are unique per project
```

---

## 🔐 Local Authentication Testing

### Create Test Users in Studio

1. Open Studio: http://localhost:54323
2. Go to **Authentication** → **Users**
3. Click **Add user**
4. Create test accounts

### Or via SQL

```sql
-- In Studio SQL Editor
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  uuid_generate_v4(),
  'authenticated',
  'authenticated',
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

Then log in with: `test@example.com` / `password123`

---

## 📝 Best Practices

### ✅ DO

- ✅ Always test migrations locally first
- ✅ Use `supabase db reset` to test from scratch
- ✅ Create seed data for common scenarios
- ✅ Keep local and production in sync
- ✅ Use `.env.local` for local configuration
- ✅ Test RLS policies locally
- ✅ Use Studio for quick data inspection

### ❌ DON'T

- ❌ Don't commit `.env.local` files
- ❌ Don't test destructive operations on production
- ❌ Don't skip local testing before deploying
- ❌ Don't mix local and production connections
- ❌ Don't commit `supabase/.temp/` files

---

## 🔄 Sync Workflows

### From Production to Local

```bash
# 1. Link to production
supabase link --project-ref hegqofubmkhmwjvpssdi

# 2. Pull latest schema
supabase db pull

# 3. Apply to local
supabase db reset
```

### From Local to Production

```bash
# 1. Create migration locally
supabase migration new my_feature

# 2. Test locally
supabase db push

# 3. Deploy to production
git add supabase/migrations/
git commit -m "feat: my feature"
git push origin main
# GitHub Actions deploys automatically
```

---

## 🐛 Troubleshooting

### "Port already in use"

```bash
# Check what's using the port
lsof -i :54321
lsof -i :54322
lsof -i :54323

# Kill process or change port in config.toml
```

### "Docker not running"

```bash
# Start Docker Desktop
open -a Docker

# Wait for it to start, then
supabase start
```

### "Migration failed locally"

```bash
# Reset and try again
supabase db reset

# Check migration syntax
# Fix the SQL file
# Try again
supabase db push
```

### "Can't connect to local database"

```bash
# Check Supabase is running
supabase status

# If not, start it
supabase start

# Check connection string
# Should be: postgresql://postgres:postgres@localhost:54322/postgres
```

### "Studio won't load"

```bash
# Restart Supabase
supabase stop
supabase start

# Check Docker
docker ps | grep studio
```

---

## 📊 Project Structure with Local Setup

```
zape-customers/
├── .env.local              ← Local environment variables (gitignored)
├── .env.production         ← Production variables (gitignored)
├── supabase/
│   ├── .gitignore         ← Ignores temp files
│   ├── config.toml        ← Local Supabase configuration
│   ├── migrations/        ← Your migrations
│   └── seed.sql           ← Optional seed data
├── src/
│   └── ...                ← Your Next.js app
└── docker-compose.yml      ← Created by supabase init
```

---

## 🎉 Quick Reference

### Essential Commands

```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Check status
supabase status

# Reset database (re-run all migrations)
supabase db reset

# Apply new migrations
supabase db push

# Create new migration
supabase migration new name

# Open Studio
open http://localhost:54323

# View logs
docker logs -f supabase_db_zape-customers
```

### Useful URLs

- **Studio**: http://localhost:54323
- **API**: http://localhost:54321
- **Database**: postgresql://postgres:postgres@localhost:54322/postgres
- **Inbucket (Email)**: http://localhost:54324

---

## 🚀 Next Steps

1. ✅ **Install Docker** - Docker Desktop
2. ✅ **Initialize Supabase** - `supabase init`
3. ✅ **Start local stack** - `supabase start`
4. ✅ **Create `.env.local`** - With local credentials
5. ✅ **Run migrations** - `supabase db push`
6. ✅ **Start dev server** - `npm run dev`
7. ✅ **Open Studio** - http://localhost:54323
8. ✅ **Create seed data** - `supabase/seed.sql`
9. ✅ **Test your app** - http://localhost:3000

---

## 📚 Additional Resources

- [Supabase Local Development](https://supabase.com/docs/guides/cli/local-development)
- [Docker Documentation](https://docs.docker.com/)
- [Supabase Studio Guide](https://supabase.com/docs/guides/platform/studio)
- [Local Testing Guide](https://supabase.com/docs/guides/cli/testing-and-linting)

---

**🎊 You now have a complete local development environment!**

Test migrations safely, develop offline, and ship with confidence. 🚀

---

*Last Updated: November 2025*

