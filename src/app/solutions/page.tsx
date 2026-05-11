import React from "react";
import Link from "next/link";
import { 
  Rocket, Zap, BookOpen, Shield, 
  Briefcase, ArrowRight, Grid, Globe,
  BarChart3, Sparkles
} from "lucide-react";
import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Industry Solutions & Problem Mapping | Zadit Intelligence Hub",
  description: "Advanced strategic solutions for Ecommerce, SaaS, Education, and Corporate sectors. Programmatic intelligence for specific industry bottlenecks.",
};

const industries = [
  {
    id: "ecommerce",
    title: "Ecommerce & Retail",
    icon: Rocket,
    description: "Scale ROAS, optimize conversion paths, and automate inventory intelligence.",
    color: "blue",
    problems: 12,
    solutions: 45
  },
  {
    id: "saas",
    title: "SaaS & Tech",
    icon: Zap,
    description: "pSEO architecture, product-led growth systems, and churn prediction models.",
    color: "emerald",
    problems: 8,
    solutions: 32
  },
  {
    id: "education",
    title: "Education & Academic",
    icon: BookOpen,
    description: "Research integrity, automated citation mapping, and institutional knowledge hubs.",
    color: "indigo",
    problems: 15,
    solutions: 28
  },
  {
    id: "corporate",
    title: "Corporate & Enterprise",
    icon: Shield,
    description: "Strategic governance, executive reporting, and compliance automation.",
    color: "amber",
    problems: 6,
    solutions: 19
  },
  {
    id: "health-beauty",
    title: "Health & Beauty",
    icon: Briefcase,
    description: "Brand scaling, reputation management, and high-conversion landing systems.",
    color: "rose",
    problems: 9,
    solutions: 24
  }
];

export default function SolutionsDirectory() {
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
            Kami memetakan kebuntuan strategis di berbagai industri dan memberikan solusi 
            programmatic yang divalidasi oleh intelligence radar kami. Pilih industri Anda untuk memulai.
          </p>
        </header>

        {/* Industry Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((ind) => (
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
          ))}
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
    </div>
  );
}

// Helper component for class names
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
