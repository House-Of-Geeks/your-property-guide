import Link from "next/link";
import type { Chapter } from "../types";
import { Ch, Pull, Stat, TableWrap } from "../parts";

export const chapter: Chapter = {
  guide: "selling",
  number: 8,
  step: "Work through offers",
  standfirst:
    "An offer is a package, not a number. Read the price alongside the conditions, the deposit and the settlement terms, and you’ll see which offer is genuinely the strongest.",
  callout:
    "Experienced sellers write down their lowest acceptable price before offers arrive, and change it only when the evidence changes, not in the heat of the moment. They read every offer on price, conditions, deposit and settlement together, and respond in writing with reasons rather than splitting the difference out of habit. Their agent acts for them in the negotiation, and they stay closely involved at each step.",
  checklist: [
    "Write down your lowest acceptable price before the sale campaign starts",
    "Require every offer in writing, with all conditions stated",
    "Weigh price, conditions, deposit and settlement terms together",
    "Keep finance and building-and-pest periods tight",
    "Respond with evidence rather than splitting the difference by reflex",
    "Know your state’s cooling-off rules before you sign",
  ],
  cta: {
    kind: "agreement-check",
    title: "Understand how your agent is paid",
    body: "The agency agreement sets how your agent’s commission is calculated, including any tiered rate, and what it would cost you to end the agreement. We’ll go through it with you before you sign, free.",
    label: "Book my agreement check",
    href: "/agreement-check?from=selling-guide-ch8",
  },
  checked: "Cooling-off settings as at mid-2026. These get amended, so confirm the current rules for your state when you sign.",
  Body,
};

