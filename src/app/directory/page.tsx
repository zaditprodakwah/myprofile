import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCities } from "@/lib/data-server";
import { Metadata } from "next";
import { generateBreadcrumbSchema } from "@/lib/seo";
import DirectoryClientContainer from "@/components/DirectoryClientContainer";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';
  const title = "Direktori Layanan & Partner Bisnis Lokal Terverifikasi | Zadit Growth";
  const description = "Direktori regional lengkap berisi UMKM, agensi, dan institusi lokal terverifikasi di Indonesia dengan audit performa website.";
  const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent("Direktori Wilayah")}&type=directory&subtitle=${encodeURIComponent("Pemetaan Ekosistem Digital Regional & Bisnis Lokal")}`;

  return {
    title,
    description,
    alternates: {
      canonical: '/directory'
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/directory`,
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

export default async function DirectoryIndexPage() {
  const cities = await getCities();

  const breadcrumbObj = generateBreadcrumbSchema([
    { name: "Beranda", path: "/" },
    { name: "Direktori Wilayah", path: "/directory" }
  ]);

  const directorySchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": "Direktori Bisnis & Layanan Lokal | Zadit Growth Engine",
        "description": "Indeks kredibilitas publik regional dan bank data referensi entitas bisnis lokal terverifikasi di Indonesia.",
        "publisher": {
          "@type": "Person",
          "name": "Muhammad Khoiruzzadittaqwa",
          "jobTitle": "Full-Stack Growth Architect"
        }
      },
      {
        ...breadcrumbObj,
        "@context": undefined
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(directorySchema) }}
      />
      <Header />
      <main className="flex-1 bg-alabaster pt-28 pb-24 px-6 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Heading */}
          <div className="space-y-3">
            <span className="text-xs font-mono tracking-widest text-gold-accent uppercase">Direktori Bisnis & Layanan</span>
            <h1 className="text-3xl md:text-5xl font-heading-serif font-bold text-text-primary leading-tight">
              Indeks Direktori Kredibilitas Publik
            </h1>
            <p className="text-sm text-text-muted max-w-xl leading-relaxed">
              Temukan data entitas terverifikasi regional, lakukan pencarian terpadu, dan hubungi mitra langsung untuk optimasi strategi digital Anda.
            </p>
          </div>

          {/* Directory Search & List Container */}
          <DirectoryClientContainer cities={cities} />

        </div>
      </main>
      <Footer />
    </>
  );
}
