'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, BookOpen, CheckSquare, BarChart3, Globe, 
  ArrowRight, Radio, Clock
} from 'lucide-react';
import MarketTelemetryBlock from '@/components/MarketTelemetryBlock';

interface Props {
  initialArticles: any[];
  initialReferences: any[];
}

export default function UnifiedBlogClient({ initialArticles, initialReferences }: Props) {
  const [articles] = useState<any[]>(initialArticles);
  const [references] = useState<any[]>(initialReferences);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'articles' | 'references' | 'telemetry'>('all');

  // Pagination states
  const [visibleCount, setVisibleCount] = useState(6);

  const getReferenceIcon = (category: string) => {
    switch (category) {
      case 'growth-playbook':
        return <BookOpen className="w-3.5 h-3.5 text-teal-accent" />;
      case 'seo-checklist':
        return <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />;
      case 'market-benchmark':
        return <BarChart3 className="w-3.5 h-3.5 text-gold-accent" />;
      case 'civic-data':
        return <Globe className="w-3.5 h-3.5 text-blue-500" />;
      default:
        return <BookOpen className="w-3.5 h-3.5 text-teal-accent" />;
    }
  };

  const getReferenceLabel = (category: string) => {
    switch (category) {
      case 'growth-playbook': return 'Playbook Pertumbuhan';
      case 'seo-checklist': return 'SEO Checklist';
      case 'market-benchmark': return 'Market Benchmark';
      case 'civic-data': return 'Civic Data';
      default: return 'Referensi Bisnis';
    }
  };

  const formatPrice = (symbol: string, price: number) => {
    if (symbol.includes('/USD')) {
      return `$${Number(price).toLocaleString('en-US', { 
        minimumFractionDigits: symbol === 'XRP/USD' ? 4 : 0, 
        maximumFractionDigits: 4 
      })}`;
    }
    return `Rp ${Number(price).toLocaleString('id-ID', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 2 
    })}`;
  };

  const renderChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`inline-flex items-center gap-0.5 text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
        isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
      }`}>
        {isPositive ? '▲' : '▼'} {Math.abs(change)}%
      </span>
    );
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Juni 2026';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return 'Juni 2026';
    }
  };

  // Combine items to list in unified feed
  // Map articles and references to have a common structure
  const mappedArticles = articles.map(art => ({
    id: art.slug,
    type: 'article',
    category: 'insight',
    title: art.title,
    summary: art.meta_description || art.content?.replace(/<[^>]*>?/gm, ' ').substring(0, 160) + '...',
    publishedAt: art.published_at,
    slug: art.slug,
    tags: art.semantic_keywords || ['Growth', 'SEO'],
    url: `/blog/${art.slug}`,
    icon: <Radio className="w-3.5 h-3.5 text-teal-accent" />,
    label: 'Artikel AI & Wawasan'
  }));

  const mappedReferences = references.map(ref => ({
    id: ref.slug,
    type: 'reference',
    category: ref.category,
    title: ref.title,
    summary: ref.summary,
    publishedAt: ref.created_at,
    slug: ref.slug,
    tags: ref.tags || ['Reference', 'Strategy'],
    url: `/blog/${ref.slug}`,
    icon: getReferenceIcon(ref.category),
    label: getReferenceLabel(ref.category)
  }));

  // Combine and sort by date desc
  const allItems = [...mappedArticles, ...mappedReferences].sort((a, b) => {
    const dateA = new Date(a.publishedAt || 0).getTime();
    const dateB = new Date(b.publishedAt || 0).getTime();
    return dateB - dateA;
  });

  // Filter based on active tab & query
  const filteredItems = allItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'articles' && item.type === 'article') || 
      (activeTab === 'references' && item.type === 'reference');

    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-12">
      
      {/* 1. Live Market Intelligence Panel - Bento Style Dashboard */}
      {(activeTab === 'all' || activeTab === 'telemetry') && (
        <MarketTelemetryBlock />
      )}

      {/* 2. Workspace Controls (Filters & Search) */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white border border-brand-border rounded-2xl p-4 shadow-xs">
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {(['all', 'articles', 'references', 'telemetry'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setVisibleCount(6);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? 'bg-brand-slate text-white font-bold shadow-xs'
                  : 'text-text-muted hover:bg-offwhite hover:text-text-primary'
              }`}
            >
              {tab === 'all' ? 'Semua Feed' : 
               tab === 'articles' ? 'Artikel Insight' : 
               tab === 'references' ? 'Checklist & Playbook' : 'Dashboard Telemetri'}
            </button>
          ))}
        </div>

        {activeTab !== 'telemetry' && (
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-text-muted/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari artikel, playbook, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-offwhite border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary focus:ring-1 focus:ring-teal-accent outline-none"
            />
          </div>
        )}
      </div>

      {/* 3. Combined Content Feed */}
      {activeTab !== 'telemetry' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.slice(0, visibleCount).map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="block outline-none"
              >
                <article 
                  itemScope 
                  itemType="https://schema.org/BlogPosting"
                  className="bg-white border border-brand-border rounded-2xl p-6 md:p-8 hover:border-teal-accent hover:shadow-md transition-all duration-300 flex flex-col justify-between group h-64 shadow-xs"
                >
                  <meta itemProp="datePublished" content={item.publishedAt || ''} />
                  <meta itemProp="url" content={`https://presenceos.zadit.id${item.url}`} />
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono bg-offwhite px-2.5 py-1 rounded-full border border-brand-border text-text-primary uppercase">
                        {item.icon}
                        {item.label}
                      </span>
                      <span className="text-[9px] font-mono text-text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3 text-teal-accent" /> {formatDate(item.publishedAt)}
                      </span>
                    </div>
                    
                    <h3 itemProp="headline" className="text-lg md:text-xl font-heading-sans font-bold text-text-primary group-hover:text-teal-accent transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    
                    <p itemProp="description" className="text-xs text-text-muted leading-relaxed line-clamp-2">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-brand-border mt-4">
                    <div className="flex gap-1.5 overflow-hidden">
                      {item.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[9px] font-mono bg-alabaster px-2 py-0.5 rounded text-text-muted border border-brand-border/30">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-teal-accent group-hover:underline flex items-center gap-1 shrink-0">
                      Akses Konten <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </article>
              </Link>
            ))}

            {filteredItems.length === 0 && (
              <div className="col-span-full bg-white border border-brand-border rounded-2xl p-12 text-center text-text-muted text-sm shadow-xs">
                Tidak ada artikel atau referensi yang cocok dengan filter pencarian Anda.
              </div>
            )}
          </div>

          {/* Load More Button */}
          {filteredItems.length > visibleCount && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setVisibleCount(prev => prev + 6)}
                className="px-6 py-3 bg-white border border-brand-border text-text-primary text-xs font-mono rounded-xl hover:border-teal-accent hover:text-teal-accent transition-all duration-300 font-bold cursor-pointer shadow-xs"
              >
                Muat Artikel Lainnya
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
