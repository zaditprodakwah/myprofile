import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, whatsapp, email, role, need, projectDescription } = data;

    if (!name || !whatsapp) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Map partnership data into existing 'inquiries' schema
    const { error } = await supabase.from('inquiries').insert({
      full_name: name,
      whatsapp: whatsapp,
      email: email,
      role: role,
      segment: 'business', // Required by constraint
      goal: need,
      notes: projectDescription,
      status: 'new'
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
