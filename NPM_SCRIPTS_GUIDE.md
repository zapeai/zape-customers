# 📦 NPM Scripts Guide - Supabase CLI

**No global installation needed!** Just `npm install` and use npm scripts. ✨

## 🎯 Philosophy

The Supabase CLI is installed **locally** as a dev dependency. This means:
- ✅ No global installation required
- ✅ Everyone uses the same CLI version
- ✅ Version controlled in `package.json`
- ✅ Works out of the box after `npm install`

## 🚀 Quick Start

```bash
# 1. Install dependencies (includes Supabase CLI)
npm install

# 2. Start local Supabase
npm run db:start

# 3. Run migrations
npm run db:push

# 4. Start Next.js
npm run dev

# 5. Open Studio
npm run db:studio
```

**That's it!** No global CLI needed. 🎉

---

## 📋 Available Scripts

### Development Server

```bash
# Start Next.js development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Local Supabase (Docker)

```bash
# Start local Supabase stack
npm run db:start
# First run downloads Docker images (~2-3 minutes)
# Starts: PostgreSQL, Studio, Auth, Storage, Realtime, etc.

# Stop local Supabase (keeps data)
npm run db:stop

# Check status of local Supabase
npm run db:status

# Reset database (re-runs all migrations + seeds)
npm run db:reset
```

### Migrations

```bash
# Create new migration
npm run db:migration:new my_feature_name
# Creates: supabase/migrations/TIMESTAMP_my_feature_name.sql

# List all migrations
npm run db:migration:list

# Push migrations (run locally or on linked project)
npm run db:push

# Pull schema from remote as migration
npm run db:pull

# Diff local vs remote schema
npm run db:diff
```

### Project Management

```bash
# Link to production project
npm run db:link
# Prompts for access token and DB password

# Open Studio UI in browser
npm run db:studio
# Opens: http://localhost:54323

# Run seed data (same as db:reset)
npm run db:seed
```

### Advanced

```bash
# Run any Supabase CLI command
npm run supabase -- [command] [options]

# Examples:
npm run supabase -- --help
npm run supabase -- functions new my-function
npm run supabase -- gen types typescript --local
```

---

## 🔄 Daily Workflow

### Morning Setup

```bash
# Start local Supabase
npm run db:start

# Start Next.js
npm run dev
```

### Create New Feature

```bash
# 1. Create migration
npm run db:migration:new add_user_notifications

