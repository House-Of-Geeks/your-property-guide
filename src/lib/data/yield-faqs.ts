// One-line answers to the People-also-ask questions Google shows for
// "rental yield calculator" and "what is a good rental yield australia"
// (8 Sep 2026), with figures from the yield benchmarks (fix item 15).
import type { FaqItem } from "@/components/guide/Faq";
import { CITY_YIELDS } from "./yield-benchmarks";

const city = (slug: string) => CITY_YIELDS.find((c) => c.slug === slug);
const pct = (n: number | null | undefined) => (typeof n === "number" ? `${n}%` : null);

export function yieldFaqs(): FaqItem[] {
  const syd = city("sydney"), mel = city("melbourne"), bne = city("brisbane");
  const houses = [syd, mel, bne].filter((c) => c && c.houseYield !== null).map((c) => `${c!.name} ${pct(c!.houseYield)}`).join(", ");
  const units = [mel, bne].filter((c) => c && c.unitYield !== null).map((c) => `${c!.name} ${pct(c!.unitYield)}`).join(", ");
  return [
    {
      question: "What is a good rental yield in Australia?",
      answer: `One above the median for the city and property type. On this site's gated data the median gross house yield is ${houses}, and for units ${units}; regional centres run higher because prices are lower. Anything above the relevant median is good for that market, but a yield well above it usually reflects a small, low-priced market rather than a bargain.`,
    },
    {
      question: "Is 4.5% rental yield good?",
      answer: `Yes for a capital-city house: it is above the medians of ${houses}, and close to the unit medians of ${units}. In a regional town it is ordinary. Net of costs it is roughly 3% to 3.5%, so whether it works also depends on your loan rate.`,
    },
    {
      question: "Is 3% rental yield bad?",
      answer: `Not for a Sydney or Melbourne house, where ${syd?.houseYield !== null ? `${pct(syd?.houseYield)} and ${pct(mel?.houseYield)}` : "the medians"} are the medians. It means the investment case rests on capital growth rather than income, and after costs and interest the property is usually cash-flow negative, which the calculator below shows in dollars.`,
    },
    {
      question: "What does a 7% rental yield mean?",
      answer: `That the annual rent is 7% of the price: $35,000 a year, or about $673 a week, on a $500,000 property. Yields that high sit in regional and mining towns in the state tables above, not in capital cities, and they come with thinner resale markets and more vacancy risk.`,
    },
  ];
}
