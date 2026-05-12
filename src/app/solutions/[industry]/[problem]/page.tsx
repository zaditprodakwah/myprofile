import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { generateSolutionContent } from "@/lib/generators/solutions";
import { InquiryWizard } from "@/components/shared/InquiryWizard";
import { ArrowLeft, CheckCircle2, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { Recommendations } from "@/components/shared/Recommendations";
import { supabase } from "@/lib/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface Props {
  params: Promise<{ industry: string; problem: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry, problem } = await params;
  const content = await generateSolutionContent(industry, problem);
  if (!content) return {};
  return {
    title: `${content.title} | Zadit Intelligence Hub`,
    description: content.description,
  };
}

export default async function SolutionPage({ params }: Props) {
  const { industry, problem } = await params;
  const content = await generateSolutionContent(industry, problem);

  if (!content) notFound();

  // Fetch related tools based on tags
  const { data: relatedTools } = await supabase
    .from("tools")
    .select("id, name, slug, category, tagline")
    .contains("tags", content.tags || [])
    .limit(2);

  // Fetch other solutions in the same industry
  const { data: relatedSolutions } = await supabase
    .from("problems")
    .select("id, title, slug, industry_slug")
    .eq("industry_slug", industry)
    .neq("slug", problem)
    .limit(2)
    .then(res => ({
      data: res.data?.map(s => ({
        ...s,
        industry: s.industry_slug
      }))
    }));

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      <Header />
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
        <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/solutions" className="hover:text-blue-500 transition-colors">Solutions</Link>
        <ChevronRight size={12} />
        <span className="text-slate-300">{industry}</span>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-12 lg:py-24 grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-12">
          {/* Hero Header */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-tighter text-blue-400">
              <Sparkles size={12} /> Priority Intelligence
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight">
              {content.title}
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed font-medium">
              {content.description}
            </p>
          </div>

          <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-blue-400 font-black uppercase tracking-widest text-xs">
              <ShieldCheck size={16} /> Verified Strategy
            </div>
            <p className="text-slate-300 leading-relaxed italic">
              "{content.intro}"
            </p>
          </div>

          {/* Main Content Area */}
          <div className="prose prose-invert prose-slate max-w-none space-y-12">
            <h2 className="text-3xl font-black text-white">Framework & Execution Plan</h2>
            <div className="grid gap-6">
              {content.strategy.map((s: any, i: number) => (
                <div key={i} className="group p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-500 flex items-center justify-center font-black shrink-0">
                      0{i + 1}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{s.title}</h3>
                      <p className="text-slate-400 leading-relaxed">{s.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations Section */}
            <div className="pt-12">
              <Recommendations 
                title="Recommended Ecosystem"
                tools={relatedTools as any}
                solutions={relatedSolutions as any}
              />
            </div>

            <div className="space-y-8 pt-12">
              <h2 className="text-3xl font-black text-white">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {content.faqs.map((f: any, i: number) => (
                  <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="font-bold text-white">Q: {f.q}</div>
                    <div className="text-slate-400 text-sm">A: {f.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Sticky Wizard */}
        <aside className="lg:col-span-5">
          <div className="sticky top-24 space-y-8">
            <div className="space-y-4">
              <div className="text-xs font-black uppercase tracking-widest text-blue-500">Get Expert Help</div>
              <h2 className="text-3xl font-black text-white">Request Your <br />Audit Framework</h2>
              <p className="text-slate-400 text-sm">
                Isi formulir di bawah untuk mendapatkan rekomendasi kustom berdasarkan kondisi infrastruktur Anda saat ini.
              </p>
            </div>
            <InquiryWizard initialMode={industry as any} />
            
            <div className="p-6 rounded-3xl bg-linear-to-br from-slate-900 to-slate-950 border border-white/5 space-y-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Next Action</div>
              <Link href="/solutions" className="group flex items-center justify-between text-sm font-bold text-white hover:text-blue-400 transition-colors">
                Lihat Solusi Industri Lainnya <ArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" size={16} />
              </Link>
            </div>
          </div>
        </aside>
      </section>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": content.title,
            "description": content.description,
            "author": {
              "@type": "Organization",
              "name": "Zadit Intelligence Hub"
            }
          })
        }}
      />
      <Footer />
    </main>
  );
}
