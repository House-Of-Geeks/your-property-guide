import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import { SellingCostsCalculator } from "@/components/calculators/SellingCostsCalculator";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { type FaqItem, type RelatedGuide } from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { STATE_RATES } from "@/lib/data/commission-rates";
import { COST_OF_SELLING_STATE, COST_OF_SELLING_STATES } from "@/lib/data/cost-of-selling-state";
import { SELLING_COSTS_AS_AT, money, sellingCostTable } from "@/lib/data/selling-costs";

// The FAQ's national answer at $800,000, worked state by state from the same
// tables the calculator uses (as /guides/cost-of-selling-a-house-australia
// does), instead of a typed range (search and conversion baseline, 20 Oct 2026).
const PRICE = 800_000;
const COST_LINES = sellingCostTable("NSW").lines;
const costLine = (key: string) => COST_LINES.find((l) => l.key === key)!;
const lowFor = (s: (typeof COST_OF_SELLING_STATES)[number]) =>
  Math.round((PRICE * STATE_RATES[s].low) / 100) + costLine("marketing").low + costLine("conveyancing").low + sellingCostTable(s).documents.low;
const highFor = (s: (typeof COST_OF_SELLING_STATES)[number]) =>
  Math.round((PRICE * STATE_RATES[s].high) / 100) + costLine("marketing").high + costLine("conveyancing").high + sellingCostTable(s).documents.high + costLine("auctioneer").high + costLine("discharge").high;
const TOTAL_LOW = Math.min(...COST_OF_SELLING_STATES.map(lowFor));
const TOTAL_HIGH = Math.max(...COST_OF_SELLING_STATES.map(highFor));
const pctOf = (n: number) => `${Math.round((n / PRICE) * 1000) / 10}%`;
const RATE_LOW = Math.min(...COST_OF_SELLING_STATES.map((s) => STATE_RATES[s].low));
const RATE_HIGH = Math.max(...COST_OF_SELLING_STATES.map((s) => STATE_RATES[s].high));
const DOCS_LOW = Math.min(...COST_OF_SELLING_STATES.map((s) => sellingCostTable(s).documents.low));
const DOCS_HIGH = Math.max(...COST_OF_SELLING_STATES.map((s) => sellingCostTable(s).documents.high));

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Selling Costs Calculator",
  description:
    "Every cost of selling a house in one place: agent commission with GST, marketing, conveyancing, your state's legal documents, styling, the auctioneer, your mortgage payout and discharge fee, and the cash you walk away with.",
  slug: "selling-costs-calculator",
  schemaName: "Selling Costs Calculator",
  schemaDescription:
    "Calculate the total cost of selling a house in Australia by state, including commission, GST, marketing, conveyancing, legal documents and mortgage payout, with net proceeds.",
  updatedAt: "2026-10-20",
  persona: "selling",
};

const META_TITLE = "Selling Costs Calculator Australia: Total Cost to Sell a House by State";
const META_DESCRIPTION =
  "Free selling costs calculator. Commission by state with GST, marketing, conveyancing, legal documents, auctioneer and mortgage payout, with your net proceeds at settlement.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/${FRONTMATTER.slug}` },
  openGraph: { ...DEFAULT_OG, url: `${SITE_URL}/${FRONTMATTER.slug}`, title: META_TITLE, description: META_DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image" },
};

