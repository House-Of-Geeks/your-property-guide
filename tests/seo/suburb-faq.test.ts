// Valuation plan item 1: the suburb FAQ answers "how much is my house worth
// in {suburb}" alongside the median question, and only when the median is
// reliable (the list feeds FAQPage JSON-LD, so a wrong figure would surface
// in SERP snippets). Fix item 2 (commercial intent review 3.8, 30 Sep 2026):
// "Is {suburb} a good investment?", the People Also Ask question on every
// suburb SERP, answered from the published gross yield and the measured
// 12-month change only, and withheld where neither is published.
import fs from "node:fs";
import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Suburb } from "@/types";
import { buildInvestmentFaq, buildSuburbFaqs } from "@/lib/suburb-faq";
import { SuburbFAQ } from "@/components/suburb/SuburbFAQ";

// The seo components index reaches a module marked server-only; this test
// renders the FAQ block with react-dom/server, outside Next's RSC runtime.
vi.mock("server-only", () => ({}));

function makeSuburb(over: Partial<Suburb["stats"]> = {}, freshness: Partial<NonNullable<Suburb["dataFreshness"]>> = {}): Suburb {
  return {
    id: "t", slug: "bondi-nsw-2026", name: "Bondi", postcode: "2026", state: "NSW", region: "Waverley", description: "", heroImage: "",
    schools: [], amenities: [], transportLinks: [], nearbySuburbs: [],
    stats: { medianHousePrice: 4_300_000, medianUnitPrice: 538_560, medianRentHouse: 1800, medianRentUnit: 1100, annualGrowthHouse: 13.9, annualGrowthUnit: 0, daysOnMarket: 0, population: 10_411, medianAge: 34, ownerOccupied: 40, renterOccupied: 55, householdsFamily: 50, householdsLonePerson: 30, walkScore: 92, transitScore: null, bikeScore: null, ...over },
    dataFreshness: { rentalAsOf: new Date("2026-06-30T00:00:00Z"), rentalSource: "rental-nsw", crimeAsOf: null, crimeSource: null, salesAsOf: new Date("2026-09-05T00:00:00Z"), salesSource: "sales-nsw", salesCount: 35, salesPeriodEnd: new Date("2025-12-31T00:00:00Z"), censusAsOf: null, hazardAsOf: null, walkabilityAsOf: null, climateAsOf: null, ...freshness },
  };
}
const questions = (s: Suburb) => buildSuburbFaqs(s).map((f) => f.question);
const answerTo = (s: Suburb, q: string) => buildSuburbFaqs(s).find((f) => f.question === q)?.answer ?? "";

describe("suburb FAQ valuation questions", () => {
  it("asks the median question and the 'how much is my house worth' question when the median is reliable", () => {
    const qs = questions(makeSuburb());
    expect(qs[0]).toBe("What is the median house price in Bondi?");
    expect(qs[1]).toBe("How much is my house worth in Bondi?");
  });
  it("answers with the median as a starting range, the unit median, and the appraisal next step", () => {
    const a = answerTo(makeSuburb(), "How much is my house worth in Bondi?");
    expect(a).toContain("Bondi median house price of $4,300,000");
    expect(a).toContain("(units $538,560)");
    expect(a).toContain("free property appraisal");
  });
  it("omits both valuation questions when the median is withheld or the source is not trusted", () => {
    expect(questions(makeSuburb({ medianHousePrice: 0 }))).not.toContain("How much is my house worth in Bondi?");
    expect(questions(makeSuburb({ medianHousePrice: 0 }))).not.toContain("What is the median house price in Bondi?");
    const proxy = questions(makeSuburb({}, { salesSource: null as unknown as string, salesCount: null as unknown as number }));
    expect(proxy).not.toContain("How much is my house worth in Bondi?");
  });
  it("skips the unit figure when there is no unit median", () => {
    expect(answerTo(makeSuburb({ medianUnitPrice: 0 }), "How much is my house worth in Bondi?")).not.toContain("(units");
  });
  it("still asks the postcode and location questions for every suburb", () => {
    const qs = questions(makeSuburb({ medianHousePrice: 0 }));
    expect(qs).toContain("What is the Bondi postcode?");
    expect(qs).toContain("Where is Bondi?");
  });
});

