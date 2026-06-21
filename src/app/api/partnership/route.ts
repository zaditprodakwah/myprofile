import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, whatsapp, email, role, need, projectDescription } = data;

    if (!name || !whatsapp) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // 1. Map partnership data and save into contact_leads schema
    const { error: dbError } = await supabase.from('contact_leads').insert({
      lead_name: name,
      visitor_type: role,
      needs: Array.isArray(need) ? need : need ? [need] : [],
      project_description: projectDescription || '',
      contact_info: { whatsapp, email },
      status: 'PENDING',
    });

    if (dbError) {
      console.error('Supabase save error:', dbError);
    }

    // 2. Sync to Google Contacts via People API using Service Account
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (clientEmail && privateKey && !privateKey.includes('placeholder')) {
      try {
        const jwtClient = new google.auth.JWT({
          email: clientEmail,
          key: privateKey.replace(/\\n/g, '\n'),
          scopes: ['https://www.googleapis.com/auth/contacts']
        });

        await jwtClient.authorize();
        const people = google.people({ version: 'v1', auth: jwtClient });

        await people.people.createContact({
          requestBody: {
            names: [{ givenName: name, displayName: name }],
            emailAddresses: email ? [{ value: email, type: 'work' }] : [],
            phoneNumbers: whatsapp ? [{ value: whatsapp, type: 'mobile' }] : [],
            biographies: [{ value: `Lead Kemitraan: ${role}. Kebutuhan: ${Array.isArray(need) ? need.join(', ') : need || 'General'}. Deskripsi: ${projectDescription || ''}` }]
          }
        });
      } catch (gErr) {
        console.error('Failed to sync contact to Google Contacts (People API):', gErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Partnership API handler error:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
