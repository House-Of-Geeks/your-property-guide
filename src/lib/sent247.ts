import {
  scoreGuideLead,
  TIMEFRAME_LABELS,
  AGENT_STATUS_LABELS,
  type LeadEmailData,
} from "@/lib/lead-emails";
import type { LeadAttribution } from "@/lib/attribution-server";
import { normalizePhone } from "@/lib/utils/phone";

// Sent 24/7 (sent247.com), the way Why Solar uses it (House-Of-Geeks/Why-Solar:
// lib/sent247.ts for leads, lib/battery-guide/sent247.ts for its ebook).
//
// Guide downloads are NOT sent to Sent 24/7 (21 Oct 2026). Its lead-magnet
// delivery (the guide plus a follow-up series, switched on by
// LEAD_MAGNET_TO_SENT247) is retired: guides and learning follow-ups are
// emailed by the application through SendGrid (src/lib/mail/), with the
// reader's own consent choices. The lead-magnet code is removed, so one
// guide request can never produce a second, external delivery; the
// LEAD_MAGNET_TO_SENT247 variable now does nothing.
//
// A call request from a seller YPG may sell is a lead: POST /api/v1/leads to
// the vendor campaign, which hands it to one agent. Any lead with an email and
// a phone also stops that address's guide series in Sent 24/7. A download's
// mobile (optional on the email step since 14 Oct 2026) is for the YPG team
// only, and /api/leads posts a lead only for an explicit call request
// (call: true from the thanks page). Introductions (/api/introductions) use
// the same lead endpoint.
//
// Both need SENT247_API_KEY (a seller key in the YPG tenant) and
// SENT247_VENDOR_CAMPAIGN_ID. Only leads YPG may sell are ever posted as
// leads (sent247HoldReason): in Sent 24/7 a campaign with no buyers linked
// offers its leads to every active buyer in the tenant.

// SENT247_BASE_URL overrides the host for staging checks against a mock
// intake (never set in production).
export const SENT247_BASE_URL = process.env.SENT247_BASE_URL?.trim() || "https://api.sent247.com";
const LEADS_URL = `${SENT247_BASE_URL}/api/v1/leads`;
const TIMEOUT_MS = 8_000;

export function sent247BuyerCampaignId(): string | null {
  return process.env.SENT247_BUYER_CAMPAIGN_ID?.trim() || null;
}

export function sent247Config(): { apiKey: string; vendorCampaignId: string } | null {
  const apiKey = process.env.SENT247_API_KEY?.trim();
  const vendorCampaignId = process.env.SENT247_VENDOR_CAMPAIGN_ID?.trim();
  return apiKey && vendorCampaignId ? { apiKey, vendorCampaignId } : null;
}

type GuideLeadFields = Pick<
  LeadEmailData,
  | "type"
  | "guideType"
  | "sellingTimeframe"
  | "agentStatus"
  | "financeStatus"
  | "source"
  | "suburb"
  | "propertyType"
  | "bedrooms"
  | "motivation"
  | "priceExpectation"
>;

/**
 * Why a guide lead (or partial) stays with YPG, or null when it may go to the
 * vendor campaign. Mirrors what each collection statement promised and the
 * agent-facing terms (cold vendors are not sold).
 */
export function sent247HoldReason(lead: GuideLeadFields): string | null {
  if (lead.type !== "guide-download") return "not a guide lead";
  if (lead.guideType === "buying") return "buying guide: never passed to agents";
  if (lead.agentStatus === "already-listed") return "already listed: promised no agent contact";
  const score = scoreGuideLead(lead);
  if (score !== "HOT" && score !== "WARM") return `${score} vendor: cold vendors are not sold`;
  // The suburb step can be skipped, and with no suburb there is no local
  // agent to hand it to: the team calls first (the call's one-agent consent
  // still lets them pass it on once they know where the property is).
  if (!lead.suburb?.trim()) return "no suburb: team to call first";
  return null;
}

/** "0412 345 678" -> "+61412345678". Business and overseas numbers pass through normalised. */
export function toE164AU(raw: string): string {
  const n = normalizePhone(raw) ?? raw.trim();
  return /^0[2-478]\d{8}$/.test(n) ? `+61${n.slice(1)}` : n;
}

