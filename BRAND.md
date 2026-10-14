# BRAND.md — Your Property Guide

**Status:** v5 (14 Oct 2026, "something people use"; v4.2 and v4 13–14 Oct). Clean, sharp, human, and interactive. Replaces v3 (cream, Fraunces serif, italic terracotta accents), which read as an AI-template look and positioned the site as a magazine.

**What we are:** a property education service that introduces people to a suitable professional when they ask. Free guides, tools and next-step plans for buying, selling or both; with permission, one participating selling agent or buyer's agent. We are not a portal or a data tool: suburb data supports the guides, it is not the headline.

**Promise:** *Buy or sell property with confidence* (the homepage headline, `PROMISE` in `src/lib/service-model.ts`).

**Line:** *Property, explained by people.*

---

## 1. Principles

1. **Say the job.** The first screen of any page says what we do for the reader and offers the next step.
2. **A person, not a brand voice.** Real names, real faces, a phone number with a person behind it.
3. **One action per screen.** One solid button. Everything else is a link.
4. **Plain and specific.** Numbers with dates and sources. No slogans.
5. **Nothing decorative.** If an element doesn't help someone read or decide, it goes.

## 2. Logo

**The house bubble.** A house drawn as a speech bubble: property, explained by people. It also describes how we work: you get the explanation first, and an introduction only when you ask for one.

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
- Lines, not shadows. A shadow only on something floating: an open menu, the guide funnel card, a book, a tool panel, a printed plan.
- Motion answers the person: a press, a funnel step, a switch thumb sliding, a figure gliding to its new value, a book turning towards the pointer or opening when asked. Nothing moves on its own: no scroll reveals, no entrance choreography, no marquees, no autoplay. Every motion has a `prefers-reduced-motion` fallback.

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

## 8. Conversion (rewritten 14 Oct 2026, "confident moves")

Two paths, never mixed. The organising question for every page: *what should I do next, and who can help me do it well?*

- **Learning path** (guides, plans, calculators, the tips series): useful before any contact details. Calculators and guides need no sign-up; a plan is built from a few questions with no personal data; email delivery is offered after the value. Email only, phone optional (and only for a call from our team). The tips series is its own unticked box. A learning request never reaches an agent.
- **Introduction path** (`/get-help`, the appraisal and agent pages, the suburb appraisal box): says who they'd meet and what that professional charges, shows coverage before anything is sent, asks how to make contact, and takes a separate permission tick for each introduction (buying and selling are separate yeses). The marketing box is separate and unticked. The result screen and email say what really happened (sent, with our team, or not introduced).
- Promises come from `src/lib/service-model.ts` only. Don't write "best agents", "top local agent", fee negotiation, settlement support or "anywhere in Australia" anywhere.
- The fee disclosure (`FEE_DISCLOSURE`) sits beside every introduction form, with a link to how we're paid.
- Phones: the bottom bar carries a plan for the page's move and the matching help; it hides on form pages and while a field has focus.

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
| Promises, fees, partner checks | `src/lib/service-model.ts` |
| Introduction rules and coverage | `src/lib/introductions/rules.ts` |
| Plans | `src/lib/plans/` |
| Journey components (forms, service sections) | `src/components/journeys/` |
| Guide funnels (learning path) | `src/components/journey/SellingGuideFunnel.tsx`, `BuyingGuideFunnel.tsx` |
| The guides as books (contents, covers, colours) | `src/lib/guide-books.ts` |
| Interactive parts (3D book, number tools, live plan, agent finder, switches) | `src/components/interactive/` |
| Homepage | `src/components/homepage/` |


## 11. Premium bands (v4.1, 13 Oct 2026)

Andy, after v4 shipped: "too plain, not premium". v4.1 keeps every v4 rule (one typeface, roof tile for actions, no italics, gradients, pills, letter-spaced labels or ornamental motion) and adds presence. The homepage is the reference; the parts live in `src/components/premium`.

