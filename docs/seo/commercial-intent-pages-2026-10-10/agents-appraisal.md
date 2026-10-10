# Agents and appraisal: commercial-intent findings, 10 Oct 2026

> Part of the [commercial-intent and competitor gap review of 10 October 2026](../commercial-intent-review-2026-10-10.md). Written by a read-only analyst from the evidence pack `data/packs/agents-appraisal-*` in the run folder `~/Desktop/Ads/ypg-commercial-intent-review-2026-10-10/` (SERP digest, compare rows, GSC queries, intent-match misses, unanswered PAA) and the source at origin/main 9ef5ee7. File and line references are to that commit. Points marked "verify" are the analyst's own knowledge, not a source fetched in this run: check them with the regulator before changing copy. No site code was changed.

Vertical: `/suburbs/{slug}/agents`, `/find-an-expert`, `/agents`, `/appraisal`, `/property-valuation`,
`/guides/how-much-is-my-house-worth-australia`, the agent guides, `/real-estate-leads/*`.
Evidence: this pack (`agents-appraisal-*`), `../gsc-post-deploy-*.csv` (1 to 7 Oct), `../gsc-90d-*.csv`,
`../index-status.csv`, `../linkgraph.json`, `../serp-raw.json`, `../our-pages-parsed.json`, live pages fetched with curl on
10 Oct (including `/suburbs/subpages/sitemap/agents.xml` and the suburb picker API), source at `repo-main/src` (9ef5ee7).
Read-only throughout. Titles below are counted before the " | Your Property Guide" suffix. No em dashes in proposed copy.

**Top 5**

1. Three wrong or unsourced figures are live on agents pages: Kew East's house and unit medians look swapped ($660,000
   house, $1,396,000 unit) and the commission is worked on the wrong one; every page without a median prints
   "between 1.6% and 3.25%" as its state's range (NSW is 1.8% to 2.5% in our own data); and no agents page names the source or
   period of its median, so ABS SA2 area figures (TAS, QLD, WA, ACT, NT) are presented as the suburb's own median.
2. The agents sitemap fell from 4,719 URLs (29 Sep) to **1,347** today: NSW 0, VIC 748. In the first week after the deploy,
   **54% of the template's impressions (3,751 of 6,972)** sat on pages that now answer noindex (all NSW, 726 of 831 QLD).
   The label repair is the fix and it is racing Google's recrawl. Longer term, index on local substance, not the house
   median alone (Glenelg is noindex on 3 house sales in a unit suburb).
3. The agents page is our best appraisal page and does not say so: "{suburb} property appraisal" and "home appraisals
   {suburb}" land on it at an average position of **13.9** (206 impressions, 64 of them in the top 10), against 26.5 for the
   agents queries themselves. Add "appraisal" to title and H2, nearby-suburb links (each agents page has exactly **one**
   in-content inlink), and in time an agency list, which is what every top-10 result on these SERPs has.
4. The match copy promises what the network may not deliver: "one agent who has recent sales in {suburb}" on every
   suburb, "within one business day" on five pages, "We'll find the right person" as the /find-an-expert H1, and a "Vetted
   directory" of three placeholder "Featured Agent" profiles on /agents. /appraisal already has the right caveat; reuse it.
5. Two cheap wins: retitle /find-an-expert for "find a real estate agent" (170 Google, **444 AI**, positions 3 to 8 held by
   unrelated government pages) with Service and FAQ schema; give /property-valuation a free-estimator comparison table
   and real inlinks (it has 4) since Google already ranks it 3.2 and 4.2 for "home valuation calculator" and "best property
   value estimator australia".

---

## 0. Fix first: accuracy and compliance on live pages

