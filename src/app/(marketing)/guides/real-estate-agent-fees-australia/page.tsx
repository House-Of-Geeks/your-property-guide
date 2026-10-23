import { DEFAULT_OG } from "@/lib/og/defaults";
import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
  type SourceItem,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { STATE_RATES, type StateCode } from "@/lib/data/commission-rates";

// The state table and every national figure on this page come from
// commission-rates.ts (our compiled market figures, September 2026), the same
// table the calculators read, so the page can't print a range of its own
// (search and conversion baseline, 20 Oct 2026).
const STATE_ORDER: StateCode[] = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"];
const RATE_LOW = Math.min(...STATE_ORDER.map((s) => STATE_RATES[s].low));
const RATE_HIGH = Math.max(...STATE_ORDER.map((s) => STATE_RATES[s].high));
const EXAMPLE_PRICE = 800_000;
const EXAMPLE_RATE = 2;
const aud = (n: number) => `$${Math.round(n).toLocaleString("en-AU")}`;
const EXAMPLE_FEE = aud((EXAMPLE_PRICE * EXAMPLE_RATE) / 100);
const EXAMPLE_FEE_GST = aud((EXAMPLE_PRICE * EXAMPLE_RATE * 1.1) / 100);

const FRONTMATTER: GuideFrontmatter = {
  title: "Real estate agent fees and commission in Australia (2026)",
  description:
    "What real estate agents charge across Australia: commission rates by state, what's included, marketing costs charged separately, fixed-fee alternatives, and how to negotiate.",
  slug: "real-estate-agent-fees-australia",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-20",
  readingTimeMinutes: 8,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "selling",
};

