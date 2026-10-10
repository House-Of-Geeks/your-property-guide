# Buying costs and schemes: findings (pack `buying`), 10 Oct 2026

> Part of the [commercial-intent and competitor gap review of 10 October 2026](../commercial-intent-review-2026-10-10.md). Written by a read-only analyst from the evidence pack `data/packs/buying-*` in the run folder `~/Desktop/Ads/ypg-commercial-intent-review-2026-10-10/` (SERP digest, compare rows, GSC queries, intent-match misses, unanswered PAA) and the source at origin/main 9ef5ee7. File and line references are to that commit. Points marked "verify" are the analyst's own knowledge, not a source fetched in this run: check them with the regulator before changing copy. No site code was changed.

Scope: stamp duty (eight state guides and `/stamp-duty-calculator`), first home buyer grants and schemes (FHOG, Help to Buy, FHSS, 5% Deposit Scheme, shared equity), deposit and LMI, conveyancing, building and pest inspection, buyer's agents, cooling-off and contracts, the buying guide.

Evidence: `buying-serp-digest.txt`, `buying-compare.csv`, `buying-gsc-queries.tsv`, `buying-intent-match.tsv`, `buying-paa-missing.tsv`, plus `../index-status.csv`, `../request-indexing.csv`, `../linkgraph.json`, `../gsc-*-query-page.csv`, `../vertical-prepost.csv`, `../bing-page.csv`, `../serp-raw.json`, `../kp-targets.csv`. Live pages fetched with curl on 10 Oct 2026 (50 URLs in this vertical plus five agents pages). Source cited from `repo-main/src` (origin/main 9ef5ee7).

Primary sources read on 10 Oct 2026 to check the live figures: Housing Australia (5% Deposit Scheme price caps; Help to Buy price caps; Help to Buy 2026–27 thresholds), ATO (FHSS release amounts; shortfall interest charge rates, updated 4 Sep 2026), Queensland Revenue Office (first home owner grant eligibility), State Revenue Office Tasmania (first home owner grant eligibility), RevenueWA (duties fact sheet, first home owner rate), Revenue NSW (First Home Buyer Choice, First Home Buyers Assistance Scheme, dutiable value, deceased estate concession), SRO Victoria (first home owner grant). RevenueSA and the NT Territory Revenue Office refused the fetch (403) and the ACT Revenue Office URLs I tried returned 404; for those three I rely on our own engine's dated source notes in `src/lib/utils/stamp-duty.ts` (read 30 Sep 2026) and, for SA, on the 10 Oct AI Overview that quotes RevenueSA.

---

## Top 5 (read this first)

1. **Fix the first home buyer facts before anything else is indexed or linked.** Six of the eight state first home guides, the FHOG guide, the national first home buyer guide, `/first-home-buyers` and one blog post print state grants and duty thresholds that the revenue offices and our own stamp duty guides contradict: NSW "First Home Buyer Choice remains available" (closed 1 July 2023), WA exemption "$450,000" (RevenueWA: $600,000 since 7 May 2026), Tasmania "$30,000 FHOG" and "50% concession" (SRO Tas: $20,000 from 1 July 2026, no duty relief), NT "First Home Owner Discount", ACT "income-tested", SA "$650,000 cap". Bing already shows the NSW guide at 6.1 (1,940 impressions). Root cause: these figures are hand-typed per page while the federal schemes come from data files. One sourced data file plus a test.
2. **Request indexing in a set order** (section 1, table 1.3). Stamp duty guides were last crawled 17 Jun to 25 Jul, the conveyancing, inspection, Help to Buy and LMI guides are "crawled, currently not indexed" from June and July. Too early to read any of the 1 Oct and 7 Oct work.
3. **Point the suburb and postcode templates' buying links at the state pages.** `SuburbContextualLinks.tsx:47,51` labels a link "First home buyer guide, {STATE}" but sends it to the national guide, and "Stamp duty calculator" to the national calculator. In the crawl sample the national calculator has 440 in-content inlinks; each state stamp duty guide has 13 to 15.
4. **Buyer's agent: rebuild the cost guide as the buyer's agent hub now; build city pages only once a partner buyer's agent exists per city.** 206 "{suburb} buyer's agent" queries, 51 impressions a day at 38, all land on 251 selling-agent pages with an appraisal form and no buyer's agent content (52% NSW, whose agents pages are noindex until the median label is repaired).
5. **Section 32 and the stamp duty SERPs that small pages win.** "section 32" (5,400 a month) is held by Consumer Affairs Victoria and 900 to 1,100-word law firm pages; ours is 2,610 words with no FAQ schema at 73.5. "stamp duty nsw" (6,600, AI 1,544) has no government page in the top five. Add a "stamp duty at common prices" table to the eight state guides (price-point PAAs) instead of new URLs.

---

## 0. Fix first: accuracy and compliance on live pages

Severity order. "Contradicts" means the same site prints a different figure elsewhere, usually on the page that carries the sourced engine figure.

### 0.1 The errors

