import Link from "next/link";
import type { Chapter } from "../types";
import { Box, Ch, Pull, Stat } from "../parts";

export const chapter: Chapter = {
  guide: "buying",
  number: 6,
  step: "Read the seller’s campaign",
  standfirst:
    "The agent at the open home is charming, helpful and entirely employed by the other side. Their campaign is aimed at you. Decode the playbook and it loses most of its power.",
  callout:
    "Running the campaign on you. The price guide, the open-home crowd, the follow-up calls and the deadline are all designed to bring the most buyers to the highest number. Every tactic in this chapter is legitimate selling; knowing them is how you stop paying for them.",
  checklist: [
    "Build your own number from settled sales before you read the guide",
    "Track each shortlisted home’s guide against its result",
    "Answer “what’s your budget?” with a range, never your ceiling",
    "Respond to evidence (contracts issued, reports ordered), not adjectives",
    "Off-market: price it from comparables and ask if a public campaign is coming",
    "Watch days on market and price cuts for your leverage",
  ],
  cta: {
    kind: "agent",
    title: "Get someone on your side",
    body: "A buyer’s agent acts for you, not the seller. Where one takes part in your area we’ll introduce you to one, and we’ll tell you plainly if we can’t.",
    label: "Talk to a buyer’s agent",
    href: "/get-help?service=buyers-agent&from=buying-guide-ch6",
  },
  checked: "Underquoting rules and auction settings as at mid-2026.",
  Body,
};

