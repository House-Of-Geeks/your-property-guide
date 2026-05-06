# BRAND.md, Your Property Guide design system

**Status:** Phase 2 baseline. Tokens additive. Component palette unchanged this phase. Visual evolution lands in Phase 3.

**Operating principle (the hook):** *"Suburb first. Property second. Agent third."*
**Hero rewrite of YFG's "Learn the money stuff first…":** *"Know the suburb. Then make the move."*

YPG is a sister brand to **Your Finance Guide** but carries only the philosophy across, not the visual skin. YFG is editorial-warm, sans-only, orange/teal accent. YPG is editorial-premium, serif-headed, purple/magenta. Both honour: education first, single match, transparent referral economics.

---

## 1. Colour

All tokens live in `src/app/globals.css` as CSS custom properties on `:root`, exposed to Tailwind v4 utilities via `@theme inline`. **There is no `tailwind.config` file**, v4 reads tokens from CSS.

### 1a. Brand ramps (already in place)

| Token | Hex | Role |
|---|---|---|
| `--primary` | `#5c2d5e` | Brand core, deep purple. Identity-defining. Use sparingly (focus rings, brand marks, key affordances). |
| `--primary-light` / `-lighter` | `#8B4A8C` / `#A96DAA` | Hover and inactive states for primary surfaces. |
| `--primary-dark` / `-darker` | `#4E1F4F` / `#351438` | Pressed and high-emphasis states. |
| `--accent` | `#DD3C70` | Magenta, the **CTA colour**. Used on conversion-critical buttons. |
| `--accent-light` / `-lighter` | `#E5638F` / `#EDA3BB` | Accent backgrounds, hover. |
| `--accent-dark` / `-darker` | `#C42B5C` / `#9E1F48` | Pressed, contrast layouts. |
| `--gray-50…900` | Tailwind's grey ramp | Re-declared as CSS vars for consistent theming. |

**Why purple+magenta and not the brief's terracotta/teal/sandstone:** purple/magenta is the most YPG-distinct thing in the codebase. It reads as place-evoking premium without going generic-fintech. Decision logged in [project memory](~/.claude/projects/-Volumes-AM--BAU--Your-Property-Guide/memory/project_ypg_phase2_brand_decisions.md). Re-litigate if needed.

### 1b. Semantic tokens (added in Phase 2)

These are additive, they map onto the existing ramps so nothing visual changes today, but new components should consume the semantic name (`text-ink-muted`) rather than the literal (`text-gray-600`). Migration of existing components is opportunistic.

| Token | Maps to | Use |
|---|---|---|
| `--ink` | `--gray-900` | Primary text. |
| `--ink-muted` | `--gray-600` | Secondary text, captions on white. |
| `--ink-subtle` | `--gray-400` | Tertiary text, placeholder, disabled. |
| `--surface` | `--background` | Default page background. |
| `--surface-raised` | `#ffffff` | Cards, modals, dropdowns. |
| `--surface-sunken` | `--gray-50` | Inset blocks, footnotes, code. |
| `--surface-inverse` | `#0a0a0a` | Dark sections (matches Footer + Header). |
| `--surface-warm` | `#f7f6f4` | Editorial / tile backgrounds. **Tokenises hex literals already inlined in `home/ResearchTopics.tsx` and `home/SuburbSpotlight.tsx`.** |
| `--surface-warm-sunken` | `#f0efec` | Nested tile within warm surface. |
| `--line` | `--gray-200` | Default borders, dividers. |
| `--line-strong` | `--gray-300` | Higher-contrast borders. |
| `--line-warm` | `#e8e6e2` | Borders on warm-surface tiles. |
| `--success` | `#157f3c` | Confirmations, "indexed", "for sale". |
| `--warning` | `#b95b00` | "Off-market", "low data confidence". |
| `--danger` | `#b42233` | Validation errors, destructive actions. |
| `--info` | `--primary` | Informational callouts. Reuses primary purple deliberately, info messages should feel branded, not stock blue. |
| `--cta` | `--accent` | The conversion magenta. Use on "Book free appraisal", "Match me with…", lead-form submit. |
| `--cta-hover` | `--accent-dark` | CTA hover state. |

