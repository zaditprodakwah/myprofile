'use client';

import { useState, useRef, useCallback } from 'react';
import * as LucideIcons from 'lucide-react';
import { Service } from '@/lib/types';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ServicesGridProps {
  services: Service[];
}

// Spotlight Card — Bento 2.0 with CSS custom property spotlight
function SpotlightCard({ svc, index }: { svc: Service; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const inView = useInView(cardRef, { once: true, amount: 0.2 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--x', `${e.clientX - left}px`);
    cardRef.current.style.setProperty('--y', `${e.clientY - top}px`);
  }, []);

  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[svc.icon_name] || LucideIcons.Globe;

  // Bento layout variance (Layout Variance 8)
  const colSpan =
    svc.size === 'large' ? 'lg:col-span-8' :
    svc.size === 'full'  ? 'lg:col-span-12' :
    'lg:col-span-4';

  // Stagger delay per card
  const delay = index * 0.08;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bento-card relative bg-white border border-brand-border rounded-[1.75rem] p-8 flex flex-col justify-between gap-6 transition-all duration-400 group ${colSpan}`}
      style={{ '--x': '50%', '--y': '50%' } as React.CSSProperties}
    >
      {/* Subtle top-edge gradient on hover */}
      <div
        className="absolute inset-x-0 top-0 h-px rounded-t-[1.75rem] transition-opacity duration-500 pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          background: 'linear-gradient(to right, transparent, rgba(13,148,136,0.5), transparent)',
        }}
      />

      {/* Card content */}
      <div className="relative z-10 space-y-4">
        {/* Animated icon with floating effect on hover */}
        <motion.div
          animate={isHovered ? { y: -3, scale: 1.05 } : { y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="w-11 h-11 rounded-xl bg-teal-accent/6 border border-teal-accent/12 flex items-center justify-center text-teal-accent group-hover:bg-teal-accent/12 group-hover:border-teal-accent/25 transition-colors duration-300 shadow-sm"
        >
          <Icon className="w-5 h-5" />
        </motion.div>

        <div>
          <h3 className="text-lg font-heading-sans font-bold text-text-primary tracking-tight leading-snug">
            {svc.title}
          </h3>
          <p className="text-sm text-text-muted leading-relaxed mt-2 max-w-2xl">
            {svc.description}
          </p>
        </div>
      </div>

      {/* Footer: tags + CTA arrow */}
      <div className="relative z-10 flex items-end justify-between gap-4 pt-4 border-t border-brand-border/60">
        <div className="flex flex-wrap gap-1.5">
          {svc.tags?.map((tag) => (
            <span
              key={tag}
              className="bg-offwhite border border-brand-border text-text-muted font-mono text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-md transition-colors duration-200 group-hover:border-teal-accent/20 group-hover:text-teal-accent/70"
            >
              {tag}
            </span>
          ))}
        </div>
        {/* Arrow CTA — subtle authority signal */}
        <motion.div
          animate={isHovered ? { x: 3, opacity: 1 } : { x: 0, opacity: 0.3 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-text-muted group-hover:border-teal-accent group-hover:text-teal-accent group-hover:bg-teal-accent/5 transition-colors duration-300"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ServicesGrid({ services }: ServicesGridProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, amount: 0.3 });

  return (
    <section id="services" className="bg-[#f9fafb] py-24 border-b border-brand-border relative">
      {/* Faint section background gradient */}
      <div className="absolute inset-0 grid-bg opacity-35 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 80% 100%, rgba(13,148,136,0.03) 0%, transparent 70%)'
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div>
            <span className="text-xs font-mono tracking-widest text-gold-accent uppercase">
              Keahlian & Layanan Utama
            </span>
            <h2 className="text-3xl md:text-4xl font-heading-serif font-bold text-text-primary mt-2 leading-tight">
              Layanan &{' '}
              <span className="gradient-text-teal">Solusi Terintegrasi</span>
            </h2>
            <p className="text-text-muted mt-3 max-w-xl text-sm leading-relaxed">
              Arsitektur pertumbuhan holistik yang menggabungkan rekayasa kode, riset analitik,
              optimasi mesin pencari, dan seni narasi konversi.
            </p>
          </div>

          {/* Service count badge */}
          <div className="flex-shrink-0">
            <div className="trust-badge text-nowrap">
              <LucideIcons.LayoutGrid className="w-3 h-3" />
              {services?.length || 5} Pilar Layanan
            </div>
          </div>
        </motion.div>

        {/* Bento Grid — Variance 8 asymmetric layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {services?.map((svc, i) => (
            <SpotlightCard key={svc.id || i} svc={svc} index={i} />
          ))}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
            Butuh layanan yang tidak tercantum?{' '}
            <a
              href="https://wa.me/6282316363177?text=Halo%20Zadit%2C%20saya%20ingin%20berdiskusi%20kebutuhan%20khusus."
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-accent hover-underline font-semibold"
            >
              Diskusi langsung dengan Zadit
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
