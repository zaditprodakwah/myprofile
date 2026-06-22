import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export const revalidate = 86400; // Cache on Edge for 24 hours

export async function GET() {
  const CACHE_CONTROL = 's-maxage=86400, stale-while-revalidate=172800';
  let isFresh = false;
  let payload: any = null;

  try {
    const { data: configs } = await supabaseServer
      .from('system_configs')
      .select('key, value')
      .eq('key', 'sovereign_emergency_lock')
      .maybeSingle();

    const isEmergencyLock = configs?.value === 'true' || configs?.value === true;

    // Check if we have cached digital transformation metrics in system_configs or use clean mock
    const { data: governmentProjects } = await supabaseServer
      .from('system_configs')
      .select('value')
      .eq('key', 'government_digitization_metrics')
      .maybeSingle();

    if (!isEmergencyLock && governmentProjects?.value) {
      payload = typeof governmentProjects.value === 'string'
        ? JSON.parse(governmentProjects.value)
        : governmentProjects.value;
      isFresh = true;
    }

    if (!payload) {
      // Dynamic simulated data representing actual Indonesian digital government initiatives
      payload = {
        civicProjects: 184, // SATUSEHAT, SP4N LAPOR, Portal Layanan Publik, etc.
        infrastructureFocus: 'Satu Data Indonesia, Pusat Data Nasional (PDN) & INA Digital',
        coverageProvinces: 38,
        integrationScore: 84.5,
        lastUpdated: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
        isFresh: false
      };
    }

    return new NextResponse(JSON.stringify({ success: true, data: payload, source: isFresh ? 'DB System Config' : 'Static Fallback' }), {
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
