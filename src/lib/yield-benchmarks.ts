// What /rental-yield-calculator says a good yield is: the "What is a good
// rental yield in 2026?" table and the People-also-ask answers, all from the
// gated data file src/lib/data/yield-benchmarks.ts (regenerated from
// production by scripts/seo/yield-benchmarks.ts under the yield ranking's
// gate) and from the same engine as the calculator widget. Pure; tested in
// tests/lib/rental-yield-calc.test.ts.
import type { FaqItem } from "@/components/guide/Faq";
import { YIELD_AREAS, YIELD_BENCHMARKS_AS_OF, YIELD_SOURCE_DATES, type YieldArea } from "@/lib/data/yield-benchmarks";
import { WORKED_EXAMPLE, computeRentalYield } from "@/lib/rental-yield-calc";

export const yieldArea = (key: string): YieldArea | undefined => YIELD_AREAS.find((a) => a.key === key);

/** "2.9%"; null when there is no figure, so a caller never prints 0. */
export const pct = (n: number | null | undefined): string | null => (typeof n === "number" && n > 0 ? `${n.toFixed(1)}%` : null);

/** "September 2025" from an ISO date; null when unknown. */
export function monthYear(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-AU", { month: "long", year: "numeric", timeZone: "UTC" });
}

/** "30 September 2026", the day the data file was generated. */
export const yieldAsAt = (): string => new Date(YIELD_BENCHMARKS_AS_OF).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** The feeds named in the method line under the table. */
export function yieldFeedDates(): { vicRent: string | null; qldRent: string | null; vicSales: string | null; absYear: string | null } {
  const abs = YIELD_SOURCE_DATES["sales-abs"];
  return {
    vicRent: monthYear(yieldArea("vic")?.rentPeriod ?? YIELD_SOURCE_DATES["rental-vic"]),
    qldRent: monthYear(yieldArea("qld")?.rentPeriod ?? YIELD_SOURCE_DATES["rental-qld"]),
    vicSales: monthYear(YIELD_SOURCE_DATES["sales-vic"]),
    // The ABS feed publishes a calendar-year median; the site prints the year (sales-provenance.ts).
    absYear: abs ? abs.slice(0, 4) : null,
  };
}

/**
 * Net yield at a given gross yield on the worked example's costs and
 * purchase price (rent solved from the gross figure), rounded to one
 * decimal. Null if the engine has no result.
 */
export function netYieldAtGross(grossPct: number): number | null {
  const weeklyRent = (WORKED_EXAMPLE.purchasePrice * (grossPct / 100)) / 52;
  const r = computeRentalYield({ ...WORKED_EXAMPLE, weeklyRent, loanAmount: 0 });
  return r ? Math.round(r.netYield * 10) / 10 : null;
}

/** The People-also-ask answers for "rental yield calculator" (SERP of 30 Sep 2026) with the table's figures. Empty if the data file lacks the areas they cite, so nothing prints without a figure. */
export function yieldFaqs(): FaqItem[] {
  const mel = yieldArea("melbourne"), bne = yieldArea("brisbane"), rvic = yieldArea("regional-vic"), rqld = yieldArea("regional-qld");
  const melH = pct(mel?.houseMedian), bneH = pct(bne?.houseMedian), rvicH = pct(rvic?.houseMedian), rqldH = pct(rqld?.houseMedian);
  const melU = pct(mel?.unitMedian), bneU = pct(bne?.unitMedian), melQ3 = pct(mel?.houseUpperQuartile), bneQ3 = pct(bne?.houseUpperQuartile);
  const net45 = pct(netYieldAtGross(4.5)), net35 = pct(netYieldAtGross(3.5));
  if (!melH || !bneH || !rvicH || !rqldH || !melU || !bneU || !melQ3 || !bneQ3 || !net45 || !net35) return [];
  const asAt = yieldAsAt();
  return [
    {
      question: "What is a good rental yield in Australia?",
      answer:
        `One above the median for the place and the property type, so start from the medians rather than a national rule of thumb. On the suburbs this site publishes with both a bond-data rent and a sales median (as at ${asAt}), the median gross house yield is ${melH} in Melbourne, ${rvicH} in regional Victoria, ${bneH} in Brisbane and ${rqldH} in regional Queensland; unit medians run higher, ${melU} in Melbourne and ${bneU} in Brisbane. A house yield above the upper quartile for its market (${melQ3} in Melbourne, ${bneQ3} in Brisbane) is high, and usually means a low price in a small market rather than a bargain. Whether a yield is good for you comes down to the net figure after costs and the rate on your loan, which the calculator above works out.`,
    },
    {
      question: "Is 4.5% rental yield good?",
      answer:
        `For a house in a capital city, yes. On the suburbs this site publishes (as at ${asAt}) the median gross house yield is ${melH} in Melbourne and ${bneH} in Brisbane, and three quarters of Melbourne suburbs sit below ${melQ3}. For a unit it is ordinary: the unit medians are ${melU} in Melbourne and ${bneU} in Brisbane. In regional Victoria (${rvicH}) and regional Queensland (${rqldH}) it is about the going rate. After council rates, insurance, management and maintenance, 4.5% gross is about ${net45} net on the worked example's costs, so check the net figure and your loan rate before calling it good.`,
    },
    {
      question: "Is 3.5% a good rental yield?",
      answer:
        `It is a middling house yield for a capital city and a low one anywhere else. On this site's figures (as at ${asAt}) 3.5% sits above the median gross house yield in Melbourne (${melH}) and just below Brisbane's (${bneH}), but below the regional medians (${rvicH} in regional Victoria, ${rqldH} in regional Queensland) and below every unit median in the table. On the worked example's costs, 3.5% gross is about ${net35} net, so the case for buying at that yield rests on capital growth, and once a loan is added the property is usually cash-flow negative.`,
    },
  ];
}
