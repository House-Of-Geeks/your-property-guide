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
import { COST_OF_SELLING_STATE, COST_OF_SELLING_STATES } from "@/lib/data/cost-of-selling-state";
import { AUCTIONEER, CONVEYANCING, DISCHARGE, MARKETING, lineRange, money, nationalSellingCost, sellingCostTable } from "@/lib/data/selling-costs";
import { ScrollTable } from "@/components/guide";
import { commissionSourceItems } from "@/components/guide/CommissionRateTable";
import { COMMISSION_AS_AT, COMMISSION_SOURCE_LIST, nationalRange, pct } from "@/lib/data/commission-rates";

// The national cost guide owns the national cost-of-selling phrases
// (commercial-intent review, 10 Oct 2026, selling P2, 0.3 and section 4).
// Every dollar figure comes from src/lib/data/selling-costs.ts and every
// rate from commission-rates.ts.
const PRICE = 800_000;
const COST = nationalSellingCost(PRICE);
const N = nationalRange();
const STATE_TABLES = COST_OF_SELLING_STATES.map((s) => sellingCostTable(s, PRICE));

const FRONTMATTER: GuideFrontmatter = {
  title: "Cost of Selling a House in Australia (2026): Fees by State",
  h1: "The Cost of Selling a House in Australia (2026): Every Fee, State by State",
  description:
    "What it costs to sell a house in Australia: commission, marketing, conveyancing, state documents and discharge fees, in dollars and by state, with GST.",
  slug: "cost-of-selling-a-house-australia",
  publishedAt: "2026-06-14",
  updatedAt: "2026-10-11",
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
  `Selling an $800,000 house in Australia typically costs ${money(COST.low)} to ${money(COST.high)} before GST on the commission, ${COST.lowPct}% to ${COST.highPct}% of the price, or ${money(COST.lowWithGst)} to ${money(COST.highWithGst)} with it.`,
  `Agent commission is the largest cost: published averages and medians run ${pct(N.low)} to ${pct(N.high)} of the price depending on the state and the area, plus 10% GST, and it is negotiable.`,
  `On top of commission you pay for marketing (an indicative ${lineRange(MARKETING)}), conveyancing (${lineRange(CONVEYANCING)}) and the documents your state requires before you advertise.`,
  `An auctioneer (${lineRange(AUCTIONEER)}) and a mortgage discharge fee (${lineRange(DISCHARGE)}) apply only if you auction or have a loan. Stamp duty is the buyer's cost.`,
  "Since 1 January 2025 every seller needs an ATO clearance certificate, or the buyer must withhold 15% of the price.",
  "If the property is an investment rather than your main home, capital gains tax can be the biggest cost of all. Your family home is generally exempt.",
];

const TOC: GuideTOCEntry[] = [
  { id: "overview",      label: "What it costs to sell a house" },
  { id: "by-state",      label: "Cost of selling by state" },
  { id: "commission",    label: "Agent commission (the big one)" },
  { id: "marketing",     label: "Marketing and photography" },
  { id: "conveyancing",  label: "Conveyancing and legal" },
  { id: "presentation",  label: "Styling, staging and repairs" },
  { id: "auction",       label: "Auctioneer fees" },
  { id: "discharge",     label: "Mortgage discharge fees" },
  { id: "clearance",     label: "The ATO clearance certificate" },
  { id: "adjustments",   label: "Settlement adjustments" },
  { id: "cgt",           label: "Capital gains tax on an investment" },
  { id: "next-steps",    label: "Where to start" },
];

