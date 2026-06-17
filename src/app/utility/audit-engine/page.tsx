'use client';

import { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Zap, Send, ArrowRight, Shield, AlertTriangle, Monitor } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

// Circular SVG Progress Gauge Component
function CircularProgress({ score, label }: { score: number; label: string }) {
  const circumference = 2 * Math.PI * 30; // ~188.49
  const offset = circumference - (score / 100) * circumference;

  let strokeColor = 'stroke-red-500';
  let bgColor = 'bg-red-50';
  let textColor = 'text-red-700';

  if (score >= 90) {
    strokeColor = 'stroke-teal-accent';
    bgColor = 'bg-teal-50';
    textColor = 'text-teal-700';
  } else if (score >= 50) {
    strokeColor = 'stroke-gold-accent';
    bgColor = 'bg-amber-50';
    textColor = 'text-amber-700';
  }

  return (
    <div className="flex flex-col items-center gap-2 bg-white border border-brand-border rounded-xl p-4 shadow-xs">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="26"
            className="stroke-slate-100 fill-none"
            strokeWidth="5"
          />
          <motion.circle
            cx="32"
            cy="32"
            r="26"
            className={`fill-none ${strokeColor}`}
            strokeWidth="5"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs text-text-primary">
          {score}
        </div>
      </div>
      <span className="text-[9px] font-mono tracking-widest text-text-muted uppercase">{label}</span>
      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${bgColor} ${textColor} font-bold`}>
        {score >= 90 ? 'BAGUS' : score >= 50 ? 'SEDANG' : 'KRITIS'}
      </span>
    </div>
  );
}

export default function AuditEnginePage() {
  const [formData, setFormData] = useState({ name: '', whatsapp: '', url: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0); // 0: input, 1: scanning, 2: completed
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Run terminal logs simulation during API call
  const runTerminalLogs = (targetUrl: string, signal: { aborted: boolean }) => {
    const logs = [
      `Menghubungkan ke sistem analisis performa...`,
      `Membaca struktur alamat website ${targetUrl}...`,
      `Mengirim permintaan audit ke Google PageSpeed Insights (Mobile)...`,
      `Menganalisis kemudahan navigasi & aksesibilitas halaman...`,
      `Mengukur kestabilan visual dan performa loading utama...`,
      `Mendeteksi hambatan respon interaksi pada halaman...`,
      `Menghitung potensi kehilangan calon pelanggan akibat loading lambat...`,
      `Menyimpan ringkasan analisis untuk laporan optimasi...`,
      `Menyusun laporan rekomendasi optimasi konversi...`
    ];

    let currentIndex = 0;
    
    const addNextLog = () => {
      if (signal.aborted) return;
      if (currentIndex < logs.length) {
        const timestamp = new Date().toLocaleTimeString().split(' ')[0];
        setTerminalLogs((prev) => [...prev, `[${timestamp}] ${logs[currentIndex]}`]);
        currentIndex++;
        setTimeout(addNextLog, 1600);
      }
    };

    addNextLog();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp || !formData.url) {
      setErrorMsg('Nama, nomor WhatsApp, dan URL website wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setAuditProgress(1); // switch to terminal scanning view
    setErrorMsg('');
    setTerminalLogs([]);

    const signal = { aborted: false };
    runTerminalLogs(formData.url, signal);

    try {
      // Call PageSpeed Insights Server Endpoint
      const res = await fetch('/api/audit-speed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formData.url })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal memproses data PageSpeed.');
      }

      const auditData = await res.json();
      setAuditResult(auditData);

      // Save lead to Supabase Database
      const { error } = await supabase.from('utility_leads').insert({
        lead_name: formData.name,
        contact_info: { whatsapp: formData.whatsapp, email: formData.email },
        target_site_url: formData.url,
        audit_category: 'Real Growth & Performance Audit',
        accessibility_score: auditData.scores.accessibility,
        narrative_score: auditData.scores.performance, // mapped performance score
        status: 'PENDING',
      });

      if (error) {
        console.warn('Supabase Insert Error (Bypassed silently):', error);
      }

      // Complete progress
      signal.aborted = true;
      const timestamp = new Date().toLocaleTimeString().split(' ')[0];
      setTerminalLogs((prev) => [
        ...prev, 
        `[${timestamp}] ANALISIS SELESAI. LAPORAN REKOMENDASI SIAP DITAMPILKAN...`
      ]);

      setTimeout(() => {
        setAuditProgress(2); // show result view
      }, 1000);

    } catch (err: any) {
      signal.aborted = true;
      setErrorMsg(err.message || 'Koneksi API gagal. Sila periksa kembali URL Anda.');
      setAuditProgress(0); // return to form on error
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    if (!auditResult) return;
    const waText = `Halo Zadit, saya baru saja meminta audit pertumbuhan gratis untuk website saya: ${formData.url}. Hasil PageSpeed: Performance ${auditResult.scores.performance}/100, Accessibility ${auditResult.scores.accessibility}/100, SEO ${auditResult.scores.seo}/100. Mari diskusikan optimasi konversinya!`;
    const waLink = `https://wa.me/6282316363177?text=${encodeURIComponent(waText)}`;
    window.open(waLink, '_blank');
  };

  // Reset back to input
  const handleReset = () => {
    setAuditProgress(0);
    setIsSubmitting(false);
    setAuditResult(null);
  };

  // Calculate business conversion leak estimates (Advanced UX Hack)
  const calculateConversionLeak = (perfScore: number) => {
    if (perfScore >= 90) return { leak: 5, color: 'text-teal-600', label: 'Rendah' };
    if (perfScore >= 50) return { leak: 22, color: 'text-amber-600', label: 'Sedang' };
    return { leak: 42, color: 'text-red-600', label: 'Tinggi (Kritis)' };
  };

  const leakMetrics = auditResult ? calculateConversionLeak(auditResult.scores.performance) : null;

  return (
    <>
      <Header />
      <main className="flex-1 bg-alabaster pt-28 pb-24 px-6 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="text-xs font-mono tracking-widest text-gold-accent uppercase">Analisis Performa Halaman</span>
            <h1 className="text-3xl md:text-4xl font-heading-serif font-bold text-text-primary">
              Audit Aksesibilitas & Narasi Web
            </h1>
            <p className="text-sm text-text-muted leading-relaxed max-w-md mx-auto">
              Dapatkan data asli kecepatan Core Web Vitals, optimasi SEO, dan kepatuhan aksesibilitas WCAG langsung lewat PageSpeed Insights API.
            </p>
          </div>

          {auditProgress === 0 && (
            /* Input Form Card */
            <div className="bg-white border border-brand-border rounded-2xl p-8 shadow-xl space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-brand-border">
                <Zap className="w-5 h-5 text-teal-accent" />
                <h3 className="font-heading-sans font-bold text-text-primary">Ajukan Audit Pertumbuhan Gratis</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Andi Wijaya"
                    className="w-full bg-offwhite border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-primary placeholder-text-muted/65 focus:ring-2 focus:ring-teal-accent focus:bg-white focus:border-transparent outline-none transition-all"
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
                    placeholder="Contoh: 081234567890"
                    className="w-full bg-offwhite border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-primary placeholder-text-muted/65 focus:ring-2 focus:ring-teal-accent focus:bg-white focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Email Kantor (Opsional)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Contoh: andi@perusahaan.com"
                    className="w-full bg-offwhite border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-primary placeholder-text-muted/65 focus:ring-2 focus:ring-teal-accent focus:bg-white focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">URL Situs Web</label>
                  <input
                    type="text"
                    name="url"
                    required
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="Contoh: perusahaananda.com"
                    className="w-full bg-offwhite border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-primary placeholder-text-muted/65 focus:ring-2 focus:ring-teal-accent focus:bg-white focus:border-transparent outline-none transition-all"
                  />
                </div>

                {errorMsg && <p className="text-xs text-red-600 font-mono font-semibold">{errorMsg}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal-accent hover:bg-brand-slate text-text-inverse font-heading-sans font-bold uppercase tracking-wider py-4 rounded-xl text-center transition-colors flex items-center justify-center gap-2 mt-6 cursor-pointer shadow-sm text-xs select-none active:scale-98"
                >
                  Mulai Proses Diagnostik <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {auditProgress === 1 && (
            /* Terminal Progress View */
            <div className="bg-brand-slate border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-teal-accent" />
                  <span className="text-[10px] font-mono text-text-inverse tracking-wider uppercase font-semibold">KONSOL ANALISIS PERFORMA</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
              </div>

              <div className="h-64 overflow-y-auto font-mono text-[10px] text-text-inverse/85 space-y-1.5 scrollbar-thin">
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed whitespace-pre-wrap">
                    {log}
                  </div>
                ))}
                <div className="flex items-center gap-1.5 text-teal-accent animate-pulse font-bold mt-1">
                  <span>&gt; Memproses analisis mendalam...</span>
                </div>
              </div>

              <p className="text-[9px] font-mono text-text-inverse/50 border-t border-slate-700/60 pt-3">
                *Analisis PSI memerlukan waktu 10-15 detik karena server Google sedang melakukan render dinamis pada situs Anda.
              </p>
            </div>
          )}

          {auditProgress === 2 && auditResult && (
            /* Results View Card */
            <div className="bg-white border border-brand-border rounded-2xl p-8 shadow-xl space-y-8 animate-fade-in">
              <div className="flex justify-between items-center pb-4 border-b border-brand-border">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-accent" />
                  <h3 className="font-heading-sans font-bold text-text-primary">Hasil Laporan Diagnostik</h3>
                </div>
                <span className="text-[10px] font-mono bg-teal-accent/10 text-teal-accent px-3 py-1 rounded-full uppercase font-bold tracking-wider">
                  SELESAI
                </span>
              </div>

              {/* Gauge scores Row */}
              <div className="grid grid-cols-3 gap-4">
                <CircularProgress score={auditResult.scores.performance} label="Performance" />
                <CircularProgress score={auditResult.scores.accessibility} label="Accessibility" />
                <CircularProgress score={auditResult.scores.seo} label="SEO Score" />
              </div>

              {/* Speed Metrics Table */}
              <div className="bg-offwhite rounded-xl p-5 space-y-3">
                <h4 className="text-[10px] font-mono tracking-widest text-text-muted uppercase">Metrik Kecepatan Situs (Google PageSpeed)</h4>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono text-text-primary">
                  <div className="flex justify-between pb-1.5 border-b border-brand-border">
                    <span className="text-text-muted">Waktu Loading Utama (LCP)</span>
                    <span className="font-bold">{auditResult.metrics.lcp}</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-brand-border">
                    <span className="text-text-muted">Respon Pertama Halaman (FCP)</span>
                    <span className="font-bold">{auditResult.metrics.fcp}</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-brand-border">
                    <span className="text-text-muted">Kestabilan Visual (CLS)</span>
                    <span className="font-bold">{auditResult.metrics.cls}</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-brand-border">
                    <span className="text-text-muted">Kecepatan Render Mobile</span>
                    <span className="font-bold">{auditResult.metrics.speedIndex}</span>
                  </div>
                </div>
              </div>

              {/* Business conversion leak estimates (Advanced UX Hack) */}
              {leakMetrics && (
                <div className="border border-brand-border rounded-xl p-5 space-y-2 bg-amber-50/50">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-gold-accent" />
                    <span className="text-xs font-mono tracking-widest text-gold-accent uppercase font-bold">ESTIMASI KEBOCORAN BISNIS</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Situs web lambat merusak konversi iklan dan organik. Berdasarkan performa saat ini, situs Anda diperkirakan mengalami kebocoran lalu lintas pengguna potensial sebesar <strong className={leakMetrics.color}>{leakMetrics.leak}%</strong> (Tingkat Kebablasan: {leakMetrics.label}).
                  </p>
                </div>
              )}

              {/* Critical Recommendations List */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-teal-accent" />
                  <span className="text-[10px] font-mono tracking-widest text-text-muted uppercase">3 ISU UTAMA HARUS DIPERBAIKI</span>
                </div>
                <div className="space-y-3">
                  {auditResult.recommendations.map((rec: any, idx: number) => (
                    <div key={idx} className="bg-white border border-brand-border rounded-xl p-4 space-y-1">
                      <p className="text-xs font-bold text-text-primary">
                        {idx + 1}. {rec.title}
                      </p>
                      <p className="text-[11px] text-text-muted leading-relaxed">
                        {rec.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleWhatsAppRedirect}
                  className="flex-1 bg-teal-accent hover:bg-brand-slate text-text-inverse font-heading-sans font-bold uppercase tracking-wider py-4 rounded-xl text-center transition-all shadow-sm text-xs flex items-center justify-center gap-2 select-none active:scale-98 cursor-pointer"
                >
                  Ambil Solusi di WhatsApp <Send className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleReset}
                  className="border border-brand-border hover:border-text-primary text-text-muted hover:text-text-primary font-heading-sans font-bold uppercase tracking-wider px-6 py-4 rounded-xl text-center transition-colors text-xs select-none active:scale-98 cursor-pointer"
                >
                  Coba Situs Lain
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
