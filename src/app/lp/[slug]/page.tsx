import React from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { siteContent } from "@/config/content";
import { PackageCards } from "@/components/services/PackageCards";
import { InquiryWizard } from "@/components/inquiry/InquiryWizard";
import { cn } from "@/lib/utils";
import { ShieldCheck, Zap, Trophy, BarChart3, GraduationCap, Briefcase, TrendingUp } from "lucide-react";

interface LPPageProps {
  params: { slug: string };
}

export default function LPPage({ params }: LPPageProps) {
  const { slug } = params;
  
  const cluster = siteContent.serviceClusters.find(c => c.id === slug) || 
                  siteContent.serviceClusters.find(c => c.id === "digital-marketing" && slug === "marketing");

  if (!cluster) return notFound();

  const accentColors: Record<string, "blue" | "emerald" | "amber"> = {
    "digital-marketing": "blue",
    "marketing": "blue",
    "academic": "emerald",
    "business": "amber",
  };

  const icons: Record<string, any> = {
    "marketing": TrendingUp,
    "digital-marketing": TrendingUp,
    "academic": GraduationCap,
    "business": Briefcase,
  };

  const accent = accentColors[slug] || "blue";
  const Icon = icons[slug] || TrendingUp;

  return (
    <main className="min-h-screen bg-[#020617]">
      <Header />
      
      {/* LP Hero */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className={cn(
          "absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] blur-[150px] -z-10 opacity-20",
          accent === "blue" ? "bg-blue-600" : accent === "emerald" ? "bg-emerald-600" : "bg-amber-600"
        )} />
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest",
            accent === "blue" ? "text-blue-500" : accent === "emerald" ? "text-emerald-500" : "text-amber-500"
          )}>
            <Icon size={14} />
            Focus Mode: {cluster.clusterTitle}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-outfit font-black tracking-tight leading-[1.1]">
            {slug === "marketing" ? "Engineering Growth Systems for Brands & Campaigns." : 
             slug === "academic" ? "Academic Harm Reduction with Precision Data." : 
             "Executive-Grade Documents & Decision Support."}
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {cluster.description}
          </p>

          <div className="pt-6">
            <a href="#packages" className={cn(
              "px-8 py-4 rounded-full font-bold text-lg transition-all shadow-2xl inline-block",
              accent === "blue" ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20" : 
              accent === "emerald" ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20" : 
              "bg-amber-600 hover:bg-amber-500 shadow-amber-500/20"
            )}>
              View Strategic Plans
            </a>
          </div>
        </div>
      </section>

      {/* Proof Stack */}
      <section className="py-16 bg-white/2 border-y border-white/5 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Managed Budget", value: "Rp 85M+", icon: BarChart3 },
            { label: "Accuracy Rate", value: "100%", icon: ShieldCheck },
            { label: "S1 Pendidikan", value: "Matematika", icon: Trophy },
            { label: "Response Time", value: "< 4 Hours", icon: Zap },
          ].map((stat, i) => (
            <div key={i} className="space-y-2 text-center md:text-left">
              <stat.icon size={20} className={cn(
                accent === "blue" ? "text-blue-500" : accent === "emerald" ? "text-emerald-500" : "text-amber-500"
              )} />
              <div className="text-2xl font-black font-outfit">{stat.value}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-outfit font-black tracking-tight">Select Your Level of Engagement</h2>
          <p className="text-slate-400">Pilih paket yang paling sesuai dengan skala dan urgensi kebutuhan Anda.</p>
        </div>
        
        <PackageCards 
          accentColor={accent}
          packages={cluster.packages.map((pkg, idx) => ({
            ...pkg,
            isPopular: idx === 1,
            features: cluster.services.map(s => s.name)
          }))} 
        />
      </section>

      {/* Inquiry Wizard Embed */}
      <section id="inquiry" className="py-24 px-6 max-w-4xl mx-auto border-t border-white/5">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-outfit font-black tracking-tight">Request Your Strategic Plan</h2>
          <p className="text-slate-400">Isi formulir untuk mendapatkan penawaran khusus dan konsultasi awal.</p>
        </div>
        <InquiryWizard />
      </section>
      
      {/* Process/Trust Block */}
      <section className="pb-32 px-6 max-w-6xl mx-auto">
        <div className="p-12 rounded-[40px] bg-linear-to-br from-white/5 to-white/0 border border-white/10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-grow space-y-6">
            <h3 className="text-3xl font-outfit font-bold">What happens next?</h3>
            <div className="space-y-4">
              {[
                { step: 1, title: "Initial Audit", desc: "Kami menganalisis data atau brief yang Anda kirimkan." },
                { step: 2, title: "Strategy Call", desc: "Diskusi mendalam untuk memetakan solusi dan timeline." },
                { step: 3, title: "Execution", desc: "Implementasi strategi berbasis presisi dan KPI terukur." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold",
                    accent === "blue" ? "bg-blue-600" : accent === "emerald" ? "bg-emerald-600" : "bg-amber-600"
                  )}>
                    {item.step}
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-white">{item.title}</div>
                    <div className="text-sm text-slate-400">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full max-w-[300px] aspect-square rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-600 italic">
            Visual Process Assets
          </div>
        </div>
      </section>
    </main>
  );
}
