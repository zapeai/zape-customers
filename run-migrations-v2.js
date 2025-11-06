const fs = require('fs');
const path = require('path');

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

/**
 * Execute SQL using Supabase Management API
 */
async function executeSQL(sql) {
  // Try using pg_net to execute SQL
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({
      query: sql
    })
  });

  if (!response.ok) {
    const text = await response.text();
    
    // If the error is about missing function, provide manual instructions
    if (text.includes('PGRST202')) {
      return { error: 'RPC_NOT_AVAILABLE', message: text };
    }
    
    throw new Error(`SQL execution failed: ${response.status} - ${text}`);
  }

  return { success: true };
}

/**
 * Run all migration files from the supabase/migrations directory
 */
async function runMigrations() {
  console.log('🚀 Starting database migrations...\n');
  console.log(`📍 Supabase URL: ${SUPABASE_URL}\n`);

  try {
    // Get all migration files sorted by name (which includes timestamp)
    const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort by filename (timestamp)

    console.log(`📂 Found ${migrationFiles.length} migration file(s)\n`);

    // Since direct SQL execution isn't available through REST API,
    // we'll need to use the Supabase Dashboard SQL Editor
    console.log('⚠️  Note: Supabase REST API does not support direct SQL execution.\n');
    console.log('Please run these migrations manually in the Supabase SQL Editor:\n');
    console.log(`🔗 https://supabase.com/dashboard/project/${projectRef}/sql/new\n`);
    console.log('─'.repeat(80));
    console.log('\nCopy and paste each migration file below:\n');
    console.log('─'.repeat(80));

    // Display each migration file content
    for (const filename of migrationFiles) {
      console.log(`\n📄 ${filename}`);
      console.log('─'.repeat(80));
      
      const filePath = path.join(migrationsDir, filename);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      console.log(sql);
      console.log('\n' + '─'.repeat(80));
    }

    console.log('\n\n✅ Instructions:');
    console.log('1. Open the SQL Editor: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
    console.log('2. Copy each migration above (in order) and run them one by one');
    console.log('3. Make sure all migrations complete successfully\n');

  } catch (error) {
    console.error('\n💥 Error reading migration files:');
    console.error(error);
    process.exit(1);
  }
}

runMigrations();

