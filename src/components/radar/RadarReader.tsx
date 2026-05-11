"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowLeft, ExternalLink, ShieldCheck, 
  Share2, Bookmark, Clock, Scale, BookOpen,
  Zap, Sparkles, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface RadarReaderProps {
  item: {
    title: string;
    summary: string;
    content?: string;
    source_url: string;
    source_name: string;
    published_at: string;
    image_url?: string;
    tags: string[];
    synthesis?: {
      opening?: string;
      takeaway: string;
      strategy: string;
      closing?: string;
    };
  };
}

export function RadarReader({ item }: RadarReaderProps) {
  return (
    <article className="max-w-4xl mx-auto py-12 px-6">
      {/* Back & Meta */}
      <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <Link 
          href="/radar" 
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Intelligence Radar
        </Link>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-all bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
            <Share2 size={14} /> Share
          </button>
          <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-all bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
            <Bookmark size={14} /> Save
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="space-y-8 mb-12">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="bg-blue-600/10 text-blue-500 border-blue-500/20 px-3 py-1">
            INTELLIGENCE SIGNAL
          </Badge>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <Clock size={12} /> {new Date(item.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest border-l border-white/10 pl-3">
            <ShieldCheck size={12} /> Source Verified
          </div>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          {item.title}
        </h1>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-400 border border-white/5">
            {item.source_name?.charAt(0) || "S"}
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Primary Source</div>
            <div className="text-sm font-bold text-white">{item.source_name}</div>
          </div>
          <a 
            href={item.source_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-all flex items-center gap-2"
          >
            Read Original <ExternalLink size={14} />
          </a>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative aspect-video rounded-[40px] overflow-hidden mb-12 shadow-2xl border border-white/10">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <PlaceholderImage text={item.title} />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-8 left-8 right-8">
           <div className="text-xs font-bold text-white/50 mb-2">Image Attribution: {item.source_name} via Radar API</div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-12">
          {/* Executive Framing (AI Opening) */}
          <section className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-slate-300 font-medium leading-relaxed italic border-l-4 border-blue-600 pl-8 py-2">
              {item.synthesis?.opening || `Zadit Intelligence radar mendeteksi pergeseran signifikan dalam pola ${item.tags?.[0] || 'industri'}. Analisis di bawah ini merangkum poin-poin kritikal yang diekstrak untuk konsumsi eksekutif.`}
            </p>
          </section>

          {/* Deep Takeaway (The "Meat") */}
          <section className="p-10 rounded-[32px] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap size={160} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-500 mb-8 flex items-center gap-3">
              <Sparkles size={18} /> Strategic Takeaway
            </h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-white leading-relaxed font-bold">
                {item.synthesis?.takeaway || item.summary}
              </p>
              
              <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Actionable Strategy</h4>
                <div className="grid grid-cols-1 gap-4">
                  {(item.synthesis?.strategy || "Review;Adapt;Execute").split(";").map((step, i) => (
                    <div key={i} className="flex items-center gap-4 text-sm font-medium text-slate-300">
                      <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center text-[10px] font-bold border border-blue-500/20 shrink-0">
                        {i + 1}
                      </div>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Cleaned Content Body */}
          <section className="prose prose-invert prose-lg max-w-none text-slate-400">
            <div dangerouslySetInnerHTML={{ __html: item.content || item.summary }} />
          </section>

          {/* Authority Closing */}
          <section className="py-8 border-y border-white/5">
            <p className="text-slate-500 text-sm italic leading-relaxed">
              {item.synthesis?.closing || "Kecepatan adaptasi terhadap intelligence ini akan menentukan dominasi market di kuartal mendatang."}
            </p>
          </section>

          {/* Related Posts (AEO/SEO Booster) */}
          <section className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Related Intelligence</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-pointer flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-800 shrink-0">
                    <PlaceholderImage text="R" variant="minimal" />
                  </div>
                  <div className="text-xs font-bold text-slate-300 line-clamp-2">Analisis Terkait: Dampak Strategis pada Skalabilitas Bisnis...</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Entities Found</h4>
            <div className="flex flex-wrap gap-2">
              {item.tags?.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-white/5 hover:bg-white/10 border-white/5 text-slate-300 py-1.5 px-3">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#0b1120] border border-white/5 space-y-4">
            <div className="flex items-center gap-3 text-emerald-500">
              <Scale size={18} />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Ethical Reader</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed italic">
              Zadit Intelligence Reader Mode membersihkan konten dari gangguan (ads/tracking) 
              dan memberikan synthesis bernilai tinggi. Hak cipta tetap milik sumber primer.
            </p>
            <Link href="/terms" className="inline-flex items-center gap-2 text-xs font-bold text-blue-500 hover:text-white transition-colors">
              Ethics & TOS Policy <ChevronRight size={14} />
            </Link>
          </div>
        </aside>
      </div>

      {/* Footer / Disclaimer */}
      <footer className="mt-24 pt-12 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-slate-600">
          <div className="text-xs font-medium">
            Published via Zadit Radar • Reference: <span className="font-mono">{item.source_name}</span>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Ethics & TOS</Link>
          </div>
        </div>
      </footer>
    </article>
  );
}
