"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { siteContent } from "@/config/content";
import { PackageCards } from "@/components/services/PackageCards";
import { cn } from "@/lib/utils";
import { TrendingUp, GraduationCap, Briefcase, Sparkles, FilterX } from "lucide-react";
import { useMode } from "@/hooks/use-mode";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";

export default function ServicesPage() {
  const { mode } = useMode();
  const [showAll, setShowAll] = useState(false);

  const icons: Record<string, any> = {
    "digital-marketing": TrendingUp,
    "academic": GraduationCap,
    "business": Briefcase,
  };

  const accentColors: Record<string, "blue" | "emerald" | "amber"> = {
    "digital-marketing": "blue",
    "academic": "emerald",
    "business": "amber",
  };

  const modeToCluster: Record<string, string> = {
    "marketing": "digital-marketing",
    "academic": "academic",
    "business": "business",
  };

  const filteredClusters = siteContent.serviceClusters.filter(cluster => {
    if (showAll || mode === "neutral") return true;
    return cluster.id === modeToCluster[mode];
  });

  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-x-hidden">
      <Header />
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
      </div>

      <div className="relative z-10 pt-40 pb-32 px-6">
        <div className="max-w-6xl mx-auto space-y-32">
          {/* Executive Header */}
          <header className="space-y-8 max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2">
                <Sparkles size={12} /> {mode !== "neutral" ? `Strategic Alignment: ${mode}` : "Discovery Protocol"}
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
              Intelligence-Driven <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-indigo-400">Services.</span>
            </h1>
            
            <p className="text-slate-400 text-xl leading-relaxed max-w-2xl">
              Kami mentransformasi data menjadi dominasi pasar melalui framework eksekutif yang dirancang untuk {mode === "marketing" ? "skalabilitas ROAS" : mode === "academic" ? "integritas riset" : "efisiensi operasional"}.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button 
                onClick={() => setShowAll(!showAll)}
                className={cn(
                  "px-8 py-4 rounded-2xl text-sm font-black transition-all border flex items-center gap-3",
                  showAll 
                    ? "bg-white text-black border-white" 
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                )}
              >
                {showAll ? <FilterX size={18} /> : <Layers size={18} />}
                {showAll ? "View Mode Only" : "Explore All Services"}
              </button>
            </div>
          </header>

          {/* Service Clusters */}
          <div className="space-y-40">
            <AnimatePresence mode="wait">
              {filteredClusters.length > 0 ? (
                filteredClusters.map((cluster) => {
                  const Icon = icons[cluster.id];
                  const accent = accentColors[cluster.id];

                  return (
                    <motion.section 
                      key={cluster.id} 
                      id={cluster.id} 
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -40 }}
                      className="space-y-16 relative"
                    >
                      {/* Cluster Backdrop Text */}
                      <div className="absolute -top-20 -left-10 text-[120px] font-black text-white/[0.02] select-none pointer-events-none uppercase">
                        {cluster.id.split('-')[0]}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        <div className="lg:col-span-7 space-y-8">
                          <div className={cn(
                            "w-20 h-20 rounded-[32px] bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl",
                            accent === "blue" ? "text-blue-500 shadow-blue-500/10" : accent === "emerald" ? "text-emerald-500 shadow-emerald-500/10" : "text-amber-500 shadow-amber-500/10"
                          )}>
                            <Icon size={40} />
                          </div>
                          
                          <div className="space-y-6">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                              {cluster.clusterTitle}
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                              {cluster.description}
                            </p>
                          </div>

                          {/* Individual Services Detail */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {cluster.services.map((service) => (
                              <div key={service.name} className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all space-y-4 group">
                                <h3 className="font-bold text-lg text-white group-hover:text-blue-500 transition-colors">{service.name}</h3>
                                <ul className="space-y-3">
                                  {service.deliverables.map((item) => (
                                    <li key={item} className="text-xs text-slate-500 flex items-center gap-3">
                                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                                <div className="pt-2">
                                  <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-blue-600/5 text-blue-400 border-blue-500/20">
                                    {service.highlight}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <aside className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
                          {/* Authority Metrics */}
                          <div className="p-8 rounded-[40px] bg-[#0b1120] border border-white/10 space-y-8 shadow-2xl">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5 pb-4">Executive ROI Metrics</h4>
                            <div className="grid grid-cols-2 gap-8">
                               <div className="space-y-1">
                                 <div className="text-3xl font-black text-white">12.4x</div>
                                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg Growth</div>
                               </div>
                               <div className="space-y-1">
                                 <div className="text-3xl font-black text-white">100%</div>
                                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Integrity Score</div>
                               </div>
                               <div className="space-y-1">
                                 <div className="text-3xl font-black text-white">24/7</div>
                                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Intel</div>
                               </div>
                               <div className="space-y-1">
                                 <div className="text-3xl font-black text-white">Zero</div>
                                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Data Waste</div>
                               </div>
                            </div>
                            <div className="p-6 rounded-2xl bg-blue-600/10 border border-blue-500/20">
                               <p className="text-xs text-blue-400 leading-relaxed font-medium">
                                 "Strategi ini dioptimalkan khusus untuk <strong>{cluster.targetAudience}</strong> melalui framework presisi Zadit Hub."
                               </p>
                            </div>
                          </div>

                          {/* CTA Sidebar */}
                          <div className="p-8 rounded-[40px] bg-linear-to-b from-blue-600 to-indigo-700 space-y-6 shadow-2xl shadow-blue-600/20">
                             <h4 className="text-xl font-black text-white leading-tight">Ready to activate this segment?</h4>
                             <p className="text-blue-100 text-sm">Konsultasi strategis 15 menit untuk memetakan intelligence hub Anda.</p>
                             <button className="w-full py-4 rounded-2xl bg-white text-black font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all">
                               Book Strategic Session
                             </button>
                          </div>
                        </aside>
                      </div>

                      {/* Package Cards */}
                      <div className="pt-20">
                        <div className="mb-12 flex items-center gap-6">
                          <div className="h-px flex-grow bg-white/10" />
                          <div className="text-xs font-black text-slate-600 uppercase tracking-[0.3em]">Institutional Grade Packages</div>
                          <div className="h-px flex-grow bg-white/10" />
                        </div>
                        <PackageCards 
                          accentColor={accent}
                          packages={cluster.packages.map((pkg, idx) => ({
                            ...pkg,
                            isPopular: idx === 1,
                            features: cluster.services.map(s => s.name)
                          }))} 
                        />
                      </div>
                    </motion.section>
                  );
                })
              ) : (
                <div className="py-40 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
                    <FilterX size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black">No services match this segment.</h3>
                    <p className="text-slate-500">Silakan ganti mode atau pilih "Explore All Services".</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
