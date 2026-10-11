import type { Metadata } from "next";
import Link from "next/link";
import { CommissionCalculator } from "@/components/calculators/CommissionCalculator";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { Sources, type FaqItem, type RelatedGuide } from "@/components/guide";
import { NationalCommissionTable } from "@/components/guide/CommissionRateTable";
import { SITE_URL } from "@/lib/constants";
import {
  COMMISSION_SOURCES,
  nationalRange,
  pct,
  rateAgainstAverages,
} from "@/lib/data/commission-rates";
import { CONVEYANCING, MARKETING, lineRange, nationalSellingCost } from "@/lib/data/selling-costs";

// Every figure on this page comes from src/lib/data/commission-rates.ts and
// selling-costs.ts (commercial-intent review, 10 Oct 2026, selling 0.3, 0.8, 0.11, P4).
const N = nationalRange();
const COST = nationalSellingCost(800_000);
const money = (n: number) => `$${n.toLocaleString("en-AU")}`;

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Real Estate Commission Calculator",
  description:
    "Work out what an agent will cost on your sale: commission by state with GST, marketing, conveyancing and your net proceeds.",
  slug: "real-estate-commission-calculator",
  schemaName: "Real Estate Commission Calculator",
  schemaDescription:
    "Calculate Australian real estate agent commission and total selling costs by state, with estimated net proceeds.",
  updatedAt: "2026-10-11",
  persona: "selling",
};

