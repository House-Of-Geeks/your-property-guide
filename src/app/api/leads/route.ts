import { NextResponse } from "next/server";
import { z } from "zod";
import { routeLead } from "@/lib/utils/lead-routing";
import { db } from "@/lib/db";
import { sendMail, ANDY_EMAIL } from "@/lib/email";
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
  // Honeypot. Real users never see/fill this field (visually hidden,
  // aria-hidden, tabindex=-1). Bots autofill it. If populated, we silently
  // 200 the request without persisting or notifying — don't tip them off.
  website: z.string().optional(),
});

function labelFor(type: string): string {
  switch (type) {
    case "appraisal-request":      return "Appraisal Request";
    case "off-market-register":    return "Off-Market Registration";
    case "house-and-land-enquiry": return "House & Land Enquiry";
    case "general-contact":        return "General Enquiry";
    case "suburb-alert":           return "Suburb Property Alert";
    case "property-interest":      return "Property Interest Registration";
    case "match-request":          return "Match Request (homepage)";
    default:                       return "Property Enquiry";
  }
}

function buildAdminEmailHtml(lead: z.infer<typeof leadSchema>, agentName: string | null, routedReason: string): string {
  const typeLabel = labelFor(lead.type);
  const fullName = lead.lastName ? `${lead.firstName} ${lead.lastName}` : lead.firstName;
  const rows = [
    ["Name",    fullName],
    ["Email",   `<a href="mailto:${lead.email}">${lead.email}</a>`],
    lead.phone            && ["Phone",             lead.phone],
    lead.message          && ["Message",          lead.message],
    lead.propertyId       && ["Property ID",       lead.propertyId],
    lead.suburb           && ["Suburb",            lead.suburb],
    lead.appraisalAddress && ["Appraisal address", lead.appraisalAddress],
    lead.address          && ["Address",           lead.address],
    lead.propertyType     && ["Property type",     lead.propertyType],
    lead.bedrooms         && ["Bedrooms",          lead.bedrooms],
    agentName             && ["Routed to",         `${agentName} (${routedReason})`],
    lead.source           && ["Source",            lead.source],
  ]
    .filter((r): r is [string, string] => Array.isArray(r))
    .map(([label, value]) =>
      `<tr>
        <td style="padding:6px 12px;font-weight:600;white-space:nowrap;color:#374151;background:#f9fafb;border-bottom:1px solid #e5e7eb;">${label}</td>
        <td style="padding:6px 12px;color:#111827;border-bottom:1px solid #e5e7eb;">${value}</td>
       </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>${typeLabel}, Your Property Guide</title></head>
<body style="margin:0;padding:24px;background:#f3f4f6;font-family:system-ui,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">
    <div style="background:#1a3a5c;padding:20px 24px;">
      <p style="margin:0;color:#93c5fd;font-size:12px;text-transform:uppercase;letter-spacing:.05em;">Your Property Guide</p>
      <h1 style="margin:4px 0 0;color:#fff;font-size:20px;">${typeLabel}</h1>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${rows}
    </table>
    <div style="padding:16px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#6b7280;">Submitted via yourpropertyguide.com.au · ${new Date().toLocaleString("en-AU", { timeZone: "Australia/Brisbane" })} AEST</p>
    </div>
  </div>
</body>
</html>`;
}

// Subject line + intro for the user-facing confirmation, by lead type.
// Plain, direct copy. No em dashes. No "we're excited" / AI-sounding phrasing.
function confirmationCopy(lead: z.infer<typeof leadSchema>): { subject: string; intro: string; next: string } {
  const suburb = lead.suburb ? lead.suburb : "your area";
  const addr = lead.appraisalAddress || lead.address;
  switch (lead.type) {
    case "appraisal-request":
      return {
        subject: "Your appraisal request is in",
        intro: `Thanks ${lead.firstName}. We've received your free appraisal request${addr ? ` for ${addr}` : ""}.`,
        next: "A local agent will be in touch within one business day to arrange the appraisal. No commitment until you decide to take it further.",
      };
    case "match-request":
      return {
        subject: "We're matching you with a specialist",
        intro: `Thanks ${lead.firstName}. Your request is in.`,
        next: `We'll match you with one vetted specialist for ${suburb}. Expect an email with their profile within one business day, before they reach out.`,
      };
    case "suburb-alert":
      return {
        subject: `You're on the alert list for ${lead.suburb || "your suburb"}`,
        intro: `Thanks ${lead.firstName}. You're now on the property alert list for ${lead.suburb || "your suburb"}.`,
        next: "We'll email you when new listings hit the market. One email per match, no roundup spam. Unsubscribe anytime.",
      };
    case "off-market-register":
      return {
        subject: "You're registered for off-market alerts",
        intro: `Thanks ${lead.firstName}. You're registered for off-market alerts in ${suburb}.`,
        next: "We'll email you matching properties as they come in. One email per match.",
      };
    case "house-and-land-enquiry":
      return {
        subject: "Your house & land enquiry is in",
        intro: `Thanks ${lead.firstName}. We've received your enquiry.`,
        next: "A specialist will be in touch within one business day with the details and next steps.",
      };
    case "property-enquiry":
    case "property-interest":
      return {
        subject: "We've received your enquiry",
        intro: `Thanks ${lead.firstName}. Your enquiry is in.`,
        next: "The listing agent will be in touch within one business day.",
      };
    case "general-contact":
    default:
      return {
        subject: "We've received your message",
        intro: `Thanks ${lead.firstName}. Your message is in.`,
        next: "We'll get back to you within one business day.",
      };
  }
}

function buildConfirmationHtml(lead: z.infer<typeof leadSchema>): string {
  const { intro, next } = confirmationCopy(lead);
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Your Property Guide</title></head>
<body style="margin:0;padding:24px;background:#f3f4f6;font-family:system-ui,sans-serif;color:#111827;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">
    <div style="background:#1a3a5c;padding:20px 24px;">
      <p style="margin:0;color:#93c5fd;font-size:12px;text-transform:uppercase;letter-spacing:.05em;">Your Property Guide</p>
    </div>
    <div style="padding:24px;">
      <p style="margin:0 0 14px;font-size:15px;line-height:1.55;">${intro}</p>
      <p style="margin:0 0 18px;font-size:15px;line-height:1.55;">${next}</p>
      <p style="margin:0 0 6px;font-size:13px;color:#6b7280;line-height:1.55;">If you didn't submit this enquiry, you can ignore this email.</p>
    </div>
    <div style="padding:14px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
      <p style="margin:0;">Your Property Guide · <a href="https://www.yourpropertyguide.com.au" style="color:#1a3a5c;">yourpropertyguide.com.au</a></p>
    </div>
  </div>
</body>
</html>`;
}

function buildFailureAlertHtml(leadId: string, lead: z.infer<typeof leadSchema>, mailErr: unknown): string {
  const errMsg = mailErr instanceof Error ? mailErr.message : String(mailErr);
  const fullName = lead.lastName ? `${lead.firstName} ${lead.lastName}` : lead.firstName;
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:24px;background:#fff5f5;font-family:system-ui,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #fecaca;border-radius:8px;overflow:hidden;">
    <div style="background:#7f1d1d;padding:16px 20px;">
      <p style="margin:0;color:#fff;font-size:13px;font-weight:600;">Lead notification failed</p>
    </div>
    <div style="padding:18px 20px;font-size:14px;color:#111827;line-height:1.55;">
      <p style="margin:0 0 12px;">A lead was saved to the database but the standard notification email did not send. Details below so nothing is lost.</p>
      <ul style="margin:0;padding-left:18px;">
        <li><strong>Lead ID:</strong> ${leadId}</li>
        <li><strong>Type:</strong> ${labelFor(lead.type)}</li>
        <li><strong>Name:</strong> ${fullName}</li>
        <li><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></li>
        ${lead.phone ? `<li><strong>Phone:</strong> ${lead.phone}</li>` : ""}
        ${lead.suburb ? `<li><strong>Suburb:</strong> ${lead.suburb}</li>` : ""}
        ${lead.source ? `<li><strong>Source:</strong> ${lead.source}</li>` : ""}
      </ul>
      <p style="margin:14px 0 0;color:#b91c1c;font-size:13px;"><strong>SMTP error:</strong> ${errMsg}</p>
    </div>
  </div>
</body>
</html>`;
}

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

    // Save to database (canonical record). Everything after this is
    // best-effort relative to the lead being captured.
    const saved = await db.lead.create({
      data: {
        type:             lead.type,
        firstName:        lead.firstName,
        lastName:         lead.lastName,
        email:            lead.email,
        phone:            lead.phone,
        message:          lead.message,
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

    const typeLabel = labelFor(lead.type);
    const subject   = `${typeLabel}, ${lead.firstName}${lead.lastName ? ` ${lead.lastName}` : ""}`;

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
    try {
      const { subject: confirmSubject } = confirmationCopy(lead);
      await sendMail({
        to: lead.email,
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
