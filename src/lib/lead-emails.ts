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
  /** Rental-appraisal (landlord) answers. */
  tenanted?: string;
  managerTimeframe?: string;
  /** A guide call request: "agent" (one agent calls) or "ypg" (YPG calls). Set by /api/leads. */
  callKind?: string;
  /** Agreement check: the agent or agency named, and the date they plan to sign (YYYY-MM-DD). */
  agencyName?: string;
  signDate?: string;
}

/** "Mon 20 Oct 2026" from YYYY-MM-DD, read in UTC so a date never shifts a day. */
export function formatSignDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (isNaN(d.getTime())) return iso;
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    new Intl.DateTimeFormat("en-AU", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
      .formatToParts(d)
      .find((p) => p.type === type)?.value ?? "";
  return `${part("weekday")} ${part("day")} ${part("month")} ${part("year")}`;
}

// Lead temperature for guide-download leads. The bands follow the
// industry-standard vendor qualification: timeframe is the dominant
// signal, "already listed with an agent" disqualifies the lead from
// agent handoff entirely (it is unsaleable while under an exclusive
// agency agreement).
export type LeadScore = "HOT" | "WARM" | "COLD" | "DO-NOT-CONTACT";

export function scoreGuideLead(
  lead: Pick<LeadEmailData, "guideType" | "sellingTimeframe" | "financeStatus" | "agentStatus">,
): LeadScore {
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

export const TENANTED_LABELS: Record<string, string> = {
  yes: "Yes, tenanted",
  no:  "No, vacant",
};

export const MANAGER_TIMEFRAME_LABELS: Record<string, string> = {
  "asap":        "As soon as possible",
  "0-3-months":  "Within 3 months",
  "3-6-months":  "3 to 6 months",
  "researching": "Just comparing",
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
    case "rental-appraisal":       return "Rental Appraisal Request (landlord)";
    case "agreement-check":        return "Agreement Check";
    default:                       return "Property Enquiry";
  }
}

// Public URL of the selling guide PDF. Lives in /public/downloads/ and is
// excluded from robots so the funnel stays the front door.
import { GUIDE_PDF_PATH, BUYING_GUIDE_PDF_PATH } from "@/lib/guide-pdfs";
export { GUIDE_PDF_PATH, BUYING_GUIDE_PDF_PATH };
export const GUIDE_PDF_URL = `https://www.yourpropertyguide.com.au${GUIDE_PDF_PATH}`;
// Cover art rendered from scripts/guide-pdf/cover-art.html. The email
// variant is a ~70KB JPEG so it loads fast on mobile data.
export const GUIDE_COVER_URL = "https://www.yourpropertyguide.com.au/images/guide/selling-guide-cover-email.jpg";
export const BUYING_GUIDE_PDF_URL = `https://www.yourpropertyguide.com.au${BUYING_GUIDE_PDF_PATH}`;
export const BUYING_GUIDE_COVER_URL = "https://www.yourpropertyguide.com.au/images/guide/buying-guide-cover-email.jpg";
// A guide is a learning request (Oct 2026): its email teaches, and only points
// to the introduction form for anyone who later wants personal help.
const APPRAISAL_URL = "https://www.yourpropertyguide.com.au/get-help?service=selling-agent&from=guide-email";
const BORROWING_URL = "https://www.yourpropertyguide.com.au/borrowing-power-calculator";
const BUYERS_AGENT_URL = "https://www.yourpropertyguide.com.au/buyers-agents";

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

