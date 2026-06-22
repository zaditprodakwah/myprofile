import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ success: false, error: 'Query parameter is required' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Google API key is not configured' }, { status: 500 });
    }

    const apiUrl = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(query)}&key=${apiKey}&languageCode=id`;
    const res = await fetch(apiUrl);

    if (!res.ok) {
      throw new Error(`Google Fact Check API returned status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Fact Check API Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
