// Why a profile withholds its median, and where its figures come from
// (commercial intent review, suburbs-market 0.5, 10 Oct 2026).
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  PENDING_PRICE_NOTE,
  STATE_RENT_SOURCE_LINE,
  STATE_SALES_AGENCY,
  STATE_SALES_SOURCE_LINE,
  profileSourceLine,
  withheldPriceNote,
} from "@/lib/suburb-data-quality";
import { RENTAL_FEED_STATES } from "../../scripts/sync/sources/rent-proxy-rules";

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

describe("withheldPriceNote", () => {
  it("a rental feed's label on the sales columns (NSW and VIC on 1 Oct 2026): re-checked against the state's sales agency", () => {
    const n = withheldPriceNote({ name: "Mosman", state: "NSW", statsSource: "rental-nsw", salesCount: 228 });
    expect(n.kind).toBe("label");
    expect(n.label).toBe("Median being re-checked");
    expect(n.note).toBe(
      "The sales figure on file for Mosman carries a rental feed's label, so we can't confirm it came from the NSW Valuer General. We don't show it until it has been checked against the NSW Valuer General's figures.",
    );
    expect(withheldPriceNote({ name: "Hawthorn East", state: "VIC", statsSource: "rental-vic", salesCount: null }).note).toContain("Land Victoria");
    expect(withheldPriceNote({ name: "Morayfield", state: "QLD", statsSource: "rental-qld", salesCount: null }).note).toContain("the ABS");
  });

  it("the census-mortgage estimate is named as an estimate, not a median", () => {
    for (const statsSource of ["sales-qld", "sales-wa"]) {
      const n = withheldPriceNote({ name: "Surfers Paradise", state: "QLD", statsSource, salesCount: null });
      expect(n.kind).toBe("estimate");
      expect(n.note).toMatch(/estimate worked back from 2021 Census mortgage repayments/);
    }
  });

  it("no trusted feed: says so, and no longer promises a data partner or state-level figures", () => {
    for (const statsSource of ["seed", "abs-census-2021", "", null, undefined]) {
      const n = withheldPriceNote({ name: "Balladonia", state: "WA", statsSource, salesCount: null });
      expect(n.kind, String(statsSource)).toBe("no-feed");
      expect(n.note).toBe("No trusted sales feed has a house median for Balladonia yet, so we don't show one.");
    }
    expect(PENDING_PRICE_NOTE).not.toMatch(/data partner|state-level/);
  });

  it("fewer than five sales: the count and the period", () => {
    const n = withheldPriceNote({ name: "Bermagui", state: "NSW", statsSource: "sales-nsw", salesCount: 3, period: "calendar 2025" });
    expect(n.kind).toBe("thin-sales");
    expect(n.label).toBe("Too few sales for a median");
    expect(n.note).toBe("Only 3 house sales were recorded in calendar 2025, too few for a reliable median. We publish one from 5 sales or more.");
    expect(withheldPriceNote({ name: "X", state: "NSW", statsSource: "sales-nsw", salesCount: 1, period: "calendar 2025" }).note).toMatch(/^Only 1 house sale was recorded/);
  });

  it("a unit median above the house median (Kew East): both withheld while the row is checked, no figure printed", () => {
    const n = withheldPriceNote({ name: "Kew East", state: "VIC", statsSource: "sales-vic", salesCount: null, rawHouse: 660_000, rawUnit: 1_396_000 });
    expect(n.kind).toBe("inverted");
    expect(n.note).toBe("Land Victoria's figures for Kew East put the unit median above the house median, which points to an error in the data, so we have withheld both while we check them.");
    expect(n.note).not.toMatch(/\$|\d/);
  });

  it("a trusted feed with no house median for the suburb", () => {
    const n = withheldPriceNote({ name: "Docklands", state: "VIC", statsSource: "sales-vic", salesCount: null, period: "the latest published quarter (updated May 2026)", rawHouse: 0, rawUnit: 610_000 });
    expect(n.kind).toBe("no-median");
    expect(n.note).toBe("Land Victoria gives no house median for Docklands in the latest published quarter (updated May 2026).");
  });

  it("never prints a dollar figure or a percentage", () => {
    for (const state of STATES) {
      for (const statsSource of ["rental-nsw", "sales-qld", "seed", "sales-nsw", "sales-vic", "sales-abs", null]) {
        for (const salesCount of [null, 2, 40]) {
          const n = withheldPriceNote({ name: "Test", state, statsSource, salesCount, rawHouse: 500_000, rawUnit: 900_000 });
          expect(`${n.label} ${n.note}`).not.toMatch(/\$|%/);
        }
      }
    }
  });
});

describe("the profile's source line", () => {
  it("names a sales agency and a rent source for every state, and no revenue office", () => {
    for (const state of STATES) {
      expect(STATE_SALES_AGENCY[state], state).toBeTruthy();
      expect(STATE_SALES_SOURCE_LINE[state], state).toBeTruthy();
      expect(STATE_RENT_SOURCE_LINE[state], state).toBeTruthy();
      expect(profileSourceLine(state)).not.toMatch(/revenue office/i);
    }
    expect(profileSourceLine("NSW")).toBe(
      "House medians and 12-month changes from the NSW Valuer General's property sales records; rents from the NSW Department of Communities and Justice's Rent and Sales Report (rental bonds).",
    );
    expect(profileSourceLine("vic")).toMatch(/^House and unit medians from Land Victoria .*Homes Victoria's Rental Report/);
    expect(profileSourceLine("SA")).toMatch(/SA Government/);
    expect(profileSourceLine("QLD")).toMatch(/ABS.*Residential Tenancies Authority/);
  });

  it("names a 12-month change only for the feeds that measure one (NSW, SA)", () => {
    for (const state of STATES) {
      expect(/12-month/.test(STATE_SALES_SOURCE_LINE[state]), state).toBe(state === "NSW" || state === "SA");
    }
  });

  it("names bond data exactly where a rental feed is loaded, the 2021 Census elsewhere", () => {
    for (const state of STATES) {
      const hasFeed = (RENTAL_FEED_STATES as readonly string[]).includes(state);
      expect(STATE_RENT_SOURCE_LINE[state].includes("2021 Census"), state).toBe(!hasFeed);
      expect(/bonds|bond data/i.test(STATE_RENT_SOURCE_LINE[state]), state).toBe(hasFeed);
    }
  });

  it("is what the profile footer prints", () => {
    const page = fs.readFileSync("src/app/(marketing)/suburbs/[slug]/page.tsx", "utf8");
    expect(page).toContain("{profileSourceLine(suburb.state)}");
    expect(page).not.toMatch(/state revenue offices/);
    expect(page).not.toMatch(/within a week|partner brokers/);
    expect(page).toContain("withheldPriceNote({");
  });
});
