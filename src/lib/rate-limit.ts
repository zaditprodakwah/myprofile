const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

/**
 * Basic in-memory rate limiter for serverless environments.
 * Note: State is not shared across Vercel edge instances, but it mitigates 
 * brute-force attacks from a single instance/warm container.
 * 
 * @param ip The IP address or identifier to rate limit
 * @param limit Max requests allowed in the window
 * @param windowMs Time window in milliseconds
 * @returns boolean True if allowed, False if rate limited
 */
export function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  
  // Cleanup expired entries
  for (const [key, val] of rateLimitMap.entries()) {
    if (val.expiresAt < now) {
      rateLimitMap.delete(key);
    }
  }

  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}
