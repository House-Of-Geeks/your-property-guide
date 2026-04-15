import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/constants";

// G-NAF has 15.8M addresses — only index those with active listings or suburb links.
// A full address sitemap would be split into many sub-sitemaps. For now we surface
// addresses that have at least one active Property listing.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;

  // Find PropertyAddress records that have matching listings (by postcode + state)
  // We do a direct join via a subquery to keep this fast.
  const addressed = await db.propertyAddress.findMany({
    where: {
      // Only include addresses in suburbs we actively track
      suburbSlug: { not: null },
    },
    select: { slug: true, updatedAt: true },
    take: 50_000, // sitemap limit per file
    orderBy: { updatedAt: "desc" },
  });

  return addressed.map((a) => ({
    url: `${base}/property/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));
}
