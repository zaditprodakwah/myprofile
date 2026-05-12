
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedTable(tableName: string, data: any[], mapFn?: (item: any) => any) {
  console.log(`Seeding ${tableName}...`);
  
  const mappedData = mapFn ? data.map(mapFn) : data;
  
  const { error } = await supabase
    .from(tableName)
    .upsert(mappedData, { onConflict: 'slug' });
    
  if (error) {
    console.error(`Error seeding ${tableName}:`, error);
  } else {
    console.log(`Successfully seeded ${tableName} (${mappedData.length} items)`);
  }
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

async function main() {
  const industries = JSON.parse(fs.readFileSync('data/industries.seed.json', 'utf8'));
  await seedTable('industries', industries);

  const problems = JSON.parse(fs.readFileSync('data/problems.seed.json', 'utf8'));
  await seedTable('problems', problems);

  const tools = JSON.parse(fs.readFileSync('data/tools.seed.json', 'utf8'));
  await seedTable('tools', tools);

  await seedTable('radar_sources', radarSources, (item) => ({
    name: item.name,
    slug: item.slug || slugify(item.name),
    url: item.rss_url,
    site_url: item.site_url,
    type: 'rss',
    priority: item.priority || 0,
    enabled: item.is_active ?? true,
    category: item.category || 'general',
    tier: item.priority > 80 ? 1 : (item.priority > 50 ? 2 : 3)
  }));

  console.log('Seed completed!');
}

main().catch(console.error);
