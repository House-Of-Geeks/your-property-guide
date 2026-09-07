# SEO fix list — September 2026

Source: "Your Property Guide Search Review" (Profit Geeks, 5 Sep 2026), also at
`~/Desktop/SEO Checks/YourPropertyGuide-Search-Review-ProfitGeeks.html`.
Finding numbers in brackets refer to that report. Tags: [code] repo change,
[content] copy to draft and approve, [you] console or outreach action.
Tick items off as they ship.

> **Gate.** Do not action an item until its row in the sign-off table of
> `docs/strategy/seo-fix-review-2026-09.html` (also in ~/Desktop/SEO Checks) says Approve.
> That review changed two items on inspection: 4 (rental-market and school routes are
> uncached and rendered per request; fix those first) and 20 (the eight stamp-duty state
> guides already exist; upgrade them, do not create new URLs). Rules R1–R13 in the review
> apply to every item: baseline before, one template change per fortnight, cohort rollout
> by state, URLs never change, every number through a tested gate.

## Guardrails and crawl (week 1–2)

- [x] 1. [code] REFRAMED 5 Sep 2026 after the production audit (docs/seo-baselines/2026-09-05/data-audit/summary.md):
      no region gate (it would suppress Toorak, New Farm, Byron Bay). Instead: (i) verify the sales-nsw aggregate
      window, (ii) re-run sales-nsw/vic/sa/abs to restore provenance clobbered by the 1 Jul cron (NSW has shown
      no prices since), (iii) stop the census population fallback, (iv) label ABS SA2 medians, (v) render provenance.
      Step (i) DONE: PR #6 (8c1d91f) NSW house median = nature R with no unit number; daysOnMarket no longer
      written. PR #7 (4a4eff3) --from-rows aggregate + auto-fallback + updatedAt stamp.
      Step (ii) DONE 6 Sep 2026: sales-nsw (3,034), sales-sa (373, Q2 2026), sales-abs (735, 2024 data) run
      against production; sales-vic blocked at source. Priced suburbs 1,847 → 4,719. Pages purged + IndexNow pinged.
      Step (iii) DONE 7 Sep 2026: PR #8 — 3,998 postcode-level census copies cleared (population, median age),
      67 NSW 2540 regions → Shoalhaven, POA seed retired behind --allow-postcode-level. Dry-run CSV in
      docs/seo-baselines/2026-09-07/data-audit/. Remaining: (iv) label ABS SA2 medians, (v) provenance rendering + minimum-count rule.
      Steps (iv)+(v) DONE 7 Sep 2026: PR #9 (7d16701) — provenance line under every median, ABS SA2 figures
      labelled as statistical-area medians (intro, narrative, FAQ), medians on <5 recorded sales withheld with
      the count shown (1,268 withheld: NSW 1,153, SA 115; 3,451 published). Item 1 complete apart from follow-ups.
      New follow-up: NSW unit medians (e.g. Bondi $538,560) are not produced by sales-nsw and predate the
      feeds; give medianUnitPrice the same provenance treatment or withhold it where the source has none.
      Follow-ups from the run:
        - DONE 7 Sep 2026 — PR #19 (a3ee8da): sales-abs never overwrites a suburb whose statsSource is
          sales-nsw, sales-vic or sales-sa (it overwrote 185 NSW suburbs on 6 Sep; fixed by re-running NSW).
        - 1,153 NSW medians rest on 1–4 sales: add a minimum-count display rule (step v, provenance rendering).
        - Valuer General (NSW) and Land Victoria now block automated downloads: 2026 NSW row capture and VIC
          quarterly medians need another route (manual download into .cache, or a browser-session fetch).
      Original scope: Provenance + plausibility gate on suburb stats: source/sample/period under every
      median; hold medians >25% off region; no dollar figure in meta/opening from proxy sources;
      suppress population/region for suburbs missing from 2021 ABS SAL. (03)
- [ ] 2. [code] New suburb title + description in `src/lib/utils/seo.ts`:
      `{Suburb} {State} {Postcode}: House Prices, Rent, Schools & Suburb Profile`;
      description leads with median + 12-month change + source month. (01)
