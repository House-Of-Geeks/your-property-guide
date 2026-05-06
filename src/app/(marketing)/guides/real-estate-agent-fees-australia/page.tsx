import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Real estate agent fees and commission in Australia (2026)",
  description:
    "What real estate agents charge across Australia: commission rates by state, what's included, marketing costs charged separately, fixed-fee alternatives, and how to negotiate.",
  slug: "real-estate-agent-fees-australia",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
  readingTimeMinutes: 8,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "selling",
};

export const metadata: Metadata = {
  title: `${FRONTMATTER.title} | ${SITE_NAME}`,
  description: FRONTMATTER.description,
  alternates: { canonical: `${SITE_URL}/guides/${FRONTMATTER.slug}` },
  openGraph: {
    url: `${SITE_URL}/guides/${FRONTMATTER.slug}`,
    title: FRONTMATTER.title,
    description: FRONTMATTER.description,
    type: "article",
    publishedTime: FRONTMATTER.publishedAt,
    modifiedTime: FRONTMATTER.updatedAt,
    images: guideOgImages({
      slug: FRONTMATTER.slug,
      title: FRONTMATTER.title,
      description: FRONTMATTER.description,
      persona: FRONTMATTER.persona,
    }),
  },
};

const TLDR = [
  "Australian real estate commission is negotiable and typically ranges from 1.5% to 3.5% of the sale price, depending on state, suburb and property value.",
  "Higher-value properties (above $2M) often achieve commission rates below 1.5% because the absolute dollar amount is large.",
  "Marketing costs (photography, online listings, signboard, styling) are usually charged separately on top of commission and typically run $3,000 to $6,000 for an average home.",
  "Fixed-fee agencies charge $3,000 to $10,000 flat. They can save money on high-value sales but reduce the agent's incentive to negotiate hard for you.",
  "Always interview at least three agents and compare the full package: pricing strategy, marketing plan, suburb track record, not just the commission rate.",
  "An agent who negotiates an extra $20,000 on the sale earns back their commission many times over. Cheapest agent rarely means best return.",
];

const TOC: GuideTOCEntry[] = [
  { id: "how-commission-works", label: "How commission works" },
  { id: "rates-by-state",       label: "Commission rates by state" },
  { id: "whats-included",       label: "What's included in commission" },
  { id: "marketing-costs",      label: "Marketing costs (charged separately)" },
  { id: "fixed-fee",            label: "Fixed fee vs commission" },
  { id: "negotiate",            label: "How to negotiate agent fees" },
  { id: "cheapest-agent",       label: "The risk of choosing the cheapest" },
  { id: "questions",            label: "Questions to ask before signing" },
  { id: "agency-agreement",     label: "Understanding the agency agreement" },
];

