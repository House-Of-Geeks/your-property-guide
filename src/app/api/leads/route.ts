import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { routeLead } from "@/lib/utils/lead-routing";
import { db } from "@/lib/db";

const NOTIFY_EMAIL = "andy@theandylife.com";

const leadSchema = z.object({
  type: z.enum([
    "property-enquiry",
    "appraisal-request",
    "off-market-register",
    "general-contact",
    "house-and-land-enquiry",
    "suburb-alert",
    "property-interest",
  ]),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(8),
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
});

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

function labelFor(type: string): string {
  switch (type) {
    case "appraisal-request":      return "Appraisal Request";
    case "off-market-register":    return "Off-Market Registration";
    case "house-and-land-enquiry": return "House & Land Enquiry";
    case "general-contact":        return "General Enquiry";
    case "suburb-alert":           return "Suburb Property Alert";
    case "property-interest":      return "Property Interest Registration";
    default:                       return "Property Enquiry";
  }
}

function buildEmailHtml(lead: z.infer<typeof leadSchema>, agentName: string | null, routedReason: string): string {
  const typeLabel = labelFor(lead.type);
  const rows = [
    ["Name",    `${lead.firstName} ${lead.lastName}`],
    ["Email",   `<a href="mailto:${lead.email}">${lead.email}</a>`],
    ["Phone",   lead.phone],
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
<head><meta charset="UTF-8"><title>${typeLabel} — Your Property Guide</title></head>
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

export async function POST(request: Request) {
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
      // non-fatal — routing info is nice-to-have in the email
    }

    // Save to database
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

    // Send notification email
    const typeLabel = labelFor(lead.type);
    const subject   = `${typeLabel} — ${lead.firstName} ${lead.lastName}`;

    await transporter.sendMail({
      from:    `"Your Property Guide" <${process.env.EMAIL_FROM ?? "noreply@yourpropertyguide.com.au"}>`,
      to:      NOTIFY_EMAIL,
      subject,
      html:    buildEmailHtml(lead, agentName, routing.reason),
    });

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
