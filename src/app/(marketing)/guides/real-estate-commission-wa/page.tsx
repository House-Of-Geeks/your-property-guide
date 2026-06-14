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
  title: "Real Estate Commission WA: Average Rates & Agent Fees (2026)",
  description:
    "What real estate agents charge in Western Australia: the typical commission range, the most common rate, worked dollar examples by sale price, GST, what's included, and how to negotiate.",
  slug: "real-estate-commission-wa",
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
  "Real estate commission in WA typically runs from 2% to 2.8% of the final sale price, with 2.4% the most common rate.",
  "On a $600,000 sale at the typical 2.4%, commission is $14,400. On a $1,000,000 sale it's $24,000.",
  "Commission usually attracts 10% GST on top, and quotes vary on whether they show the GST-inclusive figure or not.",
  "Almost every WA agent works on a no sale, no fee basis, so commission is only payable once the property sells, at settlement.",
  "Commission is deregulated in WA. There is no official or fixed rate, so the percentage you're first quoted is always negotiable.",
  "Marketing, photography and styling are charged separately from commission, so compare the full package, not just the headline rate.",
];

const TOC: GuideTOCEntry[] = [
  { id: "average-commission", label: "Average commission in WA" },
  { id: "worked-examples",    label: "Worked examples by sale price" },
  { id: "how-structured",     label: "How commission is structured" },
  { id: "negotiable",         label: "Is commission negotiable in WA?" },
  { id: "other-costs",        label: "Commission vs your other costs" },
  { id: "next-steps",         label: "Get the right agent and rate" },
];

const FAQS: FaqItem[] = [
  {
    question: "What is the average real estate commission in WA?",
    answer:
      "In Western Australia, commission typically ranges from 2% to 2.8% of the final sale price, with 2.4% the most common rate. It is charged as a percentage of what the property sells for and is paid by the seller at settlement. WA tends to sit slightly above the rates seen in the larger eastern-state capitals, where higher property values let agents compete on a lower percentage. There is no official or fixed rate, so always get written quotes from two or three local agents before you settle on a number.",
  },
  {
    question: "How much do real estate agents charge in Western Australia?",
    answer:
      "Most WA agents charge between 2% and 2.8% of the sale price, with 2.4% being the figure you'll see most often. As a dollar example, a $600,000 sale at 2.4% works out to $14,400, and an $800,000 sale at the same rate is $19,200. These figures exclude GST, which is usually added at 10% on top. Marketing and photography are billed separately again. Use our commission calculator to get an exact figure for your own sale price.",
  },
  {
    question: "Is real estate commission negotiable in WA?",
    answer:
      "Yes. Commission in Western Australia is deregulated, which means there is no government-set or fixed rate and agents set their own pricing. The percentage on the first agency agreement you read is a starting point, not a fixed fee. The best way to negotiate is to compare two or three agents, weigh the rate against the marketing package and the agent's track record in your suburb, and be wary of picking purely on the cheapest quote. An agent who negotiates a higher sale price can easily earn back a slightly higher rate.",
  },
  {
    question: "Do you pay commission if the house doesn't sell?",
    answer:
      "Generally no. Almost every WA agent works on a no sale, no fee basis, so commission is only payable if and when the property sells, and it comes out of the sale proceeds at settlement. Marketing and advertising costs are different, though. Those are usually charged separately and are often payable whether or not the property sells. Check exactly what you owe in each scenario in the agency agreement before you sign.",
  },
  {
    question: "Does commission include GST in WA?",
    answer:
      "Commission usually attracts 10% GST on top of the agreed rate. Where quotes get confusing is that some agents show the GST-inclusive figure and some quote the rate before GST, so a 2.4% quote and a 2.4% quote can mean different final dollar amounts. Always ask whether the rate you've been given includes GST so you're comparing like with like across agents.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Commission Calculator",               href: "/real-estate-commission-calculator",        description: "Work out commission on your WA sale price." },
  { title: "The Cost of Selling a House",          href: "/guides/cost-of-selling-a-house-australia",  description: "Every selling cost beyond commission." },
  { title: "Real Estate Agent Fees (National)",    href: "/guides/real-estate-agent-fees-australia",   description: "How fees and commission work across Australia." },
  { title: "How to Choose a Selling Agent",        href: "/guides/how-to-choose-a-selling-agent",      description: "Pick the right agent, then negotiate the fee." },
  { title: "How Much Is My House Worth?",          href: "/guides/how-much-is-my-house-worth-australia", description: "Get an accurate value before you list." },
];

