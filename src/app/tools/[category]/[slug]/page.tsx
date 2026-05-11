import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { 
  Zap, 
  ExternalLink, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  BarChart3 
} from "lucide-react";
import Link from "next/link";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { generateSoftwareSchema } from "@/lib/seo/schema";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface Props {
  params: {
    category: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: tool } = await supabase
    .from("tools")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!tool) return {};

  return {
    title: `${tool.name} Audit & Implementation | Zadit Tech Stack`,
    description: tool.description || tool.tagline,
  };
}

export default async function ToolDetailPage({ params }: Props) {
  const { data: tool } = await supabase
    .from("tools")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!tool) notFound();

  const schema = generateSoftwareSchema({
    name: tool.name,
    description: tool.description || tool.tagline || "",
    url: `https://zadit.pro/tools/${params.category}/${params.slug}`,
    price: tool.pricing_model || "Free"
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Hero Header */}
      <section className="relative pt-32 pb-24 px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-amber-500/10 to-transparent opacity-30" />
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative">
          <div className="space-y-8">
            <Link 
              href="/tools" 
              className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Back to Directory
            </Link>
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-amber-500">
                <Layers size={14} /> {tool.category}
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-[0.9]">
                {tool.name}
              </h1>
              <p className="text-xl text-slate-400 font-medium leading-relaxed">
                {tool.tagline}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a 
                href={`/out/tool/${tool.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm hover:scale-[1.02] transition-transform shadow-xl shadow-amber-500/20"
              >
                Access Platform <ExternalLink size={18} />
              </a>
              <Link 
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-colors"
              >
                Request Implementation
              </Link>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-linear-to-r from-amber-500/20 to-purple-500/20 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
            <div className="relative rounded-[40px] overflow-hidden border border-white/10 aspect-video shadow-2xl">
              <PlaceholderImage text={tool.name} />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-16">
          {/* Detailed Audit */}
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-white flex items-center gap-4">
              <ShieldCheck className="text-amber-500" /> Zadit Audit & Analysis
            </h2>
            <div className="prose prose-invert prose-amber max-w-none">
              <p className="text-lg text-slate-300 leading-relaxed">
                {tool.description}
              </p>
            </div>
          </div>

          {/* Features / Why we use it */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
              <TrendingUp className="text-amber-500" size={24} />
              <h3 className="text-xl font-bold text-white">Performance Gains</h3>
              <ul className="space-y-3">
                {['Automated Workflows', 'Scalable Infrastructure', 'Direct API Integration'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-400">
                    <CheckCircle2 size={16} className="text-amber-500/60" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
              <BarChart3 className="text-amber-500" size={24} />
              <h3 className="text-xl font-bold text-white">Value Proposition</h3>
              <ul className="space-y-3">
                {['High ROI Potential', 'Low Maintenance', 'Security Hardened'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-400">
                    <CheckCircle2 size={16} className="text-amber-500/60" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Tool Metadata</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-sm text-slate-400">Category</span>
                <span className="text-sm text-white font-bold">{tool.category}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-sm text-slate-400">Pricing</span>
                <span className="text-sm text-white font-bold">{tool.pricing_model || 'Premium'}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-400">Audit Status</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-black uppercase tracking-widest">Verified</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[32px] bg-linear-to-br from-amber-500 to-amber-700 text-slate-950 space-y-6">
            <h3 className="text-2xl font-black leading-[1]">Need Implementation?</h3>
            <p className="text-sm font-bold opacity-80">
              Kami membantu Anda mengonfigurasi dan mengoptimalkan platform ini dalam ekosistem bisnis Anda.
            </p>
            <Link 
              href="/contact"
              className="block w-full text-center py-4 rounded-xl bg-slate-950 text-white font-black text-sm"
            >
              Consult Now
            </Link>
          </div>
        </aside>
      </section>
      <Footer />
    </main>
  );
}
