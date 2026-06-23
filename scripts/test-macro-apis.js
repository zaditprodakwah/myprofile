const fs = require('fs');
const path = require('path');

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

async function testFred() {
  console.log('\n--- Testing FRED ---');
  const key = env.FRED_API_KEY;
  try {
    const res = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=FEDFUNDS&api_key=${key}&file_type=json&sort_order=desc&limit=1`);
    console.log('FRED status:', res.status);
    const json = await res.json();
    console.log('FEDFunds Rate observation:', json.observations?.[0]);
  } catch (err) {
    console.error('FRED failed:', err.message);
  }
}

async function testBps() {
  console.log('\n--- Testing BPS ---');
  const key = env.BPS_API_KEY;
  try {
    const res = await fetch(`https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/456/key/${key}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log('BPS status:', res.status);
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      console.log('BPS Data length:', json.data?.length);
      console.log('First 2 data items:', json.data?.slice(0, 2));
    } catch {
      console.log('Response not JSON. First 200 chars:', text.substring(0, 200));
    }
  } catch (err) {
    console.error('BPS failed:', err.message);
  }
}

async function run() {
  await testFred();
  await testBps();
}

run();
