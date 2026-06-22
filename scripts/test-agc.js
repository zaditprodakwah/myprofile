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

const secret = env.ADMIN_SECRET_KEY || 'zadit_growth_secret_2026';

async function testFeed(name, feedUrl) {
  console.log(`\nTesting ${name}: ${feedUrl}`);
  try {
    const res = await fetch('http://localhost:3000/api/agc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        secret,
        feedUrl,
        testOnly: true
      })
    });
    
    console.log('Status:', res.status);
    console.log('Headers:', Object.fromEntries(res.headers.entries()));
    const body = await res.text();
    console.log('Body:', body);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

async function main() {
  // Test 1: Google News (as configured in DB)
  await testFeed(
    'Google News SEO', 
    'https://news.google.com/rss/search?q=seo+growth+marketing+indonesia&hl=id&gl=ID&ceid=ID:id'
  );
  
  // Test 2: Detik Finance (as currently in DB - incorrect url)
  await testFeed(
    'Detik Finance (Current)', 
    'https://www.detik.com/finance/rss'
  );

  // Test 3: Detik Finance (Corrected url)
  await testFeed(
    'Detik Finance (Corrected)', 
    'https://finance.detik.com/rss'
  );
}

main();
