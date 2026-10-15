import Link from "next/link";
import type { Chapter } from "../types";
import { Box, Ch, Pull, Stat } from "../parts";

export const chapter: Chapter = {
  guide: "selling",
  number: 2,
  step: "Know your number",
  standfirst:
    "Three different people will give you three different numbers, and at least one of them has an incentive to be wrong. Here’s how to find the real one before an agent quotes you.",
  callout:
    "A top-end campaign never starts with an agent’s opinion. It starts with a file of settled sales, adjusted line by line for land, condition and position, and every price conversation after that is measured against the file. The agent who brings the best evidence earns the listing, not the one with the biggest number.",
  checklist: [
    "List six months of settled sales of genuinely comparable homes",
    "Strike out the outliers and adjust the rest for condition and land",
    "Write down your own price range before any agent visits",
    "Ask every appraising agent for the comparable sales behind their number",
    "Treat an appraisal more than about 10 per cent above the others as a question, not a compliment",
  ],
  cta: {
    kind: "tool",
    title: "Check a range for your suburb",
    body: "Pick your suburb and property type for the published median and a range either side, then test it against your own comparable sales.",
    label: "See my suburb’s price range",
    href: "/property-valuation?from=selling-guide-ch2",
  },
  checked: "Figures are typical ranges as at mid-2026.",
  Body,
};

function Body() {
  return (
    <>
      <p>
        At the top end, the evidence is on the table before anyone names a price. That’s the habit to copy. Build your own number
        from settled sales before an agent walks through the door, and every appraisal you hear becomes something you test, not
        something you accept. Your number is the foundation of the whole campaign: the method, the launch price, the reserve and
        the offers you accept all lean on it.
      </p>

      <h2>Appraisal, valuation, estimate: not the same thing</h2>
      <p>
        <strong>An agent appraisal</strong> is a free market opinion from someone who wants your listing. It’s usually informed by
        genuine local knowledge, but it is a sales document, not a neutral assessment. It carries no legal weight.
      </p>
      <p>
        <strong>A bank valuation</strong> is a formal assessment by an independent certified valuer, ordered by a lender to protect the
        lender. Valuers are deliberately conservative because their job is to estimate what the bank would recover in a forced sale.
        Bank valuations commonly land 5 to 10 per cent below what a well-run campaign achieves. If a buyer’s bank valuation comes in
        low, their loan can shrink, which is why “subject to finance” offers sometimes fall over even when the buyer is keen.
      </p>

      <Stat value="5 to 10%">How far bank valuations commonly land below a well-run campaign.</Stat>

      <p>
        <strong>Online estimates</strong> (the automated numbers on the major portals and bank apps) are statistical models fed by past
        sales data. For a standard house in a suburb with plenty of recent sales, they can be within a few per cent. For renovated,
        unusual, rural or recently quiet markets, they can miss by 10 to 20 per cent in either direction. Most platforms publish a
        confidence band with the number. Read it. A “$910,000 estimate” with a band of $780,000 to $1,040,000 is telling you,
        politely, that it doesn’t know.
      </p>
      <p>
        The order of reliability for an owner-occupier sale, from least to most useful: online estimate, bank valuation, a
        well-evidenced agent appraisal, and finally the only number that actually matters, which is what a buyer signs for.
      </p>

      <h2>How agents actually build a price</h2>
      <p>
        A competent agent prices your home with a comparative market analysis: recent <em>sold</em> prices (not asking prices) for
        genuinely comparable properties, ideally within about a kilometre and the last three to six months, adjusted for land size,
        condition, parking, aspect and street. They’ll weigh current competition (what a buyer with your budget can buy instead this
        weekend) and buyer depth at your price point.
      </p>
      <p>
        Ask every appraising agent to show you the comparables behind their number. The quality of that evidence is the single best
        test of the appraisal, and of the campaign they’d run. Three settled sales of similar homes within a kilometre beats any
        amount of confidence at your kitchen table.
      </p>

      <h2>The two traps: underquoting and overquoting</h2>
      <p>
        <strong>Underquoting</strong> is advertising or quoting a price below the agent’s genuine estimate to pull a bigger crowd, then
        letting competition push the price up. It mostly burns buyers, but it can hurt you too: a campaign anchored too low can stall
        at the anchor if competition doesn’t materialise. NSW and Victoria both have specific underquoting laws. In NSW, the advertised
        price can’t be below the agent’s written estimate in your agency agreement. In Victoria, agents must publish a Statement of
        Information with an indicative selling price supported by three comparable sales. If an agent’s quoting strategy makes you
        uncomfortable, that discomfort is data. Our guide to <Link href="/guides/underquoting-laws-by-state">underquoting laws by
        state</Link> has the detail.
      </p>
      <p>
        <strong>Overquoting</strong> runs the other way and is aimed squarely at you. An agent “buys the listing” by appraising high,
        knowing you’ll pick the biggest number. Then comes <strong>conditioning</strong>: weeks of carefully relayed “buyer feedback”
        that the market thinks it’s overpriced, until you agree to a reduction down to what the agent privately believed all along.
        You’ve lost four weeks, your listing has gone stale, and the agent still collects commission. Conditioning is the most common
        and least discussed cost of choosing an agent on appraisal price alone.
      </p>

      <Box title="Watch for">
        <p>
          An appraisal that is more than about 10 per cent above the others, delivered with thin or cherry-picked comparables. Ask:
          “If you’re so confident in this price, will you accept a shorter agency agreement, or tie part of your commission to
          achieving it?” Watch how fast the confidence recalibrates.
        </p>
      </Box>

      <h2>Sanity-check the number yourself</h2>
      <p>Before any agent walks through your door, spend an evening building your own view:</p>
      <ol>
        <li>
          Pull every settled sale of a comparable property (same suburb, similar beds, baths, parking and land) from the past six
          months. Portal “sold” filters and state government sales data both work.
        </li>
        <li>Throw out the outliers: the un-renovated deceased estate, the architect rebuild, the main-road block.</li>
        <li>
          Adjust the survivors roughly for condition and land. Renovated kitchen and bathrooms might be worth 3 to 7 per cent in most
          suburbs; a busy road can cost 5 to 10.
        </li>
        <li>Note the original asking price against the final sale price for each. That gap is your suburb’s reality check.</li>
        <li>
          Land on a range, not a number. If your range is $820,000 to $870,000 and an agent says $950,000, someone needs to show their
          working.
        </li>
      </ol>
      <p>
        You will not be as accurate as a good local agent. You don’t need to be. You need to be accurate enough to recognise flattery
        when it’s holding a clipboard. Then <Ch n={3} guide="selling">Chapter 3</Ch> turns the price into what you’ll actually walk
        away with.
      </p>

      <Pull>You need to be accurate enough to recognise flattery when it’s holding a clipboard.</Pull>
    </>
  );
}
