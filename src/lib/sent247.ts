import {
  scoreGuideLead,
  TIMEFRAME_LABELS,
  AGENT_STATUS_LABELS,
  GUIDE_PDF_URL,
  BUYING_GUIDE_PDF_URL,
  type LeadEmailData,
} from "@/lib/lead-emails";
import type { LeadAttribution } from "@/lib/attribution-server";
import { normalizePhone } from "@/lib/utils/phone";

// Sent 24/7 (sent247.com), the way Why Solar uses it (House-Of-Geeks/Why-Solar:
// lib/sent247.ts for leads, lib/battery-guide/sent247.ts for its ebook).
//
// Guide downloads are lead magnets: POST /api/v1/lead-magnets with the guide's
// slug and PDF link. Sent 24/7 keeps them apart from leads (never validated,
// sold or distributed) and sends every email to the reader: the guide itself
// and the follow-ups, from a "lead magnet" sequence on the campaign. Switched
// on only when LEAD_MAGNET_TO_SENT247 is exactly "true"; until then YPG sends
// its own guide email.
//
// A call request from a seller YPG may sell is a lead: POST /api/v1/leads to
// the vendor campaign, which hands it to one agent. Any lead with an email and
// a phone also stops that address's guide series in Sent 24/7.
//
// Both need SENT247_API_KEY (a seller key in the YPG tenant) and
// SENT247_VENDOR_CAMPAIGN_ID. Only leads YPG may sell are ever posted as
// leads (sent247HoldReason): in Sent 24/7 a campaign with no buyers linked
// offers its leads to every active buyer in the tenant.

export const SENT247_BASE_URL = "https://api.sent247.com";
const LEADS_URL = `${SENT247_BASE_URL}/api/v1/leads`;
const LEAD_MAGNETS_URL = `${SENT247_BASE_URL}/api/v1/lead-magnets`;
const TIMEOUT_MS = 8_000;
const MAGNET_TIMEOUT_MS = 5_000;

/** The two guides as Sent 24/7 lead magnets. Never change a slug once live: it picks the email series. */
export const LEAD_MAGNETS = {
  selling: {
    slug: "selling-guide",
    name: "The Complete Guide to Selling Your Property in Australia",
    downloadUrl: GUIDE_PDF_URL,
  },
  buying: {
    slug: "buying-guide",
    name: "The Complete Guide to Buying Property in Australia",
    downloadUrl: BUYING_GUIDE_PDF_URL,
  },
} as const;

/** Exactly "true", as on Why Solar, so a half-made config change can't switch delivery on. */
export function leadMagnetDeliveryEnabled(): boolean {
  return process.env.LEAD_MAGNET_TO_SENT247 === "true" && sent247Config() !== null;
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

export interface Sent247LeadMagnetInput {
  lead: LeadEmailData;
  campaignId: string;
  /** Our Lead.id for the download, as a custom field. */
  referenceId: string;
  consentText: string;
  attribution: LeadAttribution | null;
  ctx: RequestContext;
}

export function buildSent247LeadMagnetBody(i: Sent247LeadMagnetInput) {
  const magnet = i.lead.guideType === "buying" ? LEAD_MAGNETS.buying : LEAD_MAGNETS.selling;
  const address = addressFromSuburbSlug(i.lead.suburb);
  return {
    campaign_id: i.campaignId,
    magnet: { slug: magnet.slug, name: magnet.name, download_url: magnet.downloadUrl },
    lead: {
      email: i.lead.email,
      first_name: i.lead.firstName,
      last_name: i.lead.lastName || undefined,
      postcode: address?.zip,
      state: address?.state,
    },
    // email_consent: the email step's statement covers the guide and tips
    // emails. Without it Sent 24/7 records the download and emails nothing.
    consent: {
      email_consent: true,
      consent_text: i.consentText,
      consent_timestamp: new Date().toISOString(),
      consent_ip: i.ctx.ip,
    },
    attribution: sent247Attribution(i.attribution, i.ctx),
    custom_fields: { ...guideCustomFields(i.lead), reference_id: i.referenceId },
  };
}

export type Sent247LeadMagnetOutcome =
  | { kind: "sent"; signupId: string | null; status: string | null; emails: string | null; emailsReason: string | null }
  | { kind: "rejected"; reason: string }
  | { kind: "failed"; reason: string; retryable: true };

async function postLeadMagnet(apiKey: string, body: unknown, timeoutMs: number): Promise<Sent247LeadMagnetOutcome> {
  try {
    const res = await fetch(LEAD_MAGNETS_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });
    const json = (await res.json().catch(() => null)) as {
      signup_id?: string;
      status?: string;
      emails?: string;
      emails_reason?: string;
      error?: { code?: string; message?: string };
    } | null;
    if (res.status === 429 || res.status >= 500) {
      return { kind: "failed", reason: `HTTP ${res.status}`, retryable: true };
    }
    if (!res.ok) {
      return { kind: "rejected", reason: `HTTP ${res.status}${json?.error?.code ? ` ${json.error.code}` : ""}` };
    }
    return {
      kind: "sent",
      signupId: json?.signup_id ?? null,
      status: json?.status ?? null,
      emails: json?.emails ?? null,
      emailsReason: json?.emails_reason ?? null,
    };
  } catch (err) {
    return { kind: "failed", reason: err instanceof Error ? err.message : String(err), retryable: true };
  }
}

/**
 * Record a guide download in Sent 24/7, which then emails the guide. Never
 * throws. A network error, 429 or 5xx is retried in the background (3 s,
 * then 10 s later) through `defer` (after() in the route), as Why Solar does;
 * the reader already has the download on the thanks page.
 */
export async function sendSent247LeadMagnet(
  apiKey: string,
  input: Sent247LeadMagnetInput,
  defer: (task: () => Promise<unknown>) => void,
): Promise<Sent247LeadMagnetOutcome> {
  const body = buildSent247LeadMagnetBody(input);
  const first = await postLeadMagnet(apiKey, body, MAGNET_TIMEOUT_MS);
  if (first.kind === "failed") {
    defer(async () => {
      for (const waitMs of [3_000, 10_000]) {
        await new Promise((r) => setTimeout(r, waitMs));
        const retry = await postLeadMagnet(apiKey, body, TIMEOUT_MS);
        if (retry.kind !== "failed") {
          if (retry.kind === "rejected") console.error("Sent 24/7 lead magnet rejected on retry:", retry.reason);
          return;
        }
      }
      console.error("Sent 24/7 lead magnet failed after retries (download saved to DB):", input.referenceId);
    });
  } else if (first.kind === "rejected") {
    console.error("Sent 24/7 lead magnet rejected:", first.reason, input.referenceId);
  }
  return first;
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
