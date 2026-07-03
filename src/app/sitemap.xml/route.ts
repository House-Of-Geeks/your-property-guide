import { SITE_URL } from "@/lib/constants";
import { SUBPAGE_TYPES } from "@/app/(marketing)/suburbs/subpages/sitemap";

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
  `${SITE_URL}/house-and-land/sitemap.xml`,
  `${SITE_URL}/suburbs/sitemap.xml`,
  `${SITE_URL}/agents/sitemap.xml`,
  `${SITE_URL}/real-estate-agencies/sitemap.xml`,
  `${SITE_URL}/guides/sitemap.xml`,
  `${SITE_URL}/schools/sitemap.xml`,
  `${SITE_URL}/postcodes/sitemap.xml`,
  `${SITE_URL}/states/sitemap.xml`,
  `${SITE_URL}/best-suburbs/sitemap.xml`,
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

export async function GET() {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...[...SINGLE_PAGE_SITEMAPS, ...SUBURB_SUBPAGE_SITEMAPS].map(
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
