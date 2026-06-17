'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const [stats, setStats] = useState({ years: 0, projects: 0, clients: 0 });

  useEffect(() => {
    const duration = 1000; // 1s
    const start = performance.now();
    
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setStats({
        years: Math.round(ease * 10),
        projects: Math.round(ease * 50),
        clients: Math.round(ease * 3),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  const headlineWords = "Dari Kata ke Konversi. Dari Data ke Dominasi.".split(" ");

  return (
    <section 
      id="hero" 
      className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden bg-brand-slate"
      style={{
        backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(13, 148, 136, 0.1) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(217, 119, 6, 0.05) 0%, transparent 50%)'
      }}
    >
      {/* Background Grid CSS Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Copywriting & Actions */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          {/* Label Monogram with Pulse badge */}
          <div className="inline-flex items-center gap-3 bg-brand-mid/80 border border-brand-border/60 rounded-full px-4 py-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-accent pulse-badge" />
            <span className="text-xs font-mono tracking-widest text-teal-accent uppercase">// SISTEM PERTUMBUHAN AKTIF</span>
          </div>

          {/* Staggered Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-text-inverse leading-tight">
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="inline-block mr-3"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-text-muted leading-relaxed max-w-xl font-sans"
          >
            Saya membantu UMKM, instansi, dan lembaga publik merancang ekosistem digital yang bukan hanya tampil — tapi <span className="text-teal-accent font-semibold">mengkonversi</span> secara sistematis.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <a 
              href="#contact" 
              className="bg-teal-accent hover:bg-teal-glow text-brand-slate font-semibold px-8 py-4 rounded-xl text-center transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-teal-accent/10 font-heading"
            >
              Ajak Kemitraan
            </a>
            <a 
              href="#case-studies" 
              className="border border-brand-border hover:border-teal-accent text-text-inverse hover:text-teal-accent font-medium px-8 py-4 rounded-xl text-center bg-transparent transition-all duration-300"
            >
              Lihat Studi Kasus →
            </a>
          </motion.div>

          {/* Stat Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="grid grid-cols-3 gap-6 pt-8 border-t border-brand-border/40 max-w-md"
          >
            <div>
              <p className="text-3xl lg:text-4xl font-heading font-extrabold text-gold-accent">{stats.years}+</p>
              <p className="text-xs font-mono tracking-wider text-text-muted uppercase mt-1">Tahun Pengalaman</p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-heading font-extrabold text-gold-accent">{stats.projects}+</p>
              <p className="text-xs font-mono tracking-wider text-text-muted uppercase mt-1">Proyek Selesai</p>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-heading font-extrabold text-gold-accent">{stats.clients}</p>
              <p className="text-xs font-mono tracking-wider text-text-muted uppercase mt-1">Mitra Lembaga</p>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Interactive System Status Panel */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 bg-brand-mid/60 border border-brand-border rounded-2xl p-6 shadow-2xl relative backdrop-blur-md"
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between pb-4 border-b border-brand-border/60 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Growth-Control-Panel.sh</span>
          </div>

          {/* System Stats Dashboard */}
          <div className="space-y-6">
            
            {/* Core Web Vitals */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2 text-text-muted">
                <span>LCP (Largest Contentful Paint)</span>
                <span className="text-teal-glow">0.82s (Optimal)</span>
              </div>
              <div className="w-full bg-brand-slate h-2 rounded-full overflow-hidden">
                <div className="bg-teal-accent h-full w-[94%]" />
              </div>
            </div>

            {/* Accessibility Rating */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2 text-text-muted">
                <span>WCAG A11y Score</span>
                <span className="text-teal-glow">100/100 (Compliant)</span>
              </div>
              <div className="w-full bg-brand-slate h-2 rounded-full overflow-hidden">
                <div className="bg-teal-accent h-full w-full" />
              </div>
            </div>

            {/* AEO / LLM Indexability */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2 text-text-muted">
                <span>AEO & GEO Readiness</span>
                <span className="text-gold-accent">98% Entity Match</span>
              </div>
              <div className="w-full bg-brand-slate h-2 rounded-full overflow-hidden">
                <div className="bg-gold-accent h-full w-[98%]" />
              </div>
            </div>

            {/* Telemetry Output Log */}
            <div className="bg-brand-slate/80 rounded-lg p-4 font-mono text-[11px] text-text-muted/80 leading-relaxed border border-brand-border/40">
              <p className="text-teal-accent/70">// CONSOLE TELEMETRY INITIALIZATION</p>
              <p className="mt-1">$ curl -s https://zadit.dev/api/health</p>
              <p className="text-text-inverse">{"{ status: \"READY\", latency: \"18ms\", client: \"AI-Agent\" }"}</p>
              <p className="mt-2">$ node --version && next --version</p>
              <p className="text-text-inverse">v20.11.0 && v16.0.0 (Next.js Stable)</p>
              <p className="mt-2 text-gold-accent/70">// WARNING: High conversion rate detected.</p>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}