| # | Problem | Evidence (live, 10 Oct) | Source | Fix |
|---|---|---|---|---|
| F1 | **Kew East median inverted** | /suburbs/kew-east-vic-3102/agents: "On Kew East's median house price of $660,000", worked to $10,560 to $16,500 commission. The profile /suburbs/kew-east-vic-3102 prints "Median Unit Price ... $1,396,000" and "Units come in around $1,396,000, roughly -112% below the house median." Indexed, in the agents sitemap, and the page Google sends "kew real estate agents" / "real estate agents kew" to (23 impressions, 14.7 to 15.7). | Data (Land Victoria row); the rule `publishesMedians` has no sanity check on house against unit: `src/lib/published-medians.ts:62-64` | Withhold both medians when the unit median exceeds the house median (a ratio guard, logged) and have the lead repair the row; run a read-only sweep of `sales-vic` rows with `medianUnitPrice > medianHousePrice`. The "-112% below" sentence belongs to the suburbs vertical. |
| F2 | **Wrong fee range when the median is withheld** | /suburbs/lane-cove-nsw-2066/agents: "Commission in New South Wales is set by agreement, not regulation. Agents typically charge between 1.6% and 3.25% of the sale price". Same on Carindale (QLD). Our own NSW range is 1.8% to 2.5%, QLD 2.3% to 2.9%; 1.6% is Victoria's low and 3.25% Tasmania's high. Affects every noindex page (all NSW, most QLD). | `src/app/(marketing)/suburbs/[slug]/agents/page.tsx:165` falls back to a national string when `model.commission` is null; ranges in `src/lib/data/commission-rates.ts:15-24` | Always print `STATE_RATES[state]`; the median only decides whether the worked line uses the suburb figure or example prices. |
| F3 | **Medians with no source, period or basis** | Williamstown: "On Williamstown's median house price of $1,600,000" with no source or date anywhere on the page. East Devonport: "On East Devonport's median house price of $473,000", while its profile says the figure is the ABS statistical area (SA2) median for 2024 that "can differ from sales in East Devonport itself". Meta descriptions repeat it ("what they charge on the $473,000 median"). | `src/lib/suburb-agents.ts:72,85-87`; `page.tsx:80,181,242` | Print the provenance sentence the instant range already uses (`describeSalesProvenance`, `src/lib/sales-provenance.ts:47`; `medianCaption`, `src/lib/value-range.ts:63-67`): "Land Victoria quarterly median, published May 2026" or "ABS statistical-area (SA2) median, 2024". Name the commission sources too (`page.tsx:196` says only "published agent-comparison guides"). |
| F4 | **Match and speed promises across the vertical** | Agents pages: "we connect you with one agent who has recent sales in Lane Cove" and "our team will find you one who sells in the suburb"; appraisal block: "A local agent who actually sells in Lane Cove will give you an honest number" and "Reply within 1 business day". /appraisal: "Response within one business day", "no auto-routing". /property-valuation: "They contact you within one business day". /find-an-expert H1 "Tell us your situation. We'll find the right person.", H2 "we'll find the right specialist for it", "A mortgage broker compares 30+ lenders ... They know which lender will say yes", "We work with property accountants, conveyancers, family lawyers and estate planners". Per the 9 Oct Sent 24/7 setup notes, the YPG tenant had no agents (buyers) on the Vendor Leads campaign, and appraisal leads go to the team inbox; I could not verify network coverage by suburb. | agents `page.tsx:95,98,120-122`; `src/components/suburb/SuburbAppraisalCTA.tsx:138-139,271`; `appraisal/page.tsx:28,121,276-278`; `property-valuation/page.tsx:372-373`; `find-an-expert/page.tsx:67,80,105,141,167,199,243-244` | Brief rule: no agent-match promises, no speeds the data cannot back. Replace with conditional copy, and put /appraisal's own caveat (`appraisal/page.tsx:234`: "Coverage depends on having a vetted agent in your area. Where we do not yet have one, we tell you rather than pass your details on.") beside every match and appraisal form. Keep the #57 disclosure, which is present on both forms (`SuburbAppraisalCTA.tsx:279-280`, `MatchAgent.tsx:499-500`). |
| F5 | **/agents shows placeholder profiles as a vetted directory** | /agents (noindex, reachable, linked from /real-estate-leads/appraisal-leads as "Find an agent by suburb"): "Vetted directory", "Browse trusted local real estate agents across Australia", three Thomson Property Group profiles marked "Featured Agent", "0 (0 reviews)", with mobile numbers; /agents/matthew-thomson meta says "0 properties sold" while the page shows "SOLD 7". The code calls these placeholder profiles. | `src/app/(marketing)/agents/page.tsx:17-19,57,65`; `src/lib/suburb-agents.ts:12-15` | If they are placeholders, take them off the public route (or confirm they are real, consenting agents). Turn /agents into the agents-by-suburb hub (page 4 below). |
| F6 | **Duplicate locality rows serve identical pages** | /suburbs/prahran-vic-3143/agents and /suburbs/prahran-vic-3181/agents: same $1,667,500 median, same copy, both self-canonical, both in the sitemap; 3143 is Armadale's postcode, so "Real Estate Agents in Prahran VIC 3143" is wrong. Same pattern: malvern-vic-3143 / malvern-vic-3144, bandiana-vic-3691 / bandiana-vic-3694 (both pairs in the sitemap). The split costs rank: "real estate agents prahran" 3143 at 14.4, 3181 at 32.7. | Data (Suburb rows); sitemap gate `src/app/(marketing)/suburbs/subpages/sitemap.ts:91-94` | Canonical (or 301) the secondary postcode to the primary and drop it from every sitemap. Read-only query for same name, same state, same median. "Glenelg Jetty Road" SA 5045, which looks like a post office name, is still a live suburb page and appears in the picker: check it against the item 46 list. |
| F7 | Minor wording | House-worth guide H2 "How to get an accurate figure" and "The accurate way to find out is to get two or three appraisals". Agents pages on NSW suburbs say "We don't publish a median for Lane Cove yet" though one was published until 1 Oct (Lane Cove $3,195,000 on 52 sales sits in the database). | `guides/how-much-is-my-house-worth-australia/page.tsx:60,68`; agents `page.tsx:202,249` | "How to get a figure you can rely on". Reuse `withheldNote` (`src/lib/value-range.ts:94-103`) so the page gives the real reason (thin sales with the count and period, or no feed). |

---

## 1. Where we match commercial intent (keep doing)

- **The suburb query lands on the suburb.** Judged by suburb name rather than the pack's crude "expected" column, 3,002 of
  3,384 agents and appraisal impressions since the deploy (89%) land on the exact suburb's page; 262 (8%) on a page whose
  name contains the queried one, mostly a directional neighbour (section 4). The agents template went from 129 to 996 impressions a day (6,972 on 1,288 pages, 1 to 7 Oct, average
  position 25.7, 4 clicks).
- **Suburb appraisal intent finds the agents page.** 43 "{suburb} property appraisal / home appraisals {suburb} / property
  valuation {suburb}" queries land on agents pages: 206 impressions at 13.9, 64 in the top 10: "property appraisal north
  albury" 2.0, "property appraisal bandiana" 3.6 (26 impressions), "free property appraisal medowie" 4.6, "home appraisals
  glen huntly" 7.0, "property appraisal hawkesbury" 8.2, "home appraisals balnarring" 9.2, "real estate property appraisal
  fairview park" 8.8. The pack's matcher calls these wrong page (it expects /appraisal); they are the right page.
- **Fees worked on the suburb median** (low, typical, high) matches WhichRealEstateAgent's "What to pay your {suburb} agent"
  section, and the five choosing points match the H2s rivals use for "how to choose".
