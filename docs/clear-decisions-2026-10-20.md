# Clear decisions: handover (20 Oct 2026)

Andy's approved "Clear decisions" direction, implemented across the site on branch `clear-decisions` (from origin/main 3f68fc54). It replaces the 15 Oct campaign-led positioning. BRAND.md v7 is the source of truth for the rules; this note says what changed and what's still open.

## What changed

**Positioning.** The opening is "Know what matters before you buy or sell." (`PROMISE` in `src/lib/service-model.ts`), for everyday buyers and sellers across budgets. The $20 million campaign, "beat the campaign", "not the market" and contest framing are gone from current copy, guide titles, chapter headings, calls to action, emails, metadata, `llms.txt` and the social cards. Andy's experience is supporting background (`src/lib/founder.ts`): a one-line summary on the homepage, the detail behind a disclosure, the full story on /about.

**Design system** (`src/app/globals.css`, token names unchanged so everything cascades): cream page, paper cards, forest ink and buttons, terracotta for the selling edition, restrained copper, Source Serif 4 at regular weight with tight tracking, Schibsted Grotesk, 4–8px corners, fine rules instead of shadows. `bg-white` now renders the warm paper colour. Buttons are `bg-cta text-cta-ink` (a cream button inside forest bands).

**Shared parts.** Header (four quiet menus and "Find my next step"; personal help moved into the menus), cream footer with every link column kept, phone bar ("Find my next step" / "Personal help" or "Ask about an agent"), `PhotoHero` (wide photo for hubs, portrait for guides and tools), `SectionHeading` with an optional kicker, `LinkRows` instead of card grids, `StepTimeline` with serif numbers, `TEXT_LINK`. Calculators sit on a sand tool surface. A branded error boundary (`src/app/(marketing)/error.tsx`) and a rebuilt 404.

**Homepage** (`src/components/homepage/`, content in `src/lib/home-start.ts`): the approved design section by section. The planner shows three linked starting points per move and stage and opens the full plan with those answers (`planStartHref({ answers })`). The old `src/components/campaign/` is deleted.

**The books.** One cover component (`src/components/brand/BookCover.tsx`) renders every cover: the site, the landing pages, chapter sidebars, the 3D book, the printable A4 cover, so the PDFs, the cover JPEG (`public/images/guide/<g>-guide-cover.jpg`, replacing the PNG), the email cover and the guides' social cards. Buying a home (01, forest, the apartment) and Selling a home (02, terracotta, the door). Chapter slugs unchanged; visible titles rewritten in `src/lib/guide-books.ts`; all twenty chapters rewritten constructively with every figure, rule and link kept.

**Regenerated assets:** both guide PDFs (`npm run guides:pdf` against a running site; the cover photo now embeds as the original JPEG, 1.4 MB each), the spring countdown PDF, favicon/apple/app icons and mark PNGs, `public/og-image.jpg`, the two guide social cards, all ActiveCampaign templates (`scripts/ac-emails/build.ts`).

**Imagery.** `public/images/brand/apartment-light.jpg` and `terracotta-door.jpg` are optimised JPEGs of the supplied originals, kept at `docs/brand/clear-decisions/`. They're illustrative and never shown as Hamilton, a renovation, a customer's home or a sale. Andy's portrait is unchanged (it's the one in the approved design; the `TODO(andy)` is resolved).

## Checks run

- `npx vitest run tests/lib tests/seo tests/api`: all passing (1,392 tests). Tests updated where they asserted the old homepage or wording; two `openGraph` regexes fixed that were already failing on origin/main after #146.
- `tsc --noEmit` clean; eslint clean on changed files except a pre-existing `set-state-in-effect` in `StickyMatchCTA.tsx` (only its colours changed).
- Production build (see the PR).
- Rendered and reviewed at 1280px and 390px: homepage, buying and selling hubs, first home buyers, buying and selling, buyer's agents, get help, guides hub, an article, the selling guide landing page, a chapter, a calculator, tools, plan and plan result, appraisal, agreement check, about, contact, a suburb profile, property market, thank-you, unsubscribed and 404; the A4 covers and PDF pages; the social cards; sample emails.
- Homepage interactions in a browser: move and stage, starting points, the full-plan link (the planner opens at question 2), the question desk, Look inside, the introductions preview, and the header and phone bar following the move. No console errors.

## Still with Andy

- **Publish the blog changes:** three evergreen "playbook" lines in `src/lib/data/blog-posts/` need `npm run publish:blogs` after deploy to reach production.
- **ActiveCampaign:** ~~the regenerated templates need re-pasting into AC~~. Superseded 21 Oct: AC is retired and the templates removed; see `docs/email-system-2026-10-21.md`.
- **Newsletter:** the remaining "quarterly" promises were removed, in line with #145; the form still waits on Andy's decision to start sending or remove it.
- **Bylines:** Bec Ramirez and Ellie Johnston (unchanged, still to be confirmed).
- **The homepage planner has no suburb field** (the approved design doesn't). The header and phone bar still pass on a suburb when a page publishes one; the full planner asks for state and suburb.
