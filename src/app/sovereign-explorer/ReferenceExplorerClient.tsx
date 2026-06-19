'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ReferenceItem } from '@/lib/types';
import { 
  Search, BookOpen, CheckSquare, BarChart3, Globe, 
  ArrowRight, Radio, Landmark, Activity, Calendar, Newspaper, ArrowUpRight 
} from 'lucide-react';

interface Props {
  initialItems: ReferenceItem[];
}

export default function ReferenceExplorerClient({ initialItems }: Props) {
  const [items] = useState<ReferenceItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | ReferenceItem['category']>('all');
  
  // Telemetry States
  const [fredData, setFredData] = useState<any>(null);
  const [bpsData, setBpsData] = useState<any>(null);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [newsData, setNewsData] = useState<any[]>([]);
  const [telemetryLoading, setTelemetryLoading] = useState(true);

  // Fetch Telemetries concurrently on client side to keep page load speed lightning fast
  useEffect(() => {
    async function fetchTelemetry() {
      try {
        const [fredRes, bpsRes, marketRes, newsRes] = await Promise.all([
          fetch('/api/sovereign/fred').then(r => r.json()).catch(() => null),
          fetch('/api/sovereign/macro-economics').then(r => r.json()).catch(() => null),
          fetch('/api/sovereign/markets').then(r => r.json()).catch(() => null),
          fetch('/api/sovereign/news').then(r => r.json()).catch(() => null)
        ]);

        if (fredRes?.success) setFredData(fredRes.data);
        if (bpsRes?.success) setBpsData(bpsRes.data);
        if (marketRes?.success) setMarketData(marketRes.data);
        if (newsRes?.success) setNewsData(newsRes.data);
      } catch (err) {
        console.error('Failed to load telemetry data:', err);
      } finally {
        setTelemetryLoading(false);
      }
    }

    fetchTelemetry();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: ReferenceItem['category']) => {
    switch (category) {
      case 'growth-playbook':
        return <BookOpen className="w-4 h-4 text-teal-accent" />;
      case 'seo-checklist':
        return <CheckSquare className="w-4 h-4 text-emerald-500" />;
      case 'market-benchmark':
        return <BarChart3 className="w-4 h-4 text-gold-accent" />;
      case 'civic-data':
        return <Globe className="w-4 h-4 text-blue-500" />;
    }
  };

  const getCategoryLabel = (category: ReferenceItem['category']) => {
    switch (category) {
      case 'growth-playbook': return 'Growth Playbook';
      case 'seo-checklist': return 'SEO Checklist';
      case 'market-benchmark': return 'Market Benchmark';
      case 'civic-data': return 'Civic Data';
    }
  };

  return (
    <div className="space-y-12">
      
      {/* Search & Category Filter Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white border border-brand-border rounded-2xl p-4 shadow-sm">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {(['all', 'growth-playbook', 'seo-checklist', 'market-benchmark', 'civic-data'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-brand-slate text-white font-bold shadow-sm'
                  : 'text-text-muted hover:bg-offwhite hover:text-text-primary'
              }`}
            >
              {cat === 'all' ? 'Semua' : getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-text-muted/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari referensi atau tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-offwhite border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary focus:ring-1 focus:ring-teal-accent outline-none"
          />
        </div>

      </div>

      {/* Grid: Reference Bank Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <Link
            key={item.slug}
            href={`/sovereign-explorer/${item.slug}`}
            className="bg-white border border-brand-border rounded-2xl p-6 md:p-8 hover:border-teal-accent hover:shadow-md transition-all duration-300 flex flex-col justify-between group h-64 shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono bg-offwhite px-2.5 py-1 rounded-full border border-brand-border text-text-primary uppercase">
                  {getCategoryIcon(item.category)}
                  {getCategoryLabel(item.category)}
                </span>
                {item.source_name && (
                  <span className="text-[9px] font-mono text-text-muted">{item.source_name}</span>
                )}
              </div>
              
              <h3 className="text-lg md:text-xl font-heading-sans font-bold text-text-primary group-hover:text-teal-accent transition-colors leading-snug">
                {item.title}
              </h3>
              
              <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                {item.summary}
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-brand-border mt-4">
              <div className="flex gap-1.5 overflow-hidden">
                {item.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[9px] font-mono bg-alabaster px-2 py-0.5 rounded text-text-muted">
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="text-xs font-semibold text-teal-accent group-hover:underline flex items-center gap-1 shrink-0">
                Akses Playbook <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full bg-white border border-brand-border rounded-2xl p-12 text-center text-text-muted text-sm">
            Tidak menemukan artikel referensi yang cocok dengan kriteria Anda.
          </div>
        )}
      </div>

      {/* Section 2: Live Market Intelligence Panel */}
      <div className="bg-brand-slate border border-brand-mid rounded-3xl p-6 md:p-8 text-white space-y-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-accent/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-brand-mid/60 pb-4 gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-heading-sans font-bold flex items-center gap-2 text-white">
              <Landmark className="w-5 h-5 text-teal-accent" /> Telemetri Pasar & Makroekonomi
            </h3>
            <p className="text-xs text-text-inverse/60">
              Arsitektur database cache terhubung dengan FRED, BPS, dan Exchange Rates.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-text-inverse/80 font-mono">
            <span className={`w-1.5 h-1.5 rounded-full ${telemetryLoading ? 'bg-amber-400 animate-pulse' : 'bg-teal-accent'}`} />
            {telemetryLoading ? 'Sinkronisasi...' : 'Cache Terhubung (SSL)'}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          
          {/* Card 1: USD/IDR Rate */}
          <div className="bg-brand-mid border border-white/5 rounded-2xl p-4 space-y-2 relative">
            <div className="text-[10px] font-mono text-text-inverse/40 uppercase tracking-wider">Nilai Tukar Rupiah</div>
            <div className="text-2xl font-black text-white">
              {telemetryLoading ? '...' : (marketData.find(m => m.symbol === 'USD/IDR')?.price ? `Rp ${Number(marketData.find(m => m.symbol === 'USD/IDR')?.price).toLocaleString('id-ID')}` : 'Rp 16.350')}
            </div>
            <div className="text-[10px] font-mono text-text-inverse/50 flex justify-between">
              <span>Source: {marketData.find(m => m.symbol === 'USD/IDR')?.source || 'Exchange Rate'}</span>
              <span className="text-teal-accent">Real-time FX</span>
            </div>
          </div>

          {/* Card 2: Federal Funds Rate */}
          <div className="bg-brand-mid border border-white/5 rounded-2xl p-4 space-y-2">
            <div className="text-[10px] font-mono text-text-inverse/40 uppercase tracking-wider">Fed Funds Rate (AS)</div>
            <div className="text-2xl font-black text-emerald-400">
              {telemetryLoading ? '...' : (fredData?.value ? `${fredData.value}%` : '4.50%')}
            </div>
            <div className="text-[10px] font-mono text-text-inverse/50 flex justify-between">
              <span>Source: FRED St. Louis</span>
              <span>Updated: {fredData?.date || '2026'}</span>
            </div>
          </div>

          {/* Card 3: BPS GDP Growth */}
          <div className="bg-brand-mid border border-white/5 rounded-2xl p-4 space-y-2">
            <div className="text-[10px] font-mono text-text-inverse/40 uppercase tracking-wider">Pertumbuhan PDB RI</div>
            <div className="text-2xl font-black text-teal-accent">
              {telemetryLoading ? '...' : (bpsData?.gdpGrowth ? bpsData.gdpGrowth : '5.05%')}
            </div>
            <div className="text-[10px] font-mono text-text-inverse/50 flex justify-between">
              <span>Source: BPS Indonesia</span>
              <span>Period: {bpsData?.period || 'Q4 2025'}</span>
            </div>
          </div>

        </div>

        {/* Dynamic News / Business Sentiment Ticker */}
        {newsData.length > 0 && (
          <div className="pt-4 border-t border-brand-mid/40 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-text-inverse/50 uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 text-teal-accent animate-pulse" /> Sentimen & Berita AI Bisnis Lokal
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newsData.slice(0, 2).map((art, i) => (
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

    </div>
  );
}
