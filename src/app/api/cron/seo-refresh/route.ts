import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  // Verify cron header if deployed on Vercel
  const authHeader = request.headers.get('authorization');
  if (process.env.VERCEL === '1' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // 1. Fetch articles updated in the last 24 hours
    const { data: articles } = await supabase
      .from('articles')
      .select('slug, updated_at')
      .eq('is_published', true)
      .gt('updated_at', last24h);

    // 2. Fetch reference items updated in the last 24 hours
    const { data: references } = await supabase
      .from('reference_items')
      .select('slug, updated_at')
      .eq('is_active', true)
      .gt('updated_at', last24h);

    // Build URL list for IndexNow
    const urlsToIndex = [
      `${siteUrl}/`,
      `${siteUrl}/blog`,
      `${siteUrl}/directory`,
      `${siteUrl}/sovereign-explorer`,
      `${siteUrl}/llms-full.txt`
    ];

    if (articles && articles.length > 0) {
      articles.forEach(art => urlsToIndex.push(`${siteUrl}/blog/${art.slug}`));
    }
    if (references && references.length > 0) {
      references.forEach(ref => urlsToIndex.push(`${siteUrl}/sovereign-explorer/${ref.slug}`));
    }

    // 3. Trigger IndexNow Protocol (Bing/Yandex)
    const indexNowKey = process.env.INDEXNOW_KEY || 'zadit_indexnow_key_2026';
    const host = siteUrl.replace('https://', '').replace('http://', '');

    const indexNowRes = await fetch(`https://api.indexnow.org/IndexNow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key: indexNowKey,
        keyLocation: `${siteUrl}/${indexNowKey}.txt`,
        urlList: urlsToIndex
      })
    });

    let indexNowSuccess = false;
    let responseText = '';
    if (indexNowRes.ok) {
      indexNowSuccess = true;
    } else {
      responseText = await indexNowRes.text();
      console.warn('IndexNow batch update failed:', responseText);
    }

    return NextResponse.json({
      success: indexNowSuccess,
      indexNow: indexNowSuccess,
      urlsProcessedCount: urlsToIndex.length,
      urlsToIndex,
      message: indexNowSuccess 
        ? `IndexNow batch success. Submitted ${urlsToIndex.length} URLs.` 
        : `IndexNow failed: ${responseText}`
    });
  } catch (err: any) {
    console.error('SEO Refresh Cron Error:', err);
    return new NextResponse(`Internal Error: ${err.message}`, { status: 500 });
  }
}
