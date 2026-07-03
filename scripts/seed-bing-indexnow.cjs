/**
 * One-shot kick-start: crawls the public sitemap index, gathers URLs from
 * the high-value sub-sitemaps, and pushes them to Bing via /api/indexnow.
 *
 * Skips the property-address sub-sitemap (millions of G-NAF URLs, low per-
 * URL value to Bing — submitting them all is bad PR and probably wasted).
 *
 * Run: node scripts/seed-bing-indexnow.cjs
 *
 * Env required: INDEXNOW_KEY (read from .env). The /api/indexnow route on
 * prod verifies against the same key.
 */
require("dotenv").config({ path: ".env" });

const SITE = "https://www.yourpropertyguide.com.au";
const KEY = process.env.INDEXNOW_KEY;
if (!KEY) {
  console.error("❌ INDEXNOW_KEY not in .env");
  process.exit(1);
}

// Which child sitemaps to submit. Excludes property/sitemap.xml — millions
// of G-NAF address URLs the search engine wouldn't reward us for blasting.
const INCLUDE_CHILDREN = [
  "pages",
  "regions",
  "buy",
  "sold",
  "house-and-land",
  "suburbs",
  "suburbs/streets",
  "agents",
  "real-estate-agencies",
  "guides",
  "schools",
  "postcodes",
  "states",
  "best-suburbs",
  "compare",
  "glossary",
  "market-reports",
  "property-market",
];

const SKIP_CHILDREN = ["property"];

async function fetchText(url) {
  const res = await fetch(url, { headers: { "Accept": "application/xml" } });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return res.text();
}

// Cheap-and-cheerful XML loc extraction. Robust enough for Next-generated
// sitemaps; we don't need a full XML parser.
function extractLocs(xml) {
  const out = [];
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) out.push(m[1]);
  return out;
}

async function gatherUrls() {
  const indexXml = await fetchText(`${SITE}/sitemap.xml`);
  const childSitemaps = extractLocs(indexXml);

  console.log(`Found ${childSitemaps.length} child sitemaps in the index.`);

  const all = new Set();
  for (const child of childSitemaps) {
    const slug = child
      .replace(`${SITE}/`, "")
      .replace("/sitemap.xml", "");

    if (SKIP_CHILDREN.some((s) => slug === s)) {
      console.log(`  skip   ${slug}`);
      continue;
    }
    if (!INCLUDE_CHILDREN.includes(slug)) {
      console.log(`  unknown sitemap, skipping: ${slug}`);
      continue;
    }

    try {
      const xml = await fetchText(child);
      // Some sitemaps are themselves indexes (e.g. when `generateSitemaps`
      // splits a sitemap into pages). Detect and recurse one level.
      const isIndex = /<sitemapindex/i.test(xml);
      if (isIndex) {
        const subChildren = extractLocs(xml);
        let n = 0;
        for (const sc of subChildren) {
          const subXml = await fetchText(sc);
          for (const url of extractLocs(subXml)) {
            all.add(url);
            n++;
          }
        }
        console.log(`  +${String(n).padStart(6)} ${slug} (${subChildren.length} pages)`);
      } else {
        const locs = extractLocs(xml);
        for (const u of locs) all.add(u);
        console.log(`  +${String(locs.length).padStart(6)} ${slug}`);
      }
    } catch (e) {
      console.warn(`  failed ${slug}: ${e.message}`);
    }
  }

  return Array.from(all);
}

async function submitChunk(urls) {
  const res = await fetch(`${SITE}/api/indexnow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${KEY}`,
    },
    body: JSON.stringify({ urls }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`POST /api/indexnow → ${res.status}: ${t.slice(0, 200)}`);
  }
  return res.json();
}

(async () => {
  const urls = await gatherUrls();
  console.log(`\nGathered ${urls.length} URLs in total.\n`);

  // Bing accepts up to 10K per request. Our /api/indexnow route forwards
  // straight to submitToIndexNow which chunks internally. Send in batches
  // of 500 to keep the API-route payload small + memorable for logs.
  const BATCH = 500;
  let submitted = 0;
  for (let i = 0; i < urls.length; i += BATCH) {
    const batch = urls.slice(i, i + BATCH);
    process.stdout.write(`  batch ${i / BATCH + 1} (${batch.length} urls)… `);
    try {
      const j = await submitChunk(batch);
      submitted += j.submitted ?? batch.length;
      console.log("ok");
    } catch (e) {
      console.log(`FAIL: ${e.message}`);
    }
  }

  console.log(`\n✓ Submitted ${submitted} URLs to Bing via IndexNow.`);
})();
