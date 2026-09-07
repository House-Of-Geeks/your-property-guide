// Fix item 1, step v: provenance under every median, and the minimum-count rule.
import { describe, expect, it } from "vitest";
import { MIN_SALES_FOR_MEDIAN, describeSalesProvenance, hasEnoughSales, thinSalesNote } from "@/lib/sales-provenance";

describe("minimum sales for a published median", () => {
  it("withholds medians built on fewer than five sales, keeps unknown counts", () => {
    expect(MIN_SALES_FOR_MEDIAN).toBe(5);
    expect(hasEnoughSales(4)).toBe(false);
    expect(hasEnoughSales(5)).toBe(true);
    expect(hasEnoughSales(35)).toBe(true);
    expect(hasEnoughSales(0)).toBe(true);
    expect(hasEnoughSales(null)).toBe(true);
  });
  it("explains a withheld median in plain words", () => {
    expect(thinSalesNote(3, "calendar 2025")).toBe("Only 3 house sales were recorded in calendar 2025, too few for a reliable median. We publish one from 5 sales or more.");
    expect(thinSalesNote(1, "calendar 2025")).toMatch(/^Only 1 house sale was recorded/);
  });
});

describe("sales provenance", () => {
  it("describes a NSW suburb median with its sample and year", () => {
    const p = describeSalesProvenance({ source: "sales-nsw", periodEnd: new Date("2025-12-31T00:00:00Z"), salesCount: 35, suburbName: "Bondi" })!;
    expect(p.geography).toBe("suburb");
    expect(p.short).toBe("Median of 35 house sales · NSW Valuer General · calendar 2025");
    expect(p.sentence).toBe("Median of 35 house sales recorded by the NSW Valuer General in calendar 2025.");
  });
  it("labels an ABS figure as an area median with the caveat", () => {
    const p = describeSalesProvenance({ source: "sales-abs", periodEnd: new Date("2024-12-31T00:00:00Z"), salesCount: null, suburbName: "Morayfield" })!;
    expect(p.geography).toBe("area");
    expect(p.short).toBe("ABS statistical area (SA2) median · 2024");
    expect(p.areaNote).toContain("surrounding localities");
    expect(p.sentence).toContain("takes in Morayfield, 2024");
  });
  it("does not claim a quarter it cannot verify for VIC and SA", () => {
    const p = describeSalesProvenance({ source: "sales-sa", periodEnd: new Date("2026-07-01T00:00:00Z"), updatedAt: new Date("2026-09-05T14:34:00Z"), salesCount: 12, suburbName: "Glenelg" })!;
    expect(p.period).toBe("the latest published quarter (updated September 2026)");
    expect(p.short).toBe("Median of 12 house sales · SA Government · the latest published quarter (updated September 2026)");
  });
  it("returns nothing for proxy or unknown sources", () => {
    expect(describeSalesProvenance({ source: "sales-qld", periodEnd: null, salesCount: null, suburbName: "X" })).toBeNull();
    expect(describeSalesProvenance({ source: null, periodEnd: null, salesCount: null, suburbName: "X" })).toBeNull();
  });
});
