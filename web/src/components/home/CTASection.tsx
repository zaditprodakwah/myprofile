"use client";

import React from "react";
import Link from "next/link";
import { Rocket, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative p-12 sm:p-24 rounded-[60px] bg-linear-to-br from-blue-600 to-indigo-800 overflow-hidden text-center space-y-10 shadow-[0_0_80px_rgba(37,99,235,0.2)]">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 blur-[120px] rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400/20 blur-[120px] rounded-full" />
          
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-widest text-white backdrop-blur-md">
              <Sparkles size={14} /> Ready to Dominate?
            </div>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Scale Your Intelligence <br />
              <span className="opacity-60">with Zadit Ecosystem.</span>
            </h2>
            <p className="text-lg text-blue-100/70 font-medium">
              Dapatkan akses ke framework eksklusif, intelligence radar, dan tool authority yang kami gunakan untuk klien elit kami.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 relative z-10">
            <Link 
              href="/contact" 
              className="px-10 py-5 rounded-2xl bg-white text-blue-600 font-black text-lg hover:scale-105 transition-all shadow-xl shadow-blue-900/20"
            >
              Start Your Upgrade
            </Link>
            <Link 
              href="/radar" 
              className="px-10 py-5 rounded-2xl bg-white/10 border border-white/20 text-white font-black text-lg hover:bg-white/20 transition-all backdrop-blur-md"
            >
              Explore Radar
            </Link>
          </div>

          <div className="pt-10 flex items-center justify-center gap-8 text-blue-200/50 relative z-10">
            <div className="flex items-center gap-2">
              <Rocket size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Rapid Deployment</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">AI Synthesis Verified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
