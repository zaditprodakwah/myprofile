"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AIPulseProps {
  messages?: string[];
  className?: string;
  delay?: number;
}

const defaultMessages = [
  "Sinyal radar aman! Data terbaru sudah mendarat. Sikat!",
  "Lagi nyisir pola market... Waduh, ada yang menarik nih!",
  "Zadit Hub siap tempur. Apa yang mau kita bedah hari ini?",
  "Beres! Sinkronisasi database lancar jaya.",
  "Tenang, radar tetap stand by 24/7 buat pantau sinyal."
];

export function AIPulse({ 
  messages = defaultMessages, 
  className,
  delay = 8000 
}: AIPulseProps) {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, delay);

    return () => clearInterval(timer);
  }, [messages.length, delay, isVisible]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={cn(
          "fixed bottom-8 right-8 z-50 max-w-xs",
          className
        )}
      >
        <div className="relative p-5 rounded-3xl bg-blue-600 text-white shadow-2xl shadow-blue-500/20 border border-blue-400/30 overflow-hidden group">
          {/* Animated Background Pulse */}
          <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/10 blur-2xl rounded-full" />
          
          <div className="relative flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/20 flex items-center justify-center shrink-0 animate-pulse">
              <Sparkles size={20} className="text-white fill-white" />
            </div>
            
            <div className="space-y-1">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 opacity-80">
                Antigravity Intelligence
              </div>
              <motion.p 
                key={index}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs font-bold leading-relaxed pr-4"
              >
                {messages[index]}
              </motion.p>
            </div>

            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-0 -right-1 p-1 text-white/40 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
