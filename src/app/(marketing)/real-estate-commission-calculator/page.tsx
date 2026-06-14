import type { Metadata } from "next";
import Link from "next/link";
import { CommissionCalculator } from "@/components/calculators/CommissionCalculator";
import { CalculatorPageLayout, type CalculatorPageFrontmatter } from "@/components/calculators/CalculatorPageLayout";
import { type FaqItem, type RelatedGuide } from "@/components/guide";
import { SITE_URL } from "@/lib/constants";

const FRONTMATTER: CalculatorPageFrontmatter = {
  title: "Real Estate Commission Calculator",
  description:
    "Work out what an agent will cost on your sale: commission by state, marketing, conveyancing and your estimated net proceeds. Typical rates pre-filled for every state.",
  slug: "real-estate-commission-calculator",
  schemaName: "Real Estate Commission Calculator",
  schemaDescription:
    "Calculate Australian real estate agent commission and total selling costs by state, with estimated net proceeds.",
  updatedAt: "2026-06-10",
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
      "Most Australian agents charge between 1.6% and 3.25% of the sale price, with the national average sitting near 2% to 2.5%. Metro suburbs with strong competition sit at the low end (Sydney and Melbourne often 1.6% to 2.2%), while regional areas and smaller markets like Tasmania run higher (2.5% to 3.25%).",
  },
  {
    question: "Does agent commission include GST?",
    answer:
      "Not always, and it matters. A 2.5% rate quoted excluding GST is really 2.75% all-in. Always ask whether a quoted rate includes GST and get it in writing in the agency agreement before you sign.",
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
      "Platforms like OpenAgent and LocalAgentFinder are free for sellers but charge the agent a referral fee, typically 20% to 30% of their commission, or a flat fee around 0.4% of the sale price. Some top agents refuse to pay these fees, so platform shortlists don't always show the best agents in your suburb. It costs nothing to also ask around locally.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Free selling guide (PDF)",            href: "/selling-guide",                                description: "Costs, agent selection and a 12-week selling plan, personalised to your suburb." },
  { title: "Real estate agent fees in Australia", href: "/guides/real-estate-agent-fees-australia",      description: "The full state-by-state breakdown of what agents charge and why." },
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

          <h3>Typical commission rates by state (2026)</h3>
          <p>
            Rates vary more by location than by anything else. Competitive
            metro markets run cheaper than regional ones because more agents
            are fighting for each listing.
          </p>
          <ul>
            <li><Link href="/guides/real-estate-commission-nsw"><strong>NSW:</strong></Link> 1.8% to 2.5%, Sydney metro often under 2%</li>
            <li><Link href="/guides/real-estate-commission-vic"><strong>VIC:</strong></Link> 1.6% to 2.5%, Melbourne metro the cheapest market in the country</li>
            <li><Link href="/guides/real-estate-commission-qld"><strong>QLD:</strong></Link> 2.3% to 2.9%</li>
            <li><Link href="/guides/real-estate-commission-sa"><strong>SA:</strong></Link> 1.8% to 2.75%</li>
            <li><Link href="/guides/real-estate-commission-wa"><strong>WA:</strong></Link> 2% to 2.8%</li>
            <li><Link href="/guides/real-estate-commission-tas"><strong>TAS:</strong></Link> 2.5% to 3.25%, the highest typical rates in Australia</li>
            <li><Link href="/guides/real-estate-commission-nt"><strong>NT:</strong></Link> 2.4% to 2.7%</li>
            <li><Link href="/guides/real-estate-commission-act"><strong>ACT:</strong></Link> 1.8% to 2.25%</li>
          </ul>

          <h3>Commission is not the number that matters most</h3>
          <p>
            A cheap agent who sells your home for $20,000 under its potential
            costs you far more than the 0.4% you saved on commission. On an
            $850,000 sale, the gap between a 1.8% and a 2.2% rate is $3,400.
            The gap between a strong negotiator and a weak one is routinely
            ten times that. Compare agents on recent comparable sales and
            days on market first, then negotiate the rate with the one you
            want.
          </p>

          <h3>The costs beyond commission</h3>
          <p>
            Plan for 3% to 5% of the sale price all-in once you add
            marketing ($2,000 to $10,000 depending on portal tier and
            photography), conveyancing ($800 to $2,500), and any styling,
            repairs or lender discharge fees. The calculator above gives you
            the full picture, and our free selling guide breaks down where
            each dollar goes and which ones you can claw back.
          </p>
        </>
      }
    />
  );
}
