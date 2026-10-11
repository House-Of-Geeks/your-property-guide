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
  commissionWithGst,
  pct,
  regionalRange,
  stateRateSummary,
  stateSources,
  whereInState,
  workedExamples,
} from "@/lib/data/commission-rates";

// Every rate on this page comes from the sourced table in
// src/lib/data/commission-rates.ts (commercial-intent review, 10 Oct 2026, 0.1).
const R = STATE_RATES.NSW;
const C = STATE_COMMISSION.NSW;
const REG = regionalRange("NSW")!;
const money = (n: number) => `$${n.toLocaleString("en-AU")}`;
const AT_800 = commissionAmount(800_000, R.typical);

const FRONTMATTER: GuideFrontmatter = {
  title: "Real Estate Commission NSW 2026: Sydney Rates, Fees & Calculator",
  h1: "Real Estate Commission NSW 2026: Sydney & NSW Rates, Fees & Calculator",
  description:
    "Sydney and NSW agent commission: published averages 1.64% to 2.85%, a calculator preset to the NSW rate, dollar examples with GST, and how to negotiate.",
  slug: "real-estate-commission-nsw",
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
  `Published averages for real estate commission in Sydney and across NSW run from ${pct(R.low)} (${whereInState("NSW", R.low)}) to ${pct(R.high)} (${whereInState("NSW", R.high)}), with a state average of ${pct(R.typical)} (OpenAgent, September 2026).`,
  `On an $800,000 NSW sale, the state average works out to ${money(AT_800)} before GST, or ${money(commissionWithGst(800_000, R.typical))} with it. At ${pct(R.low)} it's ${money(commissionAmount(800_000, R.low))}, and at ${pct(R.high)} it's ${money(commissionAmount(800_000, R.high))} (excluding GST).`,
  "Commission is a percentage of the sale price, paid by the seller out of the proceeds at settlement, not upfront.",
  "Most NSW agents work on a no sale, no fee basis, so commission is only payable if the property sells.",
  "GST of 10% usually applies on top of the commission, and quotes vary on whether they show the rate inclusive or exclusive of GST.",
  "No NSW law sets the rate, and the NSW Government says you can negotiate it. Compare two or three agents and negotiate the rate and the marketing spend, not just the headline percentage.",
];

const TOC: GuideTOCEntry[] = [
  { id: "calculator",   label: "Commission calculator" },
  { id: "average",      label: "Average commission in NSW" },
  { id: "agreement",    label: "What the agency agreement must say" },
  { id: "worked",       label: "Worked examples by sale price" },
  { id: "structure",    label: "How commission is structured in NSW" },
  { id: "negotiable",   label: "Is commission negotiable in NSW?" },
  { id: "other-costs",  label: "Commission vs your other selling costs" },
  { id: "cost-table",   label: "What it costs to sell in NSW" },
  { id: "next-steps",   label: "Get the right agent first" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is the average real estate commission in NSW?",
    answer:
      `OpenAgent's NSW state average is ${pct(R.typical)} of the sale price (September 2026), with Sydney at ${pct(C.capital.rate)} and regional NSW areas from ${pct(REG.low)} to ${pct(REG.high)}. bRight Agent's median across NSW postcodes is ${pct(C.median)} (February 2026). The two measure different things, so read them as a range. There is no fixed or official rate: the NSW Government says the commission is negotiable and must be written into the agency agreement, so the figure you are quoted is a starting point.`,
  },
  {
    question: "How much do real estate agents charge in New South Wales?",
    answer:
      `Most NSW agents charge a percentage of the sale price rather than a flat fee. At the ${pct(R.typical)} state average, a $600,000 sale costs ${money(commissionAmount(600_000, R.typical))}, an $800,000 sale ${money(AT_800)} and a $1,000,000 sale ${money(commissionAmount(1_000_000, R.typical))} in commission, before GST. Sydney's average is lower (${pct(R.low)}) and the highest regional average is ${pct(R.high)} (OpenAgent, September 2026). Marketing, photography and styling are charged separately on top, so always ask for the full cost, not just the commission rate.`,
  },
  {
    question: "Is real estate commission negotiable in NSW?",
    answer:
      "Yes. No NSW law sets the rate, and the NSW Government's guide to agency agreements says you can negotiate the amounts of any commissions, fees and expenses. The percentage on the first agency agreement you read is an opening number, not a fixed price. The way to negotiate well is to get appraisals from two or three local agents, compare the rate against the service and the marketing budget, and ask each agent to justify their figure. Pushing the rate down even slightly on a Sydney sale price is real money.",
  },
  {
    question: "Do you pay commission if the house doesn't sell?",
    answer:
      "Generally no. Most NSW agents work on a no sale, no fee basis, so commission is only payable if the property actually sells, usually at settlement out of the proceeds. Marketing costs are different, though. Photography, portal listings and signage are normally payable whether or not the property sells, and they are billed separately from commission. Always confirm both points in the agency agreement before you sign so there are no surprises if the campaign stalls.",
  },
  {
    question: "Does commission include GST in NSW?",
    answer:
      "Usually commission attracts 10% GST on top of the quoted rate. Some agents quote a rate that already includes GST and others quote it exclusive of GST, so the same headline number can mean two different final figures. Before you compare agents, ask each one whether their rate is inclusive or exclusive of GST and get the total dollar amount in writing. The worked examples in this guide are shown before GST, so add 10% to estimate what you would actually pay.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Commission Calculator",                href: "/real-estate-commission-calculator",        description: "Work out commission on your NSW sale price." },
  { title: "The Cost of Selling a House",          href: "/guides/cost-of-selling-a-house-australia",  description: "Every selling cost beyond commission." },
  { title: "Real Estate Agent Fees (National)",    href: "/guides/real-estate-agent-fees-australia",   description: "How fees and commission work across Australia." },
  { title: "How to Choose a Selling Agent",        href: "/guides/how-to-choose-a-selling-agent",      description: "Pick the right agent, then negotiate the fee." },
  { title: "How Much Is My House Worth?",          href: "/guides/how-much-is-my-house-worth-australia", description: "Get a realistic price range before you list." },
];

