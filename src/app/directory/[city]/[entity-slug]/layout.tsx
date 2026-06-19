import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

export async function generateMetadata({ params }: { params: { city: string, 'entity-slug': string } }): Promise<Metadata> {
  const city = params.city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';
  
  // Try to fetch entity name from DB for accurate title
  const { data } = await supabase
    .from('entities')
    .select('name, tagline')
    .eq('slug', params['entity-slug'])
    .eq('city_slug', params.city)
    .maybeSingle();

  const entityName = data?.name || params['entity-slug'].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const description = data?.tagline || `Profil lengkap, kontak, dan alamat untuk ${entityName} di ${city}. Terverifikasi di Direktori Ekosistem Digital Zadit.`;

  return {
    title: `${entityName} | Direktori Digital ${city} | Zadit Growth`,
    description,
    alternates: {
      canonical: `/directory/${params.city}/${params['entity-slug']}`
    },
    openGraph: {
      title: `${entityName} | Direktori Digital ${city}`,
      description,
      url: `${siteUrl}/directory/${params.city}/${params['entity-slug']}`,
      type: 'profile'
    }
  };
}

export default function EntityDirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