describe("Is {suburb} a good investment?", () => {
  const Q = "Is Bondi a good investment?";
  const words = (t: string) => t.trim().split(/\s+/).length;
  const CAVEAT = "These are published market figures, not financial advice.";

  it("sits third, after the median and valuation questions", () => {
    expect(questions(makeSuburb())[2]).toBe(Q);
  });

  it("with a sourced rent and a measured change (NSW): states the yield, the change, each source and period, and the caveat", () => {
    const a = answerTo(makeSuburb(), Q);
    expect(a).toBe(
      "On the published figures, the gross rental yield on houses in Bondi is 2.2%: the median weekly house rent is $1,800 (NSW rental bond data (postcode 2026), June 2026) against the median house price of $4,300,000 (NSW Valuer General, calendar 2025). " +
        "The median house price rose 13.9% over 12 months on the same NSW Valuer General figures. " +
        "Whether Bondi is a good investment for you depends on the price you pay, your loan and holding costs, vacancy and your tax position. " +
        CAVEAT,
    );
    expect(words(a)).toBeGreaterThanOrEqual(40);
    expect(a.endsWith(CAVEAT)).toBe(true);
  });

  it("says fell for a negative change", () => {
    expect(answerTo(makeSuburb({ annualGrowthHouse: -3.1 }), Q)).toContain("The median house price fell 3.1% over 12 months");
  });

  it("yield only (Land Victoria, ABS): the yield with its sources, and says no 12-month change is published", () => {
    const vic = makeSuburb({ medianHousePrice: 2_692_500, medianRentHouse: 950, annualGrowthHouse: 4 }, { salesSource: "sales-vic", salesCount: null, salesAsOf: new Date("2026-05-15T00:00:00Z"), rentalSource: "rental-vic", rentalAsOf: new Date("2025-09-30T00:00:00Z") });
    const a = answerTo(vic, Q);
    expect(a).toContain("the gross rental yield on houses in Bondi is 1.8%: the median weekly house rent is $950 (Victorian rental report, September 2025) against the median house price of $2,692,500 (Land Victoria, the latest published quarter, updated May 2026).");
    expect(a).toContain("No 12-month price change is published for Bondi: the Land Victoria figures we hold do not measure one.");
    expect(a).not.toMatch(/4\.0%|rose|fell/);
    expect(words(a)).toBeGreaterThanOrEqual(40);
    const abs = makeSuburb({ medianHousePrice: 1_095_000, medianRentHouse: 560, annualGrowthHouse: 8.8 }, { salesSource: "sales-abs", salesCount: null, salesPeriodEnd: new Date("2024-12-31T00:00:00Z"), rentalSource: "rental-qld", rentalAsOf: new Date("2026-03-31T00:00:00Z") });
    const b = answerTo(abs, Q);
    expect(b).toContain("is 2.7%: the median weekly house rent is $560 (Queensland RTA bond data, March 2026) against the ABS statistical area (SA2) median house price of $1,095,000 (ABS, 2024), which can take in surrounding localities.");
    expect(b).toContain("the ABS figures we hold do not measure one");
    expect(b).not.toMatch(/8\.8%/);
  });

  it("change only (NSW, rent without a known source): the change with its source, and no yield", () => {
    const a = answerTo(makeSuburb({}, { rentalSource: null }), Q);
    expect(a).toContain("On the published figures, Bondi's median house price rose 13.9% over 12 months, to $4,300,000 (NSW Valuer General, calendar 2025).");
    // Nothing said about the yield: the Investment overview works one out from the rent on file.
    expect(a).not.toMatch(/yield/);
    expect(words(a)).toBeGreaterThanOrEqual(40);
    const noRent = answerTo(makeSuburb({ medianRentHouse: 0 }), Q);
    expect(noRent).toContain("No weekly house rent is published for Bondi, so there is no house yield to work out.");
    expect(words(noRent)).toBeGreaterThanOrEqual(40);
  });

  it("is withheld where neither a yield nor a change is published", () => {
    // Land Victoria median, no rent (Hawthorn East on 30 Sep 2026).
    const vicNoRent = makeSuburb({ medianRentHouse: 0, medianRentUnit: 0, annualGrowthHouse: 0 }, { salesSource: "sales-vic", salesCount: null, rentalSource: null });
    expect(buildInvestmentFaq(vicNoRent)).toBeNull();
    expect(questions(vicNoRent)).not.toContain(Q);
    // No published median at all (Surfers Paradise: distrusted source, or too few sales).
    expect(buildInvestmentFaq(makeSuburb({ medianHousePrice: 0, annualGrowthHouse: 0 }))).toBeNull();
    expect(buildInvestmentFaq(makeSuburb({}, { salesSource: "sales-qld" }))).toBeNull();
    // A yield beyond the plausibility bound counts as unpublished, like the band.
    expect(buildInvestmentFaq(makeSuburb({ medianHousePrice: 100_000, annualGrowthHouse: 0 }))).toBeNull();
    // A change beyond the clamp, or the 0 the feeds store, with no rent source.
    expect(buildInvestmentFaq(makeSuburb({ annualGrowthHouse: 41.8 }, { rentalSource: null }))).toBeNull();
    expect(buildInvestmentFaq(makeSuburb({ annualGrowthHouse: 0 }, { rentalSource: null }))).toBeNull();
  });

  it("never prints a 0 as a figure", () => {
    for (const s of [makeSuburb(), makeSuburb({ annualGrowthHouse: 0 }), makeSuburb({}, { rentalSource: null })]) {
      const f = buildInvestmentFaq(s);
      if (f) expect(f.answer).not.toMatch(/\b0\.0%|\$0\b/);
    }
  });

  it("the median question's growth line follows the same measured-source rule", () => {
    const vic = makeSuburb({ annualGrowthHouse: 4 }, { salesSource: "sales-vic", salesCount: null });
    expect(answerTo(vic, "What is the median house price in Bondi?")).not.toMatch(/Annual growth/);
    expect(answerTo(makeSuburb(), "What is the median house price in Bondi?")).toContain("Annual growth is +13.9%.");
  });

  it("the price card above it reads the same rule, so the page cannot print +0.0% beside the answer", () => {
    // annualGrowthHouse is a number, so the card's old `!== null` check printed
    // "+0.0% over the past year" under every Land Victoria and ABS median
    // (Hawthorn and Toorak in production on 30 Sep 2026).
    const page = fs.readFileSync("src/app/(marketing)/suburbs/[slug]/page.tsx", "utf8");
    expect(page).toContain("const houseGrowth = publishedGrowthFor(suburb);");
    expect(page).toContain("{houseGrowth !== 0 && (");
    expect(page).not.toMatch(/annualGrowthHouse !== null/);
    expect(page).not.toMatch(/formatPercentage\(suburb\.stats\.annualGrowthHouse\)/);
  });

  it("reaches the on-page list and the FAQPage JSON-LD from the one list", () => {
    const html = renderToStaticMarkup(React.createElement(SuburbFAQ, { suburb: makeSuburb() }));
    const m = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/);
    expect(m).not.toBeNull();
    const ld = JSON.parse(m![1].replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, "&"));
    expect(ld["@type"]).toBe("FAQPage");
    const names = ld.mainEntity.map((q: { name: string }) => q.name);
    expect(names).toEqual(questions(makeSuburb()));
    expect(names[2]).toBe(Q);
    expect(html).toContain(`<dt class="font-display text-lg text-ink leading-snug mb-2">${Q}</dt>`);
    expect(ld.mainEntity[2].acceptedAnswer.text.endsWith(CAVEAT)).toBe(true);
  });
});
