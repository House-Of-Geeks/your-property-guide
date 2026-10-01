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
- [x] 2. [code] New suburb title + description in `src/lib/utils/seo.ts`:
      `{Suburb} {State} {Postcode}: House Prices, Rent, Schools & Suburb Profile`;
      description leads with median + 12-month change + source month. (01)
      DONE 1 Oct 2026 — PR #87. (sign-off row for item 2 still blank). Staged per R4: title and
      description for the SA and TAS cohort only (2,539 of 16,390 profiles in the production sitemap), the rest
      keep today's builders as the control; widen via `TITLE_COHORT_STATES` after three weeks if the cohort's CTR
      beats the control's. Each title topic named only where the page publishes it; growth only where measured
      (NSW, SA). Same PR, every profile: "Is {suburb} a good investment?" FAQ (commercial intent review 3.8) and the
      price card no longer prints "+0.0%" under Land Victoria and ABS medians.
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
      1 Oct 2026: the batch merge of ten review PRs started up to six warm-up runs at once and Postgres refused
      connections ("too many clients already"); suburb pages answered 500 for about five minutes until the older runs
      were cancelled (change log, 2026-10-01). Until (c) lands, merge one PR at a time or cancel duplicate warm runs.
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

- [x] 8. [code] DONE 30 Sep 2026 — PR #81: rolled out to NSW, VIC, QLD, SA, WA, TAS and ACT in one PR
      (Jos asked for one go instead of one commit per state). Each guide opens with the calculator preset to its typical
      rate and its example price; titles on the pilot pattern with the capital ("Real Estate Commission NSW 2026: Sydney
      Rates, Fees & Calculator"), "{City} & {State}" in the h1; the national fees guide answers the PAA "Do real estate
      agents get paid if the house doesn't sell?". NT unchanged from the pilot. History:
      NT pilot live 8 Sep 2026, PR #23 (5ccac66): calculator embedded at the top of the NT
      guide preset to 2.5% and $800,000, retitled "Real Estate Commission NT 2026: Rates, Fees & Calculator";
      embed by import, no schema, no second CTA; tests pin the pilot to NT. Baseline docs/seo-baselines/2026-09-07.
      Next: read NT's Bing position and clicks on 22 Sep (`npm run seo:baseline -- --compare 2026-09-07`); if they
      hold, WA and TAS, then NSW, VIC, QLD, SA, ACT, one commit each. The review's shared-layout extraction was
      skipped for the pilot (shared components already prevent drift); decide before the second state.
      Original scope: Embed commission calculator at top of each state guide, preset to state rate;
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
      a figure and a source; Rich Results Test clean. The "Paywalled Content" item the test reports is the Article
      schema declaring isAccessibleForFree: true, which Google files under that heading; nothing to change.
      Original scope: FAQ answers from People Also Ask on each state guide. (06)

## Investor intent (week 3–6)

- [ ] 13. [code] IN PROGRESS — PR #25 (5f35ee8 gate, 01ce1bc pilot), 8 Sep 2026: sitemap gate added (the review's
      1,513-page gate did not exist; 17,872 → 5,526 URLs) and empty pages noindexed; rebuilt page live for 50 VIC
      suburbs from a tested model that renders only what its data supports and titles the page from those sections
      ("Median Rent & Yield" or "Median Rent"; no vacancy, no feed has it). Verified in production; structural mobile
      check at 909 px clean, phone-width look by eye still owed. Next: 19 Sep Bing 5xx read; rollout = remove the
      pilot list (one commit); then the profile investment-block link (suburb template, after 21 Sep).
      Victorian history back-load DONE 8 Sep 2026 — PR #27 (150da70) + production run: 20 quarters per suburb
      (2020-Q4 to 2025-Q3), 4,040 rows; history table, 12-month change and the change FAQ now render on the pilot
      pages. Rollout commit should also reword the flat-year card ("0% over 12 months" → "Unchanged over 12 months").
      NSW bedrooms and history DONE 8 Sep 2026 — PR #29 (31ba7b3) + production run: 8 quarters (2024-Q3 to
      2026-Q2), 32,914 rows, bedroom medians for 3,251 suburbs; the rollout will show them on 4,072 NSW pages.
      Follow-ups: QLD and SA history accumulate one quarter per run (the RTA and CBS files are single-quarter).
      Original scope: title "{Suburb} Rental Market 2026: Median Rent, Yield & Vacancy"; rent by bedrooms, yield,
      12-month change, vacancy, rent history, listings, investment FAQ; link from profile investment block. (09, H)
- [ ] 14. [code] Suburb school sub-page rebuild: catchments, nearest schools with ICSEA/enrolment,
      distances, link back to profile. (C2)
