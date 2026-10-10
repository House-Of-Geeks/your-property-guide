# New homes, house and land, building and renovation: findings (10 Oct 2026)

> Part of the [commercial-intent and competitor gap review of 10 October 2026](../commercial-intent-review-2026-10-10.md). Written by a read-only analyst from the evidence pack `data/packs/new-homes-renovation-*` in the run folder `~/Desktop/Ads/ypg-commercial-intent-review-2026-10-10/` (SERP digest, compare rows, GSC queries, intent-match misses, unanswered PAA) and the source at origin/main 9ef5ee7. File and line references are to that commit. Points marked "verify" are the analyst's own knowledge, not a source fetched in this run: check them with the regulator before changing copy. No site code was changed.

Pack `new-homes-renovation`. Pages in scope: `/guides/renovation-cost-australia-2026`, `/renovating`, `/house-and-land`, `/guides/how-to-find-a-builder-australia`, the five granny flat guides (NSW, QLD, SA, VIC, WA), `/guides/house-and-land-packages-are-they-worth-it`. Evidence: the pack files, `../` data, live pages fetched with curl on 10 Oct, source at origin/main 9ef5ee7 (`repo-main/src`).

**Scale, said plainly.** This is the smallest vertical. Across these pages Google shows 2,241 impressions and 2 clicks in 90 days (renovation guide 732, `/renovating` 1,230, granny flat guides 273, house-and-land guide 6). Bing gives 15 clicks (granny flat WA 7, SA 4, renovation guide 3, VIC 1). Commercial impressions fell from 8.3 to 5.7 a day after the deploy. No builder or developer partner pays for a lead today, so nothing here produces revenue directly: renovators reach the selling-guide funnel through the `MatchCTA` boxes. The work worth doing is cheap: fix the legal and cost claims, stop the hub competing with the guide, request indexing, and move the existing calculator onto its own URL. House and land, display homes and city pages do not justify work until stock or a partner exists.

## Top 5

