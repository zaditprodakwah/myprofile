import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: industries } = await supabase.from('industries').select('*');
  console.log('--- INDUSTRIES ---');
  console.log(JSON.stringify(industries, null, 2));

  const { data: tools } = await supabase.from('tools').select('category');
  const categories = Array.from(new Set(tools?.map(t => t.category)));
  console.log('--- TOOL CATEGORIES ---');
  console.log(JSON.stringify(categories, null, 2));

  const { data: radarCount } = await supabase.from('radar_items').select('count', { count: 'exact', head: true });
  console.log('--- RADAR COUNT ---');
  console.log(radarCount);
}

check();
