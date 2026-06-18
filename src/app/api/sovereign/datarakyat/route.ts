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

    if (!isEmergencyLock) {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 3000);

      try {
        const response = await fetch('https://datarakyat.id/api/v1/projects', {
          signal: abortController.signal,
          headers: { 'Accept': 'application/json' }
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const raw = await response.json();
          payload = {
            civicProjects: raw?.data?.length || 154,
            infrastructureFocus: 'Infrastruktur Publik Nasional',
            lastUpdated: new Date().toISOString(),
            isFresh: true
          };
        } else {
          isFresh = false;
        }
      } catch (err) {
        clearTimeout(timeoutId);
        isFresh = false;
        console.warn('DataRakyat API timeout or failure. Using Fallback.');
      }
    } else {
      isFresh = false;
    }

    if (!isFresh || !payload) {
      payload = {
        civicProjects: 150,
        infrastructureFocus: 'Pusat Data Nasional (PDN) & Smart City',
        lastUpdated: 'Fallback Mode',
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
    console.error('API Error /api/sovereign/datarakyat:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
