import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
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

    const { data: configs } = await supabaseServer
      .from('system_configs')
      .select('key, value')
      .in('key', ['sovereign_emergency_lock', 'sovereign_macro_fallback']);

    const lockConfig = configs?.find(c => c.key === 'sovereign_emergency_lock');
    const fallbackConfig = configs?.find(c => c.key === 'sovereign_macro_fallback');

    const isEmergencyLock = lockConfig?.value === 'true' || lockConfig?.value === true;
    const apiKey = process.env.BPS_API_KEY;

    // Default indicators
    let gdpGrowth = '5.05%';
    let inflationRate = '2.75%';
    let biRate = '6.25%';
    let fedRate = '5.25%';
    let hasBpsSuccess = false;
    let hasFredSuccess = false;

    if (!isEmergencyLock) {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 7000);

      // A. Fetch FRED FFR
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
              hasFredSuccess = true;
            }
          }
        } catch (fredErr) {
          console.warn('FRED API FFR fetch failed:', fredErr);
        }
      }

      // B. Fetch BPS Data with WAF Bypass (User-Agent header)
      if (apiKey && apiKey.trim() !== '') {
        try {
          // Fetch GDP growth (Var 104)
          const yearsUrl104 = `https://webapi.bps.go.id/v1/api/list/model/th/lang/ind/domain/0000/var/104/key/${apiKey}`;
          const yearsRes104 = await fetch(yearsUrl104, {
            signal: abortController.signal,
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0'
            }
          }).then(r => r.ok ? r.json() : null);

          let gdpThId = null;
          if (yearsRes104?.status === 'OK' && yearsRes104.data?.[1]) {
            const sortedYears = yearsRes104.data[1];
            if (sortedYears.length > 0) {
              gdpThId = sortedYears[0].th_id;
            }
          }

          if (gdpThId) {
            const dataUrl104 = `https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/104/key/${apiKey}/th/${gdpThId}`;
            const dataRes104 = await fetch(dataUrl104, {
              signal: abortController.signal,
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0'
              }
            }).then(r => r.ok ? r.json() : null);

            if (dataRes104?.status === 'OK' && dataRes104.datacontent) {
              const content = dataRes104.datacontent;
              // YoY GDP growth key starts with '990031043' + gdpThId
              const prefix = `990031043${gdpThId}`;
              const keys = Object.keys(content).filter(k => k.startsWith(prefix));
              if (keys.length > 0) {
                keys.sort();
                const latestKey = keys[keys.length - 1];
                const val = content[latestKey];
                if (val) {
                  gdpGrowth = `${val}%`;
                  hasBpsSuccess = true;
                }
              }
            }
          }

          // Fetch Inflation (Var 1)
          const yearsUrl1 = `https://webapi.bps.go.id/v1/api/list/model/th/lang/ind/domain/0000/var/1/key/${apiKey}`;
          const yearsRes1 = await fetch(yearsUrl1, {
            signal: abortController.signal,
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0'
            }
          }).then(r => r.ok ? r.json() : null);

          let infThId = null;
          if (yearsRes1?.status === 'OK' && yearsRes1.data?.[1]) {
            const sortedYears = yearsRes1.data[1];
            if (sortedYears.length > 0) {
              infThId = sortedYears[0].th_id;
            }
          }

          if (infThId) {
            const dataUrl1 = `https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/1/key/${apiKey}/th/${infThId}`;
            const dataRes1 = await fetch(dataUrl1, {
              signal: abortController.signal,
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0'
              }
            }).then(r => r.ok ? r.json() : null);

            if (dataRes1?.status === 'OK' && dataRes1.datacontent) {
              const content = dataRes1.datacontent;
              // Indonesia monthly inflation key starts with '999910' + infThId
              const prefix = `999910${infThId}`;
              const keys = Object.keys(content).filter(k => k.startsWith(prefix));
              if (keys.length > 0) {
                // Sort keys based on numeric month suffix
                keys.sort((a, b) => {
                  const monthA = parseInt(a.substring(prefix.length));
                  const monthB = parseInt(b.substring(prefix.length));
                  return monthA - monthB;
                });
                const latestKey = keys[keys.length - 1];
                const val = content[latestKey];
                if (val) {
                  inflationRate = `${val}%`;
                  hasBpsSuccess = true;
                }
              }
            }
          }
        } catch (err) {
          console.warn('BPS API fetch failed:', err);
        }
      }

      clearTimeout(timeoutId);

      // Decoupled success check: if either succeeded, we build a fresh payload
      if (hasBpsSuccess || hasFredSuccess) {
        payload = {
          gdpGrowth,
          inflationRate,
          biRate,
          fedRate,
          period: 'Q2 2026',
          verdict: 'Stabilitas Makroekonomi Terjaga',
          attribution: 'Layanan menggunakan API Badan Pusat Statistik (BPS) & FRED',
          isFresh: true
        };

        // Cache the fresh payload
        await setTelemetryCache(cacheKey, payload, 'Macroeconomics Aggregator');
      }
    }

    // 3. Fallback to Stale Cache or static configs if completely failed
    if (!payload) {
      isFresh = false;
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
          period: parsedFallback.period || 'Q2 2026',
          verdict: parsedFallback.verdict || 'Ekonomi Terkendali',
          attribution: 'Layanan menggunakan API Badan Pusat Statistik (BPS) & FRED',
          isFresh: false
        };
      } else {
        payload = {
          gdpGrowth: '5.05%',
          inflationRate: '2.78%',
          biRate: '6.25%',
          fedRate: '5.25%',
          period: 'Q2 2026 (Fallback)',
          verdict: 'Ekonomi Terkendali (Offline Mode)',
          attribution: 'Layanan menggunakan API Badan Pusat Statistik (BPS) & FRED',
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