- **/property-valuation is being tested for tool intent after one crawl (1 Oct):** 117 impressions in 90 days at 39;
  "home valuation calculator" 3.2, "best property value estimator australia" 4.2 (11 impressions).
- **"home price guide"** (720 a month): the home page is 5th live on 10 Oct and one of four sources cited in the AI
  Overview (with NAB, propertyupdate, Domain). Leave it.
- **/guides/questions-to-ask-a-real-estate-agent**: 6.1 on Google (22 impressions in 90 days), 4.0 on Bing, and 26 organic
  sessions with 274 seconds of engagement, the highest engagement in Clarity's top 25 organic pages.
- **Disclosure (#57 pattern)** is on both lead forms in the vertical and in the agents FAQ ("Your details go to one agent
  only, and that agent pays us a fee for the introduction").

## 2. Where we miss, by query type

| Query type | Demand | What the top 5 reward | Our landing page | Gap |
|---|---|---|---|---|
| "{suburb} real estate agents" | 394 queries, 3,081 impressions at 26.5 since the deploy; KP 50 to 390 per suburb (2,670 a month across the 18 tracked); AI 0 | A **list**: every top-10 result is an agency, a list of agencies/agents or a portal agent search. Across the 18 tracked suburb SERPs (180 slots) realestate.com.au holds 63, Domain 12, WhichRealEstateAgent 10, Facebook 7, top10realestateagent 4, Allhomes 4, RateMyAgent 3, LocalAgentFinder 3, OpenAgent 2. Comparison pages: median 2,124 words, H2s "List of top X agents / What to pay / FAQ / Suburb overview / Nearby suburbs"; WRA carries AggregateRating + Product. Small sites rank 6 to 9 (top10realestateagent, top3realestateagents). No AI Overview on 18 of 18. | /suburbs/{slug}/agents, 687 to 746 words, no agents listed (listings off), no nearby suburbs, one inlink | No list; thin local content; 54% of impressions on pages now noindex |
| "{suburb} property appraisal", "home appraisals {suburb}", "property valuation {suburb}" | 58 queries, 303 impressions; KP 0 each, AI 2 | Agency appraisal pages and WRA suburb pages | agents pages (206 at 13.9), rental-market (41 at 49.4: Bankstown 70.6, Campsie 31.4, Wollert 36.1, Ashfield 37.4) | Agents page lacks "appraisal" in title and H2 (`landing_lacks_signal`); rental-market has no link to a sales appraisal |
| Generic appraisal: "property appraisal", "free property appraisal", "house appraisal" | KP 720 / 590 / 480; AI 92 / 74 / 3 | "property appraisal": a **local pack** plus valuer and agency blogs (median 585 words). "free": banks' free report tools (CommBank, ANZ), Domain, agency forms with 15 to 42 inputs | /appraisal (1,000 words, form, FAQ 6) | 6 impressions in 90 days; last crawled 2 Aug, before the 1 Oct rewrite: too early to read. Authority ceiling on the head terms |
| Valuation and estimate: "property valuation", "property value estimate", "house valuation" | KP 60,500 / 14,800 / 5,400; AI 1,309 / 252 / 153 | "property valuation": local valuer firms (commercial service). "property value estimate": tools (property.com.au, CommBank, Domain, propertyvalue) plus one small site, **ourtop10.com.au at 6** with a 2,894-word guide, a table of the free estimate tools, FAQPage and a named author. "house valuation": REIQ, NAB, Cotality, ANZ guides | /property-valuation (2,491 words, 1 table, range tool, FAQ 6) | No estimator comparison; 4 in-content inlinks; no "house" or "estimator" signal |
| "how much is my house worth", "what is my house worth" | KP 4,400 / 1,600; AI 97 / 67 | Lendi report, NAB, and small agencies with an address tool: independent.com.au 5th (769 words, 23 inputs), circaproperty 6th (273 words, 2 inputs) | house-worth guide (2,358 words, range tool, FAQ 5) | 0 impressions in 90 days; last crawled 3 Jul, before the tool: too early |
| Find and compare: "find a real estate agent", "compare real estate agents", "real estate agents near me" | KP 170 / 170 ($121.50 CPC) / 8,100; AI 444 / 0 / 0 | "find": realestate.com.au, @realty, then **government pages unrelated to agents at 3 to 8** (no AI Overview). "compare": portal and RateMyAgent lists. "near me": OpenAgent smartsearch holds 9 of 10 | /find-an-expert (611 words, no FAQ, title and H1 without "real estate agent") | "find" is winnable now; "compare" and "near me" need a directory we do not have |
| "how to choose a real estate agent" | KP 70 ($63.49 CPC), AI 215 | Guides: RACV, realestate.com.au, OpenAgent, LocalAgentFinder (2,067 words, 4 tables); median 1,028 words; keyword in slug 4/5, title 3/5; named author 4/5 | /guides/how-to-choose-a-selling-agent (2,421 words) | **Crawled, currently not indexed** (last crawl 13 Jul, last update 6 May); "real estate agent" not in slug, title or H1 |
| "best real estate agents {city}" | KP 260 / 320 / 110 (Sydney, Melbourne, Brisbane); AI 104 / 143 / 121 | WRA city lists, REB Top 100 and state rankings, agencies, top10/best10 sites | none | No page; "best" only with stated criteria |
| Agent lead products: "real estate leads", "appraisal leads" | KP 260 / 10; AI 43 / 0 | Lead vendors, telemarketing firms, agent-marketing blogs | /real-estate-leads (21 queries since deploy, "real estate leads" 52.2), /real-estate-leads/appraisal-leads (0 impressions) | Small demand; appraisal-leads has 4 inlinks, all siblings |

---

## 3. Page-by-page gap and fix list

Ranked by demand × winnability.

### 3.1 `/suburbs/{slug}/agents` (template). Demand: highest in the vertical. Winnability: medium.

Representative pages: Lane Cove NSW (noindex), Williamstown VIC (indexed, 23.9 to 32), Kew VIC / Kew East VIC, Glenelg SA (noindex) /
Glenelg North SA, Echuca VIC (18.6).

| | Ours | Rival median (comparison sites, n=15) | Best rival |
|---|---|---|---|
| Words | 687 to 746 | 2,124 | WRA Castle Hill 2,535 (2nd); LocalAgentFinder Echuca 947 (6th) |
| H2s | 6 | 5 | WRA 6: list of agents, which is best, what to pay, FAQ, suburb overview, nearby suburbs |
| Agents/agencies listed | 0 (`AGENT_LISTINGS_ENABLED = false`, `src/lib/suburb-agents.ts:16`) | all | WRA 26 to 59 agents; Allhomes Narooma 13 agencies |
| Tables | 0 | 5 of 57 rivals | top10realestateagent: 4 small tables |
| Tool | match form + appraisal form | 40 of 57 have a form or search | WRA fee calculator |
| Schema | FAQPage, BreadcrumbList, Place, Speakable | mixed | WRA AggregateRating + Product (do not copy: no genuine reviews); LAF FAQPage (7) |
| FAQ | 2 to 3 | | LAF 7 |
| Author | none | 3 of 57 | |
| Query in title / H1 | yes / yes | | |
| Query in intro | suburb only | | |
| Inlinks (in-content) | **1** (own profile, "real estate agents in {suburb}"; 270 of 270 agents pages in the crawl sample) | | WRA: nearby-suburb links on every page |

**Should indexing depend on the median?** Not on the house median alone. Today the median is the page's only
suburb-specific fact: the Lane Cove page without it is the template plus a name, and opening ~17,000 such pages would be a
doorway risk. But the gate drops pages that have plenty to say (Glenelg: 3 house sales in a unit-heavy suburb; SA2-only
areas are fine today but rest on 2024 data), and it ties the whole NSW set to one label. Proposal:

1. **Now:** treat the NSW and VIC label repair as the agents fix. 190 of 190 inspected agents pages are still indexed, last
   crawled 24 to 28 Sep; each recrawl now reads noindex. After the repair, resubmit the agents sitemap and request
   indexing for the NSW pages with the most impressions: Bermagui (72), Kiama (68), Goulburn (63), Yamba (60), Kyogle (59),
   Narooma (54), Castle Hill (53), Mosman (46), Ballina (44), Grafton (43), Lilli Pilli 2536 (41), Bathurst (39), Ingleburn (37),
   Lane Cove North (37), Moree (36). Ask the lead to check QLD too: 726 of QLD's 831 agents impressions are on pages outside
   the sitemap (61 QLD URLs in it), which looks like the same kind of label problem.
2. **Next (template change):** index when the suburb profile is indexable **and** the page carries at least two local facts
   from: a published house **or unit** median with its source; the recorded sales count and period (the profile already
   prints "Only 3 house sales were recorded ... too few for a reliable median"); a published rental median; three or more
   indexable nearby agents pages; an agency list (once built). Change `indexable: reliable` (`src/lib/suburb-agents.ts:92`)
   and the sitemap gate (`src/app/(marketing)/suburbs/subpages/sitemap.ts:68-75,91-94`) together so they cannot disagree.

**What the page says while a median is withheld:** the state's own range (F2) worked on example prices labelled as examples
($750,000, $1,000,000, $1,500,000), the real reason the median is missing (`withheldNote`), the unit median where the feed
publishes one, and a link to the rental-market page where it has data. Rename the empty "Agents who sell in {sn}." H2 until
listings exist (it is still the claim the 30 Sep review flagged).

**Proposed title** (59 / 60): "Real Estate Agents in Lane Cove, NSW: Fees & Free Appraisal"; for names over 13 characters
"North Batemans Bay Real Estate Agents: Fees & Free Appraisal". Keep the postcode only where name and state are shared by
two localities (Lilli Pilli NSW 2229 and 2536; Kingswood NSW x3). The reason is the missing appraisal modifier, not CTR.
**H1:** keep "Real estate agents in {Suburb}".
**First intro sentence** (median published): "Agents in Williamstown typically charge 1.6% to 2.5% of the sale price, about $25,600
to $40,000 on the $1,600,000 median house price (Land Victoria quarterly median, published May 2026)." (withheld): "Agents
in New South Wales typically charge 1.8% to 2.5% of the sale price, $18,000 to $25,000 on a $1,000,000 sale; here is how to
choose one in Lane Cove and how to get a free appraisal."

**H2s to add:** "Free property appraisal in {Suburb}" (promote the appraisal block's H3 "What's your home worth in {sn}?");
"Real estate agents in nearby suburbs"; "Agencies in {Suburb}" (when the list exists); "{Suburb} property market at a
glance" (median with source, sales count, rent, link to the profile).
**PAA to answer** (from the suburb SERPs that show PAA): "What devalues a house the most?" (AI 261), "How long does it take
to sell?" (AI 49), "What is the biggest mistake a real estate agent can make?", "Do real estate agents get paid if the house
doesn't sell?" (in body, make it a FAQ). Add FAQs "What do real estate agents charge in {Suburb}?" on every page (today only
with a median) and "Is a property appraisal in {Suburb} free?".
**Schema:** keep FAQPage, BreadcrumbList, Place. Add ItemList of agencies when listings exist; never AggregateRating without
first-party reviews.
**Tool/table:** fees as a three-row table (low, typical, high) with source and date; later the agency list (see section 5).
**Internal links (anchor text):** on each agents page, 6 to 8 links to `nearbySuburbs` agents pages, "Real estate agents in
{Nearby}", parent locality first on directional names (Kew East links "Real estate agents in Kew" first; Kew links Kew
East), only to indexable pages; from each state commission guide (/guides/real-estate-commission-nsw has 117
inlinks, -vic 165; Bing 2.6 to 5.2) a block "Agents by suburb in {State}" with the 20 suburbs with most impressions; from
/suburbs/{slug}/rental-market (`page.tsx:324-331`, investing CTA only) one line "Selling instead? Free sales appraisal in
{Suburb}" to `/suburbs/{slug}/agents#selling`; from the /agents hub (3.4).
**Consolidate:** duplicate postcode rows (F6). **Files:** `src/lib/suburb-agents.ts`, `src/app/(marketing)/suburbs/[slug]/agents/page.tsx`,
`src/components/suburb/SuburbAppraisalCTA.tsx`, `src/app/(marketing)/suburbs/subpages/sitemap.ts`,
`src/app/(marketing)/suburbs/[slug]/rental-market/page.tsx`, the state commission guides.

