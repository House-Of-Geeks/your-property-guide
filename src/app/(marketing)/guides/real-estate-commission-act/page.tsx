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
  stateSources,
  workedExamples,
} from "@/lib/data/commission-rates";

// Every rate on this page comes from the sourced table in
// src/lib/data/commission-rates.ts (commercial-intent review, 10 Oct 2026, 0.1).
const R = STATE_RATES.ACT;
const C = STATE_COMMISSION.ACT;
const money = (n: number) => `$${n.toLocaleString("en-AU")}`;

const FRONTMATTER: GuideFrontmatter = {
  title: "Real Estate Commission ACT 2026: Canberra Rates, Fees & Calculator",
  h1: "Real Estate Commission ACT 2026: Canberra & ACT Rates, Fees & Calculator",
  description:
    "Canberra and ACT agent commission: published figures 1.78% to 2.23%, a calculator preset to the ACT rate, dollar examples with GST, and how to negotiate.",
  slug: "real-estate-commission-act",
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
  `Published figures for real estate commission in Canberra and the ACT run from ${pct(R.low)} (OpenAgent's Canberra and ACT average, September 2026) to ${pct(R.high)} (bRight Agent's ACT median, February 2026).`,
  "Commission is a percentage of the final sale price, paid by the seller out of the proceeds at settlement, and it is negotiable.",
  `At the ${pct(R.typical)} average, an $800,000 sale works out to ${money(commissionAmount(800_000, R.typical))} in commission before GST, or ${money(commissionWithGst(800_000, R.typical))} with it.`,
  "Commission usually attracts 10% GST on top, and quotes vary on whether that GST is shown, so always ask.",
  "Most ACT agents work on a \"no sale, no fee\" basis, so commission is only payable if the property actually sells.",
  "Commission is always negotiable in the ACT. Compare two or three agents and negotiate the rate and the marketing budget together.",
];

const TOC: GuideTOCEntry[] = [
  { id: "calculator",   label: "Commission calculator" },
  { id: "average",     label: "Average real estate commission in ACT" },
  { id: "examples",    label: "Worked dollar examples" },
  { id: "structure",   label: "How commission is structured in ACT" },
  { id: "negotiable",  label: "Is commission negotiable in ACT?" },
  { id: "other-costs", label: "Commission vs the rest of your selling costs" },
  { id: "cost-table",   label: "What it costs to sell in the ACT" },
  { id: "next-steps",  label: "Get the right agent first" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is the average real estate commission in ACT?",
    answer:
      `OpenAgent's average for Canberra and the ACT is ${pct(R.typical)} of the sale price (September 2026), the lowest state or territory average it publishes; bRight Agent's ACT median is ${pct(C.median)} (February 2026), also the lowest state median in its report. Commission is charged as a percentage of the final sale price, and the agency agreement must state it, or how it is worked out, with the dollar amount at an estimated sale price. It is negotiable, so the rate you are first quoted is a starting point.`,
  },
  {
    question: "How much do real estate agents charge in the Australian Capital Territory?",
    answer:
      `Most agents in the ACT charge a percentage commission, and published figures run from ${pct(R.low)} to ${pct(R.high)}, with 10% GST added where a quote excludes it. At ${pct(R.typical)}, a $600,000 sale is ${money(commissionAmount(600_000, R.typical))} in commission, a $1,000,000 sale ${money(commissionAmount(1_000_000, R.typical))}, and a $1,500,000 sale ${money(commissionAmount(1_500_000, R.typical))}, all before GST. Marketing and advertising are charged separately. Because commission scales with the sale price, the dollar figure matters more than the headline rate, so run your own price through a calculator before you compare agents.`,
  },
  {
    question: "Is real estate commission negotiable in ACT?",
    answer:
      "Yes. Commission is deregulated in the ACT, so there is no official or fixed rate and agents set their own fees. That means the percentage is open to negotiation. The way to negotiate well is to get appraisals from two or three local agents, compare the rate against the service and the marketing budget rather than in isolation, and ask each agent to justify their number. Be wary of the cheapest quote if it comes with a thin campaign or a less experienced negotiator, because the dollar result matters more than the rate: on $800,000 each 0.1% is $800 before GST.",
  },
  {
    question: "Do you pay commission if the house doesn't sell?",
    answer:
      "Generally no. Most ACT agents work on a \"no sale, no fee\" basis, so commission is only payable if the property actually sells, usually at settlement from the sale proceeds. Marketing and advertising costs are different. They are often payable whether or not the property sells, and sometimes up front, so confirm exactly what you are liable for in the agency agreement before you sign.",
  },
  {
    question: "Does commission include GST in ACT?",
    answer:
      "Usually not in the headline number. Real estate commission in the ACT typically attracts 10% GST on top of the quoted rate, and quotes vary on whether they show the figure inclusive or exclusive of GST. A 2% commission on an $800,000 sale is $16,000 before GST and $17,600 with GST added. Always ask each agent whether their quote includes GST so you are comparing like with like.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Commission Calculator",               href: "/real-estate-commission-calculator",      description: "Work out commission on your ACT sale price." },
  { title: "The Cost of Selling a House",          href: "/guides/cost-of-selling-a-house-australia", description: "Every selling cost beyond commission." },
  { title: "Real Estate Agent Fees (National)",    href: "/guides/real-estate-agent-fees-australia", description: "How fees and commission work across Australia." },
  { title: "How to Choose a Selling Agent",        href: "/guides/how-to-choose-a-selling-agent",    description: "Pick the right agent, then negotiate the fee." },
  { title: "How Much Is My House Worth?",          href: "/guides/how-much-is-my-house-worth-australia", description: "Get a realistic price range before you list." },
];

