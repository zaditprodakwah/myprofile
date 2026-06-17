import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const { url, type } = await request.json();

    if (!url) {
      return new NextResponse('Missing URL parameter', { status: 400 });
    }

    let googleSuccess = false;
    let indexNowSuccess = false;

    // 1. Google Indexing API Integration (JWT)
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

        const googleRes = await fetch(
          'https://indexing.googleapis.com/v3/urlNotifications:publish',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtClient.credentials.access_token}`
            },
            body: JSON.stringify({ url, type: type || 'URL_UPDATED' })
          }
        );

        if (googleRes.ok) {
          googleSuccess = true;
        } else {
          console.warn('Google Indexing API returned non-OK status:', await googleRes.text());
        }
      } catch (err) {
        console.error('Google Indexing API failed:', err);
      }
    } else {
      console.info('Skipping Google Indexing: Credentials not fully configured.');
    }

    // 2. IndexNow Protocol (Bing/Yandex)
    const indexNowKey = process.env.INDEXNOW_KEY || 'zadit_indexnow_key_2026';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zadit.dev';

    try {
      const indexNowRes = await fetch(`https://api.indexnow.org/IndexNow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          host: siteUrl.replace('https://', '').replace('http://', ''),
          key: indexNowKey,
          keyLocation: `${siteUrl}/${indexNowKey}.txt`,
          urlList: [url]
        })
      });

      if (indexNowRes.ok) {
        indexNowSuccess = true;
      } else {
        console.warn('IndexNow returned non-OK status:', await indexNowRes.text());
      }
    } catch (err) {
      console.error('IndexNow failed:', err);
    }

    return NextResponse.json({
      success: googleSuccess || indexNowSuccess,
      google: googleSuccess,
      indexNow: indexNowSuccess,
      message: `Indexing processed. Google: ${googleSuccess ? 'OK' : 'Skipped/Failed'}, IndexNow: ${indexNowSuccess ? 'OK' : 'Failed'}`
    });
  } catch (err) {
    console.error('Indexing API route handler error:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
