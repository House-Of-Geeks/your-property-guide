# Bridging loans: what people are actually asking, 6 October 2026

Bing shows bridging loans as a growing theme for us. This note looks at why people want a bridging loan, what they are trying to understand, how much Google demand sits behind each question, and how our current pages measure up.

## Sources

| Source | What was pulled | Window |
|---|---|---|
| Google Search Console API (`sc-domain:yourpropertyguide.com.au`) | bridging-family queries × page and × date; every query that reached `/guides/bridging-loans-guide`, `/glossary/bridging-finance`, `/guides/sell-first-or-buy-first`; URL Inspection on those three | 4 Jun 2025 to 3 Oct 2026 |
| Bing Webmaster API | query stats, page-query stats for the three URLs, Bing keyword research (GetKeyword, GetRelatedKeywords) | to 2 Oct 2026 |
| Google Keyword Planner (AU, Google Search) | 7,054 ideas from 6 seed batches (core, cost, lenders, how, purpose, alternatives) and 6 URL seeds (our guide, Canstar, CBA, Westpac; Finder and NAB returned nothing) | 12-month average, Sep 2025 to Aug 2026 |
| DataForSEO | 16 live Google AU SERPs (top 10, People Also Ask two levels deep, AI Overview, forums); Google AU autocomplete for 52 prefixes; Labs keyword suggestions and related keywords for 7 seeds | 6 Oct 2026 |

DataForSEO spend: US$0.47. The script is `~/Desktop/Ads/ypg-bridging-pull.py` and the raw JSON is in the session scratchpad (not committed).

Files in this folder:

- `keywords.csv`: 2,447 AU keywords with theme, volume, top-of-page bid, intent and monthly volumes. `close_variant_of` marks rows Google counts as the same search, so you can sum the volume without double counting.
- `questions.csv`: 80 People Also Ask questions (with how many of the 16 SERPs show each), question-form autocomplete suggestions, and the long Bing queries that reached our guide.
- `our-queries.csv`: every bridging query we got impressions for in Google and Bing.
- `serp-landscape.csv`: who ranks, who the AI Overviews cite, related searches, and the forum threads Google surfaces.

## 1. The short version

- **Demand is real and commercial.** Counting close variants once, there are about **26,300 Google searches a month in Australia** across 317 distinct bridging searches. "bridging loan" alone averages 5,400 a month, with a top-of-page bid of up to A$29. Volume peaks in the spring and autumn selling seasons: 6,600 in Sep–Oct 2025 and Mar 2026, against 3,600 in December. **We are entering the spring peak now.**
- **The purpose is overwhelmingly residential: buying the next home before the current one sells.** Every bank product people search for (about 4,000 searches a month name a bank) is a buy-before-you-sell home loan. Every long-form question Bing sends us is about moving house. Commercial, development and fast private bridging is a separate market that we should leave alone: under 500 searches a month, with bids of A$55–67.
- **People already understand what a bridging loan is. What they want is the numbers and the risks.** People Also Ask shows the questions that come up on almost every results page:
  - *"Is there a cheaper alternative to a bridging loan?"* (13 of 16 SERPs)
  - *"What are the downsides?"* (11)
  - *"How much does a $100,000 bridging loan cost?"* (11)
  - *"How much equity do you need?"* (6)
- **Calculators and alternatives are the largest gaps.** Bridging calculators draw about 2,800 searches a month, and we have 11 calculators but no bridging one. "Deposit bond" alone draws 1,900 a month, and we have no page on it.
- **Bing likes our guide. Google barely knows it exists.** Bing ranks it mostly between positions 1 and 8 for long, specific questions. Google tested it in July (269 impressions at an average position near 90) and has shown it about 10 times a month since. The page is indexed; Google last crawled it on 12 July 2026.
- **The guide's cost section understates the cost by roughly five times** (see section 6). Cost is the question asked most often, so this is the first thing to fix.

## 2. Why people want a bridging loan

Ranked by evidence across all four sources:

