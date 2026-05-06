# REPO-MAP.md, Your Property Guide (read-only Phase 1 inventory)

**Purpose:** Complete map of the existing `yourpropertyguide.com.au` codebase, captured without modification, so Phase 2+ can plan UI work with full awareness of what exists and what is off-limits.

**Method:** This map was built by reading source files directly. Nothing was edited. The component and route catalogues marked with *(via subagent)* were compiled by a read-only Explore subagent and cross-checked.

---

## 1. Stack

A **Next.js 16.2.1 / React 19.2.4** App Router project written in **TypeScript 5** (strict). Styling is **Tailwind CSS v4** via `@tailwindcss/postcss` with design tokens declared as CSS custom properties in `src/app/globals.css` and registered with Tailwind through `@theme inline`. Forms use **`react-hook-form` + `zod`** (with `@hookform/resolvers`). Auth is **NextAuth v5 beta** with the **Prisma adapter**. Data layer is **Prisma 7.5** against Postgres (with `@prisma/adapter-pg`); the Prisma client is generated to `src/generated/prisma/`. Mapping uses **Leaflet + react-leaflet**; carousels use **Embla**; emails go via **Nodemailer → SendGrid**; transactional emails are also wired to **Resend** (in `dependencies` but not seen in the lead route). Image uploads go to **Vercel Blob**. Analytics: **Microsoft Clarity** (inline script in root layout) + **Quantcast** (inline script + `<QuantcastUser>` component). Hosting target: **Vercel** (`.vercel/` present, Next-image remote-pattern includes `*.public.blob.vercel-storage.com`) with a separate **Railway** sync-worker (`Dockerfile.sync-worker`, `railway.sync-worker.json`, `.railwayignore`).

Path alias: `@/*` → `./src/*`. Node `22.x` engine pinned.

---

## 2. Frontend surface

Two route groups under `src/app/`:
- **`(marketing)`**, public site, wrapped by `MarketingLayout` (renders `<Header />` + `<main>` + `<Footer />`).
- **`dashboard`**, authenticated agent/agency/admin area, wrapped by `dashboard/layout.tsx`.

Plus three system routes at the app root: `layout.tsx` (root, fonts + analytics), `not-found.tsx`, `robots.ts`, and dynamic sitemaps under `sitemap.xml/route.ts` plus per-section `sitemap.ts` files.

### 2a. Marketing, top-level pages

| Route | File | Purpose | Key components | Data source |
|---|---|---|---|---|
| `/` | `(marketing)/page.tsx` | Homepage: search hero + 8 stacked sections | `HeroSearch`, `StatsBar`, `ResearchTopics`, `SuburbSpotlight`, `SchoolFinderCallout`, `LatestGuides`, `FeaturedListings` + inline "Sell CTA" | suburb / blog / property services |
| `/about` | `(marketing)/about/page.tsx` | About / company info | static content + layout |  |
| `/contact` | `(marketing)/contact/page.tsx` | Contact + general enquiry | `EnquiryForm` (general-contact type) | `/api/leads` |
| `/privacy` | `(marketing)/privacy/page.tsx` | Privacy policy | static MDX-style content |  |
| `/glossary` | `(marketing)/glossary/page.tsx` | Property term glossary | static dictionary |  |
| `/research` | `(marketing)/research/page.tsx` | Research hub landing | nav into suburbs / calculators / guides |  |
| `/font-preview` | `(marketing)/font-preview/page.tsx` | **Internal**, typography sample sheet (likely dev-only) | typography swatches |  |
| `/appraisal` | `(marketing)/appraisal/page.tsx` | Free property appraisal | `AppraisalForm` | `/api/leads` (appraisal-request) |
| `/off-market` | `(marketing)/off-market/page.tsx` | Off-market property registration | `OffMarketRegisterForm`, `OffMarketTeaser` | `/api/leads` (off-market-register) |
| `/rba-cash-rate` | `(marketing)/rba-cash-rate/page.tsx` | RBA cash-rate tracker | static / chart |  |
| `/price-guide` | `(marketing)/price-guide/page.tsx` | Median price lookup | suburb price helpers | suburb service |

### 2b. Marketing, property listings

