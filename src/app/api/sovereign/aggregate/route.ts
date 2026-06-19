import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
  
  try {
    const endpoints = [
      '/api/sovereign/cyber-security',
      '/api/sovereign/macro-economics',
      '/api/sovereign/fiscal-data',
      '/api/sovereign/datarakyat',
      '/api/sovereign/markets',
      '/api/sovereign/fred',
      '/api/sovereign/sentiment',
      '/api/sovereign/esg'
    ];

    const responses = await Promise.all(
      endpoints.map(ep => fetch(`${baseUrl}${ep}`, { next: { revalidate: 3600 } }).then(res => res.json()).catch(() => ({ success: false })))
    );

    return NextResponse.json({
      success: true,
      data: {
        cyber: responses[0]?.data || null,
        macro: responses[1]?.data || null,
        fiscal: responses[2]?.data || null,
        dr: responses[3]?.data || null,
        markets: responses[4]?.data || null,
        fred: responses[5]?.data || null,
        sentiment: responses[6]?.data || null,
        esg: responses[7]?.data || null,
      }
    });
  } catch (error) {
    console.error('Aggregate API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
