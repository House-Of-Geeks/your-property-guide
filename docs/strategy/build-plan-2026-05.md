# Your Property Guide — Strategic Build Plan for Claude Code

**Owner:** Andy McMaster
**Site:** https://www.yourpropertyguide.com.au
**Created:** 13 May 2026
**Scope:** Sequenced, three-workstream rebuild — SEO content engine, Best Deals/partner monetisation module, and Homepage/IA reshape.

---

## 1. The vision (read this first, every session)

Your Property Guide should be **the place Australians go to learn what they need to know about property** — buying, selling, investing, renovating, renting, moving. Not a listings portal. Not a research database. A *learning destination* that:

1. **Teaches first.** Plain-English, sourced, ungated guides that rank for the questions real people Google.
2. **Surfaces vetted "Best Deals" properties from partner agents** as featured opportunities — small in volume, high in trust.
3. **Funnels readers toward connection with a vetted property professional** (agent, broker, buyer's agent, conveyancer) who will make them or save them thousands.

The site is monetised by partner agents/brokers paying us when matched work goes ahead. Buyers and sellers pay nothing.

**The mental model for every page:** *teach the reader something useful → show them a relevant Best Deal or a relevant pro → make connection one click away*.

---

## 2. Current state (May 2026)

What's already strong:
- Next.js stack on Vercel, clean component system, design language is consistent.
- 51 guides, 9.7k+ schools, suburb data across 8 states, 38 calculators/tools.
- Working "match me with a specialist" lead-capture flow.
- Agent dashboard exists (`/dashboard/login`).
- Recent budget/news desk reporting is genuinely sharp.
- Brand voice is good — confident, plain-English, no fluff.

Where it's missing the mark vs. the vision:
- **Homepage leads with data/research, not learning.** A first-time visitor doesn't immediately understand "this is where I learn about property". The four persona cards are good but buried beneath a generic hero.
- **No featured "Best Deals" surface anywhere prominent.** The "Six suburbs worth a look" module shows suburbs, not partner properties.
- **The path to a property pro is soft.** "Get connected" is a header link and an anchor. No persistent in-context CTAs inside guides. No "talk to a broker about this" moments at the natural decision points.
- **Topic coverage has real holes:** renovations (nearly nothing), moving/relocation, selling deep content (only 4 guides), broker selection, off-the-plan, building new, state stamp duty calculators as standalone pages, rentvesting, granny flat ROI calculators.
- **Internal linking between guides → tools → suburb data → match flow is inconsistent.** SEO is leaving juice on the table.

---

## 3. North-star metrics

Anything you ship should move at least one:
- **Organic sessions** to /guides/* (proxy for ranking improvement)
- **Match form starts** per 1,000 sessions (proxy for funnel strength)
- **Match form completions** per 1,000 sessions (proxy for end-to-end conversion)
- **Best Deal clickthroughs** per 1,000 sessions (once shipped)
- **Partner-paid conversions** (the dollar metric — measured in the dashboard)

Add these as comments in PR descriptions: *"Expected to lift X by Y."*

---

## 4. Workstream sequencing

We're running three workstreams in parallel-ish, with strict sequencing on dependencies. Treat each phase below as a milestone with multiple GitHub issues underneath it.

```
Phase 1 — SEO foundation & audit (Week 1)
   ├─ Technical SEO baseline
   ├─ Guide template upgrade
   ├─ Internal-linking system
   └─ Keyword universe + content backlog (see §8)

Phase 2 — Best Deals partner module (Week 2–3)
   ├─ Data model & schema
   ├─ Agent submission flow (extends existing dashboard)
   ├─ Admin moderation/approval
   └─ Public display components

Phase 3 — Homepage + IA reshape (Week 3–4)
   ├─ Homepage rebuild — learn-first hierarchy
   ├─ Persona landing pages (FHB, Selling, Upgrading, Investing)
   ├─ In-guide CTAs ("Talk to a [pro] about this")
   └─ Renovations hub (new IA section)

Phase 4 — Content production (Week 2 onward, continuous)
   └─ Ship 4–6 guides/week against the keyword backlog

Phase 5 — Measurement & iteration (Week 4+)
   ├─ Analytics events on every CTA
   ├─ A/B test framework for hero + match flow
   └─ Partner reporting dashboard
```

---

## 5. Phase 1 — SEO foundation

### 1.1 Run a technical SEO audit and fix the foundations

**Goal:** Eliminate the boring blockers before we pour content on top.

**Tasks (each = one PR):**
- Crawl the live site (Screaming Frog–style: any open-source crawler in-repo is fine). Output a CSV of every URL with status code, canonical, title length, meta description length, H1 count, internal links in/out.
- Build a `/scripts/seo/audit.ts` that we can re-run before every content sprint.
- Fix any 4xx/5xx pages and orphan pages (zero internal links pointing in).
- Validate sitemap.xml covers every guide, suburb, calculator, persona page. It should be split into named sub-sitemaps (`sitemap-guides.xml`, `sitemap-suburbs.xml`, etc.).
- Add `robots.txt` with explicit `Sitemap:` directive.
- Validate every page has: unique title (50–60 chars), unique meta description (150–160 chars), canonical, OG tags, Twitter card.
- Add JSON-LD structured data to every guide: `Article` schema (or `FAQPage` where Q&A is present), `BreadcrumbList`, `Organization`.
- Add `HowTo` schema where applicable (any guide with numbered steps).
- Add `Product` or `Offer` schema to Best Deals once shipped.
- Verify Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1 on mobile for the homepage, /guides, and three sample guide pages.

**Acceptance:**
- `pnpm run seo:audit` produces a clean report (no errors, warnings triaged).
- PageSpeed Insights mobile score ≥ 90 for homepage and any sample guide.
- Google Search Console "Enhancements" passes for Article, Breadcrumb, FAQ.

### 1.2 Upgrade the guide template

**Goal:** Every new guide should be a ranking machine *and* a conversion surface, by default.

**Required elements in the guide page template:**
1. H1 with the primary keyword.
2. "Last updated" date and author byline (already present — keep).
3. **Above-the-fold TL;DR box** (3–5 bullets summarising the answer).
4. **Inline table of contents** that jumps to subheads (anchor-linked).
5. **Auto-generated "Related guides" block** based on tag overlap (see §1.3).
6. **Two in-content CTAs at natural decision points** — not just at the end. e.g. a guide on "How to Choose a Selling Agent" should have a "Match me with a vetted selling agent in my suburb →" card after the "What to look for" section, and another at the conclusion.
7. **One "Best Deal" slot per guide** (once Phase 2 ships) — contextually filtered (e.g. an investing guide shows investor-friendly deals).
8. **FAQ block at the bottom with FAQPage schema** — minimum 5 Q&As scraped from People Also Ask or the editorial brief.
9. **Author bio block** with E-E-A-T signals (qualifications, disclosure).
10. **Sources & methodology footer** (already partial — make it consistent and structured).

**Tasks:**
- Refactor the guide layout component to accept these blocks as first-class props/MDX components.
- Build the MDX components: `<TLDR>`, `<TOC />`, `<RelatedGuides />`, `<MatchCTA persona="selling" />`, `<BestDealSlot context="investing" />`, `<FAQ />`, `<AuthorBio author="..." />`, `<Sources />`.
- Backfill existing guides progressively (don't block on this — see §4 content production).

**Acceptance:**
- New guides authored in MDX render the full template by default.
- FAQPage schema validates in Google's Rich Results Test for any guide using `<FAQ />`.

### 1.3 Internal linking system

**Goal:** Stop relying on writer discipline. Make internal linking automatic and dense.

**Tasks:**
- Tag every guide with a structured taxonomy: `audience` (fhb, seller, upgrader, investor, renter), `topic` (deposit, lmi, agent-selection, renovation, …), `state` (nsw, vic, qld, …, national), `funnel-stage` (awareness, consideration, decision).
- Build a `<RelatedGuides />` component that picks the 4 highest-overlap guides by tag intersection, deterministically (so it's stable).
- Build a `<NextStep />` component that picks the next logical guide in the funnel for the audience (e.g. on the "First Home Buyer Guide", `<NextStep />` for a NSW reader points to "First Home Buyer Guide, NSW").
- Build a glossary auto-linker: any time a term in `/glossary` appears in body text of a guide, link its first occurrence to the glossary entry.
- Build a suburb auto-linker: any time a suburb name + state appears in a guide, link to that suburb's profile page.
- Build a tools auto-linker: any time a phrase like "stamp duty calculator" or "mortgage repayment" appears, link to the corresponding tool.

**Acceptance:**
- Every guide page has ≥ 8 outbound internal links (count them in the SEO audit script).
- Auto-linker doesn't double-link (only first occurrence in a section).
- Auto-linker is testable: snapshot tests for at least 5 guides confirming expected links.

---

## 6. Phase 2 — Best Deals partner module

### 2.1 Data model

**Goal:** Define the canonical structure for a "Best Deal" partner property.

Suggested schema (adapt to existing ORM/DB):

```ts
type BestDeal = {
  id: string;
  partnerAgentId: string;          // FK to agents table
  status: 'draft' | 'pending_review' | 'live' | 'expired' | 'rejected';

  // Listing basics
  title: string;                    // "4-bed family home, near new schools, Newcastle"
  headline: string;                 // 1-line pitch
  pitch: string;                    // 2-3 sentence "why this is a good deal" from the agent
  propertyType: 'house' | 'apartment' | 'townhouse' | 'land' | 'commercial';
  suburb: string;                   // FK to suburbs
  state: AusState;
  postcode: string;
  bedrooms: number | null;
  bathrooms: number | null;
  carSpaces: number | null;
  landArea: number | null;          // m²
  buildArea: number | null;         // m²
  priceGuide: { min: number; max: number } | null;
  priceText: string | null;         // "Offers over $X" / "Contact agent"

  // Media
  heroImage: string;                // CDN URL
  gallery: string[];                // additional images
  floorplanUrl: string | null;
  externalListingUrl: string | null; // optional outbound link to agent's own listing

  // Targeting (this is the magic)
  dealType: ('first-home' | 'investor' | 'downsizer' | 'upgrader' | 'renovator')[];
  tags: string[];                   // 'sub-median', 'high-yield', 'below-replacement-cost', 'auction-this-weekend', etc.

  // Lifecycle
  publishAt: Date;
  expiresAt: Date;                  // default 30 days
  lastReviewedBy: string | null;    // staff user ID

  // Compliance
  disclosureText: string;           // "Partner agent. We're paid if work goes ahead." or similar
  agentCommissionDisclosed: boolean;
};
```

**Tasks:**
- Migration adding `best_deals` table with the above structure.
- Indexing on `(status, publishAt)`, `(state, suburb)`, `(dealType)`, `(expiresAt)`.
- Cron/scheduled function that flips deals from `live` → `expired` past `expiresAt`.

### 2.2 Agent submission flow

**Goal:** Vetted partner agents can submit a Best Deal in under 5 minutes from the existing dashboard.

**Tasks:**
- Add `/dashboard/best-deals` route protected by agent auth.
- "Submit a Best Deal" form. Required: title, headline, pitch, type, suburb (autocomplete from suburbs table), bedrooms/bathrooms, price guide, hero image upload (CDN), expiry date (max 60 days), deal type targeting, agent's disclosure acknowledgement.
- Image upload: enforce 1200×800 minimum, optimise via Vercel Image / Next.js Image, write to object storage.
- On submit: status = `pending_review`, notify staff via the existing notification channel (Slack webhook? email?). Confirm what's currently wired.
- Agent can edit their own draft/pending submissions. Cannot edit once `live` (must withdraw and resubmit).
- Agent dashboard shows status, expiry countdown, view stats per deal.

### 2.3 Admin moderation

**Goal:** No deal goes live without a human at YPG approving it. Trust is the whole product.

**Tasks:**
- Add `/admin/best-deals` route protected by staff role.
- Inbox view: queue of `pending_review`, sortable, filterable by state/agent.
- Review screen: full preview of how the deal will display + agent context (track record on the platform, prior deals' performance, complaints).
- One-click Approve (sets `live`, sets `publishAt`, audit log), Request changes (with notes back to agent), Reject (with reason).
- Bulk expire / unpublish actions for cleanup.

### 2.4 Public display components

**Goal:** Best Deals show up in the right contexts — and never feel like an ad.

**Components:**
- `<BestDealCard variant="hero" | "compact" | "in-guide" />` — three variants, all use same data.
- `<BestDealsRail context={...} state={...} limit={6} />` — horizontal scrollable rail. Used on homepage and persona landing pages.
- `<BestDealsGrid />` — full grid view at `/best-deals` (new route).
- `<BestDealSlot context="investing" />` — single-card slot for in-guide injection (rendered by the guide template).

**Selection logic:** prioritise (a) deals matching the page's audience/state context, (b) freshness (newer = higher), (c) deal performance proxy (clickthroughs to date — but only after we have signal). Always show partner disclosure.

**Routes:**
- `/best-deals` — all live deals, filterable by state, type, deal type.
- `/best-deals/[id]` — individual deal page with full pitch, gallery, agent profile, "Get connected with this agent" CTA.
- `/best-deals/[state]` and `/best-deals/[state]/[suburb]` for SEO long-tail.

### 2.5 The "Get connected" funnel on Best Deals

**Goal:** A reader who clicks a Best Deal is one form away from the right pro.

- Every Best Deal has a primary CTA: **"Get connected with [Agent Name] →"**.
- Clicking it opens the match form pre-filled with: deal context, agent ID, reader's intent (buyer / investor inferred from the deal type).
- Track the path: Best Deal viewed → Best Deal clicked → match form started → match form completed → handoff to agent.

---

## 7. Phase 3 — Homepage + IA reshape

### 3.1 New homepage hierarchy

The new homepage tells a clear story in this order:

1. **Hero — "Learn what you need to know about property in Australia."**
   - Sub-hed: *Plain-English guides, vetted partner deals, and the right pro on your side. Free, ungated, no email gate.*
   - Primary CTA: "Start with my situation →" (opens persona picker)
   - Secondary CTA: "Browse all guides"
   - Replace the existing stat strip (60+ data points etc.) with something more emotionally resonant — keep one social-proof stat at most.

2. **Persona picker (already exists — keep, elevate).**
   - The four cards are good. Make them THE primary navigation device on the homepage. Each card should link to the persona landing page (see §3.2) — not just an in-page anchor.

3. **Featured guides rail — "What buyers/sellers/investors are reading this week"**
   - 4–6 of the highest-traffic or editorially-flagged guides. Updated weekly.

4. **Best Deals rail — "Featured opportunities from our partners"**
   - 6 live Best Deals, contextual where possible (e.g. served by detected state from IP).
   - Clear "Partner agent" disclosure on every card.
   - "Why we feature these →" link to the charter.

5. **Tools strip — "Run the numbers"**
   - Three highest-utility tools: mortgage calc, stamp duty calc, affordability.

6. **Suburb explorer — "Or look up a suburb"**
   - Keep the existing search-led module. Demote it from competing for top billing.

7. **News desk — "What just changed"**
   - Latest 3 news/policy posts. Already exists, keep.

8. **"Why we're free" charter block.** Already exists, keep verbatim — this is your trust moat.

9. **Newsletter signup** + footer.

**Acceptance:**
- The homepage answers "what is this site?" in under 5 seconds for a cold visitor.
- The Best Deals rail loads above the fold on mobile (after hero).
- All 4 persona cards link to their dedicated landing pages.

### 3.2 Persona landing pages

Build four dedicated landing pages — these become primary SEO targets:

- `/first-home-buyers` → keyword: "first home buyer guide australia"
- `/selling` → keyword: "how to sell a house in australia"
- `/upgrading` → keyword: "selling and buying at the same time"
- `/investing` → keyword: "property investment australia for beginners"

Each persona page is structured as:
1. Hero with persona-specific promise + match CTA.
2. "Where to start" — 3–5 of the most important guides for this persona.
3. State selector → links to state-specific guides.
4. Featured Best Deals filtered for this persona.
5. Tools relevant to this persona.
6. FAQ block (FAQPage schema).
7. "Talk to a vetted [agent/broker/buyer's agent]" CTA → opens match form.

### 3.3 In-guide match CTAs

Every guide should have at least two contextual match CTAs at natural decision points. These are not generic — they're keyed off the guide's tags:

| Guide tagged with | CTA reads |
|---|---|
| `agent-selection`, `seller` | "Match me with a vetted selling agent in my suburb →" |
| `broker`, `mortgage` | "Talk to a mortgage broker about your situation →" |
| `buyers-agent`, `investor` | "Match me with a buyer's agent who works in this market →" |
| `conveyancing` | "Find a conveyancer in my state →" |
| `renovation`, `building` | "Talk to a builder/QS about your project →" *(future)* |

The CTA card should be visually distinct from the body, but never feel like an interstitial ad.

### 3.4 Renovations hub (new IA section)

This is a major content gap and a huge keyword opportunity. Spin up `/renovating` as a fifth persona-style hub, with its own landing page and guide cluster (see keyword universe §8).

---

## 8. Target keyword universe

Build the content backlog from this list. Each cluster gets a pillar guide (the head term) plus 6–12 supporting guides (long-tail). All clusters internally link to each other where overlap exists.

### Cluster A — First home buyers (partial coverage today; fill gaps)

| Keyword | Intent | Have today? |
|---|---|---|
| first home buyer guide australia | informational/pillar | ✅ |
| how much deposit to buy a house | informational | ✅ |
| first home owner grant [state] × 8 | informational | ✅ (8 state pages) |
| stamp duty calculator [state] × 8 | transactional/tool | ⚠️ (calculator exists but no state pages) |
| first home super saver scheme | informational | ❌ |
| guarantor home loan australia | informational | ❌ |
| how to get pre-approval for a home loan | informational | ❌ |
| help to buy scheme australia | informational | ❌ |
| shared equity scheme australia | informational | ❌ |
| keystart loans wa | informational | partial |
| how to bid at an auction | informational | partial |
| how much does it cost to buy a house | informational | ❌ |

### Cluster B — Selling your home (very thin today)

| Keyword | Intent | Have today? |
|---|---|---|
| how to sell a house in australia | informational/pillar | ❌ |
| how to choose a real estate agent | informational | ✅ |
| real estate agent commission [state] × 8 | informational | partial (national only) |
| how to prepare your house for sale | informational | ❌ |
| home staging cost australia | informational | ❌ |
| auction vs private treaty | informational | ❌ |
| how to negotiate the agent commission | informational | ❌ |
| how long does it take to sell a house | informational | ❌ |
| best time to sell a house in australia | informational | ❌ |
| vendor advocacy australia | informational/commercial | ❌ |
| off-market sale australia | informational | ❌ |
| what is an underquoting law [state] × 4 | informational | ❌ |

### Cluster C — Property investors (decent coverage; layer on)

| Keyword | Intent | Have today? |
|---|---|---|
| how to invest in property australia | informational/pillar | ❌ |
| rentvesting australia | informational | ❌ |
| negative gearing australia | informational | ✅ |
| positive cash flow properties australia | informational | ❌ |
| best suburbs for investment [state] × 8 | informational/commercial | partial |
| how to find an investment property | informational | ❌ |
| buyers agent vs real estate agent | informational | ❌ |
| how much does a buyer's agent cost | informational | ✅ |
| property investment loan vs owner-occupier | informational | ❌ |
| interest-only investment loans | informational | ❌ |
| land tax [state] × 8 | informational | ❌ |
| capital gains tax property australia | informational | ✅ (post-budget) |
| how to invest in property with $50k | informational | ❌ |
| how to invest in property with no money | informational | ❌ |
| commercial property investment australia | informational | ❌ |
| nrass scheme replacement | informational | ❌ |

### Cluster D — Renovations (almost nothing today — biggest opportunity)

| Keyword | Intent | Have today? |
|---|---|---|
| how to renovate a house australia | informational/pillar | ❌ |
| renovation cost australia 2026 | informational | ❌ |
| kitchen renovation cost australia | informational | ❌ |
| bathroom renovation cost australia | informational | ❌ |
| how to renovate to add value | informational | ❌ |
| renovation roi calculator | tool | ❌ |
| do you need council approval to renovate | informational | ❌ |
| how to find a builder australia | informational | ❌ |
| fixed-price vs cost-plus building contracts | informational | ❌ |
| owner builder permit [state] × 8 | informational | ❌ |
| how to add a second storey | informational | ❌ |
| knock down rebuild australia | informational | ❌ |
| extension cost australia | informational | ❌ |
| how to finance a renovation | informational | ❌ |
| home equity loan for renovation | informational | ❌ |
| construction loan vs renovation loan | informational | ❌ |
| how long does a renovation take | informational | ❌ |
| best paint colours to sell a house | informational | ❌ |
| renovation mistakes to avoid | informational | ❌ |

### Cluster E — Buying process & due diligence (partial)

| Keyword | Intent | Have today? |
|---|---|---|
| how to buy a house in australia | informational/pillar | ✅ |
| how long does it take to buy a house | informational | ✅ |
| cooling-off period [state] × 8 | informational | partial (single national) |
| conveyancing cost australia | informational | partial |
| building and pest inspection cost | informational | ✅ |
| how to read a contract of sale | informational | ❌ |
| section 32 victoria | informational | ❌ |
| settlement day what to expect | informational | ❌ |
| pre-settlement inspection checklist | informational | ❌ |
| strata report what to look for | informational | ❌ |
| how to avoid buying a lemon | informational | ❌ |
| due diligence checklist buying a house | informational | ❌ |

### Cluster F — Mortgages & finance (very thin)

| Keyword | Intent | Have today? |
|---|---|---|
| how to choose a mortgage broker | informational | ❌ |
| mortgage broker vs bank | informational | ❌ |
| best home loan rates australia 2026 | commercial/informational | ❌ |
| home loan pre-approval australia | informational | ❌ |
| how much can I borrow | tool/informational | partial (calc exists) |
| offset account vs redraw facility | informational | ❌ |
| how to refinance a home loan | informational | ❌ |
| when to refinance australia | informational | ❌ |
| split loan home loan | informational | ❌ |
| lmi waiver professions | informational | ❌ |
| serviceability calculator | tool | ❌ |
| comparison rate vs interest rate | informational | ❌ |

### Cluster G — Moving & relocation (zero today)

| Keyword | Intent | Have today? |
|---|---|---|
| how to move house in australia | informational/pillar | ❌ |
| how to choose a removalist | informational | ❌ |
| moving costs australia | informational | ❌ |
| change of address checklist australia | informational | ❌ |
| moving interstate guide | informational | ❌ |
| connect utilities new home | informational/commercial | ❌ |
| broadband when moving house | informational | ❌ |

### Cluster H — Suburb research (strong; surface as landing pages)

The suburb data is already great. The win here is publishing **listicle-style "Best suburbs in X for Y" pages** for high-intent searches:

| Keyword pattern | Examples |
|---|---|
| best suburbs for first home buyers in [city] | Sydney, Melbourne, Brisbane, Perth, Adelaide |
| best suburbs for families in [city] | × 5 cities |
| best suburbs for young professionals in [city] | × 5 cities |
| best suburbs for investment in [city] 2026 | × 8 cities |
| cheapest suburbs in [city] | × 8 cities |
| up and coming suburbs in [city] | × 8 cities |
| best suburbs near the beach in [city] | × 5 cities |
| best suburbs with good schools in [city] | × 8 cities |

Each is a programmatic SEO opportunity — generate from suburb data with an editorial intro/outro.

### Production targets

- **Phase 1 (Weeks 1–2): 12 highest-priority new guides.** Pick the most search-volume × commercial-intent gaps. My picks (one from each major cluster): *how to sell a house in australia*, *rentvesting australia*, *renovation cost australia 2026*, *how to choose a mortgage broker*, *home loan pre-approval australia*, *how to find a builder australia*, *cooling-off period (5 state versions)*, *due diligence checklist buying a house*.
- **Phase 2+ ongoing: 4–6 guides/week** against the backlog above, sequenced by cluster.

---

## 9. Technical guardrails for Claude Code

Conventions for every PR:

- **Branch naming:** `feat/phase-{n}-{short-slug}`, `fix/{short-slug}`, `content/{guide-slug}`.
- **One workstream per PR.** Don't mix content with infra.
- **PR description template** must include: *what changed, why, expected metric impact, screenshots if UI, schema validation if SEO, rollback notes*.
- **Type-check + lint must pass.** No `any` types in new code.
- **No new dependencies without justification.** Prefer existing utilities.
- **MDX/content files:** always include frontmatter with `title`, `description`, `audience[]`, `topic[]`, `state[]`, `funnelStage`, `lastUpdated`, `author`.
- **Tests:** every new utility/component gets a test. Guide-template components get snapshot tests. SEO audit script gets a smoke test.
- **Accessibility:** WCAG 2.1 AA. Every new component is keyboard-navigable, has focus styles, passes axe-core in CI.
- **Performance budget:** no PR can regress homepage LCP > 100ms or guide-page LCP > 50ms vs main. Add a Lighthouse CI gate.
- **Analytics:** every new CTA gets an analytics event. Naming convention: `{surface}_{element}_{action}` e.g. `homepage_best_deal_card_click`, `guide_match_cta_submit`.
- **Disclosures:** every Best Deal surface and every paid-match CTA renders the required partner-disclosure text. This is a legal/trust requirement, treat it as P0.

---

## 10. Measurement & iteration (Phase 5)

- Wire GA4 (or your existing analytics) to fire structured events on: guide opens, guide scroll depth (25/50/75/100), match-form start, match-form complete, Best Deal impression, Best Deal click, partner handoff.
- Build a `/admin/insights` page (staff-only) showing rolling 30-day numbers per persona, per state, per guide.
- A/B test the homepage hero copy. Two variants: data-led vs learning-led. Run for 2 weeks min.
- A/B test match-form CTA placement inside guides (top, mid, bottom, sticky-bottom).
- Set up Search Console programmatic export so we can track ranking on the target keyword universe weekly.

---

## 11. How to use this brief in Claude Code

1. Save this document as `docs/strategy/build-plan-2026-05.md` in the repo.
2. For each section §5–§7, create a GitHub milestone (`Phase 1: SEO Foundation`, etc.).
3. Break each numbered task into individual issues with the acceptance criteria from this doc as the issue body.
4. Run Claude Code with: *"Read docs/strategy/build-plan-2026-05.md. Then pick up the next open issue in the active milestone. Confirm scope, propose an approach, then implement. Open a PR with the description template from §9."*
5. After each PR merges, update the keyword universe table in §8 with the new ✅.
6. Re-read this doc at the start of every new sprint. The vision in §1 is the tiebreaker for every "should we ship this?" call.

---

## 12. What I'd ship in the first sprint (week 1)

If you only do this much in week 1, you'll be in materially better shape:

1. Technical SEO audit script + fix all critical issues (§5.1).
2. Guide template upgrade with TLDR, TOC, in-content match CTAs, FAQ block, structured data (§5.2).
3. Internal linking system v1 — taxonomy + auto-linker for glossary, suburbs, tools (§5.3).
4. Renovations hub stub at `/renovating` (empty landing page that signals intent to Google + collects emails for "renovation guides coming soon").
5. Three top-priority new guides drafted in the new template: *how to sell a house in australia*, *renovation cost australia 2026*, *how to choose a mortgage broker*.

Then Phase 2 (Best Deals) becomes the focus of week 2–3.

---

*End of brief.*
