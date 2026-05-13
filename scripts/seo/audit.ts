// SEO crawl + report. Re-runnable before every content sprint.
//
// Crawls the configured origin breadth-first, capturing per-URL: status,
// title, meta description, canonical, h1 count, internal-link count,
// outbound internal links, and inbound link count. Writes CSV + JSON to
// scripts/seo/reports/.
//
// Usage:
//   npm run seo:audit                          # crawls SITE_URL (or AUDIT_ORIGIN)
//   AUDIT_ORIGIN=http://localhost:3000 npm run seo:audit
//   AUDIT_MAX_PAGES=200 npm run seo:audit
//
// No HTML-parser dependency — regex-extraction is enough for the handful of
// tags we care about. Per repo guardrails: prefer existing utilities, no new
// deps without justification.

import fs from "node:fs";
import path from "node:path";

const ORIGIN = (process.env.AUDIT_ORIGIN || process.env.SITE_URL || "https://www.yourpropertyguide.com.au").replace(/\/$/, "");
const MAX_PAGES = Number(process.env.AUDIT_MAX_PAGES || 500);
const CONCURRENCY = Number(process.env.AUDIT_CONCURRENCY || 8);
const USER_AGENT = "YPG-SEO-Audit/1.0 (+https://www.yourpropertyguide.com.au)";

const TITLE_MIN = 40;
const TITLE_MAX = 65;
const DESC_MIN = 110;
const DESC_MAX = 170;

interface PageReport {
  url: string;
  status: number;
  finalUrl: string;
  contentType: string;
  title: string | null;
  titleLength: number;
  description: string | null;
  descriptionLength: number;
  canonical: string | null;
  canonicalMatchesUrl: boolean;
  h1Count: number;
  internalLinkCount: number;
  outboundLinks: string[];
  inboundLinkCount: number;
  noindex: boolean;
  fetchedAt: string;
  errorMessage: string | null;
  warnings: string[];
}

const visited = new Map<string, PageReport>();
const queue: string[] = [];
const inboundCounts = new Map<string, number>();

function originOf(u: string): string {
  return new URL(u).origin;
}

function normalizeUrl(href: string, fromUrl: string): string | null {
  try {
    const u = new URL(href, fromUrl);
    if (u.origin !== ORIGIN) return null;
    u.hash = "";
    // Strip trailing slash except root
    if (u.pathname.length > 1 && u.pathname.endsWith("/")) u.pathname = u.pathname.slice(0, -1);
    // Skip obvious non-HTML assets
    if (/\.(png|jpe?g|webp|avif|svg|gif|ico|css|js|mjs|woff2?|ttf|otf|map|xml|pdf|zip|csv|json|txt)(\?|$)/i.test(u.pathname)) return null;
    // Skip API + dashboard (matches robots.ts disallow)
    if (u.pathname.startsWith("/api/") || u.pathname.startsWith("/dashboard")) return null;
    return u.toString();
  } catch {
    return null;
  }
}

function extractTag(html: string, regex: RegExp): string | null {
  const m = html.match(regex);
  if (!m) return null;
  return m[1].trim();
}

function extractAll(html: string, regex: RegExp): string[] {
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) out.push(m[1]);
  return out;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

