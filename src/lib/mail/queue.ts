import { randomUUID } from "node:crypto";
import { Prisma } from "@/generated/prisma/client";
import { db as prisma } from "@/lib/db";
import { sendMail } from "@/lib/email";
import { activeSuppression, normaliseEmail, type MailCategory } from "./suppression";

// The durable email queue (21 Oct 2026). Every email the site sends is an
// EmailMessage row with a unique key, created before anything is sent:
//
//   enqueueEmail()  creates the row (or finds the one already there for the
//                   key) and checks suppression. A double submit, a retried
//                   request or a second cron run can't make a second email.
//   sendQueuedNow() claims one row and sends it straight away, for the
//                   emails someone is waiting for (a guide, a plan, a
//                   confirmation). Called from after() in the routes.
//   processQueue()  the cron (/api/cron/email): claims due rows with
//                   FOR UPDATE SKIP LOCKED, so overlapping runs never take
//                   the same row, and sends them.
//
// Outcomes. SendGrid accepting a message is "accepted", not delivered:
// "delivered", "bounced" and "dropped" only come from the signed Event
// Webhook (./webhook.ts). A temporary failure (a 4xx reply, a connection
// that never reached the message) is retried with backoff up to
// maxAttempts. A permanent refusal (5xx) is "failed". When we can't tell
// whether SendGrid took the message (the connection died after the message
// was handed over), the row is "ambiguous": it is never resent
// automatically, because that could send it twice. A webhook "processed"
// or "delivered" event for it settles it; otherwise the team can retry it
// from the admin.

export interface EnqueueInput {
  key: string;
  category: MailCategory;
  stream: string;
  template: string;
  to: string;
  /** Operational email only (the team's CC). */
  cc?: string;
  subject: string;
  html: string;
  text: string;
  leadId?: string | null;
  newsletterIssueId?: string | null;
  replyTo?: string;
  headers?: Record<string, string>;
  /** Not before (a series step, a delayed check-in). Default: now. */
  sendAt?: Date;
  maxAttempts?: number;
}

export interface EnqueueResult {
  id: string;
  status: string;
  /** False when a row for this key already existed (nothing new was queued). */
  created: boolean;
}

export async function enqueueEmail(input: EnqueueInput): Promise<EnqueueResult> {
  const to = normaliseEmail(input.to);
  const existing = await prisma.emailMessage.findUnique({ where: { key: input.key }, select: { id: true, status: true } });
  if (existing) return { ...existing, created: false };
  const blocked = await activeSuppression(to, input.category);
  try {
    const row = await prisma.emailMessage.create({
      data: {
        key: input.key,
        category: input.category,
        stream: input.stream,
        template: input.template,
        toEmail: to,
        cc: input.cc ?? null,
        leadId: input.leadId ?? null,
        newsletterIssueId: input.newsletterIssueId ?? null,
        subject: input.subject,
        html: input.html,
        text: input.text,
        replyTo: input.replyTo ?? null,
        headers: input.headers ?? undefined,
        nextAttemptAt: input.sendAt ?? new Date(),
        maxAttempts: input.maxAttempts ?? 5,
        status: blocked ? "suppressed" : "queued",
        lastError: blocked ? `suppressed: ${blocked.reason} (${blocked.scope})` : null,
      },
      select: { id: true, status: true },
    });
    return { ...row, created: true };
  } catch (err) {
    // Two requests raced on the same key: the other one created it.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      const row = await prisma.emailMessage.findUnique({ where: { key: input.key }, select: { id: true, status: true } });
      if (row) return { ...row, created: false };
    }
    throw err;
  }
}

/** Backoff after the nth failed attempt (1-based): 2 min, 10 min, 30 min, 2 h, 6 h. */
export function backoffMs(attempt: number): number {
  const steps = [2, 10, 30, 120, 360];
  return steps[Math.min(Math.max(attempt, 1), steps.length) - 1] * 60_000;
}

export type FailureKind = "temporary" | "permanent" | "ambiguous";

/**
 * Classify a nodemailer SMTP error. A numeric SMTP reply decides it: 4xx is
 * temporary, 5xx permanent. Without a reply, a failure while connecting,
 * authenticating or giving the envelope is temporary (the message never
 * left), and a failure during or after DATA is ambiguous (it may have been
 * accepted).
 */
export function classifySendError(err: unknown): FailureKind {
  const e = (err ?? {}) as { responseCode?: number; code?: string; command?: string };
  if (typeof e.responseCode === "number") {
    if (e.responseCode >= 500) return "permanent";
    if (e.responseCode >= 400) return "temporary";
  }
  if (e.code === "EENVELOPE") return "permanent";
  // The connection failed while the message itself was being handed over.
  if ((e.command ?? "").toUpperCase() === "DATA") return "ambiguous";
  return "temporary";
}

function errorText(err: unknown): string {
  const e = (err ?? {}) as { message?: string; responseCode?: number; code?: string; command?: string };
  return [e.code, e.command, e.responseCode, e.message].filter(Boolean).join(" ").slice(0, 500);
}