export const metadata: Metadata = {
  title: FRONTMATTER.title,
  description: FRONTMATTER.description,
  alternates: { canonical: `${SITE_URL}/guides/${FRONTMATTER.slug}` },
  openGraph: { ...DEFAULT_OG,
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
  `No state sets real estate commission: it's whatever you agree in the agency agreement. Our compiled state figures (September 2026) put typical rates between ${RATE_LOW}% and ${RATE_HIGH}% of the sale price, depending on the state. At ${EXAMPLE_RATE}% on an ${aud(EXAMPLE_PRICE)} sale that's ${EXAMPLE_FEE}, or ${EXAMPLE_FEE_GST} if the rate is quoted before GST.`,
  "On higher-value homes the commission is large in dollars, so there is usually more room to negotiate the percentage. Compare quotes in dollars, not just as a rate.",
  "Marketing (photography, portal listings, signboard, any styling) is usually charged separately on top of commission. We use $2,000 to $8,000 as an indicative budget, and it's usually payable whether or not the home sells.",
  "Fixed-fee agencies charge $3,000 to $10,000 flat. They can save money on high-value sales but reduce the agent's incentive to negotiate hard for you.",
  "Always interview at least three agents and compare the full package: pricing strategy, marketing plan, suburb track record, not just the commission rate.",
  "An extra $20,000 on the sale more than covers a slightly higher rate (0.25% on $800,000 is $2,000). The cheapest agent is not always the best return.",
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
      `There's no official rate: commission is negotiable and set in the agency agreement. Our compiled state figures (September 2026) put typical residential rates between ${RATE_LOW}% and ${RATE_HIGH}% of the sale price, with a typical rate of about ${STATE_RATES.NSW.typical}% in NSW and ${STATE_RATES.VIC.typical}% in Victoria, ${STATE_RATES.QLD.typical}% in Queensland, ${STATE_RATES.WA.typical}% in WA and ${STATE_RATES.TAS.typical}% in Tasmania. On an ${aud(EXAMPLE_PRICE)} sale at ${EXAMPLE_RATE}%, that's ${EXAMPLE_FEE} before GST. Check whether a quote includes GST.`,
  },
  {
    question: "Is real estate commission paid upfront or at settlement?",
    answer:
      "Almost always at settlement, from the sale proceeds, not upfront. Marketing costs are different, they're often charged either upfront or at the start of the campaign and are usually payable whether or not the property sells. Confirm both points in the agency agreement before signing.",
  },
  {
    question: "Are marketing costs included in commission?",
    answer:
      "No. Commission almost never includes marketing. Photography ($500 to $1,500), online listings on REA and Domain ($800 to $2,000+), signboard ($200 to $600), social ads ($300 to $1,000+) and optional styling ($2,000 to $8,000+) are billed separately. We use $2,000 to $8,000 as an indicative marketing budget before any styling, more in premium markets. These are indicative ranges, quoted individually by agents and suppliers; no published survey sets them.",
  },
  {
    question: "Should I use a fixed-fee agent?",
    answer:
      "Fixed-fee agents charge $3,000 to $10,000 flat instead of a percentage. They can save significantly on high-value properties in strong markets where buyer demand is high. They tend to underperform in slower markets where active negotiation matters, the agent has less incentive to push for a higher price.",
  },
  {
    question: "Can I negotiate commission rates?",
    answer:
      "Yes, almost always. Most vendors don't realise commission is fully negotiable. Get quotes from at least three agents, compare full packages (not just the rate), and consider a tiered or performance-based commission that pays the agent more if they exceed a target price. Don't over-negotiate: shaving 0.2% off a $700,000 sale saves $1,400, and an agent who achieves even 1% more on the price ($7,000) more than covers it. The agent proposal worksheet compares quotes at the same expected sale price.",
  },
  {
    question: "Do real estate agents get paid if the house doesn't sell?",
    answer:
      "Usually not. Most Australian agents work on a no sale, no fee basis, so commission is only payable when the property sells, normally at settlement out of the sale proceeds: at a typical 2% on an $800,000 sale, the $16,000 commission is owed only once the sale completes. Marketing is the exception. Photography, portal listings and styling, typically $2,000 to $8,000, are usually payable whether or not the home sells. The agency agreement sets out both. In NSW, section 55 of the Property and Stock Agents Act 2002 means an agent is not entitled to commission or expenses at all without a written agreement signed by you, and the other states and territories also require the appointment in writing with the commission and expenses set out. Read the commission and marketing terms, along with any campaign-extension, withdrawal or change-of-agent terms, before you sign. Standard exclusive agreements run 60 to 90 days.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Free selling guide (PDF)",       href: "/selling-guide",                        description: "Costs, agent selection and a 12-week selling plan, personalised to your suburb." },
  { title: "Commission calculator",          href: "/real-estate-commission-calculator",    description: "What an agent costs on your sale price, by state." },
  { title: "Selling costs calculator",       href: "/selling-costs-calculator",             description: "Every cost of selling by state, with GST and your net proceeds." },
  { title: "Agent proposal worksheet",       href: "/tools/agent-proposal-worksheet",       description: "Compare up to three agents' proposals at the same expected sale price." },
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
        sale price that you agree in the agency agreement. Our compiled state
        figures put typical rates between {RATE_LOW}% and {RATE_HIGH}%; at{" "}
        {EXAMPLE_RATE}% on an {aud(EXAMPLE_PRICE)} sale that&rsquo;s {EXAMPLE_FEE},
        or {EXAMPLE_FEE_GST} including GST. Commission is usually payable only
        if the property sells (typically at settlement), while marketing is
        usually payable either way.
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
        Commission rates vary by state, suburb and property type, and no state
        sets them. The ranges below are our compiled market figures (September
        2026), the same ones our calculators use. They are a starting point for
        comparing quotes, not a published survey.
      </p>

      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Typical range</th>
            <th>Typical rate</th>
            <th>On {aud(EXAMPLE_PRICE)} at the typical rate</th>
          </tr>
        </thead>
        <tbody>
          {STATE_ORDER.map((s) => (
            <tr key={s}>
              <td><Link href={`/guides/real-estate-commission-${s.toLowerCase()}`}><strong>{s}</strong></Link></td>
              <td>{STATE_RATES[s].low}% to {STATE_RATES[s].high}%</td>
              <td>~{STATE_RATES[s].typical}%</td>
              <td>{aud((EXAMPLE_PRICE * STATE_RATES[s].typical) / 100)} before GST</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        For the full rates, worked dollar examples and negotiation tips in your
        state, see the dedicated guide:{" "}
        <Link href="/guides/real-estate-commission-nsw">NSW</Link>,{" "}
        <Link href="/guides/real-estate-commission-vic">VIC</Link>,{" "}
        <Link href="/guides/real-estate-commission-qld">QLD</Link>,{" "}
        <Link href="/guides/real-estate-commission-wa">WA</Link>,{" "}
        <Link href="/guides/real-estate-commission-sa">SA</Link>,{" "}
        <Link href="/guides/real-estate-commission-tas">TAS</Link>,{" "}
        <Link href="/guides/real-estate-commission-nt">NT</Link>,{" "}
        <Link href="/guides/real-estate-commission-act">ACT</Link>.
      </p>

      <Callout variant="info" title="Run your own numbers">
        <p>
          Our{" "}
          <Link href="/real-estate-commission-calculator">commission calculator</Link>{" "}
          turns these percentages into dollars on your sale price, including
          marketing and conveyancing. And if you&rsquo;re comparing agents now,
          the{" "}
          <Link href="/selling-guide">free selling guide</Link> includes the
          questions to ask every agent before you sign, and how to compare
          fees and agency agreements.
        </p>
      </Callout>

      <Callout variant="info" title="On higher-value homes, compare in dollars">
        <p>
          The higher the price, the larger the commission in dollars, so there
          is usually more room to negotiate the percentage. The headline rate
          matters less than the dollar amount: always calculate both, and
          compare every quote at the same expected sale price.
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
        We use $2,000 to $8,000 as an indicative marketing budget for a typical
        home before styling; premium campaigns can exceed $10,000. Agents and
        suppliers quote these individually and no published survey sets them,
        so ask for the schedule line by line. The{" "}
        <Link href="/selling-costs-calculator">selling costs calculator</Link>{" "}
        adds marketing to commission, GST, conveyancing and your state’s
        documents, and the{" "}
        <Link href="/guides/cost-of-selling-a-house-australia">cost of selling guide</Link>{" "}
        explains every line.
      </p>

      <KeyFigure
        value="$2k–$8k"
        label="Our indicative marketing budget for a typical Australian home (photography, portal listings, signboard, floor plan), before styling. Charged separately from commission."
        context="Indicative only: premium and styled campaigns run higher"
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
        Our guide to{" "}
        <Link href="/guides/fixed-fee-vs-commission-real-estate-agents">fixed fee vs commission agents</Link>{" "}
        works both models through on the same sale.
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
      <p>
        The{" "}
        <Link href="/guides/how-to-negotiate-real-estate-agent-commission">commission negotiation guide</Link>{" "}
        has the scripts, and the{" "}
        <Link href="/tools/agent-proposal-worksheet">agent proposal worksheet</Link>{" "}
        lines up to three quotes at the same expected sale price, so you compare
        fees in dollars rather than headline rates.
      </p>

      <h2 id="cheapest-agent">The risk of choosing the cheapest agent</h2>
      <p>
        Your property is likely your largest asset. Choosing an agent solely
        based on the lowest commission can be a costly mistake.
      </p>
      <ul>
        <li>An agent who negotiates an extra $20,000 on a sale more than covers a slightly higher rate: 0.25% more on an $800,000 sale is $2,000.</li>
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
          <strong>Cooling-off period.</strong>{" "}NSW gives sellers one business
          day to cancel a residential agency agreement: the cooling-off period
          ends at 5pm on the next business day or Saturday (NSW Government,
          Agency agreements, updated 8 July 2026). Victoria, Queensland, South
          Australia and WA have no cooling-off period on an agency agreement, so
          read it before you sign. Our{" "}
          <Link href="/guides/real-estate-agency-agreements-by-state">agency agreements guide</Link>{" "}
          covers the term, the tail clause and how to get out, state by state.
        </li>
        <li>
          <strong>Commission trigger.</strong> Understand exactly when commission
          is payable, usually on unconditional exchange or settlement.
        </li>
        <li>
          <strong>Conjunctional sales.</strong>{" "}Some agreements allow the listing
          agent to &ldquo;conjunct&rdquo; with another agent. Understand how
          commission is shared in this case.
        </li>
      </ul>
      <p>
        Always read the full agreement before signing, and ask your conveyancer
        or solicitor to review it if you have any concerns. If you want a
        starting point on price, we can arrange a free{" "}
        <Link href="/appraisal">property appraisal</Link> from one local agent
        in your suburb.
      </p>

      <Sources items={AGENT_FEES_SOURCES} />
    </GuideArticleLayout>
  );
}

const AGENT_FEES_SOURCES: readonly SourceItem[] = [
  { label: "NSW Government: Agency agreements for the sale of property", href: "https://www.nsw.gov.au/housing-and-construction/buying-and-selling-property/selling-a-property/agency-agreements", note: "Updated 8 July 2026, read 20 October 2026. Commission and fees are negotiable; one business day cooling-off on a residential agency agreement." },
  { label: "Your Property Guide: Agency agreements by state", href: "/guides/real-estate-agency-agreements-by-state", note: "The cooling-off, term and exit rules in NSW, Victoria, Queensland, SA and WA, read from each state's Act." },
  { label: "Your Property Guide: commission and selling-cost figures", href: "/selling-costs-calculator", note: "Commission ranges are our compiled market figures (September 2026); marketing and other costs are indicative ranges quoted individually by suppliers. No state publishes a commission survey." },
];
