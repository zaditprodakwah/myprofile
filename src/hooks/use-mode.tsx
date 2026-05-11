"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export type Mode = "marketing" | "academic" | "business" | "neutral";

interface ModeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [mode, setInternalMode] = useState<Mode>("neutral");

  useEffect(() => {
    // 1. Check URL query
    const urlMode = searchParams.get("mode") as Mode;
    if (urlMode && ["marketing", "academic", "business", "neutral"].includes(urlMode)) {
      setInternalMode(urlMode);
      localStorage.setItem("zadit-mode", urlMode);
      return;
    }

    // 2. Check LocalStorage
    const storedMode = localStorage.getItem("zadit-mode") as Mode;
    if (storedMode && ["marketing", "academic", "business", "neutral"].includes(storedMode)) {
      setInternalMode(storedMode);
    }
  }, [searchParams]);

  const setMode = (newMode: Mode) => {
    setInternalMode(newMode);
    localStorage.setItem("zadit-mode", newMode);
    
    // Update URL without reloading if on homepage or LP
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", newMode);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
}
