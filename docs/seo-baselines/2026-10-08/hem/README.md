# Household Expenditure Measure: what people are asking, 8 October 2026

What people searching about HEM want to know, how much demand sits behind each question, and how our three HEM touchpoints (`/glossary/hem-household-expenditure-measure`, `/borrowing-power-calculator`, `/guides/how-much-can-i-borrow-australia`) measure up. Same method as the bridging, Help to Buy and FHSS notes; the config is `~/Desktop/Ads/ypg-topic-hem.json`. Section 6 answers the second question Jos asked: where else the same pattern (a thin page sitting under real demand) shows up.

## Sources

| Source | What was pulled | Window |
|---|---|---|
| Google Search Console API | HEM, living-expenses and serviceability queries by page and month; every query reaching the glossary page, both calculators, the borrowing guide and the pre-approval guide (`our-queries.csv`) | 6 Jun 2025 to 5 Oct 2026 |
| Bing Webmaster API | Query stats, page-query stats for the five pages, Bing keyword research for six seeds | to 8 Oct 2026 |
| Bing AI Performance (dashboard) | **Not yet pulled for this topic.** The API does not expose Copilot citations; the 6 Jul to 4 Oct export in `../../2026-10-06/help-to-buy/bing-ai-citations.csv` lists the site's top 12 cited pages and none is a HEM page | |
| Google Keyword Planner (AU) | 1,760 ideas from five seed batches and five URL seeds (`keywords.csv`) | monthly, Sep 2025 to Aug 2026 |
| DataForSEO | 16 Google AU SERPs with People Also Ask, AI Overviews and forums (`serp-landscape.csv`, `questions.csv`); autocomplete for 46 prefixes (`autocomplete.csv`); Labs suggestions and related keywords; intent labels and AI search volume for 323 keywords (`ai-volume.csv`); Google Ads volume for the 227 glossary term phrasings (`glossary-volumes.csv`) | 8 Oct 2026 |
| Competitor pages | 16 ranking or AI-cited pages parsed for length, headings, tables, FAQ schema and the dollar figures they publish (`competitor-pages.csv`) | 8 Oct 2026 |
| Official rules | APRA APG 223, ASIC RG 209 and REP 643, ASIC v Westpac [2020] FCAFC 111, Melbourne Institute, Westpac and Macquarie pages (`official-facts.md`) | read 8 Oct 2026 |

DataForSEO spend: US$0.52. Raw API responses are in `raw/` (gitignored).

## 1. The short version

