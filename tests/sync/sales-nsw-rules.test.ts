// Fix item 1, step 1: the NSW house median must exclude non-strata flats.
import { describe, expect, it } from "vitest";
import { isHouseSaleForAggregate } from "../../scripts/sync/sources/sales-nsw-rules";

describe("NSW Valuer General: which sales feed the suburb house median", () => {
  it("counts a non-strata residence with no unit number", () => {
    expect(isHouseSaleForAggregate({ isOldFormat: false, nature: "R", unitNumber: null })).toBe(true);
    expect(isHouseSaleForAggregate({ isOldFormat: false, nature: "R", unitNumber: "" })).toBe(true);
    expect(isHouseSaleForAggregate({ isOldFormat: false, nature: "r ", unitNumber: "  " })).toBe(true);
  });

  it("excludes non-strata flats and townhouses, which carry a unit number", () => {
    expect(isHouseSaleForAggregate({ isOldFormat: false, nature: "R", unitNumber: "5" })).toBe(false);
    expect(isHouseSaleForAggregate({ isOldFormat: false, nature: "R", unitNumber: "12A" })).toBe(false);
  });

  it("excludes strata and vacant land", () => {
    expect(isHouseSaleForAggregate({ isOldFormat: false, nature: "3", unitNumber: null })).toBe(false);
    expect(isHouseSaleForAggregate({ isOldFormat: false, nature: "V", unitNumber: null })).toBe(false);
    expect(isHouseSaleForAggregate({ isOldFormat: false, nature: "", unitNumber: null })).toBe(false);
  });

  it("excludes the pre-2001 archive layout, whose nature codes do not map to R/V/3", () => {
    expect(isHouseSaleForAggregate({ isOldFormat: true, nature: "R", unitNumber: null })).toBe(false);
  });
});