| Route | File | Purpose | Key components | Data |
|---|---|---|---|---|
| `/buy` | `(marketing)/buy/page.tsx` | Buy listings grid + filters | `PropertyFilters`, `PropertyGrid` | `getProperties({listingType:"buy"})` |
| `/buy/[slug]` | `(marketing)/buy/[slug]/page.tsx` | Buy property detail | `PropertyGallery`, `PropertyMap`, `PropertyPriceChart`, `PropertySchoolTabs`, `PropertyEnquireModal`, `AgentSidebarCard`, `PropertyMobileCTA` | `getPropertyBySlug`, `getSchoolsInSuburb`, `getAgentById` |
| `/rent` + `/rent/[slug]` | `(marketing)/rent/...` | Rent grid + detail | same family as `/buy` | property service (filtered) |
| `/sold` + `/sold/[slug]` | `(marketing)/sold/...` | Sold grid + detail | same family as `/buy` | property service (filtered) |
| `/property/[slug]` | `(marketing)/property/[slug]/page.tsx` | Canonical property detail (mirror of `/buy/[slug]`) | property detail components | property service |
| `/house-and-land` + `/house-and-land/[slug]` | `(marketing)/house-and-land/...` | H&L packages grid + detail | `HouseLandCard`, package grid | `getHouseAndLandPackages`, `getHouseAndLandBySlug` |

### 2c. Marketing, suburbs (the deepest sub-tree)

| Route | File | Purpose |
|---|---|---|
| `/suburbs` | `(marketing)/suburbs/page.tsx` + `SuburbsSearchBar.tsx` | Suburb directory + search |
| `/suburbs/[slug]` | `(marketing)/suburbs/[slug]/page.tsx` | Suburb profile (hero, stats, schools, walkability, climate, crime, hazard, contextual links) |
| `/suburbs/[slug]/buy` | `…/buy/page.tsx` | Filtered buy listings in suburb |
| `/suburbs/[slug]/rent` | `…/rent/page.tsx` | Filtered rent listings in suburb |
| `/suburbs/[slug]/houses` | `…/houses/page.tsx` | Houses-only filter |
| `/suburbs/[slug]/units` | `…/units/page.tsx` | Units-only filter |
| `/suburbs/[slug]/townhouses` | `…/townhouses/page.tsx` | Townhouses-only filter |
| `/suburbs/[slug]/land` | `…/land/page.tsx` | Land-only filter |
| `/suburbs/[slug]/rental-market` | `…/rental-market/page.tsx` | Rental-market analysis |
| `/suburbs/[slug]/schools` | `…/schools/page.tsx` | Schools in suburb |
| `/suburbs/[slug]/[street]` | `…/[street]/page.tsx` | Street-level listings |
| `/suburbs/[slug]/vs/[compareSlug]` | `…/vs/[compareSlug]/page.tsx` | Two-suburb comparison |

Suburb section also has its own `sitemap.ts` and a separate `streets/sitemap.ts`.

### 2d. Marketing, geographic indexes

| Route | Purpose |
|---|---|
| `/states` + `/states/[state]` | State directory + state market overview |
| `/regions` + `/regions/[slug]` + `/regions/[slug]/schools` | Region directory + region detail + schools-in-region |
| `/postcodes` + `/postcodes/[postcode]` | Postcode directory + postcode overview |
| `/best-suburbs` + `/best-suburbs/[category]` | Ranked suburb categories (growth / roi / rent / first-time / …) |
| `/market-reports` + `/market-reports/[state]` | Market report hub + per-state report |

### 2e. Marketing, schools

| Route | Purpose |
|---|---|
| `/schools` | School directory with search + filters |
| `/schools/[slug]` | School profile |
| `/schools/[slug]/vs/[compareSlug]` | School comparison |

### 2f. Marketing, agents & agencies

| Route | Purpose |
|---|---|
| `/agents` | Agent directory (with `AgentSearch`) |
| `/agents/[slug]` | Agent profile + listings tabs + contact section |
| `/real-estate-agencies` | Agency directory |
| `/real-estate-agencies/[slug]` | Agency profile + agent roster + `AgencyContactForm` |

Note: legacy `/agencies` and `/agencies/:slug*` redirect → `/real-estate-agencies/...` (see `next.config.ts`).

### 2g. Marketing, guides (35 hand-rolled pages)

`/guides` is a hub directory; each guide is its own static `page.tsx` under `(marketing)/guides/[guide-slug]/page.tsx`. There is **no `[slug]` dynamic route** for guides, every guide is a separate file. The 35 guides are:

