# Commercial intent review, 30 September 2026

Where yourpropertyguide.com.au matches commercial search intent, where it does not, and what the pages that do rank have that ours lack.

## Sources and how to read this

| Source | What was pulled | Window |
|---|---|---|
| Google Search Console API (service account, `sc-domain:yourpropertyguide.com.au`) | queries, pages, query×page, daily totals | 30 Jun to 27 Sep 2026 (90 days); 28-day windows to 27 Sep and to 30 Aug |
| Bing Webmaster API | query stats, page stats, rank and traffic, crawl stats | 17 Apr to 25 Sep 2026 (sampled rows); 28-day cut from 29 Aug |
| Google Keyword Planner (AU, Google Search) | 53,890 keyword ideas from 12 commercial seed batches; historical metrics for 2,393 exact queries | 12-month averages to Aug 2026 |
| DataForSEO | search-intent labels for the top 3,000 non-postcode Search Console queries; AI search volume for 936 queries; 54 live Google AU SERPs (top 10, People Also Ask, AI Overview); 58 blocked competitor pages fetched with JavaScript | 30 Sep 2026 |
| Page parser | 244 of our pages (guides, tools, suburb, ranking) and 251 competitor URLs (title, H1, H2s, JSON-LD types, word count, tables, inputs, FAQ) | 30 Sep 2026 |

DataForSEO spend: about US$0.73. Files: `gsc-*.csv`, `bing-*.csv`, `kp-*.csv`, `dfs-*.csv`, `serp-summary.csv`, `compare.csv`, `compare-digest.txt` in this folder; raw API responses in `raw/` (gitignored). Scripts: `~/Desktop/Ads/ypg-*.py` and `gsc.py` (Search Console client).

**Caveat on clicks.** Google anonymises rare queries: the query dimension holds 54 of the 911 clicks in 90 days. Every query-level figure below is therefore impressions and position. Clicks are read from the page and date dimensions.

## 1. Scorecard

| Signal | Value |
|---|---|
| Google clicks, 90 days (date dimension) | 911 (453,207 impressions) |
| Google clicks, last 28 days vs prior 28 | 280 / 163,339 impressions vs 278 / 141,228 |
| Bing clicks, last 28 days | 445 (45,880 impressions) |
| Bing index / 5xx per crawl day, last 7 days | 49,046 in index; 294, 261, 209, 210, 182, 162, 156 (falling after the 29 Sep fixes) |
| Share of Google query impressions that are postcode lookups | 79% (191,679 of 241,107; 25 clicks) |
| Commercial + transactional queries (regex) | 4,715 queries, 23,499 impressions, 2 clicks, average position 55 to 65 |
| Same, DataForSEO labels on the top 3,000 non-postcode queries | commercial 813 queries / 10,253 impressions; transactional 244 / 3,746; 0 clicks |
| Live rank in the 54 commercial target SERPs | not in the top 10 for any of them |
| AI Overview | on 50 of 52 SERPs that returned one; our NSW commission guide is cited once ("real estate commission nsw") |

Bing and Google disagree about the same pages. On Bing the guides take 218 of the 244 sampled page clicks in 28 days at an average position of 4.7. On Google the same guides sit at 18 to 90.

| Page | Bing 28d clicks / impressions / position | Google 90d clicks / impressions / position |
|---|---|---|
| /guides/cgt-changes-2026-budget | 51 / 1,280 / 5.0 | 0 (not in the query rows) |
| /guides/real-estate-agent-fees-australia | 33 / 1,078 / 4.0 | 1 / 127 / 43.7 |
| /guides/real-estate-commission-nsw | 24 / 518 / 3.0 | 7 / 1,634 / 27.2 |
| /guides/cost-of-selling-a-house-australia | 18 / 363 / 3.0 | 0 / 106 / 62.8 |
| /guides/real-estate-commission-qld | 18 / 388 / 2.7 | 0 / 118 / 18.8 |
| /guides/property-management-fees-australia | 11 / 444 / 4.7 | 0 / (2 queries) |
| /borrowing-power-calculator (all calculators on Bing: 0 / 3 / 7.0) | 0 / 3 / 7.0 | 0 / 3,572 / 59.8 |
| /rental-yield-calculator | 0 | 0 / 2,981 / 81.0 |

The pages are not the reason Google ranks them low: the same URLs sit at 3 to 5 on Bing. The 5 Sep review's authority finding (23 referring domains) still stands; this review is about the on-page half.

