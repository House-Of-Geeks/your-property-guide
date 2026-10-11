import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  Sources,
  SellingCostTable,
  CommissionCalculatorEmbed,
  EditorNote,
  PullQuote,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
  type SourceItem,
} from "@/components/guide";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { COMMISSION_PAA_FAQ } from "@/lib/data/commission-faqs";
import { StateCommissionTable, commissionSourceItems } from "@/components/guide/CommissionRateTable";
import {
  STATE_COMMISSION,
  STATE_RATES,
  commissionAmount,
  pct,
  regionalRange,
  stateRateSummary,
  stateSources,
  whereInState,
  workedExamples,
} from "@/lib/data/commission-rates";

// Every rate on this page comes from the sourced table in
// src/lib/data/commission-rates.ts (commercial-intent review, 10 Oct 2026, 0.1).
const R = STATE_RATES.WA;
const C = STATE_COMMISSION.WA;
const REG = regionalRange("WA");
const money = (n: number) => `$${n.toLocaleString("en-AU")}`;

const FRONTMATTER: GuideFrontmatter = {
  title: "Real Estate Commission WA 2026: Perth Rates, Fees & Calculator",
  h1: "Real Estate Commission WA 2026: Perth & WA Rates, Fees & Calculator",
  description:
    "Perth and WA agent commission: published averages 2.06% to 3.25%, a calculator preset to the WA rate, dollar examples with GST, and how to negotiate.",
  slug: "real-estate-commission-wa",
  publishedAt: "2026-06-14",
  updatedAt: "2026-10-11",
  readingTimeMinutes: 8,
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
  `Published averages for real estate commission in Perth and across WA run from ${pct(R.low)} (${whereInState("WA", R.low)}) to ${pct(R.high)} (${whereInState("WA", R.high)}), with a state average of ${pct(R.typical)} (OpenAgent, September 2026).`,
  `On a $600,000 sale at the ${pct(R.typical)} state average, commission is ${money(commissionAmount(600_000, R.typical))} before GST. On a $1,000,000 sale it's ${money(commissionAmount(1_000_000, R.typical))}.`,
  "Commission usually attracts 10% GST on top, and quotes vary on whether they show the GST-inclusive figure or not.",
  "Almost every WA agent works on a no sale, no fee basis, so commission is only payable once the property sells, at settlement.",
  "Commission is deregulated in WA. There is no official or fixed rate, so the percentage you're first quoted is always negotiable.",
  "Marketing, photography and styling are charged separately from commission, so compare the full package, not just the headline rate.",
];

