'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronLeft, Check, Send, Building2, Users, Briefcase, Landmark, Globe, BarChart3, FileText, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const roles = [
  { id: 'business_owner', label: 'Pemilik Bisnis / UMKM', sub: 'Saya ingin menumbuhkan bisnis saya secara digital', icon: Building2 },
  { id: 'hrd_recruiter', label: 'HRD / Recruiter', sub: 'Saya mencari kandidat untuk posisi digital marketing', icon: Users },
  { id: 'investor_partner', label: 'Investor / Mitra Institusional', sub: 'Saya tertarik pada kemitraan strategis jangka panjang', icon: Briefcase },
  { id: 'gov_agency', label: 'Lembaga Pemerintah / Yayasan', sub: 'Kami membutuhkan konsultasi ekosistem digital resmi', icon: Landmark },
];

const needs = [
  { id: 'web_ecosystem', label: 'Website & Pemeliharaan Web', icon: Globe },
  { id: 'seo_aeo_marketing', label: 'SEO & Optimasi Pencarian AI', icon: BarChart3 },
  { id: 'executive_doc', label: 'Slide Presentasi & Proposal', icon: FileText },
  { id: 'analytics_audit', label: 'Audit Analitik & Performa Web', icon: Wrench },
];

// Progress step labels
const STEP_LABELS = [
  'Identitas Anda',
  'Kebutuhan',
  'Konteks Proyek',
  'Detail Kontak',
];

// Psychological urgency / social proof micro-copy per step
const STEP_SUBCOPY = [
  '9 dari 10 klien menemukan solusi yang tepat setelah langkah ini.',
  'Pilih semua yang relevan — kami menyesuaikan solusinya.',
  'Semakin detail, semakin akurat rekomendasi awal dari Zadit.',
  'Data Anda aman dan tidak akan dibagikan ke pihak manapun.',
];

