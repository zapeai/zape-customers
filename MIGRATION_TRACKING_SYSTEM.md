# Migration Tracking System

## Overview

This project now includes a robust migration tracking system that prevents duplicate migrations and provides a complete audit trail of database schema changes.

## How It Works

### 1. Schema Migrations Table

A `schema_migrations` table tracks all executed migrations:

```sql
CREATE TABLE public.schema_migrations (
  id SERIAL PRIMARY KEY,
  version VARCHAR(255) NOT NULL UNIQUE,      -- Migration timestamp (e.g., 20251106130020)
  name TEXT NOT NULL,                        -- Human-readable name
  executed_at TIMESTAMPTZ NOT NULL,          -- When it was executed
  execution_time_ms INTEGER,                 -- Execution duration
  success BOOLEAN NOT NULL DEFAULT TRUE,     -- Success/failure status
  checksum TEXT                              -- File content verification
);
```

### 2. Smart Migration Detection

The updated `run-migrations-pg.js` script:

1. ✅ **Connects to database** and ensures migration tracking table exists
2. ✅ **Queries executed migrations** from `schema_migrations` table
3. ✅ **Compares** with migration files on disk
4. ✅ **Runs only new/pending migrations** that haven't been executed
5. ✅ **Records each migration** with timestamp and execution time
6. ✅ **Calculates checksums** to verify file integrity

### 3. Protection Mechanisms

#### Database-Level Protection
- **Unique constraint** on `version` column prevents duplicate entries
- **Transaction-based** execution (ROLLBACK on failure)
- **Stop on first failure** to prevent cascading issues

#### Workflow-Level Protection (GitHub Actions)
- **Concurrency control**: Only one migration job at a time
- **Path filtering**: Only triggers on migration file changes
- **Change detection**: Skips if no migrations modified

## Benefits

### ✅ Prevents Duplicate Runs
- Each migration runs exactly once
- Safe to re-run the migration script
- Safe to trigger workflow multiple times

### ✅ Audit Trail
- Complete history of what ran and when
- Execution time metrics for performance monitoring
- Success/failure tracking for debugging

### ✅ Checksum Verification
- Detects if migration files are modified after execution
- Warns if previously-run migrations have changed

### ✅ Transactional Safety
- Each migration runs in a transaction
- Automatic rollback on failure
- No partial migrations

## Usage

### Running Migrations Locally

```bash
# Make sure you have DB_PASSWORD in .env
node run-migrations-pg.js
```

Output example:
```
🚀 Starting database migrations with tracking...
📍 Supabase Project: abcdefghijklmnop

📂 Found 5 migration file(s):
   - 20251106130020_create_quadra_ja_schema.sql
   - 20251106131138_update_courts_rls_for_public_access.sql
   - 20251106134238_add_club_owner_system.sql
   - 20251106140026_fix_profiles_rls_insert_policy.sql
   - 20251107000000_create_migration_tracking.sql

🔌 Connecting to database...
✅ Connected!

🔍 Setting up migration tracking...
📊 4 migration(s) already executed

🎯 1 pending migration(s) to run:
   - 20251107000000_create_migration_tracking.sql

▶️  Running: 20251107000000_create_migration_tracking.sql...
✅ Success: 20251107000000_create_migration_tracking.sql (234ms)

============================================================
📊 Migration Summary:
   ✅ Successful: 1
   ❌ Failed: 0
   📝 Total executed: 5
============================================================

✨ All migrations completed successfully!
🎉 Your database is now up to date and ready to use.
```

### Running Migrations in CI/CD

GitHub Actions automatically runs migrations when:
- Migration files are pushed to `main` branch
- `run-migrations-pg.js` is modified
- Manually triggered via workflow dispatch

## Migration History

View migration history in your database:

