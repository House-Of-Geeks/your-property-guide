import Link from "next/link";
import type { Chapter } from "../types";
import { Box, Ch, Stat, TableWrap } from "../parts";

export const chapter: Chapter = {
  guide: "buying",
  number: 3,
  step: "Check the schemes",
  standfirst:
    "The support on offer in 2026 is the most generous in a generation, and the most confusing. Here is the federal layer, the state layer and who qualifies for what.",
  callout:
    "Selling agents know which homes sit just under a first home buyer price cap, and that those homes draw buyers using the schemes. Pricing and marketing a home with that audience in mind is a sensible way to reach the most likely buyers. Check your caps and concessions before you inspect, so you know which homes they cover and what they’re worth to you.",
  checklist: [
    "Check your eligibility for the 5% Deposit Scheme and its price cap for your area",
    "Check whether Help to Buy fits your income and the home you want",
    "FHSS: request your ATO determination before you sign a contract",
    "Look up your state’s grant and duty settings with its revenue office",
    "Diarise the move-in and live-in dates your schemes require",
  ],
  cta: {
    kind: "tool",
    title: "See your stamp duty, with concessions",
    body: "Duty for your state, price and buyer type, with the first home concessions applied.",
    label: "Open the stamp duty calculator",
    href: "/stamp-duty-calculator?from=buying-guide-ch3",
  },
  checked: "Grant, duty and federal scheme settings checked against each revenue office and Housing Australia on 14 October 2026.",
  Body,
};