- **The head term is ambiguous, but the finance meaning is the one with questions behind it.** "hem" is 3,600 searches a month in Australia (3,600 to 4,400 every month of the year), "hem meaning" 1,300, "what is hem" 590. Google's results page for "hem" mixes sewing, furniture and finance, and the AI Overview answers the sewing meaning first and the Household Expenditure Measure second. The explicitly financial phrasings are smaller but unambiguous: "hem calculator" 390 (falling from 480 to 320 over the year), "household expenditure measure" 260, "hem living expenses" 90, "hem table" 70, "hem benchmark" 50, "household expenditure measure calculator" 50, with a long tail of "hem calculator nsw / victoria / nab / based on salary". A fair estimate of the finance-intent demand is **1,500 to 2,000 searches a month**, plus the adjacent clusters below.
- **Two adjacent clusters are bigger than the HEM wording itself.** "serviceability calculator" and its lender variants (loan, mortgage, home loan, CBA, Westpac, Macquarie, ING, ANZ) are about **900 a month**, all commercial intent and all answered today by banks and brokers. "average living expenses australia" and its single, couple, monthly and Melbourne variants are about **500 a month**. "living expenses for home loan" as a phrase is tiny (10) but it is what autocomplete and the forums use: "minimum living expenses for home loan", "what expenses do banks look at for mortgage", "do banks check your spending".
- **AI assistants ask the definitional question.** DataForSEO's AI search volume puts "hem" at 4,185 and "what is hem" at 1,519 prompts a month, against 11 for "hem calculator" and 2 for "household expenditure measure". Whoever owns the one-paragraph definition owns the citation. Google returned an AI Overview element on **all 16** SERPs (text and citations came back for 9). Across those it cited Savings.com.au and Infochoice (6 each), JMD Mortgages (5), the Melbourne Institute, Canstar, Westpac and YouTube (4), Finder, propertyed and Emu Money (3), never us.
- **We do not show anywhere.** In 16 months Google has shown our HEM glossary page **11 times** (positions 43 to 82, 0 clicks) and the whole HEM, living-expenses and serviceability family **69 times**. Bing has no query data for the glossary page at all; Bing's own volume for "hem" in Australia is 126 impressions in six months. We are not in the top 10 of any of the 16 SERPs. The borrowing power calculator has had 3,831 Google impressions in 16 months and no clicks, with "borrowing power calculator" itself at position 88.
- **What we have is a 51-word definition.** The glossary page is 183 words including the chrome, has no figures, no FAQ, and its "Go deeper" link points at the selling-agent guide because the term is filed under the selling persona. The borrowing guide gives HEM one paragraph. The calculator floors expenses at a flat $2,000 to $4,000 a month by number of dependants with no income or location scaling and no label saying the figure is our estimate. Every page that ranks is 1,400 to 3,700 words, most carry a table, three publish indicative dollar figures, two carry FAQ schema.
- **The question behind the question is "what will the bank use, and can I change it?"** People Also Ask, Reddit and PropertyChat are consistent: how is HEM calculated, does it include rent, do lenders use HEM or my actual spending, what do banks look at on my statements, how far back, and what moves borrowing capacity. The official answer is clear and nobody quotes it: APRA expects lenders to use the greater of declared expenses and an income-scaled HEM, ASIC says HEM is a plausibility check not a substitute for inquiry, and the Westpac case left that framework intact.

## 2. What people are trying to work out

| Question | Evidence | Searches a month (12-month average) |
|---|---|---|
| **What is HEM, in a sentence?** | Head terms; PAA "What is HEM in Australia?" (3 SERPs), "What does HEM stand for in finance?", "What is the Household Expenditure Measure (HEM) in Australia?" (3); autocomplete "hem meaning finance", "hem banking meaning", "hem home loan meaning", "hem full form"; AI prompt volume 4,185 + 1,519 | head terms about 5,500 (all meanings); finance share estimated 1,500 to 2,000 |
| **What is my HEM figure, and can I see the table?** | "hem calculator" 390, "hem table" 70, "household expenditure measure table 2026", "hem table pdf", "hem benchmark pdf", "hem figures", "hem expenses table", "hem living expenses table"; autocomplete "hem for single person / couple / family of 3 / 4 / 5 / 2 adults"; related "How much is HEM" | about 600 |
| **How is it calculated and what is in it?** | PAA "How is HEM calculated / determined?", "How to calculate household expenditure?", "Does HEM include rent?", "Is rent part of HEM?"; related "How is hem calculated for home loan"; Reddit AusPropertyChat "What is the deal with living expenses when applying" | small as typed, but the second most common PAA theme |
| **HEM or my actual expenses: which does the bank use?** | PropertyChat "Actual expenses instead of HEM for assessment"; Reddit AusFinance "Do mortgage lenders assess your actual living expenditure"; AskAnAussieBroker "How to work out if your expenses will impact [borrowing]"; autocomplete "do banks check your spending", "do banks look at your spending habits", "what do banks look at on your bank statements", "what expenses do banks look at for mortgage" | about 100 typed, large in forums |
| **What counts as a living expense on an application?** | PAA "What is a list of living expenses?", "What are some examples of household expenses?" (2), "How do I calculate my living expenses?" (2); autocomplete "household expenditure list", "hem living expenses list", "living expenses for loan application", "minimum living expenses for home loan" | about 150 |
| **What is normal spending?** | "average living expenses australia" 210, "average monthly living expenses for a single person in australia" 90, "average living expenses melbourne" 90, "average monthly living expenses australia" 70, couple 50; PAA "What are the average monthly living expenses in Australia?" (2), "Is spending $3,000 a month a lot?", "What is a good monthly budget for a single person?", "What is the 50/30/20 rule?" (2) | about 500 |
| **How does this change what I can borrow?** | PAA "How much do you need to earn for a $700,000 mortgage?" on **8 of 16** SERPs, "Is 50% of salary on a mortgage too much?" (2), "How do banks calculate your affordability?"; "how to increase borrowing power" SERP; mymoney and JMD pages lead with credit card limits | the borrowing power cluster (12,100 "how much can i borrow", 33,100 "borrowing power calculator") |
| **Which lender's serviceability calculator?** | "serviceability calculator" 390, loan 110, mortgage 90, CBA 70, home loan 50, Westpac 50, Macquarie 50, ING 30, ANZ 20, bank / Bankwest / Genworth / St George / NAB broker 10 each; "serviceability buffer" 20 | about 900 |
| **Which bank's HEM?** | "hem calculator nab" 10, "cba hem" SERP, autocomplete "bankwest hem", "bank hem calculator" | small; the answer is that the index is the same and only the scaling differs |

