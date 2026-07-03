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
  title: "Auction vs Private Treaty: Which Way Should You Sell? (2026)",
  description:
    "Auction vs private treaty in Australia: how each method works end-to-end, the real cost differences, 2026 clearance-rate context, cooling-off and underquoting rules by state, and a decision framework for choosing the right method for your property.",
  slug: "auction-vs-private-treaty",
  publishedAt: "2026-07-03",
  updatedAt: "2026-07-03",
  readingTimeMinutes: 10,
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
  "Private treaty (an advertised asking price, offers negotiated privately) is the default in most of Australia. Auction dominates inner Melbourne, Sydney and Canberra, and is rare in Perth and regional markets.",
  "Auction removes the buyer's cooling-off period entirely: the contract is unconditional the moment the hammer falls, with the deposit paid on the day. That certainty is the method's biggest vendor advantage.",
  "Auction costs more: an auctioneer fee (roughly $400 to $1,000) on top of commission, plus a compressed, advertising-heavy campaign that you pay for whether or not the property sells.",
  "Clearance rates are the market's live temperature gauge. In mid-2026 the combined-capitals preliminary clearance rate dipped to 47.4%, the weakest since April 2020, which means auctions currently only suit genuinely competitive properties.",
  "Underquoting rules differ sharply by state: NSW regulates the price guide against the agent's written estimate, Victoria requires a Statement of Information with three comparable sales, and Queensland bans auction price guides outright.",
  "The right method comes down to scarcity, local auction culture, current clearance rates and your risk tolerance. Asking each agent to justify their recommended method with recent evidence is one of the best agent-selection tests there is.",
];

const TOC: GuideTOCEntry[] = [
  { id: "at-a-glance",     label: "The two methods at a glance" },
  { id: "private-treaty",  label: "How private treaty works" },
  { id: "auction",         label: "How an auction campaign works" },
  { id: "costs",           label: "Cost differences" },
  { id: "clearance-rates", label: "Clearance rates in 2026" },
  { id: "state-culture",   label: "Auction culture by state" },
  { id: "cooling-off",     label: "Cooling-off and contract differences" },
  { id: "underquoting",    label: "Underquoting rules" },
  { id: "hybrids",         label: "EOI, off-market and hybrids" },
  { id: "decision",        label: "Decision framework" },
];

