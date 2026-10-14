# Portal consolidation, 14 Oct 2026

The site is now a property education and introduction service, not a listings
portal. From the owner's brief: do not expand general listing functionality,
assess the portal features before consolidating them, keep valuable URLs
working through redirects, and keep customer data.

This note covers what each retired route was, its search traffic, what was
decided, where it now redirects, and what data was kept. The tests are in
`tests/seo/portal-redirects.test.ts`.

## Traffic

Sources: Google Search Console, 90 days from 30 Jun to 27 Sep 2026
(`docs/seo-baselines/2026-09-30/gsc-90d-page.csv`, www and apex hosts
together), and Bing Webmaster (`bing-page.csv`).

| Route | GSC pages | Clicks | Impressions | Bing |
|---|---|---|---|---|
| `/buy` (index) | 0 | 0 | 0 | none |
| `/buy/[slug]` | 4 | 0 | 18 | none |
| `/rent`, `/rent/[slug]` | 0 | 0 | 0 | none |
| `/sold`, `/sold/[slug]` | 0 | 0 | 0 | none |
| `/off-market` | 0 | 0 | 0 | none |
| `/house-and-land`, `/house-and-land/[slug]` | 0 | 0 | 0 | none |
| `/best-deals` | 1 | 0 | 7 (pos 31.6) | none |
| `/best-deals/[id]` | 0 | 0 | 0 | none |
| `/suburbs/[slug]/rent` | 56 | 1 | 121 | none |
| `/suburbs/[slug]/buy` | 23 | 0 | 62 | none |
| `/suburbs/[slug]/houses` | 5 | 0 | 42 | none |
| `/suburbs/[slug]/units` | 1 | 1 | 2 | none |
| `/suburbs/[slug]/townhouses`, `/land` | 0 | 0 | 0 | none |
| `/search` (kept) | 1 | 0 | 6 | none |

Across the whole portal that is 2 clicks in 90 days, both on suburb listing
sub-pages. Each redirect sends those visitors to the suburb profile, which is
the page with real traffic.

## Route audit

