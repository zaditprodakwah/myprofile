import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 86400;

export async function GET() {
  const CACHE_CONTROL = 's-maxage=86400, stale-while-revalidate=172800';
  let isFresh = true;
  let payload: any = null;

  try {
    const { data: configs } = await supabase
      .from('system_configs')
      .select('key, value')
      .eq('key', 'sovereign_emergency_lock')
      .maybeSingle();

    const isEmergencyLock = configs?.value === 'true' || configs?.value === true;
    const apiKey = process.env.FRED_API_KEY;

    if (!isEmergencyLock && apiKey) {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 3000);

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
        } else {
          isFresh = false;
        }
      } catch (err) {
        clearTimeout(timeoutId);
        isFresh = false;
        console.warn('FRED API timeout or failure. Using Fallback.');
      }
    } else {
      isFresh = false;
    }

    if (!isFresh || !payload) {
      payload = {
        indexName: 'Federal Funds Effective Rate',
        value: '4.50 (Offline Estimate)',
        date: 'Fallback',
        isFresh: false
      };
    }

    return new NextResponse(JSON.stringify({ success: true, data: payload }), {
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
