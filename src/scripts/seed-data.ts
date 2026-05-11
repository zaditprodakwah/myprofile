import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function loadSeedFile(filename: string) {
  const filePath = path.resolve(process.cwd(), 'data', filename);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

async function seed() {
  console.log('🌱 Starting Seed Upgrade 3.0...');

  const industries = await loadSeedFile('industries.seed.json');
  const problems = await loadSeedFile('problems.seed.json');
  const tools = await loadSeedFile('tools.seed.json');
  const sources = await loadSeedFile('radar-sources.seed.json');

  if (industries) {
    const { error } = await supabase.from('industries').upsert(industries, { onConflict: 'slug' });
    if (error) console.error('Error seeding industries:', error.message);
    else console.log('✅ Industries seeded');
  }

  if (problems) {
    const { error } = await supabase.from('problems').upsert(problems, { onConflict: 'slug' });
    if (error) console.error('Error seeding problems:', error.message);
    else console.log('✅ Problems seeded');
  }

  if (sources) {
    const { error } = await supabase.from('radar_sources').upsert(sources, { onConflict: 'slug' });
    if (error) console.error('Error seeding radar sources:', error.message);
    else console.log('✅ Radar sources seeded');
  }

  if (tools) {
    const { error } = await supabase.from('tools').upsert(tools, { onConflict: 'slug' });
    if (error) console.error('Error seeding tools:', error.message);
    else console.log('✅ Tools seeded');
  }

  console.log('🏁 Seed completed!');
}

seed();
