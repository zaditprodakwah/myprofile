import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
  imageUrl?: string;
  imageTitle?: string;
}

export async function GET() {
  const entries: SitemapEntry[] = [];
  const allDates: string[] = [];

  // Helper to extract clean YYYY-MM-DD
  const formatToDate = (dateStr?: string | null): string => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  let articlesEntries: SitemapEntry[] = [];
  let citiesEntries: SitemapEntry[] = [];
  let entitiesEntries: SitemapEntry[] = [];
  let referencesEntries: SitemapEntry[] = [];
  let auditLeadsEntries: SitemapEntry[] = [];

  try {
    // 1. Fetch articles
    const { data: articles } = await supabase
      .from('articles')
      .select('title, slug, published_at, updated_at')
      .eq('is_published', true);

    if (articles) {
      articles.forEach(art => {
        const rawDate = art.updated_at || art.published_at;
        const formatted = formatToDate(rawDate);
        if (formatted) allDates.push(formatted);
        
        articlesEntries.push({
          loc: `${SITE_URL}/blog/${art.slug}`,
          lastmod: formatted || '2026-06-23',
          changefreq: 'weekly',
          priority: '0.8',
          imageUrl: `${SITE_URL}/api/og?title=${encodeURIComponent(art.title)}&type=blog`,
          imageTitle: art.title
        });
      });
    }

    // 2. Fetch cities
    const { data: cities } = await supabase
      .from('cities')
      .select('name, slug, created_at');

    if (cities) {
      cities.forEach(city => {
        const formatted = formatToDate(city.created_at);
        if (formatted) allDates.push(formatted);
        
        citiesEntries.push({
          loc: `${SITE_URL}/directory/${city.slug}`,
          lastmod: formatted || '2026-06-23',
          changefreq: 'weekly',
          priority: '0.8',
          imageUrl: `${SITE_URL}/api/og?title=${encodeURIComponent(`Konsultan Digital & Web di ${city.name}`)}&type=directory`,
          imageTitle: `Konsultan Digital Marketing & Web Development di ${city.name}`
        });
      });
    }

    // 3. Fetch entities
    const { data: entities } = await supabase
      .from('directory_entities')
      .select('name, city_slug, slug, created_at');

    if (entities) {
      entities.forEach(ent => {
        const formatted = formatToDate(ent.created_at);
        if (formatted) allDates.push(formatted);
        
        entitiesEntries.push({
          loc: `${SITE_URL}/directory/${ent.city_slug}/${ent.slug}`,
          lastmod: formatted || '2026-06-23',
          changefreq: 'weekly',
          priority: '0.8',
          imageUrl: `${SITE_URL}/api/og?title=${encodeURIComponent(ent.name)}&type=directory`,
          imageTitle: ent.name
        });
      });
    }

    // 4. Fetch reference items
    const { data: references } = await supabase
      .from('reference_items')
      .select('title, slug, updated_at, created_at')
      .eq('is_active', true);

    if (references) {
      references.forEach(ref => {
        const rawDate = ref.updated_at || ref.created_at;
        const formatted = formatToDate(rawDate);
        if (formatted) allDates.push(formatted);
        
        referencesEntries.push({
          loc: `${SITE_URL}/blog/${ref.slug}`,
          lastmod: formatted || '2026-06-23',
          changefreq: 'weekly',
          priority: '0.8',
          imageUrl: `${SITE_URL}/api/og?title=${encodeURIComponent(ref.title)}&type=reference`,
          imageTitle: ref.title
        });
      });
    }

    // 5. Fetch audited domains for pSEO indexing
    const { data: auditedLeads } = await supabase
      .from('utility_leads')
      .select('target_site_url, created_at')
      .order('created_at', { ascending: false });

    if (auditedLeads) {
      const uniqueDomains = new Set<string>();
      auditedLeads.forEach(lead => {
        if (lead.target_site_url) {
          const cleanDomain = lead.target_site_url.replace(/^https?:\/\//i, '').replace(/\/$/, '').trim();
          if (cleanDomain && !uniqueDomains.has(cleanDomain)) {
            uniqueDomains.add(cleanDomain);
            const formatted = formatToDate(lead.created_at);
            if (formatted) allDates.push(formatted);
            
            auditLeadsEntries.push({
              loc: `${SITE_URL}/utility/audit-engine/${cleanDomain}`,
              lastmod: formatted || '2026-06-23',
              changefreq: 'weekly',
              priority: '0.6',
              imageUrl: `${SITE_URL}/api/og?title=${encodeURIComponent(`Laporan Audit ${cleanDomain}`)}&type=reference`,
              imageTitle: `Laporan Audit Kecepatan & SEO untuk ${cleanDomain}`
            });
          }
        }
      });
    }

  } catch (err) {
    console.error('Failed to fetch dynamic paths for sitemap', err);
  }

  // Calculate the latest date among all items, fallback to a stable date
  let latestDate = '2026-06-23';
  if (allDates.length > 0) {
    const sorted = [...allDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    if (sorted[0]) {
      latestDate = sorted[0];
    }
  }

  // Static Index Pages (which now dynamically inherit the latest modification date of any sub-item)
  const staticEntries: SitemapEntry[] = [
    {
      loc: `${SITE_URL}`,
      lastmod: latestDate,
      changefreq: 'daily',
      priority: '1.0',
      imageUrl: `${SITE_URL}/api/og?type=home`,
      imageTitle: 'Muhammad Khoiruzzadittaqwa | Full-Stack Growth Architect'
    },
    {
      loc: `${SITE_URL}/utility/audit-engine`,
      lastmod: latestDate,
      changefreq: 'weekly',
      priority: '0.8',
      imageUrl: `${SITE_URL}/api/og?title=${encodeURIComponent('Audit Kecepatan Website')}&type=home&subtitle=${encodeURIComponent('Audit SEO dan performa web gratis')}`,
      imageTitle: 'Audit Kecepatan Website Gratis'
    },
    {
      loc: `${SITE_URL}/directory`,
      lastmod: latestDate,
      changefreq: 'weekly',
      priority: '0.8',
      imageUrl: `${SITE_URL}/api/og?title=${encodeURIComponent('Direktori Wilayah')}&type=directory`,
      imageTitle: 'Direktori Bisnis & Layanan Lokal'
    },
    {
      loc: `${SITE_URL}/blog`,
      lastmod: latestDate,
      changefreq: 'weekly',
      priority: '0.8',
      imageUrl: `${SITE_URL}/api/og?title=${encodeURIComponent('Zadit Growth Blog')}&type=blog`,
      imageTitle: 'Zadit Growth Blog'
    },
    {
      loc: `${SITE_URL}/utility/fact-checker`,
      lastmod: latestDate,
      changefreq: 'weekly',
      priority: '0.8',
      imageUrl: `${SITE_URL}/api/og?title=${encodeURIComponent('Google Fact-Checker')}&type=home&subtitle=${encodeURIComponent('Validasi klaim informasi lewat Google Fact Check API')}`,
      imageTitle: 'Google Fact-Checker - Validasi Klaim Berita'
    },
    {
      loc: `${SITE_URL}/utility/video-auditor`,
      lastmod: latestDate,
      changefreq: 'weekly',
      priority: '0.8',
      imageUrl: `${SITE_URL}/api/og?title=${encodeURIComponent('YouTube Video & Channel Auditor')}&type=home&subtitle=${encodeURIComponent('Audit video & channel YouTube dengan YouTube Data API v3')}`,
      imageTitle: 'YouTube Video & Channel Auditor'
    }
  ];

  // Combine static and dynamic lists
  entries.push(
    ...staticEntries,
    ...articlesEntries,
    ...citiesEntries,
    ...entitiesEntries,
    ...referencesEntries,
    ...auditLeadsEntries
  );

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${entries
    .map((entry) => {
      let imgNode = '';
      if (entry.imageUrl) {
        imgNode = `
    <image:image>
      <image:loc>${entry.imageUrl.replace(/&/g, '&amp;')}</image:loc>
      <image:title>${entry.imageTitle ? entry.imageTitle.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : ''}</image:title>
    </image:image>`;
      }

      return `
  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>${imgNode}
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
