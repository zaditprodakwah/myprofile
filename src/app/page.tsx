import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProcessSection from "@/components/ProcessSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import ServicesGrid from "@/components/ServicesGrid";
import PartnershipForm from "@/components/PartnershipForm";
import SidebarNav from "@/components/SidebarNav";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ProcessSection />
        <CaseStudiesSection />
        <ServicesGrid />
        <PartnershipForm />
      </main>
      <SidebarNav />
      <Footer />
    </>
  );
}
