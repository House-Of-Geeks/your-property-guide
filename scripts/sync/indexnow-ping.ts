/**
 * IndexNow ping for freshly-synced suburbs.
 *
 * Runs as the final step of the cron sync scripts (see scripts/cron/*.sh):
 * finds Suburb rows touched since the cutoff, and submits their suburb +
 * postcode URLs to IndexNow so participating engines (Bing, Yandex, etc.)
 * recrawl updated data promptly instead of on their own schedule.
 *
 * Deliberately non-fatal: a ping failure or a missing INDEXNOW_KEY must
 * never fail a sync run — data lands regardless, engines just find it later.
 *
 * Usage: npx tsx scripts/sync/indexnow-ping.ts [window-hours]
 *   window-hours defaults to 48 (long enough to cover a full quarterly run).
 */
import "dotenv/config";
import { prisma } from "./db";
import { submitToIndexNow } from "../../src/lib/indexnow";

const BASE = "https://www.yourpropertyguide.com.au";

// One IndexNow request accepts 10k URLs; stay inside a single request per
// run. A quarterly sync touches most of the ~15k suburbs, so we prioritise
// suburb pages by recency and log what gets dropped — a truncated ping is
// fine (sitemaps still cover everything), a silent one is not.
const MAX_URLS = 10_000;

async function main(): Promise<void> {
  if (!process.env.INDEXNOW_KEY) {
    console.log("indexnow-ping: INDEXNOW_KEY not set — skipping (non-fatal)");
    return;
  }

  const windowHours = Number.parseInt(process.argv[2] ?? "48", 10);
  const cutoff = new Date(Date.now() - windowHours * 60 * 60 * 1000);

  const changed = await prisma.suburb.findMany({
    where: { updatedAt: { gte: cutoff } },
    select: { slug: true, postcode: true },
    orderBy: { updatedAt: "desc" },
  });

  if (changed.length === 0) {
    console.log(`indexnow-ping: no suburbs updated in the last ${windowHours}h — nothing to submit`);
    return;
  }

  const urls: string[] = [];
  const postcodes = new Set<string>();
  for (const s of changed) {
    urls.push(`${BASE}/suburbs/${s.slug}`);
    postcodes.add(s.postcode);
  }
  for (const pc of postcodes) urls.push(`${BASE}/postcodes/${pc}`);

  const submitting = urls.slice(0, MAX_URLS);
  if (urls.length > MAX_URLS) {
    console.log(
      `indexnow-ping: ${urls.length} candidate URLs exceeds the ${MAX_URLS} cap — submitting the ${MAX_URLS} most recently updated; the rest stay covered by sitemaps`,
    );
  }

  try {
    const { submitted } = await submitToIndexNow(submitting);
    console.log(
      `indexnow-ping: submitted ${submitted} URLs (${changed.length} suburbs updated in last ${windowHours}h, ${postcodes.size} postcodes)`,
    );
  } catch (err) {
    // Non-fatal by design — log loudly, exit 0.
    console.error("indexnow-ping: submission failed (non-fatal):", err);
  }
}

main()
  .catch((err) => {
    // Even unexpected errors must not fail the sync pipeline.
    console.error("indexnow-ping: unexpected error (non-fatal):", err);
  })
  .finally(() => prisma.$disconnect());
