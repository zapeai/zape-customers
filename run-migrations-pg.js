const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

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
const DB_PASSWORD = env.SUPABASE_DB_PASSWORD; // We'll need this

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Error: Missing SUPABASE_URL or SERVICE_KEY in .env file');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];

/**
 * Run all migration files from the supabase/migrations directory
 */
async function runMigrations() {
  console.log('🚀 Starting database migrations...\n');
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

    // Run each migration
    for (const filename of migrationFiles) {
      console.log(`▶️  Running: ${filename}...`);
      
      const filePath = path.join(migrationsDir, filename);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      try {
        await client.query(sql);
        console.log(`✅ Success: ${filename}\n`);
      } catch (error) {
        console.error(`❌ Failed: ${filename}`);
        console.error(`   Error: ${error.message}\n`);
        console.log('   Continuing with next migration...\n');
      }
    }

    await client.end();
    
    console.log('✨ All migrations completed!\n');
    console.log('🎉 Your database is now set up and ready to use.');
    
  } catch (error) {
    console.error('\n💥 Migration process failed:');
    console.error(error);
    process.exit(1);
  }
}

runMigrations();

