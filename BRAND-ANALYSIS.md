# BRAND-ANALYSIS.md, Your Finance Guide (sister-site recon)

**Source:** `https://yourfinanceguide.com.au` (homepage, `/journeys`, `/calculators`, observational only, no other pages successfully fetched).
**Purpose:** Reference snapshot for the property sister brand. Observational, not prescriptive. Phase 2 will translate this into a Your Property Guide direction.

---

## 1. Snapshot

Your Finance Guide ("YFG") positions itself as **"Australia's plain-English finance education · Est. 2014"**, an education-first publisher that runs free guides, calculators and structured learning paths, then matches readers with credentialed advisors (mortgage brokers, financial planners, etc.) on the back end. It earns referral fees from advisors when a match leads to engaged work, and discloses this on every match. The product framing is ungated content as the pull, with a single, high-trust hand-off as the conversion. Their phrase: **"Education first. Connect second. Always in that order."**

---

## 2. IA map

**Top nav (in order):**
- Learn
- Calculators
- Specialists
- Our charter
- Phone (`07 3337 7680`), visible as a nav-level element
- **Start here** (primary CTA, top-right)

**Primary hubs:**
- `/journeys`, six structured learning paths (First Home Buyer, Refinancing, Property Investor, Upgrading, Self-Employed, Building/New); each shown as a card with stage count + reading-time estimate.
- `/resources`, "200+ plain-English guides" library, filterable (All / First home / Investing / Refinancing / Super & SMSF / Insurance).
- `/calculators`, 12 free tools, presented as cards with title + one-line benefit + range badge.
- `/#match`, the single matching/lead-capture endpoint, anchored on the homepage and reached via every "Get connected" / "Find my match" / "Tell us your situation" CTA in the page.
- `/#newsletter`, bottom-of-home email subscribe.

**Footer nav groups:** Learn · Tools · Network · Company; plus legal links (Privacy, Terms, Credit Guide, Complaints, Editorial policy).

**Calculator-page sub-IA:** two interactive calculators inline at the top of `/calculators` (Loan Repayment, Borrowing Power), then 8 "More Calculators" as cards, then a comparison-rate disclaimer block, then a CTA section, then footer.

---

## 3. Visual system

> Caveat: hex values are inferred from observation, not extracted from inline CSS. Treat them as starting points, not source of truth.

**Colours (observed):**
- **Primary surfaces:** warm cream / off-white background, gives an editorial/print feel rather than a SaaS feel.
- **Accent, homepage:** warm orange/coral on CTAs and highlights.
- **Accent, `/journeys`:** teal/turquoise on card titles, "Start" buttons, link hovers. *(Suggests they use accent-by-section rather than one universal accent, worth confirming.)*
- **Neutrals:** dark charcoal/navy for headings, mid-grey body, light-grey borders.
- **Semantic:** green used for "savings"/"positive" framing.

**Typography:**
- Sans-serif throughout, weight-forward for headings, clean utility sans for body. No heavy serif/display contrast, the editorial feel comes from spacing and prose, not from a serif headline.
- Hero headline ~48–56px, sub-heads ~24–32px, body ~16px, generous line-height.

**Spacing & shape language:**
- Generous whitespace; card-based grids with subtle shadows.
- Card radius ~8–12px; buttons ~6px radius with ~12–16px padding.
- Buttons have three clear roles: solid accent (primary), outline (secondary), text-only (ghost).
- Iconography: minimal SVG outlines, checkmarks. No heavy illustration; no stock photography of "happy couples", testimonial photos look like real, unposed portraits.

**Imagery direction:**
- Full-bleed hero sections; medium-radius rounded cards.
- Real-people testimonial photos (Priya & Tom, Daniel K., Sarah M.) with location + outcome attribution.
- Images served via Next.js image optimisation (`/_next/image?url=…&w=…&q=75`) suggesting responsive lazy loading.

**Inline notes for property sister-brand:**
- The cream/warm-neutral palette is *opposite* to YPG's current black-header / white-body / purple-and-magenta system (`--primary #5c2d5e`, `--accent #DD3C70`). YPG today reads as confident-bold-real-estate; YFG reads as calm-trusted-editorial. Phase 2 needs an explicit decision: do we evolve YPG to share YFG's editorial calm, or keep YPG visually distinct under the same brand-of-brands wrapper?
- The per-section accent rotation (orange on home, teal on `/journeys`) is interesting and easy to mis-copy badly. Don't inherit unless we have a clear reason.

