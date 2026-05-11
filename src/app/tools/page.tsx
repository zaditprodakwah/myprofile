import React from "react";
import { Metadata } from "next";
import { supabase } from "@/lib/supabase/client";
import { Search, Grid, List, Zap, Star, ShieldCheck, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Authority Tool Directory | Zadit Intelligence Hub",
  description: "Daftar eksklusif tools dan platform yang kami gunakan untuk menskalakan infrastruktur klien kami.",
};

export default async function ToolsDirectoryPage() {
  const { data: tools } = await supabase
    .from("tools")
    .select("*")
    .order("priority", { ascending: false });

  const categories = Array.from(new Set((tools || []).map(t => t.category)));

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 selection:bg-amber-500/30">
      <Header />
      {/* Header Section */}
      <section className="relative pt-32 pb-20 px-6 border-b border-white/5">
        <div className="absolute inset-0 bg-linear-to-b from-amber-500/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center space-y-8 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest text-amber-500">
            <Zap size={14} /> The Executive Tech Stack
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight">
            Authority <br />
            <span className="text-amber-500">Tool Directory.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Kumpulan platform kelas dunia yang telah melalui audit performa, skalabilitas, dan ROI oleh Zadit Framework.
          </p>
        </div>
      </section>

      {/* Directory Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-12 gap-12">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-3 space-y-10">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Categories</h3>
            <div className="flex flex-col gap-2">
              <button className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm">
                All Tools <ChevronRight size={14} className="text-slate-500" />
              </button>
              {categories.map(cat => (
                <button key={cat} className="flex items-center justify-between p-3 rounded-xl border border-transparent text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-bold">
                  {cat} <ChevronRight size={14} className="opacity-0 hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-linear-to-br from-amber-600/10 to-transparent border border-amber-500/20 space-y-4">
            <ShieldCheck className="text-amber-500" size={24} />
            <h4 className="font-bold text-white">Zadit Verified</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Semua tool dalam direktori ini telah kami gunakan dalam proyek produksi skala besar.
            </p>
          </div>
        </aside>

        {/* Tools List */}
        <div className="lg:col-span-9 space-y-8">
          <div className="grid sm:grid-cols-2 gap-6">
            {(tools || []).map((tool, i) => (
              <Link 
                key={tool.id} 
                href={`/tools/${tool.category.toLowerCase()}/${tool.slug}`}
                className="group relative flex flex-col rounded-[32px] bg-white/[0.02] border border-white/5 overflow-hidden hover:border-amber-500/30 transition-all"
              >
                <div className="aspect-video relative grayscale group-hover:grayscale-0 transition-all duration-700">
                  <PlaceholderImage text={tool.name} />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />
                  {tool.is_featured && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                      <Star size={10} fill="currentColor" /> Featured
                    </div>
                  )}
                </div>
                <div className="p-8 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-500/60 group-hover:text-amber-500 transition-colors">
                      {tool.category}
                    </span>
                    <h3 className="text-2xl font-bold text-white">{tool.name}</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                    {tool.tagline}
                  </p>
                  <div className="pt-4 flex items-center justify-between border-t border-white/5">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      {tool.pricing_model || 'Freemium'}
                    </div>
                    <div className="flex items-center gap-2 text-white font-bold text-xs">
                      Analyze Tool <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
