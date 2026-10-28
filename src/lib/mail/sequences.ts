import { db as prisma } from "@/lib/db";
import { ANDY_EMAIL } from "@/lib/email";
import { SITE_URL } from "@/lib/constants/seo";
import { SEQUENCES, dueAt, type SequenceId } from "@/lib/email-sequences";
import { buildSequenceEmailHtml } from "@/lib/email-sequence-html";
import { buildCheckInEmailHtml } from "@/lib/journey-emails";
import type { IntroService } from "@/lib/service-model";
import { enqueueEmail } from "./queue";
import { activeSuppression, normaliseEmail } from "./suppression";
import { listUnsubscribeHeaders, unsubscribePageUrl } from "./unsubscribe";

// The optional guidance series and the introduction check-in, scheduled into
// the email queue (21 Oct 2026). The daily cron (/api/cron/follow-ups) only
// decides who is due and queues their next email; /api/cron/email sends it.
//
// Every step has its own unique key ("seq:<leadId>:<series>:<step>"), and a
// row only moves to the next step with a conditional update on the step it
// was at, so overlapping runs can't send a step twice or skip one. Steps
// already sent are kept: nobody restarts at the beginning.
//
// Cutover policy (the series has been off; rows that ticked the box between
// 14 and 20 Oct 2026 are already overdue):
//   - a series that never started and whose first email was due more than
//     STALE_START_DAYS ago is not started (the person asked for it weeks ago,
//     while it wasn't sending; an email now would be a surprise);
//   - an overdue later step is sent once, then the following step keeps the
//     series' own spacing from now, so nobody gets a catch-up burst;
//   - at most one series email per address per day, and one series per
//     address (a later duplicate row for the same person is ended);
//   - at most DAILY_LIMIT queued per run.
// /dashboard/admin/email shows who is eligible before the switch
// (GUIDANCE_SEQUENCE_ENABLED) is turned on.

export const STALE_START_DAYS = 30;
export const DAILY_LIMIT = 50;
const DAY = 86_400_000;

export interface SeriesRun {
  queued: number;
  expired: number;
  merged: number;
  deferred: number;
  ended: number;
}

/** When the step after `step` is due: its own schedule, but never sooner than the series' gap from now. */
export function nextDue(seq: SequenceId, step: number, joinedAt: Date, now: Date): Date | null {
  const planned = dueAt(seq, step + 1, joinedAt);
  if (!planned) return null;
  const emails = SEQUENCES[seq].emails;
  const gapDays = emails[step + 1].day - emails[step].day;
  const earliest = new Date(now.getTime() + gapDays * DAY);
  return planned > earliest ? planned : earliest;
}

type Due = { id: string; email: string; firstName: string; sequence: string | null; sequenceStep: number | null; sequenceNextAt: Date | null; token: string | null; createdAt: Date };

async function endSeries(id: string, reason: string) {
  await prisma.lead.update({ where: { id }, data: { sequenceNextAt: null } });
  await prisma.leadEvent.create({ data: { leadId: id, type: "sequence-ended", actor: "system", detail: { reason } } });
}

/** Classify one due row: what the cutover policy does with it. Pure, for the admin preview and tests. */
export function cutoverDecision(row: Pick<Due, "sequenceStep" | "sequenceNextAt">, now: Date): "send" | "expire" {
  const step = row.sequenceStep ?? 0;
  if (step === 0 && row.sequenceNextAt && row.sequenceNextAt.getTime() < now.getTime() - STALE_START_DAYS * DAY) return "expire";
  return "send";
}

