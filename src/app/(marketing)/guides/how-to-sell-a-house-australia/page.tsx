import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  MatchCTA,
  Sources,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { HowToJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "How to Sell a House in Australia (2026)",
  description:
    "A step-by-step guide to selling residential property in Australia: deciding when to sell, choosing the right agent, setting price, the auction vs private treaty decision, the campaign, contracts and settlement.",
  slug: "how-to-sell-a-house-australia",
  publishedAt: "2026-05-13",
  updatedAt: "2026-05-13",
  readingTimeMinutes: 14,
  author: { name: "Your Property Guide editorial", role: "Australian property research" },
  reviewedBy: { name: "Andy McMaster", role: "Editor" },
  persona: "selling",
};

export const metadata: Metadata = {
  title: `${FRONTMATTER.title} | ${SITE_NAME}`,
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
  "The single biggest factor in your sale price is the agent you pick — interview at least three who actually sell in your suburb.",
  "Auction works best for properties with broad appeal in active markets; private treaty suits unique homes, quieter markets, or sellers who want price certainty.",
  "Total selling costs are typically 2.5% to 4% of sale price (agent commission, marketing, conveyancing, capital gains where applicable).",
  "The legal stack varies by state — VIC needs a Section 32, NSW a contract with prescribed documents, QLD a disclosure statement from 2025. Get your conveyancer engaged before the agent.",
  "Cosmetic presentation (cleaning, decluttering, styling) returns 3 to 10× its cost. Structural fixes rarely pay for themselves at sale.",
];

const TOC: GuideTOCEntry[] = [
  { id: "when-to-sell",      label: "When is the right time to sell?" },
  { id: "selling-costs",     label: "What it costs to sell" },
  { id: "preparing-house",   label: "Preparing the house" },
  { id: "choosing-agent",    label: "Choosing an agent" },
  { id: "auction-vs-treaty", label: "Auction vs private treaty" },
  { id: "setting-price",     label: "Setting the price" },
  { id: "marketing",         label: "The marketing campaign" },
  { id: "contracts",         label: "Contracts and legal docs" },
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
      "Yes. Every Australian state legally requires the seller to provide a contract of sale (called a Section 32 in Victoria, a disclosure statement in Queensland from 2025, and a contract with prescribed annexures in NSW). A conveyancer or solicitor prepares these documents, handles searches, manages the deposit and settlement, and protects you from contract risks. Engage them before you list, not after — the contract has to be ready when the agent starts marketing.",
  },
  {
    question: "Should I sell or rent out my house?",
    answer:
      "Run both numbers. Selling gives you a capital lump sum (taxed if it's an investment property — see capital gains below). Renting gives you ongoing income but also ongoing landlord responsibility, vacancy risk, maintenance costs, and management fees. The standard test: if your equity is producing less than 4 to 5% gross yield as a rental, the sale proceeds invested elsewhere typically outperform. The exception is a property in a high-growth corridor where you expect significant capital appreciation in the next three to five years.",
  },
  {
    question: "How much does it cost to sell a house in Australia?",
    answer:
      "Total selling costs run 2.5% to 4% of the sale price. The components: agent commission (1.5% to 3% plus GST), marketing (typically $3,000 to $10,000, occasionally up to $20,000 for premium campaigns), conveyancing ($800 to $2,500), discharge of mortgage fees ($300 to $700), and any pre-sale repairs or styling. Capital gains tax can be a much larger cost if the property was an investment — see the tax section.",
  },
  {
    question: "Can I sell my house without an agent?",
    answer:
      "Yes — it's legal in every state, and \"for sale by owner\" (FSBO) services exist that list your property on realestate.com.au and domain.com.au for a flat fee. The maths only works if you would have paid an agent who couldn't lift the sale price by more than the fee. In practice, experienced agents in active suburbs typically achieve 5 to 15% higher sale prices than FSBO sellers because they manage the buyer pool, negotiate harder, and present the property professionally. FSBO works best for straightforward properties in hot markets where the price is essentially the median.",
  },
  {
    question: "Should I sell first or buy first?",
    answer:
      "Most sellers should sell first — it gives you a known budget, removes the bridging-finance trap, and means you negotiate from strength. The exception is if your local market is extremely tight on the buy side and you'd struggle to find a replacement home in a normal timeframe. In that case, buy first with a long settlement (typically 90 days, sometimes longer), or use a bridging loan. We cover this in detail in our sell-first-or-buy-first guide.",
  },
  {
    question: "Will I pay capital gains tax when I sell?",
    answer:
      "Not on your principal place of residence (the main residence exemption, full or partial depending on how long you lived there and whether you ever rented it out). Investment properties trigger CGT on the gain — generally the sale price minus the cost base, with a 50% discount if held for over twelve months. Off-the-plan, deceased estate, and joint-ownership cases get complex; talk to an accountant before you list if any of those apply. We have a full capital-gains-tax guide.",
  },
  {
    question: "Do I have to disclose problems with the property?",
    answer:
      "It varies by state, but the safe answer is yes. NSW and VIC require disclosure of certain encumbrances, planning matters, and zoning issues but not all defects — buyers are expected to do their own building and pest. QLD's new seller disclosure regime (from 1 August 2025) is much broader and requires sellers to provide a prescribed disclosure statement with title, encumbrance, and certain physical-condition information. Across all states, deliberately concealing a known major defect (subsidence, asbestos, illegal building work) exposes you to a rescission claim and damages even after settlement.",
  },
];

