import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Explicitly define edge cache behavior
export const revalidate = 86400; // 24 hours fresh

interface CyberSecurityIndex {
  title: string;
  agency: string;
  notes: string;
  format: string;
  downloadUrl: string;
  isFresh: boolean;
}

export async function GET() {
  const CACHE_CONTROL = 's-maxage=86400, stale-while-revalidate=172800';
  let isFresh = true;

  try {
    // Check Emergency Lock first
    const { data: lockConfig } = await supabase
      .from('system_configs')
      .select('value')
      .eq('key', 'sovereign_emergency_lock')
      .maybeSingle();

    const isEmergencyLock = lockConfig?.value === 'true' || lockConfig?.value === true;

    let payload: CyberSecurityIndex[] = [];

    if (!isEmergencyLock) {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 3000); // 3000ms strict timeout limit

      try {
        const response = await fetch('https://data.go.id/api/3/action/package_search?q=keamanan+siber&rows=3', {
          signal: abortController.signal,
          headers: {
            'Accept': 'application/json'
            // In a real scenario, we could pass BAPPENAS_CKAN_TOKEN here if required for private endpoints.
          }
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const raw = await response.json();
          if (raw.success && raw.result && raw.result.results) {
            payload = raw.result.results.map((item: any) => {
              const resource = item.resources?.[0] || {};
              return {
                title: item.title || item.name,
                agency: item.organization?.title || 'BSSN / Bappenas',
                notes: item.notes || 'Indeks Keamanan Siber Nasional',
                format: resource.format || 'CSV',
                downloadUrl: resource.url || '',
                isFresh: true
              };
            });
          }
        } else {
          isFresh = false;
        }
      } catch (err) {
        clearTimeout(timeoutId);
        isFresh = false;
        console.warn('CKAN API timeout or network failure. Falling back to Supabase entities table.');
      }
    } else {
      isFresh = false; // By definition, if lock is on, we're not using fresh external data
    }

    // Fallback Database Logic
    if (!isFresh || payload.length === 0) {
      const { data: fallbackData } = await supabase
        .from('directory_entities')
        .select('*')
        .eq('entity_type', 'agency')
        .contains('raw_metadata', { origin: 'bappenas' })
        .limit(3);

      if (fallbackData && fallbackData.length > 0) {
        payload = fallbackData.map(entity => ({
          title: entity.name,
          agency: entity.tagline || 'BSSN / Bappenas',
          notes: entity.contact_email || 'Data historis yang dicadangkan di cache lokal.',
          format: 'JSONB (Fallback)',
          downloadUrl: '#',
          isFresh: false
        }));
      } else {
        // Ultimate static fallback to ensure UI never breaks
        payload = [
          {
            title: 'Indeks Keamanan Informasi Nasional',
            agency: 'BSSN',
            notes: 'Indeks KAMI 2025. Data ditarik dari Local Postgres Cache.',
            format: 'PDF',
            downloadUrl: '#',
            isFresh: false
          }
        ];
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
    console.error('API Error /api/sovereign/cyber-security:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
