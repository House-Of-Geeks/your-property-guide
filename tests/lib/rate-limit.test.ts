import { describe, it, expect } from "vitest";
import { checkRateLimit, ipKeyFromRequest } from "@/lib/rate-limit";

describe("rate-limit", () => {
  it("allows requests under the limit", () => {
    const key = `test-under-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(key, { limit: 5, windowMs: 60_000 }).allowed).toBe(true);
    }
  });

  it("blocks the 6th request within the window", () => {
    const key = `test-block-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key, { limit: 5, windowMs: 60_000 });
    }
    const result = checkRateLimit(key, { limit: 5, windowMs: 60_000 });
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSec).toBeGreaterThan(0);
  });

  it("resets after the window expires", async () => {
    const key = `test-reset-${Date.now()}`;
    for (let i = 0; i < 3; i++) {
      checkRateLimit(key, { limit: 3, windowMs: 30 });
    }
    expect(checkRateLimit(key, { limit: 3, windowMs: 30 }).allowed).toBe(false);
    await new Promise((r) => setTimeout(r, 50));
    expect(checkRateLimit(key, { limit: 3, windowMs: 30 }).allowed).toBe(true);
  });

  it("scopes per-key independently", () => {
    const a = `test-scope-a-${Date.now()}`;
    const b = `test-scope-b-${Date.now()}`;
    for (let i = 0; i < 5; i++) checkRateLimit(a, { limit: 5, windowMs: 60_000 });
    expect(checkRateLimit(a, { limit: 5, windowMs: 60_000 }).allowed).toBe(false);
    expect(checkRateLimit(b, { limit: 5, windowMs: 60_000 }).allowed).toBe(true);
  });
});

describe("ipKeyFromRequest", () => {
  it("uses first hop of x-forwarded-for", () => {
    const req = new Request("https://example.com", {
      headers: { "x-forwarded-for": "203.0.113.1, 10.0.0.1, 10.0.0.2" },
    });
    expect(ipKeyFromRequest(req)).toBe("203.0.113.1");
  });

  it("falls back to x-real-ip", () => {
    const req = new Request("https://example.com", {
      headers: { "x-real-ip": "198.51.100.5" },
    });
    expect(ipKeyFromRequest(req)).toBe("198.51.100.5");
  });

  it("returns 'unknown' when no IP headers present", () => {
    const req = new Request("https://example.com");
    expect(ipKeyFromRequest(req)).toBe("unknown");
  });
});