- [x] 15. [content] DONE 1 Oct 2026 — PR #31. one commit on main after PR #85 (3.3a), which
      merged the overlapping half. Dropped as duplicated by #85: the 8 Sep data file and generator (same paths; #85's
      30 Sep file under the yield ranking's gate stands, so the 8 Sep Sydney yield built from postcode-level rents is
      gone), the city "good yield" table, and the "good rental yield in Australia" and "Is 4.5% good?" answers (#85
      answers those and 3.5%). The VIC and QLD highest-yield lists are not repeated: /best-suburbs/best-rental-yield/vic
      and /qld rank the same suburbs under the same gate, and the page now links them under the good-yield table.
      Kept: the suburb lookup below the calculator (it opens the suburb's page; the copy promises a rent only where its
      source is known and a yield only beside a published house median), and two PAA answers from the 8 Sep SERPs that
      #85 does not cover, "Is 3% rental yield bad?" and "What does a 7% rental yield mean?", worked from #85's data file
      and engine and tested against it. Not built: the 30 Sep PAA "What is a 6% yield?" and "What is the 30% rent rule
      in Australia?" (neither PR answers them).
      Found while building on 8 Sep: (a) `sales-sa` medians look inflated (Elizabeth $697,500; state median of suburb medians
      $1.05M) — check the feed's column and definition as done for NSW and VIC; (b) `rental-sa` does not write through
      to Suburb.medianRentHouse/Unit, so rankings and city pages use stale SA rents — add the write-through.
      Original scope: "good yield in 2026" table by city/property type, PAA one-liners, suburb yield lookup,
      highest-yield-by-state table. (07, D)
- [ ] 16. [code] Prefilled deep links from suburb investment block → calculator
      (`?price=&rent=`, canonical to base). (D)

## Suburb template intent blocks (week 5–10)

- [ ] 17. [code] Price history block: 5-year house/unit medians, table + small chart. (05, A)
- [ ] 18. [code] Recent sales from sold feed where held. (05, A)
- [ ] 19. [code] Three data-generated FAQs (invest / expensive / nice to live); postcode,
      population, walkability → schema only. (05, A)

## New pages and refreshes (week 6–12)

- [x] 20. DONE 30 Sep 2026 — PR #92 (b2f7d2c), verified in production the same evening: eight state titles and H1s, calculator first, corrected duty (QLD owner-occupier $750k $19,600, ACT $19,208, TAS first home $28,935), old QLD article and its /blog form 308 to /guides/stamp-duty-qld in one hop, no list, feed or sitemap links it. [code+content] Upgrade the EXISTING eight /guides/stamp-duty-{state} pages (do not create new
      URLs): embed calculator preset to state, tables generated from src/lib/utils/stamp-duty.ts,
      FHB thresholds with dates, surcharge, exemptions, worked examples $500k/$750k/$1M, PAA FAQ;
      fold /guides/stamp-duty-queensland-what-you-need-to-know into the QLD guide with a redirect. (07, E)
- [ ] 21. [code] Per-suburb stamp duty line on suburb pages → state page. (E)
- [x] 22. [code+content] DONE 1 Oct 2026 — PR #86. best-suburbs city editions: capital-city layer per
      category, ten suburbs with reason + figures, method block, visible updated date. (08, F)
      /best-suburbs/{category}/{city} for the eight capitals (the /property-market/{city} postcode membership), five
      categories: rental yield (Melbourne, Brisbane), fastest growing (Sydney, Adelaide), families, cheapest and most
      walkable (all eight); 28 URLs, flood risk left out (item 49). Each: searched-form title and H1, method with source
      and period, updated date, one H2 per suburb with a paragraph built from its published figures and distance to the
      GPO, comparison table, ranks 11 to 15, "Under $500,000" where three or more qualify, PAA FAQ answered from the data
      (never a forecast), ItemList, FAQPage and BreadcrumbList JSON-LD. Fewer than ten qualifying suburbs: noindex and
      out of /best-suburbs/cities/sitemap.xml (hasCityEdition, one predicate over one query). State and national
      ranking pages link to the editions that qualify. After deploy: list which editions reach the sitemap in production.
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
- [x] 28. DONE 8 Sep 2026 — PR #32 (1bb6ad3): baseline script tracks 40 SERPs, sums the 5xx week, retries and caches;
      `seo-measure.yml` runs on the 1st and opens a PR (YOU: add secrets BING_WEBMASTER_API_KEY, CLARITY_API_TOKEN,
      DATAFORSEO_LOGIN, DATAFORSEO_PASSWORD and allow Actions to create PRs; until then run `npm run seo:baseline`
      by hand). GSC stays a manual export (--gsc); CWV needs a PageSpeed API key (none); Bing URL submission already
      happens after syncs via IndexNow. Original scope: GSC page×query top 200 suburbs, Bing page/query reports,
      33 tracked SERPs, Bing 5xx count, CWV once PSI quota resets, Bing URL submission after syncs. (K)

## Valuation & agent search plan (16 Sep 2026)

Items 31–35 live in `valuation-search-plan-2026-09.md` (plan items 1–5); tracked here for the change log.

- [ ] 31. [code] BUILT 16 Sep 2026, branch `feat/suburb-price-section`: suburb price section (plan item 1). Absorbs 17 (price trend moved up) and 19 (valuation FAQ). 18 (recent sales) waits on the NSW VG import.
- [ ] 32. [code+content] BUILT 17 Sep 2026, branch `feat/home-value-form`: house-worth guide gains a suburb-first appraisal block and a new title; appraisal form gains an optional timeframe (plan item 2). Estimator and /suburbs/{slug}/property-value dropped 17 Sep: the suburb page owns that intent.
- [ ] 33. [code+content] BUILT 17 Sep 2026, branch `feat/city-house-prices`: city pages retitled to house prices, twenty-busiest-suburbs table, data-built narrative, appraisal block (plan item 3).
- [ ] 34. [code] BUILT 17 Sep 2026, branch `feat/suburb-agents-pages`: /suburbs/{slug}/agents, lead-gen first; agent listings behind AGENT_LISTINGS_ENABLED (src/lib/suburb-agents.ts) until the directory holds real agents (plan item 4).
- [ ] 35. [code] Sold in {suburb}, NSW, after manual Valuer General download + import (plan item 7).