- [x] 3. DONE 7 Sep 2026 — PR #11 (f725a0e): snapshot band under the hero (median house with 12-month change,
      median unit, weekly rent, gross yield, population, walk score; 3–6 tiles; provenance line per data family)
      and the brief opens with "{Suburb}'s median house price is $X (median of N sales, source, period)"; then
      PR #12 (c9a26a7): days on market withheld (no feed produces it), rent and yield tiles only when the rent's
      source is known. Verified on production (Bondi, Morayfield, Surfers Paradise, Toorak, Buderim).
      NSW rents DONE 7 Sep 2026 — PR #13 (0e7bd6b) + PR #14 (9fe96eb) + production run: house rent = DCJ
      House/Total median, unit rent = Flat/Unit/Total median, one row per suburb per published postcode
      (rules in `rental-nsw-rules.ts`, tested), Suburb columns set with 0 where DCJ withholds, legacy
      postcode-named rows deleted, workbook found from the DCJ report page (files renamed; the feed had been
      stuck on December 2025), abs-census barred from overwriting any rental feed's rents. 4,072 suburbs /
      413 postcodes to June 2026; Bondi $1,800 / $1,000 / 2.2% yield. The band shows NSW rent and yield again.
      Residuals:
        - DONE 7 Sep 2026 — PR #15 (d859a77) + production run: census rent proxies cleared from the 1,192
          NSW suburbs in postcodes DCJ does not publish (rollback CSV in docs/seo-baselines/2026-09-07/
          data-audit/); abs-census never writes a rent in a feed state again. VIC (3,279), QLD (3,394)
          and SA (1,338) cleared the same way on 7 Sep 2026 (rollback CSVs alongside). Every rent on the
          site now comes from a bond-data feed or is shown as unknown.
        - DONE 7 Sep 2026 — PR #16 (e0854b7), PR #17 (cfe8570) + production run: Toorak's $688 was a leftover
          row from the feed's single-sheet April version (all-properties median) winning a same-quarter tie
          in the page's lookup; 77 VIC suburbs affected. Lookups now break ties by update time, the feed never
          falls back to "All properties", legacy rows deleted (rollback CSV alongside), fetch timeouts added
          after the CKAN lookup hung. Toorak $1,250 / $650. DFFH's latest quarter is still September 2025.
        - rental-qld stamps statsUpdatedAt (a sales-side field) on every suburb it touches; harmless today,
          worth removing when that feed is next opened.
        - Days on market: no feed produces it; column kept, service returns 0 (unknown) until one does.
      Original scope: Opening snapshot table on suburb page replacing "The postcode for X is…":
      median house, median unit, weekly rent, gross yield, 12-month change, days on market,
      population, source, date. (01, A)
- [ ] 4. [code] Database out of the crawl path, three separate commits:
      (a) DONE 5 Sep 2026 — PR #3 (0bbc35c): `/suburbs/[slug]/rental-market` 7-day ISR, `/api/revalidate`
          batch + route patterns, quarterly/annual crons revalidate synced suburbs and school pages;
          PR #4 (b148601): `/schools/[slug]` 24h ISR with mode/sort/filters applied on the client.
          Verified on production: both routes `x-nextjs-prerender: 1` and HIT on repeat requests;
          `tests/seo/isr-routes.test.ts` guards every suburb sub-route + school page.
      (b) DONE 5 Sep 2026 — PR #5 (db62e82): post-deploy warm-up instead of build-time prebuild.
          Prebuild was tried and dropped: the build is deliberately DB-free (460c601) and previews have
          no DATABASE_URL, so the preview build failed (P1001). `scripts/seo/warm.mjs` + the
          "Warm cache after production deploy" GitHub Action fetch the top 300 suburbs' profile,
          rental-market and schools pages after every Production deploy. First run: 900 URLs, all 200,
          216 s; top pages HIT afterwards. Regenerate `src/lib/data/prebuild-suburbs.json` from the
          latest baseline when the top pages change.
      (c) TODO connection pooler + circuit breaker → 503 + Retry-After. Check: Bing crawl 5xx reads zero. (04)
      Learned from 29: a server `searchParams` read in a route with no build-time render throws
      DYNAMIC_SERVER_USAGE at request time; the /buy and /rent hubs are dynamic (no-store) routes,
      not the cached shells their comments describe. Re-check them under (b).
- [x] 5. DONE 7 Sep 2026 — PR #10 (27f81cf): "Most searched suburbs" block (≤24 links by Google impressions)
      on the 8 state pages and 8 capital-city market pages; abs-census, rental-qld, sales-qld, sales-wa now stamp
      Suburb.updatedAt so sitemap lastmod / revalidate-paths / IndexNow see their changes. Homepage block deferred
      until the 4 Sep homepage rebuild is pushed (would conflict). Original scope: Recrawl paths for top 500
      suburbs by impressions: links from state pages, capital-city market pages, homepage suburb block; sitemap
      lastmod from stats timestamp. (04, B)
- [ ] 6. [you] GSC Request indexing on top 50 suburbs; re-check shown titles for Surfers Paradise,
      Toorak, Morayfield, Buderim in two weeks. (04)
- [ ] 7. [you] Clarity: exclude internal traffic (`?design=` previews, localhost), bot filtering,
      review dead-click recordings on CGT and Perth market guides. (C2)

## Commission guides (week 2–4)

- [ ] 8. [code] Embed commission calculator at top of each state guide, preset to state rate;
      retitle "Real Estate Commission {State} 2026: Rates, Fees & Calculator". (06, C)
- [ ] 9. [content] Regional rate table per state (capital / regional centres / remote), sourced, dated. (06)
- [x] 10. DONE 8 Sep 2026 — PR #21 (3732896): "What it costs to sell in {State}" table on all eight guides, worked at
      each guide's example price (the site's "state median" is a median of suburb medians and over-represents
      metro suburbs, so it was not used); indicative ranges labelled, state documents sourced. Watch the national
      cost guide's Bing position to 22 Sep (5 Sep: pos 3.0, 16 clicks). Original scope: table with worked total
      at state median. (06)
