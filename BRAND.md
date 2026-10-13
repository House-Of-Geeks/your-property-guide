# BRAND.md — Your Property Guide

**Status:** v4 (13 Oct 2026). Clean, sharp, human. Replaces v3 (cream, Fraunces serif, italic terracotta accents), which read as an AI-template look and positioned the site as a magazine.

**What we are:** a guide and an introduction service. Free guides that help Australians sell and buy property, and, when a seller asks, one trusted local agent for a free appraisal. We are not a data tool: suburb data supports the guides, it is not the headline.

**Line:** *Property, explained by people.*

---

## 1. Principles

1. **Say the job.** The first screen of any page says what we do for the reader and offers the next step.
2. **A person, not a brand voice.** Real names, real faces, a phone number with a person behind it.
3. **One action per screen.** One solid button. Everything else is a link.
4. **Plain and specific.** Numbers with dates and sources. No slogans.
5. **Nothing decorative.** If an element doesn't help someone read or decide, it goes.

## 2. Logo

**The house bubble.** A house drawn as a speech bubble: property, explained by people. It also describes how we work (a person talks to you before any agent does).

- Component: `src/components/brand/Logo.tsx` exports `Logo` (mark + wordmark) and `LogoMark`. The path lives in `LOGO_MARK_PATH` and is shared by the favicon, OG cards and email.
- Mark colour: roof tile `#C24A1C` on white or charcoal. White on roof tile for app tiles.
- Wordmark: "Your Property Guide", Schibsted Grotesk Bold, tracking −0.025em, title case. Live text, never an image, on the site.
- Clear space: the mark's width on all sides. Minimum size: 16px mark.
- Files: `src/app/icon.svg`, `src/app/favicon.ico`, `src/app/apple-icon.png`, `public/images/brand/` (mark.svg, mark-96.png for email, tile PNGs).
- Don't: outline it, add a window or door, rotate it, put it on a photo without a solid backing, or recolour it outside the palette.

## 3. Colour

Tokens live in `src/app/globals.css` (Tailwind v4 reads them via `@theme inline`; there is no tailwind.config). Token names are unchanged from v3 so components keep working.

| Name | Hex | Token | Use |
|---|---|---|---|
| Paper | `#FFFFFF` | `--background`, `--surface`, `--surface-raised` | Page and cards |
| Mist | `#F3F4F5` | `--surface-warm` | Alternate bands, quiet tiles |
| Ink | `#16191D` | `--ink`, `--surface-inverse` | Text, dark bands, footer |
| Slate | `#565E68` | `--ink-muted` | Secondary text |
| Line | `#DFE2E6` | `--line` | Rules and borders |
| Roof tile | `#C24A1C` | `--cta`, `--accent` | Buttons and the logo mark only |
| Roof tile deep | `#A8401A` | `--primary`, `--cta-hover` | Text-weight accents, focus rings, hover |

Rules:
- Roof tile is for actions. Never for decoration, headings or large backgrounds (exception: the selling guide cover).
- White text on roof tile passes AA (4.9:1). Don't put roof-tile text on charcoal.
- Semantic colours (`--success`, `--warning`, `--danger`) are for state, not brand.

## 4. Type

**One family: Schibsted Grotesk** (Google Fonts, loaded once in `src/app/layout.tsx` as `--font-sans`; `--font-display` points at the same face).

| Role | Size | Weight |
|---|---|---|
| Hero H1 | 40–64px | 700, tracking −0.035em |
| H2 | 30–36px | 700, tracking −0.02em |
| H3 | 20–24px | 700 |
| Body | 16–18px | 400, line-height 1.6 |
| Small / meta | 14px | 400–600 |

Rules: sentence case everywhere. No italics for emphasis. No full stop at the end of a heading. No uppercase letter-spaced labels. Never `tabular-nums`: Schibsted Grotesk sets its commas and full stops tabular too, so $810,000 renders as "$810 ,000". Proportional figures everywhere.

## 5. Shape and depth

- Corners: 6px buttons and fields (`rounded-lg`), 8px cards (`rounded-xl`), 10–12px large panels. No pill buttons.
- Lines, not shadows. A shadow only on something floating: an open menu, the guide funnel card, a book cover.
- Motion: only to confirm an action (funnel step change, a press). No scroll reveals, no entrance choreography, no marquees.

## 6. Imagery

- Photography is generated with ImagineArt (Nano Banana Pro) to a strict brief, and must look like ordinary documentary photography of real Australian places: soft natural daylight, true colours, eye level. No golden hour, lens flare, HDR, cinematic grading or illustration.
- Every prompt anchors Australian vernacular: Queenslanders on stumps, Federation brick, brick veneer with Colorbond roofs, corrugated iron, jacaranda, gum trees, frangipani, nature strips, timber power poles, bluestone kerbs (Melbourne), utes. Sale boards are blank and on two posts. No text, logos or readable signs.
- People are generic and seen naturally (side-on, from behind, at a distance). Never present a generated person as our team, a real agent or a real customer, and never caption a generated image as a specific real property or street.
- Library: `public/images/photos/` (home-street, selling-house, appraisal-kitchen, open-home, first-home, verandah-couple, townhouses, renovation, brisbane-view, auction, paperwork, flats). JPEG, 1800px wide (2400px for full-bleed), quality 80; `next/image` does the rest.
- Brand objects stay typeset: guide covers (`GuideCover`, `public/images/guide/`), share cards (`public/og-image.jpg`, `src/lib/og/render.tsx`).
- Real people: Andy's own photo (`/images/agents/andy-mcmaster.jpg`) beside forms and bylines.

