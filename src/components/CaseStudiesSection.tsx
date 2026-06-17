'use client';

import { useEffect, useRef, useState } from 'react';
import { CaseStudy } from '@/lib/types';
import { motion, useInView } from 'framer-motion';
import { Quote, ExternalLink, TrendingUp } from 'lucide-react';

interface CaseStudiesSectionProps {
  caseStudies: CaseStudy[];
}

// Client logo mapping — real brand signals for EEAT
const CLIENT_META: Record<string, { color: string; domain?: string }> = {
  'layanan publik': { color: '#0d9488' }, // teal
  'teknologi pertanian': { color: '#d97706' }, // gold
};

// Single case study card
function CaseStudyCard({
  cs,
  index,
  inView,
}: {
  cs: CaseStudy;
  index: number;
  inView: boolean;
}) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const cardRef = useRef<HTMLDivElement>(null);
  const cardInView = useInView(cardRef, { once: true, amount: 0.15 });

  // Tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    card.style.transform = `perspective(1200px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateZ(6px)`;
    card.style.boxShadow = `${x * -20}px ${y * -20}px 40px rgba(13,148,136,0.05), 0 20px 40px -10px rgba(15,23,42,0.06)`;
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg) translateZ(0)';
    e.currentTarget.style.boxShadow = '';
  };

  // Counter animation on view
  useEffect(() => {
    if (!cardInView || !cs.metrics) return;
    cs.metrics.forEach((m, idx) => {
      const target = m.number || 0;
      if (!target) return;
      const duration = 1300;
      const start = performance.now();
      const key = `${cs.id}-${idx}`;
      const run = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const e = 1 - Math.pow(1 - p, 3);
        setCounts(prev => ({ ...prev, [key]: Math.round(e * target) }));
        if (p < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    });
  }, [cardInView, cs]);

  const clientKey = cs.client_name?.toLowerCase() ?? '';
  const meta = Object.entries(CLIENT_META).find(([k]) => clientKey.includes(k));
  const brandColor = meta?.[1].color ?? '#0d9488';
  const brandDomain = meta?.[1].domain;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-white border border-brand-border rounded-2xl p-8 lg:p-10 transition-all duration-300 transform-style-3d cursor-default shadow-sm relative overflow-hidden group"
    >
      {/* Left accent bar — brand color */}
      <div
        className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full opacity-70"
        style={{ background: brandColor }}
      />

      {/* Subtle hover gradient background */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 0% 50%, ${brandColor}08 0%, transparent 70%)`
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">

        {/* LEFT: Text & content */}
        <div className="lg:col-span-8 space-y-5">

          {/* Header row: badge + domain link */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <span
              className="inline-block font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-full border font-semibold"
              style={{ color: brandColor, borderColor: `${brandColor}40`, background: `${brandColor}0d` }}
            >
              {cs.sector_badge}
            </span>
            {brandDomain && (
              <a
                href={`https://${brandDomain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] font-mono text-text-muted hover:text-teal-accent transition-colors"
              >
                {brandDomain}
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>

          <div>
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">Klien / Proyek</p>
            <h3 className="text-2xl md:text-[1.7rem] font-heading-sans font-bold text-text-primary leading-tight">
              {cs.client_name}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            <div className="space-y-1.5">
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-gold-accent" />
                Tantangan Utama
              </p>
              <p className="text-sm text-text-muted leading-relaxed">{cs.challenge}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-teal-accent" />
                Pendekatan & Implementasi
              </p>
              <p className="text-sm text-text-muted leading-relaxed">{cs.approach}</p>
            </div>
          </div>

          {/* Testimonial quote block */}
          {cs.testimonial_text && (
            <div className="bg-offwhite border border-brand-border rounded-xl p-5 mt-2 relative">
              <Quote className="absolute top-4 right-4 w-5 h-5 text-teal-accent/20" />
              <p className="text-sm md:text-base font-heading-serif text-text-primary italic leading-relaxed pr-8">
                &ldquo;{cs.testimonial_text}&rdquo;
              </p>
              <div className="mt-3 font-sans text-xs flex items-center gap-2 pt-3 border-t border-brand-border/50">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                  style={{ background: brandColor }}
                >
                  {cs.testimonial_author?.charAt(0) ?? 'Z'}
                </div>
                <div>
                  <p className="font-bold text-text-primary">{cs.testimonial_author}</p>
                  <p className="text-text-muted">{cs.testimonial_role}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Metrics */}
        <div className="lg:col-span-4 flex flex-col gap-3 self-stretch">
          {cs.metrics?.map((m, idx) => {
            const key = `${cs.id}-${idx}`;
            const rawVal = m.value || '';
            const prefix = rawVal.match(/^[^\d]+/)?.[0] || '';
            const suffix = rawVal.match(/[^\d]+$/)?.[0] || '';

            return (
              <div
                key={idx}
                className="bg-offwhite border border-brand-border rounded-xl p-5 flex flex-col items-center justify-center text-center flex-1 min-h-[120px] relative overflow-hidden group/metric transition-all duration-300 hover:border-teal-accent/30"
              >
                <TrendingUp className="absolute top-3 right-3 w-3.5 h-3.5 text-teal-accent/20 group-hover/metric:text-teal-accent/40 transition-colors" />
                <p className="text-[9px] font-mono text-text-muted uppercase tracking-widest mb-2">
                  Hasil Terukur
                </p>
                <p className="text-4xl font-heading-sans font-extrabold text-gold-accent metric-counter glow-gold leading-none">
                  {prefix}
                  {counts[key] !== undefined ? counts[key] : (m.number || 0)}
                  {suffix}
                </p>
                <p className="text-[9px] text-text-muted uppercase font-mono tracking-wider mt-2 leading-normal">
                  {m.label}
                </p>
              </div>
            );
          })}

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 mt-2 justify-center">
            {cs.tech_tags?.map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-mono text-text-muted border border-brand-border bg-white px-2.5 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CaseStudiesSection({ caseStudies }: CaseStudiesSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section ref={sectionRef} id="case-studies" className="bg-alabaster py-24 border-b border-brand-border relative">
      {/* Atmospheric background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 60% at 10% 80%, rgba(217,119,6,0.025) 0%, transparent 70%)'
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div>
            <span className="text-xs font-mono tracking-widest text-gold-accent uppercase">
              Studi Kasus Kemitraan
            </span>
            <h2 className="text-3xl md:text-4xl font-heading-serif font-bold text-text-primary mt-2">
              Bukti Nyata{' '}
              <span className="gradient-text-gold">Hasil Terukur</span>
            </h2>
            <p className="text-text-muted mt-3 max-w-xl text-sm leading-relaxed">
              Bagaimana arsitektur pertumbuhan terintegrasi membantu menyederhanakan data
              kompleks dan melipatgandakan dampak konversi.
            </p>
          </div>

          {/* Authority signal */}
          <div className="flex-shrink-0 flex flex-col items-end gap-2">
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Sektor Keahlian</p>
            <div className="flex items-center gap-2">
              {['Sektor Publik', 'Agritech', 'B2B Eksekutif'].map((domain) => (
                <div
                  key={domain}
                  className="bg-white border border-brand-border rounded-lg px-2.5 py-1.5 text-[9px] font-mono text-text-muted shadow-xs"
                >
                  {domain}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Cards stack */}
        <div className="space-y-8">
          {caseStudies?.map((cs, i) => (
            <CaseStudyCard key={cs.id} cs={cs} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