const TOC: GuideTOCEntry[] = [
  { id: "calculator",   label: "Commission calculator" },
  { id: "average-commission", label: "Average commission in WA" },
  { id: "worked-examples",    label: "Worked examples by sale price" },
  { id: "how-structured",     label: "How commission is structured" },
  { id: "negotiable",         label: "Is commission negotiable in WA?" },
  { id: "other-costs",        label: "Commission vs your other costs" },
  { id: "agreement",    label: "What the agency agreement must say" },
  { id: "cost-table",   label: "What it costs to sell in WA" },
  { id: "next-steps",         label: "Get the right agent and rate" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is the average real estate commission in WA?",
    answer:
      `OpenAgent's WA state average is ${pct(R.typical)} of the sale price (September 2026), with Perth at ${pct(C.capital.rate)} and regional areas from ${pct(REG!.low)} to ${pct(REG!.high)}; bRight Agent's median across WA postcodes is ${pct(C.median)} (February 2026). It is charged on what the property sells for and paid by the seller at settlement. There is no official or fixed rate: REIWA says government regulations do not fix agents' fees, so get written quotes from two or three local agents before you settle on a number.`,
  },
  {
    question: "How much do real estate agents charge in Western Australia?",
    answer:
      `Most WA agents charge a percentage of the sale price, and published averages run from ${pct(R.low)} in Perth to ${pct(R.high)} in ${whereInState("WA", R.high)}. At the ${pct(R.typical)} state average, a $600,000 sale works out to ${money(commissionAmount(600_000, R.typical))} and an $800,000 sale ${money(commissionAmount(800_000, R.typical))}. These figures exclude GST, which adds 10% where a quote excludes it. Marketing and photography are billed separately again. Use our commission calculator to get an exact figure for your own sale price.`,
  },
  {
    question: "Is real estate commission negotiable in WA?",
    answer:
      "Yes. Commission in Western Australia is deregulated, which means there is no government-set or fixed rate and agents set their own pricing. The percentage on the first agency agreement you read is a starting point, not a fixed fee. The best way to negotiate is to compare two or three agents, weigh the rate against the marketing package and the agent's track record in your suburb, and be wary of picking purely on the cheapest quote. Ask each agent to show recent sales in your suburb so you can weigh the rate against results.",
  },
  {
    question: "Do you pay commission if the house doesn't sell?",
    answer:
      "Generally no. Almost every WA agent works on a no sale, no fee basis, so commission is only payable if and when the property sells, and it comes out of the sale proceeds at settlement. Marketing and advertising costs are different, though. Those are usually charged separately and are often payable whether or not the property sells. Check exactly what you owe in each scenario in the agency agreement before you sign.",
  },
  {
    question: "Does commission include GST in WA?",
    answer:
      "Commission usually attracts 10% GST on top of the agreed rate. Where quotes get confusing is that some agents show the GST-inclusive figure and some quote the rate before GST, so two quotes at the same percentage can mean different final dollar amounts. Always ask whether the rate you've been given includes GST so you're comparing like with like across agents.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Commission Calculator",               href: "/real-estate-commission-calculator",        description: "Work out commission on your WA sale price." },
  { title: "The Cost of Selling a House",          href: "/guides/cost-of-selling-a-house-australia",  description: "Every selling cost beyond commission." },
  { title: "Real Estate Agent Fees (National)",    href: "/guides/real-estate-agent-fees-australia",   description: "How fees and commission work across Australia." },
  { title: "How to Choose a Selling Agent",        href: "/guides/how-to-choose-a-selling-agent",      description: "Pick the right agent, then negotiate the fee." },
  { title: "How Much Is My House Worth?",          href: "/guides/how-much-is-my-house-worth-australia", description: "Get a realistic price range before you list." },
];