## 7. Voice

- Write like you'd explain it to a neighbour. Short sentences, active voice, Australian English.
- Specific beats clever: "Agents typically charge 1.8% to 2.5% in NSW" beats "Fee negotiation worth thousands".
- Say each thing once. Don't announce plain English; write it.
- Banned: three-beat slogans, "no X, no Y, no Z" lists, "unlock", "journey", "seamless", "obviously", "simply", "just" before an instruction.
- Promises must be true today. If we don't have an agent in an area, we say so.

## 8. Conversion

- The selling guide funnel (`SellingGuideFunnel`) is the main lead engine: questions first, then first name, email and a **required mobile**, with the reason shown under the field. Agent contact is a separate yes (thanks-page call card), never implied by a download.
- Every page offers one next step that fits why people came: sellers get the guide or an appraisal; buyers get the buying guide.
- Phones: the header shows the guide button at every width; the bottom bar carries the guide, the appraisal and a call button.
- Disclosure sits beside every form: agents pay us for introductions; it costs the seller nothing and doesn't change what they pay the agent.

## 9. Components to reuse

```tsx
// Primary action
<Link href="/selling-guide" className="inline-flex items-center rounded-md bg-cta hover:bg-cta-hover text-white px-5 py-3 font-semibold">
  Get the free guide
</Link>

// Secondary action
<Link href="/appraisal" className="inline-flex items-center rounded-md border border-ink text-ink px-5 py-3 font-semibold hover:bg-ink hover:text-white">
  Free appraisal
</Link>

// Card
<div className="rounded-xl border border-line bg-white p-6">…</div>

// Quiet band
<section className="bg-surface-warm border-y border-line">…</section>
```

## 10. What lives where

| Concern | File |
|---|---|
| Tokens | `src/app/globals.css` |
| Font | `src/app/layout.tsx` |
| Logo | `src/components/brand/Logo.tsx` |
| Guide cover | `src/components/brand/GuideCover.tsx` |
| Header / footer / phone bar | `src/components/layout/` |
| Share cards | `src/lib/og/render.tsx`, `public/og-image.jpg` |
| Email shell | `src/lib/email-theme.ts` |
| Lead engine | `src/components/journey/SellingGuideFunnel.tsx` |

*End of BRAND.md v4.*

## 11. Premium bands (v4.1, 13 Oct 2026)

Andy, after v4 shipped: "too plain, not premium". v4.1 keeps every v4 rule (one typeface, roof tile for actions, no italics, gradients, pills, letter-spaced labels or ornamental motion) and adds presence. The homepage is the reference; the parts live in `src/components/premium`.

- **Open on a photo or on charcoal.** Every page opens with `PhotoHero`: a library photo, full bleed, under a flat 70% charcoal overlay (no gradient), white type. Use `size="lg"` on the homepage and conversion pages and `size="md"` elsewhere. Reference and data pages may drop the photo for a plain charcoal band. One hero per page; its photo is decorative (`alt=""`) and preloaded.
- **Pick the photo for the reader.** Selling: `selling`. Buying: `buying` or `firstHome`. Investing: `investing` or `flats`. Renovating: `renovating`. Markets and data: `market` or `street`. Auctions: `auction`. Paperwork, costs and rules: `paperwork`. See `PHOTOS`. Never caption a library photo as a real place, team member, agent or customer.
- **Big, tight headings.** Hero H1 via `HeroTitle` (76px lg, 60px md at desktop). Section H2 via `SectionHeading`: 48px, with the intro in a right-hand column on desktop.
- **Generous bands that alternate.** `Band` with `tone` light, quiet (grey) or dark (charcoal); `py-20 sm:py-28` (or `spacing="compact"` for dense reference pages). Don't stack two dark bands.
- **Editorial grids.** `RuleGrid` and `RuleItem`: a heavy 2px ink rule above each item and an optional line icon in the primary colour. Prefer these to boxed cards for lists of three to four points.
- **Sequences as a timeline.** `StepTimeline` for real steps in order: numbered circles joined by a line.
- **Tone scopes.** Dark surfaces carry `.tone-dark` (globals.css), which flips `text-ink`, `text-ink-muted`, `border-line` and `text-primary` to light values. Write components with those tokens, never `text-gray-*` or `text-white`, and they work on both. A white card on a dark band (a form, the funnel) carries `.tone-light`.
- **Buttons.** `BUTTON_PRIMARY` (roof tile, the one solid button on a screen) and `BUTTON_SECONDARY` (outlined in the current ink).