export default function PartnershipForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '',
    need: [] as string[],
    projectDescription: '',
    name: '',
    whatsapp: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const nextStep = () => setStep((p) => Math.min(p + 1, 4));
  const prevStep = () => setStep((p) => Math.max(p - 1, 1));

  const handleRoleSelect = (roleId: string) => {
    setFormData((p) => ({ ...p, role: roleId }));
    setTimeout(() => nextStep(), 280);
  };

  const handleNeedToggle = (needId: string) => {
    setFormData((p) => ({
      ...p,
      need: p.need.includes(needId) ? p.need.filter((n) => n !== needId) : [...p.need, needId],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp) {
      setErrorMsg('Nama dan WhatsApp wajib diisi.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/partnership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSuccess(true);
        const waText = `Halo Zadit, saya ${formData.name}. Saya tertarik untuk mendiskusikan kemitraan mengenai ${formData.need.map(n => needs.find(x => x.id === n)?.label || n).join(', ')}.`;
        setTimeout(() => window.open(`https://wa.me/6282316363177?text=${encodeURIComponent(waText)}`, '_blank'), 1500);
      } else { throw new Error(); }
    } catch {
      setErrorMsg('Gagal mengirim. Silakan hubungi Zadit langsung melalui WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((step - 1) / 3) * 100;

  return (
    <section id="partnership" className="bg-alabaster py-24 relative overflow-hidden">
      {/* Background atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(13,148,136,0.04) 0%, transparent 70%)' }}
      />
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-mono tracking-widest text-gold-accent uppercase">
            Formulir Kemitraan
          </span>
          <h2 className="text-3xl md:text-4xl font-heading-serif font-bold text-text-primary mt-2">
            Mulai <span className="gradient-text-teal">Kemitraan</span>
          </h2>
          <p className="text-text-muted mt-3 text-sm leading-relaxed max-w-md mx-auto">
            9 dari 10 klien menemukan solusi pertumbuhan yang tepat setelah diagnosis awal ini. Isi formulir dalam 60 detik untuk rekomendasi langsung dari Zadit.
          </p>
        </motion.div>

        {/* Wizard Container */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-brand-border rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Progress bar */}
          <div className="h-1 bg-offwhite">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-accent to-teal-glow"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {/* Step header */}
          <div className="px-8 pt-6 pb-4 border-b border-brand-border">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest">
                  Langkah {step} dari 4 — {STEP_LABELS[step - 1]}
                </span>
                <p className="text-[10px] font-sans text-teal-accent mt-0.5 italic">
                  {STEP_SUBCOPY[step - 1]}
                </p>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-mono font-bold border transition-all duration-300',
                      step > s
                        ? 'bg-teal-accent text-white border-teal-accent'
                        : step === s
                          ? 'bg-teal-accent/10 text-teal-accent border-teal-accent'
                          : 'bg-offwhite text-text-muted border-brand-border'
                    )}
                  >
                    {step > s ? <Check className="w-3 h-3" /> : s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form body */}
          <div className="p-8 min-h-[320px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center gap-4 py-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="w-16 h-16 rounded-full bg-teal-accent/10 border-2 border-teal-accent text-teal-accent flex items-center justify-center"
                  >
                    <Check className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-2xl font-heading-sans font-bold text-text-primary">
                    Pengajuan Kemitraan Terkirim!
                  </h3>
                  <p className="text-sm text-text-muted max-w-sm">
                    Terima kasih. Data Anda tersimpan dengan aman. Anda akan diarahkan ke WhatsApp untuk membuka saluran komunikasi langsung.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-grow"
                >
                  {/* STEP 1 — Role */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-heading-sans font-bold text-text-primary text-center mb-6">
                        Siapakah representasi Anda?
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {roles.map((r) => {
                          const Icon = r.icon;
                          return (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => handleRoleSelect(r.id)}
                              className={cn(
                                'p-4 rounded-xl border text-left transition-all duration-200 group hover:shadow-sm',
                                formData.role === r.id
                                  ? 'border-teal-accent bg-teal-accent/5 shadow-[0_0_0_1px_rgba(13,148,136,0.3)]'
                                  : 'border-brand-border bg-offwhite hover:border-teal-accent/40'
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <div className={cn(
                                  'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                                  formData.role === r.id ? 'bg-teal-accent text-white' : 'bg-white border border-brand-border text-text-muted group-hover:border-teal-accent/30 group-hover:text-teal-accent'
                                )}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className={cn('text-sm font-heading-sans font-semibold', formData.role === r.id ? 'text-teal-accent' : 'text-text-primary')}>
                                    {r.label}
                                  </p>
                                  <p className="text-[10px] text-text-muted mt-0.5 leading-tight">{r.sub}</p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 2 — Needs */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-heading-sans font-bold text-text-primary text-center mb-6">
                        Layanan apa yang Anda perlukan?
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {needs.map((n) => {
                          const Icon = n.icon;
                          const selected = formData.need.includes(n.id);
                          return (
                            <button
                              key={n.id}
                              type="button"
                              onClick={() => handleNeedToggle(n.id)}
                              className={cn(
                                'p-4 rounded-xl border text-left transition-all duration-200 flex items-center gap-3 group',
                                selected
                                  ? 'border-teal-accent bg-teal-accent/5 shadow-[0_0_0_1px_rgba(13,148,136,0.3)]'
                                  : 'border-brand-border bg-offwhite hover:border-teal-accent/40'
                              )}
                            >
                              <div className={cn(
                                'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                                selected ? 'bg-teal-accent text-white' : 'bg-white border border-brand-border text-text-muted group-hover:border-teal-accent/30 group-hover:text-teal-accent'
                              )}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className={cn('text-sm font-heading-sans font-medium flex-grow', selected ? 'text-teal-accent' : 'text-text-primary')}>
                                {n.label}
                              </span>
                              {selected && <Check className="w-4 h-4 text-teal-accent flex-shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 3 — Description */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <h3 className="text-xl font-heading-sans font-bold text-text-primary text-center mb-6">
                        Ceritakan singkat tentang proyek Anda
                      </h3>
                      <div className="max-w-lg mx-auto">
                        <textarea
                          name="projectDescription"
                          value={formData.projectDescription}
                          onChange={handleChange}
                          rows={5}
                          placeholder="Contoh: Kami adalah UMKM kuliner di Surabaya yang ingin meningkatkan penjualan online melalui website dan optimasi Google. Target kami adalah 100 pesanan/bulan dalam 3 bulan ke depan..."
                          className="w-full bg-offwhite border border-brand-border rounded-xl p-4 font-sans text-sm text-text-primary placeholder-text-muted/50 focus:ring-2 focus:ring-teal-accent/50 focus:border-teal-accent focus:bg-white outline-none transition-all resize-none leading-relaxed"
                        />
                        <p className="text-[10px] font-mono text-text-muted mt-2">
                          {formData.projectDescription.length}/500 karakter
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STEP 4 — Contact */}
                  {step === 4 && (
                    <div className="space-y-5">
                      <h3 className="text-xl font-heading-sans font-bold text-text-primary text-center mb-6">
                        Bagaimana cara terbaik menghubungi Anda?
                      </h3>
                      <div className="max-w-md mx-auto space-y-4">
                        {[
                          { name: 'name', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama Anda', required: true },
                          { name: 'whatsapp', label: 'Nomor WhatsApp Aktif', type: 'tel', placeholder: '08123456789', required: true },
                          { name: 'email', label: 'Alammat Email (Opsional)', type: 'email', placeholder: 'nama@perusahaan.com', required: false },
                        ].map(({ name, label, type, placeholder, required }) => (
                          <div key={name}>
                            <label className="block text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1.5">
                              {label} {required && <span className="text-teal-accent">*</span>}
                            </label>
                            <input
                              type={type}
                              name={name}
                              value={formData[name as keyof typeof formData] as string}
                              onChange={handleChange}
                              placeholder={placeholder}
                              required={required}
                              className="w-full bg-offwhite border border-brand-border rounded-xl px-4 py-3 font-sans text-sm text-text-primary placeholder-text-muted/50 focus:ring-2 focus:ring-teal-accent/50 focus:border-teal-accent focus:bg-white outline-none transition-all"
                            />
                          </div>
                        ))}
                        {errorMsg && (
                          <p className="text-xs text-red-500 font-mono bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {errorMsg}
                          </p>
                        )}
                        <p className="text-[9px] font-mono text-text-muted/60 text-center leading-relaxed">
                          Data Anda diproses secara aman dan tidak dibagikan ke pihak ketiga.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            {!isSuccess && (
              <div className="flex justify-between items-center mt-8 pt-5 border-t border-brand-border">
                <button
                  type="button"
                  onClick={prevStep}
                  className={cn(
                    'flex items-center gap-1.5 text-xs font-mono tracking-wider text-text-muted uppercase hover:text-text-primary transition-colors',
                    step === 1 && 'invisible'
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Kembali
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={(step === 1 && !formData.role) || (step === 2 && formData.need.length === 0)}
                    className="flex items-center gap-2 bg-teal-accent disabled:bg-offwhite disabled:text-text-muted disabled:border-brand-border disabled:shadow-none text-text-inverse font-heading-sans text-xs font-bold tracking-wider uppercase px-6 py-2.5 rounded-xl hover:bg-brand-slate transition-all shadow-sm shadow-teal-accent/20 border border-transparent disabled:border-brand-border"
                  >
                    Lanjut
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-teal-accent hover:bg-brand-slate text-text-inverse font-heading-sans text-xs font-bold tracking-wider uppercase px-6 py-2.5 rounded-xl transition-all shadow-sm shadow-teal-accent/20"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        Kirim Kemitraan
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
