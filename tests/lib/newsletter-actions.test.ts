import { describe, it, expect, vi, beforeEach } from "vitest";

// Spies live in the hoisted scope so the vi.mock factories below can
// reference them (factories are hoisted above module-level consts).
const { dbFindFirst, dbCreate, headersMock } = vi.hoisted(() => ({
  dbFindFirst: vi.fn(),
  dbCreate: vi.fn(),
  headersMock: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: { lead: { findFirst: dbFindFirst, create: dbCreate } },
}));

// The action reads the client IP via next/headers for rate limiting.
vi.mock("next/headers", () => ({ headers: headersMock }));

// Rate limiter is the REAL in-memory implementation — we exercise it for real.
import { subscribeToNewsletter } from "@/components/newsletter/actions";

// Give each test a unique source IP so the shared rate-limit buckets don't
// bleed across cases. Tests that specifically probe rate limiting pin their
// own fixed IP instead.
let ipCounter = 0;
function freshIp() {
  ipCounter += 1;
  const ip = `203.0.113.${ipCounter}`;
  headersMock.mockResolvedValue({ get: (n: string) => (n === "x-forwarded-for" ? ip : null) });
}

beforeEach(() => {
  dbFindFirst.mockReset();
  dbCreate.mockReset();
  dbFindFirst.mockResolvedValue(null);
  dbCreate.mockResolvedValue({ id: "nl_1" });
  freshIp();
});

describe("subscribeToNewsletter", () => {
  it("creates a newsletter Lead row for a valid new email", async () => {
    const res = await subscribeToNewsletter({ email: "reader@example.com" });
    expect(res.ok).toBe(true);
    expect(dbCreate).toHaveBeenCalledOnce();
    expect(dbCreate.mock.calls[0][0].data).toMatchObject({
      type: "newsletter",
      email: "reader@example.com",
      source: "newsletter-signup",
    });
  });

  it("normalises the stored email to lowercase", async () => {
    await subscribeToNewsletter({ email: "Reader@Example.COM" });
    expect(dbCreate.mock.calls[0][0].data.email).toBe("reader@example.com");
  });

  it("is idempotent: an existing subscriber does not create a second row", async () => {
    dbFindFirst.mockResolvedValue({ id: "existing" });
    const res = await subscribeToNewsletter({ email: "dupe@example.com" });
    expect(res.ok).toBe(true);
    expect(dbCreate).not.toHaveBeenCalled();
  });

  it("rejects an invalid email without touching the DB", async () => {
    const res = await subscribeToNewsletter({ email: "not-an-email" });
    expect(res.ok).toBe(false);
    expect(dbCreate).not.toHaveBeenCalled();
  });

  it("silently succeeds and persists nothing when the honeypot is filled", async () => {
    const res = await subscribeToNewsletter({
      email: "bot@example.com",
      website: "http://spam.example",
    });
    expect(res.ok).toBe(true); // bot must believe it worked
    expect(dbFindFirst).not.toHaveBeenCalled();
    expect(dbCreate).not.toHaveBeenCalled();
  });

  it("rate-limits a flood from a single IP (6th attempt onward blocked)", async () => {
    headersMock.mockResolvedValue({
      get: (n: string) => (n === "x-forwarded-for" ? "198.51.100.77" : null),
    });
    const results = [];
    for (let i = 0; i < 7; i++) {
      results.push(await subscribeToNewsletter({ email: `r${i}@example.com` }));
    }
    // Sliding 5/min window: first 5 pass, remainder are throttled.
    expect(results.slice(0, 5).every((r) => r.ok)).toBe(true);
    expect(results.filter((r) => !r.ok).length).toBe(2);
  });
});
