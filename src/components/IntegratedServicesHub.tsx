'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, MapPin, Gauge, Database, Code, ShieldCheck, Target, PenTool, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { Service } from '@/lib/types';

// Map icon names to Lucide icons
const IconMap: Record<string, React.ElementType> = {
  MapPin, Gauge, Database, Code, ShieldCheck, Target, PenTool, LayoutGrid
};

interface IntegratedServicesHubProps {
  services: Service[];
}

export default function IntegratedServicesHub({ services }: IntegratedServicesHubProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Combine static B2B Growth Hub tools with dynamic Services
  const b2bTools = [
    {
      id: 'b2b-1',
      title: 'Direktori Bisnis Wilayah',
      description: 'Indeks kredibilitas publik regional. Memetakan potensi kemitraan bisnis lokal, agensi, dan institusi terverifikasi di kota-kota strategis Indonesia.',
      icon_name: 'MapPin',
      tags: ['Peta Wilayah', 'Cirebon', 'Jakarta Selatan'],
      cta: { text: 'Eksplorasi Wilayah', url: '/directory' }
    },
    {
      id: 'b2b-2',
      title: 'Audit SEO & Kecepatan Web',
      description: 'Uji langsung kecepatan website dan struktur aksesibilitas halaman Anda secara instan menggunakan standardisasi Google Lighthouse. Temukan celah kebocoran leads.',
      icon_name: 'Gauge',
      tags: ['Kecepatan Muat', 'Aksesibilitas', 'SEO'],
      cta: { text: 'Uji Website Anda', url: '/utility/audit-engine' }
    },
    {
      id: 'b2b-3',
      title: 'Growth Hub & Telemetri',
      description: 'Gudang wawasan bisnis terpadu. Berisi playbook pertumbuhan, checklist SEO teknis, sentimen berita makroekonomi (FRED/BPS), dan benchmark nilai tukar.',
      icon_name: 'Database',
      tags: ['Playbooks', 'Macro Data', 'SEO Checklists'],
      cta: { text: 'Akses Growth Hub', url: '/blog' }
    }
  ];

  const allItems = [
    ...b2bTools.map((t, i) => ({ ...t, isTool: true, originalIndex: i })),
    ...services.map((s, i) => ({ ...s, isTool: false, originalIndex: i }))
  ];

  return (
    <section id="services-hub" className="py-24 bg-[#f9fafb] border-b border-brand-border relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 grid-bg opacity-35 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 80% 100%, rgba(13,148,136,0.03) 0%, transparent 70%)'
        }}
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <span className="text-xs font-mono tracking-widest text-gold-accent uppercase block mb-3">
            {'// Pusat Integrasi & Keahlian B2B'}
          </span>
          <h2 className="text-3xl md:text-4xl font-heading-serif font-bold text-text-primary tracking-tight">
            Layanan & <span className="gradient-text-teal">Ekosistem Hub</span>
          </h2>
          <p className="text-sm md:text-base text-text-muted mt-4 max-w-2xl leading-relaxed">
            Arsitektur pertumbuhan holistik yang menggabungkan perangkat cerdas B2B dengan rekayasa kode, riset analitik, optimasi mesin pencari, dan seni narasi konversi.
          </p>
        </div>

        {/* Vertical Accordion */}
        <div className="space-y-4">
          {allItems.map((item, index) => {
            const isOpen = openIndex === index;
            const Icon = IconMap[item.icon_name as string] || LayoutGrid;

            return (
              <div 
                key={item.id} 
                className={`rounded-[2rem] p-1.5 bg-black/5 dark:bg-white/5 border border-brand-border/80 transition-all duration-300 ${
                  isOpen 
                    ? 'ring-1 ring-teal-accent/20 shadow-md' 
                    : 'hover:border-teal-accent/20'
                }`}
              >
                <div className={`rounded-[calc(2rem-0.375rem)] overflow-hidden transition-all duration-300 ${
                  isOpen 
                    ? 'bg-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]' 
                    : 'bg-white/60 hover:bg-white'
                }`}>
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isOpen ? 'bg-teal-accent/10 text-teal-accent' : 'bg-brand-slate/5 text-text-muted'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`text-lg md:text-xl font-heading-sans font-bold transition-colors ${
                          isOpen ? 'text-teal-accent' : 'text-text-primary'
                        }`}>
                          {item.title}
                        </h3>
                        {item.isTool && (
                          <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider bg-offwhite px-2 py-0.5 rounded border border-brand-border mt-1 inline-block">
                            Utilitas B2B
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                      isOpen ? 'border-teal-accent bg-teal-accent/10 text-teal-accent rotate-180' : 'border-brand-border text-text-muted hover:border-teal-accent'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 border-t border-brand-border/40 ml-4 mr-4 mt-2">
                          <p className="text-sm text-text-muted leading-relaxed mb-6 mt-4">
                            {item.description}
                          </p>
                          
                          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-2">
                              {item.tags?.map((tag: string) => (
                                <span
                                  key={tag}
                                  className="bg-offwhite border border-brand-border text-text-muted font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            {(item as any).cta ? (
                              <Link 
                                href={(item as any).cta.url}
                                className="inline-flex flex-shrink-0 items-center justify-center gap-2 px-5 py-2.5 bg-teal-accent text-brand-slate font-bold rounded-xl hover:bg-teal-accent/90 transition-all text-xs"
                              >
                                {(item as any).cta.text} <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            ) : (
                              <a
                                href="https://wa.me/6282316363177?text=Halo%20Zadit%2C%20saya%20tertarik%20dengan%20layanan%20terkait."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex flex-shrink-0 items-center justify-center gap-2 px-5 py-2.5 border border-teal-accent text-teal-accent font-bold rounded-xl hover:bg-teal-accent/5 transition-all text-xs"
                              >
                                Konsultasi Layanan <ArrowRight className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-12 text-center">
          <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
            Butuh integrasi khusus?{' '}
            <a
              href="https://wa.me/6282316363177"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-accent hover-underline font-semibold"
            >
              Hubungi Arsitek Kami
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}
