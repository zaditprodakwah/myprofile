'use client';

import React, { useState, useEffect } from 'react';
import { Landmark, Radio, DollarSign, Activity, ArrowUpRight } from 'lucide-react';

export default function MarketTelemetryBlock() {
  // Telemetry States
  const [fredData, setFredData] = useState<any>(null);
  const [bpsData, setBpsData] = useState<any>(null);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [newsData, setNewsData] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [telemetryLoading, setTelemetryLoading] = useState(true);

  // Tab State
  const [activeWorkstation, setActiveWorkstation] = useState<'macro' | 'markets'>('macro');

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

  return (
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
            <Radio className="w-3.5 h-3.5 text-teal-accent animate-pulse" /> Analisis & Outlook Bisnis
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
            <Radio className="w-3.5 h-3.5 text-teal-accent animate-pulse" /> Sentimen Pasar & Insight Bisnis
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
  );
}
