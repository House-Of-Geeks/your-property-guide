import { BORROWING_TABLE, asAt, borrowingPowerByIncome, incomeNeededByLoan, money, percentLowerAtRate } from "@/lib/borrowing-power-table";
import { getHEM } from "@/lib/utils/borrowing-power";

/**
 * "Borrowing power by income" on /borrowing-power-calculator: one row per
 * income from $60,000 to $200,000, a single applicant and a couple, worked by
 * the same engine as the widget (src/lib/borrowing-power-table.ts).
 * Server-rendered so a crawler and an AI Overview can read a figure; the
 * assumptions are stated above the table and dated. Renders nothing rather
 * than a table of zeros if the engine has no figures.
 */
export function BorrowingPowerTable() {
  const rows = borrowingPowerByIncome();
  if (rows.length === 0) return null;
  const rate = BORROWING_TABLE.assessmentRate;
  const lowerAt1 = percentLowerAtRate(rate + 1);
  const lowerAt2 = percentLowerAtRate(rate + 2);
  return (
    <>
      <h2 id="by-income">Borrowing power by income</h2>
      <p>
        What a single applicant and a couple can borrow on this calculator&rsquo;s
        method, before you enter your own figures. Assumptions, as at {asAt()}:
        no other debts, no dependants, living expenses at the indicative HEM floor for each
        household and income band ({BORROWING_TABLE.asAtHem}; {money(getHEM(0, { grossIncome: 60_000 }))} a month for a
        single person under $80,000, {money(getHEM(0, { grossIncome: 100_000 }))} from $80,000 to $150,000, more for a
        couple or a higher income, as the <a href="#hem-table">HEM table</a> below shows; the calculator above starts
        at $3,000, so enter a lower figure to reproduce a row), net income after 2026&ndash;27 income tax and the 2%
        Medicare levy for each applicant, repayments capped at 85%
        of what is left, and a {rate}% assessment rate over {BORROWING_TABLE.termYears} years.
        That rate is the {BORROWING_TABLE.loanRate}% average rate on new owner-occupier variable
        loans in {BORROWING_TABLE.loanRatePeriod} (Reserve Bank of Australia, statistical table F6)
        plus the {BORROWING_TABLE.buffer} percentage point serviceability buffer APRA confirmed
        on {BORROWING_TABLE.bufferConfirmed}. Every figure moves with the rate: at {(rate + 1).toFixed(1)}% each
        row is about {lowerAt1}% lower, at {(rate + 2).toFixed(1)}% about {lowerAt2}% lower. Figures are
        rounded to the nearest $1,000.
      </p>
      {/* Scrolls sideways on a phone instead of widening the page. */}
      <div className="overflow-x-auto">
      <table>
        <thead>
          <tr>
            <th>Income, each</th>
            <th>Single: max loan</th>
            <th>Couple: income</th>
            <th>Couple: max loan</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.income}>
              <td>{money(r.income)}</td>
              <td>{money(r.single)}</td>
              <td>{money(r.coupleIncome)}</td>
              <td>{money(r.couple)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <p>
        <small>
          Couple: both partners earn the income shown, so the $100,000 row is a
          $200,000 household, and carries the higher living-expense floor of a
          couple in a higher income band. Add a 20% deposit for the purchase price (a {money(rows[0].single)} loan
          buys about {money(Math.round(rows[0].single / 0.8 / 1000) * 1000)}). A credit card limit, a car loan or HECS
          repayments come off the surplus before the loan is worked out, so treat
          each figure as a ceiling and run your own numbers above.
        </small>
      </p>

      <h2 id="income-needed">Income needed for a $500,000 to $1,000,000 loan</h2>
      <p>
        The same method run the other way: the gross income at which the calculator supports each loan, for a single
        applicant and for a couple who each earn the figure shown, on the assumptions above. Rounded up to the next
        $1,000.
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Loan</th>
              <th>Single: income needed</th>
              <th>Couple: income needed, each</th>
            </tr>
          </thead>
          <tbody>
            {incomeNeededByLoan().map((r) => (
              <tr key={r.loan}>
                <td>{money(r.loan)}</td>
                <td>{money(r.single)}</td>
                <td>{money(r.coupleEach)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
