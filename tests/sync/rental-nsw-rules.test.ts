// NSW rental feed: house rent = DCJ House/Total row, unit rent = Flat/Unit/Total row.
import { describe, expect, it } from "vitest";
import {
  candidateRentTablesUrls,
  classifyBondCount,
  findHeaderRow,
  findLatestRentTablesUrl,
  isCovered,
  normaliseDwellingType,
  parseDcjNumber,
  parseReportingPeriod,
  selectPostcodeRents,
} from "../../scripts/sync/sources/rental-nsw-rules";

describe("DCJ dwelling types", () => {
  it("maps both spellings DCJ has used", () => {
    expect(normaliseDwellingType("House")).toBe("house");
    expect(normaliseDwellingType("Houses")).toBe("house");
    expect(normaliseDwellingType("Flat/Unit")).toBe("unit");
    expect(normaliseDwellingType("Flats/Units")).toBe("unit");
    expect(normaliseDwellingType(" Total ")).toBe("all");
    expect(normaliseDwellingType("Townhouse")).toBe("townhouse");
    expect(normaliseDwellingType("Other")).toBe("other");
    expect(normaliseDwellingType("")).toBeNull();
  });
});

describe("DCJ cells", () => {
  it("reads numbers with separators and treats DCJ's markers as unknown", () => {
    expect(parseDcjNumber(1150)).toBe(1150);
    expect(parseDcjNumber("1,142")).toBe(1142);
    expect(parseDcjNumber("-")).toBeNull();
    expect(parseDcjNumber("s")).toBeNull();
    expect(parseDcjNumber("")).toBeNull();
  });
  it("distinguishes a small sample (s) from a withheld figure (-)", () => {
    expect(classifyBondCount("65")).toEqual({ count: 65, flag: "published" });
    expect(classifyBondCount("s")).toEqual({ count: null, flag: "small" });
    expect(classifyBondCount("-")).toEqual({ count: null, flag: "suppressed" });
  });
});

const row = (postcode: string, dwellingType: string, bedrooms: string, median: string | number, newBonds: string | number) =>
  ({ postcode, dwellingType, bedrooms, median, newBonds });

describe("selectPostcodeRents", () => {
  it("takes the House and Flat/Unit medians for all bedrooms, never the all-dwellings total (Bondi, June 2026)", () => {
    const rents = selectPostcodeRents([
      row("2026", "Total", "Total", 1050, 750),
      row("2026", "Total", "2 Bedrooms", 1175, 297),
      row("2026", "House", "Total", 1800, 65),
      row("2026", "House", "3 Bedrooms", 1878, "s"),
      row("2026", "Townhouse", "Total", "-", "-"),
      row("2026", "Flat/Unit", "Total", 1000, 661),
      row("2026", "Other", "Total", 900, "s"),
    ]);
    const bondi = rents.get("2026")!;
    expect(bondi.house).toEqual({ median: 1800, newBonds: 65, smallSample: false });
    expect(bondi.unit).toEqual({ median: 1000, newBonds: 661, smallSample: false });
    expect(bondi.all?.median).toBe(1050);
    expect(isCovered(bondi)).toBe(true);
  });

  it("keeps a published median on a small sample and drops a withheld one (Sydney 2000, Double Bay 2028)", () => {
    const rents = selectPostcodeRents([
      row("2000", "House", "Total", 1250, "s"),
      row("2000", "Flat/Unit", "Total", 1150, 854),
      row("2028", "House", "Total", "-", "-"),
      row("2028", "Flat/Unit", "Total", 1050, 84),
    ]);
    expect(rents.get("2000")!.house).toEqual({ median: 1250, newBonds: null, smallSample: true });
    expect(rents.get("2028")!.house).toBeNull();
    expect(rents.get("2028")!.unit?.median).toBe(1050);
    expect(isCovered(rents.get("2028")!)).toBe(true);
  });

  it("a postcode with neither a house nor a unit median is not covered", () => {
    const rents = selectPostcodeRents([
      row("2898", "Total", "Total", 400, 12),
      row("2898", "House", "Total", "-", "-"),
      row("2898", "Flat/Unit", "Total", "-", "-"),
    ]);
    expect(isCovered(rents.get("2898")!)).toBe(false);
  });

  it("ignores rows without a four-digit postcode", () => {
    expect(selectPostcodeRents([row("Total NSW", "House", "Total", 650, 30000), row("", "House", "Total", 650, 1)]).size).toBe(0);
  });
});

describe("workbook layout", () => {
  it("parses the reporting period into a quarter dated its last month", () => {
    const p = parseReportingPeriod("Reporting period: April to June 2026")!;
    expect(p.period).toBe("2026-Q2");
    expect(p.periodDate.toISOString()).toBe("2026-06-01T00:00:00.000Z");
    expect(parseReportingPeriod("October to December 2025")?.period).toBe("2025-Q4");
    expect(parseReportingPeriod("nonsense")).toBeNull();
  });
  it("finds the header row by its first cell", () => {
    expect(findHeaderRow([["Table 2."], ["Reporting period: April to June 2026"], [""], ["Postcode", "Dwelling Types"], ["2000", "Total"]])).toBe(3);
    expect(findHeaderRow([["nothing"]])).toBe(-1);
  });
});

describe("locating the workbook", () => {
  const page = "https://www.dcj.nsw.gov.au/about-us/families-and-communities-statistics/housing-rent-and-sales/rent-and-sales-report.html";
  it("picks the newest rent-tables link on the report page in either spelling", () => {
    const html = `
      <a href="/content/dam/x/rent_tables_december_2025_quarter.xlsx">Dec</a>
      <a href="/content/dam/x/sales-tables-march-2026-quarter.xlsx">Sales</a>
      <a href="/content/dam/x/rent-tables-june-2026-quarter.xlsx">Jun</a>
      <a href="/content/dam/x/rent-tables-march-2026-quarter.xlsx">Mar</a>`;
    expect(findLatestRentTablesUrl(html, page)).toEqual({ url: "https://www.dcj.nsw.gov.au/content/dam/x/rent-tables-june-2026-quarter.xlsx", month: "june", year: 2026 });
    expect(findLatestRentTablesUrl("<p>no links</p>", page)).toBeNull();
  });
  it("falls back to the last eight quarters, newest first, in both spellings", () => {
    const urls = candidateRentTablesUrls(new Date("2026-09-07T00:00:00Z"), "https://x/y");
    expect(urls[0]).toBe("https://x/y/rent-tables-june-2026-quarter.xlsx");
    expect(urls[1]).toBe("https://x/y/rent_tables_june_2026_quarter.xlsx");
    expect(urls[2]).toBe("https://x/y/rent-tables-march-2026-quarter.xlsx");
    expect(urls).toHaveLength(16);
    expect(urls[14]).toBe("https://x/y/rent-tables-september-2024-quarter.xlsx");
  });
});