## 3. Who wins the results pages

- **Organic top 10:** mortgage brokers on every finance SERP (Zinger, Finance Circle, Mortgage Street, Empower, Pinpoint, Kookaburra, Hunter Galloway, Money Quest, Home Loans R Us), comparison sites (Finder, Canstar, Infochoice, Savings.com.au), banks (Westpac, Macquarie, Bank Australia), and forums: Reddit on 7 of 16, PropertyChat on 2, the ATO community on 1. The AFR and SMH rank for the policy angle. "hem" and "what is hem" are sewing, furniture and dictionary results with one or two finance pages mixed in.
- **AI Overviews:** the element was present on all 16 SERPs and its content was returned for 9. Citations: Savings.com.au 6, Infochoice 6, JMD Mortgages 5, Melbourne Institute 4, Canstar 4, Westpac 4, YouTube 4, Finder 3, propertyed 3, Emu Money 3, Macquarie, ANZ, Compare the Market, NMB, Reddit (on the borrowing-power query). The overview text repeats the same five facts: Melbourne Institute, median basics plus 25th percentile discretionary, floor under declared expenses, varies by household, income and location, excludes housing. The pages cited say those five things in their first 150 words.
- **What the winning pages carry** (`competitor-pages.csv`): Finder 3,708 words with a table and worked dollar examples; Infochoice 2,929 words, a table, a "basic, moderate and lavish" HEM-levels section and the controversy; Savings.com.au 2,910 words, a table and the Westpac case; propertyed 2,688 words, indicative figures, FAQ schema, a 2026 context section; JMD 2,238 words with an indicative benchmark table by household and a Sydney couple example; Canstar 2,648; Home Loan Experts a living-expenses calculator with 2,177 words of explanation; Emu Money a 1,376-word glossary entry with FAQ schema, "not to be confused with" and sources. Reddit's threads are where "HEM or actual?" is actually answered, by brokers.
- **Your Property Guide:** not in the top 10 of any of the 16, not cited in any overview.

## 4. What we have versus what is asked

| Asked | Glossary page | Borrowing guide | Borrowing power calculator |
|---|---|---|---|
| One-sentence definition | Yes (51 words) | One paragraph | FAQ answer |
| Who makes it and from what data | "introduced to address concerns" only | No | "developed by Melbourne Institute" |
| How it is built (median basics, 25th percentile discretionary) | No | No | No |
| What varies it (household, income band, location) | No | "size, income and location" in passing | No |
| What is excluded (rent, mortgage, school fees, childcare, insurance, debts) | No | No | No |
| Indicative figures by household, dated and labelled | No | No | Uses $2,000 / $2,500 / $3,000 / $3,500 / $4,000 by dependants, unlabelled, no income scaling |
| Greater-of rule and the APRA / ASIC position | Half a sentence | One sentence | One sentence |
| Does declaring less help? | No | Yes, one sentence | Yes, a short section |
| What banks check on statements and how far back | No | No | No |
| Worked example | No | No | Live calculation, but HEM not explained next to it |
| FAQ / FAQPage schema | No | Guide FAQ, no HEM item | Yes (one HEM FAQ) |
| Internal links | To a selling-agent guide | To calculators | To the guide |

