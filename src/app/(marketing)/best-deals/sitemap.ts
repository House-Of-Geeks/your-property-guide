import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";

// Force-dynamic because the set of live deals changes daily as new ones
// are approved and old ones expire. Cached at the CDN edge by Next via
// the route's revalidate header rather than per-request.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  // Resilience: the BestDeal table may not exist yet in this environment
  // (schema can ship before db push). Falling back to an empty deal list
  // returns just the /best-deals index URL rather than 500-ing the
  // sitemap. Once the table exists this query starts returning data
  // automatically on the next revalidation window.
  let live: { id: string; updatedAt: Date }[] = [];
  try {
    live = await db.bestDeal.findMany({
      where: {
        status: "live",
        AND: [
          { OR: [{ publishAt: null }, { publishAt: { lte: now } }] },
          { expiresAt: { gt: now } },
        ],
      },
      select: { id: true, updatedAt: true },
      orderBy: { publishAt: "desc" },
      take: 1000,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!/relation .* does not exist|table .* not found|P2021/i.test(msg)) {
      throw err;
    }
  }

  return [
    {
      url: `${SITE_URL}/best-deals`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...live.map((d) => ({
      url: `${SITE_URL}/best-deals/${d.id}`,
      lastModified: d.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