| # | Live URL | What the page says (quoted) | What the primary source or our sourced page says | Source file:line | Exposure |
|---|---|---|---|---|---|
| 1 | /guides/first-home-buyer-nsw | "First Home Buyer Choice (annual property tax instead of upfront stamp duty) remains available for properties up to $1.5M for eligible buyers." Also an H3 "First Home Buyer Choice (optional annual property tax)" and the FAQ "Should I take stamp duty upfront or use First Home Buyer Choice?" (in FAQPage JSON-LD) | Revenue NSW (read 10 Oct): "First Home Buyer Choice (FHBC) closed to new applications on 1 July 2023". | `src/app/(marketing)/guides/first-home-buyer-nsw/page.tsx:58, 89-91, 226-230` | Bing 1,940 impressions at 6.1, 9 clicks (90 days); Bing query "first home buyer grant nsw" 1,606 at 6.1. Google 123 impressions at 50.2. |
| 2 | /guides/first-home-buyer-nsw | "Shared Equity Home Buyer Helper (NSW): ... Income caps $90K single / $120K couple ... Check eligibility at Service NSW." | Closed 30 June 2024: our own `/guides/shared-equity-schemes-australia` and `src/lib/data/help-to-buy.ts:184-190` (Revenue NSW previous schemes). | `.../first-home-buyer-nsw/page.tsx:252` | as above |
| 3 | /guides/first-home-buyer-nsw | "On a $750,000 home ... saving roughly $29,000" and "Since September 2023, concessions apply" | Our NSW stamp duty guide and engine: $27,937 at $750,000 (2026-27 brackets, `src/lib/utils/stamp-duty.ts:105-111`). Revenue NSW: thresholds apply to contracts "From 1 July 2023". | `.../first-home-buyer-nsw/page.tsx:57, 193, 214` | as above |
| 4 | /guides/first-home-buyer-wa | Meta and key takeaway: "Full stamp duty exemption applies up to $450,000 with a scaled concession to $600,000"; table row "Up to $450,000 / $0"; FAQ "Why is stamp duty $0 up to $450,000 in WA" | RevenueWA duties fact sheet (read 10 Oct): on or after 7 May 2026 "No duty is payable if the dutiable value does not exceed $600,000", $16.15 per $100 to $800,000. The $450,000/$600,000 pair applied before 21 March 2025. Our WA stamp duty guide and `/stamp-duty-calculator` FAQ print $600,000. | `.../first-home-buyer-wa/page.tsx:23, 55, 89-91, 202` | Indexed (crawled 3 Jul). |
| 5 | /guides/first-home-buyer-wa | "Note: WA's $600,000 Perth cap is lower than east-coast capitals" | The same page, and Housing Australia (read 10 Oct): 5% Deposit Scheme cap $850,000 in Greater Perth. | `.../first-home-buyer-wa/page.tsx:230` | |
| 6 | /guides/first-home-buyer-wa | "Standard duty on $400,000 would be roughly $13,433" | Our engine (RevenueWA residential table): $11,115 + 4.75% of $40,000 = $13,015. | `.../first-home-buyer-wa/page.tsx:211` | |
| 7 | /guides/first-home-buyer-tas | Title/meta "$30,000 FHOG on new homes, 50% stamp duty concession on established homes up to $600K"; "As of 2026 ... $30,000 ..., increased from $20,000" | SRO Tasmania (read 10 Oct): "Transactions that commence between 1 July 2026 and 30 June 2027 may be eligible for $20 000." Our TAS stamp duty guide: exemption "ended for transfers settling after 30 June 2026. First home buyers now pay the full rate" and it links to this guide for "the grant and its eligibility". | `.../first-home-buyer-tas/page.tsx:23, 54-55, 77, 82, 116-117, 147, 162-170, 187-193, 210-211, 237` | Indexed (crawled 13 Jul). GSC 90 days: "stamp duty first home buyer" 2 impressions at 19.5 landed here. |
| 8 | /guides/first-home-buyer-nt | "First Home Owner Discount delivers up to $23,928.60 of stamp duty relief, on new and established homes alike"; "NT's FHOG is $10,000" | Our NT stamp duty guide (TRO, read 30 Sep): "There is no first home buyer duty concession in the NT. The $50,000 HomeGrown Territory grant for a first new home runs to contracts signed by 30 September 2027", and it links here for eligibility. The guide never mentions the $50,000 grant. TRO refused our fetch; confirm whether a separate $10,000 FHOG still applies before restating it. | `.../first-home-buyer-nt/page.tsx:23, 55, 77, 80-82, 117-122, 148, 161`; `src/lib/data/blog-posts/darwin-nt-property-market-2026.ts:33` | Crawled, not indexed (24 Jul). |
| 9 | /guides/first-home-buyer-act | "Income thresholds apply (combined gross income of all buyers)"; "Property value thresholds apply"; "On a $700,000 ACT home, the HBCS can wipe out a stamp duty bill of roughly $27,000" | Our ACT stamp duty guide (ACT Revenue Office 2026-27 Budget update, read 30 Sep): "From 1 July 2026 the ACT removed both the income threshold and the property value limit". Engine owner-occupier duty at $700,000: $8,408 + 4.32% of $200,000 = $17,048 (`stamp-duty.ts:460-468`). | `.../first-home-buyer-act/page.tsx:55, 110, 172, 193-194` | Crawled, not indexed (6 May). |
| 10 | /guides/first-home-buyer-sa | "SA's FHOG is $15,000 on new homes only, capped at $650,000 contract price"; "SA does NOT offer a stamp duty exemption ... the FHOG is the main FHB-specific concession" | The cap was removed for contracts from 6 June 2024 (the 10 Oct AI Overview for "first home buyer grant sa" quotes RevenueSA: "no property value cap for new home contracts entered into on or after June 6, 2024"; RevenueSA refused our fetch). Our SA stamp duty guide: "first home buyers pay $0 on a new home" (no cap, engine note `stamp-duty.ts:354-366`), which this guide never says. | `.../first-home-buyer-sa/page.tsx:54, 77, 82, 117, 119, 167, 179` | Indexed (12 Jul); Bing pages list it. |
| 11 | /guides/first-home-buyer-sa | "HomeSeeker SA is a state shared-equity scheme; availability changes per round" | HomeSeeker SA (homeseeker.sa.gov.au) is the SA Government's listings site for affordable homes, not a shared equity scheme; verify before rewording. SA's shared equity product is HomeStart's Shared Equity Option, as our shared equity guide says (`help-to-buy.ts:158-163`). | `.../first-home-buyer-sa/page.tsx:23, 58, 66, 90, 242` | |
| 12 | /guides/first-home-buyer-guide (national) | Duty table: QLD "No full exemption / Concession for homes ≤ $550,000"; WA "≤ $450,000"; TAS "50% discount"; NT "Up to $18,601 off duty"; ACT "Full exemption (income-tested)". Grant table: SA "$650,000"; TAS "$30,000"; NT "$10,000 ... No cap". | QRO (engine, 9 June 2024 table): $0 to $700,000, phasing out at $800,000. WA, TAS, NT, ACT, SA as rows 4, 7, 8, 9, 10. | `src/app/(marketing)/guides/first-home-buyer-guide/page.tsx:249-251, 284-289` | Indexed (26 Jul). |
| 13 | /guides/first-home-owner-grant-australia | "Amounts range from ... $10,000 in NSW, WA and NT, to $30,000 in Queensland and Tasmania"; TAS row "Up to $30,000 (check current)"; NT row "$10,000"; ACT row "Uses the income-tested Home Buyer Concession Scheme"; "Tasmania's boosted $30,000 grant is tied to a set window" (no date); "nothing in the ACT and $15,000 or more over the border" | TAS, NT, ACT as rows 7 to 9. The only state over the ACT border is NSW ($10,000). Sources listed cover NSW, VIC, QLD only: WA, SA, TAS, NT and ACT rows carry no source or as-at date. | `src/app/(marketing)/guides/first-home-owner-grant-australia/page.tsx:56, 138, 161, 215-229, 242-243, 279` | Indexed (18 Jul); Bing 187 impressions at 5.9, 7 clicks. |
| 14 | /first-home-buyers (hub) | "WA is generous under $450k"; FAQ (FAQPage JSON-LD): "SA: $15,000 for new homes under $650,000. TAS: $30,000 for new homes"; "QLD ... (full exemption typically under $550,000). WA exempts up to $450,000"; "LMI is waived under ... the Regional First Home Buyer Guarantee" | Rows 4, 7, 10, 12. The Regional First Home Buyer Guarantee issued no new guarantees after 1 October 2025 (our state guides and Housing Australia). | `src/lib/persona-hub-content.ts:78, 100, 105, 110` | Indexed (7 Oct). |
| 15 | /guides/first-home-buyer-schemes-by-state-australia-2026 (blog, dated 6 May, `updatedAt` 7 Oct) | NSW "First Home Buyer Choice ... properties up to $1.5M", "Shared Equity Home Buyer Helper"; VIC "FHOG: $10,000 metro Melbourne, $20,000 regional Victoria"; QLD "Reduced transfer duty for properties up to $550,000"; WA "$450,000"; SA "$650,000", "HomeSeeker SA"; TAS "$30,000", "50% concession"; NT "First Home Owner Discount" | Rows 1, 2, 4, 7, 8, 10, 11, 12. VIC's own guide: the $20,000 regional grant ended 30 June 2021. | `src/lib/data/blog-posts/first-home-buyer-schemes-by-state-australia-2026.ts:37-38, 44, 54, 63, 71, 73, 80-81, 98` | Indexed (1 Oct). |
| 16 | /guides/lenders-mortgage-insurance-guide | Table "$700,000 ... LVR 95% ~$22,000 to $28,000", "$1,000,000 ... ~$32,000 to $40,000"; key takeaway "On a $700,000 property at 95% LVR, LMI typically costs $22,000 to $28,000" | Our own sourced `/lmi-calculator` table (Home Loan Experts' lender table, page updated 18 May 2026): $700,000 loan at 95% = 4.613% = $32,291; $1,000,000 at 95% = 4.603% = $46,030; a $700,000 property at 95% ($665,000 loan) = $30,676. The guide's figures are unsourced. | `src/app/(marketing)/guides/lenders-mortgage-insurance-guide/page.tsx:54, 223-224`; engine `src/lib/lmi-calc.ts:67-83` | Crawled, not indexed (8 Jun). Also `/guides/how-much-deposit-to-buy-a-house` FAQ: "$15,000 to $25,000 in LMI on a $600,000 to $700,000 loan" (engine at 95%: $23,988 to $32,291), `.../how-much-deposit-to-buy-a-house/page.tsx:89`. |
| 17 | /guides/buyers-agent-cost-australia | Every fee ("$15,000 to $25,000 fixed" in Sydney, "1.5% to 3%", "$500 to $1,500 per auction") is unsourced and undated; "NSW requires a Class 1 or Class 2 Real Estate Licence (Stock and Station)"; link card "Find an Expert: Browse buyer's agents and brokers we've vetted." | YMYL rule: every figure sourced and dated. Stock and station agents are a separate licence category; buyer's agents in NSW act under a real estate agent licence. `/find-an-expert` has no browsing: it is one match, and the specialist pays a fee. | `src/app/(marketing)/guides/buyers-agent-cost-australia/page.tsx:50, 91, 105, 152, 191` (`updatedAt` still 2026-05-06, line 21) | Indexed (13 Jul), 123 impressions in 90 days at 74.7. |
| 18 | NSW, VIC, QLD, WA first home buyer guides | "Western Sydney suburbs like Campbelltown, Penrith and Blacktown, medians from $750,000 to $950,000"; "Outer Perth ... Joondalup, Wanneroo, Butler, house medians $530K to $680K"; similar for Melbourne and Brisbane | No source or date. The suburb profiles withhold their medians for all 80 NSW and 50 of 53 QLD profiles parsed, so these guides print medians the suburb pages refuse to. | `first-home-buyer-nsw/page.tsx:266-274`; `-vic:238`; `-qld:256-262`; `-wa:257-264` | |
| 19 | Every guide using `GuideArticleLayout` | "Every figure on this page is sourced and dated." shown beside "Reviewed October 2026", on pages where rows 1 to 18 sit; the state guides' `updatedAt` was bumped to 2026-10-07 when the federal scheme blocks were inserted | Misleading freshness claim on pages whose state figures are unsourced and stale. | `src/components/guide/GuideArticleLayout.tsx:226`; `updatedAt` in each `first-home-buyer-{state}/page.tsx:26` | |
| 20 | /help-to-buy-calculator | Result row "You look eligible on these figures" with a green "Yes" | Eligibility is Housing Australia's and the lender's call. Suggest "Within the 2026–27 income limit and your area's price cap" and add "Housing Australia and the lender decide eligibility." | `src/components/calculators/HelpToBuyCalculator.tsx:150-151` | Indexed (6 Oct). |
| 21 | /find-an-expert (destination of every buyer CTA in this vertical) | H1 "Tell us your situation. We'll find the right person." | Agent-match promise (also "we'll find the right specialist for it"). Disclosure on the page is good ("The specialist pays us a fee for each introduction"). Suggest H1 "Tell us your situation and we'll introduce one specialist". | `src/app/(marketing)/find-an-expert/page.tsx:139, 199`; same heading in `src/components/journey/MatchAgent.tsx:226` | 466 in-content inlinks. |

Minor, same files: VIC guide "On a $550,000 first home ... saving roughly $26,000" (engine: $24,970 at the principal place of residence rate, $28,070 general; `first-home-buyer-vic/page.tsx:56, 201`). FHOG guide "The Northern Territory is the main exception" for renovated homes, while the NSW guide lists substantially renovated homes as eligible (`first-home-owner-grant-australia/page.tsx:85, 279`). QLD guide omits Boost to Buy, the state shared equity scheme our shared equity guide lists as open for regional places. ACT guide's "ACT Shared Equity Scheme" is not in our shared equity guide's list and carries no source.

Checked and correct (keep): QLD FHOG $30,000 for contracts from 20 November 2023 with no end date (QRO, read 10 Oct); VIC FHOG $10,000 to $750,000 (SRO); WA FHOG $10,000 (RevenueWA); NSW FHOG $600,000 / $750,000 caps after #103 (consistent on the NSW guide, the hub FAQ and the national guide); every 5% Deposit Scheme, Help to Buy and FHSS figure on every page (rows 1.2).

### 0.2 Root cause and the fix

The 7 Oct work moved the federal schemes to sourced data files (`src/lib/data/home-guarantee.ts`, `help-to-buy.ts`, `fhss.ts`), and those figures are right everywhere. State grants and first home duty relief are still typed by hand into eight `first-home-buyer-{state}/page.tsx` files, the FHOG guide, the national guide, `persona-hub-content.ts` and a blog post, while the correct figures already exist in `src/lib/utils/stamp-duty.ts` (`NSW_FIRST_HOME`, `VIC_FIRST_HOME`, `QLD_FIRST_HOME`, `WA_FIRST_HOME`, the SA, TAS, ACT and NT notes) and `src/lib/data/stamp-duty-state.ts:71-80` (`FIRST_HOME_SUMMARY`).

One change, one PR:
1. New `src/lib/data/first-home-grants.ts`: per state the FHOG amount, price cap (or "no cap"), the contract-date window, the source label and URL, and `checkedOn`, in the shape of `home-guarantee.ts`.
2. The state guides, the FHOG guide, the national guide, the hub FAQ and the stamp duty calculator's FAQ render grant and duty-relief lines from that file and the engine constants. Delete the hand-typed rows.
3. A test like `tests/seo/tax-reform-2027-pages.test.ts`: render the eleven pages and fail if any prints a first home threshold or grant amount not in the data file, or prints "First Home Buyer Choice", "First Home Owner Discount" or "HomeSeeker" as a current scheme.
4. 301 `/guides/first-home-buyer-schemes-by-state-australia-2026` to `/first-home-buyers` (section 4) rather than maintain a third copy.
5. Then request indexing for the corrected pages (1.3), and only then switch the suburb template's state labels to the state guides (3.1 and 3.3).

---

## 1. Where we match commercial intent (keep doing)

### 1.1 What is working

| What | Numbers | Why it works |
|---|---|---|
| LMI calculator (#91) | Deposit and LMI family 0.1 to 11.3 impressions a day after the deploy (28 queries, position 30). "lenders mortgage insurance calculator" 35 impressions at 10.9, "lmi insurance calculator" at 5, "lmi calculator" 26 at 16. Crawled 1 Oct. | Calculator-only SERPs (Helia estimator, Westpac, Stanford). Not in the top 20 live anywhere, so Google is testing it; no title change. |
| Federal scheme data files (#100, #102, the 5% Deposit Scheme file) | Every figure I checked matches the primary source on 10 Oct: Help to Buy income limits $103,000 single and $165,000 joint or single parent; Help to Buy caps for all eight states (NT $600,000 both areas) and the external territories; 5% Deposit Scheme caps including Greater Darwin $750,000; FHSS $15,000 a year, $50,000 total, 85% of concessional contributions, deemed rate 7.51% for October to December 2026 (ATO, updated 4 Sep 2026). The same figures render on every page I fetched that carries them (the eight state first home guides, the national guide, the five Help to Buy pages, the shared equity, FHSS and 5% Deposit Scheme guides). | One constant per figure, a `CHECKED_ON` date, sources listed. This is the model for 0.2. |
| Stamp duty engine and calculator-first state guides (#92) | My spot checks match the offices: WA first home owner rate $600,000 / $800,000 from 7 May 2026 (RevenueWA fact sheet), TAS no relief and $20,000 FHOG from 1 July 2026 (SRO Tas), NSW $27,937 at $750,000 (2026-27 brackets). Bing, 90 days: QLD guide 323 impressions at 7.7, SA 298 at 7.6, NSW 109 at 7.3, calculator 58 at 8.2. | Tool above the fold, rates table, thresholds, FAQPage, WebApplication: the SERP format. Too early on Google (1.3). |
| Conveyancing and inspection cost content | Family 1.2 to 10.7 impressions a day, but on the cost-of-selling state guides: "darwin conveyancing cost" 3 at 1.3 (`/guides/cost-of-selling-a-house-nt`), "conveyancing fees wa" 10 at 66.6. | State cost lines exist on indexed pages; the dedicated guide is not indexed yet. |
| Bing on first home guides | `/guides/first-home-buyer-nsw` 1,940 impressions at 6.1 (9 clicks), FHOG guide 187 at 5.9 (7 clicks), `/guides/first-home-buyer-guide` 224 at 4.9. | Bing ranks these pages on page one now, which is why section 0 matters this week. |
| Smaller wins | `/guides/shared-equity-schemes-australia` live 19 for "shared equity scheme" (1,000 a month); `/guides/cooling-off-period-vic` live 19; `/guides/selling-a-deceased-estate-property` 16 impressions at 9.9 for "stamp duty on inherited property nsw"; `/guides/contract-of-sale-wa` 30 impressions at 2. | Specific, sourced explainers on narrow intents. |

### 1.2 Too early to read (Google has not seen the change)

| Page | Changed | Last Google crawl | Coverage |
|---|---|---|---|
| `/guides/stamp-duty-nsw`, `-vic` | 1 Oct (#92) | 14 Jul | Indexed |
| `/guides/stamp-duty-qld` | 1 Oct | 15 Jul | Indexed |
| `/guides/stamp-duty-wa` | 1 Oct | 25 Jul | Indexed |
| `/guides/stamp-duty-sa`, `-act`, `-tas`, `-nt` | 1 Oct | 17 Jun | Indexed |
| `/stamp-duty-calculator` | 1 Oct | 31 Aug | Indexed |
| `/guides/conveyancing-guide` | 1 Oct (#88) | 3 Jul | Crawled, not indexed |
| `/guides/building-pest-inspection` | 1 Oct (#88) | 7 Jul | Crawled, not indexed |
| `/guides/help-to-buy-scheme-australia` | 7 Oct (#100) | 14 Jul | Crawled, not indexed |
| `/guides/lenders-mortgage-insurance-guide` | 7 Oct | 8 Jun | Crawled, not indexed |
| `/guides/first-home-super-saver-scheme` | 7 Oct (#102) | 17 Jul | Indexed |
| `/guides/first-home-guarantee` | 7 Oct | 15 Jul | Indexed |
| `/guides/first-home-buyer-vic` | 7 Oct | 5 Jun | Crawled, not indexed |
| `/guides/home-loan-pre-approval-australia` | not rewritten (`updatedAt` 13 May, page says "Updated May 2026") | 17 Jun | Crawled, not indexed |

Stamp duty impressions stayed at about 3 a day; that is the June and July pages, not the calculator-first template. The first home vertical's fall from 2.4 to 1.0 a day is two long-tail queries at the bottom of the results: pre-deploy, "first home buyer guide - nsw government schemes" (74 impressions on the NSW guide) and "qld stamp duty calculator first home buyer" (54 on `/stamp-duty-calculator`, at 92.6) made most of it. No clicks either side. Not a signal.

### 1.3 Request-indexing order for this vertical

Search Console limits manual requests per day, so order by demand and by whether the page Google will see is correct. Do not request a page that still carries a section 0 error.

| Day | Page | Target volume a month | Why now |
|---|---|---:|---|
| 1 | /guides/conveyancing-guide | 24,280 | Not indexed, rewritten 1 Oct, last crawl 3 Jul |
| 1 | /guides/stamp-duty-nsw | 39,730 | Last crawl 14 Jul |
| 1 | /guides/stamp-duty-qld | 30,710 | 15 Jul |
| 1 | /guides/stamp-duty-vic | 29,000 | 14 Jul |
| 1 | /guides/help-to-buy-scheme-australia | 12,100 | Not indexed, rewritten 7 Oct |
| 1 | /guides/stamp-duty-wa | 17,200 | 25 Jul |
| 1 | /guides/building-pest-inspection | 9,700 | Not indexed, rewritten 1 Oct |
| 1 | /guides/stamp-duty-sa | 8,100 | 17 Jun |
| 1 | /stamp-duty-calculator | 62,100 | 31 Aug; hub that links the eight |
| 2 | /guides/first-home-guarantee | 8,300 | 7 Oct data, crawled 15 Jul (after the title change in 3.7, if made the same day) |
| 2 | /guides/first-home-super-saver-scheme | 6,600 | 7 Oct rewrite |
| 2 | /guides/first-home-buyer-qld | 14,800 | Facts correct (only the unsourced median block to remove) |
| 2 | /guides/first-home-buyer-vic | 1,600 | Not indexed; facts correct |
| 2 | /guides/stamp-duty-act, -tas, -nt | 1,600; 1,000; n/a | 17 Jun |
| After 0.2 ships | /guides/first-home-owner-grant-australia, /guides/first-home-buyer-nsw, -wa, -sa, -tas, -act, -nt, /guides/first-home-buyer-guide, /first-home-buyers | 5,400 + 2,400 + 1,600 + 2,900 + ... | Correct first |
| After the table fix (row 16) | /guides/lenders-mortgage-insurance-guide | 5,400 | Not indexed since 8 Jun |
| After a rewrite | /guides/buyers-agent-cost-australia (3.6), /guides/home-loan-pre-approval-australia | 6,330; 2,400 | Neither has new content for Google to find |

---

## 2. Where we miss, by query type

Totals from `buying-compare.csv` (53 target queries). "Gov" counts government results among the top five.

| Query type | Queries | KP a month | AI volume | GSC 90 days | Gov in top 5 | What the top 5 reward | Our landing pages |
|---|---:|---:|---:|---:|---:|---|---|
| Calculators ("stamp duty calculator {state}", LMI, Help to Buy, FHSS) | 13 | 178,320 | 982 | 133 | 17 of 65 | The tool first. Government calculators (SRO, QRO, Revenue NSW) and banks (CommBank 37 inputs, Macquarie, ANZ) hold the big three states on authority. Small calculator pages rank in WA, SA, ACT, TAS: mortgagecalculatoragent WA (747 words, 7 inputs, FAQ 5, HowTo), moneywisecalc ACT (695 words, "stamp duty at common prices" table), savingsmate TAS (a $750,000 price-point page, Dataset + FAQPage), lendology SA (613 words, answer-first intro with four price points). Calculator SERPs for NSW, VIC and QLD carry no AI Overview. | State guides match the format since 1 Oct and exceed rivals on every on-page count (NSW: 2,262 words, 3 tables, 4 inputs, 6 FAQs against a median of 1,178 words). Slug lacks "calculator" (rule: URLs never change). Not recrawled. |
| State duty information ("stamp duty nsw", "stamp duty qld", "stamp duty first home buyer") | 6 | 16,130 | 3,900 | 54 | 8 of 30 | "stamp duty nsw" has no government page in the top five (actbookkeepinggroup 1,292 words, quinns 2011, quicklaw, turnerfreeman 2017, realestatecalc 902 words). "stamp duty first home buyer" rewards state-specific first home exemption explainers (sbsolicitors VIC 3,302 words, inovayt NSW, keylaw QLD, financecorp WA). | Same state guides; for the first home query, `/stamp-duty-calculator`, which has no first-home-by-state table. |
| Schemes and grants (FHOG by state, Help to Buy, FHSS, 5% Deposit, shared equity, "first home buyer schemes") | 15 | 67,990 | 1,708 | 50 | 24 of 75 | Government pages for the federal schemes (firsthomebuyers.gov.au, Treasury, Housing Australia). Bank, broker and builder pages for state grants (brisbanehomeloan 1,869 words and FAQ 17, ownhome, Plantation 3,204, Bank of Melbourne 1,559) with eligibility lists and price caps; almost none has a table. AI Overviews on 14 of 15. | Long sourced guides for the federal schemes (Help to Buy 3,774 words, FHSS 3,547), last crawled before their rewrite; state grant guides with the errors in section 0. First home family about 1 impression a day. |
| Cost and fee questions (conveyancing fees, inspection cost, LMI, deposit) | 5 | 10,380 | 2,510 | 0 | 1 of 25 | Price tables by state or city with dates, provider price lists (visionbuildingreports, 234 words and two price tables, is #1 for inspection cost), and calculators (Quicklaw QLD: 32 tables, 34 inputs). | The conveyancing and inspection guides are cost-first with sourced tables but not indexed; queries fall to the cost-of-selling state guides. |
| Local providers ("conveyancer", "building and pest inspection", "buyers agent", "buyers agent sydney/melbourne", "{suburb} buyers agent") | 5 + 206 suburb queries | 39,500 | 10,441 | 0 on targets; 51 a day on suburb variants | 1 of 25 | Local service pages and directories with city or region pages (buyersagents.com.au: city page with a fee table, FAQ 5, ProfessionalService and ItemList; findmyrealestate "Buyer Agents Sydney" with FAQ and AggregateRating), booking or enquiry forms. "buyers agent sydney" #1 is SEEK jobs: mixed intent. | No page of this type. Guides land for the head terms; 251 selling-agent pages take the suburb variants. Authority (58 referring domains) caps "conveyancer" (22,200) and "building and pest inspection" (8,100). |
| Process and legal (section 32, cooling-off, contract of sale, how to buy a house, deposit bond, off-market) | 9 | 11,100 | 19,520 | 251 | 5 of 45 | Consumer Affairs Victoria and law firm explainers of 500 to 1,200 words with question H2s; for "how to buy a house" broker and developer step guides (Satterley 654 words in seven stages, Aussie 1,936 words with two tables). AI volume is the story: "buying a house australia" 15,000, "how to buy a house in australia" 3,979. | Deep guides without FAQ schema (section 32) or without a table (cooling-off); the buying guide titled "property" while the query and 2 of 5 rival titles say "house". |

---

## 3. Page-by-page gap and fix list

Ranked by demand times winnability. Rival figures are from the live top five on 10 Oct (`buying-serp-digest.txt`). Proposed titles are within 60 characters before the " | Your Property Guide" suffix.

### 3.1 Stamp duty state guides (one template, eight URLs) and `/stamp-duty-calculator`

Targets: "stamp duty calculator nsw" 33,100 (AI 107), "qld" 27,100, "vic" 27,100, "wa" 14,800, "sa" 8,100, "act" 1,600, "tas" 1,000; "stamp duty nsw" 6,600 (AI 1,544), "qld" 3,600 (AI 1,301), "wa" 2,400 (AI 574), "vic" 1,900; "stamp duty calculator" 60,500 (AI 652). GSC: about 3 impressions a day. Status: too early (1.2).

| | Ours (NSW) | Rival median ("calculator nsw") | Best-placed rival |
|---|---|---|---|
| Words | 2,262 | 1,178 | Revenue NSW calculators hub, 67 words (#1, authority); for "stamp duty nsw": actbookkeepinggroup 1,292 (#2) |
| H2s | 12 | 0 | Revenue NSW "How to calculate transfer duty" 7 (Dutiable value; Current thresholds and rates; Calculation examples) |
| Tables | 3 (19 rows) | 1 of 5 | Revenue NSW 2 tables |
| Tool | 4 inputs | 2 of 5 | CommBank 37 inputs |
| Schema | Article, FAQPage, WebApplication, Speakable | none on 4 of 5 | mortgagecalculatoragent WA: FAQPage, HowTo, WebApplication |
| FAQ | 6 | FAQ schema 1 of 5 | realestate.com.au 6 |
| Author | "Your Property Guide editorial", reviewed by | 0 of 5 | none |
| Query in slug / title / H1 / intro | no / yes / yes / yes | 0 / 0 / 0 / 0 of 5 | n/a |

Proposed title, H1, intro: no change (shipped 1 Oct, not yet crawled).

H2s to add, from rivals and PAA:
- "{STATE} stamp duty at common prices" (moneywisecalc "ACT stamp duty at common prices", conveyancingprofessionals "What stamp duty costs at common Victorian prices"): a server-rendered table at $300,000, $400,000, $500,000, $600,000, $700,000, $750,000, $800,000, $900,000, $1,000,000, $1,250,000, $1,500,000 and $2,000,000, with owner-occupier, first home buyer and investor columns from the engine. It answers the price-point PAAs on every state SERP ("What is the stamp duty on $820,000?", "How much stamp duty would I pay on $800,000?", "How much is stamp duty on a $700000 house in QLD?") without savingsmate-style price-point URLs.
- "How to calculate stamp duty in {STATE}" (Revenue NSW, QRO "How to calculate transfer duty", Canstar's eight "How to calculate stamp duty costs in {state}" H2s): move the existing `workedCalculation()` sentence under its own H2 with the bracket formula and "dutiable value is the higher of the price and the market value" (Revenue NSW, read 10 Oct).
- "Pensioners and downsizers" where the state has a scheme (VIC pensioner exemption, ACT Pensioner Duty Concession Scheme), sourced; "rivals use" terms on the VIC and QLD SERPs include "pensioner concession" and "concession card holders".

PAA to answer (FAQ, all state guides unless named): "What is the formula for calculating stamp duty?" (AI 67); "Is stamp duty tax deductible?" (AI 17, on four SERPs); "Can I sell my property to my son for $1?" (AI 98); "Who is exempted from stamp duty?" (AI 88); "Do seniors get a discount on stamp duty?" (WA, AI 30); "Do you pay stamp duty on inherited property?" (NSW: concessional $100 duty, Revenue NSW, read 10 Oct; the NSW guide now says only "charged at concessional rates"). Copy in section 6.

Schema: keep. Tool: none to add. On `/stamp-duty-calculator`, turn "First home buyer concessions in plain English" into a table (state, no duty up to, concession to, from date, source) from the engine constants; it targets "stamp duty first home buyer" (1,600, AI 356) and currently links only the NSW, VIC, QLD and WA first home guides; add SA, TAS, ACT, NT.

Internal links (linkgraph): each state guide has 13 to 15 in-content inlinks, nearly all from the other state guides and the calculator; `/stamp-duty-calculator` has 440, of which 270 come from suburb profiles and 100 from postcode pages in the sample, all anchored "stamp duty calculator".
- `src/components/suburb/SuburbContextualLinks.tsx:51`: label "{STATE} stamp duty calculator", href `/guides/stamp-duty-{state}` (the selling column already does this for commission, lines 58-67).
- `src/app/(marketing)/postcodes/[postcode]/page.tsx:430`: same change.
- NSW guide "Exemptions": "stamp duty on inherited property" to `/guides/selling-a-deceased-estate-property`.

Consolidate: nothing. Files: `src/lib/data/stamp-duty-state.ts` (FAQ arrays from line 340; add a `COMMON_PRICES` export next to `EXAMPLE_PRICES`, line 59), `src/components/guide/StampDutyStateGuide.tsx` (after the worked examples, line 185), `src/app/(marketing)/stamp-duty-calculator/page.tsx`.

### 3.2 `/guides/conveyancing-guide`

Targets: "conveyancing fees" 1,600 (AI 911, CPC $15.64), "conveyancing cost nsw" 480 (AI 211), "conveyancer" 22,200 (AI 7,320). Crawled, not indexed (3 Jul). GSC: 0 on the guide; its queries land on the cost-of-selling guides ("conveyancing fees wa" 10 at 66.6, "conveyancing costs perth" 7 at 83, "conveyancing costs sa" 4 at 62.5, "settlement fees wa" 4 at 46.2, "darwin conveyancing cost" 3 at 1.3).

| | Ours | Rival median ("conveyancing fees") | Best |
|---|---|---|---|
| Words | 5,366 | 1,685 | Quicklaw QLD 1,015 (#1); WhichRealEstateAgent 2,921 (#2) |
| H2s | 15 | 4 | WRA 13: "How Much Does Conveyancing Cost In NSW?", "Conveyancing Fees in Sydney", "... Melbourne, VIC?", "... Brisbane, QLD?", "What Is A Disbursement Fee?" |
| Tables | 9 (74 rows) | 3 of 5 | Quicklaw 32 tables |
| Tool | estimator, 5 inputs | 2 of 5 | Quicklaw 34 inputs |
| Schema | Article, FAQPage, HowTo | FAQ schema 1 of 5 | WRA FAQPage |
| FAQ | 9 | | WRA 7 |
| Query in slug / title / H1 / intro | no / yes / yes / yes | 4 / 4 / 4 / 3 of 5 | |

Title, H1: keep. Intro: keep (answer-first, dated).

H2s to add: split "How much does conveyancing cost in WA, SA, Tasmania, the ACT and the NT?" into one H2 per state ("How much does conveyancing cost in WA? (settlement agents)", SA, Tasmania, ACT, NT), because the queries Google is already testing are per state and per city, and WRA's H2s are per city. Add "Conveyancing fees in Sydney, Melbourne and Brisbane" as H3s under the three state H2s with the city figure if a source gives one, else say none is published.

PAA to answer: "Who is cheaper, solicitor or conveyancer?" (AI 431), "Is a conveyancer cheaper than a solicitor?" (183), "At what stage do you get a conveyancer?", "Are solicitor fees negotiable?", "How much is a typical transfer fee?" (the registry fees are already in the page).

Internal links: 44 in-content inlinks (anchor "conveyancing guide" 18). Add from `src/components/guide/CostOfSellingStateGuide.tsx:66`, which prints a flat "conveyancing runs $800 to $2,500" on all eight state cost guides: take the state figure from `src/lib/conveyancing-costs.ts` and link it, anchor "conveyancing fees in {STATE}", to `/guides/conveyancing-guide#cost-{nsw|vic|qld|other-states}`. One source, and the pages Google sends the queries to pass them on.

Consolidate: none. The review's NSW, VIC and QLD conveyancing pages stay deferred until this guide is indexed. Files: `src/app/(marketing)/guides/conveyancing-guide/page.tsx` (section `cost-other-states`), `src/lib/conveyancing-costs.ts`, `CostOfSellingStateGuide.tsx:66`.

### 3.3 First home grants family: `/guides/first-home-owner-grant-australia`, eight `/guides/first-home-buyer-{state}`, `/first-home-buyers`, `/guides/first-home-buyer-guide`

Targets: "first home owners grant qld" 14,800 (latest month August 2026 8,100), "first home buyer schemes" 9,900 (AI 274), "first home owners grant" 5,400 (AI 545), "first home buyer grant sa" 2,900, "nsw" 2,400, "vic" 1,600, "wa" 1,600. GSC 90 days: 123 impressions on the NSW guide (50.2), 38 QLD (70.7), 22 FHOG (70.3), 17 SA. Fix first (section 0), then request indexing.

| | Ours (FHOG guide) | Rival median ("first home owners grant") | Best |
|---|---|---|---|
| Words | 2,006 | 1,559 | Bank of Melbourne 1,559 (#1, VIC only); Homebuyers Centre VIC 1,930, FAQ 9 |
| H2s | 8 | 5 | Plantation QLD 11: eligibility criteria, definition of a new home, exceptions, how to apply, tips, payment |
| Tables | 1 (9 rows) | 0 of 5 | none |
| Tool | 0 | 2 of 5 (lead forms) | |
| Schema | Article, FAQPage, Speakable | FAQ schema 1 of 5 | |
| Sources and as-at dates | NSW, VIC, QLD only | | QRO, SRO Tas, RevenueWA publish amount by contract date |
| Query in title / H1 | yes / yes | 2 / 1 of 5 | |

For "first home owners grant qld": ours 1,757 words, 9 H2, 0 tables, FAQ 6; rival median 1,522; brisbanehomeloan (#1) 1,869 words, FAQ 17, AggregateRating and a lead form; QRO's own pages are #3 and #5.

Proposed:
- FHOG guide title: "First Home Owner Grant 2026: Amounts and Caps by State" (54). H1: "First Home Owner Grant (FHOG) by state: 2026 amounts and price caps". First sentence: "The First Home Owner Grant is paid by each state and territory, not the Commonwealth, and only on a new home: $30,000 in Queensland for contracts signed from 20 November 2023 (Queensland Revenue Office, read 10 October 2026), $20,000 in Tasmania, $15,000 in South Australia and $10,000 in NSW, Victoria and WA." Every amount from `first-home-grants.ts`.
- `/first-home-buyers` title: "First Home Buyer Schemes 2026: Grants, Deposit, Stamp Duty" (58). H1: "First home buyer schemes and grants in 2026". It owns "first home buyer schemes" (section 4).
- State guide titles: keep.

H2s to add: a "Grants and duty relief by state" table on the FHOG guide and the hub (state, grant, cap, first home duty relief, contract dates, source, checked on), generated from the data file; "What counts as a new home?" (QRO definition; aussiewidefs and Plantation use it as an H2); on the QLD guide "Boost to Buy" (from `SHARED_EQUITY_SCHEMES`).

PAA to answer: "What does it mean if the government owns 30% of your house?" (on the NSW, VIC, SA and Help to Buy NSW SERPs; missing on the state guides); "How much deposit do I need for a $700000 house?" (AI 422; QLD guide); "What qualifies you as a first time buyer?" (AI 26; NSW guide); "What is a 5% deposit on a $600000 house?" (AI 646). Copy in section 6.

Schema: keep FAQPage; the hub's FAQ answers are in FAQPage JSON-LD, so fix them in the data (`persona-hub-content.ts:100-110`).

Internal links: state guides have 8 to 13 in-content inlinks, the FHOG guide 8. After the facts are fixed: `SuburbContextualLinks.tsx:47` sends "First home buyer guide, {STATE}" to `/guides/first-home-buyer-{state}` instead of the national guide (the label already names the state). Hub table rows link the state guides, anchor "First home buyer guide {STATE}".

Remove the unsourced median sections (0.1 row 18) and link the suburb search instead. Consolidate: 301 the schemes-by-state blog post to `/first-home-buyers`. Files: as listed in 0.1 and 0.2.

### 3.4 `/guides/help-to-buy-scheme-australia`

Targets: "help to buy scheme" 12,100 (AI 202, CPC $10.55; 8,100 a month June to August 2026), "help to buy scheme nsw" 1,300. Crawled, not indexed (14 Jul), rewritten 7 Oct. State pages (NSW, VIC, QLD, WA) indexed, crawled 6 Oct.

| | Ours | Rival median | Best |
|---|---|---|---|
| Words | 3,774 | 1,447 | firsthomebuyers.gov.au 1,687 (#1) |
| H2s | 17 | 5 | CommBank 15 (#2): "Property Price Caps", "Help to Buy example", "Eligibility", "Government Scheme Selector Tool" |
| Tables | 5 (34 rows) | 2 of 5 | |
| Tool | 0 (calculator on `/help-to-buy-calculator`) | 1 of 5 | CommBank selector |
| FAQ | 15, FAQPage | 0 of 5 | |
| Query in title / H1 / intro | yes / yes / yes | 3 / 3 / 5 of 5 | |

Gov holds 4 of 5; authority caps the top three, but CommBank and a 209-word Housing Australia media release sit at 2 and 4, so 4 to 8 is reachable once indexed.

Proposed title: "Help to Buy Scheme 2026: Income Limits, Price Caps & Rules" (58; the current one is 70 before the suffix). H1: keep. First sentence: "Help to Buy is the Australian Government's shared equity scheme: it contributes up to 40% of a new home or 30% of an existing one, and for 2026–27 a single applicant's taxable income must be no more than $103,000 (Housing Australia, read 10 October 2026)."

H2s: complete. PAA: all covered. Schema: keep. Tool: embed the calculator's eligibility step (or a "Check your figures" link block above the fold) to match CommBank's selector.

Internal links: 21 in-content inlinks ("help to buy guide" 12). Add from the `/first-home-buyers` table and from `/guides/first-home-guarantee` ("Help to Buy vs the 5% Deposit Scheme"). Consolidate: none; the two Help to Buy news posts already link it. Files: `src/app/(marketing)/guides/help-to-buy-scheme-australia/page.tsx`.

### 3.5 `/guides/building-pest-inspection`

Targets: "building and pest inspection cost" 1,600 (AI 290), "building and pest inspection" 8,100 (AI 785, CPC $20.98). Crawled, not indexed (7 Jul), rewritten 1 Oct.

| | Ours | Rival median (cost) | Best (cost) |
|---|---|---|---|
| Words | 4,695 | 1,326 | visionbuildingreports pricing, 234 words (#1); inscopeinspections Melbourne 1,267 (#2) |
| H2s | 15 | 6 | inscope 10: "Key Takeaways", "Typical ... Price Ranges in Melbourne", "What Do You Get for the Cost" |
| Tables | 2 (18 rows) | 2 of 5 | inscope 3; vision 2 price tables |
| Tool | 0 | 2 of 5 (booking forms) | |
| FAQ | 9, FAQPage | 1 of 5 | WA Building Inspections 9 |
| Query in title / H1 | yes / yes | 1 / 1 of 5 | |

Every cost page that ranks is one city (Toowoomba, Melbourne, QLD, Sydney, Perth). Title, H1: keep ("Building and Pest Inspection Cost 2026: Prices by City", 54).

H2s to add: H3s under "How much does a building and pest inspection cost?" for Sydney, Melbourne, Brisbane, Perth and Adelaide, each one answer-first sentence with the city's row and its source date.

PAA: "What is the biggest red flag in a home inspection?" (AI 477, missing). Head term SERP is local inspectors; leave it.

Internal links: 22 in-content inlinks. Add from `/guides/cooling-off-period-by-state-australia` ("book the inspection before cooling-off ends", anchor "building and pest inspection cost") and the state first home guides' buying steps. Files: `src/app/(marketing)/guides/building-pest-inspection/page.tsx`.

### 3.6 `/guides/buyers-agent-cost-australia` (becomes the buyer's agent hub)

Targets: "buyers agent" 5,400 (AI 2,180, CPC $19.34), "buyers agent fees" 720 (AI 121), "buyers agent cost" 210; plus 206 "{suburb} buyer's agent" queries at 51 impressions a day (section 5). Indexed, last crawl 13 Jul, content unchanged since 6 May. 90 days: 123 impressions at 74.7, mainly city fee queries ("buyers agent cost brisbane" 8 at 80, "buyers agent fees melbourne" 6 at 89). "average buyers agent fee" lands on `/guides/real-estate-commission-nsw` (51.6).

| | Ours | Rival median ("buyers agent") | Best informational / directory |
|---|---|---|---|
| Words | 1,380 | 1,478 | Homely 1,537 (#3); buyersagents.com.au Adelaide 1,478 (#4) |
| H2s | 10 | 1 | Homely 7: "How much does a Buyers' Agent cost?", "Are buyers' agents regulated?", "How do you select a good agent?"; buyersagents.com.au 14: "Buyers agent fees in Adelaide", "How to check an agent before you sign" |
| Tables | 0 | 1 of 5 | buyersagents.com.au fee table |
| Tool / form | 0 | 3 of 5 | |
| Schema | Article, FAQPage | FAQ schema 1 of 5 | ProfessionalService, ItemList, FAQPage |
| Sources and dates on fees | none | | |

Proposed title: "Buyer's Agent Fees 2026: What a Buyers Agent Costs by City" (58). H1: "Buyer's agent fees in Australia (2026): what a buyers agent costs, city by city". First sentence (fill from the sourced table): "A buyer's agent charges a fixed fee or a percentage of the price; published full-service fees in Sydney run $X to $Y ({agency fee pages or survey}, read {date})."

H2s to add: "Buyer's agent fees by city" (sourced, dated table; "no published range" where none exists, the renovation guide's rule); "Are buyer's agents regulated?" (licence by state with the regulator's register: NSW Fair Trading, Consumer Affairs Victoria, Queensland OFT); "Is a buyer's agent worth it?"; "How to check a buyer's agent before you sign". Remove "(Stock and Station)".

PAA: "Are buyers agents worth it in Australia?" (AI 37), "What is a property buyer's agent?" (14), "Why are buyers agents so expensive?", "Do you pay a buyer's agent upfront?" (open since the 30 Sep review), "What is the difference between a selling agent and a buyer's agent?".

Schema: Article + FAQPage; no ItemList or Service until real partner listings exist.

Tool and CTA: replace both "Get the free selling guide" blocks (a buyer's page pushing the seller funnel) with a buyer match form, intent buying, suburb field, and the #57 disclosure: "One buyer's agent receives your details and pays us a fee for the introduction. You pay nothing to us." Fix the link card (0.1 row 17). The B2B page `/real-estate-leads/buyer-leads` tells agents buyer leads come from this guide ("Readers pricing representation"); today the guide has no buyer form.

Internal links: 11 in-content inlinks. Add from the `/find-an-expert` "Buying" block ("what a buyer's agent costs") and from the buyer block on agents pages (section 5). Files: `src/app/(marketing)/guides/buyers-agent-cost-australia/page.tsx`.

### 3.7 `/guides/first-home-guarantee` (5% Deposit Scheme)

Targets: "5% deposit scheme" 5,400 (AI 239), "first home guarantee" 2,900 (AI 104). Indexed (15 Jul); figures from the 7 Oct data file. Too early.

| | Ours | Rival median ("5% deposit scheme") | Best |
|---|---|---|---|
| Words | 2,660 | 606 | firsthomebuyers.gov.au 606 (#1) |
| H2s | 8 | 5 | People First Bank 14 (question H2s) |
| Tables | 1 (11 rows) | 2 of 5 | |
| FAQ | 7 | 1 of 5 | |
| Query in slug / title / H1 / intro | no / no / no / yes | 4 / 3 / 3 / 4 of 5 | |

The scheme's name since 1 October 2025 is the Australian Government 5% Deposit Scheme; three of five rivals put it in the title and four in the slug; ours leads with the old name. Proposed title: "5% Deposit Scheme 2026: Price Caps, Eligibility, No LMI" (55). H1: "Australian Government 5% Deposit Scheme (First Home Guarantee): 2026 caps and rules". First sentence: "The 5% Deposit Scheme lets an eligible buyer purchase with a 5% deposit and no lenders mortgage insurance, under a price cap of $1,500,000 in Greater Sydney (Housing Australia, read 10 October 2026)." URL unchanged.

PAA: "What is a 5% deposit on a $600000 house?" (AI 646), "Is the 5% deposit scheme a trap?" (covered). Internal links: 30 in-content inlinks; add "what LMI would cost without the scheme" to `/lmi-calculator`. Files: `src/app/(marketing)/guides/first-home-guarantee/page.tsx`.

### 3.8 `/guides/first-home-super-saver-scheme` and `/fhss-calculator`

Targets: 6,600 (AI 51) and 390. Indexed (17 Jul; calculator 6 Oct); rewritten 7 Oct. Too early. Ours 3,547 words, 16 H2, 4 tables, FAQ 11 against a median of 1,541; CFS (#1) 1,710 words, FAQ 5; ATO (#3) a hub page. Title is 73 characters; proposed "First Home Super Saver Scheme 2026: Limits, Tax, How to Use" (59). Everything else matches the ATO as of 10 Oct. Request indexing day 2.

### 3.9 `/guides/lenders-mortgage-insurance-guide` and `/lmi-calculator`

Targets: "lenders mortgage insurance" 5,400 (AI 56); "lmi calculator" 3,600; "lenders mortgage insurance calculator" 880. Guide crawled, not indexed (8 Jun).

| | Ours (guide) | Rival median | Best |
|---|---|---|---|
| Words | 1,900 | 817 | Rapid Legal 291 (#1); Home Loan Experts 1,284 (#6), FAQ 7 |
| H2s | 9 | 6 | HLE: "15% LMI Discount For First-Home Buyers", "Is LMI Transferable or Refundable While Refinancing?" |
| Tables | 1 (5 rows, unsourced) | 1 of 5 | |
| FAQ | 6 | 2 of 5 | |
| Query in title / H1 / intro | yes / yes / yes | 5 / 5 / 4 of 5 | |

Fix: replace the hand-typed table and the two dollar claims (0.1 row 16) with a table generated from `LMI_RATES` in `src/lib/lmi-calc.ts` (as `/lmi-calculator`'s "LMI by price and deposit"), source and date shown. Title (67 now): "Lenders Mortgage Insurance 2026: What It Costs, How to Avoid" (60). Then request indexing.

PAA for the calculator: "How much is mortgage insurance on $400,000?" (AI 31). Internal links: the calculator has 4 in-content inlinks. Add from `/guides/first-home-guarantee`, `/first-home-buyers` and the state first home guides' LMI mentions, anchor "LMI calculator". Files: `.../lenders-mortgage-insurance-guide/page.tsx:54, 84, 223-224`, `src/app/(marketing)/lmi-calculator/page.tsx`.

### 3.10 `/guides/section-32-vendor-statement-victoria`

Target: "section 32" 5,400 (AI 237, CPC $4.22). Indexed (20 Sep); 90 days 10 impressions at 79.8, post-deploy 73.5.

| | Ours | Rival median | Best |
|---|---|---|---|
| Words | 2,610 | 1,148 | Consumer Affairs Victoria 916 (#1); Merton Lawyers 992 (#2); RACV 2,265 (#3) |
| H2s | 11 | 5 | RACV 11: "How to get a property's Section 32", "What happens if the Section 32 has something missing, inaccurate, or not provided?" |
| Tables | 0 | 1 of 5 | lawyersconveyancing 4 tables (38 rows) |
| FAQ / FAQPage | 0 / no | 0 of 5 | |
| Author | Andy McMaster | 3 of 5 | |
| Query in slug / title / H1 | yes / yes / yes | 4 / 4 / 4 of 5 | |

Small law firm pages hold 2, 5 and 6: winnable. Title is 115 characters; proposed "Section 32 Vendor Statement (VIC): Contents, Cost and Rules" (59). H1: "Section 32 vendor statement in Victoria: what it contains, what it costs and the buyer's rights". First sentence: "A Section 32 is the vendor statement every Victorian seller must give a buyer before the buyer signs the contract, under section 32 of the Sale of Land Act 1962."

Add: FAQPage with the nine PAA questions (eight are answered in the body); a table "What a Section 32 must contain" (item, what it covers, section of the Act). The page is a blog post (`src/lib/data/blog-posts/section-32-vendor-statement-victoria.ts`, title at line 6) and the blog route `src/app/(marketing)/guides/[slug]/page.tsx` renders no FAQ, so FAQPage needs an optional `faqs` field rendered through `src/components/guide/Faq.tsx`. That is a template change for every blog guide (the contract-of-sale series gains it too), so it counts against the one-template-per-fortnight rule. Internal links: 10 in-content inlinks ("victorian section 32" 4). `CostOfSellingStateGuide` for VIC: "what a Section 32 costs" to this page (it ranks 25.8 for "how much does a section 32 cost in victoria" against this page's 62).

### 3.11 `/guides/how-much-deposit-to-buy-a-house`

Target: "how much deposit do i need for a house" 1,300 (AI 1,042). Indexed (7 Oct); 454 in-content inlinks (the site's best-linked guide here).

| | Ours | Rival median | Best |
|---|---|---|---|
| Words | 1,904 | 1,191 | firsthomebuyers.gov.au 606 (#1); NAB 1,398 (#2) |
| Tables | 0 | 3 of 5 | NAB "Deposit required" table |
| Tool | 4 inputs | 0 of 5 | |
| FAQ | 6, plus HowTo | 1 of 5 | ANZ 5 |

Add a "Deposit by price" table: price ($400,000 to $1,000,000), 5%, 10% and 20% deposits, LMI at 90% and 95% from `lmi-calc.ts`, and first home buyer and standard duty for NSW, VIC and QLD from the engine. It answers the price-point PAAs ("What is the minimum down payment on an 800k house?", "How much deposit do I need for a $700000 house?"). Fix the LMI FAQ (row 16). Title (64 now): "How Much Deposit Do You Need for a House? 2026 Guide" (52). Files: `src/app/(marketing)/guides/how-much-deposit-to-buy-a-house/page.tsx`.

### 3.12 `/guides/buying-property-australia`

Targets: "buying a house australia" 720 (AI 15,000), "how to buy a house in australia" 390 (AI 3,979). Indexed (4 Oct); 174 impressions at 74.9 in 90 days, 79.4 since the deploy; 333 in-content inlinks.

| | Ours | Rival median | Best |
|---|---|---|---|
| Words | 2,782 | 1,715 | Satterley 654, 7 stage H2s (#1 "buying a house australia"); Aussie 1,936, 2 tables (#1 "how to buy") |
| H2s | 14 | 7 | |
| Tables | 0 | 1 of 5 | Aussie 2 |
| FAQ / HowTo | 6 / yes | 0 of 5 | |
| Query in slug / title / H1 / intro | no / no / no / partly | 1 / 2 / 1 / 1 of 5 | |

Our title and H1 say "property"; the query and AI Overview say "house". Proposed title: "How to Buy a House in Australia: 10 Steps (2026)" (46). H1: "How to buy a house in Australia: 10 steps from deposit to settlement (2026)". First sentence: "Buying a house in Australia takes ten steps, from your deposit and pre-approval to settlement, and the upfront costs on top of the deposit are larger than most buyers expect: on a $750,000 home in NSW, stamp duty alone is $27,937 for a buyer who is not a first home buyer (Revenue NSW rates, read 30 September 2026)."

Add a "What buying a house costs upfront" table (duty at $750,000 by state from the engine, conveyancing by state from `conveyancing-costs.ts`, inspection range from the inspection guide, LMI at 90% and 95%). The AI Overview cites Moneysmart, YouTube and Reddit; a dated cost table is what the cited pages elsewhere share. Files: `src/app/(marketing)/guides/buying-property-australia/page.tsx`.

### 3.13 `/guides/cooling-off-period-by-state-australia`

Targets: "cooling off period nsw" 590 (AI 13), "cooling off period qld" 320 (change log). Indexed (13 Jul). Ours 1,355 words, 9 H2, 0 tables, FAQ 6, two source mentions; rival median 565 (all NSW law firms; Gately 1,232 words with a licensed conveyancer's credential). The H2 "Cooling-off by state (2026)" is eight paragraphs; make it a table (state, length, when it starts, penalty, auction, source with date: NSW Fair Trading, Consumer Affairs Victoria, Queensland Property Law Act 2023, SA Land and Business Act, ACT, NT standard contract). Title (74 now): "Cooling-Off Period by State 2026: Days, Penalties, Auctions" (59). PAA: "Can I get out of a contract I just signed?". Low priority; one hour of work.

---

## 4. Cannibalisation

| Query family | Who ranks now | Owner | Action |
|---|---|---|---|
| "{suburb} buyer's agent" (206 queries, 51 a day) | 251 `/suburbs/{slug}/agents` selling-agent pages | `/suburbs/{slug}/agents` for now (Google's pick), the buyer's agent hub for fee intent | Add the buyer block in section 5; do not retitle the agents pages. |
| Buyer's agent fees | "average buyers agent fee" on `/guides/real-estate-commission-nsw` (51.6); "how much does a buyers agent cost north shore" on `/suburbs/north-shore-vic-3214/agents` (85.6, Geelong's North Shore) | `/guides/buyers-agent-cost-australia` | 3.6 rewrite; the commission guide's buyer's agent mention links the hub, anchor "buyer's agent fees". |
| Conveyancing by state | `cost-of-selling-a-house-{wa,sa,nt,qld}` | `/guides/conveyancing-guide` | Indexing first; one conveyancing figure source and a state anchor link from `CostOfSellingStateGuide.tsx:66`. |
| "how much does a section 32 cost in victoria" | `cost-of-selling-a-house-vic` (25.8, 8 impressions) and the section 32 guide (62, 4) | Section 32 guide | Link from the VIC cost guide (3.10). |
| "buying (a) house australia" | `/guides/buying-property-australia` (53% share, 69 to 78) and `/buying-guide` (82) | The step guide | `/buying-guide` stays the PDF opt-in; its intro links "how to buy a house in Australia, step by step". |
| "first home buyer schemes", "first home buyer guide", FHOG | `/first-home-buyers` (hub), `/guides/first-home-buyer-guide`, `/guides/first-home-buyer-schemes-by-state-australia-2026`, FHOG guide | Hub: "schemes"; national guide: "first home buyer guide" and steps; FHOG guide: "first home owners grant" | 301 the 6 May schemes article to the hub (its title is the exact query and its content is the stalest). |
| "5% deposit scheme" | `/guides/first-home-guarantee` and the news post `/guides/5-percent-deposit-scheme-now-open-all-first-home-buyers` (June) | The guide | Retitle the guide (3.7); the news post keeps linking it, anchor "5% Deposit Scheme". |
| State duty for first home buyers | "qld stamp duty calculator first home buyer" 54 impressions went to `/stamp-duty-calculator` (92.6), not the QLD guide | The state guide | Suburb and postcode links to state guides (3.1); the calculator's first home table links each state. |
| "stamp duty on inherited property nsw" | `/guides/selling-a-deceased-estate-property` (9.9) | That guide | Keep; the NSW duty guide links to it. |
| "lmi calculation" | `/lmi-calculator` (55.3) | Calculator for "calculator/calculation", guide for "lenders mortgage insurance" | No change. |

---

## 5. New pages or tools worth building

### 5.1 Buyer's agent: assessment

Demand: "buyers agent" 5,400 a month (12-month average; 9,900 in September 2025, 3,600 in August 2026), "buyers agent sydney" 1,900, "melbourne" 1,900, "fees" 720, "cost" 210; CPCs $19 to $29; AI volume 2,180 on the head term. GSC since the deploy: 206 queries, 2.5 to 51.3 impressions a day, average position 38, 0 clicks, 673 of 681 impressions on `/suburbs/{slug}/agents`. By state: NSW 351, VIC 213, QLD 85, SA 12, WA 10. Clusters: Sydney Inner West 96 impressions in the week (Glebe, Lilyfield, Petersham, Dulwich Hill, Lewisham, Sydenham, Camperdown), North Shore 58, Melbourne bayside and inner south-east 60, Eastern Suburbs 29. Google also picks wrong suburbs ("buyers agent killarney heights" on Killarney Vale's page at 45.5).

What the landing pages offer: a selling-agent page with a commission table and an appraisal form. Three of the five I fetched are noindex (Glebe, Greenwich, Bulimba) because their medians are withheld; NSW's 52% share will drop out as Google recrawls, until the median label is repaired.

What the SERP rewards: agencies and directories with city or region pages, a fee table, "how to choose" and licence checks, FAQ, ProfessionalService and ItemList schema. No suburb-level directory page ranks for the city terms. Authority caps the head term.

Product fit: YPG already sells exclusive buyer leads to buyer's agents (`/real-estate-leads/buyer-leads`, one lead, one agent) and its own break-even table says a lead is worth $750 to $2,500 to an agent on a $15,000 to $25,000 fee at 5% to 10% conversion. The consumer side has `/find-an-expert?intent=buying`, which discloses the fee.

Recommendation:
- **Now, no new URLs:** (a) the hub rewrite in 3.6; (b) on indexable `/suburbs/{slug}/agents` pages, a short block under the match form: "Buying in {Suburb}? A buyer's agent works for you, not the seller." with a buyer match CTA (intent buying, suburb prefilled), the #57 disclosure, and a link to the fee guide; (c) an FAQ on those pages, "Do I need a buyer's agent in {Suburb}?", without any "best" claim. This answers the 51 a day where Google already sends them. Source: `src/app/(marketing)/suburbs/[slug]/agents/page.tsx` with `src/lib/suburb-agents.ts` (the agents pack owns this template; coordinate so it is one template change, not two).
- **When at least one partner buyer's agent has signed per city:** `/buyers-agents/{city}` for Sydney, Melbourne, Brisbane, Gold Coast, Perth and Adelaide (KP for Sydney and Melbourne 1,900 each; the others need a Keyword Planner pull), with Sydney's Inner West, North Shore and Eastern Suburbs and Melbourne's bayside as H2 sections first (the query clusters above), split into URLs only if a region passes 1,000 words of its own material. Format: fee table (dated), how to choose, licence check, FAQ, the buyer match form, ItemList only of real partners. No per-suburb URLs: 15,000 near-identical pages is the doorway pattern, and the suburb variants already reach the agents pages.
- **Do not build** without supply: the form would promise an introduction no one can take.

### 5.2 Other builds

| Build | Demand | SERP format | Where | Note |
|---|---|---|---|---|
| First home scheme checker (state, area, price, new or established, income, single or joint) listing FHOG, duty relief, 5% Deposit Scheme, Help to Buy and FHSS with source and as-at date | "first home buyer schemes" 9,900 (AI 274); feeds "first home owners grant" 5,400 and the state grant terms | Government hubs and CommBank's "Government Scheme Selector Tool"; no third-party tool in the top five | On `/first-home-buyers`, no new URL | Built on `first-home-grants.ts` plus the three federal data files; the same data fixes section 0. |
| "Stamp duty at common prices" table | Price-point PAAs on every state SERP | moneywisecalc, savingsmate, lendology | The eight state guides | 3.1; instead of price-point URLs. |
| Upfront costs table (duty, conveyancing, inspection, LMI) | "buying a house australia" (AI 15,000); "buying a house in qld fees" | Aussie's tables; Home Loan Experts' purchase costs calculator ranks #3 for "help to buy calculator" | `/guides/buying-property-australia` | 3.12. A standalone purchase costs calculator needs a Keyword Planner check first. |
| NSW, VIC, QLD conveyancing cost pages (30 Sep review 3.7) | "conveyancing cost nsw" 480 (AI 211) | NSW-specific provider pages | Deferred | Build only after the conveyancing guide is indexed and its state sections get impressions. |
| Conveyancer or inspector quote pages | "conveyancer" 22,200 (CPC $31), "building and pest inspection" 8,100 (CPC $21) | Local providers, directories | Not now | A new lead product with no supply; Jos's call. |

---

## 6. AI search: unanswered questions and proposed answers

Each answer is answer-first, under 60 words, with one sourced and dated figure. AI volumes from `dfs-ai-volume-paa.csv`.

| Question (AI volume) | Page | Proposed copy | Source |
|---|---|---|---|
| What is a 5% deposit on a $600,000 house? (646) | `/guides/first-home-guarantee`, `/guides/how-much-deposit-to-buy-a-house` | "A 5% deposit on a $600,000 home is $30,000. Through the Australian Government 5% Deposit Scheme an eligible buyer pays no lenders mortgage insurance on that deposit if the price is under the area's cap, for example $650,000 in regional Victoria (Housing Australia, read 10 October 2026). Stamp duty and buying costs are extra." | Housing Australia, 5% Deposit Scheme property price caps |
| What is the biggest red flag in a home inspection? (477) | `/guides/building-pest-inspection` | "The findings most likely to change a purchase are structural: moving footings or cracked walls, roof framing faults, and active termites or termite damage. They can cost more to fix than any discount you negotiate. A combined building and pest inspection on a standard house costs $330 to $1,090 across the capitals (inspector price lists, read 30 September 2026)." | The guide's own cost table sources |
| Who is cheaper, solicitor or conveyancer? (431); Is a conveyancer cheaper than a solicitor? (183) | `/guides/conveyancing-guide` | "Neither is always cheaper. Published averages for a conveyancer's professional fee run from $1,050 in Queensland, where only law firms do conveyancing, to $1,875 in the Northern Territory (OpenAgent, 17 September 2026). Compare written quotes that include searches and registry fees, which cost the same whichever you use." | OpenAgent state averages, as cited in the guide |
| How much deposit do I need for a $700,000 house? (422) | `/guides/how-much-deposit-to-buy-a-house`, `/guides/first-home-buyer-qld` | "You need $140,000 (20%) to avoid lenders mortgage insurance without a scheme. At 5% it is $35,000, and through the 5% Deposit Scheme an eligible buyer pays no LMI where the price is within the area's cap, for example $1,000,000 in Greater Brisbane (Housing Australia, read 10 October 2026). Stamp duty and costs are extra." | Housing Australia caps |
| Can I sell my property to my son for $1? (98) | State duty guides, NSW first | "You can, but the $1 does not set the duty. In NSW transfer duty is charged on the higher of the price paid and the property's market value, and a transfer between related people needs a formal valuation (Revenue NSW, read 10 October 2026). Capital gains tax for the seller is also worked out on market value. Get advice first." | Revenue NSW, "How to calculate transfer duty"; ATO market value substitution rule |
| Who is exempted from stamp duty? (88) | State duty guides, `/stamp-duty-calculator` | "No one is exempt in every state; each sets its own rules. The largest relief is for first home buyers: in NSW an eligible first home buyer pays no transfer duty on a home up to $800,000 (Revenue NSW, contracts from 1 July 2023, read 10 October 2026). Most states also charge little or nothing on some transfers between spouses or from a deceased estate." | Revenue NSW First Home Buyers Assistance Scheme |
| What is the formula for calculating stamp duty? (67) | State duty guides | "Each band has a fixed amount plus a rate on the value above the band's floor. In NSW a home priced between $387,000 and $1,290,000 pays $11,602 plus $4.50 for every $100 over $387,000, so a $750,000 home pays $27,937 (Revenue NSW 2026-27 thresholds, read 30 September 2026)." | Engine `stamp-duty.ts:105-111` |
| How much is mortgage insurance on $400,000? (31) | `/lmi-calculator` | "On a $400,000 loan, one lender's published table gives $7,492 at 90% LVR and $13,380 at 95% LVR, before your state's duty on the premium (Home Loan Experts' lender table, page updated 18 May 2026). Insurers and lenders price differently, so ask your lender for its figure." | `lmi-calc.ts` rates and source |
| Is stamp duty tax deductible? (17, on four SERPs) | State duty guides | "Not on a home you live in, and not as a yearly deduction on an investment property. For a rental, the duty forms part of the property's cost base and reduces the capital gain when you sell (ATO). On a $750,000 Victorian investment property that is $40,070 of duty (SRO Victoria rates, read 30 September 2026)." | ATO cost base guidance; engine VIC table |
| What qualifies you as a first time buyer? (26) | NSW and national first home guides | "It depends on the scheme. A state First Home Owner Grant needs you and your partner never to have owned a home in Australia (the rules vary slightly by state). The federal 5% Deposit Scheme also takes anyone who has not owned property in Australia in the last 10 years (Housing Australia, read 7 October 2026)." | `home-guarantee.ts` `HG_NO_OWNERSHIP_YEARS` |
| What does it mean if the government owns 30% of your house? (on five first home SERPs) | State first home guides' Help to Buy block | "Under Help to Buy the government pays up to 30% of an existing home's price, or 40% of a new one, and owns that share. You pay no rent on it, can buy it back in steps of at least 5% of the home's value, and repay its share of the sale price when you sell (Housing Australia, read 7 October 2026)." | `help-to-buy.ts` |
| At what stage do you get a conveyancer? (conveyancer SERP) | `/guides/conveyancing-guide` | "Before you sign. Have a conveyancer or solicitor review the contract before you exchange, because cooling-off is short and does not apply at auction: in Victoria you have three business days after a private sale (Consumer Affairs Victoria, read 10 October 2026)." | CAV "Buying property by private sale" |

Not for this vertical: "Is $400,000 enough to build a house?" (AI 5,951) appears on the buying guide's SERPs; it belongs to the new homes pack. Off-topic PAAs on these SERPs ("Who are the no. 1 immigrants in Australia?", Warren Buffett rules) are skipped.

None of the 53 AI Overviews in this vertical cites YPG. The most-cited domains: YouTube 13, CommBank 10, stampdutycalcs.com.au 8 (a small calculator site, cited on "stamp duty calculator", the WA, SA and TAS calculator SERPs, "stamp duty nsw", "stamp duty qld" and "stamp duty wa": the format is citable, the domain is small), Mortgage Choice 7, firsthomebuyers.gov.au 7. The WA calculator Overview already states the $600,000 first home threshold; our WA first home guide's $450,000 would never be cited.

---

## 7. Status of the 30 Sep review's items in this vertical

| Review item | Status | Evidence |
|---|---|---|
| 3.2 Stamp duty state guides calculator-first (tracker 20) | Shipped 1 Oct (#92). Too early to read. | Last crawls 17 Jun to 25 Jul; stamp duty impressions flat at 3 a day. Request indexing (1.3). |
| 3.3 LMI estimator | Shipped 1 Oct (#91). Early positive. | Deposit and LMI family 0.1 to 11.3 a day; calculator crawled 1 Oct. The LMI guide is still crawled, not indexed (8 Jun) and its table now contradicts the calculator (0.1 row 16). |
| 3.7 Inspection and conveyancing cost-first rewrites | Shipped 1 Oct (#88). Too early to read. | Both crawled, not indexed, last crawls 7 Jul and 3 Jul. |
| 3.7 NSW, VIC and QLD conveyancing cost pages | Open, deferred by the PR. | Build after the guide indexes (5.2). |
| Section 4 reading 2 / priority 10: index plumbing for zero-impression guides | Plumbing shipped (#90). The manual request indexing for help-to-buy-scheme-australia, lenders-mortgage-insurance-guide, conveyancing-guide and building-pest-inspection is still open. | None of the four has been crawled since June or July. |
| Section 4: "buyers agent" family, 29,250 a month with no impressions | Open. Impressions now 51 a day, on the wrong template. | Section 5.1. |
| Section 4 reading 3: section 32 guide | Shipped 20 Sep. | Indexed, 73.5; title and FAQ schema in 3.10. |
| Section 6 PAA, stamp duty dollar amounts | Partly done. | Worked examples at $500,000, $750,000, $1,000,000 cover three; the common-prices table (3.1) covers the rest. |
| Section 6 PAA, "Who is eligible for stamp duty exemption WA?" | Done on the WA duty guide. | Digest marks it covered. The WA first home guide still contradicts it (0.1 row 4). |
| Section 6 PAA, deposit and LMI | Partly done. | "How much LMI on a 10% deposit?" and "Is $40,000 enough for a house deposit?" covered; "How much deposit do I need for a $700,000 house?" still missing on the QLD and Help to Buy NSW pages. |
| Section 6 PAA, buyer's agents ("Do you pay a buyer's agent upfront?", "Why are buyers agents so expensive?") | Open. | Guide unchanged since 6 May. |
| Section 6 PAA, inspections ("Who pays for building and pest inspection in QLD?", "Can you claim building and pest inspection cost?") | Done in #88. | Digest marks both covered. |
| Section 5 AI, "how to buy a house in australia" (position 67) | Open. | 66.5 since the deploy; title and cost table in 3.12. |

New since that review and not on the tracker: the 7 Oct scheme work (#100, #102, #103) is correct where it reaches; section 0 is what it did not reach.

---

## Verification log (10 Oct 2026)

| Claim checked | Source read | Result |
|---|---|---|
| Help to Buy income limits 2026–27 | firsthomebuyers.gov.au/HTB-thresholds | $103,000 single, $165,000 single parent and joint: matches |
| Help to Buy price caps | firsthomebuyers.gov.au Help to Buy property price caps | All rows match `help-to-buy.ts` |
| 5% Deposit Scheme price caps | firsthomebuyers.gov.au 5% Deposit Scheme property price caps | All rows match `home-guarantee.ts`, including Greater Darwin $750,000 |
| FHSS limits and release share | ATO "About FHSS release amounts" | $15,000, $50,000, 85%: match |
| FHSS deemed rate | ATO shortfall interest charge rates (updated 4 Sep 2026) | 7.51% October to December 2026, 7.43% July to September: match |
| QLD FHOG | QRO first home owner grant eligibility | $30,000 for contracts from 20 November 2023: matches |
| TAS FHOG | SRO Tasmania eligibility | $20,000 for 1 July 2026 to 30 June 2027: first home guide and FHOG guide wrong |
| WA first home owner rate | RevenueWA duties fact sheet | $600,000 / $800,000 from 7 May 2026: WA first home guide, national guide, hub wrong |
| NSW First Home Buyer Choice | Revenue NSW previous schemes | Closed 1 July 2023: NSW first home guide and schemes article wrong |
| NSW first home thresholds | Revenue NSW First Home Buyers Assistance Scheme | $800,000 / $1,000,000 from 1 July 2023: matches |
| NSW dutiable value | Revenue NSW "How to calculate transfer duty" | Higher of price and market value |
| NSW deceased estate duty | Revenue NSW deceased estate concession | $100 concessional rate |
| VIC and WA FHOG amounts | SRO Victoria; RevenueWA | $10,000 each; VIC cap $750,000 |
| SA FHOG cap, NT grants, ACT HBCS | RevenueSA and TRO refused (403); ACT URLs 404 | Relied on our engine's dated notes (30 Sep) and, for SA, the 10 Oct AI Overview quoting RevenueSA |
