import Link from "next/link";
import type { Chapter } from "../types";
import { Box, Ch, Pull, Stat } from "../parts";

export const chapter: Chapter = {
  guide: "buying",
  number: 1,
  step: "Know your game",
  standfirst:
    "Everyone shops in the same market, but a first home buyer and a downsizer are playing different games with different rules. Know your game before the selling side decides it for you.",
  callout:
    "Sorting you. From the first enquiry, the selling agent is working out what kind of buyer you are, how much you can spend and how much you want this home. The more clearly you know your own game, the less of it they can play for you.",
  checklist: [
    "Pick your persona: first home, upgrader, investor or downsizer",
    "Write down what you’re buying and why, in two sentences",
    "Decide the walk-away number before you inspect anything",
    "Plan to hold for at least five to seven years",
    "Upgraders: test what your current home is worth before you buy",
  ],
  cta: {
    kind: "plan",
    title: "Build your buying plan",
    body: "A few quick questions and your next three steps write themselves, with the calculators and guides for your state.",
    label: "Build my buying plan",
    href: "/plan?j=buying&from=buying-guide-ch1",
  },
  checked: "As at mid-2026.",
  Body,
};

function Body() {
  return (
    <>
      <p>
        Every seller’s agent you meet is running a campaign, and you’re what it’s aimed at. The price guide, the open-home crowd, the
        follow-up call and the deadline are all built to bring the most buyers to the highest number. None of that makes agents villains.
        It makes them professionals. This guide shows you how their campaign works, so you can run your own buying campaign and not get
        played. It starts with knowing which buyer you are.
      </p>
      <p>
        Most buying advice is written as if every buyer were the same person: a couple in their early thirties buying a house to live in.
        In practice, Australian buyers split into four broad camps, and the right move for one is often the wrong move for another.
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
        <strong>The mistake you’ll be tempted by:</strong> falling in love. Agents can see it from the kerb, and an emotionally committed
        buyer with no purchase history is the easiest negotiation in real estate. Decide your walk-away number before inspecting, not
        during the auction.
      </p>

      <h2>The upgrader</h2>
      <p>
        You’re running two transactions in the same market, which is the part most upgraders underweight. If prices move, they move on your
        sale and your purchase at once, so the gap between the two properties matters more than either price alone. Your equity is your
        superpower; the sell-first-or-buy-first question is your hardest call, and <Ch n={7} guide="buying">Chapter 7</Ch> and our
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
        are, buy something you can comfortably hold for at least five to seven years, because the costs of changing your mind are brutal.
      </p>

      <Stat value="7 to 10%">Of a property’s value consumed by a full buy-sell round trip.</Stat>

      <Pull>The market doesn’t care which buyer you are. Your playbook should.</Pull>

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