const FAQS: FaqItem[] = [
  {
    question: "How much does it cost to sell a house in Australia?",
    answer:
      `On an $800,000 house, our state cost tables come to ${money(COST.low)} to ${money(COST.high)} before GST on the commission (${COST.lowPct}% to ${COST.highPct}% of the price), or ${money(COST.lowWithGst)} to ${money(COST.highWithGst)} with it. The low end is ${sellingCostTable(COST.lowState, PRICE).stateName} with every line at the bottom of its range, private treaty and no mortgage; the high end is ${sellingCostTable(COST.highState, PRICE).stateName} at the top of every range, with an auction and a loan. Commission is the largest part, then marketing (an indicative ${lineRange(MARKETING)}), conveyancing (${lineRange(CONVEYANCING)}) and your state's pre-sale documents.`,
  },
  {
    question: "What is the average real estate commission in Australia?",
    answer:
      `Published averages and medians run from ${pct(N.low)} (${N.lowWhere}) to ${pct(N.high)} (${N.highWhere}). OpenAgent's state averages run from ${pct(N.averageLow)} in the ACT to ${pct(N.averageHigh)} in Queensland (September 2026), and bRight Agent's national median across more than 200 postcodes is ${pct(N.nationalMedian)} (February 2026). Rates are lower in capital cities than in regional areas. GST of 10% is added if a quote excludes it, and every rate is negotiable.`,
  },
  {
    question: "Who pays the most closing costs?",
    answer:
      "In Australia the buyer pays the biggest settlement cost, stamp duty, plus the transfer registration. The seller pays the agent's commission and marketing, their own conveyancer and any mortgage discharge fee. Council rates, water and strata levies are split to the settlement date. Without an ATO clearance certificate, the buyer must withhold 15% of the price and pay it to the ATO.",
  },
  {
    question: "How do I calculate the cost of selling a house?",
    answer:
      `Add five lines: commission (sale price times the rate, plus 10% GST if the quote excludes it), marketing, conveyancing, your state's pre-sale documents, and an auctioneer and mortgage discharge fee if they apply. At 2% on $800,000, commission is $16,000, or $17,600 with GST; add an indicative ${lineRange(MARKETING)} of marketing and ${lineRange(CONVEYANCING)} of conveyancing. The selling costs calculator does it for your state and shows the cash left after your loan.`,
  },
  {
    question: "How much do you have to pay the government when you sell your house?",
    answer:
      "Usually very little. Stamp duty is paid by the buyer, not the seller. You pay the land registry fee to discharge a mortgage (often included in the lender's discharge fee), and capital gains tax only if the property is an investment rather than your main residence. You also need a free ATO clearance certificate before settlement, or the buyer withholds 15% of the price.",
  },
  {
    question: "What costs can you deduct when selling an investment property?",
    answer:
      "When you sell an investment property, the costs of selling and buying can usually be included in the capital gains tax calculation, which reduces the taxable gain. That generally covers things like agent commission, marketing, conveyancing and legal fees on the sale, and the original purchase costs such as stamp duty paid when you bought. It does not apply to your main home, which is generally exempt from capital gains tax. The rules are detailed, they change for gains that accrue from 1 July 2027, and they depend on your circumstances, so confirm what applies to you with the ATO or a registered tax agent before you sell.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Commission Calculator",              href: "/real-estate-commission-calculator",        description: "Estimate the biggest selling cost for your price and state." },
  { title: "Selling Costs Calculator",           href: "/selling-costs-calculator",                 description: "Every line of the bill and your net proceeds after the loan." },
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
          Commission figures are published averages and medians, read{" "}
          {COMMISSION_AS_AT}; the other lines are indicative budgets, because
          each is quoted individually and no state publishes a survey. Get
          written quotes from your own local agents, and
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
        Selling an $800,000 house in Australia typically costs{" "}
        {money(COST.low)} to {money(COST.high)} before GST on the commission,{" "}
        {COST.lowPct}% to {COST.highPct}% of the price, depending on the state,
        the agent&rsquo;s rate and whether you auction or have a loan to
        discharge. Most of it comes out of your sale proceeds at settlement, and
        commission is the largest line by a wide margin. Run your own numbers
        in the <Link href="/selling-costs-calculator">selling costs calculator</Link>.
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
        value={`${COST.lowPct}% to ${COST.highPct}%`}
        label={`Total selling costs on an $800,000 house across the states, before GST on the commission and before any capital gains tax: ${money(COST.low)} to ${money(COST.high)}.`}
        context="Commission is the main swing factor"
      />

      <h2 id="by-state">Cost of selling by state</h2>
      <p>
        Every state&rsquo;s cost table worked at the same $800,000 price.
        Commission is each state&rsquo;s published range; the documents are what
        each state&rsquo;s law requires before you advertise or exchange. Each
        state guide works the full bill and includes the{" "}
        <Link href="/selling-costs-calculator">selling costs calculator</Link>{" "}
        preset to its rate.
      </p>
      <ScrollTable label="Cost of selling an $800,000 house by state">
        <table>
          <thead>
            <tr>
              <th>State</th>
              <th>Commission</th>
              <th>Commission at $800,000</th>
              <th>Total, before GST on commission</th>
              <th>Pre-sale documents</th>
            </tr>
          </thead>
          <tbody>
            {STATE_TABLES.map((t) => (
              <tr key={t.state}>
                <td><Link href={`/guides/${COST_OF_SELLING_STATE[t.state].slug}`}><strong>{t.state}</strong></Link></td>
                <td>{pct(t.commission.low)} to {pct(t.commission.high)}</td>
                <td>{money(t.commission.lowAmount)} to {money(t.commission.highAmount)}</td>
                <td>{money(t.totalLow)} to {money(t.totalHigh)}<br /><small>{t.totalLowPct}% to {t.totalHighPct}%</small></td>
                <td>{t.documents.label}: {money(t.documents.low)} to {money(t.documents.high)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollTable>
      <p>
        <small>
          As at {COMMISSION_AS_AT}. Commission: published averages and medians
          (sources below). Low total: private treaty, no mortgage, every line at
          the bottom of its range; high total: auction with a mortgage, every
          line at the top. Add 10% GST to the commission if your quote excludes
          it. Marketing, conveyancing, documents, auctioneer and discharge are
          indicative ranges, not a survey.
        </small>
      </p>

      <h2 id="commission">Agent commission (the big one)</h2>
      <p>
        Agent commission is the single largest cost of selling and the one most
        sellers overpay. It is charged as a percentage of the final sale price,
        so a higher sale price means a higher fee in dollar terms even at the
        same rate. Some agents charge a flat fee instead, and some add a
        performance incentive on the amount above an agreed target.
      </p>
      <p>
        Rates vary by state and by market. Published averages and medians run
        from {pct(N.low)} ({N.lowWhere}) to {pct(N.high)} ({N.highWhere}), and
        state averages from {pct(N.averageLow)} in the ACT to {pct(N.averageHigh)} in
        Queensland (OpenAgent, September 2026). They sit lower in the capital
        cities, where property values are high, and higher in regional areas.
        GST of 10% is added if a quote excludes it. Our guide to{" "}
        <Link href="/guides/real-estate-agent-fees-australia">real estate agent fees in every state</Link>{" "}
        has the sourced table.
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
        On an $800,000 sale, every 0.1% is $800 before GST. To negotiate well:
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

      <h2 id="marketing">Marketing and photography: {lineRange(MARKETING)}</h2>
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

      <h2 id="conveyancing">Conveyancing and legal: {lineRange(CONVEYANCING)}</h2>
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
        sole aim is the sale. Our guide to{" "}
        <Link href="/guides/what-to-fix-before-selling-a-house">what to fix before selling a house</Link>{" "}
        ranks the jobs, and the{" "}
        <Link href="/guides/how-to-sell-a-house-australia">how to sell a house guide</Link>{" "}
        covers the whole process.
      </p>

      <h2 id="auction">Auctioneer fees: {lineRange(AUCTIONEER)}</h2>
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

      <h2 id="discharge">Mortgage discharge fees: {lineRange(DISCHARGE)}</h2>
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

      <h2 id="clearance">The ATO clearance certificate</h2>
      <p>
        Since 1 January 2025 the foreign resident capital gains withholding
        rate is 15% and it applies to the value of all property, whatever the
        price (ATO). An Australian resident seller avoids it by giving the buyer
        a clearance certificate before settlement; without one, the buyer must
        withhold 15% of the price and pay it to the ATO, and you wait for your
        tax return to get it back. The certificate is free and applied for
        online, so ask your conveyancer to lodge it the week you list.
      </p>

      <h2 id="adjustments">Settlement adjustments: rates, water and strata</h2>
      <p>
        Council rates, water charges and, for a unit, strata or body corporate
        levies are apportioned to the settlement date. If you have paid ahead,
        the buyer reimburses you; if you are behind, the amount comes out of
        your proceeds. They are not a cost of selling as such, but they move
        the figure that lands in your account, so ask your conveyancer for the
        settlement statement before the day.
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
  ...commissionSourceItems(COMMISSION_SOURCE_LIST),
  { label: "ATO: Foreign resident capital gains withholding overview (from 1 January 2025, 15% applies to the value of all property)", href: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/foreign-residents-and-capital-gains-tax/foreign-resident-capital-gains-withholding/foreign-resident-capital-gains-withholding-overview", note: "updated 22 June 2026, read 11 October 2026" },
  { label: "ATO: Australian residents and clearance certificates", href: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/foreign-residents-and-capital-gains-tax/foreign-resident-capital-gains-withholding/australian-residents-and-clearance-certificates", note: "read 11 October 2026" },
  { label: "ATO: Property and capital gains tax", href: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/property-and-capital-gains-tax", note: "Main residence exemption and the CGT cost base on an investment property" },
  "Marketing, conveyancing, document, auctioneer and discharge figures are indicative ranges quoted individually by suppliers; no state publishes a survey, so treat them as a budget. State document requirements are sourced on each state cost guide.",
];
