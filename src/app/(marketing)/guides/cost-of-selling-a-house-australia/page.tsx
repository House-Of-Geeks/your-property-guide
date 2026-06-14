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
  title: "The Cost of Selling a House in Australia (2026): Every Fee Explained",
  description:
    "Every cost of selling a house in Australia: agent commission, marketing, conveyancing, styling, repairs, auction and discharge fees, plus capital gains tax on an investment. With a worked example and where you can negotiate.",
  slug: "cost-of-selling-a-house-australia",
  publishedAt: "2026-06-14",
  updatedAt: "2026-06-14",
  readingTimeMinutes: 9,
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
  "Agent commission is the largest cost of selling and the one most people overpay. It is a percentage of the sale price, varies by state and market, and is negotiable.",
  "On top of commission you pay for marketing and professional photography, conveyancing or legal work, and usually some styling, repairs and presentation before listing.",
  "Smaller line items include auctioneer fees if you go to auction and your mortgage discharge fee if you have a loan to pay out.",
  "If the property is an investment rather than your main home, capital gains tax can be the biggest cost of all. Your family home is generally exempt.",
  "As a rough guide, total selling costs often land somewhere around 2 to 4 per cent of the sale price before any tax, but the figure swings widely with commission, marketing and how much presentation work the home needs.",
  "Get the commission rate in writing, compare two or three agents, and treat the rate as a starting point for negotiation, not a fixed fee.",
];

const TOC: GuideTOCEntry[] = [
  { id: "overview",      label: "What it costs to sell a house" },
  { id: "commission",    label: "Agent commission (the big one)" },
  { id: "marketing",     label: "Marketing and photography" },
  { id: "conveyancing",  label: "Conveyancing and legal" },
  { id: "presentation",  label: "Styling, staging and repairs" },
  { id: "auction",       label: "Auction and auctioneer fees" },
  { id: "discharge",     label: "Mortgage discharge fees" },
  { id: "cgt",           label: "Capital gains tax on an investment" },
  { id: "worked-example",label: "A worked example" },
  { id: "next-steps",    label: "Where to start" },
];

const FAQS: FaqItem[] = [
  {
    question: "How much does it cost to sell a house in Australia?",
    answer:
      "Total selling costs commonly land around 2 to 4 per cent of the sale price before any tax, but the range is wide. Agent commission is the largest part, followed by marketing and photography, then conveyancing, styling and any repairs. If you have a loan there is also a small mortgage discharge fee, and if you sell at auction you pay an auctioneer. The biggest variable is commission, which is negotiable, so two sellers on the same street can pay very different amounts. Use the commission calculator to estimate the largest line item for your price and state.",
  },
  {
    question: "What is the average real estate commission in Australia?",
    answer:
      "Commission is charged as a percentage of the sale price and varies by state and by market. Rates tend to be lower in larger capital cities with high property values and higher in regional areas where sale prices are smaller. Some agents charge a flat fee instead, and some add a performance incentive above a target price. Rather than relying on a single national average, get written quotes from two or three local agents and compare the rate, the inclusions and the marketing budget side by side.",
  },
  {
    question: "Is real estate commission negotiable?",
    answer:
      "Yes. Commission is the line most sellers overpay and the one most open to negotiation. Agents set their own rates, so the percentage you are first quoted is a starting point, not a fixed price. The way to negotiate well is to get two or three appraisals, compare the rate against the service and marketing on offer, and ask each agent to justify their number. Pushing the rate down by even half a per cent on a typical sale price is real money, so it is worth the conversation.",
  },
  {
    question: "Do you pay stamp duty when you sell a house?",
    answer:
      "No. Stamp duty is paid by the buyer, not the seller. When you sell you do not pay stamp duty on the property you are letting go. The costs that fall to you as the seller are agent commission, marketing, conveyancing or legal work, presentation, any auctioneer fee, your mortgage discharge fee, and capital gains tax if the property is an investment rather than your main residence.",
  },
  {
    question: "What costs can you deduct when selling an investment property?",
    answer:
      "When you sell an investment property, the costs of selling and buying can usually be included in the capital gains tax calculation, which reduces the taxable gain. That generally covers things like agent commission, marketing, conveyancing and legal fees on the sale, and the original purchase costs such as stamp duty paid when you bought. It does not apply to your main home, which is generally exempt from capital gains tax. The rules are detailed and depend on your circumstances, so confirm what applies to you with the ATO or a registered tax agent before you sell.",
  },
  {
    question: "How can I reduce the cost of selling my house?",
    answer:
      "Start with the biggest line, commission, because that is where most sellers overpay. Compare two or three local agents, get the rate in writing, and negotiate. Keep the marketing budget proportionate to your price rather than agreeing to a large package by default, and spend on presentation only where it pays for itself. The free selling guide covers the questions that catch over-priced agents out and benchmarks fees for your state, so you go into the conversation knowing what is fair.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Commission Calculator",              href: "/real-estate-commission-calculator",        description: "Estimate the biggest selling cost for your price and state." },
  { title: "Real Estate Agent Fees in Australia", href: "/guides/real-estate-agent-fees-australia",  description: "Commission ranges by state, marketing budgets, and what's negotiable." },
  { title: "How to Sell a House in Australia",    href: "/guides/how-to-sell-a-house-australia",      description: "Every step from pre-listing prep through to settlement day." },
  { title: "How to Choose a Selling Agent",       href: "/guides/how-to-choose-a-selling-agent",      description: "The interview process, the appraisal-price trap, and what to negotiate." },
  { title: "How Much Is My House Worth?",         href: "/guides/how-much-is-my-house-worth-australia", description: "The three ways to value a home and how to land on a figure you can trust." },
  { title: "Free Selling Guide (PDF)",            href: "/selling-guide",                            description: "The full process from listing to settlement, personalised to your suburb." },
];

export default function CostOfSellingAHouseAustraliaPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Check current figures before you commit">
        <p>
          Commission rates, marketing costs, fees and tax rules change, and
          they vary by agent, state and market. Treat every figure here as
          indicative, get written quotes from your own local agents, and
          confirm anything tax-related with the{" "}
          <a href="https://www.ato.gov.au" target="_blank" rel="noopener noreferrer">
            ATO
          </a>{" "}
          or a registered tax agent before you rely on it.
        </p>
      </Callout>

      <EditorNote>
        <p>
          Almost every seller I talk to has done the maths on the sale price
          and almost none of them has done it on the cost of getting there.
          Commission is where the real money sits, and it&rsquo;s the one
          number people accept at face value because they assume it&rsquo;s
          fixed. It isn&rsquo;t. Get the rate in writing, compare a couple of
          agents, and negotiate it like you&rsquo;d negotiate anything else
          worth thousands of dollars.
        </p>
      </EditorNote>

      <h2 id="overview">What it costs to sell a house</h2>
      <p className="lead">
        Selling a house in Australia comes with a stack of costs, most of which
        come out of your sale proceeds at settlement. Commission is the largest
        by a wide margin. The rest are smaller but they add up, and one of them,
        capital gains tax, only applies if the property is an investment rather
        than your home.
      </p>
      <p>Here is the full list a seller usually faces:</p>
      <ul>
        <li><strong>Agent commission</strong>, a percentage of the sale price (the biggest cost)</li>
        <li><strong>Marketing and professional photography</strong> to list and promote the property</li>
        <li><strong>Conveyancing or legal</strong> fees to handle the contract and settlement</li>
        <li><strong>Styling, staging and repairs</strong> to present the home well</li>
        <li><strong>Auctioneer fees</strong> if you sell at auction</li>
        <li><strong>Mortgage discharge fees</strong> if you have a loan to pay out</li>
        <li><strong>Capital gains tax</strong> if the property is an investment, not your main home</li>
      </ul>

      <KeyFigure
        value="2–4%"
        label="A rough guide to total selling costs as a share of the sale price, before any capital gains tax."
        context="Indicative only, commission is the main swing factor"
      />

      <h2 id="commission">Agent commission (the big one)</h2>
      <p>
        Agent commission is the single largest cost of selling and the one most
        sellers overpay. It is charged as a percentage of the final sale price,
        so a higher sale price means a higher fee in dollar terms even at the
        same rate. Some agents charge a flat fee instead, and some add a
        performance incentive on the amount above an agreed target.
      </p>
      <p>
        Rates vary by state and by market. They tend to sit lower in large
        capital cities, where property values are high, and higher in regional
        areas, where sale prices are smaller and the agent&rsquo;s costs are
        spread over a lower number. There is no single national figure, which is
        exactly why comparing local agents matters.
      </p>

      <PullQuote attribution="Andy McMaster, Editor">
        Commission is the line most people overpay and the line most able to be
        negotiated. The rate you&rsquo;re first quoted is a starting point, not a
        fixed price.
      </PullQuote>

      <p>
        The most important thing to understand is that commission is{" "}
        <strong>negotiable</strong>. Agents set their own rates, so the
        percentage on the first agency agreement you read is an opening number.
        Shaving even half a per cent off on a typical sale price is thousands of
        dollars back in your pocket. To negotiate well:
      </p>
      <ul>
        <li>Get written quotes from two or three agents who sell your type of property in your suburb</li>
        <li>Compare the rate against the service and the marketing budget, not in isolation</li>
        <li>Ask each agent to justify their rate, and be wary of one that is far higher with no clear reason</li>
        <li>Check whether the quote is inclusive of GST and what the marketing spend is on top</li>
      </ul>
      <p>
        Work out the dollar figure for your own price and state with our{" "}
        <Link href="/real-estate-commission-calculator">commission calculator</Link>,
        then read the{" "}
        <Link href="/guides/real-estate-agent-fees-australia">agent fees guide</Link>{" "}
        for the full breakdown of rates by state and what is and isn&rsquo;t
        included.
      </p>

      <MatchCTA kind="selling-agent" />

      <h2 id="marketing">Marketing and professional photography</h2>
      <p>
        Marketing is usually billed separately from commission and is paid by
        you, the seller, whether or not the property sells. A typical campaign
        covers professional photography, a listing on the major property
        portals, signboards, floor plans, and sometimes copywriting, video or a
        social media boost.
      </p>
      <p>
        The right marketing spend is proportionate to your price and your
        market, not a fixed package you accept by default. Good photography is
        worth paying for because it drives the early enquiry that sets up
        competition. Premium portal placements and large print campaigns are
        where budgets balloon, so ask what each line item actually adds before
        you sign off on it.
      </p>

      <h2 id="conveyancing">Conveyancing and legal</h2>
      <p>
        You need a conveyancer or solicitor to prepare the contract of sale,
        handle vendor disclosure, manage the legal side of the transaction and
        settle the property. The fee is generally a fixed amount plus search and
        disbursement costs, and it is one of the more predictable line items in
        a sale.
      </p>
      <p>
        It is a smaller cost than commission or marketing, but it is not optional
        and the work has to be done properly. Get a quote up front that
        separates the professional fee from the disbursements so you can compare
        like with like.
      </p>

      <h2 id="presentation">Styling, staging and repairs</h2>
      <p>
        Most homes need some money spent on presentation before they go to
        market. This is the most discretionary part of the budget, and it ranges
        from a clean, declutter and a few small repairs at the low end up to full
        professional styling with hired furniture at the high end.
      </p>
      <p>
        The rule of thumb is to spend only where it pays for itself. A tidy,
        well-presented home does sell for more than a tired one of the same size,
        but money spent is not the same as value added, and many bigger upgrades
        return cents on the dollar. Cosmetic fixes, paint, garden tidy-ups and
        styling usually earn their keep. Major renovations rarely do when the
        sole aim is the sale. Our{" "}
        <Link href="/guides/how-to-sell-a-house-australia">how to sell a house guide</Link>{" "}
        covers which presentation work is worth doing and which to skip.
      </p>

      <h2 id="auction">Auction and auctioneer fees</h2>
      <p>
        If you sell by auction rather than private treaty, there is usually a
        separate auctioneer fee. Sometimes your agent acts as the auctioneer and
        it is built into the agreement, and sometimes an external auctioneer is
        engaged for the day at an extra cost.
      </p>
      <p>
        It is a relatively small line item, but it is worth clarifying before you
        choose your method of sale. Confirm whether the auctioneer fee is
        included in the commission or charged on top, and whether it applies if
        the property is passed in.
      </p>

      <h2 id="discharge">Mortgage discharge fees</h2>
      <p>
        If you still have a home loan on the property, your lender charges a
        mortgage discharge fee to release the mortgage at settlement. It is a
        small, fixed administrative cost, but it is easy to forget when you tally
        up the sale.
      </p>
      <p>
        If you are on a fixed-rate loan, there is a separate point to check:
        breaking a fixed term early can trigger a break cost, which is sometimes
        far larger than the discharge fee itself. Ask your lender for a written
        figure before you commit to a settlement date.
      </p>

      <h2 id="cgt">Capital gains tax on an investment</h2>
      <p>
        If the property is your main home, you generally pay no capital gains tax
        when you sell. This is the main residence exemption, and for most owner-
        occupiers it means CGT simply does not apply.
      </p>
      <p>
        If the property is an investment, capital gains tax can be the single
        largest cost of selling, larger than commission. CGT is charged on the
        gain, broadly the difference between what you sell for and your cost
        base, and it is added to your taxable income for the year. The costs of
        buying and selling, such as commission, marketing, conveyancing and the
        stamp duty you originally paid, generally form part of the calculation
        and reduce the taxable gain.
      </p>

      <Callout variant="warning" title="CGT is detailed, get advice on your own numbers">
        <p>
          Capital gains tax depends on how long you held the property, whether
          it was ever your home, how it was used and your income for the year.
          The numbers can be large and the rules are easy to misread. Confirm
          what applies to your situation with the{" "}
          <a href="https://www.ato.gov.au" target="_blank" rel="noopener noreferrer">
            ATO
          </a>{" "}
          or a registered tax agent before you sell an investment property.
        </p>
      </Callout>

      <h2 id="worked-example">A worked example</h2>
      <p>
        Here is an illustrative breakdown for a family home (not an investment,
        so no CGT) selling for $800,000. The figures are indicative only and
        every number swings with your agent, state and market.
      </p>

      <table>
        <thead>
          <tr>
            <th>Cost</th>
            <th>Indicative amount</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Agent commission</td><td>The largest cost, set as a percentage of the sale price (negotiable)</td></tr>
          <tr><td>Marketing and photography</td><td>A few thousand dollars, depending on the campaign</td></tr>
          <tr><td>Conveyancing or legal</td><td>A fixed fee plus searches and disbursements</td></tr>
          <tr><td>Styling, staging and repairs</td><td>Discretionary, from a few hundred to several thousand</td></tr>
          <tr><td>Auctioneer fee (if applicable)</td><td>A small one-off cost on auction day</td></tr>
          <tr><td>Mortgage discharge fee</td><td>A small fixed lender charge</td></tr>
          <tr><td>Capital gains tax</td><td>$0 on a main home; can be the largest cost on an investment</td></tr>
        </tbody>
      </table>

      <p>
        Add it up and total selling costs on a sale like this often land somewhere
        around 2 to 4 per cent of the price before tax, with commission driving
        most of the figure. That is exactly why the commission line is worth the
        most attention. Run your own price through the{" "}
        <Link href="/real-estate-commission-calculator">commission calculator</Link>{" "}
        to size the biggest cost first.
      </p>

      <h2 id="next-steps">Where to start</h2>
      <p>
        Knowing the costs is one thing. Keeping them down is another. Here is the
        order that saves the most:
      </p>
      <ol>
        <li>
          <strong>Size the biggest cost.</strong> Run your price through the{" "}
          <Link href="/real-estate-commission-calculator">commission calculator</Link>{" "}
          so you know what commission means in dollars before any conversation.
        </li>
        <li>
          <strong>Benchmark the fees.</strong> The{" "}
          <Link href="/guides/real-estate-agent-fees-australia">agent fees guide</Link>{" "}
          shows the rates and inclusions to expect in your state.
        </li>
        <li>
          <strong>Choose the right agent.</strong> Our{" "}
          <Link href="/guides/how-to-choose-a-selling-agent">guide to choosing a selling agent</Link>{" "}
          covers the interview, the over-quote trap and what to negotiate.
        </li>
        <li>
          <strong>Read the full process.</strong> The{" "}
          <Link href="/guides/how-to-sell-a-house-australia">how to sell a house guide</Link>{" "}
          walks through pricing, presentation and settlement end to end.
        </li>
      </ol>

      <MatchCTA kind="selling-agent" />

      <Sources items={SELLING_COST_SOURCES} />
    </GuideArticleLayout>
  );
}

const SELLING_COST_SOURCES: readonly SourceItem[] = [
  { label: "ASIC MoneySmart: Selling a property", href: "https://moneysmart.gov.au/", note: "Consumer guidance on agent fees, marketing and selling costs" },
  { label: "Australian Taxation Office: Capital gains tax", href: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax", note: "Main residence exemption and CGT cost base on investment property" },
  { label: "Australian Taxation Office: Property and capital gains tax", href: "https://www.ato.gov.au", note: "How selling and purchase costs factor into the CGT calculation" },
];
