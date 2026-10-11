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
import { NationalCommissionTable, commissionSourceItems } from "@/components/guide/CommissionRateTable";
import { CommissionCalculator } from "@/components/calculators/CommissionCalculator";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import {
  COMMISSION_AS_AT,
  COMMISSION_SOURCE_LIST,
  STATE_COMMISSION,
  STATE_ORDER,
  nationalRange,
  pct,
  rateAgainstAverages,
  regionalRange,
} from "@/lib/data/commission-rates";
import { MARKETING, lineRange, nationalSellingCost } from "@/lib/data/selling-costs";

// The national fees guide owns the national commission phrases (commercial-
// intent review, 10 Oct 2026, selling P1 and section 4). Every rate on it
// comes from src/lib/data/commission-rates.ts, so it cannot drift from the
// state guides or the calculators.
const N = nationalRange();
const COST = nationalSellingCost(800_000);
const money = (n: number) => `$${n.toLocaleString("en-AU")}`;
const capitalVsRegional = STATE_ORDER.flatMap((st) => {
  const c = STATE_COMMISSION[st];
  const r = regionalRange(st);
  return r ? [`${c.capital.name} ${pct(c.capital.rate)} against ${r.low === r.high ? pct(r.low) : `${pct(r.low)} to ${pct(r.high)}`} regionally`] : [];
});

const FRONTMATTER: GuideFrontmatter = {
  title: "Real Estate Agent Fees & Commission 2026: Rates by State",
  h1: "Real Estate Agent Fees and Commission in Australia (2026): Rates by State, With Calculator",
  description:
    "What agents charge in every state: sourced commission averages, a commission calculator with GST, what's included, marketing costs and how to negotiate.",
  slug: "real-estate-agent-fees-australia",
  publishedAt: "2026-04-01",
  updatedAt: "2026-10-11",
  readingTimeMinutes: 9,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "selling",
};

export const metadata: Metadata = {
  title: FRONTMATTER.title,
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
  `No state sets real estate commission. Published averages and medians run from ${pct(N.low)} to ${pct(N.high)} of the sale price, lowest in the capital cities and highest in regional areas (OpenAgent, September 2026; bRight Agent, February 2026).`,
  `State averages run from ${pct(N.averageLow)} in the ACT to ${pct(N.averageHigh)} in Queensland. On an $800,000 sale at 2%, commission is $16,000, or $17,600 with 10% GST.`,
  `Marketing (photography, portal listings, signboard) is charged on top and is usually payable whether or not the home sells: an indicative ${lineRange(MARKETING)}.`,
  `All selling costs together on an $800,000 house come to ${money(COST.low)} to ${money(COST.high)} across the states, before GST on the commission.`,
  "Always interview at least three agents and compare the full package: pricing strategy, marketing plan, suburb track record, not just the commission rate.",
  "An extra $20,000 on the price covers the $1,600 gap between a 1.8% and a 2% quote on $800,000 more than twelve times, so compare agents on results before rates.",
];

const TOC: GuideTOCEntry[] = [
  { id: "calculator",           label: "Real estate agent fees calculator" },
  { id: "how-commission-works", label: "How commission works" },
  { id: "rates-by-state",       label: "Commission by state in dollars" },
  { id: "city-regional",        label: "Why city and regional rates differ" },
  { id: "gst",                  label: "Does commission include GST?" },
  { id: "when-paid",            label: "When do you pay commission?" },
  { id: "whats-included",       label: "What's included in commission" },
  { id: "marketing-costs",      label: "Marketing costs (charged separately)" },
  { id: "fixed-fee",            label: "Fixed fee vs commission" },
  { id: "privately",            label: "Commission vs selling privately" },
  { id: "negotiate",            label: "Negotiating the fee" },
  { id: "questions",            label: "Questions to ask before signing" },
  { id: "agency-agreement",     label: "Understanding the agency agreement" },
];

