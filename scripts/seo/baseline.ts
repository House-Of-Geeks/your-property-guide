// R2 of the September 2026 fix review: a dated snapshot of every search signal
// we can pull by API, taken BEFORE a change and again 14 and 28 days after.
//
// Writes docs/seo-baselines/<YYYY-MM-DD>/:
//   summary.md, summary.json            aggregates by source and page template
//   bing-pages.csv, bing-queries.csv     Bing Webmaster page + query stats (sampled rows)
//   clarity-urls.csv                     Clarity sessions/engagement per landing URL
//   gsc/*.csv                            the Search Console export, if a zip is given
//   raw/*.json                           untouched API responses (gitignored)
// and appends one line per run to docs/seo-baselines/api-usage.log.
//
// Usage:
//   npm run seo:baseline                                  # today's snapshot
//   npm run seo:baseline -- --gsc ~/Downloads/<export>.zip
//   npm run seo:baseline -- --no-backlinks                # skip the DataForSEO call (~$0.02)
//   npm run seo:baseline -- --compare 2026-09-05          # deltas vs an earlier snapshot
//   npm run seo:baseline -- --force                       # re-run on a day that already has a folder
//
// Budgets (rule R13): Clarity allows 10 export calls a day and this script uses
// 3, so it refuses to run twice in one day without --force. Bing Webmaster and
// DataForSEO keys come from .env; nothing is hard-coded.
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(__dirname, "..", "..");
const BASE_DIR = path.join(ROOT, "docs", "seo-baselines");
const SITE = "https://yourpropertyguide.com.au/"; // as registered in Bing Webmaster Tools
const HOST = "https://www.yourpropertyguide.com.au";

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(name);
const opt = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const today = new Date().toISOString().slice(0, 10);

type Row = Record<string, string | number>;

// ---------- template classifier (shared with the search review) ----------
export function templateOf(url: string): string {
  const p = url.replace(/^https?:\/\/[^/]+/, "").split("?")[0];
  if (p === "" || p === "/") return "home";
  if (p.startsWith("/suburbs/")) {
    const parts = p.split("/");
    if (parts.length === 3) return "suburb profile";
    if (p.includes("/vs/")) return "suburb vs";
    const last = parts[parts.length - 1];
    if (["rental-market", "schools", "houses", "units", "buy", "rent", "land", "townhouses"].includes(last)) return `suburb ${last}`;
    return "suburb street";
  }
  for (const k of ["/guides/", "/postcodes/", "/schools/", "/best-suburbs", "/compare", "/property-market", "/market-reports", "/glossary", "/regions", "/states"]) {
    if (p.startsWith(k)) return k.replace(/\//g, "");
  }
  if (p.includes("calculator")) return "calculators";
  return "other";
}

// ---------- API clients ----------
async function bing(method: string): Promise<unknown> {
  const key = process.env.BING_WEBMASTER_API_KEY;
  if (!key) throw new Error("BING_WEBMASTER_API_KEY missing from .env");
  const url = `https://ssl.bing.com/webmaster/api.svc/json/${method}?apikey=${key}&siteUrl=${encodeURIComponent(SITE)}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Bing ${method}: HTTP ${r.status}`);
  return (await r.json()).d;
}

