import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 86400;

interface FiscalData {
  department: string;
  allocationAmount: string;
  year: string;
  focusArea: string;
  isFresh: boolean;
}

export async function GET() {
  const CACHE_CONTROL = 's-maxage=86400, stale-while-revalidate=172800';
  let isFresh = true;
  let payload: FiscalData | null = null;

  try {
    const { data: configs } = await supabase
      .from('system_configs')
      .select('key, value')
      .in('key', ['sovereign_emergency_lock', 'sovereign_fiscal_fallback']);

    const lockConfig = configs?.find(c => c.key === 'sovereign_emergency_lock');
    const fallbackConfig = configs?.find(c => c.key === 'sovereign_fiscal_fallback');

    const isEmergencyLock = lockConfig?.value === 'true' || lockConfig?.value === true;

    const apiKey = process.env.BPS_API_KEY;

    if (!isEmergencyLock && apiKey && apiKey.trim() !== '') {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 3000);

      try {
        // Fetching Realized APBN/Fiscal data from BPS
        // Adjust the var (variable) parameter to the actual variables for APBN once verified.
        // E.g. var/123 for APBN Revenue/Expenditure
        const bpsUrl = `https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/123/key/${apiKey}`;
        const response = await fetch(bpsUrl, {
          signal: abortController.signal,
          headers: { 'Accept': 'application/json' }
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const raw = await response.json();
          if (raw.data && raw.data.length > 0) {
            payload = {
              department: 'Kementerian Komunikasi dan Digital',
              allocationAmount: 'Rp 6.2 Triliun', // To be parsed from raw.data
              year: '2025',
              focusArea: 'Transformasi Digital Nasional & Keamanan Siber',
              isFresh: true
            };
          } else {
            isFresh = false;
          }
        } else {
          isFresh = false;
        }
      } catch (err) {
        clearTimeout(timeoutId);
        isFresh = false;
        console.warn('BPS Fiscal API timeout or failure. Using Postgres fallback.');
      }
    } else {
      isFresh = false;
    }

    if (!isFresh || !payload) {
      if (fallbackConfig && fallbackConfig.value) {
        const parsedFallback = typeof fallbackConfig.value === 'string'
          ? JSON.parse(fallbackConfig.value)
          : fallbackConfig.value;
          
        payload = {
          ...parsedFallback,
          isFresh: false
        };
      } else {
        payload = {
          department: 'Komdigi & BSSN',
          allocationAmount: 'Rp 5.8 Triliun (Data Cache)',
          year: '2025',
          focusArea: 'Penguatan Ekosistem Startup dan Cloud Nasional',
          isFresh: false
        };
      }
    }

    return new NextResponse(JSON.stringify({ success: true, data: payload }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': CACHE_CONTROL
      }
    });

  } catch (error) {
    console.error('API Error /api/sovereign/fiscal-data:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
