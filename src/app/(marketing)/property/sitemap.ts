// force-dynamic + unstable_cache — sitemap.ts files are cached as static
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

// Deterministic state order — never change this or IDs will shift
const STATE_ORDER = ["ACT", "NSW", "NT", "OT", "QLD", "SA", "TAS", "VIC", "WA"];

type SitemapEntry = { state: string; page: number };

// 24h-cached lookup of how the property sitemaps paginate. Used both by
// generateSitemaps (to enumerate IDs) and the default function (to map
// id → state+page).
const getSitemapIndex = unstable_cache(
  async (): Promise<SitemapEntry[]> => {
    const counts = await db.$queryRaw<{ state: string; cnt: bigint }[]>`
      SELECT state, COUNT(*) AS cnt
      FROM "PropertyAddress"
      WHERE "suburbSlug" IS NOT NULL
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
  ["sitemap-property-index:v1"],
  { revalidate: 86400, tags: ["sitemap-property"] },
);

const getPagedEntries = unstable_cache(
  async (state: string, page: number): Promise<MetadataRoute.Sitemap> => {
    const addresses = await db.propertyAddress.findMany({
      where: { state, suburbSlug: { not: null } },
      select: { slug: true, updatedAt: true },
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
      // Order by suburbSlug so crawlers receive URLs clustered by suburb.
      // Most crawlers process the sitemap roughly in order, letting the
      // suburb-data cache (property-page-suburb-cache.ts) serve cached
      // answers instead of re-querying the DB per property.
      orderBy: [{ suburbSlug: "asc" }, { id: "asc" }],
    });

    return addresses.map((a) => ({
      url: `${SITE_URL}/property/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));
  },
  ["sitemap-property-page:v1"],
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