Two factual gaps to fix whatever else happens: the glossary page files HEM under the selling persona, and the calculator's HEM floor is a flat figure by dependants that does not scale with income or location, which APRA's guide says lenders must do. Neither is wrong as a simplification, but neither says it is a simplification.

## 5. Recommendations, in order

1. **A proper HEM guide, written to be quoted.** `/guides/household-expenditure-measure-hem` (or keep the glossary slug and 301 it; the glossary URL has no equity to lose): the five facts in the first paragraph; how it is built; what it includes and excludes; an **indicative HEM table by household type and income band**, dated, labelled as our estimate with the method stated, because the licensed table cannot be published and every ranking page publishes an indicative one; the greater-of rule with the APRA quote, the ASIC position and the Westpac outcome in plain words; what banks verify on statements and for how long; what actually moves borrowing capacity (committed expenses, credit limits, HECS) versus what does not (declaring below HEM); a worked example; and an FAQ built from the PAA list (does HEM include rent; HEM or my actual expenses; is HEM the same at every bank; can I lower my expenses before applying; what is a list of living expenses; is $3,000 a month a lot). Target 2,500 to 3,000 words with FAQPage schema. This is the page that earns the AI citations the competitors hold.
2. **A HEM and living-expenses calculator**, `/hem-calculator`, embedded in the guide: household type, dependants, income band, capital or regional, state; returns the indicative HEM for that household (monthly and annual), lets the reader enter their own expenses by the categories lenders ask for, shows which figure a lender would use and the borrowing-capacity difference by handing off to the borrowing power calculator. Answers "hem calculator australia / nsw / victoria / based on salary", "household expenditure measure calculator", "hem living expenses calculator", "home loan living expenses calculator", "bank living expenses calculator" and the "hem for single person / couple / family of 4" autocomplete set. Follows the FHSS and bridging calculator pattern (pure computation module, tests, WebApplication schema).
3. **Fix the borrowing power calculator's HEM.** Scale the floor by income band and household composition from the same indicative table, show "HEM benchmark used: $X (indicative, [date])" in the results with a link to the guide, and add "serviceability calculator" to the title, H1 and FAQ. The calculator already is a serviceability calculator; nothing on the page says so, and that cluster is 900 searches a month of commercial intent.
4. **Expand the glossary entry** to about 150 words with the five facts, re-file it under first-home / upgrading, and point its "Go deeper" link at the new guide and calculator. Keep it: the definitional AI prompts land on short definitions.
5. **An "average living expenses in Australia" section or page**, sourced to the ABS Household Expenditure Survey and the Melbourne Institute poverty lines, by household type, with the HEM figure beside it so the reader sees why HEM is below average. About 500 searches a month, no good page in the results.
6. **Internal links** from the pre-approval guide, the deposit guide, the first home buyer guide, the affordability calculator and the APRA buffer post to the HEM guide; one line in each on "expenses are floored at HEM".
7. **Measurement.** Add "hem", "hem calculator", "household expenditure measure", "hem benchmark", "hem table", "hem living expenses", "serviceability calculator" and "living expenses for home loan" to `tracked-queries.json`; export Bing AI Performance for the glossary page and the calculator now (baseline) and at 28 days; re-run this pull at 28 days with `--compare`.

## 6. Where else the same pattern shows up

The HEM glossary page is one of 100 glossary stubs (38 to 61 words each). Together they drew 1,936 Google impressions and no clicks in the 90 days to 27 September, almost all at positions 40 to 95. Pricing their head terms (`glossary-volumes.csv`, Google Ads AU, October 2026) shows which stubs sit under real buyer or seller demand. Generic single words ("bond", "property", "mortgage", "auction", "rba") are excluded below because the volume is not property intent.

