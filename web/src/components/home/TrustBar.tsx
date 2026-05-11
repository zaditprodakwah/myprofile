"use client";

import React from "react";
import { ShieldCheck, Users, Zap, Globe, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const metrics = [
  { label: "Signals Processed", value: "1,200+", icon: Zap },
  { label: "Solution Mapped", value: "450+", icon: Globe },
  { label: "Authority Tools", value: "85+", icon: Trophy },
  { label: "Client Satisfaction", value: "99.9%", icon: ShieldCheck },
];

export function TrustBar() {
  return (
    <section className="py-12 border-y border-white/5 bg-white/1 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((m, i) => (
            <motion.div 
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center lg:items-start gap-3 text-center lg:text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <m.icon size={20} />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">{m.value}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{m.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Brand Logos / Entity Association */}
        <div className="mt-16 pt-12 border-t border-white/5 flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
           {/* Placeholder for actual logos or high-authority names */}
           {["Google Cloud", "Groq AI", "Supabase", "Vercel", "Tailwind Labs"].map(brand => (
             <span key={brand} className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 cursor-default hover:text-white transition-colors">
               {brand}
             </span>
           ))}
        </div>
      </div>
    </section>
  );
}
