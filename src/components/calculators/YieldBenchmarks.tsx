import Link from "next/link";
import { CITY_YIELDS, TOP_YIELD_BY_STATE, YIELD_BENCHMARKS_AS_OF, YIELD_SOURCE_DATES } from "@/lib/data/yield-benchmarks";

const money = (n: number) => `$${n.toLocaleString("en-AU")}`;
const STATE_NAMES: Record<string, string> = { VIC: "Victoria", QLD: "Queensland", NSW: "New South Wales", SA: "South Australia" };
const asOfLabel = (d: string | null | undefined) => (d ? new Date(d).toLocaleDateString("en-AU", { month: "long", year: "numeric", timeZone: "UTC" }) : "n/a");

/**
 * The "good yield in 2026" and "highest-yield suburbs" tables on the rental
 * yield calculator (fix item 15). Figures come from src/lib/data/yield-benchmarks.ts,
 * generated from production under the suburb pages' gate; the method line
 * says how, and every withheld city says why.
 */
export function YieldBenchmarks() {
  const shown = CITY_YIELDS.filter((c) => !c.withheld);
  const withheld = CITY_YIELDS.filter((c) => c.withheld);
  return (
    <>
      <h2 id="good-yield">What is a good rental yield in 2026?</h2>
      <p>
        A good yield is one above the going rate for the city and property type,
        so start from the medians. These are the median gross yields of the
        suburbs this site publishes with both a bond-data rent and a sales
        median, city by city.
      </p>
      <table>
        <thead>
          <tr><th>City</th><th>Houses, median gross yield</th><th>Units, median gross yield</th></tr>
        </thead>
        <tbody>
          {shown.map((c) => (
            <tr key={c.slug}>
              <td><Link href={`/property-market/${c.slug}`}>{c.name}</Link></td>
              <td>{c.houseYield !== null ? `${c.houseYield}% (${c.houseSuburbs} suburbs)` : "not published"}</td>
              <td>{c.unitYield !== null ? `${c.unitYield}% (${c.unitSuburbs} suburbs)` : c.state === "NSW" ? "not published: no unit price feed" : "not published"}</td>
            </tr>
          ))}
          {withheld.map((c) => (
            <tr key={c.slug}>
              <td>{c.name}</td>
              <td colSpan={2}><small>Not published: {c.withheld}.</small></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <small>
          As at {asOfLabel(YIELD_BENCHMARKS_AS_OF)}. Method: for each suburb, weekly rent × 52 ÷ median price; the table
          shows the median of those suburb yields. Rents are the newest bond-data quarter
          (NSW {asOfLabel(YIELD_SOURCE_DATES["rental-nsw"])}, Victoria {asOfLabel(YIELD_SOURCE_DATES["rental-vic"])},
          Queensland {asOfLabel(YIELD_SOURCE_DATES["rental-qld"])}); prices are the sales feeds behind the suburb pages,
          on five or more sales where the count is known. Gross, before rates, insurance, management, maintenance and vacancy.
        </small>
      </p>

      <h2 id="highest-yield">Highest-yielding suburbs by state</h2>
      <p>
        The five suburbs with the highest gross house yield in each state where the
        rent is published for the suburb itself, from the same gated data. New South
        Wales is not ranked because its bond data is published by postcode, and South
        Australia is under review.
      </p>
      {TOP_YIELD_BY_STATE.map((st) => (
        <table key={st.state}>
          <thead>
            <tr><th>{STATE_NAMES[st.state] ?? st.state}</th><th>Weekly rent</th><th>Median house price</th><th>Gross yield</th></tr>
          </thead>
          <tbody>
            {st.top.map((t) => (
              <tr key={t.slug}>
                <td><Link href={`/suburbs/${t.slug}`}>{t.name} {t.postcode}</Link></td>
                <td>{money(t.rent)}</td>
                <td>{money(t.price)}</td>
                <td>{t.houseYield}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
      <p>
        <small>
          Suburbs with a population of at least 1,000. A high yield usually means a low price in a
          small market: check the sales count, the vacancy and the tenant demand on the suburb page
          before treating it as an investment case.
        </small>
      </p>
    </>
  );
}
