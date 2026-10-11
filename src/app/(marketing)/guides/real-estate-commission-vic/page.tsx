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
const R = STATE_RATES.VIC;
const C = STATE_COMMISSION.VIC;
const REG = regionalRange("VIC");
const money = (n: number) => `$${n.toLocaleString("en-AU")}`;

const FRONTMATTER: GuideFrontmatter = {
  title: "Real Estate Commission VIC 2026: Melbourne Rates, Fees & Calculator",
  h1: "Real Estate Commission VIC 2026: Melbourne & VIC Rates, Fees & Calculator",
  description:
    "Melbourne and VIC agent commission: published averages 1.78% to 2.79%, a calculator preset to the VIC rate, dollar examples with GST, and how to negotiate.",
  slug: "real-estate-commission-vic",
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
  `Published averages for real estate commission in Melbourne and across Victoria run from ${pct(R.low)} (${whereInState("VIC", R.low)}) to ${pct(R.high)} (${whereInState("VIC", R.high)}), with a state average of ${pct(R.typical)} (OpenAgent, September 2026).`,
  `At the ${pct(R.typical)} state average, an $800,000 sale costs ${money(commissionAmount(800_000, R.typical))} in commission before GST, or ${money(commissionWithGst(800_000, R.typical))} with it.`,
  "Commission is a percentage of the final sale price, paid by the seller at settlement, and it is always negotiable.",
  "Most VIC agents work on \"no sale, no fee\", so commission is only payable if the property sells.",
  "Marketing, photography and styling are usually charged separately, on top of the commission rate.",
  "Commission is not regulated or fixed in Victoria, so compare two or three agents and get the rate in writing.",
];

const TOC: GuideTOCEntry[] = [
  { id: "calculator",   label: "Commission calculator" },
  { id: "average-commission", label: "Average commission in VIC" },
  { id: "worked-examples",    label: "Worked examples by sale price" },
  { id: "how-structured",     label: "How commission is structured" },
  { id: "negotiable",         label: "Is commission negotiable?" },
  { id: "other-costs",        label: "Commission vs other selling costs" },
  { id: "agreement",    label: "What the agency agreement must say" },
  { id: "cost-table",   label: "What it costs to sell in Victoria" },
  { id: "next-steps",         label: "Getting the right agent and fee" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is the average real estate commission in VIC?",
    answer:
      `OpenAgent's Victorian state average is ${pct(R.typical)} of the sale price (September 2026), with Melbourne at ${pct(C.capital.rate)} and regional areas from ${pct(REG!.low)} to ${pct(REG!.high)}; bRight Agent's median across Victorian postcodes is ${pct(C.median)} (February 2026). It is charged on the final sale price and paid by the seller at settlement: at ${pct(R.typical)}, an $800,000 sale costs ${money(commissionAmount(800_000, R.typical))} before GST. There is no official or fixed rate, and Consumer Affairs Victoria says the agent must tell you commission is negotiable before you sign.`,
  },
  {
    question: "How much do real estate agents charge in Victoria?",
    answer:
      `Most Victorian agents charge a percentage of the sale price, and published averages run from ${pct(R.low)} to ${pct(R.high)}. On a $600,000 sale that is ${money(commissionAmount(600_000, R.low))} to ${money(commissionAmount(600_000, R.high))}, and on a $1,000,000 sale ${money(commissionAmount(1_000_000, R.low))} to ${money(commissionAmount(1_000_000, R.high))}, before GST. Commission almost always sits separately from marketing, which is billed on top. Because rates are not set by law in Victoria, the only way to know what you will pay is to get written quotes from a few local agents.`,
  },
  {
    question: "Is real estate commission negotiable in VIC?",
    answer:
      "Yes. Commission is deregulated in Victoria, which means agents set their own rates and the percentage you are first quoted is a starting point, not a fixed price. To negotiate well, compare two or three agents, negotiate on both the rate and the marketing budget, and be wary of the cheapest quote if it comes with a weaker campaign. Shaving even a fraction of a per cent off a typical sale price is real money, so it is worth the conversation.",
  },
  {
    question: "Do you pay commission if the house doesn't sell?",
    answer:
      "Generally no. Most Victorian agents work on a \"no sale, no fee\" basis, so commission is only payable if and when the property sells, usually at settlement from the sale proceeds. Marketing costs are different. Photography, portal listings and advertising are usually billed separately and are often payable whether or not the property sells. Always check exactly when commission is triggered, and what happens to marketing if the campaign is withdrawn, before you sign the agency agreement.",
  },
  {
    question: "Does commission include GST in VIC?",
    answer:
      "Usually not in the headline number. Real estate commission in Victoria normally attracts 10% GST on top of the quoted rate, so a 2% commission costs 2.2% once GST is added. Some agents quote the rate inclusive of GST and some quote it exclusive, which makes a real difference to the final bill. Always ask whether the rate you are being quoted includes GST so you are comparing agents on the same basis.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Commission Calculator",                href: "/real-estate-commission-calculator",        description: "Work out commission on your VIC sale price." },
  { title: "The Cost of Selling a House",           href: "/guides/cost-of-selling-a-house-australia",  description: "Every selling cost beyond commission." },
  { title: "Real Estate Agent Fees (National)",     href: "/guides/real-estate-agent-fees-australia",   description: "How fees and commission work across Australia." },
  { title: "How to Choose a Selling Agent",         href: "/guides/how-to-choose-a-selling-agent",      description: "Pick the right agent, then negotiate the fee." },
  { title: "How Much Is My House Worth?",           href: "/guides/how-much-is-my-house-worth-australia", description: "Get a realistic price range before you list." },
];

