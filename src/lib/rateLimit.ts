/**
 * In-memory rate limiter for the /api/waitlist endpoint.
 *
 * NOTE: This resets when the server process restarts (fine for development
 * and low-traffic production). For distributed/serverless deployments, swap
 * this for an Upstash Redis rate limiter:
 *   https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
 */

interface Entry {
  count: number;
  resetAt: number;
}

// key → { count, resetAt }
const store = new Map<string, Entry>();

// Clean up stale entries every 5 minutes to avoid unbounded memory growth.
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    Array.from(store.entries()).forEach(([key, entry]) => {
      if (now > entry.resetAt) store.delete(key);
    });
  }, CLEANUP_INTERVAL_MS);
}

/**
 * Returns `true` if the request is allowed, `false` if it should be blocked.
 *
 * @param key        Typically the client IP address.
 * @param limit      Max requests per window (default 3).
 * @param windowMs   Window duration in milliseconds (default 60 s).
 */
export function checkRateLimit(
  key: string,
  limit = 3,
  windowMs = 60_000,
): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count += 1;
  return true;
}

/**
 * Extract a best-effort IP from Next.js request headers.
 * Prefers X-Forwarded-For (set by proxies/CDNs) then falls back to
 * X-Real-IP, then a placeholder.
 */
export function getClientIp(headers: Headers): string {
  const xff = headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();

  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return 'unknown';
}
