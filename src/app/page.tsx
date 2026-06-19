import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import ServicesGrid from "@/components/ServicesGrid";
import LatestInsights from "@/components/LatestInsights";
import PartnershipForm from "@/components/PartnershipForm";
import SidebarNav from "@/components/SidebarNav";
import Footer from "@/components/Footer";
import GrowthCalculator from "@/components/GrowthCalculator";

import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { getSiteContent, getServices, getCaseStudies, getSystemConfig, getLatestArticles, getLiveStats } from "@/lib/data-server";

import B2BGrowthHubSection from "@/components/B2BGrowthHubSection";

export const revalidate = 3600; // Revalidate page hourly (ISR)

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
        <B2BGrowthHubSection />

        <ProcessSection />
        <CaseStudiesSection caseStudies={caseStudies} />
        <TestimonialsCarousel caseStudies={caseStudies} />
        <ServicesGrid services={services} />
        <LatestInsights articles={latestArticles} />
        <GrowthCalculator />
        <PartnershipForm />
      </main>
      <SidebarNav />
      <Footer />
    </>
  );
}
