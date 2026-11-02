#!/usr/bin/env node
// Rendered-output check: fails on dashes used as punctuation and on unfinished
// copy markers in what a visitor or crawler reads.
//
//   node scripts/check-rendered.mjs                      prerendered pages in .next/server/app,
//                                                        against scripts/check-rendered-baseline.json
//   node scripts/check-rendered.mjs --write-baseline     regenerate the baseline from the build
//   node scripts/check-rendered.mjs --base <url> --paths <a,b,c | @file>
//                                                        fetch live pages, zero tolerance
//
// What is read from a page: its visible text, the values of content=, alt=,
// title=, aria-label= and placeholder= attributes, and the JSON-LD bodies.
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, relative, resolve, dirname, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const APP_DIR = join(ROOT, ".next", "server", "app");
const BASELINE_PATH = join(HERE, "check-rendered-baseline.json");

/** Violation kinds and the pattern for each. */
export const RULES = {
  emDash: /\u2014/g,
  enDash: /\u2013/g,
  todo: /\bTODO\b/g,
  tbc: /\bTBC\b/g,
  tbd: /\bTBD\b/g,
  fixme: /\bFIXME\b/g,
  needs: /\[needs\b/gi,
  loremIpsum: /lorem ipsum/gi,
  placeholder: /\[placeholder/gi,
};

export const KINDS = Object.keys(RULES);

const NAMED_ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  mdash: "\u2014",
  ndash: "\u2013",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  hellip: "…",
};

export function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (whole, body) => {
    if (body[0] === "#") {
      const code = body[1].toLowerCase() === "x" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      try {
        return String.fromCodePoint(code);
      } catch {
        return whole;
      }
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? whole;
  });
}

const JSON_LD_SCRIPT = /<script\b[^>]*\btype\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

function stripScriptsAndStyles(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, "");
}

/** The text a visitor reads: scripts (JSON-LD included) and styles removed, tags removed, entities decoded. */
export function extractVisibleText(html) {
  const text = stripScriptsAndStyles(html).replace(/<[^>]*>/g, " ");
  return decodeEntities(text).replace(/\s+/g, " ").trim();
}

/** Values of content=, alt=, title=, aria-label= and placeholder= attributes, entities decoded. */
export function extractAttributeValues(html) {
  const out = [];
  const body = stripScriptsAndStyles(html);
  const re = /\s(content|alt|title|aria-label|placeholder)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  let m;
  while ((m = re.exec(body)) !== null) out.push(decodeEntities(m[2] ?? m[3] ?? ""));
  return out;
}

function collectStrings(node, out) {
  if (typeof node === "string") out.push(node);
  else if (Array.isArray(node)) node.forEach((n) => collectStrings(n, out));
  else if (node && typeof node === "object") Object.values(node).forEach((n) => collectStrings(n, out));
}

/** Every string inside the JSON-LD bodies (keys are not copy). A body that is not valid JSON is read raw. */
export function extractJsonLd(html) {
  const out = [];
  JSON_LD_SCRIPT.lastIndex = 0;
  let m;
  while ((m = JSON_LD_SCRIPT.exec(html)) !== null) {
    const raw = m[1].trim();
    try {
      collectStrings(JSON.parse(raw), out);
    } catch {
      out.push(raw);
    }
  }
  return out;
}

function countMatches(text, re) {
  const m = text.match(re);
  return m ? m.length : 0;
}

/**
 * Per-kind violation counts for one page of HTML: every kind is present, zero when clean.
 * @param {string} html
 * @returns {Record<string, number>}
 */
export function countViolations(html) {
  const texts = [extractVisibleText(html), ...extractAttributeValues(html), ...extractJsonLd(html)];
  /** @type {Record<string, number>} */
  const counts = {};
  for (const kind of KINDS) counts[kind] = texts.reduce((n, t) => n + countMatches(t, RULES[kind]), 0);
  return counts;
}

/**
 * Kinds where `counts` is above `baseline` (a missing kind or page is a baseline of 0).
 * @param {Record<string, number>} counts
 * @param {Record<string, number>} [baseline]
 * @returns {string[]}
 */
export function exceedsBaseline(counts, baseline = {}) {
  return KINDS.filter((k) => counts[k] > (baseline[k] ?? 0));
}

function nonZero(counts) {
  const out = {};
  for (const k of KINDS) if (counts[k] > 0) out[k] = counts[k];
  return out;
}

