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
  title: "Real Estate Commission NT: Average Rates & Agent Fees (2026)",
  description:
    "What real estate agents charge in the Northern Territory: typical commission of 2.4% to 2.7% (2.5% most common), worked dollar examples, GST, what's included, and how to negotiate the rate.",
  slug: "real-estate-commission-nt",
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
  "Real estate commission in the Northern Territory typically runs from 2.4% to 2.7% of the sale price, with 2.5% the most common rate.",
  "Commission is a percentage of the final sale price, paid by the seller at settlement, and it is negotiable. There is no official or fixed rate in the NT.",
  "At a typical 2.5%, an $800,000 sale carries around $20,000 in commission before GST. A $600,000 sale is about $15,000.",
  "Most NT agents work on a \"no sale, no fee\" basis, so commission is only payable when the property actually sells.",
  "GST of 10% usually applies on top of commission, and quotes vary on whether they show the figure inclusive or exclusive of it.",
  "Commission is always negotiable. Compare two or three local agents on both the rate and the marketing budget before you sign.",
];

const TOC: GuideTOCEntry[] = [
  { id: "average-commission", label: "Average commission in NT" },
  { id: "worked-examples",    label: "What it costs in dollars" },
  { id: "how-structured",     label: "How commission is structured" },
  { id: "negotiable",         label: "Is commission negotiable?" },
  { id: "other-costs",        label: "Commission vs other selling costs" },
  { id: "next-steps",         label: "Where to start" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is the average real estate commission in NT?",
    answer:
      "In the Northern Territory, real estate commission typically sits between 2.4% and 2.7% of the sale price, with 2.5% the most common rate. That is a touch above the lower rates seen in the larger southern capitals, where high property values let agents compete on a smaller percentage. There is no official or legislated rate in the NT, so the figure is always negotiable and varies by agent, suburb and property. Get written quotes from two or three local agents before you settle on a number.",
  },
  {
    question: "How much do real estate agents charge in the Northern Territory?",
    answer:
      "Agents in the Northern Territory charge a commission of roughly 2.4% to 2.7% of the final sale price, most often around 2.5%, paid by the seller at settlement. On an $800,000 sale at 2.5% that is about $20,000 before GST; on a $600,000 sale it is about $15,000. Marketing, photography and styling are usually billed separately on top of commission. Because the rate is negotiable, the cleanest way to know your number is to compare local quotes side by side.",
  },
  {
    question: "Is real estate commission negotiable in NT?",
    answer:
      "Yes. Commission is deregulated in the Northern Territory, so there is no fixed or official rate and every agent sets their own. The percentage on the first agency agreement you read is an opening number, not a fixed price. The way to negotiate well is to get two or three appraisals, compare the rate against the service and the marketing budget rather than in isolation, and ask each agent to justify their figure. Be wary of simply taking the cheapest, since a stronger agent who negotiates a higher sale price can easily earn back a small difference in rate.",
  },
  {
    question: "Do you pay commission if the house doesn't sell?",
    answer:
      "Generally no. Most Northern Territory agents work on a \"no sale, no fee\" basis, which means commission is only payable when the property actually sells, usually at settlement from the sale proceeds. Marketing costs are different: photography, online listings and styling are often payable whether or not the property sells, and are usually charged separately from commission. Always confirm both points in the agency agreement before you sign so you know exactly what you owe in each scenario.",
  },
  {
    question: "Does commission include GST in NT?",
    answer:
      "Commission usually attracts 10% GST on top of the quoted rate, since real estate agency services are a taxable supply. The catch is that quotes vary on whether they show the figure inclusive or exclusive of GST, so a rate that looks lower may simply be quoted before tax. Always ask each agent to confirm whether their commission quote includes GST so you are comparing like with like, and so the dollar figure at settlement matches what you expected.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Commission Calculator",            href: "/real-estate-commission-calculator",       description: "Work out commission on your NT sale price." },
  { title: "The Cost of Selling a House",       href: "/guides/cost-of-selling-a-house-australia", description: "Every selling cost beyond commission." },
  { title: "Real Estate Agent Fees (National)", href: "/guides/real-estate-agent-fees-australia",  description: "How fees and commission work across Australia." },
  { title: "How to Choose a Selling Agent",     href: "/guides/how-to-choose-a-selling-agent",     description: "Pick the right agent, then negotiate the fee." },
  { title: "How Much Is My House Worth?",        href: "/guides/how-much-is-my-house-worth-australia", description: "Get an accurate value before you list." },
];

