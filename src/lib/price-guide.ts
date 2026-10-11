// The copy and filters of /price-guide (review of 10 Oct 2026,
// suburbs-market 3.6): "house prices by suburb", every median the suburb
// pages publish, with the sources named from what is listed, so the page
// never names a source that contributes nothing (NSW contributes none while
// its labels are repaired). Pure; tested in tests/lib/price-guide.test.ts.
import { CBD_CORE_RANGES, NAMED_APARTMENT_MARKETS } from "@/lib/median-coverage";

export const PRICE_GUIDE_YEAR = 2026;

/** The budget filter: "suburbs under $500,000" (PAA "Where in Australia can I buy a house for $500,000?"). */
export const PRICE_UNDER_OPTIONS: readonly number[] = [500_000, 600_000, 750_000, 1_000_000];

export function parsePriceUnder(v: unknown): number | undefined {
  const n = typeof v === "string" ? Number.parseInt(v, 10) : NaN;
  return PRICE_UNDER_OPTIONS.includes(n) ? n : undefined;
}

const SOURCE_BY_STATE: Record<string, string> = {
  NSW: "NSW Valuer General sales",
  VIC: "Land Victoria quarterly medians",
  SA: "SA Government quarterly medians",
};
const ABS_STATES = ["QLD", "WA", "TAS", "NT", "ACT"];

const join = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

/** The sources behind the listed medians, from the states that have any. */
export function priceGuideSources(states: readonly string[]): string {
  const named = ["NSW", "VIC", "SA"].filter((s) => states.includes(s)).map((s) => SOURCE_BY_STATE[s]);
  const abs = ABS_STATES.filter((s) => states.includes(s));
  if (abs.length > 0) named.push(`ABS statistical-area medians (${join(abs)})`);
  return join(named);
}

/** The first sentence: how many medians, and from where. */
export function priceGuideLede(total: number, states: readonly string[]): string {
  if (total === 0) return "Every median house price a suburb page of ours publishes, with its source and period. None is listed at the moment.";
  const missing = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"].filter((s) => !states.includes(s));
  return `Median house prices for ${total.toLocaleString("en-AU")} Australian suburbs, each the figure the suburb's own page publishes: ${priceGuideSources(states)}.${missing.length > 0 ? ` None is listed for ${join(missing)} at the moment: we withhold a median we cannot stand behind.` : ""}`;
}

/** Prisma `where` fragment: no CBD-core postcode and no named apartment market (the cheapest-house screens). */
export function notApartmentMarketsWhere() {
  const pad = (v: number) => String(v).padStart(4, "0");
  return {
    AND: [
      {
        NOT: {
          OR: Object.entries(CBD_CORE_RANGES).flatMap(([state, ranges]) =>
            ranges.map(([lo, hi]) => ({ state, postcode: { gte: pad(lo), lte: pad(hi) } })),
          ),
        },
      },
      { NOT: { OR: NAMED_APARTMENT_MARKETS.map((m) => ({ state: m.state, name: { equals: m.name, mode: "insensitive" as const } })) } },
    ],
  };
}

/** Section text: how to read a suburb median. */
export const HOW_TO_READ_A_MEDIAN: readonly string[] = [
  "A median is the middle sale: half the houses sold for less, half for more. It moves with the mix of what sold, so a quarter with more large homes lifts it without any house gaining value.",
  "Sample size matters. A median of five sales says less than one of five hundred; where a source reports the count, a suburb page withholds a median of fewer than five sales.",
  "House and unit medians are separate markets. In apartment precincts a \"house\" median can rest on a handful of sales, so the lowest-first sort leaves out CBD-core postcodes and the apartment markets our July 2026 report named.",
  "Periods differ by source: NSW Valuer General medians are for a calendar year, Land Victoria and the SA Government publish quarterly, and the ABS publishes a yearly median for each statistical area (SA2), which can take in surrounding localities.",
];
