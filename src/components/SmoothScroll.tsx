'use client';

import { useEffect, useRef } from 'react';
import TempLenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<TempLenis | null>(null);

  useEffect(() => {
    // Avoid double instantiation in React 19 Strict Mode
    if (lenisRef.current) return;

    const lenis = new TempLenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <>{children}</>;
}
