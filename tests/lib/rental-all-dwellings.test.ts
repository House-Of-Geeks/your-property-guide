// WA rental feed (1 Oct 2026): an all-dwellings median is shown as "All
// dwellings", with its source, and never as a house rent or in a gross yield.
import fs from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it } from "vitest";
import { RentalMarketAllDwellings } from "@/components/suburb/RentalMarketAllDwellings";
import type { Suburb } from "@/types";
import type { SuburbRentalHistory } from "@/lib/services/rental-service";
import { RENT_ALL_RETRY_MS, isMissingColumnError, resetRentAllColumnState, withRentAllColumn } from "@/lib/services/rental-service";
import { ALL_DWELLINGS_LABEL, allDwellingsRent, isAllDwellingsOnly, quarterSpan, rentalAttribution, rentalSourceLabel } from "@/lib/rental-labels";
import { buildAllDwellingsMarket } from "@/lib/rental-market";
import { buildLandlordModel, investmentFaq, publishedAllDwellingsRent, withArticle, workedFeeLineAll, stateFeeRow } from "@/lib/rental-landlord";
import { buildSnapshotProvenance, buildSnapshotStats, publishesRent } from "@/lib/suburb-snapshot";
import { buildSuburbFaqs } from "@/lib/suburb-faq";

const src = (f: string) => fs.readFileSync(f, "utf8");
const words = (s: string) => s.trim().split(/\s+/).length;

/** What suburb-service hands the page for a WA suburb whose newest row is rental-wa. */
function nedlands(over: Partial<Suburb["stats"]> = {}): Suburb {
  return {
    id: "t", slug: "nedlands-wa-6009", name: "Nedlands", postcode: "6009", state: "WA", region: "Nedlands", description: "", heroImage: "",
    schools: [], amenities: [], transportLinks: [], nearbySuburbs: [],
    stats: { medianHousePrice: 2_100_000, medianUnitPrice: 0, medianRentHouse: 0, medianRentUnit: 0, medianRentAll: 900, annualGrowthHouse: 0, annualGrowthUnit: 0, daysOnMarket: 0, population: 10_000, medianAge: 38, ownerOccupied: 60, renterOccupied: 35, householdsFamily: 70, householdsLonePerson: 20, walkScore: 60, transitScore: null, bikeScore: null, ...over },
    dataFreshness: { rentalAsOf: new Date("2026-09-01T00:00:00Z"), rentalSource: "rental-wa", crimeAsOf: null, crimeSource: null, salesAsOf: new Date("2026-05-01T00:00:00Z"), salesSource: "sales-abs", salesCount: null, salesPeriodEnd: new Date("2024-12-31T00:00:00Z"), censusAsOf: null, hazardAsOf: null, walkabilityAsOf: null, climateAsOf: null },
  };
}

function waRow(period: string, all: number, bonds: number): SuburbRentalHistory {
  const [y, q] = period.split("-Q").map((x) => parseInt(x, 10));
  return { id: period, suburbSlug: "nedlands-wa-6009", suburbName: "Nedlands", postcode: "6009", state: "WA", period, periodDate: new Date(Date.UTC(y, q * 3 - 1, 1)), medianRentHouse: null, medianRentUnit: null, medianRentAll: all, medianRent3Bed: null, medianRent2Bed: null, medianRent1Bed: null, bondLodgements: bonds, source: "rental-wa" };
}
const WA_HISTORY = [waRow("2026-Q3", 900, 53), waRow("2026-Q2", 1000, 47), waRow("2025-Q3", 900, 69), waRow("2025-Q2", 850, 50)];

