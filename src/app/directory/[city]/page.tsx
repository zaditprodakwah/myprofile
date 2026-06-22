import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabaseServer } from '@/lib/supabase-server';
import Link from 'next/link';
import CityDirectoryClientContainer from '@/components/CityDirectoryClientContainer';

interface CityDirectoryPageProps {
  params: Promise<{ city: string }>;
}

export default async function CityDirectoryPage({ params }: CityDirectoryPageProps) {
  const { city: rawCity } = await params;
  const citySlug = rawCity ? rawCity.toLowerCase() : '';

  // 1. Fetch City details on server
  const { data: cityData } = await supabaseServer
    .from('cities')
    .select('*')
    .eq('slug', citySlug)
    .maybeSingle();

  const cityName = cityData?.name || citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // 2. Fetch Directory Entities in this city on server
  const { data: dbData } = await supabaseServer
    .from('directory_entities')
    .select('*')
    .eq('city_slug', citySlug)
    .order('verification_status', { ascending: false })
    .order('trust_score', { ascending: false });

  const entities = (dbData || []).map((item: any) => {
    const rawType = String(item.entity_type || '').toLowerCase();
    const translatedCategory = 
      rawType === 'agency' ? 'Agensi / Kemitraan' : 
      rawType === 'service' ? 'Layanan Publik / Swasta' : 
      rawType === 'institution' ? 'Instansi / Lembaga' : 
      'Bisnis Lokal';
      
    return {
      id: String(item.id || ''),
      name: String(item.name || ''),
      slug: String(item.slug || ''),
      category: translatedCategory,
      tagline: String(item.tagline || item.description || ''),
      address: String(item.address || 'Alamat terdaftar'),
      phone: String(item.contact_phone || ''),
      email: String(item.contact_email || ''),
      website: String(item.website_url || ''),
      trustScore: Number(item.trust_score || 4.0),
      verified: item.verification_status === 'VERIFIED',
      city: citySlug,
      google_maps_url: item.google_maps_url ? String(item.google_maps_url) : undefined
    };
  });

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Direktori Bisnis ${cityName}`,
    "description": `Daftar bisnis lokal dan agensi terverifikasi di ${cityName}`,
    "itemListElement": entities.map((ent, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "LocalBusiness",
        "name": ent.name,
        "url": `https://presenceos.zadit.id/directory/${citySlug}/${ent.slug}`
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Header />
      <main className="flex-1 bg-alabaster pt-28 pb-24 px-6 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Breadcrumb */}
          <nav className="text-[10px] font-mono text-text-muted flex gap-2 items-center uppercase tracking-wider">
            <Link href="/" className="hover:text-teal-accent">Home</Link>
            <span>/</span>
            <Link href="/directory" className="hover:text-teal-accent">Direktori</Link>
            <span>/</span>
            <span className="text-text-primary font-bold">{cityName}</span>
          </nav>

          {/* Heading */}
          <div className="space-y-3.5">
            <span className="text-xs font-mono tracking-widest text-gold-accent uppercase block">
              {'// Kredibilitas Publik Regional'}
            </span>
            <h1 className="text-3xl md:text-5xl font-heading-serif font-bold text-text-primary leading-tight">
              Mitra Digital & Bisnis Lokal Terverifikasi di {cityName}
            </h1>
            <p className="text-xs md:text-sm text-text-muted max-w-2xl leading-relaxed">
              Membantu UMKM, agensi kreator, dan penyedia jasa teknologi di {cityName} meningkatkan reputasi digital melalui sertifikasi skor kredibilitas terpadu.
            </p>
          </div>

          {/* Client filterable list container */}
          <CityDirectoryClientContainer 
            initialEntities={entities} 
            citySlug={citySlug} 
            cityName={cityName} 
          />

        </div>
      </main>
      <Footer />
    </>
  );
}
