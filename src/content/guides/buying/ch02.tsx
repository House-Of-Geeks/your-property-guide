import Link from "next/link";
import type { Chapter } from "../types";
import { Box, Ch, Pull, Stat, TableWrap } from "../parts";

export const chapter: Chapter = {
  guide: "buying",
  number: 2,
  step: "Work out your budget",
  standfirst:
    "Two numbers get confused at the start of every purchase: what the bank will lend you, and what you should spend. They are rarely the same number, and the second one is yours to set.",
  callout:
    "“What’s your budget?” is usually the first question a selling agent asks. Their job is to get the best price for the seller, and knowing your pre-approval lets them pitch the price guide and any counter-offer to it. A range is a reasonable answer, and your limit can stay with you.",
  checklist: [
    "Set your own budget from your real spending, below the bank’s number",
    "Cancel or cut credit cards you don’t use, and stop buy-now-pay-later",
    "Price the LMI at your deposit, or check the 5% Deposit Scheme",
    "Add stamp duty, conveyancing, inspections and moving to the deposit",
    "Keep your pre-approval amount to yourself, and give agents a range",
  ],
  cta: {
    kind: "tool",
    title: "Work out your borrowing power",
    body: "What lenders will let you borrow on your income, expenses and debts, with the APRA buffer applied.",
    label: "Open the borrowing power calculator",
    href: "/borrowing-power-calculator?from=buying-guide-ch2",
  },
  checked: "LMI ranges and costs typical as at mid-2026; NSW stamp duty at 2026-27 rates.",
  Body,
};

