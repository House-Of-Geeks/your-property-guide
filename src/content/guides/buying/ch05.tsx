import Link from "next/link";
import type { Chapter } from "../types";
import { Box, Ch, Pull, Stat } from "../parts";

export const chapter: Chapter = {
  guide: "buying",
  number: 5,
  step: "Inspect like a professional",
  standfirst:
    "An open home is staged to be glanced at. Thirty disciplined minutes see through most of it, and the right $600 report sees through the rest.",
  callout:
    "Staging the home to be glanced at. Fresh paint, styled rooms, a timed open and a photo shoot that avoids the neighbours are all standard campaign tools, and none of them are lies. They are why your 30-minute checklist and an independent report matter.",
  checklist: [
    "Run the 10-point check at every serious inspection",
    "Walk the street at a different hour, and talk to a neighbour",
    "Commission your own building and pest report, and ring the inspector",
    "Units: read the strata records, the sinking fund and two years of minutes",
    "Know your walk-away defects before you fall for the kitchen",
  ],
  cta: {
    kind: "plan",
    title: "Build your next-step plan",
    body: "Tell us where you’re up to and get your next three steps, with the checklists and calculators for your state.",
    label: "Build my next-step plan",
    href: "/plan?j=buying&bs=searching&from=buying-guide-ch5",
  },
  checked: "Inspection and repair costs are typical ranges as at mid-2026.",
  Body,
};

function Body() {
  return (
    <>
      <p>
        Professional buyers walk a property looking for reasons to say no. Amateurs walk it imagining their furniture. Both notice the
        light and the layout; only one of them checks under the sink. The discipline below costs nothing and routinely saves five figures.
      </p>

      <Box title="The 30-minute inspection: 10 checks" tone="warm">
        <ol>
          <li>
            <strong>Walk the outside first.</strong> Cracks in brickwork wider than a couple of millimetres, especially stepped cracks above
            windows. Check where the ground drains: water running toward the house is a structural problem on layaway.
          </li>
          <li>
            <strong>Look up at every ceiling.</strong> Stains, fresh patches of paint in one spot, sagging plaster. A roof leak repainted
            last week is still a roof leak.
          </li>
          <li>
            <strong>Open and close every door and window.</strong> Sticking and uneven gaps can mean movement in the frame or footings, not
            humidity.
          </li>
          <li>
            <strong>Smell every room, especially wet areas.</strong> Mould and damp announce themselves; so does the air freshener hiding
            them. Closed windows on a mild day are a tell.
          </li>
          <li>
            <strong>Run the taps and flush the toilets.</strong> Water pressure, drainage speed, hot water delay. Look under sinks for
            swollen cabinetry and fresh silicone.
          </li>
          <li>
            <strong>Check the switchboard.</strong> Old ceramic fuses mean rewiring money. Note the hot water system’s age plate while
            you’re there; ten years is a countdown.
          </li>
          <li>
            <strong>Press the bathroom floor and tap the tiles.</strong> Movement, drummy tiles or spongy floors near showers point to
            waterproofing failure, one of the costliest defects in any home.
          </li>
          <li>
            <strong>Inspect the subfloor and ceiling cavity access.</strong> You may only manage a glance, but a torch into the subfloor
            reveals damp, piers and past termite treatment plugs faster than any brochure.
          </li>
          <li>
            <strong>Audit what the photos avoided.</strong> Wide-angle listing shots skip the neighbouring block, the power lines, the
            slope. Whatever wasn’t photographed is your first question.
          </li>
          <li>
            <strong>Walk the street at a different hour.</strong> Friday 5.30pm tells you about traffic and parking; Saturday 11am told you
            nothing. Talk to a neighbour: nobody reviews a street more honestly.
          </li>
        </ol>
      </Box>

      <h2>Building and pest: the best $600 in the deal</h2>
      <p>
        A combined building and pest inspection ($400 to $800) is a visual, non-invasive assessment by a licensed inspector: structure,
        roof, subfloor, moisture readings, termite evidence. Commission your own, attend in person, and ring the inspector afterwards; the
        ten-minute phone call is franker than the written report, which is drafted with lawyers in mind. Read the whole document, not the
        summary, and remember what it is not: inspectors don’t open walls, move furniture or test appliances, so “no visible evidence”
        means exactly that.
      </p>
      <p>
        Don’t skip the report on new builds or renovated homes; fresh paint hides more than old wallpaper ever did. And treat the seller’s
        own report, if offered, as a starting point rather than a substitute. It may be accurate, but the inspector was answering to the
        other side. Our <Link href="/guides/building-pest-inspection">building and pest inspection guide</Link> covers what to ask.
      </p>

      <h2>Units: the strata report is the building’s diary</h2>
      <p>
        For apartments and townhouses, the strata (body corporate) records search, $250 to $400, matters as much as the building report.
        You’re looking for: the <strong>capital works (sinking) fund balance</strong> against the building’s age and size; any{" "}
        <strong>special levies</strong> struck or flagged; meeting minutes mentioning water ingress, concrete spalling, combustible cladding
        or defect disputes with the builder; insurance currency; and the ratio of owner-occupiers to renters. A healthy building has boring
        minutes and a fat fund. A $400,000 unit above a $40,000-per-lot remediation problem is not a bargain at any discount.
      </p>

      <h2>The red flags that cost five figures</h2>
      <p>
        Some defects are negotiating points; some are exits. The expensive ones cluster in five families: <strong>water</strong> (failed
        waterproofing, rising damp, poor drainage; bathroom rebuilds start around $15,000), <strong>structure</strong> (underpinning and
        restumping commonly run $15,000 to $40,000), <strong>termites</strong> (active infestation plus structural repair regularly exceeds
        $20,000), <strong>roofing</strong> (full replacement $15,000 to $30,000), and <strong>old services</strong> (rewiring or replumbing
        a whole house, $10,000 to $25,000 each). None of these is automatically a deal-killer; all of them are deal-repricers, and the
        seller knows it the moment your report does.
      </p>

      <Stat value="$20,000+">What active termite damage plus structural repair regularly costs.</Stat>

      <h2>When to walk</h2>
      <p>
        Walk when the defect is structural and unquantified (no engineer’s report, no fixed price), when the seller blocks reasonable
        inspection access, when the strata minutes show a defect dispute with no funded plan, or when fixing the problem would cost more
        than the discount you can realistically negotiate. There is always another property. Nobody believes that during the campaign;
        everybody knows it a year later.
      </p>

      <Pull>Every defect found before exchange is a discount. Every one found after is a bill.</Pull>

      <Box title="First home">
        <p>
          The reports are where stretched budgets cut corners, and it’s exactly backwards: you have the least spare cash to absorb a
          surprise, so you can least afford to skip the $600 that prevents one. Budget for reports on two or three properties across your
          search. Losing $600 on a house someone outbids you for stings; finding the restumping job after settlement ruins you.
        </p>
      </Box>

      <Box title="Investor">
        <p>
          Read the report twice: once for risk, once for leverage and tax. Documented defects are your negotiation evidence (
          <Ch n={7} guide="buying">Chapter 7</Ch>), and the capital works you do after settlement feed your depreciation schedule. But weigh
          repair downtime honestly: every week the property can’t be tenanted is yield you quoted to yourself and won’t receive.
        </p>
      </Box>
    </>
  );
}
