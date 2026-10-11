import type { CityMarket, CityRent } from "@/lib/services/city-market-service";
import { formatPriceFull } from "@/lib/utils/format";
import { priceSourceLine } from "@/lib/ranking-notes";
import { quarterSpan, rentalSourceLabel } from "@/lib/rental-labels";
import { officialMedianSentence, type OfficialCityMedian } from "@/lib/data/official-city-medians";

/** The place a market narrative describes: a capital city or a region (LGA). */
export interface NarrativePlace {
  name: string;
  state: string;
}

export interface NarrativeOptions {
  /**
   * How the area is named in prose, e.g. "Greater Perth" (default for a
   * capital) or "the City of Greater Geelong" for a region.
   */
  area?: string;
  /** The noun for the whole area in "across the one city". */
  unit?: "city" | "region";
  /** The official city-wide median from a government source, where one is verified (src/lib/data/official-city-medians.ts). */
  official?: OfficialCityMedian | null;
}

const n = (v: number) => v.toLocaleString("en-AU");

/** "the typical suburb median (267 suburbs)": our figure, never "the median house price in {City}" (review of 10 Oct 2026, 0.3). */
export function typicalMedianLabel(market: Pick<CityMarket, "pricedSuburbCount">): string {
  return `typical suburb median (${n(market.pricedSuburbCount)} suburbs)`;
}

/** "WA rental bond data, all dwellings, July to September 2026". */
export function rentSourceText(rent: CityRent): string {
  const label = rentalSourceLabel(rent.source) ?? "rental bond data";
  return `${label}${rent.kind === "all" ? ", all dwellings" : ""}, ${quarterSpan(rent.period)}`;
}

/** The rent sentence: what it is, the feed, the quarter and the suburbs behind it. */
export function rentSentence(rent: CityRent): string {
  const what = rent.kind === "all" ? "weekly rent across all dwellings" : "weekly house rent";
  const why = rent.kind === "all" ? " The feed records no dwelling type, so there is no separate house figure." : "";
  return `The typical suburb ${what} is $${n(rent.weekly)}: the median of ${n(rent.suburbs)} suburbs' latest bond-data medians (${rentSourceText(rent)}).${why}`;
}

/**
 * The prose on a house-prices page, built from the rollup so every
 * sentence is backed by a figure on the same page. Describes what the
 * numbers show; never recommends. Sourced and dated in the last paragraph.
 * Returns paragraphs; an empty array when the place has no typical median
 * (none published, or too few suburbs behind one: the coverage floor).
 *
 * Used by the capital-city pages (defaults) and, with `area` and `unit`
 * set, by the region pages; the city wording is unchanged by the options.
 */
