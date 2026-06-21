import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SidebarNav from "@/components/SidebarNav";
import HomeClientContainer from "@/components/HomeClientContainer";
import { getSiteContent, getSystemConfig, getLatestArticles, getLiveStats } from "@/lib/data-server";

export const revalidate = 3600; // Revalidate page hourly (ISR)

export default async function Home() {
  const [content, config, latestArticles, liveStats] = await Promise.all([
    getSiteContent(),
    getSystemConfig(),
    getLatestArticles(6),
    getLiveStats()
  ]);

  return (
    <>
      <Header />
      <main className="flex-1 bg-alabaster pt-28 pb-20 px-6 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <HomeClientContainer 
            latestArticles={latestArticles}
            liveStats={liveStats}
            whatsappNumber={config.whatsapp_number as string}
            availabilityStatus={config.available_status as string}
            headline={content.hero_headline}
            subheading={content.hero_subheading}
          />
        </div>
      </main>
      <SidebarNav />
      <Footer />
    </>
  );
}
