import type { CityMarket } from "@/lib/services/city-market-service";
import type { CapitalCity } from "@/lib/utils/metro";
import { formatPriceFull } from "@/lib/utils/format";

/**
 * The prose on a city house-prices page, built from the rollup so every
 * sentence is backed by a figure on the same page. Describes what the
 * numbers show; never recommends. Sourced and dated in the last paragraph.
 * Returns paragraphs; an empty array when the city has no priced suburbs.
 */
export function buildCityNarrative(city: CapitalCity, market: CityMarket, now = new Date()): string[] {
  if (!market.medianHousePrice) return [];
  const c = city.name;
  const paras: string[] = [];
  const pct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;

  // 1. The headline figure and how it is built.
  paras.push(
    `The median house price across Greater ${c} is ${formatPriceFull(market.medianHousePrice)}. That figure is the median of ${market.pricedSuburbCount.toLocaleString()} suburb medians, each drawn from government sales records, rather than an average, so a handful of waterfront or acreage suburbs cannot drag it up.` +
      (market.medianUnitPrice ? ` The median unit price is ${formatPriceFull(market.medianUnitPrice)}.` : "") +
      (market.medianRentHouse ? ` The median house rent is $${market.medianRentHouse.toLocaleString()} a week.` : ""),
  );

  // 2. Twelve-month movement.
  if (market.medianAnnualGrowth != null) {
    const g = market.medianAnnualGrowth;
    const dir = g > 0 ? "rose" : g < 0 ? "fell" : "were flat";
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
  if (cheap && dear) {
    paras.push(
      `Among established suburbs, the most affordable is ${cheap.name} at ${formatPriceFull(cheap.medianHousePrice)} and the dearest is ${dear.name} at ${formatPriceFull(dear.medianHousePrice)}, a ${(dear.medianHousePrice / cheap.medianHousePrice).toFixed(1)}-times gap across the one city.` +
        (busy.length === 3 && busy[0].salesCountHouse > 0
          ? ` The suburbs with the most recorded house sales in the latest period are ${busy.map((s) => `${s.name} (${s.salesCountHouse.toLocaleString()})`).join(", ")}; the table below lists the twenty busiest with their medians.`
          : ` The table below lists ${c}'s twenty largest established suburbs with their medians.`),
    );
  }

  // 4. Source and date, always last.
  const asOf = market.salesAsOf
    ? market.salesAsOf.toLocaleDateString("en-AU", { month: "long", year: "numeric" })
    : null;
  paras.push(
    `Source: suburb medians from the ${city.state} valuer-general or state sales records and the ABS, aggregated by Your Property Guide` +
      (asOf ? `, sales data last refreshed ${asOf}` : "") +
      `; page generated ${now.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}. Only the ${market.pricedSuburbCount.toLocaleString()} of ${market.suburbCount.toLocaleString()} tracked suburbs with a verified sales source contribute to price figures.`,
  );
  return paras;
}
