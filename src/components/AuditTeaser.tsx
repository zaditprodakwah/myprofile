'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Gauge, ArrowRight, Zap, Globe, Search } from 'lucide-react';

export default function AuditTeaser() {
  const [url, setUrl] = useState('');
  const router = useRouter();

  const handleAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      // Validate basic URL format
      let finalUrl = url.trim();
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl;
      }
      router.push(`/utility/audit-engine?url=${encodeURIComponent(finalUrl)}`);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-brand-slate text-white border-b border-brand-mid/40 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-teal-accent/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-8">
        
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20"
          >
            <Gauge className="w-4 h-4 text-teal-accent" />
            <span className="text-xs font-mono text-teal-accent uppercase tracking-wider font-bold">Lighthouse Core Web Vitals</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-heading-serif font-bold text-white tracking-tight">
            Audit Performa & <span className="text-teal-accent">SEO Otomatis</span>
          </h2>
          <p className="text-sm md:text-base text-text-inverse/70 max-w-2xl mx-auto leading-relaxed">
            Kecepatan website adalah metrik konversi. Uji situs web Anda menggunakan standar metrik LCP, FID, dan CLS secara gratis. Temukan celah hilangnya traffic.
          </p>
        </div>

        <form onSubmit={handleAudit} className="relative max-w-2xl mx-auto mt-8 group">
          <div className="absolute inset-0 bg-teal-accent/20 blur-xl rounded-2xl group-hover:bg-teal-accent/30 transition-all duration-500 opacity-50"></div>
          <div className="relative flex flex-col md:flex-row gap-2 bg-brand-mid border border-white/20 p-2 rounded-2xl shadow-2xl">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-brand-slate rounded-xl border border-white/10 focus-within:border-teal-accent/50 transition-colors">
              <Globe className="w-5 h-5 text-white/40" />
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Masukkan URL website (misal: zadit.com)"
                className="w-full bg-transparent border-none text-white placeholder-white/40 outline-none text-sm font-mono"
                required
              />
            </div>
            <button 
              type="submit"
              className="bg-teal-accent text-brand-slate font-bold px-8 py-3 rounded-xl hover:bg-teal-accent/90 transition-all duration-300 flex items-center justify-center gap-2 md:w-auto w-full group/btn"
            >
              <Zap className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              Mulai Audit
            </button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center gap-6 mt-8 opacity-70">
          <div className="flex items-center gap-2 text-xs font-mono">
            <Search className="w-4 h-4 text-gold-accent" /> SEO Analysis
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <Gauge className="w-4 h-4 text-emerald-400" /> PageSpeed Score
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <Zap className="w-4 h-4 text-blue-400" /> Accessibility Check
          </div>
        </div>

      </div>
    </section>
  );
}
