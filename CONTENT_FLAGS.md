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
| Review | Chapter 5 | “Ignore the billboard, the awards (mostly bought or self-awarded)” | Carried over from the original guide. A sweeping claim about industry awards with no source; soften it or source it. |

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

**Resolved 16 Oct 2026:** every **Likely wrong** row was checked against its primary source and fixed, or found right and removed. That covers renters’ rights in every state, the 32.5% tax bracket, FIRB rules and fees, cooling-off periods by state, the arithmetic, the cash rate (4.60% since 29 September) and the posts. Two flags were themselves wrong: NSW’s First Home Owner Grant does need 12 months’ occupation (contracts from 1 July 2023), and the Sydney and Melbourne population ranges match ABS 2024-25. What remains is Conflicts, Checks and Reviews.

### Batch 2: state costs of selling, state stamp duty, CGT, property management fees

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Check | `cost-of-selling-state.ts:281`, cost-of-selling-a-house-wa | The dollar commission on a typical Perth sale is "now close to Sydney levels a decade ago" | No source. On the page's own figures a Perth median sale pays about $24,000, which looks well above a 2016 Sydney sale. |
| Check | `cost-of-selling-state.ts:77`, cost-of-selling-a-house-nsw | "From late 2026 the NSW underquoting reforms will also require a price or range in every advertisement" | No start date, and it's now October 2026. Check NSW Fair Trading. |
| Check | `cost-of-selling-state.ts:93`, cost-of-selling-a-house-nsw | "most agents will release a seller who asks in writing" | A general claim about how agents behave, with no source. |