| Purpose | Evidence | AU searches / month |
|---|---|---|
| **Buying the next home before the current one sells** (upsizers, families moving, people relocating) | All bank bridging products are this product. Every Bing long-tail query is about it. About a third of the forum threads Google shows are about it ("Buying before we sell?", "Halfway through Buy Before Sell", "Money movement of buying and selling. Is it crazy to buy before my house…"). PAA asks "Should you buy first or sell first?" | Most of the 8,800 head-term and 3,800 lender searches, plus about 510 phrased explicitly ("buy home before selling", "how to buy a house before selling yours") |
| **Securing a purchase when the deposit is tied up in the old home** | "deposit bond" 1,900, "qbe deposit bond" 90, "deposit bond cost" 70. Bing: "what is a bridging bond loan qld" shows people mixing the two products up | about 2,300 |
| **Downsizing, including retirees and pensioners** | GSC: "is a bridging loan right for downsizers", "bridging loan for downsizers", "bridging loan upsizers". Forums: "Bridging loan to downsize PPOR when over 75", "Considerations for downsizing single pensioner". Autocomplete: "bridging loan for retirees", "when retired", "without income". "bridging loans for pensioners" carries a A$55 bid | about 50 measured, but it appears in every source and has very little competing content |
| **Building a new home while living in the old one** | "construction bridge loan" 70, "bridging loan for construction" 30, "bridging loan while building", "to build a house"; PAA "What is the best way to borrow money to build a house?" | about 130 |
| **Winning at auction or settling fast** | "auction bridging", "bridging loan for auction property", "how quickly can a bridging loan be approved?" (PAA) | small |
| **Restructuring: keeping the old home as a rental instead of selling** | Two Bing queries that reached the guide (quoted below), plus "within a bridging loan can you tenant the property you are trying to sell" | not measured by Google, but this is exactly what our audience asks |
| Divorce settlement, inheritance, stamp duty timing | Autocomplete: "bridging loan divorce settlement", "bridging loan and stamp duty", "buying a house before selling stamp duty"; Bing: a Queensland stamp duty refinance question | small |
| Commercial, business, development, fast or private lending | "business bridge loan" 50, "commercial bridging loan" 50, "short term bridging loan" 110, "fast bridge loan" 50; bids of A$55–67 | about 450. **Not our audience.** |

## 3. What they want to understand

The question clusters, in order of how strongly the evidence shows them:

**1. "What will it cost me?"** About 2,800 searches a month on rates and cost (plus about 2,800 on calculators). There are 25 cost questions in People Also Ask. Searchers want a dollar figure for their own loan amount, not a percentage:

- "How much does a $100,000 bridging loan cost?" (11 SERPs)
- "…$350,000…" and "…$500,000…"
- "What is the typical interest on a bridging loan?"
- "Are there fees?"
- "What is the interest rate on a CBA bridging loan?"

Bing adds the cash-flow version of the same worry:

- `do you make payments on a bridging loan?`
- `bridging loans are there monthly repayments`
- `doyou need to pay all the interest up front with a bridging loan`
- `monthky repayment for bridging loan 1.5 million dollars victoria`

AI-assistant volume for "bridging loan cost" rose from 19 (March) to 117 (August 2026) in the 30 September DataForSEO pull. This question is moving to AI answers.

**2. "Is it a good idea, and what can go wrong?"** There are 22 eligibility and risk questions in People Also Ask:

- "What are the downsides?" (11)
- "Is a bridging loan a good idea / worth it / wise?"
- "How risky is a bridge loan?"
- "What can go wrong?"
- "What happens if you can't repay?"

Bing shows the fear behind these questions:

- `what happens if i cant end my bridging loan after 12 months, does the bank fire sale my house`
- `value of my house has dropped is my bridging loan still good`
- `what to do if i can't afford a bridging loan`

**3. "Is there something cheaper?"** This is the single most common People Also Ask question (13 of 16 SERPs). The alternatives people name:

- deposit bond (1,900 a month)
- relocation loan ("relocation loan" 110, "st george relocation loan" 110, "westpac relocation loan" 30), which turns out to be St.George's, Bank of Melbourne's and BankSA's name for their bridging loan, so it is the same product (section 8)
- Bridgit and Yard (about 270 for "bridgit", "bridge it loans" and "bridgeit loans"), which are non-bank bridging lenders rather than alternatives
- selling first and renting

Related searches add "bridging loan vs relocation loan" and "deposit bond vs bridging loan". Bridgit ranks in the top 10 of 10 of the 16 SERPs.

**4. "Will they lend to me, and how much?"**

- "How much equity do you need for a bridging loan?" (6 SERPs)
- "How to get a 100% bridging loan?"
- "How hard is it to get?"
- "Can you get a bridging loan with bad credit?"
- Autocomplete: "bridging loan borrowing power", "can i get a bridging loan if im retired", "…with no income", "…if i have a mortgage"

Bing asks about the mechanics behind approval:

