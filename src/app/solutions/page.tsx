import React from "react";
import Link from "next/link";
import { 
  Rocket, Zap, BookOpen, Shield, 
  Briefcase, ArrowRight, Grid,
  TrendingUp, BarChart3
} from "lucide-react";
import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { AIPulse } from "@/components/ui/AIPulse";

export const metadata: Metadata = {
  title: "Industry Solutions & Problem Mapping | Zadit Intelligence Hub",
  description: "Advanced strategic solutions mapped to specific industry bottlenecks, validated by real-time intelligence.",
};

const iconMap: Record<string, any> = {
  ecommerce: Rocket,
  marketing: Zap,
  academic: BookOpen,
  business: Shield,
  corporate: Shield,
  saas: Zap,
  education: BookOpen,
  "health-beauty": Briefcase
};

const colorMap: Record<string, string> = {
  ecommerce: "blue",
  marketing: "emerald",
  academic: "indigo",
  business: "amber",
  corporate: "amber",
  saas: "emerald",
  education: "indigo"
};

export default async function SolutionsDirectory() {
  const { data: dbIndustries } = await supabase
    .from("industries")
    .select("*")
    .order("name");

  // Fallback to static list if DB is empty, but prioritized DB data
  const industries = (dbIndustries || []).map(ind => ({
    id: ind.slug,
    title: ind.name,
    icon: iconMap[ind.slug] || Briefcase,
    description: ind.description || "Strategic mapping for this specific industry segment.",
    color: colorMap[ind.slug] || "blue",
    problems: 8, // Placeholder stats
    solutions: 24
  }));

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[#020617]">
      <Header />
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Hero Section */}
        <header className="max-w-3xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-blue-500">
            <Grid size={16} /> Solutions Hub
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Advanced Industry <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 via-indigo-400 to-emerald-400">
              Problem Mapping
            </span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed font-medium">
            Radar saya udah nangkep banyak bottleneck di industri sekarang. 
            Tugas kita cuma satu: bedah masalahnya dan sikat solusinya secara terukur. Pilih industri Anda, kita mulai eksekusi!
          </p>
        </header>

        {/* Industry Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.length > 0 ? (
            industries.map((ind) => (
              <Link 
                key={ind.id}
                href={`/solutions/${ind.id}`}
                className="group relative p-8 rounded-3xl bg-white/2 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all overflow-hidden"
              >
                {/* Background Glow */}
                <div className={cn(
                  "absolute -top-24 -right-24 w-48 h-48 blur-[80px] opacity-10 transition-opacity group-hover:opacity-20",
                  ind.color === "blue" ? "bg-blue-500" : 
                  ind.color === "emerald" ? "bg-emerald-500" : 
                  ind.color === "rose" ? "bg-rose-500" : 
                  ind.color === "amber" ? "bg-amber-500" : "bg-indigo-500"
                )} />

                <div className="space-y-6 relative z-10">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center border",
                    ind.color === "blue" ? "bg-blue-600/10 border-blue-500/20 text-blue-500" : 
                    ind.color === "emerald" ? "bg-emerald-600/10 border-emerald-500/20 text-emerald-500" : 
                    ind.color === "rose" ? "bg-rose-600/10 border-rose-500/20 text-rose-500" : 
                    ind.color === "amber" ? "bg-amber-600/10 border-amber-500/20 text-amber-500" : "bg-indigo-600/10 border-indigo-500/20 text-indigo-500"
                  )}>
                    <ind.icon size={28} />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">
                      {ind.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                      {ind.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-xs font-black text-white">{ind.problems}</div>
                        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Problems</div>
                      </div>
                      <div className="text-center border-l border-white/10 pl-4">
                        <div className="text-xs font-black text-white">{ind.solutions}</div>
                        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Solutions</div>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-white/10 group-hover:text-white transition-all">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-32 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-600">
                <BarChart3 size={32} />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-white">Waduh, Datanya Masih Kosong!</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                  Sistem intelijen saya lagi sinkronisasi solusi baru. Tenang, sebentar lagi radar bakal nangkep sinyal industri baru. Tunggu 30 detik ya (eh, atau mungkin lebih dikit). Sikat!
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Global Authority Section */}
        <section className="p-12 rounded-[40px] bg-linear-to-b from-blue-600/10 to-indigo-600/5 border border-blue-500/10 text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
          
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl font-black text-white">Missing Your Industry?</h2>
            <p className="text-slate-400 font-medium">
              Zadit Intelligence Hub terus memperluas pemetaan problem-solution. 
              Gunakan radar kami untuk mendapatkan intelligence spesifik bagi model bisnis Anda.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link 
                href="/radar" 
                className="px-8 py-4 rounded-2xl bg-white text-black font-black text-sm hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                Scan Global Radar
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm hover:bg-white/10 transition-all"
              >
                Request Analysis
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      <AIPulse 
        messages={[
          "Banyak industri yang lagi goyang, tapi tenang, solusinya ada di sini. Sikat!",
          "Mapping problem sudah beres, tinggal pilih yang mau kita eksekusi.",
          "Waduh, industri ini punya bottleneck unik nih. Mari kita bedah!",
          "Radar intelijen: Sinyal dominasi market terdeteksi!",
        ]}
      />
    </div>
  );
}
