import type { Metadata } from "next";
import Link from "next/link";
import {
  GuideArticleLayout,
  Callout,
  KeyFigure,
  GuideGlossaryRail,
  MiniStampDutyEmbed,
  type GuideFrontmatter,
  type GuideTOCEntry,
  type FaqItem,
  type RelatedGuide,
} from "@/components/guide";
import { HowToJsonLd } from "@/components/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { guideOgImages } from "@/lib/og/helpers";

const FRONTMATTER: GuideFrontmatter = {
  title: "Property auctions in Australia: how to bid and how to sell (2026)",
  description:
    "How auctions actually work in Australia. The reserve price, vendor bids, what 'passed in' means, why finance must be unconditional before auction day, and bidding strategies that don't lose you money.",
  slug: "property-auction-guide",
  publishedAt: "2026-04-01",
  updatedAt: "2026-04-15",
  readingTimeMinutes: 9,
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
  "Auction purchases have NO cooling-off period in any Australian state. If the hammer falls, you're committed unconditionally and pay 10% deposit on the spot.",
  "All due diligence (unconditional finance, building and pest inspection, contract review by your conveyancer) must be done before auction day.",
  "The reserve price is the minimum the vendor will accept; it's set confidentially before auction. The agent's price guide is an estimate, not the reserve.",
  "If bidding doesn't reach reserve, the property is 'passed in' and the highest bidder usually gets first right to negotiate privately with the vendor.",
  "A vendor bid is a bid made by the auctioneer on behalf of the seller to push toward the reserve. It must be announced clearly and cannot win the auction.",
  "Bidder registration is mandatory in NSW and VIC and standard practice elsewhere. Bring photo ID and arrive 30 minutes early.",
];

const TOC: GuideTOCEntry[] = [
  { id: "how-auctions-work", label: "How auctions work" },
  { id: "auction-day",       label: "Auction day step by step" },
  { id: "reserve-price",     label: "The reserve price" },
  { id: "passed-in",         label: "What 'passed in' means" },
  { id: "finance",           label: "Finance before auction" },
  { id: "due-diligence",     label: "Due diligence before auction" },
  { id: "registration",      label: "Registration requirements by state" },
  { id: "bidding-strategies",label: "Bidding strategies" },
  { id: "vendor-bid",        label: "Vendor bids explained" },
  { id: "after-auction",     label: "Buying after a passed-in auction" },
  { id: "buyers-agent",      label: "Using a buyer's agent at auction" },
];

const FAQS: FaqItem[] = [
  {
    question: "Is there a cooling-off period after buying at auction?",
    answer:
      "No. There is no cooling-off period for auction purchases in any Australian state. If you are the successful bidder, you sign contracts on the spot, pay 10% deposit, and are unconditionally committed. All due diligence (finance, building inspection, contract review) must be done before auction day.",
  },
  {
    question: "Can I bid at auction without pre-approval?",
    answer:
      "Technically yes, practically no. There's no 'subject to finance' clause at auction. If you win and your finance falls through, you forfeit the deposit and may be sued for damages. Get unconditional pre-approval, and ideally have the lender value the specific property in advance, before bidding.",
  },
  {
    question: "What's the difference between a price guide and a reserve price?",
    answer:
      "The price guide is the agent's pre-auction estimate of where bidding will fall. The reserve is the confidential minimum the vendor will accept, set just before auction starts. Price guides must be genuinely representative of vendor expectations under Australian consumer law, but they are not the reserve.",
  },
  {
    question: "What does 'on the market' mean at auction?",
    answer:
      "When the highest bid reaches or exceeds the reserve price, the auctioneer announces the property is 'on the market'. From that point, the next valid bid wins, the auctioneer can no longer pass it in. Before the property is on the market, bidding is essentially exploratory.",
  },
  {
    question: "What happens if the property is passed in?",
    answer:
      "Bidding didn't reach the reserve. The auction ends without a sale. The highest bidder typically gets first right to negotiate privately with the vendor (often that day, sometimes immediately). If they can't reach a deal, the agent will negotiate with other interested parties or list the property for private sale.",
  },
  {
    question: "Can I include conditions like 'subject to finance' on my bid?",
    answer:
      "Not at auction. Bids at auction are unconditional by definition. After a property is passed in and you're negotiating privately, you may be able to include conditions in the contract, depending on the vendor and state. Always confirm with your conveyancer.",
  },
];

