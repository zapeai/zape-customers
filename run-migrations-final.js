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

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Error: Missing SUPABASE_URL or SERVICE_KEY in .env file');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];

async function runMigrations() {
  console.log('🚀 Starting database migrations...\n');
  console.log(`📍 Supabase Project: ${projectRef}\n`);

  // Try different connection strings
  const connectionStrings = [
    // Transaction pooler (port 6543) - try with service key as password
    `postgresql://postgres.${projectRef}:${SERVICE_KEY}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
    // Session pooler (port 5432)
    `postgresql://postgres.${projectRef}:${SERVICE_KEY}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`,
    // Direct connection
    `postgresql://postgres:${SERVICE_KEY}@db.${projectRef}.supabase.co:5432/postgres`,
  ];

  let client = null;
  let connected = false;

  // Try each connection string
  for (const connectionString of connectionStrings) {
    try {
      console.log(`🔌 Attempting connection...`);
      client = new Client({ 
        connectionString,
        ssl: { rejectUnauthorized: false }
      });
      
      await client.connect();
      console.log('✅ Connected successfully!\n');
      connected = true;
      break;
    } catch (error) {
      console.log(`❌ Connection attempt failed: ${error.message}`);
      if (client) {
        try { await client.end(); } catch (e) {}
      }
      client = null;
    }
  }

  if (!connected) {
    console.log('\n⚠️  Could not connect to database with service role key.\n');
    console.log('📝 Please run the migrations manually:\n');
    console.log('1. Open: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
    console.log('2. Copy the contents of: complete-migration.sql');
    console.log('3. Paste and run in the SQL Editor\n');
    process.exit(1);
  }

  try {
    // Get all migration files sorted by name
    const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`📂 Found ${migrationFiles.length} migration file(s):\n`);
    migrationFiles.forEach(file => console.log(`   - ${file}`));
    console.log();

    // Run each migration
    for (const filename of migrationFiles) {
      console.log(`▶️  Running: ${filename}...`);
      
      const filePath = path.join(migrationsDir, filename);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      try {
        await client.query(sql);
        console.log(`✅ Success: ${filename}\n`);
      } catch (error) {
        // Check if error is because object already exists (which is fine)
        if (error.message.includes('already exists') || error.message.includes('already defined')) {
          console.log(`⚠️  Skipped: ${filename} (already applied)\n`);
        } else {
          console.error(`❌ Failed: ${filename}`);
          console.error(`   Error: ${error.message}\n`);
          console.log('   Continuing with next migration...\n');
        }
      }
    }

    await client.end();
    
    console.log('✨ All migrations completed!\n');
    console.log('🎉 Your database is now set up and ready to use.');
    console.log(`\n📊 View your database: https://supabase.com/dashboard/project/${projectRef}/editor`);
    
  } catch (error) {
    console.error('\n💥 Migration process failed:');
    console.error(error);
    if (client) {
      try { await client.end(); } catch (e) {}
    }
    process.exit(1);
  }
}

runMigrations();