## Found from Search Console index coverage (29 Sep 2026) — review before actioning, same as the rest

Report read on 29 Sep: Not found 27,793 · Alternate with canonical 7,422 · Excluded by noindex 7,365 · Server error 4,211 ·
Soft 404 1,578 · Blocked by robots.txt 930 · Page with redirect 772 · Duplicate without canonical 236 · Crawled, not
indexed 38,339 · Discovered, not indexed 1,269. Search Console's example URLs were not readable from the session (not
signed in), so the split per row below is inferred from production logs, the live sitemaps and a read-only production
count; item 44 asks for the exports to confirm it. Working files: session scratchpad (not committed).

- [x] 36. DONE 29 Sep 2026 — PR #63 (5ae2f44): the six national /best-suburbs/{category} pages answered 500
      (DYNAMIC_SERVER_USAGE, the item 29 fault). Verified 200 in production. ISR guard test now scans every route.
- [x] 37. DONE 29 Sep 2026 — PR #64 (ae9ae54): sitemaps submit only pages that do not noindex themselves
      (suburbs 17,872 → profiles the page marks indexable; agents 4,719 → those with a published median); /agents and
      /real-estate-agencies out of the static sitemap; compare sitemap in canonical pair order.
- [x] 38. DONE 29 Sep 2026 — PR #64 (de0acf5): canonical on /find-an-expert; test that every indexable page sets one.
- [x] 39. [decision] DONE 29 Sep 2026 (option b, below). Thin suburb profiles. 3,805 profiles answer noindex under the page's own rule (no published price
      and no population). Most became thin on 7 Sep when the postcode-level census copies were cleared (item 1 step
      iii): an unflagged consequence of that change. In the three-month Google export to 5 Sep, 88 of them were in the
      top 1,000 pages with 53 clicks and 25,951 impressions (5% of clicks, 12% of impressions), nearly all at position
      8 to 10 on postcode lookups. By kind: 3,130 small localities, 407 named parts of suburbs, 234 postal names
      (…DC, …BC), 35 institutions. The pages still carry 800 to 1,200 words in 8 to 11 sections, so "mostly empty
      modules" no longer describes them.
      Options: (a) leave them noindex; (b) index real localities again where the page renders enough data sections,
      keep postal and institution names noindex (recommended); (c) index all as before 7 Sep.
      Could break: (b) and (c) put back pages with no price and no population, which the rule was written to hold
      back; the rule lives in one place (`suburb-indexability.ts` + the page), so the sitemap follows.
      Shipped: option (b). The postal and institution names became redirects (item 46, 290 rows). Of the 3,520 real
      localities left, 2,230 that carry a walk score, a climate row, a crime row or a rental row are indexable
      again and back in the sitemap; 1,261 carry none and stay noindex, and 29 are held back as misfiled rows
      (item 48). One rule (`isThinProfile`), read by the page and the sitemap. Read in Search Console around
      27 Oct: "Excluded by noindex" down by about 2,200.
- [x] 40. [code] DONE 29 Sep 2026 (see the end of this item). Stop linking to empty listing sub-pages. 13 suburbs have a listing; every other suburb's six listing
      sub-pages (/buy, /rent, /houses, /units, /townhouses, /land: about 107,900 URLs) are empty, answer 200 with
      noindex, and are reachable from the tab strip on every sub-page, the schools page's "View properties" and the
      rental-market page's rent links. Feeds "Excluded by noindex", "Soft 404" and "Crawled, not indexed".
      Change: render a tab or link only where the cached listing inventory has stock (rental-market tab where a
      rental row exists). Could break: the tab strip is the sub-pages' navigation; an all-empty strip needs a
      fallback to the profile link. Guardrails: inventory from the existing cached groupBy (no per-page query);
      rental-market pilot pages checked by eye; one commit.
      Shipped: tabs and links follow the listings a suburb has, by type, and the rental row for the rental-market
      page (`src/lib/suburb-subpages.ts`, tested; the sub-page sitemaps use the same predicates). The inventory is
      one indexed query per render, not the cached groupBy: a 24-hour cached read would have made every weekly
      page revalidate daily. Not in this change: the profile's link to the agents sub-page, which is noindex for
      suburbs without a published median (about 14,250 links); say if that should follow the same rule.
- [ ] 41. [code] Social preview images are blocked to crawlers. Every suburb and guide declares og:image under
      /api/og/, and robots.txt disallows /api/ ("Blocked by robots.txt", 930). Change: allow /api/og/ in robots.ts.
      Could break: cost. The image routes answer `max-age=0, must-revalidate`; opening them to crawlers without a
      CDN cache header means a function run per fetch across ~18,000 suburbs. Guardrail: long s-maxage on both
      routes first, verified HIT on the second request, then the robots change.
- [ ] 42. [code] Suburb schools sub-pages that say "No schools found" (2 of 50 sampled, about 4% of 17,872) are
      indexable and in the sitemap: soft-404 candidates. Change: noindex on the empty state. Folds into item 14.
