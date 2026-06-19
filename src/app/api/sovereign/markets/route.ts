import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 86400;

export async function GET() {
  const CACHE_CONTROL = 's-maxage=86400, stale-while-revalidate=172800';
  let isFresh = true;
  let payload: any[] = [];

  try {
    const { data: configs } = await supabase
      .from('system_configs')
      .select('key, value')
      .eq('key', 'sovereign_emergency_lock')
      .maybeSingle();

    const isEmergencyLock = configs?.value === 'true' || configs?.value === true;

    if (!isEmergencyLock) {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 4000);

      try {
        // Fetch concurrently from Polygon (AAPL) and CoinGecko (BTC) as examples
        const [polygonRes, coinGeckoRes] = await Promise.allSettled([
          fetch(`https://api.polygon.io/v2/aggs/ticker/AAPL/prev?adjusted=true&apiKey=${process.env.POLYGON_API_KEY}`, { signal: abortController.signal }),
          fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`, { 
            headers: { 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY || '' },
            signal: abortController.signal 
          })
        ]);
        clearTimeout(timeoutId);

        // Process Polygon
        if (polygonRes.status === 'fulfilled' && polygonRes.value.ok) {
          const raw = await polygonRes.value.json();
          if (raw.results?.[0]) {
            payload.push({
              symbol: 'AAPL',
              price: raw.results[0].c,
              change: raw.results[0].c - raw.results[0].o, // rough estimation
              source: 'Polygon.io',
              impact: 'Sektor teknologi berkorelasi dengan investasi startup lokal.'
            });
          }
        } else {
          isFresh = false;
        }

        // Process CoinGecko
        if (coinGeckoRes.status === 'fulfilled' && coinGeckoRes.value.ok) {
          const raw = await coinGeckoRes.value.json();
          if (raw.bitcoin?.usd) {
            payload.push({
              symbol: 'BTC/USD',
              price: raw.bitcoin.usd,
              change: 0, // Need historical for actual change, mock for ticker
              source: 'CoinGecko',
              impact: 'Likuiditas digital mempengaruhi kebijakan regulasi kripto Bappebti.'
            });
          }
        } else {
          isFresh = false;
        }

        // Fetch real USD/IDR from ExchangeRate-API
        try {
          const fxRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
          if (fxRes.ok) {
            const fxData = await fxRes.json();
            if (fxData.rates && fxData.rates.IDR) {
              payload.push({
                symbol: 'USD/IDR',
                price: fxData.rates.IDR,
                change: 0, // Need historical for real change
                source: 'ExchangeRate-API',
                impact: 'Nilai tukar langsung mendikte daya beli dan inflasi makro.'
              });
            }
          }
        } catch (e) {
          console.warn('Failed to fetch exchange rate');
        }

      } catch (err) {
        clearTimeout(timeoutId);
        isFresh = false;
        console.warn('Market APIs timeout or failure. Using Fallback.');
      }
    } else {
      isFresh = false;
    }

    if (!isFresh || payload.length === 0) {
      payload = [
        { symbol: 'AAPL', price: 150.0, change: 1.5, source: 'Polygon Cache', impact: 'Offline Mode Active' },
        { symbol: 'BTC/USD', price: 65000, change: -1000, source: 'CoinGecko Cache', impact: 'Offline Mode Active' },
        { symbol: 'USD/IDR', price: 15600, change: 50, source: 'FMP Cache', impact: 'Offline Mode Active' }
      ];
    }

    return new NextResponse(JSON.stringify({ success: true, data: payload, isFresh }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': CACHE_CONTROL
      }
    });
  } catch (error) {
    console.error('API Error /api/sovereign/markets:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
