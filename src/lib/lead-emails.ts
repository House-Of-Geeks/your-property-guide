import { EMAIL_COLORS, emailLayout, emailButton, emailButtonOutline, emailCoverHero } from "@/lib/email-theme";

// Lead email rendering + scoring, extracted from /api/leads so it can be
// unit-tested and previewed without booting the route (which imports the
// Prisma client). This is also the seam where an ESP sync (ActiveCampaign)
// can hook in later: everything it needs (score, labels, consent) is here.

// Structural subset of the route's zod-validated lead. Kept structural so
// the route's z.infer type assigns to it without coupling this module to
// the schema.
export interface LeadEmailData {
  type: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  message?: string;
  propertyId?: string;
  suburb?: string;
  source?: string;
  appraisalAddress?: string;
  address?: string;
  propertyType?: string;
  bedrooms?: string;
  sellingTimeframe?: string;
  agentStatus?: string;
  motivation?: string;
  priceExpectation?: string;
  marketingConsent?: boolean;
}

// Lead temperature for guide-download leads. The bands follow the
// industry-standard vendor qualification: timeframe is the dominant
// signal, "already listed with an agent" disqualifies the lead from
// agent handoff entirely (it is unsaleable while under an exclusive
// agency agreement).
export type LeadScore = "HOT" | "WARM" | "COLD" | "DO-NOT-CONTACT";

export function scoreGuideLead(lead: LeadEmailData): LeadScore {
  if (lead.agentStatus === "already-listed") return "DO-NOT-CONTACT";
  switch (lead.sellingTimeframe) {
    case "0-3-months": return "HOT";
    case "3-6-months": return "WARM";
    default:           return "COLD";
  }
}

export const TIMEFRAME_LABELS: Record<string, string> = {
  "0-3-months":     "Within 3 months",
  "3-6-months":     "3 to 6 months",
  "6-12-months":    "6 to 12 months",
  "12-plus-months": "12+ months",
  "researching":    "Just researching",
};

export const AGENT_STATUS_LABELS: Record<string, string> = {
  "comparing":      "Comparing agents now",
  "not-started":    "Hasn't started looking",
  "already-listed": "Already listed with an agent",
};

export function labelFor(type: string): string {
  switch (type) {
    case "appraisal-request":      return "Appraisal Request";
    case "off-market-register":    return "Off-Market Registration";
    case "house-and-land-enquiry": return "House & Land Enquiry";
    case "general-contact":        return "General Enquiry";
    case "suburb-alert":           return "Suburb Property Alert";
    case "property-interest":      return "Property Interest Registration";
    case "match-request":          return "Match Request (homepage)";
    case "guide-download":         return "Selling Guide Download";
    default:                       return "Property Enquiry";
  }
}

// Public URL of the selling guide PDF. Lives in /public/downloads/ and is
// excluded from robots so the funnel stays the front door.
export const GUIDE_PDF_PATH = "/downloads/your-property-guide-selling-a-home-australia.pdf";
export const GUIDE_PDF_URL = `https://www.yourpropertyguide.com.au${GUIDE_PDF_PATH}`;
// Cover art rendered from scripts/guide-pdf/cover-art.html. The email
// variant is a ~70KB JPEG so it loads fast on mobile data.
export const GUIDE_COVER_URL = "https://www.yourpropertyguide.com.au/images/guide/selling-guide-cover-email.jpg";
const APPRAISAL_URL = "https://www.yourpropertyguide.com.au/appraisal";