- `servicing for bridging loan`
- `with bridging loans do the customers only need to service the end debt??`
- `asic bridging loan end debt disclosure australia`

**5. "How long does it last, and what happens at the end?"**

- "How long can bridging loans last?" (4 SERPs)
- "Can you repay early?" (5)
- "Can I refinance a bridging loan?"
- "Can I get a mortgage to pay off a bridging loan?"
- Autocomplete: "bridging loan 1 year / 2 years", "maximum term", "how long does bridging loan take to approve"

**6. "Which banks do it, and whose is best?"** About 4,000 searches a month name a bank:

| Bank | Searches / month |
|---|---|
| Westpac | 850 |
| CBA | 790 |
| NAB | 570 |
| ANZ | 540 |
| St George | 470 |
| Macquarie, Bankwest, ING, Bendigo | about 90–150 each |

There are also "best bridging loans australia" (170), "cheapest bridging loans australia" (70), and PAA questions "Do banks do bridging loans anymore?" and "Which banks provide bridging loans?". Bank-named calculators ("nab bridging loan calculator" 140, ANZ 70, Westpac 90, CBA 50, St George 70) are people trying to run the bank's own numbers.

**7. "What is it, and how does it work?"** About 3,500 searches a month ("what is a bridging loan" 1,000, "how does a bridging loan work" 880). This is the entry point, but our guide already covers it and the results pages for these terms are dominated by banks and Bridgit. The terms "open bridging" (70) and "closed bridging" (110) are worth defining, because the guide does not use them.

**8. Scenario questions nobody else answers well.** These come from Bing, verbatim, and our guide ranks at positions 1–7 for them:

- `if i have two propertys uder a bridging loan and then decide not to sell one and keep it can i divide them into two seperate loans and have one as a rental property`
- `i had three properties under a bridging loan sold one but then decide to keep two and have one as an investment how do i divide up the loan into a home loan and investment loan`
- `within a bridging loan can tou tenant the property you are treuinh to sell`
- `can a bridging loan consist of two to be purchased properties`
- `australian home equity refinance purchase next property bridging loan stamp duty queensland 2026`

These are the long, specific questions that Bing (and Copilot) users type and that Google hides as anonymised queries. They match the plans of real sellers in our audience.

## 4. Who wins the results page today

Across the 16 live Google AU results pages:

- **AI Overview** appears on all 16. It cites ANZ (5), CBA (5), Canstar (4), Bridgit (4), Compare the Market (4) and NAB (4).
- **Discussions and forums** appear on 8. Reddit (r/AusFinance, r/AusPropertyChat), Whirlpool and PropertyChat rank in the organic top 10 too: Reddit on 6 pages, Whirlpool on 3.
- **Top-10 organic results** come from Bridgit (10 of 16), Reddit (6), CommBank (4), Resolve Finance (3), ANZ (3) and Whirlpool (3).
- **Your Property Guide** is not in the top 10 of any of the 16.

What wins is either a provider with a calculator (Bridgit, the banks) or a forum thread where someone describes a real scenario. Canstar and Compare the Market get cited for rate tables. None of the top results are written for the seller. That is our angle: start from "what is your current home worth, and how long will it take to sell in your suburb", which only we have data for.

## 5. What we have versus what is asked

| Question cluster | `/guides/bridging-loans-guide` (updated 6 May 2026) | Gap |
|---|---|---|
| What it is, how it works, peak and end debt | Covered, with a worked example | Open versus closed bridging is not named |
| Cost in dollars | One cost paragraph, which understates the cost (section 6) | No cost-per-$100k table, no answer for $100k/$350k/$500k, no monthly-payment answer for end debt |
| Calculator | Links to the borrowing power and stamp duty calculators | **No bridging calculator.** About 2,800 searches a month |
| Alternatives | Sell first; buy subject to sale | **No deposit bond** (1,900 a month), no long or delayed settlement, no use of equity for the deposit; relocation loans and non-bank lenders not explained |
| Risk and "what if it doesn't sell" | FAQ "What if my old home doesn't sell in time?" | Nothing on a falling sale price, the end of a 12-month term, forced sale, or refinancing out |
| Eligibility and equity | "Will a lender approve me?" section | No direct "how much equity" answer; nothing on retirees or no income |
| Which banks | Not covered | **No lender table.** About 4,000 searches a month |
| Keeping the old home as a rental, or splitting the loan | Not covered | Bing sends us exactly this question |
| Downsizers | Not covered (we have `/guides/downsizers-guide`, but it does not link this angle) | Small but uncontested |
| Building while living in the old home | Not covered | About 130 a month |

