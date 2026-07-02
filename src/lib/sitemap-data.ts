import { unstable_cache } from "next/cache";
import { getIndexableSuburbSlugsWithDates } from "@/lib/services/suburb-service";

// Shared suburb-list getter for the suburb sitemap and the eight per-type
// sub-page sitemaps (src/app/(marketing)/suburbs/{,subpages/}sitemap.ts).
// Those routes are force-dynamic (see the comment in each file), so
// unstable_cache is what dedupes crawler hits — and a single cache key here
// means the heavy DB query runs (and its result is stored) at most once per
// 24h across all nine sitemap files, instead of once per file.
export const getIndexableSuburbsForSitemaps = unstable_cache(
  async () => getIndexableSuburbSlugsWithDates(),
  // v2: earlier per-file caches stored differently-shaped payloads under
  // "sitemap-suburbs:v1"; a fresh key avoids reading those stale entries.
  ["sitemap-suburbs:v2"],
  { revalidate: 86400, tags: ["sitemap-suburbs"] },
);
