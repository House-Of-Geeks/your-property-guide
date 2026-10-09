import { scoreGuideLead, TIMEFRAME_LABELS, AGENT_STATUS_LABELS, type LeadEmailData } from "@/lib/lead-emails";
import type { LeadAttribution } from "@/lib/attribution-server";
import { normalizePhone } from "@/lib/utils/phone";

// Sent 24/7 (sent247.com) lead delivery, the way Why Solar does it
// (House-Of-Geeks/Why-Solar, lib/sent247.ts). Complete guide leads go to the
// Your Property Guide tenant's vendor campaign, which hands each one to one
// agent. Partials (name + email, no mobile yet) are held there, never
// distributed, and recovered by the campaign's email sequence; its resume link
// comes back to the funnel as ?resume=<token>&ws_resume=<PartialLead id>.
// A later full lead for the same email completes the held partial in place
// (by resume_token, or by email on the same campaign).
//
// Inert until SENT247_API_KEY (a seller key in the YPG tenant) and
// SENT247_VENDOR_CAMPAIGN_ID are both set.
//
// Only leads YPG may sell are ever sent (sent247CampaignFor): in Sent 24/7 a
// campaign with no buyers linked offers its leads to every active buyer in
// the tenant, so no campaign is a safe place to park a lead that was promised
// no agent.

export const SENT247_BASE_URL = "https://api.sent247.com";
const LEADS_URL = `${SENT247_BASE_URL}/api/v1/leads`;
const TIMEOUT_MS = 8_000;

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
  /** From a recovery link (?resume / ?c): completes the held partial in place. */
  resumeToken?: string;
  resumeClickId?: string;
}

export function buildSent247LeadBody(i: Sent247LeadInput) {
  return {
    campaign_id: i.campaignId,
    ...(i.resumeToken ? { resume_token: i.resumeToken } : {}),
    ...(i.resumeClickId ? { resume_click_id: i.resumeClickId } : {}),
    lead: {
      first_name: i.lead.firstName,
      // Required by the intake; "-" as Why Solar sends when there is none.
      last_name: i.lead.lastName?.trim() || "-",
      email: i.lead.email,
      phone: toE164AU(i.lead.phone),
      address: addressFromSuburbSlug(i.lead.suburb),
    },
    custom_fields: { ...guideCustomFields(i.lead), reference_id: i.referenceId },
    attribution: sent247Attribution(i.attribution, i.ctx),
    consent: {
      tcpa_consent: true,
      consent_timestamp: new Date().toISOString(),
      consent_ip: i.ctx.ip,
      consent_text: i.consentText,
    },
  };
}

export interface Sent247PartialInput {
  partialId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  answers: GuideLeadFields;
  campaignId: string;
  attribution: LeadAttribution | null;
  ctx: RequestContext;
}

export function buildSent247PartialBody(i: Sent247PartialInput) {
  return {
    campaign_id: i.campaignId,
    lead: {
      first_name: i.firstName || undefined,
      last_name: i.lastName || undefined,
      email: i.email,
      address: addressFromSuburbSlug(i.answers.suburb),
    },
    // ws_resume: Sent 24/7 adds it to the recovery link, so the funnel can
    // restore from our own row (/api/partial-lead/restore?id=).
    custom_fields: { ...guideCustomFields(i.answers), ws_resume: i.partialId },
    attribution: sent247Attribution(i.attribution, i.ctx),
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

/** POST a partial for Sent 24/7 to hold and recover. Never throws; false on any failure. */
export async function sendSent247Partial(apiKey: string, input: Sent247PartialInput): Promise<boolean> {
  try {
    const res = await fetch(`${LEADS_URL}/partial`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(buildSent247PartialBody(input)),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error("Sent 24/7 partial rejected:", res.status, (await res.text().catch(() => "")).slice(0, 300));
    }
    return res.ok;
  } catch (err) {
    console.error("Sent 24/7 partial failed:", err instanceof Error ? err.message : String(err));
    return false;
  }
}

export type Sent247PartialLookup =
  | { ok: true; email: string | null; firstName: string | null; lastName: string | null; wsResume: string | null }
  | { ok: false; completed: boolean };

/**
 * Resolve a recovery link's resume token to the partial Sent 24/7 holds. The
 * token is the credential (the endpoint takes no API key); 410 means the
 * partial was already completed.
 */
export async function fetchSent247PartialByToken(token: string): Promise<Sent247PartialLookup> {
  try {
    const res = await fetch(`${SENT247_BASE_URL}/partials/${encodeURIComponent(token)}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, completed: res.status === 410 };
    const j = (await res.json()) as {
      email?: string;
      first_name?: string;
      last_name?: string;
      custom_fields?: Record<string, unknown>;
    };
    const wsResume = j.custom_fields?.ws_resume;
    return {
      ok: true,
      email: j.email ?? null,
      firstName: j.first_name ?? null,
      lastName: j.last_name ?? null,
      wsResume: typeof wsResume === "string" ? wsResume : null,
    };
  } catch {
    return { ok: false, completed: false };
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