export function buildCityNarrative(
  place: NarrativePlace,
  market: CityMarket,
  now = new Date(),
  opts: NarrativeOptions = {},
): string[] {
  if (!market.medianHousePrice) return [];
  const c = place.name;
  const area = opts.area ?? `Greater ${c}`;
  const unit = opts.unit ?? "city";
  const paras: string[] = [];
  const pct = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;

  // 1. The headline figure, how it is built, and the official figure beside it.
  paras.push(
    (opts.official ? `${officialMedianSentence(opts.official)}, a median of every house sale. ` : "") +
      `The typical suburb median house price across ${area} is ${formatPriceFull(market.medianHousePrice)}: the median of ${n(market.pricedSuburbCount)} suburb medians, each the figure the suburb's own page publishes, rather than a median of sales or an average, so a handful of waterfront or acreage suburbs cannot drag it up.` +
      (market.medianUnitPrice ? ` The typical suburb unit median is ${formatPriceFull(market.medianUnitPrice)}.` : "") +
      (market.rent ? ` ${rentSentence(market.rent)}` : ""),
  );

  // 2. Twelve-month movement.
  if (market.medianAnnualGrowth != null) {
    const g = market.medianAnnualGrowth;
    const dir = g > 0 ? "rose" : g < 0 ? "fell" : "was flat";
    const top = market.topGrowth[0];
    paras.push(
      `Over the past twelve months the typical ${c} suburb ${dir}${g === 0 ? "" : ` by ${Math.abs(g).toFixed(1)}%`} in median house price. The spread between suburbs is wide` +
        (top && top.annualGrowthHouse != null
          ? `: ${top.name} recorded ${pct(top.annualGrowthHouse)}, the fastest of the established suburbs with plausible growth data`
          : "") +
        `. A change beyond 25% in a year, the mark of a handful of sales, is left out of the growth figures.`,
    );
  }

  // 3. The range: cheapest to dearest, and where the sales are.
  const cheap = market.mostAffordable[0];
  const dear = market.premium[0];
  const busy = market.busiest.slice(0, 3);
  const busiestCount = market.busiest.length === 20 ? "twenty" : String(market.busiest.length);
  if (cheap && dear) {
    paras.push(
      (cheap.slug === dear.slug
        ? `Among established suburbs, ${cheap.name} is the only one with a verified median, at ${formatPriceFull(cheap.medianHousePrice)}.`
        : `Among established suburbs, the most affordable is ${cheap.name} at ${formatPriceFull(cheap.medianHousePrice)} and the dearest is ${dear.name} at ${formatPriceFull(dear.medianHousePrice)}, a ${(dear.medianHousePrice / cheap.medianHousePrice).toFixed(1)}-times gap across the one ${unit}. CBD-core postcodes and apartment markets are left out of the cheapest, where a "house" median is not a house price.`) +
        (busy.length === 3 && busy[0].salesCountHouse > 0
          ? ` The suburbs with the most recorded house sales in the latest period are ${busy.map((s) => `${s.name} (${s.salesCountHouse.toLocaleString()})`).join(", ")}; the table below lists the ${busiestCount} busiest with their medians.`
          : unit === "city"
            ? ` The table below lists ${c}'s twenty largest established suburbs with their medians.`
            : ` The table below lists the established suburbs with their medians.`),
    );
  }

  // 4. Source and date, always last.
  const asOf = market.salesAsOf
    ? market.salesAsOf.toLocaleDateString("en-AU", { month: "long", year: "numeric" })
    : null;
  paras.push(
    `Source: ${priceSourceLine(place.state)}${market.rent ? ` Rents: ${rentSourceText(market.rent)}.` : ""}${opts.official ? ` City-wide figure: ${opts.official.source}, ${opts.official.period}.` : ""} Aggregated by Your Property Guide` +
      (asOf ? `, sales data last refreshed ${asOf}` : "") +
      `; page generated ${now.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}. Only the ${market.pricedSuburbCount.toLocaleString()} of ${market.suburbCount.toLocaleString()} tracked suburbs whose own page publishes a median contribute to price figures: a verified sales source, and at least five recorded sales where the count is reported.`,
  );
  return paras;
}

// ── The city page's opening, description and median FAQ ─────────────────────

const DESCRIPTION_MAX = 160;

/** What the rollup goes on to rank, for a description: only lists the page prints. */
function listsCovered(market: Pick<CityMarket, "topGrowth" | "mostAffordable">): string {
  return market.topGrowth.length > 0 ? "the fastest-rising and cheapest suburbs" : market.mostAffordable.length > 0 ? "the cheapest and dearest suburbs" : "the published suburb medians";
}

/**
 * The city page's meta description: the official figure where one is
 * verified, our typical suburb median where it clears the coverage floor,
 * and no figure otherwise. 160 characters or fewer.
 */
export function cityMarketDescription(city: { name: string }, market: CityMarket, official: OfficialCityMedian | null, year: number): string {
  const c = city.name;
  const candidates: string[] = [];
  if (market.medianHousePrice) {
    const typical = `typical suburb median ${formatPriceFull(market.medianHousePrice)} across ${n(market.pricedSuburbCount)} suburbs`;
    if (official) {
      candidates.push(`${c} house prices ${year}: ${official.area} median ${formatPriceFull(official.medianHousePrice)} (${official.source}, ${official.period.replace(/^the /, "")}); ${typical}.`);
    }
    candidates.push(`${c} house prices ${year}: ${typical}, plus house prices by suburb and ${listsCovered(market)}.`);
    candidates.push(`${c} house prices ${year}: ${typical}, plus house prices by suburb.`);
  }
  candidates.push(`${c} property market ${year}: house prices by suburb where a median is published, rankings and market data for Greater ${c}.`);
  candidates.push(`${c} property market ${year}: suburb medians where published, rankings and market data.`);
  return candidates.find((d) => d.length <= DESCRIPTION_MAX) ?? candidates[candidates.length - 1];
}

