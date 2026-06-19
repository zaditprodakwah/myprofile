import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { generateCitySchema, generateDirectorySchema, generateBreadcrumbSchema } from '@/lib/seo';

interface Props {
  children: React.ReactNode;
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: cityParam } = await params;
  const { data: cityData } = await supabase
    .from('cities')
    .select('name')
    .eq('slug', cityParam)
    .maybeSingle();

  const city = cityData?.name || cityParam.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';
  const ogTitle = `Konsultan Digital & Web di ${city}`;
  const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent(ogTitle)}&type=directory&subtitle=${encodeURIComponent(`Direktori UMKM, agensi, dan partner teknologi terpercaya di ${city}`)}`;
  
  return {
    title: `Konsultan Digital Marketing & Web Development di ${city} | Zadit Growth`,
    description: `Direktori lengkap UMKM, institusi, dan agensi di ${city}. Temukan partner strategi digital, pembuatan website, dan optimasi SEO terpercaya di ${city}.`,
    alternates: {
      canonical: `/directory/${cityParam}`
    },
    openGraph: {
      title: `Konsultan Digital Marketing & Web Development di ${city} | Zadit Growth`,
      description: `Direktori lengkap UMKM, institusi, dan agensi di ${city}. Temukan partner strategi digital terpercaya.`,
      url: `${siteUrl}/directory/${cityParam}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Konsultan Digital Marketing & Web Development di ${city}`,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Konsultan Digital Marketing & Web Development di ${city} | Zadit Growth`,
      description: `Direktori lengkap UMKM, institusi, dan agensi di ${city}. Temukan partner strategi digital terpercaya.`,
      images: [ogImageUrl],
      creator: '@muhzadit'
    }
  };
}

export default async function CityDirectoryLayout({ children, params }: Props) {
  const { city: citySlug } = await params;


  // Fetch City details
  const { data: cityData } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', citySlug)
    .maybeSingle();

  // Fetch Entities in this city
  const { data: entitiesData } = await supabase
    .from('entities')
    .select('*')
    .eq('city_slug', citySlug);

  const cityName = cityData?.name || citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Generate Schemas
  const breadcrumbObj = generateBreadcrumbSchema([
    { name: "Beranda", path: "/" },
    { name: "Direktori Wilayah", path: "/directory" },
    { name: cityName, path: `/directory/${citySlug}` }
  ]);

  const schemas: any[] = [
    {
      ...breadcrumbObj,
      "@context": undefined
    }
  ];

  if (cityData) {
    schemas.push({
      ...generateCitySchema(cityData),
      "@context": undefined
    });

    if (entitiesData && entitiesData.length > 0) {
      schemas.push({
        ...generateDirectorySchema(cityData, entitiesData),
        "@context": undefined
      });
    }
  }

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": schemas
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
      />
      {children}
    </>
  );
}

