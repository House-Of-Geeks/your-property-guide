import { SITE_URL } from "@/lib/constants";
import { SUBPAGE_TYPES } from "@/app/(marketing)/suburbs/subpages/sitemap";
import { HOUSE_AND_LAND_SITEMAP_PATH, hasHouseAndLandStock } from "@/lib/house-and-land-indexability";
import { getLiveHouseAndLandPackageCount } from "@/lib/services/house-and-land-service";

// Next 16's generateSitemaps emits URLs at /{path}/sitemap/{id}.xml, not
// /{path}/sitemap.xml, so the root sitemap-index needs to enumerate each
// {id} explicitly when sub-sitemaps are paginated.

export const dynamic = "force-dynamic";

// Single-page sitemaps, Next emits these directly at /{path}/sitemap.xml.
// (Most are now force-dynamic + unstable_cache; see each file's comment.)
const SINGLE_PAGE_SITEMAPS = [
  `${SITE_URL}/pages/sitemap.xml`,
  `${SITE_URL}/regions/sitemap.xml`,
  `${SITE_URL}/buy/sitemap.xml`,
  `${SITE_URL}/rent/sitemap.xml`,
  `${SITE_URL}/sold/sitemap.xml`,
  // house-and-land: listed by houseAndLandSitemaps() below, only with stock.
  `${SITE_URL}/suburbs/sitemap.xml`,
  // agents + real-estate-agencies sitemaps pulled while the directory is
  // paused (placeholder profiles only, noindexed) per Andy, 2026-07-03.
  `${SITE_URL}/guides/sitemap.xml`,
  `${SITE_URL}/schools/sitemap.xml`,
  `${SITE_URL}/postcodes/sitemap.xml`,
  `${SITE_URL}/states/sitemap.xml`,
  `${SITE_URL}/best-suburbs/sitemap.xml`,
  `${SITE_URL}/best-suburbs/cities/sitemap.xml`,
  `${SITE_URL}/best-deals/sitemap.xml`,
  `${SITE_URL}/compare/sitemap.xml`,
  `${SITE_URL}/glossary/sitemap.xml`,
  `${SITE_URL}/market-reports/sitemap.xml`,
  `${SITE_URL}/property-market/sitemap.xml`,
];

// Paginated via generateSitemaps: suburbs/subpages/sitemap.ts splits the
// suburb intent sub-pages by type to stay under the 50k-URL-per-sitemap
// limit.
const SUBURB_SUBPAGE_SITEMAPS = SUBPAGE_TYPES.map(
  (type) => `${SITE_URL}/suburbs/subpages/sitemap/${type}.xml`,
);

// The house-and-land sitemap is empty while the site holds no package (the
// hub answers noindex then), so the index lists it only with stock, from the
// same cached count the hub reads (src/lib/house-and-land-indexability.ts).
// If the count cannot be read it is left out: the index still answers, and
// the next request tries again.
async function houseAndLandSitemaps(): Promise<string[]> {
  try {
    return hasHouseAndLandStock(await getLiveHouseAndLandPackageCount())
      ? [`${SITE_URL}${HOUSE_AND_LAND_SITEMAP_PATH}`]
      : [];
  } catch (err) {
    console.error("[sitemap index] house-and-land stock count failed:", err);
    return [];
  }
}

export async function GET() {
  const houseAndLand = await houseAndLandSitemaps();
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...[...SINGLE_PAGE_SITEMAPS, ...houseAndLand, ...SUBURB_SUBPAGE_SITEMAPS].map(
      (url) => `  <sitemap><loc>${url}</loc></sitemap>`,
    ),
    "</sitemapindex>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
