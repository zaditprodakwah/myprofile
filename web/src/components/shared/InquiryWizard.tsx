"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Send, Sparkles, MessageSquare, Briefcase, GraduationCap } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { generateWAMessage } from "@/lib/inquiry/wa";

interface InquiryWizardProps {
  initialMode?: "marketing" | "academic" | "business";
}

export function InquiryWizard({ initialMode }: InquiryWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [industries, setIndustries] = useState<any[]>([]);
  const [problems, setProblems] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    mode: initialMode || "marketing",
    industry: "",
    problem: "",
    budget: "",
    goal: "",
    message: "",
    full_name: "",
    email: "",
    whatsapp: ""
  });

  useEffect(() => {
    async function fetchData() {
      const { data: ind } = await supabase.from("industries").select("*").order("priority", { ascending: false });
      if (ind) setIndustries(ind);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchProblems() {
      if (!formData.industry) return;
      const { data: prob } = await supabase.from("problems").select("*").eq("industry_slug", formData.industry);
      if (prob) setProblems(prob);
    }
    fetchProblems();
  }, [formData.industry]);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await supabase.from("inquiries").insert({
      segment: formData.mode,
      full_name: formData.full_name,
      email: formData.email,
      whatsapp: formData.whatsapp,
      goal: formData.goal,
      challenges: formData.message,
      budget_range: formData.budget,
      source: window.location.pathname
    });

    if (!error) {
      setCompleted(true);
      // Optional: Redirect to WA
      const waUrl = generateWAMessage({
        mode: formData.mode,
        industry: formData.industry,
        problem: formData.problem,
        budget: formData.budget,
        goal: formData.goal,
        message: formData.message,
        source_page: window.location.pathname
      });
      setTimeout(() => window.open(waUrl, '_blank'), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/[0.02] border border-white/10 rounded-[40px] p-8 sm:p-12 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-600 to-indigo-600" />
      
      <AnimatePresence mode="wait">
        {!completed ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Progress Bar */}
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${step >= i ? 'bg-blue-500' : 'bg-white/10'}`} />
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">Pilih Fokus Strategis Anda</h3>
                  <p className="text-slate-400 text-sm">Sesuaikan intelijen dengan kebutuhan spesifik Anda.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'marketing', label: 'Marketing', icon: MessageSquare, color: 'blue' },
                    { id: 'academic', label: 'Academic', icon: GraduationCap, color: 'emerald' },
                    { id: 'business', label: 'Business', icon: Briefcase, color: 'amber' }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setFormData({...formData, mode: m.id as any}); nextStep(); }}
                      className={`p-6 rounded-3xl border transition-all text-center space-y-3 ${formData.mode === m.id ? 'bg-blue-600/10 border-blue-500' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                    >
                      <m.icon className={`mx-auto ${formData.mode === m.id ? 'text-blue-500' : 'text-slate-500'}`} size={32} />
                      <div className="font-bold text-white text-sm">{m.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">Detail Industri & Masalah</h3>
                  <p className="text-slate-400 text-sm">Membantu kami memahami konteks operasional Anda.</p>
                </div>
                <div className="space-y-4">
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all"
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  >
                    <option value="">Pilih Industri</option>
                    {industries.map(ind => <option key={ind.slug} value={ind.slug}>{ind.name}</option>)}
                  </select>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all"
                    value={formData.problem}
                    onChange={(e) => setFormData({...formData, problem: e.target.value})}
                    disabled={!formData.industry}
                  >
                    <option value="">Apa masalah utama Anda?</option>
                    {problems.map(prob => <option key={prob.slug} value={prob.slug}>{prob.title}</option>)}
                  </select>
                  <button 
                    onClick={nextStep}
                    disabled={!formData.problem}
                    className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-500 disabled:opacity-50 transition-all"
                  >
                    Lanjut <ArrowRight className="inline ml-2" size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">Target & Budget</h3>
                  <p className="text-slate-400 text-sm">Informasi ini rahasia dan digunakan untuk efisiensi rencana.</p>
                </div>
                <div className="space-y-4">
                  <textarea 
                    placeholder="Apa tujuan akhir yang ingin Anda capai?"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 h-32"
                    value={formData.goal}
                    onChange={(e) => setFormData({...formData, goal: e.target.value})}
                  />
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  >
                    <option value="">Range Budget</option>
                    <option value="<5M">&lt; 5jt</option>
                    <option value="5-15M">5jt - 15jt</option>
                    <option value="15-50M">15jt - 50jt</option>
                    <option value="50M+">50jt+</option>
                  </select>
                  <button 
                    onClick={nextStep}
                    className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-500 transition-all"
                  >
                    Hampir Selesai <ArrowRight className="inline ml-2" size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">Kontak Terakhir</h3>
                  <p className="text-slate-400 text-sm">Kami akan mengirimkan proposal audit dalam 24 jam.</p>
                </div>
                <div className="space-y-4">
                  <input 
                    placeholder="Nama Lengkap"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  />
                  <input 
                    placeholder="WhatsApp (62xxx)"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  />
                  <input 
                    placeholder="Email Address"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-blue-500"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <button 
                    onClick={handleSubmit}
                    disabled={loading || !formData.whatsapp}
                    className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? "Sinking Data..." : <><Send size={18} /> Submit & Open WhatsApp</>}
                  </button>
                </div>
              </div>
            )}

            {step > 1 && (
              <button onClick={prevStep} className="text-slate-500 text-xs font-bold hover:text-white transition-colors">
                ← Kembali ke tahap sebelumnya
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 space-y-6"
          >
            <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <Check size={48} />
            </div>
            <h3 className="text-3xl font-black text-white">Inquiry Terkirim!</h3>
            <p className="text-slate-400">
              Data Anda telah masuk ke sistem kami. Menghubungkan Anda ke WhatsApp Zadit untuk konsultasi instan...
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600/10 text-emerald-500 text-xs font-bold animate-pulse">
              <Sparkles size={14} /> Redirecting to WhatsApp
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
