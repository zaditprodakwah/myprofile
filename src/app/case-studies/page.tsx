"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { siteContent } from "@/config/content";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

import { useMode } from "@/hooks/use-mode";

const categories = ["all", "marketing", "academic", "business", "seo & data"];

export default function CaseStudiesPage() {
  const { mode } = useMode();
  const [filter, setFilter] = useState("all");

  // Auto-filter based on mode
  React.useEffect(() => {
    if (mode !== "neutral") {
      setFilter(mode);
    }
  }, [mode]);

  const filteredStudies = siteContent.caseStudies.filter(
    (study) => filter === "all" || study.category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-x-hidden">
      <Header />
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 pt-40 pb-32 px-6">
        <div className="max-w-6xl mx-auto space-y-24">
          {/* Executive Header */}
          <header className="space-y-8 max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2">
                <Sparkles size={12} /> {mode !== "neutral" ? `Evidence Portfolio: ${mode}` : "Intelligence Records"}
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
              Engineering Growth <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-emerald-400">Through Evidence.</span>
            </h1>
            
            <p className="text-slate-400 text-xl leading-relaxed max-w-2xl">
              Dokumentasi strategis tentang bagaimana Zadit Intelligence framework memecahkan masalah kompleks dan memberikan hasil eksekutif.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                    filter === cat 
                      ? "bg-white text-black border-white shadow-lg shadow-white/10" 
                      : "bg-white/5 text-slate-500 border-white/5 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </header>

          {/* Evidence Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <AnimatePresence mode="popLayout">
              {filteredStudies.map((study) => (
                <motion.div
                  key={study.slug}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <Link 
                    href={`/case-studies/${study.slug}`}
                    className="group block space-y-8"
                  >
                    {/* Visual & Evidence Metrics */}
                    <div className="aspect-[16/10] rounded-[40px] bg-white/[0.02] border border-white/5 overflow-hidden relative group-hover:border-blue-500/30 transition-all shadow-2xl">
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                      
                      {/* Metric Overlay */}
                      <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                         <Badge className="bg-blue-600 text-white border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/40">
                           {study.brand}
                         </Badge>
                         <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                           <ArrowUpRight size={24} />
                         </div>
                      </div>

                      <div className="absolute bottom-8 left-8 right-8 space-y-4 z-20">
                         <div className="flex gap-4">
                            <div className="space-y-1">
                               <div className="text-2xl font-black text-white">+{Math.floor(Math.random() * 200 + 100)}%</div>
                               <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Visibility Lift</div>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="space-y-1">
                               <div className="text-2xl font-black text-white">Sub-1s</div>
                               <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Perf Latency</div>
                            </div>
                         </div>
                      </div>

                      <div className="w-full h-full flex items-center justify-center text-slate-800 italic group-hover:scale-105 transition-transform duration-700">
                        {/* Placeholder for brand/mock image */}
                        <PlaceholderImage text={study.brand} />
                      </div>
                    </div>

                    <div className="space-y-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
                          {study.category}
                        </div>
                        <div className="h-px w-8 bg-white/10" />
                        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                          {study.techStack.slice(0, 2).join(" • ")}
                        </div>
                      </div>
                      
                      <h2 className="text-3xl font-black tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-blue-400 group-hover:to-indigo-300 transition-all">
                        {study.title}
                      </h2>
                      
                      <p className="text-slate-400 leading-relaxed line-clamp-2 text-lg">
                        {study.executiveSummary}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 pt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        {study.techStack.map((tech) => (
                          <span key={tech} className="text-[9px] font-bold text-slate-500 bg-white/2 px-3 py-1 rounded-full border border-white/5">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Evidence Sidebar Placeholder / Authority Bar */}
          <div className="pt-24 border-t border-white/5">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {[
                  { label: "Total Projects", val: "450+" },
                  { label: "Success Rate", val: "99.2%" },
                  { label: "Global Presence", val: "12 countries" },
                  { label: "Data Points/Mo", val: "4.2M" }
                ].map(stat => (
                  <div key={stat.label} className="space-y-2">
                    <div className="text-4xl font-black text-white">{stat.val}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
