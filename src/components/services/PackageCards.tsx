"use client";

import React from "react";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Package {
  name: string;
  timeline: string;
  price: string;
  features?: string[];
  isPopular?: boolean;
}

interface PackageCardsProps {
  packages: Package[];
  accentColor?: string;
}

export function PackageCards({ packages, accentColor = "blue" }: PackageCardsProps) {
  const colors: Record<string, string> = {
    blue: "bg-blue-600 border-blue-500/50 shadow-blue-500/20",
    emerald: "bg-emerald-600 border-emerald-500/50 shadow-emerald-500/20",
    amber: "bg-amber-600 border-amber-500/50 shadow-amber-500/20",
  };

  const textColors: Record<string, string> = {
    blue: "text-blue-500",
    emerald: "text-emerald-500",
    amber: "text-amber-500",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {packages.map((pkg, i) => (
        <motion.div
          key={pkg.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className={cn(
            "relative p-8 rounded-3xl border bg-white/5 backdrop-blur-sm transition-all duration-300 flex flex-col h-full",
            pkg.isPopular ? "border-white/20 scale-105 z-10" : "border-white/5 hover:border-white/10"
          )}
        >
          {pkg.isPopular && (
            <div className={cn(
              "absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-white flex items-center gap-1",
              colors[accentColor]
            )}>
              <Sparkles size={10} />
              Most Popular
            </div>
          )}

          <div className="space-y-4 mb-8">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500">{pkg.name}</h4>
            <div className="space-y-1">
              <div className="text-3xl font-outfit font-black">{pkg.price}</div>
              <p className="text-xs text-slate-400">Timeline: {pkg.timeline}</p>
            </div>
          </div>

          <div className="space-y-4 flex-grow mb-8">
            {pkg.features?.map((feature, j) => (
              <div key={j} className="flex items-start gap-3 text-sm">
                <Check size={16} className={cn("mt-0.5 shrink-0", textColors[accentColor])} />
                <span className="text-slate-300">{feature}</span>
              </div>
            ))}
          </div>

          <button className={cn(
            "w-full py-4 rounded-xl font-bold text-sm transition-all",
            pkg.isPopular 
              ? colors[accentColor] + " text-white" 
              : "bg-white/10 hover:bg-white/20 text-white"
          )}>
            Request this Plan
          </button>
        </motion.div>
      ))}
    </div>
  );
}