```sql
-- View all executed migrations
SELECT version, name, executed_at, execution_time_ms, success
FROM public.schema_migrations
ORDER BY executed_at DESC;

-- Check if a specific migration ran
SELECT * FROM public.schema_migrations
WHERE version = '20251107000000';

-- Find failed migrations
SELECT * FROM public.schema_migrations
WHERE success = false;
```

## Creating New Migrations

1. Create a new file in `supabase/migrations/`:
   ```
   YYYYMMDDHHMMSS_descriptive_name.sql
   ```

2. Write your SQL (use idempotent patterns):
   ```sql
   -- Good: Idempotent
   CREATE TABLE IF NOT EXISTS my_table (...);
   
   -- Good: Idempotent
   CREATE OR REPLACE FUNCTION my_function() ...;
   
   -- Avoid: Not idempotent
   ALTER TABLE my_table ADD COLUMN ...;
   -- Better:
   ALTER TABLE my_table ADD COLUMN IF NOT EXISTS ...;
   ```

3. Commit and push to `main` or run locally

## Troubleshooting

### Migration Failed in Production

1. **Check logs** in GitHub Actions
2. **Query failed migrations**:
   ```sql
   SELECT * FROM schema_migrations WHERE success = false;
   ```
3. **Fix the SQL** in the migration file
4. **Re-run**: The script will automatically retry failed migrations

### Reset Migration State (⚠️ Dangerous)

Only do this in development:

```sql
-- View all migrations
SELECT * FROM schema_migrations;

-- Remove a specific migration (it will re-run)
DELETE FROM schema_migrations WHERE version = '20251107000000';

-- Reset all migrations (⚠️ VERY DANGEROUS)
TRUNCATE schema_migrations;
```

### Verify Checksums

```sql
-- Find migrations with checksums
SELECT version, name, checksum
FROM schema_migrations
WHERE checksum IS NOT NULL;
```

If a checksum doesn't match the current file, it means the migration file was modified after execution, which should be avoided.

## Best Practices

### ✅ DO
- Use idempotent SQL commands (`IF NOT EXISTS`, `OR REPLACE`)
- Test migrations locally before pushing
- Keep migrations small and focused
- Use descriptive names
- Add comments explaining complex changes

### ❌ DON'T
- Modify migration files after they've been executed
- Delete migration files that have been run
- Run migrations directly in SQL Editor (bypasses tracking)
- Use non-transactional commands without careful consideration

## Architecture

```
┌─────────────────────────────────────────┐
│     GitHub Actions Workflow             │
│  (deploy-migrations.yml)                │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│     Migration Script                    │
│  (run-migrations-pg.js)                 │
│                                          │
│  1. Connect to database                 │
│  2. Ensure schema_migrations exists     │
│  3. Query executed migrations           │
│  4. Filter pending migrations           │
│  5. Run each in transaction             │
│  6. Record success/failure              │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│     Supabase PostgreSQL Database        │
│                                          │
│  ┌────────────────────────────────┐    │
│  │  schema_migrations             │    │
│  │  ├─ version (PK, UNIQUE)       │    │
│  │  ├─ name                        │    │
│  │  ├─ executed_at                 │    │
│  │  ├─ execution_time_ms           │    │
│  │  ├─ success                     │    │
│  │  └─ checksum                    │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

## Backfill Notice

The migration tracking system automatically backfills previously executed migrations:
- `20251106130020_create_quadra_ja_schema`
- `20251106131138_update_courts_rls_for_public_access`
- `20251106134238_add_club_owner_system`
- `20251106140026_fix_profiles_rls_insert_policy`

This ensures they won't be re-run when you first deploy the tracking system.

## Next Steps

1. ✅ Migration tracking is now set up
2. ✅ Push changes to GitHub
3. ✅ Add `SUPABASE_DB_PASSWORD` to GitHub Secrets (if not already added)
4. ✅ Test by creating a new migration file
5. ✅ Monitor the workflow in GitHub Actions

---

**Questions or Issues?** Check the migration logs or query `schema_migrations` table for insights.