/** "bondi-nsw-2026" -> { city: "Bondi", state: "NSW", zip: "2026", country: "AU" }. */
export function addressFromSuburbSlug(slug: string | undefined | null) {
  const m = slug?.match(/^(.*)-([a-z]{2,3})-(\d{4})$/);
  if (!m) return undefined;
  const city = m[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { city, state: m[2].toUpperCase(), zip: m[3], country: "AU" };
}

function compact(o: Record<string, string | null | undefined>): Record<string, string> {
  return Object.fromEntries(Object.entries(o).filter((e): e is [string, string] => !!e[1]));
}

/** The answers, as custom fields the buyer and the recovery templates can use. */
export function guideCustomFields(lead: GuideLeadFields): Record<string, string> {
  return compact({
    source:            lead.source,
    guide_type:        lead.guideType === "buying" ? "buying" : "selling",
    lead_score:        scoreGuideLead(lead),
    suburb:            lead.suburb,
    property_type:     lead.propertyType,
    bedrooms:          lead.bedrooms,
    selling_timeframe: lead.sellingTimeframe && (TIMEFRAME_LABELS[lead.sellingTimeframe] ?? lead.sellingTimeframe),
    agent_status:      lead.agentStatus && (AGENT_STATUS_LABELS[lead.agentStatus] ?? lead.agentStatus),
    motivation:        lead.motivation,
    price_expectation: lead.priceExpectation,
  });
}

export interface RequestContext {
  ip?: string;
  userAgent?: string;
}

export function requestContext(request: Request): RequestContext {
  return {
    ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || undefined,
    userAgent: request.headers.get("user-agent") || undefined,
  };
}

/** Sent 24/7's attribution block from the ypg_attr cookie: the latest campaign touch, else the first. */
export function sent247Attribution(a: LeadAttribution | null, ctx: RequestContext) {
  const s = a?.state ?? null;
  const touch = s?.last ?? s?.first;
  return {
    source:       touch?.utm_source,
    medium:       touch?.utm_medium,
    campaign:     touch?.utm_campaign,
    term:         touch?.utm_term,
    content:      touch?.utm_content,
    gclid:        a?.gclid ?? undefined,
    gbraid:       s?.google?.gbraid,
    wbraid:       s?.google?.wbraid,
    msclkid:      s?.microsoft?.msclkid,
    fbclid:       touch?.fbclid,
    ttclid:       touch?.ttclid,
    landing_page: s?.first.landing_page,
    referrer:     s?.first.referrer,
    ip_address:   ctx.ip,
    user_agent:   ctx.userAgent,
  };
}

export interface Sent247LeadInput {
  lead: LeadEmailData & { phone: string };
  campaignId: string;
  /** Our Lead.id: the Idempotency-Key and a custom field. */
  referenceId: string;
  consentText: string;
  attribution: LeadAttribution | null;
  ctx: RequestContext;
  /** ?c= from a Sent 24/7 email link: credits that email with the lead. */
  resumeClickId?: string;
  /** Extra custom fields (an introduction request's service, preferred contact, timing). */
  extraFields?: Record<string, string>;
}

export function buildSent247LeadBody(i: Sent247LeadInput) {
  return {
    campaign_id: i.campaignId,
    ...(i.resumeClickId ? { resume_click_id: i.resumeClickId } : {}),
    lead: {
      first_name: i.lead.firstName,
      // Required by the intake; "-" as Why Solar sends when there is none.
      last_name: i.lead.lastName?.trim() || "-",
      email: i.lead.email,
      phone: toE164AU(i.lead.phone),
      address: addressFromSuburbSlug(i.lead.suburb),
    },
    custom_fields: { ...guideCustomFields(i.lead), ...(i.extraFields ?? {}), reference_id: i.referenceId },
    attribution: sent247Attribution(i.attribution, i.ctx),
    consent: {
      tcpa_consent: true,
      consent_timestamp: new Date().toISOString(),
      consent_ip: i.ctx.ip,
      consent_text: i.consentText,
    },
  };
}

export type Sent247Outcome =
  | { kind: "accepted"; leadId: string | null; status: string | null }
  | { kind: "rejected"; leadId: string | null; reason: string }
  | { kind: "failed"; reason: string };

/**
 * POST a complete lead. Never throws. A filter or duplicate rejection comes
 * back as HTTP 200 with success:false, which is "rejected", not "failed".
 */
export async function sendSent247Lead(apiKey: string, input: Sent247LeadInput): Promise<Sent247Outcome> {
  try {
    const res = await fetch(LEADS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": input.referenceId,
      },
      body: JSON.stringify(buildSent247LeadBody(input)),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const json = (await res.json().catch(() => null)) as {
      success?: boolean;
      lead_id?: string;
      status?: string;
      rejection_reasons?: string[];
      error?: { message?: string };
    } | null;
    if (!res.ok) {
      return { kind: "failed", reason: `HTTP ${res.status}${json?.error?.message ? `: ${json.error.message}` : ""}` };
    }
    if (json?.success === false) {
      return {
        kind: "rejected",
        leadId: json.lead_id ?? null,
        reason: json.rejection_reasons?.join("; ") || json.status || "rejected",
      };
    }
    return { kind: "accepted", leadId: json?.lead_id ?? null, status: json?.status ?? null };
  } catch (err) {
    return { kind: "failed", reason: err instanceof Error ? err.message : String(err) };
  }
}

/** One line for the team email's "Sent 24/7" row. */
export function describeSent247(outcome: Sent247Outcome | { kind: "held"; reason: string } | { kind: "off" }): string {
  switch (outcome.kind) {
    case "accepted":
      return `Accepted${outcome.status ? ` (${outcome.status})` : ""}${outcome.leadId ? `, lead ${outcome.leadId}` : ""}`;
    case "rejected":
      return `Rejected by Sent 24/7: ${outcome.reason}`;
    case "failed":
      return `FAILED, not delivered: ${outcome.reason}. Forward this lead by hand.`;
    case "held":
      return `Not sent (${outcome.reason})`;
    case "off":
      return "Not sent (Sent 24/7 not configured)";
  }
}
