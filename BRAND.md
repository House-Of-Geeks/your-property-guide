# BRAND.md — Your Property Guide

**Status:** v7, "Clear decisions" (20 Oct 2026). Andy's approved replacement for the v6 campaign-led positioning ("It's the campaign that wins", 15 Oct 2026). Where anything older in this repo (comments, tests, copy, earlier BRAND versions) conflicts with this file, this file wins. The original brand photographs are kept in `docs/brand/clear-decisions/`; the approved homepage reference stays with Andy's handoff files (it embeds the images, so it isn't committed).

**Who it's for:** everyday Australian homebuyers and sellers, across budgets.

**What we are:** free guides, useful tools and a next-step plan that help people understand the costs and choices ahead before they buy or sell. When someone wants personal help, and asks, we can introduce a participating selling agent, or a buyer's agent where one is available, one introduction for each service. Agents pay a flat fee per introduction; we take none of their commission; the person pays us nothing.

**Positioning:** Clear decisions.

**The opening:** *Know what **matters** before you buy or sell.* (`PROMISE` in `src/lib/service-model.ts`; "matters" is the one serif-italic copper word.)

**Supporting line:** *Understand the costs and choices ahead, with free guides, useful tools and a next-step plan for where you're up to.*

The experience should feel beautifully designed, knowledgeable, warm and useful.

---

## 1. Principles

1. **Explain what matters.** Every page says what the reader needs to understand or decide, then offers the next step for where they're up to.
2. **Useful before anything is asked.** Guides, tools and plans work with no sign-up. Personal help is offered, never pushed: "Your next step is your choice."
3. **Calm and specific.** Plain Australian English, figures with dates and sources, no hype.
4. **Editorial, not a landing page.** Hierarchy, spacing and fine rules do the work. Contained panels are used selectively.
5. **Nothing decorative without a job.** No decorative icons, no repeated card grids, no excess pills, no motion that isn't answering the reader.

## 2. Logo

**The house bubble** (unchanged): a house drawn as a speech bubble.

- `src/components/brand/Logo.tsx`: `Logo` (mark + wordmark) and `LogoMark`. The geometry is `LOGO_MARK_PATH`, shared by the favicon, icons, social cards, covers and emails. Never redraw it.
- Mark: copper `#A9642C` (`LOGO_TILE`); light copper `#E1AF86` on forest or terracotta.
- Wordmark: "Your Property Guide" in Source Serif 4, regular, tracking −0.02em, forest ink. Live text on the site.
- Browser icon (`src/app/icon.svg`) and raster icons: light copper mark on a forest tile. Regenerate with `node scripts/brand/render-brand-assets.mjs` (add `BASE=` to also render the social cards).

## 3. Colour

Tokens live in `src/app/globals.css`. Token *names* are unchanged from v3–v6 (`--cta`, `--primary`, `--surface-inverse`, `--eucalyptus` …) so every component cascades; their values are v7.

| Name | Hex | Token | Use |
|---|---|---|---|
| Cream | `#F8F6F0` | `--background`, `--cream` | The page |
| Paper | `#FFFDF8` | `--paper`, `--surface-raised`, `--color-white` | Fields, cards, forms (`bg-white` is paper) |
| Sand | `#EDECE2` | `--sand`, `--surface-warm` | Quiet bands, answer panels, the tool surface |
| Forest ink | `#203D30` | `--ink`, `--foreground` | Text |
| Muted | `#566257` | `--ink-muted` | Secondary text (5.9:1 on cream) |
| Rule | `#CDD2C6` | `--line` | Fine rules |
| Forest | `#244A37` | `--forest`, `--cta`, `--surface-inverse` | The one solid button, the dark band, selected states, the buying edition |
| Terracotta | `#89492F` | `--terracotta` | The selling edition |
| Terracotta tint | `#EEE3D4` | `--terracotta-tint` | The Hamilton note, selection |
| Copper | `#A9642C` | `--accent`, `--copper` | The logo mark, rules, large accents |
| Copper text | `#93532A` | `--primary` | Kickers, small copper text (5.4:1 on cream) |
| Light copper | `#E1AF86` | `--copper-light` | Copper on forest |
| Book stages | `#E0E0D2` / `#EADED0` | `--stage-buy` / `--stage-sell` | Behind the two covers |

