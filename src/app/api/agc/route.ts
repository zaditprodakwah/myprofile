import { NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabase-server';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { routeLLM } from '@/lib/llm-router';

// Upgraded Kincai-Style Scraper and Rewriter with Robust No-AI Fallback
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { secret, feedUrl = 'https://news.google.com/rss/search?q=seo+growth+marketing+indonesia&hl=id&gl=ID&ceid=ID:id', testOnly = false } = body;

    const adminKey = process.env.ADMIN_SECRET_KEY;
    if (!adminKey || secret !== adminKey) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const res = await fetch(feedUrl, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ success: false, message: 'Failed to fetch RSS feed' }, { status: 500 });
    }
    const xmlText = await res.text();

    const itemsRegex = /<item>([\s\S]*?)<\/item>/gi;
    const matchedItems = xmlText.match(itemsRegex) || [];

    if (testOnly) {
      return NextResponse.json({ success: true, message: `Koneksi Berhasil. Menemukan ${matchedItems.length} artikel rujukan.` });
    }

    if (matchedItems.length === 0) {
      return NextResponse.json({ success: true, message: 'No RSS items found in feed' });
    }

    let createdCount = 0;
    let skippedCount = 0;
    let aiRewriteCount = 0;
    let fallbackCount = 0;

    // Process up to 5 items directly to stay fast and stay within API limit safe margins
    const itemsToProcess = matchedItems.slice(0, 5);

    for (const itemXml of itemsToProcess) {
      // 1. Title
      const titleMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i) || itemXml.match(/<title>([\s\S]*?)<\/title>/i);
      let title = titleMatch ? titleMatch[1].trim() : '';

      // 2. Original URL
      const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/i);
      const originalUrl = linkMatch ? linkMatch[1].trim() : '';

      // Clean up google news suffix if present
      title = title.replace(/\s+-\s+.*$/, '');

      if (!title || !originalUrl) continue;

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      // Check if exists
      const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (existing) {
        skippedCount++;
        continue;
      }

      // Extract RSS details for fallback
      const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) || itemXml.match(/<description>([\s\S]*?)<\/description>/i);
      const description = descMatch ? descMatch[1].trim() : '';
      
      const contentMatch = itemXml.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/i) || itemXml.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/i);
      const fullContent = contentMatch ? contentMatch[1].trim() : description;

      const cleanText = fullContent.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
      const snippet = cleanText.split('. ').slice(0, 3).join('. ') + '.';

      let thumbnailUrl = '';
      const mediaMatch = itemXml.match(/<media:content[^>]*url="([^"]*)"/i) || itemXml.match(/<enclosure[^>]*url="([^"]*)"/i);
      if (mediaMatch) thumbnailUrl = mediaMatch[1];
      else {
        const imgMatch = fullContent.match(/<img[^>]*src="([^"]*)"/i);
        if (imgMatch) thumbnailUrl = imgMatch[1];
      }

      let isAISuccess = false;
      let finalHtmlContent = '';
      let metaTitle = `${title} | Zadit Growth Blog`;
      let metaDescription = snippet.substring(0, 160);
      let semanticKeywords = [slug.replace(/-/g, ' '), 'seo', 'growth marketing'];
      let faqItems: Array<{ question: string; answer: string }> = [];

      try {
        // Fetch full page
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 6000);
        const pageRes = await fetch(originalUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
          }
        });
        clearTimeout(id);
        if (!pageRes.ok) throw new Error(`HTTP error: ${pageRes.status}`);
        
        const html = await pageRes.text();
        const dom = new JSDOM(html, { url: originalUrl });
        const reader = new Readability(dom.window.document);
        const article = reader.parse();
        if (!article || !article.textContent || article.textContent.trim().length < 200) {
          throw new Error("Page content empty or too short");
        }

        const fullText = article.textContent.trim();

        // Rewrite using AI
        const systemInstruction = `Tulis ulang artikel berikut ke dalam Bahasa Indonesia yang profesional, orisinal, menarik, dan informatif. 
Panjang tulisan sekitar 600-800 kata. 
Gunakan struktur Definition-Lead pada 200 kata pertama (contoh: "X adalah Y yang berfungsi untuk Z...").
Bagi artikel menjadi 3-4 subjudul H2.
Tulis artikel dalam format HTML yang bersih (menggunakan <p>, <h2>, <ul>, <ol>).`;
        
        const userPrompt = `Judul: ${title}\n\nKonten Asli:\n${fullText.substring(0, 4000)}`;
        const generatedContent = await routeLLM('content', userPrompt, systemInstruction);

        if (!generatedContent || generatedContent.startsWith('[API Offline]')) {
          throw new Error("AI API is offline or failed");
        }

        finalHtmlContent = generatedContent;

        // Generate Metadata (Description, keywords, FAQs) in one JSON payload to save token/requests
        const metaInstruction = 'Kembalikan HANYA format JSON valid tanpa code block markdown atau teks penjelasan tambahan.';
        const metaPrompt = `Berdasarkan artikel berikut, buatlah metadata JSON dengan format persis seperti ini:
{
  "meta_description": "Ringkasan artikel sepanjang 150-160 karakter untuk meta deskripsi SEO.",
  "semantic_keywords": ["keyword1", "keyword2", "keyword3"],
  "faq": [
    {"question": "Pertanyaan 1?", "answer": "Jawaban 1."},
    {"question": "Pertanyaan 2?", "answer": "Jawaban 2."},
    {"question": "Pertanyaan 3?", "answer": "Jawaban 3."}
  ]
}
Artikel: ${generatedContent.substring(0, 1500)}`;

        const metaJsonRaw = await routeLLM('seo', metaPrompt, metaInstruction);
        if (metaJsonRaw && !metaJsonRaw.startsWith('[API Offline]')) {
          try {
            const cleanJson = metaJsonRaw.match(/\{[\s\S]*\}/)?.[0] || '{}';
            const parsedMeta = JSON.parse(cleanJson);
            if (parsedMeta.meta_description) metaDescription = parsedMeta.meta_description.substring(0, 160);
            if (Array.isArray(parsedMeta.semantic_keywords)) semanticKeywords = parsedMeta.semantic_keywords;
            if (Array.isArray(parsedMeta.faq)) faqItems = parsedMeta.faq;
          } catch (jsonErr) {
            console.warn('Failed to parse dynamic AI metadata JSON', jsonErr);
          }
        }

        isAISuccess = true;
        aiRewriteCount++;
      } catch (err) {
        console.warn(`AI Scraper / Rewrite failed for article: "${title}". Falling back to No-AI RSS snippet.`, err);
        
        // No-AI Fallback Layout
        finalHtmlContent = `
          ${thumbnailUrl ? `<p><img src="${thumbnailUrl}" alt="${title}" style="width: 100%; height: auto; border-radius: 12px; margin-bottom: 20px;" /></p>` : ''}
          <p>${snippet}</p>
          <div style="margin-top: 30px; display: flex; justify-content: center;">
            <a href="${originalUrl}" target="_blank" rel="nofollow noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px; background-color: #0d9488; color: #ffffff; font-weight: bold; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-family: sans-serif;">
              Baca Selengkapnya di Sumber Asli
            </a>
          </div>
        `;
        
        faqItems = [
          {
            question: `Di mana artikel asli "${title}" dipublikasikan?`,
            answer: `Artikel ini dipublikasikan secara lengkap di platform media mitra kami. Anda dapat membacanya langsung melalui tautan rujukan resmi di bagian bawah halaman.`
          }
        ];

        fallbackCount++;
      }

      // Save to Database
      const { error } = await supabase.from('articles').insert({
        title,
        slug,
        source_feed: feedUrl,
        original_url: originalUrl,
        content: finalHtmlContent,
        meta_title: metaTitle,
        meta_description: metaDescription,
        semantic_keywords: semanticKeywords,
        faq_items: faqItems,
        is_published: true,
        published_at: new Date().toISOString()
      });

      if (!error) {
        createdCount++;
        
        // Trigger Google Search Indexing & IndexNow for this new article url
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';
        const articleUrl = `${siteUrl}/blog/${slug}`;
        
        fetch(`${siteUrl}/api/index-now`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: articleUrl, type: 'URL_UPDATED' })
        }).catch(err => console.error('Failed to trigger indexing API route:', err));
        
        // Fallback sitemap ping
        const sitemapUrl = `${siteUrl}/sitemap.xml`;
        fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`).catch(() => {});
      } else {
        console.error('Failed to insert article to database:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed RSS feed. Created: ${createdCount} (AI Rewrite: ${aiRewriteCount}, Fallback: ${fallbackCount}), Skipped: ${skippedCount}`
    });
  } catch (err) {
    console.error('AGC Router Error:', err);
    return NextResponse.json({ success: false, message: err instanceof Error ? err.message : 'Internal Error' }, { status: 500 });
  }
}
