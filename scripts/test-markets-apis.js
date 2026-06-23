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

async function testCrypto() {
  console.log('\n--- Testing CoinGecko ---');
  const key = env.COINGECKO_API_KEY;
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple&vs_currencies=usd&include_24hr_change=true`,
      {
        headers: key ? { 'x-cg-demo-api-key': key } : {}
      }
    );
    console.log('CoinGecko status:', res.status);
    const json = await res.json();
    console.log('CoinGecko response:', JSON.stringify(json, null, 2));
  } catch (err) {
    console.error('CoinGecko failed:', err.message);
  }
}

async function testFX() {
  console.log('\n--- Testing ExchangeRate API ---');
  try {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
    console.log('ExchangeRate API status:', res.status);
    const json = await res.json();
    console.log('IDR Rate:', json.rates?.IDR);
  } catch (err) {
    console.error('ExchangeRate API failed:', err.message);
  }
}

async function testFinnhub() {
  console.log('\n--- Testing Finnhub ---');
  const key = env.FINNHUB_API_KEY;
  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=AAPL&token=${key}`);
    console.log('Finnhub status:', res.status);
    const json = await res.json();
    console.log('AAPL price:', json.c, 'dp:', json.dp);
  } catch (err) {
    console.error('Finnhub failed:', err.message);
  }
}

async function testPolygon() {
  console.log('\n--- Testing Polygon ---');
  const key = env.POLYGON_API_KEY;
  try {
    const res = await fetch(`https://api.polygon.io/v2/aggs/ticker/MSFT/prev?adjusted=true&apiKey=${key}`);
    console.log('Polygon status:', res.status);
    const json = await res.json();
    console.log('MSFT previous close:', json.results?.[0]?.c);
  } catch (err) {
    console.error('Polygon failed:', err.message);
  }
}

async function testAlphaVantage() {
  console.log('\n--- Testing Alpha Vantage ---');
  const key = env.ALPHA_VANTAGE_API_KEY;
  try {
    const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=GOOGL&apikey=${key}`);
    console.log('Alpha Vantage status:', res.status);
    const json = await res.json();
    console.log('Alpha Vantage Quote:', json);
  } catch (err) {
    console.error('Alpha Vantage failed:', err.message);
  }
}

async function run() {
  await testCrypto();
  await testFX();
  await testFinnhub();
  await testPolygon();
  await testAlphaVantage();
}

run();
