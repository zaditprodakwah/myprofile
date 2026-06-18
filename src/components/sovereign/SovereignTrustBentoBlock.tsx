'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingUp, Landmark, Activity, Database, Leaf, Globe, Radio, AlertTriangle, FileJson } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function SovereignTrustBentoBlock() {
  const [cyberData, setCyberData] = useState<any[] | null>(null);
  const [macroData, setMacroData] = useState<any | null>(null);
  const [fiscalData, setFiscalData] = useState<any | null>(null);
  const [drData, setDrData] = useState<any | null>(null);
  const [marketData, setMarketData] = useState<any[] | null>(null);
  const [fredData, setFredData] = useState<any | null>(null);
  const [sentimentData, setSentimentData] = useState<any[] | null>(null);
  const [esgData, setEsgData] = useState<any | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [cyber, macro, fiscal, dr, markets, fred, sentiment, esg] = await Promise.all([
          fetch('/api/sovereign/cyber-security').then(res => res.json()),
          fetch('/api/sovereign/macro-economics').then(res => res.json()),
          fetch('/api/sovereign/fiscal-data').then(res => res.json()),
          fetch('/api/sovereign/datarakyat').then(res => res.json()),
          fetch('/api/sovereign/markets').then(res => res.json()),
          fetch('/api/sovereign/fred').then(res => res.json()),
          fetch('/api/sovereign/sentiment').then(res => res.json()),
          fetch('/api/sovereign/esg').then(res => res.json())
        ]);

        if (cyber.success) setCyberData(cyber.data);
        if (macro.success) setMacroData(macro.data);
        if (fiscal.success) setFiscalData(fiscal.data);
        if (dr.success) setDrData(dr.data);
        if (markets.success) setMarketData(markets.data);
        if (fred.success) setFredData(fred.data);
        if (sentiment.success) setSentimentData(sentiment.data);
        if (esg.success) setEsgData(esg.data);
      } catch (err) {
        console.error('Failed to fetch sovereign data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const rawJsonPayload = JSON.stringify({
    macro: macroData,
    fiscal: fiscalData,
    civic: drData
  }, null, 2);

  const glassPanel = "bg-[#0f172a]/90 backdrop-blur-md border border-white/10 shadow-2xl rounded-3xl p-6 relative overflow-hidden group text-white";

  return (
    <div className="@container w-full my-12 bg-black rounded-3xl p-6 md:p-10 border border-white/5">
      <div className="mb-8 space-y-2">
        <h2 className="text-2xl md:text-4xl font-heading-sans font-black text-white tracking-tight flex items-center gap-3">
          <Database className="w-8 h-8 text-indigo-400" /> Sovereign Telemetry Engine
        </h2>
        <p className="text-sm md:text-base text-slate-400 max-w-2xl">
          Zero-Mock Open Data Platform. Integrasi 10+ streams instansi publik & market global dengan arsitektur Edge SWR dan CLS 0.
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]"
      >
        {/* Cell A: National Macro & Fiscal (2x2) */}
        <motion.div variants={itemVariants} className={`md:col-span-2 md:row-span-2 perspective-1000`}>
          <motion.div 
            className="w-full h-full relative preserve-3d transition-transform duration-700"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front Side */}
            <div className={`${glassPanel} absolute inset-0 backface-hidden w-full h-full flex flex-col justify-between`} style={{ backfaceVisibility: 'hidden' }}>
              {isLoading ? (
                <div className="animate-pulse space-y-6 w-full h-full">
                  <div className="h-6 bg-slate-800 rounded w-1/3"></div>
                  <div className="h-32 bg-slate-800 rounded w-full"></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-20 bg-slate-800 rounded"></div>
                    <div className="h-20 bg-slate-800 rounded"></div>
                    <div className="h-20 bg-slate-800 rounded"></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold flex items-center gap-2"><Landmark className="w-5 h-5 text-emerald-400"/> Makro & Fiskal Nasional</h3>
                      <p className="text-xs text-slate-400 mt-1">Agregasi APBN, Pertumbuhan PDB, dan Proyek Infrastruktur</p>
                    </div>
                    <button 
                      onClick={() => setIsFlipped(true)}
                      className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full flex items-center gap-2 transition-colors"
                    >
                      <FileJson className="w-3 h-3" /> Lihat Raw JSON
                    </button>
                  </div>

                  <div className="flex-1 my-6 relative bg-gradient-to-t from-emerald-500/10 to-transparent rounded-xl border border-emerald-500/20 p-4 flex items-end">
                    {/* Simulated Area Chart Visual */}
                    <svg className="w-full h-32" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <path d="M0,30 Q20,10 40,20 T80,5 T100,15 L100,30 L0,30 Z" fill="rgba(52, 211, 153, 0.2)" stroke="rgba(52, 211, 153, 0.8)" strokeWidth="1" />
                    </svg>
                    <div className="absolute top-4 left-4">
                      <div className="text-3xl font-black">{macroData?.gdpGrowth || 'N/A'}</div>
                      <div className="text-xs font-mono text-emerald-400">PDB Growth</div>
                    </div>
                    <div className="absolute top-4 right-4 text-right">
                      <div className="text-xl font-bold">{fiscalData?.allocationAmount || 'N/A'}</div>
                      <div className="text-xs font-mono text-emerald-400">Alokasi Fiskal Komdigi</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Inflasi</div>
                      <div className="text-lg font-bold">{macroData?.inflationRate}</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">DataRakyat.id</div>
                      <div className="text-lg font-bold">{drData?.civicProjects} Proyek</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Status API</div>
                      <div className={`text-xs font-bold mt-1 px-2 py-1 rounded-md inline-block ${macroData?.isFresh ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {macroData?.isFresh ? 'LIVE SYNC' : 'FALLBACK LOCK'}
                      </div>
                    </div>
                  </div>

                  <p className="text-[9px] text-slate-500 mt-4 uppercase tracking-widest">{macroData?.attribution || 'Layanan ini menggunakan API Badan Pusat Statistik (BPS)'}</p>
                </>
              )}
            </div>

            {/* Back Side (JSON) */}
            <div className={`${glassPanel} absolute inset-0 w-full h-full flex flex-col`} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                <h3 className="text-sm font-mono font-bold text-emerald-400">raw_data_stream.json</h3>
                <button 
                  onClick={() => setIsFlipped(false)}
                  className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  Kembali ke UI
                </button>
              </div>
              <pre className="text-[10px] md:text-xs font-mono text-slate-300 overflow-auto flex-1 custom-scrollbar">
                {rawJsonPayload}
              </pre>
            </div>
          </motion.div>
        </motion.div>

        {/* Cell C: Policy Sentiment (1x2) */}
        <motion.div variants={itemVariants} className={`${glassPanel} md:col-span-1 md:row-span-2 flex flex-col`}>
          <div className="flex items-center gap-2 mb-6">
            <Radio className="w-5 h-5 text-blue-400 animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Policy Sentiment</h3>
          </div>

          {isLoading ? (
            <div className="space-y-4 flex-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-white/5 p-4 rounded-xl border border-white/5 h-24"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-auto custom-scrollbar pr-2">
              {sentimentData?.map((article, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedArticle(article)}
                  className="bg-white/5 hover:bg-white/10 cursor-pointer transition-colors p-4 rounded-xl border border-white/10 group-hover:border-white/20"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider">{article.source}</span>
                    {/* Neon Badges */}
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shadow-[0_0_10px_rgba(0,0,0,0.5)] ${
                      article.badge === 'Risk' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-amber-500/20' : 
                      article.badge === 'Positive' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-emerald-500/20' :
                      'bg-zinc-500/20 border-zinc-500/50 text-zinc-400 shadow-zinc-500/20'
                    }`}>
                      {article.badge}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold leading-snug line-clamp-2">{article.title}</h4>
                </div>
              ))}
            </div>
          )}
          
          {/* ESG Telemetry Mini Widget */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400">
              <Leaf className="w-4 h-4" />
              <span className="text-[10px] font-mono">SWD ESG Core</span>
            </div>
            {isLoading ? <div className="w-16 h-4 bg-slate-800 rounded animate-pulse"></div> : (
              <span className="text-[10px] font-mono text-slate-300">{esgData?.carbonGrams || '0.000'} gCO₂</span>
            )}
          </div>
        </motion.div>

        {/* Cell B: Global Liquidity Marquee (3x1 or full width bottom) */}
        <motion.div variants={itemVariants} className={`${glassPanel} md:col-span-3 !p-0 flex items-center`}>
          <div className="bg-blue-600/20 border-r border-blue-500/30 px-6 py-4 flex items-center gap-2 whitespace-nowrap z-10 shrink-0">
            <Globe className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-100">Global Markets</span>
          </div>
          
          <div className="flex-1 overflow-hidden group/marquee relative h-full flex items-center">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0f172a] to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0f172a] to-transparent z-10"></div>
            
            {isLoading ? (
              <div className="animate-pulse flex gap-8 px-6">
                <div className="w-32 h-6 bg-slate-800 rounded"></div>
                <div className="w-32 h-6 bg-slate-800 rounded"></div>
                <div className="w-32 h-6 bg-slate-800 rounded"></div>
              </div>
            ) : (
              <div className="flex gap-8 px-8 animate-marquee group-hover/marquee:[animation-play-state:paused] whitespace-nowrap">
                {/* FRED Data */}
                <div className="group/tooltip relative flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">{fredData?.indexName}</span>
                  <span className="text-sm font-bold text-white">{fredData?.value}%</span>
                  <span className="text-[10px] bg-slate-800 px-2 rounded">FRED</span>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-black border border-slate-800 rounded-xl text-[10px] text-slate-300 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50">
                    Suku bunga bank sentral global mendikte arus modal asing ke obligasi lokal.
                  </div>
                </div>

                {/* Market Data */}
                {marketData?.map((m, i) => (
                  <div key={i} className="group/tooltip relative flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400">{m.symbol}</span>
                    <span className="text-sm font-bold text-white">{m.price}</span>
                    <span className={`text-[10px] font-bold ${m.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {m.change >= 0 ? '+' : ''}{m.change}
                    </span>
                    <span className="text-[10px] bg-slate-800 px-2 rounded">{m.source}</span>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-black border border-slate-800 rounded-xl text-[10px] text-slate-300 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 whitespace-normal">
                      {m.impact}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Drawer Modal for Article */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-[#0f172a] border-t border-white/10 rounded-t-3xl p-8 max-w-4xl mx-auto w-full max-h-[80vh] overflow-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`inline-block text-[10px] font-bold px-3 py-1 rounded-full mb-3 border ${
                      selectedArticle.badge === 'Risk' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 
                      selectedArticle.badge === 'Positive' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
                      'bg-zinc-500/20 border-zinc-500/50 text-zinc-400'
                    }`}>
                    {selectedArticle.badge} • AI Summarized
                  </span>
                  <h2 className="text-2xl font-bold text-white">{selectedArticle.title}</h2>
                  <p className="text-xs text-slate-400 mt-2">Source: {selectedArticle.source}</p>
                </div>
                <button onClick={() => setSelectedArticle(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-slate-300 leading-relaxed text-base">{selectedArticle.summary}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Required style for marquee animation and 3D */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05); 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2); 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3); 
        }
      `}} />
    </div>
  );
}