const FAQS: FaqItem[] = [
  {
    question: "What's a normal real estate commission in Australia?",
    answer:
      `Most Australian agents charge a percentage of the sale price. Published averages and medians run from ${pct(N.low)} (${N.lowWhere}) to ${pct(N.high)} (${N.highWhere}), and state averages from ${pct(N.averageLow)} in the ACT to ${pct(N.averageHigh)} in Queensland (OpenAgent, September 2026). bRight Agent's national median across more than 200 postcodes is ${pct(N.nationalMedian)} (February 2026). GST of 10% is added if the quote excludes it, so 2% on $800,000 is $16,000, or $17,600 with GST. No state sets the rate.`,
  },
  {
    question: "Is real estate commission paid upfront or at settlement?",
    answer:
      "Almost always at settlement, from the sale proceeds, not upfront. Marketing costs are different, they're often charged either upfront or at the start of the campaign and are usually payable whether or not the property sells. Confirm both points in the agency agreement before signing.",
  },
  {
    question: "Are marketing costs included in commission?",
    answer:
      `No. Commission almost never includes marketing. Photography, portal listings on realestate.com.au and Domain, a signboard, social ads and any styling are billed separately. As a budget, allow an indicative ${lineRange(MARKETING)} for the campaign; ask for an itemised schedule and remember it is usually payable whether or not the home sells.`,
  },
  {
    question: "Does commission include GST?",
    answer:
      "Not always. GST is 10% on most services (ATO), so a 2% commission quoted before GST is 2.2% once it is added: $16,000 on an $800,000 sale becomes $17,600. In Queensland the appointment form (Form 6) must state the commission as a GST-inclusive amount (REIQ). Elsewhere, ask each agent whether the rate includes GST and get the dollar figure in the agency agreement.",
  },
  {
    question: "Is 2% a good commission?",
    answer:
      `It depends on the state. ${rateAgainstAverages(2)} Judge a quote in dollars as well as percent: on $800,000 each 0.1% is $800 before GST, and what the agent includes in the fee matters as much as the rate.`,
  },
  {
    question: "Do real estate agents get paid if the house doesn't sell?",
    answer:
      "Usually not. Most Australian agents work on a no sale, no fee basis, so commission is only payable when the property sells, normally at settlement out of the sale proceeds: at 2% on an $800,000 sale, the $16,000 commission is owed only once the sale completes. Marketing is the exception. Photography, portal listings and styling, an indicative $2,000 to $8,000, are usually payable whether or not the home sells. The agency agreement sets out both. In NSW, section 55 of the Property and Stock Agents Act 2002 means an agent is not entitled to commission or expenses at all without a written agreement signed by you, and the other states and territories also require the appointment in writing with the commission and expenses set out. Read the commission and marketing terms, along with any campaign-extension, withdrawal or change-of-agent terms, before you sign. In Queensland and South Australia a sole agency agreement can run for at most 90 days.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Free selling guide (PDF)",       href: "/selling-guide",                        description: "Costs, agent selection and a 12-week selling plan, personalised to your suburb." },
  { title: "Commission calculator",          href: "/real-estate-commission-calculator",    description: "What an agent costs on your sale price, by state." },
  { title: "Selling costs calculator",       href: "/selling-costs-calculator",             description: "Every selling cost, with net proceeds after your loan." },
  { title: "How to Choose a Selling Agent",  href: "/guides/how-to-choose-a-selling-agent", description: "Pick the right agent first, then negotiate the fee." },
  { title: "How to negotiate commission",    href: "/guides/how-to-negotiate-real-estate-agent-commission", description: "Tiered structures and the questions that move the rate." },
  { title: "Free appraisal",                 href: "/appraisal",                            description: "Get a real-world appraisal from a local agent. No commitment." },
  { title: "Property Auction Guide",         href: "/guides/property-auction-guide",        description: "If selling at auction, the rules and dynamics differ." },
  { title: "Conveyancing in Australia",      href: "/guides/conveyancing-guide",            description: "The other professional you'll need on settlement day." },
];

