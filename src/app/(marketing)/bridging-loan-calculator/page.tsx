import type { Metadata } from "next";
import Link from "next/link";
import { BridgingLoanCalculator } from "@/components/calculators/BridgingLoanCalculator";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { Callout, type FaqItem, type RelatedGuide } from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import {
  COST_TABLE_AMOUNTS,
  COST_TABLE_MONTHS,
  EXAMPLE_BRIDGING_RATE,
  EXAMPLE_ONGOING_RATE,
  PEAK_LVR_CAP,
  capitalisedInterest,
  computeBridging,
  defaultBridgingInput,
} from "@/lib/bridging-calc";
import { PUBLISHED_CAPITALISED_RATES } from "@/lib/data/bridging-lenders";
import { AVERAGE_NEW_VARIABLE_RATE, F6_RATE_CAVEAT, F6_SOURCE } from "@/lib/data/rba-lending-rates";

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Bridging loan calculator",
  h1: "Bridging loan calculator: peak debt, end debt and what it costs",
  description:
    "Enter what your home should sell for and the price of the next one. See your peak debt, whether it fits a lender's 80% limit, the interest added while you sell, the loan you're left with, and how bridging compares with selling first.",
  slug: "bridging-loan-calculator",
  schemaName: "Bridging Loan Calculator",
  schemaDescription:
    "Estimate an Australian bridging loan: stamp duty on the purchase, peak debt and its LVR, capitalised interest on the bridged amount, end debt, monthly repayments and the cost against selling first.",
  updatedAt: "2026-10-11",
  persona: "upgrading",
};

const META_TITLE = "Bridging Loan Calculator Australia: Peak Debt, End Debt & Cost (2026)";
const META_DESCRIPTION =
  "Free bridging loan calculator for Australia. Peak debt and LVR, interest added while you sell, end debt, monthly repayments and the cost against selling first. Start from your suburb's median.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/${FRONTMATTER.slug}` },
  openGraph: { url: `${SITE_URL}/${FRONTMATTER.slug}`, title: META_TITLE, description: META_DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image" },
};

const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;

// Every figure below comes from the engine the calculator runs, so the page
// cannot drift from the tool (tests/lib/bridging-calc.test.ts pins them).
const RATE = EXAMPLE_BRIDGING_RATE;
const per100k6 = capitalisedInterest(100_000, RATE, 6);
const ex = defaultBridgingInput("NSW");
const exr = computeBridging(ex);

const FAQS: FaqItem[] = [
  {
    question: "How do you calculate a bridging loan?",
    answer:
      "Add up what you will owe at the peak: the mortgage on your current home, the new home's price, its stamp duty and buying costs, and the loan fees, less any savings you put in. " +
      "The bridging loan is the part your sale will repay, which is the sale price less selling costs. Interest on that part is added to the loan each month until the sale settles. " +
      "Peak debt is everything you owe once that interest is added, and the end debt is peak debt less the sale proceeds. Lenders test your income against the end debt.",
  },
  {
    question: "How much does a $100,000 bridging loan cost?",
    answer:
      `At ${RATE}% a year with the interest added monthly, about ${fmt(per100k6)} for six months, ${fmt(capitalisedInterest(100_000, RATE, 3))} for three and ${fmt(capitalisedInterest(100_000, RATE, 12))} for twelve. ` +
      `Banks that add bridging interest to the loan published rates of ${PUBLISHED_CAPITALISED_RATES.low}% to ${PUBLISHED_CAPITALISED_RATES.high}% on 6 October 2026, so ${RATE}% sits near the bottom of that range. ` +
      "Add the lender's fees. Scale it up for your own figure: $500,000 for six months is about " +
      `${fmt(capitalisedInterest(500_000, RATE, 6))}.`,
  },
  {
    question: "What is peak debt and end debt?",
    answer:
      "Peak debt is the most you owe during the bridging period: the existing mortgage plus the new purchase and its costs, plus the interest added while you sell. " +
      "End debt is what is left once your current home sells and the proceeds pay the loan down. It becomes your ordinary home loan.",
  },
  {
    question: "What LVR do lenders allow on a bridging loan?",
    answer:
      `Westpac, NAB and Bendigo Bank cap total lending at ${PEAK_LVR_CAP}% of both homes' combined value; ANZ lends up to ${PEAK_LVR_CAP}% of the new home's value. In the example on this page the peak debt is ${fmt(exr.peakDebt)} against ${fmt(exr.combinedValue)} of property, ${exr.peakLvr}%. ` +
      "Above the cap, the usual fixes are more savings, a cheaper purchase, or selling first.",
  },
  {
    question: "Is a bridging loan cheaper than selling first and renting?",
    answer:
      `Sometimes. On this page's example, six months of bridging costs ${fmt(exr.bridgingCost)} in interest and fees, against ${fmt(exr.sellFirstCost)} for six months' rent at $700 a week plus a second move. ` +
      "Bridging gets relatively cheaper when rents are high or the sale is quick, and dearer when the bridged amount is large or the sale drags on. Enter your own figures in the calculator.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Bridging loans guide", href: "/guides/bridging-loans-guide", description: "How bridging works, what it costs, the risks and when it is the right call." },
  { title: "Sell first or buy first?", href: "/guides/sell-first-or-buy-first", description: "The decision before you commit to a bridging loan." },
  { title: "Free property appraisal", href: "/appraisal", description: "Firm up the sale price every figure here depends on." },
  { title: "Stamp duty calculator", href: "/stamp-duty-calculator", description: "The duty on your next home, by state." },
  { title: "Selling costs calculator", href: "/selling-costs-calculator", description: "Commission, marketing and legal costs on your sale." },
  { title: "Borrowing power calculator", href: "/borrowing-power-calculator", description: "Whether your income covers the end debt." },
];