function Body() {
  return (
    <>
      <p>
        Selling agents know these numbers well, and it pays to know them too: they shape what you can pay, what you’ll pay in duty and
        which homes the price caps let you buy.
      </p>

      <h2>The federal 5% Deposit Scheme</h2>
      <p>
        The headline program, formerly the Home Guarantee Scheme, was overhauled on 1 October 2025 and renamed the Australian Government 5%
        Deposit Scheme. The deal: you buy with a 5 per cent deposit, the government guarantees the portion of the loan above 80 per cent,
        and you pay <strong>no lenders mortgage insurance</strong>. On a 95 per cent loan that saves roughly $22,000 to $33,000 on a
        $750,000 purchase (<Ch n={2} guide="buying">Chapter 2</Ch>’s table).
      </p>
      <p>
        The October 2025 reforms removed the two biggest barriers: there is <strong>no longer any cap on places</strong> (the old
        35,000-a-year lottery is gone) and <strong>no income test</strong>. Property price caps still apply and were raised substantially:
        $1.5 million for Sydney and the major NSW centres, $950,000 for Melbourne and Geelong, $1 million for Brisbane and South East
        Queensland’s centres, $900,000 for Adelaide, $850,000 for Perth, with lower caps outside the capitals. You must live in the home,
        prior property ownership rules apply, and you apply through a participating lender, not the government. One honest caveat: a
        guarantee is not a discount. You still borrow 95 per cent, and the repayments that come with it.
      </p>

      <Stat value="$1.5m">The 5% Deposit Scheme price cap for Sydney from 1 October 2025, up from $900,000.</Stat>

      <h2>Help to Buy: the government as co-owner</h2>
      <p>
        Help to Buy is the federal shared equity scheme, launched in December 2025. The Commonwealth contributes up to 40 per cent of the
        price of a new home (30 per cent for an established one) in exchange for an equity stake, and you can enter with a 2 per cent
        deposit. It is income-tested ($103,000 for singles, $165,000 for couples and single parents, from 1 July 2026), capped at 10,000
        places a year, and runs through participating lenders, initially Commonwealth Bank and Bank Australia, with more joining through
        2026. City price caps apply (Sydney $1.3 million, Melbourne $950,000, Brisbane $1 million, with lower caps in the smaller capitals
        and regions). You repay the government’s share when you sell, or buy it back in stages; the government’s slice of your capital
        growth goes with it. For buyers locked out by repayments rather than deposit, it’s the most powerful lever on this page. Read the
        equity mechanics carefully before signing; our <Link href="/help-to-buy-calculator">Help to Buy calculator</Link> shows the shares.
      </p>

      <h2>The First Home Super Saver scheme</h2>
      <p>
        FHSS lets you make voluntary super contributions (up to $15,000 a year, $50,000 in total per person) and later withdraw them, plus
        deemed earnings, for a first home deposit. Because contributions can go in pre-tax at 15 per cent instead of your marginal rate, a
        couple can put $100,000 of deposit savings through super and come out thousands ahead of a bank account. The catches: paperwork
        order matters (request your determination from the ATO <strong>before</strong> you sign a contract), release takes weeks, and only
        voluntary contributions count, never the compulsory employer kind. Our <Link href="/fhss-calculator">FHSS calculator</Link>{" "}
        estimates the difference.
      </p>

      <h2>State grants and stamp duty relief</h2>
      <p>
        States stack their own help on top: a First Home Owner Grant (cash, for new builds only) and stamp duty exemptions or concessions.
        Settings as at 14 October 2026, checked against each revenue office:
      </p>
      <TableWrap>
        <table>
          <thead>
            <tr><th>State</th><th>First home owner grant</th><th>Stamp duty for first home buyers</th></tr>
          </thead>
          <tbody>
            <tr><td>NSW</td><td>$10,000, new homes to $600,000 (or $750,000 building a new one)</td><td>Exempt to $800,000, concession to $1m, new or established</td></tr>
            <tr><td>VIC</td><td>$10,000, new homes to $750,000</td><td>Exempt to $600,000, concession to $750,000</td></tr>
            <tr><td>QLD</td><td>$30,000, new homes under $750,000 (kept by the 2026-27 QLD Budget; eligible contracts from 20 Nov 2023)</td><td>New homes and vacant land exempt with no price cap (from 1 May 2025); established exempt to $700,000, partial to $800,000</td></tr>
            <tr><td>WA</td><td>$10,000, new homes to $800,000 in Perth and the south ($1 million north of the 26th parallel)</td><td>Exempt to $600,000, then $16.15 per $100 to $800,000, new or established (agreements from 7 May 2026). Vacant land exempt to $450,000</td></tr>
            <tr><td>SA</td><td>Up to $15,000, new homes, no price cap</td><td>No duty on a new home, off-the-plan apartment or land to build, no price cap. Established homes: no relief</td></tr>
            <tr><td>TAS</td><td>$20,000, new homes, no price cap, for transactions 1 July 2026 to 30 June 2027 (scheduled to fall to $10,000 after)</td><td>None now: the established-home exemption to $750,000 ended for settlements after 30 June 2026</td></tr>
            <tr><td>ACT</td><td>No grant; concession scheme instead</td><td>From 1 July 2026, no duty at any price and no income test, if you have held no property interest in the last five years</td></tr>
            <tr><td>NT</td><td>$50,000 HomeGrown Territory Grant, new homes, no price cap, contracts to 30 September 2027</td><td>No first home duty concession; the grant does the heavy lifting</td></tr>
          </tbody>
        </table>
      </TableWrap>
      <p>
        Three patterns worth seeing. First, the grants chase <strong>new builds</strong>: governments want construction, so the cash goes
        to house-and-land and off-the-plan buyers. Second, the duty relief increasingly covers <strong>established homes</strong> too,
        which is where most first home buyers actually shop. Third, every scheme has eligibility fine print (residence periods,
        citizenship, prior ownership), and the dollar settings above change with budgets and by contract date (by settlement date in
        Tasmania). Verify your state’s current numbers with its revenue office before you sign anything; the table is a map, not a
        contract. Our <Link href="/first-home-buyers">first home buyers hub</Link> links each state’s guide.
      </p>

      <Box title="Upgrader">
        <p>
          None of this chapter applies to your purchase: the schemes are strictly first-home. Two exceptions worth knowing. If your household
          includes someone who has genuinely never owned (a new partner, for instance), buying in their name alone can retain eligibility,
          with real legal and lending trade-offs that need advice. And your stamp duty bill is full freight, so weigh renovation against
          moving: extending costs no duty at all.
        </p>
      </Box>

      <Box title="Investor">
        <p>
          Every scheme on this page requires you to live in the property, so none of them fund a pure investment. The bigger trap runs the
          other way: buying an investment property <em>first</em> usually extinguishes your future first-home eligibility in most schemes.
          If you’re young and choosing between rentvesting and waiting to buy a home, price in what you’re giving up: on the numbers above,
          it can exceed $50,000.
        </p>
      </Box>

      <Box title="Downsizer">
        <p>
          Your scheme lives in superannuation: the downsizer contribution lets each member of a couple move up to $300,000 from the sale of a
          home owned ten years or more into super, outside the normal caps, from age 55. That’s up to $600,000 of sale proceeds moved into a
          concessionally taxed environment. Get financial advice on timing, because it interacts with pension means tests.
        </p>
      </Box>
    </>
  );
}
