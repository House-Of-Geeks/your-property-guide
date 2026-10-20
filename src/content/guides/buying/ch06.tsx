import Link from "next/link";
import type { Chapter } from "../types";
import { Box, Ch, Pull, Stat } from "../parts";

export const chapter: Chapter = {
  guide: "buying",
  number: 6,
  step: "Understand how homes are sold",
  standfirst:
    "The agent at the open home is friendly and helpful, and they act for the seller. Knowing how a sale is usually run, and what each step means for you, helps you respond calmly and decide on your own timetable.",
  callout:
    "A sale campaign is designed to bring as many buyers as possible to the best price for the seller. The price guide, the open homes, the follow-up calls and the deadline each play a part in that. Everything in this chapter is normal, legitimate selling, and knowing how it works helps you decide what to share and when to act.",
  checklist: [
    "Build your own price estimate from settled sales before you read the guide",
    "Track each shortlisted home’s guide against its result",
    "Answer “what’s your budget?” with a range rather than your limit",
    "Weigh evidence (contracts issued, reports ordered) over adjectives",
    "Off-market: price it from comparables and ask if a public campaign is coming",
    "Check days on market and price cuts before you negotiate",
  ],
  cta: {
    kind: "agent",
    title: "Have someone act for you",
    body: "A buyer’s agent acts for you, not the seller. Where one takes part in your area, we’ll introduce you, and we’ll tell you plainly if we can’t.",
    label: "Ask about a buyer’s agent",
    href: "/get-help?service=buyers-agent&from=buying-guide-ch6",
  },
  checked: "Underquoting rules and auction settings as at mid-2026.",
  Body,
};

