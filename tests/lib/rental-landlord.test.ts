// Commercial intent review 30 Sep 2026, section 3.1: the landlord blocks of
// the rental-market sub-page print only sourced fees, a worked line on a
// rent whose source is named, and an investment FAQ from published figures.
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import type { Suburb } from "../../src/types/suburb";
import type { SuburbRentalHistory } from "../../src/lib/services/rental-service";
import {
  ANCILLARY_FEES,
  FEE_SOURCES,
  MANAGER_TIMEFRAMES,
  STATE_FEES,
  annualManagementFee,
  ancillaryFeesFor,
  buildLandlordModel,
  chargesFaq,
  formatPct,
  formatPctRange,
  formatWeeksOfRent,
  investmentFaq,
  lettingFeeDollars,
  publishedHouseRent,
  rentalAppraisalFaqs,
  stateFeeRow,
  workedFeeLine,
} from "../../src/lib/rental-landlord";

const words = (s: string) => s.trim().split(/\s+/).length;

function suburb(over: Partial<Suburb["stats"]> = {}, freshness: Partial<NonNullable<Suburb["dataFreshness"]>> = {}, name = "Picton", state = "NSW", postcode = "2571"): Suburb {
  return {
    id: "t", slug: `${name.toLowerCase().replace(/ /g, "-")}-${state.toLowerCase()}-${postcode}`, name, postcode, state, region: "Wollondilly", description: "", heroImage: "",
    schools: [], amenities: [], transportLinks: [], nearbySuburbs: [],
    stats: { medianHousePrice: 900_000, medianUnitPrice: 0, medianRentHouse: 650, medianRentUnit: 0, annualGrowthHouse: 4.2, annualGrowthUnit: 0, daysOnMarket: 0, population: 5_000, medianAge: 38, ownerOccupied: 70, renterOccupied: 25, householdsFamily: 75, householdsLonePerson: 18, walkScore: 30, transitScore: null, bikeScore: null, ...over },
    dataFreshness: { rentalAsOf: new Date("2026-06-01T00:00:00Z"), rentalSource: "rental-nsw", crimeAsOf: null, crimeSource: null, salesAsOf: new Date("2026-05-01T00:00:00Z"), salesSource: "sales-nsw", salesCount: 35, salesPeriodEnd: new Date("2025-12-31T00:00:00Z"), censusAsOf: null, hazardAsOf: null, walkabilityAsOf: null, climateAsOf: null, ...freshness },
  };
}
function row(over: Partial<SuburbRentalHistory> = {}): SuburbRentalHistory {
  return { id: over.period ?? "r", suburbSlug: "picton-nsw-2571", suburbName: "Picton", postcode: "2571", state: "NSW", period: "2026-Q2", periodDate: new Date("2026-06-01T00:00:00Z"), medianRentHouse: 650, medianRentUnit: null, medianRent3Bed: null, medianRent2Bed: null, medianRent1Bed: null, bondLodgements: 40, source: "rental-nsw", ...over };
}

