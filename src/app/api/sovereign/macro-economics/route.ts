import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getTelemetryCache, setTelemetryCache } from '@/lib/telemetry-cache';

export const revalidate = 21600; // 6 hours edge cache

interface MacroEconomicsData {
  gdpGrowth: string;
  inflationRate: string;
  biRate: string;
  fedRate: string;
  period: string;
  verdict: string;
  attribution: string;
  isFresh: boolean;
}

export async function GET() {
  const CACHE_CONTROL = 's-maxage=21600, stale-while-revalidate=43200';
  const cacheKey = 'bps_macro';

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
    let payload: MacroEconomicsData | null = null;

    const { data: configs } = await supabase
      .from('system_configs')
      .select('key, value')
      .in('key', ['sovereign_emergency_lock', 'sovereign_macro_fallback']);

    const lockConfig = configs?.find(c => c.key === 'sovereign_emergency_lock');
    const fallbackConfig = configs?.find(c => c.key === 'sovereign_macro_fallback');

    const isEmergencyLock = lockConfig?.value === 'true' || lockConfig?.value === true;
    const apiKey = process.env.BPS_API_KEY;

    if (!isEmergencyLock && apiKey && apiKey.trim() !== '') {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 6000);

      try {
        const bpsUrl = `https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/456/key/${apiKey}`;
        const response = await fetch(bpsUrl, {
          signal: abortController.signal,
          headers: {
            'Accept': 'application/json'
          }
        });

        let fedRate = '5.25%';
        const fredApiKey = process.env.FRED_API_KEY;
        if (fredApiKey && fredApiKey.trim() !== '') {
          try {
            const fredUrl = `https://api.stlouisfed.org/fred/series/observations?series_id=FEDFUNDS&api_key=${fredApiKey}&file_type=json&sort_order=desc&limit=1`;
            const fredRes = await fetch(fredUrl, { signal: abortController.signal });
            if (fredRes.ok) {
              const fredData = await fredRes.json();
              const latestVal = fredData.observations?.[0]?.value;
              if (latestVal) {
                fedRate = `${parseFloat(latestVal).toFixed(2)}%`;
              }
            }
          } catch (fredErr) {
            console.warn('FRED API FFR fetch failed:', fredErr);
          }
        }

        clearTimeout(timeoutId);

        if (response.ok) {
          const raw = await response.json();
          if (raw.data && raw.data.length > 0) {
            const parsedGdp = raw.data[0]?.nilai ? `${raw.data[0].nilai}%` : '5.05%';
            const parsedInflation = raw.data[1]?.nilai ? `${raw.data[1].nilai}%` : '2.75%';

            payload = {
              gdpGrowth: parsedGdp,
              inflationRate: parsedInflation,
              biRate: '6.25%',
              fedRate: fedRate,
              period: 'Q4 2025',
              verdict: 'Stabil Pertumbuhan Positif',
              attribution: 'Layanan ini menggunakan API Badan Pusat Statistik (BPS) & FRED',
              isFresh: true
            };

            // Save to DB cache
            await setTelemetryCache(cacheKey, payload, 'BPS');
          }
        } else {
          isFresh = false;
        }
      } catch (err) {
        clearTimeout(timeoutId);
        isFresh = false;
        console.warn('BPS API fetch failed, trying fallback:', err);
      }
    } else {
      isFresh = false;
    }

    // 3. Fallback to Stale Cache or static fallbacks
    if (!isFresh || !payload) {
      const staleData = await getTelemetryCache(cacheKey, 99999);
      if (staleData) {
        payload = { ...staleData, isFresh: false };
      } else if (fallbackConfig && fallbackConfig.value) {
        const parsedFallback = typeof fallbackConfig.value === 'string'
          ? JSON.parse(fallbackConfig.value)
          : fallbackConfig.value;

        payload = {
          gdpGrowth: parsedFallback.gdpGrowth || '5.05%',
          inflationRate: parsedFallback.inflationRate || '2.75%',
          biRate: parsedFallback.biRate || '6.25%',
          fedRate: parsedFallback.fedRate || '5.25%',
          period: parsedFallback.period || 'Q4 2025',
          verdict: parsedFallback.verdict || 'Ekonomi Terkendali',
          attribution: 'Layanan ini menggunakan API Badan Pusat Statistik (BPS) & FRED',
          isFresh: false
        };
      } else {
        payload = {
          gdpGrowth: '5.01%',
          inflationRate: '2.56%',
          biRate: '6.25%',
          fedRate: '5.25%',
          period: 'Tahun 2025 (Fallback)',
          verdict: 'Ekonomi Terkendali (Offline Mode)',
          attribution: 'Layanan ini menggunakan API Badan Pusat Statistik (BPS) & FRED',
          isFresh: false
        };
      }
    }

    return new NextResponse(JSON.stringify({ success: true, data: payload, source: isFresh ? 'External API' : 'DB Stale Fallback' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': CACHE_CONTROL
      }
    });

  } catch (error) {
    console.error('API Error /api/sovereign/macro-economics:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
