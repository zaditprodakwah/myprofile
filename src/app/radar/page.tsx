import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Radio, Newspaper, Zap, ExternalLink } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function RadarPage({ searchParams }: Props) {
  const { category: activeTab = "all" } = await searchParams;

  const { data: items } = await supabase
    .from("radar_items")
    .select("*")
    .order("created_at", { ascending: false });

  const filteredItems = (items || []).filter(
    (item) => activeTab === "all" || item.category?.toLowerCase() === activeTab.toLowerCase()
  );

  const categories = ["all", "marketing", "academic", "business"];

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
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
            The Radar <span className="text-slate-700">Hub.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Curated intelligence on the intersection of data, growth, and academic precision. Updated in real-time via autonomous ingestion.
          </p>
        </div>

        {/* Intelligence Filters */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            {categories.map((tab) => (
              <Link
                key={tab}
                href={`/radar?category=${tab}`}
                className={cn(
                  "text-xs font-bold uppercase tracking-widest pb-4 relative transition-colors",
                  activeTab === tab ? "text-blue-500" : "text-slate-500 hover:text-white"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
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
                    <span className="text-[9px] font-bold text-slate-600 uppercase">{item.source_name || "Zadit Intelligence"}</span>
                    <span className="text-[9px] font-medium text-slate-700">
                      • {item.created_at ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true }) : "recently"}
                    </span>
                  </div>
                  
                  <Link href={`/radar/${item.slug}`} className="block">
                    <h3 className="text-lg font-bold text-slate-200 group-hover:text-blue-500 transition-colors flex items-center gap-2">
                      {item.title}
                      {item.importance_score > 80 && <Zap size={14} className="fill-amber-500 text-amber-500" />}
                    </h3>
                  </Link>
                </div>

                {item.source_url && (
                  <a 
                    href={item.source_url} 
                    target="_blank"
                    className="p-3 rounded-xl bg-white/5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white hover:bg-white/10"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
            ))
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="text-slate-600 font-bold uppercase tracking-widest text-xs">No intelligence found for this segment</div>
              <Link href="/radar" className="text-blue-500 text-sm font-bold hover:underline">Reset Filters</Link>
            </div>
          )}
        </div>

        {/* Subscribe CTA */}
        <div className="p-12 rounded-[40px] bg-linear-to-br from-blue-600 to-indigo-700 text-white space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-32 -mt-32 rounded-full" />
          
          <div className="relative z-10 max-w-xl space-y-4">
            <h2 className="text-3xl font-black tracking-tight leading-tight">
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
      <Footer />
    </main>
  );
}
