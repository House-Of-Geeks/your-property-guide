# Renting and landlords: commercial-intent findings, 10 Oct 2026

> Part of the [commercial-intent and competitor gap review of 10 October 2026](../commercial-intent-review-2026-10-10.md). Written by a read-only analyst from the evidence pack `data/packs/renting-landlords-*` in the run folder `~/Desktop/Ads/ypg-commercial-intent-review-2026-10-10/` (SERP digest, compare rows, GSC queries, intent-match misses, unanswered PAA) and the source at origin/main 9ef5ee7. File and line references are to that commit. Points marked "verify" are the analyst's own knowledge, not a source fetched in this run: check them with the regulator before changing copy. No site code was changed.

Pack `renting-landlords`: /suburbs/{slug}/rental-market, the property management fees guide and calculator, rental appraisal and property manager intent, rental investment queries, the renters' rights guides, rentvesting.

Windows: Search Console 90 days (10 Jul to 7 Oct) and since the deploy (1 to 7 Oct); Bing 90 days; live SERPs, URL Inspection and our live pages (curl) on 10 Oct; source at origin/main 9ef5ee7 (`repo-main/src`). Google anonymises most queries: only 4,802 of the rental-market pages' 34,662 impressions in 90 days carry a query, so families below are read by impressions and position, and clicks by page.

**Top five, in order:** (1) the landlord form on every rental-market page (6,305 in the sitemap) promises a call from "one local property manager ... who pays us", while our agent page says we do not supply rental leads: confirm a property manager is taking them or switch the form off by state; (2) the NSW renters' guide (and its FAQ schema, and the link blurbs on six sibling guides) says no-grounds evictions are still legal in NSW, 17 months after they ended; VIC, SA and QLD need the same law check; (3) the rentvesting guide, updated 7 Oct, gives the pre-reform negative gearing and CGT position to exactly the buyer the 2027 change hits; (4) the rental-market template's H1 is "The rental market", its titles carry no state, postcode or year and its Article schema says 1 Jan 2025: fix these in the item 13 rollout; (5) Google has not seen any of the 1 Oct work in this vertical (property management guide crawled 13 Jul, WA rental pages 3 Jul): request indexing, with two corrections to the lead's list.

---

## 0. Fix first

