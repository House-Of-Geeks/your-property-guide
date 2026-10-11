// The best-suburbs city editions, /best-suburbs/{category}/{city}: only the
// ones with ten suburbs to show on a measure that ranks (not the walkable
// editions while the walk score ties at 100). The page answers noindex for
// the rest, and both read one predicate (isCityEditionIndexable,
// src/lib/city-editions.ts) from one query (getIndexableCityEditions), so the
// sitemap lists exactly what the pages declare. The state list stays in ../sitemap.ts, which needs no
// database; this one does, so it is force-dynamic + unstable_cache like the
// regions sitemap.
export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { cityEditionPath } from "@/lib/city-editions";
import { getIndexableCityEditions } from "@/lib/services/city-rankings-service";

// No lastModified: a per-request date makes lastmod meaningless to crawlers.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const editions = await getIndexableCityEditions();
  return editions.map((e) => ({
    url: `${SITE_URL}${cityEditionPath(e.category, e.citySlug)}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
}
