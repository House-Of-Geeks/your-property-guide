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

Rules: sentence case everywhere. No italics for emphasis. No full stop at the end of a heading. No uppercase letter-spaced labels. Tabular figures for prices and phone numbers.

## 5. Shape and depth

- Corners: 6px buttons and fields (`rounded-lg`), 8px cards (`rounded-xl`), 10–12px large panels. No pill buttons.
- Lines, not shadows. A shadow only on something floating: an open menu, the guide funnel card, a book cover.
- Motion: only to confirm an action (funnel step change, a press). No scroll reveals, no entrance choreography, no marquees.

## 6. Imagery

- Real photographs of real Australian homes, streets and people. No AI-generated imagery; any generated image that remains is labelled.
- People: real team members who agreed to be shown. Andy's headshot is at `/images/agents/andy-mcmaster.jpg`.
- Brand objects (guide covers, share cards) are typeset, not illustrated: `GuideCover` component, `public/images/guide/*-cover*.{png,jpg}`, `public/og-image.jpg`, `src/lib/og/render.tsx`.
- Open item: replace the generated blog cover series and remaining artwork (night-suburb hero, illustrated Queenslander) with real photography.

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
