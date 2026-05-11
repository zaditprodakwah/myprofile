"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, Star, ArrowRight, Grid } from "lucide-react";
import { motion } from "framer-motion";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { supabase } from "@/lib/supabase/client";

export function ToolsShowcase() {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTools() {
      const { data } = await supabase
        .from("tools")
        .select("*")
        .eq("is_featured", true)
        .order("priority", { ascending: false })
        .limit(3);
      
      if (data) setTools(data);
      setLoading(false);
    }
    fetchTools();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-amber-500">
            <Zap size={16} /> The Authority Stack
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Battle-Tested <br />
            <span className="text-amber-500">Executive Tools</span>
          </h2>
        </div>
        <Link 
          href="/tools" 
          className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm hover:bg-white/10 transition-all flex items-center gap-2"
        >
          View Full Directory <Grid size={18} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-80 w-full rounded-3xl bg-white/5 animate-pulse" />)
        ) : (
          tools.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-3xl bg-[#0b1120] border border-white/5 overflow-hidden flex flex-col"
            >
              <div className="aspect-video relative grayscale group-hover:grayscale-0 transition-all duration-700">
                <PlaceholderImage text={tool.name} />
                <div className="absolute inset-0 bg-linear-to-t from-[#0b1120] via-transparent to-transparent" />
              </div>
              <div className="p-8 space-y-4 flex-1">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-500/60 group-hover:text-amber-500 transition-colors">
                    {tool.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white line-clamp-1">{tool.name}</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{tool.tagline}</p>
                <div className="pt-6 flex items-center justify-between">
                  <Link href={`/tools/${tool.category.toLowerCase()}/${tool.slug}`} className="text-xs font-black text-white hover:text-amber-500 transition-colors flex items-center gap-2">
                    Learn more <ArrowRight size={14} />
                  </Link>
                  <div className="text-amber-500 opacity-20 group-hover:opacity-100 transition-opacity">
                    <Star size={18} fill="currentColor" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
