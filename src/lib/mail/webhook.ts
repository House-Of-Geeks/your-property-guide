import { createPublicKey, verify } from "node:crypto";
import { Prisma } from "@/generated/prisma/client";
import { db as prisma } from "@/lib/db";
import { suppress } from "./suppression";

// SendGrid's signed Event Webhook (21 Oct 2026). SendGrid signs
// timestamp + raw body with an ECDSA key; we verify with the public key
// from the webhook's settings (SENDGRID_WEBHOOK_PUBLIC_KEY, base64 DER) and
// reject anything unsigned, mis-signed or stale. Events are stored once by
// sg_event_id, so SendGrid's retries and duplicate batches change nothing.
//
// The SendGrid account is shared by several brands and the Event Webhook
// is account-wide, so only events carrying our custom argument ypg_mid (an
// EmailMessage id, never personal data) are applied; everything else is
// acknowledged and ignored.

export const SIGNATURE_HEADER = "x-twilio-email-event-webhook-signature";
export const TIMESTAMP_HEADER = "x-twilio-email-event-webhook-timestamp";

/** How old a signed batch may be. Generous, because SendGrid retries failed posts; replays are harmless (events are de-duplicated). */
export const MAX_AGE_SECONDS = 24 * 60 * 60;

export function verifySignature({
  publicKey,
  signature,
  timestamp,
  rawBody,
  now = Date.now(),
}: {
  publicKey: string;
  signature: string | null;
  timestamp: string | null;
  rawBody: Buffer;
  now?: number;
}): boolean {
  if (!publicKey || !signature || !timestamp) return false;
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(now / 1000 - ts) > MAX_AGE_SECONDS) return false;
  try {
    const pem = publicKey.includes("BEGIN PUBLIC KEY")
      ? publicKey
      : `-----BEGIN PUBLIC KEY-----\n${publicKey.replace(/\s+/g, "")}\n-----END PUBLIC KEY-----`;
    const key = createPublicKey(pem);
    return verify("sha256", Buffer.concat([Buffer.from(timestamp, "utf8"), rawBody]), key, Buffer.from(signature, "base64"));
  } catch {
    return false;
  }
}

export interface SendGridEvent {
  sg_event_id?: string;
  sg_message_id?: string;
  event?: string;
  email?: string;
  timestamp?: number;
  reason?: string;
  response?: string;
  type?: string;
  bounce_classification?: string;
  ypg_mid?: string;
  [k: string]: unknown;
}

// Final states a later event mustn't undo (a late "deferred" after
// "delivered", say). "processed" only settles a send we weren't sure of.
const RANK: Record<string, number> = {
  queued: 0, sending: 1, ambiguous: 2, accepted: 3, deferred: 4, delivered: 5, failed: 6, dropped: 6, bounced: 6,
};

function nextStatus(current: string, ev: SendGridEvent): string | null {
  switch (ev.event) {
    case "processed":
      return current === "ambiguous" || current === "sending" ? "accepted" : null;
    case "deferred":
      return (RANK[current] ?? 0) < RANK.deferred ? "deferred" : null;
    case "delivered":
      return (RANK[current] ?? 0) < RANK.delivered ? "delivered" : null;
    case "bounce":
      // "blocked" is a soft refusal (reputation, content): a failure, but not an address problem.
      return ev.type === "blocked" ? "failed" : "bounced";
    case "dropped":
      return "dropped";
    default:
      return null;
  }
}

/** What an event says about the address, for suppression. */
function suppressionFor(ev: SendGridEvent): { scope: "marketing" | "all"; reason: "bounce" | "invalid" | "spamreport" | "unsubscribe" | "dropped" } | null {
  const reason = `${ev.reason ?? ""}`.toLowerCase();
  switch (ev.event) {
    case "bounce":
      return ev.type === "blocked" ? null : { scope: "all", reason: "bounce" };
    case "spamreport":
      return { scope: "all", reason: "spamreport" };
    case "unsubscribe":
    case "group_unsubscribe":
      return { scope: "marketing", reason: "unsubscribe" };
    case "dropped":
      if (reason.includes("invalid")) return { scope: "all", reason: "invalid" };
      if (reason.includes("bounced")) return { scope: "all", reason: "bounce" };
      if (reason.includes("spam")) return { scope: "all", reason: "spamreport" };
      if (reason.includes("unsubscribed")) return { scope: "marketing", reason: "unsubscribe" };
      return null;
    default:
      return null;
  }
}

export interface ApplyResult {
  received: number;
  applied: number;
  duplicates: number;
  ignored: number;
}

export async function applyEvents(events: SendGridEvent[]): Promise<ApplyResult> {
  const out: ApplyResult = { received: events.length, applied: 0, duplicates: 0, ignored: 0 };
  for (const ev of events) {
    const mid = typeof ev.ypg_mid === "string" ? ev.ypg_mid : null;
    if (!mid || !ev.sg_event_id || !ev.event) {
      out.ignored++;
      continue;
    }
    const msg = await prisma.emailMessage.findUnique({ where: { id: mid }, select: { id: true, status: true, toEmail: true, leadId: true, stream: true } });
    if (!msg) {
      out.ignored++;
      continue;
    }
    const occurredAt = new Date((typeof ev.timestamp === "number" ? ev.timestamp : Date.now() / 1000) * 1000);
    try {
      await prisma.emailEvent.create({
        data: {
          sgEventId: ev.sg_event_id,
          messageId: msg.id,
          event: ev.event,
          email: (ev.email ?? msg.toEmail).toLowerCase(),
          reason: (ev.reason ?? ev.response ?? ev.bounce_classification ?? null)?.toString().slice(0, 500) ?? null,
          occurredAt,
          raw: ev as Prisma.InputJsonValue,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        out.duplicates++;
        continue;
      }
      throw err;
    }
    out.applied++;

    const status = nextStatus(msg.status, ev);
    if (status) {
      await prisma.emailMessage.update({
        where: { id: msg.id },
        data: {
          status,
          ...(status === "delivered" ? { deliveredAt: occurredAt } : {}),
          ...(status === "accepted" ? { acceptedAt: occurredAt } : {}),
          ...(status === "bounced" || status === "dropped" || status === "failed" ? { failedAt: occurredAt, lastError: `${ev.event}: ${ev.reason ?? ev.type ?? ""}`.slice(0, 500) } : {}),
        },
      });
      // The guide and plan emails' outcome, on the lead's own history.
      if (msg.leadId && (status === "delivered" || status === "bounced" || status === "dropped")) {
        await prisma.leadEvent.create({
          data: { leadId: msg.leadId, type: `email-${status}`, actor: "system", detail: { stream: msg.stream, messageId: msg.id } },
        });
      }
    }
    const sup = suppressionFor(ev);
    if (sup) await suppress(msg.toEmail, sup.scope, sup.reason, "sendgrid-webhook", `${ev.event}${ev.reason ? `: ${ev.reason}` : ""}`);
  }
  return out;
}
