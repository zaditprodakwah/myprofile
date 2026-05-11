import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { supabase } from "@/lib/supabase/client";
import { ExternalLink, Clock, Tag, ShieldAlert, ArrowLeft, Share2, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getBaseMetadata } from "@/lib/seo/meta";
import { Recommendations } from "@/components/shared/Recommendations";
import { Footer } from "@/components/layout/Footer";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: item } = await supabase.from("radar_items").select("*").eq("slug", params.slug).single();
  if (!item) return {};
  return getBaseMetadata(
    item.title,
    item.summary || "",
    `/radar/${params.slug}`
  );
}

export default async function RadarItemPage({ params }: Props) {
  const { data: item } = await supabase.from("radar_items").select("*").eq("slug", params.slug).single();

  if (!item) notFound();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      {/* Reader Mode Header */}
      <div className="border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/radar" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Back to Radar
          </Link>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors"><Share2 size={18} /></button>
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center gap-2"
            >
              Original Source <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12 lg:py-20 space-y-12">
        {/* Signal Header */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${item.signal_score >= 80 ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
              Signal Strength: {item.signal_score}%
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-slate-500">
              <Clock size={12} /> {new Date(item.published_at).toLocaleDateString()}
            </div>
          </div>
          
          <h1 className="text-3xl lg:text-5xl font-black text-white leading-tight">
            {item.title}
          </h1>

          <div className="flex flex-wrap gap-2">
            {item.tags?.map((tag: string) => (
              <Link key={tag} href={`/radar/tag/${tag.toLowerCase()}`} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase text-slate-400 hover:border-blue-500/30 hover:text-blue-400 transition-all">
                <Tag size={10} /> {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* AI Synthesis Section */}
        <div className="grid sm:grid-cols-2 gap-6 p-1 rounded-[32px] bg-linear-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20">
          <div className="p-8 space-y-3">
            <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={14} /> Why It Matters
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              {item.why_it_matters}
            </p>
          </div>
          <div className="p-8 space-y-3 bg-white/[0.02] rounded-[30px]">
            <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
              <AlertCircle size={14} /> Intelligence Takeaway
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              {item.takeaway}
            </p>
          </div>
        </div>

        {/* Reader Content Disclaimer */}
        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
          <ShieldAlert className="text-amber-500 shrink-0" size={20} />
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-widest text-amber-500">Reader Mode Transparency</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Halaman ini adalah curated summary dari sumber asli: <span className="font-bold text-slate-300">{item.source_name}</span>. Konten telah diproses melalui Zadit Synthesis Engine untuk meminimalkan 'noise' dan memaksimalkan nilai intelijen operasional. Zadit tidak mengklaim kepemilikan atas konten sumber asli.
            </p>
          </div>
        </div>

        {/* Curation Content */}
        <div className="prose prose-invert prose-slate max-w-none">
          <div dangerouslySetInnerHTML={{ __html: item.summary }} />
        </div>

        {/* Internal Linking: Recommended Solutions & Tools */}
        <div className="pt-12 border-t border-white/5">
          <Recommendations 
            title="Strategic Actions"
            solutions={item.recommended_solutions?.map((slug: string) => ({
              id: slug,
              title: slug.replace(/-/g, ' '),
              slug: slug,
              industry: "intelligence" // Default industry for radar links
            }))}
            tools={item.recommended_tools?.map((tool: any) => ({
              id: tool.slug,
              name: tool.name,
              slug: tool.slug,
              category: tool.category,
              tagline: tool.tagline
            }))}
          />
        </div>
      </article>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": item.title,
            "datePublished": item.published_at,
            "description": item.summary,
            "author": {
              "@type": "Organization",
              "name": item.source_name
            }
          })
        }}
      />
      <Footer />
    </main>
  );
}
