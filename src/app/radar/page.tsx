"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Radio, Newspaper, Zap, ExternalLink, Filter } from "lucide-react";
import Link from "next/link";

interface RadarItem {
  id: string;
  title: string;
  source: string;
  category: string;
  timestamp: string;
  url: string;
  isHot?: boolean;
}

const mockRadarItems: RadarItem[] = [
  {
    id: "1",
    title: "Google Core Update May 2026: Impact on Local Services",
    source: "Search Engine Journal",
    category: "Marketing",
    timestamp: "2h ago",
    url: "#",
    isHot: true
  },
  {
    id: "2",
    title: "New AI Framework for Quantitative Research in Social Sciences",
    source: "Arxiv",
    category: "Academic",
    timestamp: "5h ago",
    url: "#"
  },
  {
    id: "3",
    title: "SE Asia Venture Capital Trends: Focus on Strategic Document Quality",
    source: "Tech in Asia",
    category: "Business",
    timestamp: "1d ago",
    url: "#"
  }
];

export default function RadarPage() {
  const [items, setItems] = useState<RadarItem[]>(mockRadarItems);
  const [activeTab, setActiveTab] = useState("all");

  const filteredItems = items.filter(
    (item) => activeTab === "all" || item.category.toLowerCase() === activeTab.toLowerCase()
  );

  return (
    <main className="min-h-screen bg-[#020617]">
      <Header />
      
      <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto space-y-12">
        {/* Header Block */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-blue-500">
            <Radio size={24} className="animate-pulse" />
            <div className="text-[10px] font-black uppercase tracking-[0.3em]">Industry Intelligence Live</div>
          </div>
          <h1 className="text-4xl md:text-6xl font-outfit font-black tracking-tight leading-[1.1]">
            The Radar <span className="text-slate-700">Hub.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Curated intelligence on the intersection of data, growth, and academic precision. Updated every 6 hours.
          </p>
        </div>

        {/* Intelligence Filters */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            {["all", "marketing", "academic", "business"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "text-xs font-bold uppercase tracking-widest pb-4 relative transition-colors",
                  activeTab === tab ? "text-blue-500" : "text-slate-500 hover:text-white"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="radar-tab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  />
                )}
              </button>
            ))}
          </div>
          <button className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
            <Filter size={14} /> Filter Source
          </button>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: i * 0.05 }}
                className="group p-6 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 hover:bg-white/4 transition-all flex items-start gap-6"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Newspaper size={20} className="text-slate-400" />
                </div>
                
                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border",
                      item.category === "Marketing" ? "text-blue-400 border-blue-400/20 bg-blue-400/5" :
                      item.category === "Academic" ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/5" :
                      "text-amber-400 border-amber-400/20 bg-amber-400/5"
                    )}>
                      {item.category}
                    </span>
                    <span className="text-[9px] font-bold text-slate-600 uppercase">{item.source}</span>
                    <span className="text-[9px] font-medium text-slate-700">• {item.timestamp}</span>
                  </div>
                  
                  <Link href={`/radar/${item.id}`} className="block">
                    <h3 className="text-lg font-bold text-slate-200 group-hover:text-blue-500 transition-colors flex items-center gap-2">
                      {item.title}
                      {item.isHot && <Zap size={14} className="fill-amber-500 text-amber-500" />}
                    </h3>
                  </Link>
                </div>

                <a 
                  href={item.url} 
                  target="_blank"
                  className="p-3 rounded-xl bg-white/5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white hover:bg-white/10"
                >
                  <ExternalLink size={18} />
                </a>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Subscribe CTA */}
        <div className="p-12 rounded-[40px] bg-linear-to-br from-blue-600 to-indigo-700 text-white space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-32 -mt-32 rounded-full" />
          
          <div className="relative z-10 max-w-xl space-y-4">
            <h2 className="text-3xl font-outfit font-black tracking-tight leading-tight">
              Get the Intelligence Digest. <br /> Straight to your inbox.
            </h2>
            <p className="text-blue-100 text-sm">
              Kami menyaring kebisingan dan hanya mengirimkan sinyal terpenting seputar pemasaran digital dan riset akademik seminggu sekali.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3 pt-4">
              <input 
                type="email" 
                placeholder="you@email.com"
                className="flex-grow px-6 py-4 rounded-xl bg-white/10 border border-white/20 placeholder:text-blue-200 text-sm outline-none focus:bg-white/20 transition-all"
              />
              <button className="px-8 py-4 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition-colors">
                Subscribe Radar
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
