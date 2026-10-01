// WA rental feed (1 Oct 2026): bond lodgements → quarterly all-dwellings
// medians, published at 11+ bonds and fewer than half at one rent, matched to
// WA localities on name and postcode, written as medianRentAll only.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  MAX_SINGLE_RENT_SHARE,
  MIN_BONDS,
  RECENT_QUARTERS,
  SMALL_SAMPLE_MAX,
  aggregateQuarterly,
  buildSuburbIndex,
  classifyCell,
  completeQuarters,
  emptyTally,
  isLodgementEntry,
  medianRent,
  normaliseLocality,
  parseLodgementCsv,
  parseLodgementDate,
  parseWeeklyRent,
  planRows,
  quarterOf,
  resolveLocality,
  singleRentShare,
  type Lodgement,
  type SuburbRef,
} from "../../scripts/sync/sources/rental-wa-rules";

const src = (f: string) => fs.readFileSync(f, "utf8");

describe("parsing the lodgement CSVs", () => {
  it("reads the bond form's dates", () => {
    expect(parseLodgementDate("01-JUN-26")).toEqual({ year: 2026, month: 6 });
    expect(parseLodgementDate("1-Dec-25")).toEqual({ year: 2025, month: 12 });
    expect(parseLodgementDate("15-SEP-2026")).toEqual({ year: 2026, month: 9 });
    expect(parseLodgementDate("2026-06-01")).toBeNull();
    expect(parseLodgementDate("01-XYZ-26")).toBeNull();
    expect(parseLodgementDate("")).toBeNull();
  });
  it("reads rents with cents, a dollar sign or a separator", () => {
    expect(parseWeeklyRent("457.50")).toBe(457.5);
    expect(parseWeeklyRent("$1,200")).toBe(1200);
    expect(parseWeeklyRent("650")).toBe(650);
    expect(parseWeeklyRent("n/a")).toBeNull();
    expect(parseWeeklyRent("")).toBeNull();
  });
  it("reduces the spellings of one locality to one", () => {
    for (const v of [" Ashby, WA", "ASHBY WA", "Ashby", "ashby ", "ASHBY,"]) expect(normaliseLocality(v)).toBe("ASHBY");
    expect(normaliseLocality("SOUTH HEDLAND  WA")).toBe("SOUTH HEDLAND");
    expect(normaliseLocality(":PERTH")).toBe("PERTH");
    expect(normaliseLocality(", MURDOCH")).toBe("MURDOCH");
    expect(normaliseLocality("Ocean Reef")).toBe("OCEAN REEF");
    expect(normaliseLocality("WATTLE GROVE")).toBe("WATTLE GROVE");
    expect(normaliseLocality("O\u2019CONNOR")).toBe("O'CONNOR");
    expect(normaliseLocality("O'Connor")).toBe("O'CONNOR");
  });
  it("takes only the lodgement CSVs from the ZIP, whatever the folder is called", () => {
    expect(isLodgementEntry("wa-rental-bond-sep2026/Monthly Bond Lodgement Summary (CSV)-(01-06-2026-30-06-2026).csv")).toBe(true);
    expect(isLodgementEntry("wa-rental-bond/Monthly Bond Lodgement Summary (CSV)-(01-07-2024-31-07-2024).csv")).toBe(true);
    expect(isLodgementEntry("__MACOSX/wa-rental-bond/._Monthly Bond Lodgement Summary (CSV)-(01-07-2024-31-07-2024).csv")).toBe(false);
    expect(isLodgementEntry("wa-rental-bond/._Monthly Bond Lodgement Summary (CSV)-(01-07-2024-31-07-2024).csv")).toBe(false);
    expect(isLodgementEntry("wa-rental-bond/Monthly Bond Disposal Summary (CSV)-(01-06-2023-30-06-2023).csv")).toBe(false);
    expect(isLodgementEntry("wa-rental-bond/Bonds by Postcode Summary (CSV)-2026-Jul.csv")).toBe(false);
  });
  it("parses a file as published (BOM, quoted, CRLF) and drops what is not a rent", () => {
    const csv = "﻿\"LODGEMENT DATE\",\"LOCALITY NAME\",\"POSTCODE\",\"WEEKLY RENT AMOUNT\"\r\n" +
      "\"01-JUN-26\",\"PERTH\",\"6000\",\"1000\"\r\n" +
      "\"02-JUN-26\",\" Highgate, WA\",\"6003\",\"660.50\"\r\n" +
      "\"03-JUN-26\",\"NEDLANDS\",\"6009\",\"0\"\r\n" +
      "\"03-JUN-26\",\"NEDLANDS\",\"6009\",\"85000\"\r\n" +
      "\"bad\",\"NEDLANDS\",\"6009\",\"700\"\r\n" +
      "\"04-JUN-26\",\"\",\"6009\",\"700\"\r\n" +
      "\"04-JUN-26\",\"NEDLANDS\",\"60\",\"700\"\r\n";
    const tally = emptyTally();
    const rows = parseLodgementCsv(csv, tally);
    expect(rows).toEqual([
      { locality: "PERTH", postcode: "6000", year: 2026, month: 6, rent: 1000 },
      { locality: "HIGHGATE", postcode: "6003", year: 2026, month: 6, rent: 660.5 },
    ]);
    expect(tally).toEqual({ rows: 7, kept: 2, badDate: 1, badRent: 0, outlier: 2, noPlace: 2 });
  });
});

