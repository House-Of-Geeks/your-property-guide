// What a ranking page says about where its figures come from, and what it
// says when there is nothing to rank. Pure; tested in
// tests/lib/ranking-notes.test.ts.
//
// The rankings print only what each suburb's own page publishes (fix item
// 47, src/lib/published-medians.ts). That leaves some rankings short and
// some empty, and an empty ranking has a reason worth printing: "No suburbs
// found for this filter. Try a different state." was the whole explanation
// until 29 Sep 2026.
import type { MedianBasis } from "@/lib/published-medians";

export type RankingCategory =
  | "for-families"
  | "highest-growth"
  | "most-affordable"
  | "most-walkable"
  | "lowest-flood-risk"
  | "best-rental-yield";

const STATE_NAME: Record<string, string> = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  WA: "Western Australia",
  SA: "South Australia",
  TAS: "Tasmania",
  NT: "the Northern Territory",
  ACT: "the Australian Capital Territory",
};

/** The sales figures the suburb pages publish, state by state. */
export const SALES_BASIS_BY_STATE: Record<string, MedianBasis> = {
  NSW: "suburb", VIC: "suburb", SA: "suburb",
  QLD: "area", WA: "area", TAS: "area", NT: "area", ACT: "area",
};

/** States whose sales feed measures a 12-month change (published-medians.GROWTH_SOURCES). */
export const GROWTH_RANKED_STATES: readonly string[] = ["NSW", "SA"];

/**
 * States with a yield ranking: a published median and a rent measured for
 * the suburb itself. Not New South Wales, whose rents are published by
 * postcode: every suburb in a postcode carries the same rent, so the ranking
 * would be the postcode's cheapest suburbs. Not South Australia while its
 * sales medians are being checked. The rest have no bond-data feed here.
 */
export const YIELD_RANKED_STATES: readonly string[] = ["VIC", "QLD"];

/** A yield ranking leaves out suburbs smaller than this: a handful of bonds is not a rental market. */
export const YIELD_MIN_POPULATION = 1000;

// ── Walk score ──────────────────────────────────────────────────────────────
//
// The walk score is two points for each shop, cafe, restaurant, supermarket,
// pharmacy, bank, gym, library or hospital mapped in OpenStreetMap within
// 1 km of the suburb's postcode centroid, capped at 100
// (scripts/sync/sources/walkability.ts reads walkScoreFromAmenities). Any
// suburb with 50 or more such places scores 100, so on 10 Oct 2026 every
// suburb in the top ten of every city edition scored 100 and the "ranking"
// was the alphabet (review of 10 Oct 2026, suburbs-market 0.1a). A tie at
// the cap is listed alphabetically and unnumbered, and the walkable city
// editions answer noindex, until the lists rank on the uncapped count
// (which needs a column for it: a schema change and a sync run).

export const WALK_POINTS_PER_AMENITY = 2;
export const WALK_SCORE_CAP = 100;
/** The amenities at which the score reaches the cap. */
export const WALK_CAP_AMENITIES = WALK_SCORE_CAP / WALK_POINTS_PER_AMENITY;

/** The score the walkability sync writes for an amenity count. */
export function walkScoreFromAmenities(amenityCount: number): number {
  return Math.min(WALK_SCORE_CAP, Math.round(amenityCount * WALK_POINTS_PER_AMENITY));
}

/** Whether the walkable lists rank on a measure that does not cap. False until the uncapped amenity count is stored. */
export const WALK_RANKED_UNCAPPED = false;

/** A walk score tied at the cap: the score cannot order these suburbs, so they are listed alphabetically and unnumbered. */
export function isTiedAtWalkCap(score: number | null | undefined): boolean {
  return !WALK_RANKED_UNCAPPED && score != null && score >= WALK_SCORE_CAP;
}

/**
 * The rows as a list prints them: on the walkable list, the suburbs tied at
 * the capped walk score come first in alphabetical order and carry no rank;
 * the rest keep the ranking's order and are numbered after them. Every
 * other list is numbered as ranked.
 */
