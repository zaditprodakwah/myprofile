import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import ServicesGrid from "@/components/ServicesGrid";
import LatestInsights from "@/components/LatestInsights";
import PartnershipForm from "@/components/PartnershipForm";
import SidebarNav from "@/components/SidebarNav";
import Footer from "@/components/Footer";
import { getSiteContent, getServices, getCaseStudies, getSystemConfig, getLatestArticles, getLiveStats } from "@/lib/data-server";

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
        <ProcessSection />
        <CaseStudiesSection caseStudies={caseStudies} />
        <ServicesGrid services={services} />
        <LatestInsights articles={latestArticles} />
        <PartnershipForm />
      </main>
      <SidebarNav />
      <Footer />
    </>
  );
}
