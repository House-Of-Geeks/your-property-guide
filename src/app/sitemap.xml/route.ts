import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";

// Next 16's generateSitemaps emits URLs at /{path}/sitemap/{id}.xml — not
// /{path}/sitemap.xml — so the root sitemap-index needs to enumerate each
// {id} explicitly. Cached for 24h so the count queries don't run on every
// crawler hit.

export const dynamic = "force-dynamic";

const PROPERTY_PAGE_SIZE  = 50_000;
const STREETS_PAGE_SIZE   = 50_000;

const getPropertySitemapCount = unstable_cache(
  async (): Promise<number> => {
    const result = await db.$queryRaw<{ cnt: bigint }[]>`
      SELECT state, COUNT(*) AS cnt
      FROM "PropertyAddress"
      WHERE "suburbSlug" IS NOT NULL
      GROUP BY state
    `;
    let pages = 0;
    for (const row of result) {
      pages += Math.ceil(Number(row.cnt) / PROPERTY_PAGE_SIZE);
    }
    return pages;
  },
  ["sitemap-index-property-count:v1"],
  { revalidate: 86400, tags: ["sitemap-property"] },
);

const getStreetsSitemapCount = unstable_cache(
  async (): Promise<number> => {
    const result = await db.$queryRaw<{ cnt: bigint }[]>`
      SELECT COUNT(*) AS cnt FROM (
        SELECT DISTINCT "suburbSlug", "streetName", "streetType", "streetSuffix"
        FROM "PropertyAddress"
        WHERE "suburbSlug" IS NOT NULL AND "streetName" IS NOT NULL
      ) t
    `;
    const total = Number(result[0]?.cnt ?? 0);
    return Math.ceil(total / STREETS_PAGE_SIZE);
  },
  ["sitemap-index-streets-count:v1"],
  { revalidate: 86400, tags: ["sitemap-streets"] },
);

// Single-page sitemaps — Next emits these directly at /{path}/sitemap.xml.
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
  `${SITE_URL}/compare/sitemap.xml`,
];

export async function GET() {
  // Paginated child sitemaps need to be enumerated so each page is reachable.
  // Bound by max in case the count query somehow returns absurd values.
  const [propertyPages, streetsPages] = await Promise.all([
    getPropertySitemapCount().catch(() => 0),
    getStreetsSitemapCount().catch(() => 0),
  ]);

  const paginated: string[] = [];
  for (let i = 0; i < Math.min(propertyPages, 1_000); i++) {
    paginated.push(`${SITE_URL}/property/sitemap/${i}.xml`);
  }
  for (let i = 0; i < Math.min(streetsPages, 1_000); i++) {
    paginated.push(`${SITE_URL}/suburbs/streets/sitemap/${i}.xml`);
  }

  const all = [...SINGLE_PAGE_SITEMAPS, ...paginated];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...all.map((url) => `  <sitemap><loc>${url}</loc></sitemap>`),
    "</sitemapindex>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