## 2. Where we already match intent

- **Commission and fees guides.** Structure matches the ranking pages: state rate, worked examples at three prices, cost-of-selling table, negotiability, FAQ. Google shows the NSW guide at 18 to 29 for "real estate agents fees", "real estate agent fees nsw", "real estate fees nsw", "real estate commission new south wales". The AI Overview for "real estate commission nsw" cites it. The QLD SERP's number 2 (WhichRealEstateAgent) differs in three ways: a commission calculator on the page (18 inputs), "Brisbane" in the title and H1, and 3,151 words. Tracker item 8 (embed the calculator; NT pilot has it) is what the SERP rewards.
- **Cost of selling.** National guide 2,648 words with a table and six FAQs against Westpac (1,946) and realestate.com.au (2,773). The eight state guides carry the state calculator. Nothing to add beyond links.
- **Suburb medians.** "morayfield median house price" position 9, "morayfield capital growth" 19, "morayfield property investment" 21, "hawthorn median house price" 21. The suburb template is the right shape for the "{suburb} median house price" family (389 queries, 1,757 impressions).
- **Best suburbs.** "best suburbs in moreton bay region" 322 impressions at 31, "best suburbs in australia" 90 at 29, and the state rankings pick up clicks (lowest-flood-risk QLD 7, NSW 5; highest-growth TAS 4, WA 3).

## 3. Intent mismatches: the page exists but is the wrong shape

### 3.1 Rental-market pages receive landlord intent and hold nothing

Five query families land on `/suburbs/{slug}/rental-market`:

| Family | Queries | Impressions | Avg position | Example |
|---|---|---|---|---|
| "{suburb} rental investment" | 17 | 875 | 36 | nedlands, darch, floreat, landsdale, joondalup, churchlands, innaloo, ocean reef (all WA) |
| "rental appraisal {suburb}" | 56 | 599 | 35 | port hedland 101 impressions at 26, scarborough 4020 at 24, newport 4020 at 20, karratha at 25 |
| "rent reviews {suburb}" | 8 | 199 | 36 | picton, davidson, tahmoor (NSW) |
| "property managers {suburb}" | 32 | 188 | 45 | murdoch, haynes, tom price (WA), magill, horsham |
| "property management fees {suburb}" | 4 | 75 | 40 | goodna 62 at 40, petrie |

The landing pages hold 89 to 262 words and no form. Every WA and ACT page is `noindex` (no rental feed) and still shows at 20 to 37 from the days before the noindex. "Rental appraisal" and "property managers" are a landlord looking for a property manager: a lead type the site does not sell today, and the one form of intent where the searcher wants to be contacted.

What ranks for "rental appraisal port hedland": agency appraisal-request pages (Avalon 411 words, 27 inputs; LJ Hooker Hedland 1,309 words). What ranks for "nedlands rental yield": realestateinvestar's suburb investment page (1,139 words, 3 tables: snapshot, supply and demand, statistics).

Fix, in order: (a) a rental appraisal request block on every rental-market page (property-manager introduction, same consent pattern as the appraisal form); (b) "what property managers charge in {suburb}" from the state fee table, with a weekly-rent × fee worked line; (c) a WA rental data feed, because the "rental investment" demand is Perth suburbs and those pages are noindex; (d) an "Is {suburb} a good rental investment?" FAQ from yield and growth where published.

### 3.2 Stamp duty: the title promises a calculator the page does not have

"stamp duty calculator nsw" 33,100/month, "stamp duty calculator qld" 27,100, "stamp duty calculator vic" 27,100, "stamp duty calculator wa" 14,800, "stamp duty calculator sa" 8,100, "stamp duty calculator" 60,500. Our impressions across all of them: under 20, at positions 84 to 93.

Our state guides are titled "Stamp Duty NSW: Calculator, Rates & First Home Buyer Concessions (2026)" but hold a two-input widget (price, checkbox) and link to `/stamp-duty-calculator`. Every ranking page for "stamp duty calculator nsw" has "calculator" and the state in the slug (4 of 4) and in the title and H1 (3 of 4), and leads with the tool: Mortgage Bridge (796 words, 6 inputs, rates table, first-home thresholds, 5 FAQs), yourownterms (734 words, rates table, other upfront costs, FAQ, other states), SuburbScan WA (381 words, 6 inputs, "what this figure excludes", "how WA calculates it"). For "stamp duty qld" the Queensland Revenue Office holds 1, 5 and 7 with its estimator, a "calculating transfer duty" page and a concession-rates page with five tables.

