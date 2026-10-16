/**
 * Address handling for the appraisal forms' Google Places autocomplete.
 * Pure: parses Places API (New) address components into the fields the lead
 * needs, and derives the suburb slug the rest of the site uses.
 */
export interface PlaceAddressComponent {
  longText?: string;
  shortText?: string;
  types: string[];
}

export interface ParsedAddress {
  /** "2/15 Smith Street" or "15 Smith Street" */
  streetLine: string;
  suburb: string;
  /** State short code, e.g. "NSW" */
  state: string;
  postcode: string;
  /** Full single-line address as the lead stores it, e.g. "15 Smith Street, Bondi NSW 2026" */
  full: string;
}

function pick(components: PlaceAddressComponent[], type: string, short = false): string {
  const c = components.find((x) => x.types.includes(type));
  return (short ? c?.shortText : c?.longText)?.trim() ?? "";
}

export function parsePlaceAddress(components: PlaceAddressComponent[], formattedAddress = ""): ParsedAddress | null {
  const unit = pick(components, "subpremise");
  const number = pick(components, "street_number");
  const route = pick(components, "route");
  // Australian suburbs arrive as locality; a few regional places only carry
  // a postal town or neighbourhood, so fall back through those.
  const suburb = pick(components, "locality") || pick(components, "postal_town") || pick(components, "sublocality_level_1") || pick(components, "neighborhood");
  const state = pick(components, "administrative_area_level_1", true).toUpperCase();
  const postcode = pick(components, "postal_code");
  if (!suburb || !postcode) return null;
  const streetLine = [unit && number ? `${unit}/${number}` : unit || number, route].filter(Boolean).join(" ").trim();
  const full = streetLine
    ? `${streetLine}, ${suburb} ${state} ${postcode}`.replace(/\s+/g, " ").trim()
    : formattedAddress || `${suburb} ${state} ${postcode}`;
  return { streetLine, suburb, state, postcode, full };
}

/** "St Kilda", "VIC", "3182" → "st-kilda-vic-3182", the site's suburb slug form. */
export function guessSuburbSlug(suburb: string, state: string, postcode: string): string {
  const name = suburb
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${name}-${state.toLowerCase()}-${postcode}`;
}

export interface SuburbSearchHit {
  slug: string;
  name: string;
  state: string;
  postcode: string;
}

/**
 * Match a parsed address to one of our suburb rows: exact guessed slug first,
 * then a case-insensitive name match within the postcode. Null when the
 * suburb is not in our data (the form still submits the address text).
 */
export function matchSuburb(parsed: ParsedAddress, hits: SuburbSearchHit[]): SuburbSearchHit | null {
  const guess = guessSuburbSlug(parsed.suburb, parsed.state, parsed.postcode);
  const exact = hits.find((h) => h.slug === guess);
  if (exact) return exact;
  const byName = hits.find(
    (h) => h.postcode === parsed.postcode && h.name.toLowerCase() === parsed.suburb.toLowerCase(),
  );
  return byName ?? null;
}

// ── Typed text to a suburb (homepage campaign field, 15 Oct 2026) ─────────
// The homepage asks for "your address or suburb" with no Places lookup, so
// it stays fast and the street never leaves the browser: only the suburb
// name or the postcode is sent to /api/suggest.

const STATE_CODES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"] as const;
const STREET_TYPES =
  "street|st|road|rd|avenue|ave|drive|dr|court|ct|place|pl|crescent|cres|parade|pde|lane|ln|way|terrace|tce|boulevard|blvd|highway|hwy|close|cl|circuit|cct|esplanade|esp|grove|gr|square|sq";

export interface SuburbTerms {
  /** The suburb's name as typed ("Paddington"), or null. */
  name: string | null;
  /** A state code ("QLD"), or null. */
  state: string | null;
  /** A four-digit postcode, or null. */
  postcode: string | null;
}

/**
 * Pull the suburb, state and postcode out of whatever someone typed:
 * "Paddington", "4064", "Paddington QLD", "12 Smith St, Paddington QLD 4064"
 * or "12 Smith Street Paddington". The street part is dropped.
 */
export function suburbTerms(text: string): SuburbTerms {
  const parts = text
    .replace(/\s+/g, " ")
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p && !/^australia$/i.test(p));
  if (parts.length === 0) return { name: null, state: null, postcode: null };

  // The locality is the last part with a letter or a postcode in it.
  let loc = parts.length > 1 ? parts[parts.length - 1] : parts[0];
  if (parts.length > 1 && !/[a-z]/i.test(loc) && !/\b\d{4}\b/.test(loc)) loc = parts[parts.length - 2];

  const postcode = loc.match(/\b(\d{4})\s*$/)?.[1] ?? null;
  if (postcode) loc = loc.replace(/\b\d{4}\s*$/, "").trim();
  const stateMatch = loc.match(new RegExp(`\\b(${STATE_CODES.join("|")})\\s*$`, "i"));
  const state = stateMatch ? stateMatch[1].toUpperCase() : null;
  if (stateMatch) loc = loc.slice(0, stateMatch.index).trim();

  // No comma: "12 Smith Street Paddington" keeps what follows the street type.
  if (/^\d/.test(loc)) {
    const afterStreet = loc.match(new RegExp(`^.*?\\b(?:${STREET_TYPES})\\b\\.?\\s+(.*)$`, "i"));
    loc = afterStreet ? afterStreet[1] : "";
  }
  const name = loc.replace(/^\d+[a-z]?\s*/i, "").trim();
  return { name: name.length >= 2 ? name : null, state, postcode };
}

/** What to send to /api/suggest for the typed text: the suburb name, else the postcode. */
export function suburbQuery(t: SuburbTerms): string | null {
  return t.name ?? t.postcode;
}

/**
 * The one suburb the typed text means, or null when it's ambiguous: an exact
 * name match (narrowed by state and postcode when given), else the only hit
 * for a postcode on its own.
 */
export function pickSuburb(t: SuburbTerms, hits: SuburbSearchHit[]): SuburbSearchHit | null {
  const fits = hits.filter((h) => (!t.state || h.state === t.state) && (!t.postcode || h.postcode === t.postcode));
  if (t.name) {
    const exact = fits.filter((h) => h.name.toLowerCase() === t.name!.toLowerCase());
    return exact.length === 1 ? exact[0] : null;
  }
  return fits.length === 1 ? fits[0] : null;
}