## 6. The cost figures on the guide need correcting

The "True cost of bridging" section and the FAQ "How much extra does bridging cost vs selling first?" both say a $500,000 bridge over 6 months costs "roughly $2,500 of additional interest". That counts only the 1-point rate margin. Selling first means you never borrow that $500,000. Bridging means you pay the full rate on it: at 9.3%, inside the 9.28% to 10.29% the banks that capitalise interest published on 6 October, that is about **$23,700** for 6 months, not $2,500. Even at the guide's own 7.5% it was about $18,750. The guide's total of "$3,500 to $5,500 versus selling first" should be closer to $25,000 to $27,000 (using the guide's own fee figures), before any rent saved.

The worked example also does not reconcile. It shows "capitalised bridging interest (6 months @ 7.5%): ~$28,000". Six months on the $1.05 million that the sale repays is about $49,800 at 9.3%, and about $39,000 even at the guide's own 7.5%.

Since "how much does it cost" is the most-asked question, these two corrections come before any new content.

## 7. Recommendations, in order

1. **Fix the cost section and FAQ.** Add a plain table: cost per $100,000 bridged for 3, 6 and 12 months at current rates, plus rows for $100k, $350k and $500k (the People Also Ask amounts). Answer "do you make repayments" in the first sentence.
2. **Build `/bridging-loan-calculator`.**
   - Inputs: current home value, mortgage owing, purchase price, state, months to sell, rate.
   - Outputs: peak debt, peak LVR, capitalised interest, end debt, monthly repayment on end debt.
   - Pre-fill the value from the instant suburb range we already show on `/appraisal`. Pull stamp duty from our stamp duty calculator.
   - The most uncertain input is the sale price, so the call to action is a free appraisal from a local agent. This is the strongest fit between this demand and how we make money.
3. **Write a deposit bond guide** (1,900 a month, low competition) and **an alternatives guide**: bridging loan vs deposit bond vs sell first and rent vs subject-to-sale vs a longer settlement vs using equity, explaining that a relocation loan is a bridging loan. This answers the most common People Also Ask question.
4. **Add a lender table to the guide.** For CBA, Westpac, NAB, ANZ, St George, Bankwest, ING, Macquarie, Bendigo and Suncorp, show whether they offer bridging, maximum term (6 or 12 months, longer for construction), open or closed, how interest is handled, and maximum peak-debt LVR. Each row needs a source link and a checked date. Keep it factual and general, because we do not hold a credit licence.
5. **Add a "what if it doesn't sell" section.** Cover the 6- or 12-month term ending, a falling sale price, the lender's options (extension, refinance, forced sale), how to protect yourself (sell-by date, realistic price, auction), and a link to suburb days-on-market data.
6. **Add short sections or FAQs for the scenarios Bing sends us:**
   - keeping the old home as an investment and splitting the loan (with a note that interest deductibility follows the purpose of the borrowing, and a pointer to an accountant)
   - renting out the old home while it is for sale
   - downsizers and retirees (linked from `/guides/downsizers-guide`)
   - building while living in the old home
   - open versus closed bridging
7. **Skip commercial, development and private short-term bridging.** It is a different buyer, with bids of A$55–67 from specialist lenders.
8. Format: every new answer starts with a one- or two-sentence direct answer under a question heading, with FAQ schema. AI Overviews appear on all 16 results pages, and cited answers are short and specific.

## 8. What the lender research changed (6 October 2026, implementation)

Lender pages read while building the plan corrected three assumptions above:

- **Rates.** The plan first used the guide's old 7.5% example rate. On 6 October the banks that add bridging interest to the loan published 9.28% (Bank of Melbourne) to 10.29% (Bendigo Bank), so the site and the figures above now use 9.3%: six months on $500,000 is about $23,700 rather than $19,000.
- **Interest method.** Not all bridging loans capitalise interest. Westpac, the St.George group and Bendigo Bank do; CBA and ANZ require interest-only repayments; Bankwest lets you choose. The calculator offers both methods.
- **Relocation loans.** St.George, Bank of Melbourne and BankSA describe their relocation loan as also known as a bridging loan, so it is the same product rather than an alternative. Bridgit and Yard are non-bank bridging lenders.

The sourced lender facts live in `src/lib/data/bridging-lenders.ts`.
