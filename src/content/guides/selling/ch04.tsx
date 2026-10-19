import Link from "next/link";
import type { Chapter } from "../types";
import { Box, Ch, Pull, Stat } from "../parts";

export const chapter: Chapter = {
  guide: "selling",
  number: 4,
  step: "Present for the top buyer",
  standfirst:
    "Buyers decide in the first 30 seconds and spend the rest of the inspection confirming the decision. Spend your money where those 30 seconds happen, and present the home for the buyer most likely to pay the most.",
  callout:
    "Top-end homes are prepared for one person: the buyer most likely to pay the most. Every room is edited, lit and styled for that buyer, and defects are found and dealt with before the campaign, not discovered in the negotiation. The spend is small against the price; the discipline is the point.",
  checklist: [
    "Do the paint, light, street appeal and small broken things first",
    "Skip renovations done only to sell",
    "Declutter until the cupboards are half empty",
    "Decide on styling: a consultation, partial staging or full staging",
    "Book photography after every other job is finished",
    "Decide whether to commission your own building and pest report",
  ],
  cta: {
    kind: "plan",
    title: "Build your next-step plan",
    body: "Tell us where you’re up to and get your next three steps, in order, with the guides and tools for your state.",
    label: "Build my next-step plan",
    href: "/plan?j=selling&ss=preparing&from=selling-guide-ch4",
  },
  checked: "Costs are typical ranges as at mid-2026.",
  Body,
};

function Body() {
  return (
    <>
      <p>
        Presentation is the part of the campaign every buyer sees first. The goal isn’t a renovation. It’s removing every reason the
        top buyer has to discount, so the only conversation left is about price.
      </p>

      <h2>High-return fixes</h2>
      <p>The work that reliably returns more than it costs is cosmetic, fast and boring:</p>
      <ul>
        <li>
          <strong>Paint.</strong> Fresh neutral walls are the cheapest transformation in real estate. A few thousand dollars of painting
          routinely adds multiples of that in perceived value, because buyers mentally price “needs painting” at triple the actual
          quote.
        </li>
        <li>
          <strong>Street appeal.</strong> The front fence, letterbox, lawn edges, a pressure-washed driveway and a $60 pot by the door.
          Buyers form their offer range on the footpath.
        </li>
        <li>
          <strong>Light.</strong> Clean every window, lift wattage, replace dated fittings, trim whatever’s blocking the living-room
          sun. Photographers and buyers both buy light.
        </li>
        <li>
          <strong>Minor kitchen and bathroom refreshes.</strong> New tapware, handles, regrouted tiles, a resurfaced benchtop. The aim is
          “nothing to do here”, not “newly renovated”.
        </li>
        <li>
          <strong>Fix the small broken things.</strong> Dripping taps, sticky doors, cracked switch plates, the gate that doesn’t latch.
          Each one whispers “what else haven’t they maintained?”
        </li>
      </ul>

      <Pull>Buyers form their offer range on the footpath.</Pull>

      <h2>Money pits</h2>
      <p>
        Big renovations done specifically for sale rarely pay. A $60,000 kitchen might add $40,000 to the price; the buyer would
        rather have chosen their own benchtop. Pools, full bathroom gut-jobs, extensions and structural work almost never recover their
        cost on a pre-sale timeline, and they delay your campaign by months. The rule: renovate to live, present to sell. If a room is
        genuinely dated, it is usually cheaper to price it honestly than to rebuild it for a stranger’s taste. Our guide to{" "}
        <Link href="/guides/what-to-fix-before-selling-a-house">what to fix before selling</Link> goes room by room.
      </p>

      <Stat value="$40,000">What a $60,000 pre-sale kitchen might add to the price.</Stat>

      <h2>Decluttering is free and worth more than most renovations</h2>
      <p>
        Half-empty cupboards read as ample storage. Full ones read as “this house is too small”, even to buyers with twice your stuff.
        Clear benchtops, thin out furniture so rooms breathe, take down the family photo wall (buyers need to imagine their own life in
        the frame), and hire a storage unit for a month if you must. It costs $150 to $400 and is the best presentation spend per dollar
        available.
      </p>

      <h2>When staging pays</h2>
      <p>
        Professional styling earns its keep most clearly in three situations: vacant properties (empty rooms photograph small and echo
        at opens), tired or dated interiors where good furniture redirects attention, and competitive metro markets above roughly the
        suburb median, where buyers compare your listing photos against a feed of styled ones. Industry claims about staging adding 5
        to 10 per cent to sale prices are vendor-funded and best taken with salt, but the asymmetry is real: on a $900,000 home, staging
        needs to add less than half a per cent to break even. For a well-furnished, well-kept home, a consultation plus partial staging
        usually captures most of the benefit at a third of the cost. Our guide to{" "}
        <Link href="/guides/home-staging-cost-australia">home staging costs</Link> has the price ranges.
      </p>

      <h2>Photography timing</h2>
      <p>
        Book photography <strong>after</strong> every other job is finished, not before the last trades visit. Brief the photographer on
        your property’s best hour: north-facing living areas mid-morning, west-facing gardens late afternoon, and a twilight shoot if
        the facade or view earns it. If you’re planning a spring campaign, consider shooting the garden at its peak even if you list
        weeks later. And shoot before the signboard goes up; nothing dates a “fresh” listing like its own For Sale sign in the hero
        photo.
      </p>

      <h2>The pre-sale building and pest inspection</h2>
      <p>Commissioning your own building and pest report before listing ($400 to $800 combined) is one of the genuinely contested calls in selling.</p>
      <p>
        <strong>The case for:</strong> no surprises mid-campaign. You learn about the termite damage or the dodgy subfloor while you
        can still fix it cheaply or price it calmly, rather than at the negotiating table where every defect costs triple. In the ACT,
        a building and pest report is part of the mandatory pre-listing contract pack anyway, and some sellers elsewhere offer their
        report to buyers to keep momentum up and conditions out of contracts.
      </p>
      <p>
        <strong>The case against:</strong> the cost, and the knowledge itself. Once you know about a defect, you cannot honestly
        characterise the property as though you don’t, and in some states (notably Queensland under its disclosure regime, discussed
        in <Ch n={9} guide="selling">Chapter 9</Ch>) your formal disclosure obligations are growing. Serious buyers will commission
        their own report regardless and may not trust yours.
      </p>
      <p>
        The sensible middle: if your home is older than 30 years, has had past termite activity in the area, or you simply don’t know
        its condition, get the report. Walking into a negotiation with less information than the other side is how sellers lose five
        figures in an afternoon.
      </p>

      <Box title="Watch for">
        <p>
          Trades and stylists recommended exclusively by your agent without alternatives. Most agent referrals are honest, and some
          agencies disclose referral fees, but get one outside quote for any job over $1,000. If the agent’s painter is 40 per cent
          dearer, you’ve learned something about the rest of the advice.
        </p>
      </Box>
    </>
  );
}