/** Send one row this run has claimed (status "sending"), and record the outcome. */
async function deliverClaimed(id: string): Promise<string> {
  const msg = await prisma.emailMessage.findUnique({ where: { id } });
  if (!msg || msg.status !== "sending") return msg?.status ?? "missing";

  // Someone may have unsubscribed or bounced since it was queued.
  const blocked = await activeSuppression(msg.toEmail, msg.category as MailCategory);
  if (blocked) {
    await prisma.emailMessage.update({
      where: { id },
      data: { status: "suppressed", lockedAt: null, lockedBy: null, lastError: `suppressed: ${blocked.reason} (${blocked.scope})` },
    });
    return "suppressed";
  }

  try {
    const result = await sendMail({
      to: msg.toEmail,
      cc: msg.cc ?? undefined,
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
      replyTo: msg.replyTo ?? undefined,
      headers: (msg.headers as Record<string, string> | null) ?? undefined,
      customArgs: { ypg_mid: msg.id },
      categories: ["ypg", msg.stream],
    });
    await prisma.emailMessage.update({
      where: { id },
      data: {
        status: "accepted",
        acceptedAt: new Date(),
        providerMessageId: result.providerMessageId,
        lockedAt: null,
        lockedBy: null,
        lastError: null,
      },
    });
    return "accepted";
  } catch (err) {
    const kind = classifySendError(err);
    const last = errorText(err);
    if (kind === "temporary" && msg.attempts < msg.maxAttempts) {
      await prisma.emailMessage.update({
        where: { id },
        data: { status: "queued", nextAttemptAt: new Date(Date.now() + backoffMs(msg.attempts)), lockedAt: null, lockedBy: null, lastError: last },
      });
      return "retry";
    }
    const status = kind === "ambiguous" ? "ambiguous" : "failed";
    await prisma.emailMessage.update({
      where: { id },
      data: { status, failedAt: status === "failed" ? new Date() : null, lockedAt: null, lockedBy: null, lastError: last },
    });
    return status;
  }
}

// Prisma keeps DateTime columns as UTC timestamps without a zone, so raw
// SQL compares and writes against now() in UTC; plain now() would follow the
// database's TimeZone setting (Australia/Sydney on a local Postgres).
const NOW_UTC = Prisma.sql`(now() AT TIME ZONE 'UTC')`;

/**
 * Claim one queued row and send it now. Used for emails someone is waiting
 * for. If another process already claimed it (or it's due later), nothing
 * happens and the cron will see to it.
 */
export async function sendQueuedNow(id: string): Promise<string> {
  const runId = `now-${randomUUID()}`;
  const claimed = await prisma.$queryRaw<{ id: string }[]>`
    UPDATE "EmailMessage"
       SET status = 'sending', "lockedAt" = ${NOW_UTC}, "lockedBy" = ${runId}, attempts = attempts + 1, "updatedAt" = ${NOW_UTC}
     WHERE id = ${id} AND status = 'queued' AND "nextAttemptAt" <= ${NOW_UTC}
     RETURNING id`;
  if (claimed.length === 0) return "not-claimed";
  return deliverClaimed(id);
}

/** Atomically claim up to `limit` due rows for this run. */
export async function claimDue(limit: number, runId: string): Promise<string[]> {
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    UPDATE "EmailMessage"
       SET status = 'sending', "lockedAt" = ${NOW_UTC}, "lockedBy" = ${runId}, attempts = attempts + 1, "updatedAt" = ${NOW_UTC}
     WHERE id IN (
       SELECT id FROM "EmailMessage"
        WHERE status = 'queued' AND "nextAttemptAt" <= ${NOW_UTC}
        ORDER BY "nextAttemptAt" ASC
        LIMIT ${limit}
        FOR UPDATE SKIP LOCKED
     )
     RETURNING id`;
  return rows.map((r) => r.id);
}

/**
 * A row left "sending" for 15 minutes belongs to a run that died mid-send.
 * We can't know whether SendGrid took it, so it becomes "ambiguous" (held
 * for the webhook or the team), never resent blindly.
 */
export async function releaseStale(): Promise<number> {
  return prisma.$executeRaw`
    UPDATE "EmailMessage"
       SET status = 'ambiguous', "lockedAt" = NULL, "lockedBy" = NULL, "updatedAt" = ${NOW_UTC},
           "lastError" = COALESCE("lastError", '') || ' [run stopped mid-send]'
     WHERE status = 'sending' AND "lockedAt" < ${NOW_UTC} - interval '15 minutes'`;
}

export interface QueueRun {
  runId: string;
  released: number;
  claimed: number;
  outcomes: Record<string, number>;
}

/** The cron's work: release stale claims, then claim and send due rows. */
export async function processQueue({ limit = 50, runId = `cron-${randomUUID()}` }: { limit?: number; runId?: string } = {}): Promise<QueueRun> {
  const released = await releaseStale();
  const ids = await claimDue(limit, runId);
  const outcomes: Record<string, number> = {};
  for (const id of ids) {
    const outcome = await deliverClaimed(id);
    outcomes[outcome] = (outcomes[outcome] ?? 0) + 1;
  }
  return { runId, released, claimed: ids.length, outcomes };
}

/** Admin: put an ambiguous or failed row back in the queue (the team checked it wasn't delivered). */
export async function requeue(id: string): Promise<boolean> {
  const res = await prisma.emailMessage.updateMany({
    where: { id, status: { in: ["ambiguous", "failed"] } },
    data: { status: "queued", nextAttemptAt: new Date(), lastError: null, failedAt: null, maxAttempts: { increment: 1 } },
  });
  return res.count > 0;
}
