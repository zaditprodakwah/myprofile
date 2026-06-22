async function testEndpoint(name, path) {
  console.log(`\nTesting ${name}: ${path}`);
  try {
    const res = await fetch(`http://localhost:3000${path}`);
    console.log('Status:', res.status);
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      console.log('JSON Success:', json.success);
      console.log('Data sample (first 100 chars):', JSON.stringify(json).substring(0, 200));
    } catch {
      console.log('Response is not JSON. HTML/Text sample:', text.substring(0, 200));
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

async function main() {
  await testEndpoint('FRED', '/api/sovereign/fred');
  await testEndpoint('Macro Economics', '/api/sovereign/macro-economics');
  await testEndpoint('Markets', '/api/sovereign/markets');
  await testEndpoint('Sentiment', '/api/sovereign/sentiment');
  await testEndpoint('AI Insight', '/api/sovereign/ai-insight');
}

main();