Fix (tracker item 20, confirmed): make each state guide calculator-first (full state calculator at the top, H1 "NSW Stamp Duty Calculator 2026: Rates, Concessions & First Home Buyers"), keep the rates table, thresholds and FAQ below, and add the concession table as its own section. Keep the URLs. The national `/stamp-duty-calculator` links to the eight state pages.

### 3.3 Calculators: two are winnable, one is not

| Query | Volume | Our position / impressions | Who ranks in the top 10 |
|---|---|---|---|
| borrowing power calculator | 33,100 | 88 / 419 | UM Oceania (1,304 words), Chilli Finance (60 words), Lifestyle Finance (335), The Loan Broker (9 words), then banks |
| how much can i borrow | 12,100 | 32 / 100 | banks |
| rental yield calculator | 3,600 | 62 / 68 | ING (202 words), calculatestuff (1,044), Ian Ritchie (180), Westpac guide (1,462), propertyinvestmentprofessionals (1,560 words, 9 FAQs, SoftwareApplication schema) |
| mortgage calculator australia | 9,900 | 95 / 23 | Moneysmart, CommBank, Westpac, ANZ |
| affordability calculator | 210 | 104 / 11 | mixed, some US |
| capital gains tax calculator property | 880 (AI 117) | 0 impressions | Property Compass, RJ Sanderson, AussieCalc (992 words, Article+FAQPage+HowTo+WebApplication), australianpropertyexperts |
| negative gearing calculator | 2,400 | 0 (guide only) | savings.com.au, YIP (3,732 words, 25 inputs), TMS, propertyinvestmentprofessionals; 5 of 5 have a calculator |
| lmi calculator | 3,600 | 0 (guide only) | Helia estimator (5 tables), Westpac, Bank of Melbourne, Stanford (WebApplication) |

The borrowing-power SERP holds a 9-word page at number 6 and a 60-word page at number 3, so it is not locked by authority. Our page has the schema (FAQPage, WebApplication), 1,285 words and six FAQs, and it is the site's most-shown commercial URL (3,572 impressions). Three things separate it from the pages above it: the title and H1 do not say "how much can I borrow" (the phrase gets 100 to 124 impressions on the page at 27 to 54); there is no server-rendered result table (borrowing power by income band, the thing a crawler and an AI Overview can read); and the calculators are reachable only from the footer and `/tools` (the header links `/guides`, `/search`, `/selling-guide`). The rental yield page has the same gaps; the ranking non-bank page has "What is a good rental yield in 2026?" and a step-by-step formula as H2s.

Mortgage calculator is banks and Moneysmart; leave it. Build the LMI estimator (premium bands by LVR and loan size are published) and a negative gearing calculator (the rental yield and CGT engines already exist); both SERPs are calculator-only.

### 3.4 Valuation and appraisal: 369,790 monthly searches, zero impressions

Keyword Planner family "valuation / appraisal": 101 keywords over 500/month, 369,790 searches, none with a Search Console impression. Head terms: "property valuation" and "property value" 60,500; "property value estimate", "property worth calculator", "property appraisal estimate" 14,800 each; "house valuation" 5,400; "how much is my house worth" 4,400.

The SERPs are tools: Domain property profile, property.com.au, CommBank Property Insights, OpenAgent estimate, propertyvalue.com.au, then bank "free property report" pages (P&N, BCU, 460 to 500 words). The AI Overview for "how much is my house worth" lists the portals' instant estimates first and the agent appraisal second.

Our pages: `/appraisal` (927 words, H1 "What is your home actually worth ?", no keyword, no estimate, six FAQs) and `/guides/how-much-is-my-house-worth-australia` (2,293 words, five FAQs). Neither offers a number. Fix: an instant range on both pages from data the site already publishes (suburb median by dwelling type, adjusted by bedroom band where the NSW and VIC feeds have it), shown before the form; then a `/property-valuation` page for the 60,500 head term that explains appraisal vs valuation vs automated estimate (the PAA set: "Can I get a free CoreLogic property value report?", "What is the most accurate website for property value?", "How much do property valuations charge?") and carries the same range tool. Retitle `/appraisal` H1 to "Free property appraisal from a local agent".

