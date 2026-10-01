// Whether /house-and-land and its package pages are indexable, and whether
// the sitemaps submit them. One rule, hasHouseAndLandStock, read from one
// cached count (getLiveHouseAndLandPackageCount in
// src/lib/services/house-and-land-service.ts) by the hub's metadata, the
// package pages' metadata, /house-and-land/sitemap.xml and the sitemap index,
// so the sitemaps list exactly what the pages declare and both change on the
// same request. Pure; tested in tests/seo/house-and-land-indexability.test.ts.
//
// Why (commercial intent review, 30 Sep 2026, section 3.7): Search Console
// reported /house-and-land as "Crawled, currently not indexed". The site
// holds no house-and-land stock (0 rows in HouseAndLandPackage in production
// on 1 Oct 2026), so the hub rendered about 36 words around "0 new packages"
// while it was indexable and submitted in two sitemaps. Searchers for "house
// and land packages brisbane" (3,600 a month) and "qld" (390) would have found
// nothing on it. The page now says plainly that nothing is listed, answers
// noindex, follow, and stays out of every sitemap until a package exists;
// the first package makes it indexable and puts it back in the sitemaps with
// no code change.
//
// A live package is a row in HouseAndLandPackage: the table has no status
// column, and the package page renders any row that exists and answers 404
// for any slug that does not. So while there is no stock there are no
// package pages to submit, and a package page that exists is indexable
// unless the cached count has not caught up with it yet (then it follows the
// hub until the cache turns over).

/** Packages the hub needs before it is indexable. One card is a listing; none is an empty page. */
export const MIN_LIVE_PACKAGES = 1;

/** The rule itself: the pages and the sitemaps all call this. */
export function hasHouseAndLandStock(livePackages: number): boolean {
  return Number.isFinite(livePackages) && livePackages >= MIN_LIVE_PACKAGES;
}

/** What a house-and-land page answers while there is no stock: keep it out of the index, follow its links. */
export const NO_STOCK_ROBOTS = { index: false, follow: true } as const;

/** Metadata `robots` for a house-and-land page: noindex, follow without stock; unset (the site default) with it. */
export function houseAndLandRobots(livePackages: number): typeof NO_STOCK_ROBOTS | undefined {
  return hasHouseAndLandStock(livePackages) ? undefined : NO_STOCK_ROBOTS;
}

/** The hub's meta description while nothing is listed: says so, and names what the page links to instead. */
export const NO_STOCK_DESCRIPTION =
  "No house and land packages are listed right now. Guides to buying a package, checking a builder, the First Home Owner Grant and stamp duty on a new home.";

/** The house-and-land sitemap, listed in the sitemap index only while there is stock. */
export const HOUSE_AND_LAND_SITEMAP_PATH = "/house-and-land/sitemap.xml";

/**
 * Cache window for the count, and its tag. An hour, so the first package
 * reaches the hub and the sitemaps within the hour; POST /api/revalidate
 * with this tag flushes it at once. Every reader is dynamic (the hub reads
 * searchParams, the package pages have no generateStaticParams, the sitemaps
 * are force-dynamic), so the hour shortens no ISR window. Do not read the
 * count inside a page with a longer ISR window (the weekly suburb pages):
 * it would shorten that page's window to an hour.
 */
export const STOCK_CACHE_SECONDS = 3600;
export const STOCK_CACHE_TAG = "house-and-land-stock";
