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
  // Fetch current feeds
  const { data: config, error: fetchErr } = await supabase
    .from('system_configs')
    .select('*')
    .eq('key', 'rss_feeds')
    .maybeSingle();

  if (fetchErr) {
    console.error('Error fetching config:', fetchErr);
    return;
  }

  let feeds = [];
  if (config && config.value) {
    feeds = typeof config.value === 'string' ? JSON.parse(config.value) : config.value;
  }

  console.log('Current feeds:', feeds);

  // Update detik-finance URL
  const updatedFeeds = feeds.map(f => {
    if (f.id === 'detik-finance') {
      return {
        ...f,
        url: 'https://finance.detik.com/rss'
      };
    }
    return f;
  });

  console.log('Updated feeds:', updatedFeeds);

  // Save back to DB
  const { error: updateErr } = await supabase
    .from('system_configs')
    .update({ value: updatedFeeds, updated_at: new Date().toISOString() })
    .eq('key', 'rss_feeds');

  if (updateErr) {
    console.error('Error updating config:', updateErr);
  } else {
    console.log('Successfully updated Detik Finance RSS URL in system_configs!');
  }
}

main();
