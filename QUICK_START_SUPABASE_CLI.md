# Quick Start: Supabase CLI Migrations

**🎯 This project uses Supabase CLI via npm scripts** - no global installation needed!

## ⚡ Quick Setup (3 minutes)

### 1. Install Dependencies

```bash
# Installs Supabase CLI locally
npm install
```

**That's it!** No global installation needed. ✅

### 2. Start Local Development (Recommended)

```bash
# Start local Supabase
npm run db:start

# Apply migrations
npm run db:push

# Start Next.js
npm run dev
```

### OR Link to Production

```bash
# Link to production
npm run db:link

# When prompted:
# - Access token: Generate at https://supabase.com/dashboard/account/tokens
# - Database password: Found in Supabase Dashboard → Settings → Database

# Apply migrations
npm run db:push
```

## 🚀 GitHub Actions Setup (3 secrets)

Add these to **Repository → Settings → Secrets**:

1. **SUPABASE_ACCESS_TOKEN**
   - Generate: https://supabase.com/dashboard/account/tokens
   
2. **SUPABASE_PROJECT_REF**
   - Value: `hegqofubmkhmwjvpssdi`
   
3. **SUPABASE_DB_PASSWORD**
   - From: Supabase Dashboard → Settings → Database

## 📝 Create a New Migration

```bash
# Create migration file
npm run db:migration:new my_feature_name

# Edit the generated file in supabase/migrations/

# Test locally
npm run db:push

# Commit and push - auto-deploys to production!
git add supabase/migrations/
git commit -m "feat: add my_feature_name"
git push origin main
```

## 🐳 Local Development (Recommended)

Want a **full local Supabase** for development?

```bash
# Install dependencies (if not done)
npm install

# Install Docker Desktop
brew install --cask docker

# Start local Supabase
npm run db:start

# Open Studio UI
npm run db:studio

# Test migrations locally
npm run db:push
```

**→ See [LOCAL_DEVELOPMENT_SETUP.md](LOCAL_DEVELOPMENT_SETUP.md) or [NPM_SCRIPTS_GUIDE.md](NPM_SCRIPTS_GUIDE.md) for complete guide**

Benefits:
- ✅ No global CLI installation
- ✅ Full local database
- ✅ Test without touching production
- ✅ Studio UI for data management
- ✅ Email testing with Inbucket
- ✅ Offline development

## 🔍 Check Status

```bash
# See linked project or local status
npm run db:status

# List migrations
npm run db:migration:list
```

## ❓ Need Help?

- **NPM Scripts**: [NPM_SCRIPTS_GUIDE.md](./NPM_SCRIPTS_GUIDE.md) ⭐ All npm commands
- **Complete setup**: [SUPABASE_CLI_SETUP.md](./SUPABASE_CLI_SETUP.md)
- **Local development**: [LOCAL_DEVELOPMENT_SETUP.md](./LOCAL_DEVELOPMENT_SETUP.md)
- **Main guide**: [START_HERE.md](./START_HERE.md)

## 🎉 Benefits

- ✅ **No global installation** - Just `npm install`!
- ✅ Version controlled CLI (everyone uses same version)
- ✅ No database password needed locally (uses access token)
- ✅ Built-in migration tracking (no custom tables needed)
- ✅ Automatic duplicate prevention
- ✅ Rollback support
- ✅ Local development environment
- ✅ Official Supabase support

## 📊 Migration Flow

```
npm install → npm run db:migration:new → npm run db:push → git push → Auto-deploy! 🚀
```

Done! Start creating migrations with confidence. 💪

