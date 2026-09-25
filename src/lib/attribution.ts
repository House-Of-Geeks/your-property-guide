// Lead attribution: how a visitor first found us, and the most recent paid
// click, carried from landing to lead in a first-party cookie.
//
// Pure and isomorphic. On every full page load the browser side
// (components/analytics/AttributionCapture) runs updateAttribution() as a
// cheap gate and, when something changed, asks /api/attr to set the cookie.
// The cookie is set by the server response, not document.cookie, because
// Safari/iOS tracking prevention caps script-set cookies at 7 days (24 hours
// after a Google or Facebook ad click). /api/leads reads it on the lead POST,
// so no lead form has to send anything.
//
// Why a cookie, not sessionStorage as on the sister site: Google Ads accepts
// offline conversions for a gclid up to 90 days after the click, and a
// seller often clicks an ad, leaves, and comes back weeks later to ask for
// an appraisal. The cookie lives 90 days from the last update.
//
// Touches kept:
//   first      the first time we ever saw this browser (landing page, external
//              referrer, any campaign params). Never overwritten.
//   last       the most recent landing that carried campaign params (a click
//              id or UTM), whatever the network.
//   google     the most recent landing with a Google click id (gclid, or the
//              iOS gbraid/wbraid). Kept apart from last so a later email or
//              Meta link can't throw the Google click away; it is what an
//              offline conversion upload needs.
//   microsoft  the most recent landing with a Microsoft Ads msclkid.

export const ATTRIBUTION_COOKIE = "ypg_attr";
export const ATTRIBUTION_MAX_AGE_DAYS = 90;

/** Click ids from the ad networks we may buy on. */
export const CLICK_ID_KEYS = ["gclid", "gbraid", "wbraid", "msclkid", "fbclid", "ttclid"] as const;
/** Campaign params copied verbatim from the landing URL. */
export const CAMPAIGN_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gad_source",
  "gad_campaignid",
] as const;

type ClickIdKey = (typeof CLICK_ID_KEYS)[number];
type CampaignKey = (typeof CAMPAIGN_KEYS)[number];

export type Touch = Partial<Record<ClickIdKey | CampaignKey, string>> & {
  /** Path and query of the landing page, same origin (no host). */
  landing_page?: string;
  /** External referrer URL, if the browser sent one. */
  referrer?: string;
  /** ISO timestamp of this touch. */
  at: string;
};

export interface AttributionState {
  first: Touch;
  last?: Touch;
  google?: Touch;
  microsoft?: Touch;
}

const MAX_VALUE = 300;
const GOOGLE_IDS = ["gclid", "gbraid", "wbraid"] as const;
/** Google click ids are URL-safe base64; anything else is not worth indexing. */
const GCLID_RE = /^[A-Za-z0-9_-]{1,300}$/;

// The cookie is client-controlled, so every value is cleaned here on both
// sides. Postgres jsonb rejects \u0000 and unpaired surrogates and TEXT
// rejects NUL, so a crafted link could otherwise make every lead that
// visitor sends fail on insert.
function clip(v: string, max = MAX_VALUE): string {
  let s = v
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g, (m) => (m.length === 2 ? m : ""));
  if (s.length > max) s = s.slice(0, max).replace(/[\ud800-\udbff]$/, "");
  return s;
}

function hasGoogle(t?: Partial<Touch>): boolean {
  return !!t && GOOGLE_IDS.some((k) => typeof t[k] === "string" && t[k]!.length > 0);
}

/** True if the touch carries a click id or any campaign param. */
export function isCampaignTouch(t: Partial<Touch>): boolean {
  return [...CLICK_ID_KEYS, ...CAMPAIGN_KEYS].some((k) => typeof t[k] === "string" && t[k]!.length > 0);
}

/**
 * Build a touch from a landing URL and document.referrer. Referrers from our
 * own host are dropped (internal navigation, not a source).
 */
export function touchFromLanding(href: string, referrer: string, nowIso: string): Touch {
  const url = new URL(href);
  const touch: Touch = { at: nowIso, landing_page: clip(url.pathname + url.search, 500) };
  for (const key of [...CLICK_ID_KEYS, ...CAMPAIGN_KEYS]) {
    const v = url.searchParams.get(key);
    if (v) {
      const c = clip(v.trim());
      if (c) touch[key] = c;
    }
  }
  if (referrer) {
    try {
      const ref = new URL(referrer);
      if (ref.host !== url.host) touch.referrer = clip(ref.origin + ref.pathname);
    } catch {
      // Not a URL; ignore.
    }
  }
  return touch;
}

/**
 * Apply one page load to the stored state. Returns the new state, or null
 * when nothing changed (so the caller can skip rewriting the cookie).
 */
