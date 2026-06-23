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

async function getLatestYears(varId) {
  try {
    const url = `https://webapi.bps.go.id/v1/api/list/model/th/lang/ind/domain/0000/var/${varId}/key/${key}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const json = await res.json();
    if (json.status === 'OK' && json.data && json.data[1]) {
      return json.data[1].map(item => ({
        th_id: item.th_id,
        th: item.th
      }));
    }
  } catch (e) {
    console.error(`Failed to get years for var ${varId}:`, e.message);
  }
  return [];
}

async function fetchLiveBPS() {
  console.log('Fetching live BPS macroeconomic indicators...');

  // 1. GDP Growth (Var 104)
  const gdpYears = await getLatestYears(104);
  console.log('GDP Available Years:', gdpYears);
  if (gdpYears.length > 0) {
    const latestYearObj = gdpYears[0]; // usually sorted descending
    const thId = latestYearObj.th_id;
    const th = latestYearObj.th;

    const url = `https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/104/key/${key}/th/${thId}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const json = await res.json();
    if (json.status === 'OK' && json.datacontent) {
      const content = json.datacontent;
      // c-to-c keys: starts with '990031043'
      const keys = Object.keys(content).filter(k => k.startsWith('990031043'));
      // Sort keys to find the latest period (e.g. y-on-y annual '35' or highest quarter)
      keys.sort();
      const latestKey = keys[keys.length - 1];
      const val = content[latestKey];
      console.log(`Latest GDP Growth (${th}): ${val}% (Key: ${latestKey})`);
    }
  }

  // 2. Inflation (Var 1709 / Var 1)
  // Let's check both Var 1709 (IHK 90 Kota) and Var 1 (Inflasi Bulanan M-to-M)
  const inflYears = await getLatestYears(1);
  console.log('Inflation Available Years:', inflYears);
  if (inflYears.length > 0) {
    const latestYearObj = inflYears[0];
    const thId = latestYearObj.th_id;
    const th = latestYearObj.th;

    const url = `https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/1/key/${key}/th/${thId}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const json = await res.json();
    if (json.status === 'OK' && json.datacontent) {
      // Inflasi bulanan key: starts with ver_id (var 1 ver_id is usually a region or general code)
      // Let's print some keys
      const keys = Object.keys(json.datacontent);
      console.log(`Sample Inflation Keys for ${th}:`, keys.slice(0, 5));
      // Let's find the general index or average inflation
      // In BPS, ver_id 99003 or similar is not for inflation.
      // For Var 1, let's look at the label list (vervar)
      if (json.vervar) {
        console.log('Vervar list sample for inflation:', json.vervar.slice(0, 5));
      }
    }
  }
}

fetchLiveBPS();
