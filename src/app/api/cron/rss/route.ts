import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Worker 3: RSS Cron Ingest
export async function GET(request: Request) {
  // Verify cron header if deployed on vercel
  const authHeader = request.headers.get('authorization');
  if (process.env.VERCEL === '1' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Get RSS feeds from system_configs
    const { data: config } = await supabase.from('system_configs').select('value').eq('key', 'rss_feeds').maybeSingle();
    let feeds: any[] = [];
    if (config && config.value) {
      feeds = typeof config.value === 'string' ? JSON.parse(config.value) : config.value;
    }

    if (!feeds || feeds.length === 0) {
      return NextResponse.json({ success: true, message: 'No RSS feeds configured.' });
    }

    // Prepare internal payload for AGC route
    const adminKey = process.env.ADMIN_SECRET_KEY || 'zadit_growth_secret_2026';
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    let totalProcessed = 0;
    
    // Process only active feeds
    const activeFeeds = feeds.filter(f => f.is_active);

    for (const feed of activeFeeds) {
      try {
        const res = await fetch(`${baseUrl}/api/agc`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret: adminKey, feedUrl: feed.url })
        });
        if (res.ok) {
          totalProcessed++;
        }
      } catch (err) {
        console.error('Failed to trigger AGC for feed:', feed.url);
      }
    }

    return NextResponse.json({ success: true, message: `Cron executed. Triggered AGC for ${totalProcessed} feeds.` });
  } catch (err) {
    console.error('Cron RSS Error:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
