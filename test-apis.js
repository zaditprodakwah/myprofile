

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://xfjoulmxwmksufucowbo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhmam91bG14d21rc3VmdWNvd2JvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODUxOTIzMywiZXhwIjoyMDk0MDk1MjMzfQ.F-2zmer_4hIA0XgqBQMWU3x2aHSLoBDRXUKE1kotkQw');

async function test() {
  console.log('Testing NewsData...');
  try {
    const res = await fetch('https://newsdata.io/api/1/news?apikey=pub_c3c7204194ba4ecfac552bb72117c892&q=bisnis%20digital&language=id');
    const json = await res.json();
    console.log('NewsData Status:', res.status);
    console.log('NewsData length:', json.results?.length);
  } catch (e) {
    console.log('NewsData Error:', e.message);
  }

  console.log('Testing system_configs...');
  try {
    const { data } = await supabase.from('system_configs').select('*');
    console.log('Configs:', data);
  } catch (e) {
    console.log('Supabase Error:', e.message);
  }
}
test();

test();
