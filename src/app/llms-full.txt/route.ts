import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';

  try {
    // 1. Fetch articles
    const { data: articles } = await supabase
      .from('articles')
      .select('title, slug, meta_description, semantic_keywords, content, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    // 2. Fetch references
    const { data: references } = await supabase
      .from('reference_items')
      .select('title, slug, category, summary, content, tags')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    // 3. Fetch cities
    const { data: cities } = await supabase
      .from('cities')
      .select('name, slug, target_niche, latitude, longitude')
      .order('name', { ascending: true });

    let markdown = `# Muhammad Khoiruzzadittaqwa (Zadit) — Full-Stack Growth Architect & Tech Consultant\n`;
    markdown += `## Full Repository/Site Content Index for AI Agents\n\n`;
    markdown += `This document contains the complete semantic catalog of articles, checklists, playbooks, and regional directories on muhzadit.vercel.app.\n\n`;
    
    markdown += `### Strategic Pages & Sections\n`;
    markdown += `- **Home Portfolio:** ${SITE_URL}\n`;
    markdown += `- **Growth Blog:** ${SITE_URL}/blog\n`;
    markdown += `- **Regional Business Directory:** ${SITE_URL}/directory\n`;
    markdown += `- **Free Website Audit Engine:** ${SITE_URL}/utility/audit-engine\n`;
    markdown += `- **Contact/Partnership:** ${SITE_URL}/#partnership\n\n`;
    markdown += `---\n\n`;

    // 1. Articles
    markdown += `## 1. Dynamic Articles (Zadit Growth Blog)\n`;
    markdown += `Total: ${articles?.length || 0} articles\n\n`;
    if (articles) {
      articles.forEach((art) => {
        const date = art.published_at ? new Date(art.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Juni 2026';
        const cleanContent = art.content ? art.content.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim() : '';
        const excerpt = cleanContent.substring(0, 400);
        const keywords = Array.isArray(art.semantic_keywords) ? art.semantic_keywords.join(', ') : '';

        markdown += `### [${art.title}](${SITE_URL}/blog/${art.slug})\n`;
        markdown += `- **Published:** ${date}\n`;
        markdown += `- **Summary:** ${art.meta_description || ''}\n`;
        if (keywords) {
          markdown += `- **Keywords:** ${keywords}\n`;
        }
        markdown += `- **Excerpt:** ${excerpt}...\n\n`;
      });
    }

    markdown += `---\n\n`;

    // 2. Reference Items
    markdown += `## 2. Reference Items (Sovereign Reference Bank)\n`;
    markdown += `Total: ${references?.length || 0} items\n\n`;
    if (references) {
      references.forEach((ref) => {
        const cleanContent = ref.content ? ref.content.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim() : '';
        const excerpt = cleanContent.substring(0, 400);
        const tags = Array.isArray(ref.tags) ? ref.tags.join(', ') : '';

        markdown += `### [${ref.title}](${SITE_URL}/blog/${ref.slug})\n`;
        markdown += `- **Category:** ${ref.category}\n`;
        markdown += `- **Summary:** ${ref.summary || ''}\n`;
        if (tags) {
          markdown += `- **Tags:** ${tags}\n`;
        }
        markdown += `- **Excerpt:** ${excerpt}...\n\n`;
      });
    }

    markdown += `---\n\n`;

    // 3. Cities
    markdown += `## 3. Regional Directories (Target Cities)\n`;
    markdown += `Total: ${cities?.length || 0} cities\n\n`;
    if (cities) {
      cities.forEach((city) => {
        markdown += `- **[${city.name}](${SITE_URL}/directory/${city.slug})** - Target Niche: ${city.target_niche || 'Layanan Digital & SEO'} (Coordinates: ${city.latitude}, ${city.longitude})\n`;
      });
    }

    return new NextResponse(markdown, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600',
      },
    });
  } catch (err: any) {
    return new NextResponse(`Error generating llms-full.txt: ${err.message}`, { status: 500 });
  }
}
