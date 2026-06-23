import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import LatestInsights from "@/components/LatestInsights";
import SidebarNav from "@/components/SidebarNav";
import Footer from "@/components/Footer";

import { getSiteContent, getServices, getCaseStudies, getSystemConfig, getLatestArticles, getLiveStats } from "@/lib/data-server";

import IntegratedServicesHub from "@/components/IntegratedServicesHub";
import dynamic from "next/dynamic";
import { Metadata } from "next";

// Dynamic Imports with Skeleton Loaders for Heavy/Interactive Components to optimize LCP & TBT
const AuditTeaser = dynamic(() => import("@/components/AuditTeaser"), { ssr: true });
const TestimonialsCarousel = dynamic(() => import("@/components/TestimonialsCarousel"), { ssr: true });
const GrowthCalculator = dynamic(() => import("@/components/GrowthCalculator"), { ssr: true });
const PartnershipForm = dynamic(() => import("@/components/PartnershipForm"), { ssr: true });
const RateCardSection = dynamic(() => import("@/components/RateCardSection"), { ssr: true });

export const revalidate = 3600; // Revalidate page hourly (ISR)

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';
  const ogImageUrl = `${siteUrl}/api/og?title=${encodeURIComponent("Muhammad Khoiruzzadittaqwa")}&subtitle=${encodeURIComponent("Full-Stack Growth Architect & B2B Hub")}&type=home`;
  
  return {
    title: "Muhammad Khoiruzzadittaqwa | Full-Stack Growth Architect & B2B Hub",
    description: "Zadit adalah Full-Stack Growth Architect. Kami menyediakan layanan Audit SEO, Direktori B2B, Sovereign Data Telemetry, dan pengembangan sistem web modern.",
    alternates: {
      canonical: '/'
    },
    openGraph: {
      title: "Zadit Growth Engine | Full-Stack Architect",
      description: "Platform intelijen bisnis dan pertumbuhan digital B2B. Akses direktori terverifikasi, audit web, dan data makroekonomi secara real-time.",
      url: siteUrl,
      type: "website",
      siteName: "Zadit Profile",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Muhammad Khoiruzzadittaqwa - Full-Stack Growth Architect"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: "Muhammad Khoiruzzadittaqwa | Full-Stack Growth Architect & B2B Hub",
      description: "Platform intelijen bisnis dan pertumbuhan digital B2B.",
      images: [ogImageUrl]
    }
  };
}

export default async function Home() {
  const [content, services, caseStudies, config, latestArticles, liveStats] = await Promise.all([
    getSiteContent(),
    getServices(),
    getCaseStudies(),
    getSystemConfig(),
    getLatestArticles(3),
    getLiveStats()
  ]);

  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection 
          headline={content.hero_headline}
          subheading={content.hero_subheading}
          whatsappNumber={config.whatsapp_number as string}
          availabilityStatus={config.available_status as string}
          liveStats={liveStats}
        />
        
        <ProcessSection />
        
        <AuditTeaser />

        <IntegratedServicesHub services={services} />

        <CaseStudiesSection caseStudies={caseStudies} />
        <TestimonialsCarousel caseStudies={caseStudies} />
        
        <RateCardSection 
          packagesJson={config.pricing_packages as string} 
          whatsappNumber={config.whatsapp_number as string} 
        />

        <LatestInsights articles={latestArticles} />
        <GrowthCalculator />
        <PartnershipForm />
      </main>
      <SidebarNav />
      <Footer />
    </>
  );
}
