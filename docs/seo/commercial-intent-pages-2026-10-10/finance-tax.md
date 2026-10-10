# Finance and tax pack: commercial-intent and competitor-gap findings, 10 Oct 2026

> Part of the [commercial-intent and competitor gap review of 10 October 2026](../commercial-intent-review-2026-10-10.md). Written by a read-only analyst from the evidence pack `data/packs/finance-tax-*` in the run folder `~/Desktop/Ads/ypg-commercial-intent-review-2026-10-10/` (SERP digest, compare rows, GSC queries, intent-match misses, unanswered PAA) and the source at origin/main 9ef5ee7. File and line references are to that commit. Points marked "verify" are the analyst's own knowledge, not a source fetched in this run: check them with the regulator before changing copy. No site code was changed.

Vertical: loans, calculators and property tax (borrowing power, mortgage repayments, affordability, refinancing, rental
yield, LMI, CGT, negative gearing, bridging loans and deposit bonds, depreciation, offset accounts, fixed vs variable,
RBA cash rate, SMSF property).

Evidence: `finance-tax-serp-digest.txt`, `finance-tax-compare.csv`, `finance-tax-gsc-queries.tsv`,
`finance-tax-intent-match.tsv`, `finance-tax-paa-missing.tsv`, and in `../`: `serp-raw.json`, `competitor-pages-parsed.json`,
`gsc-90d-*`, `gsc-post-deploy-*`, `bing-page.csv`, `bing-query.csv`, `clarity-*.json`, `index-status.csv`, `linkgraph.json`,
`kp-targets.csv`, `dfs-ai-volume-*.csv`, `vertical-prepost.csv`. Live pages fetched with curl on 10 Oct 2026. Source cited
from `repo-main/src` (origin/main 9ef5ee7). Read-only throughout.

Two framing facts for this vertical:

- **Google barely sees the tax pages; Bing reads them.** CGT and tax queries run 0.4 impressions a day on Google since the
  deploy (`vertical-prepost.csv`, cgt-tax). On Bing, the CGT article has 95 clicks and 2,292 impressions at 5.2, the SMSF
  guide 8 clicks at 3.3, the RBA page 153 impressions at 7.1 and the stale negative gearing article 100 at 7.0
  (`bing-page.csv`). Bing users are reading exactly the pages that still state the old law or an old cash rate, and they
  ask the questions those pages answer wrongly: "does the new capital gains tax apply to existing investment properties",
  "australia capital gains tax changes existing owned properties grandfathered in?", "is it still possible to purchase an
  investment property in a smsf in australia" (`bing-query.csv`).
- **Tax-news demand is decaying since the Budget spike.** Keyword Planner's monthly series (oldest first, Sep 2025 to
  Aug 2026): "negative gearing" 201,000 in May 2026, 14,800 in August (12-month average 40,500); "negative gearing changes"
  110,000 in May, 8,100 in August; "cgt changes 2026" 1,300 in May, 140 in August; "smsf property" 6,600 in June, 1,300 in
  August. Plan on the August figures, and expect a second spike around 1 July 2027.

---

## 0. Fix first: accuracy and compliance on live pages

Ordered by harm (wrong financial or tax fact on a page people read, then compliance wording, then display faults).
Checked live on 10 Oct 2026.

### F1. /rba-cash-rate shows a cash rate two decisions old

- Live: https://www.yourpropertyguide.com.au/rba-cash-rate
  - "Current RBA Cash Rate 4.35% As of 16 June 2026, Hold"
  - "Held at 4.35% on 16 June 2026 after three consecutive hikes this year"
  - Under "Remaining 2026 RBA Meeting Dates" it still lists "10–11 August 2026" and "28–29 September 2026".
- Fact: the RBA's own page, captured in today's SERP pull, reads "Cash rate target 4.60 % Effective date 30 September
  2026 Next update 2.30 pm, 3 November 2026" (rba.gov.au, Statement by the Monetary Policy Board, media release 2026-27,
  29 September 2026; the AI Overview and Canstar describe it as the fourth rise of 2026). The 11 August decision (a hold,
  since 29 September was the fourth rise) and the 29 September rise to 4.60% are missing.
- Exposure: Bing 153 impressions at 7.1 in 90 days; Google 97 at 59.4; 11 in-content inlinks, including the APRA buffer
  and market wrap articles.
- Source: `src/app/(marketing)/rba-cash-rate/page.tsx:30-31` (latest entry 2026-06-16), `:72-77` (upcomingMeetings2026),
  `:138` (dateModified 2026-06-16), `:165` and `:176` ("Held at 4.35%", "full analysis of the June 2026 decision"), `:321`;
  `src/lib/data/data-updates.ts:24-28`.
- Fix: add the August and September decisions, the 4.60% headline with "effective 30 September 2026", next decision 3
  November 2026 at 2.30pm, drop past meetings from "Remaining", and set dateModified. Then stop it recurring: the page says
  "Updated with each RBA decision" (meta description) but is a hard-coded array; give it a dated data file with a
  checklist item on each meeting day (or a sync from RBA table F1), and a build-time test that fails when the latest
  entry is older than the last scheduled meeting.

### F2. /guides/federal-budget-2026-property tells owners they keep the 50% CGT discount

Tracker item "3.3b follow-up" lists it as open. Still live today:

- https://www.yourpropertyguide.com.au/guides/federal-budget-2026-property
  - "Existing investors grandfathered: anyone who owns a residential investment property on 12 May 2026 keeps their
    current tax treatment for that property" (`src/lib/data/blog-posts/federal-budget-2026-property.ts:18`)
  - "50% CGT discount replaced with cost base indexation plus a 30% minimum tax on net capital gains for residential
    investment property" (`:16`; the Act covers every CGT asset of individuals, trusts and partnerships)
  - "New homes are exempt, a property that was a new build when first acquired by the investor keeps the old 50% discount
    treatment. Like negative gearing, existing properties owned on 12 May 2026 are fully grandfathered." (`:35`; new builds
    get a choice of discount or indexation, for the first buyer only)
  - "Any property you owned on 12 May 2026 keeps negative gearing eligibility against salary income, and keeps the 50% CGT
    discount on sale." (`:42`)
  - "Existing investors: fully grandfathered" (`:77`), "Your existing properties are grandfathered. The instinct to sell
    quickly to lock in the old CGT discount..." (`:90`), "the policy is now law from budget night" (`:95`; passed 25 June
    2026, applies from 1 July 2027).
  - Footer "Last updated May 2026"; JSON-LD dateModified 2026-05-13.
- What the law says, per our own corrected article (#95) and its sources (ATO reform page, last updated 29 June 2026;
  Treasury Laws Amendment (Tax Reform No. 1) Act 2026, Royal Assent 26 June 2026): the CGT change applies from 1 July 2027
  to gains accruing from that date on assets already owned, split at 1 July 2027; the 12 May 2026 cut-off is negative
  gearing only.
- Exposure: Google "crawled, currently not indexed" (last crawl 3 Jul); no Bing row; 2 in-content inlinks. Low traffic,
  but it is live, indexable and contradicts three of our pages.
- Fix: the #95 pattern. Dated correction note at the top naming what it said, body rewritten to the Act for the CGT part,
  keep the Budget's supply and first home buyer sections, updatedAt, link to /guides/cgt-changes-2026-budget with the
  anchor "how the CGT change works from 1 July 2027".

### F3. /guides/negative-gearing-changes-2026-budget says it "reflects the rules as legislated" and does not

- https://www.yourpropertyguide.com.au/guides/negative-gearing-changes-2026-budget
  (`src/lib/data/blog-posts/negative-gearing-changes-2026-budget.ts`)
  - Banner: "Update (July 2026): these changes are now law. ... The explainer below reflects the rules as legislated."
    (`:9`)
  - "SMSF investors purchasing new residential property within their fund, same rules apply" (`:43`; the tracker records
    that super funds are excluded)
  - "Trust and company structures: these were never subject to "personal" negative gearing anyway." (`:95`; the tracker
    records that the change covers companies and most trusts; check against s 26-155 of the Act when rewriting)
  - "The combination of full negative gearing, full CGT discount (new homes are exempt from those changes too)" (`:61`;
    new builds keep a choice, first buyer only)
  - "the policy is now law from budget night" (`:99`)
  - "Use our negative gearing calculator" links to `/tools/negative-gearing-calculator` (`:107`), which answers 404 today.
  - Broken markup shown to readers: "Talk to a mortgage-broker" class="glossary-link" data-glossary-slug="mortgage-broker">mortgage broker about lending impacts." See F12 for the cause.
- Exposure: Bing 100 impressions at 7.0 (0 clicks), the page Bing shows for "negative gearing changes" (12,100 average,
  8,100 in August). Our own /negative-gearing-calculator links readers to it with the anchor "who is grandfathered and what
  counts as a new build".
- Fix: same treatment as #95 (correction note, body to the Act, FAQ), link fixed to `/negative-gearing-calculator`. It
  becomes the owner of "negative gearing changes" (section 4).

### F4. The CGT calculator widget uses retired tax rates and gives companies the discount

