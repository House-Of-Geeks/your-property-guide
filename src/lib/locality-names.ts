// Names in the Suburb table that are not places people live. Pure; tested in
// tests/seo/non-localities.test.ts.
//
// The table was seeded from Australia Post's postcode list, which carries
// its own delivery names next to the real localities: delivery centres
// ("South Melbourne DC"), business and mail centres ("Nerang BC", "Cairns
// MC"), post offices in shopping centres ("Penrith Plaza", "Chadstone
// Centre") and large institutions with their own mail ("Parliament House",
// "HMAS Kuttabul", "Monash University"). Each got a suburb profile ("What
// it's like to live in Hervey Bay Dc"), a place in every suburb list and in
// the suburb picker on the lead forms. 290 rows on 29 Sep 2026.
//
// A postal suffix is never a locality. Institution and shopping-centre names
// are only treated as non-localities when the row has no census population:
// Brisbane Airport, Melbourne Airport, Noarlunga Centre and Airport West are
// gazetted suburbs with residents.
//
// A fourth kind was added on 29 Sep 2026 (fix item 48): "misfiled", a row
// under a state its postcode does not belong to ("Sydney, SA 2000"). It is
// decided by the postcode (src/lib/postcode-states.ts), not by the name.

import { normalisePostcode, stateMatchesPostcode } from "./postcode-states";

export type NonLocalityKind = "postal" | "institution" | "shopping-centre" | "misfiled";

/** The kinds the postcode page lists as delivery names. A misfiled row is not one. */
export const DELIVERY_KINDS: readonly NonLocalityKind[] = ["postal", "institution", "shopping-centre"];

const POSTAL_SUFFIX = /\b(dc|bc|mc|po|gpo|lpo|cpo|mdc|ldc)$/i;
const POSTAL_WORDS = /\b(private boxes|private bag|locked bag|delivery centre|mail centre|business centre|post office|po box(?:es)?|roadside delivery|postal depot)\b/i;
const INSTITUTION = /\b(university|tafe|airport|aerodrome|hospital|barracks|raaf|hmas|parliament house|immigration centre|naval base|air force base|army base)\b|\b(campus|college)$/i;
// Longer names first: "Shopping Fair" is stripped whole, not left as "Shopping".
// Mall, Square, Fair and Market were added on 29 Sep 2026, when "North Sydney
// Shoppingworld" turned up in the suburb search: 20 more post offices in
// shopping centres ("Pacific Fair", "Warringah Mall", "Macarthur Square").
const SHOPPING_SUFFIX = /\b(shopping centre|shopping fair|shopping square|shopping village|shoppingtown|shoppingworld|town centre|city centre|plaza|westfield|arcade|centre|mall|square|fair|market)$/i;

/** By name: a delivery name, an institution or a shopping-centre post office. */
export function nonLocalityKind(name: string, population: number): Exclude<NonLocalityKind, "misfiled"> | null {
  const n = name.trim();
  if (POSTAL_SUFFIX.test(n) || POSTAL_WORDS.test(n)) return "postal";
  if (population > 0) return null;
  if (INSTITUTION.test(n)) return "institution";
  if (SHOPPING_SUFFIX.test(n)) return "shopping-centre";
  return null;
}

export interface PlaceRow {
  slug: string;
  name: string;
  state: string;
  postcode: string;
}

/** Letters and digits only, lower case: "Wooloongabba" and "woolloongabba" differ by one. */
function nameKey(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

/** Levenshtein distance, stopping early once it passes `max`. */
export function editDistance(a: string, b: string, max = 2): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      best = Math.min(best, row[j]);
    }
    if (best > max) return max + 1;
    prev = row;
  }
  return prev[b.length];
}

/**
 * The real suburb a misfiled row stands beside, among `localities` (rows
 * filed under a state their postcode belongs to). Same postcode always, with
 * the leading zero restored ("872" is 0872). The same name first; failing
 * that a name one or two letters away, when exactly one suburb in the
 * postcode is that close ("Faddon" for Fadden, "Alice Spring" for Alice
 * Springs). Null when there is none: the row has nowhere to go.
 */
export function findTwin(row: PlaceRow, localities: readonly PlaceRow[]): PlaceRow | null {
  const postcode = normalisePostcode(row.postcode);
  if (!postcode) return null;
  const key = nameKey(row.name);
  if (key.length < 3) return null;
  const inPostcode = localities.filter(
    (l) => l.slug !== row.slug && l.postcode === postcode && stateMatchesPostcode(l),
  );
  const same = inPostcode.filter((l) => nameKey(l.name) === key);
  if (same.length > 0) return same.find((l) => l.state === row.state) ?? same[0];
  if (key.length < 5) return null;
  const close = inPostcode.filter((l) => editDistance(nameKey(l.name), key) <= 2);
  return close.length === 1 ? close[0] : null;
}

/**
 * The suburb a postal or shopping-centre name is built on: "South Melbourne
 * Dc" → "South Melbourne", "Penrith Plaza" → "Penrith", "Parramatta
 * Westfield" → "Parramatta". Null when nothing is left or nothing was
 * stripped (institutions have no base).
 */
export function baseLocalityName(name: string): string | null {
  const original = name.trim().replace(/\s+/g, " ");
  let n = original;
  for (let pass = 0; pass < 2; pass++) {
    n = n
      .replace(new RegExp(POSTAL_WORDS.source, "gi"), " ")
      .replace(POSTAL_SUFFIX, " ")
      .replace(SHOPPING_SUFFIX, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  if (!n || n.toLowerCase() === original.toLowerCase()) return null;
  return n;
}

const UPPER = new Set(["dc", "bc", "mc", "po", "gpo", "lpo", "cpo", "mdc", "ldc", "hmas", "raaf", "tafe"]);

/** The name as it should be printed: "Cairns Mc" → "Cairns MC", "The University Of Sydney" → "The University of Sydney". */
export function displayLocalityName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w, i) => {
      const lower = w.toLowerCase();
      if (UPPER.has(lower)) return w.toUpperCase();
      if (i > 0 && lower === "of") return "of";
      return w;
    })
    .join(" ");
}

const KIND_LABEL: Record<NonLocalityKind, string> = {
  postal: "Australia Post delivery name",
  institution: "institution with its own mail address",
  "shopping-centre": "post office in a shopping centre",
  misfiled: "row filed under the wrong state",
};

export function nonLocalityLabel(kind: NonLocalityKind): string {
  return KIND_LABEL[kind];
}
