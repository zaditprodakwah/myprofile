import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getTelemetryCache, setTelemetryCache } from '@/lib/telemetry-cache';

export const revalidate = 21600; // Cache on Vercel Edge for 6 hours

export async function GET() {
  const CACHE_CONTROL = 's-maxage=21600, stale-while-revalidate=43200';
  const cacheKey = 'fred_funds';
  
  try {
    // 1. Check fresh database cache first
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

    // 2. Cache is stale/missing, let's fetch from external API
    let isFresh = true;
    let payload = null;

    const { data: configs } = await supabase
      .from('system_configs')
      .select('key, value')
      .eq('key', 'sovereign_emergency_lock')
      .maybeSingle();

    const isEmergencyLock = configs?.value === 'true' || configs?.value === true;
    const apiKey = process.env.FRED_API_KEY;

    if (!isEmergencyLock && apiKey) {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 4000);

      try {
        const response = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=FEDFUNDS&api_key=${apiKey}&file_type=json&limit=1&sort_order=desc`, {
          signal: abortController.signal,
          headers: { 'Accept': 'application/json' }
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const raw = await response.json();
          const obs = raw.observations?.[0];
          payload = {
            indexName: 'Federal Funds Effective Rate',
            value: obs?.value || '4.33',
            date: obs?.date || new Date().toISOString().split('T')[0],
            isFresh: true
          };
          
          // Save to database cache
          await setTelemetryCache(cacheKey, payload, 'FRED');
        } else {
          isFresh = false;
        }
      } catch (err) {
        clearTimeout(timeoutId);
        isFresh = false;
        console.warn('FRED API fetch failed, trying database fallback:', err);
      }
    } else {
      isFresh = false;
    }

    // 3. Graceful Fallback if API fetch failed: retrieve stale cache from DB
    if (!isFresh || !payload) {
      const staleData = await getTelemetryCache(cacheKey, 99999); // bypass expiration
      if (staleData) {
        payload = { ...staleData, isFresh: false };
      } else {
        payload = {
          indexName: 'Federal Funds Effective Rate',
          value: '4.50 (Offline Fallback)',
          date: new Date().toISOString().split('T')[0],
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
    console.error('API Error /api/sovereign/fred:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