const FAQS: FaqItem[] = [
  {
    question: "What does it cost to sell a house in Australia?",
    answer:
      `On an ${money(PRICE)} sale, about ${money(TOTAL_LOW)} to ${money(TOTAL_HIGH)} (${pctOf(TOTAL_LOW)} to ${pctOf(TOTAL_HIGH)} of the price) before GST on the commission, styling and any capital gains tax, worked state by state from our figures (${SELLING_COSTS_AS_AT}). Commission is the largest line at ${RATE_LOW}% to ${RATE_HIGH}% depending on the state, then marketing (${money(costLine("marketing").low)} to ${money(costLine("marketing").high)}), conveyancing (${money(costLine("conveyancing").low)} to ${money(costLine("conveyancing").high)}), the legal documents your state requires (${money(DOCS_LOW)} to ${money(DOCS_HIGH)}), and an auctioneer or mortgage discharge fee where they apply. Commission is our compiled market range; the other lines are indicative ranges suppliers quote individually.`,
  },
  {
    question: "Is GST charged on real estate commission?",
    answer:
      "Yes. Agents are GST-registered and most quote their rate excluding GST, so a 2% quote is 2.2% all-in. The calculator adds 10% unless you tell it the quoted rate already includes GST. Check the agency agreement; it must state the rate and whether GST is included.",
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
  { title: "The cost of selling a house in Australia", href: "/guides/cost-of-selling-a-house-australia", description: "Every cost line explained, with a worked example." },
  { title: "Real estate commission calculator", href: "/real-estate-commission-calculator", description: "The agent's fee on its own, by state." },
  { title: "How to negotiate agent commission", href: "/guides/how-to-negotiate-real-estate-agent-commission", description: "The line you can move, and how." },
  { title: "Agent proposal worksheet", href: "/tools/agent-proposal-worksheet", description: "Compare up to three agents' proposals at the same expected sale price." },
  { title: "Fixed fee vs commission agents", href: "/guides/fixed-fee-vs-commission-real-estate-agents", description: "Which model costs less on your sale." },
  { title: "CGT calculator", href: "/cgt-calculator", description: "Selling an investment property? Estimate the tax on your gain." },
  { title: "Free selling guide (PDF)", href: "/selling-guide", description: "Costs, agent selection and a 12-week plan, personalised to your suburb." },
];

export default function SellingCostsCalculatorPage() {
  return (
    <CalculatorPageLayout
      frontmatter={FRONTMATTER}
      calculator={<SellingCostsCalculator showGuideCta={false} />}
      faqs={FAQS}
      related={RELATED}
      explainer={
        <>
          <h2>How the cost of selling a house adds up</h2>
          <p>
            On an {money(PRICE)} sale the bill typically runs from about {money(TOTAL_LOW)} to {money(TOTAL_HIGH)}{" "}
            ({pctOf(TOTAL_LOW)} to {pctOf(TOTAL_HIGH)}) before GST on the commission, styling and any capital gains tax,
            worked state by state from our figures ({SELLING_COSTS_AS_AT}). The{" "}
            <Link href="/guides/cost-of-selling-a-house-australia">cost of selling guide</Link> explains every line.
          </p>
          <p>
            Commission gets the attention, but it is one of seven or eight lines on the bill, and the others together
            often add another 1% of the price. The calculator above works through each one for your state and shows the
            cash left after the loan is paid out, which is the figure that decides whether the move stacks up.
          </p>
          <h3>Typical commission and legal documents by state</h3>
          <ul>
            {COST_OF_SELLING_STATES.map((s) => {
              const t = sellingCostTable(s);
              return (
                <li key={s}>
                  <Link href={`/guides/${COST_OF_SELLING_STATE[s].slug}`}><strong>{t.stateName}:</strong></Link>{" "}
                  commission {STATE_RATES[s].low}% to {STATE_RATES[s].high}%; {t.documents.label.toLowerCase()} ${t.documents.low.toLocaleString("en-AU")} to ${t.documents.high.toLocaleString("en-AU")}.
                </li>
              );
            })}
          </ul>
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
            The rate, first: on a $900,000 sale every 0.1% is $900, and the gap between the top and bottom of most states&rsquo;
            ranges is more than $5,000. The marketing schedule second, because it is payable whether or not the property
            sells. Everything else is a few hundred dollars either way. Our{" "}
            <Link href="/guides/how-to-negotiate-real-estate-agent-commission">negotiation guide</Link> covers the first and
            our <Link href="/guides/real-estate-agency-agreements-by-state">agency agreements guide</Link> the second.
          </p>
        </>
      }
    />
  );
}
