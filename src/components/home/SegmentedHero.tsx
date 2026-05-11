"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMode, Mode } from "@/hooks/use-mode";
import { siteContent } from "@/config/content";
import { cn } from "@/lib/utils";
import { BadgeCheck, Sparkles, Target } from "lucide-react";

const headlines: Record<Mode, string> = {
  neutral: siteContent.hero.hook,
  marketing: "Engineering Growth Systems for Brands & Campaigns.",
  academic: "Academic Harm Reduction with Precision Data Methodology.",
  business: "Executive-Grade Documents, Slides, and Decision Support.",
};

const subheadlines: Record<Mode, string> = {
  neutral: siteContent.hero.subHook,
  marketing: "Strategi digital berbasis data untuk mendominasi SERP dan memaksimalkan ROI kampanye miliaran rupiah.",
  academic: "Asistensi riset metodologis dan pengolahan data tanpa melanggar integritas intelektual.",
  business: "Transformasi ide abstrak menjadi aset strategis yang memenangkan negosiasi dan efisiensi operasional.",
};

export function SegmentedHero() {
  const { mode, mounted } = useMode();

  // Prevent hydration mismatch
  const currentHeadline = mounted ? headlines[mode] : headlines.neutral;
  const currentSubheadline = mounted ? subheadlines[mode] : subheadlines.neutral;

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* EEAT Micro-badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {siteContent.hero.eeatBadges.map((badge, i) => (
            <div 
              key={i}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-400"
            >
              <BadgeCheck size={12} className="text-blue-500" />
              {badge}
            </div>
          ))}
        </motion.div>

        {/* Dynamic Headline */}
        <div className="min-h-[140px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.h1
              key={mode}
              initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(10px)", y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-4xl md:text-6xl lg:text-7xl font-outfit font-black tracking-tight leading-[1.1]"
            >
              {currentHeadline}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Dynamic Subheadline */}
        <AnimatePresence mode="wait">
          <motion.p
            key={mode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            {currentSubheadline}
          </motion.p>
        </AnimatePresence>

        {/* Primary Action (Conditional) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-4"
        >
          <button className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
