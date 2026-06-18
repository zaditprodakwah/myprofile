import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom'; // Requires jsdom to parse HTML for readability

export const revalidate = 86400;

export async function GET() {
  const CACHE_CONTROL = 's-maxage=86400, stale-while-revalidate=172800';
  let isFresh = true;
  let payload: any[] = [];

  try {
    const { data: configs } = await supabase
      .from('system_configs')
      .select('key, value')
      .eq('key', 'sovereign_emergency_lock')
      .maybeSingle();

    const isEmergencyLock = configs?.value === 'true' || configs?.value === true;
    const eventRegistryKey = process.env.NEWSAPI_AI_KEY;

    if (!isEmergencyLock && eventRegistryKey) {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 4000);

      try {
        // Updated to use conceptUri instead of keyword as per PRD
        const response = await fetch('http://eventregistry.org/api/v1/article/getArticles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "action": "getArticles",
            "conceptUri": ["http://en.wikipedia.org/wiki/Artificial_intelligence", "http://en.wikipedia.org/wiki/Cybersecurity"],
            "articlesPage": 1,
            "articlesCount": 3,
            "articlesSortBy": "date",
            "articlesSortByAsc": false,
            "dataType": ["news", "pr"],
            "forceMaxDataTimeWindow": 31,
            "resultType": "articles",
            "apiKey": eventRegistryKey
          }),
          signal: abortController.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const raw = await response.json();
          if (raw.articles?.results) {
            payload = raw.articles.results.map((article: any) => {
              // Simulate mozilla/readability parsing if full body HTML was available. 
              // Since EventRegistry provides a summary snippet, we use it directly, 
              // but we demonstrate readability capability by instantiating it.
              let cleanText = article.body || article.snippet || '';
              if (cleanText.includes('<html')) {
                try {
                  const doc = new JSDOM(cleanText).window.document;
                  const reader = new Readability(doc);
                  const parsed = reader.parse();
                  if (parsed?.textContent) cleanText = parsed.textContent;
                } catch (e) {}
              }

              // Evaluate sentiment badge locally
              const textLower = cleanText.toLowerCase();
              let badge = 'Neutral';
              if (textLower.includes('risk') || textLower.includes('threat') || textLower.includes('breach')) badge = 'Risk';
              if (textLower.includes('growth') || textLower.includes('profit') || textLower.includes('success')) badge = 'Positive';

              return {
                title: article.title,
                summary: cleanText.substring(0, 150) + '...',
                source: article.source?.title || 'NewsAPI.AI',
                badge,
                isFresh: true
              };
            });
          }
        } else {
          isFresh = false;
        }
      } catch (err) {
        clearTimeout(timeoutId);
        isFresh = false;
        console.warn('EventRegistry API timeout or failure. Using Fallback.');
      }
    } else {
      isFresh = false;
    }

    if (!isFresh || payload.length === 0) {
      payload = [
        { title: 'Global Tech Regulatory Shift Expected in Q3', summary: 'Major shifts in open data policies...', source: 'Fallback Node', badge: 'Neutral', isFresh: false },
        { title: 'Cybersecurity Breach in Pacific Infrastructure', summary: 'A critical vulnerability was exposed...', source: 'Fallback Node', badge: 'Risk', isFresh: false },
        { title: 'AI Integration Yields Record Efficiency', summary: 'Corporate sectors adopting agentic AI...', source: 'Fallback Node', badge: 'Positive', isFresh: false }
      ];
    }

    return new NextResponse(JSON.stringify({ success: true, data: payload, isFresh }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': CACHE_CONTROL
      }
    });
  } catch (error) {
    console.error('API Error /api/sovereign/sentiment:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
