# Help to Buy: what people are asking, 7 October 2026

This note covers what people searching "help to buy" want to understand, how much Google demand sits behind each question, and how `/guides/help-to-buy-scheme-australia` compares with what they're asking.

## Sources

| Source | What was pulled | Window |
|---|---|---|
| Google Search Console API | Help to Buy and shared equity queries by page and by date; every query that reached the guide, the two Help to Buy news articles and the First Home Guarantee guide; URL Inspection on all three Help to Buy pages | 4 Jun 2025 to 3 Oct 2026 |
| Bing Webmaster API | Query stats, page-query stats for the same pages, Bing keyword research | to 6 Oct 2026 |
| Bing Webmaster AI Performance (read in the Bing Webmaster Tools dashboard; it isn't in the API) | Copilot and partner citations for the site, per page and per grounding query (`bing-ai-citations.csv`) | 6 Jul to 4 Oct 2026 |
| Google Keyword Planner (AU) | 7,459 ideas from 6 seed batches (core, eligibility, apply, repay, compare, state) and 5 URL seeds | Monthly, Sep 2025 to Aug 2026 |
| DataForSEO | 16 live Google AU SERPs (top 10, People Also Ask two levels deep, AI Overview, forums); autocomplete for 46 prefixes; Labs suggestions and related keywords | 6 Oct 2026 |
| Official sources | Housing Australia, the Program Directions, state revenue and treasury offices, participating lenders (`official-facts.md`) | read 6 to 7 Oct 2026 |

DataForSEO spend was US$0.47. The script is `~/Desktop/Ads/ypg-topic-pull.py` with `ypg-topic-help-to-buy.json`, the bridging script generalised to any topic.

Files in this folder:
- `keywords.csv`: Help to Buy and shared equity keywords, plus adjacent first home buyer schemes, with theme and monthly volumes. Close variants are marked.
- `questions.csv`: People Also Ask and question-form autocomplete.
- `autocomplete.csv`: every AU autocomplete suggestion, with the UK and Irish schemes filtered out.
- `serp-landscape.csv`
- `our-queries.csv`
- `official-facts.md`: the scheme's current rules, with sources.

## 1. The short version

- **Demand is large and steady after the launch spike.** Help to Buy and shared equity searches ran at about **27,000 a month in August 2026**. They peaked at 44,000 at launch in December 2025 and 59,000 in March 2026. "help to buy scheme" alone is 8,100 a month now, and the state versions are another 3,300 (Qld 1,300, NSW 1,300, Vic 1,000 including "vic", WA 480).
- **Google won't index the guide, but Copilot cites it all the time.**
  - **Google:** last crawled it on 14 July 2026 and left it **"Crawled - currently not indexed"**. It has had 11 impressions in 16 months, and we appear on none of the 16 Google results pages we checked.
  - **Bing classic search:** shows no queries.
  - **Bing AI Performance:** Copilot and its partners cited the guide **3,400 times** between 6 July and 4 October 2026. That makes it the third most-cited page on the whole site, after the bridging guide (4,000) and the house-worth guide (3,600).
  - **Copilot's grounding queries for it:** "help to buy scheme" (1,800 citations, a 12.3% citation share), "help to buy scheme 2026" (665), "help to buy" (300), "help to buy scheme australia" (216), "shared equity scheme" (129) and "government shared equity scheme" (75).
  - **Timing:** citations started in late August and peaked at about 450 a day in mid-September.
- **That makes the out-of-date statements urgent.** Copilot is quoting a page that says Help to Buy's income caps are lower than the First Home Guarantee's and that availability varies by state. Fixing the page fixes what Copilot tells people.
- **The guide gives no numbers, which is the likely reason it isn't indexed.** It says the dollar thresholds "change" and tells readers to treat its points "as the shape of the rules rather than fixed numbers". Searchers want the figures: income limits ($103,000 single, $165,000 joint), price caps by state and region, the 2% deposit, the 30% and 40% shares, the four lenders and the start date. Our own July news article states the current income limits; the guide doesn't.
- **Parts of the guide are now wrong or out of date:**
  - It frames Help to Buy's income caps as "lower than the First Home Guarantee", but the 5% Deposit Scheme has had no income test since late 2025.
  - It says availability varies by state, but the scheme has been national since Tasmania joined on 9 June 2026.
  - It never says the scheme **can't be combined with the 5% Deposit Scheme**, which autocomplete shows people asking about.
- **The question asked most is what shared ownership means for you.** "What does it mean if the government owns 30% of your house?" is on 7 of 16 results pages, and the downsides on 8 (two phrasings). After that come affordability questions ("How much deposit do I need for a $700,000 house?" on 7, "How much do you need to earn for a $700,000 mortgage?" on 6), then the rules for living with it: buying back the share, selling, renovating, renting out, income rising, divorce.
- **People are still searching for closed state schemes.** "victorian homebuyer fund" gets 480 to 1,000 searches a month, and the fund closed on 10 September 2025. The state shared equity family as a whole runs about 2,450 a month. Nobody tells these searchers it's closed and points them at Help to Buy.

## 2. What people are trying to work out

From all sources, strongest evidence first:

| Question | Evidence | AU searches / month (Aug 2026) |
|---|---|---|
| **What is it and am I eligible?** | Head terms; "help to buy scheme eligibility", "income limit", "price cap", "postcode checker"; autocomplete "permanent resident", "single parent", "joint application", "partner owns property", "bad credit" | Head 15,270; how it works 4,140; eligibility 680 |
| **What does sharing ownership with the government mean?** | PAA "What does it mean if the government owns 30% of your house?" (7 of 16), "downsides" (8), "Is help to buy scheme a good idea?"; Reddit "Opinion on help to buy vs 5% deposit scheme", "Confused about disadvantages of withdrawing" | Few direct searches; the most-asked question on the results pages |
| **What can I afford with it?** | PAA on deposits and income for $500,000 to $1,000,000 homes (6 to 7 pages each); "help to buy calculator" grew from 20 to 260 a month; related searches "help to buy price cap calculator", "Shared equity scheme australia calculator" | Calculators 290, rising |
| **How do I apply, which banks, are places left?** | "commbank help to buy scheme" 320, "bank australia help to buy" 170 to 310, "housing australia help to buy" 170; autocomplete "how many spots left", "quota", "approval time", "settlement period", "which banks", "broker"; Facebook "Which other lenders are likely to join"; PAA "Which banks are doing the Help to Buy scheme?" | 850 |
| **What happens later?** | Autocomplete "buy back", "how to pay back", "repayment calculator", "what happens when you sell", "renovations", "can you rent out", "income increase", "divorce", "transfer of equity", "can you refinance", "withdrawal penalty"; PAA "How long does it take to pay off Help to Buy?" | Long tail, about 32 autocomplete questions |
| **Which state rules apply to me?** | "help to buy scheme qld/nsw/victoria/wa/sa/tasmania"; related searches "Help to buy price cap nsw/qld" and "help to buy scheme near sydney/melbourne" | 3,310 |
| **Can I use it with other schemes, or is something else better?** | Autocomplete "can i use help to buy and first home scheme together", "help to buy vs boost to buy", "help to buy scheme and stamp duty"; related "Help to buy vs 5% deposit scheme reddit/nsw/australia"; Reddit thread on the same question | Compare 80 and state schemes 2,450; plus about 65,000 a month on the adjacent schemes (FHSS, first home owner grants, 5% Deposit Scheme) |
| **New, existing, off the plan, building?** | Autocomplete "on second hand homes", "off the plan", "new build", "building", "land", "modular home"; Reddit "Help to Buy Scheme if buying off plan", "Help to Buy and house/land deposits" | 70 |

## 3. Who wins the results pages

From `serp-landscape.csv`:

- **AI Overviews:** on all 16 pages. People Also Ask is on 14, and forums on 8.
- **Top-10 organic results by domain:**

  | Domain | Pages (of 16) |
  |---|---|
  | Reddit | 7 |
  | housingaustralia.gov.au | 6 |
  | Facebook | 6 |
  | nhfic.gov.au (Housing Australia's old domain) | 3 |
  | Hunter Galloway (broker) | 3 |
  | Mortgage Choice | 3 |
  | Treasury, firsthomebuyers.gov.au, NSW Government, CommBank and Teachers Mutual Bank | 2 each |

- **AI Overview citations:** firsthomebuyers.gov.au and CommBank are cited most.
- **Your Property Guide:** absent from every page.

**Copilot is different:** there, our guide is one of the main sources (section 1).

The official pages are accurate but are written as program rules. The forums are where people ask what it means for them, and that gap is ours. The winning page states the figures plainly and then answers the "what does it mean for me" questions with worked examples.

## 4. What we have versus what is asked

| Cluster | `/guides/help-to-buy-scheme-australia` (14 June 2026) | Gap |
|---|---|---|
| Income limits, price caps, deposit, shares | Shape only, no figures | All the numbers, with the state and region price-cap table |
| What a 30% or 40% share means | Explained in words | A worked example: price, deposit, government share, loan, repayments, and what happens at sale after growth |
| Affordability | None | A Help to Buy calculator |
| Apply, lenders, places, timing | "Runs through participating lenders" | The four lenders, places (10,000 a year, 40,000 cap), the 90-day reservation, the 30-day minimum settlement, the dates |
| Buying back, selling, renovating, renting out, income rising, death, separation | Buying back and selling in brief | All of it, with the 5% minimum, the 2-years-over-income trigger, the $21,000 renovation notice and the rental exceptions |
| Combining and comparing | Help to Buy vs First Home Guarantee, with wrong income framing | It can't be combined with the 5% Deposit Scheme but can with grants, duty concessions and FHSS; a side-by-side with repayments |
| States | "Availability has varied" | National since 9 June 2026; caps and regional centres per state; state schemes open and closed |
| Who's eligible: citizens, PR, previous owners | Citizens and "not a current owner" | PR not eligible; previous owners eligible; single-parent exceptions |

## 5. Recommendations, in order

1. **Rewrite the guide with the figures and get it indexed, without losing what Copilot cites.**
   - Keep the sections Copilot already uses and keep "2026" in the title (665 citations come from "help to buy scheme 2026"): what it is, how shared equity works, the rent question, buying out, selling, and the comparison with the 5% Deposit Scheme.
   - Lead with a facts box: shares, deposit, income limits, price caps, lenders, places, dated 2026–27.
   - Answer each People Also Ask question in its first sentence, with FAQ schema.
   - Fix the outdated framing.
   - Then request indexing in Search Console and ping IndexNow.
2. **Add a worked example for "What does it mean if the government owns 30% of your house?"** On a $700,000 existing home:
   - 2% deposit is $14,000, the government's 30% is $210,000, and the loan is $476,000. That's about $3,009 a month at an example 6.5%, against $4,203 for a 5% Deposit Scheme loan on the same home.
   - Sell later for $800,000 and the government receives $240,000.
3. **Build `/help-to-buy-calculator`.**
   - Inputs: state and area, new or existing, price, deposit, income and household type.
   - Outputs: an eligibility check against the limits and caps, the largest share available, loan size and repayments, a comparison with the 5% Deposit Scheme, and the government's share at sale after growth.
   - Demand: "help to buy calculator" grew 13-fold in a year, and the affordability questions fill People Also Ask.
4. **Cover living with the scheme.** Buying back the share, selling, renovating, renting out, income rising, refinancing, death and separation, as short question-led sections in the guide.
5. **Cover each state.** Price caps and regional centres, state grants and duty concessions that *can* be combined, and state schemes that can't. Start with sections or pages for Qld, NSW, Vic and WA (3,300 a month together).
6. **Write a "shared equity schemes in Australia" guide** with the status of every state scheme. The Victorian Homebuyer Fund and NSW's Shared Equity Home Buyer Helper are closed; Boost to Buy is open (regional only); Keystart, HomeStart and MyHome are open. Say which can be used with Help to Buy (none of them) and send the closed-scheme searchers to Help to Buy.
7. **Link and refresh.**
   - Link from the First Home Guarantee guide, the first home buyer guides for each state, the first home buyer hub and the two news articles.
   - Add tracked queries.
   - Recheck the facts each 1 July, when the income limits are indexed and new places are released.
8. **Leave alone:** the UK and Irish Help to Buy schemes, which fill autocomplete. The adjacent schemes (FHSS, first home owner grants, the 5% Deposit Scheme) are a separate, larger opportunity of about 65,000 searches a month; plan them on their own.

Lead path to decide: Help to Buy searchers are buyers, not sellers. The calculator's next step could be the buyer match (`/find-an-expert`), the first home buyer guide funnel, or a participating lender. That's a commercial decision before step 3 ships.
