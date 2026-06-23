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

const key = env.BPS_API_KEY;

async function testGDP2026() {
  try {
    const url = `https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/104/key/${key}/th/126`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const json = await res.json();
    console.log('Status:', json.status);
    console.log('Availability:', json['data-availability']);
    console.log('Last Update:', json.last_update);
    
    // Log all keys in datacontent starting with 99003104
    const content = json.datacontent || {};
    const gdpKeys = Object.keys(content).filter(k => k.startsWith('99003104'));
    console.log('\nFound GDP Keys:');
    gdpKeys.forEach(k => {
      console.log(`${k}: ${content[k]}`);
    });
  } catch (e) {
    console.error(e);
  }
}

testGDP2026();
