import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = params.city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';
  
  return {
    title: `Konsultan Digital Marketing & Web Development di ${city} | Zadit Growth`,
    description: `Direktori lengkap UMKM, institusi, dan agensi di ${city}. Temukan partner strategi digital, pembuatan website, dan optimasi SEO terpercaya di ${city}.`,
    alternates: {
      canonical: `/directory/${params.city}`
    },
    openGraph: {
      title: `Konsultan Digital Marketing & Web Development di ${city} | Zadit Growth`,
      description: `Direktori lengkap UMKM, institusi, dan agensi di ${city}. Temukan partner strategi digital terpercaya.`,
      url: `${siteUrl}/directory/${params.city}`,
    }
  };
}

export default function CityDirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
