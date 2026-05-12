
const dotenv = require('dotenv');
const path = require('path');

// Load env vars synchronously before any other imports
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Now import the rest
const { ingestAllFeeds } = require('../src/lib/radar/ingestion');

async function main() {
  console.log('Starting manual RSS ingestion...');
  try {
    const results = await ingestAllFeeds();
    console.log(`Ingestion completed. Total items ingested: ${results.length}`);
    if (results.length > 0) {
      console.log('Ingested items:');
      results.forEach((item: any) => console.log(`- ${item.title} (Score: ${item.score})`));
    }
  } catch (error) {
    console.error('Ingestion failed:', error);
    process.exit(1);
  }
}

main();
