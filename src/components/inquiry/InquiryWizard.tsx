"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useMode, Mode } from "@/hooks/use-mode";
import { cn } from "@/lib/utils";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Send, 
  MessageSquare, 
  Loader2,
  TrendingUp,
  GraduationCap,
  Briefcase
} from "lucide-react";
import { calculateLeadScore, getRecommendedRouting } from "@/lib/scoring/lead-scoring";

const formSchema = z.object({
  segment: z.enum(["marketing", "academic", "business"]),
  goal: z.string().min(5, "Tolong jelaskan tujuan Anda"),
  urgency: z.enum(["today", "this_week", "this_month", "flexible"]),
  budget_range: z.string().optional(),
  full_name: z.string().min(2, "Nama lengkap diperlukan"),
  email: z.string().email("Email tidak valid").or(z.string().length(0)),
  whatsapp: z.string().min(10, "Nomor WhatsApp diperlukan"),
  company: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
  { id: "segment", title: "Pilih Sektor" },
  { id: "needs", title: "Tujuan & Tantangan" },
  { id: "timeline", title: "Urgensi & Skala" },
  { id: "contact", title: "Detail Kontak" },
];

export function InquiryWizard() {
  const { mode } = useMode();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [routing, setRouting] = useState<"whatsapp" | "resend" | "lead_magnet">("resend");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      segment: mode === "neutral" ? "marketing" : mode as any,
      urgency: "this_week",
      email: "",
      whatsapp: "",
    },
  });

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fields as any);
    if (isValid) setCurrentStep((s) => s + 1);
  };

  const prevStep = () => setCurrentStep((s) => s - 1);

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 0: return ["segment"];
      case 1: return ["goal"];
      case 2: return ["urgency", "budget_range"];
      case 3: return ["full_name", "email", "whatsapp", "company"];
      default: return [];
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    const score = calculateLeadScore(data);
    const recommendedRouting = getRecommendedRouting(score, data.urgency);
    setRouting(recommendedRouting);

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, lead_score: score, routing: recommendedRouting }),
      });

      if (response.ok) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0f172a] border border-white/10 rounded-3xl p-10 text-center space-y-6"
      >
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-outfit font-bold">Inquiry Berhasil Terkirim!</h2>
          <p className="text-slate-400">Terima kasih, {form.getValues("full_name")}. Kami telah menerima permintaan Anda.</p>
        </div>

        <div className="pt-4 space-y-3">
          {routing === "whatsapp" ? (
            <a 
              href={`https://wa.me/6282316363177?text=Halo Zadit, saya ${form.getValues("full_name")}. Saya baru saja mengisi form inquiry untuk bantuan ${form.getValues("segment")}.`}
              target="_blank"
              className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all"
            >
              <MessageSquare size={20} />
              Chat WhatsApp Sekarang
            </a>
          ) : (
            <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-500/20 text-sm text-blue-400">
              Tim kami akan menghubungi Anda melalui Email/WhatsApp dalam waktu kurang dari 24 jam.
            </div>
          )}
          <button 
            onClick={() => { setIsSuccess(false); setCurrentStep(0); form.reset(); }}
            className="text-sm text-slate-500 hover:text-white"
          >
            Kirim inquiry lain
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Stepper */}
      <div className="flex justify-between mb-8 px-2">
        {steps.map((step, i) => (
          <div key={step.id} className="flex flex-col items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
              i <= currentStep ? "bg-blue-600 text-white" : "bg-white/5 text-slate-500 border border-white/10"
            )}>
              {i < currentStep ? <CheckCircle2 size={16} /> : i + 1}
            </div>
            <span className={cn(
              "text-[10px] uppercase tracking-widest font-bold",
              i === currentStep ? "text-blue-500" : "text-slate-600"
            )}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Animated Form Steps */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-outfit font-bold">Apa fokus kebutuhan Anda?</h3>
                  <p className="text-sm text-slate-400">Pilih sektor yang paling relevan dengan proyek Anda.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: "marketing", label: "Marketing", icon: TrendingUp },
                    { id: "academic", label: "Academic", icon: GraduationCap },
                    { id: "business", label: "Business", icon: Briefcase },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => form.setValue("segment", item.id as any)}
                      className={cn(
                        "p-6 rounded-2xl border transition-all flex flex-col items-center gap-3",
                        form.watch("segment") === item.id 
                          ? "bg-blue-600/20 border-blue-500 text-white" 
                          : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                      )}
                    >
                      <item.icon size={24} />
                      <span className="font-bold text-sm">{item.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-outfit font-bold">Jelaskan tantangan atau tujuan Anda</h3>
                  <p className="text-sm text-slate-400">Bantu kami memahami apa yang ingin Anda capai.</p>
                </div>
                <textarea 
                  {...form.register("goal")}
                  placeholder="Contoh: Saya butuh strategi SEO untuk website e-commerce baru saya..."
                  className="w-full min-h-[150px] bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-blue-500 outline-hidden transition-all resize-none"
                />
                {form.formState.errors.goal && <p className="text-xs text-red-500">{form.formState.errors.goal.message}</p>}
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-outfit font-bold">Kapan target penyelesaiannya?</h3>
                  <p className="text-sm text-slate-400">Tentukan tingkat urgensi proyek Anda.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "today", label: "Hari Ini / Urgent" },
                    { id: "this_week", label: "Minggu Ini" },
                    { id: "this_month", label: "Bulan Ini" },
                    { id: "flexible", label: "Fleksibel" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => form.setValue("urgency", item.id as any)}
                      className={cn(
                        "p-4 rounded-xl border text-sm font-medium transition-all",
                        form.watch("urgency") === item.id 
                          ? "bg-blue-600 text-white border-blue-500" 
                          : "bg-white/5 border-white/10 text-slate-400"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-300">Estimasi Budget / Skala (Opsional)</label>
                  <input 
                    {...form.register("budget_range")}
                    placeholder="Contoh: Rp 5jt - 10jt atau 500 visitors/day"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-hidden transition-all"
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-outfit font-bold">Terakhir, detail kontak Anda</h3>
                  <p className="text-sm text-slate-400">Kami akan menghubungi Anda sesegera mungkin.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Nama Lengkap</label>
                    <input {...form.register("full_name")} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-hidden" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">WhatsApp</label>
                    <input {...form.register("whatsapp")} placeholder="08..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-hidden" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Email (Opsional)</label>
                  <input {...form.register("email")} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-hidden" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Perusahaan / Institusi</label>
                  <input {...form.register("company")} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-hidden" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={prevStep}
            className={cn(
              "flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-white transition-colors",
              currentStep === 0 && "invisible"
            )}
          >
            <ArrowLeft size={16} />
            Kembali
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              Kirim Inquiry
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all"
            >
              Lanjut
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