const FAQS: FaqItem[] = [
  {
    question: "Is auction or private treaty better for selling a house?",
    answer:
      "Neither is better in the abstract; each wins in different conditions. Auction suits scarce, hard-to-price properties in suburbs where buyers expect to bid and where clearance rates are healthy, because open competition can push the price beyond any private negotiation. Private treaty suits properties with plenty of close comparables, markets with weak auction culture, and softer conditions where an auction risks a public pass-in. Ask agents which method has actually produced the best results for homes like yours in the last three months, and make them show the evidence.",
  },
  {
    question: "Do houses sell for more at auction?",
    answer:
      "Sometimes, but only when real competition shows up. With two or more motivated bidders, an auction can run well past the reserve and past what a private negotiation would have produced. With one bidder or none, the property passes in publicly and you negotiate from a weaker position than a quiet private-treaty campaign would have left you in. The honest answer is that auction amplifies whatever demand exists: strong demand produces premiums, weak demand produces a visible failure. That is why clearance rates in your suburb matter more than any national average.",
  },
  {
    question: "How much extra does it cost to sell at auction?",
    answer:
      "Agent commission is generally the same either way, typically 1.5 to 3 per cent depending on state and market. The auction-specific extras are the auctioneer's fee, commonly somewhere around $400 to $1,000 as a flat fee (confirm whether it is included in your agent's commission or charged on top), plus a more intensive marketing campaign. Auction campaigns compress three to four weeks of heavy advertising into a fixed window, and as a guide can run $6,000 to $9,000 for a mid-priced home, more in prestige markets. Marketing is payable whether or not the property sells.",
  },
  {
    question: "Can the buyer pull out after an auction?",
    answer:
      "Not without serious consequences. There is no cooling-off period for auction purchases anywhere in Australia. The winning bidder signs an unconditional contract on the spot and pays the deposit, usually 10 per cent. If they fail to settle they forfeit the deposit and can be sued for damages. This is the auction method's core advantage for a vendor: once the hammer falls, the sale is about as certain as a residential sale gets. In a private treaty sale, by contrast, most states give the buyer a statutory cooling-off period and contracts often carry finance and inspection conditions.",
  },
  {
    question: "What happens if my property passes in at auction?",
    answer:
      "If bidding does not reach your reserve, the property is passed in and the highest bidder normally gets the first right to negotiate with you privately, often within minutes of the auction ending. Many passed-in properties still sell that day or within the following fortnight. If no deal is reached, the listing usually converts to private treaty with an advertised price. A pass-in is not fatal, but it is public: bidders and neighbours saw the result, and the price you subsequently advertise is anchored by it, which is why the auction decision deserves honest scrutiny before the campaign starts.",
  },
  {
    question: "What is sale by expression of interest?",
    answer:
      "Expression of interest (EOI), sometimes called sale by tender or sale by set date, invites buyers to submit their best written offer by a deadline, without seeing competing offers. It borrows the deadline pressure of an auction while keeping offers, and any failure to sell, private. It is common for prestige homes, unusual properties that are hard to price, and development sites. The trade-off is opacity: some buyers dislike blind bidding and simply will not participate, so EOI works best where the property is genuinely scarce and buyer demand is deep.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "Free Selling Guide (PDF)",         href: "/selling-guide",                                description: "Method selection, agent interviews and a 12-week campaign plan, personalised to your suburb." },
  { title: "Property Auction Guide",           href: "/guides/property-auction-guide",                 description: "Auction day mechanics in detail: reserves, vendor bids, and what 'passed in' means." },
  { title: "How to Choose a Selling Agent",    href: "/guides/how-to-choose-a-selling-agent",          description: "The interview process, the appraisal-price trap, and what to negotiate." },
  { title: "Cost of Selling a House",          href: "/guides/cost-of-selling-a-house-australia",      description: "Every selling cost explained, from commission to marketing to CGT." },
  { title: "Best Time to Sell a House",        href: "/guides/best-time-to-sell-a-house-australia",    description: "Seasonality, market cycles and timing the campaign." },
  { title: "Cooling-Off Periods by State",     href: "/guides/cooling-off-period-by-state-australia",  description: "The full state-by-state cooling-off rules for private sales." },
  { title: "Find an Expert",                   href: "/find-an-expert",                                description: "Vetted local agents who can benchmark both methods for your property." },
];

export default function AuctionVsPrivateTreatyPage() {
  return (
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="Method rules and market data move fast">
        <p>
          Auction regulations, cooling-off rules and underquoting penalties are
          state law and change regularly, and clearance rates move week to
          week. Treat the figures here as a snapshot reviewed on 3 July 2026,
          check your own state&rsquo;s consumer affairs guidance, and get
          method advice from an agent who can show you recent local evidence.
        </p>
      </Callout>

      <EditorNote>
        <p>
          The auction-or-not question gets more emotional airtime than almost
          anything else in a sale, and most of the time the answer is sitting
          in plain sight: what has actually worked, recently, for homes like
          yours in your suburb. When you interview agents, ask each one which
          method they recommend and why. The quality of the evidence behind
          that answer tells you more about the agent than their appraisal
          number does.
        </p>
      </EditorNote>

      <h2 id="at-a-glance">The two methods at a glance</h2>
      <p className="lead">
        Every residential sale in Australia runs on one of two engines. Private
        treaty advertises a price and negotiates with buyers one-on-one, in
        private. Auction advertises a date and makes buyers compete with each
        other, in public. Everything else, the costs, the legal position, the
        risk profile, flows from that difference.
      </p>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Private treaty</th>
            <th>Auction</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>How price is found</td><td>Advertised asking price, private negotiation</td><td>Open competitive bidding against a confidential reserve</td></tr>
          <tr><td>Campaign length</td><td>Open-ended, runs until sold</td><td>Fixed, typically 3 to 4 weeks to a set date</td></tr>
          <tr><td>Buyer cooling-off</td><td>Applies in most states</td><td>None, in any state</td></tr>
          <tr><td>Contract conditions</td><td>Often subject to finance and inspections</td><td>Unconditional on the fall of the hammer</td></tr>
          <tr><td>Extra costs</td><td>Standard marketing</td><td>Auctioneer fee plus a heavier compressed campaign</td></tr>
          <tr><td>If it doesn&rsquo;t sell</td><td>Quiet: adjust price or wait</td><td>Public: a passed-in result everyone can see</td></tr>
          <tr><td>Where it dominates</td><td>QLD, WA, TAS, regional Australia</td><td>Inner Melbourne, Sydney, Canberra</td></tr>
        </tbody>
      </table>

      <h2 id="private-treaty">How private treaty works</h2>
      <p>
        Private treaty is the default sale method across most of the country.
        End-to-end it looks like this:
      </p>
      <ol>
        <li>You and your agent set an asking price (or price range) from comparable sales.</li>
        <li>The property is listed and marketed; buyers inspect at open homes or by appointment.</li>
        <li>Interested buyers submit offers, usually in writing, and the agent negotiates between you and them.</li>
        <li>When you accept an offer, contracts are exchanged. In most states the contract can include conditions, commonly subject to finance and subject to a building and pest inspection.</li>
        <li>The buyer&rsquo;s statutory cooling-off period runs (in the states that have one), then the contract goes unconditional and proceeds to settlement.</li>
      </ol>
      <p>
        The strengths are flexibility and privacy. There is no fixed deadline,
        buyers who need finance conditions can participate (a bigger pool in
        tighter credit conditions), and if the campaign misses, you adjust the
        price without a public failure on the record. The weaknesses mirror
        them: no deadline means no urgency, negotiations happen one buyer at a
        time so competitive tension is muted, and a listing that lingers gets
        stale. Buyers watch days-on-market and price cuts, and both weaken your
        negotiating position over time.
      </p>

      <h2 id="auction">How an auction campaign works</h2>
      <p>
        An auction campaign compresses the sale into a short, high-intensity
        window with a hard deadline:
      </p>
      <ol>
        <li>You sign an auction agency agreement and set the auction date, typically 3 to 4 weeks out.</li>
        <li>The marketing campaign runs hard from day one, because every buyer has to be found, inspected and financed before the date.</li>
        <li>Serious buyers complete all due diligence before auction day: contract review, building and pest, and unconditional finance, because auction bids cannot carry conditions.</li>
        <li>You set the reserve, the confidential minimum you will accept, usually the day before or the morning of the auction, guided by the campaign&rsquo;s buyer feedback.</li>
        <li>On the day, the auctioneer takes bids. Once bidding reaches the reserve the property is announced &ldquo;on the market&rdquo; and will sell to the highest bidder. The winner signs an unconditional contract and pays the deposit immediately.</li>
        <li>If bidding stalls below reserve, the property is passed in, and the highest bidder usually gets first right to negotiate privately, often that same day.</li>
      </ol>
      <p>
        Pre-auction offers are common in strong markets: a buyer tries to take
        the property off the table before the competition assembles. Whether to
        accept one is a judgement call about how much genuine competition the
        auction would produce. Our{" "}
        <Link href="/guides/property-auction-guide">property auction guide</Link>{" "}
        covers the day itself in detail, including vendor bids and bidder
        registration rules.
      </p>

      <PullQuote attribution="Andy McMaster, Editor">
        Auction doesn&rsquo;t create demand, it amplifies it. Two motivated
        bidders can produce a premium no negotiation would reach. Zero bidders
        produce a public failure. Everything about the decision is an honest
        assessment of which one you&rsquo;ll get.
      </PullQuote>

      <h2 id="costs">Cost differences</h2>
      <p>
        The biggest cost of selling, agent commission, is generally the same
        under either method: typically <strong>1.5% to 3%</strong> of the sale
        price depending on state and market, and negotiable either way. Size it
        for your own price with the{" "}
        <Link href="/real-estate-commission-calculator">commission calculator</Link>.
        The method-specific differences sit in the smaller lines:
      </p>
      <ul>
        <li>
          <strong>Auctioneer&rsquo;s fee.</strong> Commonly a flat fee of
          around <strong>$400 to $1,000</strong>, sometimes more for a
          high-profile auctioneer. Some agents include it in their commission,
          others charge it on top. Confirm which, in writing, and whether it
          applies if the property passes in.
        </li>
        <li>
          <strong>Marketing intensity.</strong> A private treaty campaign
          typically runs <strong>$3,000 to $10,000</strong> and can be paced.
          An auction campaign spends harder and faster, because every buyer
          must be ready to bid unconditionally within four weeks; as a guide,
          around <strong>$6,000 to $9,000</strong> for a mid-priced home and
          more in prestige markets. Either way the marketing is your money,
          payable whether or not the property sells.
        </li>
        <li>
          <strong>Venue and extras.</strong> Most auctions run on-site or in
          the agency&rsquo;s rooms at no extra charge, but in-room auction
          events can add a venue cost. Ask.
        </li>
      </ul>
      <p>
        The honest framing: auction concentrates cost and risk into a fixed
        window in exchange for a shot at competitive tension and a certain,
        unconditional result. Private treaty spreads the cost and the risk out
        over time. For the full picture of what a sale costs beyond method,
        see the{" "}
        <Link href="/guides/cost-of-selling-a-house-australia">cost of selling guide</Link>.
      </p>

      <MatchCTA kind="selling-agent" />

      <h2 id="clearance-rates">Clearance rates in 2026</h2>
      <p>
        The auction clearance rate is the share of auctioned properties that
        actually sold, at auction, just before, or immediately after. It is the
        market&rsquo;s live temperature gauge, and in 2026 it has been telling
        vendors to be careful.
      </p>

      <KeyFigure
        value="47.4%"
        label="Combined capital cities preliminary clearance rate for the week ending 22 June 2026, the weakest reading since April 2020."
        context="Cotality (CoreLogic) auction data; Sydney 47.4%, Melbourne 50.6% the same week"
      />

      <p>
        The trajectory matters as much as the level. In late March 2026 the
        combined-capitals rate was 62.7% across 2,857 auctions. By late June it
        had slid under 50% on much thinner volumes (1,869 auctions), with the
        cash rate at 4.35% and the RBA still flagging possible further rises.
        Fewer bidders can finance an unconditional bid, and it shows.
      </p>
      <p>
        As a rough working rule, agents read sustained clearance above about
        70% as a seller&rsquo;s market where auctions thrive, the 60s as
        balanced, and anything persistently below 55 to 60% as conditions
        favouring buyers, where a private negotiation usually protects the
        vendor better than a public test of demand. Two caveats. First,
        preliminary weekly figures get revised down as late results come in.
        Second, and more important, the national headline is not your suburb:
        clearance varies enormously by city, price bracket and property type.
        Ask your agent for the last three months of auction results for
        properties like yours, including the pass-ins, before you decide.
      </p>

      <h2 id="state-culture">Auction culture by state</h2>
      <p>
        Auction is not a national habit, it is a Melbourne, Sydney and Canberra
        habit. One ordinary March 2026 week makes the point: of 2,857 capital
        city auctions, Melbourne held 1,412 and Sydney 1,008. Brisbane held
        200, Adelaide 131, Canberra 89, and Perth just 16.
      </p>
      <ul>
        <li>
          <strong>VIC and NSW:</strong> Auction is the default for houses in
          inner and middle-ring Melbourne and Sydney. Buyers expect to bid,
          understand the process, and turn up financed. This is where the
          method works best.
        </li>
        <li>
          <strong>QLD:</strong> Mostly private treaty, with auctions
          concentrated in inner Brisbane and prestige coastal markets. The
          state&rsquo;s ban on auction price guides (more below) adds friction
          for buyers.
        </li>
        <li>
          <strong>WA and regional Australia:</strong> Overwhelmingly private
          treaty. Perth&rsquo;s auction volumes are a rounding error, and in
          markets without auction culture, an auction can actively repel
          buyers who are unfamiliar with unconditional bidding.
        </li>
        <li>
          <strong>SA, ACT and TAS:</strong> Adelaide and Canberra have genuine
          mid-sized auction markets; Tasmania has almost none.
        </li>
      </ul>
      <p>
        The practical test is simple: what share of recent sales like yours,
        in your suburb, went to auction, and how did they fare? If the answer
        is &ldquo;hardly any&rdquo;, an auction makes your property the
        experiment.
      </p>

      <h2 id="cooling-off">Cooling-off and contract differences</h2>
      <p>
        This is the sharpest legal difference between the methods, and it cuts
        in the vendor&rsquo;s favour at auction. <strong>There is no
        cooling-off period for auction purchases anywhere in Australia.</strong>{" "}
        The winning bidder is unconditionally bound the moment the hammer
        falls, pays the deposit on the spot, and forfeits it (and risks being
        sued) if they fail to settle. In NSW the exclusion extends to contracts
        exchanged on the same day as the auction after a pass-in.
      </p>
      <p>
        Under private treaty, most states give the buyer a statutory
        cooling-off period after exchange, during which they can walk away for
        a small penalty:
      </p>
      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Private treaty cooling-off</th>
            <th>Buyer&rsquo;s penalty to withdraw</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>NSW</td><td>5 business days</td><td>0.25% of price</td></tr>
          <tr><td>VIC</td><td>3 business days</td><td>$100 or 0.2%, whichever is greater</td></tr>
          <tr><td>QLD</td><td>5 business days</td><td>Up to 0.25% of price</td></tr>
          <tr><td>SA</td><td>2 clear business days</td><td>Holding deposit up to $100</td></tr>
          <tr><td>ACT</td><td>5 business days</td><td>0.25% of price</td></tr>
          <tr><td>NT</td><td>4 business days</td><td>None</td></tr>
          <tr><td>WA</td><td>None</td><td>&mdash;</td></tr>
          <tr><td>TAS</td><td>None (unless negotiated)</td><td>&mdash;</td></tr>
        </tbody>
      </table>
      <p>
        On top of cooling-off, private treaty contracts frequently carry
        finance and inspection conditions, each a further exit door for the
        buyer between exchange and unconditional. In practice buyers can waive
        cooling-off (in NSW, via a section 66W certificate from their
        solicitor), and vendors can insist on it in competitive situations.
        The full state-by-state detail is in our{" "}
        <Link href="/guides/cooling-off-period-by-state-australia">cooling-off periods guide</Link>.
      </p>
      <p>
        What it means for the method decision: if deal certainty is your
        priority, because you have bought elsewhere, or you have been burned by
        a crashed contract before, auction&rsquo;s unconditional exchange is a
        genuine, quantifiable advantage, not just theatre.
      </p>

      <h2 id="underquoting">Underquoting rules</h2>
      <p>
        Underquoting, advertising a property below the price the agent
        actually expects, is regulated state by state, and the rules shape how
        each method is marketed. As a vendor you should care for two reasons:
        a campaign built on an unrealistic guide attracts the wrong buyers and
        wastes your marketing money, and an agent who proposes quoting low
        &ldquo;to get numbers through the door&rdquo; is proposing to break
        the law with your listing.
      </p>
      <ul>
        <li>
          <strong>NSW:</strong> The agent must record a reasonable estimated
          selling price in your agency agreement, and nothing can be
          advertised below it. Price ranges can span at most 10% from bottom
          to top, and phrases like &ldquo;offers over $X&rdquo; are banned.
          Current penalties run to $22,000 plus forfeiture of the entire
          commission, and in March 2026 the NSW Government announced
          legislation to lift fines to $110,000 or three times the commission,
          whichever is greater, with dummy-bidding penalties doubled to
          $110,000.
        </li>
        <li>
          <strong>VIC:</strong> Agents must publish a Statement of Information
          with an indicative selling price and the three most comparable sales
          (within 6 months and 2km in metro Melbourne; 18 months and 5km
          outside). Advertising below the estimate, the vendor&rsquo;s asking
          price, or a rejected written offer is underquoting, with penalties
          above $48,000 plus possible loss of commission.
        </li>
        <li>
          <strong>QLD:</strong> The strictest twist: for auction listings,
          agents cannot give a price guide at all, in marketing or verbally,
          and the reserve is confidential. Buyers must rely on their own
          comparable-sales research, which is one reason auction volumes stay
          modest in Queensland.
        </li>
      </ul>
      <p>
        Whichever method you choose, ask every agent you interview to show you
        the comparable sales behind their proposed guide, and how it squares
        with the estimate in the agency agreement. An agent who is casual
        about that paperwork is a red flag; our{" "}
        <Link href="/guides/how-to-choose-a-selling-agent">guide to choosing a selling agent</Link>{" "}
        covers the rest of that vetting process.
      </p>

      <h2 id="hybrids">EOI, off-market and hybrids</h2>
      <p>
        Auction and private treaty are the poles, but several hybrid methods
        sit between them:
      </p>
      <ul>
        <li>
          <strong>Expression of interest (EOI) / tender / sale by set date.</strong>{" "}
          Buyers submit best-and-final written offers by a deadline, without
          seeing competing offers. It borrows auction&rsquo;s deadline pressure
          while keeping the result, and any failure, private. Common for
          prestige and hard-to-price properties. The cost: blind bidding puts
          some buyers off entirely.
        </li>
        <li>
          <strong>Off-market sale.</strong> No public campaign at all; the
          agent quietly shops the property to their buyer database. It saves
          most of the marketing budget and protects privacy, but fewer buyers
          means less competition, and less competition usually means a softer
          price. Sensible for vendors who value discretion above the last few
          per cent, risky for everyone else.
        </li>
        <li>
          <strong>Online and hybrid auctions.</strong> Platform-based auctions
          with remote bidding, sometimes running over days rather than
          minutes. Legally these are still auctions: bids are unconditional
          and there is no cooling-off, so the same due-diligence rules apply.
        </li>
        <li>
          <strong>Auction campaign, private finish.</strong> A large share of
          auction listings actually sell before or just after the day, via
          pre-auction offers or post-pass-in negotiation. The auction deadline
          did its job even though no hammer fell, worth remembering when you
          read clearance statistics.
        </li>
      </ul>

      <h2 id="decision">Decision framework</h2>
      <p>
        Work through these six questions in order. The more of them that point
        the same way, the easier the call:
      </p>
      <ol>
        <li>
          <strong>Is your property scarce?</strong> Unique homes, land-value
          sites, renovator&rsquo;s opportunities and blue-chip streets are
          hard to price and attract emotional competition: auction territory.
          A unit in a large complex or a house in an estate with three
          near-identical listings has an obvious market price: private treaty.
        </li>
        <li>
          <strong>Does your suburb have auction culture?</strong> If a healthy
          share of recent comparable sales went under the hammer, buyers will
          turn up ready to bid. If auctions are rare, the method itself will
          thin your buyer pool.
        </li>
        <li>
          <strong>What are clearance rates doing right now?</strong> In
          sustained sub-55% conditions, like much of mid-2026, only genuinely
          competitive properties should go to auction. Check your city and
          price bracket, not the national headline.
        </li>
        <li>
          <strong>How much certainty do you need?</strong> Already bought
          elsewhere, or on a deadline? Auction&rsquo;s unconditional exchange
          and fixed date are worth real money. No deadline? Private
          treaty&rsquo;s flexibility costs you nothing.
        </li>
        <li>
          <strong>How would a public pass-in affect you?</strong> A passed-in
          auction is visible and anchors later negotiations. A quiet
          private-treaty price adjustment is not. Be honest about which risk
          you can better absorb.
        </li>
        <li>
          <strong>What does the local evidence say?</strong> Ask each agent
          you interview: for properties like mine, in this suburb, over the
          last three months, which method produced the better results, and
          show me. A specific, data-backed answer is a good sign you&rsquo;ve
          found your agent. A reflexive answer, auction-always or
          auction-never, is a sign you haven&rsquo;t.
        </li>
      </ol>

      <Callout variant="info" title="Want a second opinion on method?">
        <p>
          A vetted local agent can benchmark both methods against recent sales
          of homes like yours. Browse agents we&rsquo;ve screened at{" "}
          <Link href="/find-an-expert">Find an Expert</Link>, or start with a{" "}
          <Link href="/appraisal">free property appraisal</Link>, no
          commitment to list.
        </p>
      </Callout>

      <MatchCTA kind="selling-agent" />

      <Sources items={AUCTION_VS_TREATY_SOURCES} />
    </GuideArticleLayout>
  );
}

const AUCTION_VS_TREATY_SOURCES: readonly SourceItem[] = [
  { label: "Cotality (CoreLogic): weekly auction market results", href: "https://www.cotality.com/au/press-releases/lowest-combined-capital-preliminary-clearance-rate-so-far-this-year", note: "Capital-city auction volumes and clearance rates, March 2026" },
  { label: "Property Update: Australian property market update", href: "https://propertyupdate.com.au/australian-property-market/", note: "Combined-capitals preliminary clearance of 47.4%, week ending 22 June 2026, reporting Cotality data" },
  { label: "Domain: national auction results", href: "https://www.domain.com.au/auction-results/", note: "Live weekly clearance rates by city" },
  { label: "NSW Fair Trading: underquoting guidance for property professionals", href: "https://www.nsw.gov.au/housing-and-construction/property-professionals/working-as-an-agent/underquoting-guidance", note: "Estimated selling price rules and current penalties" },
  { label: "NSW Government: underquoting crackdown announcement", href: "https://www.nsw.gov.au/ministerial-releases/nsw-cracks-down-on-underquoting-tough-new-laws", note: "Proposed $110,000 penalties, March 2026" },
  { label: "Consumer Affairs Victoria: underquoting information for estate agents", href: "https://www.consumer.vic.gov.au/licensing-and-registration/estate-agents/running-your-business/underquoting-information-for-real-estate-agents", note: "Statement of Information requirements and penalties" },
  { label: "Queensland Government: buying a home at auction", href: "https://www.qld.gov.au/law/housing-and-neighbours/buying-and-selling-a-property/buying-a-home/ways-to-buy-your-home/buying-at-auction", note: "No cooling-off at auction and the auction price-guide ban" },
];
