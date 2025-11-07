-- Migration: Create migration tracking system
-- Description: This migration creates a table to track which migrations have been applied
-- Author: System
-- Date: 2025-11-07

-- Create schema_migrations table to track applied migrations
CREATE TABLE IF NOT EXISTS public.schema_migrations (
  id SERIAL PRIMARY KEY,
  version VARCHAR(255) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  execution_time_ms INTEGER,
  success BOOLEAN NOT NULL DEFAULT TRUE,
  checksum TEXT,
  CONSTRAINT schema_migrations_version_key UNIQUE (version)
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_schema_migrations_version ON public.schema_migrations(version);
CREATE INDEX IF NOT EXISTS idx_schema_migrations_executed_at ON public.schema_migrations(executed_at DESC);

-- Add comment to table
COMMENT ON TABLE public.schema_migrations IS 'Tracks database migration history and prevents duplicate migrations';
COMMENT ON COLUMN public.schema_migrations.version IS 'Migration version/timestamp (e.g., 20251106130020)';
COMMENT ON COLUMN public.schema_migrations.name IS 'Human-readable migration name';
COMMENT ON COLUMN public.schema_migrations.executed_at IS 'When the migration was executed';
COMMENT ON COLUMN public.schema_migrations.execution_time_ms IS 'How long the migration took in milliseconds';
COMMENT ON COLUMN public.schema_migrations.success IS 'Whether the migration completed successfully';
COMMENT ON COLUMN public.schema_migrations.checksum IS 'Optional checksum of migration file for verification';

-- Backfill existing migrations (if any were already applied)
-- This ensures we don't re-run migrations that were applied before tracking was added
INSERT INTO public.schema_migrations (version, name, success, execution_time_ms)
VALUES 
  ('20251106130020', 'create_quadra_ja_schema', true, 0),
  ('20251106131138', 'update_courts_rls_for_public_access', true, 0),
  ('20251106134238', 'add_club_owner_system', true, 0),
  ('20251106140026', 'fix_profiles_rls_insert_policy', true, 0)
ON CONFLICT (version) DO NOTHING;

-- Note: The above INSERT backfills existing migrations assuming they were successful.
-- If you're running this migration for the first time and haven't run previous migrations,
-- you may want to remove those entries or adjust accordingly.