export default function RealEstateCommissionWaPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={[...FAQS, COMMISSION_PAA_FAQ.WA]}
      related={RELATED}
    >
      <CommissionCalculatorEmbed state="WA" />
      <p>
        Selling in another state? See{" "}
        <Link href="/guides/real-estate-agent-fees-australia">real estate agent fees in every state</Link>.
      </p>

      <Callout variant="warning" title="These are published averages, not official rates">
        <p>
          Commission in Western Australia is not regulated or fixed, and it is
          always negotiable. The figures in this guide are published averages
          and medians, each named and dated in the table below, not an official
          rate set by anyone. Rates vary by agent,
          suburb and property, so treat every figure here as indicative and get
          written, current quotes from your own local agents before you commit.
        </p>
      </Callout>

      <EditorNote>
        <p>
          WA sellers often assume there&rsquo;s a set rate for the state.
          There isn&rsquo;t. Commission here was deregulated years ago, so the
          number on the agreement is just where the agent has chosen to start.
          The sellers who pay the least aren&rsquo;t the ones who push hardest
          on the percentage, they&rsquo;re the ones who compare two or three
          agents properly and weigh the rate against who&rsquo;ll actually get
          them the higher price.
        </p>
      </EditorNote>

      <h2 id="average-commission">Average real estate commission in WA</h2>
      <p className="lead">
        {stateRateSummary("WA")} Commission is charged as a percentage of what
        your property sells for, it&rsquo;s paid by you, the seller, at
        settlement, and it is negotiable.
      </p>
      <StateCommissionTable state="WA" price={600_000} />
      <p>
        The gap between Perth and the regions is wide in WA. OpenAgent puts
        Perth&rsquo;s average at {pct(C.capital.rate)}, against {pct(REG!.low)} in
        the {whereInState("WA", REG!.low)} up to {pct(REG!.high)} in{" "}
        {whereInState("WA", REG!.high)}. None of this is fixed, which is exactly
        why comparing local agents matters.
      </p>

      <KeyFigure
        value={pct(R.typical)}
        label={`OpenAgent's WA state average commission (September 2026). On an $800,000 sale that's ${money(commissionAmount(800_000, R.typical))} before GST.`}
        context={`Published averages run ${pct(R.low)} to ${pct(R.high)}, before GST, and it's negotiable`}
      />

      <h2 id="worked-examples">Worked examples by sale price</h2>
      <p>
        Because commission is a percentage, the dollar figure climbs with the
        sale price even at the same rate. Here are the WA figures across a spread
        of sale prices, at the lowest published average ({pct(R.low)}), the state
        average ({pct(R.typical)}) and the highest published average ({pct(R.high)}).
      </p>

      <table>
        <thead>
          <tr>
            <th>Sale price</th>
            <th>At {pct(R.low)} (lowest)</th>
            <th>At {pct(R.typical)} (state average)</th>
            <th>At {pct(R.high)} (highest)</th>
          </tr>
        </thead>
        <tbody>
          {workedExamples("WA").map((w) => (
            <tr key={w.price}><td>{money(w.price)}</td><td>{money(w.low)}</td><td>{money(w.typical)}</td><td>{money(w.high)}</td></tr>
          ))}
        </tbody>
      </table>

      <p>
        These figures exclude GST, which is usually added at 10% on top of the
        commission. For an exact figure on your own sale price, including a WA
        setting, use{" "}
        <Link href="/real-estate-commission-calculator">our commission calculator</Link>.
      </p>

      <h2 id="how-structured">How commission is structured in WA</h2>
      <p>
        Most WA agents quote a single flat percentage of the sale price, so a{" "}
        {pct(R.typical)} rate on a $700,000 sale is simply {money(commissionAmount(700_000, R.typical))} before GST. Some agents
        instead offer a tiered or performance-based structure, where the rate
        steps up on the amount achieved above an agreed target price. A
        performance clause can be worth asking about, because it ties the
        agent&rsquo;s reward directly to getting you a stronger result.
      </p>
      <p>
        Whichever structure you&rsquo;re quoted, the standard arrangement in WA
        is <strong>no sale, no fee</strong>. Commission is only payable once the
        property sells, and it&rsquo;s deducted from the sale proceeds at
        settlement, so you don&rsquo;t pay it up front.
      </p>
      <p>
        What the commission usually covers:
      </p>
      <ul>
        <li><strong>Appraisal and pricing strategy</strong> for your home and the local market</li>
        <li><strong>Listing and campaign management</strong> from first inspection through to settlement</li>
        <li><strong>Open homes and private inspections</strong>, hosted and managed by the agent</li>
        <li><strong>Negotiation with buyers</strong> on price and terms, on your behalf</li>
        <li><strong>Regular updates</strong> on enquiry, feedback and offers</li>
      </ul>
      <p>
        What is almost always charged separately, on top of commission:
      </p>
      <ul>
        <li><strong>Marketing and advertising</strong>, including listings on the major property portals</li>
        <li><strong>Professional photography</strong>, floor plans and video</li>
        <li><strong>Property styling or staging</strong>, where you choose to use it</li>
      </ul>
      <p>
        Because these sit outside commission, two agents on the same headline
        rate can still cost very different amounts once the marketing package is
        added in. Always ask for the marketing budget in writing alongside the
        commission quote.
      </p>

      <h2 id="negotiable">Is commission negotiable in WA?</h2>
      <p>
        Yes. Real estate commission in Western Australia is{" "}
        <strong>deregulated</strong>, which means there is no government-set
        rate and agents set their own pricing. The percentage you&rsquo;re first
        quoted is an opening number, not a fixed fee, and most sellers
        don&rsquo;t realise how much room there is to discuss it.
      </p>

      <PullQuote attribution="Andy McMaster, Editor">
        Commission in WA isn&rsquo;t set by anyone but the agent in front of you.
        The first rate you&rsquo;re quoted is a starting point, not a price tag.
      </PullQuote>

      <p>How to negotiate well in WA:</p>
      <ul>
        <li>
          <strong>Compare two or three agents.</strong> Get written quotes from
          agents who actively sell your type of property in your suburb.
          Competing quotes give you both leverage and a realistic sense of the
          going rate locally.
        </li>
        <li>
          <strong>Negotiate on the rate and the marketing.</strong> The
          commission percentage is only half the cost. The marketing and
          advertising budget is the other half, and it&rsquo;s often where the
          bigger savings sit, so push on both.
        </li>
        <li>
          <strong>Be wary of the cheapest quote.</strong> The lowest rate
          isn&rsquo;t the same as the lowest cost. An agent who negotiates a
          stronger sale price can easily earn back a slightly higher rate many
          times over, while a bargain agent juggling too many listings can cost
          you far more in a weaker result.
        </li>
        <li>
          <strong>Confirm whether GST is included.</strong> Ask every agent
          whether their quoted rate is before or after the 10% GST, so you&rsquo;re
          comparing like with like.
        </li>
      </ul>
      <p>
        For context on the wider market, the{" "}
        <a href="https://reiwa.com.au" target="_blank" rel="noopener noreferrer">
          Real Estate Institute of WA (REIWA)
        </a>{" "}
        publishes Perth and regional market data, and WA agents are licensed and
        regulated through Consumer Protection within the Department of Energy,
        Mines, Industry Regulation and Safety. Checking that an agent holds a
        current licence is a quick, sensible step before you sign anything.
      </p>

      <MatchCTA kind="selling-agent" />

      <h2 id="other-costs">Commission vs the rest of your selling costs</h2>
      <p>
        Commission is the single largest cost of selling in WA, but it isn&rsquo;t
        the only one. Marketing and photography, conveyancing or settlement
        agent fees, any styling and presentation work, and your mortgage
        discharge fee all sit on top. If the property is an investment rather
        than your home, capital gains tax can be larger again.
      </p>
      <p>
        To see commission in the context of the full bill, read{" "}
        <Link href="/guides/cost-of-selling-a-house-australia">the full cost of selling</Link>,
        which walks through every line item with a worked example. For how
        commission and fees compare across the rest of the country, the{" "}
        <Link href="/guides/real-estate-agent-fees-australia">national agent fees guide</Link>{" "}
        sets out the rates and inclusions state by state.
      </p>

      <h2 id="agreement">What your agency agreement must say about commission</h2>
      <p>
        Under section 60 of the Real Estate and Business Agents Act 1978, a WA
        agent is not entitled to commission unless they were appointed in
        writing, signed by you, setting out the property, the services and the
        commission and how it is worked out. There is no statutory maximum term
        and no cooling-off period, and most agencies use the REIWA Exclusive
        Selling Agency Authority with the term left blank, so the number you
        write in is the number you are bound by. REIWA says government
        regulations do not fix agents&rsquo; fees.
      </p>
      <p>
        Our guide to{" "}
        <Link href="/guides/real-estate-agency-agreements-by-state">agency agreements by state</Link>{" "}
        covers the clauses worth changing first. If you are weighing a flat fee instead of a percentage, see{" "}
        <Link href="/guides/fixed-fee-vs-commission-real-estate-agents">flat fee agents</Link>{" "}
        and what they leave out.
      </p>

      <SellingCostTable state="WA" />

      <h2 id="next-steps">Get the right agent and rate</h2>
      <p>
        The cheapest commission rarely produces the best net result. The seller
        who keeps the most usually starts by picking the right agent, then
        negotiates the fee, not the other way around. Here&rsquo;s the order
        that works:
      </p>
      <ol>
        <li>
          <strong>Get a real appraisal.</strong> Before you talk fees, get a
          realistic price range for your home. The{" "}
          <Link href="/guides/how-much-is-my-house-worth-australia">how much is my house worth guide</Link>{" "}
          covers the three ways to value a home and how to land on a realistic range.
        </li>
        <li>
          <strong>Choose the agent on merit.</strong> Our{" "}
          <Link href="/guides/how-to-choose-a-selling-agent">guide to choosing a selling agent</Link>{" "}
          covers the interview, the track record to look for, and the over-quote
          trap to avoid.
        </li>
        <li>
          <strong>Size the cost.</strong> Run your likely WA sale price through
          the{" "}
          <Link href="/real-estate-commission-calculator">commission calculator</Link>{" "}
          so you know what commission means in dollars before any conversation.
        </li>
        <li>
          <strong>Then negotiate.</strong> With the value, the agent shortlist
          and the dollar figure in hand, you&rsquo;re in the strongest position
          to negotiate both the rate and the marketing.
        </li>
      </ol>

      <MatchCTA kind="selling-agent" />

      <Sources items={WA_COMMISSION_SOURCES} />
    </GuideArticleLayout>
  );
}

const WA_COMMISSION_SOURCES: readonly SourceItem[] = [
  ...commissionSourceItems(stateSources("WA")),
  { label: "Consumer Protection WA: Selling property", href: "https://www.consumerprotection.wa.gov.au/selling-property", note: "Contract, strata and disclosure requirements when selling in WA" },
];
