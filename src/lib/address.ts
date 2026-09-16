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
