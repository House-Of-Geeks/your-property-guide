import Link from "next/link";
import { AFFORDABILITY_TABLE, affordabilityByIncome, money } from "@/lib/affordability-table";

/**
 * "How much house can I afford?" by income and household on
 * /affordability-calculator, worked by the borrowing engine with the
 * indicative HEM for each household (src/lib/affordability-table.ts).
 */
export function AffordabilityByHouseholdTable() {
  const rows = affordabilityByIncome();
  if (rows.length === 0) return null;
  const t = AFFORDABILITY_TABLE;
  return (
    <>
      <h2 id="by-household">How much house can I afford? By income and household</h2>
      <p>
        The purchase price a bank&rsquo;s serviceability test supports for a single applicant, a couple and a
        couple with two children, before you enter your own figures. Assumptions, as at {new Date(t.asAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}:
        a {t.depositPct}% deposit already saved, no other debts, net income after 2026&ndash;27 income tax and the 2%
        Medicare levy for each applicant, living expenses at
        the indicative HEM floor for each household and income band ({t.hemAsAt}; see the{" "}
        <Link href="/borrowing-power-calculator#hem-table">HEM table</Link>), repayments capped at 85% of what is left,
        and a {t.assessmentRate}% assessment rate over {t.termYears} years, which is the {t.loanRate}% average new
        variable rate in {t.loanRatePeriod}{" "}plus APRA&rsquo;s 3 point buffer. The couple columns split the income
        evenly between two applicants. Prices are rounded to the nearest $5,000.
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Household income</th>
              <th>Single</th>
              <th>Couple</th>
              <th>Couple, two children</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.income}>
                <td>{money(r.income)}</td>
                <td>{r.single.price ? money(r.single.price) : "n/a"}<br /><small>HEM {money(r.single.hem)}/mo</small></td>
                <td>{r.couple.price ? money(r.couple.price) : "n/a"}<br /><small>HEM {money(r.couple.hem)}/mo</small></td>
                <td>{r.coupleTwoChildren.price ? money(r.coupleTwoChildren.price) : "n/a"}<br /><small>HEM {money(r.coupleTwoChildren.hem)}/mo</small></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        <small>
          Each price is the maximum loan divided by 0.8, so the deposit it assumes is 20% of the price shown plus
          buying costs; if your savings are lower, the deposit is the binding limit and the calculator above says so.
          Childcare, school fees, HECS, a car loan or a credit card limit come off the surplus before the loan is
          worked out, so treat each figure as a ceiling. The living-expense floors are Your Property Guide&rsquo;s
          indicative HEM estimates, not a lender&rsquo;s table.
        </small>
      </p>
    </>
  );
}
