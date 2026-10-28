import { EMAIL_COLORS, emailLayout, emailButton, emailButtonOutline, emailCoverHero, emailHeading, emailLabel } from "@/lib/email-theme";
import { escapeHtml, textBlocks, visitorGreeting, visitorGreetingName, visitorSubjectName } from "@/lib/email-format";
import { GUIDE_BOOKS, chapterHref, subtitleLine, type GuideBookId } from "@/lib/guide-books";

// Lead email rendering + scoring, extracted from /api/leads so it can be
// unit-tested and previewed without booting the route (which imports the
// Prisma client). Sending goes through the email queue (src/lib/mail/);
// these builders only render.

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
const SITE = "https://www.yourpropertyguide.com.au";
export const GUIDE_PDF_URL = `${SITE}${GUIDE_PDF_PATH}`;
// Cover art printed from /print/guides/<guide> by npm run guides:pdf. The email
// variant (GUIDE_BOOKS[id].coverEmail) is a small JPEG so it loads fast on
// mobile data.
export const GUIDE_COVER_URL = `${SITE}${GUIDE_BOOKS.selling.coverEmail}`;
export const BUYING_GUIDE_PDF_URL = `${SITE}${BUYING_GUIDE_PDF_PATH}`;
export const BUYING_GUIDE_COVER_URL = `${SITE}${GUIDE_BOOKS.buying.coverEmail}`;
// A guide is a learning request (Oct 2026): its email teaches, and only points
// to the introduction form for anyone who later wants personal help.
const APPRAISAL_URL = "https://www.yourpropertyguide.com.au/get-help?service=selling-agent&from=guide-email";
const BORROWING_URL = "https://www.yourpropertyguide.com.au/borrowing-power-calculator";
const BUYERS_AGENT_URL = "https://www.yourpropertyguide.com.au/buyers-agents";

// Lead fields are attacker-controlled free text (any bot can POST
// /api/leads). Escape them before they land inside an email template:
// injected markup in the internal notification reads as phishing, and
// the confirmation email would reflect it back to any address the
// attacker typed in.