function Body() {
  return (
    <>
      <p>
        Start with the structural fact every buyer should tattoo somewhere visible: <strong>the agent works for the seller</strong>. Their
        legal duty and their commission both point the other way. None of what follows makes agents villains; it makes them
        professionals running a campaign. You’re not the client. You’re the market.
      </p>

      <h2>The seller’s campaign, from your side of the table</h2>
      <p>
        Every sale you’ll chase is run as a campaign, and our <Link href="/selling-guide">selling guide</Link> teaches vendors to run it
        well. From your side, it arrives in four stages, and each one is built to move you:
      </p>
      <ul>
        <li>
          <strong>The number.</strong> Before launch, the agent sets a price guide or an advertised price. It’s a marketing instrument
          designed to bring the right crowd, not a valuation (more below).
        </li>
        <li>
          <strong>The launch.</strong> A new listing gets its biggest audience in its first two weeks, when every buyer with a saved search
          is notified. The campaign is built to convert that audience fast, which is why the first fortnight feels the most urgent.
        </li>
        <li>
          <strong>The opens and the follow-up.</strong> A crowded open creates competitive anxiety, and the follow-up call is where the
          agent learns your budget, your timeline and how much you want the home.
        </li>
        <li>
          <strong>The deadline.</strong> An auction date, a “best and final” call or a manufactured rival. Deadlines are the campaign’s
          strongest tool, because they make you decide on the agent’s timetable instead of yours.
        </li>
      </ul>
      <p>Knowing which stage you’re in tells you what the agent needs from you next, and what you shouldn’t give them.</p>

      <h2>Price guides and underquoting, decoded</h2>
      <p>
        A price guide is a marketing instrument, not a valuation. Quoting low pulls a bigger crowd, and a bigger crowd makes a better
        auction, so guides in hot auction markets routinely finish 10 per cent or more below the result. The states have rules (in NSW the
        advertised guide can’t sit below the agent’s written estimate in the agency agreement; in Victoria every listing needs a Statement
        of Information with an indicative price backed by three comparable sales), but enforcement chases the worst cases, not the everyday
        stretch. Our guide to <Link href="/guides/underquoting-laws-by-state">underquoting laws by state</Link> has the detail.
      </p>
      <p>
        Your defence is to build your own number and treat the guide as a starting rumour. Pull the three comparables from the Statement of
        Information or ask the agent directly which sales support the guide, then check what those properties actually sold for. If the
        guide can’t survive contact with its own evidence, price the property yourself: recent settled sales of genuinely similar homes
        within a kilometre, adjusted for land, condition and street. <Ch n={2} guide="selling">Chapter 2 of our selling guide</Ch>{" "}
        describes exactly how sellers and agents build the real number; buyers should build the same one.
      </p>
      <p>
        Watch the guide’s behaviour during the campaign too. A guide that creeps upward mid-campaign (“buyer feedback has been strong”) is
        telling you the crowd is real. A guide that holds while open-home numbers thin is telling you the opposite, whatever the agent says
        on Saturday.
      </p>

      <h2>The scripts, translated</h2>
      <ul>
        <li>
          <strong>“What’s your budget?”</strong> The most profitable question in real estate, for the other side. Answer with a range
          bottomed at your hoped-for price, or deflect: “depends on the property”. Never name your ceiling.
        </li>
        <li>
          <strong>“We have another very interested buyer.”</strong> Possibly true, impossible to verify, and deployed precisely because of
          that. Respond to evidence (a contract issued, a building report ordered), not adjectives.
        </li>
        <li>
          <strong>“The vendor would consider offers around $X.”</strong> Fishing. The number is an anchor set above the vendor’s floor.
          Counter with your evidence, not their anchor.
        </li>
        <li>
          <strong>“Make your best and final offer.”</strong> Sometimes a genuine multiple-offer process, sometimes pressure theatre. Ask how
          offers will be presented and whether the process is in writing. A real process survives the question.
        </li>
        <li>
          <strong>“It will be sold by the weekend.”</strong> Maybe. Properties reappear after “sold by the weekend” more often than agents
          advertise. If it does sell, the next one won’t be the last good house in Australia.
        </li>
      </ul>
      <p>
        One more quiet mechanism: everything you tell any agent goes into a database and follows you. Your budget, your urgency, your
        divorce, your lease ending in March. Be polite, be engaged, and be boring.
      </p>

      <Pull>You’re not the client. You’re the market.</Pull>

      <h2>Auction psychology, from the buyer’s side</h2>
      <p>
        Auctions are engineered environments: the crowd supplies social proof, the auctioneer supplies momentum, and the contract supplies
        finality (no cooling-off, anywhere, ever; <Ch n={7} guide="buying">Chapter 7</Ch>). The craft is in small things: opening “vendor
        bids” to start the climb, calling for raises in $5,000 steps so increments feel trivial against the price of a house, and the long
        theatrical pause before “passing in” that flushes out one more bid. Knowing the machinery doesn’t make you immune, which is why your
        limit gets set at home, in writing, before you register (<Ch n={7} guide="buying">Chapter 7</Ch> covers bidding tactics).
      </p>
      <p>
        Before auction day, expect the pre-auction offer request (“the vendor will sell before Saturday for the right number”). Sometimes
        it’s genuine; often it’s a way to set a floor under the auction using your money. If you offer early, make it strong enough to end
        the campaign, with a short fuse, and assume it will be shopped around.
      </p>

      <h2>Off-market: the quiet listing</h2>
      <p>
        An off-market sale skips public advertising: the agent shops the property to their own buyer database. From the seller’s side, the
        pitch is privacy and speed; the cost is that price discovery needs exposure, and an off-market sale has the least. From your side,
        that cuts both ways. There’s no visible competition, which is your opening. But sellers also use a quiet fortnight as a pre-launch
        test run, so your offer may be the evidence that sets the public price.
      </p>
      <p>How to respond:</p>
      <ul>
        <li>Price it from settled comparable sales exactly as you would a public listing. “Exclusive access” is not worth a premium.</li>
        <li>Ask how long it has been offered, and whether a public campaign follows if it doesn’t sell quietly.</li>
        <li>Put your offer in writing with a short expiry, so it can’t sit in a drawer while the agent tests the market.</li>
      </ul>

      <h2>Days on market: your leverage, published daily</h2>
      <p>
        Sellers watch their listing age with rising dread, and you can watch it too: listing date, price-cut history and previous campaigns
        are all visible on the portals or a sixty-second search. A fresh listing in week one or two has a confident vendor and rarely
        negotiates hard. The same listing at day 70, after one price cut and a relisted campaign, has a vendor whose agent is now
        conditioning <em>them</em>, not you. That is the moment conditional offers, longer settlements and sharper prices get accepted.
      </p>

      <Stat value="60 days">Past this many days on market, the negotiating leverage is yours.</Stat>

      <h2>How to respond: your own campaign</h2>
      <p>The seller has a campaign. Run one back. It needs no aggression, just order:</p>
      <ol>
        <li>Build your number from settled sales before you read the guide.</li>
        <li>Give the agent a range, never your ceiling, and never your pre-approval amount.</li>
        <li>Track every shortlisted home’s guide against its result; that gap is your suburb’s quoting habit.</li>
        <li>Respond to evidence, not adjectives, and put every offer in writing with an expiry.</li>
        <li>Use the calendar: fresh listings for certainty, stale ones for leverage.</li>
        <li>Set your auction limit at home, in writing, before you register.</li>
      </ol>

      <Box title="First home">
        <p>
          Urgency scripts are aimed at you, because fear of missing out is strongest in buyers who’ve missed out before. Two rules hold the
          line: never reveal your pre-approval amount (it is your ceiling, and they will find it), and never make a same-day offer you hadn’t
          planned that morning. Any property that punishes a single night’s sleep was going to punish you eventually.
        </p>
      </Box>

      <Box title="Investor">
        <p>
          Your advantage is that none of the emotional machinery works on a spreadsheet. Use it openly: tell the agent you’re a numbers buyer
          with finance arranged, ask for the rental appraisal and outgoings up front, and make offers that expire. Agents triage buyers
          constantly; the unemotional one with clean terms often beats a higher, flakier offer.
        </p>
      </Box>
    </>
  );
}