const RELATED: RelatedGuide[] = [
  { title: "How to Choose a Selling Agent",    href: "/guides/how-to-choose-a-selling-agent",    description: "If you're selling at auction, picking the right agent is the biggest decision." },
  { title: "Buying Property in Australia",     href: "/guides/buying-property-australia",        description: "The full step-by-step buying process." },
  { title: "Building and Pest Inspection",     href: "/guides/building-pest-inspection",         description: "What inspectors look for and what their reports mean." },
  { title: "Conveyancing Guide",               href: "/guides/conveyancing-guide",               description: "Why your conveyancer must review the contract before auction." },
  { title: "Real Estate Agent Fees",           href: "/guides/real-estate-agent-fees-australia", description: "If you're selling at auction, what commission and marketing costs to expect." },
  { title: "Borrowing Power Calculator",       href: "/borrowing-power-calculator",              description: "Set your maximum bid based on what you can actually borrow." },
];

export default function PropertyAuctionGuidePage() {
  return (
    <>
      <HowToJsonLd
        name="How to bid at an Australian property auction"
        description="The seven-step process for buying property at auction in Australia."
        url={`/guides/${FRONTMATTER.slug}`}
        steps={[
          { name: "Get unconditional pre-approval before auction day", text: "Auction contracts are binding immediately, no cooling-off applies.", url: "/borrowing-power-calculator" },
          { name: "Commission building, pest, and strata reports before auction", text: "All due diligence must happen before bidding. Cheaper to skip an auction than buy a lemon." },
          { name: "Get the contract reviewed by your conveyancer", text: "Special conditions and inclusions are negotiated before the auction, not after." },
          { name: "Set your absolute maximum and your opening bid", text: "Maximum is your walk-away. Opening bid is below it but signals you're serious." },
          { name: "Attend the auction and register to bid", text: "You typically need to register on auction day with photo ID." },
          { name: "Bid in your strategic increments", text: "Even-numbered $5K or $10K increments. Slow down once you're approaching your max." },
          { name: "Sign the contract on the spot if you win", text: "10% deposit due immediately, settlement typically 30 to 90 days later depending on state." },
        ]}
      />
    <GuideArticleLayout
      frontmatter={FRONTMATTER}
      tldr={TLDR}
      toc={TOC}
      faqs={FAQS}
      related={RELATED}
    >
      <Callout variant="warning" title="No cooling-off period at auction. Anywhere in Australia.">
        <p>
          If you are the successful bidder, you are legally bound to complete
          the purchase. You must have your finance unconditionally approved
          and your building and pest inspections done <em>before</em> auction
          day. There is no second chance.
        </p>
      </Callout>

      <h2 id="how-auctions-work">How auctions work</h2>
      <p className="lead">
        An auction is a public sale where registered bidders compete in real
        time to purchase a property. The auctioneer runs the process, calling
        for bids and announcing when the highest bid reaches the vendor&rsquo;s{" "}
        <em>reserve price</em>, the minimum price the vendor is willing to
        accept.
      </p>
      <p>
        When the reserve price is met or exceeded, the property is &ldquo;on
        the market&rdquo;, meaning the auctioneer will sell to the highest
        bidder. The winning bidder exchanges contracts unconditionally and
        pays the deposit (usually 10%) on the spot.
      </p>
      <p>
        Auctions are most common in Sydney and Melbourne, where they account
        for a significant portion of sales. They are less common in
        Queensland, WA, and SA, where private treaty is more prevalent.
      </p>

      <h2 id="auction-day">Auction day step by step</h2>
      <ol>
        <li>
          <strong>Arrive early.</strong> Registration usually opens 30 minutes
          before the auction. Bring photo ID and any documents required by the
          agent for bidder registration.
        </li>
        <li>
          <strong>Register as a bidder.</strong> You must register to bid. In
          some states this is mandatory by law; in others it&rsquo;s standard
          practice. You will receive a bidder number.
        </li>
        <li>
          <strong>The auctioneer opens the auction.</strong> They will announce
          the property, confirm it is for sale, and call for opening bids.
        </li>
        <li>
          <strong>Bidding commences.</strong> Bids are made verbally or by
          raising your number. The auctioneer will announce each bid and call
          for higher offers.
        </li>
        <li>
          <strong>The auctioneer may consult with the vendor.</strong> If
          bidding stalls below the reserve, the auctioneer may pause to speak
          with the vendor (who may lower their reserve or elect to pass in).
        </li>
        <li>
          <strong>Property goes &ldquo;on the market&rdquo;.</strong> Once the
          reserve is met, the auctioneer declares the property is on the
          market. The next successful bid wins.
        </li>
        <li>
          <strong>Hammer falls.</strong> The auctioneer calls &ldquo;going
          once, going twice, sold&rdquo; (or similar), and the property is
          sold unconditionally to the highest bidder.
        </li>
        <li>
          <strong>Sign contracts and pay the deposit.</strong> The successful
          bidder signs the contract of sale immediately and pays the deposit
          (typically 10% by cheque or bank transfer). The sale is binding from
          this point.
        </li>
      </ol>

      <h2 id="reserve-price">The reserve price</h2>
      <p>
        The <strong>reserve price</strong> is the minimum price the vendor is
        willing to accept for the property. It is set confidentially before
        the auction and is not disclosed to buyers.
      </p>
      <p>
        The agent&rsquo;s pre-auction <em>price guide</em> is not the reserve,
        it is an indication of expected bidding range. Price guides must be
        genuinely representative of the vendor&rsquo;s expectations under
        Australian consumer law and cannot be set artificially low to attract
        more bidders.
      </p>
      <p>
        A property cannot be sold at auction for less than the reserve price.
        If bidding does not reach the reserve, the property is &ldquo;passed in&rdquo;.
      </p>

      <h2 id="passed-in">What &ldquo;passed in&rdquo; means</h2>
      <p>
        A property is &ldquo;passed in&rdquo; when bidding does not reach the
        vendor&rsquo;s reserve price by the end of the auction. This is not a
        failed sale, it is the start of post-auction negotiations.
      </p>
      <p>When a property is passed in:</p>
      <ul>
        <li>
          The highest bidder at auction is typically given the{" "}
          <strong>first right to negotiate</strong> with the vendor privately
          after the auction.
        </li>
        <li>
          There is often more room to negotiate a lower price post-auction, as
          the vendor has not been able to achieve their reserve.
        </li>
        <li>
          If the highest bidder cannot reach a deal, the agent can negotiate
          with other interested parties.
        </li>
      </ul>

      <Callout variant="warning" title="Some passed-in deals still have no cooling off">
        <p>
          If you sign contracts at the auction venue on auction day,{" "}
          <strong>there is still no cooling-off period</strong> in some states
          (e.g. NSW). Contracts signed after midnight of auction day typically
          do attract cooling-off rights. Always confirm with your conveyancer
          before signing.
        </p>
      </Callout>

      <h2 id="finance">Finance before auction (critical)</h2>
      <p>
        This cannot be overstated:{" "}
        <strong>you must have your finance arranged before bidding at auction</strong>.
        There is no &ldquo;subject to finance&rdquo; clause at auction.
      </p>
      <p>Steps to take before bidding:</p>
      <ol>
        <li>
          <strong>Get unconditional pre-approval</strong> (not just conditional
          pre-approval). This means the lender has assessed your full financial
          position and is ready to lend, subject only to a satisfactory
          valuation of the specific property.
        </li>
        <li>
          <strong>Request a valuation.</strong> Ask your lender to value the
          specific property before auction. If the bank values it lower than
          you bid, you may need to fund the gap with your own cash.
        </li>
        <li>
          <strong>Know your limit.</strong> Set a firm maximum bid based on
          your pre-approval and stick to it. Auction rooms can create emotional
          pressure, decide your limit in advance.
        </li>
      </ol>
      <p>
        Use our{" "}
        <Link href="/borrowing-power-calculator">borrowing power calculator</Link>{" "}
        to estimate your capacity, and speak to a mortgage broker before
        attending any auction.
      </p>

      <h2 id="due-diligence">Due diligence before auction</h2>
      <p>All due diligence must be completed before auction day:</p>
      <ul>
        <li>
          <strong>Building and pest inspection.</strong> Commission an
          inspection before auction. Do not wait until after, you have no
          recourse if issues are discovered post-sale.
        </li>
        <li>
          <strong>Review the contract of sale.</strong> Have your conveyancer
          or solicitor review the vendor&rsquo;s contract and Section 32 (VIC)
          or equivalent before auction day. Clarify any unusual clauses.
        </li>
        <li>
          <strong>Title search.</strong> Your conveyancer will search the
          title for any encumbrances, easements, or caveats.
        </li>
        <li>
          <strong>Strata report (if applicable).</strong> For strata
          properties, obtain the strata inspection report to understand the
          financial health of the body corporate, upcoming levies, and any
          major works planned.
        </li>
        <li>
          <strong>Research comparable sales.</strong> Look at recent sales in
          the suburb to understand what a fair price looks like. Browse{" "}
          <Link href="/suburbs">suburb data</Link> for medians and growth.
        </li>
      </ul>

      <h2 id="registration">Registration requirements by state</h2>
      <table>
        <thead>
          <tr>
            <th>State</th>
            <th>Registration required?</th>
            <th>What to bring</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong>NSW</strong></td><td>Yes (mandatory)</td><td>Photo ID; sometimes proof of ability to pay deposit</td></tr>
          <tr><td><strong>VIC</strong></td><td>Yes (mandatory since 2014)</td><td>Photo ID; complete bidder registration form</td></tr>
          <tr><td><strong>QLD</strong></td><td>Yes (standard practice)</td><td>Photo ID</td></tr>
          <tr><td><strong>WA</strong></td><td>Standard practice</td><td>Photo ID</td></tr>
          <tr><td><strong>SA</strong></td><td>Standard practice</td><td>Photo ID</td></tr>
        </tbody>
      </table>
      <p>Always check with the agent for specific requirements before auction day.</p>

      <h2 id="bidding-strategies">Bidding strategies</h2>
      <p>How you bid can influence the outcome. Some approaches used by experienced buyers:</p>
      <ul>
        <li>
          <strong>Open with a strong bid.</strong> Opening with a confident,
          specific bid (e.g. $851,000 rather than $850,000) signals seriousness
          and can unsettle nervous competitors. It may discourage first-time
          bidders who were only willing to bid up incrementally.
        </li>
        <li>
          <strong>Bid in non-round numbers.</strong> Bidding $932,500 instead
          of $930,000 can confuse the rhythm of the auction and suggests you
          have thought carefully about your maximum, often making opponents
          wonder whether you have more headroom.
        </li>
        <li>
          <strong>Bid quickly and confidently.</strong> Hesitation signals
          uncertainty. Responding quickly to counter-bids puts psychological
          pressure on other bidders.
        </li>
        <li>
          <strong>Know your absolute maximum and stick to it.</strong> The
          auctioneer will encourage higher bids, it is their job. Set your
          limit with your head, not in the emotion of the room.
        </li>
        <li>
          <strong>Watch, don&rsquo;t just bid.</strong> Before joining in,
          observe other bidders for body language cues. Hesitation from a
          competitor may mean they are near their limit.
        </li>
      </ul>

      <KeyFigure
        value="10%"
        label="Deposit you'll pay on the spot if you win at auction. By cheque, bank transfer, or sometimes deposit bond. The vendor's contract specifies which is acceptable."
        context="Sometimes negotiable down to 5%, but not after the hammer falls"
      />

      <h2 id="vendor-bid">Vendor bids explained</h2>
      <p>
        A <strong>vendor bid</strong> is a bid made by the auctioneer on behalf
        of the vendor to help progress the auction toward the reserve price.
        It is legal and must be announced clearly by the auctioneer (e.g.{" "}
        &ldquo;I have a vendor bid at $720,000&rdquo;).
      </p>
      <p>Key things to know about vendor bids:</p>
      <ul>
        <li>The auctioneer is bidding on behalf of the vendor, not a genuine buyer</li>
        <li>A vendor bid cannot be the winning bid, the property cannot be &ldquo;sold&rdquo; to the vendor</li>
        <li>Vendor bids are capped at one per property in some states</li>
        <li>The property is only &ldquo;on the market&rdquo; when a genuine bidder exceeds the reserve</li>
      </ul>

      <h2 id="after-auction">Buying after a passed-in auction</h2>
      <p>
        If a property is passed in and negotiations on auction day are
        unsuccessful, the property moves to private sale. At this point:
      </p>
      <ul>
        <li>
          A <strong>cooling-off period may apply</strong> (depending on the
          state and the timing of signing). In NSW, contracts signed after
          midnight of auction day typically attract a cooling-off period.
        </li>
        <li>
          You may be able to include conditions (subject to finance or
          building inspection) in the contract, ask your conveyancer.
        </li>
        <li>
          The vendor may be more flexible on price, given the auction did not
          meet their reserve.
        </li>
      </ul>

      <h2 id="buyers-agent">Using a buyer&rsquo;s agent at auction</h2>
      <p>
        A licensed buyer&rsquo;s agent can attend and bid at auction on your
        behalf. Benefits include:
      </p>
      <ul>
        <li>Removes the emotional component of bidding</li>
        <li>Experienced in auction dynamics and strategy</li>
        <li>Can help you set a realistic reserve and market price range beforehand</li>
        <li>Useful if you cannot attend in person (e.g. interstate buyer)</li>
      </ul>
      <p>
        If using a buyer&rsquo;s agent, ensure they are licensed in the
        relevant state and provide written authority before auction day.
      </p>

      <p>
        Don&rsquo;t forget the second-largest line item after the deposit:
      </p>
      <MiniStampDutyEmbed />

      <GuideGlossaryRail
        slugs={[
          "auction",
          "auction-clearance-rate",
          "cooling-off-period",
          "exchange-of-contracts",
        ]}
      />
    </GuideArticleLayout>
    </>
  );
}
