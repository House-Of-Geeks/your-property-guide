import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendMail, ANDY_EMAIL } from "@/lib/email";
import { SITE_URL } from "@/lib/constants/seo";
import { SEQUENCES, dueAt, type SequenceId } from "@/lib/email-sequences";
import { buildSequenceEmailHtml } from "@/lib/email-sequence-html";
import { buildCheckInEmailHtml } from "@/lib/journey-emails";
import type { IntroService } from "@/lib/service-model";

// GET /api/cron/follow-ups (Vercel Cron, daily). Two jobs, each switched on
// separately so nothing customer-facing starts by surprise:
//   GUIDANCE_SEQUENCE_ENABLED=true  sends the next email in the optional
//     guidance series to people who ticked the box (never after an unsubscribe);
//   INTRO_CHECKIN_ENABLED=true  asks people introduced 10 days ago (status
//     sent or accepted) how it went, once.
// Auth as leads-health: Bearer CRON_SECRET, or INDEXNOW_KEY for a manual run.

export const dynamic = "force-dynamic";

const BATCH = 50;
const CHECKIN_AFTER_DAYS = 10;

function authorised(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  const keys = [process.env.CRON_SECRET, process.env.INDEXNOW_KEY].filter(Boolean);
  return keys.some((k) => auth === `Bearer ${k}`);
}

async function sendSequences(now: Date): Promise<{ sent: number; failed: number }> {
  const due = await db.lead.findMany({
    where: { sequence: { not: null }, unsubscribedAt: null, sequenceNextAt: { lte: now } },
    select: { id: true, email: true, firstName: true, sequence: true, sequenceStep: true, token: true, createdAt: true },
    orderBy: { sequenceNextAt: "asc" },
    take: BATCH,
  });
  let sent = 0;
  let failed = 0;
  for (const lead of due) {
    const seq = lead.sequence as SequenceId;
    const step = lead.sequenceStep ?? 0;
    if (!SEQUENCES[seq] || !lead.token) {
      await db.lead.update({ where: { id: lead.id }, data: { sequenceNextAt: null } });
      continue;
    }
    const email = buildSequenceEmailHtml(seq, step, { firstName: lead.firstName || null, unsubscribeUrl: `${SITE_URL}/api/unsubscribe?t=${lead.token}` });
    if (!email) {
      await db.lead.update({ where: { id: lead.id }, data: { sequenceNextAt: null } });
      continue;
    }
    try {
      await sendMail({ to: lead.email, replyTo: ANDY_EMAIL, subject: email.subject, html: email.html });
      await db.lead.update({ where: { id: lead.id }, data: { sequenceStep: step + 1, sequenceNextAt: dueAt(seq, step + 1, lead.createdAt) } });
      await db.leadEvent.create({ data: { leadId: lead.id, type: "sequence-email", actor: "system", detail: { sequence: seq, step } } });
      sent++;
    } catch (err) {
      failed++;
      console.error("Sequence email failed:", { id: lead.id, error: err instanceof Error ? err.message : String(err) });
    }
  }
  return { sent, failed };
}

async function sendCheckIns(now: Date): Promise<{ sent: number; failed: number }> {
  const before = new Date(now.getTime() - CHECKIN_AFTER_DAYS * 86_400_000);
  const due = await db.lead.findMany({
    where: {
      kind: "introduction",
      status: { in: ["sent", "accepted"] },
      statusAt: { lte: before },
      token: { not: null },
      // Once only, and not if they've already told us how it went.
      events: { none: { type: { in: ["feedback", "check-in-sent"] } } },
    },
    select: { id: true, email: true, firstName: true, service: true, token: true },
    take: BATCH,
  });
  let sent = 0;
  let failed = 0;
  for (const lead of due) {
    const { subject, html } = buildCheckInEmailHtml({
      firstName: lead.firstName,
      service: (lead.service as IntroService) ?? "selling-agent",
      feedbackUrl: `${SITE_URL}/feedback/${lead.token}`,
    });
    try {
      await sendMail({ to: lead.email, replyTo: ANDY_EMAIL, subject, html });
      await db.leadEvent.create({ data: { leadId: lead.id, type: "check-in-sent", actor: "system" } });
      sent++;
    } catch (err) {
      failed++;
      console.error("Check-in email failed:", { id: lead.id, error: err instanceof Error ? err.message : String(err) });
    }
  }
  return { sent, failed };
}

export async function GET(request: NextRequest) {
  if (!authorised(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const now = new Date();
  const out: Record<string, unknown> = {};
  try {
    out.sequences = process.env.GUIDANCE_SEQUENCE_ENABLED === "true" ? await sendSequences(now) : "off";
    out.checkIns = process.env.INTRO_CHECKIN_ENABLED === "true" ? await sendCheckIns(now) : "off";
    return NextResponse.json({ ok: true, ...out });
  } catch (err) {
    console.error("Follow-ups cron failed:", err);
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
