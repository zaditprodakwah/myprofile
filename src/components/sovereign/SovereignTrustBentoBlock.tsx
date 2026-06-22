'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Shield, TrendingUp, Landmark, Activity, Database, Leaf, Globe, Radio, AlertTriangle, FileJson } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants: Variants = {
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
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/sovereign/aggregate');
        const json = await res.json();

        if (json.success && json.data) {
          const d = json.data;
          if (d.cyber) setCyberData(d.cyber);
          if (d.macro) setMacroData(d.macro);
          if (d.fiscal) setFiscalData(d.fiscal);
          if (d.dr) setDrData(d.dr);
          if (d.markets) setMarketData(d.markets);
          if (d.fred) setFredData(d.fred);
          if (d.sentiment) setSentimentData(d.sentiment);
          if (d.esg) setEsgData(d.esg);
        } else {
          setConnectionError(true);
        }
      } catch (err) {
        console.error('Failed to fetch sovereign data:', err);
        setConnectionError(true);
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

  const glassPanel = "bg-white border border-brand-border shadow-xs rounded-3xl p-6 relative overflow-hidden group text-text-primary";

  return (
    <div className="@container w-full my-12 bg-alabaster rounded-3xl p-6 md:p-10 border border-brand-border">
      <div className="mb-8 space-y-2 relative">
        <span className="text-xs font-mono tracking-widest text-teal-accent uppercase block">
          {'// Insight Keputusan Strategis'}
        </span>
        <h2 className="text-2xl md:text-4xl font-heading-sans font-bold text-text-primary tracking-tight flex items-center gap-3">
          <Database className="w-8 h-8 text-teal-accent" /> Telemetri Pasar & Makroekonomi
        </h2>
        <p className="text-sm md:text-base text-text-muted max-w-2xl">
          Pemantauan indikator makroekonomi, kebijakan moneter, dan sentimen pasar yang disinkronkan secara real-time untuk mendukung keputusan strategis B2B Anda.
        </p>

        <AnimatePresence>
          {connectionError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="absolute top-0 right-0 bg-red-500/20 border border-red-500/50 text-red-400 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Koneksi Offline (Menggunakan Cache)
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]"
      >
        {/* Cell A: National Macro & Fiscal (2x2) */}
        <motion.div variants={itemVariants} className={`md:col-span-2 md:row-span-2`}>
          <div className="w-full h-full relative">
            <div className={`${glassPanel} w-full h-full flex flex-col justify-between bg-white`}>
              {isLoading ? (
                <div className="animate-pulse space-y-6 w-full h-full">
                  <div className="h-6 bg-offwhite rounded w-1/3"></div>
                  <div className="h-32 bg-offwhite rounded w-full"></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-20 bg-offwhite rounded"></div>
                    <div className="h-20 bg-offwhite rounded"></div>
                    <div className="h-20 bg-offwhite rounded"></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold flex items-center gap-2"><Landmark className="w-5 h-5 text-teal-accent"/> Makro & Fiskal Nasional</h3>
                      <p className="text-xs text-text-muted mt-1">Agregasi APBN, Pertumbuhan PDB, dan Proyek Infrastruktur</p>
                    </div>
                  </div>

                  <div className="flex-1 my-6 relative bg-teal-accent/5 rounded-xl border border-teal-accent/20 p-4 flex items-end">
                    {/* Simulated Area Chart Visual */}
                    <svg className="w-full h-32" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <path d="M0,30 Q20,10 40,20 T80,5 T100,15 L100,30 L0,30 Z" fill="rgba(13, 148, 136, 0.1)" stroke="rgba(13, 148, 136, 0.4)" strokeWidth="1" />
                    </svg>
                    <div className="absolute top-4 left-4">
                      <div className="text-3xl font-black text-text-primary">{macroData?.gdpGrowth || 'N/A'}</div>
                      <div className="text-xs font-mono text-teal-accent font-bold">PDB Growth</div>
                    </div>
                    <div className="absolute top-4 right-4 text-right">
                      <div className="text-xl font-bold text-text-primary">{fiscalData?.allocationAmount || 'N/A'}</div>
                      <div className="text-xs font-mono text-teal-accent font-bold">Alokasi Fiskal Komdigi</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-offwhite p-3 rounded-xl border border-brand-border">
                      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1 font-mono">Inflasi</div>
                      <div className="text-lg font-bold text-text-primary">{macroData?.inflationRate}</div>
                    </div>
                    <div className="bg-offwhite p-3 rounded-xl border border-brand-border">
                      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1 font-mono">DataRakyat.id</div>
                      <div className="text-lg font-bold text-text-primary">{drData?.civicProjects} Proyek</div>
                    </div>
                    <div className="bg-offwhite p-3 rounded-xl border border-brand-border">
                      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1 font-mono">Status API</div>
                      <div className={`text-xs font-bold mt-1 px-2 py-1 rounded-md inline-block ${macroData?.isFresh ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                        {macroData?.isFresh ? 'LIVE SYNC' : 'FALLBACK'}
                      </div>
                    </div>
                  </div>

                  <p className="text-[9px] text-text-muted/60 mt-4 uppercase tracking-widest">{macroData?.attribution || 'Layanan ini menggunakan API Badan Pusat Statistik (BPS)'}</p>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Cell C: Policy Sentiment (1x2) */}
        <motion.div variants={itemVariants} className={`${glassPanel} md:col-span-1 md:row-span-2 flex flex-col bg-white`}>
          <div className="flex items-center gap-2 mb-6">
            <Radio className="w-5 h-5 text-teal-accent animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary">Sentimen Kebijakan</h3>
          </div>

          {isLoading ? (
            <div className="space-y-4 flex-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-offwhite p-4 rounded-xl border border-brand-border h-24"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-auto custom-scrollbar pr-2">
              {sentimentData?.map((article, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedArticle(article)}
                  className="bg-offwhite hover:bg-brand-mid/50 cursor-pointer transition-colors p-4 rounded-xl border border-brand-border group-hover:border-brand-mid"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] text-text-muted uppercase tracking-wider">{article.source}</span>
                    {/* Minimal Badges */}
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      article.badge === 'Risk' ? 'bg-amber-50 border-amber-200 text-amber-700' : 
                      article.badge === 'Positive' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                      'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                      {article.badge}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold leading-snug line-clamp-2 text-text-primary">{article.title}</h4>
                </div>
              ))}
            </div>
          )}
          
          {/* ESG Telemetry Mini Widget */}
          <div className="mt-4 pt-4 border-t border-brand-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-teal-accent">
              <Leaf className="w-4 h-4" />
              <span className="text-[10px] font-mono font-bold">SWD ESG Core</span>
            </div>
            {isLoading ? <div className="w-16 h-4 bg-offwhite rounded animate-pulse"></div> : (
              <span className="text-[10px] font-mono text-text-muted">{esgData?.carbonGrams || '0.000'} gCO₂</span>
            )}
          </div>
        </motion.div>

        {/* Cell B: Global Liquidity Marquee (3x1 or full width bottom) */}
        <motion.div variants={itemVariants} className={`${glassPanel} md:col-span-3 !p-0 flex items-center bg-white`}>
          <div className="bg-teal-accent/5 border-r border-brand-border px-6 py-4 flex items-center gap-2 whitespace-nowrap z-10 shrink-0">
            <Globe className="w-5 h-5 text-teal-accent" />
            <span className="text-xs font-bold uppercase tracking-widest text-text-primary">Pasar Global</span>
          </div>
          
          <div className="flex-1 overflow-hidden group/marquee relative h-full flex items-center">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10"></div>
            
            {isLoading ? (
              <div className="animate-pulse flex gap-8 px-6">
                <div className="w-32 h-6 bg-offwhite rounded"></div>
                <div className="w-32 h-6 bg-offwhite rounded"></div>
                <div className="w-32 h-6 bg-offwhite rounded"></div>
              </div>
            ) : (
              <div className="flex gap-8 px-8 animate-marquee group-hover/marquee:[animation-play-state:paused] whitespace-nowrap">
                {/* FRED Data */}
                <div className="group/tooltip relative flex items-center gap-3">
                  <span className="text-xs font-mono text-text-muted">{fredData?.indexName}</span>
                  <span className="text-sm font-bold text-text-primary">{fredData?.value}%</span>
                  <span className="text-[10px] bg-offwhite border border-brand-border px-2 rounded font-mono text-text-muted">FRED</span>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-white border border-brand-border shadow-lg rounded-xl text-[10px] text-text-muted opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50">
                    Suku bunga bank sentral global mendikte arus modal asing ke obligasi lokal.
                  </div>
                </div>

                {/* Market Data */}
                {marketData?.map((m, i) => (
                  <div key={i} className="group/tooltip relative flex items-center gap-3">
                    <span className="text-xs font-mono text-text-muted">{m.symbol}</span>
                    <span className="text-sm font-bold text-text-primary">{m.price}</span>
                    <span className={`text-[10px] font-bold ${m.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {m.change >= 0 ? '+' : ''}{m.change}
                    </span>
                    <span className="text-[10px] bg-offwhite border border-brand-border px-2 rounded font-mono text-text-muted">{m.source}</span>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-white border border-brand-border shadow-lg rounded-xl text-[10px] text-text-muted opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 whitespace-normal">
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
            className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white border-t border-brand-border rounded-t-3xl p-8 max-w-4xl mx-auto w-full max-h-[80vh] overflow-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`inline-block text-[10px] font-bold px-3 py-1 rounded-full mb-3 border ${
                      selectedArticle.badge === 'Risk' ? 'bg-amber-50 border-amber-200 text-amber-700' : 
                      selectedArticle.badge === 'Positive' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                      'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                    {selectedArticle.badge} • Ringkasan Singkat
                  </span>
                  <h2 className="text-2xl font-bold text-text-primary">{selectedArticle.title}</h2>
                  <p className="text-xs text-text-muted mt-2">Sumber: {selectedArticle.source}</p>
                </div>
                <button onClick={() => setSelectedArticle(null)} className="p-2 bg-offwhite hover:bg-brand-mid/50 rounded-full text-text-muted border border-brand-border">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-text-primary leading-relaxed text-base">{selectedArticle.summary}</p>
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05); 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1); 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2); 
        }
      `}} />
    </div>
  );
}
