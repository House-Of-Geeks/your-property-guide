import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import { CommissionCalculator } from "@/components/calculators/CommissionCalculator";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { type FaqItem, type RelatedGuide } from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { STATE_RATES, type StateCode } from "@/lib/data/commission-rates";
import { SELLING_COSTS_AS_AT, money, sellingCostTable } from "@/lib/data/selling-costs";

// Every rate on this page comes from commission-rates.ts (our compiled market
// figures, the table the calculator itself uses), so the FAQ, the explainer
// and the widget can't disagree (search and conversion baseline, 20 Oct 2026).
const STATE_ORDER: StateCode[] = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"];
const RATE_LOW = Math.min(...STATE_ORDER.map((s) => STATE_RATES[s].low));
const RATE_HIGH = Math.max(...STATE_ORDER.map((s) => STATE_RATES[s].high));
const PRICE = 800_000;
const RATE = 2;
const FEE = money(Math.round((PRICE * RATE) / 100));
const FEE_GST = money(Math.round((PRICE * RATE * 1.1) / 100));
const OTHER_LINES = sellingCostTable("NSW").lines;
const otherLine = (key: string) => OTHER_LINES.find((l) => l.key === key)!;

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Real Estate Commission Calculator",
  description:
    "Work out what an agent will cost on your sale: commission by state, marketing, conveyancing and your estimated net proceeds. Typical rates pre-filled for every state.",
  slug: "real-estate-commission-calculator",
  schemaName: "Real Estate Commission Calculator",
  schemaDescription:
    "Calculate Australian real estate agent commission and total selling costs by state, with estimated net proceeds.",
  updatedAt: "2026-10-20",
  persona: "selling",
};

