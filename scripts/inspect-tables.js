const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(__dirname, '../.env.local');
const env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      env[key] = value;
    }
  });
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
  console.log('Querying table names via RPC or check table existence...');
  
  // Let's check table existence by selecting 0 rows from suspected tables
  const tables = [
    'articles',
    'system_configs',
    'audit_logs',
    'directory_entities',
    'cities',
    'leads',
    'contact_leads'
  ];

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(0);
      if (error) {
        console.log(`❌ Table "${table}": Error/Not Found:`, error.message);
      } else {
        console.log(`✅ Table "${table}": EXISTS`);
      }
    } catch (e) {
      console.log(`❌ Table "${table}": Exception`, e);
    }
  }
}

main();
