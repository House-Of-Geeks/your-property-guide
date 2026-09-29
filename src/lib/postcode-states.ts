// Which state a postcode belongs to. Pure, no imports: the site, the sync
// scripts and the list generator all read it. Tested in
// tests/seo/suburb-indexability.test.ts and tests/seo/non-localities.test.ts.
//
// Why it exists: the South Australian police data records an incident at an
// interstate address now and then, the crime feed stamped every row "SA", and
// the stub importer made a suburb for each: "Sydney, SA 2000", "East
// Melbourne, SA 3002", "Townsville, SA 4810". 25 of them on 29 Sep 2026, each
// beside the real suburb, plus a handful of misspellings and junk rows.

/** Where a row says a suburb is. */
export interface SuburbPlace {
  state: string;
  postcode: string;
}

// Australia Post's postcode ranges by state.
const POSTCODE_RANGES: readonly (readonly [number, number, string])[] = [
  [200, 299, "ACT"], [2600, 2618, "ACT"], [2900, 2920, "ACT"],
  [1000, 2599, "NSW"], [2619, 2899, "NSW"], [2921, 2999, "NSW"],
  [800, 999, "NT"],
  [4000, 4999, "QLD"], [9000, 9999, "QLD"],
  [5000, 5999, "SA"],
  [7000, 7999, "TAS"],
  [3000, 3999, "VIC"], [8000, 8999, "VIC"],
  [6000, 6999, "WA"],
];

// Postcodes that straddle a border, where the localities on the far side are
// real: the states with a census-counted locality in the postcode on
// 29 Sep 2026 (read-only production count), and the Jervis Bay Territory.
const CROSS_BORDER: Readonly<Record<string, readonly string[]>> = {
  "0872": ["NT", "SA", "WA"],
  "2540": ["NSW", "ACT"],
  "2611": ["ACT", "NSW"],
  "2618": ["ACT", "NSW"],
  "2620": ["NSW", "ACT"],
  "3500": ["VIC", "NSW"],
  "3586": ["VIC", "NSW"],
  "3644": ["VIC", "NSW"],
  "3691": ["VIC", "NSW"],
  "3707": ["VIC", "NSW"],
  "4375": ["QLD", "NSW"],
  "4377": ["QLD", "NSW"],
  "4380": ["QLD", "NSW"],
  "4383": ["QLD", "NSW"],
  "4385": ["QLD", "NSW"],
  "4825": ["QLD", "NT"],
};

const FOUR_DIGITS = /^\d{4}$/;

/** The states a four-digit postcode can belong to; none for anything else. */
export function statesForPostcode(postcode: string): string[] {
  if (!FOUR_DIGITS.test(postcode)) return [];
  const n = Number(postcode);
  const states = POSTCODE_RANGES.filter(([from, to]) => n >= from && n <= to).map(([, , state]) => state);
  for (const state of CROSS_BORDER[postcode] ?? []) if (!states.includes(state)) states.push(state);
  return states;
}

/** False for "Sydney, SA 2000", and for a postcode that is not four digits. */
export function stateMatchesPostcode({ state, postcode }: SuburbPlace): boolean {
  return statesForPostcode(postcode).includes(state);
}

/**
 * A postcode as four digits. Spreadsheets drop the leading zero of the
 * Northern Territory's ("872" for 0872); anything that is not three or four
 * digits ("NOT DISCLOSED", "") is not a postcode and comes back null.
 */
export function normalisePostcode(raw: string | null | undefined): string | null {
  const s = String(raw ?? "").trim();
  if (/^\d{4}$/.test(s)) return s;
  if (/^\d{3}$/.test(s)) return `0${s}`;
  return null;
}
