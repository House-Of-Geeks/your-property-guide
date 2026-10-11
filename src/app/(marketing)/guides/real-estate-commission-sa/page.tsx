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
const R = STATE_RATES.SA;
const C = STATE_COMMISSION.SA;
const REG = regionalRange("SA");
const money = (n: number) => `$${n.toLocaleString("en-AU")}`;

const FRONTMATTER: GuideFrontmatter = {
  title: "Real Estate Commission SA 2026: Adelaide Rates, Fees & Calculator",
  h1: "Real Estate Commission SA 2026: Adelaide & SA Rates, Fees & Calculator",
  description:
    "Adelaide and SA agent commission: published figures 1.71% to 2.9%, a calculator preset to the SA rate, dollar examples with GST, and how to negotiate.",
  slug: "real-estate-commission-sa",
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
  `Published figures for real estate commission in Adelaide and across South Australia run from ${pct(R.low)} (${whereInState("SA", R.low)}) to ${pct(R.high)} (${whereInState("SA", R.high)}), with a state average of ${pct(R.typical)} (OpenAgent, September 2026).`,
  "Commission is paid by the seller out of the sale proceeds at settlement, and it is negotiable, not a fixed or regulated rate.",
  `On an $800,000 sale, the ${pct(R.typical)} state average works out to ${money(commissionAmount(800_000, R.typical))} in commission before GST. At ${pct(R.high)} it is ${money(commissionAmount(800_000, R.high))}.`,
  "Most SA agents work on a 'no sale, no fee' basis, so commission is only payable if the property actually sells.",
  "Commission usually attracts 10% GST on top, and marketing, photography and styling are charged separately.",
  "Commission is always worth negotiating: compare two or three local agents on the rate and the marketing budget before you sign.",
];

const TOC: GuideTOCEntry[] = [
  { id: "calculator",   label: "Commission calculator" },
  { id: "average",      label: "Average commission in SA" },
  { id: "worked",       label: "What that costs on your sale price" },
  { id: "structure",    label: "How commission is structured in SA" },
  { id: "negotiable",   label: "Is commission negotiable in SA?" },
  { id: "other-costs",  label: "Commission vs your other selling costs" },
  { id: "cost-table",   label: "What it costs to sell in South Australia" },
  { id: "next-steps",   label: "Get an appraisal and the right agent" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is the average real estate commission in SA?",
    answer:
      `OpenAgent's South Australian state average is ${pct(R.typical)} of the sale price (September 2026), with Adelaide at ${pct(C.capital.rate)} and South East SA at ${pct(REG!.low)}; bRight Agent's median across SA postcodes is higher, at ${pct(C.median)} (February 2026), because it counts more regional towns. Commission is charged on what the property sells for. There is no official or fixed rate in SA: the SA Government says fees and terms in the sales agency agreement can be negotiated.`,
  },
  {
    question: "How much do real estate agents charge in South Australia?",
    answer:
      `SA agents charge a commission, a set fee or both, and published averages run from ${pct(R.low)} to ${pct(R.high)} of the sale price. On a $600,000 sale that is ${money(commissionAmount(600_000, R.low))} to ${money(commissionAmount(600_000, R.high))}, and on a $1,000,000 sale ${money(commissionAmount(1_000_000, R.low))} to ${money(commissionAmount(1_000_000, R.high))}, before GST. Commission usually has 10% GST added on top, and marketing, photography and styling are billed separately. Get written quotes from two or three local agents so you can compare the rate and the inclusions side by side.`,
  },
  {
    question: "Is real estate commission negotiable in SA?",
    answer:
      "Yes. Commission in South Australia is deregulated, which means there is no government-set rate and every agent sets their own. The percentage on the first agency agreement you read is an opening number, not a fixed price. To negotiate well, get appraisals from two or three agents who genuinely sell in your suburb, compare the rate against the marketing budget and service, and ask each agent to justify their number. Be wary of the cheapest quote if it comes with a thin campaign.",
  },
  {
    question: "Do you pay commission if the house doesn't sell?",
    answer:
      "Generally no. Most South Australian agents work on a 'no sale, no fee' basis, so commission is only payable if the property sells, usually at settlement from the sale proceeds. Marketing and advertising costs are different: they are typically charged whether or not the property sells, and are often payable up front or during the campaign. Confirm both points in the agency agreement before you sign so there are no surprises.",
  },
  {
    question: "Does commission include GST in SA?",
    answer:
      "Usually not in the headline rate. Real estate commission in South Australia normally attracts 10% GST on top of the quoted percentage, so a 2% commission on an $800,000 sale is $16,000 plus $1,600 GST. Some agents quote inclusive of GST and some quote exclusive, so it is worth asking directly whether the rate you are given already includes GST. Always confirm in writing how GST is shown before you compare one agent's quote against another.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Commission Calculator",              href: "/real-estate-commission-calculator",        description: "Work out commission on your SA sale price." },
  { title: "The Cost of Selling a House",         href: "/guides/cost-of-selling-a-house-australia",  description: "Every selling cost beyond commission." },
  { title: "Real Estate Agent Fees (National)",   href: "/guides/real-estate-agent-fees-australia",   description: "How fees and commission work across Australia." },
  { title: "How to Choose a Selling Agent",       href: "/guides/how-to-choose-a-selling-agent",      description: "Pick the right agent, then negotiate the fee." },
  { title: "How Much Is My House Worth?",          href: "/guides/how-much-is-my-house-worth-australia", description: "Get a realistic price range before you list." },
];

