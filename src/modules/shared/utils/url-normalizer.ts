/**
 * Determines the globally normalized version of a URL for Phase 3 Crawl Queue Idempotency.
 * RULE:
 * - lowercase
 * - remove http/https
 * - remove www.
 * - strip trailing slash
 * - remove query params
 * - remove fragments
 */
export function normalize_url(url: string): string {
  try {
    const parsed = new URL(url.toLowerCase().trim());
    // host includes domain, we want to strip www.
    let host = parsed.host;
    if (host.startsWith('www.')) {
      host = host.substring(4);
    }
    
    // path without trailing slash
    let path = parsed.pathname;
    if (path.endsWith('/') && path.length > 1) {
      path = path.slice(0, -1);
    }

    return `${host}${path}`;
  } catch {
    // Fallback if URL parser fails
    let cleaned = url.toLowerCase().trim();
    cleaned = cleaned.replace(/^https?:\/\//, '');
    if (cleaned.startsWith('www.')) {
      cleaned = cleaned.substring(4);
    }
    // Remove fragments and query params
    cleaned = cleaned.split('#')[0].split('?')[0];
    if (cleaned.endsWith('/')) {
      cleaned = cleaned.slice(0, -1);
    }
    return cleaned;
  }
}
