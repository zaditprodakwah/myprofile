'use client';

import Header from '@/components/Header';
import React, { useState } from 'react';
import { useDataset } from '@/hooks/useDataset';
import Footer from '@/components/Footer';
import { Database, TrendingUp, Activity, FileJson, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type ExplorerDataset = 'BPS_MACRO' | 'FRED_INTEREST' | 'POLYGON_MARKETS' | 'DATARAKYAT';

// Helper to safely read a string field from unknown data
function safeStr(obj: unknown, key: string): string {
  if (obj && typeof obj === 'object' && key in obj) {
    return String((obj as Record<string, unknown>)[key] ?? 'N/A');
  }
  return 'N/A';
}

export default function SovereignExplorerPage() {
  const [activeDataset, setActiveDataset] = useState<ExplorerDataset>('BPS_MACRO');
  const { data, isLoading } = useDataset<Record<string, unknown> | Record<string, unknown>[]>(activeDataset);

  const dataAsArray = Array.isArray(data) ? data : null;
  const dataAsObj = (!Array.isArray(data) && data !== null) ? data : null;

  return (
    <>
      <Header />
      <main className="bg-[#030303] min-h-screen pt-24 pb-12 flex flex-col items-center justify-start text-white">
        <div className="w-full max-w-[1400px] px-6 md:px-12 flex-1 flex flex-col">
          <div className="mb-8 border-b border-white/10 pb-6 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black flex items-center gap-3">
                <Database className="text-blue-500 w-8 h-8" />
                The Analytics Terminal
              </h1>
              <p className="text-slate-400 mt-2 text-sm max-w-2xl">
                Independent deep-dive open data workstation. Connects securely to government and market public endpoints with SWR Edge Caching.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
              <Lock className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-mono text-emerald-400">Connection Secured • SSL</span>
            </div>
          </div>

          {/* Split Pane Workstation Layout */}
          <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-[600px]">
            {/* Left Pane: Controls */}
            <div className="w-full md:w-80 shrink-0 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Dataset Parameters</h3>
              
              <button 
                onClick={() => setActiveDataset('BPS_MACRO')}
                className={`p-4 rounded-xl text-left border transition-all ${activeDataset === 'BPS_MACRO' ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className={`w-4 h-4 ${activeDataset === 'BPS_MACRO' ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span className={`text-sm font-bold ${activeDataset === 'BPS_MACRO' ? 'text-blue-100' : 'text-slate-300'}`}>BPS Macroeconomics</span>
                </div>
                <p className="text-[10px] text-slate-500">National GDP & Inflation rate from BPS Gateway.</p>
              </button>

              <button 
                onClick={() => setActiveDataset('FRED_INTEREST')}
                className={`p-4 rounded-xl text-left border transition-all ${activeDataset === 'FRED_INTEREST' ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Activity className={`w-4 h-4 ${activeDataset === 'FRED_INTEREST' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className={`text-sm font-bold ${activeDataset === 'FRED_INTEREST' ? 'text-emerald-100' : 'text-slate-300'}`}>FRED Interest Rates</span>
                </div>
                <p className="text-[10px] text-slate-500">Global macro monetary liquidity indexes.</p>
              </button>

              <button 
                onClick={() => setActiveDataset('POLYGON_MARKETS')}
                className={`p-4 rounded-xl text-left border transition-all ${activeDataset === 'POLYGON_MARKETS' ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className={`w-4 h-4 ${activeDataset === 'POLYGON_MARKETS' ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className={`text-sm font-bold ${activeDataset === 'POLYGON_MARKETS' ? 'text-amber-100' : 'text-slate-300'}`}>Market Telemetry</span>
                </div>
                <p className="text-[10px] text-slate-500">Polygon.io, CoinGecko, & FMP v4 aggregated feed.</p>
              </button>

              <button 
                onClick={() => setActiveDataset('DATARAKYAT')}
                className={`p-4 rounded-xl text-left border transition-all ${activeDataset === 'DATARAKYAT' ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Database className={`w-4 h-4 ${activeDataset === 'DATARAKYAT' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className={`text-sm font-bold ${activeDataset === 'DATARAKYAT' ? 'text-indigo-100' : 'text-slate-300'}`}>Civic Projects</span>
                </div>
                <p className="text-[10px] text-slate-500">DataRakyat.id Indonesia Civic Stack infrastructure.</p>
              </button>
            </div>

            {/* Right Pane: Canvas */}
            <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-2xl relative overflow-hidden flex flex-col">
              <div className="bg-[#111] px-6 py-4 border-b border-white/10 flex justify-between items-center z-10">
                <span className="text-xs font-mono text-slate-400">Canvas Viewer • {activeDataset}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
                  <span className="text-[10px] text-slate-500">{isLoading ? 'Fetching Data...' : 'Connection Established'}</span>
                </div>
              </div>

              <div className="flex-1 p-6 relative">
                {/* Zero CLS Skeletons Overlay */}
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#0a0a0a] z-20 p-6 flex flex-col gap-6"
                    >
                      <div className="animate-pulse bg-white/5 rounded-xl h-24 w-full"></div>
                      <div className="animate-pulse bg-white/5 rounded-xl flex-1 w-full"></div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {/* Data Display Canvas */}
                {!isLoading && data && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full flex flex-col gap-6"
                  >
                    {/* Visualizer Block */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-48 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                      
                      {activeDataset === 'BPS_MACRO' && dataAsObj && (
                         <div className="text-center z-10">
                           <div className="text-4xl font-black text-blue-400 mb-2">{safeStr(dataAsObj, 'gdpGrowth')}</div>
                           <div className="text-sm text-slate-400 uppercase tracking-widest">National GDP Growth</div>
                         </div>
                      )}
                      {activeDataset === 'FRED_INTEREST' && dataAsObj && (
                         <div className="text-center z-10">
                           <div className="text-4xl font-black text-emerald-400 mb-2">{safeStr(dataAsObj, 'value')}%</div>
                           <div className="text-sm text-slate-400 uppercase tracking-widest">{safeStr(dataAsObj, 'indexName')}</div>
                         </div>
                      )}
                      {activeDataset === 'POLYGON_MARKETS' && (
                         <div className="text-center z-10 w-full px-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                           {dataAsArray ? dataAsArray.slice(0, 3).map((m, i) => (
                             <div key={i}>
                               <div className="text-2xl font-bold text-amber-400">{safeStr(m, 'symbol')}</div>
                               <div className="text-lg text-white">${safeStr(m, 'price')}</div>
                             </div>
                           )) : <div>Format error</div>}
                         </div>
                      )}
                      {activeDataset === 'DATARAKYAT' && dataAsObj && (
                         <div className="text-center z-10">
                           <div className="text-4xl font-black text-indigo-400 mb-2">{safeStr(dataAsObj, 'civicProjects')}</div>
                           <div className="text-sm text-slate-400 uppercase tracking-widest">Active Civic Projects</div>
                         </div>
                      )}
                    </div>

                    {/* Raw JSON Block */}
                    <div className="bg-black border border-white/10 rounded-xl flex-1 flex flex-col overflow-hidden relative">
                      <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center gap-2">
                        <FileJson className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-mono text-slate-400">Response Object JSON</span>
                      </div>
                      <pre className="p-4 text-xs font-mono text-slate-300 overflow-auto flex-1 custom-scrollbar">
                        {JSON.stringify(data, null, 2)}
                      </pre>
                    </div>

                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02); 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1); 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2); 
        }
      `}} />
    </>
  );
}