export function listedRows<T extends { name: string; walkScore: number | null }>(
  category: RankingCategory,
  rows: T[],
): { suburb: T; rank: number | null }[] {
  if (category !== "most-walkable") return rows.map((suburb, i) => ({ suburb, rank: i + 1 }));
  const tied = rows.filter((s) => isTiedAtWalkCap(s.walkScore)).sort((a, b) => a.name.localeCompare(b.name));
  const rest = rows.filter((s) => !isTiedAtWalkCap(s.walkScore));
  return [...tied.map((suburb) => ({ suburb, rank: null })), ...rest.map((suburb, i) => ({ suburb, rank: tied.length + i + 1 }))];
}

/** The sentence a walkable list prints above suburbs tied at the cap. */
export const WALK_TIE_NOTE = `These suburbs all score ${WALK_SCORE_CAP}; listed alphabetically. The walk score stops at ${WALK_SCORE_CAP}, reached at ${WALK_CAP_AMENITIES} shops and services within 1 km, so it cannot rank them.`;

/** What the walk score measures, in one sentence. */
export const WALK_SCORE_DEFINITION = `The walk score is ${WALK_POINTS_PER_AMENITY} points for each shop, cafe, restaurant, supermarket, pharmacy, bank, gym, library or hospital mapped in OpenStreetMap within 1 km of the suburb's postcode centroid, capped at ${WALK_SCORE_CAP}.`;

/**
 * Whether a flood hazard feed is loaded. The lowest-flood-risk ranking needs
 * a flood hazard class for each suburb (SuburbHazard.floodClass), and that
 * table is empty in production (tracker item 49(ii)): every row on the state
 * pages read "Flood risk: No data", and the list was in effect suburbs with
 * no record, which is not suburbs with no flood risk. Until a feed loads
 * the ranking is published nowhere: no table, noindex, out of the sitemaps,
 * and the page says why (review of 10 Oct 2026, suburbs-market 0.1c). Flip
 * this when a hazard feed has loaded and its coverage has been checked.
 */
export const FLOOD_HAZARD_FEED_LOADED = false;

/**
 * Whether there is a ranking to publish for the state (null: the national
 * page). Where there is not, the page says why, answers noindex and stays
 * out of the sitemap, the way the site treats every other page with nothing
 * on it; when the figures arrive the page and the sitemap follow without a
 * code change here beyond the lists and the flag above.
 */
export function isRanked(category: RankingCategory, state: string | null): boolean {
  if (category === "lowest-flood-risk") return FLOOD_HAZARD_FEED_LOADED;
  if (state === null) return true;
  if (category === "highest-growth") return GROWTH_RANKED_STATES.includes(state);
  if (category === "best-rental-yield") return YIELD_RANKED_STATES.includes(state);
  return true;
}

/**
 * The ranking a state's other pages (market report, city and region pages)
 * link to: its growth ranking where there is one, else its most affordable
 * suburbs, so no page links to a ranking with nothing in it.
 */
export function stateRankingLink(state: string): { href: string; label: string } {
  const code = state.toUpperCase();
  return isRanked("highest-growth", code)
    ? { href: `/best-suburbs/highest-growth/${code.toLowerCase()}`, label: `${code} growth ranking` }
    : { href: `/best-suburbs/most-affordable/${code.toLowerCase()}`, label: `${code} most affordable suburbs` };
}

const stateName = (state: string) => STATE_NAME[state] ?? state;

/** Where the medians on the page come from. */
export function priceSourceLine(state: string | null): string {
  switch (state) {
    case null:
      return "Prices are the medians each suburb's own page publishes: NSW Valuer General sales, Land Victoria and SA Government quarterly medians, and ABS statistical-area (SA2) medians in the other states and territories.";
    case "NSW":
      return "Prices are medians of house sales recorded by the NSW Valuer General. A suburb needs five recorded sales in the year before a median is published.";
    case "VIC":
      return "Prices are Land Victoria's quarterly suburb medians.";
    case "SA":
      return "Prices are the SA Government's quarterly suburb medians.";
    default:
      // The ABS feed gives an area's figure to the suburb that carries the
      // area's name, and to no other: suburbs do not share a figure. Until
      // 29 Sep 2026 this line said they did.
      return `Prices for ${stateName(state)} are ABS statistical-area (SA2) medians: each is the median for the area that carries the suburb's name. An SA2 can take in surrounding localities, so a figure can differ from sales in the suburb itself.`;
  }
}

