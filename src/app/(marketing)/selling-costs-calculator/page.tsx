import type { Metadata } from "next";
import Link from "next/link";
import { SellingCostsCalculator } from "@/components/calculators/SellingCostsCalculator";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { type FaqItem, type RelatedGuide } from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { STATE_RATES } from "@/lib/data/commission-rates";
import { COST_OF_SELLING_STATE, COST_OF_SELLING_STATES } from "@/lib/data/cost-of-selling-state";
import { sellingCostTable } from "@/lib/data/selling-costs";

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Selling Costs Calculator",
  description:
    "Every cost of selling a house in one place: agent commission with GST, marketing, conveyancing, your state's legal documents, styling, the auctioneer, your mortgage payout and discharge fee, and the cash you walk away with.",
  slug: "selling-costs-calculator",
  schemaName: "Selling Costs Calculator",
  schemaDescription:
    "Calculate the total cost of selling a house in Australia by state, including commission, GST, marketing, conveyancing, legal documents and mortgage payout, with net proceeds.",
  updatedAt: "2026-09-20",
  persona: "selling",
};

const META_TITLE = "Selling Costs Calculator Australia: Total Cost to Sell a House by State";
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
      "Typically 2% to 4% of the sale price before any capital gains tax. Commission is the largest line at 1.6% to 3.25% depending on the state, then marketing ($2,000 to $8,000), conveyancing ($800 to $2,500), the legal documents your state requires ($100 to $1,500), and an auctioneer or mortgage discharge fee where they apply. On an $800,000 sale that is roughly $17,000 to $36,000.",
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
