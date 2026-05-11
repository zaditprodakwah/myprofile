"use client";

import React from "react";
import Link from "next/link";
import { Radar, ArrowRight, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";

import { supabase } from "@/lib/supabase/client";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";

export function RadarPreview() {
  const [signals, setSignals] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchSignals() {
      const { data } = await supabase
        .from("radar_items")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(3);
      
      if (data) setSignals(data);
      setLoading(false);
    }
    fetchSignals();
  }, []);
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
      <div className="lg:col-span-5 space-y-8">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-blue-500">
          <Radar size={16} /> Live Intelligence
        </div>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          Scanning the <br />
          <span className="text-blue-500">Digital Frontier</span>
        </h2>
        <p className="text-lg text-slate-400 font-medium leading-relaxed">
          Radar kami memproses ribuan sinyal setiap jam untuk mengekstrak intelligence 
          yang dapat ditindaklanjuti. Dapatkan insight sebelum menjadi arus utama.
        </p>
        <Link 
          href="/radar" 
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 text-white font-black text-sm hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)]"
        >
          Explore Intelligence Radar <ArrowRight size={18} />
        </Link>
      </div>

      <div className="lg:col-span-7 relative">
        {/* Animated Background Effect */}
        <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full" />
        
        <div className="relative space-y-4">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-24 w-full rounded-[24px] bg-white/5 animate-pulse" />
            ))
          ) : (
            signals.map((sig, i) => (
              <motion.div
                key={sig.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group p-5 rounded-[24px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all backdrop-blur-xl"
              >
                <Link href={`/radar/${sig.slug}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[18px] overflow-hidden bg-slate-900 shrink-0 border border-white/5 relative">
                      <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/0 transition-colors z-10" />
                      {sig.image_url ? (
                        <img src={sig.image_url} alt={sig.title} className="w-full h-full object-cover" />
                      ) : (
                        <PlaceholderImage text={sig.tags?.[0] || "RADAR"} variant="minimal" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                        {sig.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-blue-600/5 text-blue-500 border-blue-500/20 py-0 px-2">
                          {sig.tags?.[0] || "GENERAL"}
                        </Badge>
                        <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                          <Clock size={10} /> {new Date(sig.published_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0">
                    <ArrowRight size={18} />
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