describe("quarters", () => {
  it("dates a quarter on the first day of its last month, as the NSW feed does", () => {
    expect(quarterOf(2026, 6)).toEqual({ period: "2026-Q2", periodDate: new Date(Date.UTC(2026, 5, 1)) });
    expect(quarterOf(2026, 7)).toEqual({ period: "2026-Q3", periodDate: new Date(Date.UTC(2026, 8, 1)) });
    expect(quarterOf(2025, 12).period).toBe("2025-Q4");
  });
  it("counts a quarter only when all three of its months are in the data", () => {
    const months = [];
    for (let y = 2023; y <= 2026; y++) for (let m = 1; m <= 12; m++) {
      if ((y === 2023 && m < 3) || (y === 2026 && m > 8)) continue; // March 2023 to August 2026
      months.push({ year: y, month: m });
    }
    const q = completeQuarters(months);
    expect(q[0].period).toBe("2026-Q2"); // July and August alone do not make 2026-Q3
    expect(q[q.length - 1].period).toBe("2023-Q2"); // March alone does not make 2023-Q1
    expect(q).toHaveLength(13);
    expect(completeQuarters([...months, { year: 2026, month: 9 }])[0].period).toBe("2026-Q3");
  });
});

describe("the median and when it is published", () => {
  it("is the middle value, or the mean of the middle two, in whole dollars", () => {
    expect(medianRent([500, 700, 600])).toBe(600);
    expect(medianRent([1200, 1295])).toBe(1248); // 1,247.50 rounds up
    expect(medianRent([650])).toBe(650);
    expect(() => medianRent([])).toThrow();
  });
  it("needs more than 10 bonds, the line DCJ draws for NSW", () => {
    expect(MIN_BONDS).toBe(11);
    expect(classifyCell(10, 0.1)).toBe("too-few-bonds");
    expect(classifyCell(11, 0.1)).toBe("published");
    expect(SMALL_SAMPLE_MAX).toBe(30);
  });
  it("withholds a quarter where half or more of the bonds share one rent", () => {
    expect(MAX_SINGLE_RENT_SHARE).toBe(0.5);
    // Karratha 6714, July to September 2026: 10 of 15 bonds at $280.
    const karratha = [280, 280, 280, 280, 280, 280, 280, 280, 280, 280, 750, 1000, 1100, 1200, 1300];
    expect(singleRentShare(karratha)).toEqual({ share: 10 / 15, rent: 280 });
    expect(classifyCell(karratha.length, singleRentShare(karratha).share)).toBe("single-rent");
    const half = [500, 500, 500, 500, 500, 500, 600, 700, 800, 900, 950, 990];
    expect(classifyCell(half.length, singleRentShare(half).share)).toBe("single-rent");
    const market = [600, 600, 600, 650, 680, 700, 720, 750, 780, 800, 850, 900];
    expect(classifyCell(market.length, singleRentShare(market).share)).toBe("published");
  });
});

