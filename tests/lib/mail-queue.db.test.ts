import { describe, it, expect, vi, beforeAll, beforeEach, afterAll } from "vitest";
import { lockTestDatabase } from "../helpers/db-lock";

// The email queue, webhook, suppression, series and newsletter against a
// real Postgres (21 Oct 2026). Atomic claiming (FOR UPDATE SKIP LOCKED),
// unique keys and conditional updates only mean something on a real
// database, so these run when TEST_DATABASE_URL points at a throwaway one
// (with the schema pushed: `DATABASE_URL=… npx prisma db push`) and are
// skipped otherwise. Never point it at production: every test truncates.

const URL_ = process.env.TEST_DATABASE_URL;
const sendMail = vi.hoisted(() => vi.fn());
vi.mock("@/lib/email", async (importOriginal) => ({ ...(await importOriginal<typeof import("@/lib/email")>()), sendMail }));

type Mods = {
  db: typeof import("@/lib/db").db;
  queue: typeof import("@/lib/mail/queue");
  webhook: typeof import("@/lib/mail/webhook");
  sup: typeof import("@/lib/mail/suppression");
  seq: typeof import("@/lib/mail/sequences");
  nl: typeof import("@/lib/mail/newsletter");
};
let M: Mods;

const base = (key: string, over: Partial<import("@/lib/mail/queue").EnqueueInput> = {}) => ({
  key,
  category: "transactional" as const,
  stream: "guide-delivery",
  template: "guide/selling",
  to: "Pat@Example.com",
  subject: "Your copy",
  html: "<p>hi</p>",
  text: "hi",
  ...over,
});