const SOURCES: readonly SourceItem[] = [
  ...commissionSourceItems(COMMISSION_SOURCE_LIST),
  "Marketing figures are indicative ranges quoted individually by suppliers; no state publishes a survey, so treat them as a budget.",
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
      <p className="lead">
        No state sets real estate commission: it is whatever you and the agent
        write into the agency agreement. Published averages run from{" "}
        {pct(N.low)} to {pct(N.high)} of the sale price plus GST, depending on
        the state and on city or regional; on an $800,000 sale at 2% that is
        $16,000, or $17,600 with GST.
      </p>

      <h2 id="calculator">Real estate agent fees calculator</h2>
      <p>
        Pick your state, enter your expected price and the rate you have been
        quoted. The calculator adds 10% GST unless you tell it the quote
        includes it, then adds marketing and conveyancing for your net
        proceeds. The{" "}
        <Link href="/real-estate-commission-calculator">full commission calculator</Link>{" "}
        has the same tool with a state table and the formula.
      </p>
      <div className="not-prose my-6">
        <CommissionCalculator initialState="NSW" initialPrice={800_000} headingLevel="h3" showGuideCta={false} />
      </div>

      <h2 id="how-commission-works">How real estate commission works</h2>
      <p>
        When you sell a property through a real estate agent in Australia, you
        pay the agent a <strong>commission</strong>, a percentage of the final
        sale price. Commission is usually payable only if the property sells
        (typically at settlement), so agents are paid for a result.
      </p>
      <p>
        Commission is not a fixed dollar amount, it scales with the sale price.
        On a $900,000 home sold at a 2% commission rate, the agent earns
        $18,000 before GST, or $19,800 with it. On a $1.5 million property,
        that&rsquo;s $30,000 before GST.
      </p>
      <p>
        Commission is <strong>negotiable</strong> in every state: the NSW
        Government, Consumer Affairs Victoria, the SA Government and the NT
        Government all say so, and REIWA says government regulations do not fix
        agents&rsquo; fees in WA. Some agencies use tiered structures (for
        example 2.5% on the first $300,000 and 1.5% on the remainder), which can
        be worth negotiating on higher-value properties.
      </p>

      <h2 id="rates-by-state">Commission by state in dollars (2026)</h2>
      <p>
        The table gives every state&rsquo;s published averages and median, and
        what the state average comes to on an $800,000 sale before and with
        GST. Each figure is footnoted to its source, read {COMMISSION_AS_AT}.
        For the detail in your state, see the guide for{" "}
        <Link href="/guides/real-estate-commission-nsw">NSW</Link>,{" "}
        <Link href="/guides/real-estate-commission-vic">VIC</Link>,{" "}
        <Link href="/guides/real-estate-commission-qld">QLD</Link>,{" "}
        <Link href="/guides/real-estate-commission-wa">WA</Link>,{" "}
        <Link href="/guides/real-estate-commission-sa">SA</Link>,{" "}
        <Link href="/guides/real-estate-commission-tas">TAS</Link>,{" "}
        <Link href="/guides/real-estate-commission-nt">NT</Link> or the{" "}
        <Link href="/guides/real-estate-commission-act">ACT</Link>.
      </p>
      <NationalCommissionTable price={800_000} />

      <KeyFigure
        value={`${pct(N.averageLow)} to ${pct(N.averageHigh)}`}
        label={`The range of state average commissions, from the ACT to Queensland (OpenAgent, September 2026). Individual areas run from ${pct(N.low)} to ${pct(N.high)}.`}
        context="Before GST, and negotiable"
      />

      <h2 id="city-regional">Why city and regional rates differ</h2>
      <p>
        In capital cities, more agents compete for each listing and prices are
        higher, so a lower percentage still pays the agent; in regional areas
        there are fewer agents and lower prices. OpenAgent&rsquo;s September
        2026 averages show the pattern: {capitalVsRegional.join("; ")}.
        bRight Agent&rsquo;s report put the highest postcode at Tennant Creek
        (NT), 3.85%.
      </p>

      <h2 id="gst">Does commission include GST?</h2>
      <p>
        Not always, and it changes the figure you pay. GST is 10% on most goods
        and services (ATO), and an agent&rsquo;s commission is a taxable service,
        so a 2% rate quoted before GST costs 2.2%: on $800,000, $16,000 becomes
        $17,600. Queensland is the exception in how it is written down: the
        Form 6 that appoints your agent must state the commission as a
        GST-inclusive amount (REIQ). Everywhere else, ask each agent whether
        their rate includes GST and get the dollar amount in the agency
        agreement. The calculator above adds GST by default.
      </p>

      <h2 id="when-paid">When do you pay commission?</h2>
      <p>
        Usually at settlement, out of the sale proceeds, and only if the
        property sells. The NSW Government&rsquo;s guide to agency agreements
        says the agreement must state when the agent is entitled to be paid
        (usually only when the property is sold) and how and when payment is
        made, for example whether the agent can deduct commission from the
        buyer&rsquo;s deposit. Marketing is different: it is often invoiced at
        the start of the campaign and is usually payable whether or not the
        home sells.
      </p>

      <h2 id="whats-included">What&rsquo;s included in commission</h2>
      <p>A full-service real estate commission typically includes:</p>
      <ul>
        <li><strong>Appraisal and pricing strategy.</strong> The agent assesses your property and recommends a price range or reserve.</li>
        <li><strong>Property preparation advice.</strong> Guidance on presentation, styling, or minor repairs before you list.</li>
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
      <p>Marketing is one of the most significant additional costs of selling. A campaign usually covers:</p>
      <ul>
        <li><strong>Photography and video.</strong> Professional photos, and sometimes video or aerial shots.</li>
        <li><strong>Floor plan.</strong> Usually included with photography packages.</li>
        <li><strong>Online listings (realestate.com.au and Domain).</strong> The listing tier is the biggest driver of the bill.</li>
        <li><strong>Signboard.</strong> Standard, or illuminated or custom at a higher price.</li>
        <li><strong>Social media and digital ads.</strong> Optional, priced by reach.</li>
        <li><strong>Property styling or staging.</strong> Optional; our{" "}
          <Link href="/guides/home-staging-cost-australia">home staging cost guide</Link> covers when it pays.</li>
      </ul>
      <p>
        As a budget, allow an indicative {lineRange(MARKETING)} for the campaign.
        Ask for an itemised schedule and challenge any line you would not pay
        for yourself. For the rest of the bill, read{" "}
        <Link href="/guides/cost-of-selling-a-house-australia">the full cost of selling a house</Link>{" "}
        or run your sale through the{" "}
        <Link href="/selling-costs-calculator">selling costs calculator</Link>.
      </p>

      <Callout variant="warning" title="Marketing is usually payable whether or not it sells">
        <p>
          Confirm this in the agency agreement before signing. Most marketing
          packages are payable up-front or at the start of the campaign and
          aren&rsquo;t refunded if the property is withdrawn or fails to sell.
        </p>
      </Callout>

      <h2 id="fixed-fee">Fixed fee vs commission</h2>
      <p>
        Some agencies, particularly online or hybrid operators, charge a flat
        fee to sell your property rather than a percentage. A flat fee is
        predictable and can cost less on a high-value sale; the trade-off is
        that the agent&rsquo;s pay does not rise with your price, and service
        levels (open homes, negotiation support) may be lighter. Our guide to{" "}
        <Link href="/guides/fixed-fee-vs-commission-real-estate-agents">fixed fee vs commission agents</Link>{" "}
        works through the break-even sums.
      </p>

      <h2 id="privately">Commission vs selling privately</h2>
      <p>
        Selling without an agent saves the commission, {money(Math.round(800_000 * N.averageLow / 100))} to{" "}
        {money(Math.round(800_000 * N.averageHigh / 100))} on an $800,000 home at
        the state averages, before GST, but not the legal work, the marketing
        or the negotiating. If you are weighing it up, see how to{" "}
        <Link href="/guides/sell-your-house-privately-australia">sell your house privately</Link>.
      </p>

      <h2 id="negotiate">Negotiating the fee</h2>
      <p>
        Interview at least three agents who sell your kind of property in your
        suburb, compare the full package rather than the rate alone, and ask
        about a tiered structure that pays more above a target price.{" "}
        {TLDR[5]} Our guide to{" "}
        <Link href="/guides/how-to-negotiate-real-estate-agent-commission">how to negotiate real estate agent commission</Link>{" "}
        has the method, and{" "}
        <Link href="/guides/how-to-choose-a-selling-agent">how to choose a selling agent</Link>{" "}
        covers the interview.
      </p>

      <h2 id="questions">Questions to ask before signing an agency agreement</h2>
      <ul>
        <li>What is your proposed sale price range, and how did you arrive at it?</li>
        <li>What commission rate and marketing package are you proposing, and does the rate include GST?</li>
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
          <strong>Duration.</strong> In Queensland and South Australia a sole
          agency agreement can run for at most 90 days; elsewhere the term is
          whatever you agree, so be cautious about a long one.
        </li>
        <li>
          <strong>Cooling-off period.</strong> NSW gives you until 5 pm on the
          next business day or Saturday after signing to cancel the agency
          agreement. Victoria, Queensland, South Australia and WA give no
          cooling-off on it, so read the agreement before you sign. Our guide to{" "}
          <Link href="/guides/real-estate-agency-agreements-by-state">agency agreements by state</Link>{" "}
          sets out each state&rsquo;s rules.
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

      <Sources items={SOURCES} />
    </GuideArticleLayout>
  );
}
