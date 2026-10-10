# Suburb data and markets: commercial-intent and competitor-gap findings, 10 Oct 2026

> Part of the [commercial-intent and competitor gap review of 10 October 2026](../commercial-intent-review-2026-10-10.md). Written by a read-only analyst from the evidence pack `data/packs/suburbs-market-*` in the run folder `~/Desktop/Ads/ypg-commercial-intent-review-2026-10-10/` (SERP digest, compare rows, GSC queries, intent-match misses, unanswered PAA) and the source at origin/main 9ef5ee7. File and line references are to that commit. Points marked "verify" are the analyst's own knowledge, not a source fetched in this run: check them with the regulator before changing copy. No site code was changed.

Pack `suburbs-market`. Scope: suburb profiles (/suburbs/{slug}), postcode pages, vs pages, best-suburbs (national, state, 24 city editions), /states, /market-reports, /property-market/{city}, /regions, /price-guide and the market guides.

Evidence: the pack files; GSC 90 days to 7 Oct, 83 days before and 7 days after the 1 Oct deploy; URL Inspection (10 Oct); linkgraph (1,233-URL crawl sample); live pages fetched 10 Oct; rival pages in `competitor-pages-parsed.json`; repo-main at 9ef5ee7 (cited `src/...:line`). Read-only throughout.

**Five things that matter most**

1. Three of the five city-edition rankings do not rank what they say. Most walkable is alphabetical (every top ten scores a capped 100). The families ranking calls "family households" "families with dependants". Lowest flood risk still indexes rows that read "No data". (0.1)
2. Melbourne's "cheapest suburbs" are the CBD, Southbank, Docklands and Travancore, on house medians from apartment precincts. Brisbane's are the cheapest of 17 acreage and inner suburbs. City and region headline medians come from as few as 5 suburbs; Moreton Bay's $1,085,000 even feeds a commission example in a lead block. (0.2, 0.3)
3. The "{suburb} median house price" family goes to vs and rental-market pages mainly because Google treats the profile as the postcode page, not mainly because the median is withheld. Four Victorian profiles that publish their median lose the same way. Roll the item 2 title to every state now and add price-anchor links back to the profile. (3.1)
4. Best suburbs is working. The 24 city editions drew 570 impressions and 12 clicks at 18.3 in their first week. By judgement they land the right page for 68% of best and cheapest impressions (the crude matcher says 10%). Adelaide families is 11 live for "best suburbs in adelaide" (880 a month, $24.69 CPC). The gap is a city hub for "best suburbs in {city}". (1, 5.1)
5. Merge /states into /market-reports (each /states page has one in-content inlink and all eight are crawled, not indexed). Merge /market-reports/act into /property-market/canberra. Strip the state commentary, which contradicts our own duty engine on TAS and ACT. (0.6, 3.10)

---

## 0. Fix first: accuracy and compliance on live pages

### 0.1 Three rankings that do not rank what they say ("best" only with stated criteria)

**(a) Most walkable: alphabetical, not ranked.** All 8 walkable editions in `/best-suburbs/cities/sitemap.xml` (8 of 24), plus the state and national walkable pages.
- /best-suburbs/most-walkable/sydney: "By walk score, the ten most walkable Greater Sydney suburbs are Alexandria, Annandale, Arncliffe, Artarmon, Ashfield, Auburn, Avalon Beach, Balgowlah, Balmain and Balmain East." Every one scores "100/100", and so do ranks 11 to 15 (Bankstown, Beaconsfield, Beverly Hills, Bexley North, Birchgrove).
- The other cities show the same pattern:
  - Melbourne runs Alphington to Caulfield South, with Berwick (41 km out) fourth.
  - Brisbane has Beenleigh (32 km out) third.
  - Perth runs Booragoon to Karrinyup.
  - Adelaide runs Adelaide to Goodwood.
- Cause: `walkScore = min(100, amenityCount × 2)` (`scripts/sync/sources/walkability.ts:11`, `:127`) saturates at 50 amenities, and the list sorts `walkScore desc, name asc` (`src/lib/services/city-rankings-service.ts:222`).
- At stake:
  - "best suburbs to buy in sydney" (AI 343) is matched to this page.
  - "best suburbs in darwin" lands on most-walkable/darwin (14 impressions at 8.2 since the deploy).
  - The walkable editions took 5 clicks since 1 Oct.
- Fix: store the uncapped amenity count (the sync already computes it) and rank on it, or on amenities per km², and print it beside the score. Until that ships, list the 100s unnumbered with "these suburbs all score 100; listed alphabetically", and set the walkable editions to noindex.

**(b) Families: the criterion is mislabelled.**
- /best-suburbs/for-families/adelaide: "By the average ICSEA of their schools, among suburbs where families with dependants are at least 40% of households, the ten best Greater Adelaide suburbs for families are Stonyfell, Medindie...". The table column beside it says "Family households" (Stonyfell 85%).
- Cause: `householdsFamily` is ABS 2021 G35 `Total_FamHhold` ÷ all households (`scripts/sync/sources/abs-census.ts:220-233`). That counts every family household, couples without children included.
  - The filter `householdsFamily: { gt: 40 }` (`src/lib/services/city-rankings-service.ts:142`) lets 226 Greater Adelaide suburbs through.
  - The copy at `src/lib/city-editions.ts:212`, `:262`, `:314`, `:349` calls them families with dependants.
- The result is an ICSEA ranking of nearly every suburb:
  - Sydney's list opens Edgecliff, Kirribilli, Cremorne, Woollahra, North Sydney.
  - Melbourne's has South Yarra tenth.
  - Melbourne CBD's paragraph on the cheapest list says "families with dependants are 38% of households".
- Fix now: change the four strings to "family households are at least 40% of households". Then import the 2021 Census family-composition table and rank where couple families with children plus one-parent families with dependants reach a stated share.
- Affects 8 editions. "best suburbs in melbourne for families" (23 impressions at 14.5) and "best suburbs in brisbane for families" (11 at 13.6) land on them.

**(c) Lowest flood risk: indexable with no data** (tracker 49(ii), open).
- /best-suburbs/lowest-flood-risk/qld: "The lowest flood risk suburbs in Queensland." Rows 1 to 16 read "Flood risk: No data" (Stockyard, Seventeen Mile, Loreto Hill...), with no robots meta.
- Six state pages are indexed. They took 7 (QLD), 5 (NSW) and 5 (VIC) clicks in 90 days, and VIC 2 clicks at 5.5 since the deploy. A reader can take the title as a safety claim.
- Cause: `isRanked` returns true for the category (`src/lib/ranking-notes.ts:59-64`), read at `src/app/(marketing)/best-suburbs/[category]/[state]/page.tsx:129`.
- Fix: item 49(ii) as written. `isRanked` false until a hazard feed loads (noindex, out of the sitemap), and the page says why in place of the table. Do not request indexing for /best-suburbs/lowest-flood-risk.

### 0.2 Cheapest lists built on artefacts

**(a) Melbourne.**
- /best-suburbs/most-affordable/melbourne: "the ten cheapest Greater Melbourne suburbs are Melbourne, Southbank, Docklands, Travancore...". Melbourne 3000 is at $381,000, Southbank $418,000, Docklands $440,000 and Travancore $477,000.
- The same figure reaches /property-market/melbourne: "the most affordable is Melbourne at $381,000".
- These are apartment precincts, and three rival sources treat them that way:
  - None of the four appears in Property Reporter's 747-suburb Victorian table, which takes medians from 10 or more settled house sales. That table matches our Frankston ($810,000, 97 sales) and Dandenong ($755,000, 31) exactly.
  - OpenAgent's house list (Domain, 12 months to June 2026) starts at Melton $557,000. Its unit list has Travancore at $370,000.
  - Our own 8 July winter report excluded "CBD-core postcodes ... because apartment-dominated markets make 'house' medians unreliable" and Travancore by name. The 1 Oct editions dropped that screen.
