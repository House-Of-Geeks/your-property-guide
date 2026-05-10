# BRAND.md — Your Property Guide

**Status:** v3 (2026-05-10). Visually reskinned to align with sister brand Your Finance Guide (YFG). Previous purple/magenta + Playfair direction was reverted because conversion data showed the differentiated visual identity wasn't paying off in leads. YPG now adopts YFG's warm-cream + terracotta editorial system, plus YFG's progressive lead-form pattern.

**Operating principle:** *"Suburb first. Property second. Agent third."*
**Hero line:** *"Free property research, written for normal people."*

---

## 1. Colour

All tokens live in `src/app/globals.css` as CSS custom properties on `:root`, exposed to Tailwind v4 utilities via `@theme inline`. **There is no `tailwind.config` file** — v4 reads tokens from CSS.

### 1a. Brand ramps

| Token | Value | Role |
|---|---|---|
| `--background` | `oklch(0.975 0.012 80)` | Warm off-white page surface |
| `--foreground` | `oklch(0.18 0.015 60)` | Warm near-black ink |
| `--primary` | `oklch(0.46 0.14 40)` | Terracotta deep — editorial italic accent, focus rings |
| `--primary-light` | `oklch(0.58 0.14 42)` | Terracotta mid |
| `--primary-lighter` | `oklch(0.74 0.10 45)` | Terracotta soft |
| `--primary-dark` / `darker` | `oklch(0.42 / 0.36 0.13 38–40)` | Pressed states |
| `--accent` / `--cta` | `oklch(0.58 0.14 42)` | Terracotta — CTA buttons |
| `--accent-dark` / `--cta-hover` | `oklch(0.46 0.14 40)` | CTA hover/pressed |
| `--gray-50…900` | Warmed neutral ramp | Greyscale, slightly warm-tinted to harmonise |

### 1b. Semantic tokens

| Token | Maps to | Use |
|---|---|---|
| `--ink` | `--gray-900` | Primary text |
| `--ink-muted` | `--gray-600` | Secondary text, captions |
| `--ink-subtle` | `--gray-400` | Tertiary text, placeholder |
| `--surface` | `--background` | Default page background |
| `--surface-raised` | `oklch(0.99 0.006 80)` | Cards, modals (paper-white) |
| `--surface-sunken` | `--gray-50` | Inset blocks, footnotes |
| `--surface-inverse` | `oklch(0.18 0.015 60)` | Dark ink sections (Footer, MatchAgent) |
| `--surface-warm` | `oklch(0.95 0.018 75)` | Editorial tile backgrounds |
| `--surface-warm-sunken` | `oklch(0.92 0.022 75)` | Nested tile within warm surface |
| `--line` | `oklch(0.86 0.018 70)` | Default borders |
| `--line-strong` | `oklch(0.78 0.020 70)` | Higher-contrast borders, input borders |
| `--line-warm` | `oklch(0.91 0.015 75)` | Borders on warm-surface tiles |
| `--success` | `#157f3c` | "For sale", "indexed" |
| `--warning` | `#b95b00` | "Off-market", "low data confidence" |
| `--danger` | `#b42233` | Validation errors |
| `--cta` | `--accent` | Conversion buttons — terracotta |

**Tailwind utility names** generated from these: `bg-ink`, `text-ink-muted`, `text-ink-subtle`, `bg-surface`, `bg-surface-raised`, `bg-surface-sunken`, `bg-surface-inverse`, `bg-surface-warm`, `bg-surface-warm-sunken`, `border-line`, `border-line-strong`, `border-line-warm`, `bg-success`/`text-success`, `bg-warning`, `bg-danger`, `bg-cta`, `bg-cta-hover` (and analogous `text-`, `border-`, `ring-` variants).

### 1c. Sister-brand alignment

YPG and YFG now share the same palette source: warm off-white background, warm near-black ink, muted terracotta accent. This was a deliberate revert from the purple/magenta direction (logged 2026-05-10). The shared palette signals the network relationship and lets editorial assets be ported between sites.

What still distinguishes YPG from YFG: **content** (suburb data, property research) and **conversion offer** (one match with a vetted local agent vs. one match with a vetted broker). The visual is intentionally aligned.

---

## 2. Typography

