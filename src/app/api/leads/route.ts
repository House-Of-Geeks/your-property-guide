import { NextResponse, after } from "next/server";
import { z } from "zod";
import { routeLead } from "@/lib/utils/lead-routing";
import { db } from "@/lib/db";
import { sendMail, ANDY_EMAIL, LEADS_CC_EMAIL } from "@/lib/email";
import { visitorSubjectName } from "@/lib/email-format";
import {
  scoreGuideLead,
  labelFor,
  TIMEFRAME_LABELS,
  AGENT_STATUS_LABELS,
  TENANTED_LABELS,
  MANAGER_TIMEFRAME_LABELS,
  confirmationCopy,
  formatSignDate,
  buildAdminEmailHtml,
  buildAdminEmailText,
  buildConfirmationHtml,
  buildConfirmationText,
  buildFailureAlertHtml,
  buildFailureAlertText,
} from "@/lib/lead-emails";
import { checkRateLimit, ipKeyFromRequest } from "@/lib/rate-limit";
import { normalizePhone } from "@/lib/utils/phone";
import { attributionFromRequest, attributionJson, attributionRowsFor } from "@/lib/attribution-server";
import { callConsentText, downloadConsentText, guideCallKind } from "@/lib/guide-consent";
import { kindForType } from "@/lib/lead-kinds";
import { AGREEMENT_CHECK } from "@/lib/service-model";
import { addressFromSuburbSlug } from "@/lib/sent247";
import { SEQUENCES, dueAt, sequenceFor } from "@/lib/email-sequences";
import { guidanceSeriesEnabled } from "@/lib/flags";
import { randomBytes } from "node:crypto";
import {
  describeSent247,
  leadMagnetDeliveryEnabled,
  requestContext,
  sendSent247Lead,
  sendSent247LeadMagnet,
  sent247Config,
  sent247HoldReason,
} from "@/lib/sent247";

const NOTIFY_EMAIL = ANDY_EMAIL;
const CC_EMAIL = LEADS_CC_EMAIL;

const leadSchema = z.object({
  type: z.enum([
    "property-enquiry",
    "appraisal-request",
    "off-market-register",
    "general-contact",
    "house-and-land-enquiry",
    "suburb-alert",
    "property-interest",
    "match-request",
    "guide-download",
    // Landlord asking for a rental appraisal / property manager (the
    // rental-market sub-page, 30 Sep 2026). Free string on the Lead row.
    "rental-appraisal",
    // The free agreement check (15 Oct 2026): a call from our team before
    // someone signs an agency agreement. Never goes to an agent.
    "agreement-check",
  ]),
  firstName: z.string().min(1),
  lastName: z.string().min(1).optional(),
  email: z.string().email(),
  // Blank/whitespace phones collapse to undefined instead of failing the
  // min-length check — several older client builds posted phone: "" and
  // every such enquiry 400'd. Never bounce a lead over the phone field.
  // Server-valid must stay a superset of what the forms accept (AU and
  // overseas mobiles in E.164, see lib/utils/au-mobile), or a required
  // phone dead-ends with a generic error on a number the field accepted.
  phone: z.preprocess(
    (v) => (typeof v === "string" ? v.trim() || undefined : v),
    z.string().min(6).optional(),
  ),
  message: z.string().optional(),
  propertyId: z.string().optional(),
  agentId: z.string().optional(),
  agencyId: z.string().optional(),
  suburb: z.string().optional(),
  source: z.string().optional(),
  buyingCriteria: z
    .object({
      suburbs: z.array(z.string()).optional(),
      propertyTypes: z.array(z.string()).optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      minBeds: z.number().optional(),
    })
    .optional(),
  appraisalAddress: z.string().optional(),
  address: z.string().optional(),
  propertyType: z.string().optional(),
  bedrooms: z.string().optional(),
  // Guide-download qualification fields (the /selling-guide funnel).
  // All optional so older lead types are untouched. Score is computed
  // server-side from these; never trust a client-supplied score.
  sellingTimeframe: z.enum(["0-3-months", "3-6-months", "6-12-months", "12-plus-months", "researching"]).optional(),
  agentStatus: z.enum(["comparing", "not-started", "already-listed"]).optional(),
  motivation: z.string().max(60).optional(),
  priceExpectation: z.string().max(40).optional(),
  marketingConsent: z.boolean().optional(),
  // Buying-guide funnel fields. guideType discriminates which guide a
  // guide-download lead came from; selling is the default for
  // backward compatibility.
  guideType: z.enum(["selling", "buying"]).optional(),
  buyerPersona: z.enum(["first-home", "upgrading", "investing", "downsizing"]).optional(),
  financeStatus: z.enum(["pre-approved", "talking-to-lenders", "not-started", "cash"]).optional(),
  budget: z.string().max(40).optional(),
  // ?c= from a Sent 24/7 email link the funnel was opened from: credits
  // that email with the lead.
  resumeClickId: z.string().max(200).optional(),
  // Guide funnels: a call request from the thanks page (the download's
  // answers again, with the confirmed phone), sent only when the visitor
  // presses the call card's button. Without it a guide lead is a download,
  // phone or not, and never goes to an agent.
  call: z.boolean().optional(),
  // Rental-appraisal (landlord) answers. No Lead columns: serialised into
  // message below, the way the appraisal timeframe is.
  tenanted: z.enum(["yes", "no"]).optional(),
  managerTimeframe: z.enum(["asap", "0-3-months", "3-6-months", "researching"]).optional(),
  // Agreement check answers: who the agreement is with (if known) and the
  // date they plan to sign. No Lead columns: serialised into message below.
  agencyName: z.string().trim().max(120).optional(),
  signDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  // Learning path (14 Oct 2026). The tips series is its own unticked box
  // (wantsSequence); requestKey stops a double submit making two rows.
  wantsSequence: z.boolean().optional(),
  stage: z.string().max(40).optional(),
  requestKey: z.string().min(8).max(80).optional(),
  // Honeypot. Real users never see/fill this field (visually hidden,
  // aria-hidden, tabindex=-1). Bots autofill it. If populated, we silently
  // 200 the request without persisting or notifying — don't tip them off.
  website: z.string().optional(),
});