describe("the state table", () => {
  it("covers the eight states and territories once each, every figure positive, every source dated", () => {
    expect(STATE_FEES.map((r) => r.state)).toEqual(["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"]);
    for (const r of STATE_FEES) {
      expect(r.managementPct).toBeGreaterThan(0);
      expect(r.lettingWeeks).toBeGreaterThan(0);
      expect(r.metro.lo).toBeGreaterThan(0);
      expect(r.regional.lo).toBeGreaterThan(0);
      if (r.metro.hi !== null) expect(r.metro.hi).toBeGreaterThanOrEqual(r.metro.lo);
    }
    for (const s of Object.values(FEE_SOURCES)) {
      expect(s.label.length).toBeGreaterThan(5);
      expect(s.date).toMatch(/20(20|23|26)/);
      expect(s.url).toMatch(/^https:\/\//);
    }
    for (const f of ANCILLARY_FEES) expect(f.range).toMatch(/^\$\d/);
  });
  it("finds a state's row case-insensitively and nothing for an unknown state", () => {
    expect(stateFeeRow("wa")?.name).toBe("Western Australia");
    expect(stateFeeRow("QLD")?.managementPct).toBe(7.5);
    expect(stateFeeRow("OT")).toBeNull();
    expect(stateFeeRow(null)).toBeNull();
  });
  it("shows the Perth condition report only in WA", () => {
    expect(ancillaryFeesFor("WA").some((f) => f.label.includes("Perth"))).toBe(true);
    expect(ancillaryFeesFor("NSW").some((f) => f.label.includes("Perth"))).toBe(false);
    expect(ancillaryFeesFor("NSW")).toHaveLength(4);
  });
  it("formats percentages, ranges and weeks in plain English, no dashes", () => {
    expect(formatPct(7.5)).toBe("7.5%");
    expect(formatPct(9)).toBe("9%");
    expect(formatPctRange({ lo: 5, hi: 8 })).toBe("5% to 8%");
    expect(formatPctRange({ lo: 9, hi: 9 })).toBe("9%");
    expect(formatPctRange({ lo: 11, hi: null })).toBe("11% and above");
    expect(formatWeeksOfRent(1)).toBe("1 week's rent");
    expect(formatWeeksOfRent(1.5)).toBe("1.5 weeks' rent");
    expect(formatWeeksOfRent(2)).toBe("2 weeks' rent");
  });
});

describe("fee maths", () => {
  it("works a year of management and a letting fee from a weekly rent", () => {
    expect(annualManagementFee(650, 5.8)).toBe(1960); // 650 × 52 × 0.058 = 1,960.4
    expect(annualManagementFee(600, 7)).toBe(2184);
    expect(lettingFeeDollars(650, 1.1)).toBe(715);
    expect(lettingFeeDollars(600, 1)).toBe(600);
  });
  it("gives nothing for a missing rent or rate, never a 0", () => {
    expect(annualManagementFee(0, 7)).toBeNull();
    expect(annualManagementFee(650, 0)).toBeNull();
    expect(lettingFeeDollars(0, 1)).toBeNull();
    expect(lettingFeeDollars(650, 0)).toBeNull();
  });
  it("writes the worked line with the rent's source and month", () => {
    const rent = publishedHouseRent([row()], "2571");
    expect(rent).toEqual({ house: 650, label: "NSW rental bond data (postcode 2571)", when: "June 2026", source: "rental-nsw" });
    const line = workedFeeLine("Picton", rent!, stateFeeRow("NSW")!);
    expect(line).toBe(
      "At Picton's median house rent of $650 a week (NSW rental bond data (postcode 2571), June 2026), a 5.8% management fee is about $1,960 a year, and a letting fee of 1.1 weeks' rent is about $715 each time a new tenant signs.",
    );
  });
});

describe("the published rent", () => {
  it("takes the latest row with a house median and a source the site can name", () => {
    const older = row({ period: "2025-Q2", periodDate: new Date("2025-06-01T00:00:00Z"), medianRentHouse: 600 });
    const latestNoHouse = row({ period: "2026-Q3", periodDate: new Date("2026-09-01T00:00:00Z"), medianRentHouse: null, medianRentUnit: 450 });
    expect(publishedHouseRent([older, latestNoHouse, row()], "2571")?.house).toBe(650);
  });
  it("prints nothing from a feed without a label, or from a $0", () => {
    expect(publishedHouseRent([row({ source: "seed" })], "2571")).toBeNull();
    expect(publishedHouseRent([row({ medianRentHouse: 0 })], "2571")).toBeNull();
    expect(publishedHouseRent([], "2571")).toBeNull();
  });
});

describe("the investment FAQ", () => {
  const rent = { house: 650, label: "NSW rental bond data (postcode 2571)", when: "June 2026", source: "rental-nsw" };
  it("is built from both the yield and the 12-month change when both are published", () => {
    const f = investmentFaq("Picton", { yieldHouse: 3.8, growthHouse: 4.2, rent, medianHousePrice: 900_000, salesShort: "Median of 35 house sales · NSW Valuer General · calendar 2025", growthSource: "NSW Valuer General" });
    expect(f?.question).toBe("Is Picton a good rental investment?");
    expect(f?.answer).toContain("gross yield of about 3.8%, from a median rent of $650 a week (NSW rental bond data (postcode 2571), June 2026) against a median house price of $900,000 (Median of 35 house sales · NSW Valuer General · calendar 2025)");
    expect(f?.answer).toContain("the median house price rose 4.2% over 12 months (NSW Valuer General)");
    expect(f?.answer).toContain("before management fees, rates, insurance, maintenance and vacancy");
    expect(words(f!.answer)).toBeGreaterThanOrEqual(40);
  });
  it("is built from the yield alone, or the change alone (falling), and names what is missing", () => {
    const y = investmentFaq("Picton", { yieldHouse: 3.8, growthHouse: null, rent, medianHousePrice: 900_000, salesShort: null, growthSource: null });
    expect(y?.answer).toContain("gross yield of about 3.8%");
    expect(y?.answer).not.toMatch(/over 12 months/);
    const g = investmentFaq("Picton", { yieldHouse: null, growthHouse: -2.5, rent: null, medianHousePrice: 900_000, salesShort: null, growthSource: "NSW Valuer General" });
    expect(g?.answer).toContain("the median house price fell 2.5% over 12 months, to $900,000 (NSW Valuer General)");
    expect(g?.answer).toContain("No rental median is published for Picton yet");
    expect(g?.answer).not.toMatch(/yield of about/);
  });
  it("is withheld when neither figure is published", () => {
    expect(investmentFaq("Picton", { yieldHouse: null, growthHouse: null, rent, medianHousePrice: 0, salesShort: null, growthSource: null })).toBeNull();
    expect(investmentFaq("Picton", { yieldHouse: null, growthHouse: 0, rent: null, medianHousePrice: 900_000, salesShort: null, growthSource: null })).toBeNull();
    // A yield with no published median is not a yield.
    expect(investmentFaq("Picton", { yieldHouse: 3.8, growthHouse: null, rent, medianHousePrice: 0, salesShort: null, growthSource: null })).toBeNull();
  });
});

describe("the People Also Ask answers", () => {
  it("answer the two rental-appraisal questions in 40+ words, with the suburb's rent and source where there is one", () => {
    const rent = { house: 650, label: "NSW rental bond data (postcode 2571)", when: "June 2026", source: "rental-nsw" };
    const withRent = rentalAppraisalFaqs("Picton", rent);
    expect(withRent.map((f) => f.question)).toEqual(["Does it cost money to get a rental appraisal?", "What is involved in a rental appraisal?"]);
    for (const f of withRent) expect(words(f.answer), f.question).toBeGreaterThanOrEqual(40);
    expect(withRent[0].answer).toMatch(/^No\./);
    expect(withRent[0].answer).toContain("who pays us for the introduction");
    expect(withRent[1].answer).toContain("In Picton the median house rent is $650 a week (NSW rental bond data (postcode 2571), June 2026)");
    const without = rentalAppraisalFaqs("Tom Price", null);
    expect(without[1].answer).not.toMatch(/median house rent/);
    for (const f of without) expect(words(f.answer), f.question).toBeGreaterThanOrEqual(40);
  });
  it("answers what property managers charge from the state row, naming both sources", () => {
    const f = chargesFaq("Goodna", stateFeeRow("QLD")!, null);
    expect(f.question).toBe("What do property managers charge in Goodna?");
    expect(f.answer).toContain("In Queensland the typical management fee is about 7.5% of the rent collected, and the letting fee about 1 week's rent");
    expect(f.answer).toContain("LocalAgentFinder, Property Management Fees Australia: 2026 Guide, 13 March 2026");
    expect(f.answer).toContain("REIQ's guide (1 December 2023) puts the QLD range at 9% in metro areas and 7% to 12% in regional areas.");
    expect(f.answer).toContain("negotiable");
    expect(words(f.answer)).toBeGreaterThanOrEqual(40);
  });
});

describe("buildLandlordModel", () => {
  it("NSW suburb with a published rent and a measured change: worked line, yield, growth and four FAQs", () => {
    const m = buildLandlordModel(suburb(), [row()]);
    expect(m.rent?.house).toBe(650);
    expect(m.fees?.state).toBe("NSW");
    expect(m.yieldHouse).toBe(3.8);
    expect(m.growthHouse).toBe(4.2);
    expect(m.workedLine).toContain("a 5.8% management fee is about $1,960 a year");
    expect(m.faqs.map((f) => f.question)).toEqual([
      "Is Picton a good rental investment?",
      "What do property managers charge in Picton?",
      "Does it cost money to get a rental appraisal?",
      "What is involved in a rental appraisal?",
    ]);
    expect(m.faqs[1].answer).toContain(m.workedLine as string);
    expect(m.ancillary).toHaveLength(4);
  });
  it("WA suburb with no rental feed and an ABS median: no worked line, no yield, no change, investment FAQ withheld", () => {
    const wa = suburb({ medianHousePrice: 1_800_000, annualGrowthHouse: 0 }, { rentalSource: null, rentalAsOf: null, salesSource: "sales-abs", salesCount: null }, "Nedlands", "WA", "6009");
    const m = buildLandlordModel(wa, []);
    expect(m.rent).toBeNull();
    expect(m.workedLine).toBeNull();
    expect(m.yieldHouse).toBeNull();
    expect(m.growthHouse).toBeNull();
    expect(m.fees?.state).toBe("WA");
    expect(m.faqs.map((f) => f.question)).toEqual(["What do property managers charge in Nedlands?", "Does it cost money to get a rental appraisal?", "What is involved in a rental appraisal?"]);
    expect(m.ancillary.some((f) => f.label.includes("Perth"))).toBe(true);
  });
  it("QLD suburb with a bond-data rent and an ABS median: yield but no change (the ABS feed measures none)", () => {
    const qld = suburb({ medianHousePrice: 620_000, annualGrowthHouse: 6.1 }, { rentalSource: "rental-qld", salesSource: "sales-abs", salesCount: null }, "Goodna", "QLD", "4300");
    const m = buildLandlordModel(qld, [row({ suburbSlug: "goodna-qld-4300", state: "QLD", postcode: "4300", medianRentHouse: 520, source: "rental-qld", bondLodgements: null })]);
    expect(m.rent?.label).toBe("Queensland RTA bond data");
    expect(m.yieldHouse).toBe(4.4);
    expect(m.growthHouse).toBeNull();
    expect(m.faqs[0].answer).toContain("gross yield of about 4.4%");
    expect(m.faqs[0].answer).not.toMatch(/over 12 months/);
    expect(m.workedLine).toContain("a 7.5% management fee is about $2,028 a year, and a letting fee of 1 week's rent is about $520");
  });
  it("re-applies the published-median rule: a distrusted source or too few sales withholds yield and change", () => {
    const proxy = suburb({}, { salesSource: "sales-wa" });
    expect(buildLandlordModel(proxy, [row()]).yieldHouse).toBeNull();
    const thin = suburb({}, { salesCount: 3 });
    const m = buildLandlordModel(thin, [row()]);
    expect(m.yieldHouse).toBeNull();
    expect(m.growthHouse).toBeNull();
    expect(m.faqs[0].question).toBe("What do property managers charge in Picton?");
  });
  it("a rent from a feed the site cannot name prints nothing", () => {
    const m = buildLandlordModel(suburb(), [row({ source: "seed" })]);
    expect(m.rent).toBeNull();
    expect(m.workedLine).toBeNull();
    expect(m.yieldHouse).toBeNull();
    expect(m.faqs[1].answer).not.toMatch(/median house rent/);
  });
  it("never prints a $0 or a 0%", () => {
    for (const m of [
      buildLandlordModel(suburb({ medianHousePrice: 0, annualGrowthHouse: 0 }), [row({ medianRentHouse: 0 })]),
      buildLandlordModel(suburb(), [row()]),
      buildLandlordModel(suburb({}, { salesSource: null }, "Tom Price", "WA", "6751"), []),
    ]) {
      const text = JSON.stringify(m);
      expect(text).not.toMatch(/\$0[^,.\d]/);
      expect(text).not.toMatch(/[^\d.]0%/);
      expect(text).not.toMatch(/—/);
    }
  });
  it("offers the four manager timeframes the API accepts", () => {
    expect(MANAGER_TIMEFRAMES.map((t) => t.id)).toEqual(["asap", "0-3-months", "3-6-months", "researching"]);
  });
});

describe("the page keeps its gates", () => {
  const page = fs.readFileSync("src/app/(marketing)/suburbs/[slug]/rental-market/page.tsx", "utf8");
  const sitemap = fs.readFileSync("src/app/(marketing)/suburbs/subpages/sitemap.ts", "utf8");
  it("still noindexes a page with no rental row, and the sitemap still lists only suburbs with one", () => {
    expect(page).toContain("robots: history.length === 0 ? { index: false, follow: true } : undefined");
    expect(sitemap).toContain("getSuburbSlugsWithRentalData");
    expect(sitemap).toMatch(/if \(type === "rental-market"\) \{\s*const withData = new Set\(await getCachedRentalSuburbs\(\)\);/);
  });
  it("renders the landlord blocks on every branch of the page, including the empty state", () => {
    expect(page).toContain("const landlord = buildLandlordModel(suburb, history);");
    expect(page).toContain("<RentalMarketSections suburb={suburb} slug={slug} model={model} landlord={landlord} />");
    expect(page).toContain("{!model?.current && (");
    expect(page).toContain("<RentalMarketLandlordSections suburb={suburb} landlord={landlord} />");
    expect(page).toContain("<Faq items={landlord.faqs}");
  });
  it("the sections component merges the two FAQ lists into one FAQPage", () => {
    const sections = fs.readFileSync("src/components/suburb/RentalMarketSections.tsx", "utf8");
    expect(sections).toContain("const faqs = [...m.faqs, ...landlord.faqs];");
    expect(sections).toContain("{faqs.length > 0 && <Faq items={faqs}");
    expect(sections).not.toContain("<Faq items={m.faqs}");
  });
  it("the form posts the new lead type with the fee disclosure and no router hook", () => {
    const form = fs.readFileSync("src/components/suburb/RentalAppraisalForm.tsx", "utf8");
    expect(form).toContain('type: "rental-appraisal"');
    expect(form).toContain("who pays us for the introduction");
    expect(form).not.toMatch(/useRouter|useSearchParams/);
    expect(form).toContain("website");
  });
});