Rules:
- The solid button is **forest with cream text**; inside a forest band it flips to a cream button with forest text (`.tone-dark` sets `--cta`/`--cta-ink`). Write buttons as `bg-cta text-cta-ink`, never `text-white` on `bg-cta`.
- Copper is restrained: the logo, kickers, rules, the italic accent word and big figures. Never a button fill.
- Selected states (switches, chips) are forest.
- One forest band per page at most; don't stack dark bands.

## 4. Type

Loaded in `src/app/layout.tsx` with `next/font`:

- **Source Serif 4** (`--font-serif`, `--font-display`): h1, h2, the wordmark, cover titles, big figures, pull lines. Regular weight only, tight tracking.
- **Schibsted Grotesk** (`--font-sans`): everything else.

| Role | Size | Notes |
|---|---|---|
| Homepage H1 | 44px phone, 64px desktop | Serif 400, −0.045em, line-height 1.04 |
| Page H1 (`HeroTitle`) | 38–54px | Serif 400, −0.04em |
| Section H2 (`SectionHeading`, `BandTitle`) | 34–42px | Serif 400, −0.04em |
| Card/answer heading | 22–30px | Serif 400, −0.03em |
| H3 (sans) | 16–19px | Grotesk 500–600 |
| Body | 15–18px | Grotesk 400, line-height 1.65–1.75; articles 17px |
| Kicker | 12px | Grotesk 500, uppercase, tracking 0.1em, copper (`Kicker`, `Eyebrow`) |

Rules:
- Sentence case. Headings may end with a full stop when they're a sentence.
- Serif italic: only the one accent word in the homepage opening (and the social card that repeats it). Never bold serif.
- Never `tabular-nums` (Schibsted Grotesk spaces its commas).

## 5. Shape, space and depth

- Corners: 4px buttons and fields (`rounded-lg` is 4px), 6px panels (`rounded-xl`/`2xl`), 8px the largest (`rounded-3xl`). `rounded-full` only for portraits and dots. No pills.
- Fine 1px rules separate sections and list rows; a 1px ink rule opens the planner, the checklist and the founder note.
- Shadows: none on cards (`shadow-card` is a hairline). Only floating things cast one: a menu, a tilted book (`--shadow-book`).
- Spacing is deliberate: sections `py-14 sm:py-20`, the approved section head (kicker in the margin, H2, intro to the right; `SectionHeading kicker=…`).
- Motion answers the reader (a switch, a toggle, a book opening), with `prefers-reduced-motion` fallbacks. Nothing moves on its own.

## 6. Imagery

- **The brand photographs** (`public/images/brand/apartment-light.jpg`, `terracotta-door.jpg`; originals in `docs/brand/clear-decisions/`): warm, architectural, strongly composed. The apartment opens the homepage and is the buying edition's panel; the door is the selling edition's. Keep their warmth and detail when cropping; serve them through `next/image` (or the original JPEG for print).
- They are **illustrative brand imagery**. Never present them as the Hamilton apartment, a documented renovation, a customer's property or a completed sale, and never place them as evidence beside a case study.
- **Hamilton** keeps its rules (`src/lib/case-studies.ts`): Andy's facts only, both prices expected prices, one qualification, no photographs of the apartment. The homepage shows it as a note with the figures behind "Explore the Hamilton example".
- **Andy:** his own portrait (`FOUNDER.photo`), confirmed by the approved design.
- Elsewhere the documentary library (`PHOTOS` in `src/components/premium`) stays: soft daylight, true colours, Australian vernacular. No photo under an overlay.

## 7. The guides as books

A matched collection, one source: `src/components/brand/BookCover.tsx` (sized in container units, `.ypg-cover` in globals.css), data in `src/lib/guide-books.ts`.

