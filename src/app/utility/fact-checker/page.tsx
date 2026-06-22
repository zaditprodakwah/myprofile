'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, ShieldAlert, CheckCircle2, AlertTriangle, ExternalLink, Calendar, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FactCheckerPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const res = await fetch(`/api/utility/fact-check?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success && data.data?.claims) {
        setResults(data.data.claims);
      } else {
        setResults([]);
        if (!data.success) {
          setError(data.error || 'Aduh, sistem kami gagal terhubung dengan basis data. Coba beberapa saat lagi, ya.');
        }
      }
    } catch (err: any) {
      setError('Koneksi terputus atau server sedang sibuk. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  const getRatingIcon = (ratingStr: string = '') => {
    const r = ratingStr.toLowerCase();
    if (r.includes('salah') || r.includes('hoax') || r.includes('keliru') || r.includes('false') || r.includes('misleading')) {
      return <ShieldAlert className="w-5 h-5 text-red-500" />;
    }
    if (r.includes('benar') || r.includes('true') || r.includes('correct')) {
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    }
    return <AlertTriangle className="w-5 h-5 text-amber-500" />;
  };

  const getRatingBadgeClass = (ratingStr: string = '') => {
    const r = ratingStr.toLowerCase();
    if (r.includes('salah') || r.includes('hoax') || r.includes('keliru') || r.includes('false') || r.includes('misleading')) {
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    }
    if (r.includes('benar') || r.includes('true') || r.includes('correct')) {
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    }
    return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-alabaster pt-28 pb-24 px-6 min-h-screen relative overflow-hidden">
        {/* Background lights */}
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-teal-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-gold-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          {/* Header Title */}
          <div className="space-y-4 text-center md:text-left">
            <span className="text-xs font-mono tracking-widest text-gold-accent uppercase block">
              {'// Alat Verifikasi & Kepercayaan Publik'}
            </span>
            <h1 className="text-3xl md:text-5xl font-heading-serif font-bold text-text-primary leading-tight">
              B2B Fact-Checker Engine
            </h1>
            <p className="text-sm md:text-base text-text-muted max-w-xl leading-relaxed">
              Verifikasi kredibilitas klaim bisnis, berita viral, atau pernyataan publik secara real-time langsung melalui integrasi data Google Fact Check Tools.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="contoh: hoaks bantuan sosial, klaim kesehatan, atau berita pemilu"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-offwhite border border-brand-border rounded-xl pl-12 pr-4 py-3.5 text-xs text-text-primary focus:ring-2 focus:ring-teal-accent outline-none font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-accent hover:bg-teal-glow text-white font-mono text-xs uppercase font-bold py-3.5 px-8 rounded-xl cursor-pointer transition-colors shrink-0 disabled:opacity-50"
            >
              {loading ? 'Mencari...' : 'Cari Fakta'}
            </button>
          </form>

          {/* Error Panel */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 text-xs rounded-xl font-sans flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Results List */}
          <div className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(n => (
                  <div key={n} className="bg-white border border-brand-border rounded-2xl p-6 space-y-3 animate-pulse">
                    <div className="h-4 bg-offwhite rounded w-3/4" />
                    <div className="h-3 bg-offwhite rounded w-1/2" />
                    <div className="h-10 bg-offwhite rounded w-full" />
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                <span className="text-xs font-mono text-text-muted block">Menemukan {results.length} klaim terkait</span>
                <div className="space-y-4">
                  {results.map((claim, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white border border-brand-border rounded-2xl p-6 md:p-8 space-y-4 shadow-xs hover:border-brand-slate transition-all"
                    >
                      {/* Claim Text */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-text-muted flex items-center gap-1.5 uppercase">
                          <HelpCircle className="w-3.5 h-3.5 text-gold-accent" /> KLAIM YANG DISELIDIKI:
                        </span>
                        <blockquote className="text-sm font-semibold text-text-primary pl-3 border-l-2 border-brand-border leading-relaxed font-sans italic">
                          "{claim.text}"
                        </blockquote>
                      </div>

                      {/* Fact Check Result */}
                      {claim.claimReview && claim.claimReview.map((rev: any, rIdx: number) => (
                        <div key={rIdx} className="bg-offwhite border border-brand-border/60 rounded-xl p-5 space-y-3">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <span className="text-[9px] font-mono text-text-muted uppercase">Pemeriksa: {rev.publisher?.name || 'Lembaga Cek Fakta'}</span>
                            <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-3 py-1 rounded-full border ${getRatingBadgeClass(rev.textualRating)}`}>
                              {getRatingIcon(rev.textualRating)}
                              {rev.textualRating.toUpperCase()}
                            </span>
                          </div>

                          <p className="text-xs text-text-muted leading-relaxed">
                            {rev.title || 'Ulasan cek fakta penuh tersedia di situs penerbit.'}
                          </p>

                          <div className="flex justify-between items-center pt-3 border-t border-brand-border/50 text-[10px] font-mono">
                            <span className="flex items-center gap-1 text-text-muted">
                              <Calendar className="w-3 h-3 text-teal-accent" /> {rev.reviewDate ? new Date(rev.reviewDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Baru-baru ini'}
                            </span>
                            <a
                              href={rev.url}
                              target="_blank"
                              rel="nofollow noopener noreferrer"
                              className="text-teal-accent hover:underline flex items-center gap-1 font-bold"
                            >
                              Baca Ulasan Lengkap <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : searched ? (
              <div className="bg-white border border-brand-border rounded-2xl p-12 text-center flex flex-col items-center gap-3 text-text-muted text-sm shadow-xs">
                <AlertTriangle className="w-8 h-8 text-gold-accent opacity-60" />
                <p>
                  Belum ada rekam jejak untuk klaim <strong>"{query}"</strong> di database verifikasi publik.
                </p>
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted/60">
                  Coba kata kunci yang lebih spesifik atau tokoh yang berbeda.
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
