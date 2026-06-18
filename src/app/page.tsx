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
import ActivityFeed from "@/components/ActivityFeed";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { getSiteContent, getServices, getCaseStudies, getSystemConfig, getLatestArticles, getLiveStats } from "@/lib/data-server";

import SovereignTrustBentoBlock from "@/components/sovereign/SovereignTrustBentoBlock";

export const revalidate = 3600; // Revalidate page hourly (ISR)

export default async function Home() {
  const content = await getSiteContent();
  const services = await getServices();
  const caseStudies = await getCaseStudies();
  const config = await getSystemConfig();
  const latestArticles = await getLatestArticles(3);
  const liveStats = await getLiveStats();

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
        <section className="bg-white border-b border-brand-border/40 py-12">
          <div className="max-w-6xl mx-auto px-6">
            <SovereignTrustBentoBlock />
          </div>
        </section>
        <section className="bg-offwhite border-b border-brand-border/40 py-12">
          <div className="max-w-4xl mx-auto px-6">
            <ActivityFeed />
          </div>
        </section>
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
