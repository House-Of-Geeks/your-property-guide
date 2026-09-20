import type { CityMarket } from "@/lib/services/city-market-service";
import { formatPriceFull } from "@/lib/utils/format";

// Pure helpers for the region (LGA) house-prices template. Content gap
// item 6: the region pages already held the suburb data; this reframes
// them the way the capital-city pages were reframed (house prices first,
// busiest suburbs, sourced narrative, appraisal block). Everything here is
// testable without the DB; the page passes in the rollup.

export const REGION_MARKET_YEAR = 2026;

/**
 * LGA names that searchers drop the "Greater" from. "Geelong house
 * prices" is the query; "Greater Geelong" is the council. Kept to a
 * whitelist because "Greater Hume" (NSW) stripped to "Hume" would collide
 * with Melbourne's Hume.
 */
const STRIP_GREATER = new Set([
  "Greater Geelong",
  "Greater Bendigo",
  "Greater Shepparton",
  "Greater Geraldton",
  "Greater Dandenong",
]);

/** The name used in headings and titles. */
export function regionDisplayName(region: string): string {
  return STRIP_GREATER.has(region) ? region.replace(/^Greater /, "") : region;
}

/** True when the rollup found at least one suburb with a verified median. */
export function regionHasPrices(market: Pick<CityMarket, "medianHousePrice">): boolean {
  return market.medianHousePrice != null && market.medianHousePrice > 0;
}

/**
 * Title: leads with house prices where the region has verified prices
 * (the query cluster is "{place} house prices" / "median house price
 * {place}" / "{place} property market"), and never claims prices it
 * cannot show. No dollar figure in a title, as on the suburb pages.
 */
export function regionTitle(name: string, hasPrices: boolean, year = REGION_MARKET_YEAR): string {
  return hasPrices
    ? `${name} House Prices & Property Market ${year}: Median, Growth, Suburbs`
    : `${name} Property Market ${year}: Suburbs, Prices & Schools`;
}

export function regionDescription(
  name: string,
  state: string,
  market: CityMarket,
  suburbCount: number,
  year = REGION_MARKET_YEAR,
): string {
  if (regionHasPrices(market) && market.medianHousePrice) {
    return `${name} house prices ${year}: the median house price in ${name} is ${formatPriceFull(market.medianHousePrice)}. Median house price by suburb for the busiest suburbs, twelve-month growth, the fastest-rising and most affordable suburbs in the ${name} region, ${state}, from verified sales data.`;
  }
  return `${name} property market ${year}: suburb profiles, prices where verified sales data exists, schools and listings across the ${suburbCount} suburbs of the ${name} region, ${state}.`;
}

/** Plain-sentence answers mirrored into FAQPage JSON-LD. Empty when there is nothing gated to say. */
export function buildRegionFaqs(name: string, state: string, market: CityMarket): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];
  if (market.medianHousePrice) {
    faqs.push({
      question: `What is the median house price in ${name}?`,
      answer: `The median house price across the ${name} region of ${state} is ${formatPriceFull(market.medianHousePrice)}, calculated as the median of ${market.pricedSuburbCount.toLocaleString()} suburb-level medians from verified government sales data.${
        market.medianUnitPrice ? ` The median unit price is ${formatPriceFull(market.medianUnitPrice)}.` : ""
      }`,
    });
  }
  if (market.medianAnnualGrowth != null) {
    faqs.push({
      question: `Are ${name} house prices rising?`,
      answer: `The typical ${name} suburb recorded ${
        market.medianAnnualGrowth >= 0 ? "growth" : "a decline"
      } of ${market.medianAnnualGrowth}% in house prices over the past 12 months. Growth varies by suburb; the fastest-rising suburbs are listed on this page.`,
    });
  }
  if (market.topGrowth.length > 0) {
    const names = market.topGrowth.slice(0, 3).map((s) => s.name).join(", ");
    faqs.push({
      question: `Which ${name} suburbs are growing fastest?`,
      answer: `By 12-month house price growth, the fastest-rising suburbs in the ${name} region in our verified data are ${names}. See the table on this page.`,
    });
  }
  if (market.mostAffordable.length > 0) {
    const names = market.mostAffordable.slice(0, 3).map((s) => s.name).join(", ");
    faqs.push({
      question: `What are the cheapest suburbs in ${name}?`,
      answer: `Among established suburbs (population 1,000+) with verified sales data, the most affordable suburbs in the ${name} region by median house price are ${names}.`,
    });
  }
  return faqs;
}

/**
 * The eyebrow line above the H1: the council's full name when the display
 * name differs from it, the state, and the suburb count.
 */
export function regionEyebrow(region: string, state: string, suburbCount: number): string {
  const name = regionDisplayName(region);
  const council = name === region ? region : `${region} (${name})`;
  return `${council} · ${state} · ${suburbCount.toLocaleString()} suburbs tracked`;
}