function Body() {
  return (
    <>
      <p>
        Your budget is one of the first things a selling agent will ask about, so it’s worth setting before anyone asks. Build it from
        your own numbers and keep the limit private. Then every price guide you see becomes something you can test against a number you
        trust.
      </p>

      <h2>Borrowing power, and the buffer behind it</h2>
      <p>
        Lenders work out your borrowing power from income, expenses, existing debts and the loan you’re asking for. Then they apply the
        rule that surprises most buyers: under APRA’s serviceability standard, banks must assess you as if your interest rate were{" "}
        <strong>3 percentage points higher</strong> than the rate you’ll actually pay. If your loan is offered at 5.9 per cent, you’re
        assessed at 8.9 per cent. APRA reviewed the buffer again in 2026 and held it at 3 points, so plan around it.
      </p>

      <Stat value="3 points">The APRA serviceability buffer added to your rate when banks assess you.</Stat>

      <p>
        Three things quietly shrink borrowing power: credit card limits (lenders assess the full limit, not the balance, so cancel or cut
        cards you don’t use), HELP/HECS repayments, and any existing loans including car finance and buy-now-pay-later accounts. Three
        months of clean bank statements before applying is worth real money.
      </p>
      <p>
        Whatever number the bank produces, it is a ceiling, not a target. The bank is testing whether you can repay under stress; it is not
        testing whether you can repay under stress <em>and</em> have a life. Set your own budget from your real spending, then borrow less
        than you’re offered. Nobody has ever regretted a 10 per cent buffer of their own.
      </p>

      <Pull>The bank’s number is a ceiling, not a target.</Pull>

      <h2>Deposits: 5, 10 or 20 per cent</h2>
      <p>
        Your deposit sets your loan-to-value ratio (LVR), and your LVR decides whether you pay <strong>lenders mortgage insurance</strong>.
        LMI protects the lender if you default; you pay the premium, and it buys you nothing. It applies once your LVR goes above 80 per
        cent, it scales steeply with the loan size and LVR, and most borrowers capitalise it onto the loan, which means paying interest on
        it for 30 years. Typical premiums on a $750,000 purchase, as at mid-2026:
      </p>
      <TableWrap>
        <table>
          <thead>
            <tr><th>Deposit</th><th>LVR</th><th>Typical LMI premium</th></tr>
          </thead>
          <tbody>
            <tr><td>20% ($150,000)</td><td>80%</td><td>$0</td></tr>
            <tr><td>15% ($112,500)</td><td>85%</td><td>$4,000 - $8,000</td></tr>
            <tr><td>10% ($75,000)</td><td>90%</td><td>$11,000 - $17,000</td></tr>
            <tr><td>5% ($37,500)</td><td>95%</td><td>$22,000 - $33,000</td></tr>
          </tbody>
        </table>
      </TableWrap>
      <p>
        Premiums vary by lender and insurer, so treat these as ranges, but the shape is universal: the last 5 per cent of deposit you
        didn’t save is the most expensive money in the deal. The big exception is the federal 5% Deposit Scheme, which lets eligible first
        home buyers skip LMI entirely; <Ch n={3} guide="buying">Chapter 3</Ch> covers it. A small number of professions (medicine, law,
        accounting at certain income levels) can also get LMI waived at 90 per cent LVR; ask a broker if that might be you. Our{" "}
        <Link href="/lmi-calculator">LMI calculator</Link> prices it at your deposit.
      </p>

      <h2>The upfront costs beyond the deposit</h2>
      <p>The deposit is the headline, but settlement day has a supporting cast. Budget for all of it before you bid on anything:</p>
      <ul>
        <li>
          <strong>Stamp duty (transfer duty).</strong> The big one: a state tax on the purchase, scaled to the price. On a $750,000
          established home it ranges from roughly $20,000 to $40,000 for a non-first-home buyer depending on the state. First home buyer
          concessions can cut it to zero (<Ch n={3} guide="buying">Chapter 3</Ch>).
        </li>
        <li>
          <strong>Conveyancing and searches: $800 to $2,500.</strong> Contract reviews, title and council searches, settlement. Engage
          someone before you make an offer, not after.
        </li>
        <li>
          <strong>Building and pest inspection: $400 to $800</strong> per property you get serious about. Strata report for units: $250 to
          $400. Budget for two or three of these across your search; reports on homes you don’t buy are the cheapest insurance in this guide.
        </li>
        <li>
          <strong>Government registration fees:</strong> mortgage registration and transfer fees, typically $200 to $500 combined depending
          on the state.
        </li>
        <li><strong>Loan costs:</strong> application or settlement fees, $0 to $800 depending on the lender.</li>
        <li>
          <strong>Moving, connections, immediate repairs:</strong> $1,000 to $3,000 for most households. More if you’re buying appliances
          or window coverings, which new builds often lack.
        </li>
      </ul>

      <h2>Worked example: a $750,000 purchase</h2>
      <p>An established house in NSW, bought two ways. Same property, very different cheques:</p>
      <TableWrap>
        <table>
          <thead>
            <tr><th>Upfront cost</th><th>First home buyer (5% Deposit Scheme)</th><th>Upgrader (20% deposit)</th></tr>
          </thead>
          <tbody>
            <tr><td>Deposit</td><td>$37,500</td><td>$150,000</td></tr>
            <tr><td>Stamp duty (NSW 2026-27 rates)</td><td>$0 (exempt up to $800,000)</td><td>$27,937</td></tr>
            <tr><td>Lenders mortgage insurance</td><td>$0 (government guarantee)</td><td>$0 (LVR 80%)</td></tr>
            <tr><td>Conveyancing and searches</td><td>$1,800</td><td>$1,800</td></tr>
            <tr><td>Building and pest inspection</td><td>$600</td><td>$600</td></tr>
            <tr><td>Transfer and mortgage registration</td><td>$340</td><td>$340</td></tr>
            <tr><td>Moving and connections</td><td>$1,200</td><td>$1,200</td></tr>
            <tr><td><strong>Total cash needed at settlement</strong></td><td><strong>$41,440</strong></td><td><strong>$181,877</strong></td></tr>
          </tbody>
        </table>
      </TableWrap>

      <Stat value="$27,937">Stamp duty on a $750,000 established home in NSW without a concession (2026-27 rates).</Stat>

      <p>
        The first home buyer gets in for a quarter of the upfront cash, but borrows $712,500 against $750,000 of property. A 5 per cent
        price dip puts that loan underwater on paper. Cheap entry is real; so is thin equity. Both columns are honest, and neither is free.
        Our <Link href="/stamp-duty-calculator">stamp duty calculator</Link> runs the duty for your state and price.
      </p>

      <Box title="Investor">
        <p>
          No first home concessions apply to you, so price stamp duty at the full rate, and in some states watch for surcharges
          (foreign-owner duty doesn’t apply to citizens, but investor land tax will likely apply every year you hold). The good news: stamp
          duty, borrowing costs and your paid LMI all join the property’s cost base or deductions. Keep every receipt from day one.
        </p>
      </Box>

      <Box title="Downsizer">
        <p>
          If you’re buying from sale proceeds with no loan, the buffer and LMI sections don’t apply, but resist the urge to commit every
          dollar of the sale to the purchase. Keep a renovation and contingency fund outside the deal, and read{" "}
          <Ch n={3} guide="buying">Chapter 3</Ch> on the downsizer superannuation contribution before you decide where the leftover money
          lives.
        </p>
      </Box>

      <Box title="Watch for">
        <p>
          Spending to your pre-approval because the number felt like permission. Pre-approval is calibrated to the bank’s risk, not your
          plans. The buyers who get into trouble are rarely the ones the bank rejected; they’re the ones the bank approved at the limit in a
          rising rate year.
        </p>
      </Box>
    </>
  );
}
