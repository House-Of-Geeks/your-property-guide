// The sitemaps list exactly the suburb pages that do not noindex themselves.
import { describe, expect, it } from "vitest";
import {
  canonicalComparePath,
  hasPublishedHouseMedian,
  isThinSuburbRow,
  publishesPrices,
  type SuburbIndexRow,
} from "@/lib/suburb-indexability";

const row = (over: Partial<SuburbIndexRow> = {}): SuburbIndexRow => ({
  medianHousePrice: 850_000, medianUnitPrice: 0, population: 12_000, statsSource: "sales-nsw", salesCountHouse: 40, ...over,
});

describe("price gate, as the service applies it", () => {
  it("publishes a trusted source with enough sales, or with no count on record", () => {
    expect(publishesPrices(row())).toBe(true);
    expect(publishesPrices(row({ salesCountHouse: 0 }))).toBe(true);
    expect(publishesPrices(row({ salesCountHouse: null }))).toBe(true);
    expect(publishesPrices(row({ statsSource: "sales-abs", salesCountHouse: 0 }))).toBe(true);
  });
  it("withholds a median on one to four sales and any distrusted source", () => {
    expect(publishesPrices(row({ salesCountHouse: 4 }))).toBe(false);
    for (const statsSource of ["seed", "abs-census-2021", "rental-nsw", "rental-vic", "sales-qld", "sales-wa", "", null]) {
      expect(publishesPrices(row({ statsSource }))).toBe(false);
    }
  });
});

describe("thin suburb profile (noindex)", () => {
  it("is indexable with a published price or a population", () => {
    expect(isThinSuburbRow(row())).toBe(false);
    expect(isThinSuburbRow(row({ population: 0 }))).toBe(false);
    expect(isThinSuburbRow(row({ statsSource: "abs-census-2021" }))).toBe(false);
    expect(isThinSuburbRow(row({ medianHousePrice: 0, medianUnitPrice: 520_000, population: 0 }))).toBe(false);
  });
  it("is thin when the price is withheld and there is no population, whatever the raw columns hold", () => {
    expect(isThinSuburbRow(row({ statsSource: "abs-census-2021", population: 0 }))).toBe(true);
    expect(isThinSuburbRow(row({ statsSource: "rental-nsw", population: 0 }))).toBe(true);
    expect(isThinSuburbRow(row({ salesCountHouse: 3, population: 0 }))).toBe(true);
    expect(isThinSuburbRow(row({ medianHousePrice: 0, medianUnitPrice: 0, population: 0 }))).toBe(true);
  });
});

describe("agents sub-page", () => {
  it("indexes only with a published house median", () => {
    expect(hasPublishedHouseMedian(row())).toBe(true);
    expect(hasPublishedHouseMedian(row({ salesCountHouse: 2 }))).toBe(false);
    expect(hasPublishedHouseMedian(row({ statsSource: "sales-qld" }))).toBe(false);
    expect(hasPublishedHouseMedian(row({ medianHousePrice: 0, medianUnitPrice: 500_000 }))).toBe(false);
  });
});

describe("comparison URLs", () => {
  it("are the pair in lexicographic order, whichever way round it is given", () => {
    expect(canonicalComparePath("morayfield-qld-4506", "burpengary-qld-4505")).toBe("/suburbs/burpengary-qld-4505/vs/morayfield-qld-4506");
    expect(canonicalComparePath("burpengary-qld-4505", "morayfield-qld-4506")).toBe("/suburbs/burpengary-qld-4505/vs/morayfield-qld-4506");
    expect(canonicalComparePath("orange-nsw-2800", "orange-east-nsw-2800")).toBe("/suburbs/orange-east-nsw-2800/vs/orange-nsw-2800");
  });
  it("matches the rule the comparison page uses for its canonical", async () => {
    const fs = await import("node:fs");
    const page = fs.readFileSync("src/app/(marketing)/suburbs/[slug]/vs/[compareSlug]/page.tsx", "utf8");
    expect(page).toContain("[slug, compareSlug].sort()");
  });
});