| Route | What it was | Forms and leads | Linked from (before) | Sitemap (before) | Decision |
|---|---|---|---|---|---|
| `/buy` | Filterable grid of `Property` rows with `listingType: "buy"` (legacy demo listings from one Moreton Bay agency, plus 17 legacy `-thomson` slug redirects) | None | `/site-map`, `pages/sitemap.ts`, state pages (`/buy?state=`), market reports (`/buy?state=`), agency profiles (`/buy?agency=`), `/data`, the unused `FeaturedListings` and `HeroSearch` components, the header's buying-path list and `MobileBottomNav` (layout files) | `/pages/sitemap.xml` | Retire, redirect to `/buying` |
| `/buy/[slug]` | Listing detail: gallery, map, schools, suburb figures, FAQs, agent sidebar | `AgentSidebarCard` → `PropertyEnquireModal` posted `property-enquiry` leads; reveal-phone; save via `/api/properties/[id]/saved` | `PropertyCard` (suburb profile, region, school and agency grids), the dashboard's "View listing" link | `/buy/sitemap.xml` | Retire, redirect to `/buying` |
| `/rent` | Filterable grid of rentals | None | `/site-map`, `pages/sitemap.ts`, `SuburbContextualLinks` (`/rent?suburb=`) | `/pages/sitemap.xml` | Retire, redirect to `/guides` |
| `/rent/[slug]` | Rental detail | `EnquiryForm` posted `property-enquiry` | `PropertyCard` | `/rent/sitemap.xml` | Retire, redirect to `/guides` |
| `/sold` | Grid of sold listings | None | `/site-map`, `pages/sitemap.ts`, `/data`, `/agents`, `/property-valuation`, four guides | `/pages/sitemap.xml` | Retire, redirect to `/suburbs` |
| `/sold/[slug]` | Sold listing detail | `AgentSidebarCard` posted `property-enquiry` | `PropertyCard` | `/sold/sitemap.xml` | Retire, redirect to `/suburbs` |
| `/off-market` | Off-market teaser cards and a register | `OffMarketRegisterForm` posted `off-market-register` | `/site-map`, `pages/sitemap.ts`, how-to-sell and buyer's agent guides, the off-market blog post, `BlogGuideRail` | `/pages/sitemap.xml` | Retire, redirect to `/selling` |
| `/house-and-land` | Package grid; noindex with no stock (0 packages in production on 1 Oct 2026) | None | `/site-map`, `/data`, the property developer leads page, two blog posts | `/house-and-land/sitemap.xml` (stock-gated) | Retire, redirect to `/buying` |
| `/house-and-land/[slug]` | Package detail | `EnquiryForm` posted `house-and-land-enquiry` | `HouseLandCard` | `/house-and-land/sitemap.xml` | Retire, redirect to `/buying` |
| `/best-deals` | Partner-agent "featured deals" grid; empty queue | None (links to `/find-an-expert`) | `BestDealsRail` (unused) | `/best-deals/sitemap.xml` | Retire, redirect to `/buying` |
| `/best-deals/[id]` | Deal detail with partner disclosure | None ("Get connected" → `/find-an-expert?intent=buying`) | `BestDealCard` | `/best-deals/sitemap.xml` | Retire, redirect to `/buying` |
| `/suburbs/[slug]/buy`, `/rent` | A suburb's listings with filters; noindex when empty (all but 13 suburbs on 29 Sep 2026) | `ExpertCTA` and `StickyMatchCTA` to the selling guide (both still on the profile) | The profile's listing buttons and contextual links, the schools page, the rental-market page and its sections, the tab strip | `/suburbs/subpages/sitemap/{buy,rent}.xml` (stock-gated) | Retire, redirect to the profile |
| `/suburbs/[slug]/houses`, `/units`, `/townhouses`, `/land` | A suburb's for-sale listings of one type; noindex when empty | `StickyMatchCTA` | As above | `/suburbs/subpages/sitemap/{type}.xml` (stock-gated) | Retire, redirect to the profile |
| `/search` | Site search behind the header icon | None | Header | `/pages/sitemap.xml` | **Kept** |

Left alone on purpose: `/property/[slug]` and `/suburbs/[slug]/[street]`
(both 410 by design), the suburb profiles, and `/suburbs/[slug]/rental-market`,
`/schools`, `/agents` and `/vs/...`.

`robots.ts` had no rule for any of these routes, so nothing changed there.

## Redirects

All are in `next.config.ts` `redirects()`, are permanent (308), and run before
the filesystem. Each lands in one hop; the test checks that no rule's fixed
destination is itself redirected.

| Source | Destination |
|---|---|
| `/buy/:path*` (matches `/buy` too) | `/buying` |
| `/rent/:path*` | `/guides` (there is no renting category under `/guides/category`) |
| `/sold/:path*` | `/suburbs` |
| `/off-market/:path*` | `/selling` |
| `/house-and-land/:path*` | `/buying` |
| `/best-deals/:path*` | `/buying` |
| `/suburbs/:slug/:listing(buy\|rent\|houses\|units\|townhouses\|land)` | `/suburbs/:slug` |

- Query strings pass through, for example `/buy?suburb=x` goes to
  `/buying?suburb=x`.
- `:path*` matches whole segments only, so `/buying`, `/buying-guide`,
  `/rental-yield-calculator` and `/selling-guide` are not caught. The suburb
  rule matches only those six exact words, so `/rental-market`, `/schools`,
  `/agents`, `/vs/...` and street slugs such as `/landsborough-avenue` are
  not caught.
- The 17 legacy `/buy/*-thomson` rules (property slug migration) pointed at
  `/buy/{new-slug}` pages that no longer exist. They were removed: the
  `/buy/:path*` rule sends those URLs to `/buying` in one hop instead of two.
