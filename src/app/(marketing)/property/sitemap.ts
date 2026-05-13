// force-dynamic + unstable_cache, sitemap.ts files are cached as static
// by default in Next 16; combined with the build-phase-empty guard, that
// baked an empty sitemap that never regenerated. force-dynamic guarantees
// runtime execution; unstable_cache keeps the heavy DB aggregation to once
// per day per cache key. See /suburbs/sitemap.ts for the original diagnosis.
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";

const PAGE_SIZE = 50_000;

// Deterministic state order, never change this or IDs will shift
const STATE_ORDER = ["ACT", "NSW", "NT", "OT", "QLD", "SA", "TAS", "VIC", "WA"];

type SitemapEntry = { state: string; page: number };

// Sitemap only emits addresses with at least one PropertySale, signalled
// by the denormalised `saleCount` column on PropertyAddress (maintained
// by sales-{state} sync workers post-ingest). Of ~15.6M G-NAF rows, only
// ~858K (5.5%) have sale records — the rest get noindex'd at the page
// level (see /property/[slug]/page.tsx generateMetadata).
//
// Using the denormalised column instead of an EXISTS subquery means the
// sitemap regeneration is a simple indexed column scan rather than a
// JOIN against an 800K-row child table. Same set of addresses, faster
// build.
//
// Trade-off: a ~1% sync-worker drift exists (9,126 addresses with
// PropertySale records but saleCount=0). Those drop from the sitemap
// until the next ingest run brings saleCount back into sync. Acceptable.
//
// Cache key bumped to :v4 so the old cached index is invalidated.
const ADDRESS_WITH_DATA_FILTER = `
  ("suburbSlug" IS NOT NULL) AND ("saleCount" > 0)
`;

// 24h-cached lookup of how the property sitemaps paginate. Used both by
// generateSitemaps (to enumerate IDs) and the default function (to map
// id → state+page).
const getSitemapIndex = unstable_cache(
  async (): Promise<SitemapEntry[]> => {
    const counts = await db.$queryRaw<{ state: string; cnt: bigint }[]>`
      SELECT state, COUNT(*) AS cnt
      FROM "PropertyAddress"
      WHERE "suburbSlug" IS NOT NULL AND "saleCount" > 0
      GROUP BY state
    `;
    const countMap = new Map(counts.map((r) => [r.state, Number(r.cnt)]));

    const index: SitemapEntry[] = [];
    for (const state of STATE_ORDER) {
      const count = countMap.get(state) ?? 0;
      if (count === 0) continue;
      const pages = Math.ceil(count / PAGE_SIZE);
      for (let page = 0; page < pages; page++) {
        index.push({ state, page });
      }
    }
    return index;
  },
  ["sitemap-property-index:v4"],
  { revalidate: 86400, tags: ["sitemap-property"] },
);

// Raw SQL paged fetch with the same data-signal filter as the index. Kept
// as a $queryRaw so the WHERE clause stays in lockstep with the counts.
const getPagedEntries = unstable_cache(
  async (state: string, page: number): Promise<MetadataRoute.Sitemap> => {
    const offset = page * PAGE_SIZE;
    const rows = await db.$queryRawUnsafe<{ slug: string; updatedAt: Date }[]>(
      `
        SELECT slug, "updatedAt"
        FROM "PropertyAddress"
        WHERE state = $1
          AND ${ADDRESS_WITH_DATA_FILTER}
        ORDER BY "suburbSlug" ASC, id ASC
        LIMIT $2 OFFSET $3
      `,
      state,
      PAGE_SIZE,
      offset,
    );
    return rows.map((a) => ({
      url: `${SITE_URL}/property/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));
  },
  ["sitemap-property-page:v4"],
  { revalidate: 86400, tags: ["sitemap-property"] },
);

export async function generateSitemaps() {
  const index = await getSitemapIndex();
  return index.map((_, id) => ({ id }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const index = await getSitemapIndex();
  const entry = index[id];
  if (!entry) return [];
  return getPagedEntries(entry.state, entry.page);
}
