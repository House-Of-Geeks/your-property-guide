import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendMail, ANDY_EMAIL } from "@/lib/email";
import { checkRateLimit, ipKeyFromRequest } from "@/lib/rate-limit";
import { attributionFromRequest, attributionJson } from "@/lib/attribution-server";
import { SITE_URL } from "@/lib/constants/seo";
import { answersFromParams, stageOf } from "@/lib/plans/questions";
import { buildPlan, planHref } from "@/lib/plans/engine";
import { buildPlanEmailHtml, buildPlanEmailText, planEmailSubject } from "@/lib/journey-emails";
import { SEQUENCES, dueAt, sequenceFor } from "@/lib/email-sequences";
import { guidanceSeriesEnabled } from "@/lib/flags";
import { planEmailConsent } from "@/lib/plans/consent";

// POST /api/plans: email someone the next-step plan they just made (the
// learning path, Oct 2026). The plan is already on their screen; this only
// sends a copy. A separate, unticked box adds a short guidance series.
// Never reaches an agent, never asks for a phone.

const schema = z.object({
  // The plan's answers, as the shareable URL carries them (no personal data).
  answers: z.record(z.string(), z.string().max(40)),
  email: z.string().trim().email().max(200),
  firstName: z.string().trim().max(60).optional(),
  wantsSequence: z.boolean(),
  requestKey: z.string().trim().min(8).max(80),
  source: z.string().trim().max(120).optional(),
  website: z.string().optional(),
});

export async function POST(request: Request) {
  const limit = checkRateLimit(`plans:${ipKeyFromRequest(request)}`, { limit: 5, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment and try again." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  const input = parsed.data;
  if (input.website?.trim()) return NextResponse.json({ ok: true, duplicate: false });

  const answers = answersFromParams((k) => input.answers[k]);
  if (!answers) return NextResponse.json({ error: "Validation failed", details: { fieldErrors: { answers: ["Missing the plan answers"] } } }, { status: 400 });

  try {
    const existing = await db.lead.findUnique({ where: { requestKey: input.requestKey }, select: { id: true } });
    if (existing) return NextResponse.json({ ok: true, duplicate: true, id: existing.id });

    const plan = buildPlan(answers);
    const stage = stageOf(answers);
    // The series only while it really sends: a tick from a page built
    // before it was switched off is ignored (20 Oct 2026).
    const series = guidanceSeriesEnabled();
    const wantsSequence = series && input.wantsSequence;
    const sequence = wantsSequence ? sequenceFor(answers.journey, stage) : null;
    const now = new Date();
    const token = randomBytes(18).toString("base64url");
    const attribution = attributionFromRequest(request);

    const row = await db.lead.create({
      data: {
        type: "plan-email",
        kind: "learning",
        journey: answers.journey,
        state: answers.state ?? undefined,
        stage: stage ?? undefined,
        timeframe: answers.timeframe ?? undefined,
        firstName: input.firstName?.trim() || "",
        email: input.email.trim().toLowerCase(),
        source: input.source ?? "plan",
        marketingConsent: wantsSequence,
        // The words the form showed, as the guides and the agreement check store theirs.
        consentText: planEmailConsent(series),
        sequence,
        sequenceStep: sequence ? 0 : null,
        sequenceNextAt: sequence ? dueAt(sequence, 0, now) : null,
        requestKey: input.requestKey,
        token,
        gclid: attribution.gclid ?? undefined,
        attribution: attributionJson(attribution),
        events: { create: { type: "submitted", actor: "customer", detail: { lead: "plan-email", sequence } } },
      },
      select: { id: true },
    });

    let emailed = false;
    try {
      const planMail = {
        firstName: input.firstName,
        plan,
        planUrl: `${SITE_URL}${planHref(answers)}`,
        sequenceLabel: sequence ? SEQUENCES[sequence].label : null,
        unsubscribeUrl: sequence ? `${SITE_URL}/api/unsubscribe?t=${token}` : null,
      };
      await sendMail({
        to: input.email.trim(),
        replyTo: ANDY_EMAIL,
        subject: planEmailSubject(plan),
        html: buildPlanEmailHtml(planMail),
        text: buildPlanEmailText(planMail),
      });
      emailed = true;
      await db.leadEvent.create({ data: { leadId: row.id, type: "plan-emailed", actor: "system" } });
    } catch (err) {
      console.error("Plan email failed (row saved):", { id: row.id, error: err instanceof Error ? err.message : String(err) });
    }
    return NextResponse.json({ ok: true, duplicate: false, id: row.id, emailed, sequence });
  } catch (err) {
    // A simultaneous double submit: the first copy's row exists now.
    if (typeof err === "object" && err !== null && (err as { code?: string }).code === "P2002") {
      const first = await db.lead.findUnique({ where: { requestKey: input.requestKey }, select: { id: true } }).catch(() => null);
      if (first) return NextResponse.json({ ok: true, duplicate: true, id: first.id });
    }
    console.error("Plan email request error:", err);
    return NextResponse.json({ error: "Something went wrong on our side. Please try again." }, { status: 500 });
  }
}