export async function POST(request: Request) {
  // Rate limit before doing any work. Sliding 5/min per IP. Tuned to be
  // generous enough that a single household won't trip it across the
  // four forms, but tight enough to throttle scripted floods.
  const ipKey = ipKeyFromRequest(request);
  const limit = checkRateLimit(`leads:${ipKey}`, { limit: 5, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a moment." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  try {
    const body = await request.json();
    const result = leadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const lead = result.data;

    // Honeypot trip. Silently succeed (200) without persisting so the
    // bot believes the submission worked and doesn't retry differently.
    if (lead.website && lead.website.trim().length > 0) {
      return NextResponse.json({ success: true, message: "Enquiry submitted successfully" });
    }

    // A double click or a retried request: return the first row's answer.
    if (lead.requestKey) {
      const first = await db.lead.findUnique({ where: { requestKey: lead.requestKey }, select: { id: true } });
      if (first) {
        await db.leadEvent.create({ data: { leadId: first.id, type: "duplicate-submit", actor: "system" } }).catch(() => {});
        return NextResponse.json({ success: true, message: "Enquiry submitted successfully", id: first.id, emailOnItsWay: true, duplicate: true });
      }
    }

    // How this browser found us (first visit, latest ad click) from the
    // ypg_attr cookie, plus the page the form was submitted on. Read here,
    // not from the payload, so every form gets it without changes.
    const attribution = attributionFromRequest(request);
    const ctx = requestContext(request);

    // Guide leads (Oct 2026, Why Solar's ebook flow): a download gets the
    // guide, and may carry a mobile (optional since 14 Oct) for the YPG team
    // to call (its consent covers that, not agents). Only a call request from the thanks
    // page (call: true, sent when the visitor presses the call card's
    // button) is a call, and only a call can reach an agent, via the Sent
    // 24/7 vendor campaign. Who that call goes to (one agent, or YPG
    // itself) follows from the answers.
    const guideCall = lead.type === "guide-download" && lead.call === true && !!lead.phone;
    const guideDownload = lead.type === "guide-download" && !guideCall;
    const callKind = guideCall ? guideCallKind(lead) : null;

    // Route the lead. Null unless the visitor chose an agent; unassigned
    // leads get no "Routed to" row in the email.
    const routing = routeLead({
      ...lead,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    });

    // Look up routed agent name for the email
    let agentName: string | null = null;
    if (routing) {
      try {
        const agent = await db.agent.findUnique({
          where: { id: routing.agentId },
          select: { fullName: true },
        });
        agentName = agent?.fullName ?? null;
      } catch {
        // non-fatal, routing info is nice-to-have in the email
      }
    }

    // Guide-download leads carry qualification answers that have no
    // dedicated Lead columns. Serialise them into message so the DB row
    // stays the complete record (incl. the consent snapshot) without a
    // schema migration.
    let persistedMessage = lead.message;
    // Appraisal requests may carry an optional selling timeframe (one-tap
    // chips on the suburb-page and house-worth forms). Keep it on the row
    // the same way the guide funnel does, so the agent handoff sees it.
    if (lead.type === "appraisal-request" && lead.sellingTimeframe) {
      persistedMessage = [
        `Timeframe: ${TIMEFRAME_LABELS[lead.sellingTimeframe] ?? lead.sellingTimeframe}`,
        lead.message,
      ]
        .filter(Boolean)
        .join(" · ");
    }
    if (lead.type === "rental-appraisal" && (lead.tenanted || lead.managerTimeframe)) {
      persistedMessage = [
        lead.tenanted && `Tenanted: ${TENANTED_LABELS[lead.tenanted] ?? lead.tenanted}`,
        lead.managerTimeframe && `Wants a manager: ${MANAGER_TIMEFRAME_LABELS[lead.managerTimeframe] ?? lead.managerTimeframe}`,
        lead.message,
      ]
        .filter(Boolean)
        .join(" · ");
    }
    if (lead.type === "agreement-check") {
      persistedMessage = [
        `Agent or agency: ${lead.agencyName || "not given"}`,
        `Planning to sign: ${lead.signDate ? formatSignDate(lead.signDate) : "not sure yet"}`,
        lead.message,
      ]
        .filter(Boolean)
        .join(" · ");
    }
    if (lead.type === "guide-download") {
      const score = scoreGuideLead(lead);
      persistedMessage = [
        `Score: ${score}`,
        lead.guideType === "buying" && `Guide: buying`,
        lead.buyerPersona && `Persona: ${lead.buyerPersona}`,
        lead.financeStatus && `Finance: ${lead.financeStatus}`,
        lead.budget && `Budget: ${lead.budget}`,
        lead.sellingTimeframe && `Timeframe: ${TIMEFRAME_LABELS[lead.sellingTimeframe] ?? lead.sellingTimeframe}`,
        lead.agentStatus && `Agent status: ${AGENT_STATUS_LABELS[lead.agentStatus] ?? lead.agentStatus}`,
        lead.motivation && `Motivation: ${lead.motivation}`,
        lead.priceExpectation && `Price expectation: ${lead.priceExpectation}`,
        `Tips series: ${(lead.wantsSequence ?? lead.marketingConsent) ? "yes" : "no"}`,
        guideDownload
          ? lead.phone
            ? "Consent: the guide by email; gave a mobile for a call from YPG only, never an agent (download)"
            : "Consent: the guide by email only (download)"
          : callKind === "agent"
            ? "Consent: one agent may call (call request)"
            : "Consent: call from YPG only, never an agent (call request)",
        lead.message,
      ]
        .filter(Boolean)
        .join(" · ");
    }

    // Save to database (canonical record). Everything after this is
    // best-effort relative to the lead being captured.
    // Canonicalise the phone ("+61 412-345 678" → "0412345678") so agents
    // can dial straight from the email/DB. If it doesn't normalise, keep
    // the raw string — a lead with an odd-looking number beats no lead.
    const storedPhone = lead.phone ? (normalizePhone(lead.phone) ?? lead.phone.trim()) : undefined;

    // The path, journey and consent as columns (14 Oct 2026), so learning rows
    // and introduction requests can't be confused in reports or delivery.
    // Guide downloads: the tips series only with its own tick (wantsSequence,
    // or marketingConsent from a page loaded before this deploy), and only
    // while the series really sends (src/lib/flags.ts, 20 Oct 2026).
    const kind = kindForType(lead.type, { call: guideCall });
    const series = guidanceSeriesEnabled();
    const wantsSequence = series && lead.type === "guide-download" && !guideCall && (lead.wantsSequence ?? lead.marketingConsent ?? false);
    const journey =
      lead.type === "guide-download" ? (lead.guideType === "buying" ? "buying" : "selling") : lead.type === "agreement-check" ? "selling" : undefined;
    const stage = lead.stage ?? (lead.type === "guide-download" ? (lead.guideType === "buying" ? undefined : lead.agentStatus) : undefined);
    const sequence = wantsSequence && journey ? sequenceFor(journey, stage) : null;
    const now = new Date();
    const journeyFields = {
      kind,
      journey,
      state: addressFromSuburbSlug(lead.suburb)?.state,
      stage,
      timeframe: lead.sellingTimeframe,
      marketingConsent: lead.type === "guide-download" ? wantsSequence : lead.marketingConsent,
      consentText: guideDownload
        ? downloadConsentText(lead.guideType, series)
        : callKind
          ? callConsentText(callKind)
          : lead.type === "agreement-check"
            ? AGREEMENT_CHECK.collection
            : undefined,
      introConsent: callKind === "agent" ? true : undefined,
      service: callKind === "agent" ? "selling-agent" : undefined,
      status: kind === "introduction" ? "received" : undefined,
      sequence,
      sequenceStep: sequence ? 0 : undefined,
      sequenceNextAt: sequence ? dueAt(sequence, 0, now) : undefined,
      requestKey: lead.requestKey,
      token: randomBytes(18).toString("base64url"),
      events: { create: { type: "submitted", actor: "customer", detail: { type: lead.type, kind, sequence } } },
    };

    const saved = await db.lead.create({
      data: {
        type:             lead.type,
        firstName:        lead.firstName,
        lastName:         lead.lastName,
        email:            lead.email,
        phone:            storedPhone,
        message:          persistedMessage,
        propertyId:       lead.propertyId,
        agentId:          lead.agentId,
        agencyId:         lead.agencyId,
        suburb:           lead.suburb,
        source:           lead.source,
        appraisalAddress: lead.appraisalAddress,
        address:          lead.address,
        propertyType:     lead.propertyType,
        bedrooms:         lead.bedrooms,
        routedToAgent:    routing?.agentId,
        routedReason:     routing?.reason,
        gclid:            attribution.gclid ?? undefined,
        attribution:      attributionJson(attribution),
        ...journeyFields,
      },
    });

    // Guide leads no longer sync to ActiveCampaign (Oct 2026): Sent 24/7's
    // lead magnet series is the only thing that emails guide readers.

    const typeLabel = labelFor(lead.type, lead.guideType);
    // Score prefix on guide leads so a HOT vendor is visible from the
    // inbox list without opening the email. Speed-to-lead is the whole
    // game: an appraisal-ready vendor contacted inside 24h converts at
    // roughly 4x the rate of one contacted later.
    const scorePrefix =
      lead.type === "guide-download"
        ? `[${scoreGuideLead(lead)}] `
        : lead.type === "appraisal-request" && lead.sellingTimeframe === "0-3-months"
          ? "[HOT] "
          : lead.type === "rental-appraisal" && lead.managerTimeframe === "asap"
            ? "[HOT] "
            : lead.type === "agreement-check" && lead.signDate
              ? `[Signs ${formatSignDate(lead.signDate)}] `
              : "";
    const callLabel = callKind === "agent" ? "Appraisal call: " : callKind === "ypg" ? "Call from YPG (not for agents): " : "";
    const subjectName = visitorSubjectName(lead.firstName, lead.lastName);
    const subject = `${scorePrefix}${callLabel}${typeLabel}${subjectName ? `, ${subjectName}` : ""}${lead.suburb ? ` (${lead.suburb})` : ""}`;

    // Match-request leads (the homepage MatchAgent flow) go ONLY to
    // andy@theandylife.com, no CC. Per Andy 2026-05-10. Other lead
    // types keep the standard CC list.
    const isMatchRequest = lead.type === "match-request";
    // The team email shows the number as stored, ready to dial.
    const notifyLead = { ...lead, phone: storedPhone };

    // Internal notification to the team. Best-effort. If SendGrid is
    // down or the key is rotated, log + escalate via a fallback alert
    // so the lead is never silently lost.
    const notifyTeam = async (deliveryRows: Array<[string, string]>) => {
      try {
        await sendMail({
          to: NOTIFY_EMAIL,
          cc: isMatchRequest ? undefined : CC_EMAIL,
          subject,
          html: buildAdminEmailHtml(notifyLead, agentName, routing?.reason ?? "", attributionRowsFor(attribution), deliveryRows),
          text: buildAdminEmailText(notifyLead, agentName, routing?.reason ?? "", attributionRowsFor(attribution), deliveryRows),
        });
      } catch (mailErr) {
        console.error("Lead notification email failed (lead saved to DB):", {
          leadId: saved.id,
          type: lead.type,
          error: mailErr instanceof Error ? mailErr.message : String(mailErr),
        });
        // Fallback alert — a second, simpler message from a different
        // code path. If THIS also fails the DB row is still the source of
        // truth and the daily zero-floor cron will surface a wider outage.
        try {
          await sendMail({
            to: NOTIFY_EMAIL,
            subject: `ALERT: Lead notification failed (${saved.id})`,
            html: buildFailureAlertHtml(saved.id, notifyLead, mailErr),
            text: buildFailureAlertText(saved.id, notifyLead, mailErr),
          });
        } catch (alertErr) {
          console.error("Lead failure-alert email ALSO failed:", {
            leadId: saved.id,
            error: alertErr instanceof Error ? alertErr.message : String(alertErr),
          });
        }
      }
    };

    // A download: the guide, plus the team email after the response (the
    // mobile is for the team to call; nothing goes to an agent). Sent 24/7
    // emails the guide when switched on; otherwise, or when it won't (no
    // series yet, a rejected post), YPG sends its own guide email. A
    // retryable failure is retried in the background and YPG stays quiet,
    // so nobody gets the guide twice: the thanks page has it anyway.
    if (guideDownload) {
      let emailOnItsWay = false;
      let sendOwnEmail = true;
      let guideEmail = "Not sent";
      const cfg = sent247Config();
      if (cfg && leadMagnetDeliveryEnabled()) {
        const outcome = await sendSent247LeadMagnet(
          cfg.apiKey,
          {
            lead,
            campaignId: cfg.vendorCampaignId,
            referenceId: saved.id,
            consentText: downloadConsentText(lead.guideType, series),
            attribution,
            ctx,
          },
          (task) => after(task),
        );
        if (outcome.kind === "sent") {
          emailOnItsWay = outcome.emails === "started";
          // Repeat downloads ("already_started") and suppressed addresses
          // get nothing more; only a series that never started falls back.
          sendOwnEmail = outcome.emails === "not_started" && outcome.emailsReason !== "suppressed";
          guideEmail = `Sent 24/7: ${outcome.emails ?? "accepted"}${outcome.emailsReason ? ` (${outcome.emailsReason})` : ""}`;
        } else {
          sendOwnEmail = outcome.kind === "rejected";
          if (outcome.kind === "failed") guideEmail = `Sent 24/7 unavailable (${outcome.reason}), retrying in the background`;
        }
      }
      if (sendOwnEmail) {
        try {
          await sendMail({
            to: lead.email,
            replyTo: ANDY_EMAIL,
            subject: confirmationCopy(lead).subject,
            html: buildConfirmationHtml(lead),
            text: buildConfirmationText(lead),
          });
          emailOnItsWay = true;
          guideEmail = "Sent by YPG";
        } catch (confirmErr) {
          guideEmail = "FAILED, not sent (the thanks page has the download)";
          console.error("Guide email failed (download saved to DB):", {
            leadId: saved.id,
            error: confirmErr instanceof Error ? confirmErr.message : String(confirmErr),
          });
        }
      }
      // After the response, as the phone-added email is: the reader
      // shouldn't wait out an SMTP round-trip for the team's copy.
      await db.leadEvent
        .create({ data: { leadId: saved.id, type: "guide-delivered", actor: "system", detail: { guideEmail } } })
        .catch(() => {});
      const notify = () =>
        notifyTeam([
          ["Path", "Learning (guide download). Never pass to an agent."],
          ["Team call", lead.phone ? "They added a mobile for a call from our team (not an agent)." : "No mobile given. Email only."],
          ["Tips series", sequence ? `Yes: ${SEQUENCES[sequence].label}` : "No"],
          ["Guide email", guideEmail],
        ]);
      try {
        after(notify);
      } catch {
        // No request scope (unit tests): fire and forget instead.
        void notify();
      }
      return NextResponse.json({ success: true, message: "Enquiry submitted successfully", id: saved.id, emailOnItsWay, sequence: !!sequence });
    }

    // A guide call request from a seller YPG may sell goes to the Sent 24/7
    // vendor campaign, which hands it to one agent (and stops the address's
    // guide series). Awaited, as Why Solar does, so the team email can say
    // whether it went; a failure never costs the lead (DB row + email).
    // This is the only path from here to an agent: callKind is set only
    // for an explicit call request.
    const deliveryRows: Array<[string, string]> = [];
    if (lead.type === "agreement-check") {
      deliveryRows.push(
        ["Path", "Agreement check: a 15-minute call from our team before they sign. Never pass to an agent."],
        ["Agent or agency", lead.agencyName || "Not given"],
        ["Planning to sign", lead.signDate ? formatSignDate(lead.signDate) : "Not sure yet"],
      );
    }
    if (callKind) {
      deliveryRows.push([
        "Call requested",
        callKind === "agent" ? "One participating local agent (vendor lead)" : "From YPG only. Never pass to an agent.",
      ]);
      const cfg = sent247Config();
      const hold = sent247HoldReason(lead);
      const outcome = !cfg
        ? ({ kind: "off" } as const)
        : hold
          ? ({ kind: "held", reason: hold } as const)
          : await sendSent247Lead(cfg.apiKey, {
              lead: { ...lead, phone: lead.phone! },
              campaignId: cfg.vendorCampaignId,
              referenceId: saved.id,
              consentText: callConsentText(callKind),
              attribution,
              ctx,
              resumeClickId: lead.resumeClickId,
            });
      if (outcome.kind === "failed") {
        console.error("Sent 24/7 delivery failed (lead saved to DB):", { leadId: saved.id, reason: outcome.reason });
      }
      deliveryRows.push(["Sent 24/7", describeSent247(outcome)]);
      const delivered = outcome.kind === "accepted";
      await db.lead
        .update({ where: { id: saved.id }, data: { status: delivered ? "sent" : "held", statusReason: describeSent247(outcome), statusAt: new Date() } })
        .catch(() => {});
      await db.leadEvent
        .create({ data: { leadId: saved.id, type: delivered ? "delivered" : outcome.kind === "failed" ? "delivery-failed" : "held", actor: "system", detail: { channel: "sent247", outcome: JSON.parse(JSON.stringify(outcome)) } } })
        .catch(() => {});
    }

    // 1. Internal notification to the team (above), awaited here; only a
    //    download sends its copy after the response.
    await notifyTeam(deliveryRows);

    // 2. Transactional confirmation to the submitter. Best-effort. Never
    //    blocks the success response. If it fails the user already saw
    //    the in-page confirmation; admin notification carries the data.
    //    replyTo routes "reply to this email" responses (the HOT email's
    //    P.S. fast-track line) to a monitored inbox instead of noreply@.
    //    A guide call request gets a call confirmation (callKind).
    const confirmLead = callKind ? { ...lead, callKind } : lead;
    try {
      const { subject: confirmSubject } = confirmationCopy(confirmLead);
      await sendMail({
        to: lead.email,
        replyTo: ANDY_EMAIL,
        subject: confirmSubject,
        html: buildConfirmationHtml(confirmLead),
        text: buildConfirmationText(confirmLead),
      });
    } catch (confirmErr) {
      console.error("Lead confirmation email failed:", {
        leadId: saved.id,
        to: lead.email,
        error: confirmErr instanceof Error ? confirmErr.message : String(confirmErr),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully",
      id: saved.id,
    });
  } catch (err) {
    // A simultaneous double submit lost the requestKey race: the first copy's
    // row exists now, so answer as the first request did.
    if (typeof err === "object" && err !== null && (err as { code?: string }).code === "P2002") {
      return NextResponse.json({ success: true, message: "Enquiry submitted successfully", duplicate: true, emailOnItsWay: true });
    }
    console.error("Lead submission error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
