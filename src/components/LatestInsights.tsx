'use client';

import { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Article } from '@/lib/types';
import { ArrowRight, Clock, ChevronRight } from 'lucide-react';

interface LatestInsightsProps {
  articles: Article[];
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const inView = useInView(cardRef, { once: true, amount: 0.2 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--x', `${e.clientX - left}px`);
    cardRef.current.style.setProperty('--y', `${e.clientY - top}px`);
  }, []);

  const dateStr = article.published_at 
    ? new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Baru Saja';

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bento-card relative bg-white border border-brand-border rounded-[1.75rem] p-6 flex flex-col justify-between gap-6 transition-all duration-400 group lg:col-span-4"
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

      <div className="relative z-10 space-y-4 flex-1">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-text-muted uppercase tracking-wider">
            <Clock className="w-3 h-3 text-teal-accent" />
            {dateStr}
          </div>
          <span className="bg-brand-slate text-alabaster text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full">
            Blog
          </span>
        </div>

        <div>
          <h3 className="text-lg font-heading-serif font-bold text-text-primary tracking-tight leading-snug group-hover:text-teal-accent transition-colors duration-300 line-clamp-3">
            {article.title}
          </h3>
          <p className="text-sm text-text-muted leading-relaxed mt-2 line-clamp-3">
            {article.meta_description || 'Baca wawasan terbaru kami mengenai optimasi dan arsitektur digital.'}
          </p>
        </div>
      </div>

      <div className="relative z-10 pt-4 border-t border-brand-border/60 mt-auto">
        <Link href={`/blog/${article.slug}`} className="inline-flex items-center gap-1.5 text-xs font-heading-sans font-bold text-teal-accent hover:text-brand-slate transition-colors group/link uppercase tracking-wider">
          Baca Selengkapnya
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function LatestInsights({ articles }: LatestInsightsProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, amount: 0.3 });

  if (!articles || articles.length === 0) return null;

  return (
    <section id="insights" className="bg-white py-24 border-b border-brand-border relative">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div>
            <span className="text-xs font-mono tracking-widest text-teal-accent uppercase">
              Wawasan & Riset Terbaru
            </span>
            <h2 className="text-3xl md:text-4xl font-heading-serif font-bold text-text-primary mt-2 leading-tight">
              Latest <span className="gradient-text-teal">Insights</span>
            </h2>
            <p className="text-text-muted mt-3 max-w-xl text-sm leading-relaxed">
              Tulisan, opini teknikal, dan studi kasus terbaru seputar optimasi performa web, narasi bisnis, dan rekayasa SEO.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link href="/blog" className="inline-flex items-center gap-2 bg-offwhite hover:bg-teal-accent/5 border border-brand-border hover:border-teal-accent/30 text-text-primary hover:text-teal-accent font-heading-sans font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-sm">
              Lihat Semua Artikel
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
          {articles.map((article, i) => (
            <ArticleCard key={article.id || i} article={article} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
