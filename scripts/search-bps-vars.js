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

async function searchVars() {
  console.log('Searching all BPS variables for GDP/PDB...');
  let page = 1;
  let totalPages = 170;
  const queries = ['pdb', 'domestik bruto', 'pertumbuhan ekonomi'];
  const matches = [];

  for (page = 1; page <= totalPages; page++) {
    try {
      const url = `https://webapi.bps.go.id/v1/api/list/model/var/lang/ind/domain/0000/key/${key}/page/${page}`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (!res.ok) break;
      const json = await res.json();
      if (json.status !== 'OK') break;

      const pagination = json.data[0];
      totalPages = pagination.pages;
      
      const vars = json.data[1];
      for (const v of vars) {
        const titleLower = v.title.toLowerCase();
        if (queries.some(q => titleLower.includes(q))) {
          matches.push({
            var_id: v.var_id,
            title: v.title,
            unit: v.unit
          });
        }
      }
    } catch (e) {
      console.error(`Page ${page} failed:`, e.message);
    }
  }

  console.log('\n--- MATCHING BPS GDP VARIABLES ---');
  console.log(JSON.stringify(matches, null, 2));
}

searchVars();
