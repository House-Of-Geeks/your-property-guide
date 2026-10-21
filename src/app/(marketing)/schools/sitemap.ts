// force-dynamic + unstable_cache, see /suburbs/sitemap.ts.
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { getAllSchoolsForSitemap } from "@/lib/services/school-service";
import { SITE_URL } from "@/lib/constants";

export type SchoolSitemapLink = { url: string; title: string };

const getEntries = unstable_cache(
  async (): Promise<SchoolSitemapLink[]> => {
    const schools = await getAllSchoolsForSitemap();
    return schools.map((school) => ({
      url: `${SITE_URL}/schools/${school.slug}`,
      title: school.name.trim() || school.slug,
    }));
  },
  // v2: titles travel with the URL so the HTML sitemap cannot invent a
  // different school list. v1 cached URLs only.
  ["sitemap-schools:v2"],
  { revalidate: 86400, tags: ["sitemap-schools"] },
);

export async function getSchoolSitemapLinks(): Promise<SchoolSitemapLink[]> {
  return getEntries();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const links = await getEntries();
  return links.map(({ url }) => ({
    url,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));
}
