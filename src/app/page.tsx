import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import LatestInsights from "@/components/LatestInsights";
import PartnershipForm from "@/components/PartnershipForm";
import SidebarNav from "@/components/SidebarNav";
import Footer from "@/components/Footer";
import GrowthCalculator from "@/components/GrowthCalculator";
import RateCardSection from "@/components/RateCardSection";

import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { getSiteContent, getServices, getCaseStudies, getSystemConfig, getLatestArticles, getLiveStats, getFeaturedEntities } from "@/lib/data-server";

import IntegratedServicesHub from "@/components/IntegratedServicesHub";
import dynamic from "next/dynamic";
import { Metadata } from "next";

// Dynamic Imports with Skeleton Loaders for Heavy/Interactive Components to optimize LCP & TBT
const MarketTelemetryBlock = dynamic(() => import("@/components/MarketTelemetryBlock"), {
  loading: () => (
    <div className="w-full my-12 bg-brand-slate rounded-3xl p-6 md:p-10 border border-brand-mid h-[600px] animate-pulse flex items-center justify-center">
      <span className="text-white/50 font-mono text-sm">Menginisiasi Telemetri Sistem...</span>
    </div>
  )
});

const AuditTeaser = dynamic(() => import("@/components/AuditTeaser"), {
  ssr: true
});

const FeaturedDirectory = dynamic(() => import("@/components/FeaturedDirectory"), {
  ssr: true
});

export const revalidate = 3600; // Revalidate page hourly (ISR)

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://muhzadit.vercel.app';
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
      siteName: "Zadit Profile"
    }
  };
}

export default async function Home() {
  const [content, services, caseStudies, config, latestArticles, liveStats, featuredEntities] = await Promise.all([
    getSiteContent(),
    getServices(),
    getCaseStudies(),
    getSystemConfig(),
    getLatestArticles(3),
    getLiveStats(),
    getFeaturedEntities(4)
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
        
        <div className="max-w-6xl mx-auto px-6 py-12">
          <MarketTelemetryBlock />
        </div>

        <AuditTeaser />

        <FeaturedDirectory entities={featuredEntities} />

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
