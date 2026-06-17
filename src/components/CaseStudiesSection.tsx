'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface CaseStudy {
  id: string;
  badge: string;
  title: string;
  challenge: string;
  approach: string;
  metric: { value: number; label: string; prefix?: string; suffix?: string };
  testimonial: { quote: string; author: string; role: string };
  tags: string[];
}

const cases: CaseStudy[] = [
  {
    id: 'public-sector',
    badge: 'Sektor Publik & Kemitraan Pemerintah',
    title: 'Aliansi Pengembangan Komunitas & Layanan Publik Regional',
    challenge: 'Situs web lambat, tidak responsif di wilayah pelosok, dan ketergantungan tinggi pada media pihak ketiga.',
    approach: 'Implementasi arsitektur Next.js ISR (Incremental Static Regeneration), optimasi Core Web Vitals (sub-second load), dan entity graph linking untuk AEO/SEO.',
    metric: { value: 148, label: 'Keterbacaan Google Organik', prefix: '+', suffix: '%' },
    testimonial: {
      quote: "Arsitektur digital yang dibangun Zadit membuat masyarakat di pelosok daerah dapat mengakses layanan informasi publik kami dalam hitungan milidetik.",
      author: "Dr. Ir. H. Hermawan",
      role: "Penasihat Kebijakan Publik Regional"
    },
    tags: ['Next.js ISR', 'SEO Teknikal', 'Aksesibilitas WCAG']
  },
  {
    id: 'agritech-pitch',
    badge: 'Dokumentasi Eksekutif & Swasta',
    title: 'Pitch Deck & Strategi Kampanye Pendanaan Agritech 2026',
    challenge: 'Penyampaian value proposition teknologi pertanian yang terlalu kompleks ke calon investor institusional.',
    approach: 'Penyusunan ulang brand narrative, visualisasi data berbasis matematika, dan pembuatan ringkasan eksekutif 1-halaman (one-pager) yang siap dipahami.',
    metric: { value: 34, label: 'Pertumbuhan Nilai Kampanye', prefix: '+', suffix: 'Miliar' },
    testimonial: {
      quote: "Zadit berhasil mendistilasi model matematika algoritma kami ke dalam slide yang sangat mudah dipahami. Hasilnya, presentasi kami memicu minat kolaborasi yang konkret.",
      author: "Marcus Thorne",
      role: "VP of Technology & Human Dynamics"
    },
    tags: ['Pitch Deck Design', 'Brand Strategy', 'Data Visualization']
  }
];

export default function CaseStudiesSection() {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    cases.forEach((c) => {
      const target = c.metric.value;
      const duration = 1500; // 1.5s
      const start = performance.now();

      const run = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        
        setCounts((prev) => ({
          ...prev,
          [c.id]: Math.round(ease * target),
        }));

        if (progress < 1) {
          requestAnimationFrame(run);
        }
      };

      requestAnimationFrame(run);
    });
  }, [inView]);

  // Handle CSS 3D Tilt Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const card = e.currentTarget;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    card.style.transform = `
      perspective(1000px)
      rotateY(${x * 8}deg)
      rotateX(${-y * 8}deg)
      translateZ(4px)
    `;
    card.style.boxShadow = `
      ${x * -15}px ${y * -15}px 30px rgba(13, 148, 136, 0.08),
      0 10px 25px -5px rgba(0, 0, 0, 0.3)
    `;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
    card.style.boxShadow = 'none';
  };

  return (
    <section ref={sectionRef} id="case-studies" className="bg-brand-slate py-24 border-b border-brand-border/40 relative">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-16">
          <span className="text-xs font-mono tracking-widest text-gold-accent uppercase">// STUDI KASUS</span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-text-inverse mt-2">
            Bukti Nyata Hasil Terukur
          </h2>
          <p className="text-text-muted mt-4 max-w-xl">
            Bagaimana arsitektur pertumbuhan terintegrasi membantu menyederhanakan data kompleks dan melipatgandakan dampak konversi.
          </p>
        </div>

        {/* Case Studies Stack/Grid */}
        <div className="space-y-12">
          {cases.map((cs) => (
            <div
              key={cs.id}
              onMouseMove={(e) => handleMouseMove(e, cs.id)}
              onMouseLeave={handleMouseLeave}
              className="bg-brand-mid/40 border border-brand-border rounded-2xl p-8 lg:p-12 transition-all duration-300 transform-style-3d cursor-default"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Text & Content Info (Left) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Category Badge */}
                  <span className="inline-block bg-brand-border/60 border border-brand-border text-gold-accent font-mono text-[10px] tracking-wider uppercase px-3 py-1 rounded-full">
                    {cs.badge}
                  </span>

                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-text-inverse leading-tight">
                    {cs.title}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div>
                      <p className="text-xs font-mono text-text-muted uppercase tracking-wider">// TANTANGAN</p>
                      <p className="text-sm text-text-muted mt-1 leading-relaxed">{cs.challenge}</p>
                    </div>
                    <div>
                      <p className="text-xs font-mono text-text-muted uppercase tracking-wider">// PENDEKATAN</p>
                      <p className="text-sm text-text-muted mt-1 leading-relaxed">{cs.approach}</p>
                    </div>
                  </div>

                  {/* Testimonial Quote */}
                  <div className="bg-brand-slate/50 border-l-4 border-teal-accent rounded-r-xl p-5 mt-4">
                    <p className="text-sm md:text-base text-text-inverse italic leading-relaxed">
                      "{cs.testimonial.quote}"
                    </p>
                    <div className="mt-3 font-sans text-xs">
                      <p className="font-bold text-text-inverse">{cs.testimonial.author}</p>
                      <p className="text-text-muted">{cs.testimonial.role}</p>
                    </div>
                  </div>

                </div>

                {/* Big Metric Box (Right) */}
                <div className="lg:col-span-4 bg-brand-slate/60 border border-brand-border/40 rounded-xl p-8 flex flex-col items-center justify-center text-center self-stretch min-h-[200px]">
                  <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">Hasil Terukur</p>
                  <p className="text-5xl lg:text-6xl font-heading font-extrabold text-teal-accent">
                    {cs.metric.prefix}
                    {counts[cs.id] || 0}
                    {cs.metric.suffix}
                  </p>
                  <p className="text-xs text-text-muted uppercase font-mono tracking-wider mt-4 leading-normal max-w-[180px]">
                    {cs.metric.label}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-8 justify-center">
                    {cs.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-mono text-text-muted border border-brand-border/60 px-2 py-0.5 rounded">
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