### 3.5 Agents: the comparison intent needs a directory the site has not switched on

"compare real estate agents" (170), "best real estate agents sydney" (260, AI 73), "real estate agents near me" (8,100), "real estate agents {city}" (1,600 to 1,900 each). Top 10: LocalAgentFinder (1,253 words, FAQPage, AggregateRating), REIWA agent finder, RateMyAgent, OpenAgent, REB Top 100, WhichRealEstateAgent city lists (1,975 words, 18 inputs, AggregateRating, Product).

`/find-an-expert` has no JSON-LD, the H1 "Tell us your situation. We'll find the right person." and 611 words. The suburb agents pages (509 with impressions, 1,622 impressions, position 19.8; "fitzroy real estate agents" 12, "lane cove real estate agents" 11) are the right URL for "{suburb} real estate agents". The Morayfield page has one agent and 747 words; WhichRealEstateAgent's Morayfield page lists 60 agents in 2,240 words with "What to pay your Morayfield agent", FAQ, suburb overview and nearby suburbs, and carries AggregateRating.

Fix: item 34's listings switch (`AGENT_LISTINGS_ENABLED`) once the directory has agents; until then the page should not claim "agents who sell in {suburb}" with one entry. Add "what to pay" from the suburb median and the state rate (already there as prose; make it a worked line), nearby-suburb links, and the agent count in the title when there are agents. Give `/find-an-expert` a Service schema, a keyworded H1 and a "how we compare agents" section.

### 3.6 Best suburbs: state pages where searchers name a city

"best suburbs to invest in brisbane" 320, "best suburbs in perth" 880 (AI 363), "best suburbs in brisbane" and "best suburbs in sydney/melbourne" in the 880 to 1,900 range. Our nearest pages are state rankings with two H2s ("About this ranking", newsletter), one table, three FAQs, 1,622 to 1,733 words, and on the families category the H1 reads "The for families suburbs in Western Australia ." (tracker item 45).

What ranks: Hunter Galloway (3,874 words, 22 H2s, 4 tables, FAQ: method, top 20, first-home, families, coastal, investors, most expensive, Olympics, safety), Stryve (2,734 words: "How we choose", ten suburbs with a section each, bonus suburbs, strategy matching, FAQ), Satterley (one H2 per suburb), Frasers (7,844 words). Tracker item 22 (city editions, ten suburbs with reasons, method, date) is the shape; add a section per suburb (H2 with the suburb name), an infrastructure or catalyst line, budget tiers, and the PAA answers ("What suburbs will boom in 2026 in QLD?", "Which Brisbane suburbs are undervalued?", "best suburbs to invest in Brisbane for $500,000 or less").

### 3.7 Guides that answer a different question from the one the SERP asks

| Query | Volume (Google / AI) | Our page and shape | What ranks |
|---|---|---|---|
| property management fees | 1,000 / 295 | national guide, 1,444 words, no table | REIQ (2,086 words, per-state section); WhichRealEstateAgent per-city pages with a fee calculator (2,243 words); LocalAgentFinder (2,412). The AI Overview prints a state table (NSW 5.8%, VIC 5.9%, QLD 7.5%, WA 8.7%, SA 7.5%, TAS 8.7%) with letting fees in weeks. |
| building and pest inspection cost | 1,600 / 203 | "Building and pest inspection: what to expect" (2,021 words, one table) | "Building and Pest Inspection Cost Melbourne 2026 Price Guide" (cost table, by property type, building-only vs combined, hidden fees); iSPECT cost table (5 tables); CommBank. |
| conveyancing fees nsw | 480 / 23 | national conveyancing guide (1,812 words, 2 tables) | NSW pages: Quicklaw cost calculator (26 tables), RS Law "How much does conveyancing cost in NSW" (2,086), Jameson Law quotes guide (3,568, FAQPage, HowTo). |
| renovation cost australia | 20 / 742 (AI) | 2,877 words, 8 FAQs, no tables | co-architecture (3,635 words, 9 tables, calculator), Canstar (2,920), CKA cost indicator (6 tables). |
| house and land packages brisbane / qld | 3,600 / 390 | `/house-and-land` hub, 29 words | builders (Coral 7,142 words, Brighton 2,821, Metricon 2,717 with "how much does a package cost in Queensland" and FAQ) and realestate.com.au listings. |
| suburb profile | 1,900 / 25 | `/suburbs` index, 49 words | OpenAgent suburb profiles (895 words, "What's in a suburb profile?", FAQ), Compare the Market (2,031). |
| cgt on investment property | 1,900 / 42 | CGT calculator (1,177 words) | ATO, Bentleys 6-year rule (2,936 words), NAB; the PAA is the 6-year rule and "how to avoid CGT". |