describe("which rows are all dwellings", () => {
  it("knows the WA feed and a row that carries only the all-dwellings figure", () => {
    expect(isAllDwellingsOnly({ source: "rental-wa", medianRentHouse: null, medianRentUnit: null, medianRentAll: 900 })).toBe(true);
    // A WA row read before the column exists still counts: its rents are not house rents.
    expect(isAllDwellingsOnly({ source: "rental-wa", medianRentHouse: null, medianRentUnit: null })).toBe(true);
    expect(isAllDwellingsOnly({ source: "rental-x", medianRentHouse: null, medianRentUnit: null, medianRentAll: 700 })).toBe(true);
    expect(isAllDwellingsOnly({ source: "rental-nsw", medianRentHouse: 1800, medianRentUnit: 1100, medianRentAll: 1200 })).toBe(false);
    expect(isAllDwellingsOnly({ source: "rental-vic", medianRentHouse: 600, medianRentUnit: null })).toBe(false);
    expect(isAllDwellingsOnly(null)).toBe(false);
    expect(allDwellingsRent({ source: "rental-wa", medianRentHouse: null, medianRentUnit: null, medianRentAll: 0 })).toBeNull();
  });
  it("names the source and credits it under its licence", () => {
    expect(rentalSourceLabel("rental-wa", "6009")).toBe("WA rental bond data");
    const a = rentalAttribution("rental-wa");
    expect(a?.credit).toBe("© Government of Western Australia (Department of Mines, Industry Regulation and Safety) 2023");
    expect(a?.licence).toBe("CC BY 4.0");
    expect(a?.datasetUrl).toContain("west-australia-rental-bonds-data-2023-current");
    expect(rentalAttribution("rental-nsw")).toBeNull();
    expect(quarterSpan("2026-Q3")).toBe("July to September 2026");
  });
});