export default function RealEstateCommissionNswPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={[...FAQS, COMMISSION_PAA_FAQ.NSW]}
      related={RELATED}
    >
      <CommissionCalculatorEmbed state="NSW" />
      <p>
        Selling in another state? See{" "}
        <Link href="/guides/real-estate-agent-fees-australia">real estate agent fees in every state</Link>.
      </p>

      <Callout variant="warning" title="Commission is not a fixed or official rate">
        <p>
          There is no regulated or set commission rate in New South Wales, and
          the NSW Government says the amount is negotiable. The figures in this
          guide are published averages and medians, each named and dated in the
          table below, not official rates. They are a guide for comparison only. Always get written quotes from your own
          local agents and confirm the current rate, what it includes and
          whether GST is on top before you rely on any number here.
        </p>
      </Callout>

      <EditorNote>
        <p>
          Most NSW sellers accept the first commission rate they&rsquo;re quoted
          because they assume it&rsquo;s standard. It isn&rsquo;t. There&rsquo;s
          no official rate in this state, every agent sets their own, and on a
          Sydney sale price even a small difference in the percentage is
          thousands of dollars. Get the rate in writing, compare a couple of
          agents, and treat the number as the start of a conversation.
        </p>
      </EditorNote>

      <h2 id="average">Average real estate commission in NSW</h2>
      <p className="lead">
        {stateRateSummary("NSW")} Commission is charged as a percentage of what
        your property sells for, paid by you as the seller out of the sale
        proceeds at settlement, and it is negotiable.
      </p>
      <StateCommissionTable state="NSW" price={800_000} />
      <p>
        The rate moves with the area. OpenAgent puts Sydney&rsquo;s average at{" "}
        {pct(R.low)}, below every regional NSW area it publishes, where averages
        run up to {pct(R.high)} in {whereInState("NSW", R.high)}. The headline
        percentage matters far less than the dollar amount it produces, which is
        where the worked examples below come in.
      </p>

      <h2 id="worked">Worked examples by sale price</h2>
      <p>
        Because commission is a percentage, the dollar figure scales with your
        sale price. The table below shows the NSW figures in dollars at three
        rates: {pct(R.low)}, the lowest published average; {pct(R.typical)}, the
        state average; and {pct(R.high)}, the highest published average.
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
          {workedExamples("NSW").map((w) => (
            <tr key={w.price}><td>{money(w.price)}</td><td>{money(w.low)}</td><td>{money(w.typical)}</td><td>{money(w.high)}</td></tr>
          ))}
        </tbody>
      </table>

      <p>
        These figures exclude GST, which usually adds 10% on top, and they cover
        commission only, not marketing or conveyancing. For an exact figure on
        your own sale price, use{" "}
        <Link href="/real-estate-commission-calculator">our commission calculator</Link>,
        which has a NSW setting and turns the percentage into dollars for you.
      </p>

      <KeyFigure
        value={pct(R.typical)}
        label={`OpenAgent's NSW state average commission (September 2026). On an $800,000 sale that's ${money(AT_800)} before GST.`}
        context={`Published averages run ${pct(R.low)} to ${pct(R.high)}, and it's negotiable`}
      />

      <h2 id="structure">How commission is structured in NSW</h2>
      <p>
        The standard structure in New South Wales is a{" "}
        <strong>flat percentage</strong> of the sale price. The agent quotes a
        single rate, say 2%, and that rate applies to the whole sale price
        whatever the property eventually sells for. It&rsquo;s simple to compare
        between agents, which is why most NSW vendors see it.
      </p>
      <p>
        Some agents offer a <strong>tiered or performance-based</strong>{" "}
        structure instead. A tiered agreement might apply one rate up to a target
        price and a higher rate on everything above it, which rewards the agent
        for pushing past the figure you both expect. Done well, this aligns the
        agent&rsquo;s incentive with yours, since they only earn the premium rate
        if they get you a premium result. It&rsquo;s worth asking about,
        especially if you think there&rsquo;s upside in your sale.
      </p>
      <p>
        Almost all NSW agents work on a <strong>no sale, no fee</strong> basis.
        Commission is only payable if the property sells, and it comes out of the
        proceeds at settlement rather than being paid upfront. That&rsquo;s a big
        part of why agents are motivated to achieve the best price they can.
      </p>
      <p>What the commission usually covers:</p>
      <ul>
        <li><strong>Appraisal and pricing strategy.</strong> The agent assesses the property and recommends a price or reserve.</li>
        <li><strong>Listing and campaign management.</strong> Coordinating the sale process from listing through to exchange and settlement.</li>
        <li><strong>Open homes and inspections.</strong> Hosting inspections, qualifying buyers and reporting feedback to you.</li>
        <li><strong>Negotiation.</strong> Negotiating with buyers on your behalf to achieve the best price and terms.</li>
      </ul>
      <p>What&rsquo;s usually charged separately, on top of commission:</p>
      <ul>
        <li><strong>Marketing and advertising.</strong> Listings on the major property portals, signboards and social or print campaigns.</li>
        <li><strong>Photography and video.</strong> Professional photos, floor plans, and any video or drone work.</li>
        <li><strong>Styling and staging.</strong> Optional, but common in Sydney, where presentation drives the early competition.</li>
      </ul>
      <p>
        Marketing costs are normally payable whether or not the property sells,
        unlike commission, so confirm those figures separately before you sign.
      </p>

      <h2 id="negotiable">Is commission negotiable in NSW?</h2>
      <p>
        Yes. No NSW law sets the rate, and the NSW Government&rsquo;s guide to
        agency agreements says you can negotiate the amounts of any commissions,
        fees and expenses. Every agent sets their own rate, so the percentage on
        the first agency agreement you read is an opening number, not a fixed
        price.
      </p>

      <PullQuote attribution="Andy McMaster, Editor">
        There&rsquo;s no official commission rate in NSW. The number you&rsquo;re
        first quoted is where the negotiation starts, not where it ends.
      </PullQuote>

      <p>How to negotiate commission in NSW without shooting yourself in the foot:</p>
      <ol>
        <li>
          <strong>Compare two or three agents.</strong> Getting competing
          appraisals gives you both leverage and a sense of what&rsquo;s fair in
          your suburb. Choose agents who genuinely sell your type of property
          locally, not whoever letterboxes you most.
        </li>
        <li>
          <strong>Negotiate the rate and the marketing.</strong> The commission
          percentage is only half the cost. The marketing budget is often where
          the bigger savings sit, so push on both rather than fixating on the
          headline rate alone.
        </li>
        <li>
          <strong>Be wary of the cheapest.</strong> An extra $20,000 on the price covers the $1,600 gap between a 1.8% and a 2% quote on $800,000 more than twelve times, so compare agents on results before rates. Ask each agent to back their number with recent comparable
          sales in your area.
        </li>
      </ol>
      <p>
        For context, all agents who sell property in New South Wales must be
        licensed through{" "}
        <a href="https://www.nsw.gov.au/departments-and-agencies/fair-trading" target="_blank" rel="noopener noreferrer">
          NSW Fair Trading
        </a>
        , and many belong to the{" "}
        <a href="https://www.reinsw.com.au/" target="_blank" rel="noopener noreferrer">
          Real Estate Institute of NSW (REINSW)
        </a>
        . Neither body sets commission rates, but checking that an agent is
        properly licensed is a sensible first step. If something goes wrong
        later, here is how to{" "}
        <Link href="/guides/real-estate-agent-complaints-and-red-flags">complain about a real estate agent in NSW</Link>.
      </p>

      <h2 id="agreement">What your agency agreement must say about commission</h2>
      <p>
        Before an agent can market your home in NSW you both sign an agency
        agreement. The NSW Government&rsquo;s guide says it must state the
        services the agent will provide, the amounts of any fees or commission
        you agree to pay, when the agent is entitled to be paid (usually only
        when the property sells), how and when payment is made, and the
        agent&rsquo;s estimated selling price. Ask for each agent&rsquo;s fees,
        commission and expenses in writing before you sign, and compare them in
        dollars.
      </p>
      <p>
        You then have a cooling-off period: you can cancel the agreement until
        5 pm on the next business day or Saturday after you sign. Our guide to{" "}
        <Link href="/guides/real-estate-agency-agreements-by-state">agency agreements by state</Link>{" "}
        covers the clauses worth changing first.
      </p>

      <MatchCTA kind="selling-agent" />

      <h2 id="other-costs">Commission vs your other selling costs</h2>
      <p>
        Commission is the largest single cost of selling in NSW, but it
        isn&rsquo;t the only one. On top of the agent&rsquo;s fee you&rsquo;ll
        pay for marketing and photography, conveyancing or legal work, usually
        some presentation or styling, and a small mortgage discharge fee if you
        have a loan to pay out. If the property is an investment rather than your
        home, capital gains tax can be larger than commission again.
      </p>
      <p>
        To see how commission fits into the full picture, read{" "}
        <Link href="/guides/cost-of-selling-a-house-australia">the full cost of selling</Link>,
        which walks through every line item with a worked example. And if you want
        to see how NSW compares with the rest of the country, the{" "}
        <Link href="/guides/real-estate-agent-fees-australia">national agent fees guide</Link>{" "}
        sets out commission ranges state by state and what&rsquo;s included.
      </p>

      <SellingCostTable state="NSW" />

      <h2 id="next-steps">Get the right agent first</h2>
      <p>
        The cheapest commission rarely means the best return. The agent who gets
        you a stronger sale price more than covers a slightly higher fee, so the
        order that saves the most money is to pick the right agent first, then
        negotiate the rate.
      </p>
      <ol>
        <li>
          <strong>Get a realistic price range.</strong> Before you talk fees, know what
          your home is likely to sell for. Our guide to{" "}
          <Link href="/guides/how-much-is-my-house-worth-australia">how much your house is worth</Link>{" "}
          covers the three ways to value a home and how to land on a realistic range.
        </li>
        <li>
          <strong>Choose the agent on results, not rate.</strong> The{" "}
          <Link href="/guides/how-to-choose-a-selling-agent">how to choose a selling agent</Link>{" "}
          guide covers the interview, the over-quote trap and what to negotiate.
        </li>
        <li>
          <strong>Size the commission.</strong> Run your price through the{" "}
          <Link href="/real-estate-commission-calculator">commission calculator</Link>{" "}
          so you know exactly what the fee means in dollars before any
          conversation.
        </li>
      </ol>

      <MatchCTA kind="selling-agent" />

      <Sources items={NSW_COMMISSION_SOURCES} />
    </GuideArticleLayout>
  );
}

const NSW_COMMISSION_SOURCES: readonly SourceItem[] = [
  ...commissionSourceItems(stateSources("NSW")),
  { label: "NSW Government: Selling property in NSW", href: "https://www.nsw.gov.au/housing-and-construction/buying-and-selling-property/selling-a-property", note: "What the contract of sale must include before a NSW property is offered for sale" },
];
