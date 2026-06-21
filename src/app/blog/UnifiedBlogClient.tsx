'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, BookOpen, CheckSquare, BarChart3, Globe, 
  ArrowRight, Radio, Landmark, Activity, Calendar, Newspaper, ArrowUpRight, 
  TrendingUp, TrendingDown, DollarSign, Clock
} from 'lucide-react';

interface Props {
  initialArticles: any[];
  initialReferences: any[];
}

export default function UnifiedBlogClient({ initialArticles, initialReferences }: Props) {
  const [articles] = useState<any[]>(initialArticles);
  const [references] = useState<any[]>(initialReferences);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'articles' | 'references' | 'telemetry'>('all');
  
  // Telemetry States
  const [fredData, setFredData] = useState<any>(null);
  const [bpsData, setBpsData] = useState<any>(null);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [newsData, setNewsData] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [telemetryLoading, setTelemetryLoading] = useState(true);

  // Tab State inside Telemetry Card
  const [activeWorkstation, setActiveWorkstation] = useState<'macro' | 'markets'>('macro');

  // Pagination states
  const [visibleCount, setVisibleCount] = useState(6);

  // Fetch Telemetries concurrently on client side
  useEffect(() => {
    async function fetchTelemetry() {
      try {
        const [fredRes, bpsRes, marketRes, newsRes, aiInsightRes] = await Promise.all([
          fetch('/api/sovereign/fred').then(r => r.json()).catch(() => null),
          fetch('/api/sovereign/macro-economics').then(r => r.json()).catch(() => null),
          fetch('/api/sovereign/markets').then(r => r.json()).catch(() => null),
          fetch('/api/sovereign/sentiment').then(r => r.json()).catch(() => null),
          fetch('/api/sovereign/ai-insight').then(r => r.json()).catch(() => null)
        ]);

        if (fredRes?.success) setFredData(fredRes.data);
        if (bpsRes?.success) setBpsData(bpsRes.data);
        if (marketRes?.success) setMarketData(marketRes.data);
        if (newsRes?.success) setNewsData(newsRes.data);
        if (aiInsightRes?.success) setAiInsight(aiInsightRes.data);
      } catch (err) {
        console.error('Failed to load telemetry data:', err);
      } finally {
        setTelemetryLoading(false);
      }
    }

    fetchTelemetry();
  }, []);

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
        <div className="bg-brand-slate border border-brand-mid rounded-3xl p-6 md:p-8 text-white space-y-6 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-accent/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-brand-mid/60 pb-4 gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-heading-sans font-bold flex items-center gap-2 text-white">
                <Landmark className="w-5 h-5 text-teal-accent" /> Telemetri Pasar & Makroekonomi
              </h3>
              <p className="text-xs text-text-inverse/60">
                Pusat Kendali Informasi Makro Terintegrasi secara Paralel & Bebas Jargon.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-text-inverse/80 font-mono">
              <span className={`w-1.5 h-1.5 rounded-full ${telemetryLoading ? 'bg-amber-400 animate-pulse' : 'bg-teal-accent'}`} />
              {telemetryLoading ? 'Sinkronisasi...' : 'Sistem Sinkron'}
            </div>
          </div>

          <div className="flex border-b border-white/10 pb-1">
            <button
              onClick={() => setActiveWorkstation('macro')}
              className={`pb-3 pr-6 text-xs font-mono uppercase tracking-wider transition-all relative ${
                activeWorkstation === 'macro' 
                  ? 'text-teal-accent font-bold after:absolute after:bottom-0 after:left-0 after:right-6 after:h-[2px] after:bg-teal-accent' 
                  : 'text-text-inverse/50 hover:text-text-inverse'
              }`}
            >
              Makro & Moneter
            </button>
            <button
              onClick={() => setActiveWorkstation('markets')}
              className={`pb-3 px-6 text-xs font-mono uppercase tracking-wider transition-all relative ${
                activeWorkstation === 'markets' 
                  ? 'text-teal-accent font-bold after:absolute after:bottom-0 after:left-6 after:right-6 after:h-[2px] after:bg-teal-accent' 
                  : 'text-text-inverse/50 hover:text-text-inverse'
              }`}
            >
              Aset Digital & Valuta Asing
            </button>
          </div>

          {aiInsight && (
            <div className="bg-gradient-to-r from-teal-accent/15 to-teal-accent/5 border border-teal-accent/30 rounded-2xl p-5 space-y-1.5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-accent/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-teal-accent uppercase tracking-wider font-bold">
                <Radio className="w-3.5 h-3.5 text-teal-accent animate-pulse" /> AI Macro & Business Outlook
              </div>
              <p className="text-xs md:text-sm text-text-inverse/90 leading-relaxed font-sans italic font-medium">
                "{aiInsight}"
              </p>
            </div>
          )}

          {activeWorkstation === 'macro' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-brand-mid/40 border border-white/5 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono text-text-inverse/40 uppercase tracking-wider">
                    <span>PDB Riil Indonesia (BPS)</span>
                    {renderChange(0.04)}
                  </div>
                  <div className="text-3xl font-black text-white">
                    {telemetryLoading ? '...' : (bpsData?.gdpGrowth ? bpsData.gdpGrowth : '5.05%')}
                  </div>
                </div>
                <p className="text-[11px] text-text-inverse/70 leading-relaxed pt-2 border-t border-white/5">
                  <span className="font-bold text-teal-accent">Dampak Pertumbuhan:</span> Menunjukkan kestabilan daya beli konsumen lokal untuk produk SaaS dan platform digital regional.
                </p>
              </div>

              <div className="bg-brand-mid/40 border border-white/5 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono text-text-inverse/40 uppercase tracking-wider">
                    <span>Inflasi Tahunan (BPS)</span>
                    {renderChange(-0.15)}
                  </div>
                  <div className="text-3xl font-black text-white">
                    {telemetryLoading ? '...' : (bpsData?.inflationRate ? bpsData.inflationRate : '2.75%')}
                  </div>
                </div>
                <p className="text-[11px] text-text-inverse/70 leading-relaxed pt-2 border-t border-white/5">
                  <span className="font-bold text-teal-accent">Dampak Stabilitas:</span> Inflasi yang stabil menekan biaya modal dan memastikan prediktabilitas operasional bisnis.
                </p>
              </div>

              <div className="bg-brand-mid/40 border border-white/5 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono text-text-inverse/40 uppercase tracking-wider">
                    <span>BI Rate (Suku Bunga BI)</span>
                    {renderChange(0.00)}
                  </div>
                  <div className="text-3xl font-black text-white">
                    {telemetryLoading ? '...' : (bpsData?.biRate ? bpsData.biRate : '6.25%')}
                  </div>
                </div>
                <p className="text-[11px] text-text-inverse/70 leading-relaxed pt-2 border-t border-white/5">
                  <span className="font-bold text-teal-accent">Dampak Moneter:</span> Jangkar likuiditas perbankan nasional yang mempengaruhi pembiayaan startup.
                </p>
              </div>

              <div className="bg-brand-mid/40 border border-white/5 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-mono text-text-inverse/40 uppercase tracking-wider">
                    <span>Fed Funds Rate (The Fed)</span>
                    {renderChange(0.00)}
                  </div>
                  <div className="text-3xl font-black text-white">
                    {telemetryLoading ? '...' : (bpsData?.fedRate || (fredData?.value ? `${fredData.value}%` : '5.25%'))}
                  </div>
                </div>
                <p className="text-[11px] text-text-inverse/70 leading-relaxed pt-2 border-t border-white/5">
                  <span className="font-bold text-teal-accent">Dampak Global:</span> Mempengaruhi kekuatan rupiah dan arus investasi langsung eksternal.
                </p>
              </div>
            </div>
          )}

          {activeWorkstation === 'markets' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-text-inverse/40 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-teal-accent" /> Valuta Asing & Rupiah
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {telemetryLoading ? (
                    <div className="col-span-full text-center py-6 text-xs text-text-inverse/40 font-mono">Memuat...</div>
                  ) : (
                    marketData.filter(m => m.symbol.includes('/IDR')).map((fx, idx) => (
                      <div key={idx} className="bg-brand-mid/40 border border-white/5 rounded-2xl p-4 space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-mono text-text-inverse/40">
                          <span>{fx.symbol}</span>
                          {renderChange(fx.change || 0)}
                        </div>
                        <div className="text-xl font-black text-white">
                          {formatPrice(fx.symbol, fx.price)}
                        </div>
                        <p className="text-[9px] text-text-inverse/60 leading-relaxed pt-1.5 border-t border-white/5">
                          {fx.impact}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono text-text-inverse/40 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-accent" /> Aset Kripto & Komoditas Digital
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {telemetryLoading ? (
                    <div className="col-span-full text-center py-6 text-xs text-text-inverse/40 font-mono">Memuat...</div>
                  ) : (
                    marketData.filter(m => m.symbol.includes('/USD')).map((coin, idx) => (
                      <div key={idx} className="bg-brand-mid/40 border border-white/5 rounded-2xl p-4 space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-mono text-text-inverse/40">
                          <span>{coin.symbol}</span>
                          {renderChange(coin.change || 0)}
                        </div>
                        <div className="text-lg font-black text-white">
                          {formatPrice(coin.symbol, coin.price)}
                        </div>
                        <p className="text-[9px] text-text-inverse/60 leading-relaxed pt-1.5 border-t border-white/5">
                          {coin.impact}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {newsData.length > 0 && (
            <div className="pt-6 border-t border-brand-mid/40 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-text-inverse/50 uppercase tracking-wider">
                <Radio className="w-3.5 h-3.5 text-teal-accent animate-pulse" /> Sentimen Makroekonomi & AI Insight Bisnis
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {newsData.slice(0, 6).map((art, i) => (
                  <a 
                    key={i} 
                    href={art.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-brand-mid/50 border border-white/5 p-4 rounded-xl hover:bg-brand-mid hover:border-teal-accent transition-all duration-300 block space-y-2 group"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] font-mono bg-teal-accent/20 text-teal-accent px-2 py-0.5 rounded-full border border-teal-accent/20 uppercase font-semibold">
                        {art.badge}
                      </span>
                      <span className="text-[8px] font-mono text-text-inverse/40">{art.source}</span>
                    </div>
                    <h4 className="text-xs font-bold leading-snug group-hover:text-teal-accent transition-colors flex items-center justify-between gap-2">
                      {art.title} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </h4>
                    <p className="text-[10px] text-text-inverse/60 line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
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
                className="bg-white border border-brand-border rounded-2xl p-6 md:p-8 hover:border-teal-accent hover:shadow-md transition-all duration-300 flex flex-col justify-between group h-64 shadow-xs"
              >
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
                  
                  <h3 className="text-lg md:text-xl font-heading-sans font-bold text-text-primary group-hover:text-teal-accent transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
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
