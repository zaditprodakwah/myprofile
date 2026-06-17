import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { routeLLM } from '@/lib/llm-router';

// POST /api/agc
// Triggered by Admin dashboard or Cron to fetch external RSS and rewrite articles
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { secret, feedUrl = 'https://news.google.com/rss/search?q=seo+growth+marketing+indonesia&hl=id&gl=ID&ceid=ID:id' } = body;

    // Validate admin key
    const adminKey = process.env.ADMIN_SECRET_KEY || 'zadit_growth_secret_2026';
    if (secret !== adminKey) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch the RSS feed
    const res = await fetch(feedUrl, { cache: 'no-store' });
    if (!res.ok) {
      return new NextResponse('Failed to fetch RSS feed', { status: 500 });
    }
    const xmlText = await res.text();

    // Parse items using regex to avoid external packages
    const itemsRegex = /<item>([\s\S]*?)<\/item>/g;
    const matchedItems = xmlText.match(itemsRegex) || [];

    if (matchedItems.length === 0) {
      return NextResponse.json({ success: true, message: 'No RSS items found in feed' });
    }

    let createdCount = 0;
    let skippedCount = 0;

    // Process top 3 items to prevent Vercel Timeout (Hobby limit is 10s)
    const itemsToProcess = matchedItems.slice(0, 3);

    for (const itemXml of itemsToProcess) {
      // Extract title
      const titleMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || itemXml.match(/<title>([\s\S]*?)<\/title>/);
      let title = titleMatch ? titleMatch[1].trim() : '';
      
      // Extract original URL
      const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
      const originalUrl = linkMatch ? linkMatch[1].trim() : '';

      // Clean up google news tracking redirects if present
      title = title.replace(/\s+-\s+.*$/, ''); // remove source name suffix e.g., " - Kompas.com"

      if (!title || !originalUrl) continue;

      // Generate clean slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      // Check if already parsed
      const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (existing) {
        skippedCount++;
        continue;
      }

      // Dynamic AI Rewrite using our LLM router (Gemini Flash primary)
      const systemInstruction = `Tulis artikel panduan SEO & growth marketing yang komprehensif dalam Bahasa Indonesia yang informatif dan formal-conversational. 
      Panjang 600-800 kata. 
      Gunakan struktur Definition-Lead pada 200 kata pertama (contoh: "X adalah Y yang berfungsi untuk Z..."). 
      Bagi artikel menjadi 3 subjudul H2.
      Gunakan format HTML yang bersih (menggunakan <p>, <h2>, <ul>, <ol>).`;

      const promptText = `Tulis artikel SEO komprehensif berdasarkan berita/topik: "${title}". Hubungkan topik ini dengan strategi digital marketing, rekayasa web Next.js/Supabase, dan conversion rate optimization (CRO) untuk pasar Indonesia.`;

      const generatedContent = await routeLLM('content', promptText, systemInstruction);

      // Generate FAQ array dynamically using AI
      const faqPrompt = `Buat 3 FAQ (Pertanyaan dan Jawaban) format JSON array berdasarkan artikel berikut. Format output HANYA array JSON [{question: "...", answer: "..."}]. Artikel: ${generatedContent.substring(0, 1000)}`;
      const rawFaq = await routeLLM('seo', faqPrompt, 'Kembalikan format JSON array saja.');
      
      let faqItems = [];
      try {
        const cleanJson = rawFaq.match(/\[\s*\{[\s\S]*\}\s*\]/)?.[0] || '[]';
        faqItems = JSON.parse(cleanJson);
      } catch {
        faqItems = [
          { question: `Apa fokus utama dari ${title}?`, answer: `Artikel ini membahas bagaimana ${title} memengaruhi peningkatan optimasi web dan digital marketing.` }
        ];
      }

      // Save to Supabase
      const { error } = await supabase.from('articles').insert({
        title,
        slug,
        source_feed: feedUrl,
        original_url: originalUrl,
        content: generatedContent,
        meta_title: `${title} | Zadit Growth Blog`,
        meta_description: `${title}. Panduan terlengkap mengenai optimasi ekosistem digital untuk pertumbuhan bisnis Anda secara berkelanjutan.`,
        semantic_keywords: [slug.replace(/-/g, ' '), 'seo teknikal', 'growth marketing'],
        faq_items: faqItems,
        is_published: true,
        published_at: new Date().toISOString()
      });

      if (!error) {
        createdCount++;
      } else {
        console.error('Failed to insert article:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed RSS feed. Created: ${createdCount}, Skipped: ${skippedCount}`
    });
  } catch (err) {
    console.error('AGC Router Error:', err);
    return new NextResponse(err instanceof Error ? err.message : 'Internal Error', { status: 500 });
  }
}