export default function RealEstateCommissionACTPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={[...FAQS, COMMISSION_PAA_FAQ.ACT]}
      related={RELATED}
    >
      <CommissionCalculatorEmbed state="ACT" />
      <p>
        Selling in another state? See{" "}
        <Link href="/guides/real-estate-agent-fees-australia">real estate agent fees in every state</Link>.
      </p>

      <Callout variant="warning" title="Commission is not a fixed or official rate">
        <p>
          Real estate commission in the ACT is not regulated or fixed, and it is
          always negotiable. The figures in this guide are published averages and
          medians, each named and dated in the table below, not official rates,
          and your quote will vary by agent, suburb and property type.
          Treat every number here as indicative and get written quotes from your
          own local agents before you rely on it. Check whether each quote
          includes GST.
        </p>
      </Callout>

      <EditorNote>
        <p>
          Canberra is a small, tightly contested market, which works in a
          seller&rsquo;s favour on fees. Agents here compete hard for listings,
          and because property values sit relatively high the dollar value of
          even a modest percentage is real money to them. That is exactly why the
          rate is worth a conversation. Don&rsquo;t accept the first number on
          the agency agreement as if it were set by law, because it isn&rsquo;t.
        </p>
      </EditorNote>

      <h2 id="average">Average real estate commission in ACT</h2>
      <p className="lead">
        Published figures for Canberra and the ACT run from {pct(R.low)} (OpenAgent&rsquo;s
        average, September 2026) to {pct(R.high)} (bRight Agent&rsquo;s median,
        February 2026). Commission is charged as a percentage of what your
        property sells for, paid by you as the seller out of the proceeds at
        settlement, and it is negotiable.
      </p>
      <StateCommissionTable state="ACT" price={800_000} />
      <p>
        Both measures put the ACT at the bottom of the national table: its
        average is the lowest state or territory average OpenAgent publishes,
        and its median is the lowest state median in bRight Agent&rsquo;s 2026
        report. OpenAgent publishes no separate regional figure for the ACT.
      </p>
      <p>
        Because commission is a percentage, the dollar amount scales with your
        sale price. At the same {pct(R.typical)} rate, a higher sale price simply means a
        higher fee in dollars, which is why the absolute figure matters more than
        the headline rate when you compare agents.
      </p>

      <KeyFigure
        value={pct(R.typical)}
        label={`OpenAgent's ACT state average commission (September 2026). On an $800,000 sale that's ${money(commissionAmount(800_000, R.typical))} before GST.`}
        context={`Published averages run ${pct(R.low)} to ${pct(R.high)}, before GST, and it's negotiable`}
      />

      <h2 id="examples">Worked dollar examples</h2>
      <p>
        Here is what the published ACT figures look like in dollars across a few
        sale prices: the {pct(R.typical)} average, the {pct(R.high)} median, and
        the average with 10% GST added.
      </p>

      <table>
        <thead>
          <tr>
            <th>Sale price</th>
            <th>At {pct(R.typical)} (Canberra and ACT average)</th>
            <th>At {pct(R.high)} (ACT median)</th>
            <th>At {pct(R.typical)}, with GST</th>
          </tr>
        </thead>
        <tbody>
          {workedExamples("ACT").map((w) => (
            <tr key={w.price}><td>{money(w.price)}</td><td>{money(w.typical)}</td><td>{money(w.high)}</td><td>{money(w.typicalWithGst)}</td></tr>
          ))}
        </tbody>
      </table>

      <p>
        These figures exclude GST, which usually applies on top. For an exact
        figure on your own sale price, use{" "}
        <Link href="/real-estate-commission-calculator">our commission calculator</Link>,
        which has an ACT setting.
      </p>

      <h2 id="structure">How commission is structured in ACT</h2>
      <p>
        Most ACT agents charge a single flat percentage of the sale price, for
        example {pct(R.typical)} across the whole price. Some will offer a tiered or
        performance-based structure instead, where the rate steps up on the
        amount above an agreed target price. A performance incentive can align
        the agent&rsquo;s interests with yours, because they earn more only if
        they push the price past the threshold, so it is worth asking about if
        you expect a competitive campaign.
      </p>
      <p>
        The norm in the ACT is <strong>&quot;no sale, no fee&quot;</strong>. That
        means commission is only payable if the property actually sells, so the
        agent carries the risk of an unsold listing rather than you. Commission
        is then taken from the sale proceeds at settlement, not paid up front.
      </p>
      <p>What the commission generally covers:</p>
      <ul>
        <li><strong>Appraisal and pricing strategy.</strong> Assessing the property and recommending a price range or method of sale.</li>
        <li><strong>Listing and campaign management.</strong> Running the sale process from listing through to settlement.</li>
        <li><strong>Open homes and inspections.</strong> Hosting inspections and qualifying buyers.</li>
        <li><strong>Negotiation.</strong> Negotiating with buyers on your behalf to achieve the best price and terms.</li>
      </ul>
      <p>What is usually charged separately, on top of commission:</p>
      <ul>
        <li><strong>Marketing and advertising.</strong> Portal listings, signboards and any paid promotion.</li>
        <li><strong>Photography and video.</strong> Professional photos, floor plans and any drone or video work.</li>
        <li><strong>Styling and presentation.</strong> Hired furniture and styling, where used.</li>
      </ul>
      <p>
        Marketing is the line that most often surprises sellers, because it is
        billed separately and is frequently payable whether or not the property
        sells. Confirm the marketing budget and when it is due before you sign.
      </p>

      <PullQuote attribution="Andy McMaster, Editor">
        In a market as compact as Canberra, the headline rate is only half the
        conversation. The marketing budget on top is where the other half hides,
        so negotiate both.
      </PullQuote>

      <h2 id="negotiable">Is commission negotiable in ACT?</h2>
      <p>
        Yes. Commission is <strong>deregulated</strong> in the ACT, which means
        there is no official, legislated or fixed rate. Agents set their own
        fees, so the percentage on the first agency agreement you read is an
        opening number, not a fixed price. Most sellers don&rsquo;t realise this,
        which is exactly why it is worth the conversation.
      </p>
      <p>How to negotiate well in the ACT:</p>
      <ol>
        <li>
          <strong>Compare two or three agents.</strong> Get appraisals and written
          fee quotes from agents who actively sell your type of property in your
          part of Canberra. Competing quotes give you both leverage and a sense
          of what is fair.
        </li>
        <li>
          <strong>Negotiate the rate and the marketing together.</strong> A lower
          commission paired with a large marketing package you didn&rsquo;t need
          is not a saving. Look at the total cost of the campaign, not just the
          percentage.
        </li>
        <li>
          <strong>Be wary of the cheapest.</strong> The lowest quote can mean a
          thinner campaign or a less experienced negotiator. An extra $20,000 on the price covers the $1,600 gap between a 1.8% and a 2% quote on $800,000 more than twelve times, so compare agents on results before rates.
        </li>
        <li>
          <strong>Ask whether GST is included.</strong> So you are comparing like
          with like across agents.
        </li>
      </ol>
      <p>
        For local context, the{" "}
        <a href="https://reiact.com.au" target="_blank" rel="noopener noreferrer">
          Real Estate Institute of the ACT (REIACT)
        </a>{" "}
        is the territory&rsquo;s industry body, and agents operating in the ACT
        are licensed and regulated through{" "}
        <a href="https://www.accesscanberra.act.gov.au" target="_blank" rel="noopener noreferrer">
          Access Canberra
        </a>
        . Checking that an agent is properly licensed is a sensible first step
        before you sign anything.
      </p>

      <h2 id="other-costs">Commission vs the rest of your selling costs</h2>
      <p>
        Commission is the largest single cost of selling, but it is not the only
        one. On top of the agent&rsquo;s fee you will usually pay for marketing
        and photography, conveyancing or legal work, and some presentation before
        listing. If you have a loan there is a small mortgage discharge fee, and
        if the property is an investment rather than your home, capital gains tax
        can be the biggest cost of all.
      </p>
      <p>
        To see how commission fits into the full picture, read{" "}
        <Link href="/guides/cost-of-selling-a-house-australia">the full cost of selling</Link>,
        and for how fees and commission compare across the country, see the{" "}
        <Link href="/guides/real-estate-agent-fees-australia">national agent fees guide</Link>.
      </p>

      <MatchCTA kind="selling-agent" />

      <SellingCostTable state="ACT" />

      <h2 id="next-steps">Get the right agent first</h2>
      <p>
        The cheapest commission rarely produces the best result. The agent who
        prices your home accurately and negotiates hardest usually nets you more
        than the one who simply quotes the lowest fee. So before you fixate on
        the rate, get a real appraisal and choose the right agent, then negotiate
        the commission with that agent.
      </p>
      <ol>
        <li>
          <strong>Get a realistic price range.</strong> A market-facing figure from a
          local agent is the starting point.{" "}
          <Link href="/guides/how-much-is-my-house-worth-australia">How much is my house worth?</Link>{" "}
          covers how to land on a realistic range.
        </li>
        <li>
          <strong>Choose the right agent.</strong> Our{" "}
          <Link href="/guides/how-to-choose-a-selling-agent">guide to choosing a selling agent</Link>{" "}
          covers the interview, the over-quote trap and what to negotiate.
        </li>
        <li>
          <strong>Size the cost.</strong> Run your price through the{" "}
          <Link href="/real-estate-commission-calculator">commission calculator</Link>{" "}
          so you know what commission means in dollars before any conversation.
        </li>
      </ol>

      <MatchCTA kind="selling-agent" />

      <Sources items={COMMISSION_ACT_SOURCES} />
    </GuideArticleLayout>
  );
}

const COMMISSION_ACT_SOURCES: readonly SourceItem[] = [
  ...commissionSourceItems(stateSources("ACT")),
  { label: "Civil Law (Sale of Residential Property) Act 2003 (ACT)", href: "https://www.legislation.act.gov.au/a/2003-40/", note: "The building, pest and energy efficiency reports an ACT seller must provide" },
  { label: "Access Canberra: Licensing for business, real estate and stock and station agents", href: "https://www.accesscanberra.act.gov.au/business-and-work/real-estate-and-property/licensing-for-business-real-estate-and-stock-and-station-agents", note: "Agents Act 2003 licensing; page updated 28 April 2026, read 11 October 2026" },
];