export function updateAttribution(
  existing: AttributionState | null,
  href: string,
  referrer: string,
  nowIso: string,
): AttributionState | null {
  const touch = touchFromLanding(href, referrer, nowIso);
  const campaign = isCampaignTouch(touch);
  const google = hasGoogle(touch) ? touch : undefined;
  const microsoft = touch.msclkid ? touch : undefined;
  if (!existing) {
    return {
      first: touch,
      ...(campaign && { last: touch }),
      ...(google && { google }),
      ...(microsoft && { microsoft }),
    };
  }
  if (!campaign) return null;
  // A reload or restored tab of the same campaign landing is not a new
  // click: keep the original click time and don't extend the cookie.
  if (existing.last?.landing_page === touch.landing_page) return null;
  const nextGoogle = google ?? existing.google;
  const nextMicrosoft = microsoft ?? existing.microsoft;
  return {
    first: existing.first,
    last: touch,
    ...(nextGoogle && { google: nextGoogle }),
    ...(nextMicrosoft && { microsoft: nextMicrosoft }),
  };
}

const TOUCH_KEYS = new Set<string>([...CLICK_ID_KEYS, ...CAMPAIGN_KEYS, "landing_page", "referrer", "at"]);

function sanitizeTouch(raw: unknown): Touch | null {
  if (!raw || typeof raw !== "object") return null;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (TOUCH_KEYS.has(k) && typeof v === "string") {
      const c = clip(v, k === "landing_page" ? 500 : MAX_VALUE);
      if (c) out[k] = c;
    }
  }
  if (!out.at) return null;
  return out as Touch;
}

/** Parse the cookie value (already URI-decoded or not). Never throws. */
export function parseAttribution(raw: string | undefined | null): AttributionState | null {
  if (!raw) return null;
  try {
    let text = raw;
    if (text.startsWith("%7B")) text = decodeURIComponent(text);
    const parsed = JSON.parse(text) as Record<string, unknown>;
    const first = sanitizeTouch(parsed.first);
    if (!first) return null;
    const state: AttributionState = { first };
    for (const key of ["last", "google", "microsoft"] as const) {
      const t = sanitizeTouch(parsed[key]);
      if (t) state[key] = t;
    }
    return state;
  } catch {
    return null;
  }
}

/** Cookie value: URI-encoded JSON, kept well under the 4 KB cookie limit. */
export function serializeAttribution(state: AttributionState): string {
  let value = encodeURIComponent(JSON.stringify(state));
  if (value.length > 3500) {
    // Long landing URLs are the only thing that can blow the limit; the
    // click ids and UTMs are already copied out of them.
    const trim = (t?: Touch) => (t ? { ...t, landing_page: t.landing_page?.split("?")[0] } : t);
    value = encodeURIComponent(
      JSON.stringify({
        first: trim(state.first),
        last: trim(state.last),
        google: trim(state.google),
        microsoft: trim(state.microsoft),
      }),
    );
  }
  return value;
}

/**
 * The gclid to store against a lead: the latest Google click's gclid, only
 * if well formed. Null when the latest Google click was an iOS gbraid/wbraid
 * (the uploader reads those from attribution.google instead).
 */
export function leadGclid(state: AttributionState | null): string | null {
  const g = state?.google?.gclid;
  return g && GCLID_RE.test(g) ? g : null;
}

/** Label/value rows for the internal lead email, most useful first. */
export function attributionEmailRows(state: AttributionState | null, sourcePage?: string | null): Array<[string, string]> {
  const rows: Array<[string, string]> = [];
  if (sourcePage) rows.push(["Submitted on", sourcePage]);
  if (!state) return rows;
  const last = state.last;
  const google = state.google;
  if (google && google !== last && google.at !== last?.at) {
    rows.push(["Latest Google click", GOOGLE_IDS.map((k) => google[k] && `${k} ${google[k]}`).filter(Boolean).join(", ")]);
    rows.push(["Google click at", google.at]);
  }
  const describe = (t: Touch) =>
    [t.utm_source, t.utm_medium].filter(Boolean).join(" / ") ||
    (t.gclid || t.gbraid || t.wbraid ? "google / cpc" : t.msclkid ? "bing / cpc" : t.fbclid ? "meta / paid social" : "") ||
    (t.referrer ? `referral: ${t.referrer}` : "direct or organic");
  if (last) {
    rows.push(["Latest campaign", describe(last)]);
    if (last.utm_campaign) rows.push(["Campaign", last.utm_campaign]);
    if (last.utm_term) rows.push(["Keyword", last.utm_term]);
    for (const k of CLICK_ID_KEYS) if (last[k]) rows.push([k, last[k]!]);
    if (last.landing_page) rows.push(["Campaign landing page", last.landing_page]);
    rows.push(["Campaign click at", last.at]);
  }
  rows.push(["First visit", describe(state.first)]);
  if (state.first.landing_page) rows.push(["First landing page", state.first.landing_page]);
  if (state.first.referrer) rows.push(["First referrer", state.first.referrer]);
  rows.push(["First seen", state.first.at]);
  return rows;
}