### 3.2 `/find-an-expert`. Demand: "find a real estate agent" KP 170, AI 444, plus "how to find a real estate agent" variants (411 impressions in 90 days at 74). Winnability: high for "find".

| | Ours | Rival median ("find", "compare" and "how to choose" SERPs, n=14) | Best rival |
|---|---|---|---|
| Words | 611 | 880 | LocalAgentFinder "How to Compare Real Estate Agents" 2,067 |
| H2s | 3 | 6.5 | |
| FAQ | 0 | 0 of 14 with FAQPage | none |
| Schema | BreadcrumbList, WebSite only | Article/WebPage mostly | realestate.com.au and RACV: Article with named author |
| Query in title / H1 / intro | no / no / no | 0 of 5 for "find" (the SERP is weak) | realestate.com.au, @realty "Sell your property with a local expert" |

**Title** (55): "Find a Real Estate Agent or Property Expert: Free Match". **H1:** "Find a real estate agent, buyer's agent or broker.
One introduction, free." **Intro:** "Tell us what you are selling or buying and where, and we introduce one licensed agent or
specialist who works in your area, where we have one; the specialist pays us a fee for the introduction and you pay
nothing."
**H2s to add:** "How to find a real estate agent to sell your house"; "How to find a good agent in your area" (stated criteria:
recent sales in the suburb, evidence behind the price, fee all-in, method of sale, reporting); "What agents charge, by
state" (STATE_RATES table with named sources, linking the eight commission guides); "Real estate agents by suburb" (link the
hub).
**PAA:** "What is the best way to find a real estate agent?", "How to find a real estate agent to sell a house?", "How to
find the best estate agent in your area?" (AI 146), "Which estate agent has the lowest fees?" (AI 16), "Do all estate agents
do no sale no fee?", "How can I avoid paying estate agent fees?".
**Schema:** Service (serviceType "Real estate agent introduction", provider Organization, areaServed AU) and FAQPage (open
from 30 Sep). **Compliance:** F4 lines. **Internal links:** already 466 ("find a local expert" 271); add "find a real estate
agent" from /guides/how-to-choose-a-selling-agent and /selling. **File:** `src/app/(marketing)/find-an-expert/page.tsx`.

