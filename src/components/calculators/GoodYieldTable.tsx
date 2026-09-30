import Link from "next/link";
import { YIELD_AREAS, YIELD_WITHHELD } from "@/lib/data/yield-benchmarks";
import { pct, yieldAsAt, yieldFeedDates } from "@/lib/yield-benchmarks";

const CITY_PATH: Record<string, string> = { melbourne: "/property-market/melbourne", brisbane: "/property-market/brisbane" };
const STATE_PATH: Record<string, string> = { vic: "/states/vic", qld: "/states/qld" };

/**
 * "What is a good rental yield in 2026?" on /rental-yield-calculator: the
 * median gross yields of the suburbs this site publishes, by city, regional
 * remainder and state, from src/lib/data/yield-benchmarks.ts (generated
 * from production under the yield ranking's gate). Server-rendered so a
 * crawler reads the figures; the method line says how, and every state left
 * out says why. No figure prints without one (pct() returns null for 0).
 */
export function GoodYieldTable() {
  const feeds = yieldFeedDates();
  const rows = YIELD_AREAS.filter((a) => pct(a.houseMedian));
  if (rows.length === 0) return null;
  return (
    <>
      <h2 id="good-yield">What is a good rental yield in 2026?</h2>
      <p>
        One above the going rate for the place and the property type, so start
        from the medians. These are the median gross yields of the suburbs this
        site publishes with both a bond-data rent and a sales median, for the
        two states whose rents are published suburb by suburb. The middle half
        is the range between the lower and upper quartile: a house yield above
        the upper quartile is high for its market, and usually means a low price
        in a small town rather than a bargain.
      </p>
      {/* Scrolls sideways on a phone instead of widening the page. */}
      <div className="overflow-x-auto">
      <table>
        <caption className="sr-only">Median gross rental yield by area, houses and units</caption>
        <thead>
          <tr>
            <th>Area</th>
            <th>Houses: median</th>
            <th>Houses: middle half</th>
            <th>Units: median</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => {
            const href = a.kind === "city" ? CITY_PATH[a.key] : a.kind === "state" ? STATE_PATH[a.key] : null;
            const lo = pct(a.houseLowerQuartile), hi = pct(a.houseUpperQuartile), unit = pct(a.unitMedian);
            return (
              <tr key={a.key}>
                <td>{href ? <Link href={href}>{a.name}</Link> : a.name}</td>
                <td>{pct(a.houseMedian)} ({a.houseSuburbs} suburbs)</td>
                <td>{lo && hi ? `${lo} to ${hi}` : "n/a"}</td>
                <td>{unit ? `${unit} (${a.unitSuburbs} suburbs)` : "not published"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      <p>
        <small>
          As at {yieldAsAt()}. Method: for each suburb, weekly rent × 52 ÷ the
          median house price its own page publishes (a trusted sales feed, five or
          more sales where the count is known); the table shows the median of those
          suburb yields, for suburbs of 1,000 people or more, with yields above 20%
          treated as data errors. Rents are the newest bond-data quarter
          (Victorian rental report {feeds.vicRent ?? "n/a"}, Queensland RTA bond data {feeds.qldRent ?? "n/a"});
          prices are the Land Victoria quarterly suburb medians (latest quarter, as at {feeds.vicSales ?? "n/a"})
          and, in Queensland, the ABS statistical-area (SA2) medians for {feeds.absYear ?? "the latest ABS year"},
          as on the suburb pages. Queensland rents are newer than its prices, which lifts its yields a
          little where prices have risen since. Gross, before
          rates, insurance, management, maintenance and vacancy. The same data ranks the{" "}
          <Link href="/best-suburbs/best-rental-yield">best suburbs for rental yield</Link>.
        </small>
      </p>
      {YIELD_WITHHELD.length > 0 && (
        <>
          <p>
            <small>Not published, and why:</small>
          </p>
          <ul>
            {YIELD_WITHHELD.map((w) => (
              <li key={w.state}>
                <small>{`${w.name}, including ${w.capital}: ${w.reason}.`}</small>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
