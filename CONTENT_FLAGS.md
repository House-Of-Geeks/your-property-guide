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

### Batch 3: renters' rights, first home and schemes, granny flats, negotiation, settlement

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Likely wrong | renters-rights-nsw `page.tsx:51` (also :76–79, :264–265, :276–290); repeated in the related-link blurbs on renters-rights-sa:99, renters-rights-wa:99, renters-rights-act:103 and in renters-rights-act:279 | "No-grounds evictions are still permitted on periodic tenancies in NSW (90 days notice required)" | NSW ended no-grounds evictions from 19 May 2025: a landlord now needs a reasonable ground, at the end of a fixed term too. NSW Fair Trading. |
| Likely wrong | renters-rights-nsw `page.tsx:301` | "DVConnect on 1800 811 811" | DVConnect is Queensland's service. The NSW Domestic Violence Line is 1800 656 463. |
| Likely wrong | renters-rights-sa `page.tsx:48` (also FAQ :69, :139–141, :214) | "SA still permits no-grounds evictions on periodic tenancies, with 90 days notice required." | SA's reforms from 1 July 2024 appear to require a prescribed reason to end a tenancy. CBS SA. |
| Check | renters-rights-sa `page.tsx:192` | Inspections "generally limited to 4 per year" | The SA rule may be no more than one inspection every 4 weeks. CBS SA. |
| Likely wrong | renters-rights-wa `page.tsx:47` (also :160–163, FAQ :73–75) | "WA does not yet enforce a 12-month statutory minimum between increases" | WA's 2024 amendments (from 29 July 2024) limit increases to once every 12 months. Consumer Protection WA. |
| Check | renters-rights-wa `page.tsx:148`, :234 | "Disputes go to the Magistrates Court." | Since the 2024 reforms, bond disputes appear to go to the Commissioner for Consumer Protection. |
| Check | renters-rights-wa `page.tsx:135`; also `real-estate-agent-complaints-and-red-flags.ts:59` (batch 9) | Department of Mines, Industry Regulation and Safety | WA restructured departments on 1 July 2025; Consumer Protection now appears to sit in the Department of Local Government, Industry Regulation and Safety. |
| Likely wrong | renters-rights-act `page.tsx:201` (also FAQ :79) | "ACT doesn’t have formal rent caps" | The ACT presumes increases above 110% of the CPI rents index excessive; above that the landlord needs the tenant's agreement or ACAT approval. |
| Check | renters-rights-act `page.tsx:50`, :208–209 | Inspections need "2 weeks written notice … max 4 per year" | The ACT standard terms may allow 2 inspections a year with 1 week's notice. |
| Conflict | renters-rights-act `page.tsx:308` | "6 weeks before end" (landlord's end-of-term notice without grounds) | Conflicts with the page's own grounds-only claim. |
| Likely wrong | foreign-buyer-firb-guide `page.tsx:355` | "Non-residents pay tax at 32.5% on the first $135,000" | The foreign-resident rate has been 30% since 1 July 2024. ATO. |
| Likely wrong | foreign-buyer-firb-guide `page.tsx:214` (also FAQ :92) | "In April 2025, the Australian Government announced a temporary ban" | Announced in February 2025; applies from 1 April 2025 to 31 March 2027. firb.gov.au. |
| Conflict | foreign-buyer-firb-guide `page.tsx:65`, :189 | Temporary residents "can buy ONE established home as principal residence" | The page's own callout says the ban covers temporary residents too. |
| Likely wrong | foreign-buyer-firb-guide `page.tsx:267` (table :266–271, TLDR :66, HowTo :135) | "$75,001 to $1,000,000 … $14,100", labelled 2025–26 | Looks like an older schedule; established-dwelling fees were tripled from 1 July 2024. firb.gov.au fees. |
| Likely wrong | foreign-buyer-firb-guide `page.tsx:334–338` | "NSW. 4% annual surcharge … VIC. 2% absentee owner surcharge" | NSW is now 5% (2025 land tax year) and VIC 4% (since 2024); the QLD and SA rows may also be out of date. Each state revenue office. |
| Check | foreign-buyer-firb-guide `page.tsx:154`, :248 | "fines up to $168,500" | No source. |
| Check | foreign-buyer-firb-guide `page.tsx:387` | "non-residents generally cannot be trustees or members of an SMSF" | Overstated: the issue is the fund's residency, not membership. ATO. |
| Likely wrong | first-home-buyer-nsw `page.tsx:171` (hard-coded, not from `first-home.ts`) | Occupy "for at least 12 continuous months within 12 months of settlement" | The NSW FHOG requires 6 continuous months, starting within 12 months. Revenue NSW. |
| Check | first-home-buyer-nsw `page.tsx:273–275` | "Median around $700,000 to $900,000" | Unsourced and undated. |
| Likely wrong | smsf-property-guide `page.tsx:307` | "earning $150,000 personally (45% tax rate)" | $150,000 is in the 37% bracket (since 1 July 2024), so the "30 percentage points" saving is overstated. |
| Conflict | smsf-property-guide `page.tsx:234` | Establishment "$1,000 to $2,500" | The costs table says $1,500 to $3,000. |
| Likely wrong | smsf-property-guide `page.tsx:241` | "independently valued at least every 3 years" | The ATO requires market value every year; a 3-yearly external valuation isn't a rule. |
| Likely wrong | how-to-negotiate-property-price-australia `page.tsx:107` | Cooling-off "3 to 5 business days, state-dependent" | SA is 2 clear business days; WA and Tasmania have none. |
| Check | how-to-negotiate-property-price-australia `page.tsx:62` (also :112, KeyFigure :254) | "Buyer's agents typically save 1.5 to 4 per cent on purchase price" | The REBAA source has no link or date. |
| Likely wrong | settlement-day-australia `page.tsx:61` | Penalty interest "typically 8 to 12 per cent of the purchase price, prorated daily" | Should be per annum on the unpaid balance, as the page's own FAQ and body say. |
| Likely wrong | settlement-day-australia `page.tsx:112`, :441 | "In NSW, ACT and the NT, risk transfers at exchange." | NSW s66K keeps risk with the vendor until completion or possession; the QLD standard contract passes risk the day after the contract date. |
| Likely wrong | settlement-day-australia `page.tsx:479` (Tasmania) | "Cooling-off is 3 business days." | Tasmania has no statutory cooling-off. CBOS. |
| Likely wrong | settlement-day-australia `page.tsx:493` (NT) | "No statutory cooling-off period for private treaty sales." | The NT has a 4 business day cooling-off. |
| Likely wrong | renovation-cost-australia-2026 `page.tsx:308` | "25m² of tiling can absorb $4,000–$5,000 in tiling labour" | At the page's $60–$120/m², 25m² is $1,500–$3,000. |
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
| Likely wrong | downsizers-guide `page.tsx:73`, :176 | "the normal $110,000 a year non-concessional cap" | $120,000 since 1 July 2024. ATO. |
| Likely wrong | downsizers-guide `page.tsx:197` (also FAQ :78) | "both have lived in the home as their principal residence for at least 10 years" | The rule is 10 years' ownership by either spouse, plus main-residence eligibility. ATO. |
| Check | downsizers-guide `page.tsx:223` (and the WA row :225) | Victoria: "Pensioner exemption / concession up to 50% off" | Victoria's scheme is a full exemption to $330,000 and a concession to $750,000. |
| Likely wrong | cooling-off-period-vic `page.tsx:52` (also :84, :190, :196) | The seller keeps "the lesser of $100 or 0.2% of the purchase price" | The Act says the greater, and the page's own example ($2,000 on $1M) matches the greater. Consumer Affairs Victoria. |
| Check | cooling-off-period-vic `page.tsx:53`, :173–179 | The list of contracts with no cooling-off | Leaves out a buyer who got independent legal advice before signing, and farmland over 20 hectares. |
| Likely wrong | `cheapest-suburbs-buy-house-australia-2026.ts:14` | Lithgow and Bathurst "provide commuter-distance value to the Central Coast and Blue Mountains" | They're west of the Blue Mountains, nowhere near commuting distance to the Central Coast. |
| Check | `cheapest-suburbs-buy-house-australia-2026.ts:14–32` | Medians ("Toowoomba at $560K … Albany at $560K") | Unsourced and undated, and these two sit above the post's sub-$500K frame. |
| Check | house-price-forecasts-2026-2027-by-capital-city | The next updates are "the NAB quarterly survey in October and the banks' post-RBA notes in November" | Goes stale within weeks. |

### Batch 1: commission, fees and selling

Several of these are contradictions between articles in this batch (agency cooling-off, Queensland exits, sole agency, state rate ranges). Settle each once, then align every page.

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Conflict | real-estate-agent-fees-australia `page.tsx:336` | "In most states, you have a short cooling-off period (often 1 to 3 days) after signing an agency agreement" | The agency-agreements post and the negotiate and questions guides say only NSW has one (one business day). |
| Conflict | real-estate-agent-fees-australia `page.tsx:73` | "2.5% to 3.0% in QLD, WA, TAS and NT" | The page's own table has WA about 2.4% and NT 2.4% to 2.7%. |
| Conflict | real-estate-commission-vic `page.tsx:158` | "the 2.5% to 3% more common in states like Queensland and Western Australia" | The WA guide says 2% to 2.8%, typically 2.4%. |
| Likely wrong | how-to-choose-a-selling-agent `page.tsx:90` | "Sole agency … They get paid even if you find the buyer yourself." | That describes exclusive agency. The agency-agreements post and selling guide chapter 5 say a sole agent is paid nothing if you find the buyer. |
| Conflict | how-to-choose-a-selling-agent `page.tsx:278` (and :280) | "Sydney metro: 1.5% to 2.2%"; Brisbane, Perth, Adelaide 2% to 2.8% | The NSW guide says 1.8% to 2.5%, and the SA guide's typical rate is 2%. |
| Conflict | how-to-negotiate-real-estate-agent-commission `page.tsx:497`; questions-to-ask-a-real-estate-agent `page.tsx:416` | Queensland: either party can end a 60-day-plus appointment with 30 days' written notice | The agency-agreements post says the s 114 30-day exit doesn't apply to sole or exclusive appointments. Property Occupations Act 2014 (Qld). |
| Check | `real-estate-agency-agreements-by-state.ts:74` | SA: "if you do nothing, it is extended by force of the Act for 180 days" | An automatic extension twice the 90-day maximum looks odd. SA Land and Business (Sale and Conveyancing) Regulations, reg 18. |
| Conflict | `real-estate-agency-agreements-by-state.ts:102` | "In Victoria and SA the agent must disclose rebates" | Line 89 of the same post says NSW, Queensland and SA. |
| Conflict | auction-vs-private-treaty `page.tsx:420` | Victorian underquoting "penalties above $48,000" | The underquoting post gives 200 penalty units, or $41,820 at 2026-27 rates. |
| Check | auction-vs-private-treaty `page.tsx:288` | "the cash rate at 4.35% and the RBA still flagging possible further rises" | A 3 July 2026 snapshot; now stale. |
| Check | auction-vs-private-treaty `page.tsx:281` | "Sydney 47.4%, Melbourne 50.6% the same week" | Sydney matches the combined 47.4% (line 56) exactly; possibly a copy error. Cotality, week ending 22 June 2026. |
| Likely wrong | auction-vs-private-treaty `page.tsx:409` | "in March 2026 the NSW Government announced legislation to lift fines to $110,000" | The underquoting post says the Act passed, with stage 1 from 29 June 2026, and Victoria's published-reserve rule from 16 October 2026 isn't mentioned. |
| Check | `underquoting-laws-by-state.ts:18` (and :23) | NSW reforms expected "towards the end of 2026"; Victorian rules from 1 and 16 October 2026 | Confirm the dates now they've arrived. |
| Check | real-estate-commission-wa `page.tsx:297` (source URL :363) | "Department of Energy, Mines, Industry Regulation and Safety" | Restructured on 1 July 2025; the source link uses the old commerce.wa.gov.au domain. |
| Check | how-to-sell-a-house-australia `page.tsx:100` | Experienced agents "typically achieve 5 to 15% higher sale prices than FSBO sellers" | No source. |
| Check | how-to-sell-a-house-australia `page.tsx:59` (also :230, "5× to 15×" at :244) | "Cosmetic presentation … returns 3 to 10× its cost." | No source; the staging guide calls such figures industry claims. |
| Check | how-to-sell-a-house-australia `page.tsx:462` | "CoreLogic Australia" | Now Cotality; other guides say "Cotality (formerly CoreLogic)". |
| Check | `selling-your-home-tips-for-maximum-value.ts:12` | Styled homes "consistently sell for 5% to 10% more" | Stated as fact with no source. |
| Check | `selling-your-home-tips-for-maximum-value.ts:15` (also :19, :26) | Multiple offers "within the first two weeks"; "over 90% of buyers" | 2024 market claims with no source. |
| Conflict | home-staging-cost-australia `page.tsx:201` | Ranges "drawn from published 2026 price guides" | The Brisbane source at :456 is a 2025 guide. |
| Conflict | how-to-negotiate-real-estate-agent-commission `page.tsx:333` | "you need four sentences" | Five scripts follow. |
| Likely wrong | how-to-negotiate-real-estate-agent-commission `page.tsx:433` | "$11,200" | Ignores the 2.2% fee on the extra $16,000; the net gain is about $10,850. |
| Check | `fixed-fee-vs-commission-real-estate-agents.ts:59` (and :38) | "better deal by almost $15,000" | The maths gives about $15,225 ("about", not "almost"); "a downturn … as this is written" is time-sensitive. |
| Review | sell-first-or-buy-first `page.tsx:416` | "Get an independent appraisal… Free appraisal here" | Our appraisal comes from one participating agent, so it isn't independent. Suggest "a realistic appraisal". |
| Check | cost-of-selling-a-house-australia `page.tsx:350–373` | The $800,000 worked example | The table has no dollar figures. |

### Batch 4: deposits, first home guides, city markets, auctions, more renters' rights

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Likely wrong | renters-rights-nt `page.tsx:46` (also :86, :172) | Bond "Lodged with NT Consumer Affairs within 7 days of receipt." | The NT has no central bond authority; landlords hold the bond in trust. Residential Tenancies Act 1999 (NT). |
| Likely wrong | renters-rights-nt `page.tsx:187` (also TLDR :47, FAQ :70) | "Landlords can technically increase every 30 days on a periodic tenancy" | The NT appears to limit increases to once every 6 months. |
| Check | renters-rights-nt `page.tsx:201` | Entry: "the standard is at least 24 hours" | NT routine inspections appear to need 7 days' notice, at most once every 3 months. |
| Check | renters-rights-nt `page.tsx:257` (also FAQ :91) | Lease-break exemptions include "loss of employment" | Probably not a statutory exemption. |
| Check | renters-rights-nt `page.tsx:336` | "ntlac.nt.gov.au" | NT Legal Aid's site appears to be legalaid.nt.gov.au. |
| Likely wrong | renters-rights-qld `page.tsx:47` (also :72, :131–137, :237) | "QLD's 2024 reforms moved toward grounds-based evictions" | No-grounds notices ended (and the pet rules started) on 1 October 2022, so the "pre-2024 / transitional" row is probably wrong. RTA. |
| Check | renters-rights-qld `page.tsx:77`, :184 | Emergency repairs "up to $300" | The Queensland cap is two weeks' rent. RTA. |
| Check | renters-rights-qld `page.tsx:50`, :189 | "urgent (24 to 48 hours)" | Queensland law has emergency and routine repairs only. |
| Likely wrong | renters-rights-qld `page.tsx:280` | RTA "1800 512 888" | The RTA's published number is 1300 366 311. |
| Conflict | renters-rights-vic `page.tsx:256–258` (also FAQ :99) | Sale with vacant possession: "60 days notice" | bridging-loans-guide (sourced to CAV) says 90 days. |
| Check | renters-rights-vic `page.tsx:208` | Inspections "Maximum 4 per year, at least 24 hours notice" | Victorian general inspections appear to be once every 6 months with 7 days' notice. CAV. |
| Check | renters-rights-vic `page.tsx:152` | "over 130 new minimum standards" | The 2021 package was 130+ reforms; the minimum standards are 14 categories. |
| Likely wrong | renters-rights-tas `page.tsx:47`, :70, :185 (also description :16) | Rent increases need "at least 42 days written notice" | Tasmania appears to require 60 days. CBOS. |
| Likely wrong | renters-rights-tas `page.tsx:75`, :248 (also TLDR :50) | "Tasmania still permits no-grounds notices to vacate." | s 42 of the Residential Tenancy Act 1997 lists grounds; periodic leases appear unable to end without one. |
| Likely wrong | sydney-vs-melbourne-property-market `page.tsx:184` | The same income can "finance roughly $900K to $1.0M in Melbourne… but only $600K to $700K in Sydney" | The same income borrows the same amount in either city; only what it buys differs. |
| Likely wrong | sydney-vs-melbourne-property-market `page.tsx:205` | Sydney adds "60,000 to 80,000 people per year… Melbourne 80,000 to 110,000" | Both have recently added well over 100,000 a year. ABS. |
| Check | sydney-vs-melbourne-property-market `page.tsx:147` | "the typical outer-middle-ring house price in Adelaide or Hobart" | Adelaide medians are now well above $600K. |
| Check | `perth-property-market-2026.ts:21` | Outer-suburb yields of 5 to 6.5% are "the highest in any Australian capital" | Darwin usually yields more; "tightest in WA's history" is unsourced. |
| Check | `sydney-property-market-2026.ts:10` | "Interest rates have stabilised" | May be stale for a post updated 7 October 2026. |
| Check | `australia-fastest-growing-suburbs-2026.ts:18` (also :12) | "as venue construction and Athletes Village development progress" | The Brisbane 2032 venue plan was reset in 2025; the growth percentages are unsourced. |
| Check | `contract-of-sale-wa.ts:40` | "Clause 8.1 reverses the Queensland position" | Queensland's risk rule may have changed under the Property Law Act 2023 from 1 August 2025. |
| Conflict | property-auction-guide `page.tsx:57`, :368 | Bidder registration "mandatory in NSW and VIC and standard practice elsewhere" | reserve-price-auction cites the Queensland regulation (s 23) that requires registration with photo ID. |
| Conflict | property-auction-guide `page.tsx:129` (HowTo JSON-LD) | "Even-numbered $5K or $10K increments" | The body advises bidding in non-round numbers (:385). |
| Likely wrong | property-auction-guide `page.tsx:221–224` (also FAQ :88) | Price guides must represent expectations "under Australian consumer law" | Underquoting rules are state law, and Queensland bans auction price guides. |
| Review | property-auction-guide (title and frontmatter) | Title "how to bid and how to sell", persona "selling" | The body is written for buyers only. The title wasn't changed. |
| Conflict | first-home-buyer-qld `page.tsx:167` | "the largest state First Home Owner Grant" | True only if territories are excluded; the page's own FAQ says the NT pays $50,000. |
| Check | best-time-to-buy-property-australia `page.tsx:228` | "most lenders won’t consider income on probation" | Many lenders now do. |

### Batch 5: depreciation, first home (TAS, ACT), appraisals, granny flats, LMI, pre-approval, negative gearing, buyer's agents

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Conflict | property-depreciation-guide `page.tsx:202`, :316 | Blinds and curtains "6 years" / "blinds ($3,000 at DV 25%)" | A 6-year life gives about a 33% diminishing-value rate, not 25%. ATO TR 2022/1. |
| Check | property-depreciation-guide `page.tsx:201`, :207 | Carpet "10 years", ceiling fans "15 years" | May not match ATO residential effective lives; the example's 20% carpet rate rests on 10 years. |
| Likely wrong | `darwin-nt-property-market-2026.ts:20` | "most residential land is on Crown Lease and operates similarly to freehold" | Most established Darwin residential land appears to be freehold. NT Land Titles Office. |
| Check | `darwin-nt-property-market-2026.ts:14`, :29 | "around $610K in mid-2026, up around 4.1%"; "vacancy at 1.2% in Q1 2026" | No source. |
| Likely wrong | `queensland-30000-grant-locked-in-help-to-buy-expands.ts:15` | "the largest first home grant in the country, tied with Tasmania's" | The NT grant is $50,000, and Tasmania's dropped to $20,000 on 1 July 2026 (`src/lib/policy/first-home.ts`). |
| Likely wrong | lenders-mortgage-insurance-guide `page.tsx:365` | "the additional $82,000 plus $82,000 more in stamp duty and ongoing costs" | Garbled: the extra duty on an $82,000 higher price is a few thousand dollars. |
| Likely wrong | home-loan-pre-approval-australia `page.tsx:105` | "getting a Lender's Mortgage Insurance buffer in your pre-approval" | LMI isn't a buffer and doesn't cover a low valuation; probably meant borrowing headroom. |
| Review | home-loan-pre-approval-australia `page.tsx:302` (pull quote attributed to Andy) | "An unconditional pre-approval is the single strongest negotiating signal" | The article itself says pre-approval is always conditional. Andy to reword. |
| Likely wrong | home-loan-pre-approval-australia `page.tsx:345` | "the rejections stay on your file for 5 years" | The enquiry stays for 5 years, not whether it was declined. OAIC. |
| Check | home-loan-pre-approval-australia `page.tsx:137`, :254 | "A broker submits one application across 30+ lenders"; "For 80% of borrowers" | Brokers compare many lenders but lodge each application with one; the 80% has no source. |
| Likely wrong | buying-property-australia `page.tsx:422`, :111 | "TAS. 3 business days (penalty: 0.25%)" | Tasmania has no statutory cooling-off; the site's own TAS first home guide says so. |
| Likely wrong | buying-property-australia `page.tsx:420` | "SA. 2 business days (penalty: 0.25% of purchase price)" | In SA the vendor can keep at most $100 of the deposit. CBS SA. |
| Conflict | buying-property-australia `page.tsx:262` | Duty on $700,000: "around $14,175" (QLD), "approximately $26,857" (NSW) | The site's duty engine gives $17,350 for QLD and $25,687 for NSW (`src/lib/utils/stamp-duty.ts`). |
| Check | buying-property-australia `page.tsx:497` | Records of improvements "reduce CGT when you eventually sell" a primary residence | A main residence is generally CGT-exempt; this applies only to partial exemptions. |
| Review | buying-property-australia `page.tsx:290` | "Your Property Guide maps school catchments … across Australia." | Confirm the site has national catchment maps. |
| Review | buying-property-australia, Editor note | "Most first-home buyers I’ve worked with" (attributed to Andy) | May not fit Andy's stated background ($10M–$20M homes). Andy to confirm. |
| Likely wrong | rentvesting-australia `page.tsx:235` | "Tax benefit at 39c marginal rate: $4,727" | $130,000 is in the 30% bracket for 2026-27, so the saving and the "+$607" result are overstated. |
| Conflict | rentvesting-australia `page.tsx:229` | "Mortgage interest (4-bedroom, $400,000 loan" | The example property is a 3-bedroom house (:217). |
| Check | rentvesting-australia `page.tsx:95`, :57 | Parts of the First Home Super Saver scheme "may still be accessible" | FHSS also requires never having owned property in Australia; the TLDR's "reinstated in some" contradicts the FAQ. |
| Likely wrong | rentvesting-australia `page.tsx:360` | "rental income is haircut by 70–80%" | Lenders usually count 70–80% of the rent (a 20–30% haircut). |
| Conflict | rentvesting-australia, FAQ | Buyer's agent fees 1.5–2.5% | `service-model.ts` says 1.5–3% or $10,000–$18,000 fixed. |
| Check | `top-5-suburbs-families-moreton-bay.ts:21`, :18 | "St Eugene College and Morayfield State High School"; "Good Shepherd Catholic Primary School" | St Eugene College appears to be in Burpengary; Good Shepherd's location is unconfirmed. |
| Check | `top-5-suburbs-families-moreton-bay.ts:9` | "The Moreton Bay Region" | The council has been City of Moreton Bay since 2023. |
| Conflict | negative-gearing-australia `page.tsx:275` | Travel to inspect is listed as deductible, with "removed from 1 July 2017" on the same line | It shouldn't be in the deductible list. |
| Likely wrong | negative-gearing-australia `page.tsx:256` | "worth approximately $1,128,000 after 10 years, a gain of $428,000" | $700,000 at 5% for 10 years is about $1,140,000, a gain of about $440,000. |
| Conflict | negative-gearing-australia `page.tsx:300` | Capital works "Only applies to properties built after 18 July 1985" | The depreciation guide uses 16 September 1987. |
| Check | negative-gearing-australia `page.tsx:277` | Borrowing costs "amortised over the loan term (typically 5 years)" | Five years, or the loan term if shorter. |
| Likely wrong | buyers-agent-cost-australia `page.tsx:91` | "NSW requires a Class 1 or Class 2 Real Estate Licence (Stock and Station)" | Buyer's agents need a real estate licence; stock and station is a separate category. |
| Check | buyers-agent-cost-australia `page.tsx:241` | "on a contract usually capped at 6 to 12 weeks" | Most states set no legal cap. |
| Likely wrong | granny-flat-guide-vic `page.tsx:49`, :154 (and the planning framing throughout) | "no state-wide complying-development pathway … you typically need a council planning permit" | Since December 2023 (VC253) small second dwellings up to 60m² need no planning permit in most residential zones. |
| Check | granny-flat-guide-qld `page.tsx:138` | "Most projects require a Development Application" | A complying Brisbane secondary dwelling is often accepted development needing building approval only; check the 600m²/450m² minimums too. |
| Check | granny-flat-guide-qld `page.tsx:50` | Vacancy "below 1% … for years" | No source. |
| Conflict | `negative-gearing-changes-2026-budget.ts:43`, :95, :52–54 | SMSFs under the same rules; trusts and companies "never subject to personal negative gearing"; the "substantial renovation" definition | All three disagree with negative-gearing-australia (:418), which says super funds are excluded, companies and most trusts are covered, and a ministerial instrument will define "new build". The post says it "reflects the rules as legislated"; it needs a full re-check. |
| Review | `negative-gearing-changes-2026-budget.ts:99` | "a clear break of a pre-election commitment, and the government has been honest about that" | A political claim with no source. |

### Batch 6: timing, contracts of sale, first home (SA, WA), lending, budget, builders

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Likely wrong | fixed-vs-variable-rate-guide `page.tsx:264` | "As of April 2026, the RBA … has subsequently begun reducing the cash rate." | The site's own data says the RBA raised rates three times in 2026, to 4.35% (`src/lib/data/data-updates.ts:26`, the APRA and home-values posts). |
| Likely wrong | fixed-vs-variable-rate-guide `page.tsx:155` (also :171) | "the RBA’s monthly cash rate decision" | The RBA has met eight times a year since 2024. |
| Likely wrong | `brisbane-property-market-2026.ts:24` | "Cross River Rail is operating" | Its opening was pushed back to later in the decade. |
| Check | `brisbane-property-market-2026.ts:24` | Suburbs benefiting include "Albion (Athletes Village area), Woolloongabba" | The 2032 venue and village plans were reworked in 2025. |
| Conflict | `brisbane-property-market-2026.ts:12` (and vacancy :21) | Median "around $980K in mid-2026" | Unsourced; the site's June 2026 Cotality table shows $1,118,306. |
| Likely wrong | `federal-budget-2026-property.ts:95`; also the home-values post :34 | "the policy is now law from budget night" | Budget measures need legislation; on 13 May they applied from budget night but weren't law. |
| Check | `federal-budget-2026-property.ts:64` | "40,000 new social and affordable homes by 2029, with 279 projects committed" | The Housing Australia Future Fund's headline target has been 30,000 over five years; may mix programs. |
| Check | `federal-budget-2026-property.ts:21` | "Dwelling price growth forecast revised down to 3% in 2026 (from 5%)" | Treasury doesn't usually publish a national price forecast; source unclear. |
| Conflict | first-home-buyer-wa `page.tsx:300` | "Once contracts are exchanged …" | WA has no exchange; the page's own FAQ says the signed Offer and Acceptance is the contract. |
| Check | first-home-buyer-wa `page.tsx:288–291` | "Joondalup, Wanneroo, Butler, house medians $530K to $680K" | Look out of date against the site's Perth data ($1,046,551 median, up 23.9%). |
| Conflict | how-long-does-it-take-to-buy-a-house-australia `page.tsx:52` (also :85, :254) | "Settlement is typically 30 days in NSW and ACT" | `contract-of-sale-nsw.ts:63` says 42 days is customary in NSW. |
| Likely wrong | how-long-does-it-take-to-buy-a-house-australia `page.tsx:223` (TOC :63) | Cooling-off "3 to 5 business days" in NSW, VIC, QLD, SA, ACT and NT | SA is 2 clear business days and the NT 4. |
| Check | how-long-does-it-take-to-buy-a-house-australia `page.tsx:199` | "The median in capital city markets is 8 to 12 weeks of active searching" | No source. |
| Likely wrong | offset-accounts-explained-australia `page.tsx:264` | "On a 32.5 per cent marginal rate…" | The 32.5% bracket became 30% on 1 July 2024. |
| Conflict | first-home-buyer-mistakes-to-avoid `page.tsx:87` vs :175 | "below 30% of gross household income" vs "30% of your take-home pay" | Same rule, two bases. |
| Likely wrong | first-home-buyer-mistakes-to-avoid `page.tsx:82` | "3 to 5 business days in most states" | SA is 2 clear business days; WA and Tasmania have none. |
| Check | how-to-find-a-builder-australia `page.tsx:82` | Home warranty "above a state-defined threshold (typically $20,000–$30,000+)" | Thresholds vary widely by state (QLD's is far lower). Check each regulator. |
| Check | how-to-find-a-builder-australia `page.tsx:53` (also :82) | "statutory warranty in QLD" | Queensland's is the Queensland Home Warranty Scheme, run by QBCC. |
| Conflict | first-home-buyer-sa `page.tsx:116` | Cooling-off "2 clear business days from the date you receive a copy of the contract" | contract-of-sale-sa says from the contract or service of the Form 1, whichever is later. |

### Batch 7: tax changes, market wraps, Help to Buy, cooling-off, due diligence, first home (NT), Canberra, Moreton Bay

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Check | `negative-gearing-cgt-changes-now-law-2026.ts:8` | "roughly eleven months" (and the excerpt's "11-month runway") | Written 24 July; about 8.5 months are left at 15 October. Label it "as at publication". |
| Check | `negative-gearing-cgt-changes-now-law-2026.ts:8` | "through the lower house 98 votes to 39" | No source. APH Hansard. |
| Likely wrong | `property-market-wrap-late-july-2026-spring-outlook.ts:6`, :8 (title) | "Tuesday's inflation number" / "On Tuesday 29 July" | 29 July 2026 is a Wednesday. The title wasn't changed. |
| Likely wrong | `property-market-wrap-late-july-2026-spring-outlook.ts:36` | The selling guide "now comes with a printable Spring 2026 selling countdown" | The rebuilt guide offers a printable 12-week timeline, not a Spring 2026 countdown. |
| Check | `cheapest-suburbs-australian-capitals-winter-2026.ts:176` (and :188) | "Winter is the preparation window before the spring market"; journalist data cuts "usually same-day" | Dated now spring has started; confirm the same-day offer still stands. |
| Likely wrong | granny-flat-guide-nsw `page.tsx:146` (also :49) | "Low Rise Housing Diversity Code (formerly the Affordable Rental Housing SEPP 2009)" | The ARH SEPP was replaced by the Housing SEPP 2021, which now holds the secondary dwelling rules. NSW Planning Portal. |
| Check | granny-flat-guide-nsw `page.tsx:158` | "NSW is unique in having a state-wide complying development pathway" | Victoria has allowed small second dwellings without a permit since December 2023. |
| Check | granny-flat-guide-nsw `page.tsx:100`, :339 | "can add 20 to 30% more value than the construction cost" | No source; nor for the rent and yield ranges. |
| Check | cooling-off-period-by-state-australia `page.tsx:53` (TLDR) | "Queensland, NSW, Victoria, and SA have cooling-off rights" | Leaves out the ACT and NT, which the body covers. |
| Check | cooling-off-period-by-state-australia `page.tsx:157` | Queensland: without a cooling-off statement "the period extends" | Since 1 August 2025 the seller disclosure regime applies; the remedy may be termination. Property Law Act 2023 (Qld). |
| Conflict | due-diligence-checklist-buying-a-house `page.tsx:89`, :191 | "cooling-off period (varies by state, 3 to 14 days)" | The cooling-off guide says 2 to 5 business days, and none in WA or Tasmania. |
| Likely wrong | due-diligence-checklist-buying-a-house `page.tsx:114` | "3–5 days in NSW, 3 days in VIC" | NSW is 5 business days. |
| Likely wrong | due-diligence-checklist-buying-a-house `page.tsx:389` | "Property Stock and Business Agents Act 2002 (NSW) cooling-off rules" | NSW cooling-off is in the Conveyancing Act 1919 (s 66S on). |
| Check | `5-percent-deposit-scheme-now-open-all-first-home-buyers.ts:26` | "The Insurance Council of Australia has estimated … up to 10% higher" | No source; check who published the estimate. |
| Likely wrong | `rentvesting-australia-state-by-state-guide-2026.ts:20` | Losses "can offset other income via negative gearing" | Established homes bought after budget night have losses quarantined from 1 July 2027 (the site's own tax-changes post). |
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
| Check | `rba-cash-rate-june-2026-what-it-means-for-buyers.ts:14`, :24; `src/app/(marketing)/rba-cash-rate/page.tsx:40` | "The official cash rate is 4.35%." / "The next decision is due on 11 August" | Reads as current, but the 11 August and 29 September decisions have passed. The RBA tracker page still shows 16 June as the latest decision. |

### Batch 8: inspections, off-market, rents and supply, Help to Buy by state, conveyancing, deposit bonds, brokers

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Likely wrong | `queensland-30000-first-home-grant-closing-june-2026.ts:6` (title and SEO title) | "Queensland's $30,000 First Home Owner Grant for New Homes Closes 30 June" | The grant didn't close: the 2026-27 Budget kept it (QRO). The update note at the top says so, but the title still tells searchers it closes. Suggest keeping the slug and retitling, for example "Queensland’s $30,000 first home grant: the 30 June deadline that never came". |
| Conflict | `queensland-30000-first-home-grant-closing-june-2026.ts:10`, 15, 17, 27, 35, 38, 40, 46 | "ends on 30 June 2026 … drops back to … $15,000" | The original story, kept below the update note. Readers who skip the note get the wrong answer. Consider trimming the body to the update, or boxing the original as an archive. |
| Conflict | `queensland-30000-first-home-grant-closing-june-2026.ts:7–8`, :51 | Excerpt: "Days after this article ran"; publishedAt 24 June 2026 | The Budget was 23 June, the day before the post's date. |
| Likely wrong | capital-growth-vs-cash-flow-australia `page.tsx:80` | 3 to 5% growth on $700,000 "is roughly $25,000 to $40,000 per year" | About $21,000 to $35,000. |
| Likely wrong | capital-growth-vs-cash-flow-australia `page.tsx:293–295` | "roughly $40,000 in year one, $50,000 in year five, $70,000 in year ten" | At 5% on $700,000: about $35k, $43k and $54k. |
| Likely wrong | capital-growth-vs-cash-flow-australia `page.tsx:100`, :133, :285–287 | "average incomes (32.5 per cent marginal rate)"; "$6,750 net" | The 32.5% bracket became 30% on 1 July 2024. |
| Likely wrong | how-to-choose-a-mortgage-broker `page.tsx:58` | 0.10–0.40% off the rate saves "$30,000–$120,000 … on a $600,000 mortgage" | Over 30 years at about 6%, roughly $14k–$56k. |
| Likely wrong | how-to-choose-a-mortgage-broker `page.tsx:103` | A broker "must … be a member of either MFAA … or FBAA" | Association membership isn't a legal requirement; AFCA membership is. ASIC. |
| Likely wrong | how-to-choose-a-mortgage-broker `page.tsx:213` | Volume bonuses: "that practice was banned in 2019" | Legislated from 1 January 2021; the industry dropped them earlier. |
| Likely wrong | how-to-choose-a-mortgage-broker `page.tsx:303` | Link to the financial advisers register | Brokers are on ASIC's credit licensee and representative registers. |
| Check | bridging-loan-alternatives `page.tsx:260` | "ANZ says a top-up is subject to credit approval" | ANZ isn't in the page's sources. |
| Likely wrong | building-pest-inspection `page.tsx:505–506` | Warranty "usually 6 years for structural defects, 2 years for non-structural defects in most states" | Victoria is 10 years and Queensland 6.5 years / 12 months; others differ. |
| Likely wrong | building-pest-inspection `page.tsx:423` | Check the inspector's "membership in the Australian Institute of Building Surveyors (AIBS)" | AIBS covers building surveyors and certifiers, not pre-purchase inspectors. |
| Conflict | `australian-rents-record-highs-mid-2026.ts:8`, :10 | "7.8% higher than a year ago" vs "annual national rent growth at around 5.9%" | Two unsourced annual figures that disagree. |
| Check | `rental-vacancy-rate-rises-1-2-percent-2026.ts:19` | Sydney "unit rents are tipped to hit about $792 per week" | Only $23 below houses; looks high. Domain 2026 Forecast Report. |
| Check | `hobart-tasmania-property-market-2026.ts:14` | "the most affordable mainland-equivalent state for owner-occupiers" | Unclear and unsourced. |
| Check | `investment-property-guide-moreton-bay-corridor.ts:14` | "the Moreton Bay Rail Link extension" | The Rail Link opened in 2016; no extension project is clear. |
| Check | `understanding-off-market-properties.ts:9`, :22 | Off-market sales are "a significant portion" of transactions; "lower purchase prices as sellers save on marketing costs" | Unsourced share; the price logic is doubtful. |

### Batch 9: shared equity, super, Adelaide and Melbourne, auctions, regional towns, agent problems, sensitive sales

| Severity | Where | Claim | Why it's flagged |
|---|---|---|---|
| Check | `adelaide-property-market-2026.ts:12` | Median house "around $760K in mid-2026 … Units around $440K" | Looks below even 2025 medians, though updatedAt says 14 October. |
| Likely wrong | `adelaide-property-market-2026.ts:15` | "The northern foothills (Gilberton, Walkerville, Stepney)" | These are inner north-eastern suburbs on the Torrens, not foothills. |
| Check | `best-regional-towns-invest-australia-2026.ts:23` | Toowoomba's "second airport project" | Wellcamp opened in 2014; unclear what this refers to. |
| Check | `best-regional-towns-invest-australia-2026.ts:26`, :38 | Bunbury "around $470K"; Townsville "around $480K" | Look low after 2024–25 regional growth; no town figure has a source. |
| Conflict | `first-home-buyer-schemes-by-state-australia-2026.ts:17` vs :124 | "save $30,000 to $60,000 or more" vs "$40,000 to $60,000 in benefits" | Pick one range. |
| Check | `first-home-buyer-schemes-by-state-australia-2026.ts:70` | "SharedStart (Keystart)" | The shared equity guide calls it Keystart shared ownership; `help-to-buy.ts` names SharedStart as one product among several. |
| Check | `first-home-buyer-schemes-by-state-australia-2026.ts:109` | "Even one dollar over disqualifies the entire benefit" | True for the 5% Deposit Scheme and grant caps; the NSW and VIC duty concessions phase out instead. |
| Conflict | `how-to-buy-property-interstate-australia-2026.ts:45` vs :53 | "NSW solicitor cannot represent you on a QLD purchase" | Overstated (lawyers can generally practise interstate), and line 53 says they "may technically be able to assist". |
| Check | `how-to-buy-property-interstate-australia-2026.ts:17` | "Sydney median rental yield around 3% vs. Brisbane 4.5%" | Brisbane gross yields have been nearer 3.5%; no source. |
| Check | `real-estate-agent-complaints-and-red-flags.ts:59` | WA "Department of Energy, Mines, Industry Regulation and Safety" | Restructured on 1 July 2025 (see batch 1 and 3). |
| Conflict | `selling-a-house-with-tenants.ts:13` vs :26 | Ending a tenancy for a sale "everywhere except the Northern Territory, requires a genuine sale-related reason" | Line 26 says WA still allows no-grounds periodic termination on 60 days' notice (s 64). |
| Likely wrong | `selling-a-house-with-tenants.ts:78` | For an inherited home, "the two-year clock runs from settlement rather than contract" | The deceased estate post (:66) says the clock runs from the date of death and ends at settlement. ATO. |
| Conflict | `winter-property-market-wrap-july-2026.ts` | "Interview two or three agents" | Selling guide chapter 5 says at least three. Small, but settle one line. |
