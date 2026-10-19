import Link from "next/link";
import type { Chapter } from "../types";
import { Box, Ch, Pull, Stat } from "../parts";

export const chapter: Chapter = {
  guide: "selling",
  number: 1,
  step: "Know your number",
  standfirst:
    "The honest answer is that nobody picks the top of the market, including the people paid to talk about it. What you can do is read the conditions in front of you, then time the campaign to your property.",
  callout:
    "At the top end, nobody waits for the market to rescue a sale. The campaign is timed to the property: launched when it shows best and competing stock is thin, with the likely buyers mapped before the first photo is taken. The calendar is a factor, never the plan.",
  checklist: [
    "Pull days on market, clearance rates, listings and discounting for your suburb and property type",
    "Count how many comparable homes are listed against yours right now",
    "Decide whether to sell first or buy first, and price the cost of each",
    "Pick a launch window from your property’s best season and the local competition",
    "Have a broker model bridging finance before you rely on it",
  ],
  cta: {
    kind: "plan",
    title: "Build your next-step plan",
    body: "Three quick questions about where you’re selling and when, and your next three steps write themselves, with the tools and guides for your state.",
    label: "Build my next-step plan",
    href: "/plan?j=selling&from=selling-guide-ch1",
  },
  checked: "Figures are typical ranges as at mid-2026.",
  Body,
};

function Body() {
  return (
    <>
      <p>
        Most sellers start with the wrong question. They ask whether the market is right, when the bigger lever is whether their
        campaign is. A good market won’t save a weak campaign. Timing still matters, though, and
        the data you need to judge it is free, local, and takes about an hour to read properly.
      </p>
      <p>
        Every year, thousands of Australians delay a sale waiting for a better market, and thousands more rush one because a neighbour
        got a big number. Both groups are usually reacting to headlines rather than data.
      </p>

      <h2>Read your suburb, not the nation</h2>
      <p>
        National price indexes are close to useless for an individual sale. Your market is your suburb, your property type, and your
        price bracket. A three-bedroom house in a family suburb and a one-bedroom unit two streets away can be moving in opposite
        directions at the same time.
      </p>
      <p>Four numbers tell you most of what you need to know:</p>
      <ul>
        <li>
          <strong>Days on market.</strong> How long comparable properties are taking to sell. Under 30 days in most capitals suggests a
          seller’s market. Past 60, buyers are in charge.
        </li>
        <li>
          <strong>Auction clearance rates</strong> (if you’re in an auction city). Sustained clearance above roughly 65 per cent
          generally favours sellers. Below 55 per cent, campaigns are stalling.
        </li>
        <li>
          <strong>Total listings.</strong> If the number of comparable homes for sale in your suburb is rising month on month, you have
          more competition and less pricing power.
        </li>
        <li>
          <strong>Vendor discounting.</strong> The average gap between first asking price and final sale price. A widening gap means
          sellers are overreaching.
        </li>
      </ul>
      <p>
        You can pull all four from the big portals’ suburb profile pages, your state’s valuer-general data, our{" "}
        <Link href="/suburbs">suburb profiles</Link>, or simply by watching what sells near you for six weeks. If an agent quotes
        these numbers without being asked, that’s a point in their favour.
      </p>

      <Stat value="60 days">Past this many days on market, buyers are in charge.</Stat>

      <h2>Seasonality: spring is crowded for a reason</h2>
      <p>
        Australian listings peak in spring. September to November typically brings the year’s biggest wave of new stock, with a
        second, smaller surge in late February and March once everyone is back from holidays. Winter and the December-January stretch
        are the quiet months.
      </p>
      <p>
        Spring’s reputation is partly self-fulfilling: gardens look better, buyers are active, and everyone has been told spring is
        the time to sell. The catch is that everyone else got the same memo. A well-presented home in August or early February often
        faces half the competition it would in October, in front of buyers who have been starved of stock for months.
      </p>
      <p>
        The practical rule: launch your campaign when your property shows well and your local competition is thin, not when the
        calendar says so. A north-facing living room photographs beautifully in winter light. A jacaranda-lined street earns its keep
        in November. Work with what you have.
      </p>

      <h2>Sell first, or buy first?</h2>
      <p>
        If you’re selling to buy again, this is a bigger decision than timing the market, because you’re effectively trading in the
        same market you’re buying in. If prices move, they move on both sides of your ledger.
      </p>
      <p>
        <strong>Selling first</strong> gives you a known budget, a stronger negotiating position as a cash-ready buyer, and no risk of
        carrying two mortgages. The cost is uncertainty about where you’ll live: you may need to rent, store furniture, or negotiate
        a long settlement or leaseback. In a rising market you can also find your sale proceeds buying less by the time you purchase.
      </p>
      <p>
        <strong>Buying first</strong> means you move once and you know exactly where you’re going. The risk is the other way: if your
        sale takes longer or lands lower than expected, you’re funding two properties and negotiating your sale under time pressure,
        which buyers and their agents can smell. In a falling or slow market, buying first is the more dangerous order of operations.
      </p>
      <p>
        A rough rule: in a hot market with thin stock, buying first is more defensible because your own sale is the easy part. In a
        soft market, sell first and rent if you must. Our guide to <Link href="/guides/sell-first-or-buy-first">selling first or
        buying first</Link> works through both with examples.
      </p>

      <Pull>Paying three months’ rent is cheaper than knocking $40,000 off your price because settlement is looming.</Pull>

      <p>
        <strong>Bridging finance, briefly.</strong> A bridging loan covers the gap when you buy before you sell. The lender takes
        security over both properties, charges interest (often capitalised, meaning it compounds onto the loan) on the combined
        “peak debt”, and typically expects the old property sold within 6 to 12 months. It works, but it is not cheap, and the clock
        pressure it creates is exactly the pressure that produces discounted sales. Get the numbers modelled by a broker before you
        rely on it (our <Link href="/bridging-loan-calculator">bridging loan calculator</Link> shows the shape of it), and treat it as
        a backstop rather than a plan.
      </p>

      <Box title="Watch for">
        <p>
          Agents who tell you the market is about to take off, every season, every year. Listing volume is how agencies eat. An
          agent’s incentive is for you to list soon and sell fast, which overlaps with your interests but is not identical to them.
          Trust the suburb data over the pep talk. <Ch n={2} guide="selling">Chapter 2</Ch> shows you how to build your own number
          from it.
        </p>
      </Box>
    </>
  );
}
