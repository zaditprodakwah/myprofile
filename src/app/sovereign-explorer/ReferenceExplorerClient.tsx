'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ReferenceItem } from '@/lib/types';
import { 
  Search, BookOpen, CheckSquare, BarChart3, Globe, 
  ArrowRight, Radio, Landmark, Activity, Calendar, Newspaper, ArrowUpRight, 
  TrendingUp, TrendingDown, DollarSign
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

  // Tab State for Workstation
  const [activeWorkstation, setActiveWorkstation] = useState<'macro' | 'markets'>('macro');

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

  // Format Market Prices Nicely
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

  // Render Change Percentages
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

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-brand-mid/60 pb-4 gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-heading-sans font-bold flex items-center gap-2 text-white">
              <Landmark className="w-5 h-5 text-teal-accent" /> Telemetri Pasar & Makroekonomi
            </h3>
            <p className="text-xs text-text-inverse/60">
              Sinkronisasi data multi-sumber (FRED, BPS, Exchange Rates, & CoinGecko) dengan arsitektur cache database.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-text-inverse/80 font-mono">
            <span className={`w-1.5 h-1.5 rounded-full ${telemetryLoading ? 'bg-amber-400 animate-pulse' : 'bg-teal-accent'}`} />
            {telemetryLoading ? 'Sinkronisasi...' : 'Cache Terhubung (SSL)'}
          </div>
        </div>

        {/* Workstation Tab Switcher */}
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
            Pasar Keuangan & Aset Digital
          </button>
        </div>

        {/* Tab Content 1: Makroekonomi & Moneter */}
        {activeWorkstation === 'macro' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Pertumbuhan PDB RI */}
            <div className="bg-brand-mid/40 border border-white/5 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-text-inverse/40 uppercase tracking-wider">
                  <span>PDB Rill Indonesia</span>
                  {renderChange(0.04)}
                </div>
                <div className="text-3xl font-black text-white">
                  {telemetryLoading ? '...' : (bpsData?.gdpGrowth ? bpsData.gdpGrowth : '5.05%')}
                </div>
              </div>
              <p className="text-[11px] text-text-inverse/70 leading-relaxed pt-2 border-t border-white/5 font-sans">
                <span className="font-bold text-teal-accent">Dampak Margin:</span> PDB mengukur ekspansi ekonomi riil. Pertumbuhan stabil di atas 5% menopang daya beli konsumen domestik untuk produk SaaS/digital, memperbesar potensi pendapatan lokal.
              </p>
            </div>

            {/* Inflasi Tahunan RI */}
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
              <p className="text-[11px] text-text-inverse/70 leading-relaxed pt-2 border-t border-white/5 font-sans">
                <span className="font-bold text-teal-accent">Dampak Margin:</span> Inflasi terkendali di bawah 3% mempertahankan stabilitas pengeluaran operasional perusahaan dan menekan tekanan kenaikan upah talenta pengembang lokal.
              </p>
            </div>

            {/* Suku Bunga BI Rate */}
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
              <p className="text-[11px] text-text-inverse/70 leading-relaxed pt-2 border-t border-white/5 font-sans">
                <span className="font-bold text-teal-accent">Dampak Margin:</span> Mengukur biaya modal perbankan domestik. Suku bunga tinggi membatasi likuiditas kredit, sehingga startup dituntut mengedepankan profitabilitas operasional rill.
              </p>
            </div>

            {/* Fed Funds Rate AS */}
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
              <p className="text-[11px] text-text-inverse/70 leading-relaxed pt-2 border-t border-white/5 font-sans">
                <span className="font-bold text-teal-accent">Dampak Margin:</span> Menjadi jangkar modal global. FFR tinggi memicu arus keluar valas (capital flight), menekan nilai rupiah, dan membatasi pendanaan asing langsung ke venture capital lokal.
              </p>
            </div>

          </div>
        )}

        {/* Tab Content 2: Pasar Keuangan & Aset Digital */}
        {activeWorkstation === 'markets' && (
          <div className="space-y-6">
            
            {/* Currencies & FX Rates Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono text-text-inverse/40 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-teal-accent" /> Valuta Asing & Nilai Tukar Rupiah
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {telemetryLoading ? (
                  <div className="col-span-full text-center py-6 text-xs text-text-inverse/40 font-mono">Memuat telemetri valuta asing...</div>
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
                      <p className="text-[9px] text-text-inverse/60 font-sans leading-relaxed pt-1.5 border-t border-white/5">
                        {fx.impact}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Cryptocurrencies Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono text-text-inverse/40 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-accent" /> Aset Kripto & Komoditas Digital
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {telemetryLoading ? (
                  <div className="col-span-full text-center py-6 text-xs text-text-inverse/40 font-mono">Memuat telemetri aset kripto...</div>
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
                      <p className="text-[9px] text-text-inverse/60 font-sans leading-relaxed pt-1.5 border-t border-white/5">
                        {coin.impact}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* Dynamic News / Business Sentiment Grid (Expanded to 6 Articles in 3-Columns) */}
        {newsData.length > 0 && (
          <div className="pt-6 border-t border-brand-mid/40 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-text-inverse/50 uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 text-teal-accent animate-pulse" /> Sentimen & Berita AI Bisnis Lokal
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

    </div>
  );
}
