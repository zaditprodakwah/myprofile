'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CaseStudy } from '@/lib/types';

export default function TestimonialsCarousel({ caseStudies }: { caseStudies: CaseStudy[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Filter out case studies that don't have testimonials
  const testimonials = caseStudies.filter(
    (cs) => cs.testimonial_text && cs.testimonial_author && cs.testimonial_role
  );

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  if (testimonials.length === 0) return null;

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-brand-slate text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-accent/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <span className="text-xs font-mono tracking-widest text-teal-300 uppercase mb-4 block">
          Dampak Terukur, Terbukti
        </span>
        <h2 className="text-3xl md:text-4xl font-heading-sans font-bold text-white mb-16">
          Apa Kata Mitra Kami
        </h2>

        <div className="relative min-h-[250px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl"
            >
              <Quote className="w-12 h-12 text-teal-accent/30 mx-auto mb-6" />
              
              <div className="flex justify-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-teal-400 text-teal-400" />
                ))}
              </div>

              <p className="text-xl md:text-2xl font-serif italic text-white/90 leading-relaxed mb-8">
                "{testimonials[currentIndex].testimonial_text}"
              </p>
              
              <div className="flex flex-col items-center">
                <p className="font-heading-sans font-bold text-white text-lg">
                  {testimonials[currentIndex].testimonial_author}
                </p>
                <p className="text-sm font-mono text-teal-300 tracking-wider mt-1">
                  {testimonials[currentIndex].testimonial_role}
                </p>
                <p className="text-xs text-white/50 mt-1">
                  {testimonials[currentIndex].client_name}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          {testimonials.length > 1 && (
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 sm:px-0">
              <button 
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors backdrop-blur-sm -ml-4 sm:-ml-12"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-colors backdrop-blur-sm -mr-4 sm:-mr-12"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Dots */}
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(idx);
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  idx === currentIndex 
                    ? "bg-teal-accent w-6" 
                    : "bg-white/20 hover:bg-white/40"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