export default function RealEstateCommissionSAPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={[...FAQS, COMMISSION_PAA_FAQ.SA]}
      related={RELATED}
    >
      <CommissionCalculatorEmbed state="SA" />
      <p>
        Selling in another state? See{" "}
        <Link href="/guides/real-estate-agent-fees-australia">real estate agent fees in every state</Link>.
      </p>

      <Callout variant="warning" title="Commission is not fixed, and it is always negotiable">
        <p>
          There is no regulated or official commission rate in South Australia.
          The figures in this guide are published averages and medians, each
          named and dated in the table below, not set rates, and the percentage
          any agent quotes is a starting point you can negotiate. Always get current written quotes from your own local
          agents before you commit.
        </p>
      </Callout>

      <EditorNote>
        <p>
          In SA the conversation about commission tends to start and stop at the
          percentage, which is the wrong place to look. Two per cent sounds
          small until you put it on the sale price and add GST. It is real
          money, it is negotiable, and the rate is only half the picture, the
          marketing budget sits alongside it. Compare a couple of agents on both
          before you sign anything.
        </p>
      </EditorNote>

      <h2 id="average">Average real estate commission in SA</h2>
      <p className="lead">
        {stateRateSummary("SA")} Commission is a percentage of the price the
        property actually sells for, it is paid by the seller out of the sale
        proceeds at settlement, and it is negotiable.
      </p>
      <StateCommissionTable state="SA" price={800_000} />
      <p>
        The two measures disagree more in SA than anywhere else. OpenAgent puts
        Adelaide at {pct(C.capital.rate)} and South East SA at {pct(REG!.low)},
        while bRight Agent&rsquo;s median of {pct(C.median)} draws on regional
        towns too: Real Estate Business reported Whyalla at 3.65% and Yorketown
        at 3.5% in the same report. Expect an Adelaide quote near the bottom of
        the range and a country one nearer the top.
      </p>
      <p>
        Because commission is charged as a percentage, the dollar figure rises
        with the sale price even at the same rate. That is exactly why the rate
        is worth a conversation, and why it pays to see the number in dollars
        rather than as a percentage.
      </p>

      <KeyFigure
        value={pct(R.typical)}
        label={`OpenAgent's SA state average commission (September 2026). On an $800,000 sale that's ${money(commissionAmount(800_000, R.typical))} before GST.`}
        context={`Published averages run ${pct(R.low)} to ${pct(R.high)}, before GST, and it's negotiable`}
      />

      <h2 id="worked">What that costs on your sale price</h2>
      <p>
        Here is what those rates work out to in dollars across a range of SA
        sale prices: the lowest published figure ({pct(R.low)}), the state
        average ({pct(R.typical)}) and the highest ({pct(R.high)}), so you can see
        the spread on your own likely price.
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
          {workedExamples("SA").map((w) => (
            <tr key={w.price}><td>{money(w.price)}</td><td>{money(w.low)}</td><td>{money(w.typical)}</td><td>{money(w.high)}</td></tr>
          ))}
        </tbody>
      </table>

      <p>
        These figures exclude GST, which is usually added on top, and they
        exclude marketing and other selling costs. For an exact figure on your
        own sale price, use{" "}
        <Link href="/real-estate-commission-calculator">our commission calculator</Link>,
        which has a South Australia setting.
      </p>

      <h2 id="structure">How commission is structured in SA</h2>
      <p>
        Most South Australian agents charge a flat percentage of the sale price.
        Some offer a tiered or performance-based structure instead, where the
        rate steps up on the amount achieved above an agreed target price, which
        rewards the agent for pushing past a benchmark and can align their
        incentive with yours. A flat percentage is the most common, but a
        performance clause is worth asking about, especially if you think there
        is upside in a strong campaign.
      </p>
      <p>
        The norm in SA is <strong>&ldquo;no sale, no fee&rdquo;</strong>:
        commission is only payable if the property sells, usually at settlement
        out of the proceeds. You do not pay the commission up front.
      </p>
      <p>What the commission normally covers:</p>
      <ul>
        <li><strong>Appraisal and pricing strategy</strong>, the agent&rsquo;s read on what the home should sell for and how to take it to market.</li>
        <li><strong>Listing and management</strong> of the campaign through to settlement.</li>
        <li><strong>Open homes and private inspections</strong>, hosting buyers and qualifying enquiry.</li>
        <li><strong>Negotiation</strong> with buyers on your behalf to achieve the best price and terms.</li>
      </ul>
      <p>What is usually charged separately, on top of commission:</p>
      <ul>
        <li><strong>Marketing and advertising</strong>, including listings on the major property portals and any print or digital campaign.</li>
        <li><strong>Professional photography</strong>, and often video or floor plans.</li>
        <li><strong>Property styling or staging</strong>, where you choose to use it.</li>
      </ul>

      <Callout variant="info" title="Marketing is usually billed whether or not it sells">
        <p>
          Commission is &ldquo;no sale, no fee&rdquo; in most SA agreements, but
          marketing and advertising costs are not. They are typically payable
          during or up front in the campaign and are not refunded if the home is
          withdrawn or does not sell. Confirm how marketing is charged before you
          sign.
        </p>
      </Callout>

      <h2 id="negotiable">Is commission negotiable in SA?</h2>
      <p>
        Yes. Commission in South Australia is{" "}
        <strong>deregulated</strong>, so there is no government-set rate and
        every agent sets their own. The percentage on the first agency agreement
        you read is an opening number, not a fixed price, and most sellers can
        move it with a straightforward conversation.
      </p>

      <PullQuote attribution="Andy McMaster, Editor">
        In SA the rate is yours to negotiate, not the agent&rsquo;s to dictate.
        The first percentage you&rsquo;re quoted is a starting point, every time.
      </PullQuote>

      <p>How to negotiate the rate in SA:</p>
      <ul>
        <li><strong>Compare two or three local agents.</strong> Getting competing appraisals gives you the leverage and the information to push on the rate.</li>
        <li><strong>Negotiate on the rate <em>and</em> the marketing.</strong> A slightly lower percentage means little if the marketing budget is padded. Treat both as part of the same deal.</li>
        <li><strong>Be wary of the cheapest.</strong> The lowest rate is not the best outcome if it comes with a thin campaign or an agent juggling too many listings. An extra $20,000 on the price covers the $1,600 gap between a 1.8% and a 2% quote on $800,000 more than twelve times, so compare agents on results before rates.</li>
        <li><strong>Get it in writing.</strong> Confirm the rate, whether GST is included, and what marketing costs sit on top, all in the agency agreement.</li>
      </ul>
      <p>
        For a sense of what is normal and who is licensed, the{" "}
        <strong>Real Estate Institute of South Australia (REISA)</strong> is the
        state&rsquo;s industry body, and agents in SA are licensed and regulated
        through <strong>Consumer and Business Services SA</strong>. Checking that
        an agent is properly licensed is a basic first step before you hand over
        your largest asset.
      </p>

      <MatchCTA kind="selling-agent" />

      <h2 id="other-costs">Commission vs your other selling costs</h2>
      <p>
        Commission is the largest single cost of selling, but it is not the only
        one. Marketing and photography, conveyancing or legal work, styling and
        any presentation work all sit alongside it, and if the property is an
        investment rather than your home, capital gains tax can be larger again.
      </p>
      <p>
        For the full picture of what selling actually costs, read{" "}
        <Link href="/guides/cost-of-selling-a-house-australia">the full cost of selling</Link>,
        and for how commission and fees work across the country, see the{" "}
        <Link href="/guides/real-estate-agent-fees-australia">national agent fees guide</Link>.
        Both put the SA commission figure in context with everything else you
        will pay at settlement.
      </p>

      <SellingCostTable state="SA" />

      <h2 id="next-steps">Get an appraisal and the right agent</h2>
      <p>
        The commission rate matters, but the agent you choose usually matters
        more. The right agent in SA will achieve a higher price than the cheapest
        one, often by enough to cover the difference in the rate several times
        over. So the order that saves the most is to value the home, choose the
        agent well, then negotiate the fee.
      </p>
      <ol>
        <li>
          <strong>Get a real value first.</strong> Our guide to{" "}
          <Link href="/guides/how-much-is-my-house-worth-australia">how much your house is worth</Link>{" "}
          covers getting an accurate figure before you list.
        </li>
        <li>
          <strong>Choose the agent carefully.</strong> Our{" "}
          <Link href="/guides/how-to-choose-a-selling-agent">guide to choosing a selling agent</Link>{" "}
          covers the interview, the over-quote trap and what to negotiate.
        </li>
        <li>
          <strong>Size the commission.</strong> Run your price through the{" "}
          <Link href="/real-estate-commission-calculator">commission calculator</Link>{" "}
          so you know the dollar figure before any conversation.
        </li>
      </ol>

      <MatchCTA kind="selling-agent" />

      <Sources items={SA_COMMISSION_SOURCES} />
    </GuideArticleLayout>
  );
}

const SA_COMMISSION_SOURCES: readonly SourceItem[] = [
  ...commissionSourceItems(stateSources("SA")),
  { label: "Law Handbook SA: Form 1", href: "https://lawhandbook.sa.gov.au/ch23s09s01.php", note: "The Form 1 vendor's statement a South Australian seller must provide" },
];