---

## 4. Voice samples

Verbatim, with a one-line note on what makes each work.

1. **"Australia's plain-English finance education · Est. 2014"**, positions the category before the brand; "Est. 2014" is the trust signal, no badges needed.
2. **"Learn the money stuff first. _Then take the next step._"**, short clauses, italic emphasis on the action. Reads aloud well.
3. **"Plain-English guides, free calculators, and answers to the questions you weren't sure you were allowed to ask."**, the second clause names the emotional barrier (embarrassment), not the topic.
4. **"Education first. Connect second. Always in that order."**, three-beat slogan that doubles as an internal operating principle.
5. **"Every guide is written by an advisor in our network, then edited until your nan could follow it."**, Australianism ("your nan") earns the plain-English claim instead of asserting it.
6. **"No paywalls. No affiliate fluff."**, names what the user is suspicious of, doesn't soften it.
7. **"The guides, calculators and answers stand on their own, free, ungated, unsponsored."**, three adjectives in series, no hedging.
8. **"Specialists who slip get removed. We'd rather lose them than you."**, declarative; takes the user's side against their own supply.
9. **"Free · No commitment"** (calculator label), minimum-viable trust copy at the moment of friction.
10. **"They reach out within 24 hours"** (post-submit), concrete promise, not "we'll be in touch shortly".

**CTA labels (verbatim):** `Start learning →` · `Or get connected` · `Start the path →` · `Match me with a broker →` · `Get connected →` · `Find my match →` · `Tell us your situation` · `Start` · `Subscribe, it's free →` · `Get Pre-Approved Today` · `Find a Broker`.

**Disclaimer (verbatim, footer):**
> "AM Marketing Group Pty Ltd (ABN 37 613 053 286) trading as Your Finance Guide. We are an education publisher and referral platform, **we do not provide credit**, are not a credit assistance provider, and do not give personal financial advice."

---

## 5. Lead funnel mechanics

**Single matching form at `/#match`.** No mid-page modal-bombing; no exit-intent popovers observed.

**Trigger pattern:** every "Get connected →" / "Find my match →" / "Match me with a broker →" / "Tell us your situation" CTA across the homepage, `/journeys`, `/calculators` and (presumably) `/resources` deep-links to the same anchor. The form is *the* destination, not a side-feature.

**Form structure (observed step 1 of 4):**
- **Q1: "What are you working through?"**, single-select multiple-choice, options: *Buy a home (First or next) · Invest in property · Refinance · Plan my future · Sort my super · Protect my family*.
- Steps 2–4 not observable without progressing.

**Newsletter signup (separate, at `/#newsletter`):**
- One field: email address.
- CTA: `Subscribe, it's free →`.
- Trust micro-copy directly under the field: `✓ 11,200 readers · ✓ Unsubscribe in one click · ✓ Never shared`.

**Post-submit promise:** **"They reach out within 24 hours"** + the framing **"Free · No commitment · One match"**, note the "one match", not three competing quotes (this is a *deliberate* anti-aggregator stance).

---

## 6. Trust devices

| Device | Wording / form | Where it sits |
|---|---|---|
| Star rating | `★ 4.9 / 320+ Google reviews` | Shown twice on homepage (header area + lower trust band) |
| Volume proof | `12,400+ Australians we've helped take a next step` | Trust band |
| Library proof | `200+ Plain-English guides, free to read` | Trust band |
| Tool proof | `12 Free calculators & decision tools` | Trust band |
| Outcome proof | `98% Of readers say a guide answered what they came for` | Trust band |
| Charter (4 principles) | `Education is the product` · `No paid placements` · `One match, not five` · `Tell us when we're wrong` | Dedicated section on home; "Our charter" in nav |
| Revenue transparency | `Advisors in our network pay us a referral fee when a match leads to engaged work. We disclose this on every match.` + `Free. They only earn from us if you choose to work with them.` | At the matching CTA, not buried in footer |
| Calculator transparency | `Free · No commitment` | Inline on calculator pages |
| Testimonials | Three named testimonials with photo + location + outcome (Priya & Tom, Daniel K., Sarah M.) | Mid-home |
| Regulatory disclaimer | "We do not provide credit / not a credit assistance provider / do not give personal financial advice" | Footer, on every page |

