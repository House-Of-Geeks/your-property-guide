import type { MetadataRoute } from "next";
import { getAllSchoolSlugs } from "@/lib/services/school-service";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.NEXT_PHASE === "phase-production-build") return [];
  const slugs = await getAllSchoolSlugs();
  return slugs.map((slug) => ({
    url: `${SITE_URL}/schools/${slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));
}
