import Link from "next/link";
import { HEM_AS_AT, HEM_INCOME_BANDS, HEM_METHOD_NOTE, HEM_REGION_FACTOR, hemTableRows } from "@/lib/data/hem";

const money = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;

/**
 * "Indicative HEM by household" on /borrowing-power-calculator: the
 * living-expense floor the calculator applies for each household shape and
 * income band, server-rendered with its method and date so a reader, a
 * crawler and an AI Overview can see where the figure comes from.
 */
export function HemTable() {
  const rows = hemTableRows();
  return (
    <>
      <h2 id="hem-table">The living-expense floor: indicative HEM by household</h2>
      <p>
        Lenders compare the living expenses you declare with the{" "}
        <Link href="/glossary/hem-household-expenditure-measure">Household Expenditure Measure</Link> (HEM) for a
        household like yours and use whichever is higher, so declaring less than HEM does not lift your borrowing
        power. The real HEM tables are licensed to lenders and not published. This calculator applies the indicative
        monthly figures below ({HEM_AS_AT}), by household and gross household income band, for a capital city;
        regional households are taken at {Math.round(HEM_REGION_FACTOR.regional * 100)}% of the capital figure.
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Household</th>
              {HEM_INCOME_BANDS.map((b) => <th key={b.label}>{b.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <td>{r.label}</td>
                {r.monthly.map((m, i) => <td key={i}>{money(m)} a month</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p><small>{HEM_METHOD_NOTE} HEM excludes rent or mortgage repayments; school fees, childcare, insurance, HECS and loan repayments are assessed on top of it. For context, the Australian Bureau of Statistics&rsquo; last full Household Expenditure Survey (2015-16) put average weekly household spending on goods and services at $1,425, about $6,200 a month including housing; HEM sits well below average spending by design.</small></p>
    </>
  );
}