- [ ] 11. [code] Seller-funnel links: homepage seller path, /selling, /selling-guide, and the
      "Thinking of selling in {suburb}?" block on every suburb page → state commission guide. (06)
- [x] 12. DONE 8 Sep 2026 — PR #21 (3732896): one PAA question per guide (six questions per page), 40+ words with
      a figure and a source; Rich Results Test clean. Found: RRT reports a "Paywalled Content" item on the guides
      (Article schema isAccessibleForFree / hasPart markup); confirm it is intended, remove if not.
      Original scope: FAQ answers from People Also Ask on each state guide. (06)

## Investor intent (week 3–6)

- [ ] 13. [code] Rental-market sub-page rebuild: title "{Suburb} Rental Market 2026: Median Rent,
      Yield & Vacancy"; rent by bedrooms, yield, 12-month change, vacancy, rent history, listings,
      investment FAQ; link from profile investment block. (09, H)
- [ ] 14. [code] Suburb school sub-page rebuild: catchments, nearest schools with ICSEA/enrolment,
      distances, link back to profile. (C2)
- [ ] 15. [content] Rental yield calculator: "good yield in 2026" table by city/property type,
      PAA one-liners, suburb yield lookup, highest-yield-by-state table. (07, D)
- [ ] 16. [code] Prefilled deep links from suburb investment block → calculator
      (`?price=&rent=`, canonical to base). (D)

## Suburb template intent blocks (week 5–10)

- [ ] 17. [code] Price history block: 5-year house/unit medians, table + small chart. (05, A)
- [ ] 18. [code] Recent sales from sold feed where held. (05, A)
- [ ] 19. [code] Three data-generated FAQs (invest / expensive / nice to live); postcode,
      population, walkability → schema only. (05, A)

## New pages and refreshes (week 6–12)

- [ ] 20. [code+content] Upgrade the EXISTING eight /guides/stamp-duty-{state} pages (do not create new
      URLs): embed calculator preset to state, tables generated from src/lib/utils/stamp-duty.ts,
      FHB thresholds with dates, surcharge, exemptions, worked examples $500k/$750k/$1M, PAA FAQ;
      fold /guides/stamp-duty-queensland-what-you-need-to-know into the QLD guide with a redirect. (07, E)
- [ ] 21. [code] Per-suburb stamp duty line on suburb pages → state page. (E)
- [ ] 22. [code+content] Best-suburbs city editions: capital-city layer per category, ten suburbs
      with reason + figures, method block, visible updated date. (08, F)
- [ ] 23. [content] Moreton Bay families guide → 2026, ten suburbs, comparison table, PAA sections;
      Brisbane families guide retitle + table. (10, G)
- [ ] 24. [content] Buying guide retarget → "how to buy a house in Australia"; link existing FIRB guide. (10, I)
- [ ] 25. [content] Renters rights NSW rewrite around 2026 law changes. (10, I)
- [ ] 26. [content] First-home-buyer NSW guide title + snippet pass (Bing pos 6.2 on "first home buyer grant nsw"). (C3)

## Found while building R2/R6 (5 Sep 2026) — review before actioning, same as the rest

- [x] 29. (shipped 5 Sep 2026: PR #1 d48be4d, PR #2 9d737e3 → origin/main 8097bf5; verified on production) [code] **Every suburb /buy and /rent sub-page returns HTTP 500** (35,816 URLs, linked from the
      tabs on every suburb profile; houses/units/land/townhouses on the same suburbs return 200).
      Cause: `src/app/(marketing)/suburbs/[slug]/buy/page.tsx` and `rent/page.tsx` `await searchParams`
      at the top level of an ISR route (`revalidate` exported). The /buy and /rent hub pages isolate the
      same read in a Suspense child (`Results.tsx`, May 2026 "cache 12 dynamic routes") and work.
      Fix options: (a) isolate the filtered listing into a Suspense child like the hubs; (b) drop the
      filter params, matching the houses/units pages. Likely a large share of Bing's daily 5xx count.
      Guardrails: fix on a preview deployment; verify 200 + `x-vercel-cache: HIT` on second GET for
      3 suburbs; one commit; watch Bing 5xx for 14 days. NOTE: local main is 4 commits ahead of
      origin/main (4 Sep homepage rebuild etc.) — decide whether the fix ships with or without them.
- [x] 30. (shipped with 29, PR #1) [code] `suburbBuyDescription` prints "Median house price $0K" and `suburbRentDescription`
      prints "Median rent 0/wk" for suburbs whose price is suppressed by `hasReliablePrice`
      (`src/lib/utils/seo.ts`). Caught by `tests/seo/titles.test.ts`, which stays red until fixed.
      Fix: gate the price/rent clause the way `suburbDescription` already does. Ships with 29.

## Ongoing

- [ ] 27. [you+content] Link programme: quarterly data release + state press versions, embeddable
      widgets, expert-quote requests, partner links. Target 100 referring domains by Mar 2027. (02, J)
- [ ] 28. [code+you] Monthly measurement: GSC page×query top 200 suburbs, Bing page/query reports,
      33 tracked SERPs, Bing 5xx count, CWV once PSI quota resets, Bing URL submission after syncs. (K)
