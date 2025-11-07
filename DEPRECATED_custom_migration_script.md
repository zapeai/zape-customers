# ⚠️ DEPRECATED: Custom Migration Script

**This approach is no longer recommended.**

## 🔄 Migration to Supabase CLI

This project **previously used** a custom Node.js migration script (`run-migrations-pg.js`). 

**We have now migrated to using the official Supabase CLI**, which provides:
- ✅ Better reliability
- ✅ Built-in migration tracking
- ✅ Official support
- ✅ Simpler setup
- ✅ Less maintenance

## 📁 Deprecated Files

The following files are **no longer used**:

- ❌ `run-migrations-pg.js` - Custom migration script
- ❌ `run-migrations.js` - Old migration script
- ❌ `run-migrations-v2.js` - Old migration script
- ❌ `run-migrations-final.js` - Old migration script
- ❌ `MIGRATION_TRACKING_SYSTEM.md` - Custom tracking docs (now built into Supabase CLI)

These files have been kept for reference but should not be used.

## ✅ Use Instead

**New approach:**
- Read: [SUPABASE_CLI_SETUP.md](./SUPABASE_CLI_SETUP.md)
- Quick start: [QUICK_START_SUPABASE_CLI.md](./QUICK_START_SUPABASE_CLI.md)
- Run migrations: `supabase db push`

## 🤔 Why the Change?

| Feature | Custom Script | Supabase CLI |
|---------|--------------|--------------|
| Setup complexity | High (manual DB connection) | Low (access token) |
| Migration tracking | Custom table | Built-in |
| Duplicate prevention | Custom logic | Automatic |
| Local testing | Limited | Full environment |
| Rollback support | Manual | Built-in |
| Maintenance | We maintain it | Supabase maintains it |

## 🔄 Transition Guide

If you were using the old custom script:

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Link Your Project
```bash
supabase link --project-ref hegqofubmkhmwjvpssdi
```

### 3. Use CLI Instead
```bash
# Old way (deprecated):
node run-migrations-pg.js

# New way:
supabase db push
```

### 4. Update GitHub Secrets

Old secrets (no longer needed for migrations):
- ~~SUPABASE_URL~~ (still used by Next.js app)
- ~~SUPABASE_SERVICE_ROLE_KEY~~ (still used by Next.js app)

New secrets (for CLI):
- ✅ `SUPABASE_ACCESS_TOKEN` - Personal access token
- ✅ `SUPABASE_PROJECT_REF` - Project reference
- ✅ `SUPABASE_DB_PASSWORD` - Database password

## 📝 What About My Existing Migrations?

**All your existing migrations are preserved!**

The migration files in `supabase/migrations/` work with both approaches:
- `20251106130020_create_quadra_ja_schema.sql` ✅
- `20251106131138_update_courts_rls_for_public_access.sql` ✅
- `20251106134238_add_club_owner_system.sql` ✅
- `20251106140026_fix_profiles_rls_insert_policy.sql` ✅
- `20251107000000_create_migration_tracking.sql` ✅

Supabase CLI will:
1. Check which migrations were already applied
2. Skip them (no duplicates)
3. Only run new migrations

## 🗑️ Can I Delete Old Files?

**Yes**, but keep them for now in case you need to reference the logic.

Safe to delete later:
- `run-migrations-pg.js`
- `run-migrations.js`
- `run-migrations-v2.js`
- `run-migrations-final.js`
- `setup-database.sh`
- `create-migration.sh`
- `commit-gitignore-changes.sh`
- `complete-migration.sql`

## ❓ Questions?

See the new documentation:
- [SUPABASE_CLI_SETUP.md](./SUPABASE_CLI_SETUP.md) - Complete setup guide
- [QUICK_START_SUPABASE_CLI.md](./QUICK_START_SUPABASE_CLI.md) - Quick start

---

**Bottom line:** Use `supabase db push` instead of `node run-migrations-pg.js` 🚀

