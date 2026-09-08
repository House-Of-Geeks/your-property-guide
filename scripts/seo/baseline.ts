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
//   npm run seo:baseline -- --no-backlinks                # skip the DataForSEO backlink call (~$0.02)
//   npm run seo:baseline -- --no-serps                    # skip the tracked SERPs (docs/seo-baselines/tracked-queries.json, ~$0.002 each)
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
// Every API call retries on network errors and 4xx/5xx (Bing has answered a
// stray 400 and Clarity has dropped a socket mid-run); the daily folder keeps
// each raw response so a re-run after a failure reuses what it already has
// instead of spending the Clarity quota again.
async function fetchWithRetry(label: string, url: string, init: RequestInit, attempts = 4): Promise<Response> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { ...init, signal: AbortSignal.timeout(90_000) });
      if (res.ok) return res;
      lastErr = new Error(`${label}: HTTP ${res.status}`);
      if (res.status === 401 || res.status === 403) throw lastErr;
    } catch (err) {
      lastErr = err;
    }
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, 3_000 * 2 ** i));
  }
  throw lastErr;
}

let RAW_DIR = "";
async function cached<T>(name: string, call: () => Promise<T>): Promise<T> {
  const file = path.join(RAW_DIR, `${name}.json`);
  if (RAW_DIR && fs.existsSync(file)) { console.log(`${name}: reusing today's saved response`); return JSON.parse(fs.readFileSync(file, "utf8")) as T; }
  const data = await call();
  if (RAW_DIR) fs.writeFileSync(file, JSON.stringify(data));
  return data;
}

async function bing(method: string): Promise<unknown> {
  const key = process.env.BING_WEBMASTER_API_KEY;
  if (!key) throw new Error("BING_WEBMASTER_API_KEY missing from .env");
  const url = `https://ssl.bing.com/webmaster/api.svc/json/${method}?apikey=${key}&siteUrl=${encodeURIComponent(SITE)}`;
  const r = await fetchWithRetry(`Bing ${method}`, url, {});
  return (await r.json()).d;
}