export default function BridgingLoanCalculatorPage() {
  return (
    <CalculatorPageLayout
      frontmatter={FRONTMATTER}
      calculator={<BridgingLoanCalculator />}
      faqs={FAQS}
      related={RELATED}
      intent="selling"
      explainer={
        <>
          <h2>What bridging costs, by amount and months</h2>
          <p>
            Interest added to the bridged amount at {RATE}% a year, compounded monthly. The bridged amount is the part of
            the loan your sale repays, roughly the sale price less selling costs. Lender fees come on top.
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Amount bridged</th>
                  {COST_TABLE_MONTHS.map((m) => <th key={m}>{m} months</th>)}
                </tr>
              </thead>
              <tbody>
                {COST_TABLE_AMOUNTS.map((a) => (
                  <tr key={a}>
                    <td>{fmt(a)}</td>
                    {COST_TABLE_MONTHS.map((m) => <td key={m}>{fmt(capitalisedInterest(a, RATE, m))}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            {RATE}% is an example rate, not a quote: Westpac, the St.George group and Bendigo Bank published{" "}
            {PUBLISHED_CAPITALISED_RATES.low}% to {PUBLISHED_CAPITALISED_RATES.high}% for bridging loans that add the
            interest to the loan, read on 6 October 2026. Each half a percentage point changes the six-month cost on $100,000 by
            about {fmt(capitalisedInterest(100_000, RATE + 0.5, 6) - per100k6)}.
          </p>

          <h2>How each figure is worked out</h2>
          <ul>
            <li>
              <strong>Stamp duty</strong> on the new home at your state&rsquo;s owner-occupier rate, from the same tables as
              our <Link href="/stamp-duty-calculator">stamp duty calculator</Link>. First home and off-the-plan concessions
              are left out because a bridging buyer already owns a home.
            </li>
            <li>
              <strong>Selling costs</strong> start from the typical commission for your state plus GST, $4,000 of marketing,
              conveyancing, the state&rsquo;s legal documents and the mortgage discharge fee, as in our{" "}
              <Link href="/selling-costs-calculator">selling costs calculator</Link>. Replace them with your agent&rsquo;s
              quote.
            </li>
            <li>
              <strong>Buying costs</strong> are the midpoint of our conveyancing estimate for the state, with the transfer
              and mortgage registration fees.
            </li>
            <li>
              <strong>Peak debt</strong> is the mortgage owing plus the purchase price, duty, buying costs and loan fees,
              less savings, plus the interest added while you sell.
            </li>
            <li>
              <strong>End debt</strong> is peak debt less the net sale proceeds. The monthly repayment assumes a 30-year
              principal and interest loan at {EXAMPLE_ONGOING_RATE}%, the average rate on{" "}
              {AVERAGE_NEW_VARIABLE_RATE.measure} in {AVERAGE_NEW_VARIABLE_RATE.period} (RBA table F6, published{" "}
              {F6_SOURCE.published}), {F6_RATE_CAVEAT}, which you can change.
            </li>
          </ul>

          <h2>The example the calculator opens with</h2>
          <p>
            A home expected to sell for {fmt(ex.salePrice)} with {fmt(ex.mortgageOwing)} owing, and a{" "}
            {fmt(ex.purchasePrice)} purchase in New South Wales, sold within six months:
          </p>
          <div className="overflow-x-auto">
            <table>
              <tbody>
                <tr><td>Stamp duty on the purchase</td><td>{fmt(exr.stampDuty)}</td></tr>
                <tr><td>Net sale proceeds</td><td>{fmt(exr.netSaleProceeds)}</td></tr>
                <tr><td>Interest added over six months</td><td>{fmt(exr.capitalisedInterest)}</td></tr>
                <tr><td>Peak debt</td><td>{fmt(exr.peakDebt)} ({exr.peakLvr}% of {fmt(exr.combinedValue)})</td></tr>
                <tr><td>End debt</td><td>{fmt(exr.endDebt)}</td></tr>
                <tr><td>Monthly repayment on the end debt</td><td>{fmt(exr.monthlyRepayment)}</td></tr>
              </tbody>
            </table>
          </div>

          <Callout variant="info" title="The figure that moves everything">
            <p>
              Change the sale price by 5% and the end debt moves by about {fmt(ex.salePrice * 0.05)}. Lenders value your
              current home for the application, so an appraisal from an agent who sells in your street is worth having
              before you apply. <a href="#appraisal-form">Get a free appraisal</a> with the form above.
            </p>
          </Callout>

          <h2>What this calculator doesn&rsquo;t do</h2>
          <ul>
            <li>It doesn&rsquo;t test whether your income covers the end debt. Use the <Link href="/borrowing-power-calculator">borrowing power calculator</Link> for that.</li>
            <li>It charges interest on the part of the loan the sale repays, the method Westpac publishes. Bendigo Bank charges it on the whole loan for the new home, and CBA asks you to show you can pay interest only on the total debt.</li>
            <li>It doesn&rsquo;t include extension fees or a higher rate if the sale takes longer than the bridging term.</li>
            <li>It doesn&rsquo;t model buying off the plan or building, where bridging can run longer.</li>
          </ul>
          <p>
            Which banks offer bridging, their terms and their published rates are in the{" "}
            <Link href="/guides/bridging-loans-guide#which-banks">bank-by-bank table</Link>. For how bridging works, the
            risks and the alternatives, read the{" "}
            <Link href="/guides/bridging-loans-guide">bridging loans guide</Link>.
          </p>
        </>
      }
    />
  );
}