- [ ] 43. [optional] Comparison links in canonical order. Each profile links six comparisons self-first, so about half
      point at the non-canonical order (the "Alternate page with proper canonical tag" row; working as designed).
      Linking the canonical order saves the duplicate crawl but puts the other suburb first on the page the visitor
      lands on. Leave unless crawl budget becomes the constraint.
- [ ] 44. [you] Search Console: (i) press Validate fix on "Server error (5xx)"; (ii) do NOT validate "Not found (404)":
      those are the address pages (/property/…, 15.5M once submitted) and street pages (543k) removed on purpose and
      answering 410, and the row shrinks on its own; (iii) export the example URLs of each row (up to 1,000 each)
      so the split above can be confirmed.
- [x] 45. DONE 30 Sep 2026 — PR #80. [copy] best-suburbs H1 read "The for families suburbs in Australia." on the
      family category (all states); the state <title> ("Best for Families suburbs in Western Australia (WA)") and the ItemList name
      had the same fault. One builder (src/lib/best-suburbs-headlines.ts) composes the sentence for every category and state
      ("The best suburbs for families in Western Australia"), tested over all 54 combinations; the other five categories' titles
      are unchanged.
- [x] 46. DONE 29 Sep 2026 — PR #66 (1198854) and its follow-up: postal delivery names, institutions and
      shopping-centre post offices are not suburbs. 290 rows ("Nerang DC", "Parliament House", "Penrith Plaza") had
      profiles, sub-pages and places in every list. Their URLs redirect (196 to the real suburb of the same name in
      the same postcode, 94 to the postcode page, which lists them as delivery names); lists, search, rankings,
      comparison pairs and sitemaps leave them out. This is the "fix properly" half of item 39's postal and
      institution names. The Suburb rows are still in the database: deleting them is a production write and waits
      for a separate go (schools and listings may reference them).
      Re-run `npx tsx scripts/seo/non-localities.ts` (read-only) after an import that adds suburbs and commit the
      diff; `--check` prints the counts without writing.
- [x] 47. [code] DONE 29 Sep 2026 in three cohorts (see the end of this item). Lists rank on the raw median column. The suburb page withholds a median whose source is distrusted
      or which rests on fewer than five sales (item 1); the best-suburbs rankings, /price-guide, the state market
      reports and the suburb finder query `medianHousePrice > 0` directly. On 29 Sep 2026, of the rows with a raw
      house median, 4,719 came from the four trusted sales feeds and 12,973 from census proxies, rental feeds
      that overwrote statsSource, and the distrusted QLD/WA feeds. Change: the same gate as the page
      (`hasPublishedHouseMedian`) in each list query. Could break: rankings for QLD and WA would empty or thin out,
      so the pages need an honest empty state first; ships by cohort with a before/after of each ranking.
      Cohort 1, rankings, DONE 29 Sep 2026: one rule in `src/lib/published-medians.ts`, read by the suburb service
      and the rankings. No state emptied on price (every state has at least 29 published medians; QLD, WA, TAS, NT
      and ACT are ABS statistical-area figures and the pages say so). Growth is ranked for NSW and SA only, yield
      for VIC and QLD only; the twelve state pages with nothing to rank say why and answer noindex.
      Cohort 1 verified in production: 55 pages, 2,037 rows, every median the published one, no change beyond 25%.
      Cohort 2, state pages, market reports and price guide, DONE 29 Sep 2026: lists, averages and counts over
      published medians; growth only where measured; days on market removed; each page names its source.
      Cohort 2 verified in production: 29 pages, 573 rows, every median the published one (after-reports.csv).
      Cohort 3, every other reader, DONE 29 Sep 2026: postcode pages, city and region rollups (these three
      applied the source rule but not the five-sale rule), search, the suburb finder, the listing page's suburb box
      and the school comparison. A test finds every file that reads the Suburb table and names a sales column.
      The finder leaves out of the score what it cannot measure and says so; where the top priority cannot be
      measured (growth outside NSW and SA, yield outside VIC and QLD, hazard everywhere) it shows the reason in
      place of matches. Counts before and after: docs/seo-baselines/2026-09-29/lists/remaining-readers-dry-run.md.
      Left for a decision: city and region titles end "Median, Growth, Suburbs" where the page has no growth to
      show (item 2); `GROWTH_SOURCES` is the one line to change if the hand-entered Moreton Bay growth figures are
      wanted back.
      Cohort 3 verified in production: 54 pages, 940 rows with figures, every median, change, rent and yield
      the one the suburb's own page publishes; no days on market, no hazard claim, no change of 0.0%.
      Corrected after cohort 3: the pages said suburbs in one ABS area share a figure. They do not (item 51);
      the sentence now says what the feed does.
      Snapshots: docs/seo-baselines/2026-09-29/lists/ (before.csv, after-rankings.csv, after-reports.csv,
      before-readers.csv, after-readers.csv).
