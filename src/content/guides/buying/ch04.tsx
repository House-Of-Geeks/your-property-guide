import Link from "next/link";
import type { Chapter } from "../types";
import { Box, Ch, Pull, Stat } from "../parts";

export const chapter: Chapter = {
  guide: "buying",
  number: 4,
  step: "Choose the market",
  standfirst:
    "Suburb choice does more for your result than anything you’ll negotiate later. Most buyers spend more time choosing the fridge.",
  callout:
    "Selling the suburb as hard as the house: the school, the café strip, the growth story. The suburb brochure is part of the campaign. Check every claim against the data, and check the catchment on the education department’s map, not the flyer.",
  checklist: [
    "Shortlist three to five suburbs from days on market, listings, clearance and discounting",
    "Check that the infrastructure in the growth story is funded, not just promised",
    "Look at land share of value, not just the median",
    "Confirm any school catchment on the official map",
    "Set portal alerts for sold prices, not just new listings",
  ],
  cta: {
    kind: "tool",
    title: "Find suburbs that fit",
    body: "A 30-second quiz that scores six suburbs against your budget, your priorities and your stage.",
    label: "Find my suburb",
    href: "/find-your-suburb?from=buying-guide-ch4",
  },
  checked: "As at mid-2026.",
  Body,
};

function Body() {
  return (
    <>
      <p>
        Every listing comes with a story about its suburb. Your job is to read the suburb’s numbers before you read its brochure, so you
        choose the market yourself instead of being sold one.
      </p>

      <h2>The data that matters (and the noise that doesn’t)</h2>
      <p>
        Suburb medians make headlines and mislead buyers. A median jumps when a few expensive homes sell and slumps when a unit block
        settles; it tells you what sold, not what anything is worth. The numbers that actually describe a market are the same four sellers
        should watch, read from your side of the table:
      </p>
      <ul>
        <li>
          <strong>Days on market.</strong> Under 30 days, sellers have the leverage and you’ll need to move fast and clean. Past 60, the
          leverage is yours.
        </li>
        <li>
          <strong>Auction clearance rates</strong> in auction cities. Sustained clearance above 65 per cent means crowds and overshooting
          guides; below 55, passed-in properties and negotiable vendors.
        </li>
        <li>
          <strong>Total listings.</strong> Rising stock month on month means more choice and softer prices. Falling stock means the
          opposite, whatever the headlines say.
        </li>
        <li>
          <strong>Vendor discounting.</strong> The average gap between asking and sale price. A wide gap is a market where asking prices
          are fiction; calibrate your offers accordingly.
        </li>
      </ul>
      <p>
        All four are free on the portals’ suburb pages, and our <Link href="/suburbs">suburb profiles</Link> and{" "}
        <Link href="/compare">suburb comparison</Link> put the rest side by side. An hour with them beats a month of weekend drive-bys.
      </p>

      <h2>Growth signals worth trusting</h2>
      <p>Nobody reliably picks the next boom suburb, but the ingredients of growth are not mysterious:</p>
      <ul>
        <li>
          <strong>Population pressure.</strong> People arriving faster than dwellings are built. State population projections and building
          approval counts are both public.
        </li>
        <li>
          <strong>Infrastructure that is funded, not promised.</strong> A train line under construction moves prices; a corridor study does
          not. Check the project’s status, not the press release.
        </li>
        <li>
          <strong>Land share of value.</strong> Land appreciates; buildings depreciate. A house where land is 60 to 70 per cent of the value
          has more growth engine than an apartment where it’s 10 per cent.
        </li>
        <li>
          <strong>The ripple effect.</strong> Suburbs bordering an expensive one inherit its priced-out buyers. If the neighbour has run hard
          and yours hasn’t, the gap usually closes.
        </li>
        <li>
          <strong>Supply constraint.</strong> Water, hills, heritage overlays and built-out streets limit new stock. Growth corridors with
          unlimited flat land must share their growth with every new estate.
        </li>
      </ul>

      <h2>School catchments: the boundary is the price</h2>
      <p>
        Sought-after public school catchments carry measurable premiums; buyers routinely pay 5 to 10 per cent more for an address inside
        the zone, and agents price accordingly. Two cautions. Check the <strong>official</strong> catchment map on the education
        department’s site, not the agent’s flyer, because “close to” and “zoned for” are different products. And remember boundaries get
        redrawn; a premium paid for a zone is a premium that can be rezoned away.
      </p>

      <Stat value="5 to 10%">The premium buyers routinely pay inside sought-after school catchments.</Stat>

      <Pull>Buy the suburb’s trajectory, not its brochure.</Pull>

      <Box title="First home">
        <p>
          When the budget forces a compromise, compromise in this order: dwelling first, position second, suburb last. A dated kitchen is
          fixable; a flight path is not. The modest house on a good street in a rising suburb beats the renovated one backing the arterial
          road, every time, and the market knows it even when your heart doesn’t.
        </p>
      </Box>

      <Box title="Investor">
        <p>
          Decide the yield-versus-growth balance before you shortlist. Gross yield is annual rent over price; net yield, after rates,
          insurance, management and maintenance, typically lands 1 to 1.5 points lower, and strata fees drag it further. High-yield regional
          markets carry vacancy and single-industry risk; low-yield blue chip costs you cash flow every month while you wait for growth.
          Check the vacancy rate (under 2 per cent is tight) and what fraction of the suburb is renters: a deep rental market protects you
          between tenants. Our <Link href="/rental-yield-calculator">rental yield calculator</Link> does the arithmetic.
        </p>
      </Box>

      <Box title="Downsizer">
        <p>
          Audit amenity on foot, not on the map: chemist, GP, supermarket, cafe, transport, all within a comfortable walk, plus a lift if
          you’re above the first floor and level entry everywhere. Then audit the building as hard as the apartment: strata fees, the
          capital works fund balance, and the last two years of meeting minutes (<Ch n={5} guide="buying">Chapter 5</Ch>). You’re choosing
          the committee and the maintenance plan as much as the floorplan.
        </p>
      </Box>
    </>
  );
}
