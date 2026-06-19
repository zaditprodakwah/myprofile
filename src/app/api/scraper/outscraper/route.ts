import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query, webhookUrl } = await request.json();

    if (!query) {
      return NextResponse.json({ success: false, error: 'Query is required' }, { status: 400 });
    }

    const apiKey = process.env.OUTSCRAPER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Outscraper API Key not configured' }, { status: 500 });
    }

    // Call Outscraper API with async=true so it triggers the webhook
    const url = new URL('https://api.outscraper.cloud/maps/search-v3');
    url.searchParams.append('query', query);
    url.searchParams.append('limit', '50'); // Default to 50
    url.searchParams.append('async', 'true');
    if (webhookUrl) {
      url.searchParams.append('webhook', webhookUrl);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'X-API-KEY': apiKey
      }
    });

    const data = await response.json();

    if (data.status === 'Success' || data.id) {
      return NextResponse.json({ 
        success: true, 
        message: 'Task sent to Outscraper', 
        taskId: data.id 
      });
    } else {
      return NextResponse.json({ success: false, error: 'Outscraper API error', details: data }, { status: 400 });
    }

  } catch (error) {
    console.error('Outscraper trigger error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