- [x] 48. [data] DONE 29 Sep 2026 for (a) and (b); (c) left to Jos (see the end of this item). Rows that are not places. Found 29 Sep 2026 while reading the pages item 39 was about to index.
      (i) 25 suburbs filed under SA with an interstate postcode, each beside the real suburb: "Sydney, SA 2000",
      "East Melbourne, SA 3002", "Broken Hill, SA 2880", "Townsville, SA 4810", "George Town, SA 7253". The SA crime
      and rental feeds record an interstate address now and then and the sync creates a suburb for it.
      (ii) Misspellings and junk with no real twin: "Alice Spring, SA 0870", "Faddon, SA 2904", "Wooloongabba, SA
      4102", "North Pole, VIC 9999", "Not Disclosed" (postcode "NOT DISCLOSED"), and "Pipalyatjara, SA 872", a
      duplicate of the 0872 row with a population of 159, which is indexable today.
      All but the last are noindex and item 39 keeps them so (`stateMatchesPostcode`). They still appear in
      search, lists and the postcode pages of the real suburbs.
      Change: (a) the two SA feeds skip a row whose postcode is outside SA's ranges (and 0872); (b) the 25 join the
      non-locality list with the real suburb as parent, so their URLs redirect (item 46's mechanism); (c) delete
      the junk rows. Could break: (c) is a production write, schools or crime rows may reference the rows; dry
      run with counts first, then an explicit go.
      Shipped: (a) the SA crime feed skips records that are not places in South Australia and restores the zero of
      0872; the stub importer and the slug matcher refuse a row its state cannot contain. The rental feed needed no
      change: it carries no postcodes, and the old rental-sa stamp on these rows was the feed marking every SA row.
      (b) 29 of the 31 redirect to the real suburb (the three misspellings and the Pipalyatjara copy found their
      suburb too); "North Pole" and "Not Disclosed" answer 404. The list also gained 23 delivery names the first
      rules missed ("Pacific Fair", "Warringah Mall", "Rundle Mall").
      (c) Not done. Dry run (read-only) in docs/seo-baselines/2026-09-29/data-audit/rows-that-are-not-places.md:
      nothing that cascades; 82 property addresses, 30 crime rows and 1 climate row refer to them. The rows are
      inert now, and while they exist the generator keeps their redirects, so leaving them is the safer default.
      The file lists the statements if Jos wants them gone.
- [ ] 49. [code] Two rankings that do not rank what they say. Found 29 Sep 2026 while gating the rankings (item 47).
      (i) "Best suburbs for families" takes 500 suburbs with a family share above 40% in no stated order and sorts
      those by school ICSEA, so the list is the best of an arbitrary 500, not of the 3,987 in NSW alone. Change:
      rank in the database over every suburb (average ICSEA by suburb, then the top 50).
      (ii) "Lowest flood risk" ranks suburbs with a low flood class or no hazard record. The hazard table is empty
      in production, so every row shows "No data" and the list is 50 suburbs with no record, ordered by walk
      score. Change: until a hazard feed is loaded, say so in place of the list and take the nine pages out of the
      index. Could break: both change what nine pages each show; before/after per page as for item 47.
      Also seen: the NSW sales feed keeps the old growth figure when it has no prior-year median to compare
      (`ELSE s."annualGrowthHouse"`), so a growth figure beside a NSW median can predate the feed.
      (iii) The suburb finder's "Low natural-hazard risk" priority has the same empty table behind it. Since item
      47 it says so in place of matches; the option is still offered. Loading a hazard feed fixes (ii) and (iii)
      with no code change.
- [ ] 50. [data] Suburbs filed under the wrong region. Found 29 Sep 2026 while counting the region rollups
      (item 47). (i) 20 of the 499 region names hold suburbs from two or more states and the region page takes
      them all, because it selects by name alone: "Bayside" is 17 Victorian and 36 New South Wales suburbs,
      "Latrobe" 22 Victorian and 39 Tasmanian, "Laverton" 79 in the NT, 18 in SA and 13 in WA. (ii) Suburbs sit in
      regions they are not part of: the "Armidale" page counts Glen Innes and Tingha and not Armidale,
      "Alexandrina" counts Mylor and Heathfield in the Adelaide Hills. The region's median, its tables and its
      title describe the wrong place. Change: (a) select a region by name and state (the page already knows
      both); (b) audit the region column against the ABS locality to LGA correspondence and re-import where it
      differs. Could break: (a) changes which suburbs 20 region pages list, and 20 names need a second page or a
      state in the URL; (b) is a production write and moves suburbs between pages: dry run with counts first,
      then an explicit go.
- [ ] 51. [data] An ABS area median reaches a suburb only by name. Found 29 Sep 2026 while checking figures
      that looked high (item 47). The ABS feed gives each statistical area's (SA2) median to the suburb with the
      area's exact name (`resolveSlug(sa2Name, state, "")` in scripts/sync/sources/sales-abs.ts). The figures on
      file match the ABS Data API for 2024 to the dollar. Two consequences:
      (i) Of the 992 areas with a 2024 house median in QLD, WA, TAS, NT and ACT, 539 match a suburb and 453 do
      not ("Loganholme - Tanah Merah", "Brighton (Qld)", "Kingston Beach - Blackmans Bay"), so their suburbs have
      no published median and the ABS figure goes unused.
      (ii) A suburb split between two areas takes the figure of the one that carries its name. Morayfield prints
      $1,095,000, the figure for the SA2 "Morayfield"; most of the suburb lies in "Morayfield - East"
      ($660,000). Ten areas are named this way.
      Change: match through the ABS locality to SA2 correspondence (a suburb takes the area that holds most of
      it) and name the area on the page. Could break: it changes the published median of suburbs in five
      states and gives one to several hundred more, which makes them indexable under item 39's rule; it is a
      production write by the feed. Dry run with counts and a list of every suburb whose figure would move,
      then an explicit go.

## Commercial intent review (30 Sep 2026)

Source: `docs/seo-baselines/2026-09-30/commercial-intent-review.md` (section and priority numbers below refer to it).
Same gate as the rest: review before merging, one template change per fortnight, URLs never change.

- [x] 52. [code+content] DONE 1 Oct 2026 — PR #84. property management fees guide (review 3.7, priority 5).
      /guides/property-management-fees-australia on the same URL: title "Property Management Fees 2026: Rates by State &
      Calculator" (58 characters), H1 "Property Management Fees in Australia 2026: Rates by State, With Calculator"; state table (management % range and average, letting weeks, renewal, inspection, admin;
      every cell footnoted and dated; "No published range" where no named source gives one); annual cost calculator
      (engine src/lib/property-management-fees-calc.ts, tested); one H2 per state with the regulated part; FAQ gains the
      three PAA questions. Evidence: 1,000 Google / 295 AI searches, 0 GSC impressions, Bing 11 clicks / 444 impressions at
      4.7; the AI Overview's state table is LocalAgentFinder's (13 Mar 2026) and the page now carries it with the source.
      Next: state pages (3.7). Could break: nothing outside the one URL.


