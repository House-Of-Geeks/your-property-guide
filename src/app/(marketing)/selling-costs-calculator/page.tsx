import type { Metadata } from "next";
import Link from "next/link";
import { SellingCostsCalculator } from "@/components/calculators/SellingCostsCalculator";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { ScrollTable, Sources, type FaqItem, type RelatedGuide } from "@/components/guide";
import { commissionSourceItems } from "@/components/guide/CommissionRateTable";
import { SITE_URL } from "@/lib/constants";
import { COMMISSION_AS_AT, COMMISSION_SOURCE_LIST, STATE_ORDER, STATE_RATES, nationalRange, pct } from "@/lib/data/commission-rates";
import { COST_OF_SELLING_STATE, COST_OF_SELLING_STATES } from "@/lib/data/cost-of-selling-state";
import { CONVEYANCING, MARKETING, STATE_DOCUMENTS, lineRange, money, nationalSellingCost, sellingCostTable } from "@/lib/data/selling-costs";

// Every figure on this page comes from the shared selling-cost and
// commission data (commercial-intent review, 10 Oct 2026, selling 0.3, 0.6d, P6).
const PRICE = 800_000;
const COST = nationalSellingCost(PRICE);
const N = nationalRange();
const STATE_TABLES = COST_OF_SELLING_STATES.map((s) => sellingCostTable(s, PRICE));
const docs = STATE_ORDER.map((s) => STATE_DOCUMENTS[s]);
const DOCS_LOW = Math.min(...docs.map((d) => d.low));
const DOCS_HIGH = Math.max(...docs.map((d) => d.high));
// The dollar gap between each state's lowest and highest published rate on a $900,000 sale.
const GAPS = STATE_ORDER.map((s) => Math.round((900_000 * (STATE_RATES[s].high - STATE_RATES[s].low)) / 100));

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Selling Costs Calculator",
  description:
    "Every cost of selling a house in one place: agent commission with GST, marketing, conveyancing, your state's legal documents, styling, the auctioneer, your mortgage payout and discharge fee, and the cash you walk away with.",
  slug: "selling-costs-calculator",
  schemaName: "Selling Costs Calculator",
  schemaDescription:
    "Calculate the total cost of selling a house in Australia by state, including commission, GST, marketing, conveyancing, legal documents and mortgage payout, with net proceeds.",
  updatedAt: "2026-10-11",
  persona: "selling",
};

const META_TITLE = "Selling Costs Calculator: Cost to Sell a House by State";
const META_DESCRIPTION =
  "Free selling costs calculator. Commission by state with GST, marketing, conveyancing, legal documents, auctioneer and mortgage payout, with your net proceeds at settlement.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/${FRONTMATTER.slug}` },
  openGraph: { url: `${SITE_URL}/${FRONTMATTER.slug}`, title: META_TITLE, description: META_DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image" },
};

