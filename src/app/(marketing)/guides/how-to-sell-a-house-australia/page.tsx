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
import { HowToJsonLd } from "@/components/seo";
import { SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";
import { ATO_REFORM_SOURCE } from "@/lib/data/tax-reform-2027";
import { nationalRange, pct } from "@/lib/data/commission-rates";
import { AUCTIONEER, CONVEYANCING, DISCHARGE, MARKETING, STATE_DOCUMENTS, lineRange, money, nationalSellingCost } from "@/lib/data/selling-costs";
import { STATE_NAMES, STATE_ORDER } from "@/lib/data/commission-rates";
import { ScrollTable } from "@/components/guide";

// Selling-cost figures come from the shared data (commercial-intent review, 10 Oct 2026, selling 0.3).
const N = nationalRange();
const COST = nationalSellingCost(800_000);

const FRONTMATTER: GuideFrontmatter = {
  title: "How to Sell a House in Australia (2026): Steps and Costs",
  description:
    "A step-by-step guide to selling residential property in Australia: deciding when to sell, choosing the right agent, setting price, the auction vs private treaty decision, the campaign, contracts and settlement.",
  slug: "how-to-sell-a-house-australia",
  publishedAt: "2026-05-13",
  updatedAt: "2026-10-11",
  readingTimeMinutes: 14,
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
  "Selling a house in Australia typically takes 8 to 12 weeks from listing to settlement, with the campaign itself running 4 to 6 weeks.",
  "The single biggest factor in your sale price is the agent you pick. Interview at least three who actually sell in your suburb.",
  "Auction works best for properties with broad appeal in active markets; private treaty suits unique homes, quieter markets, or sellers who want price certainty.",
  `Selling an $800,000 house costs ${money(COST.low)} to ${money(COST.high)} across the states before GST on the commission (${COST.lowPct}% to ${COST.highPct}%): agent commission, marketing, conveyancing and your state's documents, plus capital gains tax on an investment.`,
  "The legal stack varies by state. VIC needs a Section 32, NSW a contract with prescribed documents, QLD a disclosure statement from 2025. Get your conveyancer engaged before the agent.",
  "Spend on presentation (cleaning, decluttering, paint, styling) before renovation: structural work rarely pays for itself at sale.",
];

const TOC: GuideTOCEntry[] = [
  { id: "when-to-sell",      label: "When is the right time to sell?" },
  { id: "selling-costs",     label: "What it costs to sell" },
  { id: "preparing-house",   label: "Preparing the house" },
  { id: "choosing-agent",    label: "Choosing an agent" },
  { id: "auction-vs-treaty", label: "Auction vs private treaty" },
  { id: "setting-price",     label: "Setting the price" },
  { id: "marketing",         label: "The marketing campaign" },
  { id: "contracts",         label: "Before you advertise: each state" },
  { id: "negotiating",       label: "Negotiating offers" },
  { id: "settlement",        label: "Settlement day" },
  { id: "tax",               label: "Capital gains tax" },
];

const FAQS: FaqItem[] = [
  {
    question: "How long does it take to sell a house in Australia?",
    answer:
      "Eight to twelve weeks is typical, end to end. Allow one to two weeks for agent selection and pre-listing prep, four to six weeks for the marketing campaign and inspections, and a six-week settlement once contracts are signed. Auction campaigns are shorter (three to four weeks of marketing then auction day), but the settlement still adds another four to six weeks. Hot markets and well-presented properties sell faster; quiet markets and ambitious price guides take longer.",
  },
  {
    question: "Do I need a conveyancer or solicitor to sell?",
    answer:
      "In practice, yes. Every sale needs a contract, and most states also require documents from the seller: in NSW the contract with its prescribed documents must exist before the property is offered for sale, Victoria's Section 32 vendor statement goes to the buyer before they sign, Queensland has required a seller disclosure statement since 1 August 2025, South Australia has the Form 1 vendor's statement, and the ACT requires building, pest and energy reports before advertising. WA and the NT require no vendor statement. A conveyancer or solicitor prepares these, handles searches, manages the deposit and settlement, and protects you from contract risks. Engage them before you list.",
  },
  {
    question: "Should I sell or rent out my house?",
    answer:
      "Run both numbers. Selling gives you a capital lump sum (taxed if it's an investment property, see capital gains below). Renting gives you ongoing income but also ongoing landlord responsibility, vacancy risk, maintenance costs, and management fees. The standard test: if your equity is producing less than 4 to 5% gross yield as a rental, the sale proceeds invested elsewhere typically outperform. The exception is a property in a high-growth corridor where you expect significant capital appreciation in the next three to five years.",
  },
  {
    question: "How much does it cost to sell a house in Australia?",
    answer:
      `On an $800,000 house, ${money(COST.low)} to ${money(COST.high)} across the states before GST on the commission, ${COST.lowPct}% to ${COST.highPct}% of the price. The components: agent commission (published averages ${pct(N.low)} to ${pct(N.high)}, plus GST), marketing (an indicative ${lineRange(MARKETING)}), conveyancing (${lineRange(CONVEYANCING)}), your state's documents, a mortgage discharge fee (${lineRange(DISCHARGE)}), and any pre-sale repairs or styling. Capital gains tax can be a much larger cost if the property was an investment, see the tax section.`,
  },
  {
    question: "Can I sell my house without an agent?",
    answer:
      "Yes. It's legal in every state, and \"for sale by owner\" (FSBO) services exist that list your property on realestate.com.au and domain.com.au for a flat fee. The maths only works if you would have paid an agent who couldn't lift the sale price by more than the fee. Agents earn their fee through the buyer pool they reach, pricing evidence and negotiation, so FSBO suits straightforward properties in active markets where the price is easy to evidence. Our guide to selling privately sets out the costs side by side.",
  },
  {
    question: "Should I sell first or buy first?",
    answer:
      "Most sellers should sell first. It gives you a known budget, removes the bridging-finance trap, and means you negotiate from strength. The exception is if your local market is extremely tight on the buy side and you'd struggle to find a replacement home in a normal timeframe. In that case, buy first with a long settlement (typically 90 days, sometimes longer), or use a bridging loan. We cover this in detail in our sell-first-or-buy-first guide.",
  },
  {
    question: "Will I pay capital gains tax when I sell?",
    answer:
      "Not on your principal place of residence (the main residence exemption, full or partial depending on how long you lived there and whether you ever rented it out). Investment properties trigger CGT on the gain, generally the sale price minus the cost base. For a sale before 1 July 2027, an individual who held the property for at least 12 months halves the gain. From 1 July 2027 the 50% discount is replaced by cost base indexation and a 30% minimum tax for individuals, on the part of the gain that accrues from that date, including on property you already own (ATO, last updated 29 June 2026). Off-the-plan, deceased estate, and joint-ownership cases get complex; talk to an accountant before you list if any of those apply. Our guide to the CGT changes from the 2026 Budget has worked examples.",
  },
  {
    question: "Do I have to disclose problems with the property?",
    answer:
      "It varies by state, but the safe answer is yes. NSW and VIC require disclosure of certain encumbrances, planning matters, and zoning issues but not all defects. Buyers are expected to do their own building and pest. QLD's new seller disclosure regime (from 1 August 2025) is much broader and requires sellers to provide a prescribed disclosure statement with title, encumbrance, and certain physical-condition information. Across all states, deliberately concealing a known major defect (subsidence, asbestos, illegal building work) exposes you to a rescission claim and damages even after settlement.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Free Selling Guide (PDF)",            href: "/selling-guide",                             description: "This guide and nine more chapters as a free PDF, personalised to your suburb." },
  { title: "Commission Calculator",               href: "/real-estate-commission-calculator",         description: "What an agent costs on your sale price, by state." },
  { title: "How to Choose a Selling Agent",       href: "/guides/how-to-choose-a-selling-agent",      description: "The interview process, the appraisal-price trap, and what to negotiate in the listing agreement." },
  { title: "Real Estate Agent Fees in Australia", href: "/guides/real-estate-agent-fees-australia",   description: "Commission ranges by state, marketing budgets, and what's negotiable." },
  { title: "Property Auction Guide",              href: "/guides/property-auction-guide",             description: "How auctions actually run from a seller's perspective." },
  { title: "Sell First or Buy First?",            href: "/guides/sell-first-or-buy-first",            description: "The sequencing decision when you're moving home, with worked examples." },
  { title: "Free Property Appraisal",             href: "/appraisal",                                 description: "An independent appraisal from a vetted local agent, no commitment." },
  { title: "Conveyancing Guide",                  href: "/guides/conveyancing-guide",                 description: "What your conveyancer does for the sell side." },
];

export default function HowToSellAHouseAustraliaPage() {
  return (
    <>
      <HowToJsonLd
        name="How to sell a house in Australia"
        description="The ten-step process for selling a residential property in Australia, from pre-listing prep through settlement."
        url={`/guides/${FRONTMATTER.slug}`}
        totalTime="P3M"
        steps={[
          { name: "Decide if now is the right time to sell", text: "Check seasonality, your local market's days-on-market trend, your equity position, and whether you have a credible plan for where you'll live next." },
          { name: "Engage a conveyancer and order pre-sale documents", text: "Your conveyancer prepares the contract of sale (Section 32 in VIC, disclosure statement in QLD, NSW contract). This has to be ready before the agent lists." },
          { name: "Prepare and present the property", text: "Cosmetic improvements only: deep clean, declutter, paint where worn, fix obvious defects, professional styling for the campaign." },
          { name: "Interview three or four agents", text: "Pick agents who recently sold in your suburb. Compare appraised price, recommended marketing strategy, and commission. Negotiate the listing agreement carefully." },
          { name: "Decide auction or private treaty", text: "Auction suits broad-appeal properties in active markets; private treaty suits unique homes, quieter markets, or sellers wanting price certainty." },
          { name: "Set the price guide", text: "Use comparable sales from the last 90 days, in the same suburb, of similar property type. Avoid the over-quote trap." },
          { name: "Run the marketing campaign", text: "Professional photography and copy, online listing on realestate.com.au and domain.com.au, signboard, open homes, and (auction) auction day." },
          { name: "Negotiate offers", text: "Read every offer in context: price, conditions, deposit, settlement length, finance status. Highest price isn't always the best offer." },
          { name: "Sign the contract", text: "Once you accept an offer, the buyer signs, your conveyancer handles exchange (or auction-day signing), the cooling-off period runs (where applicable), and the contract is binding." },
          { name: "Complete settlement", text: "Discharge your mortgage, sign transfer documents, hand over keys. Funds settle through your conveyancer." },
        ]}
      />
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <p className="lead">
        Selling a house in Australia runs in five steps: get appraisals and
        appoint one agent in writing, have the contract and your state&rsquo;s
        disclosure documents prepared (in NSW and the ACT, before you
        advertise), market the home and take offers, exchange contracts, then
        settle. In NSW you can cancel the agency agreement until 5 pm on the
        next business day or Saturday after signing.
      </p>

      <Callout variant="info" title="One page, the whole process">
        <p>
          This guide covers every step from deciding to sell through to
          settlement day. If you want to skip ahead, the deepest detail is in
          the agent-choice and pricing sections. Those are where most sale
          prices are won or lost.
        </p>
      </Callout>

      <EditorNote>
        <p>
          Most sellers I&rsquo;ve seen overpay on marketing and underpay
          on agent choice. The campaign budget is what you can see, so
          it feels controllable. The agent&rsquo;s real skill is the
          quiet negotiation that happens after the open homes, which is
          where every dollar of your eventual sale price actually lives.
          Read the agent-choice section before you read anything else.
        </p>
      </EditorNote>

      <h2 id="when-to-sell">When is the right time to sell?</h2>
      <p className="lead">
        Three questions matter more than the season: where the local market is
        in its cycle, what your equity position looks like, and whether you
        have a credible plan for where you&rsquo;ll live next. Get those right
        and you can sell well at any point in the year.
      </p>
      <p>
        Australian property markets are heavily local. National headlines
        don&rsquo;t tell you much about what&rsquo;s happening on your street.
        Before you list, check three things in your immediate suburb:
      </p>
      <ul>
        <li><strong>Days on market.</strong> Trending down means buyer activity is high. Trending up suggests softness.</li>
        <li><strong>Auction clearance rate</strong> (in capital cities). Above 70% indicates a strong sellers&rsquo; market. Below 55% means buyers are setting the price.</li>
        <li><strong>Stock levels.</strong> How many comparable properties are on the market right now? Lots of competing listings dilutes attention.</li>
      </ul>
      <p>
        Seasonally, spring is the peak listing window in most of Australia
        because gardens look their best and there&rsquo;s typically more buyer
        activity. But that means more competing stock. A well-presented
        property listed in late autumn often achieves a stronger result
        because the buyer pool isn&rsquo;t spoilt for choice. The right time is
        the time that matches your circumstances, not a date on the calendar.
      </p>

      <h2 id="selling-costs">What it costs to sell</h2>
      <p>
        On an $800,000 house, our state cost tables put the total at{" "}
        <strong>{money(COST.low)} to {money(COST.high)}</strong> before GST on
        the commission ({COST.lowPct}% to {COST.highPct}% of the price), before
        any capital gains tax. Our guide to{" "}
        <Link href="/guides/cost-of-selling-a-house-australia">what it costs to sell a house</Link>{" "}
        goes through every line by state. The components:
      </p>
      <ul>
        <li><strong>Agent commission</strong>: published averages and medians of {pct(N.low)} to {pct(N.high)} of the sale price depending on the state and the area, plus GST. Negotiable; see{" "}
          <Link href="/guides/real-estate-agent-fees-australia">real estate agent fees by state</Link>.</li>
        <li><strong>Marketing</strong>: an indicative {lineRange(MARKETING)}, paid by the seller separately from commission and usually whether or not the home sells.</li>
        <li><strong>Conveyancing</strong>: {lineRange(CONVEYANCING)} depending on state and complexity, plus the documents your state requires.</li>
        <li><strong>Mortgage discharge</strong>: {lineRange(DISCHARGE)} in lender and registration fees. Fixed-rate break costs are separate.</li>
        <li><strong>Pre-sale prep</strong>: cleaning $300 to $800, decluttering / removalist for staging $500 to $2,000, styling $3,000 to $8,000 for a 6-week campaign, minor repairs as needed.</li>
        <li><strong>Auction fees</strong> (if auctioning): {lineRange(AUCTIONEER)} for the auctioneer, sometimes included in the agency agreement.</li>
        <li><strong>Capital gains tax</strong>: only on investment properties (see the tax section).</li>
      </ul>

      <KeyFigure
        value={`${money(COST.low)} to ${money(COST.high)}`}
        label="Total selling costs on an $800,000 house across the states, before GST on the commission"
        context="Excluding capital gains tax; the selling costs calculator works your own figures"
      />

      <h2 id="preparing-house">Preparing the house</h2>
      <p>
        Spend money on presentation, not renovation. Cosmetic work (cleaning,
        decluttering, paint, styling) is cheap and changes how a home
        photographs and inspects. Structural work (new kitchen, bathroom
        renovation, extensions) rarely returns its cost at sale. Our guide to{" "}
        <Link href="/guides/what-to-fix-before-selling-a-house">what to fix before selling a house</Link>{" "}
        ranks the jobs. You&rsquo;re
        better off pricing the property as-is and letting the buyer choose
        their own finish.
      </p>
      <p>
        High-ROI presentation work, in order:
      </p>
      <ol>
        <li><strong>Deep clean</strong> the whole house. Windows, oven, grout, light fittings. Cheap, transformative.</li>
        <li><strong>Declutter aggressively.</strong> Half the contents of every cupboard goes to storage. Buyers can&rsquo;t see space behind your stuff.</li>
        <li><strong>Touch-up paint</strong> on scuffed walls and skirting. Full repaint only if multiple rooms are obviously tired.</li>
        <li><strong>Fix obvious defects</strong> a building inspector would flag: leaking taps, loose door handles, cracked tiles, missing flyscreens.</li>
        <li><strong>Garden tidy.</strong> Mowed lawn, edged paths, weeded beds, pressure-washed driveway. Kerb appeal sets the tone for every walk-through.</li>
        <li><strong>Professional styling</strong> for vacant or sparsely-furnished homes. Our <Link href="/guides/home-staging-cost-australia">home staging cost guide</Link> covers prices and when it pays.</li>
      </ol>
      <p>
        What <em>not</em> to do: don&rsquo;t renovate the kitchen or bathroom
        before selling. The cost recovery is poor. The buyer who pays for
        renovation prefers to choose their own finishes anyway. Read our{" "}
        <Link href="/guides/renovation-cost-australia-2026">renovation cost guide</Link>{" "}
        if you&rsquo;re considering it.
      </p>

      <Callout variant="warning" title="The over-improvement trap">
        <p>
          A pre-sale renovation has to add more to the price than it costs, in
          the few weeks before you list, to be worth doing, and kitchens and
          bathrooms rarely clear that bar. Cosmetic presentation is cheaper and
          lower risk. If the kitchen
          is dated, list at a price that reflects that and let the buyer
          decide.
        </p>
      </Callout>

      <PullQuote attribution="Andy McMaster, Editor">
        The agent who appraises your home highest is rarely the one
        who sells it for the most. They&rsquo;re just the one who
        wanted the listing.
      </PullQuote>

      <h2 id="choosing-agent">Choosing an agent</h2>
      <p>
        The agent you pick will probably have more influence on your sale
        price than anything else you do. Cover the full process in our
        dedicated guide: <Link href="/guides/how-to-choose-a-selling-agent">how to choose a selling agent</Link>.
        The short version:
      </p>
      <ul>
        <li>Interview at least three agents who genuinely sell in your suburb (check their recent sold listings on realestate.com.au and domain.com.au).</li>
        <li>Demand comparable sales evidence for any appraisal price. Last 90 days, same suburb, similar property type.</li>
        <li>Watch for the &quot;over-quote, then condition you down&quot; play. Agents who quote 10%+ above the others without supporting evidence are using it as a sales tactic.</li>
        <li>Negotiate commission, but don&rsquo;t pick on price alone. A 0.3% commission saving on $1M is $3,000. A 2% lift in sale price is $20,000. Pick the agent who&rsquo;ll get you the higher price, then negotiate the fee.</li>
        <li>Read the listing agreement carefully: exclusive period, marketing commitment, tail clause length, termination terms.</li>
      </ul>

      <MatchCTA kind="selling-agent" />

      <h2 id="auction-vs-treaty">Auction vs private treaty</h2>
      <p>
        The two main sale methods in Australia. Each has clear use cases.
      </p>
      <h3>Auction</h3>
      <p>
        Best for properties with broad market appeal in active markets:
        sub-median homes in popular suburbs, period houses with character,
        anything where competition is plausible. The campaign is short (three
        to four weeks of marketing then auction day), the buyer pool is
        focused, and the unconditional sale on auction day removes
        post-contract risk. Our{" "}
        <Link href="/guides/reserve-price-auction">reserve price guide</Link>{" "}
        covers how to set the reserve, and Victoria&rsquo;s rule that from
        16 October 2026 it will have to be published a week before the
        auction.
      </p>
      <p>
        Auction works less well in quieter markets, for unique properties
        where buyer demand is narrow, or when the local clearance rate is
        below 55%. If the property is passed in on auction day, you&rsquo;ve
        signalled to subsequent buyers that demand was thin, and that often
        depresses the eventual sale price.
      </p>
      <h3>Private treaty</h3>
      <p>
        Best for unique homes, quieter markets, regional areas where auction
        culture is weaker, and sellers who want price certainty. The campaign
        runs four to six weeks (or longer), the price is publicly listed, and
        the buyer makes a written offer subject to negotiation. Contracts can
        be conditional on finance, building and pest, and other due-diligence
        items. This both expands your buyer pool and introduces post-contract
        risk if those conditions aren&rsquo;t met.
      </p>
      <h3>Other methods</h3>
      <p>
        <strong>Expressions of interest (EOI)</strong> is essentially a
        deadline-driven private treaty: written offers due by a set date, then
        the seller negotiates with the highest bidders. Used for higher-end
        properties where the seller wants to control the negotiation and
        avoid the public theatre of auction.
      </p>
      <p>
        <strong>Off-market</strong> sales happen entirely without a public
        listing: agents shop the property to their database. Suits sellers
        who want discretion (and who don&rsquo;t mind the smaller buyer pool).
        See our <Link href="/off-market">off-market property page</Link>.
      </p>

      <h2 id="setting-price">Setting the price</h2>
      <p>
        Price guidance is a science of comparable sales, not optimism. The
        method:
      </p>
      <ol>
        <li>Pull every sale in your suburb from the last 90 days, same property type (house / unit / townhouse).</li>
        <li>Filter to the most comparable on bedrooms, bathrooms, land size, condition and street appeal. Aim for 5 to 8 truly comparable sales.</li>
        <li>Adjust each comparable up or down based on real differences (better street: +3%, dated kitchen: -2%, bigger block: +5%).</li>
        <li>The resulting range is your honest price expectation. Set the auction reserve or private-treaty asking price within it.</li>
      </ol>
      <p>
        Underquoting laws vary by state but the principle is consistent: the
        advertised price guide must reflect a reasonable price the seller
        would consider. NSW, VIC and QLD all have explicit underquoting rules
        and have prosecuted agents who breach them. Your agent will set the
        guide range; insist they justify it against the comparable sales.
      </p>

      <h2 id="marketing">The marketing campaign</h2>
      <p>
        A typical $5,000 to $8,000 marketing budget covers:
      </p>
      <ul>
        <li><strong>Professional photography</strong> ($800 to $1,800). Single biggest line item in terms of impact on online click-through. Spend here.</li>
        <li><strong>Copywriting</strong> for the listing ($200 to $400, often bundled with photography).</li>
        <li><strong>Floor plan</strong> ($150 to $400). Listings with floor plans get materially more enquiries.</li>
        <li><strong>realestate.com.au and domain.com.au listings</strong> ($1,500 to $4,000 each for &quot;premiere&quot;-tier visibility, which is essential in competitive suburbs).</li>
        <li><strong>Signboard</strong> ($200 to $400).</li>
        <li><strong>Social media boost</strong> ($300 to $800 for Facebook / Instagram).</li>
        <li><strong>Open homes</strong> (no marketing cost, but the agent&rsquo;s time and your weekend).</li>
        <li><strong>Optional</strong>: drone photography ($400 to $800), video tour ($800 to $1,800), print brochures ($300 to $800), local newspaper ($500 to $1,500), virtual staging if vacant ($500 to $1,200).</li>
      </ul>
      <p>
        For higher-end properties ($2M+), expect $10,000 to $25,000 with
        broader print spend, premium tiered online listings, drone, and full
        video tour. Match the campaign to the price point. Overspending on a
        sub-$800K property rarely returns the cost.
      </p>

      <h2 id="contracts">Before you advertise: what each state requires</h2>
      <p>
        The legal documents a seller must prepare, and when, vary by state.
        Each row names the government or legislation source; the costs are
        indicative ranges, quoted individually by conveyancers.
      </p>
      <ScrollTable label="Seller documents by state">
        <table>
          <thead>
            <tr>
              <th>State</th>
              <th>What you prepare</th>
              <th>Indicative cost</th>
            </tr>
          </thead>
          <tbody>
            {STATE_ORDER.map((st) => {
              const d = STATE_DOCUMENTS[st];
              return (
                <tr key={st}>
                  <td><strong>{STATE_NAMES[st].replace(/^the /, "")}</strong></td>
                  <td>
                    <strong>{d.label}.</strong> {d.note}{" "}
                    <a href={d.source.href} target="_blank" rel="nofollow noopener">{d.source.label}</a>
                  </td>
                  <td>{lineRange(d)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </ScrollTable>
      <p>
        Engage your{" "}
        <Link href="/guides/conveyancing-guide">conveyancer</Link> <em>before</em>{" "}
        you list the property. The
        contract has to be ready when the agent starts marketing, especially
        for auction (where the buyer signs an unconditional contract on
        auction day).
      </p>

      <h2 id="negotiating">Negotiating offers</h2>
      <p>
        Once buyers start making offers (private treaty) or bidding (auction),
        read every offer in context. The headline price isn&rsquo;t the only
        thing that matters:
      </p>
      <ul>
        <li><strong>Conditions.</strong> Is the offer subject to finance, building and pest, sale of buyer&rsquo;s own home, or due-diligence period? Each condition adds risk.</li>
        <li><strong>Deposit.</strong> Standard is 10%. A 5% deposit (sometimes accepted) is weaker. A buyer offering 10% on exchange and another 10% on early access shows commitment.</li>
        <li><strong>Settlement length.</strong> Standard is 30 to 42 days in most states, 60 days for VIC. A buyer offering a longer settlement may be more flexible on price but leaves you holding the property longer.</li>
        <li><strong>Finance status.</strong> Pre-approved buyer is much less risky than buyer awaiting bank approval.</li>
        <li><strong>Chain risk.</strong> Buyer needs to sell their own home first? That introduces a second transaction risk to yours.</li>
      </ul>
      <p>
        A clean offer at $880K can be worth more than a $900K offer subject
        to finance, building and pest, and sale of the buyer&rsquo;s existing
        home. Your agent should be guiding you through this. Push back if
        they fixate on the headline number.
      </p>

      <h2 id="settlement">Settlement day</h2>
      <p>
        Settlement is the transfer of legal title and the exchange of funds.
        Your conveyancer manages it. You sign transfer documents, the
        buyer&rsquo;s funds clear, your mortgage discharges, and the keys
        change hands. The whole thing typically happens electronically through
        PEXA (Property Exchange Australia) without anyone physically meeting.
      </p>
      <p>
        On the day:
      </p>
      <ul>
        <li>The buyer typically does a pre-settlement inspection that morning. Make sure the property is in the contracted condition.</li>
        <li>Leave instruction manuals, warranties, keys (all of them), garage remotes, alarm codes, and any chattels included in the sale.</li>
        <li>Read the meter and notify utilities (water, electricity, gas, internet) that you&rsquo;ve sold and want the account closed or transferred.</li>
        <li>Funds typically clear within minutes of settlement. Your conveyancer will pay out your existing mortgage and transfer the balance to your nominated account.</li>
      </ul>

      <h2 id="tax">Capital gains tax</h2>
      <p>
        If the property was your principal place of residence the whole time
        you owned it, no CGT applies. The main residence exemption covers the
        full gain. If it was ever rented out, or it was an investment
        property, CGT applies on the portion of ownership where it wasn&rsquo;t
        your main residence.
      </p>
      <p>
        The simplified maths: <strong>(sale price − selling costs) − (purchase
        price + buying costs + capital improvements)</strong> = the gross
        gain. For a sale before 1 July 2027, an Australian resident who held
        the property for at least 12 months gets a 50% discount on the gain
        before adding it to their taxable income for the year. The tax bill can
        be material: on a $300K gain, an individual whose discounted gain is all
        taxed at 37% pays around $55K.
      </p>
      <p>
        <strong>The rules change on 1 July 2027.</strong> The 2026-27 Budget
        measures are now law: from that date the 50% CGT discount for
        individuals, trusts and partnerships is replaced by cost base
        indexation and a 30% minimum tax on capital gains, and it applies to
        the part of the gain that accrues from 1 July 2027, including on
        property you already own (ATO, last updated 29 June 2026). Our guide to{" "}
        <Link href="/guides/cgt-changes-2026-budget">the CGT changes from the 2026 Budget</Link>{" "}
        works through examples for property you hold today.
      </p>
      <p>
        Get advice from an accountant before you list if any of
        these apply: investment property, ever rented out, deceased estate,
        co-ownership change, off-the-plan settlement, or a property where
        you&rsquo;ve claimed depreciation. Our <Link href="/cgt-calculator">CGT calculator</Link> gives you a
        rough estimate.
      </p>

      <MatchCTA kind="accountant" />

      <Sources items={SELLING_HOUSE_SOURCES} />
    </GuideArticleLayout>
    </>
  );
}

const SELLING_HOUSE_SOURCES: readonly SourceItem[] = [
  { label: "ATO: CGT and the main residence exemption", href: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/property-and-capital-gains-tax", note: "Main residence rules and 50% discount cited in the tax section" },
  ATO_REFORM_SOURCE,
  { label: "NSW Fair Trading: Real estate agents and underquoting", href: "https://www.fairtrading.nsw.gov.au/", note: "NSW agent obligations and underquoting enforcement" },
  { label: "Consumer Affairs Victoria: Section 32 vendor statements", href: "https://www.consumer.vic.gov.au/", note: "VIC pre-listing disclosure requirements" },
  { label: "Queensland Government: Property Law Act 2023 seller disclosure regime", href: "https://www.qld.gov.au/law/laws-regulated-industries-and-accountability/queensland-laws-and-regulations", note: "QLD disclosure statement commenced 1 August 2025" },
  { label: "CoreLogic Australia: Auction clearance rates and days-on-market", href: "https://www.corelogic.com.au/", note: "Market-condition benchmarks throughout the guide" },
  { label: "PEXA: Settlement and electronic conveyancing", href: "https://www.pexa.com.au/", note: "Settlement-day process described in section 10" },
  { label: "REIA: Australian Property Market Report", note: "Quarterly, used for national context on agent commission and marketing budgets" },
];
