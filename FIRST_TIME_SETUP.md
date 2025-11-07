# First Time Setup Guide

Follow these steps to get your development environment running.

## ✅ Prerequisites

1. **Node.js** - Already installed ✅
2. **Docker Desktop** - Needed for local Supabase

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- Supabase CLI (locally, no global install!)
- All other dependencies

### Step 2: Install Docker Desktop

**If you don't have Docker Desktop:**

```bash
# Option 1: Download from website
open https://www.docker.com/products/docker-desktop

# Option 2: Install via Homebrew
brew install --cask docker
```

### Step 3: Start Docker Desktop

```bash
# Start Docker Desktop
open -a Docker
```

**Wait for Docker to start** (whale icon appears in menu bar, usually 10-30 seconds)

### Step 4: Initialize Supabase (Already Done! ✅)

```bash
# This creates supabase/config.toml
npm run supabase -- init
```

**Note:** We already ran this for you! Skip if `supabase/config.toml` exists.

### Step 5: Start Local Supabase

```bash
npm run db:start
```

**First run takes 2-3 minutes** to download Docker images. Subsequent runs are instant!

You'll see output like:
```
Started supabase local development setup.

API URL: http://localhost:54321
GraphQL URL: http://localhost:54321/graphql/v1
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
Studio URL: http://localhost:54323
Inbucket URL: http://localhost:54324
JWT secret: super-secret-jwt-token...
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Copy the `anon key` and `service_role key`** - you'll need them!

### Step 6: Create .env.local

```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste_anon_key_here>
SUPABASE_SERVICE_ROLE_KEY=<paste_service_role_key_here>
EOF
```

Replace `<paste_anon_key_here>` and `<paste_service_role_key_here>` with the actual keys from step 5.

### Step 7: Apply Migrations

```bash
npm run db:push
```

This runs all migrations in `supabase/migrations/` to your local database.

### Step 8: Start Next.js

```bash
npm run dev
```

Open http://localhost:3000 🎉

---

## 🎯 Daily Workflow

After first-time setup, your daily workflow is simple:

```bash
# Start Docker Desktop (if not running)
open -a Docker

# Start Supabase
npm run db:start

# Start Next.js
npm run dev
```

---

## 🐛 Troubleshooting

### "Docker daemon not running"

```bash
# Start Docker Desktop
open -a Docker

# Wait 10-30 seconds, then try again
npm run db:start
```

### "Port already in use"

```bash
# Check what's using the ports
lsof -i :54321
lsof -i :54322
lsof -i :54323

# Stop Supabase
npm run db:stop

# Or kill specific port
kill -9 $(lsof -ti:54321)

# Restart
npm run db:start
```

### "Command not found: supabase"

```bash
# Reinstall dependencies
npm install

# Try again
npm run db:start
```

### "Migration failed"

```bash
# Reset database
npm run db:reset

# This will:
# 1. Drop all tables
# 2. Re-run all migrations
# 3. Run seed data
```

---

## 📋 Checklist

After completing setup, verify:

- [ ] Docker Desktop is installed and running
- [ ] `npm install` completed successfully
- [ ] `npm run db:start` shows Supabase URLs
- [ ] `.env.local` exists with correct keys
- [ ] `npm run db:push` applied migrations
- [ ] `npm run dev` starts Next.js
- [ ] http://localhost:3000 works
- [ ] http://localhost:54323 opens Studio UI

---

## 🎓 Next Steps

1. **Read NPM Scripts Guide**  
   → [NPM_SCRIPTS_GUIDE.md](NPM_SCRIPTS_GUIDE.md) for all available commands

2. **Open Studio UI**  
   ```bash
   npm run db:studio
   ```
   Explore your database visually at http://localhost:54323

3. **Create your first migration**  
   ```bash
   npm run db:migration:new my_first_feature
   ```

4. **Read full documentation**  
   → [START_HERE.md](START_HERE.md) for complete guide

---

## 📚 Quick Reference

```bash
# Daily workflow
npm run db:start    # Start Supabase
npm run dev         # Start Next.js
npm run db:studio   # Open Studio UI

# Migrations
npm run db:migration:new <name>  # Create migration
npm run db:push                  # Apply migrations
npm run db:reset                 # Reset database

# Status
npm run db:status               # Check Supabase status
npm run db:migration:list       # List migrations
```

---

## ✅ You're Ready!

Your local development environment is now set up! 🚀

**Start building:**
```bash
npm run db:start
npm run dev
```

Open http://localhost:3000 and start coding! 💻

---

*See [NPM_SCRIPTS_GUIDE.md](NPM_SCRIPTS_GUIDE.md) for complete command reference*

