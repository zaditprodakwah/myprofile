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
const secret = env.ADMIN_SECRET_KEY || 'zadit_growth_secret_2026';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
  console.log('Fetching active feeds from database...');
  const { data: config, error } = await supabase
    .from('system_configs')
    .select('value')
    .eq('key', 'rss_feeds')
    .maybeSingle();

  if (error) {
    console.error('Error fetching feeds:', error);
    return;
  }

  let feeds = [];
  if (config && config.value) {
    feeds = typeof config.value === 'string' ? JSON.parse(config.value) : config.value;
  }

  if (feeds.length === 0) {
    console.log('No RSS feeds found.');
    return;
  }

  console.log(`Found ${feeds.length} feeds. Triggering ingestion locally...`);
  
  for (const feed of feeds) {
    if (!feed.is_active) {
      console.log(`Skipping inactive feed: ${feed.name}`);
      continue;
    }

    console.log(`Ingesting feed: ${feed.name} (${feed.url})...`);
    try {
      const res = await fetch('http://localhost:3000/api/agc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          secret,
          feedUrl: feed.url
        })
      });
      
      console.log(`Status: ${res.status}`);
      const body = await res.json();
      console.log('Result:', body);
    } catch (err) {
      console.error(`Failed to ingest feed ${feed.name}:`, err);
    }
  }

  console.log('Done triggering ingestion!');
}

main();
