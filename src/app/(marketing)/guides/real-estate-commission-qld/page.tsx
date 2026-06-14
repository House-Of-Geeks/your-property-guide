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
  title: "Real Estate Commission QLD: Average Rates & Agent Fees (2026)",
  description:
    "What real estate agents charge in Queensland: the typical 2.3% to 2.9% commission range, worked dollar examples, GST, how commission is structured, and how to negotiate in a deregulated QLD market.",
  slug: "real-estate-commission-qld",
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
  "Real estate commission in Queensland typically runs from 2.3% to 2.9% of the sale price, with 2.5% the most common rate.",
  "Commission is a percentage of the final sale price, paid by the seller out of the proceeds at settlement, and it is always negotiable.",
  "At the typical 2.5% rate, an $800,000 sale costs around $20,000 in commission before GST.",
  "Commission usually attracts 10% GST on top, and quotes vary on whether that GST is shown, so always check.",
  "\"No sale, no fee\" is the norm in QLD, so commission is generally only payable if the property actually sells.",
  "Marketing, photography and styling are charged separately, so compare agents on the full package, not just the headline rate.",
];

const TOC: GuideTOCEntry[] = [
  { id: "average",     label: "Average real estate commission in QLD" },
  { id: "examples",    label: "Worked examples by sale price" },
  { id: "structure",   label: "How commission is structured in QLD" },
  { id: "negotiable",  label: "Is commission negotiable in QLD?" },
  { id: "other-costs", label: "Commission vs the rest of your selling costs" },
  { id: "next-steps",  label: "Getting an appraisal and the right agent" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is the average real estate commission in QLD?",
    answer:
      "In Queensland, real estate commission typically ranges from 2.3% to 2.9% of the final sale price, with 2.5% the most common rate. There is no official or fixed figure because commission in QLD is deregulated, so the rate you are quoted is a starting point set by the individual agent. Premium suburbs and higher-value homes often attract a lower percentage because the dollar amount is already large, while smaller sales can sit at the higher end of the range. Commission is also usually subject to 10% GST on top, so confirm whether a quote includes it.",
  },
  {
    question: "How much do real estate agents charge in Queensland?",
    answer:
      "Most Queensland agents charge a percentage of the sale price, typically between 2.3% and 2.9%, with 2.5% the usual figure. On an $800,000 sale at 2.5% that is around $20,000, and at $1,000,000 it is about $25,000, before GST. Marketing, professional photography and styling are charged separately on top of commission. Some agents will offer a tiered or performance-based structure that pays them more above an agreed target price. Always get the rate, the GST treatment and the marketing budget in writing before you sign an agency agreement.",
  },
  {
    question: "Is real estate commission negotiable in QLD?",
    answer:
      "Yes. Commission in Queensland is deregulated, which means there is no legislated rate and agents set their own pricing. That makes the figure on the first agency agreement an opening number, not a fixed price. The way to negotiate well is to compare two or three local agents, weigh the rate against the service and marketing on offer, and negotiate on the marketing spend as well as the percentage. Avoid choosing purely on the cheapest rate, because an agent who negotiates a higher sale price can earn back a slightly higher fee many times over.",
  },
  {
    question: "Do you pay commission if the house doesn't sell?",
    answer:
      "Generally no. \"No sale, no fee\" is the standard arrangement in Queensland, so commission is only payable if the property actually sells, usually at settlement from the sale proceeds. Marketing costs are different. Photography, portal listings and advertising are typically billed separately and are often payable whether or not the property sells. Read the agency agreement carefully so you understand exactly when commission is triggered and what marketing you are committed to regardless of the outcome.",
  },
  {
    question: "Does commission include GST in QLD?",
    answer:
      "Commission usually attracts 10% GST on top of the quoted percentage, and quotes vary on whether that GST is shown. Some agents quote a rate exclusive of GST and add it at settlement, while others quote an all-in figure. On a 2.5% commission for an $800,000 sale, the commission is around $20,000 and GST would add roughly $2,000 on top. Because the presentation differs between agents, always ask whether the rate you are comparing includes GST so you are comparing like with like.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Commission Calculator",              href: "/real-estate-commission-calculator",       description: "Work out commission on your QLD sale price." },
  { title: "The Cost of Selling a House",         href: "/guides/cost-of-selling-a-house-australia", description: "Every selling cost beyond commission." },
  { title: "Real Estate Agent Fees (National)",   href: "/guides/real-estate-agent-fees-australia",  description: "How fees and commission work across Australia." },
  { title: "How to Choose a Selling Agent",       href: "/guides/how-to-choose-a-selling-agent",     description: "Pick the right agent, then negotiate the fee." },
  { title: "How Much Is My House Worth?",         href: "/guides/how-much-is-my-house-worth-australia", description: "Get an accurate value before you list." },
];