- https://www.yourpropertyguide.com.au/cgt-calculator
  - Marginal rate buttons "19% 32.5% 37% 45%" (`src/components/calculators/CGTCalculator.tsx:8`, `:284`). Those are the
    2023-24 rates. The ATO's 2026-27 resident rates are nil, 15%, 30%, 37% and 45% (last updated 13 August 2026), and our
    own negative gearing calculator already prints them.
  - Ownership "Company" gets the 50% discount: the engine halves the gain for every ownership type when held more than a
    year (`CGTCalculator.tsx:69-74`), while the page says "Companies do not qualify." Companies also pay the company rate,
    not a marginal rate.
  - No Medicare levy (2%) in "Estimated CGT Payable $37,000" (`:85`); `yearsHeld > 1` (`:62`, `:72`) misses a sale at
    exactly 12 months.
  - No 1 July 2027 mode. The page is honest about it ("This calculator applies the rules for gains before 1 July 2027"),
    but the tracker's open item stands, and the SERP now has calculators that do it (Richify: "Calculate Australian CGT
    under the 2026-27 rules (50% discount) or for a sale from 1 July 2027"; Sharesight's "Australian CGT Reform
    Calculator").
  - Sidebar on every calculator: "Real lender policies vary widely, especially around income shading, HEM tables, and
    existing debts." and "Every figure on this page is sourced and dated." (`src/components/calculators/CalculatorPageLayout.tsx:141-153`).
    On the CGT, rental yield, negative gearing and LMI pages the first is off-topic, and the second is untrue where defaults
    carry no source (F10).
- Fix: see P1 for the engine changes. The rate buttons and the company branch are the fix-first part.

### F5. Glossary entries state the old rules

- https://www.yourpropertyguide.com.au/glossary/capital-gains-tax-cgt: "Properties held for more than 12 months receive a
  50% CGT discount." No mention of 1 July 2027 (`src/lib/data/glossary.ts:93-94`). Google: 178 impressions at 69.9 in 90
  days ("cgt on property", "cgt selling property", "capital gains on residential property"). Correction to the tracker's
  note: this entry is not auto-linked from articles. The linker wraps each term in `\b...\b`, and a term that ends in ")"
  ("Capital Gains Tax (CGT)", "Lenders Mortgage Insurance (LMI)", "Cash Rate (RBA)") can never match, so it has 1
  in-content inlink. Its exposure is its own ranking.
- https://www.yourpropertyguide.com.au/glossary/negative-gearing: "This loss can be used to offset other taxable income,
  reducing the investor's tax bill." (`glossary.ts:399-400`). This one is auto-linked from 7 pages.
- Fix: one sentence each with the 1 July 2027 change and the ATO date; both entries already link the corrected guides.

### F6. /guides/smsf-property-guide still describes new SMSF property borrowing as available

- https://www.yourpropertyguide.com.au/guides/smsf-property-guide: "SMSFs can borrow money to purchase property through a
  Limited Recourse Borrowing Arrangement (LRBA)." Key facts: "Borrowing requires a Limited Recourse Borrowing Arrangement
  (LRBA)". FAQ "What is an LRBA?" and the minimum balance FAQ assume a new LRBA. "Updated April 2026".
- Our now-law article (24 Jul 2026): "A Senate amendment ends new limited-recourse borrowing arrangements for residential
  property in self-managed super funds, effective 45 days after royal assent. Existing SMSF loans are grandfathered. ... our
  SMSF property guide covers what remains possible." The guide does not. Aussie, ranking for "smsf property", says the same
  as our news piece.