- The rules sit before the 580 non-locality rules. A non-locality slug's
  listing sub-page (for example `/suburbs/nerang-dc-qld-4211/buy`) takes two
  hops: to `/suburbs/nerang-dc-qld-4211`, then to the real suburb. That would
  take 290 extra rules to fix, and none of these URLs is in the search data.
- The old child sitemap URLs `/buy/sitemap.xml`, `/rent/sitemap.xml`,
  `/sold/sitemap.xml`, `/house-and-land/sitemap.xml` and
  `/best-deals/sitemap.xml` now fall under the same rules and redirect to the
  hubs. `/suburbs/subpages/sitemap/{buy,rent,houses,units,townhouses,land}.xml`
  answer 404. If any of these were submitted to Search Console or Bing on
  their own, remove them there; the index at `/sitemap.xml` no longer lists
  them.

## Lead forms and data

- **The forms are gone, the API types stay.** Off-market registrations
  (`OffMarketRegisterForm`) and listing enquiries (the property enquiry
  modal, and the rental and house-and-land `EnquiryForm`s) can no longer be
  submitted, because their pages are gone. `/api/leads` still accepts
  `property-enquiry`, `off-market-register` and `house-and-land-enquiry`, so a
  form open in someone's browser during the deploy still submits. The test
  checks this. `lead-emails.ts` still renders those types.
- **Existing Lead rows of these types are kept.** No migration and no
  deletion was done. They stay visible in the admin leads views.
- **The listing data is kept.** The Prisma models and their rows are
  unchanged: `Property` (the legacy listings, still editable in the agency
  dashboard), `HouseAndLandPackage`, `BestDeal`, and the saved-property rows
  behind `/api/properties/[id]/saved`. Only the public pages are gone. The
  services that read these tables are kept too (`property-service`,
  `house-and-land-service`, `best-deal-service`).
- `EnquiryForm` is kept because `/contact` and the agent contact section use
  it.

## What changed

**Deleted routes:** `src/app/(marketing)/{buy,rent,sold,off-market,house-and-land,best-deals}/`,
including the dedicated `sitemap.ts` in `buy`, `rent`, `sold`, `house-and-land`
and `best-deals`, and `src/app/(marketing)/suburbs/[slug]/{buy,rent,houses,units,townhouses,land}/`.

**Deleted components** (each one was only imported by a deleted route, or was
already unused and linked a retired route): `property/{OffMarketTeaser,
HouseLandCard, PropertyFilters, PropertyGallery, PropertyDescriptionExpand,
PropertyFAQs, PropertySchoolTabs, AgentSidebarCard, PropertyEnquireModal,
RevealPhone, PropertyActions, PropertyMap}.tsx`, `forms/OffMarketRegisterForm.tsx`,
`best-deal/` (the whole folder), `home/{FeaturedListings,HeroSearch}.tsx`. The
barrel files were updated to match. `PropertyCard`, `PropertyGrid`,
`FilteredPropertyGrid` and `EnquiryForm` are kept because other pages still
import them.

**Sitemaps:** the listing URLs are out of `pages/sitemap.ts`. The listing
child sitemaps and the house-and-land stock gate are out of the sitemap index.
The six listing types are out of `suburbs/subpages/sitemap.ts`, which now
serves `schools`, `rental-market` and `agents`. `buy`, `sold` and
`house-and-land` are out of the IndexNow seed list
(`scripts/seed-bing-indexnow.cjs`).

**Suburb sub-page links:** `src/lib/suburb-subpages.ts` now reports the six
listing sub-pages as never available, typed `false`.
`getSuburbSubpageAvailability` no longer queries the `Property` table. As a
result the guarded listing links on the suburb profile and the rental-market
page draw nothing, and neither page needed an edit. The listing columns are
out of `SuburbContextualLinks`. The rental listings link is out of
`RentalMarketSections` and `RentalMarketAllDwellings`, and the "Are there
properties for rent" FAQ and listings section are out of
`buildRentalMarket`, since the rentals tab they pointed to is gone. The
schools page now links the profile.

