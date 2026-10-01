// R6 of the September 2026 fix review: every title builder stays inside the
// SERP budget before the " | Your Property Guide" suffix, and no description
// prints a dollar figure for a suburb whose price fails the reliability gate.
//
// Why 60: Google truncates titles at roughly 600px, which is 55–65 characters
// of mixed-case text. The root layout appends " | Your Property Guide" (22
// chars) on top of whatever these builders return, so anything over 60 here is
// guaranteed to be cut or rewritten in results (the search review of 5 Sep
// 2026 showed the old suburb title as "Morayfield Postcode 4506 (QLD) - Suburbs").
//
// Fix item 2 (commercial intent review 3.8, 30 Sep 2026): the profile title
// leads with the suburb and "House Prices", and the description with the
// published median, its source and period, and the 12-month change where a
// feed measures one. Both read the gated Suburb object through the same
// rules as the page (hasReliablePrice, publishedGrowthFor), so a suburb whose
// median the page withholds shows no dollar figure and no growth figure.
// They apply to the SA and TAS cohort first (R4); the rest of the country
// keeps today's builders as the control, tested below as they were on main.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Suburb } from "@/types";
import {
  TITLE_COHORT_STATES,
  inTitleCohort,
  legacySuburbDescription,
  legacySuburbTitle,
  suburbBuyDescription,
  suburbBuyTitle,
  suburbDescription,
  suburbDescriptionHousePrices,
  suburbRentDescription,
  suburbRentTitle,
  suburbTitle,
  suburbTitleHousePrices,
} from "@/lib/utils/seo";
import { hasReliablePrice } from "@/lib/suburb-data-quality";
import path from "node:path";
import { ABBR, AUSTRALIAN_STATES, STAMP_DUTY_GUIDES, dutyFor, money, stampDutyMetaTitle, stampDutyTitle } from "@/lib/data/stamp-duty-state";
import { SITE_NAME } from "@/lib/constants";
import { publishedGrowthFor } from "@/lib/published-medians";
import { rentalMarketTitle } from "@/lib/rental-market";

const TITLE_BUDGET = 60;      // characters, before the brand suffix
const DESCRIPTION_BUDGET = 160;         // the control's own budget
const ITEM2_DESCRIPTION_BUDGET = 155;   // the item 2 guardrail in the fix review

type Freshness = NonNullable<Suburb["dataFreshness"]>;

const schoolList = (n: number): Suburb["schools"] =>
  Array.from({ length: n }, (_, i) => ({ name: `School ${i + 1}`, type: "primary" as const, sector: "government" as const, distance: 1, yearRange: null, gender: null, website: null, icsea: null, enrolment: null, acaraId: null }));