| | Buying a home (01) | Selling a home (02) |
|---|---|---|
| Colour | forest `#244A37` | terracotta `#89492F` |
| Subtitle | From your first budget / to the day you get the keys. | Prepare with purpose. / Move with a clearer plan. |
| Photo panel | the apartment | the terracotta door |
| Descriptive title | Buying a home: a practical guide to buying property in Australia | Selling a home: a practical guide to selling property in Australia |

Every cover has the logo and wordmark, the two-line serif title ("Buying / a home."), the two-line subtitle, the photographic panel and the footer ("A clearer way forward." and the edition number), on a spine. The same component renders:

- the homepage shelf and every cover on the site (`BookCover`, `GuideCover`, the 3D book's front);
- the guide landing pages and chapter sidebars;
- the printable guide's A4 cover (`/print/guides/<guide>`), and so the PDFs, the cover JPEG and the email cover (`npm run guides:pdf` with the site running and `BASE` set);
- the guides' social cards (`/print/og?card=<guide>`, rendered by `scripts/brand/render-brand-assets.mjs`).

Chapter slugs are live URLs and never change; visible titles live in `guide-books.ts`. Chapter callouts are "What experienced sellers do" (selling) and "Seeing it from the seller's side" (buying); checklists are "Your checklist".

## 8. Voice and facts

- Plain Australian English. Specific, calm, helpful. Explain; don't sell.
- Replaced on purpose: the $20 million campaign or playbook, beating or decoding the selling side, "not the market" (market conditions do matter; say what the reader can control), and treating decisions as a contest (winning, "every dollar", "the top buyer").
- Negotiation, preparation, costs and agent selection stay, explained constructively: what to check, why it matters, what to ask, who acts for whom.
- "Campaign" is fine as the ordinary word for how an agent markets a listing.
- **Andy's facts come only from `src/lib/founder.ts`**, as supporting background: he started his career selling homes worth $10m–$20m across Australia; after two years he was head-hunted to advise property companies; his advice has generated over $4 billion in property sales in the past five years. The homepage uses the one-line summary and keeps the detail behind "More about Andy's background"; the about page tells it in full. It is never the headline or a promise about the reader's price.
- Never invent testimonials, credentials, review counts, partner coverage, statistics or outcomes. Leave `TODO(andy):` instead.
- Banned: "unlock", "journey", "seamless", "best agents", "top local agent", "just"/"simply" before an instruction, schedule promises for the newsletter.

## 9. Conversion

Two paths, never mixed (unchanged since 14 Oct 2026):

- **Learning:** guides, calculators, the next-step plan. No sign-up, never sent to an agent. The plan is the "next-step plan" everywhere (`src/lib/plans/name.ts`). The header action, the homepage button and the phone bar's first button say **"Find my next step"**; on the homepage the planner's button says "Show my next steps" and shows three starting points on the page (`src/lib/home-start.ts`), then links into the full plan with the move and stage already answered (`planStartHref({ answers })`).
- **Introduction:** `/get-help`, the appraisal and agent pages. One participating agent per service, a separate permission tick for each, coverage shown before anything is sent. In navigation it's "Personal help" / "Ask about an agent", inside the Buying, Selling and About menus, the phone menu and the phone bar.
- The agreement check (`/agreement-check`): a free 15-minute general-information call before someone signs an agency agreement.
- Promises come from `src/lib/service-model.ts` only (`PROMISE`, `ONE_AGENT`, `COMMISSION_STANCE`, `AGREEMENT_CHECK`, `FEE_DISCLOSURE`, `PARTNER_CHECKS`). The fee disclosure sits beside every introduction form.
- Agent profiles stay off the site until Andy lists a partner in `src/lib/partner-agents.ts`.

## 10. The homepage (20 Oct 2026, the approved design)

`src/components/homepage/`, in this order. Picking buying, selling or both in the planner (`MoveProvider publish`, buying by default) re-points the desk, the case note, the introductions band, the header and the phone bar.

1. **Opening:** kicker "Australian property, explained.", the H1 with "matters" in copper italic, the supporting line, "Find my next step" (to the planner) and "Explore the guides"; then the apartment photograph across the page with its caption row.
2. **Start where you are:** buying / selling / both, "Where are you up to?", "Show my next steps", three linked starting points and the full-plan link. "No sign-up. Nothing is sent to an agent."
3. **Good questions. Clearer decisions.:** four questions and an answer panel per move, with what the tools cover and links to them.
4. **The field guides:** the two covers on their stages, a line each, "Look inside" for all ten chapters (linked), and the guide's page.
5. **In practice — Hamilton:** the question for the move, the redesign in two sentences, and the note with the figures and their one qualification.
6. **The person behind the guides:** Andy's portrait, the summary, the aim, his background behind a disclosure, and the about page.
7. **When you want personal help:** the forest band, "Your next step is your choice.", how introductions work for the move, and how we're paid.

## 11. Inner pages

Shared parts in `src/components/premium` pick up v7 through the tokens and their own v7 styles:

- `PhotoHero`: cream, serif heading. `size="lg"` (hubs, conversion pages) puts a wide photograph under the text, with the guide covers standing on its corner (`book=`); `"md"` (guides, tools) puts a portrait photograph beside the text and drops it on phones; `aside=` puts a form beside the text.
- `Band` (light / quiet sand / dark forest), `SectionHeading` (optional `kicker`), `Kicker`, `RuleGrid`/`RuleItem` (no icons), `StepTimeline` (serif copper numbers), `LinkRows` (first reads under fine rules instead of card grids), `PhotoPanel`.
- Buttons: `BUTTON_PRIMARY` (forest), `BUTTON_SECONDARY` (outlined), `TEXT_LINK` (underlined link with an arrow) in `src/components/premium/buttons.ts`.
- Articles: `.prose-ypg` in globals.css, serif H2s, copper list markers and serif numerals; the reading column stays narrow.
- Calculators: `CalculatorPageLayout` puts every tool on a sand surface so fields and results (paper cards) read as one object.
- Chapters: `ChapterPage` / `ChapterContent`, a reading page with the contents and the cover in the sidebar.
- Use `.tone-dark` on forest and `.tone-light` on a paper card inside it; write components with `text-ink`, `text-ink-muted`, `border-line`.

## 12. Emails, social and print

- Emails (`src/lib/email-theme.ts` and the builders in `src/lib/lead-emails.ts`, `src/lib/email-sequence-html.ts` and `src/lib/mail/newsletter.ts`; every email is sent by the app through SendGrid, see `docs/email-system-2026-10-21.md`): cream page, paper card, forest ink, the forest button with 4px corners, serif headings, the mark and wordmark, footer line "Know what matters before you buy or sell." Guide emails use `GUIDE_BOOKS[id].coverEmail`.
- Social: `public/og-image.jpg` (the opening line beside the apartment), the guides' cards in `public/images/guide/<guide>-guide-og.jpg`, and dynamic cards for articles, chapters and suburbs (`src/lib/og/render.tsx`, cream with a serif title and a forest or terracotta rule).
- Print: the guide PDFs are printed from `/print/guides/<guide>`; the spring countdown from `scripts/guide-pdf/spring-selling-checklist.html`.

## 13. What lives where

| Concern | File |
|---|---|
| Tokens, prose, covers | `src/app/globals.css` |
| Fonts | `src/app/layout.tsx` |
| Logo | `src/components/brand/Logo.tsx` |
| Covers | `src/components/brand/BookCover.tsx`, `src/lib/guide-books.ts` |
| Header, footer, phone bar | `src/components/layout/` |
| Homepage | `src/components/homepage/`, `src/lib/home-start.ts` |
| Promise, fees, checks | `src/lib/service-model.ts` |
| Andy's facts | `src/lib/founder.ts` |
| Guide chapters (web and PDF) | `src/content/guides/`, `src/components/guide-book/` |
| Plans | `src/lib/plans/` |
| Inner-page parts and buttons | `src/components/premium/` |
| Social cards | `src/app/(print)/print/og/page.tsx`, `src/lib/og/` |

*End of BRAND.md v7 ("Clear decisions", 20 Oct 2026).*