- Exposure: Bing 8 clicks, 100 impressions at 3.3 (the vertical's second-best Bing page); Bing query "is it still possible
  to purchase an investment property in a smsf in australia" at 10.
- Source: `src/app/(marketing)/guides/smsf-property-guide/page.tsx:18`, `:21`, `:52`, `:62`, `:77-89`, `:217-235`.
- Fix: rewrite the borrowing section to the Act (start date, 45 days after 26 June 2026 is 10 August 2026; whether
  commercial property is covered: check the supplementary explanatory memorandum before writing), keep the CGT-in-super
  facts consistent with the CGT article (super funds outside indexation, one-third discount), Sources block, updatedAt.

### F7. /guides/fixed-vs-variable-rate-guide describes a rate-cutting cycle in a year of four rises

- https://www.yourpropertyguide.com.au/guides/fixed-vs-variable-rate-guide: "As of April 2026, the RBA has moved through a
  significant rate hiking cycle (2022 to 2023) and has subsequently begun reducing the cash rate. In a rate-cutting
  environment, variable rates have generally performed better than fixed rates..."
- Fact: rises on 3 Feb, 17 Mar, 5 May and 29 Sep 2026 take the cash rate to 4.60% (our own history table plus the RBA).
- Exposure: small ("should i fix my home loan or stay variable in 2026?" 7 impressions at 10.4), but it is advice-shaped.
- Source: `src/app/(marketing)/guides/fixed-vs-variable-rate-guide/page.tsx:264-266`, updatedAt `:22`.

### F8. /investing hub FAQs describe the 50% discount and negative gearing without the 2027 changes

- https://www.yourpropertyguide.com.au/investing: "Individual investors (and most trusts) who hold an investment property
  for more than 12 months only pay CGT on 50% of the gain." and "Negative gearing lets you deduct the loss on an investment
  property ... against your other income, reducing your tax bill." Neither says what changes on 1 July 2027.
- Source: `src/lib/persona-hub-content.ts:234-241` and `:261`. Add one sentence each with the date and a link to the
  corrected guides.

### F9. Approval, match and saving promises

The brief's rule: no approval, borrowing or saving promises. Live wording that breaks it:

| Live page | Quote | Source |
|---|---|---|
| /investing | "What an investor loan will actually approve, after the APRA buffer and rental income shading." | `src/lib/persona-hub-content.ts:224` |
| /first-home-buyers | "What a lender will actually approve on your income and expenses." | `persona-hub-content.ts:86` |
| /upgrading | "What a lender will approve on your current income and equity position." | `persona-hub-content.ts:292` |
| /buying-guide (and its thanks page, the homepage card, a lead email) | "What lenders will actually approve, buffer included" | `src/app/(marketing)/buying-guide/page.tsx:185`, `buying-guide/thanks/page.tsx:166`, `src/components/home/GuidePathCard.tsx:38`, `src/lib/lead-emails.ts:424` |
| guide registry blurb | "What a lender will approve, how to structure the loan..." | `src/lib/guides/registry.ts:186` |
| /refinancing-calculator | "Confirm a new lender will approve you before you discharge." | `src/app/(marketing)/refinancing-calculator/page.tsx:70` |
| /find-an-expert (target of every "Talk to a mortgage broker" CTA in this vertical) | "They know which lender will say yes to your situation" and the H1 "We'll find the right person" | `src/app/(marketing)/find-an-expert/page.tsx:67`, `:140` |
| /guides/how-to-choose-a-mortgage-broker | "The right broker saves you tens of thousands of dollars over the life of your loan." | `src/app/(marketing)/guides/how-to-choose-a-mortgage-broker/page.tsx:152` |

Replacement pattern: "An estimate of what a lender may lend on your income and expenses, at the APRA buffer". For the
broker blurb: "A broker compares many lenders' policies for your situation". The find-an-expert page already carries the
fee disclosure ("The specialist pays us a fee for each introduction"), so only the promise wording changes.

### F10. Calculator figures: what is sourced and dated, and what is not

| Figure | Where | Source and date on the page? | Finding |
|---|---|---|---|
| 9.2% default assessment rate | /borrowing-power-calculator, /affordability-calculator | Yes: 6.2% RBA table F6 (FLRHOFVA, July 2026) plus APRA's 3 points confirmed 28 May 2026, "as at 30 September 2026" | Correctly sourced, but the cash rate rose 0.25 points on 29 Sep. Move `REFERENCE_LOAN_RATE` (`src/lib/utils/borrowing-power.ts:45-46`) when F6 publishes August and September; until then add "before the 29 September 2026 cash rate rise" to the assumptions line. On the page's own rule (about 8% per point) the figures read about 2% high. |
| "each dollar of monthly expenses removes roughly $130 of loan" | /borrowing-power-calculator FAQ | Engine-derived claim | Wrong by the page's own numbers: the $800 HEM gap between the two $150,000 couples moves the loan from about $600,000 to $517,000, which is about $104 a dollar (0.85 x 122 at 9.2% over 30 years). $130 is the purchase price at a 20% deposit, not the loan. `src/lib/borrowing-power-table.ts:111`; same conflation in `src/lib/affordability-table.ts:68` ("$130 of borrowing capacity"). |
| Net income = gross x 0.72 | borrowing and affordability engines | Disclosed ("a simple 72% net factor") | Understates lower incomes: at the ATO 2026-27 rates plus the 2% Medicare levy, net is about 84% of $60,000, 77% of $100,000 and 70% of $200,000. The $60,000 single row would rise by roughly a third, the $100,000 row by about a tenth, the $200,000 row fall slightly. `src/lib/utils/borrowing-power.ts:6`, `:92`. Use the ATO table the negative gearing engine already holds. |
| Indicative HEM table | /borrowing-power-calculator | Dated "October 2026", labelled "Your Property Guide estimate" | Honest, but the "ranges comparison sites report" are not named on the page (they are named only in `src/lib/data/hem.ts:1-15`). Name them with dates and say the income-band and regional factors (0.85, 1.15, 1.3, 0.92, $350 a dependant) are our assumptions. Also, the "Borrowing power by income" table says each row uses the HEM for its band, but it enters $2,000 for every row (`borrowing-power-table.ts:30-31`), so the $60,000 and $70,000 single rows use $2,000, not the $1,700 band figure. |
| 9.3% bridging rate example | /bridging-loan-calculator and the guide | Yes: "Westpac, the St.George group and Bendigo Bank published 9.28% to 10.29% ... read on 6 October 2026", plus a bank-by-bank table with read dates | Good. |
| 6.5% rate on the end debt | /bridging-loan-calculator, bridging guide | No | `EXAMPLE_ONGOING_RATE = 6.5` (`src/lib/bridging-calc.ts:35`) has no source or date; borrowing uses 6.2% from F6. |
| 6.5% default loan rate | /mortgage-calculator ("Updated April 2026") | No | `MortgageCalculator.tsx:93`. |
| 6.5% current vs 5.9% new rate | /refinancing-calculator ("Updated April 2026") | No | `RefinancingCalculator.tsx:63-64`. RBA table F6 publishes outstanding and new-loan variable rates; use that gap with its month. |
| LMI premiums and duty | /lmi-calculator | Yes: Home Loan Experts table updated 18 May 2026, read 30 Sep 2026; each revenue office dated; Helia quotes beside ours | Good. Inconsistent with the deposit guide (F11). |
| Marginal rates 19/32.5/37/45 | /cgt-calculator | No | F4. |

One constant for "today's average new variable rate" (F6, with its month) should feed the borrowing, affordability,
mortgage, refinancing and bridging defaults so they move together.

### F11. The deposit guide's LMI range contradicts our LMI calculator

- https://www.yourpropertyguide.com.au/guides/how-much-deposit-to-buy-a-house: "Practically, expect to pay $15,000 to
  $25,000 in LMI on a $600,000 to $700,000 loan." (5% deposit). Our /lmi-calculator table, same day: $22,789 on a
  $600,000 price with 5% down (a $570,000 loan) and $30,676 on $700,000 (a $665,000 loan), before duty.
- Source: `src/app/(marketing)/guides/how-much-deposit-to-buy-a-house/page.tsx:89`, `:171`. Quote the calculator's
  figures with its source line (shared with the buying pack).

### F12. Display faults readers can see

- Glossary auto-linker nests anchors. After it links "Mortgage Broker" it matches "mortgage" inside the new link's own
  href and links it again, so readers see raw markup (F3). Cause: `src/lib/utils/glossary-linker.ts:113-123` runs each
  term against `text` that already contains inserted HTML. Simulating the linker over the 58 posts in
  `src/lib/data/blog-posts/` gives four affected: negative-gearing-changes-2026-budget, how-to-buy-property-interstate-australia-2026,
  contract-of-sale-wa, first-home-buyer-schemes-by-state-australia-2026. Fix: collect matches on the original text, skip
  overlaps, then insert. Same file: terms ending in ")" never match (F5).
- /refinancing-calculator shows "We&rsquo;ll match you with a broker who can compare 30+ lenders." (entity inside a JS
  string, `refinancing-calculator/page.tsx:72`). /glossary/capital-gains-tax-cgt shows "Buyer&apos;s Agent" under Nearby
  terms.
- Article template: the CGT article, rewritten 1 Oct, shows "13 May 2026" twice at the top (publishedAt) and the update
  only in the footer (`src/app/(marketing)/guides/[slug]/page.tsx:100-107`, `:141-145`). On a corrected tax article the
  update date belongs at the top. Three different writers (Andy McMaster, Bec Ramirez, Ellie Johnston) carry the same bio,
  "Editor of Your Property Guide...", because `src/components/guide/AuthorBylineCard.tsx:66` hard-codes it, and the
  byline links all go to `/about#andy-mcmaster` (`[slug]/page.tsx:125-136`). Misattributed authorship on YMYL tax pages
  is a trust problem.
- Header Tools menu lists 11 calculators but not LMI or Negative gearing, the two built on 1 Oct
  (`src/components/layout/Header.tsx:56-67`); they are footer-only. In-content inlinks: /lmi-calculator 4,
  /negative-gearing-calculator 6 (`linkgraph.json`).

---

## 1. Where we match commercial intent (keep doing)

| What | Numbers | Why it works |
|---|---|---|
| LMI calculator (new 1 Oct, #91) | 132 Google impressions in its first 10 days at 31.2; "lenders mortgage insurance calculator" 35 at 10.9, "lmi calculator" 26 at 16.0, "mortgage insurance calculator nsw" 6 at 13.3. Deposit and LMI vertical 0.1 to 11.3 impressions a day; right page on 48 of 51 commercial impressions (94%) | Tool first, every premium and duty rate sourced and dated, insurer quotes printed beside ours. The live SERP does not show it in the top 20 yet: Google is testing it. Keep the page as is. |
| Negative gearing calculator (#91) | 15 impressions at 6.5 since 1 Oct; "negative gearing calculator" 13 at 7.3 | ATO 2026-27 rates with date, the guide's worked example as the default, the 1 July 2027 effect in dollars. Testing, not ranking; no title change. |
| Borrowing power calculator (#85, #104) | Borrowing vertical 22.8 to 49.1 impressions a day, position 71.9 to 65.0; right page 86% (179 of 209) | Server-rendered income and HEM tables, assessment rate sourced to RBA F6 and APRA with dates. Google last crawled it 25 Aug, so none of this has been seen yet. |
| Rental yield calculator (#85, #31) | 2,924 impressions on 183 queries in 90 days at 80.0; since the deploy 221 at 68.1; yield vertical 16.2 to 23.0 a day, position 73.6 to 52.8 | Worked example, "What is a good rental yield in 2026?" from gated data, suburb lookup. Recrawled 7 Oct: too early to read. |
| CGT article after #95 | Bing 95 clicks, 2,292 impressions at 5.2; Clarity 128 organic sessions, 225 seconds active, 52% scroll, the most-read organic page on the site | Correction note, the Act, explanatory memoranda, Budget explainer and ATO, all linked and dated. Bing users ask whether the change hits property they already own, and this page answers it correctly. |
| Bridging calculator and guide | Calculator crawled 6 Oct; guide Bing 2 clicks, 89 impressions at 6.0 | The only page in the vertical with a lead path that pays (appraisal form, one-agent fee disclosure, `AppraisalForm.tsx:266`), and a bank-by-bank table read 6 Oct 2026. |
| Affordability calculator | Since the deploy 75 impressions at 34.2 against 67.5 over 90 days; Bing 20 impressions at 4.0 | SERP has no banks in the top 10. The 8 Oct title and table are not crawled yet (last crawl 16 Sep). |

Keep: tool first, server-rendered tables built from the engine, a named source and a date beside every rate, "estimate,
not a quote" wording, and one lead path per page with the fee disclosure.

---

## 2. Where we miss, by query type

### Which calculator SERPs are winnable and which are bank-locked

Live SERP, AU desktop, 10 Oct (`serp-raw.json`; word counts from the digest). "Banks" counts lenders and bank-owned brokers.

| Query | KP / AI | Banks or gov in top 10 | Smallest page ranking | Our GSC | Verdict |
|---|---|---|---|---|---|
| mortgage repayment calculator | 135,000 / 95 | Moneysmart #1, 8 banks | Peoplefirst 602 words | 0 | Locked |
| mortgage calculator | 90,500 / 538 | Moneysmart #1, 8 banks | Moneysmart 371 | 23 at 97.4 | Locked |
| home loan calculator | 60,500 / 140 | Moneysmart #1, 8 banks | NAB 135 | 5 at 98.8 | Locked |
| borrowing power calculator | 33,100 / 23 | 7 banks; broker templates (smartonline) at 7 and 10, money.com.au 9 | Unloan 763 | 466 at 87.6 | Locked at the top, small broker pages below 7 |
| how much can i borrow | 12,100 / 949 | 6 banks and bank brokers | YBR 199 | 139 at 50.6 | Mostly locked |
| borrowing capacity calculator | 12,100 / 18 | Moneysmart, 9 banks | NAB 1,162 | 56 at 68.4 | Locked |
| bridging loan calculator | 1,300 / 16 | 3 banks (CBA #1) | MA Money 57, IFG 272 | 3 at 70 | Winnable |
| cgt calculator | 4,400 / 76 | ATO #1, small-business gov #2 | Smart Property Investment 290 (titled 2018) | 0 | Winnable below the ATO |
| capital gains tax calculator property | 880 / 128 | 2 gov, no banks | accountants, 1,300 to 2,750 | 0 | Winnable |
| rental yield calculator | 3,600 / 11 | none | Den Real Estate 53 | 73 at 63.1 | Winnable |
| calculate rental yield | 3,600 / 11 | none | Hudson 68, Manage Me 113, Hartley 146 | 112 at 77.3 | Winnable (agency tool pages) |
| lmi calculator | 3,600 / 40 | ING (an index page, 118 words), Moneysmart | ING 118, Moneysmart 371 | 26 at 16.0 | Winnable |
| lenders mortgage insurance calculator | 880 / 5 | Helia #1, 5 banks | Helia 295, Stanford 516 | 35 at 10.9 | Bank-leaning |
| negative gearing calculator | 2,400 / 9 | CBA, Treasury | Stanford Financial 232 (#1) | 13 at 7.3 | Winnable |
| refinance calculator | 1,900 / 43 | 2 banks | Community First 51, Resolve 495 (#1) | 0 | Winnable |
| affordability calculator | 210 / 41 | none (1 gov, a student cost-of-living tool) | buyersagentperth 664 | 13 at 91.8 | Winnable, small |

Authority is the ceiling on the six locked SERPs (58 referring domains, none strong; CommBank is cited in 17 of the 34 AI
Overviews in this vertical, NAB and Westpac 11 each, us in none). Leave the mortgage head terms. Work the long tail and
the winnable rows.

### Type A: calculator head terms on bank SERPs

- Queries: the six "Locked" rows above. Combined Keyword Planner volume 343,300; AI 1,763.
- Top 5 reward: a lender's tool with an application path, 135 to 2,665 words, H2s 0 to 12, tables on 0 to 2 of 5
  (usually none), FAQPage on 0 to 2 of 5, no named author.
- Ours: /borrowing-power-calculator 2,511 words, 9 H2s, 2 tables, 6 inputs, 8 FAQs; /mortgage-calculator 1,207 words, 1
  table. We already out-build them; the gap is authority. Google shows the borrowing calculator 4,120 times in 90 days
  and the long tail is where it sits highest ("how much can i borrow mortgage" 45 at 28.8, "home loan borrowing
  calculator" 102 at 43.1).
- Action: no more on-page work on the head terms. Win the dollar long tail (Type E) from the same engines.

### Type B: calculator terms on small-page SERPs

- Queries: rental yield (3,600 + 3,600 + 720 "yield calculator" + 210 + 170), LMI (3,600 + 880), negative gearing (2,400),
  CGT (4,400 + 880), refinance (1,900), bridging (1,300), affordability (210 + 140).
- Top 5 reward: the tool above the fold (inputs on 3 to 5 of 5), short pages (median 146 to 814 words), "calculator" in the
  slug, title and H1 (3 to 5 of 5), rarely a table or FAQ schema. Exception: CGT, where the newer tools model the 1 July
  2027 rules.
- Ours: every page has the tool, more words, tables and FAQPage. Misses: /refinancing-calculator has 0 impressions in 90
  days and lacks the word "refinance" in slug and H1 (compare.csv: `kw_slug_ours` and `kw_h1_ours` False); /cgt-calculator
  has 17 impressions and retired tax rates; /lmi-calculator and /negative-gearing-calculator are not in the header menu.
- Impressions: rental yield 2,924 (90 days), affordability 1,101, LMI 132 (10 days), CGT calculator 17, NG calculator 15,
  bridging calculator 9, refinancing 0.

### Type C: tax law and tax news

- Queries: "negative gearing" 40,500 (AI 685; 14,800 in August), "negative gearing changes" 12,100 (AI 82; 8,100 in
  August), "capital gains tax on property" 880 (AI 1,298), "6 year rule capital gains tax" 1,900 (AI 408), "cgt changes 2026"
  260 (AI 30), "smsf property" 1,600 (AI 286).
- Top 5 reward: government sources on the change itself ("cgt changes 2026": ATO, budget.gov.au, Treasury consultation,
  APH Bills Digest, PBO, 6 of 10), news (AFR, SBS) and accountants for "negative gearing changes" (authors on 5 of 5),
  accountants with long worked guides for "6 year rule" (Bentleys 2,936 words, Endurego 4,408, AWTS 4,484; ATO #1, last
  updated 22 June 2026). Freshness: InvestorKit, at 6 for "negative gearing", leads with "Updated 8 October 2026 for the
  new rules".
- Ours: the CGT article is the best-sourced non-government page on the SERP but Google has shown it 0 times in 90 days
  (indexed, last crawled 26 Jul, so Google holds the pre-correction version). /guides/negative-gearing-australia: 171
  impressions at 82.7, last crawled 3 Jul (before #95). The two news posts still carry the old law (F2, F3). No page for
  the 6-year rule.
- Gap: recrawl, correctness, FAQPage on the articles (0 FAQs on all three news posts), and one owner per query (section 4).

### Type D: loan product explainers

- Queries: "bridging loan" 5,400 (CPC $21.30, AI 733), "offset account" 5,400 (AI 468), "depreciation schedule" 2,900
  (CPC $23.54, AI 204), "home loan pre approval" 2,400 (CPC $65.78, AI 83), "fixed vs variable home loan" 210, "property
  depreciation" 210 (AI 304).
- Top 5 reward: lenders' product pages and brokers (bridging: Bridgit x2, loans.com.au; offset: The Conversation, Reddit,
  Hunter Galloway with 4 tables, money.com.au's offset calculator with 2 tables); for depreciation, quantity surveyors
  and the ATO (BMT's rate finder is a tool). Tables and tools beat prose.
- Ours: long guides, few tools. Offset guide: 2,542 words, 0 tables, last crawled 21 Jun; its SERP's PAA "Is money in an
  offset account taxed?" and "What are the potential disadvantages of having an offset account?" are unanswered. Depreciation guide: "schedule" in neither title nor H1 (the 30 Sep review flagged this; still open).
  Pre-approval and mortgage broker guides: "crawled, currently not indexed" (17 Jun and 15 Jul).
- Bing reads these: offset 4.8, bridging 6.0, depreciation 6.3.

### Type E: dollar-amount questions (PAA and AI long tail)

- Questions: "How much is a $600000 mortgage monthly?" (AI 1,133), "How much capital gains tax will I pay on $300,000?"
  (AI 468), "How much deposit do I need for a $700000 house?" (AI 422), "How much is $100,000 a year taxed in Australia?" (AI
  330), "How much do you need to earn for a $700000 mortgage?" (on 6 of our SERPs: pre-approval, borrowing capacity,
  mortgage, home loan, bridging, offset). GSC on /mortgage-calculator: 541 queries, 873 impressions in 90 days, most of
  them "repayments on 400k mortgage", "500k mortgage repayments", "what are the repayments on a 600k mortgage" at 78 to 91.
- Top 5 reward: the AI Overview answers these from bank calculators. The PAA block rewards a one-line answer with the
  figure.
- Ours: the engines exist; the answers are not on the pages. Server-rendered tables by loan size and income, and FAQ
  entries with the worked figure, are cheap and carry no authority penalty.

### Type F: rate data

- "rba cash rate" 18,100 (AI 209; 33,100 in hike months). SERP: rba.gov.au three times, ASX rate tracker, InfoChoice (95-row
  table, Dataset schema), Canstar, Macquarie, Trading Economics, NAB twice. Locked to authority and freshness. Ours: 581
  words and stale (F1). Bing 7.1. Value is in being right for Bing and as a link target; do not chase Google.

---

## 3. Page-by-page gap and fix list (ranked by demand x winnability)

Rival medians and bests are from `finance-tax-compare.csv` and the digest (top 5 parsed). "Carries query" = all key terms
present.

### P1. /cgt-calculator (with the widget)

Demand: "cgt calculator" 4,400 (AI 76), "capital gains tax calculator property" 880 (AI 128); partly "6 year rule
capital gains tax" 1,900 (AI 408). GSC 17 impressions in 90 days; crawled 1 Oct. Winnable below the ATO.

| | Ours | Rival median ("cgt calculator") | Best rival |
|---|---|---|---|
| Words | 1,566 | 401 | Richify 2,557 (#5) |
| H2s | 7 | 5 | Sharesight 20 |
| Tables | 0 | 1 of 5 | Sharesight 1 |
| Tool | 6 inputs | 3 of 5 | Richify 10 inputs, 2027 mode |
| Schema | WebApplication, FAQPage | FAQPage on 1 of 5 | Richify FAQPage, HowTo, WebApplication |
| FAQ | 6 | 1 of 5 with FAQ schema | Richify 11 |
| Author | none | 0 of 5 | none |
| Slug / title / H1 / intro carry query | yes / yes / yes / yes ("capital gains tax calculator property": H1 lacks "property") | 3/5, 3/5, 3/5, 2/5 | |

- Proposed title (56 characters): CGT Calculator for Property: 50% Discount and 2027 Rules
- H1: Capital gains tax calculator for property: before and after 1 July 2027
- First intro sentence: Estimate the capital gains tax on selling an Australian investment property, with the 50% discount on
  the gain up to 1 July 2027 and indexation and the 30% minimum tax on the gain after it, at the ATO's 2026-27 resident
  rates (last updated 13 August 2026).
- H2s to add: "CGT on a $100,000, $200,000 and $300,000 gain" (table); "Selling after 1 July 2027: the split, indexation
  and the 30% minimum"; "The 6-year rule for a former home" (from ATO, Bentleys, the PAA); "Companies, trusts and SMSFs"
  (Ensure Legal's and Home Loan Experts' H2s); "Capital losses" (terms most rivals use that we don't: capital loss,
  carried forward, CGT event).
- PAA to answer: "How much capital gains tax will I pay on $300,000?" (AI 468, missing); "How much capital gains do I pay
  on $100,000?" (AI 534 in the PAA set, in body only); "What is the 6 year rule for capital gains tax on property in
  Australia?" (in body only); "Can I move back into my investment property to avoid CGT?" (missing); "Does the 50%
  capital gains tax still apply in Australia in 2026?" (covered, keep).
- Schema: keep WebApplication and FAQPage; add dateModified; the new FAQs go into FAQPage.
- Tool changes (`src/components/calculators/CGTCalculator.tsx`): taxable income in, ATO 2026-27 brackets and the 2%
  Medicare levy from the table the negative gearing engine already uses (`src/lib/negative-gearing-calc.ts`); no discount
  for companies (company rate input instead), a note that trusts pass the discount to beneficiaries; held "at least 12
  months"; a sale-date switch: before 1 July 2027 current rules, after it the split (value at 1 July 2027 input, inflation
  assumption defaulting to the Budget explainer's 2.5%, the 30% minimum for resident individuals with an "exempt payment
  this year" box, new-build choice). Server-render the $100,000 / $200,000 / $300,000 table from the engine, dated.
- Sidebar: per-calculator note in place of the lender boilerplate (`CalculatorPageLayout.tsx:141-153`).
- Internal links (28 in-content now, mostly the cost-of-selling guides): add from the corrected federal budget and
  negative gearing changes articles ("CGT calculator"), from /investing's CGT FAQ ("estimate the tax on a sale"), from
  the SMSF guide.
- Consolidate: none. The calculator owns "cgt calculator"; the article owns the law (section 4).
- Files: `src/components/calculators/CGTCalculator.tsx`, `src/app/(marketing)/cgt-calculator/page.tsx`,
  `src/lib/negative-gearing-calc.ts` (shared tax table), `src/components/calculators/CalculatorPageLayout.tsx`.

### P2. /guides/cgt-changes-2026-budget

Demand: Bing 95 clicks and 2,292 impressions at 5.2; Google 0 impressions. Queries: "capital gains tax on property" 880
(AI 1,298), "cgt changes 2026" 260 (AI 30, decaying), Bing "capital gains tax changes 2026" 9 clicks at 5.8.

| | Ours | Rival median | Best rival |
|---|---|---|---|
| Words | 3,289 | 1,321 ("cgt changes 2026"); 1,582 ("capital gains tax on property") | APH Bills Digest 8,474; Property Tax Specialists 1,984 |
| H2s | 15 | 0 / 10 | Property Tax Specialists 10 incl. "2026 Federal Budget Summary" |
| Tables | 0 | 0 of 5 on both SERPs | none |
| Tool | none | 2 of 5 | ZedPlus calculator (13 inputs) |
| Schema | NewsArticle | gov Article | ZedPlus FAQPage |
| FAQ | 0 | 0 of 5 | ZedPlus 6 |
| Author | Andy McMaster | 0 of 5 | |
| Carries query | yes on all four | 1 of 5 | |

- Title and H1: keep (Bing 5.2; "Capital Gains Tax on Property" already leads).
- First intro sentence: keep (it states the law with the ATO date).
- Add, after the correction note: a table "Before and after 1 July 2027" (discount vs indexation, the 30% minimum, who is
  covered, assets already owned, new builds, main residence). Turn the four worked examples into tables (figures in
  columns), which is what AI Overviews lift.
- PAA and Bing questions to answer as FAQ: "Does the new capital gains tax apply to existing investment properties?"
  (Bing), "What are the new rules for capital gains tax in Australia?" (covered, move to FAQ), "Does the 50% capital gains
  tax still apply in Australia in 2026?", "How much capital gains tax will I pay on $300,000?" (link the calculator), "What
  is the loophole for capital gains tax?" (covered).
- Schema: add FAQPage beside NewsArticle; dateModified is 2026-10-01 already.
- Dead clicks (175 in Clarity, 90 days): the export has counts, not elements, and 81 of the 90 days predate the 1 Oct
  rewrite, so most were on the old page. On today's page the things that look clickable and are not: seven bordered tag
  pills at the end ("capital gains tax", "cgt", "federal budget 2026", "property investors", "tax", "investment property",
  "2026"), rendered as `<span>` by `src/app/(marketing)/guides/[slug]/page.tsx:179-185`; and in-text citations such as
  "(Budget explainer, 12 May 2026)" and "(explanatory memorandum, paragraphs 1.25 and 1.26)" that are plain text while the
  links sit in Sources. Confirm in Clarity's click map (dead clicks, from 1 Oct) before building; the cheap fixes are to
  link or unstyle the pills and point in-text citations at `#sources`.
- Commercial: readers here are investors deciding when to sell. After "What to do before 1 July 2027", add the appraisal
  block used on the bridging calculator (`SuburbAppraisalCTA` / `AppraisalForm`, which carry "Your details go only to the
  one vetted local agent we match you with, who pays us for the introduction"). No promise about the sale price.
- Template: show updatedAt at the top of corrected articles (`[slug]/page.tsx:100-107`, `:141-145`).
- Ops: request indexing in Search Console now (Google's copy is the 26 Jul version that told owners they keep the
  discount), and IndexNow.
- Internal links (8 now): add from the corrected federal budget post ("how the CGT change works from 1 July 2027"), from
  /glossary/capital-gains-tax-cgt (exists via "Go deeper"), from /investing's CGT FAQ, from the SMSF guide.
- Files: `src/lib/data/blog-posts/cgt-changes-2026-budget.ts`, `src/app/(marketing)/guides/[slug]/page.tsx`.

### P3. /guides/negative-gearing-changes-2026-budget (owner of "negative gearing changes"), with the now-law post

Demand: "negative gearing changes" 12,100 (8,100 in August; AI 82). Bing 100 impressions at 7.0. Google 1 impression.
SERP: Grant Thornton, YouTube, AFR (166 words), Market Index, ClearTax, Reddit, SBS, ATO community: no lenders,
winnable.

| | Ours (now-law post, the digest's pick) | Ours (budget-night post) | Rival median | Best rival |
|---|---|---|---|---|
| Words | 1,308 | 2,199 | 1,408 | SBS 1,660; JMD 1,553 with 3 tables |
| H2s | 7 | 14 | 6 | All Around Realty 14 |
| Tables | 0 | 0 | 1 of 5 | JMD 3 |
| FAQ | 0 | 0 | 0 of 5 | |
| Author | Andy McMaster | Ellie Johnston | 5 of 5 named | |
| Carries query | yes | yes ("Negative Gearing Changes 2026") | 2 of 5 | |

- Owner: the budget-night post. Its slug and title match the query and Bing already ranks it at 7.0. The now-law post
  stays as the dated news report and links to it.
- Proposed title (52 characters): Negative Gearing Changes 2026: What the New Law Does
- H1: Negative gearing changes 2026: what the law passed on 25 June does from 1 July 2027
- First intro sentence: From 1 July 2027, losses on an established home bought after 7:30pm AEST on 12 May 2026 can only
  be offset against income and gains from residential property, under the law Parliament passed on 25 June 2026 (ATO,
  last updated 29 June 2026).
- H2s to add or rewrite: "Who the change covers: individuals, trusts, companies and super funds" (F3); "New builds: what
  counts, and only for the first buyer" (Budget explainer's examples, as in the CGT article); "Before and after 1 July
  2027: a worked example" (the calculator's $135 a week becoming $215 a week, from our engine at the ATO 2026-27 rates);
  "The CGT change is separate" (one paragraph, link to P2).
- PAA to answer: "What are the changes in Australia's negative gearing policy for 2026?" (missing on the guide's SERP),
  "Does the 50% capital gains tax still apply in Australia in 2026?", "Can I defer my capital gains tax?" (missing),
  "Are age pension recipients exempt from the CGT exemption?" (missing; the minimum-tax exemption list answers it).
- Schema: FAQPage beside NewsArticle; dateModified.
- Internal links (4 now, one from /negative-gearing-calculator): fix the 404 link to `/negative-gearing-calculator`
  (anchor "negative gearing calculator"); from the now-law post ("what the negative gearing change does"); from
  /guides/negative-gearing-australia's 2026 section.
- Consolidate: no redirect (URLs never change). The now-law post keeps its news role; trim its 121-character title when
  next edited.
- Files: `src/lib/data/blog-posts/negative-gearing-changes-2026-budget.ts`, `src/lib/data/blog-posts/negative-gearing-cgt-changes-now-law-2026.ts`,
  `src/lib/utils/glossary-linker.ts`.

### P4. /guides/negative-gearing-australia

Demand: "negative gearing" 40,500 (14,800 in August, AI 685). GSC 171 impressions at 82.7 in 90 days; last crawled 3 Jul,
so the #95 rewrite is unseen: too early to read. SERP: Legal Home Loans 690 words with no H2s, ABC 89, The Australian
(paywall), Blackshaw 964, InvestorKit 2,110 updated 8 Oct 2026.

| | Ours | Rival median | Best rival |
|---|---|---|---|
| Words | 3,051 | 690 | InvestorKit 2,110 |
| H2s | 12 | 0 | InvestorKit 9 |
| Tables | 3 | 1 of 5 | Blackshaw 5 |
| Tool | none (calculator linked) | 1 of 5 | |
| FAQ | 6 | 0 of 5 | |
| Author | YPG editorial, reviewed by Andy McMaster | 3 of 5 named | |
| Carries query | yes on all four | 4 to 5 of 5 | |

- Title, H1, intro: keep.
- H2s to add: "Why does negative gearing exist?" (PAA "Why is there negative gearing?", AI 24; Treasury's H2 "If negative gearing
  essentially means making a loss, why do it?"); "How much tax does negative gearing save?" (Lawpath's H2; answer with
  the calculator's band table).
- PAA: "Why is there negative gearing?", "What are the changes in Australia's negative gearing policy for 2026?" (link P3).
- Tool: put the negative gearing calculator link in the first screen ("Work out your weekly cost after tax"), not only in
  the rails.
- Ops: request indexing.
- Files: `src/app/(marketing)/guides/negative-gearing-australia/page.tsx`.

### P5. /negative-gearing-calculator

Demand: "negative gearing calculator" 2,400 (1,000 in August; AI 9). GSC 13 at 7.3 (testing; not in the live top 20).
SERP #1 is Stanford Financial's 232-word tool; Lawpath 2,192 words with 4 tables.

- Title, H1: keep (Google is testing the page; no rewrite).
- PAA to add: "How much is $100,000 a year taxed in Australia?" (AI 330, missing); "How does negative gearing affect capital
  gains tax?" (in body; make it an FAQ).
- Links: header Tools menu (`src/components/layout/Header.tsx:56-67`), fix the 404 link in P3, add from /investing's
  negative gearing FAQ ("work out the weekly cost") and from /rental-yield-calculator's results (exists in "Pair this
  with").
- Change the anchor that sends readers from here to the stale P3 ("who is grandfathered and what counts as a new build")
  only after P3 is corrected; until then point it at /guides/cgt-changes-2026-budget's cut-off section.
- Files: `src/app/(marketing)/negative-gearing-calculator/page.tsx`, `Header.tsx`.

### P6. /bridging-loan-calculator and /guides/bridging-loans-guide

Demand: "bridging loan" 5,400 (CPC $21.30, AI 733), "bridging loan calculator" 1,300 (AI 16). Guide 295 impressions at
85.1 in 90 days, last crawled 12 Jul; calculator 9 at 60.9, crawled 6 Oct. Bridging vertical 3.1 to 1.7 a day. This is
the vertical's one direct path to a vendor appraisal lead.

| | Calculator | Rival median | Best rival | Guide | Rival median | Best rival |
|---|---|---|---|---|---|---|
| Words | 1,691 | 474 | Stryve 1,570 | 4,820 | 1,446 | Xero 2,418 (business loans) |
| H2s | 12 | 3 | CBA 12 | 14 | 9 | Xero 15 |
| Tables | 2 | 0 of 5 | | 4 | 0 of 5 | |
| Tool | 15 inputs | 3 of 5 | IFG 23 inputs | 2 inputs | 1 of 5 | |
| FAQ | 5 | 1 of 5 | Stryve 6 | 11 | 0 of 5 | |
| Carries query | yes on all | 1 to 3 of 5 | | yes | 3 to 5 of 5 | |

- Titles and H1s: keep.
- PAA to answer: "How much do you pay back on a bridging loan?" (missing on the guide's SERP), "What is the cheapest way to get
  equity out of your house?" (missing on the calculator's SERP), "How much do you need to earn for a $700000 mortgage?"
  (appears here too; link the borrowing calculator answer).
- Table and tool: source the 6.5% end-debt rate (F10) from the shared F6 constant with its month.
- Lead path: the calculator has the appraisal form with the disclosure; the guide links /appraisal four times. Put the
  same `SuburbAppraisalCTA` block in the guide under "Peak debt and end debt" (the figure readers need is the sale price).
- Ops: request indexing for the guide.
- Internal links (calculator 9, guide 13): add from /guides/sell-first-or-buy-first (exists), /upgrading hub, and from
  /property-valuation ("bridging loan calculator").
- Files: `src/lib/bridging-calc.ts:35`, `src/components/calculators/BridgingLoanCalculator.tsx`,
  `src/app/(marketing)/guides/bridging-loans-guide/page.tsx`.

### P7. /rental-yield-calculator

Demand: "rental yield calculator" 3,600, "calculate rental yield" 3,600, "rental yield" 1,000 (AI 952), "yield
calculator" 720, "what is a good rental yield" 720 (AI 45), "property yield calculator" 210, "rental yield calculator
australia" 170. GSC 2,924 impressions on 183 queries in 90 days at 80.0, 221 since the deploy at 68.1. Recrawled 7 Oct:
too early to read #85 and #31.

| | Ours | Rival median ("rental yield calculator") | Median ("calculate rental yield") | Best rival |
|---|---|---|---|---|
| Words | 2,514 | 573 | 146 | PropertyGo 2,033 |
| H2s | 12 | 4 | 1 | PropertyGo 13 |
| Tables | 2 | 2 of 5 | 0 of 5 | |
| Tool | 13 inputs, default result server-rendered | 5 of 5 | 5 of 5 | |
| FAQ | 10 | 2 of 5 | 1 of 5 | PropertyGo 5 |
| Carries query | yes / yes / yes / yes | 3 to 5 of 5 | 0 of 5 | |

- Title, H1: keep. Content is not the gap; agency tool pages of 53 to 161 words outrank us.
- One addition: "What is the 30% rent rule in Australia?" is on five of our yield SERPs with AI volume 6,307. The page
  answers it in body only. Write it as an FAQ once a primary source is picked (AHURI's 30/40 indicator or the ABS
  housing costs release, with its date); do not publish it unsourced.
- When NSW and Victorian medians return (the label repair), add NSW, Sydney and regional NSW to the good-yield table
  (`src/lib/data/yield-benchmarks.ts`, regenerate after the sync, per the tracker).
- Read on 28 Oct against the 30 Sep baseline before doing more.

### P8. /lmi-calculator

Demand: "lmi calculator" 3,600 (AI 40), "lenders mortgage insurance calculator" 880 (AI 5), "lenders mortgage insurance"
5,400 (guide). 132 impressions in 10 days at 31.2.

| | Ours | Rival median ("lmi calculator", top 7) | Best rival |
|---|---|---|---|
| Words | 1,634 | 1,414 | money.com.au 2,229 (3 tables, 14 FAQs) |
| H2s | 9 | 6 | Home Loan Experts 12 |
| Tables | 2 | 3 of 7 with tables | money.com.au 3; Home Loan Experts 2 (our data source) |
| Tool | 5 inputs | 2 of 7 | moneywisecalc 24 inputs, WebApplication, 8 FAQs (#6) |
| FAQ | 6 | 3 of 7 with FAQ schema | |
| Carries query | yes | | |

- Title, H1: keep (testing at 10.9 to 16).
- H2 rename: "How LMI is worked out" to "How is LMI calculated?" ("how is lenders mortgage insurance calculated" has 8
  impressions at 94.8 on this page).
- Links (4 in-content): header Tools menu; from /borrowing-power-calculator's results when the deposit is under 20%
  ("what LMI costs on your deposit"); from /mortgage-calculator's "It doesn't apply LMI ... see our LMI guide" line
  (point it at the calculator); from /guides/first-home-guarantee; from /stamp-duty-calculator (the bank pages on this
  SERP are combined "Stamp duty and LMI" calculators).
- Consistency: fix the deposit guide's range (F11).
- Ops: request indexing for /guides/lenders-mortgage-insurance-guide ("crawled, currently not indexed", last crawl 8 Jun,
  updated 7 Oct).

### P9. /refinancing-calculator

Demand: "refinance calculator" 1,900 (CPC $10.53, AI 43). GSC: 0 impressions in 90 days; indexed, crawled 1 Oct. SERP:
Resolve Finance #1 (495 words, 15 inputs), Infinity Lending, Swoop, ING's index page, Coronis, Community First (51
words), money.com.au: 2 lenders, winnable.

| | Ours | Rival median | Best rival |
|---|---|---|---|
| Words | 1,192 | 495 | money.com.au 6,726 (2 tables, 19 FAQs) |
| H2s | 8 | 2 | money.com.au 19 |
| Tables | 0 | 1 of 5 | money.com.au 2 |
| Tool | 8 inputs | 3 of 5 | Resolve 15 inputs, 3 FAQs |
| FAQ | 6 | 2 of 5 | |
| Slug / title / H1 carry "refinance calculator" | no / yes / no | 2/5, 3/5, 2/5 | |

Zero impressions on a 1,900 term is a relevance gap, not Google testing, so a title and H1 change is warranted:

- Proposed title (59 characters): Refinance Calculator: Is Switching Your Home Loan Worth It?
- H1: Refinance calculator: is switching your home loan worth it?
- First intro sentence: Enter your balance, your rate and a new rate to see the monthly saving, the month you break even
  after switching costs and the interest saved, against the 6.2% average rate on new owner-occupier variable loans in July
  2026 (RBA table F6).
- Table: server-render "Monthly saving by loan size and rate cut" ($400,000 to $1,000,000 by 0.25, 0.5 and 1.0 points)
  from the engine, dated.
- Defaults: source both rates from F6 (outstanding vs new variable) with the month; drop "Updated April 2026".
- Wording: F9 ("will approve you") and F12 ("We&rsquo;ll").
- Lead path: "Get connected" to /find-an-expert?intent=refinancing, where the disclosure exists; fix F9 there.
- Files: `src/app/(marketing)/refinancing-calculator/page.tsx`, `src/components/calculators/RefinancingCalculator.tsx`.

### P10. /borrowing-power-calculator (and /affordability-calculator)

Demand: 33,100 + 12,100 + 12,100 + 8,100 + 8,100 + 8,100 + 1,300; "how much can i borrow" AI 949. 4,120 impressions in 90
days (head query "borrowing power calculator" 466 at 87.6), 558 since the deploy at 86.7; last crawled 25 Aug.

| | Ours | Rival median ("borrowing power calculator") | Best rival |
|---|---|---|---|
| Words | 2,511 | 1,406 | Aussie 1,698 |
| H2s | 9 | 2 | Athena 7 |
| Tables | 2 | 0 of 5 | |
| Tool | 6 inputs | 1 of 5 | Aussie 9 inputs |
| FAQ | 8 | 2 of 5 | Aussie 10 |
| Carries query | yes / yes / yes / no ("borrowing power" not in the intro) | 1 to 2 of 5 | |

- Title, H1: keep. Intro first sentence, so the query is in it: "Estimate your borrowing power: how much a lender may
  lend on your income, living expenses and debts, tested at 9.2%, which is July 2026's 6.2% average new variable rate (RBA
  table F6) plus APRA's 3-point buffer."
- Accuracy (F10): reference rate after the September rise, the $130 sentence, the 72% factor, HEM sources, the $2,000
  table floor.
- PAA: "How much do you need to earn for a $700000 mortgage?" (on 6 of our SERPs) as an FAQ worked by the engine (section
  6); a reverse table "Income needed for a $500,000 to $1,000,000 loan" beside the income table.
- Ops: request indexing (25 Aug crawl predates #85 and #104).
- Affordability: keep; request indexing (16 Sep); it owns the "afford" queries (section 4).
- Files: `src/lib/utils/borrowing-power.ts`, `src/lib/borrowing-power-table.ts`, `src/lib/affordability-table.ts`,
  `src/lib/data/hem.ts`, `src/app/(marketing)/borrowing-power-calculator/page.tsx`.

### P11. /rba-cash-rate

Demand: 18,100 (AI 209). Locked on Google; Bing 7.1. Fix F1 first.

| | Ours | Rival median | Best rival |
|---|---|---|---|
| Words | 581 | 2,012 | InfoChoice 2,994 |
| H2s | 5 | 9 | Canstar 20 |
| Tables | 2 | 2 of 5 | InfoChoice 95 rows, Dataset schema |
| FAQ | 0 | 0 of 5 | |

- Proposed title (54 characters): RBA Cash Rate: Current Rate, Next Decision and History
- H1: RBA cash rate: the current rate, the next decision and every change since 2020
- First intro sentence: The Reserve Bank's cash rate target is 4.60%, effective 30 September 2026 after the fourth rise
  this year, and the next decision is due at 2.30pm on 3 November 2026 (RBA).
- H2s to add: "When is the next RBA decision?", "What a 0.25 point change costs" (table from the mortgage engine: $400,000 to
  $1,000,000), "Cash rate and the rate lenders charge" (F6 new variable rate with its month).
- PAA: "What time is the RBA decision today?" (AI 38), "Will there be another interest rate rise in Australia in 2026?"
  (answer with meeting dates, no forecast), "Is 5.74% a good mortgage rate?" (AI 520), "How long did 17% interest rates
  last in Australia?" (AI 281; answer only from RBA table F5 with its series name).
- Schema: Dataset for the history table (InfoChoice, Canstar and Trading Economics carry it), FAQPage, dateModified per
  decision.
- Files: `src/app/(marketing)/rba-cash-rate/page.tsx`, `src/lib/data/data-updates.ts`.

### P12. /guides/smsf-property-guide

Demand: "smsf property" 1,600 (6,600 in June; AI 286). Bing 8 clicks at 3.3. Google 2 impressions. Fix F6 first.

| | Ours | Rival median | Best rival |
|---|---|---|---|
| Words | 2,255 | 1,295 | Yard 1,838 |
| H2s | 12 | 6 | Aussie 12 |
| Tables | 2 | 0 of 5 | |
| FAQ | 6 | 2 of 5 | ART 6 |
| Author | YPG editorial | 4 of 5 named | |

- Title, H1: keep. First intro sentence: An SMSF can still buy property that passes the sole purpose test, but under the
  2026 tax reform law it can no longer take out a new limited recourse loan for residential property, while loans already
  in place continue (verify the provision, start date and commercial-property scope in the Act and supplementary
  explanatory memorandum before publishing).
- H2 rewrite: "Borrowing in an SMSF after the 2026 law".
- PAA: "Is it worth buying property through SMSF?" (in body), "What is the new rule for investment property in
  Australia?" (in body, make it an FAQ), Bing's "is it still possible to purchase an investment property in a smsf".
- Files: `src/app/(marketing)/guides/smsf-property-guide/page.tsx`.

### P13. /guides/property-depreciation-guide

Demand: "depreciation schedule" 2,900 (CPC $23.54, AI 204), "property depreciation" 210 (AI 304). GSC 37 impressions at
67.1; Bing 1 click, 20 impressions at 6.3. The 30 Sep review flagged that the guide does not target "schedule"; still
open.

| | Ours | Rival median ("depreciation schedule") | Best rival |
|---|---|---|---|
| Words | 1,906 | 1,448 | Nicholas Scott 1,448 (QS, "How Much Does a Depreciation Schedule Cost?") |
| H2s | 11 | 7 | Bentleys 15 (business assets) |
| Tables | 3 | 0 of 5 | |
| Tool | none | 2 of 5 | BMT rate finder (12 inputs) |
| Slug / title / H1 carry query | no / no / no | 3/5 each | |

- Proposed title (59 characters): Property Depreciation Schedule: What Investors Claim (2026)
- H1: Property depreciation and tax depreciation schedules: what investors can claim (2026)
- First intro sentence: A tax depreciation schedule, prepared by a quantity surveyor, sets out what you can claim each
  year on a rental property: capital works on the building and the decline in value of plant and equipment.
- H2s to add: "What a tax depreciation schedule includes", "Can I create my own depreciation schedule?" (PAA, missing), "How long
  can you depreciate a rental property in Australia?" (PAA, missing; answer from the ATO rental properties guide with its
  date), "What are the depreciation tables for ATO assets?" (PAA, missing; link the ATO effective life ruling).
- Tool: a capital works estimate (construction cost x 2.5% a year, with the ATO's start-date rules).
- Files: `src/app/(marketing)/guides/property-depreciation-guide/page.tsx`.

---

## 4. Cannibalisation: who owns which query family

| Family | Owner | Other pages taking it | Evidence | Action |
|---|---|---|---|---|
| borrowing power, how much can I borrow | /borrowing-power-calculator | /guides/how-much-can-i-borrow-australia (title also leads "How Much Can I Borrow?") | Calculator 4,120 impressions; guide 21 in 90 days | Keep both; the guide supports "how lenders work it out". Link guide to calculator with "borrowing power calculator" (exists). No change now. |
| can I afford, affordability | /affordability-calculator | /borrowing-power-calculator takes 67 to 75% of "mortgage affordability calculator", "house loan affordability", "housing loan affordability calculator" (3 to 4 impressions each) | intent-match TSV | From the borrowing calculator's result add "how much house can I afford" to the affordability calculator. Titles are already distinct since 8 Oct. |
| mortgage power / borrowing estimate | /borrowing-power-calculator | matcher expected /mortgage-calculator | 7 and 3 impressions | The borrowing calculator is the right page; no action. |
| CGT calculator | /cgt-calculator | none | | P1. |
| capital gains tax on property, CGT changes, "does it apply to property I own" | /guides/cgt-changes-2026-budget | /cgt-calculator (digest's pick for "capital gains tax on property"), /glossary/capital-gains-tax-cgt (178 Google impressions at 69.9), /guides/federal-budget-2026-property, /guides/negative-gearing-cgt-changes-now-law-2026 | Bing 95 clicks on the article; glossary is Google's pick | Article owns the law; the glossary defines and links "how the CGT change works" (exists); the budget post becomes dated news pointing to the article. No redirects (URLs never change). |
| 6-year rule | none today | /cgt-calculator paragraph "Watch the six-year rule" | 1,900 KP, AI 408, 0 impressions | New guide (section 5). Until then, the calculator's H2. |
| negative gearing | /guides/negative-gearing-australia | glossary entry (auto-linked on 7 pages) | | Keep; fix the glossary text (F5). |
| negative gearing changes | /guides/negative-gearing-changes-2026-budget | /guides/negative-gearing-cgt-changes-now-law-2026 | Bing 7.0 on the budget-night post | P3: correct and own; the now-law post links to it. |
| negative gearing calculator | /negative-gearing-calculator | | | P5. |
| bridging loan / bridging loan calculator / alternatives | guide / calculator / /guides/bridging-loan-alternatives | /guides/deposit-bonds for "deposit bond" | clean split | Keep. |
| LMI calculator / lenders mortgage insurance | /lmi-calculator / /guides/lenders-mortgage-insurance-guide | glossary LMI, deposit guide | guide crawled not indexed | Keep; index the guide; align figures (F11). "lender title insurance cost" (5 impressions) is a different product: ignore. |
| rental yield calculator, calculate, what is good | /rental-yield-calculator | | right page by judgement on all calculator variants | Keep. |
| best rental yield {city or state} | /best-suburbs/best-rental-yield/{melbourne, brisbane, vic, qld} | matcher marks "best rental yield melbourne" (7 at 10.9) and four Melbourne variants as wrong page; the Melbourne city page is the right one | | No action (the matcher is crude). "which perth suburbs have high rental yield" (8 at 45.2) lands on the WA page, which is not ranked (only VIC and QLD are); that waits for WA sales medians. |
| {suburb} rental yield | /suburbs/{slug}/rental-market | "boondall rental yield" (5 at 24.8) lands on /suburbs/boondall-qld-4034/vs/geebung-qld-4034 | | Suburbs pack. |
| mortgage brokers {suburb} | no YPG page | suburb profiles and vs pages ("glenquarie", "baromi", "kambah", 3 to 8 impressions each) | | Leave: no broker directory and Your Finance Guide holds the finance intents. |
| fixed vs variable | /guides/fixed-vs-variable-rate-guide | | | Fix F7. |

---

## 5. New pages or tools worth building

| Build | Volume | SERP format it needs | Commercial link | Priority |
|---|---|---|---|---|
| CGT reform mode in /cgt-calculator (P1) | "cgt calculator" 4,400 (AI 76), "capital gains tax calculator property" 880 (AI 128) | Tool with the 1 July 2027 split, indexation and the 30% minimum; Richify and Sharesight already rank with it | Investors deciding when to sell: appraisal leads | 1 |
| /guides/cgt-6-year-rule (new) | "6 year rule capital gains tax" 1,900 (AI 408); PAA "How do I avoid capital gains tax in Australia 6 year rule?", "Can I move back into my investment property to avoid CGT?" | Long guide with worked examples and a days-based partial exemption calculator (Endurego 4,408 words, 2 tables, 11 inputs; Bentleys 2,936; ATO #1, last updated 22 June 2026); Article and FAQPage | Former homes now rented: rental appraisal and vendor appraisal leads | 2 |
| Repayments by loan size table and FAQs on /mortgage-calculator | Long tail: 541 queries, 873 impressions in 90 days ("repayments on 400k mortgage" and the like); PAA "How much is a $600000 mortgage monthly?" (AI 1,133), "What are the typical monthly repayments for a $700,000 mortgage in Australia?", "How much would I need to repay for a mortgage on $800,000 in Australia?" | Server-rendered table $300,000 to $1,000,000 at the F6 rate, dated; FAQ per amount | none direct; supports the borrowing and LMI pages | 3 |
| Offset calculator on /guides/offset-accounts-explained-australia | "offset account" 5,400 (AI 468) | Hunter Galloway (4 tables), money.com.au's offset calculator (2 tables, 25 rows) rank; the guide has 0 tables | none direct | 4 |
| "Income needed for a loan" reverse table on /borrowing-power-calculator | PAA "How much do you need to earn for a $700000 mortgage?" on 6 of our SERPs | Table from the same engine, dated | buyer guide funnel | 5 |
| Capital works estimator on the depreciation guide (P13) | "depreciation schedule" 2,900 (CPC $23.54), "property depreciation" 210 (AI 304) | Tool plus "how much does a schedule cost" | A quantity surveyor referral would be a new lead type; not now | 6 |

Not worth building: anything aimed at the mortgage or borrowing head terms (locked); a mortgage broker directory (Your
Finance Guide's territory); a separate "home loan pre-approval" page (2,400, CPC $65.78, bank SERP): index the existing
guide first (crawled, not indexed since 17 Jun).

---

## 6. AI search: unanswered questions with proposed answer-first copy

Each under 60 words, one sourced and dated figure. Refresh the F6 rate in 3, 4 and 7 when the August and September series
publish.

1. **"Does the new capital gains tax apply to existing investment properties?"** (Bing queries; the question
   /guides/federal-budget-2026-property answers wrongly). Page: /guides/cgt-changes-2026-budget (FAQ).
   > Yes, from 1 July 2027. On property you own before then, the gain up to 1 July 2027 keeps the 50% discount, and the gain after it is indexed for inflation, with a 30% minimum tax for resident individuals. Nothing is payable until you sell (ATO, last updated 29 June 2026).

   Source: ATO, Tax reform: Boosting home ownership: Reforming negative gearing and capital gains tax, last updated 29 June 2026.

2. **"How much capital gains tax will I pay on $300,000?"** (AI 468). Page: /cgt-calculator (FAQ).
   > It depends on your other income. Sell a property held over 12 months before 1 July 2027 and half the gain, $150,000, is added to your taxable income. With $100,000 of other income, that adds about $57,850 of tax at the ATO's 2026-27 resident rates (last updated 13 August 2026), plus the 2% Medicare levy.

   Working: tax on $250,000 is $78,370 and on $100,000 is $20,520 (nil to $18,200, 15% to $45,000, 30% to $135,000, 37% to
   $190,000, 45% above). Source: ATO, Tax rates: Australian residents, 2026-27, last updated 13 August 2026.

3. **"How much is a $600000 mortgage monthly?"** (AI 1,133). Page: /mortgage-calculator (FAQ under a new table).
   > About $3,675 a month over 30 years at 6.2%, the average rate on new owner-occupier variable loans in July 2026 (RBA table F6). Each extra quarter of a percentage point adds about $98 a month. Use the calculator for your own rate, term and repayment frequency.

   Source: RBA statistical table F6, series FLRHOFVA, July 2026 (the constant in `src/lib/utils/borrowing-power.ts:45`).

4. **"How much do you need to earn for a $700000 mortgage?"** (on 6 of our SERPs). Page: /borrowing-power-calculator (FAQ).
   > On this calculator's method, about $151,000 a year for a single applicant with no debts or children, or about $83,000 each for a couple. The loan is tested at 9.2%: July 2026's 6.2% average new variable rate (RBA table F6) plus APRA's 3-point buffer. Debts and dependants raise the income needed.

   Working: the page's own income table ($695,000 at $150,000 single; $662,000 and $787,000 for couples on $80,000 and
   $90,000 each). Recompute after the F10 changes.

5. **"What are the changes in Australia's negative gearing policy for 2026?"** (missing on the "negative gearing" SERP).
   Page: /guides/negative-gearing-changes-2026-budget (FAQ).
   > From 1 July 2027, losses on an established home bought after 7:30pm AEST on 12 May 2026 can only be offset against income and gains from residential property, with any excess carried forward. Homes held before then, and new builds, keep negative gearing. Parliament passed the law on 25 June 2026 (ATO, last updated 29 June 2026).

6. **"What is the 6 year rule for capital gains tax?"** (query AI 408). Page: /cgt-calculator now, the new guide later.
   > If you move out of your home and rent it out, you can keep treating it as your main residence for CGT for up to 6 years, as long as you don't treat another property as your main residence in that time. Sell within those 6 years and the gain can be fully exempt (ATO, last updated 22 June 2026).

   Source: ATO, Treating former home as main residence, last updated 22 June 2026.

7. **"Is 5.74% a good mortgage rate?"** (AI 520). Page: /rba-cash-rate or /refinancing-calculator (FAQ).
   > It is below the 6.2% average rate on new owner-occupier variable loans in July 2026 (RBA table F6), and the cash rate has risen 0.25 points since. Compare the comparison rate and fees as well as the headline rate, and ask your lender what it offers new customers.

8. **"What time is the RBA decision today?"** (AI 38) and "Will there be another interest rate rise in Australia in 2026?"
   Page: /rba-cash-rate (FAQ).
   > The Reserve Bank announces each cash rate decision at 2.30pm, Sydney time, on the last day of the Monetary Policy Board's meeting. The cash rate target is 4.60%, effective 30 September 2026 after the fourth rise this year, and the next decision is due on 3 November 2026 (RBA).

9. **"How much is $100,000 a year taxed in Australia?"** (AI 330). Page: /negative-gearing-calculator (FAQ).
   > $20,520 of income tax at the 2026-27 resident rates, plus the $2,000 Medicare levy, before offsets (ATO, last updated 13 August 2026). Every dollar between $45,001 and $135,000 is taxed at 30%, which is also what a rental loss in that band saves you.

10. **"Can an SMSF still borrow to buy property?"** (Bing "is it still possible to purchase an investment property in a smsf
    in australia"; PAA "What is the new rule for investment property in Australia?"). Page: /guides/smsf-property-guide.
    Draft only after the provision is checked in the Act and supplementary explanatory memorandum: new limited recourse
    borrowing for residential property ends 45 days after Royal Assent on 26 June 2026 (10 August 2026), per our now-law
    post; existing loans continue.

Not drafted: "What is the 30% rent rule in Australia?" (AI 6,307, on five yield SERPs) needs a primary source picked first
(P7); forecast questions ("Will interest rates drop to 3% again?", "Which Melbourne suburbs will boom in 2026?") get facts
and dates, never a forecast.

---

## 7. Status of the previous review's items in this vertical

| 30 Sep item | Status | Evidence |
|---|---|---|
| 3.3: header link to the calculators | Shipped 1 Oct (#85) | Tools menu in the server HTML on every page. Gap found today: LMI and negative gearing calculators missing from it (F12). |
| 3.3: borrowing power H1 and server-rendered income table | Shipped 1 Oct (#85); HEM floor 8 Oct (#104) | Too early to read: Google last crawled the page 25 Aug. Accuracy follow-ups in F10. |
| 3.3: rental yield H2s ("How to calculate rental yield, step by step", "What is a good rental yield in 2026?") | Shipped 1 Oct (#85, #31) | Too early: recrawled 7 Oct. Position since the deploy 68.1 against 80.0 over 90 days. |
| 3.3: LMI estimator | Shipped 1 Oct (#91) | 132 impressions in 10 days at 31.2; Google testing. |
| 3.3: negative gearing calculator | Shipped 1 Oct (#91) | 15 impressions at 6.5; Google testing. |
| 3.3: "Mortgage calculator is banks and Moneysmart; leave it" | Held | Still 8 banks and Moneysmart #1 on all three head terms. Long-tail table proposed (section 5). |
| 3.3b follow-up (#95): CGT article, negative gearing guide, CGT calculator note | Shipped 1 Oct | Too early on Google: article last crawled 26 Jul, guide 3 Jul. Bing still sends 95 clicks to the article. |
| 3.3b follow-up, left open: federal budget post, negative gearing changes post, glossary CGT entry, CGT widget | Open, confirmed live today | F2, F3, F5, F4. Plus three found today: SMSF guide (F6), /investing FAQs (F8), RBA page (F1). |
| 3.3b "found while building" (iii): prose tables overflow phones in guides (LMI guide 431px at 375) | Not checked here | Needs a browser check. |
| Section 4, reading 3: "depreciation schedule" 2,900, check the guide targets the phrase | Open | Title and H1 still lack "schedule" (P13). |
| Section 4, reading 2: zero-impression guides with an index problem | Partly open | LMI guide, pre-approval guide and mortgage broker guide still "crawled, currently not indexed" (last crawls 8 Jun, 17 Jun, 15 Jul). Request indexing is with Jos. |
| Section 6 PAA: "How much LMI on a 10% deposit?" | Shipped (#91) | Answered on /lmi-calculator with Helia's quotes beside ours. |
| Section 6 PAA: "What is the 6 year rule...", "How much capital gains tax will I pay on $300,000?", "How do I avoid paying CGT on investment property?" | Open | Still missing on /cgt-calculator (P1, section 6). |
| Section 6 PAA: "How much deposit do I need for a $700,000 house?", "Is $40,000 enough for a house deposit?" | Answered on the deposit guide (buying pack) | That guide's LMI range now contradicts the LMI calculator (F11). |
| Section 5: AI volume on "how much can i borrow" | Unchanged gap | AI 949 today; no AI Overview cites us on any of the 34 finance SERPs. |

### Request indexing and IndexNow list for this vertical (for the lead's list)

After the fixes land: /rba-cash-rate, /guides/federal-budget-2026-property, /guides/negative-gearing-changes-2026-budget,
/guides/smsf-property-guide, /glossary/capital-gains-tax-cgt, /glossary/negative-gearing, /cgt-calculator,
/guides/fixed-vs-variable-rate-guide. Now, no change needed first: /guides/cgt-changes-2026-budget (26 Jul crawl),
/borrowing-power-calculator (25 Aug), /guides/negative-gearing-australia (3 Jul), /affordability-calculator (16 Sep),
/guides/bridging-loans-guide (12 Jul), /guides/lenders-mortgage-insurance-guide (crawled, not indexed),
/guides/home-loan-pre-approval-australia (crawled, not indexed). IndexNow matters more than usual here: Bing is where these
pages are read.