- Cause:
  - `sales-vic` writes the median but no sales count, though the file carries "sales this quarter" in column 11 (`scripts/sync/sources/sales-vic.ts:7-11`, `:196-210`). So the five-sale rule, which applies "where the count is known", never applies in Victoria.
  - The most-affordable query has no apartment screen (`src/lib/services/city-rankings-service.ts:197-205`).
- Demand: "cheapest suburbs in melbourne" 590 a month on Google, AI 733. The page drew 76 impressions at 23.7 in week one.
- Fix:
  1. Write `salesCountHouse` from column 11 so the five-sale rule bites.
  2. Port the July screens (CBD-core postcodes; suburbs where separate houses are a small share of dwellings) into the most-affordable query.
  3. Apply the same screens in the city rollup and /price-guide.

**(b) Brisbane.**
- /best-suburbs/most-affordable/brisbane: "Medians for 2024. Ranked from 17 Greater Brisbane suburbs." The "ten cheapest" include Eatons Hill ($990,000), Logan Village ($1,000,000) and Murarrie ($1,075,000).
- The July report's Brisbane ten were Riverview $521,025, Bundamba $530,750, Goodna $549,000, Woodridge $575,000 ... Logan Central $580,000. Those medians are now withheld (see 0.8).
- Fix: a coverage floor in `hasCityEdition` (`src/lib/city-editions.ts:65-67`) for price categories. For example, the ranked pool must be at least 30 suburbs and 25% of the city's suburbs with 1,000 or more residents. Brisbane cheapest then answers noindex until QLD medians return.

**(c) Perth** runs on ABS 2024 medians ("Medians for 2024"), the same ten as in July. The page dates the data, so it is acceptable. Keep the data year in the first sentence, as it is now.

### 0.3 City and region headline medians, rents and source lines

Quoted live:
- /property-market/brisbane and its meta description: "The median house price in Brisbane is $1,117,500, the median of 23 suburb medians". That is 23 of 617 tracked suburbs, and the "twenty busiest" table has 17 rows, mostly acreage.
- /regions/moreton-bay: "The median house price in Moreton Bay is $1,085,000, the median of 5 suburb medians" (Eatons Hill, Cashmere, Elimbah, Wamuran, Dayboro). The seller lead block then says: "On the Moreton Bay median of $1,085,000 that is $24,955 to $31,465, before marketing."
- /property-market/adelaide: "The median house price in Adelaide is $1,055,000, the median of 267 suburb medians." The SA Valuer-General's metropolitan Adelaide median house sale price for the June 2026 quarter is **$975,000** (published data page, updated 28 July 2026).
- /property-market/perth: "The median house price in Perth is $761,250" (66 ABS 2024 medians, "sales data last refreshed December 2024"), under "Perth House Prices & Property Market 2026".
- Source line on six of eight city pages: "Source: suburb medians from the QLD valuer-general or state sales records and the ABS". QLD, WA, TAS, ACT and NT are ABS SA2 medians and VIC is Land Victoria; no valuer-general figure is used.
- Rents look like 2021 Census proxies:
  - Perth "Median house rent $350/wk", Hobart $345 and Darwin $360 are below every bond-data figure we hold for those cities (WA bond data, July to September 2026: Joondalup $640, Nedlands $900).
  - They match the census proxies left on the rows. The WA clear-out is tracker 3.1(c)'s open follow-up.
- /property-market hub: "Updated July 2026"; cards print Hobart "$755K median house price" (10 suburbs) and Brisbane "$1.1M" (23).

Cause:
- `buildCityMarket` medians whatever is published, with no coverage floor (`src/lib/services/city-market-service.ts:116`, `:153`).
- It medians the raw `medianRentHouse` without the `publishesRent` gate (`:155`).
- The narrative and source line: `src/lib/city-narrative.ts:44`, `:86`.
- The title and description: `src/app/(marketing)/property-market/[city]/page.tsx:52-57`.
- The region page: `src/app/(marketing)/regions/[slug]/page.tsx:214`, `:315-319`.

Fix:
1. Set a coverage floor before printing any city or region median, its meta description or the commission example (the same floor as 0.2(b)). Below the floor, print the official figure from the primary source with its quarter, or nothing:
   - SA Valuer-General (Adelaide)
   - Land Victoria's VPSR metropolitan median (Melbourne)
   - NSW DCJ Rent and Sales Report (Sydney)
   - REIQ, REIWA, REIT, REIACT and REINT where they publish one
2. Call our figure "typical suburb median (N suburbs)", never "the median house price in {City}".
3. Use `priceSourceLine(state)` for the source line. It is already right on the editions.
4. Route rents through `publishesRent`. Use WA's `medianRentAll`, labelled "all dwellings".

### 0.4 vs pages: "Growth +0.0%" and a wrong "% cheaper"

- **Growth +0.0%.** Every vs page prints "Growth + 0.0 %" in both header cards and "+0.0% Annual growth (house)" in the table where no change is measured. This shows on Glen Waverley vs Mount Waverley, Frankston vs Frankston North, and Hurstville vs South Hurstville (whose medians are withheld).
  - Source: `src/app/(marketing)/suburbs/[slug]/vs/[compareSlug]/page.tsx:399-409`, `:514-520`. Both print when the value is `!= null`, but 0 is the codebase's "not measured".
- **Wrong % cheaper.** /suburbs/frankston-vic-3199/vs/frankston-north-vic-3200, which is the URL Google shows for "median house price frankston", says "Frankston North is roughly 21% cheaper" in its meta description and intro.
  - The medians are $810,000 and $670,000, so Frankston North is 17% cheaper. The reversed URL says 17%.
  - `percentGap` divides by the second suburb (`src/lib/compare-narrative.ts:55-57`). It is used at `:73-80` and flows into `:142`, `:213`, `:287` and the meta description at `:381-385`.
- Fix: show the growth chip and row only when `publishedGrowthFor` > 0, as the profile price card does, and compute the gap as (dearer minus cheaper) ÷ dearer.

### 0.5 Profile title, description, pending note and source line

- 170 of the 222 parsed profiles print "Verified median pending".
  - 162 of them are among the 197 on the legacy title "{Suburb} Postcode {pc} ({STATE}) – Suburb Profile & Median Price" (`src/lib/utils/seo.ts:232`).
  - The other 8 are SA/TAS cohort pages whose titles already drop "House Prices". The cohort promises a price on none of its withheld pages.
  - 115 of the 197 legacy titles run past 60 characters.
- The legacy description on Victorian profiles, e.g. Frankston, says "Median house price $810K, growth, schools and crime". Land Victoria publishes no change, and the page prints "–" for growth (`seo.ts:252`, `:260`).
- The pending note says "We're working on a data partner; in the meantime, treat the state-level figures as a guide only." (`src/lib/suburb-data-quality.ts:106-107`).
  - For NSW and VIC the sources exist (Valuer General, Land Victoria; the methodology page says so).
  - No state-level figure is on the page.
- The footer says "Median, growth and rental data from state revenue offices and ABS." (`src/app/(marketing)/suburbs/[slug]/page.tsx:835`). Those are the wrong agencies: the sources are the Valuer General, Land Victoria, the SA Government and the ABS, with rents from the bond authorities.
- Fix: 3.1 below, plus a reason-specific pending note and a corrected source line.

### 0.6 State commentary (unsourced, two facts wrong)

`STATE_COMMENTARY` (`src/lib/data/state-commentary.ts`) renders above every /best-suburbs/{category}/{state} table (`src/components/best-suburbs/BestSuburbsListing.tsx:216`) and on /market-reports/{state} (`src/app/(marketing)/market-reports/[state]/page.tsx:191`). No figure carries a source or a date.

Two lines contradict our own sourced duty engine:
- **TAS** (line 59): "Tasmania's $30K FHOG ... plus the 50% stamp duty concession on established homes".
  - `src/lib/utils/stamp-duty.ts:387-393` (SRO Tasmania): the established-home exemption ended for transfers settling after 30 June 2026, and the FHOG is $20,000 for new homes from 1 July 2026.
