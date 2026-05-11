import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  Search, Filter, Radar, Zap, 
  Layers, ArrowRight, ExternalLink,
  ChevronRight, Sparkles, TrendingUp
} from "lucide-react";
import Link from "next/link";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Intelligence Search Results | Zadit Hub",
  description: "Advanced search results for tactical intelligence, tools, and industry solutions.",
};

export default function SERPPage({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q || "";

  // Mock results - in real app, fetch from Supabase search function
  const results = [
    {
      type: "radar",
      title: "Impact of AI Agents on SEO in 2026",
      desc: "Analisis mendalam tentang bagaimana autonomous agents merubah pola search dan otoritas entitas.",
      href: "/radar/ai-agents-seo-2026",
      category: "Intelligence"
    },
    {
      type: "tool",
      title: "Groq LPU Inference Engine",
      desc: "Benchmark performa Groq untuk aplikasi AI skala enterprise.",
      href: "/tools/groq-cloud",
      category: "Authority Stack"
    },
    {
      type: "solution",
      title: "Optimizing High CAC in SaaS",
      desc: "Blueprint pSEO untuk menurunkan biaya akuisisi pelanggan secara organik.",
      href: "/solutions/saas/high-cac-optimization",
      category: "Mapping"
    }
  ];

  return (
    <main className="min-h-screen bg-[#020617] pt-32 pb-24 px-6">
      <Header />
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Search Header */}
        <header className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input 
                  type="text" 
                  defaultValue={query}
                  placeholder="Search intelligence hub..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-lg font-medium text-white focus:outline-none focus:border-blue-500 transition-all shadow-2xl"
                />
             </div>
             <button className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-black text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20">
               Search
             </button>
          </div>
          
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">
              Showing results for <span className="text-white">"{query}"</span>
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
            {results.map((res, i) => (
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
                    zadit.dev{res.href}
                  </div>
                  <Link href={res.href} className="text-xs font-bold text-white flex items-center gap-2 group-hover:gap-3 transition-all">
                    Access Intelligence <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}

            {/* Pagination / Load More */}
            <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/5 text-sm font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all">
              Load More Results
            </button>
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
                 <p className="text-sm text-slate-300 leading-relaxed italic">
                   "Query Anda mengenai <strong>{query}</strong> mencakup tren krusial di 2026. 
                   Intelligence kami menyarankan fokus pada integrasi AI untuk otoritas search 
                   daripada hanya volume konten."
                 </p>
               </div>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-6">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Trending Intelligence</h3>
               <div className="space-y-4">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800">
                        <PlaceholderImage text={`T${i}`} variant="minimal" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="text-xs font-bold text-white group-hover:text-blue-500 transition-colors">Strategic Trend #{i}</div>
                        <div className="text-[10px] text-slate-600 flex items-center gap-2">
                          <TrendingUp size={10} /> 4.2k scans
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
