import { type LeadEmailData, type LeadScore, scoreGuideLead, TIMEFRAME_LABELS, AGENT_STATUS_LABELS } from "@/lib/lead-emails";

// ActiveCampaign lead sync. Pushes qualified guide-download leads into the
// House of Geeks AC account so nurture automations can run against them.
//
// Design constraints:
// - The AC account is shared across several businesses: everything is
//   namespaced (list "YPG Property Sellers", fields "YPG ...", tags "ypg-*").
// - Best-effort: the caller wraps this in try/catch; a slow or down AC API
//   must never cost us the lead (DB row + email are the canonical record).
// - List subscription is gated on the marketing-consent checkbox (Spam Act
//   express consent). Non-consented leads still get a contact record with
//   tags and fields (CRM visibility for the appraisal pipeline) but are
//   never subscribed to the marketing list.
// - IDs are resolved by name at runtime and cached per warm instance, so
//   nothing breaks if AC assigns different IDs across environments.
//   Setup script: scripts/setup-activecampaign.ts

const LIST_NAME = "YPG Property Sellers";

const FIELD_TITLES = {
  suburb:           "YPG Suburb",
  suburbName:       "YPG Suburb Name",
  propertyType:     "YPG Property Type",
  bedrooms:         "YPG Bedrooms",
  sellingTimeframe: "YPG Selling Timeframe",
  agentStatus:      "YPG Agent Status",
  motivation:       "YPG Motivation",
  priceExpectation: "YPG Price Expectation",
  leadScore:        "YPG Lead Score",
  leadSource:       "YPG Lead Source",
} as const;

/**
 * "burpengary-qld-4505" -> "Burpengary QLD 4505". The slug field stays
 * as-is for building URLs in templates (%YPG_SUBURB%); this pretty
 * variant (%YPG_SUBURB_NAME%) is what email copy uses.
 */