**Loaded once in `src/app/layout.tsx` via `next/font/google`.**

| Role | Family | Variable | Weights / styles |
|---|---|---|---|
| Display / headings | **Fraunces** | `--font-display` | 300 / 400 / 500 / 600 + italic |
| Body / UI | **Manrope** | `--font-sans` | 300 / 400 / 500 / 600 / 700 |

Applied globally in `globals.css`:
- `body { font-family: var(--font-sans), system-ui, sans-serif; line-height: 1.625; }`
- `h1..h6 { font-family: var(--font-display), Georgia, serif; }`
- `h1 { line-height: 1.15; }` (overrides Tailwind's tight `text-5xl/6xl` defaults)

**Why Fraunces + Manrope:** matches YFG. Fraunces is a variable serif with light italic that gives the YFG-style "italic emphasis" treatment in headlines (`<span className="italic font-light text-primary">…</span>` in hero copy). Manrope reads cleanly at 14–18px and pairs well at body weight.

### 2a. Type scale

| Role | Tailwind utility | Px | When |
|---|---|---|---|
| Display | `text-5xl` to `text-7xl` | 48 / 60 / 72 | Hero only |
| H1 | `text-4xl sm:text-5xl` | 36 / 48 | Page hero headline |
| H2 | `text-3xl sm:text-4xl` | 30 / 36 | Section headings |
| H3 | `text-2xl` | 24 | Sub-section headings |
| H4 | `text-xl` | 20 | Card titles |
| Body large | `text-lg` | 18 | Hero subtitle, lead paragraphs |
| Body | `text-base` | 16 | Default — never go below |
| Caption / meta | `text-sm` | 14 | Captions, labels |
| Eyebrow | `text-xs uppercase tracking-[0.18em]` | 12 | Section eyebrows, "When you're ready" labels |

**Italic emphasis.** YFG signature: serif italic at light weight (300) used inside headlines for one or two emphasised words, in `--primary` (terracotta deep). Example: `Tell us your situation. <span className="italic font-light text-cta">We'll find</span> the right person.` Use sparingly — once per headline at most.

**Max measure:** prose blocks cap at `max-w-[70ch]`.

---

## 3. Spacing & radius

Tailwind defaults (4px base, default radius scale).

| Surface | Recommended radius |
|---|---|
| Buttons | `rounded-lg` (8px) — standard | `rounded-full` for pill CTAs and header "Get matched" |
| Pills (badges, tags) | `rounded-full` |
| Cards | `rounded-xl` (12px) |
| Modals / large surfaces | `rounded-2xl` (16px) |
| Hero / wrapper sections | `rounded-2xl` to `rounded-3xl` |
| Inputs | `rounded-lg` (8px) |

Section padding standardises on `py-16` to `py-24`. Container max-width is `max-w-7xl` with `px-4 sm:px-6 lg:px-8`.

---

## 4. Shadows

| Token | Value | Use |
|---|---|---|
| `shadow-card` | `0 1px 4px / 0 8px 24px` | Card resting |
| `shadow-card-hover` | `0 4px 12px / 0 20px 48px` | Card hover |
| `shadow-2xl` (Tailwind default) | — | MatchAgent form panel only |

---

## 5. Iconography

**`lucide-react`** (already a dependency). Default `w-4 h-4` inline with `text-sm`, `w-5 h-5` inline with body. Always pair with semantic copy or `aria-label`.

---

## 6. Imagery direction

- Real Australian property and place imagery. No stock-photo finance handshakes; no AI-generated property shots without disclosure.
- Prefer streetscape and context over interior-only.
- Aspect ratios: hero `3/2`, card thumb `4/3`, inline `16/9`.
- `next/image` always with explicit `width`/`height` (or `fill` with sized parent), `sizes`, `priority` only above-the-fold.

---

## 7. Logo

**Wordmark only, no separate mark.** Rendered as live HTML in [`Header.tsx`](src/components/layout/Header.tsx) and [`Footer.tsx`](src/components/layout/Footer.tsx):

```tsx
<span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-accent" aria-hidden />
<span className="font-display text-ink text-xl tracking-tight leading-none">
  Your Property Guide
</span>
```

The 8px terracotta dot before the wordmark is the brand's only "mark" — it visually echoes the YFG `★` rating dot and the terracotta accent across the design. Footer uses `text-2xl` and white type; header uses `text-xl` and ink.

The PNG logo at `/public/images/Your-Property-Guide.png` is no longer in use and can be retired.

---

## 8. Conversion flow

**The homepage is built around one lead engine: `MatchAgent`** ([`src/components/journey/MatchAgent.tsx`](src/components/journey/MatchAgent.tsx)). It mirrors YFG's `Match` pattern (3 single-question screens → compact contact form) for property:

1. **Intent:** Buying / Selling / Investing / Just researching
2. **Suburb:** SuburbAutocomplete, with "skip — not sure yet" escape
3. **Timeframe:** Just looking / Within 3 months / Right now
4. **Contact:** First name, last name, email, mobile

The section sits anchored at `#match` on the homepage, between "Latest guides" and "Why we're free." Hero CTAs and the header "Get matched" pill all anchor here. POSTs to `/api/leads` with `type: "match-request"`.

**Why this pattern works:** by step 4 the user has already invested 3 clicks of commitment; the form feels like the *finish* of a process, not the start. This is the YFG-proven structure.

---

## 9. Tone of voice

- **Australian English.** "Suburb" not "neighborhood". "Pre-approval" not "pre-qual".
- **Plain English, year-9 reading level.** Tooltips for technical terms.
- **Active voice. Short sentences.** Banned: "embark on your property journey", "unlock your dream home".
- **Never use "obviously", "simply", or "just"** before an instruction.
- **Numbers always include unit and as-of date.**
- **Disclaimers are real, specific, and at the bottom of the relevant block.**
- **Hook discipline:** every long-form page passes the test *"does this honour suburb-first?"*

---

## 10. The charter (4 principles)

Lives on `/about` and is linkable from every lead-form fine print.

### 1. The suburb data is the product
> Free, ungated, never paywalled. Median, growth, schools, walkability, climate, hazard, crime — all the numbers we'd want for our own move. Listings and agent matches sit *inside* that research, not on top of it.

### 2. Every match is a real match
> One agent, vetted for the suburb you asked about. Not three competing quotes, not a bidding war for your enquiry. If the right person isn't in our network for your suburb yet, we'll say so.

### 3. We earn from agents, not from you
> Buyers and sellers pay nothing. Agents pay us a referral fee only after they've done engaged work — not for a click, not for an enquiry. We disclose this on every match.

### 4. Tell us when we're wrong
> Suburb data updates monthly; if a school's catchment, a median, or a growth figure looks off to you, flag it and we'll fix it within a week.

---

## 11. Tokens at a glance, paste into a new component

```tsx
// Headings — Fraunces, with optional italic emphasis
<h2 className="font-display text-3xl sm:text-4xl text-ink leading-tight tracking-tight">
  Tell us your situation. <span className="italic font-light text-cta">We'll find</span> the right person.
</h2>

// Body — Manrope
<p className="text-base text-ink-muted leading-relaxed max-w-[70ch]">…</p>

// Card
<div className="rounded-xl border border-line bg-surface-raised shadow-card p-6">…</div>

// CTA — terracotta pill
<button className="rounded-full bg-cta hover:bg-cta-hover text-white font-medium px-6 py-3">
  Get matched with a local agent
</button>

// Editorial tile (warm cream)
<div className="rounded-xl border border-line-warm bg-surface-warm p-8">…</div>

// Eyebrow
<p className="text-xs uppercase tracking-[0.18em] text-cta">When you're ready</p>

// Inline status
<span className="text-success text-sm font-medium">For sale</span>
<span className="text-warning text-sm font-medium">Off-market</span>
```

---

## 12. What lives where

| Concern | File |
|---|---|
| Token declarations | [`src/app/globals.css`](src/app/globals.css) |
| Font loading | [`src/app/layout.tsx`](src/app/layout.tsx) |
| Live preview | `/design-system` route |
| Lead engine | [`src/components/journey/MatchAgent.tsx`](src/components/journey/MatchAgent.tsx) |
| Brand reference (this doc) | `BRAND.md` (root) |
| Sister-site recon | `BRAND-ANALYSIS.md` (root) |

---

*End of BRAND.md v3.*