| # | Problem | Evidence (live, 10 Oct) | Source | Fix |
|---|---|---|---|---|
| 0.1 | **Landlord lead form: nobody is confirmed to take the leads** | Every rental-market page: "Free, no commitment. Your details go only to the one local property manager we match you with, who pays us for the introduction." On submit: "A property manager who works in Port Hedland will call within one business day to arrange the appraisal." The confirmation email repeats it. The FAQ (and FAQPage JSON-LD) on every page: "The request form on this page goes to one local property manager, who pays us for the introduction". Our agent page /real-estate-leads/appraisal-leads, in its FAQ and JSON-LD: "Do you supply rental or leasing appraisal leads? Not at the moment." Tracker item 53 (#83): "Before merging: a property manager has to be ready to take the leads"; neither the tracker nor the change log records one. | `src/components/suburb/RentalAppraisalForm.tsx:118`, `:251`, `:259`; `src/lib/rental-landlord.ts:318`; `src/lib/lead-emails.ts:303`; `src/lib/data/real-estate-leads.ts:375-377` | Jos checks (read-only) how many `rental-appraisal` leads have arrived since 1 Oct and where each went. Where no property manager is contracted for a state, render the page without the form (keep the fee table and FAQs, drop the "goes to one local property manager" sentence from the FAQ answer) until one is. When one is contracted, keep the disclosure as it stands and update the agent-page FAQ. **No new landlord lead capture anywhere (guide, hub page) until this is settled.** The form's "Reply within 1 business day" is the most the copy may promise; nothing below adds to it. |
| 0.2 | **NSW renters' rights guide states the law before 19 May 2025** | /guides/renters-rights-nsw ("Reviewed April 2026"): "No-grounds evictions are still permitted on periodic tenancies in NSW (90 days notice required)"; "As of April 2026, the provisions remain in place but are subject to change"; FAQ, also in FAQPage JSON-LD: "Can my landlord evict me without a reason in NSW? On a periodic tenancy, yes, but they must give 90 days written notice." The NSW Government page on the same SERP (last updated 19 May 2025): "Changes limiting reasons landlords can end a lease and refuse a pet – from 19 May 2025 ... Laws to limit rent increases to once per year – from 31 October 2024." Our guide dates once-a-year increases to 2023 ("NSW introduced stricter rules in 2023") and its notice table still has "Fixed term, end of term: 30 days" and "Periodic, no grounds: 90 days"; Go To Court (reviewed 15 Apr 2026) gives 60 days under six months and 90 days over six months for a non-breach reason. The error is repeated in the related-guide blurbs on six other renters' guides ("NSW also still permits no-grounds evictions."). | `src/app/(marketing)/guides/renters-rights-nsw/page.tsx:52`, `:74`, `:79`, `:188`, `:264-265`, `:289` (updatedAt `:21`); blurbs `renters-rights-wa/page.tsx:100`, `-tas:101`, `-sa:100`, `-qld:103`, `-act:104`, `-vic:104` | Rewrite the eviction, notice-period and rent-increase sections to the Residential Tenancies Act 2010 as amended (in force 19 May 2025), each rule with its source and as-at date (NSW Fair Trading or nsw.gov.au); correct the FAQ answers (they are the JSON-LD); fix the six blurbs; new updatedAt; request indexing. Demand: "renters rights nsw", "tenants rights nsw", "tenant laws nsw" 880 a month each. The AI Overview for "renters rights nsw" cites nsw.gov.au and tenants.org.au; a page that contradicts them will not be cited. |
| 0.3 | **VIC renters' guide misses the 2025 laws and contradicts our own PM guide** | /guides/renters-rights-vic: "Since March 2021, no-grounds evictions are abolished in Victoria"; "Rent can only go up once every 12 months with at least 60 days written notice"; sale, renovation and owner-moving-in notices at "60 days". The Premier's release on the SERP (6 Mar 2025): the new laws "ban no fault evictions" and change "the notice period from 60 to 90 days ... when they receive a notice of rental increase or notice to vacate". Inspections: VIC guide "Maximum 4 per year"; our property management guide, citing Consumer Affairs Victoria, "Victoria allows one general inspection every six months and none in the first three months". | `src/app/(marketing)/guides/renters-rights-vic/page.tsx:48`, `:52`, `:74`, `:99`, `:137`, `:173`, `:209`, `:257-259`; `src/lib/data/property-management-fees.ts:253` | Confirm each start date with Consumer Affairs Victoria, rewrite to the Residential Tenancies Act 1997 as amended with as-at dates, and make the inspection rule match CAV on both pages. |
| 0.4 | **SA, QLD, WA, TAS, NT guides: eviction rules unverified since April** | /guides/renters-rights-sa, the vertical's second Bing page (19 clicks, 781 impressions at 6.9): "As of April 2026, SA still permits no-grounds evictions on periodic tenancies with 90 days notice." Our understanding is that SA's Residential Tenancies (Miscellaneous) Amendment Act 2023 ended no-cause terminations from 1 July 2024. /guides/renters-rights-qld's notice table: "Periodic, no grounds (pre-2024 rules) ... 2 months (transitional)"; our understanding is that without-grounds notices ended on 1 October 2023. Neither date is in the evidence pack: verify with Consumer and Business Services and the RTA before editing. WA (60 days), TAS (42 days) and NT (42 days) no-grounds claims are all "Reviewed April 2026". | `renters-rights-sa/page.tsx:49`, `:141`, `:215`; `renters-rights-qld/page.tsx:238`; `renters-rights-wa/page.tsx:49`, `:215`, `:220`; `renters-rights-tas/page.tsx:51`, `:76`, `:249`; `renters-rights-nt/page.tsx:50`, `:250` | One law check across the eight guides, each rule with the Act and an as-at date; SA first (Bing traffic). |
| 0.5 | **Rentvesting guide (updated 7 Oct) gives the pre-reform tax position** | Key takeaway: "Negative gearing applies. Rental losses (after depreciation and interest) reduce your taxable income. Capital gains tax applies on sale, with the 50% discount after 12 months." Body: "Australian tax law allows you to deduct rental property expenses against your overall taxable income." Exit section: "(50% discount after 12 months)". The Treasury Laws Amendment (Tax Reform No. 1) Act 2026 and the ATO (updated 29 June 2026), as the site already states in `src/lib/data/tax-reform-2027.ts`: from 1 July 2027 a loss on an established home bought after 7:30pm AEST on 12 May 2026 "no longer reduces tax on other income" (`src/lib/negative-gearing-calc.ts:81`), and gains accruing from 1 July 2027 move from the 50% discount to cost base indexation and a 30% minimum tax. A rentvester buying an established home now is the affected buyer. The state-by-state post says the same ("can offset other income via negative gearing if applicable") and prints unsourced figures: "Liverpool, Campbelltown corridor; Newcastle and Hunter. Both offer house medians under $750K with 3.5 to 4.5% yields"; "All offer sub-$600K entry with 4.5 to 5.5% yields". No source, no date, and the NSW suburb pages currently withhold those medians. | `src/app/(marketing)/guides/rentvesting-australia/page.tsx:58`, `:303`, `:390`; `src/lib/data/blog-posts/rentvesting-australia-state-by-state-guide-2026.ts:20`, `:47`, `:53` | Rewrite the three passages from `TAX_REFORM_SOURCES`; remove or source the state-by-state figures (or fold the post into the guide, section 4). |
| 0.6 | **Property management guide: an offer we cannot keep, and two cells that contradict themselves** | "Find an Expert: Looking for a property manager? Browse our network." /find-an-expert offers Buying, Selling, Refinancing and Something else; there is no property manager option and nothing to browse. Table: South Australia "9% to 15% ... state average 7.5%"; Western Australia letting "2 to 3 weeks; state average 1.7 weeks": the average sits below the range it is printed beside (LocalAgentFinder, Mar 2026, against REIQ, Dec 2023, and WhichRealEstateAgent, 2026). The rental-market table repeats it: Queensland "7.5%" typical beside a "9%" metro range; SA 7.5% beside 9% to 15%. | `src/app/(marketing)/guides/property-management-fees-australia/page.tsx:109`; `src/lib/data/property-management-fees.ts:276`, `:289`; `src/lib/rental-landlord.ts:87`, `:89` | Remove the Find an Expert card. Print the average and the range as two dated surveys with one line saying they differ, or drop the out-of-range cell; add the invariant (low ≤ average ≤ high, or an explicit note) to `tests/lib/property-management-fees.test.ts`. |
| 0.7 | **City pages print a census-proxy rent with no source or quarter** | /property-market/perth: "Median house rent $350/wk weekly, across tracked suburbs". Our own WA pages (WA rental bond data, July to September 2026): Joondalup $640, Nedlands $900, Floreat $1,000 a week across all dwellings. The 2 Oct change log names the cause (census proxies on the 1,440 WA localities the feed does not cover) and leaves `clear-rent-proxies --state WA` open. /property-market/brisbane prints "$790/wk" with no source either. | `src/lib/services/city-market-service.ts:155`; `src/app/(marketing)/property-market/[city]/page.tsx:222-227`; `src/app/(marketing)/regions/[slug]/page.tsx:240` | Build the city rent from SuburbRentalStat rows of named feeds only, with source and quarter, or withhold it; run the WA proxy clean-up (dry run first, Jos's go). |
| 0.8 | **Rental-market template: smaller accuracy items** | Legacy branch (NSW, QLD, SA, TAS): "Rental data as of June 2026 · rental-nsw" (the feed code, not its name), periods "2026-Q2", "$1600/wk"; the yield block prints "Median house price $1,483,000" with no source or sample (Brighton SA; the FAQ below it names "Median of 10 house sales · SA Government"). The block's rent falls back to the Suburb row (`suburb.stats.medianRentHouse`), which can be a seed or proxy value. WA: the worked line and the appraisal FAQ date the median "(WA rental bond data, September 2026)"; the figure is the July to September 2026 quarter. Every rental-market page's Article JSON-LD: datePublished and dateModified "2025-01-01", headline "... \| Your Property Guide". VIC pilot (50 pages): "What it costs to rent in Werribee now." over "Victorian rental report, September 2025", a moving-annual median a year old; the VIC feed's CKAN download failed on the 1 July 2026 cron. | `src/app/(marketing)/suburbs/[slug]/rental-market/page.tsx:109`, `:181-191`, `:207-211`, `:131-136`; `src/lib/rental-landlord.ts:237`, `:312`; `src/components/suburb/RentalMarketSections.tsx:41-43`; `repo-main/scripts/sync/sources/rental-vic.ts:24-25` | The item 13 rollout (section 3, page 2) removes the legacy branch. Until then: label the source with `rentalSourceLabel`, drop the Suburb-row fallback, use `span` for the WA quarter, set dateModified from the newest rental row, and say "latest published" instead of "now". Check DFFH for later quarters and rerun rental-vic. |
| 0.9 | **Two entries on the lead's request-indexing list are wrong** | `request-indexing.csv` lists /suburbs/canberra-act-2600/rental-market (answers `noindex, follow`: ACT has no rental feed) and /suburbs/nedlands-wa-6909/rental-market (6909 is the PO-box locality: `noindex`, no rental row). /suburbs/nedlands-wa-6009/rental-market is the indexable page ($900, 57 bonds) and is where "nedlands rental investment" has landed since the deploy (8 impressions at 29.5). | `the review's request-indexing list (corrected in `data/2026-10-10/request-indexing.csv`)` | Drop Canberra; swap 6909 for 6009. |

---

## 1. Where we match commercial intent (keep doing)

- **Rental-market pages are the site's biggest click source.** 281 of 948 page clicks in 90 days (30%), 34,662 impressions at 15.8, on 5,237 pages. Since the deploy: 24 clicks and 3,440 impressions in 7 days at 12.8 (491 a day against 385 before). By state, 90 days: QLD 68 clicks / 9,742 impressions / 15.6; NSW 81 / 7,828 / 16.9; VIC 51 / 7,076 / 15.0; SA 55 / 5,444 / 11.3; WA 20 / 3,641 / 20.6. URL Inspection: 162 of 170 inspected rental-market pages indexed.
- **The landlord query families already land on the right template.** 90 days, queries carrying a rental-market landing: rental appraisal or estimate 141 queries / 993 impressions at 38; "{suburb} rental investment" 25 / 833 at 30 (all WA); rental yield 32 / 337 at 48; property management 40 / 276 at 40; rent reviews 7 / 220 at 36. Right page since the deploy: rental investment 84% (41 of 49 impressions), renting 71%. "rental appraisal dampier" sits at 4.6 and "rental appraisal south hedland" at 15.1 since the deploy.
- **#83 built what the rental-appraisal SERP rewards, on every branch.** The SERP for "rental appraisal" is five agency request pages (LJ Hooker 1,275 words; Centurion 566 words, 26 inputs; 1840 295 words, 13 inputs). Every rental-market page now has the request form, the state fee table with a worked line on the suburb's own sourced rent, and four FAQs. Keep the shape; the open question is who answers the form (0.1).
- **The WA pages publish what the WA rental-investment SERP holds.** Port Hedland: 12 quarters of all-dwellings medians with bond counts, small-sample flags, the licence credit, no invented yield. Rivals on "darch rental investment" are listings (REIWA), realestateinvestar's snapshot (1,157 words, 3 tables) and YIP's profile. Too early to read: Google's copies of the WA pages are from 3 Jul, before the feed (2 Oct) and the landlord block (1 Oct).
- **The property management fees guide out-builds the top five on every measure.** 4,924 words live, a 9-row state table with dated footnotes, a 10-input annual cost calculator, one H2 per state, 9 FAQs in JSON-LD; rival median 1,521 words, 2 of 5 with a table, 1 of 5 with a calculator. Bing: 27 clicks / 992 impressions at 4.5 (the vertical's best Bing page). Clarity: 25 organic sessions in 90 days, 97 s engagement. Google: 38 impressions in 90 days at 31.8, last crawled 13 Jul, so the 1 Oct rebuild is too early to read.
- **Renters' rights ACT is the best renters' page on Google**: 6 clicks / 422 impressions at 23.8 in 90 days, 32 at 9.5 since the deploy. Bing carries the series: SA 19 / 781 at 6.9, NSW 4 / 143 at 5.9, QLD 1 / 118 at 6.2.
- **Commercial impressions per day** (83 days before vs 7 after the deploy): property management 8.0 to 22.6 (position 35.8 to 32.0); renting 7.0 to 10.9 (68.0 to 62.4); rental yield 16.2 to 23.0 (73.6 to 52.8); rental investment 9.6 to 7.4 (29.5 to 27.9; WA pages not recrawled).

---

## 2. Where we miss, by query type

Live SERPs (25 targets, AU desktop, 10 Oct): we are not in the top 20 on any; an AI Overview shows on 24 and cites us on none. The Overviews cite small sites here (dixonrealestate, urbanrenters, tenanttools, bondbackquotes, rental360), so authority is not the whole ceiling on these.

| Query type | Our impressions / position | Keyword Planner / AI volume | What the top 5 reward | Our landing page | The gap |
|---|---|---|---|---|---|
| Rental appraisal, local ("rental appraisal {suburb}", "rental estimate canberra") | 993 at 38 (90d); 122 at 34 (7d) | "rental appraisal" 1,900 ($25.56 CPC), AI 29; "free rental appraisal" 170 ($28.29), AI 4; suburb terms 0 | Agency request pages: a form above the fold, "rental appraisal" or "free rental appraisal" in title (4 of 5) and H1 (4 of 5); short (295 to 1,275 words); no tables | /suburbs/{slug}/rental-market: title "{Suburb} Rental Market \| Rent Prices & Trends", H1 "The rental market"; the form sits below the rent and history tables; ACT pages noindex; no national page | Title/H1 carry neither the suburb in the H1 nor "appraisal"; the form's fulfilment is unconfirmed (0.1); Canberra demand (190 impressions across "rental estimate canberra", "appraisal for rent canberra", "rental appraisal act") has no indexable page |
| Rental investment and yield ("{suburb} rental investment", "brighton sa rental yield") | 833 at 30 + 337 at 48 (90d) | 0 for suburb terms; "rental yield" 1,000, AI 952 | Suburb investment data pages: suburb, state and postcode in title and H1 (realestateinvestar "Investment Property Darch, Western Australia, Wanneroo, 6065"; YIP "Darch, WA 6065: Suburb Profile & Property Report"), snapshot, supply-and-demand and statistics tables, nearby suburbs | WA all-dwellings branch: 2 tables, no yield (correctly), no neighbour comparison; H1 has no suburb | No state or postcode in titles: "brighton sa rental yield" lands 21 impressions on Brighton TAS at 50; no nearby-suburb table (rivals' most-used missing terms are neighbour names: Madeley, Marangaroo, Landsdale) |
| Property management, local ("property management {suburb}", "property management fees goodna") | 276 at 40 (90d); 51 at 27 (7d) | "property manager near me" 1,300 ($14.14), AI 0; suburb terms 0 | Directories of named property managers (REIWA "Compare 38 property managers servicing Haynes"; homely 36 in Goodna), agency PM pages | Rental-market page (fee table, form) or, wrongly, /suburbs/{slug}/agents (Bermagui 12 at 45, Harrisdale 8 at 37, The Ponds 6 at 43) | No directory and no property manager network; agents pages carry no link to the landlord block |
| Property management fees, national and state | 38 at 32 (90d, guide) | "property management fees" 1,000 ($12.77), AI 410, plus nine variants at 1,000 each ("property management cost", "property manager fees" ...); NSW 70, QLD 70 (AI 30), VIC 0 | State table with dated averages (the AI Overview prints LocalAgentFinder's), a calculator (WhichRealEstateAgent's city pages, 11 to 15 inputs), FAQ | /guides/property-management-fees-australia (all of that) | Not crawled since 13 Jul; the two contradicting cells (0.6); a selling-guide CTA; no "what does a property manager do" section (PAA AI 2,320) |
| Rent reviews ("rent reviews {suburb}") | 220 at 36 (90d) | 0 | Agency "rent review" pages (Realty at the Bay, 346 words), listings | NSW legacy rental-market pages (Picton 63, Tahmoor 62, Davidson 57) | The words "rent review" appear nowhere on the page; no rent-increase rule for the state |
| Renters' rights by state (informational, YMYL) | NSW 200 at 39; VIC 94 at 39; QLD 93 at 41; SA 50 at 37 (90d) | "renters rights nsw" 880 ($10.24); "victorian tenant rights" and "rights as a tenant victoria" 5,400 each; "renters rights vic" 20; QLD 110 | Government, legal and advocacy pages, current to the latest reform, often reviewed by a solicitor with a date (Go To Court "Last reviewed 15 April 2026"); rival median 577 to 658 words | Our eight guides, 1,223 to 1,760 words, FAQ 6, one table | Shape is fine; the law is out of date (0.2 to 0.4), and the VIC title says "Renter's" where 5,400 searches a month say "tenant" |
| Rentvesting | 788 at 78 (90d); 88 at 72 (7d) | "rentvesting" 1,900 ($5.49), AI 62; "what is rentvesting" 480; "rentvesting australia" 260 | Banks and Canstar (CommBank 723 words; NAB 1,557; Canstar 2,414 with a named author, updated 8 Oct 2026); propertyinvestmentprofessionals 3,496 words, 5 tables, FAQPage | /guides/rentvesting-australia (3,479 words, 8 FAQs, no table) and a second post | Authority ceiling on the head term; wrong tax position (0.5); no comparison table; two pages for one query family |
| Bonds and landlord insurance | 0 | "rental bond" 4,400; "bond refund" 2,900; "how to get bond back" 170, AI 244; "landlord insurance" 14,800 ($43.34), AI 1,305 | Bond: REIQ 810 words, Consumer Affairs Victoria 188, RentBetter help articles 1,121 to 1,383. Insurance: insurers and Canstar (8,267 words, 51 H2s) | none | See section 5: bond guide yes, insurance no |

---

## 3. Priority pages, ranked by demand × winnability

| Rank | Page | Demand | Winnability | Why this rank |
|---|---|---|---|---|
| 1 | Rental-market template, WA all-dwellings branch (367 pages) | WA landlord families: ~1,300 impressions in 90 days at 20 to 40 | High: ranking pages are 135 to 1,532 words; our data is the only bond-level series | Pages exist, data is unique, Google has not seen either change |
| 2 | Rental-market template, NSW/QLD/SA/TAS legacy branch (item 13 rollout) | 23,000+ impressions in 90 days on these states' pages; rent reviews 220, PM fees 63, yield 337 | High | The rollout is built and tested (VIC pilot); it fixes titles, provenance and FAQ in one commit |
| 3 | /guides/property-management-fees-australia | 1,000 + nine 1,000 variants; AI 410 | Medium-high: Bing 4.5; small pages in Google's top 5 (Boffo 629 words) | Too early to read on Google; three content fixes and a recrawl |
| 4 | /guides/renters-rights-nsw | 880 × 3 variants | Medium: Go To Court and Flatmates rank with 1,327 and 2,160 words | Accuracy first; then it competes |
| 5 | /guides/renters-rights-vic | 5,400 × 2 ("tenant rights victoria") | Medium-low: government-heavy SERP | Big volume, title mismatch, stale law |
| 6 | /guides/rentvesting-australia | 1,900 + 480 + 260 | Low-medium: banks; position 78 | Already shows (788 impressions); the 2027 tax change is a differentiator the bank pages may not carry |
| 7 | /guides/renters-rights-sa | Bing 781 impressions in 90 days | Bing: high | Protect Bing traffic: verify the law |
| 8 | /guides/renters-rights-qld | 110 | Medium | Verify the law; PAA gaps |
| 9 | ACT: /guides/renters-rights-act and /suburbs/canberra-act-2600/rental-market | ~190 landlord impressions on the wrong or noindex page; ACT guide 422 impressions | Medium | Needs an ACT rent source before the Canberra pages can index |

### Page 1. Rental-market template, WA branch (Port Hedland, Darch, Floreat, Joondalup, Landsdale, Nedlands)

Demand, 90 days: "rental appraisal port hedland" 108 at 25, "rental appraisal karratha" 38, "rental appraisal dampier" 23, "rental appraisal tom price" 15; "{suburb} rental investment" 833 across 17 WA suburbs (Darch 85, Floreat 81, Joondalup 78, Landsdale 78, Nedlands 114 across three URLs, Churchlands 66, Ocean Reef 61); "property management murdoch" 67 at 39, "property management haynes" 40 at 44; "camillo median rent" 116 at 21.

| | Ours (Darch / Port Hedland) | Rival median | Best rival |
|---|---|---|---|
| Words | 1,551 / 1,558 | 1,110 (Darch, 4 parsed) / 488 (Port Hedland) | realestateinvestar /property/darch, 1,157 |
| H2s | 5 | 4 | 5 (Suburb Snapshot; Supply & Demand; Statistical data) |
| Tables | 2 (21 rows) | 1 of 4 | 3 (14 rows) |
| Tool | appraisal form, 8 inputs; no calculator | 3 of 4 (search filters) | none |
| Schema | Article, FAQPage, Place, BreadcrumbList | none of note | none |
| FAQ | 4 (FAQPage) | 0 of 4 | 0 |
| Author | organisation | 0 of 4 | none |
| Query in slug / title / H1 / intro | no / no / no (H1 has no suburb) / 0.67 | 0 of 4 on the exact phrase, but suburb, state and postcode in every title and H1 | "Investment Property Darch, WA, 6065" |

The AI Overview for "rental appraisal port hedland" cites realestate.com.au, YIP, realestateinvestar, LJ Hooker Hedland, Ray White Port Hedland and Avalon; the organic top 2 are a 226-word Old Listings report and a 183-word view.com.au inspection list. Small pages rank.

- **Title** (60 max, before the suffix), a fallback chain like `rentalMarketTitle`: "{Suburb} {STATE} {postcode} Rental Market 2026: Rent & Investment" (Port Hedland WA 6721: 58), else "... : Median Rent", else without the postcode. Where a house yield is published (other states): "... : Rent & Yield". State and postcode separate the Brighton, Newport and Scarborough pages that searchers already disambiguate ("rental appraisal newport 4020", "brighton sa rental yield").
- **H1**: "Port Hedland rental market" (the suburb inside the H1; the italic span stays on "rental market").
- **First intro sentence**: "Port Hedland's median rent across all dwellings was $988 a week in July to September 2026, from 44 bonds lodged (WA rental bond data), up 4% on a year earlier."
- **H2s to add**: "Rents in nearby suburbs" (the same quarter for the suburbs sharing the postcode or LGA, from the 367 WA rows; rivals list neighbours, and neighbour names are the terms most rivals use that we lack); "Rental demand: bonds lodged each quarter" (the bond counts already in the table, said as the supply-and-demand signal realestateinvestar labels); rename the appraisal H2 to "Get a rental appraisal or rent review for your {Suburb} property." (the rent reviews family, 220 impressions).
- **PAA to answer** (from the Floreat and other SERPs): "What is the 30% rent rule in Australia?" (AI 6,307, on 16 SERPs; section 6 copy uses the suburb's rent); "What is the cheapest suburb to rent in Perth?" (AI 90, from the WA rows, with the quarter); "Which suburb in Perth has the best rental yield?" (answer: WA bond data has no dwelling type, so no WA yield is published; link the WA best-rental-yield page only if it ranks on a published yield).
- **Schema**: Article `dateModified` from the newest rental row, headline without the suffix (`page.tsx:131-136`); add a `Dataset` for the quarterly table (name, `temporalCoverage`, `spatialCoverage`, `isBasedOn` the WA dataset, `license` CC BY 4.0, which the licence's attribution asks for anyway); Speakable points at the H1, so fix the H1 first.
- **Tool or table**: the nearby-suburbs table above; keep "no yield" for WA.
- **Internal links** (linkgraph: each rental-market page has one in-content inlink, from its own profile, anchor "open the full rental market view"): profile anchor to "{Suburb} median rent, fees and rental appraisal" (`src/app/(marketing)/suburbs/[slug]/page.tsx:356`); from the property management guide's WA section, "median rents in Perth suburbs" to three WA pages; from /suburbs/{slug}/agents, "Looking for a property manager in {Suburb}? Rents and fees" to `#property-manager-fees` (property management queries land on agents pages today).
- **Above the fold**: the header's only call to action is "Selling in Port Hedland? Free guide". Point it at the fee table (and at `#rental-appraisal` once 0.1 is settled).
- **Consolidate**: Nedlands 6909 is noindex and nedlands-dc 308s; nothing further.
- **Files**: `src/app/(marketing)/suburbs/[slug]/rental-market/page.tsx:42`, `:131-142`; `src/lib/rental-market.ts:80-90`, `:265-270`; `src/components/suburb/RentalMarketAllDwellings.tsx`; `src/components/suburb/RentalMarketLandlordSections.tsx:23-27`, `:115`; `src/lib/rental-landlord.ts:237`, `:312`.
- **Gate**: R3 allows one template change a fortnight; #83 changed this template on 1 Oct, so the next change ships no earlier than 15 Oct. Pages 1 and 2 are one change.

### Page 2. Rental-market template, NSW, QLD, SA and TAS (item 13 rollout)

Demand, 90 days: NSW 7,828 impressions, QLD 9,742, SA 5,444, TAS 528. Query families on these pages: "rent reviews picton / tahmoor / davidson / bankstown / wollongong" 220 at 36; "property management fees goodna" 63 at 42; "dapto rental market" 72 at 25; "brighton sa rental yield" 64 at 22; "rental yields in mount gambier, sa" 113 at 51 to 59 across two URLs; "rental appraisal scarborough 4020" 45 at 24; "rental report brisbane" 436 at 67 to 81 across four Brisbane URLs (two now 308).

| | Ours (Dapto) | Rival median | Best rival |
|---|---|---|---|
| Words | 1,216 | 868 | PRD Suburb Insights, 868 |
| H2s | 5 | 8 | 12 |
| Tables | 2 (18 rows) | 2 of 5 | 5 (Property Trends, Growth Chart per suburb) |
| Tool | form, 8 inputs | 2 of 5 | none |
| Schema | Article, FAQPage, Place | WebPage | none |
| FAQ | 3 | 0 of 5 | none |
| Author | organisation | 1 of 5 | none |
| Query in slug / title / H1 / intro | yes / yes / no / 0.67 | 0 / 0 / 0 / 1 of 5 | Dignam "Real Estate Agents in Dapto, NSW 2530" with a "Rental Market Trends" table |

Davidson: ours 1,161 words against a 732 median (listings and one 346-word agency "Rent Reviews" page). Goodna: 1,123 against 582 (a 36-name homely directory, a 582-word Gold Coast article).

- **Do the rollout** (tracker item 13: "rollout = remove the pilot list (one commit)"). The VIC pilot already gives the title from its sections, a labelled provenance line, the 12-month change, bedroom medians and their FAQs; NSW bedroom and history rows were loaded on 8 Sep for 3,251 suburbs. It also removes the legacy branch's faults (0.8).
- **Title**: the pilot's chain with state and postcode added (as page 1): "Dapto NSW 2530 Rental Market 2026: Median Rent". NSW and most VIC yields return when the sales label is repaired; then "... : Rent & Yield" follows from the same function.
- **H1**: "Dapto rental market".
- **First intro sentence**: "Dapto's median weekly rent was $700 for houses and $550 for units in April to June 2026 (NSW rental bond data, postcode 2530)."
- **H2s to add**: "Rent increases in New South Wales: how often, how much notice" (one per state, from one data file with the Act and an as-at date; it answers the rent reviews family and the PAA below); rename the appraisal H2 as on page 1.
- **PAA to answer**: "How much does a rent review cost?" (a rent review from a property manager is part of the free appraisal; say so without a figure we cannot source); "Can my landlord increase my rent by 14%?" (AI 15, on 6 SERPs; section 6); "Is rent going to increase in 2026?" (AI 34: answer with the suburb's own 12-month change and quarter, nothing forecast); "What are the typical real estate agent fees for renting a property in Queensland?" (the existing charges FAQ, reworded to the question); "Is Dapto a good investment?" (the existing "good rental investment" FAQ, question reworded).
- **Schema**: as page 1.
- **Internal links**: profile anchor (page 1); the best-rental-yield state pages link each listed suburb to its rental-market page with "{Suburb} median rent" (linkgraph shows none today).
- **Files**: `src/lib/data/rental-market-pilot.ts` (delete the list), `src/app/(marketing)/suburbs/[slug]/rental-market/page.tsx:42-55`, `:92-96`, `:171-313`; `src/lib/rental-market.ts:80-90`; `src/components/suburb/RentalMarketSections.tsx:41-43` ("now").
- **Gate**: the 19 Sep Bing 5xx read and the phone-width check by eye are still owed on item 13; R3 as page 1.

### Page 3. /guides/property-management-fees-australia

| | Ours | Rival median (top 5) | Best rival |
|---|---|---|---|
| Words | 4,924 live (4,471 parsed) | 1,521 | LocalAgentFinder 2,365; REIQ 2,086 |
| H2s | 18 | 5 | REIQ 8 |
| Tables | 1 (9 rows) | 2 of 5 | LocalAgentFinder 1 (9 rows); WhichRealEstateAgent Perth 1 (7 rows) |
| Tool | calculator, 10 inputs | 1 of 5 | WhichRealEstateAgent Perth, 15 inputs |
| Schema | Article, FAQPage, Person, Speakable | WebPage 4, FAQPage 1, Article 1 | WhichRealEstateAgent: FAQPage |
| FAQ | 9 (FAQPage) | 1 of 5 | WhichRealEstateAgent 6 |
| Author | "Your Property Guide editorial", reviewed by Andy McMaster | 1 of 5 | LocalAgentFinder: Chris McKern |
| Query in slug / title / H1 / intro | yes / yes / yes / 0.67 | 5 / 5 / 4 / 3 of 5 | |

Too early to read on Google (last crawl 13 Jul). Bing 27 clicks / 992 impressions at 4.5. The AI Overview cites dixonrealestate, LocalAgentFinder, WhichRealEstateAgent, REIQ, Reddit and McLaws.

- **Title and H1**: keep ("Property Management Fees 2026: Rates by State & Calculator", 58).
- **First intro sentence**: "Australian property managers charge an average 7.5% of the rent they collect (LocalAgentFinder, 13 March 2026), from 5.8% in New South Wales to 8.7% in Western Australia and Tasmania, plus a letting fee each time a tenant signs."
- **H2s to add** (REIQ, WhichRealEstateAgent and LocalAgentFinder all open with it; PAA AI 2,320 + 83): "What does a property manager do?"; "How to choose a property manager: questions to ask" (REIQ "5 tips to choose a great property manager", LocalAgentFinder "What makes a great property manager?"; our "Cheap isn't the same as good" section is half of it).
- **PAA to answer**, quoted: "What is a property manager?" (AI 2,320); "What does a property manager do in Australia?" (83); "What are red flags for tenants?" (399, 8 SERPs; answer from the landlord side here and the renter side in the renters' guides); "Do I still pay if my property is vacant?" (WhichRealEstateAgent FAQ; the body already says the fee is on rent collected); "Can ATO track rental income?" (AI 4; only with an ATO source and date).
- **Schema**: name the author as a Person with a role (LocalAgentFinder's ranking article does); optional `WebApplication` for the calculator, as the borrowing power page carries.
- **Tool or table**: fix 0.6; add "Look up your suburb's median rent" above the calculator (the suburb lookup the rental yield calculator already has), opening the suburb's rental-market page, so the calculator's weekly rent can come from a sourced figure.
- **CTA**: the end card is the selling guide (`src/components/guide/GuideArticleLayout.tsx:254-262`, default for non-buyer personas). Replace it with the suburb rent lookup until a property manager takes leads (0.1); then with the appraisal request.
- **Internal links** (177 in-content inlinks, 168 of them from rental-market pages with the anchor "the eight fee types and what is negotiable"): change that anchor to "property management fees by state" (`RentalMarketLandlordSections.tsx:115`); link from the rentvesting guide's "Landlord realities" ("Property management fees (typically 6–9% ...", unsourced: link it and use the sourced range) and from /guides/negative-gearing-australia.
- **State pages** (the tracker's next step for 3.7): hold. "property management fees nsw" and "qld" are 70 a month each, VIC 0, and the guide already has an H2 per state; revisit after Google recrawls.
- **Request indexing**: on the lead's list already.
- **Files**: `src/app/(marketing)/guides/property-management-fees-australia/page.tsx:109`; `src/lib/data/property-management-fees.ts:276`, `:289` and FAQ block (`:440-490`); `src/components/guide/GuideArticleLayout.tsx:254-262`.

### Page 4. /guides/renters-rights-nsw

| | Ours | Rival median | Best rival |
|---|---|---|---|
| Words | 1,760 live (1,443 parsed) | 658 | Go To Court 1,327; Flatmates 2,160 |
| H2s | 13 | 3 | Go To Court 11 |
| Tables | 1 (4 rows) | 0 of 5 | none |
| Tool | none | 0 of 5 | none |
| Schema | Article, FAQPage | Article 2, WebPage | Go To Court: Article, Person |
| FAQ | 6 | 0 of 5 | Go To Court 5 questions incl. "Can a landlord in NSW still evict me without giving a reason under the 2024 amendments?" |
| Author | organisation, reviewed by editor | 0 of 5 parsed | Go To Court: director and solicitor, legally reviewed, "Last reviewed 15 April 2026" |
| Query in slug / title / H1 / intro | yes / yes / yes / 1.0 | 2 / 2 / 2 / 1 of 5 | |

90 days: 200 impressions at 38.7; since the deploy 17 at 10.2 and one click. Last crawled 13 Jul.

- **Fix 0.2 first.**
- **Title**: "Renters' and Tenants' Rights in NSW (2026): The New Rules" (57). Three 880-a-month phrasings ("renters", "tenants", "tenant laws").
- **H1**: "Renters' and tenants' rights in NSW (2026)".
- **First intro sentence**: "Since 19 May 2025 a NSW landlord needs a reason to end a lease, and rent can rise only once in 12 months (NSW Government, updated 19 May 2025)."
- **H2s to add**: "What changed on 19 May 2025: reasons to end a lease, and pets"; "Notice periods for ending a lease" (from the Act, with the as-at date); "Paying rent by Centrepay" (NSW Government: "from 2 March 2026"); "Getting your bond back" (link the bond guide, section 5).
- **PAA to answer**: "Can tenants refuse open house in NSW?"; "What not to say to your landlord?" (AI 64); "What are red flags for tenants?" (AI 399; section 6).
- **Schema**: FAQPage answers rewritten (they are what the JSON-LD says); dateModified.
- **Internal links**: 11 inlinks today, 8 of them blurbs that repeat the error; correct them (0.2).
- **Files**: as 0.2.

### Page 5. /guides/renters-rights-vic

| | Ours | Rival median | Best rival |
|---|---|---|---|
| Words | 1,375 parsed | 646 | Tenants Victoria 828 to 9,895 |
| H2s | 13 | 3 | Tenants Victoria 10 |
| Tables / tool | 1 / none | 0 / none | none |
| Schema / FAQ | Article, FAQPage / 6 | WebPage, NewsArticle / 0 | none |
| Query in title | yes ("Renter's Rights in Victoria") | 0 of 5 | gov.au pages lead |

90 days: 94 impressions at 38.8; 4 at 7.8 since the deploy. The SERP is two government pages, Tenants Victoria, Armstrong Legal and the Premier's 6 Mar 2025 release.

- **Fix 0.3 first.**
- **Title**: "Tenant Rights in Victoria (2026): Renters' Rules Explained" (58). "victorian tenant rights" and "rights as a tenant victoria" are 5,400 a month each; "renters rights vic" is 20. Victoria's statute says "renter"; keep it in the body and the title's second half.
- **H1**: "Tenant and renter rights in Victoria (2026)".
- **First intro sentence**: section 6, question 4.
- **H2s to add**: "What changed in 2025" (each change with its start date from Consumer Affairs Victoria); "Routine inspections: once every six months".
- **PAA to answer**: "What are the recent changes to Victorian rental legislation?"; "What is the most important landlord responsibility?" (AI 6); "What not to say to your landlord?" (AI 64).
- **Files**: as 0.3.

### Page 6. /guides/rentvesting-australia (and the state-by-state post)

| | Ours | Rival median ("rentvesting" / "rentvesting australia") | Best rival |
|---|---|---|---|
| Words | 3,479 live (3,006 parsed) | 1,557 / 1,683 | propertyinvestmentprofessionals 3,496; Canstar 2,414 |
| H2s | 12 | 12 / 1 | PIP 14 |
| Tables | 0 | 0 of 5 / 2 of 5 | PIP 5 (37 rows) |
| Tool | none | 0 / 2 of 5 | Mortgage Express (105 inputs, a loan form) |
| Schema | Article, FAQPage | Article 3 | PIP: Article, FAQPage |
| FAQ | 8 | 0 of 5 / 1 of 5 | PIP 7 |
| Author | organisation, reviewed by editor | 3 of 5 / 1 of 5 | Canstar: Brooke Cooper, updated 8 Oct 2026 |
| Query in slug / title / H1 / intro | yes / yes / yes / 1.0 | 4 / 5 / 5 / 4 of 5 | |

90 days: 788 impressions at 77.9 ("rentvesting" 172 at 77, "rentvesting australia" 136 at 81, "what is rentvesting" 87 at 95); 88 at 72 since the deploy. Last crawled 16 Jul; the 7 Oct edit is unseen. Bank pages hold the head term (authority ceiling); the AI Overview cites CommBank, Frasers, InvestorKit, Stockspot, LJ Hooker and Reddit.

- **Fix 0.5 first.** Then lead with it: the 1 July 2027 change decides whether a rentvester buys new or established, and it is the one thing a 2024 bank explainer cannot say.
- **Title**: "Rentvesting in Australia 2026: What It Is and the Tax Change" (60).
- **H1**: "What is rentvesting? A practical Australian guide (2026)".
- **First intro sentence**: section 6, question 6.
- **H2s to add**: "Rentvesting vs buying your own home" as a table (PIP "Quick Comparison"; Canstar and LJ Hooker run "Pros and cons"); "What the 1 July 2027 tax changes mean for rentvesters" (new build vs established vs held before the cut-off, from `src/lib/negative-gearing-calc.ts`, with a link to /negative-gearing-calculator); "Where rentvesters buy" built only from gated published figures (the best-rental-yield state pages), never the post's unsourced medians.
- **PAA to answer**: "Is rentvesting a good idea?" and "Is rentvesting possible in Australia?" are in the body: make them FAQs with the reform in the answer.
- **CTA**: rentvesters are buyers; use `BUYING_GUIDE_CTA` (buyer leads have buyers), not the selling guide.
- **Internal links**: 7 inlinks today; add from /first-home-buyers ("rentvesting instead of a first home"), /negative-gearing-calculator and the property management guide.
- **Consolidate**: see section 4.
- **Files**: `src/app/(marketing)/guides/rentvesting-australia/page.tsx:27`, `:58`, `:303`, `:390`; `src/lib/data/blog-posts/rentvesting-australia-state-by-state-guide-2026.ts`.

### Page 7. /guides/renters-rights-sa

Bing 19 clicks / 781 impressions at 6.9 in 90 days; Google 50 at 37.3; last crawled 13 Jul. No live SERP pulled for SA. Verify and correct 0.4 before anything else; then title "Renters' Rights in South Australia (2026): Current Rules" (56) and an H2 "What changed on 1 July 2024" if CBS confirms the date. Files: `src/app/(marketing)/guides/renters-rights-sa/page.tsx:49`, `:100`, `:141`, `:215`.

### Page 8. /guides/renters-rights-qld

Ours 1,223 words, 12 H2s, FAQ 6, against a 577-word median (RTA 408 words; Tenants Queensland; QSTARS 2,809; the Queensland Law Handbook 1,665). 90 days: 93 impressions at 40.8, "tenants rights queensland australia" 21 at 54. Verify the "without grounds" history (0.4). Title "Tenant Rights in Queensland (2026): Renters' Rules Explained" (60). PAA to answer: "Do tenants have to clean gutters in QLD?" (AI 9); "Do landlords have to clean black mould?" (6); "What is the highest a landlord can raise rent?" (18, 3 SERPs). Files: `src/app/(marketing)/guides/renters-rights-qld/page.tsx:71`, `:103`, `:238`.

### Page 9. ACT: /guides/renters-rights-act and /suburbs/canberra-act-2600/rental-market

Landlord demand with no right page: "rental estimate canberra" 77 at 54 and "appraisal for rent canberra" 54 at 59 to 63 land on Canberra rental-market pages that answer noindex (no ACT rental feed); "rental appraisal act" 57 at 47 and "tenant screening canberra" 41 at 61 land on the renters' guide. The renters' guide itself does well (422 impressions, 6 clicks, 23.8). The ACT SERP for "rental estimate canberra" has act.gov.au, a 427-word agency article and McIntyre's PM page.

- Check whether the ACT Government publishes bond-lodgement medians by suburb (its open data portal is the place to look). If it does, an ACT feed on the rental-wa pattern lifts the noindex on the Canberra pages, as #96 did for WA.
- Until then: from the ACT renters' guide, a short "Renting out in the ACT?" line linking the property management guide's ACT section ("property management fees in the ACT"); no form (0.1).
- Files: `src/app/(marketing)/guides/renters-rights-act/page.tsx`; a new `scripts/sync/sources/rental-act.ts` only if a source exists.

---

## 4. Cannibalisation

| Query family | Pages Google shows | Owner | Action |
|---|---|---|---|
| "{suburb} property management", "property managers {suburb}", "rental agents {suburb}", "rental appraisal {suburb}" | /suburbs/{slug}/rental-market; /suburbs/{slug}/agents (Bermagui 12 at 45, Harrisdale 8 at 37, The Ponds 6 at 43, Greenwith 4 at 16, Tewantin 3 at 32, Petrie 3 at 41); South Hedland split 5 to 4 between the two | rental-market | Agents pages keep sales; add the property manager link (page 1). The crude matcher's "wrong page" verdicts for Newman, Highgate (expecting the national guide) and "rental appraisal dampier" (expecting the sale /appraisal page) are wrong: a suburb landlord query belongs on the suburb's rental-market page. On that reading the truly wrong landings are the agents pages (Bermagui 12, Harrisdale 8, The Ponds 6, Greenwith 4, Tewantin 3): 33 of the 100 property management impressions since the deploy, not 43. |
| "property management fees {state or national}" | the guide only (38 impressions; not recrawled) | guide | Hold the state pages (page 3). |
| "property management fees {suburb}" | rental-market (Goodna 63) | rental-market | Its H2 already answers; keep the guide link. |
| "rentvesting", "rentvesting strategy", "rentvestment" | /guides/rentvesting-australia (788); /guides/rentvesting-australia-state-by-state-guide-2026 (6 at 7.7); the matcher wanted the post for "rentvesting strategy" | rentvesting-australia | Fold the post's state section into the guide with sourced figures, then canonical the post to the guide. A 301 changes a URL, which the tracker's rule forbids; Jos's call. |
| "nedlands rental investment" | nedlands-wa-6909 (74, 90d), nedlands-dc-wa-6009 (23), nedlands-wa-6009 (17); since the deploy only 6009 | nedlands-wa-6009 | Done by the noindex (6909) and the 308 (dc); fix the request-indexing list (0.9). |
| "brighton sa rental yield" | Brighton SA (64 at 22) and Brighton TAS (21 at 50) | Brighton SA | State and postcode in the rental-market title (page 1). Same risk for Newport and Scarborough. |
| "rental report brisbane" | brisbane-city-qld-4000 (202, now noindex), brisbane-market-qld-4106 (117, now 308), brisbane-qld-4000 (92), brisbane-city-dc (25, now 308) | /property-market/brisbane, once its rent is sourced | City query: give the city page a sourced rent section (0.7) rather than a suburb page. |
| "rental appraisal act", "rental estimate canberra" | renters-rights-act; noindex Canberra rental-market pages | none indexable yet | Page 9. |
| "rentvesting" vs first home buyer pages | no overlap in the data | n/a | n/a |

---

## 5. New pages or tools worth building

| Build | Demand (Keyword Planner / AI) | SERP format needed | Winnability | Verdict |
|---|---|---|---|---|
| **"How to get your rental bond back" by state** (renters' series) | "rental bond" 4,400; "bond refund" 2,900; "rental bond victoria" 720; "how to get bond back" 170, AI 244; PAA "Is a bond transferable?" (AI 123), "How can I get a bond refund?" (71), "How long can a landlord hold your bond?" (49), "How do I check my bond status online?" (24) | One national guide: a state table (bond authority, maximum bond, lodgement deadline, how a refund is claimed, days to dispute, tribunal), each row with the Act and an as-at date; steps; FAQ. Navigational terms ("rental bonds online" 14,800, "rta bond refund" 6,600) go to the authorities; do not chase them. | Good: REIQ 810 words, Consumer Affairs Victoria 188, RentBetter help articles 1,121 to 1,383 rank; the AI Overview cites tenanttools, bondbackquotes and rental360 | **Build** after the law check (0.2 to 0.4), from the same data file. No lead capture: there is no product for renters. Title "How to Get Your Bond Back in Every State (2026)" (47). |
| **Rent increase rules by state** | "rent increase notice" 720 (and two 720 variants); PAA "Can my landlord increase my rent by 14%?" (6 SERPs), "What is the highest a landlord can raise rent?" (3) | State table: how often, notice, any cap, how to challenge; Act and as-at date per row | Medium | **Build as a data file first**: it feeds the rental-market "rent reviews" H2 (page 2), the renters' guides and, if the table earns it, its own page. |
| **ACT rental feed** | ~190 landlord impressions in 90 days with no indexable page | Data feed, not a page | Depends on a public source | **Check the source**, then build on the rental-wa pattern (page 9). |
| **/rental-appraisal hub** | "rental appraisal" 1,900 ($25.56); "free rental appraisal" 170 ($28.29); "rent appraisal" 1,900 | Request form above the fold, suburb picker that opens the suburb's rental-market page, a short explainer; PAA "What is a rent appraisal?", "How to get a rental valuation?", "How do I calculate the rental yield for my property in Australia?" | Medium: agency pages of 295 to 1,275 words, but Google localises | **Only after 0.1** (a contracted property manager per state). Then title "Free Rental Appraisal: What Your Property Should Rent For" (57), with the #57 disclosure. |
| Property manager directory ("property manager near me") | 1,300 ($14.14), AI 0; no AI Overview | Named managers with listings and leases per suburb (REIWA, homely, LocalAgentFinder city pages) | Low: directories with licence data and reviews; local pack | **Do not build.** No property manager network to list. |
| Landlord insurance | 14,800 ($43.34), AI 1,305; brand variants 1,300 to 6,600 | Insurer product pages and Canstar's 8,267-word comparison with ratings | Low: insurers and Canstar; comparing insurance products is financial product advice | **Do not build.** At most one FAQ in the property management guide that insurance premiums are deductible, with an ATO source. |
| City rent sections | "rental report brisbane" 436 impressions (90d) at 67 to 81; Keyword Planner 0 for the exact term | A sourced median rent and quarter on /property-market/{city} | Medium | **Fix, don't build** (0.7). |

---

## 6. AI search: unanswered questions and answer-first copy

Each answer is under 60 words, carries one sourced and dated figure, and goes into the page's FAQ (FAQPage JSON-LD) as well as the body.

| Question (AI volume) | Page | Proposed answer | Source |
|---|---|---|---|
| 1. "What is the 30% rent rule in Australia?" (6,307; on 16 SERPs) | Every rental-market page, from the suburb's own rent (Port Hedland shown) | "The 30% rule treats rent above 30% of a household's gross income as rental stress, the benchmark Australian housing researchers apply to lower-income households. At Port Hedland's median rent of $988 a week across all dwellings (WA rental bond data, July to September 2026), staying under 30% takes a gross household income of about $3,290 a week." | WA Rental Bonds Data, Government of WA, CC BY 4.0, July to September 2026; name AHURI's 30/40 indicator in the page's sources. NSW pages use the postcode house median and its quarter; pages with no published rent omit the question. |
| 2. "What is a property manager?" (2,320) and "What does a property manager do in Australia?" (83) | Property management guide | "A property manager is an agent licensed or registered under state law who runs a rental for its owner: advertising and screening tenants, collecting rent, arranging repairs, routine inspections, the bond and any tribunal hearing. Australian agencies charge an average 7.5% of the rent collected for the service (LocalAgentFinder, 13 March 2026)." | LocalAgentFinder, Property Management Fees Australia: 2026 Guide, 13 March 2026 (already footnote 1) |
| 3. "What are red flags for tenants?" (399; 8 SERPs) | NSW renters' guide (renter side); property management guide (landlord side) | "Red flags for a renter: a bond above the legal cap or not lodged with the state bond authority, rent taken in cash without receipts, no condition report, and entry without notice. In NSW the bond cannot exceed four weeks' rent (Residential Tenancies Act 2010 (NSW), as at 10 October 2026)." | Residential Tenancies Act 2010 (NSW); confirm against NSW Fair Trading when the guide is rewritten |
| 4. "What are the recent changes to Victorian rental legislation?" (PAA on "renters rights vic") | VIC renters' guide, opening paragraph | "Victoria passed new renting laws in March 2025 that ban no-fault evictions, stop all forms of rental bidding and lift the notice for a rent increase or a notice to vacate from 60 to 90 days (Premier of Victoria, 6 March 2025). Consumer Affairs Victoria lists the date each change starts." | Premier of Victoria media release, 6 March 2025 (on the SERP); start dates from Consumer Affairs Victoria |
| 5. "Can my landlord increase my rent by 14%?" (15; 6 SERPs) and "What is the highest a landlord can raise rent?" (18) | NSW renters' guide; NSW rental-market pages ("rent reviews") | "In NSW there is no cap on the size of a rent increase, but rent can rise only once in 12 months, with 60 days' written notice, and a renter can ask NCAT to review an excessive increase. The once-a-year limit has applied since 31 October 2024 (NSW Government, updated 19 May 2025)." | nsw.gov.au, Moving out of a rental home, last updated 19 May 2025 (on the SERP); one sentence per state from the rent-increase data file (section 5) |
| 6. "What is rentvesting?" (Keyword Planner 480; "rentvesting" AI 62) | Rentvesting guide, first paragraph | "Rentvesting is renting the home you live in while owning an investment property somewhere more affordable. The tax maths changed in 2026: from 1 July 2027, losses on an established home bought after 7:30pm AEST on 12 May 2026 no longer reduce tax on other income such as salary (ATO, updated 29 June 2026). New builds keep negative gearing." | ATO, Tax reform: reforming negative gearing and capital gains tax, last updated 29 June 2026 (`src/lib/negative-gearing-calc.ts:22-27`) |
| 7. "How can I get a bond refund?" (71); "how to get bond back" (244) | New bond guide | "Agree the amount with your landlord or agent, then claim the refund from your state's bond authority, online in most states. If one side claims without the other's agreement, the other is notified and has 14 days to dispute it before the bond is paid out (NSW Rental Bonds Online; Queensland RTA, as at 10 October 2026)." | The 14-day rule is in the pack from REIQ (undated) and RentBetter (13 Feb 2026); confirm with NSW Fair Trading and the RTA, primary, before publishing |
| 8. "What is the average property management fee in Australia?" (185) and "What percentage do most property management companies charge?" (57) | Property management guide | Already answered in the FAQ with LocalAgentFinder's dated figure. Keep; Google has not crawled it yet. | n/a |

Not answered on purpose: "How much should landlord insurance cost per year?" (102) and "Who is best for landlord insurance?" (145): no primary source for premiums, and "best" would need stated criteria we cannot apply to insurance products. "Do I need qualifications to be a property manager?" (227) is a job-seeker query. "Is 4.5% rental yield good?" (181) belongs to the rental yield calculator (finance pack), which answers it since #85.

---

## 7. Status of the 30 Sep review's items in this vertical

| Item | Status | Reading |
|---|---|---|
| 3.1 (a) rental appraisal request on every rental-market page | Shipped 1 Oct (#83) | Too early to read: 134 of 170 inspected rental-market pages were last crawled in July, 4 since 1 Oct. Fulfilment unconfirmed (0.1). |
| 3.1 (b) "What property managers charge in {suburb}" | Shipped (#83) | Live on every branch; two contradicting cells (0.6); anchor to the guide is generic (page 3). |
| 3.1 (c) WA rental feed | Shipped 2 Oct (#96): 3,934 rows, 367 pages indexable | Too early to read (WA pages last crawled 3 Jul; rental investment 9.6 to 7.4 impressions a day). Follow-ups still open: schedule the feed (next release lands early January; run mid-January) and `clear-rent-proxies --state WA` (Perth city page still prints $350, 0.7). Karratha stays noindex (one repeated rent) and loses "rental appraisal karratha" (38 impressions). |
| 3.1 (d) "Is {suburb} a good rental investment?" FAQ | Shipped (#83) | Live, withheld where nothing is published; WA states why there is no yield. |
| 3.7 / priority 5: property management guide, state table and calculator | Shipped 1 Oct (#84) | Too early on Google (crawled 13 Jul). Bing now 27 clicks / 992 impressions at 4.5 (90 days), against 11 / 444 at 4.7 in the 28 days to 25 Sep. |
| 3.7: property management state pages | Open | Hold (page 3). |
| Section 4: "landlord insurance" | Open | Do not build (section 5). |
| Section 4: "how to get your bond back" guide | Open | Build after the law check (section 5). |
| Section 6: "What is the 30% rent rule in Australia?" | Open | Answer on every rental-market page from its own rent (section 6). |
| 3.1 note: ACT pages noindex | Open | Needs an ACT rent source (page 9). |
| Tracker item 13: rental-market rebuild rollout | Open since 8 Sep (50 VIC pilot pages) | Do it in the next template slot after 15 Oct (page 2). |
| Renters' guides and rentvesting | Not in the 30 Sep review | New findings 0.2 to 0.5. |
