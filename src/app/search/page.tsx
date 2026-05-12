import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  Search, Filter, Radar, Zap, 
  Layers, ArrowRight, TrendingUp, Sparkles
} from "lucide-react";
import Link from "next/link";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { AIPulse } from "@/components/ui/AIPulse";
import { SearchX } from "lucide-react";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SERPPage({ searchParams }: Props) {
  const { q: query = "" } = await searchParams;

  // Fetch real trending items for sidebar
  const { data: trendingItems } = await supabase
    .from("radar_items")
    .select("id, title, slug, importance_score")
    .order("created_at", { ascending: false })
    .limit(5);

  // Simple search implementation (searching across titles in radar, tools, and problems)
  // In a production app, this would be a more complex pg_search or Vector search
  const { data: radarResults } = await supabase
    .from("radar_items")
    .select("id, title, slug, summary")
    .ilike("title", `%${query}%`)
    .limit(5);

  const { data: toolResults } = await supabase
    .from("tools")
    .select("id, name, slug, tagline, category")
    .ilike("name", `%${query}%`)
    .limit(5);

  const results = [
    ...(radarResults || []).map(r => ({
      type: "radar",
      title: r.title,
      desc: r.summary || "Tactical intelligence analysis.",
      href: `/radar/${r.slug}`,
      category: "Intelligence"
    })),
    ...(toolResults || []).map(t => ({
      type: "tool",
      title: t.name,
      desc: t.tagline || "Advanced technology platform.",
      href: `/tools/${t.category?.toLowerCase() || 'general'}/${t.slug}`,
      category: "Authority Stack"
    }))
  ];

  return (
    <main className="min-h-screen bg-[#020617] pt-32 pb-24 px-6">
      <Header />
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Search Header */}
        <header className="space-y-8">
          <form action="/search" method="GET" className="flex items-center gap-4">
             <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input 
                  type="text" 
                  name="q"
                  defaultValue={query}
                  placeholder="Search intelligence hub..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-lg font-medium text-white focus:outline-none focus:border-blue-500 transition-all shadow-2xl"
                />
             </div>
             <button type="submit" className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-black text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20">
               Search
             </button>
          </form>
          
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">
              Showing {results.length} results for <span className="text-white">"{query || 'latest intelligence'}"</span>
            </h2>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
                <Filter size={14} /> Filter Results
              </button>
            </div>
          </div>
        </header>

        {/* Results Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Results */}
          <div className="lg:col-span-8 space-y-8">
            {results.length > 0 ? (
              results.map((res, i) => (
                <div 
                  key={i}
                  className="group p-8 rounded-3xl bg-white/2 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center border",
                      res.type === "radar" ? "bg-blue-600/10 border-blue-500/20 text-blue-500" :
                      res.type === "tool" ? "bg-amber-600/10 border-amber-500/20 text-amber-500" :
                      "bg-emerald-600/10 border-emerald-500/20 text-emerald-500"
                    )}>
                      {res.type === "radar" ? <Radar size={16} /> : res.type === "tool" ? <Zap size={16} /> : <Layers size={16} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      {res.category}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <Link href={res.href} className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {res.title}
                    </Link>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      {res.desc}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <div className="text-[10px] text-slate-600 font-mono">
                      zadit.pro{res.href}
                    </div>
                    <Link href={res.href} className="text-xs font-bold text-white flex items-center gap-2 group-hover:gap-3 transition-all">
                      Access Intelligence <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-32 text-center space-y-8 max-w-sm mx-auto">
                <div className="w-24 h-24 rounded-full bg-white/2 border border-white/5 flex items-center justify-center mx-auto text-slate-700">
                  <SearchX size={48} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-white">Waduh, Zonk Parah!</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Saya udah nyisir seluruh database intelijen, tapi kata kunci <strong>"{query}"</strong> belum mendarat di radar. Coba kata kunci lain atau cek direktori tools? Sikat!
                  </p>
                </div>
                <Link href="/tools" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-2xl shadow-blue-900/40">
                  Direktori Tools <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar: AI Summary & Related */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="p-8 rounded-3xl bg-linear-to-b from-blue-600/10 to-indigo-600/5 border border-blue-500/10 space-y-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Sparkles size={120} />
               </div>
               <div className="space-y-4 relative z-10">
                 <h3 className="text-sm font-black uppercase tracking-widest text-blue-500 flex items-center gap-2">
                   <Sparkles size={16} /> AI Intelligence Summary
                 </h3>
                  <p className="text-sm text-slate-300 leading-relaxed italic font-medium">
                    {query ? (
                      <>
                        "Analisis saya buat <strong>{query}</strong>: Sinyal ini krusial buat dominasi market. 
                        Radar menyarankan fokus ke integrasi arsitektur data biar otoritas 
                        brand makin paten. Sikat!"
                      </>
                    ) : (
                      "Tulis apa aja di search bar, nanti saya bedah secara intelijen buat Anda. Sikat!"
                    )}
                  </p>
               </div>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-6">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Trending Intelligence</h3>
               <div className="space-y-4">
                 {(trendingItems || []).map((item, i) => (
                    <Link key={item.id} href={`/radar/${item.slug}`} className="flex items-center gap-4 group">
                       <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                         <PlaceholderImage text={`#${i+1}`} variant="minimal" />
                       </div>
                       <div className="flex-1 space-y-1">
                         <div className="text-xs font-bold text-white group-hover:text-blue-500 transition-colors line-clamp-2">
                           {item.title}
                         </div>
                         <div className="text-[10px] text-slate-600 flex items-center gap-2">
                           <TrendingUp size={10} /> {Math.floor(item.importance_score * 42)} scans
                         </div>
                       </div>
                    </Link>
                 ))}
               </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
      <AIPulse 
        messages={[
          "Sini saya bantu cari intelijen yang paling akurat buat Anda.",
          "Waduh, hasil pencariannya tajam banget! Sikat!",
          "Beres! Semua sinyal sudah saya kelompokkan biar gampang dibaca.",
          "Lagi nyocokkan query sama database... Ketemu!",
        ]}
      />
    </main>
  );
}
