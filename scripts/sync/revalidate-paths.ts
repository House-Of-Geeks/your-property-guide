/**
 * On-demand ISR revalidation for freshly-synced suburbs.
 *
 * The suburb-family pages and best-suburbs pages use a 30 day ISR window
 * (SYNC_FED_REVALIDATE_SECONDS), and the "sitemap-compare" and
 * "sitemap-best-suburbs-cities" unstable_cache entries are 30 days too, so
 * this script is the freshness mechanism after each sync. It asks production
 * to invalidate the cached HTML of every suburb touched in the window
 * (profile, rental-market, schools, agents sub-pages) and every postcode page
 * those suburbs belong to, then the aggregate route patterns and the two
 * sitemap cache tags, so the next visitor or crawler sees the new numbers
 * instead of a month-old page.
 * Invalidation is lazy (regenerated on next request), so a big batch does
 * not cause a render storm. Runs before indexnow-ping in the cron scripts.
 *
 * Usage:
 *   npx tsx scripts/sync/revalidate-paths.ts [window-hours]        (default 48)
 *   npx tsx scripts/sync/revalidate-paths.ts --pattern "/schools/[slug]" [--pattern ...]
 *
 * Env: INDEXNOW_KEY (bearer for /api/revalidate); REVALIDATE_TARGET_URL to
 * aim at a preview deployment instead of production. Non-fatal by design.
 */
import "dotenv/config";
import { prisma } from "./db";

const BASE = (process.env.REVALIDATE_TARGET_URL ?? "https://www.yourpropertyguide.com.au").replace(/\/$/, "");
const CHUNK = 500; // /api/revalidate accepts up to 1000 per call
const SUBURB_AGGREGATE_PATTERNS = [
  "/regions/[slug]",
  "/states/[state]",
  "/property-market/[city]",
  "/best-suburbs/[category]",
  "/best-suburbs/[category]/[state]",
  "/suburbs/[slug]/vs/[compareSlug]",
  "/suburbs/[slug]/agents",
  "/api/og/suburb/[slug]",
];
// unstable_cache tags that back the sitemaps; /api/revalidate takes one tag per call.
const SITEMAP_TAGS = ["sitemap-compare", "sitemap-best-suburbs-cities"];

async function post(body: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${BASE}/api/revalidate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.INDEXNOW_KEY}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`/api/revalidate: HTTP ${res.status} ${await res.text()}`);
}

async function main(): Promise<void> {
  if (!process.env.INDEXNOW_KEY) {
    console.log("revalidate-paths: INDEXNOW_KEY not set — skipping (non-fatal)");
    return;
  }
  const args = process.argv.slice(2);
  const patterns = args.flatMap((a, i) => (a === "--pattern" && args[i + 1] ? [args[i + 1]] : []));
  if (patterns.length > 0) {
    await post({ paths: patterns, type: "page" });
    console.log(`revalidate-paths: invalidated route patterns ${patterns.join(", ")}`);
    return;
  }

  const windowHours = Number.parseInt(args[0] ?? "48", 10);
  const cutoff = new Date(Date.now() - windowHours * 60 * 60 * 1000);
  const changed = await prisma.suburb.findMany({
    where: { updatedAt: { gte: cutoff } },
    select: { slug: true, postcode: true },
    orderBy: { updatedAt: "desc" },
  });
  if (changed.length === 0) {
    console.log(`revalidate-paths: no suburbs updated in the last ${windowHours}h — nothing to do`);
    return;
  }
  const paths: string[] = [];
  const postcodes = new Set<string>();
  for (const s of changed) {
    paths.push(`/suburbs/${s.slug}`, `/suburbs/${s.slug}/rental-market`, `/suburbs/${s.slug}/schools`);
    postcodes.add(s.postcode);
  }
  for (const pc of postcodes) paths.push(`/postcodes/${pc}`);

  let sent = 0;
  for (let i = 0; i < paths.length; i += CHUNK) {
    const chunk = paths.slice(i, i + CHUNK);
    await post({ paths: chunk });
    sent += chunk.length;
  }
  console.log(`revalidate-paths: invalidated ${sent} paths (${changed.length} suburbs updated in last ${windowHours}h, ${postcodes.size} postcodes)`);

  // Aggregate pages built from suburb stats are 30 day ISR too. Invalidate
  // their route patterns (lazy, regenerated on next request) so they pick
  // up the new numbers without waiting out the window.
  await post({ paths: SUBURB_AGGREGATE_PATTERNS, type: "page" });
  console.log(`revalidate-paths: invalidated route patterns ${SUBURB_AGGREGATE_PATTERNS.join(", ")}`);

  // The sitemap caches are 30 day unstable_cache entries; expire them by tag.
  // Each tag is its own call and its own try/catch so one failure is non-fatal
  // and does not skip the other.
  for (const tag of SITEMAP_TAGS) {
    try {
      await post({ tag });
      console.log(`revalidate-paths: invalidated cache tag ${tag}`);
    } catch (err) {
      console.error(`revalidate-paths: tag ${tag} failed (non-fatal):`, err);
    }
  }
}

main()
  .catch((err) => {
    // Non-fatal by design — the sync must not fail because a cache purge did.
    console.error("revalidate-paths: failed (non-fatal):", err);
  })
  .finally(() => prisma.$disconnect());