- **ACT** (line 67): "full stamp duty waiver for eligible first home buyers and downsizers regardless of property price".
  - `stamp-duty.ts:480-486` (ACT Revenue Office): the HBCS is for buyers who have not owned property in five years, with the income test and cap removed from 1 July 2026. A downsizer owns property.

Unsourced claims:
- "Brisbane's median house price has compounded around 8-10% annually since 2020" (line 33)
- "Sydney's median house price sits around $1.6M to $1.7M in 2026" (line 17)
- WA Keystart "buyers earning up to $135K (couples)" (line 43)
- SA "HomeSeeker shared-equity scheme ... as little as 2% deposit" (line 51)

Fix: remove the blocks now. If a buyer tip is wanted back, build it from the dated notes in `stamp-duty.ts`.

### 0.7 /property-market/sydney promises a median it shows as N/A

- The title is "Sydney House Prices & Property Market 2026: Median, Growth, Suburbs". The page reads "Median house N/A", "Typical annual growth N/A", "(0 of 894 tracked Greater Sydney suburbs)".
- Bing ranks it at 5.8 (14 clicks, 460 impressions in 90 days), so Bing searchers land on it now.
- The region template already switches its title when the rollup has no median ("{Name} Property Market 2026: Suburbs, Prices & Schools", change log 20 Sep). The city template does not (`page.tsx:52`).
- Fix: the same switch. It reverts by itself when the NSW label is repaired.

### 0.8 For the lead's data check: QLD medians look withheld the same way

- On 29 Sep Morayfield printed $1,095,000 (SA2 "Morayfield", tracker item 51). On 10 Oct it prints "Verified median pending" beside "Sales data as of December 2024".
- The 8 July winter report listed ten Greater Brisbane suburbs with verified medians from $521,025. On 10 Oct only 17 Greater Brisbane suburbs of 1,000 or more residents publish one (23 on the city page).
- 50 of 53 parsed QLD profiles withhold.
- Tracker item 3 notes that `rental-qld` stamps sales-side fields on every suburb it touches.
- Recommendation: add QLD to the read-only `statsSource` count, and WA (22 of 27 withheld). Treat QLD medians like NSW and VIC: they come back after the repair.

---

## 1. Where we match commercial intent (keep doing)

