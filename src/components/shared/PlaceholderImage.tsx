"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  text: string;
  className?: string;
  variant?: "minimal" | "abstract";
}

export function PlaceholderImage({ text, className, variant = "abstract" }: PlaceholderImageProps) {
  // Simple hash function for consistent colors
  const getHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const hash = getHash(text);
  const hue1 = hash % 360;
  const hue2 = (hash + 60) % 360;
  
  if (variant === "minimal") {
    return (
      <div 
        className={cn(
          "w-full h-full flex items-center justify-center bg-slate-900 border border-white/5",
          className
        )}
      >
        <span className="text-2xl font-black text-slate-700 uppercase tracking-tighter opacity-50">
          {text.slice(0, 2)}
        </span>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "w-full h-full relative overflow-hidden bg-slate-950",
        className
      )}
    >
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `linear-gradient(135deg, hsl(${hue1}, 70%, 50%), hsl(${hue2}, 70%, 50%))`,
          filter: "blur(40px)"
        }}
      />
      
      {/* Pattern Grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
      
      {/* Central Brand Mark or Text */}
      <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto backdrop-blur-sm">
            <span className="text-lg font-black text-white/50">{text.charAt(0)}</span>
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] line-clamp-1">
            {text}
          </div>
        </div>
      </div>
      
      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-slate-950/50" />
    </div>
  );
}