function Body() {
  return (
    <>
      <p>
        Start with the basic fact of every sale: <strong>the agent works for the seller</strong>. Their legal duty is to the seller, and
        their commission depends on the seller’s result. That’s how the role is meant to work, and none of it makes the agent your
        opponent. It does mean the advice you hear at an open home is given on the seller’s behalf, so it helps to understand how a sale
        is put together.
      </p>

      <h2>How a sale is usually run</h2>
      <p>
        Most homes are sold through a marketing campaign, and our <Link href="/selling-guide">selling guide</Link> explains how sellers
        plan one. For a buyer, it usually arrives in four stages, and each one asks something of you:
      </p>
      <ul>
        <li>
          <strong>The number.</strong> Before launch, the agent sets a price guide or an advertised price. It’s a marketing tool designed
          to bring in the right buyers, not a valuation (more below).
        </li>
        <li>
          <strong>The launch.</strong> A new listing gets its biggest audience in its first two weeks, when every buyer with a saved search
          is notified. The campaign aims to turn that interest into offers quickly, which is why the first fortnight feels the most urgent.
        </li>
        <li>
          <strong>The opens and the follow-up.</strong> A busy open home shows every buyer there that they have competition, and the
          follow-up call is where the agent learns your budget, your timeline and how much you want the home.
        </li>
        <li>
          <strong>The deadline.</strong> An auction date or a “best and final” call. Deadlines are the campaign’s strongest tool, because
          they ask you to decide on the seller’s timetable rather than your own.
        </li>
      </ul>
      <p>
        Knowing which stage you’re in tells you what the agent is likely to ask of you next, and what you may prefer to keep to yourself.
      </p>

      <h2>Price guides and underquoting</h2>
      <p>
        A price guide is a marketing tool, not a valuation. Quoting low pulls a bigger crowd, and a bigger crowd makes a better
        auction, so guides in hot auction markets routinely finish 10 per cent or more below the result. The states have rules (in NSW the
        advertised guide can’t sit below the agent’s written estimate in the agency agreement; in Victoria every listing needs a Statement
        of Information with an indicative price backed by three comparable sales), but enforcement focuses on the worst cases, not the everyday
        gap between guide and result. Our guide to <Link href="/guides/underquoting-laws-by-state">underquoting laws by state</Link> has the detail.
      </p>
      <p>
        The practical response is to build your own estimate and treat the guide as a starting point. Pull the three comparables from the
        Statement of Information or ask the agent directly which sales support the guide, then check what those properties actually sold
        for. If the guide doesn’t line up with its own evidence, price the property yourself: recent settled sales of genuinely similar
        homes within a kilometre, adjusted for land, condition and street. <Ch n={2} guide="selling">Chapter 2 of our selling guide</Ch>{" "}
        describes how sellers and agents work out a realistic price; it’s worth building the same estimate yourself.
      </p>
      <p>
        Watch how the guide moves during the campaign too. A guide that creeps upward mid-campaign (“buyer feedback has been strong”) is
        telling you the interest is real. A guide that holds while open-home numbers thin is telling you the opposite, even if the agent
        sounds upbeat on Saturday.
      </p>

      <h2>What agents often say, and how to respond</h2>
      <ul>
        <li>
          <strong>“What’s your budget?”</strong> A normal question, and your answer is valuable to the seller. Answer with a range that
          starts at your hoped-for price, or say it depends on the property. Keep your limit to yourself.
        </li>
        <li>
          <strong>“We have another very interested buyer.”</strong> Possibly true, and hard for you to verify either way. Respond to
          evidence (a contract issued, a building report ordered), not adjectives.
        </li>
        <li>
          <strong>“The vendor would consider offers around $X.”</strong> A way of testing where buyers sit. The figure is usually set above
          the lowest price the seller would accept. Respond with your own evidence rather than starting from their number.
        </li>
        <li>
          <strong>“Make your best and final offer.”</strong> Sometimes a formal multiple-offer process, sometimes a way to bring a
          negotiation to a close. Ask how offers will be presented and whether the process is in writing. A genuine process has a clear
          answer.
        </li>
        <li>
          <strong>“It will be sold by the weekend.”</strong> Maybe. Properties do come back after “sold by the weekend”, and if this one
          sells, it won’t be the last good house in Australia.
        </li>
      </ul>
      <p>
        One more thing to know: agents keep notes on the buyers they meet, usually in a database, and what you share can follow you to the
        next listing. Your budget, your urgency, your personal circumstances, your lease ending in March. Be polite and engaged, and keep
        personal details to yourself.
      </p>

      <Pull>Understand how the sale works, and you can decide at your own pace.</Pull>

      <h2>How auctions are run</h2>
      <p>
        An auction is designed to build competition: the crowd shows buyers there is interest, the auctioneer keeps the bidding moving,
        and the contract is final (no cooling-off at auction in any state or territory; <Ch n={7} guide="buying">Chapter 7</Ch>).
        Auctioneers use a few standard techniques: a “vendor bid” to start the bidding, calls for raises in $5,000 steps that feel small
        against the price of a house, and a long pause before “passing in” that gives the room one more chance to bid. Knowing how it works
        helps, but the moment still carries people along, which is why your limit is best set at home, in writing, before you register (
        <Ch n={7} guide="buying">Chapter 7</Ch> covers how to bid).
      </p>
      <p>
        Before auction day, the agent may invite pre-auction offers (“the vendor will sell before Saturday for the right number”).
        Sometimes the seller will genuinely sell early; often an early offer helps set a floor under the auction. If you offer early, make
        it strong enough to end the campaign, give it a short expiry, and expect the agent to test it with other buyers.
      </p>

      <h2>Off-market: the quiet listing</h2>
      <p>
        An off-market sale skips public advertising: the agent offers the property to their own buyer database. From the seller’s side, the
        pitch is privacy and speed; the cost is that price discovery needs exposure, and an off-market sale has the least. For a buyer,
        that cuts both ways. There’s no visible competition, which can work in your favour. But sellers also use a quiet fortnight as a
        pre-launch test run, so your offer may be the evidence that sets the public price.
      </p>
      <p>How to respond:</p>
      <ul>
        <li>Price it from settled comparable sales exactly as you would a public listing. “Exclusive access” is not worth a premium.</li>
        <li>Ask how long it has been offered, and whether a public campaign follows if it doesn’t sell quietly.</li>
        <li>Put your offer in writing with a short expiry, so it doesn’t stay open while the agent tests the market.</li>
      </ul>

      <h2>Days on market: what a listing’s age tells you</h2>
      <p>
        Sellers watch how long their home has been listed, and you can watch it too: listing date, price-cut history and previous
        campaigns are all visible on the portals or a sixty-second search. A fresh listing in week one or two has a confident vendor who
        rarely negotiates hard. The same listing at day 70, after one price cut and a relisted campaign, has a vendor whose agent is now
        managing <em>their</em> price expectations. That is when conditional offers, longer settlements and sharper prices tend to be
        accepted.
      </p>

      <Stat value="60 days">Past this many days on market, the negotiating leverage usually sits with buyers.</Stat>

      <h2>How to respond: your own plan</h2>
      <p>The seller’s sale runs to a plan. Your purchase can too, and it only needs to be in order:</p>
      <ol>
        <li>Build your own estimate from settled sales before you read the guide.</li>
        <li>Give the agent a range, and keep your limit and your pre-approval amount to yourself.</li>
        <li>Track every shortlisted home’s guide against its result; that gap is your suburb’s quoting habit.</li>
        <li>Respond to evidence, not adjectives, and put every offer in writing with an expiry.</li>
        <li>Use the calendar: fresh listings for certainty, older ones for room to negotiate.</li>
        <li>Set your auction limit at home, in writing, before you register.</li>
      </ol>

      <Box title="First home">
        <p>
          Urgency is felt most by buyers who’ve missed out before. Two rules help: keep your pre-approval amount to yourself (it is your
          ceiling, and what you share with one agent can travel), and don’t make a same-day offer you hadn’t planned that morning. A home
          that can’t wait for a single night’s sleep was unlikely to be the right decision.
        </p>
      </Box>

      <Box title="Investor">
        <p>
          Your advantage is that a spreadsheet doesn’t feel the pressure of an open home. Use that openly: tell the agent you’re a numbers
          buyer with finance arranged, ask for the rental appraisal and outgoings up front, and make offers that expire. Agents weigh
          certainty as well as price when they advise a seller, so a calm buyer with clean terms is often preferred over a higher, less
          certain offer.
        </p>
      </Box>
    </>
  );
}
