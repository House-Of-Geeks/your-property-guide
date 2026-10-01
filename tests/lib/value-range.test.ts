// Commercial intent review 3.4 (30 Sep 2026): the instant range on
// /appraisal, /property-valuation and the house-worth guide is the suburb's
// published median for the dwelling type and 15% either side of it. It prints
// nothing the published-medians rule withholds and never a $0.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import type { HomeValueSummary } from "@/lib/home-value";
import {
  RANGE_BAND,
  availableDwellings,
  medianCaption,
  publishedMedian,
  publishedRange,
  rangeAroundMedian,
  rangeCaption,
  rangeLabel,
  sourceLine,
  withheldNote,
} from "@/lib/value-range";

const summary = (over: Partial<HomeValueSummary> = {}): HomeValueSummary => ({
  slug: "bondi-nsw-2026", name: "Bondi", state: "NSW", postcode: "2026", reliable: true,
  medianHousePrice: 4_300_000, medianUnitPrice: null, annualGrowthHouse: 13.9, salesCount: 35,
  sourceLabel: "NSW Valuer General", period: "calendar 2025", basis: "suburb",
  provenance: "Median of 35 house sales recorded by the NSW Valuer General in calendar 2025.",
  unitProvenance: null,
  ...over,
});

describe("the band around a median", () => {
  it("is 15% either side, rounded to the thousand", () => {
    expect(RANGE_BAND).toBe(0.15);
    expect(rangeAroundMedian(4_300_000)).toEqual({ median: 4_300_000, low: 3_655_000, high: 4_945_000 });
    expect(rangeAroundMedian(612_500)).toEqual({ median: 612_500, low: 521_000, high: 704_000 });
  });
  it("is nothing for a withheld or broken median: never a $0 range", () => {
    for (const m of [0, -1, null, undefined, NaN, Infinity]) {
      expect(rangeAroundMedian(m), String(m)).toBeNull();
    }
    expect(rangeAroundMedian(1)).toBeNull(); // rounds to a 0 floor
  });
});

describe("what the block may print", () => {
  it("the house median and its range where the suburb publishes one", () => {
    expect(publishedMedian(summary(), "house")).toBe(4_300_000);
    expect(publishedRange(summary(), "house")).toEqual({ median: 4_300_000, low: 3_655_000, high: 4_945_000 });
    expect(availableDwellings(summary())).toEqual(["house"]);
  });
  it("no unit figure where the feed produced none (NSW), and the reason names the feed", () => {
    expect(publishedMedian(summary(), "unit")).toBeNull();
    expect(publishedRange(summary(), "unit")).toBeNull();
    expect(withheldNote(summary(), "unit")).toBe("The NSW Valuer General feed has no unit median for Bondi.");
  });
  it("both types where a feed publishes both", () => {
    const vic = summary({ name: "Hawthorn", medianHousePrice: 2_400_000, medianUnitPrice: 700_000, sourceLabel: "Land Victoria quarterly medians", unitProvenance: "Land Victoria's quarterly suburb median unit price, the latest published quarter." });
    expect(availableDwellings(vic)).toEqual(["house", "unit"]);
    expect(publishedRange(vic, "unit")).toEqual({ median: 700_000, low: 595_000, high: 805_000 });
  });
  it("no figure without its source line, so a summary cached before the unit rule cannot print an NSW unit median", () => {
    const stale = summary({ medianUnitPrice: 538_560, unitProvenance: undefined as unknown as null });
    expect(publishedMedian(stale, "unit")).toBeNull();
    expect(publishedRange(stale, "unit")).toBeNull();
    expect(publishedRange(summary({ provenance: null }), "house")).toBeNull();
  });
  it("nothing for a suburb whose median is withheld, with the thin-sales count as the reason", () => {
    const thin = summary({ reliable: false, medianHousePrice: null, salesCount: 3, provenance: null });
    expect(publishedRange(thin, "house")).toBeNull();
    expect(availableDwellings(thin)).toEqual([]);
    expect(withheldNote(thin, "house")).toBe("Only 3 house sales were recorded in calendar 2025, too few for a reliable median. We publish one from 5 sales or more.");
    expect(withheldNote(thin, "unit")).toBe("The NSW Valuer General feed has no unit median for Bondi.");
  });
  it("nothing for a suburb with no trusted feed, and says so", () => {
    const none = summary({ reliable: false, medianHousePrice: null, salesCount: null, sourceLabel: null, period: null, basis: null, provenance: null, name: "Morayfield" });
    expect(publishedRange(none, "house")).toBeNull();
    expect(publishedRange(none, "unit")).toBeNull();
    expect(withheldNote(none, "house")).toBe("We don't publish a house median for Morayfield yet: no trusted sales feed covers it.");
    expect(withheldNote(none, "unit")).toBe("We don't publish a unit median for Morayfield yet: no trusted sales feed covers it.");
  });
  it("labels the range as the suburb median band, not a valuation of the property", () => {
    const label = rangeLabel(summary(), "house");
    expect(label).toContain("the Bondi median house price less and plus 15%");
    expect(label).toContain("It describes the suburb, not your property");
    expect(rangeCaption()).toBe("Range around the median (\u00b115%)");
    expect(medianCaption(summary(), "house")).toBe("Median house price in Bondi");
  });
  it("labels an ABS figure as the statistical area's, not the suburb's", () => {
    const abs = summary({ name: "Morayfield", basis: "area" });
    expect(medianCaption(abs, "house")).toBe("Median house price, ABS statistical area (SA2) for Morayfield");
    expect(rangeLabel(abs, "unit")).toContain("the ABS statistical-area median unit price for Morayfield less and plus 15%");
    expect(rangeLabel(abs, "unit")).toContain("It describes the area, not your property");
  });
  it("prints the source of the series on screen: the unit line under a unit figure, never the house line", () => {
    const vic = summary({ medianUnitPrice: 700_000, provenance: "house line", unitProvenance: "unit line" });
    expect(sourceLine(vic, "house")).toBe("house line");
    expect(sourceLine(vic, "unit")).toBe("unit line");
    expect(sourceLine(summary(), "unit")).toBeNull();
  });
});

describe("where the block sits", () => {
  const src = (f: string) => fs.readFileSync(f, "utf8");
  it("before the form on /appraisal, on the house-worth guide and on /property-valuation, and reads the summary API", () => {
    for (const f of [
      "src/app/(marketing)/appraisal/page.tsx",
      "src/app/(marketing)/guides/how-much-is-my-house-worth-australia/page.tsx",
      "src/app/(marketing)/property-valuation/page.tsx",
    ]) {
      expect(src(f), f).toContain("<SuburbValueRange");
    }
    const block = src("src/components/journey/SuburbValueRange.tsx");
    expect(block).toContain("/api/suburbs/summary?slug=");
    expect(block).toContain("publishedRange(");
    expect(block).toContain("rangeLabel(");
    expect(block).not.toMatch(/\$0\b/);
  });
  it("the appraisal H1 names the appraisal and the agent", () => {
    expect(src("src/app/(marketing)/appraisal/page.tsx")).toMatch(/Free property appraisal[\s\S]{0,80}from a local agent/);
  });
});
