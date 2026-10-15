import Link from "next/link";
import type { Chapter } from "../types";
import { Box, Ch, Pull, Stat } from "../parts";

export const chapter: Chapter = {
  guide: "selling",
  number: 6,
  step: "Choose the method on evidence",
  standfirst:
    "Each method has a natural habitat. The mistake is letting an agent pick the one that suits their business rather than your property. Choose it on evidence: your home, your suburb’s buyers and what’s selling around you now.",
  callout:
    "Top-end campaigns choose the method last, once the likely buyers are known. If several are likely to compete, a deadline does the work; if the buyer is rare, a private negotiation protects the price. The method serves the evidence, never the agency’s habit.",
  checklist: [
    "Estimate how many buyers are likely to compete for your home",
    "Check how comparable homes in your suburb sold in the last six months",
    "Ask what share of the agency’s last 20 sales used each method",
    "Auction: set the reserve the week of the auction, from campaign evidence",
    "Private treaty: launch at a price you’d accept",
    "Off-market: only if privacy or speed matters more to you than the last dollar",
  ],
  cta: {
    kind: "agreement-check",
    title: "Check the agreement before you commit to a method",
    body: "The method, the term and the fees are all set in the agency agreement. We’ll go through it with you in 15 minutes, free, before you sign.",
    label: "Book my agreement check",
    href: "/agreement-check?from=selling-guide-ch6",
  },
  checked: "As at mid-2026.",
  Body,
};

function Body() {
  return (
    <>
      <p>
        The method of sale is a campaign decision. Get it right and the method creates the competition for you; get it wrong and you
        pay for theatre that has no audience. Our side-by-side of <Link href="/guides/auction-vs-private-treaty">auction and private
        treaty</Link> goes deeper on the comparison.
      </p>

      <h2>Auction</h2>
      <p>
        <strong>How it works:</strong> a set campaign (usually four weeks), no advertised price or a guide only, public competition on
        the day, and an unconditional contract signed on the fall of the hammer with no cooling-off for the buyer in any state.
      </p>
      <p>
        <strong>The case for:</strong> auctions create a deadline and visible competition, which is the best price-discovery mechanism
        ever devised for scarce assets. When two emotionally invested bidders want the same house, the result can exceed any private
        negotiation. The unconditional contract removes finance and inspection risk at a stroke. And even a passed-in auction flushes
        out the genuine buyers for the negotiation that follows.
      </p>
      <p>
        <strong>The case against:</strong> auctions need a crowd. With one bidder or none, a public pass-in stamps a “failed” flag on
        your campaign that follows it around. Auction campaigns also cost more (auctioneer plus typically heavier advertising), and some
        buyers, especially finance-dependent ones, simply won’t bid because they can’t go unconditional. In a thin market, an auction is
        an expensive way to discover there’s no competition.
      </p>
      <p>
        <strong>Where auctions actually work:</strong> Sydney, Melbourne and Canberra have deep auction cultures, with weekly clearance
        rates above 60 per cent in normal conditions. Brisbane and Adelaide use auctions selectively, mostly for inner suburbs and
        prestige stock, and the share has been growing. Perth, Hobart and Darwin remain overwhelmingly private-treaty markets. Within
        auction cities, auctions favour inner and middle-ring suburbs, properties that are scarce or hard to price (character homes,
        development sites, anything with a view), and price brackets where buyer depth is strong. A standard outer-suburban house in a
        private-treaty city gains little from an auction beyond the agent’s theatre.
      </p>
      <p>
        <strong>Reserve strategy:</strong> set the reserve the week of the auction, not the day you sign the agency agreement, and set
        it from campaign evidence: who’s requested contracts, what the buyer feedback bands say, what’s sold during your campaign. A
        reserve at the bottom of your genuine acceptable range lets the auction run; momentum stalls when the auctioneer has to halt and
        confer. Know the vendor-bid rules in your state (vendor bids must be announced), and decide your pass-in plan in advance: the
        highest bidder at a pass-in usually gets first right to negotiate, so brief your agent on your real floor before the day. Our{" "}
        <Link href="/guides/property-auction-guide">auction guide</Link> covers the day itself.
      </p>

      <h2>Private treaty</h2>
      <p>
        <strong>How it works:</strong> you list at an advertised price (or range), buyers make offers, you negotiate. Around eight in
        ten Australian sales happen this way.
      </p>

      <Stat value="8 in 10">Australian sales that happen by private treaty.</Stat>

      <p>
        <strong>The case for:</strong> control and reach. You can negotiate terms as well as price, accept conditional offers from the
        biggest possible buyer pool, take your time, and quietly adjust strategy without a public verdict. Costs are lower and the
        process suits every market, hot or cold.
      </p>
      <p>
        <strong>The case against:</strong> no deadline means buyers can stall, and the first advertised price does most of the work;
        get it wrong and you’ll be cutting it publicly three weeks later (<Ch n={7} guide="selling">Chapter 7</Ch>’s first-two-weeks
        rule). Buyers also get cooling-off periods in most states, so a “sold” sticker can come unstuck.
      </p>

      <h2>Off-market</h2>
      <p>
        An off-market sale skips public advertising: the agent shops your property to their buyer database. The pitch is privacy, no
        campaign costs and a fast result. The reality check: price discovery needs exposure, and an off-market sale by definition has the
        least. You’re selling into one agent’s contact list, and the buyer knows there’s no visible competition. Genuine off-market
        premiums exist but are rare; quiet discounts are common.
      </p>
      <p>
        Off-market suits sellers who value privacy or speed over the last dollar, genuinely unique properties with a known shortlist of
        buyers, and a pre-campaign test run (“we’ll quietly offer it for two weeks before launch”). If an agent leads with an off-market
        buyer who is ready to pay strong money right now, ask the obvious question: strong compared with what? Without a campaign,
        neither of you knows.
      </p>

      <Pull>Without a campaign, neither of you knows.</Pull>

      <Box title="Watch for">
        <p>
          Method-of-sale advice that conveniently matches the agency’s habits. Some offices auction everything because auctions build the
          agent’s profile; others avoid them because they can’t run one. Ask what percentage of the agency’s last 20 sales used each
          method, and how that compares with the suburb. The answer tells you whether the recommendation is about your house or their
          playbook.
        </p>
      </Box>
    </>
  );
}
