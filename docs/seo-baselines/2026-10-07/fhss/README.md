# First Home Super Saver scheme: what people are asking, 7 October 2026

This note covers what people searching about the First Home Super Saver (FHSS) scheme want to know, how much demand sits behind each question, and how `/guides/first-home-super-saver-scheme` measures up. It follows the same method as the bridging loans and Help to Buy research.

## Sources

| Source | What was pulled | Window |
|---|---|---|
| Google Search Console API | FHSS and "use super to buy a house" queries by page and by date; queries reaching the FHSS, deposit and first home buyer guides; URL Inspection | 5 Jun 2025 to 4 Oct 2026 |
| Bing Webmaster API | Query stats, page-query stats, Bing keyword research | to 7 Oct 2026 |
| Bing AI Performance (dashboard) | Copilot citations by page and grounding query (`bing-ai-citations.csv`) | 6 Jul to 4 Oct 2026 |
| Google Keyword Planner (AU) | 2,602 ideas from 5 seed batches and 4 URL seeds | Monthly, Sep 2025 to Aug 2026 |
| DataForSEO | 16 Google AU SERPs (15 returned) with People Also Ask, AI Overviews and forums; autocomplete for 46 prefixes; Labs suggestions | 7 Oct 2026 |
| Official rules | ATO FHSS pages, GN 2024/1, the legislation, budget papers (`official-facts.md`) | read 7 Oct 2026 |

DataForSEO spend: US$0.28. The script is `~/Desktop/Ads/ypg-topic-pull.py` with `ypg-topic-fhss.json`.

## 1. The short version

- **Demand is steady, and peaks at tax time.**
  - About **24,300 searches a month** name the scheme (August 2026), peaking at 27,600 in May. "first home super saver scheme" alone is 8,100 a month, and "fhss" 5,400.
  - About **9,300 a month** (August; 11,000 on a 12-month average) ask the same thing in plain words: "can I use my super to buy a house?", "use super for a house deposit", "can I access my super to buy a house". The answer for most of them is FHSS.
- **We barely show anywhere.**
  - **Google:** the guide is indexed (last crawled 17 July) but has had 21 impressions in 16 months.
  - **Bing:** shows it for a few specific questions at positions 3 to 10, such as "is this fhss scheme an income" and "how would they know if it was you who contributed".
  - **Copilot:** cited it **7 times** in three months, against 3,400 for the Help to Buy guide. None of the site's 604 grounding queries mention super or FHSS. Yet Copilot cites us about 3,500 times for 75 first home buyer and deposit questions, so we have the authority next door and aren't using it.
- **Like the old Help to Buy guide, it gives no figures:**
  - no $15,000 a year or $50,000 total
  - nothing on the 85% rule, the 30% tax offset or the release times
- **One rule in the guide is out of date.** It tells readers to request a determination before signing a contract "because the rules around when you can apply are strict". Since **15 September 2024** you need the determination before settlement, can request the release up to **90 days after signing**, and have 90 days to tell the ATO.
- **The government's own estimator is out of date too.** Treasury's FHSS estimator still uses the old $30,000 limit and a 2017 earnings rate of 4.78%; the deemed rate is now 7.51%. A current calculator would be the only up-to-date one.
- **The question is whether it's worth it.** People Also Ask leads with:
  - "Is FHSS better than saving outside super?" (5 of 16 pages)
  - "Is FHSS salary sacrifice?" (5)
  - "Is it worth doing FHSS?" (5, plus 3 more phrasings)

  After those come the tax questions (the 30% offset, "do you pay tax", "does it reduce your taxable income"), then what happens if you don't buy, how long release takes, and what you can buy.

## 2. What people are trying to work out

| Question | Evidence | Searches / month (12-month average) |
|---|---|---|
| **Can I use my super to buy a home at all?** | "use super to buy house" 1,600; "can you use your super to buy a home" 1,000; "can you use super to buy a house" 880; "super to buy first home" 590; deposit phrasings 2,490; access/withdraw phrasings 1,610; PAA "Is it smart to use your super to buy a house?", "Can I withdraw my super for first home?" | about 11,000 (9,300 in August) |
| **What is FHSS and how does it work?** | Head terms; "what is the first home super saver scheme"; autocomplete "fhss explained", "for dummies", "example" | head about 19,000, how it works about 290 |
| **Is it worth it, compared with saving in the bank?** | PAA: better than saving outside super (5), worth doing (5 + 3), disadvantages (3 + 2); Reddit "Use FHSS for first home deposit or keep it in super?"; autocomplete "fhss or hisa", "should i use fhss" | small in volume, top of People Also Ask |
| **How do I put money in?** | PAA "Is FHSS salary sacrifice?" (5); autocomplete "salary sacrifice", "voluntary contributions", "concessional", "non concessional", fund names (AustralianSuper, Hostplus, Rest, Aware, Future Super); Bing "how would they know if it was you who contributed" | about 200 named, many questions |
| **How is it taxed?** | PAA 30% offset (3 + 2), "Do you pay tax on FHSS?" (3 + 2), "Does FHSS reduce your taxable income?" (2); autocomplete "withholding rate", "tax return", "is fhss taxable income", "fhss and hecs"; Bing "is this fhss scheme an income" | about 170 named; 21 PAA questions |
| **How and when do I get the money?** | "fhss determination" 260; "ato fhss" 170; PAA "How long does FHSS release take?", "What happens if you don't use FHSS?"; autocomplete "release time", "extension", "notify ato", "after signing contract", "form", "myGov"; ATO community threads on timing | about 900 |
| **How much can I put in and get out?** | PAA "How much can I contribute / withdraw?"; autocomplete "max", "cap", "per year", "withdrawal limit", "deemed earnings rate"; Bing "can you withdraw amounts contributed that year" | part of the above |
| **What can I buy with it?** | Autocomplete "investment property", "land", "off the plan", "house price limit", "stamp duty"; PAA "Can you buy land with FHSS?", "Can I use FHSS for investment property?" | small |
| **Couples, and other schemes** | Related "Fhss for couples eligibility / withdrawal / benefits"; autocomplete "fhss and fhog", "and 5 deposit", "and hecs" | small |
| **What does it save me?** | "fhss calculator" 390, "first home super saver scheme calculator" 170, plus "withdrawal", "tax" and "salary sacrifice" calculator variants in related searches | about 650 |

