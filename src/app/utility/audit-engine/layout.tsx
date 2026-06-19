import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';
  const title = "Audit Kecepatan & Performa Website Gratis | Zadit Growth";
  const description = "Audit kecepatan, performa, aksesibilitas (A11y), dan struktur penulisan copywriting beranda website Anda secara real-time dan gratis.";
  const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent('Audit Kecepatan Website')}&type=home&subtitle=${encodeURIComponent('Uji performa, aksesibilitas, dan konversi website Anda secara gratis')}`;

  return {
    title,
    description,
    alternates: {
      canonical: '/utility/audit-engine'
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/utility/audit-engine`,
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@muhzadit'
    }
  };
}

export default function AuditEngineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
