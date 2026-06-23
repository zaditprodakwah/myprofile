const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
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

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase credentials!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const newFeedsList = [
  {
    id: "google-news-seo",
    url: "https://news.google.com/rss/search?q=seo+growth+marketing+indonesia&hl=id&gl=ID&ceid=ID:id",
    name: "Google News SEO & Growth",
    is_active: true
  },
  {
    id: "detik-finance",
    url: "https://finance.detik.com/rss",
    name: "Detik Finance",
    is_active: true
  },
  {
    id: "antara-ekonomi",
    url: "https://www.antaranews.com/rss/ekonomi.xml",
    name: "Antara News Ekonomi",
    is_active: true
  },
  {
    id: "cnbc-news",
    url: "https://www.cnbcindonesia.com/news/rss",
    name: "CNBC Indonesia News",
    is_active: true
  },
  {
    id: "cnn-ekonomi",
    url: "https://www.cnnindonesia.com/ekonomi/rss",
    name: "CNN Indonesia Ekonomi",
    is_active: true
  },
  {
    id: "tempo-bisnis",
    url: "https://rss.tempo.co/bisnis",
    name: "Tempo Bisnis",
    is_active: true
  },
  {
    id: "republika-ekonomi",
    url: "https://www.republika.co.id/rss/ekonomi/",
    name: "Republika Ekonomi",
    is_active: true
  },
  {
    id: "top4marketing",
    url: "https://www.top4marketing.co.id/feed/",
    name: "Top4Marketing Blog",
    is_active: true
  },
  {
    id: "bramasta-blog",
    url: "https://www.bramasta.id/feed/",
    name: "Bramasta Marketing Blog",
    is_active: true
  },
  {
    id: "bahasabisnis",
    url: "https://bahasabisnis.id/feed/",
    name: "Bahasa Bisnis",
    is_active: true
  },
  {
    id: "arxiv-cs-ir",
    url: "https://rss.arxiv.org/rss/cs.IR",
    name: "arXiv Scholar Search & Info Retrieval",
    is_active: true
  }
];

async function seedFeeds() {
  console.log('Seeding RSS feeds configuration into Supabase system_configs...');
  
  const { data, error } = await supabase
    .from('system_configs')
    .upsert(
      {
        key: 'rss_feeds',
        value: newFeedsList,
        description: 'Daftar RSS feed sumber Ingest berita (Terverifikasi & Terdiversifikasi)'
      },
      { onConflict: 'key' }
    )
    .select();

  if (error) {
    console.error('Failed to upsert RSS feeds:', error.message);
  } else {
    console.log('RSS feeds seeded successfully! Active feeds count:', newFeedsList.length);
    console.log(data);
  }
}

seedFeeds();