async function clarity(query: string): Promise<unknown> {
  const token = process.env.CLARITY_API_TOKEN;
  if (!token) throw new Error("CLARITY_API_TOKEN missing from .env");
  const r = await fetchWithRetry(`Clarity ${query}`, `https://www.clarity.ms/export-data/api/v1/project-live-insights?${query}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  return r.json();
}

async function backlinks(): Promise<Row | null> {
  const login = process.env.DATAFORSEO_LOGIN, pw = process.env.DATAFORSEO_PASSWORD;
  if (!login || !pw) return null;
  const r = await fetchWithRetry("DataForSEO backlinks", "https://api.dataforseo.com/v3/backlinks/summary/live", {
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
// Tracked SERPs: one DataForSEO live task per query (the API accepts one at
// a time), our best organic rank and URL, the top three domains, and the
// People-also-ask questions. ~$0.002 a query.
interface SerpRow extends Row { query: string; ourRank: number | ""; ourUrl: string; top1: string; top2: string; top3: string; paa: string; cost: number }
async function serps(queries: string[]): Promise<{ rows: SerpRow[]; raw: unknown[]; cost: number }> {
  const login = process.env.DATAFORSEO_LOGIN, password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) throw new Error("DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD missing from .env");
  const auth = Buffer.from(`${login}:${password}`).toString("base64");
  const rows: SerpRow[] = []; const raw: unknown[] = []; let cost = 0;
  for (const keyword of queries) {
    const res = await fetchWithRetry(`DataForSEO SERP ${keyword}`, "https://api.dataforseo.com/v3/serp/google/organic/live/advanced", {
      method: "POST", headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify([{ keyword, location_code: 2036, language_code: "en", device: "desktop", depth: 10 }]),
    });
    const json = (await res.json()) as { tasks?: Array<{ cost?: number; result?: Array<{ items?: Array<Record<string, unknown>> }> }> };
    const task = json.tasks?.[0]; const items = task?.result?.[0]?.items ?? []; raw.push({ keyword, task });
    cost += Number(task?.cost ?? 0);
    const organic = items.filter((x) => x.type === "organic") as Array<{ rank_absolute: number; domain: string; url: string }>;
    const ours = organic.find((x) => String(x.domain).includes("yourpropertyguide"));
    const paa = (items.find((x) => x.type === "people_also_ask") as { items?: Array<{ title: string }> } | undefined)?.items?.map((i) => i.title) ?? [];
    rows.push({ query: keyword, ourRank: ours ? ours.rank_absolute : "", ourUrl: ours?.url ?? "", top1: organic[0]?.domain ?? "", top2: organic[1]?.domain ?? "", top3: organic[2]?.domain ?? "", paa: paa.join(" | "), cost: Number(task?.cost ?? 0) });
    await new Promise((r) => setTimeout(r, 1200));
  }
  return { rows, raw, cost };
}

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
  if (a.bing.crawl.code5xxLast7 !== undefined && b.bing.crawl.code5xxLast7 !== undefined) line("  5xx, last 7 crawl days (sum)", a.bing.crawl.code5xxLast7, b.bing.crawl.code5xxLast7);
  if (a.serps && b.serps) {
    console.log("\nTracked SERPs (Google AU, our best rank; blank = not in the top 10)");
    line("  queries in top 10", a.serps.inTop10, b.serps.inTop10);
    line("  queries in top 3", a.serps.inTop3, b.serps.inTop3);
    const ra: Record<string, number | ""> = a.serps.ranks, rb: Record<string, number | ""> = b.serps.ranks;
    for (const q of Object.keys(rb)) { const x = ra[q], y = rb[q]; if (x !== y) console.log(`  ${q.padEnd(40)} ${String(x === "" || x === undefined ? "–" : x).padStart(4)} → ${String(y === "" ? "–" : y).padStart(4)}`); }
  }
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
  RAW_DIR = path.join(dir, "raw");
  const usage: string[] = [];

  // Search Console export (manual zip from the Performance report), if given.
  const gsc = opt("--gsc");
  if (gsc) {
    fs.mkdirSync(path.join(dir, "gsc"), { recursive: true });
    execFileSync("unzip", ["-o", "-q", gsc, "-d", path.join(dir, "gsc")]);
    console.log("gsc: unpacked", fs.readdirSync(path.join(dir, "gsc")).join(", "));
  }

  // Bing Webmaster (4 calls, no quota of note).
  type Rows = Array<Record<string, string | number>>;
  const rt = await cached("bing-rank-traffic", () => bing("GetRankAndTrafficStats") as Promise<Rows>); usage.push("bing:GetRankAndTrafficStats");
  const ps = await cached("bing-page-stats", () => bing("GetPageStats") as Promise<Rows>); usage.push("bing:GetPageStats");
  const qs = await cached("bing-query-stats", () => bing("GetQueryStats") as Promise<Rows>); usage.push("bing:GetQueryStats");
  const cs = await cached("bing-crawl-stats", () => bing("GetCrawlStats") as Promise<Rows>); usage.push("bing:GetCrawlStats");

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

  const crawlSeries = cs.map((x) => ({ date: bingDate(String(x.Date)), code5xx: Number(x.Code5xx) })).sort((a, b) => a.date.localeCompare(b.date));
  const code5xxLast7 = crawlSeries.slice(-7).reduce((s, x) => s + x.code5xx, 0);

  fs.writeFileSync(path.join(dir, "bing-pages.csv"), csv(pageRows, ["url", "template", "clicks", "impressions", "position"]));
  fs.writeFileSync(path.join(dir, "bing-queries.csv"), csv(queryRows, ["query", "clicks", "impressions", "position"]));

  // Clarity (3 of the 10 daily calls).
  type Metrics = Array<{ metricName: string; information: Row[] }>;
  const cTot = await cached("clarity-totals", () => clarity("numOfDays=3") as Promise<Metrics>); usage.push("clarity:totals");
  const cUrl = await cached("clarity-by-url", () => clarity("numOfDays=3&dimension1=URL") as Promise<Metrics>); usage.push("clarity:by-url");
  const cSrc = await cached("clarity-by-source", () => clarity("numOfDays=3&dimension1=Source") as Promise<Metrics>); usage.push("clarity:by-source");

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

  const bl = flag("--no-backlinks") ? null : await cached("backlinks-summary", () => backlinks()); if (bl) usage.push(`dataforseo:backlinks(${bl.cost})`);

  // Tracked SERPs (docs/seo-baselines/tracked-queries.json).
  let serpSummary: { queries: number; inTop10: number; inTop3: number; ranks: Record<string, number | ""> ; cost: number } | null = null;
  if (!flag("--no-serps")) {
    const tracked = JSON.parse(fs.readFileSync(path.join(BASE_DIR, "tracked-queries.json"), "utf8")) as { queries: string[] };
    const sr = await cached("serps-result", () => serps(tracked.queries)); usage.push(`dataforseo:serps(${sr.rows.length} queries, $${sr.cost.toFixed(3)})`);
    fs.writeFileSync(path.join(dir, "serps.csv"), csv(sr.rows, ["query", "ourRank", "ourUrl", "top1", "top2", "top3", "paa"]));
    serpSummary = { queries: sr.rows.length, inTop10: sr.rows.filter((r) => r.ourRank !== "" && Number(r.ourRank) <= 10).length, inTop3: sr.rows.filter((r) => r.ourRank !== "" && Number(r.ourRank) <= 3).length, ranks: Object.fromEntries(sr.rows.map((r) => [r.query, r.ourRank])), cost: sr.cost };
  }

  const summary = {
    date: today,
    bing: { last28: { from: last28[0]?.date, to: last28.at(-1)?.date, clicks: sum(last28, "clicks"), impressions: sum(last28, "impressions") }, byTemplate: byTemplate(pageRows, "url", "clicks", "impressions"), crawl: crawlLatest, pagesSampled: pageRows.length, queriesSampled: queryRows.length },
    clarity: { window: "3 days", totals: clarityTotals, bySource, byTemplate: Object.fromEntries(Object.entries(clarityByTemplate).sort((a, b) => b[1].sessions - a[1].sessions)) },
    backlinks: bl,
    serps: serpSummary,
    gscExport: gsc ? path.basename(gsc) : null,
  };
  (summary.bing.crawl as Record<string, unknown>).code5xxLast7 = code5xxLast7;
  fs.writeFileSync(path.join(dir, "summary.json"), JSON.stringify(summary, null, 2));

  const md: string[] = [`# SEO baseline — ${today}`, "", `Bing Webmaster, last 28 days (${summary.bing.last28.from} → ${summary.bing.last28.to}): **${summary.bing.last28.clicks} clicks**, ${summary.bing.last28.impressions.toLocaleString()} impressions.`,
    `Bing crawl (${crawlLatest.date}): ${crawlLatest.inIndex.toLocaleString()} in index, ${crawlLatest.crawled} crawled, **${crawlLatest.code5xx} 5xx**, ${crawlLatest.errors} errors.`,
    `Bing 5xx, last 7 crawl days: **${code5xxLast7}** (${crawlSeries.slice(-7).map((x) => x.code5xx).join(", ")}).`,
    bl ? `Backlinks (DataForSEO): ${bl.referringDomains} referring domains, ${bl.backlinks} backlinks.` : "Backlinks: skipped.",
    serpSummary ? `Tracked SERPs (Google AU, ${serpSummary.queries} queries): **${serpSummary.inTop10} in the top 10, ${serpSummary.inTop3} in the top 3** (\`serps.csv\`).` : "Tracked SERPs: skipped.",
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
