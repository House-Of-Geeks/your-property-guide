# Content flags (campaign rebuild, October 2026)

Claims that look wrong, out of date or unsourced, found while rewriting the guides and articles. **None of these were changed:** the brief said to keep every fact as it is and list doubts here. Each needs a decision from Andy, or a check against the source named.

Severity:
- **Check:** probably fine, but needs a source or a date.
- **Conflict:** two parts of the site disagree.
- **Review:** a statement about how the business works that may not be true.
- **Likely wrong:** a newer rule, rate or figure appears to have replaced it, or the arithmetic doesn't work. Check the named source and fix it before launch.

## The business itself

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Review | `src/app/(marketing)/about/page.tsx`, Editorial standards | “We don’t publish AI-generated copy … every word that ships through our site is written and edited by named humans.” | The October 2026 rewrite of the guides and articles was drafted with AI assistance (Claude) and reviewed by the editor. The statement needs rewording to match how the site is actually written, or a human edit of every page before launch. |
| Review | `about/page.tsx`, Editorial standards | “a domain reviewer (broker, agent, accountant or conveyancer depending on topic) sanity-checks the technical claims” | Confirm this review step happens for every guide. If not, remove it. |
| Review | `about/page.tsx`, Who writes the guides; 26 article bylines | Bec Ramirez and Ellie Johnston, with detailed career bios and photos | Flagged on 13 Oct as unconfirmed. If they aren’t real people who agreed to be named, the bylines and bios need to change before launch. |
| Review | `about/page.tsx`, Corrections | Acknowledge within 48 hours, correct within 7 days | Confirm someone is staffed to meet these. |
| Review | `/agreement-check` and the confirmation email | “Someone from our team will call you” about the agreement | Confirm who takes these calls on 0455 221 921, and in what hours. |
| Check | `src/components/seo/JsonLd.tsx`, Organization | foundingDate 2024, foundingLocation Brisbane, contact email hello@yourpropertyguide.com.au | Confirm, or remove. |

## Competitors

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Check | `src/app/(marketing)/real-estate-commission-calculator/page.tsx:66` | Platforms like OpenAgent and LocalAgentFinder charge “typically 20% to 30% of their commission, or a flat fee around 0.4% of the sale price” | No published source on the site. The only basis is internal notes in `docs/lead-gen-strategy.md`. A comparison with named competitors needs a citable source (ACCC comparative advertising risk). The homepage and match pages now use the softer “Many agent-finder sites are paid a share of the agent’s commission.” |
| Check | `src/app/(marketing)/real-estate-leads/page.tsx:100, 110, 203, 208`, the break-even table at 603–615, and `src/lib/data/real-estate-leads.ts:205` | “Referral platforms take 20 to 30 per cent of your commission”; “Shared with three to five agents. Then sold again as ‘aged’.” | Same: unsourced claims about competitors on the agent-facing page. |

## The selling guide (src/content/guides/selling)

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Conflict | Chapter 3, commission table, against `src/lib/data/commission-rates.ts` (the calculators and homepage panel) | Guide: QLD 2.0–3.0% (SEQ), SA 1.9–2.75%, WA 2.2–3.25%, NT 2.5–4.0%, ACT 2.0–3.0% | Calculators: QLD 2.3–2.9%, SA 1.8–2.75%, WA 2.0–2.8%, NT 2.4–2.7%, ACT 1.8–2.25%. NSW, VIC and TAS agree. Pick one source and align both. |
| Check | Chapter 1 | Under 30 days on market “suggests a seller’s market”, past 60 buyers are in charge; clearance above about 65% favours sellers, below 55% campaigns are stalling | Rules of thumb with no source. Fine as guidance, but check they still hold for 2026. |
| Check | Chapter 2 | “Bank valuations commonly land 5 to 10 per cent below what a well-run campaign achieves” | No source. |
| Check | Chapter 6 | “Around eight in ten Australian sales happen this way” (private treaty) | No source or date. |
| Check | Chapter 6 | Weekly clearance rates above 60% in normal conditions in Sydney, Melbourne and Canberra | No source or date. |
| Conflict | Chapter 10 timeline | “Settlement window (2 to 6 weeks later)” | Chapter 9 gives 30 to 90 days, with 42 days the NSW and Victorian default. Align the timeline. |
| Check | Chapter 5 | Queensland Form 6, 90-day cap, reappointment only in the last 14 days; SA 90-day cap | Statutory details: confirm against the current Queensland and SA rules. |

