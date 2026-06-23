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
  const jobId = require('uuid').v4();
  console.log('Testing insert into public.jobs with jobId:', jobId);
  
  // Try inserting with target_type 'PDF_CV'
  const { data, error } = await supabase
    .from('jobs')
    .insert([{ id: jobId, target_type: 'PDF_CV', target_id: null }]);

  if (error) {
    console.error('❌ Insert FAILED with error:', error);
  } else {
    console.log('✅ Insert SUCCESS! Data:', data);
    
    // Clean up
    const { error: deleteError } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);
    if (deleteError) {
      console.error('Failed to clean up:', deleteError);
    } else {
      console.log('Cleaned up test job successfully.');
    }
  }
}

main();
