'use client';

import { useEffect, useRef } from 'react';
import { Search, Map, PenTool, Zap, FileText, BarChart3 } from 'lucide-react';

const steps = [
  {
    no: '01',
    title: 'Pemetaan Data & Diagnosis',
    description: 'Audit menyeluruh performa digital, analisis gap kompetitor, dan pemetaan kebocoran konversi.',
    icon: Search,
  },
  {
    no: '02',
    title: 'Arsitektur Strategi GTM',
    description: 'Penyusunan blueprint konten, pemetaan kata kunci (keyword map), dan rancangan corong konversi.',
    icon: Map,
  },
  {
    no: '03',
    title: 'Penulisan & Copy Konversi',
    description: 'Menyusun naskah penjualan (copywriting) berbasis psikologi konsumen dan SEO/AEO-ready copy.',
    icon: PenTool,
  },
  {
    no: '04',
    title: 'Rekayasa Web Performa Tinggi',
    description: 'Implementasi teknis web Next.js dengan optimasi sub-second load time, LCP < 1.0s, dan A11y 100%.',
    icon: Zap,
  },
  {
    no: '05',
    title: 'Dokumentasi Eksekutif',
    description: 'Pembuatan pitch deck investor, proposal kemitraan strategis, dan KOL campaign brief terstruktur.',
    icon: FileText,
  },
  {
    no: '06',
    title: 'Optimasi & Iterasi Berkelanjutan',
    description: 'Review analitik secara berkala, A/B testing sistematis, dan pemeliharaan mesin konten AI.',
    icon: BarChart3,
  },
];

export default function ProcessSection() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const initGsap = async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          // Only animate on desktop screens (min-width: 1024px)
          const mm = gsap.matchMedia();
          
          mm.add("(min-width: 1024px)", () => {
            const scrollWidth = scrollRef.current?.scrollWidth || 0;
            const viewportWidth = window.innerWidth;
            // Provide a margin of 100px at the end
            const xOffset = -(scrollWidth - viewportWidth + 100);

            gsap.to(scrollRef.current, {
              x: xOffset,
              ease: 'none',
              scrollTrigger: {
                trigger: triggerRef.current,
                pin: true,
                scrub: 1,
                start: 'top top',
                end: () => `+=${scrollWidth}`,
                invalidateOnRefresh: true,
              },
            });
          });
        }, triggerRef);
      } catch (err) {
        console.error('GSAP Initialization failed', err);
      }
    };

    initGsap();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <div ref={triggerRef} id="process" className="bg-offwhite py-24 border-b border-brand-border overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-16 lg:mb-12">
        <span className="text-xs font-mono tracking-widest text-gold-accent uppercase">{'// FRAMEWORK KERJA'}</span>
        <h2 className="text-3xl md:text-4xl font-heading-serif font-bold text-text-primary mt-2">
          Metodologi Pertumbuhan Terpadu
        </h2>
        <p className="text-text-muted mt-4 max-w-xl">
          Pendekatan sistematis langkah-demi-langkah untuk mengubah data digital menjadi konversi dan otoritas pasar yang defensif.
        </p>
      </div>

      {/* Steps Container */}
      <div className="relative overflow-x-auto lg:overflow-x-visible scrollbar-hide" data-lenis-prevent style={{ scrollbarWidth: 'none' }}>
        <div 
          ref={scrollRef} 
          className="flex gap-6 px-6 lg:px-24 w-max lg:flex-nowrap pb-8"
        >
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.no} 
                className="w-[290px] md:w-[360px] bg-white border border-brand-border rounded-2xl p-8 flex-shrink-0 relative overflow-hidden group hover:border-teal-accent hover:shadow-lg transition-all duration-300 shadow-sm"
              >
                {/* Large Background Step Number */}
                <span className="absolute -right-4 -top-8 text-8xl font-heading-sans font-extrabold text-brand-slate/[0.03] select-none group-hover:text-teal-accent/[0.05] transition-colors duration-300">
                  {step.no}
                </span>

                <div className="flex flex-col h-full justify-between gap-8 relative z-10">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-teal-accent/10 border border-teal-accent/20 flex items-center justify-center text-teal-accent mb-6">
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <p className="text-xs font-mono text-gold-accent tracking-wider uppercase mb-2">Langkah {step.no}</p>
                    <h3 className="text-xl font-heading-sans font-bold text-text-primary">{step.title}</h3>
                  </div>

                  <p className="text-sm text-text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Swipe/Scroll Help Indicator */}
      <div className="text-center mt-8 lg:hidden">
        <p className="text-xs font-mono text-text-muted uppercase tracking-wider">Swipe ke samping untuk melihat lebih banyak →</p>
      </div>
    </div>
  );
}