export function buildAdminEmailHtml(lead: LeadEmailData, agentName: string | null, routedReason: string): string {
  const C = EMAIL_COLORS;
  const typeLabel = labelFor(lead.type);
  const fullName = lead.lastName ? `${lead.firstName} ${lead.lastName}` : lead.firstName;
  const score = lead.type === "guide-download" ? scoreGuideLead(lead) : null;
  // Score colour stays functional (urgency signal), not brand: red for
  // HOT, amber for WARM, warm grey for the rest.
  const scoreColor = score === "HOT" ? "#b91c1c" : score === "WARM" ? "#b45309" : C.inkSubtle;
  const rows = [
    score && ["Lead score", `<strong style="color:${scoreColor};">${score}</strong>`],
    ["Name",    fullName],
    ["Email",   `<a href="mailto:${lead.email}" style="color:${C.terracottaDark};">${lead.email}</a>`],
    lead.phone            && ["Phone",             lead.phone],
    lead.sellingTimeframe && ["Selling timeframe", TIMEFRAME_LABELS[lead.sellingTimeframe] ?? lead.sellingTimeframe],
    lead.agentStatus      && ["Agent status",      AGENT_STATUS_LABELS[lead.agentStatus] ?? lead.agentStatus],
    lead.motivation       && ["Reason for selling", lead.motivation],
    lead.priceExpectation && ["Price expectation", lead.priceExpectation],
    lead.marketingConsent !== undefined && ["Marketing consent", lead.marketingConsent ? "Yes (opted in)" : "No"],
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
        <td style="padding:7px 12px 7px 24px;font-weight:600;white-space:nowrap;color:${C.inkMuted};background:${C.cream};border-bottom:1px solid ${C.line};">${label}</td>
        <td style="padding:7px 24px 7px 12px;color:${C.ink};border-bottom:1px solid ${C.line};">${value}</td>
       </tr>`
    )
    .join("");

  return emailLayout({
    title: typeLabel,
    body: `
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${rows}
    </table>`,
    footer: `Submitted via yourpropertyguide.com.au · ${new Date().toLocaleString("en-AU", { timeZone: "Australia/Brisbane" })} AEST`,
  });
}

// Subject line + intro for the user-facing confirmation, by lead type.
// Plain, direct copy. No em dashes. No "we're excited" / AI-sounding phrasing.
export function confirmationCopy(lead: LeadEmailData): { subject: string; intro: string; next: string; cta?: { label: string; url: string }; preheader?: string } {
  const suburb = lead.suburb ? lead.suburb : "your area";
  const addr = lead.appraisalAddress || lead.address;
  switch (lead.type) {
    case "guide-download": {
      const score = scoreGuideLead(lead);
      const next =
        score === "HOT"
          ? "You mentioned you're planning to sell soon. We'll be in touch shortly to offer a free appraisal from a top local agent. No obligation, and your details stay private until you say otherwise."
          : score === "WARM"
            ? "When you're closer to listing, we can connect you with up to three top local agents for a free appraisal. No obligation, and we'll check in closer to the time."
            : "Take your time with it. When you're ready to compare agents or get a free appraisal, we're here.";
      return {
        subject: "Your free property selling guide",
        intro: `Thanks ${lead.firstName}. Your copy is ready, all ten chapters, personalised pointers included.`,
        next,
        cta: { label: "Download your guide (PDF)", url: GUIDE_PDF_URL },
        preheader: "All 10 chapters are ready to download. Start with what selling really costs in your state.",
      };
    }
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

// Chapter highlights shown only in the guide-delivery email. Keeps the
// email useful on its own and seeds the chapters the reader should open
// first (the costs and agent-selection chapters are the two that move
// vendors toward an appraisal).
function guideHighlightsHtml(): string {
  const C = EMAIL_COLORS;
  const items = [
    ["Ch 3", "The real cost of selling, state by state"],
    ["Ch 5", "The 10 questions to ask every agent before you sign"],
    ["Ch 10", "Your printable 12-week selling timeline"],
  ]
    .map(
      ([n, t]) =>
        `<tr>
          <td style="padding:6px 12px 6px 16px;font-weight:600;white-space:nowrap;color:${C.terracottaDark};font-size:13px;">${n}</td>
          <td style="padding:6px 16px 6px 0;color:${C.inkMuted};font-size:13px;">${t}</td>
        </tr>`,
    )
    .join("");
  return `
      <div style="margin:0 0 18px;background:${C.cream};border:1px solid ${C.line};border-radius:8px;overflow:hidden;">
        <p style="margin:0;padding:10px 16px 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.12em;color:${C.inkSubtle};">Start with these</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:6px;">${items}</table>
      </div>`;
}

export function buildConfirmationHtml(lead: LeadEmailData): string {
  const C = EMAIL_COLORS;
  const { intro, next, cta, preheader } = confirmationCopy(lead);

  // Guide delivery gets the full treatment: cover-art hero, centred
  // download button, chapter on-ramp, score-aware next step. Everything
  // else keeps the quiet single-column note.
  if (lead.type === "guide-download") {
    const score = scoreGuideLead(lead);
    const appraisalPanel =
      score === "HOT" || score === "WARM"
        ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 0;background:${C.cream};border:1px solid ${C.line};border-radius:10px;">
        <tr><td style="padding:18px 20px;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.14em;color:${C.terracottaDark};">While it's fresh</p>
          <p style="margin:0 0 12px;font-size:14px;line-height:1.55;color:${C.inkMuted};">Want real numbers for your place, not medians? A free appraisal from a top local agent takes 30 minutes and puts a defensible price range on your property. No obligation, no listing agreement.</p>
          ${emailButtonOutline("Book a free appraisal", APPRAISAL_URL)}
        </td></tr>
      </table>`
        : "";

    return emailLayout({
      preheader,
      body: `
      ${emailCoverHero(GUIDE_COVER_URL, `Your guide is ready, ${lead.firstName}.`, "Ten chapters, no filler. Free, and yours to keep.")}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td align="center" style="padding:26px 28px 6px;">
          ${emailButton("Download your guide (PDF)", GUIDE_PDF_URL)}
          <p style="margin:10px 0 0;font-size:12px;color:${C.inkSubtle};">Instant download · Works on any device · No card, no catch</p>
        </td></tr>
        <tr><td style="padding:18px 28px 26px;">
          ${guideHighlightsHtml()}
          <p style="margin:0;font-size:14px;line-height:1.6;color:${C.ink};">${next}</p>
          ${appraisalPanel}
          <p style="margin:22px 0 0;font-size:14px;line-height:1.5;color:${C.inkMuted};">Happy reading,<br/><span style="font-family:Georgia,serif;font-style:italic;font-size:15px;color:${C.ink};">The team at Your Property Guide</span></p>
          <p style="margin:18px 0 0;font-size:12px;color:${C.inkSubtle};line-height:1.55;">If you didn't request this guide, you can ignore this email.</p>
        </td></tr>
      </table>`,
    });
  }

  const ctaHtml = cta ? `<p style="margin:0 0 18px;">${emailButton(cta.label, cta.url)}</p>` : "";
  return emailLayout({
    preheader,
    body: `
    <div style="padding:24px 28px;">
      <p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:${C.ink};">${intro}</p>
      ${ctaHtml}
      <p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:${C.ink};">${next}</p>
      <p style="margin:0 0 6px;font-size:13px;color:${C.inkSubtle};line-height:1.55;">If you didn't submit this enquiry, you can ignore this email.</p>
    </div>`,
  });
}

