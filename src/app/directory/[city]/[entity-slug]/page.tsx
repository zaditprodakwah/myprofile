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

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function EntityDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const city = params.city as string;
  const slug = params.entity_slug as string;

  const [entity, setEntity] = useState<Entity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEntity() {
      try {
        const { data, error } = await supabase
          .from('entities')
          .select('*')
          .eq('city_slug', city.toLowerCase())
          .eq('slug', slug.toLowerCase())
          .single();

        if (error) throw error;
        if (data) {
            const rawType = String(data.entity_type || '').toLowerCase();
            const translatedCategory = 
              rawType === 'agency' ? 'Agensi / Kemitraan' : 
              rawType === 'service' ? 'Layanan Publik / Swasta' : 
              rawType === 'institution' ? 'Instansi / Lembaga' : 
              'Bisnis Lokal';

            setEntity({
              id: String(data.id),
              name: String(data.name),
              slug: String(data.slug),
              category: translatedCategory,
              tagline: String(data.tagline || data.description || ''),
              description: String(data.description || data.tagline || ''),
              address: String((data.raw_metadata as any)?.address || 'Alamat terdaftar'),
              phone: String(data.contact_phone || ''),
              email: String(data.contact_email || ''),
              website: String(data.website_url || ''),
              trustScore: Number(data.trust_score || 4.0),
              verified: data.verification_status === 'VERIFIED',
              city: city.toLowerCase(),
              history: []
            });
        }
      } catch (err) {
        console.error('Entity fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEntity();
  }, [city, slug]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-alabaster pt-32 pb-24 px-6 flex flex-col items-center justify-center text-center">
          <RefreshCw className="w-8 h-8 text-teal-accent mb-4 animate-spin" />
          <h1 className="text-xl font-heading-serif text-text-primary">Memuat Data...</h1>
        </main>
        <Footer />
      </>
    );
  }

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
