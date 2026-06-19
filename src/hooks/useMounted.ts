import { useState, useEffect } from 'react';

/**
 * Returns true after the component has mounted on the client.
 * Useful for avoiding SSR hydration mismatches.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setMounted(true);
  }, []);
  return mounted;
}