Fixes: a state fee table and an annual-cost calculator on the property management guide, then state pages; retitle the inspection guide cost-first with a cost table by city and property type; NSW, VIC and QLD conveyancing cost pages with a fee calculator; tables and a calculator on the renovation guide; a "what's in a suburb profile" section and search on `/suburbs`; a 6-year-rule and main-residence section (or guide) linked from the CGT calculator. House and land needs a decision: city pages with a builder enquiry form (the developer-lead product) and a package explainer, or noindex the empty hub.

### 3.8 Suburb profile titles and one cannibalisation

"hawthorn median house price" (112 impressions) ranks the Hawthorn East page (3123) at 21, not Hawthorn (3122). Both pages carry the same title pattern ("{Suburb} Postcode {postcode} (VIC) — Suburb Profile & Median Price") and both publish a Land Victoria median. Tracker item 2 (title leads with the suburb and "house prices", not the postcode) is the fix; the postcode-first title is also why 79% of impressions are postcode lookups that do not click. The suburb FAQ lacks the question every suburb SERP's PAA asks: "Is {suburb} a good investment?" (Bondi, Morayfield, Hawthorn all show it). Generate it from published yield and growth, and withhold where neither is published.

## 4. What is missing entirely (Keyword Planner against Search Console)

Keywords over 500 searches a month in commercial families, and the volume where the site has had no impression in 90 days:

| Family | Keywords | Monthly volume | With any impression | Volume with none |
|---|---:|---:|---:|---:|
| loan calculators | 227 | 2,004,180 | 45 | 1,607,800 |
| rates and loans | 272 | 982,470 | 10 | 955,420 |
| stamp duty | 121 | 819,530 | 18 | 654,840 |
| valuation / appraisal | 101 | 369,790 | 0 | 369,790 |
| first home buyer | 88 | 336,320 | 5 | 327,310 |
| suburb / house prices | 135 | 300,570 | 12 | 267,170 |
| agents (find / compare) | 30 | 248,510 | 2 | 246,510 |
| property management / renting | 75 | 205,150 | 2 | 198,870 |
| rental yield / investing | 66 | 188,030 | 6 | 136,550 |
| house and land / new homes | 80 | 172,570 | 0 | 172,570 |
| process (conveyancing, inspections, auction) | 56 | 131,830 | 2 | 125,430 |
| deposit / LMI | 41 | 59,710 | 1 | 54,310 |
| buyers agent | 22 | 29,250 | 0 | 29,250 |
| selling costs / commission | 24 | 23,180 | 20 | 3,620 |

Full list: `kp-gap.csv`. Three readings:

1. **Selling costs is the one family where the site is present** (20 of 24 head terms have impressions). That is where the guides are strongest and where Bing already pays.
2. **Pages exist but have no impressions at all** for terms the site has a guide for: "first home owners grant qld" 14,800 (guide exists), "help to buy scheme" 12,100, "first home super saver scheme" 6,600, "first home buyers grant nsw" 6,600, "lmi calculator" 3,600 (guide), "cooling off period" 1,300, "conveyancing fees" 1,600, "buyers agent" 5,400 and every "buyers agent {city}". A page with 1,400 to 2,200 words and FAQ schema that gets zero impressions on a 6,600-a-month term is an indexing or link problem before it is a content problem. Check these URLs in Search Console's URL inspection (tracker item 44) and count the internal links into them; the header links only `/guides`, `/search` and `/selling-guide`.
3. **No page at all**: "landlord insurance" 14,800 (affiliate comparison), "rental bonds online" and "bond refund" (state bond authorities, but a "how to get your bond back" guide fits the renters series), "display homes" 6,600 and "house and land packages perth" 5,400 (see 3.7), "section 32" 5,400 (13 impressions on the conveyancing guide; a Victorian vendor statement guide would take it), "depreciation schedule" 2,900 (the depreciation guide exists; check it targets the phrase).

## 5. AI search

AI search volume (DataForSEO, AU) beside Google volume for the queries where the ratio matters:

| Query | Google | AI | Note |
|---|---:|---:|---|
| how to sell a house | 170 | 1,842 | our HowTo guide, position 67 on Google |
| selling a house | 140 | 7,741 | |
| how to buy a house in australia | 390 | 5,245 | buying-property-australia guide, position 67 |
| renovation cost | 210 | 2,008 | |
| how much can i afford / how much borrow | 40 / 40 | 1,546 / 1,312 | affordability and borrowing calculators |
| stamp duty qld | 3,600 | 1,025 | |
| property management fees | 1,000 | 295 | |
| best suburbs in perth | 880 | 363 | |
| building and pest inspection cost | 1,600 | 203 | |
| capital gains tax calculator property | 880 | 117 | |

AI Overviews appeared on 50 of 52 SERPs. Domains cited most: realestate.com.au 19, OpenAgent 12, CommBank 8, Reddit 7, WhichRealEstateAgent 6, Westpac 6, LocalAgentFinder 5, Canstar 5, ANZ 5. We are cited once. The cited pages share a pattern our commission guides already follow and the others do not: a table of figures by state or city, a date, a named source and a one-sentence definition at the top of the section. The property management, inspection, conveyancing and renovation guides need that table before they can be cited.

## 6. People Also Ask we do not answer

From the 54 SERPs, questions absent from the FAQ schema of the matching page:

- Stamp duty: "How much is stamp duty on a $800,000 house in NSW?", "How much stamp duty would I pay on a $1,000,000 house in Queensland?", "What is stamp duty on $820,000?" (dollar amounts at fixed prices, not rates); "Who is eligible for stamp duty exemption WA?".
- Deposit and LMI: "How much LMI on a 10% deposit?", "How much deposit do I need for a $700,000 house?", "Is $40,000 enough for a house deposit?".
- Rental yield: "Is 4.5% rental yield good?", "Is 3.5% a good rental yield?", "What is the 30% rent rule in Australia?".
- CGT: "What is the 6 year rule for capital gains tax on property?", "How much capital gains tax will I pay on $300,000?", "How do I avoid paying CGT on investment property?".
- Buyers agent: "Do you pay a buyer's agent upfront?", "Why are buyers agents so expensive?" (we answer tax deductibility and negotiation).
- Inspections: "Who pays for building and pest inspection in QLD?", "Can you claim building and pest inspection cost?".
- Suburbs: "Is {suburb} a good investment?", "What suburbs will boom in 2026 in QLD?", "Which suburb in Sydney has the highest median house price?" (the state rankings can answer the last one).
- Commission: "Do real estate agents get paid if the house doesn't sell?" (answered on the state guides, not the national fees guide), "Is 70/30 a good commission split?" (agent-side; skip).

Every commission, stamp duty, cost-of-selling and calculator page already has FAQPage schema, so adding a question is a content change, not a template change.

## 7. Priority order

1. **Rental-market page as a landlord lead page** (3.1): appraisal request block, property manager fees line, WA feed. New lead type; 1,900 impressions of landlord intent on pages with nothing on them.
2. **Stamp duty state pages calculator-first** (3.2, tracker 20): 33,100 + 27,100 + 27,100 + 14,800 + 8,100 searches a month on SERPs where small pages with the tool rank.
3. **Suburb profile title and FAQ** (3.8, tracker 2): suburb and "house prices" first, "Is {suburb} a good investment?" FAQ; resolves the Hawthorn / Hawthorn East pick and the 79% postcode-lookup impressions.
4. **Commission calculator rollout** (3.2 of the 5 Sep plan, tracker 8) plus the capital city in the title of each state guide.
5. **Property management fees**: state table, annual cost calculator, then state pages (3.7). Highest AI-to-Google ratio among the guides we already have.
6. **Appraisal and valuation**: instant range from published medians on `/appraisal` and the house-worth guide, then `/property-valuation` (3.4).
7. **Best suburbs city editions** (3.6, tracker 22) and the H1 bug (tracker 45).
8. **Calculators**: header link to the tools, borrowing-power result table and H1, LMI estimator, negative gearing calculator (3.3).
9. **Inspection, conveyancing, renovation** cost-first rewrites with tables (3.7).
10. **Index check on zero-impression guides** (section 4, reading 2) and the house-and-land decision (3.7).

Items 2, 3, 4 and 7 are already on the tracker; this review adds the evidence and the SERP shape for each. Items 1, 5, 6, 8 and 9 are new.
