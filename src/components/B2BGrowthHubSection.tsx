'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { MapPin, Search, Database, ArrowRight, Gauge, CheckSquare } from 'lucide-react';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 80, damping: 18 } 
  }
};

interface SpotlightBentoCardProps {
  children: React.ReactNode;
  delay?: number;
}

function SpotlightBentoCard({ children, delay = 0 }: SpotlightBentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--x', `${e.clientX - left}px`);
    cardRef.current.style.setProperty('--y', `${e.clientY - top}px`);
  }, []);

  return (
    <motion.div 
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover={{ scale: 1.01 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bento-card relative bg-white border border-brand-border rounded-[2rem] p-8 flex flex-col justify-between hover:shadow-xl hover:border-brand-border/80 transition-all duration-300 group min-h-[24rem] h-full overflow-hidden"
      style={{ '--x': '50%', '--y': '50%' } as React.CSSProperties}
    >
      {/* Glow border mask */}
      <div
        className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(350px circle at var(--x) var(--y), rgba(13,148,136,0.09), transparent 80%)',
        }}
      />
      
      {/* Inner glowing border */}
      <div
        className="absolute inset-x-0 top-0 h-px rounded-t-[2rem] transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          background: 'linear-gradient(to right, transparent, rgba(13,148,136,0.25), transparent)',
        }}
      />

      {children}
    </motion.div>
  );
}

export default function B2BGrowthHubSection() {
  return (
    <section className="py-24 bg-alabaster border-b border-brand-border/40 relative overflow-hidden">
      {/* Decorative premium radial glows */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-teal-accent/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gold-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 space-y-4 text-center md:text-left">
          <span className="text-xs font-mono tracking-widest text-gold-accent uppercase block">
            {'// Pusat Kendali Pertumbuhan & Intelijen Data B2B'}
          </span>
          <h2 className="text-3xl md:text-4xl font-heading-serif font-bold text-text-primary tracking-tight">
            Hub Pertumbuhan B2B & <span className="gradient-text-teal">Intelijen Data</span>
          </h2>
          <p className="text-sm md:text-base text-text-muted max-w-2xl leading-relaxed">
            Ekosistem digital terpadu yang memadukan wawasan taktis makro, peta kemitraan wilayah, dan perangkat pengukur performa untuk melipatgandakan konversi digital Anda secara sistematis.
          </p>
        </div>

        {/* Grid Layout (Bento Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: pSEO Directory */}
          <SpotlightBentoCard delay={0}>
            <div className="space-y-5 relative z-10">
              <motion.div 
                whileHover={{ y: -1, scale: 1.02 }}
                className="w-12 h-12 rounded-2xl bg-teal-accent/10 border border-teal-accent/20 flex items-center justify-center text-teal-accent shadow-sm"
              >
                <MapPin className="w-6 h-6" />
              </motion.div>
              <h3 className="text-xl font-heading-sans font-bold text-text-primary group-hover:text-teal-accent transition-colors">
                Direktori Bisnis Wilayah
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Indeks kredibilitas publik regional. Memetakan potensi kemitraan bisnis lokal, agensi, dan institusi terverifikasi di kota-kota strategis Indonesia.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[10px] font-mono bg-offwhite px-2.5 py-1 rounded-md text-text-muted border border-brand-border">Cirebon</span>
                <span className="text-[10px] font-mono bg-offwhite px-2.5 py-1 rounded-md text-text-muted border border-brand-border">Jakarta Selatan</span>
                <span className="text-[10px] font-mono bg-offwhite px-2.5 py-1 rounded-md text-text-muted border border-brand-border">Peta Wilayah</span>
              </div>
            </div>
            <Link 
              href="/directory" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-accent group-hover:underline pt-4 border-t border-brand-border/60 mt-4 relative z-10"
            >
              Eksplorasi Wilayah <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </SpotlightBentoCard>

          {/* Card 2: Audit Speed Engine */}
          <SpotlightBentoCard delay={0.1}>
            <div className="space-y-5 relative z-10">
              <motion.div 
                whileHover={{ y: -1, scale: 1.02 }}
                className="w-12 h-12 rounded-2xl bg-teal-accent/10 border border-teal-accent/20 flex items-center justify-center text-teal-accent shadow-sm"
              >
                <Gauge className="w-6 h-6" />
              </motion.div>
              <h3 className="text-xl font-heading-sans font-bold text-text-primary group-hover:text-teal-accent transition-colors">
                Audit SEO & Kecepatan Web
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Uji langsung kecepatan website dan struktur aksesibilitas halaman Anda secara instan menggunakan standardisasi Google Lighthouse. Temukan celah kebocoran leads.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[10px] font-mono bg-offwhite px-2.5 py-1 rounded-md text-text-muted border border-brand-border">Kecepatan Muat</span>
                <span className="text-[10px] font-mono bg-offwhite px-2.5 py-1 rounded-md text-text-muted border border-brand-border">Cek Aksesibilitas</span>
                <span className="text-[10px] font-mono bg-offwhite px-2.5 py-1 rounded-md text-text-muted border border-brand-border">Optimasi Konversi</span>
              </div>
            </div>
            <Link 
              href="/utility/audit-engine" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-accent group-hover:underline pt-4 border-t border-brand-border/60 mt-4 relative z-10"
            >
              Uji Website Anda <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </SpotlightBentoCard>

          {/* Card 3: Reference Bank (Growth Hub & Telemetry) */}
          <SpotlightBentoCard delay={0.2}>
            <div className="space-y-5 relative z-10">
              <motion.div 
                whileHover={{ y: -1, scale: 1.02 }}
                className="w-12 h-12 rounded-2xl bg-teal-accent/10 border border-teal-accent/20 flex items-center justify-center text-teal-accent shadow-sm"
              >
                <Database className="w-6 h-6" />
              </motion.div>
              <h3 className="text-xl font-heading-sans font-bold text-text-primary group-hover:text-teal-accent transition-colors">
                Growth Hub & Telemetri
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Gudang wawasan bisnis terpadu. Berisi playbook pertumbuhan, checklist SEO teknis, sentimen berita makroekonomi (FRED/BPS), dan benchmark nilai tukar terintegrasi.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[10px] font-mono bg-offwhite px-2.5 py-1 rounded-md text-text-muted border border-brand-border">Playbooks</span>
                <span className="text-[10px] font-mono bg-offwhite px-2.5 py-1 rounded-md text-text-muted border border-brand-border">Macro Data</span>
                <span className="text-[10px] font-mono bg-offwhite px-2.5 py-1 rounded-md text-text-muted border border-brand-border">SEO Checklists</span>
              </div>
            </div>
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-accent group-hover:underline pt-4 border-t border-brand-border/60 mt-4 relative z-10"
            >
              Akses Growth Hub <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </SpotlightBentoCard>

        </div>

      </div>
    </section>
  );
}