const META_TITLE = "Real Estate Commission Calculator Australia: Costs by State";
const META_DESCRIPTION =
  "Free real estate commission calculator for Australia. Typical agent rates by state, total selling costs and your net proceeds. No sign-up.";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/${FRONTMATTER.slug}` },
  openGraph: { ...DEFAULT_OG,
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
      `There's no official average, because no state sets commission. Our compiled state figures (${SELLING_COSTS_AS_AT}) put typical rates between ${RATE_LOW}% and ${RATE_HIGH}% of the sale price, with typical rates of about ${STATE_RATES.NSW.typical}% in NSW, ${STATE_RATES.VIC.typical}% in Victoria, ${STATE_RATES.QLD.typical}% in Queensland and ${STATE_RATES.TAS.typical}% in Tasmania. At ${RATE}% on an ${money(PRICE)} sale that's ${FEE}, or ${FEE_GST} if the rate is quoted before GST.`,
  },
  {
    question: "Does agent commission include GST?",
    answer:
      "Not always, and it matters. A 2.5% rate quoted excluding GST is really 2.75% all-in. Always ask whether a quoted rate includes GST and get it in writing in the agency agreement before you sign.",
  },
  {
    question: "How do you calculate real estate commission?",
    answer:
      `Multiply the sale price by the rate, then add GST if the rate was quoted without it. At ${RATE}% on ${money(PRICE)}: ${money(PRICE)} × ${RATE}% = ${FEE}, plus 10% GST = ${FEE_GST}. For a tiered rate, work each band separately: for example 2% up to an agreed price and a higher rate on anything above it. Marketing is billed on top.`,
  },
  {
    question: "Is real estate commission negotiable?",
    answer:
      "Yes. Commission is set by agreement, not regulation, in every state. Agents expect to be negotiated with, especially on higher-value properties where the dollar figure is large. Comparing two or three agents and asking each to justify their rate is the single most effective negotiation tactic.",
  },
  {
    question: "What is a tiered or incentive commission?",
    answer:
      "A structure where the agent earns a base rate up to an agreed price, then a higher percentage on anything above it. For example 2% up to $800,000 and 10% of anything over. Done well it aligns the agent's interest with yours; done badly it rewards an agent for lowballing the threshold. The threshold should sit above the honest expected price, not below it.",
  },
  {
    question: "Do I pay commission if my house doesn't sell?",
    answer:
      "Usually no, commission is payable on a successful sale. But marketing costs are typically payable whether or not the property sells, and some agreements include other charges. Read the agency agreement for what is payable if you withdraw or the listing expires.",
  },
  {
    question: "What do agent comparison websites charge?",
    answer:
      "Agent comparison sites are usually free for sellers. Many are paid by the agent, often as a share of the agent's commission when the property sells, so check how any site you use is paid before you rely on its shortlist. We take no share of commission: the one agent we introduce pays us a flat fee for the introduction, and it doesn't change what you pay them.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Free selling guide (PDF)",            href: "/selling-guide",                                description: "Costs, agent selection and a 12-week selling plan, personalised to your suburb." },
  { title: "Real estate agent fees in Australia", href: "/guides/real-estate-agent-fees-australia",      description: "The full state-by-state breakdown of what agents charge and why." },
  { title: "Selling costs calculator",            href: "/selling-costs-calculator",                     description: "Every cost of selling, with GST and your net proceeds." },
  { title: "How to choose a selling agent",       href: "/guides/how-to-choose-a-selling-agent",         description: "What actually predicts a good agent, beyond the rate." },
  { title: "How to sell a house in Australia",    href: "/guides/how-to-sell-a-house-australia",         description: "The whole process, from appraisal to settlement." },
  { title: "CGT calculator",                      href: "/cgt-calculator",                               description: "Selling an investment property? Estimate the tax on your gain." },
  { title: "Stamp duty calculator",               href: "/stamp-duty-calculator",                        description: "Buying your next place? What the government takes on the way in." },
];

export default function CommissionCalculatorPage() {
  return (
    <CalculatorPageLayout
      frontmatter={FRONTMATTER}
      calculator={<CommissionCalculator showGuideCta={false} />}
      faqs={FAQS}
      related={RELATED}
      explainer={
        <>
          <h2>How real estate commission works in Australia</h2>
          <p>
            Commission is your sale price multiplied by the agreed rate: at {RATE}% on an {money(PRICE)} sale that&rsquo;s{" "}
            {FEE}, or {FEE_GST} if the rate is quoted before GST. The rate is agreed in writing in the agency agreement
            before the property goes to market. No government body sets it in any state, so what you pay comes down to
            your suburb, your property and how well you negotiate.
          </p>

          <h3>Typical commission rates by state (2026)</h3>
          <p>
            These are our compiled market figures ({SELLING_COSTS_AS_AT}), the same ones the calculator above pre-fills.
            They are a starting point for comparing quotes, not a published survey.
          </p>
          <ul>
            {STATE_ORDER.map((s) => (
              <li key={s}>
                <Link href={`/guides/real-estate-commission-${s.toLowerCase()}`}><strong>{s}:</strong></Link>{" "}
                {STATE_RATES[s].low}% to {STATE_RATES[s].high}%, typically about {STATE_RATES[s].typical}%
              </li>
            ))}
          </ul>

          <h3>Commission is not the number that matters most</h3>
          <p>
            On an $850,000 sale, the gap between a 1.8% and a 2.2% rate is $3,400. An agent who sells for even 1% less
            than another ($8,500) costs you more than that saving. Judge an agent on recent comparable sales and days
            on market first, then negotiate the rate with the one you want. The{" "}
            <Link href="/tools/agent-proposal-worksheet">agent proposal worksheet</Link> compares up to three quotes at
            the same expected sale price.
          </p>

          <h3>The costs beyond commission</h3>
          <p>
            Commission is most of the bill, not all of it. Add marketing ({money(otherLine("marketing").low)} to{" "}
            {money(otherLine("marketing").high)} in our indicative ranges), conveyancing ({money(otherLine("conveyancing").low)}{" "}
            to {money(otherLine("conveyancing").high)}), the legal documents your state requires, and any auctioneer,
            styling or mortgage discharge fees. The{" "}
            <Link href="/selling-costs-calculator">selling costs calculator</Link> adds every line, with GST and your
            loan payout, and shows what you walk away with; the{" "}
            <Link href="/guides/cost-of-selling-a-house-australia">cost of selling guide</Link> explains each one.
          </p>
        </>
      }
    />
  );
}