async function clarity(query: string): Promise<unknown> {
  const token = process.env.CLARITY_API_TOKEN;
  if (!token) throw new Error("CLARITY_API_TOKEN missing from .env");
  const r = await fetch(`https://www.clarity.ms/export-data/api/v1/project-live-insights?${query}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  if (!r.ok) throw new Error(`Clarity ${query}: HTTP ${r.status}`);
  return r.json();
}

async function backlinks(): Promise<Row | null> {
  const login = process.env.DATAFORSEO_LOGIN, pw = process.env.DATAFORSEO_PASSWORD;
  if (!login || !pw) return null;
  const r = await fetch("https://api.dataforseo.com/v3/backlinks/summary/live", {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from(`${login}:${pw}`).toString("base64"), "Content-Type": "application/json" },
    body: JSON.stringify([{ target: "yourpropertyguide.com.au", internal_list_limit: 1, backlinks_status_type: "live" }]),
  });
  const d = await r.json();
  const x = d?.tasks?.[0]?.result?.[0];
  if (!x) return null;
  return { rank: x.rank, backlinks: x.backlinks, referringDomains: x.referring_domains, referringMainDomains: x.referring_main_domains, cost: d.cost };
}

// ---------- helpers ----------
const bingDate = (s: string) => { const m = /\/Date\((\d+)/.exec(s); return m ? new Date(Number(m[1])).toISOString().slice(0, 10) : ""; };
function csv(rows: Row[], cols: string[]): string {
  const esc = (v: unknown) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n") + "\n";
}
const sum = (rows: Row[], k: string) => rows.reduce((a, r) => a + Number(r[k] || 0), 0);
function byTemplate(rows: Row[], urlKey: string, clicksKey: string, imprKey: string) {
  const agg: Record<string, { pages: number; clicks: number; impressions: number }> = {};
  for (const r of rows) {
    const t = templateOf(String(r[urlKey]));
    agg[t] ??= { pages: 0, clicks: 0, impressions: 0 };
    agg[t].pages += 1; agg[t].clicks += Number(r[clicksKey] || 0); agg[t].impressions += Number(r[imprKey] || 0);
  }
  return Object.fromEntries(Object.entries(agg).sort((a, b) => b[1].clicks - a[1].clicks));
}

// ---------- compare mode ----------
function compare(fromDate: string, toDate: string) {
  const load = (d: string) => JSON.parse(fs.readFileSync(path.join(BASE_DIR, d, "summary.json"), "utf8"));
  const a = load(fromDate), b = load(toDate);
  const line = (label: string, x: number, y: number, fmt = (n: number) => String(Math.round(n))) =>
    console.log(`${label.padEnd(40)} ${fmt(x).padStart(10)} → ${fmt(y).padStart(10)}   ${y - x >= 0 ? "+" : ""}${fmt(y - x)}`);
  console.log(`\n${fromDate} → ${toDate}\n`);
  console.log("Bing, last 28 days");
  line("  clicks", a.bing.last28.clicks, b.bing.last28.clicks);
  line("  impressions", a.bing.last28.impressions, b.bing.last28.impressions);
  line("  5xx (latest crawl-stats day)", a.bing.crawl.code5xx, b.bing.crawl.code5xx);
  line("  in Bing index", a.bing.crawl.inIndex, b.bing.crawl.inIndex);
  console.log("\nBing clicks by template (sampled page stats)");
  for (const t of new Set([...Object.keys(a.bing.byTemplate), ...Object.keys(b.bing.byTemplate)])) line(`  ${t}`, a.bing.byTemplate[t]?.clicks ?? 0, b.bing.byTemplate[t]?.clicks ?? 0);
  console.log("\nClarity sessions by source (3 days)");
  for (const s of new Set([...Object.keys(a.clarity.bySource), ...Object.keys(b.clarity.bySource)])) line(`  ${s || "direct/none"}`, a.clarity.bySource[s] ?? 0, b.clarity.bySource[s] ?? 0);
  console.log("\nClarity sessions by template (3 days)");
  for (const t of new Set([...Object.keys(a.clarity.byTemplate), ...Object.keys(b.clarity.byTemplate)])) line(`  ${t}`, a.clarity.byTemplate[t]?.sessions ?? 0, b.clarity.byTemplate[t]?.sessions ?? 0);
  if (a.backlinks && b.backlinks) { console.log("\nBacklinks"); line("  referring domains", a.backlinks.referringDomains, b.backlinks.referringDomains); }
}

// ---------- main ----------
async function main() {
  const cmp = opt("--compare");
  if (cmp) { compare(cmp, opt("--to") ?? latestSnapshot()); return; }

  const dir = path.join(BASE_DIR, today);
  if (fs.existsSync(path.join(dir, "summary.json")) && !flag("--force")) {
    console.error(`A snapshot for ${today} already exists (${dir}). Clarity allows 10 export calls a day; re-run with --force only if you mean it.`);
    process.exit(1);
  }
  fs.mkdirSync(path.join(dir, "raw"), { recursive: true });
  const usage: string[] = [];
  const save = (name: string, data: unknown) => fs.writeFileSync(path.join(dir, "raw", `${name}.json`), JSON.stringify(data));

  // Search Console export (manual zip from the Performance report), if given.
  const gsc = opt("--gsc");
  if (gsc) {
    fs.mkdirSync(path.join(dir, "gsc"), { recursive: true });
    execFileSync("unzip", ["-o", "-q", gsc, "-d", path.join(dir, "gsc")]);
    console.log("gsc: unpacked", fs.readdirSync(path.join(dir, "gsc")).join(", "));
  }

  // Bing Webmaster (4 calls, no quota of note).
  const rt = (await bing("GetRankAndTrafficStats")) as Array<Record<string, string | number>>; save("bing-rank-traffic", rt); usage.push("bing:GetRankAndTrafficStats");
  const ps = (await bing("GetPageStats")) as Array<Record<string, string | number>>; save("bing-page-stats", ps); usage.push("bing:GetPageStats");
  const qs = (await bing("GetQueryStats")) as Array<Record<string, string | number>>; save("bing-query-stats", qs); usage.push("bing:GetQueryStats");
  const cs = (await bing("GetCrawlStats")) as Array<Record<string, string | number>>; save("bing-crawl-stats", cs); usage.push("bing:GetCrawlStats");

  const traffic = rt.map((x) => ({ date: bingDate(String(x.Date)), clicks: Number(x.Clicks), impressions: Number(x.Impressions) })).sort((a, b) => a.date.localeCompare(b.date));
  const last28 = traffic.slice(-28);
  const pageRows: Row[] = Object.values(ps.reduce<Record<string, Row>>((acc, x) => {
    const u = String(x.Query); const r = (acc[u] ??= { url: u, clicks: 0, impressions: 0, posWeighted: 0 });
    r.clicks = Number(r.clicks) + Number(x.Clicks); r.impressions = Number(r.impressions) + Number(x.Impressions);
    r.posWeighted = Number(r.posWeighted) + Number(x.AvgImpressionPosition) * Number(x.Impressions); return acc;
  }, {})).map((r) => ({ url: r.url, template: templateOf(String(r.url)), clicks: r.clicks, impressions: r.impressions, position: Number(r.impressions) ? (Number(r.posWeighted) / Number(r.impressions)).toFixed(1) : "" }))
    .sort((a, b) => Number(b.clicks) - Number(a.clicks) || Number(b.impressions) - Number(a.impressions));
  const queryRows: Row[] = Object.values(qs.reduce<Record<string, Row>>((acc, x) => {
    const q = String(x.Query).toLowerCase(); const r = (acc[q] ??= { query: q, clicks: 0, impressions: 0, posWeighted: 0 });
    r.clicks = Number(r.clicks) + Number(x.Clicks); r.impressions = Number(r.impressions) + Number(x.Impressions);
    r.posWeighted = Number(r.posWeighted) + Number(x.AvgImpressionPosition) * Number(x.Impressions); return acc;
  }, {})).map((r) => ({ query: r.query, clicks: r.clicks, impressions: r.impressions, position: Number(r.impressions) ? (Number(r.posWeighted) / Number(r.impressions)).toFixed(1) : "" }))
    .sort((a, b) => Number(b.clicks) - Number(a.clicks) || Number(b.impressions) - Number(a.impressions));
  const crawlLatest = cs.map((x) => ({ date: bingDate(String(x.Date)), crawled: Number(x.CrawledPages), inIndex: Number(x.InIndex), code2xx: Number(x.Code2xx), code5xx: Number(x.Code5xx), code4xx: Number(x.Code4xx), errors: Number(x.CrawlErrors) })).sort((a, b) => a.date.localeCompare(b.date)).at(-1)!;

  fs.writeFileSync(path.join(dir, "bing-pages.csv"), csv(pageRows, ["url", "template", "clicks", "impressions", "position"]));
  fs.writeFileSync(path.join(dir, "bing-queries.csv"), csv(queryRows, ["query", "clicks", "impressions", "position"]));

  // Clarity (3 of the 10 daily calls).
  const cTot = (await clarity("numOfDays=3")) as Array<{ metricName: string; information: Row[] }>; save("clarity-totals", cTot); usage.push("clarity:totals");
  const cUrl = (await clarity("numOfDays=3&dimension1=URL")) as Array<{ metricName: string; information: Row[] }>; save("clarity-by-url", cUrl); usage.push("clarity:by-url");
  const cSrc = (await clarity("numOfDays=3&dimension1=Source")) as Array<{ metricName: string; information: Row[] }>; save("clarity-by-source", cSrc); usage.push("clarity:by-source");

  const urlRows: Record<string, Row> = {};
  for (const m of cUrl) for (const x of m.information) {
    const u = String(x.Url ?? x.url ?? ""); if (!u) continue; const r = (urlRows[u] ??= { url: u, template: templateOf(u), sessions: 0, bots: 0, scroll: "", activeSeconds: "", deadClicks: 0, quickBacks: 0 });
    if (m.metricName === "Traffic") { r.sessions = Number(x.totalSessionCount || 0); r.bots = Number(x.totalBotSessionCount || 0); }
    if (m.metricName === "ScrollDepth") r.scroll = Number(x.averageScrollDepth || 0).toFixed(0);
    if (m.metricName === "EngagementTime") r.activeSeconds = Number(x.activeTime || 0).toFixed(0);
    if (m.metricName === "DeadClickCount") r.deadClicks = Number(x.subTotal || 0);
    if (m.metricName === "QuickbackClick") r.quickBacks = Number(x.subTotal || 0);
  }
  const clarityRows = Object.values(urlRows).sort((a, b) => Number(b.sessions) - Number(a.sessions));
  fs.writeFileSync(path.join(dir, "clarity-urls.csv"), csv(clarityRows, ["url", "template", "sessions", "bots", "scroll", "activeSeconds", "deadClicks", "quickBacks"]));
  const bySource: Record<string, number> = {};
  for (const m of cSrc) if (m.metricName === "Traffic") for (const x of m.information) bySource[String(x.Source ?? "")] = Number(x.totalSessionCount || 0);
  const clarityTotals: Row = {};
  for (const m of cTot) { if (m.metricName === "Traffic") Object.assign(clarityTotals, m.information[0]); if (m.metricName === "ScrollDepth") clarityTotals.averageScrollDepth = Number(m.information[0].averageScrollDepth); if (m.metricName === "EngagementTime") clarityTotals.activeTime = Number(m.information[0].activeTime); }
  const clarityByTemplate: Record<string, { pages: number; sessions: number }> = {};
  for (const r of clarityRows) { const t = String(r.template); clarityByTemplate[t] ??= { pages: 0, sessions: 0 }; clarityByTemplate[t].pages += 1; clarityByTemplate[t].sessions += Number(r.sessions); }

  const bl = flag("--no-backlinks") ? null : await backlinks(); if (bl) { save("backlinks-summary", bl); usage.push(`dataforseo:backlinks(${bl.cost})`); }

  const summary = {
    date: today,
    bing: { last28: { from: last28[0]?.date, to: last28.at(-1)?.date, clicks: sum(last28, "clicks"), impressions: sum(last28, "impressions") }, byTemplate: byTemplate(pageRows, "url", "clicks", "impressions"), crawl: crawlLatest, pagesSampled: pageRows.length, queriesSampled: queryRows.length },
    clarity: { window: "3 days", totals: clarityTotals, bySource, byTemplate: Object.fromEntries(Object.entries(clarityByTemplate).sort((a, b) => b[1].sessions - a[1].sessions)) },
    backlinks: bl,
    gscExport: gsc ? path.basename(gsc) : null,
  };
  fs.writeFileSync(path.join(dir, "summary.json"), JSON.stringify(summary, null, 2));

  const md: string[] = [`# SEO baseline — ${today}`, "", `Bing Webmaster, last 28 days (${summary.bing.last28.from} → ${summary.bing.last28.to}): **${summary.bing.last28.clicks} clicks**, ${summary.bing.last28.impressions.toLocaleString()} impressions.`,
    `Bing crawl (${crawlLatest.date}): ${crawlLatest.inIndex.toLocaleString()} in index, ${crawlLatest.crawled} crawled, **${crawlLatest.code5xx} 5xx**, ${crawlLatest.errors} errors.`,
    bl ? `Backlinks (DataForSEO): ${bl.referringDomains} referring domains, ${bl.backlinks} backlinks.` : "Backlinks: skipped.",
    gsc ? `Search Console export: \`gsc/\` (${path.basename(gsc)}).` : "Search Console export: not supplied (use --gsc <zip>).", "",
    "## Bing clicks by template (sampled page stats)", "", "| Template | Pages | Clicks | Impressions |", "|---|---:|---:|---:|",
    ...Object.entries(summary.bing.byTemplate).map(([t, v]) => `| ${t} | ${v.pages} | ${v.clicks} | ${v.impressions} |`), "",
    `## Clarity, 3 days: ${clarityTotals.totalSessionCount} human sessions, ${clarityTotals.totalBotSessionCount} bot sessions, scroll ${Number(clarityTotals.averageScrollDepth || 0).toFixed(0)}%, active ${clarityTotals.activeTime}s`, "",
    "| Source | Sessions |", "|---|---:|", ...Object.entries(bySource).sort((a, b) => b[1] - a[1]).map(([s, n]) => `| ${s || "direct/none"} | ${n} |`), "",
    "| Template | Pages | Sessions |", "|---|---:|---:|", ...Object.entries(summary.clarity.byTemplate).map(([t, v]) => `| ${t} | ${v.pages} | ${v.sessions} |`), "",
    "Files: `bing-pages.csv`, `bing-queries.csv`, `clarity-urls.csv`, `raw/` (gitignored). Compare with `npm run seo:baseline -- --compare <earlier-date>`.", ""];
  fs.writeFileSync(path.join(dir, "summary.md"), md.join("\n"));
  fs.appendFileSync(path.join(BASE_DIR, "api-usage.log"), `${new Date().toISOString()} ${usage.join(" ")}\n`);
  console.log(md.join("\n"));
  console.log(`\nSaved to ${dir}`);
}

function latestSnapshot(): string {
  return fs.readdirSync(BASE_DIR).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort().at(-1)!;
}

main().catch((e) => { console.error(e); process.exit(1); });
