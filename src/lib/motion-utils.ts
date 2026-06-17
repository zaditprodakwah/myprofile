'use client';

import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Wrapper to prevent hydration mismatch and handle SSR safely
export function useReducedMotion() {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(true); // Default true for safety/SSR
  const framerReducedMotion = useFramerReducedMotion();

  useEffect(() => {
    // Only update to actual preference once mounted
    setShouldReduceMotion(framerReducedMotion === true);
  }, [framerReducedMotion]);

  return shouldReduceMotion;
}

// Stagger configuration generator
export function useStaggeredReveal(delayPerItem = 0.05, baseDelay = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: baseDelay + i * delayPerItem,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };
}

// Spring physics constants matching globals.css
export const SPRING_SNAPPY = { type: 'spring', stiffness: 400, damping: 20 };
export const SPRING_SMOOTH = { type: 'spring', stiffness: 200, damping: 30 };
export const SPRING_BOUNCY = { type: 'spring', stiffness: 300, damping: 15 };
