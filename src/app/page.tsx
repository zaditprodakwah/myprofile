"use client";

// Force rebuild to sync with eaa1147 fixes
import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SegmentedHero } from "@/components/home/SegmentedHero";
import { TrustBar } from "@/components/home/TrustBar";
import { RadarPreview } from "@/components/home/RadarPreview";
import { SolutionsGrid } from "@/components/home/SolutionsGrid";
import { ToolsShowcase } from "@/components/home/ToolsShowcase";
import { CTASection } from "@/components/home/CTASection";
import { useMode } from "@/hooks/use-mode";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ChevronDown } from "lucide-react";

export default function Home() {
  const { mode, setMode } = useMode();
  const [showIntentModal, setShowIntentModal] = useState(false);

  // Intent Detection: If user scrolls without picking a mode
  useEffect(() => {
    const handleScroll = () => {
      if (mode === "neutral" && !showIntentModal) {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > 40) {
          setShowIntentModal(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mode, showIntentModal]);

  // Scroll to top when mode changes to provide visual feedback (The "Hook" reaction)
  useEffect(() => {
    if (mode !== "neutral") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [mode]);

  return (
    <main className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden">
      <Header />
      
      <div className="relative z-10">
        {/* Dynamic Entry: Mode-aware Hero */}
        <SegmentedHero />

        {/* Authority Trust Signals */}
        <TrustBar />

        {/* Intelligence Pillars */}
        <div className="space-y-32 py-24 px-6">
          {/* 1. Radar: Real-time Data Ingestion Preview */}
          <section id="radar" className="scroll-mt-32">
             <RadarPreview />
          </section>

          {/* 2. Solutions: Industry Problem Mapping (pSEO) */}
          <section id="solutions" className="scroll-mt-32">
             <SolutionsGrid />
          </section>

          {/* 3. Tools: Authority Stack Directory */}
          <section id="tools" className="scroll-mt-32">
             <ToolsShowcase />
          </section>
        </div>

        {/* Conversion & Authority Expansion */}
        <CTASection />
      </div>

      <Footer />

      {/* Segment Selection Modal (Intent Triggered) */}
      <AnimatePresence>
        {showIntentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowIntentModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-xl bg-[#0b1120] border border-white/10 rounded-[40px] p-10 shadow-2xl overflow-hidden"
            >
              {/* Top Accent */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-blue-600 via-indigo-500 to-emerald-500" />
              
              <button 
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                onClick={() => setShowIntentModal(false)}
              >
                <X size={20} />
              </button>

              <div className="space-y-8">
                <div className="space-y-3 text-center">
                  <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-blue-500">
                    <Sparkles size={14} /> Personalize Hub
                  </div>
                  <h2 className="text-3xl font-outfit font-black tracking-tight">Focus Your Intelligence</h2>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto">
                    Pilih rute strategis Anda untuk menyesuaikan seluruh hub dengan kebutuhan spesifik Anda.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: "marketing", title: "Marketing & Agency", desc: "Scale ROAS & dominate search SERPs", color: "blue" },
                    { id: "academic", title: "Academic Excellence", desc: "Research integrity & automated mapping", color: "emerald" },
                    { id: "business", title: "Business Intelligence", desc: "Executive assets & strategic reporting", color: "amber" }
                  ].map((btn) => (
                    <button 
                      key={btn.id}
                      onClick={() => { setMode(btn.id as any); setShowIntentModal(false); }}
                      className={cn(
                        "group flex items-center justify-between p-6 rounded-3xl border transition-all text-left",
                        btn.color === "blue" ? "bg-blue-600/5 border-blue-500/20 hover:bg-blue-600/10 hover:border-blue-500/40" :
                        btn.color === "emerald" ? "bg-emerald-600/5 border-emerald-500/20 hover:bg-emerald-600/10 hover:border-emerald-500/40" :
                        "bg-amber-600/5 border-amber-500/20 hover:bg-amber-600/10 hover:border-amber-500/40"
                      )}
                    >
                      <div className="space-y-1">
                        <div className="font-black text-white group-hover:translate-x-1 transition-transform">{btn.title}</div>
                        <div className="text-xs text-slate-500">{btn.desc}</div>
                      </div>
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                        btn.color === "blue" ? "bg-blue-600/20 text-blue-500 group-hover:bg-blue-600 group-hover:text-white" :
                        btn.color === "emerald" ? "bg-emerald-600/20 text-emerald-500 group-hover:bg-emerald-600 group-hover:text-white" :
                        "bg-amber-600/20 text-amber-500 group-hover:bg-amber-600 group-hover:text-white"
                      )}>
                        <ChevronDown size={20} className="-rotate-90" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