export function prettySuburbName(slug: string): string {
  const m = slug.match(/^(.*)-([a-z]{2,3})-(\d{4})$/);
  if (!m) return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const name = m[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return `${name} ${m[2].toUpperCase()} ${m[3]}`;
}

const REQUEST_TIMEOUT_MS = 8_000;

function acEnv(): { base: string; key: string } | null {
  const base = process.env.ACTIVECAMPAIGN_API_URL;
  const key = process.env.ACTIVECAMPAIGN_API_KEY;
  if (!base || !key) return null;
  return { base: base.replace(/\/$/, ""), key };
}

async function acFetch(path: string, init?: RequestInit): Promise<Record<string, unknown>> {
  const env = acEnv();
  if (!env) throw new Error("ActiveCampaign env vars not set");
  const res = await fetch(`${env.base}/api/3${path}`, {
    ...init,
    headers: { "Api-Token": env.key, "Content-Type": "application/json" },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  // 422 = duplicate on create endpoints; callers treat it as "already exists".
  if (!res.ok && res.status !== 422) {
    throw new Error(`AC ${init?.method ?? "GET"} ${path} -> ${res.status}: ${JSON.stringify(body).slice(0, 200)}`);
  }
  return body;
}

// ----- Pure payload builders (unit-tested) ---------------------------------

/** Tags applied to every synced lead. Lowercase, namespaced, automation-friendly. */
export function buildAcTags(lead: LeadEmailData, score: LeadScore): string[] {
  const tags = ["ypg-seller", `ypg-score-${score.toLowerCase()}`];
  if (lead.sellingTimeframe) tags.push(`ypg-timeframe-${lead.sellingTimeframe}`);
  if (lead.agentStatus) tags.push(`ypg-agent-${lead.agentStatus}`);
  tags.push(lead.marketingConsent ? "ypg-consented" : "ypg-no-consent");
  return tags;
}

/** Human-readable custom-field values keyed by FIELD_TITLES key. */
export function buildAcFieldValues(lead: LeadEmailData, score: LeadScore): Record<keyof typeof FIELD_TITLES, string> {
  return {
    suburb:           lead.suburb ?? "",
    suburbName:       lead.suburb ? prettySuburbName(lead.suburb) : "",
    propertyType:     lead.propertyType ?? "",
    bedrooms:         lead.bedrooms ?? "",
    sellingTimeframe: lead.sellingTimeframe ? (TIMEFRAME_LABELS[lead.sellingTimeframe] ?? lead.sellingTimeframe) : "",
    agentStatus:      lead.agentStatus ? (AGENT_STATUS_LABELS[lead.agentStatus] ?? lead.agentStatus) : "",
    motivation:       lead.motivation ?? "",
    priceExpectation: lead.priceExpectation ?? "",
    leadScore:        score,
    leadSource:       lead.source ?? "",
  };
}

// ----- Runtime ID resolution (cached per warm instance) --------------------

let listIdPromise: Promise<string> | null = null;
let fieldIdsPromise: Promise<Map<string, string>> | null = null;
const tagIdCache = new Map<string, string>();

async function resolveListId(): Promise<string> {
  listIdPromise ??= (async () => {
    const body = await acFetch(`/lists?limit=100`);
    const lists = (body.lists ?? []) as { id: string; name: string }[];
    const match = lists.find((l) => l.name === LIST_NAME);
    if (!match) throw new Error(`AC list "${LIST_NAME}" not found. Run scripts/setup-activecampaign.ts`);
    return match.id;
  })();
  return listIdPromise.catch((e) => {
    listIdPromise = null; // don't cache failures
    throw e;
  });
}

async function resolveFieldIds(): Promise<Map<string, string>> {
  fieldIdsPromise ??= (async () => {
    const body = await acFetch(`/fields?limit=100`);
    const fields = (body.fields ?? []) as { id: string; title: string }[];
    return new Map(fields.map((f) => [f.title, f.id]));
  })();
  return fieldIdsPromise.catch((e) => {
    fieldIdsPromise = null;
    throw e;
  });
}

async function resolveTagId(tag: string): Promise<string> {
  const cached = tagIdCache.get(tag);
  if (cached) return cached;
  const found = await acFetch(`/tags?search=${encodeURIComponent(tag)}&limit=100`);
  const tags = (found.tags ?? []) as { id: string; tag: string }[];
  let id = tags.find((t) => t.tag === tag)?.id;
  if (!id) {
    const created = await acFetch(`/tags`, {
      method: "POST",
      body: JSON.stringify({ tag: { tag, tagType: "contact", description: "Created by YPG lead sync" } }),
    });
    id = (created.tag as { id?: string } | undefined)?.id;
  }
  if (!id) throw new Error(`Could not resolve AC tag "${tag}"`);
  tagIdCache.set(tag, id);
  return id;
}

// ----- The sync -------------------------------------------------------------

/**
 * Upsert the lead as an AC contact with fields + tags, and subscribe to the
 * seller list when marketing consent was given. Returns the AC contact id.
 * Throws on hard failure; the caller decides how loudly to log.
 */
export async function syncGuideLeadToActiveCampaign(lead: LeadEmailData): Promise<string> {
  if (!acEnv()) {
    // Dev environments without AC keys: skip quietly but visibly.
    console.warn("ActiveCampaign sync skipped: env vars not set");
    return "skipped";
  }

  const score = scoreGuideLead(lead);
  const fieldIds = await resolveFieldIds();
  const values = buildAcFieldValues(lead, score);

  const fieldValues = (Object.keys(values) as (keyof typeof FIELD_TITLES)[])
    .map((key) => ({ field: fieldIds.get(FIELD_TITLES[key]), value: values[key] }))
    .filter((fv): fv is { field: string; value: string } => !!fv.field && fv.value !== "");

  // 1. Upsert contact with custom fields.
  const synced = await acFetch(`/contact/sync`, {
    method: "POST",
    body: JSON.stringify({
      contact: {
        email: lead.email,
        firstName: lead.firstName,
        ...(lead.phone ? { phone: lead.phone } : {}),
        fieldValues,
      },
    }),
  });
  const contactId = (synced.contact as { id?: string } | undefined)?.id;
  if (!contactId) throw new Error("AC contact/sync returned no contact id");

  // 2. Tags (resolve sequentially to respect the cache, attach in parallel).
  const tagIds: string[] = [];
  for (const tag of buildAcTags(lead, score)) tagIds.push(await resolveTagId(tag));
  await Promise.all(
    tagIds.map((tag) =>
      acFetch(`/contactTags`, {
        method: "POST",
        body: JSON.stringify({ contactTag: { contact: contactId, tag } }),
      }),
    ),
  );

  // 3. List subscription, only with express consent (Spam Act).
  if (lead.marketingConsent) {
    const listId = await resolveListId();
    await acFetch(`/contactLists`, {
      method: "POST",
      body: JSON.stringify({ contactList: { list: listId, contact: contactId, status: 1 } }),
    });
  }

  return contactId;
}