export default function RealEstateCommissionNtPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="There is no official commission rate in the NT">
        <p>
          Commission in the Northern Territory is not regulated or fixed, and it
          is always negotiable. The ranges in this guide are typical market
          figures, not official rates, and they move with the agent, the suburb
          and the property. Treat every number here as indicative and confirm a
          current, written quote with your own local agents before you rely on
          it.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The NT is a smaller, thinner market than the big southern capitals, so
          a single rate rarely tells the whole story. What matters is the dollar
          figure on your sale price and what sits on top of it. Get the rate in
          writing, ask whether GST is included, and compare a couple of agents
          before you sign anything.
        </p>
      </EditorNote>

      <h2 id="average-commission">Average real estate commission in NT</h2>
      <p className="lead">
        Real estate commission in the Northern Territory typically runs from{" "}
        <strong>2.4% to 2.7%</strong> of the final sale price, with{" "}
        <strong>2.5% the most common</strong> rate. Commission is a percentage
        of the sale price, paid by the seller at settlement, and it is
        negotiable. There is no official or legislated rate in the territory.
      </p>
      <p>
        That 2.5% midpoint sits a little above the rates you tend to see in the
        larger southern capitals like Sydney and Melbourne, where very high
        property values let agents compete on a smaller percentage. The NT is a
        smaller, lower-turnover market with fewer sales spread across a vast
        area, so agents earn their fee on a more modest base. That dynamic is
        why the typical rate here lands closer to other smaller and regional
        markets than to the keenest big-city numbers.
      </p>
      <p>
        Within Darwin, Palmerston and the surrounding suburbs you will see the
        most competition, and a confident vendor with a sought-after property
        can often negotiate toward the lower end. In Alice Springs, Katherine
        and more remote parts of the territory, where buyer pools are thinner,
        rates can sit toward the higher end of the range. None of these figures
        is set in stone, which is exactly why comparing local agents matters.
      </p>

      <KeyFigure
        value="2.5%"
        label="The most common real estate commission rate in the Northern Territory, within a typical range of 2.4% to 2.7% of the sale price."
        context="Negotiable, and quoted before or after GST depending on the agent"
      />

      <h2 id="worked-examples">What it costs in dollars</h2>
      <p>
        Percentages are easy to wave away, so here is what the NT range looks
        like in real money across a few sale prices. The columns show the lower
        end of the typical range, the most common rate, and the higher end.
      </p>

      <table>
        <thead>
          <tr>
            <th>Sale price</th>
            <th>At 2.4% (lower)</th>
            <th>At 2.5% (typical)</th>
            <th>At 2.7% (higher)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>$600,000</td><td>$14,400</td><td>$15,000</td><td>$16,200</td></tr>
          <tr><td>$800,000</td><td>$19,200</td><td>$20,000</td><td>$21,600</td></tr>
          <tr><td>$1,000,000</td><td>$24,000</td><td>$25,000</td><td>$27,000</td></tr>
          <tr><td>$1,500,000</td><td>$36,000</td><td>$37,500</td><td>$40,500</td></tr>
        </tbody>
      </table>

      <p>
        These figures exclude GST, which usually adds 10% on top of the
        commission. To get an exact figure on your own sale price, including a
        Northern Territory setting, run the numbers through{" "}
        <Link href="/real-estate-commission-calculator">our commission calculator</Link>.
      </p>

      <Callout variant="info" title="Check whether the quote includes GST">
        <p>
          Commission is a taxable service, so 10% GST usually applies on top of
          the rate. Agents differ on whether they quote inclusive or exclusive
          of GST, so a rate that looks cheaper may simply be shown before tax.
          Ask each agent to confirm, so the figures you compare are genuinely
          like for like.
        </p>
      </Callout>

      <h2 id="how-structured">How commission is structured in NT</h2>
      <p>
        The standard arrangement in the Northern Territory is a flat percentage
        of the final sale price, charged on a{" "}
        <strong>&ldquo;no sale, no fee&rdquo;</strong> basis. That means the
        agent is only paid commission when the property actually sells, normally
        at settlement from the sale proceeds, so there is nothing to pay up
        front for the commission itself.
      </p>
      <p>
        A single flat rate is by far the most common structure, but some agents
        will offer a tiered or performance-based arrangement instead. A
        performance clause pays the agent a higher rate on the amount achieved
        above an agreed target price, which aligns their incentive with yours
        and can be worth raising in the negotiation.
      </p>
      <p>What the commission typically covers:</p>
      <ul>
        <li><strong>Appraisal and pricing strategy</strong>, the agent&rsquo;s read on what your home should fetch and how to position it.</li>
        <li><strong>Listing and campaign management</strong>, getting the property to market and running the sale through to settlement.</li>
        <li><strong>Open homes and private inspections</strong>, hosting buyers and qualifying genuine interest.</li>
        <li><strong>Negotiation</strong>, the core of the job, working buyers against each other to lift the price.</li>
      </ul>
      <p>What is usually charged separately, on top of commission:</p>
      <ul>
        <li><strong>Marketing and advertising</strong>, including listings on the major property portals and any print or social spend.</li>
        <li><strong>Professional photography</strong>, and often a floor plan, video or drone shots.</li>
        <li><strong>Property styling or staging</strong>, where you choose to use it to present the home.</li>
      </ul>
      <p>
        Marketing is generally payable whether or not the property sells, which
        is the key difference from the &ldquo;no sale, no fee&rdquo; commission.
        Confirm both in the agency agreement before you sign.
      </p>

      <PullQuote attribution="Andy McMaster, Editor">
        Commission is negotiable everywhere in Australia, and the NT is no
        exception. The rate you&rsquo;re first quoted is a starting point, not a
        fixed price.
      </PullQuote>

      <h2 id="negotiable">Is commission negotiable in NT?</h2>
      <p>
        Yes. Commission is <strong>deregulated</strong> in the Northern
        Territory, which means there is no fixed or official rate and each agent
        sets their own. The percentage on the first agency agreement you read is
        an opening position, and most vendors never realise how much room there
        is to move on it. Shaving even a fraction of a per cent off a typical
        sale price is real money back in your pocket.
      </p>
      <p>How to negotiate well in the NT:</p>
      <ol>
        <li>
          <strong>Compare two or three local agents.</strong> Competing quotes
          give you both leverage and a sense of what is fair in your suburb.
          Don&rsquo;t accept the first number you are handed.
        </li>
        <li>
          <strong>Negotiate on the rate and the marketing.</strong> The
          commission rate is only half the cost. A lower rate with a bloated
          marketing package can cost you more than a slightly higher rate with a
          lean, well-targeted campaign.
        </li>
        <li>
          <strong>Be wary of the cheapest.</strong> The agent with the lowest
          rate is not automatically the best value. A stronger negotiator who
          lifts your sale price by tens of thousands earns back a small
          difference in rate many times over.
        </li>
        <li>
          <strong>Confirm the GST position.</strong> Make sure every quote is on
          the same footing, inclusive or exclusive of GST, so you are comparing
          like with like.
        </li>
      </ol>
      <p>
        Northern Territory agents are licensed and regulated through{" "}
        <a href="https://nt.gov.au/industry/agents" target="_blank" rel="noopener noreferrer">
          NT Consumer Affairs
        </a>
        , and many belong to the{" "}
        <a href="https://www.reint.com.au" target="_blank" rel="noopener noreferrer">
          Real Estate Institute of the Northern Territory (REINT)
        </a>
        . Checking that an agent is licensed is a sensible first step, but
        remember that licensing sets the rules of conduct, not the commission
        rate. The rate is between you and the agent.
      </p>

      <MatchCTA kind="selling-agent" />

      <h2 id="other-costs">Commission vs the rest of your selling costs</h2>
      <p>
        Commission is the single largest cost of selling in the Northern
        Territory, but it is not the only one. On top of it you will usually pay
        for marketing and photography, conveyancing or legal work, and some
        presentation before the home goes to market. If you have a loan to pay
        out there is a small mortgage discharge fee, and an investment property
        can attract capital gains tax that dwarfs every other line.
      </p>
      <p>
        To see how commission fits into the full picture, read{" "}
        <Link href="/guides/cost-of-selling-a-house-australia">the full cost of selling</Link>{" "}
        for every line item a seller faces, and the{" "}
        <Link href="/guides/real-estate-agent-fees-australia">national agent fees guide</Link>{" "}
        for how rates and inclusions compare across Australia, the NT included.
      </p>

      <h2 id="next-steps">Where to start</h2>
      <p>
        Knowing the typical rate is one thing. Getting a fair deal on your own
        sale is another. Here is the order that saves the most:
      </p>
      <ol>
        <li>
          <strong>Size the cost in dollars.</strong> Run your price through the{" "}
          <Link href="/real-estate-commission-calculator">commission calculator</Link>{" "}
          with the NT setting so you know what commission means before any
          conversation.
        </li>
        <li>
          <strong>Get an accurate value first.</strong> A realistic sale price
          underpins the whole exercise. Our{" "}
          <Link href="/guides/how-much-is-my-house-worth-australia">how much is my house worth guide</Link>{" "}
          covers the three ways to value a home and how to land on a figure you
          can trust.
        </li>
        <li>
          <strong>Choose the right agent, then negotiate.</strong> The{" "}
          <Link href="/guides/how-to-choose-a-selling-agent">guide to choosing a selling agent</Link>{" "}
          covers the interview, the over-quote trap and what to push on once you
          have picked your agent.
        </li>
      </ol>

      <MatchCTA kind="selling-agent" />

      <Sources items={NT_COMMISSION_SOURCES} />
    </GuideArticleLayout>
  );
}

const NT_COMMISSION_SOURCES: readonly SourceItem[] = [
  { label: "NT Consumer Affairs: Real estate agents and licensing", href: "https://nt.gov.au/industry/agents", note: "Licensing and conduct rules for Northern Territory agents" },
  { label: "Real Estate Institute of the Northern Territory (REINT)", href: "https://www.reint.com.au", note: "Industry body for NT agents" },
  { label: "ASIC MoneySmart: Selling a property", href: "https://moneysmart.gov.au/", note: "Consumer guidance on agent commission, GST and selling costs" },
];