function Body() {
  return (
    <>
      <p>
        Every offer deserves careful handling, because on any home the last few per cent of the price is real money. This is where
        your preparation turns into a result. Everything you did in the first seven chapters gave you evidence; this chapter is about
        using it.
      </p>

      <h2>Reading an offer properly</h2>
      <p>Weigh every offer on four axes:</p>
      <ul>
        <li><strong>Price</strong>, obviously, but only alongside the rest.</li>
        <li>
          <strong>Conditions.</strong> An unconditional offer at $840,000 can beat a conditional one at $855,000, because conditions are
          exit doors. Every condition is a probability discount on the headline number.
        </li>
        <li>
          <strong>Deposit.</strong> A 10 per cent deposit signals a committed, organised buyer. A 5 per cent deposit isn’t disqualifying,
          but it tilts the read.
        </li>
        <li>
          <strong>Settlement terms.</strong> A settlement date that matches your onward purchase can be worth real money. So can a
          rent-back period if you need one. Terms are where a flexible seller can find value that a rigid one misses.
        </li>
      </ul>
      <p>
        Insist that every offer comes to you <strong>in writing</strong>, with all conditions stated. Verbal offers relayed by phone are
        a starting point for discussion, not offers.
      </p>

      <h2>The common conditions, explained</h2>
      <p>
        <strong>Subject to finance</strong> gives the buyer a stated period (commonly 14 to 21 days) to obtain formal loan approval,
        failing which they can withdraw with deposit refunded. It’s the most common condition and the most common reason sales collapse,
        usually via a low bank valuation rather than the buyer’s income. Sensible responses: prefer buyers with pre-approval, keep the
        finance period tight, and have your agent confirm the buyer’s broker is real and progressing.
      </p>
      <p>
        <strong>Subject to building and pest</strong> gives the buyer an inspection window (commonly 7 to 14 days) and the right to
        withdraw, or in practice renegotiate, if the report turns up defects. This is where your <Ch n={4} guide="selling">Chapter
        4</Ch> decision pays off: a seller who already knows their building’s condition can answer the usual post-inspection request
        for a discount with facts, and decline one the report doesn’t support.
      </p>
      <p>
        <strong>Subject to sale</strong> of the buyer’s own property is the weakest condition of all; if you accept one, insist on a
        release clause that lets you keep marketing and move to a better offer if one arrives.
      </p>

      <h2>Cooling-off periods: what your buyer can do after signing</h2>
      <p>
        In most states, a private-treaty buyer of residential property can withdraw within a statutory cooling-off period for a small
        penalty or none. No state gives cooling-off rights to buyers at auction. Sellers get no cooling-off anywhere (on the sale
        contract; NSW gives you one business day on the agency agreement, per <Ch n={5} guide="selling">Chapter 5</Ch>).
      </p>
      <TableWrap>
        <table>
          <thead>
            <tr><th>State / territory</th><th>Buyer cooling-off</th><th>Penalty if buyer withdraws</th></tr>
          </thead>
          <tbody>
            <tr><td>NSW</td><td>5 business days (10 for off-the-plan)</td><td>0.25% of purchase price</td></tr>
            <tr><td>Victoria</td><td>3 business days</td><td>$100 or 0.2%, whichever is greater</td></tr>
            <tr><td>Queensland</td><td>5 business days</td><td>Up to 0.25%</td></tr>
            <tr><td>South Australia</td><td>2 clear business days (runs from Form 1 service if later)</td><td>Deposit above $100 refunded</td></tr>
            <tr><td>Western Australia</td><td>None (unless written into the contract)</td><td>n/a</td></tr>
            <tr><td>Tasmania</td><td>None (unless written into the contract)</td><td>n/a</td></tr>
            <tr><td>ACT</td><td>5 business days</td><td>0.25% of purchase price</td></tr>
            <tr><td>Northern Territory</td><td>4 business days</td><td>None; deposit refunded in full</td></tr>
          </tbody>
        </table>
      </TableWrap>
      <p>
        Cooling-off can generally be waived or shortened: in NSW a buyer’s solicitor signs a section 66W certificate, and similar waivers
        exist elsewhere. Victoria’s cooling-off also doesn’t apply within three clear business days either side of a publicly advertised
        auction. Treat the table as the default position, and confirm current rules for your state when you sign, since these settings
        do get amended. Our guide to <Link href="/guides/cooling-off-period-by-state-australia">cooling-off periods by state</Link> has
        the detail.
      </p>

      <h2>Gazumping, both directions</h2>
      <p>
        In NSW and the ACT, a sale isn’t binding until contracts are formally exchanged, which can be days or weeks after a price is
        agreed. In that gap, a seller can legally accept a higher offer (gazumping the first buyer), and a buyer can equally walk away or
        reduce their offer (sometimes called gazundering). As a seller you’re allowed to keep entertaining offers until exchange, and
        your agent is generally obliged to pass new offers on. If you want a deal locked fast, push for quick exchange, even by signing
        with a cooling-off period rather than waiting for the buyer’s solicitor to finish a leisurely review. In Queensland and most
        other states, contracts are typically signed at the point of agreement, so the gap barely exists.
      </p>

      <h2>Common pressures late in a negotiation</h2>
      <p>
        Much of what’s written about property negotiation is for buyers. Sellers face pressures of their own, usually when a deal is 95
        per cent done and everyone wants it finished. Recognising them helps you respond calmly:
      </p>
      <ul>
        <li>
          <strong>“The buyer is at their absolute limit.”</strong> Sometimes true, but rarely something you can check. Buyers often
          describe their limit as lower than it is, and agents pass on what they’re told. Weigh it against your evidence.
        </li>
        <li>
          <strong>Anchoring with a low first offer.</strong> A weak written offer arrives early and resets expectations, making the next
          offer look generous. Judge each offer against your evidence-based range from <Ch n={2} guide="selling">Chapter 2</Ch>, not
          against the last offer.
        </li>
        <li>
          <strong>Deadlines you can’t check.</strong> “They’re bidding on another place Saturday.” It may be true. It’s reasonable to
          ask which property, and the answer helps you judge how firm the deadline is.
        </li>
        <li>
          <strong>Feedback conditioning.</strong> A steady run of underwhelming “market feedback” that leans toward a price cut or a
          marginal offer. Check it against the data you agreed at launch: groups through, repeat visits, contract requests. If those
          numbers say interest is healthy, the feedback deserves a closer look.
        </li>
        <li>
          <strong>The split-the-difference reflex.</strong> “You’re at $865,000, they’re at $845,000, let’s do $855,000” feels fair and
          costs you $10,000 in one sentence. A counter at $862,000 is equally reasonable; meeting in the middle is a habit, not a rule.
        </li>
      </ul>

      <Stat value="$10,000">What one split-the-difference sentence can cost you.</Stat>

      <p>
        Three habits help throughout: set your genuine floor (in writing, to yourself) before the sale campaign starts, require all
        offers in writing, and understand how your agent is paid. On a 2.5 per cent commission, the agent’s share of a $10,000 price
        improvement is $250, while a deal that collapses earns them nothing. That gives every agent some pull toward a finished sale
        over the best possible one. Your agent acts for you, and a good one keeps your interests first despite that pull; the agent
        and the agreement you chose in <Ch n={5} guide="selling">Chapter 5</Ch> are what you’re relying on here.
      </p>

      <Pull>A finished sale and the best sale aren’t always the same thing.</Pull>
    </>
  );
}
