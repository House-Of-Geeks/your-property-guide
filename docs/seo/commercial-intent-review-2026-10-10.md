# Commercial-intent and competitor gap review, 10 October 2026

For the commercial queries yourpropertyguide.com.au should win, does Google send the searcher to the right page, and does that page match what the live results reward? This review follows the 30 September review, most of which shipped on 1 October (PRs #81 to #96), and reads the first week after that deploy: Search Console 10 July to 7 October 2026, live Google results pulled 10 October.

The page-level fixes are in one file per vertical in [`commercial-intent-pages-2026-10-10/`](commercial-intent-pages-2026-10-10/README.md). Summary CSVs are in `data/2026-10-10/`; raw API responses, scripts and the full evidence packs stay in the run folder `~/Desktop/Ads/ypg-commercial-intent-review-2026-10-10/`. No site code was changed.

## Data pulled

| Source | What | Window |
|---|---|---|
| Search Console (service account, `sc-domain:yourpropertyguide.com.au`) | query, page, query×page, date, country, device; sitemaps | 10 Jul to 7 Oct 2026 (90 days); 1 to 7 Oct (since the deploy, and the last 7 days) |
| URL Inspection | 1,233 URLs: all 318 money pages (pages, guides, rankings, market reports) plus top-impression and random samples of each bulk template | 10 Oct 2026 |
| Bing Webmaster | traffic, query, page, crawl stats | sampled rows to 7 Oct 2026 |
| Microsoft Clarity (project w5r5pytsib) | organic landing pages, channels, dead clicks and quickbacks; the tag fires on the live site | 12 Jul to 9 Oct 2026 |
| Google Ads | no YPG account under the MCC; nothing to pull | |
| Keyword Planner (AU, through the MCC) | volume, CPC and competition for 817 keywords (258 targets plus the top GSC queries) | 12-month averages |
| DataForSEO | search intent for the top 3,000 non-postcode queries; AI search volume for 613 queries and 1,000 People Also Ask questions; 254 live SERPs (top 20, PAA depth 2, AI Overview); 24 city and device checks plus AI Mode; backlinks for us and 12 rivals; 104 blocked rival pages re-rendered | 10 Oct 2026 |
| Live pages | 916 of our pages and 1,818 rival pages parsed (title, H1, intro, H2s, words, tables, inputs, schema, FAQ, author) | 10 Oct 2026 |
| Production database | one read-only query of the Suburb table's sales source by state | 10 Oct 2026 |

DataForSEO spend for this run was about US$2.10; the shared balance read US$50.60 at the end (it was topped up during the run). Four of the 258 target SERPs failed at DataForSEO after a retry ("appraisal for rent canberra", "property appraisal bandiana", "canberra property market value report", "first home buyer house and land nsw") and are left out.

## 0. Fix first

### 0.1 Sitewide breakages

**NSW and most VIC suburb medians are withheld because a sync stamped the wrong source label.** Every suburb profile prints "Verified median pending" when its sales source is not trusted (`src/lib/suburb-data-quality.ts:26`, `src/lib/published-medians.ts`). A read-only production query on 10 Oct found:

| State | statsSource | Rows | With a median | 5+ house sales |
|---|---|---:|---:|---:|
| NSW | rental-nsw | 5,275 | 5,236 | 1,892 |
| VIC | rental-vic | 2,749 | 2,732 | 0 |
| VIC | sales-vic | 748 | 748 | 0 |
| QLD | sales-qld / abs-census-2021 / rental-qld / sales-abs | 1,832 / 1,489 / 533 / 61 | | 0 |

The figures are in the rows (Mosman $5,535,000 on 228 sales, Castle Hill $2,500,000 on 455, Lane Cove $3,195,000 on 52, Bondi $4,300,000 on 35, Dubbo $625,000 on 1,028), but the label says `rental-nsw`, which the gate does not trust. Every NSW row was last updated on 1 October, the day the quarterly sync runs (`scripts/cron/quarterly.sh` runs `rental-vic` and `rental-nsw` before `sales-nsw`). The rental feeds' own code says they must not stamp this field; the comment in the 7 Sep rental-nsw rewrite records the same bug ("blanket-clobbered every NSW suburb's sales label weekly and suppressed all NSW medians. Fixed 2026-07-03"). Which process wrote the label on 1 Oct was not traced in this session.

What it costs, on the live site:
- All 80 NSW profiles parsed, 50 of 53 QLD, 22 of 27 WA, 8 of 31 VIC and 7 of 21 SA print "Verified median pending", while 197 of 222 titles still read "{Suburb} Postcode {pc} ({STATE}) – Suburb Profile & Median Price". 77% of the parsed profiles' post-deploy impressions land on a page that withholds its median.
- The agents pages are indexable only with a reliable median (`src/lib/suburb-agents.ts:92`). 53 of 172 parsed agents pages now answer `noindex` (Mosman, Castle Hill, Lane Cove North, Carindale, Kiama, Goulburn, Yamba, Grafton, Bathurst, Byron Bay), carrying about 45% of the parsed agents pages' post-deploy impressions. Google last crawled them 24 to 28 Sep and still lists all 190 inspected agents pages as indexed: they will drop out as it recrawls.
- Every list that reads the same rule (rankings, price guide, market reports, state pages) leaves NSW out.

Fix, in order (production writes are Jos's call, dry run first):
1. Find the writer: check the Railway quarterly cron's deploy and logs for 1 Oct, and any other runner of `rental-nsw` / `rental-vic` (the GitHub quarterly workflow is commented out).
2. Repair the label where the sales feed wrote the median: `statsSource = 'sales-nsw'` for NSW rows whose median came from the Valuer General aggregate (the 6 Sep `sales-nsw --from-rows` run covered 3,034 suburbs), `sales-vic` for the VIC rows the VIC feed wrote. Dry run with counts by state first.
3. Guard it: a test that no rental source writes `statsSource`, and a post-sync check that fails the run when the count of trusted NSW rows drops by more than 10%.
4. `revalidate-paths` for suburb, agents and list pages, then the request-indexing list in 0.4.

**No Google Analytics.** The site loads Clarity and Quantcast only (`src/app/layout.tsx:118`); there is no GA4 tag, so there is no conversion data by landing page. Clarity works (1,843 organic sessions in 90 days). Decide whether GA4 (or Vercel Web Analytics) is wanted; Search Console plus Clarity covers SEO, not lead attribution.

**Stale server errors on the ranking hubs.** URL Inspection shows "Server error (5xx)" for `/best-suburbs/for-families`, `/highest-growth`, `/most-affordable`, `/lowest-flood-risk` and `/best-rental-yield`, from crawls in June. #63 fixed them on 29 Sep; they answer 200 now. They need a recrawl (0.4).

Robots.txt, the sitemap index (26 child sitemaps, 55,554 URLs) and canonicals are sound: all 916 parsed pages answer 200 with a canonical, and two comparison pages canonical to the reversed pair by design.

### 0.2 Wrong or risky statements on live pages

Checked on the live pages on 10 Oct. The per-vertical files carry every instance with file and line; these are the ones to fix before any page work, worst first. Where a vertical file marks a legal point "verify", it came from the analyst's own knowledge, not from a source fetched in this run, and must be checked against the regulator before the copy changes.

| # | Problem | Where (source) | Fix |
|---|---|---|---|
| 1 | **First home grants and concessions are wrong on ten pages.** NSW says First Home Buyer Choice "remains available" (Revenue NSW: closed 1 Jul 2023) and lists the closed Shared Equity Home Buyer Helper; WA gives a $450,000 exemption (RevenueWA: $600,000 since 7 May 2026); TAS gives a $30,000 grant and a 50% concession (SRO: $20,000 from 1 Jul 2026, exemption ended 30 Jun 2026); plus errors on NT, ACT and SA caps. Bing shows the NSW guide at 6.1 (1,940 impressions). Our own stamp duty engine has the right figures. | `src/app/(marketing)/guides/first-home-buyer-{nsw,wa,tas,nt,act,sa}/page.tsx`, `first-home-buyer-guide/page.tsx:249-289`, `first-home-owner-grant-australia/page.tsx`, `src/lib/persona-hub-content.ts:78-110`, `src/lib/data/blog-posts/first-home-buyer-schemes-by-state-australia-2026.ts` | One sourced data file `src/lib/data/first-home-grants.ts` in the shape of `home-guarantee.ts`; render every grant and duty-relief line from it and the engine; a test that fails on any threshold not in the file or on a closed scheme named as current. [Buying file, 0.1 and 0.2] |
| 2 | **/rba-cash-rate says 4.35% "as of 16 June 2026".** The RBA's own page (in this run's SERP pull) reads "Cash rate target 4.60 %", effective 30 Sep 2026; the August and September decisions are missing and past meetings are listed as "remaining". Bing ranks it at 7.1. | `src/app/(marketing)/rba-cash-rate/page.tsx:30-31, 72-77, 138, 165, 176` | Add both decisions, the next meeting (3 Nov 2026), a dated data file and a build test that fails when the latest entry is older than the last scheduled meeting. [Finance-tax F1] |
| 3 | **Old tax law still live.** /guides/federal-budget-2026-property says owners on 12 May 2026 "keep the 50% CGT discount"; /guides/negative-gearing-changes-2026-budget says "reflects the rules as legislated" but is wrong on SMSFs and trusts and links to a 404; the SMSF guide still offers new LRBA borrowing; the CGT and negative gearing glossary entries, the /investing FAQs, the rentvesting guide (updated 7 Oct) and the how-to-sell guide give the pre-2027 rules. | `src/lib/data/blog-posts/federal-budget-2026-property.ts:16-95`, `negative-gearing-changes-2026-budget.ts:9-107`, `guides/smsf-property-guide/page.tsx`, `src/lib/data/glossary.ts:93, 399`, `persona-hub-content.ts:234-261`, `guides/rentvesting-australia/page.tsx:58, 303, 390`, `guides/how-to-sell-a-house-australia/page.tsx:438-444` | The #95 pattern on each: dated correction note, body to the Tax Reform No. 1 Act and the ATO page, sources, `updatedAt`. [Finance-tax F2 to F8; renting 0.5; selling 0.12] |
| 4 | **The CGT calculator uses retired rates** (19% and 32.5%), gives companies the 50% discount the page says they don't get, and leaves out Medicare. | `src/components/calculators/CGTCalculator.tsx:8, 62-74, 284` | ATO 2026-27 rates from the negative gearing engine; no discount for companies; then a 1 July 2027 mode. [Finance-tax F4, P1] |
| 5 | **The NSW renters' rights guide says no-grounds evictions are still legal**, in the body and the FAQPage JSON-LD; NSW ended them on 19 May 2025. Six sibling guides repeat it. The VIC guide misses the 2025 laws; SA, QLD, WA, TAS and NT eviction rules need checking (SA is the vertical's second Bing page). | `guides/renters-rights-nsw/page.tsx:52-289`; blurbs in `renters-rights-{wa,tas,sa,qld,act,vic}/page.tsx` | Rewrite to the Residential Tenancies Act 2010 as amended, each rule sourced and dated; one law check across all eight guides, SA first. [Renting 0.2 to 0.4] |
| 6 | **The rental appraisal form promises a property manager nobody has confirmed.** Every rental-market page says details go "only to the one local property manager we match you with, who pays us", and the success message promises a call within one business day; our own /real-estate-leads/appraisal-leads says we do not supply rental leads "at the moment"; #83 required a property manager before merging. | `src/components/suburb/RentalAppraisalForm.tsx:118, 251, 259`, `src/lib/rental-landlord.ts:318`, `src/lib/lead-emails.ts:303` | Check where the `rental-appraisal` leads since 1 Oct went. Where no property manager is contracted, hide the form (keep the fee table and FAQs). No new landlord capture until settled. [Renting 0.1] |
| 7 | **Commission figures have no source, and the site prints five national ranges.** The state guides' sources link to home pages that publish no rate; `commission-rates.ts` cites a document with no rates in it; "Every figure on this page is sourced and dated" shows on pages with no sources block; the commission calculator leaves GST out of the total while the selling costs calculator adds it; "earns back their commission many times over" fails its own arithmetic; the fees guide's cooling-off line contradicts our agency-agreements guide. Agents pages with a withheld median print "1.6% to 3.25%" as the state range. | `src/lib/data/commission-rates.ts:1-24`, `GuideArticleLayout.tsx:226`, `CalculatorPageLayout.tsx:152`, `CommissionCalculator.tsx:47-50`, `guides/real-estate-agent-fees-australia/page.tsx:49-336`, `suburbs/[slug]/agents/page.tsx:165` | A sourced per-state table (capital and regional rows, every cell footnoted and dated, "No published range" where none exists), a `nationalRange()` helper so text cannot drift, a GST toggle, and the sourced banner only where sources render. [Selling 0.1 to 0.11; agents F2] |
| 8 | **Rankings that do not rank what they say.** "Most walkable" lists are alphabetical (the walk score caps at 100); "for families" ranks every suburb where family households, couples included, pass 40% but calls them "families with dependants"; lowest-flood-risk state pages are indexed with rows reading "No data"; Melbourne's "cheapest suburbs" are CBD apartment precincts ($381,000) because `sales-vic` writes no sales count. | `scripts/sync/sources/walkability.ts:127`, `src/lib/services/city-rankings-service.ts:142, 197-222`, `src/lib/city-editions.ts:212-349`, `src/lib/ranking-notes.ts:59-64`, `scripts/sync/sources/sales-vic.ts:196-210` | Rank walkability on the uncapped count (noindex the walkable editions until then); relabel the families criterion; flood pages noindex until a hazard feed loads (item 49); write the VIC sales count and restore the July CBD screens. [Suburbs 0.1, 0.2] |
| 9 | **City and comparison figures.** /property-market/adelaide prints $1,055,000 against the SA Valuer-General's $975,000 (June quarter); Brisbane's median is "the median of 23 suburb medians"; Moreton Bay's of 5, then used in a commission example in a lead block; Perth rent $350 a week is a census proxy; vs pages print "Growth +0.0%" and a wrong "% cheaper" (Frankston North 21% where it is 17%); /property-market/sydney promises a median it shows as N/A. | `src/lib/services/city-market-service.ts:116-155`, `src/lib/city-narrative.ts:44, 86`, `regions/[slug]/page.tsx:214, 315`, `suburbs/[slug]/vs/[compareSlug]/page.tsx:399-520`, `src/lib/compare-narrative.ts:55-57` | A coverage floor before any city or region median; official figures with their quarter below it; rents only from named feeds; growth only where measured; gap divided by the dearer suburb. [Suburbs 0.3 to 0.7] |
| 10 | **Unsourced state commentary with two wrong facts** (TAS $30,000 FHOG and 50% concession; ACT "full waiver ... regardless of property price" for downsizers) above every state ranking and market report. | `src/lib/data/state-commentary.ts:17-67` | Remove the blocks. [Suburbs 0.6] |
| 11 | **Promises the business cannot back.** "One agent who has recent sales in {suburb}", "within one business day", "We'll find the right person", "They know which lender will say yes", "what a lender will actually approve" (four hubs, the buying guide, a lead email), "Get an accurate value", "one top local agent", "typically saves $1,700 to $3,400"; /help-to-buy-calculator shows a green "Yes" for eligibility. | `suburbs/[slug]/agents/page.tsx:95-122`, `SuburbAppraisalCTA.tsx:138, 271`, `find-an-expert/page.tsx:67-244`, `persona-hub-content.ts:86, 224, 292`, `buying-guide/page.tsx:185`, `selling-guide/page.tsx:58-196`, `HelpToBuyCalculator.tsx:150` | Conditional wording and /appraisal's own coverage caveat beside every form; "an estimate of what a lender may lend"; eligibility is Housing Australia's and the lender's call. Keep the #57 disclosures, which are present. [Agents F4; finance-tax F9; selling 0.9-0.10; buying 20-21] |
| 12 | **/agents shows placeholder profiles as a "Vetted directory"**: three Thomson Property Group "Featured Agent" profiles with "0 (0 reviews)" and mobile numbers; a profile's meta says "0 properties sold" beside "SOLD 7". | `src/app/(marketing)/agents/page.tsx:17-65`, `src/lib/suburb-agents.ts:12-15` | Take them off the public route unless they are real, consenting agents; turn /agents into the agents-by-suburb hub. [Agents F5] |
| 13 | **Planning and building law on the new-homes guides (verify each).** VIC granny flats: "you typically need a council planning permit" (VC253, Dec 2023, removed it for small second dwellings in most zones); NSW names the wrong code (the Housing SEPP 2021 governs secondary dwellings); QLD, WA, SA approval and owner-occupier claims cite no instrument; the builder guide names the VBA (now the Building and Plumbing Commission) and a "$20,000 to $30,000+" warranty threshold (QLD $3,300). /renovating prints unsourced costs that contradict the sourced guide, under the same FAQ questions. | `guides/granny-flat-guide-{vic,nsw,qld,wa,sa}/page.tsx`, `guides/how-to-find-a-builder-australia/page.tsx:53-82`, `persona-hub-content.ts:342-387` | Rewrite each approvals section naming the instrument and clause, after checking it on the planning or legislation site; take the cost copy off /renovating. [New homes F1 to F8] |
| 14 | **Data faults readers see.** Kew East's agents page works commission on a $660,000 "house" median while its profile shows a $1,396,000 unit median ("-112% below"); Prahran, Malvern and Bandiana each exist under two postcodes with identical pages; LMI ranges in two guides contradict our sourced LMI calculator ($22,000 to $28,000 against $30,676 at 95% on $700,000); a glossary-linker bug prints raw HTML on four posts; three writers share one bio and one /about anchor. | `src/lib/published-medians.ts:62-64`, `suburbs/subpages/sitemap.ts:91-94`, `guides/lenders-mortgage-insurance-guide/page.tsx:54, 223`, `guides/how-much-deposit-to-buy-a-house/page.tsx:89`, `src/lib/utils/glossary-linker.ts:113-123`, `src/components/guide/AuthorBylineCard.tsx:66` | Withhold both medians when the unit median exceeds the house median; canonical the secondary postcode; quote the LMI calculator's figures; fix the linker; one bio per writer. [Agents F1, F6; buying 16; finance-tax F11, F12] |