describe.skipIf(!URL_)("email system on Postgres", () => {
  let unlock: () => Promise<void> = async () => {};
  beforeAll(async () => {
    unlock = await lockTestDatabase(URL_!);
    process.env.DATABASE_URL = URL_;
    M = {
      db: (await import("@/lib/db")).db,
      queue: await import("@/lib/mail/queue"),
      webhook: await import("@/lib/mail/webhook"),
      sup: await import("@/lib/mail/suppression"),
      seq: await import("@/lib/mail/sequences"),
      nl: await import("@/lib/mail/newsletter"),
    };
  });
  beforeEach(async () => {
    sendMail.mockReset();
    sendMail.mockResolvedValue({ response: "250 Ok: queued as Q1", providerMessageId: "Q1", logged: false });
    await M.db.$executeRawUnsafe(`TRUNCATE "EmailEvent", "EmailMessage", "EmailSuppression", "NewsletterIssue", "LeadEvent", "Lead" CASCADE`);
  });
  afterAll(async () => {
    await M?.db.$disconnect();
    await unlock();
  });

  it("enqueueing the same key twice (even at once) makes one email", async () => {
    const [a, b] = await Promise.all([M.queue.enqueueEmail(base("k1")), M.queue.enqueueEmail(base("k1"))]);
    expect(a.id).toBe(b.id);
    expect([a.created, b.created].filter(Boolean)).toHaveLength(1);
    expect(await M.db.emailMessage.count()).toBe(1);
    expect((await M.db.emailMessage.findFirstOrThrow()).toEmail).toBe("pat@example.com");
  });

  it("overlapping runs claim disjoint rows, so nothing is sent twice", async () => {
    for (let i = 0; i < 30; i++) await M.queue.enqueueEmail(base(`k${i}`));
    const [a, b, c] = await Promise.all([M.queue.claimDue(15, "runA"), M.queue.claimDue(15, "runB"), M.queue.claimDue(15, "runC")]);
    const all = [...a, ...b, ...c];
    expect(new Set(all).size).toBe(all.length);
    expect(all.length).toBe(30);
  });

  it("two processQueue runs at once send each email exactly once", async () => {
    for (let i = 0; i < 12; i++) await M.queue.enqueueEmail(base(`p${i}`));
    await Promise.all([M.queue.processQueue({ limit: 10, runId: "A" }), M.queue.processQueue({ limit: 10, runId: "B" })]);
    expect(sendMail).toHaveBeenCalledTimes(12);
    expect(await M.db.emailMessage.count({ where: { status: "accepted" } })).toBe(12);
  });

  it("records SendGrid's acceptance and its queue id, with our opaque id as the custom argument", async () => {
    const q = await M.queue.enqueueEmail(base("acc"));
    expect(await M.queue.sendQueuedNow(q.id)).toBe("accepted");
    const row = await M.db.emailMessage.findUniqueOrThrow({ where: { id: q.id } });
    expect(row.status).toBe("accepted");
    expect(row.providerMessageId).toBe("Q1");
    expect(row.deliveredAt).toBeNull();
    expect(sendMail.mock.calls[0][0].customArgs).toEqual({ ypg_mid: q.id });
  });

  it("retries a temporary failure with backoff, then stops at maxAttempts", async () => {
    sendMail.mockRejectedValue(Object.assign(new Error("421 later"), { responseCode: 421 }));
    const q = await M.queue.enqueueEmail(base("tmp", { maxAttempts: 2 }));
    expect(await M.queue.sendQueuedNow(q.id)).toBe("retry");
    let row = await M.db.emailMessage.findUniqueOrThrow({ where: { id: q.id } });
    expect(row.status).toBe("queued");
    expect(row.attempts).toBe(1);
    expect(row.nextAttemptAt.getTime()).toBeGreaterThan(Date.now() + 60_000);
    // Not due yet: the cron leaves it.
    expect((await M.queue.processQueue({ runId: "early" })).claimed).toBe(0);
    await M.db.emailMessage.update({ where: { id: q.id }, data: { nextAttemptAt: new Date(Date.now() - 1000) } });
    await M.queue.processQueue({ runId: "later" });
    row = await M.db.emailMessage.findUniqueOrThrow({ where: { id: q.id } });
    expect(row.status).toBe("failed");
    expect(row.attempts).toBe(2);
  });

  it("marks a permanent refusal failed, and an outcome it can't know ambiguous (never resent automatically)", async () => {
    sendMail.mockRejectedValueOnce(Object.assign(new Error("550 nope"), { responseCode: 550 }));
    const p = await M.queue.enqueueEmail(base("perm"));
    expect(await M.queue.sendQueuedNow(p.id)).toBe("failed");
    sendMail.mockRejectedValueOnce(Object.assign(new Error("timeout"), { code: "ETIMEDOUT", command: "DATA" }));
    const a = await M.queue.enqueueEmail(base("amb"));
    expect(await M.queue.sendQueuedNow(a.id)).toBe("ambiguous");
    expect((await M.queue.processQueue({ runId: "x" })).claimed).toBe(0);
    // A later "processed" event settles it as accepted.
    await M.webhook.applyEvents([{ sg_event_id: "e-proc", event: "processed", email: "pat@example.com", ypg_mid: a.id, timestamp: Date.now() / 1000 }]);
    expect((await M.db.emailMessage.findUniqueOrThrow({ where: { id: a.id } })).status).toBe("accepted");
  });

  it("releases a run that died mid-send as ambiguous", async () => {
    const q = await M.queue.enqueueEmail(base("stale"));
    await M.db.emailMessage.update({ where: { id: q.id }, data: { status: "sending", lockedAt: new Date(Date.now() - 20 * 60_000), lockedBy: "dead" } });
    expect(await M.queue.releaseStale()).toBe(1);
    expect((await M.db.emailMessage.findUniqueOrThrow({ where: { id: q.id } })).status).toBe("ambiguous");
  });

  it("suppression: marketing unsubscribes stop marketing only; bounces and complaints stop everything", async () => {
    await M.sup.suppress("pat@example.com", "marketing", "unsubscribe", "app");
    expect((await M.queue.enqueueEmail(base("m1", { category: "marketing", stream: "newsletter" }))).status).toBe("suppressed");
    expect((await M.queue.enqueueEmail(base("t1"))).status).toBe("queued");
    await M.sup.suppress("PAT@example.com", "all", "bounce", "sendgrid-webhook");
    expect((await M.queue.enqueueEmail(base("t2"))).status).toBe("suppressed");
  });

  it("a suppression added after queueing still stops the send", async () => {
    const q = await M.queue.enqueueEmail(base("late", { category: "marketing", stream: "newsletter" }));
    await M.sup.suppress("pat@example.com", "marketing", "unsubscribe", "app");
    expect(await M.queue.sendQueuedNow(q.id)).toBe("suppressed");
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("webhook: delivered is recorded once, bounces suppress, unsubscribes stop every duplicate row", async () => {
    const lead1 = await M.db.lead.create({ data: { type: "guide-download", firstName: "Pat", email: "Pat@Example.com", token: "tok_aaaaaaaaaaaa", sequence: "seller-early", sequenceStep: 1, sequenceNextAt: new Date() } });
    await M.db.lead.create({ data: { type: "newsletter", firstName: "n", email: "pat@example.com", marketingConsent: true, token: "tok_bbbbbbbbbbbb" } });
    const q = await M.queue.enqueueEmail(base("w1", { leadId: lead1.id }));
    await M.queue.sendQueuedNow(q.id);
    const ev = { sg_event_id: "e1", event: "delivered", email: "pat@example.com", ypg_mid: q.id, timestamp: Date.now() / 1000 };
    const first = await M.webhook.applyEvents([ev, ev]);
    expect(first).toMatchObject({ applied: 1, duplicates: 1 });
    expect((await M.webhook.applyEvents([ev])).duplicates).toBe(1);
    const row = await M.db.emailMessage.findUniqueOrThrow({ where: { id: q.id } });
    expect(row.status).toBe("delivered");
    expect(await M.db.leadEvent.count({ where: { leadId: lead1.id, type: "email-delivered" } })).toBe(1);
    // A late "deferred" doesn't undo delivered.
    await M.webhook.applyEvents([{ sg_event_id: "e2", event: "deferred", email: "pat@example.com", ypg_mid: q.id, timestamp: Date.now() / 1000 }]);
    expect((await M.db.emailMessage.findUniqueOrThrow({ where: { id: q.id } })).status).toBe("delivered");
    // Unsubscribe via SendGrid: every row for the address stops, in any case.
    await M.webhook.applyEvents([{ sg_event_id: "e3", event: "unsubscribe", email: "pat@example.com", ypg_mid: q.id, timestamp: Date.now() / 1000 }]);
    expect(await M.db.lead.count({ where: { unsubscribedAt: null } })).toBe(0);
    expect(await M.db.emailSuppression.count({ where: { email: "pat@example.com", scope: "marketing" } })).toBe(1);
    // Events for another brand's mail (no ypg_mid) are ignored.
    expect((await M.webhook.applyEvents([{ sg_event_id: "e4", event: "bounce", email: "x@y.com", timestamp: 1 }])).ignored).toBe(1);
    const b = await M.queue.enqueueEmail(base("w2", { to: "bounce@example.com" }));
    await M.webhook.applyEvents([{ sg_event_id: "e5", event: "bounce", type: "bounce", email: "bounce@example.com", reason: "550 no user", ypg_mid: b.id, timestamp: Date.now() / 1000 }]);
    expect((await M.db.emailMessage.findUniqueOrThrow({ where: { id: b.id } })).status).toBe("bounced");
    expect(await M.db.emailSuppression.count({ where: { email: "bounce@example.com", scope: "all" } })).toBe(1);
  });

  it("series: queues one step per run, never twice when runs overlap, and keeps completed steps", async () => {
    const now = new Date();
    const lead = await M.db.lead.create({
      data: { type: "plan-email", firstName: "Pat", email: "pat@example.com", token: "tok_cccccccccccc", sequence: "seller-early", sequenceStep: 1, sequenceNextAt: new Date(now.getTime() - 3 * 86_400_000), createdAt: new Date(now.getTime() - 20 * 86_400_000) },
    });
    const [a, b] = await Promise.all([M.seq.queueDueSeries(now), M.seq.queueDueSeries(now)]);
    expect(a.queued + b.queued).toBe(1);
    const msgs = await M.db.emailMessage.findMany({ where: { stream: "sequence" } });
    expect(msgs).toHaveLength(1);
    expect(msgs[0].key).toBe(`seq:${lead.id}:seller-early:1`);
    expect((msgs[0].headers as Record<string, string>)["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
    const after1 = await M.db.lead.findUniqueOrThrow({ where: { id: lead.id } });
    expect(after1.sequenceStep).toBe(2);
    // The next step keeps the series' spacing from now (6 days for step 2→3), no burst.
    expect(after1.sequenceNextAt!.getTime() - now.getTime()).toBeGreaterThanOrEqual(6 * 86_400_000 - 1000);
  });

  it("series cutover: a series never started over 30 days ago isn't started; a duplicate address runs one series", async () => {
    const now = new Date();
    await M.db.lead.create({ data: { type: "plan-email", firstName: "A", email: "a@example.com", token: "tok_dddddddddddd", sequence: "buyer-early", sequenceStep: 0, sequenceNextAt: new Date(now.getTime() - 40 * 86_400_000) } });
    const older = await M.db.lead.create({ data: { type: "plan-email", firstName: "B", email: "b@example.com", token: "tok_eeeeeeeeeeee", sequence: "buyer-early", sequenceStep: 0, sequenceNextAt: new Date(now.getTime() - 86_400_000), createdAt: new Date(now.getTime() - 5 * 86_400_000) } });
    await M.db.lead.create({ data: { type: "guide-download", firstName: "B", email: "B@example.com", token: "tok_ffffffffffff", sequence: "seller-early", sequenceStep: 0, sequenceNextAt: new Date(now.getTime() - 86_400_000), createdAt: new Date(now.getTime() - 2 * 86_400_000) } });
    const preview = await M.seq.previewSeries(now);
    expect(preview).toMatchObject({ dueNow: 3, wouldExpire: 1, duplicatesByAddress: 1 });
    const run = await M.seq.queueDueSeries(now);
    expect(run).toMatchObject({ queued: 1, expired: 1, merged: 1 });
    const msg = await M.db.emailMessage.findFirstOrThrow({ where: { stream: "sequence" } });
    expect(msg.leadId).toBe(older.id);
  });

  it("newsletter: the audience is consented newsletter signups, one per address; publishing twice sends once", async () => {
    await M.db.lead.create({ data: { type: "newsletter", firstName: "n", email: "one@example.com", marketingConsent: true, token: "tok_n1n1n1n1n1n1" } });
    await M.db.lead.create({ data: { type: "newsletter", firstName: "n", email: "ONE@example.com", marketingConsent: true, token: "tok_n2n2n2n2n2n2" } });
    await M.db.lead.create({ data: { type: "newsletter", firstName: "n", email: "gone@example.com", marketingConsent: true, unsubscribedAt: new Date(), token: "tok_n3n3n3n3n3n3" } });
    await M.db.lead.create({ data: { type: "newsletter", firstName: "n", email: "bounced@example.com", marketingConsent: true, token: "tok_n4n4n4n4n4n4" } });
    await M.db.lead.create({ data: { type: "guide-download", firstName: "g", email: "guide@example.com", marketingConsent: true, token: "tok_n5n5n5n5n5n5" } });
    await M.sup.suppress("bounced@example.com", "all", "bounce", "sendgrid-webhook");
    const aud = await M.nl.newsletterAudience();
    expect(aud.members.map((x) => x.email)).toEqual(["one@example.com"]);
    const issue = await M.db.newsletterIssue.create({ data: { subject: "News", heading: "Hello", body: "A paragraph that is long enough." } });
    expect((await M.nl.publishIssue(issue.id, "andy")).queued).toBe(1);
    expect((await M.nl.publishIssue(issue.id, "andy")).alreadyPublished).toBe(true);
    const msgs = await M.db.emailMessage.findMany({ where: { newsletterIssueId: issue.id, stream: "newsletter" } });
    expect(msgs).toHaveLength(1);
    expect(msgs[0].category).toBe("marketing");
    expect(msgs[0].html).toContain("/unsubscribe?t=tok_n1n1n1n1n1n1");
  });
});
