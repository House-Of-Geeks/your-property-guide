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
  title: "Real Estate Commission VIC: Average Rates & Agent Fees (2026)",
  description:
    "What real estate agents charge in Victoria: the typical 1.6% to 2.5% commission range, worked examples on common sale prices, how GST applies, what's included, and how to negotiate.",
  slug: "real-estate-commission-vic",
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
  "Real estate commission in Victoria typically ranges from 1.6% to 2.5% of the sale price, with 2% the most common rate.",
  "At the typical 2%, a $800,000 sale costs $16,000 in commission, before GST.",
  "Commission is a percentage of the final sale price, paid by the seller at settlement, and it is always negotiable.",
  "Most VIC agents work on \"no sale, no fee\", so commission is only payable if the property sells.",
  "Marketing, photography and styling are usually charged separately, on top of the commission rate.",
  "Commission is not regulated or fixed in Victoria, so compare two or three agents and get the rate in writing.",
];

const TOC: GuideTOCEntry[] = [
  { id: "average-commission", label: "Average commission in VIC" },
  { id: "worked-examples",    label: "Worked examples by sale price" },
  { id: "how-structured",     label: "How commission is structured" },
  { id: "negotiable",         label: "Is commission negotiable?" },
  { id: "other-costs",        label: "Commission vs other selling costs" },
  { id: "next-steps",         label: "Getting the right agent and fee" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is the average real estate commission in VIC?",
    answer:
      "Real estate commission in Victoria typically ranges from 1.6% to 2.5% of the sale price, with 2% the most common rate. It is charged as a percentage of the final sale price and paid by the seller at settlement. At 2%, a $800,000 sale costs $16,000 in commission before GST. There is no official or fixed rate, so the figure you are quoted varies by agent, suburb and property value, and it is always negotiable.",
  },
  {
    question: "How much do real estate agents charge in Victoria?",
    answer:
      "Most Victorian agents charge a commission of between 1.6% and 2.5% of the sale price, clustered around 2%. On a $600,000 sale that is roughly $9,600 to $15,000, and on a $1,000,000 sale it is roughly $16,000 to $25,000, before GST. Commission almost always sits separately from marketing, which is billed on top. Because rates are not set by law in Victoria, the only way to know what you will pay is to get written quotes from a few local agents.",
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
      "Usually not in the headline number. Real estate commission in Victoria normally attracts 10% GST on top of the quoted rate, so a 2% commission effectively costs 2.2% once GST is added. Some agents quote the rate inclusive of GST and some quote it exclusive, which makes a real difference to the final bill. Always ask whether the rate you are being quoted includes GST so you are comparing agents on the same basis.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Commission Calculator",                href: "/real-estate-commission-calculator",        description: "Work out commission on your VIC sale price." },
  { title: "The Cost of Selling a House",           href: "/guides/cost-of-selling-a-house-australia",  description: "Every selling cost beyond commission." },
  { title: "Real Estate Agent Fees (National)",     href: "/guides/real-estate-agent-fees-australia",   description: "How fees and commission work across Australia." },
  { title: "How to Choose a Selling Agent",         href: "/guides/how-to-choose-a-selling-agent",      description: "Pick the right agent, then negotiate the fee." },
  { title: "How Much Is My House Worth?",           href: "/guides/how-much-is-my-house-worth-australia", description: "Get an accurate value before you list." },
];

export default function RealEstateCommissionVicPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Commission isn't fixed, and it's always negotiable">
        <p>
          There is no official or regulated commission rate in Victoria.
          Commission is deregulated, so the percentages in this guide are
          typical market figures, not set rates, and they vary by agent, suburb
          and property value. Treat every number here as indicative, get written
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
        Real estate commission in Victoria typically ranges from{" "}
        <strong>1.6% to 2.5%</strong> of the final sale price, with{" "}
        <strong>2% the most common rate</strong>. Commission is paid by the
        seller, charged as a percentage of what the property actually sells for,
        and it is always negotiable.
      </p>
      <p>
        By national standards, Victoria sits towards the lower end. Commission
        rates tend to be lower in the larger, higher-value capital cities and
        higher in regional and smaller markets, and Melbourne&rsquo;s high
        median price pulls Victorian rates down. The typical 2% in VIC is in
        line with New South Wales and below the 2.5% to 3% more common in
        states like Queensland and Western Australia. Within Victoria, premium
        Melbourne suburbs often see rates closer to the bottom of the range,
        while smaller regional sales can sit nearer the top.
      </p>

      <KeyFigure
        value="1.6–2.5%"
        label="Typical real estate commission range in Victoria, with 2% the most common rate. Charged on the final sale price and paid by the seller at settlement."
        context="Indicative only, and excludes GST"
      />

      <p>
        Commission is normally quoted before GST, and in Victoria it usually
        attracts <strong>10% GST on top</strong> of the rate. A 2% commission
        therefore effectively costs 2.2% once GST is added. Agents differ on
        whether they show the rate inclusive or exclusive of GST, so always ask
        which one you are being quoted before you compare.
      </p>

      <h2 id="worked-examples">Worked examples by sale price</h2>
      <p>
        Because commission is a percentage, the dollar figure scales with your
        sale price. Here is what the typical Victorian range looks like in
        dollars across common sale prices, at the lower end (1.6%), the typical
        rate (2%) and the higher end (2.5%).
      </p>

      <table>
        <thead>
          <tr>
            <th>Sale price</th>
            <th>At 1.6% (lower)</th>
            <th>At 2% (typical)</th>
            <th>At 2.5% (higher)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>$600,000</td><td>$9,600</td><td>$12,000</td><td>$15,000</td></tr>
          <tr><td>$800,000</td><td>$12,800</td><td>$16,000</td><td>$20,000</td></tr>
          <tr><td>$1,000,000</td><td>$16,000</td><td>$20,000</td><td>$25,000</td></tr>
          <tr><td>$1,500,000</td><td>$24,000</td><td>$30,000</td><td>$37,500</td></tr>
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
          automatically the best value. An agent who negotiates a higher sale
          price earns their commission back many times over, so weigh the rate
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
          using the VIC setting so you know what 2% means in dollars before any
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
  { label: "Consumer Affairs Victoria: Estate agents and commission", href: "https://www.consumer.vic.gov.au/", note: "Agent licensing and the deregulation of commission in Victoria" },
  { label: "Real Estate Institute of Victoria (REIV)", href: "https://reiv.com.au/", note: "Industry body context for the Victorian agent market" },
  { label: "ASIC MoneySmart: Selling a property", href: "https://moneysmart.gov.au/", note: "Consumer guidance on agent fees, GST and marketing costs" },
];
