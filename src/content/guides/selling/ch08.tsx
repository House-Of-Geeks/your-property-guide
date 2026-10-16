import Link from "next/link";
import type { Chapter } from "../types";
import { Ch, Pull, Stat, TableWrap } from "../parts";

export const chapter: Chapter = {
  guide: "selling",
  number: 8,
  step: "Negotiate every dollar",
  standfirst:
    "An offer is a package, not a number. The seller who only reads the price is negotiating with one eye shut.",
  callout:
    "Top-end negotiations are run from a written floor, set before the campaign and never revised in the moment. Every offer is read on price, conditions, deposit and settlement, countered in writing with evidence, and nobody splits the difference out of habit. The agent’s job is to hold the line, and the vendor checks that they do.",
  checklist: [
    "Write down your floor before the campaign starts",
    "Require every offer in writing, with all conditions stated",
    "Weigh price, conditions, deposit and settlement terms together",
    "Keep finance and building-and-pest periods tight",
    "Counter with evidence; don’t split the difference by reflex",
    "Know your state’s cooling-off rules before you sign",
  ],
  cta: {
    kind: "agreement-check",
    title: "Know what your agent earns on every dollar",
    body: "The agency agreement sets what your agent earns on every dollar they negotiate, and what it costs you to walk away. We’ll go through it with you before you sign, free.",
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
        At the top end, every offer is negotiated as though the last $50,000 matters, because it does. On any home, this is where the
        campaign pays out or leaks. Everything you did in the first seven chapters gave you evidence; this chapter is about using it.
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
          rent-back period if you need one. Terms are where flexible sellers harvest value that stubborn ones leave on the table.
        </li>
      </ul>
      <p>
        Insist that every offer comes to you <strong>in writing</strong>, with all conditions stated. Verbal offers relayed by phone are
        negotiating instruments, not offers.
      </p>

      <h2>The common conditions, decoded</h2>
      <p>
        <strong>Subject to finance</strong> gives the buyer a stated period (commonly 14 to 21 days) to obtain formal loan approval,
        failing which they can withdraw with deposit refunded. It’s the most common condition and the most common reason sales collapse,
        usually via a low bank valuation rather than the buyer’s income. Sensible responses: prefer buyers with pre-approval, keep the
        finance period tight, and have your agent confirm the buyer’s broker is real and progressing.
      </p>
      <p>
        <strong>Subject to building and pest</strong> gives the buyer an inspection window (commonly 7 to 14 days) and the right to
        withdraw, or in practice renegotiate, if the report turns up defects. This is where your <Ch n={4} guide="selling">Chapter
        4</Ch> decision pays off: a seller who already knows their building’s condition can hold the line against the ritual
        post-inspection discount request.
      </p>
      <p>
        <strong>Subject to sale</strong> of the buyer’s own property is the weakest condition of all; if you accept one, demand a release
        clause letting you keep marketing and bump the buyer if a better offer lands.
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

      <h2>Negotiation tactics used on vendors</h2>
      <p>
        You’ll hear plenty about tactics agents use on buyers. Less advertised is the toolkit used on you, the vendor, usually to close
        a deal that’s 95 per cent done:
      </p>
      <ul>
        <li>
          <strong>“The buyer is at their absolute limit.”</strong> Sometimes true. Verifiable never. Buyers tell agents their limit is
          below their limit; agents pass it along with conviction.
        </li>
        <li>
          <strong>Anchoring with the lowball.</strong> A weak written offer arrives early to reset your expectations, making the next
          offer look generous. Judge each offer against your evidence-based range from <Ch n={2} guide="selling">Chapter 2</Ch>, not
          against the last offer.
        </li>
        <li>
          <strong>Manufactured deadlines.</strong> “They’re bidding on another place Saturday.” Maybe. Ask which one. The pause that
          follows is informative.
        </li>
        <li>
          <strong>Feedback conditioning.</strong> A steady drip of underwhelming “market feedback” softening you up for a price cut or a
          marginal offer. The cure is the data you agreed at launch: groups through, repeat visits, contract requests. If the numbers
          say the campaign is healthy, the feedback chorus deserves scepticism.
        </li>
        <li>
          <strong>The split-the-difference reflex.</strong> “You’re at $865,000, they’re at $845,000, let’s do $855,000” feels fair and
          costs you $10,000 in one sentence. Counter at $862,000 instead; meeting in the middle is a habit, not a law.
        </li>
      </ul>

      <Stat value="$10,000">What one split-the-difference sentence can cost you.</Stat>

      <p>
        Your standing defences: set your genuine floor (in writing, to yourself) before the campaign starts, require all offers in
        writing, and remember the agent’s incentive arithmetic. On a 2.5 per cent commission, the agent’s share of a $10,000 price
        improvement is $250, but a collapsed deal costs them everything. Agents are structurally biased toward “done” over “best”. A
        good one resists the bias. The agreement you signed in <Ch n={5} guide="selling">Chapter 5</Ch> was your bet on which kind you
        hired.
      </p>

      <Pull>Agents are structurally biased toward “done” over “best”.</Pull>
    </>
  );
}