### 0.3 Owner decisions that block page work

1. **The suburb data repair (0.1).** A production write to about 8,000 Suburb rows, plus finding what wrote the label on 1 Oct. Your go, after a dry run printed against production. The QLD rows labelled `rental-qld` (533) belong in the same check; QLD's ABS-based medians may be affected too.
2. **Who takes rental appraisal leads.** Is a property manager contracted in any state? If not, the form comes off until one is (renting 0.1).
3. **Agent coverage behind the match promise.** The 9 Oct Sent 24/7 setup notes show no agents on the YPG Vendor Leads campaign. Until coverage exists by suburb, the agents and appraisal pages should promise only what /appraisal already says: "Where we do not yet have one, we tell you rather than pass your details on."
4. **The /agents placeholder profiles.** Real and consenting, or removed.
5. **A named reviewer for the money pages.** A third of the rival pages name an author; 6% of ours do. Decide who (a real person with relevant credentials) reviews the tax, grant, commission and tenancy pages, and fix the shared bio. No invented authors.
6. **Where commission ranges come from.** The sourced table in item 7 needs a decision on sources (regulators for the rules; OpenAgent, LocalAgentFinder or REI data for the rates, each dated) or a survey of our own.
7. **Buyer's agent partners.** 51 impressions a day of "{suburb} buyer's agent" land on selling-agent pages. A buyer's agent hub with a buyer form can go now; city pages wait for a signed partner in that city.
8. **Builders.** House-and-land city pages wait for stock or a paying builder; /about's "builders" among the fee payers should go until one pays.
9. **URL changes.** Merging /states into /market-reports, folding the rentvesting state-by-state post into the guide and redirecting the first-home schemes blog post to /first-home-buyers each change URLs. Your call per item.
10. **Google Analytics 4 or not.** Clarity covers behaviour; nothing measures leads by landing page.

