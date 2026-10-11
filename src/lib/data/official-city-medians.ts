// Official city-wide median house prices, each from a government primary
// source with its period, printed beside our typical suburb median on
// /property-market/{city} (review of 10 Oct 2026, suburbs-market 0.3 and
// 3.5). Our figure is a median of suburb medians; these count every house
// sale, so the two differ and the page says which is which.
//
// Add a city only after reading the figure on the primary source. Checked
// 11 Oct 2026:
// - Adelaide: SA Valuer-General, "Median house sales by quarter". The page
//   sits behind a bot check that blocks a direct read; the figure was read
//   from the search index's copy of that page, twice. The suburb file behind
//   it (data.sa.gov.au, Metropolitan Median House Sales Q2 2026, uploaded
//   17 Jul 2026) carries no metropolitan total.
// - Melbourne: Land Victoria's VPSR metropolitan median. The latest file on
//   data.vic.gov.au is the March 2026 quarter, and land.vic.gov.au refused
//   the download: not verified, not printed.
// - Sydney: the NSW DCJ Rent and Sales Report's Greater Sydney median: not
//   found on a primary page in this check, not printed.
// - Brisbane, Perth, Hobart, Canberra, Darwin: the city-wide medians are
//   published by the real estate institutes (REIQ, REIWA, REIT, REIACT,
//   REINT), not by a government agency: not printed.
import { formatPriceFull } from "@/lib/utils/format";

export interface OfficialCityMedian {
  /** "Metropolitan Adelaide": the area the figure covers, as the source names it. */
  area: string;
  /** Median house sale price, dollars. */
  medianHousePrice: number;
  /** "the June 2026 quarter". */
  period: string;
  /** "SA Valuer-General". */
  source: string;
  /** The page the figure is published on. */
  url: string;
  /** When we read it (ISO date). */
  readOn: string;
}

/** Keyed by the capital city slug (src/lib/utils/metro.ts). */
export const OFFICIAL_CITY_MEDIANS: Record<string, OfficialCityMedian> = {
  adelaide: {
    area: "Metropolitan Adelaide",
    medianHousePrice: 975_000,
    period: "the June 2026 quarter",
    source: "SA Valuer-General",
    url: "https://valuergeneral.sa.gov.au/News-and-Publications/publisheddataandstatistics",
    readOn: "2026-10-11",
  },
};

export function officialCityMedian(citySlug: string): OfficialCityMedian | null {
  return OFFICIAL_CITY_MEDIANS[citySlug] ?? null;
}

/** "Metropolitan Adelaide's median house sale price was $975,000 in the June 2026 quarter (SA Valuer-General)" (no full stop). */
export function officialMedianSentence(o: OfficialCityMedian): string {
  return `${o.area}'s median house sale price was ${formatPriceFull(o.medianHousePrice)} in ${o.period} (${o.source})`;
}