### Batch 3: renters' rights, first home and schemes, granny flats, negotiation, settlement

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Check | renters-rights-sa `page.tsx:192` | Inspections "generally limited to 4 per year" | The SA rule may be no more than one inspection every 4 weeks. CBS SA. |
| Check | renters-rights-wa `page.tsx:135`; also `real-estate-agent-complaints-and-red-flags.ts:59` (batch 9) | Department of Mines, Industry Regulation and Safety | WA restructured departments on 1 July 2025; Consumer Protection now appears to sit in the Department of Local Government, Industry Regulation and Safety. |
| Check | renters-rights-act `page.tsx:50`, :208–209 | Inspections need "2 weeks written notice … max 4 per year" | The ACT standard terms may allow 2 inspections a year with 1 week's notice. |
| Conflict | renters-rights-act `page.tsx:308` | "6 weeks before end" (landlord's end-of-term notice without grounds) | Conflicts with the page's own grounds-only claim. |
| Check | foreign-buyer-firb-guide `page.tsx:154`, :248 | "fines up to $168,500" | No source. |
| Check | foreign-buyer-firb-guide `page.tsx:387` | "non-residents generally cannot be trustees or members of an SMSF" | Overstated: the issue is the fund's residency, not membership. ATO. |
| Check | first-home-buyer-nsw `page.tsx:273–275` | "Median around $700,000 to $900,000" | Unsourced and undated. |
| Conflict | smsf-property-guide `page.tsx:234` | Establishment "$1,000 to $2,500" | The costs table says $1,500 to $3,000. |
| Check | how-to-negotiate-property-price-australia `page.tsx:62` (also :112, KeyFigure :254) | "Buyer's agents typically save 1.5 to 4 per cent on purchase price" | The REBAA source has no link or date. |
| Conflict | renovation-cost-australia-2026 `page.tsx:78` | Full renovation $200K–$500K; second storey $250K–$450K | The body says $200,000–$400,000 (:340) and $270,000–$420,000 (:375). |
| Check | best-brisbane-suburbs-for-families-2026 `page.tsx:295` | First home buyers get concessions "up to $700K with partial relief to $800K" | Leaves out that QLD first home buyers of new homes pay no duty from 1 May 2025. |
| Conflict | best-brisbane-suburbs-for-families-2026 `page.tsx:18` (title) | "The 10 best Brisbane suburbs for families in 2026" | The page lists 12 suburbs. The title wasn't changed. |
| Check | best-brisbane-suburbs-for-families-2026 `page.tsx:157–158` | "the higher streets above Honour Avenue are above the 2011 line" | A specific flood claim with no source. BCC Flood Awareness Map. |
| Check | best-brisbane-suburbs-for-families-2026 `page.tsx:141` and throughout | Suburb medians ("around $1.4M to $1.6M") | Unsourced and undated. |
| Check | granny-flat-guide-wa `page.tsx:52` (also :190–193, FAQ :73) | "one of the two dwellings must be owner-occupied" | The R-Codes may no longer restrict who occupies an ancillary dwelling, and the size limits at :51 may be out of date. DPLH R-Codes Volume 1. |
| Check | granny-flat-guide-wa `page.tsx:54`, :250 | "below 1% vacancy since 2022" | Unsourced and undated. |
| Check | granny-flat-guide-sa `page.tsx:49` (and :155–192) | "complying development" | The 2016 planning Act uses accepted, deemed-to-satisfy and performance assessed; "complying" is the old term. PlanSA. |
| Check | granny-flat-guide-sa `page.tsx:52` (also :229–243, FAQ :74) | "SA does NOT allow purely investment dual-occupancy." | Recent changes may allow ancillary dwellings to be rented independently. Planning and Design Code. |
| Check | granny-flat-guide-sa `page.tsx:79`, :226 | "BCC requires 600m² (detached)" | Low confidence; may not match the Brisbane City Plan. |
| Check | downsizers-guide `page.tsx:223` (and the WA row :225) | Victoria: "Pensioner exemption / concession up to 50% off" | Victoria's scheme is a full exemption to $330,000 and a concession to $750,000. |
| Check | cooling-off-period-vic `page.tsx:53`, :173–179 | The list of contracts with no cooling-off | Leaves out a buyer who got independent legal advice before signing, and farmland over 20 hectares. |
| Check | `cheapest-suburbs-buy-house-australia-2026.ts:14–32` | Medians ("Toowoomba at $560K … Albany at $560K") | Unsourced and undated, and these two sit above the post's sub-$500K frame. |
| Check | house-price-forecasts-2026-2027-by-capital-city | The next updates are "the NAB quarterly survey in October and the banks' post-RBA notes in November" | Goes stale within weeks. |

### Batch 1: commission, fees and selling

Several of these are contradictions between articles in this batch (agency cooling-off, Queensland exits, sole agency, state rate ranges). Settle each once, then align every page.

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Conflict | real-estate-agent-fees-australia `page.tsx:336` | "In most states, you have a short cooling-off period (often 1 to 3 days) after signing an agency agreement" | The agency-agreements post and the negotiate and questions guides say only NSW has one (one business day). |
| Conflict | real-estate-agent-fees-australia `page.tsx:73` | "2.5% to 3.0% in QLD, WA, TAS and NT" | The page's own table has WA about 2.4% and NT 2.4% to 2.7%. |
| Conflict | real-estate-commission-vic `page.tsx:158` | "the 2.5% to 3% more common in states like Queensland and Western Australia" | The WA guide says 2% to 2.8%, typically 2.4%. |
| Conflict | how-to-choose-a-selling-agent `page.tsx:278` (and :280) | "Sydney metro: 1.5% to 2.2%"; Brisbane, Perth, Adelaide 2% to 2.8% | The NSW guide says 1.8% to 2.5%, and the SA guide's typical rate is 2%. |
| Conflict | how-to-negotiate-real-estate-agent-commission `page.tsx:497`; questions-to-ask-a-real-estate-agent `page.tsx:416` | Queensland: either party can end a 60-day-plus appointment with 30 days' written notice | The agency-agreements post says the s 114 30-day exit doesn't apply to sole or exclusive appointments. Property Occupations Act 2014 (Qld). |
| Check | `real-estate-agency-agreements-by-state.ts:74` | SA: "if you do nothing, it is extended by force of the Act for 180 days" | An automatic extension twice the 90-day maximum looks odd. SA Land and Business (Sale and Conveyancing) Regulations, reg 18. |
| Conflict | `real-estate-agency-agreements-by-state.ts:102` | "In Victoria and SA the agent must disclose rebates" | Line 89 of the same post says NSW, Queensland and SA. |
| Conflict | auction-vs-private-treaty `page.tsx:420`; `underquoting-laws-by-state.ts` | Victorian underquoting “penalties above $48,000”; the post says 200 penalty units ($41,820) | Consumer Affairs Victoria now says more than $50,000 (240 penalty units). Align both pages with CAV. |
| Check | auction-vs-private-treaty `page.tsx:281` | "Sydney 47.4%, Melbourne 50.6% the same week" | Sydney matches the combined 47.4% (line 56) exactly; possibly a copy error. Cotality, week ending 22 June 2026. |
| Check | `underquoting-laws-by-state.ts:18` (and :23) | NSW reforms expected "towards the end of 2026"; Victorian rules from 1 and 16 October 2026 | Confirm the dates now they've arrived. |
| Check | real-estate-commission-wa `page.tsx:297` (source URL :363) | "Department of Energy, Mines, Industry Regulation and Safety" | Restructured on 1 July 2025; the source link uses the old commerce.wa.gov.au domain. |
| Check | how-to-sell-a-house-australia `page.tsx:100` | Experienced agents "typically achieve 5 to 15% higher sale prices than FSBO sellers" | No source. |
| Check | how-to-sell-a-house-australia `page.tsx:59` (also :230, "5× to 15×" at :244) | "Cosmetic presentation … returns 3 to 10× its cost." | No source; the staging guide calls such figures industry claims. |
| Check | how-to-sell-a-house-australia `page.tsx:462` | "CoreLogic Australia" | Now Cotality; other guides say "Cotality (formerly CoreLogic)". |
| Check | `selling-your-home-tips-for-maximum-value.ts:12` | Styled homes "consistently sell for 5% to 10% more" | Stated as fact with no source. |
| Check | `selling-your-home-tips-for-maximum-value.ts:15` (also :19, :26) | Multiple offers "within the first two weeks"; "over 90% of buyers" | 2024 market claims with no source. |
| Conflict | home-staging-cost-australia `page.tsx:201` | Ranges "drawn from published 2026 price guides" | The Brisbane source at :456 is a 2025 guide. |
| Conflict | how-to-negotiate-real-estate-agent-commission `page.tsx:333` | "you need four sentences" | Five scripts follow. |
| Check | `fixed-fee-vs-commission-real-estate-agents.ts:59` (and :38) | "better deal by almost $15,000" | The maths gives about $15,225 ("about", not "almost"); "a downturn … as this is written" is time-sensitive. |
| Review | sell-first-or-buy-first `page.tsx:416` | "Get an independent appraisal… Free appraisal here" | Our appraisal comes from one participating agent, so it isn't independent. Suggest "a realistic appraisal". |
| Check | cost-of-selling-a-house-australia `page.tsx:350–373` | The $800,000 worked example | The table has no dollar figures. |

### Batch 4: deposits, first home guides, city markets, auctions, more renters' rights

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Check | renters-rights-nt `page.tsx:201` | Entry: "the standard is at least 24 hours" | NT routine inspections appear to need 7 days' notice, at most once every 3 months. |
| Check | renters-rights-nt `page.tsx:257` (also FAQ :91) | Lease-break exemptions include "loss of employment" | Probably not a statutory exemption. |
| Check | renters-rights-nt `page.tsx:336` | "ntlac.nt.gov.au" | NT Legal Aid's site appears to be legalaid.nt.gov.au. |
| Conflict | renters-rights-vic `page.tsx:256–258` (also FAQ :99) | Sale with vacant possession: "60 days notice" | bridging-loans-guide (sourced to CAV) says 90 days. |
| Check | renters-rights-vic `page.tsx:208` | Inspections "Maximum 4 per year, at least 24 hours notice" | Victorian general inspections appear to be once every 6 months with 7 days' notice. CAV. |
| Check | renters-rights-vic `page.tsx:152` | "over 130 new minimum standards" | The 2021 package was 130+ reforms; the minimum standards are 14 categories. |
| Check | sydney-vs-melbourne-property-market `page.tsx:147` | "the typical outer-middle-ring house price in Adelaide or Hobart" | Adelaide medians are now well above $600K. |
| Check | `perth-property-market-2026.ts:21` | Outer-suburb yields of 5 to 6.5% are "the highest in any Australian capital" | Darwin usually yields more; "tightest in WA's history" is unsourced. |
| Check | `sydney-property-market-2026.ts:10` | "Interest rates have stabilised" | May be stale for a post updated 7 October 2026. |
| Check | `australia-fastest-growing-suburbs-2026.ts:18` (also :12) | "as venue construction and Athletes Village development progress" | The Brisbane 2032 venue plan was reset in 2025; the growth percentages are unsourced. |
| Check | `contract-of-sale-wa.ts:40` | "Clause 8.1 reverses the Queensland position" | Queensland's risk rule may have changed under the Property Law Act 2023 from 1 August 2025. |
| Conflict | property-auction-guide `page.tsx:57`, :368 | Bidder registration "mandatory in NSW and VIC and standard practice elsewhere" | reserve-price-auction cites the Queensland regulation (s 23) that requires registration with photo ID. |
| Conflict | property-auction-guide `page.tsx:129` (HowTo JSON-LD) | "Even-numbered $5K or $10K increments" | The body advises bidding in non-round numbers (:385). |
| Review | property-auction-guide (title and frontmatter) | Title "how to bid and how to sell", persona "selling" | The body is written for buyers only. The title wasn't changed. |
| Conflict | first-home-buyer-qld `page.tsx:167` | "the largest state First Home Owner Grant" | True only if territories are excluded; the page's own FAQ says the NT pays $50,000. |
| Check | best-time-to-buy-property-australia `page.tsx:228` | "most lenders won’t consider income on probation" | Many lenders now do. |

### Batch 5: depreciation, first home (TAS, ACT), appraisals, granny flats, LMI, pre-approval, negative gearing, buyer's agents

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Conflict | property-depreciation-guide `page.tsx:202`, :316 | Blinds and curtains "6 years" / "blinds ($3,000 at DV 25%)" | A 6-year life gives about a 33% diminishing-value rate, not 25%. ATO TR 2022/1. |
| Check | property-depreciation-guide `page.tsx:201`, :207 | Carpet "10 years", ceiling fans "15 years" | May not match ATO residential effective lives; the example's 20% carpet rate rests on 10 years. |
| Check | `darwin-nt-property-market-2026.ts:14`, :29 | "around $610K in mid-2026, up around 4.1%"; "vacancy at 1.2% in Q1 2026" | No source. |
| Review | home-loan-pre-approval-australia `page.tsx:302` (pull quote attributed to Andy) | "An unconditional pre-approval is the single strongest negotiating signal" | The article itself says pre-approval is always conditional. Andy to reword. |
| Check | home-loan-pre-approval-australia `page.tsx:137`, :254 | "A broker submits one application across 30+ lenders"; "For 80% of borrowers" | Brokers compare many lenders but lodge each application with one; the 80% has no source. |
| Check | buying-property-australia `page.tsx:497` | Records of improvements "reduce CGT when you eventually sell" a primary residence | A main residence is generally CGT-exempt; this applies only to partial exemptions. |
| Review | buying-property-australia `page.tsx:290` | "Your Property Guide maps school catchments … across Australia." | Confirm the site has national catchment maps. |
| Review | buying-property-australia, Editor note | "Most first-home buyers I’ve worked with" (attributed to Andy) | May not fit Andy's stated background ($10M–$20M homes). Andy to confirm. |
| Check | rentvesting-australia `page.tsx:95`, :57 | Parts of the First Home Super Saver scheme "may still be accessible" | FHSS also requires never having owned property in Australia; the TLDR's "reinstated in some" contradicts the FAQ. |
| Conflict | rentvesting-australia, FAQ | Buyer's agent fees 1.5–2.5% | `service-model.ts` says 1.5–3% or $10,000–$18,000 fixed. |
| Check | `top-5-suburbs-families-moreton-bay.ts:21`, :18 | "St Eugene College and Morayfield State High School"; "Good Shepherd Catholic Primary School" | St Eugene College appears to be in Burpengary; Good Shepherd's location is unconfirmed. |
| Check | `top-5-suburbs-families-moreton-bay.ts:9` | "The Moreton Bay Region" | The council has been City of Moreton Bay since 2023. |
| Conflict | negative-gearing-australia `page.tsx:275` | Travel to inspect is listed as deductible, with "removed from 1 July 2017" on the same line | It shouldn't be in the deductible list. |
| Conflict | negative-gearing-australia `page.tsx:300` | Capital works "Only applies to properties built after 18 July 1985" | The depreciation guide uses 16 September 1987. |
| Check | negative-gearing-australia `page.tsx:277` | Borrowing costs "amortised over the loan term (typically 5 years)" | Five years, or the loan term if shorter. |
| Check | buyers-agent-cost-australia `page.tsx:241` | "on a contract usually capped at 6 to 12 weeks" | Most states set no legal cap. |
| Check | granny-flat-guide-qld `page.tsx:138` | "Most projects require a Development Application" | A complying Brisbane secondary dwelling is often accepted development needing building approval only; check the 600m²/450m² minimums too. |
| Check | granny-flat-guide-qld `page.tsx:50` | Vacancy "below 1% … for years" | No source. |
| Conflict | `negative-gearing-changes-2026-budget.ts:43`, :95, :52–54 | SMSFs under the same rules; trusts and companies "never subject to personal negative gearing"; the "substantial renovation" definition | All three disagree with negative-gearing-australia (:418), which says super funds are excluded, companies and most trusts are covered, and a ministerial instrument will define "new build". The post says it "reflects the rules as legislated"; it needs a full re-check. |
| Review | `negative-gearing-changes-2026-budget.ts:99` | "a clear break of a pre-election commitment, and the government has been honest about that" | A political claim with no source. |

### Batch 6: timing, contracts of sale, first home (SA, WA), lending, budget, builders

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Conflict | `brisbane-property-market-2026.ts:12` (and vacancy :21) | Median "around $980K in mid-2026" | Unsourced; the site's June 2026 Cotality table shows $1,118,306. |
| Check | `federal-budget-2026-property.ts:64` | "40,000 new social and affordable homes by 2029, with 279 projects committed" | The Housing Australia Future Fund's headline target has been 30,000 over five years; may mix programs. |
| Check | `federal-budget-2026-property.ts:21` | "Dwelling price growth forecast revised down to 3% in 2026 (from 5%)" | Treasury doesn't usually publish a national price forecast; source unclear. |
| Conflict | first-home-buyer-wa `page.tsx:300` | "Once contracts are exchanged …" | WA has no exchange; the page's own FAQ says the signed Offer and Acceptance is the contract. |
| Check | first-home-buyer-wa `page.tsx:288–291` | "Joondalup, Wanneroo, Butler, house medians $530K to $680K" | Look out of date against the site's Perth data ($1,046,551 median, up 23.9%). |
| Conflict | how-long-does-it-take-to-buy-a-house-australia `page.tsx:52` (also :85, :254) | "Settlement is typically 30 days in NSW and ACT" | `contract-of-sale-nsw.ts:63` says 42 days is customary in NSW. |
| Check | how-long-does-it-take-to-buy-a-house-australia `page.tsx:199` | "The median in capital city markets is 8 to 12 weeks of active searching" | No source. |
| Conflict | first-home-buyer-mistakes-to-avoid `page.tsx:87` vs :175 | "below 30% of gross household income" vs "30% of your take-home pay" | Same rule, two bases. |
| Check | how-to-find-a-builder-australia `page.tsx:82` | Home warranty "above a state-defined threshold (typically $20,000–$30,000+)" | Thresholds vary widely by state (QLD's is far lower). Check each regulator. |
| Check | how-to-find-a-builder-australia `page.tsx:53` (also :82) | "statutory warranty in QLD" | Queensland's is the Queensland Home Warranty Scheme, run by QBCC. |
| Conflict | first-home-buyer-sa `page.tsx:116` | Cooling-off "2 clear business days from the date you receive a copy of the contract" | contract-of-sale-sa says from the contract or service of the Form 1, whichever is later. |

### Batch 7: tax changes, market wraps, Help to Buy, cooling-off, due diligence, first home (NT), Canberra, Moreton Bay

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Check | `negative-gearing-cgt-changes-now-law-2026.ts:8` | "roughly eleven months" (and the excerpt's "11-month runway") | Written 24 July; about 8.5 months are left at 15 October. Label it "as at publication". |
| Check | `negative-gearing-cgt-changes-now-law-2026.ts:8` | "through the lower house 98 votes to 39" | No source. APH Hansard. |
| Check | `cheapest-suburbs-australian-capitals-winter-2026.ts:176` (and :188) | "Winter is the preparation window before the spring market"; journalist data cuts "usually same-day" | Dated now spring has started; confirm the same-day offer still stands. |
| Check | granny-flat-guide-nsw `page.tsx:100`, :339 | "can add 20 to 30% more value than the construction cost" | No source; nor for the rent and yield ranges. |
| Check | cooling-off-period-by-state-australia `page.tsx:53` (TLDR) | "Queensland, NSW, Victoria, and SA have cooling-off rights" | Leaves out the ACT and NT, which the body covers. |
| Check | cooling-off-period-by-state-australia `page.tsx:157` | Queensland: without a cooling-off statement "the period extends" | Since 1 August 2025 the seller disclosure regime applies; the remedy may be termination. Property Law Act 2023 (Qld). |
| Check | `5-percent-deposit-scheme-now-open-all-first-home-buyers.ts:26` | "The Insurance Council of Australia has estimated … up to 10% higher" | No source; check who published the estimate. |
| Conflict | `rentvesting-australia-state-by-state-guide-2026.ts:47` | Sydney suburbs with "house medians under $750K" | The site's winter data has no verified Sydney suburb under $800K (Macquarie Fields is the floor at $859K). |
| Check | `rentvesting-australia-state-by-state-guide-2026.ts:59` | SA is "a low-risk rentvesting target" | No source, and the site's data has no verified Adelaide suburb under $600K. |
| Conflict | `canberra-act-property-market-2026.ts:27` | "full stamp duty waiver … on a $700K property is roughly $27,000 saved" | The site's duty engine gives $17,048 on $700K in the ACT, and the scheme is now open to anyone with no property interest in five years. |
| Check | `canberra-act-property-market-2026.ts:24` | "Vacancy at 1.1% in Q1 2026, with weekly rents up 6 to 8%" | No source (nor for the median, days on market or forecast). |
| Check | `moreton-bay-property-market-update-q1-2025.ts:28` (also :24) | "market conditions remain favourable" | The outlook reads as current; the archive note covers only the figures. |
| Check | `nsw-building-reforms-prefab-modular-2026.ts:8` | The Building (Approvals and Practitioners) Bill 2026 "introduced in May 2026"; Productivity Commission "up to 20 per cent" | The Bill's status may have moved on; the PC attribution has no link. |
| Conflict | house-vs-apartment-investment-australia `page.tsx:203` | "Annual holding costs: $4,500" | The page's own list puts a $700K house at $10K+ a year, so "same net cash flow" doesn't hold. |
| Check | house-vs-apartment-investment-australia `page.tsx:193` | "Same deposit, same loan size after relativising for the deposit." | A $700K and a $550K purchase can't have both; rewrite the assumption. |
| Check | house-vs-apartment-investment-australia `page.tsx:277` | The after-tax model | Written in May 2026, before the negative gearing and CGT changes. |
| Conflict | `first-home-buyer-guide-moreton-bay-2025.ts:9` | "Queensland's first home buyer incentives changed on 1 July 2026" | The body says the $30,000 grant was kept, so the note implies a change that didn't happen. |
| Check | `rba-cash-rate-june-2026-what-it-means-for-buyers.ts:14`, :24 | “The official cash rate is 4.35%.” / “The next decision is due on 11 August” | Reads as current, but the RBA held on 11 August and raised to 4.60% on 29 September. The cash rate tracker was updated on 16 October; this dated post wasn’t. Consider an update note at the top. |

### Batch 8: inspections, off-market, rents and supply, Help to Buy by state, conveyancing, deposit bonds, brokers

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Conflict | `queensland-30000-first-home-grant-closing-june-2026.ts:10`, 15, 17, 27, 35, 38, 40, 46 | "ends on 30 June 2026 … drops back to … $15,000" | The original story, kept below the update note. Readers who skip the note get the wrong answer. Consider trimming the body to the update, or boxing the original as an archive. |
| Conflict | `queensland-30000-first-home-grant-closing-june-2026.ts:7–8`, :51 | Excerpt: "Days after this article ran"; publishedAt 24 June 2026 | The Budget was 23 June, the day before the post's date. |
| Check | bridging-loan-alternatives `page.tsx:260` | "ANZ says a top-up is subject to credit approval" | ANZ isn't in the page's sources. |
| Conflict | `australian-rents-record-highs-mid-2026.ts:8`, :10 | "7.8% higher than a year ago" vs "annual national rent growth at around 5.9%" | Two unsourced annual figures that disagree. |
| Check | `rental-vacancy-rate-rises-1-2-percent-2026.ts:19` | Sydney "unit rents are tipped to hit about $792 per week" | Only $23 below houses; looks high. Domain 2026 Forecast Report. |
| Check | `hobart-tasmania-property-market-2026.ts:14` | "the most affordable mainland-equivalent state for owner-occupiers" | Unclear and unsourced. |
| Check | `investment-property-guide-moreton-bay-corridor.ts:14` | "the Moreton Bay Rail Link extension" | The Rail Link opened in 2016; no extension project is clear. |
| Check | `understanding-off-market-properties.ts:9`, :22 | Off-market sales are "a significant portion" of transactions; "lower purchase prices as sellers save on marketing costs" | Unsourced share; the price logic is doubtful. |

### Batch 9: shared equity, super, Adelaide and Melbourne, auctions, regional towns, agent problems, sensitive sales

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Check | `adelaide-property-market-2026.ts:12` | Median house "around $760K in mid-2026 … Units around $440K" | Looks below even 2025 medians, though updatedAt says 14 October. |
| Check | `best-regional-towns-invest-australia-2026.ts:23` | Toowoomba's "second airport project" | Wellcamp opened in 2014; unclear what this refers to. |
| Check | `best-regional-towns-invest-australia-2026.ts:26`, :38 | Bunbury "around $470K"; Townsville "around $480K" | Look low after 2024–25 regional growth; no town figure has a source. |
| Conflict | `first-home-buyer-schemes-by-state-australia-2026.ts:17` vs :124 | "save $30,000 to $60,000 or more" vs "$40,000 to $60,000 in benefits" | Pick one range. |
| Check | `first-home-buyer-schemes-by-state-australia-2026.ts:70` | "SharedStart (Keystart)" | The shared equity guide calls it Keystart shared ownership; `help-to-buy.ts` names SharedStart as one product among several. |
| Check | `first-home-buyer-schemes-by-state-australia-2026.ts:109` | "Even one dollar over disqualifies the entire benefit" | True for the 5% Deposit Scheme and grant caps; the NSW and VIC duty concessions phase out instead. |
| Conflict | `how-to-buy-property-interstate-australia-2026.ts:45` vs :53 | "NSW solicitor cannot represent you on a QLD purchase" | Overstated (lawyers can generally practise interstate), and line 53 says they "may technically be able to assist". |
| Check | `how-to-buy-property-interstate-australia-2026.ts:17` | "Sydney median rental yield around 3% vs. Brisbane 4.5%" | Brisbane gross yields have been nearer 3.5%; no source. |
| Check | `real-estate-agent-complaints-and-red-flags.ts:59` | WA "Department of Energy, Mines, Industry Regulation and Safety" | Restructured on 1 July 2025 (see batch 1 and 3). |
| Conflict | `selling-a-house-with-tenants.ts:13` vs :26 | Ending a tenancy for a sale "everywhere except the Northern Territory, requires a genuine sale-related reason" | Line 26 says WA still allows no-grounds periodic termination on 60 days' notice (s 64). |
| Conflict | `winter-property-market-wrap-july-2026.ts` | "Interview two or three agents" | Selling guide chapter 5 says at least three. Small, but settle one line. |

### Found while fixing (16 Oct 2026)

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Check | renters-rights-qld `page.tsx:204`, FAQ :87 | The first inspection can’t happen until 3 months into the tenancy | The RTA only says routine inspections can’t happen more than once every 3 months; it says nothing about the first one. |
| Check | renters-rights-nsw, urgent repairs | Tenants can reclaim urgent repair costs | NSW Fair Trading says the landlord must reimburse within 14 days of the tenant’s written notice. The page doesn’t say so. |
| Check | auction-vs-private-treaty | “Statement of Information” | Consumer Affairs Victoria says the Property Price Statement replaces it for auctions and fixed-date sales from 16 October 2026. |
| Check | home-loan-pre-approval-australia `page.tsx:337` | “A second decline… compounds the damage” | It’s the number of credit enquiries that adds up, not a record of declines (OAIC). |
| Check | granny-flat-guide-nsw, TLDR and the “NSW advantage” callout | “the most streamlined granny flat approval pathway in Australia” | Arguable now that Victoria lets small second dwellings go ahead without a planning permit. |
| Check | granny-flat-guide-vic | Small second dwelling size limit | VC306 lifted the planning limit to 80m² on 15 October 2026; the building regulations still say 60m². The guide gives both. Recheck when the regulations catch up. |
| Check | `brisbane-property-market-2026.ts:24` | Woolloongabba listed among suburbs benefiting from 2032 | The 2032 Delivery Plan moves the main stadium to Victoria Park. |
| Check | foreign-buyer-firb-guide, land tax surcharge list | WA “no surcharge”; no ACT or Tasmania rows; SA now says to check RevenueSA | WA unconfirmed; the ACT and Tasmania appear to charge foreign owners a surcharge; RevenueSA blocked automated checks. |
| Check | rentvesting-australia `page.tsx:360` | Lenders use a higher rate buffer for investment loans | APRA’s serviceability buffer applies to all loans. |
| Check | `src/lib/guides/cost-of-selling-frontmatter.ts` | `COST_OF_SELLING_AS_OF` | The Queensland cost-of-selling text was corrected on 16 October; the shared date covers every state, so it wasn’t bumped. |

