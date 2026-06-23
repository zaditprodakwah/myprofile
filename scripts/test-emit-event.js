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
  console.log('Testing event emit for jobId:', jobId);

  try {
    // 1. Insert job
    const { error: jobError } = await supabase
      .from('jobs')
      .insert([{ id: jobId, target_type: 'PDF_CV', target_id: null }]);
    if (jobError) throw jobError;
    console.log('✅ Job inserted');

    // 2. Insert event
    const { error: eventError } = await supabase.from('job_events').insert([
      {
        job_id: jobId,
        aggregate_id: jobId,
        aggregate_type: 'Job',
        event_name: 'AuditRequested',
        event_version: 1,
        payload_json: { target_url: 'storage://cv-uploads/test.pdf', source: 'pdf_cv' },
        metadata_json: { requested_via: 'test_script' },
        correlation_id: jobId,
      }
    ]);
    if (eventError) throw eventError;
    console.log('✅ Event inserted');

    // 3. Update job status
    const { error: updateError } = await supabase
      .from('jobs')
      .update({ status: 'QUEUED', updated_at: new Date().toISOString() })
      .eq('id', jobId);
    if (updateError) throw updateError;
    console.log('✅ Job updated successfully!');

    // Clean up
    await supabase.from('jobs').delete().eq('id', jobId);
    console.log('Cleaned up successfully.');
  } catch (err) {
    console.error('❌ Test failed:', err);
  }
}

main();
