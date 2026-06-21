import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getArticles, getReferenceItems } from "@/lib/data-server";
import { Metadata } from "next";
import { generateBreadcrumbSchema } from "@/lib/seo";
import UnifiedBlogClient from "./UnifiedBlogClient";

export const revalidate = 3600; // ISR cache 1 hour

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';
  const title = "Zadit Growth Hub | Intelijen Data & Wawasan SEO";
  const description = "Temukan playbook pertumbuhan B2B, audit SEO teknikal Next.js, dan telemetri pasar makroekonomi terintegrasi secara real-time.";
  const ogImageUrl = `${siteUrl}/background.png`;

  return {
    title,
    description,
    alternates: {
      canonical: '/blog'
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/blog`,
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

export default async function BlogIndexPage() {
  const [articles, references] = await Promise.all([
    getArticles(),
    getReferenceItems()
  ]);

  const breadcrumbObj = generateBreadcrumbSchema([
    { name: "Beranda", path: "/" },
    { name: "Growth Hub", path: "/blog" }
  ]);

  const blogSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "name": "Zadit Growth Hub",
        "description": "Playbook pertumbuhan B2B, audit SEO teknikal Next.js, dan telemetri pasar makroekonomi terintegrasi secara real-time.",
        "publisher": {
          "@type": "Person",
          "name": "Muhammad Khoiruzzadittaqwa"
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <Header />
      <main className="flex-1 bg-alabaster pt-28 pb-24 px-6 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Breadcrumb */}
          <nav className="text-xs font-mono text-text-muted flex gap-2 items-center">
            <Link href="/" className="hover:text-teal-accent">Home</Link>
            <span>/</span>
            <span className="text-text-primary font-medium">Growth Hub</span>
          </nav>

          {/* Heading */}
          <div className="space-y-4">
            <span className="text-xs font-mono tracking-widest text-gold-accent uppercase">
              {'// Pusat Wawasan & Intelijen Pasar Terintegrasi'}
            </span>
            <h1 className="text-3xl md:text-5xl font-heading-serif font-bold text-text-primary leading-tight">
              Growth Hub & Telemetri Pasar
            </h1>
            <p className="text-sm md:text-base text-text-muted max-w-2xl leading-relaxed">
              Pemetaan taktis indikator ekonomi makro, standardisasi checklist SEO, serta playbook otoritas pertumbuhan B2B di bawah satu kendali.
            </p>
          </div>

          {/* Interactive Unified Client Wrapper */}
          <UnifiedBlogClient initialArticles={articles} initialReferences={references} />

        </div>
      </main>
      <Footer />
    </>
  );
}
