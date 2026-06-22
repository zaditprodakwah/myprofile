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
  console.log('Testing insert of a mock article...');
  const { data, error } = await supabase.from('articles').insert({
    title: 'Test Article Ingestion',
    slug: 'test-article-ingestion',
    source_feed: 'test',
    original_url: 'https://example.com',
    content: '<p>This is a test article.</p>',
    meta_title: 'Test | Blog',
    meta_description: 'Test description',
    semantic_keywords: ['test', 'ingest'],
    faq_items: [{ question: 'Q?', answer: 'A.' }],
    is_published: true,
    published_at: new Date().toISOString()
  });

  if (error) {
    console.error('Insert error:', error);
  } else {
    console.log('Insert success!', data);
  }
}

main();
