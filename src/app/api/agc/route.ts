import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// No-AI Pure XML Parser
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { secret, feedUrl = 'https://news.google.com/rss/search?q=seo+growth+marketing+indonesia&hl=id&gl=ID&ceid=ID:id' } = body;

    const adminKey = process.env.ADMIN_SECRET_KEY || 'zadit_growth_secret_2026';
    if (secret !== adminKey) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const res = await fetch(feedUrl, { cache: 'no-store' });
    if (!res.ok) {
      return new NextResponse('Failed to fetch RSS feed', { status: 500 });
    }
    const xmlText = await res.text();

    const itemsRegex = /<item>([\s\S]*?)<\/item>/gi;
    const matchedItems = xmlText.match(itemsRegex) || [];

    if (matchedItems.length === 0) {
      return NextResponse.json({ success: true, message: 'No RSS items found in feed' });
    }

    let createdCount = 0;
    let skippedCount = 0;

    // Process up to 5 items directly since it's very fast without AI
    const itemsToProcess = matchedItems.slice(0, 5);

    for (const itemXml of itemsToProcess) {
      // 1. Title
      const titleMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i) || itemXml.match(/<title>([\s\S]*?)<\/title>/i);
      let title = titleMatch ? titleMatch[1].trim() : '';

      // 2. Original URL
      const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/i);
      const originalUrl = linkMatch ? linkMatch[1].trim() : '';

      // Clean up google news suffix
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

      // 3. Extract description/content (snippet curation)
      const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) || itemXml.match(/<description>([\s\S]*?)<\/description>/i);
      const description = descMatch ? descMatch[1].trim() : '';
      
      const contentMatch = itemXml.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/i) || itemXml.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/i);
      const fullContent = contentMatch ? contentMatch[1].trim() : description;

      // Extract 1-2 paragraphs for snippet
      const cleanText = fullContent.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
      const snippet = cleanText.split('. ').slice(0, 3).join('. ') + '.';

      // 4. Extract Thumbnail
      let thumbnailUrl = '';
      const mediaMatch = itemXml.match(/<media:content[^>]*url="([^"]*)"/i) || itemXml.match(/<enclosure[^>]*url="([^"]*)"/i);
      if (mediaMatch) thumbnailUrl = mediaMatch[1];
      else {
        // try finding img src inside description
        const imgMatch = fullContent.match(/<img[^>]*src="([^"]*)"/i);
        if (imgMatch) thumbnailUrl = imgMatch[1];
      }

      // 5. Build HTML content safely
      const finalHtmlContent = `
        ${thumbnailUrl ? `<img src="${thumbnailUrl}" alt="${title}" style="width: 100%; height: auto; border-radius: 12px; margin-bottom: 20px;" />` : ''}
        <p class="text-base text-text-primary leading-relaxed">${snippet}</p>
        <div class="mt-6 flex justify-center">
          <a href="${originalUrl}" target="_blank" rel="nofollow noopener noreferrer" class="inline-flex items-center gap-2 bg-teal-accent text-white font-bold px-6 py-3 rounded-xl hover:bg-teal-glow transition-colors">
            Baca Selengkapnya di Sumber Asli
          </a>
        </div>
      `;

      const { error } = await supabase.from('articles').insert({
        title,
        slug,
        source_feed: feedUrl,
        original_url: originalUrl,
        content: finalHtmlContent,
        meta_title: `${title} | Zadit Growth Blog`,
        meta_description: snippet.substring(0, 160),
        semantic_keywords: [slug.replace(/-/g, ' ')],
        is_published: true,
        published_at: new Date().toISOString()
      });

      if (!error) {
        createdCount++;
        // Auto Ping Google Search Console
        const sitemapUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app'}/sitemap.xml`;
        fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`).catch(() => {});
      } else {
        console.error('Failed to insert article:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed RSS feed (No-AI). Created: ${createdCount}, Skipped: ${skippedCount}`
    });
  } catch (err) {
    console.error('AGC Router Error:', err);
    return new NextResponse(err instanceof Error ? err.message : 'Internal Error', { status: 500 });
  }
}
