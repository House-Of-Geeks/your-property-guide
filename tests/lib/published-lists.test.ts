// State pages, market reports and the price guide print what the suburb pages publish (fix item 47, cohort 2).
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { GROWTH_SOURCES, PUBLISHED_CHANGE, PUBLISHED_HOUSE_MEDIAN } from "@/lib/published-medians";

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