const FAQS: FaqItem[] = [
  {
    question: "What's a normal real estate commission in Australia?",
    answer:
      "Typical residential commission ranges from 1.5% to 3.0% of the sale price in most capital cities, with averages around 2.0% in NSW, VIC, SA and ACT, and 2.5% to 3.0% in QLD, WA, TAS and NT. Higher-value properties often achieve lower percentage rates because the dollar amount is large. There's no legislated minimum, everything is negotiable.",
  },
  {
    question: "Is real estate commission paid upfront or at settlement?",
    answer:
      "Almost always at settlement, from the sale proceeds, not upfront. Marketing costs are different, they're often charged either upfront or at the start of the campaign and are usually payable whether or not the property sells. Confirm both points in the agency agreement before signing.",
  },
  {
    question: "Are marketing costs included in commission?",
    answer:
      "No. Commission almost never includes marketing. Photography ($500 to $1,500), online listings on REA and Domain ($800 to $2,000+), signboard ($200 to $600), social ads ($300 to $1,000+) and optional styling ($2,000 to $8,000+) are billed separately. Budget $3,000 to $6,000 total for an average home, more in premium markets.",
  },
  {
    question: "Should I use a fixed-fee agent?",
    answer:
      "Fixed-fee agents charge $3,000 to $10,000 flat instead of a percentage. They can save significantly on high-value properties in strong markets where buyer demand is high. They tend to underperform in slower markets where active negotiation matters, the agent has less incentive to push for a higher price.",
  },
  {
    question: "Can I negotiate commission rates?",
    answer:
      "Yes, almost always. Most vendors don't realise commission is fully negotiable. Get quotes from at least three agents, compare full packages (not just the rate), and consider a tiered or performance-based commission that pays the agent more if they exceed a target price. Don't over-negotiate, shaving 0.2% off a $700,000 sale saves $1,400, and the better agent often makes that back many times.",
  },
  {
    question: "What happens if my property doesn't sell?",
    answer:
      "Commission is generally only payable if the property sells. Marketing costs, however, are usually still owed whether or not it sells. Some agency agreements have additional clauses around campaign extensions, withdrawals, or change of agent, read these carefully before signing. Standard exclusive agreements run 60 to 90 days; longer terms should require strong justification.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "How to Choose a Selling Agent",  href: "/guides/how-to-choose-a-selling-agent", description: "Pick the right agent first, then negotiate the fee." },
  { title: "Sell First or Buy First?",       href: "/guides/sell-first-or-buy-first",       description: "If you're upgrading, the decision tree before you sell." },
  { title: "Free appraisal",                 href: "/appraisal",                            description: "Get a real-world appraisal from a local agent. No commitment." },
  { title: "Property Auction Guide",         href: "/guides/property-auction-guide",        description: "If selling at auction, the rules and dynamics differ." },
  { title: "Conveyancing in Australia",      href: "/guides/conveyancing-guide",            description: "The other professional you'll need on settlement day." },
  { title: "Browse suburbs",                 href: "/suburbs",                              description: "See what your home is worth, by suburb median." },
];

export default function RealEstateAgentFeesPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Get at least three quotes">
        <p>
          Commission rates vary significantly by agent, location, and property
          type. The rates in this guide are indicative ranges only. Always get
          quotes from at least three agents before signing an agency agreement.
        </p>
      </Callout>

      <h2 id="how-commission-works">How real estate commission works</h2>
      <p className="lead">
        When you sell a property through a real estate agent in Australia, you
        pay the agent a <strong>commission</strong>, a percentage of the final
        sale price. Commission is only payable if the property sells (typically
        at settlement), so agents are incentivised to achieve the best possible
        price.
      </p>
      <p>
        Commission is not a fixed dollar amount, it scales with the sale price.
        On a $900,000 home sold at a 2% commission rate, the agent earns
        $18,000. On a $1.5 million property, that&rsquo;s $30,000.
      </p>
      <p>
        In Australia, agent commissions are <strong>negotiable</strong>. There
        is no legislated minimum or maximum. Some agencies use tiered structures
        (e.g. 2.5% on the first $300,000 and 1.5% on the remainder), which can
        be worth negotiating on higher-value properties.
      </p>
      <p>
        Commission is typically paid at settlement from the sale proceeds, you
        don&rsquo;t need to pay upfront.
      </p>

      <h2 id="rates-by-state">Commission rates by state (typical ranges, 2026)</h2>
      <p>
        Commission rates vary significantly by state, suburb, and property type.
        Premium suburbs in capital cities often attract lower percentage rates
        because agents compete more aggressively for high-value listings.
        Regional areas may have higher rates.
      </p>

      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Typical range</th>
            <th>Average</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong>NSW</strong></td><td>1.5% to 3.0%</td><td>~2.0%</td></tr>
          <tr><td><strong>VIC</strong></td><td>1.6% to 2.5%</td><td>~2.0%</td></tr>
          <tr><td><strong>QLD</strong></td><td>2.0% to 3.5%</td><td>~2.5%</td></tr>
          <tr><td><strong>WA</strong></td><td>2.5% to 3.5%</td><td>~3.0%</td></tr>
          <tr><td><strong>SA</strong></td><td>1.5% to 2.5%</td><td>~2.0%</td></tr>
          <tr><td><strong>TAS</strong></td><td>2.0% to 3.0%</td><td>~2.5%</td></tr>
          <tr><td><strong>NT</strong></td><td>2.5% to 4.0%</td><td>~3.0%</td></tr>
          <tr><td><strong>ACT</strong></td><td>1.5% to 2.5%</td><td>~2.0%</td></tr>
        </tbody>
      </table>

      <Callout variant="info" title="High-value properties achieve lower rates">
        <p>
          On properties above $2M, percentage rates often drop below 1.5%
          because the absolute dollar value of commission is high. The
          headline rate is much less important than the dollar amount, always
          calculate both.
        </p>
      </Callout>

      <h2 id="whats-included">What&rsquo;s included in commission</h2>
      <p>A full-service real estate commission typically includes:</p>
      <ul>
        <li><strong>Appraisal and pricing strategy.</strong> The agent assesses your property and recommends a price range or reserve.</li>
        <li><strong>Property preparation advice.</strong> Guidance on presentation, styling, or minor repairs that could improve sale price.</li>
        <li><strong>Open homes and private inspections.</strong> The agent hosts all inspections and qualifies buyers.</li>
        <li><strong>Negotiation.</strong> The agent negotiates on your behalf with buyers, working to achieve the best possible price and terms.</li>
        <li><strong>Contract coordination.</strong> Working with your conveyancer or solicitor to manage the sales process through to exchange and settlement.</li>
        <li><strong>Communication.</strong> Regular updates on buyer feedback, inspection numbers, and market activity.</li>
      </ul>
      <p>
        Commission does <em>not</em> typically include marketing costs
        (photography, online listings, signboards), these are almost always
        charged separately.
      </p>

      <h2 id="marketing-costs">Marketing costs, charged separately</h2>
      <p>Marketing is one of the most significant additional costs of selling. Expect to pay:</p>
      <ul>
        <li><strong>Photography and video.</strong> $500 to $1,500 for professional photos; $1,500 to $4,000 for video and aerial drone shots.</li>
        <li><strong>Floor plan.</strong> $200 to $500.</li>
        <li><strong>Online listings (REA and Domain).</strong> $800 to $2,000+ depending on the package and listing prominence. Premium listings on realestate.com.au can cost over $2,000 in competitive markets.</li>
        <li><strong>Signboard.</strong> $200 to $600 for a standard board; more for illuminated or custom boards.</li>
        <li><strong>Social media and digital ads.</strong> $300 to $1,000+ depending on reach and targeting.</li>
        <li><strong>Property styling / staging.</strong> $2,000 to $8,000+ if using a professional stylist (optional, but can significantly improve sale price).</li>
      </ul>
      <p>
        For an average family home, expect total marketing costs of $3,000 to
        $6,000. In premium markets, campaigns can easily exceed $10,000.
      </p>

      <KeyFigure
        value="$3k–$6k"
        label="Typical total marketing spend on an average Australian home (photography, listings, signboard, social, optional styling). Charged separately from commission."
        context="Premium markets and styled campaigns run higher"
      />

      <Callout variant="warning" title="Marketing is usually payable whether or not it sells">
        <p>
          Confirm this in the agency agreement before signing. Most marketing
          packages are payable up-front or at the start of the campaign and
          aren&rsquo;t refunded if the property is withdrawn or fails to sell.
        </p>
      </Callout>

      <h2 id="fixed-fee">Fixed fee vs commission</h2>
      <p>
        Some agencies, particularly online or hybrid operators, offer a flat
        fee to sell your property rather than a percentage commission. Typical
        flat fees range from $3,000 to $10,000 depending on the service level.
      </p>
      <p><strong>Advantages of fixed fee:</strong></p>
      <ul>
        <li>Predictable cost upfront</li>
        <li>Significant savings on high-value properties</li>
      </ul>
      <p><strong>Disadvantages of fixed fee:</strong></p>
      <ul>
        <li>Agent has less financial incentive to negotiate hard for you</li>
        <li>Service levels may be reduced (fewer open homes, less negotiation support)</li>
        <li>Often best suited to straightforward properties in strong markets where buyer demand is high</li>
      </ul>
      <p>
        Fixed-fee models can work well in a sellers&rsquo; market. In a slower
        market where active negotiation is critical, a full-commission agent
        may achieve a higher price that more than covers the fee difference.
      </p>

      <h2 id="negotiate">How to negotiate agent fees</h2>
      <p>Most vendors don&rsquo;t realise agent fees are negotiable, but they almost always are. How to negotiate effectively:</p>
      <ol>
        <li><strong>Interview at least three agents.</strong> Getting competing quotes gives you leverage and information. Don&rsquo;t just accept the first number you&rsquo;re given.</li>
        <li><strong>Compare the full package.</strong> Don&rsquo;t compare commission rates alone, compare marketing packages, proposed listing prices, and track records in your suburb.</li>
        <li><strong>Ask about a performance clause.</strong> Some agents will agree to a tiered commission that rewards them more if they achieve above a set price threshold. This aligns their incentives with yours.</li>
        <li><strong>Don&rsquo;t over-negotiate on commission.</strong> Shaving 0.2% off commission on a $700,000 property saves $1,400. If the better agent achieves $15,000 more at auction, it&rsquo;s not worth the saving. Focus on who you think will get you the best price.</li>
        <li><strong>Ask what happens if it doesn&rsquo;t sell.</strong> Understand any conditions in the agency agreement about what happens if the property is passed in or withdrawn.</li>
      </ol>

      <h2 id="cheapest-agent">The risk of choosing the cheapest agent</h2>
      <p>
        Your property is likely your largest asset. Choosing an agent solely
        based on the lowest commission can be a costly mistake.
      </p>
      <ul>
        <li>An agent who negotiates an extra $20,000 on a sale earns back their commission many times over, even if their rate is slightly higher than competitors.</li>
        <li>A low-commission agent who is juggling 50 listings may not give your property the attention it deserves.</li>
        <li>Poor photography, weak marketing, or a low-energy campaign can cost you more in foregone sale price than you saved in commission.</li>
      </ul>
      <p>
        Ask to see recent sales results in your specific suburb, check online
        reviews, and ask for references from recent vendors.
      </p>

      <h2 id="questions">Questions to ask before signing an agency agreement</h2>
      <ul>
        <li>What is your proposed sale price range, and how did you arrive at it?</li>
        <li>What commission rate and marketing package are you proposing?</li>
        <li>What is your average days-on-market for properties in this suburb?</li>
        <li>How many properties are you currently managing? (Too many may mean less attention.)</li>
        <li>How will you run the campaign, auction, private treaty, or expressions of interest?</li>
        <li>Who specifically will be handling my property day-to-day?</li>
        <li>What happens if I want to withdraw the property from sale?</li>
        <li>What are your fees if the property doesn&rsquo;t sell?</li>
      </ul>

      <h2 id="agency-agreement">Understanding the agency agreement</h2>
      <p>The agency agreement is a legally binding contract between you and the agent. Key things to check:</p>
      <ul>
        <li>
          <strong>Exclusive vs open listing.</strong> An exclusive agency agreement
          means only that agent can sell the property during the term. An open
          listing allows multiple agents to market the property. Exclusive
          agreements are the norm for auction campaigns.
        </li>
        <li>
          <strong>Duration.</strong> Most exclusive agreements run for 60 to 90 days.
          Be cautious about signing for more than 90 days without a strong reason.
        </li>
        <li>
          <strong>Cooling-off period.</strong> In most states, you have a short
          cooling-off period (often 1 to 3 days) after signing an agency agreement
          to cancel without penalty. Check your state&rsquo;s rules.
        </li>
        <li>
          <strong>Commission trigger.</strong> Understand exactly when commission
          is payable, usually on unconditional exchange or settlement.
        </li>
        <li>
          <strong>Conjunctional sales.</strong> Some agreements allow the listing
          agent to &ldquo;conjunct&rdquo; with another agent. Understand how
          commission is shared in this case.
        </li>
      </ul>
      <p>
        Always read the full agreement before signing, and ask your conveyancer
        or solicitor to review it if you have any concerns. We have a free{" "}
        <Link href="/appraisal">property appraisal</Link> from a local agent in
        your suburb if you want a starting point on price.
      </p>
    </GuideArticleLayout>
  );
}
