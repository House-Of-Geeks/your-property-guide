# Search and conversion baseline, 20 October 2026

Twelve existing pages that cover selling costs, agent fees and commission, choosing and comparing agents, first home buyer costs and schemes, the stamp duty and borrowing tools, and buying and selling timing. For each: the query cluster it is actually shown for, the baseline before this pass, the searcher's intent, the conversion that fits it, and what changed on 20 October. It also records the check of the /selling hub's strong claims (Task 1), which is logged claim by claim in `CONTENT_FLAGS.md` under "Selling hub claims".

No ranking or traffic claim is made here for the changes: they are unmeasured until Google recrawls the pages. Re-read on the dates in "Re-measure".

## Data used

| Source | File | Window | What it gives |
|---|---|---|---|
| Search Console, page | `docs/seo-baselines/2026-09-30/gsc-90d-page.csv` | 30 Jun to 27 Sep 2026 (90 days) | Impressions, clicks, CTR and average position by page. The latest page-level export in the repo. |
| Search Console, query × page | `docs/seo-baselines/2026-09-30/gsc-90d-query-page.csv` | 30 Jun to 27 Sep 2026 | The queries each page was shown for. Google anonymises rare queries, so these sum to less than the page total. |
| Search Console, target queries | `docs/seo/data/2026-10-10/compare.csv`, `gsc-intent-match.csv`, `request-indexing.csv` | 10 Jul to 7 Oct 2026; "since the deploy" is 1 to 7 Oct | Impressions and position for each target query, the page Google chose, and each page's 90-day impressions to 7 Oct. `docs/seo/` is untracked. |
| URL Inspection | `docs/seo/data/2026-10-10/index-status.csv` | 10 Oct 2026 | Index status and last crawl. |
| Live results | `docs/seo/data/2026-10-10/serp-summary.csv` | One desktop pull, AU, 10 Oct 2026, top 20 | Live rank and whether an AI Overview cites us. |
| Bing Webmaster | `docs/seo/data/2026-10-10/bing-page.csv` | Sampled rows to 7 Oct 2026 | Clicks, impressions and position by page. |
| Keyword Planner | `docs/seo/data/2026-10-10/kp-targets.csv` | 12-month averages to Aug 2026 | Monthly searches and CPC, AU. |
| Clarity | `docs/seo/commercial-intent-review-2026-10-10.md` §2.1 | 12 Jul to 9 Oct 2026 | Organic sessions for the two guides it names. |

Caveats:
- **There is no conversion data by landing page.** The site has no GA4 (commercial intent review, 0.1), so the "conversion" column is the action each page should lead to, not a measured rate. The baseline for conversions is "not measured".
- Search Console's average position counts only the searches where a page was shown. Position 60 to 90 means Google is testing the page deep in the results, not that it ranks there for most searches.
- Several pages were changed on 1 October and not recrawled before the 10 Oct pull, so part of the 90-day window describes older versions.

## The twelve pages

Baselines are Search Console, 30 Jun to 27 Sep 2026, unless marked. CTR is clicks divided by impressions.

