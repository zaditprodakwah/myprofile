import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, whatsapp, email, role, need, projectDescription } = data;

    if (!name || !whatsapp) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Map partnership data into contact_leads schema
    const { error } = await supabase.from('contact_leads').insert({
      lead_name: name,
      visitor_type: role,
      needs: Array.isArray(need) ? need : need ? [need] : [],
      project_description: projectDescription || '',
      contact_info: { whatsapp, email },
      status: 'PENDING',
    });

    if (error) {
      console.error('Supabase save error:', error);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Partnership API handler error:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