1. **Correct the planning and building law** in the granny flat guides and the builder guide (section 0, F1 to F6). The VIC guide predates Amendment VC253. The NSW guide names the wrong instrument. The QLD, WA and SA approval and owner-occupier claims name no instrument and conflict with what rivals and Bing searchers use. The builder guide still names the VBA and gives the wrong warranty thresholds. These are the vertical's only Bing click earners, on "rules" queries.
2. **Stop `/renovating` taking cost queries.** It took 81% of renovation commercial impressions since the deploy at about position 80, and its figures are unsourced and contradict the guide's (kitchen $15,000 to $25,000 on the hub against $12,000 to $18,000 in the guide). It also carries two FAQPage questions word for word the same as the guide's, with different answers. Retitle it, take the cost content out and link the guide (section 3.2).
3. **Request indexing for the renovation guide.** Google last crawled it on 26 Jul, so it has not seen the 1 Oct rewrite (#89). The old version already ranks 11th live for "renovation cost australia" (AI volume 1,007) and is cited in two AI Overviews.
4. **Give the existing estimator its own page, `/renovation-cost-calculator`.** It targets KP 480 at a $5.25 CPC. In 90 days, 141 impressions on calculator and estimator queries landed on the hub at about 85. Small calculator pages hold positions 6 to 10 on that SERP.
5. **House and land: keep the noindex** and fix the leftovers. `/data` still prints "0" packages "from participating builders". Every suburb page's footer and the home hero still link to the empty page. City pages wait for a paying builder and stock (section 5).

---

## 0. Fix first: accuracy and compliance on live pages

Each sentence quoted below was checked in the live HTML on 10 Oct. Where I cite a planning instrument from outside the evidence folder, the line says "verify". The lead should check the clause on the legislation or planning site before publishing.

| # | Page | Live sentence (quoted) | Why it is wrong | Source | Fix |
|---|---|---|---|---|---|
| F1 | /guides/granny-flat-guide-vic | "Victoria has no state-wide complying-development pathway for secondary dwellings, you typically need a council planning permit" | Out of date. Victoria Planning Provisions Amendment VC253 (14 Dec 2023) introduced the "small second dwelling": up to 60 m², no planning permit in most residential zones unless an overlay triggers one, building permit still required. VC253 also replaced the "dependent person's unit" category, yet the guide still has an FAQ explaining that category. The page was "updated" 15 Apr 2026. Verify the zone list and overlay triggers on planning.vic.gov.au. | `src/app/(marketing)/guides/granny-flat-guide-vic/page.tsx:49`, `:72`, `:80-83`, `:128-130`, `:136-137`, `:142-149`, `:254-256` | Rewrite the approvals sections around VC253, naming the amendment and its clauses. Keep the permit path for dwellings over 60 m² and for overlay cases. Delete the dependent person's unit FAQ. Drop the "VIC vs NSW" callout and the "2–8 months" key figure. Re-date `updatedAt`. |
| F2 | /guides/granny-flat-guide-nsw | "complying development under the Low Rise Housing Diversity Code (formerly SEPP 2009)" | Wrong instrument. The Low Rise Housing Diversity Code (Part 3B of the Codes SEPP) covers dual occupancies, manor houses and terraces. Secondary dwellings sit in the State Environmental Planning Policy (Housing) 2021, Chapter 3 Part 1, with complying development standards in its Schedule 1. That SEPP replaced the Affordable Rental Housing SEPP 2009 from 26 Nov 2021 (verify clause numbers on legislation.nsw.gov.au). Rival zonescout.au already cites "the 60m² cap under the Housing SEPP". Since VC253, "NSW is unique in having a state-wide complying development pathway" is also false. | `granny-flat-guide-nsw/page.tsx:49`, `:80`, `:129-133`, `:145-149`, `:156-160` | Name the Housing SEPP and its Schedule 1. Delete "most streamlined" and "unique". |
| F2b | same | "gross yields of 12 to 15% on construction cost, well above standalone investment property yields"; "can add 20 to 30% more value than the construction cost" | Unsourced return and value-uplift claims (YMYL, a promise in effect). | `:52`, `:95`, `:100`, `:333-341` | Remove the uplift claim. Show rent as a dated, sourced figure (NSW Fair Trading rental bond data) and leave yield to the reader's own figures in the rental yield calculator. |
| F3 | /guides/granny-flat-guide-qld | "Most projects require a Development Application through the local council, often as code assessable development" | Contested, and no instrument named. Rival outhaus.com.au (6th for "granny flat cost qld"): "Most compliant granny flats in Queensland need building approval from a private certifier, not a council DA." Under the Planning Regulation 2017 a secondary dwelling is part of a "dwelling house", which Brisbane City Plan 2014 makes accepted development, subject to requirements, in its low density zones (verify the zone tables before rewriting). | `granny-flat-guide-qld/page.tsx:49`, `:76`, `:138-141`, `:179-187` | Rewrite the approvals section naming the Planning Act 2016, the Planning Regulation 2017 and the Brisbane City Plan 2014 table. Give the DA route only for proposals that miss the acceptable outcomes. |
| F3b | same | "vacancy rates ... below 1% for years"; "that's a compelling return" | Vacancy figure has no source or date. "Compelling return" is investment advice. | `:51`, `:91`, `:224`, `:243-247` | Cite SQM Research or REIQ with the month, or drop the figure. Delete "compelling return". |
| F4 | /guides/granny-flat-guide-wa | "Owner-occupier rule applies in most WA councils: one of the two dwellings must be owner-occupied. Pure investment dual-occupancy is generally not allowed." | No instrument named. The governing instrument is State Planning Policy 7.3, Residential Design Codes Volume 1 (ancillary dwelling standards). Check whether any owner-occupation condition survives there or in local planning policies before keeping the claim; as far as I know the deemed-to-comply standards do not require it (verify). This is the vertical's best Bing page: 7 clicks at 5.6, including "granny flats wa rules". | `granny-flat-guide-wa/page.tsx:52`, `:71-74`, `:188-200` | Name SPP 7.3 and the clause. Keep the owner-occupier line only if a clause supports it. Delete "well above standalone investment property returns" (`:98`). |
| F5 | /guides/granny-flat-guide-sa | "Most residential zones treat compliant secondary dwellings as 'complying development', no DA" and "Owner-occupier rule: one of the two dwellings must be owner-occupied" | "Complying development" is NSW language. The Planning, Development and Infrastructure Act 2016 uses accepted, deemed-to-satisfy and performance assessed, and the Planning and Design Code calls the use "ancillary accommodation". Bing searchers already use the right term ("south australia dts criteria granny flat"). The owner-occupier rule cites no clause (verify against the Code's ancillary accommodation policy). | `granny-flat-guide-sa/page.tsx:18`, `:49`, `:52`, `:74`, `:82-84`, `:155-184`, `:229-240` | Use the Act's terms and name the Code policy. Keep the owner-occupier rule only with a clause. |
| F6 | /guides/how-to-find-a-builder-australia | "VIC: Victorian Building Authority (VBA) licence search" and home warranty "required for residential building work above a state-defined threshold (typically $20,000–$30,000+)" | The VBA became the Building and Plumbing Commission on 1 Jul 2025. Warranty thresholds are lower and vary by state: QLD $3,300 (QBCC Act 1991), SA $12,000, VIC $16,000, NSW and WA $20,000, and Tasmania has no scheme (verify each with the regulator). "Statutory warranty in QLD" is the Queensland Home Warranty Scheme. | `how-to-find-a-builder-australia/page.tsx:53`, `:77`, `:82` | Add a state table: register, regulator, warranty scheme, threshold, Act, as-at date. Then request indexing (the page is crawled, not indexed). |
| F7 | /renovating | "Materials are up 15-25% on pre-COVID baselines and trade labour rates are up 20-40%"; "a budget kitchen renovation ... lands around $15,000-$25,000; mid-range $25,000-$50,000; high-end ... $50,000-$120,000"; "A full house renovation is usually $3,000-$5,000 per square metre"; "Cosmetic refreshes ... return 200-400% on dollars spent"; "Add a 'cost of moving' premium of $30,000-$80,000" | All unsourced and undated. They contradict the guide's sourced tables: kitchen $12,000 to $18,000 / $25,000 to $45,000 / $60,000+; bathroom $15,000 to $22,000 / $25,000 to $40,000+ against the hub's $15,000 to $35,000 / $35,000 to $80,000; full house $2,800 to $4,500 per m²; cosmetic return "3× to 10×". Two hub FAQPage questions match the guide's exactly ("How much does a kitchen renovation cost in Australia?", "Do I need council approval to renovate?") but give different answers. The approval answer names no instrument. | `src/lib/persona-hub-content.ts:342`, `:343`, `:346`, `:362`, `:367`, `:377`, `:382`, `:387` | Remove the cost and ROI copy from the hub (section 3.2). Any figure the hub keeps should read from `src/lib/data/renovation-costs.ts` so it cannot drift. |
| F8 | /guides/renovation-cost-australia-2026 | "Cosmetic refresh (paint, flooring, tapware, garden, deep clean): 3× to 10× cost recovered at sale" (and the five ratios under it) | The page has a source for every cost cell but not for its ROI ratios. They contradict the hub (200 to 400%; kitchens 60 to 90% against 0.6× to 1.2× here). | `renovation-cost-australia-2026/page.tsx:487-500`; FAQ `src/lib/data/renovation-costs.ts:616` | Cut the ratios to a qualitative list (lifts the buyer pool, over-capitalises for the suburb) or cite a dated study. Link `/guides/what-to-fix-before-selling-a-house`. |
| F8b | same | "Read our fixed vs variable guide (the same principle applies to contract types)"; FAQ "Get our fixed-vs-variable contracts guide for the full comparison" | No contracts guide exists. Both point to a home-loan rate guide. | `page.tsx:465-466`; `renovation-costs.ts:611`; also `how-to-find-a-builder-australia/page.tsx:118` | Link `/guides/how-to-find-a-builder-australia#contract` with the anchor "what to check in a building contract". |
| F8c | same | "Granny flat: $130,000–$220,000" and "Granny flats often have the best ROI of any renovation" | Unsourced, and inconsistent with the five state guides ($80,000 to $350,000+ across them). "Best ROI" is a claim with no criteria. | `page.tsx:384-392` | Replace with one line and links to all five state guides. |
| F8d | same | Sources: "State-by-state planning portals (Service NSW Planning, VBA Victoria, QBCC Queensland, etc.)"; FAQ "Do I need council approval to renovate?" names no instrument | VBA is now the BPC. QBCC is a building regulator, not a planning portal. The NSW portal is the NSW Planning Portal. | `page.tsx:530`; `renovation-costs.ts:589-592` | Name NSW: State Environmental Planning Policy (Exempt and Complying Development Codes) 2008. VIC: Building Act 1993 (building permit) and the planning scheme under the Planning and Environment Act 1987. QLD: Planning Act 2016 and Building Act 1975. Fix the portal names. |
| F8e | same | Mid-range full renovation "Total $200,000–$400,000" against "$200K–$500K" in the TL;DR, FAQ and room answer; "labour rates up 25–40%" | Internal inconsistency; the labour figure has no source. | `page.tsx:78`, `:206`, `:340`; `renovation-costs.ts:538`, `:566` | Use one range from `SCOPE_PER_M2`. Source or cut the labour figure. |
| F8f | same | "The ranges marked 'this guide' are 2026 metro-Australia ranges from builder quotes on real jobs" | Not a verifiable published source, yet it anchors 10 table cells (kitchen ×3, bathroom ×2, extension, second storey, knock-down rebuild) and the first TL;DR figures. | `page.tsx:122-135`; `renovation-costs.ts:45-52` | State the basis (number of quotes, cities, dates) on `/methodology` and link the "this guide" label to it. Or open each room with the Archicentre or CKA range and keep "this guide" as the cross-check. |
| F9 | /data | "0 · House & land packages · New build packages from participating builders. · Builder partners" | Prints a zero as a figure and implies builder partners. Flagged on 1 Oct (#94) and still live. | `src/app/(marketing)/data/page.tsx:148` | Hide the row while `hasHouseAndLandStock` is false. |
| F9b | /about | "100% of our revenue comes from introduction fees paid by partner agents, brokers, conveyancers, accountants and builders" | Check that a builder partner exists. If none pays today, the sentence overstates. | `src/app/(marketing)/about/page.tsx:229-232` | Drop "builders" until one pays. |
| F10 | /house-and-land (latent: shows only once stock exists) | "New build packages from top Australian builders, with land titled, fixed prices, and stamp-duty savings on the building component"; meta "New homes from top builders at competitive prices" | "Top" has no criteria, and the duty saving depends on the state and the contract. This goes live the hour a package is added. | `house-and-land/page.tsx:50`, `:105` | Rewrite before any stock goes in. |

---

## 1. Where we match commercial intent (keep doing)

- **The renovation guide is the page Google already prefers for cost queries, and it is being cited.** It ranks 11th live for "renovation cost australia" (KP 20, AI 1,007) and is cited in the AI Overview for that query and for "how much do renovations cost australia". That is two of the site's six AI Overview citations across 254 SERPs. On page-level data it had 629 impressions at about 51 in the 83 days before the deploy, and 103 at 18.5 in the 7 days since (7.6 a day rising to 14.7). For "renovation costs" (KP 210, CPC $7.28) it holds 45 impressions at 17.5 since the deploy, against 19 at 89 for the hub. Google's last crawl was 26 Jul, so all of this is the old 2,877-word version. The rewrite is unseen: too early to read.
- **The rewrite's shape already beats every rival on the SERP.** It has 6,869 words against a rival median of 888 to 2,137, 8 tables (66 rows) where at most 2 of 5 rivals have one, a 10-input calculator where 1 or 2 of 5 have a tool, 11 FAQPage questions where no rival has FAQ schema, and a named, dated source in every cell. The best rival, co-architecture (1st for "how much do renovations cost australia", AI Overview-cited), has 3,618 words, 9 tables and a 3-input calculator with no named sources. **Do not add words.** The gaps are crawl, links and the hub.
- **The QLD granny flat guide is the right page for its queries.** "Investment secondary dwellings qld" (62 impressions at 63), "granny flat investment qld" (21), "granny flat investment property queensland" (17) and "second dwelling investment property queensland" (8) all land on it. The crude matcher's "wrong page" call in `new-homes-renovation-intent-match.tsv` is wrong.
- **Bing ranks the granny flat rules guides in the top 10:** WA 113 impressions at 5.6 with 7 clicks, SA 17 at 5.6 with 4, VIC 5 at 5.2 with 1. The queries are "granny flats wa rules", "granny flat rules in south australia", "building a granny flat in sa". People come for the rules, which is why F1 to F5 come first.
- **The `/house-and-land` noindex (#94) is live and right.** The page answers `noindex, follow` and the house-and-land sitemap is empty. Keep it until there is stock.

## 2. Where we miss, by query type

GSC impressions are for 90 days unless marked. "Hub" is `/renovating`.

| Query type | Our impressions (90 days) | KP / AI | What the top 5 reward | Where we land and the gap |
|---|---|---|---|---|
| **Cost** ("renovation costs", "home renovation cost", "how much does a renovation cost", "cost of renovating a house") | Hub: 96 queries, 474 at 83.6. Guide: 33 queries, 506 at 59.0 (since deploy, "renovation costs" 45 at 17.5 on the guide) | renovation costs 210 ($7.28); renovation cost australia 20 / 1,007 | Builder and renovator blogs (provider 4 of 5), Reddit, realestate.com.au. Cost by room, sometimes a table (2 of 5), year in title (1 to 3 of 5), named author (3 to 4 of 5). | The guide outclasses them. The miss is routing: the hub's title starts "Renovating a House in Australia 2026: Costs" and it carries 1,231 sitewide inlinks (header and footer) against the guide's 8 in-content links. |
| **Full house** ("full house renovation", "whole house renovation cost", "complete house renovation cost") | Hub: 27 queries, 253 at 80.4 ("full house renovation" 186 at 80). Guide: 2 | full house renovation 210 (CPC $17.42, peak 1,000); full house renovation cost 110 ($6.06) / 22 | City cost pages (co-architecture Brisbane, martinahayes Sydney), Three Birds, Canstar, Reddit. None has the query in slug, title or H1 (0 of 5). | The guide's H2 says "Full house renovation" without "cost", and its intro has no full-house figure. Rename the H2 and fix the hub. |
| **Calculator / estimator** ("renovation calculator australia" 53, "renovation estimator australia" 52, "renovation cost calculator australia" 25) | Hub: 9 queries, 141 at 84.7. Guide: 0 | renovation cost calculator 480 ($5.25; 210 to 880 over 12 months) / 4 | Estimating firm, Canstar, Reddit, Homes to Love. Positions 6 to 10 are calculators on small sites: suburbsfinder (SoftwareApplication + FAQPage), comparethebuilder, whatsthedamage (WebApplication, 18 inputs), renovationcalculator.au. | The calculator sits 2 H2s into a 17-minute guide whose slug has no "calculator". Give it its own page (section 5.1). |
| **Budget** ("30000 renovation budget" 66, "$30 000 home renovation" 24, "30k renovation budget" 14) | Hub: 8 queries, 118 at 72.9. Guide: 9 at 33 | 30000 renovation budget 10 / 0 | Finance blogs and forums (Latitude, Swoosh, Maplewood). No tables, 0 of 5 with a tool. PAA "Can I remodel my kitchen for $30,000?" has AI 410. | Neither page answers "what $30,000 buys". Add an H2 and FAQ to the guide (3.1). |
| **Location / per m²** ("renovation cost per m2 melbourne", "house renovation costs brisbane") | Hub 38 at 90; guide 16 at 64 | small | City pages from builders (co-architecture runs one per capital). | The guide's state table covers it. **No city pages**: 54 impressions in 90 days does not justify eight pages. |
| **Granny flat rules and cost by state** ("granny flat cost nsw", "secondary dwelling sa" 51 at 78, QLD investment family about 108) | 273 across 5 guides; best average 32 (WA) | granny flat cost nsw 50 ($3.48) / 107; granny flat cost qld 0 / 38 | Builders with cost tables (3 of 5 have one) and quote tools (2 to 3 of 5); answer-first intro with a 2026 figure (zonescout: "Most granny flats in Australia cost between $120,000 and $250,000"); FAQPage 1 to 2 of 5. | Ours: one 4-row unsourced cost table, rules that are wrong or unnamed (section 0), last crawled July. Fix accuracy and source one table each, then stop. Demand is small. |
| **House and land / new build** ("house and land packages" 9,900, "perth" 5,400, "brisbane" 3,600; "display homes" 6,600; "cost to build a house" 720) | 0 (the hub is noindex; no other page) | AI 2,004 / 170 / 61; 2,086; 2,669 | Builders' listings and search tools (tools on 4 to 5 of 5, up to 187 inputs, LocalBusiness or Product schema). Cost to build: builders' cost blogs, realestate.com.au, BMT's cost table, 4 of 5 with the year in the title, 3 of 5 with a table. | No stock, so the listing SERPs are unwinnable. Cost to build is the only one with a cheap data path (section 5.2). |
| **Builder** ("how to find a builder") | 0 (guide crawled, not indexed) | 30 ($10.56) / 113 | Directories (hipages, servicetasker, Master Builders QLD search). | An informational guide will not take a directory SERP. Fix it and index it to support the cluster, nothing more. |

## 3. Page-by-page gap and fix list (ranked by demand × winnability)

1. `/guides/renovation-cost-australia-2026`: the highest demand in the vertical, and it already ranks and is cited.
2. `/renovating`: no demand of its own, but it misroutes 1,230 impressions. The fix is cheap.
3. `/renovation-cost-calculator` (new): KP 480, and small calculators rank. Specified in section 5.1.
4. `/guides/granny-flat-guide-qld`: about 113 impressions on investment queries; F3.
5. `/guides/granny-flat-guide-wa`: the vertical's Bing click leader; F4.
6. `/guides/granny-flat-guide-nsw`: KP 50, AI 107; F2.
7. `/guides/granny-flat-guide-sa`: "secondary dwelling sa" 51 impressions; F5.
8. `/guides/how-to-find-a-builder-australia`: not indexed, KP 30 / AI 113; F6.
9. `/guides/granny-flat-guide-vic`: 3 impressions. Compliance only (F1).
10. `/house-and-land`: big volumes, unwinnable without stock. F9 and the link clean-up only.

### 3.1 /guides/renovation-cost-australia-2026

Indexed. Last crawl 26 Jul 2026. 90 days: 732 impressions at 46.2, 1 click. Since the deploy: 103 at 18.5. Bing: 3 clicks, 112 impressions at 6.4. Rival columns are drawn from the five renovation queries in `new-homes-renovation-compare.csv`.

| | Ours | Rival median | Best rival (co-architecture, 1st for "how much do renovations cost australia") |
|---|---|---|---|
| Words | 6,869 | 888 to 2,137 | 3,618 |
| H2s | 18 | 0 to 10 | 19 |
| Tables | 8 (66 rows) | 0 to 2 of 5 have one | 9 (47 rows) |
| Tool | calculator, 10 inputs | 1 to 2 of 5 | calculator, 3 inputs |
| Schema | Article, FAQPage, Person, Speakable | Article, Person, WebPage; FAQPage 0 of 5 | Article, Person |
| FAQ | 11 | 0 | 0 |
| Author | "Your Property Guide editorial" (not a person), reviewed by Andy McMaster | named on 3 to 4 of 5 | CO-architecture |
| Query in slug / title / H1 | "renovation cost australia": yes / yes / yes. "full house renovation cost": no / no / no. "how much do renovations cost australia": no / no / no | title 1 to 3 of 5 | "How Much Does a Home Renovation Cost in Australia? (2026 Calculator)" |
| Intro answers with a figure | No. The first visible lines are the description and the "Why these numbers" callout. | 2 of 5 | Yes |

- **Title (58):** keep "Renovation Cost in Australia (2026): Tables and Calculator". It carries the head query, and the page has not been recrawled since 26 Jul.
- **H1:** keep.
- **First intro sentence** (new, above the callout): "As at 30 September 2026, Archicentre Australia's Cost Guide 2026 puts a standard kitchen fit-out at $23,000 to $49,000, a bathroom at $17,500 to $35,000 and renovation inside an existing house at $1,600 to $3,900 per square metre, all including GST."
- **H2s:** rename "Full house renovation" to "Full house renovation cost" (keep the anchor id `full-renovation`). Add "What can you renovate for $30,000?". Add an H3 "What devalues a house" under "What actually adds value at sale" that links `/guides/what-to-fix-before-selling-a-house`. Add nothing else.
- **PAA to answer, quoted:** "Can I remodel my kitchen for $30,000?" (AI 410; also "Can I renovate my kitchen for $30,000?" 179 and "Is $25,000 a lot for a kitchen" 175). "How much remodeling can be done with $100,000?" (AI 398): reword the existing FAQ "Is $100,000 a good budget for renovating my house?" to this phrasing. "What devalues a house the most?" (AI 261, on 28 PAA SERPs). "What is a realistic budget for a kitchen remodel?" (63). "Is $400,000 enough to build a house?" (5,951) and "Is it cheaper to build or buy?" (12,940) go in the knock-down rebuild FAQ until a cost-to-build page exists (section 6). Skip "How much does Bunnings charge to install a kitchen?" (74): a retailer price with no primary source.
- **Schema:** keep Article and FAQPage. Name a person as author if a person wrote it (rivals 3 to 4 of 5). Bump `dateModified` with the F8 fixes. No WebApplication here; that goes on the calculator page.
- **Tool and table:** once `/renovation-cost-calculator` exists, make the embedded estimator a compact embed linking to it, the way `MiniStampDutyEmbed` links the stamp duty calculator. Make "this guide" in table cells a link to the methodology note (F8f).
- **Internal links** (linkgraph: 8 in-content inlinks, from `/`, `/guides`, two articles, the builder, how-to-sell and what-to-fix guides, and a card on `/renovating`). Add:
  - `/renovating` body: "renovation costs in Australia"
  - `/upgrading`: "what a renovation costs"
  - the five granny flat guides' cost sections: "renovation and extension costs per square metre"
  - `/guides/property-depreciation-guide`: "renovation costs"
  - `/guides/home-staging-cost-australia`: "renovation costs before a sale"
  - the footer and header Tools lists: "Renovation cost", pointing at the calculator page
- **Consolidate:** the hub's cost paragraph and cost FAQs are removed rather than moved. The guide already answers them with sourced figures.
- **Clarity, 122 dead clicks.** This page is not among the 25 organic landing pages in Clarity (the 25th has 11 sessions), so most of the 122 dead clicks came from non-organic sessions. Clarity's "Other" channel (2,473 sessions) is larger than organic search (1,843). Read them as a usability hint, not a searcher signal. The live DOM has three candidate targets:
  - (a) 10 table cells whose source tag "this guide" is plain text in the same `<small>` style where 21 other source tags (Archicentre 2026, CKA Jun 2026) are links (`RenovationCostTables.tsx:34-41`, `Src`). Readers click it expecting the source.
  - (b) The byline: "By Your Property Guide editorial · Reviewed by Andy McMaster" is bold text with no link (`GuideArticleLayout.tsx:155-165`). This is layout-wide; the CGT guide's 178 dead clicks share it.
  - (c) The estimator's large primary-coloured "Budget to plan for" total, which looks like a button (`RenovationCostEstimator.tsx:151-159`).

  Fix (a) by linking the tag to the methodology note, which also fixes F8f. Fix (b) by linking the names to `/about#editorial`. Confirm in the Clarity dead-click heatmap for this URL (free, in the dashboard) before changing (c).
- **Files:** `src/app/(marketing)/guides/renovation-cost-australia-2026/page.tsx`, `src/lib/data/renovation-costs.ts`, `src/components/guide/RenovationCostTables.tsx`, `src/components/calculators/RenovationCostEstimator.tsx`, `src/components/guide/GuideArticleLayout.tsx`.

### 3.2 /renovating (persona hub)

Indexed. Last crawl 15 Jul. 90 days: 1,230 impressions at 80.7, 1 click. By type: cost 474 at 83.6, full house 253 at 80.4, calculator 141 at 84.7, budget 118 at 72.9, informational 123 at 77.0. Bing: 262 impressions at 7.0, 0 clicks. The pack has no rival data: its queries are cost SERPs, where the guide is our page.

| | Ours | Guide (the page it competes with) |
|---|---|---|
| Words (main) | 1,111 | 6,869 |
| H2s / tables / tool | 6 / 0 / none | 18 / 8 / calculator |
| Schema | CollectionPage, ItemList, FAQPage (6, two duplicating the guide) | Article, FAQPage (11) |
| Inlinks | 1,231 (header and footer on every page), 6 in content | 8 in content |
| Title | "Renovating a House in Australia 2026: Costs, Finance, Builders, ROI" | "Renovation Cost in Australia (2026): Tables and Calculator" |

- **Title (53):** "Renovating Your Home: Finance, Builders and Approvals".
- **Meta description:** "How to fund a renovation, choose and check a builder, and what needs approval in your state, with links to our renovation cost tables and calculator."
- **H1:** keep "Renovating your home".
- **First intro sentence:** "Start with the numbers: our renovation cost guide prices kitchens, bathrooms, extensions and full renovations by finish level and state, as at 30 September 2026, and the calculator adds design, approvals and a contingency."
- **H2s:** "Paying for the work" (keep the finance content). "Finding and checking a builder" (link the builder guide; the hub promises "builder selection" but does not link it today). "Approvals by state" (name the instruments as in F8d). "Granny flats by state" (link all five).
- **Remove:** the cost paragraph, the materials and labour claim and the ROI paragraph (`persona-hub-content.ts:342-346`). Remove the kitchen, bathroom, value and approval FAQs (`:359-383`). Keep the finance FAQ. In "Should I renovate or sell?" (`:387`), drop the unsourced $30,000 to $80,000 and link `/stamp-duty-calculator` and `/selling-costs-calculator` instead.
- **Schema:** keep CollectionPage and ItemList. Keep FAQPage only for questions the guide does not carry.
- **Internal links out:** guide ("renovation costs in Australia"), calculator ("renovation cost calculator"), `/guides/how-to-find-a-builder-australia` ("how to find a builder"), the five granny flat guides ("granny flat rules in NSW" and so on).
- **Also change the cost-first ledes:** `src/components/journey/PersonaHubLayout.tsx:61-68` ("Renovation costs in Australia have moved hard since 2023") and `src/lib/constants/journey.ts:112` (`hubLede`).
- **Fallback:** if, four weeks after both pages are recrawled, the hub still takes most cost impressions, set its canonical to the guide. The nav item stays.
- **Files:** `src/lib/persona-hub-content.ts:331-390`, `src/components/journey/PersonaHubLayout.tsx`, `src/lib/constants/journey.ts:99-118`, `src/app/(marketing)/renovating/page.tsx:10-11` (the comment cites volumes nobody can trace).

### 3.3 /guides/granny-flat-guide-qld

Indexed. Last crawl 13 Jul. 90 days: 118 impressions at 68.4. Query family "secondary dwelling / granny flat + investment + qld" about 113. KP "granny flat cost qld" 0, AI 38.

| | Ours | Rival median ("granny flat cost qld") | Best rival |
|---|---|---|---|
| Words | 1,155 | 2,062 | whatsthedamage Gold Coast 2,880; outhaus approvals 572 |
| H2s | 9 | 5 | 9 / 6 |
| Tables | 1 (4 rows, unsourced) | 3 of 5 | 2 (21 rows) / 1 (6 rows) |
| Tool | none | 2 of 5 | 19 inputs / none |
| Schema | Article, FAQPage | FAQPage 2 of 5 | FAQPage, Dataset, HowTo / FAQPage |
| FAQ | 6 | | 9 / 3 |
| Author | editorial | 3 of 5 | WTD Editorial Team / none |
| Query in title / H1 | "granny flat" yes; "secondary dwelling" no; "investment" yes | 2 of 5 / 1 of 5 | outhaus intro answers the approval question with a cost and a timeline |

- **Title (59):** "Secondary Dwellings QLD (2026): Granny Flat Rules and Costs".
- **H1:** "Granny flats (secondary dwellings) in Queensland: rules, costs and renting one out (2026)".
- **First intro sentence:** "In Queensland a granny flat is a secondary dwelling, part of a 'dwelling house' under the Planning Regulation 2017, and in many Brisbane residential zones a compliant one needs building approval from a private certifier rather than a council DA (Brisbane City Plan 2014)." Publish only after the F3 check.
- **H2s:** "Can you rent out a granny flat in Queensland?" (the investment queries; name the instrument that allows it). "Approval: accepted development, building approval or DA" (replaces "Development application process"). "Granny flat or modular home?" (from the PAA and the outhaus H1). "What a granny flat costs in Queensland" (a sourced table).
- **PAA:** "Do you need council approval for a granny flat in QLD?" (we cover it, with the contested answer). "What is the difference between a granny flat and a modular home?" "Is $400,000 enough to build a house?" (5,951) belongs on the renovation guide, not here.
- **Schema:** keep. Rewrite the FAQ answers.
- **Table:** cost per square metre from Archicentre Australia Cost Guide 2026 (new construction $2,700 to $5,100/m², incl. GST) times 40, 60 and 80 m², labelled as derived; QBCC home warranty threshold; approval fees with a source.
- **Internal links:** from `/investing` ("granny flat rules in Queensland"), from the SA and WA guides, from the renovation guide's granny flat line.
- **Files:** `src/app/(marketing)/guides/granny-flat-guide-qld/page.tsx`. Regenerate `src/lib/data/static-guides.json` with `npm run guides:manifest` after changing `updatedAt`.

### 3.4 /guides/granny-flat-guide-wa

Indexed. Last crawl 13 Jul. Google: 75 impressions at 32.4 (the best average in the cluster; the queries are anonymised). Bing: 7 clicks, 113 impressions at 5.6. No SERP was pulled for this page. Ours: 1,549 words, 11 H2s, 2 tables, 6 FAQs, Article and FAQPage. Linkgraph: 2 inlinks (`/guides` and the investment category only).

- **Title and H1:** keep ("Granny Flat Guide Western Australia: Rules, Costs & Approvals (2026)").
- **First intro sentence:** "In Western Australia a granny flat is an ancillary dwelling, and the rules come from State Planning Policy 7.3, the Residential Design Codes Volume 1, plus your council's local planning policies." Then give the clause.
- **Fix:** F4. Delete the yield-comparison line. Source the Perth vacancy line (`:53`) or drop it.
- **Links:** add from the NSW, QLD, VIC and SA guides ("granny flat rules in WA"), from the renovation guide and from `/renovating`.
- **Files:** `src/app/(marketing)/guides/granny-flat-guide-wa/page.tsx`.

### 3.5 /guides/granny-flat-guide-nsw

Indexed. Last crawl 25 Aug. 90 days: 10 impressions. KP "granny flat cost nsw" 50 ($3.48), AI 107. Bing: "what are the rules for granny flats in allambie heights", 1 click at 2.

| | Ours | Rival median | Best rival |
|---|---|---|---|
| Words | 1,542 | 2,045 | zonescout 2,045; buildana 2,753 |
| H2s | 13 | 7 | 9 / 15 |
| Tables | 1 (4 rows, unsourced) | 3 of 5 | 3 / 3 (21 rows) |
| Tool | none | 3 of 5 | 14 inputs / 10 inputs |
| Schema | Article, FAQPage | FAQPage 1 of 5 | BlogPosting, FAQPage |
| Intro answers with a figure | No | 2 of 5 | zonescout: "Most granny flats in Australia cost between $120,000 and $250,000 to build in 2026" |
| Terms rivals use that we don't | approvals, builder, stormwater, sloping, soil, council requirements | | |

- **Title:** keep ("Granny Flat Guide NSW: Rules, Costs & Rental Returns (2026)", 59). It already carries the query terms.
- **First intro sentence:** "In NSW a granny flat is a secondary dwelling under the State Environmental Planning Policy (Housing) 2021: up to 60 m² of floor area on a lot of at least 450 m², which a private certifier can approve as complying development where the lot qualifies." Verify Schedule 1.
- **H2s:** "Costs outside the build price" (rival H2s "The costs that sit outside the build price" and "The costs quotes leave out"; stormwater, soil tests, sloping blocks, connections). "Can you claim a granny flat on tax?" (AI 171, ATO). "Disadvantages of a granny flat" (AI 128). "Granny flat or 'granny flat interest'?" (the Services Australia pension rule searchers mix up; AI 5. One paragraph, linked out).
- **PAA, quoted:** "Can you claim a granny flat on tax?", "What are the disadvantages of living in a granny flat?", "What is the main difference between a granny flat and a granny annex?", "Can you explain Centrelink's granny flat rule to retirees?"
- **Schema:** add the tax and disadvantages questions to FAQPage.
- **Table:** cost by size, sourced (derived from Archicentre Australia Cost Guide 2026 rates per m², labelled), plus certifier and connection costs with a source. Drop the unsourced rent-yield maths (F2b).
- **Links:** keep the links to the VIC and QLD guides. Add SA and WA. Add the renovation guide ("extension costs per square metre").
- **Files:** `src/app/(marketing)/guides/granny-flat-guide-nsw/page.tsx`.

### 3.6 /guides/granny-flat-guide-sa

Indexed. Last crawl 12 Jul. 90 days: 67 impressions at 63.4 ("secondary dwelling sa" 51 at 77.7, "secondary dwelling adelaide hills" 1). Bing: 4 clicks at 5.6. Linkgraph: 2 inlinks. Ours: 1,443 words, 12 H2s, 2 tables, 6 FAQs.

- **Title (58):** "Secondary Dwellings SA (2026): Granny Flat Rules and Costs". The live title lacks "secondary dwelling", the query that brings 76% of its impressions.
- **H1:** "Granny flats (secondary dwellings) in South Australia: rules, costs and approval (2026)".
- **First intro sentence:** "In South Australia a granny flat is 'ancillary accommodation' under the Planning and Design Code, and a proposal that meets the deemed-to-satisfy criteria is assessed without public notification under the Planning, Development and Infrastructure Act 2016." Verify the policy reference.
- **Fix:** F5. Rename the H2 "Complying development pathway" to "Deemed-to-satisfy pathway".
- **Links:** from the four sibling guides, the renovation guide and `/renovating`.
- **Files:** `src/app/(marketing)/guides/granny-flat-guide-sa/page.tsx`.

### 3.7 /guides/how-to-find-a-builder-australia

Crawled, currently not indexed. Last crawl 8 Jul. Content dated 13 May. KP 30 ($10.56), AI 113. The SERP is directories (hipages, servicetasker, Master Builders QLD search), and the AI Overview cites them. Ours: 2,791 words, 12 H2s, 0 tables, 8 FAQs, HowTo and FAQPage. Linkgraph: 6 inlinks.

- **Title and H1:** keep.
- **First intro sentence:** "Before you sign, check the builder's licence on your state register and hold the home warranty certificate for your job: Queensland requires cover on residential work over $3,300 (QBCC), NSW over $20,000 (Home Building Act 1989)." Verify both thresholds.
- **H2 to add:** "Licence registers and home warranty by state". This is a table: regulator, register, scheme, threshold, Act, as-at date. A table is the format AI Overviews cite.
- **PAA with AI volume:** "what are the top 5 home builders" (235), "which home builder has the best reputation in australia" (172), "who are australia's top 50 builders" (135), "who is australia's biggest home builder" (67). Answer "largest by starts" from the latest HIA Housing 100 edition, citing the edition and year. Answer "reputation" with the checks (licence, complaints, insurance), not a ranking. The "best" claim needs stated criteria.
- **Links:** add from `/renovating` ("how to find a builder"). Fix the related link at `:118`.
- **After F6:** request indexing.
- **Files:** `src/app/(marketing)/guides/how-to-find-a-builder-australia/page.tsx`.

### 3.8 /guides/granny-flat-guide-vic

Indexed. Last crawl 13 Jul. 90 days: 3 impressions. Bing: 1 click ("what r the rules of building a granny flat in vic"). Demand does not justify more than the F1 rewrite.

- **Title (57):** "Granny Flat Rules Victoria (2026): Small Second Dwellings".
- **First intro sentence:** "Since 14 December 2023 a small second dwelling of up to 60 m² can be built without a planning permit in most Victorian residential zones (Victoria Planning Provisions Amendment VC253), though an overlay can still require one and every granny flat needs a building permit."
- **Files:** `src/app/(marketing)/guides/granny-flat-guide-vic/page.tsx`.

### 3.9 /house-and-land (plus /data, the footer and the home hero)

Live: `noindex, follow`, 0 packages, and the house-and-land sitemap is empty (#94). Rival median for "house and land packages brisbane": 1,981 words, 7 H2s, tools on 4 of 5 (inputs up to 187), LocalBusiness on 3 of 5, the query in the title on 4 of 5. All five are builders.

- **Do now:** F9.
- **Remove the footer link** "House and Land in {suburb}" on every suburb page while there is no stock (`src/components/layout/Footer.tsx:282`). It sends thousands of internal links to a noindex page that says "No house and land packages are listed in {suburb} right now."
- **Hide the home hero's "House & Land" search mode** with the same predicate (`src/components/home/HeroSearch.tsx:15`).
- **No other work.** What would have to be true for city pages is in section 5.3.

## 4. Cannibalisation: who owns which query family

| Query family | Owner | Taking it now | Action |
|---|---|---|---|
| renovation cost(s), how much, home or house renovation cost | renovation guide | hub (474 at 83.6) | Hub de-targeted (3.2) |
| full house / whole house renovation (cost) | renovation guide, "Full house renovation cost" H2 | hub (253 at 80.4) | Rename the H2; de-target the hub |
| renovation calculator / estimator | `/renovation-cost-calculator` (new); the guide until it exists | hub (141 at 84.7) | Build the page; footer and header Tools link |
| $30k or $100k renovation budget | renovation guide (new H2 and FAQs) | hub (118 at 72.9) | 3.1 |
| renovating a house, renovating your home, home renovation australia | hub | none | Keep |
| renovation cost {city} / per m² | renovation guide state table | hub (38 at 90) | No city pages |
| knock-down rebuild, build vs buy | renovation guide KDR section (cost-to-build page only if built) | none | FAQs in section 6 |
| granny flat or secondary dwelling + state | that state's guide | none; but SA and WA have 2 inlinks each, and the renovation guide links NSW only | Link all five from each other, the renovation guide and the hub |
| granny flat cost, national | none (no national page; KP too small) | renovation guide line with unsourced "$130,000–$220,000" | Replace with links to the state guides (F8c) |
| what devalues a house, what to fix before selling | `/guides/what-to-fix-before-selling-a-house` (selling vertical) | renovation guide value section | Answer briefly in the renovation guide and link it |
| house and land worth it / disadvantages | `/guides/house-and-land-packages-are-they-worth-it` (Moreton Bay, 779 words, 6 impressions) | none | Leave |
| house and land packages {city} | nobody (noindex) | none | Wait for stock |

## 5. New pages or tools

### 5.1 /renovation-cost-calculator (build: low cost, reuses existing code)

- **Demand:** KP 480 ("renovation cost calculator", CPC $5.25, 210 to 880 a month over 12 months); AI 4. GSC 90 days: 141 impressions on calculator and estimator variants, all landing on the hub at 80 to 94.
- **SERP:** AI Overview (cites site.co-architecture.com, renovationcalculator.au, hipages). Positions 6 to 10 are small calculator pages: suburbsfinder (1,920 words, 6 inputs, SoftwareApplication and FAQPage), comparethebuilder, whatsthedamage's bathroom calculator (1,391 words, 4 tables, 18 inputs, WebApplication and FAQPage), renovationcalculator.au. Winnable.
- **Format:** calculator first.
  - Title "Renovation Cost Calculator Australia (2026)" (43). H1 "Renovation cost calculator".
  - Intro: "Pick your rooms, finish level and state for a cost range built from Archicentre Australia's Cost Guide 2026 and the CKA cost indicator (June 2026), with design, approvals and a contingency added; it is an estimate, not a quote."
  - Reuse `RenovationCostEstimator` and `src/lib/renovation-estimate.ts`, the at-a-glance table, 5 FAQs, and WebApplication JSON-LD via `WebApplicationJsonLd` (`src/components/seo/JsonLd.tsx:511`), as on the other calculators.
  - Add it to `/tools`, to the footer Tools column (`Footer.tsx:76-92`) and to the header Tools menu (`Header.tsx:52-67`). The sitewide links are how the other calculators get their equity, and they offset the hub's 1,231.

### 5.2 Cost to build a house in Australia (conditional; build last)

- **Demand:** KP 720 (CPC $4.29); AI 2,669. PAA AI volumes: "is it cheaper to build or buy" 12,940, "is $400,000 enough to build a house" 5,951, "can you build a house for $600000" 1,874, "can i build a house for $300,000 in australia" 1,500, "can you build a house for 150k in australia" 310. The largest AI demand in the vertical.
- **SERP:** builders' cost blogs (Rawson, Residential Attitudes), realestate.com.au (3rd; 2,028 words, one table, an ABS average in the intro), BMT's cost table. 4 of 5 put the year in the title; 3 of 5 have a table.
- **Data:** already in `renovation-costs.ts`. ABS-derived average $1,967/m² nationally and by state (Landmark Valuations, 15 Jul 2026), RLB Riders Digest 2026 by capital, ABS PPI by capital.
- **Why conditional:** no lead product attaches. A builder partner, or the first-home grant and construction-loan angle, would be the reason to build it. Until then, the section 6 answers go into the renovation guide's knock-down rebuild FAQ.
- **Title if built (51):** "Cost to Build a House in Australia (2026): By State".

### 5.3 House and land city pages (not now)

- **Demand:** "house and land packages" 9,900 (AI 2,004), "perth" 5,400 (CPC $6.23, AI 170), "brisbane" 3,600 ($4.08, AI 61). Every top-5 result is a builder with listings and filters.
- **What would have to be true first:**
  1. A builder or developer partner per city, paying per enquiry on exclusive-introduction terms. The form must say one builder receives the details and pays us a fee (the #57 pattern; `EnquiryForm` already names "the agent or builder for this package").
  2. At least about 10 live packages per city in `HouseAndLandPackage`, each with price, land and build size, estate, builder and a date, refreshed weekly.
  3. The F10 copy rewritten.

  Then the hub indexes itself (`hasHouseAndLandStock`).
- **City page shape:** listing grid with price and suburb filters, ItemList with Offer per package, an FAQ ("How much does a house and land package cost in Brisbane?"), and links to the stamp duty and FHOG guides.

### 5.4 Not worth building

- **Display homes:** 6,600, AI 2,086. Navigational to builders' display villages; needs a directory we do not have.
- **A national granny flat cost page or calculator:** KP 50 (NSW), 0 (QLD). The state guides with sourced tables cover it.
- **City renovation cost pages:** 54 impressions in 90 days.

## 6. AI search: unanswered questions, with proposed answer-first copy

Each answer is under 60 words, uses one sourced and dated figure, and avoids em dashes. Figures come from sources already cited in `src/lib/data/renovation-costs.ts`, except the ATO and ASEA ones (record the page date when adding).

| Question (AI volume) | Put it on | Proposed copy | Source |
|---|---|---|---|
| Is it cheaper to build or buy? (12,940; 4 PAA SERPs) | Renovation guide, knock-down rebuild FAQ (or 5.2) | "It depends on the land. The average cost to build a new house in 2024-25 was $1,967 per square metre (Landmark Valuations from ABS data, July 2026), about $475,000 for an average-sized home before land, site works and fees. Add the block's price and compare that with established homes nearby." | Landmark Valuations, Construction cost per m² Australia 2026, 15 Jul 2026 (ABS Building Activity) |
| Is $400,000 enough to build a house? (5,951; 12 SERPs) | same | "For the house alone, usually. At the 2024-25 average build cost of $1,967 per square metre (Landmark Valuations from ABS data, July 2026), $400,000 builds about 200 m² before land, site costs, approvals and connections. In higher-cost states it builds less." | same |
| Can you build a house for $600,000? (1,874) / for $300,000? (1,500) | same | "$600,000 covers about 305 m² of house at the 2024-25 average of $1,967 per square metre (Landmark Valuations from ABS data, July 2026); $300,000 covers about 150 m². Land, site works, approvals and fees are extra." | same |
| What is a realistic renovation budget? (1,253) | Renovation guide (already in the body) | No change. | |
| Can I remodel my kitchen for $30,000? (410; plus 179 and 175 for close variants) | Renovation guide FAQ and the new $30,000 H2 | "Yes, for a standard kitchen in the same layout. Archicentre Australia's Cost Guide 2026 puts a standard kitchen fit-out at $23,000 to $49,000 including GST, with white goods extra. Moving plumbing, gas or walls usually takes a kitchen past $30,000." | Archicentre Australia, Cost Guide 2026 |
| How much remodeling can be done with $100,000? (398) | Renovation guide (reword the existing $100,000 FAQ) | "Usually a kitchen, a bathroom and a refresh. Archicentre Australia's Cost Guide 2026 puts a standard kitchen fit-out at $23,000 to $49,000 and a bathroom at $17,500 to $35,000, leaving about $16,000 to $60,000 for paint, flooring and lighting. A whole-house renovation costs more." | Archicentre Australia, Cost Guide 2026 |
| What devalues a house the most? (261; 28 PAA SERPs) | Renovation guide value section, linking the what-to-fix guide | "Problems a buyer cannot see past: structural defects, unapproved building work and hazardous materials. A home built or renovated before 1990 is likely to contain asbestos (Asbestos Safety and Eradication Agency), so inspect before you budget. Over-capitalising for the suburb also loses money at sale." | ASEA, asbestossafety.gov.au, "Asbestos in the home" (check wording and date) |
| Can you claim a granny flat on tax? (171) | NSW guide (then the other four) | "If you rent it out, yes. The rent is assessable income, and the ATO allows a capital works deduction of 2.5% a year on the construction cost of residential buildings started after 15 September 1987. Renting part of your home can reduce its main residence CGT exemption." | ATO, Rental properties guide 2025 and Capital works deductions page |
| What are the disadvantages of living in a granny flat? (128) | NSW guide | "Space, privacy and resale. In NSW a granny flat is capped at 60 m² of floor area (State Environmental Planning Policy (Housing) 2021), it shares the block with the main house, and it cannot be sold on its own title." | Housing SEPP 2021 (verify the clause) |
| What are the top 5 home builders? (235) / Who is Australia's biggest home builder? (67) | Builder guide | Answer with the latest HIA Housing 100 ranking by starts: the edition, the year and the top five with their starts. I have not verified the current figures; the lead fills them from the report. | HIA Housing 100 (latest edition) |
| Are house and land packages good? (85) | `/guides/house-and-land-packages-are-they-worth-it` | Low priority. Only if that guide is touched. | |

## 7. Status of the previous review's items in this vertical

| Item (30 Sep review) | Status | Evidence |
|---|---|---|
| 3.7 / P9: renovation guide tables, calculator, dated answers, PAA FAQs | **Shipped 1 Oct (#89); too early to read** | Live with 8 tables, 10 inputs and 11 FAQPage questions. Google's last crawl was 26 Jul, so the rewrite is unseen. Page-level impressions rose anyway (7.6 to 14.7 a day, position about 51 to 18.5). Request indexing. |
| 3.7 / P10: house-and-land decision (noindex until stock) | **Shipped 1 Oct (#94)** | Live `noindex, follow`; the sitemap is empty. |
| 3.7: house-and-land city pages with a builder enquiry form | **Open, correctly blocked** | No stock, no partner (5.3). |
| #94 note: `/data` prints "0" house and land packages | **Open, still live** | F9 |
| Section 4: guides sitemap and hub links | **Shipped (30 Sep / 1 Oct)** | All vertical guides are in `/guides/sitemap.xml` (Google downloaded it 9 Oct). The builder guide is still crawled, not indexed (8 Jul): request indexing after F6. |
| 1 Oct IndexNow submission (included the renovation guide) | **Done** | Bing: 3 clicks at 6.4 on the guide. |
| Section 3, no page: "display homes" 6,600, "house and land packages perth" 5,400 | **No action, correctly** | 5.3 and 5.4 |
| Granny flat guides, `/renovating`, builder guide | **Not in the 30 Sep review** | New in this review: F1 to F7, 3.2 to 3.8 |

**Request-indexing list for this vertical** (in order): the renovation guide now. Then `/renovating` after its retitle. Then the builder guide, VIC, NSW, QLD, WA and SA granny flat guides, each after its fix. Then `/renovation-cost-calculator` when it ships.