const RELATED: RelatedGuide[] = [
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
      <Callout variant="info" title="One page, the whole process">
        <p>
          This guide covers every step from deciding to sell through to
          settlement day. If you want to skip ahead, the deepest detail is in
          the agent-choice and pricing sections — those are where most sale
          prices are won or lost.
        </p>
      </Callout>

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
        activity. But that means more competing stock — a well-presented
        property listed in late autumn often achieves a stronger result
        because the buyer pool isn&rsquo;t spoilt for choice. The right time is
        the time that matches your circumstances, not a date on the calendar.
      </p>

      <h2 id="selling-costs">What it costs to sell</h2>
      <p>
        Plan for total selling costs of <strong>2.5% to 4% of the sale
        price</strong>, before any capital gains tax. On a $900,000 sale
        that&rsquo;s $22,500 to $36,000. The components:
      </p>
      <ul>
        <li><strong>Agent commission</strong>: 1.5% to 3% of sale price, plus GST. Negotiable, especially above $1.5M.</li>
        <li><strong>Marketing</strong>: $3,000 to $10,000 typical, $15,000+ for premium campaigns with drone, video and broad print. Paid by seller separately from commission.</li>
        <li><strong>Conveyancing</strong>: $800 to $2,500 depending on state and complexity.</li>
        <li><strong>Mortgage discharge</strong>: $300 to $700 in lender fees.</li>
        <li><strong>Pre-sale prep</strong>: cleaning $300 to $800, decluttering / removalist for staging $500 to $2,000, styling $3,000 to $8,000 for a 6-week campaign, minor repairs as needed.</li>
        <li><strong>Auction fees</strong> (if auctioning): $400 to $800 for the auctioneer, often bundled into commission.</li>
        <li><strong>Capital gains tax</strong>: only on investment properties — see the tax section.</li>
      </ul>

      <KeyFigure
        value="$25k–$35k"
        label="Typical total selling costs on a $900k property"
        context="Excluding capital gains tax"
      />

      <h2 id="preparing-house">Preparing the house</h2>
      <p>
        Spend money on presentation, not renovation. The data is consistent:
        cosmetic work (cleaning, decluttering, paint, styling) typically
        returns 3 to 10× its cost. Structural work (new kitchen, bathroom
        renovation, extensions) rarely returns its cost at sale — you&rsquo;re
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
        <li><strong>Professional styling</strong> for vacant or sparsely-furnished homes. $3K to $8K for a 6-week campaign, almost always returns 5× to 15× its cost.</li>
      </ol>
      <p>
        What <em>not</em> to do: don&rsquo;t renovate the kitchen or bathroom
        before selling. The cost recovery is poor — the buyer who pays for
        renovation prefers to choose their own finishes anyway. Read our
        renovation cost guide if you&rsquo;re considering it.
      </p>

      <Callout variant="warning" title="The over-improvement trap">
        <p>
          Sellers routinely spend $40,000 on a pre-sale renovation expecting
          to add $80,000 to the sale price, and end up adding $35,000.
          Cosmetic presentation is high-ROI. Renovation is not. If the kitchen
          is dated, list at a price that reflects that and let the buyer
          decide.
        </p>
      </Callout>

      <h2 id="choosing-agent">Choosing an agent</h2>
      <p>
        The agent you pick will probably have more influence on your sale
        price than anything else you do. Cover the full process in our
        dedicated guide — <Link href="/guides/how-to-choose-a-selling-agent">how to choose a selling agent</Link>.
        The short version:
      </p>
      <ul>
        <li>Interview at least three agents who genuinely sell in your suburb (check their recent sold listings on realestate.com.au and domain.com.au).</li>
        <li>Demand comparable sales evidence for any appraisal price. Last 90 days, same suburb, similar property type.</li>
        <li>Watch for the &quot;over-quote, then condition you down&quot; play — agents who quote 10%+ above the others without supporting evidence are using it as a sales tactic.</li>
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
        Best for properties with broad market appeal in active markets —
        sub-median homes in popular suburbs, period houses with character,
        anything where competition is plausible. The campaign is short (three
        to four weeks of marketing then auction day), the buyer pool is
        focused, and the unconditional sale on auction day removes
        post-contract risk.
      </p>
      <p>
        Auction works less well in quieter markets, for unique properties
        where buyer demand is narrow, or when the local clearance rate is
        below 55%. If the property is passed in on auction day, you&rsquo;ve
        signalled to subsequent buyers that demand was thin — that often
        depresses the eventual sale price.
      </p>
      <h3>Private treaty</h3>
      <p>
        Best for unique homes, quieter markets, regional areas where auction
        culture is weaker, and sellers who want price certainty. The campaign
        runs four to six weeks (or longer), the price is publicly listed, and
        the buyer makes a written offer subject to negotiation. Contracts can
        be conditional on finance, building and pest, and other due-diligence
        items — which both expands your buyer pool and introduces post-contract
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
        listing — agents shop the property to their database. Suits sellers
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
        video tour. Match the campaign to the price point — overspending on a
        sub-$800K property rarely returns the cost.
      </p>

      <h2 id="contracts">Contracts and legal docs</h2>
      <p>
        The legal requirement to sell varies by state:
      </p>
      <ul>
        <li><strong>VIC:</strong> Section 32 vendor statement, prepared by your conveyancer before the property is advertised. Includes title, encumbrances, planning, rates, and certain disclosures.</li>
        <li><strong>NSW:</strong> Contract of sale with prescribed annexures (title search, zoning, drainage diagram, etc.) before exchange.</li>
        <li><strong>QLD:</strong> From 1 August 2025, sellers must provide a prescribed seller disclosure statement before a contract is signed. Pre-2025 contracts were less prescriptive but still required disclosure of certain encumbrances.</li>
        <li><strong>WA, SA, TAS, ACT, NT:</strong> Each has its own contract form and disclosure regime. Your conveyancer will know the local requirements.</li>
      </ul>
      <p>
        Engage your conveyancer <em>before</em> you list the property. The
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
        home. Your agent should be guiding you through this — push back if
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
        <li>Read the meter and notify utilities — water, electricity, gas, internet — that you&rsquo;ve sold and want the account closed or transferred.</li>
        <li>Funds typically clear within minutes of settlement. Your conveyancer will pay out your existing mortgage and transfer the balance to your nominated account.</li>
      </ul>

      <h2 id="tax">Capital gains tax</h2>
      <p>
        If the property was your principal place of residence the whole time
        you owned it, no CGT applies — the main residence exemption covers the
        full gain. If it was ever rented out, or it was an investment
        property, CGT applies on the portion of ownership where it wasn&rsquo;t
        your main residence.
      </p>
      <p>
        The simplified maths: <strong>(sale price − selling costs) − (purchase
        price + buying costs + capital improvements)</strong> = the gross
        gain. Held for more than 12 months as an Australian resident? You get
        a 50% discount on the gain before adding it to your taxable income for
        the year. The tax bill can be material — on a $300K gain, an
        individual in the 37% bracket pays around $55K after the 50% discount.
      </p>
      <p>
        Get tailored advice from an accountant before you list if any of
        these apply: investment property, ever rented out, deceased estate,
        co-ownership change, off-the-plan settlement, or a property where
        you&rsquo;ve claimed depreciation. Our <Link href="/cgt-calculator">CGT calculator</Link> gives you a
        rough estimate.
      </p>

      <MatchCTA
        kind="accountant"
        lead="If the property was ever rented, the CGT bill can be five figures. Worth a 20-minute call with a property-tax accountant before you list."
      />

      <Sources items={[
        "Australian Securities and Investments Commission, real-estate licensing and underquoting laws (state-by-state, 2024–2026).",
        "CoreLogic and PropTrack monthly market reports for days-on-market and clearance-rate ranges cited in this guide.",
        { label: "Australian Taxation Office, \"CGT and the main residence exemption\"", note: "current" },
        "Queensland Government, seller-disclosure regime (Property Law Act 2023 commencement 1 August 2025).",
      ]} />
    </GuideArticleLayout>
    </>
  );
}