Source: `docs/seo-baselines/2026-09-30/commercial-intent-review.md` (section and priority numbers below are the review's).

- [x] 3.7 (priority 9) [code][content] Inspection and conveyancing guides cost-first. /guides/building-pest-inspection
      titled "Building and Pest Inspection Cost 2026: Prices by City" (H1 keeps the long form) with a city by
      property type cost table (eight capitals, every figure from a dated inspector or price-guide page), combined vs
      building-only vs pest-only, who pays, and the four PAA answers; /guides/conveyancing-guide titled "Conveyancing
      Fees 2026: Costs in NSW, VIC, QLD & Every State" (H1 keeps the long form) with a state fee table, a cost estimator
      (src/lib/conveyancing-costs.ts), NSW, VIC, QLD and other-state sections from the 2026/27 registry and PEXA
      schedules, and five PAA answers. DONE 1 Oct 2026 — PR #88.
      Not built: separate NSW, VIC and QLD conveyancing cost pages (the review's fix list names them; no state section
      passed 1,000 words, so the PR proposes them instead of creating URLs). Tasmania's conveyancing figures rest on one
      fee guide and one published average; refresh when a second source appears.


Source: docs/seo-baselines/2026-09-30/commercial-intent-review.md (untracked in the shared checkout), sections cited per item.

- [x] Review 3.7, priority 9: renovation cost guide tables and calculator (/guides/renovation-cost-australia-2026).
      Cost tables by room at budget, mid-range and premium, per m² by scope, and by state and capital, every cell
      sourced and dated or reading "no published range"; a calculator built from the tables; a dated one-sentence
      answer per room section; the four People-also-ask FAQs in FAQPage JSON-LD. DONE 1 Oct 2026 — PR #89. Still unpublished anywhere, so left as gaps: a renovation rate per m² by state (the state table uses
      CKA city adjustments, RLB custom-house rates and ABS new-house figures instead), second-storey rates by finish
      level, and a Canberra, Darwin or Hobart figure in some columns. Houzz's latest Australian study is 2023.
Source: `docs/seo-baselines/2026-09-30/commercial-intent-review.md` (section numbers in brackets).

- [x] 3.4 (priority 6). [code] Valuation and appraisal: instant range from published medians on /appraisal and the
      house-worth guide, /appraisal H1 "Free property appraisal from a local agent", new /property-valuation page
      (appraisal vs valuation vs online estimate, sourced valuation cost, PAA FAQs, WebPage + FAQPage JSON-LD).
      DONE 1 Oct 2026 — PR #82. Left out: a bedrooms selector (no feed holds bedroom sales
      medians; SuburbRentalStat holds bedroom rents only) and quartiles (no feed publishes them; the band is
      median less and plus 15%, labelled). Unit medians are shown only from the feeds that produce one
      (sales-vic, sales-abs; `UNIT_MEDIAN_SOURCES`); the site-wide unit-median withholding remains item 1's
      open follow-up.


Source: docs/seo-baselines/2026-09-30/commercial-intent-review.md (untracked, in the shared checkout).

