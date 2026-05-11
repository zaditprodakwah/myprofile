"use client";

import React from "react";
import { motion } from "framer-motion";
import { useMode, Mode } from "@/hooks/use-mode";
import { siteContent } from "@/config/content";
import { Spotlight } from "@/components/ui/Spotlight";
import { TrendingUp, GraduationCap, Briefcase, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const icons: Record<string, any> = {
  marketing: TrendingUp,
  academic: GraduationCap,
  business: Briefcase,
};

const colors: Record<string, string> = {
  marketing: "from-blue-600/20 to-blue-600/0 border-blue-500/20 hover:border-blue-500/50",
  academic: "from-emerald-600/20 to-emerald-600/0 border-emerald-500/20 hover:border-emerald-500/50",
  business: "from-amber-600/20 to-amber-600/0 border-amber-500/20 hover:border-amber-500/50",
};

const iconColors: Record<string, string> = {
  marketing: "text-blue-500",
  academic: "text-emerald-500",
  business: "text-amber-500",
};

export function SegmentCards() {
  const { setMode } = useMode();

  return (
    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 py-10">
      {siteContent.hero.segments.map((segment, i) => {
        const Icon = icons[segment.id];
        return (
          <motion.div
            key={segment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            onClick={() => setMode(segment.id as Mode)}
            className="cursor-pointer group"
          >
            <Spotlight className={cn(
              "h-full p-8 rounded-3xl border bg-linear-to-b transition-all duration-500",
              colors[segment.id]
            )}>
              <div className="space-y-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3",
                  iconColors[segment.id]
                )}>
                  <Icon size={24} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-outfit font-bold">{segment.label}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {segment.description}
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                  {segment.action}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Spotlight>
          </motion.div>
        );
      })}
    </div>
  );
}