function makeSuburb(overrides: Partial<Suburb> & { salesSource?: string | null; freshness?: Partial<Freshness> } = {}): Suburb {
  const { salesSource = "sales-nsw", freshness = {}, ...rest } = overrides;
  return {
    id: "test",
    slug: "test-suburb-nsw-2000",
    name: "Test Suburb",
    postcode: "2000",
    state: "NSW",
    region: "Sydney",
    description: "",
    heroImage: "",
    schools: schoolList(20),
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
      rentalAsOf: new Date("2026-06-30T00:00:00Z"), rentalSource: "rental-nsw",
      crimeAsOf: null, crimeSource: null,
      salesAsOf: new Date("2026-06-30"), salesSource, salesCount: null, salesPeriodEnd: new Date("2025-12-31T00:00:00Z"),
      censusAsOf: null, hazardAsOf: null, walkabilityAsOf: null, climateAsOf: null,
      ...freshness,
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

// The four cohorts the description and the FAQ distinguish.
const priced = () => makeSuburb({ name: "Bondi", postcode: "2026", state: "NSW", salesSource: "sales-nsw", freshness: { salesCount: 35 } });
const pricedGrowthUnmeasured = () => makeSuburb({ name: "Toorak", postcode: "3142", state: "VIC", salesSource: "sales-vic", freshness: { salesAsOf: new Date("2026-05-15T00:00:00Z") } });
const pricedArea = () => makeSuburb({ name: "Morayfield", postcode: "4506", state: "QLD", salesSource: "sales-abs", freshness: { salesPeriodEnd: new Date("2024-12-31T00:00:00Z") } });
const unpriced = () => {
  const s = makeSuburb({ name: "Surfers Paradise", postcode: "4217", state: "QLD", salesSource: "sales-qld" });
  s.stats.medianHousePrice = 0; // what suburb-service hands the page for a distrusted source
  s.stats.medianUnitPrice = 0;
  s.stats.annualGrowthHouse = 0;
  return s;
};

describe("suburb titles stay inside the SERP budget", () => {
  it("profile title (suburbTitle) is under 60 characters for every long name, priced or not", () => {
    for (const s of LONG_NAMES) {
      const t = suburbTitleHousePrices(makeSuburb(s));
      expect(t.length, `${s.name}: ${t}`).toBeLessThanOrEqual(TITLE_BUDGET);
      const u = suburbTitleHousePrices({ ...unpriced(), ...s });
      expect(u.length, `${s.name}: ${u}`).toBeLessThanOrEqual(TITLE_BUDGET);
    }
  });

  it("leads with the suburb, state and postcode, then House Prices: the tracker's wording where it fits and the page publishes all three", () => {
    expect(suburbTitleHousePrices(priced())).toBe("Bondi NSW 2026: House Prices, Rent, Schools & Suburb Profile");
    // Longer names keep the order of the intents and drop from the end.
    expect(suburbTitleHousePrices(pricedGrowthUnmeasured())).toBe("Toorak VIC 3142: House Prices, Rent & Suburb Profile");
    expect(suburbTitleHousePrices(pricedArea())).toBe("Morayfield QLD 4506: House Prices, Rent & Suburb Profile");
    expect(suburbTitleHousePrices(makeSuburb({ name: "Hawthorn East", postcode: "3123", state: "VIC", salesSource: "sales-vic" }))).toBe("Hawthorn East VIC 3123: House Prices, Rent & Suburb Profile");
    expect(suburbTitleHousePrices(makeSuburb({ name: "Karratha Industrial Estate", postcode: "6714", state: "WA", salesSource: "sales-abs" }))).toBe("Karratha Industrial Estate WA 6714: House Prices & Profile");
    for (const s of LONG_NAMES) {
      expect(suburbTitleHousePrices(makeSuburb(s))).toMatch(new RegExp(`^${s.name} ${s.state} ${s.postcode}: House Prices`));
    }
  });

  it("never says Postcode first: that lead drew 79% of impressions as postcode lookups with 25 clicks", () => {
    for (const s of LONG_NAMES) expect(suburbTitleHousePrices(makeSuburb(s))).not.toMatch(/Postcode/);
  });

  it("does not promise House Prices for a suburb whose median the page withholds", () => {
    expect(hasReliablePrice(unpriced())).toBe(false);
    expect(suburbTitleHousePrices(unpriced())).toBe("Surfers Paradise QLD 4217: Rent, Schools & Suburb Profile");
    for (const source of ["sales-qld", "sales-wa", "seed", null]) {
      const s = makeSuburb({ name: "Morayfield", postcode: "4506", state: "QLD", salesSource: source });
      s.stats.medianHousePrice = 0;
      expect(suburbTitleHousePrices(s), `source=${source}`).not.toMatch(/House Prices/);
      expect(suburbTitleHousePrices(s), `source=${source}`).toBe("Morayfield QLD 4506: Rent, Schools & Suburb Profile");
    }
    // A trusted feed with too few sales is withheld the same way (the service zeroes the median).
    const thin = makeSuburb({ name: "Bondi", postcode: "2026", state: "NSW" });
    thin.stats.medianHousePrice = 0;
    expect(suburbTitleHousePrices(thin)).not.toMatch(/House Prices/);
  });

  it("names Rent only for a rent with a known source, and Schools only when the page lists schools", () => {
    // Hawthorn East on 30 Sep 2026: a Land Victoria median, schools, no rent.
    const noRent = makeSuburb({ name: "Hawthorn East", postcode: "3123", state: "VIC", salesSource: "sales-vic" });
    noRent.stats.medianRentHouse = 0;
    noRent.stats.medianRentUnit = 0;
    expect(suburbTitleHousePrices(noRent)).toBe("Hawthorn East VIC 3123: House Prices & Suburb Profile");
    // A rent on file with no named source (a seed or census value) is not a published rent.
    const unsourced = makeSuburb({ name: "Bondi", postcode: "2026", state: "NSW", freshness: { rentalSource: null } });
    expect(suburbTitleHousePrices(unsourced)).toBe("Bondi NSW 2026: House Prices, Schools & Suburb Profile");
    const noSchools = makeSuburb({ name: "Bondi", postcode: "2026", state: "NSW", schools: [] });
    expect(suburbTitleHousePrices(noSchools)).toBe("Bondi NSW 2026: House Prices, Rent & Suburb Profile");
  });

  it("buy and rent sub-page titles are under 60 characters", () => {
    for (const s of LONG_NAMES) {
      const buy = suburbBuyTitle(makeSuburb(s));
      const rent = suburbRentTitle(makeSuburb(s));
      expect(buy.length, `${s.name}: ${buy}`).toBeLessThanOrEqual(TITLE_BUDGET);
      expect(rent.length, `${s.name}: ${rent}`).toBeLessThanOrEqual(TITLE_BUDGET);
    }
  });

  it("sub-page titles neither repeat the profile title nor its lead", () => {
    // The profile owns "{Suburb} {State} {Postcode}: ..."; the sub-pages keep
    // their "{Thing} in {Suburb}" shape so no two pages compete for one query.
    for (const s of LONG_NAMES) {
      const sub = makeSuburb(s);
      const profile = suburbTitleHousePrices(sub);
      const lead = `${s.name} ${s.state} ${s.postcode}:`;
      for (const t of [suburbBuyTitle(sub), suburbRentTitle(sub)]) {
        expect(t).not.toBe(profile);
        expect(t.startsWith(lead)).toBe(false);
        expect(t).not.toMatch(/Suburb Profile|House Prices/);
      }
    }
  });

  it("titles never contain a dollar figure (prices belong in descriptions, behind the gate)", () => {
    for (const s of LONG_NAMES) {
      const sub = makeSuburb(s);
      for (const t of [suburbTitleHousePrices(sub), suburbBuyTitle(sub), suburbRentTitle(sub)]) {
        expect(t).not.toMatch(/\$/);
      }
    }
  });
});

describe("the profile description leads with what the page publishes", () => {
  it("priced, growth measured (NSW): the median, its source and period, and the 12-month change", () => {
    const s = priced();
    s.stats.medianHousePrice = 4_300_000;
    s.stats.annualGrowthHouse = 13.9;
    expect(publishedGrowthFor(s)).toBe(13.9);
    expect(suburbDescriptionHousePrices(s)).toBe(
      "Bondi's median house price is $4,300,000 (NSW Valuer General, calendar 2025, up 13.9% in 12 months). Plus weekly rent and population 24,898 (2021 Census).",
    );
  });

  it("says down, never a minus sign, for a fall (SA measures a change too)", () => {
    const s = makeSuburb({ name: "Glenelg", postcode: "5045", state: "SA", salesSource: "sales-sa", freshness: { salesAsOf: new Date("2026-09-05T00:00:00Z") } });
    s.stats.annualGrowthHouse = -3.1;
    expect(suburbDescriptionHousePrices(s)).toMatch(/^Glenelg's median house price is \$1,095,000 \(SA Government, the latest published quarter, updated September 2026, down 3\.1% in 12 months\)\./);
    expect(suburbDescriptionHousePrices(s)).not.toMatch(/-3\.1/);
  });

  it("priced, growth unmeasured (Land Victoria, ABS): the median and its source, and no change even when the column holds one", () => {
    const vic = pricedGrowthUnmeasured();
    expect(vic.stats.annualGrowthHouse).toBe(6); // a leftover the service would have zeroed
    expect(publishedGrowthFor(vic)).toBe(0);
    expect(suburbDescriptionHousePrices(vic)).toBe(
      // The population would take it past the 155 guardrail, so it is skipped and the shorter facts go in.
      "Toorak's median house price is $1,095,000 (Land Victoria, the latest published quarter, updated May 2026). Plus weekly rent, 20 schools and walk score 60.",
    );
    expect(suburbDescriptionHousePrices(vic)).not.toMatch(/%/);
    const abs = pricedArea();
    expect(suburbDescriptionHousePrices(abs)).toBe(
      "Morayfield sits in an ABS statistical area (SA2) where the median house price is $1,095,000 (ABS, 2024). Plus weekly rent, 20 schools and walk score 60.",
    );
    expect(suburbDescriptionHousePrices(abs)).not.toMatch(/%/);
  });

  it("withholds an implausible change and the 0 the feeds store for no prior period", () => {
    const big = priced();
    big.stats.annualGrowthHouse = 41.8;
    expect(suburbDescriptionHousePrices(big)).not.toMatch(/%/);
    const zero = priced();
    zero.stats.annualGrowthHouse = 0;
    expect(suburbDescriptionHousePrices(zero)).not.toMatch(/%/);
  });

  it("unpriced: leads with what the page publishes, with no dollar figure, no growth figure and no $0", () => {
    const s = unpriced();
    s.stats.population = 26_412;
    s.stats.walkScore = 90;
    s.schools = Array.from({ length: 20 }, (_, i) => ({ name: `School ${i}`, type: "primary" as const, sector: "government" as const, distance: 1, yearRange: null, gender: null, website: null, icsea: null, enrolment: null, acaraId: null }));
    expect(suburbDescriptionHousePrices(s)).toBe(
      "Surfers Paradise, QLD 4217: suburb profile with weekly rent, population 26,412 (2021 Census), 20 schools and walk score 90.",
    );
    for (const source of ["sales-qld", "sales-wa", "seed", null]) {
      const u = makeSuburb({ name: "Morayfield", postcode: "4506", state: "QLD", salesSource: source });
      u.stats.medianHousePrice = 0;
      const d = suburbDescriptionHousePrices(u);
      expect(d, `source=${source}`).not.toMatch(/\$/);
      expect(d, `source=${source}`).not.toMatch(/%/);
      expect(d, `source=${source}`).toMatch(/^Morayfield, QLD 4506, in Greater Brisbane: suburb profile with weekly rent/);
    }
  });

  it("names a weekly rent only where the rent's source is known (the snapshot band's rule)", () => {
    const s = unpriced();
    s.dataFreshness = { ...s.dataFreshness!, rentalSource: null };
    expect(suburbDescriptionHousePrices(s)).not.toMatch(/rent/);
    const p = priced();
    p.dataFreshness = { ...p.dataFreshness!, rentalSource: null };
    expect(suburbDescriptionHousePrices(p)).not.toMatch(/rent/);
  });

  it("unpriced with a trusted source but a zeroed median still prints nothing", () => {
    // suburb-service zeroes medianHousePrice for rows on fewer than five
    // sales; a trusted source with a 0 must print no price rather than "$0".
    const s = makeSuburb({ name: "Morayfield", postcode: "4506", state: "QLD" });
    s.stats.medianHousePrice = 0;
    expect(hasReliablePrice(s)).toBe(false);
    expect(suburbDescriptionHousePrices(s)).not.toMatch(/\$/);
  });

  it("a thin profile (no price, no population, no data of its own) names nothing it does not hold", () => {
    const s = unpriced();
    s.name = "Balladonia"; s.state = "WA"; s.postcode = "6443"; s.slug = "balladonia-wa-6443";
    s.stats.population = 0; s.stats.walkScore = 0; s.stats.medianRentHouse = 0; s.stats.medianRentUnit = 0; s.schools = [];
    expect(suburbDescriptionHousePrices(s)).toBe("Balladonia, WA 6443: suburb profile, postcode and location.");
    expect(suburbTitleHousePrices(s)).toBe("Balladonia WA 6443: Suburb Profile");
    // Production's Balladonia has a $150 house rent on file with no named source: neither builder names it.
    s.stats.medianRentHouse = 150;
    s.dataFreshness = { ...s.dataFreshness!, rentalSource: null };
    expect(suburbDescriptionHousePrices(s)).toBe("Balladonia, WA 6443: suburb profile, postcode and location.");
    expect(suburbTitleHousePrices(s)).toBe("Balladonia WA 6443: Suburb Profile");
  });

  it("keeps the reversed alias of a trailing directional name, the one crawlable place it appears", () => {
    const vic = makeSuburb({ name: "Brighton East", postcode: "3187", state: "VIC", salesSource: "sales-vic" });
    expect(suburbDescriptionHousePrices(vic)).toContain("Also known as East Brighton.");
    const bare = makeSuburb({ name: "Brighton East", postcode: "3187", state: "VIC", salesSource: null });
    bare.stats.medianHousePrice = 0;
    expect(suburbDescriptionHousePrices(bare)).toMatch(/^Brighton East \(also known as East Brighton\), VIC 3187, in Greater Melbourne:/);
    // A leading directional is the name itself: "South Yarra" is never "Yarra South".
    expect(suburbDescriptionHousePrices(makeSuburb({ name: "South Yarra", postcode: "3141", state: "VIC", salesSource: "sales-vic" }))).not.toMatch(/also known/i);
  });

  it("stays under 155 characters (the item 2 guardrail) for every long name in every data case", () => {
    for (const n of LONG_NAMES) {
      for (const make of [priced, pricedGrowthUnmeasured, pricedArea, unpriced]) {
        const s = { ...make(), ...n };
        expect(suburbDescriptionHousePrices(s).length, `${n.name}: ${suburbDescriptionHousePrices(s)}`).toBeLessThanOrEqual(ITEM2_DESCRIPTION_BUDGET);
      }
    }
  });
});

describe("item 2 rolls out by state cohort (R4): SA and TAS first, the rest of the country is the control", () => {
  it("names the cohort", () => {
    expect([...TITLE_COHORT_STATES]).toEqual(["SA", "TAS"]);
    expect(inTitleCohort({ state: "SA" })).toBe(true);
    expect(inTitleCohort({ state: "tas" })).toBe(true);
    for (const state of ["NSW", "VIC", "QLD", "WA", "ACT", "NT"]) expect(inTitleCohort({ state }), state).toBe(false);
  });
  it("a cohort suburb gets the item 2 title and description", () => {
    const glenelg = makeSuburb({ name: "Glenelg", postcode: "5045", state: "SA", salesSource: "sales-sa" });
    expect(suburbTitle(glenelg)).toBe(suburbTitleHousePrices(glenelg));
    // 61 characters with Schools, so Schools drops (R6).
    expect(suburbTitle(glenelg)).toBe("Glenelg SA 5045: House Prices, Rent & Suburb Profile");
    expect(suburbDescription(glenelg)).toBe(suburbDescriptionHousePrices(glenelg));
    const sandyBay = makeSuburb({ name: "Sandy Bay", postcode: "7005", state: "TAS", salesSource: "sales-abs" });
    expect(suburbTitle(sandyBay)).toMatch(/^Sandy Bay TAS 7005: House Prices/);
  });
  it("a control suburb keeps today's title and description, character for character", () => {
    const bondi = makeSuburb({ name: "Bondi", postcode: "2026", state: "NSW" });
    expect(suburbTitle(bondi)).toBe("Bondi Postcode 2026 (NSW) — Suburb Profile & Median Price");
    expect(suburbTitle(bondi)).toBe(legacySuburbTitle(bondi));
    expect(suburbDescription(bondi)).toBe(legacySuburbDescription(bondi));
    expect(suburbDescription(bondi)).toBe("Bondi, NSW's postcode is 2026, in Greater Sydney. Median house price $1.1M, growth, schools and crime. No sign-up.");
    const hawthorn = makeSuburb({ name: "Hawthorn", postcode: "3122", state: "VIC", salesSource: "sales-vic" });
    expect(suburbTitle(hawthorn)).toBe("Hawthorn Postcode 3122 (VIC) — Suburb Profile & Median Price");
  });
});

describe("the control's description still respects the price-reliability gate", () => {
  // The tests the control's builder carried on main, kept while it is live.
  const unreliableSources: Array<string | null> = ["sales-qld", "sales-wa", "seed", null];
  it("prints the median only when hasReliablePrice is true", () => {
    const reliable = makeSuburb({ name: "Morayfield", postcode: "4506", state: "QLD", salesSource: "sales-abs" });
    expect(hasReliablePrice(reliable)).toBe(true);
    expect(legacySuburbDescription(reliable)).toMatch(/\$1\.1M/);
    for (const source of unreliableSources) {
      const s = makeSuburb({ name: "Morayfield", postcode: "4506", state: "QLD", salesSource: source });
      expect(hasReliablePrice(s)).toBe(false);
      expect(legacySuburbDescription(s), `source=${source}`).not.toMatch(/\$/);
    }
  });
  it("keeps a zeroed price out even when the source is trusted", () => {
    const s = makeSuburb({ name: "Morayfield", postcode: "4506", state: "QLD" });
    s.stats.medianHousePrice = 0;
    expect(legacySuburbDescription(s)).not.toMatch(/\$/);
  });
  it("stays inside 160 characters where the builder promises it (metro and directional names)", () => {
    expect(legacySuburbDescription(makeSuburb({ name: "Brighton East", postcode: "3187", state: "VIC", salesSource: "sales-vic" })).length).toBeLessThanOrEqual(DESCRIPTION_BUDGET);
    expect(legacySuburbDescription(makeSuburb({ name: "Chermside South", postcode: "4032", state: "QLD", salesSource: "sales-abs" })).length).toBeLessThanOrEqual(DESCRIPTION_BUDGET);
  });
});

describe("the sub-page titles keep their own shape", () => {
  // Fix item 2, step 3: the profile owns "{Suburb} {State} {Postcode}: House
  // Prices ... & Suburb Profile". The buy, rent, houses, units, townhouses,
  // land, agents, rental-market and schools pages keep "{Thing} in {Suburb}"
  // or "{Suburb} Rental Market", so no two pages of a suburb compete for one query.
  const SUB = "src/app/(marketing)/suburbs/[slug]";
  const subpages = fs.readdirSync(SUB, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(`${SUB}/${d.name}/page.tsx`))
    .map((d) => `${SUB}/${d.name}/page.tsx`);
  it("finds the sub-pages", () => {
    for (const p of ["buy", "rent", "houses", "units", "agents", "rental-market"]) expect(subpages).toContain(`${SUB}/${p}/page.tsx`);
  });
  it("none of them uses the profile title or its words", () => {
    for (const f of [...subpages, "src/lib/suburb-agents.ts", "src/lib/rental-market.ts"]) {
      const src = fs.readFileSync(f, "utf8");
      expect(src, f).not.toMatch(/\bsuburbTitle\(/);
      expect(src, f).not.toMatch(/House Prices|Suburb Profile/);
    }
    const t = rentalMarketTitle("Bondi", true);
    expect(t).toBe("Bondi Rental Market 2026: Median Rent & Yield");
    expect(t).not.toBe(suburbTitleHousePrices(makeSuburb({ name: "Bondi", postcode: "2026", state: "NSW" })));
  });
});

describe("sub-page descriptions respect the price-reliability gate", () => {
  const unreliableSources: Array<string | null> = ["sales-qld", "sales-wa", "seed", null];

  it("buy and rent sub-page descriptions never print a dollar figure for an unreliable price", () => {
    for (const source of unreliableSources) {
      const s = makeSuburb({ name: "Morayfield", postcode: "4506", state: "QLD", salesSource: source });
      s.stats.medianHousePrice = 0; // what suburb-service hands the page for unreliable rows
      s.stats.medianRentHouse = 0;
      expect(suburbBuyDescription(s), `buy, source=${source}`).not.toMatch(/\$/);
      expect(suburbRentDescription(s), `rent, source=${source}`).not.toMatch(/\b0\/wk/);
    }
  });

  it("buy description prints the median only when hasReliablePrice is true", () => {
    const reliable = makeSuburb({ name: "Morayfield", postcode: "4506", state: "QLD", salesSource: "sales-abs" });
    expect(suburbBuyDescription(reliable)).toMatch(/\$1\.1M/);
    for (const source of unreliableSources) {
      const s = makeSuburb({ name: "Morayfield", postcode: "4506", state: "QLD", salesSource: source });
      expect(suburbBuyDescription(s), `source=${source}`).not.toMatch(/\$/);
    }
  });
});

// Item 20 (30 Sep 2026): the eight state stamp duty guides. <title> and
// og:title take the short form inside the 60-character budget (before the
// " | Your Property Guide" suffix the root layout adds); the long form is the
// H1 and the Article headline.
describe("stamp duty state guide titles", () => {
  it("<title> and og:title are exactly '{STATE} Stamp Duty Calculator 2026: Rates & First Home Buyers'", () => {
    for (const s of AUSTRALIAN_STATES) {
      expect(STAMP_DUTY_GUIDES[s].metaTitle).toBe(`${ABBR[s]} Stamp Duty Calculator 2026: Rates & First Home Buyers`);
      expect(stampDutyMetaTitle(s)).toBe(STAMP_DUTY_GUIDES[s].metaTitle);
    }
    expect(STAMP_DUTY_GUIDES.NSW.metaTitle).toHaveLength(57);
  });

  it("the short title is inside the 60-character budget for every state", () => {
    for (const s of AUSTRALIAN_STATES) {
      const t = STAMP_DUTY_GUIDES[s].metaTitle;
      expect(t.length, `${s}: ${t}`).toBeLessThanOrEqual(TITLE_BUDGET);
      expect(t).not.toMatch(/\$/);
    }
  });

  it("the H1 and Article headline keep the long form", () => {
    for (const s of AUSTRALIAN_STATES) {
      expect(STAMP_DUTY_GUIDES[s].title).toBe(`${ABBR[s]} Stamp Duty Calculator 2026: Rates, Concessions & First Home Buyers`);
      expect(stampDutyTitle(s)).toBe(STAMP_DUTY_GUIDES[s].title);
    }
  });

  it("the metadata builder sets <title> and og:title from metaTitle, and the frontmatter (H1, Article headline) from title", () => {
    const layout = fs.readFileSync(path.resolve(__dirname, "../../src/app/layout.tsx"), "utf8");
    expect(layout).toContain("template: `%s | ${SITE_NAME}`");
    expect(SITE_NAME).toBe("Your Property Guide");
    const builder = fs.readFileSync(path.resolve(__dirname, "../../src/components/guide/StampDutyStateGuide.tsx"), "utf8");
    const meta = builder.slice(builder.indexOf("export function stampDutyMetadata"), builder.indexOf("/** Renders a paragraph string"));
    expect(meta).toContain("const metaTitle = STAMP_DUTY_GUIDES[state].metaTitle;");
    expect(meta.match(/title: metaTitle,/g)).toHaveLength(2);
    // The frontmatter (H1, Article headline) lives in src/lib/guides/stamp-duty-frontmatter.ts since PR #90.
    const frontmatter = fs.readFileSync(path.resolve(__dirname, "../../src/lib/guides/stamp-duty-frontmatter.ts"), "utf8");
    expect(frontmatter).toMatch(/title: g\.title,/);
    expect(builder).toContain("stampDutyFrontmatter(state)");
  });

  it("descriptions stay inside 160 characters and print only the engine's figure", () => {
    for (const s of AUSTRALIAN_STATES) {
      const g = STAMP_DUTY_GUIDES[s];
      expect(g.description.length, `${s}: ${g.description}`).toBeLessThanOrEqual(DESCRIPTION_BUDGET);
      expect(g.description).toContain(money(dutyFor(s, 750_000, "owner").total));
    }
  });
});

// Commercial intent review 30 Sep 2026, section 3.7: the inspection and
// conveyancing guides lead with cost, the way the ranking pages do. The
// <title> and og:title use a short form inside the 60-character budget; the
// H1 and Article headline keep the long form from the frontmatter. Read as
// text so the test does not import a page module.
describe("cost-first guide titles", () => {
  const read = (slug: string) =>
    readFileSync(join(__dirname, "../../src/app/(marketing)/guides", slug, "page.tsx"), "utf8");
  // FRONTMATTER.title: the H1 (GuideArticleLayout) and the Article headline.
  const h1Of = (src: string) => src.match(/const FRONTMATTER: GuideFrontmatter = \{\s*title: "([^"]+)",/)?.[1];
  const seoOf = (src: string) => src.match(/const SEO_TITLE = "([^"]+)";/)?.[1];
  const usesSeoTitle = (src: string) => {
    expect(src).toMatch(/export const metadata: Metadata = \{\s*title: SEO_TITLE,/);
    expect(src).toMatch(/openGraph: \{\s*url: [^\n]*\n\s*title: SEO_TITLE,/);
  };

  it("building and pest inspection guide: short <title>, long H1", () => {
    const src = read("building-pest-inspection");
    const seo = seoOf(src)!;
    expect(seo).toBe("Building and Pest Inspection Cost 2026: Prices by City");
    expect(seo.length).toBeLessThanOrEqual(TITLE_BUDGET);
    expect(h1Of(src)).toBe("Building and Pest Inspection Cost in Australia (2026): Prices by City and Property Type");
    usesSeoTitle(src);
    expect(src).toContain("faqs={INSPECTION_FAQS}");
    expect(src).toContain('updatedAt: "2026-09-30"');
  });

  it("conveyancing guide: short <title> naming NSW, long H1", () => {
    const src = read("conveyancing-guide");
    const seo = seoOf(src)!;
    expect(seo).toBe("Conveyancing Fees 2026: Costs in NSW, VIC, QLD & Every State");
    expect(seo.length).toBeLessThanOrEqual(TITLE_BUDGET);
    expect(h1Of(src)).toBe("Conveyancing Fees in Australia (2026): Costs in NSW, VIC, QLD and Every State");
    usesSeoTitle(src);
    expect(src).toContain("faqs={CONVEYANCING_FAQS}");
    expect(src).toContain('updatedAt: "2026-09-30"');
    for (const id of ["cost-nsw", "cost-vic", "cost-qld", "cost-other-states", "estimator"]) {
      expect(src).toContain(`id="${id}"`);
    }
  });
});

// Commercial intent review 3.4 (30 Sep 2026): the valuation page's long
// headline (81 characters) would be cut in results, so the <title> is the
// short form and the long form is the H1 and the WebPage name.
describe("/property-valuation title", () => {
  const src = fs.readFileSync("src/app/(marketing)/property-valuation/page.tsx", "utf8");
  const title = src.match(/const TITLE = "([^"]+)";/)?.[1] ?? "";
  const headline = src.match(/const HEADLINE = "([^"]+)";/)?.[1] ?? "";
  it("is under 60 characters and is what the metadata uses", () => {
    expect(title).toBe("Property Valuation Australia: Appraisal vs Estimate (2026)");
    expect(title.length).toBeLessThanOrEqual(TITLE_BUDGET);
    expect(src).toMatch(/export const metadata[\s\S]*?title: TITLE,/);
  });
  it("keeps the long form as the H1 and the WebPage name", () => {
    expect(headline).toBe("Property Valuation in Australia: Appraisal vs Valuation vs Online Estimate (2026)");
    expect(src).toContain("name: HEADLINE,");
    const h1 = (src.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "").replace(/<[^>]+>|\{" "\}/g, " ").replace(/\s+/g, " ").trim();
    expect(h1.toLowerCase()).toBe(headline.toLowerCase());
  });
});

// Commercial intent review 3.3 (30 Sep 2026): the two calculators built for
// "lmi calculator" and "negative gearing calculator" keep their titles and
// descriptions inside the same budgets, and name the tool in the title.
describe("calculator page titles stay inside the SERP budget", () => {
  const pages: Array<[string, RegExp]> = [
    ["lmi-calculator", /^LMI Calculator/],
    ["negative-gearing-calculator", /^Negative Gearing Calculator/],
  ];
  for (const [slug, lead] of pages) {
    it(`/${slug}`, async () => {
      const { readFileSync } = await import("node:fs");
      const src = readFileSync(`src/app/(marketing)/${slug}/page.tsx`, "utf8");
      const title = src.match(/const META_TITLE = "([^"]+)";/)?.[1] ?? "";
      const description = src.match(/const META_DESCRIPTION =\s*"([^"]+)";/)?.[1] ?? "";
      expect(title).toMatch(lead);
      expect(title.length, title).toBeLessThanOrEqual(TITLE_BUDGET);
      expect(description.length, description).toBeGreaterThan(100);
      expect(description.length, description).toBeLessThanOrEqual(DESCRIPTION_BUDGET);
    });
  }
});

// The best-suburbs city editions (tracker item 22): titles in the searched
// form, inside the budget, for every category and capital.
describe("best-suburbs city edition titles", () => {
  it("stay inside the SERP budget for every category and capital, and carry no figure", async () => {
    const { CITY_EDITION_CATEGORIES, cityEditionTitle, cityEditionDescription } = await import("@/lib/city-editions");
    const { CAPITAL_CITIES } = await import("@/lib/utils/metro");
    for (const category of CITY_EDITION_CATEGORIES) {
      for (const city of CAPITAL_CITIES) {
        const title = cityEditionTitle(category, city);
        expect(title.length, title).toBeLessThanOrEqual(TITLE_BUDGET);
        expect(title).not.toMatch(/\$/);
        const description = cityEditionDescription({ category, city, suburbs: [] });
        expect(description.length, description).toBeLessThanOrEqual(DESCRIPTION_BUDGET);
        expect(description).not.toMatch(/\$/);
      }
    }
  });
});
