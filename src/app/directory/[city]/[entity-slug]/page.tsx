'use client';

import { useParams, useRouter } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Globe, Phone, MapPin, Shield, Star, RefreshCw } from 'lucide-react';

interface Entity {
  id: string;
  name: string;
  slug: string;
  category: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  trustScore: number;
  verified: boolean;
  city: string;
  history: { date: string; change: string }[];
}

const mockEntities: Entity[] = [
  {
    id: '1',
    name: 'Agensi Logistik Sejahtera',
    slug: 'agensi-logistik-sejahtera',
    category: 'Logistik',
    tagline: 'Solusi pengiriman kargo dan pergudangan regional cepat.',
    description: 'Agensi Logistik Sejahtera adalah penyedia layanan pengiriman barang domestik terkemuka yang melayani wilayah metropolitan Jakarta Selatan. Berfokus pada keandalan sistem pengiriman dan pergudangan, kami mengoptimalkan rantai pasok bisnis Anda dari hulu ke hilir.',
    address: 'Jl. Gatot Subroto No. 45, Jakarta Selatan',
    phone: '0812-3456-7890',
    email: 'info@logistiksejahtera.com',
    website: 'https://logistiksejahtera.com',
    trustScore: 4.8,
    verified: true,
    city: 'jakarta-selatan',
    history: [
      { date: '12 Juni 2026', change: 'Verifikasi profil berhasil diperbarui.' },
      { date: '10 Mei 2026', change: 'Sinkronisasi koordinat Google Maps teraktifkan.' },
      { date: '21 April 2026', change: 'Pembaruan data kontak telepon dan email resmi.' }
    ]
  },
  {
    id: '4',
    name: 'Cirebon Agritech Hub',
    slug: 'cirebon-agritech-hub',
    category: 'Teknologi',
    tagline: 'Inkubator inovasi pertanian modern Jawa Barat.',
    description: 'Cirebon Agritech Hub merupakan pusat inovasi teknologi pertanian di wilayah Cirebon dan sekitarnya. Kami memfasilitasi riset agritech, pendampingan petani lokal, serta penyediaan teknologi presisi untuk mendukung ketahanan pangan di Jawa Barat.',
    address: 'Jl. Tuparev No. 88, Cirebon',
    phone: '0877-6543-2109',
    email: 'contact@cirebonagritech.org',
    website: 'https://cirebonagritech.org',
    trustScore: 4.9,
    verified: true,
    city: 'cirebon',
    history: [
      { date: '15 Juni 2026', change: 'Pembaruan halaman profil verified diaktifkan.' },
      { date: '01 Juni 2026', change: 'Integrasi sistem analitik data agritech.' }
    ]
  }
];

export default function EntityDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const city = params.city as string;
  const slug = params.entity_slug as string;

  const entity = mockEntities.find(
    (e) => e.city === city.toLowerCase() && e.slug === slug.toLowerCase()
  );

  if (!entity) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-alabaster pt-32 pb-24 px-6 flex flex-col items-center justify-center text-center">
          <Shield className="w-12 h-12 text-gold-accent mb-4" />
          <h1 className="text-2xl font-heading-serif font-bold text-text-primary">Profil Tidak Tersedia</h1>
          <p className="text-text-muted mt-2 max-w-sm">
            Profil entitas ini tidak ditemukan atau belum terverifikasi untuk tayang publik.
          </p>
          <button 
            onClick={() => router.back()}
            className="mt-6 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-teal-accent hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali Ke Direktori
          </button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-alabaster pt-28 pb-24 px-6 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Back Button */}
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-mono text-text-muted hover:text-text-primary uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Direktori
          </button>

          {/* Main Info Box */}
          <div className="bg-white border border-brand-border rounded-2xl p-8 lg:p-12 space-y-8 relative overflow-hidden shadow-sm">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-brand-border">
              
              <div className="flex gap-4 items-start">
                <div className="w-16 h-16 rounded-2xl bg-brand-slate text-text-inverse flex items-center justify-center font-heading-sans font-extrabold text-3xl flex-shrink-0">
                  {entity.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <span className="inline-block bg-teal-accent/10 border border-teal-accent/25 text-teal-accent font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 rounded">
                    Profil Terverifikasi
                  </span>
                  <h1 className="text-2xl md:text-3xl font-heading-sans font-bold text-text-primary">{entity.name}</h1>
                  <p className="text-xs font-mono text-gold-accent uppercase">{entity.category}</p>
                </div>
              </div>

              {/* Trust Score badge */}
              <div className="bg-offwhite border border-brand-border rounded-xl px-4 py-3 text-center md:self-start flex flex-col items-center">
                <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider">SKOR KREDIBILITAS</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star className="w-4 h-4 text-gold-accent fill-gold-accent" />
                  <span className="font-heading-sans font-extrabold text-text-primary">{entity.trustScore}</span>
                  <span className="text-xs text-text-muted">/ 5.0</span>
                </div>
              </div>

            </div>

            {/* Description & About */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider">Tentang Entitas</h3>
              <p className="text-sm md:text-base text-text-primary leading-relaxed font-sans">
                {entity.description}
              </p>
            </div>

            {/* Contact & Location details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-brand-border text-sm">
              <div className="flex gap-3 items-start">
                <MapPin className="w-4 h-4 text-teal-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-mono text-text-muted uppercase tracking-wider">Alamat Terdaftar</p>
                  <p className="text-text-primary mt-1 leading-relaxed">{entity.address}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Phone className="w-4 h-4 text-teal-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-mono text-text-muted uppercase tracking-wider">Kontak Resmi</p>
                  <p className="text-text-primary mt-1">{entity.phone || 'Tidak tersedia'}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Globe className="w-4 h-4 text-teal-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-mono text-text-muted uppercase tracking-wider">Situs Web Resmi</p>
                  {entity.website ? (
                    <a 
                      href={entity.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-teal-accent hover:underline mt-1 block font-medium"
                    >
                      {entity.website.replace('https://', '')}
                    </a>
                  ) : (
                    <p className="text-text-muted mt-1">Tidak tersedia</p>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Audit Logs & Change History */}
          <div className="bg-white border border-brand-border rounded-2xl p-8 space-y-6 shadow-sm">
            <h3 className="text-xs font-mono text-text-primary uppercase tracking-widest flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-gold-accent" /> Riwayat Verifikasi & Perubahan Profil
            </h3>
            
            <div className="relative border-l border-brand-border pl-6 space-y-6 ml-2.5">
              {entity.history.map((hist, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline point */}
                  <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-teal-accent border border-white" />
                  
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-text-muted">{hist.date}</span>
                    <p className="text-sm text-text-primary">{hist.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