const LABEL_CELL = `padding:7px 12px 7px 24px;font-weight:600;vertical-align:top;width:140px;max-width:140px;color:`;
const VALUE_CELL = `padding:7px 24px 7px 12px;overflow-wrap:anywhere;word-break:break-word;color:`;

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
    ["Email",   `<a href="mailto:${email}" style="color:${C.copper};">${email}</a>`],
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
    agentName             && ["Routed to",         `${escapeHtml(agentName)} (${escapeHtml(routedReason)})`],
    lead.source           && ["Source",            escapeHtml(lead.source)],
    ...deliveryRows.map(([label, value]): [string, string] => [escapeHtml(label), escapeHtml(value)]),
  ]
    .filter((r): r is [string, string] => Array.isArray(r))
    .map(([label, value]) =>
      `<tr>
        <td style="${LABEL_CELL}${C.inkMuted};background:${C.sand};border-bottom:1px solid ${C.line};">${label}</td>
        <td style="${VALUE_CELL}${C.ink};border-bottom:1px solid ${C.line};">${value}</td>
       </tr>`
    )
    .join("");

  const attributionHtml = attributionRows.length
    ? `
    ${emailLabel("How they found us", "24px 24px 8px")}
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      ${attributionRows
        .map(
          ([label, value]) => `<tr>
        <td style="${LABEL_CELL}${C.inkMuted};background:${C.sand};border-bottom:1px solid ${C.line};">${escapeHtml(label)}</td>
        <td style="${VALUE_CELL}${C.ink};border-bottom:1px solid ${C.line};">${escapeHtml(value)}</td>
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
// intro and next are plain text. buildConfirmationHtml escapes them.
export function confirmationCopy(lead: LeadEmailData): { subject: string; intro: string; next: string; cta?: { label: string; url: string }; preheader?: string } {
  const hi = visitorGreeting(lead.firstName);
  const suburb = lead.suburb?.trim() ? lead.suburb.trim() : "your area";
  const rawAddr = (lead.appraisalAddress || lead.address)?.trim();
  const addr = rawAddr || "";
  switch (lead.type) {
    case "guide-download": {
      // A call request from the guide thanks page: they already have the guide.
      if (lead.callKind === "agent") {
        return {
          subject: "Your free appraisal call is booked",
          intro: `${hi} we've passed your request to one participating local agent.`,
          next: "They should call you within one business day to arrange your free appraisal. If you haven't heard by then, reply to this email and we'll follow up. No obligation: nothing happens unless you decide to go ahead.",
        };
      }
      if (lead.callKind === "ypg") {
        return {
          subject: "We'll give you a call",
          intro: `${hi} your call request is in.`,
          next: "Someone from Your Property Guide will call you soon. We use your number only for that call, and we never pass it to an agent.",
        };
      }
      const score = scoreGuideLead(lead);
      if (lead.guideType === "buying") {
        const book = GUIDE_BOOKS.buying;
        const next =
          score === "HOT"
            ? `With finance sorted and a purchase planned within three months, decisions can come quickly. Start with ${chapterRef("buying", 6)}: it explains price guides, open homes, auctions and off-market sales, and how to respond to each. Then read ${chapterRef("buying", 7)}, on negotiating, protective conditions and buying at auction. If you’re still settling on an area, the suburb quiz takes two minutes and scores six suburbs against what you care about.`
            : score === "WARM"
              ? `You’re close enough that finance is the next step. ${chapterRef("buying", 2, "Chapter")}, covers borrowing power, deposits and the buffer lenders test you against, and ${chapterRef("buying", 8)}, explains pre-approval and what happens if a valuation falls short. With those two settled, each inspection is easier to judge.`
              : `Buying well starts long before the inspections. ${chapterRef("buying", 1, "Chapter")}, explains what changes for a first home, a next home, an investment or a downsize. Keep the guide handy for when you’re ready.`;
        return {
          subject: `Your copy of ${book.name}, and where to start`,
          intro: `${hi} here’s your copy of ${book.name}, all ten chapters.`,
          next,
          cta: { label: "Download your guide (PDF)", url: BUYING_GUIDE_PDF_URL },
          preheader: "Ten chapters, from your first budget to the day you get the keys. Start with what you can spend.",
        };
      }
      // Score-aware copy: one or two chapters to read first, chosen for
      // where the reader is, named by their titles in GUIDE_BOOKS.
      const book = GUIDE_BOOKS.selling;
      const next =
        score === "HOT"
          ? `You said you’re selling within three months, so pricing, preparation and your choice of agent are all still open. Start with ${chapterRef("selling", 3)}, to see where the money goes. Read ${chapterRef("selling", 5)}, before you meet agents, so you know what to ask about each appraisal and proposal. If you’d like one appraisal arranged, the button below explains how our introductions work. Nothing is passed on unless you ask.`
          : score === "WARM"
            ? `Three to six months out gives you time to prepare properly: decide what’s worth fixing, know your costs and meet more than one agent. Start with ${chapterRef("selling", 3)}, and ${chapterRef("selling", 5)}. When you’re closer, you can ask us to arrange an appraisal.`
            : score === "DO-NOT-CONTACT"
              ? `Since you’re already listed, ${chapterRef("selling", 7)}, and ${chapterRef("selling", 8)}, are the two that matter most while your property is on the market. As promised, your details stay with us and go to no one.`
              : `With no deadline, you have time to do this well. Start with ${chapterRef("selling", 1)}, which covers your reasons, market conditions, the season, and whether to sell or buy first. Keep the guide handy for when you’re ready.`;
      return {
        subject: `Your copy of ${book.name}, and where to start`,
        intro: `${hi} here’s your copy of ${book.name}, all ten chapters, with a few pointers on where to start.`,
        next,
        cta: { label: "Download your guide (PDF)", url: GUIDE_PDF_URL },
        preheader: "Ten chapters, in order. Start with the costs and the questions to ask agents.",
      };
    }
    case "appraisal-request":
      return {
        subject: "Your appraisal request is in",
        intro: `${hi} we've received your free appraisal request${addr ? ` for ${addr}` : ""}.`,
        next: "A local agent will be in touch within one business day to arrange the appraisal. No commitment until you decide to take it further.",
      };
    case "rental-appraisal":
      return {
        subject: "Your rental appraisal request is in",
        intro: `${hi} we've received your rental appraisal request${addr ? ` for ${addr}` : ""}.`,
        next: "A property manager who works in your suburb will be in touch within one business day to arrange it. They will give you a rent figure and their fee schedule; there is no commitment until you decide to appoint them.",
      };
    case "agreement-check": {
      // A call from our team, not an agent (AGREEMENT_CHECK in service-model).
      const when = lead.signDate ? ` before ${formatSignDate(lead.signDate)}, the date you plan to sign,` : "";
      return {
        subject: "We'll call you about your agency agreement",
        intro: `${hi} your free agreement check is in.`,
        next: `Someone from our team will call you${when} to go through the agreement with you: the commission, the marketing spend, the term and the exit clause. It takes about 15 minutes, so have the agreement in front of you if you can. It's general information, not legal advice, and we never pass your details to an agent.`,
      };
    }
    case "match-request":
      // Only what exists: one local agent for a seller, a pointer to the
      // right next step for anyone else. No profile email (directory paused).
      return {
        subject: "Your request is in",
        intro: `${hi} your request is in.`,
        next: `Our team will be in touch within one business day. If you're selling, we'll introduce you to one local agent who sells in ${suburb}; if we don't have one there yet, we'll tell you.`,
      };
    case "suburb-alert":
      return {
        subject: `You're on the alert list for ${lead.suburb?.trim() || "your suburb"}`,
        intro: `${hi} you're now on the property alert list for ${lead.suburb?.trim() || "your suburb"}.`,
        next: "We'll email you when new listings hit the market. One email per match, no roundup spam. Unsubscribe anytime.",
      };
    case "off-market-register":
      return {
        subject: "You're registered for off-market alerts",
        intro: `${hi} you're registered for off-market alerts in ${suburb}.`,
        next: "We'll email you matching properties as they come in. One email per match.",
      };
    case "house-and-land-enquiry":
      return {
        subject: "Your house & land enquiry is in",
        intro: `${hi} we've received your enquiry.`,
        next: "A specialist will be in touch within one business day with the details and next steps.",
      };
    case "property-enquiry":
    case "property-interest":
      return {
        subject: "We've received your enquiry",
        intro: `${hi} your enquiry is in.`,
        next: "The listing agent will be in touch within one business day.",
      };
    case "general-contact":
    default:
      return {
        subject: "We've received your message",
        intro: `${hi} your message is in.`,
        next: "We'll get back to you within one business day.",
      };
  }
}

