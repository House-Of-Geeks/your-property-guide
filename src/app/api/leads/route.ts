import { NextResponse } from "next/server";
import { z } from "zod";
import { routeLead } from "@/lib/utils/lead-routing";
import { db } from "@/lib/db";
import { sendMail, ANDY_EMAIL } from "@/lib/email";
import {
  scoreGuideLead,
  labelFor,
  TIMEFRAME_LABELS,
  AGENT_STATUS_LABELS,
  confirmationCopy,
  buildAdminEmailHtml,
  buildConfirmationHtml,
  buildFailureAlertHtml,
} from "@/lib/lead-emails";
import { syncGuideLeadToActiveCampaign } from "@/lib/activecampaign";
import { checkRateLimit, ipKeyFromRequest } from "@/lib/rate-limit";

const NOTIFY_EMAIL = ANDY_EMAIL;
const CC_EMAIL = "jos@profitgeeks.com.au";

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
  ]),
  firstName: z.string().min(1),
  lastName: z.string().min(1).optional(),
  email: z.string().email(),
  phone: z.string().min(8).optional(),
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

    // Route the lead
    const routing = routeLead({
      ...lead,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    });

    // Look up routed agent name for the email
    let agentName: string | null = null;
    try {
      const agent = await db.agent.findUnique({
        where: { id: routing.agentId },
        select: { fullName: true },
      });
      agentName = agent?.fullName ?? null;
    } catch {
      // non-fatal, routing info is nice-to-have in the email
    }

    // Guide-download leads carry qualification answers that have no
    // dedicated Lead columns. Serialise them into message so the DB row
    // stays the complete record (incl. the consent snapshot) without a
    // schema migration.
    let persistedMessage = lead.message;
    if (lead.type === "guide-download") {
      const score = scoreGuideLead(lead);
      persistedMessage = [
        `Score: ${score}`,
        lead.sellingTimeframe && `Timeframe: ${TIMEFRAME_LABELS[lead.sellingTimeframe] ?? lead.sellingTimeframe}`,
        lead.agentStatus && `Agent status: ${AGENT_STATUS_LABELS[lead.agentStatus] ?? lead.agentStatus}`,
        lead.motivation && `Motivation: ${lead.motivation}`,
        lead.priceExpectation && `Price expectation: ${lead.priceExpectation}`,
        `Marketing consent: ${lead.marketingConsent ? "yes" : "no"}`,
        `Agent-sharing disclosure shown at submission`,
        lead.message,
      ]
        .filter(Boolean)
        .join(" · ");
    }

    // Save to database (canonical record). Everything after this is
    // best-effort relative to the lead being captured.
    const saved = await db.lead.create({
      data: {
        type:             lead.type,
        firstName:        lead.firstName,
        lastName:         lead.lastName,
        email:            lead.email,
        phone:            lead.phone,
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
        routedToAgent:    routing.agentId,
        routedReason:     routing.reason,
      },
    });

    // ActiveCampaign sync for guide leads. Best-effort: the DB row and
    // email notification are the canonical record; a slow or down AC API
    // must never cost us the lead or block the response. Consent gating
    // and tag/field mapping live in src/lib/activecampaign.ts.
    if (lead.type === "guide-download") {
      try {
        await syncGuideLeadToActiveCampaign(lead);
      } catch (acErr) {
        console.error("ActiveCampaign sync failed (lead saved to DB):", {
          leadId: saved.id,
          error: acErr instanceof Error ? acErr.message : String(acErr),
        });
      }
    }

    const typeLabel = labelFor(lead.type);
    // Score prefix on guide leads so a HOT vendor is visible from the
    // inbox list without opening the email. Speed-to-lead is the whole
    // game: an appraisal-ready vendor contacted inside 24h converts at
    // roughly 4x the rate of one contacted later.
    const scorePrefix = lead.type === "guide-download" ? `[${scoreGuideLead(lead)}] ` : "";
    const subject     = `${scorePrefix}${typeLabel}, ${lead.firstName}${lead.lastName ? ` ${lead.lastName}` : ""}${lead.suburb ? ` (${lead.suburb})` : ""}`;

    // Match-request leads (the homepage MatchAgent flow) go ONLY to
    // andy@theandylife.com, no CC. Per Andy 2026-05-10. Other lead
    // types keep the standard CC list.
    const isMatchRequest = lead.type === "match-request";

    // 1. Internal notification to the team. Best-effort. If SendGrid is
    //    down or the key is rotated, log + escalate via a fallback alert
    //    so the lead is never silently lost.
    try {
      await sendMail({
        to: NOTIFY_EMAIL,
        cc: isMatchRequest ? undefined : CC_EMAIL,
        subject,
        html: buildAdminEmailHtml(lead, agentName, routing.reason),
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
          html: buildFailureAlertHtml(saved.id, lead, mailErr),
        });
      } catch (alertErr) {
        console.error("Lead failure-alert email ALSO failed:", {
          leadId: saved.id,
          error: alertErr instanceof Error ? alertErr.message : String(alertErr),
        });
      }
    }

    // 2. Transactional confirmation to the submitter. Best-effort. Never
    //    blocks the success response. If it fails the user already saw
    //    the in-page confirmation; admin notification carries the data.
    //    replyTo routes "reply to this email" responses (the HOT email's
    //    P.S. fast-track line) to a monitored inbox instead of noreply@.
    try {
      const { subject: confirmSubject } = confirmationCopy(lead);
      await sendMail({
        to: lead.email,
        replyTo: ANDY_EMAIL,
        subject: confirmSubject,
        html: buildConfirmationHtml(lead),
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
    console.error("Lead submission error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