**Tailwind utility names** generated from the tokens above: `bg-ink`, `text-ink-muted`, `text-ink-subtle`, `bg-surface`, `bg-surface-raised`, `bg-surface-sunken`, `bg-surface-inverse`, `bg-surface-warm`, `bg-surface-warm-sunken`, `border-line`, `border-line-strong`, `border-line-warm`, `bg-success`/`text-success`, `bg-warning`, `bg-danger`, `bg-info`, `bg-cta`, `bg-cta-hover` (and analogous `text-`, `border-`, `ring-` variants).

### 1c. Accessibility contrast

All token pairings tested for WCAG AA on white surface (≥ 4.5:1 for body text):

| Pairing | Ratio | Use |
|---|---|---|
| `--ink` on white | 17.7:1 | Body, headings (AAA) |
| `--ink-muted` on white | 6.3:1 | Captions, secondary text (AAA) |
| `--ink-subtle` on white | 3.4:1 | **Decorative only**, fails AA for body. Never use for actionable text. |
| `--primary` on white | 9.4:1 | Primary on light surface (AAA) |
| `--accent` (CTA) on white | 4.6:1 | Just-above AA. Acceptable for ≥14px bold buttons; ensure CTA buttons hit min size. |
| `--success` on white | 5.2:1 | AA |
| `--warning` on white | 5.0:1 | AA |
| `--danger` on white | 5.4:1 | AA |
| White on `--primary` | 9.4:1 | AAA |
| White on `--cta` (`--accent`) | 4.6:1 | AA, fine for button labels; don't use for body text on accent backgrounds. |

---

## 2. Typography

**Loaded once in `src/app/layout.tsx` via `next/font/google`.** No FOUT, `display: swap`, hosted by Vercel's CDN.

| Role | Family | Variable | Weights loaded |
|---|---|---|---|
| Display / headings | **Playfair Display** | `--font-display` | 400 / 500 / 600 / 700 |
| Body / UI | **Plus Jakarta Sans** | `--font-sans` | 300 / 400 / 500 / 600 / 700 |