const lodge = (locality: string, postcode: string, year: number, month: number, rents: number[]): Lodgement[] =>
  rents.map((rent) => ({ locality, postcode, year, month, rent }));

describe("aggregating by locality, postcode and quarter", () => {
  const rows = [
    ...lodge("NEDLANDS", "6009", 2026, 7, [800, 850, 900, 950]),
    ...lodge("NEDLANDS", "6009", 2026, 8, [900, 900, 1000, 1100]),
    ...lodge("NEDLANDS", "6009", 2026, 9, [880, 920, 1200]),
    ...lodge("NEDLANDS", "6009", 2026, 4, Array(12).fill(1000)),
    ...lodge("DARCH", "6065", 2026, 9, [820, 850, 900]),
    ...lodge("NEDLANDS", "6009", 2023, 9, [500, 600]),
  ];
  const periods = [quarterOf(2026, 9), quarterOf(2026, 6)];
  const cells = aggregateQuarterly(rows, periods);
  const get = (loc: string, p: string) => cells.find((c) => c.locality === loc && c.period === p);

  it("gives each quarter its median, bond count and status", () => {
    expect(get("NEDLANDS", "2026-Q3")).toMatchObject({ bonds: 11, median: 900, status: "published", smallSample: true, postcode: "6009" });
    expect(get("NEDLANDS", "2026-Q3")?.periodDate).toEqual(new Date(Date.UTC(2026, 8, 1)));
    expect(get("NEDLANDS", "2026-Q2")).toMatchObject({ bonds: 12, status: "single-rent" });
    expect(get("DARCH", "2026-Q3")).toMatchObject({ bonds: 3, status: "too-few-bonds" });
  });
  it("leaves out quarters outside the window", () => {
    expect(get("NEDLANDS", "2023-Q3")).toBeUndefined();
  });
});

const sub = (name: string, postcode: string, state = "WA"): SuburbRef => ({
  id: `${name}-${postcode}`, slug: `${name.toLowerCase().replace(/ /g, "-")}-${state.toLowerCase()}-${postcode}`, name, postcode, state,
});

describe("matching to WA suburbs", () => {
  const index = buildSuburbIndex([
    sub("Nedlands", "6009"),
    sub("Ocean Reef", "6027"),
    sub("Port Hedland", "6721"),
    sub("South Hedland", "6722"),
    sub("Perth", "6000", "SA"), // not WA
    sub("Kewdale", "2000"), // a WA row with an NSW postcode: not a place
    sub("Twin", "6100"),
    sub("Twin", "6100"),
  ]);
  it("matches on name and postcode exactly", () => {
    expect(resolveLocality(index, "NEDLANDS", "6009")?.slug).toBe("nedlands-wa-6009");
    expect(resolveLocality(index, "OCEAN REEF", "6027")?.slug).toBe("ocean-reef-wa-6027");
  });
  it("attaches nothing on a wrong postcode, another state, a misfiled row or a shared name", () => {
    expect(resolveLocality(index, "SOUTH HEDLAND", "6721")).toBeNull(); // South Hedland is 6722
    expect(resolveLocality(index, "PERTH", "6000")).toBeNull();
    expect(resolveLocality(index, "KEWDALE", "2000")).toBeNull();
    expect(resolveLocality(index, "TWIN", "6100")).toBeNull();
  });
  it("writes a suburb only with a published median in the recent quarters, and its earlier quarters with it", () => {
    const cells = aggregateQuarterly([
      ...lodge("NEDLANDS", "6009", 2026, 9, [700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200]),
      ...lodge("NEDLANDS", "6009", 2024, 6, [600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100]),
      // Only an old published quarter, as Karratha 6714 has (April to June 2024): not written.
      ...lodge("OCEAN REEF", "6027", 2024, 6, [500, 520, 540, 540, 560, 580, 600, 620, 640, 660, 700, 720, 740, 760, 780, 800]),
    ], [quarterOf(2026, 9), quarterOf(2024, 6)]);
    const plan = planRows(cells, index, new Set(["2026-Q3"]));
    expect(plan.rows.map((r) => `${r.slug} ${r.period}`)).toEqual(["nedlands-wa-6009 2026-Q3", "nedlands-wa-6009 2024-Q2"]);
    expect(plan.stale).toEqual([{ locality: "OCEAN REEF", postcode: "6027", period: "2024-Q2", median: 630, bonds: 16 }]);
    expect(RECENT_QUARTERS).toBe(4);
  });
  it("plans one row per suburb and published quarter, and reports the rest", () => {
    const cells = aggregateQuarterly([
      ...lodge("NEDLANDS", "6009", 2026, 9, [700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200]),
      ...lodge("SOUTH HEDLAND", "6721", 2026, 9, [600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150]),
      ...lodge("OCEAN REEF", "6027", 2026, 9, [900, 950]),
    ], [quarterOf(2026, 9)]);
    const plan = planRows(cells, index);
    expect(plan.rows).toEqual([
      { id: "Nedlands-6009", slug: "nedlands-wa-6009", name: "Nedlands", postcode: "6009", period: "2026-Q3", periodDate: new Date(Date.UTC(2026, 8, 1)), median: 950, bonds: 11 },
    ]);
    expect(plan.unmatched).toEqual([{ locality: "SOUTH HEDLAND", postcode: "6721", bonds: 12, quarters: 1 }]);
  });
});