export default function RealEstateCommissionQldPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Commission is not fixed, and it is always negotiable">
        <p>
          Commission in Queensland is not regulated or set at a fixed rate. The
          2.3% to 2.9% range in this guide reflects typical market figures, not
          official rates, and every agent sets their own pricing. Treat every
          percentage and dollar amount here as indicative, get written quotes
          from your own local agents, and confirm the current rate, the GST
          treatment and the marketing budget before you sign anything.
        </p>
      </Callout>

      <EditorNote>
        <p>
          Queensland sellers ask me the same thing every time: is 2.5% fair? The
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
        In Queensland, real estate commission typically ranges from{" "}
        <strong>2.3% to 2.9%</strong> of the final sale price, with{" "}
        <strong>2.5% the most common</strong> rate. Commission is a percentage of
        the sale price, paid by the seller out of the proceeds at settlement, and
        it is negotiable.
      </p>
      <p>
        That puts Queensland a little above the rate you would expect in the
        larger southern capitals. In Sydney and Melbourne, where property values
        are higher, percentage rates are often pulled down towards 2% because the
        dollar amount on a high-priced home is already substantial. Queensland
        sits higher because sale prices across much of the state are lower and
        more spread out, from inner Brisbane through to the Gold Coast, Sunshine
        Coast and the regions, so agents recover their costs over a smaller base.
        The typical 2.5% reflects that middle position rather than any rule.
      </p>
      <p>
        Within the range, the rate you are quoted depends on your price point and
        location. Higher-value Brisbane and coastal homes can attract a rate
        nearer the lower 2.3% end, because the commission in dollars is large even
        at a smaller percentage. More modest sales, or properties in slower
        markets where the agent expects a longer campaign, can sit closer to
        2.9%. None of this is fixed, which is the single most important thing to
        understand before you sign.
      </p>

      <KeyFigure
        value="2.3–2.9%"
        label="Typical real estate commission range in Queensland, with 2.5% the most common rate. A percentage of the sale price, paid by the seller at settlement."
        context="Indicative market figures, not official rates, and negotiable"
      />

      <h2 id="examples">Worked examples by sale price</h2>
      <p>
        Because commission is a percentage, the dollar figure scales with your
        sale price. The table below shows what the QLD range works out to across
        a few common price points, at the lower (2.3%), typical (2.5%) and higher
        (2.9%) ends.
      </p>

      <table>
        <thead>
          <tr>
            <th>Sale price</th>
            <th>At 2.3% (lower)</th>
            <th>At 2.5% (typical)</th>
            <th>At 2.9% (higher)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>$600,000</td><td>$13,800</td><td>$15,000</td><td>$17,400</td></tr>
          <tr><td>$800,000</td><td>$18,400</td><td>$20,000</td><td>$23,200</td></tr>
          <tr><td>$1,000,000</td><td>$23,000</td><td>$25,000</td><td>$29,000</td></tr>
          <tr><td>$1,500,000</td><td>$34,500</td><td>$37,500</td><td>$43,500</td></tr>
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
          the same as the best outcome. An agent who negotiates a stronger sale
          price can earn back a slightly higher fee many times over, while a
          cut-rate agent with too many listings may give yours little attention.
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

      <h2 id="next-steps">Getting an appraisal and the right agent</h2>
      <p>
        Knowing the commission range is only useful once you have a realistic
        sale price to apply it to, and an agent worth paying it to. Two steps put
        you in a strong position before any negotiation:
      </p>
      <ol>
        <li>
          <strong>Get an accurate value first.</strong> A market-facing appraisal
          tells you what your home is likely to sell for, which sizes the
          commission in real dollars. Our{" "}
          <Link href="/guides/how-much-is-my-house-worth-australia">guide to what your house is worth</Link>{" "}
          covers how to land on a figure you can trust.
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
  { label: "Office of Fair Trading Queensland: Property agents and licensing", href: "https://www.qld.gov.au/law/fair-trading", note: "Licensing and conduct rules for Queensland real estate agents" },
  { label: "Real Estate Institute of Queensland (REIQ)", href: "https://www.reiq.com/", note: "State peak body for agent standards and industry guidance" },
  { label: "ASIC MoneySmart: Selling a property", href: "https://moneysmart.gov.au/", note: "Consumer guidance on agent commission, GST and marketing costs" },
];