### 3.3 `/property-valuation`. Demand: 14,800 + 5,400 + 60,500 (AI 252, 153, 1,309). Winnability: low on heads, high on estimator and calculator tails.

| | Ours | Rival median ("property value estimate", n=5) | Best rival |
|---|---|---|---|
| Words | 2,491 | 2,362 | ourtop10 2,894 (6th) |
| H2s | 8 | 9 | ourtop10 16 |
| Tables | 1 (7 rows) | 2 of 5 | ourtop10 4 (free tools, costs, city values, 5% gap) |
| Tool | suburb range | 3 of 5 | property.com.au, Domain, propertyvalue (address lookups) |
| Schema / FAQ | WebPage, FAQPage, 6 | 1 of 5 FAQPage | ourtop10 FAQPage, Article, named author and reviewers |
| Query in title / H1 | "property valuation" yes; "estimate" yes; "house valuation" no | | |
| Inlinks | **4** (/appraisal, house-worth guide, /selling, /tools) | | |

**Title** (60): "Property Valuation Australia: Free Estimates Compared (2026)" (only with the table below). **H1:** "Property
valuation in Australia: appraisal, valuation and free online estimates compared (2026)". **Intro:** "A valuation from a
licensed valuer costs $300 to $600 (Aussie, 31 January 2025); an agent's appraisal and the banks' online estimates are
free, and neither free figure is a valuation."
**H2s to add:** "Free property value estimators compared" (table: CommBank Property Insights, ANZ Property Profile Report,
NAB, realestate.com.au, Domain, property.com.au, OpenAgent OpenEstimates; columns: data provider, login needed, what you
enter, what the page says the figure is, date read; each row from the provider's own page); "What lowers a valuation";
"How to find the market value of a property"; "Land values online, state by state" (the NSW section exists).
**PAA:** "What devalues a house the most?" (AI 261), "How accurate is a real estate property value estimate?" and "Who gives
the most accurate home value estimate?" (in body, make them FAQs), "Can I find land values online in NSW?" (AI 17).
**Schema:** keep WebPage + FAQPage; add a named author where real. **Internal links:** from each agents page's prices section
"appraisal, valuation or online estimate?"; from /guides/how-to-prepare-for-a-property-appraisal and the glossary
valuation term "property valuation in Australia". **Consolidate:** the house-worth guide's "The three different numbers"
and "Why the three disagree" duplicate this page's core; cut them to a paragraph and link here. **File:**
`src/app/(marketing)/property-valuation/page.tsx`.

### 3.4 `/agents` repurposed as the agents-by-suburb hub. Demand: enabler for 1,347 pages now, about 4,700 after the label repair.

Today: noindex, 2 inlinks, three placeholder profiles (F5). WRA's "Real Estate Agents Near Me" hub (532 words, one H2 per
capital) ranks 8th for "compare real estate agents". **Title** (52): "Real Estate Agents by Suburb: Fees & Free Appraisals".
**H1:** "Real estate agents by suburb". **Intro:** "Pick your state and suburb to see what agents there charge, how to choose
one and how to ask one local agent for a free appraisal." **H2s:** one per state, then region, linking only indexable agents
pages ("Real estate agents in {Suburb}"). Index it once it lists the suburbs; link it from the header Tools or Suburbs menu,
the eight commission guides ("real estate agents by suburb"), /appraisal's "Appraisals across Australia" state list
(`appraisal/page.tsx:224`, states with no links today) and /find-an-expert. Keep the URL; agent profiles
(`/agents/[slug]`) stay noindex. **Files:** `src/app/(marketing)/agents/page.tsx`, `Results.tsx`, `agents/sitemap.ts`.

