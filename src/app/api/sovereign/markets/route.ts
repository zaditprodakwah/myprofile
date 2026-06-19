import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getTelemetryCache, setTelemetryCache } from '@/lib/telemetry-cache';

export const revalidate = 21600; // 6 hours edge cache

export async function GET() {
  const CACHE_CONTROL = 's-maxage=21600, stale-while-revalidate=43200';
  const cacheKey = 'markets_telemetry';

  try {
    // 1. Check database cache first
    const cachedData = await getTelemetryCache(cacheKey, 6);
    if (cachedData) {
      return new NextResponse(JSON.stringify({ success: true, data: cachedData, source: 'DB Cache' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': CACHE_CONTROL
        }
      });
    }

    // 2. Fetch new data
    let isFresh = true;
    let payload: any[] = [];

    const { data: configs } = await supabase
      .from('system_configs')
      .select('key, value')
      .eq('key', 'sovereign_emergency_lock')
      .maybeSingle();

    const isEmergencyLock = configs?.value === 'true' || configs?.value === true;

    if (!isEmergencyLock) {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 6000);

      try {
        const polygonKey = process.env.POLYGON_API_KEY;
        const geckoKey = process.env.COINGECKO_API_KEY;
        const fmpKey = process.env.FMP_API_KEY;
        const alphaKey = process.env.ALPHA_VANTAGE_API_KEY;

        // Perform fetches concurrently using settled promises
        const fetchPromises: Promise<any>[] = [];

        // 1. CoinGecko BTC Price
        fetchPromises.push(
          fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd`, {
            headers: geckoKey ? { 'x-cg-demo-api-key': geckoKey } : {},
            signal: abortController.signal
          }).then(r => r.ok ? r.json() : null).catch(() => null)
        );

        // 2. Polygon USD/IDR & EUR/IDR
        const polygonUrl = polygonKey 
          ? `https://api.polygon.io/v2/aggs/ticker/C:USDIDR/prev?adjusted=true&apiKey=${polygonKey}`
          : null;
        fetchPromises.push(
          polygonUrl 
            ? fetch(polygonUrl, { signal: abortController.signal }).then(r => r.ok ? r.json() : null).catch(() => null)
            : Promise.resolve(null)
        );

        // 3. FMP EIDO (MSCI Indonesia ETF) Profile
        const fmpUrl = fmpKey
          ? `https://financialmodelingprep.com/api/v3/quote/EIDO?apikey=${fmpKey}`
          : null;
        fetchPromises.push(
          fmpUrl
            ? fetch(fmpUrl, { signal: abortController.signal }).then(r => r.ok ? r.json() : null).catch(() => null)
            : Promise.resolve(null)
        );

        // 4. Alpha Vantage Currency fallback or GDP
        const alphaUrl = alphaKey
          ? `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=IDR&apikey=${alphaKey}`
          : null;
        fetchPromises.push(
          alphaUrl
            ? fetch(alphaUrl, { signal: abortController.signal }).then(r => r.ok ? r.json() : null).catch(() => null)
            : Promise.resolve(null)
        );

        const results = await Promise.all(fetchPromises);
        clearTimeout(timeoutId);

        const [geckoData, polygonData, fmpData, alphaData] = results;

        // Process CoinGecko
        if (geckoData && geckoData.bitcoin) {
          payload.push({
            symbol: 'BTC/USD',
            price: geckoData.bitcoin.usd,
            change: 0,
            source: 'CoinGecko',
            impact: 'Likuiditas digital global mempengaruhi iklim investasi aset alternatif lokal.'
          });
        }

        // Process Polygon / Alpha Vantage USD/IDR rate
        let usdIdrRate = 16350; // Fallback baseline
        let usdIdrSource = 'Estimation';
        let usdIdrChange = 0;

        if (polygonData && polygonData.results?.[0]) {
          usdIdrRate = polygonData.results[0].c;
          usdIdrChange = polygonData.results[0].c - polygonData.results[0].o;
          usdIdrSource = 'Polygon.io';
        } else if (alphaData && alphaData['Realtime Currency Exchange Rate']) {
          const rateStr = alphaData['Realtime Currency Exchange Rate']['5. Exchange Rate'];
          if (rateStr) {
            usdIdrRate = parseFloat(rateStr);
            usdIdrSource = 'Alpha Vantage';
          }
        } else {
          // General FX API fallback
          try {
            const fxRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            if (fxRes.ok) {
              const fxData = await fxRes.json();
              if (fxData.rates && fxData.rates.IDR) {
                usdIdrRate = fxData.rates.IDR;
                usdIdrSource = 'ExchangeRate API';
              }
            }
          } catch (_) {}
        }

        payload.push({
          symbol: 'USD/IDR',
          price: usdIdrRate,
          change: usdIdrChange,
          source: usdIdrSource,
          impact: 'Nilai tukar rupiah mendikte margin impor & stabilitas makroekonomi regional.'
        });

        // Process FMP EIDO ETF
        if (fmpData && fmpData[0]) {
          payload.push({
            symbol: 'EIDO (MSCI Indonesia)',
            price: fmpData[0].price,
            change: fmpData[0].change,
            source: 'Financial Modeling Prep',
            impact: 'Indeks MSCI Indonesia mengukur sentimen investor institusional global terhadap pasar saham domestik.'
          });
        }

        // If no API worked, mark as not fresh
        if (payload.length === 0) {
          isFresh = false;
        } else {
          // Save to database cache
          await setTelemetryCache(cacheKey, payload, 'Markets Aggregator');
        }

      } catch (err) {
        clearTimeout(timeoutId);
        isFresh = false;
        console.warn('Markets APIs fetch failed, using DB cache:', err);
      }
    } else {
      isFresh = false;
    }

    // 3. Stale cache fallback if failed
    if (!isFresh || payload.length === 0) {
      const staleData = await getTelemetryCache(cacheKey, 99999);
      if (staleData) {
        payload = staleData;
      } else {
        payload = [
          { symbol: 'BTC/USD', price: 65200, change: 120, source: 'CoinGecko Cache', impact: 'Offline Fallback Mode' },
          { symbol: 'USD/IDR', price: 16320, change: 15, source: 'Polygon Cache', impact: 'Offline Fallback Mode' },
          { symbol: 'EIDO (MSCI Indonesia)', price: 21.45, change: -0.12, source: 'FMP Cache', impact: 'Offline Fallback Mode' }
        ];
      }
    }

    return new NextResponse(JSON.stringify({ success: true, data: payload, source: isFresh ? 'External APIs' : 'DB Stale Fallback' }), {
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