export function buildAdminEmailHtml(
  lead: LeadEmailData,
  agentName: string | null,
  routedReason: string,
  /** "How they found us" rows from lib/attribution; internal only, never sent to agents. */
  attributionRows: Array<[string, string]> = [],
  /** Where the lead was delivered (the "Sent 24/7" row); plain text, escaped here. */
  deliveryRows: Array<[string, string]> = [],
): string {
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
    lead.tenanted         && ["Currently tenanted", TENANTED_LABELS[lead.tenanted] ?? escapeHtml(lead.tenanted)],
    lead.managerTimeframe && ["Wants a manager",    MANAGER_TIMEFRAME_LABELS[lead.managerTimeframe] ?? escapeHtml(lead.managerTimeframe)],
    lead.message          && ["Message",          escapeHtml(lead.message)],
    lead.propertyId       && ["Property ID",       escapeHtml(lead.propertyId)],
    lead.suburb           && ["Suburb",            escapeHtml(lead.suburb)],
    lead.appraisalAddress && ["Appraisal address", escapeHtml(lead.appraisalAddress)],
    lead.address          && ["Address",           escapeHtml(lead.address)],
    lead.propertyType     && ["Property type",     escapeHtml(lead.propertyType)],
    lead.bedrooms         && ["Bedrooms",          escapeHtml(lead.bedrooms)],
    agentName             && ["Routed to",         `${agentName} (${routedReason})`],
    lead.source           && ["Source",            escapeHtml(lead.source)],
    ...deliveryRows.map(([label, value]): [string, string] => [escapeHtml(label), escapeHtml(value)]),
  ]
    .filter((r): r is [string, string] => Array.isArray(r))
    .map(([label, value]) =>
      `<tr>
        <td style="padding:7px 12px 7px 24px;font-weight:600;white-space:nowrap;color:${C.inkMuted};background:${C.cream};border-bottom:1px solid ${C.line};">${label}</td>
        <td style="padding:7px 24px 7px 12px;color:${C.ink};border-bottom:1px solid ${C.line};">${value}</td>
       </tr>`
    )
    .join("");

  const attributionHtml = attributionRows.length
    ? `
    <p style="margin:24px 24px 8px;font-size:13px;color:${C.inkMuted};">How they found us</p>
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      ${attributionRows
        .map(
          ([label, value]) => `<tr>
        <td style="padding:6px 12px 6px 24px;font-weight:600;white-space:nowrap;color:${C.inkMuted};background:${C.cream};border-bottom:1px solid ${C.line};">${escapeHtml(label)}</td>
        <td style="padding:6px 24px 6px 12px;color:${C.ink};border-bottom:1px solid ${C.line};word-break:break-all;">${escapeHtml(value)}</td>
       </tr>`,
        )
        .join("")}
    </table>`
    : "";

  return emailLayout({
    title: typeLabel,
    body: `
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${rows}
    </table>${attributionHtml}`,
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
      // A call request from the guide thanks page: they already have the guide.
      if (lead.callKind === "agent") {
        return {
          subject: "Your free appraisal call is booked",
          intro: `Thanks ${firstName}. We've passed your request to one participating local agent.`,
          next: "They should call you within one business day to arrange your free appraisal. If you haven't heard by then, reply to this email and we'll follow up. No obligation: nothing happens unless you decide to go ahead.",
        };
      }
      if (lead.callKind === "ypg") {
        return {
          subject: "We'll give you a call",
          intro: `Thanks ${firstName}. Your call request is in.`,
          next: "Someone from Your Property Guide will call you soon. We use your number only for that call, and we never pass it to an agent.",
        };
      }
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
          ? "You said you're selling within three months, so pricing, presentation and agent choice are all still open. Start with chapter 3: it shows where your selling costs go. Then read chapter 5 before you meet agents, so you can test every appraisal. If you'd like one appraisal arranged, the button below explains how our introductions work. Nothing leaves our hands unless you ask."
          : score === "WARM"
            ? "Three to six months out gives you time to prepare properly: fix the right things, know your costs, and meet more than one agent. Start with chapter 3 (the costs) and chapter 5 (the questions to ask agents). When you're closer, you can ask us to arrange an appraisal."
            : score === "DO-NOT-CONTACT"
              ? "Since you're already listed, skip straight to chapter 7 (marketing that sells) and chapter 8 (offers and negotiation), the two chapters that matter mid-campaign. And as promised, your details stay with us and go to no one."
              : "No deadline means you get to do this the smart way. Chapter 1 shows you how to read your market and pick your moment. Keep the guide handy. The numbers in it will still be true when you're ready.";
      return {
        subject: "Your selling guide + the $20,000 question",
        intro: `Thanks ${firstName}. Your copy is ready, all ten chapters, personalised pointers included.`,
        next,
        cta: { label: "Download your guide (PDF)", url: GUIDE_PDF_URL },
        preheader: "Ten chapters, in order. Start with the costs and the questions to ask agents.",
      };
    }
    case "appraisal-request":
      return {
        subject: "Your appraisal request is in",
        intro: `Thanks ${firstName}. We've received your free appraisal request${addr ? ` for ${addr}` : ""}.`,
        next: "A local agent will be in touch within one business day to arrange the appraisal. No commitment until you decide to take it further.",
      };
    case "rental-appraisal":
      return {
        subject: "Your rental appraisal request is in",
        intro: `Thanks ${firstName}. We've received your rental appraisal request${addr ? ` for ${addr}` : ""}.`,
        next: "A property manager who works in your suburb will be in touch within one business day to arrange it. They will give you a rent figure and their fee schedule; there is no commitment until you decide to appoint them.",
      };
    case "agreement-check": {
      // A call from our team, not an agent (AGREEMENT_CHECK in service-model).
      const when = lead.signDate ? ` before ${escapeHtml(formatSignDate(lead.signDate))}, the date you plan to sign,` : "";
      return {
        subject: "We'll call you about your agency agreement",
        intro: `Thanks ${firstName}. Your free agreement check is in.`,
        next: `Someone from our team will call you${when} to go through the agreement with you: the commission, the marketing spend, the term and the exit clause. It takes about 15 minutes, so have the agreement in front of you if you can. It's general information, not legal advice, and we never pass your details to an agent.`,
      };
    }
    case "match-request":
      // Only what exists: one local agent for a seller, a pointer to the
      // right next step for anyone else. No profile email (directory paused).
      return {
        subject: "Your request is in",
        intro: `Thanks ${firstName}. Your request is in.`,
        next: `Our team will be in touch within one business day. If you're selling, we'll introduce you to one local agent who sells in ${suburb}; if we don't have one there yet, we'll tell you.`,
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
          <td style="padding:10px 12px 10px 16px;white-space:nowrap;vertical-align:top;color:${C.terracotta};font-size:15px;">${n}</td>
          <td style="padding:10px 16px 10px 0;border-bottom:1px solid ${C.line};">
            <p style="margin:0;font-size:13.5px;font-weight:600;color:${C.ink};">${headline}</p>
            <p style="margin:2px 0 0;font-size:12.5px;line-height:1.5;color:${C.inkMuted};">${t}</p>
          </td>
        </tr>`,
    )
    .join("");
  return `
      <div style="margin:0 0 18px;background:${C.cream};border:1px solid ${C.line};border-radius:10px;overflow:hidden;">
        <p style="margin:0;padding:12px 16px 2px;font-size:13px;font-weight:700;color:${C.terracottaDark};">Where the money is</p>
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
          <td style="padding:10px 12px 10px 16px;white-space:nowrap;vertical-align:top;color:${C.terracotta};font-size:15px;">${n}</td>
          <td style="padding:10px 16px 10px 0;border-bottom:1px solid ${C.line};">
            <p style="margin:0;font-size:13.5px;font-weight:600;color:${C.ink};">${headline}</p>
            <p style="margin:2px 0 0;font-size:12.5px;line-height:1.5;color:${C.inkMuted};">${t}</p>
          </td>
        </tr>`,
    )
    .join("");
  return `
      <div style="margin:0 0 18px;background:${C.cream};border:1px solid ${C.line};border-radius:10px;overflow:hidden;">
        <p style="margin:0;padding:12px 16px 2px;font-size:13px;font-weight:700;color:${C.terracottaDark};">Where the money is</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">${items}</table>
      </div>`;
}

export function buildConfirmationHtml(lead: LeadEmailData): string {
  const C = EMAIL_COLORS;
  const { intro, next, cta, preheader } = confirmationCopy(lead);

  // Guide delivery gets the full treatment: cover-art hero, centred
  // download button, chapter on-ramp, score-aware next step. Everything
  // else, a guide call request included, keeps the quiet single-column note.
  if (lead.type === "guide-download" && !lead.callKind) {
    const score = scoreGuideLead(lead);
    const buying = lead.guideType === "buying";
    // The dark panel (Oct 2026): a guide is a learning request, so the email
    // teaches and then points, quietly, to personal help for anyone who wants
    // it later. Sellers who aren't listed see how an appraisal introduction
    // works; buyers see what a buyer's agent does. Listed sellers were
    // promised no agent contact, so they get neither.
    const panel = (eyebrow: string, text: string, button: string) => `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 0;background:${C.ink};border-radius:10px;">
        <tr><td style="padding:20px 22px;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:${C.apricot};">${eyebrow}</p>
          ${text}
          ${button}
        </td></tr>
      </table>`;
    const appraisalPanel = buying
      ? (score === "HOT" || score === "WARM"
        ? panel("Know your number", `<p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:rgba(254,251,247,0.8);">Every good buying decision starts with one number: what a lender will actually approve, after the serviceability buffer. The borrowing power calculator runs it in 60 seconds, no sign-up.</p>`, emailButton("Run my borrowing power", BORROWING_URL))
        : "") +
        panel(
          "Thinking about a buyer's agent?",
          `<p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:rgba(254,251,247,0.8);">A buyer's agent works for you, not the seller, and charges you a fee for it. Most people buy without one. If you're weighing it up, here's what they do, what they cost and when they're worth it.</p>`,
          emailButton("What a buyer's agent does", BUYERS_AGENT_URL),
        )
      : score !== "DO-NOT-CONTACT"
        ? panel("Put a number on it", `<p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:rgba(254,251,247,0.8);">Medians tell you about the suburb. An appraisal tells you about <em style="color:#ffffff;font-style:normal;font-weight:600;">your place</em>: a defensible price range, the comparable sales behind it, and what to fix first. When you're ready for one, we can introduce one participating local agent for a free appraisal. Only if you ask, with no obligation to list.</p>`, emailButton("How introductions work", APPRAISAL_URL))
        : "";

    const psLine =
      score === "HOT" && !buying
        ? `<p style="margin:18px 0 0;font-size:13.5px;line-height:1.6;color:${C.inkMuted};"><strong style="color:${C.ink};">P.S.</strong> Selling soon and stuck on something? Reply with your question and a person will answer it.</p>`
        : score === "HOT" && buying
          ? `<p style="margin:18px 0 0;font-size:13.5px;line-height:1.6;color:${C.inkMuted};"><strong style="color:${C.ink};">P.S.</strong> Want a second pair of eyes on a property you're circling? Reply with the listing link and we'll tell you what we'd check first.</p>`
          : "";

    return emailLayout({
      preheader,
      body: `
      ${emailCoverHero(buying ? BUYING_GUIDE_COVER_URL : GUIDE_COVER_URL, `Your guide is ready, ${escapeHtml(lead.firstName)}.`, buying ? "Ten chapters on buying well, from budget to settlement. Free, and yours to keep." : "Ten chapters on selling well, from costs to settlement. Free, and yours to keep.")}
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
          <p style="margin:22px 0 0;font-size:14px;line-height:1.5;color:${C.inkMuted};">Happy reading,<br/><span style="font-size:15px;color:${C.ink};">The team at Your Property Guide</span></p>
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
