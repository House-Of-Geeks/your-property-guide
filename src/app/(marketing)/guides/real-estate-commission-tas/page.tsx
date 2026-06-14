import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  Sources,
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

const FRONTMATTER: GuideFrontmatter = {
  title: "Real Estate Commission TAS: Average Rates & Agent Fees (2026)",
  description:
    "What real estate agents charge in Tasmania: the typical commission range, the most common rate, worked dollar examples on a TAS sale, how commission is structured, whether it includes GST, and how to negotiate.",
  slug: "real-estate-commission-tas",
  publishedAt: "2026-06-14",
  updatedAt: "2026-06-14",
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
  "Real estate commission in Tasmania typically runs from 2.5% to 3.25% of the sale price, with 2.9% the most common rate.",
  "Commission is a percentage of the final sale price, paid by the seller out of the proceeds at settlement.",
  "At a 2.9% rate, a $600,000 sale works out to about $17,400 in commission before GST.",
  "Almost every agent works on a no sale, no fee basis, so commission is only owed once the property actually sells.",
  "Commission usually attracts 10% GST on top, and quotes vary on whether they show it, so always ask whether a rate is inclusive or exclusive.",
  "Commission is deregulated in Tasmania and always negotiable. Compare two or three local agents and negotiate the rate and the marketing budget.",
];

const TOC: GuideTOCEntry[] = [
  { id: "average",      label: "Average commission in TAS" },
  { id: "worked",       label: "Worked dollar examples" },
  { id: "structure",    label: "How commission is structured" },
  { id: "negotiable",   label: "Is commission negotiable?" },
  { id: "other-costs",  label: "Commission vs the rest of your costs" },
  { id: "next-steps",   label: "Getting the right agent and price" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is the average real estate commission in TAS?",
    answer:
      "In Tasmania, commission typically falls between 2.5% and 3.25% of the sale price, and 2.9% is the most common rate. The figure is a percentage of the final sale price rather than a flat fee, so the dollar amount rises with the price even at the same rate. These are typical market figures, not official or regulated rates, and they are negotiable, so the number you are first quoted is a starting point. Get the rate in writing from two or three local agents and check whether it includes GST.",
  },
  {
    question: "How much do real estate agents charge in Tasmania?",
    answer:
      "Most Tasmanian agents charge a percentage commission on the sale price, usually somewhere from 2.5% to 3.25%, with 2.9% the typical figure. On a $600,000 sale at 2.9% that is about $17,400 before GST; on an $800,000 sale it is about $23,200. On top of commission you generally pay separately for marketing and advertising, professional photography and any styling. Commission is paid from the sale proceeds at settlement, and almost all agents work on a no sale, no fee basis.",
  },
  {
    question: "Is real estate commission negotiable in TAS?",
    answer:
      "Yes. Commission is deregulated in Tasmania, which means there is no official or fixed rate and agents set their own. The percentage on the first agency agreement you read is an opening number, not a fixed price. The way to negotiate well is to get appraisals from two or three agents who actively sell in your area, compare the rate against the service and the marketing budget rather than in isolation, and ask each agent to justify their number. Be wary of simply taking the cheapest, since a stronger agent can earn back a small rate difference many times over on the final price.",
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
  { title: "How Much Is My House Worth?",          href: "/guides/how-much-is-my-house-worth-australia", description: "Get an accurate value before you list." },
];

export default function RealEstateCommissionTasPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="These are typical figures, not official rates">
        <p>
          Real estate commission in Tasmania is not regulated or fixed, and it
          is always negotiable. The ranges in this guide are typical market
          figures, not official rates, and they vary by agent, suburb and
          property type. Always get current written quotes from your own local
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
        Real estate commission in Tasmania typically runs from{" "}
        <strong>2.5% to 3.25%</strong> of the final sale price, and{" "}
        <strong>2.9%</strong> is the most common rate. Commission is charged as a
        percentage of what the property sells for, so a higher sale price means a
        higher fee in dollar terms even at the same rate. It is paid by the
        seller, out of the proceeds, at settlement.
      </p>
      <p>
        Tasmania sits a little higher than the larger mainland markets. In big
        capital cities like Sydney and Melbourne, where property values are high
        and agents compete hard for listings, percentage rates are often pushed
        down towards 2% or below. Tasmania has lower median prices and a smaller
        pool of sales spread across Hobart, Launceston and the regional centres,
        so the percentage tends to sit higher to cover the agent&rsquo;s cost of
        running a campaign. A typical Tasmanian rate of 2.9% is above the norm in
        the biggest cities and broadly in line with the smaller states and
        regional markets.
      </p>

      <KeyFigure
        value="2.9%"
        label="The most common real estate commission rate in Tasmania, within a typical range of 2.5% to 3.25% of the sale price."
        context="Deregulated and negotiable, GST usually on top"
      />

      <p>
        Within that range, where your rate lands depends on the property, the
        location and the agent. A straightforward home in a high-demand pocket of
        Hobart may attract a rate near the bottom of the range, while a harder
        sale in a thinner regional market, or a property that needs more work to
        market, may sit nearer the top. None of these are fixed, which is exactly
        why comparing local agents matters.
      </p>

      <h2 id="worked">Worked dollar examples</h2>
      <p>
        Because commission is a percentage, the easiest way to understand it is in
        dollars. The table below shows what commission works out to across the
        typical Tasmanian range, from the lower end at 2.5%, through the most
        common 2.9%, up to the higher end at 3.25%.
      </p>

      <table>
        <thead>
          <tr>
            <th>Sale price</th>
            <th>At 2.5% (lower)</th>
            <th>At 2.9% (typical)</th>
            <th>At 3.25% (higher)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>$600,000</td><td>$15,000</td><td>$17,400</td><td>$19,500</td></tr>
          <tr><td>$800,000</td><td>$20,000</td><td>$23,200</td><td>$26,000</td></tr>
          <tr><td>$1,000,000</td><td>$25,000</td><td>$29,000</td><td>$32,500</td></tr>
          <tr><td>$1,500,000</td><td>$37,500</td><td>$43,500</td><td>$48,750</td></tr>
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
        Yes. Commission is <strong>deregulated</strong> in Tasmania, which means
        there is no official or legislated rate and each agency sets its own. The
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
          the best outcome. An agent who negotiates a stronger final price earns
          back a small rate difference many times over, so weigh who is most
          likely to get you the best result, not just who charges least.
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
          <strong>Get an accurate value first.</strong> Knowing what your home is
          realistically worth shapes every fee conversation. The{" "}
          <Link href="/guides/how-much-is-my-house-worth-australia">how much is my house worth guide</Link>{" "}
          explains how to land on a figure you can trust.
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
  { label: "Real Estate Institute of Tasmania (REIT)", href: "https://www.reit.com.au", note: "Peak body for real estate agents in Tasmania" },
  { label: "Consumer, Building and Occupational Services (CBOS)", href: "https://www.cbos.tas.gov.au", note: "Tasmanian regulator that licenses property agents" },
  { label: "ASIC MoneySmart: Selling a property", href: "https://moneysmart.gov.au/", note: "Consumer guidance on agent commission, fees and marketing costs" },
];