export function buildFailureAlertHtml(leadId: string, lead: LeadEmailData, mailErr: unknown): string {
  const C = EMAIL_COLORS;
  const errMsg = mailErr instanceof Error ? mailErr.message : String(mailErr);
  const fullName = lead.lastName ? `${lead.firstName} ${lead.lastName}` : lead.firstName;
  return emailLayout({
    variant: "alert",
    eyebrow: "Lead notification failed",
    body: `
    <div style="padding:18px 24px;font-size:14px;color:${C.ink};line-height:1.55;">
      <p style="margin:0 0 12px;">A lead was saved to the database but the standard notification email did not send. Details below so nothing is lost.</p>
      <ul style="margin:0;padding-left:18px;">
        <li><strong>Lead ID:</strong> ${leadId}</li>
        <li><strong>Type:</strong> ${labelFor(lead.type)}</li>
        <li><strong>Name:</strong> ${fullName}</li>
        <li><strong>Email:</strong> <a href="mailto:${lead.email}" style="color:${C.terracottaDark};">${lead.email}</a></li>
        ${lead.phone ? `<li><strong>Phone:</strong> ${lead.phone}</li>` : ""}
        ${lead.suburb ? `<li><strong>Suburb:</strong> ${lead.suburb}</li>` : ""}
        ${lead.source ? `<li><strong>Source:</strong> ${lead.source}</li>` : ""}
      </ul>
      <p style="margin:14px 0 0;color:#b91c1c;font-size:13px;"><strong>SMTP error:</strong> ${errMsg}</p>
    </div>`,
  });
}