### 3.5 `/guides/how-to-choose-a-selling-agent`. Demand: KP 70, AI 215, CPC $63.49. Winnability: medium, blocked by indexing.

| | Ours | Rival median (n=5) | Best rival |
|---|---|---|---|
| Words / H2s | 2,421 / 12 | 1,028 / 6 | LAF 2,067, 4 tables (28 rows) |
| Tables | 0 | 1 of 5 | LAF |
| Author | "Your Property Guide editorial" | named 4 of 5 | |
| Query in slug / title / H1 | no / no / no | 4 / 3 / 3 of 5 | |
| Index | Crawled, currently not indexed (13 Jul); updated 6 May; 237 inlinks | | |

**Title** (58): "How to Choose a Real Estate Agent to Sell Your Home (2026)" (URL unchanged). **H1:** "How to choose a real estate
agent to sell your home". **Intro:** "Shortlist three agents with recent sales in your suburb, ask each for the comparable
sales behind their price and their fee in writing including GST, and choose on evidence rather than the highest number."
**H2s to add:** "How to compare real estate agents side by side" (a comparison table: recent local sales, price evidence,
commission incl. GST, marketing budget, method of sale, reporting); "What the law requires an agent to tell you" (NSW and
VIC estimate rules, from the underquoting guide). **PAA:** "What is the rule of 7 in real estate?" (AI 94), "What is the
biggest mistake a real estate agent can make?", "What is the hardest month to sell a house?" (AI 2,258, in body; FAQ).
**Author:** named, where real (the fixed-fee guide carries Andy McMaster). Then request indexing. **File:**
`src/app/(marketing)/guides/how-to-choose-a-selling-agent/page.tsx:17,24`.

### 3.6 `/guides/how-much-is-my-house-worth-australia`. Demand: KP 4,400 + 1,600 (AI 97, 67). Winnability: medium-low. Too early to read.

Ours 2,358 words, 9 H2s, range tool, FAQ 5, keyword in slug, title and H1; rival median 769 words; independent.com.au
(769 words, address tool) is 5th. Last crawled 3 Jul, so Google has not seen the instant range (1 Oct). Leave the title;
**request indexing**. Changes: F7 wording; make "Where can I get a free property valuation report?" (AI 180, in body) and
"How much do property valuations charge?" (AI 86, in body) explicit FAQs; trim the duplicated "three numbers" sections into
a link to /property-valuation (3.3). 23 inlinks; add "how much is my house worth" from each agents page's prices section.

### 3.7 `/appraisal`. Demand: KP 720 + 590 + 480 (AI 92, 74, 3). Winnability: low on heads (local pack, bank tools). Too early to read.

