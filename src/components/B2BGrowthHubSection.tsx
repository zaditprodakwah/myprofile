'use client';

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { MapPin, Search, Database, ArrowRight, Gauge, CheckSquare } from 'lucide-react';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 100, damping: 15 } 
  }
};

export default function B2BGrowthHubSection() {
  return (
    <section className="py-20 bg-alabaster border-b border-brand-border/40 relative overflow-hidden">
      {/* Decorative glow background */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] bg-teal-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-gold-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="mb-12 space-y-4 text-center md:text-left">
          <span className="text-xs font-mono tracking-widest text-gold-accent uppercase block">
            {'// Pusat Kendali Pertumbuhan & Data'}
          </span>
          <h2 className="text-3xl md:text-4xl font-heading-serif font-bold text-text-primary tracking-tight">
            Hub Pertumbuhan B2B & Intelijen Data
          </h2>
          <p className="text-sm md:text-base text-text-muted max-w-2xl leading-relaxed">
            Ekosistem terpadu yang memadukan wawasan taktis makro, peta kemitraan wilayah, dan perangkat pengukur performa untuk melipatgandakan konversi digital Anda.
          </p>
        </div>

        {/* Grid Layout (Bento Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: pSEO Directory */}
          <motion.div 
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="bg-white border border-brand-border rounded-3xl p-8 hover:border-teal-accent transition-all duration-300 hover:shadow-lg flex flex-col justify-between group h-96"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-accent/10 border border-teal-accent/20 flex items-center justify-center text-teal-accent">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading-sans font-bold text-text-primary group-hover:text-teal-accent transition-colors">
                Direktori Bisnis Wilayah
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Indeks kredibilitas publik regional. Memetakan potensi kemitraan bisnis lokal, agensi, dan institusi terverifikasi di kota-kota strategis Indonesia.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[10px] font-mono bg-offwhite px-2.5 py-1 rounded-full text-text-muted border border-brand-border">Cirebon</span>
                <span className="text-[10px] font-mono bg-offwhite px-2.5 py-1 rounded-full text-text-muted border border-brand-border">Jakarta Selatan</span>
                <span className="text-[10px] font-mono bg-offwhite px-2.5 py-1 rounded-full text-text-muted border border-brand-border">pSEO Maps</span>
              </div>
            </div>
            <Link 
              href="/directory" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-accent group-hover:underline pt-4 border-t border-brand-border mt-4"
            >
              Eksplorasi Wilayah <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Card 2: Audit Speed Engine */}
          <motion.div 
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-brand-border rounded-3xl p-8 hover:border-teal-accent transition-all duration-300 hover:shadow-lg flex flex-col justify-between group h-96"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-accent/10 border border-teal-accent/20 flex items-center justify-center text-teal-accent">
                <Gauge className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading-sans font-bold text-text-primary group-hover:text-teal-accent transition-colors">
                Audit SEO & Kecepatan Web
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Uji langsung kecepatan website dan struktur aksesibilitas halaman Anda secara instan menggunakan standardisasi Google Lighthouse. Temukan celah kebocoran leads.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[10px] font-mono bg-offwhite px-2.5 py-1 rounded-full text-text-muted border border-brand-border">LCP Analyzer</span>
                <span className="text-[10px] font-mono bg-offwhite px-2.5 py-1 rounded-full text-text-muted border border-brand-border">Lighthouse API</span>
                <span className="text-[10px] font-mono bg-offwhite px-2.5 py-1 rounded-full text-text-muted border border-brand-border">Leads Capture</span>
              </div>
            </div>
            <Link 
              href="/utility/audit-engine" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-accent group-hover:underline pt-4 border-t border-brand-border mt-4"
            >
              Uji Website Anda <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Card 3: Reference Bank */}
          <motion.div 
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-brand-border rounded-3xl p-8 hover:border-teal-accent transition-all duration-300 hover:shadow-lg flex flex-col justify-between group h-96"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-accent/10 border border-teal-accent/20 flex items-center justify-center text-teal-accent">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading-sans font-bold text-text-primary group-hover:text-teal-accent transition-colors">
                Bank Data Referensi
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Gudang wawasan bisnis. Berisi playbook pertumbuhan, checklist SEO teknis, sentimen berita makroekonomi (FRED/BPS), dan benchmark nilai tukar terintegrasi.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[10px] font-mono bg-offwhite px-2.5 py-1 rounded-full text-text-muted border border-brand-border">Playbooks</span>
                <span className="text-[10px] font-mono bg-offwhite px-2.5 py-1 rounded-full text-text-muted border border-brand-border">Macro Data</span>
                <span className="text-[10px] font-mono bg-offwhite px-2.5 py-1 rounded-full text-text-muted border border-brand-border">SEO Checklists</span>
              </div>
            </div>
            <Link 
              href="/sovereign-explorer" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-accent group-hover:underline pt-4 border-t border-brand-border mt-4"
            >
              Akses Bank Referensi <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
