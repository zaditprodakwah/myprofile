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
import { getSiteContent, getServices, getCaseStudies, getSystemConfig, getLatestArticles, getLiveStats } from "@/lib/data-server";

import IntegratedServicesHub from "@/components/IntegratedServicesHub";
import dynamic from "next/dynamic";
import { Metadata } from "next";

// Dynamic Imports with Skeleton Loaders for Heavy/Interactive Components to optimize LCP & TBT
const AuditTeaser = dynamic(() => import("@/components/AuditTeaser"), {
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
