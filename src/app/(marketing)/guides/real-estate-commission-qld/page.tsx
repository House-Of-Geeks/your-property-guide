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
const R = STATE_RATES.QLD;
const C = STATE_COMMISSION.QLD;
const REG = regionalRange("QLD");
const money = (n: number) => `$${n.toLocaleString("en-AU")}`;
/** The old two-part quote, 5% of the first $18,000 and 2.5% of the balance, on $800,000. */
const OLD_SCALE_800 = Math.round(18_000 * 0.05 + (800_000 - 18_000) * 0.025);

const FRONTMATTER: GuideFrontmatter = {
  title: "Real Estate Commission QLD 2026: Brisbane Rates, Fees & Calculator",
  h1: "Real Estate Commission QLD 2026: Brisbane & QLD Rates, Fees & Calculator",
  description:
    "Brisbane and Queensland agent commission: published averages 2.33% to 2.91%, a calculator preset to the QLD rate, dollar examples with GST, and the Form 6.",
  slug: "real-estate-commission-qld",
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
  `Published averages for real estate commission in Brisbane and across Queensland run from ${pct(R.low)} (${whereInState("QLD", R.low)}) to ${pct(R.high)} (${whereInState("QLD", R.high)}), with a state average of ${pct(R.typical)} (OpenAgent, September 2026).`,
  "Commission is a percentage of the final sale price, paid by the seller out of the proceeds at settlement, and it is always negotiable.",
  `At the ${pct(R.typical)} state average, an $800,000 sale costs ${money(commissionAmount(800_000, R.typical))} in commission before GST, or ${money(commissionWithGst(800_000, R.typical))} with it.`,
  "The Form 6 that appoints your agent must state the commission as a GST-inclusive amount, so check the dollar figure on the form, not just the percentage.",
  "\"No sale, no fee\" is the norm in QLD, so commission is generally only payable if the property actually sells.",
  "Marketing, photography and styling are charged separately, so compare agents on the full package, not just the headline rate.",
];

