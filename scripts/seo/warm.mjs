#!/usr/bin/env node
// Post-deploy cache warm-up (fix item 4b, rule R9 of the fix review).
//
// Every deployment starts with an empty on-demand ISR cache (the build is
// deliberately DB-free, commit 460c601, so nothing is prerendered), and the
// first visitor or crawler to each page pays a full render against the
// database.
// This fetches the highest-impression suburb pages (profile, rental-market,
// schools sub-page) at low concurrency so they are cached before a crawl
// wave arrives. Dependency-free on purpose: it runs from a GitHub Action on
// `deployment_status` without `npm ci` (see .github/workflows/warm-after-deploy.yml)
// and by hand with `node scripts/seo/warm.mjs`.
//
//   node scripts/seo/warm.mjs [--count 300] [--concurrency 4] [--base https://www.yourpropertyguide.com.au]
//
// Always exits 0: a failed warm-up must never fail a deploy.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name, dflt) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : dflt; };
const BASE = String(opt("--base", "https://www.yourpropertyguide.com.au")).replace(/\/$/, "");
const COUNT = Number(opt("--count", 300));
const CONCURRENCY = Number(opt("--concurrency", 4));
const TIMEOUT_MS = 25_000;

const list = JSON.parse(fs.readFileSync(path.join(here, "..", "..", "src", "lib", "data", "prebuild-suburbs.json"), "utf8"));
const slugs = list.slugs.slice(0, COUNT);
const urls = slugs.flatMap((s) => [`${BASE}/suburbs/${s}`, `${BASE}/suburbs/${s}/rental-market`, `${BASE}/suburbs/${s}/schools`]);

const counts = { status: {}, cache: {} };
let done = 0;
const started = Date.now();

async function warm(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { headers: { "User-Agent": "YPG-Warm/1.0 (+https://www.yourpropertyguide.com.au)" }, signal: ctrl.signal, redirect: "manual" });
    await res.arrayBuffer(); // drain so the CDN records a complete response
    counts.status[res.status] = (counts.status[res.status] ?? 0) + 1;
    const c = res.headers.get("x-vercel-cache") ?? "-";
    counts.cache[c] = (counts.cache[c] ?? 0) + 1;
  } catch (err) {
    const k = err?.name === "AbortError" ? "timeout" : "error";
    counts.status[k] = (counts.status[k] ?? 0) + 1;
  } finally {
    clearTimeout(t);
    done += 1;
    if (done % 100 === 0) console.log(`warm: ${done}/${urls.length} (${Math.round((Date.now() - started) / 1000)}s)`);
  }
}

async function main() {
  console.log(`warm: ${urls.length} URLs (${slugs.length} suburbs × 3), concurrency ${CONCURRENCY}, base ${BASE}`);
  const queue = [...urls];
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) await warm(queue.shift());
  }));
  console.log(`warm: finished in ${Math.round((Date.now() - started) / 1000)}s`);
  console.log(`warm: status ${JSON.stringify(counts.status)}`);
  console.log(`warm: x-vercel-cache ${JSON.stringify(counts.cache)}`);
}

main().catch((err) => console.error("warm: failed (non-fatal):", err));
