// A list prints what the suburb's own page prints (fix item 47).
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  GROWTH_SOURCES,
  PUBLISHED_GROWTH,
  PUBLISHED_HOUSE_MEDIAN,
  PUBLISHED_HOUSE_MEDIAN_SQL,
  UNIT_MEDIAN_SOURCES,
  medianBasis,
  publishedGrowth,
  publishedSales,
  publishesMedians,
  publishesUnitMedian,
  withPublishedSales,
  type RawSalesRow,
} from "@/lib/published-medians";
import { RELIABLE_SALES_SOURCES } from "@/lib/suburb-data-quality";
import { MIN_SALES_FOR_MEDIAN } from "@/lib/sales-provenance";

const row = (over: Partial<RawSalesRow> = {}): RawSalesRow => ({
  medianHousePrice: 850_000, medianUnitPrice: 610_000, annualGrowthHouse: 6.4, statsSource: "sales-nsw", salesCountHouse: 40, ...over,
});

describe("what is published", () => {
  it("a trusted source with five sales, or with no count on record", () => {
    expect(publishedSales(row())).toEqual({ medianHousePrice: 850_000, medianUnitPrice: 610_000, annualGrowthHouse: 6.4, basis: "suburb" });
    expect(publishesMedians(row({ salesCountHouse: 5 }))).toBe(true);
    expect(publishesMedians(row({ salesCountHouse: 0 }))).toBe(true);
    expect(publishesMedians(row({ salesCountHouse: null }))).toBe(true);
  });
  it("nothing from a distrusted source, whatever the columns hold", () => {
    for (const statsSource of ["seed", "stub", "abs-census-2021", "rental-nsw", "rental-vic", "rental-sa", "sales-qld", "sales-wa", "import-suburbs-all", "", null]) {
      expect(publishedSales(row({ statsSource })), String(statsSource)).toEqual({ medianHousePrice: 0, medianUnitPrice: 0, annualGrowthHouse: 0, basis: null });
    }
  });
  it("nothing on one to four recorded sales", () => {
    for (const salesCountHouse of [1, 2, 3, 4]) {
      expect(publishedSales(row({ salesCountHouse })).medianHousePrice).toBe(0);
      expect(publishedSales(row({ salesCountHouse })).annualGrowthHouse).toBe(0);
    }
  });
  it("marks an ABS figure as an area median", () => {
    expect(publishedSales(row({ statsSource: "sales-abs", salesCountHouse: 0 })).basis).toBe("area");
    expect(medianBasis("sales-vic")).toBe("suburb");
    expect(medianBasis("sales-qld")).toBeNull();
  });
  it("keeps the other columns of the row", () => {
    const r = withPublishedSales({ ...row({ statsSource: "sales-wa" }), slug: "x-wa-6000" });
    expect(r.slug).toBe("x-wa-6000");
    expect(r.medianHousePrice).toBe(0);
  });
});

describe("12-month change", () => {
  it("is published from the feeds that measure it", () => {
    expect([...GROWTH_SOURCES]).toEqual(["sales-nsw", "sales-sa"]);
    expect(publishedGrowth(row())).toBe(6.4);
    expect(publishedGrowth(row({ statsSource: "sales-sa", annualGrowthHouse: -3.1 }))).toBe(-3.1);
  });
  it("is not published beside an ABS or Land Victoria median: those feeds never write it", () => {
    expect(publishedGrowth(row({ statsSource: "sales-abs", salesCountHouse: 0, annualGrowthHouse: 8.8 }))).toBe(0);
    expect(publishedGrowth(row({ statsSource: "sales-vic", salesCountHouse: 0, annualGrowthHouse: 4 }))).toBe(0);
    for (const script of ["sales-abs", "sales-vic"]) {
      expect(fs.readFileSync(`scripts/sync/sources/${script}.ts`, "utf8"), script).not.toContain("annualGrowthHouse");
    }
    for (const script of ["sales-nsw", "sales-sa"]) {
      expect(fs.readFileSync(`scripts/sync/sources/${script}.ts`, "utf8"), script).toContain("annualGrowthHouse");
    }
  });
  it("is not published beyond the plausibility clamp, nor without a median", () => {
    expect(publishedGrowth(row({ annualGrowthHouse: 4612.1 }))).toBe(0);
    expect(publishedGrowth(row({ annualGrowthHouse: 25 }))).toBe(25);
    expect(publishedGrowth(row({ annualGrowthHouse: 25.1 }))).toBe(0);
    expect(publishedGrowth(row({ annualGrowthHouse: -41.8 }))).toBe(0);
    expect(publishedGrowth(row({ medianHousePrice: 0 }))).toBe(0);
    expect(publishedGrowth(row({ annualGrowthHouse: null }))).toBe(0);
  });
});

