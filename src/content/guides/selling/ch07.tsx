import type { Chapter } from "../types";
import { Pull, Stat } from "../parts";

export const chapter: Chapter = {
  guide: "selling",
  number: 7,
  step: "Plan the marketing",
  standfirst:
    "Most marketing budgets contain three items that sell houses and five that mainly promote the agency. Learn to tell them apart, then plan the first few weeks around the buyers most likely to want your home.",
  callout:
    "Experienced sellers have the photography, floorplan, copy and price finished before the listing goes live. The first fortnight brings the biggest audience, so they treat it as the most important stretch of the sale rather than a warm-up. Anything that can be settled at the kitchen table is settled before launch, not tested on the market.",
  checklist: [
    "Choose the portal tier from how many comparable homes are listed against yours",
    "Have professional photos, a floorplan and specific copy ready before launch",
    "Go live late in the week to catch the weekend’s saved-search alerts",
    "Ask for written feedback after every open: groups through, repeat visits, contract requests",
    "Launch at the price you’d accept, not the price you’d love",
    "If the first fortnight brings traffic but no offers, reprice decisively in week three",
  ],
  cta: {
    kind: "agreement-check",
    title: "Check the marketing spend before you sign",
    body: "Marketing spend is one of the four parts of the agency agreement worth checking: what it buys, when you pay and whether you pay if it doesn’t sell. We’ll go through it with you, free.",
    label: "Book my agreement check",
    href: "/agreement-check?from=selling-guide-ch7",
  },
  checked: "Portal and marketing costs are typical ranges as at mid-2026.",
  Body,
};

function Body() {
  return (
    <>
      <p>
        The launch is when your home reaches the most buyers at once. Every active buyer with a saved search hears about it the day it
        goes live, so the photos, the floorplan, the copy and the price all need to be right on day one. Plan the launch around the
        buyers most likely to want this home.
      </p>

      <h2>The portals: where the buyers actually are</h2>
      <p>
        In Australia, property marketing means realestate.com.au first, Domain second, everything else a distant third. Almost every
        active buyer has saved searches on at least one portal, so your real marketing decision is which <strong>listing tier</strong> to
        buy.
      </p>
      <p>
        Both portals sell tiered visibility. On realestate.com.au, the top tiers (the “Premiere”-style products) put your listing larger,
        higher in search results and with more photos, and refresh its position; standard listings sit lower and sink as new stock
        arrives. Domain’s tiers work the same way. Pricing is dynamic and suburb-based: a top-tier listing can cost $1,000 to $2,000 in a
        cheaper regional market and $3,000 to $5,000 or more in expensive metro suburbs.
      </p>
      <p>
        Is the top tier worth it? In a competitive suburb with dozens of active listings, usually yes: visibility decays fast and the
        premium is small against the price of going stale. In a tightly held suburb where anything listed gets seen, a mid-tier on the
        main portal plus a standard Domain listing often performs identically. What’s rarely worth it: print advertising (except in some
        regional markets and the prestige bracket, where it still functions), and branded extras that promote the agency more than the
        address.
      </p>

      <h2>The assets that do the selling</h2>
      <ul>
        <li>
          <strong>Photography.</strong> The hero shot decides whether a buyer taps your listing at all. Pay for a professional, shoot at
          the property’s best hour, and lead with the strongest image, which is usually the facade or the main living space, not the
          bathroom. Eight to twelve excellent photos beat twenty-five mediocre ones.
        </li>
        <li>
          <strong>Floorplan.</strong> Arguably the highest-value $250 in the whole campaign. Buyers consistently rank floorplans among the
          first things they look for, and serious buyers filter out listings without one. Treat it as essential.
        </li>
        <li>
          <strong>Copy.</strong> Specifics sell: north-facing rear, 600 metres to the station, rewired 2023, 580 square metres. Adjective
          soup (“stunning”, “boasting”, “oozing charm”) is white noise buyers learned to skim years ago. Mention the school catchment by
          name if it matters; it often matters more than the kitchen.
        </li>
        <li>
          <strong>Video and drone.</strong> Worth it for properties where land, position or flow is the story (acreage, waterfront, view
          corridors, big blocks). For a standard suburban house, a good photo set and floorplan do the job, and the video budget is better
          spent on the portal tier.
        </li>
      </ul>

      <Stat value="$250">Arguably the highest-value marketing spend: the floorplan.</Stat>

      <h2>Open homes versus private inspections</h2>
      <p>
        Open homes are efficient: every interested buyer through in 30 minutes, and a busy open shows each buyer that others are
        interested too (“who were all those people?”). Private inspections suit tenanted properties, prestige homes and
        security-conscious sellers, and
        they give the agent longer with each genuine buyer. Most good campaigns run both: scheduled Saturday opens plus midweek privates
        for the serious. One practical note: ask your agent for written feedback after every open, including the count of groups through
        and any contract requests. The pattern across the first three opens is your clearest early read on how the sale is going.
      </p>

      <h2>The first-two-weeks rule</h2>
      <p>
        A new listing gets its biggest audience in its first two weeks, because every buyer with a saved search is notified the day it
        goes live. These are also your most ready buyers: the ones who’ve inspected twenty homes, missed out twice, and know exactly
        what your property is worth. If your price is right, they act fast.
      </p>
      <p>
        Miss that window with an ambitious price and the listing starts to age in public. Buyers can see days on market and price cuts,
        and both make them more cautious. The longer it sits, the more every enquiry begins with “what’s wrong with it?” and every offer
        arrives discounted accordingly.
      </p>

      <Pull>Launch at the price you’d accept, not the price you’d love.</Pull>

      <p>
        The practical consequence is clear: <strong>launch at the price you’d accept, not the price you’d love.</strong> An
        ambitious figure isn’t a free option; it uses up your most valuable fortnight. If you and your agent disagree on price, resolve
        it before launch, not via a public reduction in week four. And if the first two weeks bring solid traffic but no offers, that’s
        usually the market’s answer rather than bad luck. Reprice decisively in week three rather than trimming 1 per cent a month
        until spring.
      </p>
    </>
  );
}
