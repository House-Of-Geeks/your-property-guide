# Selling costs and commission: findings (10 Oct 2026)

> Part of the [commercial-intent and competitor gap review of 10 October 2026](../commercial-intent-review-2026-10-10.md). Written by a read-only analyst from the evidence pack `data/packs/selling-*` in the run folder `~/Desktop/Ads/ypg-commercial-intent-review-2026-10-10/` (SERP digest, compare rows, GSC queries, intent-match misses, unanswered PAA) and the source at origin/main 9ef5ee7. File and line references are to that commit. Points marked "verify" are the analyst's own knowledge, not a source fetched in this run: check them with the regulator before changing copy. No site code was changed.

Pack `selling`. Scope: agent fees and commission (the national fees guide, eight state commission guides, `/real-estate-commission-calculator`), cost of selling (the national guide, eight state guides, `/selling-costs-calculator`), how to sell, selling privately, fixed fee and negotiation.

Evidence: the `selling-*` pack files; `gsc-post-deploy-query-page.csv` (1 to 7 Oct); `gsc-90d-*` (10 Jul to 7 Oct); `bing-page.csv` (90 days); `serp-raw.json` and `serp-summary.csv` (AU desktop, 10 Oct); `serp-location-check.json`; `index-status.csv`; `linkgraph.json`; Clarity organic pages (12 Jul to 9 Oct); live pages fetched 10 Oct; source at `repo-main/src` (9ef5ee7). Files are cited as `src/...:line`.

**Top five**

1. **Fix the numbers first.** The commission ranges are reused on more than 20 pages, and none of those pages shows a source or an as-at date. `src/lib/data/commission-rates.ts:1-5` says the ranges were checked against a document that holds no rates. On three pages with no sources at all, the layout still prints "Every figure on this page is sourced and dated". Pages give five different national ranges and four different marketing ranges. The line "earns back their commission many times over" is wrong arithmetic and appears on nine guides. The fees guide's cooling-off statement contradicts our own sourced guide. The totals labelled "all-in" leave out GST.
2. **The split.** Since the deploy, 491 impressions on national agent-fee queries and 571 on national cost-of-selling queries reached Google. None of them landed on the two national guides: they went to the VIC and NSW commission guides and the state cost guides. The national guides should own the national queries. Google last crawled them on 20 Aug and 3 Jul.
3. **Page shape is not the gap.** Bing ranks the same guides at 2.6 to 3.9, and they earn 265 Bing clicks against about 26 from Google. The gap is authority and crawl. Keep on-page work to the gaps we can measure: a calculator on the fees guide, dollar figures on the cost guide, server-rendered tables on both calculators, and FAQ schema on the blog-template guides.
4. **QLD is not indexed.** The QLD commission guide covers a 590-a-month query and earns 29 Bing clicks at 2.6, but Google has had it as "crawled, currently not indexed" since 17 Jun. Request indexing for it.
5. **Keep doing this.** This vertical holds 8 of the site's 16 live top-20 positions and 3 of its 6 AI Overview citations.

---

## 0. Fix first: accuracy and compliance

