import { describe, it, expect, vi, beforeAll, beforeEach, afterAll, afterEach } from "vitest";
import { lockTestDatabase } from "../helpers/db-lock";

// "Email me a copy" (POST /api/guides/email) against a real Postgres
// (21 Oct 2026): one request makes one lead and one guide email through the
// queue and SendGrid, never Sent 24/7; a double submit changes nothing; the
// tips series is a separate choice. Runs when TEST_DATABASE_URL points at a
// throwaway database (see tests/lib/mail-queue.db.test.ts).

const URL_ = process.env.TEST_DATABASE_URL;
const m = vi.hoisted(() => ({ sendMail: vi.fn(), deferred: [] as Promise<unknown>[] }));
vi.mock("@/lib/email", async (importOriginal) => ({ ...(await importOriginal<typeof import("@/lib/email")>()), sendMail: m.sendMail }));
vi.mock("next/server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/server")>()),
  after: (task: () => Promise<unknown>) => {
    m.deferred.push(task());
  },
}));
vi.mock("@/lib/rate-limit", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/rate-limit")>()),
  checkRateLimit: () => ({ allowed: true, remaining: 1, resetAt: Date.now() }),
}));

let db: typeof import("@/lib/db").db;
let POST: typeof import("@/app/api/guides/email/route").POST;
let suppress: typeof import("@/lib/mail/suppression").suppress;

const req = (body: Record<string, unknown>) =>
  new Request("https://www.yourpropertyguide.com.au/api/guides/email", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
const valid = { guide: "selling", firstName: "Pat", email: "Pat@Example.com", requestKey: "req-0001-aaaa" };
const settle = async () => {
  await Promise.all(m.deferred.splice(0));
};

describe.skipIf(!URL_)("POST /api/guides/email on Postgres", () => {
  let unlock: () => Promise<void> = async () => {};
  beforeAll(async () => {
    unlock = await lockTestDatabase(URL_!);
    process.env.DATABASE_URL = URL_;
    db = (await import("@/lib/db")).db;
    POST = (await import("@/app/api/guides/email/route")).POST;
    suppress = (await import("@/lib/mail/suppression")).suppress;
  });
  beforeEach(async () => {
    m.sendMail.mockReset();
    m.sendMail.mockResolvedValue({ response: "250 Ok: queued as Q1", providerMessageId: "Q1", logged: false });
    await db.$executeRawUnsafe(`TRUNCATE "EmailEvent", "EmailMessage", "EmailSuppression", "LeadEvent", "Lead" CASCADE`);
  });
  afterEach(() => vi.unstubAllEnvs());
  afterAll(async () => {
    await db?.$disconnect();
    await unlock();
  });

  it("makes one learning lead and sends the right guide through SendGrid, and only to the reader and the team", async () => {
    vi.stubEnv("LEAD_MAGNET_TO_SENT247", "true");
    const res = await POST(req(valid));
    await settle();
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, status: "queued" });
    const lead = await db.lead.findFirstOrThrow();
    expect(lead).toMatchObject({ type: "guide-download", kind: "learning", journey: "selling", email: "pat@example.com", marketingConsent: false, sequence: null });
    expect(lead.consentText).toBeTruthy();
    const msgs = await db.emailMessage.findMany({ orderBy: { createdAt: "asc" } });
    expect(msgs.map((x) => [x.stream, x.status])).toEqual([
      ["guide-delivery", "accepted"],
      ["team", "accepted"],
    ]);
    expect(msgs[0].subject).toMatch(/Selling/i);
    const recipients = m.sendMail.mock.calls.map((c) => String(c[0].to).toLowerCase());
    expect(recipients[0]).toBe("pat@example.com");
    expect(recipients.some((r) => r.includes("sent247") || r.includes("sent 24"))).toBe(false);
    expect(m.sendMail).toHaveBeenCalledTimes(2);
  });

  it("a double submit (same request key) returns the first request and sends nothing more", async () => {
    const [a, b] = await Promise.all([POST(req(valid)), POST(req(valid))]);
    await settle();
    const [ja, jb] = [await a.json(), await b.json()];
    expect(ja.ok && jb.ok).toBe(true);
    expect(ja.requestId).toBe(jb.requestId);
    expect(await db.lead.count()).toBe(1);
    expect(await db.emailMessage.count({ where: { stream: "guide-delivery" } })).toBe(1);
  });

  it("starts the tips series only when it's switched on and the reader ticked the separate box", async () => {
    await POST(req({ ...valid, requestKey: "req-0002-bbbb", marketingConsent: true }));
    expect((await db.lead.findFirstOrThrow({ where: { requestKey: "req-0002-bbbb" } })).sequence).toBeNull();
    vi.stubEnv("GUIDANCE_SEQUENCE_ENABLED", "true");
    await POST(req({ ...valid, requestKey: "req-0003-cccc", marketingConsent: false }));
    expect((await db.lead.findFirstOrThrow({ where: { requestKey: "req-0003-cccc" } })).sequence).toBeNull();
    await POST(req({ ...valid, requestKey: "req-0004-dddd", marketingConsent: true }));
    const on = await db.lead.findFirstOrThrow({ where: { requestKey: "req-0004-dddd" } });
    expect(on.sequence).toBeTruthy();
    expect(on.marketingConsent).toBe(true);
    await settle();
  });

  it("says honestly when the address can't be emailed (bounced before), and never claims it's on its way", async () => {
    await suppress("pat@example.com", "all", "bounce", "sendgrid-webhook");
    const res = await POST(req(valid));
    await settle();
    expect(res.status).toBe(500);
    expect(await res.json()).toMatchObject({ ok: false });
    expect(await db.emailMessage.count({ where: { stream: "guide-delivery", status: "suppressed" } })).toBe(1);
    expect(m.sendMail.mock.calls.every((c) => String(c[0].to).toLowerCase() !== "pat@example.com")).toBe(true);
  });

  it("a temporary SendGrid failure still answers 'queued': the email exists and the cron retries it", async () => {
    m.sendMail.mockRejectedValueOnce(Object.assign(new Error("421 try later"), { responseCode: 421 }));
    const res = await POST(req(valid));
    await settle();
    expect(await res.json()).toMatchObject({ ok: true, status: "queued" });
    const g = await db.emailMessage.findFirstOrThrow({ where: { stream: "guide-delivery" } });
    expect(g.status).toBe("queued");
    expect(g.attempts).toBe(1);
  });

  it("asks for a name and a valid address, and nothing else", async () => {
    const res = await POST(req({ ...valid, firstName: "", email: "nope" }));
    expect(res.status).toBe(400);
    expect((await res.json()).errors).toEqual({ firstName: expect.any(String), email: expect.any(String) });
    expect(await db.lead.count()).toBe(0);
  });
});
