const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const crypto = require('crypto');

// Read environment variables
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const DB_PASSWORD = env.SUPABASE_DB_PASSWORD;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Error: Missing SUPABASE_URL or SERVICE_KEY in .env file');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];

/**
 * Calculate checksum for a migration file
 */
function calculateChecksum(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Extract version and name from migration filename
 * Example: 20251106130020_create_quadra_ja_schema.sql
 */
function parseMigrationFilename(filename) {
  const match = filename.match(/^(\d+)_(.+)\.sql$/);
  if (!match) {
    throw new Error(`Invalid migration filename format: ${filename}`);
  }
  return {
    version: match[1],
    name: match[2].replace(/_/g, ' ')
  };
}

/**
 * Ensure schema_migrations table exists
 */
async function ensureMigrationTable(client) {
  const createTableSQL = `
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
    
    CREATE INDEX IF NOT EXISTS idx_schema_migrations_version ON public.schema_migrations(version);
    CREATE INDEX IF NOT EXISTS idx_schema_migrations_executed_at ON public.schema_migrations(executed_at DESC);
  `;
  
  await client.query(createTableSQL);
}

/**
 * Get list of already executed migrations
 */
async function getExecutedMigrations(client) {
  const result = await client.query(
    'SELECT version, name, executed_at, checksum FROM public.schema_migrations WHERE success = true ORDER BY version'
  );
  return new Map(result.rows.map(row => [row.version, row]));
}

/**
 * Record a migration as executed
 */
async function recordMigration(client, version, name, executionTimeMs, checksum, success = true) {
  await client.query(
    `INSERT INTO public.schema_migrations (version, name, execution_time_ms, checksum, success)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (version) DO UPDATE SET
       executed_at = NOW(),
       execution_time_ms = EXCLUDED.execution_time_ms,
       checksum = EXCLUDED.checksum,
       success = EXCLUDED.success`,
    [version, name, executionTimeMs, checksum, success]
  );
}

/**
 * Run all pending migration files
 */
async function runMigrations() {
  console.log('🚀 Starting database migrations with tracking...\n');
  console.log(`📍 Supabase Project: ${projectRef}\n`);

  try {
    // Get all migration files sorted by name (which includes timestamp)
    const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort by filename (timestamp)

    console.log(`📂 Found ${migrationFiles.length} migration file(s):\n`);
    migrationFiles.forEach(file => console.log(`   - ${file}`));
    console.log();

    if (!DB_PASSWORD) {
      console.log('⚠️  Database password not found in .env file.\n');
      console.log('To run migrations automatically, you need to:');
      console.log('1. Get your database password from Supabase Dashboard');
      console.log('2. Add it to .env file: SUPABASE_DB_PASSWORD=your_password\n');
      console.log('Alternatively, run migrations manually in SQL Editor:\n');
      console.log(`🔗 https://supabase.com/dashboard/project/${projectRef}/sql/new\n`);
      
      console.log('\nHere are the migration contents to copy:\n');
      console.log('='.repeat(80));
      
      for (const filename of migrationFiles) {
        console.log(`\n-- ${filename}`);
        console.log('-'.repeat(80));
        const filePath = path.join(migrationsDir, filename);
        const sql = fs.readFileSync(filePath, 'utf8');
        console.log(sql);
      }
      
      return;
    }

    // Connect to database
    const connectionString = `postgresql://postgres.${projectRef}:${DB_PASSWORD}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`;
    
    const client = new Client({ connectionString });
    
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!\n');

    // Ensure migration tracking table exists
    console.log('🔍 Setting up migration tracking...');
    await ensureMigrationTable(client);
    
    // Get already executed migrations
    const executedMigrations = await getExecutedMigrations(client);
    console.log(`📊 ${executedMigrations.size} migration(s) already executed\n`);

    // Filter out already executed migrations
    const pendingMigrations = migrationFiles.filter(filename => {
      const { version } = parseMigrationFilename(filename);
      return !executedMigrations.has(version);
    });

    if (pendingMigrations.length === 0) {
      console.log('✨ No pending migrations to run. Database is up to date!\n');
      await client.end();
      return;
    }

    console.log(`🎯 ${pendingMigrations.length} pending migration(s) to run:\n`);
    pendingMigrations.forEach(file => console.log(`   - ${file}`));
    console.log();

    // Run each pending migration
    let successCount = 0;
    let failCount = 0;

    for (const filename of pendingMigrations) {
      const { version, name } = parseMigrationFilename(filename);
      console.log(`▶️  Running: ${filename}...`);
      
      const filePath = path.join(migrationsDir, filename);
      const sql = fs.readFileSync(filePath, 'utf8');
      const checksum = calculateChecksum(sql);
      
      const startTime = Date.now();
      
      try {
        // Run migration in a transaction
        await client.query('BEGIN');
        await client.query(sql);
        
        const executionTime = Date.now() - startTime;
        
        // Record successful migration
        await recordMigration(client, version, name, executionTime, checksum, true);
        await client.query('COMMIT');
        
        console.log(`✅ Success: ${filename} (${executionTime}ms)\n`);
        successCount++;
        
      } catch (error) {
        await client.query('ROLLBACK');
        
        const executionTime = Date.now() - startTime;
        
        console.error(`❌ Failed: ${filename}`);
        console.error(`   Error: ${error.message}\n`);
        
        // Record failed migration
        try {
          await recordMigration(client, version, name, executionTime, checksum, false);
        } catch (recordError) {
          console.error('   Warning: Could not record migration failure');
        }
        
        failCount++;
        
        // Stop on first failure to prevent cascading issues
        console.error('🛑 Stopping migration process due to error.\n');
        break;
      }
    }

    await client.end();
    
    // Summary
    console.log('=' .repeat(60));
    console.log('📊 Migration Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${failCount}`);
    console.log(`   📝 Total executed: ${executedMigrations.size + successCount}`);
    console.log('=' .repeat(60));
    console.log();
    
    if (failCount > 0) {
      console.log('⚠️  Some migrations failed. Please fix errors and try again.');
      process.exit(1);
    } else {
      console.log('✨ All migrations completed successfully!\n');
      console.log('🎉 Your database is now up to date and ready to use.');
    }
    
  } catch (error) {
    console.error('\n💥 Migration process failed:');
    console.error(error);
    process.exit(1);
  }
}

runMigrations();
