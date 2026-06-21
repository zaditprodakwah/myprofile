import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

interface Props {
  children: React.ReactNode;
  params: Promise<{ city: string, 'entity-slug': string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ city: string, 'entity-slug': string }> }): Promise<Metadata> {
  const { city: cityParam, 'entity-slug': entitySlug } = await params;
  const city = cityParam.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';
  
  // Try to fetch entity name from DB for accurate title
  const { data } = await supabase
    .from('directory_entities')
    .select('name, tagline')
    .eq('slug', entitySlug)
    .eq('city_slug', cityParam)
    .maybeSingle();

  const entityName = data?.name || entitySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const description = data?.tagline || `Profil lengkap, kontak, dan alamat untuk ${entityName} di ${city}. Terverifikasi di Direktori Ekosistem Digital Zadit.`;
  const ogTitle = `${entityName}`;
  const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(ogTitle)}&type=directory&subtitle=${encodeURIComponent(`${description.substring(0, 80)}... di wilayah ${city}`)}`;

  return {
    title: `${entityName} | Direktori Digital ${city} | Zadit Growth`,
    description,
    alternates: {
      canonical: `/directory/${cityParam}/${entitySlug}`
    },
    openGraph: {
      title: `${entityName} | Direktori Digital ${city}`,
      description,
      url: `${siteUrl}/directory/${cityParam}/${entitySlug}`,
      type: 'profile',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${entityName} | Direktori Digital ${city}`,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${entityName} | Direktori Digital ${city} | Zadit Growth`,
      description,
      images: [ogImageUrl],
      creator: '@muhzadit'
    }
  };
}


export default function EntityDirectoryLayout({
  children,
}: Props) {
  return <>{children}</>;
}