export default function RealEstateCommissionWaPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="These are typical market figures, not official rates">
        <p>
          Commission in Western Australia is not regulated or fixed, and it is
          always negotiable. The ranges in this guide reflect what sellers
          commonly pay, not an official rate set by anyone. Rates vary by agent,
          suburb and property, so treat every figure here as indicative and get
          written, current quotes from your own local agents before you commit.
        </p>
      </Callout>

      <EditorNote>
        <p>
          WA sellers often assume there&rsquo;s a set rate for the state.
          There isn&rsquo;t. Commission here was deregulated years ago, so the
          number on the agreement is just where the agent has chosen to start.
          The sellers who pay the least aren&rsquo;t the ones who push hardest
          on the percentage, they&rsquo;re the ones who compare two or three
          agents properly and weigh the rate against who&rsquo;ll actually get
          them the higher price.
        </p>
      </EditorNote>

      <h2 id="average-commission">Average real estate commission in WA</h2>
      <p className="lead">
        In Western Australia, real estate commission typically runs from{" "}
        <strong>2% to 2.8%</strong> of the final sale price, with{" "}
        <strong>2.4%</strong> the most common rate. Commission is charged as a
        percentage of what your property sells for, it&rsquo;s paid by you, the
        seller, at settlement, and it is negotiable.
      </p>
      <p>
        WA sits a little above the rates you&rsquo;ll see quoted in the larger
        eastern-state capitals. In high-value markets like inner Sydney and
        Melbourne, agents often compete on a lower percentage because the
        dollar amount on an expensive home is already large. Across much of
        Western Australia, where median prices are lower than those premium
        eastern markets, the percentage tends to run a touch higher to land on
        a workable fee. The national typical sits around 2%, and WA&rsquo;s
        typical 2.4% reflects that gap.
      </p>
      <p>
        Within WA itself the rate moves with the property and the location.
        Higher-value homes in sought-after Perth suburbs can attract rates at
        the lower end of the range, while smaller sales and regional listings,
        where the agent&rsquo;s time and costs are spread over a smaller fee,
        often sit nearer the top. None of this is fixed, which is exactly why
        comparing local agents matters.
      </p>

      <KeyFigure
        value="2.4%"
        label="The most common real estate commission rate in Western Australia, within a typical range of 2% to 2.8% of the sale price."
        context="Negotiable, and usually plus 10% GST"
      />

      <h2 id="worked-examples">Worked examples by sale price</h2>
      <p>
        Because commission is a percentage, the dollar figure climbs with the
        sale price even at the same rate. Here is what the WA range works out to
        across a spread of sale prices, at the lower end (2%), the typical rate
        (2.4%), and the higher end (2.8%).
      </p>

      <table>
        <thead>
          <tr>
            <th>Sale price</th>
            <th>At 2% (lower)</th>
            <th>At 2.4% (typical)</th>
            <th>At 2.8% (higher)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>$600,000</td><td>$12,000</td><td>$14,400</td><td>$16,800</td></tr>
          <tr><td>$800,000</td><td>$16,000</td><td>$19,200</td><td>$22,400</td></tr>
          <tr><td>$1,000,000</td><td>$20,000</td><td>$24,000</td><td>$28,000</td></tr>
          <tr><td>$1,500,000</td><td>$30,000</td><td>$36,000</td><td>$42,000</td></tr>
        </tbody>
      </table>

      <p>
        These figures exclude GST, which is usually added at 10% on top of the
        commission. For an exact figure on your own sale price, including a WA
        setting, use{" "}
        <Link href="/real-estate-commission-calculator">our commission calculator</Link>.
      </p>

      <h2 id="how-structured">How commission is structured in WA</h2>
      <p>
        Most WA agents quote a single flat percentage of the sale price, so a
        2.4% rate on a $700,000 sale is simply $16,800 before GST. Some agents
        instead offer a tiered or performance-based structure, where the rate
        steps up on the amount achieved above an agreed target price. A
        performance clause can be worth asking about, because it ties the
        agent&rsquo;s reward directly to getting you a stronger result.
      </p>
      <p>
        Whichever structure you&rsquo;re quoted, the standard arrangement in WA
        is <strong>no sale, no fee</strong>. Commission is only payable once the
        property sells, and it&rsquo;s deducted from the sale proceeds at
        settlement, so you don&rsquo;t pay it up front.
      </p>
      <p>
        What the commission usually covers:
      </p>
      <ul>
        <li><strong>Appraisal and pricing strategy</strong> for your home and the local market</li>
        <li><strong>Listing and campaign management</strong> from first inspection through to settlement</li>
        <li><strong>Open homes and private inspections</strong>, hosted and managed by the agent</li>
        <li><strong>Negotiation with buyers</strong> on price and terms, on your behalf</li>
        <li><strong>Regular updates</strong> on enquiry, feedback and offers</li>
      </ul>
      <p>
        What is almost always charged separately, on top of commission:
      </p>
      <ul>
        <li><strong>Marketing and advertising</strong>, including listings on the major property portals</li>
        <li><strong>Professional photography</strong>, floor plans and video</li>
        <li><strong>Property styling or staging</strong>, where you choose to use it</li>
      </ul>
      <p>
        Because these sit outside commission, two agents on the same headline
        rate can still cost very different amounts once the marketing package is
        added in. Always ask for the marketing budget in writing alongside the
        commission quote.
      </p>

      <h2 id="negotiable">Is commission negotiable in WA?</h2>
      <p>
        Yes. Real estate commission in Western Australia is{" "}
        <strong>deregulated</strong>, which means there is no government-set
        rate and agents set their own pricing. The percentage you&rsquo;re first
        quoted is an opening number, not a fixed fee, and most sellers
        don&rsquo;t realise how much room there is to discuss it.
      </p>

      <PullQuote attribution="Andy McMaster, Editor">
        Commission in WA isn&rsquo;t set by anyone but the agent in front of you.
        The first rate you&rsquo;re quoted is a starting point, not a price tag.
      </PullQuote>

      <p>How to negotiate well in WA:</p>
      <ul>
        <li>
          <strong>Compare two or three agents.</strong> Get written quotes from
          agents who actively sell your type of property in your suburb.
          Competing quotes give you both leverage and a realistic sense of the
          going rate locally.
        </li>
        <li>
          <strong>Negotiate on the rate and the marketing.</strong> The
          commission percentage is only half the cost. The marketing and
          advertising budget is the other half, and it&rsquo;s often where the
          bigger savings sit, so push on both.
        </li>
        <li>
          <strong>Be wary of the cheapest quote.</strong> The lowest rate
          isn&rsquo;t the same as the lowest cost. An agent who negotiates a
          stronger sale price can easily earn back a slightly higher rate many
          times over, while a bargain agent juggling too many listings can cost
          you far more in a weaker result.
        </li>
        <li>
          <strong>Confirm whether GST is included.</strong> Ask every agent
          whether their quoted rate is before or after the 10% GST, so you&rsquo;re
          comparing like with like.
        </li>
      </ul>
      <p>
        For context on the wider market, the{" "}
        <a href="https://reiwa.com.au" target="_blank" rel="noopener noreferrer">
          Real Estate Institute of WA (REIWA)
        </a>{" "}
        publishes Perth and regional market data, and WA agents are licensed and
        regulated through Consumer Protection within the Department of Energy,
        Mines, Industry Regulation and Safety. Checking that an agent holds a
        current licence is a quick, sensible step before you sign anything.
      </p>

      <MatchCTA kind="selling-agent" />

      <h2 id="other-costs">Commission vs the rest of your selling costs</h2>
      <p>
        Commission is the single largest cost of selling in WA, but it isn&rsquo;t
        the only one. Marketing and photography, conveyancing or settlement
        agent fees, any styling and presentation work, and your mortgage
        discharge fee all sit on top. If the property is an investment rather
        than your home, capital gains tax can be larger again.
      </p>
      <p>
        To see commission in the context of the full bill, read{" "}
        <Link href="/guides/cost-of-selling-a-house-australia">the full cost of selling</Link>,
        which walks through every line item with a worked example. For how
        commission and fees compare across the rest of the country, the{" "}
        <Link href="/guides/real-estate-agent-fees-australia">national agent fees guide</Link>{" "}
        sets out the rates and inclusions state by state.
      </p>

      <h2 id="next-steps">Get the right agent and rate</h2>
      <p>
        The cheapest commission rarely produces the best net result. The seller
        who keeps the most usually starts by picking the right agent, then
        negotiates the fee, not the other way around. Here&rsquo;s the order
        that works:
      </p>
      <ol>
        <li>
          <strong>Get a real appraisal.</strong> Before you talk fees, get an
          accurate read on what your home is worth. The{" "}
          <Link href="/guides/how-much-is-my-house-worth-australia">how much is my house worth guide</Link>{" "}
          covers the three ways to value a home and how to land on a figure you
          can trust.
        </li>
        <li>
          <strong>Choose the agent on merit.</strong> Our{" "}
          <Link href="/guides/how-to-choose-a-selling-agent">guide to choosing a selling agent</Link>{" "}
          covers the interview, the track record to look for, and the over-quote
          trap to avoid.
        </li>
        <li>
          <strong>Size the cost.</strong> Run your likely WA sale price through
          the{" "}
          <Link href="/real-estate-commission-calculator">commission calculator</Link>{" "}
          so you know what commission means in dollars before any conversation.
        </li>
        <li>
          <strong>Then negotiate.</strong> With the value, the agent shortlist
          and the dollar figure in hand, you&rsquo;re in the strongest position
          to negotiate both the rate and the marketing.
        </li>
      </ol>

      <MatchCTA kind="selling-agent" />

      <Sources items={WA_COMMISSION_SOURCES} />
    </GuideArticleLayout>
  );
}

const WA_COMMISSION_SOURCES: readonly SourceItem[] = [
  { label: "Real Estate Institute of WA (REIWA)", href: "https://reiwa.com.au", note: "Perth and regional WA market data and selling guidance" },
  { label: "Consumer Protection WA: Buying and selling property", href: "https://www.commerce.wa.gov.au/consumer-protection", note: "Agent licensing and consumer guidance for WA property sales" },
  { label: "ASIC MoneySmart: Selling a property", href: "https://moneysmart.gov.au/", note: "Consumer guidance on agent commission and selling costs" },
];