export default function RealEstateCommissionVicPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={[...FAQS, COMMISSION_PAA_FAQ.VIC]}
      related={RELATED}
    >
      <CommissionCalculatorEmbed state="VIC" />
      <p>
        Selling in another state? See{" "}
        <Link href="/guides/real-estate-agent-fees-australia">real estate agent fees in every state</Link>.
      </p>

      <Callout variant="warning" title="Commission isn't fixed, and it's always negotiable">
        <p>
          There is no official or regulated commission rate in Victoria.
          Commission is negotiable, so the percentages in this guide are
          published averages and medians, each named and dated in the table
          below, not set rates, and your quote will vary by agent, suburb and
          property value. Treat every number here as indicative, get written
          quotes from your own local agents, and confirm the current rate
          (and whether GST is included) before you rely on it.
        </p>
      </Callout>

      <EditorNote>
        <p>
          In Victoria the commission line is where most sellers leave money on
          the table, because they assume it&rsquo;s a set rate. It isn&rsquo;t.
          Two homes on the same street can sell for the same price and pay very
          different commission, purely because one seller asked for the rate in
          writing and compared a couple of agents, and the other accepted the
          first number. Do the first thing.
        </p>
      </EditorNote>

      <h2 id="average-commission">Average real estate commission in VIC</h2>
      <p className="lead">
        {stateRateSummary("VIC")} Commission is paid by the seller, charged as a
        percentage of what the property actually sells for, and it is always
        negotiable.
      </p>
      <StateCommissionTable state="VIC" price={800_000} />
      <p>
        Rates are lower in Melbourne than in regional Victoria: OpenAgent puts
        Melbourne&rsquo;s average at {pct(C.capital.rate)}, against {pct(REG!.low)} to{" "}
        {pct(REG!.high)} across the regional areas it publishes. Victoria&rsquo;s
        state average of {pct(R.typical)} compares with {pct(STATE_RATES.NSW.typical)} in
        New South Wales and {pct(STATE_RATES.QLD.typical)} in Queensland on the same
        measure.
      </p>

      <KeyFigure
        value={pct(R.typical)}
        label={`OpenAgent's VIC state average commission (September 2026). On an $800,000 sale that's ${money(commissionAmount(800_000, R.typical))} before GST.`}
        context={`Published averages run ${pct(R.low)} to ${pct(R.high)}, before GST, and it's negotiable`}
      />

      <p>
        Commission is normally quoted before GST, and in Victoria it usually
        attracts <strong>10% GST on top</strong> of the rate. A 2% commission
        therefore costs 2.2% once GST is added. Agents differ on
        whether they show the rate inclusive or exclusive of GST, so always ask
        which one you are being quoted before you compare.
      </p>

      <h2 id="worked-examples">Worked examples by sale price</h2>
      <p>
        Because commission is a percentage, the dollar figure scales with your
        sale price. Here are the Victorian figures in dollars across common sale
        prices, at the lowest published average ({pct(R.low)}), the state average
        ({pct(R.typical)}) and the highest published average ({pct(R.high)}).
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
          {workedExamples("VIC").map((w) => (
            <tr key={w.price}><td>{money(w.price)}</td><td>{money(w.low)}</td><td>{money(w.typical)}</td><td>{money(w.high)}</td></tr>
          ))}
        </tbody>
      </table>

      <p>
        These figures exclude GST, which is normally added on top, and they
        cover commission only, not marketing. For an exact figure on your own
        sale price, run it through{" "}
        <Link href="/real-estate-commission-calculator">our commission calculator</Link>,
        which has a VIC setting.
      </p>

      <h2 id="how-structured">How commission is structured in VIC</h2>
      <p>
        Most Victorian agents charge a single flat percentage of the sale price,
        for example 2% across the board. Some offer a tiered or
        performance-based structure instead, where a higher percentage applies
        to the amount achieved above an agreed target price. A performance
        structure can align the agent&rsquo;s incentive with yours, since they
        earn more only if they sell for more, and it is worth asking about on a
        competitive sale.
      </p>

      <PullQuote attribution="Andy McMaster, Editor">
        The commission rate is the line most Victorian sellers accept at face
        value. It&rsquo;s the one most worth negotiating, and on a &ldquo;no
        sale, no fee&rdquo; deal you only pay it if the agent delivers.
      </PullQuote>

      <p>
        Almost all Victorian agents work on a <strong>&ldquo;no sale, no
        fee&rdquo;</strong> basis. Commission is only payable if the property
        sells, and it comes out of the sale proceeds at settlement rather than
        upfront. That means the commission rate is genuinely at risk for the
        agent, which is part of why it is negotiable.
      </p>
      <p>What the commission rate generally includes:</p>
      <ul>
        <li><strong>Appraisal and pricing strategy</strong>, including a recommended price range or reserve</li>
        <li><strong>Listing and campaign management</strong> across the sale</li>
        <li><strong>Open homes and private inspections</strong>, run and managed by the agent</li>
        <li><strong>Negotiation</strong> with buyers on your behalf to achieve the best price and terms</li>
        <li><strong>Coordination with your conveyancer</strong> through to exchange and settlement</li>
      </ul>
      <p>What is usually charged separately, on top of commission:</p>
      <ul>
        <li><strong>Marketing and advertising</strong>, including portal listings on the major property sites and signboards</li>
        <li><strong>Professional photography and video</strong></li>
        <li><strong>Property styling or staging</strong>, where you choose to use it</li>
      </ul>
      <p>
        Marketing is usually payable whether or not the property sells, so
        confirm the marketing budget and when it is due separately from the
        commission rate.
      </p>

      <h2 id="negotiable">Is commission negotiable in VIC?</h2>
      <p>
        Yes. Commission is <strong>deregulated</strong> in Victoria, which means
        there is no official rate set by government and agents are free to set
        their own. The Real Estate Institute of Victoria (REIV) is the industry
        body, but it does not fix commission, and agents are licensed and
        regulated through Consumer Affairs Victoria rather than through any
        scheme that sets prices. The rate on the first agency agreement you read
        is an opening number, not a fixed fee.
      </p>
      <p>How to negotiate well in Victoria:</p>
      <ol>
        <li>
          <strong>Compare two or three agents.</strong> Get written quotes from
          agents who actually sell your type of property in your suburb. Competing
          quotes give you both leverage and a sense of what is fair locally.
        </li>
        <li>
          <strong>Negotiate the rate and the marketing.</strong> The headline
          commission is only part of the cost. Push on the marketing budget too,
          since that is where packages quietly balloon, and clarify whether GST
          is included in the rate.
        </li>
        <li>
          <strong>Be wary of the cheapest quote.</strong> The lowest rate is not
          automatically the best value. An extra $20,000 on the price covers the $1,600 gap between a 1.8% and a 2% quote on $800,000 more than twelve times, so compare agents on results before rates. Weigh the rate
          against the campaign and the agent&rsquo;s track record, not in isolation.
        </li>
      </ol>

      <MatchCTA kind="selling-agent" />

      <h2 id="other-costs">Commission vs the rest of your selling costs</h2>
      <p>
        Commission is the largest cost of selling in Victoria, but it is not the
        only one. On top of the agent&rsquo;s fee you will usually pay for
        marketing and photography, conveyancing or legal work, and some
        presentation before listing, and if the property is an investment rather
        than your home there can be capital gains tax to consider.
      </p>
      <p>
        For the full picture of what selling costs beyond the agent&rsquo;s
        commission, read{" "}
        <Link href="/guides/cost-of-selling-a-house-australia">the full cost of selling</Link>.
        And to see how Victorian commission compares with the rest of the
        country and what is and isn&rsquo;t included nationally, the{" "}
        <Link href="/guides/real-estate-agent-fees-australia">national agent fees guide</Link>{" "}
        sets out the rates by state.
      </p>

      <h2 id="agreement">What your agency agreement must say about commission</h2>
      <p>
        In Victoria the agency agreement is a sales authority. Under the Estate
        Agents Act 1980 the agent cannot recover commission or outgoings unless
        the authority is in writing, signed by you, states the commission and
        expenses (as a dollar figure, or a percentage with a dollar example),
        and you were given a copy. It must also state the agent&rsquo;s estimated
        selling price, a single figure or a range of up to 10%, and Consumer
        Affairs Victoria says the agent must tell you commission and expenses
        are negotiable before you sign. Any rebate the agent receives on
        advertising must be passed to you. There is no cooling-off period on a
        sales authority, so read it before you sign.
      </p>
      <p>
        Our guide to{" "}
        <Link href="/guides/real-estate-agency-agreements-by-state">agency agreements by state</Link>{" "}
        covers the clauses worth changing first. If you are weighing a flat fee instead of a percentage, see{" "}
        <Link href="/guides/fixed-fee-vs-commission-real-estate-agents">flat fee agents</Link>{" "}
        and what they leave out.
      </p>

      <SellingCostTable state="VIC" />

      <h2 id="next-steps">Getting the right agent and fee</h2>
      <p>
        The cheapest commission rarely beats the agent who sells your home for
        more. The order that saves the most money is to size the fee, choose the
        right agent, then negotiate the rate, not the other way around.
      </p>
      <ol>
        <li>
          <strong>Size the fee for your price.</strong> Run your expected sale
          price through the{" "}
          <Link href="/real-estate-commission-calculator">commission calculator</Link>{" "}
          using the VIC setting so you know what {pct(R.typical)} means in dollars before any
          conversation.
        </li>
        <li>
          <strong>Get a real appraisal and pick the agent.</strong> A free
          appraisal from a local agent gives you a market-facing price, and our
          guide to{" "}
          <Link href="/guides/how-to-choose-a-selling-agent">how to choose a selling agent</Link>{" "}
          covers the interview, the over-quote trap and what to negotiate.
        </li>
        <li>
          <strong>Get the full process in one place.</strong> The free selling
          guide pulls costs, agent selection and the timeline into a single PDF,
          personalised to your suburb.
        </li>
      </ol>

      <MatchCTA kind="selling-agent" />

      <Sources items={VIC_COMMISSION_SOURCES} />
    </GuideArticleLayout>
  );
}

const VIC_COMMISSION_SOURCES: readonly SourceItem[] = [
  ...commissionSourceItems(stateSources("VIC")),
  { label: "Consumer Affairs Victoria: Selling property", href: "https://www.consumer.vic.gov.au/housing/buying-and-selling-property/selling-property", note: "The Section 32 vendor statement and the selling process in Victoria" },
];