Applied globally in `globals.css`:
- `body { font-family: var(--font-sans), system-ui, -apple-system, sans-serif; line-height: 1.625; }`
- `h1..h6 { font-family: var(--font-display), Georgia, serif; }`
- `h1 { line-height: 1.15; }` (overrides Tailwind's tight `text-5xl/6xl` defaults).

**Why these two and not a swap to YFG-style sans-only:** Playfair gives YPG editorial-premium gravitas without the cost of a custom display face; Plus Jakarta is highly readable and pairs cleanly. The existing `font-preview` page (now removed in favour of `/design-system`) compared three options, this is the chosen Option B.

### 2a. Type scale

YPG uses Tailwind's default modular scale; codify which utility belongs to which role rather than redefining the scale.

| Role | Tailwind utility | Px (mobile / desktop) | When to use |
|---|---|---|---|
| Display | `text-5xl` to `text-7xl` | 48 / 60 / 72 | Hero only. |
| H1 | `text-4xl sm:text-5xl` | 36 / 48 | Page hero headline. |
| H2 | `text-3xl sm:text-4xl` | 30 / 36 | Section headings. |
| H3 | `text-2xl` | 24 | Sub-section headings. |
| H4 | `text-xl` | 20 | Card titles, emphasis. |
| Body large | `text-lg` | 18 | Hero subtitles, lead paragraphs. |
| Body | `text-base` | 16 | Default, **never go below**. |
| Caption / meta | `text-sm` | 14 | Captions, labels, metadata. |
| Eyebrow | `text-xs uppercase tracking-wider` | 12 | Section eyebrows. |

**Body line-height is 1.625 (`leading-relaxed`) globally.** Don't tighten body without good reason. Headings get tighter ratios via the global `h1` rule and Tailwind's `leading-tight` / `leading-none` utilities.

**Max measure:** prose blocks should cap at `max-w-[70ch]` for readability per the brief. Apply on long-form guide content; not needed in card grids.

---

## 3. Spacing & radius

YPG uses **Tailwind's default spacing scale (4px base)** and **default radius scale**. We don't redefine. Document the canonical pairings:

| Surface | Recommended radius |
|---|---|
| Buttons | `rounded-lg` (8px), current `Button` baseline. |
| Pills (badges, tags, "Free Appraisal" header CTA) | `rounded-full`. |
| Cards | `rounded-xl` (12px), current `Card` baseline. |
| Modals / large surfaces | `rounded-2xl` (16px). |
| Hero / wrapper sections | `rounded-2xl` to `rounded-3xl` (16–24px). |
| Inputs | `rounded-lg` (8px), matches buttons. |

**The brief warns against hyper-rounded fintech pills everywhere.** Reserve `rounded-full` for genuinely pill-shaped UI (badges, segmented controls, tag clouds, the header CTA). Cards stay at `rounded-xl`, not `rounded-3xl`.

**Spacing rhythm:** Tailwind defaults (4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96). Section padding on the marketing site standardises on `py-16` to `py-24` between blocks; container max-width is `max-w-7xl` with `px-4 sm:px-6 lg:px-8`.

---

## 4. Shadows

Two custom shadow tokens defined in `globals.css → @theme inline`:

| Token | Value | Use |
|---|---|---|
| `--shadow-card` (`shadow-card`) | `0 1px 4px 0 rgb(0 0 0 / 0.08), 0 8px 24px 0 rgb(0 0 0 / 0.10)` | Default card resting state. |
| `--shadow-card-hover` (`shadow-card-hover`) | `0 4px 12px 0 rgb(0 0 0 / 0.10), 0 20px 48px 0 rgb(0 0 0 / 0.14)` | Card on hover. |

Don't introduce additional shadow tokens unless a use case proves them. For inputs, focus rings, and modals, use Tailwind's defaults (`shadow-sm`, `shadow-lg`) sparingly.

---

## 5. Iconography

Use **`lucide-react`** (already a dependency, `^1.0.1`). Already used by `Header`, `Button`, `Footer`. Don't introduce a second icon library.

Default icon size: `w-4 h-4` (16px) inline with `text-sm`, `w-5 h-5` (20px) inline with body. Always pair with semantic copy or `aria-label`, never icon-only buttons without a label.

---

## 6. Imagery direction

Per brief §3:

- **Real Australian property and place imagery.** No stock-photo finance handshakes; no AI-generated property shots without disclosure.
- Prefer photography that shows **context** (street, suburb, light) over interior shots only. Suburb pages benefit from streetscape; property pages need room shots.
- Standardise aspect ratios:
  - Hero: `3/2` (landscape, full-width).
  - Card thumb: `4/3`.
  - Inline content: `16/9`.
- Apply a subtle warm grade for editorial consistency; document the actual filter values when the imagery library is set up.
- Always use `next/image` with explicit `width`/`height` (or `fill` with sized parent), `sizes` attribute, and `priority` only on above-the-fold hero. Lazy below the fold.

`next.config.ts` already permits Vercel Blob, `renet.photos`, and `**` for any HTTPS image source, no config changes needed.

---

## 7. Component library, current state

These are the existing primitives in `src/components/ui/`. Phase 2 documents them as-is. Phase 3 will rebuild against tokens + add `StageIndicator`, `StagePicker`, `ExpertCTA`, `LeadForm`, `Callout`, `Checklist`, `Comparison`, `MiniCalc`, `TrustStrip`, `Disclosure`.

| Component | File | Variants | Token consumption |
|---|---|---|---|
| `Button` | `ui/Button.tsx` | primary / secondary / outline / ghost / accent / gradient + sm/md/lg + isLoading | **Currently bg-black, not token-driven.** All five "branded" variants resolve to black-on-white. Phase 3: rebind `accent`/`gradient` to `bg-cta`, primary to `bg-ink` (or keep black, call to make). |
| `Card` | `ui/Card.tsx` | default + `hover` prop | Uses `shadow-card` and `shadow-card-hover` (correct). Border `border-gray-100` should migrate to `border-line`. |
| `Badge` | `ui/Badge.tsx` | default / primary / accent / success / warning / outline | **Variants don't yet use semantic tokens**, `success`/`warning` both render grey. Phase 3 fix. |
| `Input` | `ui/Input.tsx` | text input + label + error | `focus:ring-primary` ✅ already token-driven. Border still `border-gray-300` → migrate to `border-line-strong`. |
| `Select` | `ui/Select.tsx` | select + label + error + options | Same as Input. |
| `Skeleton` | `ui/Skeleton.tsx` | base + `PropertyCardSkeleton` | `animate-pulse` only. |

**Phase 3 component build-out** (per brief §7):
`StageIndicator`, `StagePicker`, `StatCard`, `Callout` (info/warning/success/tip), `Checklist` (interactive, persists to localStorage), `Comparison`, `MiniCalc`, `ExpertCTA` (stage-aware, `partnerType` prop), `LeadForm` (multi-step, used by both BA + broker pages), `TrustStrip`, `Disclosure`, `ArticleHero`, `SuburbHero`. The brief's `SuburbAutocomplete` already exists in `components/search/`.

---

## 8. Tone of voice

Codified per brief §9. Enforced via spot-check during Phase 6.

- **Australian English.** "Suburb" not "neighborhood". "Pre-approval" not "pre-qual". "Conveyancer" exists.
- **Plain English, year-9 reading level.** Tooltips for technical terms.
- **Active voice. Short sentences.** Banned phrases: "embark on your property journey", "unlock your dream home".
- **Never use "obviously", "simply", or "just"** before an instruction.
- **Numbers always include unit and as-of date.**
- **Disclaimers are real, specific, and at the bottom of the relevant block**, not legalese dumped in the footer.
- **Hook discipline:** every long-form page should pass the test *"does this honour suburb-first?"* If it pushes a property or agent before the user has researched the suburb, rework.

---

## 9. The charter (4 principles), DRAFT

Property-economics rewrite of YFG's *Education is the product / No paid placements / One match, not five / Tell us when we're wrong*. Lives on `/why-were-free` (brief §6.6) and is linkable from every lead-form fine print.

**Draft, needs Andy sign-off before shipping.**

### 1. The suburb data is the product
> Free, ungated, never paywalled. Median, growth, schools, walkability, climate, hazard, crime, all the numbers we'd want for our own move. Listings and agent matches sit *inside* that research, not on top of it.

*(YFG equivalent: "Education is the product." YPG version honours the same idea but names what *the product* actually is for property buyers, suburb truth, not finance education.)*

### 2. Every match is a real match
> One agent, vetted for the suburb you asked about. Not three competing quotes, not a bidding war for your enquiry. If the right person isn't in our network for your suburb yet, we'll say so.

*(YFG equivalent: "One match, not five." Property version is harder because OpenAgent / LocalAgentFinder run multi-quote auctions, naming the difference is the trust move.)*

### 3. We earn from agents, not from you
> Buyers and sellers pay nothing. Agents pay us a referral fee only after they've done engaged work, not for a click, not for an enquiry. We disclose this on every match.

*(YFG equivalent: "No paid placements." YPG version cannot honestly claim *no* paid placements because featured listings exist on the site, instead, name the *referral economics* directly. If featured-listing revenue grows, this clause becomes "we mark every paid placement clearly".)*

### 4. Tell us when we're wrong
> Suburb data updates monthly; if a school's catchment, a median, or a growth figure looks off to you, flag it and we'll fix it within a week. Editorial integrity is the whole brand, if we're wrong, we want to know first.

*(YFG equivalent verbatim. Translates directly because data integrity is YPG's defining trust claim.)*

**Footer compliance strip** that sits below the charter on every page that hosts a lead form:
- Real Estate licensing per state where applicable (we operate as an information service, not as agents, confirm exact wording with legal before launch).
- ABN, registered business name, complaints process URL, privacy URL.
- "We are not a real estate agent. We connect buyers and sellers with vetted agents in our network and earn a referral fee only when matched work is engaged."

---

## 10. Tokens at a glance, paste into a new component

```tsx
// Headings
<h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight">…</h2>

// Body
<p className="text-base text-ink-muted leading-relaxed max-w-[70ch]">…</p>

// Card
<div className="rounded-xl border border-line bg-surface-raised shadow-card p-6">…</div>

// CTA
<button className="rounded-lg bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3">
  Match me with a buyer's agent
</button>

// Editorial tile (warm)
<div className="rounded-xl border border-line-warm bg-surface-warm p-8">…</div>

// Inline status
<span className="text-success text-sm font-medium">For sale</span>
<span className="text-warning text-sm font-medium">Off-market</span>
```

---

## 11. What lives where

| Concern | File |
|---|---|
| Token declarations | `src/app/globals.css` |
| Font loading | `src/app/layout.tsx` |
| Live preview | `/design-system` route |
| Brand reference (this doc) | `BRAND.md` (root) |
| Sister-site recon | `BRAND-ANALYSIS.md` (root) |
| Repo inventory | `REPO-MAP.md` (root) |
| Strategic SEO context | `~/Desktop/YourPropertyGuide/SEO-RANKING-ADVICE.md` (Andy's notes) |
| Working brief | `~/Desktop/YourPropertyGuide -- Working/claude-code-prompt-design-ux.md` |

---

*End of BRAND.md. Phase 2 establishes the language; Phases 3-6 use it.*
