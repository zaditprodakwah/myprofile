import { NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase-server';
import { routeLLM } from '@/lib/llm-router';

// Worker 2: DB Sweep & Content Optimizer
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.VERCEL === '1' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 1. Find articles that need enrichment (e.g. faq_items is null/empty or content is very short)
    // For simplicity, we just pick 2 articles that have less than 500 characters and haven't been enriched
    const { data: articles } = await supabase
      .from('articles')
      .select('*')
      .is('faq_items', null)
      .limit(2);

    let enriched = 0;

    if (articles && articles.length > 0) {
      for (const article of articles) {
        try {
          const sysInstruction = "Berikan opini pakar (Curator Insight) sepanjang 1 paragraf, dan buatkan 2 pertanyaan FAQ berdasarkan cuplikan artikel ini. Format output: JSON dengan key 'insight' (string) dan 'faq' (array of objects {question, answer}). Hindari format markdown di luar JSON.";
          const prompt = `Artikel: ${article.content.substring(0, 800)}`;
          
          const aiResponse = await routeLLM('content', prompt, sysInstruction);
          
          let parsed;
          try {
            const cleanJson = aiResponse.match(/\{[\s\S]*\}/)?.[0] || '{}';
            parsed = JSON.parse(cleanJson);
          } catch (e) {
            continue;
          }

          if (parsed && parsed.insight && parsed.faq) {
            const newContent = `${article.content}\n<div class="mt-8 p-6 bg-teal-accent/5 rounded-2xl border border-teal-accent/20">\n<h4 class="text-sm font-bold text-teal-accent mb-2 uppercase tracking-wider">Curator Insight</h4>\n<p class="text-sm text-text-primary leading-relaxed">${parsed.insight}</p>\n</div>`;
            
            await supabase.from('articles').update({
              content: newContent,
              faq_items: parsed.faq
            }).eq('id', article.id);
            
            enriched++;
          }
        } catch (e) {
          console.error('Failed to enrich article', article.id);
        }
      }
    }

    // 2. Directory Entity Refresh (Stale > 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: staleEntities } = await supabase
      .from('directory_entities')
      .select('id, place_id')
      .not('place_id', 'is', null)
      .lt('last_scraped', thirtyDaysAgo.toISOString())
      .limit(5);

    let entitiesRefreshed = 0;

    if (staleEntities && staleEntities.length > 0) {
      const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const host = request.headers.get('host') || 'localhost:3000';
      const baseUrl = `${protocol}://${host}`;

      for (const entity of staleEntities) {
        try {
          const res = await fetch(`${baseUrl}/api/sovereign/places?placeId=${entity.place_id}&entityId=${entity.id}`);
          if (res.ok) {
            entitiesRefreshed++;
          }
        } catch (e) {
          console.error('Failed to refresh entity', entity.id);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Worker-DB Executed. Enriched ${enriched} articles. Refreshed ${entitiesRefreshed} directory entities.` 
    });
  } catch (err) {
    console.error('Cron Worker-DB Error:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