- **City editions (#86) took the best and cheapest queries in a week.**
  - 21 editions drew 570 impressions, 12 clicks, average position 18.3 (1 to 7 Oct).
  - The best-suburbs vertical went from 6.3 to 25.6 impressions a day and from position 39.1 to 24.3.
  - Of the 160 best and cheapest impressions in the pack TSV:
    - 109 (68%) land on the right edition, e.g. "best suburbs in melbourne for families" at 14.5 and "cheapest suburbs to buy in melbourne" at 12.3.
    - 28 (18%) are generic "best suburbs in {city}" queries landing on a single category.
    - 23 (14%) are wrong, mostly Moreton Bay.
  - The intent-match matcher's 10% expected state pages; read it as an artefact.
- **Adelaide editions are the clearest wins.**
  - /best-suburbs/most-affordable/adelaide: 4 clicks, 85 impressions at 6.5 since the deploy.
  - /best-suburbs/for-families/adelaide: 11 live for "best suburbs in adelaide" (880 a month, CPC $24.69, AI 393), against provider blogs of 1,100 to 2,000 words.
  - Keep the shape that works: a section per suburb, a method naming source and period, the "we do not predict" answer to "Which suburbs will boom", ItemList and FAQPage.
- **Profiles that publish a median print it well.** The figure carries its source and period, e.g. "Frankston's median house price is $810,000 (Land Victoria's quarterly suburb median...)". The figure matches a 97-sale independent median exactly. The investment FAQ (#87) states the yield and says no change is published.
- **Suburb data commercial impressions** rose from 25 to 60 a day, position 45.6 to 34.6. "morayfield property investment" moved from 20.9 to 9.7, and "morayfield property market" sits at 21.4 with 105 impressions.
- **Bing likes the city pages:** /property-market/sydney at 5.8 (14 clicks) and /canberra at 5.0 (7 clicks). Fix 0.7 before more Bing users see N/A.
- **Withholding rather than guessing is right.** The cohort titles (SA/TAS) drop "House Prices" on all 8 withheld pages: the rule works, so roll it out (3.1).

---

## 2. Where we miss, by query type

| Query type | Demand (Google / AI / our GSC) | What the top 5 reward | Our landing page and gap |
|---|---|---|---|
| "{suburb} median house price / house prices" | KP: mount waverley 210, hawthorn 110 (+70 reversed), bondi 90, hurstville 90, vaucluse 90, dandenong 40; AI 0 to 21. GSC 90 days: 423 queries, 2,382 impressions, 0 clicks | Portal and agent suburb profiles (homely, OpenAgent, realestateinvestar, YIP, agency profile pages). H1 "{Suburb}, {STATE} {pc}". Median 784 to 1,276 words, about 9 H2s, a price table in 3 of 4 (sales by period, 5-year trend). No title carries "median house price" (0 of 4). AIO cites realestate.com.au, domain, property.com.au, YIP | The profile took 47% of these impressions on suburb URLs before the deploy (855 of 1,827) and 26% after (85 of 330). The rest went to rental-market (NSW), vs (VIC) and /price-guide (Vaucluse 80.8). No table, H1 is the bare name, title leads with "Postcode" (3.1) |
| "best suburbs in {city}" (generic) | perth 880/592, adelaide 880/393, melbourne "to buy" 170/219, sydney "to buy" 50/343, brisbane "to buy" 90/35, invest brisbane 320/61, hobart AI 106, darwin AI 53; brisbane, sydney and melbourne "best suburbs in" 880 to 1,900 (30 Sep review) | Provider listicles of 1,100 to 2,100 words (median 1,125 Adelaide, 1,908 Perth). One H2 per suburb, a "how we chose" section, year in title 2 of 5, bylines 2 to 4 of 5, tables 0 to 2 of 5. AIOs cite small sites (sitchu, keystms, notaballerina, northremovals) | No city page; Google picks one category (most-walkable/darwin at 8.2, for-families/adelaide 11 live, most-affordable/perth at 30). New city hubs (5.1) |
| "cheapest suburbs in {city}" | melbourne 590/733, sydney 590/457, adelaide "most affordable" 30/68 | OpenAgent: 2,576 words, house and unit tables, a within-10 km table, FAQPage, named author, dated Domain data. Canstar: house and unit tables, Dataset/ItemList. Sienna Homes: 11 tables. "Cheapest" in H1 for 4 of 5 | One house table, no unit table, CBD artefacts (0.2). Sydney edition noindex (0 of 894 medians) |
| "best suburbs for families {city}" | KP 10 each, AI 8 to 11. GSC since deploy: 23, 11, 11, 4, 3 | WhichRealEstateAgent (4,748 words, by need, schools and catchments, affordability), lpadvisory (2,486, by region, "how much do you need to spend in 2026", FAQPage), huntergather (6,310, a side-by-side table, FAQPage) | The edition shape matches (1,814 to 1,904 words, 14 H2s, table, 4 FAQs) and holds 13.6 to 14.5. Criterion mislabelled (0.1b); no budget sections |
| "{city} property market" | perth 6,600, sydney 4,400, melbourne 4,400, brisbane 2,400, adelaide 880, canberra 260, hobart 260; AI 14 to 102 | News and research: realestate.com.au news (2 to 3 per SERP), AFR, KPMG, Westpac IQ, SQM, Cotality, propertyupdate; the latest month's change and forecasts. Authority ceiling | /property-market/{city} data pages (343 to 1,158 words), last crawled 3 July. The May city guides draw more (Perth guide 114 impressions at 20.1, Sydney 109 at 19.7). Not top 20 anywhere. Target "{city} house prices" instead (3.5) |
| "house prices / median house price by suburb", "home price guide" | 70/254, 140/211, 720 | Property Reporter heat map (one 748-row table with sales count and window per suburb), propertyupdate (4,058 words, 9 tables, one H2 per capital), SPI data tool | /price-guide: 591 words, no H2, a 30-row table, no FAQ, no sample sizes; 619 impressions at 58 in 90 days (3.6) |
| "best suburbs in / to invest in australia" | 90/193, 110/37 | Data-news pages with many tables (realestate.com.au 11 tables, savings.com.au top 100, OpenAgent 13 tables), Tourism Australia | /best-suburbs hub: 183 words, no table, last crawled 30 July (3.8) |
| Region "best suburbs in moreton bay (region)" | 20 KP + AI 49; GSC 298 impressions at 31.3 (90 days) | Thin agent posts of 470 to 760 words, no tables, no FAQ | Feb 2025 "Top 5" guide (802 to 894 words, no table, no year); winnable (3.4) |
| "{suburb} capital growth / property investment / is X a good suburb" | morayfield 74 + 73 impressions, spring farm 45 (16 live), "is morayfield a good suburb" AI 56 | areasearch (11,210 words, 93 FAQs, sales trend tables), realestate.com.au news, YIP, OpenAgent profile (5-year price trend) | Profile: no growth figure (QLD and NSW withheld), and no investment FAQ where no yield is published (Morayfield) (3.1) |

---

## 3. Page-by-page gap and fix list (ranked by demand × winnability)

1. Suburb profile template
2. Cheapest city editions
3. Families city editions
4. Moreton Bay guide
5. /property-market/{city}
6. /price-guide
7. Most walkable editions (fix in 0.1a, then request indexing)
8. /best-suburbs hub
9. vs template
10. /market-reports/{state} with /states merged in
11. /suburbs index

### 3.1 Suburb profiles: /suburbs/{slug}

Demand: 283,882 of 465,495 impressions in 90 days (142 clicks); 423 "{suburb} median house price / house prices" queries.

Winnability: medium to high. The top 5 are portal and agent profiles of 780 to 1,600 words, and we already sit at 9 to 10 on postcode lookups.

| | Ours (Spring Farm, Morayfield) | Rival median | Rival best |
|---|---|---|---|
| Words | 1,236 to 1,429 | 784 to 1,276 | areasearch 11,210; homely 3,790 (Hurstville) |
| H2s | 10 to 11 | 5 to 9 | barryplant 15; OpenAgent 14 |
| Tables | 0 | price table in 3 of 4 to 4 of 5 | agentsplus 7 (87 rows); OpenAgent "5 year median price trend" |
| Tool | appraisal form (13 inputs) | 0 to 2 of 5 | |
| Schema | FAQPage, Place, Breadcrumb, Speakable | FAQPage 1 to 2 of 5; LocalBusiness/AggregateRating (homely) | |
| FAQ | 7 (none on price when withheld) | | areasearch 93 |
| Author | none | 0 to 2 of 5 | |
| Title / H1 carry query | legacy "Postcode ... Median Price"; H1 bare name | title 0 of 4; H1 "{Suburb}, {STATE} {pc}" | |

**Why vs and rental-market pages win "{suburb} median house price".** The brief asks whether it is because the profile withholds the median and a page that prints one wins. Mostly no:
- **Profiles that publish the median lose too.** Mount Waverley ($1,640,000), Frankston ($810,000), Dandenong ($755,000) and Williamstown ($1,600,000) all publish a Land Victoria median. Their queries land elsewhere:
  - Glen Waverley vs Mount Waverley at 24.5 (live: our Mount Waverley rental-market page at 19).
  - Frankston vs Frankston North at 13.4.
  - The Dandenong rental-market page at 9.9 and 15.5.
  - The Williamstown rental-market page at 15.3.
- **Hurstville's winning vs page prints no median either** (both sides "–").
- **Google has not yet seen most withheld NSW profiles.** It has recrawled 2 of 89 sampled NSW profiles since 1 Oct, so it still holds the version with a median.
- **The loss started before the deploy.** In the 83 days before 1 Oct, with medians published, the profile took 47% of these impressions on suburb URLs. NSW sent 259 to rental-market against 111 to the profile.

What does explain it: **Google treats the profile as the postcode page.**
- The profile title leads "{Suburb} Postcode {pc}", its H1 is the bare name, and postcode lookups were 79% of its impressions.
- Its own price queries sit deep. The Frankston profile is at 16.5 for "frankston postcode", 37.3 for "frankston house prices" and 44 for "frankston median house price".
- The competing pages say "price" or "median" up front:
  - The vs title says "Property Prices ... 2026", and its first sentence prints both medians.
  - The rental-market title says "Median Rent", and its investor block prints "Median house price $755,000".
- Profiles get few in-content links, and almost none with price anchors: 3 to 9 in the crawl sample, with one price anchor ("full house prices for mount waverley").

**The rule for both states.** Roll `TITLE_COHORT_STATES` (`src/lib/utils/seo.ts:40`) to every state now.
- The control can no longer be read: on 1 Oct the NSW and VIC relabel changed it, and its title now promises a median on 162 pages that print none.
- The cohort cannot be read on 22 Oct either: 3 of 30 sampled SA and 0 of 10 TAS profiles have been recrawled.
- Compliance outranks the test. Read the effect later by recrawled pages.

| | Median published (`hasReliablePrice`) | Median withheld |
|---|---|---|
| Title (60 max) | "{Suburb} {STATE} {pc}: House Prices, Rent & Suburb Profile", topics dropped from the end to fit (`seo.ts:75-91`, as built) | "{Suburb} {STATE} {pc}: Rent, Schools & Suburb Profile"; never "House Prices", "Median" or "Price" |
| Example | "Mount Waverley VIC 3149: House Prices, Rent & Suburb Profile" (60) | "Hurstville NSW 2220: Rent, Schools & Suburb Profile" (51) |
| Description (155 max) | "Frankston's median house price is $810,000 (Land Victoria, May 2026 release). Plus weekly rent, population 37,331 (2021 Census) and 20 schools." (no "growth" unless measured) | "Hurstville, NSW 2220, in Greater Sydney: suburb profile with weekly rent, population 31,162 (2021 Census), 20 schools and walk score 100." (no sales figure) |
| H1 | "{Suburb}, {STATE} {pc}" (`src/components/suburb/SuburbHero.tsx:85-87`) | same |
| First sentence | "{Suburb}'s median house price is $X ({source}, {period})." | "{Suburb} has no published median house price yet: {reason}. The median weekly house rent is $850 (NSW rental bond data, June 2026)." |
| Price card | figure plus provenance | Reason-specific (`page.tsx:269-272`, `suburb-data-quality.ts:101-107`): "Too few sales for a median" (exists); "Median not shown while we re-check the {source} feed (October 2026)" for a feed or label fault; "No suburb-level median: the ABS publishes one for the {SA2} area" for an unmatched SA2 |
| FAQ | "What is the median house price in {Suburb}?" (exists, `src/lib/suburb-faq.ts:34-70`) | The same question, answered honestly, with the appraisal path: "A local agent can give you a figure for your home; your details go to one agent, who pays us a fee for the introduction." |

**What a profile can do for the postcode searcher who lands.** The SERP has already answered them; the few who click want the other suburbs in the postcode and a sense of price.
- Put "Postcode {pc} also covers {A}, {B} and {C}" under the hero, linked, with a link to /postcodes/{pc}.
- Keep the snapshot band and the appraisal block in the first two screens.
- Do not add more postcode copy: Moorebank has 3,768 impressions and 2 clicks; Morayfield 14,839 and 7.

**H2s to add:**
- "{Suburb} house prices by quarter": a table. The Land Victoria file holds the current and four prior quarters (`sales-vic.ts:7-11`), the SA file two years, and the ABS an annual SA2 series. This is tracker 17/31.
- "How {Suburb} compares with nearby suburbs": a table of the five linked neighbours' published median, rent and yield. Rival H2: OpenAgent "How does Spring Farm compare to nearby suburbs?".
- "Is {Suburb} a good investment?" as a visible H2 where yield or growth is published. Frankston already has "Investment overview.".

**PAA to answer:**
- "Is Mount Waverley a suburb?" (AI 79)
- "Is spring farm a good investment?" (7)
- "Is Dandenong, Victoria a good place to live?" (6)
- "What is the average cost of a house in NSW?" (25; with the DCJ state figure once NSW returns)

**Schema:** add WebPage with `dateModified` set to the sales or rent as-at date. Keep FAQPage, Place and Breadcrumb. Put no price in JSON-LD when the median is withheld (already the case).

**Internal links** (anchor "{Suburb} median house price", to the profile's price section):
- From the vs header cards (`vs/[compareSlug]/page.tsx:383-412`).
- From the rental-market investor view (`rental-market/page.tsx:198-207`).
- From the city "twenty busiest" rows and postcode page rows, with anchor "{Suburb} house prices".

**Files:** `src/lib/utils/seo.ts:40`, `:224-263`; `src/components/suburb/SuburbHero.tsx:85-87`; `src/app/(marketing)/suburbs/[slug]/page.tsx:247-275`, `:835`; `src/lib/suburb-data-quality.ts:101-107`; `src/lib/suburb-faq.ts:34-70`.

### 3.2 Cheapest city editions: /best-suburbs/most-affordable/{city}

Demand:
- Melbourne 590/733; Sydney 590/457 (edition noindex until NSW returns); Adelaide "most affordable" 30/68.
- GSC since deploy: Melbourne 76 at 23.7; Adelaide 85 at 6.5 with 4 clicks; Perth 34 at 11.1.

Winnability: medium. OpenAgent (2,080 referring domains) leads Melbourne, but we reached 23.7 in a week.

| Melbourne | Ours | Rival median | Rival best |
|---|---|---|---|
| Words | 1,390 | 2,195 | Sienna 2,868; OpenAgent 2,576 |
| H2s | 14 | 6 | Canstar 14 |
| Tables | 1 (houses) | 3 of 5 have one | Sienna 11; OpenAgent 4 (houses, units, top 5 each, within 10 km) |
| Unit table | no | OpenAgent, Canstar | |
| Schema | ItemList, FAQPage | FAQPage 1 of 5; Dataset/ItemList (Canstar) | |
| FAQ | 4 | | |
| Author | none | 4 of 5 | OpenAgent: named writer and reviewer |
| "Cheapest" in title / H1 | yes / yes | 5 of 5 / 4 of 5 | |
| Data and date in intro | Land Victoria, May 2026 release | | OpenAgent: Domain, 12 months to June 2026 |

**Proposed (Melbourne, after the 0.2a screen):**
- Title: "Cheapest Suburbs in Melbourne 2026: Houses and Units" (52). H1: the same.
- First sentence: "On Land Victoria's quarterly medians, the cheapest Greater Melbourne suburbs to buy a house are Melton South ($525,500), Kurunjang ($551,000) and Dallas ($561,000); for units, start with {the three lowest unit medians}."

**H2s to add:**
- "Cheapest suburbs for units in Melbourne": Land Victoria publishes unit medians (`UNIT_MEDIAN_SOURCES`).
- "Cheapest suburbs within 10 km of the CBD" (OpenAgent's H2; we hold km to the GPO).
- "Houses under $600,000" (PAA "What are the best suburbs in Melbourne for an investment under $600k?").
- "How we ranked them": add the apartment screen.

**PAA to answer:**
- "Where's the cheapest place to live in Melbourne?"
- "What are the cheapest places to live in Melbourne?" (21)
- "Which Australian city is the cheapest?" (22)

**Schema:** keep ItemList and FAQPage. Add a named reviewer (Person) and a `dateModified` tied to the feed release, not the render date ("Updated 10 October 2026" sits beside May 2026 medians).

**Tables:** the house table (exists), plus a unit table, a within-10 km table, and a weekly-rent and gross-yield column from bond data.

**Links:** 10 in-content inlinks today, all "cheapest suburbs in melbourne". Add:
- From the /property-market/melbourne most-affordable table header.
- From the profiles of the listed suburbs ("one of the cheapest suburbs in Melbourne").
- From /guides/cheapest-suburbs-buy-house-australia-2026.

**Adelaide** (the vertical's top click page since the deploy): keep it. Add the context line "Metropolitan Adelaide's median house sale price was $975,000 in the June 2026 quarter (SA Valuer-General)" to the method block. The SA feed is houses only, so there is no unit table.

**Brisbane and Perth:** see 0.2. **Sydney:** stays noindex until NSW returns; then use the same template (590/457).

**Files:** `src/lib/city-editions.ts`; `src/lib/services/city-rankings-service.ts:197-205`; `scripts/sync/sources/sales-vic.ts:196-210`.

### 3.3 Families city editions: /best-suburbs/for-families/{city}

Demand:
- KP 10 each, AI 8 to 11. GSC since deploy: Melbourne 50 at 23.2, Brisbane 44 at 26.6, Hobart 19 at 8.3, Adelaide 19 at 21.7, Canberra 16 at 16.4.
- Adelaide is 11 live for the 880-a-month "best suburbs in adelaide".

| Melbourne | Ours | Rival median | Rival best |
|---|---|---|---|
| Words | 1,814 | 2,206 | WhichRealEstateAgent 4,748; huntergather 6,310 (Brisbane) |
| H2s | 14 | 7 | lpadvisory 13 |
| Tables | 1 | 2 of 5 | huntergather "The twelve side by side" |
| FAQ schema | yes (4) | 2 of 5 | |
| Author | none | 3 of 5 | |
| Sections by budget or need | no | WhichRealEstateAgent "Top Picks by Family Need", "Affordability & Housing Types"; lpadvisory "How much do you need to spend in 2026?" | |

**Proposed:**
- Title: unchanged ("Best Suburbs for Families in Melbourne 2026", 43).
- Intro, after the 0.1b relabel: "By the average ICSEA of their schools (ACARA), among Greater Melbourne suburbs where family households are at least 40% of households (2021 Census), the ten that rank highest are..."
- Once the family-composition import lands, state the share of couple families with children plus one-parent families with dependants.

**H2s to add:**
- "Family suburbs by budget": bands from published medians (under $1m, $1m to $1.5m, over $1.5m).
- "School zones: check the address, not the suburb" (link /schools).
- "What families pay to rent there" (bond data).

**Links:** 10 to 12 in-content inlinks with exact anchors. Merge the Brisbane families guide into the edition (section 4).

**Files:** `src/lib/city-editions.ts:184`, `:212`, `:262`, `:314`, `:349`; `src/lib/services/city-rankings-service.ts:142`; `scripts/sync/sources/abs-census.ts:215-233`.

### 3.4 /guides/top-5-suburbs-families-moreton-bay (tracker 23, open)

Demand: "best suburbs in moreton bay region" 298 impressions at 31.3 (90 days), 20 at 31.1 since the deploy; KP 20, AI 49; the page has 404 impressions at 30.3.

Winnability: high. The rivals are agent posts of 470 to 760 words with no tables and no FAQ.

| | Ours | Rival median | Rival best |
|---|---|---|---|
| Words | 802 to 894 | 707 | 760 |
| H2s | 7 | 0 | 2 |
| Tables / FAQ | 0 / 0 | 0 of 4 / 0 of 4 | |
| Date / year in title | 10 Feb 2025 / no | 0 of 4 | |
| Author | Bec Ramirez | 3 of 4 | |
| In-content inlinks | 3 | | |

**Proposed:**
- Title: "Best Suburbs in Moreton Bay Region 2026: Top 10 for Families" (60).
- H1: "The best suburbs in the Moreton Bay region for families, 2026".
- First sentence: "Ranked on the average ICSEA of their schools (ACARA), family households (2021 Census) and the median weekly house rent (Queensland RTA bond data, June 2026), these are the ten Moreton Bay suburbs that score highest for families."
- Replace the unsourced "North Lakes consistently ranks as one of Queensland's most liveable suburbs".

**H2s:**
- One per suburb (10), with figures.
- "How we ranked them"
- "The ten compared" (table)
- "What it costs to rent or buy": RTA rents, and medians only where published.
- "Train lines and travel to Brisbane" (PAA "Can you catch a train from Brisbane to Redcliffe?")

**FAQ:**
- "What are the best suburbs to live in Moreton Bay?" (35)
- "Is Redcliffe a nice area?" (46)
- "Is Redcliffe a good investment?" (14)
- "What are the suburbs of Moreton Bay?" (144; in body today)

**Schema:** Article plus ItemList and FAQPage, with `dateModified`.

**Links:** from /regions/moreton-bay ("best suburbs in Moreton Bay for families"); from the Morayfield profile (14,839 impressions in 90 days) and the North Lakes, Narangba, Burpengary and Deception Bay profiles; and from the two Moreton Bay guides (investment corridor, first home buyer). Link /guides/moreton-bay-property-market-update-q1-2025 forward to /regions/moreton-bay once 0.3 is fixed.

**File:** `src/lib/data/blog-posts/top-5-suburbs-families-moreton-bay.ts` (publish with `npm run publish:blogs`, Jos's call).

### 3.5 /property-market/{city}

Demand:
- perth 6,600, sydney 4,400, melbourne 4,400, brisbane 2,400, adelaide 880, canberra 260, hobart 260.
- GSC: 737 impressions at 50.9 across 9 pages (90 days). Bing: Sydney 5.8, Canberra 5.0.

Winnability: low for "{city} property market" (a news SERP with an authority ceiling); medium for "{city} house prices", "median house price {city}" and the Canberra long tail ("canberra suburbs median property prices latest": 87 impressions at 42.6; 12 live via the Canberra cheapest edition).

Status: last crawled 3 July (Canberra 30 Aug), so Google has not seen the 17 Sep rebuild. Too early to read. Request indexing after 0.3.

| Sydney / Melbourne / Perth | Ours | Rival median | Rival best |
|---|---|---|---|
| Words | 343 / 897 / 863 | 1,042 / 1,497 / 1,240 | propertyupdate 6,997 (Brisbane) |
| Tables | 0 / 3 / 3 | 3 of 5 / 3 of 5 / 1 of 5 | |
| FAQ | 0 / 2 / 2 | 0 of 5 | |
| Author | "Your Property Guide" | 3 of 5 | |
| Fresh index change | no | realestate.com.au, AFR: latest month | |

**Proposed titles (60 max; the current titles run 67 to 71 characters before the brand):**
- "Sydney House Prices 2026: Medians by Suburb & Market Data" (57). While no medians are published: "Sydney Property Market 2026: Suburbs, Rents & Schools" (53).
- "Melbourne House Prices 2026: Medians by Suburb & Market Data" (60)
- "Brisbane House Prices 2026: Medians by Suburb & Market Data" (59)
- "Perth House Prices 2026: Suburb Medians & Market Data" (53), with the data year in the first sentence.

H1: keep "{City} house prices, 2026".

First sentence (Adelaide example): "Metropolitan Adelaide's median house sale price was $975,000 in the June 2026 quarter (SA Valuer-General); the typical suburb median we publish across 267 Greater Adelaide suburbs is $1,055,000."

**H2s to add:**
- "{City} house prices over the past year": the official quarterly series as a table. The SA Valuer-General publishes quarters back to 2011; for the others, the VPSR or the DCJ Rent and Sales Report.
- "{City} rents" (bond data only).
- "Forecasts for 2026 and 2027": a link to the forecasts guide; no forecast on the page.

**PAA:**
- "What is the average house price in Sydney in 2026?" (covered)
- "Are Adelaide property prices dropping?"
- "Which suburbs will boom in Adelaide?" (211)
- "What is the expected outlook for the Brisbane housing market in 2026?" (link to the forecasts guide)

**Schema:** keep Article and FAQPage. Add a Dataset for the suburb table and a `dateModified` tied to the data.

**Links:** 14 to 55 in-content inlinks, with anchors mostly the city name. Add "{city} house prices by suburb" from /guides/{city}-property-market-2026, the forecasts guide and the editions.

**Files:** `src/app/(marketing)/property-market/[city]/page.tsx:52-57`; `src/lib/city-narrative.ts`; `src/lib/services/city-market-service.ts`.

### 3.6 /price-guide

Demand: "home price guide" 720; "median house price by suburb" 140/211; "house prices by suburb" 70/254. GSC 619 impressions at 58.4 (90 days); last crawled 30 Aug.

| | Ours | Rival median | Rival best |
|---|---|---|---|
| Words | 591 to 651 | 1,397 to 4,058 | Property Reporter 5,919 (one 748-row table, sales count and window per suburb) |
| H2s | 0 | 2 | propertyupdate 13 (one per capital) |
| Tables | 1 (30 rows) | 3 of 3 to 3 of 5 | propertyupdate 9 |
| Tool | filter (2 inputs) | 2 of 3 | SPI (22 inputs) |
| FAQ / schema | 0 / none | 0 | |
| Query in title / H1 | no / no | 0 of 5 | |

**Proposed:**
- Title: "House Prices by Suburb: Australian Median Price Guide 2026" (58).
- H1: "House prices by suburb, every median we publish".
- First sentence: "Median house and unit prices for {N} Australian suburbs, each with its source and period: NSW Valuer General sales, Land Victoria and SA Government quarterly medians, and ABS statistical-area medians." Make N and the source list dynamic, because NSW is at 0 now.

**H2s:** one per state ("House prices by suburb in Victoria", and so on), server-rendered with sales count and period columns (Property Reporter's credibility device); "How to read a suburb median" (sample size, house vs unit, area medians).

**Tool:** a budget filter for "suburbs under $500,000" (PAA "Where in Australia can I buy a house for $500,000?", AI 4,315). Canonical to the base URL.

**Schema:** Dataset (creator per source, temporalCoverage) plus ItemList; WebPage `dateModified`.

**Links:** 5 in-content inlinks today. Add them from every /property-market/{city} ("house prices by suburb"), from /suburbs, and from the profile price section ("compare with other suburbs' medians").

**File:** `src/app/(marketing)/price-guide/page.tsx`.

### 3.7 Most walkable editions

Covered in 0.1a. After the uncapped ranking ships, request indexing for the 8 editions and the national hub (crawled, not indexed since April).

### 3.8 /best-suburbs (national hub)

Demand: "best suburbs in australia" 90/193 (97 impressions at 28.4; 25.2 since the deploy); "best suburbs to invest in australia" 110/37. Last crawled 30 July.

| | Ours | Rival median | Rival best |
|---|---|---|---|
| Words | 183 | 1,463 to 3,493 | savings.com.au top 100 tables; realestate.com.au 11 tables |
| Tables | 0 | 1 of 5 to 4 of 5 | |
| Author | none | 4 of 5 | |
| Year in title | no | 3 of 5 | |

**Proposed:**
- Title: "Best Suburbs in Australia 2026: Rankings by City & Category" (59).
- H1: "The best suburbs in Australia, ranked on what you can measure".
- First sentence: "Five rankings, each on one stated measure from a public source: school ICSEA (ACARA), median house price (state agencies and the ABS), 12-month price change (NSW and SA sales), gross rental yield (bond data) and walkability (OpenStreetMap)."

**H2s:** "Best suburbs by city" (links to the city hubs, 5.1); "The national top 10 on each measure" (tables with figures); "How to use these rankings".

**FAQ:** "What are the 20 most expensive suburbs in Australia?" (48); "Which suburbs in Australia have the best capital growth?".

**Schema:** CollectionPage plus ItemList per table, and FAQPage.

**File:** `src/app/(marketing)/best-suburbs/page.tsx`. Request indexing for the four category hubs that still show "server error" (for-families, most-affordable, highest-growth, best-rental-yield; all 200 live). Not lowest-flood-risk.

### 3.9 vs pages: /suburbs/{a}/vs/{b}

1,546 pages carried 5,943 impressions and 55 clicks in 90 days; since the deploy they hold 29% of the "{suburb} median / house prices" impressions on suburb URLs.

- Fix 0.4 first.
- Add the profile links with price anchors (3.1).
- Leave the title alone this fortnight (one template change at a time).
- Tracker 43 (link the canonical order) now has a cost: Google shows the non-canonical Frankston order for "median house price frankston".

**Files:** `src/app/(marketing)/suburbs/[slug]/vs/[compareSlug]/page.tsx`; `src/lib/compare-narrative.ts`.

### 3.10 /market-reports/{state}, with /states merged in

**Evidence:**
- All eight /states/* pages are crawled, not indexed, last crawled April to July.
- They have 1 in-content inlink each (/states/qld, /states/vic) against 10 to 22 for /market-reports/*.
- The /states family drew 66 impressions in 90 days, against 384 for market reports. "wa property market" (32 impressions at 51.9) lands on /market-reports/wa.
- Both page types print the same "average of N suburb medians" and the same most-affordable and highest tables.
- /market-reports/qld (crawled, not indexed) is that average, the unsourced commentary and two tables.
- /market-reports/act and /property-market/canberra split the Canberra queries (74 at 77.7 and 69 at 65.9 for "canberra property market value report").

**Decision:** /states pages do not earn their place.
- 308 each /states/{state} to /market-reports/{state}, and /states to /market-reports.
- Carry over the region list, top suburbs by population, the schools link, the ranked-list links and the "Most searched suburbs" block (item 5's recrawl path).
- 308 /market-reports/act to /property-market/canberra.
- Do not merge the other state reports into city pages: "{state} property market" is a different query from "{city} property market".

**What the merged page needs to earn indexing:**
- The state's official figure with its quarter (SA Valuer-General for SA; REIs or the VPSR for the others).
- Bond-data rents by region.
- The published-median tables.
- Links to the capital's page and editions.
- No `STATE_COMMENTARY` (0.6).

Title (QLD example): "Queensland Property Market 2026: Prices, Rents & Suburbs" (56).

**Files:** `src/app/(marketing)/states/[state]/page.tsx`, `states/sitemap.ts`, `market-reports/[state]/page.tsx`, `market-reports/sitemap.ts`, plus the redirect map. The URL rule is "URLs never change"; the merged URLs carry about 1 impression a week.

### 3.11 /suburbs index (30 Sep review 3.7, open)

Demand: "suburb profile" 1,900/41. Rivals' median is 248 words (best 609), with tables in 3 of 4. Ours is 56 words.

- Title: "Suburb Profiles: House Prices, Rents & Schools by Suburb" (56).
- H1: "Suburb profiles for every Australian suburb".
- First sentence: "A suburb profile puts a suburb's median house price, weekly rent, schools, population, crime and walkability on one page, each figure with its source and date."
- H2s: "What's in a suburb profile", "Search a suburb", "Most searched suburbs" (a table with the published median and rent).

**File:** `src/app/(marketing)/suburbs/page.tsx`.

---

## 4. Cannibalisation: who owns which family

| Query family | Owner | Competing today | Action |
|---|---|---|---|
| "{suburb} median house price / house prices" | profile | vs (VIC; 29% since deploy), rental-market (NSW; 32%), /price-guide (Vaucluse 80.8, Maroubra), agents | Title rule (3.1); price-anchor links from vs, rental-market and city tables; rental-market keeps the figure for yield, labelled and linked |
| "{suburb} postcode" | profile; "{pc} postcode" goes to /postcodes/{pc} | | Leave; zero-click |
| "{a} vs {b}" | vs, canonical order | reversed-order URL (Frankston) | Tracker 43 |
| "best suburbs for families brisbane" | /best-suburbs/for-families/brisbane (13.6 since deploy) | /guides/best-brisbane-suburbs-for-families-2026 (288 impressions at 50.4; 1,401 words, no table) | After the 0.1b relabel, 308 the guide to the edition, carrying its "School catchment strategy", "Flood & hazard checks" and "Budget & finance" sections as H2s (tracker 23's second half) |
| "best suburbs in moreton bay (region)" | refreshed guide (3.4) | /regions/moreton-bay (1,445 words, wrong median), Morayfield profile | Refresh the guide; the region page links it |
| "cheapest suburbs in australia", "where can I buy under $500k" | /guides/cheapest-suburbs-buy-house-australia-2026 (136 at 13.2; "australia affordable suburbs under 350k" 88 at 10.4) | /guides/cheapest-suburbs-australian-capitals-winter-2026 (16 inlinks), /best-suburbs/most-affordable (national) | The buy-house guide owns the national query. The winter report stays as a dated report and links to the guide and the editions (its NSW figures are "at 8 July 2026"; leave them dated). The national ranking is the data both cite |
| "{city} house prices / median house price {city}" | /property-market/{city} | /best-suburbs/most-affordable/melbourne ("melbourne property prices by suburb"), /guides/{city}-property-market-2026 | The guides own "{city} property market 2026 / forecast" (Perth guide 114 at 20.1, Sydney 109 at 19.7) and link the city page with "{city} house prices by suburb" |
| "canberra ... median property prices / market report" | /property-market/canberra | /market-reports/act, /best-suburbs/most-affordable/canberra (12 live) | 308 /market-reports/act to /property-market/canberra (3.10) |
| "{state} property market" | /market-reports/{state} | /states/{state} | Merge (3.10) |
| "best suburbs in {city}" (generic) | new city hub (5.1) | single editions | Build the hub; editions keep their own families |

---

## 5. New pages or tools worth building

### 5.1 City hubs: /best-suburbs/{city} (8 capitals)

Demand:
- "best suburbs in perth" 880 / AI 592
- "best suburbs in adelaide" 880 / 393
- "best suburbs to buy in melbourne" 170 / 219
- "best suburbs to buy in sydney" 50 / 343
- "best suburbs to invest in brisbane" 320 / 61
- "best suburbs to buy in brisbane" 90 / 35
- "best suburbs hobart" AI 106; "best suburbs in darwin" AI 53
- brisbane, sydney and melbourne "best suburbs in" at 880 to 1,900 (30 Sep review)

SERP format:
- Provider listicles of 1,100 to 2,100 words, one H2 per suburb, a "how we chose" section, year in the title.
- AIOs cite small sites (sitchu, keystms, notaballerina, northremovals).
- Adelaide families already ranks 11 for the generic query.

Page:
- Title "Best Suburbs in Perth 2026: Families, Price & Rent" (50).
- "The best suburbs in Perth, by what you want": a section per measure (families by ICSEA, cheapest, rental yield or growth where ranked), each with the top 5, their figures and a link to the edition.
- A method stating each measure and its source.
- FAQs: "What are the top 10 suburbs in Perth?" (276), "Which part of Perth is best to live in?" (13).
- ItemList per section, FAQPage.

"Best" stays tied to a stated measure in every section. Route: `/best-suburbs/[category]` resolves a city slug (the six category slugs are fixed). Build after 0.1 and 0.2, so the hub does not repeat the faults.

### 5.2 Budget lists: suburbs under $500,000 / $600,000

PAA "Where in Australia can I buy a house for $500,000?" (AI 4,315) and "Where is the cheapest place to buy a house?" (3,850). The SERP is realestate.com.au data articles with tables.

Build it as a server-rendered "under $500,000 by state" table on /guides/cheapest-suburbs-buy-house-australia-2026, plus the /price-guide budget filter. No new URL.

### 5.3 Unit tables on the cheapest editions

OpenAgent and Canstar both split houses and units. Land Victoria and ABS unit medians are published (`UNIT_MEDIAN_SOURCES`). Add a section, not a URL.

### 5.4 Price history on profiles (tracker 17, built on branch under 31)

Rivals' differentiator: tables in 3 of 4 profile SERPs; OpenAgent's "5 year median price trend". Use the Land Victoria quarters, the ABS annual series, the SA two-year file and the NSW captured rows.

### 5.5 Later: region family editions

Gold Coast, Sunshine Coast, Logan, Ipswich and Moreton Bay, only after QLD medians return and 0.1b ships. KP is unknown; the Moreton Bay guide refresh is the test.

---

## 6. AI search: answer-first copy (under 60 words, one sourced and dated figure)

| Question (AI vol) | Page | Proposed answer | Source |
|---|---|---|---|
| Where in Australia can I buy a house for $500,000? (4,315) | /guides/cheapest-suburbs-buy-house-australia-2026 | "Mostly in regional towns and on the outer edges of Perth, Hobart and Darwin. In Melbourne and Adelaide the cheapest published house medians are above $500,000. The lowest published medians are in regional Victoria: Jeparit's was $149,000 (Land Victoria quarterly suburb median, May 2026 release)." | Land Victoria VPSR. Depends on the 0.2a screen; until then our page says Melbourne $381,000 |
| Can you buy a house in Australia for $100,000? (1,328) | /best-suburbs/most-affordable | "Rarely. Of the suburb house medians state agencies and the ABS publish, the lowest we list is Jeparit, in Victoria's Wimmera, at $149,000 (Land Victoria quarterly suburb median, May 2026 release). Individual houses do sell for less in remote towns, usually needing major work." | Land Victoria VPSR |
| Where is the next property boom in Australia? (664) | /guides/australia-fastest-growing-suburbs-2026 | "No one can tell you where the next boom will be, and we do not forecast one. What is measured is the past year: metropolitan Adelaide's median house sale price rose 12.7% to $975,000 in the year to the June 2026 quarter (SA Valuer-General). Our growth rankings list suburbs by their measured 12-month change." | SA Valuer-General, published data and statistics (page updated 28 July 2026) |
| Which suburbs will boom in Adelaide? (211) | /property-market/adelaide FAQ; /best-suburbs/highest-growth/adelaide | "We do not predict which suburbs will boom; a past rise says what happened, not what will. Metropolitan Adelaide's median house sale price was $975,000 in the June 2026 quarter, 12.7% above a year earlier (SA Valuer-General). Our Adelaide growth list ranks suburbs by their measured 12-month change." | SA Valuer-General |
| Are Adelaide property prices dropping? (11) | /property-market/adelaide | "Not on the latest official quarter. Metropolitan Adelaide's median house sale price was $975,000 in the June 2026 quarter, against $970,000 in March (SA Valuer-General). Monthly value indexes can move differently from recorded sales, so check the date on any figure you compare." | SA Valuer-General |
| What are the top 10 suburbs in Adelaide? (149) | city hub (5.1) or families edition | "It depends on what you rank. By the average ICSEA of their schools (ACARA), Stonyfell, Medindie and Morphettville lead Adelaide's family suburbs. By price, the cheapest published house median is Elizabeth South at $650,000 (SA Government quarterly suburb median, October 2026 release). Each list states its measure and source." | data.sa.gov.au metro median by suburb; after the 0.1b relabel |
| What are the top 10 suburbs in Perth? (276) | city hub (5.1) | "It depends on what you rank. By the average ICSEA of their schools (ACARA), Dalkeith, Claremont and Nedlands lead Perth's family suburbs. By price, the cheapest published house median is Calista at $447,500 (ABS statistical-area median for 2024). Each of our Perth lists states its measure, source and data year." | ABS SA2 median house price, 2024 |
| Is Mount Waverley a suburb? (79) | profile FAQ (template: "Is {Suburb} a suburb?") | "Yes. Mount Waverley is a suburb in Melbourne's south-east, in the City of Monash, postcode 3149. Its median house price is $1,640,000 (Land Victoria quarterly suburb median, May 2026 release)." | Land Victoria VPSR |
| What are the 20 most expensive suburbs in Australia? (48) | /price-guide | "On the medians state agencies and the ABS publish, Toorak in Melbourne tops the list at $5,000,000 (Land Victoria quarterly suburb median, May 2026 release), level with Forrest in Canberra on the ABS figure for 2024. Our price guide sorts every published median, highest first, with its source and period." | Land Victoria VPSR |

Held until a dated primary figure is in hand. Each takes the same "we do not forecast; here is what was measured" answer:
- "Which suburbs will boom in 2026 in NSW?" (346): needs the NSW DCJ Rent and Sales Report's Greater Sydney median.
- "Which suburbs in Brisbane will boom in 2026?" (260) and "Which QLD suburbs will boom in 2026?" (120): need the REIQ Greater Brisbane median.
- "Where is the best place to buy in Sydney?" (446): needs NSW medians back and 0.1b.

---

## 7. Status of the previous review's items in this vertical

| Item | Status | Evidence |
|---|---|---|
| 3.6 / tracker 22: best-suburbs city editions | Shipped 1 Oct (#86) | 24 in the sitemap, crawled 1 Oct, indexed; 570 impressions and 12 clicks at 18.3 in 7 days. Integrity faults in 0.1 and 0.2. Brisbane rental-yield and Sydney cheapest/growth are noindex (fewer than ten qualify) |
| 3.6 extras (section per suburb, method, date, PAA, budget tier) | Shipped | "Under $500,000" only where three or more qualify; boom questions answered without forecasts |
| Tracker 45: families H1 | Shipped 30 Sep (#80) | Live: "The best suburbs for families in Australia." |
| 3.8 / tracker 2: profile title | Shipped for SA/TAS only (#87); too early to read | 3 of 30 sampled SA and 0 of 10 TAS profiles recrawled since 1 Oct; recommend widening now (3.1) |
| 3.8: "Is {suburb} a good investment?" FAQ | Shipped, all profiles | Live on Frankston; withheld where no yield is published (Morayfield) |
| 3.8: Hawthorn / Hawthorn East pick | Open | VIC is still on the legacy title |
| 3.7: /suburbs "what's in a suburb profile" and search | Open | 56 words live |
| Section 4: "suburb / house prices" family (300,570 volume, 267,170 with no impression) | Open | 3.1, 3.5, 3.6 here |
| Section 6 PAA: "What suburbs will boom in 2026 in QLD?" | Shipped (no-forecast answer on Brisbane editions) | |
| Section 6 PAA: "Which suburb in Sydney has the highest median house price?" | Open | NSW medians withheld |
| Tracker 23: Moreton Bay and Brisbane families guides | Open | 3.4, section 4 |
| Tracker 33: city pages rebuilt 17 Sep | Live (tracker box unticked); too early | Google last crawled them 3 July |
| Tracker 36: /best-suburbs category hubs 500 | Fixed 29 Sep; Inspection still "Server error" (June crawl) | All 200 live; request indexing except lowest-flood-risk |
| Tracker 47: lists print only published medians | Shipped 29 Sep, holding | The gate now hides NSW, VIC and (0.8) QLD through the labels |
| Tracker 49(i): families ranking of an arbitrary 500 | Fixed for city editions (Adelaide ranks from 226) | Label fault remains (0.1b) |
| Tracker 49(ii): flood risk | Open | 0.1c |
| Tracker 50 (regions filed wrong) / 51 (ABS name match) | Open | Morayfield; Moreton Bay's 5-suburb rollup is a separate coverage fault (0.3) |
| Tracker 43: vs canonical-order links | Open (optional) | Now costs: Google shows the non-canonical Frankston pair |
| Tracker 15(a): SA medians "look inflated" | Open; partly explained | The SA Valuer-General's metropolitan median was $975,000 for June 2026, so the $1.05M "median of suburb medians" is mostly method. Check Elizabeth ($697,500) against its data.sa.gov.au row to close |
| Tracker 3.1(c) follow-up: clear WA census rent proxies | Open | Perth city page "Median house rent $350/wk" (0.3) |

**Request indexing, after the fixes:**
- /best-suburbs and its four category hubs
- the eight /property-market/{city} pages
- /price-guide
- /guides/top-5-suburbs-families-moreton-bay, after the refresh
- the merged /market-reports pages
