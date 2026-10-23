import { generateKeyPairSync, sign } from "node:crypto";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const m = vi.hoisted(() => ({ applyEvents: vi.fn() }));
vi.mock("@/lib/mail/webhook", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/mail/webhook")>()),
  applyEvents: m.applyEvents,
}));

import { verifySignature } from "@/lib/mail/webhook";
import { POST } from "@/app/api/webhooks/sendgrid/route";
import { backoffMs, classifySendError } from "@/lib/mail/queue";
import { listUnsubscribeHeaders } from "@/lib/mail/unsubscribe";
import { renderBody, renderNewsletter } from "@/lib/mail/newsletter";
import { cutoverDecision, nextDue } from "@/lib/mail/sequences";

// The SendGrid Event Webhook's signature (21 Oct 2026): ECDSA over the
// timestamp header followed by the raw body, verified with the public key
// SendGrid shows for the webhook (base64 DER).

const { publicKey, privateKey } = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
const PUBLIC_B64 = publicKey.export({ type: "spki", format: "der" }).toString("base64");
const signed = (timestamp: string, body: string) => sign("sha256", Buffer.concat([Buffer.from(timestamp), Buffer.from(body)]), privateKey).toString("base64");
const now = Math.floor(Date.now() / 1000).toString();
const BODY = JSON.stringify([{ sg_event_id: "ev1", event: "delivered", email: "pat@example.com", ypg_mid: "m1", timestamp: Number(now) }]);

describe("verifySignature", () => {
  it("accepts SendGrid's signature over timestamp + raw body", () => {
    expect(verifySignature({ publicKey: PUBLIC_B64, signature: signed(now, BODY), timestamp: now, rawBody: Buffer.from(BODY) })).toBe(true);
  });
  it("accepts the key as PEM too", () => {
    const pem = publicKey.export({ type: "spki", format: "pem" }).toString();
    expect(verifySignature({ publicKey: pem, signature: signed(now, BODY), timestamp: now, rawBody: Buffer.from(BODY) })).toBe(true);
  });
  it("rejects a changed body (even re-serialised JSON), a wrong key, a missing header or a stale timestamp", () => {
    const sig = signed(now, BODY);
    expect(verifySignature({ publicKey: PUBLIC_B64, signature: sig, timestamp: now, rawBody: Buffer.from(JSON.stringify(JSON.parse(BODY), null, 1)) })).toBe(false);
    const other = generateKeyPairSync("ec", { namedCurve: "prime256v1" }).publicKey.export({ type: "spki", format: "der" }).toString("base64");
    expect(verifySignature({ publicKey: other, signature: sig, timestamp: now, rawBody: Buffer.from(BODY) })).toBe(false);
    expect(verifySignature({ publicKey: PUBLIC_B64, signature: null, timestamp: now, rawBody: Buffer.from(BODY) })).toBe(false);
    const old = String(Number(now) - 3 * 86_400);
    expect(verifySignature({ publicKey: PUBLIC_B64, signature: signed(old, BODY), timestamp: old, rawBody: Buffer.from(BODY) })).toBe(false);
  });
});

describe("POST /api/webhooks/sendgrid", () => {
  beforeEach(() => {
    m.applyEvents.mockReset();
    m.applyEvents.mockResolvedValue({ received: 1, applied: 1, duplicates: 0, ignored: 0 });
  });
  afterEach(() => vi.unstubAllEnvs());
  const req = (body: string, headers: Record<string, string>) => new Request("https://example.com/api/webhooks/sendgrid", { method: "POST", body, headers });

  it("answers 503 and applies nothing until the public key is configured", async () => {
    vi.stubEnv("SENDGRID_WEBHOOK_PUBLIC_KEY", "");
    const res = await POST(req(BODY, {}));
    expect(res.status).toBe(503);
    expect(m.applyEvents).not.toHaveBeenCalled();
  });

  it("rejects an unsigned or mis-signed batch with 403", async () => {
    vi.stubEnv("SENDGRID_WEBHOOK_PUBLIC_KEY", PUBLIC_B64);
    expect((await POST(req(BODY, {}))).status).toBe(403);
    const res = await POST(req(BODY.replace("delivered", "bounce"), { "X-Twilio-Email-Event-Webhook-Signature": signed(now, BODY), "X-Twilio-Email-Event-Webhook-Timestamp": now }));
    expect(res.status).toBe(403);
    expect(m.applyEvents).not.toHaveBeenCalled();
  });

  it("applies a correctly signed batch", async () => {
    vi.stubEnv("SENDGRID_WEBHOOK_PUBLIC_KEY", PUBLIC_B64);
    const res = await POST(req(BODY, { "X-Twilio-Email-Event-Webhook-Signature": signed(now, BODY), "X-Twilio-Email-Event-Webhook-Timestamp": now }));
    expect(res.status).toBe(200);
    expect(m.applyEvents).toHaveBeenCalledWith(JSON.parse(BODY));
  });
});

