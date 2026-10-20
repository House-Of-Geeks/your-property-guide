import Link from "next/link";
import type { Chapter } from "../types";
import { Box, Ch, Pull, Stat } from "../parts";

export const chapter: Chapter = {
  guide: "buying",
  number: 1,
  step: "Know where you’re starting",
  standfirst:
    "Everyone buys in the same market, but a first home buyer and a downsizer face different rules, risks and costs. Knowing which buyer you are makes every later decision clearer.",
  callout:
    "From the first enquiry, the selling agent is working out what kind of buyer you are, how much you can spend and how much you want this home. That’s part of their job: they act for the seller and are paid to get the best result for them. If you’re clear about your own situation and limits first, you can decide what to share.",
  checklist: [
    "Work out which buyer you are: first home, upgrader, investor or downsizer",
    "Write down what you’re buying and why, in two sentences",
    "Decide the walk-away number before you inspect anything",
    "Plan to hold for at least five to seven years",
    "Upgraders: test what your current home is worth before you buy",
  ],
  cta: {
    kind: "plan",
    title: "Build your next-step plan",
    body: "Answer a few quick questions and get your next three steps, with the calculators and guides for your state.",
    label: "Build my next-step plan",
    href: "/plan?j=buying&from=buying-guide-ch1",
  },
  checked: "As at mid-2026.",
  Body,
};

function Body() {
  return (
    <>
      <p>
        Every home you look at is being sold by someone, usually with an agent who acts for the seller. The price guide, the open homes,
        the follow-up call and the deadline are how a sale is usually run, and together they’re designed to bring the most buyers to the
        best price for the seller. That’s the agent’s job, and it helps to understand it. This guide explains how each step works, what it
        means for you and what to check or ask, so you can make each decision with a clear head. It starts with knowing which buyer you
        are.
      </p>
      <p>
        Most buying advice is written as if every buyer were the same person: a couple in their early thirties buying a house to live in.
        In practice, Australian buyers split into four broad camps, and the right choice for one is often the wrong choice for another.
        Chapters 2 to 10 carry labelled callouts (First home, Upgrader, Investor, Downsizer) wherever the advice diverges. Find your label
        and read those boxes first.
      </p>

      <h2>The first home buyer</h2>
      <p>
        Your defining constraints are the deposit and the clock: prices in most capitals grow faster than most people can save. Your
        defining advantages are government support worth tens of thousands of dollars (<Ch n={3} guide="buying">Chapter 3</Ch> is yours)
        and total flexibility, because you have nothing to sell. Your job is to get a foothold in a sound suburb at a price the numbers
        support, not to find a forever home on a first-home budget.
      </p>
      <p>
        <strong>The mistake you’ll be tempted by:</strong> falling in love. It shows quickly, and a buyer who is emotionally committed,
        with no past purchase to compare against, finds it hardest to hold to a sensible price. Decide your walk-away number before
        inspecting, not during the auction.
      </p>

      <h2>The upgrader</h2>
      <p>
        You’re running two transactions in the same market, which is the part most upgraders underweight. If prices move, they move on your
        sale and your purchase at once, so the gap between the two properties matters more than either price alone. Your equity is your
        biggest advantage; the sell-first-or-buy-first question is your hardest call, and <Ch n={7} guide="buying">Chapter 7</Ch> and our
        companion <Link href="/selling-guide">selling guide</Link> cover it.
      </p>
      <p>
        <strong>The mistake you’ll be tempted by:</strong> buying before you’ve tested what your current home is actually worth. An
        optimistic appraisal on the sale side plus an emotional purchase on the buy side is how families end up with bridging debt they
        never budgeted for.
      </p>

      <h2>The investor</h2>
      <p>
        You’re not buying a home, you’re buying a stream of rent and a claim on future growth, and the property doesn’t need to suit you
        at all. Your decisions should run on yield, vacancy rates, land value and tax position. Lenders treat you differently too: higher
        rates, sharper scrutiny of rental income, different loan structures (<Ch n={8} guide="buying">Chapter 8</Ch>).
      </p>
      <p>
        <strong>The mistake you’ll be tempted by:</strong> buying where you live because you know it. Familiarity is not analysis. The
        suburb you drive through daily is rarely the best-performing asset available for your budget, and self-managing a property two
        streets away turns an investment into a part-time job.
      </p>

      <h2>The downsizer</h2>
      <p>
        You’re likely selling a large family home and buying something smaller, often with cash left over. You hold the strongest
        negotiating position of the four: no finance clause, flexible settlement, decades of market experience. Your risks are different:
        strata quality, lift access, proximity to services, and the gap between the home you picture and the one you’ll want in ten
        years. Superannuation rules also give you a dedicated lever (<Ch n={3} guide="buying">Chapter 3</Ch>).
      </p>
      <p>
        <strong>The mistake you’ll be tempted by:</strong> buying for the life you’re leaving. The four-bedroom “downsize” with a guest
        wing for grandchildren who visit twice a year costs you exactly the windfall you downsized to collect.
      </p>

      <h2>One number every persona shares</h2>
      <p>
        Buying and later selling a property consumes roughly 7 to 10 per cent of its value in transaction costs: stamp duty, conveyancing,
        inspections, agent commission and marketing on the way out. That round trip is why short holds rarely pay. Whichever buyer you
        are, buy something you can comfortably hold for at least five to seven years, because the costs of changing your mind are steep.
      </p>

      <Stat value="7 to 10%">Of a property’s value consumed by a full buy-sell round trip.</Stat>

      <Pull>The market treats every buyer the same. Your plan should fit the buyer you are.</Pull>

      <Box title="Watch for">
        <p>
          Persona creep. First home buyers talking themselves into “investment-grade” apartments they don’t want to live in, investors
          keeping a dud because they once slept there, downsizers buying bigger. The moment your reasons stop matching your situation,
          stop and re-read this chapter.
        </p>
      </Box>
    </>
  );
}
