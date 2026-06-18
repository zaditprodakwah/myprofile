import { useState, useEffect } from 'react';

/**
 * Hook that returns true after the component has mounted on the client.
 * Useful to avoid hydration mismatches for client‑only UI.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
