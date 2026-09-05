// R6 of the September 2026 fix review: every title builder stays inside the
// SERP budget before the " | Your Property Guide" suffix, and no description
// prints a dollar figure for a suburb whose price fails the reliability gate.
//
// Why 60: Google truncates titles at roughly 600px, which is 55–65 characters
// of mixed-case text. The root layout appends " | Your Property Guide" (22
// chars) on top of whatever these builders return, so anything over 60 here is
// guaranteed to be cut or rewritten in results (see the search review: the
// current suburb title is shown as "Morayfield Postcode 4506 (QLD) - Suburbs").
import { describe, expect, it } from "vitest";
import type { Suburb } from "@/types";
import {
  suburbBuyDescription,
  suburbBuyTitle,
  suburbDescription,
  suburbRentDescription,
  suburbRentTitle,
  suburbTitle,
} from "@/lib/utils/seo";
import { hasReliablePrice } from "@/lib/suburb-data-quality";

const TITLE_BUDGET = 60;      // characters, before the brand suffix
const DESCRIPTION_BUDGET = 160;

function makeSuburb(overrides: Partial<Suburb> & { salesSource?: string | null }): Suburb {
  const { salesSource = "sales-nsw", ...rest } = overrides;
  return {
    id: "test",
    slug: "test-suburb-nsw-2000",
    name: "Test Suburb",
    postcode: "2000",
    state: "NSW",
    region: "Sydney",
    description: "",
    heroImage: "",
    schools: [],
    amenities: [],
    transportLinks: [],
    nearbySuburbs: [],
    stats: {
      medianHousePrice: 1_095_000,
      medianUnitPrice: 520_000,
      medianRentHouse: 650,
      medianRentUnit: 480,
      annualGrowthHouse: 6,
      annualGrowthUnit: 3,
      daysOnMarket: 30,
      population: 24_898,
      medianAge: 34,
      ownerOccupied: 53,
      renterOccupied: 44,
      householdsFamily: 75,
      householdsLonePerson: 21,
      walkScore: 60,
      transitScore: null,
      bikeScore: null,
    },
    dataFreshness: {
      rentalAsOf: null, rentalSource: null,
      crimeAsOf: null, crimeSource: null,
      salesAsOf: new Date("2026-06-30"), salesSource,
      censusAsOf: null, hazardAsOf: null, walkabilityAsOf: null, climateAsOf: null,
    },
    ...rest,
  };
}

// The longest names that actually rank, from the Search Console and sitemap
// exports of 5 Sep 2026. If a builder survives these it survives everything.
const LONG_NAMES: Array<Pick<Suburb, "name" | "postcode" | "state">> = [
  { name: "Karratha Industrial Estate", postcode: "6714", state: "WA" },
  { name: "Catherine Hill Bay", postcode: "2281", state: "NSW" },
  { name: "Upper Caboolture", postcode: "4510", state: "QLD" },
  { name: "Chermside South", postcode: "4032", state: "QLD" },
  { name: "Surfers Paradise", postcode: "4217", state: "QLD" },
  { name: "Loganholme Bc", postcode: "4129", state: "QLD" },
  { name: "Brighton East", postcode: "3187", state: "VIC" },
  { name: "Morayfield", postcode: "4506", state: "QLD" },
];

describe("suburb titles stay inside the SERP budget", () => {
  // KNOWN FAILURE, deliberately kept visible. The current profile title is
  // "{Name} Postcode {XXXX} ({State}) — Suburb Profile & Median Price", which is
  // 62+ characters even for "Morayfield" and gets rewritten by Google. It is
  // replaced under item 2 of the fix review (cohort rollout, SA/TAS first).
  // `it.fails` passes while the assertion fails and FAILS once item 2 lands, so
  // whoever ships item 2 must remove the `.fails` marker in the same commit.
  it.fails("profile title (suburbTitle) is under 60 characters — fails until fix item 2 ships", () => {
    for (const s of LONG_NAMES) {
      expect(suburbTitle(makeSuburb(s)).length, `${s.name}: ${suburbTitle(makeSuburb(s))}`).toBeLessThanOrEqual(TITLE_BUDGET);
    }
  });

  it("buy and rent sub-page titles are under 60 characters", () => {
    for (const s of LONG_NAMES) {
      const buy = suburbBuyTitle(makeSuburb(s));
      const rent = suburbRentTitle(makeSuburb(s));
      expect(buy.length, `${s.name}: ${buy}`).toBeLessThanOrEqual(TITLE_BUDGET);
      expect(rent.length, `${s.name}: ${rent}`).toBeLessThanOrEqual(TITLE_BUDGET);
    }
  });

  it("titles never contain a dollar figure (prices belong in descriptions, behind the gate)", () => {
    for (const s of LONG_NAMES) {
      const sub = makeSuburb(s);
      for (const t of [suburbTitle(sub), suburbBuyTitle(sub), suburbRentTitle(sub)]) {
        expect(t).not.toMatch(/\$/);
      }
    }
  });
});

describe("descriptions respect the price-reliability gate", () => {
  const unreliableSources: Array<string | null> = ["sales-qld", "sales-wa", "seed", null];

  it("profile description prints the median only when hasReliablePrice is true", () => {
    const reliable = makeSuburb({ name: "Morayfield", postcode: "4506", state: "QLD", salesSource: "sales-abs" });
    expect(hasReliablePrice(reliable)).toBe(true);
    expect(suburbDescription(reliable)).toMatch(/\$1\.1M/);

    for (const source of unreliableSources) {
      const s = makeSuburb({ name: "Morayfield", postcode: "4506", state: "QLD", salesSource: source });
      expect(hasReliablePrice(s)).toBe(false);
      expect(suburbDescription(s), `source=${source}`).not.toMatch(/\$/);
    }
  });

  it("profile description keeps a zeroed price out even when the source is trusted", () => {
    // suburb-service zeroes medianHousePrice for unreliable rows; a trusted
    // source with a 0 must still print nothing rather than "$0K".
    const s = makeSuburb({ name: "Morayfield", postcode: "4506", state: "QLD" });
    s.stats.medianHousePrice = 0;
    expect(hasReliablePrice(s)).toBe(false);
    expect(suburbDescription(s)).not.toMatch(/\$/);
  });

  it("buy and rent sub-page descriptions never print a dollar figure for an unreliable price", () => {
    for (const source of unreliableSources) {
      const s = makeSuburb({ name: "Morayfield", postcode: "4506", state: "QLD", salesSource: source });
      s.stats.medianHousePrice = 0; // what suburb-service hands the page for unreliable rows
      s.stats.medianRentHouse = 0;
      expect(suburbBuyDescription(s), `buy, source=${source}`).not.toMatch(/\$/);
      expect(suburbRentDescription(s), `rent, source=${source}`).not.toMatch(/\b0\/wk/);
    }
  });

  it("profile description stays inside 160 characters where the builder promises it (metro and directional names)", () => {
    const metro = makeSuburb({ name: "Brighton East", postcode: "3187", state: "VIC", salesSource: "sales-vic" });
    expect(suburbDescription(metro).length).toBeLessThanOrEqual(DESCRIPTION_BUDGET);
    const capital = makeSuburb({ name: "Chermside South", postcode: "4032", state: "QLD", salesSource: "sales-abs" });
    expect(suburbDescription(capital).length).toBeLessThanOrEqual(DESCRIPTION_BUDGET);
  });
});