// "Chapter 3, “The real cost of selling”": a chapter named by its title in
// GUIDE_BOOKS, so the emails never drift from the guides.
function chapterRef(id: GuideBookId, n: number, word: "chapter" | "Chapter" = "chapter"): string {
  return `${word} ${n}, “${GUIDE_BOOKS[id].chapters[n - 1].title}”`;
}

// The guide-delivery email's "where to start" strip: three chapters, each
// with its title and subtitle from GUIDE_BOOKS and a link to its page.
const START_CHAPTERS: Record<GuideBookId, readonly number[]> = {
  selling: [3, 4, 5],
  buying: [2, 3, 6],
};

function guideHighlightsHtml(id: GuideBookId): string {
  const C = EMAIL_COLORS;
  const book = GUIDE_BOOKS[id];
  const items = START_CHAPTERS[id]
    .map((n, i, all) => {
      const ch = book.chapters[n - 1];
      const rule = i < all.length - 1 ? `border-bottom:1px solid ${C.line};` : "";
      return `<tr><td style="padding:12px 18px;${rule}">
            ${emailLabel(`Chapter ${n}`, "0 0 3px")}
            <p style="margin:0;font-size:15px;line-height:1.4;font-weight:600;"><a href="${escapeHtml(`${SITE}${chapterHref(id, n)}`)}" style="color:${C.ink};text-decoration:none;">${escapeHtml(ch.title)}</a></p>
            <p style="margin:3px 0 0;font-size:13px;line-height:1.5;color:${C.inkMuted};">${escapeHtml(ch.sub)}</p>
          </td></tr>`;
    })
    .join("");
  return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:${C.sand};border:1px solid ${C.line};border-radius:4px;">
        <tr><td style="padding:16px 18px 4px;">${emailHeading("Where to start", { size: 19, margin: "0", tag: "h3" })}</td></tr>
        ${items}
      </table>`;
}

export function buildConfirmationHtml(lead: LeadEmailData): string {
  const C = EMAIL_COLORS;
  const { subject, intro, next, cta, preheader } = confirmationCopy(lead);
  const introHtml = escapeHtml(intro);
  const nextHtml = escapeHtml(next);

  // Guide delivery gets the full treatment: the cover on a sand panel, the
  // download button, where to start, and a score-aware next step.
  // Everything else, a guide call request included, keeps the quiet
  // single-column note.
  if (lead.type === "guide-download" && !lead.callKind) {
    const score = scoreGuideLead(lead);
    const buying = lead.guideType === "buying";
    const book = GUIDE_BOOKS[buying ? "buying" : "selling"];
    // The sand panels (Oct 2026): a guide is a learning request, so the
    // email teaches and then points, quietly, to personal help for anyone
    // who wants it later. Sellers who aren't listed see how an appraisal
    // introduction works; buyers see what a buyer's agent does. Listed
    // sellers were promised no agent contact, so they get neither. The
    // download stays the one solid button; the panels use the outline.
    const panel = (heading: string, text: string, button: string) => `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 0;background:${C.sand};border:1px solid ${C.line};border-radius:4px;">
        <tr><td style="padding:20px 22px;">
          ${emailHeading(heading, { size: 19, margin: "0 0 8px", tag: "h3" })}
          ${text}
          ${button}
        </td></tr>
      </table>`;
    const panelText = (html: string) => `<p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:${C.ink};">${html}</p>`;
    const appraisalPanel = buying
      ? (score === "HOT" || score === "WARM"
        ? panel("Know your budget", panelText("Every buying decision starts with one number: what a lender will approve after the serviceability buffer. The borrowing power calculator runs it in 60 seconds, no sign-up."), emailButtonOutline("Run my borrowing power", BORROWING_URL))
        : "") +
        panel(
          "Thinking about a buyer’s agent?",
          panelText("A buyer’s agent works for you, not the seller, and charges you a fee for it. Most people buy without one. If you’re weighing it up, here’s what they do, what they cost and when they’re worth it."),
          emailButtonOutline("What a buyer’s agent does", BUYERS_AGENT_URL),
        )
      : score !== "DO-NOT-CONTACT"
        ? panel("Put a number on it", panelText(`Medians tell you about the suburb. An appraisal tells you about <em style="font-style:italic;">your place</em>: a price range backed by comparable sales, and what to fix first. When you’re ready for one, we can introduce one participating local agent for a free appraisal. Only if you ask, with no obligation to list.`), emailButtonOutline("How introductions work", APPRAISAL_URL))
        : "";

    const psLine =
      score === "HOT" && !buying
        ? `<p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:${C.inkMuted};"><strong style="color:${C.ink};">P.S.</strong> Selling soon and stuck on something? Reply with your question and a person will answer it.</p>`
        : score === "HOT" && buying
          ? `<p style="margin:18px 0 0;font-size:14px;line-height:1.6;color:${C.inkMuted};"><strong style="color:${C.ink};">P.S.</strong> Looking at a particular property? Reply with the listing link and we’ll tell you what we’d check first.</p>`
          : "";

    return emailLayout({
      preheader,
      body: `
      ${emailCoverHero(
        { url: buying ? BUYING_GUIDE_COVER_URL : GUIDE_COVER_URL, alt: book.title, label: book.name },
        `Your guide is ready, ${escapeHtml(visitorGreetingName(lead.firstName))}.`,
        escapeHtml(`${subtitleLine(book)} Ten chapters, free and yours to keep.`),
      )}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td align="center" style="padding:26px 28px 6px;">
          ${emailButton("Download your guide (PDF)", buying ? BUYING_GUIDE_PDF_URL : GUIDE_PDF_URL)}
          <p style="margin:10px 0 0;font-size:12px;color:${C.inkMuted};">Free PDF · Works on any device · Yours to keep</p>
        </td></tr>
        <tr><td style="padding:18px 28px 26px;">
          ${guideHighlightsHtml(book.id)}
          <p style="margin:0;font-size:15px;line-height:1.65;color:${C.ink};">${nextHtml}</p>
          ${appraisalPanel}
          ${psLine}
          <p style="margin:22px 0 0;font-size:14px;line-height:1.5;color:${C.inkMuted};">Happy reading,<br/><span style="font-size:15px;color:${C.ink};">The team at Your Property Guide</span></p>
          <p style="margin:18px 0 0;font-size:12px;color:${C.inkMuted};line-height:1.55;">If you didn’t request this guide, you can ignore this email.</p>
        </td></tr>
      </table>`,
    });
  }

  const ctaHtml = cta ? `<p style="margin:0 0 18px;">${emailButton(cta.label, cta.url)}</p>` : "";
  return emailLayout({
    preheader,
    body: `
    <div style="padding:24px 28px;">
      ${emailHeading(escapeHtml(subject), { size: 22, margin: "0 0 14px" })}
      <p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:${C.ink};">${introHtml}</p>
      ${ctaHtml}
      <p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:${C.ink};">${nextHtml}</p>
      <p style="margin:0 0 6px;font-size:13px;color:${C.inkMuted};line-height:1.55;">If you didn't submit this enquiry, you can ignore this email.</p>
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
        <li><strong>Lead ID:</strong> ${escapeHtml(leadId)}</li>
        <li><strong>Type:</strong> ${labelFor(lead.type)}</li>
        <li><strong>Name:</strong> ${fullName}</li>
        <li><strong>Email:</strong> <a href="mailto:${email}" style="color:${C.copper};">${email}</a></li>
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
  const pretty = escapeHtml(visitorSubjectName(lead.firstName, lead.lastName) || "A lead");
  const email = escapeHtml(lead.email);
  const safePhone = escapeHtml(phone);
  return emailLayout({
    eyebrow: "Lead upgraded",
    title: `${pretty} added a phone number`,
    body: `
    <div style="padding:18px 24px;font-size:14px;color:${C.ink};line-height:1.55;">
      <p style="margin:0 0 12px;">An existing lead just added their mobile. They want the call. Worth moving to the top of the follow-up list.</p>
      <ul style="margin:0;padding-left:18px;">
        <li><strong>Phone:</strong> <a href="tel:${safePhone}" style="color:${C.copper};">${safePhone}</a></li>
        <li><strong>Name:</strong> ${fullName}</li>
        <li><strong>Email:</strong> <a href="mailto:${email}" style="color:${C.copper};">${email}</a></li>
        <li><strong>Original lead:</strong> ${labelFor(lead.type)}</li>
        ${lead.suburb ? `<li><strong>Suburb:</strong> ${escapeHtml(lead.suburb)}</li>` : ""}
        ${lead.source ? `<li><strong>Source:</strong> ${escapeHtml(lead.source)}</li>` : ""}
        <li><strong>Lead ID:</strong> ${escapeHtml(lead.id)}</li>
      </ul>
    </div>`,
  });
}

export function buildConfirmationText(lead: LeadEmailData): string {
  const { intro, next, cta } = confirmationCopy(lead);
  const extra: string[] = [];
  if (lead.type === "guide-download" && !lead.callKind) {
    const buying = lead.guideType === "buying";
    const score = scoreGuideLead(lead);
    if (buying) {
      if (score === "HOT" || score === "WARM") extra.push("Run my borrowing power\n" + BORROWING_URL);
      extra.push("What a buyer’s agent does\n" + BUYERS_AGENT_URL);
    } else if (score !== "DO-NOT-CONTACT") {
      extra.push("How introductions work\n" + APPRAISAL_URL);
    }
  }
  return textBlocks([
    intro,
    next,
    cta ? `${cta.label}\n${cta.url}` : null,
    ...extra,
    "Your Property Guide\nhttps://www.yourpropertyguide.com.au",
  ]);
}

export function buildAdminEmailText(
  lead: LeadEmailData,
  agentName: string | null,
  routedReason: string,
  attributionRows: Array<[string, string]> = [],
  deliveryRows: Array<[string, string]> = [],
): string {
  const fullName = lead.lastName ? `${lead.firstName} ${lead.lastName}` : lead.firstName;
  const score = lead.type === "guide-download" ? scoreGuideLead(lead) : null;
  const lines: string[] = [labelFor(lead.type, lead.guideType), ""];
  const push = (label: string, value: string | null | undefined) => {
    if (value) lines.push(`${label}: ${value}`);
  };
  if (score) push("Lead score", score);
  push("Name", fullName);
  push("Email", lead.email);
  push("Phone", lead.phone);
  push("Buyer type", lead.buyerPersona && (BUYER_PERSONA_LABELS[lead.buyerPersona] ?? lead.buyerPersona));
  push("Timeframe", lead.sellingTimeframe && (TIMEFRAME_LABELS[lead.sellingTimeframe] ?? lead.sellingTimeframe));
  push("Finance", lead.financeStatus && (FINANCE_STATUS_LABELS[lead.financeStatus] ?? lead.financeStatus));
  push("Budget", lead.budget);
  push("Agent status", lead.agentStatus && (AGENT_STATUS_LABELS[lead.agentStatus] ?? lead.agentStatus));
  push("Reason for selling", lead.motivation);
  push("Price expectation", lead.priceExpectation);
  if (lead.marketingConsent !== undefined) push("Marketing consent", lead.marketingConsent ? "Yes (opted in)" : "No");
  push("Currently tenanted", lead.tenanted && (TENANTED_LABELS[lead.tenanted] ?? lead.tenanted));
  push("Wants a manager", lead.managerTimeframe && (MANAGER_TIMEFRAME_LABELS[lead.managerTimeframe] ?? lead.managerTimeframe));
  push("Message", lead.message);
  push("Property ID", lead.propertyId);
  push("Suburb", lead.suburb);
  push("Appraisal address", lead.appraisalAddress);
  push("Address", lead.address);
  push("Property type", lead.propertyType);
  push("Bedrooms", lead.bedrooms);
  if (agentName) push("Routed to", `${agentName} (${routedReason})`);
  push("Source", lead.source);
  for (const [label, value] of deliveryRows) lines.push(`${label}: ${value}`);
  if (attributionRows.length) {
    lines.push("", "How they found us");
    for (const [label, value] of attributionRows) lines.push(`${label}: ${value}`);
  }
  return lines.join("\n").trim();
}

export function buildFailureAlertText(leadId: string, lead: LeadEmailData, mailErr: unknown): string {
  const errMsg = mailErr instanceof Error ? mailErr.message : String(mailErr);
  const fullName = lead.lastName ? `${lead.firstName} ${lead.lastName}` : lead.firstName;
  return textBlocks([
    "Lead notification failed",
    "A lead was saved to the database but the standard notification email did not send.",
    `Lead ID: ${leadId}`,
    `Type: ${labelFor(lead.type)}`,
    `Name: ${fullName}`,
    `Email: ${lead.email}`,
    lead.phone ? `Phone: ${lead.phone}` : null,
    lead.suburb ? `Suburb: ${lead.suburb}` : null,
    lead.source ? `Source: ${lead.source}` : null,
    `SMTP error: ${errMsg}`,
  ]);
}

export function buildPhoneAddedText(
  lead: { id: string; type: string; firstName: string; lastName: string | null; email: string; suburb: string | null; source: string | null },
  phone: string,
): string {
  const fullName = lead.lastName ? `${lead.firstName} ${lead.lastName}` : lead.firstName;
  return textBlocks([
    "An existing lead just added their mobile. They want the call.",
    `Phone: ${phone}`,
    `Name: ${fullName}`,
    `Email: ${lead.email}`,
    `Original lead: ${labelFor(lead.type)}`,
    lead.suburb ? `Suburb: ${lead.suburb}` : null,
    lead.source ? `Source: ${lead.source}` : null,
    `Lead ID: ${lead.id}`,
  ]);
}
