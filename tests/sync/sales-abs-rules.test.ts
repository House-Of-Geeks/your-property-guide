// The ABS SA2 feed is a fallback: it never overwrites a suburb-level government feed's median.
import { describe, expect, it } from "vitest";
import { SUBURB_LEVEL_SALES_SOURCES, absMayOverwrite } from "../../scripts/sync/sources/sales-abs-rules";

describe("sales-abs overwrite rule", () => {
  it("protects the suburb-level feeds", () => {
    expect([...SUBURB_LEVEL_SALES_SOURCES]).toEqual(["sales-nsw", "sales-vic", "sales-sa"]);
    for (const src of SUBURB_LEVEL_SALES_SOURCES) expect(absMayOverwrite(src)).toBe(false);
    expect(absMayOverwrite(" sales-nsw ")).toBe(false);
  });
  it("may overwrite seed, census-estimated and its own earlier values", () => {
    for (const src of ["seed", "abs-census-2021", "sales-abs", "sales-qld", "sales-wa", "rental-nsw", "", null, undefined]) {
      expect(absMayOverwrite(src)).toBe(true);
    }
  });
});
