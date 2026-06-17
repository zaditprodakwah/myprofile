import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCities } from "@/lib/data-server";
import { MapPin, Navigation, ArrowRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 3600;

export default async function DirectoryIndexPage() {
  const cities = await getCities();

  const directorySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Direktori Bisnis & Layanan Lokal | Zadit Growth Engine",
    "description": "Indeks kredibilitas publik regional dan bank data referensi entitas bisnis lokal terverifikasi di Indonesia.",
    "publisher": {
      "@type": "Person",
      "name": "Muhammad Khoiruzzadittaqwa",
      "jobTitle": "Full-Stack Growth Architect"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(directorySchema) }}
      />
      <Header />
      <main className="flex-1 bg-alabaster pt-28 pb-24 px-6 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Breadcrumb */}
          <nav className="text-xs font-mono text-text-muted flex gap-2 items-center">
            <Link href="/" className="hover:text-teal-accent">Home</Link>
            <span>/</span>
            <span className="text-text-primary font-medium">Direktori Wilayah</span>
          </nav>

          {/* Heading */}
          <div className="space-y-4">
            <span className="text-xs font-mono tracking-widest text-gold-accent uppercase">Direktori Bisnis & Layanan</span>
            <h1 className="text-3xl md:text-5xl font-heading-serif font-bold text-text-primary leading-tight">
              Indeks Direktori Kredibilitas Publik
            </h1>
            <p className="text-sm md:text-base text-text-muted max-w-xl leading-relaxed">
              Pilih wilayah target Anda untuk memantau data entitas terverifikasi, memetakan potensi kemitraan strategis, dan mengakses audit optimasi ekosistem digital.
            </p>
          </div>

          {/* Cities List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/directory/${city.slug}`}
                className="bg-white border border-brand-border rounded-2xl p-6 hover:border-teal-accent transition-all duration-300 hover:shadow-md group flex flex-col justify-between h-52 shadow-xs"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-accent/10 border border-teal-accent/20 flex items-center justify-center text-teal-accent group-hover:border-teal-accent transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading-sans font-bold text-text-primary group-hover:text-teal-accent transition-colors">
                      {city.name}
                    </h2>
                    {city.target_niche && (
                      <p className="text-xs font-mono text-gold-accent mt-0.5">{city.target_niche}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-brand-border mt-4">
                  <span className="text-[10px] font-mono text-text-muted tracking-wider uppercase flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-teal-accent" /> Koordinat: {city.latitude}, {city.longitude}
                  </span>
                  <span className="text-xs font-semibold text-teal-accent group-hover:underline flex items-center gap-1.5">
                    Eksplorasi Wilayah <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