const META_TITLE = "Real Estate Commission Calculator Australia: Costs by State";
const META_DESCRIPTION =
  "Free real estate commission calculator for Australia. Typical agent rates by state, total selling costs and your net proceeds. No sign-up.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/${FRONTMATTER.slug}` },
  openGraph: {
    url: `${SITE_URL}/${FRONTMATTER.slug}`,
    title: META_TITLE,
    description: META_DESCRIPTION,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const FAQS: FaqItem[] = [
  {
    question: "What is the average real estate commission in Australia?",
    answer:
      `Published averages and medians run from ${pct(N.low)} (${N.lowWhere}) to ${pct(N.high)} (${N.highWhere}). OpenAgent's state averages run from ${pct(N.averageLow)} in the ACT to ${pct(N.averageHigh)} in Queensland (September 2026), and bRight Agent's national median across more than 200 postcodes is ${pct(N.nationalMedian)} (February 2026). Capital cities sit at the low end and regional areas at the high end; the table on this page gives every state.`,
  },
  {
    question: "Does agent commission include GST?",
    answer:
      "Not always, and it matters. A 2.5% rate quoted excluding GST is 2.75% once 10% GST is added. The calculator adds it unless you tell it the quote includes GST. Always ask whether a quoted rate includes GST and get it in writing in the agency agreement before you sign.",
  },
  {
    question: "Is real estate commission negotiable?",
    answer:
      "Yes. Commission is set by agreement, not regulation, in every state. Agents expect to be negotiated with, especially on higher-value properties where the dollar figure is large. Comparing two or three agents and asking each to justify their rate is the single most effective negotiation tactic.",
  },
  {
    question: "Is 2% a good commission?",
    answer:
      `It depends on the state. ${rateAgainstAverages(2)} Judge a quote in dollars as well as percent: on $800,000 each 0.1% is $800 before GST, and compare what each agent includes in the fee.`,
  },
  {
    question: "Do I pay commission if my house doesn't sell?",
    answer:
      "Usually no, commission is payable on a successful sale. But marketing costs are typically payable whether or not the property sells, and some agreements include other charges. Read the agency agreement for what is payable if you withdraw or the listing expires.",
  },
  {
    question: "How do you calculate a commission?",
    answer:
      "Multiply the sale price by the agreed rate, then add 10% GST if the quote excludes it. $800,000 at 2% is $16,000, plus $1,600 GST, $17,600 in total. On a tiered agreement, apply each rate only to its slice of the price: 2% up to $800,000 and 10% of anything above it on an $850,000 sale is $16,000 plus $5,000, $21,000 before GST. GST is 10% on most services (ATO), and a Queensland appointment form states the commission as a GST-inclusive amount (REIQ).",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Free selling guide (PDF)",            href: "/selling-guide",                                description: "Costs, agent selection and a 12-week selling plan, personalised to your suburb." },
  { title: "Real estate agent fees in Australia", href: "/guides/real-estate-agent-fees-australia",      description: "The full state-by-state breakdown of what agents charge and why." },
  { title: "Selling costs calculator",            href: "/selling-costs-calculator",                     description: "Every selling cost, with net proceeds after your loan." },
  { title: "How to choose a selling agent",       href: "/guides/how-to-choose-a-selling-agent",         description: "What actually predicts a good agent, beyond the rate." },
  { title: "How to sell a house in Australia",    href: "/guides/how-to-sell-a-house-australia",         description: "The whole process, from appraisal to settlement." },
  { title: "CGT calculator",                      href: "/cgt-calculator",                               description: "Selling an investment property? Estimate the tax on your gain." },
  { title: "Stamp duty calculator",               href: "/stamp-duty-calculator",                        description: "Buying your next place? What the government takes on the way in." },
];

export default function CommissionCalculatorPage() {
  return (
    <CalculatorPageLayout
      frontmatter={FRONTMATTER}
      calculator={<CommissionCalculator />}
      faqs={FAQS}
      related={RELATED}
      explainer={
        <>
          <h2>How real estate commission works in Australia</h2>
          <p>
            Agent commission is a percentage of your final sale price, agreed
            in writing before the property goes to market. It is not set by
            any government body in any state, so the rate you pay comes down
            to your suburb, your property, and how well you negotiate.
          </p>

          <h2 id="by-state">Commission by state on an $800,000 sale</h2>
          <p>
            Rates vary more by location than by anything else: capital cities generally run lower than regional areas. The table gives
            each state&rsquo;s published averages and median, and the commission at its state average on an $800,000 sale,
            before and with GST. Every figure is footnoted to its source.
          </p>
          <NationalCommissionTable price={800_000} />

          <h2 id="how-to-calculate">How to calculate real estate commission</h2>
          <p>
            Multiply the sale price by the rate, then add 10% GST if the quote excludes it:{" "}
            <strong>sale price &times; rate = commission</strong>. At 2%, an $800,000 sale is $16,000 in commission, plus
            $1,600 GST, $17,600 in total.
          </p>
          <p>
            A tiered agreement applies each rate only to its slice of the price. With 2% up to $800,000 and 10% of
            anything above it, an $850,000 sale is $16,000 plus $5,000, $21,000 before GST. Set any threshold at or above
            the honest expected price, or the structure rewards a low estimate. In Queensland the appointment form (Form 6)
            states the commission as a GST-inclusive amount, so check the dollar figure on the form.
          </p>

          <h3>Commission is not the only number that matters</h3>
          <p>
            On an $850,000 sale, the gap between a 1.8% and a 2.2% rate is $3,400 before GST. Compare agents on recent
            comparable sales and days on market first, then negotiate the rate with the one you want. Our{" "}
            <Link href="/guides/real-estate-agent-fees-australia">real estate agent fees guide</Link> covers what the fee
            includes in each state.
          </p>

          <h3>The costs beyond commission</h3>
          <p>
            On an $800,000 sale, every state&rsquo;s cost table adds up to {money(COST.low)} to {money(COST.high)} before GST
            on the commission ({COST.lowPct}% to {COST.highPct}% of the price), once you add marketing ({lineRange(MARKETING)},
            an indicative range), conveyancing ({lineRange(CONVEYANCING)}), your state&rsquo;s documents and any auctioneer or
            discharge fee. For{" "}
            <Link href="/selling-costs-calculator">every selling cost, with net proceeds</Link> after your loan, use the
            selling costs calculator; the{" "}
            <Link href="/guides/cost-of-selling-a-house-australia">cost of selling guide</Link> explains each line.
          </p>
          <Sources
            items={[
              { label: `[${COMMISSION_SOURCES["ato-gst"].n}] ${COMMISSION_SOURCES["ato-gst"].label}`, href: COMMISSION_SOURCES["ato-gst"].href, note: COMMISSION_SOURCES["ato-gst"].date },
              { label: `[${COMMISSION_SOURCES.reiq.n}] ${COMMISSION_SOURCES.reiq.label}`, href: COMMISSION_SOURCES.reiq.href, note: COMMISSION_SOURCES.reiq.date },
              "Rates: the footnotes under the state table. Marketing and conveyancing are indicative ranges quoted individually by suppliers; no state publishes a survey.",
            ]}
          />
        </>
      }
    />
  );
}