/** The direct answer under the H1, for "median house price {city}". */
export function cityMarketLede(city: { name: string }, market: CityMarket, official: OfficialCityMedian | null, shortfall: string): string {
  const c = city.name;
  const period = market.salesPeriod ? `, for ${market.salesPeriod}` : "";
  if (market.medianHousePrice && official) {
    return `${officialMedianSentence(official)}; the typical suburb median we publish across ${n(market.pricedSuburbCount)} Greater ${c} suburbs is ${formatPriceFull(market.medianHousePrice)}${period}.`;
  }
  if (market.medianHousePrice) {
    return `The typical suburb median house price across Greater ${c} is ${formatPriceFull(market.medianHousePrice)}: the median of ${n(market.pricedSuburbCount)} suburb medians${period}, not a median of every sale.`;
  }
  return `We do not publish a typical median for Greater ${c} yet. ${shortfall}${official ? ` ${officialMedianSentence(official)}.` : ""}`;
}

/** "What is the median house price in {City}?", answered with the figure we hold, or why we hold none. */
export function cityMedianFaq(place: NarrativePlace, market: CityMarket, official: OfficialCityMedian | null, shortfall: string, area = `Greater ${place.name}`): { question: string; answer: string } {
  const question = `What is the median house price in ${place.name}?`;
  const source = priceSourceLine(place.state);
  const off = official ? `${officialMedianSentence(official)}, a median of every house sale. ` : "";
  if (market.medianHousePrice) {
    return {
      question,
      answer: `${off}The typical suburb median we publish across ${area} is ${formatPriceFull(market.medianHousePrice)}, the median of ${n(market.pricedSuburbCount)} suburb medians${market.salesPeriod ? ` for ${market.salesPeriod}` : ""}.${market.medianUnitPrice ? ` The typical suburb unit median is ${formatPriceFull(market.medianUnitPrice)}.` : ""} ${source}`,
    };
  }
  return {
    question,
    answer: `${off}We do not publish a typical suburb median for ${area} yet. ${shortfall} Each suburb's own page prints its median where the source is verified, and the table on this page lists those.`,
  };
}

/** A rent stat card's label and detail, or null without a rent. */
export function rentCard(rent: CityRent | null): { label: string; value: string; sub: string } | null {
  if (!rent) return null;
  return {
    label: rent.kind === "all" ? "Typical rent, all dwellings" : "Typical house rent",
    value: `$${n(rent.weekly)}/wk`,
    sub: `${rentalSourceLabel(rent.source) ?? "Bond data"}, ${quarterSpan(rent.period)}, ${n(rent.suburbs)} suburbs`,
  };
}

/**
 * The city page's <title>, 60 characters or fewer. It leads with house
 * prices only where the page prints a typical median; otherwise it says
 * property market, as the region template does (review of 10 Oct 2026,
 * suburbs-market 0.7: /property-market/sydney promised a median and printed
 * "N/A"). It switches back by itself when the medians return.
 */
export function cityMarketTitle(city: { name: string }, market: Pick<CityMarket, "medianHousePrice">, year: number): string {
  return market.medianHousePrice
    ? `${city.name} House Prices ${year}: Medians by Suburb & Market Data`
    : `${city.name} Property Market ${year}: Suburbs & Market Data`;
}

/** The H1, without the year's styling: "{City} house prices" or "{City} property market". */
export function cityMarketHeading(city: { name: string }, market: Pick<CityMarket, "medianHousePrice">): string {
  return market.medianHousePrice ? `${city.name} house prices` : `${city.name} property market`;
}