describe("send failures", () => {
  it("classifies SMTP replies: 4xx temporary, 5xx permanent", () => {
    expect(classifySendError({ responseCode: 421 })).toBe("temporary");
    expect(classifySendError({ responseCode: 451, command: "DATA" })).toBe("temporary");
    expect(classifySendError({ responseCode: 550, command: "RCPT TO" })).toBe("permanent");
    expect(classifySendError({ code: "EENVELOPE" })).toBe("permanent");
  });
  it("treats a connection that died before the message as temporary, and during DATA as ambiguous", () => {
    expect(classifySendError({ code: "ECONNECTION", command: "CONN" })).toBe("temporary");
    expect(classifySendError({ code: "ETIMEDOUT", command: "DATA" })).toBe("ambiguous");
    expect(classifySendError(new Error("socket hang up"))).toBe("temporary");
  });
  it("backs off 2, 10, 30, 120 then 360 minutes", () => {
    expect([1, 2, 3, 4, 5, 9].map((a) => backoffMs(a) / 60_000)).toEqual([2, 10, 30, 120, 360, 360]);
  });
});

describe("unsubscribe headers", () => {
  it("are RFC 8058 one-click headers pointing at our own endpoint", () => {
    const h = listUnsubscribeHeaders("tok_abc123def456");
    expect(h["List-Unsubscribe"]).toBe("<https://www.yourpropertyguide.com.au/api/unsubscribe?t=tok_abc123def456>");
    expect(h["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
  });
});

describe("newsletter rendering", () => {
  it("escapes HTML, allows only https links, and keeps a plain-text twin", () => {
    const { html, text } = renderBody("## Rates\n\nHello <script>x</script> [read](https://example.com/a) [bad](javascript:alert(1))\n\n- one\n- two");
    expect(html).not.toContain("<script>");
    expect(html).toContain('href="https://example.com/a"');
    expect(html).not.toMatch(/href="javascript/i);
    expect(html).toContain("<li");
    expect(text).toContain("read (https://example.com/a)");
    expect(text).toContain("- one");
  });
  it("carries the unsubscribe link and the reason in both parts", () => {
    const out = renderNewsletter({ subject: "S", heading: "H", body: "Para one is long enough.", showImage: false }, "https://www.yourpropertyguide.com.au/unsubscribe?t=x");
    expect(out.html).toContain("/unsubscribe?t=x");
    expect(out.text).toContain("/unsubscribe?t=x");
    expect(out.html).toContain("signed up for Your Property Guide’s updates");
  });
});

describe("series cutover policy", () => {
  const now = new Date("2026-11-04T00:00:00Z");
  it("doesn't start a series whose first email was due over 30 days ago", () => {
    expect(cutoverDecision({ sequenceStep: 0, sequenceNextAt: new Date("2026-10-01T00:00:00Z") }, now)).toBe("expire");
    expect(cutoverDecision({ sequenceStep: 0, sequenceNextAt: new Date("2026-10-17T00:00:00Z") }, now)).toBe("send");
    expect(cutoverDecision({ sequenceStep: 2, sequenceNextAt: new Date("2026-09-01T00:00:00Z") }, now)).toBe("send");
  });
  it("keeps the series' spacing from now after a late step, so there's no catch-up burst", () => {
    const joined = new Date("2026-10-14T00:00:00Z"); // seller-early: days 3, 8, 14, 21
    const next = nextDue("seller-early", 0, joined, now)!;
    expect((next.getTime() - now.getTime()) / 86_400_000).toBe(5);
    // On time, the planned date stands.
    const onTime = nextDue("seller-early", 0, joined, new Date("2026-10-17T00:00:00Z"))!;
    expect(onTime.toISOString()).toBe("2026-10-22T00:00:00.000Z");
    expect(nextDue("seller-early", 3, joined, now)).toBeNull();
  });
});
