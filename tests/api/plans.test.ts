import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const m = vi.hoisted(() => ({ findUnique: vi.fn(), create: vi.fn(), eventCreate: vi.fn(), sendMail: vi.fn() }));
vi.mock("@/lib/db", () => ({ db: { lead: { findUnique: m.findUnique, create: m.create }, leadEvent: { create: m.eventCreate } } }));
vi.mock("@/lib/email", () => ({ sendMail: m.sendMail, ANDY_EMAIL: "andy@theandylife.com", LEADS_CC_EMAIL: "cc@example.com", transporter: {}, DEFAULT_FROM: "f" }));

import { POST } from "@/app/api/plans/route";
import { PLAN_EMAIL_CONSENT, PLAN_EMAIL_CONSENT_PLAIN } from "@/lib/plans/consent";

const req = (body: unknown) =>
  new Request("https://example.com/api/plans", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 250) + 1}` },
    body: JSON.stringify(body),
  });

const base = { answers: { j: "selling", s: "qld", t: "0-3-months", ss: "preparing" }, email: "pat@example.com", wantsSequence: false, requestKey: "plan-key-1234" };

beforeEach(() => {
  Object.values(m).forEach((f) => f.mockReset());
  m.findUnique.mockResolvedValue(null);
  m.create.mockResolvedValue({ id: "lead_plan_1" });
  m.eventCreate.mockResolvedValue({});
  m.sendMail.mockResolvedValue(undefined);
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/plans (the learning path)", () => {
  it("emails the plan, stores a learning row, and starts no series without the tick", async () => {
    const body = await (await POST(req(base))).json();
    expect(body).toMatchObject({ ok: true, emailed: true, sequence: null });
    const data = m.create.mock.calls[0][0].data;
    expect(data).toMatchObject({ type: "plan-email", kind: "learning", journey: "selling", state: "QLD", stage: "preparing", marketingConsent: false, sequence: null });
    // The words the form showed (20 Oct 2026); the series is off, so no box was offered.
    expect(data.consentText).toBe(PLAN_EMAIL_CONSENT_PLAIN);
    expect(data.phone).toBeUndefined();
    const mail = m.sendMail.mock.calls[0][0];
    expect(mail.to).toBe("pat@example.com");
    expect(mail.subject).toBe("Your next-step plan: getting ready to sell");
    expect(mail.html).toContain("This is a one-off email");
    // Never a team notification for a learning request.
    expect(m.sendMail).toHaveBeenCalledTimes(1);
  });

  it("ignores a series tick while the series is switched off, so nobody waits for emails that never come", async () => {
    const body = await (await POST(req({ ...base, wantsSequence: true }))).json();
    expect(body.sequence).toBeNull();
    const data = m.create.mock.calls[0][0].data;
    expect(data).toMatchObject({ marketingConsent: false, sequence: null, sequenceNextAt: null });
    expect(m.sendMail.mock.calls[0][0].html).not.toContain("email series");
  });

  it("starts the right series only with the separate tick, with an unsubscribe link, when the series is on", async () => {
    vi.stubEnv("GUIDANCE_SEQUENCE_ENABLED", "true");
    const body = await (await POST(req({ ...base, wantsSequence: true }))).json();
    expect(body.sequence).toBe("seller-early");
    const data = m.create.mock.calls[0][0].data;
    expect(data.marketingConsent).toBe(true);
    expect(data.consentText).toBe(PLAN_EMAIL_CONSENT);
    expect(data.sequenceNextAt).toBeInstanceOf(Date);
    expect(m.sendMail.mock.calls[0][0].html).toContain("/api/unsubscribe?t=");
  });

  it("returns the first row for a double submit", async () => {
    m.findUnique.mockResolvedValueOnce({ id: "lead_plan_existing" });
    const body = await (await POST(req(base))).json();
    expect(body).toMatchObject({ duplicate: true, id: "lead_plan_existing" });
    expect(m.create).not.toHaveBeenCalled();
    expect(m.sendMail).not.toHaveBeenCalled();
  });

  it("rejects a bad email or missing answers", async () => {
    expect((await POST(req({ ...base, email: "nope" }))).status).toBe(400);
    expect((await POST(req({ ...base, answers: {} }))).status).toBe(400);
  });
});
