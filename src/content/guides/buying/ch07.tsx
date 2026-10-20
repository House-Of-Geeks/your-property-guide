import Link from "next/link";
import type { Chapter } from "../types";
import { Box, Ch, Pull, Stat } from "../parts";

export const chapter: Chapter = {
  guide: "buying",
  number: 7,
  step: "Prepare an offer",
  standfirst:
    "Price gets the attention, but an offer is a package: price, conditions, deposit and settlement. Thinking through all four gives you more ways to reach a deal that works for you.",
  callout:
    "The selling agent’s job is to get the seller the best price and terms, so they will weigh your offer against other buyers’ and against the lowest price the seller will accept. Your written offer may be used to seek a better one from other buyers. A clear offer, backed by evidence and with an expiry, gives the seller something concrete to decide on.",
  checklist: [
    "Write down your value, your opening offer and your walk-away",
    "Offer in writing, with conditions, deposit, settlement terms and an expiry",
    "Justify the number with two or three comparable sales",
    "Keep finance and building-and-pest conditions unless you truly don’t need them",
    "Auction: reports done, finance approved and limit set in writing before you register",
  ],
  cta: {
    kind: "tool",
    title: "Check what the offer costs you each month",
    body: "Repayments, deposit and upfront costs at the price you’re about to offer, before you put it in writing.",
    label: "Open the affordability calculator",
    href: "/affordability-calculator?from=buying-guide-ch7",
  },
  checked: "Cooling-off and auction rules as at mid-2026.",
  Body,
};