| # | Problem | Live evidence | Source | Fix |
|---|---|---|---|---|
| 0.1 | **Commission ranges have no source and no as-at date** | **On the national fees guide:** the table "Commission rates by state (typical ranges, 2026)" has a "Typical range" and an "Average" column (NSW ~2.0%, TAS ~2.9%). There is no source line, no date and no sources block on the page.<br><br>**On the state guides:** the only date line is "As at September 2026. Commission is this guide's typical New South Wales range", which is circular. The sources lists link to homepages (moneysmart.gov.au/, consumer.vic.gov.au/, reiq.com/), and none of those pages publishes a rate.<br><br>**On the cost guides:** the sources note reads "Your Property Guide's compiled market figures (September 2026)". | **The code comment:** `src/lib/data/commission-rates.ts:1-5` says the ranges were "cross-checked in docs/lead-gen-strategy.md". That doc is 82 lines and holds no commission rates, only platform referral fees.<br><br>**Where the ranges are used:** `STATE_RATES` (`:15-24`) feeds the 8 guides, both calculators, the cost guides and the agents pages (`src/app/(marketing)/suburbs/[slug]/agents/page.tsx:165`).<br><br>**Other files:** `src/app/(marketing)/guides/real-estate-agent-fees-australia/page.tsx:162-180` and `src/lib/data/cost-of-selling-state.ts:44-45`. | **Why this is urgent:** the AI Overview for "how much do real estate agents charge" quotes state medians of TAS 3.25%, NT 3.00%, SA 2.90%, QLD 2.80%, WA 2.75%, NSW 2.35%, VIC 2.35% and ACT 2.23%. Our "typical" figures are 0.1 to 0.9 points lower (SA 2.0 against 2.90). Our own negotiation guide says statewide medians "sit toward the top of each range, sometimes above it".<br><br>**Others already copy our figures:** One Group Realty, at 3 for "real estate commission" and 5 for "real estate agent commission", republishes our ranges, credits "OpenAgent's 2026 commission data and Your Property Guide", and links to us. It has been a referring domain since 29 Sep, spam score 0.<br><br>**Do what #84 did for property management fees.** Build a per-state table with a capital-city row and a regional row (this is tracker 9). Footnote every cell to a named source with a date, and write "No published range" where nobody publishes one.<br><br>**Source the rules to regulators:**<br>• NSW Government, "Agency agreements for the sale of property in NSW"<br>• CAV, "Authorities, rebates and commission"<br>• Queensland Government, "Commissions and costs" (the QLD AI Overview cites it)<br>• REIQ, "No standard commission"<br>• REIWA, "Agent fees" FAQ<br>• CBS SA, CBOS, Access Canberra and NT.gov<br><br>Print the as-at line under every rate table and calculator. If the sourced figures move, change `STATE_RATES` once. |
| 0.2 | **"Every figure on this page is sourced and dated" is printed where nothing is sourced** | The banner appears on `/guides/real-estate-agent-fees-australia`, `/real-estate-commission-calculator` and `/selling-costs-calculator`. None of the three renders a sources block. ("Sources and methodology" does appear on the state guides and the national cost guide.) | `src/components/guide/GuideArticleLayout.tsx:226` and `src/components/calculators/CalculatorPageLayout.tsx:152` print it unconditionally. | Print the banner only when the page passes `Sources`, and add a sources block to these three pages. |
| 0.3 | **Five national ranges, four marketing ranges and four totals** | See the table below. | See the table below. | Derive every national statement from `STATE_RATES` and `selling-costs.ts`, for example with a `nationalRange()` helper, so the text cannot drift. Use one marketing range. |
| 0.4 | **"Earns back their commission many times over" is wrong arithmetic** | **The live line:** "An agent who negotiates an extra $20,000 on the sale earns back their commission many times over." It appears in the fees guide TL;DR and body and on every state guide.<br><br>**The numbers:** at 2%, the commission on $800,000 is $16,000.<br><br>**Our own guide disagrees:** the fixed-fee guide says the last $20,000 of price "is worth $400 to the agent". | **Fees guide:** `real-estate-agent-fees-australia/page.tsx:54, :301`<br><br>**State guides:**<br>• `real-estate-commission-nsw/page.tsx:280-282`<br>• `-vic:282`<br>• `-qld:91, :283`<br>• `-sa:266`<br>• `-tas:91, :282`<br>• `-act:273`<br>• `-nt:284` | Replace with: "An extra $20,000 on the price covers the $1,600 gap between a 1.8% and a 2% quote on $800,000 more than twelve times, so compare agents on results before rates." |
| 0.5 | **Wrong cooling-off statement** | **The live line:** "In most states, you have a short cooling-off period (often 1 to 3 days) after signing an agency agreement."<br><br>**Our sourced agency-agreements guide says otherwise:** NSW gives a cooling-off period until 5 pm on the next business day (PSAA s 59), and Victoria and WA give none. The NSW cost guide says "NSW is the only state that gives the seller a cooling-off period on the agency agreement". | `real-estate-agent-fees-australia/page.tsx:336-338` | Align with `/guides/real-estate-agency-agreements-by-state` and link to it: "NSW gives you until 5 pm on the next business day after signing to cancel; Victoria and WA give no cooling-off, so read the agreement before you sign." |
| 0.6 | **GST is missing or mislabelled** | **(a) The fees guide never mentions GST.** Its worked figure ("On a $900,000 home sold at a 2% commission rate, the agent earns $18,000") has no "plus GST".<br><br>**(b) The commission calculator leaves GST out of the total and the net proceeds.** The selling costs calculator adds 10% by default. So the same sale gives two different net figures, and the commission calculator is the one embedded on all 8 state guides.<br><br>**(c) "All-in" totals leave out GST.** The live NSW cost guide says "Selling an $800,000 house in New South Wales typically costs $17,500 to $32,700 all-in", but that table leaves out GST on commission. Google shows this sentence as the snippet.<br><br>**(d) An unsourced claim:** the selling costs calculator FAQ says agents "most quote their rate excluding GST", while the NSW guide says "quotes vary". | **(a)** `real-estate-agent-fees-australia/page.tsx:139-141`<br><br>**(b)** `src/components/calculators/CommissionCalculator.tsx:47-50` against `SellingCostsCalculator.tsx:84-87`<br><br>**(c)** `src/components/guide/CostOfSellingStateGuide.tsx:63`<br><br>**(d)** `src/app/(marketing)/selling-costs-calculator/page.tsx:44` | Add the GST toggle (default "add 10%") to `CommissionCalculator`. Write "before GST on commission" instead of "all-in", or add the GST. Add a GST section to the fees guide citing the ATO (GST on a registered agent's commission, 10%). |
| 0.7 | **Two different totals on every state cost guide** | The TL;DR, computed from the table, and the FAQ, hand-written and also in the FAQPage JSON-LD, disagree. See the table below. | `src/lib/data/cost-of-selling-state.ts:89, 146, 203, 260, 317, 368, 425, 476` | Build the FAQ answer from `sellingCostTable()` so it cannot drift. |
| 0.8 | **Unsourced superlatives and claims** | **Superlatives:**<br>• "Victoria has the cheapest agent commission in Australia"<br>• "Melbourne metro the cheapest market in the country"<br>• "TAS ... the highest typical rates in Australia"<br>• "Tasmania has the highest typical commission in Australia"<br><br>**Unsourced claims:**<br>• "The gap between a strong negotiator and a weak one is routinely ten times that"<br>• "A $4,000 campaign sells most suburban houses"<br>• "Higher-value properties (above $2M) often achieve commission rates below 1.5%" | **Superlatives:** `cost-of-selling-state.ts:109, :337`; `real-estate-commission-calculator/page.tsx:104, :108`<br><br>**Claims:**<br>• "ten times that": `real-estate-commission-calculator/page.tsx:117-119`<br>• "$4,000 campaign": `CostOfSellingStateGuide.tsx:146`<br>• "above $2M": `real-estate-agent-fees-australia/page.tsx:50` | Cut these, or source them once 0.1 lands. Rank claims ("cheapest", "highest") need the sourced table behind them. |
| 0.9 | **"Accurate value" wording** (on the prohibited list) | The related card "Get an accurate value before you list." and the step "Get an accurate value." | **Related card:** `real-estate-commission-{nsw,vic,qld,sa,wa,tas,act}/page.tsx:110`, `-nt:109`<br><br>**Next-steps text:** `-nsw:332`, `-act:324`, `-tas:330`, `-qld:333`, `-nt:340` | Replace with "Get a realistic price range before you list." |
| 0.10 | **The lead page that every MatchCTA on these guides points to** | **Saving promise:** "Fee negotiation that typically saves $1,700 to $3,400".<br><br>**"Top" with no criteria:** "pass your details to one top local agent".<br><br>**Unsourced claim:** "the gap between a strong and average agent ... runs five figures".<br><br>**Ranges that conflict with our own:** "Plan for 3 to 5 percent ... commission roughly 1.6 to 3 percent ... marketing $2,000 to $10,000".<br><br>The fee disclosure itself is present: "The agent pays us a fee for each introduction, whether or not you list with them." | **Saving promise:** `src/app/(marketing)/selling-guide/page.tsx:196`<br><br>**"Top" agent:** `selling-guide/page.tsx:58, :349`; `src/components/journey/GuideThanksExtras.tsx:56`<br><br>**"Five figures":** `selling-guide/page.tsx:53, :171`<br><br>**Ranges:** `selling-guide/page.tsx:68` | Show the saving as arithmetic: "0.2% on $850,000 is $1,700". Use the `/appraisal` wording ("one local agent who sells in your area"). Take the ranges from the shared data. |
| 0.11 | **The calculator FAQ makes claims about competitors** | **The FAQ "What do agent comparison websites charge?"** quotes referral fees taken from internal notes.<br><br>**Unsourced and disparaging:** it adds "Some top agents refuse to pay these fees, so platform shortlists don't always show the best agents".<br><br>**Undisclosed:** YPG also charges agents per lead, and the answer does not say so. | **The FAQ:** `real-estate-commission-calculator/page.tsx:66`<br><br>**The notes it draws on:** `docs/lead-gen-strategy.md:28-30` | Replace it with the PAA "How do you calculate a commission?" (see section 6). |
| 0.12 | **The how-to-sell guide's CGT advice is out of date** | The 50% discount is stated with no mention of the 1 July 2027 change that `/guides/cgt-changes-2026-budget` now carries (#95). The guide was last updated 13 May 2026. | `src/app/(marketing)/guides/how-to-sell-a-house-australia/page.tsx:438-444, :111` | Add one dated sentence and a link to the CGT guide. This page was not on #95's "still saying the old thing" list. |

**0.3 detail: one fact, many values**

| Figure | Values on live pages | Where |
|---|---|---|
| National commission range | • 1.5% to 3.5% (fees TL;DR)<br>• 1.5% to 3.0% (fees FAQ)<br>• 1.6% to 3.25% (calculator FAQ, SA PAA FAQ, agents pages)<br>• 1.6% to 3% (`/selling-guide`)<br>• 1.5% to 3% plus GST (how-to-sell) | • `real-estate-agent-fees-australia/page.tsx:49, :73`<br>• `real-estate-commission-calculator/page.tsx:41`<br>• `src/lib/data/commission-faqs.ts:30`<br>• `selling-guide/page.tsx:68`<br>• `how-to-sell-a-house-australia/page.tsx:96, :212` |
| State "averages" on the same page | The fees FAQ says "2.5% to 3.0% in QLD, WA, TAS and NT". The table on the same page has WA ~2.4%, NT ~2.5% and QLD ~2.5%. | `real-estate-agent-fees-australia/page.tsx:73` against `:173-177` |
| Marketing | • $3,000 to $6,000 (fees TL;DR, KeyFigure, FAQ)<br>• $2,000 to $8,000 (fees FAQ "doesn't sell", `selling-costs.ts`, cost guides)<br>• $2,000 to $10,000 (commission calculator, `/selling-guide`)<br>• $3,000 to $10,000 (how-to-sell) | • `real-estate-agent-fees-australia/page.tsx:51, :83, :248-251` against `:98`<br>• `src/lib/data/selling-costs.ts:41`<br>• `real-estate-commission-calculator/page.tsx:126-128`<br>• `how-to-sell-a-house-australia/page.tsx:96` |
| Total cost of selling | • 2% to 4% (national cost guide, selling calculator FAQ)<br>• 2.5% to 4% (how-to-sell)<br>• 3% to 5% (commission calculator, `/selling-guide`, GuideBandSwitcher)<br>• Our own table at $800,000 gives 2.0% to 4.8% ($15,900 VIC low to $38,600 TAS high, before GST on commission) | • `cost-of-selling-a-house-australia/page.tsx:60, :82, :175, :380`<br>• `selling-costs-calculator/page.tsx:39`<br>• `how-to-sell-a-house-australia/page.tsx:58`<br>• `real-estate-commission-calculator/page.tsx:126`<br>• `GuideBandSwitcher.tsx:20` |

**0.7 detail: TL;DR total against FAQ total on each state cost guide** (both labelled "all-in"; the TL;DR excludes GST on commission)

| State (example price) | TL;DR (computed) | FAQ (hand-written, in JSON-LD) |
|---|---|---|
| NSW ($800,000) | $17,500 to $32,700 | $19,000 to $32,000 |
| VIC ($800,000) | $15,900 to $32,900 | $17,000 to $32,000 |
| QLD ($800,000) | $21,400 to $36,000 | $22,000 to $36,000 |
| SA ($800,000) | $17,500 to $34,700 | $19,000 to $34,000 |
| WA ($600,000) | $14,900 to $29,300 | $16,000 to $29,000 |
| TAS ($600,000) | $18,000 to $32,100 | $18,000 to $31,000 |
| ACT ($800,000) | $18,000 to $31,600 | $19,000 to $31,000 |
| NT ($800,000) | $22,100 to $34,000 | $22,000 to $33,000 |

---

## 1. Where we match commercial intent (keep doing)

- **On Bing, page shape is proven** (90 days):

  | Page | Clicks | Impressions | Position |
  |---|---|---|---|
  | `/guides/real-estate-agent-fees-australia` | 94 | 2,371 | 3.9 |
  | `/guides/real-estate-commission-nsw` | 71 | 1,391 | 2.9 |
  | `/guides/cost-of-selling-a-house-australia` | 37 | 589 | 3.0 |
  | `/guides/real-estate-commission-qld` | 29 | 629 | 2.6 |
  | `/guides/real-estate-commission-vic` | 26 | 614 | 2.7 |
  | `/guides/real-estate-commission-wa` | 7 | 47 | 3.2 |

  That is about 265 Bing clicks against about 26 Google clicks for the whole vertical.

- **Clarity confirms the sessions engage** (90 days, organic):

  | Page | Sessions | Scroll | Active time |
  |---|---|---|---|
  | NSW commission guide | 85 | 32% | 144 s |
  | National fees guide (mostly Bing traffic, since Google gave it 1 click) | 82 | 44% | 117 s |
  | QLD commission guide (not indexed in Google, so this is Bing) | 46 | n/a | n/a |
  | National cost guide | 40 | 52% | 135 s |
  | Commission calculator | 23 | 56% | 164 s |

- **Half the site's live top-20 positions are here.** We hold 8 of the site's 16 top-20 placements (AU desktop, 10 Oct):

  | Query | Position | Page |
  |---|---|---|
  | real estate agent fees | 7 | VIC guide |
  | cost of selling a house nsw | 7 | NSW cost guide |
  | how much do real estate agents charge | 10 | NSW guide |
  | real estate commission nsw | 11 | calculator |
  | real estate commission | 13 | NSW guide |
  | real estate agent commission | 15 | VIC guide |
  | real estate selling fees | 16 | NSW guide |
  | cost of selling a house vic | 16 | VIC commission guide |

  The AI Overview cites us on 3 of the site's 6 citations: "real estate agent fees" and "how much do real estate agents charge" (VIC guide), and "cost of selling a house nsw" (NSW cost and commission guides).

- **Commercial impressions per day are up** (83 days before against 7 days after the deploy):
  - Selling: 11.5 to 82.0 a day, position 53.0 to 33.8.
  - Commission: 24.4 to 62.1 a day, position 53.4 to 45.4.

- **The state cost guides already match their queries.** They launched on 20 Sep and were all crawled on 1 Oct. Since the deploy they have 1,207 impressions: NSW 355 at 19.1, QLD 238, WA 198, VIC 168, SA 114, ACT 56, TAS 54 at 12.5, NT 24 at 8.8. State-qualified cost queries land on the right page (126 impressions at 19.6), for example "cost of selling a house in qld" (30 at 21.9), "in tasmania" (8 at 8.0) and "in south australia" (5 at 7.8). On "cost of selling a house" (720 a month) we hold 90% impression share at 13.8.
- **The state commission guides match the SERP format since #81.** Each now has a calculator, the capital city in the title, two tables and six FAQs: the same pattern as WhichRealEstateAgent's "Brisbane Real Estate Agent Fees [2026 Guide] + Fee Calculator". Too early to read: only NSW (2 Oct) and TAS (9 Oct) have been recrawled.
- **"Sell my house {suburb}" queries land on the agents pages near the top:** queanbeyan at 2.5, hawkesbury at 5.2, strathmore at 11.0, goodna at 14.9; "sell my house canberra" lands on the ACT cost guide at 2.7. These are the right pages: they carry the match form. But Goodna, Hawkesbury Heights and Queanbeyan answer `noindex, follow` because their medians are withheld, so these positions will go once Google recrawls. That depends on the label repair the lead owns.
- **Our commission data already earns a link.** The One Group Realty citation and link (see 0.1) show the data is a link asset. Sourcing it (0.1) makes it citable by AI Overviews too.

---

## 2. Where we miss, by query type

Read Bing against Google first. The same guides sit at 2.6 to 3.9 on Bing and at 25 to 45 on Google (90 days: VIC 39.2, NSW 30.3, fees 42.0, national cost 63.4).

**The gap is authority and crawl, not page shape.**
- **Authority:** we have 58 referring domains, none ranked 100+. OpenAgent has 2,080, LocalAgentFinder 783 and WhichRealEstateAgent 530.
- **Crawl:** Google last crawled the fees guide on 20 Aug, the national cost guide 3 Jul, QLD 17 Jun (not indexed), SA 10 Jul (not indexed), ACT 17 Jun, WA 4 Jul, NT 16 Aug and VIC 24 Sep.

So on-page changes below are limited to gaps measured against the top 5. Several of these SERPs are not locked by big domains. Small pages rank, which makes them winnable after a recrawl:
- "fees for selling a house": titlespace at 1 and York Realty at 3 (690 words)
- "real estate agent commission": Ian Reid at 3 (746 words)
- "how much do real estate agents charge": Levy Property Group at 2
- "real estate commission nsw": apartments.com.au (328 words) and a 2023 Localsearch page

| Query type | Demand (KP / AI) | Since deploy (impressions, position, landing) | What the top 5 reward | Our landing against that | Verdict |
|---|---|---|---|---|---|
| **National agent fees and commission** | real estate agent commission 1,300 / 271<br>real estate agent fees 1,000 / 75<br>real estate commission 720 / 457<br>how much do real estate agents charge 480 / 14<br>real estate selling fees 260 / 0 | **491 at 44.6:**<br>• VIC guide 45%<br>• NSW guide 44%<br>• national guide 0% | **Format:** a state-by-state table (3 of 5 for "agent fees"). The AI Overview answers all four head terms with a by-state table and "plus 10% GST".<br><br>**Tool:** a calculator (2 to 3 of 5).<br><br>**Title:** "2026" (3 of 5).<br><br>**Length:** median 1,370 to 2,635 words; FAQ schema 1 to 3 of 5. | **Google's choice:** the VIC and NSW guides. They are state-scoped, but they carry the tool and the dollar tables.<br><br>**Our national guide:** 2,132 words, 1 table, **no calculator, no GST, no source**, last crawled 20 Aug. | Make the national guide the best national answer (P1), then recrawl it. |
| **State commission** | qld 590 / 72<br>nsw 320 / 14<br>agent fees nsw 140 / 12<br>brisbane 50, wa 50, tas 30, sydney 30, perth 20, melbourne 20 | **129 at 32.8:**<br>• NSW guide 66%<br>• calculator 19% | **Title:** state plus capital city plus "Fee Calculator" (WhichRealEstateAgent, Unreserved).<br><br>**Content:** FAQ (4 of 5 for brisbane); regulator pages (nsw.gov.au agency agreements at 4 for "agent fees nsw"; CAV at 3 for melbourne). | **Format matches since #81.**<br><br>**QLD and SA are not indexed.** "Real estate commission wa" is a Washington State SERP (its AI Overview quotes US 5.22%), so WA demand is on "perth". | Request indexing (P3), fix sources (0.1), add regulator links. |
| **Commission calculator** | real estate commission calculator 590 / 71 | **63 at 48.6:**<br>• calculator 46%<br>• selling costs calculator 29%<br>• NSW guide 16% | **Tables:** 4 of 5 (realestate.com.au has 8; WhichRealEstateAgent Perth 2).<br><br>**Tool:** 3 of 5. | Tool yes, **0 tables**, GST left out of the net. | Add a server-rendered table (P4). |
| **National cost of selling** | cost of selling a house 720 / 39<br>fees for selling a house 320 / 465<br>selling fees AI 767<br>fees when selling a house AI 133 | **571 at 28.5:**<br>• NSW cost guide 41%<br>• QLD 17%<br>• selling costs calculator 13%<br>• WA 10%<br>• ACT 7%<br>• VIC 6%<br>• national guide about 0% | **Format:** bank-style articles with one H2 per cost line carrying a dollar range (Canstar: "Marketing a home for sale: $400 to $10,000"), plus a state-by-state section (realestate.com.au, Hunter Galloway).<br><br>**Tool:** 1 of 5 (0 of 5 for "fees for selling a house"). | **Our national guide:** 13 H2s, one per line, **no dollar figure anywhere.** Its "worked example" table reads "A few thousand dollars". Last crawled 3 Jul. | Put the figures in (P2), then recrawl. |
| **State cost of selling** | cost of selling a house qld 170, wa 40, nsw 30, sa 10 | 126 at 19.6, right pages | Bank and agency articles | Matched | Keep. Too early. |
| **Selling cost calculator** | house selling costs calculator 140 / 0<br>selling costs calculator 70 / 3 | **168 at 42.0:**<br>• selling costs calculator 55%<br>• VIC cost guide 26% | **Tool:** 1 to 3 of 5.<br><br>**Tables:** 0 to 2 of 5. | **Before the deploy:** the page ranked 5 to 13 on several national cost queries (90-day GSC: "costs to sell house" 5.4, "selling a house costs" 7.3).<br><br>**Since the deploy:** page average 49.1. It has only 13 in-content inlinks. | Add a table and links (P6). |
| **How to sell** | how to sell a house 170 / 1,842<br>selling a house 140 / 9,620 (CPC $26.92)<br>how to sell my house 170 (CPC $34.27)<br>selling your house 110 (CPC $52.70) | how-to-sell guide 12 impressions at 62.4 (90 days: 959 at 69.3) | **Who ranks:** government step pages (NSW Government, Queensland Government, CAV checklist), REIQ "Eight steps", AMP "9 steps".<br><br>**Titles:** "steps" in 3 of 5.<br><br>**Content:** contract before advertising, cooling-off, reserve price. | **Our guide:** 3,111 words, HowTo schema. It lacks the per-state "before you advertise" rules and the cooling-off table. Last crawled 16 Jul. | Authority-limited (government and REI). Do the small fixes in P8 and request indexing. Don't expect much. |
| **Sell privately** | sell house privately 480 / 253 | about 0 since deploy (90 days: 62 at 33.6) | **Length:** median 2,715 words (Unreserved 5,045, PropertyNow 3,804).<br><br>**Tables:** 2 of 5.<br><br>**FAQ:** 1 of 5 (Unreserved has 10). | **Our guide:** 2,202 words, 0 tables, **no FAQ schema**. It has **5 in-content inlinks**. | P7 |
| **Fixed and low fee** | flat fee real estate agent 40 (CPC $21.74)<br>fixed fee real estate agent 30 | **38 at 57.3:**<br>• fixed-fee guide 42%<br>• NSW 29%<br>• VIC 21% | Agency pages ("Low Commission Real Estate Perth"), WhichRealEstateAgent; tables 2 of 5 | **Our guide:** good, but **no FAQ schema**, and the fees guide's "Fixed fee vs commission" H2 doesn't link to it. | P9 |

---

## 3. Page-by-page gap and fix list

Ranked by demand times winnability. "Best" means the top-ranked parsed rival.

### P1. `/guides/real-estate-agent-fees-australia` (national agent fees family, about 3,760 KP a month, 817 AI)

| | Ours | Rival median ("agent fees" / "agent commission") | Best (1st: WhichRealEstateAgent fee structures) |
|---|---|---|---|
| Words | 2,132 | 1,370 / 2,635 | 1,703 |
| H2s | 11 | 6 / 4 | 6 |
| Tables | 1 (9 rows, no source) | 3 of 5 / 2 of 5 | 1 |
| Tool | none | 2 of 5 / 3 of 5 | 16 inputs |
| Schema | Article, FAQPage, Speakable | FAQ schema 2 of 5 / 1 of 5 | FAQPage |
| FAQ | 6 | n/a | 3 |
| Author | YPG editorial, reviewed by A. McMaster | 2 of 5 | none |
| Query in slug / title / H1 / intro | yes / yes / yes / 0.8 | 2/5 / 2/5 / 1/5 / 0/5 | no / no / no / partial |

**Title, H1, intro**

- **Title** (56 characters before the " \| Your Property Guide" suffix): **Real Estate Agent Fees & Commission 2026: Rates by State**. Make this change together with the calculator, following the #84 pattern. "Real estate agent fees" stays first to protect the 3.9 position on Bing.
- **H1:** **Real Estate Agent Fees and Commission in Australia (2026): Rates by State, With Calculator**
- **First sentence:** "No state sets real estate commission: it is whatever you and the agent write into the agency agreement. Agents typically quote 1.6% to 3.25% of the sale price plus GST, depending on the state and on city or regional; on an $800,000 sale at 2% that is $16,000, or $17,600 with GST."
  - Source for the rule: NSW Government, Agency agreements.
  - Source for the range: as sourced and dated in 0.1.

**H2s to add**
- **"Real estate agent fees calculator".** Put it first, under the TL;DR. LocalAgentFinder's calculator ranks 2 for "agent fees" and 4 for "real estate commission".
- **"Commission by state in dollars (2026)".** Extend the existing table to these columns: capital city range, regional range, typical, dollars at $800,000 excluding and including GST, source and date. Rivals' versions: One Group "What Commission Looks Like in Dollars"; realestate.com.au "state by state guide for 2026".
- **"Does commission include GST?"** (PropertyNow "GST, and when you actually pay")
- **"When do you pay commission?"** (One Group, Top10)
- **"Why city and regional rates differ"** (One Group "Why Commission Differs Between Suburbs"; the AI Overview's metro and regional split)
- **"Commission vs selling privately"** (One Group), linking to the sell-privately guide

**PAA questions to answer**
- "Is 2% a good commission?" (58 AI)
- "Is 3% good for a realtor?" (missing on 3 SERPs)
- "Do estate agents charge a percentage?" (173 AI)
- "What percentage do most real estate agents take?" (66 AI, in body only)

**Schema:** keep Article and FAQPage, capped at six questions. Swap "Should I use a fixed-fee agent?" and "Can I negotiate commission rates?" (both covered by dedicated guides) for "Does commission include GST?" and "Is 2% a good commission?". The embed carries no WebApplication schema (the #81 rule).

**Tool:** a national variant of `CommissionCalculatorEmbed` with the state picker first, plus the GST toggle from 0.6.

**Internal links**
- **Current inlinks:** 141 in-content, of which 100 are from `/postcodes` (anchor "real estate agent fees", 113 times) and 23 from guides.
- **Links from the state guides:** they link to it only low on the page ("national agent fees guide", in "Commission vs your other selling costs"). Add one line directly under each state calculator: "Selling in another state? See [real estate agent fees in every state](/guides/real-estate-agent-fees-australia)."
- **Outbound links to add** (none exist today):

  | Section | Link to | Anchor |
  |---|---|---|
  | "Fixed fee vs commission" | `/guides/fixed-fee-vs-commission-real-estate-agents` | "fixed fee vs commission agents" |
  | Marketing | `/guides/cost-of-selling-a-house-australia` | "the full cost of selling a house" |
  | Marketing | `/selling-costs-calculator` | "selling costs calculator" |
  | Agreement | `/guides/real-estate-agency-agreements-by-state` | "agency agreements by state" |

**Consolidate:** cut "How to negotiate agent fees" and "The risk of choosing the cheapest agent" to a short summary linking `/guides/how-to-negotiate-real-estate-agent-commission`. That guide has been "crawled, currently not indexed" since 3 Jul, so request indexing for it too.

**Clarity:** 64 dead clicks (44 organic) on 82 sessions. Read the heatmap. If the clicks cluster on the rate table, the calculator answers them.

**Files**
- `src/app/(marketing)/guides/real-estate-agent-fees-australia/page.tsx`
- `src/components/guide/CommissionCalculatorEmbed.tsx`
- `src/components/calculators/CommissionCalculator.tsx`
- `src/lib/data/commission-rates.ts`
- `src/components/guide/GuideArticleLayout.tsx:226`

Then request indexing.

### P2. `/guides/cost-of-selling-a-house-australia` (about 1,040 KP a month; AI: selling fees 767, fees for selling a house 465)

| | Ours | Rival median ("cost of selling a house" / "fees for selling a house") | Best (1st: Westpac) |
|---|---|---|---|
| Words | 2,648 | 1,418 / 690 | 1,946 |
| H2s | 13 | 9 / 2 | 9 |
| Tables | 1 (no figures) | 1 of 5 / 1 of 5 | 0 |
| Tool | none (links to two) | 1 of 5 / 0 of 5 | none |
| FAQ schema | 6 | 2 of 5 / 2 of 5 | none |
| Author | YPG editorial | 2 of 5 / 4 of 5 | none |
| Query in title / H1 | yes / yes ("Every Fee", singular) | 0/5 / 0/5 | no |

**Title, H1, intro**

- **Title** (58 characters): **Cost of Selling a House in Australia (2026): Fees by State**
- **H1:** **The Cost of Selling a House in Australia (2026): Every Fee, State by State**
- **First sentence:** "Selling an $800,000 house in Australia typically costs $15,900 to $38,600 before GST on the commission, 2.0% to 4.8% of the price, depending on the state, the agent's rate and whether you auction or have a loan to discharge." Computed from `selling-costs.ts` as at September 2026.

**H2s to add**
- **A dollar range in every cost H2,** following Canstar: "Marketing and photography: $2,000 to $8,000", "Conveyancing and legal: $800 to $2,500", "Auctioneer: $400 to $1,200", "Mortgage discharge: $150 to $400".
- **"Cost of selling by state"** as a table: state, commission range, commission at $800,000, total low to high, and the state's pre-sale documents.
- **"Settlement adjustments: rates, water and strata"** (Hunter Galloway's "hidden costs" H2)
- **"Moving costs"** (Westpac, Hunter Galloway)
- **"The ATO clearance certificate"** (15% withholding since 1 January 2025)

**PAA questions to answer**
- "Who pays the most closing costs?" (missing on 4 SERPs; answer in Australian terms)
- "How to calculate selling costs?" (missing)
- "How much do you have to pay the government when you sell your house?" (in the body; promote it to an FAQ)

"What devalues a house the most?" (261 AI) is out of scope: link to `/guides/what-to-fix-before-selling-a-house`, which has been "crawled, currently not indexed" since 3 Jul.

**Schema:** give the FAQ "How much does it cost to sell a house in Australia?" its dollar range. The FAQ "What is the average real estate commission in Australia?" currently gives no number, so add the range.

**Tool:** none on the page; the SERPs reward an article. Put the selling costs calculator link in the first screen.

**Internal links**
- **Current inlinks:** 43 in-content (39 from guides; anchors "national cost of selling guide" 16, "the full cost of selling" 9).
- **Add:**
  - from the fees guide (see P1)
  - from the how-to-sell guide's "What it costs to sell" H2, which today links only to the fees guide, with the anchor "what it costs to sell a house"
  - from the `/selling` hub

**Consolidate:** merge "Cost of selling by state" (a list) and "A worked example" (a table with no figures) into one table built from `sellingCostTable()`.

**Files:** `src/app/(marketing)/guides/cost-of-selling-a-house-australia/page.tsx`, plus a national helper in `src/lib/data/selling-costs.ts`. Then request indexing.

### P3. `/guides/real-estate-commission-qld` (590 plus brisbane 50; AI 72)

| | Ours | Rival median ("qld" / "brisbane") | Best (QLD: REIQ "Protecting your commission"; Brisbane: WhichRealEstateAgent at 2) |
|---|---|---|---|
| Words | 2,799 | 696 / 1,928 | 1,655 / 3,133 |
| H2s | 10 | 3 / 8 | 5 / 10 |
| Tables | 2 (13 rows) | 1 of 5 / 3 of 5 | 0 / 1 |
| Tool | calculator | 1 of 5 / 3 of 5 | none / 18 inputs |
| FAQ schema | 6 | 0 of 5 / 4 of 5 | none / 6 |
| Index status | **crawled, currently not indexed** (17 Jun) | n/a | n/a |

**Title, H1, intro:** keep. #81 shipped the title "Real Estate Commission QLD 2026: Brisbane Rates, Fees & Calculator" and Google has not seen it yet.

**H2 to add:** "Why some Queensland agents still quote 5% on the first $18,000". WhichRealEstateAgent has "Queensland Real Estate Agent Fee Structure", and Top10 notes Queensland agencies "still quote a two-part scale". Explain the scale with the end of the maximum when the Property Occupations Act 2014 commenced on 1 December 2014, and the Form 6. Verify against REIQ's "no standard commission" article before publishing.

**PAA:** "What is the formula for calculating commission?" (missing). Skip "Is 70/30 a good commission split?" (agent-side).

**Sources:** replace the homepages with the Queensland Government "commissions and costs" page and REIQ's article. The QLD AI Overview cites both.

**Links:** 89 in-content inlinks (77 from suburb pages, "real estate agent fees, qld"). Enough.

**Action:** request indexing. Do SA the same day: also not indexed (10 Jul), 10 KP.

**File:** `src/app/(marketing)/guides/real-estate-commission-qld/page.tsx`

### P4. `/real-estate-commission-calculator` (590 KP, 71 AI)

| | Ours | Rival median | Best AU (2nd: WhichRealEstateAgent Perth) |
|---|---|---|---|
| Words | 1,028 | 1,109 | 3,427 |
| H2s | 5 | 3 | 11 |
| Tables | **0** | **4 of 5** | 2 |
| Tool | 6 inputs | 3 of 5 | 18 inputs |
| Schema | WebApplication, FAQPage | FAQ 1 of 5 | FAQPage |

**Title, H1, intro**
- **Title:** keep "Real Estate Commission Calculator Australia: Costs by State" (59).
- **H1:** keep "Real Estate Commission Calculator".
- **First sentence:** "Work out what an agent will cost on your sale: commission by state with GST, marketing, conveyancing and your net proceeds."

**H2s to add**
- **"Commission by state on an $800,000 sale".** Server-rendered, 8 rows: low, typical, high, and typical with GST, plus source and as-at. This follows the #85 precedent (the borrowing power table).
- **"How to calculate real estate commission".** The formula and a tiered example (PAA "How do you calculate a commission?" 44 AI; "What is the formula for calculating commission?").

**FAQ:** replace the comparison-sites answer (0.11) with "How do you calculate a commission?" and "Is 2% a good commission?".

**Tool:** add GST to the total and the net (0.6).

**Links:** it has 600 in-content inlinks ("commission calculator" 404, "work out your own sale" 190) and links nowhere to `/selling-costs-calculator`. Add "every selling cost, with net proceeds".

**Files**
- `src/app/(marketing)/real-estate-commission-calculator/page.tsx`
- `src/components/calculators/CommissionCalculator.tsx`
- `src/components/calculators/CalculatorPageLayout.tsx:152`

### P5. State commission guides as a template: NSW first (`/guides/real-estate-commission-nsw`, 320 + 140 + 30 KP)

| | Ours (NSW) | Rival median ("nsw" / "agent fees nsw") | Best ("agent fees nsw": 1st DiJones) |
|---|---|---|---|
| Words | 2,690 | 829 / 1,438 | 2,415 |
| H2s | 10 | 5 / 5 | 3 |
| Tables | 2 | 2 of 5 / 2 of 5 | 0 |
| Tool | calculator | 1 of 5 / 1 of 5 | none |
| FAQ schema | 6 | 1 of 5 | none |
| Query in title | yes / no ("agent fees nsw") | 1/5 / 0/5 | no |

**Status:** recrawled 2 Oct, so too early to read.

**Title, H1, intro:** no change. Positions 10 to 16 on national terms are Google testing, not a title problem. The #81 titles run 62 to 67 characters; leave them until there is data.

**H2 to add:** "What your agency agreement must say about commission". The NSW Government page "Agency agreements for the sale of property in NSW" ranks 4 for "real estate agent fees nsw", with the H2 "Commission, fees and expenses". Cover PSAA ss 55 and 59 in two short paragraphs and link to the agency-agreements guide. Do the same per state, from that guide's sourced rules.

**PAA**
- "Is 2% a good commission?" (58 AI; missing on this SERP)
- "Where can I file a complaint about a real estate agent in NSW?" (missing): link to `/guides/real-estate-agent-complaints-and-red-flags` (indexed 1 Oct; 90 days: 47 impressions at 13.2) with the anchor "complain about a real estate agent in NSW".

**On all eight state guides:**
- Make fixes 0.4 and 0.9.
- Replace the homepage sources with deep links:
  - NSW Government, agency agreements
  - CAV, "Authorities, rebates and commission" (ranks 3 for "real estate commission melbourne")
  - Queensland Government, commissions and costs
  - REIWA, agent fees FAQ
  - CBS SA
  - CBOS
  - Access Canberra
  - NT.gov
- Add the link-up line from P1.

**Files:** `src/app/(marketing)/guides/real-estate-commission-{nsw,vic,qld,sa,wa,tas,act,nt}/page.tsx`

### P6. `/selling-costs-calculator` (house selling costs calculator 140, selling costs calculator 70, plus variants)

| | Ours | Rival median ("house selling costs calculator" / "selling costs calculator") | Best (1st: OpenAgent) |
|---|---|---|---|
| Words | 1,231 | 384 / 482 | 1,442 |
| H2s | 8 | 2 / 4 | 18 |
| Tables | **0** | 0 of 5 / 2 of 5 | 0 |
| Tool | 11 inputs | 1 of 5 / 3 of 5 | JS tool |
| FAQ schema | 6 | 1 of 5 / 2 of 5 | FAQPage |

**Title, H1, intro**
- **Title** (55, optional; the current one is 70): **Selling Costs Calculator: Cost to Sell a House by State**
- **H1:** keep "Selling Costs Calculator".
- **First sentence:** keep.

**H2 to add:** "What it costs to sell an $800,000 house, by state". Server-rendered from `sellingCostTable()` (VIC $15,900 to $32,900 up to TAS $23,000 to $38,600, before GST on commission), with source and date.

**FAQ**
- Change "On an $800,000 sale that is roughly $17,000 to $36,000" to the computed $15,900 to $38,600.
- Add "How do I calculate the cost of selling a house?" (PAA "How to calculate selling costs?", 30 AI).

**Links:** only 13 in-content inlinks, all from the cost guides, `/bridging-loan-calculator` and `/property-valuation`. Add links from:
- the `/selling` hub, "Tools sellers actually use" (it links the commission calculator 3 times and this one 0 times)
- the fees guide
- the commission calculator

**File:** `src/app/(marketing)/selling-costs-calculator/page.tsx`

### P7. `/guides/sell-your-house-privately-australia` (480 KP, 253 AI, CPC $8.22)

| | Ours | Rival median | Best parsed (2nd: savings.com.au) |
|---|---|---|---|
| Words | 2,202 | 2,715 | 2,715 |
| H2s | 11 | 4 | 4 |
| Tables | **0** | 2 of 5 | 1 |
| FAQ schema | **0** | 1 of 5 (Unreserved has 10) | 0 |
| Author | Andy McMaster | 2 of 5 | Emma Duffy |
| In-content inlinks | **5** | n/a | n/a |

**Title, H1, intro**
- **Title** (52; the current one is 112 and truncates): **How to Sell Your House Privately in Australia (2026)**
- **H1:** keep the long form.
- **First sentence:** keep, with the exact figure: "Selling without an agent saves the commission, $14,400 to $20,000 on an $800,000 home at 1.8% to 2.5%, but not the legal work, the marketing or the negotiating."

**H2s and tables to add**
- Turn "What it costs, side by side" into a table.
- **"How much could you save?"** (savings.com.au, PropertyNow)
- **"Selling privately in your state"** (PropertyNow, Unreserved), built from `STATE_DOCUMENTS` with its sources

**PAA:** "What is the most common reason a property fails to sell?" (missing) and "Is it better to sell now or wait?" (missing).

**Schema:** add FAQPage to the blog-post template. This is a template change (one per fortnight) and it also fixes the fixed-fee, complaints, agency-agreements and underquoting guides, which render a "Frequently asked questions" H2 with no JSON-LD.

**Links:** add links from the fees guide, the national and state cost guides, `/selling` and the how-to-sell FAQ on FSBO, with the anchor "sell your house privately".

**Files:** `src/lib/data/blog-posts/sell-your-house-privately-australia.ts` and `src/app/(marketing)/guides/[slug]/page.tsx`

### P8. `/guides/how-to-sell-a-house-australia` (590 KP across four terms; AI 1,842 and 9,620)

| | Ours | Rival median ("how to sell a house" / "selling a house") | Best (1st: CAV checklist / NSW Government steps) |
|---|---|---|---|
| Words | 3,111 | 749 / 1,314 | 259 / 1,314 |
| H2s | 13 | 2 / 4 | 1 / 7 |
| Tables | 0 | 1 of 5 / 0 of 5 | 0 |
| Schema | HowTo, FAQPage | FAQ 0 of 5 | none |
| Query in title | "how to sell" yes; "selling a house" no | 2/5; 3/5 | n/a |

These SERPs belong to government and REI pages, so this is authority-limited.

**Title, H1, intro**
- **Title** (56): **How to Sell a House in Australia (2026): Steps and Costs**
- **H1:** keep.
- **First sentence:** answer-first, as in section 6, row "how to sell a house".

**H2s to add**
- **"Before you advertise: what each state requires"** (table from `STATE_DOCUMENTS`). The NSW Government page leads with "You must prepare a contract before advertising".
- **"Cooling-off periods by state"** (rivals' term, and the NSW Government H2)
- A link to the reserve price guide

**PAA:** "What is the most common reason a property fails to sell?" (missing).

**Also:** fix 0.12, link to the national cost guide, and request indexing (last crawled 16 Jul).

**File:** `src/app/(marketing)/guides/how-to-sell-a-house-australia/page.tsx`

### P9. `/guides/fixed-fee-vs-commission-real-estate-agents` (flat fee 40 and fixed fee 30 KP; CPCs $14 to $22)

| | Ours | Rival median | Best (1st: WhichRealEstateAgent fees and charges) |
|---|---|---|---|
| Words | 2,308 | 1,315 | 1,613 |
| Tables | 1 (break-even) | 2 of 5 | 0 |
| Tool | none | 2 of 5 | 16 inputs |
| FAQ schema | **0** (has an FAQ H2) | 1 of 5 | 3 |
| Exact query in title | no | 0 of 5 | n/a |

**Title, H1, intro**
- **Title** (49): **Fixed Fee vs Commission Real Estate Agents (2026)**
- **H1:** keep.
- **First sentence:** keep. It already gives "$3,000 to $10,000" against "1.6% to 3.25%", sourced once 0.1 lands.

**H2 to add:** "Low commission and flat fee agents: what you give up". Rivals: Heath Bassett "Low Commission Real Estate Perth", Gold Coast fees. GSC: "low commission real estate" 7 impressions at 73.7 and "flat fee commissions" 12 at 68.4.

**Schema:** FAQPage, from the template fix in P7.

**Links:** 12 in-content inlinks today. Add one from the fees guide's "Fixed fee vs commission" section. The fees guide covers the same topic in 20 lines and doesn't link here.

**File:** `src/lib/data/blog-posts/fixed-fee-vs-commission-real-estate-agents.ts`

### P10. `/guides/real-estate-commission-vic` (Google's de facto national page)

| | Ours | Rival median ("average real estate agent commission victoria") | Best (1st: WhichRealEstateAgent Melbourne) |
|---|---|---|---|
| Words | 2,546 | 1,193 | 2,969 |
| Tables | 2 | 2 of 5 | 0 |
| Tool | calculator | 1 of 5 | 18 inputs |
| FAQ schema | 6 | 2 of 5 | 6 |

**Why it matters:** it takes 45% of national-family impressions. The AI Overview cites it twice. It is at 7 for "real estate agent fees" with Google still showing the pre-#81 title "Real Estate Commission VIC: Average Rates & Agent Fees". Its last crawl was 24 Sep.

**Title, H1, intro:** keep the #81 title.

**Fixes:** 0.4 (`:282`), 0.9 (`:110`), and the CAV sources deep link.

**Request indexing** on the same day as P1. Once Google sees the Melbourne title, VIC may lose national positions before the fees guide gains them. Accept that: VIC had 5 Google clicks in 90 days.

**File:** `src/app/(marketing)/guides/real-estate-commission-vic/page.tsx`

**Not in the ten, indexing only** (all in the lead's `request-indexing.csv`):
- `/guides/home-staging-cost-australia` (260 KP / 85 AI): "crawled, currently not indexed" since 3 Jul
- `/guides/how-to-choose-a-selling-agent`: 13 Jul
- `/guides/how-to-negotiate-real-estate-agent-commission`: 3 Jul
- `/guides/real-estate-commission-sa`: 10 Jul

---

## 4. Cannibalisation: who owns which family

| Family (KP / AI) | Since deploy: impressions and where they land | Owner | Role of the other pages |
|---|---|---|---|
| **National agent fees and commission**<br>agent commission 1,300 / 271<br>agent fees 1,000 / 75<br>real estate commission 720 / 457<br>how much do agents charge 480 / 14<br>selling fees 260 / 0 | **491 at 44.6:**<br>• VIC 45%<br>• NSW 44%<br>• national guide 0% | `/guides/real-estate-agent-fees-australia` | State guides answer in-state and localised searches, and link up. |
| **State commission**<br>qld 590, nsw 320, agent fees nsw 140, brisbane 50, wa 50, tas 30, sydney 30 | **129 at 32.8:**<br>• NSW 66%<br>• calculator 19% | `/guides/real-estate-commission-{state}` | The calculator links down to them (it already does). |
| **Commission calculator** (590 / 71) | **63 at 48.6:**<br>• calculator 46%<br>• selling costs calculator 29%<br>• NSW 16% | `/real-estate-commission-calculator` | State guides embed it with no schema (as now). |
| **National cost of selling**<br>720 / 39 and 320 / 465; selling fees AI 767 | **571 at 28.5:**<br>• state cost guides about 81%<br>• selling costs calculator 13%<br>• national guide about 0% | `/guides/cost-of-selling-a-house-australia` | State cost guides serve localised searches. |
| **State cost of selling** (qld 170, wa 40, nsw 30) | 126 at 19.6, right pages | `/guides/cost-of-selling-a-house-{state}` | n/a |
| **Selling cost calculator** (140 / 0 and 70 / 3) | **168 at 42.0:**<br>• calculator 55%<br>• VIC cost guide 26% | `/selling-costs-calculator` | State cost guides embed it. |
| **How to sell** (590 KP; AI 11,462) | how-to-sell guide, 12 at 62.4 | `/guides/how-to-sell-a-house-australia` | `/selling` hub |
| **Sell privately** (480 / 253) | about 0 | `/guides/sell-your-house-privately-australia` | n/a |
| **Fixed or low fee** (70 KP) | **38 at 57.3:**<br>• fixed-fee guide 42%<br>• NSW and VIC 50% | `/guides/fixed-fee-vs-commission-real-estate-agents` | The fees guide links to it. |
| **"average buyers agent fee"** and similar | land on the NSW commission guide at 51.6 | `/guides/buyers-agent-cost-australia` | Left to the buyer's agent pack. |
| **"sell my house {suburb}"** | agents pages at 2.5 to 15; 3 of 5 answer noindex | `/suburbs/{slug}/agents` | Depends on the NSW and QLD label repair. |

**How to stop the split without changing URLs**

1. **No canonical, noindex or URL change.** The state guides have their own demand (QLD 590, NSW 460), and Google localises national searches on mobile. "Cost of selling a house" shows us at 9 on Sydney mobile only. Brisbane mobile shows Queensland pages (carterandcarter.au), and there is nothing for us on desktop. A state guide winning an in-state search is fine.
2. **Titles and H1s carry the scope.** The state guides already carry the state and capital city (#81 and the cost guides from launch). Don't strip "fees" from them. The national guides take "by State" in the title (P1, P2), so the hierarchy reads in the SERP.
3. **The first sentence states the scope.** The national pages lead with the national range and "no state sets it". The state pages already lead with the state.
4. **Internal links already split by state; add the upward link.**
   - **Already right:** `src/components/suburb/SuburbContextualLinks.tsx:65` sends "Real estate agent fees, {STATE}" to the state guide. Postcodes send "real estate agent fees" to the national guide. Agents pages send "Commission in {State}, explained" to the state guide.
   - **Missing:** an upward link high on each state page. Add the one-line block under each state calculator (P1).
   - **Also missing:** national-to-national links. The fees guide doesn't link to the national cost guide, the selling costs calculator or the fixed-fee guide. The `/selling` hub doesn't link to the selling costs calculator or the sell-privately guide.
5. **Recrawl together.** On the day P1 and P2 deploy, request indexing for the fees guide, the national cost guide and VIC. All three are in `request-indexing.csv`.
6. **Measure around 7 Nov.** Track the share of no-state-modifier impressions landing on the two national guides (today 0 of 491 and 0 of 571), with Bing positions as the control (fees 3.9, cost 3.0). If the national guides gain nothing while the state guides lose, revisit before touching anything else.

---

## 5. New pages or tools worth building

No new URLs. The demand is covered by existing pages, and the gaps are tools, tables and data.

| Build | Demand | SERP format it needs |
|---|---|---|
| National calculator embed on the fees guide (P1) | about 3,760 KP, 817 AI | Calculator plus state table: 2 to 3 of 5 tools, 3 of 5 tables on the agent-fee SERPs; LocalAgentFinder's calculator ranks on three of them |
| Server-rendered commission-by-state table and GST in the net on the commission calculator (P4) | 590 KP, 71 AI | Tables 4 of 5 |
| State cost table on the selling costs calculator (P6) | 210 KP plus variants | Tool plus figures |
| **Capital-city and regional commission data per state** (tracker 9, open). Feeds the 8 state guides, the national table, the agents pages' "What agents charge in {suburb}" and the calculator presets. | brisbane 50, sydney 30, perth 20, melbourne 20; GSC regional variants ("commission on selling a house brighton", "low commission real estate gladstone") | WhichRealEstateAgent city pages ("[City] Real Estate Agent Fees [2026 Guide] + Fee Calculator"); iREC regional H2s (Melbourne, Central Victoria, Gippsland) |
| FAQPage JSON-LD on the blog-post template | sell privately 480 / 253; agency agreement 210; underquoting 260 / 76; the complaints PAA (232 AI on 8 SERPs) | FAQ schema on 1 to 2 of 5 rivals; makes the existing FAQ sections eligible |

Not worth building now:
- **A buy-and-sell costs calculator:** 5 GSC impressions at 78, and its SERP is lender widgets.
- **City commission pages:** the state guides took the capital-city titles on 30 Sep. Too early to read.

---

## 6. AI search: unanswered questions, answer-first copy

Each answer is under 60 words and includes one sourced, dated figure. The commission ranges inside them depend on 0.1 being sourced.

| Question (AI volume, where it shows) | Page | Proposed copy | Sourced, dated figure |
|---|---|---|---|
| "What percentage do most estate agents charge?" (172); "Do estate agents charge a percentage?" (173); "What percentage do most realtors charge?" (130) | Fees guide FAQ | "Most Australian agents charge a percentage of the sale price, typically 1.6% to 3.25% depending on the state, with about 2% common in Sydney, Melbourne, Adelaide and Canberra. GST of 10% is added if the quote excludes it, so 2% on $800,000 is $16,000, or $17,600 with GST. No state sets the rate." | GST 10% (ATO; in force since 1 July 2000) |
| "How do you calculate a commission?" (44); "What is the formula for calculating commission?"; "How to calculate commission on sale of house" (8) | Commission calculator FAQ; QLD and NT guides | "Multiply the sale price by the agreed rate, then add 10% GST if the quote excludes it. $800,000 at 2% is $16,000, plus $1,600 GST, $17,600 in total. On a tiered agreement, apply each rate only to its slice of the price. GST has applied to commission since 1 July 2000 (ATO)." | GST since 1 July 2000 (ATO) |
| "Is 2% a good commission?" (58); "Is 3% commission a lot?" (21); "Is 3% good for a realtor?" (3 SERPs) | Fees guide; NSW guide | "2% is mid-range in New South Wales, Victoria, South Australia and the ACT, and below what most Queensland, Tasmanian and Territory agents quote. 3% is above the typical range everywhere except Tasmania. Judge a quote in dollars: on $800,000 each 0.1% is $800, plus 10% GST." | GST 10% (ATO) |
| "selling fees" (767); "fees for selling a house" (465); "fees when selling a house" (133) | National cost guide lead | "Selling a house means paying the agent's commission (typically 1.6% to 3.25% plus GST), marketing, conveyancing, your state's pre-sale documents, and an auctioneer or mortgage discharge fee if they apply. Since 1 January 2025 every seller also needs an ATO clearance certificate, or the buyer must withhold 15% of the price." | 15% withholding from 1 January 2025 (ATO, foreign resident capital gains withholding) |
| "Who pays the most closing costs?" (missing on 4 SERPs) | National cost guide FAQ | "In Australia the buyer pays the biggest settlement cost, stamp duty, plus the transfer registration; the seller pays the agent's commission and marketing, their own conveyancer and any mortgage discharge fee. Rates, water and strata levies are split to the settlement date. Without an ATO clearance certificate, the buyer withholds 15% of the price." | Same ATO figure |
| "sell house privately" (253); "How do I sell my house without an agent in Australia?" | Sell-privately lead | "You can sell without an agent in every state. You list through a for-sale-by-owner service, run the inspections and negotiate yourself, and pay a conveyancer to prepare the contract or vendor disclosure before you advertise. In Queensland that includes the seller disclosure statement, required since 1 August 2025." | Queensland Government, seller disclosure scheme (1 August 2025) |
| "how to sell a house" (1,842); "selling a house" (9,620) | How-to-sell lead | "Selling a house in Australia runs in five steps: get appraisals and appoint one agent in writing, have the contract or vendor disclosure prepared before advertising, market the home and take offers, exchange contracts, then settle. In NSW you can cancel the agency agreement until 5 pm on the next business day after signing." | Property and Stock Agents Act 2002 (NSW) s 59, as cited in our agency-agreements guide |
| "What is the standard real estate commission in QLD?" (9); QLD AI Overview | QLD guide | "Queensland has had no maximum commission since the Property Occupations Act 2014 commenced on 1 December 2014: the rate is whatever the Form 6 appointment says. Agents typically quote 2.3% to 2.9% plus GST, so 2.5% on $800,000 is $20,000, or $22,000 with GST." | Property Occupations Act 2014 (Qld), commenced 1 December 2014. Verify the date against the Queensland Government page. |
| "What is the most common complaint filed against realtors?" (232, on 8 commission SERPs) | Complaints guide | No answer proposed: we have no dated regulator statistic on file. Link to the complaints guide from the state commission guides (P5) and add FAQPage to it (P7). Write the answer once a regulator complaint-category figure is found. | n/a |

---

## 7. Status of the previous review's items in this vertical

| Item | Status | Evidence |
|---|---|---|
| 3.2 of the 5 Sep plan / tracker 8: commission calculator on the seven remaining state guides, plus capital-city titles (#81, 30 Sep) | **Shipped. Too early to read.** | **Recrawled after #81:** NSW (2 Oct) and TAS (9 Oct) only.<br><br>**Not yet recrawled:** VIC 24 Sep (SERP still shows the old title), WA 4 Jul, ACT 17 Jun, QLD 17 Jun and SA 10 Jul (both not indexed). The NT pilot (8 Sep) was last crawled 16 Aug, so Google has never seen its calculator.<br><br>**NT Bing read** (the tracker said 22 Sep): 2 clicks on 5 impressions in 90 days. No signal. |
| National fees guide PAA "Do real estate agents get paid if the house doesn't sell?" (#81) | **Shipped. Not seen by Google** (last crawl 20 Aug). | n/a |
| Cost of selling (30 Sep: "nothing to add beyond links") | **Reopen** | Since the deploy, the national cost guide has 2 impressions at 82.5 and 0% of the 571 national-family impressions. Its worked example has no figures (P2). |
| Tracker 9: regional rate table per state, sourced and dated | **Open** | It is now the fix for 0.1. |
| Tracker 10: "What it costs to sell in {State}" table (#21, 8 Sep) | **Shipped** | Its totals drift from the cost guides' FAQ (0.7), and "all-in" leaves out GST (0.6). |
| Tracker 11: seller-funnel links | **Open in the tracker, mostly live in code** | **Live:** `SuburbContextualLinks.tsx:65` (state-labelled anchor to the state guide) and `suburbs/[slug]/agents/page.tsx:169` ("Commission in {State}, explained").<br><br>**Points elsewhere:** "Thinking of selling in {suburb}?" goes to `/selling-guide`, not the state guide.<br><br>**Recommendation:** close it, or rescope it to the `/selling` hub links in section 4. |
| Tracker 12: one PAA per state guide (8 Sep) | **Shipped** | The complaints PAA was left out as off-topic. It now shows on 8 commission SERPs with 232 AI volume. Link to the complaints guide rather than adding a seventh FAQ. |
| Content gap 10: eight state cost guides and `/selling-costs-calculator` (20 Sep) | **Shipped. Working.** | 1,207 impressions since the deploy. The NSW guide is at 7 live and cited by the AI Overview. |
| Request indexing (1 Oct change log: Search Console UI only) | **Open** | The lead's `request-indexing.csv` covers the fees guide, the national cost guide, QLD, SA, VIC, WA, ACT, NT, the selling costs calculator, sell privately, how to sell, the negotiation guide and how-to-choose. Do P1, P2 and VIC on the same day after deploy. |
