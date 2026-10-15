# BRAND.md — Your Property Guide

**Status:** v6 (15 Oct 2026, "It's the campaign that wins"). Andy's founder story and the campaign idea, in a premium editorial look: cream and sand pages, eucalyptus dark bands, copper for actions and accents, a serif for the big headings. It replaces v5 (one grotesk, white page, roof tile) on purpose. **v6 brings back things v4–v5 banned — a serif, an italic accent, uppercase eyebrows, a gradient over a photo, pill buttons, numbered steps — and only where §14 allows them. Don't "fix" them back to v5.** Earlier versions: v5 and v4 (13–14 Oct), v3 (cream, Fraunces, terracotta).

**What we are:** a property education service built on one idea: the campaign is what wins, not the market, not luck, not a slack agent. Free guides, tools and next-step plans for selling, buying or both, then, with permission, one participating agent for each job (a selling agent, and a buyer's agent where one takes part). Agents pay a flat fee per introduction; we take none of their commission. We are not a portal or a data tool: suburb data supports the guides, it is not the headline.

**Core line:** *It's the campaign that wins. Not the market.* (`PROMISE` in `src/lib/service-model.ts`)

**Closing line:** *Every home deserves a $20 million campaign.*

---

## 1. Principles

1. **Say the job.** The first screen of any page says what we do for the reader and offers the next step.
2. **A person, not a brand voice.** Andy's real story, real name and real face. A phone number with a person behind it.
3. **One action per screen.** One solid button. Everything else is a link or an outlined button.
4. **Plain and specific.** Numbers with dates and sources. The only headline figures are in §7.
5. **Nothing decorative without a job.** An eyebrow labels a band, numbers mark a real sequence, the italic marks the one phrase that carries the idea.

## 2. Logo

**The house bubble.** A house drawn as a speech bubble: property, explained by people.

- Component: `src/components/brand/Logo.tsx` exports `Logo` (mark + wordmark) and `LogoMark`. The path lives in `LOGO_MARK_PATH` and is shared by the favicon, OG cards and email.
- Mark colour: copper `#C47A3A` (`LOGO_TILE`). The browser icon (`src/app/icon.svg`) is light copper on a eucalyptus tile.
- Wordmark: "Your Property Guide" in the serif (Source Serif 4), regular weight, tracking −0.01em. Live text, never an image, on the site.
- Still to recolour: `favicon.ico`, `apple-icon.png`, the OG cards (`src/lib/og/render.tsx`) and the email shell (`src/lib/email-theme.ts`) still use roof tile.
- Clear space: the mark's width on all sides. Minimum size: 16px mark. Don't outline, rotate or recolour it outside the palette.

## 3. Colour

Tokens live in `src/app/globals.css` (Tailwind v4 reads them via `@theme inline`; there is no tailwind config). Token names are unchanged from v3–v5 so components keep working.

| Name | Hex | Token | Use |
|---|---|---|---|
| Cream | `#FBF8F3` | `--background`, `--cream` | The page |
| Sand | `#F4EFE6` | `--surface-warm`, `--sand` | Alternate bands |
| White | `#FFFFFF` | `--surface-raised` | Cards and forms on cream or sand |
| Ink | `#14201B` | `--ink`, `--foreground` | Text |
| Ink muted | `#525C57` | `--ink-muted` | Secondary text (6.1:1 on sand) |
| Eucalyptus | `#0F3D2E` | `--surface-inverse`, `--eucalyptus` | Dark bands, the footer, dark cards |
| Eucalyptus deep | `#0A2E22` | `--eucalyptus-deep` | The hero's wash and stat bar |
| Copper | `#C47A3A` | `--accent`, `--copper` | Large type, the logo mark, rules |
| Light copper | `#E9B07C` | `--primary` inside `.tone-dark`, `--copper-light` | Accents, eyebrows and figures on eucalyptus (6.4:1) |
| Copper button | `#A9642C` | `--cta` | Solid buttons, white text (4.6:1) |
| Copper button hover | `#8F5222` | `--cta-hover` | |
| Copper text | `#9A5A26` | `--primary` | Links, eyebrows and small copper text on cream and sand (5.1:1 on cream) |

Rules:
- **Copper `#C47A3A` fails AA for body-size text**: 3.4:1 with white and 3.2:1 on cream. Never put white text on it, and never use it for text under 24px. Buttons use `--cta` and small copper text uses `--primary`; both pass.
- One solid copper button per screen. Selected states (tabs, chips, switches) are ink or eucalyptus; copper stays for actions.
- Semantic colours (`--success`, `--warning`, `--danger`) are for state, not brand.

## 4. Type

Two faces, loaded in `src/app/layout.tsx`:

- **Source Serif 4** (`--font-serif`, and `--font-display` points at it), with the optical-size axis and an italic. It sets h1, h2, the wordmark, big figures and pull quotes.
- **Schibsted Grotesk** (`--font-sans`) sets everything else: body text, h3 and below, labels, buttons and forms.

| Role | Size | Face, weight |
|---|---|---|
| Homepage H1 | 44px phone, 84px desktop | Serif 400, tracking −0.02em |
| Page H1 (`HeroTitle`) | 36–80px | Serif 400 |
| Band H2 (`BandTitle`, `SectionHeading`) | 34–56px | Serif 400, tracking −0.015em |
| H3 | 18–24px | Grotesk 700 |
| Body | 16–18px | Grotesk 400, line-height 1.6 |
| Eyebrow | 12–13px | Grotesk 600, uppercase, tracking 0.2em |
| Figures (stats, prices) | 30–44px | Serif 400 |

Rules:
- Sentence case for headings. Headings may end with a full stop when they're a sentence ("Five steps. Every one of them free to learn.").
- **Italic** is allowed in the serif only: the one accent phrase in a headline (in copper or light copper), a pull quote, and Andy's name as a signature. Never italic body text for emphasis.
- Never `tabular-nums`: Schibsted Grotesk spaces its commas, so $810,000 renders as "$810 ,000".

## 5. Shape and depth

- Corners: pill buttons (`rounded-full`), 10px fields (`rounded-lg`), 16px cards (`rounded-xl`), 24px large cards and panels (`rounded-3xl`).
- Soft shadows: `shadow-card` on white cards over cream or sand, and a deeper shadow only on floating things (a form on a photo, a dropdown, a book).
- Motion answers the person: a press, a tab, a slider, a figure gliding to its new value, the header turning solid as the page scrolls. Nothing moves on its own: no scroll reveals or autoplay. Every motion has a `prefers-reduced-motion` fallback.

## 6. Imagery

- **Homepage:** full-bleed, large photography is the point. It covers the hero, both homes in "same playbook" and the five steps, and lives in `src/components/campaign/photos.ts`. The images were generated with ImagineArt (Nano Banana Pro, 2K) on 15 Oct 2026 to match what each band says: a sandstone home on Sydney Harbour, a harbourfront 5-bed, a Brisbane brick-veneer 3-bed, and a living room styled for sale. They're stored in `public/images/campaign/`.
- **Under a wash:** only the homepage hero puts text over a photo. It sits under a eucalyptus gradient that is dark on the text side and opens to the photo on the right; on phones the wash is even.
- **Everywhere else:** documentary photography of real Australian places, as v5 (`public/images/photos/`, `PHOTOS` in `src/components/premium`): soft daylight, true colours, Australian vernacular. Prestige homes may be warmer and more polished, but they must still read as Australian.
- **Never present a generated or library image as a real sale, a real agent, our team or a customer.** The $18.5M and $640K homes are labelled "Example".
- Real people: Andy's own photo (`FOUNDER.photo` in `src/lib/founder.ts`) for the founder sections, forms and bylines.

## 7. Voice and facts

- Write like you'd explain it to a neighbour. Short sentences, active voice, Australian English.
- First person ("I") only in Andy's own words: the hero lead, the founder band, the about page, and Andy-attributed intros and callouts. Everything else is "we" or "you".
- **Andy's facts come only from `src/lib/founder.ts`:**
  - he sold $10M–$20M homes Australia-wide;
  - after two years he was head-hunted to advise big property companies;
  - his advice generated $4B+ in sales over the past five years;
  - the same campaign wins at every price.
- No other biography, client stories, testimonials, review counts, awards or statistics. Leave a `TODO(andy):` instead.
- **The only headline figures:**
  - $4B+ (Andy's advice, past five years);
  - 1 agent (for each job);
  - 0% of commission taken;
  - the live count of guides and tools (`ALL_GUIDES.length + TOOLS.length`, never typed by hand).
- **Competitors:** "Many agent-finder sites are paid a share of the agent's commission." Never a percentage for a competitor without a published source.
- Banned: three-beat slogans, "unlock", "journey", "seamless", "best agents", "top local agent", and "just" or "simply" before an instruction.
- Promises must be true today. If we don't have an agent in an area, we say so.

## 8. Conversion

Two paths, never mixed (unchanged from 14 Oct 2026):

- **Learning path** (guides, plans, calculators, the tips series): useful before any contact details, email only, phone optional, and it never reaches an agent. The homepage field opens the plan with the move, the state and the suburb filled in (`/plan?j=&s=&sub=`); only the suburb or postcode is looked up, never a street address.
- **Introduction path** (`/get-help`, the appraisal and agent pages): one participating agent for each job, a separate permission tick for each, and coverage shown before anything is sent.
- **The agreement check** (`/agreement-check`): a free 15-minute call with our team before someone signs an agency agreement. It's general information, not legal advice, and it never sends anyone to an agent.
- Promises come from `src/lib/service-model.ts` only:
  - `PROMISE`
  - `ONE_AGENT`: "One agent for each job you ask us to help with. Never a list."
  - `COMMISSION_STANCE`
  - `AGREEMENT_CHECK`
  - `FEE_DISCLOSURE`
  - `PARTNER_CHECKS`
- The fee disclosure (`FEE_DISCLOSURE`, a flat fee and no share of commission) sits beside every introduction form, with a link to how we're paid (`/about#ownership-funding`).
- **Agent profiles stay off the site until Andy lists a partner** in `src/lib/partner-agents.ts`. The homepage agent card renders nothing while that list is empty.

## 9. Components to reuse

```tsx
// Primary action (one per screen)
<Link href="/selling-guide" className={BUTTON_PRIMARY}>Get the free guide</Link>   // copper pill

// Secondary action
<Link href="/about" className={BUTTON_SECONDARY}>Read Andy’s story</Link>          // outlined pill

// A band's label, heading and standfirst (src/components/campaign/parts.tsx)
<Eyebrow>Same playbook, any price</Eyebrow>
<BandTitle>An $18.5 million home and a $640,000 home sell the same way.</BandTitle>
<BandLead>At the top end nobody leaves the price to the market.</BandLead>

// Card on cream or sand
<div className="rounded-3xl bg-white p-6 shadow-card">…</div>

// Dark band
<section className="tone-dark bg-eucalyptus py-20 sm:py-28">…</section>
```

## 10. What lives where

| Concern | File |
|---|---|
| Tokens | `src/app/globals.css` |
| Fonts | `src/app/layout.tsx` |
| Logo | `src/components/brand/Logo.tsx` |
| Header (clear over the homepage hero, solid elsewhere) / footer / phone bar | `src/components/layout/` |
| Homepage | `src/components/campaign/` |
| Andy's facts | `src/lib/founder.ts` |
| Campaign checklist and five steps | `src/lib/campaign.ts` |
| Promises, fees, partner checks, the agreement check | `src/lib/service-model.ts` |
| Partner agents shown by name | `src/lib/partner-agents.ts` |
| Tools list and counts | `src/lib/tools.ts` |
| Guides as books (chapters, chapter links) | `src/lib/guide-books.ts` (`chapterHref`) |
| Introduction rules and coverage | `src/lib/introductions/rules.ts` |
| Plans | `src/lib/plans/` |
| Journey components (forms, service sections) | `src/components/journeys/` |
| Inner-page building blocks | `src/components/premium` |
| Interactive parts (number tools, agent finder, 3D book, switches) | `src/components/interactive/` |

## 11. Inner pages

Inner pages keep the v4.1/v5 structure (`PhotoHero`, `Band`, `SectionHeading`, `RuleGrid`, `StepTimeline`), which picks up v6 through the tokens:

- cream page and sand quiet bands;
- eucalyptus dark bands;
- serif `HeroTitle` and `SectionHeading`;
- copper pill buttons.

Use `.tone-dark` on dark surfaces and `.tone-light` on a white card inside one, and write components with `text-ink`, `text-ink-muted` and `border-line`, never `text-white` or `text-gray-*`. Don't stack two dark bands.

## 12. Journeys

Forms use `src/components/journeys/fields.tsx`:

- visible labels;
- native radios styled as cards;
- errors tied to their fields;
- consent boxes with the full statement as the label;
- one request in flight at a time.

Measurement goes through `src/lib/analytics.ts` (an allow-list, nothing personal). Outcomes after a request are database events.

## 13. Things people use

The number tools (`NumbersPanel`), the agent finder (`AgentFinder`, `AgentChecks`), the 3D guide books and the switches all stay, as v5 built them. The homepage's tools band features the live selling-costs panel. `PlanBuilderLive` and `GuideShelf` were retired with the v5 homepage.

## 14. The campaign homepage (v6, 15 Oct 2026)

The order is fixed by Andy's brief:

1. **Hero:**
   - a full-bleed photo under the eucalyptus wash;
   - the eyebrow "The $20 million playbook, for every home";
   - the core line with "Not the market." in light-copper italic;
   - Andy's lead;
   - one address-or-suburb field with "Build my campaign plan";
   - selling, buying and both as underline tabs;
   - the stat bar ($4B+, 1 agent, 0%, the live count).

   The header sits clear over it until the page scrolls.
2. **Same playbook, any price:** two homes labelled as examples, joined by an "=" badge, sharing `CAMPAIGN_CHECKLIST`.
3. **The five steps:** numbered 01–05 because they're a real sequence, each linking to its selling-guide chapter (`chapterHref`).
4. **Founder band** on eucalyptus: portrait, Andy's words, the pull quote, his name in serif italic, $4B+, and a link to /about.
5. **Tools:** the live selling-costs panel, featured large, then stamp duty, borrowing power, the proposal worksheet and suburb profiles.
6. **One agent:**
   - the commission comparison;
   - the four checks with licence-register links;
   - the agent finder;
   - the partner card (real data only, else nothing).
7. **The agreement check** banner.
8. **The two guides** with their chapters.
9. **The closing line,** on cream so it never stacks on the dark footer.

Eyebrows (uppercase, letter-spaced, copper) label bands on the homepage, about, agreement check and guide chapters. They aren't for every section on every page.

*End of BRAND.md v6.*
