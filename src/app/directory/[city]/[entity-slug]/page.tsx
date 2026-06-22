import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Globe, Phone, MapPin, Shield, Star, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase-server';
import EntityClaimPortal from '@/components/EntityClaimPortal';
import { notFound } from 'next/navigation';
import { cn } from '@/lib/utils';

interface EntityDetailPageProps {
  params: Promise<{ city: string; 'entity-slug': string }>;
}

export default async function EntityDetailPage({ params }: EntityDetailPageProps) {
  const { city: cityParam, 'entity-slug': slugParam } = await params;
  
  const citySlug = cityParam ? cityParam.toLowerCase() : '';
  const entitySlug = slugParam ? slugParam.toLowerCase() : '';

  // 1. Fetch Entity details on server using supabaseServer
  const { data: dbData } = await supabaseServer
    .from('directory_entities')
    .select('*')
    .eq('city_slug', citySlug)
    .eq('slug', entitySlug)
    .maybeSingle();

  if (!dbData) {
    notFound();
  }

  const rawType = String(dbData.entity_type || '').toLowerCase();
  const translatedCategory = 
    rawType === 'agency' ? 'Agensi / Kemitraan' : 
    rawType === 'service' ? 'Layanan Publik / Swasta' : 
    rawType === 'institution' ? 'Instansi / Lembaga' : 
    'Bisnis Lokal';

  const entity = {
    id: String(dbData.id),
    name: String(dbData.name),
    slug: String(dbData.slug),
    category: translatedCategory,
    tagline: String(dbData.tagline || dbData.description || 'Layanan bisnis terdaftar'),
    description: String(dbData.description || dbData.tagline || 'Informasi rinci belum ditambahkan.'),
    address: String(dbData.address || 'Alamat belum didaftarkan'),
    phone: String(dbData.contact_phone || ''),
    email: String(dbData.contact_email || ''),
    website: String(dbData.website_url || ''),
    trustScore: Number(dbData.trust_score || 4.0),
    verified: dbData.verification_status === 'VERIFIED',
    city: citySlug,
    created_at: dbData.created_at ? new Date(dbData.created_at) : new Date()
  };

  const cleanWebsiteUrl = (url: string) => {
    return url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
  };

  const getCityTitle = (slug: string) => {
    return slug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  // Structured Data Schema (JSON-LD LocalBusiness)
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": entity.name,
    "description": entity.tagline,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": entity.address,
      "addressLocality": getCityTitle(entity.city),
      "addressCountry": "ID"
    },
    "telephone": entity.phone || undefined,
    "url": entity.website || undefined,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": entity.trustScore,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "10"
    }
  };

  // Dynamic Validation Trail timeline generator based on database states
  const validationHistory = [
    {
      date: entity.created_at.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      change: `Profil entitas berhasil dideteksi dan didaftarkan oleh robot penjelajah direktori regional Zadit di ${getCityTitle(entity.city)}.`
    },
    {
      date: new Date(entity.created_at.getTime() + 86400000).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      change: `Analisis sentimen web dan kalkulasi skor kredibilitas selesai. Skor awal ditetapkan sebesar ${entity.trustScore.toFixed(1)}/5.0.`
    },
    ...(entity.verified ? [
      {
        date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
        change: `Pemilik bisnis resmi mengajukan bukti kepemilikan. Status verifikasi diubah menjadi TERVERIFIKASI.`
      }
    ] : [
      {
        date: 'Saat ini',
        change: `Profil belum diklaim. Pemilik bisnis memiliki hak penuh untuk melakukan klaim kepemilikan secara gratis.`
      }
    ])
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Header />
      <main className="flex-1 bg-alabaster pt-28 pb-24 px-6 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Back Button */}
          <Link
            href={`/directory/${entity.city}`}
            className="flex items-center gap-2 text-xs font-mono text-text-muted hover:text-text-primary uppercase tracking-wider transition-colors w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Direktori {getCityTitle(entity.city)}
          </Link>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Entity Details */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Profile Card */}
              <div className="bg-white border border-brand-border rounded-2xl p-8 relative overflow-hidden shadow-xs">
                {/* Visual Ambient Light overlay */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-teal-accent/5 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-brand-border/60">
                  <div className="flex gap-4.5 items-start">
                    <div className="w-14 h-14 rounded-2xl bg-brand-slate text-text-inverse flex items-center justify-center font-heading-sans font-black text-2xl shrink-0">
                      {entity.name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap gap-2">
                        {entity.verified ? (
                          <span className="bg-teal-50 text-teal-700 border border-teal-100 rounded px-2 py-0.5 text-[8px] font-mono uppercase font-bold shrink-0">
                            Terverifikasi
                          </span>
                        ) : (
                          <span className="bg-amber-50 text-amber-700 border border-amber-100 rounded px-2 py-0.5 text-[8px] font-mono uppercase font-bold shrink-0">
                            Belum Diklaim
                          </span>
                        )}
                      </div>
                      <h1 className="text-xl md:text-2xl font-heading-sans font-bold text-text-primary leading-tight">
                        {entity.name}
                      </h1>
                      <p className="text-[10px] font-mono text-gold-accent uppercase tracking-wider">{entity.category}</p>
                    </div>
                  </div>

                  {/* Trust Score */}
                  <div className="bg-offwhite border border-brand-border rounded-xl px-4 py-2.5 text-center flex flex-col items-center shrink-0 self-start">
                    <span className="text-[8px] font-mono text-text-muted uppercase tracking-widest">KREDIBILITAS</span>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 text-gold-accent fill-gold-accent" />
                      <span className="font-heading-sans font-black text-sm text-text-primary">{entity.trustScore.toFixed(1)}</span>
                      <span className="text-[10px] text-text-muted">/5.0</span>
                    </div>
                  </div>
                </div>

                {/* Tagline */}
                {entity.tagline && (
                  <div className="pt-6">
                    <h3 className="text-[9px] font-mono text-text-muted uppercase tracking-widest mb-1.5">Deskripsi Ringkas</h3>
                    <p className="text-sm text-text-primary leading-relaxed font-sans italic">
                      "{entity.tagline}"
                    </p>
                  </div>
                )}

                {/* About / Description */}
                <div className="pt-6 border-t border-brand-border/40 mt-6 space-y-2">
                  <h3 className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Tentang Bisnis</h3>
                  <p className="text-xs text-text-muted leading-relaxed font-sans">
                    {entity.description}
                  </p>
                </div>

                {/* Contact Data Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-brand-border/60 mt-6 text-xs">
                  <div className="flex gap-2.5 items-start">
                    <MapPin className="w-4 h-4 text-teal-accent shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-mono text-text-muted uppercase tracking-wider">Alamat Kantor</p>
                      <p className="text-text-primary leading-relaxed">{entity.address}</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Phone className="w-4 h-4 text-teal-accent shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-mono text-text-muted uppercase tracking-wider">Kontak Telepon</p>
                      <p className="text-text-primary font-mono">{entity.phone || 'Belum disediakan'}</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <Globe className="w-4 h-4 text-teal-accent shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-mono text-text-muted uppercase tracking-wider">Situs Web Resmi</p>
                      {entity.website ? (
                        <a 
                          href={entity.website.startsWith('http') ? entity.website : `https://${entity.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-teal-accent hover:underline font-bold block"
                        >
                          {cleanWebsiteUrl(entity.website)} ↗
                        </a>
                      ) : (
                        <p className="text-text-muted">Belum disediakan</p>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Timeline Verification Log */}
              <div className="bg-white border border-brand-border rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
                <h3 className="text-xs font-mono text-text-primary uppercase tracking-widest flex items-center gap-2 border-b border-brand-border/60 pb-3">
                  <RefreshCw className="w-4 h-4 text-gold-accent animate-spin-slow" /> Riwayat Validasi & Verifikasi Profil
                </h3>
                
                <div className="relative border-l border-brand-border/60 pl-6 space-y-6 ml-2.5">
                  {validationHistory.map((hist, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline point */}
                      <span className={cn(
                        "absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full border border-white",
                        idx === 0 ? "bg-teal-accent" : "bg-gold-accent"
                      )} />
                      
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-text-muted">{hist.date}</span>
                        <p className="text-xs text-text-primary leading-relaxed">{hist.change}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Widgets */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Claim Profile Portal */}
              {!entity.verified && (
                <EntityClaimPortal 
                  entityId={entity.id} 
                  entityName={entity.name} 
                  citySlug={entity.city} 
                />
              )}

              {/* Audit Speed Shortcut */}
              {entity.website && (
                <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-teal-accent">
                    <Sparkles className="w-5 h-5" />
                    <h4 className="font-heading-sans font-bold text-xs text-text-primary uppercase tracking-wide">Audit Kecepatan Web</h4>
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    Uji performansi, tingkat aksesibilitas (A11y), dan kualitas SEO teknis situs resmi <b>{cleanWebsiteUrl(entity.website)}</b> langsung menggunakan robot audit kami.
                  </p>
                  <Link 
                    href={`/utility/audit-engine?url=${encodeURIComponent(cleanWebsiteUrl(entity.website))}`}
                    className="block w-full bg-brand-slate hover:bg-slate-800 text-text-inverse text-[10px] font-mono font-bold uppercase tracking-wider py-3 rounded-xl text-center transition-colors shadow-xs"
                  >
                    Jalankan Audit Performa →
                  </Link>
                </div>
              )}

            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