describe("the WA rental-market view", () => {
  it("shows the newest all-dwellings median, its bonds and the change on a year earlier", () => {
    const m = buildAllDwellingsMarket(nedlands(), WA_HISTORY)!;
    expect(m.current).toMatchObject({ weekly: 900, bonds: 53, period: "2026-Q3", label: "WA rental bond data", span: "July to September 2026", smallSample: false });
    expect(m.change).toEqual({ pct: 0, fromPeriod: "2025-Q3", fromWeekly: 900 });
    expect(m.quarters.map((q) => q.period)).toEqual(["2026-Q3", "2026-Q2", "2025-Q3", "2025-Q2"]);
    expect(m.description).toBe("Median weekly rent across all dwellings in Nedlands 6009: $900 (WA rental bond data, July to September 2026). Flat on a year earlier.");
    expect(m.description.length).toBeLessThanOrEqual(160);
    expect(m.description).not.toMatch(/houses|units|bedroom|yield/i);
    expect(m.subtitle).not.toMatch(/yield/i);
  });
  it("flags a small sample", () => {
    const m = buildAllDwellingsMarket(nedlands(), [waRow("2026-Q3", 820, 15)])!;
    expect(m.current.smallSample).toBe(true);
    expect(m.change).toBeNull();
  });
  it("is not the view for a state whose feed splits houses and units", () => {
    const nsw: SuburbRentalHistory = { ...waRow("2026-Q2", 0, 40), medianRentAll: null, medianRentHouse: 1800, medianRentUnit: 1100, source: "rental-nsw", state: "NSW" };
    expect(buildAllDwellingsMarket(nedlands(), [nsw])).toBeNull();
    expect(buildAllDwellingsMarket(nedlands(), [])).toBeNull();
  });
  it("keeps the page's index rule and the sitemap gate as they were: a rental row, nothing else", () => {
    const page = src("src/app/(marketing)/suburbs/[slug]/rental-market/page.tsx");
    expect(page).toContain("robots: history.length === 0 ? { index: false, follow: true } : undefined,");
    expect(page).toContain("buildAllDwellingsMarket(suburb, history)");
    const sitemap = src("src/app/(marketing)/suburbs/subpages/sitemap.ts");
    expect(sitemap).toContain("getSuburbSlugsWithRentalData()");
    // The sitemap reads every row with a slug; the WA feed writes a row only
    // with a published median (rental-wa-rules planRows), so the two agree.
    expect(src("src/lib/services/rental-service.ts")).toMatch(/where: \{ suburbSlug: \{ not: null \} \},\s*distinct: \["suburbSlug"\]/);
  });
  it("renders as written: label, bonds, change, attribution, no yield, no lost spaces", () => {
    const html = renderToStaticMarkup(React.createElement(RentalMarketAllDwellings, { name: "Nedlands", slug: "nedlands-wa-6009", all: buildAllDwellingsMarket(nedlands(), WA_HISTORY)!, rentListings: false }));
    const text = html.replace(/<[^>]+>/g, " ").replace(/&#x27;/g, "'").replace(/&amp;/g, "&").replace(/\s+/g, " ");
    expect(text).toContain("All dwellings (median) $900/wk");
    expect(text).toContain("Bonds lodged 53");
    expect(text).toContain("On a year earlier No change");
    expect(text).toContain("The median of the 53 bonds lodged in July to September 2026 for properties in Nedlands: houses, units and every other dwelling together. The bond records carry no dwelling type, so this page shows no separate house or unit rent and no gross yield, which needs a house rent against the house price. A year earlier, in July to September 2025, the median was $900.");
    expect(text).toContain("July to September 2026 $900/wk 53");
    expect(text).toContain("April to June 2025 $850/wk 50");
    expect(text).toContain("WA Rental Bonds Data 2023 - Current , © Government of Western Australia (Department of Mines, Industry Regulation and Safety) 2023, used under CC BY 4.0 . Medians worked out by Your Property Guide");
    expect(html).toContain('href="https://creativecommons.org/licenses/by/4.0/"');
    expect(text).not.toMatch(/yield [0-9]|%\s*gross|House \(median\)|Unit \(median\)/i);
    expect(html).not.toContain("View rentals");
  });
  it("renders the all-dwellings label, the attribution and no yield", () => {
    const c = src("src/components/suburb/RentalMarketAllDwellings.tsx");
    expect(c).toContain("ALL_DWELLINGS_LABEL");
    expect(c).toContain("all.attribution.credit");
    expect(c).toContain("all.attribution.licenceUrl");
    expect(c).not.toMatch(/grossYield|yieldHouse|medianHousePrice/);
  });
});

describe("the suburb profile", () => {
  it("shows the rent as all dwellings and no yield tile", () => {
    const tiles = buildSnapshotStats(nedlands());
    expect(tiles.find((t) => t.key === "rent")).toMatchObject({ value: "$900", detail: ALL_DWELLINGS_LABEL });
    expect(tiles.find((t) => t.key === "yield")).toBeUndefined();
    expect(buildSnapshotProvenance(nedlands(), tiles)).toContain("Rent: WA rental bond data, September 2026");
    expect(publishesRent(nedlands())).toBe(true);
  });
  it("prints no rent where the source is unknown", () => {
    const s = nedlands();
    s.dataFreshness = { ...s.dataFreshness!, rentalSource: null };
    expect(buildSnapshotStats(s).find((t) => t.key === "rent")).toBeUndefined();
    expect(publishesRent(s)).toBe(false);
  });
  it("answers the rent question with the all-dwellings median and says what it is", () => {
    const faq = buildSuburbFaqs(nedlands()).find((f) => f.question === "What is the average rent in Nedlands?");
    expect(faq?.answer).toBe("The median weekly rent in Nedlands is $900 across all dwellings (WA rental bond data, September 2026). The bond records behind it carry no dwelling type, so there is no separate figure for houses and units.");
    expect(buildSuburbFaqs(nedlands()).map((f) => f.answer).join(" ")).not.toMatch(/house rent is \$900|yield[^.]*\$900/i);
  });
  it("takes the all-dwellings rent from the service, and the house and unit rents as unknown", () => {
    const svc = src("src/lib/services/suburb-service.ts");
    expect(svc).toContain("rentalRentHouse: isAllDwellingsOnly(rental) ? 0 : rental?.medianRentHouse ?? null,");
    expect(svc).toContain("rentalRentUnit:  isAllDwellingsOnly(rental) ? 0 : rental?.medianRentUnit  ?? null,");
    expect(svc).toContain("medianRentAll:     rentalRentAll ?? 0,");
    const page = src("src/app/(marketing)/suburbs/[slug]/page.tsx");
    expect(page).toContain('label="Weekly rent (all dwellings)"');
  });
});

describe("the landlord blocks on an all-dwellings rent", () => {
  it("work the fee on it, say what it is, and never a yield", () => {
    const m = buildLandlordModel(nedlands({ medianHousePrice: 2_100_000 }), WA_HISTORY);
    expect(m.rent).toBeNull();
    expect(m.yieldHouse).toBeNull();
    expect(m.allRent).toMatchObject({ weekly: 900, label: "WA rental bond data", when: "September 2026", bonds: 53, changePct: 0 });
    expect(m.workedLine).toBe("At Nedlands's median rent of $900 a week across all dwellings (WA rental bond data, September 2026), an 8.7% management fee is about $4,072 a year, and a letting fee of 1.7 weeks' rent is about $1,530 each time a new tenant signs.");
    const invest = m.faqs.find((f) => f.question === "Is Nedlands a good rental investment?");
    expect(invest?.answer).toContain("No gross yield is worked out for Nedlands here");
    expect(invest?.answer).toContain("a median rent of $900 a week across all dwellings in July to September 2026 (WA rental bond data, 53 bonds), the same as a year earlier.");
    expect(words(invest!.answer)).toBeGreaterThanOrEqual(40);
    const appraisal = m.faqs.find((f) => f.question === "What is involved in a rental appraisal?");
    expect(appraisal?.answer).toContain("In Nedlands the median rent across all dwellings is $900 a week (WA rental bond data, September 2026)");
  });
  it("report the change when there is one", () => {
    const rent = publishedAllDwellingsRent([waRow("2026-Q3", 990, 40), waRow("2025-Q3", 900, 60)], nedlands())!;
    expect(rent.changePct).toBe(10);
    const f = investmentFaq("Nedlands", { yieldHouse: null, growthHouse: null, rent: null, medianHousePrice: 0, salesShort: null, growthSource: null, allRent: rent });
    expect(f?.answer).toContain("up 10% on the same quarter a year earlier");
  });
  it("leave a house rent's yield exactly as before", () => {
    const fees = stateFeeRow("WA")!;
    expect(workedFeeLineAll("Nedlands", { weekly: 0, label: "x", when: "y", span: "z", bonds: null, source: "rental-wa", changePct: null }, fees)).toBeNull();
    expect(investmentFaq("Picton", { yieldHouse: null, growthHouse: null, rent: null, medianHousePrice: 900_000, salesShort: null, growthSource: null })).toBeNull();
  });
  it("use the article the figure is spoken with", () => {
    expect(withArticle("8.7%")).toBe("an 8.7%");
    expect(withArticle("8%")).toBe("an 8%");
    expect(withArticle("11%")).toBe("an 11%");
    expect(withArticle("18.5%")).toBe("an 18.5%");
    expect(withArticle("5.8%")).toBe("a 5.8%");
    expect(withArticle("1.1%")).toBe("a 1.1%");
    expect(withArticle("110%")).toBe("a 110%");
  });
});

describe("reading the medianRentAll column before and after the DDL", () => {
  beforeEach(() => resetRentAllColumnState());
  const missing = Object.assign(new Error("The column `SuburbRentalStat.medianRentAll` does not exist in the current database."), { code: "P2022" });

  it("reads with the column once it exists", async () => {
    const calls: boolean[] = [];
    const out = await withRentAllColumn(async (withAll) => { calls.push(withAll); return "rows"; });
    expect(out).toBe("rows");
    expect(calls).toEqual([true]);
  });
  it("falls back without it, remembers that for a minute, then tries again", async () => {
    let t = 1_000_000;
    const now = () => t;
    const calls: boolean[] = [];
    const read = async (withAll: boolean) => { calls.push(withAll); if (withAll) throw missing; return "rows"; };
    expect(await withRentAllColumn(read, now)).toBe("rows");
    expect(calls).toEqual([true, false]);
    t += RENT_ALL_RETRY_MS - 1;
    await withRentAllColumn(read, now);
    expect(calls).toEqual([true, false, false]);
    t += 1;
    await withRentAllColumn(read, now);
    expect(calls).toEqual([true, false, false, true, false]);
  });
  it("lets every other error through", async () => {
    await expect(withRentAllColumn(async () => { throw new Error("connection refused"); })).rejects.toThrow("connection refused");
    expect(isMissingColumnError(new Error('column "medianRentAll" does not exist'))).toBe(true);
    expect(isMissingColumnError(new Error('column "other" does not exist'))).toBe(false);
    expect(isMissingColumnError(null)).toBe(false);
  });
  it("is how every reader of the table reads it: never a read that names every column", () => {
    for (const f of ["src/lib/services/rental-service.ts", "src/lib/services/suburb-service.ts", "src/lib/services/data-freshness.ts"]) {
      expect(src(f), f).toContain("medianRentAll: withAll");
    }
    // A findMany/findFirst without a select names every column, the new one
    // included, and fails before the DDL. Each call in src has a select.
    const files = (fs.readdirSync("src", { recursive: true, encoding: "utf8" }) as string[])
      .map((f) => `src/${f.split("\\").join("/")}`)
      .filter((f) => /\.(ts|tsx)$/.test(f) && !f.startsWith("src/generated/"));
    let calls = 0;
    for (const f of files) {
      const s = src(f);
      for (const m of s.matchAll(/suburbRentalStat\.(findMany|findFirst|findUnique)\(/g)) {
        calls++;
        const body = s.slice(m.index, m.index + 600);
        const end = body.indexOf("})");
        expect(body.slice(0, end), `${f}: ${body.slice(0, 80)}`).toContain("select");
      }
    }
    expect(calls).toBeGreaterThanOrEqual(4);
  });
});
