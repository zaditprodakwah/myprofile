import React from "react";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, ChevronRight, Layers, Sparkles } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ industry: string }>;
}

export default async function IndustryPage({ params }: Props) {
  const { industry: industrySlug } = await params;
  // Fetch industry details
  const { data: industry } = await supabase
    .from("industries")
    .select("*")
    .eq("slug", industrySlug)
    .single();

  if (!industry) notFound();

  // Fetch problems for this industry
  const { data: problems } = await supabase
    .from("problems")
    .select("*")
    .eq("industry_slug", industrySlug);

  return (
    <main className="min-h-screen bg-[#020617] text-white pt-32">
      <Header />
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
          <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/solutions" className="hover:text-blue-500 transition-colors">Solutions</Link>
          <ChevronRight size={12} />
          <span className="text-slate-300">{industry.name}</span>
        </nav>

        {/* Hero */}
        <header className="max-w-3xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-blue-500">
            <Layers size={16} /> Industry Vertical
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight">
            {industry.name} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-indigo-400">
              Intelligence Mapping
            </span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed font-medium">
            {industry.description || `Strategi komprehensif untuk mengatasi hambatan operasional dan pertumbuhan di sektor ${industry.name}.`}
          </p>
        </header>

        {/* Problems List */}
        <section className="space-y-8 pb-24">
          <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-500 border-b border-white/5 pb-4">
            <Sparkles size={14} className="text-blue-500" /> Identifikasi Bottleneck Utama
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {problems && problems.length > 0 ? (
              problems.map((prob) => (
                <Link 
                  key={prob.id}
                  href={`/solutions/${params.industry}/${prob.slug}`}
                  className="group p-8 rounded-[32px] bg-white/2 border border-white/5 hover:bg-white/5 hover:border-blue-500/20 transition-all"
                >
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {prob.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                      {prob.problem_statement?.[0] || "Analisis mendalam mengenai kendala strategis dan implementasi solusi terukur."}
                    </p>
                    <div className="pt-4 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/60 group-hover:text-blue-500 transition-colors">
                        View Solution Framework
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full p-12 rounded-3xl bg-white/2 border border-white/5 text-center space-y-4">
                <p className="text-slate-500 font-medium italic">
                  Data pemetaan untuk industri ini sedang dalam proses sinkronisasi radar...
                </p>
                <Link href="/contact" className="inline-block text-sm font-bold text-blue-500 hover:underline">
                  Request Prioritas Analisis &rarr;
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
