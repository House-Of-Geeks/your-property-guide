import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getPropertyListingSlugs } from "@/lib/services/property-service";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Skip at build time — runtime DB isn't reachable during `next build` and
  // the `revalidate` window will populate this on the first crawler hit.
  if (process.env.NEXT_PHASE === "phase-production-build") return [];
  const properties = await getPropertyListingSlugs("rent");
  return properties.map((p) => ({
    url: `${SITE_URL}/rent/${p.slug}`,
    lastModified: p.dateAdded,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));
}
