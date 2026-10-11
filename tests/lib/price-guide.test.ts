// /price-guide (review of 10 Oct 2026, suburbs-market 3.6).
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  HOW_TO_READ_A_MEDIAN,
  PRICE_UNDER_OPTIONS,
  notApartmentMarketsWhere,
  parsePriceUnder,
  priceGuideLede,
  priceGuideSources,
} from "@/lib/price-guide";

const page = fs.readFileSync("src/app/(marketing)/price-guide/page.tsx", "utf8");

describe("the price guide", () => {
  it("is titled for house prices by suburb, in 60 characters, with no em dash", () => {
    expect(page).toContain("const TITLE = `House Prices by Suburb: Australian Median Price Guide ${PRICE_GUIDE_YEAR}`;");
    expect("House Prices by Suburb: Australian Median Price Guide 2026".length).toBeLessThanOrEqual(60);
    expect(page).not.toMatch(/Updated quarterly|top local agent/);
  });
  it("names only the sources behind what it lists", () => {
    // 10 Oct 2026: NSW withheld, so no Valuer General in the list
    expect(priceGuideSources(["VIC", "SA", "QLD", "WA", "TAS", "NT", "ACT"])).toBe(
      "Land Victoria quarterly medians, SA Government quarterly medians and ABS statistical-area medians (QLD, WA, TAS, NT and ACT)",
    );
    expect(priceGuideSources(["NSW", "VIC", "SA", "QLD"])).toBe("NSW Valuer General sales, Land Victoria quarterly medians, SA Government quarterly medians and ABS statistical-area medians (QLD)");
    const lede = priceGuideLede(3210, ["VIC", "SA", "WA", "TAS", "NT", "ACT"]);
    expect(lede).toMatch(/^Median house prices for 3,210 Australian suburbs, each the figure the suburb's own page publishes: /);
    expect(lede).toContain("None is listed for NSW and QLD at the moment");
    expect(priceGuideLede(0, [])).toContain("None is listed at the moment.");
  });
  it("filters by budget only on the listed options", () => {
    expect([...PRICE_UNDER_OPTIONS]).toEqual([500_000, 600_000, 750_000, 1_000_000]);
    expect(parsePriceUnder("500000")).toBe(500_000);
    expect(parsePriceUnder("123")).toBeUndefined();
    expect(parsePriceUnder(undefined)).toBeUndefined();
  });
  it("screens the lowest-first list like a cheapest list", () => {
    const w = notApartmentMarketsWhere();
    const cbd = w.AND[0].NOT.OR as { state: string; postcode: { gte: string; lte: string } }[];
    expect(cbd).toContainEqual({ state: "VIC", postcode: { gte: "3000", lte: "3010" } });
    expect(cbd).toContainEqual({ state: "NT", postcode: { gte: "0800", lte: "0820" } });
    expect(page).toContain('...(sort === "price-asc" || under ? notApartmentMarketsWhere() : {}),');
    expect(HOW_TO_READ_A_MEDIAN.join(" ")).toContain("CBD-core postcodes");
    // no Promise.all: the runtime pool holds one connection
    expect(page).not.toContain("Promise.all");
  });
});
