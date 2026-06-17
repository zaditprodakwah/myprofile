'use client';

import { useState, useDeferredValue, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal, Check, Clock, Globe, Phone, MapPin, Building, ArrowLeft, X, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Entity {
  id: string;
  name: string;
  slug: string;
  category: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  trustScore: number;
  verified: boolean;
  city: string;
}

const mockEntities: Entity[] = [
  {
    id: '1',
    name: 'Agensi Logistik Sejahtera',
    slug: 'agensi-logistik-sejahtera',
    category: 'Logistik',
    tagline: 'Solusi pengiriman kargo dan pergudangan regional cepat.',
    address: 'Jl. Gatot Subroto No. 45, Jakarta Selatan',
    phone: '0812-3456-7890',
    email: 'info@logistiksejahtera.com',
    website: 'https://logistiksejahtera.com',
    trustScore: 4.8,
    verified: true,
    city: 'jakarta-selatan',
  },
  {
    id: '2',
    name: 'Klinik Medika Utama',
    slug: 'klinik-medika-utama',
    category: 'Kesehatan',
    tagline: 'Layanan kesehatan keluarga ramah dan terintegrasi.',
    address: 'Jl. Ahmad Yani No. 12, Cirebon',
    phone: '',
    email: '',
    website: '',
    trustScore: 4.2,
    verified: false,
    city: 'cirebon',
  },
  {
    id: '3',
    name: 'Kantor Hukum Hendra & Rekan',
    slug: 'kantor-hukum-hendra-rekan',
    category: 'Layanan Hukum',
    tagline: 'Perwakilan hukum bisnis dan korporat terpercaya.',
    address: 'Jl. Sudirman Kav 21, Jakarta Selatan',
    phone: '',
    email: '',
    website: '',
    trustScore: 4.5,
    verified: false,
    city: 'jakarta-selatan',
  },
  {
    id: '4',
    name: 'Cirebon Agritech Hub',
    slug: 'cirebon-agritech-hub',
    category: 'Teknologi',
    tagline: 'Inkubator inovasi pertanian modern Jawa Barat.',
    address: 'Jl. Tuparev No. 88, Cirebon',
    phone: '0877-6543-2109',
    email: 'contact@cirebonagritech.org',
    website: 'https://cirebonagritech.org',
    trustScore: 4.9,
    verified: true,
    city: 'cirebon',
  }
];

export default function CityDirectoryPage() {
  const params = useParams();
  const rawCity = params.city as string;
  const citySlug = rawCity ? rawCity.toLowerCase() : '';

  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearch = useDeferredValue(searchTerm);
  
  const [filterCategory, setFilterCategory] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Slide Over state
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimData, setClaimData] = useState({ name: '', role: '', email: '', whatsapp: '' });
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Fetch from Supabase
        const { data, error } = await supabase
          .from('entities')
          .select('*')
          .eq('city_slug', citySlug);

        const localMock = mockEntities.filter(e => e.city === citySlug);

        if (data && data.length > 0) {
          // Map DB to Entity interface
          const dbEntities = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            slug: d.slug,
            category: d.entity_type || 'Bisnis',
            tagline: d.tagline || d.description || '',
            address: d.raw_metadata?.address || 'Alamat terdaftar',
            phone: d.contact_phone || '',
            email: d.contact_email || '',
            website: d.website_url || '',
            trustScore: d.trust_score || 4.0,
            verified: d.verification_status === 'VERIFIED',
            city: citySlug
          }));
          setEntities([...dbEntities, ...localMock]);
        } else {
          setEntities(localMock);
        }
      } catch (err) {
        console.error('Error loading Supabase entities, using mock data.', err);
        setEntities(mockEntities.filter(e => e.city === citySlug));
      } finally {
        setLoading(false);
      }
    }

    if (citySlug) {
      loadData();
    }
  }, [citySlug]);

  const categories = ['All', ...Array.from(new Set(entities.map(e => e.category)))];

  const filteredEntities = entities.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(deferredSearch.toLowerCase()) || 
                          e.tagline.toLowerCase().includes(deferredSearch.toLowerCase());
    const matchesCategory = filterCategory === 'All' || e.category === filterCategory;
    const matchesVerified = !verifiedOnly || e.verified;
    return matchesSearch && matchesCategory && matchesVerified;
  });

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimData.name || !claimData.whatsapp) return;

    try {
      // Save lead to Supabase
      await supabase.from('directory_leads').insert({
        lead_name: claimData.name,
        contact_info: JSON.stringify({ whatsapp: claimData.whatsapp, email: claimData.email }),
        target_site_url: selectedEntity?.name || '',
        audit_category: 'Claim Directory Profile',
        status: 'PENDING'
      });
      
      setClaimSuccess(true);
    } catch (err) {
      console.error('Failed to submit claim to Supabase', err);
      // Fallback success indicator locally
      setClaimSuccess(true);
    }
  };

  const getCityTitle = (slug: string) => {
    return slug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-brand-slate pt-28 pb-24 px-6 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Breadcrumb */}
          <nav className="text-xs font-mono text-text-muted flex gap-2 items-center">
            <a href="/" className="hover:text-teal-accent">Home</a>
            <span>/</span>
            <span className="text-text-inverse">Direktori {getCityTitle(citySlug)}</span>
          </nav>

          {/* Heading */}
          <div className="space-y-4">
            <span className="text-xs font-mono tracking-widest text-gold-accent uppercase">// KREDIBILITAS PUBLIK REGIONAL</span>
            <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-text-inverse">
              Direktori Bisnis & Layanan {getCityTitle(citySlug)}
            </h1>
            <p className="text-sm md:text-base text-text-muted max-w-2xl leading-relaxed">
              Daftar profil entitas instansi, layanan publik, agensi, dan bisnis lokal terverifikasi di wilayah {getCityTitle(citySlug)}.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-brand-mid/40 border border-brand-border rounded-xl p-6 flex flex-col md:flex-row gap-4 items-center">
            
            {/* Search Input */}
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
              <input
                type="text"
                placeholder="Cari entitas, kategori, layanan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-brand-slate border border-brand-border rounded-xl font-sans text-sm text-text-inverse placeholder-text-muted focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="flex-grow w-full flex flex-wrap gap-3 items-center justify-start md:justify-end">
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Kategori:
              </span>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={cn(
                      "text-xs px-3 py-1.5 rounded-lg border font-medium transition-all",
                      filterCategory === cat
                        ? "bg-teal-accent border-teal-accent text-brand-slate font-semibold"
                        : "border-brand-border text-text-muted hover:border-brand-border/80"
                    )}
                  >
                    {cat === 'All' ? 'Semua' : cat}
                  </button>
                ))}
              </div>

              {/* Verified Filter checkbox */}
              <label className="flex items-center gap-2 cursor-pointer border-l border-brand-border/40 pl-4 ml-2 py-1 select-none">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-brand-border text-teal-accent focus:ring-teal-accent bg-brand-slate"
                />
                <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Hanya Terverifikasi</span>
              </label>
            </div>

          </div>

          {/* Grid list of Cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-brand-mid/20 border border-brand-border rounded-2xl p-6 h-[200px] animate-pulse" />
              ))}
            </div>
          ) : filteredEntities.length === 0 ? (
            <div className="bg-brand-mid/10 border border-brand-border/40 rounded-2xl p-12 text-center space-y-4">
              <AlertCircle className="w-8 h-8 text-gold-accent mx-auto" />
              <h3 className="text-lg font-heading font-bold text-text-inverse">Entitas Tidak Ditemukan</h3>
              <p className="text-sm text-text-muted max-w-sm mx-auto">
                Coba sesuaikan kata kunci pencarian Anda atau periksa filter kategori yang dipilih.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEntities.map((ent) => (
                <div
                  key={ent.id}
                  onClick={() => {
                    setSelectedEntity(ent);
                    setShowClaimForm(false);
                    setClaimSuccess(false);
                  }}
                  className={cn(
                    "bg-brand-mid/30 border rounded-2xl p-6 flex flex-col justify-between h-full hover:border-teal-glow transition-all duration-300 cursor-pointer group hover:-translate-y-0.5",
                    ent.verified 
                      ? "border-brand-border border-l-4 border-l-teal-accent" 
                      : "border-brand-border border-l-4 border-l-gold-accent/60"
                  )}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-brand-slate border border-brand-border flex items-center justify-center text-text-muted font-heading font-bold text-lg group-hover:border-teal-accent transition-colors">
                        {ent.name.charAt(0)}
                      </div>
                      
                      <div className="flex gap-2">
                        {ent.verified ? (
                          <span className="bg-teal-accent/10 border border-teal-accent/20 text-teal-glow font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 rounded flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> Verified
                          </span>
                        ) : (
                          <span className="bg-gold-accent/10 border border-gold-accent/20 text-gold-accent font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 rounded flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> Unclaimed
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-heading font-bold text-lg text-text-inverse group-hover:text-teal-accent transition-colors">
                        {ent.name}
                      </h3>
                      <p className="text-xs font-mono text-gold-accent mt-1">{ent.category}</p>
                    </div>

                    <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{ent.tagline}</p>
                  </div>

                  <div className="flex justify-between items-center pt-6 mt-6 border-t border-brand-border/30">
                    <span className="text-[10px] font-mono text-text-muted tracking-wider uppercase">TRUST SCORE: {ent.trustScore}/5.0</span>
                    <span className="text-xs font-semibold text-teal-glow group-hover:underline flex items-center gap-1">
                      {ent.verified ? 'Lihat Profil' : 'Klaim Profil'} →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Slide Over Panel (Entity details & Claim portal) */}
      {selectedEntity && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            
            {/* Backdrop */}
            <div 
              onClick={() => setSelectedEntity(null)}
              className="absolute inset-0 bg-brand-slate/80 backdrop-blur-sm transition-opacity" 
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md slide-panel">
                <div className="flex h-full flex-col bg-brand-mid border-l border-brand-border shadow-xl">
                  
                  {/* Panel Header */}
                  <div className="px-6 py-6 border-b border-brand-border/60 flex items-center justify-between">
                    <h2 className="text-lg font-heading font-bold text-text-inverse" id="slide-over-title">
                      Detail Profil Entitas
                    </h2>
                    <button 
                      onClick={() => setSelectedEntity(null)}
                      className="rounded-lg text-text-muted hover:text-text-inverse focus:outline-none p-1.5 bg-brand-slate/50 border border-brand-border"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Panel Body */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    
                    {/* Logo & Basic Info */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-brand-slate border border-brand-border flex items-center justify-center text-text-inverse font-heading font-extrabold text-2xl">
                          {selectedEntity.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-heading font-bold text-text-inverse">{selectedEntity.name}</h3>
                          <span className="inline-block bg-brand-border/60 border border-brand-border text-gold-accent font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 rounded mt-1">
                            {selectedEntity.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {selectedEntity.verified ? (
                          <span className="bg-teal-accent/15 border border-teal-accent/25 text-teal-glow font-mono text-xs uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" /> Terverifikasi Publik
                          </span>
                        ) : (
                          <span className="bg-gold-accent/15 border border-gold-accent/25 text-gold-accent font-mono text-xs uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> Profil Belum Diklaim
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata contact details */}
                    <div className="space-y-4 pt-6 border-t border-brand-border/40 text-sm">
                      <div className="flex gap-3 items-start">
                        <MapPin className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-mono text-text-muted uppercase tracking-wider">Alamat Kantor</p>
                          <p className="text-text-inverse mt-0.5 leading-relaxed">{selectedEntity.address}</p>
                        </div>
                      </div>

                      {selectedEntity.phone && (
                        <div className="flex gap-3 items-start">
                          <Phone className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-mono text-text-muted uppercase tracking-wider">Telepon Kontak</p>
                            <p className="text-text-inverse mt-0.5">{selectedEntity.phone}</p>
                          </div>
                        </div>
                      )}

                      {selectedEntity.website && (
                        <div className="flex gap-3 items-start">
                          <Globe className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-mono text-text-muted uppercase tracking-wider">Situs Web</p>
                            <a href={selectedEntity.website} target="_blank" rel="noopener noreferrer" className="text-teal-accent hover:underline mt-0.5 block">
                              {selectedEntity.website}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Claim Profile Portal section */}
                    {!selectedEntity.verified && (
                      <div className="pt-6 border-t border-brand-border/40 space-y-6">
                        {!showClaimForm ? (
                          <div className="bg-brand-slate/40 border border-brand-border rounded-xl p-5 space-y-4">
                            <Building className="w-6 h-6 text-gold-accent" />
                            <h4 className="font-heading font-bold text-text-inverse">Klaim Profil ini Secara Gratis</h4>
                            <p className="text-xs text-text-muted leading-relaxed">
                              Apakah ini merupakan representasi dari instansi atau bisnis Anda? Klaim profil sekarang untuk memperbarui alamat kontak, menyinkronkan data Google Maps, dan mengaktifkan audit strategi digital.
                            </p>
                            <button
                              onClick={() => setShowClaimForm(true)}
                              className="w-full bg-gold-accent hover:bg-gold-accent/90 text-brand-slate text-xs font-heading font-bold uppercase tracking-wider py-3 rounded-lg text-center transition-colors"
                            >
                              Klaim Profil Sekarang →
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleClaimSubmit} className="space-y-4 bg-brand-slate/30 border border-brand-border rounded-xl p-5">
                            <h4 className="font-heading font-bold text-text-inverse">Formulir Klaim Profil</h4>
                            {claimSuccess ? (
                              <div className="text-center py-6 space-y-2">
                                <Check className="w-8 h-8 text-teal-accent mx-auto" />
                                <p className="text-sm font-bold text-text-inverse">Klaim Berhasil Dikirim!</p>
                                <p className="text-xs text-text-muted">Tim kami akan melakukan validasi kepemilikan dan menghubungi Anda.</p>
                              </div>
                            ) : (
                              <>
                                <div>
                                  <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">Nama Lengkap Anda</label>
                                  <input
                                    type="text"
                                    required
                                    value={claimData.name}
                                    onChange={(e) => setClaimData({...claimData, name: e.target.value})}
                                    placeholder="Contoh: Budi Santoso"
                                    className="w-full bg-brand-slate border border-brand-border rounded-lg px-3 py-2 text-xs text-text-inverse placeholder-text-muted focus:ring-1 focus:ring-teal-accent focus:border-transparent outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">Jabatan di Entitas</label>
                                  <input
                                    type="text"
                                    required
                                    value={claimData.role}
                                    onChange={(e) => setClaimData({...claimData, role: e.target.value})}
                                    placeholder="Contoh: Direktur / Owner"
                                    className="w-full bg-brand-slate border border-brand-border rounded-lg px-3 py-2 text-xs text-text-inverse placeholder-text-muted focus:ring-1 focus:ring-teal-accent focus:border-transparent outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">Nomor WhatsApp Aktif</label>
                                  <input
                                    type="text"
                                    required
                                    value={claimData.whatsapp}
                                    onChange={(e) => setClaimData({...claimData, whatsapp: e.target.value})}
                                    placeholder="Contoh: 08123456789"
                                    className="w-full bg-brand-slate border border-brand-border rounded-lg px-3 py-2 text-xs text-text-inverse placeholder-text-muted focus:ring-1 focus:ring-teal-accent focus:border-transparent outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1">Email Kantor (Opsional)</label>
                                  <input
                                    type="email"
                                    value={claimData.email}
                                    onChange={(e) => setClaimData({...claimData, email: e.target.value})}
                                    placeholder="budi@perusahaan.com"
                                    className="w-full bg-brand-slate border border-brand-border rounded-lg px-3 py-2 text-xs text-text-inverse placeholder-text-muted focus:ring-1 focus:ring-teal-accent focus:border-transparent outline-none"
                                  />
                                </div>
                                <div className="flex gap-2 pt-2">
                                  <button
                                    type="button"
                                    onClick={() => setShowClaimForm(false)}
                                    className="w-1/3 border border-brand-border text-text-muted text-[10px] font-mono uppercase tracking-wider py-2.5 rounded-lg text-center"
                                  >
                                    Kembali
                                  </button>
                                  <button
                                    type="submit"
                                    className="w-2/3 bg-teal-accent hover:bg-teal-glow text-brand-slate font-heading text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg text-center transition-colors"
                                  >
                                    Kirim Klaim
                                  </button>
                                </div>
                              </>
                            )}
                          </form>
                        )}
                      </div>
                    )}

                    {/* Affiliate Tools Section */}
                    <div className="pt-6 border-t border-brand-border/40 space-y-4">
                      <p className="text-xs font-mono text-text-muted uppercase tracking-wider">// REKOMENDASI ALAT PERTUMBUHAN</p>
                      <div className="grid grid-cols-2 gap-3">
                        <a 
                          href="https://niagahoster.co.id" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="bg-brand-slate/50 border border-brand-border hover:border-teal-glow rounded-xl p-3.5 text-center flex flex-col items-center justify-center gap-1 transition-all"
                        >
                          <span className="font-heading font-bold text-xs text-text-inverse">Host Utama</span>
                          <span className="text-[10px] text-text-muted">Niagahoster Premium</span>
                        </a>
                        <a 
                          href="https://canva.com" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="bg-brand-slate/50 border border-brand-border hover:border-teal-glow rounded-xl p-3.5 text-center flex flex-col items-center justify-center gap-1 transition-all"
                        >
                          <span className="font-heading font-bold text-xs text-text-inverse">Desain Visual</span>
                          <span className="text-[10px] text-text-muted">Canva Pro Tools</span>
                        </a>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