| Glossary stub | Head term, searches a month | Our 90-day impressions, position | Definition words | What already exists |
|---|---|---|---|---|
| capital-gains-tax-cgt | capital gains tax 33,100; cgt 8,100 | 743, pos 68 | 59 | /cgt-calculator, negative gearing guide; no CGT-on-property guide |
| mortgage-broker | mortgage broker 22,200 | 2, pos 82 | 58 | how-to-choose-a-mortgage-broker guide (not linked from the stub) |
| caveat | caveat 18,100 | 2, pos 42 | 55 | nothing |
| stamp-duty-transfer-duty | stamp duty 14,800 | 8, pos 66 | 57 | 8 state guides and the calculator |
| land-tax | land tax 12,100 | 0 | 54 | nothing |
| equity | equity 12,100 | 11, pos 63 | 47 | nothing on home equity / usable equity |
| building-inspection | building inspection 8,100 | 0 | 41 | building-pest-inspection guide; "building and pest inspection cost" 1,600 has no impressions |
| commission-agent | commission 8,100 (generic) | 79, pos 40 | 38 | the commission guides |
| title-search | title search 6,600 | 0 | 44 | nothing |
| section-32-vic | section 32 5,400 | 59, pos 72 | 60 | the new Section 32 post (September) |
| lenders-mortgage-insurance-lmi | lmi 5,400; lenders mortgage insurance 5,400 | 6, pos 74 | 59 | LMI guide; "lmi calculator" 3,600 has no page |
| offset-account | offset account 5,400 | 0 | 51 | offset-accounts guide (stub not linked) |
| appraisal | appraisal 5,400 | 24, pos 81 | 50 | /appraisal lead page and the prepare-for-an-appraisal guide |
| settlement | settlement 5,400 | 16, pos 69 | 55 | settlement-day guide |
| tenants-in-common | tenants in common 4,400 | 0 | **8** | nothing; joint tenants vs tenants in common is a buying decision |
| easement | easement 4,400 | 48, pos 90 | 52 | nothing |
| quantity-surveyor-qs | quantity surveyor 4,400 | 4, pos 16 | 61 | depreciation guide |
| firb | firb 4,400 | 40, pos 46 | 40 | foreign-buyer-firb guide |
| debt-to-income-ratio-dti | dti 4,400 | 1, pos 8 | 50 | nothing; pairs with HEM and serviceability |
| hem-household-expenditure-measure | hem 3,600 | 15, pos 41 | 51 | this note |
| loan-to-value-ratio-lvr | lvr 3,600; loan to value ratio 1,000 | 2, pos 93 | 58 | LMI guide mentions it |
| auction-clearance-rate | auction clearance rate 3,600 | 0 | 50 | the clearance-rate post |
| chattels | chattels 3,600 | 13, pos 78 | 48 | fixtures stub |
| body-corporate | body corporate 2,900 | 37, pos 63 | 48 | nothing on strata / body corporate fees |
| encumbrance | encumbrance 2,900 | 29, pos 73 | 38 | nothing |
| valuation | valuation 2,400 | 1, pos 78 | 45 | how-much-is-my-house-worth guide |
| unencumbered | unencumbered 1,600 | 74, pos 11 | 37 | nothing; already on page 2 |

Read together with the Keyword Planner gap table from the 30 September review, the pattern is the same as HEM every time: a lender-side term (HEM, DTI, LVR, serviceability, equity, offset, LMI calculator) or a conveyancing term (caveat, title search, easement, encumbrance, tenants in common, chattels, body corporate) that buyers meet mid-process, where we hold a two-sentence stub and the results are brokers, comparison sites and forums. The lender-side cluster belongs with the borrowing power calculator and this HEM work; the conveyancing cluster belongs with the contract-of-sale guides. The tool gaps that carry their own volume are the LMI calculator (3,600), a negative gearing calculator (2,400) and repayments-by-loan-amount pages ("repayments on 600k mortgage" 1,300 and siblings).
