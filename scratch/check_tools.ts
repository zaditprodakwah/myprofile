const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTools() {
  const { data: tools, error } = await supabase.from('tools').select('name, slug, category');
  if (error) console.error(error);
  console.log('--- TOOLS LIST ---');
  console.log(JSON.stringify(tools, null, 2));
  console.log('--- TOTAL TOOLS ---', tools?.length);
}

checkTools();
