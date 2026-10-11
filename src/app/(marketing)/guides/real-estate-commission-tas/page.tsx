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
const R = STATE_RATES.TAS;
const C = STATE_COMMISSION.TAS;
const REG = regionalRange("TAS");
const money = (n: number) => `$${n.toLocaleString("en-AU")}`;

const FRONTMATTER: GuideFrontmatter = {
  title: "Real Estate Commission TAS 2026: Hobart Rates, Fees & Calculator",
  h1: "Real Estate Commission TAS 2026: Hobart & TAS Rates, Fees & Calculator",
  description:
    "Hobart and Tasmanian agent commission: published figures 2.26% to 3.25%, a calculator preset to the TAS rate, dollar examples with GST, and how to negotiate.",
  slug: "real-estate-commission-tas",
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
  `Published figures for real estate commission in Hobart and across Tasmania run from ${pct(R.low)} (${whereInState("TAS", R.low)}) to ${pct(R.high)} (${whereInState("TAS", R.high)}), with a state average of ${pct(R.typical)} (OpenAgent, September 2026).`,
  "Commission is a percentage of the final sale price, paid by the seller out of the proceeds at settlement.",
  `At the ${pct(R.typical)} state average, a $600,000 sale works out to ${money(commissionAmount(600_000, R.typical))} in commission before GST, or ${money(commissionWithGst(600_000, R.typical))} with it.`,
  "Almost every agent works on a no sale, no fee basis, so commission is only owed once the property actually sells.",
  "Commission usually attracts 10% GST on top, and quotes vary on whether they show it, so always ask whether a rate is inclusive or exclusive.",
  "No Tasmanian scale sets the rate, so it is always negotiable. Compare two or three local agents and negotiate the rate and the marketing budget.",
];

const TOC: GuideTOCEntry[] = [
  { id: "calculator",   label: "Commission calculator" },
  { id: "average",      label: "Average commission in TAS" },
  { id: "worked",       label: "Worked dollar examples" },
  { id: "structure",    label: "How commission is structured" },
  { id: "negotiable",   label: "Is commission negotiable?" },
  { id: "other-costs",  label: "Commission vs the rest of your costs" },
  { id: "cost-table",   label: "What it costs to sell in Tasmania" },
  { id: "next-steps",   label: "Getting the right agent and price" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is the average real estate commission in TAS?",
    answer:
      `OpenAgent's Tasmanian state average is ${pct(R.typical)} of the sale price (September 2026), with Hobart at ${pct(C.capital.rate)} and the regions from ${pct(REG!.low)} to ${pct(REG!.high)}. bRight Agent's median across Tasmanian postcodes is ${pct(C.median)} (February 2026), the highest state median in its report, because it weights regional towns. These are published averages, not official or regulated rates, and the number you are first quoted is a starting point. Get the rate in writing from two or three local agents and check whether it includes GST.`,
  },
  {
    question: "How much do real estate agents charge in Tasmania?",
    answer:
      `Most Tasmanian agents charge a percentage commission on the sale price, and published figures run from ${pct(R.low)} to ${pct(R.high)}. At the ${pct(R.typical)} state average, a $600,000 sale costs ${money(commissionAmount(600_000, R.typical))} before GST, and an $800,000 sale ${money(commissionAmount(800_000, R.typical))}. On top of commission you generally pay separately for marketing and advertising, professional photography and any styling. Commission is paid from the sale proceeds at settlement, and almost all agents work on a no sale, no fee basis.`,
  },
  {
    question: "Is real estate commission negotiable in TAS?",
    answer:
      "Yes. There is no official or fixed rate in Tasmania: the Property Agents Board publishes no commission scale, and agents set their own. The percentage on the first agency agreement you read is an opening number, not a fixed price. The way to negotiate well is to get appraisals from two or three agents who actively sell in your area, compare the rate against the service and the marketing budget rather than in isolation, and ask each agent to justify their number. Be wary of simply taking the cheapest: on $800,000 the gap between 1.8% and 2% is $1,600 before GST, and an extra $20,000 on the price covers it more than twelve times.",
  },
  {
    question: "Do you pay commission if the house doesn't sell?",
    answer:
      "Generally no. Almost every Tasmanian agent works on a no sale, no fee basis, so commission is only payable once the property actually sells, and it comes out of the proceeds at settlement. Marketing and advertising costs are different. They are usually charged separately and are often payable whether or not the property sells, so confirm how marketing is billed before you sign. Check the agency agreement for any conditions around withdrawing the property or changing agents.",
  },
  {
    question: "Does commission include GST in TAS?",
    answer:
      "Commission usually attracts 10% GST on top of the headline rate, and quotes vary on whether they show it. Some agents quote a rate inclusive of GST and some quote it exclusive, so the same percentage can mean two slightly different dollar figures. Always ask whether the rate you have been quoted includes GST so you are comparing like with like across agents, and so the figure in the agency agreement matches what actually comes out at settlement.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Commission Calculator",               href: "/real-estate-commission-calculator",         description: "Work out commission on your TAS sale price." },
  { title: "The Cost of Selling a House",          href: "/guides/cost-of-selling-a-house-australia",  description: "Every selling cost beyond commission." },
  { title: "Real Estate Agent Fees (National)",    href: "/guides/real-estate-agent-fees-australia",   description: "How fees and commission work across Australia." },
  { title: "How to Choose a Selling Agent",        href: "/guides/how-to-choose-a-selling-agent",      description: "Pick the right agent, then negotiate the fee." },
  { title: "How Much Is My House Worth?",          href: "/guides/how-much-is-my-house-worth-australia", description: "Get a realistic price range before you list." },
];

