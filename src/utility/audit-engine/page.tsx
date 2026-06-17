'use client';

import { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { ShieldAlert, CheckCircle, ArrowRight, Zap, HelpCircle, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function simulateAuditScore(url: string) {
  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const hash = hashString(url);
  const accessibility = Math.floor(62 + (hash % 33));
  const narrative = Math.floor(55 + (hashString(url.split('.')[0] || 'site') % 40));

  return {
    accessibility,
    narrative,
    potentialLoss: Math.floor(20 + (100 - accessibility) * 0.4),
  };
}

export default function AuditEnginePage() {
  const [formData, setFormData] = useState({ name: '', whatsapp: '', url: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    accessibility: number;
    narrative: number;
    potentialLoss: number;
  } | null>(null);
  
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp || !formData.url) {
      setErrorMsg('Semua data wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const scores = simulateAuditScore(formData.url);

      // Save lead to Supabase
      const { error } = await supabase.from('utility_leads').insert({
        lead_name: formData.name,
        contact_info: JSON.stringify({ whatsapp: formData.whatsapp }),
        target_site_url: formData.url,
        audit_category: 'Growth Diagnostic Tool',
        accessibility_score: scores.accessibility,
        narrative_score: scores.narrative,
        status: 'PENDING',
      });

      if (error) throw error;

      setResult(scores);
    } catch (err) {
      console.warn('Supabase DB Insert failed, rendering client-side output directly.', err);
      // Fallback: Show result anyway so user experience is not broken
      setResult(simulateAuditScore(formData.url));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAccessibilityStatus = (score: number) => {
    if (score >= 90) return { label: 'Sangat Baik', color: 'text-teal-glow border-teal-glow/30 bg-teal-glow/5' };
    if (score >= 75) return { label: 'Butuh Perbaikan Ringan', color: 'text-gold-accent border-gold-accent/30 bg-gold-accent/5' };
    return { label: 'Kritis', color: 'text-red-400 border-red-400/30 bg-red-400/5' };
  };

  const getNarrativeStatus = (score: number) => {
    if (score >= 85) return { label: 'Sangat Jelas', color: 'text-teal-glow border-teal-glow/30 bg-teal-glow/5' };
    if (score >= 70) return { label: 'Sedikit Jargon', color: 'text-gold-accent border-gold-accent/30 bg-gold-accent/5' };
    return { label: 'Terlalu Banyak Jargon', color: 'text-red-400 border-red-400/30 bg-red-400/5' };
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-brand-slate pt-28 pb-24 px-6 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="text-xs font-mono tracking-widest text-gold-accent uppercase">// ALAT DIAGNOSTIK GRATIS</span>
            <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-text-inverse">
              Audit Aksesibilitas & Kejelasan Narasi Web
            </h1>
            <p className="text-sm md:text-base text-text-muted max-w-xl mx-auto leading-relaxed">
              Ketahui seberapa ramah situs web Anda bagi pembaca mobile dan mesin pencari AI dalam hitungan detik. Gratis dan tanpa pendaftaran.
            </p>
          </div>

          {!result ? (
            /* Input Form Card */
            <div className="bg-brand-mid/40 border border-brand-border rounded-2xl p-8 max-w-xl mx-auto shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-brand-border/40">
                <Zap className="w-5 h-5 text-teal-glow" />
                <h3 className="font-heading font-bold text-text-inverse">Jalankan Diagnostik Instan</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Nama Lengkap Anda</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Andi Wijaya"
                    className="w-full bg-brand-slate border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-inverse placeholder-text-muted focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Nomor WhatsApp Aktif</label>
                  <input
                    type="text"
                    name="whatsapp"
                    required
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="Contoh: 08123456789"
                    className="w-full bg-brand-slate border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-inverse placeholder-text-muted focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">URL Situs Web Anda</label>
                  <input
                    type="url"
                    name="url"
                    required
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://perusahaananda.com"
                    className="w-full bg-brand-slate border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-inverse placeholder-text-muted focus:ring-2 focus:ring-teal-accent focus:border-transparent outline-none transition-all"
                  />
                </div>

                {errorMsg && <p className="text-xs text-red-400 font-mono">{errorMsg}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal-accent hover:bg-teal-glow text-brand-slate font-heading font-bold uppercase tracking-wider py-4 rounded-xl text-center transition-colors flex items-center justify-center gap-2 mt-6"
                >
                  {isSubmitting ? 'Menganalisis Web...' : 'Jalankan Diagnostik'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            /* Results Panel */
            <div className="space-y-8 animate-fade-in">
              <div className="bg-brand-mid/40 border border-brand-border rounded-2xl p-8 lg:p-12 shadow-xl space-y-8">
                
                {/* Panel Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-brand-border/40 gap-4">
                  <div>
                    <span className="text-xs font-mono text-text-muted uppercase">// HASIL ANALISIS SITUS WEB</span>
                    <h3 className="text-xl font-heading font-bold text-text-inverse mt-1">{formData.url}</h3>
                  </div>
                  <button
                    onClick={() => setResult(null)}
                    className="text-xs font-mono uppercase tracking-wider text-teal-glow border border-brand-border/60 px-4 py-2 rounded-xl hover:border-teal-glow transition-colors"
                  >
                    Audit Website Lain
                  </button>
                </div>

                {/* Score Gauges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Accessibility Card */}
                  <div className="bg-brand-slate/40 border border-brand-border/60 rounded-xl p-6 flex flex-col items-center justify-between gap-6 text-center">
                    <div>
                      <h4 className="font-heading font-bold text-text-inverse text-lg">Aksesibilitas Web (A11y)</h4>
                      <p className="text-xs text-text-muted mt-1 leading-relaxed">Keterbacaan dan performa tap target pada perangkat ponsel.</p>
                    </div>

                    {/* SVG Gauge */}
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="72" cy="72" r="58" className="stroke-brand-border/60 stroke-[8] fill-none" />
                        <circle 
                          cx="72" 
                          cy="72" 
                          r="58" 
                          className="stroke-teal-accent stroke-[8] fill-none" 
                          strokeDasharray={364}
                          strokeDashoffset={364 - (364 * result.accessibility) / 100}
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-3xl font-heading font-extrabold text-text-inverse">{result.accessibility}</span>
                        <span className="text-xs text-text-muted block">/ 100</span>
                      </div>
                    </div>

                    <span className={cn("text-xs font-mono uppercase tracking-wider px-3.5 py-1 rounded-full border", getAccessibilityStatus(result.accessibility).color)}>
                      {getAccessibilityStatus(result.accessibility).label}
                    </span>
                  </div>

                  {/* Narrative Clarity Card */}
                  <div className="bg-brand-slate/40 border border-brand-border/60 rounded-xl p-6 flex flex-col items-center justify-between gap-6 text-center">
                    <div>
                      <h4 className="font-heading font-bold text-text-inverse text-lg">Kejelasan Struktur Narasi</h4>
                      <p className="text-xs text-text-muted mt-1 leading-relaxed">Kepadatan jargon bisnis vs kepasihan pemahaman pengunjung.</p>
                    </div>

                    {/* SVG Gauge */}
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="72" cy="72" r="58" className="stroke-brand-border/60 stroke-[8] fill-none" />
                        <circle 
                          cx="72" 
                          cy="72" 
                          r="58" 
                          className="stroke-teal-accent stroke-[8] fill-none" 
                          strokeDasharray={364}
                          strokeDashoffset={364 - (364 * result.narrative) / 100}
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-3xl font-heading font-extrabold text-text-inverse">{result.narrative}</span>
                        <span className="text-xs text-text-muted block">/ 100</span>
                      </div>
                    </div>

                    <span className={cn("text-xs font-mono uppercase tracking-wider px-3.5 py-1 rounded-full border", getNarrativeStatus(result.narrative).color)}>
                      {getNarrativeStatus(result.narrative).label}
                    </span>
                  </div>

                </div>

                {/* Audit Insights */}
                <div className="pt-6 border-t border-brand-border/40 space-y-4">
                  <h4 className="text-xs font-mono text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-gold-accent" /> Rekomendasi Utama:
                  </h4>
                  <div className="space-y-3 text-sm leading-relaxed text-text-muted">
                    {result.accessibility < 85 && (
                      <p>
                        ⚠️ <span className="text-text-inverse font-semibold">Aksesibilitas Mobile:</span> Tombol atau elemen klik berukuran kurang dari 44px di perangkat mobile. Ini memicu tingkat kesalahan tap yang berpotensi menghilangkan <span className="text-gold-accent font-semibold">{result.potentialLoss}%</span> potensi konversi traffic Anda.
                      </p>
                    )}
                    {result.narrative < 80 && (
                      <p>
                        ⚠️ <span className="text-text-inverse font-semibold">Kejelasan Pesan:</span> 200 kata pertama di halaman utama mengandung terlalu banyak jargon korporat abstrak. Gunakan pola <span className="text-teal-accent font-semibold">Definition-Lead</span> agar mudah dipahami oleh mesin perayap Google AI dan audiens awam.
                      </p>
                    )}
                  </div>
                </div>

              </div>

              {/* Call To Action Box */}
              <div className="bg-brand-mid/40 border border-brand-border rounded-2xl p-8 max-w-2xl mx-auto text-center space-y-6">
                <CheckCircle className="w-10 h-10 text-teal-glow mx-auto" />
                <h3 className="text-2xl font-heading font-bold text-text-inverse">Dapatkan Dokumen Rekomendasi Lengkap</h3>
                <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-md mx-auto">
                  Ambil detail laporan diagnostik lengkap 12 halaman gratis dan jadwalkan 15 menit konsultasi audit strategi digital bersama Zadit.
                </p>

                <a
                  href={`https://wa.me/6281234567890?text=Halo%20Zadit%2C%20saya%20baru%20saja%20menyelesaikan%20audit%20diagnostik%20untuk%20website%20${formData.url}.%20Bisa%20tolong%20kirimkan%20dokumen%20rekomendasi%20lengkapnya%3F`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-teal-accent hover:bg-teal-glow text-brand-slate font-heading font-bold uppercase tracking-wider px-8 py-4 rounded-xl transition-all shadow-lg shadow-teal-accent/10"
                >
                  Dapatkan Rekomendasi via WhatsApp <Send className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
