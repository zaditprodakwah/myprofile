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
  console.log('Querying one article to inspect columns...');
  // We inserted one test article earlier, so we can select it
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching article:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Article schema keys:', Object.keys(data[0]));
    console.log('Row values:', JSON.stringify(data[0], null, 2));
  } else {
    console.log('No articles found to inspect.');
  }
}

main();