describe("the feed", () => {
  const feed = src("scripts/sync/sources/rental-wa.ts");
  it("writes the median as all dwellings, never as a house or unit rent", () => {
    expect(feed).toContain('"medianRentAll"   = EXCLUDED."medianRentAll"');
    expect(feed).toContain('"medianRentHouse" = NULL');
    expect(feed).toContain('"medianRentUnit"  = NULL');
    expect(feed).not.toMatch(/"medianRentHouse"\s*=\s*u\./);
    // The Suburb row's house and unit rents become unknown, never the median.
    expect(feed).toMatch(/SET "medianRentHouse" = 0,\s*"medianRentUnit"\s*= 0,/);
    expect(feed).not.toContain('"statsSource"');
    // and keeps a rollback record of the Suburb rents it replaces, before writing.
    expect(feed.indexOf("writeFileSync(out,")).toBeGreaterThan(feed.indexOf("if (dryRun) {"));
    expect(feed.indexOf("writeFileSync(out,")).toBeLessThan(feed.indexOf('INSERT INTO "SuburbRentalStat"'));
    expect(feed).toContain("wa-rents-replaced.csv");
  });
  it("resolves the ZIP through CKAN and lists localities only", () => {
    expect(feed).toContain('getCkanDownloadUrl(PACKAGE_ID, CKAN_BASE, "ZIP")');
    expect(feed).toContain('PACKAGE_ID = "west-australia-rental-bonds-data-2023-current"');
    expect(feed).toContain("...LOCALITIES_ONLY");
  });
  it("writes nothing on a dry run, and nothing at all before the column exists", () => {
    const beforeWrites = feed.slice(0, feed.indexOf('INSERT INTO "SuburbRentalStat"'));
    expect(beforeWrites).toContain('if (dryRun) {');
    expect(beforeWrites).toMatch(/if \(!dryRun\) \{\s*\/\/[^\n]*\n\s*if \(!\(await columnExists\(\)\)\)/);
  });
  it("is registered but runs only by name until Jos approves it", () => {
    const run = src("scripts/sync/run.ts");
    expect(run).toMatch(/"rental-wa":\s*\{ run: syncRentalWa,\s*schedule: "manual"\s*\}/);
    expect(run).toContain('filter(([, v]) => v.schedule !== "manual")');
    expect(src("scripts/cron/quarterly.sh")).not.toMatch(/^run rental-wa/m);
    expect(src(".github/workflows/sync-quarterly.yml")).not.toContain("rental-wa");
  });
  it("ships the DDL it needs, additive and idempotent", () => {
    const sql = src("scripts/sql/2026-10-01-suburb-rental-stat-median-rent-all.sql");
    expect(sql).toContain('ALTER TABLE "SuburbRentalStat" ADD COLUMN IF NOT EXISTS "medianRentAll" INTEGER;');
    expect(sql.split("\n").filter((l) => !l.startsWith("--") && /\b(DROP|DELETE|UPDATE)\b/i.test(l))).toEqual([]);
    expect(src("prisma/schema.prisma")).toMatch(/medianRentAll\s+Int\?/);
  });
});
