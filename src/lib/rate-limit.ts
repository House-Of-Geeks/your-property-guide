// Tiny in-memory per-key rate limiter. Sliding window.
//
// Why in-memory: spam protection on /api/leads needs to be cheap and
// dependency-free. Across Vercel serverless instances each function has
// its own memory, so a determined attacker hitting many cold starts can
// dodge it. That's acceptable for the casual-bot threat model we're
// addressing here. If real abuse appears, swap the store for Upstash KV.

interface Bucket {
  windowStart: number;
  count: number;
}

const buckets = new Map<string, Bucket>();

const SWEEP_AFTER = 5 * 60 * 1000; // drop stale keys after 5 min idle
let lastSweep = Date.now();

function sweepIfDue(now: number, windowMs: number) {
  if (now - lastSweep < SWEEP_AFTER) return;
  lastSweep = now;
  const cutoff = now - windowMs * 2;
  for (const [key, b] of buckets) {
    if (b.windowStart < cutoff) buckets.delete(key);
  }
}

export interface RateLimitOptions {
  limit: number;     // max requests within the window
  windowMs: number;  // window length in ms
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
}

export function checkRateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  sweepIfDue(now, opts.windowMs);

  const bucket = buckets.get(key);
  if (!bucket || now - bucket.windowStart >= opts.windowMs) {
    buckets.set(key, { windowStart: now, count: 1 });
    return { allowed: true, remaining: opts.limit - 1, retryAfterSec: 0 };
  }

  if (bucket.count >= opts.limit) {
    const retryAfterSec = Math.ceil((opts.windowMs - (now - bucket.windowStart)) / 1000);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  bucket.count += 1;
  return { allowed: true, remaining: opts.limit - bucket.count, retryAfterSec: 0 };
}

// Pulls the best-available client IP from a NextRequest. Vercel sets
// x-forwarded-for; we take the first hop. Falls back to a synthetic key
// so the limiter still does something useful behind unknown proxies.
export function ipKeyFromRequest(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
