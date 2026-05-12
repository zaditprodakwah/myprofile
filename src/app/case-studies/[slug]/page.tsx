"use client";

import React, { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { siteContent } from "@/config/content";
import { CaseStudyJSONLD } from "@/components/seo/JSONLD";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, CheckCircle2, TrendingUp, Target, Shield } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const study = siteContent.caseStudies.find((s) => s.slug === resolvedParams.slug);
  if (!study) return notFound();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="min-h-screen bg-[#020617] selection:bg-blue-500/30">
      <CaseStudyJSONLD study={study} />
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-[100]"
        style={{ scaleX }}
      />
      
      <Header />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto space-y-8">
          <Link 
            href="/case-studies" 
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-500 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Back to Archive
          </Link>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-xs font-bold text-blue-500 uppercase">
                {study.brand}
              </div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {study.category}
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-outfit font-black tracking-tight leading-[1.1]">
              {study.title}
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-3xl">
              {study.executiveSummary}
            </p>
          </div>
        </div>
      </section>

      {/* Content Layout */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-20">
        {/* Main Article */}
        <div className="space-y-16">
          <article className="prose prose-invert prose-blue max-w-none">
            <div className="space-y-12">
              {/* Problem */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-red-500 font-bold uppercase tracking-widest text-xs">
                  <Target size={16} /> The Challenge
                </div>
                <h2 className="text-3xl font-outfit font-black text-white m-0">Identifying the Inefficiency.</h2>
                <p className="text-lg text-slate-400 leading-relaxed">
                  {study.challenge}
                </p>
              </div>

              {/* Solution */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-emerald-500 font-bold uppercase tracking-widest text-xs">
                  <Shield size={16} /> Strategic Solution
                </div>
                <h2 className="text-3xl font-outfit font-black text-white m-0">Implementing Precision Systems.</h2>
                <p className="text-lg text-slate-400 leading-relaxed">
                  {study.solution}
                </p>
              </div>

              {/* Results */}
              <div className="p-8 rounded-3xl bg-blue-600/5 border border-blue-500/20 space-y-6">
                <div className="flex items-center gap-3 text-blue-500 font-bold uppercase tracking-widest text-xs">
                  <TrendingUp size={16} /> Quantifiable Impact
                </div>
                <h2 className="text-3xl font-outfit font-black text-white m-0">The Outcome.</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                  {study.results.map((result, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <CheckCircle2 size={18} className="text-blue-500 mt-1 shrink-0" />
                      <span>{result}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </div>

        {/* Sticky Sidebar */}
        <aside className="space-y-8">
          <div className="sticky top-32 space-y-8">
            {/* Tech Stack */}
            <div className="p-6 rounded-2xl border border-white/5 bg-white/2 space-y-4">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stack & Tools</h4>
              <div className="flex flex-wrap gap-2">
                {study.techStack.map((tech) => (
                  <span key={tech} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-medium text-slate-400">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="p-6 rounded-2xl bg-blue-600 border border-blue-500 text-white space-y-6">
              <h4 className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Core Impact</h4>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-3xl font-black font-outfit tracking-tighter">ROI Driven</div>
                  <div className="text-[10px] uppercase font-bold text-blue-200">Systemic improvement</div>
                </div>
                <div className="h-px bg-white/10" />
                <div className="space-y-1">
                  <div className="text-3xl font-black font-outfit tracking-tighter">100% Valid</div>
                  <div className="text-[10px] uppercase font-bold text-blue-200">Accuracy commitment</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button className="w-full py-4 rounded-2xl bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors shadow-2xl">
              Request Similar Strategy
            </button>
          </div>
        </aside>
      </section>

      {/* Footer CTA */}
      <section className="py-32 px-6 border-t border-white/5 text-center space-y-8">
        <h2 className="text-3xl md:text-5xl font-outfit font-black tracking-tight">Need a customized system like this?</h2>
        <p className="text-slate-400 max-w-xl mx-auto">Mari diskusikan bagaimana strategi serupa dapat diimplementasikan untuk bisnis atau kebutuhan akademik Anda.</p>
        <Link 
          href="/#contact"
          className="px-10 py-5 rounded-full bg-blue-600 text-white font-bold text-lg hover:bg-blue-500 transition-all inline-block shadow-2xl shadow-blue-500/20"
        >
          Start Consultation
        </Link>
      </section>
    </main>
  );
}
