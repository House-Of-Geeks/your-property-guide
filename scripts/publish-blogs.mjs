#!/usr/bin/env node
// One-command blog publisher. Hits the prod /api/admin/sync-blogs endpoint,
// which upserts every post from src/lib/data/blogs.ts into the live DB,
// revalidates affected ISR pages, and pings IndexNow for new URLs.
//
// Usage:
//   npm run publish:blogs                    # default: sync + revalidate + indexnow
//   npm run publish:blogs -- --prune         # also delete posts that exist in DB but not in source
//   npm run publish:blogs -- --no-indexnow   # skip the IndexNow ping
//   PUBLISH_TARGET=preview npm run publish:blogs   # hit a Vercel preview deploy instead
//
// Env required (read from .env):
//   INDEXNOW_KEY            — bearer auth for the admin endpoint
//   PUBLISH_TARGET_URL      — optional override (defaults to https://www.yourpropertyguide.com.au)
//
// Pure-Node script (no tsx, no transpilation) so it runs on machines where
// the project's tsx/esbuild binaries can't be executed (eg this repo lives
// on an external volume that strips +x on shell-launched binaries).

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

function loadEnv() {
  // Minimal .env parser. We deliberately don't depend on `dotenv` so this
  // script can run from any node version without an install step.
  const out = { ...process.env };
  for (const file of [".env", ".env.local"]) {
    try {
      const text = readFileSync(resolve(projectRoot, file), "utf8");
      for (const raw of text.split(/\r?\n/)) {
        const line = raw.trim();
        if (!line || line.startsWith("#")) continue;
        const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/i);
        if (!m) continue;
        let val = m[2];
        // Strip optional matching quotes (handles both `"..."` and `'...'`)
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!(m[1] in out)) out[m[1]] = val;
      }
    } catch {
      // file missing — fine
    }
  }
  return out;
}

const env = loadEnv();

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);

const target = (env.PUBLISH_TARGET_URL || "https://www.yourpropertyguide.com.au").replace(/\/+$/, "");
const key = env.INDEXNOW_KEY;
if (!key) {
  console.error("error: INDEXNOW_KEY missing from .env");
  process.exit(2);
}

const body = {
  prune: flag("--prune"),
  indexnow: !flag("--no-indexnow"),
  revalidate: !flag("--no-revalidate"),
};

console.log(`→ POST ${target}/api/admin/sync-blogs`);
console.log(`  body: ${JSON.stringify(body)}`);

const start = Date.now();
let res;
try {
  res = await fetch(`${target}/api/admin/sync-blogs`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
} catch (err) {
  console.error(`fetch failed: ${err.message}`);
  process.exit(3);
}

const elapsed = ((Date.now() - start) / 1000).toFixed(1);
const text = await res.text();
let data;
try { data = JSON.parse(text); } catch { data = null; }

if (!res.ok || !data?.ok) {
  console.error(`✗ HTTP ${res.status} in ${elapsed}s`);
  console.error(text.slice(0, 1500));
  process.exit(4);
}

const c = data.counts;
console.log(`✓ synced in ${elapsed}s`);
console.log(`  source: ${c.sourceTotal} posts`);
console.log(`  created: ${c.created}${c.created > 0 ? ` (${data.created.join(", ")})` : ""}`);
console.log(`  updated: ${c.updated}`);
if (c.orphanedInDb > 0) {
  console.log(`  orphaned in DB: ${c.orphanedInDb} (${data.orphaned.join(", ")})`);
  if (c.pruned > 0) console.log(`  pruned: ${c.pruned}`);
  else console.log(`     ↳ pass --prune to delete these`);
}
console.log(`  revalidated: ${data.revalidated.length} path${data.revalidated.length === 1 ? "" : "s"}`);
if (data.indexnow?.submitted) {
  console.log(`  indexnow: pinged ${data.indexnow.submitted} URL(s)`);
}
