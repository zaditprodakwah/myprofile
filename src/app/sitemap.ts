import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { supabase } from '@/lib/supabase/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // 1. Static routes
  const staticRoutes = [
    '',
    '/services',
    '/case-studies',
    '/radar',
    '/solutions',
    '/tools',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. LP Segments
  const segments = ['marketing', 'academic', 'business'].map((mode) => ({
    url: `${baseUrl}/lp/${mode}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // 3. Dynamic Radar Items from Supabase
  const { data: radarItems } = await supabase.from('radar_items').select('slug, updated_at');
  const radarRoutes = (radarItems || []).map((item) => ({
    url: `${baseUrl}/radar/${item.slug}`,
    lastModified: new Date(item.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // 4. Dynamic Tools from Supabase
  const { data: tools } = await supabase.from('tools').select('slug, updated_at');
  const toolRoutes = (tools || []).map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(tool.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 5. pSEO Solutions (Industry + Problem)
  const { data: problems } = await supabase.from('problems').select('slug, industry_slug');
  const solutionRoutes = (problems || []).map((p) => ({
    url: `${baseUrl}/solutions/${p.industry_slug}/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes, 
    ...segments, 
    ...radarRoutes, 
    ...toolRoutes, 
    ...solutionRoutes
  ];
}
