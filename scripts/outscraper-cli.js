require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

const OUTSCRAPER_API_KEY = process.env.OUTSCRAPER_API_KEY;

if (!OUTSCRAPER_API_KEY) {
  console.error('Error: OUTSCRAPER_API_KEY not found in .env.local');
  process.exit(1);
}

const args = process.argv.slice(2);
const command = args[0];

async function run() {
  if (command === 'search') {
    const query = args[1];
    if (!query) {
      console.log('Usage: node scripts/outscraper-cli.js search "Restaurants in Jakarta"');
      return;
    }

    console.log(`Sending task to Outscraper for query: "${query}"...`);

    const url = `https://api.outscraper.cloud/maps/search-v3?query=${encodeURIComponent(query)}&limit=20&async=false`;

    try {
      const response = await fetch(url, {
        headers: { 'X-API-KEY': OUTSCRAPER_API_KEY }
      });
      const data = await response.json();
      
      if (data.data) {
        fs.writeFileSync('scratch/outscraper-results.json', JSON.stringify(data.data, null, 2));
        console.log(`✅ Success! Results saved to scratch/outscraper-results.json`);
        console.log(`Found ${data.data.flat().length} places.`);
      } else {
        console.error('Task started but no immediate data returned. Check webhook or status.', data);
      }
    } catch (err) {
      console.error('Error calling Outscraper API:', err);
    }
  } else {
    console.log('Available commands: search');
    console.log('Example: node scripts/outscraper-cli.js search "Clinics in Bandung"');
  }
}

run();
