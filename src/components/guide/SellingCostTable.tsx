import Link from "next/link";
import type { StateCode } from "@/lib/data/commission-rates";
import { SELLING_COSTS_AS_AT, money, sellingCostTable } from "@/lib/data/selling-costs";

const APPLIES: Record<string, string> = { auction: " (if you sell at auction)", loan: " (if you have a mortgage)" };

/**
 * "What it costs to sell in {State}": the state summary table on each
 * commission guide (fix item 10). Figures come from src/lib/data/selling-costs.ts
 * so the eight guides cannot drift; the national cost-of-selling guide stays
 * the long version and is linked, not repeated.
 */
export function SellingCostTable({ state }: { state: StateCode }) {
  const t = sellingCostTable(state);
  const c = t.commission;
  return (
    <>
      <h2 id="cost-table">What it costs to sell in {t.stateName}</h2>
      <p>
        Commission is the biggest line, not the only one. This is the{" "}
        {t.stateName} summary in {t.stateName}&rsquo;s numbers, worked at a{" "}
        {money(t.price)} sale. The{" "}
        <Link href="/guides/cost-of-selling-a-house-australia">national cost of selling guide</Link>{" "}
        explains each line in full.
      </p>
      <table>
        <thead>
          <tr>
            <th>Cost</th>
            <th>Typical range</th>
            <th>At {money(t.price)}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Agent commission</strong><br /><small>Negotiable; GST of 10% usually applies on top.</small></td>
            <td>{c.low}% to {c.high}%</td>
            <td>{money(c.lowAmount)} to {money(c.highAmount)}<br /><small>{money(c.typicalAmount)} at the typical {c.typical}%</small></td>
          </tr>
          {t.lines.map((l) => (
            <tr key={l.key}>
              <td><strong>{l.label}</strong>{APPLIES[l.applies] ?? ""}<br /><small>{l.note}</small></td>
              <td>{money(l.low)} to {money(l.high)}</td>
              <td>{money(l.low)} to {money(l.high)}</td>
            </tr>
          ))}
          <tr>
            <td><strong>Total</strong><br /><small>Low end: private treaty, no mortgage, everything at the bottom of its range. High end: auction with a mortgage, everything at the top.</small></td>
            <td>{t.totalLowPct}% to {t.totalHighPct}% of the price</td>
            <td><strong>{money(t.totalLow)} to {money(t.totalHigh)}</strong></td>
          </tr>
        </tbody>
      </table>
      <p>
        <small>
          As at {SELLING_COSTS_AS_AT}. Commission is this guide&rsquo;s typical{" "}
          {t.stateName} range. The marketing, conveyancing, auctioneer, discharge and{" "}
          {t.documents.label.toLowerCase()} figures are indicative ranges: each is quoted
          individually and no {t.stateName} survey publishes them, so treat them as a
          budget, not a price list. What the {t.documents.label.toLowerCase()} must
          contain:{" "}
          <a href={t.documents.source.href} target="_blank" rel="noopener noreferrer">
            {t.documents.source.label}
          </a>
          . Capital gains tax is separate and applies to an investment property, not
          the home you live in.
        </small>
      </p>
    </>
  );
}
