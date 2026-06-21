import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { url, urls, type } = body;

    // Resolve URL list
    let urlList: string[] = [];
    if (Array.isArray(urls)) {
      urlList = urls.filter(u => typeof u === 'string' && u.startsWith('http'));
    } else if (typeof url === 'string' && url.startsWith('http')) {
      urlList = [url];
    }

    if (urlList.length === 0) {
      return new NextResponse('Missing or invalid URL parameter', { status: 400 });
    }

    let googleSuccessCount = 0;
    let indexNowSuccess = false;

    // 1. Google Indexing API Integration (JWT & Batch support)
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (clientEmail && privateKey && !privateKey.includes('placeholder')) {
      try {
        const jwtClient = new google.auth.JWT({
          email: clientEmail,
          key: privateKey.replace(/\\n/g, '\n'),
          scopes: ['https://www.googleapis.com/auth/indexing']
        });

        await jwtClient.authorize();

        // Process indexing in batch/parallel promises
        const promises = urlList.map(async (targetUrl) => {
          try {
            const googleRes = await fetch(
              'https://indexing.googleapis.com/v3/urlNotifications:publish',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${jwtClient.credentials.access_token}`
                },
                body: JSON.stringify({ url: targetUrl, type: type || 'URL_UPDATED' })
              }
            );
            if (googleRes.ok) {
              googleSuccessCount++;
            }
          } catch (e) {
            console.error(`Failed to notify Google for url: ${targetUrl}`, e);
          }
        });

        await Promise.all(promises);
      } catch (err) {
        console.error('Google Indexing JWT Auth failed:', err);
      }
    } else {
      console.info('Skipping Google Indexing: Credentials not fully configured.');
    }

    // 2. IndexNow Protocol (Bing & Yandex Multi-Engine support)
    const indexNowKey = process.env.INDEXNOW_KEY || 'zadit_indexnow_key_2026';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';
    const host = siteUrl.replace('https://', '').replace('http://', '');

    const engines = [
      'https://api.indexnow.org/IndexNow',
      'https://yandex.com/indexnow',
      'https://www.bing.com/indexnow'
    ];

    // Trigger ping for multiple search engine endpoints in parallel (adopting indexnow-submitter)
    const indexNowPromises = engines.map(async (engineUrl) => {
      try {
        const indexNowRes = await fetch(engineUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({
            host,
            key: indexNowKey,
            keyLocation: `${siteUrl}/${indexNowKey}.txt`,
            urlList
          })
        });
        if (indexNowRes.ok) {
          indexNowSuccess = true;
        }
      } catch (err) {
        console.error(`IndexNow submission failed for engine ${engineUrl}:`, err);
      }
    });

    await Promise.all(indexNowPromises);

    return NextResponse.json({
      success: googleSuccessCount > 0 || indexNowSuccess,
      googleSuccessCount,
      googleTotalSent: urlList.length,
      indexNow: indexNowSuccess,
      message: `Batch Indexing processed. Google: ${googleSuccessCount}/${urlList.length} OK, IndexNow Multi-Engine: ${indexNowSuccess ? 'OK' : 'Failed'}`
    });
  } catch (err) {
    console.error('Indexing API route handler error:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
