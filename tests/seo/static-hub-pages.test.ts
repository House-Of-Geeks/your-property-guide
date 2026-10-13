// 13 Oct 2026: /states listed no state, /postcodes read "0 postcodes" and
// linked none, /off-market could show no listing, /data counted 0 of
// everything and /compare's two DB rails were empty. Each was a static ISR
// page whose DB-free build render (460c601) was served after every deploy
// until its ISR window passed, a day for most of them. The post-deploy warm
// job cannot help: a GET inside the window serves the cached placeholder.
// They now render on request from cached data, as /regions does. Source-text
// checks, so the test needs no Next runtime or database.
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const APP = path.resolve(__dirname, "../../src/app");
const DEPLOYMENT = 'process.env.VERCEL_DEPLOYMENT_ID ?? "local"';

const HUBS: Record<string, { key: string; read: string }> = {
  "states/page.tsx": {
    key: `["states-index:v1", NOT_PLACES_VERSION, ${DEPLOYMENT}]`,
    read: "const states = await getCachedStates();",
  },
  "postcodes/page.tsx": {
    key: `["postcodes-index:v1", NOT_PLACES_VERSION, ${DEPLOYMENT}]`,
    read: "const postcodes = await getCachedPostcodes();",
  },
  "compare/page.tsx": {
    key: `["compare-hub:v1", NOT_PLACES_VERSION, ${DEPLOYMENT}]`,
    read: "const { topNSW, topVIC, topQLD, pairsByState } = await getCachedRails();",
  },
  "off-market/page.tsx": {
    key: `["off-market:v1", ${DEPLOYMENT}]`,
    read: "const offMarketProperties = await getCachedOffMarket();",
  },
  "data/page.tsx": {
    key: `["data-counts:v1", NOT_PLACES_VERSION, ${DEPLOYMENT}]`,
    read: "const c = await getCachedCounts();",
  },
};

describe("the static hub pages", () => {
  for (const [file, { key, read }] of Object.entries(HUBS)) {
    it(`${file} renders on request from cached data, not from a build-time placeholder`, () => {
      const page = fs.readFileSync(path.join(APP, "(marketing)", file), "utf8");
      expect(page).toContain('export const dynamic = "force-dynamic";');
      expect(page).not.toMatch(/export const revalidate/);
      expect(page).not.toContain("phase-production-build");
      expect(page).toContain("unstable_cache(");
      // The data cache outlives a deploy; the key moves with each one.
      expect(page).toContain(key);
      expect(page).toContain(read);
    });
  }

  it("the hubs with many queries run them one at a time, inside the runtime pool's 5s wait", () => {
    // A failed cold read is now a failed request, not a stale page. With one
    // connection a Promise.all runs no faster; its queued queries just wait.
    const read = (f: string) => fs.readFileSync(path.resolve(APP, f), "utf8");
    const data = read("(marketing)/data/page.tsx");
    expect(data).not.toContain("Promise.all");
    expect(data).toContain("const propertyAddresses = await db.propertyAddress.count();");
    const compare = read("(marketing)/compare/page.tsx");
    expect(compare).not.toContain("Promise.all");
    expect(compare).toContain("for (const state of ALL_STATES) {");
    const rankings = read("../lib/services/suburb-rankings-service.ts");
    expect(rankings).toContain("for (const s of Object.keys(STATE_NAMES)) stats.push(await getStateStats(s));");
  });
});

// The rule is structural, so scan for it (the isr-routes lesson: a list of
// files misses the next one). A page outside a dynamic segment prerenders at
// `next build`, so a build-phase guard there renders its empty branch into
// the page users get. A page that reads searchParams never prerenders, and
// its guard never runs.
describe("no static page renders a build-phase placeholder", () => {
  const stripComments = (src: string) => src.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, "");
  // Fixed in its own PR (House-Of-Geeks/your-property-guide#119), tested in
  // tests/lib/city-market.test.ts. This entry can go once that lands.
  const FIXED_ELSEWHERE = ["(marketing)/property-market/page.tsx"];

  const pages = (fs.readdirSync(APP, { recursive: true, encoding: "utf8" }) as string[])
    .map((f) => f.split("\\").join("/"))
    .filter((f) => f.endsWith("/page.tsx") && !f.includes("["));

  it("finds the static pages, the five hubs among them", () => {
    expect(pages.length).toBeGreaterThan(100);
    for (const file of Object.keys(HUBS)) expect(pages).toContain(`(marketing)/${file}`);
  });

  it("a guarded page reads searchParams, so it renders on request", () => {
    const guarded = pages.filter((f) => stripComments(fs.readFileSync(path.join(APP, f), "utf8")).includes("phase-production-build"));
    for (const f of guarded) {
      if (FIXED_ELSEWHERE.includes(f)) continue;
      expect(stripComments(fs.readFileSync(path.join(APP, f), "utf8")), f).toMatch(/await\s+(props\.)?searchParams/);
    }
  });
});