export async function queueDueSeries(now = new Date()): Promise<SeriesRun> {
  const out: SeriesRun = { queued: 0, expired: 0, merged: 0, deferred: 0, ended: 0 };
  const due: Due[] = await prisma.lead.findMany({
    where: { sequence: { not: null }, unsubscribedAt: null, sequenceNextAt: { lte: now } },
    select: { id: true, email: true, firstName: true, sequence: true, sequenceStep: true, sequenceNextAt: true, token: true, createdAt: true },
    orderBy: { sequenceNextAt: "asc" },
    take: DAILY_LIMIT * 3,
  });
  const seenToday = new Set<string>();
  for (const lead of due) {
    if (out.queued >= DAILY_LIMIT) break;
    const seq = lead.sequence as SequenceId;
    const step = lead.sequenceStep ?? 0;
    const addr = normaliseEmail(lead.email);
    if (!SEQUENCES[seq] || !lead.token || !SEQUENCES[seq].emails[step]) {
      await endSeries(lead.id, "no such step or no token");
      out.ended++;
      continue;
    }
    if (await activeSuppression(addr, "marketing")) {
      await endSeries(lead.id, "suppressed");
      out.ended++;
      continue;
    }
    if (cutoverDecision(lead, now) === "expire") {
      await endSeries(lead.id, `never started; first email was due over ${STALE_START_DAYS} days ago`);
      out.expired++;
      continue;
    }
    // One series per address: an older active row for this address wins.
    const older = await prisma.lead.findFirst({
      where: { id: { not: lead.id }, email: { equals: addr, mode: "insensitive" }, sequence: { not: null }, sequenceNextAt: { not: null }, unsubscribedAt: null, createdAt: { lt: lead.createdAt } },
      select: { id: true },
    });
    if (older) {
      await endSeries(lead.id, `merged into ${older.id}`);
      out.merged++;
      continue;
    }
    // One series email per address per day.
    const recent = seenToday.has(addr) || (await prisma.emailMessage.count({ where: { toEmail: addr, stream: "sequence", createdAt: { gte: new Date(now.getTime() - DAY) } } })) > 0;
    if (recent) {
      await prisma.lead.update({ where: { id: lead.id }, data: { sequenceNextAt: new Date(now.getTime() + DAY) } });
      out.deferred++;
      continue;
    }
    const email = buildSequenceEmailHtml(seq, step, { firstName: lead.firstName || null, unsubscribeUrl: unsubscribePageUrl(lead.token) });
    if (!email) continue;
    await enqueueEmail({
      key: `seq:${lead.id}:${seq}:${step}`,
      category: "marketing",
      stream: "sequence",
      template: `sequence/${seq}/${step}`,
      to: addr,
      leadId: lead.id,
      replyTo: ANDY_EMAIL,
      subject: email.subject,
      html: email.html,
      text: email.text,
      headers: listUnsubscribeHeaders(lead.token),
    });
    // Advance only from the step we read: a concurrent run that already
    // advanced it matches nothing here (and its enqueue was a no-op).
    const advanced = await prisma.lead.updateMany({
      where: { id: lead.id, sequenceStep: lead.sequenceStep },
      data: { sequenceStep: step + 1, sequenceNextAt: nextDue(seq, step, lead.createdAt, now) },
    });
    if (advanced.count > 0) {
      await prisma.leadEvent.create({ data: { leadId: lead.id, type: "sequence-email", actor: "system", detail: { sequence: seq, step, queued: true } } });
      seenToday.add(addr);
      out.queued++;
    }
  }
  return out;
}

export const CHECKIN_AFTER_DAYS = 10;

/** The introduction check-in, once, 10 days after a sent or accepted introduction. Respects unsubscribes. */
export async function queueDueCheckIns(now = new Date()): Promise<{ queued: number; skipped: number }> {
  const before = new Date(now.getTime() - CHECKIN_AFTER_DAYS * DAY);
  const due = await prisma.lead.findMany({
    where: {
      kind: "introduction",
      status: { in: ["sent", "accepted"] },
      statusAt: { lte: before },
      token: { not: null },
      unsubscribedAt: null,
      events: { none: { type: { in: ["feedback", "check-in-sent"] } } },
    },
    select: { id: true, email: true, firstName: true, service: true, token: true },
    take: DAILY_LIMIT,
  });
  let queued = 0;
  let skipped = 0;
  for (const lead of due) {
    if (!lead.token) continue;
    if (await activeSuppression(lead.email, "marketing")) {
      skipped++;
      continue;
    }
    const { subject, html, text } = buildCheckInEmailHtml({
      firstName: lead.firstName,
      service: (lead.service as IntroService) ?? "selling-agent",
      feedbackUrl: `${SITE_URL}/feedback/${lead.token}`,
    });
    const res = await enqueueEmail({
      key: `checkin:${lead.id}`,
      category: "marketing",
      stream: "intro-checkin",
      template: "introduction/check-in",
      to: lead.email,
      leadId: lead.id,
      replyTo: ANDY_EMAIL,
      subject,
      html,
      text,
      headers: listUnsubscribeHeaders(lead.token),
    });
    if (res.created) {
      await prisma.leadEvent.create({ data: { leadId: lead.id, type: "check-in-sent", actor: "system", detail: { queued: true, messageId: res.id } } });
      queued++;
    }
  }
  return { queued, skipped };
}

export interface SeriesPreview {
  dueNow: number;
  wouldExpire: number;
  byStep: Record<string, number>;
  duplicatesByAddress: number;
  suppressed: number;
}

/** What turning the series on would do today (for the admin, before the switch). */
export async function previewSeries(now = new Date()): Promise<SeriesPreview> {
  const rows = await prisma.lead.findMany({
    where: { sequence: { not: null }, unsubscribedAt: null, sequenceNextAt: { not: null } },
    select: { email: true, sequence: true, sequenceStep: true, sequenceNextAt: true },
  });
  const due = rows.filter((r) => r.sequenceNextAt && r.sequenceNextAt <= now);
  const suppressedEmails = new Set(
    (await prisma.emailSuppression.findMany({ where: { scope: { in: ["marketing", "all"] } }, select: { email: true } })).map((s) => s.email),
  );
  const byStep: Record<string, number> = {};
  const addrs = new Map<string, number>();
  let wouldExpire = 0;
  let suppressed = 0;
  for (const r of due) {
    const addr = normaliseEmail(r.email);
    addrs.set(addr, (addrs.get(addr) ?? 0) + 1);
    if (suppressedEmails.has(addr)) {
      suppressed++;
      continue;
    }
    if (cutoverDecision(r, now) === "expire") {
      wouldExpire++;
      continue;
    }
    const k = `${r.sequence} step ${(r.sequenceStep ?? 0) + 1}`;
    byStep[k] = (byStep[k] ?? 0) + 1;
  }
  return { dueNow: due.length, wouldExpire, byStep, duplicatesByAddress: [...addrs.values()].filter((n) => n > 1).length, suppressed };
}