export default function RealEstateCommissionTasPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={[...FAQS, COMMISSION_PAA_FAQ.TAS]}
      related={RELATED}
    >
      <CommissionCalculatorEmbed state="TAS" />
      <p>
        Selling in another state? See{" "}
        <Link href="/guides/real-estate-agent-fees-australia">real estate agent fees in every state</Link>.
      </p>

      <Callout variant="warning" title="These are published averages, not official rates">
        <p>
          Real estate commission in Tasmania is not regulated or fixed, and it
          is always negotiable. The figures in this guide are published averages
          and medians, each named and dated in the table below, not official
          rates, and your quote will vary by agent, suburb and property type. Always get current written quotes from your own local
          agents and check whether each rate includes GST before you rely on it.
        </p>
      </Callout>

      <EditorNote>
        <p>
          Tasmanian sellers tend to focus on the sale price and accept the
          commission rate as if it were set in stone. It isn&rsquo;t. There is no
          official rate in this state, so the percentage on the first agreement
          you read is an opening position. Get it in writing, compare a couple of
          local agents, and confirm whether GST is on top before you sign
          anything.
        </p>
      </EditorNote>

      <h2 id="average">Average real estate commission in TAS</h2>
      <p className="lead">
        {stateRateSummary("TAS")} Commission is charged as a percentage of what
        the property sells for, so a higher sale price means a higher fee in
        dollar terms even at the same rate. It is paid by the seller, out of the
        proceeds, at settlement.
      </p>
      <StateCommissionTable state="TAS" price={600_000} />
      <p>
        Tasmania sits above the larger mainland capitals on both measures.
        OpenAgent puts Hobart at {pct(C.capital.rate)}, against{" "}
        {pct(STATE_COMMISSION.NSW.capital.rate)} in Sydney and{" "}
        {pct(STATE_COMMISSION.VIC.capital.rate)} in Melbourne, and bRight
        Agent&rsquo;s Tasmanian median of {pct(C.median)} is the highest state
        median in its 2026 report.
      </p>

      <KeyFigure
        value={pct(R.typical)}
        label={`OpenAgent's TAS state average commission (September 2026). On an $800,000 sale that's ${money(commissionAmount(800_000, R.typical))} before GST.`}
        context={`Published averages run ${pct(R.low)} to ${pct(R.high)}, before GST, and it's negotiable`}
      />

      <p>
        Within that range, where your rate lands depends on the property, the
        location and the agent: Hobart&rsquo;s average is the lowest published
        Tasmanian figure and the regional areas run from {pct(REG!.low)} to{" "}
        {pct(REG!.high)}. None of these are fixed, which is exactly
        why comparing local agents matters.
      </p>

      <h2 id="worked">Worked dollar examples</h2>
      <p>
        Because commission is a percentage, the easiest way to understand it is in
        dollars. The table below shows what commission works out to at the
        lowest published Tasmanian figure ({pct(R.low)}), the state average
        ({pct(R.typical)}) and the highest ({pct(R.high)}).
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
          {workedExamples("TAS").map((w) => (
            <tr key={w.price}><td>{money(w.price)}</td><td>{money(w.low)}</td><td>{money(w.typical)}</td><td>{money(w.high)}</td></tr>
          ))}
        </tbody>
      </table>

      <p>
        These figures exclude GST, which usually applies on top. For an exact
        amount on your own sale price, use{" "}
        <Link href="/real-estate-commission-calculator">our commission calculator</Link>,
        which has a TAS setting built in.
      </p>

      <h2 id="structure">How commission is structured in TAS</h2>
      <p>
        Most Tasmanian agents charge a single flat percentage on the whole sale
        price, which is the simplest and most common structure. Some will offer a
        tiered or performance-based arrangement instead, where the rate steps up
        on the portion of the price above an agreed target. A performance
        structure can align the agent&rsquo;s incentive with yours, since they
        earn more only if they push the result higher, and it is worth asking
        about when you compare agents.
      </p>
      <p>
        Whichever structure you agree, the standard across the state is{" "}
        <strong>no sale, no fee</strong>. Commission is only payable once the
        property actually sells, and it comes out of the proceeds at settlement,
        so you do not pay it up front.
      </p>

      <PullQuote attribution="Andy McMaster, Editor">
        There is no official commission rate in Tasmania. The percentage you&rsquo;re
        first quoted is a starting point, not a fixed price.
      </PullQuote>

      <p>
        What the commission covers and what is billed separately catches a lot of
        sellers out. Commission generally includes the agent&rsquo;s core work:
      </p>
      <ul>
        <li><strong>Appraisal and pricing.</strong> Assessing the property and recommending a price or reserve.</li>
        <li><strong>Listing and management.</strong> Getting the property to market and running the campaign.</li>
        <li><strong>Open homes and inspections.</strong> Hosting buyers and qualifying enquiry.</li>
        <li><strong>Negotiation.</strong> Negotiating with buyers on your behalf through to an agreed price and terms.</li>
      </ul>
      <p>
        Commission does <em>not</em> usually cover the costs of promoting the
        property, which are charged separately on top:
      </p>
      <ul>
        <li><strong>Marketing and advertising.</strong> Listings on the major portals, signboards and any print or digital campaign.</li>
        <li><strong>Photography.</strong> Professional photos, and sometimes video or aerial shots.</li>
        <li><strong>Styling.</strong> Optional staging or hired furniture to present the home, where it is worth the spend.</li>
      </ul>
      <p>
        Marketing is also usually payable whether or not the property sells, so
        clarify how it is billed before you sign the agency agreement.
      </p>

      <h2 id="negotiable">Is commission negotiable in TAS?</h2>
      <p>
        Yes. There is no official rate in Tasmania: the Property Agents Board,
        which regulates agents, publishes no commission scale, and each agency
        sets its own. The
        percentage on the first agreement you read is an opening number, and even
        a small reduction is real money on a typical sale price. To negotiate
        well:
      </p>
      <ol>
        <li>
          <strong>Compare two or three agents.</strong> Get appraisals and written
          quotes from agents who actively sell your type of property in your area.
          Competing quotes give you both leverage and a sense of what is fair.
        </li>
        <li>
          <strong>Negotiate the rate and the marketing.</strong> The commission
          rate is only part of the cost. The marketing budget is the other lever,
          so look at the total package rather than the headline percentage alone,
          and confirm whether each rate includes GST.
        </li>
        <li>
          <strong>Be wary of the cheapest.</strong> The lowest rate is not always
          the best outcome. An extra $20,000 on the price covers the $1,600 gap between a 1.8% and a 2% quote on $800,000 more than twelve times, so compare agents on results before rates.
        </li>
      </ol>
      <p>
        It is also worth knowing who stands behind the industry here. The Real
        Estate Institute of Tasmania (REIT) is the state&rsquo;s peak body for
        agents, and agents are licensed and regulated through Consumer, Building
        and Occupational Services (CBOS). Checking that an agent is properly
        licensed through CBOS is a sensible step before you sign.
      </p>

      <MatchCTA kind="selling-agent" />

      <h2 id="other-costs">Commission vs the rest of your selling costs</h2>
      <p>
        Commission is the largest cost of selling, but it is not the only one.
        Marketing and advertising, conveyancing or legal work, any styling and
        presentation, and your mortgage discharge fee all sit alongside it, and
        capital gains tax can apply if the property is an investment rather than
        your home. Sizing commission first tells you what the biggest number
        looks like, then the rest fills in around it.
      </p>
      <p>
        For the full picture, read{" "}
        <Link href="/guides/cost-of-selling-a-house-australia">the full cost of selling</Link>,
        which walks through every line item beyond commission, and the{" "}
        <Link href="/guides/real-estate-agent-fees-australia">national agent fees guide</Link>,
        which sets the Tasmanian rates in context against the rest of the country.
      </p>

      <SellingCostTable state="TAS" />

      <h2 id="next-steps">Getting the right agent and price</h2>
      <p>
        The rate matters, but the agent matters more. The right agent in your
        area will often achieve a higher sale price than a cheaper one, which more
        than covers a small difference in commission. Before you fix on a fee,
        make sure you are choosing the agent who can actually get you the best
        result.
      </p>
      <ol>
        <li>
          <strong>Choose the right agent.</strong> Our{" "}
          <Link href="/guides/how-to-choose-a-selling-agent">guide to choosing a selling agent</Link>{" "}
          covers the interview, the over-quote trap, and exactly what to negotiate.
        </li>
        <li>
          <strong>Get a realistic price range first.</strong> Knowing the range your home is
          likely to sell in shapes every fee conversation. The{" "}
          <Link href="/guides/how-much-is-my-house-worth-australia">how much is my house worth guide</Link>{" "}
          explains how to land on a realistic range.
        </li>
        <li>
          <strong>Size the commission.</strong> Run your price through{" "}
          <Link href="/real-estate-commission-calculator">our commission calculator</Link>{" "}
          on its TAS setting so you know the dollar figure before any meeting.
        </li>
      </ol>

      <MatchCTA kind="selling-agent" />

      <Sources items={TAS_COMMISSION_SOURCES} />
    </GuideArticleLayout>
  );
}

const TAS_COMMISSION_SOURCES: readonly SourceItem[] = [
  ...commissionSourceItems(stateSources("TAS")),
  { label: "Property Agents and Land Transactions Act 2016 (Tas)", href: "https://www.legislation.tas.gov.au/view/html/inforce/current/act-2016-058", note: "The Act under which Tasmanian property agents are licensed" },
];