const suburbsIn = (n: number, state: string | null) =>
  `${n.toLocaleString("en-AU")} ${n === 1 ? "suburb" : "suburbs"}${state ? ` in ${stateName(state)}` : ""}`;

export interface RankingNote {
  /** Printed above the table, or in its place when there is nothing to rank. Empty when there is nothing to add. */
  text: string;
  /** Nothing to rank: the page shows the note instead of a table. */
  empty: boolean;
}

/**
 * @param shown    rows on the page
 * @param eligible suburbs the ranking was drawn from, when the ranking is on a published figure
 */
export function rankingNote(
  category: RankingCategory,
  state: string | null,
  shown: number,
  eligible: number | null,
): RankingNote {
  const drawn = eligible != null && eligible > 0 ? suburbsIn(eligible, state) : null;

  if (category === "lowest-flood-risk" && !isRanked(category, state)) {
    return {
      empty: true,
      text: `No flood risk ranking${state ? ` for ${stateName(state)}` : ""} yet. Ranking suburbs on flood risk needs a flood hazard class for each suburb, and we do not hold one: a suburb with no flood record is not a suburb with no flood risk. Flood risk changes from street to street, so check the council's flood map or a flood report for the exact address.`,
    };
  }

  if (category === "highest-growth") {
    if (shown === 0) {
      const where = state ? stateName(state) : "Australia";
      const why = state && SALES_BASIS_BY_STATE[state] === "area"
        ? `The figures we publish for ${where} are ABS statistical-area medians, which come without a 12-month change`
        : state === "VIC"
          ? "Land Victoria's quarterly medians come without a 12-month change"
          : `We hold no 12-month change for ${where}`;
      return { empty: true, text: `No growth ranking for ${where} yet. ${why}, so there is nothing to rank. New South Wales and South Australia are ranked.` };
    }
    return {
      empty: false,
      text: `${drawn ? `Ranked from ${drawn} with a published 12-month change. ` : ""}The change is measured on the same sales as the median${state ? "" : ", in New South Wales and South Australia"}. A change beyond 25% in a year is left out as a small-sample artefact. ${priceSourceLine(state)}`,
    };
  }

  if (category === "most-affordable") {
    if (shown === 0) return { empty: true, text: `No suburb${state ? ` in ${stateName(state)}` : ""} has a published median to rank yet.` };
    return { empty: false, text: `${drawn ? `Ranked from ${drawn} with a published median. ` : ""}${priceSourceLine(state)}` };
  }

  if (category === "best-rental-yield") {
    if (state && !YIELD_RANKED_STATES.includes(state)) {
      const name = stateName(state);
      if (state === "NSW") {
        return { empty: true, text: "No yield ranking for New South Wales. Its rents are published by postcode, so a suburb ranking would set one suburb's price against its whole postcode's rent. Victoria and Queensland are ranked." };
      }
      if (state === "SA") {
        return { empty: true, text: "No yield ranking for South Australia yet: we are checking the sales medians behind it. Victoria and Queensland are ranked." };
      }
      return { empty: true, text: `No yield ranking for ${name}: we hold no rental bond data for it, so there is no rent to set against the price. Victoria and Queensland are ranked.` };
    }
    if (shown === 0) return { empty: true, text: `No suburb${state ? ` in ${stateName(state)}` : ""} has both a published median and a bond-data rent to rank yet.` };
    const scope = state ? "" : "Victoria and Queensland only: the two states where we hold a published median and a rent measured for the suburb itself. ";
    return {
      empty: false,
      text: `${scope}${drawn ? `Ranked from ${drawn} of ${YIELD_MIN_POPULATION.toLocaleString("en-AU")} or more residents. ` : ""}Rent is the suburb's latest median from bond lodgements; yields above 20% are left out. ${priceSourceLine(state)}`,
    };
  }

  // Ranked on something other than price: the price column is the only thing the rule touches.
  if (shown === 0) return { empty: true, text: `No suburbs to rank${state ? ` in ${stateName(state)}` : ""} yet.` };
  // The family ranking prints no price at all.
  if (category === "for-families") return { empty: false, text: "" };
  return { empty: false, text: `The price beside a suburb is the median its own page publishes; a dash means none is published. ${priceSourceLine(state)}` };
}
