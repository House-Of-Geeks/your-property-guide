// Property sitemap pages are too large to pre-render at build time — render on demand
// and cache for a day. Crawlers re-fetching the index don't need fresher than that, and
// `force-dynamic` was running the full count + paginated query on every single hit.
export const revalidate = 86400;

import { cache } from "react";
import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";

const PAGE_SIZE = 50_000;

// Deterministic state order — never change this or IDs will shift
const STATE_ORDER = ["ACT", "NSW", "NT", "OT", "QLD", "SA", "TAS", "VIC", "WA"];

type SitemapEntry = { state: string; page: number };

const getSitemapIndex = cache(async (): Promise<SitemapEntry[]> => {
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
});

export async function generateSitemaps() {
  // Skip at build time — DB isn't reachable during `next build`. At runtime the
  // first crawler hit will populate the index for the `revalidate` window.
  if (process.env.NEXT_PHASE === "phase-production-build") return [{ id: 0 }];
  const index = await getSitemapIndex();
  return index.map((_, id) => ({ id }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  if (process.env.NEXT_PHASE === "phase-production-build") return [];
  const index = await getSitemapIndex();
  const entry = index[id];
  if (!entry) return [];

  const { state, page } = entry;

  const addresses = await db.propertyAddress.findMany({
    where: { state, suburbSlug: { not: null } },
    select: { slug: true, updatedAt: true },
    skip: page * PAGE_SIZE,
    take: PAGE_SIZE,
    orderBy: { id: "asc" },
  });

  return addresses.map((a) => ({
    url: `${SITE_URL}/property/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));
}