| # | URL | Query cluster (from the data) | Baseline | Intent | Conversion that fits |
|---|---|---|---|---|---|
| 1 | `/selling` | selling my house, selling your house, selling a house, selling a home, house appraisal cost | 183 impr, 0 clicks, 0.0% CTR, pos 70.3 | Early-stage seller, learning | Selling guide (PDF by email) or next-step plan; appraisal introduction only if they ask |
| 2 | `/guides/cost-of-selling-a-house-australia` | cost of selling a house (720/mo), fees for selling a house (320), real estate charges to sell a house | 106 impr, 0 clicks, 0.0%, pos 62.8; Bing 37 clicks, 589 impr, pos 3.0 | Seller costing a sale | Selling costs calculator, then selling guide chapter 3; agreement check (the article's CTA) |
| 3 | `/selling-costs-calculator` | cost of selling house, house selling costs, cost to sell a house, real estate selling costs calculator (KP 140 + 70) | 155 impr, 0 clicks, 0.0%, pos 19.3 | Seller running numbers | Selling guide (inline start) and the agent proposal worksheet |
| 4 | `/guides/real-estate-agent-fees-australia` | real estate agent commission (1,300), real estate agent fees (1,000), how much do real estate agents charge (480), real estate selling fees (260) | 127 impr, 1 click, 0.8%, pos 43.7; Bing 94 clicks, 2,371 impr, pos 3.9 | Seller comparing fees | Agreement check (CTA) and agent proposal worksheet |
| 5 | `/real-estate-commission-calculator` | how much commission does a realtor make in australia, average commission NSW / Victoria, real estate fees calculator queensland; target "real estate commission calculator" (590) | 684 impr, 0 clicks, 0.0%, pos 70.3 | Seller running numbers | Selling guide (inline start); worksheet |
| 6 | `/guides/how-to-choose-a-selling-agent` | target "how to choose a real estate agent" (70/mo, $63.49 CPC) | No data: 0 impressions in both exports; crawled, not indexed (last crawl 13 Jul) | Seller choosing an agent | Agreement check (CTA) and worksheet |
| 7 | `/guides/questions-to-ask-a-real-estate-agent` | questions to ask real estate agent when buying, what to ask a real estate agent when buying | 25 impr, 0 clicks, 0.0%, pos 30.7; Bing 4 clicks, 10 impr, pos 4.0 | Mixed: the page is for sellers, the queries are buyers' | Agreement check for sellers; see notes |
| 8 | `/first-home-buyers` | first time home buyer mortgage interest rates, first time buyer mortgage, first home buyer australia; target "first home buyer schemes" (9,900) | 45 impr, 0 clicks, 0.0%, pos 78.1 | First home buyer, learning | Buying guide or next-step plan |
| 9 | `/stamp-duty-calculator` | how much is stamp duty wa (590/mo), qld stamp duty calculator first home buyer, stamp duty by state; target "stamp duty calculator" (60,500) | 337 impr, 0 clicks, 0.0%, pos 68.2; Bing 0 clicks, 58 impr, pos 8.2 | Buyer running numbers | Buying guide; affordability calculator; next-step plan |
| 10 | `/borrowing-power-calculator` | borrowing power calculator (33,100), how much can i borrow (12,100), how much can i borrow calculator, home loan borrowing calculator | 3,572 impr, 0 clicks, 0.0%, pos 59.8 | Buyer running numbers | Buying guide; pre-approval guide; next-step plan |
| 11 | `/guides/best-time-to-sell-a-house-australia` | target "best time to sell a house" (110); shown queries are scattered (selling a home in buyer market, best months to sell a house) | 84 impr, 0 clicks, 0.0%, pos 10.0; Bing 0 clicks, 6 impr | Seller deciding when | Selling plan (CTA); selling guide chapter 1 |
| 12 | `/guides/best-time-to-buy-property-australia` | best time to buy a house, best time of year to buy a house (one impression each) | 83 impr, 1 click, 1.2%, pos 11.7; Bing 1 click, 2 impr | Buyer deciding when | Buying plan (CTA); buying guide chapter 4 |

## Page notes

### 1. `/selling`
- **Baseline detail.** Top queries: selling my house 26 impressions at 75.3, selling your house 25 at 72.4, selling a house 23 at 90.9, selling a home 14 at 83.6, house appraisal cost 12 at 42.2. Keyword Planner: selling a house 140 a month ($26.92 CPC), selling your house 110. In the week after the 1 Oct deploy, 33 commercial queries (161 impressions) that should land on /selling landed on state commission and cost guides and suburb agents pages instead. Indexed; last crawled 17 Jul. No Bing row.
- **Changed.** The three strong claims (Task 1, below) and the other unsourced figures in the briefing and FAQs. The commission range now reads `commission-rates.ts`; the valuation cost cites Aussie and ANZ; days on market cites Cotality; the CGT answer adds the 1 July 2027 change. The tool list adds the selling costs calculator and the agent proposal worksheet. The appraisal card no longer says "independent", "vetted" or "one business day".

### 2. `/guides/cost-of-selling-a-house-australia`
- **Baseline detail.** 93 impressions in 10 Jul to 7 Oct. Google mostly shows the state guides for the national phrases: "cost of selling a house" 191 impressions at 13.9 on the NSW guide; "fees for selling a house" 73 at 12.9 on the ACT guide (56 at 10.5 in 1 to 7 Oct). Bing CTR 6.3%. Clarity: 40 organic sessions. Not in the live top 20 for either phrase on 10 Oct. Last crawled 3 Jul, before the 1 Oct changes.
- **Changed.** A direct answer opens the page: on an $800,000 sale, about $15,900 to $38,600 (2% to 4.8%) before GST on the commission, worked state by state from `commission-rates.ts` and `selling-costs.ts` (September 2026) and computed in the page so it can't drift. The worked example table now has dollar figures. Added the ATO clearance certificate (15% withholding without one, from 1 January 2025) and the CGT change from 1 July 2027, with sources. "The line most people overpay" became "the line most open to negotiation" (no source for the first). Links to the selling costs calculator up front and the worksheet in the next steps.

### 3. `/selling-costs-calculator`
- **Baseline detail.** 576 impressions in 10 Jul to 7 Oct; 16 queries (113 impressions) landed here in 1 to 7 Oct. Shown near the top for some phrases: selling a house costs at 4.1, costs to sell house at 3.9, real estate selling costs calculator at 1.8, all with no clicks. Not in the live top 20 for "selling costs calculator" or "house selling costs calculator".
- **Changed.** The FAQ's typed "$17,000 to $36,000" is now the computed $15,900 to $38,600, with the source date; the explainer opens with that answer and a link to the cost guide; worksheet added to related tools.

### 4. `/guides/real-estate-agent-fees-australia`
- **Baseline detail.** 144 impressions in 10 Jul to 7 Oct. The four head terms all land on `/guides/real-estate-commission-vic` (live 7 for "real estate agent fees", 15 for "real estate agent commission") or the NSW guide (10 for "how much do real estate agents charge"). The AI Overview cites us for "real estate agent fees" and "how much do real estate agents charge" (10 Oct). Bing is where this page works: 94 clicks at 3.9. Clarity: 82 organic sessions.
- **Changed.** The opening answer gives the range (1.6% to 3.25%, from `commission-rates.ts`) and a dollar example ($16,000 at 2% on $800,000; $17,600 with GST). The state table renders from the data file with a dollar column. Removed "above $2M often below 1.5%" (no source). Marketing now uses the site's one indicative range ($2,000 to $8,000) instead of $3,000 to $6,000. The cooling-off line (a flagged conflict) now says NSW's one business day, cited to the NSW Government page (updated 8 July 2026). Added links to the selling costs calculator, cost guide, fixed fee guide, negotiation guide, agency agreements guide and worksheet, and a sources block. Title unchanged.

### 5. `/real-estate-commission-calculator`
- **Baseline detail.** 155 queries in the window, almost all deep (68 to 86). "real estate commission calculator" (590 a month) had 14 impressions at 74.2 and is not in the live top 20. Indexed; crawled 5 Oct.
- **Changed.** Answer first: commission = price × rate, with the $800,000 example. The state list renders from the data file; removed "Melbourne metro the cheapest market in the country", "national average 2% to 2.5%" and "routinely ten times that" (no source). The "3% to 5% all-in" line, which contradicted the cost pages, now points to the selling costs calculator with the indicative line ranges. New FAQ: "How do you calculate real estate commission?". Links to the selling costs calculator and worksheet.

### 6. `/guides/how-to-choose-a-selling-agent`
- **Baseline.** No search data: crawled, currently not indexed since 13 Jul. Nothing to measure until it is indexed; request indexing after this deploy.
- **Changed.** A direct answer leads the page (interview three, ask for comparable sales, compare in dollars, read the agreement). The four hand-typed commission and marketing ranges (a flagged conflict) now read the data files, including the HowTo schema steps. Removed "the price difference can be five to ten times the fee" and "single biggest predictor" (no source) in favour of the arithmetic. Worksheet and selling costs calculator linked.

### 7. `/guides/questions-to-ask-a-real-estate-agent`
- **Baseline detail.** The five queries it was shown for are all buyer questions ("…when buying"), while the page answers sellers. Bing sends a few clicks at 4.0.
- **Changed.** Only the commission range, now from the data file (was "1.5 to 3%"). Not changed: the intent mismatch. A short "If you're buying" section or a link to the buying guide's agent chapter would serve those searchers; it's Andy's call whether the page should, since it would dilute a seller page.

### 8. `/first-home-buyers`
- **Baseline detail.** Shown mostly for mortgage-rate queries it doesn't answer, at 67 to 99. No impressions for "first home buyer schemes" (9,900 a month). Indexed; crawled 7 Oct.
- **Changed.** LMI figures now come from the LMI calculator's engine ($14,912 at 10% and $30,676 at 5% on $700,000, before duty, lender table read 30 September 2026), replacing "roughly 2-4%", which understated a 5% deposit. "What a lender will actually approve" and "what banks actually approve" became estimates. Pre-approval is no longer called "a prerequisite for most auctions". Grants and duty were already rendered from `src/lib/policy/first-home.ts`; unchanged.

### 9. `/stamp-duty-calculator`
- **Baseline detail.** 339 impressions in 10 Jul to 7 Oct. The 60,500-a-month head term had no recorded impressions; the page is shown for state questions ("how much is stamp duty wa", 86 at 45.1). Not in the live top 20.
- **Changed.** The typed "$20,000 to $60,000" became a computed answer: duty on an $800,000 home for an owner-occupier who isn't a first home buyer runs from $21,850 in Queensland to $43,070 in Victoria, computed from the calculator's schedules (rates checked 30 September 2026). Removed "Get connected if you want a free intro" to a conveyancer: the business doesn't introduce conveyancers (/find-an-expert: "We don’t introduce brokers, accountants or lawyers"). Replaced with the conveyancing guide, the affordability calculator and the buying plan.

### 10. `/borrowing-power-calculator`
- **Baseline detail.** The site's biggest calculator by impressions (4,120 in 10 Jul to 7 Oct), with no clicks. Positions fell after the deploy (84.5 to 96.9 on the head terms in 1 to 7 Oct). The review found these results bank-locked (7 to 9 banks in the top 10).
- **Changed.** Removed the same "free intro" promise (to a broker). The close now points to the pre-approval guide, the stamp duty and affordability calculators, and the buying plan. The answer table at the top was already there.

### 11. `/guides/best-time-to-sell-a-house-australia`
- **Baseline detail.** 92 impressions in 10 Jul to 7 Oct; the page-level average of 10.0 rests on a handful of long-tail queries. No impressions recorded for "best time to sell a house".
- **Changed.** Added "Where the market sits, October 2026": Cotality's national index down 1.1% in September (sixth monthly fall), capital-city median 39 days to sell against 23, inventory 23.1% higher, clearance 45.4% against 67.4%, and the RBA's rise to 4.60% on 29 September. Replaced "A rate cut can do more for your sale than waiting for spring" with the current rate position and a link to the cash rate tracker. Added Wright, Frino and Peat (2009) on seasonality to the FAQ on price. Sources now name dated Cotality releases instead of an index landing page.

### 12. `/guides/best-time-to-buy-property-australia`
- **Baseline detail.** One impression per query across six timing phrases.
- **Changed.** The clearance and listing claims (Task 1 scan) qualified or replaced with dated Cotality figures; the "20% to 30%" key figure is now the 39-day median; "rate cycles move prices 10% to 25%", "within 2 to 4 quarters", "1 to 3 quarters", "6 to 12 months after the bottom" and "statistically the best time" removed (no source). Pre-approval "90-day … free" is now "usually free, typically three to six months", with a link to the pre-approval guide. Added a sources block.

## Task 1: the /selling hub's strong claims

| Claim | Decision | Source |
|---|---|---|
| Auction "can lift the final price by 5-10%" | Not supported; replaced with the measured figure | Cortés, Singh, Solomon and Strahan, *Review of Finance* 30(5), 2026: 0.3% average premium once failures are counted (University of Sydney summary, 2 July 2026); 1.3% discount after a pass-in. Older work: Frino et al. (2010) found a premium for houses; Frino, Peat and Wright (2012) found none after correcting for self-selection. |
| Auctions "clear under 50% nationally" in flat markets | Narrowed and dated | Cotality publishes a combined-capitals rate: 45.4% final, week ending 4 Oct 2026, against 67.4% a year earlier. |
| A pass-in "damages buyer confidence" | Kept in substance, now with the figure | The 1.3% discount above. |
| Withdraw and relaunch as "just listed"; "the data resets on the listing sites" | Contradicted; removed | realestate.com.au counts a property as new only after 60 days off the site, including a new agreement with the same agency (REA help article, as quoted by Zenu, August 2023). TODO(andy): confirm on REA's page, which blocks automated checks. |
| "Live for more than 60 days tells buyers something is wrong" | No source; replaced | Cotality: capital-city median 39 days in September 2026 (23 a year earlier). |
| Days on market "28-45 days", city figures | No source; replaced | Same Cotality figure. |
| Commission "1.5-3.5%", city ranges | No source; derived | `commission-rates.ts` (1.6% to 3.25%, compiled, September 2026). |
| FSBO "lower final price" | No source; removed | None found. |

The same scan of the other selling-related priority pages found no auction-premium or relisting claim; it found the clearance-rate and listing claims on the best-time-to-buy guide (12 above). Outside the files this pass owns, it found the relaunch advice in `src/lib/data/blog-posts/changing-real-estate-agents-mid-campaign.ts:47` and a now-dated clearance figure in the auction-vs-private-treaty guide; both are in `CONTENT_FLAGS.md` with proposed wording.

## What the changes have in common

- **One source per figure.** Every commission range on these pages now reads `commission-rates.ts`; cost totals, duty examples and LMI figures are computed from the same engines as the calculators. Before this pass the site printed at least six national commission ranges and four marketing ranges.
- **Answer first.** Each page now opens (or opens its explainer) with the figure the query asks for, dated.
- **Conversions match intent.** Learning pages lead to a guide, a calculator, the worksheet or a plan. No calculator or guide now offers an introduction the business doesn't provide (conveyancers, brokers). Seller pages keep the agreement check and the optional appraisal link the layouts already carry.
- **Titles and canonicals unchanged.** No URL, title or canonical changed; `updatedAt` moved to 2026-10-20 on the edited guides and calculators, and `static-guides.json` matches.

## Re-measure

- **After deploy:** request indexing for `/guides/how-to-choose-a-selling-agent` (not indexed), then `/guides/cost-of-selling-a-house-australia` and `/guides/real-estate-agent-fees-australia` (last crawled 3 Jul and 20 Aug), then the two timing guides.
- **Four weeks after recrawl:** Search Console for these twelve URLs only, same metrics as the table, against this baseline. Read the cost and fees guides on their target phrases (does Google start choosing them over the state guides?), and Bing separately.
- **Conversions:** not measurable by landing page until GA4 or an equivalent is decided (commercial intent review 0.3 item 10). Until then, read guide-email requests and plan starts by their `from` slug.

## Open items for Andy

1. Confirm realestate.com.au's 60-day "new listing" rule on its help centre (blocked automated checks on 20 Oct).
2. Choose published, dated sources for `commission-rates.ts` (now the only commission source on these pages) or commission a survey.
3. Fix the same broker-introduction promise on `/mortgage-calculator` and `/refinancing-calculator` (proposed wording in `CONTENT_FLAGS.md`), and the relaunch advice in the "changing agents mid-campaign" post.
4. Decide whether the questions-to-ask guide should serve the buyer questions it is shown for.
