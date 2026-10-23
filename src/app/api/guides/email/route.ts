import { NextResponse, after } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { ANDY_EMAIL, LEADS_CC_EMAIL } from "@/lib/email";
import { buildAdminEmailHtml, buildAdminEmailText, buildConfirmationHtml, buildConfirmationText, confirmationCopy, type LeadEmailData } from "@/lib/lead-emails";
import { downloadConsentText } from "@/lib/guide-consent";
import { guidanceSeriesEnabled } from "@/lib/flags";
import { dueAt, sequenceFor } from "@/lib/email-sequences";
import { checkRateLimit, ipKeyFromRequest } from "@/lib/rate-limit";
import { attributionFromRequest, attributionJson, attributionRowsFor } from "@/lib/attribution-server";
import { GUIDE_BOOKS } from "@/lib/guide-books";
import { queueAndSendLater, queueAndSendNow } from "@/lib/mail/send";

// POST /api/guides/email (21 Oct 2026): "Email me a copy" on the guide
// pages. Only what's needed: a first name and an email address. Reading
// online and downloading the PDF need nothing at all; the personalised
// funnel stays available as an optional extra.
//
// A learning request (Lead type "guide-download", kind "learning"): never
// sent to an agent or to Sent 24/7. The guide email goes through the email
// queue and SendGrid; the answer says "queued" (SendGrid accepted it, or it
// will be retried), never "delivered". The tips series is a separate,
// unticked choice, offered and honoured only while it's switched on.
// requestKey makes a double submit or a retry return the first request.

export const dynamic = "force-dynamic";

const schema = z.object({
  guide: z.enum(["buying", "selling"]),
  firstName: z.string().trim().max(60),
  email: z.string().trim().max(200),
  marketingConsent: z.boolean().optional(),
  requestKey: z.string().trim().min(8).max(80),
  website: z.string().optional(),
  from: z.string().trim().max(120).optional(),
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  if (!checkRateLimit(`guide-email:${ipKeyFromRequest(request)}`, { limit: 5, windowMs: 60_000 }).allowed) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  const input = parsed.data;

  const errors: { firstName?: string; email?: string } = {};
  if (!input.firstName) errors.firstName = "Please add your first name.";
  if (!EMAIL_RE.test(input.email)) errors.email = "Please check your email address.";
  if (errors.firstName || errors.email) return NextResponse.json({ ok: false, errors }, { status: 400 });

  // Honeypot: look successful, keep nothing.
  if (input.website?.trim()) return NextResponse.json({ ok: true, status: "queued", requestId: "ok" });

  try {
    const existing = await db.lead.findUnique({ where: { requestKey: input.requestKey }, select: { id: true } });
    if (existing) return NextResponse.json({ ok: true, status: "queued", requestId: existing.id });

    const series = guidanceSeriesEnabled();
    const wantsSequence = series && input.marketingConsent === true;
    const sequence = wantsSequence ? sequenceFor(input.guide, null) : null;
    const now = new Date();
    const attribution = attributionFromRequest(request);
    const email = input.email.trim().toLowerCase();
    const consentText = downloadConsentText(input.guide, series);

    const row = await db.lead.create({
      data: {
        type: "guide-download",
        kind: "learning",
        journey: input.guide,
        firstName: input.firstName,
        email,
        source: input.from ? `guide-email:${input.from}` : "guide-email",
        marketingConsent: wantsSequence,
        consentText,
        sequence,
        sequenceStep: sequence ? 0 : null,
        sequenceNextAt: sequence ? dueAt(sequence, 0, now) : null,
        requestKey: input.requestKey,
        token: randomBytes(18).toString("base64url"),
        gclid: attribution.gclid ?? undefined,
        attribution: attributionJson(attribution),
        events: { create: { type: "submitted", actor: "customer", detail: { lead: "guide-email", guide: input.guide, sequence } } },
      },
      select: { id: true },
    });

    const lead: LeadEmailData = { type: "guide-download", guideType: input.guide, firstName: input.firstName, email };
    const sent = await queueAndSendNow({
      key: `guide:${input.guide}:${row.id}`,
      category: "transactional",
      stream: "guide-delivery",
      template: `guide/${input.guide}`,
      to: email,
      leadId: row.id,
      replyTo: ANDY_EMAIL,
      subject: confirmationCopy(lead).subject,
      html: buildConfirmationHtml(lead),
      text: buildConfirmationText(lead),
    });
    await db.leadEvent.create({ data: { leadId: row.id, type: "guide-delivered", actor: "system", detail: { guideEmail: sent.status, messageId: sent.id } } }).catch(() => {});

    // The team hears about it after the response, as for guide downloads.
    const deliveryRows: Array<[string, string]> = [
      ["Path", "Learning (guide by email). Never pass to an agent."],
      ["Guide", GUIDE_BOOKS[input.guide].name],
      ["Tips series", sequence ? "Yes" : "No"],
      ["Guide email", sent.status],
    ];
    await queueAndSendLater(
      {
        key: `team:lead:${row.id}`,
        category: "operational",
        stream: "team",
        template: "team/lead",
        to: ANDY_EMAIL,
        cc: LEADS_CC_EMAIL,
        leadId: row.id,
        subject: `Guide by email (${GUIDE_BOOKS[input.guide].name}), ${input.firstName}`,
        html: buildAdminEmailHtml(lead, null, "", attributionRowsFor(attribution), deliveryRows),
        text: buildAdminEmailText(lead, null, "", attributionRowsFor(attribution), deliveryRows),
      },
      after,
    ).catch((err) => console.error("Guide team email failed to queue:", err instanceof Error ? err.message : String(err)));

    if (sent.status === "accepted" || sent.status === "queued") {
      return NextResponse.json({ ok: true, status: "queued", requestId: row.id });
    }
    // Suppressed (bounced or complained before) or refused: say so honestly.
    return NextResponse.json({ ok: false, error: "We couldn’t email this address. Please use the download link instead." }, { status: 500 });
  } catch (err) {
    if (typeof err === "object" && err !== null && (err as { code?: string }).code === "P2002") {
      const first = await db.lead.findUnique({ where: { requestKey: input.requestKey }, select: { id: true } }).catch(() => null);
      if (first) return NextResponse.json({ ok: true, status: "queued", requestId: first.id });
    }
    console.error("Guide email request failed:", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ ok: false, error: "Something went wrong on our side. Please try again, or download the PDF." }, { status: 500 });
  }
}
