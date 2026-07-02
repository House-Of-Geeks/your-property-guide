import { EMAIL_COLORS, emailLayout, emailButton, emailCoverHero } from "@/lib/email-theme";

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
  /** "selling" (default) or "buying" — which guide funnel produced the lead. */
  guideType?: string;
  buyerPersona?: string;
  financeStatus?: string;
  budget?: string;
}

// Lead temperature for guide-download leads. The bands follow the
// industry-standard vendor qualification: timeframe is the dominant
// signal, "already listed with an agent" disqualifies the lead from
// agent handoff entirely (it is unsaleable while under an exclusive
// agency agreement).
export type LeadScore = "HOT" | "WARM" | "COLD" | "DO-NOT-CONTACT";

export function scoreGuideLead(lead: LeadEmailData): LeadScore {
  if (lead.guideType === "buying") {
    // Buyer temperature: near-term timeframe plus finance readiness.
    // Pre-approved or cash buyers inside three months are the leads a
    // broker or buyer's agent pays attention to immediately.
    const near = lead.sellingTimeframe === "0-3-months";
    const soon = lead.sellingTimeframe === "3-6-months";
    const ready = lead.financeStatus === "pre-approved" || lead.financeStatus === "cash";
    if (near && ready) return "HOT";
    if (near || soon) return "WARM";
    return "COLD";
  }
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

export const BUYER_PERSONA_LABELS: Record<string, string> = {
  "first-home":  "First home buyer",
  "upgrading":   "Upgrading or moving",
  "investing":   "Investing",
  "downsizing":  "Downsizing",
};

export const FINANCE_STATUS_LABELS: Record<string, string> = {
  "pre-approved":       "Pre-approved",
  "talking-to-lenders": "Talking to lenders",
  "not-started":        "Finance not started",
  "cash":               "Cash buyer",
};

export const AGENT_STATUS_LABELS: Record<string, string> = {
  "comparing":      "Comparing agents now",
  "not-started":    "Hasn't started looking",
  "already-listed": "Already listed with an agent",
};

export function labelFor(type: string, guideType?: string): string {
  if (type === "guide-download" && guideType === "buying") return "Buying Guide Download";
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
export const BUYING_GUIDE_PDF_PATH = "/downloads/your-property-guide-buying-property-australia.pdf";
export const BUYING_GUIDE_PDF_URL = `https://www.yourpropertyguide.com.au${BUYING_GUIDE_PDF_PATH}`;
export const BUYING_GUIDE_COVER_URL = "https://www.yourpropertyguide.com.au/images/guide/buying-guide-cover-email.jpg";
const APPRAISAL_URL = "https://www.yourpropertyguide.com.au/appraisal";
const BORROWING_URL = "https://www.yourpropertyguide.com.au/borrowing-power-calculator";

// Lead fields are attacker-controlled free text (any bot can POST
// /api/leads). Escape them before they land inside an email template:
// injected markup in the internal notification reads as phishing, and
// the confirmation email would reflect it back to any address the
// attacker typed in. Server-generated values (labelFor, scores, routing
// reasons, our own URLs) stay unescaped.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildAdminEmailHtml(lead: LeadEmailData, agentName: string | null, routedReason: string): string {
  const C = EMAIL_COLORS;
  const typeLabel = labelFor(lead.type, lead.guideType);
  const fullName = escapeHtml(lead.lastName ? `${lead.firstName} ${lead.lastName}` : lead.firstName);
  const email = escapeHtml(lead.email);
  const score = lead.type === "guide-download" ? scoreGuideLead(lead) : null;
  // Score colour stays functional (urgency signal), not brand: red for
  // HOT, amber for WARM, warm grey for the rest.
  const scoreColor = score === "HOT" ? "#b91c1c" : score === "WARM" ? "#b45309" : C.inkSubtle;
  const rows = [
    score && ["Lead score", `<strong style="color:${scoreColor};">${score}</strong>`],
    ["Name",    fullName],
    ["Email",   `<a href="mailto:${email}" style="color:${C.terracottaDark};">${email}</a>`],
    lead.phone            && ["Phone",             escapeHtml(lead.phone)],
    lead.buyerPersona     && ["Buyer type",        BUYER_PERSONA_LABELS[lead.buyerPersona] ?? escapeHtml(lead.buyerPersona)],
    lead.sellingTimeframe && [lead.guideType === "buying" ? "Buying timeframe" : "Selling timeframe", TIMEFRAME_LABELS[lead.sellingTimeframe] ?? escapeHtml(lead.sellingTimeframe)],
    lead.financeStatus    && ["Finance",           FINANCE_STATUS_LABELS[lead.financeStatus] ?? escapeHtml(lead.financeStatus)],
    lead.budget           && ["Budget",            escapeHtml(lead.budget)],
    lead.agentStatus      && ["Agent status",      AGENT_STATUS_LABELS[lead.agentStatus] ?? escapeHtml(lead.agentStatus)],
    lead.motivation       && ["Reason for selling", escapeHtml(lead.motivation)],
    lead.priceExpectation && ["Price expectation", escapeHtml(lead.priceExpectation)],
    lead.marketingConsent !== undefined && ["Marketing consent", lead.marketingConsent ? "Yes (opted in)" : "No"],
    lead.message          && ["Message",          escapeHtml(lead.message)],
    lead.propertyId       && ["Property ID",       escapeHtml(lead.propertyId)],
    lead.suburb           && ["Suburb",            escapeHtml(lead.suburb)],
    lead.appraisalAddress && ["Appraisal address", escapeHtml(lead.appraisalAddress)],
    lead.address          && ["Address",           escapeHtml(lead.address)],
    lead.propertyType     && ["Property type",     escapeHtml(lead.propertyType)],
    lead.bedrooms         && ["Bedrooms",          escapeHtml(lead.bedrooms)],
    agentName             && ["Routed to",         `${agentName} (${routedReason})`],
    lead.source           && ["Source",            escapeHtml(lead.source)],
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
  // intro/next render inside HTML emails, so client-controlled fields are
  // escaped here. Subjects are plain-text headers and keep the raw values.
  const firstName = escapeHtml(lead.firstName);
  const suburb = lead.suburb ? escapeHtml(lead.suburb) : "your area";
  const rawAddr = lead.appraisalAddress || lead.address;
  const addr = rawAddr && escapeHtml(rawAddr);
  switch (lead.type) {
    case "guide-download": {
      const score = scoreGuideLead(lead);
      if (lead.guideType === "buying") {
        const next =
          score === "HOT"
            ? "Finance sorted and buying inside three months puts you in the strongest position a buyer can hold. Tonight, read chapter 6, it takes ten minutes and decodes every script the selling side will run on you. Then put your shortlist together: the suburb quiz takes two minutes and scores six suburbs against what you actually care about."
            : score === "WARM"
              ? "You're close enough that finance is the next move. Chapter 2 shows you what you can actually spend (including the buffer lenders test you against), and chapter 8 covers pre-approval without the traps. Get those two right and every inspection after that means something."
              : "Buying well starts long before the inspections. Chapter 1 works out which buyer you are and the playbook that follows. Keep the guide handy, the numbers will still be true when you're ready.";
        return {
          subject: "Your buying guide + what you can really spend",
          intro: `Thanks ${firstName}. Your copy is ready, all ten chapters, matched to your situation.`,
          next,
          cta: { label: "Download your guide (PDF)", url: BUYING_GUIDE_PDF_URL },
          preheader: "Ten chapters before you sign anything. Start with what you can actually spend.",
        };
      }
      // Score-aware momentum copy. The job of this paragraph is to give
      // the reader ONE thing to do tonight and one reason to believe it
      // is worth money, in their situation, not generic reassurance.
      const next =
        score === "HOT"
          ? "You said you're selling within three months. That's the window where the right moves still pay: pricing, presentation and agent choice are all open. Tonight, read chapter 3, it takes ten minutes and tells you where every dollar of your 3 to 5 percent selling cost goes. This week, put a real number on your place: we'll line up a free appraisal with a top local agent, so you walk into every conversation knowing exactly what it's worth. Nothing leaves our hands until you say so."
          : score === "WARM"
            ? "Three to six months out is the sweet spot. You have time to prepare properly, and preparation is where the money is: sellers who fix the right things and interview three agents routinely walk away with thousands more. Start with chapter 3 (the costs) and chapter 5 (the agent questions). When you're closer, one click lines up a free appraisal."
            : score === "DO-NOT-CONTACT"
              ? "Since you're already listed, skip straight to chapter 7 (marketing that sells) and chapter 8 (offers and negotiation), the two chapters that matter mid-campaign. And as promised, your details stay with us and go to no one."
              : "No deadline means you get to do this the smart way. Chapter 1 shows you how to read your market and pick your moment. Keep the guide handy. The numbers in it will still be true when you're ready.";
      return {
        subject: "Your selling guide + the $20,000 question",
        intro: `Thanks ${firstName}. Your copy is ready, all ten chapters, personalised pointers included.`,
        next,
        cta: { label: "Download your guide (PDF)", url: GUIDE_PDF_URL },
        preheader: "Ten chapters that pay for themselves. Start with the 10 questions that expose an average agent.",
      };
    }
    case "appraisal-request":
      return {
        subject: "Your appraisal request is in",
        intro: `Thanks ${firstName}. We've received your free appraisal request${addr ? ` for ${addr}` : ""}.`,
        next: "A local agent will be in touch within one business day to arrange the appraisal. No commitment until you decide to take it further.",
      };
    case "match-request":
      return {
        subject: "We're matching you with a specialist",
        intro: `Thanks ${firstName}. Your request is in.`,
        next: `We'll match you with one vetted specialist for ${suburb}. Expect an email with their profile within one business day, before they reach out.`,
      };
    case "suburb-alert":
      return {
        subject: `You're on the alert list for ${lead.suburb || "your suburb"}`,
        intro: `Thanks ${firstName}. You're now on the property alert list for ${lead.suburb ? escapeHtml(lead.suburb) : "your suburb"}.`,
        next: "We'll email you when new listings hit the market. One email per match, no roundup spam. Unsubscribe anytime.",
      };
    case "off-market-register":
      return {
        subject: "You're registered for off-market alerts",
        intro: `Thanks ${firstName}. You're registered for off-market alerts in ${suburb}.`,
        next: "We'll email you matching properties as they come in. One email per match.",
      };
    case "house-and-land-enquiry":
      return {
        subject: "Your house & land enquiry is in",
        intro: `Thanks ${firstName}. We've received your enquiry.`,
        next: "A specialist will be in touch within one business day with the details and next steps.",
      };
    case "property-enquiry":
    case "property-interest":
      return {
        subject: "We've received your enquiry",
        intro: `Thanks ${firstName}. Your enquiry is in.`,
        next: "The listing agent will be in touch within one business day.",
      };
    case "general-contact":
    default:
      return {
        subject: "We've received your message",
        intro: `Thanks ${firstName}. Your message is in.`,
        next: "We'll get back to you within one business day.",
      };
  }
}

// Value strip shown only in the guide-delivery email. Each line pairs a
// chapter with the money it touches, using only numbers that appear in
// the guide itself. This is the part of the email that earns the open.
function guideHighlightsHtml(): string {
  const C = EMAIL_COLORS;
  const items = [
    ["Ch 5", "The $20,000 question", "The 10 questions that expose an average agent before you sign anything"],
    ["Ch 3", "Where the 3 to 5% goes", "Every selling cost, state by state, and which ones are negotiable"],
    ["Ch 4", "The 3 to 10x rule", "The cheap preparation that outperforms every renovation at sale time"],
  ]
    .map(
      ([n, headline, t]) =>
        `<tr>
          <td style="padding:10px 12px 10px 16px;white-space:nowrap;vertical-align:top;font-family:Georgia,serif;font-style:italic;color:${C.terracotta};font-size:15px;">${n}</td>
          <td style="padding:10px 16px 10px 0;border-bottom:1px solid ${C.line};">
            <p style="margin:0;font-size:13.5px;font-weight:600;color:${C.ink};">${headline}</p>
            <p style="margin:2px 0 0;font-size:12.5px;line-height:1.5;color:${C.inkMuted};">${t}</p>
          </td>
        </tr>`,
    )
    .join("");
  return `
      <div style="margin:0 0 18px;background:${C.cream};border:1px solid ${C.line};border-radius:10px;overflow:hidden;">
        <p style="margin:0;padding:12px 16px 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:${C.terracottaDark};">Where the money is</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">${items}</table>
      </div>`;
}

// Buyer-side value strip, money-led like the seller version.
function buyingHighlightsHtml(): string {
  const C = EMAIL_COLORS;
  const items = [
    ["Ch 2", "What you can really spend", "Borrowing power, the lender buffer, deposits and the true upfront costs"],
    ["Ch 3", "Schemes worth tens of thousands", "First home buyer schemes and concessions, state by state, 2026 settings"],
    ["Ch 6", "How the selling side plays you", "Underquoting, price guides and auction psychology, decoded"],
  ]
    .map(
      ([n, headline, t]) =>
        `<tr>
          <td style="padding:10px 12px 10px 16px;white-space:nowrap;vertical-align:top;font-family:Georgia,serif;font-style:italic;color:${C.terracotta};font-size:15px;">${n}</td>
          <td style="padding:10px 16px 10px 0;border-bottom:1px solid ${C.line};">
            <p style="margin:0;font-size:13.5px;font-weight:600;color:${C.ink};">${headline}</p>
            <p style="margin:2px 0 0;font-size:12.5px;line-height:1.5;color:${C.inkMuted};">${t}</p>
          </td>
        </tr>`,
    )
    .join("");
  return `
      <div style="margin:0 0 18px;background:${C.cream};border:1px solid ${C.line};border-radius:10px;overflow:hidden;">
        <p style="margin:0;padding:12px 16px 2px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:${C.terracottaDark};">Where the money is</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">${items}</table>
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
    const buying = lead.guideType === "buying";
    const appraisalPanel = buying
      ? (score === "HOT" || score === "WARM"
        ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 0;background:${C.ink};border-radius:10px;">
        <tr><td style="padding:20px 22px;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:${C.apricot};">Know your number</p>
          <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:rgba(254,251,247,0.8);">Every good buying decision starts with one number: what a lender will actually approve, after the serviceability buffer. The borrowing power calculator runs it in 60 seconds, no sign-up.</p>
          ${emailButton("Run my borrowing power", BORROWING_URL)}
        </td></tr>
      </table>`
        : "")
      : (score === "HOT" || score === "WARM"
        ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 0;background:${C.ink};border-radius:10px;">
        <tr><td style="padding:20px 22px;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:${C.apricot};">Put a number on it</p>
          <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:rgba(254,251,247,0.8);">Medians tell you about the suburb. An appraisal tells you about <em style="color:#ffffff;font-style:normal;font-weight:600;">your place</em>: a defensible price range, the comparable sales behind it, and what to fix first. Thirty minutes with a top local agent, free, no listing agreement, and you control who contacts you.</p>
          ${emailButton("Book my free appraisal", APPRAISAL_URL)}
        </td></tr>
      </table>`
        : "");

    const psLine =
      score === "HOT" && !buying
        ? `<p style="margin:18px 0 0;font-size:13.5px;line-height:1.6;color:${C.inkMuted};"><strong style="color:${C.ink};">P.S.</strong> In a hurry? Reply to this email with your street address and the word <strong style="color:${C.terracottaDark};">appraisal</strong> and we'll fast-track it today.</p>`
        : score === "HOT" && buying
          ? `<p style="margin:18px 0 0;font-size:13.5px;line-height:1.6;color:${C.inkMuted};"><strong style="color:${C.ink};">P.S.</strong> Want a second pair of eyes on a property you're circling? Reply with the listing link and we'll tell you what we'd check first.</p>`
          : "";

    return emailLayout({
      preheader,
      body: `
      ${emailCoverHero(buying ? BUYING_GUIDE_COVER_URL : GUIDE_COVER_URL, `Your guide is ready, ${escapeHtml(lead.firstName)}.`, buying ? "Ten chapters that keep buyers from overpaying. Free, and yours to keep." : "Ten chapters that routinely save sellers thousands. Free, and yours to keep.")}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td align="center" style="padding:26px 28px 6px;">
          ${emailButton("Download your guide (PDF)", buying ? BUYING_GUIDE_PDF_URL : GUIDE_PDF_URL)}
          <p style="margin:10px 0 0;font-size:12px;color:${C.inkSubtle};">Instant download · Works on any device · No card, no catch</p>
        </td></tr>
        <tr><td style="padding:18px 28px 26px;">
          ${buying ? buyingHighlightsHtml() : guideHighlightsHtml()}
          <p style="margin:0;font-size:14px;line-height:1.65;color:${C.ink};">${next}</p>
          ${appraisalPanel}
          ${psLine}
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
  // SMTP errors often echo the submitted (attacker-controlled) address,
  // so the message gets escaped along with the lead fields.
  const errMsg = escapeHtml(mailErr instanceof Error ? mailErr.message : String(mailErr));
  const fullName = escapeHtml(lead.lastName ? `${lead.firstName} ${lead.lastName}` : lead.firstName);
  const email = escapeHtml(lead.email);
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
        <li><strong>Email:</strong> <a href="mailto:${email}" style="color:${C.terracottaDark};">${email}</a></li>
        ${lead.phone ? `<li><strong>Phone:</strong> ${escapeHtml(lead.phone)}</li>` : ""}
        ${lead.suburb ? `<li><strong>Suburb:</strong> ${escapeHtml(lead.suburb)}</li>` : ""}
        ${lead.source ? `<li><strong>Source:</strong> ${escapeHtml(lead.source)}</li>` : ""}
      </ul>
      <p style="margin:14px 0 0;color:#b91c1c;font-size:13px;"><strong>SMTP error:</strong> ${errMsg}</p>
    </div>`,
  });
}

/**
 * Sent to the team when a lead adds their phone number after the fact
 * (the post-submit "add your mobile" step on thanks pages / inline
 * confirmations). A lead growing a phone number is a buying signal —
 * surface it like a fresh lead, not a footnote.
 */
export function buildPhoneAddedHtml(
  lead: { id: string; type: string; firstName: string; lastName: string | null; email: string; suburb: string | null; source: string | null },
  phone: string,
): string {
  const C = EMAIL_COLORS;
  const fullName = escapeHtml(lead.lastName ? `${lead.firstName} ${lead.lastName}` : lead.firstName);
  const email = escapeHtml(lead.email);
  return emailLayout({
    eyebrow: "Lead upgraded",
    title: `${fullName} added a phone number`,
    body: `
    <div style="padding:18px 24px;font-size:14px;color:${C.ink};line-height:1.55;">
      <p style="margin:0 0 12px;">An existing lead just added their mobile — they want the call. Worth moving to the top of the follow-up list.</p>
      <ul style="margin:0;padding-left:18px;">
        <li><strong>Phone:</strong> <a href="tel:${phone}" style="color:${C.terracottaDark};">${phone}</a></li>
        <li><strong>Name:</strong> ${fullName}</li>
        <li><strong>Email:</strong> <a href="mailto:${email}" style="color:${C.terracottaDark};">${email}</a></li>
        <li><strong>Original lead:</strong> ${labelFor(lead.type)}</li>
        ${lead.suburb ? `<li><strong>Suburb:</strong> ${escapeHtml(lead.suburb)}</li>` : ""}
        ${lead.source ? `<li><strong>Source:</strong> ${escapeHtml(lead.source)}</li>` : ""}
        <li><strong>Lead ID:</strong> ${lead.id}</li>
      </ul>
    </div>`,
  });
}
