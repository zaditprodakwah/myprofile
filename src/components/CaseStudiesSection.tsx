'use client';

import { useEffect, useRef, useState } from 'react';
import { CaseStudy } from '@/lib/types';

interface CaseStudiesSectionProps {
  caseStudies: CaseStudy[];
}

export default function CaseStudiesSection({ caseStudies }: CaseStudiesSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !caseStudies) return;

    caseStudies.forEach((cs) => {
      if (!cs.metrics) return;
      cs.metrics.forEach((m, idx) => {
        const target = m.number || 0;
        const duration = 1200; // 1.2s
        const start = performance.now();
        const key = `${cs.id}-${idx}`;

        const run = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
          
          setCounts((prev) => ({
            ...prev,
            [key]: Math.round(ease * target),
          }));

          if (progress < 1) {
            requestAnimationFrame(run);
          }
        };

        requestAnimationFrame(run);
      });
    });
  }, [inView, caseStudies]);

  // Handle CSS 3D Tilt Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    card.style.transform = `
      perspective(1000px)
      rotateY(${x * 6}deg)
      rotateX(${-y * 6}deg)
      translateZ(4px)
    `;
    card.style.boxShadow = `
      ${x * -15}px ${y * -15}px 30px rgba(13, 148, 136, 0.04),
      0 10px 25px -5px rgba(0, 0, 0, 0.05)
    `;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
    card.style.boxShadow = 'none';
  };

  return (
    <section ref={sectionRef} id="case-studies" className="bg-alabaster py-24 border-b border-brand-border relative">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-16">
          <span className="text-xs font-mono tracking-widest text-gold-accent uppercase">{'// STUDI KASUS'}</span>
          <h2 className="text-3xl md:text-4xl font-heading-serif font-bold text-text-primary mt-2">
            Bukti Nyata Hasil Terukur
          </h2>
          <p className="text-text-muted mt-4 max-w-xl">
            Bagaimana arsitektur pertumbuhan terintegrasi membantu menyederhanakan data kompleks dan melipatgandakan dampak konversi.
          </p>
        </div>

        {/* Case Studies Stack/Grid */}
        <div className="space-y-12">
          {caseStudies && caseStudies.map((cs) => (
            <div
              key={cs.id}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="bg-white border border-brand-border rounded-2xl p-8 lg:p-12 transition-all duration-300 transform-style-3d cursor-default shadow-sm"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Text & Content Info (Left) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Category Badge */}
                  <span className="inline-block bg-gold-accent/10 border border-gold-accent/25 text-gold-accent font-mono text-[10px] tracking-wider uppercase px-3 py-1 rounded-full">
                    {cs.sector_badge}
                  </span>

                  <h3 className="text-2xl md:text-3xl font-heading-sans font-bold text-text-primary leading-tight">
                    {cs.client_name}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div>
                      <p className="text-xs font-mono text-text-muted uppercase tracking-wider">{'// TANTANGAN'}</p>
                      <p className="text-sm text-text-muted mt-1 leading-relaxed">{cs.challenge}</p>
                    </div>
                    <div>
                      <p className="text-xs font-mono text-text-muted uppercase tracking-wider">{'// PENDEKATAN'}</p>
                      <p className="text-sm text-text-muted mt-1 leading-relaxed">{cs.approach}</p>
                    </div>
                  </div>

                  {/* Testimonial Quote */}
                  {cs.testimonial_text && (
                    <div className="bg-offwhite border-l-4 border-teal-accent rounded-r-xl p-5 mt-4">
                      <p className="text-sm md:text-base font-heading-serif text-text-primary italic leading-relaxed">
                        &ldquo;{cs.testimonial_text}&rdquo;
                      </p>
                      <div className="mt-3 font-sans text-xs">
                        <p className="font-bold text-text-primary">{cs.testimonial_author}</p>
                        <p className="text-text-muted">{cs.testimonial_role}</p>
                      </div>
                    </div>
                  )}

                </div>

                {/* Big Metric Box (Right) */}
                <div className="lg:col-span-4 flex flex-col gap-4 self-stretch justify-between">
                  {cs.metrics && cs.metrics.map((m, idx) => {
                    const key = `${cs.id}-${idx}`;
                    // Extract non-digit prefixes/suffixes from value
                    const rawVal = m.value || '';
                    const prefix = rawVal.match(/^[^\d]+/)?.[0] || '';
                    const suffix = rawVal.match(/[^\d]+$/)?.[0] || '';
                    
                    return (
                      <div key={idx} className="bg-offwhite border border-brand-border rounded-xl p-6 flex flex-col items-center justify-center text-center flex-1 min-h-[120px]">
                        <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">Hasil Terukur</p>
                        <p className="text-4xl font-heading-sans font-extrabold text-gold-accent">
                          {prefix}
                          {counts[key] !== undefined ? counts[key] : (m.number || 0)}
                          {suffix}
                        </p>
                        <p className="text-[10px] text-text-muted uppercase font-mono tracking-wider mt-2 leading-normal">
                          {m.label}
                        </p>
                      </div>
                    );
                  })}

                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {cs.tech_tags && cs.tech_tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-mono text-text-muted border border-brand-border bg-white px-2.5 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