**Pattern worth noting:** YFG puts the *commercial transparency* (referral fee disclosure) right next to the *conversion CTA*, not buried in legal. That's the trust move, the user reads the disclosure at the moment of decision.

---

## 7. What to inherit, what to differentiate

| Theme | Same as YFG | Sister-brand-distinct (YPG) | Reasoning |
|---|---|---|---|
| **Operating principle** | "Education first. Connect second." as the brand spine. |, | The whole network is built on this; YPG already has the data + guides infrastructure to honour it (35 long-form guides, 7 calculators, suburb data). |
| **Charter / 4 principles** | Adopt the charter pattern (4 stated principles, named "Charter") and put it in nav. | Re-author the principles for property, "One agent match, not five quotes" maps cleanly; "No paid placements" is harder because YPG monetises listings, needs an honest YPG-specific version. | Charter is the trust spine of the brand-of-brands, but the words must be true for property economics, not copy-pasted. |
| **Single matching endpoint** | One canonical `/#match`-style form, every CTA points to it, post-submit "we'll reach out in 24h" promise. | YPG today has at least 7 form variants going to one endpoint (`/api/leads`), can keep the variants but unify the *language* and *post-submit* experience. | YPG's funnel sprawl is a liability vs. YFG's discipline. |
| **Visual system** | Inherit: generous whitespace, card grids, subtle shadows, ungated calculators with "Free · No commitment" micro-copy, real-people testimonials over stock. | Diverge: YPG's current Playfair-Display-on-headings + black header + purple/magenta is more editorial-premium than YFG's warm-cream-orange. Decision needed: keep YPG's distinct skin, or pull YPG closer to YFG's warm neutral. | Brand-of-brands works *either* with shared skin (instantly recognisable family) *or* with shared principles + distinct skins (each brand stands alone). Andy needs to call this. |
| **Tone of voice** | Inherit: short declarative sentences; name the user's actual fear ("questions you weren't sure you were allowed to ask"); Australianisms over corporate; refuse hedging. | Diverge on subject-matter idioms, property has its own vocabulary (auction clearance, off-market, negative gearing) and YPG should sound like someone who walks suburbs, not someone who reads policy. | Same DNA, different domain dialect. |
| **Lead micro-copy** | "Free · No commitment · One match" / "They reach out within 24 hours" pattern. | YPG today says "Get free appraisal" / "No obligation, just expert advice", close in spirit but more generic. Tighten to the YFG cadence. | Consistency across the brand-of-brands. |
| **Trust band / numbers** | Inherit the pattern (4–5 numeric proof points in one band). | YPG needs its own real numbers, properties indexed, suburbs profiled, schools indexed, guides published. Today's homepage has `<StatsBar>` already; check what it actually displays. | Numbers must be true. |
| **Disclaimer placement** | Inherit: regulatory disclaimer in every footer; commercial-model transparency *next to the CTA*, not just in legal. | YPG's disclosure is different (real-estate referral, not credit), needs its own legally-correct wording, not YFG's. | Same architectural pattern, different content. |
| **Per-section accent colour** |, | Don't inherit. YFG's orange-on-home / teal-on-journeys feels accidental rather than systematic. YPG's single-accent token system (`--accent`) is cleaner; keep it. | Easy to mis-copy; low brand value. |
| **Iconography / illustration** | Inherit: minimal SVG outlines, no heavy illustration, no stock-shoot couples. |, | Already aligns with YPG's `lucide-react` usage. |
| **Dashboard / authenticated area** |, | Distinct: YPG has a real agent/agency dashboard (listings CRUD, team management, admin). YFG appears to be content+matching only. | These are different products under one brand language. |

---

*End of brand recon. Phase 2 should make explicit decisions on: (a) skin alignment with YFG vs. distinct YPG identity; (b) per-section accent rotation yes/no; (c) charter wording for property economics; (d) which YFG numbers-band format YPG can honestly fill.*