const TOC: GuideTOCEntry[] = [
  { id: "calculator",   label: "Commission calculator" },
  { id: "average",     label: "Average real estate commission in QLD" },
  { id: "old-scale",   label: "Why some agents still quote 5% on the first $18,000" },
  { id: "examples",    label: "Worked examples by sale price" },
  { id: "structure",   label: "How commission is structured in QLD" },
  { id: "negotiable",  label: "Is commission negotiable in QLD?" },
  { id: "other-costs", label: "Commission vs the rest of your selling costs" },
  { id: "cost-table",   label: "What it costs to sell in Queensland" },
  { id: "next-steps",  label: "Getting an appraisal and the right agent" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is the average real estate commission in QLD?",
    answer:
      `OpenAgent's Queensland state average is ${pct(R.typical)} of the sale price (September 2026), with Brisbane at ${pct(C.capital.rate)} and regional areas from ${pct(REG!.low)} to ${pct(REG!.high)}; bRight Agent's median across Queensland postcodes is ${pct(C.median)} (February 2026). There is no official or fixed figure: Queensland deregulated maximum commission in 2014, and the REIQ says there is no "standard" rate. The rate you are quoted is a starting point, and the Form 6 must state it as a GST-inclusive amount.`,
  },
  {
    question: "How much do real estate agents charge in Queensland?",
    answer:
      `Most Queensland agents charge a percentage of the sale price, and published averages run from ${pct(R.low)} to ${pct(R.high)}. At the ${pct(R.typical)} state average, an $800,000 sale costs ${money(commissionAmount(800_000, R.typical))} and a $1,000,000 sale ${money(commissionAmount(1_000_000, R.typical))}, before GST. Marketing, professional photography and styling are charged separately on top of commission. Some agents will offer a tiered or performance-based structure that pays them more above an agreed target price. Always get the rate, the GST treatment and the marketing budget in writing before you sign an agency agreement.`,
  },
  {
    question: "Is real estate commission negotiable in QLD?",
    answer:
      "Yes. Commission in Queensland is deregulated, which means there is no legislated rate and agents set their own pricing. That makes the figure on the first agency agreement an opening number, not a fixed price. The way to negotiate well is to compare two or three local agents, weigh the rate against the service and marketing on offer, and negotiate on the marketing spend as well as the percentage. Avoid choosing purely on the cheapest rate, because the rate is only part of the result: on $800,000 the gap between 1.8% and 2% is $1,600 before GST, and an extra $20,000 on the price covers it more than twelve times.",
  },
  {
    question: "Do you pay commission if the house doesn't sell?",
    answer:
      "Generally no. \"No sale, no fee\" is the standard arrangement in Queensland, so commission is only payable if the property actually sells, usually at settlement from the sale proceeds. Marketing costs are different. Photography, portal listings and advertising are typically billed separately and are often payable whether or not the property sells. Read the agency agreement carefully so you understand exactly when commission is triggered and what marketing you are committed to regardless of the outcome.",
  },
  {
    question: "Does commission include GST in QLD?",
    answer:
      `GST of 10% applies to the agent's commission. Under the Property Occupations Act 2014, the Form 6 appointment must state the commission as a GST-inclusive amount (REIQ), so the dollar figure on the form already includes it, while a percentage quoted in conversation may not. At the ${pct(R.typical)} state average on an $800,000 sale, commission is ${money(commissionAmount(800_000, R.typical))} before GST and ${money(commissionWithGst(800_000, R.typical))} with it. Ask each agent for the GST-inclusive dollar amount so you are comparing like with like.`,
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Commission Calculator",              href: "/real-estate-commission-calculator",       description: "Work out commission on your QLD sale price." },
  { title: "The Cost of Selling a House",         href: "/guides/cost-of-selling-a-house-australia", description: "Every selling cost beyond commission." },
  { title: "Real Estate Agent Fees (National)",   href: "/guides/real-estate-agent-fees-australia",  description: "How fees and commission work across Australia." },
  { title: "How to Choose a Selling Agent",       href: "/guides/how-to-choose-a-selling-agent",     description: "Pick the right agent, then negotiate the fee." },
  { title: "How Much Is My House Worth?",         href: "/guides/how-much-is-my-house-worth-australia", description: "Get a realistic price range before you list." },
];

export default function RealEstateCommissionQldPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={[...FAQS, COMMISSION_PAA_FAQ.QLD]}
      related={RELATED}
    >
      <CommissionCalculatorEmbed state="QLD" />
      <p>
        Selling in another state? See{" "}
        <Link href="/guides/real-estate-agent-fees-australia">real estate agent fees in every state</Link>.
      </p>

      <Callout variant="warning" title="Commission is not fixed, and it is always negotiable">
        <p>
          Commission in Queensland is not regulated or set at a fixed rate. The
          figures in this guide are published averages and medians, each named
          and dated in the table below, not official rates, and every agent sets
          their own pricing. Treat every
          percentage and dollar amount here as indicative, get written quotes
          from your own local agents, and confirm the current rate, the GST
          treatment and the marketing budget before you sign anything.
        </p>
      </Callout>

      <EditorNote>
        <p>
          Queensland sellers ask me the same thing every time: is the rate fair? The
          honest answer is that there is no official rate to be fair against.
          Commission here is deregulated, so the number on the agreement is
          whatever the agent decided to write down. The sellers who do best treat
          it like any other price worth thousands of dollars: they get two or
          three quotes, they read the GST line, and they negotiate on the
          marketing as hard as the rate.
        </p>
      </EditorNote>

      <h2 id="average">Average real estate commission in QLD</h2>
      <p className="lead">
        {stateRateSummary("QLD")} Commission is a percentage of the sale price,
        paid by the seller out of the proceeds at settlement, and it is
        negotiable.
      </p>
      <StateCommissionTable state="QLD" price={800_000} />
      <p>
        On OpenAgent&rsquo;s figures Queensland&rsquo;s state average of{" "}
        {pct(R.typical)} is above Sydney ({pct(STATE_COMMISSION.NSW.capital.rate)}) and
        Melbourne ({pct(STATE_COMMISSION.VIC.capital.rate)}). Within the state,
        Brisbane averages {pct(C.capital.rate)} and the regional areas run from{" "}
        {pct(REG!.low)} in {whereInState("QLD", REG!.low)} to {pct(REG!.high)} in{" "}
        {whereInState("QLD", REG!.high)}. None of this is fixed, which is the
        single most important thing to understand before you sign.
      </p>

      <h2 id="old-scale">Why some Queensland agents still quote 5% on the first $18,000</h2>
      <p>
        WhichRealEstateAgent&rsquo;s Brisbane fee guide (updated 9 December 2025)
        notes that many agents still quote the old two-part structure: 5% of the
        first $18,000, then 2.5% of the balance. On an $800,000 sale that is{" "}
        {money(OLD_SCALE_800)} before GST, or {pct(Math.round((OLD_SCALE_800 / 800_000) * 10_000) / 100)} of
        the price.
      </p>
      <p>
        It is a habit, not a rule. Maximum commission rates were deregulated in
        Queensland in 2014, and the REIQ reminds agents that there is no
        &ldquo;standard&rdquo; or REIQ-approved commission: describing a rate
        that way can be misleading. Under the Property Occupations Act 2014 the
        commission is whatever you and the agent write into the Form 6, stated
        as a GST-inclusive amount, and you can negotiate it.
      </p>

      <KeyFigure
        value={pct(R.typical)}
        label={`OpenAgent's QLD state average commission (September 2026). On an $800,000 sale that's ${money(commissionAmount(800_000, R.typical))} before GST.`}
        context={`Published averages run ${pct(R.low)} to ${pct(R.high)}, before GST, and it's negotiable`}
      />

      <h2 id="examples">Worked examples by sale price</h2>
      <p>
        Because commission is a percentage, the dollar figure scales with your
        sale price. The table below shows the QLD figures across a few common
        price points, at the lowest published average ({pct(R.low)}), the state
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
          {workedExamples("QLD").map((w) => (
            <tr key={w.price}><td>{money(w.price)}</td><td>{money(w.low)}</td><td>{money(w.typical)}</td><td>{money(w.high)}</td></tr>
          ))}
        </tbody>
      </table>

      <p>
        These figures exclude GST, which usually adds 10% on top of the
        commission. For an exact figure on your own sale price, run the numbers
        through{" "}
        <Link href="/real-estate-commission-calculator">our commission calculator</Link>,
        which has a QLD setting.
      </p>

      <h2 id="structure">How commission is structured in QLD</h2>
      <p>
        Most Queensland agents charge a single flat percentage of the sale price,
        for example 2.5% across the whole amount. Some offer a tiered or
        performance-based structure instead, where a lower base rate applies up to
        an agreed target price and a higher rate kicks in above it. A
        performance structure can align the agent&rsquo;s incentive with yours,
        because they earn more only if they push the price beyond the target, so
        it is worth asking about on a sale where you think there is upside.
      </p>
      <p>
        Whichever structure you choose, &quot;no sale, no fee&quot; is the norm in
        Queensland. Commission is generally only payable if the property actually
        sells, usually at settlement from the proceeds, so the agent carries the
        risk of an unsuccessful campaign on the commission itself.
      </p>
      <p>
        What the commission covers is the agent&rsquo;s service: the appraisal and
        pricing advice, listing the property, running open homes and private
        inspections, qualifying buyers, and most importantly negotiating on your
        behalf to achieve the best price and terms. What it does{" "}
        <em>not</em> usually cover is marketing. Photography, portal listings on
        the major sites, signboards, floor plans, video and any styling are
        charged separately, and that marketing is often payable whether or not the
        property sells.
      </p>

      <Callout variant="info" title="Separate the commission from the marketing">
        <p>
          When you compare agents, line up two numbers side by side: the
          commission percentage (and whether it includes GST) and the marketing
          budget on top. Two agents on the same 2.5% rate can have very different
          marketing packages, and the marketing is the part you usually pay even
          if the home does not sell. Our{" "}
          <a href="/real-estate-commission-calculator">commission calculator</a>{" "}
          sizes the commission line for your price so you can weigh the rest
          against it.
        </p>
      </Callout>

      <h2 id="negotiable">Is commission negotiable in QLD?</h2>
      <p>
        Yes. Commission in Queensland is deregulated, which means there is no
        legislated rate and each agency sets its own pricing. The percentage on
        the first agency agreement you read is an opening number, not a fixed
        price, and most sellers do not realise how much room there is to move.
      </p>
      <p>How to negotiate well in a QLD market:</p>
      <ol>
        <li>
          <strong>Compare two or three agents.</strong> Getting competing quotes
          gives you both leverage and a sense of what is normal for your suburb
          and price point. Pick agents who genuinely sell your type of property
          where you live.
        </li>
        <li>
          <strong>Negotiate on the rate and the marketing.</strong> The
          percentage is only half the cost. A lower rate paired with an inflated
          marketing package can cost you more overall, so push on both and ask
          what each marketing line item actually adds.
        </li>
        <li>
          <strong>Ask about a performance clause.</strong> A tiered structure that
          rewards the agent above a target price can be a better deal than simply
          shaving the base rate, because it ties their upside to yours.
        </li>
        <li>
          <strong>Be wary of the cheapest quote.</strong> The lowest rate is not
          the same as the best outcome. An extra $20,000 on the price covers the $1,600 gap between a 1.8% and a 2% quote on $800,000 more than twelve times, so compare agents on results before rates.
        </li>
      </ol>

      <PullQuote attribution="Andy McMaster, Editor">
        Commission in Queensland is deregulated, so the rate is whatever the agent
        wrote down. That makes it negotiable by definition, not a fixed cost you
        have to accept.
      </PullQuote>

      <p>
        Queensland agents are licensed and regulated through the Office of Fair
        Trading Queensland, and many belong to the Real Estate Institute of
        Queensland (REIQ), the state&rsquo;s peak industry body. Membership and
        licensing are about conduct and standards, not pricing, so neither sets
        the commission you pay. That remains a commercial matter between you and
        the agent, which is exactly why it is open to negotiation.
      </p>

      <h2 id="other-costs">Commission vs the rest of your selling costs</h2>
      <p>
        Commission is the largest single cost of selling, but it is not the only
        one. On top of the agent&rsquo;s fee you will usually pay for marketing
        and photography, conveyancing or legal work, some presentation and
        styling, and, if you have a loan, a mortgage discharge fee at settlement.
        If the property is an investment rather than your main home, capital gains
        tax can be the biggest cost of all.
      </p>
      <p>
        To see how commission fits into the full picture, read{" "}
        <Link href="/guides/cost-of-selling-a-house-australia">the full cost of selling</Link>,
        which walks through every line item with a worked example. For how
        commission and fees compare across the rest of the country, the{" "}
        <Link href="/guides/real-estate-agent-fees-australia">national agent fees guide</Link>{" "}
        sets out the ranges state by state and what is and is not included.
      </p>

      <MatchCTA kind="selling-agent" />

      <SellingCostTable state="QLD" />

      <h2 id="next-steps">Getting an appraisal and the right agent</h2>
      <p>
        Knowing the commission range is only useful once you have a realistic
        sale price to apply it to, and an agent worth paying it to. Two steps put
        you in a strong position before any negotiation:
      </p>
      <ol>
        <li>
          <strong>Get a realistic price range first.</strong> A market-facing appraisal
          gives you a likely price range, which sizes the
          commission in real dollars. Our{" "}
          <Link href="/guides/how-much-is-my-house-worth-australia">guide to what your house is worth</Link>{" "}
          covers how to land on a realistic range.
        </li>
        <li>
          <strong>Choose the agent, then negotiate the fee.</strong> The right
          agent matters more than the cheapest rate. Our{" "}
          <Link href="/guides/how-to-choose-a-selling-agent">guide to choosing a selling agent</Link>{" "}
          covers the interview, the over-quote trap and exactly what to negotiate.
        </li>
      </ol>
      <p>
        Once you know your number and your shortlist, the free selling guide pulls
        the whole process together, including the fee benchmarks and the questions
        that catch over-priced agents out, personalised to your suburb.
      </p>

      <MatchCTA kind="selling-agent" />

      <Sources items={QLD_COMMISSION_SOURCES} />
    </GuideArticleLayout>
  );
}

const QLD_COMMISSION_SOURCES: readonly SourceItem[] = [
  ...commissionSourceItems(stateSources("QLD")),
  { label: "Queensland Government: Seller disclosure scheme", href: "https://www.qld.gov.au/housing/buying-owning-home/seller-disclosure-scheme", note: "The seller disclosure statement (Form 2) required since 1 August 2025" },
  { label: "WhichRealEstateAgent, Brisbane Real Estate Agent Fees [2026 Guide] (many agents still quote 5% of the first $18,000, then 2.5% of the balance)", href: "https://whichrealestateagent.com.au/agent-fees/real-estate-agent-commission-qld/", note: "updated 9 December 2025, read 11 October 2026" },
];
