'use client';

import { useState } from 'react';
import { useGrowthData } from '@/hooks/useGrowthData';

import { motion } from 'framer-motion';
import { TrendingUp, Users, Percent, ArrowRight } from 'lucide-react';

export default function GrowthCalculator() {
  const [traffic, setTraffic] = useState(5000);
  const [conversionRate, setConversionRate] = useState(1.5);
  const [avgOrderValue, setAvgOrderValue] = useState(500000);
  const TRAFFIC_MULTIPLIER = 1.4; // 40% increase in traffic through SEO
  const CR_MULTIPLIER = 1.3; // 30% increase in conversion rate through CRO
  // Calculations moved to custom hook
  const { currentRevenue, projectedRevenue, growthPercentage } = useGrowthData({
    traffic,
    conversionRate,
    avgOrderValue,
    TRAFFIC_MULTIPLIER,
    CR_MULTIPLIER,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section className="py-24 bg-white border-y border-brand-border/40 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs font-mono tracking-widest text-teal-accent uppercase">
            Growth Simulator
          </span>
          <h2 className="text-3xl md:text-4xl font-heading-sans font-bold text-text-primary mt-3">
            Kalkulator Potensi <span className="gradient-text-teal">Pertumbuhan</span>
          </h2>
          <p className="text-text-muted mt-4 text-sm leading-relaxed max-w-2xl mx-auto">
            Gunakan kalkulator interaktif ini untuk memproyeksikan potensi peningkatan pendapatan Anda melalui optimalisasi ekosistem digital, SEO, dan Konversi (CRO).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Inputs */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 bg-offwhite p-8 rounded-3xl border border-brand-border/60"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="flex items-center gap-2 text-sm font-heading-sans font-semibold text-text-primary">
                  <Users className="w-4 h-4 text-teal-accent" />
                  Traffic Bulanan Saat Ini
                </label>
                <span className="text-sm font-mono font-medium text-text-muted">
                  {traffic.toLocaleString('id-ID')} visitor
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={traffic}
                onChange={(e) => setTraffic(Number(e.target.value))}
                className="w-full h-2 bg-brand-border rounded-lg appearance-none cursor-pointer accent-teal-accent"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="flex items-center gap-2 text-sm font-heading-sans font-semibold text-text-primary">
                  <Percent className="w-4 h-4 text-teal-accent" />
                  Conversion Rate (CR)
                </label>
                <span className="text-sm font-mono font-medium text-text-muted">
                  {conversionRate.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
                className="w-full h-2 bg-brand-border rounded-lg appearance-none cursor-pointer accent-teal-accent"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="flex items-center gap-2 text-sm font-heading-sans font-semibold text-text-primary">
                  <TrendingUp className="w-4 h-4 text-teal-accent" />
                  Rata-rata Nilai Pesanan (AOV)
                </label>
                <span className="text-sm font-mono font-medium text-text-muted">
                  {formatCurrency(avgOrderValue)}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="5000000"
                step="50000"
                value={avgOrderValue}
                onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                className="w-full h-2 bg-brand-border rounded-lg appearance-none cursor-pointer accent-teal-accent"
              />
            </div>
          </motion.div>

          {/* Results */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <div className="bg-brand-slate text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-accent/20 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
              
              <div className="relative z-10 space-y-8">
                <div>
                  <p className="text-sm font-mono tracking-wider text-white/60 mb-2 uppercase">Pendapatan Saat Ini</p>
                  <p className="text-2xl font-sans font-medium text-white/90">
                    {formatCurrency(currentRevenue)} <span className="text-sm text-white/50">/bln</span>
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <p className="text-sm font-mono tracking-wider text-teal-300 mb-2 uppercase flex items-center gap-2">
                    Proyeksi Bersama Zadit <TrendingUp className="w-4 h-4" />
                  </p>
                  <p className="text-4xl md:text-5xl font-heading-sans font-bold text-white tracking-tight">
                    {formatCurrency(projectedRevenue)}
                  </p>
                  <p className="text-sm text-white/50 mt-2 font-mono">/bln (Estimasi)</p>
                </div>

                <div className="flex items-end justify-between pt-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-accent/20 border border-teal-accent/30 text-teal-300 text-sm font-bold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      +{Math.round(growthPercentage)}% Growth
                    </div>
                  </div>
                  <a 
                    href="#partnership" 
                    className="inline-flex items-center gap-2 text-sm font-bold tracking-wider text-white hover:text-teal-300 transition-colors group uppercase font-mono"
                  >
                    Konsultasikan Proyek Pertumbuhan Anda
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-text-muted mt-4 text-center px-4 leading-relaxed font-sans">
              *Proyeksi ini adalah estimasi kasar berdasarkan peningkatan rata-rata traffic sebesar 40% dan peningkatan conversion rate sebesar 30% yang biasa kami capai. Hasil nyata dapat bervariasi bergantung pada industri dan kondisi pasar.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
