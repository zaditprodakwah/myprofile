import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';

export async function GET() {
  const staticPages = [
    '',
    '/utility/audit-engine',
    '/directory',
    '/blog'
  ];

  let dynamicPages: string[] = [];

  try {
    // Fetch articles
    const { data: articles } = await supabase
      .from('articles')
      .select('slug, published_at')
      .eq('is_published', true);

    if (articles) {
      articles.forEach(art => {
        dynamicPages.push(`/blog/${art.slug}`);
      });
    }

    // Fetch cities
    const { data: cities } = await supabase
      .from('cities')
      .select('slug');

    if (cities) {
      cities.forEach(city => {
        dynamicPages.push(`/directory/${city.slug}`);
      });
    }

    // Fetch entities
    const { data: entities } = await supabase
      .from('entities')
      .select('city_slug, slug');

    if (entities) {
      entities.forEach(ent => {
        dynamicPages.push(`/directory/${ent.city_slug}/${ent.slug}`);
      });
    }

    // Fetch reference items
    const { data: references } = await supabase
      .from('reference_items')
      .select('slug')
      .eq('is_active', true);

    if (references) {
      references.forEach(ref => {
        dynamicPages.push(`/sovereign-explorer/${ref.slug}`);
      });
    }

  } catch (err) {
    console.error('Failed to fetch dynamic paths for sitemap', err);
    // Fallbacks just in case
    dynamicPages = [
      '/directory/cirebon',
      '/directory/jakarta-selatan',
      '/blog/cara-optimasi-web-umkm-indonesia',
      '/blog/mengapa-ai-search-mengubah-cara-kita-menulis-konten',
      '/blog/panduan-seo-teknikal-nextjs',
      '/sovereign-explorer/b2b-growth-playbook-landing-page-conversion',
      '/sovereign-explorer/checklist-technical-seo-nextjs-speed'
    ];
  }

  const allPages = [...staticPages, ...dynamicPages];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map((page) => {
      return `
  <url>
    <loc>${SITE_URL}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : page.startsWith('/blog/') || page.startsWith('/directory/') ? '0.8' : '0.9'}</priority>
  </url>`;
    })
    .join('')}
</urlset>`;

  return new NextResponse(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
