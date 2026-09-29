// The sitemaps list exactly the suburb pages that do not noindex themselves.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  MIN_DATA_FAMILIES,
  canonicalComparePath,
  dataFamilyCount,
  hasPublishedHouseMedian,
  isThinProfile,
  isThinSuburbRow,
  publishesPrices,
  stateMatchesPostcode,
  type ProfileDataSignals,
  type SuburbIndexRow,
  type SuburbPlace,
} from "@/lib/suburb-indexability";

type Row = SuburbIndexRow & SuburbPlace;
const row = (over: Partial<Row> = {}): Row => ({
  medianHousePrice: 850_000, medianUnitPrice: 0, population: 12_000, statsSource: "sales-nsw", salesCountHouse: 40,
  state: "NSW", postcode: "2026", ...over,
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

const none: ProfileDataSignals = { walkScore: null, hasClimate: false, hasCrime: false, hasRental: false };

describe("thin suburb profile (noindex)", () => {
  it("is indexable with a published price or a population, whatever else it has", () => {
    expect(isThinSuburbRow(row(), none)).toBe(false);
    expect(isThinSuburbRow(row({ population: 0 }), none)).toBe(false);
    expect(isThinSuburbRow(row({ statsSource: "abs-census-2021" }), none)).toBe(false);
    expect(isThinSuburbRow(row({ medianHousePrice: 0, medianUnitPrice: 520_000, population: 0 }), none)).toBe(false);
  });
  it("without either, is indexable when it carries data of its own", () => {
    const bare = row({ statsSource: "abs-census-2021", population: 0 });
    expect(MIN_DATA_FAMILIES).toBe(1);
    expect(isThinSuburbRow(bare, { ...none, walkScore: 41 })).toBe(false);
    expect(isThinSuburbRow(bare, { ...none, hasClimate: true })).toBe(false);
    expect(isThinSuburbRow(bare, { ...none, hasCrime: true })).toBe(false);
    expect(isThinSuburbRow(bare, { ...none, hasRental: true })).toBe(false);
  });
  it("is thin with no price, no population and no data of its own", () => {
    expect(isThinSuburbRow(row({ statsSource: "abs-census-2021", population: 0 }), none)).toBe(true);
    expect(isThinSuburbRow(row({ statsSource: "rental-nsw", population: 0 }), none)).toBe(true);
    expect(isThinSuburbRow(row({ salesCountHouse: 3, population: 0 }), none)).toBe(true);
    expect(isThinSuburbRow(row({ medianHousePrice: 0, medianUnitPrice: 0, population: 0 }), none)).toBe(true);
    // a walk score of 0 is "none", not a score
    expect(isThinSuburbRow(row({ statsSource: "seed", population: 0 }), { ...none, walkScore: 0 })).toBe(true);
  });
  it("counts the four families", () => {
    expect(dataFamilyCount(none)).toBe(0);
    expect(dataFamilyCount({ walkScore: 12, hasClimate: true, hasCrime: true, hasRental: true })).toBe(4);
    const place = { state: "VIC", postcode: "3101" };
    expect(isThinProfile({ publishedPrice: false, population: 0, place, signals: none })).toBe(true);
    expect(isThinProfile({ publishedPrice: true, population: 0, place, signals: none })).toBe(false);
  });
  it("counts data of its own only for a row filed under the state its postcode belongs to", () => {
    const bare = (state: string, postcode: string) => row({ statsSource: "rental-sa", population: 0, state, postcode });
    const crime = { ...none, hasCrime: true };
    // Made by the South Australian feeds beside the real suburb.
    expect(isThinSuburbRow(bare("SA", "2000"), crime)).toBe(true);
    expect(isThinSuburbRow(bare("SA", "3002"), crime)).toBe(true);
    expect(isThinSuburbRow(bare("SA", "4810"), crime)).toBe(true);
    expect(isThinSuburbRow(bare("VIC", "9999"), { ...none, walkScore: 40, hasClimate: true })).toBe(true);
    expect(isThinSuburbRow(bare("SA", "NOT DISCLOSED"), crime)).toBe(true);
    expect(isThinSuburbRow(bare("SA", "872"), crime)).toBe(true);
    // The same data under the right state.
    expect(isThinSuburbRow(bare("NSW", "2000"), crime)).toBe(false);
    expect(isThinSuburbRow(bare("SA", "5000"), crime)).toBe(false);
    // A price or a population is indexable as before, wherever the row is filed.
    expect(isThinSuburbRow(row({ state: "SA", postcode: "2000" }), none)).toBe(false);
  });
  it("knows the postcodes that straddle a border", () => {
    for (const [state, postcode] of [["SA", "0872"], ["WA", "0872"], ["NT", "0872"], ["ACT", "2620"], ["NSW", "2620"], ["ACT", "2540"], ["NSW", "2611"], ["NSW", "4385"], ["NT", "4825"], ["NSW", "3644"]]) {
      expect(stateMatchesPostcode({ state, postcode }), `${state} ${postcode}`).toBe(true);
    }
    for (const [state, postcode] of [["NSW", "2000"], ["ACT", "2600"], ["ACT", "2913"], ["NSW", "2899"], ["VIC", "3000"], ["VIC", "8001"], ["QLD", "4000"], ["QLD", "9726"], ["SA", "5000"], ["WA", "6000"], ["TAS", "7000"], ["NT", "0800"]]) {
      expect(stateMatchesPostcode({ state, postcode }), `${state} ${postcode}`).toBe(true);
    }
    for (const [state, postcode] of [["SA", "2000"], ["NSW", "0872"], ["VIC", "2620"], ["QLD", "2000"], ["SA", "872"], ["NSW", ""], ["NSW", "20000"]]) {
      expect(stateMatchesPostcode({ state, postcode }), `${state} ${postcode}`).toBe(false);
    }
  });
  it("is the one rule the page and the sitemap both read", () => {
    const page = fs.readFileSync("src/app/(marketing)/suburbs/[slug]/page.tsx", "utf8");
    const service = fs.readFileSync("src/lib/services/suburb-service.ts", "utf8");
    expect(page).toContain("return isThinProfile({");
    expect(page).toContain("place: { state: s.state, postcode: s.postcode },");
    expect(page).toContain("hasCrime: s.dataFreshness?.crimeSource != null");
    expect(page).toContain("hasRental: s.dataFreshness?.rentalSource != null");
    expect(service).toContain("!isThinSuburbRow(r, {");
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
