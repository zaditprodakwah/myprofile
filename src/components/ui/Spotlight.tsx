"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Spotlight({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { left, top } = containerRef.current.getBoundingClientRect();
      setMousePosition({ x: e.clientX - left, y: e.clientY - top });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden group", className)}
      style={
        {
          "--x": `${mousePosition.x}px`,
          "--y": `${mousePosition.y}px`,
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(400px_circle_at_var(--x)_var(--y),rgba(59,130,246,0.1),transparent_80%)]" />
      {children}
    </div>
  );
}