- **Open light, with a crisp photo.** (v5, 14 Oct 2026.) Every page opens with `PhotoHero`: a white band, the heading and actions on the left, and a library photo in a rounded panel on the right, never under an overlay (or the page's form, as `aside`). Pages for a move stand that move's free guide on the photo's corner as a 3D book (`book="selling"`, `"buying"` or both); it links to the guide. Use `size="lg"` on hubs and conversion pages and `size="md"` elsewhere. One hero per page; its photo is decorative (`alt=""`) and preloaded.
- **Pick the photo for the reader.** Selling: `selling`. Buying: `buying` or `firstHome`. Investing: `investing` or `flats`. Renovating: `renovating`. Markets and data: `market` or `street`. Auctions: `auction`. Paperwork, costs and rules: `paperwork`. See `PHOTOS`. Never caption a library photo as a real place, team member, agent or customer.
- **Big, tight headings.** Hero H1 via `HeroTitle` (76px lg, 60px md at desktop). Section H2 via `SectionHeading`: 48px, with the intro in a right-hand column on desktop.
- **Generous bands that alternate.** `Band` with `tone` light, quiet (grey) or dark (charcoal); `py-20 sm:py-28` (or `spacing="compact"` for dense reference pages). Don't stack two dark bands.
- **Editorial grids.** `RuleGrid` and `RuleItem`: a heavy 2px ink rule above each item and an optional line icon in the primary colour. Prefer these to boxed cards for lists of three to four points.
- **Sequences as a timeline.** `StepTimeline` for real steps in order: numbered circles joined by a line.
- **Tone scopes.** Dark surfaces carry `.tone-dark` (globals.css), which flips `text-ink`, `text-ink-muted`, `border-line` and `text-primary` to light values. Write components with those tokens, never `text-gray-*` or `text-white`, and they work on both. A white card on a dark band (a form, the funnel) carries `.tone-light`.
- **Buttons.** `BUTTON_PRIMARY` (roof tile, the one solid button on a screen) and `BUTTON_SECONDARY` (outlined in the current ink).

## 12. Journeys (v4.2, 14 Oct 2026; homepage v5)

- **The homepage opens on the promise, the two guides as books on a photo, and one switch** (I'm selling, I'm buying, Both). The switch swaps the photo, brings that move's guide forward and sets the two next steps: the free guide (roof tile) and an agent (outlined). Every band below follows the same switch.
- **Forms** use `src/components/journeys/fields.tsx`: visible labels, native radios styled as cards (`ChoiceGroup`, arrow keys work), errors tied to fields, consent boxes with the full statement as the label, one in-flight request at a time.
- **Next steps** after priority guides and calculators come from `src/lib/next-steps.ts` via `NextStepCard`: one learning action first, personal help as a quiet optional line.
- **Measurement** goes through `src/lib/analytics.ts` (an allow-list; nothing personal). Outcomes after a request are database events, recorded at `/dashboard/admin/leads`.

## 13. Things people use (v5, 14 Oct 2026)

Andy, after the Concierge pass: "make this something people want to use and interact with". So the site leads with things to do, not things to read. The parts live in `src/components/interactive`; each works on its own and, inside `MoveProvider`, follows the homepage switch.

- **Answers before reading.** A page for a move opens its first band with `NumbersPanel`: cost to sell, stamp duty, borrowing. Sliders and chips, the answer in a charcoal panel beside them, a big figure that glides to its new value, then one honest next step (roof tile) and the full calculator. The arithmetic is the full calculators' own (`selling-costs-calc`, `stamp-duty`, `borrowing-power`), so the figures never disagree. Nothing typed leaves the page.
- **The plan writes itself.** `PlanBuilderLive`: three taps (where, when, where you're up to) and the next three steps rewrite on a printed-plan card; "Open my full plan" lands on `/plan/result` with the same answers.
- **The guides are objects.** `Book3D` draws a guide in CSS 3D (cover, spine, page edges). It turns a little towards the pointer and opens to its contents on "Look inside". `GuideShelf` (homepage) and `GuideContents` (the guide pages: point at a chapter and the book opens to it) use it. The contents come from `src/lib/guide-books.ts`.
- **The way to an agent is one field.** `AgentFinder`: kind of agent, suburb, Continue, landing on `/get-help` with both filled in. Beside it, `AgentChecks` opens each partner check to say how we check it. Nothing is sent until the introduction form, with its permission box.
- **Reading shows progress.** Articles carry `ReadingProgress`, a 3px charcoal line along the top that fills with the article.
- **Switches.** `Segmented` (a sliding charcoal thumb, a radiogroup underneath, arrow keys work) for two to four choices; `Chips` for a question's answers. Selected is charcoal; roof tile stays for actions.

*End of BRAND.md v5.*