**Internal links, pointed straight at the redirect target or at a better page:**

| Where | Was | Now |
|---|---|---|
| `/site-map` | Listings section (5 links) | Section removed. "Buying: where to start" (`/buying`) added to the persona hubs |
| `/data` | `/sold`, `/buy`, `/house-and-land` | `/suburbs`; the two listing-count rows now have no link |
| `/agents` placeholder | `/sold` "See recently sold properties" | `/suburbs` "See suburb sale prices" |
| `/states/[state]` | `/buy?state=` "Properties for Sale" | `/buying` "Buying in {state}" |
| `/market-reports/[state]` | `/buy?state=` "Browse listings" | `/buying` "Buying: where to start" |
| `/real-estate-agencies/[slug]` | `/buy?agency=` "View all listings" | Removed |
| `/property-valuation` | `/sold` "sold listings" | `/suburbs` "suburb pages" |
| Four guides (Sydney vs Melbourne, best time to buy, Brisbane suburbs for families, house vs apartment) | `/sold` "recently sold" | `/suburbs` "suburb page(s)" |
| How to sell a house guide | `/off-market` | `/guides/auction-vs-private-treaty#hybrids` |
| Buyer's agent cost guide, related card | `/off-market` | `/guides/understanding-off-market-properties` |
| `BlogGuideRail` (off-market post) | `/off-market` | `/guides/auction-vs-private-treaty#hybrids` |
| Blog: house and land packages | `/house-and-land` | `/buying` |
| Blog: off-market properties | `/off-market` "register your interest" | Sentence dropped (the register is gone) |
| Blogs: building approvals, NSW building reforms | `/house-and-land` | `/guides/house-and-land-packages-are-they-worth-it` |
| Property developer leads page, sources list | `/house-and-land` | Row removed |
| `PropertyCard` | `/buy/`, `/rent/`, `/sold/[slug]` | `/buying`, `/guides`, or the listing's suburb profile (`listingCardHref`) |
| Dashboard listing editor | "View listing" link to `/buy/[slug]` | Removed |
| `hub-guides.ts` | `/house-and-land` hub list | Removed |

The blog posts render from the bundled `src/lib/data/blog-posts`, so the
link changes ship with the deploy. Run `npm run publish:blogs` only to bring
the DB mirror up to date.

## Follow-ups for other owners

- **Layout (header, footer, `MobileBottomNav`):** at audit time, the header's
  buying-path list (`Header.tsx`) and `MobileBottomNav.tsx` included `/buy`.
  The layout rewrite has since removed both. Only `/search` (kept) is still
  linked. Re-check after the rewrite lands.
- **Suburb profile:** the "Properties in {suburb}" grid still renders legacy
  `Property` rows (13 suburbs had any on 29 Sep 2026). Region, school and
  agency pages do the same. The cards now link to `/buying`, `/guides` or the
  suburb. Decide whether to drop these grids. The profile also keeps five
  listing buttons behind `availability.*` flags that are now always false;
  that dead code can be removed in the profile's next edit.
- **Property developer leads page** (`/real-estate-leads/property-developer-leads`):
  its copy still sells a house-and-land listing model ("your packages sit in
  the house-and-land section they browse"). That section no longer exists.
  The offer needs a rewrite or retirement.
- **Dead code left in place** because it sits in shared files: the
  `suburbBuy*` and `suburbRent*` SEO helpers and `propertyTitle` and
  `propertyDescription` in `src/lib/utils/seo.ts` (only tests use them now);
  `getOffMarketProperties`, `getPropertySitemapEntries` and
  `getSuburbListingInventory` in `property-service`; the house-and-land hub
  helpers in `house-and-land-indexability.ts`; and the components that were
  already unused, `PropertyInterestForm`, `PropertyMobileCTA` and
  `PropertyPriceChart`.
