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
  title: "Real Estate Commission SA: Average Rates & Agent Fees (2026)",
  description:
    "What real estate agents charge in South Australia: the typical commission range, worked dollar examples by sale price, how fees are structured, GST, and how to negotiate the rate in SA.",
  slug: "real-estate-commission-sa",
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
  "Real estate commission in South Australia typically runs from 1.8% to 2.75% of the sale price, with 2% the most common rate.",
  "Commission is paid by the seller out of the sale proceeds at settlement, and it is negotiable, not a fixed or regulated rate.",
  "On a $800,000 sale, 2% works out to $16,000 in commission before GST. At the higher end (2.75%) it is $22,000.",
  "Most SA agents work on a 'no sale, no fee' basis, so commission is only payable if the property actually sells.",
  "Commission usually attracts 10% GST on top, and marketing, photography and styling are charged separately.",
  "Commission is always worth negotiating: compare two or three local agents on the rate and the marketing budget before you sign.",
];

const TOC: GuideTOCEntry[] = [
  { id: "average",      label: "Average commission in SA" },
  { id: "worked",       label: "What that costs on your sale price" },
  { id: "structure",    label: "How commission is structured in SA" },
  { id: "negotiable",   label: "Is commission negotiable in SA?" },
  { id: "other-costs",  label: "Commission vs your other selling costs" },
  { id: "next-steps",   label: "Get an appraisal and the right agent" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is the average real estate commission in SA?",
    answer:
      "In South Australia, real estate commission typically ranges from 1.8% to 2.75% of the final sale price, with 2% the most common rate. It is charged as a percentage of what the property sells for, so the dollar amount rises with the sale price even at the same rate. There is no official or fixed rate in SA, so the figure you are quoted is a starting point you can negotiate, and it varies by agent, suburb and property value.",
  },
  {
    question: "How much do real estate agents charge in South Australia?",
    answer:
      "Most SA agents charge between 1.8% and 2.75% of the sale price, with around 2% being typical. On a $600,000 sale that is roughly $10,800 to $16,500, and on a $1,000,000 sale it is roughly $18,000 to $27,500, before GST. Commission usually has 10% GST added on top, and marketing, photography and styling are billed separately. Get written quotes from two or three local agents so you can compare the rate and the inclusions side by side.",
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
      "Usually not in the headline rate. Real estate commission in South Australia normally attracts 10% GST on top of the quoted percentage, so a 2% commission on an $800,000 sale is $16,000 plus GST. Some agents quote inclusive of GST and some quote exclusive, so it is worth asking directly whether the rate you are given already includes GST. Always confirm in writing how GST is shown before you compare one agent's quote against another.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Commission Calculator",              href: "/real-estate-commission-calculator",        description: "Work out commission on your SA sale price." },
  { title: "The Cost of Selling a House",         href: "/guides/cost-of-selling-a-house-australia",  description: "Every selling cost beyond commission." },
  { title: "Real Estate Agent Fees (National)",   href: "/guides/real-estate-agent-fees-australia",   description: "How fees and commission work across Australia." },
  { title: "How to Choose a Selling Agent",       href: "/guides/how-to-choose-a-selling-agent",      description: "Pick the right agent, then negotiate the fee." },
  { title: "How Much Is My House Worth?",          href: "/guides/how-much-is-my-house-worth-australia", description: "Get an accurate value before you list." },
];

export default function RealEstateCommissionSAPage() {
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
          There is no regulated or official commission rate in South Australia.
          The ranges in this guide are typical market figures, not set rates,
          and the percentage any agent quotes is a starting point you can
          negotiate. Always get current written quotes from your own local
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
        Real estate commission in South Australia typically ranges from{" "}
        <strong>1.8% to 2.75%</strong> of the final sale price, with{" "}
        <strong>2% the most common</strong> rate. Commission is a percentage of
        the price the property actually sells for, it is paid by the seller out
        of the sale proceeds at settlement, and it is negotiable.
      </p>
      <p>
        SA sits towards the lower-to-middle end of the national picture. The
        typical 2% in Adelaide and across South Australia is in line with the
        bigger eastern-state capitals and below the higher rates more common in
        Western Australia, the Northern Territory and parts of regional
        Australia. Lower sale prices in some SA markets can nudge percentage
        rates up a little, because the agent&rsquo;s costs are spread over a
        smaller number, while competitive metropolitan Adelaide suburbs tend to
        keep rates closer to the 2% mark.
      </p>
      <p>
        Because commission is charged as a percentage, the dollar figure rises
        with the sale price even at the same rate. That is exactly why the rate
        is worth a conversation, and why it pays to see the number in dollars
        rather than as a percentage.
      </p>

      <KeyFigure
        value="1.8%–2.75%"
        label="Typical real estate commission range in South Australia, with 2% the most common rate. A percentage of the sale price, paid by the seller at settlement."
        context="Negotiable market figures, not an official rate"
      />

      <h2 id="worked">What that costs on your sale price</h2>
      <p>
        Here is what those rates work out to in dollars across a range of SA
        sale prices. The figures show the lower end (1.8%), the typical rate
        (2%) and the higher end (2.75%), so you can see the spread on your own
        likely price.
      </p>

      <table>
        <thead>
          <tr>
            <th>Sale price</th>
            <th>At 1.8% (lower)</th>
            <th>At 2% (typical)</th>
            <th>At 2.75% (higher)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>$600,000</td><td>$10,800</td><td>$12,000</td><td>$16,500</td></tr>
          <tr><td>$800,000</td><td>$14,400</td><td>$16,000</td><td>$22,000</td></tr>
          <tr><td>$1,000,000</td><td>$18,000</td><td>$20,000</td><td>$27,500</td></tr>
          <tr><td>$1,500,000</td><td>$27,000</td><td>$30,000</td><td>$41,250</td></tr>
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
        <li><strong>Be wary of the cheapest.</strong> The lowest rate is not the best outcome if it comes with a thin campaign or an agent juggling too many listings. A good agent who achieves more on the sale earns their fee back many times over.</li>
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
  { label: "Real Estate Institute of South Australia (REISA)", href: "https://www.reisa.com.au/", note: "South Australian industry body for real estate agents" },
  { label: "Consumer and Business Services SA: Land agents and salespeople", href: "https://www.cbs.sa.gov.au/", note: "Licensing and regulation of real estate agents in South Australia" },
  { label: "ASIC MoneySmart: Selling a property", href: "https://moneysmart.gov.au/", note: "Consumer guidance on agent commission and selling costs" },
];
