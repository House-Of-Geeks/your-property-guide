// The best-suburbs city editions, /best-suburbs/{category}/{city}: only the
// ones with ten suburbs to show. The page answers noindex for the rest, and
// both read one predicate (hasCityEdition, src/lib/city-editions.ts) from one
// query (getIndexableCityEditions), so the sitemap lists exactly what the
// pages declare. The state list stays in ../sitemap.ts, which needs no
// database; this one does, so it is force-dynamic + unstable_cache like the
// regions sitemap.
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { cityEditionPath, cityEditionTitle } from "@/lib/city-editions";
import { getIndexableCityEditions } from "@/lib/services/city-rankings-service";
import { getCapitalCity } from "@/lib/utils/metro";

// No lastModified: a per-request date makes lastmod meaningless to crawlers.

export type CityEditionSitemapLink = { url: string; title: string };

export async function getCityEditionSitemapLinks(): Promise<CityEditionSitemapLink[]> {
  const editions = await getIndexableCityEditions();
  return editions.map((edition) => {
    const city = getCapitalCity(edition.citySlug);
    return {
      url: `${SITE_URL}${cityEditionPath(edition.category, edition.citySlug)}`,
      title: city ? cityEditionTitle(edition.category, city) : edition.citySlug,
    };
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const links = await getCityEditionSitemapLinks();
  return links.map(({ url }) => ({
    url,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
}