function describe(counts) {
  return KINDS.filter((k) => counts[k] > 0)
    .map((k) => `${k}=${counts[k]}`)
    .join(" ");
}

function listHtml(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...listHtml(full));
    else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

export function loadBaseline(path = BASELINE_PATH) {
  if (!existsSync(path)) return {};
  return JSON.parse(readFileSync(path, "utf8"));
}

/** Mode 1: scan the prerendered pages in appDir against the baseline. */
export function scanPrerendered({ appDir = APP_DIR, baseline = loadBaseline() } = {}) {
  const results = [];
  for (const file of listHtml(appDir).sort()) {
    const page = relative(appDir, file).split(sep).join("/");
    const counts = countViolations(readFileSync(file, "utf8"));
    results.push({ page, counts, failed: exceedsBaseline(counts, baseline[page]) });
  }
  return results;
}

/** Parse --paths: a comma list, or @file with one path per line (blank lines and # comments skipped). */
export function parsePaths(spec, readFile = (p) => readFileSync(p, "utf8")) {
  const raw = spec.startsWith("@") ? readFile(spec.slice(1)).split(/\r?\n/) : spec.split(",");
  return raw.map((s) => s.trim()).filter((s) => s && !s.startsWith("#"));
}

/** Mode 2: fetch each path and apply zero tolerance. */
export async function scanUrls(base, paths, fetchImpl = fetch) {
  const results = [];
  for (const path of paths) {
    const url = new URL(path, base.endsWith("/") ? base : `${base}/`).toString();
    try {
      const res = await fetchImpl(url, { redirect: "follow" });
      if (res.status !== 200) {
        results.push({ page: path, status: res.status, counts: null, failed: ["status"] });
        continue;
      }
      const counts = countViolations(await res.text());
      results.push({ page: path, status: 200, counts, failed: KINDS.filter((k) => counts[k] > 0) });
    } catch (err) {
      results.push({ page: path, status: 0, counts: null, failed: ["fetch"], error: String(err?.message ?? err) });
    }
  }
  return results;
}

function argValue(argv, flag) {
  const i = argv.indexOf(flag);
  return i >= 0 ? argv[i + 1] : undefined;
}

export async function main(argv = process.argv.slice(2)) {
  const base = argValue(argv, "--base");
  if (base) {
    const spec = argValue(argv, "--paths");
    if (!spec) {
      console.error("check-rendered: --base needs --paths <comma list or @file>");
      return 1;
    }
    const paths = parsePaths(spec);
    const results = await scanUrls(base, paths);
    for (const r of results) {
      if (r.failed.length === 0) console.log(`ok    ${r.page}`);
      else if (r.counts) console.log(`FAIL  ${r.page}  ${describe(r.counts)}`);
      else console.log(`FAIL  ${r.page}  ${r.error ?? `HTTP ${r.status}`}`);
    }
    const bad = results.filter((r) => r.failed.length > 0);
    if (bad.length > 0) {
      console.error(`check-rendered: ${bad.length} of ${results.length} pages failed`);
      return 1;
    }
    console.log(`check-rendered: ${results.length} pages clean`);
    return 0;
  }

  if (!existsSync(APP_DIR)) {
    console.error(`check-rendered: ${relative(ROOT, APP_DIR)} not found. Run \`next build\` first.`);
    return 1;
  }

  if (argv.includes("--write-baseline")) {
    const results = scanPrerendered({ baseline: {} });
    const baseline = {};
    for (const r of results) if (Object.keys(nonZero(r.counts)).length > 0) baseline[r.page] = nonZero(r.counts);
    writeFileSync(BASELINE_PATH, `${JSON.stringify(baseline, null, 2)}\n`);
    console.log(`check-rendered: baseline written for ${Object.keys(baseline).length} of ${results.length} pages`);
    return 0;
  }

  const results = scanPrerendered();
  const bad = results.filter((r) => r.failed.length > 0);
  for (const r of bad) console.error(`FAIL  ${r.page}  ${r.failed.map((k) => `${k}=${r.counts[k]}`).join(" ")}`);
  if (bad.length > 0) {
    console.error(`check-rendered: ${bad.length} of ${results.length} pages above baseline`);
    return 1;
  }
  console.log(`check-rendered: ${results.length} prerendered pages, none above baseline`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().then((code) => process.exit(code));
}