Ours 1,000 words, H1 "Free property appraisal from a local agent" (shipped 1 Oct), FAQ 6, 313 inlinks ("free property
appraisal" 279); rival median 585 to 1,281 words; rivals' tools carry 15 to 42 inputs. Last crawled 2 Aug: **request
indexing**, no title change (57-character alternative if needed later: "Free Property Appraisal From a Local Agent, No
Obligation"). Add: F4 copy; PAA "How to find the market value for a property?" (AI 123, missing) and "What is a red flag on
an appraisal?" (AI 25) as FAQs (answers in section 6); link the "Appraisals across Australia" states to the hub.

### 3.8 `/guides/fixed-fee-vs-commission-real-estate-agents`. Demand: "flat fee real estate agent" KP 40, "fixed fee" 30. Winnability: medium.

"flat fee real estate agent" lands on /guides/real-estate-commission-vic at 34.5 to 68.8 (5 impressions); the guide that
answers it ranked 4 once. Ours 2,308 words, 1 table, no FAQ schema (3 of 5 rivals have FAQPage; WRA QLD fees 3,133 words
with a calculator). The current title is 120 characters. **Title** (57): "Flat Fee vs Commission Real Estate Agents: Costs
Compared". **H1:** keep the long form. Add FAQPage with "What is a reasonable commission rate?" and "Are flat fee agents
worth it?", and embed the commission calculator. 12 inlinks; add "flat fee agents" from the eight commission guides.
**File:** `src/lib/data/blog-posts/fixed-fee-vs-commission-real-estate-agents.ts:6` (then `npm run publish:blogs`, Jos's call).

### 3.9 `/real-estate-leads/appraisal-leads` and the hub. Demand: KP 10 and 260 (AI 0, 43). Winnability: low; keep small.

Appraisal-leads: 1,723 words vs rival median 1,430, table, 9 inputs, FAQ 6, indexed (9 Oct), 0 impressions, 4 inlinks all
from sibling lead pages. "appraisal leads" lands on the hub at 70.8. Add a link from the hub's opening section ("appraisal
leads") and from the 190 agents-page "Join the network" links, change nothing else. Point its "Find an agent by suburb" card
at the hub (3.4), not the placeholder directory. /real-estate-leads/vendor-leads is "Discovered, not indexed": request
indexing.

---

## 4. Cannibalisation: who owns which query family

| Family | Owner | Competing pages seen in GSC | Action |
|---|---|---|---|
| "{suburb} real estate agents", "agents {suburb}", "best agent to sell {suburb}" | /suburbs/{slug}/agents | directional neighbours (below); duplicate postcode rows | nearby links with parent first; F6 canonicals |
| "{suburb} property appraisal", "home appraisals {suburb}", "property valuation {suburb}" | /suburbs/{slug}/agents | rental-market (41 impressions at 49.4) | appraisal H2 + title on agents; rental-market links to agents#selling |
| "property appraisal", "free property appraisal", "house appraisal" | /appraisal | /property-valuation ("house appraisal" 2 at 60.5) | none |
| "property valuation", "house valuation", "property value estimate", "... estimator", "... calculator" | /property-valuation | none | 3.3 |
| "how much / what is my house worth" | house-worth guide | /property-valuation overlaps in content | trim the guide's three-numbers sections |
| "find a real estate agent", "how to find an agent" | /find-an-expert | none | 3.2 |
| "how to choose / compare a real estate agent" | how-to-choose guide | agents pages' choosing section, questions-to-ask guide | keep agents pages to five points + link |
| "flat fee / fixed fee real estate agent" | fixed-fee guide | /guides/real-estate-commission-vic | 3.8 |
| "home price guide" | home page (5th, AI-cited) | /price-guide | leave it |
| "appraisal leads", "real estate leads" | /real-estate-leads/appraisal-leads, /real-estate-leads | old /for-agents (308s) | 3.9 |

**Neighbour and duplicate picks (since the deploy):**

| Query | Google's page | Intended page | Why |
|---|---|---|---|
| lane cove real estate agents (29) | lane-cove-north-nsw-2066 (16 at 11.8) | lane-cove-nsw-2066 (11 at 9.9) | both NSW, both noindex now |
| kew / real estate agents kew (23) | kew-east-vic-3102 (14.7 to 15.7) | kew-vic-3101 (indexed, correct $2,810,500 median; 15 impressions at 8.3 over 90 days, none since 1 Oct) | near-identical templates; Kew East carries the inverted median (F1) |
| prahran (two variants, 65) | split 3143 / 3181 | prahran-vic-3181 | duplicate row (F6) |
| devonport real estate agents (23) | east-devonport (13 at 39.1) | devonport (10 at 55.2) | both indexed, templates near-identical |
| glenelg real estate agents (14) | glenelg-north (13 at 29.2) | glenelg-sa-5045 (noindex: 3 house sales) | house-only gate |
| batemans bay real estate agents (13) | north-batemans-bay (37.8) | batemans-bay-nsw-2536 | both NSW noindex |
| also: cheltenham (16), lindfield (15), fitzroy (7), wahroonga (7), willoughby (5), wentworthville (4) | the East / North / South variant | the parent | same pattern |

**The matcher.** The suburb picker on every lead form (`src/app/api/suburbs/search/route.ts:19-27`) matches with `contains`
and sorts by name, so "kew" returns Bakewell NT and Ikewa WA before Kew VIC, and "richmond" returns Mount Richmond and North
Richmond ahead of every Richmond, with Richmond VIC fifth of eight. Sort exact match, then prefix, then contains, and tie-break by
population, so leads attach to the suburb the person meant. Internal links do not pick at all today: each agents page gets
one link from its own profile (`src/components/suburb/SuburbContextualLinks.tsx:150`) and none from its neighbours.

## 5. New pages or tools worth building

| Build | Demand | SERP format it needs | Note |
|---|---|---|---|
| **Agency list on agents pages** from the state licence registers (agency name, office address, licence status; not ranked, not endorsed) | the 394-query agents family; 3,081 impressions a week | every top-10 result on "{suburb} real estate agents" is a list or an agency | check each register's terms of use before building; NSW Fair Trading publishes licence data via api.nsw.gov.au. Keeps the one-agent match and its disclosure; no "best" |
| **/agents hub** (3.4) | enabler | state and suburb index | existing URL |
| **City agent pages**, e.g. "Real Estate Agents in Sydney: Fees, Suburbs & How to Choose" (59) | "real estate agents {city}" 1,600 to 1,900 each (30 Sep pull); "best real estate agents sydney / melbourne / brisbane" 260 / 320 / 110, AI 104 / 143 / 121 | WRA city list (fees, agencies, stats), REB rankings | needs a new route (`/agents/[slug]` is taken by profiles); suburbs list linking agents pages, state fee table with sources, choosing criteria, REB Top 100 facts with date; "best" only as "how to judge". Authority ceiling: rank after the hub |
| **Free estimator comparison table** | "property value estimate" 14,800 (AI 252), "best property value estimator australia" 30 (AI 69) | ourtop10's table of tools ranks 6th | a section of /property-valuation (3.3), not a new URL |

## 6. AI search: unanswered questions and proposed answers

| Question (AI volume) | Put it on | Proposed answer (answer-first, under 60 words) | Source |
|---|---|---|---|
| "Who is the most successful real estate agent in Australia?" (759; "...most successful real estate agent?" 1,176; "...Australia's best real estate agent?" 1,131) | /find-an-expert FAQ; city pages | No official body ranks agents. The best-known list is Real Estate Business's Top 100 Agents: its 100 agents for 2025 settled 11,710 sales worth $25.82 billion. A national ranking says little about your sale, so ask agents for their recent sales in your own suburb and the comparable sales behind their price. | REB, "Top 100 Agents 2025", realestatebusiness.com.au, read 10 Oct 2026 |
| "How to find the best estate agent in your area?" (146) | /find-an-expert; agents FAQ | Ask two or three agents who sell in your suburb for their estimated selling price and the comparable sales behind it. In NSW the agency agreement must state that estimate as a single figure or a range no wider than 10% (Property and Stock Agents Act 2002, ss 72A to 73B). Then compare evidence, fee and marketing. | NSW legislation, as summarised in our underquoting guide (`src/lib/data/blog-posts/underquoting-laws-by-state.ts`) |
| "Where can I get a free property valuation report?" (180, in body only) | house-worth guide FAQ | Banks give free automated estimates, not valuations: CommBank's Property Insights uses Cotality data and ANZ's Property Profile Report uses PropTrack, and both say the figure is not a valuation. An agent's appraisal is free too. A valuation a lender accepts costs $300 to $600 (Aussie, 31 January 2025). | Aussie 31 Jan 2025; CommBank and ANZ pages read 30 Sep 2026 (already cited on /property-valuation) |
| "How to find the market value for a property?" (123; "...find out the market value..." 116) | /appraisal, /property-valuation | Start with sold prices for similar homes nearby, then the suburb's published median, then two or three agent appraisals. Land Victoria's latest quarterly median for houses in Williamstown, published May 2026, is $1,600,000; a home sits above or below that on its land, condition and the comparable sales. | Land Victoria / DTP quarterly median as printed on /suburbs/williamstown-vic-3016 |
| "What is a red flag on an appraisal?" (25) | /appraisal FAQ | A price with no comparable sales behind it, or one far above every other agent's. In Victoria an agent's estimate must be a single figure or a range within 10%, and the statement of information must show the suburb median and three comparable sales (Estate Agents Act 1980, ss 47A and 47AF). | Estate Agents Act 1980 (Vic); our underquoting guide |
| "What is the hardest month to sell a house?" (2,258; "...a home?" 303) | how-to-choose guide FAQ; agents FAQ | Late December and January are usually the quietest weeks: buyers are on holiday and fewer homes are listed, so campaigns run longer. **[Figure needed: Cotality or SQM Research new listings, December to January against the spring peak, with the month.]** Your suburb's own clearance rate and days on market matter more than the calendar. | Not on file: our best-time-to-sell guide cites CoreLogic without a figure. Do not publish without the figure |

Also unanswered, no sourced figure on file: "What devalues a house the most?" (261), "What is the rule of 7 in real estate?" (94),
"How long does it take to sell?" (49). AI Overviews in this vertical cite realestate.com.au, OpenAgent, CommBank, ANZ,
Domain, LJ Hooker, Ray White, Cotality and LocalAgentFinder; we are cited on "home price guide" only.

## 7. Status of the 30 Sep review's items in this vertical

| Item | Status | Evidence |
|---|---|---|
| 3.4 instant range on /appraisal and the house-worth guide | Shipped 1 Oct (PR #82) | Too early to read: /appraisal last crawled 2 Aug, guide 3 Jul. Range labelled "Range around the median (±15%)", source and period printed, "not a valuation of your home" |
| 3.4 /appraisal H1 "Free property appraisal from a local agent" | Shipped | Live; too early to read |
| 3.4 /property-valuation | Shipped 1 Oct; crawled 1 Oct | 117 impressions at 39; 3.2 and 4.2 on calculator and estimator queries |
| 3.4 bedroom-band adjustment | Not built | No feed holds bedroom sales medians (tracker) |
| 3.5 switch on listings (`AGENT_LISTINGS_ENABLED`) | Open | `src/lib/suburb-agents.ts:16` false; directory paused since 3 Jul |
| 3.5 stop claiming "agents who sell in {suburb}" | Partly | List hidden, but the H2 and "our team will find you one who sells in the suburb" remain (`page.tsx:115,120-122`) |
| 3.5 worked "what to pay" line | Shipped (17 Sep build) | Only where a median is published; fallback range wrong (F2) |
| 3.5 nearby-suburb links | Open | One in-content inlink per agents page |
| 3.5 agent count in title | Not applicable until listings | |
| 3.5 /find-an-expert Service schema, keyworded H1, "how we compare agents" | Open | Live JSON-LD: BreadcrumbList, WebSite; H1 unchanged |
| 3.8 Hawthorn / Hawthorn East pick | Same pattern now on agents pages | Kew / Kew East, Devonport / East Devonport (section 4) |
| Tracker 34 (agents pages) | Live since 17 Sep; still unticked in the tracker | |
| Tracker 37 (sitemaps only indexable; agents 4,719) | Shipped 29 Sep | 1,347 today because of the statsSource label |
| Tracker 46 (postal names out) | Shipped 29 Sep | "Glenelg Jetty Road" SA 5045 still live and in the picker |

**Request-indexing candidates from this vertical** (for the lead's list): /appraisal (2 Aug), the house-worth guide (3 Jul),
/guides/how-to-choose-a-selling-agent after its refresh (not indexed, 13 Jul), /guides/questions-to-ask-a-real-estate-agent (3 Jul),
/guides/how-to-prepare-for-a-property-appraisal (3 Jul), /real-estate-leads/vendor-leads (discovered, not indexed), and the
NSW agents pages listed in 3.1 once the label is repaired.
