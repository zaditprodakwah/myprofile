"use client";

import React from "react";
import Link from "next/link";
import { Layers, Rocket, Zap, BookOpen, Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const industries = [
  { id: "marketing", title: "Marketing", icon: Rocket, color: "blue", desc: "Scale ROAS & conversion." },
  { id: "business", title: "Business", icon: Zap, color: "emerald", desc: "Enterprise growth systems." },
  { id: "academic", title: "Academic", icon: BookOpen, color: "indigo", desc: "Research integrity hubs." },
  { id: "ecommerce", title: "E-commerce", icon: Shield, color: "amber", desc: "High-velocity retail." },
];

export function SolutionsGrid() {
  return (
    <div className="max-w-7xl mx-auto space-y-16">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-emerald-500">
          <Layers size={16} /> Problem-Solution Mapping
        </div>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          Tailored for Your <br />
          <span className="text-emerald-500">Industry Vertical</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {industries.map((ind, i) => (
          <motion.div
            key={ind.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link 
              href={`/solutions/${ind.id}`}
              className="group flex flex-col p-8 rounded-3xl bg-white/2 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all h-full"
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center border mb-6 group-hover:scale-110 transition-transform",
                ind.color === "blue" ? "bg-blue-600/10 border-blue-500/20 text-blue-500" : 
                ind.color === "emerald" ? "bg-emerald-600/10 border-emerald-500/20 text-emerald-500" : 
                ind.color === "amber" ? "bg-amber-600/10 border-amber-500/20 text-amber-500" : "bg-indigo-600/10 border-indigo-500/20 text-indigo-500"
              )}>
                <ind.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{ind.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed flex-1">{ind.desc}</p>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                Explore Industry <ArrowRight size={12} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
