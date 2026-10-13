# Static hub pages serving their build-time placeholder (13 Oct 2026)

Baseline for the change that moves `/states`, `/postcodes`, `/compare`,
`/off-market` and `/data` from static ISR to render-on-request with cached
data (rule R2 of the September 2026 fix review).

## The cause

Each page was a static ISR route (`revalidate` 1 day, `/data` 1 hour). The
build is deliberately DB-free (460c601), so each page's DB read was guarded
with `NEXT_PHASE === "phase-production-build"` and the build rendered an empty
placeholder. ISR serves that prerender until its window passes, which restarts
with every deploy. The post-deploy warm job only GETs pages, and a GET inside
the window serves the cached placeholder. Production deploys on 13 Oct included 06:51,
07:25 and 08:15 UTC.

## Live, 13 Oct 2026, about 10:50 UTC

`live.csv` has one row per page. All five answered `x-nextjs-prerender: 1`.

- `/states`: 28 words in `<main>`, no state card, no link to a state page.
  Expected (production DB, read-only): eight cards, e.g. NSW 5,198 suburbs,
  average of 1,883 published medians $1,354,331, +3.7% average change.
- `/postcodes`: 27 words, "0 postcodes, grouped by state", no postcode link.
  Expected: 2,661 postcodes in eight states (NSW 616, VIC 691, QLD 437, WA 400,
  SA 352, TAS 114, ACT 27, NT 24), one link each.
- `/off-market`: "0 current listings". The DB holds 0 off-market rows, so the
  figure was true that day. A listing added after a deploy would have stayed
  hidden until the window passed.
- `/data`: real counts at the time (17.7K+ suburbs, 9,693 schools), served
  from a regeneration at 09:18:27 UTC, one hour after the 08:15 deploy. For
  that hour, the build render printed 0 for every count under "Every number,
  sourced and live".
- `/compare`: real rails at the time (97 suburb links), from a render at
  08:18:04 UTC, three minutes after the deploy. Nothing found in the code
  revalidates it. Its build render (local `next build`, DB unreachable) has
  only the nine curated pairs: "Top comparisons in every state" and "Top
  suburbs by state" are headings over empty lists, 88 links short (64 pairs
  and 24 suburbs).

## After (local `next start` against the dev DB, read-only)

`/states` 8 cards (117 words), `/postcodes` 2,660 links (2,734 words),
`/compare` 73 comparison links and 24 suburb links, `/data` real counts,
`/off-market` its real count. All five render per request (`ƒ` in the build's
route table). Repeat requests are served from the data cache in 6 to 34 ms.
