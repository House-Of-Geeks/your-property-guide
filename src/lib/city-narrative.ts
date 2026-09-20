import type { CityMarket } from "@/lib/services/city-market-service";
import { formatPriceFull } from "@/lib/utils/format";

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
}

/**
 * The prose on a house-prices page, built from the rollup so every
 * sentence is backed by a figure on the same page. Describes what the
 * numbers show; never recommends. Sourced and dated in the last paragraph.
 * Returns paragraphs; an empty array when the place has no priced suburbs.
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
  const pct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;

  // 1. The headline figure and how it is built.
  paras.push(
    `The median house price across ${area} is ${formatPriceFull(market.medianHousePrice)}. That figure is the median of ${market.pricedSuburbCount.toLocaleString()} suburb medians, each drawn from government sales records, rather than an average, so a handful of waterfront or acreage suburbs cannot drag it up.` +
      (market.medianUnitPrice ? ` The median unit price is ${formatPriceFull(market.medianUnitPrice)}.` : "") +
      (market.medianRentHouse ? ` The median house rent is $${market.medianRentHouse.toLocaleString()} a week.` : ""),
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
        `. Suburbs with fewer than a handful of sales, where one transaction can swing the median, are left out of the growth figures.`,
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
        : `Among established suburbs, the most affordable is ${cheap.name} at ${formatPriceFull(cheap.medianHousePrice)} and the dearest is ${dear.name} at ${formatPriceFull(dear.medianHousePrice)}, a ${(dear.medianHousePrice / cheap.medianHousePrice).toFixed(1)}-times gap across the one ${unit}.`) +
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
    `Source: suburb medians from the ${place.state} valuer-general or state sales records and the ABS, aggregated by Your Property Guide` +
      (asOf ? `, sales data last refreshed ${asOf}` : "") +
      `; page generated ${now.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}. Only the ${market.pricedSuburbCount.toLocaleString()} of ${market.suburbCount.toLocaleString()} tracked suburbs with a verified sales source contribute to price figures.`,
  );
  return paras;
}
