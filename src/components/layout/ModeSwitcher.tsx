"use client";

import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useMode, Mode } from "@/hooks/use-mode";
import { ChevronDown, TrendingUp, GraduationCap, Briefcase, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const modes: { id: Mode; label: string; icon: any; color: string }[] = [
  { id: "marketing", label: "Marketing Systems", icon: TrendingUp, color: "text-blue-500" },
  { id: "academic", label: "Academic Excellence", icon: GraduationCap, color: "text-emerald-500" },
  { id: "business", label: "Business Intelligence", icon: Briefcase, color: "text-amber-500" },
  { id: "neutral", label: "Neutral Mode", icon: Zap, color: "text-slate-400" },
];

export function ModeSwitcher() {
  const { mode, setMode } = useMode();

  const currentMode = modes.find((m) => m.id === mode) || modes[3];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium hover:bg-white/10 transition-all outline-hidden">
          <currentMode.icon size={14} className={currentMode.color} />
          <span className="hidden lg:inline">{currentMode.label}</span>
          <ChevronDown size={14} className="text-slate-500" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-60 min-w-[200px] bg-[#0f172a] border border-white/10 rounded-xl p-1.5 shadow-2xl animate-in fade-in zoom-in-95"
          sideOffset={8}
          align="end"
        >
          <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Switch Focus Mode
          </div>
          {modes.map((m) => (
            <DropdownMenu.Item
              key={m.id}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer outline-hidden transition-colors",
                mode === m.id ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
              onClick={() => setMode(m.id)}
            >
              <m.icon size={16} className={m.color} />
              {m.label}
              {mode === m.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
