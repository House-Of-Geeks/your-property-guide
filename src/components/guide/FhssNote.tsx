import Link from "next/link";
import {
  CURRENT_SIC,
  FHSS_ANNUAL_LIMIT,
  FHSS_CONCESSIONAL_RELEASE_PCT,
  FHSS_TOTAL_LIMIT,
} from "@/lib/data/fhss";

const fmt = (n: number) => `$${n.toLocaleString("en-AU")}`;

/**
 * The First Home Super Saver summary the first home buyer guides print, from
 * src/lib/data/fhss.ts, so the limits and the deemed earnings rate on every
 * guide change in one place.
 */
export function FhssNote({ as = "li" }: { as?: "li" | "p" }) {
  const Tag = as;
  return (
    <Tag>
      <strong>First Home Super Saver scheme (FHSS):</strong> save part of your deposit in super with voluntary
      contributions, up to {fmt(FHSS_ANNUAL_LIMIT)} a year and {fmt(FHSS_TOTAL_LIMIT)} in total per person, then
      withdraw {FHSS_CONCESSIONAL_RELEASE_PCT}% of before-tax contributions and all after-tax ones, plus deemed
      earnings ({CURRENT_SIC.rate}% a year for {CURRENT_SIC.quarter}). Salary sacrifice is taxed at 15% going in, and
      the release at your marginal rate less a 30% offset. There&rsquo;s no price cap, and it combines with the other
      schemes. See the <Link href="/guides/first-home-super-saver-scheme">FHSS guide</Link> or run your numbers in the{" "}
      <Link href="/fhss-calculator">FHSS calculator</Link>.
    </Tag>
  );
}
