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
  const entries: SitemapEntry[] = [
    {
      loc: `${SITE_URL}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '1.0',
      imageUrl: `${SITE_URL}/api/og?type=home`,
      imageTitle: 'Muhammad Khoiruzzadittaqwa | Full-Stack Growth Architect'
    },
    {
      loc: `${SITE_URL}/utility/audit-engine`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.8',
      imageUrl: `${SITE_URL}/api/og?title=${encodeURIComponent('Audit Kecepatan Website')}&type=home&subtitle=${encodeURIComponent('Audit SEO dan performa web gratis')}`,
      imageTitle: 'Audit Kecepatan Website Gratis'
    },
    {
      loc: `${SITE_URL}/directory`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.8',
      imageUrl: `${SITE_URL}/api/og?title=${encodeURIComponent('Direktori Wilayah')}&type=directory`,
      imageTitle: 'Direktori Bisnis & Layanan Lokal'
    },
    {
      loc: `${SITE_URL}/blog`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.8',
      imageUrl: `${SITE_URL}/api/og?title=${encodeURIComponent('Zadit Growth Blog')}&type=blog`,
      imageTitle: 'Zadit Growth Blog'
    },
    {
      loc: `${SITE_URL}/utility/fact-checker`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.8',
      imageUrl: `${SITE_URL}/api/og?title=${encodeURIComponent('Google Fact-Checker')}&type=home&subtitle=${encodeURIComponent('Validasi klaim informasi lewat Google Fact Check API')}`,
      imageTitle: 'Google Fact-Checker - Validasi Klaim Berita'
    },
    {
      loc: `${SITE_URL}/utility/video-auditor`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.8',
      imageUrl: `${SITE_URL}/api/og?title=${encodeURIComponent('YouTube Video & Channel Auditor')}&type=home&subtitle=${encodeURIComponent('Audit video & channel YouTube dengan YouTube Data API v3')}`,
      imageTitle: 'YouTube Video & Channel Auditor'
    }
  ];

  try {
    // 1. Fetch articles
    const { data: articles } = await supabase
      .from('articles')
      .select('title, slug, published_at, updated_at')
      .eq('is_published', true);

    if (articles) {
      articles.forEach(art => {
        const lastmodDate = art.updated_at || art.published_at || new Date().toISOString();
        entries.push({
          loc: `${SITE_URL}/blog/${art.slug}`,
          lastmod: lastmodDate.split('T')[0],
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
        const lastmodDate = city.created_at || new Date().toISOString();
        entries.push({
          loc: `${SITE_URL}/directory/${city.slug}`,
          lastmod: lastmodDate.split('T')[0],
          changefreq: 'weekly',
          priority: '0.8',
          imageUrl: `${SITE_URL}/api/og?title=${encodeURIComponent(`Konsultan Digital & Web di ${city.name}`)}&type=directory`,
          imageTitle: `Konsultan Digital Marketing & Web Development di ${city.name}`
        });
      });
    }

    // 3. Fetch entities
    const { data: entities } = await supabase
      .from('entities')
      .select('name, city_slug, slug, created_at');

    if (entities) {
      entities.forEach(ent => {
        const lastmodDate = ent.created_at || new Date().toISOString();
        entries.push({
          loc: `${SITE_URL}/directory/${ent.city_slug}/${ent.slug}`,
          lastmod: lastmodDate.split('T')[0],
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
        const lastmodDate = ref.updated_at || ref.created_at || new Date().toISOString();
        entries.push({
          loc: `${SITE_URL}/blog/${ref.slug}`,
          lastmod: lastmodDate.split('T')[0],
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
            const lastmodDate = lead.created_at || new Date().toISOString();
            entries.push({
              loc: `${SITE_URL}/utility/audit-engine/${cleanDomain}`,
              lastmod: lastmodDate.split('T')[0],
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