describe("unit medians", () => {
  it("are published from the feeds that produce one", () => {
    expect([...UNIT_MEDIAN_SOURCES]).toEqual(["sales-vic", "sales-abs"]);
    expect(publishesUnitMedian(row({ statsSource: "sales-vic", salesCountHouse: 0 }))).toBe(true);
    expect(publishesUnitMedian(row({ statsSource: "sales-abs", salesCountHouse: 0 }))).toBe(true);
    for (const script of ["sales-vic", "sales-abs"]) {
      expect(fs.readFileSync(`scripts/sync/sources/${script}.ts`, "utf8"), script).toContain("medianUnitPrice");
    }
  });
  it("are not published beside an NSW or SA median: those feeds write only the house series, so the figure predates them", () => {
    expect(publishesUnitMedian(row())).toBe(false);
    expect(publishesUnitMedian(row({ statsSource: "sales-sa" }))).toBe(false);
    for (const script of ["sales-nsw", "sales-sa"]) {
      expect(fs.readFileSync(`scripts/sync/sources/${script}.ts`, "utf8"), script).not.toContain("medianUnitPrice");
    }
  });
  it("clear the same gate as the house median, and need a figure", () => {
    expect(publishesUnitMedian(row({ statsSource: "sales-vic", salesCountHouse: 3 }))).toBe(false);
    expect(publishesUnitMedian(row({ statsSource: "sales-vic", salesCountHouse: 0, medianUnitPrice: 0 }))).toBe(false);
    expect(publishesUnitMedian(row({ statsSource: "sales-vic", salesCountHouse: 0, medianUnitPrice: null }))).toBe(false);
  });
});

describe("the same rule as database filters", () => {
  it("names the trusted sources and the five-sale floor", () => {
    expect(PUBLISHED_HOUSE_MEDIAN.statsSource.in).toEqual([...RELIABLE_SALES_SOURCES]);
    expect(PUBLISHED_HOUSE_MEDIAN.NOT.salesCountHouse).toEqual({ gte: 1, lt: MIN_SALES_FOR_MEDIAN });
    expect(PUBLISHED_GROWTH.statsSource.in).toEqual([...GROWTH_SOURCES]);
    expect(PUBLISHED_GROWTH.annualGrowthHouse).toEqual({ gt: 0, lte: 25 });
    expect(PUBLISHED_HOUSE_MEDIAN_SQL).toContain(`IN ('sales-nsw', 'sales-vic', 'sales-sa', 'sales-abs')`);
    expect(PUBLISHED_HOUSE_MEDIAN_SQL).toContain(`NOT (s."salesCountHouse" >= 1 AND s."salesCountHouse" < 5)`);
  });
  it("agrees with the row rule on every combination", () => {
    // The filters, read as a predicate, against publishedSales.
    const where = (r: RawSalesRow) =>
      r.medianHousePrice > 0 &&
      PUBLISHED_HOUSE_MEDIAN.statsSource.in.includes(r.statsSource ?? "") &&
      !((r.salesCountHouse ?? 0) >= 1 && (r.salesCountHouse ?? 0) < MIN_SALES_FOR_MEDIAN);
    for (const statsSource of ["sales-nsw", "sales-vic", "sales-sa", "sales-abs", "sales-qld", "seed", "rental-vic"]) {
      for (const salesCountHouse of [0, 1, 4, 5, 60]) {
        for (const medianHousePrice of [0, 420_000]) {
          const r = row({ statsSource, salesCountHouse, medianHousePrice });
          expect(where(r), `${statsSource} ${salesCountHouse} ${medianHousePrice}`).toBe(publishedSales(r).medianHousePrice > 0);
        }
      }
    }
  });
  it("is what the suburb service and the indexability rule read", () => {
    expect(fs.readFileSync("src/lib/services/suburb-service.ts", "utf8")).toContain("= publishedSales(s);");
    expect(fs.readFileSync("src/lib/suburb-indexability.ts", "utf8")).toContain("return publishesMedians(row);");
  });
});
