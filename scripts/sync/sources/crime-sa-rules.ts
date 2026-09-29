// Where a South Australian police record says an incident happened. Pure;
// tested in tests/sync/crime-sa-rules.test.ts.
//
// The file carries "Suburb - Incident" and "Postcode - Incident" as recorded,
// and some records are not places in South Australia: an interstate address
// (Sydney 2000, Townsville 4810), "NOT DISCLOSED", a postcode that lost its
// leading zero in a spreadsheet (872 for the APY Lands' 0872). The feed
// stamped every row "SA" and the stub importer made a suburb for each, which
// is how "Sydney, SA 2000" came to have a profile (fix item 48).
import { normalisePostcode, stateMatchesPostcode } from "../../../src/lib/postcode-states";

export interface SaIncidentPlace {
  suburb: string;
  /** Four digits, or "" when the record has none (the suburb is then matched by name). */
  postcode: string;
}

/** Null when the record is not a place in South Australia: the row is skipped. */
export function saIncidentPlace(rawSuburb: string | null | undefined, rawPostcode: string | null | undefined): SaIncidentPlace | null {
  const suburb = String(rawSuburb ?? "").trim();
  if (!suburb || /^not disclosed$/i.test(suburb)) return null;
  const raw = String(rawPostcode ?? "").trim();
  if (!raw) return { suburb, postcode: "" };
  const postcode = normalisePostcode(raw);
  if (!postcode) return null;
  if (!stateMatchesPostcode({ state: "SA", postcode })) return null;
  return { suburb, postcode };
}