### 0.4 Request indexing, day by day

Google crawls only part of this site each day, and the 1 Oct changes mostly have not been seen. New URLs were found fast (the 24 best-suburbs city editions, the LMI, negative gearing, Help to Buy, FHSS and bridging calculators were crawled and indexed within days), but changed URLs wait for a recrawl:

| Pages, by last Google crawl | Pages | Impressions 24 to 30 Sep | 1 to 7 Oct | Change |
|---|---:|---:|---:|---:|
| Recrawled on or after 1 Oct | 132 | 3,998 | 9,080 | +127% |
| Last crawled 24 Sep to 1 Oct | 206 | 8,764 | 7,850 | -10% |
| Last crawled before 24 Sep | 443 | 15,885 | 13,701 | -14% |

Request indexing in Search Console (URL Inspection, "Request indexing", about 10 a day), in this order. Do the agents pages and NSW profiles only after the 0.1 repair, or Google will record them as `noindex`.

| Day | Pages (most demand first) | Why now |
|---|---|---|
| 1 | `/guides/conveyancing-guide`, `/guides/help-to-buy-scheme-australia`, `/guides/building-pest-inspection`, `/guides/stamp-duty-nsw`, `/guides/stamp-duty-qld`, `/guides/stamp-duty-vic`, `/guides/stamp-duty-wa`, `/stamp-duty-calculator`, `/guides/cgt-changes-2026-budget`, `/guides/negative-gearing-australia` | The first three are not indexed and were rewritten on 1 or 7 Oct (24,280, 12,100 and 9,700 searches a month across their targets); the stamp duty pages went calculator-first on 1 Oct and were last crawled in June and July; the two tax pages were corrected on 1 Oct (#95) and last crawled 26 Jul and 3 Jul. All checked correct by the analysts. |
| 2 | `/guides/real-estate-commission-qld`, `/guides/real-estate-commission-sa`, `/guides/property-management-fees-australia`, `/guides/renovation-cost-australia-2026`, `/appraisal`, `/guides/how-much-is-my-house-worth-australia`, `/guides/stamp-duty-sa`, `/guides/first-home-guarantee`, `/guides/first-home-super-saver-scheme`, `/guides/home-loan-pre-approval-australia` | The commission guides are not indexed; the rest changed on 1 or 7 Oct and were last crawled in July or August. |
| 3 | `/best-suburbs/for-families`, `/best-suburbs/highest-growth`, `/best-suburbs/most-affordable`, `/best-suburbs/best-rental-yield`, `/guides/cost-of-selling-a-house-australia`, `/guides/real-estate-agent-fees-australia`, `/guides/how-to-sell-a-house-australia`, `/guides/buyers-agent-cost-australia`, `/borrowing-power-calculator`, `/suburbs/nedlands-wa-6009/rental-market` | The four hubs still carry June's server error in Google's record. Leave out `/best-suburbs/lowest-flood-risk` (0.2, item 8). Nedlands 6009 is the indexable WA page (6909 is the PO box locality). |
| When each fix lands | The first home guides and hub, the LMI guide, `/rba-cash-rate`, the federal budget, negative gearing changes and SMSF pages, the NSW and SA renters' rights guides, the rentvesting guide, the VIC and NSW granny flat guides, `/guides/how-to-find-a-builder-australia` | Requesting a recrawl of a page that is still wrong spreads the error. |
| After the 0.1 repair and revalidation, 10 a day | NSW and VIC agents pages and profiles by impressions: Castle Hill, Lane Cove, Kiama, Goulburn, Yamba, Grafton, Kyogle, Narooma, Mosman, Bermagui agents; Bondi, Dubbo, Moorebank, Darling Point, Mascot, Hawthorn East, Toorak profiles | Requested before the repair, Google would record them as noindex. |

Full list with last-crawl dates and demand: `data/2026-10-10/request-indexing.csv`.

## 1. Headline findings

1. **The 1 Oct quarterly sync switched off NSW and most VIC suburb medians.** 5,275 NSW rows carry the `rental-nsw` label where `sales-nsw` belongs, so every NSW profile says "Verified median pending" (80 of 80 parsed) under a title promising "Median Price", and every NSW agents page answers `noindex`. Google has not recrawled those agents pages yet; it will drop them when it does. Fix this before anything else. (0.1)
2. **The 1 Oct deploy works where Google has looked.** Pages recrawled since 1 Oct gained 127% in impressions (3,998 to 9,080 a week); pages not recrawled fell 10% to 14%. Clicks rose from 11.6 to 14.3 a day and impressions from 5,860 to 7,152. Most changed pages were last crawled in June or July. Request indexing is the lever. (0.4, 2.1)
3. **The biggest guides are not in Google at all.** Conveyancing (24,280 searches a month across its targets), Help to Buy (12,100), building and pest (9,700), LMI (5,400), home loan pre-approval (2,400), and the QLD and SA commission guides are "crawled, currently not indexed", each last crawled before its rewrite. New URLs, by contrast, were indexed within days. (2.4)
4. **Wrong facts on live money pages, mostly from figures typed by hand.** First home grants on ten pages (NSW First Home Buyer Choice "remains available", WA $450,000, TAS $30,000), the cash rate (4.35% shown, 4.60% actual), pre-2027 CGT and negative gearing rules on seven pages, a CGT calculator on retired rates, NSW no-grounds evictions "still permitted", and unsourced commission ranges in five national versions. The figures that come from sourced data files (Help to Buy, 5% Deposit Scheme, FHSS, stamp duty, LMI) are right everywhere. (0.2)
5. **Several lead forms promise more than the business has confirmed.** Rental appraisal requests "go only to the one local property manager", yet our own agent page says we don't supply rental leads; agents pages promise "one agent who has recent sales in {suburb}" within a business day; hubs say "what a lender will actually approve". (0.2, 0.3)
6. **On-page shape is not what holds the pages back.** Against the top 5 on 233 SERPs, our pages carry the query in the title more often (70% vs 35%), the year (67% vs 15%), a table (64% vs 24%), a tool (47% vs 31%), FAQ schema (84% vs 15%) and more words (1,907 vs 1,221). They lack a named author (6% vs 33%) and links: 58 referring domains, none real, against 530 to 2,080 for the agent-comparison sites. Bing, which weighs links less, ranks the same guides 2.6 to 5.2. (4, 2.3, 2.5)
7. **Half the commercial queries land on the right page (50%).** Commission is 63% split (state guides take the national phrases; "real estate agent fees" lands on the VIC guide); appraisal is 78% wrong (suburb appraisal searches land on agents and rental pages without the word); best suburbs 59% wrong. (3.1)
8. **"{suburb} real estate agents" is now the largest commercial family** (about 390 queries and 3,000 impressions a week at position 27), but half the queries with enough data show more impressions than searches (rank trackers), and live checks put us at 18 to 19 at best. The family's future depends on item 1 and on giving agents pages content that does not hinge on a median. (2.2, Agents file)
9. **Three city rankings don't rank what their titles say.** "Most walkable" is alphabetical, "for families" counts couples without children, flood risk pages are indexed with "No data", and Melbourne's cheapest suburbs are CBD apartment precincts. (0.2)
10. **AI search is where process demand lives.** AI Overviews show on 219 of 254 target SERPs and cite us on 6. "Buying a house australia" draws 15,000 AI searches against 720 on Google, "selling a house" 9,620 against 140. (5)
11. **Bing matches Google on clicks** (931 against 944 in 90 days) from a fifth of the impressions. (2.3)
12. **There is no Google Analytics on the site**, only Clarity and Quantcast, so no lead data by landing page. (0.1)

## 2. Where we stand

### 2.1 Search Console

| Window | Days | Clicks | Clicks a day | Impressions a day | Average position |
|---|---:|---:|---:|---:|---:|
| 90 days (10 Jul to 7 Oct) | 90 | 944 | 10.5 | 5,172 | 13.7 |
| Two weeks before the deploy (17 to 30 Sep) | 14 | 163 | 11.6 | 5,860 | 11.1 |
| Since the deploy = last 7 days (1 to 7 Oct) | 7 | 100 | 14.3 | 7,152 | 14.9 |

Clicks rose 23% and impressions 22% in the first week; average position fell because Google started showing new and changed pages (agents, calculators, guides) at deeper positions. Mobile carries 56% of clicks at an average position of 10.5, desktop 19.7. Australia is 92% of impressions.

Where the clicks and impressions go, by template:

| Template | Clicks, 90 days | Impressions, 90 days | Position | Impressions a day, 90 days | Since the deploy |
|---|---:|---:|---:|---:|---:|
| Suburb rental-market | 281 | 34,662 | 15.8 | 385 | 491 |
| Suburb profile | 142 | 283,882 | 9.4 | 3,154 | 3,541 |
| Suburb schools | 124 | 10,624 | 10.2 | 118 | 159 |
| Suburb other (comparisons, streets) | 89 | 11,139 | 13.8 | 124 | 104 |
| Address pages (answer 410) | 66 | 3,050 | 7.7 | 34 | 0 |
| Home | 52 | 1,950 | 11.3 | 22 | 24 |
| Best suburbs | 46 | 2,830 | 20.6 | 31 | 103 |
| School | 41 | 5,854 | 10.4 | 65 | 35 |
| Guides (other) | 34 | 10,712 | 49.2 | 119 | 185 |
| Guides: commission and selling costs | 23 | 10,086 | 28.0 | 112 | 341 |
| Postcode | 14 | 63,818 | 9.5 | 709 | 792 |
| Suburb agents | 11 | 11,583 | 22.9 | 129 | 996 |
| Calculators | 1 | 11,032 | 68.8 | 123 | 198 |
| Stamp duty guides | 0 | 597 | 79.1 | 7 | 1 |

Commercial and transactional impressions a day by vertical, the 83 days before the deploy against the 7 days after (`vertical-prepost.csv`): agents 33 to 566, selling 11.5 to 82 (position 53 to 34), appraisal 8.6 to 65 (36 to 25), commission 24 to 62, suburb data 25 to 60, buyer's agent 2.5 to 51, borrowing 23 to 49, best suburbs 6 to 26, property management 8 to 23, LMI 0.1 to 11, conveyancing and inspections 1.2 to 10.7. Stamp duty held at 3 a day (its guides have not been recrawled), first home fell from 2.4 to 1.0 and renovation from 8.3 to 5.7. The agents baseline is diluted (the pages launched 16 Sep), and part of the agents growth is automated (2.2).

Clarity, organic landing pages over 90 days: `/guides/cgt-changes-2026-budget` 128 sessions (225 seconds engaged, 175 dead clicks), `/guides/real-estate-commission-nsw` 85, `/guides/real-estate-agent-fees-australia` 82, home 62, `/guides/real-estate-commission-qld` 46, `/guides/cost-of-selling-a-house-australia` 40. "Other" (no referrer) is the largest channel at 2,473 sessions with 31 seconds engaged, which looks like bots or app traffic.

### 2.2 Impression share and live positions

Search Console's average position counts only the searches where the site was shown. Against Keyword Planner volumes, the median impression share for queries averaging a top-10 position is 64% (111 queries), far higher than a new site's: YPG is genuinely shown. But those queries are almost all postcode lookups ("bondi postcode" 866 impressions at 9.1, 86% share, no clicks), which Google answers on the results page.

Commercial queries that average a top-10 position do not hold live (24 SERPs across Sydney and Brisbane, desktop and mobile):

| Query | GSC position since the deploy | Live |
|---|---:|---|
| lane cove real estate agents | 10.4 (90 days) | 18 to 19; absent on Brisbane mobile |
| surry hills real estate agents | 4.9 (90 days) | not in the top 20 anywhere |
| lenders mortgage insurance calculator | 10.9 | not in the top 20 |
| median house price dandenong | 9.0 | not in the top 20 |
| cost of selling a house | 13.8 (90% share) | 9 on Sydney mobile only |
| bondi postcode | 9.1 | 6 to 9 from Brisbane, absent from Sydney |

AI Mode cited us for none of the six. Treat "position 4 to 8, zero clicks" on a commercial query as Google testing the page, not as a snippet problem.

16 queries have more impressions than searches (752 of 12,115 impressions): rank trackers or scrapers. Six of the 12 agents queries with enough data are among them (Malvern 2.3 times its searches, Kyogle 2.0, Prahran 1.6), so agencies tracking their own suburb terms inflate the agents family.

Pages that collapsed since the deploy: three suburb profiles (Woolloongabba 60 to 7 a day, Woodvale 30 to 6, Echuca 26 to 6). None is a template-wide drop.

### 2.3 Bing

Bing sent 931 clicks from 85,974 impressions in 90 days, almost as many clicks as Google from a fifth of the impressions. Since the deploy: 16.4 clicks and 730 impressions a day, against 14.4 and 849 in the two weeks before. Bing ranks the guides Google buries: `/guides/cgt-changes-2026-budget` 95 clicks at 5.2, `/guides/real-estate-agent-fees-australia` 94 at 3.9, `/guides/real-estate-commission-nsw` 71 at 2.9, `/guides/cost-of-selling-a-house-australia` 37 at 3.0, `/guides/real-estate-commission-qld` 29 at 2.6, `/guides/property-management-fees-australia` 27 at 4.5. Bing's index holds 48,154 pages; the last crawl day logged 1,683 crawled, 195 4xx and 103 5xx. The same pages at 3 on Bing and 25 to 45 on Google points at authority and crawl, not page shape.

### 2.4 Index status

| Template | Inspected | Indexed | Crawled, not indexed | Discovered, not indexed | Other |
|---|---:|---:|---:|---:|---|
| Money pages (pages, guides, rankings, reports) | 318 | 247 | 61 | 4 | 5 server error (stale), 1 unknown |
| Suburb profiles | 270 | 204 | 46 | 4 | 11 noindex, 5 redirect |
| Suburb agents | 190 | 190 | 0 | 0 | |
| Suburb rental-market | 170 | 162 | 2 | 5 | 1 unknown |
| Postcodes | 101 | 57 | 42 | 2 | |
| Schools and school sub-pages | 120 | 85 | 31 | 4 | |
| Regions, states, market reports | 39 | 14 | 25 | 0 | |

Money pages not indexed, by the demand they are meant to win: `/guides/conveyancing-guide` (24,280 searches a month across its target queries), `/guides/help-to-buy-scheme-australia` (12,100), `/guides/building-pest-inspection` (9,700), `/guides/lenders-mortgage-insurance-guide` (5,400), `/guides/home-loan-pre-approval-australia` (2,400), `/guides/first-home-buyer-vic` (1,600), `/guides/real-estate-commission-qld` (640), `/guides/real-estate-commission-sa`. Each was last crawled in June or July, before its rewrite. All eight `/states/*` pages and 14 state ranking pages are crawled, not indexed. Full list: `money-not-indexed.csv`.

### 2.5 Links

58 referring domains; none has a DataForSEO rank of 100 or more with a spam score under 30, and 47 have spam scores of 50 or more (a .shop, .online, .site network first seen August to October: no value, no harm, no disavow needed). The rivals on our SERPs: realestate.com.au 39,572, domain.com.au 23,583, REIWA 3,209, property.com.au 3,552, OpenAgent 2,080, LocalAgentFinder 783, WhichRealEstateAgent 530. Authority is the ceiling on head terms; the SERPs worth fighting are those where small pages rank (section 6).

## 3. Commercial intent matching

### 3.1 By vertical

763 commercial and transactional queries with 3+ impressions since the deploy, 5,697 impressions. The page Google shows most is the right one for 50% of them.

| Vertical | Impressions | Right page | Wrong page | Split | No page |
|---|---:|---:|---:|---:|---:|
| Agents | 3,081 | 62% | 20% | 15% | 3% |
| Selling | 451 | 37% | 21% | 37% | 4% |
| Commission | 315 | 11% | 20% | 63% | 6% |
| Appraisal | 303 | 17% | 78% | 6% | 0% |
| Suburb data | 299 | 32% | 33% | 16% | 18% |
| Borrowing | 209 | 86% | 9% | 2% | 3% |
| Yield | 140 | 38% | 32% | 11% | 19% |
| Best suburbs | 128 | 10% | 59% | 16% | 15% |
| Buyer's agent | 123 | 28% | 11% | 15% | 46% |
| Property management | 100 | 17% | 43% | 37% | 3% |
| Renting | 62 | 71% | 18% | 0% | 11% |
| LMI and deposit | 51 | 94% | 6% | 0% | 0% |
| Rental investment | 49 | 84% | 16% | 0% | 0% |
| Conveyancing and inspections | 46 | 7% | 52% | 26% | 15% |
| Mortgage | 42 | 19% | 81% | 0% | 0% |
| Renovation | 21 | 19% | 81% | 0% | 0% |
| Stamp duty | 16 | 0% | 100% | 0% | 0% |

The failing verticals and why:
- **Commission (11% right, 63% split):** the national fees guide and the eight state guides compete for the same national phrases; "real estate agent fees" lands on the VIC guide (live 7), "real estate agent commission" on the VIC guide (15).
- **Appraisal (78% wrong):** "{suburb} property appraisal" and "property valuation {suburb}" land on agents and rental-market pages, which carry no appraisal offer in their title; `/appraisal` and `/property-valuation` rank for none of it.
- **Best suburbs (59% wrong):** city queries land on state rankings and on an old Moreton Bay guide ("best suburbs in moreton bay region" 298 impressions at 31); the new city editions are a week old.
- **Suburb data (33% wrong):** "{suburb} median house price" lands on comparison and rental-market pages, which print a figure, because the profile withholds its median (0.1).
- **Renovation, mortgage, conveyancing:** hubs and the national guides take queries the cost guide or calculator should own; the conveyancing and inspection guides are not indexed.

### 3.2 By query type

| Query type | Queries | Impressions | Average position | In the top 10 | Landing page lacks the modifier | Landing page is a tool |
|---|---:|---:|---:|---:|---:|---:|
| Named suburb | 549 | 3,944 | 26.1 | 10% | 4% | 69% |
| Agents | 389 | 2,976 | 26.9 | 7% | 0% | 78% |
| State or city | 112 | 783 | 28.6 | 13% | 11% | 54% |
| Fees and commission | 77 | 525 | 35.2 | 4% | 1% | 96% |
| Calculator | 49 | 365 | 57.9 | 5% | 3% | 97% |
| Appraisal and valuation | 63 | 312 | 24.7 | 25% | 89% | 54% |
| Rental and landlord | 51 | 283 | 39.6 | 4% | 14% | 62% |
| Best and top | 28 | 194 | 21.9 | 23% | 34% | 14% |
| Cheapest and affordable | 10 | 145 | 16.1 | 0% | 2% | 0% |
| Median and house price | 14 | 138 | 24.2 | 27% | 14% | 49% |
| Near me | 6 | 26 | 25.7 | 0% | 100% | 77% |

Where we match: the landing page carries the modifier for almost every agents, fees, calculator and suburb query, and is a tool for most of them. Where we miss: appraisal and valuation (89% of impressions land on a page without the word), "best" (34%) and "near me" (no page answers it). Clicks on commercial queries are zero in the query dimension because Google anonymises them; read clicks by page (2.1).

## 4. Our pages against the rivals ranking today

233 target SERPs where we have a page and at least three rival pages parsed:

| Signal | Our page | Top 5 rivals |
|---|---:|---:|
| Query terms in the slug | 48% | 29% |
| Query terms in the title | 70% | 35% |
| Query terms in the H1 | 62% | 29% |
| Year in the title | 67% | 15% |
| A table | 64% | 24% |
| A tool (3+ inputs) | 47% | 31% |
| FAQPage schema | 84% | 15% |
| A named author | 6% | 33% |
| Median words | 1,907 | 1,221 |

On-page wording is not the gap: our pages carry the query, the year, a table and a tool more often than the pages that outrank them, and are longer. The real gaps:
- **Indexing and recrawl** (2.4, 0.4): the biggest guides are not indexed, and most 1 Oct changes are unseen.
- **Authority** (2.5): the same pages rank 2.6 to 5.2 on Bing.
- **A named person.** 241 of our pages credit "Your Property Guide" or "Your Property Guide editorial"; 57 name a person. A third of the rival pages name an author, and on YMYL money pages Google's quality raters look for one.
- **Data the page withholds** (0.1): profiles and agents pages promise a median they do not show.
- **Format on a few SERPs**: agent directories with agent lists and ratings, portal suburb profiles with sales lists, city-named best-suburbs lists (section 6).

FAQPage markup is on 84% of our pages and 15% of theirs. Google shows FAQ rich results only for government and health sites, so it earns no snippet; it does no harm, and it helps AI answers that read the page.

## 5. AI search and People Also Ask

An AI Overview shows on 219 of 254 target SERPs and cites us on 6: "real estate agent fees", "how much do real estate agents charge", "cost of selling a house nsw", "renovation cost australia", "how much do renovations cost australia" and "home price guide". The most-cited domains: realestate.com.au 70, YouTube 57, OpenAgent 52, Reddit 36, CommBank 34, Facebook 30, ANZ and NAB 24, WhichRealEstateAgent 23, Westpac 20, Canstar 18, LocalAgentFinder 17. Citations follow the domains that already rank.

AI search volume against Google volume, for the targets where AI is large (DataForSEO's modelled estimate; use for relative size):

| Query | Google a month | AI a month |
|---|---:|---:|
| buying a house australia | 720 | 15,000 |
| selling a house | 140 | 9,620 |
| conveyancer | 22,200 | 7,320 |
| how to buy a house in australia | 390 | 3,979 |
| cost to build a house | 720 | 2,669 |
| buyers agent | 5,400 | 2,180 |
| display homes | 6,600 | 2,086 |
| house and land packages | 9,900 | 2,004 |
| how to sell a house | 170 | 1,842 |
| stamp duty nsw | 6,600 | 1,544 |
| property valuation | 60,500 | 1,309 |
| landlord insurance | 14,800 | 1,305 |
| capital gains tax on property | 880 | 1,298 |
| how much deposit do i need for a house | 1,300 | 1,042 |
| renovation cost australia | 20 | 1,007 |

Process questions ("how to buy", "how to sell", "selling a house") are where AI demand dwarfs Google's: our buying and selling guides sit at 67 to 77 on Google, so being cited in AI answers is the realistic win there.

People Also Ask: 1,957 question placements across the SERPs; 514 answered in a heading or FAQ on our page, 465 in the body only, 815 missing, 163 with no page. The high-AI-volume questions we don't answer are mostly affordability questions ("Where in Australia can I buy a house for $500,000?", 4,315 AI searches; "Is it cheaper to build or buy?", 12,940; "What is the 30% rent rule in Australia?", 6,307) and agent questions ("Who is Australia's best real estate agent?", 1,131). The per-vertical files carry the questions with proposed answers.

How to write the answers: the answer in the first sentence, one figure with its primary source and as-at date, under 60 words, the same text in the FAQPage JSON-LD, and no promise.

## 6. By vertical

Commercial and transactional GSC queries with 3+ impressions since the deploy (1 to 7 Oct). Clicks read 0 in the query dimension because Google anonymises them.

| Vertical | Queries / impressions since the deploy | What matters most |
|---|---|---|
| [Selling costs and commission](commercial-intent-pages-2026-10-10/selling.md) | 98 / 637 | • Source the commission ranges and derive every national figure from one table; GST in the calculator total<br>• Make the national fees and cost guides own the national phrases (0% of 491 and 571 impressions land there now), with an upward link from each state guide<br>• Request indexing for the QLD and SA guides<br>• Keep the shape: this vertical holds 8 of our 16 top-20 positions and 3 of 6 AI Overview citations |
| [Agents and appraisal](commercial-intent-pages-2026-10-10/agents-appraisal.md) | 440 / 3,246 | • The 0.1 repair restores NSW agents pages; then index on local content (agencies, commission worked line, nearby suburbs), not the house median alone<br>• Put "appraisal" in the agents page title and an H2: suburb appraisal searches land there at 13.9<br>• Fix Kew East, the duplicate postcodes and the "1.6% to 3.25%" fallback<br>• Soften match and speed promises; remove the /agents placeholder directory<br>• Retitle /find-an-expert for "find a real estate agent" (AI 444); add a free-valuation-tools table to /property-valuation |
| [Buying costs and schemes](commercial-intent-pages-2026-10-10/buying.md) | 44 / 284 | • One sourced first home grants file feeding eleven pages, with a test<br>• Stamp duty, conveyancing, building and pest, Help to Buy, LMI: too early to read; request indexing<br>• Stamp duty at common prices (a table) on the NSW guide; Section 32 is winnable<br>• Suburb template links labelled with the state should go to the state guides<br>• Buyer's agent hub with a buyer form now; city pages after a partner signs |
| [Loans, calculators and tax](commercial-intent-pages-2026-10-10/finance-tax.md) | 50 / 389 | • RBA page to 4.60% with a dated data file and a staleness test<br>• The #95 correction on the budget, negative gearing changes, SMSF, glossary and /investing pages<br>• CGT calculator: current rates, no company discount, then a 1 July 2027 mode (the SERP is winnable)<br>• Mortgage and borrowing SERPs are bank-locked (7 to 9 banks in the top 10); rental yield, LMI, negative gearing, refinance, bridging and CGT are winnable<br>• One "average new variable rate" constant (RBA F6, dated) for every calculator default |
| [Suburb data and markets](commercial-intent-pages-2026-10-10/suburbs-market.md) | 62 / 494 | • Roll the item 2 title rule to every state, with a version for a withheld median<br>• Fix the walkable, families, flood and cheapest rankings<br>• Coverage floor on city and region medians; official figures with their quarter below it<br>• vs pages: no "+0.0%", the right "% cheaper"<br>• City hubs for "best suburbs in {city}" (Perth and Adelaide 880 a month each); merge /states into /market-reports; remove the state commentary |
| [Renting and landlords](commercial-intent-pages-2026-10-10/renting-landlords.md) | 32 / 209 | • Settle who takes rental appraisal leads before anything else in this vertical<br>• NSW and VIC renters' rights to the current law; one law check across all eight<br>• Rentvesting guide to the 2027 tax rules<br>• Rental-market template: the item 13 rollout after 15 Oct (H1 "The rental market", Article schema dated 1 Jan 2025)<br>• The WA pages from #96 are the vertical's best bet ("{suburb} rental investment") |
| [New homes and renovation](commercial-intent-pages-2026-10-10/new-homes-renovation.md) | 6 / 36 | • Planning law on five granny flat guides and the builder guide (verify each instrument first)<br>• Take the cost copy off /renovating, which takes 81% of renovation impressions at about 80<br>• Request indexing for the renovation guide (it already ranks 11 live and is cited in two AI Overviews)<br>• /renovation-cost-calculator (480 searches a month, $5.25 CPC) from the existing engine<br>• House and land stays noindex; hide the "0 packages" row |

Patterns across the verticals:
- **Hand-typed figures drift; data files don't.** Every figure that comes from a sourced data file with a test (stamp duty, Help to Buy, FHSS, the 5% Deposit Scheme, LMI, bridging rates) is right on every page. The errors are in figures typed into page files: first home grants, commission ranges, the cash rate, renovation costs, tenancy rules. The fix pattern is the same each time: one dated data file, every page reads it, a test fails on drift.
- **Promises outrun the lead network.** Agents, appraisal, rental appraisal and broker pages describe a matched specialist and a response time that the business has not confirmed by suburb. /appraisal already has the right caveat; copy it everywhere.
- **"Every figure on this page is sourced and dated" prints on pages with no sources** (the shared layout prints it unconditionally). Tie it to a sources block.
- **Google hasn't seen the work yet.** Across every vertical the 1 Oct changes are unseen on changed URLs and indexed fast on new ones. Read the next pull on recrawled pages only.
- **National and state pages split national queries** (commission, cost of selling, property management, first home grants). Each family needs one owner, with state pages linking up.

## 7. What to do, in order

One change per PR, as the tracker runs; numbers are order, not tracker items.

**This week**
1. The 0.1 data repair: find what wrote `rental-nsw` / `rental-vic` on 1 Oct, dry run the label repair (NSW, VIC, and the QLD `rental-qld` rows), your go, then `revalidate-paths`. Add the test that no rental source writes `statsSource` and a post-sync check on the count of trusted NSW rows.
2. Request indexing, days 1 to 3 (0.4).
3. Settle the rental appraisal form (0.2 item 6) and the /agents placeholder profiles (item 12).
4. `/rba-cash-rate` to 4.60% with a dated data file and a staleness test (item 2).
5. First home grants data file and test across the eleven pages (item 1).
6. The #95 correction on the budget, negative gearing changes, SMSF, glossary, /investing, rentvesting and how-to-sell pages (item 3), and the CGT calculator's rates and company branch (item 4).
7. NSW renters' rights to the current law, then the other seven guides, SA first (item 5).

**Next two to three weeks**
8. Commission: sourced per-state table, `nationalRange()`, GST toggle, the sourced banner only with a sources block; then the national fees and cost guides as owners of the national phrases (item 7; selling file P1, P2).
9. Promise wording sweep across agents, appraisal, broker, hub and calculator pages (item 11).
10. Rankings: walkable on the uncapped count, the families label, flood pages noindex, the VIC sales count and the CBD screens (item 8).
11. Suburb profile title rule for every state, with a withheld-median version; agents pages indexable on local content; "appraisal" in the agents title; duplicate postcode rows canonical; Kew East guard (suburbs 3.1; agents 3.1).
12. City and comparison figures: coverage floor, official medians with their quarter, rents from named feeds, vs-page growth and gap; remove the state commentary (items 9, 10).
13. Granny flat and builder guides to the named planning instruments, after checking each; /renovating without its cost copy (item 13).
14. A named reviewer on the money pages and one bio per writer (0.3 item 5); LMI and negative gearing calculators in the header Tools menu; the glossary-linker fix.

**This month**
15. Buyer's agent hub with a buyer form; city pages after a partner signs.
16. City hubs for "best suburbs in {city}"; /states merged into /market-reports (your call on the redirects).
17. /renovation-cost-calculator; stamp duty at common prices on the state guides; the CGT calculator's 1 July 2027 mode.
18. Links: One Group Realty already republishes our commission ranges and links to us; once the sourced table and the restored medians are live, they are the assets to pitch (REIs, local news, agencies).
19. Google Analytics 4: decide (0.3 item 10).

**Re-check**
- 17 Oct: URL Inspection on the day 1 to 3 pages and the NSW agents pages (indexed, noindex or dropped).
- 24 Oct: Search Console, recrawled pages only, against 1 to 7 Oct.
- 28 Oct: the tracker's planned read of the four guides from #90.
- 3 Nov: RBA decision; the cash rate page must change that afternoon.
- 7 Nov: full re-pull with the same targets (`targets.tsv` in the run folder).

## 8. Method and caveats

- **Windows.** The deploy is the 1 Oct 2026 batch (#81 to #96, merged 30 Sep evening to 1 Oct afternoon AEST, live for nearly all of Search Console's 1 Oct, which runs on Pacific time). Search Console's last full day was 7 Oct, so "since the deploy" and "last 7 days" are the same week, 1 to 7 Oct. The 90-day window is 10 Jul to 7 Oct. One week after a deploy is early: Google had recrawled only part of the changed pages (section 2), so read the post-deploy figures as a first look, not a verdict.
- **Clicks by query.** Google anonymises rare queries; the query dimension holds a small share of the site's clicks. Clicks are read from the page and date dimensions; queries are read by impressions and position.
- **Positions.** Search Console's average position counts only the searches where the site was shown. Impression share (impressions per day divided by Keyword Planner searches per day) says how often that is. Ratios above 1 mean rank trackers or scrapers.
- **Keyword Planner** merges close variants ("real estate agent fees" and "real estate agents fees"); the batch was re-queried one keyword at a time where a keyword came back only as a variant. Volumes are 12-month averages, AU, Google Search.
- **AI search volume** (DataForSEO) is a modelled estimate of prompts in AI assistants. Use it for relative size, not as a count.
- **Live SERPs** are one desktop pull from the AU national location on 10 Oct 2026, top 20 with People Also Ask at click depth 2 and the AI Overview. City and device checks for the zero-click queries are in section 2.2.
- **Rival pages** were fetched directly; pages that blocked the fetch or returned under 50 words were re-rendered with JavaScript through DataForSEO. realestate.com.au, domain.com.au and property.com.au still refuse both, so their page signals are missing from the medians.
- **PAA coverage** is a token match of each question against our page's H2s, H3s and FAQ questions ("covered"), or its body text ("in body"). A question can be "in body" and still not be answered in one sentence.
- **Intent labels** are DataForSEO's for the top 3,000 non-postcode queries, and a site-specific regex classifier for the rest (`intent.py` in the run folder). Postcode lookups are informational by rule.
- **"Right page"** compares the page Google shows most for a query with the page that should own it: the target list's mapping where one exists, else a slug, title and H1 matcher (`matcher.py`). It is crude for suburb-level queries; the analysts checked those by hand.
- **Samples.** The site has 55,554 sitemap URLs; URL Inspection has a 2,000-a-day quota. Every money page (318: pages, guides, rankings, market reports) was inspected, plus the top-impression and a random sample of each bulk template (suburb profiles, rental-market, agents, postcodes, schools, comparisons, regions). Template-level index figures are sample estimates.
- **Not verified.** Why NSW suburb profiles show "Verified median pending" (a read-only production query was not run in this session; see 0.1). Bing breakdowns beyond the pull's own summary were not computed in this session.