## The buying guide (src/content/guides/buying)

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Check | Chapter 2 | “APRA reviewed the buffer again in 2026 and held it at 3 points” | Date-sensitive: confirm APRA’s latest review. |
| Check | Chapter 3 | Help to Buy “launched in December 2025”, lenders “initially Commonwealth Bank and Bank Australia, with more joining through 2026” | Check the current lender panel with Housing Australia. |
| Check | Chapter 8 | “Roughly three in four new Australian home loans are now written through mortgage brokers” | Check the latest MFAA/Comparator broker-share figure and add it as a dated source. |
| Check | Chapter 8 | Investor rates “typically 0.2 to 0.6 percentage points above” owner-occupier | Check current lender pricing. |
| Check | Chapter 6 | Price guides in hot auction markets “routinely finish 10 per cent or more below the result” | No source. |

## Articles (/guides/*)

Raised while the articles were reviewed for their campaign hooks, batch by batch. Static guides live at `src/app/(marketing)/guides/<slug>/page.tsx` and posts at `src/lib/data/blog-posts/<slug>.ts`. Line numbers are as at the batch's commit. No hook repeats a flagged claim.

**Fix first:** the renters' rights guides (NSW, SA, WA and ACT) give tenants legal information that looks out of date, and several tax figures still use the 32.5% bracket that became 30% on 1 July 2024.

### Batch 2: state costs of selling, state stamp duty, CGT, property management fees

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Likely wrong | `src/lib/data/cost-of-selling-state.ts:166` (also :204, "the former 5% cap"), cost-of-selling-a-house-qld | Commission was capped at 5% until deregulation on 1 December 2014 | The old Queensland maximum was 5% on the first $18,000 and 2.5% on the balance, not a flat 5%. Source: the Property Agents and Motor Dealers Regulation 2001 schedule. |
| Check | `cost-of-selling-state.ts:281`, cost-of-selling-a-house-wa | The dollar commission on a typical Perth sale is "now close to Sydney levels a decade ago" | No source. On the page's own figures a Perth median sale pays about $24,000, which looks well above a 2016 Sydney sale. |
| Check | `cost-of-selling-state.ts:77`, cost-of-selling-a-house-nsw | "From late 2026 the NSW underquoting reforms will also require a price or range in every advertisement" | No start date, and it's now October 2026. Check NSW Fair Trading. |
| Check | `cost-of-selling-state.ts:93`, cost-of-selling-a-house-nsw | "most agents will release a seller who asks in writing" | A general claim about how agents behave, with no source. |
| Likely wrong | property-management-fees-australia `page.tsx:399` | "One extra week empty on a $600 property is $600, the same as a full percentage point of management fee for a year." | 1% of $31,200 a year is $312, so a week's rent is about 1.9 points of fee. |
| Conflict | property-management-fees-australia `page.tsx:418` | "worth the 6% to 12%" | The page's own range is 5% to 12%, and the state averages are 5.8% to 8.7% (`PM_STATE_FEES`). |
| Conflict | property-management-fees-australia `page.tsx:270` | "7% to 12% in Brisbane, Perth and Adelaide" | `src/lib/data/property-management-fees.ts:457` says 7% to 11% for the same cities, and the data has Perth at 8.5% to 11%. |
| Review | property-management-fees-australia `page.tsx:215` | The averages are "the same figures Google’s AI Overview prints for this search" | SEO language in a reader-facing source note. Suggest deleting it. |
