// Victorian rental feed: house rent from the house sheets, unit rent from the flat sheets, never "All properties".
import { describe, expect, it } from "vitest";
import {
  candidateVicUrls,
  findLatestPopulatedQuarter,
  parseMedian,
  parseQuarterLabel,
  pickHouseRent,
  pickUnitRent,
  splitGroupName,
} from "../../scripts/sync/sources/rental-vic-rules";

describe("dwelling mapping (Toorak, Sep 2025 workbook)", () => {
  const toorak = { "1bed_flat": 445, "2bed_flat": 650, "3bed_flat": 1000, "2bed_house": 695, "3bed_house": 1250, "4bed_house": 1875, all: 688 };
  it("takes the 3-bedroom house and the 2-bedroom flat", () => {
    expect(pickHouseRent(toorak)).toBe(1250);
    expect(pickUnitRent(toorak)).toBe(650);
  });
  it("falls back through the house and flat sheets in order", () => {
    expect(pickHouseRent({ "4bed_house": 1875, "2bed_house": 695, all: 688 })).toBe(1875);
    expect(pickHouseRent({ "2bed_house": 695, all: 688 })).toBe(695);
    expect(pickUnitRent({ "1bed_flat": 445, "3bed_flat": 1000, all: 688 })).toBe(445);
    expect(pickUnitRent({ "3bed_flat": 1000, all: 688 })).toBe(1000);
  });
  it("never uses the all-properties median as a house or unit rent", () => {
    expect(pickHouseRent({ all: 688 })).toBeNull();
    expect(pickUnitRent({ all: 688 })).toBeNull();
  });
});

describe("workbook layout", () => {
  it("parses a quarter label into the quarter's last month", () => {
    const q = parseQuarterLabel("Sep 2025")!;
    expect(q.period).toBe("2025-Q3");
    expect(q.periodDate.toISOString()).toBe("2025-09-01T00:00:00.000Z");
    expect(parseQuarterLabel("September 2025")).toBeNull();
  });
  it("finds the newest quarter column that holds data, skipping empty future columns", () => {
    const raw = [
      ["3 bedroom house"],
      ["", "", "Jun 2025", "Jun 2025", "Sep 2025", "Sep 2025", "Dec 2025", "Dec 2025"],
      ["Region", "Suburb", "Count", "Median", "Count", "Median", "Count", "Median"],
      ["Inner", "Toorak", 44, 1200, 46, 1250, "", ""],
      ["Inner", "Kew", 100, 830, 111, 850, "", ""],
    ];
    expect(findLatestPopulatedQuarter(raw)).toEqual({ period: "2025-Q3", periodDate: new Date("2025-09-01T00:00:00Z"), col: 5 });
    expect(findLatestPopulatedQuarter([["title"], [], []])).toBeNull();
  });
  it("reads medians and treats blanks and dashes as unknown", () => {
    expect(parseMedian(1250)).toBe(1250);
    expect(parseMedian("1,250")).toBe(1250);
    expect(parseMedian("-")).toBeNull();
    expect(parseMedian("")).toBeNull();
  });
  it("splits DFFH groups into component suburbs", () => {
    expect(splitGroupName("Albert Park-Middle Park-West St Kilda")).toEqual(["Albert Park", "Middle Park", "West St Kilda"]);
    expect(splitGroupName("Werribee - Hoppers Crossing")).toEqual(["Werribee", "Hoppers Crossing"]);
    expect(splitGroupName("Toorak")).toEqual(["Toorak"]);
  });
});

describe("download fallback", () => {
  it("lists the last eight quarters' direct DFFH URLs, newest first, in both spellings", () => {
    const urls = candidateVicUrls(new Date("2026-09-07T00:00:00Z"));
    expect(urls[0]).toBe("https://www.dffh.vic.gov.au/moving-annual-rent-suburb-june-quarter-2026-excel");
    expect(urls[1]).toBe("https://www.dffh.vic.gov.au/moving-annual-rents-suburb-june-quarter-2026-excel");
    expect(urls).toContain("https://www.dffh.vic.gov.au/moving-annual-rent-suburb-september-quarter-2025-excel");
    expect(urls).toHaveLength(16);
  });
});