- [x] 3.3a [code+content] Calculators: borrowing power and rental yield. DONE 1 Oct 2026 — PR #85.
      /borrowing-power-calculator: H1 "How much can I borrow? Borrowing power calculator"; server-rendered
      "Borrowing power by income" table (single and couple, $60,000 to $200,000) and a "$100,000 salary" FAQ from
      the widget's engine; default assessment rate now 9.2% (RBA F6 new variable rate 6.2%, July 2026, plus APRA's
      3-point buffer confirmed 28 May 2026), was 7.5%. /rental-yield-calculator: "How to calculate rental yield,
      step by step" with a worked example, "What is a good rental yield in 2026?" from gated data (Vic and Qld only;
      the other states listed with the reason), FAQs on 4.5% and 3.5%. Header: every dropdown is in the server HTML
      and the Tools menu links /tools. Overlaps item 15 (PR #31): same generator and data file paths, regenerated
      under the current gate; merge one and rebase the other. Follow-ups: regenerate
      src/lib/data/yield-benchmarks.ts after each rental or sales sync (the answers' wording is tested against it);
      move REFERENCE_LOAN_RATE in src/lib/utils/borrowing-power.ts when RBA table F6 moves.


Source: `docs/seo-baselines/2026-09-30/commercial-intent-review.md` (untracked, in the shared checkout).

- [x] 3.3b [code+content] Calculators: LMI and negative gearing (review 3.3, priority 8, second half). DONE 1 Oct 2026 — PR #91.
      New /lmi-calculator, H1 "LMI calculator: what lenders mortgage insurance costs in 2026": price, deposit or loan,
      state, first home buyer; LVR, premium, stamp duty on the premium, total; the 5% Deposit Scheme alternative linked
      to /guides/first-home-guarantee. Engine src/lib/lmi-calc.ts (tested). Rate table: Home Loan Experts' published
      lender table (page updated 18 May 2026), because Helia's estimator publishes no table, and a sweep of its API was
      stopped; Helia's own quotes for the two FAQ examples are printed beside ours ($9,862 and $16,706 against our
      $11,772 and $17,042). Duty on LMI from each revenue office: NSW exempt since 1 Jul 2017, Vic 10%, Qld 9%, WA 10%,
      SA 11%, Tas 10%, NT 10%, ACT abolished 1 Jul 2016.
      New /negative-gearing-calculator, H1 "Negative gearing calculator: your weekly cost after tax (2026)": ATO 2026–27
      resident rates selectable, the guide's worked example as the default ($135 a week at 37%), and what 1 July 2027
      does to an established home bought after 7:30pm AEST 12 May 2026 ($215 a week with no other rental income).
      Engine src/lib/negative-gearing-calc.ts (tested against the guide's figures). Evidence: 3,600 and 2,400 searches a
      month, zero impressions, calculator-only SERPs. Found while building, not changed here: (i) /guides/cgt-changes-2026-budget
      says properties held on budget night keep the 50% discount, but the ATO (29 Jun 2026) and our now-law post say the
      CGT change applies to gains accruing after 1 Jul 2027 on existing property too; (ii) /guides/negative-gearing-australia
      still says negative gearing is unchanged "as of April 2026" and tabulates the 2023–24 rates (19%, 32.5%); (iii) prose
      tables overflow phone screens in guides (the LMI guide is 431px wide at 375).
- [x] 53. [code+copy] DONE 1 Oct 2026 — PR #83. rental-market pages receive landlord intent and
      hold nothing (review 3.1, priority 1). "Rental appraisal {suburb}" (599 impressions), "property managers
      {suburb}" (188), "{suburb} rental investment" (875, all WA), "rent reviews {suburb}" (199) and "property management
      fees {suburb}" (75) land on /suburbs/{slug}/rental-market at 35 to 45. Built on every branch of the template:
      (a) a rental appraisal request (new lead type `rental-appraisal`, fee disclosure as on the appraisal form);
      (b) "What property managers charge in {Suburb}": eight-state fee table (LocalAgentFinder 13 Mar 2026, REIQ
      1 Dec 2023), other fees (Houst 11 May 2026), and a worked line on the suburb's median house rent where its source
      is named; (c) FAQs "Is {Suburb} a good rental investment?" (published yield and 12-month change only, withheld
      when neither is published), "What do property managers charge in {Suburb}?" and the two PAA questions on rental
      appraisals. Indexing unchanged: no rental row, still noindex and out of the sitemap.
      Before merging: a property manager has to be ready to take the leads (the form promises a call within one
      business day; leads arrive in the lead inbox, routed like every other type). Open from 3.1: (c) of the review,
      a WA rental feed, which is what would let the Perth "rental investment" pages index.
- [ ] 3.1 (c) [code+data] WA rental feed. CODE MERGED 1 Oct 2026 — PR #96; the column change (scripts/sql/2026-10-01-suburb-rental-stat-median-rent-all.sql) and the first import wait for Jos's go, commands in the PR. rental-wa reads the WA
      bond lodgements (WA Rental Bonds Data, National Housing Data Exchange, CC BY 4.0) and publishes quarterly
      all-dwellings medians (11+ bonds, fewer than half at one rent, a published median in the four newest quarters)
      into a new column, SuburbRentalStat.medianRentAll, never medianRentHouse; WA rental-market pages and profiles
      show it as "All dwellings" with no yield. Dry run against production (read-only): 3,934 rows for 367 suburbs,
      367 WA rental-market pages would leave noindex, all 367 in the rental-market sitemap; Nedlands $900, Joondalup
      $640, Floreat $1,000, Port Hedland $988 (July to September 2026); Karratha withheld (10 of 15 bonds at $280).
      Not live until Jos: applies scripts/sql/2026-10-01-suburb-rental-stat-median-rent-all.sql, runs
      `npx tsx scripts/sync/run.ts rental-wa --dry-run` then without --dry-run, then revalidate-paths and
      indexnow-ping (48). Afterwards, separately: clear-rent-proxies --state WA (dry run first) for the census
      proxies left on WA suburbs the feed does not cover (1,440 WA localities get no row), and scheduling (the
      release lands on the 1st to 3rd, so mid-month in Jan/Apr/Jul/Oct catches the full quarter).


Source: `docs/seo-baselines/2026-09-30/commercial-intent-review.md` (section and priority numbers refer to it).

- [x] Priority 10 (section 4, reading 2). [code] Index plumbing for the zero-impression guides. DONE 1 Oct 2026 — PR #90. The index check found nothing blocking (every guide 200, self-canonical, no noindex)
      but three plumbing faults: the guides sitemap stamped the request time as lastmod on 97 of 155 entries; the
      guides hung off /guides alone (89 of 155 listed there; /first-home-buyers, /buying-guide and /tools linked none,
      /investing one, /selling two); and the glossary entries Google indexed in place of the conveyancing and LMI
      guides linked neither guide. Shipped: one guide registry (src/lib/guides/registry.ts, titles and dates from each
      guide's FRONTMATTER via src/lib/data/static-guides.json, `npm run guides:manifest`) feeding the sitemap's lastmod,
      /guides (all 155 in nine sections), the category pages, a shared "Related guides" list on the five hubs, and a
      glossary term to guide mapping (33 terms). Tests: tests/seo/guides-sitemap.test.ts (no lastmod later than the
      page's date), tests/seo/guide-registry.test.ts. Left for Jos: resubmit /sitemap.xml in Search Console and request
      indexing for help-to-buy-scheme-australia, lenders-mortgage-insurance-guide, conveyancing-guide and
      building-pest-inspection after the refresh PRs land; the /house-and-land noindex decision (the check recommends
      noindex until it has stock). Read in Search Console around 28 Oct: the four guides' coverage and the guides'
      impressions against the 30 Sep baseline.


Source: `docs/seo-baselines/2026-09-30/commercial-intent-review.md` (section 1, Bing table) and item 3.3b's "found while building" (i) and (ii) above.

- [x] 3.3b follow-up [content] Investor tax pages match the law as passed. DONE 1 Oct 2026 — PR #95.
      /guides/cgt-changes-2026-budget (the site's top Bing page: 51 clicks, 1,280 impressions, position 5.0 in the 28 days
      to 25 Sep) said property held on budget night keeps the 50% CGT discount, that the change covers only residential
      property bought after 7:30pm AEST 12 May 2026 and applies to sales from 1 Jul 2026, and that shares and pre-1985
      assets are untouched. The Treasury Laws Amendment (Tax Reform No. 1) Act 2026 (passed 25 Jun, assent 26 Jun 2026),
      its explanatory memoranda, the Budget explainer (12 May 2026) and the ATO (29 Jun 2026) say the CGT change applies
      from 1 Jul 2027 to gains accruing from that date on every CGT asset of individuals, trusts and partnerships,
      already-owned assets split at 1 Jul 2027. Same URL and article form, dated correction note at the top, rewritten
      body, sources listed, updatedAt 2026-10-01. /guides/negative-gearing-australia: 2026 status rewritten (law, cut-off,
      new builds, who is covered), tax table on the ATO 2026–27 rates from the negative gearing calculator's engine,
      CGT section and FAQs updated. /cgt-calculator: sourced note on gains after 1 Jul 2027, FAQ and limits updated.
      Tests: tests/seo/tax-reform-2027-pages.test.ts. After merge: `npm run publish:blogs` (Jos's call; CLAUDE.md).
      Still saying the old thing, not changed here (one item at a time): /guides/federal-budget-2026-property (property
      owned on 12 May 2026 "keeps the 50% CGT discount on sale"; the CGT change limited to residential property);
      /guides/negative-gearing-changes-2026-budget (SMSFs "same rules apply", but super funds are excluded; trust and
      company structures "never subject", but the change covers companies and most trusts; a link to
      /tools/negative-gearing-calculator, which has no route); the glossary's CGT entry (src/lib/data/glossary.ts,
      auto-linked from articles); and the CGT calculator widget, which applies only the 50% discount.
Source: `docs/seo-baselines/2026-09-30/commercial-intent-review.md` (section 3.7, priority 10).

- [x] 3.7 (priority 10). [code] /house-and-land indexes only while it has stock. DONE 1 Oct 2026 — PR #94.
      The house-and-land decision the review left open (and the Priority 10 item above left for Jos). The hub was
      "crawled, currently not indexed": 36 words around "0 new packages", indexable, listed in /house-and-land/sitemap.xml
      and /pages/sitemap.xml; production held 0 HouseAndLandPackage rows (read-only count, 1 Oct 2026). Shipped: one
      predicate, hasHouseAndLandStock (src/lib/house-and-land-indexability.ts), from one cached count (an hour, tag
      `house-and-land-stock`) read by the hub, the package pages, /house-and-land/sitemap.xml and /sitemap.xml. With no
      stock the hub answers noindex, follow, says no packages are listed, and links the house-and-land guide, the builder
      guide, the FHOG and first home buyer guides (national and eight states), the eight stamp duty guides, the stamp duty
      calculator and /first-home-buyers; the sitemaps leave it out, and the index leaves out the empty house-and-land
      sitemap. The first package reverses it within the hour (or at once: POST /api/revalidate with that tag), no code
      change. Noindex is the stopgap; the cause is no stock. Not built: the review's other option, city pages
      ("house and land packages brisbane" 3,600, "qld" 390, "perth" 5,400) with a builder enquiry form, which needs
      stock or a builder partner first. Found, not changed: /data prints "0" house & land packages beside "New build
      packages from participating builders" (rule: never print a 0 as a figure). Tests:
      tests/seo/house-and-land-indexability.test.ts.
