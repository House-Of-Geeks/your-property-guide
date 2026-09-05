// Fix item 4(a): every suburb sub-route, the postcode page and the school
// page must be 7-day/24h ISR (export `revalidate`) and must never read
// `searchParams` on the server. A dynamic-segment route with no build-time
// render that awaits searchParams throws DYNAMIC_SERVER_USAGE at request
// time (every suburb /buy and /rent page answered 500 until 5 Sep 2026), and
// a route without `revalidate` renders from the database on every crawler
// hit (the July 2026 connection-exhaustion wave). Source-text checks, so the
// test needs no Next runtime.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const APP = path.resolve(__dirname, "../../src/app/(marketing)");

function pagesUnder(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...pagesUnder(full));
    else if (entry.name === "page.tsx") out.push(full);
  }
  return out;
}

const SUBURB_ROUTES = pagesUnder(path.join(APP, "suburbs/[slug]"));
const OTHER_ISR_ROUTES = [path.join(APP, "postcodes/[postcode]/page.tsx")];
const rel = (f: string) => path.relative(APP, f);

describe("ISR routes", () => {
  it("finds the suburb sub-routes", () => {
    expect(SUBURB_ROUTES.length).toBeGreaterThanOrEqual(10);
  });

  for (const file of [...SUBURB_ROUTES, ...OTHER_ISR_ROUTES]) {
    const src = fs.readFileSync(file, "utf8");
    it(`${rel(file)} exports revalidate`, () => {
      expect(src).toMatch(/export const revalidate = \d+/);
    });
    it(`${rel(file)} never reads searchParams on the server`, () => {
      expect(src).not.toMatch(/await searchParams/);
      expect(src).not.toMatch(/searchParams\.(get|then)/);
    });
  }

  // KNOWN FAILURE, deliberately visible: /schools/[slug] still awaits
  // searchParams and has no `revalidate` (9,670 sitemap URLs rendered per
  // request). Fix item 4(a) part two moves its listing filters to the client
  // like the suburb /buy and /rent pages; remove `.fails` in that commit.
  it.fails("schools/[slug]/page.tsx is ISR without server searchParams — fails until 4(a) part two ships", () => {
    const src = fs.readFileSync(path.join(APP, "schools/[slug]/page.tsx"), "utf8");
    expect(src).toMatch(/export const revalidate = \d+/);
    expect(src).not.toMatch(/await searchParams/);
  });
});
