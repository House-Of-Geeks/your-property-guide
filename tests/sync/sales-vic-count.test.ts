// sales-vic writes the house sales count from the Victorian Property Sales
// Report's "sales this quarter" column, so the five-sale rule applies in
// Victoria (commercial intent review, suburbs-market 0.2a, 10 Oct 2026).
import fs from "node:fs";
import { describe, expect, it, vi } from "vitest";

// The sync module opens a Prisma client at import; nothing here touches it.
vi.mock("../../scripts/sync/db", () => ({ prisma: {} }));
vi.mock("../../scripts/sync/logger", () => ({ startSync: vi.fn(), finishSync: vi.fn(), failSync: vi.fn(), log: vi.fn() }));

const { CURRENT_MEDIAN_COL, SALES_THIS_QUARTER_COL, parseSalesCount, salesCountsByLocality } = await import("../../scripts/sync/sources/sales-vic");
const { publishedSales } = await import("@/lib/published-medians");

// A file in the layout the script reads: four header rows, then
// Locality, four prior quarters (median, flag), current median (col 9),
// flag (col 10), sales this quarter (col 11), sales YTD, YoY %, QoQ %.
function dataRow(locality: string, median: number | string, salesThisQuarter: number | string): (string | number)[] {
  return [locality, 0, "", 0, "", 0, "", 0, "", median, "", salesThisQuarter, 0, "", ""];
}
const file: (string | number)[][] = [
  ["", "Apr-Jun", "", "Jul-Sep", "", "Oct-Dec", "", "Jan-Mar", "", "Apr-Jun"],
  ["", 2025, "", 2025, "", 2025, "", 2026, "", 2026],
  [],
  [],
  dataRow("MELBOURNE", 381_000, 3),
  dataRow("FRANKSTON", 810_000, 97),
  dataRow("DOCKLANDS", "-", "-"),
  dataRow("JEPARIT", 149_000, "1,204"),
  ["^ Median not calculated"],
];

describe("the sales count column", () => {
  it("reads 'sales this quarter' beside the current quarter's median", () => {
    expect(CURRENT_MEDIAN_COL).toBe(9);
    expect(SALES_THIS_QUARTER_COL).toBe(11);
    const counts = salesCountsByLocality(file, 9);
    expect(counts.get("melbourne")).toBe(3);
    expect(counts.get("frankston")).toBe(97);
    expect(counts.get("jeparit")).toBe(1204);
    expect(counts.has("docklands")).toBe(false);
    expect(counts.has("^ median not calculated")).toBe(false);
  });

  it("reads nothing when the latest median is not in the current-quarter column", () => {
    expect(salesCountsByLocality(file, 7).size).toBe(0);
  });

  it("parses a count, and nothing else, from a cell", () => {
    expect(parseSalesCount(12)).toBe(12);
    expect(parseSalesCount("12")).toBe(12);
    expect(parseSalesCount("1,204")).toBe(1204);
    for (const cell of ["-", "NA", "", " ", null, undefined, "12a", -3, Number.NaN]) {
      expect(parseSalesCount(cell), String(cell)).toBeNull();
    }
  });

  it("with the count written, the five-sale rule withholds a Land Victoria median on three sales", () => {
    const row = { statsSource: "sales-vic", medianHousePrice: 381_000, medianUnitPrice: 0, annualGrowthHouse: 0 };
    expect(publishedSales({ ...row, salesCountHouse: null }).medianHousePrice).toBe(381_000); // before: no count, published
    expect(publishedSales({ ...row, salesCountHouse: 3 }).medianHousePrice).toBe(0);
    expect(publishedSales({ ...row, salesCountHouse: 97 }).medianHousePrice).toBe(381_000);
  });

  it("the sync writes salesCountHouse with the median, and the count alone where the quarter has no median", () => {
    const src = fs.readFileSync("scripts/sync/sources/sales-vic.ts", "utf8");
    expect(src).toContain("...(salesHouse !== null ? { salesCountHouse: salesHouse } : {}),");
    expect(src).toContain("data: { salesCountHouse: salesHouse }");
  });
});
