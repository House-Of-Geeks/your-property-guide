// Human labels for the rental feeds, shared by the suburb snapshot band and
// the rental-market sub-page. NSW bond data is published by postcode, so
// its label carries the postcode when one is given.
export const RENTAL_SOURCE_LABELS: Record<string, string> = {
  "rental-nsw": "NSW rental bond data",
  "rental-vic": "Victorian rental report",
  "rental-sa": "SA rental bond data",
  "rental-qld": "Queensland RTA bond data",
  "rental-wa": "WA rental bond data",
  "abs-census": "2021 Census rent (proxy)",
  "abs-census-2021": "2021 Census rent (proxy)",
};

export function rentalSourceLabel(source: string | null | undefined, postcode?: string | null): string | null {
  const label = source ? RENTAL_SOURCE_LABELS[source] ?? null : null;
  if (!label) return null;
  return source === "rental-nsw" && postcode ? `${label} (postcode ${postcode})` : label;
}

export const monthYear = (d: Date) => d.toLocaleDateString("en-AU", { month: "long", year: "numeric", timeZone: "UTC" });

// ── All dwellings ───────────────────────────────────────────────────────────
//
// WA bond lodgements record no dwelling type, so the WA feed publishes one
// median across every dwelling (SuburbRentalStat.medianRentAll). It is shown
// as "All dwellings", never as a house or unit rent, and never feeds a gross
// yield: a yield divides a house rent by the house price, and an
// all-dwellings median against a house price is not like for like
// (Nedlands, June quarter 2026: $1,000 across all bonds, against REIWA's
// $1,300 for houses and $860 for units).

export const ALL_DWELLINGS_LABEL = "All dwellings";

/** Feeds whose data carries no dwelling type: every figure they publish is all dwellings. */
export const ALL_DWELLINGS_ONLY_SOURCES: readonly string[] = ["rental-wa"];

export interface RentRowFigures {
  source: string;
  medianRentHouse: number | null;
  medianRentUnit: number | null;
  /** Absent where the database has no medianRentAll column yet. */
  medianRentAll?: number | null;
}

const positive = (n: number | null | undefined): n is number => typeof n === "number" && n > 0;

/**
 * The row's rent is an all-dwellings median with no house or unit figure:
 * from a feed that records no dwelling type, or a row that carries only the
 * all-dwellings column. Such a row is the authority for the suburb's rent,
 * so the house and unit rents are unknown (0), never a fallback from the
 * Suburb row (a 2021 Census proxy there would print as a house rent).
 */
export function isAllDwellingsOnly(row: RentRowFigures | null | undefined): boolean {
  if (!row) return false;
  if (ALL_DWELLINGS_ONLY_SOURCES.includes(row.source)) return true;
  return positive(row.medianRentAll) && !positive(row.medianRentHouse) && !positive(row.medianRentUnit);
}

/** The all-dwellings median of a row, or null. */
export function allDwellingsRent(row: RentRowFigures | null | undefined): number | null {
  return row && positive(row.medianRentAll) ? row.medianRentAll : null;
}

/** "July to September 2026" for a quarter label; the label itself otherwise. */
export function quarterSpan(period: string): string {
  const m = /^(\d{4})-Q([1-4])$/.exec(period);
  if (!m) return period;
  const spans = ["January to March", "April to June", "July to September", "October to December"];
  return `${spans[parseInt(m[2], 10) - 1]} ${m[1]}`;
}

/** Bonds at or below this count are a small sample (the NSW Rental Bond Board's "s"). */
export const SMALL_SAMPLE_BONDS = 30;

export interface RentalAttribution {
  /** The credit line, as the licensor gives it. */
  credit: string;
  dataset: string;
  datasetUrl: string;
  licence: string;
  licenceUrl: string;
  /** How the figures on the page were made from the data (CC BY asks for changes to be indicated). */
  method: string;
}

/** Feeds whose licence asks for attribution on the page that shows their figures. */
export const RENTAL_ATTRIBUTIONS: Record<string, RentalAttribution> = {
  "rental-wa": {
    credit: "© Government of Western Australia (Department of Mines, Industry Regulation and Safety) 2023",
    dataset: "WA Rental Bonds Data 2023 - Current",
    datasetUrl: "https://housing-data-exchange.ahdap.org/dataset/west-australia-rental-bonds-data-2023-current",
    licence: "CC BY 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by/4.0/",
    method:
      "Medians worked out by Your Property Guide from the bonds lodged in each quarter for properties in the suburb: every dwelling type together, rents under $50 or over $5,000 a week left out. A quarter is not published with 10 or fewer bonds, or when half or more of its bonds share one rent.",
  },
};

export function rentalAttribution(source: string | null | undefined): RentalAttribution | null {
  return source ? RENTAL_ATTRIBUTIONS[source] ?? null : null;
}