`buying-property-australia`, `conveyancing-guide`, `building-pest-inspection`, `property-auction-guide`, `property-depreciation-guide`, `lenders-mortgage-insurance-guide`, `fixed-vs-variable-rate-guide`, `real-estate-agent-fees-australia`, `first-home-buyer-guide`, `first-home-buyer-nsw`, `first-home-buyer-qld`, `first-home-buyer-vic` *(check existence, see Open Questions)*, `first-home-buyer-wa`, `first-home-buyer-sa`, `first-home-buyer-tas`, `first-home-buyer-nt`, `granny-flat-guide-nsw`, `granny-flat-guide-vic`, `granny-flat-guide-qld`, `granny-flat-guide-wa`, `granny-flat-guide-sa`, `renters-rights-act`, `renters-rights-nsw` *(check)*, `renters-rights-vic`, `renters-rights-qld` *(check)*, `renters-rights-wa`, `renters-rights-sa`, `renters-rights-tas`, `renters-rights-nt`.

(Per-state coverage isn't quite uniform, confirmed missing: VIC first-home, NSW/QLD renters-rights. Open question for Andy.)

### 2h. Marketing, calculators (7)

| Route | Component |
|---|---|
| `/mortgage-calculator` | `MortgageCalculator` |
| `/affordability-calculator` | `AffordabilityCalculator` |
| `/borrowing-power-calculator` | `BorrowingPowerCalculator` |
| `/rental-yield-calculator` | `RentalYieldCalculator` |
| `/stamp-duty-calculator` | `StampDutyCalculator` |
| `/cgt-calculator` | `CGTCalculator` |
| `/refinancing-calculator` | `RefinancingCalculator` |

### 2i. Marketing, blog

| Route | Purpose |
|---|---|
| `/blog` | Blog listing (`BlogGrid`) |
| `/blog/[slug]` | Blog detail (`BlogTableOfContents`, `BlogShareButtons`) |
| `/blog/category/[category]` | Category archive |

### 2j. Dashboard (authenticated)

| Route | Purpose | Components |
|---|---|---|
| `/dashboard` | Dashboard home (role-based redirect) |  |
| `/dashboard/login` | NextAuth sign-in | NextAuth UI |
| `/dashboard/verify` | Email verification |  |
| `/dashboard/profile` | User profile edit | `ProfileForm` |
| `/dashboard/listings` | Listings table for agent/agency | listing list/table |
| `/dashboard/listings/new` | Create listing | `ListingCreateForm` (multi-step, image upload via Vercel Blob) |
| `/dashboard/listings/[id]` | Edit listing | `ListingEditForm` |
| `/dashboard/agency` | Agency profile edit | `AgencyForm` |
| `/dashboard/team` | Team members list | team table |
| `/dashboard/team/[id]` | Add/edit team agent | `TeamAgentForm` |
| `/dashboard/admin` | Admin home |  |
| `/dashboard/admin/users` | Manage users | `UserRoleSelect` |
| `/dashboard/admin/agencies` | Manage agencies | agency table |

### 2k. API routes

| Route | Method(s) | Purpose |
|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth handler |
| `/api/leads` | POST | Lead submission (full contract documented in §7) |
| `/api/suburbs/search` | GET | Suburb autocomplete (`?q=` → `{slug,name,state,postcode}[]`) |
| `/api/suggest` | GET | General-purpose suggest endpoint (existence noted; usage in current UI not confirmed) |
| `/api/indexnow` | POST | IndexNow URL submission for SEO |
| `/sitemap.xml` | GET | Aggregated sitemap |

---

## 3. Component inventory

*(Cross-checked from a read-only Explore subagent pass; grouped by `src/components/<folder>/`. "Importers" reflects best-effort grep; some UI primitives are imported via barrel files (`@/components/ui`) and may show as "orphaned" in raw greps, they are not.)*

### `ui/`, primitives
| Component | Purpose | Used by |
|---|---|---|
| `Button.tsx` | Variants: primary / secondary / outline / ghost / accent / gradient + sizes + `isLoading` | Used everywhere via `@/components/ui` barrel |
| `Card.tsx` | Card container + `CardContent` | Property + suburb + home pages |
| `Badge.tsx` | 6 variants (default, primary, accent, success, warning, outline) | Property listings, agent tabs |
| `Input.tsx` | `forwardRef` text input with label + error | All forms |
| `Select.tsx` | `forwardRef` select with label + error + readonly options | Forms, filters, dashboard |
| `Skeleton.tsx` | `animate-pulse` placeholder + `PropertyCardSkeleton` variant | Property + suburb pages |

### `home/`, homepage sections
`HeroSearch` (search modes: properties / suburbs / guides / agents) · `StatsBar` (async, site stat counts) · `ResearchTopics` (hardcoded TOPICS grid) · `SuburbSpotlight` (async featured-suburb carousel, uses `NEXT_PUBLIC_GOOGLE_MAPS_KEY`) · `SchoolFinderCallout` · `LatestGuides` (async, blog service) · `FeaturedListings` (async, property service).

### `forms/`, lead capture
`EnquiryForm` (`title`, `subtitle`, optional `propertyId`/`agentId`) · `OffMarketRegisterForm` (suburbs[], propertyTypes[], price range, beds) · `AppraisalForm` (address, type, beds).
All three POST to `/api/leads` with the appropriate `type` discriminator.

### `property/`, listings + detail
`PropertyCard` (`variant: 'grid' | 'list'`) · `PropertyGrid` (paginated) · `PropertyFilters` (`listingType: 'buy' | 'rent'`) · `PropertyGallery` (Embla carousel + lightbox) · `PropertyMap` (Leaflet) · `PropertyPriceChart` (SVG, **hardcoded greys**) · `PropertySchoolTabs` (sector colours: government / catholic / independent) · `PropertyFAQs` (accordion) · `PropertyDescriptionExpand` (truncate + show-more) · `PropertyActions` (enquire/share/save + share modal) · `PropertyEnquireModal` (modal form) · `PropertyInterestForm` (sidebar inline lead) · `PropertyMobileCTA` (sticky mobile bar) · `AgentSidebarCard` · `OffMarketTeaser` (blurred preview using `.off-market-blur` global class) · `RevealPhone` (obscured phone with click-to-reveal + analytics) · `HouseLandCard`.

### `layout/`
`Header` (sticky black bar; nav schema below) · `Footer` (async; has **per-route variants**, suburb-profile and property-detail routes get a SEO-rich `SuburbFooter` with surrounding-suburbs links; everything else gets the default 6-column footer; reads `x-pathname` from `headers()` to switch) · `Breadcrumbs`.

### `suburb/`
`SuburbHero` · `SuburbSearch` · `SuburbAlertWidget` (lead capture, `suburb-alert` type) · `SuburbInvestment` (growth/yield/ROI) · `SuburbSchools` · `SuburbWalkability` · `SuburbClimate` (SVG monthly bars) · `SuburbCrime` · `SuburbHazard` · `SuburbContextualLinks` · `DataFreshnessNote` · `SourceTooltip` (consumes `SOURCE_LABELS`).

### `search/`
`SuburbAutocomplete` · `MultiSuburbAutocomplete` · `AgentSearch` (`type: 'agent' | 'agency'`).

### `blog/`
`BlogGrid` (with `featured` highlighting) · `BlogTableOfContents` (assumes heading IDs) · `BlogShareButtons`.

### `calculators/`
One component per route, `MortgageCalculator`, `AffordabilityCalculator`, `BorrowingPowerCalculator`, `RentalYieldCalculator`, `StampDutyCalculator`, `CGTCalculator`, `RefinancingCalculator`. Calculation logic was not deeply reviewed in this pass, flag as "verify maths" before rebrand.

### `school/`
`SchoolSearchBar`, `SchoolListingControls`.

### `agent/`
`AgentCard`, `AgencyCard`, `AgentListingsTabs`, `AgentContactSection`.

### `agency/`
`AgencyContactForm`.

### `dashboard/`
`ProfileForm`, `TeamAgentForm`, `AgencyForm`, `ListingCreateForm`, `ListingEditForm`, `UserRoleSelect`.

### `analytics/`
`Providers` (wraps app in NextAuth + analytics context, used by root layout) · `QuantcastUser` (sends user properties to Quantcast).

### `seo/`
`JsonLd` (generic schema renderer) · `OrganizationJsonLd` (used on homepage) · others (`BreadcrumbJsonLd`, `PlaceJsonLd`, `ItemListJsonLd`, `GuideArticleJsonLd`) referenced from page files.

**Duplicates / overlaps to flag:**
- Three "lead capture in the property context" components: `PropertyInterestForm` (sidebar inline), `PropertyEnquireModal` (modal), `EnquiryForm` (general). Different surfaces, same goal, Phase 2 should decide whether they collapse to one configurable component.
- `PropertyCard` and `HouseLandCard` are visually similar but separate. Probably justified, but worth a side-by-side audit.
- `Footer` has two near-duplicate code paths (suburb-aware vs default) with ~150 lines of overlap.

**Apparent orphans (likely false positives via barrel imports, verify before removing):**
- All `ui/*` primitives.
- `font-preview/page.tsx` page itself looks like a dev tool that should not ship.

---

## 4. Styling system

**Tokens are CSS variables** declared in `src/app/globals.css` under `:root`, then re-exported into Tailwind v4's `@theme inline {}` block so `bg-primary`, `text-accent` etc. resolve to them.

**Colour tokens (full list):**

| Token | Value | Notes |
|---|---|---|
| `--background` | `#ffffff` | body bg |
| `--foreground` | `#000000` | body text |
| `--primary` | `#5c2d5e` | deep purple, brand core |
| `--primary-light` / `-lighter` / `-dark` / `-darker` | `#8B4A8C` / `#A96DAA` / `#4E1F4F` / `#351438` | 5-step ramp |
| `--accent` | `#DD3C70` | magenta, CTAs |
| `--accent-light` / `-lighter` / `-dark` / `-darker` | `#E5638F` / `#EDA3BB` / `#C42B5C` / `#9E1F48` | 5-step ramp |
| `--gray-50 … --gray-900` | matches Tailwind defaults | re-declared as CSS vars (slightly redundant with Tailwind's own greys, but consistent with the @theme pattern) |

**Custom shadows** (declared in `@theme inline`):
- `--shadow-card`: `0 1px 4px 0 rgb(0 0 0 / 0.08), 0 8px 24px 0 rgb(0 0 0 / 0.10)`
- `--shadow-card-hover`: `0 4px 12px 0 rgb(0 0 0 / 0.10), 0 20px 48px 0 rgb(0 0 0 / 0.14)`

**Typography** (loaded in `src/app/layout.tsx` via `next/font/google`):
- `Playfair_Display`, `--font-display` (weights 400/500/600/700) → applied to all `h1..h6` via the `body { ... }` rule.
- `Plus_Jakarta_Sans`, `--font-sans` (weights 300–700) → body default.
- Body line-height **1.625** (`leading-relaxed` baseline), `h1` line-height pinned to **1.15** to override Tailwind's tight `text-5xl`/`text-6xl` defaults.

**Global utilities defined in `globals.css`:**
- `.gradient-brand` → `background: #000000` (placeholder; doesn't actually gradient).
- `.gradient-brand-text` → `color: #000000` (placeholder).
- `.off-market-blur` → 12px blur + no select + no pointer events (used by `OffMarketTeaser`).
- `html { scroll-behavior: smooth }`.
- `*:focus-visible` → 2px solid `var(--primary)` outline, 2px offset.

**No tailwind.config.{ts,js,mjs} file.** Tokens come purely from CSS, this is the v4 idiom but worth noting if anyone goes looking.

**Hardcoded values worth flagging for Phase 2 cleanup:**
- ~13 hex literals scattered across `src/components/**` (per Explore subagent grep). Notable spots:
  - `home/ResearchTopics.tsx`, warm-beige theme: `bg-[#f7f6f4]`, `border-[#e8e6e2]`, `bg-[#f0efec]`.
  - `property/PropertyPriceChart.tsx`, SVG strokes/fills using grey hexes (`#f3f4f6`, `#9ca3af`, `#6b7280`, `#111827`).
  - `home/SuburbSpotlight.tsx`, `border-[#e8e6e2]`.
  - `Footer` uses `bg-[#0a0a0a]` (almost-black, off-token).
- `app/(marketing)/page.tsx`, homepage Sell-CTA section uses raw `bg-black`, `text-white`, `text-white/70` (Tailwind utilities, not tokens, fine, just noting).
- `Header` uses `bg-black border-white/10` rather than a `--surface-dark` token, currently consistent with the black-header brand, but if the brand evolves toward YFG's warm-cream feel, this is one of the first things to revisit.
- `.gradient-brand` / `.gradient-brand-text` are both literally `#000000`. They are placeholders, either delete or wire to actual gradient utilities.

---

## 5. Data shapes available to the frontend

Source: `src/lib/services/**` (all read directly via `import { db } from '@/lib/db'`, Prisma-backed) and `src/lib/data/**` (looks like static-data adapters; check before assuming server-only).

The shapes future UI work can bind to, summarised by service:

**Property** (`property-service.ts`):
- `getProperties(params?)`, `getPropertyBySlug(slug)`, `getFeaturedProperties(limit=6)`, `getPropertiesBySuburb(suburbSlug, limit?)`, `getPropertiesByAgency(agencyId, limit=6)`, `getPropertiesByListingType(type)`, `getPropertyCount()`.
- Returns the `Property` type defined in `src/types/property.ts`:
  ```
  Property {
    id, slug,
    listingType: "buy" | "rent" | "sold" | "off-market" | "house-and-land",
    propertyType: "house" | "townhouse" | "apartment" | "unit" | "land" | "acreage" | "villa",
    status:       "active" | "under-contract" | "sold" | "off-market",
    title,
    address: { street, suburb, state, postcode, full },
    price:   { display, value, isRange, min?, max?, rentPerWeek? },
    features:{ bedrooms, bathrooms, carSpaces, landSize?, buildingSize? },
    description, images: PropertyImage[],
    agentId, coAgentId?, agencyId, suburbSlug,
    inspectionTimes?, auctionDate?, dateAdded, dateSold?, soldPrice?,
    isOffMarket?, isFeatured?
  }
  ```

**Suburb** (`suburb-service.ts`):
- `getSuburbs(opts?)`, `getFeaturedSuburbs(limit=6)`, `getSuburbBySlug(slug)`, `getAllSuburbSlugs()`, `getAllSuburbSlugsWithDates()`, `getSuburbsByRegion(region)`, `getSuburbsByState(state)`.
- Returns `Suburb` (`src/types/suburb.ts`) with nested `SuburbStats`: `medianHousePrice`, `medianUnitPrice`, `medianRentHouse`, `medianRentUnit`, `annualGrowthHouse`, `annualGrowthUnit`, `daysOnMarket`, `population`, `medianAge`, `ownerOccupied`, `renterOccupied`, `householdsFamily`, `householdsLonePerson`, `walkScore`, `transitScore`, `bikeScore`. Plus `schools[]`, `amenities[]`, `transportLinks[]`, `nearbySuburbs[]`, optional `dataFreshness`, `hazard`, `climate`.

**School** (`school-service.ts`):
- `getSchoolBySlug`, `getAllSchoolSlugs`, `searchSchools({name?, type?, sector?, state?, limit?})`, `getSchoolsInSuburb(suburbId, excludeAcaraId?)`, `getSchoolsByRegion(suburbSlugs[])`.
- `School { name, type: "primary"|"secondary"|"combined"|"special", sector: "government"|"catholic"|"independent", distance, yearRange?, gender: "coed"|"girls"|"boys"|null, website?, icsea?, enrolment?, acaraId? }`.

**Blog** (`blog-service.ts`):
- `getBlogPosts`, `getBlogPostBySlug`, `getAllBlogSlugs`, `getBlogPostsByCategory`, `getDistinctBlogCategories`.
- `BlogPost { slug, title, description, content, author?, category?, publishedAt, updatedAt, image?, featured? }`.

**Agent** (`agent-service.ts`):
- `getAgents(suburbSlug?)`, `getAgentBySlug`, `getAgentById`, `getFeaturedAgents`, `getAgentsByAgency(agencyId)`.
- `Agent { id, slug, fullName, email, phone, photo?, bio?, agencyId, featured?, listingCount?, officeAddress? }`.

**Other:**
- `rental-service.ts` → `getSuburbRentalHistory(suburbSlug)` → `SuburbRentalHistory[]`.
- `postcode-service.ts` → `getSuburbsByPostcode`, `getAllPostcodes`, `getAllPostcodesWithState`, `getPostcodeStats`.
- `region-service.ts` → `getRegionBySlug`, `getAllRegionSlugs`, `getRegionSuburbs`.
- `house-and-land-service.ts` → `getHouseAndLandPackages(suburbSlug?)`, `getHouseAndLandBySlug(slug)`, `getAllHouseAndLandSlugs`.
- `market-report-service.ts` → `getStateMarketData(state)`, `getStateNameForReport(state)`.
- `suburb-rankings-service.ts` → `getRankedSuburbs(category, state?, limit?)`, `getStateStats(state)`, `getTopSuburbsByState(state, limit=12)`.
- `data-freshness.ts` → `getFreshnessByCategory`, `getSourceFreshness`, `getRentalFreshness`, `getCrimeFreshness`, `getLatestSuburbRental`.

> Phase 2 binding rule: only consume these services from server components; never call Prisma directly from a client component. Where a client component needs data (e.g. autocompletes), go via the existing `/api/suburbs/search` route or add a similar one.

---

## 6. Backend / off-limits zone

**Do not touch any of the following in design / UI phases.** These are the data-pipeline, auth, and infrastructure surfaces.

**Database & schema**
- `prisma/schema.prisma`, entire data model.
- `prisma/seed.ts`, dev seeding.
- `prisma.config.ts` (repo root).
- `src/generated/prisma/**`, auto-generated client (regenerated by `prisma generate`; never hand-edit).

**Server routes**
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/leads/route.ts` (contract documented in §7, read it, but don't edit it)
- `src/app/api/suburbs/search/route.ts`
- `src/app/api/suggest/route.ts`
- `src/app/api/indexnow/route.ts`
- `src/app/sitemap.xml/route.ts` and every `*/sitemap.ts`

**Auth & permissions**
- `src/auth.ts`, `src/auth.config.ts`
- `src/middleware.ts`
- `src/lib/auth/permissions.ts`

**Data layer (Prisma-direct; safe to read, but treat as backend code)**
- `src/lib/db.ts`, Prisma client singleton.
- `src/lib/services/**`, all 11 service modules query the database directly; if you need new shapes, add a service or extend an existing one rather than reaching into Prisma from a page.
- `src/lib/data/**`, `agents.ts`, `agencies.ts`, `blogs.ts`, `house-and-land.ts`, `properties.ts`, `suburbs.ts`, appear to be data adapters; check before treating as static.
- `src/lib/services/data-freshness.ts`, `src/lib/indexnow.ts`, `src/lib/clarity.ts`, `src/lib/utils/lead-routing.ts`, `src/lib/utils/lga-names.ts`, `src/lib/utils/stamp-duty.ts`, `src/lib/utils/school.ts`.

**Sync workers / data ingestion**
- `scripts/sync/**`, `run.ts`, `run-batch.ts`, `ckan.ts`, `crime-batch.ts`, `match-sales.ts`, `slug-matcher.ts`, `audit-gaps.ts`, `check-data.ts` + `lib/`, `sources/`, `smoke/`.
- `scripts/seed/**`, GNAF imports, suburb-stats sync, ABS sync, Thomson legacy migrations, admin/demo setup.
- `scripts/check-suburb.ts`, `scripts/set-password.ts`, `scripts/import-gnaf-all.sh`.

**Deploy / infra**
- `Dockerfile.sync-worker`, `Dockerfile.gnaf-import`
- `railway.sync-worker.json`, `.railwayignore`
- `.vercel/`, `.vercelignore`
- `.env`, `.github/`
- `next.config.ts` (image remote patterns, redirects, touch only with care)

**Generated / build artefacts (never hand-edit)**
- `.next/`, `.cache/`, `tsconfig.tsbuildinfo`, `node_modules/`, `src/generated/`

**Operational docs (read-only context, not code)**
- `docs/morning-report.md`
- `docs/postgis-migration-runbook.md`, `docs/postgis-migration-report-2026-05-04.md`
- `docs/spatial-etl-research.md`

---

## 7. Lead-capture state today

**Yes, lead capture is already wired end-to-end.** There is a single `POST /api/leads` endpoint that all forms post to, and it (1) Zod-validates, (2) routes the lead to an agent via `lib/utils/lead-routing.ts`, (3) writes to the Prisma `Lead` table, (4) sends an HTML email via Nodemailer + SendGrid to `andy@theandylife.com` cc `jos@profitgeeks.com.au`, (5) returns `{ success, message, id }`.

### Current contract, `POST /api/leads`

**Request body (Zod):**

```ts
{
  type: "property-enquiry" | "appraisal-request" | "off-market-register"
      | "general-contact" | "house-and-land-enquiry" | "suburb-alert"
      | "property-interest",
  firstName: string (≥1),
  lastName:  string (≥1),
  email:     string (email),
  phone:     string (≥8),
  message?:  string,
  propertyId?: string,
  agentId?:    string,
  agencyId?:   string,
  suburb?:     string,
  source?:     string,
  buyingCriteria?: {
    suburbs?: string[],
    propertyTypes?: string[],
    minPrice?: number,
    maxPrice?: number,
    minBeds?:  number,
  },
  appraisalAddress?: string,
  address?:          string,
  propertyType?:     string,
  bedrooms?:         string,
}
```

**Responses:**
- `200 { success: true, message: "Enquiry submitted successfully", id: "<uuid>" }`
- `400 { error: "Validation failed", details: <ZodError.flatten()> }`
- `500 { error: "Internal server error" }`

**Routing logic** (`src/lib/utils/lead-routing.ts`):
1. If `agentId` present → direct assignment (`reason: "direct-agent"`).
2. If `propertyId + agentId` present → listing agent (`reason: "listing-agent"`). *(Note: identical guard to step 1; the `propertyId` branch is unreachable as written. See Open Questions.)*
3. If `suburb` matches the hardcoded `AGENT_COVERAGE` map (6 QLD suburbs: burpengary, caboolture, narangba, morayfield, deception-bay, north-lakes) → assigned coverage agent (`reason: "suburb-coverage"`).
4. Otherwise round-robin between two `FALLBACK_AGENTS` (`reason: "round-robin"`).

The routing map references string IDs `agent-1`…`agent-6`, `agency-1`/`agency-2`, **these are placeholder IDs**; the email lookup against the actual `Agent` table will silently miss for all of these (the catch swallows the error). Real Phase-2 work will need the routing map keyed on real Prisma IDs or replaced with a DB-driven coverage table.

### Forms wired to it

| Form component | Page(s) | `type` sent | Pre-filled fields |
|---|---|---|---|
| `EnquiryForm` | property detail, `/contact` | `property-enquiry` / `general-contact` | propertyId, agentId (when on a listing) |
| `AppraisalForm` | `/appraisal`, property actions | `appraisal-request` | appraisalAddress |
| `OffMarketRegisterForm` | `/off-market` | `off-market-register` | (collects buyingCriteria) |
| `PropertyInterestForm` | property detail sidebar | `property-interest` | address, suburb |
| `PropertyEnquireModal` | property detail modal | `property-enquiry` | propertyId, agentId |
| `SuburbAlertWidget` | suburb detail | `suburb-alert` | suburb |
| `AgencyContactForm` | agency detail | (one of the above, likely `general-contact` with `agencyId`) | agencyId |

**No multi-step / journey-style form exists.** Every form is single-step (some have multiple sections on one page, e.g. `OffMarketRegisterForm`'s buying criteria), and each maps cleanly to one of the seven `type` discriminators. If Phase 2 wants to mirror YFG's `/#match` four-step pattern, that's net-new work, but the existing API contract is wide enough to absorb it (most fields are optional).

---

## 8. Open questions

For Andy before Phase 2 kicks off:

1. **Brand-skin alignment.** YPG's current visual language (black header, Playfair-Display headings, purple `#5c2d5e` primary, magenta `#DD3C70` accent) is *opposite* to YFG's warm-cream / orange-or-teal accent / sans-only system. Are we (a) keeping YPG's distinct premium-real-estate skin and only sharing principles with YFG, or (b) pulling YPG closer to YFG's editorial-warm look so the brand-of-brands is visually unified? Phase 2 direction depends entirely on this.
2. **Charter wording for property economics.** YFG's four charter principles include "No paid placements" and "One match, not five". YPG monetises agent listings and may include featured/sponsored placements, what's the honest property-equivalent of each principle?
3. **Lead routing, placeholder IDs.** `lib/utils/lead-routing.ts` uses placeholder agent/agency IDs (`agent-1`..`agent-6`, `agency-1`..`agency-2`) that do not match real Prisma records (the email-template agent-name lookup will silently fail for all routed leads). Is there an intended migration to DB-driven coverage, or should Phase 2 leave routing alone and just rebuild the form layer?
4. **Form consolidation.** There are seven form components feeding one endpoint. YFG's pattern is one canonical matcher, every CTA points to it. Do we collapse YPG's forms toward a single `/match`-style entry, or keep the per-context variants?
5. **Notification-recipient hardcoding.** `andy@theandylife.com` and `jos@profitgeeks.com.au` are hardcoded in `api/leads/route.ts`. Should Phase 2 move these to env vars at the same time as the rebrand, or out of scope?
6. **Guide coverage gaps.** `first-home-buyer-vic` was not present in the file listing (NSW/QLD/WA/SA/TAS/NT all are); same for `renters-rights-nsw` and `renters-rights-qld`. Intentional or backlog?
7. **`gradient-brand` / `gradient-brand-text` placeholders.** Both currently resolve to plain `#000000`. Are these dead, or staged for an upcoming gradient design?
8. **`font-preview` page.** `(marketing)/font-preview/page.tsx` is publicly routable (no auth gate visible). Should it be removed or moved behind a flag before launch?
9. **Per-route `Footer` variant.** The async `Footer` reads `x-pathname` from `headers()` and swaps to a SEO-suburb footer on `/suburbs/[slug]`, `/buy/[slug]`, `/rent/[slug]`, `/sold/[slug]`. The middleware that sets `x-pathname` is in `src/middleware.ts`, confirm Phase 2 designs don't break this contract.
10. **PostGIS migration.** `docs/postgis-migration-runbook.md` and `docs/postgis-migration-report-2026-05-04.md` exist, is the migration done, mid-flight, or scheduled? Affects whether suburb/property data shapes are about to change under the UI.

---

*End of repo map. Read-only contract maintained: only files written are this one and `BRAND-ANALYSIS.md`.*
