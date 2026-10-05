// State pages, market reports and the price guide print what the suburb pages publish (fix item 47, cohort 2),
// and so does every other reader of a suburb's sales figures (cohort 3).
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { GROWTH_SOURCES, PUBLISHED_CHANGE, PUBLISHED_HOUSE_MEDIAN } from "@/lib/published-medians";
import { GROWTH_RANKED_STATES, stateRankingLink } from "@/lib/ranking-notes";

const src = (f: string) => fs.readFileSync(f, "utf8");

describe("the filter for a list sorted by change", () => {
  it("takes a change up or down, inside the clamp, from a feed that measures it", () => {
    expect(PUBLISHED_CHANGE.annualGrowthHouse).toEqual({ gte: -25, lte: 25, not: 0 });
    expect(PUBLISHED_CHANGE.statsSource.in).toEqual([...GROWTH_SOURCES]);
    expect(PUBLISHED_CHANGE.NOT).toEqual(PUBLISHED_HOUSE_MEDIAN.NOT);
    expect(PUBLISHED_CHANGE.medianHousePrice).toEqual({ gt: 0 });
  });
});

describe("no list reads a raw median", () => {
  // Every query that ranks or averages on a median goes through the rule.
  const FILES = [
    "src/lib/services/suburb-rankings-service.ts",
    "src/lib/services/market-report-service.ts",
    "src/app/(marketing)/price-guide/page.tsx",
  ];
  it("filters on the published median, never on `medianHousePrice > 0` alone", () => {
    for (const f of FILES) {
      const s = src(f);
      expect(s, f).toMatch(/PUBLISHED_HOUSE_MEDIAN|PUBLISHED_GROWTH|PUBLISHED_CHANGE/);
      expect(s, f).not.toMatch(/where:\s*\{[^}]*\bmedianHousePrice:\s*\{\s*gt:\s*0\s*\}[^}]*\}/);
      expect(s, f).toMatch(/publishedSales|withPublishedSales/);
    }
  });
  it("prints no days on market: no feed measures it", () => {
    expect(src("src/app/(marketing)/price-guide/page.tsx")).not.toMatch(/daysOnMarket|Days on Market/);
    const report = src("src/app/(marketing)/market-reports/[state]/page.tsx");
    expect(report).not.toMatch(/Avg days on market|avgDaysOnMarket|annual growth, days on market/);
    expect(src("src/lib/services/market-report-service.ts")).toContain("avgDaysOnMarket:     null,");
  });
  it("says where the figures come from instead of naming a source they do not have", () => {
    for (const f of ["src/app/(marketing)/price-guide/page.tsx", "src/app/(marketing)/market-reports/[state]/page.tsx", "src/app/(marketing)/states/[state]/page.tsx"]) {
      const s = src(f);
      expect(s, f).toContain("priceSourceLine(");
      expect(s, f).not.toMatch(/state revenue offices|Valuer-General offices/);
    }
  });
});

describe("every reader of a suburb's sales figures goes through the rule", () => {
  // A file that reads the Suburb table and names a sales column either
  // applies the rule or reads the suburb through the service that does.
  // Cohort 3 closed the last of them: search, the schools pages, the listing
  // page, the postcode pages, the city and region rollups, the suburb finder.
  const RULE = /publishedSales|withPublishedSales|publishesMedians|publishedGrowth|PUBLISHED_HOUSE_MEDIAN|PUBLISHED_GROWTH|PUBLISHED_CHANGE|getSuburbBySlug/;
  const files = (fs.readdirSync("src", { recursive: true, encoding: "utf8" }) as string[])
    .map((f) => `src/${f.split("\\").join("/")}`)
    .filter((f) => /\.(ts|tsx)$/.test(f) && !f.startsWith("src/generated/"));
  const readers = files.filter((f) => {
    const s = src(f);
    return /db\.suburb\.|FROM "Suburb"|\bsuburb:\s*\{\s*select/.test(s) && /medianHousePrice|medianUnitPrice|annualGrowthHouse|daysOnMarket/.test(s);
  });

  it("finds the readers", () => {
    expect(readers.length).toBeGreaterThanOrEqual(11);
    for (const f of [
      "src/lib/services/search-service.ts",
      "src/lib/services/school-service.ts",
      "src/lib/services/postcode-service.ts",
      "src/lib/services/city-market-service.ts",
      "src/lib/services/region-service.ts",
      "src/lib/services/suburb-finder-service.ts",
      "src/app/(marketing)/buy/[slug]/page.tsx",
    ]) expect(readers, f).toContain(f);
  });
  it("and each applies it", () => {
    for (const f of readers) expect(src(f), f).toMatch(RULE);
  });
  it("no copy of the rule is left behind", () => {
    // A reader that checks the source alone misses the five-sale floor.
    for (const f of readers) {
      if (f === "src/lib/services/suburb-service.ts") continue;
      expect(src(f), f).not.toMatch(/isReliableSalesSource|isPlausibleAnnualGrowth/);
    }
    expect(src("src/app/(marketing)/regions/[slug]/page.tsx")).not.toMatch(/isReliableSalesSource/);
    expect(src("src/lib/services/region-service.ts")).not.toContain("getRegionStats(");
  });
  it("the rollups apply the five-sale floor", () => {
    expect(src("src/lib/services/city-market-service.ts")).toContain("rows.filter((s) => publishesMedians(s) && s.medianHousePrice > 0)");
  });
  it("the listing page prints the suburb's figures from the suburb service, and no days on market", () => {
    const page = src("src/app/(marketing)/buy/[slug]/page.tsx");
    expect(page).toContain("await getSuburbBySlug(property.suburbSlug)");
    expect(page).not.toMatch(/suburbData\.(medianHousePrice|medianUnitPrice|annualGrowthHouse|medianRentHouse|daysOnMarket)/);
    // No feed measures days on market; the medians are not census figures.
    expect(page).not.toMatch(/label="Days on market"|daysOnMarket/);
    expect(page).not.toContain("ABS Census");
  });
});

describe("no page links to a ranking with nothing in it", () => {
  it("links a state's pages to its growth ranking where there is one, else to its most affordable suburbs", () => {
    for (const state of ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "NT", "ACT"]) {
      const link = stateRankingLink(state);
      const ranked = GROWTH_RANKED_STATES.includes(state);
      expect(link.href, state).toBe(`/best-suburbs/${ranked ? "highest-growth" : "most-affordable"}/${state.toLowerCase()}`);
      expect(link.label, state).toBe(ranked ? `${state} growth ranking` : `${state} most affordable suburbs`);
    }
    expect(stateRankingLink("vic").href).toBe("/best-suburbs/most-affordable/vic");
  });
  it("and the three pages that link there use it", () => {
    for (const f of [
      "src/app/(marketing)/market-reports/[state]/page.tsx",
      "src/app/(marketing)/property-market/[city]/page.tsx",
      "src/app/(marketing)/regions/[slug]/page.tsx",
    ]) {
      expect(src(f), f).toContain("stateRankingLink(");
      expect(src(f), f).not.toMatch(/best-suburbs\/highest-growth\/\$\{/);
    }
  });
});
