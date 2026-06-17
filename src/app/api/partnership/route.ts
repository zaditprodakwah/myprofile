import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, whatsapp, email, role, need, projectDescription } = data;

    if (!name || !whatsapp) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Map partnership data into utility_leads schema
    const { error } = await supabase.from('utility_leads').insert({
      lead_name: name,
      contact_info: JSON.stringify({ whatsapp, email, role, need }),
      target_site_url: 'N/A',
      audit_category: `Partnership Inquiry: ${role}`,
      accessibility_score: 100, // static placeholder
      narrative_score: 100, // static placeholder
      status: 'PENDING',
    });

    if (error) {
      console.error('Supabase save error:', error);
      // Fallback: don't crash if Supabase is not ready yet
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Partnership API handler error:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
