import { NextResponse } from 'next/server';
import { getTelemetryCache, setTelemetryCache } from '@/lib/telemetry-cache';

export const revalidate = 21600; // 6 hours edge cache

export async function GET() {
  const CACHE_CONTROL = 's-maxage=21600, stale-while-revalidate=43200';
  const cacheKey = 'news_trends';

  try {
    // 1. Check DB Cache
    const cachedData = await getTelemetryCache(cacheKey, 6);
    if (cachedData) {
      return new NextResponse(JSON.stringify({ success: true, data: cachedData, source: 'DB Cache' }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': CACHE_CONTROL
        }
      });
    }

    // 2. Fetch fresh news from APIs
    let isFresh = true;
    let articles: any[] = [];

    const newsKey = process.env.NEWSAPI_KEY;
    const newsDataKey = process.env.NEWSDATA_KEY;
    const finnhubKey = process.env.FINNHUB_API_KEY;

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 5000);

    try {
      // 1. Try NewsAPI first
      if (newsKey) {
        const url = `https://newsapi.org/v2/everything?q=bisnis+OR+teknologi+OR+digital&language=id&sortBy=publishedAt&pageSize=6&apiKey=${newsKey}`;
        const res = await fetch(url, { signal: abortController.signal });
        if (res.ok) {
          const data = await res.json();
          if (data.articles && data.articles.length > 0) {
            articles = data.articles.map((art: any) => ({
              title: art.title,
              summary: art.description || 'Klik baca selengkapnya untuk membaca artikel dari sumber asli.',
              source: art.source?.name || 'NewsAPI',
              url: art.url,
              publishedAt: art.publishedAt,
              badge: 'SEO & Growth'
            }));
          }
        }
      }

      // 2. Try NewsData.io if NewsAPI failed/empty
      if (articles.length === 0 && newsDataKey) {
        const url = `https://newsdata.io/api/1/news?apikey=${newsDataKey}&q=bisnis%20digital&language=id`;
        const res = await fetch(url, { signal: abortController.signal });
        if (res.ok) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            articles = data.results.slice(0, 6).map((art: any) => ({
              title: art.title,
              summary: art.description || art.content?.substring(0, 200) || 'Berita pertumbuhan bisnis digital Indonesia.',
              source: art.source_id || 'NewsData',
              url: art.link,
              publishedAt: art.pubDate || new Date().toISOString(),
              badge: 'Bisnis Digital'
            }));
          }
        }
      }

      // 3. Try Finnhub general business news if still empty
      if (articles.length === 0 && finnhubKey) {
        const url = `https://finnhub.io/api/v1/news?category=general&token=${finnhubKey}`;
        const res = await fetch(url, { signal: abortController.signal });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            articles = data.slice(0, 6).map((art: any) => ({
              title: art.headline,
              summary: art.summary || 'General business market news feed.',
              source: art.source || 'Finnhub',
              url: art.url,
              publishedAt: new Date(art.datetime * 1000).toISOString(),
              badge: 'Market News'
            }));
          }
        }
      }

      clearTimeout(timeoutId);

      if (articles.length > 0) {
        // Save to DB cache
        await setTelemetryCache(cacheKey, articles, 'News Aggregator');
      } else {
        isFresh = false;
      }

    } catch (err) {
      clearTimeout(timeoutId);
      isFresh = false;
      console.warn('News APIs fetch failed, fallback to DB cache:', err);
    }

    // 3. Graceful Fallback to stale cache or static data
    if (!isFresh || articles.length === 0) {
      const staleData = await getTelemetryCache(cacheKey, 99999);
      if (staleData) {
        articles = staleData;
      } else {
        articles = [
          {
            title: 'Strategi SEO Lokal Mendominasi Pencarian UMKM di Indonesia',
            summary: 'Bagaimana bisnis lokal memanfaatkan optimasi Google Business Profile dan pSEO untuk menjangkau klien wilayah terdekat secara organik.',
            source: 'Analisis Portofolio',
            url: '/blog/cara-optimasi-web-umkm-indonesia',
            publishedAt: new Date().toISOString(),
            badge: 'SEO & Growth'
          },
          {
            title: 'Tren Search Generative Experience (SGE) & Dampaknya Bagi Copywriter',
            summary: 'Mesin pencari berbasis AI merubah pola interaksi pembaca. Cara menulis ulasan yang kaya data dan relevan agar dilirik LLM.',
            source: 'Riset Wawasan',
            url: '/blog/mengapa-ai-search-mengubah-cara-kita-menulis-konten',
            publishedAt: new Date().toISOString(),
            badge: 'AI Search'
          }
        ];
      }
    }

    return new NextResponse(JSON.stringify({ success: true, data: articles, source: isFresh ? 'External APIs' : 'DB Stale Fallback' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': CACHE_CONTROL
      }
    });

  } catch (error) {
    console.error('API Error /api/sovereign/news:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