const FAQS: FaqItem[] = [
  {
    question: "What does it cost to sell a house in Australia?",
    answer:
      `On an $800,000 sale, ${money(COST.low)} to ${money(COST.high)} before GST on the commission (${COST.lowPct}% to ${COST.highPct}% of the price) and before any capital gains tax, or ${money(COST.lowWithGst)} to ${money(COST.highWithGst)} with GST. Commission is the largest line, with published averages and medians of ${pct(N.low)} to ${pct(N.high)} depending on the state and the area, then marketing (${lineRange(MARKETING)}), conveyancing (${lineRange(CONVEYANCING)}), the legal documents your state requires (${money(DOCS_LOW)} to ${money(DOCS_HIGH)}), and an auctioneer or mortgage discharge fee where they apply. The non-commission lines are indicative ranges.`,
  },
  {
    question: "Is GST charged on real estate commission?",
    answer:
      "Yes, at 10% (ATO), so a 2% rate quoted before GST costs 2.2% once it is added. Quotes vary on whether they include it; in Queensland the Form 6 that appoints the agent states the commission as a GST-inclusive amount (REIQ). The calculator adds 10% unless you tell it the quoted rate already includes GST. Check the agency agreement for the dollar figure.",
  },
  {
    question: "Which costs do I pay even if the house does not sell?",
    answer:
      "Marketing, in every state, because the agent has spent it on your behalf. Conveyancing work already done and the state documents (a Section 32, Form 1 or Form 2, or contract searches) are also sunk. Commission is normally payable only on a sale, unless the agreement says otherwise.",
  },
  {
    question: "Does the seller pay stamp duty?",
    answer:
      "No. Stamp duty (transfer duty) is paid by the buyer in every state and territory. The seller's government charges are limited to the land registry fee to discharge a mortgage and, for an investment property, capital gains tax.",
  },
  {
    question: "How do I calculate the cost of selling a house?",
    answer:
      `Add five lines: commission (the sale price times the rate, plus 10% GST if the quote excludes it), marketing, conveyancing, your state's pre-sale documents, and an auctioneer and mortgage discharge fee if they apply. At 2% on $800,000, commission is $16,000, or $17,600 with GST; add an indicative ${lineRange(MARKETING)} of marketing and ${lineRange(CONVEYANCING)} of conveyancing. Then subtract your loan payout from the price for the cash you keep. The calculator above does each step for your state.`,
  },
  {
    question: "Why does the calculator ask for my loan balance?",
    answer:
      "Because the number sellers actually care about is what lands in their account. The loan is paid out at settlement from the sale proceeds, and if it was a fixed-rate loan the lender may add a break cost that can exceed every other selling cost combined. Ask the lender for the payout figure before you list.",
  },
  {
    question: "What is not included?",
    answer:
      "Capital gains tax on an investment property (use the CGT calculator), rates, water and body corporate adjustments at settlement, which can go either way, removalists, and the 15% foreign resident capital gains withholding that applies if you settle without an ATO clearance certificate.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "The cost of selling a house in Australia", href: "/guides/cost-of-selling-a-house-australia", description: "Every cost line explained, with a table by state." },
  { title: "Real estate commission calculator", href: "/real-estate-commission-calculator", description: "The agent's fee on its own, by state." },
  { title: "How to negotiate agent commission", href: "/guides/how-to-negotiate-real-estate-agent-commission", description: "The line you can move, and how." },
  { title: "Fixed fee vs commission agents", href: "/guides/fixed-fee-vs-commission-real-estate-agents", description: "Which model costs less on your sale." },
  { title: "CGT calculator", href: "/cgt-calculator", description: "Selling an investment property? Estimate the tax on your gain." },
  { title: "Free selling guide (PDF)", href: "/selling-guide", description: "Costs, agent selection and a 12-week plan, personalised to your suburb." },
];

export default function SellingCostsCalculatorPage() {
  return (
    <CalculatorPageLayout
      frontmatter={FRONTMATTER}
      calculator={<SellingCostsCalculator />}
      faqs={FAQS}
      related={RELATED}
      explainer={
        <>
          <h2>How the cost of selling a house adds up</h2>
          <p>
            Commission gets the attention, but it is one of seven or eight lines on the bill, and the others together
            often add another 1% of the price. The calculator above works through each one for your state and shows the
            cash left after the loan is paid out, which is the figure that decides whether the move stacks up.
          </p>
          <h2 id="by-state">What it costs to sell an $800,000 house, by state</h2>
          <p>
            Every state&rsquo;s cost table worked at the same price. Low end: private treaty, no mortgage, every line at the
            bottom of its range. High end: auction with a mortgage, every line at the top. Totals are before GST on the
            commission.
          </p>
          <ScrollTable label="Cost of selling an $800,000 house by state">
            <table>
              <thead>
                <tr>
                  <th>State</th>
                  <th>Commission</th>
                  <th>Pre-sale documents</th>
                  <th>Total</th>
                  <th>With GST on commission</th>
                </tr>
              </thead>
              <tbody>
                {STATE_TABLES.map((t) => (
                  <tr key={t.state}>
                    <td><Link href={`/guides/${COST_OF_SELLING_STATE[t.state].slug}`}><strong>{t.stateName.replace(/^the /, "")}</strong></Link></td>
                    <td>{pct(t.commission.low)} to {pct(t.commission.high)}<br /><small>{money(t.commission.lowAmount)} to {money(t.commission.highAmount)}</small></td>
                    <td>{money(t.documents.low)} to {money(t.documents.high)}</td>
                    <td>{money(t.totalLow)} to {money(t.totalHigh)}<br /><small>{t.totalLowPct}% to {t.totalHighPct}%</small></td>
                    <td>{money(t.totalLowWithGst)} to {money(t.totalHighWithGst)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollTable>
          <p>
            <small>
              As at {COMMISSION_AS_AT}. Commission is each state&rsquo;s range of published averages and medians, footnoted on
              its state guide and listed below. Marketing ({lineRange(MARKETING)}), conveyancing ({lineRange(CONVEYANCING)}),
              documents, auctioneer and discharge are indicative ranges: each is quoted individually and no state publishes a
              survey.
            </small>
          </p>
          <h3>The lines people forget</h3>
          <p>
            The mortgage discharge fee is small, but a fixed-rate break cost is not, and neither appears on the agent&rsquo;s
            quote. Styling is optional and often worth it, but it is paid up front. In Queensland a pool safety certificate
            and interconnected smoke alarms are required at sale; in WA, hard-wired smoke alarms and RCDs; in the ACT,
            the seller pays for the building, pest and energy reports before advertising. Each state guide linked above
            lists what applies.
          </p>
          <h3>What moves the total</h3>
          <p>
            The rate, first: on a $900,000 sale every 0.1% is $900, and the gap between a state&rsquo;s lowest and highest
            published rate runs from {money(Math.min(...GAPS))} to {money(Math.max(...GAPS))} across the states. The marketing schedule second, because it is payable whether or not the property
            sells. Everything else is a few hundred dollars either way. Our{" "}
            <Link href="/guides/how-to-negotiate-real-estate-agent-commission">negotiation guide</Link> covers the first and
            our <Link href="/guides/real-estate-agency-agreements-by-state">agency agreements guide</Link> the second.
          </p>
          <Sources
            items={[
              ...commissionSourceItems(COMMISSION_SOURCE_LIST),
              ...STATE_ORDER.map((s) => ({ label: `${STATE_DOCUMENTS[s].source.label} (${s} pre-sale documents)`, href: STATE_DOCUMENTS[s].source.href })),
            ]}
          />
        </>
      }
    />
  );
}