# 2. Edit the generated file
code supabase/migrations/*add_user_notifications.sql

# 3. Apply to local database
npm run db:push

# 4. Check in Studio
npm run db:studio

# 5. Test in app
# Visit http://localhost:3000
```

### Deploy to Production

```bash
# Commit and push (GitHub Actions handles deployment)
git add supabase/migrations/
git commit -m "feat: add user notifications"
git push origin main

# GitHub Actions automatically runs:
# - supabase link
# - supabase db push
```

---

## 📊 Script Reference

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `next dev` | Start Next.js dev server |
| `npm run db:start` | `supabase start` | Start local Supabase |
| `npm run db:stop` | `supabase stop` | Stop local Supabase |
| `npm run db:status` | `supabase status` | Check Supabase status |
| `npm run db:reset` | `supabase db reset` | Reset & re-run migrations |
| `npm run db:push` | `supabase db push` | Run pending migrations |
| `npm run db:pull` | `supabase db pull` | Pull remote schema |
| `npm run db:diff` | `supabase db diff` | Diff local vs remote |
| `npm run db:link` | `supabase link` | Link to production |
| `npm run db:migration:new` | `supabase migration new` | Create migration |
| `npm run db:migration:list` | `supabase migration list` | List migrations |
| `npm run db:studio` | `open ...` | Open Studio UI |
| `npm run db:seed` | `supabase db reset` | Run seed data |
| `npm run supabase` | `supabase` | Direct CLI access |

---

## 🎓 Examples

### Create and Test Migration

```bash
# Create migration
npm run db:migration:new add_comments_table

# Edit the file (adds SQL)
# supabase/migrations/TIMESTAMP_add_comments_table.sql

# Apply locally
npm run db:push

# Check in Studio
npm run db:studio
# Navigate to Table Editor

# If wrong, reset and fix
npm run db:reset
```

### Link to Production

```bash
# First time linking
npm run db:link
# Enter access token: [from https://supabase.com/dashboard/account/tokens]
# Enter DB password: [from Dashboard → Settings → Database]

# Check status
npm run db:status

# Push migrations to production
npm run db:push
```

### Pull Production Schema

```bash
# Link to production first
npm run db:link

# Pull current production schema
npm run db:pull
# Creates new migration file with production schema

# Review the generated migration
cat supabase/migrations/*
```

### Reset and Seed

```bash
# Reset database (drops all data, re-runs migrations)
npm run db:reset

# This also runs supabase/seed.sql if it exists
# Great for starting fresh with test data
```

---

## 🐛 Troubleshooting

### "Command not found: supabase"

**This shouldn't happen!** But if it does:

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or run directly
npx supabase --version
```

### Port Already in Use

```bash
# Check what's using the port
lsof -i :54321
lsof -i :54322
lsof -i :54323

# Stop Supabase
npm run db:stop

# Or change ports in supabase/config.toml
```

### Docker Not Running

```bash
# Start Docker Desktop
open -a Docker

# Wait for it to start, then
npm run db:start
```

### Migration Failed

```bash
# Check the error in output
# Fix the SQL file
# Reset and try again
npm run db:reset
```

---

## 🔐 First Time Setup

### 1. Install Dependencies

```bash
npm install
# Installs Supabase CLI locally
```

### 2. Start Local Supabase

```bash
npm run db:start
# Downloads Docker images (first time only)
# Shows API URL, anon key, service_role key
```

### 3. Create .env.local

```bash
# Copy keys from db:start output
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<paste_service_role_key>
EOF
```

### 4. Run Migrations

```bash
npm run db:push
```

### 5. Start Development

```bash
npm run dev
```

---

## 💡 Pro Tips

### Alias for Faster Commands

Add to your `~/.zshrc` or `~/.bashrc`:

```bash
alias db:start="npm run db:start"
alias db:push="npm run db:push"
alias db:studio="npm run db:studio"
```

### Create Migration Template

```bash
# Create and immediately edit
npm run db:migration:new my_feature && \
  code supabase/migrations/*my_feature.sql
```

### Check Before Push

```bash
# See what will change
npm run db:diff

# If looks good
npm run db:push
```

### Quick Reset Workflow

```bash
# Reset, push, and start
npm run db:reset && npm run dev
```

---

## 🆚 Global vs Local CLI

### Global Installation (Old Way)
```bash
npm install -g supabase
supabase start
```

❌ Problems:
- Different versions across team members
- Requires manual installation
- Not version controlled
- CI/CD needs separate setup

### Local Installation (Our Way)
```bash
npm install
npm run db:start
```

✅ Benefits:
- Everyone uses same version
- Works immediately after `npm install`
- Version controlled in `package.json`
- CI/CD just needs `npm install`
- No global installation needed

---

## 📦 Package.json Scripts

```json
{
  "scripts": {
    "db:start": "supabase start",
    "db:stop": "supabase stop",
    "db:status": "supabase status",
    "db:reset": "supabase db reset",
    "db:push": "supabase db push",
    "db:pull": "supabase db pull",
    "db:diff": "supabase db diff",
    "db:link": "supabase link --project-ref hegqofubmkhmwjvpssdi",
    "db:migration:new": "supabase migration new",
    "db:migration:list": "supabase migration list",
    "db:studio": "open http://localhost:54323",
    "supabase": "supabase"
  },
  "devDependencies": {
    "supabase": "^1.200.3"
  }
}
```

---

## 🎉 Summary

**No global CLI needed!** Everything is automated through npm scripts:

```bash
# Setup (once)
npm install

# Daily workflow
npm run db:start          # Start Supabase
npm run dev               # Start Next.js
npm run db:migration:new  # Create migration
npm run db:push           # Apply migration
npm run db:studio         # Open Studio

# Deploy
git push origin main      # Auto-deploys via GitHub Actions
```

---

## 📚 Related Documentation

- [START_HERE.md](START_HERE.md) - Main guide
- [LOCAL_DEVELOPMENT_SETUP.md](LOCAL_DEVELOPMENT_SETUP.md) - Local dev guide
- [QUICK_START_SUPABASE_CLI.md](QUICK_START_SUPABASE_CLI.md) - Quick start

---

**✨ Simple, consistent, no global installs!**

*Last Updated: November 2025*

