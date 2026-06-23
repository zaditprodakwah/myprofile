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

async function testYears() {
  const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
  const vars = [1, 2, 70]; // 1: Inflasi Bulanan, 2: IHK Umum, 70: Internet

  for (const v of vars) {
    console.log(`\n--- Testing Var ${v} ---`);
    for (const yr of years) {
      try {
        const url = `https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/${v}/key/${key}/th/${yr}`;
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const json = await res.json();
        console.log(`Year ${yr}: status = ${json.status}, availability = ${json['data-availability']}`);
        if (json.status === 'OK' && json['data-availability'] === 'available') {
          console.log(`Found data for year ${yr}! Data sample:`, JSON.stringify(json.data).substring(0, 300));
        }
      } catch (e) {
        console.error(`Error for Var ${v} Year ${yr}:`, e.message);
      }
    }
  }
}

testYears();