function Body() {
  return (
    <>
      <p>
        This is where the seller’s plans and yours meet. The selling agent is aiming for the best price on a timetable that suits the
        seller; you want the right price on terms that protect you. Go in with your numbers written down and your offer on paper.
      </p>

      <h2>Private treaty: the negotiation</h2>
      <p>
        Before you offer, you need three numbers written down: your evidence-based value (from comparable settled sales, not the guide),
        your opening offer, and your genuine walk-away. The discipline isn’t the arithmetic; it’s refusing to revise the walk-away
        mid-negotiation because the kitchen was nice.
      </p>
      <p>
        Open below your value but inside credibility: roughly 5 per cent under in a balanced market, more if the listing is stale (
        <Ch n={6} guide="buying">Chapter 6</Ch>), less in a hot one. Lowball offers 15 per cent under don’t anchor anything; they usually tell
        the agent you’re not a serious buyer. Put the offer <strong>in writing</strong> with your conditions, your deposit and your settlement
        terms stated, give it an expiry (48 to 72 hours keeps a process honest), and justify the number with two or three comparable sales.
        An offer with reasons is harder to dismiss than a number on its own.
      </p>
      <p>
        Expect a counter-offer, and be careful with the most common shortcut: splitting the difference. “You’re at $720,000, they’re at
        $740,000, let’s do $730,000” costs you $10,000 in one agreeable sentence. Counter in smaller steps, without rushing, and give your
        reasons. And use terms as currency: a
        settlement date that suits the vendor, a bigger deposit, a shorter finance period. Terms regularly buy what cash can’t. Our guide to{" "}
        <Link href="/guides/how-to-negotiate-property-price-australia">negotiating the price</Link> has worked examples.
      </p>

      <h2>The conditions that protect you</h2>
      <ul>
        <li>
          <strong>Subject to finance.</strong> Your right to exit, deposit intact, if your loan isn’t formally approved within a stated
          period (14 to 21 days is standard). Pre-approval does not make this clause redundant: final approval depends on the bank valuing{" "}
          <em>this property</em> (<Ch n={8} guide="buying">Chapter 8</Ch>). Waive it only with unconditional approval in writing.
        </li>
        <li>
          <strong>Subject to building and pest.</strong> Your exit, or in practice your renegotiation lever, if the inspection finds
          material defects. In hot markets buyers waive it to look strong; that is exactly the market where defects can go unnoticed
          behind fresh paint.
        </li>
        <li>
          <strong>Subject to sale</strong> of your own property: the weakest condition you can attach, and many sellers won’t take it. If
          you need it, you’re usually better selling first (<Ch n={1} guide="buying">Chapter 1</Ch>’s upgrader problem).
        </li>
      </ul>
      <p>
        In some states conditions are standard contract furniture (Queensland’s standard contract has finance and building-and-pest
        clauses built in); in NSW and Victoria they’re negotiated specially. Your conveyancer inserts them <strong>before</strong> you sign,
        which is why they’re engaged in week one, not after the handshake.
      </p>

      <h2>Deposits and exchange</h2>
      <p>
        The deposit (10 per cent by convention, 5 per cent commonly negotiated) is paid when contracts are exchanged and held in trust,
        almost always the agent’s trust account, until settlement. It is not extra money; it’s the first slice of your purchase price.
        Exchange is the moment the deal binds both sides, and in NSW and the ACT there’s a gap between the handshake and exchange in which
        you can be <strong>gazumped</strong>: the seller can legally take a better offer until contracts are exchanged. The protection is
        speed: contract reviewed early, deposit ready, and a fast exchange asked for. In cooling-off states you can sign quickly and let
        the cooling-off period (<Ch n={9} guide="buying">Chapter 9</Ch>’s table) do the protecting; withdrawing inside it costs 0.25 per
        cent of the price in NSW, a fair premium for locking the door behind you.
      </p>

      <h2>Bidding at auction: decide beforehand, bid calmly</h2>
      <p>
        Everything about auctions flows from one legal fact: <strong>the successful bid is unconditional, and there is no cooling-off at
        auction in any Australian state or territory</strong>. No finance clause, no inspection clause, deposit due on the spot. In Victoria
        the exclusion extends to private sales within three clear business days either side of a publicly advertised auction. So every
        protection has to happen before the hammer: contract reviewed by your conveyancer, building and pest done, strata report read,
        finance formally approved with the bank’s valuation completed, deposit cheque or transfer arranged.
      </p>

      <Stat value="0 days">Cooling-off after the hammer falls, in every state and territory.</Stat>

      <p>On the day, how you bid matters less than folklore says, but it still matters:</p>
      <ul>
        <li>
          <strong>Set your limit in writing before you leave home</strong>, an odd number ($861,500 rather than $860,000, because limits
          cluster at round numbers and yours clears the cluster).
        </li>
        <li>
          <strong>Bid clearly and without hesitation.</strong> Projecting calm certainty discourages marginal bidders. Whether you open early
          or wait, bid like someone who intends to buy.
        </li>
        <li>
          <strong>Set your own increments.</strong> You can offer less than the auctioneer calls for; slowing $10,000 steps to $2,500 late in
          the auction slows the momentum and shows who is near their limit.
        </li>
        <li>
          <strong>Know the pass-in rules.</strong> If bidding stalls below reserve, the highest bidder usually earns the first (and sometimes
          exclusive) right to negotiate immediately afterwards. Being that bidder at a low number is a strong place to stand; brief yourself
          on your negotiation floor before the auction, not in the huddle.
        </li>
        <li>
          <strong>Vendor bids must be announced</strong> by the auctioneer. Hearing one late in the auction tells you the bidding from buyers
          hasn’t reached reserve. That is useful information; factor it in.
        </li>
      </ul>

      <Pull>An auction limit set in the moment is not a limit.</Pull>

      <Box title="First home">
        <p>
          Your pre-auction bill is real: a contract review, a building and pest report and possibly a strata search on a property you may
          not end up buying, multiplied by every auction you attempt. Budget for it, and use it as a filter: if you wouldn’t spend $800 preparing, you
          don’t want the property at auction prices. Some buyers split costs by negotiating report access with other bidders; fine, but read
          the assignment terms.
        </p>
      </Box>

      <Box title="Downsizer">
        <p>
          You are often the strongest buyer in the room and the least inclined to say so. Say so. No finance condition, flexible settlement,
          rent-back offered if the vendor needs time: sellers routinely prefer that package to higher offers from conditional buyers. Put
          your terms in the written offer, not only the conversation, so the agent presents them to the vendor in full.
        </p>
      </Box>

      <Box title="Watch for">
        <p>
          Pre-auction offers invited by the agent (“the vendor will sell before Saturday for the right number”). Sometimes the seller will
          genuinely sell early; often an early offer helps set a floor under the auction. If you offer pre-auction, make it strong enough to
          end the campaign, with a short expiry, and expect the agent to test it with other buyers. A weak pre-auction offer mostly tells the
          seller what you’re prepared to pay.
        </p>
      </Box>
    </>
  );
}
