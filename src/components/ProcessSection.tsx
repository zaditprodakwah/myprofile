'use client';

import { useEffect, useRef } from 'react';
import { Search, Map, PenTool, Zap, FileText, BarChart3 } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const steps = [
  {
    no: '01',
    title: 'Pemetaan Data & Deteksi Anomali',
    description: 'Kami membedah struktur lalu lintas pencarian audiens Anda, menemukan kebocoran konversi pada corong pemasaran saat ini, dan merumuskan target kata kunci yang relevan.',
    icon: Search,
    color: 'from-teal-accent/20 to-teal-accent/5',
    iconBg: 'bg-teal-accent/10 border-teal-accent/20',
    iconColor: 'text-teal-accent',
  },
  {
    no: '02',
    title: 'Formulasi Arsitektur GTM',
    description: 'Menyusun draf strategi terintegrasi yang menyatukan alokasi konten, rencana pembuatan media digital mandiri, hingga penentuan metrik keberhasilan (KPI) yang terukur.',
    icon: Map,
    color: 'from-blue-500/15 to-blue-500/5',
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    iconColor: 'text-blue-600',
  },
  {
    no: '03',
    title: 'Penulisan Konversi & Otoritas',
    description: 'Menyusun naskah landing page yang persuasif dengan psikologi Nudge, artikel edukasi bebas thin-content, dan rilis pers untuk membangun kepercayaan publik.',
    icon: PenTool,
    color: 'from-violet-500/15 to-violet-500/5',
    iconBg: 'bg-violet-500/10 border-violet-500/20',
    iconColor: 'text-violet-600',
  },
  {
    no: '04',
    title: 'Rekayasa Web Berkinerja Tinggi',
    description: 'Membangun platform Next.js yang bersih, ramah aksesibilitas (A11y 100%), dan super cepat di bawah satu detik (LCP < 1.0s) bahkan pada jaringan seluler 3G.',
    icon: Zap,
    color: 'from-gold-accent/20 to-gold-accent/5',
    iconBg: 'bg-gold-accent/10 border-gold-accent/20',
    iconColor: 'text-gold-accent',
  },
  {
    no: '05',
    title: 'Visualisasi Slide & Dokumen Eksekutif',
    description: 'Menerjemahkan sistem bisnis yang rumit menjadi slide presentasi (PPT/Keynote) visual bernilai tinggi untuk meyakinkan investor, komite, atau direksi.',
    icon: FileText,
    color: 'from-emerald-500/15 to-emerald-500/5',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    iconColor: 'text-emerald-600',
  },
  {
    no: '06',
    title: 'Pemantauan Transparan & Iterasi',
    description: 'Menyajikan dasbor analitik yang mudah dipahami tanpa jargon teknologi rumit, mengevaluasi data interaksi riil, dan terus memoles performa sistem.',
    icon: BarChart3,
    color: 'from-teal-accent/20 to-teal-accent/5',
    iconBg: 'bg-teal-accent/10 border-teal-accent/20',
    iconColor: 'text-teal-accent',
  },
];

export default function ProcessSection() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;

    const initGsap = async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          const mm = gsap.matchMedia();
          mm.add('(min-width: 1024px)', () => {
            const scrollWidth = scrollRef.current?.scrollWidth || 0;
            const viewportWidth = window.innerWidth;
            const xOffset = -(scrollWidth - viewportWidth + 100);

            gsap.to(scrollRef.current, {
              x: xOffset,
              ease: 'none',
              scrollTrigger: {
                trigger: triggerRef.current,
                pin: true,
                scrub: 1.2,
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
    return () => { if (ctx) ctx.revert(); };
  }, []);

  return (
    <div ref={triggerRef} id="process" className="bg-offwhite py-24 border-b border-brand-border overflow-hidden relative">
      {/* Subtle background noise */}
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />

      {/* Section header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-6 mb-14 relative z-10"
      >
        <span className="text-xs font-mono tracking-widest text-gold-accent uppercase">Metodologi</span>
        <h2 className="text-3xl md:text-4xl font-heading-serif font-bold text-text-primary mt-2">
          Metodologi{' '}
          <span className="gradient-text-teal">Pertumbuhan Terpadu</span>
        </h2>
        <p className="text-text-muted mt-3 max-w-xl text-sm leading-relaxed">
          Proses kerja terukur yang dirancang untuk mengamankan kejelasan pesan, kecepatan web, dan konversi maksimal.
        </p>

        {/* Step count indicator */}
        <div className="flex items-center gap-3 mt-5">
          {steps.map((s, i) => (
            <div
              key={s.no}
              className="flex items-center gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-teal-accent/10 border border-teal-accent/20 flex items-center justify-center text-[9px] font-mono font-bold text-teal-accent">
                {s.no}
              </div>
              {i < steps.length - 1 && (
                <div className="w-4 h-px bg-brand-border hidden sm:block" />
              )}
            </div>
          ))}
          <span className="text-[10px] font-mono text-text-muted ml-1 hidden sm:block">
            6 langkah terstruktur
          </span>
        </div>
      </motion.div>

      {/* Horizontal scrolling steps */}
      <div
        className="relative overflow-x-auto lg:overflow-x-visible"
        data-lenis-prevent
        style={{ scrollbarWidth: 'none' }}
      >
        <div
          ref={scrollRef}
          className="flex gap-5 px-6 lg:px-16 w-max pb-8"
        >
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.no}
                className="w-[280px] md:w-[340px] bg-white border border-brand-border rounded-2xl p-7 flex-shrink-0 relative overflow-hidden group hover:border-teal-accent/40 hover:shadow-lg transition-all duration-400 shadow-sm card-hover-lift"
              >
                {/* Gradient top background */}
                <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${step.color} pointer-events-none`} />

                {/* Ghost step number */}
                <span className="absolute -right-3 -top-6 text-8xl font-heading-sans font-extrabold text-brand-slate/[0.035] select-none group-hover:text-teal-accent/[0.06] transition-colors duration-400">
                  {step.no}
                </span>

                <div className="flex flex-col h-full justify-between gap-7 relative z-10">
                  <div>
                    <div className={`w-12 h-12 rounded-xl ${step.iconBg} border flex items-center justify-center ${step.iconColor} mb-5 group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-[9px] font-mono text-gold-accent tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
                      <span className="w-4 h-px bg-gold-accent/60" />
                      Langkah {step.no}
                    </p>
                    <h3 className="text-[1.1rem] font-heading-sans font-bold text-text-primary leading-snug">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-sm text-text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden lg:flex items-center z-20">
                    <div className="w-6 h-px bg-brand-border" />
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-accent/40" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile swipe hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-6 lg:hidden px-6"
      >
        <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
          ← Geser untuk melihat semua 6 langkah →
        </p>
      </motion.div>
    </div>
  );
}
