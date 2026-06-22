import { NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase-server';
import { routeLLM } from '@/lib/llm-router';

// Scheduled AI Taxonomy & Semantic Graphing Worker
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.VERCEL === '1' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 1. Fetch articles from Supabase
    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, title, content, slug, semantic_keywords, faq_items')
      .order('published_at', { ascending: false });

    if (error) throw error;
    if (!articles || articles.length === 0) {
      return NextResponse.json({ success: true, message: 'No articles to process.' });
    }

    let updatedCount = 0;

    // We process up to 3 articles per run to stay fast and avoid rate limits
    const unprocessed = articles.slice(0, 3);

    for (const art of unprocessed) {
      const cleanContent = art.content.replace(/<[^>]*>?/gm, ' ').substring(0, 2500);

      // System instruction for categorization and graphing
      const systemInstruction = 'Kembalikan HANYA format JSON valid tanpa code block markdown atau teks penjelasan tambahan.';
      const userPrompt = `Analisis artikel berikut dan tentukan:
1. 3-4 semantic keywords (kategori & tags yang ramah SEO).
2. Temukan dari daftar slug artikel yang ada di bawah ini, mana 3 slug yang paling relevan (semantikal terkait) untuk direkomendasikan.

Daftar Slug Artikel Yang Tersedia:
${articles.map(a => `- ${a.slug}`).join('\n')}

Artikel target untuk dianalisis:
Judul: ${art.title}
Konten: ${cleanContent}

Format output JSON harus seperti ini:
{
  "semantic_keywords": ["seo teknikal", "conversion rate", "saas"],
  "related_slugs": ["slug-terkait-1", "slug-terkait-2"]
}
`;

      const aiResponse = await routeLLM('seo', userPrompt, systemInstruction);

      if (aiResponse && !aiResponse.startsWith('[API Offline]')) {
        try {
          const cleanJson = aiResponse.match(/\{[\s\S]*\}/)?.[0] || '{}';
          const parsed = JSON.parse(cleanJson);

          if (Array.isArray(parsed.semantic_keywords)) {
            // Update semantic_keywords and also build internal relation graph if desired
            const { error: updateError } = await supabase
              .from('articles')
              .update({
                semantic_keywords: parsed.semantic_keywords,
                // We can store related slugs inside a JSON or metadata column if we have one, or rely on tag matches
              })
              .eq('id', art.id);

            if (!updateError) {
              updatedCount++;
            }
          }
        } catch (jsonErr) {
          console.warn('Failed to parse AI graph JSON response:', jsonErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `AI Graphing cron completed. Updated ${updatedCount} articles.`
    });
  } catch (err) {
    console.error('Cron AI Graph Error:', err);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