## 3. Who wins the results pages

- **Organic top 10:** Reddit on 10 of 16 pages, the ATO community forum on 8, ato.gov.au on 6, firsthomebuyers.gov.au on 3, plus brokers and calculator sites.
- **AI Overviews:** on 14. They cite the ATO (9), firsthomebuyers.gov.au (7), YouTube (6), super funds (NGS, AustralianSuper, REST, AMP) and calculator sites (supercalcpro, iorder).
- **Your Property Guide:** appears on none.

The official pages are complete but procedural. The forums are where people ask "is it worth it?" and "what happens if…". A page that runs the numbers on your own situation is what's missing, and the official calculator is out of date.

## 4. What we have versus what is asked

| Cluster | `/guides/first-home-super-saver-scheme` (14 June 2026) | Gap |
|---|---|---|
| Limits | "Annual and total limits", no figures | $15,000 a year, $50,000 total, the 85% rule, counting order |
| Earnings | "Deemed earnings" | The SIC rate (7.51% from October 2026), and that the fund's actual returns don't matter |
| Tax | 15% going in | The 30% offset, withholding, the year it's taxed, HECS and other income tests, 20% FHSS tax if you don't buy |
| Timing | "Request your determination before you sign" (out of date) | Determination before settlement, release up to 90 days after signing, 15–20 business days, 12 months to buy (plus up to 12), notify within 90 days |
| Is it worth it | A section | A worked comparison with saving the same amount in a bank, and a calculator |
| Can I use my super to buy a house? | Not addressed | A direct answer page or section for the 9,300–11,000 a month |
| What you can buy | Established homes FAQ | Land and building, off the plan, no investment property, live in it 6 of the first 12 months |
| Other schemes | A related link | Can be combined with the 5% Deposit Scheme, Help to Buy, grants and duty concessions |

## 5. Recommendations, in order

1. **Rewrite the guide with the figures and fix the timing.** Lead with a dated facts box. Answer each People Also Ask question in its first sentence. Show a worked example of salary sacrificing $10,000 a year for three years against saving it in a bank.
2. **Build an FHSS calculator.**
   - Inputs: income, how you contribute (salary sacrifice or after-tax), amount a year, years, and a bank rate to compare.
   - Outputs: the amount releasable (85% rule, caps), deemed earnings at the SIC rate, tax withheld, the deposit in hand, and the same savings outside super.
   - It needs the 2026–27 tax rates and Medicare levy verified first.
3. **Answer "Can I use my super to buy a house?" on its own page.** Generally no, except voluntary contributions through FHSS (super guarantee can't be used). Cover what you can't do, and point to the FHSS guide and calculator. Any statement about SMSFs or early release grounds needs checking first.
4. **Cover the process and the edge cases** as question-led sections: salary sacrifice versus personal deductible contributions (notice of intent), how to set it up with your fund, couples, land and building, off the plan, what happens if you don't buy, and HECS.
5. **Link from the pages Copilot already trusts us for:** the deposit guide, the first home buyer guides, the 5% Deposit Scheme and Help to Buy pages, and the borrowing power and LMI calculators.
6. **Time it for tax time.** Demand peaks in May and June, when people decide on salary sacrifice before 30 June, so have it live and indexed well before May 2027.
7. **Leave alone:**
   - the radio meaning of FHSS (frequency hopping), university faculties and baby monitors, which fill autocomplete
   - general early release of super (hardship, retirement)
   - the inheritance and retirement questions that leak into People Also Ask
8. **Lead path.** FHSS readers are first home buyers months or years from buying. Default to the buyer match (`/find-an-expert?intent=buying`) as with Help to Buy, with the first home buyer guide as a lighter next step.