async function fetchPage(url: string): Promise<PageReport> {
  const fetchedAt = new Date().toISOString();
  const base: PageReport = {
    url,
    status: 0,
    finalUrl: url,
    contentType: "",
    title: null,
    titleLength: 0,
    description: null,
    descriptionLength: 0,
    canonical: null,
    canonicalMatchesUrl: false,
    h1Count: 0,
    internalLinkCount: 0,
    outboundLinks: [],
    inboundLinkCount: 0,
    noindex: false,
    fetchedAt,
    errorMessage: null,
    warnings: [],
  };

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      redirect: "follow",
    });
    base.status = res.status;
    base.finalUrl = res.url;
    base.contentType = res.headers.get("content-type") || "";

    if (!res.ok) {
      base.errorMessage = `HTTP ${res.status}`;
      return base;
    }
    if (!base.contentType.includes("text/html")) {
      base.warnings.push("non-html-content");
      return base;
    }

    const html = await res.text();

    const rawTitle = extractTag(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    if (rawTitle) {
      base.title = decodeEntities(rawTitle.replace(/\s+/g, " "));
      base.titleLength = base.title.length;
    }

    const rawDesc = extractTag(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
    if (rawDesc) {
      base.description = decodeEntities(rawDesc);
      base.descriptionLength = base.description.length;
    }

    const rawCanonical = extractTag(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
    if (rawCanonical) {
      try {
        const canon = new URL(rawCanonical, url).toString().replace(/\/$/, (m, i, s) => (s.length > base.finalUrl.length ? m : ""));
        base.canonical = canon;
        const canonNormalized = canon.replace(/\/$/, "");
        const finalNormalized = base.finalUrl.replace(/\/$/, "");
        base.canonicalMatchesUrl = canonNormalized === finalNormalized;
      } catch {
        base.warnings.push("invalid-canonical");
      }
    }

    base.h1Count = (html.match(/<h1\b[^>]*>/gi) || []).length;

    const robotsContent = extractTag(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i);
    if (robotsContent && /noindex/i.test(robotsContent)) base.noindex = true;

    // Extract all hrefs, normalize, dedupe per page
    const hrefs = extractAll(html, /<a\b[^>]+href=["']([^"']+)["']/gi);
    const internal = new Set<string>();
    for (const h of hrefs) {
      const norm = normalizeUrl(h, base.finalUrl);
      if (norm) internal.add(norm);
    }
    base.internalLinkCount = internal.size;
    base.outboundLinks = Array.from(internal);

    // SEO warnings (each becomes a row in the issues report)
    if (!base.title) base.warnings.push("missing-title");
    else if (base.titleLength < TITLE_MIN) base.warnings.push(`title-too-short(${base.titleLength})`);
    else if (base.titleLength > TITLE_MAX) base.warnings.push(`title-too-long(${base.titleLength})`);

    if (!base.description) base.warnings.push("missing-description");
    else if (base.descriptionLength < DESC_MIN) base.warnings.push(`description-too-short(${base.descriptionLength})`);
    else if (base.descriptionLength > DESC_MAX) base.warnings.push(`description-too-long(${base.descriptionLength})`);

    if (!base.canonical) base.warnings.push("missing-canonical");
    else if (!base.canonicalMatchesUrl) base.warnings.push("canonical-mismatch");

    if (base.h1Count === 0) base.warnings.push("missing-h1");
    else if (base.h1Count > 1) base.warnings.push(`multiple-h1(${base.h1Count})`);

    if (base.noindex) base.warnings.push("noindex");
    if (base.internalLinkCount < 8) base.warnings.push(`few-internal-links(${base.internalLinkCount})`);

    return base;
  } catch (err) {
    base.errorMessage = err instanceof Error ? err.message : String(err);
    return base;
  }
}

async function tryFetchSitemap(): Promise<string[]> {
  const out = new Set<string>();
  const seeds = [`${ORIGIN}/sitemap.xml`];
  while (seeds.length) {
    const sm = seeds.shift()!;
    try {
      const res = await fetch(sm, { headers: { "User-Agent": USER_AGENT } });
      if (!res.ok) continue;
      const xml = await res.text();
      // Recurse into nested sitemap indexes
      for (const m of xml.matchAll(/<sitemap>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?<\/sitemap>/g)) {
        seeds.push(m[1]);
      }
      // Collect URL locs
      for (const m of xml.matchAll(/<url>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?<\/url>/g)) {
        const norm = normalizeUrl(m[1], ORIGIN);
        if (norm) out.add(norm);
      }
    } catch {
      // ignore — fallback to BFS crawl from /
    }
  }
  return Array.from(out);
}

async function worker() {
  while (queue.length && visited.size < MAX_PAGES) {
    const url = queue.shift();
    if (!url) return;
    if (visited.has(url)) continue;
    visited.set(url, {} as PageReport);
    const report = await fetchPage(url);
    visited.set(url, report);
    for (const link of report.outboundLinks) {
      inboundCounts.set(link, (inboundCounts.get(link) || 0) + 1);
      if (!visited.has(link) && visited.size + queue.length < MAX_PAGES) queue.push(link);
    }
    process.stdout.write(`\r[audit] crawled ${visited.size}/${MAX_PAGES} queued=${queue.length}   `);
  }
}

function toCsv(rows: PageReport[]): string {
  const cols = [
    "url",
    "status",
    "finalUrl",
    "title",
    "titleLength",
    "description",
    "descriptionLength",
    "canonical",
    "canonicalMatchesUrl",
    "h1Count",
    "noindex",
    "internalLinkCount",
    "inboundLinkCount",
    "warnings",
    "errorMessage",
  ];
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = String(v).replace(/"/g, '""').replace(/\r?\n/g, " ");
    return /[",]/.test(s) ? `"${s}"` : s;
  };
  const lines = [cols.join(",")];
  for (const r of rows) {
    lines.push(
      cols
        .map((c) => {
          if (c === "warnings") return escape(r.warnings.join(";"));
          return escape((r as unknown as Record<string, unknown>)[c]);
        })
        .join(","),
    );
  }
  return lines.join("\n");
}

async function main() {
  console.log(`[audit] origin = ${ORIGIN}`);
  console.log(`[audit] max pages = ${MAX_PAGES}`);

  const sitemapUrls = await tryFetchSitemap();
  console.log(`[audit] sitemap seeded ${sitemapUrls.length} URLs`);

  const seeds = sitemapUrls.length ? sitemapUrls : [ORIGIN];
  for (const s of seeds) queue.push(s);

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  process.stdout.write("\n");

  // Backfill inbound link counts
  const reports = Array.from(visited.values()).filter((r) => r.url);
  for (const r of reports) {
    r.inboundLinkCount = inboundCounts.get(r.url) || 0;
    if (r.inboundLinkCount === 0 && r.url !== ORIGIN) r.warnings.push("orphan");
  }

  reports.sort((a, b) => a.url.localeCompare(b.url));

  const outDir = path.join(process.cwd(), "scripts", "seo", "reports");
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 19);
  const csvPath = path.join(outDir, `audit-${stamp}.csv`);
  const jsonPath = path.join(outDir, `audit-${stamp}.json`);
  fs.writeFileSync(csvPath, toCsv(reports));
  fs.writeFileSync(jsonPath, JSON.stringify(reports, null, 2));

  // Summary
  const errored = reports.filter((r) => r.errorMessage || r.status >= 400);
  const noindex = reports.filter((r) => r.noindex);
  const orphans = reports.filter((r) => r.warnings.includes("orphan"));
  const missingTitle = reports.filter((r) => r.warnings.includes("missing-title"));
  const missingDesc = reports.filter((r) => r.warnings.includes("missing-description"));
  const missingCanonical = reports.filter((r) => r.warnings.includes("missing-canonical"));
  const canonMismatch = reports.filter((r) => r.warnings.includes("canonical-mismatch"));
  const missingH1 = reports.filter((r) => r.warnings.includes("missing-h1"));
  const multipleH1 = reports.filter((r) => r.warnings.some((w) => w.startsWith("multiple-h1")));
  const titleIssues = reports.filter((r) => r.warnings.some((w) => w.startsWith("title-too")));
  const descIssues = reports.filter((r) => r.warnings.some((w) => w.startsWith("description-too")));
  const fewLinks = reports.filter((r) => r.warnings.some((w) => w.startsWith("few-internal-links")));

  console.log("\n=== SEO audit summary ===");
  console.log(`Pages crawled:        ${reports.length}`);
  console.log(`HTTP errors:          ${errored.length}`);
  console.log(`Noindex pages:        ${noindex.length}`);
  console.log(`Orphan pages:         ${orphans.length}`);
  console.log(`Missing title:        ${missingTitle.length}`);
  console.log(`Title length issues:  ${titleIssues.length}`);
  console.log(`Missing description:  ${missingDesc.length}`);
  console.log(`Description length:   ${descIssues.length}`);
  console.log(`Missing canonical:    ${missingCanonical.length}`);
  console.log(`Canonical mismatch:   ${canonMismatch.length}`);
  console.log(`Missing H1:           ${missingH1.length}`);
  console.log(`Multiple H1:          ${multipleH1.length}`);
  console.log(`<8 internal links:    ${fewLinks.length}`);
  console.log(`\nReports written to:`);
  console.log(`  ${path.relative(process.cwd(), csvPath)}`);
  console.log(`  ${path.relative(process.cwd(), jsonPath)}`);

  // Non-zero exit when critical issues are found (use for CI gate)
  const critical = errored.length + missingTitle.length + missingCanonical.length + missingH1.length;
  if (critical > 0) {
    console.log(`\n[audit] ${critical} critical issues found`);
    process.exitCode = 1;
  }
}

main();
